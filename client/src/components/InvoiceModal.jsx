import React from 'react';
import { X, CheckCircle, Receipt, User, Phone, MapPin, MessageSquare, ClipboardCheck } from 'lucide-react';

export default function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
      />

      {/* Core Invoice Panel */}
      <div className="relative w-full max-w-xl rounded-2xl glass-panel-heavy border border-slate-800 p-6 sm:p-8 space-y-6 animate-zoomIn text-left max-h-[90vh] overflow-y-auto scrollbar-thin">
        
        {/* Close trigger */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Close invoice"
        >
          <X className="w-5.5 h-5.5" />
        </button>

        {/* Success header animation */}
        <div className="flex flex-col items-center text-center gap-3 pb-4 border-b border-slate-900">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <CheckCircle className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 tracking-tight">Đặt Hàng Thành Công!</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Cảm ơn bạn đã lựa chọn ForgeKeyboards. Đơn hàng của bạn đã được tiếp nhận và xử lý đóng gói hỏa tốc.</p>
          </div>
        </div>

        {/* Invoice specifications */}
        <div className="space-y-4 text-xs sm:text-sm">
          
          {/* Metadata */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 text-xs text-slate-400 pb-2.5 border-b border-slate-900/60 font-mono">
            <span className="font-bold">HÓA ĐƠN ĐƠN HÀNG: <strong className="text-purple-400 font-black">{invoice.orderId}</strong></span>
            <span>{invoice.date}</span>
          </div>

          {/* Delivery fields */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-900/30 border border-slate-900/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ClipboardCheck className="w-4 h-4 text-purple-400" />
              Thông tin nhận hàng
            </h3>
            <div className="grid grid-cols-1 gap-2 text-slate-300">
              <p className="flex items-start gap-2">
                <User className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Khách hàng người nhận: <strong>{invoice.customer.name}</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Số điện thoại liên lạc: <strong>{invoice.customer.phone}</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Địa chỉ giao nhận hàng: <strong>{invoice.customer.address}</strong></span>
              </p>
              {invoice.customer.note && (
                <p className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span>Ghi chú đơn hàng: <strong className="italic text-slate-400">"{invoice.customer.note}"</strong></span>
                </p>
              )}
            </div>
          </div>

          {/* Products purchased details */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sản phẩm đã mua</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
              {invoice.items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900/50 text-xs sm:text-sm text-slate-300"
                >
                  <div className="text-left">
                    <p className="font-bold text-slate-100">{item.product.name} <span className="text-purple-400">x{item.quantity}</span></p>
                    <p className="text-[10px] text-slate-500 font-semibold">{item.switchType.split(' (')[0]} | {item.colorway}</p>
                  </div>
                  <span className="font-bold text-slate-200">{(item.product.price * item.quantity).toLocaleString()}đ</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout final calculations math */}
          <div className="pt-4 border-t border-slate-900 space-y-2 font-semibold">
            <div className="flex justify-between items-center text-slate-400">
              <span>Tổng giá trị gốc:</span>
              <span>{invoice.subtotal.toLocaleString()}đ</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between items-center text-pink-500">
                <span>Mã giảm giá đã áp ({invoice.coupon}):</span>
                <span>-{invoice.discount.toLocaleString()}đ</span>
              </div>
            )}
            <div className="flex justify-between items-center text-emerald-400 text-xs">
              <span>Phí ship vận chuyển:</span>
              <span>0đ (Miễn phí)</span>
            </div>
            
            <div className="pt-2.5 border-t border-slate-900 flex justify-between items-center text-base sm:text-lg font-black text-slate-100">
              <span>TỔNG CỘNG THỰC THANH TOÁN:</span>
              <span className="text-purple-400">{invoice.total.toLocaleString()}đ</span>
            </div>
          </div>

        </div>

        {/* Completion Close Button */}
        <button
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm tracking-wider shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Receipt className="w-4.5 h-4.5" />
          <span>Hoàn tất giao dịch & Quay lại Trang chủ mua sắm</span>
        </button>

      </div>
    </div>
  );
}
