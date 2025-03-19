import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

function Signup() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    user_name: "",
    password: "",
    confirmPassword: "",
  });

  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={outerContainerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>
          <FaUserPlus size={24} color="#003366" /> Đăng Ký
        </h2>
        <form style={formStyle}>
          {[
            { name: "full_name", label: "Họ và tên", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Số điện thoại", type: "text" },
            { name: "user_name", label: "Tên đăng nhập", type: "text" },
            { name: "password", label: "Mật khẩu", type: "password" },
            { name: "confirmPassword", label: "Xác nhận mật khẩu", type: "password" },
          ].map(({ name, label, type }) => (
            <div key={name} style={{ position: "relative", marginBottom: "20px" }}>
              <label
                style={{
                  position: "absolute",
                  left: "12px",
                  top: focusedField === name || formData[name] ? "-8px" : "50%",
                  transform: focusedField === name || formData[name] ? "none" : "translateY(-50%)",
                  transition: "all 0.3s ease",
                  color: focusedField === name ? "#003366" : "gray",
                  fontSize: focusedField === name || formData[name] ? "12px" : "16px",
                  background: "white",
                  padding: "0 5px",
                  borderRadius: "5px",
                }}
              >
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                onFocus={() => setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: "100%",
                  padding: "12px 10px",
                  border: `2px solid ${focusedField === name ? "#003366" : "#ccc"}`,
                  borderRadius: "5px",
                  fontSize: "16px",
                  outline: "none",
                  paddingTop: "18px",
                }}
              />
            </div>
          ))}
          <button type="submit" style={buttonStyle}>Đăng ký</button>
        </form>
      </div>
    </div>
  );
}

const outerContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f1f1f1",
};

const formContainerStyle = {
  width: "400px",
  padding: "30px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
};

const titleStyle = {
  textAlign: "center",
  textTransform: "uppercase",
  fontWeight: "bold",
  marginBottom: "20px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#003366",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "uppercase",
  marginTop: "15px",
};

export default Signup;
