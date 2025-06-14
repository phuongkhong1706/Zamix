import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, UserPlus, Edit, Trash2, Users, Calendar, Clock } from 'lucide-react';
import '../../../styles/admin/AdminPermissionInterface.css';

const AdminPermissionInterface = () => {
  // Mock data cho kỳ thi
  const [exams, setExams] = useState([
    {
      id: 1,
      name: 'Kỳ thi Toán học lớp 10',
      subject: 'Toán',
      date: '2024-07-15',
      time: '08:00',
      status: 'pending',
      studentCount: 45,
      description: 'Kỳ thi cuối kỳ môn Toán học cho học sinh lớp 10'
    },
    {
      id: 2,
      name: 'Kỳ thi Văn học lớp 11',
      subject: 'Văn',
      date: '2024-07-18',
      time: '14:00',
      status: 'approved',
      studentCount: 32,
      description: 'Kỳ thi giữa kỳ môn Văn học cho học sinh lớp 11'
    },
    {
      id: 3,
      name: 'Kỳ thi Tiếng Anh TOEIC',
      subject: 'Tiếng Anh',
      date: '2024-07-20',
      time: '09:30',
      status: 'pending',
      studentCount: 28,
      description: 'Kỳ thi đánh giá năng lực Tiếng Anh TOEIC'
    }
  ]);

  // Mock data cho học sinh
  const [students] = useState([
    { id: 1, name: 'Nguyễn Văn An', class: '10A1', email: 'an.nguyen@email.com' },
    { id: 2, name: 'Trần Thị Bình', class: '10A2', email: 'binh.tran@email.com' },
    { id: 3, name: 'Lê Minh Cường', class: '11B1', email: 'cuong.le@email.com' },
    { id: 4, name: 'Phạm Thu Dung', class: '11B2', email: 'dung.pham@email.com' },
    { id: 5, name: 'Hoàng Văn Em', class: '12C1', email: 'em.hoang@email.com' }
  ]);

  const [selectedExam, setSelectedExam] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Xử lý duyệt kỳ thi
  const approveExam = (examId) => {
    setExams(prev => prev.map(exam => 
      exam.id === examId ? { ...exam, status: 'approved' } : exam
    ));
  };

  // Xử lý xóa kỳ thi
  const deleteExam = (examId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kỳ thi này?')) {
      setExams(prev => prev.filter(exam => exam.id !== examId));
    }
  };

  // Xử lý thêm học sinh vào kỳ thi
  const addStudentsToExam = () => {
    if (selectedStudents.length > 0 && selectedExam) {
      // Cập nhật số lượng học sinh trong kỳ thi
      setExams(prev => prev.map(exam => 
        exam.id === selectedExam.id 
          ? { ...exam, studentCount: exam.studentCount + selectedStudents.length }
          : exam
      ));
      
      alert(`Đã thêm ${selectedStudents.length} học sinh vào kỳ thi "${selectedExam.name}"`);
      setSelectedStudents([]);
      setShowAddStudentModal(false);
      setSelectedExam(null);
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