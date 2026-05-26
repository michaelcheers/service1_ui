// Module: Quality Control — hand-wired.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "qualityControl", title: "Quality Control", reads: ["quality/incidents","quality/inspections"], writes: ["quality/incidents"] };

async function load() {
  const data = (window.S1.fixtures || {})["qualityControl"] || {};
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'qualityControl' } }));
}
load().catch(e => console.warn('[qualityControl] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

$$('.subtabs .subtab').forEach((b, i) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tabs = ['overview', 'inspections', 'issues', 'feedback', 'photos'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Range picker — visual only.
// TODO: replace with a real date-range picker.

// "+ New inspection" — open the audit modal (closest existing).
$$('.page-actions .btn-primary').forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#qcAuditModal');
  });
});

$$('.section-link').forEach(a => {
  a.addEventListener('click', async (ev) => {
    ev.preventDefault();
    await safe('Open list', () => comm.action('qualityControl.open', { section: a.textContent.trim() }));
  });
});



// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-qualityControl-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-qualityControl-open'));}));
  window.S1.modal.bindForm('#qcAuditModal', 'qc.audit.open', { label: 'Open' });
  window.S1.modal.bindForm('#qcResolveModal', 'qc.issue.resolve', { label: 'Resolve' });
  window.S1.modal.bindForm('#qcEscalateModal', 'qc.escalate', { label: 'Escalate' });
  window.S1.modal.bindForm('#qcNoteModal', 'qc.note.add', { label: 'Save note' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('qualityControl');
