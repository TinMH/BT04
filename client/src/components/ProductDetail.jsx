import React, { useState } from 'react';
import { 
  ChevronRight, Star, ArrowLeft, ArrowRight, ShoppingCart, 
  Flame, Tag, Send, AlertCircle, Plus, Minus 
} from 'lucide-react';

// Custom Swiper Slider with Thumbnail triggers (Self-Contained inside ProductDetail)
function ProductGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();
    }
    if (touchStart - touchEnd < -50) {
      handlePrev();
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Main Image Container */}
      <div 
        className="relative w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Product view ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

        {/* Arrow Navigation */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-slate-100 hover:bg-purple-600 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
          aria-label="Previous image"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-slate-100 hover:bg-purple-600 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Counter Indicator */}
        <div className="absolute bottom-4 right-4 py-1 px-3 rounded-full text-xs font-semibold glass-panel text-slate-200 tracking-wider">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-20 aspect-video md:w-24 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                currentIndex === idx 
                  ? 'border-purple-500 scale-95 shadow-[0_0_10px_rgba(168,85,247,0.5)]' 
                  : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail({ 
  activeProduct, 
  categories, 
  setView, 
  setSelectedCategory, 
  configSwitch, 
  setConfigSwitch, 
  configColorway, 
  setConfigColorway, 
  quantity, 
  setQuantity, 
  detailTab, 
  setDetailTab, 
  commentUser, 
  setCommentUser, 
  commentRating, 
  setCommentRating, 
  commentContent, 
  setCommentContent, 
  commentError, 
  handleAddComment, 
  relatedProducts, 
  handleProductClick, 
  handleAddToCart, 
  setShowCartModal, 
  currentUser,
  resetFilters
}) {
  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500">
        <button onClick={() => { setView('home'); resetFilters(); }} className="hover:text-purple-400 transition-all cursor-pointer">Trang chủ</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
        <button 
          onClick={() => { setView('home'); resetFilters(); setSelectedCategory(activeProduct.categoryId); }} 
          className="hover:text-purple-400 transition-all cursor-pointer"
        >
          {categories.find(c => c.id === activeProduct.categoryId)?.name || 'Bàn phím cơ'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-700" />
        <span className="text-slate-300 font-bold truncate max-w-[200px] sm:max-w-none">{activeProduct.name}</span>
      </nav>

      {/* Split Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: SWIPER IMAGE GALLERY */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <ProductGallery images={activeProduct.images} />
          
          {/* Features box */}
          <div className="rounded-2xl bg-slate-900/35 border border-slate-900 p-5 mt-2">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Thông số kỹ thuật tiêu chuẩn</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                <span>Kích thước: <strong>{activeProduct.size}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                <span>Switch gốc: <strong>{activeProduct.switchType}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                <span>Kết nối: <strong>{activeProduct.connectivity}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                <span>Thương hiệu: <strong>ForgeKeyboards Custom</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: CONFIGURATOR AND ORDER DETAILS */}
        <div className="lg:col-span-5 flex flex-col gap-5 text-left">
          
          {/* Title and Ratings */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {activeProduct.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-100 leading-tight">
              {activeProduct.name}
            </h1>
            <p className="text-xs text-purple-400 font-semibold italic">{activeProduct.tagline}</p>
            
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-amber-500 gap-0.5 text-sm font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{activeProduct.rating}</span>
              </div>
              <span className="text-slate-700">•</span>
              <span className="text-xs text-slate-400 font-semibold">{activeProduct.comments?.length || 0} Nhận xét từ khách hàng</span>
              <span className="text-slate-700">•</span>
              <span className="text-xs text-slate-400 font-semibold">Đã bán {activeProduct.soldCount} chiếc</span>
            </div>
          </div>

          {/* Stock Status Badge */}
          <div className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              {activeProduct.stock > 5 ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400">Còn {activeProduct.stock} sản phẩm sẵn sàng giao</span>
                </>
              ) : activeProduct.stock > 0 ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-amber-400">Chỉ còn {activeProduct.stock} sản phẩm - Sắp cháy hàng!</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span className="text-red-400">Tạm Hết Hàng - Vui lòng đăng ký trước</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Nhà kho Việt Nam</span>
          </div>

          {/* Price layout */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950/40 border border-slate-850 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-400 font-medium">Giá sản phẩm chính thức</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-400">
                  {activeProduct.price.toLocaleString()}đ
                </span>
                {activeProduct.discount > 0 && (
                  <span className="text-sm text-slate-500 font-semibold line-through">
                    {activeProduct.originalPrice.toLocaleString()}đ
                  </span>
                )}
              </div>
            </div>
            {activeProduct.discount > 0 && (
              <span className="px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-black">
                TIẾT KIỆM {activeProduct.discount}%
              </span>
            )}
          </div>

          {/* Interactive Switch Selection Configurator */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>1. Lựa chọn Switch Cơ học</span>
              <span className="text-purple-400 normal-case">Hỗ trợ thay nóng</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Linear (Êm Ái, Trơn Tru)', desc: 'Tiếng thock ấm êm nhẹ' },
                { name: 'Tactile (Khấc Cản, Đầm Tay)', desc: 'Khấc bấm đầm chắc tay' },
                { name: 'Clicky (Vui Tai, Gõ Đanh)', desc: 'Gõ đanh lách tách vui tai' }
              ].map((sw) => (
                <button
                  key={sw.name}
                  onClick={() => { if (activeProduct.stock > 0) setConfigSwitch(sw.name); }}
                  disabled={activeProduct.stock === 0}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-16 transition-all duration-200 cursor-pointer ${
                    configSwitch === sw.name 
                      ? 'bg-purple-600/15 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]' 
                      : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-700'
                  } ${activeProduct.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <span className="text-xs font-bold truncate">{sw.name.split(' (')[0]}</span>
                  <span className="text-[9px] opacity-75">{sw.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Keycap Colorway Configurator */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>2. Phối màu Keycap</span>
              <span className="text-purple-400 normal-case">Nhựa PBT Cherry</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {['Obsidian Black', 'Vaporwave Pink', 'Chalk White'].map((color) => (
                <button
                  key={color}
                  onClick={() => { if (activeProduct.stock > 0) setConfigColorway(color); }}
                  disabled={activeProduct.stock === 0}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    configColorway === color 
                      ? 'bg-purple-600/15 border-purple-500 text-purple-300' 
                      : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-700'
                  } ${activeProduct.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity adjustments with Stock boundaries */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Số lượng mua</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 h-11 px-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={activeProduct.stock === 0 || quantity <= 1}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-100">
                  {activeProduct.stock === 0 ? 0 : quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(activeProduct.stock, q + 1))}
                  disabled={activeProduct.stock === 0 || quantity >= activeProduct.stock}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <span className="text-xs text-slate-500 font-semibold italic">
                Hạn mức tối đa: {activeProduct.stock} chiếc
              </span>
            </div>
          </div>

          {/* Primary Purchase actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              onClick={() => {
                if (activeProduct.stock > 0) {
                  handleAddToCart(activeProduct, quantity, true);
                  setShowCartModal(true);
                }
              }}
              disabled={activeProduct.stock === 0}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-750 hover:to-indigo-750 text-white font-bold text-sm shadow-md hover:shadow-purple-500/20 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:from-slate-900 disabled:to-slate-900 disabled:border-slate-850 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
            >
              <span>MUA NGAY (Giao Hỏa Tốc)</span>
            </button>
            <button
              onClick={() => handleAddToCart(activeProduct, quantity)}
              disabled={activeProduct.stock === 0}
              className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:border-slate-850 disabled:text-slate-600 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-purple-500" />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>

        </div>

      </div>

      {/* TAB SYSTEM: DESCRIPTION & REVIEWS */}
      <section className="mt-8 rounded-2xl glass-panel border border-slate-850 p-6 md:p-8 space-y-6">
        
        {/* Tab Header row */}
        <div className="flex gap-6 border-b border-slate-900 pb-3 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setDetailTab('specs')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
              detailTab === 'specs' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chi tiết sản phẩm
            {detailTab === 'specs' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-purple-500 rounded" />}
          </button>
          <button
            onClick={() => setDetailTab('reviews')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
              detailTab === 'reviews' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Nhận xét & Đánh giá ({activeProduct.comments?.length || 0})
            {detailTab === 'reviews' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-purple-500 rounded" />}
          </button>
          <button
            onClick={() => setDetailTab('description')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
              detailTab === 'description' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Giới thiệu & Tính năng
            {detailTab === 'description' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-purple-500 rounded" />}
          </button>
        </div>

        {/* Tab Content 1: specs */}
        {detailTab === 'specs' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-200">Đặc tính kỹ thuật cấu trúc của {activeProduct.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900/60 space-y-2.5">
                <p>• <strong>Kiểu gá lắp:</strong> Gasket-Mounted (Cảm giác nhún đàn hồi tốt, triệt tiêu tiếng đập kim loại).</p>
                <p>• <strong>Bố cục bàn phím:</strong> {activeProduct.size} chuyên nghiệp.</p>
                <p>• <strong>Hotswap:</strong> Mạch Hotswap 5-pin hỗ trợ thay thế nóng switch tiện lợi.</p>
                <p>• <strong>Mạch LED:</strong> LED RGB South-facing không lo cấn keycaps OEM/Cherry profile.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900/60 space-y-2.5">
                <p>• <strong>Cổng sạc / Kết nối:</strong> Hỗ trợ kết nối dây Type-C rời hoặc Bluetooth 5.1 và bộ nhận 2.4Ghz.</p>
                <p>• <strong>Keycaps:</strong> Nhựa PBT Double-shot bền bỉ, không bóng dầu khi gõ thời gian dài.</p>
                <p>• <strong>Tấm lót:</strong> Được lót sẵn các lớp tiêu âm (Foam Poron đúc, silicon tạ đáy).</p>
                <p>• <strong>Stabilizers:</strong> Cân chỉnh mượt mà, lube stab bằng mỡ cao cấp.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: long description */}
        {detailTab === 'description' && (
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-w-4xl">
            <p>{activeProduct.description}</p>
            <p>
              Dòng sản phẩm phím cơ custom cao cấp này được ra mắt nhằm tối ưu hóa tối đa hành trình gõ phím của bạn. Cho dù bạn là lập trình viên cần soạn thảo code cả ngày, nhân viên kế toán cần nhập liệu nhanh gọn hay là game thủ cần tốc độ phản hồi chuẩn xác mili-giây, thiết bị của chúng tôi sẽ đáp ứng hoàn hảo từng chạm ngón tay.
            </p>
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 text-xs text-purple-300">
              <strong>*Lời khuyên chuyên gia:</strong> Lựa chọn Switch Linear cho cảm giác gõ trơn mượt không tiếng click thích hợp văn phòng, Switch Tactile có khấc cản phản hồi lực, hoặc Switch Clicky nếu bạn ưa thích âm thanh nổ đanh vui tai kích thích tinh thần.
            </div>
          </div>
        )}

        {/* Tab Content 3: reviews panel & Dynamic Review submit Form */}
        {detailTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold text-slate-200">Đánh giá thực tế từ khách hàng</h3>
              
              {activeProduct.comments && activeProduct.comments.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
                  {activeProduct.comments.map((comm) => (
                    <div 
                      key={comm.id}
                      className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 text-xs sm:text-sm text-slate-300 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-100">{comm.user}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{comm.date}</span>
                      </div>
                      
                      {/* Star rating indicator */}
                      <div className="flex items-center text-amber-500 gap-0.5">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star 
                            key={starIdx} 
                            className={`w-3.5 h-3.5 ${starIdx < comm.rating ? 'fill-current' : 'text-slate-700'}`} 
                          />
                        ))}
                      </div>

                      <p className="text-slate-400 font-medium italic mt-1 text-left">
                        "{comm.content}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">Hiện tại chưa có nhận xét nào cho sản phẩm này. Hãy là người đầu tiên chia sẻ cảm nhận!</p>
              )}
            </div>

            {/* Add review form */}
            <div className="lg:col-span-5 rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-purple-400" />
                Gửi đánh giá của bạn
              </h4>
              
              <form onSubmit={handleAddComment} className="space-y-3.5 text-xs sm:text-sm">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Họ và Tên</label>
                  <input
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={commentUser}
                    onChange={(e) => setCommentUser(e.target.value)}
                    disabled={currentUser !== null}
                    className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-650 focus:outline-none focus:border-purple-500 disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Điểm đánh giá (1-5 Sao)</label>
                  <div className="flex items-center gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        type="button"
                        key={stars}
                        onClick={() => setCommentRating(stars)}
                        className="p-1 text-amber-500 focus:outline-none cursor-pointer"
                        title={`${stars} Sao`}
                      >
                        <Star className={`w-6 h-6 ${stars <= commentRating ? 'fill-current' : 'text-slate-800'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nội dung nhận xét</label>
                  <textarea
                    rows="3"
                    placeholder="Chia sẻ trải nghiệm gõ phím cơ thực tế của bạn..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {commentError && (
                  <p className="text-xs text-red-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {commentError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full h-9.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs tracking-wider transition-colors cursor-pointer"
                >
                  Gửi đánh giá chất lượng
                </button>
              </form>
            </div>

          </div>
        )}

      </section>

      {/* --- RELATED PRODUCTS SECTION (SẢN PHẨM TƯƠNG TỰ) --- */}
      {relatedProducts.length > 0 && (
        <section className="space-y-5 mt-4">
          <h3 className="font-display font-black text-xl text-slate-200 tracking-tight flex items-center gap-2">
            <Tag className="w-5.5 h-5.5 text-purple-500" />
            Sản Phẩm Tương Tự Layout
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => handleProductClick(p.id)}
                className="group rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-purple-500/20 hover:bg-slate-900 transition-all duration-300 p-4 flex flex-col justify-between gap-4 text-left cursor-pointer"
              >
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-950">
                  <img 
                    src={p.images[0]} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{p.size} Layout</span>
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-purple-400 transition-colors line-clamp-1">
                    {p.name}
                  </h4>
                  <div className="flex items-center justify-between gap-2 pt-1.5">
                    <span className="text-sm font-black text-purple-400">{p.price.toLocaleString()}đ</span>
                    <div className="flex items-center text-amber-500 gap-0.5 text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{p.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Back Button */}
      <div className="flex justify-start">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ bán hàng</span>
        </button>
      </div>

    </div>
  );
}
