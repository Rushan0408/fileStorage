import { Outlet, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout, getUser } from '~/lib/auth';
import Navbar from '~/components/Navbar';
import Sidebar from '~/components/Sidebar';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issue by only running on client
  useEffect(() => {
    setIsClient(true);
    
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      const userData = getUser();
      if (userData) {
        setUser(userData);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated() || !user) {
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