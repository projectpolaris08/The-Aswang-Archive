import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import SocialButton from "./auth/SocialButton";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!agreePolicy) {
      setError("You must agree to the Privacy Policy to sign in.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Logged in!");
      setTimeout(() => navigate("/"), 1000);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center lg:items-start justify-center bg-gradient-to-br from-black via-gray-900 to-black py-4 px-4 sm:px-6 lg:px-8 lg:pt-24">
      <div className="relative flex items-center justify-center w-full max-w-md">
        {/* Subtle white glowing effect at the edge */}
        <div
          className="absolute -inset-1 rounded-2xl z-0 pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.18)",
            filter: "blur(8px)",
          }}
        ></div>
        {/* Glass card with custom shadow */}
        <div
          className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-white/20 shadow-lg p-8 max-w-md w-full space-y-8 relative z-10"
          style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-800/60 rounded-full p-4 mb-3 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"
                />
              </svg>
            </div>
            <h2 className="text-center text-3xl font-serif font-bold text-gray-100 mb-1">
              Welcome
            </h2>
            <p className="text-center text-base text-gray-400 font-normal mb-2">
              Sign in to your account
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="space-y-3">
              <SocialButton provider="google" onClick={handleGoogleLogin} />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div
                  className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              {success && (
                <div
                  className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{success}</span>
                </div>
              )}
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-gray-100 bg-gray-800/50 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-gray-100 bg-gray-800/50 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign in
                </button>
              </div>
              <div className="flex items-center mt-2">
                <input
                  id="privacy-policy"
                  type="checkbox"
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="privacy-policy"
                  className="ml-2 block text-sm text-gray-400"
                >
                  I agree to the
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-500 underline ml-1"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-medium text-red-500 hover:text-red-400"
                  >
                    Register now
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
