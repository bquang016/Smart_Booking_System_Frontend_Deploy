import React, { useState, useEffect, useCallback, useRef } from "react";
// Import các component Common
import ConfirmModal from "@/components/common/Modal/ConfirmModal";
import ToastPortal from "@/components/common/Notification/ToastPortal";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";
import Pagination from "@/pages/Owner/Bookings/components/common/Pagination";

// Import các component con
import UserStats from "./components/UserStats";
import UserFilterBar from "./components/UserFilterBar";
import UserTable from "./components/UserTable";
import LockReasonModal from "./components/LockReasonModal";

// Import Service
import adminService from "@/services/admin.service";

export default function UserManagementPage() {
    // Ref
    const toastRef = useRef();

    // State dữ liệu
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ State tìm kiếm: Tách biệt giá trị nhập (UI) và giá trị gọi API (Logic)
    const [searchTerm, setSearchTerm] = useState(""); // Hiển thị trên ô input (update ngay lập tức)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Dùng để gọi API (update sau 500ms)

    // Filter & Pagination States
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [rankFilter, setRankFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Stats
    const [stats, setStats] = useState({ total: 0, active: 0, banned: 0 });

    // Modals
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [selectedUserForLock, setSelectedUserForLock] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        open: false, title: "", message: "", type: "info", confirmText: "Xác nhận", onConfirm: null,
    });

    const addToast = (message, mode = "info") => {
        if (toastRef.current) toastRef.current.addMessage({ mode, message });
    };

    // ✅ KỸ THUẬT DEBOUNCE: Chỉ cập nhật từ khóa tìm kiếm sau khi người dùng ngừng gõ 500ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm); // Cập nhật từ khóa thực tế để gọi API
            if (searchTerm !== "") {
                setCurrentPage(1); // Reset về trang 1 nếu đang tìm kiếm
            }
        }, 500); // Độ trễ 500ms (0.5 giây)

        // Clear timeout nếu người dùng gõ tiếp trước khi hết 500ms
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Hàm gọi API
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getAllUsers(
                currentPage - 1,
                pageSize,
                debouncedSearchTerm, // ✅ Sử dụng từ khóa đã Debounce
                roleFilter,
                "ALL",
                rankFilter
            );

            const data = response.data || response;
            if(data) {
                setUsers(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);

                setStats({
                    total: data.totalElements || 0,
                    active: data.content?.filter(u => u.status === 'ACTIVE').length || 0,
                    banned: data.content?.filter(u => u.status === 'BANNED').length || 0
                });
            }
        } catch (error) {
            console.error("Failed:", error);
            addToast("Không thể tải danh sách người dùng", "error");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, debouncedSearchTerm, roleFilter, rankFilter]); // ✅ Dependency là debouncedSearchTerm

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // ✅ Handler chỉ cập nhật UI, không gọi API hay reset trang ngay
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleRoleChange = (role) => { setRoleFilter(role); setCurrentPage(1); };
    const handleRankChange = (rank) => { setRankFilter(rank); setCurrentPage(1); };
    const handlePageChange = (page) => setCurrentPage(page);

    // Logic xử lý trạng thái (Khóa/Mở khóa)
    const handleStatusClick = (userId, currentStatus) => {
        const user = users.find(u => u.userId === userId);
        if (currentStatus === "ACTIVE") {
            setSelectedUserForLock(user);
            setIsLockModalOpen(true);
        } else {
            setConfirmModal({
                open: true,
                title: "Mở khóa tài khoản",
                message: `Bạn có chắc chắn muốn mở khóa cho tài khoản ${user?.fullName}?`,
                type: "success",
                confirmText: "Mở khóa",
                onConfirm: () => executeStatusChange(userId, "ACTIVE", "")
            });
        }
    };

    const executeStatusChange = async (userId, newStatus, reason) => {
        try {
            await adminService.updateUserStatus(userId, newStatus, reason);
            const actionText = newStatus === "BANNED" ? "Đã khóa" : "Đã mở khóa";
            addToast(`${actionText} tài khoản thành công`, "success");
            setIsLockModalOpen(false);
            setSelectedUserForLock(null);
            fetchUsers();
        } catch (error) {
            addToast("Lỗi cập nhật trạng thái", "error");
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50/50 space-y-6 relative">
            {isLoading && <LoadingOverlay />}
            <ToastPortal ref={toastRef} autoClose={true} />

            <LockReasonModal
                isOpen={isLockModalOpen}
                onClose={() => setIsLockModalOpen(false)}
                userName={selectedUserForLock?.fullName}
                onConfirm={(reason) => executeStatusChange(selectedUserForLock?.userId, "BANNED", reason)}
            />

            <ConfirmModal
                open={confirmModal.open}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText={confirmModal.confirmText}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
            />

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
            </div>

            <UserStats stats={stats} />

            <UserFilterBar
                searchTerm={searchTerm} // ✅ Truyền searchTerm (UI) để input hiển thị mượt
                onSearchChange={handleSearchChange}
                roleFilter={roleFilter}
                onRoleFilterChange={handleRoleChange}
                rankFilter={rankFilter}
                onRankFilterChange={handleRankChange}
            />

            <UserTable
                users={users}
                onStatusChange={handleStatusClick}
            />

            {totalPages > 0 && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
