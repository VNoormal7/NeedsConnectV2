import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { Heart } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      const role = username.toLowerCase() === 'admin' ? 'admin' : 'helper';
      storage.set('currentUser', { username, role });
      navigate(role === 'admin' ? '/admin' : '/helper');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-indigo-600" fill="currentColor" />
          <h1 className="text-3xl font-bold text-gray-800 ml-3">Needs Connect</h1>
        </div>
        <p className="text-center text-gray-600 mb-8">Charity Platform</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username (admin = manager, others = helper)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              Use "admin" for manager role, any other name for helper role
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

