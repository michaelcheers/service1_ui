// Module: Pre-Office Templates — hand-wired.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "preOfficeTemplates", title: "Pre-Office Templates", reads: ["preoffice/templates"], writes: ["preoffice/templates"] };

async function load() {
  const data = (window.S1.fixtures || {})["preOfficeTemplates"] || {};
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'preOfficeTemplates' } }));
}
load().catch(e => console.warn('[preOfficeTemplates] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

// Sub-tabs (Templates / Submissions / Archived)
$$('.subtabs .subtab').forEach((b) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tab = (b.textContent || '').replace(/\d+/g, '').trim().toLowerCase();
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Archive button → open the archive modal.
$$('.page-actions .btn-secondary').filter(b => /^archive$/i.test(b.textContent.trim())).forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#ptArchiveModal');
  });
});

// "+ New template" → open the new-template modal.
$$('.page-actions .btn-primary').filter(b => /new template/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#ptNewModal');
  });
});

// Template card click → open detail (rename/delete via row controls).
document.addEventListener('click', async (ev) => {
  const card = ev.target.closest('[data-bind="templates"] > div, [data-bind] > div[data-record-id]');
  if (!card) return;
  const id = card.getAttribute('data-record-id');
  if (!id) return;
  await safe('Open template', async () => {
    const r = await comm.action('preOfficeTemplates.open', { id });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// AI fab


// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-preOfficeTemplates-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-preOfficeTemplates-open'));}));
  window.S1.modal.bindForm('#ptNewModal', 'preOfficeTemplates.create', { label: 'Create' });
  window.S1.modal.bindForm('#ptDuplicateModal', 'preOfficeTemplates.duplicate', { label: 'Duplicate' });
  window.S1.modal.bindForm('#ptArchiveModal', 'preOfficeTemplates.archive', { label: 'Archive' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('preOfficeTemplates');
