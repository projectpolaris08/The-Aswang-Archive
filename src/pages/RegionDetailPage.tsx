import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { regions } from "../data/regions";
import { creatures } from "../data/creatures";
import { stories } from "../data/stories";
import CreatureCard from "../components/creatures/CreatureCard";
import StoryCard from "../components/stories/StoryCard";
import { ArrowLeft } from "lucide-react";
import { Creature, Story } from "../types";

const RegionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [regionCreatures, setRegionCreatures] = useState<Creature[]>([]);
  const [regionStories, setRegionStories] = useState<Story[]>([]);

  // Find the selected region
  const region = regions.find((r) => r.id === id);

  useEffect(() => {
    if (region) {
      // Find creatures and stories from this region
      const relatedCreatures = creatures.filter(
        (c) => c.origin === region.name
      );
      const relatedStories = stories.filter((s) => s.region === region.name);

      setRegionCreatures(relatedCreatures);
      setRegionStories(relatedStories);
    }
  }, [region]);

  if (!region) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-300 text-xl mb-4">Region not found</p>
        <Link
          to="/regions"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to all regions
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link
          to="/regions"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to all regions
        </Link>

        {/* Region hero */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-12">
          <img
            src={region.imageUrl}
            alt={region.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-90"></div>
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="font-serif text-4xl font-bold text-white mb-4">
              {region.name}
            </h1>
            <p className="text-gray-300 max-w-3xl">{region.description}</p>
          </div>
        </div>

        {/* Region's creatures */}
        {regionCreatures.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif text-2xl font-bold text-white mb-8">
              Creatures from {region.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {regionCreatures.map((creature) => (
                <CreatureCard key={creature.id} creature={creature} />
              ))}
            </div>
          </div>
        )}

        {/* Region's stories */}
        {regionStories.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-8">
              Tales from {region.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {regionStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        )}

        {regionCreatures.length === 0 && regionStories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No content available for this region yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionDetailPage;
