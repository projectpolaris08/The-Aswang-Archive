import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface CommentsPanelProps {
  user: any;
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({ user }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyContent, setReplyContent] = React.useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Fetch all comments for the user's stories
    (async () => {
      // 1. Get all story IDs for this user
      const { data: stories } = await supabase
        .from("stories")
        .select("id, title")
        .eq("user_id", user.id);
      const storyIds = stories?.map((s: any) => s.id) || [];
      if (storyIds.length === 0) {
        setComments([]);
        setLoading(false);
        return;
      }
      // 2. Get all comments for those stories, with story title
      const { data: commentsData } = await supabase
        .from("comments")
        .select("id, content, created_at, user_id, story_id, parent_id, read")
        .in("story_id", storyIds)
        .order("created_at", { ascending: false });
      // 3. Attach story title to each comment
      const commentsWithStory = (commentsData || []).map((c: any) => ({
        ...c,
        storyTitle:
          (Array.isArray(stories) &&
            stories.find((s: any) => s.id === c.story_id)?.title) ||
          "(Untitled)",
      }));
      // 4. Fetch user profiles
      const userIds = commentsWithStory.map((c: any) => c.user_id);
      const userMap: any = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, username, avatar_url")
          .in("id", userIds);
        if (profiles) {
          profiles.forEach((p: any) => {
            userMap[p.id] = {
              username: p.username || p.id,
              avatar_url: p.avatar_url || null,
            };
          });
        }
      }
      // 5. Attach username and avatar to each comment
      const commentsWithUser = commentsWithStory.map((c: any) => ({
        ...c,
        commenter: userMap[c.user_id]?.username || c.user_id,
        commenterAvatar: userMap[c.user_id]?.avatar_url || null,
      }));
      setComments(commentsWithUser);
      setLoading(false);
    })();
  }, [user]);

  // Action handlers
  const handleMarkRead = async (commentId: string) => {
    await supabase.from("comments").update({ read: true }).eq("id", commentId);
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, read: true } : c))
    );
  };

  // Delete
  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    await supabase.from("comments").delete().eq("id", commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Reply
  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyContent("");
  };

  const handleSendReply = async (parentId: string, storyId: string) => {
    if (!replyContent.trim()) return;
    await supabase.from("comments").insert([
      {
        content: replyContent,
        user_id: user.id,
        story_id: storyId,
        parent_id: parentId,
        created_at: new Date().toISOString(),
        read: false,
      },
    ]);
    setReplyingTo(null);
    setReplyContent("");
    // Optionally, refetch comments or append the new comment to state
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100 mb-4">
        Comments on Your Stories
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-800 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-300">Comment</th>
              <th className="px-4 py-2 text-left text-gray-300">Story</th>
              <th className="px-4 py-2 text-left text-gray-300">Commenter</th>
              <th className="px-4 py-2 text-left text-gray-300">Date</th>
              <th className="px-4 py-2 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : comments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No comments found.
                </td>
              </tr>
            ) : (
              comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <tr
                    className={`border-b border-zinc-700 ${
                      comment.read ? "bg-zinc-900 text-gray-500" : ""
                    }`}
                  >
                    <td
                      className="px-4 py-2 text-gray-100 max-w-xs truncate"
                      title={comment.content}
                    >
                      {comment.content}
                    </td>
                    <td className="px-4 py-2 text-gray-200">
                      {comment.storyTitle}
                    </td>
                    <td className="px-4 py-2 text-gray-400">
                      <div className="flex items-center space-x-2">
                        {comment.commenterAvatar ? (
                          <img
                            src={comment.commenterAvatar}
                            alt="avatar"
                            className="w-7 h-7 rounded-full border border-zinc-700"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold">
                            {comment.commenter[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <span>{comment.commenter}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-400">
                      {new Date(comment.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReply(comment.id)}
                          className="px-2 py-1 rounded bg-zinc-700 text-green-400 text-xs font-semibold transition-colors hover:bg-green-600 hover:text-white"
                          title="Reply"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="px-2 py-1 rounded bg-zinc-700 text-red-400 text-xs font-semibold transition-colors hover:bg-red-600 hover:text-white"
                          title="Delete"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleMarkRead(comment.id)}
                          disabled={comment.read}
                          className={`px-2 py-1 rounded bg-zinc-700 text-blue-400 text-xs font-semibold transition-colors hover:bg-blue-600 hover:text-white ${
                            comment.read ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          title="Mark as Read"
                        >
                          {comment.read ? "Read" : "Mark as Read"}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {replyingTo === comment.id && (
                    <tr>
                      <td colSpan={5} className="bg-zinc-800">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="w-2/3 p-2 rounded border border-zinc-600 bg-zinc-900 text-white"
                          placeholder="Type your reply..."
                        />
                        <button
                          onClick={() =>
                            handleSendReply(comment.id, comment.story_id)
                          }
                          className="ml-2 px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Send
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="ml-2 px-3 py-1 bg-gray-500 text-white rounded"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommentsPanel;
