// Tiny shared render helper (classic-script, file:// safe).
// Modules build an in-memory `state` object and call:
//   S1.render.bind(rootEl, state)
//   - [data-bind-text="path"] (optionally data-fmt="usd|pct|num|date|duration|str")
//     sets textContent from get(state, path)
//   - [data-bind="path"] clones its <template> for each item in array
//     (or the single object); {{field}} / {{field|fmt}} placeholders inside the
//     template are substituted from each item.
(function () {
  function get(obj, path) {
    if (obj == null || !path) return undefined;
    var parts = String(path).split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function fmtUsd(n) {
    if (n == null || isNaN(n)) return '—';
    var abs = Math.abs(+n);
    var sign = n < 0 ? '-' : '';
    var parts = abs.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var dec = parts[1] === '00' ? '' : '.' + parts[1];
    return sign + '$' + parts[0] + dec;
  }
  function fmtUsdInt(n) {
    if (n == null || isNaN(n)) return '—';
    var sign = n < 0 ? '-' : '';
    var s = Math.round(Math.abs(+n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + '$' + s;
  }
  function fmtPct(n) {
    if (n == null || isNaN(n)) return '—';
    var v = +n;
    if (v > 0 && v <= 1) v = v * 100;
    return (Math.round(v * 10) / 10) + '%';
  }
  function fmtNum(n) {
    if (n == null || isNaN(n)) return '—';
    return (+n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function fmtDate(s) { return s == null ? '—' : String(s); }
  function fmtDuration(s) {
    if (s == null || s === '') return '—';
    if (typeof s === 'string') return s;
    var sec = +s;
    var m = Math.floor(sec / 60);
    var r = sec % 60;
    return m + 'm ' + (r < 10 ? '0' : '') + r + 's';
  }
  function fmtBytes(n) {
    if (n == null || isNaN(n)) return '—';
    var v = +n;
    if (v < 1024) return v + ' B';
    if (v < 1024*1024) return (v/1024).toFixed(0) + ' KB';
    return (v/1024/1024).toFixed(1) + ' MB';
  }
  function fmtStr(s) { return s == null ? '—' : String(s); }

  function format(value, fmt) {
    switch ((fmt || '').toLowerCase()) {
      case 'usd':       return fmtUsd(value);
      case 'usdint':    return fmtUsdInt(value);
      case 'pct':       return fmtPct(value);
      case 'num':       return fmtNum(value);
      case 'date':      return fmtDate(value);
      case 'duration':  return fmtDuration(value);
      case 'bytes':     return fmtBytes(value);
      case '':          return fmtStr(value);
      default:          return fmtStr(value);
    }
  }

  function substitute(html, item) {
    return String(html).replace(/\{\{\s*([^}|\s]+)\s*(?:\|\s*([^}\s]+)\s*)?\}\}/g, function (_, key, fmt) {
      var v = get(item, key);
      var out = format(v, fmt);
      // Light HTML escape
      return String(out).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    });
  }

  function bindText(root, state) {
    var nodes = root.querySelectorAll('[data-bind-text]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var path = el.getAttribute('data-bind-text');
      var fmt  = el.getAttribute('data-fmt') || '';
      el.textContent = format(get(state, path), fmt);
    }
  }

  function bindLists(root, state) {
    var hosts = root.querySelectorAll('[data-bind]');
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i];
      var path = host.getAttribute('data-bind');
      var tpl  = host.querySelector(':scope > template');
      if (!tpl) continue;
      // Clear non-template children
      var kids = host.childNodes;
      for (var k = kids.length - 1; k >= 0; k--) {
        var n = kids[k];
        if (n.nodeType === 1 && n.tagName === 'TEMPLATE') continue;
        host.removeChild(n);
      }
      var raw = get(state, path);
      if (raw == null) continue;
      var arr = Array.isArray(raw) ? raw : [raw];
      for (var j = 0; j < arr.length; j++) {
        var html = substitute(tpl.innerHTML, arr[j]);
        var holder = document.createElement('div');
        holder.innerHTML = html;
        while (holder.firstChild) host.appendChild(holder.firstChild);
      }
    }
  }

  function bind(root, state) {
    bindText(root, state);
    bindLists(root, state);
    bindText(root, state); // re-bind for nodes injected from templates
  }

  window.S1 = window.S1 || {};
  window.S1.render = { bind: bind, get: get, format: format };
})();
