import { useState, useEffect } from 'react';
import Icon from './Icon';

interface Activity {
    id: string;
    type: 'product' | 'job' | 'worker' | 'expense' | 'inventory' | 'system';
    action: string;
    description: string;
    timestamp: string;
    icon: string;
    color: string;
}

const STORAGE_KEY = 'agrismart_activity';

export default function ActivityTimeline() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [filter, setFilter] = useState<'all' | Activity['type']>('all');

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setActivities(JSON.parse(saved));
        } else {
            // Initialize with sample activities
            const now = new Date();
            const sample: Activity[] = [
                {
                    id: '1',
                    type: 'product',
                    action: 'Product Added',
                    description: 'Added "Fresh Tomatoes" to marketplace',
                    timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
                    icon: 'ShoppingCart',
                    color: 'green',
                },
                {
                    id: '2',
                    type: 'job',
                    action: 'Job Posted',
                    description: 'Posted "Rice Harvesting" job',
                    timestamp: new Date(now.getTime() - 15 * 60000).toISOString(),
                    icon: 'Briefcase',
                    color: 'blue',
                },
                {
                    id: '3',
                    type: 'expense',
                    action: 'Expense Recorded',
                    description: 'Added fertilizer expense of ₹1,500',
                    timestamp: new Date(now.getTime() - 30 * 60000).toISOString(),
                    icon: 'DollarSign',
                    color: 'red',
                },
            ];
            setActivities(sample);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
        }
    }, []);

    // Function to add new activity (can be called from other components)
    const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
        const newActivity: Activity = {
            ...activity,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
        };
        const updated = [newActivity, ...activities].slice(0, 50); // Keep last 50
        setActivities(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    // Expose addActivity globally for other components
    useEffect(() => {
        (window as any).addActivity = addActivity;
    }, [activities]);

    const clearActivities = () => {
        setActivities([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const getTimeAgo = (timestamp: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const filteredActivities =
        filter === 'all' ? activities : activities.filter((a) => a.type === filter);

    const colorClasses = {
        green: 'bg-green-100 text-green-600 dark:bg-green-900/20',
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20',
        red: 'bg-red-100 text-red-600 dark:bg-red-900/20',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20',
        orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20',
        gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Icon name="Activity" className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h3>
                </div>
                <button
                    onClick={clearActivities}
                    className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'product', 'job', 'expense', 'inventory', 'worker', 'system'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as typeof filter)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${filter === f
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredActivities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Icon name="Inbox" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No recent activities</p>
                    </div>
                ) : (
                    filteredActivities.map((activity, index) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                            {/* Timeline line */}
                            {index < filteredActivities.length - 1 && (
                                <div className="absolute left-[27px] mt-12 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                            )}

                            {/* Icon */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses[activity.color as keyof typeof colorClasses]
                                    }`}
                            >
                                <Icon name={activity.icon as any} className="w-5 h-5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-gray-800 dark:text-white">{activity.action}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(activity.timestamp)}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
