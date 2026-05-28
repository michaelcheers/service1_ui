// PostMessageComm — talks to the host page via postMessage RPC.
//
// ui.service1.app is hosted on GitHub Pages (no backend, no API). When the
// host (business_card) iframes us, every comm op flows over postMessage:
//
//   us  → host: { type:'s1ui:rpc', id, method, resource, payload }
//   host → us:  { type:'s1ui:rpc:reply', id, ok:true,  data }
//             | { type:'s1ui:rpc:reply', id, ok:false, error }
//
// The host also pushes state proactively:
//
//   host → us:  { type:'s1ui:state', fixture, state }   // initial + after mutations
//   host → us:  { type:'s1ui:event', resource, event }  // for subscribers
//
// Classic-script build (file:// safe): no ES modules; reads bus from window.S1.
// Standalone access is blocked one level up in communication.js, so by the
// time this is selected we're guaranteed to have a parent window.
(function () {
  const bus = window.S1.bus;
  const log = (window.S1 && window.S1.log) || null;

  const RPC_TIMEOUT_MS = 30000;
  // Host origin pin. Set by the embedding host via a meta tag when the
  // page boots, e.g. <meta name="s1ui-host-origin" content="https://app.service1.app">.
  // Fall back to '*' only if the host didn't pin (dev). Outbound posts go
  // to window.parent regardless; inbound messages are filtered by origin.
  function hostOrigin() {
    const m = document.querySelector('meta[name="s1ui-host-origin"]');
    const v = m && m.getAttribute('content');
    return v && v.length ? v : '*';
  }
  const HOST_ORIGIN = hostOrigin();

  let rpcSeq = 0;
  const pending = new Map();  // id -> { resolve, reject, timer, t0, method, resource }
  const subscribers = new Map();  // resource -> Set<cb>

  function newId() { rpcSeq = (rpcSeq + 1) | 0; return 'r' + rpcSeq + '_' + Date.now().toString(36); }

  function rpc(method, resource, payload) {
    return new Promise(function (resolve, reject) {
      const id = newId();
      const t0 = Date.now();
      const timer = setTimeout(function () {
        pending.delete(id);
        if (log) log.tmo(id, method, resource, RPC_TIMEOUT_MS);
        reject(new Error('s1ui:rpc timeout: ' + method + ' ' + resource));
      }, RPC_TIMEOUT_MS);
      pending.set(id, { resolve: resolve, reject: reject, timer: timer, t0: t0, method: method, resource: resource });
      if (log) log.req(id, method, resource, payload);
      try {
        window.parent.postMessage(
          { type: 's1ui:rpc', id: id, method: method, resource: resource, payload: payload },
          HOST_ORIGIN
        );
      } catch (e) {
        clearTimeout(timer);
        pending.delete(id);
        if (log) log.err(id, method, resource, Date.now() - t0, e);
        reject(e);
      }
    });
  }

  window.addEventListener('message', function (ev) {
    // Drop messages from origins other than the pinned host (when pinned).
    if (HOST_ORIGIN !== '*' && ev.origin !== HOST_ORIGIN) return;
    const d = ev.data;
    if (!d || typeof d !== 'object') return;

    if (d.type === 's1ui:rpc:reply') {
      const p = pending.get(d.id);
      if (!p) return;
      clearTimeout(p.timer);
      pending.delete(d.id);
      const ms = Date.now() - p.t0;
      if (d.ok) {
        if (log) log.res(d.id, p.method, p.resource, ms, d.data);
        p.resolve(d.data);
      } else {
        if (log) log.err(d.id, p.method, p.resource, ms, d.error || 's1ui:rpc failed');
        p.reject(new Error(d.error || 's1ui:rpc failed'));
      }
      return;
    }

    if (d.type === 's1ui:event') {
      if (log) log.evt(d.resource, d.event);
      const set = subscribers.get(d.resource);
      if (set) set.forEach(function (cb) { try { cb(d.event); } catch {} });
      bus.emit('resource:' + d.resource, d.event || { kind: 'event' });
      return;
    }
  });

  class PostMessageComm {
    constructor() { this._log = []; }

    _record(kind, resource, payload, result) {
      const e = { t: Date.now(), kind: kind, resource: resource, payload: payload, result: result };
      this._log.push(e); if (this._log.length > 500) this._log.shift();
      bus.emit('comm:log', e);
      if (window.parent && window.parent !== window) {
        try { window.parent.postMessage({ type: 's1ui:comm:log', entry: e }, '*'); } catch {}
      }
    }

    async get(resource, params) {
      const out = await rpc('get', resource, params || null);
      this._record('get', resource, params, out);
      return out;
    }

    async save(resource, payload) {
      const out = await rpc('save', resource, payload);
      this._record('save', resource, payload, out);
      return out;
    }

    async delete(resource, id) {
      const out = await rpc('delete', resource, { id: id });
      this._record('delete', resource, { id: id }, out);
      return out;
    }

    async action(name, payload) {
      const out = await rpc('action', name, payload);
      this._record('action', name, payload, out);
      return out;
    }

    async upload(file, meta) {
      // Files don't survive postMessage cleanly; read to a data URL and
      // forward. Large uploads should be redirected to a host-served form.
      const dataUrl = await new Promise(function (resolve, reject) {
        const r = new FileReader();
        r.onload = function () { resolve(r.result); };
        r.onerror = function () { reject(r.error || new Error('read failed')); };
        r.readAsDataURL(file);
      });
      const resource = (meta && meta.resource) || 'file';
      const out = await rpc('upload', resource, {
        name: file && file.name, size: file && file.size, type: file && file.type,
        meta: meta || null, dataUrl: dataUrl
      });
      this._record('upload', resource, { name: file && file.name, size: file && file.size }, out);
      return out;
    }

    subscribe(resource, cb) {
      let set = subscribers.get(resource);
      if (!set) { set = new Set(); subscribers.set(resource, set); }
      set.add(cb);
      if (log) log.req('-', 'subscribe', resource, null);
      // Tell the host so it can push events for this resource.
      try { window.parent.postMessage({ type: 's1ui:subscribe', resource: resource }, HOST_ORIGIN); } catch {}
      this._record('subscribe', resource, null, '(subscribed)');
      return function unsubscribe() {
        set.delete(cb);
        if (!set.size) {
          subscribers.delete(resource);
          if (log) log.req('-', 'unsubscribe', resource, null);
          try { window.parent.postMessage({ type: 's1ui:unsubscribe', resource: resource }, HOST_ORIGIN); } catch {}
        }
      };
    }

    async currentUser() {
      const u = await rpc('get', 'auth/me', null);
      this._record('get', 'auth/me', null, u);
      return u;
    }

    logEntries() { return this._log.slice(); }
  }

  window.S1 = window.S1 || {};
  window.S1.ApiComm = PostMessageComm;
})();
