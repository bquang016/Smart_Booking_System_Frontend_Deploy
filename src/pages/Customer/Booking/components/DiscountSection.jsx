// src/pages/Customer/Booking/components/DiscountSection.jsx

import React, { useState, useRef, useEffect } from 'react';
import Card from '@/components/common/Card/Card';
import { Tag, TicketPercent, X, ShieldCheck, Store, ChevronDown } from 'lucide-react';
import PromotionSelectionDropdown from './PromotionSelectionModal'; // Import Dropdown Component

// Đường dẫn Public Path
const TRAVEL_MATE_LOGO_PUBLIC_PATH = "/assets/logo_promption/1.jpg";

// ====================================================================
// CON COMPONENT 1: NÚT GỠ BỎ MÃ
// ====================================================================
const PromoSlotRemoveButton = ({ onRemove }) => (
    <button
        onClick={(e) => {
            e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
            onRemove();
        }}
        className="p-1.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors shrink-0"
        title="Gỡ bỏ"
    >
        <X size={16} />
    </button>
);

// ====================================================================
// CON COMPONENT 2: HIỂN THỊ MÃ ĐÃ CHỌN HOẶC TRẠNG THÁI CHƯA CHỌN
// ====================================================================
const PromoSlotDisplay = ({ promo, icon: Icon, colorClass, emptyText, onClick, isDropdownOpen, isAdminPromo, logoUrl }) => {
    const ICON_SIZE_CLASS = "w-12 h-12"; // Điều chỉnh kích thước icon cho cân đối

    // 1. TRƯỜNG HỢP: ĐÃ CÓ MÃ
    if (promo) {
        const DisplayIcon = (
            <div className={`${ICON_SIZE_CLASS} rounded-full ${colorClass} bg-opacity-20 flex items-center justify-center shrink-0`}>
                {isAdminPromo ? (
                    <ShieldCheck size={24} className={colorClass.replace('bg-', 'text-')} />
                ) : (
                    <Store size={24} className={colorClass.replace('bg-', 'text-')} />
                )}
            </div>
        );


        return (
            <div className={`border bg-opacity-5 rounded-xl p-3 flex items-center justify-between ${colorClass.replace('bg-', 'border-').replace('text-', 'border-')} bg-white shadow-sm`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    {DisplayIcon}
                    <div className="min-w-0">
                        <p className={`text-sm font-bold ${colorClass.replace('bg-', 'text-')}`}>
                            {promo.code}
                        </p>
                        {/* Hiển thị số tiền giảm nếu có, hoặc description */}
                        <p className="text-xs text-gray-500 truncate">
                            {promo.description || "Đã áp dụng mã ưu đãi"}
                        </p>
                    </div>
                    
                    
                </div>
                {/* Nút xóa sẽ được render ở component cha */}
            </div>
        );
    }

    // 2. TRƯỜNG HỢP: CHƯA CÓ MÃ (Nút mở Dropdown)
    return (
        <div
            className={`relative border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                isDropdownOpen
                    ? `${colorClass.replace('bg-', 'border-').replace('text-', 'border-')} ring-1 ring-offset-0 ${colorClass.replace('bg-', 'ring-').replace('text-', 'ring-')}`
                    : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={`${ICON_SIZE_CLASS} rounded-full ${colorClass} bg-opacity-10 flex items-center justify-center shrink-0`}>
                    <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-600">{emptyText}</p>
                    <p className="text-xs text-gray-400">Bấm để chọn mã giảm giá</p>
                </div>
            </div>

            <div className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-gray-600' : ''}`}>
                <ChevronDown size={18} />
            </div>
        </div>
    );
};

// ====================================================================
// CON COMPONENT 3: SLOT KHUYẾN MÃI (Wrapper logic)
// ====================================================================
const PromoSlotContainer = ({
                                title, icon, colorClass, emptyText,
                                promo, // Object chứa {code, description}
                                onSelect, onRemove,
                                filterType, bookingPropertyId, logoUrl
                            }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isAdminPromo = filterType === 'ADMIN';

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectPromo = (selectedPromo) => {
        onSelect(selectedPromo);
        setIsOpen(false);
    };

    return (
        <div className="mb-5 last:mb-0" ref={dropdownRef}>
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider pl-1">{title}</p>

            <div className="relative">
                <PromoSlotDisplay
                    promo={promo}
                    icon={icon}
                    colorClass={colorClass}
                    emptyText={emptyText}
                    isDropdownOpen={isOpen}
                    isAdminPromo={isAdminPromo}
                    logoUrl={logoUrl}
                    onClick={() => {
                        // Chỉ mở dropdown nếu chưa có mã nào được chọn
                        if (!promo) setIsOpen(!isOpen);
                    }}
                />

                {/* Nút xóa nằm đè lên Slot hiển thị khi đã chọn */}
                {promo && (
                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        <PromoSlotRemoveButton onRemove={onRemove} />
                    </div>
                )}

                {/* Dropdown Content - Chỉ hiện khi chưa chọn mã và đang mở */}
                {!promo && (
                    <PromotionSelectionDropdown
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onSelect={handleSelectPromo}
                        // selectedId={promo?.promotionId} // Không cần thiết vì đang null
                        filterType={filterType}
                        bookingPropertyId={bookingPropertyId}
                    />
                )}
            </div>
        </div>
    );
};

// ====================================================================
// MAIN COMPONENT: DiscountSection
// ====================================================================
const DiscountSection = ({
                             onApplyAdmin,
                             onApplyOwner,
                             bookingPropertyId,
                             // [UPDATE] Nhận props từ PaymentPage để hiển thị
                             selectedAdminCode,
                             selectedOwnerCode,
                             adminDiscount,
                             ownerDiscount
                         }) => {

    // [LOGIC MỚI] Tạo object hiển thị từ props thay vì dùng State nội bộ
    // Vì PaymentPage chỉ trả về 'code' và 'amount', ta tự tạo description
    const adminPromoDisplay = selectedAdminCode ? {
        code: selectedAdminCode,
        description: `Đã giảm ${new Intl.NumberFormat('vi-VN').format(adminDiscount)}₫`
    } : null;

    const ownerPromoDisplay = selectedOwnerCode ? {
        code: selectedOwnerCode,
        description: `Đã giảm ${new Intl.NumberFormat('vi-VN').format(ownerDiscount)}₫`
    } : null;

    return (
        <Card className="p-5 border border-gray-200 shadow-sm rounded-xl bg-white">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <div className="bg-blue-100 p-1.5 rounded-md">
                    <Tag size={18} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Mã ưu đãi & Khuyến mãi</h3>
            </div>

            {/* Slot 1: Admin Promo */}
            <PromoSlotContainer
                title="TravelMate Voucher"
                icon={ShieldCheck}
                colorClass="text-blue-600 bg-blue-600"
                emptyText="Chọn mã ưu đãi từ hệ thống"

                promo={adminPromoDisplay} // Truyền object hiển thị đã tạo ở trên

                onSelect={onApplyAdmin} // Gọi hàm của PaymentPage
                onRemove={() => onApplyAdmin(null)} // Gọi hàm với null để gỡ

                filterType={'ADMIN'}
                logoUrl={TRAVEL_MATE_LOGO_PUBLIC_PATH}
                // Admin promo thường áp dụng toàn sàn, ko cần filter theo property
            />

            <div className="my-4 border-t border-dashed border-gray-200" />

            {/* Slot 2: Owner Promo */}
            <PromoSlotContainer
                title="Voucher Khách Sạn"
                icon={Store}
                colorClass="text-purple-600 bg-purple-600"
                emptyText="Chọn mã ưu đãi của khách sạn"

                promo={ownerPromoDisplay} // Truyền object hiển thị đã tạo ở trên

                onSelect={onApplyOwner}
                onRemove={() => onApplyOwner(null)}

                filterType={'OWNER'}
                bookingPropertyId={bookingPropertyId}
            />
        </Card>
    );
};

export default DiscountSection;