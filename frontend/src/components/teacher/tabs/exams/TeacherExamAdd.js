import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ import useParams
import "../../../../styles/exam-teacher/TeacherExamAdd.css";
import iconAddCodeExam from "../../../../assets/icon/icon-add.png";
import { FaSave } from "react-icons/fa";
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";
import axios from 'axios';

const TeacherExamAdd = () => {
  const navigate = useNavigate();
  const { examId } = useParams(); // ✅ lấy param từ URL

  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("Giữa kỳ");
  const [grade, setGrade] = useState("12");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [testList, setTestList] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topics, setTopics] = useState([]);
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
  const fetchExamDetail = async (id) => {
    const userJson = localStorage.getItem("user");
    let token = null;

    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        token = userObj.token;
      } catch (error) {
        console.error("Lỗi khi parse user:", error);
        return;
      }
    }

    if (!token) {
      alert("Token không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const exam = await res.json();
        setExamName(exam.name);
        setExamType(exam.type);
        setGrade(String(exam.grade));
        setTimeStart(new Date(exam.time_start).toISOString().slice(0, 16));
        setTimeEnd(new Date(exam.time_end).toISOString().slice(0, 16));
      } else {
        // Thử đọc chi tiết lỗi json từ backend
        let errorDetail = "";
        try {
          const errRes = await res.json();
          errorDetail = JSON.stringify(errRes);
        } catch {
          errorDetail = res.statusText;
        }
        console.error(`Không thể lấy thông tin kỳ thi: ${res.status} - ${errorDetail}`);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }

  };

  const handleDelete = async (testId) => {
    const userJson = localStorage.getItem("user");
    let token = null;

    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        token = userObj.token;
      } catch (error) {
        console.error("Lỗi khi parse user từ localStorage:", error);
      }
    }

    if (!token) {
      alert("Token không tồn tại hoặc lỗi khi đọc token. Vui lòng đăng nhập lại.");
      return;
    }

    const url = `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_test/${testId}/`;

    if (!window.confirm("Bạn có chắc chắn muốn xóa đề thi này?")) return;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        alert("Xóa đề thi thành công!");

        // Sau khi xóa, cập nhật lại danh sách testList
        setTestList((prevList) => prevList.filter((test) => test.test_id !== testId));
      } else {
        const resText = await res.text();
        const errorJson = JSON.parse(resText);
        alert(`Lỗi khi xóa: ${errorJson.message || "Không xác định"}`);
      }
    } catch (error) {
      console.error("Lỗi khi xóa đề thi:", error);
      alert("Không thể kết nối tới server.");
    }
  };

  // ✅ useEffect để gọi API nếu có examId
  useEffect(() => {
    if (examId) {
      fetchExamDetail(examId);
    }
  }, [examId]);

  // Hàm lấy danh sách đề thi
  const fetchTestList = async () => {
    const userJson = localStorage.getItem("user");
    let token = null;

    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        token = userObj.token;
      } catch (error) {
        console.error("Lỗi khi parse user:", error);
        return;
      }
    }

    if (!token) {
      alert("Token không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_test/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const tests = await res.json();
        setTestList(tests); // Gán dữ liệu vào state
      } else {
        console.error("Lỗi khi lấy danh sách đề thi:", res.statusText);
      }
    } catch (error) {
      console.error("Lỗi kết nối khi lấy danh sách đề thi:", error);
    }
  };

  useEffect(() => {
    if (examId) {
      fetchExamDetail(examId);
    }
    fetchTestList(); // Lấy danh sách đề thi khi component load
  }, [examId]);

