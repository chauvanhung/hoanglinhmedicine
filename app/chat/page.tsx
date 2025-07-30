import ProductChat from '@/components/ProductChat'
import Header from '@/components/Header'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Trợ lý AI Tư vấn Sản phẩm
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hỏi đáp thông tin về các sản phẩm thuốc, giá cả, thành phần, công dụng và hướng dẫn sử dụng
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <ProductChat isFullPage={true} />
            </div>

            {/* Information Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Các loại câu hỏi bạn có thể hỏi:
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Thông tin giá cả</h3>
                      <p className="text-sm text-gray-600">"Paracetamol giá bao nhiêu?"</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Hàm lượng và hoạt chất</h3>
                      <p className="text-sm text-gray-600">"Vitamin C có hàm lượng bao nhiêu?"</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Công dụng và triệu chứng</h3>
                      <p className="text-sm text-gray-600">"Ibuprofen dùng cho triệu chứng gì?"</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Tác dụng phụ</h3>
                      <p className="text-sm text-gray-600">"Omeprazole có tác dụng phụ không?"</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Danh sách sản phẩm có sẵn:
                </h2>
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {[
                                { name: 'Paracetamol', price: '15,000 VNĐ', use: 'Giảm đau, hạ sốt' },
                                { name: 'Vitamin C', price: '35,000 VNĐ', use: 'Tăng sức đề kháng' },
                                { name: 'Ibuprofen', price: '25,000 VNĐ', use: 'Giảm đau, chống viêm' },
                                { name: 'Omeprazole', price: '45,000 VNĐ', use: 'Điều trị viêm loét dạ dày' },
                                { name: 'Amoxicillin', price: '55,000 VNĐ', use: 'Kháng sinh điều trị nhiễm khuẩn' },
                                { name: 'Cetirizine', price: '28,000 VNĐ', use: 'Điều trị dị ứng, mề đay' },
                                { name: 'Loratadine', price: '32,000 VNĐ', use: 'Dị ứng không gây buồn ngủ' },
                                { name: 'Diclofenac', price: '38,000 VNĐ', use: 'Giảm đau, chống viêm mạnh' },
                                { name: 'Metformin', price: '42,000 VNĐ', use: 'Điều trị đái tháo đường type 2' },
                                { name: 'Amlodipine', price: '48,000 VNĐ', use: 'Điều trị tăng huyết áp' },
                                { name: 'Simvastatin', price: '52,000 VNĐ', use: 'Hạ cholesterol máu' },
                                { name: 'Lansoprazole', price: '58,000 VNĐ', use: 'Điều trị viêm loét dạ dày' },
                                { name: 'Ciprofloxacin', price: '65,000 VNĐ', use: 'Kháng sinh tiết niệu' },
                                { name: 'Fluconazole', price: '45,000 VNĐ', use: 'Điều trị nấm Candida' },
                                { name: 'Dextromethorphan', price: '22,000 VNĐ', use: 'Giảm ho khan' },
                                { name: 'Guaifenesin', price: '18,000 VNĐ', use: 'Long đờm, giảm ho có đờm' },
                                { name: 'Pseudoephedrine', price: '25,000 VNĐ', use: 'Thông mũi, giảm nghẹt mũi' },
                                { name: 'Bisacodyl', price: '15,000 VNĐ', use: 'Thuốc nhuận tràng' },
                                { name: 'Loperamide', price: '20,000 VNĐ', use: 'Điều trị tiêu chảy' },
                                { name: 'Calcium Carbonate', price: '30,000 VNĐ', use: 'Bổ sung canxi' },
                                { name: 'Aspirin', price: '12,000 VNĐ', use: 'Giảm đau, hạ sốt, chống đông máu' },
                                { name: 'Ranitidine', price: '28,000 VNĐ', use: 'Điều trị viêm loét dạ dày' },
                                { name: 'Famotidine', price: '32,000 VNĐ', use: 'Điều trị viêm loét dạ dày' },
                                { name: 'Dimenhydrinate', price: '18,000 VNĐ', use: 'Chống say tàu xe' },
                                { name: 'Diphenhydramine', price: '15,000 VNĐ', use: 'Điều trị dị ứng, gây buồn ngủ' },
                                { name: 'Chlorpheniramine', price: '12,000 VNĐ', use: 'Điều trị dị ứng, cảm lạnh' },
                                { name: 'Phenylephrine', price: '16,000 VNĐ', use: 'Thông mũi, giảm nghẹt mũi' },
                                { name: 'Xylometazoline', price: '25,000 VNĐ', use: 'Thuốc xịt mũi thông mũi' },
                                { name: 'Salbutamol', price: '45,000 VNĐ', use: 'Thuốc xịt giãn phế quản' },
                                { name: 'Budesonide', price: '68,000 VNĐ', use: 'Thuốc xịt chống viêm phế quản' },
                                { name: 'Beclomethasone', price: '55,000 VNĐ', use: 'Thuốc xịt mũi chống viêm' },
                                { name: 'Mometasone', price: '75,000 VNĐ', use: 'Thuốc xịt mũi chống viêm mạnh' },
                                { name: 'Fluticasone', price: '62,000 VNĐ', use: 'Thuốc xịt mũi chống viêm' },
                                { name: 'Ipratropium', price: '52,000 VNĐ', use: 'Thuốc xịt giãn phế quản' },
                                { name: 'Tiotropium', price: '85,000 VNĐ', use: 'Thuốc xịt giãn phế quản tác dụng kéo dài' },
                                { name: 'Formoterol', price: '92,000 VNĐ', use: 'Thuốc xịt giãn phế quản tác dụng kéo dài' },
                                { name: 'Salmeterol', price: '88,000 VNĐ', use: 'Thuốc xịt giãn phế quản tác dụng kéo dài' },
                                { name: 'Montelukast', price: '72,000 VNĐ', use: 'Điều trị hen suyễn, viêm mũi dị ứng' },
                                { name: 'Zafirlukast', price: '78,000 VNĐ', use: 'Điều trị hen suyễn' },
                                { name: 'Theophylline', price: '35,000 VNĐ', use: 'Điều trị hen suyễn, COPD' },
                                { name: 'Losartan', price: '55,000 VNĐ', use: 'Điều trị tăng huyết áp' },
                                { name: 'Valsartan', price: '68,000 VNĐ', use: 'Điều trị tăng huyết áp, suy tim' },
                                { name: 'Enalapril', price: '42,000 VNĐ', use: 'Điều trị tăng huyết áp, suy tim' },
                                { name: 'Lisinopril', price: '38,000 VNĐ', use: 'Điều trị tăng huyết áp' },
                                { name: 'Carvedilol', price: '72,000 VNĐ', use: 'Điều trị tăng huyết áp, suy tim' },
                                { name: 'Metoprolol', price: '45,000 VNĐ', use: 'Điều trị tăng huyết áp, đau thắt ngực' },
                                { name: 'Atenolol', price: '35,000 VNĐ', use: 'Điều trị tăng huyết áp, đau thắt ngực' },
                                { name: 'Propranolol', price: '28,000 VNĐ', use: 'Điều trị tăng huyết áp, run tay' },
                                { name: 'Nifedipine', price: '32,000 VNĐ', use: 'Điều trị tăng huyết áp, đau thắt ngực' },
                                { name: 'Diltiazem', price: '48,000 VNĐ', use: 'Điều trị tăng huyết áp, đau thắt ngực' },
                                { name: 'Verapamil', price: '52,000 VNĐ', use: 'Điều trị tăng huyết áp, đau thắt ngực' },
                                { name: 'Furosemide', price: '18,000 VNĐ', use: 'Thuốc lợi tiểu, điều trị phù' },
                                { name: 'Hydrochlorothiazide', price: '15,000 VNĐ', use: 'Thuốc lợi tiểu, điều trị tăng huyết áp' },
                                { name: 'Spironolactone', price: '22,000 VNĐ', use: 'Thuốc lợi tiểu, điều trị phù' },
                                { name: 'Digoxin', price: '85,000 VNĐ', use: 'Điều trị suy tim, rối loạn nhịp tim' },
                                { name: 'Warfarin', price: '12,000 VNĐ', use: 'Thuốc chống đông máu' },
                                { name: 'Clopidogrel', price: '45,000 VNĐ', use: 'Thuốc chống kết tập tiểu cầu' },
                                { name: 'Atorvastatin', price: '68,000 VNĐ', use: 'Hạ cholesterol máu' },
                                { name: 'Rosuvastatin', price: '75,000 VNĐ', use: 'Hạ cholesterol máu' },
                                { name: 'Pravastatin', price: '58,000 VNĐ', use: 'Hạ cholesterol máu' },
                                { name: 'Glimepiride', price: '38,000 VNĐ', use: 'Điều trị đái tháo đường type 2' },
                                { name: 'Gliclazide', price: '42,000 VNĐ', use: 'Điều trị đái tháo đường type 2' },
                                { name: 'Pioglitazone', price: '65,000 VNĐ', use: 'Điều trị đái tháo đường type 2' },
                                { name: 'Sitagliptin', price: '85,000 VNĐ', use: 'Điều trị đái tháo đường type 2' },
                                { name: 'Vildagliptin', price: '78,000 VNĐ', use: 'Điều trị đái tháo đường type 2' },
                                { name: 'Dapagliflozin', price: '92,000 VNĐ', use: 'Điều trị đái tháo đường type 2' },
                                { name: 'Empagliflozin', price: '95,000 VNĐ', use: 'Điều trị đái tháo đường type 2' },
                                { name: 'Acarbose', price: '48,000 VNĐ', use: 'Điều trị đái tháo đường type 2' },
                                { name: 'Levothyroxine', price: '35,000 VNĐ', use: 'Điều trị suy giáp' },
                                { name: 'Methimazole', price: '28,000 VNĐ', use: 'Điều trị cường giáp' },
                                { name: 'Propylthiouracil', price: '32,000 VNĐ', use: 'Điều trị cường giáp' },
                                { name: 'Prednisolone', price: '18,000 VNĐ', use: 'Thuốc chống viêm, ức chế miễn dịch' },
                                { name: 'Dexamethasone', price: '15,000 VNĐ', use: 'Thuốc chống viêm, ức chế miễn dịch' },
                                { name: 'Hydrocortisone', price: '22,000 VNĐ', use: 'Thuốc chống viêm, ức chế miễn dịch' },
                                { name: 'Methylprednisolone', price: '25,000 VNĐ', use: 'Thuốc chống viêm, ức chế miễn dịch' },
                                { name: 'Azathioprine', price: '85,000 VNĐ', use: 'Thuốc ức chế miễn dịch' },
                                { name: 'Cyclosporine', price: '120,000 VNĐ', use: 'Thuốc ức chế miễn dịch' },
                                { name: 'Tacrolimus', price: '150,000 VNĐ', use: 'Thuốc ức chế miễn dịch' },
                                { name: 'Mycophenolate', price: '95,000 VNĐ', use: 'Thuốc ức chế miễn dịch' },
                                { name: 'Leflunomide', price: '88,000 VNĐ', use: 'Điều trị viêm khớp dạng thấp' },
                                { name: 'Sulfasalazine', price: '45,000 VNĐ', use: 'Điều trị viêm khớp dạng thấp' },
                                { name: 'Hydroxychloroquine', price: '35,000 VNĐ', use: 'Điều trị lupus, viêm khớp dạng thấp' },
                                { name: 'Methotrexate', price: '28,000 VNĐ', use: 'Điều trị viêm khớp dạng thấp, ung thư' },
                                { name: 'Allopurinol', price: '22,000 VNĐ', use: 'Điều trị bệnh gút' },
                                { name: 'Colchicine', price: '18,000 VNĐ', use: 'Điều trị cơn gút cấp' },
                                { name: 'Probenecid', price: '25,000 VNĐ', use: 'Điều trị bệnh gút' },
                                { name: 'Febuxostat', price: '85,000 VNĐ', use: 'Điều trị bệnh gút' },
                                { name: 'Alendronate', price: '65,000 VNĐ', use: 'Điều trị loãng xương' },
                                { name: 'Risedronate', price: '72,000 VNĐ', use: 'Điều trị loãng xương' },
                                { name: 'Ibandronate', price: '78,000 VNĐ', use: 'Điều trị loãng xương' },
                                { name: 'Zoledronic Acid', price: '120,000 VNĐ', use: 'Điều trị loãng xương' },
                                { name: 'Teriparatide', price: '250,000 VNĐ', use: 'Điều trị loãng xương nặng' },
                                { name: 'Denosumab', price: '180,000 VNĐ', use: 'Điều trị loãng xương' },
                                { name: 'Raloxifene', price: '95,000 VNĐ', use: 'Điều trị loãng xương sau mãn kinh' },
                                { name: 'Calcitonin', price: '85,000 VNĐ', use: 'Điều trị loãng xương' },
                                { name: 'Strontium Ranelate', price: '68,000 VNĐ', use: 'Điều trị loãng xương' },
                                { name: 'Vitamin D3', price: '25,000 VNĐ', use: 'Bổ sung vitamin D' },
                                { name: 'Vitamin K2', price: '45,000 VNĐ', use: 'Hỗ trợ sức khỏe xương, tim mạch' },
                                { name: 'Omega-3', price: '35,000 VNĐ', use: 'Bổ sung acid béo thiết yếu' },
                                { name: 'Coenzyme Q10', price: '55,000 VNĐ', use: 'Chống oxy hóa, hỗ trợ tim mạch' }
                              ].map((product, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-600">{product.price}</p>
                      <p className="text-xs text-gray-500">{product.use}</p>
                    </div>
                  ))}
                </div>
                                            <p className="text-xs text-gray-500 mt-3 text-center">
                              Tổng cộng 100 sản phẩm thông dụng có sẵn
                            </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 