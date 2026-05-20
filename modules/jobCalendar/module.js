const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "jobCalendar", title: "Job Calendar", reads: ["jobs"], writes: ["jobs"] };

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function renderCalendar(jobs) {
  const host = document.getElementById('cal-host'); if (!host) return;
  const days = Array.from(new Set((jobs || []).map(j => j.date))).filter(Boolean).sort();
  if (!days.length) { host.innerHTML = '<div class="list-empty">No jobs scheduled.</div>'; return; }
  const html = days.map(day => {
    const pills = (jobs || []).filter(j => j.date === day).map(j =>
      `<div class="pill" style="background:${esc(j.color || '#004D40')}">${esc(j.title || j.customer)} · ${esc(j.startHour)}–${esc(j.endHour)}</div>`
    ).join('');
    return `<div class="cell"><div class="date">${esc(day)}</div>${pills}</div>`;
  }).join('');
  host.innerHTML = `<div class="cal">${html}</div>`;
}

async function load() {
  const jobs = await comm.get("jobs");
  window.S1.render.bind(document, { jobs: jobs || [] });
  renderCalendar(jobs || []);
}
(async () => { try { await load(); document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'jobCalendar' } })); } catch(e){ console.warn(e); } })();
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch{} });
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save') comm.save(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
});
