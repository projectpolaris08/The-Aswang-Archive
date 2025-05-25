import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface DashboardHomeProps {
  user: any;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ user }) => {
  const username = user?.user_metadata?.username || "Writer";
  const avatarUrl = user?.user_metadata?.avatar_url;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("stories")
      .select("status", { count: "exact" })
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (error) return setLoading(false);
        const total = data?.length || 0;
        const published =
          data?.filter((s: any) => s.status === "published").length || 0;
        const pending =
          data?.filter((s: any) => s.status === "pending").length || 0;
        const rejected =
          data?.filter((s: any) => s.status === "rejected").length || 0;
        setStats({ total, published, pending, rejected });
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex items-center space-x-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-16 h-16 rounded-full border-2 border-gray-700"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold">
            {username[0]?.toUpperCase() || <span>👤</span>}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1">
            Welcome, {username}!
          </h1>
          <p className="text-gray-400">
            Here's a quick overview of your writing activity.
          </p>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-zinc-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-500">
            {loading ? "..." : stats.total}
          </div>
          <div className="text-gray-300 mt-2">Total Stories</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-500">
            {loading ? "..." : stats.published}
          </div>
          <div className="text-gray-300 mt-2">Published</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-500">
            {loading ? "..." : stats.pending}
          </div>
          <div className="text-gray-300 mt-2">Pending</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-500">
            {loading ? "..." : stats.rejected}
          </div>
          <div className="text-gray-300 mt-2">Rejected</div>
        </div>
      </div>
      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Recent Activity
        </h2>
        <div className="bg-zinc-800 rounded-lg p-6 text-gray-400">
          <div>No recent activity yet.</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
