import type { NextApiRequest, NextApiResponse } from 'next'

type ThuocInfo = {
  ten: string
  hoat_chat: string
  cong_dung: string
  lieu_dung: string
  can_luu_y: string
  duong_dan: string
}

const danhSachThuoc: ThuocInfo[] = [
  {
    ten: 'Paracetamol',
    hoat_chat: 'Paracetamol 500mg',
    cong_dung: 'Giảm đau, hạ sốt nhẹ đến vừa.',
    lieu_dung: 'Người lớn: 500–1000mg mỗi 4–6 giờ. Không quá 4g/ngày.',
    can_luu_y: 'Tránh dùng quá liều. Không kết hợp với rượu hoặc thuốc có cùng hoạt chất.',
    duong_dan: '/san-pham/paracetamol'
  },
  {
    ten: 'Vitamin C 1000mg',
    hoat_chat: 'Acid Ascorbic 1000mg',
    cong_dung: 'Tăng sức đề kháng, chống oxy hóa.',
    lieu_dung: 'Uống 1 viên/ngày sau ăn. Không dùng lúc đói.',
    can_luu_y: 'Có thể gây kích ứng dạ dày nếu uống lúc đói.',
    duong_dan: '/san-pham/vitamin-c-1000'
  },
  {
    ten: 'Omeprazole',
    hoat_chat: 'Omeprazole 20mg',
    cong_dung: 'Giảm tiết acid dạ dày, điều trị viêm loét, trào ngược.',
    lieu_dung: '1 viên mỗi sáng trước ăn, dùng 4–8 tuần theo chỉ định.',
    can_luu_y: 'Không dùng lâu dài nếu không có chỉ định. Có thể gây thiếu B12 khi dùng kéo dài.',
    duong_dan: '/san-pham/omeprazole'
  }
  // 👉 Có thể thêm các thuốc khác ở đây
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ten } = req.query

  if (!ten || typeof ten !== 'string') {
    return res.status(400).json({ error: 'Thiếu tên thuốc cần tìm.' })
  }

  const matched = danhSachThuoc.find(
    (thuoc) => thuoc.ten.toLowerCase() === ten.toLowerCase()
  )

  if (!matched) {
    return res.status(404).json({ error: 'Không tìm thấy thông ten thuốc.' })
  }

  return res.status(200).json(matched)
}
