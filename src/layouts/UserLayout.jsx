import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
// استخدمها بـ const { ... } = useContext(ThemeContext);

const UserLayout = () => {
  const { bgColor } = useContext(ThemeContext);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor }}>
      {/* الناف بار تظهر للجميع (أدمن ويوزر) داخل مسارات الـ User */}
      <Navbar /> 
      
      {/* تم تصحيح إغلاق الوسم هنا من </div> إلى </main> */}
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main> 
    </div>
  );
};

export default UserLayout;