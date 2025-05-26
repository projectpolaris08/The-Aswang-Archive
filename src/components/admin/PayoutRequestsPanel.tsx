import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const statusColors = {
  pending: "bg-yellow-600 text-white",
  approved: "bg-blue-600 text-white",
  paid: "bg-green-600 text-white",
  rejected: "bg-red-600 text-white",
};

type StatusType = keyof typeof statusColors;

const PayoutRequestsPanel: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("payout_requests")
      .select("*, profiles:writer_id(username)")
      .order("created_at", { ascending: false });
    if (error) {
      setError("Failed to fetch payout requests.");
      setRequests([]);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: StatusType) => {
    await supabase.from("payout_requests").update({ status }).eq("id", id);
    fetchRequests();
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow p-6 mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Payout Requests</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Request ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Writer Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Method
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Details
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Currency
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Date Requested
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 py-8">
                  Loading payout requests...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center text-red-400 py-8">
                  {error}
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 py-8">
                  No payout requests found.
                </td>
              </tr>
            ) : (
              requests.map((req: any) => (
                <tr
                  key={req.id}
                  className="hover:bg-zinc-700 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-100 text-xs">{req.id}</td>
                  <td className="px-4 py-2 text-gray-100">
                    {req.profiles?.username || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-100">{req.method}</td>
                  <td className="px-4 py-2 text-gray-100">{req.details}</td>
                  <td className="px-4 py-2 text-gray-100">{req.amount}</td>
                  <td className="px-4 py-2 text-gray-100">{req.currency}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        statusColors[req.status as StatusType] ||
                        "bg-gray-600 text-white"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-100 text-xs">
                    {req.created_at
                      ? new Date(req.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(req.id, "approved")}
                          className="px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(req.id, "rejected")}
                          className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {req.status === "approved" && (
                      <button
                        onClick={() => updateStatus(req.id, "paid")}
                        className="px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutRequestsPanel;
