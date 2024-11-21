import { Menu, Bell, Search, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

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

            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              <LogIn className="h-5 w-5" />
              <span className="hidden md:block">Login</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;