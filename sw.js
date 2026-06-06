const CACHE_NAME = 'somniascapes-v1';
const ASSETS = [
    './index.html',
    './manifest.json',
    './sw.js',
    // Add paths to your images and audio files here to cache them for offline use
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
