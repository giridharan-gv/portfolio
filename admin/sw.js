/* -------------------------------------------------------------
   GIRIDHARAN ADMIN APP — SERVICE WORKER
   Enables Progressive Web App (PWA) Offline & Android Installation
   ------------------------------------------------------------- */

var CACHE_NAME = 'giri-admin-v1';
var ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  '../styles.css',
  '../assets/portfolio-bridge.js',
  '../favicon.png',
  '../images/giridharan.jpg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS_TO_CACHE).catch(function () {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});
