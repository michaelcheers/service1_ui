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

  // Move mail-kind body → bodyHtml so only emails get the sandboxed-iframe
  // render path; SMS/call/note keep plain-text body rendering.
  try {
    const sections = data && data.timeline && data.timeline.daySections;
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

  window.S1.render.bind(document, data);

  // Seed the email composer's "To" field from customer.email when empty.
  const toInput = document.querySelector('input[data-bind-value="composer.email.to"]');
  const leadEmail = (data.customer && data.customer.email) || '';
  if (toInput && !toInput.value && leadEmail) toInput.value = leadEmail;

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

// ── 1) Top-level tabs ───────────────────────────────────────────────────
$$('.tab[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    $$('.tab[data-tab]').forEach(b => b.classList.toggle('active', b === btn));
    $$('.tab-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === target));
  });
});

// ── 2) Composer tabs (SMS / Email / Note / Log call) ────────────────────
let composerMode = 'sms';
const composerTabs = $$('.composer-tabs .composer-tab');
const composerPlaceholders = {
  sms:   'Reply by SMS…',
  email: 'Reply by email — type subject on the next line',
  note:  'Add an internal note…',
  call:  'Log a phone call with notes…'
};
const composerKey = ['sms', 'email', 'note', 'call'];
composerTabs.forEach((b, i) => {
  b.addEventListener('click', () => {
    composerTabs.forEach(x => x.classList.toggle('active', x === b));
    composerMode = composerKey[i] || 'sms';
    const ta = $('.composer textarea[name="message"]');
    if (ta) ta.placeholder = composerPlaceholders[composerMode];
    const counter = $('.composer-foot .right .muted');
    if (counter) counter.textContent = composerMode === 'sms' ? '0/160' : '0';
  });
});

// Live char-count + ⌘↵ to send
(function () {
  const ta = $('.composer textarea[name="message"]');
  const counter = $('.composer-foot .right .muted');
  if (!ta) return;
  ta.addEventListener('input', () => {
    if (!counter) return;
    counter.textContent = composerMode === 'sms' ? (ta.value.length + '/160') : String(ta.value.length);
  });
  ta.addEventListener('keydown', (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') {
      ev.preventDefault();
      const send = $('.composer .btn-primary');
      if (send) send.click();
    }
  });
})();

// ── 3) Send button ──────────────────────────────────────────────────────
(function () {
  const send = $('.composer .btn-primary');
  if (!send) return;
  send.setAttribute('data-comm-action', 'action:jobDetail.send:');
  send.__s1Wired = true;
  send.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const ta = $('.composer textarea[name="message"]');
    const body = (ta && ta.value || '').trim();
    if (!body) { flash('Type something first.', 'bad'); return; }
    await safe('Send', async () => {
      const tplKey = composerMode === 'email' ? 'composer.email.templateId'
                   : composerMode === 'sms'   ? 'composer.text.templateId' : null;
      const tplEl  = tplKey ? document.querySelector('[data-bind-value="' + tplKey + '"]') : null;
      const tplId  = (tplEl && tplEl.value) || '';
      const subjEl = composerMode === 'email' ? document.querySelector('[data-bind-value="composer.email.subject"]') : null;
      const subject = (subjEl && subjEl.value) || '';
      const r = await comm.action('jobDetail.send', { composer: composerMode, message: body, templateId: tplId, subject: subject });
      if (r && r.ok) {
        if (ta) ta.value = '';
        const counter = $('.composer-foot .right .muted');
        if (counter) counter.textContent = composerMode === 'sms' ? '0/160' : '0';
        flash('Sent ' + composerMode.toUpperCase());
      }
    });
  });
})();

// ── 4) Save draft ───────────────────────────────────────────────────────
(function () {
  const draft = $$('.composer .btn-secondary').find(b => /save draft/i.test(b.textContent));
  if (!draft) return;
  draft.setAttribute('data-comm-action', 'action:jobDetail.save-draft:');
  draft.__s1Wired = true;
  draft.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const ta = $('.composer textarea[name="message"]');
    const body = ta && ta.value || '';
    await safe('Save draft', async () => {
      await comm.action('jobDetail.save-draft', { composer: composerMode, message: body });
      flash('Draft saved');
    });
  });
})();

