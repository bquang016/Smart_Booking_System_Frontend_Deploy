import api from "./axios.config.js";

// ============================
// 📤 SUBMIT PROPERTY APPLICATION
// ============================
const submitPropertyApplication = async (formData) => {
  try {
    const response = await api.post("/properties/submit-application", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getOwnerActiveProperties = async () => {
  try {
    const response = await api.get("/properties/my-active-properties");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================
// 🔍 TÌM KIẾM PROPERTIES
// ============================
const searchProperties = async (keyword, guests, checkIn, checkOut) => {
  try {
    const response = await api.get(`/properties/search`, {
      params: {
        keyword: keyword || "",
        guests: guests || 1,
        checkIn: checkIn || null,
        checkOut: checkOut || null
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching properties:", error);
    throw error;
  }
};

// ============================
// 🏠 LẤY DANH SÁCH CỦA OWNER
// ============================
const getOwnerProperties = async () => {
  try {
    const response = await api.get("/properties/my-properties");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================
// ⚙️ CẬP NHẬT THÔNG TIN CƠ BẢN
// ============================
const updateProperty = async (id, updatedData) => {
  try {
    const response = await api.put(`/properties/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Failed to update property");
  }
};

// ==========================================================
// 🖼️ QUẢN LÝ HÌNH ẢNH (ĐÃ FIX THEO CONTROLLER MỚI)
// ==========================================================

// 1. Lấy danh sách ảnh
const getPropertyImages = async (propertyId) => {
  try {
    // GET /api/v1/property-images/{propertyId}
    const response = await api.get(`/property-images/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

// 2. Upload nhiều ảnh
const uploadPropertyImages = async (propertyId, formData) => {
  try {
    // POST /api/v1/property-images/{propertyId}/upload
    const response = await api.post(
        `/property-images/${propertyId}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

// 3. Xóa ảnh
const deletePropertyImage = async (propertyId, imageId) => {
  try {
    // DELETE /api/v1/property-images/{propertyId}/{imageId}
    const response = await api.delete(`/property-images/${propertyId}/${imageId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// 4. Đặt ảnh bìa
const setCoverImage = async (propertyId, imageId) => {
  try {
    // PUT /api/v1/property-images/{propertyId}/{imageId}/cover
    const response = await api.put(
        `/property-images/${propertyId}/${imageId}/cover`
    );
    return response.data;
  } catch (error) {
    console.error("Error setting cover image:", error);
    throw error;
  }
};

// ============================
// 🏨 LẤY CHI TIẾT PROPERTY
// ============================
const getPropertyDetail = async (id, checkIn, checkOut) => {
  try {
    const response = await api.get(`/properties/${id}`, {
      params: {
        checkIn: checkIn || null,
        checkOut: checkOut || null
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================
// 🗺️ TÌM KHÁCH SẠN GẦN ĐÂY
// ============================
const findNearbyProperties = async (lat, lng, radius = 10) => {
  try {
    const response = await api.get(`/properties/nearby`, {
      params: { lat, lng, radius }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby properties:", error);
    return [];
  }
};

// ============================
// 📜 POLICY
// ============================
const addPropertyPolicies = async (propertyId, policyData) => {
  try {
    const response = await api.post(`/properties/${propertyId}/policies`, policyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getPropertyPolicies = async (propertyId) => {
  try {
    const response = await api.get(`/properties/${propertyId}/policies`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

const updatePropertyPolicies = async (propertyId, policyData) => {
  try {
    const response = await api.put(`/properties/${propertyId}/policies`, policyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const checkNameAvailability = async (propertyName) => {
  try {
    const response = await api.get("/properties/check-name", {
      params: { name: propertyName }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const togglePropertyStatus = async (id) => {
  try {
    const response = await api.patch(`/properties/${id}/status`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Failed to update property status");
  }
};

// ==========================================================
// 📦 EXPORT
// ==========================================================
const propertyService = {
  searchProperties,
  getOwnerProperties,
  getPropertyDetail,
  updateProperty,
  getPropertyImages,
  uploadPropertyImages,
  deletePropertyImage,
  setCoverImage,
  getOwnerActiveProperties,
  submitPropertyApplication,
  findNearbyProperties,
  addPropertyPolicies,
  getPropertyPolicies,
  updatePropertyPolicies,
  checkNameAvailability,
  togglePropertyStatus,
};

export default propertyService;
