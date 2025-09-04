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
  console.log('🎯 Dashboard component rendered');
  
  const [user, setUser] = useState<UserData | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  
  console.log('🎯 Component state:', { user, profile, goal, measurements, isLoading, error });

  useEffect(() => {
    console.log('🎯 useEffect called');
    
    // Check if user is already logged in from localStorage
    const checkExistingLogin = () => {
      console.log('🔍 checkExistingLogin called');
      
      // Only run on client side
      if (typeof window === 'undefined') {
        console.log('❌ Running on server side, skipping checkExistingLogin');
        return;
      }
      
      const storedUser = localStorage.getItem('firebase_user');
      const authStatus = localStorage.getItem('firebase_auth_status');
      
      console.log('🔍 Stored user:', storedUser ? 'exists' : 'not found');
      console.log('🔍 Auth status:', authStatus);
      
      if (storedUser && authStatus === 'logged_in') {
        try {
          console.log('✅ User is logged in, parsing user data');
          const user = JSON.parse(storedUser);
          setUser(user);
          // Load dashboard data
          console.log('🚀 Calling loadDashboardData from checkExistingLogin');
          loadDashboardData();
        } catch (error) {
          console.error('❌ Error parsing stored user:', error);
          localStorage.removeItem('firebase_user');
          localStorage.removeItem('firebase_auth_status');
          router.push('/login');
        }
      } else {
        // No stored login, try to get from Firebase
        console.log('🚀 No stored login, calling loadDashboardData');
        loadDashboardData();
      }
    };

    console.log('🚀 About to call checkExistingLogin');
    checkExistingLogin();
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log('🚀 loadDashboardData called');
      setIsLoading(true)
      
      // Only run on client side
      if (typeof window === 'undefined') {
        console.log('❌ Running on server side, skipping');
        return;
      }
      
      console.log('✅ Running on client side');
      
      // Get current user from localStorage first, then Firebase
      const storedUser = localStorage.getItem('firebase_user');
      let currentUser = null;
      
      console.log('🔍 Stored user from localStorage:', storedUser ? 'exists' : 'not found');
      
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
      console.log('Importing Firebase service methods...');
      let getUserProfile, getUserGoals, getUserMeasurements;
      try {
        const firebaseModule = await import('../../lib/firebase');
        getUserProfile = firebaseModule.getUserProfile;
        getUserGoals = firebaseModule.getUserGoals;
        getUserMeasurements = firebaseModule.getUserMeasurements;
        console.log('Firebase methods imported successfully');
      } catch (importError) {
        console.error('Error importing Firebase methods:', importError);
        setIsLoading(false);
        return;
      }
      
            // Load user profile
      try {
        console.log('Current user UID:', currentUser.uid);
        console.log('Current user email:', currentUser.email);
        const userProfile = await getUserProfile(currentUser.uid);
        console.log('Loaded user profile:', userProfile);
        if (userProfile && typeof userProfile === 'object' && 'name' in userProfile) {
          setProfile(userProfile as unknown as Profile);
          console.log('Profile set successfully:', userProfile);
        } else {
          console.log('No valid profile found or profile missing name field');
          console.log('Profile data:', userProfile);
        }
      } catch (profileError) {
        console.error('Profile load error:', profileError);
      }
      
      // Load user goals
      try {
        const userGoals = await getUserGoals(currentUser.uid);
        console.log('Loaded user goals for UID:', currentUser.uid, userGoals);
        if (userGoals && userGoals.length > 0) {
          setGoal(userGoals[0]); // Get the first active goal
          console.log('Goal set successfully:', userGoals[0]);
        } else {
          console.log('No goals found for UID:', currentUser.uid);
        }
      } catch (goalsError) {
        console.error('Goals load error:', goalsError);
      }
      
      // Load user measurements
      try {
        const userMeasurements = await getUserMeasurements(currentUser.uid);
        console.log('Loaded user measurements for UID:', currentUser.uid, userMeasurements);
        if (userMeasurements && userMeasurements.length > 0) {
          setMeasurements(userMeasurements);
          console.log('Measurements set successfully:', userMeasurements.length, 'items');
        } else {
          console.log('No measurements found for UID:', currentUser.uid);
        }
      } catch (measurementsError) {
        console.error('Measurements load error:', measurementsError);
      }
      
    } catch (error) {
      console.error('Dashboard load error:', error);
      // Only set error for critical failures, not missing data
      if (error instanceof Error && error.message.includes('permission')) {
        setError('Không có quyền truy cập dữ liệu');
      }
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

  // Get current weight for display
  const currentWeight = getCurrentWeight()

  const getSafeUserName = () => {
    if (profile?.name) return profile.name;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Bạn';
  };

  // Helper functions
  const getWeightLossProgress = () => {
    const current = currentWeight;
    const target = goal?.targetWeight || 0;
    
    if (!current || !target) {
      return { current, target, lost: 0, progress: 0 };
    }
    
    // Use the first measurement as starting weight, or current weight if no measurements
    const startWeight = measurements.length > 0 ? 
      measurements
        .filter(m => m.type === 'WEIGHT')
        .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())[0]?.value || current
      : current;
    
    const lost = startWeight - current;
    const totalToLose = startWeight - target;
    const progress = totalToLose > 0 ? Math.min(100, (lost / totalToLose) * 100) : 0;
    
    return { current, target, lost, progress };
  };

  const getBMI = () => {
    if (!profile?.height || !currentWeight) return 0;
    const heightInMeters = profile.height / 100;
    return currentWeight / (heightInMeters * heightInMeters);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'Thiếu cân', class: 'underweight' };
    if (bmi < 25) return { status: 'Bình thường', class: 'normal' };
    if (bmi < 30) return { status: 'Thừa cân', class: 'overweight' };
    return { status: 'Béo phì', class: 'obese' };
  };

  const getDailyCalories = () => {
    if (!currentWeight || !profile?.age || !profile?.gender || !profile?.height) return 2000;
    
    const weight = currentWeight;
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



        {/* No Data State */}
        {!isLoading && !error && !profile && !goal && measurements.length === 0 && (
          <div className="no-data-container">
            <div className="no-data-icon">📊</div>
            <h2>Chào mừng đến với Dashboard!</h2>
            <p>Bạn chưa có dữ liệu cá nhân. Hãy hoàn thành thông tin để bắt đầu theo dõi sức khỏe.</p>
            <div className="no-data-actions">
              <button 
                className="btn btn-primary"
                onClick={() => router.push('/onboarding')}
              >
                Hoàn thành thông tin
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => router.push('/bmi')}
              >
                Tính BMI
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => {
                  console.log('=== DEBUG INFO ===');
                  console.log('Current user:', user);
                  console.log('Profile:', profile);
                  console.log('Goal:', goal);
                  console.log('Measurements:', measurements);
                  console.log('localStorage user:', localStorage.getItem('firebase_user'));
                  console.log('localStorage auth:', localStorage.getItem('firebase_auth_status'));
                  alert('Debug info logged to console. Press F12 to see details.');
                }}
              >
                🔍 Debug Info
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoading && !error && (profile || goal || measurements.length > 0) && (
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
                    <div className="stat-number">{weightProgress.current > 0 ? weightProgress.current.toFixed(1) : '--'} kg</div>
                    <div className="stat-label">Cân nặng hiện tại</div>
                    <div className="stat-change positive">{weightProgress.lost > 0 ? `-${weightProgress.lost.toFixed(1)} kg` : 'Chưa có dữ liệu'}</div>
                  </div>
                </div>

                <div className="stat-card success">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <div className="stat-number">{goal?.targetWeight || '--'} kg</div>
                    <div className="stat-label">Mục tiêu</div>
                    <div className="stat-progress">{goal ? `${weightProgress.progress.toFixed(1)}% hoàn thành` : 'Chưa có mục tiêu'}</div>
                  </div>
                </div>

                <div className="stat-card info">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-number">{bmi > 0 ? bmi.toFixed(1) : '--'}</div>
                    <div className="stat-label">BMI hiện tại</div>
                    <div className={`stat-status ${bmiStatus.class}`}>{bmi > 0 ? bmiStatus.status : 'Chưa có dữ liệu'}</div>
                  </div>
                </div>

                <div className="stat-card warning">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-content">
                    <div className="stat-number">{dailyCalories}</div>
                    <div className="stat-label">Calo tiêu thụ</div>
                    <div className="stat-target">{profile ? `Mục tiêu: ${dailyCalories}` : 'Cần hoàn thành thông tin'}</div>
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
                      {measurements.filter(m => m.type === 'WEIGHT').length > 0 ? (
                        <div className="chart-container">
                          <div className="chart-line">
                            {measurements
                              .filter(m => m.type === 'WEIGHT')
                              .slice(-10)
                              .map((measurement, index) => {
                                const progress = ((index + 1) / 10) * 100
                                const weightProgress = ((measurement.value - (goal?.targetWeight || 0)) / ((currentWeight || 0) - (goal?.targetWeight || 0))) * 100
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
                      ) : (
                        <div className="no-chart-data">
                          <p>Chưa có dữ liệu đo lường. Hãy thêm dữ liệu để xem biểu đồ tiến độ.</p>
                        </div>
                      )}
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
