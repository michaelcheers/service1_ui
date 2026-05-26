// Module: Reports — hand-wired.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "reports", title: "Reports", reads: ["reports"], writes: [] };

async function load() {
  const data = (window.S1.fixtures || {})["reports"] || {};
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'reports' } }));
}
load().catch(e => console.warn('[reports] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

$$('.subtabs .subtab').forEach((b, i) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tabs = ['all', 'pinned', 'sales', 'operations', 'finance', 'recent'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Filters button
$$('.page-actions .btn-secondary').filter(b => /^filters$/i.test(b.textContent.trim())).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe('Filters', () => comm.action('reports.header-filters', {}));
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// "+ New report"
$$('.page-actions .btn-primary').forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe('New report', () => comm.action('reports.new', {}));
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// Sort button — visual only; use segmented controls / chips for actual sort.

// Grid/List segmented
$$('.seg button').forEach(b => {
  b.addEventListener('click', async () => {
    $$('.seg button').forEach(x => x.classList.toggle('active', x === b));
    await safe('View', () => comm.save('reports.sort', { view: b.textContent.trim() }));
  });
});

// Search
$$('input.search-input').forEach(inp => {
  let t = null;
  inp.addEventListener('input', () => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {}, 300);
  });
});

// Report card click
document.addEventListener('click', async (ev) => {
  const card = ev.target.closest('[data-bind] a, [data-bind] [data-record-id]');
  if (!card) return;
  ev.preventDefault();
  const id = (card.closest('[data-record-id]') || {}).getAttribute && (card.closest('[data-record-id]')).getAttribute('data-record-id');
  if (!id) return;
  await safe('Open report', async () => {
    const r = await comm.action('reports.open', { id });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// AI fab


// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-reports-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-reports-open'));}));
  window.S1.modal.bindForm('#rptRunModal', 'reports.run', { label: 'Run' });
  window.S1.modal.bindForm('#rptScheduleModal', 'reports.schedule', { label: 'Schedule' });
  window.S1.modal.bindForm('#rptExportModal', 'reports.detail.export', { label: 'Export' });
  window.S1.modal.bindForm('#rptPresetModal', 'reports.preset.save', { label: 'Save preset' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('reports');
