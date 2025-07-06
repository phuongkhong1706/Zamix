import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    display: 'flex',
    height: '80vh',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    fontFamily: 'Arial',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#f5f5f5',
    borderRight: '1px solid #ddd',
    overflowY: 'auto',
  },
  chatArea: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  conversationItem: {
    padding: '15px',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer',
  },
  activeItem: {
    backgroundColor: '#e6f0ff',
  },
  chatHeader: {
    padding: '15px',
    borderBottom: '1px solid #ddd',
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
  },
  chatMessages: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  chatInputArea: {
    display: 'flex',
    borderTop: '1px solid #ddd',
    padding: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
    fontSize: '1em',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  messageBubble: {
    padding: '10px 15px',
    borderRadius: '20px',
    marginBottom: '10px',
    maxWidth: '70%',
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  receiver: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },
};

function TeacherHomeTab() {
  const [data, setData] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [allMessages, setAllMessages] = useState({});

  const dummyConversations = [
    { id: 1, name: 'Học sinh A', lastMessage: 'Thầy ơi giúp em câu 1...' },
    { id: 2, name: 'Học sinh B', lastMessage: 'Bài tập tuần này là gì ạ?' },
    { id: 3, name: 'Học sinh C', lastMessage: 'Em đã nộp bài rồi thầy nhé.' },
  ];

  const dummyMessages = {
    1: [
      { id: 1, sender: 'student', text: 'Thầy ơi giúp em câu 1 với ạ' },
      { id: 2, sender: 'teacher', text: 'Em bị chỗ nào thế?' },
    ],
    2: [
      { id: 1, sender: 'student', text: 'Bài tập tuần này là gì thầy?' },
      { id: 2, sender: 'teacher', text: 'Đã giao trên hệ thống rồi đó em' },
    ],
    3: [
      { id: 1, sender: 'student', text: 'Em đã nộp bài rồi thầy nhé' },
      { id: 2, sender: 'teacher', text: 'Oke thầy đã nhận được' },
    ],
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/teacher/home/')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  useEffect(() => {
    // Gán dữ liệu giả lập khi mở hộp thoại lần đầu
    if (selectedChatId !== null && !allMessages[selectedChatId]) {
      setAllMessages((prev) => ({
        ...prev,
        [selectedChatId]: dummyMessages[selectedChatId] || [],
      }));
    }
  }, [selectedChatId]);

  const handleSendMessage = () => {
    if (messageInput.trim() === '' || selectedChatId === null) return;

    const newMsg = {
      id: Date.now(), // Unique ID
      sender: 'teacher',
      text: messageInput.trim(),
    };

    setAllMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg],
    }));
    setMessageInput('');
  };

  const currentMessages = allMessages[selectedChatId] || [];

  return (
    <div style={styles.container}>
      {/* Sidebar danh sách hội thoại */}
      <div style={styles.sidebar}>
        {dummyConversations.map((conv) => (
          <div
            key={conv.id}
            style={{
              ...styles.conversationItem,
              ...(selectedChatId === conv.id ? styles.activeItem : {}),
            }}
            onClick={() => setSelectedChatId(conv.id)}
          >
            <strong>{conv.name}</strong>
            <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#555' }}>{conv.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Khung chat bên phải */}
      <div style={styles.chatArea}>
        {selectedChatId ? (
          <>
            <div style={styles.chatHeader}>
              Đang trò chuyện với{' '}
              {dummyConversations.find((c) => c.id === selectedChatId)?.name}
            </div>
            <div style={styles.chatMessages}>
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    ...styles.messageBubble,
                    ...(msg.sender === 'teacher' ? styles.sender : styles.receiver),
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div style={styles.chatInputArea}>
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                style={styles.input}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />
              <button style={styles.sendButton} onClick={handleSendMessage}>
                Gửi
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '20px' }}>Hãy chọn một hộp thoại để bắt đầu trò chuyện.</div>
        )}
      </div>
    </div>
  );
}

export default TeacherHomeTab;
