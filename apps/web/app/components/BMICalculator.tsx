'use client'

import { useState } from 'react'

export default function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState('')

  const calculateBMI = () => {
    if (!height || !weight) return
    
    const heightM = parseFloat(height) / 100
    const weightKg = parseFloat(weight)
    const bmiValue = weightKg / (heightM * heightM)
    
    setBmi(Math.round(bmiValue * 10) / 10)
    
    if (bmiValue < 18.5) setCategory('Thiếu cân')
    else if (bmiValue < 25) setCategory('Bình thường')
    else if (bmiValue < 30) setCategory('Thừa cân')
    else if (bmiValue < 35) setCategory('Béo phì độ I')
    else if (bmiValue < 40) setCategory('Béo phì độ II')
    else setCategory('Béo phì độ III')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Máy tính BMI</h1>
          <p className="text-gray-600">Tính toán chỉ số khối cơ thể</p>
        </div>

        <div className="card">
          <div className="space-y-6">
            <div>
              <label className="form-label">Chiều cao (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="input-field"
                placeholder="170"
              />
            </div>

            <div>
              <label className="form-label">Cân nặng (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input-field"
                placeholder="70"
              />
            </div>

            <button
              onClick={calculateBMI}
              className="btn-primary w-full"
            >
              Tính BMI
            </button>

            {bmi && (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl font-bold text-primary-600 mb-2">{bmi}</div>
                <div className="text-lg text-gray-700">{category}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
