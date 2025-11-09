import { Outlet, Link, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { Home, TrendingUp, Users, LogOut, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

const HelperDashboard = () => {
  const navigate = useNavigate();
  const [basketCount, setBasketCount] = useState(0);

  useEffect(() => {
    const basket = storage.get('basket', []);
    setBasketCount(basket.length);
    
    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedBasket = storage.get('basket', []);
      setBasketCount(updatedBasket.length);
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    storage.remove('currentUser');
    navigate('/login');
  };

  const user = storage.get('currentUser');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/helper" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
                <Home className="w-6 h-6" />
                <span>Needs Connect</span>
              </Link>
              <div className="flex space-x-4">
                <Link
                  to="/helper"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Browse Needs
                </Link>
                <Link
                  to="/helper/impact"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Impact
                </Link>
                <Link
                  to="/volunteers"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Volunteers
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/helper/basket"
                className="relative flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
              >
                <ShoppingCart className="w-5 h-5" />
                {basketCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {basketCount}
                  </span>
                )}
              </Link>
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default HelperDashboard;

