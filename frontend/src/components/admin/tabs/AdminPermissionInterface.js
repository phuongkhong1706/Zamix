import React, { useState, useEffect} from 'react';
import { Search, CheckCircle, XCircle, UserPlus, Trash2, Users, Calendar, Clock } from 'lucide-react';
import '../../../styles/admin/AdminPermissionInterface.css';

const AdminPermissionInterface = () => {
  // Mock data cho kỳ thi
const [exams, setExams] = useState([]);
const [, setLoading] = useState(true);

useEffect(() => {
  fetch('http://localhost:8000/api/admin/admin_manage_exam/')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu từ server');
      }
      return response.json();
    })
    .then((data) => {
      console.log("📦 Dữ liệu gốc từ API:", data);

      const mappedExams = data.map((exam) => ({
        id: exam.id,
        name: exam.name,
        subject: exam.subject || 'Không rõ',
        date: exam.date,
        time: exam.time,
        status: exam.status_display,               // Trạng thái kỳ thi: "Kỳ thi đang diễn ra", ...
        approvalStatus: exam.approval_status_display, // Trạng thái duyệt: "Chờ duyệt", "Đã duyệt"
        studentCount: exam.studentCount,
        description: exam.description || ''
      }));

      setExams(mappedExams);
      setLoading(false);
    })
    .catch((error) => {
      console.error('❌ Lỗi khi gọi API kỳ thi:', error);
      setLoading(false);
    });
}, []);

  // Mock data cho học sinh
 const [students, setStudents] = useState([]);

useEffect(() => {
  fetch('http://localhost:8000/api/admin/admin_user/')
    .then((res) => {
      if (!res.ok) {
        throw new Error('Lỗi khi lấy danh sách học sinh');
      }
      return res.json();
    })
    .then((data) => {
      // Lọc những user là học sinh
      const studentData = data
        .filter(user => user.user_type === 'Học sinh')
        .map(student => ({
          id: student.id,
          name: student.full_name,
          class: student.grade || 'Chưa rõ',
          email: student.email
        }));
      setStudents(studentData);
    })
    .catch((err) => {
      console.error('❌ Lỗi khi lấy dữ liệu học sinh:', err);
    });
}, []);

  const [selectedExam, setSelectedExam] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Xử lý duyệt kỳ thi
const approveExam = (examId) => {
  const confirmApprove = window.confirm('Bạn có chắc chắn muốn duyệt kỳ thi này?');

  if (!confirmApprove) return;

  fetch('http://localhost:8000/api/admin/admin_manage_exam/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ exam_id: examId }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Duyệt kỳ thi thất bại');
      }
      return res.json();
    })
    .then((data) => {
      console.log('✅ Duyệt kỳ thi thành công:', data);
      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam.id === examId ? { ...exam, status: 'approved' } : exam
        )
      );
    })
    .catch((err) => {
      console.error('❌ Lỗi khi duyệt kỳ thi:', err);
    });
};


  // Xử lý xóa kỳ thi
