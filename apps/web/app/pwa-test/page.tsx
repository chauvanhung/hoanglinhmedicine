'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, Wifi, Bell, CheckCircle, XCircle } from 'lucide-react';

export default function PWATestPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [appInfo, setAppInfo] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('PWA Test Page loaded');
    
    // Get app info
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isAndroid: /Android/.test(navigator.userAgent),
      hasServiceWorker: 'serviceWorker' in navigator,
      hasNotifications: 'Notification' in window,
      hasWebShare: 'share' in navigator,
      isInstalled: window.matchMedia('(display-mode: standalone)').matches ||
                   (window.navigator as any).standalone === true
    };
    setAppInfo(info);
    addLog(`App info: ${JSON.stringify(info, null, 2)}`);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      addLog('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    addLog('Added beforeinstallprompt listener');

    // Check if already installed
    if (info.isInstalled) {
      addLog('App is already installed');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    setIsInstalling(true);
    addLog('Starting PWA installation...');

    try {
      if (deferredPrompt) {
        addLog('Deferred prompt available, showing install prompt...');
        // Show install prompt
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        addLog(`Install prompt outcome: ${outcome}`);
        
        if (outcome === 'accepted') {
          addLog('PWA installed successfully');
          alert('Ứng dụng đã được cài đặt thành công!');
        } else {
          addLog('PWA installation declined');
          alert('Cài đặt ứng dụng đã bị hủy.');
        }
        
        setDeferredPrompt(null);
      } else {
        addLog('No deferred prompt available');
        // Try manual installation instructions
        alert('Không thể cài đặt tự động. Vui lòng:\n1. Mở menu Chrome (3 chấm)\n2. Chọn "Thêm vào màn hình chính"\n3. Click "Thêm"');
      }
    } catch (error) {
      addLog(`PWA installation failed: ${error.message}`);
      alert('Lỗi cài đặt PWA: ' + error.message);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleRequestNotifications = async () => {
    addLog('Requesting notification permission...');
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        addLog(`Notification permission: ${permission}`);
        
        if (permission === 'granted') {
          new Notification('Thông báo đã được bật!', {
            body: 'Bạn sẽ nhận được thông báo về dữ liệu sức khỏe',
            icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzIyYzU1ZSIvPgo8cGF0aCBkPSJNMzIgMTZhOCA4IDAgMCAxIDggOHY4YTggOCAwIDAgMS0xNiAwdi04YTggOCAwIDAgMSA4LTh6IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
          });
        }
      } else {
        addLog('Notifications not supported');
        alert('Trình duyệt không hỗ trợ thông báo');
      }
    } catch (error) {
      addLog(`Notification request failed: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs cleared');
  };

  return (
    <div className="pwa-test-page">
      <div className="test-container">
        {/* Header */}
        <div className="test-header">
          <h1>🧪 PWA Test Page</h1>
          <p>Kiểm tra khả năng cài đặt PWA trên Android</p>
        </div>

        {/* App Info */}
        {appInfo && (
          <div className="app-info">
            <h3>📱 Thông tin thiết bị</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Platform:</span>
                <span className="info-value">{appInfo.platform}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Android:</span>
                <span className="info-value">{appInfo.isAndroid ? '✅ Có' : '❌ Không'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Service Worker:</span>
                <span className="info-value">{appInfo.hasServiceWorker ? '✅ Có' : '❌ Không'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Notifications:</span>
                <span className="info-value">{appInfo.hasNotifications ? '✅ Có' : '❌ Không'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Web Share:</span>
                <span className="info-value">{appInfo.hasWebShare ? '✅ Có' : '❌ Không'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">App Installed:</span>
                <span className="info-value">{appInfo.isInstalled ? '✅ Có' : '❌ Không'}</span>
              </div>
            </div>
          </div>
        )}

        {/* PWA Status */}
        <div className="pwa-status">
          <h3>🚀 Trạng thái PWA</h3>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-icon">
                {deferredPrompt ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
              </div>
              <div className="status-content">
                <h4>Install Prompt</h4>
                <p>{deferredPrompt ? 'Sẵn sàng cài đặt' : 'Chưa sẵn sàng'}</p>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">
                {appInfo?.hasServiceWorker ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
              </div>
              <div className="status-content">
                <h4>Service Worker</h4>
                <p>{appInfo?.hasServiceWorker ? 'Được hỗ trợ' : 'Không hỗ trợ'}</p>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">
                {appInfo?.isInstalled ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
              </div>
              <div className="status-content">
                <h4>App Status</h4>
                <p>{appInfo?.isInstalled ? 'Đã cài đặt' : 'Chưa cài đặt'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="test-actions">
          <button
            onClick={handleInstallPWA}
            disabled={isInstalling || appInfo?.isInstalled}
            className="install-button"
          >
            {isInstalling ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <Download className="w-5 h-5" />
                {appInfo?.isInstalled ? 'Đã cài đặt' : 'Cài đặt PWA'}
              </>
            )}
          </button>

          <button
            onClick={handleRequestNotifications}
            className="notification-button"
          >
            <Bell className="w-4 h-4" />
            Test Thông báo
          </button>
        </div>

        {/* Manual Instructions */}
        <div className="manual-instructions">
          <h3>📋 Hướng dẫn cài đặt thủ công</h3>
          <div className="instructions">
            <div className="instruction-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Mở menu Chrome</h4>
                <p>Click vào 3 chấm ở góc trên bên phải</p>
              </div>
            </div>
            <div className="instruction-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Chọn "Thêm vào màn hình chính"</h4>
                <p>Tìm và click vào tùy chọn này</p>
              </div>
            </div>
            <div className="instruction-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Xác nhận cài đặt</h4>
                <p>Click "Thêm" để hoàn tất cài đặt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="logs-section">
          <div className="logs-header">
            <h3>📝 Logs</h3>
            <button onClick={clearLogs} className="clear-logs-button">
              Xóa logs
            </button>
          </div>
          <div className="logs-content">
            {logs.map((log, index) => (
              <div key={index} className="log-item">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

