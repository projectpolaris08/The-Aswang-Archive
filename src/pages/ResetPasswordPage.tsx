import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
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

  if (!tokenChecked) {
    return <div className="text-white text-center mt-10">Checking link...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
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
