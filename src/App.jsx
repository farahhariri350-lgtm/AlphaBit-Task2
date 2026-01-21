import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import ThemeProvider from './context/ThemeProvider'; 
import { ThemeContext } from './context/ThemeContext'; 
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import Login from './pages/Login';

function AppContent() {
  const { userRole, isLoading } = useContext(ThemeContext);

  if (isLoading) return <div style={{ background: '#111827', height: '100vh' }}></div>;

  return (
    <Routes>
      <Route path="/login" element={!userRole ? <Login /> : <Navigate to={userRole === 'admin' ? "/admin" : "/user"} replace />} />
      
      {/* الأدمن - إضافة مسار فرعي لليوزر لتمكين الأدمن من التحكم بلون المستخدم */}
      <Route path="/admin" element={userRole === 'admin' ? <AdminLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<AdminPage />} />
        <Route path="user/:id" element={<UserPage />} /> 
      </Route>

      {/* اليوزر العادي */}
      <Route path="/user" element={userRole === 'user' ? <UserLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<UserPage />} />
        <Route path=":id" element={<UserPage />} /> 
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;