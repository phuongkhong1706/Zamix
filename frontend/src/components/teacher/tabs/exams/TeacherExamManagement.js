import React from "react";
import "../../../../styles/TeacherExamManagement.css"
import iconDetail from "../../../../assets/icon/icon-detail.png"
import iconEdit from "../../../../assets/icon/icon-edit.png"
import iconDelete from "../../../../assets/icon/icon-delete.png"
import iconExport from "../../../../assets/icon/icon-export.png"
import iconAdd from "../../../../assets/icon/icon-add.png"
import iconSearchWhite from "../../../../assets/icon/icon-search-white.png"

const getStatusClass = (status) => {
    switch (status) {
      case "Chưa bắt đầu":
        return "status-upcoming";
      case "Đang diễn ra":
        return "status-ongoing";
      case "Đã kết thúc":
        return "status-finished";
      default:
        return "";
    }
  };
  
const exams = [
    {
      id: 1,
      title: "Kiểm tra cuối học kỳ II khối 12 - Năm học 2022-2023",
      grade: "Lớp 12",
      status: "Đã kết thúc",
      students: "Đã có 5 học sinh vào làm",
      created: 1,
      active: 1,
    },
    {
      id: 2,
      title: "Thi cuối kỳ I",
      grade: "Lớp 12",
      status: "Chưa bắt đầu",
      students: "Đã có 0 học sinh vào làm",
      created: 1,
      active: 1,
    },
    {
      id: 3,
      title: "thi giữa kỳ",
      grade: "Lớp 12",
      status: "Đang diễn ra",
      students: "Đã có 2 học sinh vào làm",
      created: 2,
      active: 2,
    },
  ];
  
  export default function TeacherExamManagement() {
    return (
      <div className="exam-container">
        {/* Header */}
        <div className="exam-header">
          <h2>Danh sách kỳ thi</h2>
          <button className="btn add"><img src={iconAdd} alt="icon" className="btn-icon" />Thêm kỳ thi</button>
        </div>
  
        {/* Filters */}
        <div className="exam-filters">
            <div className="filter-left">
                <input type="text" placeholder="Nhập từ khóa tìm kiếm" />
                <button className="btn search">
                <img src={iconSearchWhite} alt="icon" className="btn-icon" />Tìm kiếm
                </button>
            </div>
            <div className="filter-right">
            <select>
                <option value="">Chọn khối</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
            </select>
            <select>
                <option value="">Trạng thái</option>
                <option value="not-started">Chưa bắt đầu</option>
                <option value="in-progress">Đang diễn ra</option>
                <option value="finished">Đã kết thúc</option>
            </select>
            </div>
            </div>

  
        {/* Table */}
        <div className="exam-table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Trạng thái</th>
                <th>Số lượng đề thi</th>
                <th>Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr
                  key={exam.id}
                >
                  <td>{index + 1}</td>
                  <td>
                    <div className="exam-title">{exam.title}</div>
                    <span className="badge">{exam.grade}</span>
                  </td>
                  <td>
                    <div className={`status ${getStatusClass(exam.status)}`}>{exam.status}</div>
                    <div className="students">{exam.students}</div>
                  </td>
                  <td>
                    <div>Số đề đã tạo: <strong>{exam.created}</strong></div>
                    <div>Số đề đang hoạt động: <strong>{exam.active}</strong></div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn detail"><img src={iconDetail} alt="icon" className="btn-icon" />Chi tiết</button>
                      <button className="btn edit"><img src={iconEdit} alt="icon" className="btn-icon" />Chỉnh sửa</button>
                      <button className="btn delete"><img src={iconDelete} alt="icon" className="btn-icon" />Xóa</button>
                      <button className="btn export"><img src={iconExport} alt="icon" className="btn-icon" />Xuất dữ liệu</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }