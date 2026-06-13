// Module: Job Detail
// Wires every interactive element on the JobDetail page end-to-end:
//   - top-level tabs (Communication / Growth Plan / Files / …)
//   - composer (SMS / Email / Note / Log call), Send + Save-draft
//   - attach (real file picker → comm.upload)
//   - timeline filter chips, files filter chips, accounting sub-tabs
//   - status select, call, follow-up, claim lead, book lead, mark lost/bad
//   - add stop / remove stop, add note / contact / charge / line, gp-row delete
//   - growth-plan job-param inputs (debounced save), quick-charge presets
//
// Comm ops (action/save/upload) fire through PostMessageComm so the host
// (BusinessCardPlatform JobDetail.S1Ui.cs) sees real (method, resource,
// payload) tuples and the lab pane logs them with their actual content.

const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = {
  "name": "jobDetail",
  "title": "Job Detail",
  "reads":  ["jobs", "customers", "finance/invoices", "documents"],
  "writes": ["jobs"]
};

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["jobDetail"] || {};

  normalizeJobDetailData(data);

  window.S1.render.bind(document, data);

  // Seed the composer "To" fields when empty. The backend now provides
  // composer.email.to / composer.text.to (#1424); this is a defensive fallback
  // covering the primary contact when the canonical customer fields are blank.
  // The !input.value guard keeps a user's typed value from being overwritten.
  const contacts = (data.contacts && data.contacts.items) || [];
  const firstContact = (field) => {
    const primary = contacts.find((x) => x.isPrimary && x[field]);
    return (primary && primary[field]) ||
           ((contacts.find((x) => x[field]) || {})[field]) || '';
  };
  const emailTo = document.querySelector('input[data-bind-value="composer.email.to"]');
  if (emailTo && !emailTo.value) {
    emailTo.value = ((data.customer && data.customer.email) || firstContact('email') || '');
  }
  const textTo = document.querySelector('input[data-bind-value="composer.text.to"]');
  if (textTo && !textTo.value) {
    textTo.value = ((data.customer && data.customer.phone) || firstContact('phone') || '');
  }

  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'jobDetail' } }));
}
load().catch(e => console.warn('[jobDetail] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

// ────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────
const $  = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function flash(text, tone) {
  const t = document.createElement('div');
  t.textContent = text;
  t.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);' +
                    'background:' + (tone === 'bad' ? '#B23E3E' : '#0A2540') +
                    ';color:#fff;padding:10px 16px;border-radius:6px;' +
                    'font-size:13px;z-index:9999;box-shadow:0 4px 14px rgba(0,0,0,0.18);';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

async function safe(label, fn) {
  try { return await fn(); }
  catch (e) { flash((label || 'Action') + ' failed: ' + (e && e.message || e), 'bad'); throw e; }
}

// #1496: flip the "Book this lead" button to its booked state in place (DOM-only,
// no innerHTML per platform rule 2). The host's post-mutation s1ui:state push then
// reconciles this via the declarative bindings.
function markBookedUi() {
  const btn = document.getElementById('jdBookLeadBtn');
  if (btn) {
    const lbl = btn.querySelector('.jd-book-label');
    if (lbl) lbl.textContent = 'Booked';
    btn.classList.add('is-booked');
    btn.setAttribute('disabled', 'disabled');
    btn.setAttribute('aria-disabled', 'true');
  }
  ['jdMarkLostBtn', 'jdMarkBadBtn'].forEach(id => {
    const e = document.getElementById(id);
    if (e) { e.setAttribute('disabled', 'disabled'); e.setAttribute('aria-disabled', 'true'); }
  });
}

// ── 1) Top-level tabs ───────────────────────────────────────────────────
$$('.tab[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    $$('.tab[data-tab]').forEach(b => b.classList.toggle('active', b === btn));
    $$('.tab-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === target));
  });
});

// F32: removed dead composer wiring (old sections 2-7). The pre-cmx .composer
// /.composer-tabs/.composer-foot markup no longer exists — the cmx composer
// (#cmxTabs inline handler + the cmx IIFE in this file) owns tabs, send,
// save-draft, attach, template insert, emoji, char-count and ⌘/Ctrl+Enter.

// ── 8) Timeline filter chips ────────────────────────────────────────────
// Add Discount modal: discount type radio (Fixed amount / Percent of subtotal)
// swaps the amount field's prefix, label, placeholder, and step.
(function () {
  const radios = $$('input[name="jd-disc-type"]');
  const label  = document.getElementById('jdDiscAmtLabel');
  const prefix = document.getElementById('jdDiscAmtPrefix');
  const input  = document.getElementById('jdDiscAmtInput');
  if (!radios.length || !label || !prefix || !input) return;
  function syncDiscType() {
    const sel = radios.find(r => r.checked);
    const kind = sel ? sel.value : 'fixed';
    if (kind === 'percent') {
      label.textContent  = 'Percentage *';
      prefix.textContent = '%';
      input.setAttribute('placeholder', '0');
      input.setAttribute('step', '0.1');
      input.setAttribute('max', '100');
    } else {
      label.textContent  = 'Amount *';
      prefix.textContent = '$';
      input.setAttribute('placeholder', '0.00');
      input.setAttribute('step', '0.01');
      input.removeAttribute('max');
    }
  }
  radios.forEach(r => r.addEventListener('change', syncDiscType));
  syncDiscType();
})();

// #1340 Add/Edit Surcharge modal: surcharge type radio (Percent of total / Fixed
// amount) swaps the amount field's prefix, label, placeholder, and step — mirrors
// the discount toggle above.
(function () {
  const radios = $$('input[name="surcharge-type"]');
  const label  = document.getElementById('jdSurchargeAmtLabel');
  const prefix = document.getElementById('jdSurchargeAmtPrefix');
  const input  = document.getElementById('jdSurchargeAmtInput');
  if (!radios.length || !label || !prefix || !input) return;
  function syncSurType() {
    const sel = radios.find(r => r.checked);
    const kind = sel ? sel.value : 'percent';
    if (kind === 'fixed') {
      label.textContent  = 'Amount *';
      prefix.textContent = '$';
      input.setAttribute('placeholder', '0.00');
      input.setAttribute('step', '0.01');
      input.removeAttribute('max');
    } else {
      label.textContent  = 'Amount (%) *';
      prefix.textContent = '%';
      input.setAttribute('placeholder', '0');
      input.setAttribute('step', '0.1');
      input.setAttribute('max', '100');
    }
  }
  radios.forEach(r => r.addEventListener('change', syncSurType));
  window.jdSyncSurchargeType = syncSurType;
  syncSurType();
})();

// #1340 Add/Edit Surcharge save: fires job.surcharge.add (no chargeId) or
// job.surcharge.edit (chargeId present); the server computes the dollar amount
// (percent of the total charge, or flat) and the post-action state re-push
// re-renders the charges table + footer. Custom handler (not bindForm) so the
// same modal serves both add and edit with a dynamic action key.
(function () {
  const btn = document.getElementById('jdSurchargeSaveBtn');
  if (!btn) return;
  // Reset the modal to "Add" state (clear edit id/title/prefill, default Percent).
  function resetSurchargeModal() {
    const sm = document.getElementById('jdAddSurchargeModal');
    if (!sm) return;
    const idEl = sm.querySelector('[name="chargeId"]'); if (idEl) idEl.value = '';
    const descEl = sm.querySelector('[name="description"]'); if (descEl) descEl.value = '';
    const amtEl = sm.querySelector('[name="amount"]'); if (amtEl) amtEl.value = '';
    const pctRadio = sm.querySelector('input[name="surcharge-type"][value="percent"]');
    if (pctRadio) pctRadio.checked = true;
    if (window.jdSyncSurchargeType) window.jdSyncSurchargeType();
    const title = document.getElementById('jdSurchargeTitle'); if (title) title.textContent = 'Add Surcharge';
    btn.textContent = 'Add Surcharge';
  }
  window.jdResetSurchargeModal = resetSurchargeModal;
  // Any "+ Add surcharge" trigger resets the modal before it opens.
  document.addEventListener('click', function (ev) {
    const t = ev.target.closest && ev.target.closest('[data-jd-open="jdAddSurchargeModal"], #jdAddSurchargeBtn');
    if (t) resetSurchargeModal();
  });
  btn.addEventListener('click', async function (ev) {
    ev.preventDefault();
    const modal = document.getElementById('jdAddSurchargeModal');
    if (!modal) return;
    const descEl = modal.querySelector('[name="description"]');
    const amtEl  = modal.querySelector('[name="amount"]');
    const idEl   = modal.querySelector('[name="chargeId"]');
    const typeEl = modal.querySelector('input[name="surcharge-type"]:checked');
    const desc = (descEl && descEl.value || '').trim();
    const amt  = amtEl ? amtEl.value : '';
    const surType = typeEl ? typeEl.value : 'percent';
    const chargeId = (idEl && idEl.value || '').trim();
    if (!desc) { flash('Description is required', 'bad'); return; }
    if (!(Number(amt) > 0)) { flash('Amount must be greater than 0', 'bad'); return; }
    const action = chargeId ? 'job.surcharge.edit' : 'job.surcharge.add';
    const payload = { description: desc, 'surcharge-type': surType, amount: amt };
    if (chargeId) payload.chargeId = chargeId;
    await safe('Save surcharge', async function () {
      const r = await comm.action(action, payload);
      if (r && r.ok === false) { flash(r.error || 'Surcharge failed', 'bad'); return; }
      flash(chargeId ? 'Surcharge updated' : 'Surcharge added');
      try { window.jdCloseModal && window.jdCloseModal('jdAddSurchargeModal'); } catch (_) {}
    });
  });
})();

// Add Charge modal: preset → rate, rate × quantity → live Line total.
(function () {
  const modal = document.getElementById('addChargeModal');
  if (!modal) return;
  const presetSel = modal.querySelector('[name="preset"]');
  const rateInp   = modal.querySelector('[name="rate"]');
  const qtyInp    = modal.querySelector('[name="quantity"]');
  const totalEl   = document.getElementById('addChargeLineTotal');
  const fmt = (n) => '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  function recomputeTotal() {
    const r = parseFloat((rateInp && rateInp.value) || '0') || 0;
    const q = parseFloat((qtyInp  && qtyInp.value)  || '0') || 0;
    if (totalEl) totalEl.textContent = fmt(r * q);
  }
  function syncRateFromPreset() {
    if (!presetSel || !rateInp) return;
    const v = presetSel.value || '';
    const m = v.match(/\$\s*([\d,]+(?:\.\d+)?)/);
    if (m) { rateInp.value = m[1].replace(/,/g, ''); recomputeTotal(); }
  }
  if (presetSel) presetSel.addEventListener('change', syncRateFromPreset);
  if (rateInp)   rateInp.addEventListener('input', recomputeTotal);
  if (qtyInp)    qtyInp.addEventListener('input', recomputeTotal);
})();

// + Add tag — opens addTagModal (via the generic data-jd-open handler) and
// fills the picker with available tags minus ones already applied. Click a
// chip → fire RPC, close modal. Server is expected to push fresh
// customer.tags state which re-renders the chip row.
function fillAddTagPicker() {
  const fx       = (window.S1.fixtures || {}).jobDetail || {};
  const applied  = ((fx.customer && fx.customer.tags) || []).map(t => String(t).toLowerCase());
  const catalog  = ((fx.customer && fx.customer.availableTags) || []).map(t => (t && t.name) || String(t || ''));
  const pickable = catalog.filter(name => name && !applied.includes(name.toLowerCase()));
  const wrap     = document.getElementById('addTagPicker');
  const empty    = document.getElementById('addTagEmpty');
  if (!wrap) return;
  while (wrap.firstChild) wrap.removeChild(wrap.firstChild);
  if (!pickable.length) { if (empty) empty.style.display = ''; return; }
  if (empty) empty.style.display = 'none';
  pickable.forEach(name => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tag';
    b.setAttribute('data-jd-pick-tag', name);
    b.style.cssText = 'cursor:pointer;';
    b.textContent = name;
    wrap.appendChild(b);
  });
}
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-jd-action="open-add-tag"]'); if (!b) return;
  // Generic data-jd-open handler will open the modal; just populate first.
  setTimeout(fillAddTagPicker, 0);
});
document.addEventListener('click', async (ev) => {
  const b = ev.target.closest('[data-jd-pick-tag]'); if (!b) return;
  ev.preventDefault();
  const tag = b.getAttribute('data-jd-pick-tag');
  try { await comm.action('jobDetail.tag.add', { tag }); flash('Tag added: ' + tag); }
  catch (e) { flash('Add tag failed: ' + (e.message || e)); }
  if (window.S1 && window.S1.modal && typeof window.S1.modal.close === 'function') window.S1.modal.close('#addTagModal');
  else { const m = document.getElementById('addTagModal'); if (m) { m.classList.remove('open'); m.style.display = 'none'; } }
});

// Files-tab filter chips (All / Photos / PDFs / Signed). Each chip carries
// data-files-filter; the three [data-files-group] wrappers (display:contents)
// either become visible or hidden as a unit.
function applyFilesFilter(key) {
  $$('.files-filters [data-files-filter]').forEach(c => c.classList.toggle('active', c.getAttribute('data-files-filter') === key));
  // "PDFs" is the type, not a group — signed docs are also PDFs, so the
  // PDFs chip should include them.
  const visible = {
    all:    ['photos','pdfs','signed'],
    photos: ['photos'],
    pdfs:   ['pdfs','signed'],
    signed: ['signed']
  }[key] || ['photos','pdfs','signed'];
  $$('[data-files-group]').forEach(g => {
    const group = g.getAttribute('data-files-group');
    g.style.display = visible.includes(group) ? 'contents' : 'none';
  });
}
function refreshFilesFilterCounts() {
  const photos = $$('[data-files-group="photos"] .file').length;
  const pdfs   = $$('[data-files-group="pdfs"] .file').length;
  const signed = $$('[data-files-group="signed"] .file').length;
  const set = (key, n) => {
    const cnt = document.querySelector('[data-files-filter="' + key + '"] .files-filter-count');
    if (cnt) cnt.textContent = String(n);
  };
  set('all', photos + pdfs + signed);
  set('photos', photos);
  set('pdfs', pdfs + signed);   // PDFs chip counts signed docs as PDFs too
  set('signed', signed);
}
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('.files-filters [data-files-filter]'); if (!b) return;
  ev.preventDefault();
  applyFilesFilter(b.getAttribute('data-files-filter'));
});
document.addEventListener('s1ui:ready', refreshFilesFilterCounts);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', refreshFilesFilterCounts);
}

$$('.timeline-head .filter-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    $$('.timeline-head .filter-chip').forEach(c => c.classList.toggle('active', c === chip));
    // Order-independent: read the chip's declared filter kind (added on every
    // chip in index.html) instead of relying on chip index. all|call|sms|mail|note|pinned
    const kind = chip.getAttribute('data-jd-filter') || 'all';
    $$('.tab-pane[data-pane="communication"] .tl-item, .tab-pane[data-pane="communication"] .tl-row').forEach(row => {
      if (kind === 'all')    { row.style.display = ''; return; }
      if (kind === 'pinned') { row.style.display = row.classList.contains('pinned') ? '' : 'none'; return; }
      // Match the precise tl-<kind> class (not a substring) so descendant
      // button classes can't cause a false match. Pinned-strip rows use
      // .tl-pinned-item (not .tl-item), so they're never hidden here.
      row.style.display = row.classList.contains('tl-' + kind) ? '' : 'none';
    });
  });
});

// ── F#1483: "Show more" expand toggle for clamped timeline bodies ─────────
// Mark rows whose body overflows the CSS clamp so the "Show more" link shows,
// then toggle .expanded on click. classList/textContent only (CLAUDE.md rule 2).
function jdMarkOverflowingRows() {
  $$('.tab-pane[data-pane="communication"] .tl-item').forEach((row) => {
    if (row.classList.contains('expanded')) return;
    const isMail = row.classList.contains('tl-mail');
    const el = row.querySelector(isMail ? '.tl-text-mail' : '.tl-text-text');
    if (!el) { row.classList.remove('has-overflow'); return; }
    // Mail bodies render in an auto-sizing iframe; use the iframe's own height.
    let contentH = el.scrollHeight;
    if (isMail) {
      const fr = el.querySelector('iframe');
      if (fr) contentH = Math.max(contentH, parseInt(fr.style.height, 10) || fr.offsetHeight || 0);
    }
    row.classList.toggle('has-overflow', contentH - el.clientHeight > 4);
  });
}
document.addEventListener('s1ui:ready', () => setTimeout(jdMarkOverflowingRows, 60));
document.addEventListener('click', (e) => {
  const more = e.target.closest && e.target.closest('.tl-more');
  if (!more) return;
  const row = more.closest('.tl-item');
  if (!row) return;
  const expanded = row.classList.toggle('expanded');
  more.textContent = expanded ? 'Show less' : 'Show more';
});

// ── F#1378: timeline pin surfacing (strip + count + optimistic model) ─────
// The single source of truth is window.S1.fixtures.jobDetail.timeline — the
// same object load() binds from and that the host re-emits with pinned:true
// on a toggled item. Mutating it means optimistic state survives re-renders.
function jdTimeline() {
  const d = (window.S1.fixtures || {})["jobDetail"] || {};
  return d.timeline || null;
}
function jdStripText(html) {
  // Plain-text snippet without innerHTML (CLAUDE.md rule 2). body is blanked
  // for mail rows (load() moves it to bodyHtml), so the strip falls back to
  // the stripped bodyHtml for emails.
  try { return new DOMParser().parseFromString(html || '', 'text/html').body.textContent || ''; }
  catch { return ''; }
}
function jdComputeItem(it) {
  it.pinnedClass = it.pinned ? 'pinned' : '';
  it.preview = (it.body && it.body.trim()) ? it.body : jdStripText(it.bodyHtml);
}
// Post-fetch timeline normalization. Runs on initial load AND on every host
// state push so a refresh keeps the same derived presentation fields the first
// render produced. #1540: without re-running this on state push,
// pinnedClass/pinnedItems/pinnedCount are lost and a pinned row visually
// "drops" after the post-action refresh.
function normalizeJobDetailData(data) {
  if (!data) return;
  // Move mail-kind body → bodyHtml so only emails get the sandboxed-iframe
  // render path; SMS/call/note keep plain-text body rendering.
  try {
    const sections = data.timeline && data.timeline.daySections;
    if (Array.isArray(sections)) {
      for (const sec of sections) {
        if (!sec || !Array.isArray(sec.items)) continue;
        for (const it of sec.items) {
          if (it && it.kind === 'mail' && it.bodyHtml == null) {
            it.bodyHtml = it.body || '';
            it.body = '';
          }
        }
      }
    }
  } catch {}
  // Derive per-item pin presentation fields + the pinned-strip model from the
  // data the host supplies (recordId + pinned on each item).
  try { deriveTimelinePins(data.timeline); } catch {}
}
function deriveTimelinePins(tl) {
  if (!tl) return;
  const sections = Array.isArray(tl.daySections) ? tl.daySections : [];
  const pinned = [];
  for (const sec of sections) {
    for (const it of (sec.items || [])) {
      jdComputeItem(it);
      if (it.pinned) pinned.push(it);
    }
  }
  tl.pinnedItems = pinned;
  tl.pinnedCount = pinned.length ? String(pinned.length) : '';
}
// Update the in-memory model for one item, scoped by kind (note vs comm) so
// numerically-colliding ids from different tables never cross-match.
function setItemPinned(kind, recordId, pinned) {
  const tl = jdTimeline();
  if (!tl || !Array.isArray(tl.daySections)) return;
  const wantNote = (kind === 'note');
  for (const sec of tl.daySections) {
    for (const it of (sec.items || [])) {
      const itNote = (it.kind === 'note');
      if (itNote === wantNote && String(it.recordId) === String(recordId)) {
        it.pinned = !!pinned;
        it.pinnedClass = pinned ? 'pinned' : '';
      }
    }
  }
}
// Re-derive pinnedItems/pinnedCount and rebuild the strip DOM via
// createElement/textContent only (no innerHTML, CLAUDE.md rule 2).
function refreshPinned() {
  const tl = jdTimeline();
  if (!tl) return;
  const sections = Array.isArray(tl.daySections) ? tl.daySections : [];
  const pinned = [];
  for (const sec of sections) {
    for (const it of (sec.items || [])) {
      jdComputeItem(it);
      if (it.pinned) pinned.push(it);
    }
  }
  tl.pinnedItems = pinned;
  tl.pinnedCount = pinned.length ? String(pinned.length) : '';

  const list = document.querySelector('.tl-pinned-strip .tl-pinned-list');
  if (list) {
    while (list.firstChild) list.removeChild(list.firstChild);
    for (const it of pinned) {
      const row = document.createElement('div');
      row.className = 'tl-pinned-item tl-' + (it.kind || '');
      row.setAttribute('data-jd-pinned-record', it.recordId == null ? '' : String(it.recordId));
      row.setAttribute('data-jd-pinned-kind', it.kind || '');
      const k = document.createElement('span'); k.className = 'tl-pinned-kind'; k.textContent = it.kindLabel || ''; row.appendChild(k);
      const b = document.createElement('span'); b.className = 'tl-pinned-body'; b.textContent = it.preview || ''; row.appendChild(b);
      const t = document.createElement('span'); t.className = 'tl-pinned-time'; t.textContent = it.time || ''; row.appendChild(t);
      const x = document.createElement('button'); x.type = 'button'; x.className = 'tl-pinned-unpin';
      x.setAttribute('data-jd-unpin', it.recordId == null ? '' : String(it.recordId));
      x.setAttribute('data-jd-unpin-kind', it.kind || '');
      x.title = 'Unpin'; x.textContent = '×'; row.appendChild(x);
      list.appendChild(row);
    }
  }
  $$('[data-bind-text="timeline.pinnedCount"]').forEach(el => { el.textContent = tl.pinnedCount; });
  const strip = document.querySelector('.tl-pinned-strip');
  if (strip) strip.style.display = pinned.length ? '' : 'none';
}
function jdCssAttrEsc(s) { return String(s).replace(/["\\]/g, '\\$&'); }

// #1540: re-derive timeline pin fields on every host state push so a pinned
// row stays pinned after the post-action refresh. apply() emits state:replaced
// synchronously before its render.bind, so mutating the incoming state here is
// picked up by that bind.
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', function (state) {
    try { normalizeJobDetailData(state); } catch (_) {}
  });
}

// ── 9) Status select ────────────────────────────────────────────────────
(function () {
  const sel = $('.status-select');
  if (!sel) return;
  sel.addEventListener('change', async () => {
    await safe('Update status', async () => {
      await comm.save('jobDetail.status', { status: sel.value });
      flash('Status: ' + sel.value);
    });
  });
})();

