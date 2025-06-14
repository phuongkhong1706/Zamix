import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, Trophy, TrendingUp, Calendar, Target, Clock, FileText, Award } from 'lucide-react';
import '../../../../../styles/student/StudentStatistics.css';
const StudentStatistics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dữ liệu mẫu dựa trên cấu trúc database
  const studentData = {
    profile: {
      student_id: 'SV001',
      student_code: 'HS2024001',
      full_name: 'Nguyễn Văn An',
      grade: '12A1'
    },
    
    // Thống kê tổng quan
    overviewStats: {
      totalExams: 15,
      totalTests: 28,
      documentsRead: 45,
      averageScore: 7.8,
      bestScore: 9.5,
      totalStudyTime: 120 // hours
    },

    // Kết quả các kỳ thi chính thức
    examResults: [
      { exam_name: 'Kiểm tra giữa kỳ 1', score: 8.5, date: '2024-10-15', status: 'completed' },
      { exam_name: 'Kiểm tra cuối kỳ 1', score: 7.8, date: '2024-12-20', status: 'completed' },
      { exam_name: 'Kiểm tra giữa kỳ 2', score: 8.2, date: '2024-03-15', status: 'completed' },
      { exam_name: 'Thi thử THPT QG lần 1', score: 6.8, date: '2024-04-20', status: 'completed' },
      { exam_name: 'Thi thử THPT QG lần 2', score: 7.5, date: '2024-05-15', status: 'completed' }
    ],

    // Kết quả luyện tập (bài thi thử)
    practiceResults: [
      { test_name: 'Đại số - Bài 1', score: 7.0, duration: 45, date: '2024-01-10', topic: 'Đại số' },
      { test_name: 'Hình học - Bài 1', score: 8.5, duration: 60, date: '2024-01-12', topic: 'Hình học' },
      { test_name: 'Giải tích - Bài 1', score: 6.5, duration: 50, date: '2024-01-15', topic: 'Giải tích' },
      { test_name: 'Đại số - Bài 2', score: 8.0, duration: 45, date: '2024-01-18', topic: 'Đại số' },
      { test_name: 'Hình học - Bài 2', score: 9.0, duration: 55, date: '2024-01-20', topic: 'Hình học' },
      { test_name: 'Giải tích - Bài 2', score: 7.5, duration: 48, date: '2024-01-25', topic: 'Giải tích' },
      { test_name: 'Tổng hợp - Bài 1', score: 8.2, duration: 90, date: '2024-02-01', topic: 'Tổng hợp' }
    ],

    // Tài liệu đã đọc
    documentsRead: [
      { doc_name: 'Lý thuyết Đại số nâng cao', topic: 'Đại số', date: '2024-01-05' },
      { doc_name: 'Bài tập Hình học không gian', topic: 'Hình học', date: '2024-01-08' },
      { doc_name: 'Công thức Giải tích 12', topic: 'Giải tích', date: '2024-01-12' },
      { doc_name: 'Đề thi mẫu THPT QG', topic: 'Tổng hợp', date: '2024-01-20' }
    ],

    // Thống kê theo chủ đề
    topicStats: [
      { topic: 'Đại số', practiceCount: 8, avgScore: 7.5, documentsRead: 12 },
      { topic: 'Hình học', practiceCount: 10, avgScore: 8.2, documentsRead: 15 },
      { topic: 'Giải tích', practiceCount: 6, avgScore: 7.0, documentsRead: 10 },
      { topic: 'Tổng hợp', practiceCount: 4, avgScore: 8.0, documentsRead: 8 }
    ],

    // Tiến độ theo thời gian
    progressData: [
      { month: 'T1', practiceScore: 6.5, examScore: 0, studyHours: 15 },
      { month: 'T2', practiceScore: 7.2, examScore: 0, studyHours: 18 },
      { month: 'T3', practiceScore: 7.8, examScore: 8.2, studyHours: 22 },
      { month: 'T4', practiceScore: 8.1, examScore: 6.8, studyHours: 25 },
      { month: 'T5', practiceScore: 8.3, examScore: 7.5, studyHours: 20 },
      { month: 'T6', practiceScore: 8.5, examScore: 0, studyHours: 18 }
    ]
  };

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const StatCard = ({ icon: Icon, title, value, subtitle }) => (
    <div className="stustats-stat-card">
      <div className="stustats-stat-card-content">
        <div className="stustats-stat-info">
          <p className="stustats-stat-title">{title}</p>
          <p className="stustats-stat-value">{value}</p>
          {subtitle && <p className="stustats-stat-subtitle">{subtitle}</p>}
        </div>
        <Icon className="stustats-stat-icon" />
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="stustats-section">
      {/* Thống kê tổng quan */}
      <div className="stustats-grid-4">
        <StatCard 
          icon={Trophy} 
          title="Tổng số kỳ thi" 
          value={studentData.overviewStats.totalExams}
          subtitle="Đã hoàn thành"
        />
        <StatCard 
          icon={Target} 
          title="Bài luyện tập" 
          value={studentData.overviewStats.totalTests}
          subtitle="Đã thực hiện"
        />
        <StatCard 
          icon={BookOpen} 
          title="Tài liệu đã đọc" 
          value={studentData.overviewStats.documentsRead}
          subtitle="Chủ đề khác nhau"
        />
        <StatCard 
          icon={Clock} 
          title="Thời gian học" 
          value={`${studentData.overviewStats.totalStudyTime}h`}
          subtitle="Tổng thời gian"
        />
      </div>

      {/* Điểm số trung bình */}
      <div className="stustats-grid-3">
        <StatCard 
          icon={Award} 
          title="Điểm TB" 
          value={studentData.overviewStats.averageScore}
          subtitle="Tất cả bài thi"
        />
        <StatCard 
          icon={TrendingUp} 
          title="Điểm cao nhất" 
          value={studentData.overviewStats.bestScore}
          subtitle="Thành tích tốt nhất"
        />
        <StatCard 
          icon={Calendar} 
          title="Hoạt động gần đây" 
          value="5 ngày"
          subtitle="Lần cuối luyện tập"
        />
      </div>

      {/* Biểu đồ tiến độ */}
      <div className="stustats-chart-container">
        <h3 className="stustats-chart-title">Tiến độ học tập theo thời gian</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={studentData.progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="practiceScore" stroke="#8884d8" name="Điểm luyện tập" />
            <Line type="monotone" dataKey="examScore" stroke="#82ca9d" name="Điểm thi chính thức" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderExamResults = () => (
    <div className="stustats-section">
      <div className="stustats-table-container">
        <h3 className="stustats-table-title">Kết quả các kỳ thi chính thức</h3>
        <div className="stustats-table-wrapper">
          <table className="stustats-table">
            <thead className="stustats-table-header">
              <tr>
                <th className="stustats-table-th">Tên kỳ thi</th>
                <th className="stustats-table-th">Điểm số</th>
                <th className="stustats-table-th">Ngày thi</th>
                <th className="stustats-table-th">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="stustats-table-body">
              {studentData.examResults.map((exam, index) => (
                <tr key={index} className="stustats-table-row">
                  <td className="stustats-table-cell stustats-table-cell-name">
                    {exam.exam_name}
                  </td>
                  <td className="stustats-table-cell">
                    <span className={`stustats-badge ${
                      exam.score >= 8 ? 'stustats-badge-green' :
                      exam.score >= 6.5 ? 'stustats-badge-yellow' :
                      'stustats-badge-red'
                    }`}>
                      {exam.score}
                    </span>
                  </td>
                  <td className="stustats-table-cell stustats-table-cell-date">
                    {new Date(exam.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="stustats-table-cell">
                    <span className="stustats-badge stustats-badge-success">
                      Hoàn thành
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="stustats-chart-container">
        <h3 className="stustats-chart-title">Biểu đồ điểm số các kỳ thi</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studentData.examResults}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="exam_name" angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Bar dataKey="score" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPracticeResults = () => (
    <div className="stustats-section">
      <div className="stustats-table-container">
        <h3 className="stustats-table-title">Kết quả luyện tập</h3>
        <div className="stustats-table-wrapper">
          <table className="stustats-table">
            <thead className="stustats-table-header">
              <tr>
                <th className="stustats-table-th">Tên bài thi</th>
                <th className="stustats-table-th">Chủ đề</th>
                <th className="stustats-table-th">Điểm số</th>
                <th className="stustats-table-th">Thời gian (phút)</th>
                <th className="stustats-table-th">Ngày làm</th>
              </tr>
            </thead>
            <tbody className="stustats-table-body">
              {studentData.practiceResults.map((test, index) => (
                <tr key={index} className="stustats-table-row">
                  <td className="stustats-table-cell stustats-table-cell-name">
                    {test.test_name}
                  </td>
                  <td className="stustats-table-cell">
                    <span className="stustats-badge stustats-badge-blue">
                      {test.topic}
                    </span>
                  </td>
                  <td className="stustats-table-cell">
                    <span className={`stustats-badge ${
                      test.score >= 8 ? 'stustats-badge-green' :
                      test.score >= 6.5 ? 'stustats-badge-yellow' :
                      'stustats-badge-red'
                    }`}>
                      {test.score}
                    </span>
                  </td>
                  <td className="stustats-table-cell stustats-table-cell-date">
                    {test.duration}
                  </td>
                  <td className="stustats-table-cell stustats-table-cell-date">
                    {new Date(test.date).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="stustats-chart-container">
        <h3 className="stustats-chart-title">Tiến bộ điểm số luyện tập</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={studentData.practiceResults}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="test_name" angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderTopicAnalysis = () => (
    <div className="stustats-section">
      <div className="stustats-chart-container">
        <h3 className="stustats-chart-title">Thống kê theo chủ đề</h3>
        <div className="stustats-grid-2">
          <div>
            <h4 className="stustats-subchart-title">Điểm trung bình theo chủ đề</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={studentData.topicStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="stustats-subchart-title">Số lượng bài luyện tập</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={studentData.topicStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({topic, practiceCount}) => `${topic}: ${practiceCount}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="practiceCount"
                >
                  {studentData.topicStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="stustats-topic-details">
        <h3 className="stustats-table-title">Chi tiết thống kê chủ đề</h3>
        <div className="stustats-grid-4">
          {studentData.topicStats.map((topic, index) => (
            <div key={index} className="stustats-topic-card">
              <h4 className="stustats-topic-title" style={{color: COLORS[index % COLORS.length]}}>
                {topic.topic}
              </h4>
              <div className="stustats-topic-stats">
                <div className="stustats-topic-stat">
                  <span>Bài luyện tập:</span>
                  <span className="stustats-topic-stat-value">{topic.practiceCount}</span>
                </div>
                <div className="stustats-topic-stat">
                  <span>Điểm TB:</span>
                  <span className="stustats-topic-stat-value">{topic.avgScore}</span>
                </div>
                <div className="stustats-topic-stat">
                  <span>Tài liệu đọc:</span>
                  <span className="stustats-topic-stat-value">{topic.documentsRead}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="stustats-documents-container">
      <h3 className="stustats-table-title">Tài liệu đã học</h3>
      <div className="stustats-grid-3">
        {studentData.documentsRead.map((doc, index) => (
          <div key={index} className="stustats-document-card">
            <div className="stustats-document-content">
              <FileText className="stustats-document-icon" />
              <div className="stustats-document-info">
                <h4 className="stustats-document-title">{doc.doc_name}</h4>
                <p className="stustats-document-topic">
                  Chủ đề: {doc.topic}
                </p>
                <p className="stustats-document-date">
                  {new Date(doc.date).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="stustats-container">
      {/* Header */}
      <div className="stustats-header">
        <div className="stustats-header-content">
          <div className="stustats-profile">
            <div className="stustats-avatar">
              <span className="stustats-avatar-text">
                {studentData.profile.full_name.charAt(0)}
              </span>
            </div>
            <div className="stustats-profile-info">
              <h1 className="stustats-profile-name">
                {studentData.profile.full_name}
              </h1>
              <p className="stustats-profile-details">
                {studentData.profile.student_code} - Lớp {studentData.profile.grade}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="stustats-nav-container">
        <div className="stustats-nav-border">
          <nav className="stustats-nav">
            {[
              { id: 'overview', name: 'Tổng quan', icon: TrendingUp },
              { id: 'exams', name: 'Kết quả thi', icon: Trophy },
              { id: 'practice', name: 'Luyện tập', icon: Target },
              { id: 'topics', name: 'Phân tích chủ đề', icon: BookOpen },
              { id: 'documents', name: 'Tài liệu', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`stustats-tab ${activeTab === tab.id ? 'stustats-tab-active' : ''}`}
              >
                <tab.icon className="stustats-tab-icon" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="stustats-main">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'exams' && renderExamResults()}
        {activeTab === 'practice' && renderPracticeResults()}
        {activeTab === 'topics' && renderTopicAnalysis()}
        {activeTab === 'documents' && renderDocuments()}
      </div>
    </div>
  );
};

export default StudentStatistics;