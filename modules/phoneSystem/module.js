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

// --- Generic per-tab list search (feature #1376) ---------------------------
// Generalized from the Recordings filter (feature #1430): a single client-side
// filter that works on every Phone tab. For a given panel it hides rows whose
// digit-normalized phone (data-phone, if present) and visible text
// (.list-num + .list-meta) don't contain the term, and toggles that panel's
// empty state. Re-runs on every keystroke, after each bind
// (s1ui:ready / state:replaced), and when a tab is opened.
const PHONE_SEARCH_PANELS = ['recent', 'voicemails', 'recordings', 'texts', 'contacts']; // 'missed' is server-side (#1434), CLAUDE rule #11

function filterList(panel) {
  if (panel === 'missed') return; // #1434: Missed Calls searches server-side over the full paginated history
  const input = document.querySelector('[data-list-filter="' + panel + '"]');
  if (!input) return;
  const raw    = (input.value || '').trim().toLowerCase();
  const digits = raw.replace(/\D/g, '');                 // "555-1234" -> "5551234"
  // National form (drop a leading "1") so a 10-digit search matches an 11-digit
  // stored value and vice-versa — same normalization as the ASP.NET side.
  const national = (digits.length === 11 && digits[0] === '1') ? digits.slice(1) : digits;
  const panelEl = document.querySelector('[data-ppanel="' + panel + '"]');
  const rows    = panelEl ? panelEl.querySelectorAll('.list-row') : [];
  let shown = 0;
  rows.forEach((row) => {
    // Recordings rows carry a normalized data-phone; other tabs fall back to the
    // visible number/name text shown in .list-num + .list-meta.
    const dataPhone = (row.getAttribute('data-phone') || '');
    const numEl  = row.querySelector('.list-num');
    const metaEl = row.querySelector('.list-meta');
    const text   = ((numEl ? numEl.textContent : '') + ' ' + (metaEl ? metaEl.textContent : '')).toLowerCase();
    const textDigits = text.replace(/\D/g, '');
    const phone  = dataPhone + ' ' + textDigits;
    let match;
    if (!raw)          match = true;
    else if (digits)   match = phone.indexOf(digits) !== -1 || phone.indexOf(national) !== -1 || text.indexOf(raw) !== -1;
    else               match = text.indexOf(raw) !== -1;   // letters-only term -> text search
    row.style.display = match ? '' : 'none';
    if (match) shown++;
  });
  const empty = document.getElementById(panel + 'Empty');
  if (empty) empty.style.display = (rows.length > 0 && shown === 0) ? '' : 'none';
}

function filterAll() { PHONE_SEARCH_PANELS.forEach(filterList); }

// --- Missed Calls server-side search (feature #1434) -----------------------
// The Missed Calls list is server-paginated (8/page), so a purely client-side
// filter would only see the rendered page. Instead the existing
// data-list-filter="missed" input posts the term to the server, which filters
// the FULL history, resets to page 1 and returns fresh state.
const PHONE_MISSED_SEARCH_DEBOUNCE_MS = 250; // CLAUDE rule #11
let missedSearchTimer = null;

async function submitMissedSearch(q) {
  try {
    await comm.save('phone.missedCalls.search', { q: q });
    await load();
  } catch (e) { flash('Search failed: ' + (e.message || e)); }
}

// Re-seed the Missed input from server state after each hydrate/refresh. The
// input lives in the static toolbar (outside the data-bind template), so it
// survives re-bind; this covers fresh load and term-survives-paging. Never
// clobber the box while the user is actively typing in it.
function restoreMissedSearch() {
  const inp = document.querySelector('[data-list-filter="missed"]');
  if (!inp || document.activeElement === inp) return;
  const st = (window.S1.fixtures || {}).phoneSystem || {};
  inp.value = st.missedSearch || '';
}

document.addEventListener('input', (ev) => {
  const el = ev.target.closest('[data-list-filter]');
  if (!el) return;
  const panel = el.getAttribute('data-list-filter');
  if (panel === 'missed') {
    clearTimeout(missedSearchTimer);
    const q = el.value;
    missedSearchTimer = setTimeout(() => submitMissedSearch(q), PHONE_MISSED_SEARCH_DEBOUNCE_MS);
    return;
  }
  filterList(panel);
});
document.addEventListener('s1ui:ready', filterAll);
document.addEventListener('s1ui:ready', restoreMissedSearch);
if (window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', filterAll);
  window.S1.bus.on('state:replaced', restoreMissedSearch);
}
// Re-apply a tab's active filter when that tab becomes visible.
document.addEventListener('click', (ev) => {
  const tab = ev.target.closest('[data-ptab]');
  if (tab) filterList(tab.getAttribute('data-ptab'));
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
