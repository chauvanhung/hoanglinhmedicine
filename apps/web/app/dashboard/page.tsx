'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UserData {
  uid: string
  email: string
  displayName?: string
}

interface Profile {
  name: string
  age: number
  gender: string
  height: number
  currentWeight: number
  activityLevel: string
}

interface Goal {
  targetWeight: number
  targetLossKg: number
  timeframe: number
  weeklyGoal: number
  startAt: string
  endAt: string
  status: string
}

interface Measurement {
  id?: string
  type: string
  value: number
  unit: string
  at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const checkExistingLogin = () => {
      const storedUser = localStorage.getItem('firebase_user');
      const authStatus = localStorage.getItem('firebase_auth_status');
      
      if (storedUser && authStatus === 'logged_in') {
        try {
          const user = JSON.parse(storedUser);
          setUser(user);
          // Load dashboard data
          loadDashboardData();
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('firebase_user');
          localStorage.removeItem('firebase_auth_status');
          router.push('/login');
        }
      } else {
        // No stored login, try to get from Firebase
        loadDashboardData();
      }
    };

    checkExistingLogin();
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Get current user from localStorage first, then Firebase
      const storedUser = localStorage.getItem('firebase_user');
      let currentUser = null;
      
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
          console.log('Using stored user:', currentUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('firebase_user');
          localStorage.removeItem('firebase_auth_status');
        }
      }
      
      if (!currentUser) {
        // Import Firebase service
        const { getCurrentUser } = await import('../../lib/firebase');
        currentUser = getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
      }
      
      setUser(currentUser);
      
      // Import Firebase service methods
      const { getUserProfile, getUserGoals, getUserMeasurements } = await import('../../lib/firebase');
      
      // Load user profile
      const userProfile = await getUserProfile(currentUser.uid);
      if (userProfile && typeof userProfile === 'object' && 'name' in userProfile) {
        setProfile(userProfile as unknown as Profile);
      }
      
      // Load user goals
      const userGoals = await getUserGoals(currentUser.uid);
      if (userGoals && userGoals.length > 0) {
        setGoal(userGoals[0]); // Get the first active goal
      }
      
      // Load user measurements
      const userMeasurements = await getUserMeasurements(currentUser.uid);
      if (userMeasurements) {
        setMeasurements(userMeasurements);
      }
      
    } catch (error) {
      setError('Không thể tải dữ liệu dashboard');
      console.error('Dashboard load error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Calculate current weight from latest measurement
  const getCurrentWeight = () => {
    if (measurements.length === 0) return profile?.currentWeight || 0
    
    const weightMeasurements = measurements
      .filter(m => m.type === 'WEIGHT')
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    
    return weightMeasurements.length > 0 ? weightMeasurements[0].value : profile?.currentWeight || 0
  }

  const getSafeUserName = () => {
    if (profile?.name) return profile.name;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Bạn';
  };

  // Helper functions
  const getWeightLossProgress = () => {
    if (!profile?.currentWeight || !goal?.targetWeight) {
      return { current: 0, target: 0, lost: 0, progress: 0 };
    }
    
    const current = profile.currentWeight;
    const target = goal.targetWeight;
    const startWeight = profile.currentWeight; // Assuming this is the starting weight
    const lost = startWeight - current;
    const totalToLose = startWeight - target;
    const progress = totalToLose > 0 ? Math.min(100, (lost / totalToLose) * 100) : 0;
    
    return { current, target, lost, progress };
  };

  const getBMI = () => {
    if (!profile?.height || !profile?.currentWeight) return 0;
    const heightInMeters = profile.height / 100;
    return profile.currentWeight / (heightInMeters * heightInMeters);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'Thiếu cân', class: 'underweight' };
    if (bmi < 25) return { status: 'Bình thường', class: 'normal' };
    if (bmi < 30) return { status: 'Thừa cân', class: 'overweight' };
    return { status: 'Béo phì', class: 'obese' };
  };

  const getDailyCalories = () => {
    if (!profile?.currentWeight || !profile?.age || !profile?.gender || !profile?.height) return 2000;
    
    const weight = profile.currentWeight;
    const height = profile.height;
    const age = profile.age;
    
    // BMR calculation using Mifflin-St Jeor Equation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = profile.gender === 'male' ? bmr + 5 : bmr - 161;
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      lightly: 1.375,
      moderately: 1.55,
      very: 1.725,
      extremely: 1.9
    };
    
    const multiplier = activityMultipliers[profile.activityLevel as keyof typeof activityMultipliers] || 1.2;
    const tdee = bmr * multiplier;
    
    // For weight loss, subtract 500 calories (0.5kg/week)
    return Math.round(tdee - 500);
  };

  const getDaysSinceStart = () => {
    if (!goal?.startAt) return 1;
    const startDate = new Date(goal.startAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  // Get calculated values
  const weightProgress = getWeightLossProgress();
  const bmi = getBMI();
  const bmiStatus = getBMIStatus(bmi);
  const dailyCalories = getDailyCalories();
  const daysSinceStart = getDaysSinceStart();

  return (
    <div className="page-background">
      <div className="page-container">
        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoading && !error && (
          <>
            {/* Welcome Section */}
            <section className="welcome-section">
              <div className="welcome-header">
                <h1 className="page-title">👋 Chào mừng trở lại, {getSafeUserName()}!</h1>
                <p className="page-subtitle">Hôm nay là ngày {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="quick-stats">
              <div className="stats-container">
                <div className="stat-card primary">
                  <div className="stat-icon">⚖️</div>
                  <div className="stat-content">
                    <div className="stat-number">{weightProgress.current.toFixed(1)} kg</div>
                    <div className="stat-label">Cân nặng hiện tại</div>
                    <div className="stat-change positive">-{weightProgress.lost.toFixed(1)} kg</div>
                  </div>
                </div>

                <div className="stat-card success">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <div className="stat-number">{goal?.targetWeight || 0} kg</div>
                    <div className="stat-label">Mục tiêu</div>
                    <div className="stat-progress">{weightProgress.progress}% hoàn thành</div>
                  </div>
                </div>

                <div className="stat-card info">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-number">{bmi.toFixed(1)}</div>
                    <div className="stat-label">BMI hiện tại</div>
                    <div className={`stat-status ${bmiStatus.class}`}>{bmiStatus.status}</div>
                  </div>
                </div>

                <div className="stat-card warning">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-content">
                    <div className="stat-number">{dailyCalories}</div>
                    <div className="stat-label">Calo tiêu thụ</div>
                    <div className="stat-target">Mục tiêu: {dailyCalories}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Dashboard Grid */}
            <section className="dashboard-main">
              <div className="dashboard-container">
                {/* Progress Chart */}
                <div className="dashboard-card large">
                  <div className="card-header">
                    <h3>📈 Tiến độ giảm cân</h3>
                    <div className="card-actions">
                      <select className="time-selector">
                        <option value="7">7 ngày</option>
                        <option value="30" selected>30 ngày</option>
                        <option value="90">90 ngày</option>
                      </select>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="progress-chart">
                      <div className="chart-container">
                        <div className="chart-line">
                          {measurements
                            .filter(m => m.type === 'WEIGHT')
                            .slice(-10)
                            .map((measurement, index) => {
                              const progress = ((index + 1) / 10) * 100
                              const weightProgress = ((measurement.value - (goal?.targetWeight || 0)) / ((profile?.currentWeight || 0) - (goal?.targetWeight || 0))) * 100
                              return (
                                <div 
                                  key={measurement.id || index}
                                  className="chart-point" 
                                  style={{
                                    left: `${progress}%`, 
                                    bottom: `${Math.max(0, Math.min(100, weightProgress))}%`
                                  }}
                                ></div>
                              )
                            })}
                        </div>
                        <div className="chart-labels">
                          <span>Ngày 1</span>
                          <span>Ngày {daysSinceStart}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today's Tasks */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>✅ Nhiệm vụ hôm nay</h3>
                    <span className="task-progress">3/5 hoàn thành</span>
                  </div>
                  <div className="card-content">
                    <div className="task-list">
                      <div className="task-item completed">
                        <div className="task-checkbox">✓</div>
                        <div className="task-content">
                          <div className="task-title">Đo cân nặng</div>
                          <div className="task-time">8:00 AM</div>
                        </div>
                      </div>
                      
                      <div className="task-item completed">
                        <div className="task-checkbox">✓</div>
                        <div className="task-content">
                          <div className="task-title">Uống 2 lít nước</div>
                          <div className="task-time">Cả ngày</div>
                        </div>
                      </div>
                      
                      <div className="task-item completed">
                        <div className="task-checkbox">✓</div>
                        <div className="task-content">
                          <div className="task-title">Tập cardio 30 phút</div>
                          <div className="task-time">6:00 PM</div>
                        </div>
                      </div>
                      
                      <div className="task-item">
                        <div className="task-checkbox"></div>
                        <div className="task-content">
                          <div className="task-title">Ăn bữa tối ít calo</div>
                          <div className="task-time">7:00 PM</div>
                        </div>
                      </div>
                      
                      <div className="task-item">
                        <div className="task-checkbox"></div>
                        <div className="task-content">
                          <div className="task-title">Đi ngủ trước 11 PM</div>
                          <div className="task-time">11:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nutrition Tracking */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>🍽️ Theo dõi dinh dưỡng</h3>
                    <span className="nutrition-date">Hôm nay</span>
                  </div>
                  <div className="card-content">
                    <div className="nutrition-summary">
                      <div className="nutrition-item">
                        <div className="nutrition-label">Calo đã ăn</div>
                        <div className="nutrition-value">1,250 / {dailyCalories}</div>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{width: `${(1250 / dailyCalories) * 100}%`}}></div>
                        </div>
                      </div>
                      
                      <div className="nutrition-item">
                        <div className="nutrition-label">Protein</div>
                        <div className="nutrition-value">85g / {Math.round(profile?.currentWeight ? profile.currentWeight * 1.6 : 120)}g</div>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{width: '70.8%'}}></div>
                        </div>
                      </div>
                      
                      <div className="nutrition-item">
                        <div className="nutrition-label">Carbohydrate</div>
                        <div className="nutrition-value">150g / {Math.round(dailyCalories * 0.45 / 4)}g</div>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{width: '75%'}}></div>
                        </div>
                      </div>
                      
                      <div className="nutrition-item">
                        <div className="nutrition-label">Chất béo</div>
                        <div className="nutrition-value">45g / {Math.round(dailyCalories * 0.25 / 9)}g</div>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{width: '69.2%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="nutrition-actions">
                      <a href="/nutrition" className="btn btn-outline btn-small">📝 Ghi chép bữa ăn</a>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>📱 Hoạt động gần đây</h3>
                  </div>
                  <div className="card-content">
                    <div className="activity-list">
                      {measurements.slice(0, 4).map((measurement, index) => (
                        <div key={measurement.id || index} className="activity-item">
                          <div className="activity-icon">
                            {measurement.type === 'WEIGHT' ? '⚖️' : 
                             measurement.type === 'EXERCISE' ? '🏃‍♀️' : 
                             measurement.type === 'NUTRITION' ? '🍎' : '📊'}
                          </div>
                          <div className="activity-content">
                            <div className="activity-title">
                              {measurement.type === 'WEIGHT' ? 'Cập nhật cân nặng' :
                               measurement.type === 'EXERCISE' ? 'Hoàn thành bài tập' :
                               measurement.type === 'NUTRITION' ? 'Ghi chép bữa ăn' : 'Hoạt động mới'}
                            </div>
                            <div className="activity-time">
                              {new Date(measurement.at).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {measurements.length === 0 && (
                        <div className="activity-item">
                          <div className="activity-icon">📊</div>
                          <div className="activity-content">
                            <div className="activity-title">Chưa có hoạt động nào</div>
                            <div className="activity-time">Bắt đầu ghi chép ngay!</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Coach */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>🤖 AI Coach</h3>
                    <span className="coach-status online">Trực tuyến</span>
                  </div>
                  <div className="card-content">
                    <div className="coach-message">
                      <div className="coach-avatar">🤖</div>
                      <div className="message-content">
                        <p>
                          {weightProgress.progress >= 80 ? 
                            `Tuyệt vời! Bạn đã hoàn thành ${weightProgress.progress}% mục tiêu. Hãy duy trì động lực! 🎉` :
                            weightProgress.progress >= 50 ?
                            `Bạn đã hoàn thành ${weightProgress.progress}% mục tiêu. Hãy cố gắng thêm! 💪` :
                            `Bạn đã hoàn thành ${weightProgress.progress}% mục tiêu. Hãy bắt đầu với những bước nhỏ! 🌱`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="coach-actions">
                      <a href="/chat" className="btn btn-primary btn-small">💬 Chat với AI</a>
                      <a href="/tips" className="btn btn-outline btn-small">💡 Lời khuyên</a>
                    </div>
                  </div>
                </div>

                {/* Weekly Goals */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>📅 Mục tiêu tuần này</h3>
                    <span className="week-progress">Tuần {Math.ceil(daysSinceStart / 7)}</span>
                  </div>
                  <div className="card-content">
                    <div className="weekly-goals">
                      <div className="goal-item">
                        <div className="goal-icon">⚖️</div>
                        <div className="goal-content">
                          <div className="goal-title">Giảm {goal?.weeklyGoal || 0.5}kg</div>
                          <div className="goal-status in-progress">Đang thực hiện</div>
                        </div>
                      </div>
                      
                      <div className="goal-item">
                        <div className="goal-icon">🏃‍♀️</div>
                        <div className="goal-content">
                          <div className="goal-title">Tập luyện 5 ngày</div>
                          <div className="goal-status completed">Hoàn thành</div>
                        </div>
                      </div>
                      
                      <div className="goal-item">
                        <div className="goal-icon">🍽️</div>
                        <div className="goal-content">
                          <div className="goal-title">Ăn đúng calo mục tiêu</div>
                          <div className="goal-status in-progress">Đang thực hiện</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions">
              <div className="actions-container">
                <a href="/nutrition" className="action-card">
                  <div className="action-icon">🍽️</div>
                  <div className="action-title">Ghi chép bữa ăn</div>
                </a>
                
                <a href="/exercise" className="action-card">
                  <div className="action-icon">💪</div>
                  <div className="action-title">Ghi chép tập luyện</div>
                </a>
                
                <a href="/measurements" className="action-card">
                  <div className="action-icon">📏</div>
                  <div className="action-title">Cập nhật số đo</div>
                </a>
                
                <a href="/chat" className="action-card">
                  <div className="action-icon">💬</div>
                  <div className="action-title">Chat với AI</div>
                </a>
                
                <a href="/consultation" className="action-card">
                  <div className="action-icon">👨‍⚕️</div>
                  <div className="action-title">Đặt lịch bác sĩ</div>
                </a>
                
                <a href="/progress" className="action-card">
                  <div className="action-icon">📊</div>
                  <div className="action-title">Xem tiến độ chi tiết</div>
                </a>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
