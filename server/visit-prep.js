import crypto from 'node:crypto';
import { z } from 'zod';

const questionSchema = z.object({
  text: z.string().trim().min(1).max(300),
  category: z.enum(['labs', 'medicines', 'diagnosis', 'general']),
  reason: z.string().trim().max(500),
  sourceRef: z.string().max(120).nullable(),
});
const aiSchema = z.object({ questions: z.array(questionSchema).min(5).max(10) });
const sessionSchema = z.object({
  doctorName: z.string().trim().max(160).optional(),
  visitDate: z.string().date().nullable().optional(),
  reason: z.string().trim().max(500).optional(),
  notes: z.string().max(12000).optional(),
  symptoms: z.array(z.string().trim().min(1).max(120)).max(30).optional(),
}).strict();
const names = { en: 'English', hi: 'Hindi' };

function fallback(lang) {
  const hindi = [
    'क्या आप मेरी रिपोर्ट के परिणामों को आसान भाषा में समझा सकते हैं?',
    'क्या आप मेरी मौजूदा दवाओं और पर्चे पर लिखे निर्देशों की समीक्षा कर सकते हैं?',
    'क्या मेरी दर्ज स्वास्थ्य स्थितियों के लिए कोई नियमित जाँच पर चर्चा करनी चाहिए?',
    'मुझे कब दोबारा संपर्क करना चाहिए और किन लक्षणों पर जल्दी मदद लेनी चाहिए?',
  ];
  const english = [
    'Could you explain my recent results in plain language?',
    'Could you review my current medicines and confirm the instructions on my prescriptions?',
    'Are there routine checks I should discuss for my recorded health conditions?',
    'When should I follow up, and what symptoms should prompt earlier care?',
  ];
  return (lang === 'hi' ? hindi : english).map((text) => ({
    text, category: 'general', reason: lang === 'hi' ? 'आपकी मुलाकात के लिए सामान्य प्रश्न' : 'A general topic for your appointment.', sourceRef: null,
  }));
}

