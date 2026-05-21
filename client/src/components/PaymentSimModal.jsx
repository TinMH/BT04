import React, { useState, useEffect } from 'react';
import { X, CreditCard, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';

export default function PaymentSimModal({ 
  isOpen, 
  onClose, 
  totalAmount, 
  onPaymentSuccess 
}) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [copiedText, setCopiedText] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate a random transfer description once when component mounts
  const [transferDesc] = useState(() => `FGE${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(300);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const qrData = `2ed0db7e-momo-payment`;
  // MoMo QR Code simulator using qrserver API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=a50064&data=${encodeURIComponent(
    `momo://transfer?phone=0987654321&amount=${totalAmount}&note=${transferDesc}`
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(transferDesc);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    // Simulate API delay for verification
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(transferDesc);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
      />

      {/* Core Payment Panel */}
      <div className="relative w-full max-w-md rounded-2xl glass-panel-heavy border border-slate-800 p-6 space-y-5 animate-zoomIn text-left max-h-[90vh] overflow-y-auto scrollbar-thin">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5.5 h-5.5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-900">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-500 flex items-center justify-center border border-pink-500/30">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-md font-black text-slate-100 tracking-tight">Thanh toán qua Ví MoMo</h2>
            <p className="text-[11px] text-slate-400">Quét mã QR dưới đây hoặc chuyển khoản thủ công</p>
          </div>
        </div>

        {/* Time countdown and amount warning */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-900">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Số tiền cần thanh toán</span>
            <span className="text-lg font-black text-pink-500">{totalAmount.toLocaleString()}đ</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Hiệu lực mã QR</span>
            <span className="text-sm font-mono font-bold text-slate-200">{timeLeft > 0 ? formattedTime : 'Hết hạn'}</span>
          </div>
        </div>

        {timeLeft === 0 && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Mã thanh toán đã hết hạn. Vui lòng đóng cửa sổ này và tiến hành thanh toán lại.</span>
          </div>
        )}

        {timeLeft > 0 && (
          <div className="space-y-4">
            {/* QR Code Graphic Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl mx-auto w-56 h-56 border-4 border-pink-600/30 shadow-[0_0_25px_rgba(165,0,100,0.15)] relative group">
              <img 
                src={qrUrl} 
                alt="MoMo QR Code" 
                className="w-48 h-48 object-contain"
              />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
            </div>

            <p className="text-[10px] text-center text-slate-400 max-w-xs mx-auto">
              Mở ứng dụng <strong>Ví MoMo</strong>, chọn chức năng <strong>"Quét mã"</strong> để quét mã QR và xác nhận giao dịch.
            </p>

            {/* Manual details option */}
            <div className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-900/60 space-y-2 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Thông tin chuyển khoản thủ công</span>
              
              <div className="flex justify-between py-1 border-b border-slate-900/50">
                <span className="text-slate-500">Số điện thoại MoMo:</span>
                <strong className="text-slate-300">0987 654 321</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900/50">
                <span className="text-slate-500">Tên người nhận:</span>
                <strong className="text-slate-300">FORGEKEYBOARDS</strong>
              </div>
              <div className="flex justify-between py-1 items-center">
                <span className="text-slate-500">Nội dung chuyển khoản:</span>
                <div className="flex items-center gap-1.5">
                  <strong className="text-pink-400 font-mono font-bold text-sm">{transferDesc}</strong>
                  <button 
                    onClick={handleCopy}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title="Sao chép nội dung"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Info advice */}
            <div className="p-3 rounded-lg bg-pink-500/5 border border-pink-500/10 flex items-start gap-2.5 text-slate-400 text-[11px] leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
              <span>Hệ thống sẽ tự động xác minh giao dịch ngay khi nhận được tiền. Nếu chuyển khoản thủ công, vui lòng nhập chính xác nội dung chuyển khoản.</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-[2] h-10 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-600/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang kiểm tra giao dịch...</span>
                  </>
                ) : (
                  <span>Xác nhận đã thanh toán</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
