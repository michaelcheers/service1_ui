// Client-side image thumbnailing + HEIC transcoding. The host platform never
// decodes image bytes — uploads attach a pre-built thumbnail, the lightbox
// transcodes HEIC here, and any attachment that arrived without a thumbnail
// (Twilio MMS, inbound email) gets one generated on first view and POSTed back
// to the server cache so subsequent loads serve it inline.
//
// Browser-native decoding handles JPEG/PNG/GIF/WebP and (on Safari) HEIC. For
// HEIC on Chrome/Firefox we lazy-load heic2any from a CDN; the import only
// runs when an actual HEIC blob shows up.
(function () {
  'use strict';

  var HEIC2ANY_URL = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
  var HEIC2ANY_SRI = 'sha256-CWPPpQ6eHn5q+SmkCoHj6Jimc/EnDq+mkX3RN+SWgWQ=';
  var heic2anyPromise = null;

  function isHeic(type) {
    if (!type) return false;
    var t = String(type).toLowerCase();
    return t.indexOf('heic') >= 0 || t.indexOf('heif') >= 0;
  }

  function loadHeic2Any() {
    if (window.heic2any) return Promise.resolve(window.heic2any);
    if (heic2anyPromise) return heic2anyPromise;
    heic2anyPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = HEIC2ANY_URL;
      s.integrity = HEIC2ANY_SRI;
      s.crossOrigin = 'anonymous';
      s.async = true;
      s.onload = function () {
        if (window.heic2any) resolve(window.heic2any);
        else reject(new Error('heic2any loaded but global missing'));
      };
      s.onerror = function () { reject(new Error('failed to load heic2any')); };
      document.head.appendChild(s);
    });
    return heic2anyPromise;
  }

  // Decode any image blob to an HTMLImageElement. HEIC is routed through
  // heic2any → JPEG blob first because Chrome/Firefox cannot natively decode it.
  async function decodeToImage(blob) {
    var working = blob;
    if (isHeic(blob.type)) {
      try {
        var convert = await loadHeic2Any();
        var out = await convert({ blob: blob, toType: 'image/jpeg', quality: 0.9 });
        working = Array.isArray(out) ? out[0] : out;
      } catch (e) {
        // Fall through and let the <img> try natively (Safari handles HEIC).
      }
    }
    var url = URL.createObjectURL(working);
    try {
      var img = await new Promise(function (resolve, reject) {
        var im = new Image();
        im.onload = function () { resolve(im); };
        im.onerror = function () { reject(new Error('decode failed')); };
        im.src = url;
      });
      return { image: img, displayBlob: working, revoke: function () { URL.revokeObjectURL(url); } };
    } catch (e) {
      URL.revokeObjectURL(url);
      throw e;
    }
  }

  // Resize an already-decoded image into a JPEG dataUrl with longest edge
  // ≤ maxEdge. Aspect ratio preserved; minimum 1px on each side.
  function resizeToDataUrl(img, maxEdge, quality) {
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    if (!w || !h) throw new Error('zero-sized image');
    var scale = Math.min(1, maxEdge / Math.max(w, h));
    var tw = Math.max(1, Math.round(w * scale));
    var th = Math.max(1, Math.round(h * scale));
    var canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, tw, th);
    return canvas.toDataURL('image/jpeg', typeof quality === 'number' ? quality : 0.82);
  }

  // Produce a thumbnail dataUrl (JPEG) from a File/Blob. Returns null if the
  // input isn't an image or decoding fails — callers fall back to a gradient.
  async function thumbnailDataUrl(fileOrBlob, maxEdge) {
    if (!fileOrBlob) return null;
    var type = fileOrBlob.type || '';
    if (type && type.indexOf('image/') !== 0 && !isHeic(type)) return null;
    var decoded = null;
    try {
      decoded = await decodeToImage(fileOrBlob);
      return resizeToDataUrl(decoded.image, maxEdge || 320, 0.82);
    } catch (e) {
      return null;
    } finally {
      if (decoded && decoded.revoke) decoded.revoke();
    }
  }

  // Return a Blob the browser can render directly. For HEIC this is the
  // heic2any-produced JPEG; for everything else it's the original bytes.
  async function toDisplayableBlob(blob) {
    if (!isHeic(blob.type)) return blob;
    try {
      var convert = await loadHeic2Any();
      var out = await convert({ blob: blob, toType: 'image/jpeg', quality: 0.92 });
      return Array.isArray(out) ? out[0] : out;
    } catch (e) {
      return blob; // Safari can render the original.
    }
  }

  window.S1 = window.S1 || {};
  window.S1.imageThumb = {
    thumbnailDataUrl: thumbnailDataUrl,
    toDisplayableBlob: toDisplayableBlob,
    isHeic: isHeic
  };
})();
