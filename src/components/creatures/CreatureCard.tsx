import React from 'react';
import { Creature } from '../../types';
import { Link } from 'react-router-dom';

interface CreatureCardProps {
  creature: Creature;
}

const CreatureCard: React.FC<CreatureCardProps> = ({ creature }) => {
  return (
    <Link 
      to={`/creatures/${creature.id}`} 
      className="group block overflow-hidden rounded-lg shadow-lg bg-gray-800 transition-transform hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="relative h-60 overflow-hidden">
        <img 
          src={creature.imageUrl} 
          alt={creature.name} 
          className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
        />
        <div className="absolute top-0 right-0 p-2 m-2 bg-gray-900/70 rounded text-xs font-medium text-gray-100">
          {creature.type}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
          {creature.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3">
          Origin: {creature.origin}
        </p>
        <p className="text-gray-300 text-sm line-clamp-3 mb-3">
          {creature.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {creature.abilities.slice(0, 3).map((ability, index) => (
            <span 
              key={index} 
              className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
            >
              {ability}
            </span>
          ))}
          {creature.abilities.length > 3 && (
            <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
              +{creature.abilities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CreatureCard;