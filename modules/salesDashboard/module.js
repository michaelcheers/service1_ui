const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "salesDashboard", title: "Sales Dashboard", reads: ["customers","jobs","sales/pipeline","sales/deals"], writes: [] };
async function load() {
  const [customers, jobs, pipeline, deals] = await Promise.all([
    comm.get("customers"), comm.get("jobs"), comm.get("sales/pipeline"), comm.get("sales/deals")
  ]);
  window.S1.render.bind(document, {
    customers: customers || [], jobs: jobs || [], pipeline: pipeline || [], deals: deals || []
  });
}
(async () => { try { await load(); document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'salesDashboard' } })); } catch(e){ console.warn(e); } })();
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch{} });
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save') comm.save(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
});
