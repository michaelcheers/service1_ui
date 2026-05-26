// Module: Customers — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "customers", title: "Customers", reads: ["customers"], writes: ["customers"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["customers"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'customers' } }));
}
load().catch(e => console.warn('[customers] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('customers');

// Client-side filter for the Customers table. Each filter input carries
// data-cust-filter="search|status|source|location|from|to|tag"; on every
// change we walk the tbody rows and hide non-matches.
function getFilterValues() {
  const v = {};
  $$('[data-cust-filter]').forEach(el => { v[el.getAttribute('data-cust-filter')] = (el.value || '').trim(); });
  return v;
}
function rowMatchesFilters(row, f) {
  const cells = row.querySelectorAll('td');
  // Column order in the template: [checkbox, name, company, email, phone, status, source, branch, tags, revenue, actions]
  const txt = (el) => (el && el.textContent ? el.textContent.trim() : '');
  const nameCell    = cells[1];
  const company     = txt(cells[2]);
  const email       = txt(cells[3]);
  const status      = txt(cells[5]);
  const source      = txt(cells[6]);
  const branch      = txt(cells[7]);
  const tags        = txt(cells[8]);
  const name        = txt(nameCell && nameCell.querySelector('b'));
  if (f.search) {
    const q = f.search.toLowerCase();
    if (![name, email, company].some(x => x.toLowerCase().includes(q))) return false;
  }
  if (f.status   && status   !== f.status)   return false;
  if (f.source   && source   !== f.source)   return false;
  if (f.location && branch   !== f.location) return false;
  if (f.tag      && !tags.toLowerCase().includes(f.tag.toLowerCase())) return false;
  // From/To dates: no per-row date column rendered; skip until row exposes one.
  return true;
}
function applyCustomerFilters() {
  const f = getFilterValues();
  $$('tbody[data-bind="rows"] tr').forEach(tr => {
    tr.style.display = rowMatchesFilters(tr, f) ? '' : 'none';
  });
}
document.addEventListener('click', (ev) => {
  if (!ev.target.closest('#custApplyFilters')) return;
  ev.preventDefault();
  applyCustomerFilters();
});
document.addEventListener('input',  (ev) => { if (ev.target.closest('[data-cust-filter]')) applyCustomerFilters(); });
document.addEventListener('change', (ev) => { if (ev.target.closest('[data-cust-filter]')) applyCustomerFilters(); });
document.addEventListener('s1ui:ready', applyCustomerFilters);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', applyCustomerFilters);
}

// Post-bind: if the fixture didn't supply per-row ids, the template
// substitutes '—' for {{id}}. Re-stamp ids from the rows array (use the
// real id if present, otherwise the row's 0-based index).
function backfillCustomerIds() {
  const data = (window.S1.fixtures || {}).customers || {};
  const rows = Array.isArray(data.rows) ? data.rows : [];
  $$('tbody[data-bind="rows"] tr').forEach((tr, i) => {
    const row  = rows[i] || {};
    const real = row.id != null && row.id !== '' && row.id !== '—' ? String(row.id) : String(i);
    tr.setAttribute('data-record-id', real);
    const cb = tr.querySelector('.cust-row-check');
    if (cb) cb.setAttribute('data-id', real);
  });
}
document.addEventListener('s1ui:ready', backfillCustomerIds);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', backfillCustomerIds);
}

// Bulk-action bar: collect ids from checked row checkboxes and route each
// button to the appropriate RPC with the actual selection in the payload.
function getSelectedCustomerIds() {
  return $$('.cust-row-check:checked')
    .map(cb => cb.getAttribute('data-id'))
    .filter(Boolean);
}
function val(sel) { const el = document.querySelector(sel); return el ? (el.value || '').trim() : ''; }

document.addEventListener('click', async (ev) => {
  const b = ev.target.closest('[data-cust-bulk]'); if (!b) return;
  ev.preventDefault();
  const kind = b.getAttribute('data-cust-bulk');
  const ids  = getSelectedCustomerIds();
  if (!ids.length) { flash('Select at least one customer first'); return; }
  try {
    if (kind === 'export') {
      const r = await comm.action('customers.export.selected', { ids });
      if (r && r.downloadUrl) window.location.href = r.downloadUrl;
    } else if (kind === 'delete') {
      if (!window.confirm('Delete ' + ids.length + ' customer(s)?')) return;
      await comm.action('customers.bulk.delete', { ids });
      load();
    } else if (kind === 'update') {
      const field = val('#custBulkUpdateField');
      if (!field) { flash('Pick a field to update first'); return; }
      await comm.action('customers.bulk.update', { ids, field });
      load();
    } else if (kind === 'tag.add') {
      const tag = val('#custBulkAddTag');
      if (!tag) { flash('Enter a tag to add first'); return; }
      await comm.action('customers.bulk.tag.add', { ids, tag });
      load();
    } else if (kind === 'tag.remove') {
      const tag = val('#custBulkRemoveTag');
      if (!tag) { flash('Enter a tag to remove first'); return; }
      await comm.action('customers.bulk.tag.remove', { ids, tag });
      load();
    }
  } catch (e) { flash((kind || 'Bulk') + ' failed: ' + (e.message || e)); }
});

