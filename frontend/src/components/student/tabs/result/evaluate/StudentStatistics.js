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

const ChartCard = ({ title, chart }) => (
  <div style={{
    flex: '1 1 20%',
    margin: '12px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    minWidth: '280px',
  }}>
    <h3 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '16px' }}>{title}</h3>
    {chart}
  </div>
);

function StudentStatistic() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Dữ liệu giả lập
    const fakeData = {
      solvedRate: {
        labels: ['Đã giải', 'Chưa giải'],
        datasets: [{
          data: [60, 40],
          backgroundColor: ['#34d399', '#f87171']
        }]
      },
      tagCount: {
        labels: ['Toán', 'Lý', 'Hóa', 'Tin', 'Anh'],
        datasets: [{
          label: 'Số lượng',
          data: [12, 18, 7, 10, 15],
          backgroundColor: '#818cf8'
        }]
      },
      rewardDistribution: {
        labels: ['0', '1-50', '51-100', '101-200', '200+'],
        datasets: [{
          label: 'Giá trị thưởng',
          data: [20, 15, 10, 8, 3],
          backgroundColor: ['#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309']
        }]
      },
      timeTrend: {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        datasets: [{
          label: 'Số câu hỏi',
          data: [5, 9, 6, 11],
          borderColor: '#3b82f6',
          backgroundColor: '#bfdbfe',
          tension: 0.4
        }]
      },
      topStudents: {
        labels: ['Nam', 'Hà', 'Phúc', 'Linh', 'Thảo'],
        datasets: [{
          label: 'Số câu đã hỏi',
          data: [14, 12, 10, 9, 7],
          backgroundColor: '#f472b6'
        }]
      },
      solvedOverTime: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5'],
        datasets: [{
          label: 'Tỉ lệ giải quyết',
          data: [30, 45, 50, 60, 75],
          borderColor: '#10b981',
          backgroundColor: '#a7f3d0',
          tension: 0.3
        }]
      }
    };

    setChartData(fakeData);
  }, []);

  return (
    <div style={{
      background: '#f3f4f6',
      minHeight: '100vh',
      padding: '30px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {chartData.solvedRate && <ChartCard title="Tỉ lệ câu hỏi đã giải" chart={<Doughnut data={chartData.solvedRate} />} />}
        {chartData.tagCount && <ChartCard title="Chuyên mục câu hỏi" chart={<Bar data={chartData.tagCount} />} />}
        {chartData.rewardDistribution && <ChartCard title="Phân phối giải thưởng" chart={<PolarArea data={chartData.rewardDistribution} />} />}
        {chartData.timeTrend && <ChartCard title="Câu hỏi theo thời gian" chart={<Line data={chartData.timeTrend} />} />}
        {chartData.topStudents && <ChartCard title="Top học sinh hỏi nhiều" chart={<Bar data={chartData.topStudents} options={{ indexAxis: 'y' }} />} />}
        {chartData.solvedOverTime && <ChartCard title="Tỉ lệ giải quyết theo thời gian" chart={<Line data={chartData.solvedOverTime} />} />}
      </div>
    </div>
  );
}

export default StudentStatistic;
