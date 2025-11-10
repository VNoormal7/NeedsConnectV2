import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { ShoppingCart, DollarSign, Trash2, Heart, Sparkles, ArrowUpRight } from 'lucide-react';

const Basket = () => {
  const [basket, setBasket] = useState([]);
  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    loadBasket();
    loadNeeds();
  }, []);

  const loadBasket = () => {
    const basketItems = storage.get('basket', []);
    setBasket(basketItems);
  };

  const loadNeeds = () => {
    const allNeeds = storage.get('needs', []);
    setNeeds(allNeeds);
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
    removeFromBasket(needId);
  };

  const getNeedDetails = (needId) => {
    return needs.find(n => n.id === needId);
  };

  const totalInBasket = basket.length;
  const totalTarget = basket.reduce((sum, item) => {
    const need = getNeedDetails(item.id);
    return sum + (need ? need.targetAmount : 0);
  }, 0);

  return (
    <div className="space-y-10">
      <header className="glass-panel border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.35em] text-slate-300">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Mission Basket
          </div>
          <h1 className="text-3xl font-semibold text-white">Curate and activate the missions you’ll back today.</h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Prioritize the causes currently in your basket. Each funding action instantly updates community dashboards and unlocks momentum for coordinators.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Total Needs</span>
            <span className="text-lg font-semibold text-white">{totalInBasket}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Total Target</span>
            <span className="text-lg font-semibold text-primary">${totalTarget.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {basket.length === 0 ? (
        <div className="glass-panel border border-white/5 p-16 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border border-white/10 bg-white/5 text-slate-300 mx-auto mb-6">
            <ShoppingCart className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">Your mission basket is currently empty</h2>
          <p className="text-slate-300">
            Explore Needs to curate urgent missions. They’ll appear here for streamlined funding and coordination.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {basket.map(item => {
            const need = getNeedDetails(item.id);
            if (!need) return null;

            const progress = ((need.currentAmount || 0) / need.targetAmount) * 100;
            const remaining = need.targetAmount - (need.currentAmount || 0);

            return (
              <article key={need.id} className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70 backdrop-blur-xl shadow-card">
                <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
                <div className="relative p-6 md:p-8 space-y-6">
                  <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.35em] text-slate-300">
                        <Sparkles className="w-3 h-3 text-accent" />
                        {need.category}
                      </div>
                      <h3 className="text-2xl font-semibold text-white">{need.title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{need.description}</p>
                    </div>
                    <button
                      onClick={() => removeFromBasket(need.id)}
                      className="inline-flex items-center justify-center rounded-xl border border-danger/40 bg-danger/20 p-2 text-danger hover:bg-danger/30 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                        Funding Progress
                        <DollarSign className="w-4 h-4 text-success" />
                      </div>
                      <div className="mt-3 flex items-end justify-between">
                        <span className="text-xl font-semibold text-white">${(need.currentAmount || 0).toLocaleString()}</span>
                        <span className="text-sm text-slate-400">of ${need.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400 transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {remaining > 0 ? `$${remaining.toLocaleString()} remaining to unlock completion.` : 'Mission fully funded. Thank you!'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-3">
                      <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Timeline</div>
                      <div className="text-sm text-slate-300">Added: {new Date(need.createdAt).toLocaleDateString()}</div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                        <ArrowUpRight className="w-4 h-4 text-primary" />
                        Next Steps
                      </div>
                      <p className="text-sm text-slate-300">
                        Confirm funding amount and share immediate outcomes with coordinators.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const amount = prompt(`Enter funding amount (max $${Math.max(0, remaining)}):`);
                      if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                        const fundAmount = Math.min(parseFloat(amount), Math.max(0, remaining));
                        fundNeed(need.id, fundAmount);
                      }
                    }}
                    disabled={remaining <= 0}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      remaining > 0
                        ? 'bg-gradient-to-r from-success to-emerald-500 text-white shadow-glow hover:from-emerald-500 hover:to-emerald-400'
                        : 'bg-white/5 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    {remaining > 0 ? 'Fuel this mission now' : 'Mission completed'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {basket.length > 0 && (
        <section className="glass-panel border border-white/5 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shadow-glow">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Every contribution activates real change</h2>
              <p className="text-sm text-slate-300 mt-1">
                Fund missions individually or connect with our team for coordinated, bulk funding deployments.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
              {totalInBasket} mission{totalInBasket !== 1 ? 's' : ''} curated
            </span>
            <span className="rounded-xl border border-primary/50 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-primary">
              ${totalTarget.toLocaleString()} potential impact
            </span>
          </div>
        </section>
      )}
    </div>
  );
};

export default Basket;