// ── 5) Attach icon-btn → file picker → comm.upload ──────────────────────
(function () {
  const attach = $$('.composer-foot .icon-btn[title="Attach"]')[0];
  if (!attach) return;
  let fileInput = $('#jd-attach-input');
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.id = 'jd-attach-input';
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
  }
  attach.addEventListener('click', (ev) => { ev.preventDefault(); fileInput.click(); });
  fileInput.addEventListener('change', async () => {
    const files = Array.from(fileInput.files || []);
    for (const f of files) {
      await safe('Upload ' + f.name, async () => {
        await comm.upload(f, { resource: 'jobDetail.attachment' });
        flash('Uploaded ' + f.name);
      });
    }
    fileInput.value = '';
  });
})();

// ── 6) Insert template ──────────────────────────────────────────────────
(function () {
  const btn = $$('.composer-foot .icon-btn[title="Insert template"]')[0];
  if (!btn) return;
  btn.addEventListener('click', async (ev) => {
    ev.preventDefault();
    flash('Pick a template from the templates picker');
  });
})();

// ── 7) Emoji icon-btn — insert a default thumbs-up; no popup picker. ─────
(function () {
  const btn = $$('.composer-foot .icon-btn[title="Emoji"]')[0];
  if (!btn) return;
  btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    const ta = $('.composer textarea[name="message"]');
    if (!ta) return;
    const choice = '👍';
    const pos = ta.selectionStart || ta.value.length;
    ta.value = ta.value.slice(0, pos) + choice + ta.value.slice(pos);
    ta.dispatchEvent(new Event('input'));
    ta.focus();
  });
})();

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

$$('.timeline-head .filter-chip').forEach((chip, i) => {
  chip.addEventListener('click', () => {
    $$('.timeline-head .filter-chip').forEach(c => c.classList.toggle('active', c === chip));
    const kind = ['all','call','sms','mail','note'][i] || 'all';
    $$('.tab-pane[data-pane="communication"] .tl-item, .tab-pane[data-pane="communication"] .tl-row').forEach(row => {
      if (kind === 'all') { row.style.display = ''; return; }
      row.style.display = row.className.toLowerCase().includes(kind) ? '' : 'none';
    });
  });
});

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

// ── 12) Set follow-up ───────────────────────────────────────────────────
(function () {
  const link = $$('.cust-header .link').find(a => /follow-up/i.test(a.textContent));
  if (!link) return;
  link.addEventListener('click', (ev) => {
    ev.preventDefault();
    flash('Set follow-up from the job details modal');
  });
})();

// ── 13) Claim lead ──────────────────────────────────────────────────────
$$('button').filter(b => /claim lead/i.test(b.textContent.trim())).forEach(b => {
  b.setAttribute('data-comm-action', 'action:jobDetail.claim-lead:');
  b.__s1Wired = true;
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    await safe('Claim lead', async () => {
      await comm.action('jobDetail.claim-lead', {});
      flash('Lead claimed');
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
    const id = ((window.S1.fixtures || {}).jobDetail && window.S1.fixtures.jobDetail.deal && window.S1.fixtures.jobDetail.deal.id) || '';
    await safe('Book lead', async () => {
      const r = await comm.action('jobDetail.book-lead', { id });
      flash('Booking…');
      if (r && r.navigateTo) window.location.href = r.navigateTo;
    });
  });
});

