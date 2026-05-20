// Module: Pre-Office Templates
// Pure thin shim: import the comm layer + expose hooks.
// Page-specific behavior stays inline in index.html for now; richer
// data binding can move here per-module as it ages.

const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = {
  "name": "preOfficeTemplates",
  "title": "Pre-Office Templates",
  "reads": [
    "preoffice/templates"
  ],
  "writes": [
    "preoffice/templates"
  ]
};

(async () => {
  try {
    // Eagerly fetch each declared read so the lab's I/O log records them.
    for (const r of ["preoffice/templates"]) {
      try { await comm.get(r); } catch {}
    }
    document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'preOfficeTemplates' } }));
  } catch (e) { console.warn('[preOfficeTemplates] init error', e); }
})();

// Generic write hook: any element with [data-comm-action="save:resource"]
// or [data-comm-action="delete:resource:id"] is wired automatically.
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]');
  if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save') {
    const payload = t.dataset.payload ? JSON.parse(t.dataset.payload) : {};
    comm.save(resource, payload);
  } else if (kind === 'delete') {
    comm.delete(resource, id);
  } else if (kind === 'action') {
    const payload = t.dataset.payload ? JSON.parse(t.dataset.payload) : {};
    comm.action(resource, payload);
  }
});
