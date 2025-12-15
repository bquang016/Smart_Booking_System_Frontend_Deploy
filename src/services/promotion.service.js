import axios from "./axios.config";

const API_URL = "/promotions";

const formatDateTime = (dateInput, isEndOfDay = false) => {
    if (!dateInput) return null;
    if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        const time = isEndOfDay ? '23:59:59' : '00:00:00';
        return `${dateInput}T${time}`;
    }
    if (Array.isArray(dateInput)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
    }
    if (dateInput instanceof Date) {
        const year = dateInput.getFullYear();
        const month = String(dateInput.getMonth() + 1).padStart(2, '0');
        const day = String(dateInput.getDate()).padStart(2, '0');
        if (isEndOfDay) { return `${year}-${month}-${day}T23:59:59`; }
        const hour = String(dateInput.getHours()).padStart(2, '0');
        const minute = String(dateInput.getMinutes()).padStart(2, '0');
        const second = String(dateInput.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }
    if (typeof dateInput === 'string' && dateInput.includes('T')) { return dateInput; }
    return dateInput;
};

// ✅ Helper: Parse số an toàn để tránh gửi chuỗi rỗng lên Backend gây lỗi 400
const parseNumber = (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const cleanVal = String(val).replace(/\./g, "");
    return Number(cleanVal);
};

const promotionService = {
    getAllPromotions: async () => {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    },

    // ✅ API lấy danh sách của Owner (cho trang quản lý của Owner)
    getOwnerPromotions: async () => {
        const response = await axios.get(`${API_URL}/owner/my-promotions`);
        return response.data;
    },

    // ✅ NEW: API Public lấy danh sách khuyến mãi cho khách hàng (Admin + Owner)
    // Dùng cho trang chi tiết khách sạn (Customer View)
    getPromotionsByPropertyPublic: async (propertyId) => {
        const response = await axios.get(`${API_URL}/public/property/${propertyId}`);
        return response.data;
    },

    createPromotion: async (data) => {
        const payload = {
            code: data.code,
            description: data.name,
            discountType: data.type === "PERCENT" || data.type === "PERCENTAGE" ? "PERCENTAGE" : "FIXED_AMOUNT",

            discountValue: parseNumber(data.value), // Parse số

            startDate: formatDateTime(data.startDate, false),
            endDate: formatDateTime(data.endDate, true),

            minBookingAmount: parseNumber(data.minOrder) || 0,
            maxDiscountAmount: parseNumber(data.maxDiscount) || 0,
            usageLimit: parseNumber(data.quantity) > 0 ? parseNumber(data.quantity) : null,

            status: "ACTIVE",
            minMembershipRank: data.minMembershipRank || "BRONZE",
            propertyId: data.propertyId // ✅ Gửi ID khách sạn
        };
        return await axios.post(`${API_URL}/create`, payload);
    },

    updatePromotion: async (id, data) => {
        const payload = {
            code: data.code,
            description: data.name,
            discountType: data.type === "PERCENT" || data.type === "PERCENTAGE" ? "PERCENTAGE" : "FIXED_AMOUNT",
            discountValue: parseNumber(data.value),
            startDate: formatDateTime(data.startDate, false),
            endDate: formatDateTime(data.endDate, true),
            minBookingAmount: parseNumber(data.minOrder) || 0,
            maxDiscountAmount: parseNumber(data.maxDiscount) || 0,
            usageLimit: parseNumber(data.quantity) > 0 ? parseNumber(data.quantity) : null,
            status: data.isActive ? "ACTIVE" : "PAUSED",
            minMembershipRank: data.minMembershipRank || "BRONZE",
            propertyId: data.propertyId // ✅ Gửi ID khách sạn để update
        };
        return await axios.put(`${API_URL}/update/${id}`, payload);
    },

    softDeletePromotion: async (id, currentPromotionData) => {
        const dataToSend = { ...currentPromotionData, status: "DELETED" };
        return await promotionService.updatePromotion(id, dataToSend);
    },
    deletePromotion: async (id) => { return await axios.delete(`${API_URL}/delete/${id}`); },
    uploadBanner: async (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return await axios.post(`${API_URL}/${id}/banner`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
};

export default promotionService;