// ── 10) Header Call button ──────────────────────────────────────────────
(function () {
  const call = $$('.page-bar .btn-secondary, .cust-header .btn-secondary').find(b => /\bcall\b/i.test(b.textContent));
  if (!call) return;
  call.setAttribute('data-comm-action', 'action:jobDetail.call:');
  call.__s1Wired = true;
  call.addEventListener('click', async (ev) => {
    ev.preventDefault();
    await safe('Call', async () => {
      const r = await comm.action('jobDetail.call', {});
      if (r && r.telUrl) window.location.href = r.telUrl;
      else flash('No phone number on file', 'bad');
    });
  });
})();

// ── 11) Edit customer ───────────────────────────────────────────────────
(function () {
  const btn = $('.cust-header .edit');
  if (!btn) return;
  btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#jdContactDetailsModal');
  });
})();

// ── 13) Claim lead ──────────────────────────────────────────────────────
// #1522: select by the stable data-comm-action attribute, not by visible text —
// the label is now data-bound (claim.cta) and becomes "" when claimed, so a
// text-based selector would be fragile.
$$('[data-comm-action="action:jobDetail.claim-lead"]').forEach(b => {
  if (b.__s1Wired) return;
  b.setAttribute('data-comm-action', 'action:jobDetail.claim-lead:');
  b.__s1Wired = true;
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    if (b.getAttribute('aria-busy') === 'true') return;   // guard double-click
    b.setAttribute('aria-busy', 'true');
    try {
      await safe('Claim lead', async () => {
        const r = await comm.action('jobDetail.claim-lead', {});
        b.style.display = 'none';                          // #1522: button disappears
        const strip = b.closest('.claim');
        if (strip && r && r.claim) {
          const t = strip.querySelector('.t'), s = strip.querySelector('.s');
          if (t && r.claim.title) t.textContent = r.claim.title;
          if (s && r.claim.sub)   s.textContent = r.claim.sub;
        }
        flash('Lead claimed');
      });
    } finally { b.removeAttribute('aria-busy'); }
  });
});

// ── 13b) Quick-action & payment-link buttons (right rail) ───────────────
// These <a href="#" data-comm-action="action:jobDetail.X"> links previously
// fell through to the generic dispatcher: no preventDefault (page jumped to
// top) and no success/error toast. Wire each one explicitly so it matches the
// old UI's visible confirmation. Backend handlers exist (JobDetail.S1Ui.cs
// :126-130). __s1Wired = true stops the standard-page fallback double-firing.
[
  ['jobDetail.send-portal-link',                 'Portal link sent'],
  ['jobDetail.send-growth-plan',                 'Estimate sent'],
  ['jobDetail.request-a-card-on-file',           'Card request sent'],
  ['jobDetail.send-link-to-customer',            'Payment link sent to customer'],
].forEach(([action, okMsg]) => {
  $$('[data-comm-action="action:' + action + '"]').forEach(el => {
    if (el.__s1Wired) return;
    el.__s1Wired = true;
    el.addEventListener('click', async (ev) => {
      ev.preventDefault();
      if (el.getAttribute('aria-busy') === 'true') return;   // guard double-click
      el.setAttribute('aria-busy', 'true');
      try {
        await safe(okMsg, async () => {
          const r = await comm.action(action, {});
          flash((r && (r.message || r.toast)) || okMsg);
        });
      } finally {
        el.removeAttribute('aria-busy');
      }
    });
  });
});

// ── 14) Add contact ─────────────────────────────────────────────────────
(function () {
  const btn = $('.add-contact');
  if (!btn) return;
  btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#jdAddContactModal');
  });
})();

// ── 15) Book this lead ──────────────────────────────────────────────────
$$('button').filter(b => /book this lead/i.test(b.textContent.trim())).forEach(b => {
  if (b.__s1Wired) return;
  // Strip data-comm-action so the document-level dispatcher in
  // standard-page.js doesn't double-fire alongside this explicit handler.
  b.removeAttribute('data-comm-action');
  b.__s1Wired = true;
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    if (b.disabled || b.classList.contains('is-booked')) return;   // #1496 re-click guard
    const id = ((window.S1.fixtures || {}).jobDetail && window.S1.fixtures.jobDetail.deal && window.S1.fixtures.jobDetail.deal.id) || '';
    await safe('Book lead', async () => {
      const r = await comm.action('jobDetail.book-lead', { id });
      if (r && r.ok === false) { flash(r.error || 'Could not book this lead', 'bad'); return; }
      flash('Lead booked — confirmation sent to customer');
      markBookedUi();   // immediate in-place feedback; host state push reconciles via bindings
      if (r && r.navigateTo) window.location.href = r.navigateTo;
      // no window.location.reload(): declarative binding keeps it "Booked" on the next state push
    });
  });
});

// ── 16) Mark lost / Mark bad lead ───────────────────────────────────────
$$('button').filter(b => /^mark lost$/i.test(b.textContent.trim())).forEach(b => {
  // Feature 1546: trigger only opens the modal; the real action fires from the
  // modal Save via bindForm (which validates the required reason). Strip any
  // data-comm-action so clicking the trigger never closes the deal with no reason.
  b.removeAttribute('data-comm-action');
  b.__s1Wired = true;
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#jdMarkLostModal');
  });
});
$$('button').filter(b => /mark bad lead/i.test(b.textContent.trim())).forEach(b => {
  // Feature 1546: trigger only opens the dedicated bad-lead modal.
  b.removeAttribute('data-comm-action');
  b.__s1Wired = true;
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    // Defect A2: open the dedicated bad-lead modal (was opening the lost modal).
    window.S1.modal.open('#jdMarkBadModal');
  });
});

// ── 17) Growth plan: job-params (selects + number) ──────────────────────
(function () {
  const root = $('.tab-pane[data-pane="growth-plan"]');
  if (!root) return;
  // F1/F2: resolve each control by its data-bind-value rather than DOM order,
  // so a change to one control only writes its own Job column. The positional
  // map mis-bound Size→JobType, Type→JobSize, dropped Branch, and sent
  // Estimated-hours as 'trucks' (corrupting Job.TruckCount).
  const KEY_BY_BIND = {
    'jobInfo.dealSize':       'size',           // -> Job.JobSize
    'jobInfo.type':           'jobType',        // -> Job.JobType
    'jobInfo.branch':         'branch',         // -> Job.Branch
    'jobInfo.estimatedHours': 'estimatedHours'  // -> Job.EstimatedHours
  };
  const fields = $$('.gp2-input', root)
    .map(el => ({ el, key: KEY_BY_BIND[el.getAttribute('data-bind-value')] }))
    .filter(f => f.key);
  let timer = null;
  function pushSoon() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      const payload = {};
      for (const f of fields) payload[f.key] = f.el.value;
      await safe('Save job params', async () => { await comm.save('jobDetail.job-params', payload); });
    }, 600);
  }
  fields.forEach(f => f.el.addEventListener('change', pushSoon));
})();

// ── 18) Growth plan: + Add stop and Remove stop ─────────────────────────
$$('.s-action').filter(b => /add stop/i.test(b.textContent)).forEach(btn => {
  btn.setAttribute('data-comm-action', 'action:jobDetail.add-stop:');
  btn.__s1Wired = true;
  btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#addStopModal');
  });
});
function relabelStops() {
  const letters = ['A','B','C','D','E','F','G','H','I','J'];
  const cls     = ['a','b','c','d','e','f','g','h','i','j'];
  // #1447: skip greyed office bookend rows — they keep their ⌂ badge and must
  // not consume a letter slot, so real stops stay A/B/C…
  $$('.gp2-stop:not(.is-office)').forEach((stop, i) => {
    const tag = stop.querySelector('.gp2-stop-tag');
    if (!tag) return;
    tag.textContent = letters[i] || (i + 1);
    // Drop any old letter class, then set the new one.
    cls.forEach(c => tag.classList.remove(c));
    if (cls[i]) tag.classList.add(cls[i]);
  });
}
// F8: color the A/B/C badges on initial load and after every state refresh,
// not only after a stop removal — mirrors the renderQuickCharges wiring.
// The origin/destination stops used to be hardcoded `class="gp2-stop-tag a"` /
// `class="gp2-stop-tag b"` in markup; they got templated out into the
// route.stops <template> repeat, which only renders the letter as text and
// leaves no class for the .gp2-stop-tag.a / .b color rules to match. Run the
// existing relabelStops() on the same lifecycle hooks renderQuickCharges
// uses so the A/B (and any subsequent) tags pick up their colors on initial
// paint and on every state refresh, not just after a remove.
document.addEventListener('s1ui:ready', relabelStops);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', relabelStops);
}
relabelStops();
// Defect A4/A9: stop rows are now rendered from route.stops via a <template>
// repeat, so the remove (✕) buttons are created after this script runs. Use a
// delegated listener so dynamically-rendered buttons fire remove-stop with the
// real JobLocation id (data-record-id="{{id}}").
document.addEventListener('click', async (ev) => {
  const btn = ev.target.closest && ev.target.closest('.gp2-stop-x');
  if (!btn) return;
  ev.preventDefault();
  if (!window.confirm('Remove this stop?')) return;
  const idEl = btn.closest('[data-record-id]');
  const id   = idEl ? idEl.getAttribute('data-record-id') : null;
  const stop = btn.closest('.gp2-stop');
  if (!id) { flash('Cannot remove this stop (missing id)', 'bad'); return; }
  await safe('Remove stop', async () => {
    const r = await comm.action('jobDetail.remove-stop', { id });
    if (r && r.ok === false) { flash(r.error || 'Remove failed', 'bad'); return; }
    if (stop) stop.remove();
    relabelStops();
    flash('Stop removed');
  });
});

// #1463: Recalculate travel — force a fresh Google route compute (bypassing the 24h
// freshness gate) and repaint the five metric cells. Delegated so both the panel-header
// button and the inline error-banner button (rendered from route.status) are covered.
// On success the host's post-action refreshState pushes new route.* values via
// state:replaced, so the cells update with no full reload.
document.addEventListener('click', async (ev) => {
  const btn = ev.target.closest && ev.target.closest('[data-jd-recalc-route]');
  if (!btn) return;
  ev.preventDefault();
  if (btn.disabled) return;
  btn.disabled = true;
  flash('Recalculating travel…');
  try {
    await safe('Recalculate travel', async () => {
      const r = await comm.action('jobDetail.recalc-route', {});
      if (r && r.ok === false) { flash(r.error || 'Travel could not be calculated', 'bad'); return; }
      flash('Travel recalculated');
    });
  } finally {
    btn.disabled = false;
  }
});

// #1423: edit an existing stop/location — open #editStopModal prefilled from the
// stop's raw state fields (route.stops). Delegated, since stop cards render from
// route.stops via a <template> repeat after this script runs.
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest && ev.target.closest('.gp2-stop-edit');
  if (!btn) return;
  ev.preventDefault();
  const idEl = btn.closest('[data-record-id]');
  const id   = idEl ? idEl.getAttribute('data-record-id') : null;
  const modal = document.getElementById('editStopModal');
  if (!id || !modal) { flash('Cannot edit this stop (missing id)', 'bad'); return; }
  const state = (window.S1.fixtures || {}).jobDetail || {};
  const stops = (state.route && Array.isArray(state.route.stops)) ? state.route.stops : [];
  const data = stops.find(s => String(s.id) === String(id)) || {};
  const set = (name, val) => {
    const el = modal.querySelector('[name="' + name + '"]');
    if (!el) return;
    el.value = (val == null) ? '' : val;
  };
  const yesNo = (b) => b === true ? 'Yes' : b === false ? 'No' : '';
  set('id', id);
  set('address',      data.address);
  set('city',         data.city === '—' ? '' : data.city);
  set('provinceState', data.state);
  set('postalZip',    data.zip);
  set('country',      data.country);
  set('unitSuite',    data.unitNumber);
  // propertyType is a bound <select>; inject the stored value as an option if it
  // isn't one of the presets so an out-of-list value isn't silently dropped.
  const pt = data.propertyType || '';
  const ptSel = modal.querySelector('[name="propertyType"]');
  if (ptSel && pt) {
    const has = Array.prototype.some.call(ptSel.options, o => o.value === pt);
    if (!has) { const opt = document.createElement('option'); opt.value = pt; opt.textContent = pt; ptSel.insertBefore(opt, ptSel.firstChild); }
  }
  set('propertyType', pt);
  set('squareFootage', data.squareFootage);
  set('floor',        data.floor);
  set('elevator',     yesNo(data.hasElevator));
  set('hasStairs',    yesNo(data.hasStairs));
  set('longCarry',    yesNo(data.hasLongCarry));
  set('parkingRestrictions', data.parkingType);
  set('stopNotes',    data.notes);
  window.S1.modal.open('#editStopModal');
});

// #1342: delete a recorded payment. Delegated (rows render from state.payments
// via a <template> repeat), confirm first, then fire the delete-payment RPC with
// the real Payment id (data-record-id="{{id}}").
document.addEventListener('click', async (ev) => {
  const btn = ev.target.closest && ev.target.closest('.pay-del');
  if (!btn) return;
  ev.preventDefault();
  const row = btn.closest('[data-record-id]');
  const id  = row ? row.getAttribute('data-record-id') : null;
  if (!id) { flash('Cannot delete (missing id)', 'bad'); return; }
  if (!window.confirm('Delete this payment? The invoice paid total will be reduced.')) return;
  await safe('Delete payment', async () => {
    const r = await comm.action('jobDetail.delete-payment', { id });
    if (r && r.ok === false) { flash(r.error || 'Delete failed', 'bad'); return; }
    if (row) row.remove();
    flash('Payment deleted');
  });
});

// #1342: edit a recorded payment — open #jdEditPaymentModal prefilled from the
// payment's raw state fields (state.payments). Stripe-collected rows lock the
// amount/method/date/category/reference fields so only Notes can change.
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest && ev.target.closest('.pay-edit');
  if (!btn) return;
  ev.preventDefault();
  const row = btn.closest('[data-record-id]');
  const id  = row ? row.getAttribute('data-record-id') : null;
  const modal = document.getElementById('jdEditPaymentModal');
  if (!id || !modal) { flash('Cannot edit (missing id)', 'bad'); return; }
  const state = (window.S1.fixtures || {}).jobDetail || {};
  const list  = Array.isArray(state.payments) ? state.payments : [];
  const data  = list.find(p => String(p.id) === String(id)) || {};
  const set = (n, v) => { const el = modal.querySelector('[name="' + n + '"]'); if (el) el.value = (v == null ? '' : v); };
  // Method is a bound <select>; inject the stored value as an option if it isn't
  // one of the presets so an out-of-list value (e.g. "etransfer") isn't dropped.
  const method = data.method || '';
  const mSel = modal.querySelector('[name="type"]');
  if (mSel && method) {
    const has = Array.prototype.some.call(mSel.options, o => o.value === method);
    if (!has) { const opt = document.createElement('option'); opt.value = method; opt.textContent = method; mSel.insertBefore(opt, mSel.firstChild); }
  }
  set('id', id); set('amount', data.amount); set('type', method);
  set('category', data.category); set('reference', data.reference);
  set('notes', data.notes); set('date', data.date);          // ISO yyyy-MM-dd
  const stripeLocked = String(row.getAttribute('data-blocked') || '').indexOf('Stripe') !== -1;
  ['amount', 'type', 'date', 'category', 'reference'].forEach(n => {
    const el = modal.querySelector('[name="' + n + '"]'); if (el) el.disabled = stripeLocked;
  });
  const lock = modal.querySelector('#jdEditPayLocked');
  if (lock) lock.style.display = stripeLocked ? '' : 'none';
  window.S1.modal.open('#jdEditPaymentModal');
});

// ── 19) Growth plan + Accounting: charges ───────────────────────────────
function addCharge(ev) {
  ev.preventDefault();
  window.S1.modal.open('#addChargeModal');
}
$$('button').filter(b => /^\+\s*add charge$/i.test(b.textContent.trim())).forEach(b => {
  b.removeAttribute('data-comm-action');
  b.__s1Wired = true;
  b.addEventListener('click', addCharge);
});
$$('button').filter(b => /^\+\s*add line$/i.test(b.textContent.trim())).forEach(b => {
  b.removeAttribute('data-comm-action');
  b.__s1Wired = true;
  b.addEventListener('click', addCharge);
});

function renderQuickCharges() {
  const host = $('[data-quick-host]');
  const tmpl = $('[data-quick-template]');
  if (!host || !tmpl) return;
  const state = (window.S1.fixtures || {}).jobDetail || {};
  const presets = Array.isArray(state.chargePresets) ? state.chargePresets : [];
  const PALETTE = {
    Labor:     { bg: 'var(--terra-soft)', fg: 'var(--terra)' },
    Travel:    { bg: 'var(--info-bg)',    fg: 'var(--info)' },
    Packing:   { bg: 'var(--warn-bg)',    fg: 'var(--warn)' },
    Specialty: { bg: '#F1E8DD',           fg: '#8B6324' }
  };
  while (host.firstChild) host.removeChild(host.firstChild);

  // No active Settings → Charge presets: render no buttons (the four canonical
  // categories are NOT hardcoded). Guide the user to where categories come from.
  if (presets.length === 0) {
    const hint = document.createElement('div');
    hint.className = 'gp2-quick-hint';
    hint.textContent = 'No charge categories yet \u2014 add them in Settings \u2192 Charge Presets.';
    host.appendChild(hint);
    return;
  }

  // F1322: organize presets into category groups so a long flat list of
  // quick-add buttons becomes easier to scan. Category falls back to the
  // charge type (and finally "Other") so every preset lands in some group.
  // Group order is the first appearance order of the (already sorted) presets.
  const groups = [];
  const byCat = new Map();
  presets.forEach(p => {
    const cat = (p.category || p.chargeType || 'Other').trim() || 'Other';
    let bucket = byCat.get(cat);
    if (!bucket) { bucket = []; byCat.set(cat, bucket); groups.push(cat); }
    bucket.push(p);
  });

  function buildButton(p) {
    const node = tmpl.content.firstElementChild.cloneNode(true);
    const label = node.querySelector('[data-quick-label]');
    if (label) label.textContent = p.name || p.chargeType || 'Charge';
    const ic = node.querySelector('[data-quick-icon]');
    const c  = PALETTE[p.name] || PALETTE[p.chargeType] || { bg: 'var(--surface-2)', fg: 'var(--ink-2)' };
    if (ic) { ic.style.background = c.bg; ic.style.color = c.fg; ic.textContent = (p.name || p.chargeType || '?').charAt(0); }
    // Every button maps to a real Settings preset row, so it always carries the
    // preset id. The click ships only the id — never a client-side rate — and the
    // server resolves type/name/rate/qty/crew/vehicle from the DB.
    node.setAttribute('data-preset-id',   String(p.id));
    node.setAttribute('data-preset-name', p.name || '');
    node.__s1Wired = true;
    node.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const presetId = Number(node.getAttribute('data-preset-id'));
      await safe('Quick charge', async () => {
        const res = await comm.action('jobDetail.add-quick-charge', { presetId });
        if (res && res.ok) flash('Added ' + (node.getAttribute('data-preset-name') || 'charge'));
        else flash('Set up this category in Settings \u2192 Charge Presets', 'bad');
      });
    });
    return node;
  }

  groups.forEach(cat => {
    const group = document.createElement('div');
    group.className = 'gp2-quick-group';
    const head = document.createElement('div');
    head.className = 'gp2-quick-cat';
    head.textContent = cat;
    group.appendChild(head);
    const row = document.createElement('div');
    row.className = 'gp2-quick-row';
    byCat.get(cat).forEach(p => row.appendChild(buildButton(p)));
    group.appendChild(row);
    host.appendChild(group);
  });
}
document.addEventListener('s1ui:ready', renderQuickCharges);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderQuickCharges);
}
renderQuickCharges();

// ────────────────────────────────────────────────────────────────────────
// Feature #1505: Documents tab — field contracts + paperwork with signed status
// ────────────────────────────────────────────────────────────────────────
function renderDocuments() {
  const host  = $('[data-documents-host]');
  const empty = $('[data-documents-empty]');
  if (!host) return;
  const state = (window.S1.fixtures || {}).jobDetail || {};
  const rows  = Array.isArray(state.documents) ? state.documents : [];

  while (host.firstChild) host.removeChild(host.firstChild);
  if (empty) empty.hidden = rows.length > 0;
  if (!rows.length) return;

  function td(text, cls) {
    const cell = document.createElement('td');
    cell.className = 'jd-doc-cell' + (cls ? ' ' + cls : '');
    if (text != null) cell.textContent = text;
    return cell;
  }

  function headerRow(labels) {
    const tr = document.createElement('tr');
    labels.forEach(l => {
      const th = document.createElement('th');
      th.className = 'jd-doc-th';
      th.textContent = l;
      tr.appendChild(th);
    });
    return tr;
  }

  const table = document.createElement('table');
  table.className = 'jd-doc-table';
  const thead = document.createElement('thead');
  thead.appendChild(headerRow(['Document', 'Scope', 'Status', 'Signed', '']));
  table.appendChild(thead);
  const tbody = document.createElement('tbody');

  rows.forEach(d => {
    const tr = document.createElement('tr');
    tr.className = 'jd-doc-row';

    // Title + "field contract" chip
    const titleCell = td(null);
    titleCell.appendChild(document.createTextNode(d.title || 'Document'));
    if (d.isFieldContract) {
      const chip = document.createElement('span');
      chip.className = 'jd-doc-chip';
      chip.textContent = 'field contract';
      titleCell.appendChild(chip);
    }
    tr.appendChild(titleCell);

    // Scope
    tr.appendChild(td(d.scope === 'Customer' ? 'All customers' : 'This job', 'jd-doc-muted'));

    // Status pill
    const statusCell = td(null);
    const pill = document.createElement('span');
    const sl = d.statusLabel || (d.signed ? 'Signed' : 'Pending signature');
    pill.className = 'jd-doc-pill ' + (d.signed ? 'is-signed' : (d.status === 'Acknowledged' ? 'is-ack' : 'is-pending'));
    pill.textContent = sl;
    statusCell.appendChild(pill);
    tr.appendChild(statusCell);

    // Signed-by / at
    const signedText = d.signed
      ? ((d.signerName ? d.signerName + ' \u00B7 ' : '') + (d.signedAt || ''))
      : '\u2014';
    tr.appendChild(td(signedText, d.signed ? '' : 'jd-doc-muted'));

    // View action
    const viewCell = td(null);
    if (d.viewUrl) {
      const a = document.createElement('a');
      a.className = 'jd-doc-view';
      a.href = '#';
      a.textContent = d.hasPdf ? 'View PDF' : 'View';
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        try { window.parent.postMessage({ type: 's1ui:navigate', href: d.viewUrl }, '*'); } catch (_) {}
      });
      viewCell.appendChild(a);
    }
    tr.appendChild(viewCell);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  host.appendChild(table);
}
document.addEventListener('s1ui:ready', renderDocuments);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderDocuments);
}
renderDocuments();

// Charge rows render asynchronously from data-bind="rows", so a static
// $$('.gp-row-x') at module load binds to ZERO elements (the rows don't exist
// yet) and delete never fires. Use a document-level delegated click instead —
// same pattern as the .gp2-stop-x stop-remove handler. Mutations rely on the
// host's post-action S1State re-push to refresh totals + re-render the table,
// so we do NOT optimistically remove the row (that would leave the server-
// computed Subtotal / Tax / Customer-pays footer stale until the next load).
document.addEventListener('click', async (ev) => {
  const del = ev.target.closest && ev.target.closest('.gp-row-x');
  // Expense / wage delete buttons reuse .gp-row-x for styling; they have their
  // own delegated handlers, so skip them here.
  if (!del || del.classList.contains('exp-row-x') || del.classList.contains('wage-row-x')) return;
  const row = del.closest('tr[data-record-id]');
  const id  = row && row.getAttribute('data-record-id');
  if (!id) return;
  ev.preventDefault();
  if (!window.confirm('Delete this line?')) return;
  await safe('Delete line', async () => {
    const r = await comm.action('jobDetail.delete-charge', { id });
    if (r && r.ok === false) { flash(r.error || 'Delete failed', 'bad'); return; }
    flash('Line deleted');
  });
});

// F20: edit charge — open #editChargeModal prefilled from the row's data-edit-* attrs.
document.addEventListener('click', (ev) => {
  const pen = ev.target.closest && ev.target.closest('.gp-row-edit');
  if (!pen) return;
  ev.preventDefault();
  const row = pen.closest('tr[data-record-id]');
  if (!row) return;
  // #1340: a Surcharge row routes to the dedicated surcharge modal (so it can be
  // edited as a percent-of-total or fixed amount), not the generic charge modal.
  if ((row.getAttribute('data-edit-type') || '') === 'Surcharge') {
    const sm = document.getElementById('jdAddSurchargeModal');
    if (!sm) return;
    const setS = (name, val) => { const el = sm.querySelector('[name="' + name + '"]'); if (el) el.value = val == null ? '' : val; };
    // The stored Rate is the snapshotted dollar amount; default the modal to Fixed
    // amount prefilled with it. The user can switch to Percent of total to re-derive.
    setS('chargeId', row.getAttribute('data-record-id'));
    // Strip any "(3%)" suffix from the label for a clean description.
    var rawName = (row.getAttribute('data-edit-name') || '').replace(/\s*\([^)]*%\)\s*$/, '').trim();
    setS('description', rawName);
    setS('amount', row.getAttribute('data-edit-rate') || '');
    var fixedRadio = sm.querySelector('input[name="surcharge-type"][value="fixed"]');
    if (fixedRadio) fixedRadio.checked = true;
    if (window.jdSyncSurchargeType) window.jdSyncSurchargeType();
    var title = document.getElementById('jdSurchargeTitle'); if (title) title.textContent = 'Edit Surcharge';
    var saveBtn = document.getElementById('jdSurchargeSaveBtn'); if (saveBtn) saveBtn.textContent = 'Save Surcharge';
    window.jdOpenModal ? window.jdOpenModal('jdAddSurchargeModal') : window.S1.modal.open('#jdAddSurchargeModal');
    return;
  }
  const modal = document.getElementById('editChargeModal');
  if (!modal) return;
  const set = (name, val, isCheck) => {
    const el = modal.querySelector('[name="' + name + '"]');
    if (!el) return;
    if (isCheck) el.checked = !!val; else el.value = val == null ? '' : val;
  };
  set('chargeId',   row.getAttribute('data-record-id'));
  set('description', row.getAttribute('data-edit-name') || '');
  // chargeType is a bound <select>; if the row's type isn't one of the preset
  // options, inject it so the original value is preserved (not silently changed).
  var ctType = row.getAttribute('data-edit-type') || '';
  var ctSel = modal.querySelector('[name="chargeType"]');
  if (ctSel && ctType) {
    var has = Array.prototype.some.call(ctSel.options, function (o) { return o.value === ctType; });
    if (!has) { var opt = document.createElement('option'); opt.value = ctType; opt.textContent = ctType; ctSel.insertBefore(opt, ctSel.firstChild); }
  }
  set('chargeType', ctType);
  set('rate',       row.getAttribute('data-edit-rate') || '');
  set('quantity',   row.getAttribute('data-edit-qty') || '1');
  set('crewCount',  row.getAttribute('data-edit-crew') || '0');
  set('vehicleCount', row.getAttribute('data-edit-vehicle') || '0');
  set('notes',      row.getAttribute('data-edit-desc') || '');
  set('taxable',    row.getAttribute('data-edit-tax') === 'true', true);
  window.S1.modal.open('#editChargeModal');
});

// F20: drag-to-reorder charge rows. On drop, collect the current order of
// data-record-id values and fire reorder-charges; the state re-push re-renders.
(function () {
  let dragRow = null;
  function tbody() {
    const t = document.getElementById('acctRevenueTable');
    return t ? t.querySelector('tbody[data-bind="rows"]') : null;
  }
  document.addEventListener('dragstart', (ev) => {
    const row = ev.target.closest && ev.target.closest('#acctRevenueTable tbody tr[data-record-id]');
    if (!row) return;
    dragRow = row;
    row.classList.add('gp-dragging');
    try { ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', row.getAttribute('data-record-id') || ''); } catch (_) {}
  });
  document.addEventListener('dragover', (ev) => {
    if (!dragRow) return;
    const row = ev.target.closest && ev.target.closest('#acctRevenueTable tbody tr[data-record-id]');
    if (!row || row === dragRow) return;
    ev.preventDefault();
    const body = tbody();
    if (!body) return;
    const rect = row.getBoundingClientRect();
    const after = (ev.clientY - rect.top) > rect.height / 2;
    body.insertBefore(dragRow, after ? row.nextSibling : row);
  });
  document.addEventListener('drop', (ev) => {
    if (!dragRow) return;
    ev.preventDefault();
  });
  document.addEventListener('dragend', async () => {
    if (!dragRow) return;
    dragRow.classList.remove('gp-dragging');
    dragRow = null;
    const body = tbody();
    if (!body) return;
    const chargeIds = Array.from(body.querySelectorAll('tr[data-record-id]'))
      .map(r => Number(r.getAttribute('data-record-id')))
      .filter(n => !isNaN(n));
    if (!chargeIds.length) return;
    await safe('Reorder charges', async () => {
      const r = await comm.action('jobDetail.reorder-charges', { chargeIds });
      if (r && r.ok === false) { flash(r.error || 'Reorder failed', 'bad'); return; }
      flash('Charges reordered');
    });
  });
})();

// #1521: drag-to-reorder address stops. Mirrors the F20 charge block, re-scoped
// to the Locations & Route stops container. On drop, collect the current order of
// data-record-id values and fire reorder-stops; the state re-push re-renders.
(function () {
  let dragRow = null;
  function container() { return document.querySelector('[data-bind="route.stops"]'); }
  document.addEventListener('dragstart', (ev) => {
    const row = ev.target.closest && ev.target.closest('[data-bind="route.stops"] .gp2-stop');
    if (!row) return;
    dragRow = row;
    row.classList.add('gp2-dragging');
    try { ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', ''); } catch (_) {}
  });
  document.addEventListener('dragover', (ev) => {
    if (!dragRow) return;
    const row = ev.target.closest && ev.target.closest('[data-bind="route.stops"] .gp2-stop');
    if (!row || row === dragRow) return;
    ev.preventDefault();
    const body = container();
    if (!body) return;
    const rect = row.getBoundingClientRect();
    const after = (ev.clientY - rect.top) > rect.height / 2;
    body.insertBefore(dragRow, after ? row.nextSibling : row);
  });
  document.addEventListener('drop', (ev) => {
    if (!dragRow) return;
    ev.preventDefault();
  });
  document.addEventListener('dragend', async () => {
    if (!dragRow) return;
    dragRow.classList.remove('gp2-dragging');
    dragRow = null;
    const body = container();
    if (!body) return;
    const stopIds = Array.from(body.querySelectorAll('.gp2-stop [data-record-id]'))
      .map(r => Number(r.getAttribute('data-record-id')))
      .filter(n => !isNaN(n));
    if (!stopIds.length) return;
    await safe('Reorder stops', async () => {
      const r = await comm.action('jobDetail.reorder-stops', { stopIds });
      if (r && r.ok === false) { flash(r.error || 'Reorder failed', 'bad'); return; }
      flash('Stops reordered');
    });
  });
})();

// F23: delete expense — delegated (rows render async from data-bind="expenses").
document.addEventListener('click', async (ev) => {
  const del = ev.target.closest && ev.target.closest('.exp-row-x');
  if (!del) return;
  ev.preventDefault();
  const row = del.closest('tr[data-record-id]');
  const id  = row && row.getAttribute('data-record-id');
  if (!id) return;
  if (!window.confirm('Delete this expense?')) return;
  await safe('Delete expense', async () => {
    const r = await comm.action('jobDetail.delete-expense', { expenseId: id });
    if (r && r.ok === false) { flash(r.error || 'Delete failed', 'bad'); return; }
    flash('Expense deleted');
  });
});

// F24: delete wage — delegated (rows render async from data-bind="wages").
document.addEventListener('click', async (ev) => {
  const del = ev.target.closest && ev.target.closest('.wage-row-x');
  if (!del) return;
  ev.preventDefault();
  const row = del.closest('tr[data-record-id]');
  const id  = row && row.getAttribute('data-record-id');
  if (!id) return;
  if (!window.confirm('Delete this wage?')) return;
  await safe('Delete wage', async () => {
    const r = await comm.action('jobDetail.delete-wage', { wageId: id });
    if (r && r.ok === false) { flash(r.error || 'Delete failed', 'bad'); return; }
    flash('Wage deleted');
  });
});

// ── 20) + Add note (growth plan / customer panes) ───────────────────────
// The buttons themselves now use data-jd-open="addNoteModal" so the generic
// modal opener handles the click. The Save button is wired below via
// S1.modal.bindForm('#addNoteModal', 'jobDetail.note.add').
$$('.s-action').filter(b => /add note|^\+\s*note$/i.test(b.textContent)).forEach(b => {
  // Strip any leftover data-comm-action so the document-level dispatcher
  // doesn't fire a stale RPC; the modal flow now owns this interaction.
  b.removeAttribute('data-comm-action');
  b.__s1Wired = true;
});
if (window.S1 && window.S1.modal && window.S1.modal.bindForm) {
  window.S1.modal.bindForm('#addNoteModal', 'jobDetail.note.add', { label: 'Add note' });
}

// ── 21) Files tab: Upload ───────────────────────────────────────────────
// F32: removed the dead filter-chip loop here — it targeted nonexistent
// .file-tile/.file-card elements. The real Files filter is applyFilesFilter()
// (above), keyed off .files-filters [data-files-filter] and .file elements.
(function () {
  const filesPane = $('.tab-pane[data-pane="files"]');
  if (!filesPane) return;
  let fileInput = $('#jd-files-input');
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.id = 'jd-files-input';
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
  }
  function pickFiles(ev) { ev.preventDefault(); fileInput.click(); }
  $$('.btn-secondary, .file-upload', filesPane).forEach(b => {
    if (/upload/i.test(b.textContent) || b.classList.contains('file-upload')) {
      b.removeAttribute('data-comm-action'); // F6: no duplicate dispatcher RPC
      b.__s1Wired = true;
      b.addEventListener('click', pickFiles);
    }
  });
  fileInput.addEventListener('change', async () => {
    const files = Array.from(fileInput.files || []);
    for (const f of files) {
      await safe('Upload ' + f.name, async () => { await comm.upload(f, { resource: 'jobDetail.attachment' }); });
    }
    fileInput.value = '';
    if (files.length) flash('Uploaded ' + files.length + ' file' + (files.length === 1 ? '' : 's'));
  });
})();

// ── 22) Accounting sub-tabs ─────────────────────────────────────────────
// F23/F24: each tab now reveals its OWN section (#acctRevenue charges /
// #acctExpenses real JobExpense rows / #acctWages real JobWage rows / tax
// summary) instead of regex-filtering the charge table. The matching header
// action button (+ Add line / + Add expense / + Add Wages) is shown too.
(function () {
  const root = $('.tab-pane[data-pane="accounting"]');
  if (!root) return;
  function showTab(name) {
    $$('.acct-tab', root).forEach(t => t.classList.toggle('active', t.getAttribute('data-acct-tab') === name));
    $$('[data-acct-section]', root).forEach(s => { s.style.display = s.getAttribute('data-acct-section') === name ? '' : 'none'; });
    $$('[data-acct-action]', root).forEach(b => { b.style.display = b.getAttribute('data-acct-action') === name ? '' : 'none'; });
  }
  $$('.acct-tab', root).forEach((tab) => {
    tab.addEventListener('click', () => showTab(tab.getAttribute('data-acct-tab')));
  });
  showTab('revenue');
})();

// ── 22b) Per-note pin control on timeline rows ─────────────────────────
document.addEventListener('click', async (ev) => {
  const btn = ev.target.closest && ev.target.closest('[data-jd-pin]');
  if (!btn) return;
  ev.preventDefault();
  ev.stopPropagation();
  const noteId = btn.getAttribute('data-jd-pin');
  if (!noteId) return;
  await safe('Pin note', async () => {
    const r = await comm.action('jobDetail.pin-note', { noteId });
    if (r && r.ok === false) { flash(r.error || 'Pin failed', 'bad'); return; }
    const nowPinned = btn.classList.toggle('pinned');
    const row = btn.closest('.tl-item');
    if (row) row.classList.toggle('pinned', nowPinned);
    setItemPinned('note', noteId, nowPinned);
    refreshPinned();
    flash('Note pin toggled');
  });
});

// ── 22b-2) F#1378: unpin control inside the pinned strip ───────────────────
// The "×" on a strip item reuses the same toggle endpoints (pin-note /
// pin-comm), which flip IsPinned, so a second toggle unpins. Kind-scoped so
// note/comm ids from different tables can't cross-match.
document.addEventListener('click', async function (ev) {
  const x = ev.target.closest && ev.target.closest('[data-jd-unpin]');
  if (!x) return;
  ev.preventDefault();
  ev.stopPropagation();
  const recordId = x.getAttribute('data-jd-unpin');
  const kind = x.getAttribute('data-jd-unpin-kind') || '';
  if (!recordId) return;
  const isNote = (kind === 'note');
  await safe('Unpin', async function () {
    const r = isNote
      ? await comm.action('jobDetail.pin-note', { noteId: recordId })
      : await comm.action('jobDetail.pin-comm', { commId: recordId });
    if (r && r.ok === false) { flash(r.error || 'Unpin failed', 'bad'); return; }
    const sel = isNote
      ? '.tab-pane[data-pane="communication"] .tl-item.tl-note button.tl-pin[data-jd-pin="' + jdCssAttrEsc(recordId) + '"]'
      : '.tab-pane[data-pane="communication"] .tl-item:not(.tl-note) button.tl-pin-comm[data-jd-pin-comm="' + jdCssAttrEsc(recordId) + '"]';
    const btn = document.querySelector(sel);
    if (btn) {
      btn.classList.remove('pinned');
      const row = btn.closest('.tl-item');
      if (row) row.classList.remove('pinned');
    }
    setItemPinned(isNote ? 'note' : 'comm', recordId, false);
    refreshPinned();
    flash(isNote ? 'Note unpinned' : 'Communication unpinned');
  });
});

// ── 22c) F27: job-lifecycle actions menu (close / unfinalize / reset-plan /
// reset / unmark-bad / delete). The trigger toggles the menu; each item fires
// its data-comm-action key through comm.action, honoring a data-jd-confirm
// guard for the destructive ones. Items are marked __s1Wired so the generic
// fallback (section 23) doesn't double-fire.
(function () {
  const btn  = document.getElementById('jdJobActionsBtn');
  const list = document.getElementById('jdJobActionsList');
  if (!btn || !list) return;
  function closeMenu() { list.style.display = 'none'; btn.setAttribute('aria-expanded', 'false'); }
  function openMenu() { list.style.display = ''; btn.setAttribute('aria-expanded', 'true'); }
  btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (list.style.display === 'none') openMenu(); else closeMenu();
  });
  document.addEventListener('click', (ev) => {
    if (!ev.target.closest('.jd-actions-menu')) closeMenu();
  });
  $$('.jd-action-item', list).forEach(item => {
    item.__s1Wired = true;
    item.addEventListener('click', async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const key = item.getAttribute('data-comm-action') || '';
      const resource = key.split(':')[1];
      if (!resource) return;
      const confirmMsg = item.getAttribute('data-jd-confirm');
      if (confirmMsg && !window.confirm(confirmMsg)) return;
      closeMenu();
      await safe('Job action', async () => {
        const r = await comm.action(resource, {});
        if (r && r.ok === false) { flash(r.error || 'Action failed', 'bad'); return; }
        if (r && r.redirect) {
          // Server-supplied local path only (guard against open redirect).
          const dest = String(r.redirect);
          const local = /^\/(?!\/)/.test(dest) ? dest : '/Jobs';
          try { window.top.location.href = local; }
          catch (_) { window.location.href = local; }
          return;
        }
        flash('Done');
      });
    });
  });
})();

// ── 22d) F25: crew member-hours editor + crew notes (Accounting → Wages) ──
// Crew rows render from state via data-bind, so the Save buttons are created
// after this script runs — use delegated clicks. Member-hours fire
// action:job.member-hours.update; crew notes fire save:job.crew-notes.
document.addEventListener('click', async (ev) => {
  const save = ev.target.closest && ev.target.closest('.jd-crew-save');
  if (!save) return;
  ev.preventDefault();
  const row = save.closest('.jd-crew-row');
  if (!row) return;
  const userId = row.getAttribute('data-user-id');
  const input = row.querySelector('.jd-crew-hours');
  const hours = input ? input.value : '';
  if (!userId) { flash('Cannot save (missing crew member)', 'bad'); return; }
  if (hours === '' || isNaN(parseFloat(hours))) { flash('Enter hours first', 'bad'); return; }
  await safe('Update hours', async () => {
    const r = await comm.action('job.member-hours.update', { userId: Number(userId), hours: parseFloat(hours) });
    if (r && r.ok === false) { flash(r.error || 'Update failed', 'bad'); return; }
    const pay = row.querySelector('.jd-crew-pay');
    flash('Hours saved' + (pay && pay.textContent ? ' · pay updates on refresh' : ''));
  });
});
document.addEventListener('click', async (ev) => {
  const save = ev.target.closest && ev.target.closest('#jdCrewNotesSave');
  if (!save) return;
  ev.preventDefault();
  const ta = document.getElementById('jdCrewNotes');
  const content = ta ? ta.value : '';
  await safe('Save crew notes', async () => {
    const r = await comm.save('job.crew-notes', { content });
    if (r && r.ok === false) { flash(r.error || 'Save failed', 'bad'); return; }
    flash('Crew notes saved');
  });
});
// ── 23) Generic fallback for any [data-comm-action] not wired above ─────
// Removed: core/standard-page.js already installs an identical document-level
// dispatcher for [data-comm-action]. Having both attached caused every click
// on an un-explicitly-wired action button (e.g. "Send portal link",
// "+ Send link to customer") to fire `comm.action(...)` twice, producing two
// outbound RPCs per click. The standard-page.js copy is the canonical one;
// this module-local copy was a leftover duplicate.

// ── 24) F18: conversational AI assistant (FAB + chat panel) ─────────────
// The FAB opens a slide-in panel. Send fires jobDetail.ai-chat (a real model
// call + tools server-side) and keeps the returned `messages` list as running
// history so multi-turn + tool context survive. The ai-suggest-* draft buttons
// are untouched. All DOM via createElement/textContent (CLAUDE rule 2).
(function () {
  var fab   = document.querySelector('[data-ai-fab]');
  var panel = document.getElementById('aiAssistantPanel');
  if (!fab || !panel) return;
  var msgsEl = document.getElementById('jdAiMessages');
  var input  = document.getElementById('jdAiInput');
  var sendBtn = document.getElementById('jdAiSend');
  var closeBtn = document.getElementById('jdAiClose');
  var history = [];   // [{role, content}] — server round-trips the full list.
  var busy = false;

  function openPanel() { panel.style.display = 'flex'; if (input) input.focus(); }
  function closePanel() { panel.style.display = 'none'; }
  fab.addEventListener('click', function (ev) {
    ev.preventDefault();
    if (panel.style.display === 'flex') closePanel(); else openPanel();
  });
  if (closeBtn) closeBtn.addEventListener('click', closePanel);

  function bubble(role, text) {
    var b = document.createElement('div');
    b.style.cssText = 'border-radius:10px;padding:7px 10px;max-width:88%;white-space:pre-wrap;word-break:break-word;' +
      (role === 'user'
        ? 'background:#eef2f6;align-self:flex-end;'
        : 'background:#e7f4ee;align-self:flex-start;');
    b.textContent = text;
    msgsEl.appendChild(b);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return b;
  }

  async function send() {
    if (busy) return;
    var text = (input && input.value || '').trim();
    if (!text) return;
    busy = true;
    bubble('user', text);
    if (input) input.value = '';
    var pending = bubble('assistant', '…');
    await safe('AI assistant', async function () {
      var r = await comm.action('jobDetail.ai-chat', { message: text, chatHistory: history });
      if (r && r.ok === false) { pending.textContent = r.error || 'Assistant failed'; return; }
      pending.textContent = (r && r.reply) ? r.reply : '(no response)';
      // Preserve the server's full messages list (incl. tool blocks) as history.
      if (r && Array.isArray(r.messages)) history = r.messages;
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }).catch(function () { pending.textContent = 'Assistant failed — please try again.'; });
    busy = false;
  }

  if (sendBtn) sendBtn.addEventListener('click', function (ev) { ev.preventDefault(); send(); });
  if (input) input.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); send(); }
  });
})();

