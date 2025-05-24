import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import SocialButton from "./auth/SocialButton";
import AvatarPicker from "./AvatarPicker";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const navigate = useNavigate();

  const handleAvatarUpload = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${username}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) {
      setError("Avatar upload failed.");
      return "";
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!agreePolicy) {
      setError("You must agree to the Privacy Policy to register.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, avatar_url: avatar },
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Check your email to confirm your registration!");
      setUsername("");
      setEmail("");
      setPassword("");
      setAvatar(null);
    }
  };

  const handleGoogleLogin = async () => {
    setShowGoogleModal(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
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
          <div>
            <h2 className="mt-6 text-center text-3xl font-serif font-bold text-gray-100">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Join our community of folklore enthusiasts
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
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-gray-100 bg-gray-800/50 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-gray-100 bg-gray-800/50 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
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
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-gray-100 bg-gray-800/50 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-gray-400 mb-2">
                  Choose an avatar
                </label>
                <AvatarPicker
                  value={avatar}
                  onChange={setAvatar}
                  onUpload={handleAvatarUpload}
                />
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

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Create Account
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-medium text-red-500 hover:text-red-400"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showGoogleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg text-center">
            <h3 className="text-lg font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-300 mb-2">
              This feature is currently in development.
            </p>
            <p className="text-gray-400 mb-4">
              Kindly complete the registration by filling out the form below.
            </p>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={() => setShowGoogleModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
