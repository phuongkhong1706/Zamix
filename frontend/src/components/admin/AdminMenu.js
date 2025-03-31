import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../../styles/Menu.css";
import logoAmeo from "../../assets/icon/icon-cats.png";
import searchIcon from "../../assets/icon/icon-search.png";
import notiIcon from "../../assets/icon/icon-notification.png";
import userIcon from "../../assets/icon/icon-user.png";


function Menu() {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Xác định tab cha có active hay không
  const isParentActive =
    activePath.startsWith("/admin/ket-qua/diem-thi") || activePath.startsWith("/admin/ket-qua/danh-gia");

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
        <li className={activePath === "/admin/home" ? "active" : ""}>
          <Link to="/admin/home" className="menu-link">Trang chủ</Link>
        </li>
        <li className={activePath === "/admin/do_exam" ? "active" : ""}>
          <Link to="/admin/do_exam" className="menu-link">Vào thi</Link>
        </li>
        <li className={activePath === "/admin/tin-tuc" ? "active" : ""}>
          <Link to="/admin/tin-tuc" className="menu-link">Tin tức</Link> 
        </li>
        <li className={activePath === "/admin/the-le" ? "active" : ""}>
          <Link to="/admin/the-le" className="menu-link">Thể lệ</Link>
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
            <li className={activePath === "/admin/ket-qua/diem-thi" ? "submenu-active" : ""}>
              <Link to="/admin/ket-qua/diem-thi">Điểm thi</Link>
            </li>
            <li className={activePath === "/admin/ket-qua/danh-gia" ? "submenu-active" : ""}>
              <Link to="/admin/ket-qua/danh-gia">Đánh giá</Link>
            </li>
          </ul>
        </li>
      </ul>

      {/* User section */}
      <div className="user-section">
        <button className="icon-button">
          <img src={searchIcon} alt="Search" />
        </button>
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

export default Menu;
