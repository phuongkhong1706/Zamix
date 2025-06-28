import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
import iconSave from "../../../../assets/icon/icon-save-white.png"
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";
import iconUpload from "../../../../assets/icon/icon-camera-white.png";
import iconEssay from "../../../../assets/icon/icon-essay-questions.png";
import iconMulti from "../../../../assets/icon/icon-multiple-choice.png";
import { FaSave } from "react-icons/fa";
import mammoth from "mammoth";


function TeacherExamCodeFromFile() {
  const [newQuestions, setNewQuestions] = useState([]);
  const navigate = useNavigate();
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [questionType, setQuestionType] = useState('multiple_choice'); // 'multiple_choice' hoặc 'essay'
  const [showSubmenu, setShowSubmenu] = useState(false);

  const { examId, testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [, setCurrentQuestionIndex] = useState(0);
  const [examData, setExamData] = useState({
    exam_name: "",
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
  const handleRemoveImage = async (questionId) => {
    const userJson = localStorage.getItem("user");
    let token = null;
    try {
      token = JSON.parse(userJson)?.token;
    } catch (err) {
      console.error("Lỗi khi đọc token:", err);
      return;
    }

    if (!token) {
      alert("Vui lòng đăng nhập lại.");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá ảnh này?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/${questionId}/remove_image/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      if (res.status === 200) {
        alert(result.message);
        setNewQuestion((prev) => ({
          ...prev,
          image: null,
          imagePreview: null
        }));
      } else {
        alert(result.message || "Lỗi không xác định khi xoá ảnh.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API xoá ảnh:", error);
      alert("Không thể kết nối server để xoá ảnh.");
    }
  };

  const handleUploadTestFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      alert("⚠️ Tạm thời chỉ hỗ trợ đọc file Word (.docx). PDF sẽ được hỗ trợ sau.");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Sử dụng mammoth để extract cả text và hình ảnh
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = result.value;

      // Extract text content
      const { value: textContent } = await mammoth.extractRawText({ arrayBuffer });

      // Parse questions từ text content
      const parsedQuestions = parseQuestionsFromText(textContent);

      // Extract images từ HTML content nếu có
      const imageMatches = htmlContent.match(/<img[^>]+src="data:image\/[^"]+"/g) || [];
      const extractedImages = imageMatches.map(match => {
        const srcMatch = match.match(/src="([^"]+)"/);
        return srcMatch ? srcMatch[1] : null;
      }).filter(Boolean);

      if (parsedQuestions.length === 0) {
        alert("⚠️ Không tìm thấy câu hỏi nào trong file.");
        return;
      }

      // Format questions với phân biệt loại và xử lý hình ảnh
      const formattedQuestions = parsedQuestions.map((q, index) => {
        // Xác định loại câu hỏi
        const questionType = determineQuestionType(q);

        // Xử lý hình ảnh cho câu hỏi (nếu có)
        const questionImage = extractedImages[index] || null;

        if (questionType === 'multiple_choice') {
          return {
            content: q.question,
            level: q.level || null,
            options: q.answers.map((text, idx) => ({
              id: idx + 1,
              text: cleanAnswerText(text),
            })),
            correct_option_id: q.correct_option_id || null,
            type: 'multiple_choice',
            score: q.score || 1.0,
            is_gened_by_model: false,
            created_by_question: false,
            imagePreview: questionImage,
            image: null,
          };
        } else {
          return {
            content: q.question,
            level: q.level || null,
            correct_answer: q.correct_answer || q.answers?.[0] || '',
            type: 'essay',
            score: q.score || 2.0,
            is_gened_by_model: false,
            created_by_question: false,
            imagePreview: questionImage,
            image: null,
          };
        }
      });

      // Set questions vào state
      setNewQuestions(formattedQuestions);
      setQuestions(parsedQuestions);
      setCurrentQuestionIndex(0);
      setEditingIndex(null);

      // Load question đầu tiên
      if (parsedQuestions.length > 0) {
        loadQuestionAtIndex(0, parsedQuestions);
      }

      // Thông báo kết quả
      const multipleChoiceCount = formattedQuestions.filter(q => q.type === 'multiple_choice').length;
      const essayCount = formattedQuestions.filter(q => q.type === 'essay').length;
      const imageCount = formattedQuestions.filter(q => q.imagePreview).length;

      alert(
        `✅ Đã tải và phân tích ${parsedQuestions.length} câu hỏi:\n` +
        `📝 Trắc nghiệm: ${multipleChoiceCount}\n` +
        `✍️ Tự luận: ${essayCount}\n` +
        `🖼️ Có hình ảnh: ${imageCount}`
      );

    } catch (error) {
      console.error("Lỗi đọc file:", error);
      alert("❌ Có lỗi khi đọc file. Kiểm tra lại định dạng hoặc nội dung file.");
    }
  };

  // Hàm xác định loại câu hỏi được cải thiện
  const determineQuestionType = (question) => {
    // Ưu tiên kiểm tra cấu trúc trắc nghiệm trước
    const hasValidOptions = question.answers && question.answers.length >= 2;

    // Kiểm tra format trắc nghiệm rõ ràng
    const hasMultipleChoiceFormat = question.answers?.some(answer => {
      const trimmed = answer.trim();
      return /^[A-D][.)]\s/.test(trimmed) || /^[ABCD]\s*[.)]/.test(trimmed);
    });

    // Kiểm tra có đáp án đúng được chỉ định không
    const hasCorrectOption = question.correct_option_id !== null ||
      question.correct_option_letter !== null;

    // Nếu có format trắc nghiệm rõ ràng và có đủ options
    if (hasMultipleChoiceFormat && hasValidOptions) {
      return 'multiple_choice';
    }

    // Nếu có 2-6 options và có đáp án đúng được chỉ định
    if (hasValidOptions && question.answers.length <= 6 && hasCorrectOption) {
      return 'multiple_choice';
    }

    // Kiểm tra từ khóa tự luận (chỉ khi không có cấu trúc trắc nghiệm rõ ràng)
    if (!hasMultipleChoiceFormat && !hasCorrectOption) {
      const essayKeywords = [
        'giải thích', 'phân tích', 'nhận xét', 'bình luận', 'trình bày',
        'so sánh', 'đánh giá', 'nêu ý kiến', 'tại sao', 'như thế nào',
        'viết đoạn văn', 'viết bài', 'làm bài tập', 'mô tả', 'chứng minh'
      ];

      const questionContent = question.question?.toLowerCase() || '';
      const hasEssayKeywords = essayKeywords.some(keyword =>
        questionContent.includes(keyword)
      );

      if (hasEssayKeywords) {
        return 'essay';
      }
    }

    // Mặc định: nếu có options hợp lệ thì là trắc nghiệm, không thì là tự luận
    return hasValidOptions ? 'multiple_choice' : 'essay';
  };

  // Hàm làm sạch text đáp án
  const cleanAnswerText = (text) => {
    if (!text) return '';
    // Loại bỏ prefix A., B., C., D. hoặc A), B), C), D)
    return text.replace(/^[A-D][.)]\s*/i, '').trim();
  };

  // Hàm parseQuestionsFromText được cải thiện
  const parseQuestionsFromText = (text) => {
    const questions = [];

    // Tách các câu hỏi dựa trên pattern "Câu X:"
    const questionMatches = [...text.matchAll(/Câu\s*(\d+)[.:]/gi)];
    const blocks = text.split(/Câu\s*\d+[.:]/i).map(b => b.trim()).filter(Boolean);

    blocks.forEach((block, index) => {
      const questionNumber = questionMatches[index]?.[1] || `${index + 1}`;
      let cleanedBlock = block.replace(/^Câu\s*\d+[.:]?\s*/i, '');

      // Extract level từ đầu block
      let level = null;
      const levelMatch = cleanedBlock.match(/(?:Mức\s*độ|Level)[\s:]*(\d+)/i);
      if (levelMatch) {
        level = parseInt(levelMatch[1]);
        cleanedBlock = cleanedBlock.replace(/(?:Mức\s*độ|Level)[\s:]*\d+/i, '').trim();
      }

      // Tách phần đáp án đúng (nếu có)
      let correctLetter = null;
      let correct_answer = '';

      // Tìm "Đáp án đúng: X" hoặc "Đáp án: X"
      const correctMatch = cleanedBlock.match(/(?:Đáp\s*án\s*(?:đúng)?|Answer)[\s:]*([A-D])\s*/i);
      if (correctMatch) {
        correctLetter = correctMatch[1].toUpperCase();
        cleanedBlock = cleanedBlock.replace(/(?:Đáp\s*án\s*(?:đúng)?|Answer)[\s:]*[A-D]\s*/i, '').trim();
      } else {
        // Tìm đáp án tự luận
        const essayAnswerMatch = cleanedBlock.match(/(?:Đáp\s*án|Answer)[\s:]*([^]*?)(?=\n\s*Câu\s*\d+|$)/i);
        if (essayAnswerMatch) {
          correct_answer = essayAnswerMatch[1].trim();
          cleanedBlock = cleanedBlock.replace(/(?:Đáp\s*án|Answer)[\s:]*[^]*$/i, '').trim();
        }
      }

      // Phân tách question và answers
      const lines = cleanedBlock.split(/\n/).map(line => line.trim()).filter(Boolean);

      let questionText = '';
      let answers = [];
      let foundAnswers = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Kiểm tra xem có phải là đáp án A, B, C, D không
        if (/^[A-D][.．)]\s*/i.test(line)) {
          foundAnswers = true;
          answers.push(line);
        } else if (!foundAnswers) {
          // Nếu chưa gặp đáp án thì là phần câu hỏi
          questionText += (questionText ? ' ' : '') + line;
        }
      }

      // Nếu không tìm thấy câu hỏi rõ ràng, lấy dòng đầu tiên
      if (!questionText && lines.length > 0) {
        questionText = lines[0];
      }

      // Tính correct_option_id
      let correct_option_id = null;
      if (correctLetter && answers.length > 0) {
        const correctIndex = answers.findIndex(ans =>
          ans.trim().toLowerCase().startsWith(correctLetter.toLowerCase())
        );
        if (correctIndex !== -1) {
          correct_option_id = correctIndex + 1;
        }
      }

      // Tạo đối tượng câu hỏi
      if (questionText) {
        questions.push({
          question: `Câu ${questionNumber}: ${questionText}`,
          answers: answers,
          correct_option_letter: correctLetter,
          correct_option_id: correct_option_id,
          correct_answer: correct_answer,
          level: level,
          score: answers.length > 0 ? 1.0 : 2.0
        });
      }
    });

    return questions;
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

  try {
    if (userJson) {
      const userObj = JSON.parse(userJson);
      token = userObj.token;
      userId = userObj.user_id;
    }
  } catch (error) {
    console.error("❌ Lỗi khi parse user từ localStorage:", error);
  }

  if (!token) {
    alert("❌ Token không tồn tại hoặc lỗi khi đọc token. Vui lòng đăng nhập lại.");
    return;
  }

  if (!testId) {
    alert('❌ Vui lòng điền thông tin đề thi trước.');
    return;
  }

  // Tạo bản sao để cập nhật IDs
  let updatedQuestions = newQuestions.map((q) => ({
    ...q,
    options: q.options ? q.options.map((opt) => ({ ...opt })) : [],
  }));

  console.log('📋 Câu hỏi trước khi lưu:', updatedQuestions);

  // 🔥 Thêm loading state để tránh spam click
  let isProcessing = false;
  if (isProcessing) {
    alert("⏳ Đang xử lý, vui lòng đợi...");
    return;
  }
  isProcessing = true;

  try {
    for (let qIndex = 0; qIndex < updatedQuestions.length; qIndex++) {
      const question = updatedQuestions[qIndex];

      // Loại bỏ tiền tố "Câu x: ..." trong nội dung câu hỏi
      const cleanedQuestionContent = question.content
        ? question.content.replace(/^Câu\s*\d+[.:]?\s*/i, '').trim()
        : '';

      // 🔥 Validate nội dung câu hỏi
      if (!cleanedQuestionContent.trim()) {
        alert(`❌ Câu hỏi ${qIndex + 1} không có nội dung!`);
        isProcessing = false;
        return;
      }

      // Xác định method và URL dựa trên việc có ID hay không
      const isNewQuestion = !question.id && !question.question_id;
      const questionId = question.id || question.question_id;
      const questionUrl = isNewQuestion
        ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/`
        : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/${questionId}/`;
      const questionMethod = isNewQuestion ? "POST" : "PUT";

      try {
        console.log(`\n📝 ${questionMethod} câu hỏi ${qIndex + 1}:`, questionUrl, cleanedQuestionContent);

        // Chuẩn bị dữ liệu câu hỏi
        let requestData;
        let requestHeaders = {
          Authorization: `Bearer ${token}`,
        };

        // 🔥 Xử lý FormData cho hình ảnh
        if (question.image) {
          const formData = new FormData();
          formData.append('test', testId.toString());
          formData.append('content', cleanedQuestionContent);
          formData.append('type', question.type || "single");
          formData.append('score', parseFloat(question.score || 1.0).toString());
          formData.append('level', parseInt(question.level || 1).toString());
          formData.append('is_gened_by_model', question.is_gened_by_model ? '1' : '0');
          formData.append('created_by_question', question.created_by_question ? '1' : '0');
          formData.append('user', userId.toString());
          
          // 🔥 Xử lý image với validation
          try {
            if (question.image instanceof File) {
              // Validate file size (max 5MB)
              if (question.image.size > 5 * 1024 * 1024) {
                alert(`❌ Hình ảnh câu hỏi ${qIndex + 1} quá lớn (>5MB)!`);
                isProcessing = false;
                return;
              }
              formData.append('image', question.image);
            } else if (typeof question.image === 'string') {
              if (question.image.startsWith('data:')) {
                // Convert base64 to blob
                const response = await fetch(question.image);
                const blob = await response.blob();
                
                // Validate blob size
                if (blob.size > 5 * 1024 * 1024) {
                  alert(`❌ Hình ảnh câu hỏi ${qIndex + 1} quá lớn (>5MB)!`);
                  isProcessing = false;
                  return;
                }
                
                formData.append('image', blob, `question_${qIndex + 1}.jpg`);
              } else if (question.image.startsWith('http')) {
                // Nếu là URL, có thể bỏ qua hoặc download về
                console.log(`⚠️ Image URL detected for question ${qIndex + 1}, skipping...`);
              }
            }
          } catch (imageError) {
            console.error("❌ Lỗi xử lý hình ảnh:", imageError);
            alert(`❌ Lỗi xử lý hình ảnh câu hỏi ${qIndex + 1}: ${imageError.message}`);
            isProcessing = false;
            return;
          }

          requestData = formData;
          // ✅ KHÔNG set Content-Type khi dùng FormData
        } else {
          // Không có hình ảnh, sử dụng JSON
          requestData = JSON.stringify({
            test: parseInt(testId),
            content: cleanedQuestionContent,
            type: question.type || "single",
            score: parseFloat(question.score || 1.0),
            level: parseInt(question.level || 1),
            is_gened_by_model: Boolean(question.is_gened_by_model),
            created_by_question: Boolean(question.created_by_question),
            user: parseInt(userId),
          });

          requestHeaders['Content-Type'] = 'application/json';
        }

        const qRes = await fetch(questionUrl, {
          method: questionMethod,
          headers: requestHeaders,
          body: requestData,
        });

        let qJson;
        try {
          qJson = await qRes.json();
        } catch (parseError) {
          console.error("❌ Lỗi parse response:", parseError);
          alert(`❌ Server trả về dữ liệu không hợp lệ cho câu hỏi ${qIndex + 1}`);
          isProcessing = false;
          return;
        }

        console.log("✅ Phản hồi câu hỏi:", qJson);

        if (!qRes.ok) {
          console.error("❌ Lỗi khi lưu câu hỏi:", qJson);
          alert(`❌ Lỗi khi lưu câu hỏi ${qIndex + 1}: ${qJson.detail || qJson.message || qJson.error || "Không rõ lỗi"}`);
          isProcessing = false;
          return;
        }

        // Cập nhật question ID nếu là câu hỏi mới
        const savedQuestionId = qJson.id || qJson.question_id || questionId;
        if (isNewQuestion) {
          updatedQuestions[qIndex].question_id = savedQuestionId;
          updatedQuestions[qIndex].id = savedQuestionId;
        }

        // 🔥 Xử lý đáp án dựa trên loại câu hỏi
        if (question.type === 'essay') {
          // Xử lý câu hỏi tự luận
          const essayAnswer = question.correct_answer || question.answer || '';
          
          if (essayAnswer.trim()) {
            const existingAnswer = updatedQuestions[qIndex].options?.[0];
            const isNewAnswer = !existingAnswer?.answer_id;

            const answerUrl = isNewAnswer
              ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/`
              : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/${existingAnswer.answer_id}/`;
            const answerMethod = isNewAnswer ? 'POST' : 'PUT';

            const answerData = {
              question: parseInt(savedQuestionId),
              content: essayAnswer.trim(), // ✅ Trim whitespace
              is_correct: true,
              user: parseInt(userId),
            };

            console.log(`\n📦 ${answerMethod} đáp án tự luận câu ${qIndex + 1}:`, answerUrl, answerData);

            const answerRes = await fetch(answerUrl, {
              method: answerMethod,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(answerData),
            });

            let answerResJson;
            try {
              answerResJson = await answerRes.json();
            } catch (parseError) {
              console.error("❌ Lỗi parse answer response:", parseError);
              alert(`❌ Server trả về dữ liệu không hợp lệ cho đáp án câu ${qIndex + 1}`);
              isProcessing = false;
              return;
            }

            console.log("✅ Phản hồi đáp án tự luận:", answerResJson);

            if (!answerRes.ok) {
              console.error("❌ Lỗi khi lưu đáp án tự luận:", answerResJson);
              alert(`❌ Lỗi lưu đáp án tự luận câu ${qIndex + 1}: ${answerResJson.detail || answerResJson.message || answerResJson.error || "Không rõ lỗi"}`);
              isProcessing = false;
              return;
            }

            // ✅ Cập nhật cấu trúc đáp án tự luận
            const savedAnswerId = answerResJson.answer_id || answerResJson.id;
            if (isNewAnswer) {
              updatedQuestions[qIndex].options = [{
                answer_id: savedAnswerId,
                text: essayAnswer.trim(),
                content: essayAnswer.trim(),
                is_correct: true
              }];
            } else {
              // Cập nhật đáp án hiện có
              updatedQuestions[qIndex].options[0] = {
                ...updatedQuestions[qIndex].options[0],
                text: essayAnswer.trim(),
                content: essayAnswer.trim(),
                is_correct: true
              };
            }
            
            // ✅ Cập nhật correct_answer trong question
            updatedQuestions[qIndex].correct_answer = essayAnswer.trim();
          } else {
            console.warn(`⚠️ Câu tự luận ${qIndex + 1} không có đáp án`);
          }
        } else {
          // 🔥 Xử lý câu hỏi trắc nghiệm với validation
          const questionOptions = question.options || [];
          
          if (questionOptions.length === 0) {
            alert(`❌ Câu hỏi trắc nghiệm ${qIndex + 1} không có đáp án nào!`);
            isProcessing = false;
            return;
          }

          // Kiểm tra có đáp án đúng không
          const hasCorrectAnswer = questionOptions.some(opt => opt.id === question.correct_option_id);
          if (!hasCorrectAnswer && question.correct_option_id) {
            console.warn(`⚠️ Câu hỏi ${qIndex + 1} không tìm thấy đáp án đúng với ID: ${question.correct_option_id}`);
          }

          for (let optIndex = 0; optIndex < questionOptions.length; optIndex++) {
            const option = questionOptions[optIndex];

            // Loại bỏ tiền tố "A.", "B.", ... trong nội dung đáp án
            const cleanedOptionText = option.text
              ? option.text.replace(/^[A-D][.．]\s*/i, '').trim()
              : '';

            if (!cleanedOptionText) {
              alert(`❌ Đáp án ${optIndex + 1} của câu hỏi ${qIndex + 1} không có nội dung!`);
              isProcessing = false;
              return;
            }

            const isNewAnswer = !option.answer_id;
            const answerUrl = isNewAnswer
              ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/`
              : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/${option.answer_id}/`;
            const answerMethod = isNewAnswer ? "POST" : "PUT";

            const answerData = {
              question: parseInt(savedQuestionId),
              content: cleanedOptionText,
              is_correct: option.id === question.correct_option_id,
              user: parseInt(userId),
            };

            console.log(`\n📦 ${answerMethod} đáp án ${optIndex + 1} của câu ${qIndex + 1}:`, answerUrl, answerData);

            const answerRes = await fetch(answerUrl, {
              method: answerMethod,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(answerData),
            });

            let answerResJson;
            try {
              answerResJson = await answerRes.json();
            } catch (parseError) {
              console.error("❌ Lỗi parse answer response:", parseError);
              alert(`❌ Server trả về dữ liệu không hợp lệ cho đáp án ${optIndex + 1} của câu ${qIndex + 1}`);
              isProcessing = false;
              return;
            }

            console.log("✅ Phản hồi đáp án:", answerResJson);

            if (!answerRes.ok) {
              console.error("❌ Lỗi khi lưu đáp án:", answerResJson);
              alert(`❌ Lỗi lưu đáp án ${optIndex + 1} của câu ${qIndex + 1}: ${answerResJson.detail || answerResJson.message || answerResJson.error || "Không rõ lỗi"}`);
              isProcessing = false;
              return;
            }

            // Cập nhật answer ID nếu là đáp án mới
            if (isNewAnswer) {
              updatedQuestions[qIndex].options[optIndex].answer_id = answerResJson.answer_id || answerResJson.id;
            }
          }
        }

      } catch (error) {
        console.error(`❌ Lỗi khi xử lý câu hỏi ${qIndex + 1}:`, error);
        alert(`❌ Lỗi khi xử lý câu hỏi ${qIndex + 1}: ${error.message || "Không thể kết nối tới server"}`);
        isProcessing = false;
        return;
      }
    }

    // ✅ Cập nhật state với dữ liệu mới
    setNewQuestions(updatedQuestions);
    console.log('🎯 newQuestions sau khi lưu:', updatedQuestions);

    alert("✅ Lưu toàn bộ câu hỏi và đáp án thành công!");

    // Navigate đến trang quản lý đề thi
    if (typeof navigate === 'function' && examId) {
      navigate(`/teacher/exams/exam_management/exam_add/${examId}/exam_code/${testId}`);
    }

  } finally {
    // ✅ Đảm bảo reset processing state
    isProcessing = false;
  }
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
          exam_name: data.exam_name || '',
          name: data.name || '',
          type: data.type || '',
          duration_minutes: data.duration_minutes || '',
          shift: data.shift || null, // vì shift_id nằm bên trong shift
        });

        // 📝 Cập nhật danh sách câu hỏi và đáp án
        if (Array.isArray(data.questions)) {
          const formattedQuestions = data.questions.map((question) => ({
            question_id: question.question_id,
            content: question.content,
            type: question.type,
            level: question.level,
            score: question.score,
            image: question.image || null,
            correct_option_id: question.answers.find((a) => a.is_correct)?.answer_id || null,
            is_gened_by_model: question.is_gened_by_model,
            created_by_question: question.created_by_question,
            options: question.answers.map((answer) => ({
              id: answer.answer_id,
              answer_id: answer.answer_id,
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
      alert('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    if (newQuestion.type === 'multiple_choice') {
      if (newQuestion.options.some((opt) => !opt.text.trim())) {
        alert('Vui lòng nhập đầy đủ nội dung các đáp án.');
        return;
      }
      if (!newQuestion.correct_option_id) {
        alert('Vui lòng chọn đáp án đúng.');
        return;
      }
    }

    if (newQuestion.type === 'essay') {
      if (!newQuestion.correct_answer.trim()) {
        alert('Vui lòng nhập đáp án đúng cho câu hỏi tự luận.');
        return;
      }
    }

    const updatedQuestion = {
      ...newQuestion,
      imagePreview: newQuestion.imagePreview || null,
    };

    if (editingIndex !== null) {
      const updated = [...newQuestions];
      updated[editingIndex] = updatedQuestion;
      setNewQuestions(updated);
    } else {
      setNewQuestions((prev) => [...prev, updatedQuestion]);
    }

    setNewQuestion(createNewQuestion());
    setEditingIndex(null);
    setShowNewQuestionForm(false);
    setQuestionType('multiple_choice');
  };

  const handleEditQuestion = (index) => {
    if (showNewQuestionForm) {
      alert('Bạn đang chỉnh sửa 1 câu hỏi. Hãy lưu câu hỏi trước!');
      return;
    }

    const questionToEdit = newQuestions[index];

    setNewQuestion({
      ...questionToEdit,
      image: questionToEdit.image instanceof File ? questionToEdit.image : null,
      imagePreview:
        questionToEdit.imagePreview || // Ưu tiên preview đã lưu
        (questionToEdit.image && typeof questionToEdit.image === 'string'
          ? `http://localhost:8000${questionToEdit.image}`
          : null),
    });

    setQuestionType(questionToEdit.type);
    setEditingIndex(index);
    setShowNewQuestionForm(true);
  };

  const handleDeleteQuestion = async (index) => {
    if (!window.confirm('Bạn có chắc muốn xoá câu hỏi này không?')) {
      return;
    }

    const question = newQuestions[index];
    if (!question || !question.question_id) {
      alert('❌ Không tìm thấy question_id của câu hỏi để xóa.');
      return;
    }

    const userJson = localStorage.getItem('user');
    let token = null;

    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        token = userObj.token;
      } catch (error) {
        console.error('❌ Lỗi parse user:', error);
      }
    }

    if (!token) {
      alert('⚠️ Token không tồn tại. Vui lòng đăng nhập lại.');
      return;
    }

    const deleteUrl = `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/${question.question_id}/`;

    try {
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('✅ Xoá câu hỏi thành công!');
        setNewQuestions((prev) => prev.filter((_, i) => i !== index));
      } else {
        const resText = await res.text();
        let errorJson = {};
        try {
          errorJson = JSON.parse(resText);
        } catch (_) {
          errorJson = { message: resText };
        }
        alert(`❌ Lỗi: ${errorJson.message || errorJson.error || 'Không xác định'}`);
      }
    } catch (error) {
      console.error('❌ Lỗi khi xoá câu hỏi:', error);
      alert('🚫 Không thể kết nối tới server.');
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

            {/* NỘI DUNG CÂU HỎI */}
            <p>
              <strong>Câu {index + 1}:</strong>{" "}
              {q.content
                ? renderWithLatex(q.content.replace(/^Câu\s*\d+[.:]?\s*/i, '').trim())
                : <em style={{ color: "gray" }}>Không có nội dung</em>
              }
            </p>

            {/* HIỂN THỊ HÌNH ẢNH (nếu có) */}
            {q.imagePreview ? (
              <img
                src={q.imagePreview}
                alt={`Hình minh hoạ câu hỏi ${index + 1}`}
                style={{
                  maxWidth: '100%',
                  width: '100%',
                  height: 'auto',
                  marginTop: '10px',
                  marginBottom: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  display: 'block',
                  margin: '10px auto'
                }}
              />
            ) : q.image ? (
              <img
                src={`http://localhost:8000${q.image}`}
                alt={`Hình minh hoạ câu hỏi ${index + 1}`}
                style={{
                  maxWidth: '100%',
                  width: '100%',
                  height: 'auto',
                  marginTop: '10px',
                  marginBottom: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  display: 'block',
                  margin: '10px auto'
                }}
              />
            ) : null}

            {/* FORM SỬA CÂU HỎI */}
            {showNewQuestionForm && editingIndex === index && (
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
                          padding: "8px 10px",
                          backgroundColor: "#6e3f76",
                          color: "white",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "13px",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px"
                        }}
                      >
                        <img src={iconUpload} alt="upload" className="btn-icon" /> Tải ảnh
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
                        onClick={() => handleRemoveImage(newQuestion.question_id)}
                        style={{
                          marginLeft: "10px",
                          padding: "4px 8px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}
                      >
                        ✕ Xoá
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
                  {/* Nút Hủy sửa / Hủy thêm */}
                  <button
                    onClick={handleToggleQuestionForm}
                    className="btn addquestion"
                    style={{
                      marginTop: "12px",
                      padding: "12px 18px",
                      transform: "scale(1.0)",
                      transformOrigin: "center",
                    }}
                  >
                    <img
                      src={showNewQuestionForm ? iconCancelQuestion : iconAddQuestion}
                      alt="toggle"
                      className="btn-icon"
                      style={{ width: "10px", height: "10px" }}
                    />
                    {showNewQuestionForm
                      ? editingIndex !== null
                        ? "Hủy sửa"
                        : "Hủy thêm"
                      : "Thêm câu hỏi"}
                  </button>

                  {/* Nút Lưu chỉnh sửa / Lưu câu hỏi */}
                  <button onClick={handleAddOrEditQuestion} className="save-btn">
                    <img src={iconSave} alt="save3" className="btn-icon" />
                    {editingIndex !== null ? "Lưu chỉnh sửa" : "Lưu câu hỏi"}
                  </button>
                </div>
              </div>
            )}

            {/* HIỂN THỊ THEO LOẠI CÂU HỎI */}
            {/* Hiển thị cho câu hỏi trắc nghiệm */}
            {q.type === 'multiple_choice' && q.options && q.options.length > 0 && (
              <ul style={{ marginTop: "15px" }}>
                {q.options.map((opt, idx) => {
                  // Loại bỏ prefix A. / B. / C. / D. nếu còn trong text
                  const cleanedText = opt.text ? opt.text.replace(/^[A-D][.．]\s*/i, '').trim() : '';
                  return (
                    <li key={opt.id} style={{ marginBottom: "8px" }}>
                      <strong>{String.fromCharCode(65 + idx)}</strong>.{" "}
                      {renderWithLatex(cleanedText)}
                      {q.correct_option_id === opt.id && (
                        <span className="correct-answer" style={{
                          marginLeft: "10px",
                          color: "#28a745",
                          fontWeight: "bold",
                          fontSize: "0.9em"
                        }}>
                          <img src={iconCorrect} alt="correct" className="btn-icon" /> Đáp án đúng
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Hiển thị cho câu hỏi tự luận */}
            {q.type === 'essay' && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "4px",
                }}
              >
                <strong>Đáp án đúng:</strong>
                <div
                  style={{
                    marginTop: "5px",
                    padding: "8px",
                    backgroundColor: "#e8f5e8",
                    borderRadius: "4px",
                  }}
                >
                  {renderWithLatex(
                    q.correct_answer ? q.correct_answer : ''
                  )}
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




        {/* NÚT THÊM CÂU HỎI */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
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
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      padding: "8px 10px",
                      border: "none",
                      backgroundColor: "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      gap: "5px"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    <img src={iconMulti} alt="multi" className="btn-icon" /> Câu hỏi trắc nghiệm
                  </button>
                  <button
                    onClick={() => handleToggleQuestionForm('essay')}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      padding: "8px 10px",
                      border: "none",
                      backgroundColor: "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      gap: "5px"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    <img src={iconEssay} alt="essay" className="btn-icon" /> Câu hỏi tự luận
                  </button>
                </div>
              )}
            </div>

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
        {showNewQuestionForm && editingIndex === null && (
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
                      padding: "8px 10px",
                      backgroundColor: "#6e3f76",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "13px",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    <img src={iconUpload} alt="upload2" className="btn-icon" /> Tải ảnh
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
                    onClick={() => handleRemoveImage(newQuestion.question_id)}
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

            <button onClick={handleAddOrEditQuestion} className="save-btn">
              <img src={iconSave} alt="save2" className="btn-icon" /> {editingIndex !== null ? "Lưu chỉnh sửa" : "Lưu câu hỏi"}
            </button>

          </div>
        )}


      </div>

      {/* SIDEBAR THÔNG TIN KỲ THI */}
      <div className="sidebar-container">
        <div className="exam-form-title">{examData.exam_name}</div>

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

export default TeacherExamCodeFromFile;