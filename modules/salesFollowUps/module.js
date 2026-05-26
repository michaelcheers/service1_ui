// Module: Sales follow-ups — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "salesFollowUps", title: "Sales follow-ups", reads: ["salesFollowUps"], writes: ["salesFollowUps"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["salesFollowUps"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'salesFollowUps' } }));
}
load().catch(e => console.warn('[salesFollowUps] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('salesFollowUps');

// --- Server-side pagination wiring -----------------------------------------
function getFilterValues() {
  const chip   = document.querySelector('#fuChips .fchip.active');
  const source = document.querySelector('.toolbar .field-select');
  return {
    filter: chip ? (chip.dataset.filter || '') : '',
    source: source ? (source.value || '') : ''
  };
}
function buildPageList(current, total) {
  const out = []; const add = (v) => { if (out[out.length - 1] !== v) out.push(v); };
  add(1);
  for (let p = current - 1; p <= current + 1; p++) if (p > 1 && p < total) add(p);
  if (total > 1) add(total);
  const withGaps = [];
  for (let i = 0; i < out.length; i++) {
    withGaps.push(out[i]);
    if (i < out.length - 1 && out[i + 1] - out[i] > 1) withGaps.push('…');
  }
  return withGaps;
}
function renderPager() {
  const host = document.getElementById('salesFollowUpsPager'); if (!host) return;
  const data = (window.S1.fixtures || {}).salesFollowUps || {};
  const p = data.pagination || {};
  const current = +p.currentPage || 1;
  const total   = Math.max(1, +p.totalPages || 1);
  const items   = buildPageList(current, total);
  const parts = [];
  parts.push('<a class="pb' + (current <= 1 ? ' disabled' : '') + '" data-page="prev">←</a>');
  for (const it of items) {
    if (it === '…') { parts.push('<span class="pb disabled">…</span>'); continue; }
    parts.push('<a class="pb' + (it === current ? ' active' : '') + '" data-page="' + it + '">' + it + '</a>');
  }
  parts.push('<span style="font-size:12px;color:var(--ink-3);padding:0 6px;">of ' + total + '</span>');
  parts.push('<a class="pb' + (current >= total ? ' disabled' : '') + '" data-page="next">→</a>');
  host.innerHTML = parts.join('');
}
async function goToPage(page) {
  const data = (window.S1.fixtures || {}).salesFollowUps || {};
  const p = data.pagination || {};
  const current  = +p.currentPage || 1;
  const total    = Math.max(1, +p.totalPages || 1);
  const pageSize = +p.pageSize || 14;
  let next;
  if (page === 'prev')      next = Math.max(1, current - 1);
  else if (page === 'next') next = Math.min(total, current + 1);
  else                      next = Math.max(1, Math.min(total, +page || 1));
  const filters = getFilterValues();
  try {
    const r = await comm.save('salesFollowUps.page', { page: next, pageSize, filters });
    if (r && r.navigateTo) { window.location.href = r.navigateTo; return; }
    await load();
  } catch (e) { flash('Page change failed: ' + (e.message || e)); }
}
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('#salesFollowUpsPager [data-page]'); if (!b) return;
  if (b.classList && b.classList.contains('disabled')) return;
  ev.preventDefault();
  goToPage(b.getAttribute('data-page'));
});
document.addEventListener('s1ui:ready', renderPager);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderPager);
}
document.addEventListener('click', (ev) => { if (ev.target.closest('#fuChips .fchip')) goToPage(1); });
document.addEventListener('change', (ev) => { if (ev.target.closest('.toolbar .field-select')) goToPage(1); });

// v12 modal triggers + bindings.
$$('[data-salesFollowUps-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-salesFollowUps-open')); }));
  window.S1.modal.bindForm('#scheduleFollowUpModal', 'salesFollowUps.schedule', { label: 'Schedule', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#markContactedModal', 'salesFollowUps.mark.contacted', { label: 'Save', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#reassignFollowUpModal', 'salesFollowUps.reassign', { label: 'Reassign', onSuccess: ()=>load() });
