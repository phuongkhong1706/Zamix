import React, { useState } from 'react';
import '../../../../styles/exam-teacher/TeacherQuestionGenerate.css'; // Import CSS riêng

const TeacherQuestionGenerate = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: inputText }),
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
          {/* Nhập câu hỏi */}
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
              💡 Mẹo: Nhập một câu hỏi toán học mẫu để hệ thống tạo ra các câu hỏi tương tự với độ khó và dạng bài tương đương.
            </p>
          </div>

          {/* Kết quả */}
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

        <footer className="teacherquesgen_footer">
          Công cụ hỗ trợ giáo viên tạo đề bài toán học đa dạng và phong phú
        </footer>
      </div>
    </div>
  );
};

export default TeacherQuestionGenerate;
