// Module: Tickets — hand-wired per element.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "tickets", title: "Tickets", reads: ["tickets","customers"], writes: ["tickets"] };

async function load() {
  const data = (window.S1.fixtures || {})["tickets"] || {};
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'tickets' } }));
}
load().catch(e => console.warn('[tickets] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2200); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

// Sub-tabs: status filter (Open / Awaiting customer / Pending internal / Resolved / All)
$$('.subtabs .subtab').forEach((b, i) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tab = ['open', 'awaiting', 'pending', 'resolved', 'all'][i] || 'all';
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Channel range-picker — use the filter chips below; no popup.

// Filters button — use the filter chips below; no popup.

// "+ New ticket" — v12 modal
$$('.page-actions .btn-primary').filter(b => /new ticket/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', (ev) => { ev.preventDefault(); window.S1.modal.open('#newTicketModal'); });
});
window.S1.modal.bindForm('#newTicketModal', 'tickets.new', {
  label: 'Create ticket',
  successMsg: 'Ticket created',
  validate: (p) => p.title ? null : 'Subject is required',
  transform: (p) => {
    if (p.customerId === '') p.customerId = null;
    if (p.jobId === '') p.jobId = null;
    return p;
  },
  onSuccess: () => load()
});
window.S1.modal.bindForm('#replyTicketModal', 'tickets.reply', { label: 'Reply', onSuccess: () => load() });
window.S1.modal.bindForm('#reassignTicketModal', 'tickets.reassign', { label: 'Reassign', onSuccess: () => load() });
window.S1.modal.bindForm('#escalateTicketModal', 'tickets.escalate', { label: 'Escalate', onSuccess: () => load() });
window.S1.modal.bindForm('#closeTicketModal', 'tickets.close', { label: 'Close ticket', onSuccess: () => load() });

// Filter chips (All / Billing / Damage / Scheduling / General)
$$('.fchips .fchip').forEach((c, i) => {
  c.addEventListener('click', async () => {
    $$('.fchips .fchip').forEach(x => x.classList.toggle('active', x === c));
    const cats = ['all', 'billing', 'damage', 'scheduling', 'general'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Search input (debounced)
$$('input.search-input').forEach(inp => {
  let t = null;
  inp.addEventListener('input', () => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {}, 300);
  });
});

// Sort button — visual only; use the segmented controls for actual sort.

// Ticket row click → open ticket detail page
document.addEventListener('click', async (ev) => {
  const row = ev.target.closest('tbody[data-bind="tickets"] tr');
  if (!row) return;
  const id = row.getAttribute('data-record-id');
  if (!id) return;
  await safe('Open ticket', async () => {
    const r = await comm.action('tickets.open', { id });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// AI fab

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('tickets');
