const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "videosLibrary", title: "Videos Library", reads: ["videos"], writes: [] };
async function load() {
  const videos = await comm.get("videos");
  window.S1.render.bind(document, { videos: videos || [] });
}
(async () => { try { await load(); document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'videosLibrary' } })); } catch(e){ console.warn(e); } })();
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch{} });
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save') comm.save(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
});
