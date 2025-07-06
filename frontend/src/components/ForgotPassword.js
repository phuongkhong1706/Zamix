import React, { useState } from 'react';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setStatusMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/forgotpw/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage(data.message || 'OTP đã được gửi về email của bạn.');
      } else {
        setStatusMessage(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      setStatusMessage('Đã xảy ra lỗi mạng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setEmail('');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Quên Mật Khẩu? 🤔</h2>
        <p>
          Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã OTP đặt lại mật khẩu.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Địa chỉ Email</label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
          </button>
        </form>

        {statusMessage && (
          <div className="status-message">{statusMessage}</div>
        )}

        <div className="back-to-login">
          <a href="/login">Quay lại trang Đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
