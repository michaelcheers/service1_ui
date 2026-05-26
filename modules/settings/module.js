// Module: Settings — hand-wired per element. The standard-page helper is
// intentionally NOT used here because Settings has multiple semantically
// different controls (form save, theme segmented, notification toggles,
// danger-zone actions, nav switch) that aren't a single "list page"
// pattern.

const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "settings", title: "Settings", reads: ["settings"], writes: ["settings"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["settings"] || {};

  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'settings' } }));
}
load().catch(e => console.warn('[settings] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2200); });
const safe  = window.S1.safe  || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

// ── 1) Left-nav links (Profile / Password / Notifications / Company / …)
//     Click switches active state + records the selection server-side so the
//     PageModel can serve the corresponding pane on next state push.
$$('.settings-nav a').forEach(a => {
  a.addEventListener('click', async (ev) => {
    ev.preventDefault();
    $$('.settings-nav a').forEach(x => x.classList.toggle('active', x === a));
    const key = (a.textContent || '').replace(/\s+/g, ' ').trim();
    const title = $('.page-title');
    if (title) title.textContent = key;
    await safe('Switch pane', () => comm.save('settings.nav', { nav: key }));
  });
});

// ── 2) Save changes — collects every named input + selected toggles
//     + theme + segmented options inside the profile scope.
function gatherProfileForm() {
  const scope = $('main.settings-main') || document;
  const payload = {};
  $$('input[name], select[name]', scope).forEach(el => {
    if (el.type === 'checkbox') payload[el.name] = el.checked;
    else payload[el.name] = el.value;
  });
  // Theme selection
  const themeBtn = $('.seg-theme button.active');
  if (themeBtn) payload.theme = themeBtn.getAttribute('data-theme');
  // Notification toggles → nested map
  payload.notifications = {};
  $$('[data-notif-group]', scope).forEach(group => {
    const key = group.getAttribute('data-notif-group');
    payload.notifications[key] = {};
    $$('[data-channel]', group).forEach(t => {
      payload.notifications[key][t.getAttribute('data-channel')] = t.classList.contains('on');
    });
  });
  return payload;
}

$$('button[data-jd-action="save"]').forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const payload = gatherProfileForm();
    await safe('Save changes', async () => {
      const r = await comm.save('settings.profile', payload);
      if (r && r.ok) flash('Saved');
    });
  });
});

// ── 3) Cancel — reverts edits by re-loading the state.
$$('button[data-jd-action="cancel"]').forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    if (!window.confirm('Discard unsaved changes?')) return;
    await load();
    flash('Reverted');
  });
});

// ── 4) Avatar Upload new — opens file picker, sends as comm.upload.
$$('button[data-jd-action="avatar-upload"]').forEach(b => {
  let input = $('#settings-avatar-input');
  if (!input) {
    input = document.createElement('input');
    input.id = 'settings-avatar-input';
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);
  }
  b.addEventListener('click', (ev) => { ev.preventDefault(); input.click(); });
  input.addEventListener('change', async () => {
    const f = (input.files || [])[0];
    if (!f) return;
    await safe('Upload avatar', async () => {
      await comm.upload(f, { resource: 'settings.avatar' });
      flash('Avatar uploaded');
    });
    input.value = '';
  });
});

// ── 5) Avatar Remove
$$('button[data-jd-action="avatar-remove"]').forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    if (!window.confirm('Remove your avatar?')) return;
    await safe('Remove avatar', () => comm.action('settings.avatar-remove', {}));
    flash('Avatar removed');
  });
});

// ── 6) Theme segmented — active state + persist immediately.
$$('.seg-theme button').forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    $$('.seg-theme button').forEach(x => x.classList.toggle('active', x === b));
    document.documentElement.dataset.theme = b.getAttribute('data-theme');
    await safe('Theme', () => comm.save('settings.theme', { theme: b.getAttribute('data-theme') }));
  });
});

// ── 7) Notification toggles — flip state + persist single channel.
$$('[data-notif-group] [data-channel]').forEach(toggle => {
  toggle.addEventListener('click', async (ev) => {
    ev.preventDefault();
    toggle.classList.toggle('on');
    const group = toggle.closest('[data-notif-group]').getAttribute('data-notif-group');
    const channel = toggle.getAttribute('data-channel');
    await safe('Notification', () => comm.save('settings.notifications', {
      group, channel, on: toggle.classList.contains('on')
    }));
  });
});

// ── 8) Sign out all sessions
$$('button[data-jd-action="sign-out-all"]').forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    if (!window.confirm('Sign out of all browsers and devices?')) return;
    await safe('Sign out all', async () => {
      const r = await comm.action('settings.sign-out-all', {});
      if (r && r.navigateTo) window.location.href = r.navigateTo;
      else flash('Signed out');
    });
  });
});

// ── 9) Delete account — confirm via the account-settings page; no popup.
$$('button[data-jd-action="delete-account"]').forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    flash('Delete account from the account settings page');
  });
});

// ── 10) AI fab
