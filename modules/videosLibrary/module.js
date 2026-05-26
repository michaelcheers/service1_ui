// Module: Videos Library — hand-wired.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "videosLibrary", title: "Videos Library", reads: ["videos"], writes: [] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["videosLibrary"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'videosLibrary' } }));
}
load().catch(e => console.warn('[videosLibrary] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

$$('.subtabs .subtab').forEach((b, i) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tabs = ['all', 'training', 'operations', 'safety', 'quality', 'customer'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Categories button
$$('.page-actions .btn-secondary').filter(b => /^categories$/i.test(b.textContent.trim())).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe('Categories', () => comm.action('videosLibrary.header-categories', {}));
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// "+ Upload video" — open the upload modal.
$$('.page-actions .btn-primary').filter(b => /upload video/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', (ev) => { ev.preventDefault(); window.S1.modal.open('#vidUploadModal'); });
});

// Search
$$('input.search-input').forEach(inp => {
  let t = null;
  inp.addEventListener('input', () => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {}, 300);
  });
});

// Sort segmented (Newest / Most viewed / Longest)
$$('.seg button').forEach(b => {
  b.addEventListener('click', async () => {
    $$('.seg button').forEach(x => x.classList.toggle('active', x === b));
    await safe('Sort', () => comm.save('videosLibrary.sort', { value: b.textContent.trim() }));
  });
});

// Video card click → watch
document.addEventListener('click', async (ev) => {
  const card = ev.target.closest('[data-bind] a, [data-bind] [data-record-id]');
  if (!card) return;
  ev.preventDefault();
  const id = (card.closest('[data-record-id]') || {}).getAttribute && (card.closest('[data-record-id]')).getAttribute('data-record-id');
  if (!id) return;
  await safe('Watch', async () => {
    const r = await comm.action('videosLibrary.open', { id });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// AI fab


// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-videosLibrary-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-videosLibrary-open'));}));
  window.S1.modal.bindForm('#vidUploadModal', 'videos.upload', { label: 'Upload' });
  window.S1.modal.bindForm('#vidRenameModal', 'videos.rename', { label: 'Rename' });
  window.S1.modal.bindForm('#vidMoveModal', 'videos.move', { label: 'Move' });
  window.S1.modal.bindForm('#vidDeleteModal', 'videos.delete', { label: 'Delete' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('videosLibrary');
