import React from "react";
import { Link } from "react-router-dom";
import { Shaman } from "../../types";

interface ShamanCardProps {
  shaman: Shaman;
}

const ShamanCard: React.FC<ShamanCardProps> = ({ shaman }) => {
  return (
    <Link
      to={`/shamans-healers/${shaman.id}`}
      className="group block bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Image container with type label */}
      <div className="relative">
        <img 
          src={shaman.imageUrl} 
          alt={shaman.name} 
          className="w-full h-64 object-cover transition-transform duration-500 transform group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black bg-opacity-60 text-white text-sm rounded">
            {shaman.type}
          </span>
        </div>
      </div>
      
      {/* Content section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">{shaman.name}</h3>
        <p className="text-sm text-gray-400 mb-3">Origin: {shaman.origin}</p>
        
        <p className="text-gray-300 mb-4 line-clamp-3">
          {shaman.description}
        </p>
        
        {/* Abilities tags */}
        {shaman.abilities && (
          <div className="flex flex-wrap gap-2 mb-4">
            {shaman.abilities.slice(0, 3).map((ability, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-md">
                {ability}
              </span>
            ))}
            {shaman.abilities.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-md">
                +{shaman.abilities.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <span className="text-red-400 group-hover:text-red-300 text-sm font-medium transition-colors">
          Learn more →
        </span>
      </div>
    </Link>
  );
};

export default ShamanCard;