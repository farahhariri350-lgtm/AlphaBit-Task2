import React, { useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate, useParams } from 'react-router-dom';
import './UserPage.css';

const UserPage = () => {
  const { currentUser, selectedUser, userRole, setSelectedUser, allUsers } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { id } = useParams(); 


  let userToDisplay = (userRole === 'admin' && selectedUser) ? selectedUser : currentUser;

  if (userRole === 'admin' && id) {
    const foundUser = allUsers.find(u => String(u.id) === String(id));
    if (foundUser) userToDisplay = foundUser;
  }


  useEffect(() => {
    if (userRole === 'admin' && id && !selectedUser) {
      const foundUser = allUsers.find(u => String(u.id) === String(id));
      if (foundUser) setSelectedUser(foundUser);
    }
  }, [id, userRole, allUsers, selectedUser, setSelectedUser]);

  if (!userToDisplay) return <div style={{color:'white'}}>Loading User Data...</div>;

  return (
    <div className="user-page-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{userToDisplay.name.charAt(0).toUpperCase()}</div>
          <h2 style={{color: 'white', margin: '0', fontSize: '28px', fontWeight: '800'}}>{userToDisplay.name}</h2>
          <p style={{color: '#64748b', fontSize: '14px', marginTop: '8px'}}>{userToDisplay.email}</p>
        </div>
        <div className="profile-info-grid">
          <div className="info-item">
            <span className="info-label">Access Level</span>
            <span className="info-value" style={{color: '#3b82f6'}}>
               {userToDisplay.id === currentUser?.id ? 'System Admin' : 'Staff Member'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Profession</span>
            <span className="info-value">{userToDisplay.job || 'Technician'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Net Salary</span>
            <span className="info-value" style={{color: '#2dd4bf'}}>${userToDisplay.salary || '0'}</span>
          </div>
        </div>
        {userRole === 'admin' && (
          <button className="back-btn" onClick={() => { setSelectedUser(null); navigate('/admin'); }}>
            ← Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default UserPage;