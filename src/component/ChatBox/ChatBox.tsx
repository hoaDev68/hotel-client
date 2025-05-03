import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

interface ChatBoxProps {
  onClose: () => void;
}

export default function ChatBox({ onClose }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);

  //hàm gửi tin nhắn và bot tự trả lời
  const sendMessage = async () => {
    if (!message.trim()) return;

    // Thêm tin nhắn người dùng
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:8080/bot/ask', { message });
      console.log('Bot response:', res.data);
      const botResponse = res.data.answer;
      
      // Thêm tin nhắn bot
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'bot', content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.' }]);
    }
  };

  useEffect(() => {
    // Đóng chatbox khi nhấn ESC
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="bg-gray-200 rounded-lg shadow-lg p-6 h-[80vh] overflow-y-auto">
      <div className=" flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Trò chuyện với lễ tân ảo</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={!message.trim()}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
