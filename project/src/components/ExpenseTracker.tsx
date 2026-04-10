import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { useToast } from './Toast';

interface Expense {
    id: string;
    category: string;
    amount: number;
    description: string;
    date: string;
    type: 'expense' | 'income';
}

const STORAGE_KEY = 'uzhavan_x_expenses';

export default function ExpenseTracker() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        category: 'Seeds',
        amount: '',
        description: '',
        type: 'expense' as 'expense' | 'income',
    });
    const { addToast } = useToast();

    const categories = {
        expense: ['Seeds', 'Fertilizers', 'Pesticides', 'Labor', 'Equipment', 'Irrigation', 'Other'],
        income: ['Crop Sale', 'Product Sale', 'Rental Income', 'Other'],
    };

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setExpenses(JSON.parse(saved));
        }
    }, []);

    const saveExpenses = (newExpenses: Expense[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
        setExpenses(newExpenses);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            addToast({
                type: 'error',
                title: 'Invalid Amount',
                message: 'Please enter a valid amount',
            });
            return;
        }

        const newExpense: Expense = {
            id: Date.now().toString(),
            category: formData.category,
            amount: parseFloat(formData.amount),
            description: formData.description,
            date: new Date().toISOString(),
            type: formData.type,
        };

        const updated = [newExpense, ...expenses];
        saveExpenses(updated);

        addToast({
            type: 'success',
            title: 'Added Successfully',
            message: `${formData.type === 'expense' ? 'Expense' : 'Income'} recorded`,
        });

        setFormData({ category: 'Seeds', amount: '', description: '', type: 'expense' });
        setShowForm(false);
    };

    const deleteExpense = (id: string) => {
        const updated = expenses.filter((e) => e.id !== id);
        saveExpenses(updated);
        addToast({
            type: 'success',
            title: 'Deleted',
            message: 'Entry removed successfully',
        });
    };

    const totalIncome = expenses.filter((e) => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = expenses.filter((e) => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalIncome - totalExpense;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Icon name="Wallet" className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Expense Tracker</h3>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Icon name="Plus" className="w-4 h-4" />
                    <span>Add Entry</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-2">
                        <Icon name="TrendingUp" className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Income</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center space-x-2 mb-2">
                        <Icon name="TrendingDown" className="w-5 h-5 text-red-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Expenses</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</div>
                </div>

                <div
                    className={`p-4 rounded-lg border ${netProfit >= 0
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                        }`}
                >
                    <div className="flex items-center space-x-2 mb-2">
                        <Icon name="DollarSign" className={`w-5 h-5 ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Net Profit</span>
                    </div>
                    <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        ₹{Math.abs(netProfit).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: e.target.value as 'expense' | 'income',
                                        category: e.target.value === 'expense' ? 'Seeds' : 'Crop Sale',
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                            >
                                {categories[formData.type].map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (₹)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="Enter amount"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        />
                    </div>

                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Add Entry
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Expenses List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {expenses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Icon name="Inbox" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No entries yet. Add your first transaction!</p>
                    </div>
                ) : (
                    expenses.map((expense) => (
                        <div
                            key={expense.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div className="flex items-center space-x-3 flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${expense.type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                                        }`}
                                >
                                    <Icon
                                        name={expense.type === 'income' ? 'ArrowDownCircle' : 'ArrowUpCircle'}
                                        className={`w-5 h-5 ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-gray-800 dark:text-white">{expense.category}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {expense.description && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{expense.description}</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span
                                    className={`text-lg font-bold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toLocaleString()}
                                </span>
                                <button
                                    onClick={() => deleteExpense(expense.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Icon name="Trash2" className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
