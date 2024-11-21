import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import MapView from './pages/MapView';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route outside MainLayout */}
        <Route path="/login" element={<Login />} />
        
        
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/map" element={<MainLayout><MapView /></MainLayout>} />
        <Route path="/users" element={<MainLayout><Users /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;