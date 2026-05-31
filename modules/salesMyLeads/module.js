// Module: My leads — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "salesMyLeads", title: "My leads", reads: ["salesMyLeads"], writes: ["salesMyLeads"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["salesMyLeads"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'salesMyLeads' } }));
}
load().catch(e => console.warn('[salesMyLeads] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('salesMyLeads');

// --- Server-side pagination wiring -----------------------------------------
function getFilterValues() {
  const search = document.getElementById('mlSearch');
  const chip   = document.querySelector('#mlChips .fchip.active');
  return {
    search: search ? (search.value || '').trim() : '',
    status: chip ? (chip.dataset.status || '') : ''
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
  const host = document.getElementById('salesMyLeadsPager'); if (!host) return;
  const data = (window.S1.fixtures || {}).salesMyLeads || {};
  const p = data.pagination || {};
  const current = +p.currentPage || 1;
  const total   = Math.max(1, +p.totalPages || 1);
  const items   = buildPageList(current, total);
  while (host.firstChild) host.removeChild(host.firstChild);
  const prev = document.createElement('a');
  prev.className = 'pb' + (current <= 1 ? ' disabled' : '');
  prev.setAttribute('data-page', 'prev');
  prev.textContent = '←';
  host.appendChild(prev);
  for (const it of items) {
    if (it === '…') {
      const span = document.createElement('span');
      span.className = 'pb disabled';
      span.textContent = '…';
      host.appendChild(span);
      continue;
    }
    const a = document.createElement('a');
    a.className = 'pb' + (it === current ? ' active' : '');
    a.setAttribute('data-page', String(it));
    a.textContent = String(it);
    host.appendChild(a);
  }
  const ofSpan = document.createElement('span');
  ofSpan.style.cssText = 'font-size:12px;color:var(--ink-3);padding:0 6px;';
  ofSpan.textContent = 'of ' + total;
  host.appendChild(ofSpan);
  const next = document.createElement('a');
  next.className = 'pb' + (current >= total ? ' disabled' : '');
  next.setAttribute('data-page', 'next');
  next.textContent = '→';
  host.appendChild(next);
}
function currentPageSize() {
  const sel = document.getElementById('mlPageSizeSel');
  if (sel && sel.value !== '') return +sel.value;  // 0 = All
  const data = (window.S1.fixtures || {}).salesMyLeads || {};
  const p = data.pagination || {};
  return +p.pageSize || 40;
}
function applyState(state) {
  try {
    if (window.S1 && window.S1.fixtures) window.S1.fixtures['salesMyLeads'] = state;
    if (window.S1 && window.S1.render && typeof window.S1.render.bind === 'function') {
      window.S1.render.bind(document, state);
    }
    if (window.S1 && window.S1.bus && typeof window.S1.bus.emit === 'function') {
      window.S1.bus.emit('state:replaced', state);
    }
    document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'salesMyLeads' } }));
  } catch (e) { console.warn('[salesMyLeads] state apply failed', e); }
}
async function goToPage(page, pageSizeOverride) {
  const data = (window.S1.fixtures || {}).salesMyLeads || {};
  const p = data.pagination || {};
  const current  = +p.currentPage || 1;
  const total    = Math.max(1, +p.totalPages || 1);
  const pageSize = pageSizeOverride != null ? pageSizeOverride : currentPageSize();
  let next;
  if (page === 'prev')      next = Math.max(1, current - 1);
  else if (page === 'next') next = Math.min(total, current + 1);
  else                      next = Math.max(1, +page || 1);
  const filters = getFilterValues();
  try {
    const r = await comm.save('salesMyLeads.page', { page: next, pageSize, filters });
    if (r && r.navigateTo) { window.location.href = r.navigateTo; return; }
    if (r && r.state) applyState(r.state); else await load();
  } catch (e) { flash('Page change failed: ' + (e.message || e)); }
}
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('#salesMyLeadsPager [data-page]'); if (!b) return;
  if (b.classList && b.classList.contains('disabled')) return;
  ev.preventDefault();
  goToPage(b.getAttribute('data-page'));
});
function syncPageSizeSel() {
  const sel = document.getElementById('mlPageSizeSel'); if (!sel) return;
  const data = (window.S1.fixtures || {}).salesMyLeads || {};
  const p = data.pagination || {};
  const ps = (p.pageSize == null) ? 40 : +p.pageSize;  // 0 = All
  if (sel.value !== String(ps)) sel.value = String(ps);
}
document.addEventListener('s1ui:ready', renderPager);
document.addEventListener('s1ui:ready', syncPageSizeSel);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderPager);
  window.S1.bus.on('state:replaced', syncPageSizeSel);
}
document.addEventListener('input', (ev) => { if (ev.target && ev.target.id === 'mlSearch') goToPage(1); });
document.addEventListener('click', (ev) => { if (ev.target.closest('#mlChips .fchip')) goToPage(1); });
// Page-size selector → reload at page 1 with the chosen size (0 = All).
document.addEventListener('change', (ev) => {
  if (ev.target && ev.target.id === 'mlPageSizeSel') goToPage(1, +ev.target.value);
});

// v12 modal triggers + bindings.
$$('[data-salesMyLeads-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-salesMyLeads-open')); }));
  window.S1.modal.bindForm('#addLeadModal', 'salesMyLeads.lead.add', { label: 'Add lead', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#moveStageModal', 'salesMyLeads.stage.move', { label: 'Move', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#loseLeadModal', 'salesMyLeads.lose', { label: 'Mark lost', onSuccess: ()=>load() });
