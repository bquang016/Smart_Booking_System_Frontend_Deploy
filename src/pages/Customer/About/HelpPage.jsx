import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button/Button';

import inboxIllustration from '../../../assets/logo/inbox-illustration.png';

const HelpPage = () => {
    return (
            <div className="bg-gray-50" style={{ minHeight: 'calc(100vh - 80px)' }}>

                <div className="bg-[rgb(40,169,224)] w-full py-6 text-white shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-1">Trợ giúp</h1>
                        <p className="text-sm text-blue-100">
                            Theo dõi lịch sử trò chuyện với bộ phận Hỗ trợ Khách hàng TravelMate
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-4 md:p-8">

                    <div className="bg-white rounded-lg shadow-xl p-8 md:p-16 flex flex-col items-center text-center">

                        <img
                            src={inboxIllustration}
                            alt="Support illustration"
                            className="w-full max-w-xs h-auto mb-8"
                        />

                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
                            Bạn cần trợ giúp về đặt chỗ?
                        </h2>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link
                                to="/help"
                                className="font-medium text-blue-600 hover:underline"
                            >
                                Xem Những câu hỏi thường gặp
                            </Link>
                            <Button
                                onClick={() => { /* TODO: Xử lý mở chat-widget */ }}
                                className="bg-[rgb(40,169,224)] hover:bg-[#1b98d6]"
                            >
                                Hỏi chúng tôi
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
    );
};

export default HelpPage;
