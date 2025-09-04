'use client';

import { useState, useEffect } from 'react';
import AppleHealthIntegration from '../components/AppleHealthIntegration';
import { appleHealthService, HealthData } from '../../lib/appleHealthService';
import { Heart, Activity, TrendingUp, Calendar } from 'lucide-react';

export default function HealthPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSteps: 0,
    totalCalories: 0,
    avgHeartRate: 0,
    weightChange: 0
  });

  const handleHealthDataSync = (data: HealthData) => {
    setHealthData(data);
    
    // Update stats
    setStats(prev => ({
      totalSteps: prev.totalSteps + data.steps,
      totalCalories: prev.totalCalories + data.calories,
      avgHeartRate: Math.round((prev.avgHeartRate + data.heartRate) / 2),
      weightChange: data.weight - 68.5 // Assuming baseline weight
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
    <div className="health-page">
      <div className="health-container">
        {/* Header */}
        <div className="health-header">
          <div className="header-content">
            <h1>Apple Health Integration</h1>
            <p>Đồng bộ và theo dõi dữ liệu sức khỏe từ Apple Health</p>
          </div>
          <div className="header-icon">
            <Heart className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Apple Health Integration Component */}
        <AppleHealthIntegration onDataSync={handleHealthDataSync} />

        {/* Health Stats */}
        {healthData && (
          <div className="health-stats">
            <h2>Thống kê sức khỏe</h2>
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

        {/* Benefits Section */}
        <div className="health-benefits">
          <h2>Lợi ích của Apple Health</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">📊</div>
              <div className="benefit-content">
                <h3>Theo dõi tự động</h3>
                <p>Dữ liệu sức khỏe được đồng bộ tự động từ Apple Watch và iPhone</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <div className="benefit-content">
                <h3>Mục tiêu cá nhân</h3>
                <p>Đặt và theo dõi mục tiêu sức khỏe phù hợp với từng cá nhân</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📈</div>
              <div className="benefit-content">
                <h3>Phân tích xu hướng</h3>
                <p>Xem xu hướng sức khỏe theo thời gian và đưa ra khuyến nghị</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔒</div>
              <div className="benefit-content">
                <h3>Bảo mật tuyệt đối</h3>
                <p>Dữ liệu được mã hóa và chỉ bạn mới có quyền truy cập</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
