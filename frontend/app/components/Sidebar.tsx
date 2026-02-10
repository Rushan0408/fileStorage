import { useState, useEffect } from 'react';
import { Home, Search, HardDrive } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { storageAPI } from '~/lib/api';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    { path: '/dashboard', icon: Home, label: 'My Files' },
    { path: '/dashboard/search', icon: Search, label: 'Search' },
  ];

  return (
  <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>

    <div className="px-6 mt-auto mb-20">
      <StorageStats />
    </div>
    </aside>
  );
}

function StorageStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await storageAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
      // Don't show stats if API fails
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const usagePercentage = (stats.storageUsed / stats.storageQuota) * 100;

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <HardDrive className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-gray-900">Storage</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Used</span>
          <span className="font-medium">{formatBytes(stats.storageUsed)}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              usagePercentage > 90
                ? 'bg-red-600'
                : usagePercentage > 75
                ? 'bg-yellow-600'
                : 'bg-blue-600'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Available</span>
          <span className="font-medium">{formatBytes(stats.storageQuota)}</span>
        </div>
      </div>
    </div>
  );
}