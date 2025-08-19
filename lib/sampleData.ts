import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase'

export const sampleHealthArticles = [
  {
    title: "Cách phòng ngừa bệnh tiểu đường hiệu quả",
    excerpt: "Bệnh tiểu đường là một căn bệnh mãn tính nguy hiểm. Bài viết này sẽ hướng dẫn bạn các cách phòng ngừa hiệu quả.",
    content: `
      <h2>Bệnh tiểu đường là gì?</h2>
      <p>Bệnh tiểu đường là một rối loạn chuyển hóa mãn tính, đặc trưng bởi lượng đường trong máu cao do thiếu insulin hoặc cơ thể không sử dụng insulin hiệu quả.</p>
      
      <h2>Các yếu tố nguy cơ</h2>
      <ul>
        <li>Thừa cân, béo phì</li>
        <li>Lối sống ít vận động</li>
        <li>Chế độ ăn không lành mạnh</li>
        <li>Tiền sử gia đình</li>
        <li>Tuổi tác</li>
      </ul>
      
      <h2>Cách phòng ngừa</h2>
      <h3>1. Duy trì cân nặng hợp lý</h3>
      <p>Giảm cân nếu bạn thừa cân có thể giảm đáng kể nguy cơ mắc bệnh tiểu đường.</p>
      
      <h3>2. Tập thể dục thường xuyên</h3>
      <p>Hoạt động thể chất ít nhất 30 phút mỗi ngày, 5 ngày một tuần.</p>
      
      <h3>3. Chế độ ăn lành mạnh</h3>
      <p>Ăn nhiều rau xanh, trái cây, ngũ cốc nguyên hạt và protein nạc.</p>
      
      <h3>4. Hạn chế đường và tinh bột</h3>
      <p>Giảm tiêu thụ đường, đồ ngọt và tinh bột tinh chế.</p>
      
      <h3>5. Khám sức khỏe định kỳ</h3>
      <p>Kiểm tra đường huyết thường xuyên, đặc biệt nếu có yếu tố nguy cơ.</p>
    `,
    author: "Dược sĩ Hoàng Linh",
    publishedAt: "2024-01-15",
    readTime: "5 phút",
    category: "Bệnh tiểu đường",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    tags: ["tiểu đường", "phòng bệnh", "sức khỏe", "dinh dưỡng"],
    likes: 45,
    views: 1200,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Tác dụng của vitamin C đối với hệ miễn dịch",
    excerpt: "Vitamin C là một chất dinh dưỡng quan trọng giúp tăng cường hệ miễn dịch. Hãy tìm hiểu cách bổ sung vitamin C đúng cách.",
    content: `
      <h2>Vitamin C và hệ miễn dịch</h2>
      <p>Vitamin C là một chất chống oxy hóa mạnh mẽ, đóng vai trò quan trọng trong việc tăng cường hệ miễn dịch và bảo vệ cơ thể khỏi các bệnh nhiễm trùng.</p>
      
      <h2>Lợi ích của vitamin C</h2>
      <ul>
        <li>Tăng cường sản xuất bạch cầu</li>
        <li>Bảo vệ tế bào khỏi tổn thương oxy hóa</li>
        <li>Hỗ trợ chữa lành vết thương</li>
        <li>Giảm thời gian và mức độ nghiêm trọng của cảm lạnh</li>
      </ul>
      
      <h2>Nguồn thực phẩm giàu vitamin C</h2>
      <h3>Trái cây</h3>
      <ul>
        <li>Cam, quýt, bưởi</li>
        <li>Dâu tây</li>
        <li>Kiwi</li>
        <li>Xoài</li>
        <li>Dứa</li>
      </ul>
      
      <h3>Rau củ</h3>
      <ul>
        <li>Bông cải xanh</li>
        <li>Ớt chuông</li>
        <li>Cà chua</li>
        <li>Rau bina</li>
        <li>Khoai tây</li>
      </ul>
      
      <h2>Liều lượng khuyến nghị</h2>
      <p>Người lớn nên bổ sung 75-90mg vitamin C mỗi ngày. Phụ nữ mang thai và cho con bú cần nhiều hơn.</p>
      
      <h2>Lưu ý khi bổ sung</h2>
      <ul>
        <li>Không nên dùng quá 2000mg/ngày</li>
        <li>Uống vitamin C với nước</li>
        <li>Chia nhỏ liều trong ngày</li>
        <li>Tham khảo ý kiến bác sĩ nếu có bệnh lý</li>
      </ul>
    `,
    author: "Dược sĩ Hoàng Linh",
    publishedAt: "2024-01-10",
    readTime: "4 phút",
    category: "Dinh dưỡng",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop",
    tags: ["vitamin C", "miễn dịch", "dinh dưỡng", "sức khỏe"],
    likes: 67,
    views: 1800,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cách giảm stress và cải thiện giấc ngủ",
    excerpt: "Stress và mất ngủ là những vấn đề phổ biến trong cuộc sống hiện đại. Bài viết này sẽ chia sẻ các phương pháp hiệu quả.",
    content: `
      <h2>Mối liên hệ giữa stress và giấc ngủ</h2>
      <p>Stress có thể gây ra các vấn đề về giấc ngủ, và ngược lại, thiếu ngủ có thể làm tăng mức độ stress. Đây là một vòng luẩn quẩn cần được phá vỡ.</p>
      
      <h2>Nguyên nhân gây stress</h2>
      <ul>
        <li>Công việc áp lực cao</li>
        <li>Vấn đề tài chính</li>
        <li>Mối quan hệ cá nhân</li>
        <li>Sức khỏe</li>
        <li>Thay đổi cuộc sống</li>
      </ul>
      
      <h2>Phương pháp giảm stress</h2>
      <h3>1. Thở sâu và thiền</h3>
      <p>Thực hành thở sâu và thiền định 10-15 phút mỗi ngày có thể giúp giảm stress đáng kể.</p>
      
      <h3>2. Tập thể dục thường xuyên</h3>
      <p>Hoạt động thể chất giải phóng endorphin, giúp cải thiện tâm trạng và giảm stress.</p>
      
      <h3>3. Quản lý thời gian</h3>
      <p>Lập kế hoạch và ưu tiên công việc để tránh cảm giác quá tải.</p>
      
      <h3>4. Kết nối xã hội</h3>
      <p>Duy trì mối quan hệ với bạn bè và gia đình để có sự hỗ trợ tinh thần.</p>
      
      <h2>Cải thiện giấc ngủ</h2>
      <h3>1. Tạo thói quen ngủ</h3>
      <p>Đi ngủ và thức dậy vào cùng một giờ mỗi ngày, kể cả cuối tuần.</p>
      
      <h3>2. Tạo môi trường ngủ tốt</h3>
      <ul>
        <li>Phòng ngủ tối, mát mẻ và yên tĩnh</li>
        <li>Giường và gối thoải mái</li>
        <li>Tránh ánh sáng xanh từ thiết bị điện tử</li>
      </ul>
      
      <h3>3. Thư giãn trước khi ngủ</h3>
      <p>Đọc sách, nghe nhạc nhẹ hoặc tắm nước ấm để thư giãn.</p>
      
      <h3>4. Tránh caffeine và rượu</h3>
      <p>Không uống caffeine sau 2 giờ chiều và hạn chế rượu trước khi ngủ.</p>
    `,
    author: "Dược sĩ Hoàng Linh",
    publishedAt: "2024-01-05",
    readTime: "6 phút",
    category: "Sức khỏe tinh thần",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
    tags: ["stress", "giấc ngủ", "sức khỏe tinh thần", "thư giãn"],
    likes: 89,
    views: 2200,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const addSampleHealthArticles = async () => {
  try {
    for (const article of sampleHealthArticles) {
      await addDoc(collection(db, 'health-articles'), article)
    }
    return { success: true, message: 'Đã thêm 3 bài viết mẫu thành công!' }
  } catch (error) {
    console.error('Error adding sample health articles:', error)
    throw new Error('Có lỗi khi thêm bài viết mẫu')
  }
} 