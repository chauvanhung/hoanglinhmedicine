// Service Worker for Android Health Connect PWA
const CACHE_NAME = 'hlm-health-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => {
      // If network fails, try cache
      return caches.match(event.request);
    })
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
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Xem chi tiết'
      },
      {
        action: 'close',
        title: 'Đóng'
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
