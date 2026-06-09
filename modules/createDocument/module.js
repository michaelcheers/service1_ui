// Module: Create document — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "createDocument", title: "Create document", reads: ["createDocument"], writes: ["createDocument"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["createDocument"] || {};

  window.S1.render.bind(document, data);

  const wantType = new URLSearchParams(location.search).get('type');
  if (wantType) {
    const sel = document.querySelector('.cd-grid select[data-bind-options="optionsOptions"]');
    if (sel) {
      const opt = Array.from(sel.options).find(o => o.value === wantType);
      if (opt) sel.value = wantType;
    }
    const title = document.querySelector('.cd-grid input[type="text"]');
    if (title && !title.value) title.placeholder = 'e.g. ' + wantType + ' — customer name';
  }

  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'createDocument' } }));
}
load().catch(e => console.warn('[createDocument] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('createDocument');

// v12 modal triggers + bindings.
$$('[data-createDocument-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-createDocument-open')); }));
  window.S1.modal.bindForm('#chooseTemplateModal', 'createDocument.template.choose', { label: 'Choose', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#insertFieldModal', 'createDocument.field.insert', { label: 'Insert', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#sendDocumentModal', 'createDocument.send', { label: 'Send', onSuccess: ()=>load() });
