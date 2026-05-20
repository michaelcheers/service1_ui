const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "crewProcesses", title: "Crew Processes", reads: ["crews","settings"], writes: ["settings"] };

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function renderProcesses(processes) {
  const host = document.getElementById('processes-host');
  if (!host) return;
  host.innerHTML = (processes || []).map(p => {
    const steps = (p.stepsList || []).map(s =>
      `<div class="step"><div class="step-n">${esc(s.n)}</div><div>${esc(s.label)}</div><div class="section-sub">${esc(s.owner)}</div></div>`
    ).join('');
    return `<div class="proc">
      <div class="proc-head"><strong>${esc(p.label)}</strong><span class="section-sub">${esc(p.steps)} steps</span></div>
      <div>${steps}</div>
    </div>`;
  }).join('');
}

async function load() {
  const [crews, settings] = await Promise.all([comm.get("crews"), comm.get("settings")]);
  window.S1.render.bind(document, { crews: crews || [] });
  renderProcesses(settings && settings.processes);
}

(async () => { try { await load(); document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'crewProcesses' } })); } catch(e){ console.warn(e); } })();
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch{} });
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save') comm.save(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
});
