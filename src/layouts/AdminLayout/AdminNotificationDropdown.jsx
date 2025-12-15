import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import Badge from "../../components/common/Badge/Badge"; // Sử dụng component common

// Component này quản lý trạng thái riêng của nó
const AdminNotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Logic đóng khi click ra ngoài
  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-[rgb(40,169,224)] relative"
      >
        <Bell size={20} />
        {/* Chấm đỏ thông báo (ví dụ) */}
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
      </button>

      {/* Menu Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-sm bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="font-semibold text-sm text-gray-800 p-3 border-b border-gray-100">
            Thông báo
          </div>
          <div className="p-4 text-center text-sm text-gray-500">
            {/* Đây là 1 ví dụ, sau này sẽ thay bằng list */}
            Chưa có thông báo mới.
          </div>
          <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
            <a href="#" className="text-sm font-medium text-[rgb(40,169,224)] hover:underline">
              Xem tất cả
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationDropdown;