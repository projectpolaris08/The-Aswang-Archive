import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { supabase } from "../supabaseClient";

const dummyData = [
  { date: "2024-05-01", views: 10, upvotes: 2, comments: 1 },
  { date: "2024-05-02", views: 20, upvotes: 5, comments: 3 },
  { date: "2024-05-03", views: 15, upvotes: 3, comments: 2 },
  { date: "2024-05-04", views: 30, upvotes: 8, comments: 4 },
];

interface AnalyticsPanelProps {
  user: any;
}

function formatDate(dateString: string) {
  return dateString.slice(0, 10); // YYYY-MM-DD
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(dummyData);
  const [topStories, setTopStories] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    async function fetchAnalytics() {
      // 1. Fetch all stories for the user
      const { data: stories, error: storiesError } = await supabase
        .from("stories")
        .select("id, title, created_at, views")
        .eq("user_id", user.id);
      if (storiesError) {
        setLoading(false);
        return;
      }

      // 2. Aggregate views per day
      const viewsByDate: Record<string, number> = {};
      stories.forEach((story: any) => {
        const date = formatDate(story.created_at);
        viewsByDate[date] = (viewsByDate[date] || 0) + (story.views || 0);
      });

      // 3. Fetch upvotes for user's stories
      const storyIds = stories.map((s: any) => s.id);
      let upvotesByDate: Record<string, number> = {};
      let upvotesCountByStory: Record<string, number> = {};
      if (storyIds.length > 0) {
        const { data: upvotes, error: upvotesError } = await supabase
          .from("story_upvotes")
          .select("created_at, story_id")
          .in("story_id", storyIds);
        if (!upvotesError && upvotes) {
          upvotes.forEach((upvote: any) => {
            const date = formatDate(upvote.created_at);
            upvotesByDate[date] = (upvotesByDate[date] || 0) + 1;
            upvotesCountByStory[upvote.story_id] =
              (upvotesCountByStory[upvote.story_id] || 0) + 1;
          });
        }
      }

      // 4. Fetch comments for user's stories
      let commentsByDate: Record<string, number> = {};
      let commentsCountByStory: Record<string, number> = {};
      if (storyIds.length > 0) {
        const { data: comments, error: commentsError } = await supabase
          .from("comments")
          .select("created_at, story_id")
          .in("story_id", storyIds);
        if (!commentsError && comments) {
          comments.forEach((comment: any) => {
            const date = formatDate(comment.created_at);
            commentsByDate[date] = (commentsByDate[date] || 0) + 1;
            commentsCountByStory[comment.story_id] =
              (commentsCountByStory[comment.story_id] || 0) + 1;
          });
        }
      }

      // 5. Merge all dates
      const allDates = Array.from(
        new Set([
          ...Object.keys(viewsByDate),
          ...Object.keys(upvotesByDate),
          ...Object.keys(commentsByDate),
        ])
      ).sort();

      // 6. Build chart data
      const mergedData = allDates.map((date) => ({
        date,
        views: viewsByDate[date] || 0,
        upvotes: upvotesByDate[date] || 0,
        comments: commentsByDate[date] || 0,
      }));

      // 7. Build top stories by views
      const storiesWithCounts = stories.map((story: any) => ({
        ...story,
        upvotes: upvotesCountByStory[story.id] || 0,
        comments: commentsCountByStory[story.id] || 0,
      }));
      const sortedStories = storiesWithCounts.sort(
        (a, b) => (b.views || 0) - (a.views || 0)
      );
      setTopStories(sortedStories.slice(0, 3));

      setChartData(mergedData.length > 0 ? mergedData : dummyData);
      setLoading(false);
    }

    fetchAnalytics();
  }, [user]);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Analytics</h1>
      {/* Views Over Time */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          Views Over Time
        </h2>
        <div className="bg-zinc-800 rounded-lg p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
          {loading && <div className="text-gray-400 mt-2">Loading...</div>}
        </div>
      </div>
      {/* Upvotes Over Time */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          Upvotes Over Time
        </h2>
        <div className="bg-zinc-800 rounded-lg p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="upvotes"
                stroke="#f59e42"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
          {loading && <div className="text-gray-400 mt-2">Loading...</div>}
        </div>
      </div>
      {/* Comments Over Time */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          Comments Over Time
        </h2>
        <div className="bg-zinc-800 rounded-lg p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Bar dataKey="comments" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
          {loading && <div className="text-gray-400 mt-2">Loading...</div>}
        </div>
      </div>
      {/* Top Performing Stories */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          Top Performing Stories
        </h2>
        <div className="bg-zinc-800 rounded-lg p-6">
          {topStories.length === 0 ? (
            <div className="text-gray-400">No stories yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-zinc-900 rounded-lg p-4 shadow flex flex-col h-full"
                >
                  <div
                    className="font-bold text-lg text-gray-100 mb-2 truncate"
                    title={story.title}
                  >
                    {story.title}
                  </div>
                  <div className="flex-1" />
                  <div className="flex justify-between text-sm text-gray-400 mt-4">
                    <span>👁️ {story.views || 0} views</span>
                    <span>👍 {story.upvotes} upvotes</span>
                    <span>💬 {story.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
