// PWA Service for Android Health Connect
export class PWAService {
  private static instance: PWAService;
  private registration: ServiceWorkerRegistration | null = null;

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  // Register service worker
  async registerServiceWorker(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        return true;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return false;
      }
    }
    return false;
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
    return 'denied';
  }

  // Show notification
  showNotification(title: string, options?: NotificationOptions): void {
    if (this.registration && 'showNotification' in this.registration) {
      this.registration.showNotification(title, options);
    }
  }

  // Request background sync
  async requestBackgroundSync(tag: string): Promise<boolean> {
    if (this.registration && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        await (this.registration as any).sync.register(tag);
        return true;
      } catch (error) {
        console.error('Background sync registration failed:', error);
        return false;
      }
    }
    return false;
  }

  // Install PWA
  async installPWA(): Promise<boolean> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        await this.registerServiceWorker();
        await this.requestNotificationPermission();
        return true;
      } catch (error) {
        console.error('PWA installation failed:', error);
        return false;
      }
    }
    return false;
  }

  // Check if app is installed
  isAppInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Get app info
  getAppInfo(): {
    isInstalled: boolean;
    isOnline: boolean;
    hasServiceWorker: boolean;
    hasNotifications: boolean;
  } {
    return {
      isInstalled: this.isAppInstalled(),
      isOnline: navigator.onLine,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasNotifications: 'Notification' in window
    };
  }
}

// Export singleton instance
export const pwaService = PWAService.getInstance();
