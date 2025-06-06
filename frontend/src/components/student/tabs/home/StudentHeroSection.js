import React, { useState, useEffect } from 'react';
import { Play, Dumbbell } from 'lucide-react';
// import { Play, Dumbbell, Calendar, TrendingUp, BookOpen, Clock, Award } from 'lucide-react';
import '../../../../styles/student/StudentHomeTab/StudentHeroSection.css';

const StudentHeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [studentName] = useState("Khổng Thị Hoài Phương");
  const [upcomingExams] = useState(2);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`student-hero-section ${isVisible ? 'student-hero-visible' : ''}`}>
      {/* Animated Background Elements */}
      <div className="student-hero-background">
        <div className="student-symbol student-symbol-2">2</div>
        <div className="student-symbol student-symbol-plus">+</div>
        <div className="student-symbol student-symbol-1">1</div>
        <div className="student-symbol student-symbol-4">4</div>
        <div className="student-symbol student-symbol-eq">=</div>
        <div className="student-symbol student-symbol-star">★</div>

        <div className="student-shape student-rotating-square" />
        <div className="student-shape student-bouncing-circle" />
        <div className="student-shape student-pulsing-square" />

        <div className="student-symbol student-symbol-pi">π</div>
        <div className="student-symbol student-symbol-sum">∑</div>
        <div className="student-symbol student-symbol-root">√</div>

        <div className="student-shape student-rotated-diamond" />
        <div className="student-shape student-rotated-bar" />
      </div>

      {/* Main Content */}
      <div className="student-container">
        <div className="student-content">
          <div className="student-left">
            <h1>
              Xin chào, <span className="student-highlight">{studentName}</span>!
            </h1>
            <p>
                Tuần này bạn có <span className="student-highlight">{upcomingExams} kỳ thi đang chờ</span>. Cố gắng lên nhé!
            </p>

            <div className="student-buttons">
              <button className="student-btn student-btn-primary">
                <Play size={18} />
                <span>Vào thi</span>
              </button>

              <button className="student-btn student-btn-secondary">
                <Dumbbell size={18} />
                <span>Luyện tập</span>
              </button>
            </div>
          </div>

          {/* <div className="student-right">
            <div className="student-stats">
              <div className="student-card">
                <Calendar size={20} />
                <div>
                  <div className="student-card-value">{upcomingExams}</div>
                  <div className="student-card-label">Upcoming</div>
                </div>
              </div>
              <div className="student-card">
                <TrendingUp size={20} />
                <div>
                  <div className="student-card-value">85%</div>
                  <div className="student-card-label">Avg Score</div>
                </div>
              </div>
              <div className="student-card">
                <BookOpen size={20} />
                <div>
                  <div className="student-card-value">12</div>
                  <div className="student-card-label">Completed</div>
                </div>
              </div>
              <div className="student-card">
                <Clock size={20} />
                <div>
                  <div className="student-card-value">24h</div>
                  <div className="student-card-label">Study Time</div>
                </div>
              </div>
            </div>

            <div className="student-badge">
              <div className="student-badge-icon">
                <Award size={20} color="white" />
              </div>
              <div>
                <div className="student-badge-title">Math Champion!</div>
                <div className="student-badge-subtitle">Top 10% this month</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="student-bottom-gradient" />
    </div>
  );
};

export default StudentHeroSection;
