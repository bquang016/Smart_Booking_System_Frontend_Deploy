import api from "./axios.config.js"; // API instance

export const userService = {

  /**
   * Lấy thông tin chi tiết (User + UserDetail)
   */
  getUserDetail: async () => {
    try {
      const res = await api.get(`/user-details/me`);
      return res.data;
    } catch (error) {
      console.error("Error fetching user detail:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin (User + UserDetail)
   */
  updateUserDetail: async (data) => {
    try {
      const res = await api.put(`/user-details/update`, data);
      return res.data;
    } catch (error) {
      console.error("Error updating user detail:", error);
      throw error;
    }
  },

  /**
   * Upload ảnh đại diện
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(`/user-details/upload-avatar`, formData);
      return res.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },

  /**
   * Kiểm tra trạng thái hồ sơ
   */
  getProfileStatus: async () => {
    try {
      const res = await api.get(`/user-details/profile-status`);
      return res.data;
    } catch (error) {
      console.error("Error fetching profile status:", error);
      throw error;
    }
  },

  /**
   * HÀM UPLOAD FILE CHUNG
   * (dùng cho upload CCCD, giấy phép...)
   * Backend trả về: { fileDownloadUri, fileName, size, contentType }
   */
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(`/files/upload`, formData);
      const data = res.data;

      // Backend trả về fileDownloadUri → FE trả về đúng trường này
      if (data.fileDownloadUri) {
        return data.fileDownloadUri;
      }

      // fallback cho trường hợp BE đổi format
      if (data.url) {
        return data.url;
      }

      console.error("Upload response không hợp lệ:", data);
      throw new Error("API upload không trả về URL hợp lệ");

    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },
};
