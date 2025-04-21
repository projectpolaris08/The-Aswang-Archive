import React, { useState } from "react";
import { Shaman } from "../types";
import { shamansHealers } from "../data/shamanHealers";
import { Search } from "lucide-react";

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
    <div className="bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">
            Shamans & Healers
          </h1>
          <p className="text-gray-300">
            Explore the traditional spiritual practitioners and healers from
            Philippine folklore
          </p>
        </div>

        {/* Search and filters - Same structure as CreaturesPage */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShamans.map((shaman: Shaman) => (
              <div
                key={shaman.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {shaman.name}
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-red-900 text-red-100 rounded-full">
                      {shaman.type}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-900 text-blue-100 rounded-full">
                      {shaman.origin}
                    </span>
                  </div>
                  <p className="text-gray-300">{shaman.description}</p>
                </div>
              </div>
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
