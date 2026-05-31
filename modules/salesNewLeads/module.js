// Module: New leads — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "salesNewLeads", title: "New leads", reads: ["salesNewLeads"], writes: ["salesNewLeads"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["salesNewLeads"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'salesNewLeads' } }));
}
load().catch(e => console.warn('[salesNewLeads] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('salesNewLeads');

// --- Server-side pagination wiring -----------------------------------------
function getFilterValues() {
  const search = document.getElementById('nlSearch');
  const chip   = document.querySelector('#nlChips .fchip.active');
  const source = document.getElementById('nlSourceSel') || document.querySelector('#nlSourceSel');
  return {
    search: search ? (search.value || '').trim() : '',
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
  const host = document.getElementById('salesNewLeadsPager'); if (!host) return;
  const data = (window.S1.fixtures || {}).salesNewLeads || {};
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
  const sel = document.getElementById('nlPageSizeSel');
  if (sel && sel.value) return +sel.value || 40;
  const data = (window.S1.fixtures || {}).salesNewLeads || {};
  const p = data.pagination || {};
  return +p.pageSize || 40;
}
function applyState(state) {
  try {
    if (window.S1 && window.S1.fixtures) window.S1.fixtures['salesNewLeads'] = state;
    if (window.S1 && window.S1.render && typeof window.S1.render.bind === 'function') {
      window.S1.render.bind(document, state);
    }
    if (window.S1 && window.S1.bus && typeof window.S1.bus.emit === 'function') {
      window.S1.bus.emit('state:replaced', state);
    }
    document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'salesNewLeads' } }));
  } catch (e) { console.warn('[salesNewLeads] state apply failed', e); }
}
async function goToPage(page, pageSizeOverride) {
  const data = (window.S1.fixtures || {}).salesNewLeads || {};
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
    const r = await comm.save('salesNewLeads.page', { page: next, pageSize, filters });
    if (r && r.navigateTo) { window.location.href = r.navigateTo; return; }
    if (r && r.state) applyState(r.state); else await load();
  } catch (e) { flash('Page change failed: ' + (e.message || e)); }
}
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('#salesNewLeadsPager [data-page]'); if (!b) return;
  if (b.classList && b.classList.contains('disabled')) return;
  ev.preventDefault();
  goToPage(b.getAttribute('data-page'));
});
function syncPageSizeSel() {
  const sel = document.getElementById('nlPageSizeSel'); if (!sel) return;
  const data = (window.S1.fixtures || {}).salesNewLeads || {};
  const p = data.pagination || {};
  const ps = +p.pageSize || 40;
  if (sel.value !== String(ps)) sel.value = String(ps);
}
document.addEventListener('s1ui:ready', renderPager);
document.addEventListener('s1ui:ready', syncPageSizeSel);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderPager);
  window.S1.bus.on('state:replaced', syncPageSizeSel);
}
document.addEventListener('input', (ev) => { if (ev.target && ev.target.id === 'nlSearch') goToPage(1); });
document.addEventListener('click', (ev) => { if (ev.target.closest('#nlChips .fchip')) goToPage(1); });
// Page-size selector → reload at page 1 with the chosen size.
document.addEventListener('change', (ev) => {
  if (ev.target && ev.target.id === 'nlPageSizeSel') { goToPage(1, +ev.target.value || 40); return; }
  if (ev.target.closest('#nlSourceSel')) goToPage(1);
});

// v12 modal triggers + bindings.
$$('[data-salesNewLeads-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-salesNewLeads-open')); }));
  window.S1.modal.bindForm('#claimLeadModal', 'salesNewLeads.claim', { label: 'Claim', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#declineLeadModal', 'salesNewLeads.decline', { label: 'Decline', onSuccess: ()=>load() });

// Expose reload for inline handlers.
window.salesNewLeadsReload = load;

// --- CSV Import controller -------------------------------------------------
function parseCsv(text) {
  // Handles quoted fields with commas / embedded quotes / CRLF.
  const rows = [];
  let cur = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i+1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else {
      if (c === '"') { inQuotes = true; }
      else if (c === ',') { cur.push(field); field = ''; }
      else if (c === '\r') { /* skip */ }
      else if (c === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; }
      else { field += c; }
    }
  }
  if (field.length > 0 || cur.length > 0) { cur.push(field); rows.push(cur); }
  // Drop trailing empty rows
  while (rows.length && rows[rows.length-1].every(v => v === '')) rows.pop();
  if (rows.length === 0) return { headers: [], rows: [] };
  const headers = rows[0].map(h => (h || '').trim());
  const dataRows = rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (r[idx] != null ? String(r[idx]) : ''); });
    return obj;
  });
  return { headers, rows: dataRows };
}

const IMPORT_TARGETS = ['First Name', 'Last Name', 'Name', 'Email', 'Company Name', 'Phone', 'Notes'];

