import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/exam-teacher/TeacherExamAdd.css";
import iconAddCodeExam from "../../../../assets/icon/icon-add.png";

const TeacherDocument = () => {
  const navigate = useNavigate();
  const [docName, setDocName] = useState("Tài liệu ôn tập cuối kỳ");
  const [docType, setDocType] = useState("summary");
  const [grade, setGrade] = useState("Lớp 12");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  return (
    <div className="add-exam-container">
      <div className="exam-section">
        <div className="exam-section-title">Thông tin tài liệu</div>
        <div className="exam-row">
          <div className="form-group half-width">
            <label>Tên tài liệu</label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>

          <div className="exam-half">
            <div className="form-group quarter-width">
              <label>Loại tài liệu</label>
              <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="summary">Tóm tắt</option>
                <option value="full">Chi tiết</option>
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
            <label>Thời gian áp dụng</label>
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
              <label>Thời lượng đọc (phút)</label>
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

      {/* Danh sách tài liệu */}
      <div className="exam-section">
        <div className="exam-section-title">Danh sách tài liệu</div>
        <div className="exam-header">
          <button
            className="btn addcode"
            onClick={() => navigate("/teacher/documents/document_add/document_detail")}
          >
            <img src={iconAddCodeExam} alt="icon" className="btn-icon" />
            Thêm tài liệu
          </button>
        </div>

        <table className="exam-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã tài liệu</th>
              <th>Chủ đề</th>
              <th>Thời lượng (phút)</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>TL001</td>
              <td>Ôn tập chương 1</td>
              <td>30</td>
              <td>
                <button className="btn btn-sm btn-edit">Sửa</button>
                <button className="btn btn-sm btn-delete">Xóa</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>TL002</td>
              <td>Tổng hợp kiến thức</td>
              <td>45</td>
              <td>
                <button className="btn btn-sm btn-edit">Sửa</button>
                <button className="btn btn-sm btn-delete">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherDocument;
