import React, { useState, useEffect } from "react";
import LatexInputKaTeX, { renderWithLatex } from "./LatexInputKaTeX.js";
import { v4 as uuidv4 } from "uuid";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../../../../styles/teacher/TeacherExamAdd.css";
import "../../../../styles/SidebarNavigation.css";
import "../../../../styles/teacher/TeacherExamCode.css";
import iconAddQuestion from "../../../../assets/icon/icon-add.png";
import iconCancelQuestion from "../../../../assets/icon/icon-cancel.png";
import iconCorrect from "../../../../assets/icon/icon-correct.png";
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";
import { FaSave } from "react-icons/fa";
import mammoth from "mammoth";
 
 
function TeacherExamCodeFromFile() {
  const [newQuestions, setNewQuestions] = useState([]);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const { examId, testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examData, setExamData] = useState({
    name: "",
    type: "",
    duration_minutes: 0,
    shift: {
      shift_id: "",
      name: "",
      date: "",
      start_time: "",
      end_time: ""
    }
  });
  const handleUploadTestFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
 
    if (file.type === "application/pdf") {
      alert("⚠️ Tạm thời chỉ hỗ trợ đọc file Word (.docx). PDF sẽ được hỗ trợ sau.");
      return;
    }
 
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
 
      const parsedQuestions = parseQuestionsFromText(value);
 
      if (parsedQuestions.length === 0) {
        alert("⚠️ Không tìm thấy câu hỏi nào trong file.");
        return;
      }
 
      // Gán full danh sách câu hỏi vào `newQuestions` để render nhiều câu
      const formattedQuestions = parsedQuestions.map((q) => ({
        content: q.question,
        level: null,
        options: q.answers.map((text, idx) => ({
          id: idx + 1,
          text,
        })),
        correct_option_id: q.correct_option_id || null,
        type: "single",
        score: 1.0,
        is_gened_by_model: false,
        created_by_question: false,
      }));
 
 
      setNewQuestions(formattedQuestions); // 👈 dòng quan trọng
 
      setQuestions(parsedQuestions);
      setCurrentQuestionIndex(0);
      setEditingIndex(null);
      // Bỏ dòng dưới để không hiện form tự động khi tải file
      // setShowNewQuestionForm(true);
 
      loadQuestionAtIndex(0, parsedQuestions);
 
      alert(`✅ Đã tải và phân tích ${parsedQuestions.length} câu hỏi.`);
    } catch (error) {
      console.error("Lỗi đọc file:", error);
      alert("❌ Có lỗi khi đọc file. Kiểm tra lại định dạng hoặc nội dung file.");
    }
  };
 
 
 
  // Hàm hỗ trợ: load câu hỏi theo index
  const loadQuestionAtIndex = (index, sourceQuestions = questions) => {
    const q = sourceQuestions[index];
    const options = q.answers.map((text, idx) => ({
      id: idx + 1,
      text,
    }));
 
    setNewQuestion({
      content: q.question,
      level: null,
      options: options,
      correct_option_id: null,
    });
 
    setCurrentQuestionIndex(index);
  };
 
 
  const parseQuestionsFromText = (text) => {
    const questionMatches = [...text.matchAll(/Câu\s*(\d+)[.:]/gi)];
    const blocks = text.split(/Câu\s*\d+[.:]/i).map(b => b.trim()).filter(Boolean);
 
    const questions = [];
 
    blocks.forEach((block, index) => {
      const questionNumber = questionMatches[index]?.[1] || `${index + 1}`;
      const cleanedBlock = block.replace(/^Câu\s*\d+[.:]?\s*/i, '');
 
      // Tách phần đáp án đúng (nếu có)
      let correctLetter = null;
      const correctMatch = cleanedBlock.match(/Đáp án đúng:\s*([A-D])/i);
      if (correctMatch) correctLetter = correctMatch[1].toUpperCase();
 
      // Loại bỏ nguyên dòng "Đáp án đúng: X"
      const withoutCorrectLine = cleanedBlock.replace(/Đáp án đúng:\s*[A-D]\s*/i, '').trim();
 
      // Phân đoạn question và answers
      const parts = withoutCorrectLine.split(/\n|(?=[A-D][.．])/)
        .map(p => p.trim())
        .filter(Boolean);
 
      const questionText = parts[0];
      const answers = parts.slice(1).map(ans => ans.replace(/^([A-D])[.．]\s*/i, '$1. ').trim());
 
      // Tạo đối tượng câu hỏi với đúng đáp án
      const opts = answers.map((ans, idx) => ({ id: idx + 1, text: ans }));
      const correct_option_id = correctLetter
        ? opts.find(o => o.text.startsWith(correctLetter + '.'))?.id
        : null;
 
      questions.push({
        question: `Câu ${questionNumber}: ${questionText}`,
        answers,
        correct_option_letter: correctLetter,
        correct_option_id,
      });
    });
 
    return questions;
  };
 
 
 
 
 
 
  const handleSave = async () => {
    const userJson = localStorage.getItem("user");
    let token = null;
 
    // Lấy token từ localStorage
    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        token = userObj.token;
      } catch (error) {
        console.error("❌ Lỗi khi parse user từ localStorage:", error);
      }
    }
 
    if (!token) {
      alert("⚠️ Token không tồn tại hoặc lỗi khi đọc token. Vui lòng đăng nhập lại.");
      return;
    }
 
    // Dữ liệu gửi đi, thêm exam_id từ params
    const data = {
      name: examData.name,
      type: examData.type,
      duration_minutes: examData.duration_minutes,
      shift_id: examData.shift?.shift_id, // an toàn với ? nếu shift null
      exam_id: examId,  // thêm exam_id để gửi lên backend
    };
 
    const method = testId ? "PUT" : "POST";
    const url = testId
      ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/${testId}/`
      : "http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/";
 
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
 
      const resText = await res.text();
 
      if (res.ok) {
        const responseData = JSON.parse(resText);
        const newTestId = responseData.test_id;
 
        alert(testId ? "✅ Cập nhật đề thi thành công!" : "✅ Tạo đề thi thành công!");
 
        // Nếu là POST thì redirect lại với test_id trong URL
        if (!testId && newTestId) {
          const basePath = window.location.pathname.endsWith("/")
            ? window.location.pathname
            : window.location.pathname + "/";
          const newUrl = `${basePath}${newTestId}/`;
          window.location.replace(newUrl);
        }
      } else {
        const errorJson = JSON.parse(resText);
        alert(`❌ Lỗi: ${errorJson.message || errorJson.error || "Không xác định"}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi lưu kỳ thi:", error);
      alert("🚫 Không thể kết nối tới server.");
    }
  };
 
  const handleSaveTest = async () => {
    const userJson = localStorage.getItem("user");
    let token = null;
    let userId = null;
 
    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        token = userObj.token;          // token nằm ở root
        userId = userObj.user_id;       // user_id cũng nằm ở root
      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }
    }
 
    if (!token) {
      alert("Token không tồn tại hoặc lỗi khi đọc token. Vui lòng đăng nhập lại.");
      return;
    }
 
    if (!testId) {
      alert("Chưa có testId! Hãy tạo đề thi trước khi lưu câu hỏi.");
      return;
    }
 
    for (const [index, question] of newQuestions.entries()) {
      // Loại bỏ tiền tố "Câu x: ..." trong nội dung câu hỏi
      const cleanedQuestionContent = question.content
        ? question.content.replace(/^Câu\s*\d+[.:]?\s*/i, '').trim()
        : '';
 
      const questionData = {
        test: testId,
        content: cleanedQuestionContent,
        type: question.type || "single",
        score: question.score || 1.0,
        level: question.level || 1,
        is_gened_by_model: question.is_gened_by_model || false,
        created_by_question: question.created_by_question || false,
        user: userId, // Truyền user id vào đây
      };
 
      const method = question.id ? "PUT" : "POST";
      const questionUrl = question.id
        ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/${question.id}/`
        : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/`;
 
      try {
        console.log("📤 Gửi câu hỏi:", method, questionUrl);
        console.log("📦 Dữ liệu câu hỏi:", questionData);
 
        const res = await fetch(questionUrl, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(questionData),
        });
 
        const resJson = await res.json();
        console.log("✅ Phản hồi câu hỏi:", resJson);
 
        if (!res.ok) {
          console.error("❌ Lỗi khi lưu câu hỏi:", resJson);
          alert(`Lỗi khi lưu câu hỏi: ${resJson.detail || "Không rõ lỗi"}`);
          return;
        }
 
        const questionId = resJson.id || resJson.question_id;
 
        for (const option of question.options || []) {
          // Loại bỏ tiền tố "A.", "B.", ... trong nội dung đáp án
          const cleanedOptionText = option.text
            ? option.text.replace(/^[A-D][.．]\s*/i, '').trim()
            : '';
 
          const answerData = {
            question: questionId,
            content: cleanedOptionText,
            is_correct: option.id === question.correct_option_id,
            user: userId,
          };
 
          const answerMethod = option.answer_id ? "PUT" : "POST";
          const answerUrl = option.answer_id
            ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/${option.answer_id}/`
            : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/`;
 
          console.log("📤 Gửi đáp án:", answerMethod, answerUrl);
          console.log("📦 Dữ liệu đáp án:", answerData);
 
          const answerRes = await fetch(answerUrl, {
            method: answerMethod,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(answerData),
          });
 
          const answerResJson = await answerRes.json();
          console.log("✅ Phản hồi đáp án:", answerResJson);
 
          if (!answerRes.ok) {
            console.error("❌ Lỗi khi lưu đáp án:", answerResJson);
            alert(`Lỗi lưu đáp án: ${answerResJson.detail || "Không rõ lỗi"}`);
            return;
          }
        }
 
      } catch (error) {
        console.error("❌ Lỗi khi lưu câu hỏi/đáp án:", error);
        alert("Không thể kết nối tới server.");
        return;
      }
    }
 
 
    alert("✅ Lưu toàn bộ câu hỏi và đáp án thành công!");
  };
 
 
 
 
  useEffect(() => {
    const fetchTestDetail = async () => {
      // 🔐 Lấy token từ localStorage
      const userJson = localStorage.getItem("user");
      let token = null;
 
      if (userJson) {
        try {
          const userObj = JSON.parse(userJson);
          token = userObj.token;
        } catch (error) {
          console.error("❌ Lỗi khi parse user từ localStorage:", error);
        }
      }
 
      // ⚠️ Nếu không có token thì dừng lại
      if (!token) {
        alert("Token không tồn tại hoặc lỗi khi đọc token. Vui lòng đăng nhập lại.");
        return;
      }
 
      // 📦 Gọi API với header Authorization
      try {
        const response = await axios.get(
          `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
 
        const data = response.data;
        console.log('✅ Dữ liệu lấy được từ API:', data);
 
        // 📝 Cập nhật thông tin chung của đề thi
        setExamData({
          name: data.name || '',
          type: data.type || '',
          duration_minutes: data.duration_minutes || '',
          created_at: data.created_at || '',
          shift: data.shift || {
            shift_id: '',
            name: '',
            date: '',
            start_time: '',
            end_time: ''
          }
        });
 
        // 📝 Cập nhật danh sách câu hỏi và đáp án
        if (Array.isArray(data.questions)) {
          const formattedQuestions = data.questions.map((question) => ({
            question_id: question.question_id,
            content: question.content,
            type: question.type,
            level: question.level,
            score: question.score,
            is_gened_by_model: question.is_gened_by_model,
            created_by_question: question.created_by_question,
            correct_option_id: question.answers.find(a => a.is_correct)?.answer_id || null,
            options: question.answers?.map((answer) => ({
              id: answer.answer_id,
              text: answer.content,
              is_correct: answer.is_correct,
              user: answer.user,
            })) || [],
          }));
 
          setNewQuestions(formattedQuestions);
        } else {
          setNewQuestions([]);
        }
 
      } catch (error) {
        console.error('❌ Lỗi khi lấy dữ liệu đề thi:', error);
      }
 
    };
 
    fetchTestDetail();
  }, [testId]);
 
 
  const createNewQuestion = () => ({
    content: "",
    options: [
      { id: uuidv4(), text: "" },
      { id: uuidv4(), text: "" },
      { id: uuidv4(), text: "" },
      { id: uuidv4(), text: "" },
    ],
    correct_option_id: "",
  });
 
  const [newQuestion, setNewQuestion] = useState(createNewQuestion());
 
  const handleAddOption = () => {
    setNewQuestion((prev) => ({
      ...prev,
      options: [...prev.options, { id: uuidv4(), text: "" }],
    }));
  };
 
  const handleDeleteOption = (id) => {
    if (newQuestion.options.length <= 2) {
      alert("Mỗi câu hỏi phải có ít nhất 2 đáp án.");
      return;
    }
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
    }));
    if (newQuestion.correct_option_id === id) {
      setNewQuestion((prev) => ({ ...prev, correct_option_id: "" }));
    }
  };
 
  const handleAddOrEditQuestion = () => {
    if (!newQuestion.content.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi.");
      return;
    }
    if (newQuestion.options.some((opt) => !opt.text.trim())) {
      alert("Vui lòng nhập đầy đủ nội dung các đáp án.");
      return;
    }
    if (!newQuestion.correct_option_id) {
      alert("Vui lòng chọn đáp án đúng.");
      return;
    }
 
    if (editingIndex !== null) {
      const updated = [...newQuestions];
      updated[editingIndex] = newQuestion;
      setNewQuestions(updated);
    } else {
      setNewQuestions((prev) => [...prev, newQuestion]);
    }
 
    setNewQuestion(createNewQuestion());
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
    setNewQuestion(createNewQuestion());
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
            value={examData.name}
            onChange={(e) => setExamData({ ...examData, name: e.target.value })}
            placeholder="Nhập mã đề"
          />
        </h2>
        <hr />
 
        {/* DANH SÁCH CÂU HỎI */}
        {newQuestions.map((q, index) => (
          <div key={`q-${index}`} className="question-item">
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => handleEditQuestion(index)}>
                <img src={iconEdit} alt="edit" className="btn-icon" /> Sửa
              </button>
              <button className="delete-btn" onClick={() => handleDeleteQuestion(index)}>
                <img src={iconDelete} alt="delete" className="btn-icon" /> Xoá
              </button>
            </div>
 
            <p>
              <strong>Câu {index + 1}:</strong>{" "}
              {q.content
                ? renderWithLatex(q.content.replace(/^Câu\s*\d+[.:]?\s*/i, '').trim())
                : <em style={{ color: "gray" }}>Không có nội dung</em>}
            </p>
 
            <ul>
              {q.options?.map((opt, idx) => {
                // Loại bỏ prefix A. / B. / C. / D. nếu còn trong text
                const cleanedText = opt.text.replace(/^[A-D][.．]\s*/i, '').trim();
                return (
                  <li key={opt.id}>
                    <strong>{String.fromCharCode(65 + idx)}</strong>.{" "}
                    {renderWithLatex(cleanedText)}
                    {q.correct_option_id === opt.id && (
                      <span className="correct-answer">
                        <img src={iconCorrect} alt="correct" className="btn-icon" /> Đáp án đúng
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
 
 
 
 
        {/* NÚT THÊM CÂU HỎI */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={handleToggleQuestionForm} className="btn addquestion">
              <img
                src={showNewQuestionForm ? iconCancelQuestion : iconAddQuestion}
                alt="toggle"
                className="btn-icon"
              />
              {showNewQuestionForm ? (editingIndex !== null ? "Huỷ sửa" : "Huỷ thêm") : "Thêm câu hỏi"}
            </button>
 
            <button className="btn addquestion" onClick={() => document.getElementById("file-upload").click()}>
              <span className="btn-icon">📤</span>
              Tải đề thi
            </button>
            <input
              type="file"
              id="file-upload"
              accept=".doc,.docx,.pdf"
              onChange={handleUploadTestFile}
              style={{ display: "none" }}
            />
 
 
            <button onClick={handleSaveTest} className="btn addquestion">
              <span className="btn-icon">💾</span>
              Lưu đề thi
            </button>
          </div>
 
 
        </div>
 
 
        {/* FORM THÊM/SỬA */}
        {showNewQuestionForm && (
          <div className="question-form">
            <h4>{editingIndex !== null ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}</h4>
 
            {/* Nội dung câu hỏi */}
            <div className="form-section">
              <label style={{ marginBottom: "10px", display: "block" }}>Nội dung câu hỏi:</label>
              <LatexInputKaTeX
                value={newQuestion.content}
                onChange={(value) => setNewQuestion({ ...newQuestion, content: value })}
                style={{ width: "90%", minHeight: "100px" }}
              />
            </div>
 
            {/* Mức độ câu hỏi */}
            <div className="form-section">
              <label style={{ marginBottom: "10px", display: "block" }}>Mức độ câu hỏi:</label>
              <select
                value={newQuestion.level || ""}
                onChange={(e) => setNewQuestion({ ...newQuestion, level: parseInt(e.target.value, 10) })}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "15px" }}
              >
                <option value="" disabled>Chọn mức độ</option>
                <option value="1">1 - Dễ</option>
                <option value="2">2 - Trung bình</option>
                <option value="3">3 - Khó</option>
                <option value="4">4 - Rất khó</option>
              </select>
            </div>
 
            {/* Danh sách đáp án */}
            <div className="form-section">
              <label style={{ marginBottom: "10px", display: "block" }}>Danh sách đáp án:</label>
              {newQuestion.options.map((opt, idx) => (
                <div key={opt.id} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <LatexInputKaTeX
                    value={opt.text}
                    onChange={(value) => {
                      const updatedOptions = newQuestion.options.map((o) =>
                        o.id === opt.id ? { ...o, text: value } : o
                      );
                      setNewQuestion({ ...newQuestion, options: updatedOptions });
                    }}
                  />
                  <input
                    type="radio"
                    name="correct_option"
                    checked={newQuestion.correct_option_id === opt.id}
                    onChange={() => setNewQuestion({ ...newQuestion, correct_option_id: opt.id })}
                    style={{ marginLeft: "8px" }}
                  />
                  <button onClick={() => handleDeleteOption(opt.id)} style={{ marginLeft: "8px" }}>
                    ❌
                  </button>
                </div>
              ))}
              <button onClick={handleAddOption} style={{ marginTop: "10px", padding: "10px 20px", borderRadius: "8px", backgroundColor: "#ffffff", border: "1px solid #ccc", cursor: "pointer", fontWeight: "bold" }}>
                ➕ Thêm đáp án
              </button>
            </div>
 
            {/* Nút hành động */}
            <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", marginTop: "20px" }}>
              <button onClick={handleAddOrEditQuestion} className="save-btn">
                ✅ {editingIndex !== null ? "Lưu chỉnh sửa" : "Lưu câu hỏi"}
              </button>
            </div>
          </div>
        )}
 
 
      </div>
 
      {/* SIDEBAR THÔNG TIN KỲ THI */}
      <div className="sidebar-container">
        <div className="exam-form-title">Kỳ thi giữa kỳ toán 12</div>
 
        {/* Loại đề thi */}
        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Loại đề thi</label>
            <select
              className="exam-form-input"
              value={examData.type || ""}
              onChange={(e) => setExamData({ ...examData, type: e.target.value })}
            >
              <option value="">Chọn loại đề</option>
              <option value="thi thử">Thi thử</option>
              <option value="thi chính thức">Thi chính thức</option>
            </select>
          </div>
        </div>
 
        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Thời lượng (phút)</label>
            <input
              type="number"
              className="exam-form-input"
              value={examData.duration_minutes}
              onChange={(e) => setExamData({ ...examData, duration_minutes: e.target.value })}
              min="1"
              placeholder="Nhập số phút"
            />
          </div>
        </div>
 
        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Ca thi</label>
            <input
              type="number"
              className="exam-form-input"
              value={examData.shift?.shift_id || ""}
              onChange={(e) =>
                setExamData({
                  ...examData,
                  shift: {
                    ...examData.shift,
                    shift_id: e.target.value
                  }
                })
              }
              min="1"
              placeholder="Nhập ca thi"
            />
          </div>
        </div>

        {/* Mật khẩu đề */}
        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Mật khẩu đề</label>
            {testId ? (
              <div className="exam-form-input exam-form-static">
                {examData.password ? "********" : "1234565"}
              </div>
            ) : (
              <input
                type="text"
                className="exam-form-input"
                value={examData.password || ""}
                onChange={(e) =>
                  setExamData({ ...examData, password: e.target.value })
                }
                placeholder="Nhập mật khẩu"
              />
            )}
          </div>
        </div>
 
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", marginRight: "9px" }}>
          <button className="btn addcode" onClick={handleSave}>
            <FaSave className="btn-icon" /> {testId ? "Cập nhật" : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default TeacherExamCodeFromFile;