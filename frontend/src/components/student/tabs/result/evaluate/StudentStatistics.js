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
  RadialLinearScale
} from 'chart.js';
import { Doughnut, Bar, Line, PolarArea } from 'react-chartjs-2';

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

const ChartCard = ({ title, chart }) => (
  <div style={{
    flex: '1 1 calc(33.33% - 24px)',
    margin: '12px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    minWidth: '280px',
    maxWidth: '360px',
    height: '320px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }}>
    <h3 style={{ fontSize: '16px', textAlign: 'center', marginBottom: '12px' }}>{title}</h3>
    <div style={{ flexGrow: 1 }}>
      {chart}
    </div>
  </div>
);

function StudentStatistic() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const examScores = [
      { id: 1, examTitle: "Toán giữa kỳ 1", semester: "Giữa kỳ", examDate: "2025-03-10", slot: "1", score: 9.1, grade: "12" },
      { id: 2, examTitle: "Toán giữa kỳ 2", semester: "Giữa kỳ", examDate: "2025-03-11", slot: "2", score: 8.3, grade: "12" },
      { id: 3, examTitle: "Toán cuối kỳ 1", semester: "Cuối kỳ", examDate: "2025-06-18", slot: "3", score: 7.8, grade: "12" },
      { id: 4, examTitle: "Toán cuối kỳ 2", semester: "Cuối kỳ", examDate: "2025-07-18", slot: "3", score: 7.8, grade: "12" },
    ];

    const labels = examScores.map(score => score.examTitle);
    const data = examScores.map(score => score.score);
    const colors = ['#60a5fa', '#f472b6', '#34d399', '#facc15'];

    const mathScoreLine = {
      labels,
      datasets: [{
        label: 'Điểm Toán',
        data,
        borderColor: '#3b82f6',
        backgroundColor: '#bfdbfe',
        tension: 0.4,
      }]
    };

    const mathScoreBar = {
      labels,
      datasets: [{
        label: 'Điểm Toán',
        data,
        backgroundColor: colors,
      }]
    };

    const scoreDistribution = {
      labels: ['9-10', '8-9', '7-8', '<7'],
      datasets: [{
        label: 'Phân phối điểm',
        data: [1, 1, 2, 0],
        backgroundColor: ['#34d399', '#60a5fa', '#facc15', '#f87171'],
      }]
    };

    const averageScore = data.reduce((a, b) => a + b, 0) / data.length;

    const averageData = {
      labels: ['Điểm TB'],
      datasets: [{
        label: 'Điểm trung bình',
        data: [averageScore],
        backgroundColor: ['#fbbf24'],
      }]
    };

    const highLowScoreData = {
      labels: ['Cao nhất', 'Thấp nhất'],
      datasets: [{
        label: 'So sánh điểm',
        data: [Math.max(...data), Math.min(...data)],
        backgroundColor: ['#16a34a', '#dc2626'],
      }]
    };

    const semesterDistribution = {
      labels: ['Giữa kỳ', 'Cuối kỳ'],
      datasets: [{
        label: 'Số bài kiểm tra',
        data: [2, 2],
        backgroundColor: ['#6366f1', '#ec4899'],
      }]
    };

    setChartData({
      mathScoreLine,
      mathScoreBar,
      scoreDistribution,
      averageData,
      highLowScoreData,
      semesterDistribution,
    });
  }, []);

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px', fontWeight: 'bold' }}>
          📊&nbsp;Kết quả học tập
        </div>
        <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
          🕒
          <span style={{ marginLeft: '8px' }}>{new Date().toLocaleString()}</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '16px',
        fontSize: '16px',
        flexWrap: 'wrap',
        gap: '8px',
        lineHeight: '1.5'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          Học sinh: <strong style={{ marginLeft: '4px' }}>Khổng Thị Hoài Phương</strong>
        </span>
        <span>|</span>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          MSSV: <strong style={{ marginLeft: '4px' }}>HS104832</strong>
        </span>
        <span>|</span>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          Lớp:
          <select style={{ marginLeft: '8px', padding: '4px 8px', fontSize: '16px' }}>
            <option>10</option>
            <option>11</option>
            <option selected>12</option>
          </select>
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {chartData?.semesterDistribution && (
          <ChartCard title="Kỳ thi" chart={
            <Doughnut data={chartData.semesterDistribution} options={{ maintainAspectRatio: false }} />
          } />
        )}
        {chartData?.scoreDistribution && (
          <ChartCard title="Phân phối điểm" chart={
            <PolarArea data={chartData.scoreDistribution} options={{ maintainAspectRatio: false }} />
          } />
        )}
        {chartData?.mathScoreBar && (
          <ChartCard title="Biểu đồ cột điểm Toán" chart={
            <Bar data={chartData.mathScoreBar} options={{ maintainAspectRatio: false }} />
          } />
        )}
        {chartData?.mathScoreLine && (
          <ChartCard title="Điểm Toán theo thời gian" chart={
            <Line data={chartData.mathScoreLine} options={{ maintainAspectRatio: false }} />
          } />
        )}
        {chartData?.averageData && (
          <ChartCard title="Điểm trung bình" chart={
            <Bar data={chartData.averageData} options={{ maintainAspectRatio: false }} />
          } />
        )}
        {chartData?.highLowScoreData && (
          <ChartCard title="Điểm cao nhất & thấp nhất" chart={
            <Bar data={chartData.highLowScoreData} options={{ maintainAspectRatio: false }} />
          } />
        )}
      </div>
    </div>
  );
}

export default StudentStatistic;
