import React from 'react';
import { ShoppingBag, Search, User, LogOut, ShoppingCart } from 'lucide-react';

export default function Navbar({ 
  view, 
  setView, 
  searchQuery, 
  setSearchQuery, 
  tagFilter, 
  setTagFilter, 
  resetFilters, 
  cart, 
  setShowCartModal, 
  currentUser, 
  handleLogout, 
  setShowLoginModal 
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => { setView('home'); resetFilters(); }} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform duration-300">
            <ShoppingCart className="w-5.5 h-5.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-400">
              FORGE<span className="text-purple-500">KEYBOARDS</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">Premium Typing</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 font-medium text-slate-300">
          <button 
            onClick={() => { setView('home'); resetFilters(); }} 
            className={`hover:text-purple-400 transition-colors duration-200 cursor-pointer ${view === 'home' && searchQuery === '' && tagFilter === 'all' ? 'text-purple-400 font-bold' : ''}`}
          >
            Trang Chủ
          </button>
          <button 
            onClick={() => { setView('category-lazyload'); resetFilters(); }} 
            className={`hover:text-purple-400 transition-colors duration-200 cursor-pointer ${view === 'category-lazyload' ? 'text-purple-400 font-bold' : ''}`}
          >
            Danh Mục
          </button>
          <button 
            onClick={() => { setView('home'); resetFilters(); setTagFilter('Khuyến mãi'); }} 
            className={`hover:text-purple-400 transition-colors duration-200 cursor-pointer ${tagFilter === 'Khuyến mãi' ? 'text-purple-400 font-bold' : ''}`}
          >
            Khuyến Mãi
          </button>
          <button 
            onClick={() => { setView('home'); resetFilters(); setTagFilter('Bán chạy nhất'); }} 
            className={`hover:text-purple-400 transition-colors duration-200 cursor-pointer ${tagFilter === 'Bán chạy nhất' ? 'text-purple-400 font-bold' : ''}`}
          >
            Bán Chạy
          </button>
          <button 
            onClick={() => { setView('home'); resetFilters(); setTagFilter('Mới nhất'); }} 
            className={`hover:text-purple-400 transition-colors duration-200 cursor-pointer ${tagFilter === 'Mới nhất' ? 'text-purple-400 font-bold' : ''}`}
          >
            Sản Phẩm Mới
          </button>
        </nav>

        {/* Action Tools (Search, Member & Cart) */}
        <div className="flex items-center gap-3">
          
          {/* Search Input Panel */}
          <div className="relative hidden sm:block w-56 lg:w-72">
            <input
              type="text"
              placeholder="Tìm phím cơ, switch..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (view !== 'home') setView('home');
              }}
              className="w-full h-10 pl-10 pr-4 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-300"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Shopping Cart Button */}
          <button 
            onClick={() => setShowCartModal(true)}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 text-slate-200 transition-all duration-200 cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse border border-slate-950">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* User Member login / Profile Dropdown */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-9 h-9 rounded-full bg-slate-800 border border-purple-500/50"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-100 leading-none">{currentUser.name}</span>
                <span className="text-[10px] text-purple-400 font-bold uppercase mt-0.5 tracking-wider">{currentUser.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-900/40 hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-all duration-200 ml-1 cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md hover:shadow-purple-500/25 transition-all duration-200 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
