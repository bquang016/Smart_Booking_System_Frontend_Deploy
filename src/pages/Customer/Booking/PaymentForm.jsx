// src/pages/Customer/Booking/PaymentForm.jsx (ĐÃ SỬA ĐƯỜNG DẪN IMPORT)

import React, { useState } from 'react';
import './PaymentForm.css'; // Import CSS
import { CreditCard } from 'lucide-react'; // Import icon

// 
// ✅ ĐƯỜNG DẪN ĐÚNG DỰA TRÊN ẢNH CỦA BẠN
// (Đi ra 3 cấp: Booking -> Customer -> pages, rồi đi vào assets/logo)
//
import VnpayLogo from '../../../assets/logo/vnpay_logo.png';
import MomoLogo from '../../../assets/logo/momo_logo.png';
import ZaloPayLogo from '../../../assets/logo/zalopay_logo.png';

const PaymentForm = () => {
    const [selectedMethod, setSelectedMethod] = useState('VNPAY');

    return (
        <div className="payment-form-container">
            {/* Đã thêm mb-4 để tạo khoảng cách với phần options bên dưới */}
            <div className="form-header flex items-center gap-2 mb-4">
                <CreditCard size={20} className="form-header-icon" />
                <h2>Phương thức thanh toán</h2>
            </div>
            
            <div className="payment-options">
                {/* Lựa chọn 1: VNPay */}
                <div 
                    className={`payment-option ${selectedMethod === 'VNPAY' ? 'selected' : ''}`}
                    onClick={() => setSelectedMethod('VNPAY')}
                >
                    <div className="payment-logo">
                        <img src={VnpayLogo} alt="VNPay" />
                    </div>
                    <span className="payment-name">Cổng thanh toán VNPay</span>
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="VNPAY"
                        checked={selectedMethod === 'VNPAY'}
                        readOnly
                    />
                </div>

                {/* Lựa chọn 2: MoMo */}
                <div 
                    className={`payment-option ${selectedMethod === 'MOMO' ? 'selected' : ''}`}
                    onClick={() => setSelectedMethod('MOMO')}
                >
                    <div className="payment-logo">
                        <img src={MomoLogo} alt="MoMo" />
                    </div>
                    <span className="payment-name">Ví điện tử MoMo</span>
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="MOMO"
                        checked={selectedMethod === 'MOMO'}
                        readOnly
                    />
                </div>
                
                {/* Lựa chọn 3: ZaloPay */}
                <div 
                    className={`payment-option ${selectedMethod === 'ZALOPAY' ? 'selected' : ''}`}
                    onClick={() => setSelectedMethod('ZALOPAY')}
                >
                    <div className="payment-logo">
                        <img src={ZaloPayLogo} alt="ZaloPay" />
                    </div>
                    <span className="payment-name">Ví điện tử ZaloPay</span>
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="ZALOPAY"
                        checked={selectedMethod === 'ZALOPAY'}
                        readOnly
                    />
                </div>

            </div>
        </div>
    );
};

export default PaymentForm;