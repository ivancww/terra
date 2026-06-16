const CACHE_VERSION = 'v1.4.0'; 
const CACHE_NAME = `pwa-cache-${CACHE_VERSION}`;

const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './terra-192.png',
    './terra-512.png'
];

// 引入 Firebase 背景通訊模組
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// 初始化 Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCUUqWRecCdnKB7ReNLuSoiDZEs7q9oSJ4",
    authDomain: "terra-team.firebaseapp.com",
    projectId: "terra-team",
    storageBucket: "terra-team.firebasestorage.app",
    messagingSenderId: "781876962987",
    appId: "1:781876962987:web:33c1f7ae868fc3454779ee"
});

const messaging = firebase.messaging();

// 監聽背景通知
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './terra-192.png',
        badge: './terra-192.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('install', event => {
    self.skipWaiting(); 
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) return caches.delete(cache);
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('firebasestorage.googleapis.com')) return;
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request).catch(() => caches.match('./index.html')))
    );
});
