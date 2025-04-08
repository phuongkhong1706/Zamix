import React, { useState, useEffect } from 'react';

function StudentDoExam() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/student/do_exam/')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Trang Vào Thi</h1>
        {loading ? (
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        ) : data ? (
          <>
            <p className="text-lg text-gray-700 mb-6">{data.content}</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
              Bắt đầu làm bài
            </button>
          </>
        ) : (
          <p className="text-red-500">Không lấy được dữ liệu đề thi.</p>
        )}
      </div>
    </div>
  );
}

export default StudentDoExam;
