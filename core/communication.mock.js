// MockComm — in-memory JSON store. The dev / lab uses this.
// Classic-script build (file:// safe): no ES module; reads bus/store/fixtures
// from window.S1. Fixtures come from core/fixtures.js (window.S1.fixtures),
// not fetch(), so this works under the file:// protocol.
(function () {
  const bus = window.S1.bus;
  const store = window.S1.store;
  const log = (window.S1 && window.S1.log) || null;

  const LS_KEY = 's1ui_state';

  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

  function matches(item, params) {
    if (!params) return true;
    for (const [k, v] of Object.entries(params)) {
      if (item[k] !== v) return false;
    }
    return true;
  }

  let mockSeq = 0;
  function mockId() { mockSeq = (mockSeq + 1) | 0; return 'm' + mockSeq + '_' + Date.now().toString(36); }

  class MockComm {
    constructor() {
      this._log = [];
      const hadStored = this._loadFromStorage();
      if (hadStored && log) log.state('(localStorage)', store.snapshot());
      // hydrate from ?fixture=name if present
      const qs = new URLSearchParams(location.search);
      const fx = qs.get('fixture');
      if (fx) {
        this.loadFixture(fx);
        if (log) log.state(fx, store.snapshot());
      }
      // Lab "open standalone" passes the user's edited state via the URL
      // hash (#state=<uri-encoded JSON>); apply it after the fixture so it
      // wins over the fixture defaults. Modules render straight out of
      // window.S1.fixtures[<name>], so we have to overwrite the fixture
      // entry — replacing only the store is invisible to the render layer.
      if (location.hash && location.hash.indexOf('state=') !== -1) {
        try {
          const m = location.hash.match(/(?:^#|&)state=([^&]+)/);
          if (m) {
            const json = JSON.parse(decodeURIComponent(m[1]));
            store.replaceAll(json);
            if (fx && window.S1 && window.S1.fixtures) {
              window.S1.fixtures[fx] = json;
            }
            bus.emit('state:replaced', json);
            if (log) log.state(fx || '(hash)', json);
          }
        } catch {}
      }
    }

    _loadFromStorage() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) { store.replaceAll(JSON.parse(raw)); return true; }
      } catch {}
      return false;
    }

    _persist() {
      try { localStorage.setItem(LS_KEY, JSON.stringify(store.snapshot())); } catch {}
    }

    _record(kind, resource, payload, result) {
      const entry = { t: Date.now(), kind, resource, payload: clone(payload), result: clone(result) };
      this._log.push(entry);
      if (this._log.length > 500) this._log.shift();
      bus.emit('comm:log', entry);
      if (window.parent && window.parent !== window) {
        try { window.parent.postMessage({ type: 's1ui:comm:log', entry: entry }, '*'); } catch {}
      }
    }

    async get(resource, params) {
      const id = mockId(), t0 = Date.now();
      if (log) log.req(id, 'get', resource, params || null);
      const raw = store.get(resource);
      let out;
      if (Array.isArray(raw)) {
        out = params ? raw.filter(r => matches(r, params)) : raw;
      } else {
        out = raw == null ? null : raw;
      }
      out = clone(out);
      this._record('get', resource, params, out);
      if (log) log.res(id, 'get', resource, Date.now() - t0, out);
      return out;
    }

    async save(resource, payload) {
      const id = mockId(), t0 = Date.now();
      if (log) log.req(id, 'save', resource, payload);
      const cur = store.get(resource);
      let result;
      if (Array.isArray(cur)) {
        const newId = payload.id ?? (Math.max(0, ...cur.map(r => +r.id || 0)) + 1);
        const idx = cur.findIndex(r => r.id == newId);
        const next = [...cur];
        const rec = { ...payload, id: newId };
        if (idx >= 0) next[idx] = { ...next[idx], ...rec }; else next.push(rec);
        store.set(resource, next);
        result = { id: newId, ok: true };
      } else {
        store.set(resource, { ...(cur || {}), ...payload });
        result = { ok: true };
      }
      this._persist();
      bus.emit('resource:' + resource, { kind: 'save', payload });
      this._record('save', resource, payload, result);
      if (log) log.res(id, 'save', resource, Date.now() - t0, result);
      return result;
    }

    async delete(resource, id) {
      const reqId = mockId(), t0 = Date.now();
      if (log) log.req(reqId, 'delete', resource, { id });
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
      if (log) log.res(reqId, 'delete', resource, Date.now() - t0, result);
      return result;
    }

    subscribe(resource, cb) {
      const id = mockId(), t0 = Date.now();
      if (log) log.req(id, 'subscribe', resource, null);
      const off = bus.on('resource:' + resource, cb);
      this._record('subscribe', resource, null, '(subscribed)');
      if (log) log.res(id, 'subscribe', resource, Date.now() - t0, '(subscribed)');
      return function unsubscribe() {
        const uid = mockId();
        if (log) log.req(uid, 'unsubscribe', resource, null);
        off();
        if (log) log.res(uid, 'unsubscribe', resource, 0, '(unsubscribed)');
      };
    }

    async action(name, payload) {
      const id = mockId(), t0 = Date.now();
      if (log) log.req(id, 'action', name, payload);
      const result = { ok: true, name, echo: payload };
      this._record('action', name, payload, result);
      bus.emit('action:' + name, payload);
      if (log) log.res(id, 'action', name, Date.now() - t0, result);
      return result;
    }

    async upload(file, meta) {
      const id = mockId(), t0 = Date.now();
      const reqPayload = { name: file?.name, size: file?.size, meta };
      if (log) log.req(id, 'upload', 'file', reqPayload);
      const url = file && URL && URL.createObjectURL ? URL.createObjectURL(file) : 'blob:mock';
      const result = { url, name: file?.name, size: file?.size, meta };
      this._record('upload', 'file', reqPayload, result);
      if (log) log.res(id, 'upload', 'file', Date.now() - t0, result);
      return result;
    }

    async currentUser() {
      const id = mockId(), t0 = Date.now();
      if (log) log.req(id, 'get', 'auth/me', null);
      const u = store.get('auth/me') || { id: 1, name: 'Mock User', role: 'admin' };
      this._record('get', 'auth/me', null, u);
      const out = clone(u);
      if (log) log.res(id, 'get', 'auth/me', Date.now() - t0, out);
      return out;
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

// Host bridge: when embedded in an iframe by another origin (e.g. the
// business_card .cshtml pages iframe ui.service1.app), the host posts
// the page's state in via postMessage instead of the URL hash. This
// channel is cross-origin friendly where the hash trick was a file://
// workaround. Same effect: overwrite the fixture, replace the store,
// re-render. Lives next to the hash handler in MockComm but applies in
// any mode — the host might want to override state for an API page too.
(function () {
  if (typeof window === 'undefined' || window.parent === window) return;
  const log = (window.S1 && window.S1.log) || null;
  const qs = new URLSearchParams(location.search);
  const defaultFixture = qs.get('fixture');

  // #1587: `partial` pushes (scoped mutation deltas / lazy tab slices) are
  // shallow-merged into the existing fixture rather than replacing it — a
  // replace would blank every key the delta doesn't carry (e.g. pushing only
  // {timeline,teams,metrics} would wipe the rosters and any loaded tab). Full
  // (non-partial) pushes keep replace semantics, preserving the prod-safety
  // wipe behaviour the host relies on for a clean reload.
  function apply(fixtureName, state, partial) {
    if (!state) return;
    try {
      var effective = state;
      if (partial && fixtureName && window.S1 && window.S1.fixtures) {
        var cur = window.S1.fixtures[fixtureName] || {};
        effective = Object.assign({}, cur, state);
      }
      if (fixtureName && window.S1 && window.S1.fixtures) {
        window.S1.fixtures[fixtureName] = effective;
      }
      if (window.S1 && window.S1.store && typeof window.S1.store.replaceAll === 'function') {
        window.S1.store.replaceAll(effective);
      }
      if (window.S1 && window.S1.bus) window.S1.bus.emit('state:replaced', effective);
      if (window.S1 && window.S1.render && typeof window.S1.render.bind === 'function') {
        window.S1.render.bind(document, effective);
      }
    } catch {}
  }

  window.addEventListener('message', (ev) => {
    const d = ev.data;
    if (!d || typeof d !== 'object' || d.type !== 's1ui:state') return;
    if (log) log.state(d.fixture || defaultFixture, d.state);
    apply(d.fixture || defaultFixture, d.state, !!d.partial);
  });

  // Tell the host we're ready to receive state. The host must wait for
  // this — posting before the listener attaches drops the message on the
  // floor. Posted to '*' for now; the host's `event.source` already
  // identifies the iframe, and we don't need to authenticate the host.
  if (log) log.info('handshake \u2192 s1ui:ready', { fixture: defaultFixture });
  try { window.parent.postMessage({ type: 's1ui:ready', fixture: defaultFixture }, '*'); } catch {}
})();
