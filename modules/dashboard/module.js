// Module: Dashboard — all visible values are sourced via comm.get(...) only.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = {
  name: "dashboard",
  title: "Dashboard",
  reads: ["jobs","tasks","reports","auth/me",
          "dashboard/kpis","dashboard/chart","dashboard/performers",
          "dashboard/attention","dashboard/realtime"],
  writes: []
};

const READS = window.__module_manifest.reads;

function drawChart(svg, chart) {
  if (!svg || !chart || !Array.isArray(chart.thisYear)) return;
  const W = 1200, H = 240, pad = 8;
  const ys = chart.thisYear.concat(chart.prev || []);
  const max = Math.max.apply(null, ys.length ? ys : [1]);
  const min = 0;
  function pt(arr) {
    return arr.map((v, i) => {
      const x = pad + (i / (arr.length - 1)) * (W - 2 * pad);
      const y = H - pad - ((v - min) / (max - min || 1)) * (H - 2 * pad);
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
  }
  const ty = pt(chart.thisYear);
  const py = chart.prev ? pt(chart.prev) : '';
  svg.innerHTML =
    '<polyline points="' + py + '" fill="none" stroke="#8792A2" stroke-dasharray="4 4" stroke-width="1.5" opacity=".55"/>' +
    '<polyline points="' + ty + '" fill="none" stroke="#004D40" stroke-width="2.5"/>';
}

async function load() {
  const [me, jobs, tasks, reports, kpis, chart, performers, attention, realtime] = await Promise.all([
    comm.get("auth/me"), comm.get("jobs"), comm.get("tasks"), comm.get("reports"),
    comm.get("dashboard/kpis"), comm.get("dashboard/chart"),
    comm.get("dashboard/performers"), comm.get("dashboard/attention"),
    comm.get("dashboard/realtime")
  ]);
  const state = {
    me, jobs: jobs || [], tasks: tasks || [], reports: reports || [],
    kpis: (kpis || []).map(k => Object.assign({}, k, {
      // Pre-formatted display value used inside template:
      value: k.unit === '$' ? '$' + Math.round(k.value).toLocaleString() + (k.value % 1 ? '.' + String(k.value.toFixed(2)).split('.')[1] : '')
           : k.unit === '%' ? k.value + '%'
           : Math.round(k.value).toLocaleString()
    })),
    chart: chart || {},
    performers: performers || [],
    attention: attention || [],
    realtime: realtime || { agents: [], queues: [], today: {}, dealsBookedToday: {} }
  };
  window.S1.render.bind(document, state);
  drawChart(document.getElementById('chart'), state.chart);
}

(async () => {
  try {
    await load();
    document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'dashboard' } }));
  } catch (e) { console.warn('[dashboard] init error', e); }
})();

READS.forEach(r => { try { comm.subscribe(r, load); } catch {} });

// Tab switcher (visual chrome only)
document.querySelectorAll('#tabs .tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('#tabs .tab').forEach(x => x.classList.toggle('active', x === t));
    document.querySelectorAll('.pane').forEach(p => p.classList.toggle('active', p.dataset.pane === t.dataset.tab));
  });
});

// Generic write hook
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]');
  if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save')   comm.save(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
});
