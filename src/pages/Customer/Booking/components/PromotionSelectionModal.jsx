// src/pages/Customer/Booking/components/PromotionSelectionModal.jsx

import React, { useEffect, useState } from 'react';
import Spinner from '@/components/common/Loading/Spinner';
import promotionService from "@/services/promotion.service";
import { TicketPercent, Calendar, CheckCircle2 } from 'lucide-react';

// ====================================================================
// CẤU HÌNH & UTILS
// ====================================================================
const R2_PUBLIC_URL = "https://pub-fed047aa2ebd4dcaad827464c190ea28.r2.dev";

const getFullImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150x100?text=No+Image";

    // Backend đã trả full URL (Cloudinary / R2)
    if (path.startsWith("http")) return path;

    // Path tương đối → Cloudflare R2
    const cleanPath = path.replace(/^\/+/, "");
    return `${R2_PUBLIC_URL}/${cleanPath}`;
};


// ====================================================================
// SUB-COMPONENT: MỘT DÒNG KHUYẾN MÃI
// ====================================================================
const PromotionListItem = ({ promo, isSelected, accentColor, onSelect }) => {
    // Xác định mã hệ thống (Admin) là mã không có property
    const isSystemPromo = !promo.property;

    // Format giá trị giảm
    const discountText = promo.discountType === 'PERCENTAGE'
        ? `${promo.discountValue}%`
        : `${new Intl.NumberFormat('vi-VN').format(promo.discountValue)}₫`;

    const maxDiscountText = promo.maxDiscountAmount > 0
        ? ` (Tối đa ${new Intl.NumberFormat('vi-VN').format(promo.maxDiscountAmount)}₫)`
        : '';

    // Chọn ảnh: Mã hệ thống dùng ảnh tĩnh, Mã khách sạn dùng ảnh từ API
    const imageUrl = promo.bannerUrl
        ? getFullImageUrl(promo.bannerUrl)
        : "https://via.placeholder.com/64x48?text=Promo";


    return (
        <li
            className={`group relative cursor-pointer select-none py-3 pl-3 pr-9 transition-all border-l-4 
            ${isSelected
                ? `${isSystemPromo ? 'bg-blue-50 border-blue-500' : 'bg-purple-50 border-purple-500'}`
                : 'border-transparent hover:bg-gray-50'
            }`}
            onClick={() => onSelect(promo)}
        >
            <div className="flex items-start gap-3">
                {/* Ảnh Thumbnail */}
                <div className="w-16 h-12 flex-shrink-0 rounded border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <img
                        src={imageUrl}
                        alt={promo.code}
                        className={`w-full h-full ${isSystemPromo ? 'object-contain p-0.5' : 'object-cover'}`}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/64x48?text=Promo"; }}
                    />
                </div>

                {/* Nội dung text */}
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                        <span className={`font-bold text-sm truncate ${isSelected ? accentColor : 'text-gray-900'}`}>
                            {promo.code}
                        </span>
                    </div>

                    <p className="text-gray-600 text-xs font-medium truncate mt-0.5">
                        Giảm {discountText} {maxDiscountText}
                    </p>

                    <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={10} /> HSD: {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                    </span>
                </div>
            </div>

            {/* Icon check khi được chọn */}
            {isSelected && (
                <span className={`absolute inset-y-0 right-0 flex items-center pr-3 ${accentColor}`}>
                    <CheckCircle2 size={18} />
                </span>
            )}
        </li>
    );
};

// ====================================================================
// SUB-COMPONENT: OPTION KHÔNG DÙNG MÃ
// ====================================================================
const NoPromotionOption = ({ isSelected, accentColor, onSelect }) => (
    <li
        className={`group relative cursor-pointer select-none py-3 pl-3 pr-9 border-l-4 border-transparent hover:bg-gray-50
        ${isSelected ? 'bg-gray-50' : ''}`}
        onClick={() => onSelect(null)}
    >
        <div className="flex items-center gap-3">
            <div className="w-16 h-12 flex items-center justify-center flex-shrink-0 rounded border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                <TicketPercent size={20} />
            </div>
            <span className={`block truncate text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-500 italic'}`}>
                Không dùng mã khuyến mãi
            </span>
        </div>
        {isSelected && (
            <span className={`absolute inset-y-0 right-0 flex items-center pr-3 ${accentColor}`}>
                <CheckCircle2 size={18} />
            </span>
        )}
    </li>
);

// ====================================================================
// MAIN COMPONENT (DROPDOWN)
// ====================================================================
const PromotionSelectionDropdown = ({
                                        isOpen,
                                        onClose,
                                        onSelect,
                                        selectedId,
                                        filterType, // 'ADMIN' hoặc 'OWNER'
                                        bookingPropertyId // ID khách sạn để lọc mã chủ sở hữu
                                    }) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    const isOwnerContext = filterType === 'OWNER';
    const accentColor = isOwnerContext ? 'text-purple-600' : 'text-blue-600';
    const headerTitle = isOwnerContext ? "Ưu đãi từ Khách sạn" : "Ưu đãi từ TravelMate";

    useEffect(() => {
        if (isOpen) {
            fetchAndFilterPromotions();
        }
    }, [isOpen, filterType, bookingPropertyId]);

    const fetchAndFilterPromotions = async () => {
        setLoading(true);
        try {
            // 1. Gọi API lấy toàn bộ khuyến mãi khả dụng (đang ACTIVE và còn hạn)
            const response = await promotionService.getAllPromotions();
            const rawData = Array.isArray(response) ? response : (response.data || []);

            const now = new Date();
            // Lọc sơ bộ: Phải Active và chưa hết hạn
            let activePromotions = rawData.filter(p =>
                p.status === "ACTIVE" && new Date(p.endDate) > now
            );

            // 2. Lọc theo ngữ cảnh (QUAN TRỌNG: Lọc mã của đúng khách sạn)
            if (filterType === 'ADMIN') {
                // Admin: Mã hệ thống là mã có property = null
                activePromotions = activePromotions.filter(p => !p.property);
            } else if (filterType === 'OWNER') {
                // Owner: Mã khách sạn phải có property VÀ propertyId TRÙNG với khách sạn đang đặt
                if (bookingPropertyId) {
                    activePromotions = activePromotions.filter(p =>
                        p.property && Number(p.property.propertyId) === Number(bookingPropertyId)
                    );
                } else {
                    // Nếu không có thông tin khách sạn -> không hiển thị gì để an toàn
                    activePromotions = [];
                }
            }

            setPromotions(activePromotions);
        } catch (error) {
            console.error("PromotionSelectionDropdown: Lỗi tải dữ liệu", error);
        } finally {
            setLoading(false);
        }
    };

    // Nếu dropdown không mở thì không render gì
    if (!isOpen) return null;

    return (
        <div className="absolute z-50 mt-2 left-0 right-0 max-h-80 w-full overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/10 focus:outline-none animate-in fade-in zoom-in-95 duration-100 origin-top">

            {/* Header Sticky */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
                <h4 className={`text-sm font-bold uppercase tracking-wide ${accentColor}`}>
                    {headerTitle}
                </h4>
            </div>

            {/* Nội dung danh sách (Scrollable) */}
            <div className="overflow-y-auto max-h-64">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-8 gap-2">
                        <Spinner size="md" color={isOwnerContext ? "border-purple-600" : "border-blue-600"} />
                        <span className="text-xs text-gray-400">Đang tải ưu đãi...</span>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {/* Option Bỏ chọn */}
                        <NoPromotionOption
                            isSelected={!selectedId}
                            accentColor={accentColor}
                            onSelect={onSelect}
                        />

                        {/* Danh sách mã khuyến mãi */}
                        {promotions.length > 0 ? (
                            promotions.map((promo) => (
                                <PromotionListItem
                                    key={promo.promotionId}
                                    promo={promo}
                                    isSelected={selectedId === promo.promotionId}
                                    accentColor={accentColor}
                                    onSelect={onSelect}
                                />
                            ))
                        ) : (
                            // Empty State
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                <TicketPercent size={32} className="mb-2 opacity-50" />
                                <p className="text-sm">Chưa có mã khuyến mãi nào.</p>
                            </div>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default PromotionSelectionDropdown;