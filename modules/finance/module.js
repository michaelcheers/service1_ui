// Module: Finance — hand-wired.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "finance", title: "Finance", reads: ["finance/invoices","finance/payments"], writes: ["finance/invoices"] };

async function load() {
  const data = (window.S1.fixtures || {})["finance"] || {};
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'finance' } }));
}
load().catch(e => console.warn('[finance] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

// Sub-tabs: PNL / Detailed P&L / Payroll / Petty Cash / Expenses / Banking / Tax
// Visual switch (.fin-pane.active toggle) is wired by the inline script in
// index.html; here we (a) persist the active tab to the session and (b) tag
// the body so module-level handlers know which pane is in view.
$$('.fin-tab[data-tab]').forEach((b) => {
  b.addEventListener('click', async () => {
    const tab = b.getAttribute('data-tab');
    document.body.setAttribute('data-active-fin-tab', tab);
    try { await comm.save('finance.tab', { tab }); } catch {}
  });
});
// Surface initial active tab for tests + analytics
(function () {
  const t0 = document.querySelector('.fin-tab.active[data-tab]');
  if (t0) document.body.setAttribute('data-active-fin-tab', t0.getAttribute('data-tab'));
})();

// Month range / period picker — wired to a real handler. The existing
// data-period chips (Week / Month / Quarter / Year) already POST
// save:finance.period; we additionally fire action:finance.setRange so the
// server can recompute and push back a fresh FinanceState. The mock-mode
// iframe handles {ok:true, state} by re-binding via the state:replaced path.
async function applyFinancePeriod(period) {
  if (!period) return;
  try {
    const r = await comm.action('finance.setRange', { period });
    if (r && r.ok && r.state) {
      try {
        if (window.S1 && window.S1.fixtures) window.S1.fixtures['finance'] = r.state;
        if (window.S1 && window.S1.store && typeof window.S1.store.replaceAll === 'function') {
          window.S1.store.replaceAll(r.state);
        }
        if (window.S1 && window.S1.bus) window.S1.bus.emit('state:replaced', r.state);
        if (window.S1 && window.S1.render && typeof window.S1.render.bind === 'function') {
          window.S1.render.bind(document, r.state);
        }
      } catch (e) { console.warn('[finance] state apply failed', e); }
      // Surface the active period and headline numbers on the body for tests
      document.body.setAttribute('data-active-period', period);
      if (r.state.summary) document.body.setAttribute('data-finance-summary', r.state.summary);
    }
  } catch (e) { console.warn('[finance] setRange failed', e); }
}
$$('[data-period]').forEach(b => {
  if (b.tagName === 'TR') return;
  b.addEventListener('click', () => {
    const p = b.getAttribute('data-period');
    applyFinancePeriod(p);
  });
});
// Also intercept the existing save:finance.period chips so the visual filter
// triggers a real range recompute (the chips don't have data-period; they use
// data-comm-action="save:finance.period" with a JSON payload).
$$('[data-comm-action="save:finance.period"]').forEach(b => {
  b.addEventListener('click', () => {
    let p = 'month';
    try { p = (JSON.parse(b.getAttribute('data-payload') || '{}').period) || 'month'; } catch {}
    applyFinancePeriod(p);
  });
});

// Export
$$('.page-actions .btn-secondary').filter(b => /^export$/i.test(b.textContent.trim())).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe('Export', () => comm.action('finance.export', {}));
    if (r && r.downloadUrl) window.location.href = r.downloadUrl;
  });
});

// "+ New transaction" / actions toolbar — v12 modals
$$('.page-actions .btn-primary').filter(b => /new transaction|record transaction/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', (ev) => { ev.preventDefault(); window.S1.modal.open('#recordTransactionModal'); });
});
$$('[data-finance-open]').forEach(b => {
  b.addEventListener('click', (ev) => { ev.preventDefault(); window.S1.modal.open('#' + b.getAttribute('data-finance-open')); });
});

window.S1.modal.bindForm('#addExpenseModal',         'finance.expense.create',     { label: 'Add expense',     onSuccess: () => load() });
window.S1.modal.bindForm('#newPeriodModal',          'finance.period.create',      { label: 'New period',      onSuccess: () => load() });
window.S1.modal.bindForm('#addStaffEntryModal',      'finance.staff.create',       { label: 'Add staff',       onSuccess: () => load() });
window.S1.modal.bindForm('#miscPaymentModal',        'finance.miscPayment.create', { label: 'Misc payment',    onSuccess: () => load() });
window.S1.modal.bindForm('#recordTransactionModal',  'finance.transaction.record', { label: 'Record txn',      onSuccess: () => load() });
window.S1.modal.bindForm('#addCategoryModal',        'finance.category.create',    { label: 'Add category',    onSuccess: () => load() });
window.S1.modal.bindForm('#addMetricModal',          'finance.metric.create',      { label: 'Add metric',      onSuccess: () => load() });
window.S1.modal.bindForm('#addTaxModal',             'finance.tax.create',         { label: 'Add tax',         onSuccess: () => load() });

// "Full statement →" / "All A/R →" / "All A/P →" section-links
$$('.section-link').forEach(a => {
  a.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const label = a.textContent.trim();
    await safe('Open', async () => {
      const r = await comm.action('finance.open', { section: label });
      if (r && r.navigateTo) window.location.href = r.navigateTo;
    });
  });
});

// Row click in any data-bind list → open detail
document.addEventListener('click', async (ev) => {
  const row = ev.target.closest('[data-record-id]');
  if (!row || !row.closest('[data-bind]')) return;
  const id = row.getAttribute('data-record-id');
  if (!id) return;
  await safe('Open', async () => {
    const r = await comm.action('finance.open', { id });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// Upload receipts — open the native file picker, then upload each file via
// comm.upload. Not a single-RPC action; uploads happen per file.
$$('[data-fin-upload-receipts]').forEach(b => {
  b.addEventListener('click', () => {
    const input = document.getElementById('fin-receipts-input');
    if (input) input.click();
  });
});
const receiptsInput = document.getElementById('fin-receipts-input');
if (receiptsInput) {
  receiptsInput.addEventListener('change', async () => {
    const files = Array.from(receiptsInput.files || []);
    for (const f of files) {
      try { await comm.upload(f, { resource: 'finance.receipt' }); flash('Uploaded ' + f.name); }
      catch (e) { flash('Upload failed: ' + (e.message || e)); }
    }
    receiptsInput.value = '';
  });
}

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('finance');
