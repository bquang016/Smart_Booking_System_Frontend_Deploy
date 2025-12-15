import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8386/api/v1";

const api = axios.create({
    baseURL: API_URL,
});

// Thêm token vào request (Giữ nguyên)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ CẬP NHẬT PHẦN NÀY (Đã sửa logic chặn reload)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response) {
            // 1. Xử lý lỗi 401 (Unauthorized - Sai pass hoặc Hết hạn token)
            if (response.status === 401) {
                // 🛑 QUAN TRỌNG: Kiểm tra xem lỗi này đến từ API nào?
                // error.config.url chứa đường dẫn API vừa gọi
                const requestUrl = error.config?.url || "";

                // Nếu lỗi 401 đến từ API Login -> RETURN LUÔN (Không reload trang)
                // Để component Login nhận lỗi và hiện Modal "Sai mật khẩu"
                if (requestUrl.includes("/auth/login") || requestUrl.includes("/auth/token")) {
                    return Promise.reject(error);
                }

                // Nếu lỗi 401 đến từ các trang khác (Ví dụ đang lướt web mà token hết hạn)
                // Thì mới đá về trang Login
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(error); // Ngắt luồng tại đây sau khi redirect
            }

            // 2. Tài khoản bị khóa (403)
            if (response.status === 403) {
                // Kiểm tra xem có phải đang Login không. Nếu đang Login thì để Component Login tự xử lý Modal 403.
                // Nếu bạn muốn xử lý tập trung ở đây cũng được, nhưng thường Component Login cần bắt lỗi này.
                
                // Logic cũ của bạn (Giữ nguyên nếu muốn dùng Event, nhưng Login.jsx tôi gửi đã xử lý rồi)
                const errorMessage = response.data?.error || response.data?.message || "";
                if (errorMessage && (errorMessage.toLowerCase().includes("khóa") || errorMessage.toLowerCase().includes("locked") || errorMessage.toLowerCase().includes("banned"))) {
                    window.dispatchEvent(new CustomEvent("auth:account-locked", {
                        detail: errorMessage
                    }));
                }
            }
        }
        return Promise.reject(error);
    }
);



export default api;