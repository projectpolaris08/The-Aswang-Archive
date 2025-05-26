import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const CPM_RATE = 0.5; // $0.50 per 1000 views (placeholder)

function getMonthRange(month: string) {
  const [year, m] = month.split("-").map(Number);
  const start = new Date(year, m - 1, 1);
  const end = new Date(year, m, 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

const WriterPerformancePanel: React.FC = () => {
  const [writers, setWriters] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch all writers
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username");
      // Fetch all stories
      const { data: allStories } = await supabase
        .from("stories")
        .select("id, user_id, title, views, created_at");
      // Fetch all tips
      const { data: allTips } = await supabase
        .from("tips")
        .select("id, writer_id, amount, created_at");
      setWriters(profiles || []);
      setStories(allStories || []);
      setTips(allTips || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter stories and tips for the selected month
  const { start, end } = getMonthRange(month);
  const monthStories = stories.filter(
    (s) => s.created_at >= start && s.created_at < end
  );
  const monthTips = tips.filter(
    (t) => t.created_at >= start && t.created_at < end
  );

  // Helper: get stats for a writer
  function getStats(writer: any) {
    const userStories = stories.filter((s) => s.user_id === writer.id);
    const userMonthStories = monthStories.filter(
      (s) => s.user_id === writer.id
    );
    const published = userStories.length;
    const monthlyViews = userMonthStories.reduce(
      (sum, s) => sum + (s.views || 0),
      0
    );
    const trending = userStories.reduce(
      (max, s) => (s.views > (max?.views || 0) ? s : max),
      null
    );
    // Real tips for this writer this month
    const userMonthTips = monthTips.filter((t) => t.writer_id === writer.id);
    const totalTips = userMonthTips.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );
    const earnings = ((monthlyViews / 1000) * CPM_RATE + totalTips).toFixed(2);
    return {
      published,
      monthlyViews,
      totalTips,
      earnings,
      trending,
    };
  }

  // Month options for filter (last 12 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  return (
    <div className="bg-zinc-800 rounded-lg shadow p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h3 className="text-2xl font-bold text-white">Writer Performance</h3>
        <div>
          <label className="text-gray-300 mr-2">Month:</label>
          <select
            className="px-3 py-2 rounded bg-zinc-900 text-gray-100"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Writer
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Stories Published
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Monthly Views
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Total Tips
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Earnings (Month)
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Trending Story
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">
                  Loading performance data...
                </td>
              </tr>
            ) : writers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">
                  No writers found.
                </td>
              </tr>
            ) : (
              writers.map((writer: any) => {
                const stats = getStats(writer);
                return (
                  <tr
                    key={writer.id}
                    className="hover:bg-zinc-700 transition-colors"
                  >
                    <td className="px-4 py-2 text-gray-100">
                      {writer.username}
                    </td>
                    <td className="px-4 py-2 text-gray-100">
                      {stats.published}
                    </td>
                    <td className="px-4 py-2 text-gray-100">
                      {stats.monthlyViews}
                    </td>
                    <td className="px-4 py-2 text-gray-100">
                      ${stats.totalTips}
                    </td>
                    <td className="px-4 py-2 text-gray-100">
                      ${stats.earnings}
                    </td>
                    <td className="px-4 py-2 text-gray-100">
                      {stats.trending ? (
                        <a
                          href={`/stories/${stats.trending.id}`}
                          className="text-blue-400 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {stats.trending.title}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700">
                        View
                      </button>
                      <button className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700">
                        Flag
                      </button>
                      <button className="px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700">
                        Email
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WriterPerformancePanel;
