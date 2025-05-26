import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Modal from "../common/Modal";

const CPM_RATE = 3; // $3 per 1000 views (placeholder)

const WritersPanel: React.FC = () => {
  const [writers, setWriters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWriter, setSelectedWriter] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banLoading, setBanLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchWriters = async () => {
    setLoading(true);
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, email, created_at, role")
      .eq("role", "user");
    if (error || !profiles) {
      setWriters([]);
      setLoading(false);
      return;
    }
    const { data: stories } = await supabase
      .from("stories")
      .select("id, user_id, views");
    const writerStats = profiles.map((profile) => {
      const userStories = (stories || []).filter(
        (s) => s.user_id === profile.id
      );
      const storyCount = userStories.length;
      const totalViews = userStories.reduce(
        (sum, s) => sum + (s.views || 0),
        0
      );
      const earnings = ((totalViews / 1000) * CPM_RATE).toFixed(2);
      return {
        ...profile,
        storyCount,
        totalViews,
        earnings,
      };
    });
    setWriters(writerStats);
    setLoading(false);
  };

  useEffect(() => {
    fetchWriters();
    // eslint-disable-next-line
  }, []);

  const handleBan = async () => {
    if (!selectedWriter) return;
    setBanLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ role: "banned" })
      .eq("id", selectedWriter.id);
    setBanLoading(false);
    setShowBanModal(false);
    setSelectedWriter(null);
    if (!error) {
      setFeedback("Writer has been banned.");
      fetchWriters();
    } else {
      setFeedback("Failed to ban writer.");
    }
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow p-6 mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Writers Management</h3>
      {feedback && (
        <div className="mb-4 text-center text-sm text-green-400">
          {feedback}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Username
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Join Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                # Stories
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Total Views
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Earnings
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-8">
                  Loading writers...
                </td>
              </tr>
            ) : writers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-8">
                  No writers found.
                </td>
              </tr>
            ) : (
              writers.map((writer: any) => (
                <tr
                  key={writer.id}
                  className="hover:bg-zinc-700 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-100">{writer.username}</td>
                  <td className="px-4 py-2 text-gray-100">
                    {writer.email || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-100">
                    {writer.created_at
                      ? new Date(writer.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-100">
                    {writer.storyCount}
                  </td>
                  <td className="px-4 py-2 text-gray-100">
                    {writer.totalViews}
                  </td>
                  <td className="px-4 py-2 text-gray-100">
                    ${writer.earnings}
                  </td>
                  <td className="px-4 py-2 text-gray-100">{writer.role}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                      onClick={() => {
                        setSelectedWriter(writer);
                        setShowViewModal(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                      onClick={() => {
                        setSelectedWriter(writer);
                        setShowBanModal(true);
                      }}
                      disabled={writer.role === "banned"}
                    >
                      Ban
                    </button>
                    {writer.email ? (
                      <a
                        href={`mailto:${writer.email}`}
                        className="px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Email
                      </a>
                    ) : (
                      <button
                        className="px-2 py-1 rounded bg-green-600 text-white text-xs opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Email
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* View Modal */}
      {showViewModal && selectedWriter && (
        <Modal onClose={() => setShowViewModal(false)}>
          <h2 className="text-xl font-bold mb-2 text-white">Writer Details</h2>
          <div className="text-gray-200 mb-2">
            <div>
              <span className="font-semibold">Username:</span>{" "}
              {selectedWriter.username}
            </div>
            <div>
              <span className="font-semibold">Email:</span>{" "}
              {selectedWriter.email || "-"}
            </div>
            <div>
              <span className="font-semibold">Join Date:</span>{" "}
              {selectedWriter.created_at
                ? new Date(selectedWriter.created_at).toLocaleDateString()
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              {selectedWriter.role}
            </div>
            <div>
              <span className="font-semibold"># Stories:</span>{" "}
              {selectedWriter.storyCount}
            </div>
            <div>
              <span className="font-semibold">Total Views:</span>{" "}
              {selectedWriter.totalViews}
            </div>
            <div>
              <span className="font-semibold">Earnings:</span> $
              {selectedWriter.earnings}
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </button>
        </Modal>
      )}
      {/* Ban Modal */}
      {showBanModal && selectedWriter && (
        <Modal onClose={() => setShowBanModal(false)}>
          <h2 className="text-xl font-bold mb-2 text-white">Confirm Ban</h2>
          <div className="text-gray-200 mb-4">
            Are you sure you want to ban{" "}
            <span className="font-semibold">{selectedWriter.username}</span>?
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={handleBan}
              disabled={banLoading}
            >
              {banLoading ? "Banning..." : "Ban"}
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
              onClick={() => setShowBanModal(false)}
              disabled={banLoading}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WritersPanel;