const deleteExam = (examId) => {
  const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa kỳ thi này?');

  if (!confirmDelete) return;

  fetch('http://localhost:8000/api/admin/admin_manage_exam/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ exam_id: examId }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Xóa kỳ thi thất bại');
      }
      return res.json();
    })
    .then((data) => {
      console.log('✅ Kỳ thi đã được xóa:', data);
      setExams((prev) => prev.filter((exam) => exam.id !== examId));
    })
    .catch((err) => {
      console.error('❌ Lỗi khi xóa kỳ thi:', err);
    });
};



  // Xử lý thêm học sinh vào kỳ thi
  const addStudentsToExam = () => {
  if (selectedStudents.length > 0 && selectedExam) {
    const payload = {
      exam_id: selectedExam.id,
      student_ids: selectedStudents,
    };

    console.log("📦 Payload gửi lên backend:", payload);

    fetch('http://localhost:8000/api/admin/admin_add_student_to_exam/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Thêm học sinh thất bại');
        }
        return res.json();
      })
      .then((data) => {
        console.log('✅ Server phản hồi:', data);

        // Cập nhật số lượng học sinh frontend
        setExams(prev =>
          prev.map(exam =>
            exam.id === selectedExam.id
              ? {
                  ...exam,
                  studentCount: exam.studentCount + selectedStudents.length,
                }
              : exam
          )
        );

        alert(`Đã thêm ${selectedStudents.length} học sinh vào kỳ thi "${selectedExam.name}"`);
        setSelectedStudents([]);
        setShowAddStudentModal(false);
        setSelectedExam(null);
      })
      .catch((err) => {
        console.error('❌ Lỗi khi thêm học sinh:', err);
      });
  }
};


  // Lọc học sinh theo tìm kiếm
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý chọn/bỏ chọn học sinh
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'adper-status-pending',
      approved: 'adper-status-approved',
      rejected: 'adper-status-rejected'
    };
    
    const labels = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối'
    };

    return (
      <span className={`adper-status-badge ${statusClasses[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="adper-container">
      <div className="adper-main-content">

        {/* Stats Cards */}
        <div className="adper-stats-grid">
          <div className="adper-stats-card">
            <div className="adper-stats-content">
              <div className="adper-stats-info">
                <p className="adper-stats-label">Tổng kỳ thi</p>
                <p className="adper-stats-number">{exams.length}</p>
              </div>
              <div className="adper-stats-icon adper-stats-icon-blue">
                <Calendar className="adper-icon" />
              </div>
            </div>
          </div>
          
          <div className="adper-stats-card">
            <div className="adper-stats-content">
              <div className="adper-stats-info">
                <p className="adper-stats-label">Chờ duyệt</p>
                <p className="adper-stats-number adper-stats-number-yellow">
                  {exams.filter(exam => exam.status === 'pending').length}
                </p>
              </div>
              <div className="adper-stats-icon adper-stats-icon-yellow">
                <Clock className="adper-icon" />
              </div>
            </div>
          </div>
          
          <div className="adper-stats-card">
            <div className="adper-stats-content">
              <div className="adper-stats-info">
                <p className="adper-stats-label">Đã duyệt</p>
                <p className="adper-stats-number adper-stats-number-green">
                  {exams.filter(exam => exam.status === 'approved').length}
                </p>
              </div>
              <div className="adper-stats-icon adper-stats-icon-green">
                <CheckCircle className="adper-icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Exam List */}
        <div className="adper-exam-table-container">
          <div className="adper-exam-table-header">
            <h2 className="adper-table-title">Danh sách Kỳ thi</h2>
          </div>
          
          <div className="adper-table-wrapper">
            <table className="adper-exam-table">
              <thead className="adper-table-head">
                <tr>
                  <th className="adper-table-th">Tên kỳ thi</th>
                  <th className="adper-table-th">Ngày thi</th>
                  <th className="adper-table-th">Trạng thái</th>
                  <th className="adper-table-th">Học sinh</th>
                  <th className="adper-table-th">Thao tác</th>
                </tr>
              </thead>
              <tbody className="adper-table-body">
                {exams.map((exam) => (
                  <tr key={exam.id} className="adper-table-row">
                    <td className="adper-table-td">
                      <div>
                        <div className="adper-exam-name">{exam.name}</div>
                        <div className="adper-exam-description">{exam.description}</div>
                      </div>
                    </td>
                    <td className="adper-table-td">
                      <div className="adper-exam-date">{exam.date}</div>
                      <div className="adper-exam-time">{exam.time}</div>
                    </td>
                    <td className="adper-table-td">
                      {getStatusBadge(exam.status)}
                    </td>
                    <td className="adper-table-td">
                      <div className="adper-student-count">
                        <Users className="adper-student-icon" />
                        {exam.studentCount}
                      </div>
                    </td>
                    <td className="adper-table-td">
                      <div className="adper-action-buttons">
                        {exam.status === 'pending' && (
                          <button
                            onClick={() => approveExam(exam.id)}
                            className="adper-btn adper-btn-approve"
                          >
                            <CheckCircle className="adper-btn-icon" />
                            Duyệt
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            setSelectedExam(exam);
                            setShowAddStudentModal(true);
                          }}
                          className="adper-btn adper-btn-add-student"
                        >
                          <UserPlus className="adper-btn-icon" />
                          Thêm HS
                        </button>
                        
                        <button
                          onClick={() => deleteExam(exam.id)}
                          className="adper-btn adper-btn-delete"
                        >
                          <Trash2 className="adper-btn-icon" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Student Modal */}
        {showAddStudentModal && (
          <div className="adper-modal-overlay">
            <div className="adper-modal">
              <div className="adper-modal-header">
                <div className="adper-modal-header-content">
                  <h3 className="adper-modal-title">
                    Thêm học sinh vào kỳ thi: {selectedExam?.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddStudentModal(false);
                      setSelectedExam(null);
                      setSelectedStudents([]);
                    }}
                    className="adper-modal-close"
                  >
                    <XCircle className="adper-modal-close-icon" />
                  </button>
                </div>
              </div>
              
              <div className="adper-modal-body">
                {/* Search */}
                <div className="adper-search-container">
                  <div className="adper-search-wrapper">
                    <Search className="adper-search-icon" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm học sinh theo tên hoặc lớp..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="adper-search-input"
                    />
                  </div>
                </div>

                {/* Student List */}
                <div className="adper-student-list">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`adper-student-item ${
                        selectedStudents.includes(student.id) ? 'adper-student-selected' : ''
                      }`}
                      onClick={() => toggleStudentSelection(student.id)}
                    >
                      <div className="adper-student-checkbox-wrapper">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="adper-student-checkbox"
                        />
                        <div className="adper-student-info">
                          <div className="adper-student-name">{student.name}</div>
                          <div className="adper-student-details">
                            Lớp: {student.class} • {student.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedStudents.length > 0 && (
                  <div className="adper-selected-info">
                    <p className="adper-selected-text">
                      Đã chọn {selectedStudents.length} học sinh
                    </p>
                  </div>
                )}
              </div>

              <div className="adper-modal-footer">
                <button
                  onClick={() => {
                    setShowAddStudentModal(false);
                    setSelectedExam(null);
                    setSelectedStudents([]);
                  }}
                  className="adper-btn adper-btn-cancel"
                >
                  Hủy
                </button>
                <button
                  onClick={addStudentsToExam}
                  disabled={selectedStudents.length === 0}
                  className="adper-btn adper-btn-confirm"
                >
                  Thêm {selectedStudents.length} học sinh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPermissionInterface;