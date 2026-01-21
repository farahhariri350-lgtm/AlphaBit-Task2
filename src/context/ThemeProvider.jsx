import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export default function ThemeProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('allUsers');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    try {
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || null);
  const [systemColor, setSystemColor] = useState(() => localStorage.getItem('pageColor') || '#111827');
  const [bgColor, setBgColor] = useState(systemColor);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const updateUser = (id, updatedData) => {
    if (!id) return;
    const newList = allUsers.map(u => u.id === id ? { ...u, ...updatedData } : u);
    setAllUsers(newList);
    localStorage.setItem('allUsers', JSON.stringify(newList));
    if (currentUser?.id === id) setCurrentUser({ ...currentUser, ...updatedData });
  };

  // --- دالة تغيير اللون (معدلة لتفهم الـ Hash) ---
  const changeColor = (newColor, targetUserId = null) => {
    // نتحقق إذا كان الرابط يحتوي على كلمة user لنميز صفحة الموظف
    const isUserPage = window.location.hash.includes('/user');

    if (userRole === 'admin') {
      if (isUserPage || targetUserId) {
        const idToUpdate = targetUserId || selectedUser?.id;
        if (idToUpdate) updateUser(idToUpdate, { userColor: newColor });
      } else {
        setSystemColor(newColor);
        localStorage.setItem('pageColor', newColor);
        setBgColor(newColor);
        updateUser(currentUser?.id, { userColor: newColor });
      }
    } else {
      updateUser(currentUser?.id, { userColor: newColor });
      setBgColor(newColor);
    }
  };

  // --- تطبيق اللون فوراً عند التنقل ---
  useEffect(() => {
    const applyColor = () => {
      const isUserPage = window.location.hash.includes('/user');
      let colorToApply = systemColor;

      if (userRole === 'admin' && isUserPage && selectedUser) {
        const found = allUsers.find(u => u.id === selectedUser.id);
        colorToApply = found?.userColor || systemColor;
      } else if (currentUser) {
        const found = allUsers.find(u => u.id === currentUser.id);
        colorToApply = found?.userColor || systemColor;
      }

      setBgColor(colorToApply);
      document.body.style.backgroundColor = colorToApply;
    };

    applyColor();
    window.addEventListener('hashchange', applyColor);
    return () => window.removeEventListener('hashchange', applyColor);
  }, [currentUser, allUsers, systemColor, userRole, selectedUser]);

  return (
    <ThemeContext.Provider value={{ 
      bgColor, changeColor, userRole, setUserRole, 
      currentUser, setCurrentUser, allUsers, setAllUsers, 
      updateUser, selectedUser, setSelectedUser, isLoading 
    }}>
      <div style={{ minHeight: '100vh', transition: '0.3s' }}>
        {!isLoading && children} 
      </div>
    </ThemeContext.Provider>
  );
}