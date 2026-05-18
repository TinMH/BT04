import React, { useState, useEffect, useRef } from 'react';
import { ProductRepository } from '../dal/dataAccess';
import { Star, Eye, ShoppingCart, Flame, AlertCircle, RefreshCw } from 'lucide-react';

export default function CategoryLazyLoad({
  categories,
  handleProductClick,
  handleAddToCart
}) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const loaderRef = useRef(null);

  // Reset states and trigger fresh fetch when category changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(selectedCat, 1, true);
  }, [selectedCat]);

  // Infinite scroll trigger via Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading && page > 0) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchProducts(selectedCat, nextPage, false);
          return nextPage;
        });
      }
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [products, hasMore, loading, selectedCat, page]);

  const fetchProducts = async (catId, pageNum, isReset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      // We set a small limit of 4 to clearly demonstrate lazy loading scroll effects
      const res = await ProductRepository.getProductsByCategory(catId, pageNum, 4);

      setProducts((prev) => {
        const merged = isReset ? res.products : [...prev, ...res.products];
        // Ensure uniqueness by ID
        const unique = [];
        const seen = new Set();
        for (const p of merged) {
          if (!seen.has(p.id)) {
            seen.add(p.id);
            unique.push(p);
          }
        }
        return unique;
      });
      setHasMore(res.hasMore);
      setTotalCount(res.totalCount);
    } catch (error) {
      console.error("Error in lazy loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="border-b border-slate-900 pb-4">
        <h2 className="font-display font-black text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
          Danh Mục Sản Phẩm & Trải Nghiệm Lazy Loading
        </h2>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Duyệt sản phẩm mượt mà theo từng layout bàn phím cơ. Cuộn xuống để tự động tải thêm sản phẩm bằng kỹ thuật Infinite Scroll.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Categories Navigation Sidebar */}
        <div className="lg:col-span-1 bg-slate-900/30 border border-slate-900 rounded-3xl p-5 backdrop-blur-md space-y-4">
          <h3 className="text-xs text-slate-500 font-bold uppercase tracking-widest pl-2">Chọn Bố Cục (Layout)</h3>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none lg:overflow-visible">
            <button
              onClick={() => setSelectedCat('all')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap lg:whitespace-normal cursor-pointer flex justify-between items-center gap-2 ${selectedCat === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-purple-500/30'
                  : 'bg-slate-950/40 border border-slate-850/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
            >
              <span>Tất cả phím cơ</span>
              {selectedCat === 'all' && (
                <span className="px-1.5 py-0.5 rounded-md bg-purple-500 text-[10px] text-white">
                  {totalCount}
                </span>
              )}
            </button>

            {categories.filter(cat => cat.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap lg:whitespace-normal cursor-pointer flex justify-between items-center gap-2 ${selectedCat === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-purple-500/30'
                    : 'bg-slate-950/40 border border-slate-850/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
              >
                <span>{cat.name.replace('Layout ', '')}</span>
                {selectedCat === cat.id && (
                  <span className="px-1.5 py-0.5 rounded-md bg-purple-500 text-[10px] text-white">
                    {totalCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products Showcase Grid */}
        <div className="lg:col-span-3 space-y-8">
          {products.length === 0 && !loading ? (
            <div className="rounded-3xl border border-dashed border-slate-850 p-16 text-center flex flex-col items-center justify-center gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-500 border border-slate-850">
                <AlertCircle className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-300">Không tìm thấy sản phẩm nào</h3>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Rất tiếc, danh mục này hiện chưa có bàn phím cơ nào được mở bán. Vui lòng chọn một danh mục khác!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group rounded-2xl bg-slate-900/40 border border-slate-850/85 hover:border-purple-500/30 hover:bg-slate-900 transition-all duration-300 flex flex-col h-full overflow-hidden text-left relative hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(168,85,247,0.05)]"
                >
                  {/* Discount tag */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
                    {product.discount > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-pink-650 text-white text-[10px] font-black tracking-wide uppercase shadow-[0_4px_8px_rgba(219,39,119,0.3)]">
                        -{product.discount}%
                      </span>
                    )}
                    {product.tags.includes('Bán chạy nhất') && (
                      <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-black tracking-wide uppercase shadow-[0_4px_8px_rgba(147,51,234,0.3)] flex items-center gap-1">
                        <Flame className="w-3 h-3 text-pink-300" /> Hot
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
                    <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                      <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold tracking-wide transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
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
                        className="text-base font-bold text-slate-100 group-hover:text-purple-400 transition-colors duration-200 cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {product.tagline}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center text-amber-550 gap-0.5 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                          <span>{product.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-655">•</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Đã bán {product.soldCount} chiếc</span>
                        <span className="text-[10px] text-slate-655">•</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{product.viewCount || 0} lượt xem</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-900/60 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        {product.discount > 0 ? (
                          <>
                            <span className="text-xs font-semibold text-slate-500 line-through leading-none mb-0.5">
                              {product.originalPrice.toLocaleString()}đ
                            </span>
                            <span className="text-base font-black text-purple-400 leading-none">
                              {product.price.toLocaleString()}đ
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-black text-slate-200 leading-none">
                            {product.price.toLocaleString()}đ
                          </span>
                        )}
                      </div>

                      {product.stock > 0 ? (
                        <button
                          onClick={() => handleAddToCart(product, 1)}
                          className="p-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 hover:border-transparent transition-all duration-200 cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] px-2 py-1 rounded bg-slate-950 border border-slate-850 text-slate-500 font-bold uppercase">
                          Hết hàng
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Skeleton Loaders for Infinite Scroll */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-slate-900/35 border border-slate-850/80 p-5 space-y-4 animate-pulse">
                  <div className="aspect-video bg-slate-950/60 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-1/4 bg-slate-950/70 rounded"></div>
                    <div className="h-4 w-3/4 bg-slate-950/70 rounded"></div>
                    <div className="h-3 w-5/6 bg-slate-950/70 rounded"></div>
                  </div>
                  <div className="pt-3 border-t border-slate-950 flex justify-between items-center">
                    <div className="h-4 w-1/3 bg-slate-950/70 rounded"></div>
                    <div className="h-8 w-8 bg-slate-950/70 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Observer Element */}
          <div ref={loaderRef} className="h-10 flex items-center justify-center">
            {loading && (
              <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
            )}
          </div>

          {/* All products loaded message */}
          {!hasMore && products.length > 0 && (
            <div className="text-center py-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-550/10 border border-purple-550/20 text-purple-400 text-xs font-bold">
                Bạn đã xem hết tất cả sản phẩm thuộc danh mục này!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
