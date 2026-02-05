import { Outlet, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout, getUser } from '~/lib/auth';
import Navbar from '~/components/Navbar';
import Sidebar from '~/components/Sidebar';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}