const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = {
  name: "settings", title: "Settings",
  reads: ["settings","auth/me","settings/roles","settings/timezones","settings/languages",
          "settings/theme","settings/notifications","settings/nav"],
  writes: ["settings"]
};

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function fillOptions(id, list, selected) {
  const el = document.getElementById(id); if (!el) return;
  el.innerHTML = (list || []).map(v => `<option${v === selected ? ' selected' : ''}>${esc(v)}</option>`).join('');
}

function applyToggleClasses() {
  document.querySelectorAll('.toggle').forEach(t => {
    const m = t.className.match(/(email|sms|push)-(true|false)/);
    if (m) t.classList.toggle('on', m[2] === 'true');
  });
}

function renderNav(navData) {
  const host = document.getElementById('nav-host'); if (!host) return;
  host.innerHTML = (navData || []).map(g =>
    `<div class="nav-group"><div class="title">${esc(g.group)}</div>` +
    (g.items || []).map(it => `<div class="nav-item${it.active ? ' active' : ''}">${esc(it.label)}</div>`).join('') +
    `</div>`
  ).join('');
}

function setVal(id, v) { const el = document.getElementById(id); if (el && v != null) el.value = v; }

async function load() {
  const [settings, me, roles, timezones, languages, theme, notifications, nav] = await Promise.all([
    comm.get("settings"), comm.get("auth/me"), comm.get("settings/roles"),
    comm.get("settings/timezones"), comm.get("settings/languages"),
    comm.get("settings/theme"), comm.get("settings/notifications"), comm.get("settings/nav")
  ]);
  window.S1.render.bind(document, { notifications: notifications || [] });
  applyToggleClasses();
  renderNav(nav || []);
  setVal('f-name', me && me.name);
  setVal('f-email', me && me.email);
  setVal('f-phone', me && me.phone);
  setVal('f-company', settings && settings.company);
  setVal('f-theme', theme && theme.value);
  fillOptions('f-role', roles, me && me.role);
  fillOptions('f-tz', timezones, settings && settings.timezone);
  fillOptions('f-lang', languages, (languages && languages[0]));
}

(async () => { try { await load(); document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'settings' } })); } catch(e){ console.warn(e); } })();
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch{} });
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  if (kind === 'save') comm.save(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, t.dataset.payload ? JSON.parse(t.dataset.payload) : {});
});
