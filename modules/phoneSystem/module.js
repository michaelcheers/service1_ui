// Module: Phone system — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "phoneSystem", title: "Phone system", reads: ["phoneSystem"], writes: ["phoneSystem"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["phoneSystem"] || {};

  window.S1.render.bind(document, data);
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
