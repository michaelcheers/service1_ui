// Shared Google Places autocomplete helper.
// Lazy-loads the Google Maps JS once, then attaches an Autocomplete instance
// to every `<input data-places-autocomplete>` it finds. Re-scans on the
// `s1ui:ready` DOM event and on the `state:replaced` bus event so dynamically
// rendered inputs get enhanced. Free typing still works — Autocomplete just
// augments the existing input.
(function () {
  const API_KEY = 'AIzaSyDNM6zPeWggblR6lMWByyPXtZM8UkOfwXo';
  const SRC = 'https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&libraries=places';

  let loadPromise = null;
  function loadMaps() {
    if (loadPromise) return loadPromise;
    if (window.google && window.google.maps && window.google.maps.places) {
      loadPromise = Promise.resolve();
      return loadPromise;
    }
    loadPromise = new Promise(function (resolve, reject) {
      try {
        const existing = document.querySelector('script[data-s1-google-maps]');
        if (existing) {
          existing.addEventListener('load', function () { resolve(); });
          existing.addEventListener('error', function (e) { reject(e); });
          return;
        }
        const s = document.createElement('script');
        s.src = SRC;
        s.async = true;
        s.defer = true;
        s.setAttribute('data-s1-google-maps', '1');
        s.addEventListener('load', function () {
          waitForPlaces().then(resolve, reject);
        });
        s.addEventListener('error', function (e) { reject(e); });
        document.head.appendChild(s);
      } catch (e) { reject(e); }
    });
    return loadPromise;
  }

  function waitForPlaces() {
    return new Promise(function (resolve, reject) {
      let tries = 0;
      const t = setInterval(function () {
        tries++;
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(t);
          resolve();
        } else if (tries > 100) {
          clearInterval(t);
          reject(new Error('google.maps.places not available'));
        }
      }, 50);
    });
  }

  function attachOne(el) {
    if (!el || el.__placesInit) return;
    if (el.tagName !== 'INPUT') return;
    try {
      const ac = new window.google.maps.places.Autocomplete(el, { types: ['address'] });
      el.__placesInit = true;
      el.__placesAutocomplete = ac;
      ac.addListener('place_changed', function () {
        try {
          const place = ac.getPlace();
          const addr = (place && (place.formatted_address || place.name)) || el.value;
          el.value = addr;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) { /* ignore */ }
      });
    } catch (e) {
      // mark to avoid retry loops if construction failed
      el.__placesInit = true;
    }
  }

  function attachAll() {
    try {
      const els = document.querySelectorAll('input[data-places-autocomplete]');
      if (!els.length) return;
      loadMaps().then(function () {
        els.forEach(attachOne);
      }).catch(function () { /* swallow — don't break module load */ });
    } catch (e) { /* swallow */ }
  }

  window.S1 = window.S1 || {};
  window.S1.placesAutocomplete = { attachAll: attachAll, attachOne: attachOne };

  // Initial sweep + re-scans.
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
  } catch (e) { /* swallow */ }
})();
