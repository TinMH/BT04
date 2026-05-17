import React from 'react';
import { X, Trash2, Tag, AlertCircle, ShoppingBag, Plus, Minus, CreditCard } from 'lucide-react';

export default function CartDrawer({
  showCartModal,
  setShowCartModal,
  cart,
  setCart,
  couponInput,
  setCouponInput,
  appliedCoupon,
  setAppliedCoupon,
  couponError,
  setCouponError,
  shippingName,
  setShippingName,
  shippingPhone,
  setShippingPhone,
  shippingAddress,
  setShippingAddress,
  shippingNote,
  setShippingNote,
  checkoutError,
  setCheckoutError,
  handleApplyCoupon,
  handleRemoveCoupon,
  handleCheckout,
  bill,
  currentUser
}) {
  if (!showCartModal) return null;

  // Decrease quantity in cart
  const updateQty = (index, delta) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else if (newQty <= updated[index].product.stock) {
      updated[index].quantity = newQty;
    }
    setCart(updated);
  };

  // Remove item completely
  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop overlay */}
      <div 
        onClick={() => setShowCartModal(false)}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Drawer Body Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 text-left">
        <div className="w-screen max-w-md rounded-l-3xl bg-slate-950 border-l border-slate-900 shadow-2xl flex flex-col justify-between h-full relative">
          
          {/* Close Button Header */}
          <div className="p-5 border-b border-slate-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-display text-slate-100">
              <ShoppingBag className="w-5.5 h-5.5 text-purple-500" />
              <h2 className="text-lg font-black tracking-tight">Giỏ Hàng Của Bạn</h2>
            </div>
            <button 
              onClick={() => setShowCartModal(false)}
              className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 cursor-pointer"
              aria-label="Close Cart"
            >
              <X className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* Cart list panel (Scrollable) */}
          <div className="flex-grow overflow-y-auto p-5 space-y-6 scrollbar-thin">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2.5 py-20 text-center">
                <div className="p-3.5 rounded-full bg-slate-900 text-slate-600 border border-slate-850">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-300">Giỏ hàng trống</h3>
                <p className="text-xs text-slate-500 max-w-[200px]">Hãy tiếp tục mua sắm để thêm phím cơ custom vào giỏ!</p>
              </div>
            ) : (
              <>
                {/* ITEMS GRID */}
                <div className="space-y-3.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Danh sách sản phẩm ({cart.length})</span>
                  {cart.map((item, idx) => (
                    <div 
                      key={`${item.product.id}-${item.switchType}-${item.colorway}`}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-850 flex items-start justify-between gap-3 text-xs sm:text-sm"
                    >
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-14 h-14 rounded-lg object-cover bg-slate-950 border border-slate-850 flex-shrink-0"
                      />
                      
                      <div className="flex-grow min-w-0 text-left">
                        <h4 className="font-bold text-slate-200 truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                          {item.switchType.split(' (')[0]} | {item.colorway}
                        </p>
                        
                        {/* Interactive adjustments */}
                        <div className="flex items-center gap-2.5 mt-2">
                          <div className="flex items-center rounded-lg bg-slate-950 border border-slate-850 h-7 px-0.5">
                            <button
                              onClick={() => updateQty(idx, -1)}
                              className="p-1 hover:bg-slate-900 text-slate-400 hover:text-slate-200 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(idx, 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="p-1 hover:bg-slate-900 text-slate-400 hover:text-slate-200 disabled:opacity-40 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between h-14 flex-shrink-0">
                        <button 
                          onClick={() => removeItem(idx)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-950 cursor-pointer"
                          title="Xóa phím"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-slate-100">
                          {(item.product.price * item.quantity).toLocaleString()}đ
                        </span>
                      </div>

                    </div>
                  ))}
                </div>

                {/* COUPONS COMPONENT */}
                <div className="space-y-2.5 pt-4 border-t border-slate-900">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Mã giảm giá khuyến mãi</label>
                  
                  {appliedCoupon ? (
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/50 flex items-center justify-between text-xs text-emerald-400">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4.5 h-4.5" />
                        <span>Đã áp dụng mã: <strong>{appliedCoupon.id}</strong> (Giảm {appliedCoupon.discount}%)</span>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-emerald-500 hover:text-red-400 font-bold uppercase text-[10px] tracking-wider cursor-pointer"
                      >
                        Gỡ bỏ
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="VIPMEM, WELCOME50..."
                          value={couponInput}
                          onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                          className="flex-grow h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-purple-500 uppercase font-mono"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="px-4 h-9 rounded-lg bg-slate-900 hover:bg-purple-600 text-slate-300 hover:text-white font-bold text-xs border border-slate-800 hover:border-transparent transition-all cursor-pointer"
                        >
                          Áp dụng
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {couponError}
                        </p>
                      )}
                      
                      {/* VIP members tip */}
                      {currentUser && !appliedCoupon && (
                        <p className="text-[10px] text-purple-400 font-semibold">
                          *Bạn là Thành viên VIP! Đừng quên dùng mã <strong>VIPMEM</strong> để được giảm ngay 15% đơn hàng nhé.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* DELIVERY SHIPPING FORM */}
                <div className="space-y-3 pt-4 border-t border-slate-900">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Thông tin người nhận giao hàng</label>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="Tên người nhận *"
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        className="w-full h-9.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="Số điện thoại liên lạc *"
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        className="w-full h-9.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="Địa chỉ nhận hàng *"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full h-9.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <textarea
                        rows="2"
                        placeholder="Ghi chú thêm (Ví dụ: Giao giờ hành chính, gọi trước khi đến...)"
                        value={shippingNote}
                        onChange={(e) => setShippingNote(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Billing footer table */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-900 bg-slate-950 space-y-4">
              
              {/* Billing statistics */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-400 font-semibold">
                <div className="flex justify-between items-center">
                  <span>Tổng phụ sản phẩm:</span>
                  <span className="text-slate-200">{bill.subtotal.toLocaleString()}đ</span>
                </div>
                {bill.discount > 0 && (
                  <div className="flex justify-between items-center text-pink-500">
                    <span>Mã giảm giá ({appliedCoupon ? `${appliedCoupon.id} -${appliedCoupon.discount}%` : ''}):</span>
                    <span>-{bill.discount.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-emerald-400 text-xs">
                  <span>Phí vận chuyển giao hàng:</span>
                  <span>Miễn phí giao hàng</span>
                </div>
                
                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-sm sm:text-base font-black">
                  <span className="text-slate-100">Tổng thanh toán thực tế:</span>
                  <span className="text-purple-400">{bill.total.toLocaleString()}đ</span>
                </div>
              </div>

              {/* Checkout Error */}
              {checkoutError && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/50 flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">{checkoutError}</span>
                </div>
              )}

              {/* Submission button */}
              <button
                onClick={handleCheckout}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-750 hover:to-indigo-750 text-white font-bold text-sm tracking-wider shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-4.5 h-4.5" />
                <span>XÁC NHẬN ĐẶT HÀNG (COD Nhận Hàng Thanh Toán)</span>
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
