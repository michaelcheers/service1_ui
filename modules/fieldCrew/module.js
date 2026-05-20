const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "fieldCrew", title: "Field Crew", reads: ["crews","jobs"], writes: [] };
async function load() {
  const [crews, jobs] = await Promise.all([comm.get("crews"), comm.get("jobs")]);
  const crewsDisplay = (crews || []).map(c => Object.assign({}, c, { members: Array.isArray(c.members) ? c.members.join(', ') : '' }));
  window.S1.render.bind(document, { crews: crewsDisplay, jobs: jobs || [] });
}
(async () => { try { await load(); document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'fieldCrew' } })); } catch(e){ console.warn(e); } })();
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch{} });
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save') comm.save(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
});
