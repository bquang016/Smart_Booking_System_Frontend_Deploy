// src/layouts/CustomerLayout/ChatBot/ChatInput.jsx
import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      // Gửi nội dung text ra ngoài cho ChatPanel xử lý
      onSend(text); 
      // Xóa ô nhập liệu
      setText(""); 
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-gray-100 flex gap-2 items-center bg-white"
    >
      <input
        type="text"
        placeholder="Nhập tin nhắn..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm
                   focus:ring-2 focus:ring-[rgb(40,169,224,0.5)] focus:border-[rgb(40,169,224)] 
                   transition-all outline-none disabled:bg-gray-100"
      />
      
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className={`flex-shrink-0 p-2 rounded-full transition-colors flex items-center justify-center
          ${!text.trim() || disabled 
            ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
            : "bg-[rgb(40,169,224)] text-white hover:bg-[#1b98d6]"
          }
        `}
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default ChatInput;