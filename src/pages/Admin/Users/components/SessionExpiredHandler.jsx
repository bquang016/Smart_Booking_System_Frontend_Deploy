import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";
// Import Portal để hiển thị modal đè lên trên cùng
import ModalPortal from "@/components/common/Modal/ModalPortal";

export default function SessionExpiredHandler() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("Tài khoản của bạn đã bị khóa.");

    useEffect(() => {
        // Hàm xử lý sự kiện nhận được từ axios
        const handleAccountLocked = (event) => {
            const msg = event.detail || "Tài khoản của bạn đã bị khóa do vi phạm chính sách.";
            setMessage(msg);
            setIsOpen(true);
        };

        // Lắng nghe tín hiệu 'auth:account-locked'
        window.addEventListener("auth:account-locked", handleAccountLocked);

        // Dọn dẹp sự kiện khi component unmount
        return () => {
            window.removeEventListener("auth:account-locked", handleAccountLocked);
        };
    }, []);

    const handleLogout = () => {
        // 1. Xóa thông tin đăng nhập
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        // 2. Tắt Modal
        setIsOpen(false);

        // 3. Chuyển hướng về trang đăng nhập
        window.location.href = "/login";
    };

    if (!isOpen) return null;

    return (
        <ModalPortal>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Hộp thoại Modal */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl p-8 w-[90%] max-w-sm shadow-2xl text-center border border-red-100"
                        >
                            {/* Icon và Tiêu đề */}
                            <div className="flex flex-col items-center gap-4 mb-6">
                                <div className="p-3 bg-red-50 rounded-full">
                                    <XCircle size={48} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Tài khoản bị khóa
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            {/* Nút bấm (Duy nhất 1 nút Đóng ở giữa) */}
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="px-8 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-200 active:scale-95"
                                >
                                    Đóng
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ModalPortal>
    );
}