import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export default function ThemeProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  // 1. تحميل قائمة المستخدمين
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('allUsers');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. تحميل المستخدم الحالي
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    try {
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // 3. حالات الأدمن والرتبة والألوان
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || null);
  const [systemColor, setSystemColor] = useState(() => localStorage.getItem('pageColor') || '#111827');
  const [bgColor, setBgColor] = useState(systemColor);

  // 4. تحميل المستخدم المختار (مهم للريفريش)
  const [selectedUser, setSelectedUser] = useState(() => {
    const savedId = localStorage.getItem('selectedUserId');
    return (savedId && allUsers.length > 0) ? allUsers.find(u => u.id === savedId) : null;
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // مزامنة الـ LocalStorage
  useEffect(() => { localStorage.setItem('userRole', userRole || ''); }, [userRole]);
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => {
    if (selectedUser) localStorage.setItem('selectedUserId', selectedUser.id);
    else localStorage.removeItem('selectedUserId');
  }, [selectedUser]);

  // دالة تحديث بيانات أي مستخدم
  const updateUser = (id, updatedData) => {
    if (!id) return;
    setAllUsers(prev => {
      const newList = prev.map(u => u.id === id ? { ...u, ...updatedData } : u);
      localStorage.setItem('allUsers', JSON.stringify(newList));
      return newList;
    });
    if (currentUser?.id === id) setCurrentUser(prev => ({ ...prev, ...updatedData }));
    if (selectedUser?.id === id) setSelectedUser(prev => ({ ...prev, ...updatedData }));
  };

  // --- دالة تغيير اللون الذكية (تم إصلاحها هنا) ---
  const changeColor = (newColor, targetUserId = null) => {
    const isUserPage = window.location.pathname.includes('/user/');

    if (userRole === 'admin') {
      // الحالة 1: الأدمن داخل صفحة موظف ويغير لون الموظف
      if (isUserPage && targetUserId && targetUserId !== currentUser?.id) {
        updateUser(targetUserId, { userColor: newColor });
      } 
      // الحالة 2: الأدمن في الداشبورد أو يغير لونه الشخصي
      else {
        setSystemColor(newColor);
        localStorage.setItem('pageColor', newColor);
        setBgColor(newColor);
        updateUser(currentUser?.id, { userColor: newColor });
      }
    } else {
      // الحالة 3: مستخدم عادي يغير لونه
      updateUser(currentUser?.id, { userColor: newColor });
      setBgColor(newColor);
    }
  };

  // --- محرك مراقبة الألوان والمسارات ---
  useEffect(() => {
    const applyCorrectColor = () => {
      const path = window.location.pathname;
      const isUserPage = path.includes('/user/');
      
      let colorToApply = systemColor;

      if (userRole === 'admin') {
        if (isUserPage && selectedUser) {
          const userInList = allUsers.find(u => u.id === selectedUser.id);
          colorToApply = userInList?.userColor || systemColor;
        } else {
          colorToApply = systemColor;
        }
      } else if (userRole === 'user') {
        const userInList = allUsers.find(u => u.id === currentUser?.id);
        colorToApply = userInList?.userColor || systemColor;
      }

      setBgColor(colorToApply);
      document.body.style.backgroundColor = colorToApply;
    };

    applyCorrectColor();
    const interval = setInterval(applyCorrectColor, 150);
    return () => clearInterval(interval);
  }, [currentUser, systemColor, userRole, selectedUser, allUsers]);

  return (
    <ThemeContext.Provider value={{ 
      bgColor, changeColor, userRole, setUserRole, 
      currentUser, setCurrentUser, allUsers, setAllUsers, 
      updateUser, selectedUser, setSelectedUser, isLoading 
    }}>
      <div style={{ minHeight: '100vh', transition: '0.5s ease' }}>
        {!isLoading && children} 
      </div>
    </ThemeContext.Provider>
  );
}