// ── 25) F19: multi-day / two-day move panel (Growth Plan scheduling region) ──
// Prefills pickup/delivery/overnight/fee from state.twoDay each render and
// toggles the Revert button on twoDay.isTwoDay. Create → create-two-day,
// Revert → revert-two-day, both re-render via comm.subscribe('jobs').
(function () {
  function fx() { return ((window.S1.fixtures || {}).jobDetail) || {}; }
  function sync() {
    var td = fx().twoDay || {};
    var ov = document.getElementById('jdTwoDayOvernight');
    if (ov) ov.checked = !!td.isOvernight;
    var revert = document.getElementById('jdTwoDayRevertBtn');
    if (revert) revert.disabled = !td.isTwoDay;
    var create = document.getElementById('jdTwoDayCreateBtn');
    if (create) create.disabled = !!td.isTwoDay;
  }
  // Re-sync whenever state is (re)bound: on initial ready, and after every
  // host state push (state:replaced fires on the bus after mutations).
  document.addEventListener('s1ui:ready', sync);
  try { window.S1.bus.on('state:replaced', function () { setTimeout(sync, 0); }); } catch (_) {}
  try { comm.subscribe('jobs', function () { setTimeout(sync, 0); }); } catch (_) {}
  setTimeout(sync, 0);

  var createBtn = document.getElementById('jdTwoDayCreateBtn');
  if (createBtn) createBtn.addEventListener('click', async function (ev) {
    ev.preventDefault();
    var pickup = (document.getElementById('jdTwoDayPickup') || {}).value || '';
    var delivery = (document.getElementById('jdTwoDayDelivery') || {}).value || '';
    var overnight = !!(document.getElementById('jdTwoDayOvernight') || {}).checked;
    var fee = (document.getElementById('jdTwoDayFee') || {}).value || '0';
    if (!pickup || !delivery) { flash('Enter pickup and delivery dates', 'bad'); return; }
    await safe('Convert to 2-day', async function () {
      var r = await comm.action('jobDetail.create-two-day', {
        pickupDate: pickup, deliveryDate: delivery,
        isOvernight: overnight ? 'true' : 'false', overnightStorageFee: fee
      });
      if (r && r.ok === false) { flash(r.error || 'Convert failed', 'bad'); return; }
      flash('Converted to two-day move');
    });
  });

  var revertBtn = document.getElementById('jdTwoDayRevertBtn');
  if (revertBtn) revertBtn.addEventListener('click', async function (ev) {
    ev.preventDefault();
    if (!window.confirm('Revert this move back to a single day? The delivery-day job will be removed.')) return;
    await safe('Revert to single day', async function () {
      var r = await comm.action('jobDetail.revert-two-day', {});
      if (r && r.ok === false) { flash(r.error || 'Revert failed', 'bad'); return; }
      flash('Reverted to single-day move');
      // When reverting from the deleted Delivery child, the server returns a local
      // path to the surviving anchor — navigate there so we don't sit on a dead page.
      if (r && r.navigateTo) {
        var dest = String(r.navigateTo);
        var local = /^\/(?!\/)/.test(dest) ? dest : '/Jobs';
        try { window.top.location.href = local; }
        catch (_) { window.location.href = local; }
      }
    });
  });
})();

// ── 26) F21: note edit (inline textarea) + delete on timeline rows ──────
document.addEventListener('click', async function (ev) {
  var edit = ev.target.closest && ev.target.closest('[data-jd-edit-note]');
  if (edit) {
    ev.preventDefault(); ev.stopPropagation();
    var noteId = edit.getAttribute('data-jd-edit-note');
    if (!noteId) return;
    var item = edit.closest('.tl-item');
    var textEl = item && item.querySelector('.tl-text-text');
    if (!textEl || textEl.__editing) return;
    textEl.__editing = true;
    var current = textEl.textContent || '';
    var ta = document.createElement('textarea');
    ta.value = current;
    ta.style.cssText = 'width:100%;border:1px solid #cfd4da;border-radius:6px;padding:6px;font-size:13px;font-family:inherit;box-sizing:border-box;';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;gap:8px;margin-top:8px;';
    var saveB = document.createElement('button');
    saveB.type = 'button'; saveB.className = 'btn btn-primary btn-sm'; saveB.textContent = 'Save';
    var cancelB = document.createElement('button');
    cancelB.type = 'button'; cancelB.className = 'btn btn-secondary btn-sm'; cancelB.textContent = 'Cancel';
    bar.appendChild(saveB); bar.appendChild(cancelB);
    textEl.style.display = 'none';
    textEl.parentNode.insertBefore(ta, textEl.nextSibling);
    ta.parentNode.insertBefore(bar, ta.nextSibling);
    ta.focus();
    function cleanup() { ta.remove(); bar.remove(); textEl.style.display = ''; textEl.__editing = false; }
    cancelB.addEventListener('click', function (e) { e.preventDefault(); cleanup(); });
    saveB.addEventListener('click', async function (e) {
      e.preventDefault();
      var content = ta.value;
      await safe('Edit note', async function () {
        var r = await comm.action('jobDetail.edit-note', { noteId: noteId, content: content });
        if (r && r.ok === false) { flash(r.error || 'Edit failed', 'bad'); return; }
        flash('Note updated');
      });
    });
    return;
  }
  var del = ev.target.closest && ev.target.closest('[data-jd-del-note]');
  if (del) {
    ev.preventDefault(); ev.stopPropagation();
    var nid = del.getAttribute('data-jd-del-note');
    if (!nid) return;
    if (!window.confirm('Delete this note?')) return;
    await safe('Delete note', async function () {
      var r = await comm.action('jobDetail.delete-note', { noteId: nid });
      if (r && r.ok === false) { flash(r.error || 'Delete failed', 'bad'); return; }
      flash('Note deleted');
    });
    return;
  }
});

// ── 27) F26: communication pin + reassign on timeline rows ─────────────
document.addEventListener('click', async function (ev) {
  var pin = ev.target.closest && ev.target.closest('[data-jd-pin-comm]');
  if (pin) {
    ev.preventDefault(); ev.stopPropagation();
    var commId = pin.getAttribute('data-jd-pin-comm');
    if (!commId) return;
    await safe('Pin communication', async function () {
      var r = await comm.action('jobDetail.pin-comm', { commId: commId });
      if (r && r.ok === false) { flash(r.error || 'Pin failed', 'bad'); return; }
      var nowPinned = pin.classList.toggle('pinned');
      var row = pin.closest('.tl-item');
      if (row) row.classList.toggle('pinned', nowPinned);
      setItemPinned('comm', commId, nowPinned);
      refreshPinned();
      flash('Communication pin toggled');
    });
    return;
  }
  var re = ev.target.closest && ev.target.closest('[data-jd-reassign]');
  if (re) {
    ev.preventDefault(); ev.stopPropagation();
    var cid = re.getAttribute('data-jd-reassign');
    if (!cid) return;
    var modal = document.getElementById('reassignCommModal');
    var listEl = document.getElementById('reassignCommList');
    var emptyEl = document.getElementById('reassignCommEmpty');
    var saveBtn = document.getElementById('reassignCommSaveBtn');
    if (!modal || !listEl) return;
    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
    if (emptyEl) emptyEl.style.display = 'none';
    var selected = null;
    try { window.S1.modal.open('#reassignCommModal'); } catch (_) {}
    await safe('Reassign candidates', async function () {
      var r = await comm.action('jobDetail.reassign-candidates', { commId: cid });
      var cands = (r && r.candidates) || [];
      if (!cands.length) { if (emptyEl) emptyEl.style.display = ''; return; }
      cands.forEach(function (c) {
        var row = document.createElement('label');
        row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;border:1px solid #eee;border-radius:6px;padding:7px 9px;font-size:12px;cursor:pointer;gap:8px;';
        var left = document.createElement('span');
        left.style.cssText = 'display:flex;align-items:center;gap:6px;';
        var radio = document.createElement('input');
        radio.type = 'radio'; radio.name = 'reassignJob'; radio.value = String(c.jobId);
        radio.addEventListener('change', function () { selected = c.jobId; });
        left.appendChild(radio);
        var lbl = document.createElement('span');
        lbl.textContent = '#' + (c.jobNumber || c.jobId) + ' · ' + (c.customerName || '');
        left.appendChild(lbl);
        var contact = document.createElement('span');
        contact.style.color = 'var(--ink-3,#777)';
        contact.textContent = c.customerContact || '';
        row.appendChild(left); row.appendChild(contact);
        listEl.appendChild(row);
      });
    });
    if (saveBtn && !saveBtn.__wired) {
      saveBtn.__wired = true;
      saveBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        if (!selected) { flash('Select a job first', 'bad'); return; }
        await safe('Reassign communication', async function () {
          var r = await comm.action('jobDetail.reassign-comm', { commId: cid, targetJobId: selected });
          if (r && r.ok === false) { flash(r.error || 'Reassign failed', 'bad'); return; }
          try { window.S1.modal.close('#reassignCommModal'); } catch (_) {}
          flash('Communication reassigned');
        });
      });
    }
    return;
  }
});

// ── 28) F22: per-file actions (download / rename / delete / replace) ────
(function () {
  var replaceInput = document.getElementById('jdReplaceFileInput');
  var pendingReplaceId = null;

  function fileIdOf(btn) {
    var holder = btn.closest('[data-file-id]');
    return holder ? holder.getAttribute('data-file-id') : null;
  }
  function fileNameOf(btn) {
    var card = btn.closest('.file');
    var nameEl = card && card.querySelector('.file-name');
    return nameEl ? (nameEl.textContent || '') : '';
  }

  document.addEventListener('click', async function (ev) {
    var btn = ev.target.closest && ev.target.closest('[data-file-act]');
    if (!btn) return;
    ev.preventDefault(); ev.stopPropagation();
    var act = btn.getAttribute('data-file-act');
    var fileId = fileIdOf(btn);
    if (!fileId) { flash('Missing file id', 'bad'); return; }

    if (act === 'download') {
      await safe('Download file', async function () {
        var r = await comm.action('jobDetail.download-file', { fileId: fileId });
        if (r && r.ok === false) { flash(r.error || 'Download failed', 'bad'); return; }
        var b64 = r && r.dataBase64 || '';
        var bin = atob(b64);
        var len = bin.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
        var blob = new Blob([bytes], { type: (r && r.contentType) || 'application/octet-stream' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = (r && r.name) || 'download';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      });
      return;
    }

    if (act === 'rename') {
      var modal = document.getElementById('renameFileModal');
      var nameInput = document.getElementById('renameFileInput');
      var saveBtn = document.getElementById('renameFileSaveBtn');
      if (!modal || !nameInput) return;
      nameInput.value = fileNameOf(btn);
      try { window.S1.modal.open('#renameFileModal'); } catch (_) {}
      nameInput.focus();
      if (saveBtn && !saveBtn.__wired) {
        saveBtn.__wired = true;
        saveBtn.__fileId = fileId;
        saveBtn.addEventListener('click', async function (e) {
          e.preventDefault();
          var newName = nameInput.value.trim();
          if (!newName) { flash('Enter a file name', 'bad'); return; }
          await safe('Rename file', async function () {
            var r = await comm.action('jobDetail.rename-file', { fileId: saveBtn.__fileId, newName: newName });
            if (r && r.ok === false) { flash(r.error || 'Rename failed', 'bad'); return; }
            try { window.S1.modal.close('#renameFileModal'); } catch (_) {}
            flash('File renamed');
          });
        });
      }
      if (saveBtn) saveBtn.__fileId = fileId;
      return;
    }

    if (act === 'delete') {
      if (!window.confirm('Delete this file?')) return;
      await safe('Delete file', async function () {
        var r = await comm.action('jobDetail.delete-file', { fileId: fileId });
        if (r && r.ok === false) { flash(r.error || 'Delete failed', 'bad'); return; }
        flash('File deleted');
      });
      return;
    }

    if (act === 'replace') {
      if (!replaceInput) return;
      pendingReplaceId = fileId;
      replaceInput.value = '';
      replaceInput.click();
      return;
    }
  });

  if (replaceInput) replaceInput.addEventListener('change', function () {
    var file = replaceInput.files && replaceInput.files[0];
    var fileId = pendingReplaceId;
    pendingReplaceId = null;
    if (!file || !fileId) return;
    var reader = new FileReader();
    reader.onload = async function () {
      await safe('Replace file', async function () {
        var r = await comm.action('jobDetail.replace-file', {
          fileId: fileId, dataUrl: reader.result, name: file.name, type: file.type || 'application/octet-stream'
        });
        if (r && r.ok === false) { flash(r.error || 'Replace failed', 'bad'); return; }
        flash('File replaced');
      });
    };
    reader.readAsDataURL(file);
  });
})();

// ── #1547: photo thumbnails + click-to-enlarge lightbox ─────────────────────
// (a) After each render, hide any <img> with no/empty src so the gradient shows
//     through; an onerror handler hides images that fail to decode (no broken
//     icon). (b) Clicking a photo thumb opens a full-screen lightbox served by
//     jobDetail.file-preview (HEIC transcoded server-side), with ‹ › / Esc nav.
//     All DOM built via createElement/attributes — no innerHTML (CLAUDE rule 2).
(function () {
  // Per-tab backfill cache so we never re-fetch the same attachment in a
  // single page session, even if normalizeThumbs runs again after a re-render.
  var backfillAttempted = new Set();

  async function backfillThumb(fileId, img) {
    if (!fileId || backfillAttempted.has(fileId)) return;
    backfillAttempted.add(fileId);
    if (!window.S1 || !window.S1.imageThumb) return;
    try {
      var r = await comm.action('jobDetail.file-preview', { fileId: fileId });
      if (!r || r.ok === false || !r.dataBase64) return;
      var bin = atob(r.dataBase64);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      var blob = new Blob([bytes], { type: r.contentType || 'application/octet-stream' });
      var dataUrl = await window.S1.imageThumb.thumbnailDataUrl(blob, 320);
      if (!dataUrl) return;
      img.setAttribute('src', dataUrl);
      img.style.display = '';
      // Persist so the next page load serves the cached thumbnail inline and
      // skips this whole round-trip. Fire-and-forget — UI already updated.
      try { comm.action('jobDetail.cache-thumbnail', { fileId: fileId, thumbnailDataUrl: dataUrl }); }
      catch (_) {}
    } catch (_) { /* leave gradient placeholder */ }
  }

  function normalizeThumbs() {
    $$('.file-thumb-img').forEach(function (img) {
      var src = img.getAttribute('src') || '';
      if (!img.__jdWired) {
        img.__jdWired = true;
        img.addEventListener('error', function () { img.style.display = 'none'; });
      }
      if (!src) {
        img.removeAttribute('src');
        img.style.display = 'none';
        // Server-side has no image decoder anymore, so attachments that came in
        // via MMS / inbound email arrive without a thumbnail. Fetch the full
        // bytes once, canvas-resize, render, and POST the result back to cache.
        var thumb = img.closest && img.closest('.file-thumb');
        var fileId = thumb && thumb.getAttribute('data-file-id');
        if (fileId) backfillThumb(fileId, img);
        return;
      }
      img.style.display = '';
    });
  }
  document.addEventListener('s1ui:ready', function (e) {
    if (e && e.detail && e.detail.module && e.detail.module !== 'jobDetail') return;
    normalizeThumbs();
  });

  // Lightbox state
  var lb = document.getElementById('jdPhotoLightbox');
  var lbImg = document.getElementById('jdLightboxImg');
  var lbCap = document.getElementById('jdLightboxCaption');
  var lbPrev = document.getElementById('jdLightboxPrev');
  var lbNext = document.getElementById('jdLightboxNext');
  var lbClose = document.getElementById('jdLightboxClose');
  var photoIds = [];
  var curIndex = -1;
  var curUrl = null;

  function revoke() {
    if (curUrl) { try { URL.revokeObjectURL(curUrl); } catch (_) {} curUrl = null; }
  }

  async function showAt(index) {
    if (!lb || index < 0 || index >= photoIds.length) return;
    curIndex = index;
    var fileId = photoIds[index];
    await safe('Preview photo', async function () {
      var r = await comm.action('jobDetail.file-preview', { fileId: fileId });
      if (!r || r.ok === false) { flash((r && r.error) || 'Preview failed', 'bad'); return; }
      var b64 = r.dataBase64 || '';
      var bin = atob(b64);
      var len = bin.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
      var blob = new Blob([bytes], { type: r.contentType || 'image/jpeg' });
      // HEIC arrives as raw bytes — transcode in the browser via heic2any so
      // non-Safari engines can render it. Non-HEIC blobs pass through.
      if (window.S1 && window.S1.imageThumb) {
        try { blob = await window.S1.imageThumb.toDisplayableBlob(blob); } catch (_) {}
      }
      revoke();
      curUrl = URL.createObjectURL(blob);
      lbImg.setAttribute('src', curUrl);
      lbImg.setAttribute('alt', r.name || '');
      lbCap.textContent = (r.name || '') + (photoIds.length > 1 ? '  ·  ' + (index + 1) + ' of ' + photoIds.length : '');
      var multi = photoIds.length > 1;
      lbPrev.hidden = !multi;
      lbNext.hidden = !multi;
    });
  }

  function openLightbox(fileId) {
    // collect current photo order from the grid
    photoIds = $$('.file-thumb[data-preview]').map(function (el) {
      return el.getAttribute('data-file-id');
    }).filter(Boolean);
    var idx = photoIds.indexOf(String(fileId));
    if (idx < 0) idx = 0;
    if (lb) lb.classList.add('open');
    showAt(idx);
  }

  function closeLightbox() {
    if (lb) lb.classList.remove('open');
    revoke();
    if (lbImg) lbImg.removeAttribute('src');
    curIndex = -1;
  }

  // Click a photo thumbnail → open the lightbox.
  document.addEventListener('click', function (ev) {
    var thumb = ev.target.closest && ev.target.closest('.file-thumb[data-preview]');
    if (!thumb) return;
    ev.preventDefault(); ev.stopPropagation();
    var fileId = thumb.getAttribute('data-file-id');
    if (fileId) openLightbox(fileId);
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lb) lb.addEventListener('click', function (ev) {
    // backdrop click (not on the image or controls) closes
    if (ev.target === lb) closeLightbox();
  });
  if (lbPrev) lbPrev.addEventListener('click', function (ev) {
    ev.stopPropagation();
    if (photoIds.length) showAt((curIndex - 1 + photoIds.length) % photoIds.length);
  });
  if (lbNext) lbNext.addEventListener('click', function (ev) {
    ev.stopPropagation();
    if (photoIds.length) showAt((curIndex + 1) % photoIds.length);
  });
  document.addEventListener('keydown', function (ev) {
    if (!lb || !lb.classList.contains('open')) return;
    if (ev.key === 'Escape') closeLightbox();
    else if (ev.key === 'ArrowLeft' && photoIds.length) showAt((curIndex - 1 + photoIds.length) % photoIds.length);
    else if (ev.key === 'ArrowRight' && photoIds.length) showAt((curIndex + 1) % photoIds.length);
  });

  // Run once on initial load too (in case s1ui:ready already fired).
  normalizeThumbs();
})();

// ── #1382: Finalize "Final charges" modal controller ───────────────────────
// Ports the old JobDetail.cshtml finalize flow into the S1 iframe: a
// Duration / Start-&-end-time toggle, a custom-billing override table, a
// revenue breakdown with live total, and pre-fill / already-finalized state.
// Rows are built with createElement/textContent only (CLAUDE rule 2).
(function () {
  var modal = document.getElementById('finalizeModal');
  if (!modal) return;

  var REVCATS = ['Labor', 'Travel', 'Materials', 'Equipment', 'Supplies', 'Packing', 'Storage', 'Disposal', 'Discount', 'Other'];
  var _mode = 'duration';
  var _override = false;

  function $(id) { return document.getElementById(id); }
  function finState() { return (((window.S1.fixtures || {}).jobDetail) || {}).finalize || {}; }
  function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }

  function opt(sel, val, label) { var o = document.createElement('option'); o.value = String(val); o.textContent = label; sel.appendChild(o); }
  function fillSelect(sel, maxH, isMinutes) {
    if (!sel) return;
    while (sel.firstChild) sel.removeChild(sel.firstChild);
    if (isMinutes) { [0, 15, 30, 45].forEach(function (m) { opt(sel, m, m + 'm'); }); }
    else { for (var h = 0; h <= maxH; h++) opt(sel, h, h + 'h'); }
  }
  fillSelect($('finLabourH'), 24, false); fillSelect($('finLabourM'), 0, true);
  fillSelect($('finTravelH'), 12, false); fillSelect($('finTravelM'), 0, true);
  fillSelect($('finBreaksH'), 8, false);  fillSelect($('finBreaksM'), 0, true);
  fillSelect($('finBreaksH2'), 8, false); fillSelect($('finBreaksM2'), 0, true);

  function setHM(hSel, mSel, hours) {
    if (!hSel || !mSel) return;
    var total = Math.max(0, Math.round(hours * 60));
    var h = Math.floor(total / 60), m = Math.round((total % 60) / 15) * 15;
    if (m === 60) { h += 1; m = 0; }
    var maxOpt = parseInt(hSel.options[hSel.options.length - 1].value, 10) || 0;
    hSel.value = String(Math.min(h, maxOpt));
    mSel.value = String(m);
  }

  // ── mode toggle ──
  function setMode(mode) {
    _mode = mode;
    var dur = $('finModeDuration'), se = $('finModeStartEnd');
    if (dur) { dur.style.background = mode === 'duration' ? 'var(--accent,#004D40)' : '#fff'; dur.style.color = mode === 'duration' ? '#fff' : 'var(--accent,#004D40)'; }
    if (se) { se.style.background = mode === 'startend' ? 'var(--accent,#004D40)' : '#fff'; se.style.color = mode === 'startend' ? '#fff' : 'var(--accent,#004D40)'; }
    var df = $('finDurationFields'), sf = $('finStartEndFields');
    if (df) df.style.display = mode === 'duration' ? 'grid' : 'none';
    if (sf) sf.style.display = mode === 'startend' ? '' : 'none';
    updateTotal();
  }
  if ($('finModeDuration')) $('finModeDuration').addEventListener('click', function () { setMode('duration'); });
  if ($('finModeStartEnd')) $('finModeStartEnd').addEventListener('click', function () { setMode('startend'); });

  // ── billable / travel / break minutes ──
  function billableMinutes() {
    if (_mode === 'duration') {
      var lab = num($('finLabourH').value) * 60 + num($('finLabourM').value);
      var tra = num($('finTravelH').value) * 60 + num($('finTravelM').value);
      var brk = num($('finBreaksH').value) * 60 + num($('finBreaksM').value);
      return Math.max(0, lab + tra - brk);
    }
    var s = $('finStartTime').value, e = $('finEndTime').value;
    if (!s || !e) return 0;
    var sp = s.split(':'), ep = e.split(':');
    var sm = num(sp[0]) * 60 + num(sp[1]), em = num(ep[0]) * 60 + num(ep[1]);
    if (em < sm) em += 24 * 60;
    var brk2 = num($('finBreaksH2').value) * 60 + num($('finBreaksM2').value);
    return Math.max(0, em - sm - brk2);
  }
  function travelMinutes() { return _mode === 'duration' ? num($('finTravelH').value) * 60 + num($('finTravelM').value) : 0; }
  function breakMinutes() {
    return _mode === 'duration'
      ? num($('finBreaksH').value) * 60 + num($('finBreaksM').value)
      : num($('finBreaksH2').value) * 60 + num($('finBreaksM2').value);
  }

  function updateTotal() {
    var t = billableMinutes();
    var h = Math.floor(t / 60), m = t % 60;
    var d = $('finTotalDisplay');
    if (d) d.textContent = h + ' hour' + (h !== 1 ? 's' : '') + ' ' + m + ' minute' + (m !== 1 ? 's' : '');
    updateLiveTotal();
  }
  ['finLabourH', 'finLabourM', 'finTravelH', 'finTravelM', 'finBreaksH', 'finBreaksM', 'finBreaksH2', 'finBreaksM2', 'finStartTime', 'finEndTime'].forEach(function (id) {
    var el = $(id); if (el) el.addEventListener('change', updateTotal);
  });
  if ($('finRateInput')) $('finRateInput').addEventListener('input', updateLiveTotal);

  // ── custom-billing override ──
  if ($('finOverrideCheck')) $('finOverrideCheck').addEventListener('change', function () {
    _override = this.checked;
    var f = $('finOverrideFields'); if (f) f.style.display = _override ? '' : 'none';
    if (_override && $('finCustomRows') && !$('finCustomRows').children.length) addCustomRow();
  });
  function recalcCustomRow(row) {
    var amt = num(row.querySelector('.fin-cust-amt').value);
    var qty = num(row.querySelector('.fin-cust-qty').value);
    var tot = row.querySelector('.fin-cust-tot');
    if (tot) tot.textContent = '$' + (amt * (qty || 1)).toFixed(2);
  }
  function addCustomRow() {
    var tbody = $('finCustomRows'); if (!tbody) return;
    var tr = document.createElement('tr');
    function cell(input) { var td = document.createElement('td'); td.appendChild(input); return td; }
    var name = document.createElement('input'); name.type = 'text'; name.className = 'jd-input fin-cust-name'; name.placeholder = 'Item name';
    var amt = document.createElement('input'); amt.type = 'number'; amt.step = '0.01'; amt.className = 'jd-input fin-cust-amt'; amt.placeholder = '0.00';
    var qty = document.createElement('input'); qty.type = 'number'; qty.step = '1'; qty.className = 'jd-input fin-cust-qty'; qty.placeholder = '1';
    var tot = document.createElement('td'); tot.className = 'num fin-cust-tot';
    amt.addEventListener('input', function () { recalcCustomRow(tr); });
    qty.addEventListener('input', function () { recalcCustomRow(tr); });
    tr.appendChild(cell(name)); tr.appendChild(cell(amt)); tr.appendChild(cell(qty)); tr.appendChild(tot);
    tbody.appendChild(tr);
  }
  if ($('finAddCustomRow')) $('finAddCustomRow').addEventListener('click', addCustomRow);

  // ── revenue breakdown rows ──
  function addRevCatRow(category, amount, tax) {
    var c = $('finRevCatContainer'); if (!c) return;
    var row = document.createElement('div');
    row.className = 'fin-revcat-row';
    row.style.cssText = 'display:grid;grid-template-columns:2fr 1fr 1fr 28px;gap:8px;align-items:end;margin-bottom:8px;';
    var catWrap = document.createElement('div');
    var lblC = document.createElement('label'); lblC.className = 'jd-label'; lblC.textContent = 'Category';
    var sel = document.createElement('select'); sel.className = 'jd-input fin-revcat-name';
    REVCATS.forEach(function (cat) { var o = document.createElement('option'); o.value = cat; o.textContent = cat; if (cat === category) o.selected = true; sel.appendChild(o); });
    catWrap.appendChild(lblC); catWrap.appendChild(sel);
    var amtWrap = document.createElement('div');
    var lblA = document.createElement('label'); lblA.className = 'jd-label'; lblA.textContent = 'Amount ($)';
    var amt = document.createElement('input'); amt.type = 'number'; amt.step = '0.01'; amt.className = 'jd-input fin-revcat-amount'; amt.placeholder = '0.00';
    var auto = (category === 'Labor' || category === 'Travel' || category === 'Discount');
    if (category === 'Labor') { amt.readOnly = true; amt.dataset.laborRow = 'true'; amt.style.background = '#e8f5e9'; amt.style.fontWeight = '600'; }
    else if (category === 'Travel') { amt.readOnly = true; amt.dataset.travelRow = 'true'; amt.style.background = '#e3f2fd'; amt.style.fontWeight = '600'; }
    else if (category === 'Discount') { amt.readOnly = true; amt.dataset.discountRow = 'true'; amt.style.background = '#ffebee'; amt.style.fontWeight = '600'; }
    if (amount && !isNaN(amount)) amt.value = Number(amount).toFixed(2);
    amt.addEventListener('input', function () { updateRevCatTotals(); updateLiveTotal(); });
    amtWrap.appendChild(lblA); amtWrap.appendChild(amt);
    var taxWrap = document.createElement('div');
    var lblT = document.createElement('label'); lblT.className = 'jd-label'; lblT.textContent = 'Tax ($)';
    var tx = document.createElement('input'); tx.type = 'number'; tx.step = '0.01'; tx.className = 'jd-input fin-revcat-tax'; tx.placeholder = '0.00';
    if (tax && tax > 0) tx.value = Number(tax).toFixed(2);
    tx.addEventListener('input', function () { updateRevCatTotals(); updateLiveTotal(); });
    taxWrap.appendChild(lblT); taxWrap.appendChild(tx);
    var del = document.createElement('div');
    if (!auto) {
      var btn = document.createElement('button'); btn.type = 'button'; btn.textContent = '×';
      btn.style.cssText = 'background:none;border:none;cursor:pointer;color:#9ca3af;font-size:18px;padding:6px;';
      btn.addEventListener('click', function () { row.remove(); updateRevCatTotals(); updateLiveTotal(); });
      del.appendChild(btn);
    }
    row.appendChild(catWrap); row.appendChild(amtWrap); row.appendChild(taxWrap); row.appendChild(del);
    c.appendChild(row);
  }
  if ($('finAddRevCatRow')) $('finAddRevCatRow').addEventListener('click', function () { addRevCatRow('Other', 0, 0); updateRevCatTotals(); });

  function updateRevCatTotals() {
    var sub = 0, tax = 0;
    modal.querySelectorAll('.fin-revcat-amount').forEach(function (el) { sub += num(el.value); });
    modal.querySelectorAll('.fin-revcat-tax').forEach(function (el) { tax += num(el.value); });
    if ($('finRevCatSubtotal')) $('finRevCatSubtotal').textContent = sub.toFixed(2);
    if ($('finRevCatTaxTotal')) $('finRevCatTaxTotal').textContent = tax.toFixed(2);
    if ($('finRevCatGrandTotal')) $('finRevCatGrandTotal').textContent = (sub + tax).toFixed(2);
  }

  function setRow(el, left, right) {
    if (!el) return;
    el.textContent = '';
    var l = document.createElement('span'); l.textContent = left;
    var r = document.createElement('span'); r.textContent = right;
    el.appendChild(l); el.appendChild(r); el.style.display = '';
  }
  function hideRow(el) { if (el) el.style.display = 'none'; }

  function updateLiveTotal() {
    var billable = billableMinutes() / 60;
    var hourly = num($('finRateInput').value);
    var travelH = travelMinutes() / 60, breakH = breakMinutes() / 60;
    var labourH = Math.max(0, billable - travelH);
    var laborAmt = labourH * hourly, travelAmt = travelH * hourly;
    var laborInput = modal.querySelector('[data-labor-row="true"]'); if (laborInput) laborInput.value = laborAmt > 0 ? laborAmt.toFixed(2) : '';
    var travelInput = modal.querySelector('[data-travel-row="true"]'); if (travelInput) travelInput.value = travelAmt > 0 ? travelAmt.toFixed(2) : '';
    var otherTotal = 0, discountTotal = 0;
    modal.querySelectorAll('.fin-revcat-row').forEach(function (r) {
      var a = r.querySelector('.fin-revcat-amount'); if (!a) return;
      if (a.dataset.laborRow || a.dataset.travelRow) return;
      var v = num(a.value);
      if (a.dataset.discountRow) { discountTotal += v; return; }
      otherTotal += v;
    });
    var subtotal = laborAmt + travelAmt + otherTotal + discountTotal;
    var taxRate = num(finState().taxRatePercent);
    var taxable = laborAmt + travelAmt + otherTotal;
    var taxAmount = Math.max(0, taxable) * taxRate / 100;
    // Auto-fill per-row tax proportionally across positive taxable rows.
    modal.querySelectorAll('.fin-revcat-row').forEach(function (r) {
      var a = r.querySelector('.fin-revcat-amount'), t = r.querySelector('.fin-revcat-tax'); if (!a || !t) return;
      if (a.dataset.discountRow) { t.value = ''; return; }
      if (taxable > 0) { var ra = num(a.value); if (ra <= 0) { t.value = ''; return; } var rt = (ra / taxable) * taxAmount; t.value = rt > 0 ? rt.toFixed(2) : ''; }
    });
    updateRevCatTotals();
    modal.dataset.clientSubtotal = subtotal.toFixed(2);
    modal.dataset.clientTaxTotal = taxAmount.toFixed(2);
    var box = $('finLiveTotalBox'); if (!box) return;
    if (subtotal !== 0 || laborAmt > 0 || travelAmt > 0) {
      box.style.display = '';
      setRow($('finSummaryLabor'), 'Labor: ' + labourH.toFixed(2) + ' hrs × $' + hourly.toFixed(2) + '/hr', '$' + laborAmt.toFixed(2));
      if (travelH > 0) setRow($('finSummaryTravel'), 'Travel: ' + travelH.toFixed(2) + ' hrs × $' + hourly.toFixed(2) + '/hr', '$' + travelAmt.toFixed(2)); else hideRow($('finSummaryTravel'));
      if (breakH > 0) setRow($('finSummaryBreaks'), 'Breaks deducted: ' + breakH.toFixed(2) + ' hrs', ''); else hideRow($('finSummaryBreaks'));
      if (discountTotal !== 0) setRow($('finSummaryDiscount'), 'Discount', '$' + discountTotal.toFixed(2)); else hideRow($('finSummaryDiscount'));
      if (otherTotal > 0) setRow($('finSummaryOther'), 'Other categories', '$' + otherTotal.toFixed(2)); else hideRow($('finSummaryOther'));
      setRow($('finSummarySubtotal'), 'Subtotal', '$' + subtotal.toFixed(2));
      setRow($('finSummaryTax'), 'Tax', '$' + taxAmount.toFixed(2));
      setRow($('finSummaryTotal'), 'Total', '$' + (subtotal + taxAmount).toFixed(2));
    } else { box.style.display = 'none'; }
  }

  // ── seed the modal from server state each time it opens ──
  function seed() {
    var s = finState();
    if ($('finRateInput')) $('finRateInput').value = num(s.defaultActualRate) ? num(s.defaultActualRate).toFixed(2) : '';
    if ($('finNotesInput')) $('finNotesInput').value = s.defaultNotes || '';
    var travelH = num(s.defaultTravelHours), breakH = num(s.defaultBreakHours), billable = num(s.defaultBillableHours);
    var labourH = Math.max(0, billable - travelH + breakH);
    setMode('duration');
    setHM($('finLabourH'), $('finLabourM'), labourH);
    setHM($('finTravelH'), $('finTravelM'), travelH);
    setHM($('finBreaksH'), $('finBreaksM'), breakH);
    var c = $('finRevCatContainer'); if (c) { while (c.firstChild) c.removeChild(c.firstChild); }
    var seedRows = s.revCatSeed || [];
    if (seedRows.length) seedRows.forEach(function (r) { addRevCatRow(r.name, num(r.amount), num(r.tax)); });
    else { addRevCatRow('Labor', 0, 0); addRevCatRow('Travel', 0, 0); }
    var cr = $('finCustomRows'); if (cr) { while (cr.firstChild) cr.removeChild(cr.firstChild); }
    if ($('finOverrideCheck')) $('finOverrideCheck').checked = false;
    _override = false;
    var of = $('finOverrideFields'); if (of) of.style.display = 'none';
    var finalized = !!s.isFinalized;
    var banner = $('finFinalizedBanner'); if (banner) banner.style.display = finalized ? '' : 'none';
    if (finalized) {
      var pill = $('finClosedPill'); if (pill) pill.textContent = ((s.status || 'Closed') + ' · ' + (s.closedReason || 'Completed')).toUpperCase();
      var line = $('finFinalizedLine');
      if (line) {
        var by = s.finalizedByName ? (' by ' + s.finalizedByName) : '';
        var at = s.finalizedAtLabel ? (' on ' + s.finalizedAtLabel) : '';
        line.textContent = 'Finalized' + by + at + '.';
      }
    }
    if ($('finFinalizeBtn')) $('finFinalizeBtn').style.display = finalized ? 'none' : '';
    if ($('finResyncBtn')) $('finResyncBtn').style.display = finalized ? '' : 'none';
    updateTotal();
  }

  // ── gather the payload the backend's FinalizeData expects ──
  function gather() {
    updateLiveTotal();
    var billable = billableMinutes() / 60;
    var names = [], amts = [], taxes = [];
    modal.querySelectorAll('.fin-revcat-row').forEach(function (r) {
      var n = r.querySelector('.fin-revcat-name'), a = r.querySelector('.fin-revcat-amount'), t = r.querySelector('.fin-revcat-tax');
      if (!n || !a) return;
      var amt = num(a.value), tax = num(t ? t.value : 0);
      if (amt === 0 && tax === 0) return;
      names.push(n.value); amts.push(amt); taxes.push(tax);
    });
    if (_override) {
      modal.querySelectorAll('#finCustomRows tr').forEach(function (r) {
        var nm = r.querySelector('.fin-cust-name'), am = r.querySelector('.fin-cust-amt'), q = r.querySelector('.fin-cust-qty');
        var amount = num(am && am.value) * (num(q && q.value) || 1);
        if (amount > 0) { names.push((nm && nm.value) || 'Other'); amts.push(amount); taxes.push(0); }
      });
    }
    var p = {
      billableHours: billable.toFixed(3),
      travelHours: (travelMinutes() / 60).toFixed(3),
      breakHours: (breakMinutes() / 60).toFixed(3),
      actualRate: $('finRateInput').value || '',
      notes: $('finNotesInput').value || '',
      revCatNames: names, revCatAmounts: amts, revCatTaxes: taxes,
      clientSubtotal: modal.dataset.clientSubtotal || '',
      clientTaxTotal: modal.dataset.clientTaxTotal || ''
    };
    if (_mode === 'startend') {
      if ($('finStartTime').value) p.billableStartTime = $('finStartTime').value + ':00';
      if ($('finEndTime').value) p.billableEndTime = $('finEndTime').value + ':00';
    }
    var discRow = modal.querySelector('[data-discount-row="true"]');
    if (discRow) { var d = Math.abs(num(discRow.value)); if (d > 0) p.discountAmount = d; }
    return p;
  }

  window.__finalizeCtl = { seed: seed, gather: gather };

  // Seed whenever a Finalize trigger opens the modal.
  Array.prototype.forEach.call(document.querySelectorAll('[data-jd-open="finalizeModal"]'), function (b) {
    b.addEventListener('click', function () { setTimeout(seed, 0); });
  });
})();

// ── #1536: state-aware Finalize toolbar buttons ───────────────────────────
// The "Job financials" header action button was static HTML, so it kept
// reading "✓ Finalize Job" even after the job had been finalized (the bug the
// reporter screenshotted: revenue says "Finalized" but the button doesn't).
// This controller reads finalize.isFinalized from the pushed state and flips
// the toolbar: when finalized it shows "✓ Finalized" plus a "↺ Reset" button
// that undoes the finalize (job.unfinalize — unlocks charges, reverses the
// synced P&L + auto-payroll) so a mistake can be corrected and re-finalized.
// The drastic full job.reset stays in the "Job actions ▾" menu, untouched.
(function () {
  var finalizeBtn  = document.getElementById('jdFinalizeBtn');
  var finalizedBtn = document.getElementById('jdFinalizedBtn');
  var resetBtn     = document.getElementById('jdResetFinalizeBtn');
  if (!finalizeBtn && !finalizedBtn && !resetBtn) return;

  function reloadHost() {
    try { window.top.location.reload(); }
    catch (_) { window.location.reload(); }
  }

  function applyState() {
    var fin = (((window.S1.fixtures || {}).jobDetail) || {}).finalize || {};
    var isFinalized = !!fin.isFinalized;
    if (finalizeBtn)  finalizeBtn.style.display  = isFinalized ? 'none' : '';
    if (finalizedBtn) finalizedBtn.style.display = isFinalized ? '' : 'none';
    if (resetBtn)     resetBtn.style.display     = isFinalized ? '' : 'none';
  }
  applyState();

  if (resetBtn && !resetBtn.__s1Wired) {
    resetBtn.__s1Wired = true;
    resetBtn.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (!window.confirm('Reset finalization? This unlocks charges and reverses the synced P&L and auto-payroll so you can correct and re-finalize.')) return;
      safe('Reset finalization', async function () {
        var r = await comm.action('job.unfinalize', {});
        if (r && r.ok === false) { flash(r.error || 'Reset failed', 'bad'); return; }
        flash('Finalization reset');
        reloadHost();
      });
    });
  }
})();

// v12: open & wire all JobDetail modals.
(function () {
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  $$('[data-jd-open]').forEach(b => {
    b.addEventListener('click', (ev) => {
      ev.preventDefault();
      window.S1.modal.open('#' + b.getAttribute('data-jd-open'));
    });
  });
  const jobId = () => ((window.S1.fixtures || {}).jobDetail && window.S1.fixtures.jobDetail.deal && window.S1.fixtures.jobDetail.deal.id) || '';
  const bindings = [
    // #1382: emit the full billing payload the rebuilt "Final charges" modal computes.
    ['#finalizeModal',          'job.finalize', {
      transform: function (p, el) { return (window.__finalizeCtl && window.__finalizeCtl.gather()) || p; },
      validate: function (p) {
        var hasTime = Number(p.billableHours) > 0;
        var hasAmt = Array.isArray(p.revCatAmounts) && p.revCatAmounts.some(function (a) { return Number(a) > 0; });
        if (!hasTime && !hasAmt) return 'Enter billable time or a revenue amount before finalizing';
        return null;
      },
      successMsg: 'Job finalized',
      // #1536: the default onSuccess only re-renders from CACHED fixtures, so
      // finalize.isFinalized stays stale and the header button wouldn't flip to
      // "✓ Finalized". Reload to force a fresh server state push (button, KPI
      // "Finalized" footer, and locked charges all reconcile together).
      onSuccess: function () {
        try { window.top.location.reload(); }
        catch (_) { window.location.reload(); }
      }
    }],
    ['#addStopModal',           'job.stop.add', {
      transform: function (p) {
        if (!p.stopType) p.stopType = 'Pickup';
        p.sequence = Number(p.sequence) || 1;
        p.squareFootage = p.squareFootage ? Number(p.squareFootage) : null;
        p.stairs = Number(p.stairs) || 0;
        return p;
      },
      validate: function (p) {
        if (!p.address) return 'Address is required';
        return null;
      },
      successMsg: 'Stop added'
    }],
    // #1423: edit an existing location (hidden id carries the JobLocation row).
    ['#editStopModal',          'jobDetail.edit-stop', {
      transform: function (p) {
        p.squareFootage = p.squareFootage ? Number(p.squareFootage) : null;
        return p;
      },
      validate: function (p) {
        if (!p.id) return 'Missing location id';
        if (!p.address) return 'Address is required';
        return null;
      },
      successMsg: 'Address updated'
    }],
    ['#addWagesModal',          'job.wages.add',          {}],
    ['#addChargeModal',         'job.charge.add', {
      // Emit the field names S1AddChargeAsync actually reads:
      // chargeType / itemName / description / quantity / rate.
      transform: function (p) {
        return {
          chargeType:   p.chargeType || p.category || '',
          itemName:     p.description || '',
          description:  p.notes || '',
          quantity:     Number(p.quantity || 1),
          rate:         Number(p.rate || 0),
          crewCount:    Number(p.crewCount || 0),
          vehicleCount: Number(p.vehicleCount || 0),
          taxable:      !!p.taxable
        };
      },
      validate: function (p) {
        if (!p.itemName) return 'Description is required';
        if (!(p.rate > 0)) return 'Rate must be greater than 0';
        return null;
      },
      successMsg: 'Charge added'
    }],
    // F20: edit an existing charge (hidden chargeId carries the row id).
    ['#editChargeModal',        'jobDetail.edit-charge', {
      transform: function (p) {
        return {
          chargeId:     p.chargeId,
          chargeType:   p.chargeType || p.category || '',
          itemName:     p.description || '',
          description:  p.notes || '',
          quantity:     Number(p.quantity || 1),
          rate:         Number(p.rate || 0),
          crewCount:    Number(p.crewCount || 0),
          vehicleCount: Number(p.vehicleCount || 0),
          taxable:      !!p.taxable
        };
      },
      validate: function (p) {
        if (!p.chargeId) return 'Missing charge id';
        if (!p.itemName) return 'Description is required';
        if (!(p.rate > 0)) return 'Rate must be greater than 0';
        return null;
      },
      successMsg: 'Charge updated'
    }],
    // F23: add a real JobExpense.
    ['#addExpenseModal',        'jobDetail.add-expense', {
      transform: function (p) {
        return { category: p.category || '', description: p.description || '', amount: Number(p.amount || 0) };
      },
      validate: function (p) {
        if (!p.category) return 'Category is required';
        if (!(p.amount > 0)) return 'Amount must be greater than 0';
        return null;
      },
      successMsg: 'Expense added'
    }],
    // F28: send the customer their invoice.
    ['#sendInvoiceModal',       'jobDetail.send-invoice', {
      validate: function (p) { if (!p.recipientEmail) return 'Recipient email is required'; return null; },
      successMsg: 'Invoice sent'
    }],
    ['#jdAddContactModal',      'jobDetail.add-contact',  {}],
    ['#jdVideoModal',           'job.video.request',      {}],
    ['#jdMarkLostModal',        'job.markLost',           {
      // Feature 1546: a reason (configured in Settings) is required before the deal can be closed lost.
      validate: function (p) { if (!p.reasonForLosingThisDeal) return 'Select a reason'; return null; },
      successMsg: 'Marked as lost'
    }],
    ['#jdMarkBadModal',         'jobDetail.mark-bad-lead', {
      // Feature 1546: a reason (configured in Settings) is required before marking a lead bad.
      validate: function (p) { if (!p.reason) return 'Select a reason'; return null; },
      successMsg: 'Marked as bad lead'
    }],
    ['#jdAddDiscountModal',     'job.discount.add',       {}],
    ['#jdNteModal',             'job.nte.set',            {}],
    ['#jdJobDetailsModal',      'job.details.update',     {}],
    // This modal edits the CUSTOMER record (name/phone/email), not a JobContact,
    // so route to jobDetail.customer (S1EditCustomerAsync) and split the single
    // name field into firstName / lastName.
    ['#jdContactDetailsModal',  'jobDetail.customer', {
      transform: function (p) {
        var name = (p.customerName || '').trim();
        var sp = name.indexOf(' ');
        return {
          firstName:        sp === -1 ? name : name.slice(0, sp),
          lastName:         sp === -1 ? ''   : name.slice(sp + 1).trim(),
          phone:            p.primaryPhone || '',
          email:            p.email || '',
          // C2: forward the rest of the modal so nothing is dropped.
          secondaryPhone:   p.secondaryPhone || '',
          preferredContact: p.preferredContact || '',
          language:         p.language || '',
          receivesMarketing: p.receivesMarketing ? 'true' : 'false'
        };
      },
      successMsg: 'Contact details saved'
    }],
    ['#jdInventoryModal',       'job.inventory.upsert',   {}],
    ['#jdPaymentModal',         'jobDetail.add-payment', {
      validate: function (p) {
        if (!(Number(p.amount) > 0)) return 'Amount must be greater than 0';
        return null;
      },
      successMsg: 'Payment recorded'
    }],
    // #1342: edit an existing payment (hidden id carries the Payment row). For
    // Stripe-collected payments the amount/method/date fields are disabled so
    // they aren't collected — only require amount > 0 when it is present.
    ['#jdEditPaymentModal',     'jobDetail.edit-payment', {
      validate: function (p) {
        if (!p.id) return 'Missing payment id';
        if (p.amount !== undefined && p.amount !== '' && !(Number(p.amount) > 0))
          return 'Amount must be greater than 0';
        return null;
      },
      successMsg: 'Payment updated'
    }],
    ['#jdScheduleModal',        'jobDetail.schedule', {
      transform: function (p) {
        return {
          scheduledDate: p.date || '',
          timeSlot:      p.timeSlot || '',
          meetingType:   p.meetingType || ''
        };
      },
      validate: function (p) {
        if (!p.scheduledDate) return 'Date is required';
        return null;
      },
      successMsg: 'Schedule saved'
    }]
  ];
  bindings.forEach(([sel, rpc, extra]) => {
    const matches = document.querySelectorAll(sel);
    if (matches.length === 0) { try { console.warn('[jobDetail] no match for binding selector', sel); } catch(_){} return; }
    if (matches.length > 1)  { try { console.warn('[jobDetail] duplicate-id collision for', sel, '— count=', matches.length); } catch(_){} }
    const opts = Object.assign({
      label: rpc,
      onSuccess: () => { try { (window.S1.fixtures||{}).jobDetail && window.S1.render.bind(document, window.S1.fixtures.jobDetail); } catch {} }
    }, extra || {});
    window.S1.modal.bindForm(sel, rpc, opts);
  });
})();

