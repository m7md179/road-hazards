import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import MapView from "./pages/MapView";
import Login from "./pages/Login";
import Hazards from "./pages/Hazards";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Create a separate component for protected routes
function ProtectedRoutes() {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/hazards" element={<Hazards />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </MainLayout>
  );
}

// Public routes component
function PublicRoute({ children }) {
  const { loggedIn } = useAuth();
  return loggedIn ? <Navigate to="/dashboard" /> : children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
