import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [showRequestReset, setShowRequestReset] = useState(false);
  const [requestEmail, setRequestEmail] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    // Check for error in URL hash (e.g., #error=...)
    const hash = window.location.hash;
    if (hash && hash.startsWith("#error=")) {
      const params = new URLSearchParams(hash.substring(1));
      const errorDescription =
        params.get("error_description") || "Invalid or expired link.";
      setError(decodeURIComponent(errorDescription.replace(/\+/g, " ")));
      setTokenChecked(true);
      return;
    }

    // Extract access_token and refresh_token from URL
    const params = new URLSearchParams(window.location.search);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(({ error }) => {
          if (error) setError("Invalid or expired link.");
          setTokenChecked(true);
        });
    } else {
      setError("Invalid or expired link.");
      setTokenChecked(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Password updated! You can now log in with your new password."
      );
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus("");
    setRequestLoading(true);
    await supabase.auth.resetPasswordForEmail(requestEmail, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setRequestLoading(false);
    setRequestStatus("If this email exists, a reset link has been sent.");
  };

  if (!tokenChecked) {
    return <div className="text-white text-center mt-10">Checking link...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-zinc-800 p-8 rounded shadow-md w-full max-w-md mt-10">
          <div className="text-red-500 text-center mb-4">{error}</div>
          {!showRequestReset ? (
            <button
              className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition mb-2"
              onClick={() => setShowRequestReset(true)}
            >
              Request new reset link
            </button>
          ) : (
            <form onSubmit={handleRequestReset}>
              <label className="block text-gray-300 mb-2">
                Enter your email address
              </label>
              <input
                type="email"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                required
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                placeholder="your@email.com"
              />
              <button
                type="submit"
                className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                disabled={requestLoading}
              >
                {requestLoading ? "Sending..." : "Send Reset Email"}
              </button>
              {requestStatus && (
                <div className="mt-4 text-center text-gray-200">
                  {requestStatus}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Reset Password
        </h2>
        {message && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
            {message}
          </div>
        )}
        <label className="block text-gray-300 mb-2">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
        />
        <button
          type="submit"
          className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Set New Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