// #1451: prefill the reschedule modal (#jdScheduleModal) with the job's current
// date/time/type whenever a header or sidebar "schedule" trigger opens it, so it
// behaves as a true reschedule instead of "set from scratch".
(function () {
  var modal = document.getElementById('jdScheduleModal');
  if (!modal) return;
  function seed() {
    var h = (((window.S1 || {}).fixtures || {}).jobDetail || {}).header || {};
    var d = modal.querySelector('[name="date"]');
    var t = modal.querySelector('[name="timeSlot"]');
    var ty = modal.querySelector('[name="meetingType"]');
    if (d) d.value = h.scheduledDateRaw || '';
    // #1466: re-select the job's current arrival window (adding the option if the
    // configured list no longer contains it), mirroring the meetingType seed below.
    if (t) {
      if (h.timeSlotRaw) {
        var foundSlot = Array.prototype.some.call(t.options, function (o) { return o.value === h.timeSlotRaw; });
        if (!foundSlot) {
          var so = document.createElement('option');
          so.value = h.timeSlotRaw;
          so.textContent = h.timeSlotRaw;
          t.appendChild(so);
        }
        t.value = h.timeSlotRaw;
      } else {
        t.value = '';
      }
    }
    if (ty) {
      if (h.meetingTypeRaw) {
        var found = Array.prototype.some.call(ty.options, function (o) { return o.value === h.meetingTypeRaw; });
        if (!found) {
          var o = document.createElement('option');
          o.value = h.meetingTypeRaw;
          o.textContent = h.meetingTypeRaw;
          ty.appendChild(o);
        }
        ty.value = h.meetingTypeRaw;
      }
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-jd-open="jdScheduleModal"]'), function (b) {
    b.addEventListener('click', function () { setTimeout(seed, 0); });
  });
})();

// Feature #1341: make the Add Payment modal method-aware. Picking "Credit card"
// (or any card slug) reveals a saved-card picker and turns the primary button
// into "Charge $X", which performs a REAL Stripe charge via jobDetail.charge-card
// (writes a Payment + Transaction, rolls up the invoice). Non-card methods keep
// the record-only jobDetail.add-payment binding. Card rows are built with
// createElement/textContent only (CLAUDE rule 2 — never innerHTML).
(function () {
  var modal = document.getElementById('jdPaymentModal');
  if (!modal) return;
  var typeSel    = modal.querySelector('#jdPayTypeSelect');
  var cardSection = modal.querySelector('#jdPayCardSection');
  var cardListEl = modal.querySelector('#jdPayCardList');
  var cardEmpty  = modal.querySelector('#jdPayCardEmpty');
  var addCardBtn = modal.querySelector('#jdPayAddCardBtn');
  var submitBtn  = modal.querySelector('#jdPaySubmitBtn');
  var amountEl   = modal.querySelector('[name="amount"]');
  var categoryEl = modal.querySelector('[name="category"]');
  var referenceEl = modal.querySelector('[name="reference"]');
  var notesEl    = modal.querySelector('[name="notes"]');
  if (!typeSel || !submitBtn) return;

  var selectedPm = null;

  function clear(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

  function isCardSlug(slug) {
    var s = (slug || '').toLowerCase();
    return s === 'credit' || s === 'stripe';
  }

  // Populate the Payment Type dropdown from the company's enabled methods.
  function populateTypes() {
    var data = (window.S1.fixtures || {}).jobDetail || {};
    var methods = data.enabledPaymentMethods || [];
    var prev = typeSel.value;
    clear(typeSel);
    if (!methods.length) {
      // Defensive fallback so the select is never empty.
      methods = [{ slug: 'cash', label: 'Cash' }, { slug: 'credit', label: 'Credit card' }];
    }
    methods.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m.slug || '';
      opt.textContent = m.label || m.slug || '';
      typeSel.appendChild(opt);
    });
    // Restore previous selection if still present.
    if (prev) {
      var match = Array.prototype.some.call(typeSel.options, function (o) { return o.value === prev; });
      if (match) typeSel.value = prev;
    }
  }

  function renderPayCards(cards) {
    clear(cardListEl);
    selectedPm = null;
    if (!cards || !cards.length) {
      if (cardEmpty) cardEmpty.style.display = '';
      return;
    }
    if (cardEmpty) cardEmpty.style.display = 'none';
    var def = cards.find(function (c) { return c.isDefault; });
    selectedPm = (def && def.paymentMethodId) || cards[0].paymentMethodId;

    cards.forEach(function (card) {
      var row = document.createElement('div');
      row.className = 'jd-cardrow' + (card.paymentMethodId === selectedPm ? ' sel' : '');
      row.setAttribute('data-pm', card.paymentMethodId || '');

      var meta = document.createElement('label');
      meta.className = 'jd-card-meta';
      meta.style.cursor = 'pointer';
      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'jdPayCardSelect';
      radio.value = card.paymentMethodId || '';
      radio.checked = card.paymentMethodId === selectedPm;
      radio.addEventListener('change', function () {
        selectedPm = card.paymentMethodId;
        Array.prototype.forEach.call(cardListEl.querySelectorAll('.jd-cardrow'), function (r) {
          r.classList.toggle('sel', r.getAttribute('data-pm') === selectedPm);
        });
      });
      meta.appendChild(radio);

      var brand = document.createElement('b');
      brand.textContent = card.brand || 'Card';
      meta.appendChild(brand);

      var num = document.createElement('span');
      num.textContent = '•••• ' + (card.last4 || '----');
      meta.appendChild(num);

      var exp = document.createElement('span');
      exp.style.color = 'var(--ink-3)';
      var mm = card.expMonth != null ? ('0' + card.expMonth).slice(-2) : '--';
      var yy = card.expYear != null ? String(card.expYear).slice(-2) : '--';
      exp.textContent = 'exp ' + mm + '/' + yy;
      meta.appendChild(exp);

      if (card.isDefault) {
        var badge = document.createElement('span');
        badge.className = 'jd-card-badge';
        badge.textContent = 'Default';
        meta.appendChild(badge);
      }
      row.appendChild(meta);
      cardListEl.appendChild(row);
    });
  }

  async function loadPayCards() {
    clear(cardListEl);
    if (cardEmpty) cardEmpty.style.display = 'none';
    await safe('Load cards', async function () {
      var r = await comm.action('jobDetail.list-cards', {});
      renderPayCards((r && r.cards) || []);
    });
  }

  function chargeLabel() {
    var amt = Number(amountEl && amountEl.value);
    return amt > 0 ? 'Charge $' + amt.toFixed(2) : 'Charge card';
  }

  function syncMode() {
    var card = isCardSlug(typeSel.value);
    if (cardSection) cardSection.style.display = card ? '' : 'none';
    submitBtn.textContent = card ? chargeLabel() : 'Record Payment';
    if (card) loadPayCards();
  }

  typeSel.addEventListener('change', syncMode);
  if (amountEl) amountEl.addEventListener('input', function () {
    if (isCardSlug(typeSel.value)) submitBtn.textContent = chargeLabel();
  });

  // Re-populate + reset the mode each time the modal is opened.
  Array.prototype.forEach.call(document.querySelectorAll('[data-jd-open="jdPaymentModal"]'), function (b) {
    b.addEventListener('click', function () {
      populateTypes();
      // Defer so the open click settles before we read/charge.
      setTimeout(syncMode, 0);
    });
  });
  // Initial population (and again whenever the module re-renders state).
  populateTypes();
  document.addEventListener('s1ui:ready', function (e) {
    if (e && e.detail && e.detail.module === 'jobDetail') populateTypes();
  });

  // + Add card → Stripe Checkout setup in a new tab, then refresh the list.
  if (addCardBtn) addCardBtn.addEventListener('click', async function () {
    await safe('Add card', async function () {
      var r = await comm.action('jobDetail.add-card', {});
      if (r && r.ok === false) { flash(r.error || 'Failed', 'bad'); return; }
      if (r && r.url) {
        try { window.parent.postMessage({ type: 's1ui:open-url', url: r.url }, '*'); } catch (_) {}
        flash('Opening secure card form…');
      }
    });
  });

  // Intercept the primary button for card mode (capture phase, so it runs before
  // the generic bindForm 'add-payment' handler and can cancel it). Non-card
  // methods fall through to the existing record-only binding.
  submitBtn.addEventListener('click', function (ev) {
    if (!isCardSlug(typeSel.value)) return;     // let bindForm handle record-only
    ev.preventDefault();
    ev.stopImmediatePropagation();
    var amount = amountEl ? amountEl.value : '';
    if (!(Number(amount) > 0)) { flash('Amount must be greater than 0', 'bad'); return; }
    if (!selectedPm) { flash('Add or select a card to charge', 'bad'); return; }
    safe('Charge card', async function () {
      var r = await comm.action('jobDetail.charge-card', {
        paymentMethodId: selectedPm,
        amount:      amount,
        category:    (categoryEl && categoryEl.value) || '',
        reference:   (referenceEl && referenceEl.value) || '',
        description: (notesEl && notesEl.value) || (categoryEl && categoryEl.value) || 'Card payment'
      });
      if (r && r.ok === false) { flash(r.error || 'Card declined', 'bad'); return; } // keep modal open
      flash('Charged $' + Number(amount).toFixed(2) + ' to card');
      try { window.S1.modal.close('#jdPaymentModal'); } catch (_) {}
      try { (window.S1.fixtures || {}).jobDetail && window.S1.render.bind(document, window.S1.fixtures.jobDetail); } catch (_) {}
    });
  }, true);
})();

