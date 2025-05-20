import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart3,
  Map,
  Users,
  Flag,
  AlertTriangle,
  Settings,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Map View", href: "/map", icon: Map },
  { name: "Hazards", href: "/hazards", icon: AlertTriangle },
  { name: "Reports", href: "/reports", icon: Flag },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationWithActive = navigation.map((item) => ({
    ...item,
    current: location.pathname === item.href,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        navigation={navigationWithActive}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
