import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../../styles/Menu.css";
import logoAmeo from "../../assets/icon/icon-cats.png";
import searchIcon from "../../assets/icon/icon-search.png";
import notiIcon from "../../assets/icon/icon-notification.png";
import userIcon from "../../assets/icon/icon-user.png";
import logoutIcon from "../../assets/icon/icon-logout.png"
import profileUserIcon from "../../assets/icon/icon-profile-user.png"

function TeacherMenu() {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [isResultDropDownOpen, setIsResultDropdownOpen] = useState(false);
  const [isExamsDropDownOpen, setIsExamsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Quản lý trạng thái của menu con người dùng
  const userMenuRef = useRef(null);


  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };
  const handleSearchBlur = () => {
    if (!searchText) {
      setIsSearchExpanded(false);
    }
  };

  // Xác định tab cha có active hay không
  const isResultParentActive = activePath.startsWith("/teacher/ket-qua/diem-thi") || activePath.startsWith("/teacher/ket-qua/danh-gia");  
  const isExamsParentActive = activePath.startsWith("/teacher/exams/exam_management") || activePath.startsWith("/teacher/exams/question_bank");  
  
  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen); // Đảo ngược trạng thái của menu con
  };
  
  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false); // Đóng menu nếu click ra ngoài
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsResultDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="nav">
      {/* Logo */}
      <div className="logo">
        <img src={logoAmeo} alt="Logo" />
        <span>Ameo</span>
      </div>

      {/* Menu items */}
      <ul className="nav-menu">
        <li className={activePath === "/teacher/home" ? "active" : ""}>
          <Link to="/teacher/home" className="menu-link">Trang chủ</Link>
        </li>
        {/* Tab "Kết quả" có submenu */}
        <li
          className={`has-submenu ${isExamsDropDownOpen ? "submenu-hover" : ""} ${isExamsParentActive ? "submenu-active" : ""}`}
          onMouseEnter={() => setIsExamsDropdownOpen(true)}
          onMouseLeave={() => setIsExamsDropdownOpen(false)}
          ref={dropdownRef}
        >
          <span className="menu-link">Đề thi</span> <span className="dropdown-icon"></span>
          <ul className={`submenu ${isExamsDropDownOpen ? "open" : ""}`}>
            <li className={activePath === "/teacher/exams/exam_management" ? "submenu-active" : ""}>
              <Link to="/teacher/exams/exam_management">Quản lý kỳ thi</Link>
            </li>
            <li className={activePath === "/teacher/exams/question_bank" ? "submenu-active" : ""}>
              <Link to="/teacher/exams/question_bank">Ngân hàng đề thi</Link>
            </li>
          </ul>
        </li>
        <li className={activePath === "/teacher/news" ? "active" : ""}>
          <Link to="/teacher/news" className="menu-link">Tin tức</Link> 
        </li>
        <li className={activePath === "/teacher/the-le" ? "active" : ""}>
          <Link to="/teacher/the-le" className="menu-link">Thể lệ</Link>
        </li>
{/*cái activePath === và Link to= và cái Route path = trong app.js phải giống nhau mới chạy đúng nha*/}
        {/* Tab "Kết quả" có submenu */}
        <li
          className={`has-submenu ${isResultDropDownOpen ? "submenu-hover" : ""} ${isResultParentActive ? "submenu-active" : ""}`}
          onMouseEnter={() => setIsResultDropdownOpen(true)}
          onMouseLeave={() => setIsResultDropdownOpen(false)}
          ref={dropdownRef}
        >
          <span className="menu-link">Kết quả</span> <span className="dropdown-icon"></span>
          <ul className={`submenu ${isResultDropDownOpen ? "open" : ""}`}>
            <li className={activePath === "/teacher/ket-qua/diem-thi" ? "submenu-active" : ""}>
              <Link to="/teacher/ket-qua/diem-thi">Điểm thi</Link>
            </li>
            <li className={activePath === "/teacher/ket-qua/danh-gia" ? "submenu-active" : ""}>
              <Link to="/teacher/ket-qua/danh-gia">Đánh giá</Link>
            </li>
          </ul>
        </li>
      </ul>

      {/* User section */}
      <div className="user-section">
      <div
          className={`search-container ${isSearchExpanded ? "expanded" : ""}`}
          onClick={handleSearchFocus}
        >
          <img src={searchIcon} alt="Search" className="icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onBlur={handleSearchBlur}
          />
        </div>
        <button className="icon-button">
          <img src={notiIcon} alt="Thông báo" />
        </button>
        <div className="profile" onClick={handleUserMenuToggle}>
          <img src={userIcon} alt="User" className="user-icon" />
        </div>

        {/* User menu dropdown */}
        {isUserMenuOpen && (
          <div className="user-dropdown" ref={userMenuRef}>
            <Link to="/teacher/profile" className="user-dropdown-item">
              <img
                src={profileUserIcon}
                alt="Hồ sơ cá nhân"
                className="user-dropdown-icon"
              />
              Hồ sơ cá nhân
            </Link>
            <Link
              to="#"
              className="user-dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
                if (confirmLogout) {
                  window.location.href = "/guest/home";
                }
              }}
            >
              <img
                src={logoutIcon}
                alt="Đăng xuất"
                className="user-dropdown-icon"
              />
              Đăng xuất
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default TeacherMenu;
