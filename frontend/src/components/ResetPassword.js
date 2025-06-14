// ResetPassword.js
import React, { useState } from 'react';
// Hook useParams để lấy tham số từ URL (ví dụ: token)
import { useParams } from 'react-router-dom';
import '../styles/ResetPassword.css'; // File CSS để styling

const ResetPassword = () => {
    // Lấy `token` từ URL, ví dụ: /reset-password/abcdef123456
    const { token } = useParams();

    // State cho các ô nhập liệu
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State để quản lý thông báo lỗi và thành công
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Hàm xử lý khi người dùng gửi form
    const handleSubmit = (event) => {
        event.preventDefault();
        setError(''); // Reset lỗi mỗi lần submit

        // --- Bắt đầu kiểm tra dữ liệu (Validation) ---
        if (!password || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ cả hai trường mật khẩu.');
            return;
        }

        if (password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp. Vui lòng thử lại.');
            return;
        }
        // --- Kết thúc kiểm tra dữ liệu ---

        // --- Logic gửi dữ liệu lên server ---
        // Tại đây, bạn sẽ gọi API để cập nhật mật khẩu trong cơ sở dữ liệu
        // Gửi `password` và `token` lên server để xác thực và xử lý.
        console.log({
            message: 'Đang gửi yêu cầu cập nhật mật khẩu...',
            password: password,
            token: token,
        });

        // Giả lập gọi API thành công
        // Trong thực tế, bạn sẽ nhận phản hồi từ server trước khi setSuccess(true)
        setSuccess(true);
    };

    // Nếu đã đổi mật khẩu thành công, hiển thị thông báo
    if (success) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-form success-message">
                    <h3>✅ Thành công!</h3>
                    <p>Mật khẩu của bạn đã được cập nhật. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.</p>
                    <a href="/login" className="login-link">Đi đến trang Đăng nhập</a>
                </div>
            </div>
        );
    }

    // Hiển thị form đặt lại mật khẩu
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

                    {/* Hiển thị thông báo lỗi nếu có */}
                    {error && <p className="error-message">{error}</p>}

                    <button type="submit">Cập nhật mật khẩu</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;