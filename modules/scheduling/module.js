// Module: Scheduling — hand-wired.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "scheduling", title: "Scheduling", reads: ["jobs", "crews"], writes: ["jobs"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["scheduling"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'scheduling' } }));
}
load().catch(e => console.warn('[scheduling] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

// Date display — clicking the date label opens an inline month-grid picker.
// Building it from scratch (no innerHTML per security rule 2).
(function () {
  const cur = document.querySelector('.date-cur');
  const pop = document.getElementById('schDatePopover');
  if (!cur || !pop) return;
  let popMonth = null; // first-of-month being shown in the picker
  function build(forMonth) {
    while (pop.firstChild) pop.removeChild(pop.firstChild);
    const head = document.createElement('div');
    head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;';
    const prev = document.createElement('button'); prev.type='button'; prev.textContent='‹';
    prev.style.cssText='background:#f5f7f4;border:0;border-radius:5px;padding:2px 7px;cursor:pointer;';
    const title = document.createElement('b'); title.style.fontSize='13px';
    title.textContent = forMonth.toLocaleDateString(undefined,{month:'long',year:'numeric'});
    const next = document.createElement('button'); next.type='button'; next.textContent='›';
    next.style.cssText=prev.style.cssText;
    prev.addEventListener('click',(e)=>{e.preventDefault();const m=new Date(forMonth);m.setMonth(m.getMonth()-1);build(m);});
    next.addEventListener('click',(e)=>{e.preventDefault();const m=new Date(forMonth);m.setMonth(m.getMonth()+1);build(m);});
    head.appendChild(prev); head.appendChild(title); head.appendChild(next);
    pop.appendChild(head);
    const grid = document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:11px;';
    ['M','T','W','T','F','S','S'].forEach(dn=>{
      const c=document.createElement('div'); c.style.cssText='text-align:center;color:#999;'; c.textContent=dn; grid.appendChild(c);
    });
    const first = new Date(forMonth.getFullYear(), forMonth.getMonth(), 1);
    const gridStart = new Date(first); gridStart.setDate(first.getDate() - ((first.getDay() + 6) % 7));
    const today = new Date(); today.setHours(0,0,0,0);
    const sel = currentDate(); sel.setHours(0,0,0,0);
    for (let i=0;i<42;i++){
      const d=new Date(gridStart); d.setDate(gridStart.getDate()+i);
      const c=document.createElement('div');
      c.style.cssText='padding:4px;text-align:center;cursor:pointer;border-radius:4px;';
      if (d.getMonth() !== forMonth.getMonth()) c.style.color='#bbb';
      if (d.getTime() === today.getTime()) c.style.outline='1px solid #d97757';
      if (d.getTime() === sel.getTime()){ c.style.background='#e0f2f1'; c.style.color='#004d40'; c.style.fontWeight='700'; }
      c.textContent=String(d.getDate());
      c.addEventListener('click', async (ev)=>{
        ev.preventDefault();
        setDate(d);
        pop.hidden = true;
        await safe('Go to date', async () => {
          const iso = d.toISOString().slice(0,10);
          await comm.action('scheduling.view.goto', { date: iso });
          await reloadFromWeek(iso);
        });
      });
      grid.appendChild(c);
    }
    pop.appendChild(grid);
    const foot = document.createElement('div');
    foot.style.cssText='display:flex;justify-content:flex-end;margin-top:6px;';
    const today2=document.createElement('button'); today2.type='button'; today2.textContent='Today';
    today2.style.cssText='font-size:11px;background:#f5f7f4;border:0;border-radius:5px;padding:3px 10px;cursor:pointer;font-weight:600;';
    today2.addEventListener('click', async (ev)=>{
      ev.preventDefault();
      const t=new Date(); setDate(t); pop.hidden=true;
      await safe('Today', async ()=>{
        await comm.action('scheduling.today', {});
        await reloadFromWeek(t.toISOString().slice(0,10));
      });
    });
    foot.appendChild(today2); pop.appendChild(foot);
  }
  cur.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (!pop.hidden) { pop.hidden = true; return; }
    popMonth = currentDate(); popMonth.setDate(1);
    build(popMonth);
    pop.hidden = false;
  });
  document.addEventListener('click', (ev) => {
    if (pop.hidden) return;
    if (cur.contains(ev.target) || pop.contains(ev.target)) return;
    pop.hidden = true;
  });
})();

// Month-view day cells (.res-mo-cell) — click a date to jump to it. Hooked
// once on the static cells, but also via delegation in case render rebuilds.
function jumpToMonthCell(cell) {
  const numEl = cell.querySelector('.res-mo-num');
  if (!numEl) return;
  const day = parseInt(numEl.textContent.trim(), 10);
  if (!day) return;
  const isOther = cell.classList.contains('other');
  // Resolve which month the cell belongs to: the .res-mo-title shows it.
  const title = (document.querySelector('.res-mo-title') || {}).textContent || '';
  const m = title.match(/([A-Za-z]+)\s+(\d{4})/);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  let monIdx = m ? months.indexOf(m[1]) : new Date().getMonth();
  let year   = m ? parseInt(m[2], 10)   : new Date().getFullYear();
  if (isOther) {
    // "other"-month cells live at the start (prev month) or end (next month).
    const cells = $$('.res-mo-cell');
    if (cells.indexOf(cell) < 7) { monIdx -= 1; if (monIdx < 0) { monIdx = 11; year -= 1; } }
    else                         { monIdx += 1; if (monIdx > 11) { monIdx = 0;  year += 1; } }
  }
  const d = new Date(year, monIdx, day);
  setDate(d);
  $$('.res-mo-cell').forEach(c => c.classList.remove('today'));
  $$('.res-mo-cell .res-mo-num').forEach(n => n.classList.remove('today'));
  cell.classList.add('today');
  numEl.classList.add('today');
  safe('Go to date', () => comm.action('scheduling.view.goto', { date: d.toISOString().slice(0,10) }));
}
document.addEventListener('click', (ev) => {
  const cell = ev.target.closest('.res-mo-cell');
  if (!cell) return;
  jumpToMonthCell(cell);
});

// Resource-calendar weekday headers (Mon 11 / Tue 12 / … / Sun 17) — clicking
// a column header jumps the schedule view to that day.
$$('.cal-week-head > div').forEach((cell, i) => {
  if (i === 0) return; // first cell is the "Resource" row label
  cell.style.cursor = 'pointer';
  cell.setAttribute('role', 'button');
  cell.setAttribute('tabindex', '0');
  cell.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const dayNumEl = cell.querySelector('.day-num');
    const dayNum = dayNumEl ? parseInt(dayNumEl.textContent, 10) : NaN;
    await safe('Go to day', async () => {
      const r = await comm.action('scheduling.view.goto', { dayOfWeek: i - 1, dayNum });
      if (r && r.ok && r.date) {
        $$('.cal-week-head .day-num').forEach(x => x.classList.remove('today'));
        if (dayNumEl) dayNumEl.classList.add('today');
        const cur = document.querySelector('.date-cur');
        if (cur) {
          const txtNode = Array.from(cur.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
          if (txtNode) txtNode.textContent = ' ' + r.date + ' ';
        }
        await load();
      }
    });
  });
});

// Date prev/next/today — fire the host RPC AND visibly update the date label,
// the .day-num column headers, and the .res-mo title so the user can see the
// week shift / month jump. Previously the RPCs fired but nothing on the page
// changed, so the buttons looked dead.
function fmtLong(d) {
  const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
  const mo  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  return dow + ' · ' + mo + ' ' + d.getDate() + ', ' + d.getFullYear();
}
function fmtMonthYear(d) {
  const mo = ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()];
  return mo + ' ' + d.getFullYear();
}
function currentDate() {
  const el = document.querySelector('.date-cur');
  if (!el) return new Date();
  const m = (el.textContent || '').match(/([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);
  if (!m) return new Date();
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m[1].slice(0,3));
  return new Date(parseInt(m[3],10), mo, parseInt(m[2],10));
}
function setDate(d) {
  const cur = document.querySelector('.date-cur');
  if (cur) {
    const svg = cur.querySelector('svg');
    cur.textContent = '';
    if (svg) cur.appendChild(svg);
    cur.appendChild(document.createTextNode(' ' + fmtLong(d) + ' '));
  }
  // Slide the day-num row so it represents the new week (Mon..Sun of d).
  const weekStart = new Date(d); weekStart.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  $$('.cal-week-head .day-num').forEach((span, i) => {
    const dn = new Date(weekStart); dn.setDate(weekStart.getDate() + i);
    span.textContent = String(dn.getDate());
    span.classList.toggle('today', dn.toDateString() === d.toDateString());
  });
  const moTitle = document.querySelector('.res-mo-title');
  if (moTitle) moTitle.textContent = 'Resource utilisation · ' + fmtMonthYear(d);
  const moNav = document.querySelector('.res-mo-nav span');
  if (moNav) moNav.textContent = fmtMonthYear(d);
}
function shiftByActiveView(delta) {
  // Day → ±1 day; Week → ±7 days; Month → ±1 month. Mirrors the seg state.
  const seg = document.querySelector('.cal-toolbar .seg > button.active[data-scheduling-view]');
  const v = seg ? seg.getAttribute('data-scheduling-view') : 'week';
  const d = currentDate();
  if (v === 'month') d.setMonth(d.getMonth() + delta);
  else if (v === 'day') d.setDate(d.getDate() + delta);
  else d.setDate(d.getDate() + 7 * delta);
  return d;
}
// Apply a server response (from scheduling.prev/next/today/week.get) onto
// the local fixture and trigger a re-render. Keeps prev/next from leaving
// the UI in a stale "-" state when the week changes.
async function reloadFromWeek(iso) {
  try {
    const r = await comm.action('scheduling.week.get', { date: iso });
    if (r && r.ok) applyWeekResponse(r);
  } catch {}
}
function applyWeekResponse(r) {
  const fx = (window.S1.fixtures || {}).scheduling || {};
  if (r.header) fx.header = Object.assign({}, fx.header || {}, r.header);
  if (r.calRows) fx.calRows = r.calRows;
  if (r.locations) fx.locations = r.locations;
  if (r.counts && fx.metrics) fx.metrics.count = r.counts;
  if (r.countCls && fx.metrics) fx.metrics.countCls = r.countCls;
  // Date navigation also refreshes the timeline jobs + Team Confirmations so
  // the lanes/tab reflect the day being viewed.
  if (r.timeline) fx.timeline = r.timeline;
  // Re-render each team card's truck chips for the newly-selected day
  // (CrewVehicles are date-scoped via AssignedDate).
  if (r.teams) fx.teams = r.teams;
  if (r.teamConfirmations) fx.teamConfirmations = r.teamConfirmations;
  if (r.teamConfirmationsKpis) fx.teamConfirmationsKpis = r.teamConfirmationsKpis;
  if (r.metrics) fx.metrics = r.metrics;
  window.S1.render.bind(document, fx);
  renderTimes();
  recomputeCounts();
  if (window.__sched_tagSources) window.__sched_tagSources();
  buildMonthGrid(currentDate());
  if (window.S1 && window.S1.bus && window.S1.bus.emit) window.S1.bus.emit('state:replaced', fx);
}
$$('button[title="Previous"]').forEach(b => b.addEventListener('click', async (ev) => {
  ev.preventDefault();
  const d = shiftByActiveView(-1);
  setDate(d);
  await safe('Prev', async () => {
    const r = await comm.action('scheduling.prev', { date: d.toISOString().slice(0,10) });
    if (r && r.ok) applyWeekResponse(r);
  });
}));
$$('button[title="Next"]').forEach(b => b.addEventListener('click', async (ev) => {
  ev.preventDefault();
  const d = shiftByActiveView(+1);
  setDate(d);
  await safe('Next', async () => {
    const r = await comm.action('scheduling.next', { date: d.toISOString().slice(0,10) });
    if (r && r.ok) applyWeekResponse(r);
  });
}));
// Month-grid prev/next arrows inside .res-mo-nav (separate buttons).
$$('.res-mo-nav > button').forEach((b, i) => {
  const txt = (b.textContent || '').trim();
  if (txt === '‹' || txt === '›') {
    b.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const d = currentDate();
      d.setMonth(d.getMonth() + (txt === '‹' ? -1 : 1));
      setDate(d);
      await safe('Month ' + txt, () => comm.action('scheduling.' + (txt === '‹' ? 'prev' : 'next'), { date: d.toISOString().slice(0,10), unit: 'month' }));
    });
  }
});
$$('.date-today, button.btn').filter(b => /^today$/i.test(b.textContent.trim())).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const today = new Date();
    setDate(today);
    await safe('Today', async () => {
      const r = await comm.action('scheduling.today', {});
      if (r && r.ok) applyWeekResponse(r);
    });
  });
});

