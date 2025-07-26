'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface AIConsultationProps {
  onClose: () => void
}

export default function AIConsultation({ onClose }: AIConsultationProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Xin chào! Tôi là trợ lý AI của Hoàng Linh Medicine. Tôi có thể giúp bạn tư vấn về thuốc, sức khỏe và các vấn đề y tế. Bạn có câu hỏi gì không?',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Tìm tên sản phẩm trong câu hỏi
      const match = inputValue.match(/paracetamol|vitamin c|omeprazole|hapacol|decolgen/i)
      if (match) {
        const productName = match[0]
        const res = await fetch(`/api/products?name=${encodeURIComponent(productName)}`)
        const data = await res.json()
        if (data.length > 0) {
          const info = data[0]
          const response = `**${info.name}**\n\n- Giá: ${info.price} VNĐ\n- Hoạt chất: ${info.ingredient}\n- Công dụng: ${info.uses}`
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: response,
            role: 'assistant',
            timestamp: new Date()
          }])
          setIsLoading(false)
          return
        } else {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: 'Xin lỗi, tôi không tìm thấy thông tin sản phẩm bạn hỏi. Vui lòng kiểm tra lại tên sản phẩm.',
            role: 'assistant',
            timestamp: new Date()
          }])
          setIsLoading(false)
          return
        }
      }

      // Nếu hỏi về bệnh/lâm sàng thì trả về hướng dẫn liên hệ
      if (includesMany(inputValue.toLowerCase(), [
        'đau', 'sốt', 'cảm', 'cúm', 'ho', 'viêm', 'mất ngủ', 'khó ngủ', 'ngủ không được', 'trằn trọc', 'không thể ngủ',
        'dạ dày', 'đau bụng', 'bao tử', 'ợ chua', 'viêm loét', 'tiêu hóa', 'táo bón', 'khó tiêu', 'đầy bụng',
        'dị ứng', 'ngứa', 'mề đay', 'mẩn đỏ', 'huyết áp', 'cao huyết áp', 'máu cao', 'tăng huyết áp',
        'giảm cân', 'tăng cân', 'béo', 'gầy', 'ốm', 'covid', 'dương tính', 'f0', 'test covid'
      ])) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: 'Vui lòng liên hệ qua Zalo hoặc số điện thoại của Hoàng Linh Medicine để được dược sĩ tư vấn trực tiếp về vấn đề sức khỏe của bạn.',
          role: 'assistant',
          timestamp: new Date()
        }])
        setIsLoading(false)
        return
      }

      // Nếu không match, trả về mặc định
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Bạn chỉ có thể hỏi về sản phẩm hoặc thuốc. Nếu cần tư vấn về bệnh, vui lòng liên hệ qua Zalo hoặc số điện thoại của Hoàng Linh Medicine.',
        role: 'assistant',
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Có lỗi xảy ra, vui lòng thử lại sau.',
        role: 'assistant',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const includesMany = (input: string, keywords: string[]) => {
    return keywords.some(keyword => input.includes(keyword))
  }

  const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
  const [lastTopic, setLastTopic] = useState<string | null>(null)

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Đau đầu
    if (includesMany(input, ['đau đầu', 'nhức đầu', 'đầu căng', 'đầu quay'])) {
      return random([
        'Đau đầu có thể do thiếu ngủ, căng thẳng hoặc môi trường. Bạn có thể nghỉ ngơi, uống nước và thử dùng Paracetamol nếu cần.',
        'Bạn bị đau đầu thường xuyên không? Nếu có kèm theo chóng mặt hoặc mờ mắt, nên đi khám bác sĩ.',
        'Để giảm đau đầu, bạn có thể chườm mát vùng trán và tránh nhìn vào màn hình quá lâu.'
      ])
    }

    // Mất ngủ
    if (includesMany(input, ['mất ngủ', 'khó ngủ', 'ngủ không được', 'trằn trọc', 'không thể ngủ'])) {
      return random([
        'Khó ngủ khiến bạn mệt mỏi cả ngày đúng không? Bạn nên hạn chế sử dụng điện thoại trước khi ngủ và giữ phòng ngủ yên tĩnh.',
        'Bạn có thể thử uống trà tâm sen hoặc dùng thực phẩm chức năng như melatonin. Muốn tôi gợi ý vài sản phẩm không?',
        'Thư giãn trước khi ngủ, tắm nước ấm hoặc nghe nhạc nhẹ cũng có thể giúp bạn dễ ngủ hơn.'
      ])
    }

    // Sốt
    if (includesMany(input, ['sốt', 'nóng', 'sốt cao', 'sốt nhẹ'])) {
      return random([
        'Khi bị sốt, bạn nên đo nhiệt độ thường xuyên, uống nhiều nước và nghỉ ngơi. Paracetamol có thể giúp hạ sốt.',
        'Bạn bị sốt bao lâu rồi? Nếu sốt trên 39°C hoặc kéo dài >3 ngày, hãy đến cơ sở y tế.',
        'Ngoài sốt, bạn có cảm thấy mệt, ho hay đau họng không? Tôi có thể tư vấn thuốc theo triệu chứng.'
      ])
    }

    // Cảm cúm, ho
    if (includesMany(input, ['cảm', 'cúm', 'ho', 'sổ mũi', 'viêm họng'])) {
      return random([
        'Cảm cúm thường do virus, bạn nên nghỉ ngơi, uống nhiều nước và giữ ấm cơ thể.',
        'Bạn có thể dùng thuốc giảm ho, chống sổ mũi như Decolgen, Hapacol C. Muốn tôi tư vấn cụ thể hơn không?',
        'Rửa tay thường xuyên và đeo khẩu trang để tránh lây lan cho người khác nhé.'
      ])
    }

    // Dạ dày
    if (includesMany(input, ['dạ dày', 'đau bụng', 'bao tử', 'ợ chua', 'viêm loét'])) {
      return random([
        'Vấn đề dạ dày thường liên quan đến ăn uống, stress hoặc vi khuẩn HP. Bạn nên ăn đúng giờ, tránh đồ cay nóng.',
        'Có thể dùng thuốc như Omeprazole, Gaviscon để giảm triệu chứng. Muốn tôi giới thiệu vài sản phẩm không?',
        'Nếu đau bụng liên tục hoặc kèm theo nôn, bạn nên đi khám bác sĩ để kiểm tra chính xác.'
      ])
    }

    // Tiêu hóa kém, táo bón
    if (includesMany(input, ['tiêu hóa', 'táo bón', 'khó tiêu', 'đầy bụng'])) {
      return random([
        'Bạn nên uống nhiều nước, ăn nhiều rau xanh và trái cây để hỗ trợ tiêu hóa.',
        'Men vi sinh hoặc chất xơ hòa tan như psyllium có thể giúp cải thiện táo bón. Bạn có muốn tôi tư vấn thêm không?',
        'Tình trạng này xảy ra thường xuyên không? Có thể liên quan đến chế độ ăn uống hoặc lối sống đấy.'
      ])
    }

    // Tăng đề kháng, vitamin
    if (includesMany(input, ['sức đề kháng', 'tăng đề kháng', 'vitamin', 'vitamin c'])) {
      return random([
        'Vitamin C, D, và kẽm là những chất giúp tăng sức đề kháng. Bạn có thể bổ sung hàng ngày.',
        'Ngoài vitamin, giấc ngủ đủ và vận động đều đặn cũng rất quan trọng với hệ miễn dịch.',
        'Bạn có đang ăn uống đủ rau củ quả không? Tôi có thể gợi ý một vài sản phẩm bổ sung.'
      ])
    }

    // Dị ứng
    if (includesMany(input, ['dị ứng', 'ngứa', 'mề đay', 'mẩn đỏ'])) {
      return random([
        'Dị ứng có thể do thức ăn, thời tiết hoặc bụi. Bạn nên tránh tác nhân nghi ngờ và có thể dùng Cetirizin hoặc Loratadin.',
        'Nếu ngứa lan rộng hoặc khó thở, hãy đến cơ sở y tế ngay. Bạn có muốn tôi gợi ý thuốc dị ứng không?',
        'Bạn bị dị ứng vào thời điểm nhất định hay quanh năm? Tôi có thể giúp bạn xác định nguyên nhân.'
      ])
    }

    // Huyết áp
    if (includesMany(input, ['huyết áp', 'cao huyết áp', 'máu cao', 'tăng huyết áp'])) {
      return random([
        'Bạn nên đo huyết áp mỗi ngày, ăn ít muối và vận động nhẹ nhàng. Dùng thuốc đúng theo chỉ định của bác sĩ.',
        'Có nhiều loại thực phẩm chức năng hỗ trợ huyết áp như tỏi đen, nattokinase. Tôi có thể giới thiệu nếu bạn cần.',
        'Bạn đang dùng loại thuốc nào? Nếu muốn, tôi có thể kiểm tra giúp tương tác thuốc.'
      ])
    }

    // Cân nặng
    if (includesMany(input, ['giảm cân', 'tăng cân', 'béo', 'gầy', 'ốm'])) {
      return random([
        'Bạn muốn tăng hay giảm cân? Tôi có thể gợi ý chế độ ăn và thực phẩm hỗ trợ phù hợp.',
        'Tăng cân: nên ăn đủ bữa, bổ sung protein, sữa dinh dưỡng. Giảm cân: ăn kiểm soát, vận động, ngủ đủ.',
        'Bạn có thường xuyên ăn sáng và vận động không? Đây là 2 yếu tố rất quan trọng.'
      ])
    }

    // Covid / F0
    if (includesMany(input, ['covid', 'dương tính', 'f0', 'test covid'])) {
      return random([
        'Nếu bạn dương tính, nên nghỉ ngơi, cách ly và theo dõi triệu chứng. Dùng thuốc hạ sốt, giảm ho nếu cần.',
        'Bạn có thể uống nước ấm, xông mũi họng nhẹ nhàng và bổ sung vitamin C/D để hỗ trợ phục hồi.',
        'Nếu cảm thấy khó thở hoặc sốt cao liên tục, hãy đến bệnh viện sớm.'
      ])
    }

    // Fallback
    return 'Tôi chưa rõ câu hỏi của bạn. Bạn có thể hỏi về:\n\n- Tác dụng thuốc\n- Tư vấn khi cảm cúm, ho, sốt, đau bụng\n- Giấc ngủ, tiêu hóa, huyết áp, dị ứng, tăng sức đề kháng\n\nCứ thoải mái hỏi, tôi sẽ cố gắng hỗ trợ bạn nhé!'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Tư vấn AI</h3>
              <p className="text-sm text-gray-500">Trợ lý sức khỏe thông minh</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.role === 'user' && (
                    <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Lưu ý: Tư vấn này chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến bác sĩ cho các vấn đề sức khỏe nghiêm trọng.
          </p>
        </div>
      </div>
    </div>
  )
}