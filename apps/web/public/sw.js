// Service Worker for Android Health Connect PWA
const CACHE_NAME = 'hlm-health-v1';
const urlsToCache = [
  '/',
  '/android-health',
  '/health',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Background sync for health data
self.addEventListener('sync', (event) => {
  if (event.tag === 'health-sync') {
    event.waitUntil(syncHealthData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Cập nhật dữ liệu sức khỏe mới',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Xem chi tiết',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Đóng',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Hoang Linh Medicine', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/android-health')
    );
  }
});

// Health data sync function
async function syncHealthData() {
  try {
    // Get health data from Health Connect
    const healthData = await getHealthDataFromHealthConnect();
    
    // Send to server
    await fetch('/api/health/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(healthData)
    });
    
    console.log('Health data synced successfully');
  } catch (error) {
    console.error('Failed to sync health data:', error);
  }
}

// Mock function to get health data from Health Connect
async function getHealthDataFromHealthConnect() {
  // In real implementation, this would use Health Connect API
  return {
    steps: Math.floor(Math.random() * 3000) + 7000,
    calories: Math.floor(Math.random() * 200) + 300,
    heartRate: Math.floor(Math.random() * 30) + 60,
    weight: 68.5 + (Math.random() - 0.5) * 1,
    timestamp: new Date().toISOString()
  };
}
