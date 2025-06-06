import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMinus } from "react-icons/fi";

function StudentPractice() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/api/student/student_practice/student_manage_practice/")
      .then((response) => {
        if (!response.ok) throw new Error("Lỗi khi gọi API");
        return response.json();
      })
      .then((data) => {
        console.log("✅ Dữ liệu nhận được từ API:", data);
        setExams(data);
      })
      .catch((error) => {
        console.error("❌ Lỗi khi fetch dữ liệu:", error);
      });
  }, []);

  const handleExamClick = (examId) => {
    setSelectedExamId((prevId) => (prevId === examId ? null : examId));
  };

  const handleMockTestClick = (mockTestId) => {
    navigate(`/student/practice/verify_practice`);
  };

  const handleTopicClick = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const selectedExam = exams.find((exam) => exam.exam_id === selectedExamId);

  return (
    <div style={mainContentStyle}>
      <h2 style={headerStyle}>Bạn sắp tham gia {exams.length} kỳ thi</h2>
      <div style={containerStyle}>
        <div style={leftPanelStyle}>
          {exams.map((exam) => (
            <div key={exam.exam_id} style={examCardStyle}>
              <div
                style={{ ...examTitleStyle, cursor: "pointer" }}
                onClick={() => handleExamClick(exam.exam_id)}
              >
                📚 {exam.exam_name}
              </div>
              {selectedExamId === exam.exam_id && (
                <div style={mockTestListStyle}>
                  {exam.test_ids?.map((testId, idx) => (
                    <div
                      key={testId}
                      style={mockTestLinkContainerStyle}
                      onClick={() => handleMockTestClick(testId)}
                    >
                      <span>📝</span>
                      <span style={mockTestLinkStyle}>Mock test #{idx + 1}</span>
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
              <h3 style={titleStyle}>{selectedExam.exam_name}</h3>
              <p style={{ color: "#003366" }}>
                <strong>TÀI LIỆU THAM KHẢO</strong>
              </p>

              <div className="space-y-2">
                {selectedExam.topics?.map((topic) => (
                  <div key={topic.topic_id}>
                    <div
                      style={{
                        ...topicCardStyle,
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleTopicClick(topic.topic_id)}
                    >
                      <span style={{ marginRight: "8px", color: "#003366", fontSize: "20px" }}>
                        {expandedTopics[topic.topic_id] ? <FiMinus /> : <FiPlus />}
                      </span>
                      {topic.topic_name}
                    </div>

                    {expandedTopics[topic.topic_id] && topic.list_doc.length > 0 && (
                      <div style={{ paddingLeft: "20px" }}>
                        {topic.list_doc.map((doc, index) => {
                          let fileUrl = doc.file_url;

                          // Sửa lại URL nếu bị lặp "/documents/documents/"
                          if (fileUrl.startsWith("/media/documents/documents/")) {
                            fileUrl = fileUrl.replace("/media/documents/documents/", "/media/documents/");
                          }

                          // Nếu URL là tương đối, thêm domain vào
                          if (fileUrl.startsWith("/")) {
                            fileUrl = `http://localhost:8000${fileUrl}`;
                          }

                          return (
                            <div key={doc.doc_id} style={lessonLinkStyle}>
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#0b3d91", textDecoration: "underline" }}
                              >
                                📄 Xem tài liệu #{index + 1}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}


                    {expandedTopics[topic.topic_id] && topic.list_doc.length === 0 && (
                      <p style={{ paddingLeft: "30px", fontStyle: "italic", color: "gray" }}>
                        (Chưa có tài liệu)
                      </p>
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
