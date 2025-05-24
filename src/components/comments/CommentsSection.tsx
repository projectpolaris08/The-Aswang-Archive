import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

interface CommentType {
  id: string;
  user_id: string;
  story_id: string;
  content: string;
  created_at: string;
  parent_id?: string | null;
  username?: string;
  avatar_url?: string;
  replies?: CommentType[];
}

interface CommentsSectionProps {
  storyId: string;
  user: any;
}

// Helper to build a tree from flat comments
function buildCommentTree(comments: CommentType[]): CommentType[] {
  const map: { [key: string]: CommentType } = {};
  comments.forEach((c) => (map[c.id] = { ...c, replies: [] }));
  const tree: CommentType[] = [];
  comments.forEach((c) => {
    if (c.parent_id) {
      map[c.parent_id]?.replies?.push(map[c.id]);
    } else {
      tree.push(map[c.id]);
    }
  });
  return tree;
}

const Comment: React.FC<{
  comment: CommentType;
  user: any;
  onDelete: (id: string) => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyContent: string;
  setReplyContent: (v: string) => void;
  handleSubmitReply: (e: React.FormEvent, parentId: string) => void;
}> = ({
  comment,
  user,
  onDelete,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  handleSubmitReply,
}) => {
  const isAuthor = user && user.id === comment.user_id;
  return (
    <div style={{ marginLeft: comment.parent_id ? 32 : 0, marginTop: 8 }}>
      <div className="flex items-start mb-2">
        {comment.avatar_url ? (
          <img
            src={comment.avatar_url}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-lg">
            {comment.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="ml-2 bg-gray-800 rounded-2xl px-4 py-2 inline-block max-w-[80vw] shadow-sm">
          <div className="text-gray-200 text-sm font-semibold">
            {comment.username || "User"}
            <span className="ml-2 text-gray-500 text-xs font-normal">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
          <div className="text-gray-100">{comment.content}</div>
          <div className="flex gap-2 mt-1">
            <button
              className="text-blue-400 text-xs"
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
            >
              Reply
            </button>
            {isAuthor && (
              <button
                className="text-red-400 text-xs"
                onClick={() => onDelete(comment.id)}
              >
                Delete
              </button>
            )}
          </div>
          {replyingTo === comment.id && (
            <form onSubmit={(e) => handleSubmitReply(e, comment.id)}>
              <input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="bg-gray-700 text-white rounded px-2 py-1 mt-2 w-full"
                placeholder="Write a reply..."
              />
              <button type="submit" className="text-green-400 ml-2">
                Send
              </button>
            </form>
          )}
        </div>
      </div>
      {/* Render replies recursively */}
      {comment.replies &&
        comment.replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            user={user}
            onDelete={onDelete}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            handleSubmitReply={handleSubmitReply}
          />
        ))}
    </div>
  );
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ storyId, user }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Unified fetch for comments and profiles
  const fetchCommentsAndProfiles = async () => {
    setLoading(true);
    const { data: commentsData, error } = await supabase
      .from("comments")
      .select("*")
      .eq("story_id", storyId)
      .order("created_at", { ascending: true });
    if (error) {
      setLoading(false);
      return;
    }
    // Fetch user info from profiles
    const uniqueUserIds = Array.from(
      new Set(commentsData.map((c: any) => c.user_id).filter(Boolean))
    );
    let profilesMap: {
      [key: string]: { username: string; avatar_url?: string };
    } = {};
    if (uniqueUserIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", uniqueUserIds);
      if (profilesData) {
        profilesData.forEach((profile: any) => {
          profilesMap[profile.id] = {
            username: profile.username || "User",
            avatar_url: profile.avatar_url,
          };
        });
      }
    }
    // Attach user info to comments
    const commentsWithProfiles = commentsData.map((c: any) => ({
      ...c,
      username: profilesMap[c.user_id]?.username || "User",
      avatar_url: profilesMap[c.user_id]?.avatar_url,
    }));
    setComments(commentsWithProfiles);
    setLoading(false);
  };

  useEffect(() => {
    fetchCommentsAndProfiles();
    // eslint-disable-next-line
  }, [storyId]);

  // Build comment tree
  const commentTree = buildCommentTree(comments);

  // Post new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await supabase.from("comments").insert({
      story_id: storyId,
      user_id: user.id,
      content,
      parent_id: null,
    });
    setContent("");
    await fetchCommentsAndProfiles();
  };

  // Post reply
  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    await supabase.from("comments").insert({
      story_id: storyId,
      user_id: user.id,
      content: replyContent,
      parent_id: parentId,
    });
    setReplyContent("");
    setReplyingTo(null);
    await fetchCommentsAndProfiles();
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    await supabase.from("comments").delete().eq("id", commentId);
    await fetchCommentsAndProfiles();
  };

  return (
    <div className="mt-12">
      <h2 className="font-serif text-2xl font-bold text-white mb-4">
        Comments
      </h2>
      {loading ? (
        <p className="text-gray-400">Loading comments...</p>
      ) : (
        <div className="space-y-4 mb-8">
          {commentTree.length === 0 ? (
            <p className="text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            commentTree.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                user={user}
                onDelete={handleDelete}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                handleSubmitReply={handleSubmitReply}
              />
            ))
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="rounded-2xl px-4 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all w-auto min-w-[120px] max-w-[400px] shadow-sm"
          placeholder="Write a comment..."
        />
        <button
          type="submit"
          className="ml-1 px-3 py-1 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors font-medium text-sm"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
