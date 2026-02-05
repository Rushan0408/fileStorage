import { Link } from 'react-router';
import { Cloud } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Cloud className="w-24 h-24 mx-auto text-blue-600 mb-8" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Cloud Storage
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Store, share, and access your files from anywhere
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}