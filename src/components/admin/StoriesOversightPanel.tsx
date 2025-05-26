import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Modal from "../common/Modal";

interface Story {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  status: string;
  views: number;
  featured: boolean;
  region?: string;
  content?: string;
}

interface AuthorMap {
  [id: string]: string;
}

const StoriesOversightPanel: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [authors, setAuthors] = useState<AuthorMap>({});
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Fetch stories and authors
  const fetchStories = async () => {
    setLoading(true);
    const { data: storiesData, error } = await supabase
      .from("stories")
      .select(
        "id, title, user_id, created_at, status, views, featured, region, content"
      )
      .order("created_at", { ascending: false });
    if (error || !storiesData) {
      setStories([]);
      setLoading(false);
      return;
    }
    setStories(storiesData as any);
    // Fetch authors
    const userIds = Array.from(new Set(storiesData.map((s: any) => s.user_id)));
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);
      const authorMap: AuthorMap = {};
      (profiles || []).forEach((p: any) => {
        authorMap[p.id] = p.username;
      });
      setAuthors(authorMap);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
    // eslint-disable-next-line
  }, []);

  // Action handlers
  const handleApprove = async (story: Story) => {
    setActionLoading(true);
    await supabase
      .from("stories")
      .update({ status: "approved" })
      .eq("id", story.id);
    setFeedback("Story approved.");
    fetchStories();
    setActionLoading(false);
    setTimeout(() => setFeedback(null), 2000);
  };
  const handleReject = async (story: Story) => {
    setActionLoading(true);
    await supabase
      .from("stories")
      .update({ status: "rejected" })
      .eq("id", story.id);
    setFeedback("Story rejected.");
    fetchStories();
    setActionLoading(false);
    setTimeout(() => setFeedback(null), 2000);
  };
  const handleFeature = async (story: Story, value: boolean) => {
    setActionLoading(true);
    await supabase
      .from("stories")
      .update({ featured: value })
      .eq("id", story.id);
    setFeedback(value ? "Story featured." : "Story unfeatured.");
    fetchStories();
    setActionLoading(false);
    setTimeout(() => setFeedback(null), 2000);
  };
  const handleDelete = async () => {
    if (!selectedStory) return;
    setActionLoading(true);
    await supabase.from("stories").delete().eq("id", selectedStory.id);
    setShowDeleteModal(false);
    setFeedback("Story deleted.");
    setSelectedStory(null);
    fetchStories();
    setActionLoading(false);
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow p-6 mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">Stories Oversight</h3>
      {feedback && (
        <div className="mb-4 text-center text-sm text-green-400">
          {feedback}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Title
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Author
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Views
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Featured
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">
                  Loading stories...
                </td>
              </tr>
            ) : stories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">
                  No stories found.
                </td>
              </tr>
            ) : (
              stories.map((story) => (
                <tr
                  key={story.id}
                  className="hover:bg-zinc-700 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-100">{story.title}</td>
                  <td className="px-4 py-2 text-gray-100">
                    {authors[story.user_id] || "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-100">
                    {story.created_at
                      ? new Date(story.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-100">{story.status}</td>
                  <td className="px-4 py-2 text-gray-100">{story.views}</td>
                  <td className="px-4 py-2 text-gray-100">
                    {story.featured ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
                      onClick={() => {
                        setSelectedStory(story);
                        setShowViewModal(true);
                      }}
                    >
                      View
                    </button>
                    {story.status !== "approved" && (
                      <button
                        className="px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700"
                        onClick={() => handleApprove(story)}
                        disabled={actionLoading}
                      >
                        Approve
                      </button>
                    )}
                    {story.status !== "rejected" && (
                      <button
                        className="px-2 py-1 rounded bg-yellow-600 text-white text-xs hover:bg-yellow-700"
                        onClick={() => handleReject(story)}
                        disabled={actionLoading}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                      onClick={() => {
                        setSelectedStory(story);
                        setShowDeleteModal(true);
                      }}
                      disabled={actionLoading}
                    >
                      Delete
                    </button>
                    <button
                      className={`px-2 py-1 rounded text-xs ${
                        story.featured
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-purple-600 hover:bg-purple-700"
                      } text-white`}
                      onClick={() => handleFeature(story, !story.featured)}
                      disabled={actionLoading}
                    >
                      {story.featured ? "Unfeature" : "Feature"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* View Modal */}
      {showViewModal && selectedStory && (
        <Modal onClose={() => setShowViewModal(false)}>
          <h2 className="text-xl font-bold mb-2 text-white">Story Details</h2>
          <div className="text-gray-200 mb-2">
            <div>
              <span className="font-semibold">Title:</span>{" "}
              {selectedStory.title}
            </div>
            <div>
              <span className="font-semibold">Author:</span>{" "}
              {authors[selectedStory.user_id] || "-"}
            </div>
            <div>
              <span className="font-semibold">Date:</span>{" "}
              {selectedStory.created_at
                ? new Date(selectedStory.created_at).toLocaleDateString()
                : "-"}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              {selectedStory.status}
            </div>
            <div>
              <span className="font-semibold">Views:</span>{" "}
              {selectedStory.views}
            </div>
            <div>
              <span className="font-semibold">Featured:</span>{" "}
              {selectedStory.featured ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-semibold">Region:</span>{" "}
              {selectedStory.region || "-"}
            </div>
          </div>
          <div className="bg-gray-900 rounded p-4 text-gray-100 max-h-60 overflow-y-auto mb-4">
            <div className="font-semibold mb-2">Content:</div>
            <div style={{ whiteSpace: "pre-line" }}>
              {selectedStory.content || "(No content)"}
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </button>
        </Modal>
      )}
      {/* Delete Modal */}
      {showDeleteModal && selectedStory && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h2 className="text-xl font-bold mb-2 text-white">Confirm Delete</h2>
          <div className="text-gray-200 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedStory.title}</span>?
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
              onClick={() => setShowDeleteModal(false)}
              disabled={actionLoading}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StoriesOversightPanel;
