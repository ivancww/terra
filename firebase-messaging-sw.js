// ==========================================
// Firebase Service Worker 版本控制
// 下次更新 HTML 或 App 版本時，只需更改下方數字即可強制更新
const FIREBASE_SW_VERSION = 'v1.8.9'; 
// ==========================================

console.log(`[Firebase SW] 載入版本: ${FIREBASE_SW_VERSION}`);

// 1. 載入 Firebase 背景核心套件 (使用 v8 compat 版本確保與 SW 相容)
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// 2. 初始化 Firebase (請務必將以下資料換成你專案嘅真實設定)
firebase.initializeApp({
  apiKey: "AIzaSyCUUqWRecCdnKB7ReNLuSoiDZEs7q9oSJ4",
  authDomain: "terra-team.firebaseapp.com",
  projectId: "terra-team",
  storageBucket: "terra-team.firebasestorage.app",
  messagingSenderId: "781876962987",
   appId: "1:781876962987:web:33c1f7ae868fc3454779ee"
});

// 3. 啟動背景接收器
const messaging = firebase.messaging();

// 4. 設定 App 喺背景 (退出了或 Kill 咗) 時收到通知的處理方式
messaging.onBackgroundMessage(function(payload) {
  console.log('[Firebase SW] 收到背景通知: ', payload);
  
  // 提取通知內容
  const notificationTitle = payload.notification.title || '新通知';
  const notificationOptions = {
    body: payload.notification.body || '你有新的訊息',
    // 換成你專案嘅 Icon 路徑 (例如 Ivan 體檢專案或 AVA Team 嘅 Logo)
    icon: '/icon-192x192.png', 
    badge: '/icon-192x192.png', // 頂部狀態列顯示的小圖示
    data: payload.data // 如果有夾帶額外跳轉連結等 data，可以喺度接收
  };

  // 觸發顯示系統通知
  self.registration.showNotification(notificationTitle, notificationOptions);
});
