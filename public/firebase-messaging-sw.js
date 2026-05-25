/* eslint-disable no-undef */
// Firebase Messaging service worker (compat build for background notifications)
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js');

// Replace the object below with your actual config if you use background messaging
// Service Workers cannot access process.env easily, so these should be kept generic
// or populated during a custom build step. For now, we clear the hardcoded values.
firebase.initializeApp({
  apiKey: "PLACEHOLDER",
  authDomain: "PLACEHOLDER",
  projectId: "PLACEHOLDER",
  storageBucket: "PLACEHOLDER",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER",
  measurementId: "PLACEHOLDER"
});

const messaging = firebase.messaging();

// Optional: customize background notification handling
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Notification';
  const options = {
    body: payload.notification?.body,
    icon: '/logo192.png'
  };
  self.registration.showNotification(title, options);
});