// Day / Week / Month view toggle in the Resource Calendar.
// .cal-grid is the week-grid (resources × 7 days); .res-mo is the month grid.
// Day view = .cal-grid restricted to a single column via .cal-day-view.
(function () {
  function applyView(v) {
    const week  = document.querySelector('.cal-grid[data-cal-view="week"]');
    const month = document.querySelector('.res-mo[data-cal-view="month"]');
    // .cal-grid has `display: grid` in the page CSS and .res-mo has `display:
    // block`, both of which beat the UA [hidden] rule by cascade. Use inline
    // style.display so the toggle actually applies.
    if (week)  { week.style.display  = (v === 'month') ? 'none' : 'grid';  week.classList.toggle('cal-day-view', v === 'day'); }
    if (month) { month.style.display = (v !== 'month') ? 'none' : 'block'; }
    $$('.cal-toolbar .seg > button[data-scheduling-view]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-scheduling-view') === v);
    });
  }
  $$('.cal-toolbar .seg > button[data-scheduling-view]').forEach(b => {
    const v = b.getAttribute('data-scheduling-view');
    if (v !== 'day' && v !== 'week' && v !== 'month') return;
    b.addEventListener('click', (ev) => { ev.preventDefault(); applyView(v); });
  });
  // Teams / Vehicles filters — toggle: click once to filter to that kind,
  // click again to clear. They sit outside the .seg group.
  let activeKind = null;
  function applyKind(k) {
    activeKind = (activeKind === k) ? null : k;
    $$('.cal-toolbar button[data-scheduling-view="teams"], .cal-toolbar button[data-scheduling-view="vehicles"]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-scheduling-view') === activeKind);
    });
    $$('.cal-rows .cal-row').forEach(row => {
      if (!activeKind) { row.style.display = ''; return; }
      row.style.display = (row.getAttribute('data-kind') === activeKind.replace(/s$/, '')) ? '' : 'none';
    });
  }
  $$('.cal-toolbar button[data-scheduling-view="teams"], .cal-toolbar button[data-scheduling-view="vehicles"]').forEach(b => {
    b.addEventListener('click', (ev) => { ev.preventDefault(); applyKind(b.getAttribute('data-scheduling-view')); });
  });
  // Initial state: honour whichever button is already .active in the markup.
  const active = document.querySelector('.cal-toolbar .seg > button.active[data-scheduling-view]');
  applyView(active ? active.getAttribute('data-scheduling-view') : 'week');

  // Day-view CSS: hide all but the first day column in the week grid.
  const style = document.createElement('style');
  style.textContent = `
    .cal-grid.cal-day-view .cal-week-head { grid-template-columns: 200px 1fr !important; }
    .cal-grid.cal-day-view .cal-week-head > div:nth-child(n+3) { display: none !important; }
    .cal-grid.cal-day-view .cal-row { grid-template-columns: 200px 1fr !important; }
    .cal-grid.cal-day-view .cal-row > .cal-day:nth-child(n+3) { display: none !important; }
  `;
  document.head.appendChild(style);
})();

// #1587: lazy tab slices. The heavy day-off / truck-rental datasets are NOT in
// the initial (core) state — they load on first tab open and are cached so a
// re-open doesn't refetch. The server pushes the slice as a partial state which
// the host merges into the fixture (see communication.mock.js apply()).
const schedLazyTabs = { 'day-off': 'dayoff', 'truck-rentals': 'rentals' };
const schedLoadedSlices = { dayoff: false, rentals: false };
async function ensureTabSlice(dataTab) {
  const tab = schedLazyTabs[dataTab];
  if (!tab || schedLoadedSlices[tab]) return;
  const pane = document.querySelector('.tab-pane[data-pane="' + dataTab + '"]');
  let loadingEl = null;
  if (pane) {
    loadingEl = document.createElement('div');
    loadingEl.className = 'sched-tab-loading';
    loadingEl.textContent = 'Loading…';
    loadingEl.style.cssText = 'padding:24px;text-align:center;color:#64748b;font-size:13px;';
    pane.appendChild(loadingEl);
  }
  try {
    const r = await comm.action('scheduling.tab.load', { tab });
    if (r && r.ok) schedLoadedSlices[tab] = true;
  } catch {}
  if (loadingEl && loadingEl.parentNode) loadingEl.parentNode.removeChild(loadingEl);
  recomputeCounts();
}

// Sched tabs (Resource Calendar / Scheduling / Customer Confirmations / etc.)
$$('.sched-tab[data-tab]').forEach(b => {
  b.addEventListener('click', async () => {
    $$('.sched-tab[data-tab]').forEach(x => x.classList.toggle('active', x === b));
    await ensureTabSlice(b.getAttribute('data-tab'));
  });
});

// + Add resource (left rail) → open the kind picker (Team Leader / Crew /
// Vehicle / Truck rental). Picking a kind navigates to the create form or
// (for "rental") opens the truck modal in place.
$$('.btn-sm.btn-ghost').filter(b => /^\+\s*add$/i.test(b.textContent.trim())).forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#schAddResourceModal');
  });
});
document.addEventListener('click', async (ev) => {
  const btn = ev.target.closest('.sch-kind-btn[data-kind]');
  if (!btn) return;
  ev.preventDefault();
  const kind = btn.getAttribute('data-kind');
  await safe('Create resource', async () => {
    const r = await comm.action('scheduling.resource.createPick', { kind });
    window.S1.modal.close('#schAddResourceModal');
    if (r && r.openModal) { window.S1.modal.open('#' + r.openModal); return; }
    if (r && r.navigateTo) { window.location.href = r.navigateTo; return; }
    // Fallback: no host wiring — point at sensible defaults.
    const map = { leader: '/Pages/Crew', member: '/Pages/Crew', vehicle: '/Pages/Fleet', rental: null };
    if (kind === 'rental') { window.S1.modal.open('#schTruckModal'); return; }
    if (map[kind]) window.location.href = map[kind];
  });
});

// Resource search
$$('input[placeholder="Search resources…"]').forEach(inp => {
  let t = null;
  inp.addEventListener('input', () => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {}, 300);
  });
});

// Job pill click → open job
document.addEventListener('click', async (ev) => {
  const pill = ev.target.closest('.sched-pill, .job-pill, [data-job-id]');
  if (!pill) return;
  const id = pill.getAttribute('data-record-id') || pill.getAttribute('data-job-id');
  if (!id) return;
  await safe('Open job', async () => {
    const r = await comm.action('scheduling.open', { id });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// When the fixture has more `teams` than the static page provides shells for,
// clone the last static .crew-cell + .lane pair to make room. New lanes get
// freshly-built .lane-cell backgrounds + a .tl-now marker so they look the
// same as the original four.
function ensureLaneShellsFor(n) {
  const grid = document.getElementById('tlGrid');
  if (!grid) return;
  let existing = grid.querySelectorAll('.crew-cell[data-team-idx]').length;
  while (existing < n) {
    const lastCell = grid.querySelector('.crew-cell[data-team-idx="' + (existing - 1) + '"]');
    const lastLane = grid.querySelector('.lane[data-lane="' + (existing - 1) + '"]');
    if (!lastCell || !lastLane) break;
    const cell = lastCell.cloneNode(true);
    cell.setAttribute('data-team-idx', String(existing));
    // Clear bound text so it reads as the new fixture entry on next bind().
    cell.querySelectorAll('[data-bind-text]').forEach(el => {
      const path = el.getAttribute('data-bind-text');
      el.setAttribute('data-bind-text', path.replace(/^teams\.\d+\./, 'teams.' + existing + '.'));
    });
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.setAttribute('data-lane', String(existing));
    for (let i = 0; i < 24; i++) {
      const c = document.createElement('div');
      c.className = 'lane-cell' + (i >= 6 && i < 20 ? ' shaded' : '');
      lane.appendChild(c);
    }
    const now = document.createElement('div');
    now.className = 'tl-now';
    now.style.left = 'calc(var(--hr-w) * ' + (14 + 18/60) + ')';
    lane.appendChild(now);
    // Insert before the .crew-drop placeholder so it stays at the bottom.
    const dropPlaceholder = grid.querySelector('.crew-drop');
    grid.insertBefore(cell, dropPlaceholder);
    grid.insertBefore(lane, dropPlaceholder);
    existing++;
  }
  // Also ensure the new lanes are wired for drag-drop.
  $$('.lane[data-lane]').forEach(l => {
    // wireLane is scoped inside the drag IIFE; rely on its own MutationObserver-
    // free re-check via the s1ui:ready listener it already registers.
  });
}

// Hide team rows whose fixture entry doesn't exist. The lane shells (.crew-cell
// + .lane) are static in the page because the inline .job positioning is hard
// to template; we drive their presence from `teams[].length`, then any extra
// per-lane jobs whose `timeline.laneN.J` slot is missing get hidden too.
function syncTeamRowsToFixture() {
  const state = (window.S1.fixtures || {})["scheduling"] || {};
  const teams = Array.isArray(state.teams) ? state.teams : [];
  const tl = state.timeline || {};
  ensureLaneShellsFor(teams.length);
  // Re-bind text on the freshly-cloned shells: their data-bind-text paths
  // were rewritten to teams.N.* but render.bind has already run for this
  // tick. Read the value out of the fixture directly.
  $$('.crew-cell[data-team-idx]').forEach(cell => {
    cell.querySelectorAll('[data-bind-text]').forEach(el => {
      const path = el.getAttribute('data-bind-text');
      let cur = state; path.split('.').forEach(k => { cur = cur && cur[k]; });
      if (cur != null) el.textContent = String(cur);
    });
  });
  $$('[data-team-idx]').forEach(cell => {
    const i = parseInt(cell.getAttribute('data-team-idx'), 10);
    const ok = i < teams.length && teams[i] != null;
    cell.style.display = ok ? '' : 'none';
    // Carry the real Crew.Id onto the cell+lane so drops post the correct
    // crew instead of a sequential lane index.
    if (ok && teams[i].crewId != null) cell.setAttribute('data-crew-id', String(teams[i].crewId));
    else cell.removeAttribute('data-crew-id');
    const lane = document.querySelector('.lane[data-lane="' + i + '"]');
    if (lane) {
      lane.style.display = ok ? '' : 'none';
      if (ok && teams[i].crewId != null) lane.setAttribute('data-crew-id', String(teams[i].crewId));
      else lane.removeAttribute('data-crew-id');
      // The .job tiles themselves (with real jobIds + assigned member/vehicle
      // chips) are rebuilt from state.timeline.laneN by renderTimelineLanes()
      // in the drag IIFE — it runs on s1ui:ready and on every state:replaced.
    }
  });
  // Freshly-cloned lanes (index > 3) need their truck/member chips painted on
  // the same tick. These renderers live inside the drag IIFE, so reach them
  // through their global bridges (bare names would be a ReferenceError here).
  if (typeof window.__sched_renderCrewTrucks  === 'function') window.__sched_renderCrewTrucks();
  if (typeof window.__sched_renderCrewMembers === 'function') window.__sched_renderCrewMembers();
}
document.addEventListener('s1ui:ready', syncTeamRowsToFixture);

// Timezone-aware time formatting. Locations carry an IANA tz; the active
// location's tz drives every [data-tz-time] element on the page. When
// no location is picked, fall back to header.companyTz.
let activeTz = null;
function pathGet(obj, path) {
  if (!obj || !path) return undefined;
  const parts = String(path).split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    if (cur == null) return undefined;
    cur = cur[parts[i]];
  }
  return cur;
}
function tzFormat(iso, tz, kind) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const opts = { timeZone: tz };
  try {
    if (kind === 'date') {
      const f = new Intl.DateTimeFormat(undefined, { ...opts, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      // "Sat, May 16, 2026" → "Sat · May 16, 2026" to match the original look.
      return f.format(d).replace(',', ' ·');
    }
    if (kind === 'time') {
      return new Intl.DateTimeFormat(undefined, { ...opts, hour: 'numeric', minute: '2-digit' }).format(d);
    }
    if (kind === 'now') {
      const t = new Intl.DateTimeFormat(undefined, { ...opts, hour: 'numeric', minute: '2-digit' }).format(d);
      return 'Now · ' + t;
    }
    return new Intl.DateTimeFormat(undefined, opts).format(d);
  } catch { return ''; }
}
function renderTimes() {
  const fx = (window.S1.fixtures || {}).scheduling || {};
  const tz = activeTz || pathGet(fx, 'header.companyTz') || undefined;
  if (!tz) return;
  $$('[data-tz-time]').forEach(el => {
    const path = el.getAttribute('data-tz-time');
    const kind = el.getAttribute('data-tz-format') || 'time';
    const iso  = pathGet(fx, path);
    const out  = tzFormat(iso, tz, kind);
    if (out) el.textContent = out;
  });
  relabelTimelineRuler();
}

// Each [data-starts-at] carries an ISO instant + duration in hours; we
// compute its hour-of-day in the active tz at *its own* date. This handles
// DST rule divergence (e.g. BC drops DST, ON keeps) per-job — the diff isn't
// taken once at "now" and applied uniformly.
function hourOffsetInTz(iso, tz) {
  const d = new Date(iso); if (isNaN(d.getTime())) return null;
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(d);
    const h = parseInt((parts.find(p => p.type === 'hour') || {}).value, 10);
    const m = parseInt((parts.find(p => p.type === 'minute') || {}).value, 10);
    if (isNaN(h) || isNaN(m)) return null;
    // Intl quirk: hour can come back as 24 for midnight in some locales.
    return ((h === 24 ? 0 : h)) + m / 60;
  } catch { return null; }
}
function relabelTimelineRuler() {
  const fx = (window.S1.fixtures || {}).scheduling || {};
  const tz = activeTz || pathGet(fx, 'header.companyTz');
  if (!tz) return;
  // Position each job by its own startsAt converted to the active tz.
  $$('.job[data-starts-at]').forEach(j => {
    const startsAt = j.getAttribute('data-starts-at');
    const duration = parseFloat(j.getAttribute('data-duration') || '0') || 0;
    const left = hourOffsetInTz(startsAt, tz);
    if (left == null) return;
    j.style.left  = 'calc(var(--hr-w) * ' + left.toFixed(3) + ')';
    j.style.width = 'calc(var(--hr-w) * ' + duration + ')';
  });
  // Now line — same instant as header.now, positioned in active tz.
  const nowIso = pathGet(fx, 'header.now');
  const nowH = hourOffsetInTz(nowIso, tz);
  if (nowH != null) {
    $$('.tl-now').forEach(n => { n.style.left = 'calc(var(--hr-w) * ' + nowH.toFixed(3) + ')'; });
  }
  // Ruler is always 12am..11pm in the active tz (anchored to active-tz
  // midnight), so labels never need re-shifting per-job — they're stable.
  const ruler = document.getElementById('tlHours');
  if (ruler) {
    const nowCell = nowH == null ? -1 : Math.floor(nowH);
    ruler.querySelectorAll('.tl-hour').forEach((cell, i) => {
      cell.classList.toggle('hr-now', i === nowCell);
      cell.textContent = i === 0 ? '12am' : (i < 12 ? (i + 'am') : (i === 12 ? '12pm' : (i - 12) + 'pm'));
    });
  }
}
document.addEventListener('s1ui:ready', renderTimes);

// Bulk select for customer/team confirmations: each button is paired with
// its target table via data-bulk-select / data-bulk-table. Clicking the
// button toggles a 'select-mode' class on that table; in that mode, row
// clicks toggle '.selected'. The button text reflects the live count.
function refreshBulkButton(btn, table) {
  const on  = table.classList.contains('select-mode');
  const sel = table.querySelectorAll('tbody tr.selected').length;
  btn.textContent = on
    ? (sel ? '✕ Cancel · ' + sel + ' selected' : '✕ Cancel select')
    : '📋 Bulk select';
}
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-bulk-select]'); if (!b) return;
  ev.preventDefault();
  const key   = b.getAttribute('data-bulk-select');
  const table = document.querySelector('[data-bulk-table="' + key + '"]');
  if (!table) return;
  table.classList.toggle('select-mode');
  if (!table.classList.contains('select-mode')) {
    table.querySelectorAll('tbody tr.selected').forEach(r => r.classList.remove('selected'));
  }
  refreshBulkButton(b, table);
});
document.addEventListener('click', (ev) => {
  const tr = ev.target.closest('[data-bulk-table].select-mode tbody tr');
  if (!tr) return;
  // Ignore clicks on row-internal buttons so they still fire their own actions.
  if (ev.target.closest('button, a, input, select, textarea')) return;
  tr.classList.toggle('selected');
  const table = tr.closest('[data-bulk-table]');
  const btn   = document.querySelector('[data-bulk-select="' + table.getAttribute('data-bulk-table') + '"]');
  if (btn) refreshBulkButton(btn, table);
});

