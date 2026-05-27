// Module: Create customer — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "createCustomer", title: "Create customer", reads: ["createCustomer"], writes: ["createCustomer"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["createCustomer"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'createCustomer' } }));
}
load().catch(e => console.warn('[createCustomer] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('createCustomer');

// Required-field validation for "Create Customer" submit button.
// Runs in the capture phase so we can stopImmediatePropagation before the
// document-level data-comm-action dispatcher in standard-page.js fires.
(function wireRequiredValidation() {
  const btn = document.querySelector('button[data-comm-action="action:createCustomer.create"]');
  if (!btn) return;
  function validate(ev) {
    const scope = btn.closest('form') || btn.closest('[data-comm-scope]') || document;
    const fields = Array.from(scope.querySelectorAll('input[required], select[required], textarea[required]'));
    const empty = fields.filter(f => !f.disabled && String(f.value || '').trim() === '');
    fields.forEach(f => f.classList.remove('error'));
    if (empty.length) {
      if (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); }
      empty.forEach(f => f.classList.add('error'));
      try { empty[0].focus(); } catch {}
      flash('Please fill in all required fields');
      return false;
    }
    return true;
  }
  btn.addEventListener('click', validate, true);
})();

// "+ Add Stop" button — append a new stop row using DOM APIs (no innerHTML).
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-cc-add-stop]');
  if (!btn) return;
  ev.preventDefault();
  const host = document.getElementById('cc-stops');
  if (!host) return;
  const row = document.createElement('div');
  row.style.cssText = 'display:grid;grid-template-columns:32px 1fr auto;gap:8px;align-items:center;';
  const num = document.createElement('span');
  num.style.cssText = 'font-weight:700;color:var(--ink-3);';
  num.textContent = (host.querySelectorAll(':scope > div').length + 1) + '.';
  const input = document.createElement('input');
  input.className = 'cc-input';
  input.type = 'text';
  input.placeholder = 'Stop address';
  input.setAttribute('data-places-autocomplete', '');
  const rm = document.createElement('button');
  rm.type = 'button';
  rm.style.cssText = 'padding:8px 10px;color:#B91C1C;background:transparent;border:0;font-size:13px;cursor:pointer;';
  rm.textContent = 'Remove';
  rm.addEventListener('click', () => row.remove());
  row.appendChild(num);
  row.appendChild(input);
  row.appendChild(rm);
  host.appendChild(row);
  try { window.S1 && window.S1.placesAutocomplete && window.S1.placesAutocomplete.attachAll(); } catch (e) {}
});

// v12 modal triggers + bindings.
$$('[data-createCustomer-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-createCustomer-open')); }));
  window.S1.modal.bindForm('#addAddressModal', 'createCustomer.address.add', { label: 'Add', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#addContactModal', 'createCustomer.contact.add', { label: 'Add', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#saveAndNewModal', 'createCustomer.saveAndNew', { label: 'Save and start new', onSuccess: ()=>load() });
