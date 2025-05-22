import React, { useState, useEffect } from "react";
import { stories as staticStories } from "../data/stories";
import StoryCard from "../components/stories/StoryCard";
import { Search } from "lucide-react";
import { supabase } from "../supabaseClient";

interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  region: string;
  imageUrl: string | null;
  image_url?: string;
  featured: boolean;
  created_at?: string;
}

const StoriesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSupabaseStories();
  }, []);

  const fetchSupabaseStories = async () => {
    try {
      const { data: supabaseStories, error } = await supabase
        .from("stories")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform Supabase stories to match the Story interface
      const transformedSupabaseStories = (supabaseStories || []).map(
        (story: any) => ({
          ...story,
          imageUrl: story.image_url || story.imageUrl,
          featured: story.featured || false,
          created_at: story.created_at || new Date().toISOString(),
        })
      );

      // Add a created_at field to static stories (using a default past date)
      const storiesWithDates = staticStories.map((story) => ({
        ...story,
        created_at: "2024-01-01T00:00:00Z", // Default date for static stories
      }));

      // Combine and sort all stories by date
      const combined = [
        ...transformedSupabaseStories,
        ...storiesWithDates,
      ].sort(
        (a, b) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      );

      setAllStories(combined);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Get unique regions for filter
  const regions = Array.from(new Set(allStories.map((story) => story.region)));

  // Filter stories based on search query and filters
  const filteredStories = allStories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion
      ? story.region === selectedRegion
      : true;
    const matchesFeatured = showFeaturedOnly ? story.featured : true;

    return matchesSearch && matchesRegion && matchesFeatured;
  });

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Error loading stories: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">
            Legendary Tales
          </h1>
          <p className="text-gray-300">
            Immerse yourself in the captivating stories of Philippine mythology
            and folklore
          </p>
        </div>

        {/* Search and filters */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <select
              value={selectedRegion || ""}
              onChange={(e) => setSelectedRegion(e.target.value || null)}
              className="px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <label className="flex items-center cursor-pointer bg-gray-800 px-4 py-3 rounded-md border border-gray-700">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-700 text-red-600 focus:ring-red-500"
              />
              <span className="text-white">Featured Only</span>
            </label>
          </div>
        </div>

        {/* Results */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No stories found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRegion(null);
                setShowFeaturedOnly(false);
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

export default StoriesPage;
