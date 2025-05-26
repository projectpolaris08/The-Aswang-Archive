import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import Modal from "../common/Modal";

const AdminToolsPanel: React.FC = () => {
  // Export Data
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  // Promote/Demote
  const [userEmail, setUserEmail] = useState("");
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [promoteAction, setPromoteAction] = useState<"promote" | "demote">("promote");
  // Maintenance Mode
  const [maintenance, setMaintenance] = useState(false);
  // Announcement
  const [announcement, setAnnouncement] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  // Export helpers
  const exportTable = async (table: string) => {
    setExporting(true);
    const { data, error } = await supabase.from(table).select("*");
    if (error || !data) {
      setFeedback(`Failed to export ${table}.`);
      setExporting(false);
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    // Convert to CSV
    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map((row: any) => Object.values(row).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${table}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setFeedback(`Exported ${table} as CSV.`);
    setExporting(false);
    setTimeout(() => setFeedback(null), 2000);
  };

  // Promote/Demote helpers
  const handlePromoteDemote = async () => {
    setPromoteLoading(true);
    // Find user by email
    const { data: profiles } = await supabase.from("profiles").select("id, email, role").eq("email", userEmail);
    if (!profiles || profiles.length === 0) {
      setFeedback("User not found.");
      setPromoteLoading(false);
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    const user = profiles[0];
    const newRole = promoteAction === "promote" ? "admin" : "user";
    await supabase.from("profiles").update({ role: newRole }).eq("id", user.id);
    setFeedback(`User ${promoteAction === "promote" ? "promoted to admin" : "demoted to user"}.`);
    setPromoteLoading(false);
    setTimeout(() => setFeedback(null), 2000);
  };

  // Maintenance mode toggle (UI only)
  const handleToggleMaintenance = () => {
    setMaintenance((m) => !m);
    setFeedback(maintenance ? "Maintenance mode disabled." : "Maintenance mode enabled.");
    setTimeout(() => setFeedback(null), 2000);
  };

  // Announcement (UI only)
  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
    setModalContent(
      <div>
        <h2 className="text-xl font-bold mb-2 text-white">Announcement Preview</h2>
        <div className="text-gray-200 mb-4 whitespace-pre-line">{announcement}</div>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            onClick={() => {
              setShowModal(false);
              setFeedback("Announcement sent! (UI only)");
              setAnnouncement("");
              setTimeout(() => setFeedback(null), 2000);
            }}
          >
            Confirm Send
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow p-6 mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Admin Tools</h3>
      {feedback && (
        <div className="mb-4 text-center text-sm text-green-400">{feedback}</div>
      )}
      {/* Export Data */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-white mb-2">Export Data</h4>
        <div className="flex flex-wrap gap-4">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            onClick={() => exportTable("profiles")}
            disabled={exporting}
          >
            Export Users
          </button>
          <button
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
            onClick={() => exportTable("stories")}
            disabled={exporting}
          >
            Export Stories
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            onClick={() => exportTable("payout_requests")}
            disabled={exporting}
          >
            Export Payouts
          </button>
        </div>
      </div>
      {/* Promote/Demote User */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-white mb-2">Promote/Demote User</h4>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <input
            type="email"
            placeholder="User email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={promoteAction}
            onChange={(e) => setPromoteAction(e.target.value as any)}
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="promote">Promote to Admin</option>
            <option value="demote">Demote to User</option>
          </select>
          <button
            className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50"
            onClick={handlePromoteDemote}
            disabled={promoteLoading || !userEmail}
          >
            {promoteAction === "promote" ? "Promote" : "Demote"}
          </button>
        </div>
      </div>
      {/* Maintenance Mode */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-white mb-2">Maintenance Mode</h4>
        <button
          className={`px-4 py-2 rounded ${maintenance ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"} text-white`}
          onClick={handleToggleMaintenance}
        >
          {maintenance ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
        </button>
        <span className={`ml-4 text-sm font-semibold ${maintenance ? "text-red-400" : "text-green-400"}`}>
          {maintenance ? "Maintenance mode is ON" : "Maintenance mode is OFF"}
        </span>
      </div>
      {/* Announcement */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-white mb-2">Send Announcement</h4>
        <form onSubmit={handleSendAnnouncement} className="flex flex-col gap-2">
          <textarea
            placeholder="Type your announcement here..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={!announcement}
          >
            Preview & Send
          </button>
        </form>
      </div>
      {/* Modal for Announcement Preview or other confirmations */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{modalContent}</Modal>
      )}
    </div>
  );
};

export default AdminToolsPanel; 