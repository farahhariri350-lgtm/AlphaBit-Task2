import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';

const UserLayout = () => {
  const { bgColor } = useContext(ThemeContext);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor }}>
  
      <Navbar /> 
      
     
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main> 
    </div>
  );
};

export default UserLayout;