import React, { useState } from "react";
import { Shaman } from "../types";
import { shamansHealers } from "../data/shamanHealers";
import { Search } from "lucide-react";
import ShamanCard from "../components/shamanHealers/ShamanCard";
import CreaturesBg from "../assets/creatures.jpg";

const ShamansHealersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  // Get unique types and origins for filters
  const types = Array.from(
    new Set(shamansHealers.map((shaman: Shaman) => shaman.type))
  );
  const origins = Array.from(
    new Set(shamansHealers.map((shaman: Shaman) => shaman.origin))
  );

  // Filter shamans based on search query and filters
  const filteredShamans = shamansHealers.filter((shaman: Shaman) => {
    const matchesSearch =
      shaman.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shaman.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? shaman.type === selectedType : true;
    const matchesOrigin = selectedOrigin
      ? shaman.origin === selectedOrigin
      : true;

    return matchesSearch && matchesType && matchesOrigin;
  });

  return (
    <div className="bg-gray-900 min-h-screen py-16 relative">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${CreaturesBg})`,
          filter: "brightness(0.4)",
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">
            Shamans & Healers
          </h1>
          <p className="text-gray-300">
            Explore the traditional spiritual practitioners and healers from
            Philippine folklore
          </p>
        </div>

        {/* Search and filters */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search shamans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <select
              value={selectedType || ""}
              onChange={(e) => setSelectedType(e.target.value || null)}
              className="px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Types</option>
              {types.map((type: string) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedOrigin || ""}
              onChange={(e) => setSelectedOrigin(e.target.value || null)}
              className="px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Origins</option>
              {origins.map((origin: string) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredShamans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredShamans.map((shaman: Shaman) => (
              <ShamanCard key={shaman.id} shaman={shaman} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No shamans found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType(null);
                setSelectedOrigin(null);
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShamansHealersPage;
