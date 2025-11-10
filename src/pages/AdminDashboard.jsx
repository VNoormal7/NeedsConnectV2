import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, calculatePriority } from '../utils/storage';
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  BarChart3,
  DollarSign,
  Target,
  TrendingUp,
  ShieldCheck,
  ClipboardList,
  Sparkles,
  Layers
} from 'lucide-react';
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
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-hero-gradient opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(76,110,245,0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(249,115,22,0.18),transparent_55%)]" />

      <div className="relative z-10">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/70 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shadow-glow">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Needs Connect</p>
                  <h1 className="text-xl font-semibold text-white">Admin Control Tower</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Live priority recalibration enabled
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:border-danger/50 hover:bg-danger/25 hover:text-white transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-12">
          <section className="glass-panel border border-white/5 p-8">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <span className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.35em] rounded-full border border-white/10 bg-white/5 text-slate-300">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Needs Command
                </span>
                <h2 className="text-3xl font-semibold text-white leading-tight">
                  Direct every charitable mission with clarity, speed, and measurable outcomes.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Monitor funding velocity, balance category portfolios, and adapt priorities in real-time. Every update instantly refreshes helper dashboards and impact reports.
                </p>
              </div>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-3 rounded-xl border border-primary/60 bg-primary/20 px-6 py-3 text-sm font-semibold text-primary shadow-glow hover:bg-primary/30 transition"
              >
                <Plus className="w-5 h-5" />
                Create new mission
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="glass-panel border border-white/5 p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                Total Funded
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">${stats.totalFunded?.toLocaleString() || 0}</p>
              <p className="text-sm text-slate-400 mt-2">Cumulative support captured to date.</p>
            </div>
            <div className="glass-panel border border-white/5 p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                Total Target
                <Target className="w-5 h-5 text-primary" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">${stats.totalTarget?.toLocaleString() || 0}</p>
              <p className="text-sm text-slate-400 mt-2">Financial runway to fully close all needs.</p>
            </div>
            <div className="glass-panel border border-white/5 p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                Total Needs
                <BarChart3 className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{stats.totalNeeds || 0}</p>
              <p className="text-sm text-slate-400 mt-2">Live initiatives under management.</p>
            </div>
            <div className="glass-panel border border-white/5 p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                Completed
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{stats.completedNeeds || 0}</p>
              <p className="text-sm text-slate-400 mt-2">Missions already fully funded.</p>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="glass-panel border border-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">Funding by Category</h3>
                  <p className="text-sm text-slate-400">Track current vs target momentum for each impact domain.</p>
                </div>
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categoryData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#cbd5f5" tick={{ fill: '#cbd5f5', fontSize: 12 }} />
                    <YAxis stroke="#cbd5f5" tick={{ fill: '#cbd5f5', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: 16, border: '1px solid rgba(148, 163, 184, 0.15)' }}
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Legend wrapperStyle={{ color: '#cbd5f5' }} />
                    <Bar dataKey="funded" fill="#4F46E5" name="Funded" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="target" fill="rgba(148,163,184,0.35)" name="Target" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel border border-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">Needs Distribution</h3>
                  <p className="text-sm text-slate-400">Understand load balancing across categories.</p>
                </div>
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryData || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="count"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {(stats.categoryData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: 16, border: '1px solid rgba(148, 163, 184, 0.15)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="glass-panel border border-white/5 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">All Needs</h3>
                <p className="text-sm text-slate-400">Edit, prioritise, and monitor funding velocity in real time.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Urgency</th>
                    <th className="px-6 py-3 font-medium">Priority</th>
                    <th className="px-6 py-3 font-medium">Progress</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {needs.map(need => {
                    const priority = calculatePriority(need);
                    const progress = ((need.currentAmount || 0) / need.targetAmount) * 100;
                    return (
                      <tr key={need.id} className="border-t border-white/5">
                        <td className="px-6 py-5 align-top">
                          <div className="font-semibold text-white">{need.title}</div>
                          <div className="text-xs text-slate-400 mt-2 max-w-lg">{need.description}</div>
                        </td>
                        <td className="px-6 py-5 text-slate-300 align-top">{need.category}</td>
                        <td className="px-6 py-5 text-slate-300 align-top">{need.urgency}/5</td>
                        <td className="px-6 py-5 text-primary font-semibold align-top">{priority}</td>
                        <td className="px-6 py-5 align-top">
                          <div className="text-xs text-slate-400 mb-2">
                            ${(need.currentAmount || 0).toLocaleString()} / ${need.targetAmount.toLocaleString()}
                          </div>
                          <div className="h-2 rounded-full bg-slate-800 w-40">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(need)}
                              className="inline-flex items-center justify-center rounded-lg border border-primary/50 bg-primary/15 p-2 text-primary hover:bg-primary/25 transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(need.id)}
                              className="inline-flex items-center justify-center rounded-lg border border-danger/40 bg-danger/20 p-2 text-danger hover:bg-danger/30 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {showModal && (
            <div className="fixed inset-0 z-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur" onClick={() => setShowModal(false)} />
              <div className="relative gradient-border max-w-lg w-full mx-4">
                <div className="glass-panel rounded-[1.4rem] p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{editingNeed ? 'Update Need' : 'Create Need'}</p>
                      <h3 className="text-2xl font-semibold text-white mt-2">
                        {editingNeed ? 'Edit mission parameters' : 'Launch a new mission'}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="rounded-full border border-white/10 hover:border-danger/40 hover:text-danger transition p-2"
                    >
                      <Trash2 className="w-4 h-4 opacity-0" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        placeholder="e.g., Emergency winter supplies"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        >
                          <option value="Food">Food</option>
                          <option value="Education">Education</option>
                          <option value="Shelter">Shelter</option>
                          <option value="Health">Health</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Urgency (1-5)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={formData.urgency}
                          onChange={(e) => setFormData({ ...formData, urgency: parseInt(e.target.value, 10) })}
                          className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Target Amount ($)</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.targetAmount}
                          onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })}
                          className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Interested Helpers</label>
                        <input
                          type="number"
                          min="0"
                          value={editingNeed ? editingNeed.interestedHelpers || 0 : 0}
                          readOnly
                          className="w-full rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3 text-slate-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                        placeholder="Share context, impact, and timeline for this mission."
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 hover:border-danger/40 hover:bg-danger/20 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold shadow-glow hover:bg-primary/90 transition"
                    >
                      Save mission
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

