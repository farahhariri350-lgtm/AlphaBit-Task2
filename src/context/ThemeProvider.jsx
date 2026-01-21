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
    setAllUsers(prev => {
      const newList = prev.map(u => u.id === id ? { ...u, ...updatedData } : u);
      localStorage.setItem('allUsers', JSON.stringify(newList));
      return newList;
    });
    if (currentUser?.id === id) setCurrentUser(prev => ({ ...prev, ...updatedData }));
  };

  const changeColor = (newColor, targetUserId = null) => {
    const hash = window.location.hash;
    const isUserPage = hash.includes('/user');

    if (userRole === 'admin') {
      if (isUserPage || targetUserId) {
        // نأخذ الـ ID إما من التارجت أو من السليكتد أو من الرابط نفسه
        const urlId = hash.split('/').pop(); 
        const idToUpdate = targetUserId || selectedUser?.id || urlId;
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

  useEffect(() => {
    const applyColor = () => {
      const hash = window.location.hash;
      const isUserPage = hash.includes('/user');
      let colorToApply = systemColor;

      if (userRole === 'admin' && isUserPage) {
        const urlId = hash.split('/').pop();
        const found = allUsers.find(u => u.id === urlId || u.id === selectedUser?.id);
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
      <div style={{ minHeight: '100vh', transition: '0.3s ease' }}>
        {!isLoading && children} 
      </div>
    </ThemeContext.Provider>
  );
}