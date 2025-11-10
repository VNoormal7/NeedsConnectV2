import { useState, useEffect, useMemo } from 'react';
import { storage, calculatePriority } from '../utils/storage';
import { DollarSign, Users, Clock, Plus, ShoppingCart, Heart, Flame, Sparkles, Target, Gauge } from 'lucide-react';

const NeedsList = () => {
  const [needs, setNeeds] = useState([]);
  const [basket, setBasket] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  const summary = useMemo(() => {
    const totalNeeds = needs.length;
    const totalTarget = needs.reduce((sum, need) => sum + need.targetAmount, 0);
    const currentRaised = needs.reduce((sum, need) => sum + (need.currentAmount || 0), 0);
    const avgUrgency = totalNeeds ? (needs.reduce((sum, need) => sum + need.urgency, 0) / totalNeeds).toFixed(1) : 0;
    return {
      totalNeeds,
      totalTarget,
      currentRaised,
      avgUrgency,
    };
  }, [needs]);

  useEffect(() => {
    loadNeeds();
    loadBasket();
  }, []);

  const loadNeeds = () => {
    const allNeeds = storage.get('needs', []);
    setNeeds(allNeeds);
  };

  const loadBasket = () => {
    const basketItems = storage.get('basket', []);
    setBasket(basketItems);
  };

  const addToBasket = (need) => {
    const basketItems = storage.get('basket', []);
    if (!basketItems.find(item => item.id === need.id)) {
      basketItems.push(need);
      storage.set('basket', basketItems);
      setBasket(basketItems);
      
      // Update interested helpers count
      const allNeeds = storage.get('needs', []);
      const updatedNeeds = allNeeds.map(n => 
        n.id === need.id ? { ...n, interestedHelpers: (n.interestedHelpers || 0) + 1 } : n
      );
      storage.set('needs', updatedNeeds);
      setNeeds(updatedNeeds);
    }
  };

  const removeFromBasket = (needId) => {
    const basketItems = basket.filter(item => item.id !== needId);
    storage.set('basket', basketItems);
    setBasket(basketItems);
  };

  const fundNeed = (needId, amount) => {
    const allNeeds = storage.get('needs', []);
    const updatedNeeds = allNeeds.map(need =>
      need.id === needId
        ? { ...need, currentAmount: Math.min((need.currentAmount || 0) + amount, need.targetAmount) }
        : need
    );
    storage.set('needs', updatedNeeds);
    setNeeds(updatedNeeds);
    
    // Remove from basket if funded
    removeFromBasket(needId);
  };

  const filteredNeeds = needs.filter(need => {
    if (filter === 'all') return true;
    return need.category === filter;
  });

  const sortedNeeds = [...filteredNeeds].sort((a, b) => {
    if (sortBy === 'priority') {
      return calculatePriority(b) - calculatePriority(a);
    } else if (sortBy === 'urgency') {
      return b.urgency - a.urgency;
    } else if (sortBy === 'amount') {
      return b.targetAmount - a.targetAmount;
    }
    return 0;
  });

  const categories = ['all', 'Food', 'Education', 'Shelter', 'Health'];
  const isInBasket = (needId) => basket.some(item => item.id === needId);
  const getDaysOld = (createdAt) => Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 border border-white/5">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            Live Needs
            <Flame className="w-4 h-4 text-accent" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.totalNeeds}</p>
          <p className="text-sm text-slate-400 mt-2">Active opportunities ready for support.</p>
        </div>
        <div className="glass-panel p-6 border border-white/5">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            Target Funding
            <Target className="w-4 h-4 text-primary" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">${summary.totalTarget.toLocaleString()}</p>
          <p className="text-sm text-slate-400 mt-2">Combined goal across all needs.</p>
        </div>
        <div className="glass-panel p-6 border border-white/5">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            Raised So Far
            <DollarSign className="w-4 h-4 text-success" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">${summary.currentRaised.toLocaleString()}</p>
          <p className="text-sm text-slate-400 mt-2">Direct impact from the community.</p>
        </div>
        <div className="glass-panel p-6 border border-white/5">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
            Avg. Urgency
            <Gauge className="w-4 h-4 text-warning" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{summary.avgUrgency}</p>
          <p className="text-sm text-slate-400 mt-2">Stay focused on the high-intensity needs.</p>
        </div>
      </div>

      <div className="glass-panel p-6 border border-white/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Curate the needs you care about</h2>
            <p className="text-sm text-slate-400 mt-2">
              Filter by category, sort by urgency or financial target, and track momentum instantly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-900/80 border border-white/10 text-sm rounded-xl px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900/80 border border-white/10 text-sm rounded-xl px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              <option value="priority">Sort by Priority</option>
              <option value="urgency">Sort by Urgency</option>
              <option value="amount">Sort by Target Amount</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {sortedNeeds.map(need => {
          const priority = calculatePriority(need);
          const daysOld = getDaysOld(need.createdAt);
          const progress = ((need.currentAmount || 0) / need.targetAmount) * 100;
          const inBasket = isInBasket(need.id);
          const remaining = need.targetAmount - (need.currentAmount || 0);

          return (
            <article
              key={need.id}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70 backdrop-blur-xl shadow-card hover:shadow-glow transition"
            >
              <div className="absolute -top-20 -right-20 h-56 w-56 bg-primary/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-24 h-60 w-60 bg-accent/10 rounded-full blur-3xl" />
              <div className="relative p-6 md:p-8 space-y-6">
                <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.35em] text-slate-300">
                      <Sparkles className="w-3 h-3 text-accent" />
                      {need.category}
                    </div>
                    <h3 className="text-2xl font-semibold text-white leading-snug">{need.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-xl">{need.description}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Priority Score</span>
                    <p className="text-3xl font-semibold text-primary">{priority}</p>
                    <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
                      <Flame className="w-4 h-4 text-accent" />
                      Urgency {need.urgency}/5
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                      Funding Progress
                      <DollarSign className="w-4 h-4 text-success" />
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-xl font-semibold text-white">${(need.currentAmount || 0).toLocaleString()}</p>
                      <p className="text-sm text-slate-400">of ${need.targetAmount.toLocaleString()}</p>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400 transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      {remaining > 0 ? `$${remaining.toLocaleString()} needed to complete.` : 'Fully funded!'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                      Momentum
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span className="inline-flex items-center gap-2">
                        <Clock className="w-4 h-4 text-warning" />
                        {daysOld} days active
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        {need.interestedHelpers || 0} helpers tracking
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div className="rounded-lg bg-slate-900/70 border border-white/5 px-3 py-2">
                        <p className="uppercase tracking-[0.3em] text-[10px]">Created</p>
                        <p className="mt-1 font-semibold text-white">
                          {new Date(need.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-900/70 border border-white/5 px-3 py-2">
                        <p className="uppercase tracking-[0.3em] text-[10px]">Remaining</p>
                        <p className="mt-1 font-semibold text-white">
                          {remaining > 0 ? `$${remaining.toLocaleString()}` : 'Complete'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <footer className="flex flex-col sm:flex-row gap-3">
                  {!inBasket ? (
                    <button
                      onClick={() => addToBasket(need)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/20 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/30 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add to mission list
                    </button>
                  ) : (
                    <button
                      onClick={() => removeFromBasket(need.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-danger/40 hover:bg-danger/20 hover:text-white transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Remove from basket
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const amount = prompt(`Enter funding amount (max $${Math.max(0, remaining)}):`);
                      if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                        fundNeed(need.id, Math.min(parseFloat(amount), Math.max(0, remaining)));
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-success to-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:shadow-glow transition"
                    disabled={remaining <= 0}
                  >
                    <DollarSign className="w-4 h-4" />
                    {remaining > 0 ? 'Fund this need' : 'Fully funded'}
                  </button>
                </footer>
              </div>
            </article>
          );
        })}
      </div>

      {sortedNeeds.length === 0 && (
        <div className="glass-panel p-16 text-center border border-white/5">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-slate-300 text-lg">No needs match your filters right now. Adjust filters to explore more impact opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default NeedsList;

