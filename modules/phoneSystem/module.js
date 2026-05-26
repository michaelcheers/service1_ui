// Module: Phone system — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "phoneSystem", title: "Phone system", reads: ["phoneSystem"], writes: ["phoneSystem"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["phoneSystem"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'phoneSystem' } }));
}
load().catch(e => console.warn('[phoneSystem] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('phoneSystem');

// v12 modal triggers + bindings.
$$('[data-phoneSystem-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-phoneSystem-open')); }));
  window.S1.modal.bindForm('#placeCallModal', 'phone.call.place', { label: 'Call', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#addPhoneContactModal', 'phone.contact.add', { label: 'Add', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#forwardCallModal', 'phone.forward', { label: 'Save', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#voicemailSettingsModal', 'phone.voicemail.settings', { label: 'Save settings', onSuccess: ()=>load() });

// Dialer keypad — local UI state. Each [data-dialer] press appends a digit
// to the in-progress number; ⌫ pops; Call opens the Place-call modal
// pre-filled with the dialed number (the real RPC fires from the modal's Save).
(function () {
  const disp = document.querySelector('.dialer-disp');
  if (!disp) return;
  let buf = '';
  const render = () => {
    disp.textContent = '+1 (' + (buf.slice(0,3).padEnd(3,'_')) + ') '
                     + (buf.slice(3,6).padEnd(3,'_')) + '-'
                     + (buf.slice(6,10).padEnd(4,'_'));
  };
  document.addEventListener('click', (ev) => {
    const k = ev.target.closest('[data-dialer]');
    if (k) { ev.preventDefault(); if (buf.length < 10) buf += k.getAttribute('data-dialer'); render(); return; }
    const del = ev.target.closest('.dialer-call .del');
    if (del) { ev.preventDefault(); buf = buf.slice(0,-1); render(); return; }
    const call = ev.target.closest('.dialer-call .call');
    if (call) {
      const numField = document.querySelector('#placeCallModal [name="number"]');
      if (numField) numField.value = buf;
      if (window.S1.modal) window.S1.modal.open('#placeCallModal');
    }
  });
  render();
})();
