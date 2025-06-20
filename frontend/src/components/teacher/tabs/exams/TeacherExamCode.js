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
import iconSave from "../../../../assets/icon/icon-save-white.png"
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";
import { FaSave } from "react-icons/fa";


function TeacherExamCode() {
  const [newQuestions, setNewQuestions] = useState([]);

  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [questionType, setQuestionType] = useState('multiple_choice'); // 'multiple_choice' hoặc 'essay'
  const [showSubmenu, setShowSubmenu] = useState(false);

  const { examId, testId } = useParams();
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

  // Hàm xử lý upload ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ được upload file ảnh (JPEG, PNG, GIF)');
        return;
      }

      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File ảnh không được vượt quá 5MB');
        return;
      }

      // Tạo preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewQuestion({
          ...newQuestion,
          image: file,
          imagePreview: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm xóa ảnh
  const handleRemoveImage = () => {
    setNewQuestion({
      ...newQuestion,
      image: null,
      imagePreview: null
    });

    // Reset input file
    const fileInput = document.getElementById('question-image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
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
    const userJson = localStorage.getItem('user');
    let token = null;
    let userId = null;

    try {
      if (userJson) {
        const userObj = JSON.parse(userJson);
        token = userObj.token;
        userId = userObj.user_id;
      }
    } catch (error) {
      console.error('❌ Lỗi parse user:', error);
    }

    if (!token) {
      alert('❌ Token không tồn tại. Vui lòng đăng nhập lại.');
      return;
    }

    if (!testId) {
      alert('❌ Vui lòng điền thông tin đề thi trước.');
      return;
    }

    // ✅ Deep copy toàn bộ questions và options
    let updatedQuestions = newQuestions.map(q => ({
      ...q,
      options: q.options ? q.options.map(opt => ({ ...opt })) : [],
    }));
    console.log('📋 Câu hỏi trước khi lưu:', updatedQuestions);

    // ✅ Vòng lặp xử lý từng câu hỏi
    for (let qIndex = 0; qIndex < updatedQuestions.length; qIndex++) {
      const question = updatedQuestions[qIndex];
      const isNewQuestion = !question.question_id;
      const questionUrl = isNewQuestion
        ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/`
        : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/${question.question_id}/`;
      const questionMethod = isNewQuestion ? 'POST' : 'PUT';

      try {
        // 📝 Gửi câu hỏi
        const formData = new FormData();
        formData.append('test', testId);
        formData.append('content', question.content || '');
        formData.append('type', question.type || 'single');
        formData.append('score', question.score || 1.0);
        formData.append('level', question.level || 1);
        formData.append('is_gened_by_model', question.is_gened_by_model ? 1 : 0);
        formData.append('created_by_question', question.created_by_question ? 1 : 0);
        formData.append('user', userId);
        if (question.image) formData.append('image', question.image);

        console.log(`\n📝 ${questionMethod} câu hỏi:`, questionUrl, question.content);
        const qRes = await fetch(questionUrl, {
          method: questionMethod,
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const qJson = await qRes.json();
        if (!qRes.ok) {
          console.error('❌ Lỗi lưu câu hỏi:', qJson);
          return;
        }

        if (isNewQuestion) {
          updatedQuestions[qIndex].question_id = qJson.question_id;
          console.log(`✅ Gán question_id mới: ${qJson.question_id}`);
        }

        const questionId = updatedQuestions[qIndex].question_id;

        // 🧭 Vòng lặp xử lý options (answers)
        for (let optIndex = 0; optIndex < updatedQuestions[qIndex].options.length; optIndex++) {
          const option = updatedQuestions[qIndex].options[optIndex];
          const isNewAnswer = !option.answer_id;
          const answerUrl = isNewAnswer
            ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/`
            : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/${option.answer_id}/`;
          const answerMethod = isNewAnswer ? 'POST' : 'PUT';

          const answerData = {
            question: questionId,
            content: option.text,
            is_correct: option.id === question.correct_option_id,
            user: userId,
          };
          console.log(
            `📦 ${answerMethod} đáp án index ${optIndex}:`,
            answerUrl,
            answerData,
            `\n▶️ isNewAnswer? ${isNewAnswer}, answer_id: ${option.answer_id}`
          );

          const aRes = await fetch(answerUrl, {
            method: answerMethod,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(answerData),
          });

          const aJson = await aRes.json();
          if (!aRes.ok) {
            console.error(`❌ Lỗi ${answerMethod} đáp án index ${optIndex}:`, aJson);
            return;
          }

          if (isNewAnswer) {
            updatedQuestions[qIndex].options[optIndex].answer_id = aJson.answer_id;
            console.log(`✅ Gán answer_id mới: ${aJson.answer_id} cho option index ${optIndex}`);
          } else {
            console.log(`✅ Đáp án ${option.answer_id} đã được PUT thành công.`);
          }
        }
      } catch (error) {
        console.error('❌ Lỗi xử lý câu hỏi/đáp án:', error);
        return;
      }
    }

    setNewQuestions(updatedQuestions);
    console.log('🎯 newQuestions sau khi lưu:', updatedQuestions);
    alert('✅ Lưu toàn bộ câu hỏi và đáp án thành công không duplicate!');
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

        // Cập nhật danh sách câu hỏi và đáp án
        if (Array.isArray(data.questions)) {
          const formattedQuestions = data.questions.map((question) => ({
            question_id: question.question_id,
            content: question.content,
            type: question.type,
            level: question.level,
            score: question.score,
            image: question.image || null,
            correct_option_id: question.answers.find(a => a.is_correct)?.answer_id || null,
            is_gened_by_model: question.is_gened_by_model,
            created_by_question: question.created_by_question,
            options: question.answers.map((answer) => ({
              id: answer.answer_id,        // Dùng luôn answer_id làm id (hoặc thêm id riêng)
              answer_id: answer.answer_id, // ✅ Thêm rõ ràng answer_id để PUT
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


  const createNewQuestion = (type = 'multiple_choice') => {
    if (type === 'essay') {
      return {
        type: 'essay',
        content: "",
        correct_answer: "",
        level: ""
      };
    }

    return {
      type: 'multiple_choice',
      content: "",
      options: [
        { id: uuidv4(), text: "" },
        { id: uuidv4(), text: "" },
        { id: uuidv4(), text: "" },
        { id: uuidv4(), text: "" },
      ],
      correct_option_id: "",
      level: ""
    };
  };

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

    // Validation cho câu hỏi trắc nghiệm
    if (newQuestion.type === 'multiple_choice') {
      if (newQuestion.options.some((opt) => !opt.text.trim())) {
        alert("Vui lòng nhập đầy đủ nội dung các đáp án.");
        return;
      }
      if (!newQuestion.correct_option_id) {
        alert("Vui lòng chọn đáp án đúng.");
        return;
      }
    }

    // Validation cho câu hỏi tự luận
    if (newQuestion.type === 'essay') {
      if (!newQuestion.correct_answer.trim()) {
        alert("Vui lòng nhập đáp án đúng cho câu hỏi tự luận.");
        return;
      }
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
    setQuestionType('multiple_choice');
  };

  const handleEditQuestion = (index) => {
    // Kiểm tra nếu đang chỉnh sửa câu hỏi khác
    if (showNewQuestionForm) {
      alert("Bạn đang chỉnh sửa 1 câu hỏi. Hãy lưu câu hỏi trước!");
      return;
    }

    const questionToEdit = newQuestions[index];
    setNewQuestion(questionToEdit);
    setQuestionType(questionToEdit.type);
    setEditingIndex(index);
    setShowNewQuestionForm(true);
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm("Bạn có chắc muốn xoá câu hỏi này không?")) {
      setNewQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleToggleQuestionForm = (type = null) => {
    if (showNewQuestionForm) {
      // Nếu đang hiển thị form thì hỏi xác nhận huỷ
      const confirmMessage = editingIndex !== null
        ? "Bạn có muốn huỷ chỉnh sửa câu hỏi?"
        : "Bạn có muốn huỷ thêm câu hỏi?";

      if (window.confirm(confirmMessage)) {
        setShowNewQuestionForm(false);
        setEditingIndex(null);
        setNewQuestion(createNewQuestion());
        setQuestionType('multiple_choice');
      }
    } else {
      // Nếu chưa hiển thị form và không có type (click trực tiếp vào nút) thì hiện submenu
      if (type === null) {
        setShowSubmenu(!showSubmenu);
      } else {
        // Nếu có type (chọn từ submenu) thì hiển thị form
        setQuestionType(type);
        setNewQuestion(createNewQuestion(type));
        setShowNewQuestionForm(true);
        setShowSubmenu(false);
      }
    }
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

            {/* ✅ FIX: Kiểm tra q.content trước khi render */}
            <p><strong>Câu {index + 1}:</strong> {renderWithLatex(q.content || '')}</p>

            {/* ✅ Hiển thị ảnh nếu có - dưới content */}
            {q.image && (
              <div style={{
                textAlign: 'center',
                margin: '15px 0',
                padding: '10px'
              }}>
                <img
                  src={`http://localhost:8000${q.image}`}
                  alt="Hình ảnh câu hỏi"
                  style={{
                    maxWidth: '100%',        // ✅ Giảm kích thước xuống 50%
                    width: '100%',           // ✅ Đảm bảo ảnh luôn 50% kích thước gốc
                    height: 'auto',         // Giữ tỷ lệ khung hình
                    marginTop: '10px',
                    marginBottom: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    display: 'block',       // Đảm bảo ảnh hiển thị như block element
                    margin: '10px auto'     // Center ảnh
                  }}
                  onError={(e) => {
                    console.error('Lỗi tải ảnh:', e.target.src);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Hiển thị cho câu hỏi trắc nghiệm */}
            {q.type === 'multiple_choice' && q.options && (
              <ul>
                {q.options.map((opt, idx) => (
                  <li key={opt.id}>
                    <strong>{String.fromCharCode(65 + idx)}</strong>. {renderWithLatex(opt.text || '')}
                    {q.correct_option_id === opt.id && (
                      <span className="correct-answer">
                        ✔ Đáp án đúng
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Hiển thị cho câu hỏi tự luận */}
            {q.type === 'essay' && (
              <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
                <strong>Đáp án đúng:</strong>
                <div style={{ marginTop: "5px", padding: "8px", backgroundColor: "#e8f5e8", borderRadius: "4px" }}>
                  {/* ✅ FIX: Kiểm tra q.correct_answer trước khi render */}
                  {renderWithLatex(q.correct_answer || '')}
                </div>
              </div>
            )}

            {/* Hiển thị mức độ câu hỏi */}
            {q.level && (
              <div style={{ marginTop: "8px", fontSize: "0.9em", color: "#666" }}>
                <strong>Mức độ:</strong> {q.level === 1 ? "Dễ" : q.level === 2 ? "Trung bình" : q.level === 3 ? "Khó" : "Rất khó"}
              </div>
            )}
          </div>
        ))}



        {/* NÚT THÊM CÂU HỎI VỚI SUBMENU */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => !showNewQuestionForm && setShowSubmenu(true)}
            onMouseLeave={() => setShowSubmenu(false)}
          >
            <button
              onClick={() => handleToggleQuestionForm()}
              className="btn addquestion"
              style={{ position: "relative" }}
            >
              <img
                src={showNewQuestionForm ? iconCancelQuestion : iconAddQuestion}
                alt="toggle"
                className="btn-icon"
              />
              {showNewQuestionForm ? (editingIndex !== null ? "Huỷ sửa" : "Huỷ thêm") : "Thêm câu hỏi"}
            </button>

            {/* SUBMENU */}
            {showSubmenu && !showNewQuestionForm && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                  minWidth: "200px"
                }}
              >
                <button
                  onClick={() => handleToggleQuestionForm('multiple_choice')}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 15px",
                    border: "none",
                    backgroundColor: "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  📝 Câu hỏi trắc nghiệm
                </button>
                <button
                  onClick={() => handleToggleQuestionForm('essay')}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 15px",
                    border: "none",
                    backgroundColor: "transparent",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  ✍️ Câu hỏi tự luận
                </button>
              </div>
            )}
          </div>

          <button onClick={handleSaveTest} className="btn addquestion">
            <img src={iconSave} alt="save" className="btn-icon" />
            Lưu đề thi
          </button>
        </div>

        {/* FORM THÊM/SỬA */}
        {showNewQuestionForm && (
          <div className="question-form">
            <h4>
              {editingIndex !== null ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
              {questionType === 'essay' ? ' (Tự luận)' : ' (Trắc nghiệm)'}
            </h4>

            {/* Nội dung câu hỏi */}
            <div className="form-section">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <label style={{ margin: 0 }}>Nội dung câu hỏi:</label>

                {/* Nút upload ảnh */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    id="question-image-upload"
                  />
                  <label
                    htmlFor="question-image-upload"
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#007bff",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    📷 Tải ảnh
                  </label>

                  {/* Hiển thị tên file đã chọn */}
                  {newQuestion.image && (
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {newQuestion.image.name}
                    </span>
                  )}
                </div>
              </div>

              <LatexInputKaTeX
                value={newQuestion.content}
                onChange={(value) => setNewQuestion({ ...newQuestion, content: value })}
                style={{ width: "90%", minHeight: "100px" }}
              />

              {/* Preview ảnh đã upload */}
              {newQuestion.imagePreview && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={newQuestion.imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "200px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      objectFit: "contain"
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      marginLeft: "10px",
                      padding: "4px 8px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    ✕ Xóa
                  </button>
                </div>
              )}
            </div>

            {/* Mức độ câu hỏi - ComboBox */}
            <div className="form-section">
              <label style={{ marginBottom: "10px", display: "block" }}>Mức độ câu hỏi:</label>
              <select
                value={newQuestion.level || ""}
                onChange={(e) => setNewQuestion({ ...newQuestion, level: parseInt(e.target.value, 10) })}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  marginBottom: "15px",
                }}
              >
                <option value="" disabled>Chọn mức độ</option>
                <option value="1">1 - Dễ</option>
                <option value="2">2 - Trung bình</option>
                <option value="3">3 - Khó</option>
                <option value="4">4 - Rất khó</option>
              </select>
            </div>

            {/* Nội dung dành cho câu hỏi trắc nghiệm */}
            {questionType === 'multiple_choice' && (
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
                <button
                  onClick={handleAddOption}
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ➕ Thêm đáp án
                </button>
              </div>
            )}

            {/* Nội dung dành cho câu hỏi tự luận */}
            {questionType === 'essay' && (
              <div className="form-section">
                <label style={{ marginBottom: "10px", display: "block" }}>Đáp án đúng:</label>
                <LatexInputKaTeX
                  value={newQuestion.correct_answer}
                  onChange={(value) => setNewQuestion({ ...newQuestion, correct_answer: value })}
                  style={{ width: "90%", minHeight: "100px" }}
                  placeholder="Nhập đáp án đúng cho câu hỏi tự luận..."
                />
              </div>
            )}

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

        {/* Thời lượng (phút) */}
        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Thời lượng (phút)</label>
            <input
              type="number"
              className="exam-form-input"
              value={examData.duration_minutes || ""}
              onChange={(e) =>
                setExamData({ ...examData, duration_minutes: e.target.value })
              }
              min="1"
              placeholder="Nhập số phút"
            />
          </div>
        </div>

        {/* Ca thi */}
        <div className="exam-form-row">
          <div className="exam-form-group">
            <label className="exam-form-label">Ca thi</label>
            <select
              className="exam-form-input"
              value={examData.shift?.shift_id || ""}
              onChange={(e) =>
                setExamData({
                  ...examData,
                  shift: { ...examData.shift, shift_id: e.target.value },
                })
              }
            >
              <option value="">Chọn ca thi</option>
              <option value="1">Ca 1</option>
              <option value="2">Ca 2</option>
              <option value="3">Ca 3</option>
              <option value="4">Ca 4</option>
            </select>
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

        {/* Nút lưu */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
            marginRight: "25px",
          }}
        >
          <button className="btn addcode" onClick={handleSave}>
            <FaSave className="btn-icon" /> {testId ? "Cập nhật" : "Lưu"}
          </button>
        </div>
      </div>



    </div>
  );
}

export default TeacherExamCode;