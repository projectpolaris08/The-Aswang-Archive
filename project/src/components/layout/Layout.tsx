import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Apply dark mode to body element
    if (isDarkMode) {
      document.body.classList.add('bg-gray-900', 'text-gray-100');
    } else {
      document.body.classList.remove('bg-gray-900', 'text-gray-100');
      document.body.classList.add('bg-gray-50', 'text-gray-900');
    }

    return () => {
      document.body.classList.remove('bg-gray-900', 'text-gray-100', 'bg-gray-50', 'text-gray-900');
    };
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : 'light'}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;