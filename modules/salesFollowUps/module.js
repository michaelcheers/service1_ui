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
  const chip     = document.querySelector('#fuChips .fchip.active');
  const source   = document.getElementById('fuSource');
  const assignee = document.getElementById('fuAssignee');
  const range    = document.getElementById('fuRange');
  const rFrom    = document.getElementById('fuRangeFrom');
  const rTo      = document.getElementById('fuRangeTo');
  const rangeVal = range ? (range.value || '') : '';
  const chipVal  = chip ? (chip.dataset.filter || '') : '';
  return {
    filter:     chipVal === 'all' ? '' : chipVal,
    source:     source ? (source.value || '') : '',
    assignedTo: assignee ? (assignee.value || '') : '',
    range:      rangeVal,
    rangeFrom:  rangeVal === 'custom' && rFrom ? (rFrom.value || '') : '',
    rangeTo:    rangeVal === 'custom' && rTo   ? (rTo.value   || '') : ''
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
// Generic toolbar select change → reload. #fuRange is owned by its dedicated
// handler below (custom toggle), so skip it here to avoid a double goToPage.
document.addEventListener('change', (ev) => {
  const sel = ev.target.closest('.toolbar .field-select');
  if (!sel) return;
  if (sel.id === 'fuRange' || sel.id === 'fuRangeFrom' || sel.id === 'fuRangeTo') return;
  goToPage(1);
});

// Date-range select: "Custom…" reveals the date inputs without reloading; any
// preset reloads immediately and clears any stale custom window.
function syncCustomRange() {
  const range = document.getElementById('fuRange');
  const wrap  = document.getElementById('fuCustomRange');
  if (!range || !wrap) return;
  wrap.style.display = (range.value === 'custom') ? 'inline-flex' : 'none';
}
document.addEventListener('change', (ev) => {
  if (!ev.target.closest('#fuRange')) return;
  const range = document.getElementById('fuRange');
  if (range.value === 'custom') {
    syncCustomRange();
    return; // wait for a date before reloading
  }
  const rFrom = document.getElementById('fuRangeFrom');
  const rTo   = document.getElementById('fuRangeTo');
  if (rFrom) rFrom.value = '';
  if (rTo)   rTo.value = '';
  syncCustomRange();
  goToPage(1);
});
document.addEventListener('change', (ev) => {
  if (ev.target.id === 'fuRangeFrom' || ev.target.id === 'fuRangeTo') goToPage(1);
});

// Restore active status chip + custom-range visibility from server-echoed state
// so the toolbar survives a server reload.
function restoreToolbarState() {
  const data = (window.S1.fixtures || {}).salesFollowUps || {};
  const sf = data.selectedFilter || 'all';
  const want = (sf === '' ? 'all' : sf);
  const chips = document.querySelectorAll('#fuChips .fchip');
  let matched = false;
  chips.forEach(c => {
    const on = (c.dataset.filter === want);
    c.classList.toggle('active', on);
    if (on) matched = true;
  });
  if (!matched) {
    chips.forEach(c => c.classList.toggle('active', c.dataset.filter === 'all'));
  }
  syncCustomRange();
}
document.addEventListener('s1ui:ready', restoreToolbarState);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', restoreToolbarState);
}

// v12 modal triggers + bindings.
$$('[data-salesFollowUps-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-salesFollowUps-open')); }));
  window.S1.modal.bindForm('#scheduleFollowUpModal', 'salesFollowUps.schedule', { label: 'Schedule', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#markContactedModal', 'salesFollowUps.mark.contacted', { label: 'Save', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#reassignFollowUpModal', 'salesFollowUps.reassign', { label: 'Reassign', onSuccess: ()=>load() });
