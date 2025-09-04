'use client';

import { useState, useEffect } from 'react';
import { Heart, Activity, Scale, Zap } from 'lucide-react';

interface HealthData {
  steps: number;
  calories: number;
  heartRate: number;
  weight: number;
  lastSync: string;
}

interface AppleHealthIntegrationProps {
  onDataSync?: (data: HealthData) => void;
}

export default function AppleHealthIntegration({ onDataSync }: AppleHealthIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if running on iOS/macOS
  const isAppleDevice = typeof window !== 'undefined' && 
    (/iPad|iPhone|iPod|Mac/.test(navigator.userAgent) || 
     (navigator as any).standalone !== undefined);

  const connectToAppleHealth = async () => {
    if (!isAppleDevice) {
      setError('Apple Health chỉ khả dụng trên thiết bị Apple (iPhone, iPad, Mac)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate Apple Health connection
      // In real implementation, you would use HealthKit API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      
      // Simulate fetching health data
      const mockData: HealthData = {
        steps: 8542,
        calories: 420,
        heartRate: 72,
        weight: 68.5,
        lastSync: new Date().toISOString()
      };
      
      setHealthData(mockData);
      onDataSync?.(mockData);
      
    } catch (err) {
      setError('Không thể kết nối với Apple Health. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const syncHealthData = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      // Simulate data sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedData: HealthData = {
        steps: Math.floor(Math.random() * 2000) + 7000,
        calories: Math.floor(Math.random() * 100) + 350,
        heartRate: Math.floor(Math.random() * 20) + 65,
        weight: 68.5 + (Math.random() - 0.5) * 0.5,
        lastSync: new Date().toISOString()
      };
      
      setHealthData(updatedData);
      onDataSync?.(updatedData);
      
    } catch (err) {
      setError('Không thể đồng bộ dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setHealthData(null);
    setError(null);
  };

  return (
    <div className="apple-health-integration">
      <div className="health-header">
        <div className="health-icon">
          <Heart className="w-8 h-8 text-red-500" />
        </div>
        <div className="health-title">
          <h3>Apple Health</h3>
          <p>Đồng bộ dữ liệu sức khỏe từ Apple Health</p>
        </div>
      </div>

      {!isAppleDevice && (
        <div className="device-warning">
          <p>⚠️ Apple Health chỉ khả dụng trên thiết bị Apple</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="health-actions">
        {!isConnected ? (
          <button
            onClick={connectToAppleHealth}
            disabled={!isAppleDevice || isLoading}
            className="connect-button"
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Kết nối Apple Health
              </>
            )}
          </button>
        ) : (
          <div className="connected-state">
            <div className="connection-status">
              <div className="status-indicator connected" />
              <span>Đã kết nối</span>
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
          <h4>Dữ liệu sức khỏe</h4>
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
                <span className="data-value">{healthData.weight}kg</span>
                <span className="data-label">Cân nặng</span>
              </div>
            </div>
          </div>
          <div className="last-sync">
            <p>Cập nhật lần cuối: {new Date(healthData.lastSync).toLocaleString('vi-VN')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
