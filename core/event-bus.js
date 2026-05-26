// Minimal pub/sub used by mock comms + lab harness.
// Classic-script build (file:// safe): attaches to window.S1, no ES module.
(function () {
  const listeners = new Map();
  const bus = {
    on(event, cb) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(cb);
      return () => listeners.get(event)?.delete(cb);
    },
    off(event, cb) { listeners.get(event)?.delete(cb); },
    emit(event, data) {
      listeners.get(event)?.forEach(cb => { try { cb(data); } catch (e) { console.error(e); } });
      // wildcard for the lab
      listeners.get('*')?.forEach(cb => { try { cb({ event, data }); } catch {} });
    }
  };
  window.S1 = window.S1 || {};
  window.S1.bus = bus;
  if (typeof window !== 'undefined') window.__s1ui_bus = bus;
})();
