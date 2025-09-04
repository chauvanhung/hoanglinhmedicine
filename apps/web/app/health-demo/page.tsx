'use client';

import { useState, useEffect } from 'react';
import AppleHealthIntegration from '../components/AppleHealthIntegration';
import AndroidHealthIntegration from '../components/AndroidHealthIntegration';
import PWAInstall from '../components/PWAInstall';
import HealthConnectTest from '../components/HealthConnectTest';
import { appleHealthService, HealthData } from '../../lib/appleHealthService';
import { androidHealthService, AndroidHealthData } from '../../lib/androidHealthService';
import { Heart, Smartphone, Activity, TrendingUp, Calendar, TestTube } from 'lucide-react';

export default function HealthDemoPage() {
  const [appleHealthData, setAppleHealthData] = useState<HealthData | null>(null);
  const [androidHealthData, setAndroidHealthData] = useState<AndroidHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSteps: 0,
    totalCalories: 0,
    avgHeartRate: 0,
    weightChange: 0
  });

  const handleAppleHealthDataSync = (data: HealthData) => {
    setAppleHealthData(data);
    
    // Update stats
    setStats(prev => ({
      totalSteps: prev.totalSteps + data.steps,
      totalCalories: prev.totalCalories + data.calories,
      avgHeartRate: Math.round((prev.avgHeartRate + data.heartRate) / 2),
      weightChange: data.weight - 68.5
    }));
  };

  const handleAndroidHealthDataSync = (data: AndroidHealthData) => {
    setAndroidHealthData(data);
    
    // Update stats
    setStats(prev => ({
      totalSteps: prev.totalSteps + data.steps,
      totalCalories: prev.totalCalories + data.calories,
      avgHeartRate: Math.round((prev.avgHeartRate + data.heartRate) / 2),
      weightChange: data.weight - 68.5
    }));
  };

  const healthTips = [
    {
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      title: "Mục tiêu 10,000 bước/ngày",
      description: "Đi bộ 10,000 bước mỗi ngày giúp cải thiện sức khỏe tim mạch và giảm cân hiệu quả."
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: "Theo dõi nhịp tim",
      description: "Nhịp tim nghỉ ngơi 60-100 bpm là bình thường. Tập thể dục thường xuyên để cải thiện."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: "Đốt cháy calories",
      description: "Mục tiêu đốt cháy 400-600 calories/ngày thông qua hoạt động thể chất."
    }
  ];

  return (
    <div className="health-demo-page">
      <div className="health-container">
        {/* Header */}
        <div className="health-header">
          <div className="header-content">
            <h1>🏥 Health Integration Demo</h1>
            <p>Demo tích hợp sức khỏe với Apple Health và Android Health Connect</p>
          </div>
          <div className="header-icon">
            <TestTube className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        {/* PWA Install Component */}
        <PWAInstall />

        {/* Health Connect Test Component */}
        <HealthConnectTest />

        {/* Apple Health Integration */}
        <div className="integration-section">
          <div className="section-header">
            <Heart className="w-8 h-8 text-red-500" />
            <h2>Apple Health Integration</h2>
          </div>
          <AppleHealthIntegration onDataSync={handleAppleHealthDataSync} />
        </div>

        {/* Android Health Integration */}
        <div className="integration-section">
          <div className="section-header">
            <Smartphone className="w-8 h-8 text-green-500" />
            <h2>Android Health Connect</h2>
          </div>
          <AndroidHealthIntegration onDataSync={handleAndroidHealthDataSync} />
        </div>

        {/* Combined Health Stats */}
        {(appleHealthData || androidHealthData) && (
          <div className="health-stats">
            <h2>📊 Thống kê sức khỏe tổng hợp</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalSteps.toLocaleString('vi-VN')}</h3>
                  <p>Tổng số bước</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalCalories}</h3>
                  <p>Calories đốt cháy</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <div className="stat-content">
                  <h3>{stats.avgHeartRate}</h3>
                  <p>Nhịp tim TB (bpm)</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar className="w-8 h-8 text-green-500" />
                </div>
                <div className="stat-content">
                  <h3>{stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)}kg</h3>
                  <p>Thay đổi cân nặng</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Tips */}
        <div className="health-tips">
          <h2>💡 Lời khuyên sức khỏe</h2>
          <div className="tips-grid">
            {healthTips.map((tip, index) => (
              <div key={index} className="tip-card">
                <div className="tip-icon">
                  {tip.icon}
                </div>
                <div className="tip-content">
                  <h3>{tip.title}</h3>
                  <p>{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Comparison */}
        <div className="integration-comparison">
          <h2>🔄 So sánh tích hợp</h2>
          <div className="comparison-grid">
            <div className="comparison-card apple">
              <div className="card-header">
                <Heart className="w-8 h-8 text-red-500" />
                <h3>Apple Health</h3>
              </div>
              <div className="card-content">
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Chỉ trên iOS</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Cần iOS app</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Dữ liệu thật 100%</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">❌</span>
                    <span>Phức tạp setup</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="comparison-card android">
              <div className="card-header">
                <Smartphone className="w-8 h-8 text-green-500" />
                <h3>Android Health</h3>
              </div>
              <div className="card-content">
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Chỉ trên Android</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>PWA hoặc app</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Dữ liệu thật</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Dễ setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="demo-instructions">
          <h2>📋 Hướng dẫn demo</h2>
          <div className="instructions-grid">
            <div className="instruction-card">
              <div className="instruction-number">1</div>
              <div className="instruction-content">
                <h4>Test Health Connect</h4>
                <p>Click "Chạy test Health Connect" để kiểm tra khả năng kết nối</p>
              </div>
            </div>
            <div className="instruction-card">
              <div className="instruction-number">2</div>
              <div className="instruction-content">
                <h4>Cài đặt PWA</h4>
                <p>Click "Cài đặt ứng dụng" để cài PWA trên Android</p>
              </div>
            </div>
            <div className="instruction-card">
              <div className="instruction-number">3</div>
              <div className="instruction-content">
                <h4>Kết nối Health</h4>
                <p>Click "Kết nối" để lấy dữ liệu từ Health Connect</p>
              </div>
            </div>
            <div className="instruction-card">
              <div className="instruction-number">4</div>
              <div className="instruction-content">
                <h4>Xem kết quả</h4>
                <p>Dữ liệu sức khỏe sẽ hiển thị trong thống kê</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
