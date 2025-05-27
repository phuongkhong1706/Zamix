import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../styles/exam-teacher/TeacherExamManagement.css";
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
  const [filters, setFilters] = useState({
    grade: "",
    examType: "",
    status: "",
  });
  const [filteredExams, setFilteredExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(7);
  const handleToggleShowMore = () => {
  if (visibleCount >= filteredExams.length) {
    // Đã hiển thị hết => quay lại 7 kỳ thi đầu
    setVisibleCount(7);
  } else {
    // Hiển thị thêm 7 kỳ thi
    setVisibleCount((prev) => prev + 7);
  }
};
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
      const matchGrade = filters.grade
        ? extractGradeNumber(exam.grade_display) === parseInt(filters.grade)
        : true;
      const matchType = filters.examType ? exam.type === filters.examType : true;
      const matchStatus = filters.status ? exam.status === filters.status : true;
      return matchGrade && matchType && matchStatus;
    });
    setFilteredExams(filtered);
  }, [filters, exams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
  try {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    let userObj;
    try {
      userObj = JSON.parse(userJson);
    } catch (error) {
      console.error("Lỗi khi parse user:", error);
      alert("Lỗi dữ liệu người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    const token = userObj.token;
    const loggedInUserId = String(userObj.user_id);

    const response = await axios.get(
      `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/${examId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("API response data:", response.data);

    if (!response.data || !response.data.user_id) {
      alert("Không nhận được thông tin quyền hạn từ server.");
      return;
    }

    const examOwnerId = String(response.data.user_id);

    console.log("loggedInUserId:", loggedInUserId);
    console.log("examOwnerId:", examOwnerId);

    if (loggedInUserId === examOwnerId) {
      navigate(`/teacher/exams/exam_management/exam_add/${examId}`);
    } else {
      alert("Bạn không có quyền chỉnh sửa kỳ thi này.");
    }

  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền chỉnh sửa:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);

      if (error.response.status === 401) {
        alert("Bạn chưa đăng nhập hoặc token hết hạn. Vui lòng đăng nhập lại.");
      } else {
        alert((error.response.data.message || "Lỗi máy chủ. Vui lòng thử lại sau."));
      }
    } else if (error.request) {
      console.error("No response received. Request object:", error.request);
      alert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.");
    } else {
      console.error("Error setting up the request:", error.message);
      alert("Lỗi không xác định. Vui lòng thử lại.");
    }
  }
};

const handleDeleteClick = async (examId) => {
  try {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    let userObj;
    try {
      userObj = JSON.parse(userJson);
    } catch (error) {
      console.error("Lỗi khi parse user:", error);
      alert("Lỗi dữ liệu người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    const token = userObj.token;
    const loggedInUserId = String(userObj.user_id);

    // Lấy chi tiết exam để kiểm tra quyền owner
    const response = await axios.get(
      `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/${examId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const examOwnerId = String(response.data.user_id);

    if (loggedInUserId !== examOwnerId) {
      alert("Bạn không có quyền xóa kỳ thi này.");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa kỳ thi này không?")) {
      return;
    }

    // Gửi request xóa
    await axios.delete(
      `http://localhost:8000/api/teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/${examId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Xóa kỳ thi thành công.");
    // Cập nhật lại danh sách kỳ thi sau khi xóa
    setExams((prevExams) => prevExams.filter((exam) => exam.id !== examId));
  } catch (error) {
    console.error("Lỗi khi xóa kỳ thi:", error);
    if (error.response) {
      if (error.response.status === 401) {
        alert("Bạn chưa đăng nhập hoặc token hết hạn. Vui lòng đăng nhập lại.");
      } else if (error.response.status === 403) {
        alert("Bạn không có quyền xóa kỳ thi này.");
      } else {
        alert(error.response.data.message || "Lỗi máy chủ. Vui lòng thử lại sau.");
      }
    } else if (error.request) {
      alert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.");
    } else {
      alert("Lỗi không xác định. Vui lòng thử lại.");
    }
  }
};

return (
  <div className="exam-container">
    <div className="exam-header">
      <h2>Danh sách kỳ thi</h2>
      <button
        className="btn add"
        onClick={() => navigate("/teacher/exams/exam_management/exam_add")}
      >
        <img src={iconAdd} alt="icon" className="btn-icon" />
        Thêm kỳ thi
      </button>
    </div>

    <div className="exam-filters">
      <div className="filter-left">
        <input type="text" placeholder="Nhập từ khóa tìm kiếm" />
        <button className="btn search">
          <img src={iconSearchWhite} alt="icon" className="btn-icon" />
          Tìm kiếm
        </button>
      </div>
      <div className="filter-right">
        <select name="grade" onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="10">Lớp 10</option>
          <option value="11">Lớp 11</option>
          <option value="12">Lớp 12</option>
        </select>
        <select name="examType" onChange={handleFilterChange}>
          <option value="">Tất cả</option>
          <option value="Giữa kỳ">Giữa kỳ</option>
          <option value="Cuối kỳ">Cuối kỳ</option>
        </select>
        <select name="status" onChange={handleFilterChange}>
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
            <th>Giáo viên tạo</th> {/* ✅ Thêm cột mới */}
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {filteredExams.slice(0, visibleCount).map((exam, index) => (
            <tr key={exam.id}>
              <td>{index + 1}</td>
              <td>
                <div className="exam-title">{exam.name}</div>
                <span className={`badge ${getBadgeClass(exam.grade_display)}`}>
                  {exam.grade_display}
                </span>
                <span className={`badge exam-type ${getExamTypeClass(exam.type)}`}>
                  {exam.type}
                </span>
              </td>
              <td>
                <div className={`status ${getStatusClass(exam.status)}`}>
                  {exam.status}
                </div>
                <div className="students">{exam.students}</div>
              </td>
              <td>
                <div>Số đề đã tạo: <strong>{exam.created}</strong></div>
                <div>Số đề đang hoạt động: <strong>{exam.active}</strong></div>
              </td>
              <td>
                <div>{exam.full_name || "Không rõ"}</div> {/* ✅ Hiển thị giáo viên */}
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
      <TeacherExamDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        exam={selectedExam}
      />
    )}
  </div>
);
}