// Module: Job Calendar — hand-wired per element.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "jobCalendar", title: "Job Calendar", reads: ["jobs"], writes: ["jobs"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  // Re-read the fixture *after* any awaits so we pick up state pushed
  // from the host (s1ui:state) during boot. Capturing the reference
  // before the await would render the stale demo fixture even when the
  // host already replaced window.S1.fixtures.jobCalendar.
  const data = (window.S1.fixtures || {})["jobCalendar"] || {};
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'jobCalendar' } }));
}
load().catch(e => console.warn('[jobCalendar] init error', e));
// If the host pushes state AFTER load() finished its render pass, the
// state:replaced bus event fires from communication.mock.js (line 194).
// Re-bind so the calendar grid + month label reflect the new month even
// when the postMessage arrives late.
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', (state) => {
    try { if (state && window.S1.render) window.S1.render.bind(document, state); } catch {}
  });
}
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

// View segmented (Day / Month / Week / Agenda) — top of calendar
$$('.cal-toolbar button, .page-bar .seg button').forEach(b => {
  const t = (b.textContent || '').trim();
  if (!/^(day|month|week|agenda)$/i.test(t)) return;
  b.addEventListener('click', async () => {
    const peers = b.parentElement && $$('button', b.parentElement);
    if (peers) peers.forEach(x => x.classList.toggle('active', x === b));
    await safe('View', () => comm.save('jobCalendar.range', { view: t.toLowerCase() }));
  });
});

// Apply a server-returned state to the live page: overwrite the fixture
// store, re-emit state:replaced for subscribers (e.g. filter re-apply),
// and re-run the data-bind layer so the calendar grid + month label
// reflect the new month. Mirrors the host-bridge path in
// core/communication.mock.js (lines 188-196).
function applyJobCalendarState(state) {
  if (!state) return;
  try {
    if (window.S1 && window.S1.fixtures) window.S1.fixtures.jobCalendar = state;
    if (window.S1 && window.S1.store && typeof window.S1.store.replaceAll === 'function') window.S1.store.replaceAll(state);
    if (window.S1 && window.S1.bus && typeof window.S1.bus.emit === 'function') window.S1.bus.emit('state:replaced', state);
    if (window.S1 && window.S1.render && typeof window.S1.render.bind === 'function') window.S1.render.bind(document, state);
  } catch (e) { console.warn('[jobCalendar] applyState failed', e); }
}

function currentDisplayedMonth() {
  // Prefer the machine-readable currentMonth in the fixture; fall back to
  // parsing the visible month label ("May 2026").
  const fx = (window.S1 && window.S1.fixtures && window.S1.fixtures.jobCalendar) || {};
  if (fx.currentMonth && /^\d{4}-\d{2}$/.test(fx.currentMonth)) return fx.currentMonth;
  const label = (document.querySelector('.jc-month-label') || {}).textContent || '';
  const m = label.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return '';
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const idx = months.indexOf(m[1].toLowerCase());
  if (idx < 0) return '';
  return m[2] + '-' + String(idx + 1).padStart(2, '0');
}

// Today button
$$('.page-actions .btn-secondary, .page-bar .btn-secondary').filter(b => /^today$/i.test(b.textContent.trim())).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe('Today', () => comm.action('jobCalendar.today', { currentMonth: currentDisplayedMonth() }));
    if (r && r.ok) { if (r.state) applyJobCalendarState(r.state); flash('Today'); }
  });
});

// Prev / Next arrows in the header (older page-actions layout)
$$('.page-actions .btn-secondary svg polyline').forEach(p => {
  const btn = p.closest('button'); if (!btn) return;
  const points = p.getAttribute('points') || '';
  const dir = points.startsWith('15 18') ? 'prev' : 'next';
  btn.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe(dir, () => comm.action('jobCalendar.' + dir, { currentMonth: currentDisplayedMonth() }));
    if (r && r.state) applyJobCalendarState(r.state);
  });
});

// "+ New job" → open the book modal.
$$('.page-actions .btn-primary').filter(b => /new job/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#calBookModal');
  });
});

