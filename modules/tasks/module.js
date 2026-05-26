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

// Sub-tabs: All / My / Due today / Overdue / Completed
$$('.subtabs .subtab').forEach((b, i) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tab = ['all', 'mine', 'due-today', 'overdue', 'completed'][i] || 'all';
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Assignee range-picker — visual only.

// Filters button — use the filter chips below; no popup.

// "+ New task" — v12 modal
$$('.page-actions .btn-primary').filter(b => /new task/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#newTaskModal');
  });
});
window.S1.modal.bindForm('#newTaskModal', 'tasks.new', {
  label: 'Create task',
  successMsg: 'Task created',
  validate: (p) => p.title ? null : 'Title is required',
  transform: (p) => {
    if (p.tags && typeof p.tags === 'string') p.tags = p.tags.split(',').map(s => s.trim()).filter(Boolean);
    if (p.assigneeUserId === '') p.assigneeUserId = null;
    if (p.projectId === '') p.projectId = null;
    if (p.dueDate === '') p.dueDate = null;
    return p;
  },
  onSuccess: () => load()
});
window.S1.modal.bindForm('#snoozeTaskModal', 'tasks.snooze', { label: 'Snooze', onSuccess: () => load() });
window.S1.modal.bindForm('#reassignTaskModal', 'tasks.reassign', { label: 'Reassign', onSuccess: () => load() });

// Category filter chips
$$('.fchips .fchip').forEach((c, i) => {
  c.addEventListener('click', async () => {
    $$('.fchips .fchip').forEach(x => x.classList.toggle('active', x === c));
    const cats = ['all', 'sales', 'ops', 'service'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Row click → toggle complete (checkbox-like behavior)
document.addEventListener('click', async (ev) => {
  const row = ev.target.closest('tbody[data-bind] tr');
  if (!row) return;
  const id = row.getAttribute('data-record-id');
  if (!id) return;
  // Distinguish: if user clicked the "name" cell, open. If the checkbox / circle, complete.
  if (ev.target.closest('input[type="checkbox"], .task-check, .task-circle')) {
    await safe('Complete', async () => {
      await comm.action('tasks.complete', { id, status: 'Done' });
      row.style.opacity = '0.5';
      flash('Completed');
    });
  } else {
    await safe('Open task', async () => {
      const r = await comm.action('tasks.open', { id });
      if (r && r.navigateTo) window.location.href = r.navigateTo;
    });
  }
});

// AI fab

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('tasks');
