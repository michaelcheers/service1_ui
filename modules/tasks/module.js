// Module: Tasks — hand-wired per element.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "tasks", title: "Tasks", reads: ["tasks"], writes: ["tasks"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["tasks"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'tasks' } }));
}
load().catch(e => console.warn('[tasks] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2200); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

// New Task — server-contract payload transform.
window.S1.modal.bindForm('#newTaskModal', 'tasks.new', {
  label: 'Create task',
  successMsg: 'Task created',
  validate: (p) => p.title ? null : 'Title is required',
  transform: (p) => {
    // Tags come from the hidden JSON input populated by the chip widget.
    try { p.tags = JSON.parse(p.tags || '[]'); } catch { p.tags = []; }
    if (!Array.isArray(p.tags)) p.tags = [];
    // Combine date + time into ISO timestamp.
    if (p.dueDate) {
      const t = p.dueTime && /^\d{2}:\d{2}/.test(p.dueTime) ? p.dueTime : '00:00';
      p.dueDate = p.dueDate + 'T' + t + ':00';
    } else { p.dueDate = null; }
    delete p.dueTime;
    // Numeric coercion + clear empties.
    p.assigneeUserId = p.assigneeUserId === '' ? null : Number(p.assigneeUserId) || null;
    p.projectId      = p.projectId      === '' ? null : Number(p.projectId)      || null;
    p.linkedId       = p.linkedId       === '' ? null : Number(p.linkedId)       || null;
    if (!p.linkedKind) { p.linkedKind = null; p.linkedId = null; }
    if (!p.recurrenceRule) p.recurrenceRule = null;
    return p;
  },
  onSuccess: () => load()
});

// + Project — name + color.
window.S1.modal.bindForm('#newProjectModal', 'tasks.new-project', {
  label: 'Create project',
  successMsg: 'Project created',
  validate: (p) => p.name ? null : 'Name is required',
  onSuccess: () => load()
});

// AI Generate — prompt only.
window.S1.modal.bindForm('#aiGenerateModal', 'tasks.ai.generate', {
  label: 'AI generate',
  successMsg: 'AI generating tasks…',
  validate: (p) => p.prompt && p.prompt.trim().length > 3 ? null : 'Describe what you want to plan',
  onSuccess: () => load()
});

// Snooze modal — already declared in index.html.
window.S1.modal.bindForm('#snoozeTaskModal', 'tasks.snooze', { label: 'Snooze', successMsg: 'Snoozed', onSuccess: () => load() });
window.S1.modal.bindForm('#reassignTaskModal', 'tasks.reassign', { label: 'Reassign', successMsg: 'Reassigned', onSuccess: () => load() });

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('tasks');