// Sub-tabs: All jobs / Surveys / Moves / Box delivery
$$('.subtabs .subtab').forEach((b, i) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tabs = ['all', 'surveys', 'moves', 'boxes'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

// Show-on-calendar (type) + Quick filters (ownership/overdue). Both groups
// combine: an event is visible only if its kind is enabled AND it matches
// the active quick filters (multi-select quick filters use OR — show any
// event that matches at least one checked filter; none checked = no quick
// constraint).
function applyCalendarFilters() {
  const showKinds = {};
  $$('[data-jc-show]').forEach(cb => { showKinds[cb.getAttribute('data-jc-show')] = cb.checked; });
  const active = $$('[data-jc-quick]').filter(x => x.checked).map(x => x.getAttribute('data-jc-quick'));
  $$('.cal-cell').forEach(cell => {
    const evt = cell.querySelector('.cal-evt'); if (!evt) return;
    // Type check: get the cal-evt's kind from its second class (after "cal-evt").
    let kindOk = true;
    for (const cls of evt.classList) {
      if (cls === 'cal-evt') continue;
      if (Object.prototype.hasOwnProperty.call(showKinds, cls)) { kindOk = showKinds[cls]; break; }
    }
    let quickOk = true;
    if (active.length) {
      const assigned = cell.getAttribute('data-assigned') || '';
      const overdue  = cell.getAttribute('data-overdue') === 'true';
      quickOk = (active.includes('mine')       && assigned === 'me')         ||
                (active.includes('unassigned') && assigned === 'unassigned') ||
                (active.includes('overdue')    && overdue);
    }
    evt.style.display = (kindOk && quickOk) ? '' : 'none';
  });
}
document.addEventListener('change', (ev) => {
  if (ev.target && ev.target.matches && (ev.target.matches('[data-jc-show]') || ev.target.matches('[data-jc-quick]'))) {
    applyCalendarFilters();
  }
});
document.addEventListener('s1ui:ready', applyCalendarFilters);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', applyCalendarFilters);
}
// Persist quick-filter selection so the server can re-query if it wants to.
document.addEventListener('change', async (ev) => {
  const cb = ev.target && ev.target.closest && ev.target.closest('[data-jc-quick]'); if (!cb) return;
  const selected = $$('[data-jc-quick]').filter(x => x.checked).map(x => x.getAttribute('data-jc-quick'));
  try { await comm.save('jobCalendar.quickFilters', { filters: selected }); }
  catch (e) { flash('Filter save failed: ' + (e.message || e)); }
});

// Click a day cell → reveal day panel; click the same cell again → deselect.
function closeDayPanel() {
  const main  = document.querySelector('.jc-main');
  const panel = document.querySelector('.jc-day-panel');
  if (panel) panel.style.display = 'none';
  if (main)  main.classList.remove('has-selected-day');
  $$('.cal-cell.selected').forEach(c => c.classList.remove('selected'));
  try { comm.save('jobCalendar.selectedDay', { day: null }); } catch {}
}
document.addEventListener('click', (ev) => {
  const cell = ev.target.closest('.cal-cell'); if (!cell) return;
  // Ignore clicks on events inside the cell — those are handled below to open the job.
  if (ev.target.closest('.cal-evt, .cal-pill, .cal-job, [data-record-id]')) return;
  if (cell.classList.contains('selected')) { closeDayPanel(); return; }
  const main  = document.querySelector('.jc-main');
  const panel = document.querySelector('.jc-day-panel');
  if (!main || !panel) return;
  main.classList.add('has-selected-day');
  panel.style.display = '';
  $$('.cal-cell.selected').forEach(c => c.classList.remove('selected'));
  cell.classList.add('selected');
  const num = (cell.querySelector('.cal-num') || {}).textContent || '';
  const dEl = panel.querySelector('.jc-day-panel-d');
  if (dEl && num) dEl.textContent = num + ' (selected)';
  try { comm.save('jobCalendar.selectedDay', { day: num }); } catch {}
});
// X button on the day panel closes it.
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('#jcDayPanelClose'); if (!b) return;
  ev.preventDefault();
  closeDayPanel();
});

// Month nav arrows (jc-nav-btn) — fire prev/next RPC. The first button is
// the chevron-left (prev), the second is chevron-right (next). The server
// returns the new state in r.state; we apply it so the month label + day
// grid both update without a page reload.
$$('.jc-month-nav .jc-nav-btn').forEach((b, i) => {
  const dir = i === 0 ? 'prev' : 'next';
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe(dir, () => comm.action('jobCalendar.' + dir, { currentMonth: currentDisplayedMonth() }));
    if (r && r.state) applyJobCalendarState(r.state);
  });
});

// Company / Personal toggle in the page header.
$$('.jc-view-toggle a[data-jobCalendar-filter]').forEach(a => {
  a.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const scope = a.getAttribute('data-jobCalendar-filter');
    $$('.jc-view-toggle a').forEach(x => x.classList.toggle('active', x === a));
    try { await comm.save('jobCalendar.scope', { scope }); flash(scope === 'personal' ? 'Personal calendar' : 'Company calendar'); }
    catch (e) { flash('Scope failed: ' + (e.message || e)); }
  });
});

// Click a job pill → open that job
document.addEventListener('click', async (ev) => {
  const pill = ev.target.closest('.cal-pill, .cal-job, [data-record-id]');
  if (!pill) return;
  const id = pill.getAttribute('data-record-id');
  if (!id) return;
  await safe('Open job', async () => {
    const r = await comm.action('jobCalendar.open', { id });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// AI fab


// v12 auto-modal toolbar bindings
(function(){
  const $$ = (s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-jobCalendar-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-jobCalendar-open'));}));
  window.S1.modal.bindForm('#calBookModal', 'jobCalendar.book', { label: 'Book' });
  window.S1.modal.bindForm('#calRescheduleModal', 'jobCalendar.reschedule', { label: 'Reschedule' });
  window.S1.modal.bindForm('#calBlockOutModal', 'jobCalendar.blockOut', { label: 'Block out' });
  window.S1.modal.bindForm('#calFilterCrewModal', 'jobCalendar.filterCrew', { label: 'Filter' });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('jobCalendar');
