// Shared interaction wiring for the "standard" service1_ui module shell:
//
//   header:   .range-picker, .btn-secondary (Export / Filters / …),
//             .btn-primary (+ New X)
//   nav:      .subtabs > .subtab
//   chips:    .fchip / .filter-chip
//   search:   input.search-input (debounced)
//   segment:  .seg > button (Grid/List, Newest/etc)
//   cards:    grid anchor cards inside [data-bind="…"] containers
//
// Each interaction fires a real comm op (save/action) on the module's
// resource namespace so the backend OnPostS1RpcAsync handlers see them
// and the lab pane logs them. Per-module .module.js can supply
// `overrides.onPrimary`, `overrides.onCardOpen(card, id)` etc. to swap in
// a more specific behavior (e.g. open a real file picker for upload).
(function () {
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function flash(t) {
    const e = document.createElement('div');
    e.textContent = t;
    e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;box-shadow:0 4px 14px rgba(0,0,0,0.18);';
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 2000);
  }
  async function safe(label, fn) {
    try { return await fn(); }
    catch (e) { flash((label || 'Action') + ' failed: ' + (e && e.message || e)); throw e; }
  }

  function wire(moduleName, overrides) {
    overrides = overrides || {};
    const comm = window.S1.comm;
    const ns = moduleName + '.';

    // ─ subtabs: visual toggle only. Tab selection is pure UI state and
    // doesn't need a server round-trip per click. Modules that genuinely
    // need the host to know the active tab can wire it via overrides.onTab.
    $$('.subtabs .subtab').forEach(b => {
      b.addEventListener('click', (ev) => {
        ev.preventDefault();
        $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
        const tab = (b.textContent || '').replace(/\d+/g, '').trim().toLowerCase();
        if (overrides.onTab) overrides.onTab(tab, b);
      });
    });

    // ─ segmented buttons (.seg / .chart-tools): pure UI sort/view toggle.
    $$('.seg, .chart-tools').forEach(group => {
      $$(':scope > button', group).forEach(b => {
        b.addEventListener('click', () => {
          $$(':scope > button', group).forEach(x => x.classList.toggle('active', x === b));
          const value = (b.textContent || '').trim();
          if (overrides.onSeg) overrides.onSeg(value, b, group);
        });
      });
    });

    // ─ filter chips: visual toggle only.
    $$('.fchip, .filter-chip').forEach(b => {
      b.addEventListener('click', (ev) => {
        if (b.__s1Wired) return;
        ev.preventDefault();
        const peer = b.parentElement;
        if (peer) $$('.fchip, .filter-chip', peer).forEach(x => x.classList.toggle('active', x === b));
        const label = (b.textContent || '').replace(/\d+/g, '').trim().toLowerCase();
        if (overrides.onChip) overrides.onChip(label, b);
      });
    });

    // ─ search input: debounced, client-side. No server save — modules that
    // actually need server-side search can wire overrides.onSearch.
    $$('input.search-input').forEach(inp => {
      let timer = null;
      inp.addEventListener('input', () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          if (overrides.onSearch) overrides.onSearch(inp.value, inp);
        }, 300);
      });
    });

    // ─ Primary buttons. We classify by label text rather than blindly
    // treating every .btn-primary as "+ New X" (that was the cause of
    // "Save changes" being prompted with a "name:" dialog).
    //
    //   "+ <noun>"  → create-new flow:  comm.action(<ns>.new, {kind, name})
    //   "Save…"     → form save flow:   comm.save(<ns>.<scope-key>, payload)
    //                                   where payload comes from the
    //                                   enclosing [data-comm-scope]/form/
    //                                   section.card inputs.
    //   everything else → comm.action(<ns>.<slug>, payload)
    $$('.btn-primary, .btn.btn-primary').forEach(b => {
      // Modal Save buttons are owned by S1.modal.bindForm — its handler
      // already collects the modal's named inputs and fires the right RPC
      // with a real payload. Don't double-fire here with an empty/wrong
      // payload (this was the source of the duplicate "create({})" call).
      if (b.hasAttribute('data-modal-save')) return;
      // Buttons with an explicit [data-comm-action] are already wired by the
      // document-level dispatcher. Skip so we don't double-fire (slugged label
      // RPC + explicit-attr RPC).
      if (b.hasAttribute('data-comm-action')) return;
      if (b.closest('[data-modal-save]') !== b && b.closest('.s1-overlay, .tm-overlay, .fm-overlay, .jd-overlay, .tk-overlay, .cp-overlay, .fc-overlay, .st-overlay, .rf-overlay, .cu-overlay, .cd-overlay, .ph-overlay, .ms-overlay, .qc-overlay, .po-overlay, .sf-overlay, .vd-overlay, .sd-overlay, .sc-overlay, .rp-overlay, .jc-overlay, .db-overlay, .do-overlay, .in-overlay, .gm-overlay, .ep-overlay, .fm-modal, .tm-modal, .ep-modal')) return;
      b.addEventListener('click', async (ev) => {
        ev.preventDefault();
        if (overrides.onPrimary && (await overrides.onPrimary(b, ev))) return;
        const raw = (b.textContent || '').trim();
        const slug = raw.toLowerCase().replace(/^[+\s]+/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        // 1) Create-new
        if (/^\+/.test(raw)) {
          const noun = raw.replace(/^\+\s*/, '').replace(/^new\s+/i, '').trim();
          flash('Add ' + noun + ' via the ' + noun + ' modal');
          return;
        }

        // 2) Save form (Save / Save changes / Update / Apply)
        if (/^(save|update|apply)\b/i.test(raw)) {
          const payload = (window.S1.collectPayload || (() => ({})))(b);
          // resource: nearest [data-comm-scope] attr if present, else "form"
          const scope = b.closest('[data-comm-scope]');
          const slot = scope ? scope.getAttribute('data-comm-scope') : 'form';
          await safe(raw, async () => {
            await comm.save(ns + slot, payload);
            flash(raw + ' saved');
          });
          return;
        }

        // 3) Generic action — use slug of button text + form payload.
        const payload = (window.S1.collectPayload || (() => ({})))(b);
        await safe(raw, async () => {
          await comm.action(ns + slug, payload);
          flash(raw);
        });
      });
    });

    // ─ secondary header buttons (Export / Filters / Categories / …)
    $$('.page-actions .btn-secondary').forEach(b => {
      // Explicit [data-comm-action] buttons are owned by the dispatcher.
      if (b.hasAttribute('data-comm-action')) return;
      b.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const label = (b.textContent || '').trim();
        if (overrides.onSecondary && (await overrides.onSecondary(label, b, ev))) return;
        if (/export/i.test(label)) {
          const r = await safe('Export', () => comm.action(ns + 'export', {}));
          if (r && r.downloadUrl) window.location.href = r.downloadUrl;
          return;
        }
        try { await comm.action(ns + 'header-' + label.toLowerCase().replace(/\s+/g, '-'), {}); } catch {}
      });
    });

    // ─ card grid items (anchors inside [data-bind] containers)
    document.addEventListener('click', async (ev) => {
      const card = ev.target.closest('[data-bind] > a, [data-bind] a[href="#"]');
      if (!card) return;
      ev.preventDefault();
      const row = card.closest('[data-record-id]') || card;
      const id  = row.getAttribute && row.getAttribute('data-record-id');
      if (overrides.onCardOpen) { await overrides.onCardOpen(card, id, ev); return; }
      try { await comm.action(ns + 'open', { id }); } catch {}
    });

    // ─ AI fab
    $$('.ai-fab').forEach(b => {
      b.addEventListener('click', (ev) => {
        ev.preventDefault();
        flash('AI assistant coming soon');
      });
    });

    // ─ generic fallback for any [data-comm-action] not handled above
    document.addEventListener('click', (ev) => {
      const t = ev.target.closest('[data-comm-action]'); if (!t) return;
      if (t.__s1Wired) return;
      const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
      const payload = (window.S1.collectPayload || (() => ({})))(t);
      if (kind === 'save') comm.save(resource, payload);
      else if (kind === 'delete') comm.delete(resource, id);
      else if (kind === 'action') comm.action(resource, payload);
    });

    // ─ generic tab/panel switcher.
    // Clicking [data-tab="X"] adds .active to it, removes it from its sibling
    // tabs, then shows [data-panel="X"] and hides all other [data-panel] in
    // the same scope. Same for data-ptab/data-ppanel pair (used by phoneSystem)
    // and data-stab/data-spanel etc. Wired once, document-level, idempotent.
    function findScopeRoot(tab, panelAttr) {
      // Walk up until we find an ancestor that contains at least one matching
      // [data-panel] element. If none found, document is the scope.
      let cur = tab.parentElement;
      while (cur) {
        if (cur.querySelector('[' + panelAttr + ']')) return cur;
        cur = cur.parentElement;
      }
      return document;
    }
    function activatePanel(tab, tabAttr, panelAttr) {
      const value = tab.getAttribute(tabAttr);
      // Siblings under the same tab bar — peer tabs lose .active.
      const peers = tab.parentElement ? tab.parentElement.querySelectorAll(':scope > [' + tabAttr + ']') : [tab];
      peers.forEach(x => x.classList.toggle('active', x === tab));
      const scope = findScopeRoot(tab, panelAttr);
      const panels = scope.querySelectorAll('[' + panelAttr + ']');
      panels.forEach(p => {
        const match = p.getAttribute(panelAttr) === value;
        // Use the inline style hide pattern the redesign already uses.
        p.style.display = match ? '' : 'none';
        p.classList.toggle('active', match);
      });
    }
    document.addEventListener('click', (ev) => {
      // Generic tab/panel toggler. For ANY attribute of the form data-XYZtab
      // on the clicked element, find the matching data-XYZpanel siblings/
      // descendants and switch which one is visible. Handles data-tab/data-panel,
      // data-ptab/data-ppanel (phoneSystem), data-eptab/data-eppanel
      // (crewProcesses), data-stab/data-spanel, etc.
      const el = ev.target.closest('*');
      if (!el || !el.attributes) return;
      for (let i = 0; i < el.attributes.length; i++) {
        const a = el.attributes[i];
        const m = /^data-([a-z]*)tab$/.exec(a.name);
        if (!m) continue;
        const prefix = m[1]; // '' or 'p' or 'ep' or 's' etc.
        const panelAttr = 'data-' + prefix + 'panel';
        const scope = findScopeRoot(el, panelAttr);
        if (!scope || !scope.querySelector || !scope.querySelector('[' + panelAttr + '="' + a.value + '"]')) continue;
        activatePanel(el, a.name, panelAttr);
      }
    });
  }

  // ─ Inject shared modal CSS (overlay backdrop + card) used by all v12 modals.
  (function injectModalCss() {
    if (document.getElementById('s1ui-modal-css')) return;
    var s = document.createElement('style');
    s.id = 's1ui-modal-css';
    s.textContent = [
      '.s1-overlay,.tm-overlay,.fm-overlay,.jd-overlay,.tk-overlay,.gm-overlay,.fc-overlay,.cp-overlay,.st-overlay,.rf-overlay,.cu-overlay,.cd-overlay,.sl-overlay,.ph-overlay,.ms-overlay,.qc-overlay,.po-overlay,.sf-overlay,.vd-overlay,.sd-overlay,.sc-overlay,.rp-overlay,.jc-overlay,.db-overlay,.do-overlay,.in-overlay{',
      '  position:fixed;inset:0;background:rgba(15,23,42,.45);display:none;align-items:flex-start;justify-content:center;padding:48px 24px;z-index:9000;overflow:auto;}',
      '.s1-overlay.open,.tm-overlay.open,.fm-overlay.open,.jd-overlay.open,.tk-overlay.open,.gm-overlay.open,.fc-overlay.open,.cp-overlay.open,.st-overlay.open,.rf-overlay.open,.cu-overlay.open,.cd-overlay.open,.sl-overlay.open,.ph-overlay.open,.ms-overlay.open,.qc-overlay.open,.po-overlay.open,.sf-overlay.open,.vd-overlay.open,.sd-overlay.open,.sc-overlay.open,.rp-overlay.open,.jc-overlay.open,.db-overlay.open,.do-overlay.open,.in-overlay.open{display:flex;}',
      '.s1-modal{background:#fff;border-radius:12px;width:100%;max-width:580px;padding:20px 22px;box-shadow:0 24px 60px -16px rgba(15,23,42,.4);font-family:Inter,system-ui,sans-serif;color:#0f172a;}',
      '.s1-modal.lg{max-width:780px;}',
      '.s1-modal .s1-mhead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;}',
      '.s1-modal .s1-mhead h4{margin:0;font-size:16px;font-weight:700;}',
      '.s1-modal .s1-mhead .s1-mkicker{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:600;}',
      '.s1-modal .s1-x{border:0;background:transparent;font-size:20px;color:#94a3b8;cursor:pointer;line-height:1;}',
      '.s1-modal .s1-mgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;}',
      '.s1-modal .s1-mgrid .full{grid-column:1/-1;}',
      '.s1-modal .s1-mlabel{display:block;font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;}',
      '.s1-modal .s1-input,.s1-modal .s1-select,.s1-modal .s1-textarea{width:100%;height:34px;padding:0 10px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;box-sizing:border-box;font-family:inherit;color:inherit;}',
      '.s1-modal .s1-textarea{height:72px;padding:8px 10px;resize:vertical;}',
      '.s1-modal .s1-mfoot{display:flex;justify-content:flex-end;gap:8px;border-top:1px solid #e5e7eb;padding-top:12px;margin-top:14px;}',
      '.s1-modal .s1-btn{height:34px;padding:0 14px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid transparent;cursor:pointer;font-family:inherit;}',
      '.s1-modal .s1-btn.sec{background:#fff;border-color:#d1d5db;color:#0f172a;}',
      '.s1-modal .s1-btn.pri{background:#0f172a;color:#fff;}',
      '.s1-modal .s1-btn.dan{background:#dc2626;color:#fff;}',
      '.s1-modal .s1-row-add{font-size:12px;color:#0f172a;background:#f1f5f9;border:1px dashed #cbd5e1;border-radius:6px;padding:6px 10px;cursor:pointer;margin-top:6px;}'
    ].join('\n');
    document.head.appendChild(s);
  })();

  // ─ Shared modal helper. v12 modals overlay the iframe page; this opens /
  // closes them, wires X / backdrop / ESC, and collects form values on Save.
  function modalOpen(sel) {
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return null;
    el.classList.add('open');
    el.style.display = '';
    el.removeAttribute('hidden');
    // ESC close
    var onKey = function (e) { if (e.key === 'Escape') { modalClose(el); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
    el.__s1OnKey = onKey;
    // Backdrop click
    if (!el.__s1Backdrop) {
      el.__s1Backdrop = true;
      el.addEventListener('click', function (ev) { if (ev.target === el) modalClose(el); });
      // X buttons
      var xs = el.querySelectorAll('[data-modal-close], .x, .modal-close, .tm-close, .fm-close, .jd-close, .tk-close');
      for (var i = 0; i < xs.length; i++) xs[i].addEventListener('click', function () { modalClose(el); });
    }
    return el;
  }
  function modalClose(sel) {
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return;
    el.classList.remove('open');
    if (el.__s1OnKey) { document.removeEventListener('keydown', el.__s1OnKey); el.__s1OnKey = null; }
  }
  function modalCollect(el) {
    var out = {};
    if (!el) return out;
    var inputs = el.querySelectorAll('input[name], select[name], textarea[name]');
    for (var i = 0; i < inputs.length; i++) {
      var inp = inputs[i];
      var n = inp.getAttribute('name');
      if (!n) continue;
      if (inp.type === 'checkbox') { out[n] = inp.checked; continue; }
      if (inp.type === 'radio') { if (inp.checked) out[n] = inp.value; continue; }
      out[n] = inp.value;
    }
    // multi-row blocks: [data-row-group="key"] with rows each containing named fields → array
    var groups = el.querySelectorAll('[data-row-group]');
    for (var g = 0; g < groups.length; g++) {
      var groupEl = groups[g];
      var key = groupEl.getAttribute('data-row-group');
      var rows = groupEl.querySelectorAll('[data-row]');
      var arr = [];
      for (var r = 0; r < rows.length; r++) {
        var row = {};
        var rinp = rows[r].querySelectorAll('input[name], select[name], textarea[name]');
        for (var ri = 0; ri < rinp.length; ri++) {
          var rn = rinp[ri].getAttribute('name');
          if (!rn) continue;
          if (rinp[ri].type === 'checkbox') { row[rn] = rinp[ri].checked; continue; }
          row[rn] = rinp[ri].value;
        }
        arr.push(row);
      }
      out[key] = arr;
    }
    // Places autocomplete fallback: any input inside the modal carrying
    // __placesParts contributes structured-address keys for slots the form
    // didn't render (or that the user left empty).
    try {
      var partsKeys = ['city', 'provinceState', 'postalZip', 'country', 'unitSuite'];
      var withParts = el.querySelectorAll('input[data-places-autocomplete]');
      for (var p = 0; p < withParts.length; p++) {
        var parts = withParts[p].__placesParts;
        if (!parts) continue;
        for (var k = 0; k < partsKeys.length; k++) {
          var key = partsKeys[k];
          if (parts[key] && !out[key]) out[key] = parts[key];
        }
      }
    } catch (_) {}
    return out;
  }
  function modalBindForm(sel, rpcKey, opts) {
    opts = opts || {};
    var el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el || el.__s1FormBound) return;
    el.__s1FormBound = true;
    var saveBtn =
      el.querySelector('[data-modal-save]') ||
      el.querySelector('.jd-modal-actions .btn-primary, .s1-mfoot .s1-btn.pri, .tm-actions .tm-primary, .fm-actions .fm-primary, .jd-modal-foot .jd-primary, .tk-actions .tk-primary');
    if (!saveBtn) { try { console.warn('[modalBindForm] no save button found for', sel || el); } catch (_) {} return; }
    saveBtn.addEventListener('click', async function (ev) {
      ev.preventDefault();
      var payload = modalCollect(el);
      if (opts.transform) payload = opts.transform(payload, el) || payload;
      if (opts.validate) {
        var err = opts.validate(payload);
        if (err) { flash(err); return; }
      }
      try {
        var r = await window.S1.comm.action(rpcKey, payload);
        if (r && r.ok === false) { flash(r.error || (rpcKey + ' failed')); return; }
        modalClose(el);
        flash(opts.successMsg || 'Saved');
        if (opts.onSuccess) opts.onSuccess(r);
      } catch (e) {
        flash((opts.label || rpcKey) + ' failed: ' + (e.message || e));
      }
    });
  }

  window.S1 = window.S1 || {};
  window.S1.wireStandardPage = wire;
  window.S1.flash = flash;
  window.S1.safe  = safe;
  window.S1.modal = {
    open: modalOpen,
    close: modalClose,
    collect: modalCollect,
    bindForm: modalBindForm
  };
})();
