import { localizeTree } from './i18n.js';

const escapeHtml = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return null;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isNaN(date.getTime()) ? null : date;
}

function dateValue(date) {
    return date.toISOString().slice(0, 10);
}

function addDays(date, count) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + count);
    return result;
}

function formatDate(value, language = 'en') {
    const date = parseDate(value);
    const locale = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', kn: 'kn-IN', ml: 'ml-IN' }[language] || 'en-IN';
    return date ? date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'Date not set';
}

function modal(title, content, onSave, language) {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal-back';
    wrapper.innerHTML = `<div class="modal"><h2>${escapeHtml(title)}</h2>${content}<div class="modalfoot"><button class="button" data-cancel>Cancel</button><button class="button primary" data-save>Save</button></div></div>`;
    document.body.append(wrapper);
    localizeTree(wrapper, language);
    wrapper.onclick = (event) => {
        if (event.target === wrapper || event.target.closest('[data-cancel]')) wrapper.remove();
    };
    wrapper.querySelector('[data-save]').onclick = async() => {
        const saved = await onSave(wrapper);
        if (saved !== false && wrapper.isConnected) wrapper.remove();
    };
    return wrapper;
}

export function renderMaternalCare(maternal = {}, language = 'en') {
    const lmp = parseDate(maternal.lastMenstrualPeriod);
    const savedDueDate = parseDate(maternal.expectedDueDate);
    const dueDate = savedDueDate || (lmp ? addDays(lmp, 280) : null);
    const startDate = lmp || (dueDate ? addDays(dueDate, -280) : null);
    const today = parseDate(dateValue(new Date()));
    const elapsedDays = startDate ? Math.floor((today.getTime() - startDate.getTime()) / 86400000) : -1;
    const hasTiming = elapsedDays >= 0 && dueDate;
    const week = hasTiming ? Math.floor(elapsedDays / 7) : null;
    const day = hasTiming ? elapsedDays % 7 : null;
    const trimester = hasTiming ? (week < 14 ? 'First' : week < 28 ? 'Second' : 'Third') : '';
    const weekDetails = {
        en: (weekNumber, dayNumber) => `Week ${weekNumber}, day ${dayNumber}`,
        hi: (weekNumber, dayNumber) => `सप्ताह ${weekNumber}, दिन ${dayNumber}`,
        te: (weekNumber, dayNumber) => `వారం ${weekNumber}, రోజు ${dayNumber}`,
        ta: (weekNumber, dayNumber) => `வாரம் ${weekNumber}, நாள் ${dayNumber}`,
        kn: (weekNumber, dayNumber) => `ವಾರ ${weekNumber}, ದಿನ ${dayNumber}`,
        ml: (weekNumber, dayNumber) => `ആഴ്ച ${weekNumber}, ദിവസം ${dayNumber}`
    };
    const weekDetail = hasTiming ? (weekDetails[language] || weekDetails.en)(week + 1, day + 1) : '';
    const appointments = [...(maternal.appointments || [])].sort((left, right) => left.date.localeCompare(right.date));
    const nextAppointment = appointments.find((appointment) => appointment.date >= dateValue(today));
    const appointmentsHtml = appointments.length ? appointments.map((appointment) => `<div class="timeline-item maternal-appointment"><div class="docbody"><b>${escapeHtml(appointment.title)}</b><span>${formatDate(appointment.date, language)} · ${escapeHtml(appointment.type || 'Appointment')}</span>${appointment.clinician ? `<span>${escapeHtml(appointment.clinician)}</span>` : ''}${appointment.location ? `<span>${escapeHtml(appointment.location)}</span>` : ''}${appointment.notes ? `<span>${escapeHtml(appointment.notes)}</span>` : ''}</div><button class="delete-btn" type="button" data-appointment-delete="${escapeHtml(appointment.id)}">Remove</button></div>`).join('') : '<div class="empty">No appointments recorded. Add the date and details provided by your maternity care team.</div>';

  return `<div class="maternal-care">
    <div class="advisory">Optional care organizer. Pregnancy timing is an estimate, not a medical assessment. Confirm dates and care plans with your clinician.</div>
    <div class="card maternal-overview">
      <div class="cardhead"><div><div class="cardtitle">Pregnancy timeline</div><div class="cardhint">Only dates you enter are stored in this encrypted profile.</div></div><button class="button small" type="button" data-maternal-edit>${hasTiming ? 'Edit dates' : 'Set up dates'}</button></div>
      ${hasTiming ? `<div class="metrics maternal-metrics"><div class="metric"><div class="metric-top">Estimated pregnancy week</div><div class="metric-val">${week + 1}</div><div class="metric-note">${weekDetail}</div></div><div class="metric"><div class="metric-top">Estimated due date</div><div class="metric-val maternal-date">${formatDate(dateValue(dueDate), language)}</div><div class="metric-note">Calculated from the entered dates</div></div><div class="metric"><div class="metric-top">Trimester estimate</div><div class="metric-val maternal-trimester">${trimester}</div><div class="metric-note">Confirm with your clinician</div></div></div>` : '<div class="empty">Add a last menstrual period date or an estimated due date to see a calendar estimate.</div>'}
      ${maternal.clinicianName || maternal.emergencyContact ? `<div class="settingrow"><div>Care team</div><span>${escapeHtml(maternal.clinicianName || 'Not recorded')}${maternal.emergencyContact ? ` · Emergency contact ${escapeHtml(maternal.emergencyContact)}` : ''}</span></div>` : ''}
    </div>
    <div class="dashboard-grid maternal-grid">
      <div class="card"><div class="cardhead"><div><div class="cardtitle">Appointments</div><div class="cardhint">Record checkups and scans advised by your care team.</div></div><button class="button small" type="button" data-appointment-add>Add appointment</button></div>${nextAppointment ? `<div class="insight maternal-next"><b>Next appointment</b><p>${escapeHtml(nextAppointment.title)} · ${formatDate(nextAppointment.date, language)}</p></div>` : ''}<div class="maternal-appointments">${appointmentsHtml}</div><button class="button small" type="button" data-view="Doctor Visit Prep">Prepare questions for a visit</button></div>
      <div>
        <div class="card"><div class="cardtitle">Emergency help</div><p class="cardhint">For an immediate emergency in India, call the national emergency number.</p><a class="button primary" href="tel:112">Call 112</a><div class="cardhint maternal-caveat">This link starts a phone call. Use emergency services for urgent danger.</div></div>
        <div class="card"><div class="cardtitle">Nearby maternity care</div><p class="cardhint">Open a map search. Your browser or Maps may request your location.</p><a class="button" href="https://www.google.com/maps/search/?api=1&query=maternity%20hospital%20near%20me" target="_blank" rel="noopener noreferrer">Find nearby hospitals</a></div>
        <div class="card"><div class="cardtitle">Trusted care resources</div><div class="maternal-resource"><a href="https://www.nhm.gov.in/" target="_blank" rel="noopener noreferrer">National Health Mission</a><span>India health programs and maternal care resources</span></div><div class="maternal-resource"><a href="https://www.who.int/health-topics/breastfeeding" target="_blank" rel="noopener noreferrer">WHO breastfeeding information</a><span>General information; ask your care team about your situation</span></div><div class="maternal-resource"><a href="https://www.who.int/health-topics/infant-and-young-child-feeding" target="_blank" rel="noopener noreferrer">WHO infant feeding information</a><span>General information; local clinical guidance may differ</span></div></div>
      </div>
    </div>
  </div>`;
}

