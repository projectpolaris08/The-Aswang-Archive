import React from 'react';
import { regions } from '../../data/regions';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const RegionsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">Explore by Region</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover how myths and legends vary across different regions of the Philippines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regions.map((region) => (
            <Link 
              key={region.id} 
              to={`/regions/${region.id}`}
              className="group relative overflow-hidden rounded-lg shadow-lg h-64"
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img 
                  src={region.imageUrl} 
                  alt={region.name} 
                  className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="font-serif text-xl font-bold text-white">{region.name}</h3>
                </div>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {region.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionsSection;