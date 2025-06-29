import React, { useState } from 'react';
import '../../../../styles/teacher/TeacherQuestionGenerate.css';

const TeacherQuestionGenerate = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const parseGeneratedQuestions = (text) => {
    const lines = text.trim().split('\n').map(line => line.trim());
    const questions = [];
    let current = null;

    lines.forEach(line => {
      const isQuestionStart = /^Câu\s*\d+:/i.test(line);
      const isAnswerOption = /^[A-D]\./.test(line);
      const isAnswerLine = line.startsWith("Đáp án:");
      const isLevelLine = line.startsWith("Mức độ:");
      const isTopicLine = line.startsWith("Chủ đề:");

      if (isQuestionStart) {
        if (current) questions.push(current);
        current = {
          content: line.replace(/^Câu\s*\d+:\s*/, '').trim(),
          options: [],
          correct_option_id: null,
          level: 1,
          topic: null
        };
      } else if (isAnswerOption && current) {
        const match = line.match(/^([A-D])\.\s*(.+)$/);
        if (match) {
          current.options.push({ id: match[1], content: match[2] });
        }
      } else if (isAnswerLine && current) {
        current.correct_option_id = line.split(':')[1].trim();
      } else if (isLevelLine && current) {
        current.level = parseInt(line.split(':')[1].trim());
      } else if (isTopicLine && current) {
        current.topic = line.split(':')[1].trim();
      }
    });

    if (current) questions.push(current);
    return questions;
  };

  const handleSaveGeneratedQuestions = async () => {
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

    const questions = parseGeneratedQuestions(result);
    console.log("📦 Parsed questions:", questions);

    for (const qIndex in questions) {
      const question = questions[qIndex];

      try {
        const formData = new FormData();
        formData.append('content', question.content);
        formData.append('type', 'single');
        formData.append('score', 1.0);
        formData.append('level', question.level);
        formData.append('user', userId);
        formData.append('is_gened_by_model', true);
        formData.append('created_by_question', true);
        if (question.topic) formData.append('topic', question.topic);

        const qRes = await fetch('http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_question/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        const qJson = await qRes.json();
        if (!qRes.ok) throw new Error(qJson.message || 'Lỗi tạo câu hỏi');

        const questionId = qJson.question_id;

        for (const opt of question.options) {
          const isCorrect = opt.id.trim().toUpperCase() === question.correct_option_id.trim().toUpperCase();

          const answerRes = await fetch(`http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              question: questionId,
              content: opt.content,
              is_correct: isCorrect,
              user: userId
            })
          });

          const aJson = await answerRes.json();
          if (!answerRes.ok) throw new Error(aJson.message || 'Lỗi tạo đáp án');
        }

        console.log(`✅ Câu hỏi #${qIndex} đã lưu thành công.`);
      } catch (error) {
        console.error(`❌ Lỗi khi lưu câu hỏi #${qIndex}:`, error);
        alert(`❌ Lỗi khi lưu câu hỏi thứ ${parseInt(qIndex) + 1}. Xem console để biết thêm.`);
      }
    }

    alert("✅ Đã lưu toàn bộ câu hỏi được sinh ra.");
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: inputText })
      });
      const data = await response.json();
      setResult(data.result || 'No response from model.');
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacherquesgen_container">
      <div className="teacherquesgen_inner-container">
        <h1 className="teacherquesgen_main-title">Công cụ sinh đề Toán học</h1>

        <div className="teacherquesgen_columns">
          <div className="teacherquesgen_left-panel">
            <div className="teacherquesgen_panel-header blue">
              <div className="teacherquesgen_dot blue-dot"></div>
              <h2>Nhập câu hỏi mẫu</h2>
            </div>

            <label className="teacherquesgen_label">Câu hỏi gốc:</label>
            <textarea
              className="teacherquesgen_textarea"
              placeholder="VD: Tìm x biết: 2x + 5 = 13"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !inputText.trim()}
              className={`teacherquesgen_generate-button ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Đang sinh câu hỏi...' : 'Sinh câu hỏi tương tự'}
            </button>

            <p className="teacherquesgen_tip">
              💡 Nhập một câu hỏi mẫu để hệ thống tạo ra nhiều câu hỏi tương tự.
            </p>
          </div>

          <div className="teacherquesgen_right-panel">
            <div className="teacherquesgen_panel-header green">
              <div className="teacherquesgen_dot green-dot"></div>
              <h2>Câu hỏi được sinh ra</h2>
            </div>

            {!result && !loading ? (
              <div className="teacherquesgen_placeholder">
                <p>Nhập câu hỏi bên trái và nhấn "Sinh câu hỏi tương tự" để xem kết quả</p>
              </div>
            ) : (
              <div className="teacherquesgen_result-area">
                <div className="teacherquesgen_result-box">
                  <h3>📝 Câu hỏi mới:</h3>
                  <pre>{result}</pre>
                </div>

                <div className="teacherquesgen_button-group">
                  <button onClick={() => navigator.clipboard.writeText(result)}>📋 Sao chép</button>
                  <button onClick={() => setResult('')}>🗑️ Xóa</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="teacherquesgen_button-group mt-6">
              <button
                onClick={handleSaveGeneratedQuestions}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                💾 Lưu toàn bộ câu hỏi vào hệ thống
              </button>
            </div>
        )}

        <footer className="teacherquesgen_footer">
          Công cụ hỗ trợ giáo viên tạo đề bài toán học đa dạng và phong phú
        </footer>
      </div>
    </div>
  );
};

export default TeacherQuestionGenerate;
