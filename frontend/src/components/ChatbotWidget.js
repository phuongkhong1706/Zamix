// ChatbotWidget.js
import React, { useState } from 'react';
import { MessageCircle, X, Send, GraduationCap, User } from 'lucide-react';
import '../styles/chatbot.css'; // Import CSS

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Em có thắc mắc gì về bài học không?", sender: "teacher" }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: "student"
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      // Simulate teacher response
      setTimeout(() => {
        const teacherResponse = {
          id: messages.length + 2,
          text: "Cô đã nhận được câu hỏi của em. Cô sẽ trả lời em ngay bây giờ nhé!",
          sender: "teacher"
        };
        setMessages(prev => [...prev, teacherResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-widget">
      <button className="chatbot-button" onClick={toggleChat}>
        {isOpen ? (
          <X className="chatbot-button-icon" />
        ) : (
          <MessageCircle className="chatbot-button-icon" />
        )}
        {!isOpen && <div className="chatbot-notification">1</div>}
      </button>

      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="chatbot-title">Giáo viên</div>
              <div className="chatbot-status">Sẵn sàng hỗ trợ</div>
            </div>
          </div>
          <button className="chatbot-close" onClick={toggleChat}>
            <X size={20} />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`chatbot-message ${message.sender}`}>
              <div className="chatbot-message-avatar">
                {message.sender === 'teacher' ? <GraduationCap size={16} /> : <User size={16} />}
              </div>
              <div className="chatbot-message-content">
                {message.text}
              </div>
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
            onKeyPress={handleKeyPress}
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