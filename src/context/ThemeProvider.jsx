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
    if (userRole) localStorage.setItem('userRole', userRole);
    else localStorage.removeItem('userRole');
    
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
    else localStorage.removeItem('currentUser');

    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    setIsLoading(false);
  }, [userRole, currentUser, allUsers]);

  const updateUser = (id, updatedData) => {
    if (!id) return;
    setAllUsers(prev => {
      const newList = prev.map(u => String(u.id) === String(id) ? { ...u, ...updatedData } : u);
      return newList;
    });
    if (String(currentUser?.id) === String(id)) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
    }
  };

  const changeColor = (newColor, targetUserId = null) => {
    const hash = window.location.hash;
   
    const isSpecificUserPage = hash.includes('/admin/user/') || hash.match(/\/user\/\d+/);

    if (userRole === 'admin') {
      if (isSpecificUserPage || targetUserId) {
     
        const urlId = hash.split('/').pop();
        const idToUpdate = targetUserId || urlId;
        if (idToUpdate) updateUser(idToUpdate, { userColor: newColor });
      } else {
     
        setSystemColor(newColor);
        localStorage.setItem('pageColor', newColor);
        setBgColor(newColor);
      }
    } else {
 
      if (currentUser) updateUser(currentUser.id, { userColor: newColor });
      setBgColor(newColor);
    }
  };

  useEffect(() => {
    const applyColor = () => {
      const hash = window.location.hash;
      const isSpecificUserPage = hash.includes('/admin/user/') || (userRole === 'user' && hash.includes('/user'));
      let colorToApply = systemColor;

      if (userRole === 'admin') {
        if (isSpecificUserPage) {
          const urlId = hash.split('/').pop();
          const found = allUsers.find(u => String(u.id) === String(urlId) || String(u.id) === String(selectedUser?.id));
          colorToApply = found?.userColor || systemColor;
        } else {
          colorToApply = systemColor;
        }
      } else if (currentUser) {
        const found = allUsers.find(u => String(u.id) === String(currentUser.id));
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