// F29: Saved-card management panel. Lists the customer's Stripe cards and lets
// the user add / remove / set-default / charge a chosen card. The bridge keys
// list-cards / add-card / remove-card / set-default-card / charge-card are all
// mapped server-side. Card rows are built with createElement/textContent only
// (CLAUDE rule 2 — never innerHTML).
(function () {
  var modal = document.getElementById('savedCardsModal');
  if (!modal) return;
  var listEl   = modal.querySelector('#savedCardsList');
  var emptyEl  = modal.querySelector('#savedCardsEmpty');
  var addBtn   = modal.querySelector('#savedCardsAddBtn');
  var chargeBtn = modal.querySelector('#savedCardsChargeBtn');
  var amountEl = modal.querySelector('#savedCardsAmount');
  var descEl   = modal.querySelector('#savedCardsDesc');
  var selectedPm = null;

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function renderCards(cards) {
    clear(listEl);
    selectedPm = null;
    if (!cards || !cards.length) {
      if (emptyEl) emptyEl.style.display = '';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    // Pre-select the default card (if any) so "Charge selected card" has a target.
    var def = cards.find(function (c) { return c.isDefault; });
    selectedPm = (def && def.paymentMethodId) || cards[0].paymentMethodId;

    cards.forEach(function (card) {
      var row = document.createElement('div');
      row.className = 'jd-cardrow' + (card.paymentMethodId === selectedPm ? ' sel' : '');
      row.setAttribute('data-pm', card.paymentMethodId || '');

      var meta = document.createElement('label');
      meta.className = 'jd-card-meta';
      meta.style.cursor = 'pointer';
      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'savedCardSelect';
      radio.value = card.paymentMethodId || '';
      radio.checked = card.paymentMethodId === selectedPm;
      radio.addEventListener('change', function () {
        selectedPm = card.paymentMethodId;
        Array.prototype.forEach.call(listEl.querySelectorAll('.jd-cardrow'), function (r) {
          r.classList.toggle('sel', r.getAttribute('data-pm') === selectedPm);
        });
      });
      meta.appendChild(radio);

      var brand = document.createElement('b');
      brand.textContent = card.brand || 'Card';
      meta.appendChild(brand);

      var num = document.createElement('span');
      num.textContent = '•••• ' + (card.last4 || '----');
      meta.appendChild(num);

      var exp = document.createElement('span');
      exp.style.color = 'var(--ink-3)';
      var mm = card.expMonth != null ? ('0' + card.expMonth).slice(-2) : '--';
      var yy = card.expYear != null ? String(card.expYear).slice(-2) : '--';
      exp.textContent = 'exp ' + mm + '/' + yy;
      meta.appendChild(exp);

      if (card.isDefault) {
        var badge = document.createElement('span');
        badge.className = 'jd-card-badge';
        badge.textContent = 'Default';
        meta.appendChild(badge);
      }
      row.appendChild(meta);

      var actions = document.createElement('div');
      actions.className = 'jd-card-actions';

      if (!card.isDefault) {
        var defBtn = document.createElement('button');
        defBtn.type = 'button';
        defBtn.className = 'btn btn-secondary btn-sm';
        defBtn.textContent = 'Set default';
        defBtn.addEventListener('click', async function () {
          await safe('Set default card', async function () {
            var r = await comm.action('jobDetail.set-default-card', { paymentMethodId: card.paymentMethodId });
            if (r && r.ok === false) { flash(r.error || 'Failed', 'bad'); return; }
            flash('Default card updated');
            await loadCards();
          });
        });
        actions.appendChild(defBtn);
      }

      var rmBtn = document.createElement('button');
      rmBtn.type = 'button';
      rmBtn.className = 'btn btn-secondary btn-sm';
      rmBtn.style.color = 'var(--bad)';
      rmBtn.textContent = 'Remove';
      rmBtn.addEventListener('click', async function () {
        if (!window.confirm('Remove this card?')) return;
        await safe('Remove card', async function () {
          var r = await comm.action('jobDetail.remove-card', { paymentMethodId: card.paymentMethodId });
          if (r && r.ok === false) { flash(r.error || 'Failed', 'bad'); return; }
          flash('Card removed');
          await loadCards();
        });
      });
      actions.appendChild(rmBtn);

      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  async function loadCards() {
    clear(listEl);
    await safe('Load cards', async function () {
      var r = await comm.action('jobDetail.list-cards', {});
      renderCards((r && r.cards) || []);
    });
  }

  // Re-list whenever a "Manage cards" trigger opens the modal. The generic
  // [data-jd-open] opener (wired further up) handles the actual open; we just
  // also refresh the list here.
  Array.prototype.forEach.call(document.querySelectorAll('[data-jd-open="savedCardsModal"]'), function (b) {
    b.addEventListener('click', function () { loadCards(); });
  });

  if (addBtn) addBtn.addEventListener('click', async function () {
    await safe('Add card', async function () {
      var r = await comm.action('jobDetail.add-card', {});
      if (r && r.ok === false) { flash(r.error || 'Failed', 'bad'); return; }
      if (r && r.url) {
        // The Stripe Checkout link must open in a NEW TAB. A popup from inside
        // the iframe after this async RPC loses its user-gesture and is blocked,
        // so hand the URL to the host and let the parent open it.
        try { window.parent.postMessage({ type: 's1ui:open-url', url: r.url }, '*'); } catch (_) {}
        flash('Opening secure card form…');
      }
    });
  });

  if (chargeBtn) chargeBtn.addEventListener('click', async function () {
    var amount = amountEl ? amountEl.value : '';
    if (!selectedPm) { flash('Select a card first', 'bad'); return; }
    if (!(Number(amount) > 0)) { flash('Enter an amount first', 'bad'); return; }
    await safe('Charge card', async function () {
      var r = await comm.action('jobDetail.charge-card', {
        paymentMethodId: selectedPm,
        amount: amount,
        description: (descEl && descEl.value) || 'Job charge'
      });
      if (r && r.ok === false) { flash(r.error || 'Charge failed', 'bad'); return; }
      flash('Card charged');
      try { window.S1.modal.close && window.S1.modal.close('#savedCardsModal'); } catch (_) {}
    });
  });
})();

// Defects A15/A16: stop spurious unhandled RPCs and wire/disable dead buttons.
(function () {
  var all = function (s) { return Array.from(document.querySelectorAll(s)); };
  // A16: composer tabs + follow-up presets are driven by inline scripts; their
  // data-comm-action keys have no dispatcher case and fire a no-op RPC per click.
  all('.cmx-tab[data-comm-action], .jd-fu-preset[data-comm-action]').forEach(function (b) {
    b.removeAttribute('data-comm-action');
  });
  // F7: the dead "+ New deal" / "Save Template" buttons are removed from the
  // markup (no backend exists), so there's nothing left to strip here.
  // A15: every "Record Video" button (incl. the duplicate that previously no-op'd)
  // opens the video modal.
  all('[data-comm-action="action:jobDetail.record-video"]').forEach(function (b) {
    b.removeAttribute('data-comm-action');
    b.__s1Wired = true;
    b.addEventListener('click', function (ev) { ev.preventDefault(); try { window.S1.modal.open('#jdVideoModal'); } catch (_) {} });
  });
})();

// ── Template pickers (email/text composer + call-log) ──────────────────
// Items are rendered from window.S1.fixtures.jobDetail.templates via the
// existing [data-bind] mechanism (production overlays the same shape from
// BuildS1State). This wiring handles click → populate composer fields,
// search → filter, and ⌘1–⌘4 → first four email templates.
(function () {
  var BUCKET_OF = {
    emailTplPop:  'email',
    textTplPop:   'text',
    callEmailPop: 'callEmail',
    callTextPop:  'callText'
  };
  function tplData() {
    var fx = (window.S1.fixtures || {}).jobDetail || {};
    return fx.templates || {};
  }
  function setVal(sel, v) {
    var el = document.querySelector(sel); if (!el) return;
    if ('value' in el) el.value = v; else el.textContent = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  document.addEventListener('click', function (ev) {
    var item = ev.target.closest('.cmx-pop-item[data-tpl-id]');
    if (!item) return;
    var wrap = item.closest('[data-cmx-pop]');
    if (!wrap) return;
    var key = wrap.getAttribute('data-cmx-pop');
    var bucket = BUCKET_OF[key];
    if (!bucket) return;
    var id = item.getAttribute('data-tpl-id') || '';
    var fx = tplData();
    var rec = id ? ((fx[bucket] || []).find(function (t) { return String(t.id) === id; }) || null) : null;
    // mark selected
    var items = wrap.querySelectorAll('.cmx-pop-item');
    for (var i = 0; i < items.length; i++) items[i].classList.remove('selected');
    item.classList.add('selected');
    // update trigger label
    var label = wrap.querySelector(':scope > span');
    if (label) {
      var fallback = bucket === 'email' ? 'Select template…'
                   : bucket === 'text'  ? 'Select template…'
                   : bucket === 'callEmail' ? 'Email template — none'
                   : 'Text template — none';
      label.textContent = rec ? rec.name : fallback;
    }
    if (bucket === 'email') {
      setVal('[data-bind-value="composer.email.subject"]', rec ? (rec.subject || '') : '');
      // composer.email.body is the cross-origin rich-text iframe (src=editor.service1.app),
      // not an <input>/<textarea>. setVal would fall through to `iframe.textContent =`
      // which silently no-ops on iframes — so clicking a template appeared to do
      // nothing for the body. Route through the EditorBridge's public API instead,
      // which posts a `set-content` message the editor knows how to render. Send
      // already reads from this same bridge via window.__jobDetailEditors.get('email'),
      // so the new body persists through the Send payload too.
      var bodyHtml = rec ? (rec.body || '') : '';
      if (window.__jobDetailEditors && typeof window.__jobDetailEditors.setContent === 'function') {
        window.__jobDetailEditors.setContent('email', bodyHtml);
      } else {
        setVal('[data-bind-value="composer.email.body"]', bodyHtml);
      }
      setVal('[data-bind-value="composer.email.templateId"]', id);
    } else if (bucket === 'text') {
      setVal('[data-bind-value="composer.text.body"]',     rec ? (rec.body || '')    : '');
      setVal('[data-bind-value="composer.text.templateId"]', id);
    } else if (bucket === 'callEmail') {
      setVal('[data-bind-value="composer.call.followUpEmailTemplateId"]', id);
    } else if (bucket === 'callText') {
      setVal('[data-bind-value="composer.call.followUpTextTemplateId"]', id);
    }
    // Close the popover after a pick. (The duplicate inline handler in
    // index.html that used to do this was removed because it also called
    // stopPropagation and prevented this handler from ever running.)
    var openPop = wrap.querySelector('.cmx-pop');
    if (openPop) openPop.classList.remove('open');
  });
  // Search input filters visible items by case-insensitive name match.
  document.addEventListener('input', function (ev) {
    var inp = ev.target.closest('.cmx-pop-search input, .cmx-pop-search [contenteditable]');
    if (!inp) return;
    var q = (inp.value || inp.textContent || '').toLowerCase();
    var host = inp.closest('.cmx-pop');
    if (!host) return;
    var items = host.querySelectorAll('.cmx-pop-item[data-tpl-id]');
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var nameSpan = it.querySelector('span');
      var nm = (nameSpan && nameSpan.textContent || '').toLowerCase();
      it.style.display = (!q || nm.indexOf(q) >= 0) ? '' : 'none';
    }
  });
  // ⌘1..⌘4 / Ctrl+1..4 → first four email templates (skip the None sentinel).
  document.addEventListener('keydown', function (e) {
    if (!(e.metaKey || e.ctrlKey)) return;
    var n = parseInt(e.key, 10);
    if (!(n >= 1 && n <= 4)) return;
    var pop = document.getElementById('emailTplPop');
    if (!pop) return;
    var items = pop.querySelectorAll('.cmx-pop-item[data-tpl-id]');
    var picks = [];
    for (var i = 0; i < items.length; i++) {
      if ((items[i].getAttribute('data-tpl-id') || '') !== '') picks.push(items[i]);
    }
    if (picks[n - 1]) { e.preventDefault(); picks[n - 1].click(); }
  });
})();

// Forward composer.email.templateId / composer.text.templateId into the
// Send payload so the backend can record the chosen template id.
(function () {
  if (!window.S1) return;
  var origCollect = window.S1.collectPayload;
  if (typeof origCollect !== 'function') return;
  window.S1.collectPayload = function (el) {
    var p = origCollect(el) || {};
    if (!p.templateId) {
      var bindKey = 'composer.email.templateId';
      var modeMatch = document.querySelector('.composer-tab.active');
      if (modeMatch && /text|sms/i.test(modeMatch.textContent)) bindKey = 'composer.text.templateId';
      var hidden = document.querySelector('[data-bind-value="' + bindKey + '"]');
      if (hidden && hidden.value) p.templateId = hidden.value;
    }
    return p;
  };
})();

// ── EditorBridge: postMessage wiring for the rich-text iframe editors ────
(function () {
  const EDITOR_ORIGIN = 'https://editor.service1.app';

  function getRole(iframe) { return iframe.getAttribute('data-cmx-editor-id') || iframe.getAttribute('data-editor-role') || ''; }
  function readBound(iframe) {
    const key = iframe.getAttribute('data-bind-value');
    if (!key) return '';
    const fixtures = (window.S1 && window.S1.fixtures && window.S1.fixtures.jobDetail) || {};
    return key.split('.').reduce((acc, k) => (acc && acc[k] != null) ? acc[k] : '', fixtures) || '';
  }
  function writeBound(iframe, html) {
    const key = iframe.getAttribute('data-bind-value');
    if (!key) return;
    const fixtures = (window.S1 && window.S1.fixtures && window.S1.fixtures.jobDetail) || {};
    const parts = key.split('.');
    let cur = fixtures;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = html;
  }

  const bridges = new Map(); // role -> bridge
  function getBridgeByIframe(iframe) {
    for (const b of bridges.values()) if (b.iframe === iframe) return b;
    return null;
  }
  function getBridgeByRole(role) { return bridges.get(role) || null; }

  function postToEditor(iframe, msg) {
    try { iframe.contentWindow && iframe.contentWindow.postMessage(msg, EDITOR_ORIGIN); } catch (_) {}
  }

  function pushAttach(iframe) {
    const bridge = getBridgeByIframe(iframe);
    if (!bridge) return;
    let input = bridge._fileInput;
    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.style.display = 'none';
      document.body.appendChild(input);
      bridge._fileInput = input;
      input.addEventListener('change', async () => {
        const files = Array.from(input.files || []);
        for (const f of files) {
          try {
            const r = await comm.upload(f, { resource: 'jobDetail.attachment' });
            const url = (r && (r.url || r.location)) || '#';
            const name = (f.name || 'file').replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
            postToEditor(iframe, { type: 'insert-html', html: '<a href="' + url + '">' + name + '</a>' });
            flash('Attached ' + f.name);
          } catch (e) { flash('Upload failed: ' + (e && e.message || e), 'bad'); }
        }
        input.value = '';
      });
    }
    input.click();
  }

  function setToolbarState(role, active) {
    const tb = document.querySelector('.cmx-tb[data-cmx-editor-id="' + role + '"]');
    if (!tb) return;
    tb.querySelectorAll('[data-cmx-exec]').forEach(btn => {
      const cmd = btn.getAttribute('data-cmx-exec');
      btn.classList.toggle('on', !!(active && active[cmd]));
    });
  }

  window.addEventListener('message', (e) => {
    if (e.origin !== EDITOR_ORIGIN) return;
    const data = e.data;
    if (!data || typeof data !== 'object') return;
    let bridge = null;
    for (const b of bridges.values()) {
      if (b.iframe && b.iframe.contentWindow === e.source) { bridge = b; break; }
    }
    if (!bridge) return;

    if (data.type === 'editor-ready') {
      bridge.ready = true;
      const initial = readBound(bridge.iframe);
      const placeholder = bridge.iframe.getAttribute('data-placeholder') || '';
      postToEditor(bridge.iframe, { type: 'set-placeholder', text: placeholder });
      postToEditor(bridge.iframe, { type: 'set-content', html: initial });
    } else if (data.type === 'content') {
      bridge.lastHtml = String(data.html || '');
      writeBound(bridge.iframe, bridge.lastHtml);
      if (bridge._pendingContent) { const fn = bridge._pendingContent; bridge._pendingContent = null; fn(bridge.lastHtml); }
    } else if (data.type === 'attach-request') {
      pushAttach(bridge.iframe);
    } else if (data.type === 'exec-result') {
      if (data.active) setToolbarState(bridge.role, data.active);
    }
  });

  function registerEditors() {
    document.querySelectorAll('iframe.cmx-editor-frame').forEach(iframe => {
      const role = getRole(iframe);
      if (!role || bridges.has(role)) return;
      bridges.set(role, { iframe, role, ready: false, lastHtml: '', _pendingContent: null });
    });
  }

  // Initial registration + observe later renders
  registerEditors();
  document.addEventListener('s1ui:ready', registerEditors);
  const mo = new MutationObserver(registerEditors);
  mo.observe(document.body, { childList: true, subtree: true });

  // Toolbar click delegation
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest && ev.target.closest('[data-cmx-exec]');
    if (!btn) return;
    const tb = btn.closest('.cmx-tb[data-cmx-editor-id]');
    if (!tb) return;
    const role = tb.getAttribute('data-cmx-editor-id');
    const bridge = getBridgeByRole(role);
    if (!bridge) return;
    const cmd = btn.getAttribute('data-cmx-exec');
    if (cmd === 'link') {
      openLinkPopover(btn, (href) => {
        postToEditor(bridge.iframe, { type: 'exec', command: 'link', value: href ? { href } : null });
      });
    } else {
      postToEditor(bridge.iframe, { type: 'exec', command: cmd });
    }
    ev.preventDefault();
  });

  function openLinkPopover(anchor, cb) {
    const existing = document.querySelector('.cmx-link-pop');
    if (existing) existing.remove();
    const pop = document.createElement('div');
    pop.className = 'cmx-link-pop';
    const label = document.createElement('label'); label.textContent = 'Add link';
    const input = document.createElement('input');
    input.type = 'text'; input.placeholder = 'https://';
    const row = document.createElement('div'); row.className = 'row';
    const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'cancel'; cancel.textContent = 'Cancel';
    const ok = document.createElement('button'); ok.type = 'button'; ok.className = 'ok'; ok.textContent = 'Add';
    row.appendChild(cancel); row.appendChild(ok);
    pop.appendChild(label); pop.appendChild(input); pop.appendChild(row);
    document.body.appendChild(pop);
    const r = anchor.getBoundingClientRect();
    pop.style.top = (window.scrollY + r.bottom + 6) + 'px';
    pop.style.left = (window.scrollX + r.left) + 'px';
    setTimeout(() => input.focus(), 0);
    function close(href) { pop.remove(); cb(href); }
    cancel.addEventListener('click', () => close(null));
    ok.addEventListener('click', () => close(input.value.trim() || null));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') close(input.value.trim() || null);
      else if (e.key === 'Escape') close(null);
    });
  }

  // Expose a getter that returns content from the editor (for send/save handlers)
  function getEditorContent(role) {
    return new Promise(resolve => {
      const bridge = getBridgeByRole(role);
      if (!bridge || !bridge.iframe) return resolve('');
      bridge._pendingContent = resolve;
      postToEditor(bridge.iframe, { type: 'get-content' });
      setTimeout(() => {
        if (bridge._pendingContent === resolve) {
          bridge._pendingContent = null;
          resolve(bridge.lastHtml || '');
        }
      }, 400);
    });
  }
  function getEditorContentSync(role) {
    const b = getBridgeByRole(role);
    return b ? (b.lastHtml || '') : '';
  }

  window.__jobDetailEditors = {
    get: getEditorContent,
    getSync: getEditorContentSync,
    insertText: (role, text) => { const b = getBridgeByRole(role); if (b) postToEditor(b.iframe, { type: 'insert-text', text }); },
    insertHTML: (role, html) => { const b = getBridgeByRole(role); if (b) postToEditor(b.iframe, { type: 'insert-html', html }); },
    setContent: (role, html) => { const b = getBridgeByRole(role); if (b) { postToEditor(b.iframe, { type: 'set-content', html: html || '' }); b.lastHtml = html || ''; } },
    clear: (role) => { const b = getBridgeByRole(role); if (b) { postToEditor(b.iframe, { type: 'set-content', html: '' }); b.lastHtml = ''; } },
    focus: (role) => { const b = getBridgeByRole(role); if (b) postToEditor(b.iframe, { type: 'focus' }); }
  };
})();

// Intercept the cmx send/save buttons so they pull HTML from the iframe
(function () {
  function roleFromAction(action) {
    if (action === 'jobDetail.send') return 'email';
    if (action === 'jobDetail.log-call-commit') return 'call';
    if (action === 'jobDetail.save-note') return 'note';
    if (action === 'jobDetail.save-draft') {
      const active = document.querySelector('.cmx-body.active') || document.querySelector('.cmx-body[data-cmx-body]');
      if (!active) return null;
      const k = active.getAttribute('data-cmx-body');
      if (k === 'email') return 'email';
      if (k === 'call') return 'call';
      if (k === 'note') return 'note';
    }
    return null;
  }
  document.addEventListener('click', async (ev) => {
    const btn = ev.target.closest && ev.target.closest('[data-comm-action]');
    if (!btn) return;
    const raw = btn.getAttribute('data-comm-action') || '';
    const action = raw.replace(/^action:/, '').replace(/:.*$/, '');
    const role = roleFromAction(action);
    if (!role) return;
    if (btn.__jdEditorWired) return;
    btn.__jdEditorWired = true;
    // No actual interception of the comm dispatch — the bridge already
    // mirrors the iframe HTML into the bound fixtures path on every
    // `change` message, so by the time the action fires the bound value
    // is up to date. We still trigger a get-content to flush any
    // in-flight debounced changes.
    if (window.__jobDetailEditors) {
      window.__jobDetailEditors.get(role);
    }
  }, true);
})();

// ── AI suggest: call the GET-backed handler, inject the result into the
// active composer pane (subject/body editor for email, message box for text,
// note editor for call). The backend dispatcher routes these action keys to
// the OnGetSuggest* handlers and returns { subject, body } / { message } /
// { notes } (or { error }).
(function () {
  function setVal(sel, v) {
    var el = document.querySelector(sel); if (!el) return;
    if ('value' in el) el.value = v; else el.textContent = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
  document.addEventListener('click', async function (ev) {
    var btn = ev.target.closest && ev.target.closest('[data-comm-action^="action:jobDetail.ai-suggest-"]');
    if (!btn) return;
    ev.preventDefault();
    ev.stopPropagation();
    if (btn.__jdBusy) return;
    btn.__jdBusy = true;
    btn.__s1Wired = true;
    btn.style.opacity = '0.6';
    var key = (btn.getAttribute('data-comm-action') || '').replace(/^action:/, '').replace(/:.*$/, '');
    await safe('Suggest', async function () {
      try {
        flash('Generating suggestion…');
        var r = await comm.action(key, {});
        if (!r || r.error) { flash((r && r.error) || 'No suggestion available.', 'bad'); return; }
        if (key === 'jobDetail.ai-suggest-email') {
          if (r.subject != null) setVal('[data-bind-value="composer.email.subject"]', r.subject);
          if (window.__jobDetailEditors) window.__jobDetailEditors.insertHTML('email', r.body || '');
          flash('Email draft inserted');
        } else if (key === 'jobDetail.ai-suggest-text') {
          setVal('#cmxTextBody', r.message || '');
          flash('Text draft inserted');
        } else if (key === 'jobDetail.ai-suggest-call') {
          if (window.__jobDetailEditors) window.__jobDetailEditors.insertText('call', r.notes || '');
          flash('Talking points inserted');
        }
      } finally {
        btn.__jdBusy = false;
        btn.style.opacity = '';
      }
    });
  }, true);
})();

// ── Client-side tab navigation (previously fired no-op RPCs) ────────────
document.addEventListener('click', function (ev) {
  var link = ev.target.closest && ev.target.closest('[data-jd-tab]');
  if (!link) return;
  ev.preventDefault();
  var tab = document.querySelector('.tab[data-tab="' + link.getAttribute('data-jd-tab') + '"]');
  if (tab) tab.click();
});

// ── #1516: "Open full inventory editor →" opens the full per-item inventory
// editor page (Pages/InventoryFromEstimate) for this job. The iframe is cross-
// origin so we route through the s1ui:navigate host bridge (same pattern as
// dashboard/customers). Job number comes from the live state, same source as
// jobId(). Previously this link wrongly switched to the Estimate tab via
// data-jd-tab="growth-plan".
document.addEventListener('click', function (ev) {
  var a = ev.target && ev.target.closest && ev.target.closest('#jdFullInventoryLink');
  if (!a) return;
  ev.preventDefault();
  var jn = ((window.S1.fixtures || {}).jobDetail
            && window.S1.fixtures.jobDetail.deal
            && window.S1.fixtures.jobDetail.deal.id) || '';
  if (!jn) return;
  var href = '/InventoryFromEstimate/' + encodeURIComponent(jn);
  try {
    if (window.parent && window.parent !== window.self) {
      window.parent.postMessage({ type: 's1ui:navigate', href: href }, '*');
      return;
    }
  } catch (_) {}
  window.location.assign(href);
});

// ── Composer editor intents (client-only — previously fired no-op RPCs) ──
// insert-variable / insert-logo / tag-note / mention-teammate insert text into
// the active editor; cancel-note clears the note editor.
(function () {
  function activeRole() {
    var a = document.querySelector('.cmx-body.active[data-cmx-body]');
    return a ? a.getAttribute('data-cmx-body') : null;
  }
  function insertIntoActive(text) {
    var role = activeRole();
    if (!role) return;
    var body = document.querySelector('.cmx-body[data-cmx-body="' + role + '"]');
    var iframe = body && body.querySelector('iframe.cmx-editor-frame');
    if (iframe && window.__jobDetailEditors) {
      window.__jobDetailEditors.insertText(role, text);
      return;
    }
    var ta = body && body.querySelector('textarea');
    if (ta) {
      var s = ta.selectionStart != null ? ta.selectionStart : ta.value.length;
      var e = ta.selectionEnd != null ? ta.selectionEnd : s;
      ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  // Defect A17: the old buttons inserted a hard-coded {{customer.firstName}} /
  // {{company.logo}} literal — the wrong syntax (the send engine substitutes
  // @-prefixed tokens, not {{…}}) and only one token. Restore a real picker over
  // the TemplateVariables catalog that inserts the engine's @-token.
  var TOKENS = {
    'tag-note':         '#',
    'mention-teammate': '@'
  };
  // Insert Logo: matches the old JobDetail insertCompanyLogo() — drop a real
  // <img> of the company logo into the active rich editor. The logo URL comes
  // from state (BuildS1State → companyLogoUrl, sourced from CompanySettings.LogoUrl).
  function insertCompanyLogo() {
    var fx = (window.S1.fixtures || {}).jobDetail || {};
    var url = fx.companyLogoUrl;
    if (!url) { flash('No company logo configured', 'bad'); return; }
    var role = activeRole();
    if (!role) return;
    var img = '<img src="' + String(url).replace(/"/g, '&quot;') + '" alt="Company Logo" style="height:50px;width:auto;display:block;margin:8px 0">';
    if (window.__jobDetailEditors) window.__jobDetailEditors.insertHTML(role, img);
  }
  var _varCatalog = null;
  async function loadVarCatalog() {
    if (_varCatalog) return _varCatalog;
    try {
      var r = await comm.action('jobDetail.template-variables', {});
      _varCatalog = Array.isArray(r) ? r : ((r && r.variables) || []);
    } catch (_) { _varCatalog = []; }
    return _varCatalog;
  }
  function closeVarPicker() {
    var ex = document.getElementById('jdVarPicker');
    if (ex && ex.parentNode) ex.parentNode.removeChild(ex);
  }
  async function openVarPicker(btn) {
    closeVarPicker();
    var list = await loadVarCatalog();
    var menu = document.createElement('div');
    menu.id = 'jdVarPicker';
    menu.style.cssText = 'position:absolute;z-index:9999;max-height:300px;overflow:auto;background:var(--surface,#fff);color:var(--ink,#111);border:1px solid var(--hair,#ddd);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.18);min-width:260px;padding:6px;';
    if (!list.length) {
      var em = document.createElement('div');
      em.textContent = 'No variables available';
      em.style.cssText = 'padding:8px;color:#888;font-size:12px;';
      menu.appendChild(em);
    }
    list.forEach(function (v) {
      var item = document.createElement('button');
      item.type = 'button';
      item.style.cssText = 'display:block;width:100%;text-align:left;border:0;background:transparent;padding:6px 8px;cursor:pointer;font-size:12.5px;border-radius:6px;';
      item.addEventListener('mouseenter', function () { item.style.background = 'rgba(0,0,0,.06)'; });
      item.addEventListener('mouseleave', function () { item.style.background = 'transparent'; });
      var nm = document.createElement('span'); nm.textContent = v.name || ''; nm.style.fontWeight = '600';
      var ds = document.createElement('span'); ds.textContent = '  ' + (v.preview || v.description || ''); ds.style.color = '#888';
      item.appendChild(nm); item.appendChild(ds);
      item.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        insertIntoActive(v.name || '');
        closeVarPicker();
      });
      menu.appendChild(item);
    });
    document.body.appendChild(menu);
    var rect = btn.getBoundingClientRect();
    menu.style.left = (window.scrollX + rect.left) + 'px';
    menu.style.top  = (window.scrollY + rect.bottom + 4) + 'px';
  }
  // Dismiss the picker on outside click.
  document.addEventListener('click', function (ev) {
    if (ev.target.closest && (ev.target.closest('#jdVarPicker') ||
        ev.target.closest('[data-jd-editor-intent="insert-variable"]'))) return;
    closeVarPicker();
  });
  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest && ev.target.closest('[data-jd-editor-intent]');
    if (!btn) return;
    ev.preventDefault();
    ev.stopPropagation();
    var intent = btn.getAttribute('data-jd-editor-intent');
    if (intent === 'cancel-note') {
      if (window.__jobDetailEditors) window.__jobDetailEditors.clear('note');
      flash('Note cleared');
      return;
    }
    if (intent === 'insert-variable') { openVarPicker(btn); return; }
    if (intent === 'insert-logo') { insertCompanyLogo(); return; }
    if (TOKENS[intent] != null) insertIntoActive(TOKENS[intent]);
  }, true);
})();

// Hook emoji insertion to send insert-text to the iframe when active body has one
(function () {
  const orig = window.jdInsertEmoji;
  if (typeof orig !== 'function') return;
  window.jdInsertEmoji = function (e) {
    const active = document.querySelector('.cmx-body.active');
    const iframe = active && active.querySelector('iframe.cmx-editor-frame');
    if (iframe && window.__jobDetailEditors) {
      const role = iframe.getAttribute('data-cmx-editor-id');
      window.__jobDetailEditors.insertText(role, e);
      const pop = document.getElementById('jdEmojiPop');
      if (pop) pop.classList.remove('open');
      return;
    }
    return orig.apply(this, arguments);
  };
})();

