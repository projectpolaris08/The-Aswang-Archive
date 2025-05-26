import React, { useState } from "react";
import { Link } from "react-router-dom";

const countryList = [
  "Philippines",
  "United States",
  "Canada",
  "Australia",
  "United Kingdom",
  // Add more as needed
];

const bankList = [
  "BDO Unibank, Inc. (BDO)",
  "Bank of the Philippine Islands (BPI)",
  "Metropolitan Bank & Trust Co. (Metrobank)",
  "Land Bank of the Philippines (LandBank)",
  "Philippine National Bank (PNB)",
  "Security Bank Corporation",
  "China Banking Corporation (Chinabank)",
  "Union Bank of the Philippines (UnionBank)",
  "Rizal Commercial Banking Corporation (RCBC)",
  "EastWest Bank",
  "Asia United Bank Corporation (AUB)",
  "Robinsons Bank Corporation",
  "Philippine Bank of Communications (PBCOM)",
  "Maybank Philippines, Inc.",
  "United Coconut Planters Bank (UCPB)",
  "Tonik Digital Bank",
  "Maya Bank",
  "GoTyme Bank",
  "Overseas Filipino Bank (OFBank)",
  "CIMB Bank Philippines",
  "Sterling Bank of Asia",
  "Development Bank of the Philippines (DBP)",
  "Veterans Bank",
  "Bank of Commerce",
  "Philippine Trust Company (PhilTrust Bank)",
  "CTBC Bank (Philippines)",
  "Bank of China – Manila",
  "HSBC Philippines",
  "Standard Chartered Bank",
  "MUFG Bank Manila Branch",
];

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
  const [form, setForm] = useState({
    ...payout,
    country: "",
    currency: "USD",
    bankName: "",
    accountName: "",
    accountNumber: "",
  });
  const [errors, setErrors] = useState<any>({});

  const handleEdit = () => {
    setForm({
      ...form,
      method: payout.method,
      details: payout.details,
      country: form.country || "",
      currency: form.currency || "USD",
      bankName: form.bankName || "",
      accountName: form.accountName || "",
      accountNumber: form.accountNumber || "",
    });
    setEditing(true);
  };

  const validate = () => {
    const errs: any = {};
    if (!form.method) errs.method = "Payout method is required.";
    if (form.method === "PayPal") {
      if (!form.details) errs.details = "PayPal email is required.";
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.details))
        errs.details = "Invalid email format.";
    }
    if (form.method === "GCash") {
      if (!form.details) errs.details = "GCash number is required.";
      else if (!/^(09\d{9}|\+639\d{9})$/.test(form.details))
        errs.details = "Invalid PH mobile number.";
    }
    if (form.method === "Bank") {
      if (!form.bankName) errs.bankName = "Bank name is required.";
      if (!form.accountName) errs.accountName = "Account name is required.";
      if (!form.accountNumber)
        errs.accountNumber = "Account number is required.";
      else if (!/^\d{8,20}$/.test(form.accountNumber))
        errs.accountNumber = "Invalid account number.";
    }
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setPayout(form);
      setEditing(false);
    }
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
              <label className="block text-gray-300 mb-1">
                Select Your Preferred Payout Method{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                value={form.method}
                onChange={(e) =>
                  setForm({
                    ...form,
                    method: e.target.value,
                    details: "",
                    bankName: "",
                    accountName: "",
                    accountNumber: "",
                  })
                }
                required
              >
                <option value="">Select Method</option>
                <option value="PayPal">PayPal</option>
                <option value="GCash">GCash</option>
                <option value="Bank">Bank Transfer</option>
              </select>
              {errors.method && (
                <div className="text-red-500 text-sm mt-1">{errors.method}</div>
              )}
            </div>
            {form.method === "PayPal" && (
              <div>
                <label className="block text-gray-300 mb-1">
                  PayPal Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                  value={form.details}
                  onChange={(e) =>
                    setForm({ ...form, details: e.target.value })
                  }
                  placeholder="your@email.com"
                  required
                />
                {errors.details && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.details}
                  </div>
                )}
              </div>
            )}
            {form.method === "GCash" && (
              <div>
                <label className="block text-gray-300 mb-1">
                  GCash Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                  value={form.details}
                  onChange={(e) =>
                    setForm({ ...form, details: e.target.value })
                  }
                  placeholder="+639xxxxxxxxx"
                  required
                />
                {errors.details && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.details}
                  </div>
                )}
              </div>
            )}
            {form.method === "Bank" && (
              <>
                <div>
                  <label className="block text-gray-300 mb-1">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                    value={form.bankName}
                    onChange={(e) =>
                      setForm({ ...form, bankName: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Bank</option>
                    {bankList.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  {errors.bankName && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.bankName}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                    value={form.accountName}
                    onChange={(e) =>
                      setForm({ ...form, accountName: e.target.value })
                    }
                    placeholder="Account Name"
                    required
                  />
                  {errors.accountName && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.accountName}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                    value={form.accountNumber}
                    onChange={(e) =>
                      setForm({ ...form, accountNumber: e.target.value })
                    }
                    placeholder="Account Number"
                    required
                  />
                  {errors.accountNumber && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.accountNumber}
                    </div>
                  )}
                </div>
              </>
            )}
            <div>
              <label className="block text-gray-300 mb-1">Country</label>
              <select
                className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              >
                <option value="">Select Country</option>
                {countryList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <input type="hidden" value={form.currency} readOnly />
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded bg-zinc-700 text-gray-200 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 ml-auto md:ml-0"
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
        <div className="flex justify-center">
          <Link
            to="/monetization-guidelines"
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold shadow"
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MonetizePanel;
