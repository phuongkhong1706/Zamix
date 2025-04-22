import React, { useState } from "react";
import LatexInputKaTeX, { renderWithLatex } from "./LatexInputKaTeX.js";

import "../../../../styles/SidebarNavigation.css";
import "../../../../styles/exam-teacher/TeacherExamCode.css";
import iconAddQuestion from "../../../../assets/icon/icon-add.png";
import iconCancelQuestion from "../../../../assets/icon/icon-cancel.png";
import iconCorrect from "../../../../assets/icon/icon-correct.png";
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";

function TeacherExamCode() {
  const [examData, setExamData] = useState({
    exam_title: "",
    exam_code: "",
    exam_type: "",
    grade: "",
    start_time: "",
    duration: "",
  });

  const [answers, setAnswers] = useState({});
  const [newQuestions, setNewQuestions] = useState([]);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    content: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
  });

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      content: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "",
    });
  };

  const handleAddOrEditQuestion = () => {
    const { content, option_a, option_b, option_c, option_d, correct_answer } = newQuestion;
    if (!content || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
      return alert("Vui lòng điền đầy đủ thông tin câu hỏi.");
    }

    if (editingIndex !== null) {
      const updatedQuestions = [...newQuestions];
      updatedQuestions[editingIndex] = newQuestion;
      setNewQuestions(updatedQuestions);
    } else {
      setNewQuestions((prev) => [...prev, newQuestion]);
    }

    resetNewQuestion();
    setEditingIndex(null);
    setShowNewQuestionForm(false);
  };

  const handleEditQuestion = (index) => {
    setNewQuestion(newQuestions[index]);
    setEditingIndex(index);
    setShowNewQuestionForm(true);
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm("Bạn có chắc muốn xoá câu hỏi này không?")) {
      setNewQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleToggleQuestionForm = () => {
    setShowNewQuestionForm(!showNewQuestionForm);
    setEditingIndex(null);
    resetNewQuestion();
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* MAIN CONTENT */}
      <div style={{ flex: 1, paddingRight: "280px" }}>
        <h2>
          Mã đề:{" "}
          <input
            type="text"
            className="border p-2 rounded"
            value={examData.exam_code}
            onChange={(e) => setExamData({ ...examData, exam_code: e.target.value })}
            placeholder="Nhập mã đề"
          />
        </h2>
        <hr />

        {/* DANH SÁCH CÂU HỎI */}
        {newQuestions.map((q, index) => (
          <div key={`new-${index}`} className="question-item">
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => handleEditQuestion(index)}>
                <img src={iconEdit} alt="edit" className="btn-icon" /> Sửa
              </button>
              <button className="delete-btn" onClick={() => handleDeleteQuestion(index)}>
                <img src={iconDelete} alt="delete" className="btn-icon" /> Xoá
              </button>
            </div>

            <p><strong>Câu {index + 1}:</strong> {renderWithLatex(q.content)}</p>
            <ul>
              {["A", "B", "C", "D"].map((opt) => (
                <li key={opt}>
                  <strong>{opt}</strong>. {renderWithLatex(q[`option_${opt.toLowerCase()}`])}{" "}
                  {q.correct_answer === opt && (
                    <span className="correct-answer">
                      <img src={iconCorrect} alt="correct" className="btn-icon" /> Đáp án đúng
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* NÚT THÊM CÂU HỎI */}
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleToggleQuestionForm} className="btn addquestion">
            <img
              src={showNewQuestionForm ? iconCancelQuestion : iconAddQuestion}
              alt="toggle"
              className="btn-icon"
            />
            {showNewQuestionForm ? (editingIndex !== null ? "Huỷ sửa" : "Huỷ thêm") : "Thêm câu hỏi"}
          </button>
        </div>

        {/* FORM THÊM/SỬA */}
        {showNewQuestionForm && (
          <div className="question-form">
            <h4>{editingIndex !== null ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}</h4>

            <LatexInputKaTeX
              value={newQuestion.content}
              onChange={(value) => setNewQuestion({ ...newQuestion, content: value })}
            />

            {["a", "b", "c", "d"].map((opt) => (
              <LatexInputKaTeX
                key={opt}
                value={newQuestion[`option_${opt}`]}
                onChange={(value) => setNewQuestion({ ...newQuestion, [`option_${opt}`]: value })}
              />
            ))}

            <div className="correct-answer">
              <label>Chọn đáp án đúng:</label>
              {["A", "B", "C", "D"].map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name="correct_answer"
                    value={opt}
                    checked={newQuestion.correct_answer === opt}
                    onChange={() => setNewQuestion({ ...newQuestion, correct_answer: opt })}
                  /> {opt}
                </label>
              ))}
            </div>

            <button onClick={handleAddOrEditQuestion} className="save-btn">
              ✅ {editingIndex !== null ? "Lưu chỉnh sửa" : "Lưu câu hỏi"}
            </button>
          </div>
        )}
      </div>

      {/* SIDEBAR THÔNG TIN KỲ THI */}
      <div className="sidebar-container">
        <div className="exam-form-title">Thông tin kỳ thi</div>

        {/* Tên kỳ thi */}
        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Tên kỳ thi</label>
            <input
              type="text"
              className="exam-form-input"
              value={examData.exam_title}
              onChange={(e) => setExamData({ ...examData, exam_title: e.target.value })}
            />
          </div>
        </div>

        {/* Loại kỳ thi + Khối */}
        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Loại kỳ thi</label>
            <select
              className="exam-form-select"
              value={examData.exam_type}
              onChange={(e) => setExamData({ ...examData, exam_type: e.target.value })}
            >
              <option value="">-- Chọn loại --</option>
              <option value="midterm">Giữa kỳ</option>
              <option value="final">Cuối kỳ</option>
            </select>
          </div>

          <div className="exam-form-group">
            <label className="exam-form-label">Khối</label>
            <select
              className="exam-form-select"
              value={examData.grade}
              onChange={(e) => setExamData({ ...examData, grade: e.target.value })}
            >
              <option value="">-- Chọn khối --</option>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
            </select>
          </div>
        </div>

        {/* Thời lượng */}
        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Thời lượng (phút)</label>
            <input
              type="number"
              className="exam-form-input"
              value={examData.duration}
              onChange={(e) => setExamData({ ...examData, duration: e.target.value })}
              placeholder="Nhập số phút"
              min="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherExamCode;