// ── 16) Mark lost / Mark bad lead ───────────────────────────────────────
$$('button').filter(b => /^mark lost$/i.test(b.textContent.trim())).forEach(b => {
  b.setAttribute('data-comm-action', 'action:jobDetail.mark-lost:');
  b.__s1Wired = true;
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#jdMarkLostModal');
  });
});
$$('button').filter(b => /mark bad lead/i.test(b.textContent.trim())).forEach(b => {
  b.setAttribute('data-comm-action', 'action:jobDetail.mark-bad-lead:');
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
  const selects = $$('select.gp2-input', root);
  const numbers = $$('input.gp2-input[type="number"]', root);
  const fields = [
    { el: selects[0], key: 'jobType'  },
    { el: selects[1], key: 'size'     },
    { el: selects[2], key: 'crewSize' },
    { el: numbers[0], key: 'trucks'   }
  ].filter(f => f.el);
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
$$('.s-action, .gp2-add-stop').filter(b => /add stop/i.test(b.textContent)).forEach(btn => {
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
  $$('.gp2-stop').forEach((stop, i) => {
    const tag = stop.querySelector('.gp2-stop-tag');
    if (!tag) return;
    tag.textContent = letters[i] || (i + 1);
    // Drop any old letter class, then set the new one.
    cls.forEach(c => tag.classList.remove(c));
    if (cls[i]) tag.classList.add(cls[i]);
  });
}
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
  presets.forEach(p => {
    const node = tmpl.content.firstElementChild.cloneNode(true);
    const label = node.querySelector('[data-quick-label]');
    if (label) label.textContent = p.name || p.chargeType || 'Charge';
    const ic = node.querySelector('[data-quick-icon]');
    const c  = PALETTE[p.name] || PALETTE[p.chargeType] || { bg: 'var(--surface-2)', fg: 'var(--ink-2)' };
    if (ic) { ic.style.background = c.bg; ic.style.color = c.fg; ic.textContent = (p.name || p.chargeType || '?').charAt(0); }
    if (p.id != null) node.setAttribute('data-preset-id', String(p.id));
    node.setAttribute('data-preset-name',       p.name || '');
    node.setAttribute('data-preset-chargetype', p.chargeType || p.name || '');
    node.setAttribute('data-preset-rate',       String(p.defaultRate != null ? p.defaultRate : 0));
    node.setAttribute('data-preset-qty',        String(p.defaultQty  != null ? p.defaultQty  : 1));
    node.__s1Wired = true;
    node.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const pid = node.getAttribute('data-preset-id');
      const payload = pid
        ? { presetId: Number(pid) }
        : { chargeType: node.getAttribute('data-preset-chargetype'),
            itemName:   node.getAttribute('data-preset-name'),
            rate:       parseFloat(node.getAttribute('data-preset-rate')),
            quantity:   parseFloat(node.getAttribute('data-preset-qty')) };
      await safe('Quick charge', async () => {
        await comm.action('jobDetail.add-quick-charge', payload);
        flash('Added ' + (node.getAttribute('data-preset-name') || 'charge'));
      });
    });
    host.appendChild(node);
  });
}
document.addEventListener('s1ui:ready', renderQuickCharges);
if (window.S1 && window.S1.bus && typeof window.S1.bus.on === 'function') {
  window.S1.bus.on('state:replaced', renderQuickCharges);
}
renderQuickCharges();

$$('.gp-row-x').forEach(btn => {
  btn.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const row = btn.closest('tr[data-record-id], tr');
    const id  = row && row.getAttribute && row.getAttribute('data-record-id');
    if (!id) { if (row) row.remove(); return; }
    if (!window.confirm('Delete this line?')) return;
    await safe('Delete line', async () => {
      await comm.action('jobDetail.delete-charge', { id });
      if (row) row.remove();
      flash('Line deleted');
    });
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

// ── 21) Files tab: filter chips + Upload ────────────────────────────────
(function () {
  const filesPane = $('.tab-pane[data-pane="files"]');
  if (!filesPane) return;
  $$('.filter-chip', filesPane).forEach((chip, i) => {
    chip.addEventListener('click', () => {
      $$('.filter-chip', filesPane).forEach(c => c.classList.toggle('active', c === chip));
      const kind = ['all', 'photo', 'pdf', 'signed'][i] || 'all';
      $$('.file-tile, .file-card', filesPane).forEach(el => {
        el.style.display = kind === 'all' || el.className.toLowerCase().includes(kind) ? '' : 'none';
      });
    });
  });
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
    if (/upload/i.test(b.textContent) || b.classList.contains('file-upload'))
      b.addEventListener('click', pickFiles);
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
(function () {
  const root = $('.tab-pane[data-pane="accounting"]');
  if (!root) return;
  $$('.acct-tab', root).forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.acct-tab', root).forEach(t => t.classList.toggle('active', t === tab));
      const label = tab.textContent.trim().toLowerCase();
      $$('.acct-table tbody tr', root).forEach(row => {
        if (label === 'revenue') { row.style.display = ''; return; }
        const cat = (row.querySelector('td') && row.querySelector('td').textContent || '').toLowerCase();
        const wants = label === 'expenses' ? /(material|rental|fuel|expense|travel|packing|specialty|storage)/
                    : label === 'wages'    ? /(labor|wage)/
                    : label === 'tax'      ? /(tax)/ : /./;
        row.style.display = wants.test(cat) ? '' : 'none';
      });
    });
  });
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
    btn.classList.toggle('pinned');
    flash('Note pin toggled');
  });
});

