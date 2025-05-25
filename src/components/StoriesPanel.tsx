import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

interface StoriesPanelProps {
  user: any;
}

const statusOptions = [
  { key: "all", label: "All" },
  { key: "approved", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "pending", label: "Pending" },
  { key: "rejected", label: "Rejected" },
];

const StoriesPanel: React.FC<StoriesPanelProps> = ({ user }) => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("stories")
      .select("id, title, status, created_at, views, upvotes")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setStories(data);
        setLoading(false);
      });
  }, [user]);

  const filteredStories =
    filter === "all" ? stories : stories.filter((s) => s.status === filter);

  // Action handlers (stubs)
  const handleView = (id: string) => {
    window.open(`/stories/${id}`, "_blank");
  };
  const handleEdit = (id: string) => {
    window.location.href = `/submit?id=${id}`;
  };
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setConfirmingDelete(true);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await supabase.from("stories").delete().eq("id", deleteId);
    setStories((prev) => prev.filter((s) => s.id !== deleteId));
    setConfirmingDelete(false);
    setDeleteId(null);
    setLoading(false);
  };
  const handleResubmit = async (id: string) => {
    setLoading(true);
    await supabase.from("stories").update({ status: "pending" }).eq("id", id);
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "pending" } : s))
    );
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-100">Your Stories</h1>
        <Link
          to="/submit"
          className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
        >
          + Create New Story
        </Link>
      </div>
      <div className="flex space-x-2 mb-4">
        {statusOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 ${
              filter === opt.key
                ? "bg-red-600 text-white"
                : "bg-zinc-700 text-gray-200 hover:bg-red-700 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-800 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-300">Title</th>
              <th className="px-4 py-2 text-left text-gray-300">Status</th>
              <th className="px-4 py-2 text-left text-gray-300">Created</th>
              <th className="px-4 py-2 text-left text-gray-300">Views</th>
              <th className="px-4 py-2 text-left text-gray-300">Upvotes</th>
              <th className="px-4 py-2 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : filteredStories.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No stories found.
                </td>
              </tr>
            ) : (
              filteredStories.map((story) => (
                <tr key={story.id} className="border-b border-zinc-700">
                  <td
                    className="px-4 py-2 text-gray-100 font-medium truncate max-w-xs"
                    title={story.title}
                  >
                    {story.title}
                  </td>
                  <td className="px-4 py-2 text-gray-200 capitalize">
                    {story.status}
                  </td>
                  <td className="px-4 py-2 text-gray-400">
                    {new Date(story.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-200">{story.views}</td>
                  <td className="px-4 py-2 text-gray-200">{story.upvotes}</td>
                  <td className="px-4 py-2 text-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(story.id)}
                        className="px-2 py-1 rounded bg-zinc-700 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold transition-colors"
                        title="View Story"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(story.id)}
                        disabled={
                          !(
                            story.status === "draft" ||
                            story.status === "pending" ||
                            story.status === "rejected"
                          )
                        }
                        className={`px-2 py-1 rounded bg-zinc-700 text-yellow-300 text-xs font-semibold transition-colors hover:bg-yellow-600 hover:text-white ${
                          story.status === "draft" ||
                          story.status === "pending" ||
                          story.status === "rejected"
                            ? ""
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        title="Edit Story"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(story.id)}
                        className="px-2 py-1 rounded bg-zinc-700 text-red-400 text-xs font-semibold transition-colors hover:bg-red-600 hover:text-white"
                        title="Delete Story"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleResubmit(story.id)}
                        disabled={story.status !== "rejected"}
                        className={`px-2 py-1 rounded bg-zinc-700 text-green-400 text-xs font-semibold transition-colors hover:bg-green-600 hover:text-white ${
                          story.status === "rejected"
                            ? ""
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        title="Resubmit Story"
                      >
                        Resubmit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Delete confirmation dialog */}
      {confirmingDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-zinc-900 rounded-lg p-8 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold text-red-500 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-200 mb-6">
              Are you sure you want to delete this story? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="px-4 py-2 rounded bg-zinc-700 text-gray-200 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPanel;
