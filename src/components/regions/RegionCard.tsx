import React from 'react';
import { Region } from '../../types';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface RegionCardProps {
  region: Region;
}

const RegionCard: React.FC<RegionCardProps> = ({ region }) => {
  return (
    <Link 
      to={`/regions/${region.id}`} 
      className="group block overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="relative h-72 overflow-hidden">
        <img 
          src={region.imageUrl} 
          alt={region.name} 
          className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex items-center mb-2">
            <MapPin className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="font-serif text-2xl font-bold text-white">{region.name}</h3>
          </div>
          <p className="text-gray-300 line-clamp-3">
            {region.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RegionCard;