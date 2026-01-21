import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export default function ThemeProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  // 1. تحميل قائمة المستخدمين
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('allUsers');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. تحميل المستخدم الحالي (المسجل دخوله)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    try {
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || null);
  const [systemColor, setSystemColor] = useState(() => localStorage.getItem('pageColor') || '#111827');
  const [bgColor, setBgColor] = useState(systemColor);

  // 4. تحميل المستخدم المختار (عندما يتصفح الأدمن ملف مستخدم)
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

  // --- دالة تغيير اللون الذكية للـ HashRouter ---
  const changeColor = (newColor, targetUserId = null) => {
    const hash = window.location.hash;
    const isViewingUserPage = hash.includes('/user/');

    if (userRole === 'admin') {
      // إذا كان الأدمن يغير لون مستخدم آخر
      if (isViewingUserPage && (targetUserId || selectedUser)) {
        const idToUpdate = targetUserId || selectedUser.id;
        updateUser(idToUpdate, { userColor: newColor });
      } 
      // إذا كان الأدمن يغير لونه الخاص
      else {
        setSystemColor(newColor);
        localStorage.setItem('pageColor', newColor);
        setBgColor(newColor);
        updateUser(currentUser?.id, { userColor: newColor });
      }
    } else {
      // مستخدم عادي يغير لونه
      updateUser(currentUser?.id, { userColor: newColor });
      setBgColor(newColor);
    }
  };

  // --- مراقب الألوان والمسارات ---
  useEffect(() => {
    const applyCorrectColor = () => {
      const hash = window.location.hash;
      const isUserPage = hash.includes('/user/');
      
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
    // استماع لتغيير الهاش لضمان تحديث اللون فوراً عند التنقل
    window.addEventListener('hashchange', applyCorrectColor);
    return () => window.removeEventListener('hashchange', applyCorrectColor);
  }, [currentUser, systemColor, userRole, selectedUser, allUsers]);

  return (
    <ThemeContext.Provider value={{ 
      bgColor, changeColor, userRole, setUserRole, 
      currentUser, setCurrentUser, allUsers, setAllUsers, 
      updateUser, selectedUser, setSelectedUser, isLoading 
    }}>
      <div style={{ minHeight: '100vh', transition: '0.4s ease-in-out' }}>
        {!isLoading && children} 
      </div>
    </ThemeContext.Provider>
  );
}