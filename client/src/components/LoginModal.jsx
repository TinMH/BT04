import React from 'react';
import { X, ShieldAlert, Award, UserCheck, KeyRound } from 'lucide-react';

export default function LoginModal({ 
  showLoginModal, 
  setShowLoginModal, 
  loginUsername, 
  setLoginUsername, 
  loginPassword, 
  setLoginPassword, 
  loginError, 
  setLoginError, 
  handleLogin 
}) {
  if (!showLoginModal) return null;

  // Autofill helpers for easier testing
  const autofill = (user, pass) => {
    setLoginUsername(user);
    setLoginPassword(pass);
    setLoginError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        onClick={() => setShowLoginModal(false)}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
      />
      
      {/* Modal Core Panel */}
      <div className="relative w-full max-w-md rounded-2xl glass-panel border border-slate-800 p-6 sm:p-8 space-y-6 animate-zoomIn text-left">
        
        {/* Close Button */}
        <button 
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <KeyRound className="w-5.5 h-5.5 text-purple-400" />
            Đăng Nhập Thành Viên VIP
          </h2>
          <p className="text-xs text-slate-400 font-medium">Nhập thông tin xác thực tài khoản để nhận đặc quyền giảm giá.</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tên đăng nhập</label>
            <input
              type="text"
              placeholder="member hoặc admin..."
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mật khẩu bảo mật</label>
            <input
              type="password"
              placeholder="Nhập 123456..."
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
            />
          </div>

          {/* Validation Alert */}
          {loginError && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50 flex items-start gap-2.5 text-xs text-red-400">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="font-semibold leading-normal">{loginError}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-750 hover:to-indigo-750 text-white font-bold text-sm tracking-wider transition-all duration-200 shadow-md hover:shadow-purple-500/20 cursor-pointer"
          >
            Đăng nhập hệ thống
          </button>
        </form>

        {/* Shortcuts Autofill Panels */}
        <div className="pt-4 border-t border-slate-900 space-y-3">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Shortcut Tài khoản thử nghiệm (Bấm để điền nhanh)</span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => autofill('member', '123456')}
              className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-950/40 border border-slate-850 hover:border-purple-800 text-left space-y-1 cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-purple-400 group-hover:text-purple-300">
                <Award className="w-4 h-4 fill-purple-950/20" />
                <span className="text-xs font-bold leading-none">Thành viên VIP</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">member / 123456</p>
            </button>

            <button
              onClick={() => autofill('admin', '123456')}
              className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-950/40 border border-slate-850 hover:border-purple-800 text-left space-y-1 cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-purple-400 group-hover:text-purple-300">
                <UserCheck className="w-4 h-4" />
                <span className="text-xs font-bold leading-none">Quản trị viên</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">admin / 123456</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