export function bindMaternalCare(root, { maternal, onSave, toast, language = 'en' }) {
  if (!root) return;
  const current = maternal || {};
  root.querySelector('[data-maternal-edit]')?.addEventListener('click', () => {
    modal('Pregnancy dates and care contacts', '<p>Enter dates from your clinician or records. If both dates are entered, the due date you provide is shown.</p><div class="formrow"><label>Last menstrual period (optional)</label><input class="field" type="date" data-maternal-lmp value="' + escapeHtml(current.lastMenstrualPeriod || '') + '"></div><div class="formrow"><label>Estimated due date (optional)</label><input class="field" type="date" data-maternal-due value="' + escapeHtml(current.expectedDueDate || '') + '"></div><div class="formrow"><label>Clinician or clinic (optional)</label><input class="field" maxlength="160" data-maternal-clinician value="' + escapeHtml(current.clinicianName || '') + '"></div><div class="formrow"><label>Emergency contact phone (optional)</label><input class="field" type="tel" maxlength="40" data-maternal-contact value="' + escapeHtml(current.emergencyContact || '') + '"></div><div class="advisory">The due date is an estimate based on a 280-day pregnancy calculation. It does not replace an ultrasound or clinician assessment.</div>', async (wrapper) => {
      const lastMenstrualPeriod = wrapper.querySelector('[data-maternal-lmp]').value || null;
      const expectedDueDate = wrapper.querySelector('[data-maternal-due]').value || null;
      if (!lastMenstrualPeriod && !expectedDueDate) {
        toast('Enter a last menstrual period or estimated due date.');
        return false;
      }
      const saved = await onSave({ ...current, lastMenstrualPeriod, expectedDueDate, clinicianName: wrapper.querySelector('[data-maternal-clinician]').value.trim(), emergencyContact: wrapper.querySelector('[data-maternal-contact]').value.trim() });
      if (saved) toast('Maternal care details saved to this profile.');
      return saved;
    }, language);
  });
  root.querySelector('[data-appointment-add]')?.addEventListener('click', () => {
    modal('Add a care appointment', '<div class="formrow"><label>Appointment type</label><select class="select" data-appointment-type><option>ANC checkup</option><option>Ultrasound or scan</option><option>Vaccination visit</option><option>Other</option></select></div><div class="formrow"><label>Title</label><input class="field" maxlength="120" data-appointment-title placeholder="Use the name from your care team"></div><div class="formrow"><label>Date</label><input class="field" type="date" data-appointment-date></div><div class="formrow"><label>Clinician (optional)</label><input class="field" maxlength="120" data-appointment-clinician></div><div class="formrow"><label>Location (optional)</label><input class="field" maxlength="180" data-appointment-location></div><div class="formrow"><label>Notes (optional)</label><textarea class="field" maxlength="500" data-appointment-notes></textarea></div>', async (wrapper) => {
      const title = wrapper.querySelector('[data-appointment-title]').value.trim();
      const date = wrapper.querySelector('[data-appointment-date]').value;
      if (!title || !parseDate(date)) {
        toast('Enter an appointment title and valid date.');
        return false;
      }
      const appointment = { id: crypto.randomUUID(), type: wrapper.querySelector('[data-appointment-type]').value, title, date, clinician: wrapper.querySelector('[data-appointment-clinician]').value.trim(), location: wrapper.querySelector('[data-appointment-location]').value.trim(), notes: wrapper.querySelector('[data-appointment-notes]').value.trim() };
      const saved = await onSave({ ...current, appointments: [...(current.appointments || []), appointment].slice(-100) });
      if (saved) toast('Appointment saved to this profile.');
      return saved;
    }, language);
  });
  root.querySelectorAll('[data-appointment-delete]').forEach((button) => button.addEventListener('click', async () => {
    const appointments = (current.appointments || []).filter((appointment) => appointment.id !== button.dataset.appointmentDelete);
    const saved = await onSave({ ...current, appointments });
    if (saved) toast('Appointment removed.');
  }));
}