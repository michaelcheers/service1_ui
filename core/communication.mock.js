// MockComm — in-memory JSON store. The dev / lab uses this.
// Classic-script build (file:// safe): no ES module; reads bus/store/fixtures
// from window.S1. Fixtures come from core/fixtures.js (window.S1.fixtures),
// not fetch(), so this works under the file:// protocol.
(function () {
  const bus = window.S1.bus;
  const store = window.S1.store;

  const LS_KEY = 's1ui_state';

  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

  function matches(item, params) {
    if (!params) return true;
    for (const [k, v] of Object.entries(params)) {
      if (item[k] !== v) return false;
    }
    return true;
  }

  class MockComm {
    constructor() {
      this._log = [];
      this._loadFromStorage();
      // hydrate from ?fixture=name if present
      const qs = new URLSearchParams(location.search);
      const fx = qs.get('fixture');
      if (fx) this.loadFixture(fx);
    }

    _loadFromStorage() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) store.replaceAll(JSON.parse(raw));
      } catch {}
    }

    _persist() {
      try { localStorage.setItem(LS_KEY, JSON.stringify(store.snapshot())); } catch {}
    }

    _record(kind, resource, payload, result) {
      const entry = { t: Date.now(), kind, resource, payload: clone(payload), result: clone(result) };
      this._log.push(entry);
      if (this._log.length > 500) this._log.shift();
      bus.emit('comm:log', entry);
    }

    async get(resource, params) {
      const raw = store.has(resource) ? store.get(resource) : undefined;
      let out;
      if (raw === undefined) {
        // Missing keys: return null so consumers can branch on shape themselves.
        out = null;
      } else if (Array.isArray(raw)) {
        out = params ? raw.filter(r => matches(r, params)) : raw;
      } else {
        out = raw;
      }
      out = clone(out);
      this._record('get', resource, params, out);
      return out;
    }

    async save(resource, payload) {
      const cur = store.get(resource);
      let result;
      if (Array.isArray(cur)) {
        const id = payload.id ?? (Math.max(0, ...cur.map(r => +r.id || 0)) + 1);
        const idx = cur.findIndex(r => r.id == id);
        const next = [...cur];
        const rec = { ...payload, id };
        if (idx >= 0) next[idx] = { ...next[idx], ...rec }; else next.push(rec);
        store.set(resource, next);
        result = { id, ok: true };
      } else {
        store.set(resource, { ...(cur || {}), ...payload });
        result = { ok: true };
      }
      this._persist();
      bus.emit('resource:' + resource, { kind: 'save', payload });
      this._record('save', resource, payload, result);
      return result;
    }

    async delete(resource, id) {
      const cur = store.get(resource);
      if (Array.isArray(cur)) {
        store.set(resource, cur.filter(r => r.id != id));
      } else {
        store.set(resource, null);
      }
      this._persist();
      bus.emit('resource:' + resource, { kind: 'delete', id });
      const result = { ok: true };
      this._record('delete', resource, { id }, result);
      return result;
    }

    subscribe(resource, cb) {
      const off = bus.on('resource:' + resource, cb);
      this._record('subscribe', resource, null, '(subscribed)');
      return off;
    }

    async action(name, payload) {
      const result = { ok: true, name, echo: payload };
      this._record('action', name, payload, result);
      bus.emit('action:' + name, payload);
      return result;
    }

    async upload(file, meta) {
      const url = file && URL && URL.createObjectURL ? URL.createObjectURL(file) : 'blob:mock';
      const result = { url, name: file?.name, size: file?.size, meta };
      this._record('upload', 'file', { name: file?.name, size: file?.size, meta }, result);
      return result;
    }

    async currentUser() {
      const u = store.get('auth/me') || { id: 1, name: 'Mock User', role: 'admin' };
      this._record('get', 'auth/me', null, u);
      return clone(u);
    }

    // --- lab-only helpers ---
    logEntries() { return this._log.slice(); }
    clearLog() { this._log = []; }
    async loadFixture(name) {
      try {
        const data = (window.S1.fixtures || {})[name];
        if (data == null) return false;
        store.replaceAll(data);
        this._persist();
        bus.emit('state:replaced', data);
        return true;
      } catch { return false; }
    }
    applyState(json) {
      store.replaceAll(json);
      this._persist();
      bus.emit('state:replaced', json);
    }
    reset() {
      store.replaceAll({});
      try { localStorage.removeItem(LS_KEY); } catch {}
      bus.emit('state:replaced', {});
    }
  }

  window.S1 = window.S1 || {};
  window.S1.MockComm = MockComm;
})();
