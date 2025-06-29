// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import { getExpenses, createExpense, deleteExpense } from './API/api.js';
import { IndianRupee } from 'lucide-react';
function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: '', amount: '', category: 'Other' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newExpense = await createExpense(form);
      setExpenses([newExpense, ...expenses]);
      setForm({ description: '', amount: '', category: 'Other' });
      setError('');
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent mb-4">
            💰 Expense Tracker
          </h1>
          <p className="text-slate-300 text-lg">Manage your finances with style</p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <input
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-700/70"
                type="text"
                placeholder="Enter expense description"
                name="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Amount</label>
              <input
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-700/70"
                type="number"
                placeholder="0.00"
                name="amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Category</label>
              <select
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-700/70"
                name="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'].map((c) => (
                  <option key={c} value={c} className="bg-slate-800">{c}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg"
            >
              Add Expense
            </button>
          </form>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-900/50 border border-red-700/50 text-red-200 p-4 rounded-xl text-center backdrop-blur-sm">
              {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <span className="text-slate-300 ml-3">Loading expenses...</span>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4 sm:gap-6">
              {expenses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-slate-400 text-lg">No expenses yet. Add your first expense above!</p>
                </div>
              ) : (
                expenses.map((exp) => (
                  <div 
                    key={exp._id} 
                    className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 shadow-lg hover:bg-slate-800/60 transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-2">{exp.description}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200 border border-blue-800/50">
                            {exp.category}
                          </span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
                            <IndianRupee className='text-white' />
                            <p>
                            {exp.amount.toFixed(2)}

                            </p>
                            
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(exp._id)} 
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-md sm:ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;