import React, { useState, useEffect } from 'react';
import { 
  Shield, Check, X, ArrowLeft, RefreshCw, Search, Calendar, CreditCard, 
  MapPin, User, AlertTriangle, AlertCircle, FileText, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { OrderRepository } from '../dal/dataAccess';
import { OrderTrackingService } from '../bll/businessLogic';

export default function AdminPanel({ setView }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    loadAllOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [orders, searchQuery, statusFilter]);

  const loadAllOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await OrderRepository.adminGetAllOrders();
      setOrders(data);
      if (activeOrder) {
        // Refresh currently active order details too
        const updatedActive = data.find(o => o.id === activeOrder.id);
        setActiveOrder(updatedActive || null);
      }
    } catch (err) {
      setError(err.message || 'Lỗi tải danh sách đơn hàng toàn hệ thống.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let result = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'cancelRequested') {
        result = result.filter(o => o.cancelRequested);
      } else {
        result = result.filter(o => o.status === Number(statusFilter));
      }
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }

    setFilteredOrders(result);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsLoading(true);
    try {
      const res = await OrderRepository.adminUpdateOrderStatus(orderId, newStatus);
      alert(res.message);
      await loadAllOrders();
    } catch (err) {
      setError(err.message || 'Cập nhật trạng thái đơn hàng thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (orderId, action) => {
    // action: 'approve' or 'reject'
    const confirmMsg = action === 'approve' 
      ? 'Bạn có chắc phê duyệt yêu cầu hủy? Đơn hàng sẽ chuyển sang trạng thái HỦY và HOÀN KHO sản phẩm.' 
      : 'Bạn có chắc từ chối yêu cầu hủy đơn hàng này?';
    if (!window.confirm(confirmMsg)) return;

    setIsLoading(true);
    try {
      const res = await OrderRepository.adminUpdateOrderStatus(orderId, null, action);
      alert(res.message);
      await loadAllOrders();
    } catch (err) {
      setError(err.message || 'Không thể xử lý yêu cầu hủy đơn hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  // Status mapping options for dropdown
  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: '1', label: '1. Đơn hàng mới' },
    { value: '2', label: '2. Đã xác nhận' },
    { value: '3', label: '3. Đang chuẩn bị hàng' },
    { value: '4', label: '4. Đang giao hàng' },
    { value: '5', label: '5. Đã giao thành công' },
    { value: '6', label: '6. Đã hủy đơn' },
    { value: 'cancelRequested', label: '⚠️ Yêu cầu hủy đơn' }
  ];

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl tracking-tight text-slate-100">
              Hệ Thống Quản Trị Đơn Hàng
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Phê duyệt yêu cầu hủy, kiểm soát trạng thái hoàn kho và cập nhật lộ trình giao vận.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={loadAllOrders}
            className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-850 text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => setView('home')}
            className="h-9 px-4 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-850 text-xs font-bold text-slate-350 hover:text-slate-105 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Control bar: Search + Status filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/30 border border-slate-900">
        <div className="sm:col-span-2 relative">
          <Search className="w-4.5 h-4.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Tìm theo Mã đơn hàng, Tên khách hàng, Số điện thoại..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-850 text-xs font-semibold text-slate-250 focus:outline-none focus:border-purple-500 placeholder:text-slate-600"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-850 text-xs font-semibold text-slate-350 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Orders list */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh sách đơn hàng ({filteredOrders.length})</h3>
          
          {isLoading && orders.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/10 border border-slate-900 rounded-2xl">Đang truy vấn đơn hàng toàn hệ thống...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/10 border border-dashed border-slate-850 rounded-2xl">
              Không tìm thấy đơn hàng nào khớp với bộ lọc.
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredOrders.map((ord) => {
                const isSelected = activeOrder?.id === ord.id;
                const statusInfo = OrderTrackingService.getStatusDetails(ord.status, ord.cancelRequested);
                return (
                  <div
                    key={ord.id}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      isSelected 
                        ? 'bg-slate-900 border-purple-500/50 shadow-lg shadow-purple-500/5' 
                        : 'bg-slate-900/40 border-slate-850 hover:bg-slate-900/80 hover:border-slate-800'
                    }`}
                  >
                    {/* Cancellation Request Flag Badge */}
                    {ord.cancelRequested && (
                      <span className="absolute -top-2 -right-2 bg-pink-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full border border-pink-500 animate-pulse shadow-md flex items-center gap-1 uppercase tracking-wider">
                        <AlertTriangle className="w-3 h-3" /> Yêu cầu hủy
                      </span>
                    )}

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-black text-slate-200 font-mono">{ord.orderId}</strong>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">Khách hàng: <strong className="text-slate-350">{ord.customerName}</strong> ({ord.customerPhone}) | {ord.date}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <strong className="text-xs font-bold text-slate-200">{ord.total.toLocaleString()}đ</strong>
                        <span className="text-[9px] text-slate-500 uppercase font-black">{ord.paymentMethod === 'MoMo' ? 'Ví MoMo' : 'COD'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-900/60 mt-1">
                      <button
                        onClick={() => setActiveOrder(ord)}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Xem chi tiết hóa đơn</span>
                      </button>

                      {/* Manual advancement controls right on the card if not canceled/delivered */}
                      {ord.status < 5 && !ord.cancelRequested && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, ord.status + 1)}
                          className="h-7 px-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:bg-purple-600 hover:border-purple-500 hover:text-white text-[10px] font-bold text-slate-400 flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <span>Duyệt bước kế</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Active Order Details & Administration actions */}
        <div className="lg:col-span-1">
          {activeOrder ? (
            <div className="rounded-2xl bg-slate-900/30 border border-slate-900 p-5 space-y-5 sticky top-4">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Hóa đơn xử lý</h3>
                <button 
                  onClick={() => setActiveOrder(null)} 
                  className="text-slate-500 hover:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Đóng
                </button>
              </div>

              {/* Order Metadata */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã đơn hàng:</span>
                  <strong className="text-slate-200 font-mono">{activeOrder.orderId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngày đặt:</span>
                  <span className="text-slate-350 font-mono">{activeOrder.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thanh toán:</span>
                  <span className="text-slate-350">{activeOrder.paymentMethod} ({activeOrder.paymentStatus === 'Paid' ? 'Đã trả' : 'Chưa trả'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tổng cộng:</span>
                  <strong className="text-purple-400">{activeOrder.total.toLocaleString()}đ</strong>
                </div>
              </div>

              {/* Recipient Credentials */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-900 space-y-1.5 text-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Giao nhận</span>
                <p className="text-slate-350 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" /> {activeOrder.customerName}</p>
                <p className="text-slate-350 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" /> {activeOrder.customerPhone}</p>
                <p className="text-slate-350 flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" /> <span className="line-clamp-2">{activeOrder.customerAddress}</span></p>
                {activeOrder.customerNote && <p className="text-slate-400 italic text-[11px]">"{activeOrder.customerNote}"</p>}
              </div>

              {/* Order Items list */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Sản phẩm đơn hàng</span>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                  {activeOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-[11px] p-2 bg-slate-900/50 rounded border border-slate-900 text-slate-300">
                      <span className="truncate max-w-[150px] font-semibold">{item.product?.name || 'Phím Custom'}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation Actions */}
              {activeOrder.cancelRequested && (
                <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/25 space-y-3">
                  <div className="flex items-start gap-2.5 text-pink-400 text-xs font-semibold">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p>Khách hàng yêu cầu hủy đơn!</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5">Đơn hàng đang ở trạng thái chuẩn bị hàng và được gửi yêu cầu duyệt hủy.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancelRequest(activeOrder.id, 'reject')}
                      className="flex-1 h-8 rounded-lg bg-slate-950 border border-slate-850 hover:bg-slate-850 text-[10px] font-bold text-slate-300 cursor-pointer"
                    >
                      Từ chối hủy
                    </button>
                    <button
                      onClick={() => handleCancelRequest(activeOrder.id, 'approve')}
                      className="flex-1 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-[10px] font-bold text-white shadow-md cursor-pointer"
                    >
                      Duyệt Hủy & Hoàn kho
                    </button>
                  </div>
                </div>
              )}

              {/* Manual status step-by-step advance control panel */}
              {activeOrder.status !== 6 ? (
                <div className="space-y-3 pt-3 border-t border-slate-900">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Chuyển trạng thái thủ công</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <button
                      onClick={() => handleUpdateStatus(activeOrder.id, 1)}
                      disabled={activeOrder.status === 1}
                      className={`h-8 rounded-lg border transition-all cursor-pointer ${
                        activeOrder.status === 1 
                          ? 'bg-purple-600 border-purple-500 text-white' 
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-400'
                      }`}
                    >
                      1. Đơn mới
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(activeOrder.id, 2)}
                      disabled={activeOrder.status === 2}
                      className={`h-8 rounded-lg border transition-all cursor-pointer ${
                        activeOrder.status === 2 
                          ? 'bg-purple-600 border-purple-500 text-white' 
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-400'
                      }`}
                    >
                      2. Xác nhận
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(activeOrder.id, 3)}
                      disabled={activeOrder.status === 3}
                      className={`h-8 rounded-lg border transition-all cursor-pointer ${
                        activeOrder.status === 3 
                          ? 'bg-purple-600 border-purple-500 text-white' 
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-400'
                      }`}
                    >
                      3. Chuẩn bị hàng
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(activeOrder.id, 4)}
                      disabled={activeOrder.status === 4}
                      className={`h-8 rounded-lg border transition-all cursor-pointer ${
                        activeOrder.status === 4 
                          ? 'bg-purple-600 border-purple-500 text-white' 
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-400'
                      }`}
                    >
                      4. Đang giao
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(activeOrder.id, 5)}
                      disabled={activeOrder.status === 5}
                      className={`h-8 rounded-lg border transition-all cursor-pointer ${
                        activeOrder.status === 5 
                          ? 'bg-purple-600 border-purple-500 text-white' 
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-850 text-slate-400'
                      }`}
                    >
                      5. Đã giao hàng
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(activeOrder.id, 6)}
                      className="h-8 rounded-lg bg-slate-950 hover:bg-red-650 border border-slate-850 hover:border-red-600 text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      6. Hủy đơn (Hoàn kho)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-slate-400 text-xs text-center">
                  Đơn hàng đã được hủy. Không thể chuyển tiếp trạng thái.
                </div>
              )}

            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-850 flex flex-col items-center justify-center p-6 text-center text-slate-500 gap-3 min-h-[250px]">
              <Shield className="w-10 h-10 text-slate-700" />
              <div>
                <h4 className="text-xs font-bold text-slate-400">Chọn đơn để quản trị</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Click vào nút chi tiết đơn hàng trong danh sách để mở hộp điều khiển.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
