import React, { useState, useEffect } from 'react';
import { ProductRepository } from '../dal/dataAccess';
import { Star, Eye, ShoppingCart, Flame, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export default function TopProductsHorizontal({ 
  handleProductClick, 
  handleAddToCart, 
  categories 
}) {
  const [activeTab, setActiveTab] = useState('selling'); // 'selling' or 'viewed'
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  const limit = 4; // Display 4 products per page horizontally

  useEffect(() => {
    setPage(1);
    fetchTopProducts(activeTab, 1);
  }, [activeTab]);

  const fetchTopProducts = async (type, pageNum) => {
    setLoading(true);
    try {
      let res;
      if (type === 'selling') {
        res = await ProductRepository.getTopSellingProducts(pageNum, limit);
      } else {
        res = await ProductRepository.getMostViewedProducts(pageNum, limit);
      }
      setProducts(res.products);
      setTotalCount(res.totalCount);
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchTopProducts(activeTab, prevPage);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTopProducts(activeTab, nextPage);
    }
  };

  const handlePageSelect = (selectedPage) => {
    setPage(selectedPage);
    fetchTopProducts(activeTab, selectedPage);
  };

  return (
    <section className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6 text-left relative overflow-hidden backdrop-blur-md">
      {/* Decorative colored glow spheres */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-650/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-900">
        <div className="space-y-1">
          <h2 className="font-display font-black text-2xl tracking-tight text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            Bảng Xếp Hạng Siêu Phẩm
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Khám phá 10 bàn phím cơ bán chạy nhất hoặc được quan tâm xem nhiều nhất từ cộng đồng custom.
          </p>
        </div>

        {/* Tab Buttons switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-850 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('selling')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'selling'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" /> Bán chạy nhất
          </button>
          <button
            onClick={() => setActiveTab('viewed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'viewed'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" /> Xem nhiều nhất
          </button>
        </div>
      </div>

      {/* Horizontal Carousel View Grid */}
      <div className="relative min-h-[340px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-900/35 border border-slate-850/80 p-5 space-y-4">
                <div className="aspect-video bg-slate-950/60 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-3 w-1/4 bg-slate-950/70 rounded"></div>
                  <div className="h-4 w-3/4 bg-slate-950/70 rounded"></div>
                </div>
                <div className="pt-3 border-t border-slate-950 flex justify-between items-center">
                  <div className="h-4 w-1/3 bg-slate-950/70 rounded"></div>
                  <div className="h-8 w-8 bg-slate-950/70 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ease-in-out transform">
            {products.map((product, idx) => {
              // Calculate global rank in the Top 10 list
              const globalRank = (page - 1) * limit + idx + 1;
              return (
                <article 
                  key={product.id}
                  className="group rounded-2xl bg-slate-900/35 border border-slate-850/70 hover:border-purple-500/25 hover:bg-slate-900/80 transition-all duration-300 flex flex-col h-full overflow-hidden text-left relative hover:-translate-y-1"
                >
                  {/* Rank tag */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide shadow-md flex items-center gap-1 ${
                      globalRank === 1 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white' 
                        : globalRank === 2 
                        ? 'bg-gradient-to-r from-slate-350 to-slate-450 text-white' 
                        : globalRank === 3 
                        ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-white'
                        : 'bg-slate-800 text-slate-350'
                    }`}>
                      TOP {globalRank}
                    </span>
                  </div>

                  {/* Image container */}
                  <div 
                    onClick={() => handleProductClick(product.id)}
                    className="aspect-video relative overflow-hidden bg-slate-950 cursor-pointer"
                  >
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                      <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-650 text-white text-xs font-bold tracking-wide transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                        <Eye className="w-4 h-4" /> Xem chi tiết
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>{categories.find(c => c.id === product.categoryId)?.name.replace('Layout ', '') || 'Keyboard'}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-850 text-slate-300">{product.size}</span>
                      </div>
                      
                      <h3 
                        onClick={() => handleProductClick(product.id)}
                        className="text-sm font-bold text-slate-200 group-hover:text-purple-400 transition-colors duration-200 cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center text-amber-500 gap-0.5 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-600">•</span>
                        {activeTab === 'selling' ? (
                          <span className="text-[10px] text-slate-400 font-semibold">Đã bán {product.soldCount} chiếc</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">{product.viewCount || 0} lượt xem</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900/60 flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-purple-400 leading-none">
                        {product.price.toLocaleString()}đ
                      </span>

                      {product.stock > 0 ? (
                        <button
                          onClick={() => handleAddToCart(product, 1)}
                          className="p-2 rounded-xl bg-purple-650/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 hover:border-transparent transition-all duration-200 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[9px] px-2 py-1 rounded bg-slate-950 border border-slate-850 text-slate-550 font-bold uppercase">
                          Hết hàng
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Horizontal Pagination Controls (API-driven) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-900">
          <span className="text-xs text-slate-550 font-bold uppercase tracking-wider">
            Trang {page} / {totalPages} ({totalCount} sản phẩm)
          </span>

          <div className="flex items-center gap-3">
            {/* Prev Button */}
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`p-2 rounded-xl border border-slate-850 transition-all cursor-pointer ${
                page === 1
                  ? 'opacity-40 cursor-not-allowed bg-transparent text-slate-600'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-350 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots navigation */}
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageSelect(pageNum)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      page === pageNum
                        ? 'bg-purple-600 w-6 shadow-[0_0_10px_rgba(147,51,234,0.5)]'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    aria-label={`Trang ${pageNum}`}
                  />
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`p-2 rounded-xl border border-slate-850 transition-all cursor-pointer ${
                page === totalPages
                  ? 'opacity-40 cursor-not-allowed bg-transparent text-slate-600'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-350 hover:text-white'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
