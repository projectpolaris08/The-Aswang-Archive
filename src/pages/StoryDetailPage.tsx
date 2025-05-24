import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { stories } from "../data/stories";
import { Story } from "../types/index";
import StoryDetail from "../components/stories/StoryDetail";
import StoryCard from "../components/stories/StoryCard";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../supabaseClient";
import CommentsSection from "../components/comments/CommentsSection";

const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [relatedStories, setRelatedStories] = useState<Story[]>([]);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      // Try static stories first
      let found = stories.find((s) => s.id === id);
      if (found) {
        setStory(found);
        setLoading(false);
        return;
      }
      // Try Supabase
      const { data } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .single();
      if (data) {
        setStory({
          ...data,
          imageUrl: data.image_url || data.imageUrl,
          featured: data.featured || false,
          region: data.region || "",
          excerpt: data.excerpt || data.content?.slice(0, 120) || "",
        });
      }
      setLoading(false);
    };
    fetchStory();
  }, [id]);

  useEffect(() => {
    if (story) {
      // Get stories from the same region, excluding current story
      const related = stories
        .filter((s) => s.id !== story.id && s.region === story.region)
        .slice(0, 3);

      setRelatedStories(related);
    }
  }, [story]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (story && isUUID(story.id)) {
      supabase
        .from("stories")
        .select("upvotes")
        .eq("id", story.id)
        .single()
        .then(({ data }) => {
          if (data) setUpvotes(data.upvotes);
        });
    }
  }, [story]);

  useEffect(() => {
    const checkUpvote = async () => {
      if (user && story && isUUID(story.id)) {
        const { data } = await supabase
          .from("story_upvotes")
          .select("id")
          .eq("story_id", story.id)
          .eq("user_id", user.id)
          .single();
        setHasUpvoted(!!data);
      } else {
        setHasUpvoted(false);
      }
    };
    checkUpvote();
  }, [user, story]);

  const handleLike = async () => {
    if (!story || !isUUID(story.id) || !user) return;

    if (hasUpvoted) {
      // Unlike: remove from story_upvotes and decrement
      await supabase
        .from("story_upvotes")
        .delete()
        .eq("story_id", story.id)
        .eq("user_id", user.id);

      const { data, error } = await supabase
        .from("stories")
        .update({ upvotes: upvotes - 1 })
        .eq("id", story.id)
        .select()
        .single();

      if (!error && data) {
        setUpvotes(data.upvotes);
        setHasUpvoted(false);
      }
    } else {
      // Like: insert into story_upvotes and increment
      await supabase
        .from("story_upvotes")
        .insert([{ story_id: story.id, user_id: user.id }]);

      const { data, error } = await supabase
        .from("stories")
        .update({ upvotes: upvotes + 1 })
        .eq("id", story.id)
        .select()
        .single();

      if (!error && data) {
        setUpvotes(data.upvotes);
        setHasUpvoted(true);
        if (data.upvotes >= 100 && !data.featured) {
          await supabase
            .from("stories")
            .update({ featured: true })
            .eq("id", story.id);
        }
      }
    }
  };

  // Helper function to check for UUID
  function isUUID(id: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-300 text-xl mb-4">Loading story...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-300 text-xl mb-4">Story not found</p>
        <Link
          to="/stories"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to all stories
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link
          to="/stories"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to all stories
        </Link>

        <StoryDetail
          story={story}
          upvotes={story && isUUID(story.id) ? upvotes : undefined}
          onUpvote={story && isUUID(story.id) ? handleLike : undefined}
          hasUpvoted={hasUpvoted}
        />

        {/* Comments Section: Only for Supabase stories with UUID id */}
        {story && isUUID(story.id) && (
          <CommentsSection storyId={story.id} user={user} />
        )}

        {/* Related stories */}
        {relatedStories.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-white mb-8">
              More Stories from {story.region}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryDetailPage;
