import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../../menu.css";

function GuestMenu() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook để điều hướng
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
    activePath.startsWith("/guest/lien-he/facebook") || activePath.startsWith("/guest/lien-he/zalo");

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      // if (searchRef.current && !searchRef.current.contains(event.target) && searchText === "") {
      //   setIsSearchOpen(false);
      // }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="nav">
      {/* Logo */}
      <div className="logo">
        <img src="/img/icon-cats.png" alt="Logo" />
        <span>Ameo</span>
      </div>

      {/* Menu items */}
      <ul className="nav-menu">
        <li className={activePath === "/guest/home" ? "active" : ""}>
          <Link to="/guest/home" className="menu-link">Trang chủ</Link>
        </li>
        <li className={activePath === "/guest/thong-bao" ? "active" : ""}>
          <Link to="/guest/thong-bao" className="menu-link">Thông báo</Link>
        </li>
        <li className={activePath === "/guest/su-kien" ? "active" : ""}>
          <Link to="/guest/su-kien" className="menu-link">Sự kiện</Link>
        </li>
        <li className={activePath === "/guest/the-le" ? "active" : ""}>
          <Link to="/guest/the-le" className="menu-link">Thể lệ</Link>
        </li>

        {/* Tab "Kết quả" có submenu */}
        <li
          className={`has-submenu ${isDropdownOpen ? "submenu-hover" : ""} ${isParentActive ? "submenu-active" : ""}`}
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
          ref={dropdownRef}
        >
          <span className="menu-link">Liên hệ</span> <span className="dropdown-icon"></span>
          <ul className={`submenu ${isDropdownOpen ? "open" : ""}`}>
            <li className={activePath === "/guest/lien-he/facebook" ? "submenu-active" : ""}>
              <Link to="/guest/lien-he/facebook">Facebook</Link>
            </li>
            <li className={activePath === "/guest/lien-he/zalo" ? "submenu-active" : ""}>
              <Link to="/guest/lien-he/zalo">Zalo</Link>
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
          <img src="/img/icon-search.png" alt="Search" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onBlur={handleSearchBlur}
          />
        </div>
        <button className="login-button" onClick={() => navigate("/login")}>
          Đăng nhập
        </button>
        <button className="signup-button" onClick={() => navigate("/signup")}>
          Đăng ký</button>
      </div>
    </nav>
  );
}

export default GuestMenu;
