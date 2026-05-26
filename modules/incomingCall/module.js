// Module: Incoming call — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "incomingCall", title: "Incoming call", reads: ["incomingCall"], writes: ["incomingCall"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["incomingCall"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'incomingCall' } }));
}
load().catch(e => console.warn('[incomingCall] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('incomingCall');

// v12 modal triggers + bindings.
$$('[data-incomingCall-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-incomingCall-open')); }));
  window.S1.modal.bindForm('#acceptCallModal', 'phone.incoming.accept', { label: 'Accept', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#declineCallModal', 'phone.incoming.decline', { label: 'Decline', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#voicemailModal', 'phone.incoming.toVoicemail', { label: 'To voicemail', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#quickNoteModal', 'phone.incoming.quickNote', { label: 'Save', onSuccess: ()=>load() });
