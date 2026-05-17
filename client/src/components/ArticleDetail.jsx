import React from 'react';
import { ArrowLeft, BookOpen, Clock, Tag, Award } from 'lucide-react';

export default function ArticleDetail({ activeArticle, setView }) {
  return (
    <article className="max-w-4xl mx-auto rounded-3xl glass-panel border border-slate-850 overflow-hidden text-left shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
      
      {/* Article Cover Photo */}
      <div className="relative w-full aspect-[21/9] bg-slate-900 overflow-hidden border-b border-slate-900">
        <img 
          src={activeArticle.image} 
          alt={activeArticle.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
        
        {/* Back Link Overlay */}
        <button 
          onClick={() => setView('home')}
          className="absolute top-6 left-6 px-4 py-2 rounded-xl glass-panel-heavy border border-slate-700/50 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-10 space-y-6">
        
        {/* Breadcrumb / Category Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            Cẩm Nang Phím Cơ
          </span>
          <span className="text-slate-800">•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            {activeArticle.readTime}
          </span>
          <span className="text-slate-800">•</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-purple-300 text-[10px]">
            {activeArticle.category}
          </span>
        </div>

        {/* Article Headline */}
        <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-slate-100 leading-tight">
          {activeArticle.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-semibold italic border-l-4 border-purple-500 pl-4 py-1">
          {activeArticle.summary}
        </p>

        {/* Detailed Paragraph Sections */}
        <div className="space-y-4 text-sm sm:text-base text-slate-400 leading-relaxed">
          <p>{activeArticle.content}</p>
          
          <h3 className="text-lg font-bold text-slate-200 pt-3 flex items-center gap-2">
            <Tag className="w-4.5 h-4.5 text-purple-400" />
            Các bước thực hiện cốt lõi
          </h3>
          <p>
            Để bắt đầu tùy biến và cá nhân hóa chiếc bàn phím cơ của mình, bạn cần chuẩn bị đầy đủ bộ công cụ cơ bản bao gồm switch puller, keycap puller, dầu mỡ lube chuyên dụng (Krytox 205g0) và cọ quét. Quá trình đòi hỏi sự tỉ mỉ, kiên nhẫn từng nút bấm một để đạt được kết quả đồng đều nhất.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 space-y-2">
              <h4 className="font-bold text-slate-200 text-sm">Giai đoạn 1: Chuẩn bị vỏ</h4>
              <p className="text-xs">Rã rời các phím, tháo rời vỏ nhựa/nhôm CNC, vệ sinh sạch bụi bẩn và lót foam đáy (PE foam hoặc cao su lưu hóa) để giảm vang.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-850 space-y-2">
              <h4 className="font-bold text-slate-200 text-sm">Giai đoạn 2: Cân chỉnh Stabilizer</h4>
              <p className="text-xs">Gắn băng dính (Holee Mod) vào chân thanh cân bằng, quét mỡ bôi trơn dày hơn ở phần thanh thép nằm ngang giúp triệt tiếng lọc xọc.</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-200 pt-2 flex items-center gap-2">
            <Award className="w-4.5 h-4.5 text-purple-400" />
            Nhận định & Đánh giá từ cộng đồng Custom
          </h3>
          <p>
            Một chiếc bàn phím custom hoàn chỉnh không chỉ là một công cụ gõ văn bản thông thường, nó đại diện cho phong cách cá nhân, khi chất âm thock trầm ấm vang lên sẽ khơi dậy sự tập trung cao độ và cảm giác thư giãn cho não bộ. Hãy tự tay chế tác chiếc phím cơ của riêng mình ngay hôm nay cùng **ForgeKeyboards**!
          </p>
        </div>

        {/* Divider and back footer */}
        <div className="pt-6 border-t border-slate-900/80 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-semibold">Tác giả: Chuyên gia ForgeKeyboards</span>
          <button 
            onClick={() => setView('home')}
            className="text-purple-400 hover:text-purple-300 font-bold transition-all cursor-pointer"
          >
            Quay lại danh mục cẩm nang
          </button>
        </div>

      </div>
    </article>
  );
}
