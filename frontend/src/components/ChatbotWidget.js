import React, { useState } from 'react';
import { MessageCircle, X, Send, GraduationCap, User } from 'lucide-react';
import '../styles/chatbot.css';

const ChatbotWidget = ({ teacherId = 2 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Em có thắc mắc gì về bài học không?',
      sender: 'teacher',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const toggleChat = () => setIsOpen(prev => !prev);

  const sendMessage = async () => {
  const trimmedText = inputMessage.trim();
  if (!trimmedText) return;

  const studentMessage = {
    id: Date.now(),
    text: trimmedText,
    sender: 'student',
  };

  // ✅ Hiển thị ngay tin nhắn học sinh trước khi gửi
  setMessages(prev => [...prev, studentMessage]);
  setInputMessage('');

  let token = null;
  let userId = null;

  try {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userObj = JSON.parse(userJson);
      token = userObj.token;
      userId = userObj.user_id;
    }
  } catch (err) {
    console.error('❌ Lỗi khi parse user từ localStorage:', err);
  }

  if (!token || !userId) {
    alert('⚠️ Vui lòng đăng nhập để gửi tin nhắn.');
    return;
  }

  const payload = {
    student_id: userId,
    teacher_id: teacherId,
    content: trimmedText,
  };

  console.log('📤 DỮ LIỆU GỬI LÊN BACKEND:', payload);

  try {
    const response = await fetch('http://localhost:8000/api/chat/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Lỗi từ backend:', response.status, errorText);
      throw new Error('Gửi thất bại');
    }

    // ✅ Mô phỏng phản hồi giáo viên
    setTimeout(() => {
      const teacherReply = {
        id: Date.now() + 1,
        text: 'Cô đã nhận được câu hỏi của em. Cô sẽ trả lời ngay!',
        sender: 'teacher',
      };
      setMessages(prev => [...prev, teacherReply]);
    }, 1000);
  } catch (err) {
    console.error('❌ Gửi tin nhắn thất bại:', err);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chatbot-widget">
      <button className="chatbot-button" onClick={toggleChat}>
        {isOpen ? <X className="chatbot-button-icon" /> : <MessageCircle className="chatbot-button-icon" />}
        {!isOpen && <div className="chatbot-notification">1</div>}
      </button>

      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar"><GraduationCap size={20} /></div>
            <div>
              <div className="chatbot-title">Giáo viên</div>
              <div className="chatbot-status">Sẵn sàng hỗ trợ</div>
            </div>
          </div>
          <button className="chatbot-close" onClick={toggleChat}><X size={20} /></button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chatbot-message ${msg.sender}`}>
              <div className="chatbot-message-avatar">
                {msg.sender === 'teacher' ? <GraduationCap size={16} /> : <User size={16} />}
              </div>
              <div className="chatbot-message-content">{msg.text}</div>
            </div>
          ))}
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            className="chatbot-input-field"
            placeholder="Nhập câu hỏi cho giáo viên..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className="chatbot-send-button"
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
          >
            <Send className="chatbot-send-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
