import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, BookOpen, TrendingUp, Award, Calendar, UserCheck } from 'lucide-react';
import '../../../styles/admin/AdminStatistics.css';

const AdminStatistics = () => {
  // Dữ liệu mẫu cho số lượng kỳ thi theo giáo viên
  const teacherExamData = [
    { teacher: 'Nguyễn Văn A', exams: 12, subject: 'Toán' },
    { teacher: 'Trần Thị B', exams: 8, subject: 'Văn' },
    { teacher: 'Lê Văn C', exams: 15, subject: 'Anh' },
    { teacher: 'Phạm Thị D', exams: 6, subject: 'Lý' },
    { teacher: 'Hoàng Văn E', exams: 10, subject: 'Hóa' },
    { teacher: 'Vũ Thị F', exams: 9, subject: 'Sinh' }
  ];

  // Dữ liệu mẫu cho số học sinh tham gia mỗi kỳ thi
  const examParticipationData = [
    { exam: 'Kiểm tra Toán HK1', students: 45, date: '2024-10-15' },
    { exam: 'Thi Văn cuối kỳ', students: 38, date: '2024-10-20' },
    { exam: 'Test Anh văn', students: 52, date: '2024-10-25' },
    { exam: 'Kiểm tra Lý', students: 28, date: '2024-11-01' },
    { exam: 'Thi Hóa HK1', students: 41, date: '2024-11-05' },
    { exam: 'Kiểm tra Sinh', students: 35, date: '2024-11-10' }
  ];

  // Dữ liệu mẫu cho phân bố học sinh theo khối lớp
  const gradeDistributionData = [
    { grade: 'Khối 10', count: 89, percentage: 35 },
    { grade: 'Khối 11', count: 76, percentage: 30 },
    { grade: 'Khối 12', count: 89, percentage: 35 }
  ];

  // Dữ liệu mẫu cho phân bố học sinh giữa các kỳ thi
  const examGradeDistribution = [
    { exam: 'Kiểm tra Toán HK1', grade10: 15, grade11: 18, grade12: 12 },
    { exam: 'Thi Văn cuối kỳ', grade10: 12, grade11: 14, grade12: 12 },
    { exam: 'Test Anh văn', grade10: 20, grade11: 16, grade12: 16 },
    { exam: 'Kiểm tra Lý', grade10: 8, grade11: 12, grade12: 8 },
    { exam: 'Thi Hóa HK1', grade10: 14, grade11: 15, grade12: 12 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const [selectedInsight, setSelectedInsight] = useState('teachers');

  // Component thống kê tổng quan
  const StatsCard = ({ title, value, icon: Icon, trend, trendValue }) => (
    <div className="adstats-stats-card">
      <div className="adstats-stats-card-content">
        <div>
          <p className="adstats-stats-title">{title}</p>
          <p className="adstats-stats-value">{value}</p>
          {trend && (
            <div className={`adstats-stats-trend adstats-trend-${trend === 'up' ? 'up' : 'down'}`}>
              <TrendingUp className="adstats-trend-icon" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="adstats-stats-icon">
          <Icon className="adstats-icon" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="adstats-container">
      <div className="adstats-content">
        {/* Stats Cards */}
        <div className="adstats-stats-grid">
          <StatsCard
            title="Tổng số kỳ thi"
            value="64"
            icon={BookOpen}
            trend="up"
            trendValue="+12% tháng này"
          />
          <StatsCard
            title="Tổng học sinh tham gia"
            value="1,245"
            icon={Users}
            trend="up"
            trendValue="+8% tháng này"
          />
          <StatsCard
            title="Giáo viên hoạt động"
            value="28"
            icon={UserCheck}
            trend="up"
            trendValue="+3 giáo viên mới"
          />
          <StatsCard
            title="Kỳ thi trong tuần"
            value="12"
            icon={Calendar}
            trend="up"
            trendValue="+2 kỳ thi"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="adstats-nav-container">
          <div className="adstats-nav-tabs">
            <button
              onClick={() => setSelectedInsight('teachers')}
              className={`adstats-nav-tab ${selectedInsight === 'teachers' ? 'adstats-nav-tab-active' : ''}`}
            >
              Kỳ thi theo Giáo viên
            </button>
            <button
              onClick={() => setSelectedInsight('participation')}
              className={`adstats-nav-tab ${selectedInsight === 'participation' ? 'adstats-nav-tab-active' : ''}`}
            >
              Học sinh tham gia
            </button>
            <button
              onClick={() => setSelectedInsight('distribution')}
              className={`adstats-nav-tab ${selectedInsight === 'distribution' ? 'adstats-nav-tab-active' : ''}`}
            >
              Phân bố theo Khối
            </button>
          </div>
        </div>

        {/* Content based on selected insight */}
        {selectedInsight === 'teachers' && (
          <div className="adstats-section">
            <div className="adstats-card">
              <h2 className="adstats-section-title">
                <Award className="adstats-section-icon" />
                Số lượng kỳ thi theo Giáo viên
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={teacherExamData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="teacher" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="exams" 
                    fill="#3B82F6" 
                    name="Số kỳ thi"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Top Teachers Table */}
              <div className="adstats-table-section">
                <h3 className="adstats-table-title">Top Giáo viên Tích cực</h3>
                <div className="adstats-table-wrapper">
                  <table className="adstats-table">
                    <thead>
                      <tr className="adstats-table-header">
                        <th className="adstats-table-th">Giáo viên</th>
                        <th className="adstats-table-th">Môn học</th>
                        <th className="adstats-table-th">Số kỳ thi</th>
                        <th className="adstats-table-th">Đánh giá</th>
                      </tr>
                    </thead>
                    <tbody className="adstats-table-body">
                      {teacherExamData
                        .sort((a, b) => b.exams - a.exams)
                        .map((teacher, index) => (
                          <tr key={index} className="adstats-table-row">
                            <td className="adstats-table-td adstats-font-medium">
                              {teacher.teacher}
                            </td>
                            <td className="adstats-table-td adstats-text-gray">
                              {teacher.subject}
                            </td>
                            <td className="adstats-table-td">
                              {teacher.exams}
                            </td>
                            <td className="adstats-table-td">
                              <span className={`adstats-badge ${
                                teacher.exams >= 12 
                                  ? 'adstats-badge-green' 
                                  : teacher.exams >= 8 
                                    ? 'adstats-badge-yellow'
                                    : 'adstats-badge-red'
                              }`}>
                                {teacher.exams >= 12 ? 'Xuất sắc' : teacher.exams >= 8 ? 'Tốt' : 'Cần cải thiện'}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedInsight === 'participation' && (
          <div className="adstats-section">
            <div className="adstats-card">
              <h2 className="adstats-section-title">
                <Users className="adstats-section-icon" />
                Số học sinh tham gia mỗi kỳ thi
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={examParticipationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="exam" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    name="Số học sinh"
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Exam Performance Table */}
              <div className="adstats-table-section">
                <h3 className="adstats-table-title">Chi tiết Kỳ thi</h3>
                <div className="adstats-table-wrapper">
                  <table className="adstats-table">
                    <thead>
                      <tr className="adstats-table-header">
                        <th className="adstats-table-th">Tên kỳ thi</th>
                        <th className="adstats-table-th">Ngày thi</th>
                        <th className="adstats-table-th">Số học sinh</th>
                        <th className="adstats-table-th">Mức độ phổ biến</th>
                      </tr>
                    </thead>
                    <tbody className="adstats-table-body">
                      {examParticipationData
                        .sort((a, b) => b.students - a.students)
                        .map((exam, index) => (
                          <tr key={index} className="adstats-table-row">
                            <td className="adstats-table-td adstats-font-medium">
                              {exam.exam}
                            </td>
                            <td className="adstats-table-td adstats-text-gray">
                              {exam.date}
                            </td>
                            <td className="adstats-table-td">
                              {exam.students}
                            </td>
                            <td className="adstats-table-td">
                              <span className={`adstats-badge ${
                                exam.students >= 45 
                                  ? 'adstats-badge-green' 
                                  : exam.students >= 35 
                                    ? 'adstats-badge-yellow'
                                    : 'adstats-badge-red'
                              }`}>
                                {exam.students >= 45 ? 'Rất cao' : exam.students >= 35 ? 'Trung bình' : 'Cần quảng bá'}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedInsight === 'distribution' && (
          <div className="adstats-section">
            <div className="adstats-grid-2">
              <div className="adstats-card">
                <h2 className="adstats-card-title">
                  Phân bố tổng theo Khối lớp
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="adstats-card">
                <h2 className="adstats-card-title">
                  Thống kê theo Khối
                </h2>
                <div className="adstats-grade-stats">
                  {gradeDistributionData.map((grade, index) => (
                    <div key={index} className="adstats-grade-item">
                      <div className="adstats-grade-info">
                        <div 
                          className="adstats-color-dot"
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <span className="adstats-grade-name">{grade.grade}</span>
                      </div>
                      <div className="adstats-grade-numbers">
                        <div className="adstats-grade-count">{grade.count}</div>
                        <div className="adstats-grade-percentage">{grade.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="adstats-card">
              <h2 className="adstats-section-title">
                <TrendingUp className="adstats-section-icon" />
                Phân bố học sinh giữa các kỳ thi
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={examGradeDistribution} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="exam" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="grade10" stackId="a" fill="#3B82F6" name="Khối 10" />
                  <Bar dataKey="grade11" stackId="a" fill="#10B981" name="Khối 11" />
                  <Bar dataKey="grade12" stackId="a" fill="#F59E0B" name="Khối 12" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatistics;