import React, { useState } from "react";
import "../../../../styles/teacher/TeacherExamAdd.css";
import { FaTrash, FaUpload } from "react-icons/fa";

const StudentRule = () => {
  const [guideSteps, setGuideSteps] = useState([
    { text: "Đăng nhập tài khoản thi online.", image: null },
    { text: "Chuẩn bị thiết bị và đường truyền internet ổn định.", image: null },
    { text: "Kiểm tra micro và camera trước khi bắt đầu.", image: null },
    { text: "Bấm bắt đầu để vào phòng thi.", image: null },
  ]);
  const [rules, setRules] = useState([
    { text: "Thí sinh không được sử dụng điện thoại trong phòng thi.", image: null },
    { text: "Không được phép thoát khỏi màn hình thi trong suốt thời gian làm bài.", image: null },
  ]);
  const [isEditingGuide, ] = useState(false);
  const [isEditingRules, ] = useState(false);

  const handleGuideTextChange = (e, index) => {
    const newText = e.target.value;
    setGuideSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, text: newText } : step))
    );
  };

  const handleGuideImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setGuideSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, image: imageUrl } : step))
    );
  };

  const handleRuleTextChange = (e, index) => {
    const newText = e.target.value;
    setRules((prev) =>
      prev.map((rule, i) => (i === index ? { ...rule, text: newText } : rule))
    );
  };

  const handleRuleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setRules((prev) =>
      prev.map((rule, i) => (i === index ? { ...rule, image: imageUrl } : rule))
    );
  };

  const handleDeleteGuide = (index) => {
    setGuideSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteRule = (index) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  // Style chung cho khung chứa mỗi bước/quy định
  const containerStyle = {
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0, 51, 102, 0.15)",
    backgroundColor: "#f0f8ff", // màu xanh nhạt sáng
    color: "#003366",
    border: "1px solid #99c2ff",
  };

  const titleStyle = {
    fontSize: 24,
    fontWeight: "700",
    color: "#00509e",
    marginBottom: 20,
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  };

  const stepLabelStyle = {
    minWidth: 70,
    fontWeight: 600,
    fontSize: 18,
    color: "#004080",
  };

  const textStyle = {
    flex: 1,
    fontSize: 17,
    fontWeight: 500,
    lineHeight: 1.4,
    color: "#002b55",
  };

  const inputStyle = {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 6,
    border: "2px solid #00509e",
    boxShadow: "0 0 6px #80b3ff",
    outline: "none",
    color: "#003366",
    fontWeight: 600,
  };

  return (
    <div className="add-exam-container" style={{ padding: 20, backgroundColor: "#e6f0ff", minHeight: "100vh" }}>
      {/* Hướng dẫn */}
      <div className="exam-section">
        <div className="exam-section-title" style={titleStyle}>Hướng dẫn vào thi online</div>
        {guideSteps.map((step, index) => (
          <div key={index} style={containerStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
              <div style={stepLabelStyle}>Bước {index + 1}:</div>
              {isEditingGuide ? (
                <>
                  <input
                    type="text"
                    value={step.text}
                    onChange={(e) => handleGuideTextChange(e, index)}
                    style={inputStyle}
                  />
                  <label
                    htmlFor={`guide-img-upload-${index}`}
                    style={{ cursor: "pointer", color: "#00509e" }}
                    title="Tải ảnh"
                  >
                    <FaUpload size={22} />
                    <input
                      id={`guide-img-upload-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleGuideImageChange(e, index)}
                      style={{ display: "none" }}
                    />
                  </label>
                  <button
                    className="btn"
                    onClick={() => handleDeleteGuide(index)}
                    title="Xóa bước"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <FaTrash size={22} color="red" />
                  </button>
                </>
              ) : (
                <div style={textStyle}>{step.text}</div>
              )}
            </div>
            {step.image && (
              <div style={{ marginTop: 12, textAlign: "center" }}>
                <img
                  src={step.image}
                  alt={`Guide Step ${index + 1}`}
                  style={{ maxHeight: 400, width: "100%", objectFit: "contain", borderRadius: 8, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Thể lệ */}
      <div className="exam-section" style={{ marginTop: 50 }}>
        <div className="exam-section-title" style={titleStyle}>Thể lệ cuộc thi</div>
        {rules.map((rule, index) => (
          <div key={index} style={{ ...containerStyle, marginBottom: 25, padding: 15, display: "flex", alignItems: "center", gap: 15 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#004080" }}>{index + 1}.</div>
            {isEditingRules ? (
              <>
                <input
                  type="text"
                  value={rule.text}
                  onChange={(e) => handleRuleTextChange(e, index)}
                  style={inputStyle}
                />
                <label
                  htmlFor={`rule-img-upload-${index}`}
                  style={{ cursor: "pointer", color: "#00509e" }}
                  title="Tải ảnh"
                >
                  <FaUpload size={22} />
                  <input
                    id={`rule-img-upload-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleRuleImageChange(e, index)}
                    style={{ display: "none" }}
                  />
                </label>
                <button
                  className="btn"
                  onClick={() => handleDeleteRule(index)}
                  title="Xóa thể lệ"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <FaTrash size={22} color="red" />
                </button>
              </>
            ) : (
              <div style={textStyle}>{rule.text}</div>
            )}
          </div>
        ))}

        {rules.map(
          (rule, index) =>
            rule.image && (
              <div key={`img-${index}`} style={{ textAlign: "center", marginBottom: 30 }}>
                <img
                  src={rule.image}
                  alt={`Rule ${index + 1}`}
                  style={{ maxHeight: 400, width: "100%", objectFit: "contain", borderRadius: 8, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                />
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default StudentRule;
