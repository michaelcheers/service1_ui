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
      var root = document.documentElement;
      while (root.firstChild) root.removeChild(root.firstChild);
      var head = document.createElement('head');
      var meta = document.createElement('meta');
      meta.setAttribute('charset', 'utf-8');
      var title = document.createElement('title');
      title.textContent = 'service1_ui';
      head.appendChild(meta);
      head.appendChild(title);
      var body = document.createElement('body');
      body.style.cssText = 'font-family:system-ui,sans-serif;color:#788680;'
        + 'display:flex;align-items:center;justify-content:center;'
        + 'min-height:100vh;margin:0;background:#EEF0EC;';
      var p = document.createElement('p');
      p.textContent = 'This page is meant to be embedded by the Service1 host.';
      body.appendChild(p);
      root.appendChild(head);
      root.appendChild(body);
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

  // Hard guarantee: on prod (*.service1.app) the demo fixture bundle must never
  // render to a real user. fixtures.js populates window.S1.fixtures with demo
  // content as a design preview; module.js does
  //   const data = (window.S1.fixtures || {})[name] || {};
  //   render.bind(document, data);
  // — if the host's state push for ANY reason fails to arrive before the
  // initial render (race, postMessage drop, BuildS1State throw, refresh after
  // logout, etc.), the iframe would render demo data. On prod we wipe fixtures
  // to empty objects per module so the worst case is "—" / empty bindings,
  // never "Johanna Kuyvenhoven · $128,400". Off-prod (lab/localhost/file://)
  // the bundle stays intact so the design preview still works.
  try {
    if (typeof window !== 'undefined'
        && /(^|\.)service1\.app$/i.test(location.hostname)
        && window.S1 && window.S1.fixtures) {
      for (const k of Object.keys(window.S1.fixtures)) {
        window.S1.fixtures[k] = {};
      }
    }
  } catch {}

  const comm = mode === 'api' ? new window.S1.ApiComm() : new window.S1.MockComm();
  comm.mode = mode;

  window.S1 = window.S1 || {};
  window.S1.comm = comm;

  // expose for the lab harness (kept for backward compatibility)
  if (typeof window !== 'undefined') window.__s1ui_comm = comm;
})();
