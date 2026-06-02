// Module: Phone system — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "phoneSystem", title: "Phone system", reads: ["phoneSystem"], writes: ["phoneSystem"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["phoneSystem"] || {};

  window.S1.render.bind(document, data);
  relabelTimes(); // browser-tz time labels, after bind so no empty-cell flash
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'phoneSystem' } }));
}
load().catch(e => console.warn('[phoneSystem] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('phoneSystem');

// v12 modal triggers + bindings.
$$('[data-phoneSystem-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-phoneSystem-open')); }));
  window.S1.modal.bindForm('#placeCallModal', 'phone.call.place', { label: 'Call', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#addPhoneContactModal', 'phone.contact.add', { label: 'Add', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#forwardCallModal', 'phone.forward', { label: 'Save', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#voicemailSettingsModal', 'phone.voicemail.settings', { label: 'Save settings', onSuccess: ()=>load() });

// --- Missed Calls server-side pagination -----------------------------------
// Clones the customers-module pager pattern, namespaced for this module. The
// page object lives at window.S1.fixtures.phoneSystem.missedPagination; each
// page change posts save:phone.missedCalls.page and re-binds via load().
const PHONE_MISSED_PAGE_SIZE = 8; // named constant (CLAUDE rule #11)

function buildMissedPageList(current, total) {
  const out = [];
  const add = (v) => { if (out[out.length - 1] !== v) out.push(v); };
  add(1);
  for (let p = current - 1; p <= current + 1; p++) {
    if (p > 1 && p < total) add(p);
  }
  if (total > 1) add(total);
  const withGaps = [];
  for (let i = 0; i < out.length; i++) {
    withGaps.push(out[i]);
    if (i < out.length - 1 && out[i + 1] - out[i] > 1) withGaps.push('…');
  }
  return withGaps;
}

function renderMissedPager() {
  const host = document.getElementById('missedCallsPager');
  if (!host) return;
  const p = ((window.S1.fixtures || {}).phoneSystem || {}).missedPagination || {};
  const current = +p.currentPage || 1;
  const total   = Math.max(1, +p.totalPages || 1);
  while (host.firstChild) host.removeChild(host.firstChild);
  if (total <= 1) { host.style.display = 'none'; return; }
  const mk = (text, attrs, cls) => {
    const b = document.createElement('button');
    b.textContent = text;
    if (cls) b.className = cls;
    for (const k in (attrs || {})) {
      if (k === 'disabled') { if (attrs[k]) b.disabled = true; }
      else b.setAttribute(k, attrs[k]);
    }
    return b;
  };
  if (current > 1) host.appendChild(mk('Previous', { 'data-page': 'prev' }));
  for (const it of buildMissedPageList(current, total)) {
    if (it === '…') { host.appendChild(mk('…', { disabled: true })); continue; }
    host.appendChild(mk(String(it), { 'data-page': String(it) }, it === current ? 'primary' : ''));
  }
  if (current < total) host.appendChild(mk('Next', { 'data-page': 'next' }));
  host.style.display = 'flex';
}

async function goToMissedPage(page) {
  const p = ((window.S1.fixtures || {}).phoneSystem || {}).missedPagination || {};
  const current  = +p.currentPage || 1;
  const total    = Math.max(1, +p.totalPages || 1);
  const pageSize = +p.pageSize || PHONE_MISSED_PAGE_SIZE;
  let next;
  if (page === 'prev')      next = Math.max(1, current - 1);
  else if (page === 'next') next = Math.min(total, current + 1);
  else                      next = Math.max(1, +page || 1);
  try {
    await comm.save('phone.missedCalls.page', { page: next, pageSize });
    await load();
  } catch (e) { flash('Page change failed: ' + (e.message || e)); }
}

document.addEventListener('click', (ev) => {
  const b = ev.target.closest('#missedCallsPager [data-page]');
  if (!b || b.disabled) return;
  ev.preventDefault();
  goToMissedPage(b.getAttribute('data-page'));
});
document.addEventListener('s1ui:ready', renderMissedPager);
if (window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderMissedPager);
}
// Redraw the pager when the Missed Calls tab becomes visible.
document.addEventListener('click', (ev) => {
  if (ev.target.closest('[data-ptab="missed"]')) renderMissedPager();
});

// --- Browser-timezone time labels (feature #1422) --------------------------
// The server emits each call's raw UTC instant in .list-time[data-utc]. We
// format it into Today (clock time) / Yesterday / date HERE, so the
// Today/Yesterday boundary is the VIEWER's local midnight, not the server's.
// new Date(iso) parses the Z-suffixed UTC instant; every accessor below reads
// out in the browser's local timezone.
function relativeTimeLabelLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startThat  = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round((startToday - startThat) / 86400000);
  if (dayDiff === 0) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); // 2:14 PM
  if (dayDiff === 1) return 'Yesterday';
  const opts = d.getFullYear() === now.getFullYear()
    ? { month: 'short', day: 'numeric' }                 // May 12
    : { month: 'short', day: 'numeric', year: 'numeric' }; // Dec 30, 2025
  return d.toLocaleDateString([], opts);
}

