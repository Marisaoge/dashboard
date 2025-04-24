import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="flex flex-col min-h-screen w-full">
          {!isChatPage && <Header />}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout; 