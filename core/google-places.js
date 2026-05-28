// Shared Google Places autocomplete helper.
// Calls the Google Places API (New) directly from the browser via fetch().
// No Google JavaScript is ever loaded into this page — predictions are
// rendered into a dropdown we own, built with createElement + textContent.
// Re-scans on the `s1ui:ready` DOM event and on the `state:replaced` bus
// event so dynamically rendered inputs get enhanced. Free typing still
// works — the dropdown just augments the existing input.
(function () {
  var API_KEY = 'AIzaSyDNM6zPeWggblR6lMWByyPXtZM8UkOfwXo';
  var AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';
  var DETAILS_URL = 'https://places.googleapis.com/v1/places/';
  var DEBOUNCE_MS = 250;
  var MIN_CHARS = 2;
  var MAX_PREDICTIONS = 5;

  injectStyleOnce();

  function injectStyleOnce() {
    try {
      if (document.querySelector('style[data-s1-places]')) return;
      var st = document.createElement('style');
      st.setAttribute('data-s1-places', '1');
      st.textContent = [
        '.s1-places-wrap{position:relative;}',
        '.s1-places-list{position:absolute;left:0;right:0;top:100%;background:#fff;',
        ' border:1px solid #d0d6de;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.08);',
        ' overflow:hidden;z-index:1000;margin-top:2px;list-style:none;padding:0;display:none;}',
        '.s1-places-list[data-open="1"]{display:block;}',
        '.s1-places-opt{padding:10px 14px;font-size:13px;border-bottom:1px solid #eef2f7;cursor:pointer;}',
        '.s1-places-opt:last-of-type{border-bottom:none;}',
        '.s1-places-opt[aria-selected="true"]{background:#fff5ec;}',
        '.s1-places-opt:hover{background:#f5f8fc;}',
        '.s1-places-attr{padding:6px 14px;font-size:11px;color:#6b7280;background:#fafbfc;',
        ' display:flex;justify-content:flex-end;align-items:center;gap:6px;border-top:1px solid #eef2f7;}'
      ].join('');
      document.head.appendChild(st);
    } catch (e) {
      try { console.error('[places] style inject failed:', e); } catch (_) {}
    }
  }

  function newSessionToken() {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
      }
      var b = new Uint8Array(16);
      window.crypto.getRandomValues(b);
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      var h = [];
      for (var i = 0; i < 16; i++) h.push((b[i] + 0x100).toString(16).slice(1));
      return h[0]+h[1]+h[2]+h[3] + '-' + h[4]+h[5] + '-' + h[6]+h[7] + '-' + h[8]+h[9] + '-' + h[10]+h[11]+h[12]+h[13]+h[14]+h[15];
    } catch (e) {
      return 's1-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    }
  }

  function closeAllOtherDropdowns(exceptState) {
    var lists = document.querySelectorAll('.s1-places-list[data-open="1"]');
    lists.forEach(function (l) {
      if (!exceptState || l !== exceptState.list) {
        l.setAttribute('data-open', '0');
        var inp = l.parentNode && l.parentNode.querySelector('input[data-places-autocomplete]');
        if (inp) inp.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function attachOne(el) {
    if (!el || el.__placesInit) return;
    if (el.tagName !== 'INPUT') return;
    el.__placesInit = true;

    var state = {
      el: el,
      token: newSessionToken(),
      debounceTimer: null,
      ctrl: null,
      predictions: [],
      highlight: -1,
      list: null
    };

    try {
      var wrap;
      if (el.parentNode && el.parentNode.classList && el.parentNode.classList.contains('s1-places-wrap')) {
        wrap = el.parentNode;
      } else {
        wrap = document.createElement('div');
        wrap.className = 's1-places-wrap';
        if (el.parentNode) {
          el.parentNode.insertBefore(wrap, el);
          wrap.appendChild(el);
        }
      }

      var list = document.createElement('ul');
      list.className = 's1-places-list';
      list.setAttribute('role', 'listbox');
      list.setAttribute('data-open', '0');
      var listId = 's1-places-list-' + Math.random().toString(36).slice(2, 9);
      list.id = listId;
      wrap.appendChild(list);
      state.list = list;

      el.setAttribute('role', 'combobox');
      el.setAttribute('aria-autocomplete', 'list');
      el.setAttribute('aria-expanded', 'false');
      el.setAttribute('aria-controls', listId);
      el.setAttribute('autocomplete', 'off');

      el.addEventListener('focus', function () {
        state.token = newSessionToken();
      });

      el.addEventListener('input', function () {
        if (state.debounceTimer) clearTimeout(state.debounceTimer);
        var v = el.value.trim();
        if (v.length < MIN_CHARS) {
          renderPredictions(state, []);
          return;
        }
        state.debounceTimer = setTimeout(function () {
          queryAutocomplete(v, state);
        }, DEBOUNCE_MS);
      });

      el.addEventListener('keydown', function (ev) {
        var open = list.getAttribute('data-open') === '1';
        if (ev.key === 'ArrowDown') {
          if (!open || !state.predictions.length) return;
          ev.preventDefault();
          state.highlight = (state.highlight + 1) % state.predictions.length;
          updateHighlight(state);
        } else if (ev.key === 'ArrowUp') {
          if (!open || !state.predictions.length) return;
          ev.preventDefault();
          state.highlight = (state.highlight - 1 + state.predictions.length) % state.predictions.length;
          updateHighlight(state);
        } else if (ev.key === 'Enter') {
          if (open && state.highlight >= 0 && state.predictions[state.highlight]) {
            ev.preventDefault();
            selectPrediction(state.predictions[state.highlight], state);
          }
        } else if (ev.key === 'Escape') {
          if (open) {
            ev.preventDefault();
            renderPredictions(state, []);
          }
        } else if (ev.key === 'Tab') {
          renderPredictions(state, []);
        }
      });

      el.addEventListener('blur', function () {
        setTimeout(function () {
          renderPredictions(state, []);
        }, 150);
      });
    } catch (e) {
      try { console.error('[places] attach failed:', e); } catch (_) {}
    }
  }

  function updateHighlight(state) {
    var opts = state.list.querySelectorAll('.s1-places-opt');
    opts.forEach(function (o, i) {
      if (i === state.highlight) {
        o.setAttribute('aria-selected', 'true');
        state.el.setAttribute('aria-activedescendant', o.id);
      } else {
        o.setAttribute('aria-selected', 'false');
      }
    });
  }

  function renderPredictions(state, predictions) {
    state.predictions = predictions || [];
    state.highlight = predictions && predictions.length ? 0 : -1;
    var list = state.list;
    list.textContent = '';
    if (!predictions || !predictions.length) {
      list.setAttribute('data-open', '0');
      state.el.setAttribute('aria-expanded', 'false');
      state.el.removeAttribute('aria-activedescendant');
      return;
    }
    closeAllOtherDropdowns(state);
    predictions.forEach(function (p, i) {
      var li = document.createElement('li');
      li.className = 's1-places-opt';
      li.setAttribute('role', 'option');
      li.id = list.id + '-opt-' + i;
      li.setAttribute('data-place-id', p.placeId || '');
      li.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      li.textContent = p.text || '';
      li.addEventListener('mousedown', function (ev) {
        ev.preventDefault();
        selectPrediction(p, state);
      });
      list.appendChild(li);
    });
    var attr = document.createElement('li');
    attr.className = 's1-places-attr';
    attr.setAttribute('aria-hidden', 'true');
    attr.textContent = 'powered by Google';
    list.appendChild(attr);
    list.setAttribute('data-open', '1');
    state.el.setAttribute('aria-expanded', 'true');
    if (predictions[0]) {
      state.el.setAttribute('aria-activedescendant', list.id + '-opt-0');
    }
  }

  function queryAutocomplete(input, state) {
    if (state.ctrl) { try { state.ctrl.abort(); } catch (_) {} }
    state.ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var body = {
      input: input,
      sessionToken: state.token,
      includedPrimaryTypes: ['street_address', 'route', 'premise', 'subpremise', 'postal_code'],
      languageCode: (navigator && navigator.language) || 'en'
    };
    fetch(AUTOCOMPLETE_URL, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      signal: state.ctrl ? state.ctrl.signal : undefined,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text'
      },
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (j) {
      var suggestions = (j && j.suggestions) || [];
      var preds = [];
      for (var i = 0; i < suggestions.length && preds.length < MAX_PREDICTIONS; i++) {
        var pp = suggestions[i] && suggestions[i].placePrediction;
        if (!pp) continue;
        preds.push({
          placeId: pp.placeId,
          text: (pp.text && pp.text.text) || ''
        });
      }
      renderPredictions(state, preds);
    }).catch(function (e) {
      if (e && e.name === 'AbortError') return;
      try { console.error('[places] autocomplete failed:', e); } catch (_) {}
      renderPredictions(state, []);
    });
  }

  function selectPrediction(p, state) {
    var fallback = p.text || state.el.value;
    var url = DETAILS_URL + encodeURIComponent(p.placeId) +
      '?sessionToken=' + encodeURIComponent(state.token);
    fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'formattedAddress,displayName,addressComponents,location'
      }
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (j) {
      var addr = (j && j.formattedAddress) || (j && j.displayName && j.displayName.text) || fallback;
      state.el.__placesDetails = j || null;
      state.el.__placesParts = parseComponents(j && j.addressComponents);
      finalizeSelection(state, addr);
    }).catch(function (e) {
      try { console.error('[places] details failed:', e); } catch (_) {}
      finalizeSelection(state, fallback);
    });
  }

  function finalizeSelection(state, addr) {
    state.el.value = addr;
    try {
      state.el.dispatchEvent(new Event('input', { bubbles: true }));
      state.el.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (e) { /* old browsers — Event ctor may not exist */ }
    try { populateSiblings(state.el, state.el.__placesParts); } catch (_) {}
    renderPredictions(state, []);
    state.token = newSessionToken();
  }

  function parseComponents(comps) {
    var out = { streetNumber:'', route:'', city:'', provinceState:'', postalZip:'', country:'', unitSuite:'' };
    if (!Array.isArray(comps)) return out;
    comps.forEach(function (c) {
      var t = c.types || [];
      var L = c.longText  || c.long_name  || '';
      var S = c.shortText || c.short_name || '';
      if      (t.indexOf('subpremise') >= 0)                    out.unitSuite     = L;
      else if (t.indexOf('street_number') >= 0)                 out.streetNumber  = L;
      else if (t.indexOf('route') >= 0)                         out.route         = L;
      else if (t.indexOf('locality') >= 0)                      out.city          = L;
      else if (t.indexOf('postal_town') >= 0 && !out.city)      out.city          = L;
      else if (t.indexOf('administrative_area_level_1') >= 0)   out.provinceState = S || L;
      else if (t.indexOf('postal_code') >= 0)                   out.postalZip     = L;
      else if (t.indexOf('country') >= 0)                       out.country       = S || L;
    });
    return out;
  }

  function populateSiblings(el, parts) {
    if (!parts) return;
    var scope = (el.closest && el.closest('.jd-overlay, .s1-overlay, form')) || document;
    ['city', 'provinceState', 'postalZip', 'country', 'unitSuite'].forEach(function (k) {
      var tgt = scope.querySelector('input[name="' + k + '"], select[name="' + k + '"]');
      if (tgt && !tgt.value) {
        tgt.value = parts[k] || '';
        try {
          tgt.dispatchEvent(new Event('input',  { bubbles: true }));
          tgt.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (_) {}
      }
    });
  }

  function attachAll() {
    try {
      var els = document.querySelectorAll('input[data-places-autocomplete]');
      els.forEach(attachOne);
    } catch (e) {
      try { console.error('[places] attachAll failed:', e); } catch (_) {}
    }
  }

  document.addEventListener('mousedown', function (ev) {
    var lists = document.querySelectorAll('.s1-places-list[data-open="1"]');
    lists.forEach(function (l) {
      if (!l.contains(ev.target)) {
        var wrap = l.parentNode;
        if (wrap && !wrap.contains(ev.target)) {
          l.setAttribute('data-open', '0');
          var inp = wrap.querySelector('input[data-places-autocomplete]');
          if (inp) inp.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }, true);

  window.S1 = window.S1 || {};
  window.S1.placesAutocomplete = { attachAll: attachAll, attachOne: attachOne };

  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachAll);
    } else {
      attachAll();
    }
    document.addEventListener('s1ui:ready', attachAll);
    if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
      window.S1.bus.on('state:replaced', attachAll);
    }
  } catch (e) {
    try { console.error('[places] init failed:', e); } catch (_) {}
  }
})();
