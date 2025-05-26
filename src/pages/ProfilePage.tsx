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
  const [gcashNumber, setGcashNumber] = useState("");
  const [mayaNumber, setMayaNumber] = useState("");
  const [gcashQR, setGcashQR] = useState("");
  const [mayaQR, setMayaQR] = useState("");
  const [qrUploading, setQrUploading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        setAvatar(data.user.user_metadata?.avatar_url || null);
        setUsername(data.user.user_metadata?.username || "");
        setNewUsername(data.user.user_metadata?.username || "");
        setRole(data.user.user_metadata?.role || "");
        if (data.user.user_metadata?.last_username_change) {
          setLastUsernameChange(
            new Date(data.user.user_metadata.last_username_change)
          );
        }
        // Fetch GCash/Maya info from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("gcash_number, maya_number, gcash_qr_url, maya_qr_url, role")
          .eq("id", data.user.id)
          .single();
        if (profile) {
          setGcashNumber(profile.gcash_number || "");
          setMayaNumber(profile.maya_number || "");
          setGcashQR(profile.gcash_qr_url || "");
          setMayaQR(profile.maya_qr_url || "");
          setRole(profile.role || role);
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

  const handleQRUpload = async (file: File, type: string) => {
    if (!user) return;
    setQrUploading(true);
    const fileExt = file.name.split(".").pop() || "jpg";
    console.log("Uploading to:", fileExt);
    const { error: uploadError } = await supabase.storage
      .from("qr-codes")
      .upload(fileExt, file, { upsert: true });
    if (uploadError) {
      setError("QR upload failed: " + uploadError.message);
      console.error("QR upload failed:", uploadError, fileExt, file);
      setQrUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("qr-codes")
      .getPublicUrl(fileExt);
    const publicUrl = urlData?.publicUrl;
    console.log("Public URL:", publicUrl);
    if (!publicUrl) {
      setError("Failed to get public URL for QR code.");
      setQrUploading(false);
      return;
    }
    let updateObj = {};
    if (type === "gcash") {
      setGcashQR(publicUrl);
      updateObj = { gcash_qr_url: publicUrl };
    }
    if (type === "maya") {
      setMayaQR(publicUrl);
      updateObj = { maya_qr_url: publicUrl };
    }
    console.log("Updating profile with:", updateObj);
    const { error: profileError } = await supabase
      .from("profiles")
      .update(updateObj)
      .eq("id", user.id);
    if (profileError) {
      setError("Failed to update profile: " + profileError.message);
      console.error("Profile update failed:", profileError, updateObj);
    }
    setQrUploading(false);
  };

  const handleRemoveQR = async (type: string) => {
    if (!user) return;
    // Remove from Supabase Storage (try both extensions)
    await supabase.storage
      .from("qr-codes")
      .remove([`${user.id}_${type}_qr.jpg`]);
    await supabase.storage
      .from("qr-codes")
      .remove([`${user.id}_${type}_qr.png`]);
    // Remove from profile
    let updateObj = {};
    if (type === "gcash") {
      setGcashQR("");
      updateObj = { gcash_qr_url: null };
    }
    if (type === "maya") {
      setMayaQR("");
      updateObj = { maya_qr_url: null };
    }
    await supabase.from("profiles").update(updateObj).eq("id", user.id);
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
    const updateData: any = { avatar_url: avatarToSave, role };
    if (editingUsername && username !== newUsername && canChangeUsername) {
      updateData.username = newUsername;
      updateData.last_username_change = new Date().toISOString();
    }
    // Save GCash/Maya info and role to profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        gcash_number: gcashNumber,
        maya_number: mayaNumber,
        gcash_qr_url: gcashQR,
        maya_qr_url: mayaQR,
        role: role,
      })
      .eq("id", user.id);
    if (profileError) {
      setError(profileError.message);
      return;
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
      // Re-fetch user and profile to update UI/navigation state
      const { data: refreshedUser } = await supabase.auth.getUser();
      if (refreshedUser.user) {
        setUser(refreshedUser.user);
        setRole(refreshedUser.user.user_metadata?.role || role);
      }
      const { data: refreshedProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (refreshedProfile) {
        setRole(refreshedProfile.role || role);
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
                    lastUsernameChange
                      ? (new Date().getTime() - lastUsernameChange.getTime()) /
                          (1000 * 60 * 60 * 24) <
                        60
                      : false
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
          <div>
            <label className="block text-gray-400 mb-2">GCash Number</label>
            <input
              type="text"
              value={gcashNumber}
              onChange={(e) => setGcashNumber(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
              placeholder="09XXXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">GCash QR Code</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0])
                  handleQRUpload(e.target.files[0], "gcash");
              }}
              disabled={qrUploading}
            />
            {gcashQR && (
              <div className="flex items-center gap-2 mt-2">
                <img src={gcashQR} alt="GCash QR" className="w-24 h-24" />
                <button
                  type="button"
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleRemoveQR("gcash")}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Maya Number</label>
            <input
              type="text"
              value={mayaNumber}
              onChange={(e) => setMayaNumber(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
              placeholder="09XXXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Maya QR Code</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0])
                  handleQRUpload(e.target.files[0], "maya");
              }}
              disabled={qrUploading}
            />
            {mayaQR && (
              <div className="flex items-center gap-2 mt-2">
                <img src={mayaQR} alt="Maya QR" className="w-24 h-24" />
                <button
                  type="button"
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleRemoveQR("maya")}
                >
                  Remove
                </button>
              </div>
            )}
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
