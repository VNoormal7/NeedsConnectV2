import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { ShoppingCart, DollarSign, Trash2, Heart } from 'lucide-react';

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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-indigo-600" />
          My Basket
        </h1>
        {totalInBasket > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Needs: {totalInBasket}</p>
            <p className="text-lg font-semibold text-indigo-600">Total Target: ${totalTarget.toLocaleString()}</p>
          </div>
        )}
      </div>

      {basket.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your basket is empty</h2>
          <p className="text-gray-500 mb-6">Add needs to your basket to fund them later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {basket.map(item => {
            const need = getNeedDetails(item.id);
            if (!need) return null;
            
            const progress = (need.currentAmount / need.targetAmount) * 100;
            const remaining = need.targetAmount - need.currentAmount;

            return (
              <div key={need.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{need.title}</h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                      {need.category}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromBasket(need.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
                  {remaining > 0 && (
                    <p className="text-xs text-gray-500">${remaining.toLocaleString()} remaining</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    const amount = prompt(`Enter funding amount (max $${remaining}):`);
                    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
                      const fundAmount = Math.min(parseFloat(amount), remaining);
                      fundNeed(need.id, fundAmount);
                    }
                  }}
                  disabled={remaining <= 0}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    remaining > 0
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  {remaining > 0 ? 'Fund This Need' : 'Fully Funded'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {basket.length > 0 && (
        <div className="mt-8 bg-indigo-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-indigo-600" fill="currentColor" />
            <h2 className="text-xl font-semibold text-gray-800">Make a Difference</h2>
          </div>
          <p className="text-gray-600 mb-4">
            You have {totalInBasket} need{totalInBasket !== 1 ? 's' : ''} in your basket. 
            Fund them individually or contact us for bulk funding options.
          </p>
        </div>
      )}
    </div>
  );
};

export default Basket;

