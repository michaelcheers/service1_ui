// Module: Safety Dashboard — hand-wired.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "safetyDashboard", title: "Safety Dashboard", reads: ["safety/incidents","safety/training"], writes: ["safety/incidents"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["safetyDashboard"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'safetyDashboard' } }));
}
load().catch(e => console.warn('[safetyDashboard] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

$$('.subtabs .subtab').forEach((b, i) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tabs = ['overview', 'incidents', 'near-misses', 'training', 'compliance'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Period range-picker — visual only.
// TODO: replace with a real date-range picker.

// Export
$$('.page-actions .btn-secondary').filter(b => /export/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe('Export', () => comm.action('safetyDashboard.export', {}));
    if (r && r.downloadUrl) window.location.href = r.downloadUrl;
  });
});

// "+ Report incident" — open the incident modal.
$$('.page-actions .btn-primary').forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#safIncidentModal');
  });
});

// Chart-tools (Severity / Count / By team)
$$('.chart-tools button').forEach(b => {
  b.addEventListener('click', async () => {
    $$('.chart-tools button').forEach(x => x.classList.toggle('active', x === b));
    await safe('Chart mode', () => comm.save('safetyDashboard.sort', { value: b.textContent.trim() }));
  });
});

// View log link
$$('.section-link').forEach(a => {
  a.addEventListener('click', async (ev) => {
    ev.preventDefault();
    await safe('Open log', () => comm.action('safetyDashboard.open', { section: a.textContent.trim() }));
  });
});

// Incident row click → review
document.addEventListener('click', async (ev) => {
  const row = ev.target.closest('tbody[data-bind] tr');
  if (!row) return;
  const id = row.getAttribute('data-record-id');
  if (!id) return;
  await safe('Open incident', async () => {
    const r = await comm.action('safetyDashboard.review-incident', { id, status: 'Reviewed' });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// AI fab


// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-safetyDashboard-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-safetyDashboard-open'));}));
  window.S1.modal.bindForm('#safIncidentModal', 'safety.incident.log', { label: 'Log' });
  window.S1.modal.bindForm('#safAuditModal', 'safety.audit.open', { label: 'Open' });
  window.S1.modal.bindForm('#safAckModal', 'safety.ack', { label: 'Acknowledge' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('safetyDashboard');
