import React, { useState } from 'react';
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
} from 'chart.js';

import { Pie, Doughnut, Bar, Line, PolarArea } from 'react-chartjs-2';

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
  RadialLinearScale
);

const TeachersData = [
  { id: 1, name: 'Khổng Thị Hoài Phương', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '17/6/2025', shift: 1, grade: 'Lớp 10', score: 8.5 },
  { id: 2, name: 'Trần Thị B', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '17/6/2025', shift: 2, grade: 'Lớp 11', score: 7.2 },
  { id: 3, name: 'Lê Văn C', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '5/3/2025', shift: 1, grade: 'Lớp 12', score: 6.8 },
  { id: 4, name: 'Phạm Thị D', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '18/6/2025', shift: 3, grade: 'Lớp 10', score: 9.1 },
  { id: 5, name: 'Hoàng Văn E', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '6/3/2025', shift: 2, grade: 'Lớp 11', score: 5.9 },
  { id: 6, name: 'Ngô Thị F', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '19/6/2025', shift: 1, grade: 'Lớp 12', score: 7.5 },
  { id: 7, name: 'Đặng Văn G', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '7/3/2025', shift: 3, grade: 'Lớp 10', score: 8.0 },
  { id: 8, name: 'Vũ Thị H', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '20/6/2025', shift: 2, grade: 'Lớp 11', score: 6.3 },
  { id: 9, name: 'Trịnh Văn I', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '8/3/2025', shift: 1, grade: 'Lớp 12', score: 7.8 },
  { id: 10, name: 'Bùi Thị K', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '21/6/2025', shift: 3, grade: 'Lớp 10', score: 8.7 },
  { id: 11, name: 'Phan Văn L', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '17/6/2025', shift: 1, grade: 'Lớp 11', score: 7.9 },
  { id: 12, name: 'Trương Thị M', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '5/3/2025', shift: 2, grade: 'Lớp 12', score: 6.4 },
  { id: 13, name: 'Lý Văn N', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '18/6/2025', shift: 3, grade: 'Lớp 10', score: 8.9 },
  { id: 14, name: 'Dương Thị O', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '6/3/2025', shift: 1, grade: 'Lớp 11', score: 5.5 },
  { id: 15, name: 'Lâm Văn P', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '19/6/2025', shift: 2, grade: 'Lớp 12', score: 7.2 },
  { id: 16, name: 'Mai Thị Q', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '7/3/2025', shift: 3, grade: 'Lớp 10', score: 7.7 },
  { id: 17, name: 'Phùng Văn R', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '20/6/2025', shift: 1, grade: 'Lớp 11', score: 6.0 },
  { id: 18, name: 'Nguyễn Thị S', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '8/3/2025', shift: 2, grade: 'Lớp 12', score: 8.1 },
  { id: 19, name: 'Hoàng Văn T', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '21/6/2025', shift: 3, grade: 'Lớp 10', score: 9.3 },
  { id: 20, name: 'Văn Thị U', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '17/6/2025', shift: 1, grade: 'Lớp 11', score: 7.1 },
  { id: 21, name: 'Trần Văn V', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '5/3/2025', shift: 2, grade: 'Lớp 12', score: 6.7 },
  { id: 22, name: 'Lê Thị W', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '18/6/2025', shift: 3, grade: 'Lớp 10', score: 8.3 },
  { id: 23, name: 'Phạm Văn X', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '6/3/2025', shift: 1, grade: 'Lớp 11', score: 5.7 },
  { id: 24, name: 'Ngô Thị Y', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '19/6/2025', shift: 2, grade: 'Lớp 12', score: 7.9 },
  { id: 25, name: 'Đặng Văn Z', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '7/3/2025', shift: 3, grade: 'Lớp 10', score: 8.4 },
  { id: 26, name: 'Vũ Thị AA', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '20/6/2025', shift: 1, grade: 'Lớp 11', score: 6.5 },
  { id: 27, name: 'Trịnh Văn BB', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '8/3/2025', shift: 2, grade: 'Lớp 12', score: 7.4 },
  { id: 28, name: 'Bùi Thị CC', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '21/6/2025', shift: 3, grade: 'Lớp 10', score: 9.0 },
  { id: 29, name: 'Phan Văn DD', exam: 'Kiểm tra Toán', examRound: 'Cuối kỳ', examDate: '17/6/2025', shift: 1, grade: 'Lớp 11', score: 7.6 },
  { id: 30, name: 'Trương Thị EE', exam: 'Kiểm tra Toán', examRound: 'Giữa kỳ', examDate: '5/3/2025', shift: 2, grade: 'Lớp 12', score: 6.9 },
];



