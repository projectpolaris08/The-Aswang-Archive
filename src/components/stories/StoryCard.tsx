import React from "react";
import { Story } from "../../types";
import { Link } from "react-router-dom";
import AswangImage from "../../assets/Aswang.jpeg";

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <Link
      to={`/stories/${story.id}`}
      className="group block overflow-hidden rounded-lg shadow-lg bg-gray-800 transition-transform hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={story.imageUrl || AswangImage}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
        />
        {story.featured && (
          <div className="absolute top-0 right-0 p-2 m-2 bg-red-600 rounded text-xs font-medium text-white">
            Featured
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-2 m-2 bg-gray-900/70 rounded text-xs font-medium text-gray-100">
          {story.region}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
          {story.title}
        </h3>
        <p className="text-gray-300 text-sm line-clamp-3">{story.excerpt}</p>
      </div>
    </Link>
  );
};

export default StoryCard;
