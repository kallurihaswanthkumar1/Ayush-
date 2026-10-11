const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M12 5v14M5 12h14"/></svg>';

function localDate(timezone) {
    try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone || 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
        const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
        return `${values.year}-${values.month}-${values.day}`;
    } catch {
        return new Date().toISOString().slice(0, 10);
    }
}

export function renderReminders(data, profileId, pushEnabled, permission, doseLogs = []) {
    const ready = Boolean(data && data.profileId === profileId);
    const reminders = ready ? data.reminders : [];
    const rows = reminders.map((reminder) => {
        const date = localDate(reminder.timezone);
        const log = doseLogs.find((entry) => entry.reminderId === reminder.id && entry.date === date);
        const status = log ? (log.status === 'taken' ? 'Taken today' : 'Marked missed today') : 'Not recorded today';
        return `<div class="dose-entry"><div class="docicon">${plus}</div><div class="docbody"><b>${esc(reminder.name)}</b><span>${esc(reminder.dose || 'Follow prescriber instructions')} · ${esc(reminder.frequency)} · ${esc(reminder.timezone || 'Asia/Kolkata')}</span><span class="tag ${log ? (log.status === 'taken' ? 'dose-taken' : 'warn') : ''}">${status}</span></div><span class="reminder-time">${esc(reminder.time)}</span><div class="dose-actions"><button class="button small" type="button" data-dose-log data-reminder-id="${esc(reminder.id)}" data-dose-date="${date}" data-dose-status="taken" aria-pressed="${log && log.status === 'taken'}">Taken</button><button class="button small" type="button" data-dose-log data-reminder-id="${esc(reminder.id)}" data-dose-date="${date}" data-dose-status="missed" aria-pressed="${log && log.status === 'missed'}">Missed</button></div><button class="delete-btn" data-rem-delete="${esc(reminder.id)}">Remove</button></div>`;
    }).join('');
    return `<div class="card"><div class="cardhead"><div><div class="cardtitle">Notifications on this device</div><div class="cardhint">Enable push to receive reminders in your system notification panel, including when this page is closed.</div></div><button class="button" data-push-toggle>${pushEnabled ? 'Disable notifications' : 'Enable push notifications'}</button></div><div class="cardhint">${pushEnabled ? 'This device is subscribed to this profile’s reminders.' : `Browser notification permission: ${esc(permission || 'not available')}`}</div></div><div class="card"><div class="cardtitle" style="margin-bottom:4px">Your reminders</div><div class="cardhint" style="margin-bottom:12px">Reminders are saved per family profile and scheduled in its selected time zone. Dose marks are private to this profile.</div>${!ready ? '<div class="empty">Loading reminders…</div>' : rows || '<div class="empty">No reminders set for this profile. Add one for a medicine prescribed to you.</div>'}<div class="advisory">Only mark what happened. A missed-dose entry is a record, not advice to take an extra dose. Follow your prescription or ask your pharmacist.</div></div><div class="card"><div class="cardtitle">About interactions</div><div class="insight"><b>Interaction information is limited</b><p>This checker covers a few known patterns only. It cannot confirm that a combination is safe. Ask your pharmacist or clinician to review every medicine, supplement, and dose.</p></div><button class="button small" data-action="interaction">Check a combination</button></div>`;
}

function makeModal(title, subtitle, content, submit, onSave) {
  const wrap = document.createElement('div'); wrap.className = 'modal-back';
  wrap.innerHTML = `<div class="modal"><h2>${title}</h2><p>${subtitle}</p>${content}<div class="modalfoot"><button class="button" data-cancel>Cancel</button><button class="button primary" data-submit>${submit}</button></div></div>`;
  document.body.append(wrap);
  wrap.onclick = (event) => { if (event.target === wrap || event.target.closest('[data-cancel]')) wrap.remove(); };
  wrap.querySelector('[data-submit]').onclick = () => onSave(wrap);
  return wrap;
}

