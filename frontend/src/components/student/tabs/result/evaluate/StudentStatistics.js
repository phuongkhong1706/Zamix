import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Line, PolarArea, Radar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const ChartCard = ({ title, chart, insight }) => (
  <div style={{
    flex: '1 1 calc(50% - 24px)',
    margin: '12px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    minWidth: '320px',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e5e7eb'
  }}>
    <h3 style={{ 
      fontSize: '18px', 
      fontWeight: '600',
      textAlign: 'center', 
      marginBottom: '16px',
      color: '#1f2937'
    }}>{title}</h3>
    <div style={{ flexGrow: 1, minHeight: '250px' }}>
      {chart}
    </div>
    {insight && (
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#64748b',
        borderLeft: '4px solid #3b82f6'
      }}>
        <strong style={{ color: '#1e40af' }}>Nhận xét: </strong>{insight}
      </div>
    )}
  </div>
);

const StatCard = ({ title, value, subtitle, color = '#3b82f6', icon }) => (
  <div style={{
    flex: '1',
    margin: '8px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textAlign: 'center',
    border: `2px solid ${color}20`
  }}>
    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color, marginBottom: '4px' }}>
      {value}
    </div>
    <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
      {title}
    </div>
    <div style={{ fontSize: '12px', color: '#6b7280' }}>
      {subtitle}
    </div>
  </div>
);

