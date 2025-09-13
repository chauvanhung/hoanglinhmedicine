'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, Wifi, Bell } from 'lucide-react';
import { pwaService } from '../../lib/pwaService';

export default function PWAInstall() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [appInfo, setAppInfo] = useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Get app info
    const info = pwaService.getAppInfo();
    setAppInfo(info);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    setIsInstalling(true);

    try {
      console.log('Starting PWA installation...');
      console.log('Deferred prompt available:', !!deferredPrompt);
      
      if (deferredPrompt) {
        console.log('Showing install prompt...');
        // Show install prompt
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('Install prompt outcome:', outcome);
        
        if (outcome === 'accepted') {
          console.log('PWA installed successfully');
          alert('Ứng dụng đã được cài đặt thành công!');
        } else {
          console.log('PWA installation declined');
          alert('Cài đặt ứng dụng đã bị hủy.');
        }
        
        setDeferredPrompt(null);
      } else {
        console.log('No deferred prompt, trying service worker registration...');
        // Fallback: register service worker
        const success = await pwaService.installPWA();
        if (success) {
          alert('Service Worker đã được đăng ký thành công!');
        } else {
          alert('Không thể đăng ký Service Worker.');
        }
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
      alert('Lỗi cài đặt PWA: ' + error.message);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleRequestNotifications = async () => {
    const permission = await pwaService.requestNotificationPermission();
    if (permission === 'granted') {
      pwaService.showNotification('Thông báo đã được bật!', {
        body: 'Bạn sẽ nhận được thông báo về dữ liệu sức khỏe',
        icon: '/icons/icon-192x192.png'
      });
    }
  };

  if (appInfo?.isInstalled) {
    return (
      <div className="pwa-installed">
        <div className="installed-header">
          <Smartphone className="w-8 h-8 text-green-500" />
          <h3>Ứng dụng đã được cài đặt</h3>
        </div>
        <p>Bạn có thể sử dụng ứng dụng như một app native trên Android</p>
      </div>
    );
  }

  return (
    <div className="pwa-install">
      <div className="install-header">
        <div className="install-icon">
          <Download className="w-8 h-8 text-blue-500" />
        </div>
        <div className="install-content">
          <h3>Cài đặt ứng dụng Android</h3>
          <p>Cài đặt PWA để lấy dữ liệu thật từ Health Connect</p>
        </div>
      </div>

      <div className="install-features">
        <div className="feature-item">
          <Wifi className="w-6 h-6 text-green-500" />
          <div className="feature-content">
            <h4>Hoạt động offline</h4>
            <p>Ứng dụng hoạt động ngay cả khi không có internet</p>
          </div>
        </div>
        <div className="feature-item">
          <Bell className="w-6 h-6 text-blue-500" />
          <div className="feature-content">
            <h4>Thông báo real-time</h4>
            <p>Nhận thông báo khi có dữ liệu sức khỏe mới</p>
          </div>
        </div>
        <div className="feature-item">
          <Smartphone className="w-6 h-6 text-purple-500" />
          <div className="feature-content">
            <h4>Như app native</h4>
            <p>Trải nghiệm như ứng dụng Android thật</p>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="debug-info">
        <h4>🔍 Debug Info</h4>
        <div className="debug-grid">
          <div className="debug-item">
            <span className="debug-label">Deferred Prompt:</span>
            <span className="debug-value">{deferredPrompt ? '✅ Có' : '❌ Không'}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Service Worker:</span>
            <span className="debug-value">{appInfo?.hasServiceWorker ? '✅ Có' : '❌ Không'}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">Notifications:</span>
            <span className="debug-value">{appInfo?.hasNotifications ? '✅ Có' : '❌ Không'}</span>
          </div>
          <div className="debug-item">
            <span className="debug-label">App Installed:</span>
            <span className="debug-value">{appInfo?.isInstalled ? '✅ Có' : '❌ Không'}</span>
          </div>
        </div>
      </div>

      <div className="install-actions">
        <button
          onClick={handleInstallPWA}
          disabled={isInstalling}
          className="install-button"
        >
          {isInstalling ? (
            <div className="loading-spinner" />
          ) : (
            <>
              <Download className="w-5 h-5" />
              Cài đặt ứng dụng
            </>
          )}
        </button>

        <button
          onClick={handleRequestNotifications}
          className="notification-button"
        >
          <Bell className="w-4 h-4" />
          Bật thông báo
        </button>
      </div>

      <div className="install-steps">
        <h4>Cách cài đặt:</h4>
        <ol>
          <li>Click "Cài đặt ứng dụng"</li>
          <li>Chọn "Thêm vào màn hình chính"</li>
          <li>Ứng dụng sẽ xuất hiện như app thật</li>
          <li>Cấp quyền truy cập Health Connect</li>
        </ol>
      </div>
    </div>
  );
}
