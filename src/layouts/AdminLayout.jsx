import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ThemeContext } from '../context/ThemeContext';
// استخدمها بـ const { ... } = useContext(ThemeContext);
import './AdminLayout.css';

const AdminLayout = () => {
  const { userRole, bgColor } = useContext(ThemeContext);

  // 1. حماية المسار: إذا لم يكن هناك دور مسجل أصلاً، ارجع للوجن
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // 2. إذا كان "يوزر" عادي وحاول يدخل مسار الأدمن، اطرده لصفحة اليوزر الخاصة به
  // (هذا يمنع اليوزر من رؤية السايد بار أو الداشبورد نهائياً)
  if (userRole === 'user') {
    return <Navigate to="/user" replace />;
  }

  return (
    <div className="admin-layout" style={{ backgroundColor: bgColor }}>
      {/* السايد بار يظهر فقط لأننا تأكدنا أعلاه أن الداخل هو Admin فقط */}
      <Sidebar />
      
      <main className="admin-main-content">
        <div className="content-overlay">
          {/* هنا ستظهر صفحة AdminPage أو أي صفحة فرعية للأدمن */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;