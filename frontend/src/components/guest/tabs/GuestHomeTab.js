import React, { useState, useEffect } from 'react';
import GuestHeroSection from './GuestHomeTab/GuestHeroSection';
import GuestFeaturesSection from './GuestHomeTab/GuestFeaturesSection';
import GuestFooter from './GuestHomeTab/GuestFooter';

function GuestHomeTab() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/guest/home/')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  return (
    <div>
      <GuestHeroSection /> {/* Đây là chỗ thêm vào */}
      <GuestFeaturesSection />
      <GuestFooter />
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

export default GuestHomeTab;
