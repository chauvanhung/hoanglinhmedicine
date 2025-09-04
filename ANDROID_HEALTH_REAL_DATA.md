# Hướng dẫn lấy dữ liệu thật từ Android Health Connect

## 🎯 **Tổng quan**

Để lấy dữ liệu thật từ Android Health Connect, bạn có 3 phương pháp:

1. **Progressive Web App (PWA)** - Dễ nhất
2. **Android App với Health Connect SDK** - Chuyên nghiệp nhất
3. **Web API với Health Connect** - Trung bình

## 📱 **Phương pháp 1: Progressive Web App (PWA)**

### **Ưu điểm:**
- ✅ Không cần Google Play Store
- ✅ Dễ deploy và update
- ✅ Hoạt động như app native
- ✅ Có thể lấy dữ liệu thật

### **Cách thực hiện:**

#### **Bước 1: Tạo PWA**
```bash
# Đã tạo sẵn:
- manifest.json
- sw.js (Service Worker)
- PWAInstall component
```

#### **Bước 2: Cài đặt PWA**
1. Mở Chrome trên Android
2. Truy cập `https://your-domain.com/android-health`
3. Click "Cài đặt ứng dụng"
4. Chọn "Thêm vào màn hình chính"

#### **Bước 3: Cấp quyền Health Connect**
1. Mở PWA đã cài đặt
2. Click "Kết nối Android Health"
3. Sẽ mở Health Connect app
4. Cấp quyền truy cập dữ liệu

#### **Bước 4: Lấy dữ liệu thật**
```javascript
// Trong Service Worker (sw.js)
async function getHealthDataFromHealthConnect() {
  // Sử dụng Health Connect Web API
  const healthData = await navigator.health.getData({
    types: ['steps', 'calories', 'heartRate', 'weight'],
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h ago
    endTime: new Date()
  });
  
  return healthData;
}
```

## 🤖 **Phương pháp 2: Android App với Health Connect SDK**

### **Ưu điểm:**
- ✅ Dữ liệu thật 100%
- ✅ Tích hợp sâu với Android
- ✅ Performance tốt nhất
- ✅ Có thể publish lên Play Store

### **Cách thực hiện:**

#### **Bước 1: Tạo Android Project**
```bash
# Sử dụng Android Studio
# Tạo project mới với Kotlin
```

#### **Bước 2: Thêm Health Connect SDK**
```kotlin
// build.gradle (app level)
dependencies {
    implementation "androidx.health.connect:connect-client:1.1.0-alpha07"
}
```

#### **Bước 3: Cấu hình permissions**
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.health.READ_STEPS" />
<uses-permission android:name="android.permission.health.READ_ACTIVE_CALORIES_BURNED" />
<uses-permission android:name="android.permission.health.READ_HEART_RATE" />
<uses-permission android:name="android.permission.health.READ_WEIGHT" />
```

#### **Bước 4: Implement Health Connect**
```kotlin
class HealthConnectManager {
    private val healthConnectClient = HealthConnectClient.getOrCreate(context)
    
    suspend fun requestPermissions() {
        val permissions = setOf(
            HealthPermission.getReadPermission(StepsRecord::class),
            HealthPermission.getReadPermission(ActiveCaloriesBurnedRecord::class),
            HealthPermission.getReadPermission(HeartRateRecord::class),
            HealthPermission.getReadPermission(WeightRecord::class)
        )
        
        healthConnectClient.permissionController.requestPermissions(permissions)
    }
    
    suspend fun readSteps(): List<StepsRecord> {
        val request = ReadRecordsRequest(
            recordType = StepsRecord::class,
            timeRangeFilter = TimeRangeFilter.between(
                Instant.now().minus(1, ChronoUnit.DAYS),
                Instant.now()
            )
        )
        
        val response = healthConnectClient.readRecords(request)
        return response.records
    }
}
```

#### **Bước 5: Gửi dữ liệu lên web app**
```kotlin
suspend fun syncToWebApp(healthData: HealthData) {
    val apiService = RetrofitClient.create()
    apiService.syncHealthData(healthData)
}
```

## 🌐 **Phương pháp 3: Web API với Health Connect**

### **Ưu điểm:**
- ✅ Không cần app riêng
- ✅ Hoạt động trên web
- ✅ Dễ maintain

### **Cách thực hiện:**

#### **Bước 1: Sử dụng Web Share API**
```javascript
// Mở Health Connect từ web
async function openHealthConnect() {
  if ('share' in navigator) {
    await navigator.share({
      title: 'Kết nối với Hoang Linh Medicine',
      text: 'Cho phép truy cập dữ liệu sức khỏe',
      url: window.location.href
    });
  }
}
```

#### **Bước 2: Sử dụng Health Connect Web API**
```javascript
// Lấy dữ liệu từ Health Connect
async function getHealthData() {
  if ('health' in navigator) {
    const health = navigator.health;
    
    const steps = await health.getSteps();
    const calories = await health.getCalories();
    const heartRate = await health.getHeartRate();
    const weight = await health.getWeight();
    
    return { steps, calories, heartRate, weight };
  }
}
```

## 🔧 **Implementation chi tiết**

### **1. PWA với Health Connect**

#### **Service Worker (sw.js):**
```javascript
// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'health-sync') {
    event.waitUntil(syncHealthData());
  }
});

