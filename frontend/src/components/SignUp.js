import React, { useState } from "react";

const provinces = [
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "TP Hồ Chí Minh", label: "TP Hồ Chí Minh" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "Hải Phòng", label: "Hải Phòng" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Nam Định", label: "Nam Định" },
  // Thêm các tỉnh/thành phố khác vào đây
];

function Signup() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birth_date: "",
    gender: "Nam",
    user_type: "Sinh viên",
    address: "",
    avatar: null,
  });

  const [focusedField, setFocusedField] = useState('');
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Kiểm tra xem giá trị nhập vào có trong danh sách không
    const isValid = provinces.some((p) => p.value === value);
    if (!isValid && value !== "") {
      setError("Vui lòng chọn một tỉnh/thành phố hợp lệ.");
    } else {
      setError("");
    }
  };

  
  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = (field) => setFocusedField(prev => (formData[field] ? prev : ''));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setFormData({ ...formData, avatar: file });
    } else {
      alert("Chỉ chấp nhận file .jpg hoặc .png");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    // Chuẩn bị FormData để gửi multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append("full_name", formData.full_name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("birth_date", formData.birth_date);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("user_type", formData.user_type);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("password", formData.password);

    if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);  // Thêm file ảnh nếu có
    }

    try {
        const response = await fetch("http://localhost:8000/api/signup/", {
            method: "POST",
            body: formDataToSend,
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    } catch (error) {
        alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <div style={outerContainerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Welcome to my pon</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={sectionContainerStyle}>
            <div style={sectionStyle}>
              {/* FULL NAME */}
              <div style={inputContainerStyle}>
                <label
                  style={{
                    ...placeholderStyle,
                    ...(focusedField === 'full_name' || formData.full_name ? focusedPlaceholderStyle : {}),
                  }}
                >
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('full_name')}
                  onBlur={() => handleBlur('full_name')}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === 'full_name' ? '#6f3e76' : '#ccc',
                  }}
                  required
                />
              </div>

              {/* BIRTH DATE */}
              <div style={inputContainerStyle}>
                <label
                  style={{
                    ...placeholderStyle,
                    ...(focusedField === 'birth_date' || formData.birth_date ? focusedPlaceholderStyle : {}),
                  }}
                >
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  onFocus={() => handleFocus('birth_date')}
                  onBlur={() => handleBlur('birth_date')}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === 'birth_date' ? '#6f3e76' : '#ccc',
                  }}
                />
              </div>

              {/* EMAIL */}
              <div style={inputContainerStyle}>
                <label
                  style={{
                    ...placeholderStyle,
                    ...(focusedField === 'email' || formData.email ? focusedPlaceholderStyle : {}),
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === 'email' ? '#6f3e76' : '#ccc',
                  }}
                  required
                />
              </div>

              {/* PHONE */}
              <div style={inputContainerStyle}>
                <label
                  style={{
                    ...placeholderStyle,
                    ...(focusedField === 'phone' || formData.phone ? focusedPlaceholderStyle : {}),
                  }}
                >
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => handleFocus('phone')}
                  onBlur={() => handleBlur('phone')}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === 'phone' ? '#6f3e76' : '#ccc',
                  }}
                  required
                />
              </div>

              {/* USER TYPE */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  style={{ ...selectStyle, width: "49%" }} // Đảm bảo chia đôi chiều rộng
                >
                  <option value="" disabled>
                    Loại tài khoản
                  </option>
                  <option value="Sinh viên">Sinh viên</option>
                  <option value="Giảng viên">Giảng viên</option>
                </select>

                {/* GENDER */}
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ ...selectStyle, width: "49%" }} // Đảm bảo chia đôi chiều rộng
                >
                  <option value="" disabled>
                    Giới tính
                  </option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

            </div>
            <div style={sectionStyle}>


              {/* ADDRESS */}
              <div style={inputContainerStyle}>
                <label
                  style={{
                    ...placeholderStyle,
                    ...(formData.address ? focusedPlaceholderStyle : {}),
                  }}
                >
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  list="provinceList"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("address")}
                  onBlur={() => setFocusedField("")}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === "address" ? "#6f3e76" : "#ccc", // Viền đổi màu tím khi focus
                  }}
                />
                <datalist id="provinceList">
                  {provinces.map((p) => (
                    <option key={p.value} value={p.value} />
                  ))}
                </datalist>
                {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
              </div>

              {/* PASSWORD */}
              <div style={inputContainerStyle}>
                <label
                  style={{
                    ...placeholderStyle,
                    ...(focusedField === 'password' || formData.password ? focusedPlaceholderStyle : {}),
                  }}
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === 'password' ? '#6f3e76' : '#ccc',
                  }}
                  required
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div style={inputContainerStyle}>
                <label
                  style={{
                    ...placeholderStyle,
                    ...(focusedField === 'confirmPassword' || formData.confirmPassword ? focusedPlaceholderStyle : {}),
                  }}
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={() => handleBlur('confirmPassword')}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === 'confirmPassword' ? '#6f3e76' : '#ccc',
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/*<label style={{ fontWeight: 'bold', marginTop: '20px', color: '#6f3e76' }}>
            AVATAR
          </label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            style={inputStyleAV}
          /> */}

          <button type="submit" style={buttonStyle}>Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

const outerContainerStyle = {
  display: "flex",
  justifyContent: "center", // Canh giữa theo chiều ngang
  minHeight: "100vh", // Đảm bảo toàn bộ chiều cao màn hình
  backgroundColor: "#f1f1f1",
  padding: "20px 0", // Giữ khoảng cách cố định từ lề trên
  boxSizing: "border-box", // Đảm bảo padding không làm phồng layout
};

const formContainerStyle = {
  width: "900px",
  padding: "30px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
  marginTop: "0", // Xóa canh lề cũ
};


// Phần tiêu đề
const titleStyle = {
  textAlign: "center",
  fontWeight: "bold",
  marginBottom: "20px",
};

// Form chính
const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const sectionContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
};

const sectionStyle = {
  width: "45%",
  backgroundColor: "#f1f1f1",
  padding: "15px",
  borderRadius: "8px",
};

// Style cho input
const inputContainerStyle = {
  position: "relative",
  marginBottom: "15px",
};

const inputStyle = {
  width: "94%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  outline: "none",
};

const placeholderStyle = {
  position: "absolute",
  left: "12px",
  top: "10px",
  color: "rgba(200, 200, 200, 0.3)",
  transition: "0.2s ease",
  pointerEvents: "none",
  backgroundColor: "white", // Làm nền cho placeholder để không bị viền che
  padding: "0 5px", // Tạo khoảng trống giữa placeholder và viền
  zIndex: 1, // Đặt trên input
};

const focusedPlaceholderStyle = {
  top: "-8px",
  left: "10px",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#6f3e76",
  backgroundColor: "#f1f1f1", // Giữ nguyên nền khi focus
  padding: "0 5px",
  zIndex: 1, // Đặt trên input
};

// Style cho select box
const selectStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  backgroundColor: "#fff",
  marginBottom: "10px",
};

// Style cho file input
// const inputStyleAV = {
//   width: "97.5%",
//   padding: "10px",
//   border: "1px solid #ccc",
//   borderRadius: "5px",
//   marginBottom: "10px",
// };

// Nút đăng ký
const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#6f3e76",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "15px",
};

export default Signup;