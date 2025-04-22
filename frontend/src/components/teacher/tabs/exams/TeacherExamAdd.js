import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/exam-teacher/TeacherExamAdd.css";
import iconAddCodeExam from "../../../../assets/icon/icon-add.png";

const TeacherExamAdd = () => {
  const navigate = useNavigate();
  const [examName, setExamName] = useState("Kiểm tra cuối năm");
  const [examType, setExamType] = useState('midterm'); // hoặc 'final' nếu bạn muốn mặc định là cuối kỳ
  const [grade, setGrade] = useState("Lớp 12");
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');


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
                <option value="midterm">Giữa kỳ</option>
                <option value="final">Cuối kỳ</option>
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

          <div className="exam-half">
            <div className="form-group half-width">
              <label>Thời gian làm bài (phút)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="Nhập số phút"
                min="1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="form-options">
        <label><input type="checkbox" /> Bao gồm bài thi tổ hợp</label>
        <label><input type="checkbox" /> Cho phép nhà trường tạo bài thi riêng trong kỳ thi</label>
      </div> */}

      {/* Box 2: Danh sách bài thi */}
      <div className="exam-section">
      <div className="exam-section-title">Danh sách bài thi</div>
        <div className="exam-header">
          <button 
            className="btn addcode"
            onClick={() => navigate("/teacher/exams/exam_management/exam_add/exam_code")}
          ><img src={iconAddCodeExam} alt="icon" className="btn-icon" /> Thêm bài thi</button>
        </div>
          {/* Bảng hiển thị danh sách bài thi */}
          <table className="exam-table">
    <thead>
      <tr>
        <th>STT</th>
        <th>Mã đề</th>
        <th>Số lượng câu hỏi</th>
        <th>Thời gian làm bài (phút)</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>MD001</td>
        <td>50</td>
        <td>60</td>
        <td>
          <button className="btn btn-sm btn-edit">Sửa</button>
          <button className="btn btn-sm btn-delete">Xóa</button>
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td>MD002</td>
        <td>40</td>
        <td>45</td>
        <td>
          <button className="btn btn-sm btn-edit">Sửa</button>
          <button className="btn btn-sm btn-delete">Xóa</button>
        </td>
      </tr>
      {/* Các dòng khác nếu có */}
    </tbody>
  </table>
      </div>
    </div>
  );
};

export default TeacherExamAdd;
