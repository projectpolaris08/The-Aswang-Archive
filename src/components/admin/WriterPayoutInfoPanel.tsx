import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const payoutMethods = ["PayPal", "GCash", "Bank"];

const WriterPayoutInfoPanel: React.FC = () => {
  const [writers, setWriters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const fetchWriters = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, method, details, country, updated_at");
    if (error) {
      setError("Failed to fetch writers.");
      setWriters([]);
    } else {
      setWriters(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWriters();
  }, []);

  const handleEdit = (writer: any) => {
    setEditing(writer);
    setEditForm({
      method: writer.method || "",
      details: writer.details || "",
      country: writer.country || "",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from("profiles")
      .update({
        method: editForm.method,
        details: editForm.details,
        country: editForm.country,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editing.id);
    setSaving(false);
    setEditing(null);
    fetchWriters();
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow p-6 mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Writer Payout Info</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Writer ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Payout Method
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Details
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Country
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Last Updated
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
                  Loading writers...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center text-red-400 py-8">
                  {error}
                </td>
              </tr>
            ) : writers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">
                  No writers found.
                </td>
              </tr>
            ) : (
              writers.map((writer: any) => (
                <tr
                  key={writer.id}
                  className="hover:bg-zinc-700 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-100 text-xs">
                    {writer.id}
                  </td>
                  <td className="px-4 py-2 text-gray-100">{writer.username}</td>
                  <td className="px-4 py-2 text-gray-100">
                    {writer.method || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-100">
                    {writer.details || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-100">
                    {writer.country || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-100 text-xs">
                    {writer.updated_at
                      ? new Date(writer.updated_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(writer)}
                      className="px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-zinc-900 rounded-lg p-6 shadow-lg w-full max-w-md">
            <h4 className="text-lg font-bold text-white mb-4">
              Edit Payout Info
            </h4>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Payout Method</label>
              <select
                className="w-full px-3 py-2 rounded bg-zinc-800 text-gray-100"
                value={editForm.method}
                onChange={(e) =>
                  setEditForm({ ...editForm, method: e.target.value })
                }
              >
                <option value="">Select Method</option>
                {payoutMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Details</label>
              <input
                className="w-full px-3 py-2 rounded bg-zinc-800 text-gray-100"
                value={editForm.details}
                onChange={(e) =>
                  setEditForm({ ...editForm, details: e.target.value })
                }
                placeholder="Email, mobile, or account #"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Country</label>
              <input
                className="w-full px-3 py-2 rounded bg-zinc-800 text-gray-100"
                value={editForm.country}
                onChange={(e) =>
                  setEditForm({ ...editForm, country: e.target.value })
                }
                placeholder="Country"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded bg-zinc-700 text-gray-200 hover:bg-gray-600"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WriterPayoutInfoPanel;
