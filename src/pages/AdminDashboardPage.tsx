// Remove unused import React
import { useState } from "react";
import WritersPanel from "../components/admin/WritersPanel";
import PayoutRequestsPanel from "../components/admin/PayoutRequestsPanel";
import WriterPayoutInfoPanel from "../components/admin/WriterPayoutInfoPanel";
import WriterPerformancePanel from "../components/admin/WriterPerformancePanel";
import StoriesOversightPanel from "../components/admin/StoriesOversightPanel";
import EarningsFinancePanel from "../components/admin/EarningsFinancePanel";
import AdminToolsPanel from "../components/admin/AdminToolsPanel";
// Lucide icons
import {
  Users,
  DollarSign,
  Info,
  BarChart2,
  BookOpen,
  PieChart,
  Settings,
  Menu,
  X,
} from "lucide-react";
// import PayoutRequestsPanel from "../components/admin/PayoutRequestsPanel";
// ... import other panels as needed

const sidebarLinks = [
  {
    key: "writers",
    name: "Writers Management",
    icon: <Users className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "payouts",
    name: "Payout Requests",
    icon: <DollarSign className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "payout-info",
    name: "Writer Payout Info",
    icon: <Info className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "performance",
    name: "Writer Performance",
    icon: <BarChart2 className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "stories",
    name: "Stories Oversight",
    icon: <BookOpen className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "finance",
    name: "Earnings & Finance",
    icon: <PieChart className="inline mr-2 w-5 h-5" />,
  },
  {
    key: "tools",
    name: "Admin Tools",
    icon: <Settings className="inline mr-2 w-5 h-5" />,
  },
];

const AdminDashboardPage = () => {
  const [activePanel, setActivePanel] = useState("writers");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Responsive sidebar toggle
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handlePanelClick = (key: string) => {
    setActivePanel(key);
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
        <h2 className="text-lg font-bold text-red-500">Admin Dashboard</h2>
        <div className="w-6 h-6" /> {/* Spacer */}
      </div>
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-zinc-800 p-6 flex flex-col gap-4 border-r border-zinc-700 z-50 transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ minHeight: "100vh" }}
      >
        <h2 className="text-xl font-bold text-white mb-6 hidden md:block">
          Admin Dashboard
        </h2>
        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handlePanelClick(link.key)}
              className={`block px-3 py-2 rounded text-left w-full transition-colors font-medium text-gray-200 hover:bg-zinc-700 hover:text-red-400 ${
                activePanel === link.key ? "bg-red-600 text-white" : ""
              }`}
            >
              {link.icon}
              {link.name}
            </button>
          ))}
        </nav>
      </aside>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <main className="flex-1 p-2 md:p-6 w-full max-w-full overflow-x-auto">
        {activePanel === "writers" && <WritersPanel />}
        {activePanel === "payouts" && <PayoutRequestsPanel />}
        {activePanel === "payout-info" && <WriterPayoutInfoPanel />}
        {activePanel === "performance" && <WriterPerformancePanel />}
        {activePanel === "stories" && <StoriesOversightPanel />}
        {activePanel === "finance" && <EarningsFinancePanel />}
        {activePanel === "tools" && <AdminToolsPanel />}
        {/* Add other panels here as you implement them */}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
