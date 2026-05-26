// Module: Pre-Office Submissions — hand-wired.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "preOfficeSubmissions", title: "Pre-Office Submissions", reads: ["preoffice/submissions"], writes: ["preoffice/submissions"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["preOfficeSubmissions"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'preOfficeSubmissions' } }));
}
load().catch(e => console.warn('[preOfficeSubmissions] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

// Sub-tabs (Templates / Submissions / Flagged)
$$('.subtabs .subtab').forEach((b) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tab = (b.textContent || '').replace(/\d+/g, '').trim().toLowerCase();
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Range picker — visual only.

// Export CSV
$$('.page-actions .btn-secondary').filter(b => /export/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe('Export', () => comm.action('preOfficeSubmissions.export', {}));
    if (r && r.downloadUrl) window.location.href = r.downloadUrl;
  });
});

// "+ New draft" — start drafts from a template's row action; no popup form.
$$('.page-actions .btn-primary').forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    flash('Start a draft from a template row');
  });
});

// Filter chips (rendered from fixture)
document.addEventListener('click', async (ev) => {
  const chip = ev.target.closest('.fchips .fchip');
  if (chip) {
    $$('.fchips .fchip').forEach(x => x.classList.toggle('active', x === chip));
    const label = (chip.textContent || '').replace(/\d+/g, '').trim().toLowerCase();
    /* UI-only: visual toggle handled in-page; no server save */
  }
});

// Search input
$$('input.search-input').forEach(inp => {
  let t = null;
  inp.addEventListener('input', () => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {}, 300);
  });
});

// Row click → open submission
document.addEventListener('click', async (ev) => {
  const row = ev.target.closest('tbody[data-bind] tr, [data-bind="submissions"] [data-record-id]');
  if (!row) return;
  const id = row.getAttribute('data-record-id');
  if (!id) return;
  await safe('Open', async () => {
    const r = await comm.action('preOfficeSubmissions.open', { id });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// AI fab


// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-preOfficeSubmissions-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-preOfficeSubmissions-open'));}));
  window.S1.modal.bindForm('#poApproveModal', 'preOfficeSubmissions.approve', { label: 'Approve' });
  window.S1.modal.bindForm('#poRejectModal', 'preOfficeSubmissions.reject', { label: 'Reject' });
  window.S1.modal.bindForm('#poChangesModal', 'preOfficeSubmissions.requestChanges', { label: 'Request' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('preOfficeSubmissions');
