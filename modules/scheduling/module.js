const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "scheduling", title: "Scheduling", reads: ["jobs","crews"], writes: ["jobs"] };

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function renderGrid(crews, jobs) {
  const host = document.getElementById('grid-host'); if (!host) return;
  const startH = 8, endH = 17, hours = [];
  for (let h = startH; h <= endH; h++) hours.push(h);
  const days = Array.from(new Set((jobs || []).map(j => j.date))).filter(Boolean).sort();
  if (days.length === 0) days.push('—');
  let html = '';
  for (const day of days) {
    html += `<div style="margin-bottom:12px"><strong>${esc(day)}</strong>`;
    html += `<div class="grid" style="grid-template-columns: 120px repeat(${hours.length}, 1fr);margin-top:6px">`;
    html += `<div class="hd">Crew \\ Hour</div>`;
    for (const h of hours) html += `<div class="hd">${h}:00</div>`;
    for (const c of (crews || [])) {
      html += `<div class="lane">${esc(c.name)}</div>`;
      for (const h of hours) {
        const job = (jobs || []).find(j => j.date === day && j.crewId === c.id && j.startHour <= h && j.endHour > h);
        if (job) {
          html += `<div class="cell" style="background:${esc(job.color || '#004D40')};color:#fff;font-weight:600">${esc(job.title || job.customer)}</div>`;
        } else {
          html += `<div class="cell">&nbsp;</div>`;
        }
      }
    }
    html += `</div></div>`;
  }
  host.innerHTML = html;
}

async function load() {
  const [jobs, crews] = await Promise.all([comm.get("jobs"), comm.get("crews")]);
  const crewsDisplay = (crews || []).map(c => Object.assign({}, c, { members: Array.isArray(c.members) ? c.members.join(', ') : '' }));
  window.S1.render.bind(document, { jobs: jobs || [], crews: crewsDisplay });
  renderGrid(crews || [], jobs || []);
}
(async () => { try { await load(); document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'scheduling' } })); } catch(e){ console.warn(e); } })();
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch{} });
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save') comm.save(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
});