// ── cmx composer: full-payload send/save-draft + cc/bcc toggle + attach chips
(function () {
  const pendingAttachments = { email: [], text: [], call: [], note: [] };

  function activeRole() {
    const a = document.querySelector('.cmx-body.active[data-cmx-body]');
    return a ? a.getAttribute('data-cmx-body') : null;
  }
  function readBind(role, field) {
    const el = document.querySelector('[data-bind-value="composer.' + role + '.' + field + '"]');
    if (!el) return '';
    return (el.value != null ? el.value : '').toString();
  }
  function chipContainer(bodyEl) {
    let c = bodyEl.querySelector('.cmx-attach-chips');
    if (!c) {
      const sendRow = bodyEl.querySelector('.cmx-send-row');
      c = document.createElement('div');
      c.className = 'cmx-attach-chips';
      c.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;padding:0 0 8px 4px;';
      if (sendRow && sendRow.parentNode) sendRow.parentNode.insertBefore(c, sendRow);
    }
    return c;
  }
  function renderChips(role) {
    const body = document.querySelector('.cmx-body[data-cmx-body="' + role + '"]');
    if (!body) return;
    const c = chipContainer(body);
    while (c.firstChild) c.removeChild(c.firstChild);
    (pendingAttachments[role] || []).forEach((a, idx) => {
      const chip = document.createElement('span');
      chip.className = 'cmx-attach-chip';
      chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px;background:#ecfeff;border:1px solid #67e8f9;border-radius:12px;padding:3px 10px;font-size:11px;';
      const name = document.createElement('span');
      name.textContent = '📎 ' + a.name + ' · ' + Math.round((a.size || 0) / 1024) + ' KB';
      const x = document.createElement('button');
      x.type = 'button';
      x.textContent = '×';
      x.style.cssText = 'border:0;background:transparent;cursor:pointer;font-size:14px;line-height:1;color:#0e7490;';
      x.addEventListener('click', () => {
        pendingAttachments[role].splice(idx, 1);
        renderChips(role);
      });
      chip.appendChild(name);
      chip.appendChild(x);
      c.appendChild(chip);
    });
  }
  function clearAttachments(role) {
    pendingAttachments[role] = [];
    renderChips(role);
  }

  // ── F#1588: reply mode ────────────────────────────────────────────────
  // A single parent JobCommunication id is the source of truth. When armed the
  // composer pre-fills To / "Re:" subject and the send payload carries replyToId
  // so the server threads the reply (In-Reply-To/References, quoted original).
  let __replyToId = null;

  function showReplyBanner(toAddr, subject) {
    const pane = document.querySelector('[data-cmx-body="email"] .cmx-pane');
    if (!pane) return;
    hideReplyBanner();
    const banner = document.createElement('div');
    banner.className = 'jd-reply-banner';
    banner.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:12px;color:#065f46;';
    const txt = document.createElement('span');
    const lead = document.createElement('span');
    lead.textContent = '↩ Replying to ';
    const who = document.createElement('strong');
    who.textContent = toAddr || '(unknown)';
    const tail = document.createElement('span');
    tail.textContent = (subject ? ' · "' + subject + '"' : '') + ' — original will be quoted automatically.';
    txt.appendChild(lead);
    txt.appendChild(who);
    txt.appendChild(tail);
    const x = document.createElement('span');
    x.textContent = '×';
    x.title = 'Cancel reply';
    x.style.cssText = 'cursor:pointer;font-weight:700;color:#065f46;font-size:16px;line-height:1;flex:none;';
    x.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const to = document.querySelector('[data-bind-value="composer.email.to"]');
      if (to) to.value = '';
      const subj = document.querySelector('[data-bind-value="composer.email.subject"]');
      if (subj) subj.value = '';
      exitReplyMode();
    });
    banner.appendChild(txt);
    banner.appendChild(x);
    const firstField = pane.querySelector('.cmx-field');
    if (firstField) pane.insertBefore(banner, firstField);
    else pane.appendChild(banner);
  }

  function hideReplyBanner() {
    document.querySelectorAll('.jd-reply-banner').forEach(b => b.remove());
  }

  function enterReplyMode(parentId, toAddr, subject) {
    __replyToId = parentId;
    const tab = document.querySelector('[data-cmx-tab="email"]');
    if (tab) tab.click();
    const to = document.querySelector('[data-bind-value="composer.email.to"]');
    if (to && toAddr) to.value = toAddr;
    const base = (subject || '').replace(/^\s*(re:\s*)+/i, '').trim();
    const subj = document.querySelector('[data-bind-value="composer.email.subject"]');
    if (subj) subj.value = 'Re: ' + base;
    showReplyBanner(toAddr, base ? 'Re: ' + base : '');
  }

  function exitReplyMode() {
    __replyToId = null;
    hideReplyBanner();
  }

  function wireEmailReplyButtons() {
    document.querySelectorAll('.tl-reply[data-jd-reply]').forEach(btn => {
      if (btn.__s1Wired) return;
      btn.__s1Wired = true;
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        enterReplyMode(
          btn.getAttribute('data-jd-reply'),
          btn.getAttribute('data-jd-reply-to'),
          btn.getAttribute('data-jd-reply-subject')
        );
      });
    });
  }

  async function gatherEmailPayload() {
    const body = (window.__jobDetailEditors && window.__jobDetailEditors.get)
      ? await window.__jobDetailEditors.get('email')
      : '';
    const follow = document.querySelector('.cmx-check[data-cmx-check="emailFollow"]');
    return {
      composer: 'email',
      to:       readBind('email', 'to'),
      cc:       readBind('email', 'cc'),
      bcc:      readBind('email', 'bcc'),
      subject:  readBind('email', 'subject'),
      body:     body || '',
      isHtml:   true,
      templateId: readBind('email', 'templateId'),
      attachments: pendingAttachments.email.slice(),
      followUp: !!(follow && follow.classList.contains('on')),
      replyToId: __replyToId  // F#1588: null for a fresh email, parent id when replying
    };
  }
  function gatherTextPayload() {
    const ta = document.getElementById('cmxTextBody');
    const follow = document.querySelector('.cmx-check[data-cmx-check="textFollow"]');
    return {
      composer: 'sms',
      to:       readBind('text', 'to'),
      from:     readBind('text', 'from'),
      message:  (ta && ta.value) || readBind('text', 'body') || '',
      templateId: readBind('text', 'templateId'),
      attachments: pendingAttachments.text.slice(),
      followUp: !!(follow && follow.classList.contains('on'))
    };
  }
  async function gatherCallPayload() {
    const notes = (window.__jobDetailEditors && window.__jobDetailEditors.get)
      ? await window.__jobDetailEditors.get('call')
      : '';
    const follow = document.querySelector('.cmx-check[data-cmx-check="callFollow"]');
    const fuDt = document.getElementById('cmxCallFuDt');
    return {
      composer:  'call',
      direction: readBind('call', 'direction') || 'Outbound',
      outcome:   readBind('call', 'outcome')   || 'Connected',
      duration:  readBind('call', 'duration')  || '0',
      notes:     notes || '',
      followUpEmailTemplateId: readBind('call', 'followUpEmailTemplateId'),
      followUpTextTemplateId:  readBind('call', 'followUpTextTemplateId'),
      createFollowUp: !!(follow && follow.classList.contains('on')),
      followUpDate: (fuDt && fuDt.value) ? new Date(fuDt.value).toISOString() : '',
      attachments: pendingAttachments.call.slice()
    };
  }
  async function gatherNotePayload() {
    const body = (window.__jobDetailEditors && window.__jobDetailEditors.get)
      ? await window.__jobDetailEditors.get('note')
      : '';
    return {
      composer:   'note',
      body:       body || '',
      visibility: 'internal',
      attachments: pendingAttachments.note.slice()
    };
  }
  async function gatherPayloadForRole(role) {
    if (role === 'email') return await gatherEmailPayload();
    if (role === 'text')  return gatherTextPayload();
    if (role === 'call')  return await gatherCallPayload();
    if (role === 'note')  return await gatherNotePayload();
    return null;
  }

  // ── Send / Save Draft for cmx composer (email + text tabs) ────────────
  function wireCmxSendButtons() {
    document.querySelectorAll('.cmx-send-row .cmx-btn.primary[data-comm-action="action:jobDetail.send"]').forEach(btn => {
      if (btn.__s1Wired) return;
      btn.__s1Wired = true;
      btn.addEventListener('click', async (ev) => {
        const body = btn.closest('.cmx-body');
        const role = body && body.getAttribute('data-cmx-body');
        if (role !== 'email' && role !== 'text') return;
        ev.preventDefault();
        ev.stopPropagation();
        await safe('Send', async () => {
          const payload = await gatherPayloadForRole(role);
          if (!payload) return;
          if (role === 'email' && !payload.body.replace(/<[^>]*>/g, '').trim()) {
            flash('Type something first.', 'bad');
            return;
          }
          if (role === 'text' && !payload.message.trim()) {
            flash('Type something first.', 'bad');
            return;
          }
          const r = await comm.action('jobDetail.send', payload);
          if (r && r.ok) {
            if (role === 'email') {
              ['to','cc','bcc','subject'].forEach(f => {
                const el = document.querySelector('[data-bind-value="composer.email.' + f + '"]');
                if (el) el.value = '';
              });
              // Editor iframe content reset is handled by the host on next fixture load.
              exitReplyMode();  // F#1588: clear reply target + banner so next email starts fresh
            } else {
              const ta = document.getElementById('cmxTextBody');
              if (ta) { ta.value = ''; ta.dispatchEvent(new Event('input')); }
            }
            clearAttachments(role);
            flash('Sent ' + (role === 'email' ? 'EMAIL' : 'SMS'));
          } else if (r && r.error) {
            flash(r.error, 'bad');
          }
        });
      });
    });
    document.querySelectorAll('.cmx-send-row .cmx-btn[data-comm-action="action:jobDetail.save-draft"]').forEach(btn => {
      if (btn.__s1Wired) return;
      btn.__s1Wired = true;
      btn.addEventListener('click', async (ev) => {
        const body = btn.closest('.cmx-body');
        const role = body && body.getAttribute('data-cmx-body');
        if (role !== 'email' && role !== 'text') return;
        ev.preventDefault();
        ev.stopPropagation();
        await safe('Save draft', async () => {
          const payload = await gatherPayloadForRole(role);
          if (!payload) return;
          const r = await comm.action('jobDetail.save-draft', payload);
          if (r && r.ok) flash('Draft saved');
          else if (r && r.error) flash(r.error, 'bad');
        });
      });
    });
  }

  // ── Log Call / Save Note commit (call + note panes) ───────────────────
  function wireCmxCommitButtons() {
    var specs = [
      { action: 'jobDetail.log-call-commit', role: 'call', rpc: 'jobDetail.log-call-commit', sent: 'Call logged', empty: 'Add call notes first.' },
      { action: 'jobDetail.save-note',       role: 'note', rpc: 'jobDetail.note.add',         sent: 'Note saved',  empty: 'Type a note first.' }
    ];
    specs.forEach(function (spec) {
      document.querySelectorAll('.cmx-send-row .cmx-btn[data-comm-action="action:' + spec.action + '"]').forEach(function (btn) {
        if (btn.__s1Wired) return;
        btn.__s1Wired = true;
        btn.addEventListener('click', async function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          await safe(spec.sent, async function () {
            var payload = await gatherPayloadForRole(spec.role);
            if (!payload) return;
            var text = (spec.role === 'call' ? payload.notes : payload.body) || '';
            if (!text.replace(/<[^>]*>/g, '').trim()) { flash(spec.empty, 'bad'); return; }
            var r = await comm.action(spec.rpc, payload);
            if (r && r.ok === false) { flash(r.error || (spec.sent + ' failed'), 'bad'); return; }
            clearAttachments(spec.role);
            flash(spec.sent);
          });
        });
      });
    });
  }

  // ── CC/BCC toggle ────────────────────────────────────────────────────
  function wireCcToggle() {
    const btn = document.getElementById('cmxToggleCc');
    const row = document.getElementById('cmxCcRow');
    if (!btn || !row || btn.__s1Wired) return;
    btn.__s1Wired = true;
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const showing = row.style.display !== 'none';
      row.style.display = showing ? 'none' : '';
      btn.classList.toggle('on', !showing);
    });
  }

  // ── follow-up checkbox toggle (visual + state) ────────────────────────
  function wireFollowChecks() {
    document.querySelectorAll('.cmx-check[data-cmx-check]').forEach(el => {
      if (el.__s1Wired) return;
      el.__s1Wired = true;
      el.addEventListener('click', (ev) => {
        ev.preventDefault();
        el.classList.toggle('on');
        // Call tab: reveal the date input and default it to tomorrow 9 AM.
        if (el.getAttribute('data-cmx-check') === 'callFollow') {
          const dt = document.getElementById('cmxCallFuDt');
          if (dt) {
            const on = el.classList.contains('on');
            dt.style.display = on ? '' : 'none';
            if (on && !dt.value) {
              const d = new Date();
              d.setDate(d.getDate() + 1);
              d.setHours(9, 0, 0, 0);
              dt.value = d.toISOString().slice(0, 16);
            }
          }
        }
      });
    });
  }

  // ── cmx Attach button (chip-tracked upload) ──────────────────────────
  function wireCmxAttach() {
    document.querySelectorAll('.cmx-btn[data-comm-action="action:jobDetail.attach"]').forEach(btn => {
      if (btn.__s1Wired) return;
      btn.__s1Wired = true;
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const body = btn.closest('.cmx-body');
        const role = body && body.getAttribute('data-cmx-body');
        if (!role) return;
        let input = btn.__fileInput;
        if (!input) {
          input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.style.display = 'none';
          document.body.appendChild(input);
          btn.__fileInput = input;
          input.addEventListener('change', async () => {
            const files = Array.from(input.files || []);
            for (const f of files) {
              await safe('Upload ' + f.name, async () => {
                const r = await comm.upload(f, { resource: 'jobDetail.attachment' });
                if (r && r.ok && r.id) {
                  pendingAttachments[role].push({ id: r.id, name: r.name || f.name, size: r.size || f.size });
                  renderChips(role);
                  flash('Attached ' + (r.name || f.name));
                } else if (r && r.error) {
                  flash(r.error, 'bad');
                }
              });
            }
            input.value = '';
          });
        }
        input.click();
      });
    });
  }

  // ── F30: live SMS char counter on the cmx Text body ───────────────────
  function wireCmxTextCounter() {
    const ta = document.getElementById('cmxTextBody');
    if (!ta || ta.__s1CountWired) return;
    ta.__s1CountWired = true;
    const update = () => {
      const n = ta.value.length;
      const segs = Math.max(1, Math.ceil(n / 160));
      const count = document.getElementById('cmxTextCount');
      const cap   = document.getElementById('cmxTextCap');
      if (count) count.textContent = String(n);
      if (cap)   cap.textContent = String(segs * 160);
    };
    ta.addEventListener('input', update);
    update();
  }

  // ── F30: ⌘/Ctrl+Enter sends the active Email/Text pane (bound once) ────
  let keydownSendWired = false;
  function wireCmxKeydownSend() {
    if (keydownSendWired) return;
    keydownSendWired = true;
    document.addEventListener('keydown', (e) => {
      if (!((e.metaKey || e.ctrlKey) && e.key === 'Enter')) return;
      const active = document.querySelector('.cmx-body.active[data-cmx-body]');
      if (!active) return;
      const kind = active.getAttribute('data-cmx-body');
      if (kind !== 'email' && kind !== 'text') return;
      const sendBtn = active.querySelector('.cmx-send-row .cmx-btn.primary');
      if (sendBtn) { e.preventDefault(); sendBtn.click(); }
    });
  }

  function wireAll() {
    wireCmxSendButtons();
    wireCmxCommitButtons();
    wireCcToggle();
    wireFollowChecks();
    wireCmxAttach();
    wireCmxTextCounter();
    wireCmxKeydownSend();
    wireEmailReplyButtons();
  }
  wireAll();
  document.addEventListener('s1ui:ready', wireAll);
  const mo = new MutationObserver(wireAll);
  mo.observe(document.body, { childList: true, subtree: true });
})();

// ── #1385: 5-tab Job Notes module (Growth Plan tab) ─────────────────────
// Tab switching + content dots + "Saving…/Saved" pill + autosave for the five
// editor.service1.app iframes. Formatting toolbar buttons are handled by the
// existing EditorBridge (every .cmx-tb[data-cmx-exec] is wired there); this IIFE
// only adds tab UX and persistence. The editor pushes content ONLY in reply to
// `get-content`, so autosave polls the focused notes editor on an interval and
// flushes when focus leaves it — no spontaneous "content" message is emitted on
// typing. DOM is built with createElement/textContent only (CLAUDE rule #2).
(function () {
  const EDITOR_ORIGIN = 'https://editor.service1.app';
  const SVGNS = 'http://www.w3.org/2000/svg';
  const ROLE_TO_TAB = { notesInternal: 'internal', notesCustomer: 'customer', notesCrew: 'crew', notesFeedback: 'feedback', notesDispatch: 'dispatch' };
  const TAB_TO_ROLE = { internal: 'notesInternal', customer: 'notesCustomer', crew: 'notesCrew', feedback: 'notesFeedback', dispatch: 'notesDispatch' };
  const TABS = ['internal', 'customer', 'crew', 'feedback', 'dispatch'];

  const lastSaved = {};   // tab -> last persisted HTML
  const primed = {};      // role -> have we captured the editor's baseline yet
  let lastActiveRole = null;
  let lastFailed = null;  // { tab, role } for retry

  function notesRoot() { return document.querySelector('.notes-mod'); }
  function stripTags(html) {
    return String(html || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
  }
  function fixturesNotes() {
    return (((window.S1 && window.S1.fixtures && window.S1.fixtures.jobDetail) || {}).notes) || {};
  }

  // ── save-state pill ──
  function setPill(state) {
    const root = notesRoot(); if (!root) return;
    const pill = root.querySelector('[data-notes-savestate]'); if (!pill) return;
    pill.classList.remove('saving', 'saved', 'failed');
    pill.classList.add(state);
    const label = pill.querySelector('[data-notes-savelabel]');
    if (label) label.textContent = state === 'saving' ? 'Saving…' : state === 'failed' ? 'Failed to save — click to retry' : 'Saved';
    const svg = pill.querySelector('svg');
    if (svg) {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      if (state === 'saving') {
        const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('cx', '12'); c.setAttribute('cy', '12'); c.setAttribute('r', '9');
        const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('d', 'M12 7v5l3 2');
        svg.appendChild(c); svg.appendChild(p);
      } else if (state === 'failed') {
        const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('cx', '12'); c.setAttribute('cy', '12'); c.setAttribute('r', '9');
        const p1 = document.createElementNS(SVGNS, 'path'); p1.setAttribute('d', 'M12 8v4');
        const p2 = document.createElementNS(SVGNS, 'path'); p2.setAttribute('d', 'M12 16h.01');
        svg.appendChild(c); svg.appendChild(p1); svg.appendChild(p2);
      } else {
        const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('d', 'm5 13 4 4 10-12');
        svg.appendChild(p);
      }
    }
  }

  function setDot(tab, has) {
    const root = notesRoot(); if (!root) return;
    const t = root.querySelector('.nm-tab[data-notes-tab="' + tab + '"]');
    if (t) t.classList.toggle('has-content', !!has);
  }
  function setMetaLine(tab, line) {
    const root = notesRoot(); if (!root) return;
    const m = root.querySelector('[data-notes-meta="' + tab + '"]');
    if (m && typeof line === 'string') m.textContent = line;
  }

  // ── persistence ──
  async function maybeSave(role) {
    const tab = ROLE_TO_TAB[role]; if (!tab) return;
    if (!window.__jobDetailEditors || typeof window.__jobDetailEditors.get !== 'function') return;
    let html;
    try { html = await window.__jobDetailEditors.get(role); } catch (_) { return; }
    html = String(html == null ? '' : html);
    // First read for this editor only establishes the baseline (the editor may
    // normalise the seeded HTML) — never persist on it, so focusing a tab
    // without typing does NOT fabricate a "Last edit" row.
    if (!primed[role]) { primed[role] = true; lastSaved[tab] = html; setDot(tab, stripTags(html).length > 0); return; }
    if (html === lastSaved[tab]) return;
    lastSaved[tab] = html;
    setDot(tab, stripTags(html).length > 0);
    setPill('saving');
    try {
      const r = await comm.save('jobDetail.notes', { tab: tab, content: html });
      if (r && r.ok === false) { lastFailed = { tab: tab, role: role }; setPill('failed'); return; }
      lastFailed = null;
      setPill('saved');
      if (r && typeof r.lastEditLine === 'string') setMetaLine(tab, r.lastEditLine);
    } catch (e) {
      lastFailed = { tab: tab, role: role };
      setPill('failed');
    }
  }

  // Poll the focused notes editor (autosave-as-you-type) and flush on blur.
  function pollActive() {
    if (!notesRoot()) return;
    const ae = document.activeElement;
    const role = (ae && ae.tagName === 'IFRAME') ? ae.getAttribute('data-cmx-editor-id') : null;
    const active = (role && ROLE_TO_TAB[role]) ? role : null;
    if (lastActiveRole && lastActiveRole !== active) maybeSave(lastActiveRole); // focus left → flush
    if (active) maybeSave(active);
    lastActiveRole = active;
  }
  setInterval(pollActive, 1000);

  // ── tab switching (+ flush the editor we are leaving) ──
  document.addEventListener('click', function (ev) {
    const btn = ev.target.closest && ev.target.closest('.notes-mod .nm-tab[data-notes-tab]');
    if (!btn) return;
    const name = btn.getAttribute('data-notes-tab');
    if (lastActiveRole) maybeSave(lastActiveRole);
    const root = notesRoot(); if (!root) return;
    root.querySelectorAll('.nm-tab[data-notes-tab]').forEach(function (x) { x.classList.toggle('active', x.getAttribute('data-notes-tab') === name); });
    root.querySelectorAll('.nm-body[data-notes-tab]').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-notes-tab') === name); });
  });

  // ── Mention button → insert "@" so the editor's mention affordance opens ──
  document.addEventListener('click', function (ev) {
    const m = ev.target.closest && ev.target.closest('.notes-mod [data-notes-mention]');
    if (!m) return;
    ev.preventDefault();
    const tb = m.closest('.cmx-tb[data-cmx-editor-id]');
    if (!tb) return;
    const role = tb.getAttribute('data-cmx-editor-id');
    if (window.__jobDetailEditors) { window.__jobDetailEditors.focus(role); window.__jobDetailEditors.insertText(role, '@'); }
  });

  // ── Retry a failed save by clicking the pill ──
  document.addEventListener('click', function (ev) {
    const pill = ev.target.closest && ev.target.closest('.notes-mod [data-notes-savestate].failed');
    if (!pill || !lastFailed) return;
    const f = lastFailed;
    // Force a re-send: drop the cached value so the next read diffs.
    lastSaved[f.tab] = '\u0000';
    primed[f.role] = true;
    maybeSave(f.role);
  });

  // ── State refresh: re-seed dots + meta lines from the server fixtures ──
  function refreshFromFixtures() {
    if (!notesRoot()) return;
    const notes = fixturesNotes();
    TABS.forEach(function (tab) {
      const t = notes[tab] || {};
      if (lastSaved[tab] === undefined) lastSaved[tab] = String(t.content == null ? '' : t.content);
      setDot(tab, !!t.hasContent);
      if (typeof t.lastEditLine === 'string') setMetaLine(tab, t.lastEditLine);
    });
  }
  document.addEventListener('s1ui:ready', refreshFromFixtures);
  try { window.S1.bus.on('state:replaced', function () { setTimeout(refreshFromFixtures, 0); }); } catch (_) {}
  setTimeout(refreshFromFixtures, 0);
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('jobDetail');