function reportReason(lab) {
  const date = new Date(`${lab.date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${lab.name} was ${lab.value} ${lab.unit}${date ? ` on ${date}` : ''}${lab.range ? ` (reference range ${lab.range})` : ''}.`;
}

function findWarnings(medicines) {
  const meds = medicines.map((m) => String(m.name || '').toLowerCase());
  const has = (pattern) => meds.some((name) => pattern.test(name));
  const warnings = [];
  if (has(/warfarin|coumadin|rivaroxaban|xarelto|apixaban|eliquis|dabigatran|pradaxa|clopidogrel/) && has(/ibuprofen|naproxen|aspirin|diclofenac/)) warnings.push('A blood thinner or antiplatelet and an NSAID/aspirin appear together. Ask a pharmacist or clinician to review bleeding risk.');
  if (has(/sildenafil|tadalafil|vardenafil|avanafil|viagra|cialis|levitra/) && has(/nitroglycerin|isosorbide|nitrate/)) warnings.push('An erectile dysfunction medicine and a nitrate appear together. Ask a clinician or pharmacist promptly to review this combination.');
  if (has(/lisinopril|enalapril|ramipril|losartan|valsartan|candesartan|telmisartan|olmesartan|spironolactone/) && has(/potassium chloride|kcl|potassium supplement|salt substitute/)) warnings.push('A medicine that can affect potassium and a potassium supplement or salt substitute appear together. Ask a pharmacist or clinician to review.');
  return warnings;
}

export function installVisitPrepRoutes(app, deps) {
  const { pool, requireAuth, asyncRoute, ownedProfile, decrypt, audit, generateGemini, geminiText } = deps;
  const sessionProjection = `id,visit_date,doctor_name,reason,notes,symptoms,source_fingerprint,generated_language,updated_at`;
  const questionProjection = `id,text,category,reason,source_ref,is_asked,sort_order,is_custom`;
  const serializeQuestions = (rows) => rows.map((q) => ({ id: q.id, text: q.text, category: q.category, reason: q.reason, sourceRef: q.source_ref, isAsked: q.is_asked, sortOrder: q.sort_order, isCustom: q.is_custom }));

  async function ensureSession(userId, profileId) {
    await pool.query(`INSERT INTO visit_prep_sessions(user_id,profile_id,visit_date)
      SELECT $1,$2,CURRENT_DATE FROM family_profiles WHERE id=$2 AND owner_id=$1
      ON CONFLICT(user_id,profile_id) DO NOTHING`, [userId, profileId]);
    const result = await pool.query(`SELECT ${sessionProjection} FROM visit_prep_sessions WHERE user_id=$1 AND profile_id=$2`, [userId, profileId]);
    return result.rows[0];
  }

  async function contextFor(userId, profileId) {
    const profile = await ownedProfile(userId, profileId);
    if (!profile) return null;
    const [docResult, stateResult, sessionResult] = await Promise.all([
      pool.query(`SELECT d.id,d.title,d.document_type,d.document_date,d.extracted_ciphertext,d.created_at
        FROM health_documents d JOIN family_profiles p ON p.id=d.profile_id
        WHERE p.owner_id=$1 AND p.id=$2 ORDER BY d.document_date DESC,d.created_at DESC`, [userId, profileId]),
      pool.query(`SELECT s.state_ciphertext,s.updated_at FROM profile_state s
        JOIN family_profiles p ON p.id=s.profile_id WHERE p.owner_id=$1 AND p.id=$2`, [userId, profileId]),
      pool.query(`SELECT ${sessionProjection} FROM visit_prep_sessions WHERE user_id=$1 AND profile_id=$2`, [userId, profileId]),
    ]);
    const state = stateResult.rowCount ? decrypt(stateResult.rows[0].state_ciphertext) : {};
    const docs = docResult.rows.map((row) => ({ ...row, ...decrypt(row.extracted_ciphertext) }));
    const labs = [];
    for (const doc of docs) {
      for (const [labIndex, value] of (doc.parsed?.values || []).entries()) {
        if (!value.abnormal) continue;
        const sourceLine = (doc.text || '').split(/\r?\n/).find((line) => line.toLowerCase().includes(String(value.name).toLowerCase()) && line.includes(String(value.value))) || '';
        let status = /\b(low|l)\b/i.test(sourceLine) ? 'Low' : /\b(high|h)\b/i.test(sourceLine) ? 'High' : 'Flagged';
        const rangeNumbers = String(value.range || '').match(/-?\d+(?:\.\d+)?/g) || [];
        const numericValue = Number(value.value);
        if (status === 'Flagged' && rangeNumbers.length >= 2) status = numericValue < Number(rangeNumbers[0]) ? 'Low' : numericValue > Number(rangeNumbers[1]) ? 'High' : 'Flagged';
        if (status === 'Flagged' && rangeNumbers.length && String(value.range).includes('<') && numericValue >= Number(rangeNumbers[0])) status = 'High';
        if (status === 'Flagged' && rangeNumbers.length && String(value.range).includes('>') && numericValue <= Number(rangeNumbers[0])) status = 'Low';
        labs.push({ id: doc.id, title: doc.title, name: value.name, value: value.value, unit: value.unit || '', range: value.range || '', date: String(doc.document_date).slice(0, 10), status, sourceRef: `${doc.id}#lab:${labIndex}` });
      }
    }
    const medicines = [...(state.meds || []).map((m) => ({ name: m.name, dosage: m.dosage || 'Directions not recorded', sourceRef: null }))];
    for (const doc of docs) for (const [medicineIndex, medicine] of (doc.parsed?.medicines || []).entries()) medicines.push({ name: medicine.name, dosage: medicine.dosage || 'Directions not recorded', sourceRef: `${doc.id}#med:${medicineIndex}` });
    const uniqueMedicineMap = new Map();
    for (const medicine of medicines.filter((m) => m.name)) {
      const key = medicine.name.toLowerCase();
      if (!uniqueMedicineMap.has(key) || (!uniqueMedicineMap.get(key).sourceRef && medicine.sourceRef)) uniqueMedicineMap.set(key, medicine);
    }
    const uniqueMedicines = [...uniqueMedicineMap.values()];
    const diagnoses = [...new Set(docs.flatMap((doc) => doc.parsed?.diagnoses || []).filter(Boolean))];
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify({ documents: docResult.rows.map((d) => [d.id, d.created_at]), stateFacts: { medicines: state.meds || [], allergies: state.allergies || [], conditions: state.chronicConditions || [] } })).digest('hex');
    return {
      profile, session: sessionResult.rows[0] || null, labs, medicines: uniqueMedicines, diagnoses,
      allergies: (state.allergies || []).filter(Boolean), conditions: (state.chronicConditions || []).filter(Boolean),
      interactionWarnings: findWarnings(uniqueMedicines), fingerprint, language: state.lang === 'hi' ? 'hi' : 'en', allowAI: !!state.allowExternalAI,
    };
  }

  app.get('/api/visit-prep/:profileId', requireAuth, asyncRoute(async (req, res) => {
    const ctx = await contextFor(req.user.id, req.params.profileId);
    if (!ctx) return res.status(404).json({ error: 'Profile not found.' });
    const session = ctx.session || await ensureSession(req.user.id, req.params.profileId);
    const [questions, savedSession] = await Promise.all([
      pool.query(`SELECT ${questionProjection} FROM visit_prep_questions WHERE user_id=$1 AND profile_id=$2 ORDER BY sort_order,created_at`, [req.user.id, req.params.profileId]),
      pool.query(`SELECT ${sessionProjection} FROM visit_prep_sessions WHERE user_id=$1 AND profile_id=$2`, [req.user.id, req.params.profileId]),
    ]);
    const current = savedSession.rows[0] || session;
    res.json({
      session: { id: current.id, visitDate: current.visit_date, doctorName: current.doctor_name, reason: current.reason, notes: current.notes, symptoms: current.symptoms || [], sourceFingerprint: current.source_fingerprint, generatedLanguage: current.generated_language, updatedAt: current.updated_at },
      questions: serializeQuestions(questions.rows),
      context: { labs: ctx.labs, medicines: ctx.medicines, diagnoses: ctx.diagnoses, allergies: ctx.allergies, conditions: ctx.conditions, interactionWarnings: ctx.interactionWarnings, fingerprint: ctx.fingerprint, language: ctx.language },
    });
  }));

  app.post('/api/visit-prep/generate', requireAuth, asyncRoute(async (req, res) => {
    const body = z.object({ profileId: z.string().uuid(), reason: z.string().trim().max(500).optional(), language: z.enum(['en', 'hi']).optional(), regenerate: z.boolean().default(false) }).parse(req.body);
    const ctx = await contextFor(req.user.id, body.profileId);
    if (!ctx) return res.status(404).json({ error: 'Profile not found.' });
    const session = ctx.session || await ensureSession(req.user.id, body.profileId);
    const language = body.language || ctx.language;
    const existing = await pool.query(`SELECT ${questionProjection} FROM visit_prep_questions WHERE user_id=$1 AND profile_id=$2 ORDER BY sort_order,created_at`, [req.user.id, body.profileId]);
    if (!body.regenerate && existing.rowCount && session.source_fingerprint === ctx.fingerprint && session.generated_language === language) return res.json({ questions: serializeQuestions(existing.rows), cached: true });

    const sources = new Map();
    ctx.labs.forEach((lab) => sources.set(lab.sourceRef, reportReason(lab)));
    ctx.medicines.forEach((medicine) => { if (medicine.sourceRef) sources.set(medicine.sourceRef, `Your record lists ${medicine.name}${medicine.dosage ? ` with directions: ${medicine.dosage}` : ''}.`); });
    ctx.diagnoses.forEach((diagnosis) => sources.set(`diagnosis:${diagnosis}`, `Your records list ${diagnosis}.`));
    const facts = {
      visitReason: body.reason ?? session.reason ?? '',
      abnormalLabs: ctx.labs.map(({ name, value, unit, range, date, status, sourceRef }) => ({ name, value, unit, referenceRange: range, date, status, sourceRef })),
      currentMedicines: ctx.medicines,
      diagnoses: ctx.diagnoses, chronicConditions: ctx.conditions, allergies: ctx.allergies,
      drugInteractionWarnings: ctx.interactionWarnings,
    };
    let generated;
    const medicalKey = process.env.GEMINI_MEDICAL_API_KEY || process.env.GEMINI_API_KEY || '';
    if (ctx.allowAI && process.env.ENABLE_EXTERNAL_AI === 'true' && medicalKey) {
      const prompt = `Write 5 to 10 distinct, short questions a patient can ask their clinician in ${names[language]}. Return JSON only with shape {"questions":[{"text":"...","category":"labs|medicines|diagnosis|general","reason":"...","sourceRef":null}]}. Use plain language. Never diagnose or give dosage advice. For a question about a stored fact, sourceRef must exactly match that fact's sourceRef. Use null for general questions. Do not invent or change any values. The reason for source-linked questions will be replaced with a sentence assembled from verified stored facts. Structured facts: ${JSON.stringify(facts)}`;
      for (let attempt = 0; attempt < 2 && !generated; attempt++) {
        try {
          const response = await generateGemini({ key: medicalKey, model: process.env.GEMINI_MEDICAL_MODEL || 'gemini-3.8-flash', systemInstruction: 'You are an appointment-preparation assistant. You do not diagnose, prescribe or give dosage advice. Use only supplied structured facts. Return the requested JSON object.', contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 1000 } });
          const raw = geminiText(response).replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
          const parsed = aiSchema.parse(JSON.parse(raw));
          const seen = new Set();
          generated = parsed.questions.filter((q) => {
            const key = q.text.toLocaleLowerCase();
            if (seen.has(key) || (q.sourceRef && !sources.has(q.sourceRef))) return false;
            seen.add(key); return true;
          }).map((q) => ({ ...q, reason: q.sourceRef ? sources.get(q.sourceRef) : (language === 'hi' ? 'आपकी मुलाकात के लिए सामान्य प्रश्न' : 'A general question for your visit.'), sourceRef: q.sourceRef || null }));
          if (generated.length < 5) generated = null;
        } catch { generated = null; }
      }
    }
    if (!generated) generated = fallback(language);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM visit_prep_questions WHERE user_id=$1 AND profile_id=$2 AND is_custom=false', [req.user.id, body.profileId]);
      for (let i = 0; i < generated.length; i++) {
        const q = questionSchema.parse(generated[i]);
        await client.query(`INSERT INTO visit_prep_questions(user_id,profile_id,text,category,reason,source_ref,is_asked,sort_order,is_custom) VALUES($1,$2,$3,$4,$5,$6,false,$7,false)`, [req.user.id, body.profileId, q.text, q.category, q.reason, q.sourceRef, i]);
      }
      await client.query(`UPDATE visit_prep_sessions SET reason=COALESCE($3,reason),source_fingerprint=$4,generated_language=$5,updated_at=now() WHERE user_id=$1 AND profile_id=$2`, [req.user.id, body.profileId, body.reason ?? null, ctx.fingerprint, language]);
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
    await audit(req.user.id, body.profileId, 'visit_prep.generate');
    const questions = await pool.query(`SELECT ${questionProjection} FROM visit_prep_questions WHERE user_id=$1 AND profile_id=$2 ORDER BY sort_order,created_at`, [req.user.id, body.profileId]);
    res.json({ questions: serializeQuestions(questions.rows), cached: false });
  }));

  app.patch('/api/visit-prep/:profileId/session', requireAuth, asyncRoute(async (req, res) => {
    const body = sessionSchema.parse(req.body);
    const current = await pool.query(`SELECT id FROM visit_prep_sessions WHERE user_id=$1 AND profile_id=$2`, [req.user.id, req.params.profileId]);
    if (!current.rowCount) return res.status(404).json({ error: 'Visit preparation session not found.' });
    const result = await pool.query(`UPDATE visit_prep_sessions SET doctor_name=COALESCE($3,doctor_name),visit_date=CASE WHEN $8 THEN $4 ELSE visit_date END,reason=COALESCE($5,reason),notes=COALESCE($6,notes),symptoms=COALESCE($7::jsonb,symptoms),updated_at=now() WHERE user_id=$1 AND profile_id=$2 RETURNING ${sessionProjection}`,
      [req.user.id, req.params.profileId, body.doctorName ?? null, body.visitDate ?? null, body.reason ?? null, body.notes ?? null, body.symptoms === undefined ? null : JSON.stringify(body.symptoms), body.visitDate !== undefined]);
    res.json({ session: result.rows[0] });
  }));

  app.post('/api/visit-prep/:profileId/questions', requireAuth, asyncRoute(async (req, res) => {
    if (!await ownedProfile(req.user.id, req.params.profileId)) return res.status(404).json({ error: 'Profile not found.' });
    const body = z.object({ text: z.string().trim().min(1).max(300) }).parse(req.body);
    const result = await pool.query(`INSERT INTO visit_prep_questions(user_id,profile_id,text,category,reason,is_custom,sort_order)
      SELECT $1,$2,$3,'general','Added by you.',true,COALESCE((SELECT max(sort_order)+1 FROM visit_prep_questions WHERE user_id=$1 AND profile_id=$2),0)
      FROM family_profiles WHERE id=$2 AND owner_id=$1 RETURNING ${questionProjection}`, [req.user.id, req.params.profileId, body.text]);
    res.status(201).json({ question: serializeQuestions(result.rows)[0] });
  }));

  app.patch('/api/visit-prep/:profileId/questions/:questionId', requireAuth, asyncRoute(async (req, res) => {
    const body = z.object({ text: z.string().trim().min(1).max(300).optional(), isAsked: z.boolean().optional(), sortOrder: z.number().int().min(0).max(1000).optional() }).strict().parse(req.body);
    const columns = { text: 'text', isAsked: 'is_asked', sortOrder: 'sort_order' };
    const values = [req.user.id, req.params.profileId, req.params.questionId];
    const sets = [];
    for (const [key, column] of Object.entries(columns)) if (body[key] !== undefined) { values.push(body[key]); sets.push(`${column}=$${values.length}`); }
    if (!sets.length) return res.status(400).json({ error: 'No question changes provided.' });
    sets.push('updated_at=now()');
    const result = await pool.query(`UPDATE visit_prep_questions q SET ${sets.join(',')} FROM family_profiles p WHERE q.id=$3 AND q.user_id=$1 AND q.profile_id=$2 AND p.id=q.profile_id AND p.owner_id=$1 RETURNING q.${questionProjection.split(',').join(',q.')}`, values);
    if (!result.rowCount) return res.status(404).json({ error: 'Question not found.' });
    res.json({ question: serializeQuestions(result.rows)[0] });
  }));

  app.delete('/api/visit-prep/:profileId/questions/:questionId', requireAuth, asyncRoute(async (req, res) => {
    const result = await pool.query(`DELETE FROM visit_prep_questions q USING family_profiles p WHERE q.id=$3 AND q.user_id=$1 AND q.profile_id=$2 AND p.id=q.profile_id AND p.owner_id=$1 RETURNING q.${questionProjection.split(',').join(',q.')}`, [req.user.id, req.params.profileId, req.params.questionId]);
    if (!result.rowCount) return res.status(404).json({ error: 'Question not found.' });
    res.json({ question: serializeQuestions(result.rows)[0] });
  }));

  app.post('/api/visit-prep/:profileId/questions/restore', requireAuth, asyncRoute(async (req, res) => {
    if (!await ownedProfile(req.user.id, req.params.profileId)) return res.status(404).json({ error: 'Profile not found.' });
    const body = questionSchema.extend({ id: z.string().uuid(), isAsked: z.boolean(), sortOrder: z.number().int().min(0).max(1000), isCustom: z.boolean() }).parse(req.body);
    const result = await pool.query(`INSERT INTO visit_prep_questions(id,user_id,profile_id,text,category,reason,source_ref,is_asked,sort_order,is_custom)
      SELECT $3,$1,$2,$4,$5,$6,$7,$8,$9,$10 FROM family_profiles WHERE id=$2 AND owner_id=$1
      ON CONFLICT(id) DO NOTHING RETURNING ${questionProjection}`,
      [req.user.id, req.params.profileId, body.id, body.text, body.category, body.reason, body.sourceRef, body.isAsked, body.sortOrder, body.isCustom]);
    if (!result.rowCount) return res.status(409).json({ error: 'Could not restore this question.' });
    res.json({ question: serializeQuestions(result.rows)[0] });
  }));

  app.put('/api/visit-prep/:profileId/questions/order', requireAuth, asyncRoute(async (req, res) => {
    const { ids } = z.object({ ids: z.array(z.string().uuid()).max(100) }).parse(req.body);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (let i = 0; i < ids.length; i++) await client.query(`UPDATE visit_prep_questions q SET sort_order=$4,updated_at=now() FROM family_profiles p WHERE q.id=$3 AND q.user_id=$1 AND q.profile_id=$2 AND p.id=q.profile_id AND p.owner_id=$1`, [req.user.id, req.params.profileId, ids[i], i]);
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
    const result = await pool.query(`SELECT ${questionProjection} FROM visit_prep_questions WHERE user_id=$1 AND profile_id=$2 ORDER BY sort_order,created_at`, [req.user.id, req.params.profileId]);
    res.json({ questions: serializeQuestions(result.rows) });
  }));
}
