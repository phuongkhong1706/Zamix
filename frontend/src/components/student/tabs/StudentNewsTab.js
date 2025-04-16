import React, { useState, useEffect } from 'react';

function StudentNewsTab() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fakeNews = [
      {
        id: 1,
        title: 'Thông báo nghỉ lễ 30/4 và 1/5',
        summary: 'Sinh viên sẽ được nghỉ học từ ngày 27/4 đến hết ngày 1/5...',
        date: '2025-04-10',
      },
      {
        id: 2,
        title: 'Tuyển sinh CLB Tin học HUST',
        summary: 'CLB Tin học HUST bắt đầu tuyển thành viên mới cho năm học 2025...',
        date: '2025-04-08',
      },
      {
        id: 3,
        title: 'Cuộc thi Hackathon mùa xuân 2025',
        summary: 'Cơ hội tham gia và nhận giải thưởng lên đến 50 triệu đồng...',
        date: '2025-04-01',
      },
    ];
    setNewsList(fakeNews);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Bảng Tin Sinh Viên</h1>
      {newsList.map((news) => (
        <div
          key={news.id}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '15px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{news.title}</h2>
          <p>{news.summary}</p>
          <p style={{ fontSize: '12px', textAlign: 'right', color: 'gray' }}>{new Date(news.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default StudentNewsTab;
