// Module: Finance — hand-wired.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "finance", title: "Finance", reads: ["finance/invoices","finance/payments"], writes: ["finance/invoices"] };

async function load() {
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  const data = (window.S1.fixtures || {})["finance"] || {};

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
window.S1.modal.bindForm('#newPeriodModal',          'finance.period.create',      { label: 'New period',      onSuccess: (r) => { if (r && r.state) applyPayrollState(r.state); if (r && r.message) flash(r.message); } });
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

// ─────────────────────────────── PAYROLL ───────────────────────────────
// Apply a server-pushed FinanceState: cache it, broadcast, and re-bind the DOM
// so rows3/rows4/rows5/rows10/rows11/rows12 + wageStatement.* refresh in place.
function applyPayrollState(state) {
  if (!state) return;
  try {
    if (window.S1 && window.S1.fixtures) window.S1.fixtures['finance'] = state;
    if (window.S1 && window.S1.store && typeof window.S1.store.replaceAll === 'function') window.S1.store.replaceAll(state);
    if (window.S1 && window.S1.bus) window.S1.bus.emit('state:replaced', state);
    if (window.S1 && window.S1.render && typeof window.S1.render.bind === 'function') window.S1.render.bind(document, state);
  } catch (e) { console.warn('[finance] payroll state apply failed', e); }
}
// Open an app URL in a new browser tab. The module iframe is cross-origin, so
// a relative <a href> would resolve against the static UI host (404). Ask the
// business_card host to open it instead (s1ui:open-url → window.open new tab);
// fall back to window.open when running standalone.
function openHostUrl(url) {
  if (!url) return;
  let embedded = false;
  try { embedded = (window.parent && window.parent !== window); } catch (_) { embedded = true; }
  if (embedded) {
    let origin = '*';
    try { const m = document.querySelector('meta[name="s1ui-host-origin"]'); if (m && m.getAttribute('content')) origin = m.getAttribute('content'); } catch (_) {}
    try { window.parent.postMessage({ type: 's1ui:open-url', url: url }, origin); return; } catch (_) {}
  }
  window.open(url, '_blank', 'noopener');
}

function currentWageStatement() {
  return (window.S1 && window.S1.fixtures && window.S1.fixtures.finance && window.S1.fixtures.finance.wageStatement) || {};
}
function toggleWsEmpty(state) {
  const rows11 = (state && state.rows11) || [];
  const e = document.getElementById('wsJobsEmpty');
  if (e) e.style.display = rows11.length ? 'none' : 'block';
}

const payroll = {
  async openPeriod(periodId) {
    await safe('Open period', async () => {
      const r = await comm.action('finance.payroll.periodDetail', { periodId: Number(periodId) });
      if (r && r.ok) {
        applyPayrollState(r.state);
        const t = document.getElementById('payrollDetailTitle'); if (t) t.textContent = r.title || 'Payroll Period';
        const sub = document.getElementById('payrollDetailSub'); if (sub) sub.textContent = r.sub || '';
        if (typeof showPayrollView === 'function') showPayrollView('detail');
      }
    });
  },
  async openStatement(periodId, userId) {
    await safe('Open statement', async () => {
      const r = await comm.action('finance.payroll.wageStatement', { periodId: Number(periodId), userId: Number(userId) });
      if (r && r.ok) {
        applyPayrollState(r.state);
        toggleWsEmpty(r.state);
        if (typeof showPayrollView === 'function') showPayrollView('statement');
      }
    });
  },
  async markPaid(entryId, periodId) {
    await safe('Mark paid', async () => {
      const r = await comm.action('finance.payroll.markPaid', { entryId: Number(entryId) });
      if (r && r.ok) { flash('Marked as paid'); if (periodId) await payroll.openPeriod(periodId); }
    });
  },
  async closePeriod(periodId) {
    if (!confirm('Close this payroll period? Totals will be finalized.')) return;
    await safe('Close period', async () => {
      const r = await comm.action('finance.period.close', { periodId: Number(periodId) });
      if (r && r.ok) { applyPayrollState(r.state); flash('Period closed'); }
    });
  },
  async recompute() {
    await safe('Recompute', async () => {
      const r = await comm.action('finance.recompute-crew-wages-from-finalized-jobs', {});
      if (r && r.ok) { applyPayrollState(r.state); flash(r.message || 'Recomputed crew wages'); }
    });
  },
  async addDeduction() {
    const ws = currentWageStatement();
    const typeEl = document.getElementById('wsDedType');
    const amtEl = document.getElementById('wsDedAmount');
    const noteEl = document.getElementById('wsDedNote');
    const type = typeEl ? typeEl.value : 'Deduct';
    const amount = parseFloat(amtEl ? amtEl.value : '');
    const notes = noteEl ? noteEl.value : '';
    if (!amount || amount <= 0) { flash('Enter an amount greater than zero'); return; }
    await safe('Add', async () => {
      const r = await comm.action('finance.payroll.addDeduction', { periodId: Number(ws.periodId), userId: Number(ws.userId), type, amount, notes });
      if (r && r.ok) {
        applyPayrollState(r.state); toggleWsEmpty(r.state);
        if (amtEl) amtEl.value = ''; if (noteEl) noteEl.value = '';
        flash((type === 'Pay' ? 'Bonus' : 'Deduction') + ' added');
      }
    });
  },
  async removeDeduction(miscId) {
    const ws = currentWageStatement();
    await safe('Remove', async () => {
      const r = await comm.action('finance.payroll.removeDeduction', { miscId: Number(miscId), periodId: Number(ws.periodId), userId: Number(ws.userId) });
      if (r && r.ok) { applyPayrollState(r.state); toggleWsEmpty(r.state); flash('Removed'); }
    });
  }
};
window.S1FinancePayroll = payroll;

// Capture-phase: intercept the period-row "Close" button before the row's
// inline onclick (which would otherwise drill into the period).
document.addEventListener('click', (ev) => {
  const cb = ev.target.closest('.payroll-close-btn');
  if (cb) { ev.preventDefault(); ev.stopPropagation(); payroll.closePeriod(cb.getAttribute('data-period-id')); }
}, true);

// Bubble-phase delegated handlers for the payroll detail + wage statement.
document.addEventListener('click', (ev) => {
  const link = ev.target.closest('.payroll-emp-link');
  if (link) { ev.preventDefault(); payroll.openStatement(link.getAttribute('data-period-id'), link.getAttribute('data-user-id')); return; }

  const mbtn = ev.target.closest('.payroll-menu-btn');
  if (mbtn) {
    ev.preventDefault(); ev.stopPropagation();
    const menu = mbtn.parentElement.querySelector('.payroll-menu');
    const isOpen = menu && menu.classList.contains('open');
    document.querySelectorAll('.payroll-menu.open').forEach(m => m.classList.remove('open'));
    if (menu && !isOpen) menu.classList.add('open');
    return;
  }

  const item = ev.target.closest('.payroll-menu-item');
  if (item) {
    ev.preventDefault();
    document.querySelectorAll('.payroll-menu.open').forEach(m => m.classList.remove('open'));
    const act = item.getAttribute('data-payroll-act');
    if (act === 'statement') payroll.openStatement(item.getAttribute('data-period-id'), item.getAttribute('data-user-id'));
    else if (act === 'markPaid') payroll.markPaid(item.getAttribute('data-entry-id'), item.getAttribute('data-period-id'));
    return;
  }

  const openLink = ev.target.closest('[data-open-url]');
  if (openLink) { ev.preventDefault(); openHostUrl(openLink.getAttribute('data-open-url')); return; }

  const rm = ev.target.closest('.ws-remove');
  if (rm) { ev.preventDefault(); payroll.removeDeduction(rm.getAttribute('data-misc-id')); return; }

  const recomputeBtn = ev.target.closest('#payrollRecomputeBtn');
  if (recomputeBtn) { ev.preventDefault(); payroll.recompute(); return; }

  const dedAdd = ev.target.closest('#wsDedAdd');
  if (dedAdd) { ev.preventDefault(); payroll.addDeduction(); return; }

  // Click outside any menu closes open menus.
  if (!ev.target.closest('.payroll-menu')) document.querySelectorAll('.payroll-menu.open').forEach(m => m.classList.remove('open'));
});

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('finance');
