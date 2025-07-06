import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Download, Users, GraduationCap, BookOpen } from 'lucide-react';
import '../../../../styles/admin/AccMan.css';
import axios from "axios";

const AdminAccountManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);


  useEffect(() => {
    axios.get("http://localhost:8000/api/admin/admin_user/")
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách người dùng:", err);
      });
  }, []);

  // Filter và search users
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.student_code && user.student_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.teacher_code && user.teacher_code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(user => user.user_type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus, users]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setModalMode('view');
    setSelectedUser(user);
    setShowModal(true);
  };

const handleDeleteUser = (userId) => {
  if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
    fetch(`http://localhost:8000/api/admin/admin_user/${userId}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Xóa không thành công');
        }
        // Cập nhật danh sách users sau khi xóa thành công
        setUsers(users.filter(user => user.id !== userId));
        alert('Xóa người dùng thành công');
      })
      .catch((error) => {
        console.error('Lỗi khi xóa người dùng:', error);
        alert('Đã xảy ra lỗi khi xóa người dùng');
      });
  }
};


  const getUserTypeLabel = (type) => {
    switch (type) {
      case 'student': return 'Học sinh';
      case 'teacher': return 'Giáo viên';
      default: return type;
    }
  };

  const getStatusBadge = (status) => {
    let statusClass = "adman-badge";
    switch (status) {
      case 'active':
        statusClass += " active";
        break;
      case 'inactive':
        statusClass += " inactive";
        break;
      default:
        statusClass += " default";
    }
    return statusClass;
  };

  const Modal = () => {
    const [formData, setFormData] = useState(selectedUser || {
      username: '',
      full_name: '',
      email: '',
      phone_number: '',
      user_type: 'student',
      status: 'active',
      gender: 'M',
      dob: '',
      national_id: '',
      address: '',
      student_code: '',
      grade: '',
      teacher_code: '',
      degree: '',
      position: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();

      const userJson = localStorage.getItem('user');
      let token = null;

      try {
        if (userJson) {
          const userObj = JSON.parse(userJson);
          token = userObj.token;
        }
      } catch (error) {
        console.error('❌ Lỗi parse user:', error);
      }

      if (!token) {
        alert('❌ Token không tồn tại. Vui lòng đăng nhập lại.');
        return;
      }

      const isNewUser = modalMode === 'create';
      const url = isNewUser
        ? `http://localhost:8000/api/admin/admin_user/`
        : `http://localhost:8000/api/admin/admin_user/${selectedUser.id}/`;

      const method = isNewUser ? 'POST' : 'PUT';

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Lỗi từ server:', errorData);
          alert(`❌ Lỗi khi ${isNewUser ? 'tạo' : 'cập nhật'} tài khoản.`);
          return;
        }

        const savedUser = await response.json();
        console.log(`✅ ${isNewUser ? 'Tạo' : 'Cập nhật'} tài khoản thành công:`, savedUser);

        // Cập nhật lại danh sách users local (nếu cần hiển thị ngay)
        if (isNewUser) {
          setUsers(prev => [...prev, savedUser]);
        } else {
          setUsers(prev => prev.map(u => (u.id === savedUser.id ? savedUser : u)));
        }

        setShowModal(false);
        window.location.reload();
      } catch (error) {
        console.error('❌ Lỗi mạng hoặc fetch:', error);
        alert('❌ Có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại.');
      }
    };


    const isReadOnly = modalMode === 'view';

    return (
      <div className="adman-modal-overlay">
        <div className="adman-modal-container">
          <div className="adman-modal-header">
            <h2 className="adman-modal-title">
              {modalMode === 'create' && 'Tạo tài khoản mới'}
              {modalMode === 'edit' && 'Chỉnh sửa tài khoản'}
              {modalMode === 'view' && 'Chi tiết tài khoản'}
            </h2>
          </div>


          <div className="adman-container">
            <div className="adman-grid">
              <div className="adman-col-span-2">
                <h3 className="adman-title">Thông tin cơ bản</h3>
              </div>

              <div>
                <label className="adman-label">Tên đăng nhập *</label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="adman-input"
                  required
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="adman-label">Họ và tên *</label>
                <input
                  type="text"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="adman-input"
                  required
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="adman-label">Email *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="adman-input"
                  required
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="adman-label">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone_number || ''}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="adman-input"
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="adman-label">Loại tài khoản *</label>
                <select
                  value={formData.user_type || 'student'}
                  onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                  className="adman-input"
                  required
                  disabled={isReadOnly}
                >
                  <option value="student">Học sinh</option>
                  <option value="teacher">Giáo viên</option>
                </select>
              </div>

              <div>
                <label className="adman-label">Trạng thái</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="adman-input"
                  disabled={isReadOnly}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              <div>
                <label className="adman-label">Giới tính</label>
                <select
                  value={formData.gender || 'M'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="adman-input"
                  disabled={isReadOnly}
                >
                  <option value="M">Nam</option>
                  <option value="F">Nữ</option>
                  <option value="O">Khác</option>
                </select>
              </div>

              <div>
                <label className="adman-label">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.dob || ''}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="adman-input"
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <label className="adman-label">Số CCCD</label>
                <input
                  type="text"
                  value={formData.national_id || ''}
                  onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                  className="adman-input"
                  disabled={isReadOnly}
                />
              </div>

              <div className="adman-col-span-2">
                <label className="adman-label">Địa chỉ</label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="adman-textarea"
                  rows="2"
                  disabled={isReadOnly}
                />
              </div>

              {formData.user_type === 'student' && (
                <>
                  <div className="adman-col-span-2">
                    <h3 className="adman-title">Thông tin học sinh</h3>
                  </div>
                  <div>
                    <label className="adman-label">Mã học sinh</label>
                    <input
                      type="text"
                      value={formData.student_code || ''}
                      onChange={(e) => setFormData({ ...formData, student_code: e.target.value })}
                      className="adman-input"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div>
                    <label className="adman-label">Lớp</label>
                    <input
                      type="text"
                      value={formData.grade || ''}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="adman-input"
                      disabled={isReadOnly}
                    />
                  </div>
                </>
              )}

              {formData.user_type === 'teacher' && (
                <>
                  <div className="adman-col-span-2">
                    <h3 className="adman-title">Thông tin giáo viên</h3>
                  </div>
                  <div>
                    <label className="adman-label">Mã giáo viên</label>
                    <input
                      type="text"
                      value={formData.teacher_code || ''}
                      onChange={(e) => setFormData({ ...formData, teacher_code: e.target.value })}
                      className="adman-input"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div>
                    <label className="adman-label">Học vị</label>
                    <input
                      type="text"
                      value={formData.degree || ''}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="adman-input"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div>
                    <label className="adman-label">Chức vụ</label>
                    <input
                      type="text"
                      value={formData.position || ''}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="adman-input"
                      disabled={isReadOnly}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="adman-button-group">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="adman-button cancel"
              >
                {isReadOnly ? 'Đóng' : 'Hủy'}
              </button>
              {!isReadOnly && (
                <button
                  type="button"
                  className="adman-button submit"
                  onClick={handleSubmit} // ✅ GỌI handleSubmit ở đây
                >
                  {modalMode === 'create' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="adman-page-container">
      <div className="adman-content-wrapper">
        {/* Stats Cards */}
        <div className="admin-stats-container">
          <div className="admin-stats-card">
            <div className="admin-stats-card-content">
              <div className="admin-stats-icon admin-stats-icon-blue">
                <Users className="admin-stats-icon-svg" />
              </div>
              <div className="admin-stats-text">
                <p className="admin-stats-label">Tổng số tài khoản</p>
                <p className="admin-stats-value">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="admin-stats-card">
            <div className="admin-stats-card-content">
              <div className="admin-stats-icon admin-stats-icon-green">
                <GraduationCap className="admin-stats-icon-svg" />
              </div>
              <div className="admin-stats-text">
                <p className="admin-stats-label">Học sinh</p>
                <p className="admin-stats-value">
                  {users.filter(u => u.user_type === 'Học sinh').length}
                </p>
              </div>
            </div>
          </div>

          <div className="admin-stats-card">
            <div className="admin-stats-card-content">
              <div className="admin-stats-icon admin-stats-icon-purple">
                <BookOpen className="admin-stats-icon-svg" />
              </div>
              <div className="admin-stats-text">
                <p className="admin-stats-label">Giáo viên</p>
                <p className="admin-stats-value">
                  {users.filter(u => u.user_type === 'Giáo viên').length}
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Filters và Search */}
        <div className="adman-filters-wrapper">
          <div className="adman-filters-container">

            <div className="adman-search-box">
              <Search className="adman-search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="adman-searchinput"
              />
            </div>
            <div className="adman-filter-selects">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="adman-searchselect"
              >
                <option value="all">Tất cả loại</option>
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="adman-searchselect"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
              <button className="adman-export-btn">
                <Download size={20} />
                Xuất Excel
              </button>
              <button
                onClick={handleCreateUser}
                className="adman-create-button"
              >
                <Plus size={20} />
                Tạo tài khoản mới
              </button>
            </div>
          </div>
        </div>

        {/*Bảng danh sách */}
        <div className="adman-table-container">
          <div className="adman-table-scroll">
            <table className="adman-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Loại tài khoản</th>
                  <th>Mã số</th>
                  <th>Liên hệ</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="adman-row">
                    <td>
                      <div className="adman-user-info">
                        <div className="adman-avatar">
                          <span>{user.full_name.charAt(0)}</span>
                        </div>
                        <div className="adman-user-meta">
                          <div className="adman-user-name">{user.full_name}</div>
                          <div className="adman-user-username">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`adman-badge ${user.user_type}`}>
                        {getUserTypeLabel(user.user_type)}
                      </span>
                    </td>


                    <td>
                      {user.student_code || user.teacher_code || '-'}
                    </td>
                    <td>
                      <div>{user.email}</div>
                      <div className="adman-contact">{user.phone_number}</div>
                    </td>
                    <td>
                      <span className={getStatusBadge(user.status)}>
                        {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="adman-text-right">
                      <div className="adman-action-group">
                        <button onClick={() => handleViewUser(user)} title="Xem chi tiết">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEditUser(user)} title="Chỉnh sửa">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="adman-pagination">
              <div className="adman-pagination-info">
                Hiển thị {indexOfFirstUser + 1} - {Math.min(indexOfLastUser, filteredUsers.length)} trong {filteredUsers.length} kết quả
              </div>
              <div className="adman-pagination-controls">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? 'active' : ''}
                  >
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal */}
      {showModal && <Modal />}
    </div>
  );
};

export default AdminAccountManagement;