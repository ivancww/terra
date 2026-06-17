const CACHE_VERSION = 'v1.8.0'; 
const CACHE_NAME = `terra-cache-${CACHE_VERSION}`;

const urlsToCache = [ './', './index.html', './manifest.json', './terra-192.png' ];

// 引入 Firebase 背景通訊模組
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCUUqWRecCdnKB7ReNLuSoiDZEs7q9oSJ4",
    projectId: "terra-team",
    messagingSenderId: "781876962987",
    appId: "1:781876962987:web:33c1f7ae868fc3454779ee"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: './terra-192.png'
    });
});

self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); }))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
    if (event.request.url.includes('googleapis.com')) return;
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