// Deals subtab (Unscheduled / Closed) + dynamic counts.
let activeLocationWant = '';   // '' = all; otherwise lower-case location name
function refreshJobsSubtabCounts() {
  $$('.jobs-subtab[data-jobs-subtab]').forEach(tab => {
    const key  = tab.getAttribute('data-jobs-subtab');
    const pane = document.querySelector('.jobs-list[data-jobs-pane="' + key + '"]');
    if (!pane) return;
    let visible = 0;
    pane.querySelectorAll('.job-card').forEach(card => {
      if (!activeLocationWant) { visible++; return; }
      const loc = (card.getAttribute('data-location') || '').toLowerCase();
      if (loc ? (loc === activeLocationWant) : (card.textContent || '').toLowerCase().includes(activeLocationWant)) visible++;
    });
    const cnt = tab.querySelector('.jobs-subtab-count');
    if (cnt) cnt.textContent = String(visible);
  });
}
function switchJobsSubtab(key) {
  $$('.jobs-subtab[data-jobs-subtab]').forEach(t => t.classList.toggle('active', t.getAttribute('data-jobs-subtab') === key));
  $$('.jobs-list[data-jobs-pane]').forEach(p => { p.style.display = (p.getAttribute('data-jobs-pane') === key) ? '' : 'none'; });
}
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('.jobs-subtab[data-jobs-subtab]'); if (!b) return;
  ev.preventDefault();
  switchJobsSubtab(b.getAttribute('data-jobs-subtab'));
});
document.addEventListener('s1ui:ready', refreshJobsSubtabCounts);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', refreshJobsSubtabCounts);
}

// Truck Rentals filter chips (All / Active / Returning / Upcoming).
// Each card's status comes from the .pill text inside it; match the chip's
// data-tr-filter against the pill text (case-insensitive contains).
function applyTrFilter(key) {
  $$('.tv-filters [data-tr-filter]').forEach(b => b.classList.toggle('active', b.getAttribute('data-tr-filter') === key));
  $$('[data-bind="truckRentalCards"] .tr-card').forEach(card => {
    if (key === 'all') { card.style.display = ''; return; }
    const pill = (card.querySelector('.pill') || {}).textContent || '';
    card.style.display = pill.toLowerCase().includes(key) ? '' : 'none';
  });
}
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('.tv-filters [data-tr-filter]'); if (!b) return;
  ev.preventDefault();
  applyTrFilter(b.getAttribute('data-tr-filter'));
});
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderTimes);
}

