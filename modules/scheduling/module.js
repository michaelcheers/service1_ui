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

// Date display — use the prev/next/today buttons or month-grid cells to navigate.
// TODO: replace with a real inline date picker.
$$('.date-cur').forEach(el => {
  el.addEventListener('click', (ev) => {
    ev.preventDefault();
    flash('Use the prev/next or month grid to change date');
  });
});

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
$$('button[title="Previous"]').forEach(b => b.addEventListener('click', async (ev) => {
  ev.preventDefault();
  const d = shiftByActiveView(-1);
  setDate(d);
  await safe('Prev', () => comm.action('scheduling.prev', { date: d.toISOString().slice(0,10) }));
}));
$$('button[title="Next"]').forEach(b => b.addEventListener('click', async (ev) => {
  ev.preventDefault();
  const d = shiftByActiveView(+1);
  setDate(d);
  await safe('Next', () => comm.action('scheduling.next', { date: d.toISOString().slice(0,10) }));
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
    await safe('Today', () => comm.action('scheduling.today', {}));
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

// Sched tabs (Resource Calendar / Scheduling / Customer Confirmations / etc.)
$$('.sched-tab[data-tab]').forEach(b => {
  b.addEventListener('click', async () => {
    $$('.sched-tab[data-tab]').forEach(x => x.classList.toggle('active', x === b));
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// + Add resource (left rail) → open the assign modal (closest existing modal).
$$('.btn-sm.btn-ghost').filter(b => /^\+\s*add$/i.test(b.textContent.trim())).forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#schAssignModal');
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
    const lane = document.querySelector('.lane[data-lane="' + i + '"]');
    if (lane) {
      lane.style.display = ok ? '' : 'none';
      // Drive each .job from fixture timeline.laneN[j]:
      //   { title, sub, color, leftHr, widthHr, confirmed }
      // — color drives the .job swatch class (terra/info/plum/teal/warn/gold/bad
      //   /rose); use 'bad' for conflict and the .conf check vanishes.
      const laneFix = tl['lane' + i];
      const swatches = ['terra','info','plum','teal','warn','gold','bad','rose'];
      const jobs = Array.from(lane.querySelectorAll(':scope > .job'));
      jobs.forEach((job, j) => {
        const slot = laneFix && laneFix[j];
        if (!ok || !slot) { job.style.display = 'none'; return; }
        job.style.display = '';
        if (slot.color) {
          swatches.forEach(s => job.classList.remove(s));
          job.classList.add(String(slot.color));
        }
        const leftHr  = slot.leftHr  != null ? slot.leftHr  : slot.left;
        const widthHr = slot.widthHr != null ? slot.widthHr : slot.width;
        if (leftHr  != null) job.style.left  = 'calc(var(--hr-w) * ' + leftHr + ')';
        if (widthHr != null) job.style.width = 'calc(var(--hr-w) * ' + widthHr + ')';
        const conf = job.querySelector(':scope > .conf');
        if (conf) {
          const hideConf = slot.confirmed === false || slot.color === 'bad' || slot.color === 'warn' || slot.confDisplay === 'none';
          conf.style.display = hideConf ? 'none' : '';
        }
      });
    }
  });
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
      if (row.hasAttribute('data-drag-id')) return;
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
  // Re-tag whenever the render pipeline rebuilds the DOM.
  document.addEventListener('s1ui:ready', tagSources);

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
    $$('.lane.drag-over, .crew-drop.drag-over, .jobs.drop-remove-highlight, .resources.drop-remove-highlight')
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
    const el = (t && t.nodeType === 1) ? t.closest('.lane[data-lane], .jobs, .crew-drop') : null;
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
      const crewId    = parseInt(lane.getAttribute('data-lane'), 10) + 1; // 1-based
      const date      = selectedDate();
      const startHour = calcHourFromX(lane, e.clientX);
      if (info.kind === 'employee') {
        await safe('Add member', async () => {
          const r = await comm.action('scheduling.add-member', { crewId, employeeId: Number(info.id), date });
          if (r && r.ok) flash('Added to crew');
        });
      } else if (info.kind === 'vehicle') {
        await safe('Add vehicle', async () => {
          const r = await comm.action('scheduling.add-vehicle', { crewId, vehicleId: Number(info.id), date });
          if (r && r.ok) flash('Vehicle added');
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
      if (!info || info.kind !== 'timeline-job') return;
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
    $$('.lane.drag-over').forEach(x => x.classList.remove('drag-over'));
    const overEl = pointerEl(t.clientX, t.clientY);
    const lane = overEl && overEl.closest && overEl.closest('.lane[data-lane]');
    if (lane) lane.classList.add('drag-over');
  }, { passive: false });
  document.addEventListener('touchend', async (e) => {
    if (!touch || !touch.started) { touch = null; return; }
    const t  = e.changedTouches[0];
    const overEl = pointerEl(t.clientX, t.clientY);
    const lane   = overEl && overEl.closest && overEl.closest('.lane[data-lane]');
    const jobsP  = overEl && overEl.closest && overEl.closest('.jobs');
    const cdrop  = overEl && overEl.closest && overEl.closest('.crew-drop');
    $$('.dragging').forEach(x => x.classList.remove('dragging'));
    $$('.lane.drag-over').forEach(x => x.classList.remove('drag-over'));
    killGhost();
    const date = selectedDate();
    try {
      if (lane) {
        const crewId    = parseInt(lane.getAttribute('data-lane'), 10) + 1;
        const startHour = calcHourFromX(lane, t.clientX);
        if (touch.kind === 'employee')      await comm.action('scheduling.add-member', { crewId, employeeId: Number(touch.id), date });
        else if (touch.kind === 'vehicle')  await comm.action('scheduling.add-vehicle', { crewId, vehicleId: Number(touch.id), date });
        else                                await comm.action('scheduling.assign-job', { jobId: Number(touch.id), crewId, date, startHour });
      } else if (jobsP && touch.kind === 'timeline-job') {
        await comm.action('scheduling.unassign-job', { jobId: Number(touch.id) });
      } else if (cdrop && touch.kind === 'employee') {
        await comm.action('scheduling.crew.createFromDrop', { leaderEmployeeId: Number(touch.id), date });
      }
    } catch (err) { flash('Drop failed: ' + (err.message || err)); }
    touch = null;
  });

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
  window.S1.modal.bindForm('#schTruckModal', 'scheduling.truck.add', { label: 'Add truck' });
  window.S1.modal.bindForm('#schBlockOutModal', 'scheduling.crew.blockOut', { label: 'Block out' });
  window.S1.modal.bindForm('#schSlotEditModal', 'scheduling.slot.edit', { label: 'Save' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('scheduling');
