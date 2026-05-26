// Module: Sales Dashboard — hand-wired.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "salesDashboard", title: "Sales Dashboard", reads: ["customers","jobs","sales/pipeline"], writes: [] };

async function load() {
  const data = (window.S1.fixtures || {})["salesDashboard"] || {};
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'salesDashboard' } }));
}
load().catch(e => console.warn('[salesDashboard] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

$$('.subtabs .subtab').forEach((b, i) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tabs = ['my-performance', 'pipeline', 'leaderboard', 'goals'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Period range-picker — visual only.
// TODO: replace with a real date-range picker.

$$('.page-actions .btn-secondary').filter(b => /export/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe('Export', () => comm.action('salesDashboard.export', {}));
    if (r && r.downloadUrl) window.location.href = r.downloadUrl;
  });
});

$$('.section-link').forEach(a => {
  a.addEventListener('click', async (ev) => {
    ev.preventDefault();
    await safe('Open', () => comm.action('salesDashboard.open', { section: a.textContent.trim() }));
  });
});

// AI fab


// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-salesDashboard-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-salesDashboard-open'));}));
  window.S1.modal.bindForm('#sdOppAddModal', 'salesDashboard.opportunity.add', { label: 'Add' });
  window.S1.modal.bindForm('#sdStageMoveModal', 'salesDashboard.stage.move', { label: 'Move' });
  window.S1.modal.bindForm('#sdSnoozeModal', 'salesDashboard.followUp.snooze', { label: 'Snooze' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('salesDashboard');
