import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Settings,
  Map,
  Flag,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Map View", icon: Map, path: "/map" },
  { name: "Hazards", icon: AlertTriangle, path: "/hazards" },
  { name: "Reports", icon: Flag, path: "/reports" },
  { name: "Users", icon: Users, path: "/users" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out z-30
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <h1 className="text-xl font-semibold text-gray-800">Road Hazard</h1>
          <button
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`${
                location.pathname === item.path
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-700 hover:bg-gray-50"
              } group flex items-center px-4 py-2 text-sm font-medium rounded-md`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon
                className={`${
                  location.pathname === item.path
                    ? "text-primary-600"
                    : "text-gray-400"
                } mr-3 h-5 w-5`}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
