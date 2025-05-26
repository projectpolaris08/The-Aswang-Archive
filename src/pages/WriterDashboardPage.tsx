import React, { useState, useEffect } from "react";
import DashboardHome from "../components/DashboardHome.tsx";
import { supabase } from "../supabaseClient";
import AnalyticsPanel from "../components/AnalyticsPanel";
import StoriesPanel from "../components/StoriesPanel";
import CommentsPanel from "../components/CommentsPanel";
import MonetizePanel from "../components/MonetizePanel";
import SettingsPanel from "../components/SettingsPanel";
import {
  Menu,
  X,
  Home,
  BarChart2,
  Book,
  MessageCircle,
  DollarSign,
  Settings,
} from "lucide-react";

const sections = [
  {
    key: "home",
    label: "Home",
    icon: <Home className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: <BarChart2 className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "stories",
    label: "Stories",
    icon: <Book className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "comments",
    label: "Comments",
    icon: <MessageCircle className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "monetize",
    label: "Monetize",
    icon: <DollarSign className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings className="inline mr-2 w-5 h-5" />,
  },
];

const SectionContent: React.FC<{ section: string; user: any }> = ({
  section,
  user,
}) => {
  switch (section) {
    case "home":
      return <DashboardHome user={user} />;
    case "analytics":
      return <AnalyticsPanel user={user} />;
    case "stories":
      return <StoriesPanel user={user} />;
    case "comments":
      return <CommentsPanel user={user} />;
    case "monetize":
      return <MonetizePanel />;
    case "settings":
      return <SettingsPanel user={user} />;
    default:
      return null;
  }
};

const WriterDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (!data.user) {
        setActiveSection("home");
      }
    });
  }, []);

  // Responsive sidebar toggle
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handleSectionClick = (key: string) => {
    setActiveSection(key);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-zinc-900 px-4 py-3 border-b border-zinc-800 sticky top-0 z-30">
        <button
          onClick={handleSidebarToggle}
          className="p-2 rounded hover:bg-zinc-800"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-gray-100" />
          ) : (
            <Menu className="w-6 h-6 text-gray-100" />
          )}
        </button>
        <h2 className="text-lg font-bold text-red-500">Writer Dashboard</h2>
        <div className="w-6 h-6" /> {/* Spacer */}
      </div>
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-zinc-800 p-6 flex flex-col gap-4 border-r border-zinc-700 z-50 transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ minHeight: "100vh" }}
      >
        {/* Logo and App Name */}
        <div className="flex items-center mb-8 space-x-2">
          <img
            src="/white-witch.png"
            alt="The Aswang Archive Logo"
            className="h-8 w-8"
          />
          <span className="font-serif text-lg font-bold text-red-500">
            The Aswang Archive
          </span>
        </div>
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => handleSectionClick(section.key)}
            className={`text-left px-4 py-2 rounded transition-colors font-medium text-gray-200 hover:bg-red-600 hover:text-white mb-1 w-full ${
              activeSection === section.key ? "bg-red-600 text-white" : ""
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </aside>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <main className="flex-1 p-2 md:p-10 w-full max-w-full overflow-x-auto">
        <SectionContent section={activeSection} user={user} />
      </main>
    </div>
  );
};

export default WriterDashboardPage;
