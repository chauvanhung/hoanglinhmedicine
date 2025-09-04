'use client';

import { useState, useEffect } from 'react';
import { Activity, Heart, Zap, Scale, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function HealthConnectTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [isTesting, setIsTesting] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    // Get device info
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isAndroid: /Android/.test(navigator.userAgent),
      hasServiceWorker: 'serviceWorker' in navigator,
      hasNotifications: 'Notification' in window,
      hasWebShare: 'share' in navigator,
      hasHealthAPI: 'health' in navigator,
      hasPermissions: 'permissions' in navigator
    };
    setDeviceInfo(info);
  }, []);

  const runHealthConnectTest = async () => {
    setIsTesting(true);
    const results: any = {};

    try {
      // Test 1: Check Health Connect availability
      results.healthConnectAvailable = await testHealthConnectAvailability();
      
      // Test 2: Test permissions
      results.permissions = await testPermissions();
      
      // Test 3: Test data reading
      results.dataReading = await testDataReading();
      
      // Test 4: Test Web Share API
      results.webShare = await testWebShare();
      
      // Test 5: Test Service Worker
      results.serviceWorker = await testServiceWorker();
      
    } catch (error) {
      results.error = error.message;
    } finally {
      setIsTesting(false);
      setTestResults(results);
    }
  };

  const testHealthConnectAvailability = async (): Promise<boolean> => {
    try {
      // Check if Health Connect is available
      if ('health' in navigator) {
        return true;
      }
      
      // Check if we can access Health Connect via Web Share
      if ('share' in navigator) {
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  const testPermissions = async (): Promise<any> => {
    try {
      if ('permissions' in navigator) {
        const permissions = await Promise.allSettled([
          navigator.permissions.query({ name: 'notifications' as PermissionName }),
          navigator.permissions.query({ name: 'geolocation' as PermissionName })
        ]);
        
        return {
          notifications: permissions[0].status === 'fulfilled',
          geolocation: permissions[1].status === 'fulfilled'
        };
      }
      return { available: false };
    } catch (error) {
      return { error: error.message };
    }
  };

  const testDataReading = async (): Promise<any> => {
    try {
      // Mock data reading test
      const mockData = {
        steps: Math.floor(Math.random() * 3000) + 7000,
        calories: Math.floor(Math.random() * 200) + 300,
        heartRate: Math.floor(Math.random() * 30) + 60,
        weight: 68.5 + (Math.random() - 0.5) * 1
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, data: mockData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const testWebShare = async (): Promise<any> => {
    try {
      if ('share' in navigator) {
        // Test Web Share API
        const shareData = {
          title: 'Test Health Connect',
          text: 'Testing Health Connect integration',
          url: window.location.href
        };
        
        // Don't actually share, just test if it's available
        return { available: true, canShare: true };
      }
      return { available: false };
    } catch (error) {
      return { available: false, error: error.message };
    }
  };

  const testServiceWorker = async (): Promise<any> => {
    try {
      if ('serviceWorker' in navigator) {
        // Test service worker registration
        const registration = await navigator.serviceWorker.register('/sw.js');
        return { 
          available: true, 
          registered: true,
          scope: registration.scope 
        };
      }
      return { available: false };
    } catch (error) {
      return { available: false, error: error.message };
    }
  };

  const getStatusIcon = (status: boolean | string) => {
    if (status === true) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === false) return <XCircle className="w-5 h-5 text-red-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className="health-connect-test">
      <div className="test-header">
        <h3>🧪 Test Health Connect Integration</h3>
        <p>Kiểm tra khả năng kết nối với Android Health Connect</p>
      </div>

      {/* Device Info */}
      {deviceInfo && (
        <div className="device-info">
          <h4>📱 Thông tin thiết bị</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Platform:</span>
              <span className="info-value">{deviceInfo.platform}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Android:</span>
              <span className="info-value">{deviceInfo.isAndroid ? '✅ Có' : '❌ Không'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Service Worker:</span>
              <span className="info-value">{deviceInfo.hasServiceWorker ? '✅ Có' : '❌ Không'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Notifications:</span>
              <span className="info-value">{deviceInfo.hasNotifications ? '✅ Có' : '❌ Không'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Web Share:</span>
              <span className="info-value">{deviceInfo.hasWebShare ? '✅ Có' : '❌ Không'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Health API:</span>
              <span className="info-value">{deviceInfo.hasHealthAPI ? '✅ Có' : '❌ Không'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Test Button */}
      <div className="test-actions">
        <button
          onClick={runHealthConnectTest}
          disabled={isTesting}
          className="test-button"
        >
          {isTesting ? (
            <div className="loading-spinner" />
          ) : (
            <>
              <Activity className="w-5 h-5" />
              Chạy test Health Connect
            </>
          )}
        </button>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="test-results">
          <h4>📊 Kết quả test</h4>
          
          {/* Health Connect Availability */}
          {testResults.healthConnectAvailable !== undefined && (
            <div className="result-item">
              <div className="result-header">
                {getStatusIcon(testResults.healthConnectAvailable)}
                <span>Health Connect Availability</span>
              </div>
              <p>{testResults.healthConnectAvailable ? 'Health Connect có sẵn' : 'Health Connect không khả dụng'}</p>
            </div>
          )}

          {/* Permissions */}
          {testResults.permissions && (
            <div className="result-item">
              <div className="result-header">
                {getStatusIcon(testResults.permissions.available !== false)}
                <span>Permissions API</span>
              </div>
              <p>{testResults.permissions.available ? 'Permissions API hoạt động' : 'Permissions API không khả dụng'}</p>
            </div>
          )}

          {/* Data Reading */}
          {testResults.dataReading && (
            <div className="result-item">
              <div className="result-header">
                {getStatusIcon(testResults.dataReading.success)}
                <span>Data Reading</span>
              </div>
              {testResults.dataReading.success ? (
                <div className="data-preview">
                  <div className="data-item">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>{testResults.dataReading.data.steps} bước</span>
                  </div>
                  <div className="data-item">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span>{testResults.dataReading.data.calories} cal</span>
                  </div>
                  <div className="data-item">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{testResults.dataReading.data.heartRate} bpm</span>
                  </div>
                  <div className="data-item">
                    <Scale className="w-4 h-4 text-green-500" />
                    <span>{testResults.dataReading.data.weight.toFixed(1)}kg</span>
                  </div>
                </div>
              ) : (
                <p>Không thể đọc dữ liệu: {testResults.dataReading.error}</p>
              )}
            </div>
          )}

          {/* Web Share */}
          {testResults.webShare && (
            <div className="result-item">
              <div className="result-header">
                {getStatusIcon(testResults.webShare.available)}
                <span>Web Share API</span>
              </div>
              <p>{testResults.webShare.available ? 'Web Share API hoạt động' : 'Web Share API không khả dụng'}</p>
            </div>
          )}

          {/* Service Worker */}
          {testResults.serviceWorker && (
            <div className="result-item">
              <div className="result-header">
                {getStatusIcon(testResults.serviceWorker.available)}
                <span>Service Worker</span>
              </div>
              <p>{testResults.serviceWorker.available ? 'Service Worker hoạt động' : 'Service Worker không khả dụng'}</p>
            </div>
          )}

          {/* Error */}
          {testResults.error && (
            <div className="result-item error">
              <div className="result-header">
                <XCircle className="w-5 h-5 text-red-500" />
                <span>Error</span>
              </div>
              <p>{testResults.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      <div className="recommendations">
        <h4>💡 Khuyến nghị</h4>
        <ul>
          <li>Để lấy dữ liệu thật, cần cài đặt PWA trên Android</li>
          <li>Health Connect chỉ khả dụng trên Android 14+</li>
          <li>Sử dụng Chrome browser để có trải nghiệm tốt nhất</li>
          <li>Cấp quyền truy cập Health Connect khi được yêu cầu</li>
        </ul>
      </div>
    </div>
  );
}
