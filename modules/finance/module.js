const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = {
  name: "finance", title: "Finance",
  reads: ["finance/invoices","finance/payments","finance/pnl","finance/receivables","finance/payables"],
  writes: ["finance/invoices"]
};
async function load() {
  const [invoices, payments, pnl, receivables, payables] = await Promise.all([
    comm.get("finance/invoices"), comm.get("finance/payments"),
    comm.get("finance/pnl"), comm.get("finance/receivables"), comm.get("finance/payables")
  ]);
  window.S1.render.bind(document, {
    invoices: invoices || [], payments: payments || [],
    pnl: pnl || [], receivables: receivables || [], payables: payables || []
  });
}
(async () => { try { await load(); document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'finance' } })); } catch(e){ console.warn(e); } })();
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch{} });
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save') comm.save(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
});
