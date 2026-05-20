// In-memory JSON state, keyed by resource name (e.g. "jobs", "auth/me").
// Classic-script build (file:// safe): attaches to window.S1, no ES module.
(function () {
  const _state = {};
  const store = {
    get(key) { return _state[key]; },
    set(key, value) { _state[key] = value; },
    has(key) { return Object.prototype.hasOwnProperty.call(_state, key); },
    snapshot() { return JSON.parse(JSON.stringify(_state)); },
    replaceAll(obj) {
      for (const k of Object.keys(_state)) delete _state[k];
      if (obj && typeof obj === 'object') Object.assign(_state, JSON.parse(JSON.stringify(obj)));
    }
  };
  window.S1 = window.S1 || {};
  window.S1.store = store;
  if (typeof window !== 'undefined') window.__s1ui_store = store;
})();
