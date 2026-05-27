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

// Filter values are collected once and shipped to the server via
// `save:customers.page`. No client-side row hiding — the server runs the
// full filtered query against the whole customer list, then the host
// re-pushes state so counts, rows and the pager all reflect reality.
function getFilterValues() {
  const v = {};
  $$('[data-cust-filter]').forEach(el => { v[el.getAttribute('data-cust-filter')] = (el.value || '').trim(); });
  return v;
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
    tr.querySelectorAll('[data-cust-row]').forEach(el => el.setAttribute('data-id', real));
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
      const newValue = val('#custBulkUpdateValue');
      if (!field)    { flash('Pick a field to update first'); return; }
      if (!newValue) { flash('Pick a value first'); return; }
      await comm.action('customers.bulk.update', { ids, field, newValue });
      load();
    } else if (kind === 'tag.add') {
      const tagId = val('#custBulkAddTag');
      if (!tagId) { flash('Pick a tag to add first'); return; }
      await comm.action('customers.bulk.tag.add', { ids, tagDefinitionId: +tagId });
      load();
    } else if (kind === 'tag.remove') {
      const tagId = val('#custBulkRemoveTag');
      if (!tagId) { flash('Pick a tag to remove first'); return; }
      await comm.action('customers.bulk.tag.remove', { ids, tagDefinitionId: +tagId });
      load();
    }
  } catch (e) { flash((kind || 'Bulk') + ' failed: ' + (e.message || e)); }
});

// Bulk-update "value" select swaps options based on the picked field.
function populateBulkUpdateValue() {
  const fieldSel = document.getElementById('custBulkUpdateField');
  const valueSel = document.getElementById('custBulkUpdateValue');
  if (!fieldSel || !valueSel) return;
  const data = (window.S1.fixtures || {}).customers || {};
  const field = (fieldSel.value || '').trim();
  let opts = [];
  if (field === 'Status')         opts = data.optionsOptions  || [];
  else if (field === 'Source')    opts = data.optionsOptions2 || [];
  else if (field === 'LocationId')opts = data.optionsOptions3 || [];
  while (valueSel.firstChild) valueSel.removeChild(valueSel.firstChild);
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'New value…';
  valueSel.appendChild(placeholder);
  for (const o of opts) {
    const opt = document.createElement('option');
    opt.value = (o.value != null ? String(o.value) : '');
    opt.textContent = (o.label != null ? String(o.label) : String(o.value || ''));
    valueSel.appendChild(opt);
  }
}
document.addEventListener('change', (ev) => {
  if (ev.target && ev.target.id === 'custBulkUpdateField') populateBulkUpdateValue();
});
document.addEventListener('s1ui:ready', populateBulkUpdateValue);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', populateBulkUpdateValue);
}

// Header "select all" toggles every visible row checkbox.
document.addEventListener('change', (ev) => {
  if (!ev.target || ev.target.id !== 'custSelectAll') return;
  $$('.cust-row-check').forEach(cb => { cb.checked = ev.target.checked; });
});

// Row-action delegation: View / Edit navigate the top window via the host
// bridge; Delete confirms then issues the RPC.
document.addEventListener('click', async (ev) => {
  const el = ev.target.closest('[data-cust-row]'); if (!el) return;
  ev.preventDefault();
  const id  = el.getAttribute('data-id');
  const act = el.getAttribute('data-cust-row');
  if (!id) return;
  if (act === 'view') {
    window.parent.postMessage({ type: 's1ui:navigate', href: '/Customers/Details?id=' + encodeURIComponent(id) }, '*');
  } else if (act === 'edit') {
    window.parent.postMessage({ type: 's1ui:navigate', href: '/Customers/Edit?id=' + encodeURIComponent(id) }, '*');
  } else if (act === 'delete') {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await comm.action('customers.delete', { id: +id });
      load();
    } catch (e) { flash('Delete failed: ' + (e.message || e)); }
  }
});

