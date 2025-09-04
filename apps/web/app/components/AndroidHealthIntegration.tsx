'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Activity, Zap, Heart, Scale } from 'lucide-react';
import { androidHealthService, AndroidHealthData } from '../../lib/androidHealthService';

interface AndroidHealthIntegrationProps {
  onDataSync?: (data: AndroidHealthData) => void;
}

export default function AndroidHealthIntegration({ onDataSync }: AndroidHealthIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState<AndroidHealthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    // Get device info
    const info = androidHealthService.getDeviceInfo();
    setDeviceInfo(info);
  }, []);

  const connectToAndroidHealth = async () => {
    if (!androidHealthService.isAndroidDevice()) {
      setError('Android Health Connect chỉ khả dụng trên thiết bị Android');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const connected = await androidHealthService.connect();
      
      if (connected) {
        setIsConnected(true);
        
        // Fetch initial data
        const data = await androidHealthService.fetchHealthData();
        setHealthData(data);
        onDataSync?.(data);
      } else {
        setError('Không thể kết nối với Android Health Connect');
      }
      
    } catch (err) {
      setError('Không thể kết nối với Android Health Connect. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const syncHealthData = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      const data = await androidHealthService.syncData();
      setHealthData(data);
      onDataSync?.(data);
    } catch (err) {
      setError('Không thể đồng bộ dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    androidHealthService.disconnect();
    setIsConnected(false);
    setHealthData(null);
    setError(null);
  };

  const openHealthConnect = () => {
    // Mở Android Health Connect app
    const healthConnectUrl = 'content://com.google.android.apps.healthdata/healthconnect';
    window.open(healthConnectUrl, '_blank');
  };

  return (
    <div className="android-health-integration">
      <div className="health-header">
        <div className="health-icon">
          <Smartphone className="w-8 h-8 text-green-500" />
        </div>
        <div className="health-title">
          <h3>Android Health Connect</h3>
          <p>Đồng bộ dữ liệu sức khỏe từ Android Health Connect</p>
        </div>
      </div>

      {/* Device Info */}
      {deviceInfo && (
        <div className="device-info">
          <p><strong>Platform:</strong> {deviceInfo.platform}</p>
          <p><strong>Android Device:</strong> {deviceInfo.isAndroid ? '✅ Có' : '❌ Không'}</p>
        </div>
      )}

      {!androidHealthService.isAndroidDevice() && (
        <div className="device-warning">
          <p>⚠️ Android Health Connect chỉ khả dụng trên thiết bị Android</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="health-actions">
        {!isConnected ? (
          <div className="connection-buttons">
            <button
              onClick={connectToAndroidHealth}
              disabled={!androidHealthService.isAndroidDevice() || isLoading}
              className="connect-button"
            >
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  <Smartphone className="w-5 h-5" />
                  Kết nối Android Health
                </>
              )}
            </button>
            
            {androidHealthService.isAndroidDevice() && (
              <button
                onClick={openHealthConnect}
                className="open-health-connect-button"
              >
                Mở Health Connect App
              </button>
            )}
          </div>
        ) : (
          <div className="connected-state">
            <div className="connection-status">
              <div className="status-indicator connected" />
              <span>Đã kết nối với Android Health</span>
            </div>
            <div className="action-buttons">
              <button
                onClick={syncHealthData}
                disabled={isLoading}
                className="sync-button"
              >
                {isLoading ? (
                  <div className="loading-spinner" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Đồng bộ
                  </>
                )}
              </button>
              <button
                onClick={disconnect}
                className="disconnect-button"
              >
                Ngắt kết nối
              </button>
            </div>
          </div>
        )}
      </div>

      {healthData && (
        <div className="health-data">
          <h4>Dữ liệu sức khỏe từ Android</h4>
          <div className="data-grid">
            <div className="data-item">
              <Activity className="w-6 h-6 text-blue-500" />
              <div className="data-content">
                <span className="data-value">{healthData.steps.toLocaleString()}</span>
                <span className="data-label">Bước chân</span>
              </div>
            </div>
            <div className="data-item">
              <Zap className="w-6 h-6 text-orange-500" />
              <div className="data-content">
                <span className="data-value">{healthData.calories}</span>
                <span className="data-label">Calories</span>
              </div>
            </div>
            <div className="data-item">
              <Heart className="w-6 h-6 text-red-500" />
              <div className="data-content">
                <span className="data-value">{healthData.heartRate}</span>
                <span className="data-label">Nhịp tim (bpm)</span>
              </div>
            </div>
            <div className="data-item">
              <Scale className="w-6 h-6 text-green-500" />
              <div className="data-content">
                <span className="data-value">{healthData.weight.toFixed(1)}kg</span>
                <span className="data-label">Cân nặng</span>
              </div>
            </div>
          </div>
          <div className="last-sync">
            <p>Cập nhật lần cuối: {new Date(healthData.lastSync).toLocaleString('vi-VN')}</p>
          </div>
        </div>
      )}

      {/* Android Health Connect Info */}
      <div className="health-connect-info">
        <h4>Về Android Health Connect</h4>
        <div className="info-grid">
          <div className="info-item">
            <h5>🔒 Bảo mật</h5>
            <p>Dữ liệu được mã hóa và chỉ bạn mới có quyền truy cập</p>
          </div>
          <div className="info-item">
            <h5>📱 Tích hợp</h5>
            <p>Kết nối với tất cả ứng dụng sức khỏe trên Android</p>
          </div>
          <div className="info-item">
            <h5>🔄 Đồng bộ</h5>
            <p>Dữ liệu được đồng bộ tự động và real-time</p>
          </div>
          <div className="info-item">
            <h5>📊 Phân tích</h5>
            <p>Xem xu hướng sức khỏe và đưa ra khuyến nghị</p>
          </div>
        </div>
      </div>
    </div>
  );
}