function StudentStatistic() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Dữ liệu học tập thực tế qua các tháng
    const monthlyProgress = [
      { month: 'T9/2024', score: 6.5, effort: 65, homework: 70 },
      { month: 'T10/2024', score: 7.2, effort: 75, homework: 80 },
      { month: 'T11/2024', score: 7.8, effort: 80, homework: 85 },
      { month: 'T12/2024', score: 8.1, effort: 85, homework: 90 },
      { month: 'T1/2025', score: 8.5, effort: 88, homework: 92 },
      { month: 'T2/2025', score: 8.8, effort: 90, homework: 95 }
    ];

    // Phân tích năng lực theo chủ đề
    const subjectAnalysis = {
      labels: ['Đại số', 'Hình học', 'Giải tích', 'Xác suất', 'Lượng giác'],
      datasets: [{
        label: 'Điểm số',
        data: [8.5, 7.2, 9.1, 6.8, 8.0],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        fill: true
      }, {
        label: 'Trung bình lớp',
        data: [7.8, 7.5, 8.2, 7.1, 7.6],
        backgroundColor: 'rgba(239, 68, 68, 0.3)',
        borderColor: '#ef4444',
        borderWidth: 2,
        fill: true
      }]
    };

    // Xu hướng học tập
    const progressTrend = {
      labels: monthlyProgress.map(m => m.month),
      datasets: [
        {
          label: 'Điểm số',
          data: monthlyProgress.map(m => m.score),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Mức độ nỗ lực (%)',
          data: monthlyProgress.map(m => m.effort / 10),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Hoàn thành BTVN (%)',
          data: monthlyProgress.map(m => m.homework / 10),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };

    // Phân tích thời gian học
    const studyTime = {
      labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
      datasets: [{
        label: 'Giờ học (h)',
        data: [2.5, 3.0, 2.0, 3.5, 2.5, 1.5, 4.0],
        backgroundColor: [
          '#ef4444', '#f97316', '#eab308', '#22c55e', 
          '#06b6d4', '#3b82f6', '#8b5cf6'
        ]
      }]
    };

    // Hiệu quả học tập
    const studyEfficiency = {
      labels: ['Tập trung cao', 'Tập trung TB', 'Mất tập trung', 'Nghỉ giải lao'],
      datasets: [{
        label: 'Phần trăm thời gian',
        data: [45, 30, 15, 10],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280']
      }]
    };

    // So sánh với lớp
    const classComparison = {
      labels: ['Điểm TB', 'Thứ hạng', 'Tiến bộ', 'BTVN'],
      datasets: [
        {
          label: 'Học sinh',
          data: [85, 15, 88, 92],
          backgroundColor: 'rgba(59, 130, 246, 0.8)'
        },
        {
          label: 'TB Lớp',
          data: [78, 50, 65, 75],
          backgroundColor: 'rgba(156, 163, 175, 0.8)'
        }
      ]
    };

    // Mục tiêu và thành tích
    const achievements = {
      labels: ['Đã đạt', 'Chưa đạt'],
      datasets: [{
        data: [75, 25],
        backgroundColor: ['#10b981', '#e5e7eb'],
        borderWidth: 0
      }]
    };

    setChartData({
      subjectAnalysis,
      progressTrend,
      studyTime,
      studyEfficiency,
      classComparison,
      achievements,
      currentScore: 8.8,
      improvement: '+2.3',
      rank: 5,
      totalStudents: 35,
      studyHours: 19,
      completionRate: 92
    });
  }, []);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh', 
      padding: '20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            📊 Bảng Điều Khiển Học Tập
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280', fontSize: '14px' }}>
            <span>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          fontSize: '16px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <span style={{ fontWeight: '600' }}>
            👨‍🎓 <strong>Khổng Thị Hoài Phương</strong> - MSSV: <strong>HS104832</strong> - Lớp: <strong>12A1</strong>
          </span>
        </div>

        {/* Thống kê tổng quan */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <StatCard 
            title="Điểm TB Hiện Tại"
            value={chartData?.currentScore || 0}
            subtitle="Tăng so với tháng trước"
            color="#10b981"
            icon="📈"
          />
          <StatCard 
            title="Mức Cải Thiện"
            value={chartData?.improvement || 0}
            subtitle="Điểm trong 6 tháng"
            color="#3b82f6"
            icon="🎯"
          />
          <StatCard 
            title="Thứ Hạng Lớp"
            value={`${chartData?.rank || 0}/${chartData?.totalStudents || 0}`}
            subtitle="Xếp hạng hiện tại"
            color="#8b5cf6"
            icon="🏆"
          />
          <StatCard 
            title="Giờ Học/Tuần"
            value={chartData?.studyHours || 0}
            subtitle="Thời gian tự học"
            color="#f59e0b"
            icon="⏰"
          />
          <StatCard 
            title="Hoàn Thành BTVN"
            value={`${chartData?.completionRate || 0}%`}
            subtitle="Tỷ lệ làm bài tập"
            color="#ef4444"
            icon="✅"
          />
        </div>
      </div>

      {/* Biểu đồ chi tiết */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {chartData?.progressTrend && (
          <ChartCard 
            title="📈 Xu Hướng Tiến Bộ Theo Tháng" 
            chart={<Line data={chartData.progressTrend} options={{ maintainAspectRatio: false, responsive: true }} />}
            insight="Xu hướng học tập tích cực với sự cải thiện đều đặn. Điểm số tăng 2.3 điểm trong 6 tháng, đặc biệt nổi bật ở việc hoàn thành bài tập về nhà."
          />
        )}
        
        {chartData?.subjectAnalysis && (
          <ChartCard 
            title="🎯 Phân Tích Năng Lực Theo Chủ Đề" 
            chart={<Radar data={chartData.subjectAnalysis} options={{ maintainAspectRatio: false, responsive: true }} />}
            insight="Điểm mạnh: Giải tích (9.1) và Đại số (8.5). Cần cải thiện: Xác suất (6.8) và Hình học (7.2). Đề xuất: Tăng cường luyện tập Xác suất."
          />
        )}

        {chartData?.studyTime && (
          <ChartCard 
            title="📅 Phân Bổ Thời Gian Học Trong Tuần" 
            chart={<Bar data={chartData.studyTime} options={{ maintainAspectRatio: false, responsive: true }} />}
            insight="Học nhiều nhất vào Chủ nhật (4h) và Thứ 5 (3.5h). Thứ 7 học ít nhất (1.5h). Đề xuất: Cân bằng thời gian học đều hơn trong tuần."
          />
        )}

        {chartData?.classComparison && (
          <ChartCard 
            title="📊 So Sánh Với Trung Bình Lớp" 
            chart={<Bar data={chartData.classComparison} options={{ maintainAspectRatio: false, responsive: true }} />}
            insight="Vượt trội so với lớp ở tất cả tiêu chí. BTVN hoàn thành 92% (lớp 75%), tiến bộ 88% (lớp 65%). Duy trì phong độ tốt!"
          />
        )}

        {chartData?.studyEfficiency && (
          <ChartCard 
            title="⚡ Hiệu Quả Tập Trung Khi Học" 
            chart={<Doughnut data={chartData.studyEfficiency} options={{ maintainAspectRatio: false }} />}
            insight="Tập trung cao 45% thời gian học. Mất tập trung 15% - mức chấp nhận được. Đề xuất: Áp dụng kỹ thuật Pomodoro để tăng hiệu quả."
          />
        )}

        {chartData?.achievements && (
          <ChartCard 
            title="🎖️ Tỷ Lệ Đạt Mục Tiêu" 
            chart={<Doughnut data={chartData.achievements} options={{ maintainAspectRatio: false }} />}
            insight="Đã hoàn thành 75% mục tiêu đề ra. Còn 25% mục tiêu cần nỗ lực thêm. Tập trung vào việc cải thiện điểm Xác suất và Hình học."
          />
        )}
      </div>

      {/* Khuyến nghị */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
          💡 Khuyến Nghị Cải Thiện
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#dbeafe', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <strong style={{ color: '#1e40af' }}>📚 Học tập:</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Dành thêm 30 phút/ngày cho Xác suất và Hình học. Sử dụng phương pháp học qua hình ảnh và bài tập thực hành.</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#dcfce7', borderRadius: '8px', borderLeft: '4px solid #16a34a' }}>
            <strong style={{ color: '#15803d' }}>⏰ Thời gian:</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Cân bằng thời gian học trong tuần. Tăng thời gian học Thứ 7 lên 2.5h để đảm bảo ôn tập cuối tuần.</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #d97706' }}>
            <strong style={{ color: '#92400e' }}>🎯 Mục tiêu:</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Mục tiêu tháng tới: Đạt 9.0 điểm TB, Top 3 trong lớp, và 95% hoàn thành BTVN.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentStatistic;