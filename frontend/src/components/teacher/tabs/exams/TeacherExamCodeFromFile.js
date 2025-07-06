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
import JSZip from "jszip";

function TeacherExamCodeFromFile() {
  const [newQuestions, setNewQuestions] = useState([]);
  const navigate = useNavigate();
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [questionType, setQuestionType] = useState('multiple_choice'); // 'multiple_choice' hoặc 'essay'
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_topic_exam/")
      .then((res) => {
        console.log("Topics:", res.data);
        setTopics(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách chủ đề:", err);
      });
  }, []);
  const base64ToBlob = (base64Data) => {
    const parts = base64Data.split(',');
    const byteString = atob(parts[1]);
    const mimeString = parts[0].match(/:(.*?);/)[1];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  const { examId, testId: paramTestId } = useParams();
  const [testId, setTestId] = useState(paramTestId); // copy giá trị ban đầu từ param
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

  // bắt đầu đoạn thêm
  // Import JSZip nếu chưa có
// npm install jszip

const handleUploadTestFile = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.type === "application/pdf") {
    alert("⚠️ Tạm thời chỉ hỗ trợ đọc file Word (.docx). PDF sẽ được hỗ trợ sau.");
    return;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // === BƯỚC 1: EXTRACT EQUATIONS TỪ XML ===
    console.log("🔍 Phân tích equations từ DOCX XML...");
    const xmlEquations = await extractEquationsFromDocxXML(arrayBuffer);
    console.log(`Found ${xmlEquations.length} equations in XML`);

    // === BƯỚC 2: XỬ LÝ VỚI MAMMOTH ===
    console.log("📄 Xử lý document với Mammoth...");
    const mammothOptions = {
      arrayBuffer,
      includeEmbeddedStyleMap: true,
      includeDefaultStyleMap: true,
      
      // Custom image handling với unique ID
      convertImage: mammoth.images.imgElement(function(image) {
        return image.read("base64").then(function(imageBuffer) {
          const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          return {
            src: "data:" + image.contentType + ";base64," + imageBuffer,
            id: imageId,
            alt: `Image ${imageId}`,
            class: "docx-image"
          };
        });
      }),
      
      // Transform document để xử lý equations
      transformDocument: (document) => {
        let equationIndex = 0;
        
        const walkElement = (element) => {
          if (element.children) {
            element.children.forEach((child, index) => {
              // Detect các loại equation khác nhau
              if (child.type === 'equation' || 
                  child.type === 'mathml' ||
                  child.type === 'omml' ||
                  child.type === 'embeddedObject' ||
                  (child.type === 'run' && child.properties && child.properties.equation)) {
                
                console.log(`Found equation ${equationIndex}:`, child);
                
                // Tìm equation content từ XML nếu có
                const xmlEquation = xmlEquations[equationIndex];
                const equationContent = xmlEquation ? xmlEquation.content : `Công thức ${equationIndex + 1}`;
                
                // Thay thế equation bằng text placeholder
                child.type = 'text';
                child.value = `📐[${equationContent}]`;
                
                equationIndex++;
              }
              
              walkElement(child);
            });
          }
        };
        
        walkElement(document);
        return document;
      }
    };

    const mammothResult = await mammoth.convertToHtml(mammothOptions);
    const htmlContent = mammothResult.value;
    const messages = mammothResult.messages;

    // Log warnings
    if (messages.length > 0) {
      console.warn("Mammoth warnings:", messages);
    }

    // === BƯỚC 3: EXTRACT RAW TEXT ===
    console.log("📝 Extract raw text...");
    const textResult = await mammoth.extractRawText({
      arrayBuffer,
      transformDocument: (document) => {
        let equationIndex = 0;
        
        const walkElement = (element) => {
          if (element.children) {
            element.children.forEach((child) => {
              if (child.type === 'equation' || 
                  child.type === 'mathml' ||
                  child.type === 'omml' ||
                  child.type === 'embeddedObject' ||
                  (child.type === 'run' && child.properties && child.properties.equation)) {
                
                const xmlEquation = xmlEquations[equationIndex];
                const equationContent = xmlEquation ? xmlEquation.content : `Công thức ${equationIndex + 1}`;
                
                child.type = 'text';
                child.value = `📐[${equationContent}]`;
                
                equationIndex++;
              }
              
              walkElement(child);
            });
          }
        };
        
        walkElement(document);
        return document;
      }
    });

    const textContent = textResult.value;
    console.log("Processed text content:", textContent.substring(0, 500) + "...");

    // === BƯỚC 4: PARSE QUESTIONS ===
    console.log("🔍 Parsing questions...");
    const parsedQuestions = parseQuestionsFromText(textContent);

    if (parsedQuestions.length === 0) {
      alert("⚠️ Không tìm thấy câu hỏi nào trong file.");
      return;
    }

    // === BƯỚC 5: EXTRACT VÀ MAP IMAGES ===
    console.log("🖼️ Mapping images to questions...");
    const questionsWithImages = mapImagesToQuestions(parsedQuestions, htmlContent);

    // === BƯỚC 6: FORMAT QUESTIONS ===
    console.log("📋 Formatting questions...");
    const formattedQuestions = questionsWithImages.map((q, index) => {
      const questionType = determineQuestionType(q);
      const mainTopicName = topics.find(t => t.topic_id === q.mainTopicId)?.name || null;

      const baseQuestion = {
        content: q.question,
        level: q.level || null,
        mainTopicId: q.mainTopicId || null,
        mainTopicName: mainTopicName,
        is_gened_by_model: false,
        created_by_question: false,
        imagePreview: q.imagePreview || null,
        image: null,
      };

      if (questionType === 'multiple_choice') {
        return {
          ...baseQuestion,
          options: q.answers.map((text, idx) => ({
            id: idx + 1,
            text: cleanAnswerText(text),
          })),
          correct_option_id: q.correct_option_id || null,
          type: 'multiple_choice',
          score: q.score || 1.0,
        };
      } else {
        return {
          ...baseQuestion,
          correct_answer: q.correct_answer || q.answers?.[0] || '',
          type: 'essay',
          score: q.score || 2.0,
        };
      }
    });

    // === BƯỚC 7: SET STATE ===
    setNewQuestions(formattedQuestions);
    setQuestions(parsedQuestions);
    setCurrentQuestionIndex(0);
    setEditingIndex(null);

    if (parsedQuestions.length > 0) {
      loadQuestionAtIndex(0, parsedQuestions);
    }

    // === BƯỚC 8: THÔNG BÁO KẾT QUẢ ===
    const multipleChoiceCount = formattedQuestions.filter(q => q.type === 'multiple_choice').length;
    const essayCount = formattedQuestions.filter(q => q.type === 'essay').length;
    const imageCount = formattedQuestions.filter(q => q.imagePreview).length;
    const equationCount = xmlEquations.length;

    alert(
      `✅ Đã tải và phân tích ${parsedQuestions.length} câu hỏi:\n` +
      `📝 Trắc nghiệm: ${multipleChoiceCount}\n` +
      `✍️ Tự luận: ${essayCount}\n` +
      `🖼️ Có hình ảnh: ${imageCount}\n` +
      `📐 Phát hiện ${equationCount} công thức toán học\n` +
      `${messages.length > 0 ? `⚠️ ${messages.length} cảnh báo khi xử lý` : ''}`
    );

  } catch (error) {
    console.error("Lỗi đọc file:", error);
    alert("❌ Có lỗi khi đọc file. Kiểm tra lại định dạng hoặc nội dung file.");
  }
};

// === HELPER FUNCTIONS ===

// Extract equations từ DOCX XML
const extractEquationsFromDocxXML = async (arrayBuffer) => {
  try {
    // Dynamic import JSZip
    const JSZip = (await import('jszip')).default;
    
    const zip = new JSZip();
    const docxContent = await zip.loadAsync(arrayBuffer);
    
    // Đọc document.xml
    const documentXMLFile = docxContent.file('word/document.xml');
    if (!documentXMLFile) {
      console.warn("Không tìm thấy document.xml");
      return [];
    }
    
    const documentXML = await documentXMLFile.async('string');
    
    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(documentXML, 'text/xml');
    
    const equations = [];
    
    // Tìm Office Math elements
    const mathElements = xmlDoc.querySelectorAll('m\\:oMath, oMath');
    mathElements.forEach((mathEl, index) => {
      // Extract text content từ math element
      const mathText = extractMathText(mathEl);
      equations.push({
        index: index,
        type: 'oMath',
        content: mathText || `Công thức ${index + 1}`,
        xml: mathEl.outerHTML
      });
    });
    
    // Tìm equation objects
    const objectElements = xmlDoc.querySelectorAll('w\\:object, object');
    objectElements.forEach((objEl, index) => {
      const objData = objEl.querySelector('w\\:objectEmbed, objectEmbed');
      if (objData) {
        equations.push({
          index: mathElements.length + index,
          type: 'object',
          content: `Equation Object ${index + 1}`,
          xml: objEl.outerHTML
        });
      }
    });
    
    return equations;
  } catch (error) {
    console.error("Error parsing DOCX XML:", error);
    return [];
  }
};

// Extract math text từ math element
const extractMathText = (mathElement) => {
  try {
    // Tìm text content trong math element
    const textNodes = mathElement.querySelectorAll('m\\:t, t');
    if (textNodes.length > 0) {
      return Array.from(textNodes).map(node => node.textContent).join('');
    }
    
    // Fallback: lấy toàn bộ text content
    const textContent = mathElement.textContent?.trim();
    if (textContent && textContent.length > 0) {
      return textContent;
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting math text:", error);
    return null;
  }
};

// Map images to questions với logic cải tiến
const mapImagesToQuestions = (questions, htmlContent) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Tạo array chứa tất cả elements theo thứ tự
    const allElements = [];
    const walker = document.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text.length > 10) { // Chỉ lấy text nodes có ý nghĩa
              return NodeFilter.FILTER_ACCEPT;
            }
          }
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IMG') {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE) {
        allElements.push({
          type: 'text',
          content: node.textContent.trim(),
          element: node
        });
      } else if (node.tagName === 'IMG') {
        allElements.push({
          type: 'image',
          src: node.src,
          id: node.id,
          alt: node.alt,
          element: node
        });
      }
    }
    
    console.log(`Found ${allElements.length} elements in HTML`);
    
    // Map questions to positions
    const questionPositions = questions.map((question, qIndex) => {
      const questionStart = question.question.substring(0, 50).trim();
      const elementIndex = allElements.findIndex(el => 
        el.type === 'text' && el.content.includes(questionStart)
      );
      
      return {
        questionIndex: qIndex,
        elementIndex: elementIndex,
        question: question
      };
    });
    
    // Map images to questions
    const questionsWithImages = questions.map(q => ({ ...q, imagePreview: null }));
    
    questionPositions.forEach((qPos, index) => {
      if (qPos.elementIndex === -1) return;
      
      // Tìm image tiếp theo sau question này
      const nextQuestionIndex = questionPositions[index + 1]?.elementIndex || allElements.length;
      const imageElement = allElements.slice(qPos.elementIndex, nextQuestionIndex)
        .find(el => el.type === 'image');
      
      if (imageElement) {
        questionsWithImages[qPos.questionIndex].imagePreview = imageElement.src;
        console.log(`Mapped image to question ${qPos.questionIndex}`);
      }
    });
    
    return questionsWithImages;
  } catch (error) {
    console.error("Error mapping images:", error);
    return questions.map(q => ({ ...q, imagePreview: null }));
  }
};
  // kết thúc đoạn thêm

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

      // ===== Parse Mức độ =====
      let level = null;
      const levelMatch = cleanedBlock.match(/(?:Mức\s*độ|Level)\s*[:\-]?\s*(\d+)/i);
      if (levelMatch) {
        level = parseInt(levelMatch[1]);
        cleanedBlock = cleanedBlock.replace(/(?:Mức\s*độ|Level)\s*[:\-]?\s*\d+/i, '').trim();
      }

      // ===== Parse Chủ đề =====
      let mainTopicId = null;
      const topicMatch = cleanedBlock.match(/Chủ\s*đề\s*[:\-]?\s*(\d+)/i);
      if (topicMatch) {
        mainTopicId = parseInt(topicMatch[1]);
        cleanedBlock = cleanedBlock.replace(/Chủ\s*đề\s*[:\-]?\s*\d+/i, '').trim();
      }

      // ===== Parse Đáp án =====
      let correctLetter = null;
      let correct_answer = '';

      const correctMatch = cleanedBlock.match(/(?:Đáp\s*án\s*(?:đúng)?|Answer)\s*[:\-]?\s*([A-D])\s*/i);
      if (correctMatch) {
        correctLetter = correctMatch[1].toUpperCase();
        cleanedBlock = cleanedBlock.replace(/(?:Đáp\s*án\s*(?:đúng)?|Answer)\s*[:\-]?\s*[A-D]\s*/i, '').trim();
      } else {
        // Trường hợp đáp án là đoạn văn (tự luận)
        const essayAnswerMatch = cleanedBlock.match(/(?:Đáp\s*án|Answer)\s*[:\-]?\s*([^]*?)(?=\n\s*Câu\s*\d+|$)/i);
        if (essayAnswerMatch) {
          correct_answer = essayAnswerMatch[1].trim();
          cleanedBlock = cleanedBlock.replace(/(?:Đáp\s*án|Answer)\s*[:\-]?\s*[^]*$/i, '').trim();
        }
      }

      // ===== Phân tích dòng =====
      const lines = cleanedBlock.split(/\n/).map(line => line.trim()).filter(Boolean);
      let questionText = '';
      let answers = [];
      let foundAnswers = false;

      for (const line of lines) {
        if (/^[A-D][.)．]\s*/i.test(line)) {
          foundAnswers = true;
          answers.push(line);
        } else if (!foundAnswers) {
          questionText += (questionText ? ' ' : '') + line;
        }
      }

      if (!questionText && lines.length > 0) {
        questionText = lines[0];
      }

      // ===== Tính chỉ số đáp án đúng =====
      let correct_option_id = null;
      if (correctLetter && answers.length > 0) {
        const correctIndex = answers.findIndex(ans =>
          ans.trim().toLowerCase().startsWith(correctLetter.toLowerCase())
        );
        if (correctIndex !== -1) {
          correct_option_id = correctIndex + 1;
        }
      }

      // ===== Push vào danh sách câu hỏi =====
      if (questionText) {
        questions.push({
          question: questionText,
          answers: answers,
          correct_option_letter: correctLetter || null,
          correct_option_id: correct_option_id || null,
          correct_answer: correct_answer || null,
          level: level || null,
          mainTopicId: mainTopicId || null,
          score: answers.length > 0 ? 1.0 : 2.0
        });
      }
    });

    return questions;
  };





  // Hàm hỗ trợ: load câu hỏi theo index
  const loadQuestionAtIndex = (index, sourceQuestions = questions) => {
    const q = sourceQuestions[index];
    const options = q.answers?.map((text, idx) => ({
      id: idx + 1,
      text,
    })) || [];

    setNewQuestion({
      content: q.question || '',
      level: q.level || null,
      mainTopicId: q.mainTopicId || null,
      mainTopicName: topics.find(t => t.topic_id === q.mainTopicId)?.name || null,
      options: options,
      correct_option_id: q.correct_option_id || null,
      correct_answer: q.correct_answer || '',
      type: determineQuestionType(q),
      score: q.score || 1.0,
      is_gened_by_model: false,
      created_by_question: false,
      imagePreview: q.imagePreview || null,
      image: null,
    });

    setCurrentQuestionIndex(index);
  };

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



  const handleSave = async () => {
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

    const data = {
      name: examData.name,
      type: examData.type,
      duration_minutes: examData.duration_minutes,
      shift_id: examData.shift?.shift_id,
      exam_id: examId,
    };

    const method = testId ? 'PUT' : 'POST';
    const url = testId
      ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/${testId}/`
      : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resText = await res.text();

      if (res.ok) {
        const responseData = JSON.parse(resText);
        const newTestId = responseData.test_id;
        alert(testId ? '✅ Cập nhật đề thi thành công!' : '✅ Tạo đề thi thành công!');

        if (!testId && newTestId) {
          setTestId(newTestId); // ✅ Cập nhật state để UI tự thay đổi nút
        }
      } else {
        const errorJson = JSON.parse(resText);
        alert(`❌ Lỗi: ${errorJson.message || errorJson.error || 'Không xác định'}`);
      }
    } catch (error) {
      console.error('❌ Lỗi khi lưu kỳ thi:', error);
      alert('🚫 Không thể kết nối tới server.');
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

    let updatedQuestions = newQuestions.map((q) => ({
      ...q,
      options: q.options ? q.options.map((opt) => ({ ...opt })) : [],
    }));
    console.log('📋 Câu hỏi trước khi lưu:', updatedQuestions);

    for (let qIndex = 0; qIndex < updatedQuestions.length; qIndex++) {
      const question = updatedQuestions[qIndex];
      const isNewQuestion = !question.question_id;
      const questionUrl = isNewQuestion
        ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/`
        : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/${question.question_id}/`;
      const questionMethod = isNewQuestion ? 'POST' : 'PUT';

      try {
        // 📥 Lưu câu hỏi
        const formData = new FormData();
        formData.append('test', testId);
        formData.append('content', question.content || '');
        formData.append('type', question.type || 'single');
        formData.append('score', question.score || 1.0);
        formData.append('level', question.level || 1);
        formData.append('is_gened_by_model', question.is_gened_by_model ? 1 : 0);
        formData.append('created_by_question', question.created_by_question ? 1 : 0);
        formData.append('user', userId);
        // Nếu đã có file ảnh gốc (upload thủ công), dùng như cũ
        if (question.image instanceof File) {
          formData.append('image', question.image);
        }
        // Nếu là ảnh base64 từ imagePreview → convert sang Blob
        else if (question.imagePreview && question.imagePreview.startsWith('data:image')) {
          const blob = base64ToBlob(question.imagePreview);
          const file = new File([blob], `image_${Date.now()}.png`, { type: blob.type });
          formData.append('image', file);
        }
        formData.append('topic', question.mainTopicId || '');

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
        }
        const questionId = updatedQuestions[qIndex].question_id;

        // 🧭 Nếu là câu hỏi tự luận
        if (question.type === 'essay') {
          // Lấy đáp án tự luận
          const essayAnswer = question.correct_answer || '';
          if (!essayAnswer.trim()) continue; // không cần lưu nếu không có

          const existingAnswer = updatedQuestions[qIndex].options?.[0];
          const isNewAnswer = !existingAnswer?.answer_id;

          const answerUrl = isNewAnswer
            ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/`
            : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/${existingAnswer.answer_id}/`;
          const answerMethod = isNewAnswer ? 'POST' : 'PUT';

          const answerData = {
            question: questionId,
            content: essayAnswer,
            is_correct: true,
            user: userId,
          };
          console.log(`\n📦 ${answerMethod} đáp án tự luận:`, answerUrl, answerData);

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
            console.error(`❌ Lỗi lưu đáp án tự luận:`, aJson);
            return;
          }

          // Gán ID answer nếu là mới
          if (isNewAnswer) {
            updatedQuestions[qIndex].options = [{ answer_id: aJson.answer_id, text: essayAnswer }];
          }
        } else {
          // 🧭 Nếu là trắc nghiệm
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
            console.log(`\n📦 ${answerMethod} đáp án index ${optIndex}:`, answerUrl, answerData);

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
            }
          }
        }
      } catch (error) {
        console.error('❌ Lỗi xử lý câu hỏi/đáp án:', error);
        return;
      }
    }

    setNewQuestions(updatedQuestions);
    console.log('🎯 newQuestions sau khi lưu:', updatedQuestions);
    alert('✅ Lưu toàn bộ câu hỏi và đáp án thành công!');
    navigate(`/teacher/exams/exam_management/exam_add/${examId}/exam_code/${testId}`);
  };

  useEffect(() => {
    const fetchTestDetail = async () => {
      const userJson = localStorage.getItem('user');
      let token = null;
      if (userJson) {
        try {
          token = JSON.parse(userJson).token;
        } catch (error) {
          console.error('❌ Lỗi parse user:', error);
        }
      }
      if (!token) return;

      try {
        const response = await axios.get(
          `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/${paramTestId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;
        setExamData({
          name: data.name || '',
          type: data.type || '',
          duration_minutes: data.duration_minutes || '',
          shift: data.shift || null, // vì shift_id nằm bên trong shift
        });

        if (Array.isArray(data.questions)) {
          setNewQuestions(
            data.questions.map((question) => ({
              question_id: question.question_id,
              content: question.content,
              type: question.type,
              level: question.level,
              score: question.score,
              image: question.image || null,
              correct_option_id: question.answers.find((a) => a.is_correct)?.answer_id || null,
              is_gened_by_model: question.is_gened_by_model,
              created_by_question: question.created_by_question,
              mainTopicId: question.topic_id,
              mainTopicName: question.topic_name,
              options: question.answers.map((answer) => ({
                id: answer.answer_id,
                answer_id: answer.answer_id,
                text: answer.content,
                is_correct: answer.is_correct,
                user: answer.user,
              })),
            }))
          );
        } else {
          setNewQuestions([]);
        }
      } catch (error) {
        console.error('❌ Lỗi khi lấy dữ liệu đề thi:', error);
      }
    };

    if (paramTestId) {
      fetchTestDetail();
    }
  }, [paramTestId]);




  const createNewQuestion = (type = 'multiple_choice') => {
    const base = {
      type,
      content: "",
      level: "",
      mainTopicId: null, // ✅ Thêm trường chủ đề chính
    };

    if (type === 'essay') {
      return {
        ...base,
        correct_answer: "",
      };
    }

    return {
      ...base,
      options: [
        { id: uuidv4(), text: "" },
        { id: uuidv4(), text: "" },
        { id: uuidv4(), text: "" },
        { id: uuidv4(), text: "" },
      ],
      correct_option_id: "",
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

      // Nếu là tự luận → gán option chứa đáp án đúng
      ...(newQuestion.type === 'essay' && {
        options: [
          {
            text: newQuestion.correct_answer,
            is_correct: true,
          },
        ],
      }),

      // Gán lại tên chủ đề để hiển thị
      mainTopicId: newQuestion.mainTopicId || null,
      mainTopicName:
        topics.find((t) => t.topic_id === newQuestion.mainTopicId)?.name || '',
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

            {/* ✅ FIX: Kiểm tra q.content trước khi render */}
            <p><strong>Câu {index + 1}:</strong> {renderWithLatex(q.content || '')}</p>
            {q.imagePreview ? (
              <img
                src={q.imagePreview}
                alt={`Hình minh hoạ câu hỏi ${index + 1}`}
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
              />
            ) : q.image ? (
              // Nếu đã lưu image path trên server
              <img
                src={`http://localhost:8000${q.image}`}
                alt={`Hình minh hoạ câu hỏi ${index + 1}`}
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
              />
            ) : null}
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
                <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
                  {/* Mức độ câu hỏi - bên trái */}
                  <div style={{ flex: 1 }}>
                    <label style={{ marginBottom: "10px", display: "block" }}>Mức độ câu hỏi:</label>
                    <select
                      value={newQuestion.level || ""}
                      onChange={(e) => setNewQuestion({ ...newQuestion, level: parseInt(e.target.value, 10) })}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="" disabled>Chọn mức độ</option>
                      <option value="1">1 - Dễ</option>
                      <option value="2">2 - Trung bình</option>
                      <option value="3">3 - Khó</option>
                      <option value="4">4 - Rất khó</option>
                    </select>
                  </div>

                  {/* Chủ đề chính - bên phải */}
                  <div style={{ flex: 1 }}>
                    <label style={{ marginBottom: "10px", display: "block" }}>Chủ đề chính:</label>
                    <select
                      value={newQuestion.mainTopicId || ""}
                      onChange={(e) => setNewQuestion({ ...newQuestion, mainTopicId: parseInt(e.target.value, 10) })}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="" disabled>Chọn chủ đề</option>
                      {topics.map((topic) => (
                        <option key={topic.topic_id} value={topic.topic_id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                      padding: "8px 12px", // Tăng padding so với mặc định
                      // Tăng cỡ chữ lên 1.2 lần
                      transform: "scale(1.0)", // Phóng to toàn bộ nút
                      transformOrigin: "center",
                    }}
                  >
                    <img
                      src={showNewQuestionForm ? iconCancelQuestion : iconAddQuestion}
                      alt="toggle"
                      className="btn-icon"
                      style={{ width: "10px", height: "10px" }} // Tăng kích thước icon
                    />
                    {showNewQuestionForm
                      ? editingIndex !== null
                        ? "Hủy sửa"
                        : "Hủy thêm"
                      : "Thêm câu hỏi"}
                  </button>


                  {/* Nút Lưu chỉnh sửa / Lưu câu hỏi */}
                  <button onClick={handleAddOrEditQuestion} className="save-btn">
                    <img src={iconSave} alt="save3" className="btn-icon" />  {editingIndex !== null ? "Lưu chỉnh sửa" : "Lưu câu hỏi"}
                  </button>
                </div>
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
                        <img src={iconCorrect} alt="correct" className="btn-icon" /> Đáp án đúng
                      </span>
                    )}
                  </li>
                ))}
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
                  {renderWithLatex(q.correct_answer || (q.options?.[0]?.text || ''))}
                </div>
              </div>
            )}


            {/* Hiển thị mức độ câu hỏi */}
            {q.level && (
              <div style={{ marginTop: "8px", fontSize: "0.9em", color: "#666" }}>
                <strong>Mức độ:</strong> {q.level === 1 ? "Dễ" : q.level === 2 ? "Trung bình" : q.level === 3 ? "Khó" : "Rất khó"}
              </div>
            )}
            {q.mainTopicName && (
              <div style={{ marginTop: "4px", fontSize: "0.9em", color: "#666" }}>
                <strong>Chủ đề:</strong> {q.mainTopicName}
              </div>
            )}
          </div>
        ))}


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
            <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
              {/* Mức độ câu hỏi - bên trái */}
              <div style={{ flex: 1 }}>
                <label style={{ marginBottom: "10px", display: "block" }}>Mức độ câu hỏi:</label>
                <select
                  value={newQuestion.level || ""}
                  onChange={(e) => setNewQuestion({ ...newQuestion, level: parseInt(e.target.value, 10) })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="" disabled>Chọn mức độ</option>
                  <option value="1">1 - Dễ</option>
                  <option value="2">2 - Trung bình</option>
                  <option value="3">3 - Khó</option>
                  <option value="4">4 - Rất khó</option>
                </select>
              </div>

              {/* Chủ đề chính - bên phải */}
              <div style={{ flex: 1 }}>
                <label style={{ marginBottom: "10px", display: "block" }}>Chủ đề chính:</label>
                <select
                  value={newQuestion.mainTopicId || ""}
                  onChange={(e) => setNewQuestion({ ...newQuestion, mainTopicId: parseInt(e.target.value, 10) })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="" disabled>Chọn chủ đề</option>
                  {topics.map((topic) => (
                    <option key={topic.topic_id} value={topic.topic_id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
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
                <img src={iconSave} alt="save2" className="btn-icon" /> {editingIndex !== null ? "Lưu chỉnh sửa" : "Lưu câu hỏi"}
              </button>
            </div>
          </div>
        )}
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
          <button
            type="button"
            onClick={handleSaveTest}
            className="btn addquestion"
          >
            <img src={iconSave} alt="save" className="btn-icon" />
            Lưu đề thi
          </button>
        </div>
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

export default TeacherExamCodeFromFile;
