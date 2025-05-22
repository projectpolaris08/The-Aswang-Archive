import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  user?: { username: string; role: string } | null;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Always use dark mode for Bolt-style UI
    document.body.classList.add("bg-black");
    document.body.classList.add("text-gray-100");

    return () => {
      document.body.classList.remove("bg-black", "text-gray-100");
    };
  }, []);

  // We're keeping the toggle functionality in case you want it,
  // but for Bolt style, we'll default to dark theme
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
        onLogout={onLogout}
      />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
