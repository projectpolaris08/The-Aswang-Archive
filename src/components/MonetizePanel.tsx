import React, { useState } from "react";

const MonetizePanel: React.FC = () => {
  // Demo earnings data
  const [earnings] = useState({
    total: 0.0,
    pending: 0.0,
    paid: 0.0,
    currency: "USD",
  });
  // Demo payout info
  const [payout, setPayout] = useState({
    method: "PayPal",
    details: "your@email.com",
  });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(payout);

  const handleEdit = () => {
    setForm(payout);
    setEditing(true);
  };
  const handleSave = () => {
    setPayout(form);
    setEditing(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-4">
        Monetization & Earnings
      </h1>
      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-400">
            {earnings.currency} {earnings.total.toFixed(2)}
          </div>
          <div className="text-gray-300 mt-2">Total Earnings</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400">
            {earnings.currency} {earnings.pending.toFixed(2)}
          </div>
          <div className="text-gray-300 mt-2">Pending</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-400">
            {earnings.currency} {earnings.paid.toFixed(2)}
          </div>
          <div className="text-gray-300 mt-2">Paid Out</div>
        </div>
      </div>
      {/* Payout Info */}
      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          Payout Information
        </h2>
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Method</label>
              <select
                className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                <option value="PayPal">PayPal</option>
                <option value="GCash">GCash</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Details</label>
              <input
                className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Account email or number"
              />
            </div>
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded bg-zinc-700 text-gray-200 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-2 md:space-y-0">
            <div>
              <span className="text-gray-300">Method:</span>{" "}
              <span className="text-gray-100 font-semibold">
                {payout.method}
              </span>
            </div>
            <div>
              <span className="text-gray-300">Details:</span>{" "}
              <span className="text-gray-100 font-semibold">
                {payout.details}
              </span>
            </div>
            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ml-auto md:ml-0"
            >
              Edit
            </button>
          </div>
        )}
      </div>
      {/* Monetization Tips */}
      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          How to Earn
        </h2>
        <ul className="list-disc pl-6 text-gray-300 space-y-1">
          <li>Monetization for story views coming soon.</li>
          <li>Receive tips directly from readers (coming soon!).</li>
          <li>Get paid out via PayPal, GCash, or bank transfer.</li>
        </ul>
      </div>
    </div>
  );
};

export default MonetizePanel;
