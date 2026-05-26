// Module: Crew Processes
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = {
  name: "crewProcesses", title: "Crew Processes",
  reads:  ["crews", "processes/active", "processes/templates"],
  writes: ["processes"]
};
async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["crewProcesses"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'crewProcesses' } }));
}
load().catch(e => console.warn('[crewProcesses] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
function flash(t) {
  const e = document.createElement('div');
  e.textContent = t;
  e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;';
  document.body.appendChild(e); setTimeout(() => e.remove(), 2200);
}
async function safe(label, fn) { try { return await fn(); } catch (e) { flash(label + ' failed: ' + (e.message || e)); throw e; } }

// Sub-tabs: Active / Templates / Completed / Analytics — visual filter only.
$$('.subtabs .subtab').forEach((b) => {
  b.addEventListener('click', () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    // Pure UI: a future build can swap sections per tab; today the page
    // shows everything inline so no DOM toggle is needed.
  });
});

// Header: Templates button — switches to the Templates sub-tab.
$$('.page-actions .btn-secondary').filter(b => /^templates$/i.test(b.textContent.trim())).forEach(b => {
  b.addEventListener('click', () => {
    const tpl = $$('.subtabs .subtab').find(x => /templates/i.test(x.textContent));
    if (tpl) tpl.click();
    const section = $$('section.section').find(s => /process templates/i.test(s.textContent));
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Header: + New process → open the new-process modal.
$$('.page-actions .btn-primary').filter(b => /new process/i.test(b.textContent)).forEach(b => {
  b.setAttribute('data-comm-action', 'action:crewProcesses.new-process:');
  b.__s1Wired = true;
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#newProcModal');
  });
});

// "All templates →" link — scroll to templates section (in-page).
$$('.section-link').forEach(a => {
  a.addEventListener('click', (ev) => {
    ev.preventDefault();
    const target = $$('.section').find(s => /process templates/i.test(s.textContent));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Template card click → open the edit modal.
document.addEventListener('click', (ev) => {
  const card = ev.target.closest('[data-bind="templates"] > div');
  if (!card) return;
  window.S1.modal.open('#editProcModal');
});

// AI fab.

// Generic fallback.
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  if (t.__s1Wired) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  const payload = (window.S1.collectPayload || (() => ({})))(t);
  if (kind === 'save') comm.save(resource, payload);
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, payload);
});

// v12 modals
(function(){
  const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-cp-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-cp-open'));}));
  window.S1.modal.bindForm('#newProcModal','crewProcesses.create',{label:'Create process'});
  window.S1.modal.bindForm('#editProcModal','crewProcesses.update',{label:'Save process'});
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('crewProcesses');
