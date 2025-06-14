// ForgotPassword.js
import React, { useState } from 'react';
import '../styles/ForgotPassword.css'; // File CSS để styling

const ForgotPassword = () => {
    // State để lưu trữ giá trị email người dùng nhập vào
    const [email, setEmail] = useState('');

    // Hàm xử lý khi người dùng gửi form
    const handleSubmit = (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form (tải lại trang)

        // --- Logic xử lý gửi email đặt lại mật khẩu sẽ ở đây ---
        // Ví dụ: gọi API đến server của bạn
        console.log('Yêu cầu đặt lại mật khẩu cho email:', email);

        // Hiển thị thông báo cho người dùng
        alert(`Nếu email "${email}" tồn tại trong hệ thống, chúng tôi đã gửi một liên kết đặt lại mật khẩu.`);

        // Reset ô input sau khi gửi
        setEmail('');
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <h2>Quên Mật Khẩu? 🤔</h2>
                <p>
                    Đừng lo lắng! Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
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
                    <button type="submit">Gửi Yêu Cầu</button>
                </form>
                <div className="back-to-login">
                    <a href="/login">Quay lại trang Đăng nhập</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;