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
  
  // Tìm kiếm theo từ khóa đặc biệt (ưu tiên cao nhất)
  const specialKeywords = {
    'loãng xương': ['Alendronate', 'Risedronate', 'Calcium Carbonate', 'Vitamin D3'],
    'đau đầu': ['Paracetamol', 'Ibuprofen', 'Aspirin'],
    'sốt': ['Paracetamol', 'Ibuprofen'],
    'dạ dày': ['Omeprazole', 'Pantoprazole', 'Ranitidine'],
    'dị ứng': ['Cetirizine', 'Loratadine', 'Fexofenadine'],
    'tiểu đường': ['Metformin', 'Glimepiride'],
    'huyết áp': ['Losartan', 'Amlodipine', 'Atorvastatin'],
    'canxi': ['Calcium Carbonate', 'Vitamin D3'],
    'vitamin': ['Vitamin C', 'Vitamin D3', 'Vitamin B12']
  }
  
  for (const [keyword, productNames] of Object.entries(specialKeywords)) {
    if (lowerQuery.includes(keyword)) {
      const matchedProducts = productsDB.filter(product =>
        productNames.includes(product.name)
      )
      if (matchedProducts.length > 0) {
        return matchedProducts
      }
    }
  }
  
  // Tìm kiếm chính xác tên thuốc
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
  
  // Tìm kiếm theo công dụng và triệu chứng
  const usageMatches = productsDB.filter(product =>
    product.uses.toLowerCase().includes(lowerQuery) ||
    product.symptoms.some(symptom => symptom.toLowerCase().includes(lowerQuery))
  )
  
  if (usageMatches.length > 0) {
    return usageMatches
  }
  
  // Tìm kiếm theo từng từ trong câu hỏi
  const words = lowerQuery.split(' ').filter(word => word.length > 2)
  
  if (words.length > 0) {
    const wordMatches = productsDB.filter(product =>
      words.some(word =>
        product.name.toLowerCase().includes(word) ||
        product.activeIngredient.toLowerCase().includes(word) ||
        product.symptoms.some(symptom => symptom.toLowerCase().includes(word)) ||
        product.uses.toLowerCase().includes(word)
      )
    )
    
    if (wordMatches.length > 0) {
      return wordMatches
    }
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

  // Nếu hỏi về sản phẩm khác và có context trước đó
  if (isAskingForSimilar && conversationContext.lastTopic) {
    // Tìm sản phẩm khác cùng loại dựa trên lastTopic
    const relatedProducts = productsDB.filter(product => 
      product.uses.toLowerCase().includes(conversationContext.lastTopic.toLowerCase()) ||
      product.symptoms.some(symptom => 
        symptom.toLowerCase().includes(conversationContext.lastTopic.toLowerCase())
      )
    )
    
    // Loại bỏ sản phẩm đã hiển thị trước đó
    const newProducts = relatedProducts.filter(product => 
      !conversationContext.lastProducts.some(lastProduct => lastProduct.id === product.id)
    )
    
    if (newProducts.length > 0) {
      products = [newProducts[0]] // Lấy sản phẩm đầu tiên chưa hiển thị
      // Cập nhật context với sản phẩm mới
      conversationContext.lastProducts.push(products[0])
    } else {
      // Nếu không còn sản phẩm mới, trả về thông báo
      return `✅ **Đã hiển thị tất cả sản phẩm liên quan đến ${conversationContext.lastTopic}**\n\n` +
             `**Để được tư vấn chi tiết hơn, vui lòng liên hệ:**\n` +
             `📞 **Hotline:** 1900-xxxx\n` +
             `🏥 **Nhà thuốc:** Hoàng Linh Medicine\n` +
             `📍 **Địa chỉ:** [Địa chỉ nhà thuốc]`
    }
  }

  if (products.length === 0) {
    return `Xin lỗi, tôi không tìm thấy thông tin về sản phẩm này.\n\n` +
           `**Để được tư vấn chi tiết, vui lòng liên hệ:**\n` +
           `📞 **Hotline:** 1900-xxxx\n` +
           `🏥 **Nhà thuốc:** Hoàng Linh Medicine\n` +
           `📍 **Địa chỉ:** [Địa chỉ nhà thuốc]`
  }

  // Cập nhật ngữ cảnh cho câu hỏi mới (không phải hỏi sản phẩm khác)
  if (products.length > 0 && !isAskingForSimilar) {
    conversationContext.lastProducts = products.slice(0, 3) // Lưu tối đa 3 sản phẩm
    conversationContext.lastTopic = products[0].uses
  }

  // Nếu có nhiều sản phẩm và hỏi về bệnh/triệu chứng, hiển thị danh sách
  if (products.length > 1 && (lowerQuestion.includes('loãng xương') || lowerQuestion.includes('đau đầu') || lowerQuestion.includes('dạ dày') || lowerQuestion.includes('dị ứng'))) {
    let response = `🔍 **Tìm thấy ${products.length} sản phẩm phù hợp:**\n\n`
    
    products.slice(0, 3).forEach((product, index) => {
      response += `${index + 1}. **${product.name}** - ${product.activeIngredient} ${product.dosage}\n` +
                 `💰 **Giá:** ${product.price.toLocaleString('vi-VN')} VNĐ\n` +
                 `🎯 **Công dụng:** ${product.uses}\n\n`
    })
    
    response += `**Để được tư vấn chi tiết, vui lòng liên hệ:**\n` +
                `📞 **Hotline:** 1900-xxxx\n` +
                `🏥 **Nhà thuốc:** Hoàng Linh Medicine`
    
    return response
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