// Header "select all" toggles every visible row checkbox.
document.addEventListener('change', (ev) => {
  if (!ev.target || ev.target.id !== 'custSelectAll') return;
  $$('.cust-row-check').forEach(cb => { cb.checked = ev.target.checked; });
});

// --- Server-side pagination wiring -----------------------------------------
function buildPageList(current, total) {
  const out = [];
  const add = (v) => { if (out[out.length - 1] !== v) out.push(v); };
  add(1);
  for (let p = current - 1; p <= current + 1; p++) {
    if (p > 1 && p < total) add(p);
  }
  if (total > 1) add(total);
  // Insert ellipses where there are gaps > 1
  const withGaps = [];
  for (let i = 0; i < out.length; i++) {
    withGaps.push(out[i]);
    if (i < out.length - 1 && out[i + 1] - out[i] > 1) withGaps.push('…');
  }
  return withGaps;
}
function renderPager() {
  const host = document.getElementById('customersPager');
  if (!host) return;
  const data = (window.S1.fixtures || {}).customers || {};
  const p = data.pagination || {};
  const current = +p.currentPage || 1;
  const total   = Math.max(1, +p.totalPages || 1);
  const items   = buildPageList(current, total);
  const parts = [];
  parts.push('<button class="cust-bulk-btn" data-page="prev"' + (current <= 1 ? ' disabled' : '') + '>Previous</button>');
  for (const it of items) {
    if (it === '…') { parts.push('<button class="cust-bulk-btn" disabled>…</button>'); continue; }
    const cls = 'cust-bulk-btn' + (it === current ? ' primary' : '');
    parts.push('<button class="' + cls + '" data-page="' + it + '">' + it + '</button>');
  }
  parts.push('<button class="cust-bulk-btn" data-page="next"' + (current >= total ? ' disabled' : '') + '>Next</button>');
  host.style.display = 'flex';
  host.style.gap = '6px';
  host.innerHTML = parts.join('');
}
async function goToPage(page) {
  const data = (window.S1.fixtures || {}).customers || {};
  const p = data.pagination || {};
  const current  = +p.currentPage || 1;
  const total    = Math.max(1, +p.totalPages || 1);
  const pageSize = +p.pageSize || 14;
  let next;
  if (page === 'prev')      next = Math.max(1, current - 1);
  else if (page === 'next') next = Math.min(total, current + 1);
  else                      next = Math.max(1, Math.min(total, +page || 1));
  if (next === current && page !== 'prev' && page !== 'next') { renderPager(); return; }
  const filters = (typeof getFilterValues === 'function') ? getFilterValues() : {};
  try {
    const r = await comm.save('customers.page', { page: next, pageSize, filters });
    if (r && r.navigateTo) { window.location.href = r.navigateTo; return; }
    await load();
  } catch (e) { flash('Page change failed: ' + (e.message || e)); }
}
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('#customersPager [data-page]'); if (!b) return;
  if (b.disabled) return;
  ev.preventDefault();
  goToPage(b.getAttribute('data-page'));
});
document.addEventListener('s1ui:ready', renderPager);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderPager);
}
// Filter change resets to page 1.
function _custFilterResetPage(ev) {
  if (!ev.target.closest('[data-cust-filter]')) return;
  goToPage(1);
}
document.addEventListener('change', _custFilterResetPage);
document.addEventListener('click', (ev) => { if (ev.target.closest('#custApplyFilters')) goToPage(1); });

// v12 modal triggers + bindings.
$$('[data-customers-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-customers-open')); }));
  window.S1.modal.bindForm('#newCustomerModal', 'customers.create', { label: 'Create customer', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#mergeCustomerModal', 'customers.merge', { label: 'Merge', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#tagCustomerModal', 'customers.tag', { label: 'Apply tag', onSuccess: ()=>load() });
