import React, { useState, useEffect } from 'react';

function AdminHomeTab() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/admin/home/')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  return (
    <div>
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

export default AdminHomeTab; // mac dinh hien thi hometab