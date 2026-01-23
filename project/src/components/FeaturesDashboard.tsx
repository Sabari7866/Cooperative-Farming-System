import { useState } from 'react';
import Icon from './Icon';
import WeatherWidget from './WeatherWidget';
import CropPriceTracker from './CropPriceTracker';
import ExpenseTracker from './ExpenseTracker';
import InventoryManagement from './InventoryManagement';
import ActivityTimeline from './ActivityTimeline';
import DataBackup from './DataBackup';
import { ToastContainer, useToast } from './Toast';

export default function FeaturesDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const { toasts, removeToast } = useToast();

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
        { id: 'weather', label: 'Weather', icon: 'Cloud' },
        { id: 'prices', label: 'Market Prices', icon: 'TrendingUp' },
        { id: 'expenses', label: 'Expenses', icon: 'Wallet' },
        { id: 'inventory', label: 'Inventory', icon: 'Package' },
        { id: 'activity', label: 'Activity', icon: 'Activity' },
        { id: 'backup', label: 'Data Backup', icon: 'Database' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                            🚀 Advanced Features Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your farm with powerful tools and real-time insights
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">All Systems Online</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
                <div className="flex overflow-x-auto space-x-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Icon name={tab.icon as any} className="w-5 h-5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Welcome Card */}
                        <div className="lg:col-span-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Welcome to Advanced Features! 🎉</h2>
                                    <p className="text-green-100 mb-4">
                                        Access powerful tools to manage your farm operations efficiently
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <div className="text-sm text-green-100">Real-time Updates</div>
                                            <div className="text-lg font-bold">✓ Active</div>
                                        </div>
                                        <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <div className="text-sm text-green-100">Features Available</div>
                                            <div className="text-lg font-bold">7+</div>
                                        </div>
                                        <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <div className="text-sm text-green-100">Data Security</div>
                                            <div className="text-lg font-bold">✓ Protected</div>
                                        </div>
                                    </div>
                                </div>
                                <Icon name="Sparkles" className="w-24 h-24 opacity-20" />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <WeatherWidget />
                        <CropPriceTracker />
                        <ActivityTimeline />
                        <div className="space-y-6">
                            <DataBackup />
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Icon name="Zap" className="w-6 h-6 text-purple-600" />
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Quick Actions</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setActiveTab('expenses')}
                                        className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all text-left"
                                    >
                                        <Icon name="PlusCircle" className="w-5 h-5 text-green-600 mb-2" />
                                        <div className="text-sm font-semibold text-gray-800 dark:text-white">Add Expense</div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('inventory')}
                                        className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all text-left"
                                    >
                                        <Icon name="Package" className="w-5 h-5 text-purple-600 mb-2" />
                                        <div className="text-sm font-semibold text-gray-800 dark:text-white">Manage Stock</div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('prices')}
                                        className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all text-left"
                                    >
                                        <Icon name="TrendingUp" className="w-5 h-5 text-blue-600 mb-2" />
                                        <div className="text-sm font-semibold text-gray-800 dark:text-white">Check Prices</div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('weather')}
                                        className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all text-left"
                                    >
                                        <Icon name="Cloud" className="w-5 h-5 text-orange-600 mb-2" />
                                        <div className="text-sm font-semibold text-gray-800 dark:text-white">Weather</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'weather' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <WeatherWidget />
                        </div>
                        <div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Weather Tips</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-2">
                                        <Icon name="Sun" className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Sunny days are ideal for harvesting and field preparation
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <Icon name="CloudRain" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Rainy weather is perfect for planting and reduces irrigation needs
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <Icon name="Wind" className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            High winds may affect pesticide application timing
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'prices' && <CropPriceTracker />}
                {activeTab === 'expenses' && <ExpenseTracker />}
                {activeTab === 'inventory' && <InventoryManagement />}
                {activeTab === 'activity' && <ActivityTimeline />}
                {activeTab === 'backup' && <DataBackup />}
            </div>

            {/* Feature Highlights */}
            {activeTab === 'overview' && (
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">✨ Feature Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                icon: 'Cloud',
                                title: 'Live Weather',
                                description: '5-day forecast with farming tips',
                                color: 'blue',
                            },
                            {
                                icon: 'TrendingUp',
                                title: 'Market Prices',
                                description: 'Real-time crop price updates',
                                color: 'green',
                            },
                            {
                                icon: 'Wallet',
                                title: 'Expense Tracker',
                                description: 'Track income and expenses',
                                color: 'purple',
                            },
                            {
                                icon: 'Package',
                                title: 'Inventory',
                                description: 'Manage stock with alerts',
                                color: 'orange',
                            },
                            {
                                icon: 'Activity',
                                title: 'Activity Log',
                                description: 'Track all your actions',
                                color: 'indigo',
                            },
                            {
                                icon: 'Database',
                                title: 'Data Backup',
                                description: 'Export and restore data',
                                color: 'teal',
                            },
                            {
                                icon: 'Zap',
                                title: 'Real-time Updates',
                                description: 'Everything updates live',
                                color: 'yellow',
                            },
                            {
                                icon: 'Shield',
                                title: 'Data Security',
                                description: 'Your data is protected',
                                color: 'red',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                            >
                                <Icon
                                    name={feature.icon as any}
                                    className={`w-8 h-8 text-${feature.color}-600 mb-3`}
                                />
                                <div className="font-semibold text-gray-800 dark:text-white mb-1">{feature.title}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}
