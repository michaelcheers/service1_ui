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
  function detectMode() {
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