// Location dropdown in the page header — toggle the menu, react to item
// clicks by updating the header label and filtering the visible jobs.
(function () {
  const btn  = document.getElementById('phLocBtn');
  const menu = document.getElementById('phLocMenu');
  if (!btn || !menu) return;
  function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
  function open()  { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  btn.addEventListener('click', (ev) => {
    ev.preventDefault(); ev.stopPropagation();
    if (menu.hidden) open(); else close();
  });
  document.addEventListener('click', (ev) => {
    if (menu.hidden) return;
    if (!menu.contains(ev.target) && ev.target !== btn) close();
  });
  // Item picks (delegated because items come from a template).
  menu.addEventListener('click', async (ev) => {
    const item = ev.target.closest('.ph-loc-item'); if (!item) return;
    const id    = item.getAttribute('data-loc-id');
    const label = item.querySelector('span:first-child').textContent.trim();
    btn.setAttribute('data-scheduling-filter', id);
    const lbl = btn.querySelector('.ph-loc-label');
    if (lbl) lbl.textContent = label;
    close();
    // Switch timezone to the picked location's tz, fall back to company tz.
    const fx = (window.S1.fixtures || {}).scheduling || {};
    const loc = (fx.locations || []).find(l => l && l.id === id);
    activeTz = (loc && loc.tz) || null;
    renderTimes();
    // Filter visible items across all the scheduling views. Where items
    // carry an explicit data-location, match exactly; otherwise fall back
    // to text-contains.
    const want = (id === 'all') ? '' : label.toLowerCase();
    activeLocationWant = want;
    const filterByLoc = (el) => {
      if (!want) { el.style.display = ''; return; }
      const loc = (el.getAttribute('data-location') || '').toLowerCase();
      if (loc) { el.style.display = (loc === want) ? '' : 'none'; return; }
      el.style.display = (el.textContent || '').toLowerCase().includes(want) ? '' : 'none';
    };
    // Scheduling tab — timeline jobs in lanes.
    $$('.lane[data-lane] > .job').forEach(filterByLoc);
    // Both deals lists (Unscheduled + Closed). Cards carry data-location.
    $$('.jobs-list .job-card').forEach(filterByLoc);
    refreshJobsSubtabCounts();
    // Resource Calendar — week view: each row carries its location via
    // data-location (set by the calRows template). Hide rows whose
    // location doesn't match the picked one.
    $$('.cal-rows .cal-row').forEach(row => {
      if (!want) { row.style.display = ''; return; }
      const loc = (row.getAttribute('data-location') || '').toLowerCase();
      row.style.display = (loc === want) ? '' : 'none';
    });
    await safe('Filter location', () => comm.action('scheduling.filter.location', { id, label }));
    flash(label);
  });
})();

// Day-off requests: tag each .do-req with a synthetic id so the inline
// Approve/Deny/Message buttons (data-comm-action) carry it via the
// collectPayload scope walk. Without this, every button posted an empty
// payload — "action:scheduling.approve {}" — useless to the host.
(function () {
  $$('.do-col .do-req').forEach((row, i) => {
    if (row.hasAttribute('data-record-id')) return;
    row.setAttribute('data-record-id', String(i + 1));
    const nm = row.querySelector('.nm');
    if (nm) row.setAttribute('data-employee-name', nm.textContent.trim());
    const datesEl = row.querySelector('.dates strong');
    if (datesEl) row.setAttribute('data-dates', datesEl.textContent.trim());
    const reasonEl = row.querySelector('.reason');
    if (reasonEl) row.setAttribute('data-reason', reasonEl.textContent.trim());
  });
})();

// AI fab

// ────────────────────────────────────────────────────────────────────────
// Drag-and-drop dispatch — modeled on Pages/Scheduling/Daily.cshtml.
//
// HTML this targets (the redesign mockup):
//   .tl-grid#tlGrid   — the timeline grid, has CSS var --hr-w (px per hour)
//   .lane[data-lane]  — per-team drop targets, 24 hours wide
//   .job              — jobs already placed inside a .lane
//   .job-card         — unscheduled jobs in the right "Deals" panel
//   .r-row            — resources (leaders/movers/drivers/helpers/fleet) in
//                       the left rail; class names on .av distinguish kind
//   .resources, .jobs — removal drop zones (drag a placed job/member back)
//   .crew-drop        — drop-to-create-team zone at the bottom of the grid
//
// The page is a static mockup with no IDs — we synthesise stable IDs from
// DOM index + the first text line. Payload format is the same wire the
// Daily.cshtml drag system uses so the host-side dispatcher can match:
//   "<kind>:<id>"  where kind ∈ {employee, vehicle, job, timeline-job}
// ────────────────────────────────────────────────────────────────────────
(function () {
  const FIRST_VISIBLE_HOUR = 0;
  const TOTAL_VISIBLE_SLOTS = 24;

  function hrW() {
    const grid = document.getElementById('tlGrid');
    if (!grid) return 64;
    const v = getComputedStyle(grid).getPropertyValue('--hr-w').trim();
    const px = parseFloat(v);
    return isFinite(px) && px > 0 ? px : 64;
  }

  function calcHourFromX(lane, clientX) {
    const rect = lane.getBoundingClientRect();
    const xPx  = Math.max(0, Math.min(rect.width, clientX - rect.left));
    // Snap to the nearest half-hour for a more useful drop precision.
    const half = Math.round((xPx / hrW()) * 2) / 2 + FIRST_VISIBLE_HOUR;
    const max  = FIRST_VISIBLE_HOUR + TOTAL_VISIBLE_SLOTS - 0.5;
    return Math.max(FIRST_VISIBLE_HOUR, Math.min(max, half));
  }

  function selectedDate() {
    const el = document.querySelector('.date-cur');
    const m = el && (el.textContent || '').match(/([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);
    if (!m) return new Date().toISOString().slice(0, 10);
    const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m[1].slice(0,3));
    return new Date(parseInt(m[3],10), mo, parseInt(m[2],10)).toISOString().slice(0,10);
  }

  // ── Synthesise stable IDs and labels for the mockup nodes ────────────
  function firstLine(el) {
    const t = (el.textContent || '').trim();
    return t.split('\n')[0].slice(0, 80);
  }
  function labelOf(el, kind) {
    if (kind === 'employee' || kind === 'vehicle') {
      const nm = el.querySelector('.nm'); if (nm) return nm.textContent.trim();
    }
    if (kind === 'job' || kind === 'timeline-job') {
      const jt = el.querySelector('.jt, .jc-customer'); if (jt) return jt.textContent.trim();
    }
    return firstLine(el);
  }
  function tagSources() {
    // Resources: every .r-list .r-row gets a kind + synthetic id by index.
    $$('.r-list .r-row').forEach((row, i) => {
      // A real id rendered from state (data-drag-id="{{id}}") wins; only
      // synthesise an index when the attribute is missing or empty.
      if (row.getAttribute('data-drag-id')) return;
      const av = row.querySelector('.av');
      const cls = av ? av.className : '';
      let kind = 'employee';
      if (/\bveh\b/.test(cls))         kind = 'vehicle';
      else if (/\blead\b/.test(cls))   kind = 'employee';
      else if (/\bmover\b/.test(cls))  kind = 'employee';
      else if (/\bdriver\b/.test(cls)) kind = 'employee';
      else if (/\bhelper\b/.test(cls)) kind = 'employee';
      row.setAttribute('draggable', 'true');
      row.setAttribute('data-drag-kind', kind);
      row.setAttribute('data-drag-id', String(i + 1));
      row.setAttribute('data-drag-label', labelOf(row, kind));
      row.style.cursor = 'grab';
    });
    // Unscheduled jobs (right rail).
    $$('.jobs-list .job-card').forEach((card, i) => {
      if (card.hasAttribute('data-drag-id')) return;
      const idEl = card.querySelector('.jc-id');
      const id = idEl ? idEl.textContent.trim().replace(/[^0-9]/g, '') : String(i + 1);
      card.setAttribute('draggable', 'true');
      card.setAttribute('data-drag-kind', 'job');
      card.setAttribute('data-drag-id', id || String(i + 1));
      card.setAttribute('data-drag-label', labelOf(card, 'job'));
      card.style.cursor = 'grab';
    });
    // Already-placed jobs (inside .lane).
    $$('.lane .job').forEach((job, i) => {
      if (job.hasAttribute('data-drag-id')) return;
      job.setAttribute('draggable', 'true');
      job.setAttribute('data-drag-kind', 'timeline-job');
      job.setAttribute('data-drag-id', String(i + 1));
      job.setAttribute('data-drag-label', labelOf(job, 'timeline-job'));
      job.style.cursor = 'grab';
    });
  }
  tagSources();
  // Expose so the MutationObserver outside this IIFE can retag.
  window.__sched_tagSources = tagSources;
  // Re-tag whenever the render pipeline rebuilds the DOM.
  document.addEventListener('s1ui:ready', tagSources);
  if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
    window.S1.bus.on('state:replaced', tagSources);
  }

  // ── Ghost preview shown while dragging ───────────────────────────────
  let ghost = null;
  function showGhost(label, x, y) {
    ghost = document.createElement('div');
    ghost.className = 'sched-drag-ghost';
    ghost.textContent = label;
    ghost.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;opacity:0.85;'
      + 'background:#fff;border:1.5px solid var(--terra, #d97757);border-radius:8px;'
      + 'box-shadow:0 8px 24px rgba(0,0,0,0.18);padding:6px 10px;font-size:12px;'
      + 'font-weight:600;color:#222;white-space:nowrap;max-width:240px;overflow:hidden;'
      + 'text-overflow:ellipsis;';
    document.body.appendChild(ghost);
    moveGhost(x, y);
  }
  function moveGhost(x, y) { if (ghost) { ghost.style.left = (x + 12) + 'px'; ghost.style.top = (y - 18) + 'px'; } }
  function killGhost()     { if (ghost) { ghost.remove(); ghost = null; } }

  function parsePayload(raw) {
    if (!raw) return null;
    const m = raw.split(':');
    if (m.length < 2) return null;
    // 3-part chip-removal payloads: "job-member:JOBID:USERID" /
    // "job-vehicle:JOBID:VEHICLEID" — carry both the job and the resource id.
    if (m.length >= 3 && (m[0] === 'job-member' || m[0] === 'job-vehicle')) {
      return { kind: m[0], jobId: m[1], id: m[2] };
    }
    return { kind: m[0], id: m[1] };
  }

  // Module-scoped reference to the element currently being dragged. Looking
  // it up by `[data-drag-id]` after the drop is unreliable: tagSources can
  // re-run between dragstart and drop (s1ui:ready) and reshuffle the ids.
  let activeDrag = null;

  // ── Drag start / end (delegated, covers re-rendered nodes) ───────────
  document.addEventListener('dragstart', (e) => {
    const t = e.target;
    const el = (t && t.nodeType === 1) ? t.closest('[data-drag-id][data-drag-kind]') : null;
    if (!el) return;
    const kind = el.getAttribute('data-drag-kind');
    const id   = el.getAttribute('data-drag-id');
    const lbl  = el.getAttribute('data-drag-label') || '';
    const payload = kind + ':' + id;
    activeDrag = { el, kind, id, label: lbl };
    e.dataTransfer.effectAllowed = (kind === 'timeline-job') ? 'move' : 'copyMove';
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.setData('application/x-sched-drag', payload);
    el.classList.add('dragging');
    // Hide the OS drag-image (we render our own ghost in dragover/touchmove).
    try {
      const blank = document.createElement('canvas'); blank.width = blank.height = 1;
      e.dataTransfer.setDragImage(blank, 0, 0);
    } catch {}
    showGhost(lbl, e.clientX, e.clientY);
    // Show removal-zone hints when dragging *placed* items off the lane.
    if (kind === 'timeline-job') {
      const jp = document.querySelector('.jobs'); if (jp) jp.classList.add('drop-remove-highlight');
    }
    // Show the drop-to-create lane hint while dragging a leader-kind resource.
    if (kind === 'employee') {
      const cd = document.querySelector('.crew-drop'); if (cd) cd.classList.add('visible');
    }
  });
  document.addEventListener('drag', (e) => {
    if (ghost && (e.clientX || e.clientY)) moveGhost(e.clientX, e.clientY);
  });
  function cleanupDragVisuals() {
    $$('.dragging').forEach(x => x.classList.remove('dragging'));
    $$('.lane.drag-over, .crew-cell.drag-over, .crew-drop.drag-over, .jobs.drop-remove-highlight, .resources.drop-remove-highlight')
      .forEach(x => { x.classList.remove('drag-over'); x.classList.remove('drop-remove-highlight'); });
    const cd = document.querySelector('.crew-drop'); if (cd) cd.classList.remove('visible');
    killGhost();
  }
  document.addEventListener('dragend', () => { cleanupDragVisuals(); activeDrag = null; });

  // Belt-and-braces: any element along the path that's marked as a sched-drag
  // target needs preventDefault on dragover for HTML5 to accept the drop. Some
  // browsers ignore the lane's bubbled preventDefault if a child intercepted
  // dragover earlier without one. This document-level listener guarantees it.
  document.addEventListener('dragover', (e) => {
    if (!activeDrag) return;
    const t = e.target;
    const el = (t && t.nodeType === 1) ? t.closest('.lane[data-lane], .crew-cell[data-crew-id], .jobs, .crew-drop') : null;
    if (el) { e.preventDefault(); e.dataTransfer.dropEffect = (activeDrag.kind === 'timeline-job' ? 'move' : 'copy'); }
    if (ghost && (e.clientX || e.clientY)) moveGhost(e.clientX, e.clientY);
  });

  // Re-evaluate conflicts inside a lane. A .job is a conflict iff it overlaps
  // any OTHER visible .job in the same lane. Conflicts get .bad + hidden tick.
  // Non-conflict jobs restore their data-orig-color swatch.
  const SWATCHES = ['terra','info','plum','teal','warn','gold','bad','rose'];
  function jobInterval(job) {
    const ml = job.style.left  && job.style.left.match(/\* ?([\d.]+)/);
    const mw = job.style.width && job.style.width.match(/\* ?([\d.]+)/);
    if (!ml || !mw) return null;
    const s = parseFloat(ml[1]); return { s, e: s + parseFloat(mw[1]) };
  }
  function origColor(job) {
    let c = job.getAttribute('data-orig-color');
    if (c) return c;
    c = SWATCHES.find(s => job.classList.contains(s) && s !== 'bad') || 'terra';
    job.setAttribute('data-orig-color', c);
    return c;
  }
  function recomputeConflicts(lane) {
    const jobs = $$(':scope > .job', lane).filter(j => j.style.display !== 'none');
    jobs.forEach(j => origColor(j));   // record original before any mutation
    jobs.forEach(j => {
      const a = jobInterval(j); if (!a) return;
      const clash = jobs.some(k => {
        if (k === j) return false;
        const b = jobInterval(k); if (!b) return false;
        return a.s < b.e - 1e-6 && b.s < a.e - 1e-6;
      });
      const c = j.querySelector(':scope > .conf');
      if (clash) {
        SWATCHES.forEach(s => j.classList.remove(s));
        j.classList.add('bad');
        if (c) c.style.display = 'none';
      } else {
        SWATCHES.forEach(s => j.classList.remove(s));
        j.classList.add(origColor(j));
        if (c) c.style.display = '';
        // Strip the "Conflict · " prefix from the title if we added one.
        const jt = j.querySelector(':scope > .jt');
        if (jt && /^Conflict · /.test(jt.textContent)) jt.textContent = jt.textContent.replace(/^Conflict · /, '');
      }
    });
  }
  function recomputeAllLanes() { $$('.lane[data-lane]').forEach(recomputeConflicts); }
  document.addEventListener('s1ui:ready', recomputeAllLanes);

  // ── Drop targets: every .lane[data-lane] ─────────────────────────────
  function wireLane(lane) {
    if (lane.__s1Wired) return; lane.__s1Wired = true;
    lane.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      lane.classList.add('drag-over');
      moveGhost(e.clientX, e.clientY);
    });
    lane.addEventListener('dragenter', (e) => { e.preventDefault(); lane.classList.add('drag-over'); });
    lane.addEventListener('dragleave', (e) => {
      if (!lane.contains(e.relatedTarget)) lane.classList.remove('drag-over');
    });
    lane.addEventListener('drop', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      lane.classList.remove('drag-over');
      // Clean up *before* mutating the DOM. If the optimistic UI removes the
      // source element, the browser will skip `dragend` (source detached) and
      // the ghost would otherwise persist on screen ("M. Lee gets stuck").
      cleanupDragVisuals();
      const raw  = e.dataTransfer.getData('application/x-sched-drag') || e.dataTransfer.getData('text/plain') || '';
      const info = parsePayload(raw); if (!info) return;
      const crewId    = parseInt(lane.getAttribute('data-crew-id'), 10);
      const date      = selectedDate();
      const startHour = calcHourFromX(lane, e.clientX);
      if (!crewId) { flash('This lane has no crew yet'); activeDrag = null; return; }
      if (info.kind === 'employee') {
        await safe('Add member', async () => {
          const r = await comm.action('scheduling.add-member', { crewId, employeeId: Number(info.id), date });
          if (r && r.ok) { flash('Added to crew'); await load(); }
        });
      } else if (info.kind === 'vehicle') {
        await safe('Add vehicle', async () => {
          const r = await comm.action('scheduling.add-vehicle', { crewId, vehicleId: Number(info.id), date });
          if (r && r.ok) { flash('Vehicle added'); await load(); }
        });
      } else if (info.kind === 'job' || info.kind === 'timeline-job') {
        const draggedEl = activeDrag && activeDrag.el;
        // Estimate the new job's footprint (in hours) to detect overlaps.
        // For a moved timeline-job, read its current width; for a new job
        // dropped from the panel, default to a 3-hour block.
        const widthHr = (() => {
          if (draggedEl && draggedEl.style && draggedEl.style.width) {
            const m = draggedEl.style.width.match(/\* ?([\d.]+)/);
            if (m) return parseFloat(m[1]);
          }
          return 3;
        })();
        const newStart = startHour;
        const newEnd   = startHour + widthHr;
        // Local conflict detection: look at every OTHER .job already in the
        // target lane and check for time-interval overlap. The host returns
        // its own conflictWarning when it has DB context; this catches the
        // mock/iframe case where the fixture is the source of truth.
        const overlaps = $$(':scope > .job', lane).filter(j => {
          if (j === draggedEl) return false;
          if (j.style.display === 'none') return false;
          const ml = j.style.left  && j.style.left.match(/\* ?([\d.]+)/);
          const mw = j.style.width && j.style.width.match(/\* ?([\d.]+)/);
          if (!ml || !mw) return false;
          const os = parseFloat(ml[1]);
          const oe = os + parseFloat(mw[1]);
          return newStart < oe - 1e-6 && os < newEnd - 1e-6;
        });
        const sourceLane = draggedEl && draggedEl.closest('.lane[data-lane]');
        await safe('Assign job', async () => {
          const r = await comm.action('scheduling.assign-job', { jobId: Number(info.id), crewId, date, startHour, hasConflict: overlaps.length > 0 });
          if (r && r.ok && draggedEl) {
            if (info.kind === 'timeline-job') {
              draggedEl.style.left = 'calc(var(--hr-w) * ' + startHour + ')';
              lane.appendChild(draggedEl);
            } else {
              const placed = document.createElement('div');
              placed.className = 'job terra';
              placed.setAttribute('data-orig-color', 'terra');
              placed.style.cssText = 'left:calc(var(--hr-w) * ' + startHour + ');width:calc(var(--hr-w) * ' + widthHr + ');';
              const jt = document.createElement('div'); jt.className = 'jt';
              jt.textContent = draggedEl.getAttribute('data-drag-label') || 'Job';
              placed.appendChild(jt);
              placed.setAttribute('draggable', 'true');
              placed.setAttribute('data-drag-kind', 'timeline-job');
              placed.setAttribute('data-drag-id', info.id);
              placed.setAttribute('data-drag-label', draggedEl.getAttribute('data-drag-label') || 'Job');
              lane.appendChild(placed);
              draggedEl.remove();
            }
            // Recompute conflict state on both the destination and the source
            // lane (the latter may have just been freed of an overlap).
            recomputeConflicts(lane);
            if (sourceLane && sourceLane !== lane) recomputeConflicts(sourceLane);
            const stillConflicting = $$(':scope > .job.bad', lane).length;
            if (stillConflicting) flash('⚠ Conflict: ' + stillConflicting + ' overlapping job' + (stillConflicting > 1 ? 's' : '') + ' on this crew');
            else if (r.conflictWarning) flash('⚠ ' + r.conflictWarning);
            else flash('Assigned at ' + startHour + ':00');
          }
        });
      }
      activeDrag = null;
    });
  }
  $$('.lane[data-lane]').forEach(wireLane);
  document.addEventListener('s1ui:ready', () => $$('.lane[data-lane]').forEach(wireLane));

  // ── Drop target: the team card itself (.crew-cell). Mirrors wireLane but
  //    accepts a fleet truck (→ scheduling.add-vehicle) or a person
  //    (→ scheduling.add-member) dropped directly on the card. ───────────
  function wireCrewCell(cell) {
    if (cell.__s1CellWired) return; cell.__s1CellWired = true;
    cell.addEventListener('dragover', (e) => {
      if (!activeDrag) return;
      if (activeDrag.kind !== 'vehicle' && activeDrag.kind !== 'employee') return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      cell.classList.add('drag-over');
      moveGhost(e.clientX, e.clientY);
    });
    cell.addEventListener('dragenter', (e) => {
      if (!activeDrag || (activeDrag.kind !== 'vehicle' && activeDrag.kind !== 'employee')) return;
      e.preventDefault(); cell.classList.add('drag-over');
    });
    cell.addEventListener('dragleave', (e) => {
      if (!cell.contains(e.relatedTarget)) cell.classList.remove('drag-over');
    });
    cell.addEventListener('drop', async (e) => {
      const raw  = e.dataTransfer.getData('application/x-sched-drag') || e.dataTransfer.getData('text/plain') || '';
      const info = parsePayload(raw);
      cell.classList.remove('drag-over');
      if (!info || (info.kind !== 'vehicle' && info.kind !== 'employee')) return;
      e.preventDefault();
      e.stopPropagation();
      cleanupDragVisuals();
      const crewId = parseInt(cell.getAttribute('data-crew-id'), 10);
      const date   = selectedDate();
      if (!crewId) { flash('This team has no crew yet'); activeDrag = null; return; }
      if (info.kind === 'vehicle') {
        await safe('Add truck', async () => {
          const r = await comm.action('scheduling.add-vehicle', { crewId, vehicleId: Number(info.id), date });
          if (r && r.ok) { flash('Truck added'); await load(); }
        });
      } else {
        await safe('Add member', async () => {
          const r = await comm.action('scheduling.add-member', { crewId, employeeId: Number(info.id), date });
          if (r && r.ok) { flash('Added to crew'); await load(); }
        });
      }
      activeDrag = null;
    });
  }
  $$('.crew-cell[data-crew-id]').forEach(wireCrewCell);
  document.addEventListener('s1ui:ready', () => $$('.crew-cell[data-crew-id]').forEach(wireCrewCell));

  // ── Render assigned-truck chips on every team card (static + cloned). ──
  // Built from state.teams[idx].trucks with createElement/textContent only
  // (no innerHTML — security rule 2), so it works for cloned cells too.
  function renderCrewTrucks() {
    const state = (window.S1.fixtures || {})['scheduling'] || {};
    const teams = Array.isArray(state.teams) ? state.teams : [];
    $$('.crew-cell[data-team-idx]').forEach((cell) => {
      const host = cell.querySelector('[data-crew-trucks]');
      if (!host) return;
      while (host.firstChild) host.removeChild(host.firstChild);
      const idx = parseInt(cell.getAttribute('data-team-idx'), 10);
      const team = teams[idx];
      const trucks = (team && Array.isArray(team.trucks)) ? team.trucks : [];
      const crewId = cell.getAttribute('data-crew-id');
      trucks.forEach((tk) => {
        if (!tk) return;
        const chip = document.createElement('span');
        chip.className = 'truck-chip';
        if (tk.vehicleId != null) chip.setAttribute('data-veh-id', String(tk.vehicleId));
        const txt = document.createElement('span');
        txt.textContent = '🚚 ' + String(tk.name || ('#' + tk.vehicleId));
        chip.appendChild(txt);
        const x = document.createElement('button');
        x.type = 'button';
        x.className = 'truck-x';
        x.setAttribute('draggable', 'false');
        x.setAttribute('title', 'Remove truck');
        x.textContent = '×';
        x.addEventListener('click', async (ev) => {
          ev.preventDefault(); ev.stopPropagation();
          const cid = parseInt(crewId, 10);
          const vid = Number(tk.vehicleId);
          if (!cid || !vid) return;
          await safe('Remove truck', async () => {
            const r = await comm.action('scheduling.remove-vehicle', { crewId: cid, vehicleId: vid, date: selectedDate() });
            if (r && r.ok) { flash('Truck removed'); await load(); }
          });
        });
        chip.appendChild(x);
        host.appendChild(chip);
      });
    });
  }
  window.__sched_renderCrewTrucks = renderCrewTrucks;
  document.addEventListener('s1ui:ready', renderCrewTrucks);
  if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
    window.S1.bus.on('state:replaced', renderCrewTrucks);
  }

  // ── Member name chips: list every person scheduled on the crew for the
  //    viewed day (avatar + full name + remove button). Mirrors
  //    renderCrewTrucks. Beyond MAX_VISIBLE_MEMBERS, collapse behind a
  //    "+N more" chip that expands in place so tall crews stay compact. ──
  const MAX_VISIBLE_MEMBERS = 6;
  function renderCrewMembers() {
    const state = (window.S1.fixtures || {})['scheduling'] || {};
    const teams = Array.isArray(state.teams) ? state.teams : [];
    $$('.crew-cell[data-team-idx]').forEach((cell) => {
      const host = cell.querySelector('[data-crew-members]');
      if (!host) return;
      while (host.firstChild) host.removeChild(host.firstChild);
      const idx = parseInt(cell.getAttribute('data-team-idx'), 10);
      const team = teams[idx];
      const members = (team && Array.isArray(team.members)) ? team.members : [];
      const crewId = cell.getAttribute('data-crew-id');
      let expanded = false;
      function paint() {
        while (host.firstChild) host.removeChild(host.firstChild);
        const limit = expanded ? members.length : Math.min(members.length, MAX_VISIBLE_MEMBERS);
        members.slice(0, limit).forEach((m) => {
          if (!m) return;
          const chip = document.createElement('span');
          chip.className = 'member-chip';
          if (m.employeeId != null) chip.setAttribute('data-emp-id', String(m.employeeId));
          const av = document.createElement('span');
          av.className = 'member-av';
          av.textContent = String(m.initials || '');
          const nm = document.createElement('span');
          nm.className = 'm-name';
          nm.textContent = String(m.name || ('#' + m.employeeId));
          const x = document.createElement('button');
          x.type = 'button';
          x.className = 'member-x';
          x.setAttribute('draggable', 'false');
          x.setAttribute('title', 'Remove member');
          x.textContent = '×';
          x.addEventListener('click', async (ev) => {
            ev.preventDefault(); ev.stopPropagation();
            const cid = parseInt(crewId, 10);
            const eid = Number(m.employeeId);
            if (!cid || !eid) return;
            await safe('Remove member', async () => {
              const r = await comm.action('scheduling.remove-member', { crewId: cid, employeeId: eid, date: selectedDate() });
              if (r && r.ok) { flash('Member removed'); await load(); }
            });
          });
          chip.appendChild(av); chip.appendChild(nm); chip.appendChild(x);
          host.appendChild(chip);
        });
        if (!expanded && members.length > MAX_VISIBLE_MEMBERS) {
          const more = document.createElement('span');
          more.className = 'member-more';
          more.textContent = '+' + (members.length - MAX_VISIBLE_MEMBERS) + ' more';
          more.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); expanded = true; paint(); });
          host.appendChild(more);
        }
      }
      paint();
    });
  }
  window.__sched_renderCrewMembers = renderCrewMembers;
  document.addEventListener('s1ui:ready', renderCrewMembers);
  if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
    window.S1.bus.on('state:replaced', renderCrewMembers);
  }

  // ── Job tiles as drop targets: drop a person/vehicle onto a particular
  //    job to schedule them to that job (adds them to the job's crew). ──
  function jobIdOf(el) {
    return el.getAttribute('data-job-id') || el.getAttribute('data-record-id') || '';
  }
  function wireJob(jobEl) {
    if (jobEl.__s1JobWired) return; jobEl.__s1JobWired = true;
    jobEl.addEventListener('dragover', (e) => {
      if (!activeDrag) return;
      if (activeDrag.kind !== 'employee' && activeDrag.kind !== 'vehicle') return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      jobEl.classList.add('drag-over-job');
    });
    jobEl.addEventListener('dragleave', (e) => {
      if (!jobEl.contains(e.relatedTarget)) jobEl.classList.remove('drag-over-job');
    });
    jobEl.addEventListener('drop', async (e) => {
      const raw  = e.dataTransfer.getData('application/x-sched-drag') || e.dataTransfer.getData('text/plain') || '';
      const info = parsePayload(raw);
      jobEl.classList.remove('drag-over-job');
      if (!info || (info.kind !== 'employee' && info.kind !== 'vehicle')) return; // jobs bubble to the lane
      e.preventDefault();
      e.stopPropagation();
      cleanupDragVisuals();
      const jobId = Number(jobIdOf(jobEl));
      if (!jobId) { flash('This job has no id yet'); activeDrag = null; return; }
      if (info.kind === 'employee') {
        await safe('Schedule member', async () => {
          const r = await comm.action('scheduling.assign-member-to-job', { jobId, employeeId: Number(info.id) });
          if (r && r.ok) { flash('Scheduled to job'); await load(); }
        });
      } else {
        await safe('Schedule vehicle', async () => {
          const r = await comm.action('scheduling.assign-vehicle-to-job', { jobId, vehicleId: Number(info.id) });
          if (r && r.ok) { flash('Vehicle scheduled to job'); await load(); }
        });
      }
      activeDrag = null;
    });
  }

  // Remove a person/vehicle from a job (chip "×" click or drop on the rail).
  async function removeFromJob(kind, jobId, id) {
    if (!jobId || !id) return;
    if (kind === 'job-member') {
      await safe('Remove member', async () => {
        const r = await comm.action('scheduling.remove-member-from-job', { jobId: Number(jobId), employeeId: Number(id) });
        if (r && r.ok) { flash('Removed from job'); await load(); }
      });
    } else if (kind === 'job-vehicle') {
      await safe('Remove vehicle', async () => {
        const r = await comm.action('scheduling.remove-vehicle-from-job', { jobId: Number(jobId), vehicleId: Number(id) });
        if (r && r.ok) { flash('Vehicle removed from job'); await load(); }
      });
    }
  }

  // ── Render timeline job tiles + assigned chips from state ───────────
  // Each .lane[data-lane=N] is rebuilt from state.timeline.laneN[] so every
  // tile carries the REAL jobId (drag/assign target) and shows the people +
  // trucks actually assigned to that job's crew. Built with createElement +
  // textContent only (no innerHTML — security rule 2).
  const SWATCH_LIST = ['terra','info','plum','teal','warn','gold','bad','rose'];
  function makeChip(kind, jobId, id, label, swatchClass) {
    const chip = document.createElement('span');
    chip.className = swatchClass;
    chip.setAttribute('draggable', 'true');
    chip.setAttribute('data-drag-kind', kind);
    chip.setAttribute('data-drag-id', jobId + ':' + id);
    chip.setAttribute('data-drag-label', label);
    chip.style.cursor = 'grab';
    const txt = document.createElement('span');
    txt.textContent = label;
    chip.appendChild(txt);
    const x = document.createElement('button');
    x.type = 'button';
    x.className = 'tj-chip-x';
    x.textContent = '×';
    x.setAttribute('draggable', 'false');
    x.addEventListener('click', (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      removeFromJob(kind, jobId, id);
    });
    chip.appendChild(x);
    return chip;
  }
  function renderTimelineLanes() {
    const state = (window.S1.fixtures || {})['scheduling'] || {};
    const tl = state.timeline || {};
    $$('.lane[data-lane]').forEach((lane) => {
      const idx = lane.getAttribute('data-lane');
      const items = (tl['lane' + idx] || []);
      // Clear existing tiles (rebuild from state).
      Array.from(lane.querySelectorAll(':scope > .job')).forEach(j => j.remove());
      items.forEach((slot) => {
        if (!slot) return;
        const job = document.createElement('div');
        const color = SWATCH_LIST.indexOf(String(slot.color)) >= 0 ? String(slot.color) : 'terra';
        job.className = 'job ' + color;
        job.setAttribute('data-orig-color', color);
        const left  = (slot.left  != null ? slot.left  : (slot.leftHr  != null ? slot.leftHr  : 8));
        const width = (slot.width != null ? slot.width : (slot.widthHr != null ? slot.widthHr : 3));
        job.style.left  = 'calc(var(--hr-w) * ' + left + ')';
        job.style.width = 'calc(var(--hr-w) * ' + width + ')';
        // Real job id → drag source + assign target.
        if (slot.jobId != null) {
          job.setAttribute('data-job-id', String(slot.jobId));
          job.setAttribute('data-drag-id', String(slot.jobId));
        }
        job.setAttribute('data-drag-kind', 'timeline-job');
        job.setAttribute('data-drag-label', String(slot.title || 'Job'));
        job.setAttribute('draggable', 'true');
        job.style.cursor = 'grab';

        const jt = document.createElement('div'); jt.className = 'jt';
        jt.textContent = String(slot.title || 'Job');
        job.appendChild(jt);
        const js = document.createElement('div'); js.className = 'js';
        js.textContent = String(slot.sub || '');
        job.appendChild(js);

        const conf = document.createElement('span');
        conf.className = 'conf';
        conf.textContent = '✓';
        conf.style.color = slot.confStroke || ('var(--' + color + ')');
        conf.style.display = (slot.confDisplay === 'none') ? 'none' : '';
        job.appendChild(conf);

        // Assigned member + vehicle chips.
        const members  = Array.isArray(slot.members)  ? slot.members  : [];
        const vehicles = Array.isArray(slot.vehicles) ? slot.vehicles : [];
        if (members.length || vehicles.length) {
          const roster = document.createElement('div');
          roster.className = 'tj-roster';
          members.forEach(m => {
            roster.appendChild(makeChip('job-member', slot.jobId, m.id, m.name || m.initials || ('#' + m.id), 'tj-member-chip' + (m.confirmed ? ' confirmed' : '')));
          });
          vehicles.forEach(v => {
            roster.appendChild(makeChip('job-vehicle', slot.jobId, v.id, '🚚 ' + (v.name || ('#' + v.id)), 'tj-vehicle-chip'));
          });
          job.appendChild(roster);
        }

        lane.appendChild(job);
        wireJob(job);
      });
      recomputeConflicts(lane);
    });
    // Deal-panel job cards are also drop targets for scheduling onto a job.
    $$('.jobs-list .job-card').forEach(wireJob);
  }
  window.__sched_renderTimeline = renderTimelineLanes;
  document.addEventListener('s1ui:ready', renderTimelineLanes);
  if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
    window.S1.bus.on('state:replaced', renderTimelineLanes);
  }

  // ── Jobs panel as removal drop zone (drag a placed job back) ────────
  const jobsPanel = document.querySelector('.jobs');
  if (jobsPanel) {
    jobsPanel.addEventListener('dragover', (e) => {
      if (e.dataTransfer.types && e.dataTransfer.types.indexOf('application/x-sched-drag') < 0) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      jobsPanel.classList.add('drop-remove-highlight');
    });
    jobsPanel.addEventListener('dragleave', (e) => {
      if (!jobsPanel.contains(e.relatedTarget)) jobsPanel.classList.remove('drop-remove-highlight');
    });
    jobsPanel.addEventListener('drop', async (e) => {
      e.preventDefault();
      cleanupDragVisuals();
      const raw  = e.dataTransfer.getData('application/x-sched-drag') || e.dataTransfer.getData('text/plain') || '';
      const info = parsePayload(raw);
      if (!info) return;
      // Dragging an assigned chip onto the panel unschedules that person/truck
      // from the job (but keeps them in the crew pool — separate action).
      if (info.kind === 'job-member' || info.kind === 'job-vehicle') {
        await removeFromJob(info.kind, info.jobId, info.id);
        activeDrag = null;
        return;
      }
      if (info.kind !== 'timeline-job') return;
      const draggedEl = activeDrag && activeDrag.el;
      const sourceLane = draggedEl && draggedEl.closest('.lane[data-lane]');
      await safe('Unassign job', async () => {
        const r = await comm.action('scheduling.unassign-job', { jobId: Number(info.id) });
        if (r && r.ok) {
          if (draggedEl) draggedEl.remove();
          if (sourceLane) recomputeConflicts(sourceLane);
          flash('Unassigned');
        }
      });
      activeDrag = null;
    });
  }

  // ── Drop-to-create-lane zone (.crew-drop) ───────────────────────────
  const createZone = document.querySelector('.crew-drop');
  if (createZone) {
    createZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      createZone.classList.add('drag-over');
    });
    createZone.addEventListener('dragleave', () => createZone.classList.remove('drag-over'));
    createZone.addEventListener('drop', async (e) => {
      e.preventDefault();
      cleanupDragVisuals();
      const info = parsePayload(e.dataTransfer.getData('application/x-sched-drag') || '');
      if (!info || info.kind !== 'employee') return;
      await safe('Create team', async () => {
        const r = await comm.action('scheduling.crew.createFromDrop', { leaderEmployeeId: Number(info.id), date: selectedDate() });
        if (r && r.ok) { flash('Team created'); await load(); }
      });
      activeDrag = null;
    });
  }

  // ── Touch fallback (mobile/tablet) ──────────────────────────────────
  let touch = null;
  function pointerEl(x, y) { return document.elementFromPoint(x, y); }
  document.addEventListener('touchstart', (e) => {
    if (!e.touches[0]) return;
    const t  = e.touches[0];
    const el = pointerEl(t.clientX, t.clientY);
    const src = el && el.closest && el.closest('[data-drag-id][data-drag-kind]');
    if (!src) return;
    touch = {
      el: src, kind: src.getAttribute('data-drag-kind'), id: src.getAttribute('data-drag-id'),
      label: src.getAttribute('data-drag-label') || '', sx: t.clientX, sy: t.clientY, started: false
    };
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (!touch || !e.touches[0]) return;
    const t = e.touches[0];
    if (!touch.started) {
      if (Math.abs(t.clientX - touch.sx) < 8 && Math.abs(t.clientY - touch.sy) < 8) return;
      touch.started = true;
      touch.el.classList.add('dragging');
      showGhost(touch.label, t.clientX, t.clientY);
    }
    e.preventDefault();
    moveGhost(t.clientX, t.clientY);
    $$('.lane.drag-over, .crew-cell.drag-over').forEach(x => x.classList.remove('drag-over'));
    const overEl = pointerEl(t.clientX, t.clientY);
    const lane = overEl && overEl.closest && overEl.closest('.lane[data-lane]');
    if (lane) lane.classList.add('drag-over');
    else {
      const cellOver = overEl && overEl.closest && overEl.closest('.crew-cell[data-crew-id]');
      if (cellOver && (touch.kind === 'vehicle' || touch.kind === 'employee')) cellOver.classList.add('drag-over');
    }
  }, { passive: false });
  document.addEventListener('touchend', async (e) => {
    if (!touch || !touch.started) { touch = null; return; }
    const t  = e.changedTouches[0];
    const overEl = pointerEl(t.clientX, t.clientY);
    const lane   = overEl && overEl.closest && overEl.closest('.lane[data-lane]');
    const cell   = overEl && overEl.closest && overEl.closest('.crew-cell[data-crew-id]');
    const jobsP  = overEl && overEl.closest && overEl.closest('.jobs');
    const cdrop  = overEl && overEl.closest && overEl.closest('.crew-drop');
    $$('.dragging').forEach(x => x.classList.remove('dragging'));
    $$('.lane.drag-over, .crew-cell.drag-over').forEach(x => x.classList.remove('drag-over'));
    killGhost();
    const date = selectedDate();
    const jobEl  = overEl && overEl.closest && overEl.closest('.lane .job, .jobs-list .job-card');
    try {
      // Drop a person/vehicle directly onto a job → schedule them to that job.
      if (jobEl && (touch.kind === 'employee' || touch.kind === 'vehicle')) {
        const jobId = Number(jobIdOf(jobEl));
        if (touch.kind === 'employee') await comm.action('scheduling.assign-member-to-job', { jobId, employeeId: Number(touch.id) });
        else                           await comm.action('scheduling.assign-vehicle-to-job', { jobId, vehicleId: Number(touch.id) });
        await load();
      } else if (cell && (touch.kind === 'employee' || touch.kind === 'vehicle')) {
        // Drop a truck/person directly on the team card.
        const crewId = parseInt(cell.getAttribute('data-crew-id'), 10);
        if (!crewId) { flash('This team has no crew yet'); touch = null; return; }
        if (touch.kind === 'vehicle') { await comm.action('scheduling.add-vehicle', { crewId, vehicleId: Number(touch.id), date }); await load(); }
        else                          { await comm.action('scheduling.add-member', { crewId, employeeId: Number(touch.id), date }); await load(); }
      } else if (lane) {
        const crewId    = parseInt(lane.getAttribute('data-crew-id'), 10);
        const startHour = calcHourFromX(lane, t.clientX);
        if (!crewId) { flash('This lane has no crew yet'); touch = null; return; }
        if (touch.kind === 'employee')      { await comm.action('scheduling.add-member', { crewId, employeeId: Number(touch.id), date }); await load(); }
        else if (touch.kind === 'vehicle')  { await comm.action('scheduling.add-vehicle', { crewId, vehicleId: Number(touch.id), date }); await load(); }
        else if (touch.kind === 'timeline-job' || touch.kind === 'job') await comm.action('scheduling.assign-job', { jobId: Number(touch.id), crewId, date, startHour });
      } else if (jobsP && (touch.kind === 'job-member' || touch.kind === 'job-vehicle')) {
        // touch.id is the composite "JOBID:RESOURCEID" for assigned chips.
        const seg = String(touch.id).split(':');
        await removeFromJob(touch.kind, seg[0], seg[1]);
      } else if (jobsP && touch.kind === 'timeline-job') {
        await comm.action('scheduling.unassign-job', { jobId: Number(touch.id) });
      } else if (cdrop && touch.kind === 'employee') {
        await comm.action('scheduling.crew.createFromDrop', { leaderEmployeeId: Number(touch.id), date });
      }
    } catch (err) { flash('Drop failed: ' + (err.message || err)); }
    touch = null;
  });

  // ── Publish: confirm jobs + send each assigned member their schedule ──
  // The button carries data-comm-action="action:scheduling.publish"; take
  // ownership (mark __s1Wired) so the generic dispatcher skips it, then post
  // with the explicit selected date and surface a real summary.
  function wirePublish() {
    $$('[data-comm-action="action:scheduling.publish"]').forEach((btn) => {
      if (btn.__s1PublishWired) return;
      btn.__s1PublishWired = true;
      btn.__s1Wired = true; // tell the generic [data-comm-action] dispatcher to skip
      btn.addEventListener('click', async (ev) => {
        ev.preventDefault();
        await safe('Publish', async () => {
          const r = await comm.action('scheduling.publish', { date: selectedDate() });
          if (r && r.ok) {
            const jc = r.jobsConfirmed != null ? r.jobsConfirmed : 0;
            const mn = r.membersNotified != null ? r.membersNotified : 0;
            flash('Published · ' + jc + ' job' + (jc === 1 ? '' : 's') + ' confirmed · ' + mn + ' notified');
            await load();
          }
        });
      });
    });
  }
  wirePublish();
  document.addEventListener('s1ui:ready', wirePublish);

  // ── Visual-feedback CSS ─────────────────────────────────────────────
  const dragCss = document.createElement('style');
  dragCss.textContent = `
    [data-drag-id].dragging { opacity: 0.4; }
    .lane.drag-over { background-color: rgba(217, 119, 87, 0.10); outline: 2px dashed var(--terra, #d97757); outline-offset: -2px; }
    .crew-drop.drag-over { background-color: rgba(217, 119, 87, 0.10); }
    .crew-drop.visible { opacity: 1 !important; }
    .jobs.drop-remove-highlight, .resources.drop-remove-highlight { outline: 2px dashed var(--bad, #c2410c); outline-offset: -2px; background-color: rgba(194, 65, 12, 0.05); }
  `;
  document.head.appendChild(dragCss);
})();

