// Simple offline cache for the app shell. Bump CACHE to force an update.
const CACHE = "docscanner-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./vendor/pdf-lib.min.js",
  "./vendor/opencv.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first for our own assets, and runtime-cache anything new (e.g. the
// OCR core + language data) so the app — and offline OCR — work after first use.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin && e.request.method === "GET") {
    e.respondWith(
      caches.match(e.request).then((r) =>
        r || fetch(e.request).then((resp) => {
          if (resp && resp.ok) { const copy = resp.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
          return resp;
        }).catch(() => r)
      )
    );
  }
});
