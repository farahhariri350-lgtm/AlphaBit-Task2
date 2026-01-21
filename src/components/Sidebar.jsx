import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
// استخدمها بـ const { ... } = useContext(ThemeContext);
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ColorButtons from './ColorButtons';
import './Sidebar.css';

const Sidebar = () => {
  const { setUserRole, setCurrentUser, setSelectedUser, allUsers } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

 const handleLogout = () => {
  setUserRole(null);
  setCurrentUser(null);
  // نحذف فقط بيانات الجلسة، ونترك allUsers و pageColor
  localStorage.removeItem('userRole');
  localStorage.removeItem('currentUser');
  navigate('/login');
};

  return (
    <aside className="sidebar-container">
      {/* قسم البروفايل العلوي */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 5px' }}>
        <div style={{ 
          width: '40px', height: '40px', background: 'linear-gradient(45deg, #3b82f6, #2dd4bf)', 
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' 
        }}>A</div>
        <div>
          <h4 style={{ color: 'white', margin: 0, fontSize: '15px' }}>Admin Admin</h4>
          <small style={{ color: '#475569', display: 'block' }}>Administrator</small>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      {/* قسم الإحصائيات */}
      <div>
        <span className="section-label">OVERVIEW</span>
        <div style={{ padding: '0 5px', display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
          <span style={{ fontSize: '14px', opacity: 0.8 }}>Employees</span>
          <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{allUsers?.length || 0}</span>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      {/* قسم التنقل */}
      <nav>
        <span className="section-label">MENU</span>
        <Link to="/admin" className={`sidebar-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
          🏠 Dashboard
        </Link>
        {/* تم تغيير الرابط ليكون بروفايل الأدمن وليس الموظف */}
        <Link to="/admin" className={`sidebar-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
          👤 My Profile
        </Link>
      </nav>

      <div className="sidebar-divider"></div>

      {/* قسم الألوان */}
      <div>
        <span className="section-label">THEME</span>
        <div style={{ padding: '0 5px' }}>
          <ColorButtons />
        </div>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;