// ────────────────────────────────────────────────────────────────────────
// Timeline zoom — controls the --hr-w CSS variable on #tlGrid.
// Matches Daily.cshtml's slider behavior: 40..180 px/hour, step 10, default
// 64 px (the existing value). The header has a "Zoom" button — clicking it
// toggles a small popover slider just below it. Not persisted across loads.
// ────────────────────────────────────────────────────────────────────────
(function () {
  const grid = document.getElementById('tlGrid');
  if (!grid) return;
  const MIN = 32, MAX = 200, STEP = 8, DEFAULT = 64;

  function setHourWidth(px) {
    px = Math.max(MIN, Math.min(MAX, Math.round(px)));
    grid.style.setProperty('--hr-w', px + 'px');
    const label = document.querySelector('.sched-zoom-popover .zoom-label');
    if (label) label.textContent = (px / DEFAULT).toFixed(2).replace(/\.?0+$/, '') + '×';
    const slider = document.querySelector('.sched-zoom-popover input[type="range"]');
    if (slider && parseInt(slider.value, 10) !== px) slider.value = String(px);
  }

  // Locate the existing "Zoom" button in the timeline bar's right cluster.
  const zoomBtn = $$('.timeline .tl-bar .right .btn-secondary')
    .find(b => /zoom/i.test(b.textContent || ''));
  if (!zoomBtn) return;
  zoomBtn.style.position = zoomBtn.style.position || 'relative';

  // Build the popover lazily on first click.
  let pop = null;
  function buildPop() {
    pop = document.createElement('div');
    pop.className = 'sched-zoom-popover';
    pop.style.cssText = 'position:absolute;right:0;top:100%;margin-top:6px;'
      + 'background:#fff;border:1px solid var(--line-2, #e5e7eb);border-radius:10px;'
      + 'box-shadow:0 10px 28px rgba(0,0,0,0.12);padding:10px 12px;'
      + 'display:flex;align-items:center;gap:10px;z-index:50;min-width:240px;';
    while (pop.firstChild) pop.removeChild(pop.firstChild);
    const minus = document.createElement('button');
    minus.type = 'button'; minus.textContent = '−';
    minus.style.cssText = 'width:22px;height:22px;border:1px solid var(--line-2,#e5e7eb);background:#fff;border-radius:5px;cursor:pointer;font-size:14px;';
    const plus = document.createElement('button');
    plus.type = 'button'; plus.textContent = '+';
    plus.style.cssText = minus.style.cssText;
    const range = document.createElement('input');
    range.type = 'range'; range.min = String(MIN); range.max = String(MAX); range.step = String(STEP);
    range.style.cssText = 'flex:1;accent-color:var(--terra, #d97757);';
    const label = document.createElement('span');
    label.className = 'zoom-label';
    label.style.cssText = 'font-size:12px;font-variant-numeric:tabular-nums;min-width:36px;text-align:right;color:var(--ink-2,#374151);';
    const reset = document.createElement('button');
    reset.type = 'button'; reset.textContent = 'Reset';
    reset.style.cssText = 'font-size:11px;color:var(--terra,#d97757);background:transparent;border:0;cursor:pointer;padding:2px 4px;';
    pop.appendChild(minus); pop.appendChild(range); pop.appendChild(plus); pop.appendChild(label); pop.appendChild(reset);

    range.value = String(parseFloat(getComputedStyle(grid).getPropertyValue('--hr-w')) || DEFAULT);
    range.addEventListener('input', () => setHourWidth(parseInt(range.value, 10)));
    minus.addEventListener('click', () => setHourWidth((parseInt(range.value, 10) || DEFAULT) - STEP));
    plus .addEventListener('click', () => setHourWidth((parseInt(range.value, 10) || DEFAULT) + STEP));
    reset.addEventListener('click', () => setHourWidth(DEFAULT));
    zoomBtn.parentElement.style.position = 'relative';
    zoomBtn.parentElement.appendChild(pop);
    setHourWidth(parseInt(range.value, 10));
  }

  zoomBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (!pop) buildPop();
    pop.style.display = (pop.style.display === 'none' || !pop.style.display) ? 'flex' : 'none';
    if (pop.style.display === 'flex') {
      const onAway = (e) => {
        if (pop && !pop.contains(e.target) && e.target !== zoomBtn && !zoomBtn.contains(e.target)) {
          pop.style.display = 'none';
          document.removeEventListener('click', onAway, true);
        }
      };
      setTimeout(() => document.addEventListener('click', onAway, true), 0);
    }
  });

  // Ctrl/Cmd + scroll wheel anywhere over the timeline → zoom in/out.
  const scroll = document.querySelector('.tl-scroll');
  if (scroll) {
    scroll.addEventListener('wheel', (ev) => {
      if (!ev.ctrlKey && !ev.metaKey) return;
      ev.preventDefault();
      const cur = parseFloat(getComputedStyle(grid).getPropertyValue('--hr-w')) || DEFAULT;
      setHourWidth(cur + (ev.deltaY < 0 ? STEP : -STEP));
    }, { passive: false });
  }
})();


// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-scheduling-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-scheduling-open'));}));
  window.S1.modal.bindForm('#schAssignModal', 'scheduling.crew.assign', { label: 'Assign' });
  // Real rental persistence — distinct from `scheduling.truck.add` which is
  // an alias to add-vehicle (assigns an existing vehicle to a crew).
  window.S1.modal.bindForm('#schTruckModal', 'scheduling.truck.add.rental', { label: 'Add truck' });
  window.S1.modal.bindForm('#schBlockOutModal', 'scheduling.crew.blockOut', { label: 'Block out' });
  window.S1.modal.bindForm('#schSlotEditModal', 'scheduling.slot.edit', { label: 'Save' });
})();

// ────────────────────────────────────────────────────────────────────────
// Count synchronization — every badge on the page is recomputed from the
// DOM (or bound list lengths) after each load() and state replace so we
// never show "33" next to an empty body.
// ────────────────────────────────────────────────────────────────────────
function recomputeCounts() {
  const fx = (window.S1.fixtures || {}).scheduling || {};
  function setText(sel, n) {
    const el = document.querySelector(sel);
    if (el) el.textContent = String(n);
  }
  // sched-tab counts. Target the badge span by data-tab (robust to the tab
  // order) and write the live DOM-derived count.
  const visibleJobs = $$('.lane[data-lane] > .job').filter(j => j.style.display !== 'none').length;
  const custRows = $$('.tableview[data-bulk-table="customer"] tbody tr, [data-bind="customerConfirmations"] > *:not(template)').length;
  const teamRows = $$('.tableview[data-bulk-table="team"] tbody tr, [data-bind="teamConfirmations"] > *:not(template)').length;
  const dayOff   = $$('.do-col.pending .do-req, [data-bind="dayOffPending"] > *:not(template)').length;
  function setTabBadge(dataTab, n) {
    const t = document.querySelector('#schedTabs .sched-tab[data-tab="' + dataTab + '"]');
    const s = t && t.querySelector('span');
    if (s) s.textContent = String(n);
  }
  setTabBadge('scheduling', visibleJobs);
  setTabBadge('customer-confirmations', custRows);
  setTabBadge('team-confirmations', teamRows);
  // #1587: the day-off slice is lazy-loaded. Until it has loaded its pane is
  // empty, so DON'T overwrite the server-rendered badge (metrics.count.3) with
  // a DOM count of 0 — keep the correct pending count until the slice arrives.
  if (schedLoadedSlices.dayoff) setTabBadge('day-off', dayOff);
  // section counts (Leaders / Members / Fleet)
  const ldrs = (fx.rLeaders || []).length || $$('[data-bind="rLeaders"] > .r-row').length;
  const mbrs = (fx.rMembers || []).length || $$('[data-bind="rMembers"] > .r-row').length;
  const fleet= (fx.rFleet   || []).length || $$('[data-bind="rFleet"]   > .r-row').length;
  const titles = $$('.r-section-title > span');
  if (titles[0]) titles[0].textContent = String(ldrs);
  if (titles[1]) titles[1].textContent = String(mbrs);
  if (titles[2]) titles[2].textContent = String(fleet);
  // content-tab badges (Deals / AM Meetings) — derive from rendered cards.
  const dealCount = $$('[data-bind="unscheduledDeals"] .job-card').length;
  const meetCount = $$('[data-jobs-pane="closed"] .job-card').length;
  const ct = $$('.content-tab .ct-count');
  if (ct[0]) ct[0].textContent = String(dealCount);
  if (ct[1]) ct[1].textContent = String(meetCount);
  // fchip badges — Customer / Team / Truck. Read from bound data.
  function fchipCount(list, key, val) {
    if (!Array.isArray(list)) return 0;
    if (val == null) return list.length;
    return list.filter(x => x && (x[key] || '').toLowerCase().indexOf(val) >= 0).length;
  }
  const cConf = fx.customerConfirmations || [];
  const tConf = fx.teamConfirmations || [];
  const rents = fx.truckRentalCards || fx.truckRentals || [];
  $$('.tab-pane[data-pane="customer-confirmations"] .fchip').forEach((b,i)=>{
    const sp = b.querySelector('.fcount'); if (!sp) return;
    if (i === 0) sp.textContent = String(cConf.length);
    else if (i === 1) sp.textContent = String(fchipCount(cConf,'status','awaiting'));
    else if (i === 2) sp.textContent = String(fchipCount(cConf,'status','confirmed'));
    else if (i === 3) sp.textContent = String(fchipCount(cConf,'status','no'));
  });
  $$('.tab-pane[data-pane="team-confirmations"] .fchip').forEach((b,i)=>{
    const sp = b.querySelector('.fcount'); if (!sp) return;
    if (i === 0) sp.textContent = String(tConf.length);
    else if (i === 1) sp.textContent = String(fchipCount(tConf,'status','awaiting'));
    else if (i === 2) sp.textContent = String(fchipCount(tConf,'status','declined'));
  });
  $$('.tab-pane[data-pane="truck-rentals"] .fchip').forEach((b)=>{
    const sp = b.querySelector('.fcount'); if (!sp) return;
    const f = b.getAttribute('data-tr-filter');
    if (f === 'all') sp.textContent = String(rents.length);
    else sp.textContent = String(fchipCount(rents, 'status', f));
  });
  // All-locations count — sum locations[].count.
  const locs = fx.locations || [];
  const allCount = locs.reduce((s,l)=> s + (parseInt(l && l.count, 10) || 0), 0) || visibleJobs;
  const allSpan = document.querySelector('.ph-loc-count');
  if (allSpan) allSpan.textContent = String(allCount);
}
document.addEventListener('s1ui:ready', recomputeCounts);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', recomputeCounts);
}
$$('.sched-tab[data-tab]').forEach(b => b.addEventListener('click', () => setTimeout(recomputeCounts, 50)));

