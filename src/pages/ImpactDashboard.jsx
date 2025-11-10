import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Target, Heart, Activity, LineChart as LineIcon } from 'lucide-react';

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
    <div className="space-y-10">
      <header className="glass-panel border border-white/5 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.35em] text-slate-300">
              <Activity className="w-4 h-4 text-success" />
              Impact Intelligence
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
              A living pulse of community impact and funding momentum.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track how support flows into each cause, celebrate completed missions, and surface where focused energy can transform outcomes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-300">
            <div className="rounded-xl border border-white/5 bg-white/10 px-4 py-3">
              <span className="text-xs uppercase tracking-[0.35em] text-slate-400">Updated</span>
              <p className="text-lg font-semibold text-white">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/10 px-4 py-3">
              <span className="text-xs uppercase tracking-[0.35em] text-slate-400">Data Mode</span>
              <p className="text-lg font-semibold text-white">Realtime</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="glass-panel border border-white/5 p-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
            Total Funded
            <DollarSign className="w-5 h-5 text-success" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">${stats.totalFunded.toLocaleString()}</p>
          <p className="text-sm text-slate-400 mt-2">Across every campaign in motion.</p>
        </div>
        <div className="glass-panel border border-white/5 p-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
            Total Needs
            <Target className="w-5 h-5 text-primary" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{stats.totalNeeds}</p>
          <p className="text-sm text-slate-400 mt-2">Active missions receiving support.</p>
        </div>
        <div className="glass-panel border border-white/5 p-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
            Completed Needs
            <Heart className="w-5 h-5 text-red-400" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{stats.completedNeeds}</p>
          <p className="text-sm text-slate-400 mt-2">Fully funded causes celebrated.</p>
        </div>
        <div className="glass-panel border border-white/5 p-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
            Completion Rate
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {stats.totalNeeds > 0 ? ((stats.completedNeeds / stats.totalNeeds) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm text-slate-400 mt-2">Portion of missions reaching 100% funding.</p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-panel border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Funding by Category</h2>
              <p className="text-sm text-slate-400">Compare raised vs target amounts per impact area.</p>
            </div>
            <LineIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#cbd5f5" tick={{ fill: '#cbd5f5', fontSize: 12 }} />
                <YAxis stroke="#cbd5f5" tick={{ fill: '#cbd5f5', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: 16, border: '1px solid rgba(148, 163, 184, 0.15)' }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Legend wrapperStyle={{ color: '#cbd5f5' }} />
                <Bar dataKey="funded" fill="#4F46E5" name="Funded" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="rgba(148,163,184,0.4)" name="Target" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Needs by Category</h2>
              <p className="text-sm text-slate-400">Visualize how efforts are distributed across domains.</p>
            </div>
            <Activity className="w-6 h-6 text-success" />
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stats.categoryData.map((entry, index) => (
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

      <section className="glass-panel border border-white/5 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Category Deep Dive</h2>
            <p className="text-sm text-slate-400">Funding velocity and completion percentage by focus area.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                <th className="py-3 pr-6 font-medium">Category</th>
                <th className="py-3 pr-6 font-medium">Needs</th>
                <th className="py-3 pr-6 font-medium">Funded</th>
                <th className="py-3 pr-6 font-medium">Target</th>
                <th className="py-3 pr-6 font-medium">Completion</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.categoryData.map((cat) => (
                <tr key={cat.name} className="border-t border-white/5">
                  <td className="py-4 pr-6 font-semibold text-white">{cat.name}</td>
                  <td className="py-4 pr-6 text-slate-300">{cat.count}</td>
                  <td className="py-4 pr-6 text-slate-300">${cat.funded.toLocaleString()}</td>
                  <td className="py-4 pr-6 text-slate-300">${cat.target.toLocaleString()}</td>
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400"
                          style={{ width: `${Math.min(parseFloat(cat.completion), 100)}%` }}
                        />
                      </div>
                      <span className="text-slate-300 text-sm">{cat.completion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ImpactDashboard;

