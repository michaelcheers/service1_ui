// Module: Referrals — new UI wiring (copy/share link + lead lifecycle).
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "referrals", title: "Referrals", reads: ["referrals"], writes: ["referrals"] };

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash;

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["referrals"] || {};
  window.S1.render.bind(document, data);
  applyGates();
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'referrals' } }));
}
load().catch(e => console.warn('[referrals] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

// Re-hide gated per-row buttons after every state push (host pushes state
// directly through communication.mock.js → render.bind, bypassing load()).
try { window.S1.bus.on('state:replaced', applyGates); } catch {}

window.S1.wireStandardPage('referrals');

// ── Hide row-action buttons whose data-gate isn't "true". ──
function applyGates() {
  $$('[data-gate]').forEach(btn => {
    btn.style.display = (btn.getAttribute('data-gate') === 'true') ? '' : 'none';
  });
}

// ── Clipboard helper with a select-the-field fallback. ──
function copyToClipboard(text, onDone) {
  function fallback() {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-1000px;left:-1000px;';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (_) {}
    if (onDone) onDone();
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => { if (onDone) onDone(); }, fallback);
  } else {
    fallback();
  }
}
function flashBtnCopied(btn) {
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = orig; }, 1500);
}

// ── Share-Link modal: opened after adding a referrer, prefilled with the
// new portal link (requirement #2). Also reused by per-row Copy buttons. ──
let shareReferrerId = null;
let shareHasEmail = false;
function openShareLink(opts) {
  opts = opts || {};
  shareReferrerId = opts.referrerId != null ? String(opts.referrerId) : null;
  shareHasEmail = !!opts.hasEmail;
  const modal = document.getElementById('shareLinkModal');
  const input = document.getElementById('shareLinkInput');
  const title = document.getElementById('shareLinkTitle');
  const sub = document.getElementById('shareLinkSub');
  const emailBtn = document.getElementById('shareLinkEmailBtn');
  const emailNote = document.getElementById('shareLinkEmailNote');
  if (input) input.value = opts.url || '';
  if (title) title.textContent = opts.title || 'Share referrer link';
  if (sub) sub.textContent = opts.name
    ? ('Send this unique link to ' + opts.name + ' so they can submit leads straight into your CRM.')
    : 'Send this unique link so they can submit leads straight into your CRM.';
  // Email-link is only possible when the referrer has an email on file.
  const canEmail = shareHasEmail && shareReferrerId != null;
  if (emailBtn) emailBtn.style.display = canEmail ? '' : 'none';
  if (emailNote) emailNote.style.display = canEmail ? '' : 'none';
  if (modal) modal.classList.add('open');
}

// Share-modal buttons.
(function wireShareModal() {
  const copyBtn = document.getElementById('shareLinkCopyBtn');
  const input = document.getElementById('shareLinkInput');
  if (copyBtn) copyBtn.addEventListener('click', () => {
    if (input) input.select();
    copyToClipboard(input ? input.value : '', () => flashBtnCopied(copyBtn));
  });
  const emailBtn = document.getElementById('shareLinkEmailBtn');
  if (emailBtn) emailBtn.addEventListener('click', async () => {
    if (shareReferrerId == null) return;
    try {
      const r = await comm.action('referrals.link.email', { referrerId: shareReferrerId });
      if (r && r.ok === false) { flash(r.error || 'Could not email link'); return; }
      flash('Referral link emailed.');
      load();
    } catch (e) { flash('Email link failed: ' + (e.message || e)); }
  });
})();

// ── Modal forms. ──
window.S1.modal.bindForm('#addReferrerModal', 'referrals.referrer.add', {
  label: 'Add referrer',
  successMsg: 'Referrer added',
  onSuccess: (r) => {
    load();
    // Requirement #2: immediately surface the new referrer's portal link so
    // it can be copied / sent.
    if (r && r.portalUrl) {
      openShareLink({
        title: 'Referrer added — share their link',
        url: r.portalUrl,
        name: r.name,
        referrerId: r.referrerId,
        hasEmail: r.hasEmail
      });
    }
  }
});
window.S1.modal.bindForm('#addReferralModal', 'referrals.referral.add', {
  label: 'Add referral',
  successMsg: 'Referral added',
  validate: (p) => (!p.referrerId ? 'Choose a referrer.' : (!p.customerName ? 'Customer name is required.' : null)),
  onSuccess: () => load()
});
window.S1.modal.bindForm('#editReferrerModal', 'referrals.referrer.update', { label: 'Save', onSuccess: () => load() });

// ── Per-row delegated actions (rows are re-rendered on every state push). ──
document.addEventListener('click', async (ev) => {
  const copyBtn = ev.target.closest('.js-copy-link');
  if (copyBtn) {
    ev.preventDefault();
    copyToClipboard(copyBtn.getAttribute('data-url') || '', () => flashBtnCopied(copyBtn));
    return;
  }
  const emailBtn = ev.target.closest('.js-email-link');
  if (emailBtn) {
    ev.preventDefault();
    const id = emailBtn.getAttribute('data-referrer-id');
    try {
      const r = await comm.action('referrals.link.email', { referrerId: id });
      if (r && r.ok === false) { flash(r.error || 'Could not email link'); return; }
      flash('Referral link emailed.');
      load();
    } catch (e) { flash('Email link failed: ' + (e.message || e)); }
    return;
  }
  const statusBtn = ev.target.closest('.js-lead-status');
  if (statusBtn) {
    ev.preventDefault();
    const id = statusBtn.getAttribute('data-referral-id');
    const status = statusBtn.getAttribute('data-status');
    try {
      const r = await comm.action('referrals.referral.status', { referralId: id, status });
      if (r && r.ok === false) { flash(r.error || 'Update failed'); return; }
      flash('Lead marked ' + status + '.');
      load();
    } catch (e) { flash('Status update failed: ' + (e.message || e)); }
    return;
  }
  const commBtn = ev.target.closest('.js-lead-commission');
  if (commBtn) {
    ev.preventDefault();
    const id = commBtn.getAttribute('data-referral-id');
    const cstatus = commBtn.getAttribute('data-cstatus');
    try {
      const r = await comm.action('referrals.commission.update', { referralId: id, commissionStatus: cstatus });
      if (r && r.ok === false) { flash(r.error || 'Update failed'); return; }
      flash('Commission ' + cstatus.toLowerCase() + '.');
      load();
    } catch (e) { flash('Commission update failed: ' + (e.message || e)); }
    return;
  }
});
