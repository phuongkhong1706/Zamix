import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area } from 'recharts';
import { Users, BookOpen, FileText, TrendingUp, Award, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import '../../../../../styles/teacher/TeacherStatistics.css';

const TeacherStatistics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Dữ liệu mẫu dựa trên ERD
  const examData = [
    { month: 'T1', exams: 12, students: 450, avgScore: 7.2, passRate: 78 },
    { month: 'T2', exams: 15, students: 520, avgScore: 7.5, passRate: 82 },
    { month: 'T3', exams: 18, students: 600, avgScore: 7.1, passRate: 75 },
    { month: 'T4', exams: 22, students: 680, avgScore: 7.8, passRate: 85 },
    { month: 'T5', exams: 25, students: 750, avgScore: 7.6, passRate: 83 },
    { month: 'T6', exams: 20, students: 580, avgScore: 8.0, passRate: 88 }
  ];

  const gradeDistribution = [
    { grade: 'Lớp 10', students: 420, exams: 35, avgScore: 7.2 },
    { grade: 'Lớp 11', students: 380, exams: 42, avgScore: 7.6 },
    { grade: 'Lớp 12', students: 350, exams: 48, avgScore: 8.1 }
  ];

  const questionTypeStats = [
    { type: 'Trắc nghiệm', count: 1250, avgScore: 7.8, color: '#8884d8' },
    { type: 'Tự luận', count: 680, avgScore: 6.9, color: '#82ca9d' },
    { type: 'Ứng dụng', count: 420, avgScore: 6.2, color: '#ffc658' },
    { type: 'Tổng hợp', count: 320, avgScore: 5.8, color: '#ff7300' }
  ];

  const reviewStats = [
    { status: 'Chờ xử lý', count: 12, color: '#ff4d4f' },
    { status: 'Đã xử lý', count: 85, color: '#52c41a' },
    { status: 'Đang xem xét', count: 8, color: '#faad14' }
  ];

  const difficultyAnalysis = [
    { level: 'Dễ', questions: 450, avgScore: 8.5, successRate: 92 },
    { level: 'Trung bình', questions: 380, avgScore: 7.2, successRate: 78 },
    { level: 'Khó', questions: 220, avgScore: 5.8, successRate: 58 },
    { level: 'Rất khó', questions: 120, avgScore: 4.2, successRate: 35 }
  ];

  const topicPerformance = [
    { topic: 'Đại số', totalQuestions: 420, avgScore: 7.6, weakestArea: 'Phương trình bậc cao' },
    { topic: 'Hình học', totalQuestions: 380, avgScore: 6.8, weakestArea: 'Hình học không gian' },
    { topic: 'Giải tích', totalQuestions: 290, avgScore: 6.2, weakestArea: 'Tích phân' },
    { topic: 'Xác suất', totalQuestions: 180, avgScore: 7.1, weakestArea: 'Xác suất có điều kiện' }
  ];

  const timeAnalysis = [
    { timeRange: '0-30 phút', students: 145, avgScore: 8.2, completion: 95 },
    { timeRange: '30-60 phút', students: 380, avgScore: 7.5, completion: 88 },
    { timeRange: '60-90 phút', students: 290, avgScore: 6.8, completion: 75 },
    { timeRange: '90+ phút', students: 85, avgScore: 5.9, completion: 60 }
  ];

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="teastats-stat-card" style={{ borderLeftColor: color }}>
      <div className="teastats-stat-card-content">
        <div className="teastats-stat-card-info">
          <p className="teastats-stat-title">{title}</p>
          <p className="teastats-stat-value">{value}</p>
          <p className={`teastats-stat-change ${change >= 0 ? 'teastats-positive' : 'teastats-negative'}`}>
            {change >= 0 ? '+' : ''}{change}% so với tháng trước
          </p>
        </div>
        <Icon className="teastats-stat-icon" style={{ color }} />
      </div>
    </div>
  );

  return (
    <div className="teastats-dashboard">
      <div className="teastats-container">
        {/* Filters */}
        <div className="teastats-filters">
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="teastats-select"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
          
          <select 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="teastats-select"
          >
            <option value="all">Tất cả lớp</option>
            <option value="10">Lớp 10</option>
            <option value="11">Lớp 11</option>
            <option value="12">Lớp 12</option>
          </select>
        </div>

        {/* Key Statistics Cards */}
        <div className="teastats-stats-grid">
          <StatCard 
            title="Tổng số kỳ thi" 
            value="125" 
            change={12} 
            icon={FileText} 
            color="#3b82f6" 
          />
          <StatCard 
            title="Học sinh tham gia" 
            value="1,150" 
            change={8} 
            icon={Users} 
            color="#10b981" 
          />
          <StatCard 
            title="Điểm trung bình" 
            value="7.6" 
            change={3} 
            icon={Award} 
            color="#f59e0b" 
          />
          <StatCard 
            title="Tỷ lệ đạt" 
            value="83%" 
            change={5} 
            icon={TrendingUp} 
            color="#8b5cf6" 
          />
        </div>

        {/* Charts Grid */}
        <div className="teastats-charts-grid">
          {/* Xu hướng kết quả thi theo thời gian */}
          <div className="teastats-chart-card">
            <h3 className="teastats-chart-title">Xu hướng kết quả thi theo thời gian</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={examData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" name="Điểm TB" />
                <Line type="monotone" dataKey="passRate" stroke="#10b981" name="Tỷ lệ đạt (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Phân bố theo khối lớp */}
          <div className="teastats-chart-card">
            <h3 className="teastats-chart-title">Phân bố theo khối lớp</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#3b82f6" name="Số học sinh" />
                <Bar dataKey="exams" fill="#f59e0b" name="Số bài thi" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="teastats-charts-grid">
          {/* Phân tích theo loại câu hỏi */}
          <div className="teastats-chart-card">
            <h3 className="teastats-chart-title">Phân tích theo loại câu hỏi</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={questionTypeStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {questionTypeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tình trạng phúc tra */}
          <div className="teastats-chart-card">
            <h3 className="teastats-chart-title">Tình trạng phúc tra</h3>
            <div className="teastats-review-stats">
              {reviewStats.map((item, index) => (
                <div key={index} className="teastats-review-item">
                  <div className="teastats-review-info">
                    <div 
                      className="teastats-review-color" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="teastats-review-status">{item.status}</span>
                  </div>
                  <span className="teastats-review-count">{item.count}</span>
                </div>
              ))}
            </div>
            <div className="teastats-alert">
              <div className="teastats-alert-content">
                <AlertCircle className="teastats-alert-icon" />
                <span className="teastats-alert-text">
                  Có {reviewStats[0].count} đơn phúc tra cần xử lý khẩn cấp
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="teastats-charts-grid">
          {/* Phân tích độ khó câu hỏi */}
          <div className="teastats-chart-card">
            <h3 className="teastats-chart-title">Phân tích độ khó câu hỏi</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={difficultyAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="questions" name="Số câu hỏi" />
                <YAxis dataKey="avgScore" name="Điểm TB" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Mức độ khó" data={difficultyAnalysis} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Phân tích thời gian làm bài */}
          <div className="teastats-chart-card">
            <h3 className="teastats-chart-title">Phân tích thời gian làm bài</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeRange" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="students" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Analysis Tables */}
        <div className="teastats-tables-grid">
          {/* Phân tích theo chủ đề */}
          <div className="teastats-chart-card">
            <h3 className="teastats-chart-title">Phân tích theo chủ đề</h3>
            <div className="teastats-table-container">
              <table className="teastats-table">
                <thead>
                  <tr className="teastats-table-header">
                    <th className="teastats-th-left">Chủ đề</th>
                    <th className="teastats-th-center">Số câu</th>
                    <th className="teastats-th-center">Điểm TB</th>
                    <th className="teastats-th-left">Điểm yếu</th>
                  </tr>
                </thead>
                <tbody>
                  {topicPerformance.map((topic, index) => (
                    <tr key={index} className="teastats-table-row">
                      <td className="teastats-td-bold">{topic.topic}</td>
                      <td className="teastats-td-center">{topic.totalQuestions}</td>
                      <td className="teastats-td-center">
                        <span className={`teastats-score-badge ${
                          topic.avgScore >= 7 ? 'teastats-score-good' : 
                          topic.avgScore >= 5 ? 'teastats-score-medium' : 
                          'teastats-score-poor'
                        }`}>
                          {topic.avgScore}
                        </span>
                      </td>
                      <td className="teastats-td-weak">{topic.weakestArea}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights và Khuyến nghị */}
          <div className="teastats-chart-card">
            <h3 className="teastats-chart-title">Insights và Khuyến nghị</h3>
            <div className="teastats-insights">
              <div className="teastats-insight teastats-insight-success">
                <div className="teastats-insight-header">
                  <CheckCircle className="teastats-insight-icon" />
                  <span className="teastats-insight-title">Điểm mạnh</span>
                </div>
                <p className="teastats-insight-text">
                  Học sinh làm bài trắc nghiệm rất tốt với điểm trung bình 7.8/10. 
                  Tỷ lệ đạt tăng 5% so với tháng trước.
                </p>
              </div>
              
              <div className="teastats-insight teastats-insight-warning">
                <div className="teastats-insight-header">
                  <AlertCircle className="teastats-insight-icon" />
                  <span className="teastats-insight-title">Cần cải thiện</span>
                </div>
                <p className="teastats-insight-text">
                  Câu hỏi tự luận và ứng dụng cần được tăng cường. 
                  Học sinh còn yếu ở phần hình học không gian và tích phân.
                </p>
              </div>
              
              <div className="teastats-insight teastats-insight-info">
                <div className="teastats-insight-header">
                  <TrendingUp className="teastats-insight-icon" />
                  <span className="teastats-insight-title">Khuyến nghị</span>
                </div>
                <ul className="teastats-recommendation-list">
                  <li>• Tăng số lượng câu hỏi tự luận trong các đề thi</li>
                  <li>• Tổ chức buổi ôn tập chuyên sâu về hình học không gian</li>
                  <li>• Xem xét giảm thời gian làm bài để cải thiện hiệu quả</li>
                  <li>• Ưu tiên xử lý 12 đơn phúc tra đang chờ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherStatistics;