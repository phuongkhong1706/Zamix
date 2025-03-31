import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../../styles/Menu.css";
import logoAmeo from "../../assets/icon/icon-cats.png";
import searchIcon from "../../assets/icon/icon-search.png";
import notiIcon from "../../assets/icon/icon-notification.png";
import userIcon from "../../assets/icon/icon-user.png";


function StudentMenu() {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };
  const handleSearchBlur = () => {
    if (!searchText) {
      setIsSearchExpanded(false);
    }
  };

  // Xác định tab cha có active hay không
  const isParentActive =
    activePath.startsWith("/student/ket-qua/diem-thi") || activePath.startsWith("/student/ket-qua/danh-gia");

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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
        <li className={activePath === "/student/home" ? "active" : ""}>
          <Link to="/student/home" className="menu-link">Trang chủ</Link>
        </li>
        <li className={activePath === "/student/do_exam" ? "active" : ""}>
          <Link to="/student/do_exam" className="menu-link">Vào thi</Link>
        </li>
        <li className={activePath === "/student/tin-tuc" ? "active" : ""}>
          <Link to="/student/tin-tuc" className="menu-link">Tin tức</Link> 
        </li>
        <li className={activePath === "/student/the-le" ? "active" : ""}>
          <Link to="/student/the-le" className="menu-link">Thể lệ</Link>
        </li>
{/*cái activePath === và Link to= và cái Route path = trong app.js phải giống nhau mới chạy đúng nha*/}
        {/* Tab "Kết quả" có submenu */}
        <li
          className={`has-submenu ${isDropdownOpen ? "submenu-hover" : ""} ${isParentActive ? "submenu-active" : ""}`}
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
          ref={dropdownRef}
        >
          <span className="menu-link">Kết quả</span> <span className="dropdown-icon"></span>
          <ul className={`submenu ${isDropdownOpen ? "open" : ""}`}>
            <li className={activePath === "/student/ket-qua/diem-thi" ? "submenu-active" : ""}>
              <Link to="/student/ket-qua/diem-thi">Điểm thi</Link>
            </li>
            <li className={activePath === "/student/ket-qua/danh-gia" ? "submenu-active" : ""}>
              <Link to="/student/ket-qua/danh-gia">Đánh giá</Link>
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
        <div className="profile">
          <img src={userIcon} alt="User" className="user-icon" />
        </div>
      </div>
    </nav>
  );
}

export default StudentMenu;
