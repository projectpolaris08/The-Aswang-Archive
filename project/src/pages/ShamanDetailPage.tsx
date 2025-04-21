import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { shamansHealers } from "../data/shamanHealers";
import ShamanCard from "../components/shamanHealers/ShamanCard";
import { Shaman } from "../types";
import { ArrowLeft } from "lucide-react";

const ShamanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [relatedShamans, setRelatedShamans] = useState<Shaman[]>([]);

  // Find the selected shaman with proper typing
  const shaman = shamansHealers.find((s: Shaman) => s.id === id);

  useEffect(() => {
    if (shaman) {
      // Get shamans with same type or origin, excluding current shaman
      const related = shamansHealers
        .filter(
          (s: Shaman) =>
            s.id !== shaman.id &&
            (s.type === shaman.type || s.origin === shaman.origin)
        )
        .slice(0, 3);

      setRelatedShamans(related);
    }
  }, [shaman]);

  if (!shaman) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-300 text-xl mb-4">Shaman not found</p>
        <Link
          to="/shamans-healers"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to all Shamans & Healers
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link
          to="/shamans-healers"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to all Shamans & Healers
        </Link>

        {/* Shaman Detail Section */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={shaman.imageUrl}
                alt={shaman.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:w-2/3">
              <h1 className="font-serif text-3xl font-bold text-white mb-2">
                {shaman.name}
              </h1>
              <div className="flex gap-3 mb-6">
                <span className="text-sm px-3 py-1 bg-red-900 text-red-100 rounded-full">
                  {shaman.type}
                </span>
                <span className="text-sm px-3 py-1 bg-blue-900 text-blue-100 rounded-full">
                  {shaman.origin}
                </span>
              </div>
              <p className="text-gray-300 mb-6">{shaman.description}</p>

              <div className="mb-8">
                <h3 className="font-serif text-xl font-bold text-white mb-3">
                  Abilities & Practices
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {shaman.abilities.map((ability, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-gray-300">{ability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related shamans */}
        {relatedShamans.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-white mb-8">
              Related Practitioners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedShamans.map((relatedShaman) => (
                <ShamanCard key={relatedShaman.id} shaman={relatedShaman} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShamanDetailPage;