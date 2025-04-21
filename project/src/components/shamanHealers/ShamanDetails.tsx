import React from 'react';

// Define the Shaman type if it doesn't exist in your types file
interface Shaman {
  id: string;
  name: string;
  imageUrl: string;
  tribe?: string;        // Made optional with ?
  rank?: string;         // Made optional with ?
  description: string;   // Using description instead of biography
  abilities: string[];   // Using abilities instead of specializations
  spiritualConnections?: string[]; // Using spiritualConnections instead of spiritualGuides
}

interface ShamanDetailProps {
  shaman: Shaman;
}

const ShamanDetail: React.FC<ShamanDetailProps> = ({ shaman }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="relative h-96">
        <img
          src={shaman.imageUrl}
          alt={shaman.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-90"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">{shaman.name}</h1>
          <div className="flex items-center text-gray-300 mb-4">
            {shaman.tribe && <span className="mr-3">{shaman.tribe}</span>}
            {shaman.tribe && shaman.rank && (
              <span className="w-1 h-1 rounded-full bg-gray-500 mr-3"></span>
            )}
            {shaman.rank && <span>Rank: {shaman.rank}</span>}
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold text-white mb-4">Description</h2>
          <p className="text-gray-300 leading-relaxed">{shaman.description}</p>
        </div>

        {shaman.abilities && shaman.abilities.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Abilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shaman.abilities.map((ability, index) => (
                <div key={index} className="flex items-center bg-gray-700/50 p-4 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-200">{ability}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {shaman.spiritualConnections && shaman.spiritualConnections.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Spiritual Connections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shaman.spiritualConnections.map((connection, index) => (
                <div key={index} className="flex items-center bg-gray-700/50 p-4 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-200">{connection}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShamanDetail;