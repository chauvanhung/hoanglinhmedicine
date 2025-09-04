'use client';

import { useState, useEffect } from 'react';
import AndroidHealthIntegration from '../components/AndroidHealthIntegration';
import PWAInstall from '../components/PWAInstall';
import HealthConnectTest from '../components/HealthConnectTest';
import { androidHealthService, AndroidHealthData } from '../../lib/androidHealthService';
import { Smartphone, Activity, TrendingUp, Calendar, Heart } from 'lucide-react';

export default function AndroidHealthPage() {
  const [healthData, setHealthData] = useState<AndroidHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSteps: 0,
    totalCalories: 0,
    avgHeartRate: 0,
    weightChange: 0
  });

  const handleHealthDataSync = (data: AndroidHealthData) => {
    setHealthData(data);
    
    // Update stats
    setStats(prev => ({
      totalSteps: prev.totalSteps + data.steps,
      totalCalories: prev.totalCalories + data.calories,
      avgHeartRate: Math.round((prev.avgHeartRate + data.heartRate) / 2),
      weightChange: data.weight - 68.5 // Assuming baseline weight
    }));
  };

  const androidTips = [
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
    <div className="android-health-page">
      <div className="health-container">
        {/* Header */}
        <div className="health-header">
          <div className="header-content">
            <h1>Android Health Connect</h1>
            <p>Đồng bộ và theo dõi dữ liệu sức khỏe từ Android Health Connect</p>
          </div>
          <div className="header-icon">
            <Smartphone className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* PWA Install Component */}
        <PWAInstall />

        {/* Health Connect Test Component */}
        <HealthConnectTest />

        {/* Android Health Integration Component */}
        <AndroidHealthIntegration onDataSync={handleHealthDataSync} />

        {/* Health Stats */}
        {healthData && (
          <div className="health-stats">
            <h2>Thống kê sức khỏe từ Android</h2>
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
          <h2>Lời khuyên sức khỏe</h2>
          <div className="tips-grid">
            {androidTips.map((tip, index) => (
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

        {/* Android Health Connect Benefits */}
        <div className="health-benefits">
          <h2>Lợi ích của Android Health Connect</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">📱</div>
              <div className="benefit-content">
                <h3>Tích hợp Android</h3>
                <p>Kết nối với tất cả ứng dụng sức khỏe trên Android</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔒</div>
              <div className="benefit-content">
                <h3>Bảo mật tuyệt đối</h3>
                <p>Dữ liệu được mã hóa và chỉ bạn mới có quyền truy cập</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔄</div>
              <div className="benefit-content">
                <h3>Đồng bộ tự động</h3>
                <p>Dữ liệu sức khỏe được đồng bộ tự động từ các ứng dụng</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📊</div>
              <div className="benefit-content">
                <h3>Phân tích xu hướng</h3>
                <p>Xem xu hướng sức khỏe theo thời gian và đưa ra khuyến nghị</p>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Apps */}
        <div className="supported-apps">
          <h2>Ứng dụng được hỗ trợ</h2>
          <div className="apps-grid">
            <div className="app-item">
              <div className="app-icon">🏃‍♂️</div>
              <h4>Google Fit</h4>
              <p>Theo dõi hoạt động thể chất</p>
            </div>
            <div className="app-item">
              <div className="app-icon">💓</div>
              <h4>Samsung Health</h4>
              <p>Monitor sức khỏe toàn diện</p>
            </div>
            <div className="app-item">
              <div className="app-icon">⚖️</div>
              <h4>MyFitnessPal</h4>
              <p>Theo dõi dinh dưỡng</p>
            </div>
            <div className="app-item">
              <div className="app-icon">😴</div>
              <h4>Sleep as Android</h4>
              <p>Monitor giấc ngủ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
