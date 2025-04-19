import React from 'react';
import { Creature } from '../../types';

interface CreatureDetailProps {
  creature: Creature;
}

const CreatureDetail: React.FC<CreatureDetailProps> = ({ creature }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="relative h-96">
        <img
          src={creature.imageUrl}
          alt={creature.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-90"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">{creature.name}</h1>
          <div className="flex items-center text-gray-300 mb-4">
            <span className="mr-3">{creature.type}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500 mr-3"></span>
            <span>Origin: {creature.origin}</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-white mb-4">Description</h2>
          <p className="text-gray-300 leading-relaxed">{creature.description}</p>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold text-white mb-4">Abilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {creature.abilities.map((ability, index) => (
              <div key={index} className="flex items-center bg-gray-700/50 p-4 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="text-gray-200">{ability}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatureDetail;