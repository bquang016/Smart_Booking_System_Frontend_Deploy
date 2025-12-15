import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal/Modal";
import Button from "@/components/common/Button/Button";
import TextArea from "@/components/common/Input/TextArea";
import { XCircle } from "lucide-react";
import CancelReasonSelect from "./CancelReasonSelect.jsx";
import LoadingOverlay from "@/components/common/Loading/LoadingOverlay";

// --- Dữ liệu lý do giữ nguyên ---
const CANCELLATION_REASONS = [
    { label: "Đặt phòng không được xác nhận kịp thời", value: "NO_CONFIRMATION" },
    { label: "Không thật sự tin tưởng vào uy tín của dịch vụ", value: "NO_TRUST" },
    { label: "Lo lắng về sự an toàn cho vị trí khách sạn", value: "SAFETY_CONCERNS" },
    { label: "Quyết định chọn khách sạn khác", value: "FOUND_ELSEWHERE" },
    { label: "Không thích chính sách hủy phòng", value: "POLICY_DISLIKE" },
    { label: "Không hài lòng với cách thanh toán", value: "PAYMENT_DISLIKE" },
    { label: "Buộc phải hủy phòng hay hoãn hành trình", value: "FORCED_CANCEL" },
    { label: "Tìm thấy giá thấp hơn trên mạng", value: "FOUND_CHEAPER_ONLINE" },
    { label: "Tìm được giá thấp hơn qua dịch vụ địa phương", value: "FOUND_CHEAPER_LOCAL" },
    { label: "Thiên Tai", value: "NATURAL_DISASTER" },
    { label: "Sẽ đặt khách sạn khác trên website của chúng tôi", value: "BOOK_ANOTHER" },
    { label: "Sẽ đặt phòng trực tiếp với khách sạn", value: "BOOK_DIRECT" },
    { label: "Khác", value: "OTHER" },
];

const Step1_Confirm = ({ onKeep, onContinue }) => (
    <div className="flex flex-col items-center text-center p-4">
        <XCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-3">Bạn có chắc chắn muốn hủy bỏ đặt phòng này không?</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Ưu đãi và giá của chúng tôi thay đổi liên tục nên ưu đãi này có thể sẽ không còn nữa nếu quý khách hủy ngay bây giờ.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={onKeep} variant="primary" fullWidth>
                Giữ đặt phòng này
            </Button>
            <Button onClick={onContinue} variant="ghost" fullWidth className="!text-red-600 hover:!bg-red-50">
                Hủy đặt phòng này
            </Button>
        </div>
    </div>
);

const Step2_Reason = ({ onClose, onConfirmSubmit, booking }) => {
    const [reasonLabel, setReasonLabel] = useState("");
    const [otherText, setOtherText] = useState("");
    const [error, setError] = useState("");

    const showOtherInput = reasonLabel === "Khác";

    const policyText = booking?.cancellationPolicy?.includes("Miễn phí")
        ? "Hủy không mất phí!"
        : "Hủy có thể mất phí";
    const policyDesc = booking?.cancellationPolicy?.includes("Miễn phí")
        ? "Nếu hủy phòng bây giờ bạn sẽ không bị tính tiền đâu."
        : (booking?.cancellationPolicy || "Vui lòng kiểm tra chi tiết chính sách hủy.");

    const handleSubmit = () => {
        const selectedOption = CANCELLATION_REASONS.find(r => r.label === reasonLabel);
        const reasonValue = selectedOption ? selectedOption.value : "";

        if (!reasonValue) {
            setError("Vui lòng chọn lý do hủy.");
            return;
        }
        if (reasonValue === "OTHER" && !otherText.trim()) {
            setError("Vui lòng cung cấp thêm chi tiết cho lý do 'Khác'.");
            return;
        }
        setError("");
        
        // Gộp reasonValue và otherText nếu cần, hoặc chỉ gửi reasonValue
        // Ở đây ta gửi cả hai, hàm xử lý cha sẽ quyết định dùng cái nào
        onConfirmSubmit(reasonValue, otherText);
    };

    const isSubmitDisabled = !reasonLabel || (reasonLabel === "Khác" && !otherText.trim());

    return (
        <div className="p-1">
            <div className="space-y-4">
                <CancelReasonSelect
                    label="Lý do hủy phòng:"
                    options={CANCELLATION_REASONS}
                    value={reasonLabel}
                    onChange={(label) => {
                        setReasonLabel(label);
                        setError("");
                    }}
                />

                {showOtherInput && (
                    <div className="animate-fadeIn">
                        <TextArea
                            label="Vui lòng cung cấp thêm chi tiết"
                            value={otherText}
                            onChange={(e) => {
                                setOtherText(e.target.value);
                                if (reasonLabel === "Khác") setError("");
                            }}
                            rows={4}
                            error={error && reasonLabel === "Khác" ? error : ""}
                        />
                    </div>
                )}

                {error && !showOtherInput && (
                    <p className="text-xs text-red-500 -mt-2 ml-1">{error}</p>
                )}

                <div className="pt-4">
                    <h4 className={`font-semibold ${policyText === "Hủy không mất phí!" ? "text-green-600" : "text-yellow-700"}`}>
                        {policyText}
                    </h4>
                    <p className="text-sm text-gray-600">
                        {policyDesc}
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                <Button variant="outline" onClick={onClose}>
                    Đóng
                </Button>
                <Button
                    variant="primary"
                    className="!bg-red-600 hover:!bg-red-700 disabled:!bg-gray-300 disabled:!opacity-70"
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                >
                    Tiếp tục hủy
                </Button>
            </div>
        </div>
    );
};

export default function CancelBookingModal({ open, onClose, booking, onConfirm }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setStep(1);
            setIsLoading(false);
        }
    }, [open]);

    const handleConfirmCancel = async (reasonValue, otherText) => {
        setIsLoading(true);
        try {
            // ✅ SỬA LOGIC: Gọi onConfirm với tham số phù hợp
            // MyBookings đang dùng: onConfirm={(reason) => ...}
            // Nên ta truyền reasonValue (hoặc kết hợp với otherText) vào.
            // Component cha (MyBookings) đã giữ 'selectedBooking' nên không cần truyền lại booking object từ đây.
            await onConfirm(reasonValue, otherText); 
        } catch (error) {
            console.error("Lỗi khi hủy:", error);
        } finally {
            // ✅ SỬA LỖI LOADING: Luôn tắt loading khi kết thúc (dù thành công hay thất bại)
            setIsLoading(false);
        }
    };

    const title = "Hủy đặt phòng";

    return (
        <>
            <Modal
                open={open}
                onClose={isLoading ? undefined : onClose}
                title={title}
                maxWidth={step === 1 ? "max-w-md" : "max-w-lg"}
            >
                {step === 1 ? (
                    <Step1_Confirm
                        onKeep={onClose}
                        onContinue={() => setStep(2)}
                    />
                ) : (
                    <Step2_Reason
                        onClose={onClose}
                        onConfirmSubmit={handleConfirmCancel}
                        booking={booking}
                    />
                )}
            </Modal>

            {isLoading && (
                <LoadingOverlay message="Đang xử lý yêu cầu hủy phòng..." />
            )}
        </>
    );
}