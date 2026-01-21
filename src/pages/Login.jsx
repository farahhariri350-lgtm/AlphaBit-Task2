import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
// استخدمها بـ const { ... } = useContext(ThemeContext);
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { setUserRole, setCurrentUser, setAllUsers, allUsers } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAdminLogin = () => {
    setUserRole('admin');
    navigate('/admin');
  };

  const handleLoginOrSignUp = (e) => {
    e.preventDefault();
    
    if (formData.name && formData.email) {
      // 1. البحث عن المستخدم في القائمة الحالية بناءً على الإيميل
      const existingUser = allUsers.find(user => user.email === formData.email);

      if (existingUser) {
        // --- حالة تسجيل الدخول (Login) ---
        // إذا وجدناه، نقوم بتسجيل الدخول فوراً بالبيانات المخزنة سابقاً
        setCurrentUser(existingUser);
        setUserRole('user');
        navigate('/user');
      } else {
        // --- حالة إنشاء حساب جديد (Sign Up) ---
        const newUser = { 
          ...formData, 
          id: Date.now(),
          job: 'Not Assigned',
          salary: 0 
        };
        
        setAllUsers([...allUsers, newUser]);
        setCurrentUser(newUser);
        setUserRole('user');
        navigate('/user');
      }
    } else {
      setError("الرجاء تعبئة جميع الحقول");
    }
  };

 // داخل ملف Login.jsx في قسم الـ return:
const { bgColor } = useContext(ThemeContext);

return (
  <div className="login-container" style={{ backgroundColor: bgColor }}>
    {/* المساطر تظهر تلقائياً من الـ CSS ::before */}
    <div className="login-card">
      <h1>Welcome Back</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleLoginOrSignUp}>
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn-user">
          Continue to System
        </button>
      </form>

      <div style={{ margin: '20px 0', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
        SECURE ADMINISTRATIVE ACCESS
      </div>

      <button onClick={handleAdminLogin} className="btn-admin">
        Login as Admin
      </button>
    </div>
  </div>
);
};

export default Login;