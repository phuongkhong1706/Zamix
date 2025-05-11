import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/exam-teacher/TeacherExamAdd.css";
import iconAddRule from "../../../../assets/icon/icon-add.png";

const TeacherRule = () => {
  const navigate = useNavigate();
  const [ruleName, setRuleName] = useState("Thể lệ thi học kỳ");
  const [ruleType, setRuleType] = useState("general");
  const [grade, setGrade] = useState("Lớp 12");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  return (
    <div className="add-exam-container">
      <div className="exam-section">
        <div className="exam-section-title">Thông tin thể lệ</div>

        <div className="exam-row">
          <div className="form-group half-width">
            <label>Tên thể lệ</label>
            <input
              type="text"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
            />
          </div>

          <div className="exam-half">
            <div className="form-group quarter-width">
              <label>Loại thể lệ</label>
              <select
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value)}
              >
                <option value="general">Chung</option>
                <option value="special">Đặc biệt</option>
              </select>
            </div>

            <div className="form-group quarter-width">
              <label>Khối</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
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
        </div>
      </div>

      {/* Danh sách điều lệ */}
      <div className="exam-section">
        <div className="exam-section-title">Danh sách điều lệ</div>
        <div className="exam-header">
          <button
            className="btn addcode"
            onClick={() => navigate("/teacher/rules/rule_add/rule_detail")}
          >
            <img src={iconAddRule} alt="icon" className="btn-icon" />
            Thêm điều lệ
          </button>
        </div>

        <table className="exam-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Nội dung điều lệ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Không được sử dụng điện thoại trong phòng thi.</td>
              <td>Áp dụng</td>
              <td>
                <button className="btn btn-sm btn-edit">Sửa</button>
                <button className="btn btn-sm btn-delete">Xóa</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Học sinh đến muộn quá 15 phút không được vào thi.</td>
              <td>Áp dụng</td>
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

export default TeacherRule;
