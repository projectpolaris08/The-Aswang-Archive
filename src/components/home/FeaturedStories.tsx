import React from "react";
import { stories } from "../../data/stories";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedStories: React.FC = () => {
  // Filter only featured stories
  const featuredStories = stories.filter((story) => story.featured);

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="font-serif text-3xl font-bold text-white mb-2">
              Legendary Tales
            </h2>
            <p className="text-gray-400 max-w-2xl">
              Immerse yourself in the captivating stories of Philippine
              mythology and folklore
            </p>
          </div>
          <Link
            to="/stories"
            className="inline-flex items-center mt-4 md:mt-0 text-red-500 hover:text-red-400 transition-colors"
          >
            View all stories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Main featured story on the left */}
          <div className="md:col-span-2 lg:col-span-2 h-full">
            <Link
              to={`/stories/${featuredStories[0]?.id}`}
              className="group block h-full"
            >
              <div className="relative h-full overflow-hidden rounded-lg shadow-lg min-h-[160px] sm:min-h-[200px] md:min-h-[340px] lg:min-h-0 aspect-[16/9] lg:aspect-auto">
                <div className="absolute inset-0 h-full">
                  <img
                    src={featuredStories[0]?.imageUrl || ""}
                    alt={featuredStories[0]?.title}
                    className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 transform transition-transform duration-300 z-10">
                  <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs rounded-full mb-2 md:mb-4">
                    Featured
                  </span>
                  <h3 className="font-serif text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2">
                    {featuredStories[0]?.title}
                  </h3>
                  <p className="text-gray-300 mb-2 md:mb-4 text-xs md:text-base">
                    {featuredStories[0]?.excerpt}
                  </p>
                  <span className="inline-flex items-center text-red-500 text-xs md:text-sm font-medium">
                    Read full story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Sidebar: up to 4 more featured stories stacked vertically */}
          <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1 h-full">
            {featuredStories.slice(1, 5).map((story, idx) => (
              <Link
                key={story.id}
                to={`/stories/${story.id}`}
                className={`group block h-full flex-1 ${
                  idx === 3 ? "mb-0" : ""
                }`}
              >
                <div className="flex items-stretch bg-gray-800 rounded-lg shadow-md overflow-hidden min-h-[110px] flex-1 p-3">
                  <div className="w-24 md:w-32 h-full flex-shrink-0 overflow-hidden mr-4">
                    <img
                      src={story.imageUrl || ""}
                      alt={story.title}
                      className="w-full h-full object-cover rounded-md transition-transform duration-500 transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-center min-w-0">
                    <h3 className="font-serif text-lg font-bold text-white mb-1 group-hover:text-red-500 transition-colors truncate">
                      {story.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-1 truncate">
                      {story.region}
                    </p>
                    <p className="text-gray-300 text-xs line-clamp-2 truncate">
                      {story.excerpt}
                    </p>
                    <span className="inline-flex items-center text-red-500 text-xs font-medium mt-1">
                      Read full story
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories;
