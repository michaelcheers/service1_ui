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
    // "." resolves to the object itself — used in array repeats over
    // primitive items, e.g. {{.}} inside <template> for a string array.
    if (path === '.') return obj;
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

  // Escape text so it's safe to interpolate into an HTML string. ALWAYS on
  // for plain placeholders — there is no opt-out, because untrusted values
  // must not reach innerHTML/insertAdjacentHTML as parsed HTML.
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  // For placeholders that hold HTML markup (host-published, e.g. row cell
  // markup with <input>/<b>/<span class>), render them inside a sandboxed
  // <iframe srcdoc> — same pattern as business_card's Dashboard.BuildCardSrcdoc
  // and Reports/Custom.cshtml.cs. The iframe is inert (sandbox=""), so even if
  // the data contained <script> or onclick=, it cannot execute or escape into
  // the host page.
  function buildHtmlSrcdocIframe(html) {
    var srcdoc = '<!DOCTYPE html><html><head><meta charset="utf-8">'
      + '<style>html,body{margin:0;padding:0;background:transparent;color:inherit;}body{font:13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}*{box-sizing:border-box;}</style>'
      + '</head><body>' + String(html) + '</body></html>';
    // sandbox="allow-same-origin" gives the iframe its own origin (so the
    // parent can read contentDocument to size it) but withholds allow-scripts
    // / allow-forms / allow-top-navigation / allow-popups — so injected
    // <script>, on*=, <form>, javascript:, window.* are all inert. We
    // intentionally omit an inner CSP because this iframe is hosted on
    // ui.service1.app (gh-pages static origin, no privileges, no cookies),
    // so the residual passive-resource / cell-scoped-phishing surface is
    // not exploitable into anything that matters. State-changing endpoints
    // are POST + CSRF-token elsewhere, so meta-refresh / anchor nav can't
    // turn into account compromise either.
    var srcdocAttr = escHtml(srcdoc);
    return '<iframe sandbox="allow-same-origin" frameborder="0" scrolling="no" class="s1-html-frame" '
      + 'style="width:100%;height:auto;min-height:1.4em;border:0;display:block;background:transparent;" '
      + 'onload="try{this.style.height=(this.contentDocument.documentElement.scrollHeight)+\'px\'}catch(e){}" '
      + 'srcdoc="' + srcdocAttr + '"></iframe>';
  }

  function substitute(html, item) {
    return String(html).replace(/\{\{\s*([^}|\s]+)\s*(?:\|\s*([^}\s]+)\s*)?\}\}/g, function (_, key, fmt) {
      var v = get(item, key);
      var f = (fmt || '').toLowerCase();
      // |html modifier — value is HTML markup published by the host. Render
      // inside a sandboxed iframe srcdoc so script/style/layout in the value
      // cannot affect the host page. Same trust model as business_card's
      // Dashboard custom-card and Reports/Custom srcdoc pipeline.
      if (f === 'html') return buildHtmlSrcdocIframe(String(v == null ? '' : v));
      var out = format(v, fmt);
      // Plain placeholders always HTML-escape — never interpolate raw HTML
      // from data into innerHTML/insertAdjacentHTML.
      return escHtml(out);
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

  // data-bind-html — render an HTML string from state inside a sandboxed
  // <iframe srcdoc> so the markup parses as HTML without leaking script,
  // style, or layout into the host page. Mirrors the BuildCardSrcdoc /
  // Reports/Custom.cshtml.cs pattern in business_card: doctype + minimal
  // <style> reset + the data payload, served via srcdoc, with sandbox=""
  // (no allow-scripts, no allow-same-origin) so it's strictly inert.
  function bindHtml(root, state) {
    var nodes = root.querySelectorAll('[data-bind-html]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var path = el.getAttribute('data-bind-html');
      var v = get(state, path);
      if (v == null) v = '';
      var srcdoc = '<!DOCTYPE html><html><head><meta charset="utf-8">'
        + '<base target="_parent">'
        + '<style>body{margin:0;padding:0;font:13px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:inherit;background:transparent;}*{box-sizing:border-box;}</style>'
        + '</head><body>' + String(v) + '</body></html>';
      // Re-use an existing iframe if present so we don't churn DOM nodes
      // between state pushes.
      var ifr = el.querySelector(':scope > iframe.s1-html-frame');
      if (!ifr) {
        // Clear and create a fresh sandboxed iframe.
        while (el.firstChild) el.removeChild(el.firstChild);
        ifr = document.createElement('iframe');
        ifr.className = 's1-html-frame';
        ifr.setAttribute('sandbox', '');
        ifr.setAttribute('frameborder', '0');
        ifr.setAttribute('scrolling', 'no');
        ifr.style.cssText = 'width:100%;height:100%;border:0;display:block;background:transparent;';
        el.appendChild(ifr);
      }
      // srcdoc setter triggers the parse; sandbox="" keeps it inert.
      ifr.setAttribute('srcdoc', srcdoc);
    }
  }

  // Walk a cloned <template>.content fragment and substitute {{path}} /
  // {{path|fmt}} placeholders in text nodes and attribute values, using
  // real DOM mutations (textContent / setAttribute) instead of any HTML
  // sink. <template>.content was parsed by the HTML parser at page load,
  // so it's a live DocumentFragment we can clone safely.
  var PLACEHOLDER = /\{\{\s*([^}|\s]+)\s*(?:\|\s*([^}\s]+)\s*)?\}\}/g;
  function applyTemplate(frag, item) {
    var walker = document.createTreeWalker(frag, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null);
    var node = walker.nextNode();
    while (node) {
      if (node.nodeType === 3) {
        var t = node.nodeValue;
        if (t && t.indexOf('{{') !== -1) {
          node.nodeValue = t.replace(PLACEHOLDER, function (_, key, fmt) {
            return format(get(item, key), fmt);
          });
        }
      } else if (node.nodeType === 1) {
        var attrs = node.attributes;
        for (var a = 0; a < attrs.length; a++) {
          var av = attrs[a].value;
          if (av && av.indexOf('{{') !== -1) {
            node.setAttribute(attrs[a].name, av.replace(PLACEHOLDER, function (_, key, fmt) {
              return format(get(item, key), fmt);
            }));
          }
        }
      }
      node = walker.nextNode();
    }
    return frag;
  }

  function renderOneHost(host, scope) {
    var path = host.getAttribute('data-bind');
    var tpl  = host.querySelector(':scope > template');
    if (!tpl) return;
    var kids = host.childNodes;
    for (var k = kids.length - 1; k >= 0; k--) {
      var n = kids[k];
      if (n.nodeType === 1 && n.tagName === 'TEMPLATE') continue;
      host.removeChild(n);
    }
    var raw = get(scope, path);
    if (raw == null) return;
    var arr = Array.isArray(raw) ? raw : [raw];
    for (var j = 0; j < arr.length; j++) {
      var frag = tpl.content.cloneNode(true);
      applyTemplate(frag, arr[j]);
      // Recurse: any nested data-bind hosts in this clone bind against
      // the current item (so daySections[i].items resolves correctly).
      var nested = frag.querySelectorAll ? frag.querySelectorAll('[data-bind]') : [];
      var nestedHosts = [];
      for (var ni = 0; ni < nested.length; ni++) {
        var nh = nested[ni];
        // Only top-level nested hosts — children of nested hosts get handled
        // by their own ancestor pass.
        var p = nh.parentNode;
        var isTop = true;
        while (p && p !== frag) {
          if (p.nodeType === 1 && p.hasAttribute && p.hasAttribute('data-bind')) { isTop = false; break; }
          p = p.parentNode;
        }
        if (isTop) nestedHosts.push(nh);
      }
      host.appendChild(frag);
      for (var nh2 = 0; nh2 < nestedHosts.length; nh2++) {
        renderOneHost(nestedHosts[nh2], arr[j]);
      }
    }
  }

  function bindLists(root, state) {
    // Only process top-level [data-bind] hosts at the root scope. Nested
    // hosts are processed recursively by renderOneHost against their
    // enclosing item.
    var hosts = root.querySelectorAll('[data-bind]');
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i];
      // Skip if this host is inside another [data-bind] host (it'll be
      // handled when its ancestor renders).
      var anc = host.parentNode;
      var nestedInside = false;
      while (anc && anc !== root) {
        if (anc.nodeType === 1 && anc.hasAttribute && anc.hasAttribute('data-bind')) { nestedInside = true; break; }
        anc = anc.parentNode;
      }
      if (nestedInside) continue;
      renderOneHost(host, state);
    }
  }

  function bindValues(root, state) {
    var nodes = root.querySelectorAll('[data-bind-value]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var path = el.getAttribute('data-bind-value');
      var fmt  = el.getAttribute('data-fmt') || '';
      var v = format(get(state, path), fmt);
      if ('value' in el) el.value = (v === '—' ? '' : v);
    }
  }

  function bindAttrs(root, state) {
    var nodes = root.querySelectorAll('[data-bind-attr]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var spec = el.getAttribute('data-bind-attr');
      // Format: "attr:path[;attr2:path2]"
      var pairs = spec.split(';');
      for (var p = 0; p < pairs.length; p++) {
        var bits = pairs[p].split(':');
        if (bits.length < 2) continue;
        var attr = bits[0].trim();
        var path = bits.slice(1).join(':').trim();
        var v = get(state, path);
        if (v == null) continue;
        el.setAttribute(attr, String(v));
      }
    }
  }

  function bindOptions(root, state) {
    var nodes = root.querySelectorAll('[data-bind-options]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var path = el.getAttribute('data-bind-options');
      var arr = get(state, path);
      if (!Array.isArray(arr)) continue;
      var keep = [];
      for (var k = 0; k < el.children.length; k++) {
        var c = el.children[k];
        if (c.tagName === 'OPTION' && c.value === '') keep.push(c);
      }
      while (el.firstChild) el.removeChild(el.firstChild);
      for (var kk = 0; kk < keep.length; kk++) el.appendChild(keep[kk]);
      for (var j = 0; j < arr.length; j++) {
        var opt = document.createElement('option');
        var item = arr[j];
        if (item && typeof item === 'object') {
          opt.value = item.value != null ? item.value : (item.label || '');
          opt.textContent = item.label != null ? item.label : String(opt.value);
        } else {
          opt.value = String(item);
          opt.textContent = String(item);
        }
        el.appendChild(opt);
      }
    }
  }

  function bindEmpty(root, state) {
    var ifNodes = root.querySelectorAll('[data-empty-if]');
    for (var i = 0; i < ifNodes.length; i++) {
      var el = ifNodes[i];
      var v = get(state, el.getAttribute('data-empty-if'));
      var blank = (v == null || String(v).trim() === '');
      el.style.display = blank ? 'none' : '';
    }
    var unlessNodes = root.querySelectorAll('[data-empty-unless]');
    for (var j = 0; j < unlessNodes.length; j++) {
      var ue = unlessNodes[j];
      var uv = get(state, ue.getAttribute('data-empty-unless'));
      var ublank = (uv == null || String(uv).trim() === '');
      ue.style.display = ublank ? '' : 'none';
    }
  }

  function bind(root, state) {
    bindText(root, state);
    bindLists(root, state);
    bindText(root, state); // re-bind for nodes injected from templates
    bindOptions(root, state);  // options must exist before values are assigned (Bug 1400/#3)
    bindValues(root, state);
    bindAttrs(root, state);
    bindEmpty(root, state);
    bindHtml(root, state);
    bindHtml(root, state); // re-bind for nodes injected by bindLists
  }

  // Collect a payload object from the comm-firing element's surrounding
  // form scope. Used by every module's document-level click dispatcher so
  // a click on e.g. <button data-comm-action="action:jobDetail.send:">
  // carries the composer textarea's content + any other inputs in the
  // closest [data-comm-scope] / <form> / section.card, plus the row id
  // when the button sits inside a [data-record-id]="…" container.
  function slugify(s) {
    return String(s || '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
  }
  function collectPayload(trigger) {
    if (trigger && trigger.dataset && trigger.dataset.payload) {
      try { return JSON.parse(trigger.dataset.payload); } catch { /* fall through */ }
    }
    var payload = {};
    if (!trigger) return payload;
    // Find the nearest ancestor that carries an id (data-record-id or any
    // data-*-id). Row/card-level action buttons should ONLY carry that row's
    // id — never the whole page.
    var idEl = trigger;
    var idAncestor = null;
    while (idEl) {
      if (idEl.attributes) {
        for (var ai = 0; ai < idEl.attributes.length; ai++) {
          var a = idEl.attributes[ai];
          if (a.name === 'data-record-id' || /^data-[a-z0-9_-]+-id$/.test(a.name)) {
            payload.id = a.value;
            idAncestor = idEl;
            idEl = null;
            break;
          }
        }
      }
      if (idEl) idEl = idEl.parentElement;
    }
    // Scope cascade:
    //   explicit data-comm-scope  → that container
    //   form                      → that form
    //   row/card with data-*-id   → JUST that row (don't bleed into siblings)
    //   section.card / section    → that section
    //   nothing else              → no scope: emit just {id} (if any). Do NOT
    //                               fall back to `document` — that scrapes
    //                               every input on the page into the payload,
    //                               which was the bug.
    // Tighter cascade: only explicit form-like scopes. section.card / section
    // were too broad — a standalone action button (e.g. 'Recompute crew wages')
    // sitting near a table would scrape every input in the table into its
    // payload. data-comm-scope / form are explicit declarations. id-ancestor
    // is row-action context (already narrow). For anything else, return just
    // {id} (if any) and stop.
    var scope = trigger.closest('[data-comm-scope]') ||
                trigger.closest('form') ||
                idAncestor;
    if (!scope) return payload;
    var fields = scope.querySelectorAll('input, textarea, select');
    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      if (el.type === 'button' || el.type === 'submit' || el.type === 'reset') continue;
      var key = el.getAttribute('name') ||
                el.getAttribute('data-comm-field') ||
                el.getAttribute('id') ||
                slugify(el.getAttribute('placeholder') || el.getAttribute('aria-label') || el.type || 'field');
      if (!key || key in payload) continue;
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (el.type === 'radio' && !el.checked) continue;
        payload[key] = !!el.checked;
      } else {
        payload[key] = el.value;
      }
    }
    var extras = scope.querySelectorAll('[data-comm-include]');
    for (var j = 0; j < extras.length; j++) {
      var ex = extras[j];
      payload[ex.getAttribute('data-comm-include')] = ex.textContent.trim();
    }
    return payload;
  }

  window.S1 = window.S1 || {};
  window.S1.render = { bind: bind, get: get, format: format };
  window.S1.collectPayload = collectPayload;
})();
