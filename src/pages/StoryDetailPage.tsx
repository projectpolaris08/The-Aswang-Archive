import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { stories } from "../data/stories";
import { Story } from "../types/index";
import StoryDetail from "../components/stories/StoryDetail";
import StoryCard from "../components/stories/StoryCard";
import { ArrowLeft } from "lucide-react";

const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [relatedStories, setRelatedStories] = useState<Story[]>([]);

  // Find the selected story
  const story = stories.find((s) => s.id === id);

  useEffect(() => {
    if (story) {
      // Get stories from the same region, excluding current story
      const related = stories
        .filter((s) => s.id !== story.id && s.region === story.region)
        .slice(0, 3);

      setRelatedStories(related);
    }
  }, [story]);

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

        <StoryDetail story={story} />

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
