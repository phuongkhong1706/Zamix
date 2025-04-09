import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDoExamDetail = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/student/do_exam/${examId}/`)
      .then((res) => {
        setQuestions(res.data.questions);
        setExamTitle(res.data.exam.title);
      })
      .catch((err) => console.log(err));
  }, [examId]);

  const handleChange = (questionId, choice) => {
    setAnswers({ ...answers, [questionId]: choice });
  };

  const handleSubmit = () => {
    const payload = {
      exam_id: parseInt(examId),
      student_id: 1, // hardcode, sau này sửa thành user login
      answers: Object.entries(answers).map(([question_id, selected_choice]) => ({
        question_id: parseInt(question_id),
        selected_choice
      }))
    };

    axios.post("http://localhost:8000/api/submit/", payload)
      .then(() => {
        alert("Nộp bài thành công!");
        navigate("/student/do_exam");
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Làm bài: {examTitle}</h2>
      {questions.map((q, idx) => (
        <div key={q.id} className="mb-6">
          <p><strong>Câu {idx + 1}:</strong> {q.content}</p>
          {Object.entries(q.choices).map(([key, val]) => (
            <label key={key} className="block">
              <input
                type="radio"
                name={`q_${q.id}`}
                value={key}
                onChange={() => handleChange(q.id, key)}
                checked={answers[q.id] === key}
              />
              <span className="ml-2">{key}. {val}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Nộp bài
      </button>
    </div>
  );
};

export default StudentDoExamDetail;