const handleSave = async () => {
  const userJson = localStorage.getItem("user");
  let token = null;

  if (userJson) {
    try {
      const userObj = JSON.parse(userJson);
      token = userObj.token;
    } catch (error) {
      console.error("Lỗi khi parse user từ localStorage:", error);
    }
  }

  if (!token) {
    alert("Token không tồn tại hoặc lỗi khi đọc token. Vui lòng đăng nhập lại.");
    return;
  }

  const data = {
    name: examName,
    grade: parseInt(grade),
    type: examType,
    time_start: timeStart,
    time_end: timeEnd,
    topic_ids: selectedTopics,  // ✅ thêm danh sách topic được chọn
  };

  const method = examId ? "PUT" : "POST";
  const url = examId
    ? `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/${examId}/`
    : `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/`;

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
      alert(examId ? "Cập nhật kỳ thi thành công!" : "Tạo kỳ thi thành công!");
      // navigate("/teacher/exams");
    } else {
      const errorJson = JSON.parse(resText);
      alert(`Lỗi: ${errorJson.error || "Không xác định"}`);
    }
  } catch (error) {
    console.error("Lỗi khi lưu kỳ thi:", error);
    alert("Không thể kết nối tới server.");
  }
};


  return (
    <div className="add-exam-container">
      <div className="exam-section">
        <div className="exam-section-title">Thông tin kỳ thi</div>
        <div className="exam-row">
          <div className="form-group half-width">
            <label>Tên kỳ thi</label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
          </div>
          <div className="exam-half">
            <div className="form-group quarter-width">
              <label>Loại kỳ thi</label>
              <select value={examType} onChange={(e) => setExamType(e.target.value)}>
                <option value="Giữa kỳ">Giữa kỳ</option>
                <option value="Cuối kỳ">Cuối kỳ</option>
                <option value="Học sinh giỏi">Học sinh giỏi</option>
                <option value="Thi thử">Thi thử</option>
              </select>
            </div>
            <div className="form-group quarter-width">
              <label>Khối</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
            </div>
          </div>
        </div>

        <div className="exam-row">
          <div className="form-group half-width">
            <label>Thời gian mở kỳ thi</label>
            <div className="time-range">
              <span>Từ</span>
              <input
                type="datetime-local"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
              />
              <span>đến</span>
              <input
                type="datetime-local"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group quarter-width">
            <label>Chủ đề</label>
            <div className="topic-checkbox-list scrollable-box">
              {topics.map((topic) => (
                <div key={topic.topic_id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={topic.topic_id}
                    value={topic.topic_id}
                    checked={selectedTopics.includes(topic.topic_id)}
                    onChange={() => {
                      if (selectedTopics.includes(topic.topic_id)) {
                        setSelectedTopics(selectedTopics.filter((id) => id !== topic.topic_id));
                      } else {
                        setSelectedTopics([...selectedTopics, topic.topic_id]);
                      }
                    }}
                  />
                  <label htmlFor={topic.topic_id}>{topic.name}</label>
                </div>
              ))}
            </div>
          </div>

          <style>
            {`
              .scrollable-box {
                max-height: 90px;
                overflow-y: auto;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 6px;
                background-color: #fff;
              }

              .checkbox-item {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 4px;
              }

              .checkbox-item input[type="checkbox"] {
                transform: scale(1.1);
              }

              .form-group.quarter-width {
                width: 100%;
                max-width: 300px; /* hoặc bạn tuỳ chỉnh theo bố cục */
                margin-bottom: 16px;
              }
            `}
          </style>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
          <button className="btn addcode" onClick={handleSave}>
            <FaSave className="btn-icon" /> {examId ? "Cập nhật" : "Lưu"}
          </button>
        </div>
      </div>

      <div className="exam-section">
        <div className="exam-section-title">Danh sách đề thi</div>

        <div className="exam-header">
          <button
            className="btn addcode"
            onClick={() => navigate("/teacher/exams/exam_management/exam_add/exam_code/")}
          >
            <img src={iconAddCodeExam} alt="icon" className="btn-icon" /> Thêm bài thi
          </button>
        </div>

        <table className="exam-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đề</th>
              <th>Loại đề</th>
              <th>Số lượng câu hỏi</th>
              <th>Thời gian làm bài (phút)</th>
              <th>Ca thi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {testList.length > 0 ? (
              testList.map((test, index) => (
                <tr key={test.test_id}>
                  <td>{index + 1}</td>
                  <td>{test.name}</td>
                  <td>{test.type}</td>
                  <td>45</td>
                  <td>{test.duration_minutes}</td>
                  <td>{test.shift.shift_id}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-edit"
                      onClick={() =>
                        navigate(`/teacher/exams/exam_management/exam_add/exam_code/${test.test_id}`)
                      }
                      style={{ backgroundColor: "#fff", color: "#000", border: "1px solid #000", }}
                    >
                      <img
                        src={iconEdit}
                        alt="Edit"
                        style={{ width: "16px", height: "16px", marginRight: "0px", verticalAlign: "middle" }}
                      />
                      Sửa
                    </button>


                    <button
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDelete(test.test_id)}
                    >
                      <img
                        src={iconDelete}
                        alt="Delete"
                        style={{ width: "16px", height: "16px", marginRight: "0px", verticalAlign: "middle" }}
                      />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default TeacherExamAdd;