// ────────────────────────────────────────────────────────────────────────
// Month grid — JS-built from scheduling.month.get. Replaces the hardcoded
// 35-cell sample data.
// ────────────────────────────────────────────────────────────────────────
async function buildMonthGrid(d) {
  const grid = document.getElementById('resMoGrid');
  if (!grid) return;
  // Remove any previously inserted dynamic cells (keep .res-mo-dow headers).
  Array.from(grid.querySelectorAll('.res-mo-cell[data-mo-dynamic="1"]')).forEach(n => n.remove());
  const base = new Date(d.getFullYear(), d.getMonth(), 1);
  const ym = base.getFullYear() + '-' + String(base.getMonth()+1).padStart(2,'0');
  let days = {};
  let capacity = 0;
  try {
    const r = await comm.action('scheduling.month.get', { yearMonth: ym });
    if (r && r.ok) { days = r.days || {}; capacity = r.capacity || 0; }
  } catch {}
  const monthIdx = base.getMonth();
  const gridStart = new Date(base); gridStart.setDate(base.getDate() - ((base.getDay() + 6) % 7));
  const today = new Date(); today.setHours(0,0,0,0);
  for (let i = 0; i < 35; i++) {
    const day = new Date(gridStart); day.setDate(gridStart.getDate() + i);
    const cell = document.createElement('div');
    cell.className = 'res-mo-cell';
    cell.setAttribute('data-mo-dynamic','1');
    if (day.getMonth() !== monthIdx) cell.classList.add('other');
    const dow = day.getDay();
    if (dow === 0 || dow === 6) cell.classList.add('weekend');
    if (day.getTime() === today.getTime()) cell.classList.add('today');
    const num = document.createElement('div');
    num.className = 'res-mo-num' + (day.getTime() === today.getTime() ? ' today' : '');
    num.textContent = String(day.getDate());
    cell.appendChild(num);
    const key = day.getFullYear() + '-' + String(day.getMonth()+1).padStart(2,'0') + '-' + String(day.getDate()).padStart(2,'0');
    const info = days[key];
    if (info && day.getMonth() === monthIdx) {
      const cap = info.capacity || capacity || 0;
      const j = document.createElement('div');
      j.className = 'res-mo-jobs';
      j.textContent = info.jobs + (cap ? '/' + cap + ' jobs' : ' jobs');
      cell.appendChild(j);
      if (cap > 0) {
        const bar = document.createElement('div'); bar.className = 'res-mo-bar';
        const pct = Math.min(100, Math.round((info.jobs * 100) / cap));
        if (pct >= 96) bar.classList.add('bad');
        else if (pct >= 68) bar.classList.add('warn');
        const fill = document.createElement('span'); fill.style.width = pct + '%';
        bar.appendChild(fill);
        cell.appendChild(bar);
        const p = document.createElement('div'); p.className='res-mo-pct';
        p.textContent = pct + '% capacity' + (day.getTime() === today.getTime() ? ' · today' : '');
        cell.appendChild(p);
      }
    }
    grid.appendChild(cell);
  }
}
document.addEventListener('s1ui:ready', () => buildMonthGrid(currentDate()));
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', () => buildMonthGrid(currentDate()));
}