function relabelTimes() {
  document.querySelectorAll('.list-time[data-utc]').forEach(function (el) {
    const iso = el.getAttribute('data-utc');
    if (iso) el.textContent = relativeTimeLabelLocal(iso);
  });
}
document.addEventListener('s1ui:ready', relabelTimes);
if (window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', relabelTimes);
}

// --- Recent Calls server-side pagination (feature #1422) -------------------
// Namespaced clone of the Missed Calls pager above. The page object lives at
// window.S1.fixtures.phoneSystem.recentPagination; each page change posts
// save:phone.recentCalls.page and re-binds via load().
const PHONE_RECENT_PAGE_SIZE = 15; // named constant (CLAUDE rule #11)

function buildRecentPageList(current, total) {
  const out = [];
  const add = (v) => { if (out[out.length - 1] !== v) out.push(v); };
  add(1);
  for (let p = current - 1; p <= current + 1; p++) {
    if (p > 1 && p < total) add(p);
  }
  if (total > 1) add(total);
  const withGaps = [];
  for (let i = 0; i < out.length; i++) {
    withGaps.push(out[i]);
    if (i < out.length - 1 && out[i + 1] - out[i] > 1) withGaps.push('…');
  }
  return withGaps;
}

function renderRecentPager() {
  const host = document.getElementById('recentCallsPager');
  if (!host) return;
  const p = ((window.S1.fixtures || {}).phoneSystem || {}).recentPagination || {};
  const current = +p.currentPage || 1;
  const total   = Math.max(1, +p.totalPages || 1);
  while (host.firstChild) host.removeChild(host.firstChild);
  if (total <= 1) { host.style.display = 'none'; return; }
  const mk = (text, attrs, cls) => {
    const b = document.createElement('button');
    b.textContent = text;
    if (cls) b.className = cls;
    for (const k in (attrs || {})) {
      if (k === 'disabled') { if (attrs[k]) b.disabled = true; }
      else b.setAttribute(k, attrs[k]);
    }
    return b;
  };
  if (current > 1) host.appendChild(mk('Previous', { 'data-page': 'prev' }));
  for (const it of buildRecentPageList(current, total)) {
    if (it === '…') { host.appendChild(mk('…', { disabled: true })); continue; }
    host.appendChild(mk(String(it), { 'data-page': String(it) }, it === current ? 'primary' : ''));
  }
  if (current < total) host.appendChild(mk('Next', { 'data-page': 'next' }));
  host.style.display = 'flex';
}

async function goToRecentPage(page) {
  const p = ((window.S1.fixtures || {}).phoneSystem || {}).recentPagination || {};
  const current  = +p.currentPage || 1;
  const total    = Math.max(1, +p.totalPages || 1);
  const pageSize = +p.pageSize || PHONE_RECENT_PAGE_SIZE;
  let next;
  if (page === 'prev')      next = Math.max(1, current - 1);
  else if (page === 'next') next = Math.min(total, current + 1);
  else                      next = Math.max(1, +page || 1);
  try {
    await comm.save('phone.recentCalls.page', { page: next, pageSize });
    await load();
  } catch (e) { flash('Page change failed: ' + (e.message || e)); }
}

