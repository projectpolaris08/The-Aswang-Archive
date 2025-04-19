import React from 'react';
import { Story } from '../../types';

interface StoryDetailProps {
  story: Story;
}

const StoryDetail: React.FC<StoryDetailProps> = ({ story }) => {
  // Split content into paragraphs
  const paragraphs = story.content.split('\n\n').filter(Boolean);

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="relative h-96">
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full h-full object-cover"
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
          <h1 className="font-serif text-4xl font-bold text-white mb-2">{story.title}</h1>
          <p className="text-gray-300 max-w-2xl">{story.excerpt}</p>
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