import React from 'react';
import { SlidersHorizontal, Search, Check } from 'lucide-react';

export default function ProductFilters({ 
  tagFilter, 
  setTagFilter, 
  sizeFilter, 
  setSizeFilter, 
  switchFilter, 
  setSwitchFilter, 
  priceFilter, 
  setPriceFilter, 
  connectivityFilter, 
  setConnectivityFilter, 
  activeFiltersCount, 
  resetFilters, 
  searchQuery, 
  setSearchQuery, 
  showMobileFilters 
}) {
  return (
    <aside className={`md:block space-y-6 ${showMobileFilters ? 'block' : 'hidden'} text-left`}>
      <div className="rounded-2xl glass-panel border border-slate-850 p-5 space-y-5">
        
        {/* Title */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-900">
          <span className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-4.5 h-4.5 text-purple-400" />
            Bộ Lọc Tìm Kiếm
          </span>
          {activeFiltersCount > 0 && (
            <button 
              onClick={resetFilters}
              className="text-[11px] text-pink-500 hover:text-pink-400 font-bold transition-all cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Inline Search for Mobile/Fallback */}
        <div className="space-y-2 block sm:hidden">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Từ khóa</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập tên phím..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Filter condition 1: Special tags */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phân loại thẻ</label>
          <div className="flex flex-col gap-1.5">
            {['Tất cả', 'Bán chạy nhất', 'Mới nhất', 'Khuyến mãi'].map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag === 'Tất cả' ? 'all' : tag)}
                className={`w-full text-left h-8 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  (tag === 'Tất cả' && tagFilter === 'all') || (tagFilter === tag)
                    ? 'bg-purple-600/15 border border-purple-500/30 text-purple-300' 
                    : 'bg-transparent border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <span>{tag}</span>
                {((tag === 'Tất cả' && tagFilter === 'all') || (tagFilter === tag)) && <Check className="w-3 h-3 text-purple-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Filter condition 2: Layout Size */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kích thước Layout</label>
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="all">Tất cả Layout</option>
            <option value="60%">Layout 60% (Siêu gọn)</option>
            <option value="65%">Layout 65% (Tối giản)</option>
            <option value="75%">Layout 75% (Tiêu chuẩn mới)</option>
            <option value="80% TKL">Layout TKL 80% (Cổ điển)</option>
            <option value="Fullsize">Layout Fullsize / 98%</option>
            <option value="Ergonomic">Layout Split / Alice</option>
          </select>
        </div>

        {/* Filter condition 3: Switch Type */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loại Switch</label>
          <div className="flex flex-col gap-1.5">
            {[
              { id: 'all', name: 'Tất cả Switch' },
              { id: 'linear', name: 'Linear (Êm ái, Trơn tru)' },
              { id: 'tactile', name: 'Tactile (Khấc cản, Đầm tay)' },
              { id: 'clicky', name: 'Clicky (Đanh tai, Vui nhộn)' }
            ].map((sw) => (
              <button
                key={sw.id}
                onClick={() => setSwitchFilter(sw.id)}
                className={`w-full text-left h-8 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  switchFilter === sw.id 
                    ? 'bg-purple-600/15 border border-purple-500/30 text-purple-300' 
                    : 'bg-transparent border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <span>{sw.name}</span>
                {switchFilter === sw.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Filter condition 4: Price Range Slider */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khoảng Giá Tối Đa</label>
            <span className="text-xs font-bold text-purple-400">{priceFilter.toLocaleString()}đ</span>
          </div>
          <input
            type="range"
            min="1500000"
            max="5000000"
            step="100000"
            value={priceFilter}
            onChange={(e) => setPriceFilter(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
            <span>1.5TR</span>
            <span>3.2TR</span>
            <span>5.0TR</span>
          </div>
        </div>

        {/* Filter condition 5: Connectivity */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kết Nối</label>
          <select
            value={connectivityFilter}
            onChange={(e) => setConnectivityFilter(e.target.value)}
            className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="all">Tất cả phương thức</option>
            <option value="wireless">Không dây (Bluetooth/2.4G)</option>
            <option value="wired">Chỉ dùng dây cắm rời</option>
          </select>
        </div>

      </div>
    </aside>
  );
}