document.addEventListener('click', (ev) => {
  const b = ev.target.closest('#recentCallsPager [data-page]');
  if (!b || b.disabled) return;
  ev.preventDefault();
  goToRecentPage(b.getAttribute('data-page'));
});
document.addEventListener('s1ui:ready', renderRecentPager);
if (window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderRecentPager);
}
// Redraw the pager when the Recent Calls tab becomes visible.
document.addEventListener('click', (ev) => {
  if (ev.target.closest('[data-ptab="recent"]')) renderRecentPager();
});

// --- Recordings phone-number search (feature #1430) ------------------------
// Real client-side filter over the rendered recording rows: hides rows whose
// digit-normalized phone (or contact name) doesn't contain the term, and
// toggles the empty state. Re-runs on every keystroke, after each bind
// (s1ui:ready / state:replaced), and when the Recordings tab is opened.
function filterRecordings() {
  const input = document.querySelector('[data-rec-filter]');
  if (!input) return;
  const raw    = (input.value || '').trim().toLowerCase();
  const digits = raw.replace(/\D/g, '');                 // "555-1234" -> "5551234"
  // National form (drop a leading "1") so a 10-digit search matches an 11-digit
  // stored value and vice-versa — same normalization as the ASP.NET side.
  const national = (digits.length === 11 && digits[0] === '1') ? digits.slice(1) : digits;
  const panel  = document.querySelector('[data-ppanel="recordings"]');
  const rows   = panel ? panel.querySelectorAll('.list-row[data-record-id]') : [];
  let shown = 0;
  rows.forEach((row) => {
    const phone = row.getAttribute('data-phone') || '';
    const name  = (row.getAttribute('data-name') || '').toLowerCase();
    let match;
    if (!raw)          match = true;
    else if (digits)   match = phone.indexOf(digits) !== -1 || phone.indexOf(national) !== -1 || name.indexOf(raw) !== -1;
    else               match = name.indexOf(raw) !== -1;   // letters-only term -> name search
    row.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  const empty = document.getElementById('recEmpty');
  if (empty) empty.style.display = (rows.length > 0 && shown === 0) ? '' : 'none';
}
document.addEventListener('input', (ev) => {
  if (ev.target.closest('[data-rec-filter]')) filterRecordings();
});
document.addEventListener('s1ui:ready', filterRecordings);
if (window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', filterRecordings);
}
document.addEventListener('click', (ev) => {
  if (ev.target.closest('[data-ptab="recordings"]')) filterRecordings();
});

// Dialer keypad — local UI state. Each [data-dialer] press appends a digit
// to the in-progress number; ⌫ pops; Call opens the Place-call modal
// pre-filled with the dialed number (the real RPC fires from the modal's Save).
(function () {
  const disp = document.querySelector('.dialer-disp');
  if (!disp) return;
  let buf = '';
  const render = () => {
    disp.textContent = '+1 (' + (buf.slice(0,3).padEnd(3,'_')) + ') '
                     + (buf.slice(3,6).padEnd(3,'_')) + '-'
                     + (buf.slice(6,10).padEnd(4,'_'));
  };
  document.addEventListener('click', (ev) => {
    const k = ev.target.closest('[data-dialer]');
    if (k) { ev.preventDefault(); if (buf.length < 10) buf += k.getAttribute('data-dialer'); render(); return; }
    const del = ev.target.closest('.dialer-call .del');
    if (del) { ev.preventDefault(); buf = buf.slice(0,-1); render(); return; }
    const call = ev.target.closest('.dialer-call .call');
    if (call) {
      const numField = document.querySelector('#placeCallModal [name="number"]');
      if (numField) numField.value = buf;
      if (window.S1.modal) window.S1.modal.open('#placeCallModal');
    }
  });
  render();
})();
