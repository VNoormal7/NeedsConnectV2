import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, calculatePriority } from '../utils/storage';
import { Plus, Edit, Trash2, LogOut, BarChart3, DollarSign, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [needs, setNeeds] = useState([]);
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingNeed, setEditingNeed] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Food',
    urgency: 3,
    targetAmount: 0,
    description: ''
  });

  useEffect(() => {
    loadNeeds();
    loadStats();
  }, []);

  const loadNeeds = () => {
    const allNeeds = storage.get('needs', []);
    setNeeds(allNeeds);
  };

  const loadStats = () => {
    const allNeeds = storage.get('needs', []);
    const totalFunded = allNeeds.reduce((sum, need) => sum + (need.currentAmount || 0), 0);
    const totalTarget = allNeeds.reduce((sum, need) => sum + need.targetAmount, 0);
    const completedNeeds = allNeeds.filter(need => need.currentAmount >= need.targetAmount).length;
    
    const categoryMap = {};
    allNeeds.forEach(need => {
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
      count: data.count
    }));

    setStats({
      totalFunded,
      totalTarget,
      completedNeeds,
      totalNeeds: allNeeds.length,
      categoryData
    });
  };

  const handleLogout = () => {
    storage.remove('currentUser');
    navigate('/login');
  };

  const handleCreate = () => {
    setEditingNeed(null);
    setFormData({
      title: '',
      category: 'Food',
      urgency: 3,
      targetAmount: 0,
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (need) => {
    setEditingNeed(need);
    setFormData({
      title: need.title,
      category: need.category,
      urgency: need.urgency,
      targetAmount: need.targetAmount,
      description: need.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this need?')) {
      const updatedNeeds = needs.filter(need => need.id !== id);
      storage.set('needs', updatedNeeds);
      setNeeds(updatedNeeds);
      loadStats();
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || formData.targetAmount <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const allNeeds = storage.get('needs', []);
    let updatedNeeds;

    if (editingNeed) {
      updatedNeeds = allNeeds.map(need =>
        need.id === editingNeed.id
          ? { ...need, ...formData }
          : need
      );
    } else {
      const newId = Math.max(...allNeeds.map(n => n.id), 0) + 1;
      updatedNeeds = [
        ...allNeeds,
        {
          id: newId,
          ...formData,
          currentAmount: 0,
          interestedHelpers: 0,
          createdAt: new Date().toISOString()
        }
      ];
    }

    storage.set('needs', updatedNeeds);
    setNeeds(updatedNeeds);
    setShowModal(false);
    loadStats();
  };

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const getDaysOld = (createdAt) => Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Needs Management</h2>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Need
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Funded</p>
                <p className="text-2xl font-bold text-gray-800">${stats.totalFunded?.toLocaleString() || 0}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Target</p>
                <p className="text-2xl font-bold text-gray-800">${stats.totalTarget?.toLocaleString() || 0}</p>
              </div>
              <Target className="w-10 h-10 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Needs</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalNeeds || 0}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completedNeeds || 0}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Funding by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.categoryData || []}>
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Needs Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(stats.categoryData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">All Needs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {needs.map(need => {
                  const priority = calculatePriority(need);
                  const progress = ((need.currentAmount || 0) / need.targetAmount) * 100;
                  return (
                    <tr key={need.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{need.title}</div>
                        <div className="text-sm text-gray-500">{need.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{need.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{need.urgency}/5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{priority}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 mb-1">
                          ${(need.currentAmount || 0).toLocaleString()} / ${need.targetAmount.toLocaleString()}
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(need)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(need.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {editingNeed ? 'Edit Need' : 'Create New Need'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Food">Food</option>
                    <option value="Education">Education</option>
                    <option value="Shelter">Shelter</option>
                    <option value="Health">Health</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows="3"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

