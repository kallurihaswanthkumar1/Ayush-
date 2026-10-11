import webpush from 'web-push';
import { z } from 'zod';

const subscriptionSchema = z.object({
  endpoint: z.string().url().max(2000),
  keys: z.object({ p256dh: z.string().min(20).max(256), auth: z.string().min(8).max(128) }),
});
const reminderSchema = z.object({
  name: z.string().trim().min(1).max(160),
  directions: z.string().trim().max(500).default(''),
  frequency: z.string().trim().min(1).max(80).default('As prescribed'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  timezone: z.string().trim().min(1).max(100).default('Asia/Kolkata'),
});

export function installPushRoutes(app, { pool, requireAuth, asyncRoute, ownedProfile }) {
  const publicKey = process.env.VAPID_PUBLIC_KEY || '';
  const privateKey = process.env.VAPID_PRIVATE_KEY || '';
  const configured = Boolean(publicKey && privateKey);
  if (configured) webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:support@healthcopilot.local', publicKey, privateKey);

  app.get('/api/push/public-key', requireAuth, asyncRoute(async (req, res) => {
    const profileId = z.string().uuid().parse(req.query.profileId);
    if (!await ownedProfile(req.user.id, profileId)) return res.status(404).json({ error: 'Profile not found.' });
    if (!configured) return res.status(503).json({ error: 'Push notifications are not configured on this server. Set the VAPID environment keys and restart it.' });
    res.json({ publicKey });
  }));

  app.post('/api/push/subscribe', requireAuth, asyncRoute(async (req, res) => {
    const body = z.object({ profileId: z.string().uuid(), subscription: subscriptionSchema }).parse(req.body);
    if (!configured) return res.status(503).json({ error: 'Push notifications are not configured on this server.' });
    if (!await ownedProfile(req.user.id, body.profileId)) return res.status(404).json({ error: 'Profile not found.' });
    const subscription = body.subscription;
    await pool.query(`INSERT INTO push_subscriptions(user_id,profile_id,endpoint,p256dh,auth)
      VALUES($1,$2,$3,$4,$5) ON CONFLICT(user_id,profile_id,endpoint)
      DO UPDATE SET p256dh=EXCLUDED.p256dh,auth=EXCLUDED.auth,updated_at=now()`,
    [req.user.id, body.profileId, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth]);
    res.status(201).json({ ok: true });
  }));

  app.get('/api/push/status', requireAuth, asyncRoute(async (req, res) => {
    const profileId = z.string().uuid().parse(req.query.profileId);
    const endpoint = z.string().url().max(2000).parse(req.query.endpoint);
    if (!await ownedProfile(req.user.id, profileId)) return res.status(404).json({ error: 'Profile not found.' });
    const result = await pool.query('SELECT 1 FROM push_subscriptions WHERE user_id=$1 AND profile_id=$2 AND endpoint=$3', [req.user.id, profileId, endpoint]);
    res.json({ subscribed: !!result.rowCount });
  }));

  app.delete('/api/push/subscribe', requireAuth, asyncRoute(async (req, res) => {
    const body = z.object({ profileId: z.string().uuid(), endpoint: z.string().url().max(2000).optional() }).parse(req.body);
    await pool.query(`DELETE FROM push_subscriptions WHERE user_id=$1 AND profile_id=$2 AND ($3::text IS NULL OR endpoint=$3)`, [req.user.id, body.profileId, body.endpoint || null]);
    res.json({ ok: true });
  }));

  app.get('/api/profiles/:profileId/reminders', requireAuth, asyncRoute(async (req, res) => {
    if (!await ownedProfile(req.user.id, req.params.profileId)) return res.status(404).json({ error: 'Profile not found.' });
    const result = await pool.query(`SELECT r.id,r.medicine_name,r.directions,r.frequency,to_char(r.reminder_time,'HH24:MI') AS time,r.timezone,r.enabled
      FROM medicine_reminders r JOIN family_profiles p ON p.id=r.profile_id
      WHERE p.owner_id=$1 AND p.id=$2 ORDER BY r.reminder_time,r.created_at`, [req.user.id, req.params.profileId]);
    res.json({ reminders: result.rows.map((r) => ({ id: r.id, name: r.medicine_name, dose: r.directions, frequency: r.frequency, time: r.time, timezone: r.timezone, enabled: r.enabled })) });
  }));

  app.post('/api/profiles/:profileId/reminders', requireAuth, asyncRoute(async (req, res) => {
    if (!await ownedProfile(req.user.id, req.params.profileId)) return res.status(404).json({ error: 'Profile not found.' });
    const body = reminderSchema.parse(req.body);
    try { new Intl.DateTimeFormat('en', { timeZone: body.timezone }); }
    catch { return res.status(400).json({ error: 'Choose a valid time zone.' }); }
    const result = await pool.query(`INSERT INTO medicine_reminders(profile_id,medicine_name,directions,frequency,reminder_time,timezone)
      SELECT p.id,$3,$4,$5,$6,$7 FROM family_profiles p WHERE p.id=$1 AND p.owner_id=$2
      RETURNING id,medicine_name,directions,frequency,to_char(reminder_time,'HH24:MI') AS time,timezone,enabled`,
    [req.params.profileId, req.user.id, body.name, body.directions, body.frequency, body.time, body.timezone]);
    if (!result.rowCount) return res.status(404).json({ error: 'Profile not found.' });
    res.status(201).json({ reminder: { id: result.rows[0].id, name: result.rows[0].medicine_name, dose: result.rows[0].directions, frequency: result.rows[0].frequency, time: result.rows[0].time, timezone: result.rows[0].timezone, enabled: result.rows[0].enabled } });
  }));

  app.delete('/api/profiles/:profileId/reminders/:reminderId', requireAuth, asyncRoute(async (req, res) => {
    const result = await pool.query(`DELETE FROM medicine_reminders r USING family_profiles p
      WHERE r.id=$3 AND r.profile_id=$2 AND p.id=r.profile_id AND p.owner_id=$1 RETURNING r.id`, [req.user.id, req.params.profileId, req.params.reminderId]);
    if (!result.rowCount) return res.status(404).json({ error: 'Reminder not found.' });
    res.json({ ok: true });
  }));

  if (!configured) return;
  let checking = false;
  const sendDue = async () => {
    if (checking) return;
    checking = true;
    try {
      const due = await pool.query(`SELECT r.id,r.profile_id,p.owner_id,r.reminder_time,r.timezone
        FROM medicine_reminders r JOIN family_profiles p ON p.id=r.profile_id
        WHERE r.enabled=true
          AND to_char(now() AT TIME ZONE r.timezone,'HH24:MI')=to_char(r.reminder_time,'HH24:MI')
          AND (r.last_triggered_at IS NULL OR (r.last_triggered_at AT TIME ZONE r.timezone)::date < (now() AT TIME ZONE r.timezone)::date)
        LIMIT 100`);
      for (const reminder of due.rows) {
        const claimed = await pool.query(`UPDATE medicine_reminders SET last_triggered_at=now()
          WHERE id=$1 AND profile_id=$2 AND enabled=true
            AND (last_triggered_at IS NULL OR (last_triggered_at AT TIME ZONE timezone)::date < (now() AT TIME ZONE timezone)::date)
          RETURNING id`, [reminder.id, reminder.profile_id]);
        if (!claimed.rowCount) continue;
        const subscriptions = await pool.query(`SELECT endpoint,p256dh,auth FROM push_subscriptions
          WHERE user_id=$1 AND profile_id=$2`, [reminder.owner_id, reminder.profile_id]);
        const payload = JSON.stringify({ title: 'HealthCopilot reminder', body: 'It’s time for a medicine reminder. Open HealthCopilot to view the details.', tag: `medicine-${reminder.id}`, url: '/' });
        for (const row of subscriptions.rows) {
          try { await webpush.sendNotification({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } }, payload, { TTL: 300 }); }
          catch (error) {
            if (error.statusCode === 404 || error.statusCode === 410) await pool.query('DELETE FROM push_subscriptions WHERE user_id=$1 AND profile_id=$2 AND endpoint=$3', [reminder.owner_id, reminder.profile_id, row.endpoint]);
            else console.error('Push delivery failed:', error.statusCode || error.name || 'error');
          }
        }
      }
    } catch (error) { console.error('Reminder push scheduler failed:', error.message); }
    finally { checking = false; }
  };
  setInterval(sendDue, 20000);
  sendDue();
}
