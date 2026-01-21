import React, { useContext } from 'react';
import ColorButtons from './ColorButtons';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';


const Navbar = () => {
  const { setUserRole, setCurrentUser, userRole, setSelectedUser } = useContext(ThemeContext);
  const navigate = useNavigate();

 const handleLogout = () => {
  setUserRole(null);
  setCurrentUser(null);

  localStorage.removeItem('userRole');
  localStorage.removeItem('currentUser');
  navigate('/login');
};
  const handleGoBack = () => {
    setSelectedUser(null); 
    navigate('/admin');    
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '10px 30px', 
      background: '#111827', 
      color: 'white',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <strong style={{ fontSize: '18px' }}>
          User <span style={{ color: '#3b82f6' }}>Portal</span>
        </strong>

      
        {userRole === 'admin' && (
          <button 
            onClick={handleGoBack}
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              padding: '5px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold'
            }}
          >
            🏠 Back to Admin
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ColorButtons /> 
        
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: '#ef4444', 
            color: 'white', 
            border: 'none', 
            padding: '7px 15px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;