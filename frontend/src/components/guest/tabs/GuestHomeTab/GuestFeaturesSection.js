import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Users, Shield, Check } from 'lucide-react';
import '../../../../styles/guest/GuestHomeTab/GuestFeaturesSection.css';

const GuestFeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: "Dành cho Học sinh",
      colorClass: "student",
      items: [
        "Truy cập các đề thi luyện tập và tài liệu học tập",
    "Theo dõi tiến độ và phân tích kết quả học tập",
    "Nhận phản hồi tức thì sau khi hoàn thành bài thi",
    "Tham gia các thử thách Toán học hàng ngày"
      ]
    },
    {
      icon: Users,
      title: "Dành cho Giáo viên",
      colorClass: "teacher",
      items: [
        "Tạo và tùy chỉnh đề thi một cách dễ dàng",
    "Tự động hóa quy trình chấm điểm và đánh giá",
    "Theo dõi kết quả của lớp và nhận diện xu hướng học tập",
    "Chia sẻ tài nguyên và hợp tác với đồng nghiệp"
      ]
    },
    {
      icon: Shield,
      title: "Dành cho Quản trị viên",
      colorClass: "admin",
      items: [
       "Giám sát tổng thể các hoạt động thi cử và tài khoản người dùng",
    "Tạo các báo cáo và phân tích toàn diện",
    "Quản lý các cài đặt hệ thống và quyền truy cập",
    "Theo dõi các chỉ số học tập và hiệu suất toàn trường"
      ]
    }
  ];

  return (
    <section ref={sectionRef} className="guest-section">
      <div className="blur-circle blur-purple" />
        <div className="blur-circle blur-blue" />
        <div className="blur-circle blur-emerald" />


      <div className="guest-container">
        <div className={`guest-header ${isVisible ? 'visible' : ''}`}>
          <h2>Dành cho tất cả mọi người</h2>
          <p>
            Nền tảng có những tính năng được tùy chỉnh riêng cho học sinh, giáo viên và nhà trường, giúp việc thi cử môn Toán trở nên liền mạch và hiệu quả hơn.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className={`feature-card ${feature.colorClass} ${isVisible ? 'visible' : ''}`} 
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="icon-wrapper">
                  <Icon className={`feature-icon ${feature.colorClass}`} />
                </div>
                <h3>{feature.title}</h3>
                <ul>
                  {feature.items.map((item, i) => (
                    <li 
                      key={i} 
                      className={`feature-item ${isVisible ? 'visible' : ''}`}
                      style={{ transitionDelay: `${(index * 200) + (i * 100) + 400}ms` }}
                    >
                      <div className={`item-check ${feature.colorClass}`}>
                        <Check className="check-icon" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className={`cta-box ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '800ms' }}>
          <h3>Trải nghiệm ngay hôm nay!</h3>
          <p>Tham gia cùng hàng nghìn người dùng là học sinh, giáo viên và quản trị viên đang thay đổi cách thi cử cùng chúng tôi.</p>
          <div className="cta-buttons">
            <button className="btn-primary">Đăng ký</button>
            <button className="btn-secondary">Khám phá</button>
          </div>
        </div> 
      </div>
    </section>
  );
};

export default GuestFeaturesSection;
