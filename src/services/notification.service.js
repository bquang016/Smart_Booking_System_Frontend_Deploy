import api from "./axios.config";

const notificationService = {
  // [CẬP NHẬT] Thêm tham số scope (Mặc định là 'ALL' để không làm hỏng code cũ)
  // scope: 'CUSTOMER' | 'OWNER' | 'ALL'
  getNotifications: async (page = 0, size = 10, scope = 'ALL') => {
    try {
      const response = await api.get("/notifications", {
        params: { page, size, scope } // Truyền scope lên URL
      });
      return response.data; 
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { content: [], totalPages: 0, totalElements: 0 };
    }
  },

  // [CẬP NHẬT] Lấy số lượng chưa đọc theo scope
  getUnreadCount: async (scope = 'ALL') => {
    try {
      const response = await api.get("/notifications/unread-count", {
        params: { scope }
      });
      return response.data; // Trả về số lượng (Long)
    } catch (error) {
      return 0;
    }
  },

  // Đánh dấu 1 thông báo là đã đọc
  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  // [CẬP NHẬT] Đánh dấu tất cả là đã đọc (theo scope)
  markAllAsRead: async (scope = 'ALL') => {
    try {
      await api.put("/notifications/read-all", null, {
        params: { scope }
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }
};

export default notificationService;