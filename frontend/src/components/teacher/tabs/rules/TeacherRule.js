import React, { useState } from "react";
import "../../../../styles/teacher/TeacherExamAdd.css";
import { FaSave, FaTrash, FaUpload } from "react-icons/fa";

const TeacherRule = () => {
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
  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [isEditingRules, setIsEditingRules] = useState(false);

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

  return (
    <div className="add-exam-container" style={{ padding: 20 }}>
      {/* Hướng dẫn */}
      <div className="exam-section">
        <div className="exam-section-title">Hướng dẫn vào thi online</div>
        {guideSteps.map((step, index) => (
          <div key={index} style={{ marginBottom: 30, borderBottom: "1px solid #ccc", paddingBottom: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ minWidth: 70 }}>Bước {index + 1}:</div>
              {isEditingGuide ? (
                <>
                  <input
                    type="text"
                    value={step.text}
                    onChange={(e) => handleGuideTextChange(e, index)}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      padding: 8,
                      borderRadius: 4,
                      border: "1px solid #ccc",
                    }}
                  />
                  <label
                    htmlFor={`guide-img-upload-${index}`}
                    style={{ cursor: "pointer" }}
                    title="Tải ảnh"
                  >
                    <FaUpload size={20} color="#003366" style={{ marginTop: 10 }}/>
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
                    <FaTrash size={20} color="red" />
                  </button>
                </>
              ) : (
                <div style={{ flex: 1 }}>{step.text}</div>
              )}
            </div>
            {step.image && (
              <div style={{ marginTop: 10, textAlign: "center" }}>
                <img
                  src={step.image}
                  alt={`Guide Step ${index + 1}`}
                  style={{ maxHeight: 400, width: "100%", objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn addcode" onClick={() => setIsEditingGuide((prev) => !prev)}>
            <FaSave className="btn-icon" />
            {isEditingGuide ? "Lưu" : "Cập nhật"}
          </button>
        </div>
      </div>

      {/* Thể lệ */}
      <div className="exam-section" style={{ marginTop: 50 }}>
        <div className="exam-section-title">Thể lệ cuộc thi</div>
        {rules.map((rule, index) => (
          <div key={index} style={{ marginBottom: 25, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontWeight: 600 }}>{index + 1}.</div>
            {isEditingRules ? (
              <>
                <input
                  type="text"
                  value={rule.text}
                  onChange={(e) => handleRuleTextChange(e, index)}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
                <label
                  htmlFor={`rule-img-upload-${index}`}
                  style={{ cursor: "pointer" }}
                  title="Tải ảnh"
                >
                  <FaUpload size={20} color="#003366" style={{ marginTop: 10 }}/>
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
                  <FaTrash size={20} color="red" />
                </button>
              </>
            ) : (
              <div style={{ flex: 1 }}>{rule.text}</div>
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
                  style={{ maxHeight: 400, width: "100%", objectFit: "contain" }}
                />
              </div>
            )
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn addcode" onClick={() => setIsEditingRules((prev) => !prev)}>
            <FaSave className="btn-icon" />
            {isEditingRules ? "Lưu" : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherRule;
