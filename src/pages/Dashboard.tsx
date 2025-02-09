import React from 'react';
import { BarChart, Users, Film, TrendingUp } from 'lucide-react';
import { animeApi, Anime } from '../lib/api';
import { toast } from 'react-hot-toast';

const StatCard = ({ icon: Icon, title, value, change }: { icon: any, title: string, value: string, change: string }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="bg-indigo-100 p-3 rounded-full">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
    </div>
    <p className="text-green-600 text-sm mt-4">{change}</p>
  </div>
);

const RecentAnime = ({ animes }: { animes: Anime[] }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mt-8">
    <h2 className="text-xl font-semibold mb-4">Recent Anime</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {animes.map((anime) => (
            <tr key={anime.ID}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {anime.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {anime.rating}/10
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(anime.created_at!).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    totalAnime: 0,
    totalViews: 0,
    avgRating: 0,
  });
  const [recentAnime, setRecentAnime] = React.useState<Anime[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await animeApi.getAll({ 
          limit: 5,
          sort: 'created_at',
          order: 'desc'
        });
        setRecentAnime(response.data.items);
        
        // Calculate stats
        const allAnime = response.data.items;
        const totalAnime = response.data.pagination.total;
        const avgRating = allAnime.reduce((acc, curr) => acc + curr.rating, 0) / totalAnime;
        
        setStats({
          totalAnime,
          totalViews: Math.floor(Math.random() * 100000), // Mock data
          avgRating: Math.round(avgRating * 10) / 10,
        });
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Film}
          title="Total Anime"
          value={stats.totalAnime.toString()}
          change="+12% from last month"
        />
        <StatCard
          icon={Users}
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          change="+23% from last month"
        />
        <StatCard
          icon={BarChart}
          title="Average Rating"
          value={`${stats.avgRating}/10`}
          change="+0.5 from last month"
        />
        <StatCard
          icon={TrendingUp}
          title="Engagement Rate"
          value="78%"
          change="+7% from last week"
        />
      </div>

      <RecentAnime animes={recentAnime} />
    </div>
  );
};

export default Dashboard;