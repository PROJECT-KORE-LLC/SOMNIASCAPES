/* SOMNIASCAPES SERVICE WORKER
   No module return button build.
*/

const CACHE_VERSION = 'somniascapes-v40-no-module-return-button';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
];

const CORE_IMAGES = [
  './SomniaScapes1.png',
  './solarium.png',
  './academy.png',
  './balcony.png',
  './castle1.png',
  './underbelly.png',
  './sewers.png',
  './cavern.png',
  './treasure.png',
  './wraith.png'
];

const PRECACHE_ASSETS = [
  ...APP_SHELL,
  ...CORE_IMAGES
];

async function cacheAsset(cache, assetUrl) {
  try {
    const response = await fetch(new Request(assetUrl, { cache: 'reload' }));
    if (response && response.ok) {
      await cache.put(assetUrl, response);
    } else {
      console.warn('[SomniaScapes SW] Skipped:', assetUrl, response && response.status);
    }
  } catch (error) {
    console.warn('[SomniaScapes SW] Missing or uncached:', assetUrl, error);
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => Promise.all(PRECACHE_ASSETS.map(asset => cacheAsset(cache, asset))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html').then(cached => cached || caches.match('./')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.ok && url.pathname.match(/\.(html|css|js|json|png|jpg|jpeg|webp|gif|svg|ico|mp3|wav|ogg|m4a|flac)$/i)) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
