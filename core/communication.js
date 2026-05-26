// service1_ui — communication layer (classic-script build, file:// safe).
// One module imports nothing; it reads window.S1.comm set up here.
// Mode is selected by:
//   1. window.SERVICE1_UI_MODE
//   2. ?mode=mock|api query string
//   3. localStorage.s1ui_mode
//   4. default = "mock"
//
// Load order (classic scripts, no bundler): event-bus, state-store, schema,
// fixtures, communication.mock, communication.api, THEN this file.
(function () {
  // Embedded-only on prod. ui.service1.app is GitHub Pages — pure static
  // hosting, no API, no auth, no data. Standalone access would render
  // fixture data to the public, which is misleading at best. If the page
  // isn't framed by a host (business_card / lab harness), wipe it and
  // stop before module.js runs. Off-prod (file://, localhost) we let it
  // boot so the local lab / `?fixture=` workflow still works.
  try {
    if (typeof window !== 'undefined'
        && window.parent === window
        && /(^|\.)service1\.app$/i.test(location.hostname)) {
      document.documentElement.innerHTML =
        '<head><meta charset="utf-8"><title>service1_ui</title></head>'
        + '<body style="font-family:system-ui,sans-serif;color:#788680;'
        + 'display:flex;align-items:center;justify-content:center;'
        + 'min-height:100vh;margin:0;background:#EEF0EC;">'
        + '<p>This page is meant to be embedded by the Service1 host.</p>'
        + '</body>';
      return;
    }
  } catch {}

  function detectMode() {
    // Prod origin is non-negotiable: served from *.service1.app always
    // runs against the real API. No query string / localStorage / global
    // override can downgrade it to mock — fixtures must never reach prod.
    try {
      if (/(^|\.)service1\.app$/i.test(location.hostname)) return 'api';
    } catch {}
    // Off-prod (file://, localhost, GH Pages preview, etc.): explicit
    // overrides win so the lab harness and tests can pick a mode.
    if (typeof window !== 'undefined' && window.SERVICE1_UI_MODE) return window.SERVICE1_UI_MODE;
    const qs = new URLSearchParams(location.search);
    if (qs.get('mode')) return qs.get('mode');
    try { const v = localStorage.getItem('s1ui_mode'); if (v) return v; } catch {}
    return 'mock';
  }

  const mode = detectMode();
  const comm = mode === 'api' ? new window.S1.ApiComm() : new window.S1.MockComm();
  comm.mode = mode;

  window.S1 = window.S1 || {};
  window.S1.comm = comm;

  // expose for the lab harness (kept for backward compatibility)
  if (typeof window !== 'undefined') window.__s1ui_comm = comm;
})();