function buildMappingTable(parsed) {
  const tbody = document.querySelector('#nlMappingTbl tbody');
  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
  const sample = parsed.rows[0] || {};
  parsed.headers.forEach(h => {
    const tr = document.createElement('tr');
    const tdH = document.createElement('td'); tdH.textContent = h; tr.appendChild(tdH);
    const tdS = document.createElement('td');
    const sel = document.createElement('select');
    sel.className = 's1-select';
    sel.setAttribute('data-csv-col', h);
    const optSkip = document.createElement('option');
    optSkip.value = ''; optSkip.textContent = '— (skip)';
    sel.appendChild(optSkip);
    IMPORT_TARGETS.forEach(t => {
      const o = document.createElement('option');
      o.value = t; o.textContent = t;
      sel.appendChild(o);
    });
    // Guess default
    const lh = h.toLowerCase();
    let guess = 'Notes';
    if (lh.includes('first')) guess = 'First Name';
    else if (lh.includes('last') || lh === 'surname') guess = 'Last Name';
    else if (lh === 'name' || lh === 'full name' || lh === 'fullname') guess = 'Name';
    else if (lh.includes('email')) guess = 'Email';
    else if (lh.includes('phone') || lh.includes('mobile') || lh.includes('tel')) guess = 'Phone';
    else if (lh.includes('company') || lh.includes('organization') || lh.includes('organisation')) guess = 'Company Name';
    sel.value = guess;
    tdS.appendChild(sel);
    tr.appendChild(tdS);
    const tdV = document.createElement('td');
    tdV.textContent = sample[h] || '';
    tr.appendChild(tdV);
    tbody.appendChild(tr);
  });
}

async function applyAiSuggestion(parsed) {
  try {
    const r = await comm.action('salesNewLeads.suggestMapping', {
      headers: parsed.headers,
      sampleRows: parsed.rows.slice(0, 5)
    });
    const mapping = r && r.mapping;
    if (mapping && typeof mapping === 'object') {
      document.querySelectorAll('#nlMappingTbl select[data-csv-col]').forEach(sel => {
        const col = sel.getAttribute('data-csv-col');
        if (mapping[col] && IMPORT_TARGETS.indexOf(mapping[col]) >= 0) sel.value = mapping[col];
      });
    }
  } catch {}
}

let importParsed = null;

function openImportModal() {
  // Reset state
  importParsed = null;
  const step1 = document.getElementById('nlImportStep1');
  const step2 = document.getElementById('nlImportStep2');
  const confirm = document.getElementById('nlImportConfirm');
  const status = document.getElementById('nlCsvStatus');
  if (step1) step1.style.display = '';
  if (step2) step2.style.display = 'none';
  if (confirm) { confirm.style.display = 'none'; confirm.textContent = 'Import'; }
  if (status) status.textContent = '';
  const fileInput = document.getElementById('nlCsvFileInput');
  if (fileInput) fileInput.value = '';
  window.S1.modal.open('#bulkImportLeadsModal');
}

document.addEventListener('click', (ev) => {
  const t = ev.target;
  if (!t) return;
  if (t.id === 'nlImportBtn') { ev.preventDefault(); openImportModal(); return; }
  if (t.id === 'nlCsvPickBtn') { ev.preventDefault(); const fi = document.getElementById('nlCsvFileInput'); if (fi) fi.click(); return; }
});

document.addEventListener('change', (ev) => {
  if (ev.target && ev.target.id === 'nlCsvFileInput') {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    const status = document.getElementById('nlCsvStatus');
    if (status) status.textContent = 'Reading ' + f.name + '…';
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = String(reader.result || '');
        const parsed = parseCsv(text);
        if (parsed.headers.length === 0 || parsed.rows.length === 0) {
          if (status) status.textContent = 'No rows detected in CSV.';
          return;
        }
        importParsed = parsed;
        document.getElementById('nlImportSummary').textContent =
          'File: ' + f.name + ' · ' + parsed.rows.length + ' rows detected · ' + parsed.headers.length + ' columns';
        buildMappingTable(parsed);
        document.getElementById('nlImportStep1').style.display = 'none';
        document.getElementById('nlImportStep2').style.display = '';
        const confirm = document.getElementById('nlImportConfirm');
        if (confirm) { confirm.style.display = ''; confirm.textContent = 'Import ' + parsed.rows.length + ' leads'; }
        applyAiSuggestion(parsed);
      } catch (e) {
        if (status) status.textContent = 'Parse failed: ' + (e.message || e);
      }
    };
    reader.onerror = () => { if (status) status.textContent = 'Could not read file.'; };
    reader.readAsText(f);
  }
  // Sources select → persist the source slot (page reset handled server-side).
  // The goToPage(1) fired by the #nlSourceSel change listener re-queries with
  // the new source carried in the filters payload.
  if (ev.target && ev.target.id === 'nlSourceSel') {
    const v = ev.target.value || '';
    comm.save('salesNewLeads.source', { source: v }).catch(() => {});
  }
});

document.addEventListener('click', async (ev) => {
  if (!ev.target || ev.target.id !== 'nlImportConfirm') return;
  if (!importParsed) return;
  ev.preventDefault();
  const fieldMapping = {};
  document.querySelectorAll('#nlMappingTbl select[data-csv-col]').forEach(sel => {
    const col = sel.getAttribute('data-csv-col');
    const v = sel.value || '';
    if (v) fieldMapping[col] = v;
  });
  const btn = ev.target;
  btn.disabled = true;
  btn.textContent = 'Importing…';
  try {
    const r = await comm.action('salesNewLeads.import', { fieldMapping, records: importParsed.rows });
    const imp = (r && r.imported) || 0;
    const skip = (r && r.skipped) || 0;
    const errs = (r && Array.isArray(r.errors)) ? r.errors.length : 0;
    flash('Imported ' + imp + ', skipped ' + skip + ', ' + errs + ' errors');
    window.S1.modal.close('#bulkImportLeadsModal');
    load();
  } catch (e) {
    flash('Import failed: ' + (e.message || e));
  } finally {
    btn.disabled = false;
    btn.textContent = 'Import';
  }
});
