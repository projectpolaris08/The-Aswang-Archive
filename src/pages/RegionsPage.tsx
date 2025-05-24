import React from "react";
import { regions } from "../data/regions";
import RegionCard from "../components/regions/RegionCard";
import regionsBg from "../assets/regions.jpg";

const RegionsPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen py-16 relative">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${regionsBg})`,
          filter: "brightness(0.4)",
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">
            Explore by Region
          </h1>
          <p className="text-gray-300">
            Discover how myths and legends vary across different regions of the
            Philippines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionsPage;
