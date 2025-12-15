import React, { useState } from "react";
import { X, CheckCircle, XCircle, AlertTriangle, Send } from "lucide-react";
import Button from "@/components/common/Button/Button";

const AdminRefundModal = ({ isOpen, onClose, onConfirm, type }) => {
  if (!isOpen) return null;

  const [note, setNote] = useState("");
  const isApprove = type === "APPROVE";

  const handleSubmit = () => {
    onConfirm(note);
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className={`p-4 border-b flex justify-between items-center ${
          isApprove ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
        }`}>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${
            isApprove ? "text-emerald-700" : "text-rose-700"
          }`}>
            {isApprove ? <CheckCircle size={20}/> : <XCircle size={20}/>}
            {isApprove ? "Xác nhận Duyệt" : "Xác nhận Từ chối"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {isApprove ? (
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-800 text-sm flex gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p>
                Trạng thái sẽ chuyển thành <strong>ĐÃ HOÀN TIỀN</strong>.
                Hãy đảm bảo bạn đã chuyển khoản thành công tới STK khách hàng cung cấp.
              </p>
            </div>
          ) : (
            <div className="bg-rose-50 p-3 rounded-lg text-rose-800 text-sm flex gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p>
                Yêu cầu sẽ bị hủy bỏ và trạng thái đơn hàng quay về <strong>ĐÃ THANH TOÁN</strong>.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ghi chú giao dịch <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              rows="3"
              placeholder={isApprove ? "Nhập mã giao dịch ngân hàng (Ref No)..." : "Nhập lý do từ chối..."}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer - ĐÃ CHỈNH SỬA: Bỏ nút Hủy, style nút chính */}
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
          <Button 
            className={`flex items-center gap-2 text-white !border-none shadow-md ${
                isApprove 
                ? "bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300" 
                : "bg-red-600 hover:bg-red-700 disabled:bg-red-300"
            }`}
            onClick={handleSubmit}
            disabled={!note.trim()} 
          >
            {isApprove ? <Send size={18} /> : <XCircle size={18} />}
            {isApprove ? "Đã chuyển tiền" : "Từ chối hoàn"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminRefundModal;