import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent! Please check your inbox.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Forgot Password
        </h2>
        {message && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <label className="block text-gray-300 mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
        />
        <button
          type="submit"
          className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
