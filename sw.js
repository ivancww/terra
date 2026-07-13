const CACHE_VERSION = 'v2.6.0'; 
const CACHE_NAME = `terra-cache-${CACHE_VERSION}`;
const urlsToCache = [ './', './index.html', './manifest.json', './terra-192.png' ];

// 引入 Firebase 背景通訊模組
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// 初始化 Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCUUqWRecCdnKB7ReNLuSoiDZEs7q9oSJ4",
    projectId: "terra-team",
    messagingSenderId: "781876962987",
    appId: "1:781876962987:web:33c1f7ae868fc3454779ee"
});

const messaging = firebase.messaging();

// 處理背景收信 (熄芒/退回主畫面時觸發)
messaging.onBackgroundMessage((payload) => {
    let title = "🚨 Terra系統通告";
    let body = "有最新文件上載，請登入查看。";
    let icon = "./terra-192.png";
    
    if (payload && payload.notification) {
        title = payload.notification.title || title;
        body = payload.notification.body || body;
    } else if (payload && payload.data) {
        title = payload.data.title || title;
        body = payload.data.body || body;
    }

    const options = {
        body: body,
        icon: icon,
        badge: "./terra-192.png",
        requireInteraction: true, // 橫幅保持常駐，直到用戶點擊為止
        data: { url: "./index.html" }
    };
    
    // 強制彈出系統通知
    self.registration.showNotification(title, options);
});

// 加入「點擊通知」事件 (撳條通知會自動打開/跳轉去 App 畫面)
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // 如果 App 已經開緊，就 focus 返去
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            // 如果 App 未開，就打開佢
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});

// 基本 PWA 快取與安裝邏輯
self.addEventListener('install', event => { 
    self.skipWaiting(); 
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))); 
});

self.addEventListener('activate', event => { 
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => { 
        if(k !== CACHE_NAME) return caches.delete(k); 
    })))).then(() => self.clients.claim()); 
});

self.addEventListener('fetch', event => {
    // 略過 firebase 同 googleapis 請求，避免影響連線
    if (event.request.url.includes('googleapis.com')) return;
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
