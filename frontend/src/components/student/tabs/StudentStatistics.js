import React from "react";
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell} from "recharts";

const examData = [
  { id: 1, name: "Giữa kỳ 1", date: "2024-10-01", score: 6.5 },
  { id: 2, name: "Cuối kỳ 1", date: "2024-12-10", score: 7.2 },
  { id: 3, name: "Giữa kỳ 2", date: "2025-03-05", score: 8.1 },
  { id: 4, name: "Cuối kỳ 2", date: "2025-05-01", score: 7.8 },
];

const topicAccuracy = [
  { name: "Giải tích", value: 80 },
  { name: "Đại số", value: 65 },
  { name: "Xác suất", value: 75 },
  { name: "Hình học", value: 60 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export default function StudentStatistics() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thống kê kết quả môn Toán</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biểu đồ điểm theo thời gian */}
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">Điểm qua các kỳ thi</h2>
          <LineChart width={400} height={250} data={examData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Biểu đồ dạng bài */}
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">Hiệu suất theo chủ đề</h2>
          <PieChart width={400} height={250}>
            <Pie
              data={topicAccuracy}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {topicAccuracy.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Bảng chi tiết các kỳ thi */}
      <div className="bg-white shadow p-4 rounded-xl mt-6">
        <h2 className="text-lg font-semibold mb-2">Chi tiết bài thi</h2>
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Kỳ thi</th>
              <th className="p-2">Ngày thi</th>
              <th className="p-2">Điểm</th>
              <th className="p-2">Đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {examData.map((exam) => (
              <tr key={exam.id} className="border-t">
                <td className="p-2">{exam.name}</td>
                <td className="p-2">{exam.date}</td>
                <td className="p-2">{exam.score}</td>
                <td className="p-2">
                  {exam.score >= 8
                    ? "Tốt"
                    : exam.score >= 6.5
                    ? "Đạt"
                    : "Cần cải thiện"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
