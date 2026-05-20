const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "jobDetail", title: "Job Detail",
  reads: ["jobs","customers","finance/invoices","documents"], writes: ["jobs"] };
async function load() {
  const [jobs, customers, invoices, documents] = await Promise.all([
    comm.get("jobs"), comm.get("customers"), comm.get("finance/invoices"), comm.get("documents")
  ]);
  const job = (jobs && jobs[0]) || { contact: {}, timeline: [] };
  job.contact = job.contact || {};
  window.S1.render.bind(document, {
    job: job,
    invoices: invoices || [],
    documents: documents || [],
    timeline: (job.timeline || [])
  });
}
(async () => { try { await load(); document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'jobDetail' } })); } catch(e){ console.warn(e); } })();
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch{} });
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save') comm.save(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
});
