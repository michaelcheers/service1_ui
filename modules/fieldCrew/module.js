// Module: Field Crew — hand-wired per element.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "fieldCrew", title: "Field Crew", reads: ["crews", "jobs"], writes: ["crews"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["fieldCrew"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'fieldCrew' } }));
}
load().catch(e => console.warn('[fieldCrew] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

// Sub-tabs: Live / Teams / Members / Vehicles / Performance
$$('.subtabs .subtab').forEach((b, i) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tabs = ['live', 'teams', 'members', 'vehicles', 'performance'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Location range-picker — visual only.

// Export roster
$$('.page-actions .btn-secondary').filter(b => /export/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    await safe('Export', async () => {
      const r = await comm.action('fieldCrew.export', {});
      if (r && r.downloadUrl) window.location.href = r.downloadUrl;
    });
  });
});

// "+ New team" — no dedicated modal yet.
$$('.page-actions .btn-primary').filter(b => /new team/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    flash('Add team via the Assign Crew modal');
  });
});

// Filter chips (All / On move / En route / At depot / Off)
$$('.fchip').forEach((c, i) => {
  c.addEventListener('click', async () => {
    $$('.fchip').forEach(x => x.classList.toggle('active', x === c));
    const filters = ['all', 'onMove', 'enRoute', 'atDepot', 'off'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Crew card click → open the truck/team detail
document.addEventListener('click', async (ev) => {
  const card = ev.target.closest('.crew-card');
  if (!card) return;
  const id = card.getAttribute('data-record-id');
  if (!id) return;
  await safe('Open crew', async () => {
    const r = await comm.action('fieldCrew.open', { id });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// AI fab

// v12 modals
$$('[data-fc-open]').forEach(b => b.addEventListener('click', (ev) => { ev.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-fc-open')); }));
window.S1.modal.bindForm('#resolveModal',       'fieldcrew.resolve',  { label: 'Resolve' });
window.S1.modal.bindForm('#assignCrewModal',    'fieldcrew.assign',   { label: 'Assign' });
window.S1.modal.bindForm('#reassignCrewModal',  'fieldcrew.reassign', { label: 'Reassign' });
window.S1.modal.bindForm('#messageCrewModal',   'fieldcrew.message',  { label: 'Send message' });
window.S1.modal.bindForm('#addNoteModal',       'fieldcrew.note',     { label: 'Save note' });

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('fieldCrew');
