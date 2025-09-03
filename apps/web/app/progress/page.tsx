export default function ProgressPage() {
  return (
    <div className="page-background">
      <div className="page-container">
        {/* Progress Tracking */}
        <section className="progress-section">
          <div className="progress-container">
            {/* Progress Overview */}
            <div className="progress-overview">
              <div className="overview-card">
                <div className="overview-header">
                  <h3>🎯 Tổng quan mục tiêu</h3>
                  <div className="overview-period">
                    <select className="period-selector">
                      <option>7 ngày qua</option>
                      <option>30 ngày qua</option>
                      <option>3 tháng qua</option>
                      <option>Từ đầu</option>
                    </select>
                  </div>
                </div>
                
                <div className="overview-stats">
                  <div className="stat-item">
                    <div className="stat-icon">⚖️</div>
                    <div className="stat-content">
                      <div className="stat-value">-2.5 kg</div>
                      <div className="stat-label">Cân nặng giảm</div>
                      <div className="stat-change positive">↓ 12% so với mục tiêu</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon">📏</div>
                    <div className="stat-content">
                      <div className="stat-value">-3 cm</div>
                      <div className="stat-label">Vòng bụng giảm</div>
                      <div className="stat-change positive">↓ 8% so với mục tiêu</div>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                      <div className="stat-value">85%</div>
                      <div className="stat-label">Hoàn thành mục tiêu</div>
                      <div className="stat-change positive">Đúng tiến độ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weight Progress Chart */}
            <div className="chart-section">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>📊 Biểu đồ cân nặng</h3>
                  <div className="chart-controls">
                    <button className="chart-btn active">Tuần</button>
                    <button className="chart-btn">Tháng</button>
                    <button className="chart-btn">Quý</button>
                  </div>
                </div>
                
                <div className="chart-container">
                  <div className="weight-chart">
                    {/* Chart Placeholder */}
                    <div className="chart-placeholder">
                      <div className="chart-line">
                        <div className="chart-point" style={{left: '10%', top: '20%'}}></div>
                        <div className="chart-point" style={{left: '25%', top: '25%'}}></div>
                        <div className="chart-point" style={{left: '40%', top: '30%'}}></div>
                        <div className="chart-point" style={{left: '55%', top: '35%'}}></div>
                        <div className="chart-point" style={{left: '70%', top: '40%'}}></div>
                        <div className="chart-point" style={{left: '85%', top: '45%'}}></div>
                        <div className="chart-point" style={{left: '100%', top: '50%'}}></div>
                      </div>
                      <div className="chart-labels">
                        <span>Tuần 1</span>
                        <span>Tuần 2</span>
                        <span>Tuần 3</span>
                        <span>Tuần 4</span>
                        <span>Tuần 5</span>
                        <span>Tuần 6</span>
                        <span>Tuần 7</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color current"></div>
                      <span>Cân nặng hiện tại</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color target"></div>
                      <span>Mục tiêu</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color trend"></div>
                      <span>Xu hướng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Progress */}
            <div className="detailed-progress">
              <div className="progress-grid">
                {/* Weight Tracking */}
                <div className="progress-card">
                  <div className="card-header">
                    <h4>⚖️ Theo dõi cân nặng</h4>
                    <button className="add-btn">➕ Thêm</button>
                  </div>
                  <div className="card-content">
                    <div className="weight-list">
                      <div className="weight-entry">
                        <div className="entry-date">Hôm nay</div>
                        <div className="entry-weight">75.0 kg</div>
                        <div className="entry-change negative">-0.2 kg</div>
                      </div>
                      <div className="weight-entry">
                        <div className="entry-date">Hôm qua</div>
                        <div className="entry-weight">75.2 kg</div>
                        <div className="entry-change negative">-0.3 kg</div>
                      </div>
                      <div className="weight-entry">
                        <div className="entry-date">2 ngày trước</div>
                        <div className="entry-weight">75.5 kg</div>
                        <div className="entry-change positive">+0.1 kg</div>
                      </div>
                      <div className="weight-entry">
                        <div className="entry-date">3 ngày trước</div>
                        <div className="entry-weight">75.4 kg</div>
                        <div className="entry-change negative">-0.2 kg</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Measurements Tracking */}
                <div className="progress-card">
                  <div className="card-header">
                    <h4>�� Theo dõi số đo</h4>
                    <button className="add-btn">➕ Thêm</button>
                  </div>
                  <div className="card-content">
                    <div className="measurements-list">
                      <div className="measurement-item">
                        <div className="measurement-label">Vòng bụng</div>
                        <div className="measurement-value">85 cm</div>
                        <div className="measurement-change negative">-1 cm</div>
                      </div>
                      <div className="measurement-item">
                        <div className="measurement-label">Vòng ngực</div>
                        <div className="measurement-value">95 cm</div>
                        <div className="measurement-change">0 cm</div>
                      </div>
                      <div className="measurement-item">
                        <div className="measurement-label">Vòng mông</div>
                        <div className="measurement-value">98 cm</div>
                        <div className="measurement-change negative">-0.5 cm</div>
                      </div>
                      <div className="measurement-item">
                        <div className="measurement-label">Vòng đùi</div>
                        <div className="measurement-value">58 cm</div>
                        <div className="measurement-change">0 cm</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Tracking */}
                <div className="progress-card">
                  <div className="card-header">
                    <h4>🏃‍♂️ Hoạt động thể chất</h4>
                    <button className="add-btn">➕ Thêm</button>
                  </div>
                  <div className="card-content">
                    <div className="activity-summary">
                      <div className="activity-stat">
                        <div className="stat-label">Bước chân hôm nay</div>
                        <div className="stat-value">8,547</div>
                        <div className="stat-target">Mục tiêu: 10,000</div>
                      </div>
                      <div className="activity-stat">
                        <div className="stat-label">Calo đốt cháy</div>
                        <div className="stat-value">320</div>
                        <div className="stat-target">Mục tiêu: 400</div>
                      </div>
                      <div className="activity-stat">
                        <div className="stat-label">Thời gian vận động</div>
                        <div className="stat-value">45 phút</div>
                        <div className="stat-target">Mục tiêu: 60 phút</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nutrition Tracking */}
                <div className="progress-card">
                  <div className="card-header">
                    <h4>🍎 Theo dõi dinh dưỡng</h4>
                    <button className="add-btn">➕ Thêm</button>
                  </div>
                  <div className="card-content">
                    <div className="nutrition-summary">
                      <div className="nutrition-item">
                        <div className="nutrition-label">Calo nạp vào</div>
                        <div className="nutrition-value">1,850</div>
                        <div className="nutrition-target">/ 2,000 kcal</div>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{width: '92%'}}></div>
                        </div>
                      </div>
                      <div className="nutrition-item">
                        <div className="nutrition-label">Protein</div>
                        <div className="nutrition-value">120g</div>
                        <div className="nutrition-target">/ 150g</div>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{width: '80%'}}></div>
                        </div>
                      </div>
                      <div className="nutrition-item">
                        <div className="nutrition-label">Carbohydrate</div>
                        <div className="nutrition-value">200g</div>
                        <div className="nutrition-target">/ 250g</div>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{width: '80%'}}></div>
                        </div>
                      </div>
                      <div className="nutrition-item">
                        <div className="nutrition-label">Chất béo</div>
                        <div className="nutrition-value">65g</div>
                        <div className="nutrition-target">/ 70g</div>
                        <div className="nutrition-bar">
                          <div className="nutrition-fill" style={{width: '93%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Insights */}
            <div className="insights-section">
              <div className="insights-card">
                <div className="insights-header">
                  <h3>💡 Phân tích và gợi ý</h3>
                </div>
                <div className="insights-content">
                  <div className="insight-item positive">
                    <div className="insight-icon">✅</div>
                    <div className="insight-content">
                      <h4>Tiến độ tốt!</h4>
                      <p>Bạn đang giảm cân với tốc độ ổn định 0.3kg/tuần, phù hợp với mục tiêu an toàn.</p>
                    </div>
                  </div>
                  
                  <div className="insight-item warning">
                    <div className="insight-icon">⚠️</div>
                    <div className="insight-content">
                      <h4>Cần cải thiện</h4>
                      <p>Hoạt động thể chất chưa đạt mục tiêu. Hãy tăng cường đi bộ hoặc tập thể dục.</p>
                    </div>
                  </div>
                  
                  <div className="insight-item info">
                    <div className="insight-icon">💡</div>
                    <div className="insight-content">
                      <h4>Gợi ý</h4>
                      <p>Để đạt mục tiêu, bạn cần duy trì tốc độ giảm cân hiện tại và tăng cường vận động.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="export-section">
              <div className="export-card">
                <h3>📤 Xuất dữ liệu</h3>
                <p>Xuất dữ liệu tiến độ để chia sẻ với bác sĩ hoặc lưu trữ cá nhân</p>
                <div className="export-actions">
                  <button className="btn btn-outline">📊 PDF Report</button>
                  <button className="btn btn-outline">📈 Excel Data</button>
                  <button className="btn btn-outline">📱 Chia sẻ</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
