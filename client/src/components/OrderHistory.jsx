import React, { useState, useEffect } from 'react';
import { 
  Search, Package, Clock, XCircle, CheckCircle2, Truck, ArrowLeft, 
  Info, Calendar, CreditCard, User, Phone, MapPin, ClipboardList, AlertTriangle 
} from 'lucide-react';
import { OrderRepository } from '../dal/dataAccess';
import { OrderTrackingService } from '../bll/businessLogic';

export default function OrderHistory({ currentUser, setView }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Guest search form inputs
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  
  // Real-time ticking state to refresh cancellation countdowns
  const [tick, setTick] = useState(0);

  // Load member orders on mount if logged in
  useEffect(() => {
    if (currentUser) {
      loadMemberOrders();
    }
  }, [currentUser]);

  // Timer to trigger re-calculation of countdowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadMemberOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await OrderRepository.getUserOrders(currentUser.username);
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Lỗi tải danh sách đơn hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSearch = async (e) => {
    e.preventDefault();
    if (!searchOrderId.trim() || !searchPhone.trim()) {
      setError('Vui lòng nhập đầy đủ Mã đơn hàng và Số điện thoại.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSelectedOrder(null);
    try {
      const order = await OrderRepository.trackOrder(searchOrderId.trim(), searchPhone.trim());
      setSelectedOrder(order);
    } catch (err) {
      setError(err.message || 'Không tìm thấy đơn hàng phù hợp.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await OrderRepository.cancelOrder(orderId);
      alert(res.message);
      
      // Update local state
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(res.order);
      }
      if (currentUser) {
        loadMemberOrders();
      }
    } catch (err) {
      setError(err.message || 'Hủy đơn hàng thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Timeline render helpers
  const stages = [
    { key: 1, label: 'Đơn hàng mới', icon: Info },
    { key: 2, label: 'Đã xác nhận', icon: CheckCircle2 },
    { key: 3, label: 'Chuẩn bị hàng', icon: ClipboardList },
    { key: 4, label: 'Đang giao hàng', icon: Truck },
    { key: 5, label: 'Đã giao thành công', icon: Package }
  ];

  // Helper to check if a stage should show as completed, active, or pending
  const getStageStatus = (order, stageKey) => {
    if (order.status === 6) return 'canceled';
    if (order.status >= stageKey) {
      return order.status === stageKey ? 'active' : 'completed';
    }
    return 'pending';
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <h2 className="font-display font-black text-2xl tracking-tight text-slate-100">
            Theo Dõi Đơn Hàng
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Tra cứu lịch sử mua hàng, trạng thái vận chuyển và thời hạn hủy đơn.
          </p>
        </div>
        <button
          onClick={() => setView('home')}
          className="h-9 px-4 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-850 text-xs font-bold text-slate-300 hover:text-slate-100 flex items-center justify-center gap-1.5 transition-all cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Guest order search panel (shown if not logged in, or alongside member list) */}
      {!currentUser ? (
        <div className="rounded-2xl bg-slate-900/30 border border-slate-900 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Tra cứu đơn hàng (Không đăng nhập)</h3>
          <form onSubmit={handleGuestSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Mã đơn hàng</label>
              <input 
                type="text" 
                placeholder="VD: FGE-123456" 
                value={searchOrderId}
                onChange={e => setSearchOrderId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-850 text-xs font-semibold text-slate-100 focus:outline-none focus:border-purple-500 font-mono placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Số điện thoại đặt hàng</label>
              <input 
                type="text" 
                placeholder="VD: 0987654321" 
                value={searchPhone}
                onChange={e => setSearchPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-850 text-xs font-semibold text-slate-100 focus:outline-none focus:border-purple-500 placeholder:text-slate-600"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-lg shadow-purple-500/10 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Đang tìm...' : 'Tra cứu đơn hàng'}</span>
            </button>
          </form>
        </div>
      ) : null}

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Orders list (For Members) */}
        {currentUser && (
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lịch sử đơn hàng của bạn</h3>
              <button 
                onClick={loadMemberOrders} 
                className="text-[10px] text-purple-400 hover:underline font-bold cursor-pointer"
              >
                Làm mới
              </button>
            </div>
            
            {isLoading && orders.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">Đang tải danh sách đơn hàng...</div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center rounded-2xl border border-dashed border-slate-850 text-slate-500 text-xs">
                Bạn chưa có đơn hàng nào.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {orders.map((ord) => {
                  const statusInfo = OrderTrackingService.getStatusDetails(ord.status, ord.cancelRequested);
                  return (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer block ${
                        selectedOrder?.id === ord.id 
                          ? 'bg-slate-900 border-purple-500/50 shadow-lg shadow-purple-500/5' 
                          : 'bg-slate-900/40 border-slate-850 hover:bg-slate-900 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2 font-mono">
                        <span className="text-xs font-black text-slate-200">{ord.orderId}</span>
                        <span className="text-[10px] text-slate-500">{ord.date.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs font-bold text-purple-400">{ord.total.toLocaleString()}đ</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Selected Order Detailed View */}
        <div className={currentUser ? 'md:col-span-2' : 'md:col-span-3'}>
          {selectedOrder ? (
            <div className="rounded-2xl bg-slate-900/30 border border-slate-900 p-6 space-y-6">
              
              {/* Order Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-900">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono uppercase">Mã đơn hàng</span>
                    <h3 className="text-lg font-black text-slate-100 font-mono tracking-tight">{selectedOrder.orderId}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Ngày tạo: {selectedOrder.date}
                  </p>
                </div>
                
                {/* Active Status Badge */}
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Trạng thái</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-black border ${
                    OrderTrackingService.getStatusDetails(selectedOrder.status, selectedOrder.cancelRequested).color
                  }`}>
                    {OrderTrackingService.getStatusDetails(selectedOrder.status, selectedOrder.cancelRequested).text}
                  </span>
                </div>
              </div>

              {/* Progress Timeline Graphic */}
              {selectedOrder.status !== 6 ? (
                <div className="py-4 border-b border-slate-900">
                  <div className="relative flex justify-between items-center w-full">
                    {/* Background Progress bar line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-slate-800 top-1/2 -translate-y-1/2 -z-10" />
                    
                    {/* Active/completed indicator line overlay */}
                    <div 
                      className="absolute left-0 h-0.5 bg-purple-600 top-1/2 -translate-y-1/2 -z-10 transition-all duration-500"
                      style={{
                        width: `${Math.max(0, (selectedOrder.status - 1) / 4) * 100}%`
                      }}
                    />

                    {stages.map((stg) => {
                      const status = getStageStatus(selectedOrder, stg.key);
                      const Icon = stg.icon;

                      return (
                        <div key={stg.key} className="flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                            status === 'completed' 
                              ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10'
                              : status === 'active'
                              ? 'bg-slate-950 border-purple-500 text-purple-400 ring-4 ring-purple-600/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                              : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-bold text-center hidden sm:inline whitespace-nowrap ${
                            status === 'active' ? 'text-slate-100' : 'text-slate-500'
                          }`}>
                            {stg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 flex items-center gap-3">
                  <XCircle className="w-7 h-7 text-red-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-red-400">Đơn hàng này đã bị hủy bỏ</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Sản phẩm trong đơn hàng này đã được hoàn về tồn kho hệ thống.</p>
                  </div>
                </div>
              )}

              {/* Delivery & Billing details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Shipping credentials */}
                <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/80 space-y-2 text-xs">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    Thông tin giao nhận hàng
                  </h4>
                  <p className="text-slate-350"><span className="text-slate-500">Người nhận:</span> <strong className="text-slate-200">{selectedOrder.customerName}</strong></p>
                  <p className="text-slate-350"><span className="text-slate-500">Số điện thoại:</span> <strong className="text-slate-200 font-mono">{selectedOrder.customerPhone}</strong></p>
                  <p className="text-slate-350"><span className="text-slate-500">Địa chỉ giao:</span> <strong className="text-slate-200">{selectedOrder.customerAddress}</strong></p>
                  {selectedOrder.customerNote && (
                    <p className="text-slate-350"><span className="text-slate-500">Ghi chú:</span> <strong className="text-slate-400 italic">"{selectedOrder.customerNote}"</strong></p>
                  )}
                </div>

                {/* Billing details */}
                <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/80 space-y-2 text-xs">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                    Phương thức thanh toán
                  </h4>
                  <p className="text-slate-350">
                    <span className="text-slate-500">Hình thức:</span>{' '}
                    <strong className="text-slate-200">
                      {selectedOrder.paymentMethod === 'MoMo' ? 'Ví điện tử MoMo' : 'Thanh toán COD'}
                    </strong>
                  </p>
                  <p className="text-slate-350">
                    <span className="text-slate-500">Trạng thái:</span>{' '}
                    <strong className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      selectedOrder.paymentStatus === 'Paid' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {selectedOrder.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </strong>
                  </p>
                  <div className="pt-2 border-t border-slate-900/60 mt-2 space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Tạm tính:</span>
                      <span>{selectedOrder.subtotal.toLocaleString()}đ</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-pink-500">
                        <span>Giảm giá ({selectedOrder.coupon}):</span>
                        <span>-{selectedOrder.discount.toLocaleString()}đ</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-purple-400 pt-1 text-sm">
                      <span>Thực thanh toán:</span>
                      <span>{selectedOrder.total.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Order Items list */}
              <div className="space-y-2">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Chi tiết sản phẩm</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-950 flex items-center justify-center border border-slate-800 text-[10px] text-slate-600 font-mono">
                          KB
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-200">{item.product?.name || 'Sản phẩm cơ custom'}</h5>
                          <p className="text-[9px] text-slate-500 font-semibold">{item.switchType.split(' (')[0]} | {item.colorway}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="text-slate-400 text-[10px] mr-2">x{item.quantity}</span>
                        <strong className="text-slate-200">{( (item.product?.price || 0) * item.quantity).toLocaleString()}đ</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation policy panel & action button */}
              {(() => {
                const cancelStatus = OrderTrackingService.getCancellationStatus(selectedOrder);
                const hasTimer = cancelStatus.timeLeftText && !cancelStatus.timeLeftText.includes('Đơn hàng') && !cancelStatus.timeLeftText.includes('Đã quá');
                
                return (
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-purple-400" />
                        Chính sách hủy đơn hàng
                      </h4>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed max-w-lg">
                        Mọi đơn hàng được phép <strong>tự hủy trực tiếp</strong> trong vòng 30 phút sau khi đặt hàng (nếu đang ở trạng thái Đơn mới hoặc Đã xác nhận). Ở bước chuẩn bị hàng, quý khách sẽ gửi <strong>yêu cầu hủy đơn</strong> cho shop duyệt. Sau 30 phút, đơn hàng sẽ được khóa để vận chuyển.
                      </p>
                      {cancelStatus.timeLeftText && (
                        <p className={`text-xs font-mono font-bold mt-1.5 ${
                          cancelStatus.canCancelDirect || cancelStatus.canRequestCancel ? 'text-pink-400' : 'text-slate-500'
                        }`}>
                          {cancelStatus.timeLeftText}
                        </p>
                      )}
                    </div>

                    {(cancelStatus.canCancelDirect || cancelStatus.canRequestCancel) && (
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        className={`h-10 px-5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex-shrink-0 flex items-center justify-center gap-1.5 ${
                          cancelStatus.canCancelDirect 
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/10' 
                            : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/10'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{cancelStatus.canCancelDirect ? 'Hủy đơn hàng ngay' : 'Gửi yêu cầu hủy đơn'}</span>
                      </button>
                    )}
                  </div>
                );
              })()}

            </div>
          ) : (
            <div className="h-full min-h-[300px] rounded-2xl border border-dashed border-slate-850 flex flex-col items-center justify-center p-6 text-center text-slate-500 gap-3">
              <Package className="w-12 h-12 text-slate-650" />
              <div>
                <h4 className="text-sm font-bold text-slate-400">Chưa chọn đơn hàng cần xem</h4>
                <p className="text-xs text-slate-500 mt-0.5">Vui lòng click vào đơn hàng trong danh sách lịch sử hoặc điền thông tin để tra cứu.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
