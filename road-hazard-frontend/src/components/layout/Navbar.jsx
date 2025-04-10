import { Menu, Bell, Search, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>
           
            {/* Search Bar */}
            <div className="hidden md:block ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <span className="hidden md:block font-medium">{user?.name || 'Admin'}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.name || 'Admin'}</p>
                    <p className="text-gray-500">{user?.email || 'admin@example.com'}</p>
                  </div>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;