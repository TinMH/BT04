import React from 'react';
import { Award, Truck, ShieldCheck, RefreshCw, Flame } from 'lucide-react';

export default function Promotions({ currentUser, timeLeft, setShowLoginModal }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Member Dashboard Block */}
      <div className="lg:col-span-2 rounded-2xl glass-panel border border-slate-800 p-6 flex flex-col justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-20%] w-[40%] aspect-square rounded-full bg-purple-600/5 blur-[50px] pointer-events-none" />
        
        {currentUser ? (
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Đặc quyền Thành viên VIP</h3>
                <p className="text-xs text-slate-400">Tài khoản: {currentUser.name} ({currentUser.role})</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-purple-200">Mã giảm giá độc quyền đã kích hoạt</span>
                <span className="text-xs text-slate-300 mt-0.5">Giảm 15% tất cả đơn hàng từ 2.000.000đ</span>
              </div>
              <span className="px-4 py-1.5 rounded-lg bg-purple-500 text-white font-mono font-black tracking-widest text-sm shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                VIPMEM
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-purple-400" /> Miễn phí ship đơn VIP
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Bảo hành vàng 24 tháng
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-purple-400" /> 1 Đổi 1 trong 30 ngày
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-left">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Đăng Nhập Thành Viên Nhận Ưu Đãi VIP
            </h3>
            <p className="text-sm text-slate-300">
              Đăng nhập tài khoản thành viên để được giảm ngay 15% giá trị đơn hàng, tích lũy điểm thưởng và nhận các quà tặng custom phím cơ giới hạn độc quyền!
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-5 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md hover:shadow-purple-500/25 transition-all duration-200 cursor-pointer"
              >
                Đăng nhập VIP ngay
              </button>
              <span className="text-xs text-slate-400">
                Chưa có tài khoản? Nhấn đăng nhập để xem tài khoản thử nghiệm.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Countdown Timer Block */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/80 border border-slate-800 p-6 flex flex-col justify-between gap-4 text-left relative">
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-pink-500 text-white text-[9px] font-black uppercase tracking-widest animate-pulse">
          Flash Deal
        </span>
        
        <div>
          <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-pink-500" />
            Chương trình khuyến mãi kết thúc trong
          </h4>
          
          {/* Clock display */}
          <div className="flex items-center gap-2 mt-3.5">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg font-bold text-slate-100">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-[10px] text-slate-500 font-bold mt-1">Giờ</span>
            </div>
            <span className="text-lg font-bold text-slate-500 -mt-5">:</span>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg font-bold text-slate-100">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-[10px] text-slate-500 font-bold mt-1">Phút</span>
            </div>
            <span className="text-lg font-bold text-slate-500 -mt-5">:</span>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg font-bold text-pink-500 border-pink-900/30">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <span className="text-[10px] text-slate-500 font-bold mt-1">Giây</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Bán chạy nhất hôm nay:</span>
          <span className="font-bold text-purple-400">AeroForge Pro (-15%)</span>
        </div>
      </div>

    </section>
  );
}
