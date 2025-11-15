import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG, ROUTES } from '../../utils/constants';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: ROUTES.HOME, label: 'Chat', icon: '💬' },
    { path: ROUTES.USERS, label: 'Users', icon: '👥' },
  ];

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <div className="brand">
            <Link to={ROUTES.HOME} className="brand-link">
              <h1>{APP_CONFIG.NAME}</h1>
              <p>{APP_CONFIG.DESCRIPTION}</p>
            </Link>
          </div>
          
          <nav className="main-nav">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      location.pathname === item.path ? 'active' : ''
                    }`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;