// ── 23) Generic fallback for any [data-comm-action] not wired above ─────
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-comm-action]'); if (!t) return;
  if (t.__s1Wired) return;
  const [kind, resource, id] = t.getAttribute('data-comm-action').split(':');
  const payload = (window.S1.collectPayload || function () { return {}; })(t);
  if (kind === 'save')   comm.save(resource, payload);
  else if (kind === 'delete') comm.delete(resource, id);
  else if (kind === 'action') comm.action(resource, payload);
});

// ── 24) AI fab ──────────────────────────────────────────────────────────
(function () {
  const fab = document.querySelector('[data-ai-fab]');
  if (!fab) return;
  fab.addEventListener('click', (ev) => {
    ev.preventDefault();
  });
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
    ['#finalizeModal',          'job.finalize',           {}],
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
    ['#jdAddContactModal',      'jobDetail.add-contact',  {}],
    ['#jdVideoModal',           'job.video.request',      {}],
    ['#jdMarkLostModal',        'job.markLost',           {}],
    ['#jdMarkBadModal',         'jobDetail.mark-bad-lead', { successMsg: 'Marked as bad lead' }],
    ['#jdBookModal',            'jobDetail.book-lead', {
      validate: function (p) { if (!p.scheduledDate) return 'Scheduled date is required'; return null; },
      successMsg: 'Lead booked'
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
    ['#jdScheduleModal',        'jobDetail.schedule', {
      transform: function (p) {
        return {
          scheduledDate: p.date || '',
          time:          p.time || '',
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

// B1: charge the customer's saved card on file (Stripe) from the payment modal.
(function () {
  var btn = document.getElementById('jdChargeCardBtn');
  if (!btn) return;
  btn.addEventListener('click', async function (ev) {
    ev.preventDefault();
    var modal = btn.closest('.jd-overlay');
    var amtEl = modal && modal.querySelector('[name="amount"]');
    var notesEl = modal && modal.querySelector('[name="notes"]');
    var amount = amtEl ? amtEl.value : '';
    if (!(Number(amount) > 0)) { flash('Enter an amount first', 'bad'); return; }
    await safe('Charge card', async function () {
      var r = await comm.action('jobDetail.charge-customer', {
        amount: amount,
        description: (notesEl && notesEl.value) || 'Job payment'
      });
      if (r && r.ok === false) { flash(r.error || 'Charge failed', 'bad'); return; }
      flash('Card charged');
      try { window.S1.modal.close ? window.S1.modal.close('#jdPaymentModal') : (window.jdCloseModal && window.jdCloseModal('jdPaymentModal')); } catch (_) {}
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
  // A15: dead buttons with no backend (+ New deal, Save Template) — drop the
  // attribute so they no longer fire an unhandled RPC, and mark wired so the
  // generic fallback skips them.
  all('[data-comm-action="action:jobDetail.new-deal"], [data-comm-action="action:jobDetail.save-template"]').forEach(function (b) {
    b.removeAttribute('data-comm-action');
    b.__s1Wired = true;
  });
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
      setVal('[data-bind-value="composer.email.body"]',    rec ? (rec.body || '')    : '');
      setVal('[data-bind-value="composer.email.templateId"]', id);
    } else if (bucket === 'text') {
      setVal('[data-bind-value="composer.text.body"]',     rec ? (rec.body || '')    : '');
      setVal('[data-bind-value="composer.text.templateId"]', id);
    } else if (bucket === 'callEmail') {
      setVal('[data-bind-value="composer.call.followUpEmailTemplateId"]', id);
    } else if (bucket === 'callText') {
      setVal('[data-bind-value="composer.call.followUpTextTemplateId"]', id);
    }
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
      followUp: !!(follow && follow.classList.contains('on'))
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
    return {
      composer:  'call',
      direction: readBind('call', 'direction') || 'Outbound',
      outcome:   readBind('call', 'outcome')   || 'Connected',
      duration:  readBind('call', 'duration')  || '0',
      notes:     notes || '',
      followUpEmailTemplateId: readBind('call', 'followUpEmailTemplateId'),
      followUpTextTemplateId:  readBind('call', 'followUpTextTemplateId'),
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

  function wireAll() {
    wireCmxSendButtons();
    wireCmxCommitButtons();
    wireCcToggle();
    wireFollowChecks();
    wireCmxAttach();
  }
  wireAll();
  document.addEventListener('s1ui:ready', wireAll);
  const mo = new MutationObserver(wireAll);
  mo.observe(document.body, { childList: true, subtree: true });
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('jobDetail');
