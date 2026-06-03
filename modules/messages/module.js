// Module: Messages — simplified single-list view.
// Just shows the messages (filer + status); clicking a row opens the job/file
// it was sent to. Filtering (channel tabs, status, search) and paging all run
// server-side via `save:messages.page` (mirror of the Customers module), so the
// tab loads one fixed-size page at a time no matter how many messages exist.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "messages", title: "Messages", reads: ["messages"], writes: ["messages"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["messages"] || {};
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'messages' } }));
}
load().catch(e => console.warn('[messages] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

window.S1.wireStandardPage('messages');

// Row click → open the job/file the message was sent to. The host validates the
// message source and forces the navigation same-origin (s1ui-host.js), so '*'
// as the outgoing targetOrigin is safe (same pattern as customers/module.js).
// Job-less rows (e.g. standalone call logs) carry an empty data-msg-url and are
// non-navigable — the click is a no-op.
document.addEventListener('click', (ev) => {
  const item = ev.target.closest('.msg-list .msg-item'); if (!item) return;
  const url = (item.getAttribute('data-msg-url') || '').trim();
  if (!url) return;
  window.parent.postMessage({ type: 's1ui:navigate', href: url }, '*');
});

// Collect the active filter values. Channel = the active tab token; the server
// maps it to the stored enum type. Unread precedence: when the Unread tab is
// active, force status="Unread" and ignore the status dropdown (they'd conflict).
function getFilterValues() {
  const tabEl = document.querySelector('.msg-tabs [data-messages-filter].active');
  const channel = tabEl ? (tabEl.getAttribute('data-messages-filter') || 'all') : 'all';
  const statusEl = document.querySelector('[data-msg-filter="status"]');
  const searchEl = document.querySelector('[data-msg-filter="search"]');
  const status = channel === 'unread' ? 'Unread' : (statusEl ? (statusEl.value || '').trim() : '');
  const search = searchEl ? (searchEl.value || '').trim() : '';
  return { channel, status, search };
}

// Channel tabs: set the active tab, then re-query at page 1 server-side.
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('.msg-tabs [data-messages-filter]'); if (!b) return;
  ev.preventDefault();
  $$('.msg-tabs [data-messages-filter]').forEach(t => t.classList.remove('active'));
  b.classList.add('active');
  goToPage(1);
});

// Status dropdown / search input: re-query at page 1. Search fires on change
// (blur/Enter) to avoid a request per keystroke.
document.addEventListener('change', (ev) => { if (ev.target.closest('[data-msg-filter]')) goToPage(1); });

// --- Server-side pagination wiring (mirrors customers/module.js) -------------
function buildPageList(current, total) {
  const out = [];
  const add = (v) => { if (out[out.length - 1] !== v) out.push(v); };
  add(1);
  for (let p = current - 1; p <= current + 1; p++) { if (p > 1 && p < total) add(p); }
  if (total > 1) add(total);
  const withGaps = [];
  for (let i = 0; i < out.length; i++) {
    withGaps.push(out[i]);
    if (i < out.length - 1 && out[i + 1] - out[i] > 1) withGaps.push('…');
  }
  return withGaps;
}
function renderPager() {
  const host = document.getElementById('messagesPager');
  if (!host) return;
  const data = (window.S1.fixtures || {}).messages || {};
  const p = data.pagination || {};
  const current = +p.currentPage || 1;
  const total   = Math.max(1, +p.totalPages || 1);
  while (host.firstChild) host.removeChild(host.firstChild);
  if (total <= 1) { host.style.display = 'none'; return; }
  const items = buildPageList(current, total);
  const mkBtn = (cls, text, attrs) => {
    const b = document.createElement('button');
    b.className = cls;
    b.textContent = text;
    if (attrs) {
      for (const k in attrs) {
        if (k === 'disabled') { if (attrs[k]) b.disabled = true; }
        else b.setAttribute(k, attrs[k]);
      }
    }
    return b;
  };
  const nodes = [];
  if (current > 1) nodes.push(mkBtn('msg-pager-btn', 'Previous', { 'data-page': 'prev' }));
  for (const it of items) {
    if (it === '…') { nodes.push(mkBtn('msg-pager-btn', '…', { disabled: true })); continue; }
    const cls = 'msg-pager-btn' + (it === current ? ' primary' : '');
    nodes.push(mkBtn(cls, String(it), { 'data-page': String(it) }));
  }
  if (current < total) nodes.push(mkBtn('msg-pager-btn', 'Next', { 'data-page': 'next' }));
  host.style.display = 'flex';
  host.style.gap = '6px';
  nodes.forEach(n => host.appendChild(n));
}
async function goToPage(page) {
  const data = (window.S1.fixtures || {}).messages || {};
  const p = data.pagination || {};
  const current  = +p.currentPage || 1;
  const total    = Math.max(1, +p.totalPages || 1);
  const pageSize = +p.pageSize || 50;
  let next;
  if (page === 'prev')      next = Math.max(1, current - 1);
  else if (page === 'next') next = Math.min(total, current + 1);
  else                      next = Math.max(1, +page || 1);
  const filters = getFilterValues();
  try {
    const r = await comm.save('messages.page', { page: next, pageSize, filters });
    if (r && r.navigateTo) { window.location.href = r.navigateTo; return; }
    await load();
  } catch (e) { flash('Page change failed: ' + (e.message || e)); }
}
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('#messagesPager [data-page]'); if (!b) return;
  if (b.disabled) return;
  ev.preventDefault();
  goToPage(b.getAttribute('data-page'));
});
document.addEventListener('s1ui:ready', renderPager);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderPager);
}
