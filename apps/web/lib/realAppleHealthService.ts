// Real Apple Health Service - Kết nối với API thật
import { HealthData } from './appleHealthService';

export class RealAppleHealthService {
  private static instance: RealAppleHealthService;
  private baseUrl: string;
  private authToken: string | null = null;

  static getInstance(): RealAppleHealthService {
    if (!RealAppleHealthService.instance) {
      RealAppleHealthService.instance = new RealAppleHealthService();
    }
    return RealAppleHealthService.instance;
  }

  constructor() {
    // Sử dụng API URL từ environment hoặc default
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hoanglinhmedicine-api.onrender.com';
  }

  // Set authentication token
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  // Get authentication headers
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  // Check if device supports Apple Health
  isAppleDevice(): boolean {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent;
    return /iPad|iPhone|iPod|Mac/.test(userAgent) || 
           (navigator as any).standalone !== undefined;
  }

  // Request permissions for HealthKit (chỉ hoạt động trên iOS app)
  async requestPermissions(): Promise<{ read: boolean; write: boolean }> {
    if (!this.isAppleDevice()) {
      throw new Error('Apple Health chỉ khả dụng trên thiết bị Apple');
    }

    // Trên web, chúng ta không thể trực tiếp request HealthKit permissions
    // Cần iOS app để làm điều này
    return {
      read: false,
      write: false
    };
  }

  // Connect to Apple Health (thông qua iOS app)
  async connect(): Promise<boolean> {
    try {
      // Kiểm tra xem có iOS app không
      const hasIOSApp = await this.checkIOSApp();
      
      if (hasIOSApp) {
        // Redirect đến iOS app hoặc mở deep link
        this.openIOSApp();
        return true;
      } else {
        // Fallback về mock data
        return false;
      }
    } catch (error) {
      console.error('Failed to connect to Apple Health:', error);
      return false;
    }
  }

  // Check if iOS app is installed
  private async checkIOSApp(): Promise<boolean> {
    try {
      // Thử mở deep link
      const testUrl = 'hoanglinhhealth://health';
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = testUrl;
      document.body.appendChild(iframe);
      
      // Đợi một chút để kiểm tra
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      document.body.removeChild(iframe);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Open iOS app
  private openIOSApp(): void {
    const deepLink = 'hoanglinhhealth://health/connect';
    const appStoreUrl = 'https://apps.apple.com/app/hoanglinhhealth/id123456789';
    
    // Thử mở app
    window.location.href = deepLink;
    
    // Fallback đến App Store nếu app không có
    setTimeout(() => {
      if (confirm('Bạn chưa cài đặt iOS app. Bạn có muốn tải về App Store không?')) {
        window.open(appStoreUrl, '_blank');
      }
    }, 2000);
  }

  // Fetch health data from API
  async fetchHealthData(): Promise<HealthData> {
    try {
      const response = await fetch(`${this.baseUrl}/health/data`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const latestData = result.data[0];
        return {
          steps: latestData.steps,
          calories: latestData.calories,
          heartRate: latestData.heartRate,
          weight: latestData.weight,
          lastSync: latestData.lastSync
        };
      } else {
        throw new Error('No health data available');
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      throw error;
    }
  }

  // Sync health data
  async syncData(): Promise<HealthData> {
    try {
      const response = await fetch(`${this.baseUrl}/health/sync`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Sync failed');
      }
    } catch (error) {
      console.error('Failed to sync health data:', error);
      throw error;
    }
  }

  // Get health stats
  async getHealthStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/health/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Failed to fetch health stats:', error);
      throw error;
    }
  }

  // Send health data to API (từ iOS app)
  async sendHealthData(data: HealthData): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health/data`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          steps: data.steps,
          calories: data.calories,
          heartRate: data.heartRate,
          weight: data.weight,
          date: new Date().toISOString().split('T')[0],
          source: 'apple_health'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to send health data:', error);
      return false;
    }
  }

  // Check connection status
  isHealthConnected(): boolean {
    return this.authToken !== null;
  }

  // Disconnect from Apple Health
  disconnect(): void {
    this.authToken = null;
  }

  // Get available health data types
  getAvailableDataTypes(): string[] {
    return [
      'steps',
      'calories',
      'heartRate',
      'weight',
      'height',
      'bloodPressure',
      'sleep',
      'workouts'
    ];
  }

  // Format health data for display
  formatHealthData(data: HealthData): {
    steps: string;
    calories: string;
    heartRate: string;
    weight: string;
    lastSync: string;
  } {
    return {
      steps: data.steps.toLocaleString('vi-VN'),
      calories: `${data.calories} cal`,
      heartRate: `${data.heartRate} bpm`,
      weight: `${data.weight.toFixed(1)} kg`,
      lastSync: new Date(data.lastSync).toLocaleString('vi-VN')
    };
  }
}

// Export singleton instance
export const realAppleHealthService = RealAppleHealthService.getInstance();
