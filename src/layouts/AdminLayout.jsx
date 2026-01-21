import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ThemeContext } from '../context/ThemeContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { userRole, bgColor } = useContext(ThemeContext);

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'user') {
    return <Navigate to="/user" replace />;
  }

  return (
    <div className="admin-layout" style={{ backgroundColor: bgColor }}>

      <Sidebar />
      

      <main className="admin-main-content">
        <div className="content-overlay">
        
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;