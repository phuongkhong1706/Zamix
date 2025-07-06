import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMinus } from "react-icons/fi";
import ChatbotWidget from "../../../ChatbotWidget";

function StudentPractice() {
  const navigate = useNavigate();
  const chatbotRef = useRef(); // 👈 Ref để điều khiển chatbot
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/api/student/student_practice/student_manage_practice/")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Dữ liệu:", data);
        setExams(data);

        // 👇 Tự động mở chatbot và gửi tin nhắn đầu tiên
        setTimeout(() => {
          chatbotRef.current?.toggleChat();
          chatbotRef.current?.triggerSend("Em cần hỗ trợ về kỳ thi ạ!");
        }, 1000);
      })
      .catch((err) => console.error("❌ Lỗi khi fetch:", err));
  }, []);

  const handleExamClick = (examId) => {
    setSelectedExamId((prev) => (prev === examId ? null : examId));
  };

  const handleMockTestClick = (testId) => {
    navigate(`/student/practice/verify_practice/${testId}`);
  };

  const handleTopicClick = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const selectedExam = exams.find((exam) => exam.exam_id === selectedExamId);

  return (
    <div style={{ padding: 30, fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ marginBottom: 20, color: "#003366" }}>
        🧠 Danh sách kỳ thi của bạn ({exams.length})
      </h2>

      <div style={{ display: "flex", gap: 30 }}>
        {/* DANH SÁCH KỲ THI */}
        <div style={{ flex: 1, borderRight: "2px solid #ddd", paddingRight: 20 }}>
          {exams.map((exam) => (
            <div
              key={exam.exam_id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
                backgroundColor: "#f9f9f9",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#003366",
                  cursor: "pointer",
                }}
                onClick={() => handleExamClick(exam.exam_id)}
              >
                📚 {exam.exam_name}
              </div>

              {selectedExamId === exam.exam_id && (
                <div style={{ marginTop: 10, paddingLeft: 10 }}>
                  {exam.test_ids?.map((testId, idx) => (
                    <div
                      key={testId}
                      style={{
                        padding: 6,
                        color: "#0b3d91",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                      onClick={() => handleMockTestClick(testId)}
                    >
                      📝 Mock Test #{idx + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CHI TIẾT KỲ THI */}
        <div
          style={{
            flex: 2,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 10,
            boxShadow: "0 0 10px rgba(0,0,0,0.05)",
            backgroundColor: "#fff",
            minHeight: 300,
          }}
        >
          {selectedExam ? (
            <>
              <h3 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
                🧾 {selectedExam.exam_name}
              </h3>
              <p style={{ fontWeight: "bold", marginTop: 10, color: "#003366" }}>
                📖 Tài liệu tham khảo:
              </p>

              <div style={{ marginTop: 10 }}>
                {selectedExam.topics.map((topic) => (
                  <div key={topic.topic_id} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: "bold",
                        color: "#003366",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                      onClick={() => handleTopicClick(topic.topic_id)}
                    >
                      {expandedTopics[topic.topic_id] ? <FiMinus /> : <FiPlus />}
                      <span>{topic.topic_name}</span>
                    </div>

                    {expandedTopics[topic.topic_id] && (
                      <div style={{ paddingLeft: 20, marginTop: 6 }}>
                        {topic.list_doc.length > 0 ? (
                          topic.list_doc.map((doc, idx) => {
                            let fileUrl = doc.file_url;

                            if (fileUrl.startsWith("/media/documents/documents/")) {
                              fileUrl = fileUrl.replace(
                                "/media/documents/documents/",
                                "/media/documents/"
                              );
                            }

                            if (fileUrl.startsWith("/")) {
                              fileUrl = `http://localhost:8000${fileUrl}`;
                            }

                            return (
                              <div key={doc.doc_id} style={{ marginBottom: 5 }}>
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#0b3d91",
                                    textDecoration: "underline",
                                    fontSize: 15,
                                  }}
                                >
                                  📄 Xem tài liệu #{idx + 1}
                                </a>
                              </div>
                            );
                          })
                        ) : (
                          <p
                            style={{
                              paddingLeft: 20,
                              fontStyle: "italic",
                              color: "gray",
                            }}
                          >
                            (Chưa có tài liệu)
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ fontStyle: "italic", color: "#888", fontSize: 16 }}>
              🖱️ Chọn một kỳ thi từ khung bên trái để xem chi tiết và tài liệu.
            </p>
          )}
        </div>
      </div>

      {/* GẮN CHATBOT */}
      <ChatbotWidget ref={chatbotRef} />
    </div>
  );
}

export default StudentPractice;
