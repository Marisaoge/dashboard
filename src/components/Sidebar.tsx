import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Calendar, 
  Package, 
  FileText, 
  Users, 
  BarChart,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', notification: 0 },
    { icon: MessageSquare, label: 'Chat', path: '/chat/mary', notification: 4 },
    { icon: Calendar, label: 'Calendar', path: '/calendar', notification: 0 },
    { icon: Package, label: 'Motiv Kits', path: '/kits', notification: 0 },
    { icon: FileText, label: 'Forms', path: '/forms', notification: 0 },
    { icon: Users, label: 'Outreach', path: '/outreach', notification: 0 },
    { icon: BarChart, label: 'Reports', path: '/reports', notification: 0 }
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1E2533] text-white rounded-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <div className={`
        fixed top-0 bottom-0 left-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        w-64 bg-[#1E2533] text-white flex flex-col z-40
        overflow-y-auto
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Motiv</h1>
        </div>
        
        <nav className="flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center w-full px-6 py-3 text-sm ${
                location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
              {item.notification > 0 && (
                <span className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {item.notification}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;