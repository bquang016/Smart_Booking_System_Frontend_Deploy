import api from "./axios.config.js";

const adminService = {
  // ============================
  // 🧑‍💼 LẤY CÁC ĐƠN ĐĂNG KÝ OWNER (LEGACY)
  // ============================
  getOwnerApplications: async (status) => {
    try {
      const response = await api.get(`/admin/owner-applications`, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching owner applications:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch applications");
    }
  },

  reviewOwnerApplication: async (applicationId, reviewData) => {
    try {
      const response = await api.post(
          `/admin/owner-applications/${applicationId}/review`,
          reviewData
      );
      return response.data;
    } catch (error) {
      console.error("Error reviewing owner application:", error);
      throw new Error(error.response?.data?.message || "Failed to review application");
    }
  },

  // ============================
  // 🏨 QUẢN LÝ KHÁCH SẠN (LIST & ACTIONS)
  // ============================

  // 1. [QUAN TRỌNG] Hàm này dùng cho ActiveHotelsPage để lọc tab Active/Suspended
  // Gọi API: GET /api/v1/admin/properties/list
  getPropertiesList: async (page = 0, size = 10, status = "APPROVE") => {
    try {
      const response = await api.get(`/admin/properties/list`, {
        params: { page, size, status }
      });
      return response.data; // Trả về ApiResponse chứa data.content
    } catch (error) {
      console.error("Error fetching properties list:", error);
      throw error;
    }
  },

  // 2. Hàm cũ (giữ lại nếu trang duyệt đơn PENDING cần dùng)
  getPropertiesByStatus: async (status) => {
    try {
      const response = await api.get(`/admin/properties/status`, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },

  reviewProperty: async (propertyId, reviewData) => {
    try {
      const response = await api.post(
          `/admin/properties/${propertyId}/review`,
          reviewData
      );
      return response.data;
    } catch (error) {
      console.error("Error reviewing property:", error);
      throw error;
    }
  },

  // 3. Dừng hoạt động khách sạn
  suspendProperty: async (propertyId, reason) => {
    try {
      const response = await api.put(`/admin/properties/${propertyId}/suspend`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error("Error suspending property:", error);
      throw error;
    }
  },

  // 4. Mở lại hoạt động khách sạn
  activateProperty: async (propertyId) => {
    try {
      const response = await api.put(`/admin/properties/${propertyId}/activate`);
      return response.data;
    } catch (error) {
      console.error("Error activating property:", error);
      throw error;
    }
  },

  // ============================
  // 🛏️ QUẢN LÝ PHÒNG
  // ============================

  getPropertyRooms: async (propertyId) => {
    try {
      const response = await api.get(`/admin/properties/${propertyId}/rooms`);
      return response.data;
    } catch (error) {
      console.error("Error fetching property rooms:", error);
      throw error;
    }
  },

 // 5. Dừng hoạt động phòng
  suspendRoom: async (roomId, reason) => {
    try {
      // ❌ Cũ (Sai): /admin/rooms/${roomId}/suspend
      // ✅ Mới (Đúng): /admin/properties/rooms/${roomId}/suspend
      const response = await api.put(`/admin/properties/rooms/${roomId}/suspend`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error("Error suspending room:", error);
      throw error;
    }
  },

  // 6. Mở lại hoạt động phòng
  activateRoom: async (roomId) => {
    try {
      // ❌ Cũ (Sai): /admin/rooms/${roomId}/activate
      // ✅ Mới (Đúng): /admin/properties/rooms/${roomId}/activate
      const response = await api.put(`/admin/properties/rooms/${roomId}/activate`);
      return response.data;
    } catch (error) {
      console.error("Error activating room:", error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get("/admin/owner-applications/dashboard-stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};

export default adminService;