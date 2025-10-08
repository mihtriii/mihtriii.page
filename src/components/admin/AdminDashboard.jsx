import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Eye, Download, FileText, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/content/stats?timeframe=${timeframe}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>

        {/* Timeframe selector */}
        <div className="flex justify-end mb-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Presentations</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_presentations || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_views || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_downloads || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Download className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.categories ? Object.keys(stats.categories).length : 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Presentations by Category</h3>

          {stats?.categories && Object.keys(stats.categories).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.categories)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category.replace('-', ' ')}
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (count / Math.max(...Object.values(stats.categories))) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Popular Presentations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Presentations</h3>

          {stats?.popular_presentations && stats.popular_presentations.length > 0 ? (
            <div className="space-y-4">
              {stats.popular_presentations.map((presentation, index) => (
                <div
                  key={presentation.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {presentation.title}
                    </p>
                    <p className="text-xs text-gray-500">by {presentation.author}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {presentation.view_count || 0}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {presentation.download_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No presentations yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recent_activity && stats.recent_activity.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>

          <div className="space-y-3">
            {stats.recent_activity.slice(0, 10).map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      activity.event_type === 'view'
                        ? 'bg-green-100'
                        : activity.event_type === 'download'
                        ? 'bg-blue-100'
                        : activity.event_type === 'upload'
                        ? 'bg-purple-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {activity.event_type === 'view' && <Eye className="h-4 w-4 text-green-600" />}
                    {activity.event_type === 'download' && (
                      <Download className="h-4 w-4 text-blue-600" />
                    )}
                    {activity.event_type === 'upload' && (
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    )}
                    {!['view', 'download', 'upload'].includes(activity.event_type) && (
                      <Calendar className="h-4 w-4 text-gray-600" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {activity.event_type} event
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>

                <span className="text-sm font-semibold text-gray-700">{activity.count} times</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
