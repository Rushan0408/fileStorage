import { Cloud, LogOut, User } from 'lucide-react';
import { Link } from 'react-router';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Cloud Storage</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  {user.username}  {/* Changed from user.name || user.email */}
                </span>
              </div>
            )}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}