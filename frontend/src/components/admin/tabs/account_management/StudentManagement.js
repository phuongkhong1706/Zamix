import React, { useState } from 'react';
import { Search, Plus, Download, ChevronDown, Phone, Mail, Calendar, Hash, User } from 'lucide-react';
import '../../../../styles/admin/StudentManagement.css';

const AdminStudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const students = [
    {
      id: 1,
      name: 'Phương An',
      gender: '♂',
      email: 'anp44@ed.onluyen.vn',
      studentId: '6113977e426796bb9726c8ba',
      birthDate: '01/01/2006',
      phone: '8436942630',
      status: 'ENQYT',
      class: 'Lớp 12',
      grade: '12A12, 12B1',
      avatar: '🙂'
    },
    {
      id: 2,
      name: 'Đào Tuấn Anh',
      gender: '♂',
      email: 'anhdt45@ed.onluyen.vn',
      studentId: '61478504f0ab3c996249652',
      birthDate: '01/10/2006',
      phone: 'Chưa có số điện thoại',
      status: 'EFIZE',
      class: 'Lớp 12',
      grade: '12C1',
      avatar: '🙂'
    },
    {
      id: 3,
      name: 'Phương Anh',
      gender: '♂',
      email: 'anhp91@ed.onluyen.vn',
      studentId: '6115f171715168437152360',
      birthDate: '01/01/2006',
      phone: 'Chưa có email',
      status: '',
      class: 'Lớp 12',
      grade: '12A',
      avatar: '🌅'
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="stuman-container">
      <div className="stuman-content">
        <div className="stuman-header">
          <div className="stuman-form-group">
            <label>Tìm theo tên</label>
            <input
              type="text"
              placeholder="Tên hoặc tên đang nhập"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="stuman-input"
            />
          </div>

          <div className="stuman-form-group">
            <label>Khối lớp</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="stuman-select"
            >
              <option value="">Chọn khối</option>
              <option value="12">Lớp 12</option>
              <option value="11">Lớp 11</option>
              <option value="10">Lớp 10</option>
            </select>
          </div>

          <button className="stuman-btn stuman-btn-search">
            <Search className="stuman-icon" />
            Tìm kiếm
          </button>
        </div>

        <div className="stuman-student-list">
          <div className="stuman-list-header">
            <h2>Danh sách học sinh (Tổng số: {filteredStudents.length})</h2>
            <div className="stuman-actions">
              <button className="stuman-btn stuman-btn-add">
                <Plus className="stuman-icon" />
                Thêm mới
              </button>
              <button className="stuman-btn stuman-btn-export">
                <Download className="stuman-icon" />
                Xuất danh sách học sinh
              </button>
            </div>
          </div>

          <table className="stuman-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Khối</th>
                <th>Lớp</th>
                <th>Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="stuman-student-info">
                      <div className="stuman-avatar">{student.avatar}</div>
                      <div>
                        <div className="stuman-name">
                          {student.name} <span className="stuman-gender">{student.gender}</span>
                        </div>
                        <div className="stuman-subinfo">
                          <div><Mail size={12} /> {student.email}</div>
                          <div><Hash size={12} /> {student.studentId}</div>
                          <div><Calendar size={12} /> {student.birthDate}</div>
                          <div><Phone size={12} /> {student.phone}</div>
                          {student.status && <div><User size={12} /> {student.status}</div>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td><span className="stuman-badge">{student.class}</span></td>
                  <td>
                    <div className="stuman-grade-list">
                      {student.grade.split(', ').map((g, i) => (
                        <span key={i} className="stuman-grade">{g}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button className="stuman-btn stuman-btn-action">
                      Chức năng <ChevronDown size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="stuman-empty">Không tìm thấy học sinh nào</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentManagement;
