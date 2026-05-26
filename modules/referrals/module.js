// Module: Referrals — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "referrals", title: "Referrals", reads: ["referrals"], writes: ["referrals"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["referrals"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'referrals' } }));
}
load().catch(e => console.warn('[referrals] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('referrals');

// v12 modal triggers + bindings.
$$('[data-referrals-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-referrals-open')); }));
  window.S1.modal.bindForm('#addReferrerModal', 'referrals.referrer.add', { label: 'Add referrer', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#payCommissionModal', 'referrals.commission.pay', { label: 'Pay', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#editReferrerModal', 'referrals.referrer.update', { label: 'Save', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#archiveReferrerModal', 'referrals.archive', { label: 'Archive', onSuccess: ()=>load() });
