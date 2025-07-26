// File: app/api/products/route.ts (Next.js 13+ với app router)

import { NextRequest } from 'next/server'

const mockDB = [
  {
    name: 'Paracetamol',
    ingredient: 'Paracetamol 500mg',
    uses: 'Giảm đau, hạ sốt',
    price: '15,000'
  },
  {
    name: 'Vitamin C',
    ingredient: 'Vitamin C 1000mg',
    uses: 'Tăng sức đề kháng',
    price: '35,000'
  }
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')?.toLowerCase()

  if (!name) {
    return new Response(JSON.stringify([]), { status: 200 })
  }

  const result = mockDB.filter(p =>
    p.name.toLowerCase().includes(name)
  )

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  })
}
