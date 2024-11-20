import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  Settings,
  Map,
  X 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Map View', icon: Map, path: '/map' },
  { name: 'Users', icon: Users, path: '/users' },
  { name: 'Reports', icon: AlertTriangle, path: '/reports' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          ${isActive 
            ? 'bg-primary-50 text-primary-600' 
            : 'text-gray-600 hover:bg-gray-100'
          }`}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="h-5 w-5" />
        <span className="text-sm font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
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
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;