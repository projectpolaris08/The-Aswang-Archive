import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Horror from "../../assets/Horror.jpg";

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${Horror})`,
          filter: "brightness(0.4)",
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Explore the Dark Mysteries of{" "}
            <span className="text-red-500">Filipino Mythology</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Dive into the hidden world of Filipino folklore, where ancient
            spirits, eerie legends, and supernatural encounters have been passed
            down through generations.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/creatures"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
            >
              Discover Creatures
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/stories"
              className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-white font-medium rounded-md hover:bg-gray-800 hover:border-gray-700 transition-colors duration-300"
            >
              Read Stories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
