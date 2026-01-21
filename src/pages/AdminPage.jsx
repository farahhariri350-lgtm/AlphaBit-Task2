import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
// استخدمها بـ const { ... } = useContext(ThemeContext);
import { useNavigate } from 'react-router-dom'; 
import './AdminPage.css';

const AdminPage = () => {
  const { allUsers, updateUser, setSelectedUser, bgColor } = useContext(ThemeContext);
  const [editingId, setEditingId] = useState(null);
  const [tempData, setTempData] = useState({ job: '', salary: '' });
  const navigate = useNavigate();

  const handleEdit = (e, user) => {
    e.stopPropagation(); // يمنع فتح صفحة اليوزر عند الضغط على زر التعديل
    setEditingId(user.id);
    setTempData({ job: user.job || '', salary: user.salary || '' });
  };

  const handleSave = (e, id) => {
    e.stopPropagation();
    updateUser(id, tempData);
    setEditingId(null);
  };

  const handleCardClick = (user) => {
 if (editingId) return; 
  setSelectedUser(user); 
  // التعديل: نذهب لمسار اليوزر التابع للأدمن
  navigate(`/admin/user/${user.id}`);
  };

  return (
    <div className="admin-page-content" style={{ backgroundColor: bgColor }}>
      {/* طبقة الشبكة والمساطر يتم التعامل معها في CSS عبر الـ ::before */}
      
      <div className="header-section">
        <div>
          <h1>Employee Directory</h1>
          <p>View and manage all registered team members</p>
        </div>
        <div className="stats-badge">
          <span className="stats-number">{allUsers.length}</span>
          <div className="stats-label">Total Staff</div>
        </div>
      </div>

      <div className="user-cards-grid">
        {allUsers.map((user) => (
          <div 
            key={user.id} 
            className={`employee-card ${editingId === user.id ? 'is-editing' : ''}`} 
            onClick={() => handleCardClick(user)}
          >
            <div className="card-top">
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div className="user-meta">
                <h4>{user.name}</h4>
                <span>{user.email}</span>
              </div>
            </div>

            <div className="card-details">
              {editingId === user.id ? (
                <div className="edit-fields" onClick={(e) => e.stopPropagation()}>
                  <div className="input-wrapper">
                    <input 
                      type="text"
                      placeholder="Job Title"
                      value={tempData.job} 
                      onChange={(e) => setTempData({...tempData, job: e.target.value})} 
                    />
                  </div>
                  <div className="input-wrapper">
                    <input 
                      type="number"
                      placeholder="Salary"
                      value={tempData.salary} 
                      onChange={(e) => setTempData({...tempData, salary: e.target.value})} 
                    />
                  </div>
                  <button className="save-btn" onClick={(e) => handleSave(e, user.id)}>
                    Update Records
                  </button>
                </div>
              ) : (
                <div className="info-fields">
                  <div className="info-row">
                    <span className="label">Profession</span>
                    <span className="value">{user.job || 'Not Set'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Monthly Salary</span>
                    <span className="value">${user.salary || '0'}</span>
                  </div>
                  <button className="edit-btn" onClick={(e) => handleEdit(e, user)}>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;