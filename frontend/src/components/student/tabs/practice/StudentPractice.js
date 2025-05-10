import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMinus } from "react-icons/fi";

function StudentPractice() {
  const navigate = useNavigate();

  const exams = [
    {
      id: 1,
      title: "Giải tích 1 - Giữa kỳ",
      duration: 45,
      total_questions: 20,
      topics: [
        {
          name: "Đạo hàm và ứng dụng",
          lessons: [
            { id: "1a1", title: "Bài 1: Định nghĩa đạo hàm" },
            { id: "1a2", title: "Bài 2: Quy tắc đạo hàm" },
          ],
        },
        {
          name: "Hàm số lũy thừa, mũ và logarit",
          lessons: [
            { id: "1b1", title: "Bài 1: Hàm số mũ" },
            { id: "1b2", title: "Bài 2: Hàm số logarit" },
          ],
        },
        {
          name: "Tích phân xác định",
          lessons: [
            { id: "1c1", title: "Bài 1: Định nghĩa tích phân" },
            { id: "1c2", title: "Bài 2: Tính tích phân" },
          ],
        },
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
        {
          name: "Ma trận và định thức",
          lessons: [
            { id: "2a1", title: "Bài 1: Ma trận cơ bản" },
            { id: "2a2", title: "Bài 2: Định thức và tính chất" },
          ],
        },
        {
          name: "Hệ phương trình tuyến tính",
          lessons: [
            { id: "2b1", title: "Bài 1: Phương pháp thế" },
            { id: "2b2", title: "Bài 2: Phương pháp Gauss" },
          ],
        },
        {
          name: "Không gian vector",
          lessons: [
            { id: "2c1", title: "Bài 1: Định nghĩa vector" },
            { id: "2c2", title: "Bài 2: Tổ hợp tuyến tính" },
          ],
        },
      ],
      mock_tests: [
        { id: "2a", name: "Bài thi thử số 1" },
        { id: "2b", name: "Bài thi thử số 2" },
        { id: "2c", name: "Bài thi thử số 3" },
      ],
    },
  ];

  const [selectedExamId, setSelectedExamId] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  
  const handleExamClick = (examId) => {
    setSelectedExamId((prevId) => (prevId === examId ? null : examId));
  };

  const handleMockTestClick = (mockTestId) => {
    navigate(`/student/practice/verify_practice`);
  };

  const handleTopicClick = (topicName) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicName]: !prev[topicName],
    }));
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/student/practice/lesson/${lessonId}`);
  };

  const selectedExam = exams.find((exam) => exam.id === selectedExamId);

  return (
    <div style={mainContentStyle}>
      <h2 style={headerStyle}>Bạn sắp tham gia {exams.length} kỳ thi</h2>
      <div style={containerStyle}>
        <div style={leftPanelStyle}>
          {exams.map((exam) => (
            <div key={exam.id} style={examCardStyle}>
              <div
                style={{ ...examTitleStyle, cursor: "pointer" }}
                onClick={() => handleExamClick(exam.id)}
              >
                📚 {exam.title}
              </div>
              {selectedExamId === exam.id && (
                <div style={mockTestListStyle}>
                  {exam.mock_tests.map((mock) => (
                    <div
                      key={mock.id}
                      style={mockTestLinkContainerStyle}
                      onClick={() => handleMockTestClick(mock.id)}
                    >
                      <span>📝</span>
                      <span style={mockTestLinkStyle}>{mock.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={rightPanelStyle}>
          {selectedExam ? (
            <>
              <h3 style={titleStyle}>{selectedExam.title}</h3>
              <p style={{ color: "#003366" }}>
                <strong>TÀI LIỆU THAM KHẢO</strong>
              </p>

              <div className="space-y-2">
                {selectedExam.topics.map((topic, index) => (
                  <div key={index}>
                    <div
                      style={{
                        ...topicCardStyle,
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleTopicClick(topic.name)}
                    >
                      <span style={{ marginRight: "8px", color: "#003366", fontSize: "20px" }}>
                        {expandedTopics[topic.name] ? <FiMinus /> : <FiPlus />}
                      </span>
                      {topic.name}
                    </div>

                    {expandedTopics[topic.name] && (
                      <div style={{ paddingLeft: "20px" }}>
                        {topic.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            style={{
                              ...lessonLinkStyle,
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => handleLessonClick(lesson.id)}
                          >
                            <span style={{ textDecoration: "underline", color: "#0b3d91" }}>
                              {lesson.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                ))}
              </div>
            </>
          ) : (
            <p style={{ fontWeight: "bold", color: "#003366" }}>
              Hãy chọn một kỳ thi để xem tài liệu tham khảo tương ứng.
            </p>
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

const mockTestLinkContainerStyle = {
  marginBottom: "10px",
  cursor: "pointer",
};

const mockTestLinkStyle = {
  color: "#0b3d91",
  textDecoration: "underline",
  fontSize: "16px",
};

const topicCardStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "12px",
  cursor: "pointer",
};

const lessonLinkStyle = {
  fontSize: "15px",
  marginBottom: "8px",
  cursor: "pointer",
  color: "#0055aa",
  textDecoration: "underline",
};

const titleStyle = {
  backgroundColor: "#0b3d91",
  color: "white",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "10px",
  fontSize: "18px",
  fontWeight: "bold",
};

export default StudentPractice;
