import React, { useState } from "react";

function StudentPractice() {
  // 🔹 Dữ liệu mẫu
  const exams = [
    {
      id: 1,
      title: "Giải tích 1 - Giữa kỳ",
      duration: 45,
      total_questions: 20,
      topics: [
        "Đạo hàm và ứng dụng",
        "Hàm số lũy thừa, mũ và logarit",
        "Tích phân xác định",
      ],
      mock_tests: [
        { id: "1a", name: "Bài thi thử số 1" },
        { id: "1b", name: "Bài thi thử số 2" },
      ],
    },
    {
      id: 2,
      title: "Đại số tuyến tính - Cuối kỳ",
      duration: 60,
      total_questions: 25,
      topics: [
        "Ma trận và định thức",
        "Hệ phương trình tuyến tính",
        "Không gian vector",
      ],
      mock_tests: [
        { id: "2a", name: "Bài thi thử số 1" },
        { id: "2b", name: "Bài thi thử số 2" },
        { id: "2c", name: "Bài thi thử số 3" },
      ],
    },
  ];

  // 🔄 Trạng thái kỳ thi được chọn
  const [selectedExamId, setSelectedExamId] = useState(null);

  const handleExamClick = (examId) => {
    setSelectedExamId(prevId => (prevId === examId ? null : examId));
  };

  const selectedExam = exams.find((exam) => exam.id === selectedExamId);

  return (
    <div style={mainContentStyle}>
      <h2 style={headerStyle}>
        Bạn sắp tham gia {exams.length} kỳ thi
      </h2>
      <div style={containerStyle}>
        {/* Bên trái: Danh sách kỳ thi + submenu bài thi thử */}
        <div style={leftPanelStyle}>
          {exams.map((exam) => (
            <div key={exam.id} style={examCardStyle}>
              <div
                style={{ ...examTitleStyle, cursor: "pointer" }}
                onClick={() => handleExamClick(exam.id)}
              >
                📚 {exam.title}
              </div>
              {/* Nếu được chọn thì xổ ra các bài thi thử */}
              {selectedExamId === exam.id && (
                <div style={mockTestListStyle}>
                  {exam.mock_tests.map((mock) => (
                    <div key={mock.id} style={mockTestItemStyle}>
                      📝 {mock.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bên phải: Danh sách topics của kỳ thi */}
        <div style={rightPanelStyle}>
          {selectedExam ? (
            <>
              <h3 style={titleStyle}>{selectedExam.title}</h3>
              <p><strong>Tài liệu tham khảo:</strong></p>
              <div className="space-y-2">
                {selectedExam.topics.map((topic, index) => (
                  <div key={index} style={topicCardStyle}>
                    📘 {topic}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Hãy chọn một kỳ thi để xem chủ đề.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// 💅 CSS styles
const mainContentStyle = {
  padding: "20px",
  fontFamily: "Arial",
};

const headerStyle = {
  fontSize: "24px",
  marginBottom: "20px",
  fontWeight: "bold",
};

const containerStyle = {
  display: "flex",
  gap: "20px",
};

const leftPanelStyle = {
  flex: 1,
};

const rightPanelStyle = {
  flex: 2,
  backgroundColor: "#f5f8ff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
};

const examCardStyle = {
  backgroundColor: "#f5f8ff",
  borderRadius: "12px",
  padding: "15px",
  marginBottom: "15px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
};

const examTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
};

const mockTestListStyle = {
  marginTop: "10px",
  paddingLeft: "15px",
};

const mockTestItemStyle = {
  padding: "6px 0",
  fontSize: "16px",
};

const titleStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "12px",
};

const topicCardStyle = {
  backgroundColor: "#0b3d91",
  color: "white",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "10px",
  fontSize: "16px",
  fontWeight: "bold",
};

export default StudentPractice;
