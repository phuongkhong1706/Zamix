import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/Menu.css";
import searchIcon from "../../assets/icon/icon-search.png";
import logoAmeo from "../../assets/icon/icon-logo.png";


function GuestMenu() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook để điều hướng
  const [activePath, setActivePath] = useState(location.pathname);
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


  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <nav className="nav">
      {/* Logo */}
      <div className="logo">
        <img src={logoAmeo} alt="Logo" />
        <span>Zamix</span>
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
