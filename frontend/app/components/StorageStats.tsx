import { useEffect, useState } from 'react';
import { storageAPI } from '~/lib/api';
import { HardDrive } from 'lucide-react';
import type { StorageStats as StorageStatsType } from '~/lib/types';

export default function StorageStats() {
  const [stats, setStats] = useState<StorageStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await storageAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading || !stats) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-2 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
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
              stats.usagePercentage > 90 ? 'bg-red-600' :
              stats.usagePercentage > 75 ? 'bg-yellow-600' :
              'bg-blue-600'
            }`}
            style={{ width: `${Math.min(stats.usagePercentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Available</span>
          <span className="font-medium">{formatBytes(stats.storageQuota)}</span>
        </div>

        <div className="pt-3 mt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Files</span>
              <p className="font-semibold text-gray-900">{stats.fileCount}</p>
            </div>
            <div>
              <span className="text-gray-600">Folders</span>
              <p className="font-semibold text-gray-900">{stats.folderCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}