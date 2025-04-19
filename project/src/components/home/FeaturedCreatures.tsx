import React from 'react';
import { creatures } from '../../data/creatures';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FeaturedCreatures: React.FC = () => {
  // Get only the first 3 creatures for featured section
  const featuredCreatures = creatures.slice(0, 3);

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="font-serif text-3xl font-bold text-white mb-2">Mythical Creatures</h2>
            <p className="text-gray-400 max-w-2xl">
              Explore the terrifying and fascinating supernatural beings from Philippine folklore
            </p>
          </div>
          <Link 
            to="/creatures" 
            className="inline-flex items-center mt-4 md:mt-0 text-red-500 hover:text-red-400 transition-colors"
          >
            View all creatures
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCreatures.map((creature) => (
            <Link 
              key={creature.id} 
              to={`/creatures/${creature.id}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg h-96">
                {/* Creature image */}
                <div className="absolute inset-0">
                  <img 
                    src={creature.imageUrl} 
                    alt={creature.name} 
                    className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-90"></div>
                </div>

                {/* Creature info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0 z-10">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">{creature.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{creature.type} • {creature.origin}</p>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {creature.description}
                  </p>
                  <span className="inline-flex items-center text-red-500 text-sm font-medium">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCreatures;