import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoAmeoWhite from "../assets/icon/icon-cats-white.png";
import "../styles/LogIn.css";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (field) => setFocusedField(field);

  const handleBlur = (field, value) => {
    setFocusedField((prev) => (prev === field && !value.trim() ? "" : prev));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
  
      // Lưu vào localStorage
      const userData = {
        email: data.email,
        full_name: data.full_name || data.email,
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
    <div className="loginouterContainer">
      <div className="loginleftPanel">
        <div className="logincontent">
          <img src={logoAmeoWhite} alt="Ameo Logo" className="loginlogo" />
          <h1 className="loginlogoText">Ameo</h1>
          <p className="logindescription">We're barely cats</p>
          <button className="loginhomeButton" onClick={() => navigate("/guest/home")}>
            Khám phá ngay
          </button>
        </div>
      </div>
      
      <div className="loginrightPanel">
        <div className="loginformContainer">
          <h2 className="logintitle"> Đăng nhập </h2>
          <form onSubmit={handleSubmit} className="loginform">
            {/* EMAIL */}
            <div className="logininputContainer">
              <label
                className={`loginplaceholder ${
                  focusedField === "email" || email ? "loginfocusedPlaceholder" : ""
                }`}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email", email)}
                className="logininput"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="logininputContainer">
              <label
                className={`loginplaceholder ${
                  focusedField === "password" || password ? "loginfocusedPlaceholder" : ""
                }`}
              >
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password", password)}
                className="logininput"
                required
              />
            </div>
            
            {/* BUTTON SIGNUP */}
            <div className="loginforgotPasswordLink">
              <Link to="/forgotpassword">Quên mật khẩu</Link>
            </div>
            <button type="submit" className="loginbutton">Đăng nhập</button>
            <p className="signupText">
                Bạn chưa có tài khoản?
                <Link to="/signup" className="signupLink">Đăng ký</Link>
            </p>
          </form>
        </div>
                {/* SVG làm viền */}  
        {/* đường cong 0.25 */}
        <svg 
          className="logincurve"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320"
        >
          <path 
            fill="#ffffff" 
            fill-opacity="0.25" 
            d="M0,128L30,154.7C60,181,120,235,180,234.7C240,235,300,181,360,165.3C420,149,480,171,540,154.7C600,139,660,85,720,90.7C780,96,840,160,900,165.3C960,171,1020,117,1080,117.3C1140,117,1200,171,1260,208C1320,245,1380,267,1410,277.3L1440,288L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
          ></path>
        </svg>
        {/* đường cong 0.5 */}
        <svg 
          className="logincurve"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320"
        >
          <path 
            fill="#ffffff" 
            fill-opacity="0.5" 
            d="M0,96L48,96C96,96,192,96,288,122.7C384,149,480,203,576,197.3C672,192,768,128,864,96C960,64,1056,64,1152,96C1248,128,1344,192,1392,224L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
        {/* đường cong 0.5 */}
        <svg 
          className="logincurve"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320"
        >
          <path 
            fill="#ffffff" 
            fill-opacity="0.5" 
            d="M0,0L20,37.3C40,75,80,149,120,165.3C160,181,200,139,240,154.7C280,171,320,245,360,266.7C400,288,440,256,480,213.3C520,171,560,117,600,106.7C640,96,680,128,720,122.7C760,117,800,75,840,64C880,53,920,75,960,122.7C1000,171,1040,245,1080,266.7C1120,288,1160,256,1200,218.7C1240,181,1280,139,1320,106.7C1360,75,1400,53,1420,42.7L1440,32L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"
          ></path>
        </svg>
        {/* đường cong trắng */}
        <svg
          className="logincurve"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,192L21.8,197.3C43.6,203,87,213,131,197.3C174.5,181,218,139,262,144C305.5,149,349,203,393,192C436.4,181,480,107,524,96C567.3,85,611,139,655,165.3C698.2,192,742,192,785,176C829.1,160,873,128,916,112C960,96,1004,96,1047,122.7C1090.9,149,1135,203,1178,234.7C1221.8,267,1265,277,1309,261.3C1352.7,245,1396,203,1418,181.3L1440,160L1440,0L1418.2,0C1396.4,0,1353,0,1309,0C1265.5,0,1222,0,1178,0C1134.5,0,1091,0,1047,0C1003.6,0,960,0,916,0C872.7,0,829,0,785,0C741.8,0,698,0,655,0C610.9,0,567,0,524,0C480,0,436,0,393,0C349.1,0,305,0,262,0C218.2,0,175,0,131,0C87.3,0,44,0,22,0L0,0Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default Login;
