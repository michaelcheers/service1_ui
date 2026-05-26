// Module: Dashboard
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = {
  "name": "dashboard",
  "title": "Dashboard",
  "reads": ["jobs", "tasks", "reports", "auth/me"],
  "writes": []
};

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["dashboard"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'dashboard' } }));
}
load().catch(e => console.warn('[dashboard] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
function flash(t){const e=document.createElement('div');e.textContent=t;e.style.cssText='position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;';document.body.appendChild(e);setTimeout(()=>e.remove(),2000);}

// Sub-tabs Overview/Realtime — pure client-side pane swap. No server call;
// the generic tab/panel switcher in core/standard-page.js handles the
// data-tab/data-pane visibility, this just keeps the local active class.
$$('.subtab[data-tab]').forEach(b => {
  b.addEventListener('click', () => {
    $$('.subtab[data-tab]').forEach(x => x.classList.toggle('active', x === b));
    $$('.pane').forEach(p => p.classList.toggle('active', p.dataset.pane === b.dataset.tab));
  });
});

// Chart range buttons (1D/7D/30D/90D/12M/YTD). standard-page.js fires the
// save; here we toggle .active and re-render the chart from the fixture's
// per-range data (chart.ranges[key]).
function buildPath(vals, yMax) {
  if (!vals || !vals.length) return '';
  const W = 1200, H = 260;
  const n = vals.length;
  // Center each point within its column so points line up with the x-axis
  // labels (which are centered in a CSS grid of n columns).
  return vals.map((v, i) => {
    const x = (((i + 0.5) / n) * W).toFixed(1);
    const y = (H * (1 - v / yMax)).toFixed(1);
    return (i === 0 ? 'M ' : 'L ') + x + ',' + y;
  }).join(' ');
}
function renderChart(key) {
  const fx = (window.S1.fixtures || {}).dashboard || {};
  const r = fx.chart && fx.chart.ranges && fx.chart.ranges[key];
  if (!r) return;
  const W = 1200, H = 260;
  const n = r.values.length;
  const colX = (i) => ((i + 0.5) / n) * W;
  const linePath = buildPath(r.values, r.yMax);
  const prevPath = buildPath(r.prev, r.yMax);
  const firstX = colX(0).toFixed(1);
  const lastX  = colX(n - 1).toFixed(1);
  const areaPath = linePath + ' L ' + lastX + ',' + H + ' L ' + firstX + ',' + H + ' Z';
  const svg = document.querySelector('.chart svg'); if (!svg) return;
  const setD = (sel, d) => { const el = svg.querySelector(sel); if (el) el.setAttribute('d', d); };
  setD('.chart-line', linePath);
  setD('.chart-area', areaPath);
  setD('.chart-prev', prevPath);
  const dot = svg.querySelector('.chart-end');
  if (dot) {
    dot.setAttribute('cx', lastX);
    dot.setAttribute('cy', (H * (1 - r.values[n - 1] / r.yMax)).toFixed(1));
  }
  const xWrap = document.querySelector('.chart-x');
  if (xWrap) {
    xWrap.innerHTML = '';
    xWrap.style.gridTemplateColumns = 'repeat(' + r.xLabels.length + ', 1fr)';
    r.xLabels.forEach((lbl, i) => {
      const s = document.createElement('span');
      if (i === r.xLabels.length - 1) s.className = 'cur';
      s.textContent = lbl;
      xWrap.appendChild(s);
    });
  }
  const yWrap = document.querySelector('.chart-y');
  if (yWrap) {
    const spans = yWrap.querySelectorAll(':scope > span');
    for (let i = 0; i < 4 && i < spans.length; i++) spans[i].textContent = r.yLabels[i] || '';
  }
  const head = document.querySelector('.chart-h-num');
  if (head) head.textContent = r.headline;
}
const RANGE_LABELS = { '1d': 'Today', '7d': 'Last 7 days', '30d': 'Last 30 days', '90d': 'Last 90 days', '12m': 'Last 12 months', 'ytd': 'Year to date' };
// Chart tabs (1D/7D/.../12M/YTD) — control only the revenue chart.
function setChartRange(key, opts) {
  opts = opts || {};
  if (!RANGE_LABELS[key]) return;
  $$('.chart-tools button').forEach(x => x.classList.toggle('active', x.getAttribute('data-range') === key));
  renderChart(key);
  if (opts.persist !== false) {
    try { comm.save('dashboard.chartRange', { range: key }); } catch {}
  }
}
$$('.chart-tools button').forEach(b => {
  b.addEventListener('click', () => setChartRange(b.getAttribute('data-range')));
});
// Top-right page range picker — dashboard-wide filter, independent of the chart.
let currentPageRange = '30d';
(function () {
  const btn = document.getElementById('rangePicker');
  const menu = document.getElementById('rangePickerMenu');
  if (!btn || !menu) return;
  const lbl = document.getElementById('rangePickerLabel');
  const isOpen = () => menu.style.display !== 'none';
  const close = () => { menu.style.display = 'none'; btn.setAttribute('aria-expanded', 'false'); };
  const open  = () => { menu.style.display = 'flex'; btn.setAttribute('aria-expanded', 'true'); };
  btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    if (isOpen()) close(); else open();
  });
  // Send an RPC over the host postMessage bridge. We deliberately don't use
  // comm.action here — in dev/mock mode comm is MockComm and would never
  // reach the server, so the picker would silently no-op. The embedded host
  // bridge (s1ui-host.js) listens for { type:'s1ui:rpc' } and proxies it
  // through ?handler=S1Rpc on the .NET page, which is what we want.
  function hostRpc(method, resource, payload) {
    return new Promise((resolve, reject) => {
      if (window.parent === window.self) { reject(new Error('not embedded')); return; }
      const id = 'rng_' + Date.now().toString(36) + '_' + Math.floor(Math.random()*1e6).toString(36);
      const timer = setTimeout(() => {
        window.removeEventListener('message', onMsg);
        reject(new Error('host rpc timeout: ' + method + ' ' + resource));
      }, 15000);
      function onMsg(ev) {
        const d = ev.data;
        if (!d || typeof d !== 'object') return;
        if (d.type !== 's1ui:rpc:reply' || d.id !== id) return;
        clearTimeout(timer);
        window.removeEventListener('message', onMsg);
        if (d.ok) resolve(d.data); else reject(new Error(d.error || 'rpc failed'));
      }
      window.addEventListener('message', onMsg);
      try { window.parent.postMessage({ type: 's1ui:rpc', id, method, resource, payload }, '*'); }
      catch (e) { clearTimeout(timer); window.removeEventListener('message', onMsg); reject(e); }
    });
  }

  $$('button[data-range]', menu).forEach(item => {
    item.addEventListener('click', async (ev) => {
      ev.stopPropagation();
      const key = item.getAttribute('data-range');
      if (lbl && RANGE_LABELS[key]) lbl.textContent = RANGE_LABELS[key];
      currentPageRange = key;
      close();
      // Ask the server to recompute KPI/widget state for the chosen window
      // and swap the iframe's fixture with whatever it returns.
      try {
        const r = await hostRpc('action', 'dashboard.setRange', { range: key });
        if (r && r.state) {
          if (window.S1 && window.S1.fixtures) window.S1.fixtures.dashboard = r.state;
          if (window.S1 && window.S1.store && typeof window.S1.store.replaceAll === 'function') {
            window.S1.store.replaceAll(r.state);
          }
          if (window.S1 && window.S1.bus) window.S1.bus.emit('state:replaced', r.state);
          if (window.S1 && window.S1.render && typeof window.S1.render.bind === 'function') {
            window.S1.render.bind(document, r.state);
          }
        }
      } catch (e) { console.warn('[dashboard] setRange failed', e); }
    });
  });
  document.addEventListener('click', (ev) => {
    if (isOpen() && !menu.contains(ev.target) && !btn.contains(ev.target)) close();
  });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); });
})();
function renderActiveRange() {
  const fx = (window.S1.fixtures || {}).dashboard || {};
  const active = document.querySelector('.chart-tools button.active');
  let key = (fx.chart && fx.chart.defaultRange) || '12m';
  if (active && active.getAttribute('data-range')) key = active.getAttribute('data-range');
  setChartRange(key, { persist: false });
}
// Initial render against seed fixture.
renderActiveRange();
// Host pushes fresh state via postMessage after we send s1ui:ready; that
// path runs S1.render.bind(document, state) which wipes the SVG d="" attrs.
// Re-run renderChart whenever state is replaced.
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderActiveRange);
}


// "View all →" links and any plain anchor — navigation handler.
$$('.section-link, .na-row').forEach(a => {
  a.addEventListener('click', (ev) => {
    if (a.getAttribute('href') === '#') ev.preventDefault();
  });
});

// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-dashboard-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-dashboard-open'));}));
  window.S1.modal.bindForm('#dbAddLeadModal', 'dashboard.lead.add', { label: 'Add lead' });
  window.S1.modal.bindForm('#dbAddTaskModal', 'dashboard.task.add', { label: 'Add task' });
  window.S1.modal.bindForm('#dbMarkStaleModal', 'dashboard.markStale', { label: 'Mark stale' });
  window.S1.modal.bindForm('#dbSnoozeModal', 'dashboard.snooze', { label: 'Snooze' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('dashboard', {
  onSecondary: async (label) => {
    if (!/export/i.test(label)) return false;
    try {
      const r = await comm.action('dashboard.export', { range: currentPageRange });
      if (r && r.downloadUrl) window.location.href = r.downloadUrl;
    } catch (e) { flash('Export failed: ' + e.message); }
    return true; // we handled it — skip standard-page's auto-fire
  }
});
