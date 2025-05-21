import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface Story {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AdminPanelProps {
  user?: any;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user }) => {
  if (!user?.user_metadata?.is_admin) {
    return (
      <div className="text-red-500 text-center mt-8">
        Access denied. Admins only.
      </div>
    );
  }

  const [pendingStories, setPendingStories] = useState<Story[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"stories" | "users">("stories");

  useEffect(() => {
    fetchPendingStories();
    fetchUsers();
  }, []);

  const fetchPendingStories = async () => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPendingStories(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsers([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStoryAction = async (
    storyId: string,
    action: "approve" | "reject"
  ) => {
    try {
      fetchPendingStories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("stories")}
              className={`${
                activeTab === "stories"
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-gray-400 hover:text-red-400 hover:border-red-400"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Stories
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`${
                activeTab === "users"
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-gray-400 hover:text-red-400 hover:border-red-400"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              User Management
            </button>
          </nav>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {activeTab === "stories" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Pending Stories</h2>
          {pendingStories.length === 0 ? (
            <div className="text-gray-400">No pending stories.</div>
          ) : (
            <ul className="space-y-4">
              {pendingStories.map((story: any) => (
                <li key={story.id} className="bg-gray-800 p-4 rounded shadow">
                  <h3 className="text-lg font-bold text-red-400">
                    {story.title}
                  </h3>
                  <p className="text-gray-200">{story.content}</p>
                  {story.image_url && (
                    <img
                      src={story.image_url}
                      alt="Story"
                      className="mt-2 max-h-48 rounded"
                    />
                  )}
                  <div className="flex space-x-2 mt-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      // onClick={...}
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      // onClick={...}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          {/* Placeholder: Render users here */}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
