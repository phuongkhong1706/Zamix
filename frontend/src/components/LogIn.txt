import React, { useState } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { Link } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Đăng nhập thất bại!");
        return;
      }

      if (!data.role || !data.email) {
        alert("Dữ liệu từ API không hợp lệ!");
        return;
      }

      const userData = {
        email: data.email,
        full_name: data?.full_name || data.email,
        role: data.role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      onLoginSuccess(userData.role);
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      backgroundImage: "url('https://images.pexels.com/photos/869258/pexels-photo-869258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: "rgba(249, 249, 249, 0.9)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", textTransform: "uppercase", fontWeight: "bold", marginBottom: "10px" }}>
          <FaUserGraduate size={28} color="#003366" /> Toán học sinh viên <FaUserGraduate size={28} color="#003366" />
        </h2>

        <form onSubmit={handleLogin} autoComplete="off">
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Tên đăng nhập:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "94%", padding: "10px", marginTop: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "94%", padding: "10px", marginTop: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#003366",
              color: "white",
              border: "2px solid #003366",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#003366";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#003366";
              e.target.style.color = "white";
            }}
          >
            <span>Đăng nhập</span>
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <Link to="/forgotpassword" style={{ color: "#6f3e76", textDecoration: "underline" }}>
            Quên mật khẩu?
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button type="submit" style={styles.button}>Đăng nhập</button>
              <p style={{ marginLeft: "10px", marginBottom: "5px" }}>
                Bạn chưa có tài khoản? 
                <Link to="/signup" style={{ color: "#6f3e76", textDecoration: "none", fontWeight: "bold" }}>
                  Đăng ký ngay
                </Link>
              </p>
            </div>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    display: "flex",
    height: "100vh",  // Dùng minHeight thay vì height để tránh thừa khoảng trống khi nội dung lớn hơn viewport
    overflow: "hidden",
    position: "relative", // Đảm bảo phần con bị giới hạn trong khung cha
  },
  leftPanel: {
    width: "60%",
    position: "relative",
    backgroundColor: "#6f3e76",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    textAlign: "center",
    color: "white",
  },
  logo: {
    width: "100px",
    height: "100px",
    marginBottom: "10px",
  },
  logoText: {
    fontSize: "28px",
    fontWeight: "bold",
  },
  description: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  homeButton: {
    padding: "10px 20px",
    backgroundColor: "white",
    color: "#6f3e76",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  rightPanel: {
    width: "45%",
    backgroundColor: "#fff",
    position: "relative",
  },
  curve: {
    position: "absolute",
    left: "-25%", // Giữ nguyên vị trí giữa 2 panel
    top: "35%", // Cố định vào lề trên
    transform: "translateX(-50%) rotate(90deg)", // Giữ nguyên xoay dọc
    width: "auto", // Để tránh zoom làm thay đổi kích thước
    height: "100%", // Luôn kéo dài theo chiều cao của `rightPanel`
    minWidth: "90px",
    minHeight: "100vh", // Giữ full màn hình
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: 1,
  },
  formContainer: {
    position: "relative",
    zIndex: "2", // Đảm bảo nó hiển thị trên SVG
    backgroundColor: "#fff",
    padding: "30px 40px 30px 10px", // padding: top right bottom left
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px",
    marginTop:"-5px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    width: "50%",
    padding: "10px",
    backgroundColor: "#6f3e76",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: "15px",
  },

    // Style cho input
  inputContainerStyle: {
    position: "relative",
    marginBottom: "15px",
  },

  inputStyle: {
    paddingRight: "10px",
    width: "96%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
  },

  placeholderStyle: {
    position: "absolute",
    left: "12px",
    top: "10px",
    color: "rgba(200, 200, 200, 0.3)",
    transition: "0.2s ease",
    pointerEvents: "none",
    borderRadius: "5px",
    backgroundColor: "white", // Làm nền cho placeholder để không bị viền che
    padding: "0 5px", // Tạo khoảng trống giữa placeholder và viền
    zIndex: 1, // Đặt trên input
  },

  focusedPlaceholderStyle: {
    top: "-8px",
    left: "10px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#6f3e76",
    backgroundColor: "white", // Giữ nguyên nền khi focus
    padding: "0 5px",
    zIndex: 1, // Đặt trên input
  },

  selectStyle: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#fff",
    marginBottom: "10px",
  },
};


export default Login;