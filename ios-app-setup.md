# Hướng dẫn tạo iOS App với Apple Health Integration

## 📱 **Bước 1: Tạo iOS Project**

### **Requirements:**
- Mac với Xcode 14+
- Apple Developer Account ($99/năm)
- iPhone/iPad để test

### **Tạo project:**
1. Mở Xcode
2. File → New → Project
3. Chọn "iOS" → "App"
4. Product Name: "HoangLinhHealth"
5. Interface: SwiftUI
6. Language: Swift

## 🔧 **Bước 2: Cấu hình HealthKit**

### **1. Enable HealthKit Capability:**
- Project Settings → Signing & Capabilities
- Click "+ Capability"
- Chọn "HealthKit"
- Enable "HealthKit"

### **2. Add HealthKit Framework:**
```swift
import HealthKit
```

### **3. Request Permissions:**
```swift
class HealthKitManager: ObservableObject {
    private let healthStore = HKHealthStore()
    
    func requestAuthorization() {
        let typesToRead: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.quantityType(forIdentifier: .bodyMass)!
        ]
        
        healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
            if success {
                print("HealthKit authorization granted")
            } else {
                print("HealthKit authorization denied: \(error?.localizedDescription ?? "")")
            }
        }
    }
}
```

## 📊 **Bước 3: Lấy dữ liệu HealthKit**

### **Steps Data:**
```swift
func fetchSteps(completion: @escaping (Double) -> Void) {
    guard let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount) else { return }
    
    let calendar = Calendar.current
    let now = Date()
    let startOfDay = calendar.startOfDay(for: now)
    
    let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: now, options: .strictStartDate)
    
    let query = HKStatisticsQuery(quantityType: stepType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
        guard let result = result, let sum = result.sumQuantity() else {
            completion(0)
            return
        }
        completion(sum.doubleValue(for: HKUnit.count()))
    }
    
    healthStore.execute(query)
}
```

### **Heart Rate Data:**
```swift
func fetchHeartRate(completion: @escaping (Double) -> Void) {
    guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else { return }
    
    let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
    let query = HKSampleQuery(sampleType: heartRateType, predicate: nil, limit: 1, sortDescriptors: [sortDescriptor]) { _, samples, error in
        guard let sample = samples?.first as? HKQuantitySample else {
            completion(0)
            return
        }
        completion(sample.quantity.doubleValue(for: HKUnit(from: "count/min")))
    }
    
    healthStore.execute(query)
}
```

### **Weight Data:**
```swift
func fetchWeight(completion: @escaping (Double) -> Void) {
    guard let weightType = HKQuantityType.quantityType(forIdentifier: .bodyMass) else { return }
    
    let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
    let query = HKSampleQuery(sampleType: weightType, predicate: nil, limit: 1, sortDescriptors: [sortDescriptor]) { _, samples, error in
        guard let sample = samples?.first as? HKQuantitySample else {
            completion(0)
            return
        }
        completion(sample.quantity.doubleValue(for: HKUnit.gramUnit(with: .kilo)))
    }
    
    healthStore.execute(query)
}
```

## 🌐 **Bước 4: Kết nối với Web App**

### **1. Tạo API Endpoint:**
```swift
func sendDataToWebApp(data: HealthData) {
    guard let url = URL(string: "https://your-web-app.com/api/health-data") else { return }
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let jsonData = try? JSONEncoder().encode(data)
    request.httpBody = jsonData
    
    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            print("Error: \(error)")
        } else {
            print("Data sent successfully")
        }
    }.resume()
}
```

### **2. HealthData Model:**
```swift
struct HealthData: Codable {
    let steps: Double
    let calories: Double
    let heartRate: Double
    let weight: Double
    let timestamp: Date
}
```

## 🔐 **Bước 5: Bảo mật và Authentication**

### **1. JWT Token:**
```swift
func authenticateWithWebApp() {
    // Gửi device ID hoặc user token để xác thực
    let deviceId = UIDevice.current.identifierForVendor?.uuidString ?? ""
    // Gửi lên web app để lấy JWT token
}
```

### **2. Encrypt Data:**
```swift
func encryptHealthData(_ data: HealthData) -> String {
    // Mã hóa dữ liệu trước khi gửi
    // Sử dụng AES encryption
}
```

## 📱 **Bước 6: UI SwiftUI**

### **Main View:**
```swift
struct ContentView: View {
    @StateObject private var healthManager = HealthKitManager()
    @State private var healthData = HealthData(steps: 0, calories: 0, heartRate: 0, weight: 0, timestamp: Date())
    
    var body: some View {
        VStack {
            Text("Apple Health Data")
                .font(.largeTitle)
                .padding()
            
            VStack(alignment: .leading, spacing: 20) {
                HealthDataRow(title: "Steps", value: "\(Int(healthData.steps))")
                HealthDataRow(title: "Calories", value: "\(Int(healthData.calories))")
                HealthDataRow(title: "Heart Rate", value: "\(Int(healthData.heartRate)) bpm")
                HealthDataRow(title: "Weight", value: "\(healthData.weight, specifier: "%.1f") kg")
            }
            .padding()
            
            Button("Sync with Web App") {
                healthManager.sendDataToWebApp(data: healthData)
            }
            .buttonStyle(.borderedProminent)
            .padding()
        }
        .onAppear {
            healthManager.requestAuthorization()
            healthManager.fetchAllData { data in
                healthData = data
            }
        }
    }
}
```

## 🚀 **Bước 7: Deploy lên App Store**

### **1. Archive App:**
- Product → Archive
- Distribute App → App Store Connect

### **2. App Store Connect:**
- Tạo app mới
- Upload build
- Submit for review

### **3. TestFlight:**
- Beta testing trước khi release
- Test với real HealthKit data

## 🔗 **Bước 8: Kết nối với Web App**

### **Web App API Endpoint:**
```typescript
// apps/api/src/health/health.controller.ts
@Post('health-data')
async receiveHealthData(@Body() data: HealthDataDto) {
  // Lưu dữ liệu vào database
  // Gửi notification cho user
  // Cập nhật dashboard
}
```

### **Real-time Updates:**
```typescript
// WebSocket để cập nhật real-time
@WebSocketGateway()
export class HealthGateway {
  @SubscribeMessage('health-sync')
  handleHealthSync(client: Socket, data: HealthData) {
    // Broadcast đến tất cả clients
    this.server.emit('health-update', data);
  }
}
```

## 📋 **Checklist hoàn thành:**

- [ ] Tạo iOS project với HealthKit
- [ ] Request HealthKit permissions
- [ ] Implement data fetching
- [ ] Tạo API endpoints
- [ ] Implement authentication
- [ ] Test trên device thật
- [ ] Deploy lên App Store
- [ ] Kết nối với web app

## 💰 **Chi phí:**
- Apple Developer Account: $99/năm
- Mac để develop: $1000+
- iPhone để test: $400+

## ⏱️ **Thời gian:**
- Development: 2-3 tuần
- App Store review: 1-2 tuần
- Total: 1-2 tháng
