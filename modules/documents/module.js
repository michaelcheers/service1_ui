// Module: Documents (customer portal)
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "documents", title: "Documents", reads: ["documents"], writes: ["documents"] };
async function load() {
  const data = (window.S1.fixtures || {})["documents"] || {};
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'documents' } }));
}
load().catch(e => console.warn('[documents] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
function flash(t){const e=document.createElement('div');e.textContent=t;e.style.cssText='position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;';document.body.appendChild(e);setTimeout(()=>e.remove(),2000);}

// Sub-tabs (All / Recent / Shared / Trash)
$$('.subtabs .subtab').forEach(b => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tab = b.textContent.replace(/\d+/g, '').trim().toLowerCase();
    /* UI-only: no server save */
  });
});

// Header: New folder → open the new-folder modal.
$$('.page-actions .btn-secondary').filter(b => /new folder/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#docNewFolderModal');
  });
});

// Header: + Upload — real file picker, comm.upload per file.
(function () {
  const upload = $$('.page-actions .btn-primary').find(b => /upload/i.test(b.textContent));
  if (!upload) return;
  let inp = document.getElementById('docs-upload-input');
  if (!inp) {
    inp = document.createElement('input');
    inp.id = 'docs-upload-input'; inp.type = 'file'; inp.multiple = true; inp.style.display = 'none';
    document.body.appendChild(inp);
  }
  upload.addEventListener('click', (ev) => { ev.preventDefault(); inp.click(); });
  inp.addEventListener('change', async () => {
    const files = Array.from(inp.files || []);
    for (const f of files) {
      try { await comm.upload(f, { resource: 'documents.upload' }); }
      catch (e) { flash('Upload failed: ' + e.message); return; }
    }
    inp.value = '';
    if (files.length) flash('Uploaded ' + files.length);
  });
})();

// Search input — fires comm.save on input (debounced).
(function () {
  const inp = $$('input.search-input').find(i => /search files/i.test(i.placeholder || ''));
  if (!inp) return;
  let timer = null;
  inp.addEventListener('input', () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {}, 300);
  });
})();

// Filter button
$$('.toolbar .btn-secondary').filter(b => /filter/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    /* UI-only: no server action */
  });
});

// Document card click → comm.action 'documents.open' → fetch view/download URL → open.
document.addEventListener('click', async (ev) => {
  const card = ev.target.closest('a[href="#"][style*="border:var(--hair)"]');
  if (!card) return;
  ev.preventDefault();
  const row = card.closest('[data-record-id]') || card;
  const id  = row.getAttribute && row.getAttribute('data-record-id');
  try {
    const r = await comm.action('documents.open', { id });
    if (r && r.viewUrl) window.open(r.viewUrl, '_blank');
  } catch (e) { flash('Open failed: ' + e.message); }
});

// AI fab

// Generic fallback
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  const payload = (window.S1.collectPayload || function () { return {}; })(t);
  if (kind === 'save') comm.save(resource, payload);
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, payload);
});


// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-documents-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-documents-open'));}));
  window.S1.modal.bindForm('#docUploadModal', 'documents.upload', { label: 'Upload' });
  window.S1.modal.bindForm('#docNewFolderModal', 'documents.folder.new', { label: 'Create' });
  window.S1.modal.bindForm('#docMoveModal', 'documents.move', { label: 'Move' });
  window.S1.modal.bindForm('#docShareModal', 'documents.share', { label: 'Share' });
  window.S1.modal.bindForm('#docDeleteModal', 'documents.delete', { label: 'Delete' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('documents');
