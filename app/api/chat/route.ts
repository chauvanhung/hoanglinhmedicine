import { NextRequest, NextResponse } from 'next/server'
import { productsDB } from '@/lib/products'

// Lưu trữ ngữ cảnh cuộc hội thoại (đơn giản)
let conversationContext = {
  lastTopic: '',
  lastProducts: [] as any[]
}

// Tìm kiếm sản phẩm
function searchProducts(query: string) {
  const lowerQuery = query.toLowerCase().trim()
  
  // Tìm kiếm chính xác tên thuốc trước
  const exactMatch = productsDB.find(product =>
    product.name.toLowerCase() === lowerQuery ||
    product.activeIngredient.toLowerCase() === lowerQuery
  )
  
  if (exactMatch) {
    return [exactMatch]
  }
  
  // Tìm kiếm tên thuốc chứa từ khóa
  const nameMatches = productsDB.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.activeIngredient.toLowerCase().includes(lowerQuery)
  )
  
  if (nameMatches.length > 0) {
    return nameMatches
  }
  
  // Tìm kiếm theo từng từ trong câu hỏi
  const words = lowerQuery.split(' ').filter(word => word.length > 1)
  
  if (words.length > 0) {
    return productsDB.filter(product =>
      words.some(word =>
        product.name.toLowerCase().includes(word) ||
        product.activeIngredient.toLowerCase().includes(word) ||
        product.symptoms.some(symptom => symptom.toLowerCase().includes(word)) ||
        product.uses.toLowerCase().includes(word)
      )
    )
  }
  
  return []
}

// Xử lý câu hỏi
function processQuestion(question: string): string {
  const lowerQuestion = question.toLowerCase()
  
  // Kiểm tra câu hỏi về chẩn đoán bệnh
  const medicalKeywords = [
    'chẩn đoán', 'bệnh gì', 'có sao không', 'nguy hiểm', 'nghiêm trọng',
    'ung thư', 'tiểu đường', 'huyết áp cao', 'tim mạch', 'thần kinh',
    'tâm thần', 'tâm lý', 'trầm cảm', 'lo âu', 'stress'
  ]
  
  if (medicalKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    return `⚠️ **Lưu ý quan trọng:**\n\n` +
           `Tôi không thể chẩn đoán bệnh hoặc đưa ra lời khuyên y tế.\n\n` +
           `**Vui lòng liên hệ:**\n` +
           `📞 **Hotline:** 1900-xxxx\n` +
           `🏥 **Nhà thuốc:** Hoàng Linh Medicine\n` +
           `📍 **Địa chỉ:** [Địa chỉ nhà thuốc]\n\n` +
           `Bác sĩ sẽ giúp bạn chẩn đoán chính xác.`
  }

  // Kiểm tra câu hỏi về sản phẩm khác
  const similarKeywords = ['khác', 'nữa', 'thêm', 'còn', 'tương tự', 'giống', 'khác loại']
  const isAskingForSimilar = similarKeywords.some(keyword => lowerQuestion.includes(keyword))

  let products = searchProducts(question)

  // Nếu hỏi về sản phẩm khác và không tìm thấy sản phẩm cụ thể
  if (isAskingForSimilar && products.length === 0) {
    if (conversationContext.lastTopic && conversationContext.lastProducts.length > 0) {
      products = conversationContext.lastProducts
    }
  }

  if (products.length === 0) {
    return `Xin lỗi, tôi không tìm thấy thông tin về sản phẩm này.\n\n` +
           `**Để được tư vấn chi tiết, vui lòng liên hệ:**\n` +
           `📞 **Hotline:** 1900-xxxx\n` +
           `🏥 **Nhà thuốc:** Hoàng Linh Medicine\n` +
           `📍 **Địa chỉ:** [Địa chỉ nhà thuốc]`
  }

  // Cập nhật ngữ cảnh
  if (products.length > 0 && !isAskingForSimilar) {
    conversationContext.lastProducts = products
    conversationContext.lastTopic = products[0].uses
  }

  const product = products[0]
  
  // Trả lời dựa trên loại câu hỏi
  if (lowerQuestion.includes('giá') || lowerQuestion.includes('bao nhiêu')) {
    return `💰 **${product.name}** - ${product.activeIngredient} ${product.dosage}\n` +
           `**Giá:** ${product.price.toLocaleString('vi-VN')} VNĐ\n` +
           `**Nhà sản xuất:** ${product.manufacturer}`
  }
  
  if (lowerQuestion.includes('thành phần') || lowerQuestion.includes('hoạt chất')) {
    return `🧪 **${product.name}**\n` +
           `**Thành phần:** ${product.ingredient}\n` +
           `**Hoạt chất:** ${product.activeIngredient}\n` +
           `**Hàm lượng:** ${product.dosage}`
  }
  
  if (lowerQuestion.includes('dùng cho') || lowerQuestion.includes('triệu chứng')) {
    return `🎯 **${product.name}**\n` +
           `**Công dụng:** ${product.uses}\n` +
           `**Triệu chứng phù hợp:** ${product.symptoms.join(', ')}\n` +
           `**Hướng dẫn:** ${product.instructions}`
  }
  
  // Trả lời tổng quan
  return `💊 **${product.name}** - ${product.activeIngredient} ${product.dosage}\n\n` +
         `💰 **Giá:** ${product.price.toLocaleString('vi-VN')} VNĐ\n` +
         `🎯 **Công dụng:** ${product.uses}\n` +
         `📋 **Triệu chứng:** ${product.symptoms.join(', ')}\n` +
         `⚠️ **Tác dụng phụ:** ${product.sideEffects.join(', ')}\n` +
         `📋 **Hướng dẫn:** ${product.instructions}\n` +
         `🏭 **Nhà sản xuất:** ${product.manufacturer}`
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const response = processQuestion(message)
    
    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 