async function syncHealthData() {
  try {
    // Lấy dữ liệu từ Health Connect
    const healthData = await getHealthDataFromHealthConnect();
    
    // Gửi lên server
    await fetch('/api/health/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(healthData)
    });
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
```

#### **Health Connect Web API:**
```javascript
class HealthConnectWebAPI {
  async requestPermissions() {
    const permissions = [
      'health:steps:read',
      'health:calories:read',
      'health:heart_rate:read',
      'health:weight:read'
    ];
    
    return await navigator.permissions.request({ name: 'health', permissions });
  }
  
  async getSteps() {
    const response = await fetch('health://steps', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + this.token }
    });
    
    return await response.json();
  }
}
```

### **2. Android App với Health Connect SDK**

#### **MainActivity.kt:**
```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var healthConnectManager: HealthConnectManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        healthConnectManager = HealthConnectManager(this)
        
        // Request permissions
        healthConnectManager.requestPermissions()
        
        // Read health data
        lifecycleScope.launch {
            val steps = healthConnectManager.readSteps()
            val calories = healthConnectManager.readCalories()
            val heartRate = healthConnectManager.readHeartRate()
            val weight = healthConnectManager.readWeight()
            
            // Sync to web app
            healthConnectManager.syncToWebApp(HealthData(steps, calories, heartRate, weight))
        }
    }
}
```

#### **API Service:**
```kotlin
interface HealthAPI {
    @POST("/api/health/sync")
    suspend fun syncHealthData(@Body data: HealthData): Response<SyncResponse>
}

data class HealthData(
    val steps: Int,
    val calories: Int,
    val heartRate: Int,
    val weight: Double,
    val timestamp: Long = System.currentTimeMillis()
)
```

## 🚀 **Deploy và Test**

### **1. Deploy PWA:**
```bash
# Build PWA
npm run build

# Deploy lên Render/Vercel
git push origin main
```

### **2. Test trên Android:**
1. Mở Chrome trên Android
2. Truy cập PWA URL
3. Cài đặt PWA
4. Cấp quyền Health Connect
5. Test lấy dữ liệu thật

### **3. Test Android App:**
1. Build APK
2. Cài đặt trên Android
3. Cấp quyền Health Connect
4. Test sync dữ liệu

## 📊 **Kết quả mong đợi**

### **PWA:**
- ✅ Hoạt động như app native
- ✅ Có thể lấy dữ liệu thật
- ✅ Background sync
- ✅ Push notifications

### **Android App:**
- ✅ Dữ liệu thật 100%
- ✅ Performance tốt nhất
- ✅ Tích hợp sâu với Android
- ✅ Có thể publish Play Store

## 🔒 **Bảo mật**

### **1. Data Encryption:**
```javascript
// Mã hóa dữ liệu trước khi gửi
const encryptedData = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: iv },
  key,
  new TextEncoder().encode(JSON.stringify(healthData))
);
```

### **2. Authentication:**
```javascript
// JWT token cho API
const token = await getAuthToken();
const response = await fetch('/api/health/sync', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### **3. Privacy:**
- Dữ liệu chỉ lưu trên thiết bị
- Không chia sẻ với bên thứ 3
- User có quyền xóa dữ liệu

## 💰 **Chi phí**

### **PWA:**
- ✅ **Miễn phí** - Chỉ cần hosting
- ✅ **Dễ deploy** - Không cần Play Store
- ✅ **Update nhanh** - Không cần review

### **Android App:**
- 💰 **Google Play Console**: $25 (một lần)
- 💰 **Development**: 2-3 tuần
- 💰 **Maintenance**: Ongoing

## 🎯 **Khuyến nghị**

### **Cho demo/test:**
- ✅ **PWA** - Nhanh nhất, dễ nhất

### **Cho production:**
- ✅ **Android App** - Chuyên nghiệp nhất
- ✅ **PWA** - Backup option

**PWA là lựa chọn tốt nhất để bắt đầu!** 🚀
