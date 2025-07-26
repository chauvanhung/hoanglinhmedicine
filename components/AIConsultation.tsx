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
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const aiResponse = generateAIResponse(inputValue)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('đau đầu') || input.includes('nhức đầu')) {
      return 'Đau đầu có thể do nhiều nguyên nhân như căng thẳng, thiếu ngủ, hoặc các vấn đề về thị giác. Tôi khuyên bạn:\n\n1. Nghỉ ngơi đầy đủ\n2. Uống đủ nước\n3. Có thể dùng Paracetamol 500mg nếu cần\n4. Nếu đau kéo dài, hãy đến gặp bác sĩ\n\nBạn có muốn tôi tư vấn thêm về thuốc giảm đau không?'
    }
    
    if (input.includes('sốt') || input.includes('nóng')) {
      return 'Khi bị sốt, bạn nên:\n\n1. Đo nhiệt độ cơ thể\n2. Nghỉ ngơi và uống nhiều nước\n3. Dùng thuốc hạ sốt như Paracetamol\n4. Theo dõi các triệu chứng khác\n\nNếu sốt cao trên 39°C hoặc kéo dài, hãy đến bệnh viện ngay. Bạn có cần tư vấn về thuốc hạ sốt không?'
    }
    
    if (input.includes('vitamin') || input.includes('sức đề kháng')) {
      return 'Để tăng cường sức đề kháng, bạn có thể:\n\n1. Bổ sung Vitamin C 1000mg hàng ngày\n2. Ăn nhiều rau xanh và trái cây\n3. Tập thể dục đều đặn\n4. Ngủ đủ giấc\n\nTôi có thể giới thiệu một số sản phẩm vitamin chất lượng cao. Bạn có quan tâm không?'
    }
    
    if (input.includes('dạ dày') || input.includes('đau bụng')) {
      return 'Các vấn đề về dạ dày có thể do:\n\n1. Ăn uống không đúng giờ\n2. Stress\n3. Vi khuẩn HP\n4. Loét dạ dày\n\nTôi khuyên bạn:\n- Ăn chậm, nhai kỹ\n- Tránh đồ cay nóng\n- Có thể dùng thuốc bảo vệ dạ dày\n\nBạn có muốn tôi tư vấn về thuốc điều trị dạ dày không?'
    }
    
    if (input.includes('cảm cúm') || input.includes('ho')) {
      return 'Khi bị cảm cúm, bạn nên:\n\n1. Nghỉ ngơi nhiều\n2. Uống nhiều nước ấm\n3. Dùng thuốc giảm triệu chứng\n4. Rửa tay thường xuyên\n\nTôi có thể giới thiệu một số thuốc trị cảm cúm hiệu quả. Bạn có cần tư vấn không?'
    }
    
    return 'Cảm ơn câu hỏi của bạn. Tôi là trợ lý AI chuyên về tư vấn sức khỏe và thuốc men. Tuy nhiên, tôi không thể thay thế chẩn đoán của bác sĩ. Nếu bạn có vấn đề sức khỏe nghiêm trọng, hãy đến gặp bác sĩ ngay.\n\nBạn có thể hỏi tôi về:\n- Cách sử dụng thuốc\n- Tác dụng phụ\n- Tương tác thuốc\n- Chế độ ăn uống\n- Lối sống lành mạnh'
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