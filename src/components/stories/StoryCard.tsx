import React from "react";
import { Story } from "../../types";
import { Link } from "react-router-dom";
import AswangImage from "../../assets/Aswang.jpeg";
import LegendaryBg from "../../assets/Legendary.jpg";

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
        {/* Legendary background image */}
        <img
          src={LegendaryBg}
          alt="legendary-bg"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ filter: "brightness(0.4)" }}
        />
        {/* Optional dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={story.imageUrl || AswangImage}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110 relative z-20"
        />
        {story.featured && (
          <div className="absolute top-0 right-0 p-2 m-2 bg-red-600 rounded text-xs font-medium text-white z-30">
            Featured
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-2 m-2 bg-gray-900/70 rounded text-xs font-medium text-gray-100 z-30">
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
