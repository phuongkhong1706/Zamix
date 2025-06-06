import React from "react";
import { useLocation } from "react-router-dom";

function StudentResultExam() {
    const location = useLocation();
    const { correctAnswers, totalQuestions, examName } = location.state || {};

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>

                <h3 style={{ marginBottom: "24px", color: "#333", fontSize: "24px" }}>
                    Kỳ thi: {examName || "Không xác định"}
                </h3>
                <h2 style={{ color: "#0b3d91", marginBottom: "16px" }}>
                    ✅ Bạn đã hoàn thành bài thi!
                </h2>

                {correctAnswers != null && totalQuestions != null ? (
                    <p style={{ fontSize: "20px", fontWeight: "bold", color: "red"}}>
                        🎯 Kết quả thi: {correctAnswers}/{totalQuestions} câu đúng
                    </p>
                ) : (
                    <p style={{ color: "red" }}>Không tìm thấy kết quả. Vui lòng thử lại.</p>
                )}
            </div>
        </div>
    );
}

const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f7fa",
};

const cardStyle = {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
    textAlign: "center",
};

export default StudentResultExam;
