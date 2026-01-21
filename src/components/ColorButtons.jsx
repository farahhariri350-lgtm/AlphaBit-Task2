// src/components/ColorButtons.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
// استخدمها بـ const { ... } = useContext(ThemeContext);

const ColorButtons = () => {
  const { changeColor, currentUser, selectedUser, userRole } = useContext(ThemeContext);
  
  // تحديد من هو المستخدم الذي سنغير لونه الآن
  // إذا كان الأدمن فاتح صفحة موظف، التغيير يروح للموظف. وإلا يروح لليوزر الحالي.
  const targetUser = (userRole === 'admin' && selectedUser) ? selectedUser : currentUser;

  const colors = [
    { name: 'Dark', hex: '#111827' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Purple', hex: '#6b21a8' }
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '10px' }}>
      {colors.map((color) => (
        <button 
          key={color.name} 
          // نمرر id المستخدم المستهدف للدالة
          onClick={() => changeColor(color.hex, targetUser?.id)}
          style={{ 
            width: '25px', height: '25px', borderRadius: '50%',
            backgroundColor: color.hex, cursor: 'pointer',
            border: '2px solid rgba(255,255,255,0.2)', transition: '0.3s'
          }}
        />
      ))}
    </div>
  );
};

export default ColorButtons;