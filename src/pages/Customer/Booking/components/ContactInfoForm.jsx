import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import MissingProfileModal from './MissingProfileModal';
import {userService} from '@/services/user.service'; // Import service để lấy data mới nhất

const ContactInfoForm = ({ user, onChange, initialData }) => {
    // State form data
    const [formData, setFormData] = useState({
        fullName: initialData?.contactName || "",
        phone: initialData?.contactPhone || "",
        email: initialData?.contactEmail || "",
        specialRequest: initialData?.specialRequest || ""
    });

    // State logic "Đặt cho mình"
    const [isSelfBooking, setIsSelfBooking] = useState(false);
    const [missingFields, setMissingFields] = useState([]);
    const [showMissingModal, setShowMissingModal] = useState(false);
    const [isChecking, setIsChecking] = useState(false); // State loading khi check thông tin

    // Cập nhật data lên cha mỗi khi form thay đổi
    useEffect(() => {
        onChange({ ...formData, isSelfBooking });
    }, [formData, isSelfBooking]);

    // Xử lý khi tích chọn "Đặt cho mình"
    const handleSelfBookingToggle = async (e) => {
        const checked = e.target.checked;
        
        if (checked) {
            setIsChecking(true);
            try {
                // 1. Lấy thông tin MỚI NHẤT từ Server (thay vì tin tưởng props user cũ)
                let currentUserData = user;
                
                if (user?.userId) {
                    try {
                        // Gọi API lấy profile mới nhất
                        // Giả định userService có hàm getUserProfile hoặc getMe
                        // Nếu API trả về object bọc data, cần lấy .data, nếu không thì lấy trực tiếp
                        const res = await userService.getUserProfile(user.userId); 
                        // Xử lý fallback nếu response có dạng { data: ... } hoặc trả về trực tiếp
                        currentUserData = res.data || res || user;
                        console.log("Fresh User Data Loaded:", currentUserData);
                    } catch (err) {
                        console.warn("Không thể lấy thông tin mới nhất, dùng thông tin hiện tại:", err);
                    }
                }

                // 2. Validate dựa trên dữ liệu MỚI NHẤT
                const missing = [];
                
                // Kiểm tra tên
                if (!currentUserData?.fullName || currentUserData.fullName.trim() === "") {
                    missing.push("Họ và tên");
                }
                
                // Kiểm tra số điện thoại (Ưu tiên 'phoneNumber', fallback 'phone')
                const userPhone = currentUserData?.phoneNumber || currentUserData?.phone;
                if (!userPhone || String(userPhone).trim() === "") {
                    missing.push("Số điện thoại");
                }
                
                // Kiểm tra email
                if (!currentUserData?.email || currentUserData.email.trim() === "") {
                    missing.push("Email");
                }

                if (missing.length > 0) {
                    // Thiếu -> Hiện modal & Reset checkbox
                    console.warn("Missing fields:", missing);
                    setMissingFields(missing);
                    setShowMissingModal(true);
                    setIsSelfBooking(false); // Đảm bảo checkbox tắt
                    return;
                }

                // 3. Đủ thông tin -> Auto fill
                setFormData(prev => ({
                    ...prev,
                    fullName: currentUserData.fullName,
                    phone: userPhone,
                    email: currentUserData.email
                }));
                setIsSelfBooking(true);

            } finally {
                setIsChecking(false);
            }
        } else {
            // Bỏ chọn -> Clear form (giữ lại note) & Enable input
            setFormData(prev => ({
                ...prev,
                fullName: "",
                phone: "",
                email: ""
            }));
            setIsSelfBooking(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <User size={20} className="text-blue-600" /> Thông tin liên hệ
                </h3>
                
                {/* CHECKBOX ĐẶT CHO MÌNH */}
                {user && (
                    <label className={`flex items-center gap-2 select-none group ${isChecking ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            isSelfBooking ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300 group-hover:border-blue-400"
                        }`}>
                            {isChecking ? (
                                <Loader2 size={12} className="text-blue-600 animate-spin" />
                            ) : (
                                isSelfBooking && <CheckCircle2 size={14} className="text-white" />
                            )}
                        </div>
                        
                        {/* Input Checkbox */}
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={isSelfBooking} 
                            onChange={handleSelfBookingToggle}
                            disabled={isChecking}
                        />
                        
                        <span className={`text-sm font-medium ${isSelfBooking ? "text-blue-700" : "text-slate-600"}`}>
                            {isChecking ? "Đang kiểm tra..." : "Tôi đặt cho chính mình"}
                        </span>
                    </label>
                )}
            </div>

            <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* HỌ TÊN */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                            Họ và tên <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="fullName"
                                disabled={isSelfBooking || isChecking}
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                                    isSelfBooking 
                                        ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" 
                                        : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                }`}
                                placeholder="VD: Nguyen Van A"
                            />
                        </div>
                    </div>

                    {/* SỐ ĐIỆN THOẠI */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                            Số điện thoại <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="phone"
                                disabled={isSelfBooking || isChecking}
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                                    isSelfBooking 
                                        ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" 
                                        : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                }`}
                                placeholder="VD: 0912345678"
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                            Email nhận vé <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                disabled={isSelfBooking || isChecking}
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                                    isSelfBooking 
                                        ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" 
                                        : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                }`}
                                placeholder="VD: email@example.com"
                            />
                        </div>
                        {isSelfBooking && (
                            <p className="text-xs text-blue-600 mt-1.5 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Thông tin được lấy tự động từ hồ sơ của bạn.
                            </p>
                        )}
                    </div>

                    {/* GHI CHÚ */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                            Yêu cầu đặc biệt
                        </label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 text-slate-400" size={18} />
                            <textarea
                                name="specialRequest"
                                rows="3"
                                value={formData.specialRequest}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                                placeholder="VD: Nhận phòng sớm, phòng không hút thuốc..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Cảnh báo */}
            <MissingProfileModal 
                isOpen={showMissingModal} 
                onClose={() => setShowMissingModal(false)} 
                missingFields={missingFields} 
            />
        </div>
    );
};

export default ContactInfoForm;