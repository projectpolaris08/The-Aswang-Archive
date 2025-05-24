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
      <div
        className="relative w-full flex justify-center items-center bg-black"
        style={{ minHeight: "200px" }}
      >
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full max-h-[60vh] object-contain"
          style={{ background: "#111" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-90"></div>
        <div className="absolute bottom-0 left-0 p-8">
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
          <h1 className="font-serif text-4xl font-bold text-white mb-2">
            {story.title}
          </h1>
          <p className="text-gray-300 max-w-2xl">{story.excerpt}</p>
          {typeof upvotes === "number" && (
            <div className="mt-4 flex items-center">
              <button
                onClick={onUpvote}
                disabled={!canUpvote}
                className={`px-3 py-1 rounded font-bold mr-2 transition-colors ${
                  hasUpvoted
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-red-600 text-white hover:bg-red-700"
                } ${!canUpvote ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                👍 Like
              </button>
              <span className="text-gray-200">{upvotes} likes</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        <div className="prose prose-invert prose-lg">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-300 mb-6 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
