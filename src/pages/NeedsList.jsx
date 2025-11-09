import { useState, useEffect } from 'react';
import { storage, calculatePriority } from '../utils/storage';
import { DollarSign, Users, Clock, Plus, ShoppingCart, Heart } from 'lucide-react';

const NeedsList = () => {
  const [needs, setNeeds] = useState([]);
  const [basket, setBasket] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

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
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Browse Needs</h1>
        <div className="flex gap-4 flex-wrap">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="priority">Sort by Priority</option>
            <option value="urgency">Sort by Urgency</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNeeds.map(need => {
          const priority = calculatePriority(need);
          const daysOld = getDaysOld(need.createdAt);
          const progress = (need.currentAmount / need.targetAmount) * 100;
          const inBasket = isInBasket(need.id);

          return (
            <div key={need.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{need.title}</h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                    {need.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-600">Priority: {priority}</div>
                  <div className="text-xs text-gray-500">Urgency: {need.urgency}/5</div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{need.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold">
                    ${need.currentAmount.toLocaleString()} / ${need.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {daysOld} days old
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {need.interestedHelpers || 0} helpers
                </div>
              </div>

              <div className="flex gap-2">
                {!inBasket ? (
                  <button
                    onClick={() => addToBasket(need)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Basket
                  </button>
                ) : (
                  <button
                    onClick={() => removeFromBasket(need.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    In Basket
                  </button>
                )}
                <button
                  onClick={() => {
                    const amount = prompt(`Enter funding amount (max $${need.targetAmount - need.currentAmount}):`);
                    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                      fundNeed(need.id, parseFloat(amount));
                    }
                  }}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <DollarSign className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {sortedNeeds.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No needs found in this category</p>
        </div>
      )}
    </div>
  );
};

export default NeedsList;

