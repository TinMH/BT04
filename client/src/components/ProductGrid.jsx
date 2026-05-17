import React from 'react';
import { Star, Eye, ShoppingCart, Flame, AlertCircle } from 'lucide-react';

export default function ProductGrid({ 
  filteredProducts, 
  handleProductClick, 
  handleAddToCart, 
  categories,
  resetFilters
}) {
  if (filteredProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center flex flex-col items-center justify-center gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-500 border border-slate-850">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-300">Không tìm thấy sản phẩm nào</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Rất tiếc, các điều kiện tìm kiếm và lọc hiện tại không khớp với dòng phím cơ nào. Vui lòng bấm xóa bộ lọc để thử lại!
        </p>
        <button 
          onClick={resetFilters}
          className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer"
        >
          Reset Bộ Lọc
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <article 
          key={product.id}
          className="group rounded-2xl bg-slate-900/50 border border-slate-850 hover:border-purple-500/30 hover:bg-slate-900 transition-all duration-300 flex flex-col h-full overflow-hidden text-left relative hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(168,85,247,0.06)]"
        >
          
          {/* Card tags overlay (Sale / Bestseller) */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
            {product.discount > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-pink-600 text-white text-[10px] font-black tracking-wide uppercase shadow-[0_4px_8px_rgba(219,39,119,0.3)]">
                -{product.discount}%
              </span>
            )}
            {product.tags.includes('Bán chạy nhất') && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-black tracking-wide uppercase shadow-[0_4px_8px_rgba(147,51,234,0.3)] flex items-center gap-1">
                <Flame className="w-3 h-3 text-pink-300" />
                Hot
              </span>
            )}
          </div>

          {/* Image Container */}
          <div 
            onClick={() => handleProductClick(product.id)}
            className="aspect-video relative overflow-hidden bg-slate-950 cursor-pointer"
          >
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Glass hover quick view overlay */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold tracking-wide transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-purple-500/20">
                <Eye className="w-4 h-4" /> Xem chi tiết
              </span>
            </div>
          </div>

          {/* Info Body */}
          <div className="p-5 flex flex-col justify-between flex-grow gap-4">
            <div className="space-y-1.5">
              {/* Breadcrumb Tag & Layout size */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <span>{categories.find(c => c.id === product.categoryId)?.name.replace('Layout ', '') || 'Keyboard'}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{product.size}</span>
              </div>
              
              <h3 
                onClick={() => handleProductClick(product.id)}
                className="text-base font-bold text-slate-100 group-hover:text-purple-400 transition-colors duration-200 cursor-pointer"
              >
                {product.name}
              </h3>
              
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {product.tagline}
              </p>
              
              {/* Rating & Sold count */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-500 gap-0.5 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">•</span>
                <span className="text-[10px] text-slate-400 font-semibold">Đã bán {product.soldCount} chiếc</span>
              </div>
            </div>

            {/* Price and Cart Action */}
            <div className="pt-3 border-t border-slate-900/60 flex items-center justify-between gap-2">
              <div className="flex flex-col">
                {product.discount > 0 ? (
                  <>
                    <span className="text-sm font-semibold text-slate-500 line-through leading-tight">
                      {product.originalPrice.toLocaleString()}đ
                    </span>
                    <span className="text-base font-black text-purple-400">
                      {product.price.toLocaleString()}đ
                    </span>
                  </>
                ) : (
                  <span className="text-base font-black text-slate-200">
                    {product.price.toLocaleString()}đ
                  </span>
                )}
              </div>

              {product.stock > 0 ? (
                <button
                  onClick={() => handleAddToCart(product, 1)}
                  className="p-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 hover:border-transparent transition-all duration-200 cursor-pointer"
                  title="Thêm vào giỏ"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-500 font-bold uppercase">
                  Hết hàng
                </span>
              )}
            </div>

          </div>
        </article>
      ))}
    </div>
  );
}
