// Module: Storage — hand-wired per element.
const comm = window.S1.comm;
window.comm = comm;
window.__module_manifest = { name: "storage", title: "Storage", reads: ["documents"], writes: ["documents"] };

async function load() {
  const data = (window.S1.fixtures || {})["storage"] || {};
  for (const r of window.__module_manifest.reads) { try { await comm.get(r); } catch {} }
  window.S1.render.bind(document, data);
  document.dispatchEvent(new CustomEvent('s1ui:ready', { detail: { module: 'storage' } }));
}
load().catch(e => console.warn('[storage] init error', e));
window.__module_manifest.reads.forEach(r => { try { comm.subscribe(r, load); } catch {} });

const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const flash = window.S1.flash || ((t) => { const e = document.createElement('div'); e.textContent = t; e.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:9999;'; document.body.appendChild(e); setTimeout(() => e.remove(), 2000); });
const safe = window.S1.safe || (async (l, fn) => { try { return await fn(); } catch (e) { flash(l + ' failed: ' + (e.message || e)); throw e; } });

$$('.subtabs .subtab').forEach((b, i) => {
  b.addEventListener('click', async () => {
    $$('.subtabs .subtab').forEach(x => x.classList.toggle('active', x === b));
    const tabs = ['units', 'customers', 'billing', 'maintenance'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

$$('.page-actions .btn-secondary').filter(b => /floor plan/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', async (ev) => {
    ev.preventDefault();
    const r = await safe('Floor plan', () => comm.action('storage.header-floor-plan', {}));
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

$$('.page-actions .btn-primary').filter(b => /book storage/i.test(b.textContent)).forEach(b => {
  b.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.S1.modal.open('#newStorModal');
  });
});

$$('.fchip').forEach((c, i) => {
  c.addEventListener('click', async () => {
    $$('.fchip').forEach(x => x.classList.toggle('active', x === c));
    const sizes = ['all', '5x5', '5x10', '10x10', '10x20'];
    /* UI-only: visual toggle handled in-page; no server save */
  });
});

$$('input.search-input').forEach(inp => {
  let t = null;
  inp.addEventListener('input', () => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {}, 300);
  });
});

$$('.seg button').forEach(b => {
  b.addEventListener('click', async () => {
    $$('.seg button').forEach(x => x.classList.toggle('active', x === b));
    await safe('View', () => comm.save('storage.sort', { value: b.textContent.trim() }));
  });
});

document.addEventListener('click', async (ev) => {
  const card = ev.target.closest('[data-bind="units"] > div, [data-bind="customers"] > div');
  if (!card) return;
  const id = card.getAttribute('data-record-id');
  if (!id) return;
  const remove = ev.target.closest('.unit-delete');
  if (remove) {
    if (!window.confirm('Delete this booking?')) return;
    await safe('Delete', async () => {
      await comm.action('storage.delete', { id });
      card.remove(); flash('Deleted');
    });
    return;
  }
  await safe('Open', async () => {
    const r = await comm.action('storage.open', { id });
    if (r && r.navigateTo) window.location.href = r.navigateTo;
  });
});

// v12 modals
(function(){
  const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
  $$('[data-st-open]').forEach(b=>b.addEventListener('click',(e)=>{e.preventDefault();window.S1.modal.open('#'+b.getAttribute('data-st-open'));}));
  window.S1.modal.bindForm('#newStorModal','storage.unit.create',{label:'Create unit'});
  window.S1.modal.bindForm('#moveStorModal','storage.move',{label:'Move'});
  window.S1.modal.bindForm('#releaseStorModal','storage.release',{label:'Release'});
  window.S1.modal.bindForm('#billCycleModal','storage.bill',{label:'Bill cycle'});
})();

// Install document-level click handlers ([data-comm-action] dispatcher,
// tab/panel switcher, etc.) provided by core/standard-page.js.
if (window.S1 && window.S1.wireStandardPage) window.S1.wireStandardPage('storage');
