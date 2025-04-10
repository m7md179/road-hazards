import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import MapView from './pages/MapView';
import Login from './pages/Login';

// Mock auth context - in a real app, this would be a proper context
import { AuthProvider } from './context/AuthContext';

function App() {
  // Auto-login in development mode
  const [loggedIn, setLoggedIn] = useState(true);
  const [user] = useState({
    id: 'mock-admin-id',
    name: 'Admin User',
    email: 'admin@example.com',
    is_admin: true
  });

  return (
    <AuthProvider value={{ user, loggedIn, setLoggedIn }}>
      <Router>
        <Routes>
          {/* Login route outside MainLayout */}
          <Route 
            path="/login" 
            element={loggedIn ? <Navigate to="/dashboard" /> : <Login />} 
          />
          
          {/* Protected routes */}
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/map" element={<MainLayout><MapView /></MainLayout>} />
          <Route path="/users" element={<MainLayout><Users /></MainLayout>} />
          <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;