// "+ New Customer" header button — server returns navigateTo, host navigates top.
document.addEventListener('click', async (ev) => {
  const el = ev.target.closest('[data-cust-nav="customers.new"]'); if (!el) return;
  ev.preventDefault();
  try {
    const r = await comm.action('customers.new');
    if (r && r.navigateTo) window.parent.postMessage({ type: 's1ui:navigate', href: r.navigateTo }, '*');
  } catch (e) { flash('New Customer failed: ' + (e.message || e)); }
});

// Header Export CSV — server returns downloadUrl; browser GETs it for download.
document.addEventListener('click', async (ev) => {
  const el = ev.target.closest('#custExportAll'); if (!el) return;
  ev.preventDefault();
  try {
    const r = await comm.action('customers.export.all', { filters: getFilterValues() });
    if (r && r.downloadUrl) window.location.href = r.downloadUrl;
  } catch (e) { flash('Export failed: ' + (e.message || e)); }
});

// Clear button resets every filter input then re-runs the query at page 1.
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('#custClearFilters'); if (!el) return;
  ev.preventDefault();
  $$('[data-cust-filter]').forEach(elx => {
    if (elx.tagName === 'SELECT') elx.selectedIndex = 0;
    else elx.value = '';
  });
  goToPage(1);
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
  while (host.firstChild) host.removeChild(host.firstChild);
  if (total <= 1) { host.style.display = 'none'; return; }
  const items   = buildPageList(current, total);
  const nodes = [];
  const mkBtn = (cls, text, attrs) => {
    const b = document.createElement('button');
    b.className = cls;
    b.textContent = text;
    if (attrs) {
      for (const k in attrs) {
        if (k === 'disabled') { if (attrs[k]) b.disabled = true; }
        else b.setAttribute(k, attrs[k]);
      }
    }
    return b;
  };
  // Skip Previous on page 1.
  if (current > 1) {
    nodes.push(mkBtn('cust-bulk-btn', 'Previous', { 'data-page': 'prev' }));
  }
  for (const it of items) {
    if (it === '…') { nodes.push(mkBtn('cust-bulk-btn', '…', { disabled: true })); continue; }
    const cls = 'cust-bulk-btn' + (it === current ? ' primary' : '');
    nodes.push(mkBtn(cls, String(it), { 'data-page': String(it) }));
  }
  // Skip Next on last page.
  if (current < total) {
    nodes.push(mkBtn('cust-bulk-btn', 'Next', { 'data-page': 'next' }));
  }
  host.style.display = 'flex';
  host.style.gap = '6px';
  nodes.forEach(n => host.appendChild(n));
}
async function goToPage(page) {
  const data = (window.S1.fixtures || {}).customers || {};
  const p = data.pagination || {};
  const current  = +p.currentPage || 1;
  const total    = Math.max(1, +p.totalPages || 1);
  const pageSize = +p.pageSize || 25;
  let next;
  if (page === 'prev')      next = Math.max(1, current - 1);
  else if (page === 'next') next = Math.min(total, current + 1);
  else                      next = Math.max(1, +page || 1);
  const filters = getFilterValues();
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
// Apply filters click → page 1 with full filter map.
document.addEventListener('click', (ev) => { if (ev.target.closest('#custApplyFilters')) { ev.preventDefault(); goToPage(1); } });
// Changing any filter input re-runs server-side at page 1.
document.addEventListener('change', (ev) => { if (ev.target.closest('[data-cust-filter]')) goToPage(1); });

// v12 modal triggers + bindings.
$$('[data-customers-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-customers-open')); }));
  window.S1.modal.bindForm('#newCustomerModal', 'customers.create', { label: 'Create customer', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#mergeCustomerModal', 'customers.merge', { label: 'Merge', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#tagCustomerModal', 'customers.tag', { label: 'Apply tag', onSuccess: ()=>load() });
