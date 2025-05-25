import React from "react";
import { Story } from "../../types";

interface StoryDetailProps {
  story: Story;
  upvotes?: number;
  onUpvote?: () => void;
  canUpvote?: boolean;
  hasUpvoted?: boolean;
}

const StoryDetail: React.FC<StoryDetailProps> = ({
  story,
  upvotes,
  onUpvote,
  canUpvote,
  hasUpvoted,
}) => {
  // Split content into paragraphs
  const paragraphs = story.content.split("\n\n").filter(Boolean);

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="relative w-full flex justify-center items-center bg-black overflow-hidden rounded-t-lg">
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full object-contain bg-black max-h-[60vh] sm:max-h-[70vh]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-90 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full">
          <div className="flex items-center mb-4">
            {story.featured && (
              <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs rounded-full mr-3">
                Featured
              </span>
            )}
            <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
              {story.region}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            {story.title}
          </h1>
          <p className="text-gray-300 max-w-2xl text-sm sm:text-base">
            {story.excerpt}
          </p>
          {typeof upvotes === "number" && (
            <div className="mt-4 flex items-center">
              <button
                onClick={onUpvote}
                disabled={!canUpvote || !onUpvote}
                className={`px-3 py-1 rounded font-bold mr-2 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                  ${
                    hasUpvoted
                      ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }
                  ${
                    !canUpvote || !onUpvote
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
              >
                👍 Like
              </button>
              <span className="text-gray-200">{upvotes} likes</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        <div className="tiptap-content bg-gray-800 rounded p-4 border border-gray-700 text-gray-100">
          <div dangerouslySetInnerHTML={{ __html: story.content }} />
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
