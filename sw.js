// 每次修改前台代碼，請更改此版本號強制全體更新
const CACHE_VERSION = 'v1.0.0'; 
const CACHE_NAME = `pwa-cache-${CACHE_VERSION}`;

// 需要離線緩存的核心檔案
const urlsToCache = [
    './',
    './index.html',
    './admin.html',
    './manifest.json'
];

// 1. 安裝時下載緩存，並強制立即生效 (skipWaiting)
self.addEventListener('install', event => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// 2. 啟動時清除舊版本緩存 (強制更新核心機制)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. 攔截網絡請求：Firestore 數據放行，靜態檔案優先讀取本地緩存
self.addEventListener('fetch', event => {
    // 排除 Firebase 的 API 請求，交由 Firebase 自帶的離線持久化處理
    if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('firebasestorage.googleapis.com')) {
        return;
    }
    event.respondWith(
        caches.match(event.request).then(response => {
            // 優先回傳緩存，否則透過網絡抓取
            return response || fetch(event.request).catch(() => caches.match('./index.html'));
        })
    );
});