const ChartCard = ({ title, chart }) => (
  <div
    style={{
      flex: '1 1 30%',
      margin: '12px',
      padding: '12px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      minWidth: '100px',
      maxWidth: '320px',
      height: '270px', // giảm chiều cao xuống còn 220px
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    }}
  >
    <h3 style={{ fontSize: '16px', textAlign: 'center', marginBottom: '12px', lineHeight: '1.2' }}>{title}</h3>
    <div style={{ flex: 1, overflow: 'hidden' }}>
      {chart}
    </div>
  </div>
);


function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div
      style={{
        width: '200px',
        background: '#f9fafb',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ marginBottom: '24px' }}>Đánh giá</h2>
      <div
        onClick={() => setActiveTab('info')}
        style={{
          padding: '10px 15px',
          cursor: 'pointer',
          backgroundColor: activeTab === 'info' ? '#3b82f6' : 'transparent',
          color: activeTab === 'info' ? 'white' : '#111827',
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      >
        Thông tin kỳ thi
      </div>
      <div
        onClick={() => setActiveTab('results')}
        style={{
          padding: '10px 15px',
          cursor: 'pointer',
          backgroundColor: activeTab === 'results' ? '#3b82f6' : 'transparent',
          color: activeTab === 'results' ? 'white' : '#111827',
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      >
        Kết quả thi
      </div>
    </div>
  );
}

function TeacherStatistic() {
  const [activeTab, setActiveTab] = useState('info');

  // Dữ liệu tính toán dựa trên TeachersData
  // Tab 1: Thông tin kỳ thi (tập trung vào phân phối ca thi, khối, ngày thi, đợt thi)
  const examShiftDistribution = {
    labels: ['Ca 1', 'Ca 2'],
    datasets: [
      {
        label: 'Số lượng học sinh',
        data: [
          TeachersData.filter((s) => s.shift === 1).length,
          TeachersData.filter((s) => s.shift === 2).length,
        ],
        backgroundColor: ['#3b82f6', '#60a5fa'],
      },
    ],
  };

  const gradeDistribution = {
    labels: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    datasets: [
      {
        label: 'Số lượng học sinh',
        data: [
          TeachersData.filter((s) => s.grade === 'Lớp 10').length,
          TeachersData.filter((s) => s.grade === 'Lớp 11').length,
          TeachersData.filter((s) => s.grade === 'Lớp 12').length,
        ],
        backgroundColor: ['#a78bfa', '#8b5cf6', '#7c3aed'],
      },
    ],
  };

  // Tính đếm học sinh theo ngày thi (ví dụ giả sử có nhiều ngày)
  const examDates = [...new Set(TeachersData.map((s) => s.examDate))];
  const examDateDistribution = {
    labels: examDates,
    datasets: [
      {
        label: 'Số học sinh thi',
        data: examDates.map((date) => TeachersData.filter((s) => s.examDate === date).length),
        backgroundColor: '#f87171',
      },
    ],
  };

  // Đợt thi phân phối
  const examRounds = [...new Set(TeachersData.map((s) => s.examRound))];
  const examRoundDistribution = {
    labels: examRounds,
    datasets: [
      {
        label: 'Số học sinh theo đợt',
        data: examRounds.map((r) => TeachersData.filter((s) => s.examRound === r).length),
        backgroundColor: ['#fbbf24', '#f59e0b'],
      },
    ],
  };

  // Pie chart phân phối theo kỳ thi (dữ liệu hiện tại chỉ có 1 kỳ)
  const examTypes = [...new Set(TeachersData.map((s) => s.exam))];
  const examTypeDistribution = {
    labels: examTypes,
    datasets: [
      {
        label: 'Số học sinh',
        data: examTypes.map((type) => TeachersData.filter((s) => s.exam === type).length),
        backgroundColor: ['#34d399'],
      },
    ],
  };

  // Bar chart phân phối theo tên học sinh (ví dụ: số lượng học sinh tương ứng - ít ý nghĩa nhưng demo)
  const TeacherNames = TeachersData.map((s) => s.name);
  const TeacherCount = TeachersData.map(() => 1);

  const TeacherNameDistribution = {
    labels: TeacherNames,
    datasets: [
      {
        label: 'Số lượng',
        data: TeacherCount,
        backgroundColor: '#60a5fa',
      },
    ],
  };

  // ---------------------------------------------------------
  // Tab 2: Kết quả thi (liên quan điểm số)

  // Điểm phân phối (ví dụ chia điểm thành nhóm: <5, 5-7, 7-9, >9)
  const scoreBinsLabels = ['<5', '5-7', '7-9', '9+'];
  const scoreBinsCount = [
    TeachersData.filter((s) => s.score < 5).length,
    TeachersData.filter((s) => s.score >= 5 && s.score < 7).length,
    TeachersData.filter((s) => s.score >= 7 && s.score < 9).length,
    TeachersData.filter((s) => s.score >= 9).length,
  ];
  const scoreDistribution = {
    labels: scoreBinsLabels,
    datasets: [
      {
        label: 'Số học sinh',
        data: scoreBinsCount,
        backgroundColor: ['#ef4444', '#fbbf24', '#34d399', '#10b981'],
      },
    ],
  };

  // Điểm trung bình theo khối
  const grades = [...new Set(TeachersData.map((s) => s.grade))];
  const avgScoreByGrade = grades.map((grade) => {
    const TeachersInGrade = TeachersData.filter((s) => s.grade === grade);
    if (TeachersInGrade.length === 0) return 0;
    return (
      TeachersInGrade.reduce((sum, s) => sum + s.score, 0) / TeachersInGrade.length
    ).toFixed(2);
  });
  const avgScoreGradeData = {
    labels: grades,
    datasets: [
      {
        label: 'Điểm trung bình',
        data: avgScoreByGrade,
        backgroundColor: '#3b82f6',
      },
    ],
  };

  // Điểm theo từng học sinh (Bar chart)
  const scoreByTeacher = {
    labels: TeacherNames,
    datasets: [
      {
        label: 'Điểm',
        data: TeachersData.map((s) => s.score),
        backgroundColor: '#f97316',
      },
    ],
  };

  // Điểm theo ca thi (Bar chart)
  const shifts = [...new Set(TeachersData.map((s) => s.shift))];
  const avgScoreByShift = shifts.map((shift) => {
    const TeachersInShift = TeachersData.filter((s) => s.shift === shift);
    if (TeachersInShift.length === 0) return 0;
    return (
      TeachersInShift.reduce((sum, s) => sum + s.score, 0) / TeachersInShift.length
    ).toFixed(2);
  });
  const avgScoreShiftData = {
    labels: shifts.map((s) => `Ca ${s}`),
    datasets: [
      {
        label: 'Điểm trung bình',
        data: avgScoreByShift,
        backgroundColor: '#2563eb',
      },
    ],
  };

  // Điểm theo ngày thi (Line chart)
  const avgScoreByDate = examDates.map((date) => {
    const TeachersOnDate = TeachersData.filter((s) => s.examDate === date);
    if (TeachersOnDate.length === 0) return 0;
    return (
      TeachersOnDate.reduce((sum, s) => sum + s.score, 0) / TeachersOnDate.length
    ).toFixed(2);
  });
  const avgScoreDateData = {
    labels: examDates,
    datasets: [
      {
        label: 'Điểm trung bình',
        data: avgScoreByDate,
        borderColor: '#059669',
        backgroundColor: '#bbf7d0',
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div
        style={{
          flex: 1,
          padding: '30px',
          background: '#f3f4f6',
          overflowY: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        {activeTab === 'info' && (
          <>
            <ChartCard
              title="Phân phối ca thi"
              chart={<Doughnut data={examShiftDistribution} />}
            />
            <ChartCard
              title="Phân phối khối"
              chart={<Bar data={gradeDistribution} />}
            />
            <ChartCard
              title="Số học sinh theo ngày thi"
              chart={<Bar data={examDateDistribution} />}
            />
            <ChartCard
              title="Số học sinh theo đợt thi"
              chart={<Pie data={examRoundDistribution} />}
            />
            <ChartCard
              title="Phân phối kỳ thi"
              chart={<PolarArea data={examTypeDistribution} />}
            />
            <ChartCard
              title="Số học sinh theo tên"
              chart={<Bar data={TeacherNameDistribution} options={{ indexAxis: 'y' }} />}
            />
          </>
        )}

        {activeTab === 'results' && (
          <>
            <ChartCard
              title="Phân phối điểm"
              chart={<Bar data={scoreDistribution} />}
            />
            <ChartCard
              title="Điểm trung bình theo khối"
              chart={<Bar data={avgScoreGradeData} />}
            />
            <ChartCard
              title="Điểm theo học sinh"
              chart={<Bar data={scoreByTeacher} options={{ indexAxis: 'y' }} />}
            />
            <ChartCard
              title="Điểm trung bình theo ca thi"
              chart={<Bar data={avgScoreShiftData} />}
            />
            <ChartCard
              title="Điểm trung bình theo ngày thi"
              chart={<Line data={avgScoreDateData} />}
            />
            <ChartCard
              title="Tỉ lệ điểm theo khối"
              chart={
                <Pie
                  data={{
                    labels: grades,
                    datasets: [
                      {
                        label: 'Tỉ lệ điểm trung bình',
                        data: avgScoreByGrade,
                        backgroundColor: ['#a78bfa', '#8b5cf6', '#7c3aed'],
                      },
                    ],
                  }}
                />
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherStatistic;
