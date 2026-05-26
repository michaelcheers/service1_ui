// Module: Messages — v12 modal wiring.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "messages", title: "Messages", reads: ["messages"], writes: ["messages"] };

let activeThreadIdx = 0;

async function load() {
  const data = Object.assign({}, (window.S1.fixtures || {})["messages"] || {});
  // Mark which msg-item is "active" in the inbox list based on the
  // currently-selected thread, then point thread/bubbles/customer/quote at
  // that thread's bundle so the right rail reflects the selection.
  if (Array.isArray(data.rows) && Array.isArray(data.threads)) {
    data.rows = data.rows.map((r, i) => Object.assign({}, r, {
      cls: (i === activeThreadIdx ? 'active' : '') + (r.cls && r.cls.indexOf('unread') >= 0 ? ' unread' : '')
    }));
    const t = data.threads[activeThreadIdx] || {};
    if (t.thread)   data.thread   = t.thread;
    if (t.bubbles)  data.bubbles  = t.bubbles;
    if (t.customer) data.customer = t.customer;
    if (t.quote)    data.quote    = t.quote;
  }
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'messages' } }));
}

// Click in the inbox list → swap the right rail to that thread.
document.addEventListener('click', (ev) => {
  const item = ev.target.closest('.msg-list .msg-item');
  if (!item) return;
  const list = item.parentElement;
  if (!list) return;
  const idx = Array.from(list.querySelectorAll(':scope > .msg-item')).indexOf(item);
  if (idx < 0 || idx === activeThreadIdx) return;
  activeThreadIdx = idx;
  // Tell the host which thread is active so the next state push can be
  // server-side filtered if desired; non-blocking.
  try { comm.save('messages.activeThread', { index: idx }); } catch {}
  load();
});
load().catch(e => console.warn('[messages] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('messages');

// v12 modal triggers + bindings.
$$('[data-messages-open]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-messages-open')); }));
  window.S1.modal.bindForm('#newThreadModal', 'messages.thread.new', { label: 'Send', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#forwardThreadModal', 'messages.forward', { label: 'Forward', onSuccess: ()=>load() });
  window.S1.modal.bindForm('#archiveThreadModal', 'messages.archive', { label: 'Archive', onSuccess: ()=>load() });
