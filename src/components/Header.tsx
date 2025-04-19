import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, Settings, LogOut } from 'lucide-react';

interface HeaderProps {}

interface Organization {
  id: string;
  name: string;
  initials: string;
}

const Header: React.FC<HeaderProps> = () => {
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const organizations: Organization[] = [
    { id: '1', name: 'Endeavor Health', initials: 'EH' },
    { id: '2', name: 'NorthShore', initials: 'NS' },
    { id: '3', name: 'Rush Medical', initials: 'RM' }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setShowOrgDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderDropdownContent = () => (
    <>
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="text-sm font-medium">Marisa Oge</div>
        <div className="text-sm text-gray-500">marisa@example.com</div>
      </div>
      <div className="py-2">
        <div className="px-4 py-1 text-xs font-medium text-gray-500 uppercase">Organizations</div>
        {organizations.map(org => (
          <button
            key={org.id}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
          >
            <div>
              <span>{org.name}</span>
              <span className="text-gray-500 ml-1">({org.initials})</span>
            </div>
            {org.initials === 'EH' && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Current</span>
            )}
          </button>
        ))}
      </div>
      <div className="border-t border-gray-200 py-1">
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-xs ml-12 lg:ml-0">
          <input
            type="text"
            placeholder="Search Patients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/points"
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200"
          >
            283 pts
          </Link>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <div className="relative" ref={orgDropdownRef}>
            <button
              onClick={() => {
                setShowOrgDropdown(!showOrgDropdown);
                setShowProfileDropdown(false);
              }}
              className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg"
            >
              <span className="hidden sm:inline font-medium">Marisa</span>
              <span className="text-gray-500">(EH)</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showOrgDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {renderDropdownContent()}
              </div>
            )}
          </div>
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowOrgDropdown(false);
              }}
              className="hover:ring-2 hover:ring-gray-200 rounded-full"
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {renderDropdownContent()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;