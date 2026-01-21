import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export default function ThemeProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  // 1. تحميل البيانات من LocalStorage
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

  // دالة تحديث بيانات أي مستخدم (بدون تعقيد)
  const updateUser = (id, updatedData) => {
    if (!id) return;
    const newList = allUsers.map(u => u.id === id ? { ...u, ...updatedData } : u);
    setAllUsers(newList);
    localStorage.setItem('allUsers', JSON.stringify(newList));
    
    if (currentUser?.id === id) {
      const updatedCurrent = { ...currentUser, ...updatedData };
      setCurrentUser(updatedCurrent);
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrent));
    }
  };

  // --- دالة تغيير اللون (بسيطة ومباشرة) ---
  const changeColor = (newColor, targetUserId = null) => {
    // إذا مررنا ID مستخدم معين (يعني الأدمن عم يغير لون يوزر)
    if (targetUserId) {
      updateUser(targetUserId, { userColor: newColor });
    } 
    // إذا ما في ID، يعني الشخص عم يغير لونه هو (سواء أدمن أو يوزر)
    else if (currentUser) {
      updateUser(currentUser.id, { userColor: newColor });
      // إذا كان أدمن، منحدث لون النظام العام كمان
      if (userRole === 'admin') {
        setSystemColor(newColor);
        localStorage.setItem('pageColor', newColor);
      }
      setBgColor(newColor);
    }
  };

  // --- تطبيق اللون المعتمد على المستخدم الحالي ---
  useEffect(() => {
    if (currentUser) {
      const userInList = allUsers.find(u => u.id === currentUser.id);
      const color = userInList?.userColor || systemColor;
      setBgColor(color);
      document.body.style.backgroundColor = color;
    }
  }, [currentUser, allUsers, systemColor]);

  return (
    <ThemeContext.Provider value={{ 
      bgColor, changeColor, userRole, setUserRole, 
      currentUser, setCurrentUser, allUsers, setAllUsers, 
      updateUser, selectedUser, setSelectedUser, isLoading 
    }}>
      <div style={{ minHeight: '100vh', backgroundColor: bgColor, transition: '0.3s' }}>
        {!isLoading && children} 
      </div>
    </ThemeContext.Provider>
  );
}