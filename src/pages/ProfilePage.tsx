import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AvatarPicker from "../components/AvatarPicker";
import { Pencil, X as XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [lastUsernameChange, setLastUsernameChange] = useState<Date | null>(
    null
  );
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        setAvatar(data.user.user_metadata?.avatar_url || null);
        setUsername(data.user.user_metadata?.username || "");
        setNewUsername(data.user.user_metadata?.username || "");
        if (data.user.user_metadata?.last_username_change) {
          setLastUsernameChange(
            new Date(data.user.user_metadata.last_username_change)
          );
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return "";
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Username change logic
    let canChangeUsername = true;
    if (editingUsername && username !== newUsername) {
      if (lastUsernameChange) {
        const now = new Date();
        const diffDays = Math.floor(
          (now.getTime() - lastUsernameChange.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays < 60) {
          setError(
            `You can only change your username every 60 days. Please try again in ${
              60 - diffDays
            } day(s).`
          );
          return;
        }
      }
    }
    // Update user_metadata
    let avatarToSave = avatar;
    if (avatarToSave && avatarToSave.startsWith("/src/assets/avatars/")) {
      avatarToSave = avatarToSave.replace(
        "/src/assets/avatars/",
        "/assets/avatars/"
      );
    }
    const updateData: any = { avatar_url: avatarToSave };
    if (editingUsername && username !== newUsername && canChangeUsername) {
      updateData.username = newUsername;
      updateData.last_username_change = new Date().toISOString();
    }
    const { error } = await supabase.auth.updateUser({
      data: updateData,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Profile updated!");
      setUsername(newUsername);
      setEditingUsername(false);
      if (updateData.last_username_change) {
        setLastUsernameChange(new Date(updateData.last_username_change));
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-300">Loading profile...</div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-900 rounded-lg p-8 shadow-xl relative">
        {/* Exit button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          onClick={() => navigate("/")}
          title="Exit profile"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-serif font-bold text-gray-100 mb-2 text-center">
          Profile
        </h2>
        <div className="text-center mb-6">
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full mx-auto"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto flex items-center justify-center text-3xl text-white font-bold">
              {username[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="mt-2 text-gray-200 font-semibold flex items-center justify-center gap-2">
            {editingUsername ? (
              <>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-center w-32"
                  maxLength={20}
                  required
                />
                <button
                  type="button"
                  className="text-green-400 font-bold ml-2"
                  onClick={handleSave}
                  title="Save username"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-red-400 font-bold ml-2"
                  onClick={() => {
                    setEditingUsername(false);
                    setNewUsername(username);
                  }}
                  title="Cancel"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{username}</span>
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-red-500"
                  onClick={() => setEditingUsername(true)}
                  title="Edit username"
                  disabled={
                    lastUsernameChange &&
                    (new Date().getTime() - lastUsernameChange.getTime()) /
                      (1000 * 60 * 60 * 24) <
                      60
                  }
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {lastUsernameChange && (
            <div className="text-xs text-gray-400 mt-1">
              Last changed: {lastUsernameChange.toLocaleDateString()}
              <br />
              {(new Date().getTime() - lastUsernameChange.getTime()) /
                (1000 * 60 * 60 * 24) <
                60 && (
                <span>You can change your username again after 60 days.</span>
              )}
            </div>
          )}
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">
              Change your avatar
            </label>
            <AvatarPicker
              value={avatar}
              onChange={setAvatar}
              onUpload={handleAvatarUpload}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
          >
            Save Changes
          </button>
          {success && (
            <div className="text-green-400 text-center">{success}</div>
          )}
          {error && <div className="text-red-400 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
