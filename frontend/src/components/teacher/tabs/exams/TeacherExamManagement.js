import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/teacher/TeacherExamManagement.css";
import iconDetail from "../../../../assets/icon/icon-detail.png";
import iconEdit from "../../../../assets/icon/icon-edit.png";
import iconDelete from "../../../../assets/icon/icon-delete.png";
import iconAdd from "../../../../assets/icon/icon-add.png";
import iconSearchWhite from "../../../../assets/icon/icon-search-white.png";
import axios from "axios";
import TeacherExamDetailModal from "./TeacherExamDetailModal";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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

const getBadgeClass = (grade) => {
  switch (grade) {
    case "Lớp 10":
      return "badge-grade-10";
    case "Lớp 11":
      return "badge-grade-11";
    case "Lớp 12":
      return "badge-grade-12";
    default:
      return "";
  }
};

const getExamTypeClass = (type) => {
  switch (type) {
    case "Giữa kỳ":
      return "exam-midterm";
    case "Cuối kỳ":
      return "exam-final";
    default:
      return "";
  }
};

export default function TeacherExamManagement() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [filters, setFilters] = useState({ grade: "", examType: "", status: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(7);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const extractGradeNumber = (gradeString) => {
    const match = gradeString.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.grade) params.append("grade", filters.grade);
    if (filters.examType) params.append("type", filters.examType);
    if (filters.status) params.append("status", filters.status);

    axios
      .get(`http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_manage_exam/?${params.toString()}`)
      .then((res) => {
        setExams(res.data);
        setFilteredExams(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      });
  }, [filters]);

  useEffect(() => {
    const filtered = exams.filter((exam) => {
      const matchGrade = filters.grade ? extractGradeNumber(exam.grade_display) === parseInt(filters.grade) : true;
      const matchType = filters.examType ? exam.type === filters.examType : true;
      const matchStatus = filters.status ? exam.status === filters.status : true;
      const matchSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchGrade && matchType && matchStatus && matchSearch;
    });

    setFilteredExams(filtered);
  }, [filters, exams, searchTerm]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleShowMore = () => {
    if (visibleCount >= filteredExams.length) {
      setVisibleCount(7);
    } else {
      setVisibleCount((prev) => prev + 7);
    }
  };

  const handleDetailClick = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  const handleEditClick = async (examId) => {
    // logic của bạn để edit
    navigate(`/teacher/exams/exam_management/exam_add/${examId}`);
  };

const handleDeleteClick = async (examId) => {
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

  const url = `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/${examId}/`;

  if (!window.confirm("Bạn chắc chắn muốn xóa kỳ thi này?")) return;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      alert("Xóa kỳ thi thành công!");
      window.location.reload(); // hoặc update lại danh sách nếu bạn muốn
    } else {
      const resText = await res.text();
      const errorJson = JSON.parse(resText);
      alert(`Lỗi khi xóa: ${errorJson.message || "Không xác định"}`);
    }
  } catch (error) {
    console.error("Lỗi khi xóa kỳ thi:", error);
    alert("Không thể kết nối tới server.");
  }
};




  return (
    <div className="exam-container">
      <div className="exam-header">
        <h2>Danh sách kỳ thi</h2>
        <button className="btn add" onClick={() => navigate("/teacher/exams/exam_management/exam_add")}>
          <img src={iconAdd} alt="icon" className="btn-icon" />
          Thêm kỳ thi
        </button>
      </div>

      <div className="exam-filters">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Nhập tên kỳ thi để tìm kiếm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn search">
            <img src={iconSearchWhite} alt="icon" className="btn-icon" />
            Tìm kiếm
          </button>
        </div>
        <div className="filter-right">
          <select name="grade" onChange={handleFilterChange} value={filters.grade}>
            <option value="">Tất cả</option>
            <option value="10">Lớp 10</option>
            <option value="11">Lớp 11</option>
            <option value="12">Lớp 12</option>
          </select>
          <select name="examType" onChange={handleFilterChange} value={filters.examType}>
            <option value="">Tất cả</option>
            <option value="Giữa kỳ">Giữa kỳ</option>
            <option value="Cuối kỳ">Cuối kỳ</option>
          </select>
          <select name="status" onChange={handleFilterChange} value={filters.status}>
            <option value="">Tất cả</option>
            <option value="Chưa bắt đầu">Chưa bắt đầu</option>
            <option value="Đang diễn ra">Đang diễn ra</option>
            <option value="Đã kết thúc">Đã kết thúc</option>
          </select>
        </div>
      </div>

      <div className="exam-table-wrapper">
        <table className="exam-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Trạng thái</th>
              <th>Số lượng đề thi</th>
              <th>Giáo viên tạo</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.slice(0, visibleCount).map((exam, index) => (
              <tr key={exam.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="exam-title">{exam.name}</div>
                  <span className={`badge ${getBadgeClass(exam.grade_display)}`}>{exam.grade_display}</span>
                  <span className={`badge exam-type ${getExamTypeClass(exam.type)}`}>{exam.type}</span>
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
                  <div>{exam.full_name || "Không rõ"}</div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn detail" onClick={() => handleDetailClick(exam)}>
                      <img src={iconDetail} alt="icon" className="btn-icon" />
                      Chi tiết
                    </button>
                    <button className="btn edit" onClick={() => handleEditClick(exam.id)}>
                      <img src={iconEdit} alt="icon" className="btn-icon" />
                      Chỉnh sửa
                    </button>
                    <button className="btn delete" onClick={() => handleDeleteClick(exam.id)}>
                      <img src={iconDelete} alt="icon" className="btn-icon" />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredExams.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "16px" }}>
                  Không tìm thấy kỳ thi nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredExams.length > 7 && (
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button className="btn toggle" onClick={handleToggleShowMore}>
              {visibleCount >= filteredExams.length ? (
                <>
                  <strong>Ẩn bớt</strong> <FaChevronUp style={{ marginLeft: "8px" }} />
                </>
              ) : (
                <>
                  <strong>Hiển thị thêm</strong> <FaChevronDown style={{ marginLeft: "8px" }} />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {isModalOpen && selectedExam && (
        <TeacherExamDetailModal isOpen={isModalOpen} onClose={handleCloseModal} exam={selectedExam} />
      )}
    </div>
  );
}
