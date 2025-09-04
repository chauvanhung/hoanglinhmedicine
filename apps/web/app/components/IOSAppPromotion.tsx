'use client';

import { useState } from 'react';
import { Smartphone, Download, ArrowRight, CheckCircle } from 'lucide-react';

export default function IOSAppPromotion() {
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstallApp = () => {
    setIsInstalling(true);
    
    // Thử mở deep link trước
    const deepLink = 'hoanglinhhealth://health/connect';
    const appStoreUrl = 'https://apps.apple.com/app/hoanglinhhealth/id123456789';
    
    // Tạo iframe để test deep link
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deepLink;
    document.body.appendChild(iframe);
    
    // Đợi 2 giây rồi redirect đến App Store
    setTimeout(() => {
      document.body.removeChild(iframe);
      window.open(appStoreUrl, '_blank');
      setIsInstalling(false);
    }, 2000);
  };

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: "Đồng bộ tự động",
      description: "Dữ liệu sức khỏe được đồng bộ tự động từ Apple Health"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: "Dữ liệu thật",
      description: "Lấy dữ liệu trực tiếp từ HealthKit, không phải mock data"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: "Bảo mật tuyệt đối",
      description: "Dữ liệu được mã hóa và chỉ bạn mới có quyền truy cập"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: "Real-time sync",
      description: "Cập nhật dữ liệu real-time giữa iOS app và web app"
    }
  ];

  return (
    <div className="ios-app-promotion">
      <div className="promotion-header">
        <div className="app-icon">
          <Smartphone className="w-16 h-16 text-blue-500" />
        </div>
        <div className="header-content">
          <h2>Tải iOS App để kết nối thật với Apple Health</h2>
          <p>Để lấy dữ liệu trực tiếp từ Apple Health, bạn cần cài đặt iOS app</p>
        </div>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              {feature.icon}
            </div>
            <div className="feature-content">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="installation-steps">
        <h3>Cách cài đặt:</h3>
        <div className="steps-list">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Tải iOS App</h4>
              <p>Click nút bên dưới để tải app từ App Store</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Đăng nhập</h4>
              <p>Sử dụng tài khoản giống như web app</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Cấp quyền Apple Health</h4>
              <p>Cho phép app truy cập dữ liệu sức khỏe</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Đồng bộ dữ liệu</h4>
              <p>Dữ liệu sẽ tự động đồng bộ với web app</p>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          onClick={handleInstallApp}
          disabled={isInstalling}
          className="install-button"
        >
          {isInstalling ? (
            <div className="loading-spinner" />
          ) : (
            <>
              <Download className="w-5 h-5" />
              Tải iOS App
            </>
          )}
        </button>
        
        <button className="learn-more-button">
          Tìm hiểu thêm
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="app-preview">
        <h3>Xem trước iOS App:</h3>
        <div className="preview-images">
          <div className="preview-item">
            <div className="phone-mockup">
              <div className="screen">
                <div className="app-header">
                  <h4>Apple Health</h4>
                  <div className="status-indicator connected" />
                </div>
                <div className="health-data">
                  <div className="data-item">
                    <span className="label">Steps</span>
                    <span className="value">8,542</span>
                  </div>
                  <div className="data-item">
                    <span className="label">Calories</span>
                    <span className="value">420</span>
                  </div>
                  <div className="data-item">
                    <span className="label">Heart Rate</span>
                    <span className="value">72 bpm</span>
                  </div>
                </div>
              </div>
            </div>
            <p>Màn hình chính</p>
          </div>
          
          <div className="preview-item">
            <div className="phone-mockup">
              <div className="screen">
                <div className="app-header">
                  <h4>Sync Status</h4>
                  <div className="sync-indicator" />
                </div>
                <div className="sync-status">
                  <div className="sync-item">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Connected to Apple Health</span>
                  </div>
                  <div className="sync-item">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Data synced to web app</span>
                  </div>
                  <div className="sync-time">
                    Last sync: 2 minutes ago
                  </div>
                </div>
              </div>
            </div>
            <p>Trạng thái đồng bộ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
