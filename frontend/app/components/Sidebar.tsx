import { Home, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router';

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
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
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

      {/* Storage stats removed - add back when backend endpoint is ready */}
    </aside>
  );
}