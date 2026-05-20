// Used by lab.html to load a module in an iframe and observe its I/O.
// Classic-script build (file:// safe): no ES module, no fetch; module list
// comes from window.S1.modulesIndex (modules.index.js).
//
// Comms is shared via window.__s1ui_comm being set on the parent; the
// iframe loads the comm scripts fresh, but the lab subscribes to the
// `comm:log` bus event in BOTH frames (the iframe contentWindow exposes
// its own bus) and mirrors entries into the lab pane.
//
// NOTE: cross-frame access between file:// documents is blocked by Chrome
// (opaque origins). The Lab's live mirroring works in Firefox, or in Chrome
// launched with --allow-file-access-from-files, or over any http server.
(function () {
  const bus = window.S1.bus;

  function loadModuleInto(iframe, moduleName, opts = {}) {
    const fixture = opts.fixture || moduleName;
    const mode = opts.mode || 'mock';
    const qs = new URLSearchParams({ mode, fixture, embedded: '1' });
    const url = '../modules/' + moduleName + '/index.html?' + qs.toString();
    iframe.src = url;

    iframe.addEventListener('load', () => {
      try {
        const w = iframe.contentWindow;
        if (w && w.__s1ui_bus) {
          // mirror child bus events to parent
          w.__s1ui_bus.on('*', ({ event, data }) => bus.emit('iframe:' + event, data));
        }
      } catch (e) { /* cross-origin (file://) — mirroring unavailable */ }
    }, { once: true });
  }

  function listModules() {
    return (window.S1 && window.S1.modulesIndex) || [];
  }

  window.S1 = window.S1 || {};
  window.S1.loadModuleInto = loadModuleInto;
  window.S1.listModules = listModules;
})();
