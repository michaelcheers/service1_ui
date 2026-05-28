// service1_ui — shared console logger for all RPC traffic.
// Classic script. Exposes window.S1.log with: req/res/err/evt/state/info/tmo.
//
// Kill-switch: window.SERVICE1_UI_LOG = false  OR  localStorage.s1ui_log = '0'
// Default: ON (every RPC and initial JSON load is logged).
//
// HARD RULE: every JSON payload/result/state object is emitted on its own
// dedicated console.log(obj) call with the object as the sole argument, so
// "Copy Object" / "Store as global variable" in DevTools is unambiguous.
// The labelled, styled prefix line goes first as a separate console call.
(function () {
  function enabled() {
    if (typeof window !== 'undefined' && window.SERVICE1_UI_LOG === false) return false;
    try { if (localStorage.getItem('s1ui_log') === '0') return false; } catch (e) {}
    return true;
  }
  var STYLE = {
    req:   'color:#FF9800;font-weight:600',
    res:   'color:#43A047;font-weight:600',
    err:   'color:#E53935;font-weight:600',
    evt:   'color:#E91E63;font-weight:600',
    state: 'color:#00897B;font-weight:600',
    info:  'color:#1E88E5;font-weight:600',
    tmo:   'color:#E53935;font-weight:600'
  };

  function req(id, method, resource, payload) {
    if (!enabled()) return;
    var open = console.groupCollapsed || console.log;
    open.call(console,
      '%c[s1ui \u2192]%c ' + method + ' ' + resource + ' #' + id,
      STYLE.req, '');
    console.log(payload);
  }
  function res(id, method, resource, ms, data) {
    if (!enabled()) return;
    console.log('%c[s1ui \u2190]%c ' + method + ' ' + resource + ' #' + id + '  ' + ms + 'ms',
      STYLE.res, '');
    console.log(data);
    if (console.groupEnd) console.groupEnd();
  }
  function err(id, method, resource, ms, error) {
    if (!enabled()) return;
    console.warn('%c[s1ui \u2717]%c ' + method + ' ' + resource + ' #' + id + '  ' + ms + 'ms',
      STYLE.err, '');
    console.log(error);
    if (console.groupEnd) console.groupEnd();
  }
  function evt(resource, event) {
    if (!enabled()) return;
    console.log('%c[s1ui \u21D0 evt]%c ' + resource, STYLE.evt, '');
    console.log(event);
  }
  function state(fixture, stateObj) {
    if (!enabled()) return;
    console.log('%c[s1ui \u21D0 state]%c fixture=' + (fixture || '(none)'), STYLE.state, '');
    console.log(stateObj);
  }
  function info(msg, extra) {
    if (!enabled()) return;
    console.info('%c[s1ui]%c ' + msg, STYLE.info, '');
    if (extra !== undefined) console.log(extra);
  }
  function tmo(id, method, resource, ms) {
    if (enabled()) {
      console.warn('%c[s1ui \u231B]%c ' + method + ' ' + resource + ' #' + id +
        ' timed out after ' + ms + 'ms', STYLE.tmo, '');
    }
    if (console.groupEnd) console.groupEnd();
  }

  window.S1 = window.S1 || {};
  window.S1.log = { req: req, res: res, err: err, evt: evt, state: state, info: info, tmo: tmo };
})();
