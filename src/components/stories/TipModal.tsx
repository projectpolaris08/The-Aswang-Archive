import React, { useState } from "react";

interface TipModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number, message: string) => void;
  loading: boolean;
  error: string | null;
}

const TipModal: React.FC<TipModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
}) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (numericAmount > 0) {
      onSubmit(numericAmount, message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Tip the Writer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Amount (₱)</label>
            <input
              type="number"
              min="1"
              step="1"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">
              Message (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              disabled={loading || Number(amount) <= 0}
            >
              {loading ? "Sending..." : "Send Tip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipModal;
