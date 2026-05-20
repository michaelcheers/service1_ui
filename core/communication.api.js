// ApiComm — talks to the real ASP.NET backend. Used when service1_ui is
// embedded by the Service1 app (window.SERVICE1_UI_MODE = 'api').
// Classic-script build (file:// safe): no ES module; reads bus from window.S1.
//
// All methods share the same surface as MockComm. Endpoints follow the
// resource catalogue in the plan; resources with a "/" map to nested
// paths (e.g. "finance/invoices" -> /api/finance/invoices).
//
// NOTE: this backend only works over http(s) against the host. Opening the
// site via file:// always uses MockComm; api mode is a prod-embed concern.
(function () {
  const bus = window.S1.bus;

  const BASE = (typeof window !== 'undefined' && window.SERVICE1_UI_API_BASE) || '/api';

  function endpoint(resource, id) {
    const path = resource.replace(/\/:id\b/, '');
    return BASE + '/' + path + (id != null ? '/' + encodeURIComponent(id) : '');
  }

  function csrf() {
    const m = document.querySelector('meta[name="csrf-token"]');
    return m ? m.getAttribute('content') : '';
  }

  async function call(method, url, body) {
    const res = await fetch(url, {
      method,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(csrf() ? { 'X-CSRF-Token': csrf() } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(method + ' ' + url + ' -> ' + res.status);
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  }

  class ApiComm {
    constructor() { this._subs = new Map(); this._log = []; }

    _record(kind, resource, payload, result) {
      const e = { t: Date.now(), kind, resource, payload, result };
      this._log.push(e); if (this._log.length > 500) this._log.shift();
      bus.emit('comm:log', e);
    }

    async get(resource, params) {
      const url = endpoint(resource) + (params ? '?' + new URLSearchParams(params) : '');
      const out = await call('GET', url);
      this._record('get', resource, params, out);
      return out;
    }

    async save(resource, payload) {
      const hasId = payload && payload.id != null;
      const url = endpoint(resource, hasId ? payload.id : null);
      const out = await call(hasId ? 'PUT' : 'POST', url, payload);
      this._record('save', resource, payload, out);
      return out;
    }

    async delete(resource, id) {
      const url = endpoint(resource, id);
      const out = await call('DELETE', url);
      this._record('delete', resource, { id }, out);
      return out;
    }

    subscribe(resource, cb) {
      // Best-effort SignalR-ish stub: poll every 10s. The real hub
      // connection should be wired here when the prod hub is settled.
      const t = setInterval(async () => {
        try { cb({ kind: 'poll', data: await this.get(resource) }); } catch {}
      }, 10000);
      this._record('subscribe', resource, null, '(polling)');
      return () => clearInterval(t);
    }

    async action(name, payload) {
      const out = await call('POST', BASE + '/actions/' + name, payload);
      this._record('action', name, payload, out);
      return out;
    }

    async upload(file, meta) {
      const fd = new FormData();
      fd.append('file', file);
      if (meta) fd.append('meta', JSON.stringify(meta));
      const res = await fetch(BASE + '/upload', {
        method: 'POST', credentials: 'include',
        headers: csrf() ? { 'X-CSRF-Token': csrf() } : {}, body: fd
      });
      if (!res.ok) throw new Error('upload ' + res.status);
      const out = await res.json();
      this._record('upload', 'file', { name: file?.name, size: file?.size }, out);
      return out;
    }

    async currentUser() {
      const u = await call('GET', BASE + '/me');
      this._record('get', 'auth/me', null, u);
      return u;
    }

    logEntries() { return this._log.slice(); }
  }

  window.S1 = window.S1 || {};
  window.S1.ApiComm = ApiComm;
})();
