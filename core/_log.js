// service1_ui — shared console logger for all RPC traffic.
// Classic script. Exposes window.S1.log with: req/res/err/evt/state/info/tmo.
//
// Kill-switch: window.SERVICE1_UI_LOG = false  OR  localStorage.s1ui_log = '0'
// Default: ON (every RPC and initial JSON load is logged).
//
// Every entry is a single console.log call: one flat line "[tag] label  <json>".
// No %c styling, no console.groupCollapsed — payload JSON is inline so Ctrl+C
// copies it verbatim and you don't have to expand any tree nodes.
(function () {
  function enabled() {
    if (typeof window !== 'undefined' && window.SERVICE1_UI_LOG === false) return false;
    try { if (localStorage.getItem('s1ui_log') === '0') return false; } catch (e) {}
    return true;
  }
  function asJson(v) {
    if (v === undefined) return 'undefined';
    try {
      var seen = [];
      return JSON.stringify(v, function (k, val) {
        if (val && typeof val === 'object') {
          if (seen.indexOf(val) !== -1) return '[Circular]';
          seen.push(val);
        }
        return val;
      }, 2);
    } catch (e) { return String(v); }
  }

  function req(id, method, resource, payload) {
    if (!enabled()) return;
    console.log('[s1ui \u2192] ' + method + ' ' + resource + ' #' + id + '  ' + asJson(payload));
  }
  function res(id, method, resource, ms, data) {
    if (!enabled()) return;
    console.log('[s1ui \u2190] ' + method + ' ' + resource + ' #' + id + '  ' + ms + 'ms  ' + asJson(data));
  }
  function err(id, method, resource, ms, error) {
    if (!enabled()) return;
    console.warn('[s1ui \u2717] ' + method + ' ' + resource + ' #' + id + '  ' + ms + 'ms  ' + asJson(error));
  }
  function evt(resource, event) {
    if (!enabled()) return;
    console.log('[s1ui \u21D0 evt] ' + resource + '  ' + asJson(event));
  }
  function state(fixture, stateObj) {
    if (!enabled()) return;
    console.log('[s1ui \u21D0 state] fixture=' + (fixture || '(none)') + '  ' + asJson(stateObj));
  }
  function info(msg, extra) {
    if (!enabled()) return;
    var line = '[s1ui] ' + msg;
    if (extra !== undefined) line += '  ' + asJson(extra);
    console.info(line);
  }
  function tmo(id, method, resource, ms) {
    if (!enabled()) return;
    console.warn('[s1ui \u231B] ' + method + ' ' + resource + ' #' + id + ' timed out after ' + ms + 'ms');
  }

  window.S1 = window.S1 || {};
  window.S1.log = { req: req, res: res, err: err, evt: evt, state: state, info: info, tmo: tmo };
})();
