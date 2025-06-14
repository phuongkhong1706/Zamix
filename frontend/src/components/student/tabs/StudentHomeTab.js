import React, { useState, useEffect } from 'react';
import StudentHeroSection from './home/StudentHeroSection';
import ExamSchedule from './home/StudentExamSchedule';
import StudentHelpFooter from './home/StudentHelpFooter';

function StudentHomeTab() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/student/home/')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  return (
    <div>
      <StudentHeroSection />
      <ExamSchedule />
      <StudentHelpFooter />
      {data ? (
        <>
          <p>{data.content}</p>
        </>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}

export default StudentHomeTab; // mac dinh hien thi hometab