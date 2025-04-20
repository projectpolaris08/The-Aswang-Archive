import React from 'react';
import { stories } from '../../data/stories';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FeaturedStories: React.FC = () => {
  // Filter only featured stories
  const featuredStories = stories.filter(story => story.featured);
  
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="font-serif text-3xl font-bold text-white mb-2">Legendary Tales</h2>
            <p className="text-gray-400 max-w-2xl">
              Immerse yourself in the captivating stories of Philippine mythology and folklore
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature the first story prominently */}
          <div className="lg:col-span-2">
            <Link to={`/stories/${featuredStories[0]?.id}`} className="group block h-full">
              <div className="relative h-full overflow-hidden rounded-lg shadow-lg">
                <div className="absolute inset-0">
                  <img 
                    src={featuredStories[0]?.imageUrl} 
                    alt={featuredStories[0]?.title} 
                    className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-90"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 z-10">
                  <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs rounded-full mb-4">Featured</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                    {featuredStories[0]?.title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {featuredStories[0]?.excerpt}
                  </p>
                  <span className="inline-flex items-center text-red-500 text-sm font-medium">
                    Read full story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Other featured stories */}
          <div className="space-y-8">
            {featuredStories.slice(1, 3).map((story) => (
              <Link 
                key={story.id} 
                to={`/stories/${story.id}`}
                className="group block"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={story.imageUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {story.region}
                    </p>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {story.excerpt}
                    </p>
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