import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();  // ✅ Lấy token từ URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ cả hai trường mật khẩu.');
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    console.log("🔐 Dữ liệu gửi đi:", {
    token: token,
    new_password: password
  });
    try {
      const res = await fetch('http://localhost:8000/api/resetpassword/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,  // ✅ Truyền đúng token
          new_password: password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      console.error('Lỗi gửi request:', err);
      setError('Không thể kết nối với máy chủ.');
    }
  };

  if (success) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form success-message">
          <h3>✅ Thành công!</h3>
          <p>Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập lại để sử dụng.</p>
          <a href="/login" className="login-link">Đi đến trang Đăng nhập</a>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Đặt lại mật khẩu</h2>
        <p>Vui lòng tạo một mật khẩu mới mạnh và dễ nhớ.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">Mật khẩu mới</label>
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}
          <button type="submit">Cập nhật mật khẩu</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
