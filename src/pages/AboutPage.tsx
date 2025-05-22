import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl font-bold text-white mb-8 text-center">
            About The Aswang Archieve
          </h1>

          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="font-serif text-2xl font-bold text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                The Aswang Archive is committed to exploring and safeguarding
                the vibrant myths and folk tales of the Philippines. Our mission
                is to create an in-depth collection for enthusiasts, scholars,
                and curious minds eager to discover the supernatural beings,
                age-old stories, and cultural practices that shape the
                Philippines' unique heritage. By combining thorough research,
                engaging narratives, and insights from local communities, we
                strive to ensure these timeless legends endure for generations
                to come while introducing them to audiences worldwide.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Through detailed research, storytelling, and community
                contributions, we aim to keep these ancient tales alive for
                future generations and share them with a global audience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden h-full">
              <div className="p-8">
                <h2 className="font-serif text-2xl font-bold text-white mb-4">
                  What We Cover
                </h2>
                <ul className="text-gray-300 space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Mythical creatures from Filipino folklore</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Regional myths and legends</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Traditional beliefs and supernatural phenomena</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Historical context of Filipino mythology</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>
                      Modern interpretations and appearances in popular culture
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden h-full">
              <div className="p-8">
                <h2 className="font-serif text-2xl font-bold text-white mb-4">
                  Our Approach
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We strive to present information that is:
                </p>
                <ul className="text-gray-300 space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Well-researched and academically sound</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>
                      Respectful of indigenous knowledge and traditions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Accessible to both scholars and casual readers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>
                      Engaging through storytelling and visual elements
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="font-serif text-2xl font-bold text-white mb-4">
                Get Involved
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                We welcome contributions from researchers, storytellers, and
                folklore enthusiasts. If you have stories, research, or
                resources to share, please get in touch with us.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Your knowledge and perspectives help make The Aswang Archive a
                more comprehensive and authentic resource for Filipino
                mythology.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} The Aswang Project. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
