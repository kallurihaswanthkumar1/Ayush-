const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v18M3 12h18"/></svg>';

export function renderVisitPrep(data, language = 'en') {
  if (!data) return '<div class="card"><div class="empty">Loading this profile’s visit preparation…</div></div>';
  const { questions = [], session = {}, context = {} } = data;
  const fmt = (date) => date ? new Date(`${String(date).slice(0, 10)}T12:00:00`).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date not recorded';
  const asked = questions.filter((q) => q.isAsked).length;
  const ctxItems = [
    ...(context.labs || []).map((x) => ({ id: x.sourceRef, type: 'lab', title: x.name, detail: `${x.value} ${x.unit} · ${x.range || 'Reference range not recorded'} · ${fmt(x.date)}`, badge: x.status || 'Flagged', doc: x.id })),
    ...(context.medicines || []).map((x) => ({ id: x.sourceRef, type: 'medicine', title: x.name, detail: x.dosage })),
    ...(context.diagnoses || []).map((x) => ({ id: `diagnosis:${x}`, type: 'diagnosis', title: x, detail: 'Recorded in this profile' })),
    ...(context.conditions || []).map((x) => ({ id: null, type: 'diagnosis', title: x, detail: 'Profile condition' })),
    ...(context.allergies || []).map((x) => ({ id: null, type: 'allergy', title: x, detail: 'Profile allergy' })),
    ...(context.interactionWarnings || []).map((x) => ({ id: 'interaction', type: 'warning', title: 'Interaction information', detail: x, badge: 'Review' })),
  ];
  const empty = !ctxItems.length;
  const contextHtml = empty ? `<div class="empty">No health details are recorded in this profile yet. Add a verified condition or allergy in Health Profile, or upload a document to build visit context.<br><button class="button small" data-prep-upload>Upload a document</button></div>` : ctxItems.map((x) => `<div class="prep-context-item" data-context-id="${esc(x.id || '')}" ${x.doc ? `data-context-doc="${esc(x.doc)}"` : ''}>${x.doc ? `<button class="prep-context-link" type="button" data-context-doc-open="${esc(x.doc)}">` : '<div>'}<b>${esc(x.title)}</b><span>${esc(x.detail)}</span>${x.badge ? `<i class="tag ${x.badge === 'High' || x.badge === 'Low' || x.badge === 'Review' ? 'warn' : ''}">${esc(x.badge)}</i>` : ''}${x.doc ? '</button>' : '</div>'}</div>`).join('');
  const questionHtml = questions.map((q, i) => `<article class="prep-question" draggable="true" data-question-id="${esc(q.id)}" data-source-ref="${esc(q.sourceRef || '')}" tabindex="0"><div class="prep-order"><span>${i + 1}</span><button type="button" aria-label="Move question up" data-q-up="${esc(q.id)}" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" aria-label="Move question down" data-q-down="${esc(q.id)}" ${i === questions.length - 1 ? 'disabled' : ''}>↓</button></div><label class="prep-asked"><input type="checkbox" data-q-asked="${esc(q.id)}" ${q.isAsked ? 'checked' : ''} aria-label="Mark asked"><span></span></label><div class="prep-qbody"><div class="prep-qtext ${q.isAsked ? 'asked' : ''}" data-q-text="${esc(q.id)}">${esc(q.text)}</div><div class="prep-reason">${esc(q.reason || 'General question for your appointment.')}</div><div class="prep-edit" data-q-edit-area="${esc(q.id)}" hidden><input class="field" maxlength="300" value="${esc(q.text)}" aria-label="Edit question"><button class="button small" data-q-save="${esc(q.id)}">Save</button><button class="button small" data-q-cancel="${esc(q.id)}">Cancel</button></div><div class="prep-qactions"><button class="button small" data-q-speak="${esc(q.id)}">Speak</button><button class="text-button" data-q-edit="${esc(q.id)}">Edit</button><button class="text-button delete-btn" data-q-delete="${esc(q.id)}">Delete</button></div></div></article>`).join('');
  return `<div class="prep-layout"><section class="card prep-main"><div class="cardhead"><div><div class="cardtitle">Questions to ask your clinician</div><div class="cardhint">Personalized from this profile’s records. Review each detail with your care team.</div></div><b class="prep-count" id="prepCount">${asked} of ${questions.length} asked</b></div><div class="prep-details"><label>Clinician<input class="field" maxlength="160" data-session="doctorName" value="${esc(session.doctorName || '')}" placeholder="Name (optional)"></label><label>Visit date<input class="field" type="date" data-session="visitDate" value="${esc(String(session.visitDate || '').slice(0, 10))}"></label><label class="prep-reason-field">Reason for visit<input class="field" maxlength="500" data-session="reason" value="${esc(session.reason || '')}" placeholder="What would you like to discuss?"></label></div><div class="prep-tools"><button class="button small" data-prep-regenerate>Regenerate questions</button><button class="button small" data-prep-speak-all>Speak all unanswered</button><button class="button small" data-prep-speech-action="pause" hidden>Pause</button><button class="button small" data-prep-speech-action="resume" hidden>Resume</button><button class="button small" data-prep-speech-action="stop" hidden>Stop</button><span class="prep-progress" aria-live="polite" data-prep-progress></span><button class="button small" data-prep-print>Print visit sheet</button></div><div class="prep-list" data-prep-list>${questionHtml || '<div class="empty">Preparing questions…</div>'}</div><div class="prep-add"><input class="field" maxlength="300" data-prep-new-question placeholder="Add a question for your clinician (up to 300 characters)"><button class="button primary" data-prep-add>${icon} Add question</button></div><div class="prep-symptoms"><label>Symptoms to mention</label><div class="prep-chips">${(session.symptoms || []).map((x, i) => `<span class="prep-chip">${esc(x)}<button aria-label="Remove ${esc(x)}" data-symptom-remove="${i}">×</button></span>`).join('')}</div><div class="prep-add"><input class="field" maxlength="120" data-prep-symptom placeholder="Add a symptom to mention"><button class="button small" data-prep-add-symptom>Add symptom</button></div></div><label class="prep-notes-label">Doctor’s answers / notes<textarea class="field" rows="5" maxlength="12000" data-session="notes" placeholder="Write down what your clinician says…">${esc(session.notes || '')}</textarea></label><span class="prep-save-state" aria-live="polite" data-prep-save-state>Saved</span><div class="advisory prep-disclaimer">These questions organize information for your appointment. They are not a diagnosis or treatment plan. Confirm all extracted facts against the original reports.</div></section><aside class="card prep-context"><div class="cardtitle">Helpful context for this profile</div><div class="cardhint">Select a flagged result to open its source document. Hover or focus a question to highlight related information.</div><div class="prep-context-list">${contextHtml}</div></aside></div>`;
}

export function bindVisitPrep(root, { data, profileId, api, toast, onData: reportData, onUpload, onOpenDocument }) {
  if (!data || data.profileId !== profileId) return;
  const update = (next, render = true) => { data = next; reportData(next, render); };
  let sessionTimer; let speechQueue = []; let speechIndex = -1; let speechMode = 'idle'; let activeQuestion = null;
  const speakButtons = () => root.querySelectorAll('[data-q-speak]');
  const stopSpeech = () => { window.speechSynthesis?.cancel(); speechQueue = []; speechIndex = -1; speechMode = 'idle'; speakButtons().forEach((b) => { b.textContent = 'Speak'; }); root.querySelector('[data-prep-progress]').textContent = ''; root.querySelectorAll('[data-prep-speech-action]').forEach((b) => { b.hidden = true; }); };
  const voice = () => {
    const lang = data.language === 'hi' ? 'hi-IN' : 'en-IN';
    const voices = window.speechSynthesis?.getVoices?.() || [];
    return voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
  };
  const say = (text, onEnd) => {
    const selected = voice();
    if (!selected) { toast(`No ${data.language === 'hi' ? 'Hindi' : 'English (India)'} voice is installed. Add that voice in your device’s speech settings.`); stopSpeech(); return false; }
    const utterance = new SpeechSynthesisUtterance(`${text} This is for discussion with your clinician, not a diagnosis or treatment plan.`);
    utterance.voice = selected; utterance.lang = selected.lang; utterance.onend = () => onEnd?.(); utterance.onerror = () => { toast('Speech playback failed. Check your device’s speech settings.'); stopSpeech(); };
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); return true;
  };
  const speakNext = () => {
    if (speechIndex >= speechQueue.length - 1) { stopSpeech(); return; }
    speechIndex++; const q = speechQueue[speechIndex];
    root.querySelector('[data-prep-progress]').textContent = `Speaking ${speechIndex + 1} of ${speechQueue.length}`;
    if (!say(`${speechIndex + 1}. ${q.text}`, speakNext)) return;
  };
  const optimistic = async (next, request, message = 'Could not save that change.') => {
    const previous = structuredClone(data); update(next);
    try { await request(); }
    catch (error) { update(previous); toast(`${message} ${error.message}`); }
  };
  const saveSession = (patch) => {
    const previous = structuredClone(data); data.session = { ...data.session, ...patch }; update(data, false);
    const state = root.querySelector('[data-prep-save-state]'); if (state) state.textContent = 'Saving…';
    clearTimeout(sessionTimer); sessionTimer = setTimeout(async () => {
      try { await api(`/api/visit-prep/${profileId}/session`, { method: 'PATCH', body: JSON.stringify(patch) }); if (root.isConnected) root.querySelector('[data-prep-save-state]').textContent = 'Saved'; }
      catch (error) { update(previous); toast(`Visit details were not saved. ${error.message}`); if (root.isConnected) root.querySelector('[data-prep-save-state]').textContent = 'Not saved'; }
    }, 500);
  };
  root.querySelectorAll('[data-session]').forEach((field) => field.addEventListener('input', () => saveSession({ [field.dataset.session]: field.type === 'date' ? (field.value || null) : field.value })));
  root.querySelectorAll('[data-q-asked]').forEach((box) => box.addEventListener('change', async () => {
    const q = data.questions.find((x) => x.id === box.dataset.qAsked); if (!q) return;
    const previous = q.isAsked; q.isAsked = box.checked; root.querySelector(`[data-q-text="${q.id}"]`)?.classList.toggle('asked', q.isAsked); const count = root.querySelector('#prepCount'); if (count) count.textContent = `${data.questions.filter((x) => x.isAsked).length} of ${data.questions.length} asked`;
    try { await api(`/api/visit-prep/${profileId}/questions/${q.id}`, { method: 'PATCH', body: JSON.stringify({ isAsked: q.isAsked }) }); }
    catch (error) { q.isAsked = previous; box.checked = previous; root.querySelector(`[data-q-text="${q.id}"]`)?.classList.toggle('asked', previous); if (count) count.textContent = `${data.questions.filter((x) => x.isAsked).length} of ${data.questions.length} asked`; toast(`Could not update this question. ${error.message}`); }
  }));
  root.querySelectorAll('[data-q-speak]').forEach((button) => button.addEventListener('click', () => {
    const q = data.questions.find((x) => x.id === button.dataset.qSpeak); if (!q) return;
    if (activeQuestion === q.id && window.speechSynthesis?.speaking) { stopSpeech(); return; }
    stopSpeech(); activeQuestion = q.id; button.textContent = 'Stop'; speechMode = 'single';
    if (!say(q.text, () => { button.textContent = 'Speak'; activeQuestion = null; speechMode = 'idle'; })) button.textContent = 'Speak';
  }));
  root.querySelector('[data-prep-speak-all]')?.addEventListener('click', () => { stopSpeech(); speechQueue = data.questions.filter((q) => !q.isAsked); if (!speechQueue.length) return toast('All questions are marked as asked.'); speechIndex = -1; speechMode = 'all'; root.querySelectorAll('[data-prep-speech-action]').forEach((b) => { b.hidden = false; }); speakNext(); });
  root.querySelectorAll('[data-prep-speech-action]').forEach((button) => button.addEventListener('click', () => {
    const action = button.dataset.prepSpeechAction;
    if (action === 'stop') return stopSpeech();
    if (action === 'pause' && speechMode === 'all') { window.speechSynthesis.pause(); speechMode = 'paused'; root.querySelector('[data-prep-progress]').textContent = 'Paused'; }
    if (action === 'resume' && speechMode === 'paused') { window.speechSynthesis.resume(); speechMode = 'all'; root.querySelector('[data-prep-progress]').textContent = `Speaking ${Math.max(1, speechIndex + 1)} of ${speechQueue.length}`; }
    root.querySelector('[data-prep-speech-action="pause"]').hidden = speechMode !== 'all'; root.querySelector('[data-prep-speech-action="resume"]').hidden = speechMode !== 'paused';
  }));
  root.querySelector('[data-prep-regenerate]')?.addEventListener('click', async (event) => {
    event.currentTarget.disabled = true; stopSpeech();
    try { const response = await api('/api/visit-prep/generate', { method: 'POST', body: JSON.stringify({ profileId, reason: root.querySelector('[data-session="reason"]').value.trim(), language: data.language, regenerate: true }) }); update({ ...data, questions: response.questions, session: { ...data.session, reason: root.querySelector('[data-session="reason"]').value.trim() } }); }
    catch (error) { toast(`Could not regenerate visit questions. ${error.message}`); }
    finally { event.currentTarget.disabled = false; }
  });
  const addQuestion = async () => {
    const input = root.querySelector('[data-prep-new-question]'); const text = input.value.trim(); if (!text) return; if (text.length > 300) return toast('Questions can be up to 300 characters.');
    const previous = structuredClone(data); const temp = { id: `pending-${crypto.randomUUID()}`, text, category: 'general', reason: 'Added by you.', sourceRef: null, isAsked: false, sortOrder: data.questions.length, isCustom: true };
    update({ ...data, questions: [...data.questions, temp] }); input.value = '';
    try { const response = await api(`/api/visit-prep/${profileId}/questions`, { method: 'POST', body: JSON.stringify({ text }) }); update({ ...data, questions: data.questions.map((q) => q.id === temp.id ? response.question : q) }); }
    catch (error) { update(previous); toast(`Question was not added. ${error.message}`); }
  };
  root.querySelector('[data-prep-add]')?.addEventListener('click', addQuestion);
  root.querySelector('[data-prep-new-question]')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addQuestion(); } });
  root.querySelectorAll('[data-q-edit]').forEach((button) => button.addEventListener('click', () => { const area = root.querySelector(`[data-q-edit-area="${button.dataset.qEdit}"]`); area.hidden = false; area.querySelector('input').focus(); }));
  root.querySelectorAll('[data-q-cancel]').forEach((button) => button.addEventListener('click', () => { const q = data.questions.find((x) => x.id === button.dataset.qCancel); const area = root.querySelector(`[data-q-edit-area="${button.dataset.qCancel}"]`); area.querySelector('input').value = q?.text || ''; area.hidden = true; }));
  root.querySelectorAll('[data-q-save]').forEach((button) => button.addEventListener('click', async () => {
    const q = data.questions.find((x) => x.id === button.dataset.qSave); const input = root.querySelector(`[data-q-edit-area="${q.id}"] input`); const text = input.value.trim(); if (!text || text.length > 300) return toast('Enter a question of 1 to 300 characters.'); const prior = q.text; q.text = text; root.querySelector(`[data-q-text="${q.id}"]`).textContent = text;
    try { await api(`/api/visit-prep/${profileId}/questions/${q.id}`, { method: 'PATCH', body: JSON.stringify({ text }) }); root.querySelector(`[data-q-edit-area="${q.id}"]`).hidden = true; update(data, false); }
    catch (error) { q.text = prior; input.value = prior; root.querySelector(`[data-q-text="${q.id}"]`).textContent = prior; toast(`Question was not saved. ${error.message}`); }
  }));
  root.querySelectorAll('[data-q-delete]').forEach((button) => button.addEventListener('click', async () => {
    const q = data.questions.find((x) => x.id === button.dataset.qDelete); const index = data.questions.indexOf(q); const previous = structuredClone(data); update({ ...data, questions: data.questions.filter((x) => x.id !== q.id) });
    try { await api(`/api/visit-prep/${profileId}/questions/${q.id}`, { method: 'DELETE' }); toast(`Question removed. Undo is available for 8 seconds.`, async () => { try { const restored = await api(`/api/visit-prep/${profileId}/questions/restore`, { method: 'POST', body: JSON.stringify({ ...q, sortOrder: index }) }); const questions = [...data.questions, restored.question].sort((a, b) => a.sortOrder - b.sortOrder); update({ ...data, questions }); } catch (error) { toast(`Could not undo removal. ${error.message}`); } }); }
    catch (error) { update(previous); toast(`Question was not deleted. ${error.message}`); }
  }));
  root.querySelectorAll('[data-q-up],[data-q-down]').forEach((button) => button.addEventListener('click', () => reorder(button.closest('[data-question-id]'), button.hasAttribute('data-q-up') ? -1 : 1)));
  let dragging = null;
  root.querySelectorAll('[data-question-id]').forEach((row) => {
    row.addEventListener('dragstart', () => { dragging = row.dataset.questionId; row.classList.add('dragging'); });
    row.addEventListener('dragend', () => { row.classList.remove('dragging'); dragging = null; });
    row.addEventListener('dragover', (event) => { event.preventDefault(); });
    row.addEventListener('drop', async (event) => { event.preventDefault(); if (!dragging || dragging === row.dataset.questionId) return; const from = data.questions.findIndex((q) => q.id === dragging); const to = data.questions.findIndex((q) => q.id === row.dataset.questionId); const next = [...data.questions]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); await saveOrder(next); });
    const highlight = () => { const ref = row.dataset.sourceRef; if (ref) root.querySelectorAll('[data-context-id]').forEach((item) => item.classList.toggle('context-highlight', item.dataset.contextId === ref)); };
    row.addEventListener('mouseenter', highlight); row.addEventListener('focusin', highlight); row.addEventListener('mouseleave', () => root.querySelectorAll('.context-highlight').forEach((x) => x.classList.remove('context-highlight'))); row.addEventListener('focusout', () => root.querySelectorAll('.context-highlight').forEach((x) => x.classList.remove('context-highlight')));
  });
  async function reorder(row, delta) { if (!row) return; const old = structuredClone(data); const from = data.questions.findIndex((q) => q.id === row.dataset.questionId); const to = from + delta; if (to < 0 || to >= data.questions.length) return; const next = [...data.questions]; [next[from], next[to]] = [next[to], next[from]]; await saveOrder(next, old); }
  async function saveOrder(next, old = structuredClone(data)) { update({ ...data, questions: next }); try { const response = await api(`/api/visit-prep/${profileId}/questions/order`, { method: 'PUT', body: JSON.stringify({ ids: next.map((q) => q.id) }) }); update({ ...data, questions: response.questions }); } catch (error) { update(old); toast(`Question order was not saved. ${error.message}`); } }
  root.querySelectorAll('[data-context-doc-open]').forEach((button) => button.addEventListener('click', () => onOpenDocument(button.dataset.contextDocOpen)));
  root.querySelector('[data-prep-upload]')?.addEventListener('click', onUpload);
  const symptomInput = root.querySelector('[data-prep-symptom]');
  const addSymptom = async () => { const text = symptomInput.value.trim(); if (!text || (data.session.symptoms || []).includes(text)) return; const symptoms = [...(data.session.symptoms || []), text].slice(0, 30); symptomInput.value = ''; const previous = structuredClone(data); data.session.symptoms = symptoms; update(data); try { await api(`/api/visit-prep/${profileId}/session`, { method: 'PATCH', body: JSON.stringify({ symptoms }) }); } catch (error) { update(previous); toast(`Symptom was not saved. ${error.message}`); } };
  root.querySelector('[data-prep-add-symptom]')?.addEventListener('click', addSymptom);
  symptomInput?.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); addSymptom(); } });
  root.querySelectorAll('[data-symptom-remove]').forEach((button) => button.addEventListener('click', async () => { const previous = structuredClone(data); const symptoms = [...(data.session.symptoms || [])]; symptoms.splice(Number(button.dataset.symptomRemove), 1); data.session.symptoms = symptoms; update(data); try { await api(`/api/visit-prep/${profileId}/session`, { method: 'PATCH', body: JSON.stringify({ symptoms }) }); } catch (error) { update(previous); toast(`Symptom was not removed. ${error.message}`); } }));
  root.querySelector('[data-prep-print]')?.addEventListener('click', () => {
    const s = data.session; const body = `<h1>Prepare for your visit</h1><p>${esc(s.doctorName || 'Clinician')} · ${esc(s.visitDate || 'Date not set')}</p><p><b>Reason:</b> ${esc(s.reason || 'Not specified')}</p><h2>Questions</h2><ol>${data.questions.map((q) => `<li>${esc(q.text)}${q.reason ? `<small>${esc(q.reason)}</small>` : ''}${q.isAsked ? ' (asked)' : ''}</li>`).join('')}</ol><h2>Symptoms to mention</h2><p>${(s.symptoms || []).map(esc).join(', ') || 'None added'}</p><h2>Doctor’s answers / notes</h2><p>${esc(s.notes || '').replace(/\n/g, '<br>')}</p><p class="disclaimer">Informational questions only. Verify record details with your clinician.</p>`;
    const win = window.open('', '_blank'); if (!win) return toast('Allow pop-ups to print the visit sheet.'); win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Visit preparation</title><style>body{font:16px Arial;max-width:850px;margin:48px auto;line-height:1.6;color:#1d332d}small{display:block;color:#64746e}.disclaimer{margin-top:28px;padding:12px;background:#f8f6ef}</style></head><body>${body}</body></html>`); win.document.close(); win.focus(); setTimeout(() => win.print(), 200);
  });
  root.querySelectorAll('[data-question-id]').forEach((row) => row.addEventListener('keydown', (e) => { if (e.altKey && ['ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); reorder(row, e.key === 'ArrowUp' ? -1 : 1); } }));
  root.addEventListener('DOMNodeRemoved', stopSpeech, { once: true });
}