// MutationObserver — when the render pipeline rebuilds resource rows or
// job cards, retag them for drag immediately so the user doesn't have to
// wait for the next s1ui:ready event.
(function () {
  function retag() {
    if (typeof window.__sched_tagSources === 'function') window.__sched_tagSources();
  }
  const targets = ['.r-list', '.jobs-list'];
  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach(node => {
      try {
        const mo = new MutationObserver(retag);
        mo.observe(node, { childList: true, subtree: true });
      } catch {}
    });
  });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('scheduling');

// ─────────────────────────────────────────────────────────────────────────
// Job Efficiency tab — a daily "where should sales book this?" board.
// Ops sets a per-slot small-job limit (and can block a slot); sales reads
// which slot still has room, guided by a recommendation banner. Built with
// createElement/textContent only (no innerHTML — security rule 2).
// ─────────────────────────────────────────────────────────────────────────
(function () {
  const root = document.getElementById('jeRoot');
  if (!root) return;

  // "small" = 1 bedroom or less (the limit keys off this).
  const SIZE = {
    studio: { short: 'Studio', cls: 'sm', small: true },
    br1:    { short: '1 BR',   cls: 'sm', small: true },
    br2:    { short: '2 BR',   cls: 'md', small: false },
    br3:    { short: '3 BR',   cls: 'lg', small: false },
    br4:    { short: '4 BR+',  cls: 'xl', small: false },
  };
  const DOW_FULL = { Mon:'Monday', Tue:'Tuesday', Wed:'Wednesday', Thu:'Thursday', Fri:'Friday', Sat:'Saturday', Sun:'Sunday' };
  const SLOT_META = {
    am: { label: 'Morning',   time: '8:00 – 12:00', ico: '☀' },
    pm: { label: 'Afternoon', time: '1:00 – 5:00',  ico: '☾' },
  };
  const WEEK = [
    { id: '2026-05-25', dow: 'Mon', day: 25 },
    { id: '2026-05-26', dow: 'Tue', day: 26 },
    { id: '2026-05-27', dow: 'Wed', day: 27 },
    { id: '2026-05-28', dow: 'Thu', day: 28 },
    { id: '2026-05-29', dow: 'Fri', day: 29 },
    { id: '2026-05-30', dow: 'Sat', day: 30 },
    { id: '2026-05-31', dow: 'Sun', day: 31 },
  ];
  const JOBS = [
    { id: 'j1', date: '2026-05-30', slot: 'am', order: 1, cust: 'Maya Hernandez', size: 'br1' },
    { id: 'j2', date: '2026-05-30', slot: 'am', order: 2, cust: 'David Kim',      size: 'studio' },
    { id: 'j3', date: '2026-05-30', slot: 'am', order: 3, cust: 'Okafor Family',  size: 'br3' },
    { id: 'j4', date: '2026-05-30', slot: 'am', order: 7, cust: 'Priya Nair',     size: 'br1' },
    { id: 'j5', date: '2026-05-30', slot: 'pm', order: 4, cust: 'Sandra Lee',     size: 'br2' },
    { id: 'j6', date: '2026-05-30', slot: 'pm', order: 5, cust: 'Marcus Bell',    size: 'studio' },
    { id: 'j7', date: '2026-05-29', slot: 'am', order: 1, cust: 'Tomás Rivera',   size: 'br2' },
    { id: 'j8', date: '2026-05-29', slot: 'am', order: 2, cust: 'Jen Walsh',      size: 'studio' },
    { id: 'j9', date: '2026-05-29', slot: 'pm', order: 3, cust: 'Hughes & Co.',   size: 'br4' },
    { id: 'j10', date: '2026-05-31', slot: 'am', order: 1, cust: 'Aisha Banks',   size: 'br1' },
  ];
  const DEFAULTS = { capAM: 2, capPM: 3 };

  // mutable state
  let sel = '2026-05-30';
  const caps = {};    // `${date}-${slot}` -> override limit
  const blocks = {};  // `${date}-${slot}` -> true

  const key = (d, s) => d + '-' + s;
  const isSmall = (j) => !!(SIZE[j.size] && SIZE[j.size].small);
  const capOf = (d, s) => (key(d, s) in caps) ? caps[key(d, s)] : (s === 'am' ? DEFAULTS.capAM : DEFAULTS.capPM);
  const blockedOf = (d, s) => !!blocks[key(d, s)];
  const setCap = (d, s, v) => { caps[key(d, s)] = v; render(); };
  const toggleBlock = (d, s) => { blocks[key(d, s)] = !blocks[key(d, s)]; render(); };

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function slotTile(slot, jobs, cap, blocked, recommended) {
    const meta = SLOT_META[slot];
    const small = jobs.filter(isSmall);
    const remain = blocked ? 0 : Math.max(0, cap - small.length);
    const full = !blocked && small.length >= cap;

    let state = 'open', label = 'Open to book';
    if (blocked)          { state = 'blocked'; label = 'Blocked by Ops'; }
    else if (full)        { state = 'full';    label = 'Full for small jobs'; }
    else if (recommended) { state = 'best';    label = 'Book here'; }
    else if (remain === 1){ state = 'low';     label = '1 spot left'; }

    const card = el('div', 'slot ' + state);

    // header
    const hd = el('div', 'slot-hd');
    hd.appendChild(el('span', 'slot-ico ' + slot, meta.ico));
    const ht = el('div', 'slot-head-txt');
    ht.appendChild(el('div', 'slot-name', meta.label));
    ht.appendChild(el('div', 'slot-time', meta.time));
    hd.appendChild(ht);
    hd.appendChild(el('span', 'slot-badge ' + state, (state === 'best' ? '✓ ' : '') + label));
    card.appendChild(hd);

    // capacity meter
    const capRow = el('div', 'slot-cap');
    const dots = el('div', 'cap-dots');
    const dotCount = Math.max(cap, small.length);
    for (let i = 0; i < dotCount; i++) {
      const c = (i < small.length) ? (i < cap ? 'on' : 'over') : '';
      dots.appendChild(el('span', ('cap-dot ' + c).trim()));
    }
    capRow.appendChild(dots);
    capRow.appendChild(el('span', 'cap-text',
      blocked ? 'Not taking small jobs'
              : small.length + ' of ' + cap + ' small-job ' + (cap === 1 ? 'spot' : 'spots') + ' used'));
    card.appendChild(capRow);

    // booked jobs
    const jobWrap = el('div', 'slot-jobs');
    if (jobs.length === 0) {
      jobWrap.appendChild(el('span', 'slot-empty', 'Nothing booked yet'));
    } else {
      jobs.forEach(j => {
        const meta2 = SIZE[j.size] || { short: j.size, cls: 'md' };
        const chip = el('span', 'jchip ' + (isSmall(j) ? 'small' : 'big'));
        chip.appendChild(el('span', 'jchip-sz ' + meta2.cls, meta2.short));
        chip.appendChild(document.createTextNode(j.cust));
        jobWrap.appendChild(chip);
      });
    }
    card.appendChild(jobWrap);

    // ops controls
    const ops = el('div', 'slot-ops');
    ops.appendChild(el('span', 'ops-tag', 'Ops'));
    ops.appendChild(el('span', 'ops-lbl', 'Small-job limit'));
    const stepper = el('div', 'stepper');
    const minus = el('button', null, '−'); minus.type = 'button';
    minus.addEventListener('click', () => setCap(sel, slot, Math.max(0, cap - 1)));
    const plus = el('button', null, '+'); plus.type = 'button';
    plus.addEventListener('click', () => setCap(sel, slot, Math.min(8, cap + 1)));
    stepper.appendChild(minus);
    stepper.appendChild(el('span', null, String(cap)));
    stepper.appendChild(plus);
    ops.appendChild(stepper);
    const blockBtn = el('button', 'block-btn ' + (blocked ? 'on' : ''), blocked ? 'Unblock' : 'Block slot');
    blockBtn.type = 'button';
    blockBtn.addEventListener('click', () => toggleBlock(sel, slot));
    ops.appendChild(blockBtn);
    card.appendChild(ops);

    return card;
  }

  function render() {
    while (root.firstChild) root.removeChild(root.firstChild);

    const dayMeta = WEEK.find(w => w.id === sel) || WEEK[0];
    const dayJobs = JOBS.filter(j => j.date === sel);
    const amJobs = dayJobs.filter(j => j.slot === 'am').sort((a, b) => a.order - b.order);
    const pmJobs = dayJobs.filter(j => j.slot === 'pm').sort((a, b) => a.order - b.order);

    const room = (s, list) => blockedOf(sel, s) ? 0 : Math.max(0, capOf(sel, s) - list.filter(isSmall).length);
    const amRoom = room('am', amJobs);
    const pmRoom = room('pm', pmJobs);

    let rec = null;
    if (amRoom > 0) rec = 'am';
    else if (pmRoom > 0) rec = 'pm';

    // header
    const head = el('div', 'je-head');
    const crumb = el('div', 'je-crumb');
    crumb.appendChild(document.createTextNode('Field Ops '));
    crumb.appendChild(el('span', 'sep', '/'));
    crumb.appendChild(document.createTextNode(' Job Efficiency'));
    head.appendChild(crumb);
    head.appendChild(el('h1', null, 'Where to book — ' + DOW_FULL[dayMeta.dow] + ', May ' + dayMeta.day));
    head.appendChild(el('div', 'je-sub', 'Sales sees the open spots. Operations sets the limits.'));
    root.appendChild(head);

    // week strip
    const strip = el('div', 'week-strip');
    WEEK.forEach(w => {
      const wam = JOBS.filter(j => j.date === w.id && j.slot === 'am');
      const wpm = JOBS.filter(j => j.date === w.id && j.slot === 'pm');
      const r = (blockedOf(w.id, 'am') ? 0 : capOf(w.id, 'am') - wam.filter(isSmall).length)
              + (blockedOf(w.id, 'pm') ? 0 : capOf(w.id, 'pm') - wpm.filter(isSmall).length);
      const tone = r <= 0 ? 'full' : r <= 1 ? 'low' : 'open';
      const chip = el('button', 'day-chip' + (w.id === sel ? ' active' : ''));
      chip.type = 'button';
      chip.appendChild(el('span', 'dc-dow', w.dow));
      chip.appendChild(el('span', 'dc-day', String(w.day)));
      chip.appendChild(el('span', 'dc-dot ' + tone));
      chip.addEventListener('click', () => { sel = w.id; render(); });
      strip.appendChild(chip);
    });
    root.appendChild(strip);

    // recommendation banner
    const banner = el('div', 'rec-banner ' + (rec ? '' : 'none'));
    banner.appendChild(el('span', 'rb-ico', rec ? '✓' : '✦'));
    const rbText = el('div', 'rb-text');
    if (rec === 'am') {
      const t = el('div', 'rb-title');
      t.appendChild(document.createTextNode('Book a 1 BR-or-less job in the '));
      t.appendChild(el('b', null, 'Morning'));
      t.appendChild(document.createTextNode('.'));
      rbText.appendChild(t);
      rbText.appendChild(el('div', 'rb-sub', amRoom + ' small-job ' + (amRoom === 1 ? 'spot' : 'spots') + ' still open before it fills.'));
    } else if (rec === 'pm') {
      const t = el('div', 'rb-title');
      t.appendChild(document.createTextNode('Morning is full — book small jobs in the '));
      t.appendChild(el('b', null, 'Afternoon'));
      t.appendChild(document.createTextNode('.'));
      rbText.appendChild(t);
      rbText.appendChild(el('div', 'rb-sub', pmRoom + ' small-job ' + (pmRoom === 1 ? 'spot' : 'spots') + ' open this afternoon.'));
    } else {
      rbText.appendChild(el('div', 'rb-title', 'Both slots are full for small jobs today.'));
      rbText.appendChild(el('div', 'rb-sub', 'Pick another day, or have Ops raise a limit below.'));
    }
    banner.appendChild(rbText);
    root.appendChild(banner);

    // the two slots
    const slots = el('div', 'slots');
    slots.appendChild(slotTile('am', amJobs, capOf(sel, 'am'), blockedOf(sel, 'am'), rec === 'am'));
    slots.appendChild(slotTile('pm', pmJobs, capOf(sel, 'pm'), blockedOf(sel, 'pm'), rec === 'pm'));
    root.appendChild(slots);
  }

  render();
})();
