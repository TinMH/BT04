import React from 'react';
import { Sparkles, ArrowRight, ShoppingBag, Flame } from 'lucide-react';

export default function Hero({ handleProductClick, handleAddToCart, products }) {
  const aeroforge = products?.find(p => p.id === 'aeroforge-pro-75') || products?.[0];

  // Parse title into gradient highlight parts
  const productName = aeroforge?.name || 'AeroForge Pro 75';
  const nameWords = productName.split(' ');
  let titleMain = '';
  let titleHighlight = '';
  if (nameWords.length > 2) {
    titleMain = nameWords.slice(0, -2).join(' ');
    titleHighlight = nameWords.slice(-2).join(' ');
  } else if (nameWords.length === 2) {
    titleMain = nameWords[0];
    titleHighlight = nameWords[1];
  } else {
    titleMain = nameWords[0] || 'AeroForge';
    titleHighlight = '';
  }

  // Parse features list into separate badges
  const badges = aeroforge?.features 
    ? aeroforge.features.split(',').map(f => f.trim()).slice(0, 4) 
    : ['Gasket Mount', 'Hotswap 5-pin', 'Vỏ Nhôm CNC', 'Kết Nối 3 Chế Độ'];

  // Parse tag / label
  const heroTag = aeroforge?.tags?.[0] 
    ? `Dòng Sản Phẩm ${aeroforge.tags[0]}` 
    : 'Dòng Sản Phẩm Bán Chạy Nhất';

  return (
    <section className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Hero text */}
      <div className="flex-1 text-left flex flex-col items-start gap-5 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/80 text-purple-300 text-xs font-bold uppercase tracking-wider animate-pulse-glow">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{heroTag}</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-slate-100">
          {titleMain} {titleHighlight && <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">{titleHighlight}</span>}
        </h1>
        <p className="text-lg text-slate-300 max-w-lg font-medium leading-relaxed">
          {aeroforge?.description || 'Đỉnh cao bàn phím cơ Custom cao cấp. Cấu trúc đệm đúc Gasket, tạ đồng nguyên chất CNC, mang đến cảm giác gõ êm đàn hồi cùng tiếng trầm ấm tối thượng.'}
        </p>
        
        {/* Features badges */}
        <div className="flex flex-wrap gap-2.5 mt-2">
          {badges.map((badge, idx) => (
            <span key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              {badge}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <button 
            onClick={() => handleProductClick(aeroforge?.id || 'aeroforge-pro-75')}
            className="px-8 h-13 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-base shadow-xl shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Trải Nghiệm Ngay</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
          </button>
          <button 
            onClick={() => aeroforge && handleAddToCart(aeroforge, 1)}
            className="px-6 h-13 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-purple-500" />
            <span>Thêm Vào Giỏ</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase Image */}
      <div className="flex-1 relative w-full flex items-center justify-center lg:justify-end">
        {/* Ambient Glow */}
        <div className="absolute w-[80%] aspect-square rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />
        
        <div 
          onClick={() => handleProductClick(aeroforge?.id || 'aeroforge-pro-75')}
          className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border-2 border-purple-500/20 hover:border-purple-500/60 shadow-[0_20px_50px_rgba(168,85,247,0.15)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.3)] hover:-translate-y-2 transition-all duration-500 animate-float cursor-pointer"
        >
          <img 
            src={aeroforge?.images?.[0] || "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80"} 
            alt={`${productName} Showcase`} 
            className="w-full h-full object-cover"
          />
          {(aeroforge?.discount !== undefined ? aeroforge.discount : 15) > 0 && (
            <div className="absolute bottom-4 left-4 py-1.5 px-3.5 rounded-xl glass-panel-heavy text-slate-200 text-xs font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              <span>Flash Sale: -{aeroforge?.discount !== undefined ? aeroforge.discount : 15}%</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
