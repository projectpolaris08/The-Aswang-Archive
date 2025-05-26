import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Modal from "../common/Modal";

interface WriterEarnings {
  id: string;
  username: string;
  totalEarnings: number;
  paid: number;
  unpaid: number;
  lastPayout: string | null;
  email?: string;
}

const CPM_RATE = 3; // $3 per 1000 views

const EarningsFinancePanel: React.FC = () => {
  const [writers, setWriters] = useState<WriterEarnings[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteTotal, setSiteTotal] = useState(0);
  const [selectedWriter, setSelectedWriter] = useState<WriterEarnings | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchEarnings = async () => {
    setLoading(true);
    // Fetch all writers
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, email")
      .eq("role", "user");
    // Fetch all stories
    const { data: stories } = await supabase
      .from("stories")
      .select("id, user_id, views");
    // Fetch all payouts
    const { data: payouts } = await supabase
      .from("payout_requests")
      .select("id, user_id, amount, status, paid_at");
    // Calculate earnings
    let totalEarnings = 0;
    const writerStats = (profiles || []).map((profile: any) => {
      const userStories = (stories || []).filter(
        (s: any) => s.user_id === profile.id
      );
      const totalViews = userStories.reduce(
        (sum: number, s: any) => sum + (s.views || 0),
        0
      );
      const earnings = (totalViews / 1000) * CPM_RATE;
      totalEarnings += earnings;
      // Paid and unpaid
      const userPayouts = (payouts || []).filter(
        (p: any) => p.user_id === profile.id
      );
      const paid = userPayouts
        .filter((p: any) => p.status === "paid")
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
      const unpaid = earnings - paid;
      const lastPayout =
        userPayouts.length > 0
          ? userPayouts.sort(
              (a: any, b: any) =>
                new Date(b.paid_at || 0).getTime() -
                new Date(a.paid_at || 0).getTime()
            )[0].paid_at
          : null;
      return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        totalEarnings: earnings,
        paid,
        unpaid,
        lastPayout,
      };
    });
    setWriters(writerStats);
    setSiteTotal(totalEarnings);
    setLoading(false);
  };

  useEffect(() => {
    fetchEarnings();
    // eslint-disable-next-line
  }, []);

  const handleMarkAsPaid = async (writer: WriterEarnings) => {
    setActionLoading(true);
    // Create a payout request and mark as paid
    await supabase.from("payout_requests").insert({
      user_id: writer.id,
      amount: writer.unpaid,
      status: "paid",
      paid_at: new Date().toISOString(),
    });
    setFeedback("Marked as paid.");
    fetchEarnings();
    setActionLoading(false);
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow p-6 mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Earnings & Finance</h3>
      {feedback && (
        <div className="mb-4 text-center text-sm text-green-400">
          {feedback}
        </div>
      )}
      <div className="mb-6 p-4 bg-zinc-900 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-lg text-white font-semibold">
          Site-wide Total Earnings:
        </div>
        <div className="text-2xl text-green-400 font-bold">
          ${siteTotal.toFixed(2)}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Writer
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Total Earnings
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Paid
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Unpaid
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Last Payout
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">
                  Loading earnings...
                </td>
              </tr>
            ) : writers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">
                  No writers found.
                </td>
              </tr>
            ) : (
              writers.map((writer) => (
                <tr
                  key={writer.id}
                  className="hover:bg-zinc-700 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-100">{writer.username}</td>
                  <td className="px-4 py-2 text-gray-100">
                    {writer.email || "-"}
                  </td>
                  <td className="px-4 py-2 text-green-400 font-semibold">
                    ${writer.totalEarnings.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-gray-100">
                    ${writer.paid.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-yellow-400 font-semibold">
                    ${writer.unpaid.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-gray-100">
                    {writer.lastPayout
                      ? new Date(writer.lastPayout).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700"
                      onClick={() => handleMarkAsPaid(writer)}
                      disabled={writer.unpaid <= 0 || actionLoading}
                    >
                      Mark as Paid
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                      onClick={() => {
                        setSelectedWriter(writer);
                        setShowModal(true);
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Details Modal */}
      {showModal && selectedWriter && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold mb-2 text-white">
            Writer Earnings Details
          </h2>
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
              <span className="font-semibold">Total Earnings:</span> $
              {selectedWriter.totalEarnings.toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Paid:</span> $
              {selectedWriter.paid.toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Unpaid:</span> $
              {selectedWriter.unpaid.toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Last Payout:</span>{" "}
              {selectedWriter.lastPayout
                ? new Date(selectedWriter.lastPayout).toLocaleDateString()
                : "-"}
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default EarningsFinancePanel;
