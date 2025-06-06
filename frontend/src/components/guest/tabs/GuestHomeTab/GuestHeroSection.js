import React, { useState, useEffect } from 'react';
import '../../../../styles/guest/GuestHomeTab/GuestHeroSection.css';
import imgGuestHeroSection from '../../../../assets/img/GuestHeroSection.jpg';

const GuestHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hero-section">
      <div className="hero-background" />

      <div className="purple-overlay" />

      <div className="hero-content">
        <div className="container">
          <div className="grid-layout">
            {/* Left Content */}
            <div className={`left-content ${isVisible ? 'visible' : 'hidden-left'}`}>
              <h1 className="hero-title">
                <span>Vượt qua </span> <span className="gradient-text">giới hạn </span><br />
                <span>Chạm đến </span> <span className="gradient-text">thành công </span>
              </h1>
              <p className="hero-description">
                Cổng thông tin hợp nhất giúp học sinh ôn luyện hiệu quả, giáo viên tổ chức thi dễ dàng và nhà trường quản lý chất lượng một cách tối ưu.
              </p>
              <div className="button-group">
                <button className="btn get-started">Tham gia ngay</button>
                <button className="btn learn-more">Khám phá</button>
              </div>
            </div>

            {/* Right Content */}
            <div className={`right-content ${isVisible ? 'visible' : 'hidden-right'}`}>
              <div className="image-wrapper">
                <div className="circle-deco top-left" />
                <div className="circle-deco bottom-right" />
                <div className="main-image-box">
                  <img
                    src={imgGuestHeroSection}
                    alt="Students"
                    className="students-image"
                  />
                  <div className="floating-card top-right">
                    <div className="stat-number">10k+</div>
                    <div className="stat-label">Câu hỏi luyện thi</div>
                  </div>
                  <div className="floating-card bottom-left">
                    <div className="stat-number">1k+</div>
                    <div className="stat-label">Học sinh tham gia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator
      <div className={`scroll-indicator ${isVisible ? 'visible' : 'opacity-0'}`}>
        <span>Scroll down</span>
        <svg className="arrow-down" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div> */}

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`particle ${isVisible ? 'visible' : 'opacity-0'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GuestHeroSection;
