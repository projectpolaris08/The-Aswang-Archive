import React, { useState } from "react";

interface SettingsPanelProps {
  user: any;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ user }) => {
  // Demo profile info
  const [profile, setProfile] = useState({
    username: user?.user_metadata?.username || "",
    avatar: user?.user_metadata?.avatar_url || "",
    bio: user?.user_metadata?.bio || "",
    email: user?.email || "",
  });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  // Demo notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    comments: true,
    tips: false,
  });

  // Password change demo
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleEdit = () => {
    setForm(profile);
    setEditing(true);
  };
  const handleSave = () => {
    setProfile(form);
    setEditing(false);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-100 mb-4">Settings</h1>
      {/* Profile Info */}
      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          Profile Info
        </h2>
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Username</label>
              <input
                className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Avatar URL</label>
              <input
                className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder="Paste image URL"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Bio</label>
              <textarea
                className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
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
              <span className="text-gray-300">Username:</span>{" "}
              <span className="text-gray-100 font-semibold">
                {profile.username}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Avatar:</span>
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-zinc-700"
                />
              ) : (
                <span className="text-gray-400">(none)</span>
              )}
            </div>
            <div>
              <span className="text-gray-300">Bio:</span>{" "}
              <span className="text-gray-100 font-semibold">{profile.bio}</span>
            </div>
            <div>
              <span className="text-gray-300">Email:</span>{" "}
              <span className="text-gray-100 font-semibold">
                {profile.email}
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
      {/* Change Password */}
      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          Change Password
        </h2>
        <div className="space-y-4 max-w-md">
          <input
            className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
          <input
            className="w-full px-3 py-2 rounded bg-zinc-900 text-gray-100"
            type={showPassword ? "text" : "password"}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Confirm new password"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((v) => !v)}
              id="showpass"
            />
            <label htmlFor="showpass" className="text-gray-300 text-sm">
              Show password
            </label>
          </div>
          <button
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            onClick={() => alert("Change password not implemented yet.")}
          >
            Change Password
          </button>
        </div>
      </div>
      {/* Notification Preferences */}
      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          Notification Preferences
        </h2>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifPrefs.email}
              onChange={() => setNotifPrefs((p) => ({ ...p, email: !p.email }))}
            />
            <span className="text-gray-300">Email notifications</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifPrefs.comments}
              onChange={() =>
                setNotifPrefs((p) => ({ ...p, comments: !p.comments }))
              }
            />
            <span className="text-gray-300">Comment alerts</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifPrefs.tips}
              onChange={() => setNotifPrefs((p) => ({ ...p, tips: !p.tips }))}
            />
            <span className="text-gray-300">Tips & monetization updates</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