export function openReminderEditor({ profileId, medicines, api, toast, onSaved }) {
  const options = medicines.map((name) => `<option value="${esc(name)}">`).join('');
  makeModal('Add a medicine reminder', 'Schedule a medicine routine already recommended by your clinician.', `<div class="formrow"><label>Medicine</label><input class="field" id="remName" maxlength="160" placeholder="Medicine name" list="remMeds"><datalist id="remMeds">${options}</datalist></div><div class="formrow"><label>Directions (optional)</label><input class="field" id="remDose" maxlength="500" placeholder="Use the directions from the prescription"></div><div class="formrow"><label>Daily reminder time</label><input type="time" class="field" id="remTime" value="09:00"></div><div class="advisory">This reminder sends one alert per day at the selected time. Add another reminder for each additional prescribed time. Follow your prescription; do not change a dose based on an alert.</div>`, 'Set reminder', async (wrap) => {
    const name = wrap.querySelector('#remName').value.trim();
    if (!name) return toast('Enter a medicine name.');
    const button = wrap.querySelector('[data-submit]'); button.disabled = true;
    try {
      const response = await api(`/api/profiles/${profileId}/reminders`, { method: 'POST', body: JSON.stringify({ name, directions: wrap.querySelector('#remDose').value.trim(), frequency: 'Once daily', time: wrap.querySelector('#remTime').value, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata' }) });
      wrap.remove(); onSaved(response.reminder); toast('Reminder saved for this health profile.');
    } catch (error) { button.disabled = false; toast(`Reminder was not saved: ${error.message}`); }
  });
}

function decodeKey(value) {
  const padded = `${value}${'='.repeat((4 - value.length % 4) % 4)}`;
  const raw = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export async function togglePush({ profileId, api, toast, onEnabled }) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return toast('Push notifications are not supported in this browser. Try the installed Chrome or Edge browser over HTTPS or localhost.');
  try {
    let permission = Notification.permission;
    if (permission === 'default') permission = await Notification.requestPermission();
    if (permission !== 'granted') return toast('Allow notifications in your browser settings to receive reminders.');
    const registration = await navigator.serviceWorker.register('/sw.js');
    const existing = await registration.pushManager.getSubscription();
    const { publicKey } = await api(`/api/push/public-key?profileId=${encodeURIComponent(profileId)}`);
    const subscription = existing || await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(publicKey) });
    await api('/api/push/subscribe', { method: 'POST', body: JSON.stringify({ profileId, subscription: subscription.toJSON() }) });
    onEnabled(true); toast('Push notifications enabled for this profile on this device.');
  } catch (error) { toast(`Push notifications could not be enabled: ${error.message}`); }
}

export async function pushStatus(profileId, api) {
  try {
    const registration = await navigator.serviceWorker?.getRegistration('/');
    const subscription = await registration?.pushManager?.getSubscription();
    if (!subscription) return false;
    const result = await api(`/api/push/status?profileId=${encodeURIComponent(profileId)}&endpoint=${encodeURIComponent(subscription.endpoint)}`);
    return !!result.subscribed;
  } catch { return false; }
}

export function bindReminders(root, handlers) {
  root?.querySelector('[data-push-toggle]')?.addEventListener('click', async () => {
    if (handlers.pushEnabled) {
      try { const registration = await navigator.serviceWorker?.getRegistration('/'); const subscription = await registration?.pushManager?.getSubscription(); if (subscription) await handlers.api('/api/push/subscribe', { method: 'DELETE', body: JSON.stringify({ profileId: handlers.profileId, endpoint: subscription.endpoint }) }); handlers.onPushEnabled(false); handlers.toast('Push notifications disabled for this profile on this device.'); }
      catch (error) { handlers.toast(`Push notifications could not be disabled: ${error.message}`); }
    } else await togglePush({ ...handlers, onEnabled: handlers.onPushEnabled });
  });
  root?.querySelectorAll('[data-rem-delete]').forEach((button) => button.addEventListener('click', async () => {
    button.disabled = true;
    try { await handlers.api(`/api/profiles/${handlers.profileId}/reminders/${button.dataset.remDelete}`, { method: 'DELETE' }); handlers.onDelete(button.dataset.remDelete); handlers.toast('Reminder removed.'); }
    catch (error) { button.disabled = false; handlers.toast(`Reminder was not removed: ${error.message}`); }
  }));
}