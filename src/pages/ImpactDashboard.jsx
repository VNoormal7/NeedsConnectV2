import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Target, Heart } from 'lucide-react';

const ImpactDashboard = () => {
  const [stats, setStats] = useState({
    totalFunded: 0,
    totalNeeds: 0,
    completedNeeds: 0,
    categoryData: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const needs = storage.get('needs', []);
    const totalFunded = needs.reduce((sum, need) => sum + (need.currentAmount || 0), 0);
    const completedNeeds = needs.filter(need => need.currentAmount >= need.targetAmount).length;
    
    const categoryMap = {};
    needs.forEach(need => {
      if (!categoryMap[need.category]) {
        categoryMap[need.category] = { funded: 0, target: 0, count: 0 };
      }
      categoryMap[need.category].funded += need.currentAmount || 0;
      categoryMap[need.category].target += need.targetAmount;
      categoryMap[need.category].count += 1;
    });

    const categoryData = Object.entries(categoryMap).map(([name, data]) => ({
      name,
      funded: data.funded,
      target: data.target,
      count: data.count,
      completion: ((data.funded / data.target) * 100).toFixed(1)
    }));

    setStats({
      totalFunded,
      totalNeeds: needs.length,
      completedNeeds,
      categoryData
    });
  };

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Impact Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Funded</p>
              <p className="text-2xl font-bold text-gray-800">${stats.totalFunded.toLocaleString()}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Needs</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalNeeds}</p>
            </div>
            <Target className="w-10 h-10 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completedNeeds}</p>
            </div>
            <Heart className="w-10 h-10 text-red-500" fill="currentColor" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalNeeds > 0 ? ((stats.completedNeeds / stats.totalNeeds) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Funding by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="funded" fill="#4F46E5" name="Funded" />
              <Bar dataKey="target" fill="#E5E7EB" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Needs by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Needs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funded</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.categoryData.map((cat, index) => (
                <tr key={cat.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cat.funded.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cat.target.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${Math.min(parseFloat(cat.completion), 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-700">{cat.completion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;

