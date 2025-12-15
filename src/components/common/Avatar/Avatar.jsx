import React, { useState, useEffect } from "react";

// Helper: Lấy domain gốc từ biến môi trường
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8386/api/v1";
  try {
    const url = new URL(apiUrl);
    return url.origin; 
  } catch (e) {
    return "http://localhost:8386"; // Fallback an toàn
  }
};

const Avatar = ({ name, src, size = 64, className = "" }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [hasError, setHasError] = useState(false);

  // Lấy ký tự đầu để hiển thị nếu không có ảnh hoặc ảnh lỗi
  const initials = name ? name.charAt(0).toUpperCase() : "?";
  const baseUrl = getBaseUrl();

  // Xử lý logic đường dẫn ảnh mỗi khi prop 'src' thay đổi
  useEffect(() => {
    if (src) {
      // Nếu src bắt đầu bằng "/" (đường dẫn tương đối), nối thêm domain backend
      if (src.toString().startsWith("/")) {
        setImgSrc(`${baseUrl}${src}`);
      } else {
        // Nếu là link tuyệt đối (http...) hoặc base64, giữ nguyên
        setImgSrc(src);
      }
      setHasError(false); // Reset trạng thái lỗi khi có ảnh mới
    } else {
      setImgSrc(null);
    }
  }, [src, baseUrl]);

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[rgb(40,169,224)] text-white font-semibold overflow-hidden select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Chỉ hiển thị ảnh nếu có src và chưa bị lỗi */}
      {imgSrc && !hasError ? (
        <img
          src={imgSrc}
          alt={name || "User Avatar"}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          
          // ✅ QUAN TRỌNG: 3 dòng này giúp tránh lỗi 429 từ Google
          referrerPolicy="no-referrer" 
          crossOrigin="anonymous"
          loading="lazy"
        />
      ) : (
        // Fallback: Hiển thị ký tự đầu tên với kích thước chữ tự động theo size
        <span style={{ fontSize: size * 0.4 }}>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;