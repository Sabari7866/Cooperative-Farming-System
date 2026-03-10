import { useState, useEffect } from 'react';
import Icon from './Icon';
import LanguageSelector from './LanguageSelector';
import { logoutAndRedirect } from '../utils/auth';
import { toast, Toaster } from 'react-hot-toast';
import { api, User, Job, Order, Land } from '../utils/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalUsers: 0,
        farmers: 0,
        workers: 0,
        buyers: 0,
        activeJobs: 0,
        completedJobs: 0,
        totalProducts: 234, // Mock for now
        totalOrders: 0,
        revenue: 0
    });

    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [recentJobs, setRecentJobs] = useState<Job[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [recentLands, setRecentLands] = useState<Land[]>([]);

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.deleteUser(id);
            setRecentUsers(prev => prev.filter(u => u.id !== id));
            toast.success('User deleted successfully');
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await api.deleteJob(id);
            setRecentJobs(prev => prev.filter(j => j.id !== id));
            toast.success('Job deleted successfully');
        } catch (err) {
            toast.error('Failed to delete job');
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        try {
            await api.deleteOrder(id);
            setRecentOrders(prev => prev.filter(o => o.id !== id));
            toast.success('Order deleted successfully');
        } catch (err) {
            toast.error('Failed to delete order');
        }
    };

    const handleDeleteLand = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this land?')) return;
        try {
            await api.deleteLand(id);
            setRecentLands(prev => prev.filter(l => l.id !== id));
            toast.success('Land deleted successfully');
        } catch (err) {
            toast.error('Failed to delete land');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsData, usersData, jobsData, ordersData, landsData] = await Promise.all([
                    api.getAnalytics(),
                    api.getUsers(),
                    api.getJobs(),
                    api.getOrders(),
                    api.getLands()
                ]);

                // Calculate role counts
                const farmers = usersData.filter(u => u.role === 'farmer').length;
                const workers = usersData.filter(u => u.role === 'worker').length;
                const buyers = usersData.filter(u => u.role === 'buyer').length;

                setStats({
                    totalUsers: usersData.length,
                    farmers,
                    workers,
                    buyers,
                    activeJobs: analyticsData.activeJobs,
                    completedJobs: analyticsData.completedJobs,
                    totalProducts: 234, // Mock
                    totalOrders: analyticsData.totalOrders,
                    revenue: analyticsData.revenue
                });

                setRecentUsers(usersData);
                setRecentJobs(jobsData);
                setRecentOrders(ordersData);
                setRecentLands(landsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-white via-purple-50/30 to-indigo-50/50 shadow-2xl border-r border-purple-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="p-6 border-b border-purple-100 bg-white/50 backdrop-blur-sm relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center">
                            <Icon name="Shield" className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-800">
                                Admin Panel
                            </h1>
                            <p className="text-xs text-gray-500 font-medium">System Control</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4">
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${activeTab === 'overview'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                                    : 'text-gray-600 hover:bg-purple-50'
                                    }`}
                            >
                                <Icon name="LayoutDashboard" className="h-5 w-5" />
                                <span className="font-medium">Overview</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon name="Users" className="h-5 w-5" />
                                <span>Users Management</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('jobs')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'jobs' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon name="Briefcase" className="h-5 w-5" />
                                <span>Jobs</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon name="ShoppingCart" className="h-5 w-5" />
                                <span>Orders</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('lands')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'lands' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon name="MapPin" className="h-5 w-5" />
                                <span>Lands</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon name="BarChart3" className="h-5 w-5" />
                                <span>Analytics</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('messages')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'messages' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon name="MessageSquare" className="h-5 w-5" />
                                <span>Messages</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'users' && 'User Management'}
                            {activeTab === 'jobs' && 'Jobs Management'}
                            {activeTab === 'orders' && 'Orders Management'}
                            {activeTab === 'lands' && 'Land Management'}
                            {activeTab === 'analytics' && 'Analytics'}
                            {activeTab === 'messages' && 'Support Messages'}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <LanguageSelector />
                            <button
                                onClick={logoutAndRedirect}
                                className="px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Icon name="LogOut" className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-blue-100 rounded-lg p-3">
                                            <Icon name="Users" className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                            +12%
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        F: {stats.farmers} | W: {stats.workers} | B: {stats.buyers}
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-green-100 rounded-lg p-3">
                                            <Icon name="Briefcase" className="h-6 w-6 text-green-600" />
                                        </div>
                                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            Active
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Active Jobs</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
                                    <p className="text-xs text-gray-500 mt-2">{stats.completedJobs} completed</p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-purple-100 rounded-lg p-3">
                                            <Icon name="ShoppingCart" className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                            {stats.totalOrders}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                                    <p className="text-xs text-gray-500 mt-2">Products listed</p>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-amber-100 rounded-lg p-3">
                                            <Icon name="TrendingUp" className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                            +8%
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Platform Revenue</p>
                                    <p className="text-3xl font-bold text-gray-900">₹{(stats.revenue / 100000).toFixed(1)}L</p>
                                    <p className="text-xs text-gray-500 mt-2">This month</p>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Jobs</h3>
                                    <div className="space-y-3">
                                        {recentJobs.map((job) => (
                                            <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{job.title}</p>
                                                    <p className="text-xs text-gray-500">by {job.farmOwner} • {job.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                    >
                                                        {job.status}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">{job.applicants.length} applicants</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
                                    <div className="space-y-3">
                                        {recentOrders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{order.product}</p>
                                                    <p className="text-xs text-gray-500">{order.buyer} → {order.seller}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">₹{order.amount}</p>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'delivered'
                                                            ? 'bg-green-100 text-green-700'
                                                            : order.status === 'shipped'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1">
                                        <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                                        {recentUsers.filter(u => u.status === 'online').length} Online
                                    </span>
                                </div>
                            </div>

                            {/* Users by Role */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {['Farmer', 'Worker', 'Buyer'].map((role) => (
                                    <div key={role} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Icon name="Users" className="h-5 w-5 text-purple-600" />
                                            {role}s ({recentUsers.filter(u => u.role === role).length})
                                        </h3>
                                        <div className="space-y-3">
                                            {recentUsers
                                                .filter(u => u.role === role)
                                                .map((user) => (
                                                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{user.name}</p>
                                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span
                                                                className={`inline-block h-2 w-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                                                                    }`}
                                                            ></span>
                                                            <p className="text-xs text-gray-500 mt-1">{user.lastActive}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* All Users Table */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">All Registered Users</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentUsers.map((user) => (
                                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <span className="font-medium text-gray-900">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 text-sm">{user.email}</td>
                                                    <td className="py-3 px-4 text-gray-600 text-sm">{user.joinedDate}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`h-2 w-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                                                                    }`}
                                                            ></span>
                                                            <span className="text-sm text-gray-600">{user.lastActive}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <button
                                                            onClick={() => setSelectedUser(user)}
                                                            className="text-purple-600 hover:text-purple-700 text-sm font-medium mr-3"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                                        >
                                                            <Icon name="Trash2" className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* JOBS TAB */}
                    {activeTab === 'jobs' && (
                        <div className="space-y-6">
                            {/* Jobs Stats */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Active Jobs</p>
                                            <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
                                        </div>
                                        <div className="bg-green-100 rounded-lg p-3">
                                            <Icon name="Briefcase" className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Completed Jobs</p>
                                            <p className="text-3xl font-bold text-gray-900">{stats.completedJobs}</p>
                                        </div>
                                        <div className="bg-blue-100 rounded-lg p-3">
                                            <Icon name="CheckCircle" className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Total Applicants</p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {recentJobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0)}
                                            </p>
                                        </div>
                                        <div className="bg-purple-100 rounded-lg p-3">
                                            <Icon name="Users" className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Jobs List */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">All Jobs</h3>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                            Active ({recentJobs.filter(j => j.status === 'active').length})
                                        </button>
                                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                            Completed ({recentJobs.filter(j => j.status === 'completed').length})
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {recentJobs.map((job) => (
                                        <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {job.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Posted by <span className="font-medium">{job.farmOwner}</span> • {job.date}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Icon name="Users" className="h-4 w-4" />
                                                            {job.applicants.length} applicants
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Icon name="MapPin" className="h-4 w-4" />
                                                            Location available
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedJob(job)}
                                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                                                    >
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteJob(job.id)}
                                                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <Icon name="Trash2" className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            {/* Orders Stats */}
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                                            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                                        </div>
                                        <div className="bg-purple-100 rounded-lg p-3">
                                            <Icon name="ShoppingCart" className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Delivered</p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {recentOrders.filter(o => o.status === 'delivered').length}
                                            </p>
                                        </div>
                                        <div className="bg-green-100 rounded-lg p-3">
                                            <Icon name="CheckCircle" className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Shipped</p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {recentOrders.filter(o => o.status === 'shipped').length}
                                            </p>
                                        </div>
                                        <div className="bg-blue-100 rounded-lg p-3">
                                            <Icon name="TrendingUp" className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {recentOrders.filter(o => o.status === 'pending').length}
                                            </p>
                                        </div>
                                        <div className="bg-yellow-100 rounded-lg p-3">
                                            <Icon name="Clock" className="h-6 w-6 text-yellow-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">All Orders</h3>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
                                            Pending ({recentOrders.filter(o => o.status === 'pending').length})
                                        </button>
                                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                            Shipped ({recentOrders.filter(o => o.status === 'shipped').length})
                                        </button>
                                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                            Delivered ({recentOrders.filter(o => o.status === 'delivered').length})
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Buyer</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Seller</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map((order) => (
                                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <span className="font-mono text-sm text-gray-600">#{order.id.toString().padStart(5, '0')}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <p className="font-medium text-gray-900">{order.product}</p>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">{order.buyer}</td>
                                                    <td className="py-3 px-4 text-gray-600">{order.seller}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="font-bold text-gray-900">₹{order.amount}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered'
                                                            ? 'bg-green-100 text-green-700'
                                                            : order.status === 'shipped'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteOrder(order.id)}
                                                                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <Icon name="Trash2" className="h-4 w-4" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LANDS TAB */}
                    {activeTab === 'lands' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Land Management</h3>
                                <div className="space-y-4">
                                    {recentLands.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No lands found.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Land Name</th>
                                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Crop</th>
                                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Size (Acres)</th>
                                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentLands.map((land) => (
                                                        <tr key={land.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="py-3 px-4 font-medium text-gray-900">{land.name}</td>
                                                            <td className="py-3 px-4 text-gray-600">{land.location}</td>
                                                            <td className="py-3 px-4 text-gray-600">{land.crop}</td>
                                                            <td className="py-3 px-4 text-gray-600">{land.acreage}</td>
                                                            <td className="py-3 px-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${land.status === 'harvest' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                    {land.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <button
                                                                    onClick={() => handleDeleteLand(land.id)}
                                                                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                                                >
                                                                    <Icon name="Trash2" className="h-4 w-4" />
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ANALYTICS TAB */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            {/* Revenue & Growth */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-purple-100 text-sm mb-1">Total Revenue</p>
                                            <p className="text-4xl font-bold">₹{(stats.revenue / 100000).toFixed(1)}L</p>
                                            <p className="text-purple-100 text-sm mt-2">This month</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3">
                                            <Icon name="TrendingUp" className="h-8 w-8" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="bg-green-400 text-white px-2 py-1 rounded-full font-medium">+8.2%</span>
                                        <span className="text-purple-100">vs last month</span>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Growth Metrics</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">User Growth</span>
                                                <span className="font-medium text-green-600">+12%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Job Completion Rate</span>
                                                <span className="font-medium text-blue-600">94%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Order Fulfillment</span>
                                                <span className="font-medium text-purple-600">89%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Activity */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">User Activity</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Farmers</span>
                                            <span className="font-bold text-gray-900">{stats.farmers}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Workers</span>
                                            <span className="font-bold text-gray-900">{stats.workers}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Buyers</span>
                                            <span className="font-bold text-gray-900">{stats.buyers}</span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">Total Users</span>
                                                <span className="font-bold text-purple-600">{stats.totalUsers}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Active Jobs</span>
                                            <span className="font-bold text-green-600">{stats.activeJobs}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Completed Jobs</span>
                                            <span className="font-bold text-gray-900">{stats.completedJobs}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Total Products</span>
                                            <span className="font-bold text-gray-900">{stats.totalProducts}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Total Orders</span>
                                            <span className="font-bold text-gray-900">{stats.totalOrders}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Breakdown</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Jobs Commission</span>
                                                <span className="font-medium">45%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Marketplace Sales</span>
                                                <span className="font-medium">35%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Subscriptions</span>
                                                <span className="font-medium">20%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Trends */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Insights</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Top Performing Categories</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-700">Rice Harvesting</span>
                                                <span className="font-bold text-green-600">156 jobs</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-700">Organic Produce</span>
                                                <span className="font-bold text-green-600">89 orders</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-700">Irrigation Services</span>
                                                <span className="font-bold text-green-600">67 jobs</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">User Engagement</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-700">Daily Active Users</span>
                                                <span className="font-bold text-purple-600">842</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-700">Avg. Session Time</span>
                                                <span className="font-bold text-purple-600">12.5 min</span>
                                            </div>
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-700">Return Rate</span>
                                                <span className="font-bold text-purple-600">78%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* MESSAGES TAB */}
                    {activeTab === 'messages' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Icon name="MessageSquare" className="h-6 w-6 text-purple-600" />
                                    Support Inquiries
                                </h3>

                                {(() => {
                                    const messages = JSON.parse(localStorage.getItem('supportEmails') || '[]');

                                    if (messages.length === 0) {
                                        return (
                                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                                <Icon name="Inbox" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-500 font-medium">No messages found</p>
                                                <p className="text-sm text-gray-400">Support inquiries will appear here</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="space-y-4">
                                            {messages.reverse().map((msg: any) => (
                                                <div key={msg.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all bg-gray-50/50">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                                                                {msg.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">{msg.subject}</h4>
                                                                <p className="text-sm text-gray-500">
                                                                    From: <span className="font-medium text-gray-900">{msg.name}</span> ({msg.email})
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 ml-auto w-fit mb-1">
                                                                <Icon name="CheckCircle" className="h-3 w-3" />
                                                                {msg.status}
                                                            </span>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(msg.timestamp).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap">
                                                        {msg.message}
                                                    </div>
                                                    <div className="mt-4 flex justify-end gap-2">
                                                        <a
                                                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center gap-2"
                                                        >
                                                            <Icon name="Reply" className="h-4 w-4" />
                                                            Reply
                                                        </a>
                                                        <button
                                                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium flex items-center gap-2"
                                                            onClick={() => {
                                                                const updated = messages.filter((m: any) => m.id !== msg.id);
                                                                localStorage.setItem('supportEmails', JSON.stringify(updated.reverse())); // Re-reverse to match original order
                                                                window.location.reload(); // Simple reload to refresh
                                                            }}
                                                        >
                                                            <Icon name="Trash2" className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                            <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="X" className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 pb-4 border-b">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                        {selectedUser.role}
                                    </span>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-900">{selectedUser.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium text-gray-900">{selectedUser.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Joined Date</p>
                                    <p className="font-medium text-gray-900">{selectedUser.joinedDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${selectedUser.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        <span className="font-medium text-gray-900 capitalize">{selectedUser.status}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Active</p>
                                    <p className="font-medium text-gray-900">{selectedUser.lastActive}</p>
                                </div>
                                {(selectedUser as any).landsOwned && (
                                    <div>
                                        <p className="text-sm text-gray-500">Lands Owned</p>
                                        <p className="font-medium text-gray-900">{(selectedUser as any).landsOwned} lands</p>
                                    </div>
                                )}
                                {(selectedUser as any).jobsCompleted && (
                                    <div>
                                        <p className="text-sm text-gray-500">Jobs Completed</p>
                                        <p className="font-medium text-gray-900">{(selectedUser as any).jobsCompleted} jobs</p>
                                    </div>
                                )}
                                {(selectedUser as any).totalOrders && (
                                    <div>
                                        <p className="text-sm text-gray-500">Total Orders</p>
                                        <p className="font-medium text-gray-900">{(selectedUser as any).totalOrders} orders</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 pt-4 border-t">
                                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                                    Send Message
                                </button>
                                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                                    View Activity
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedJob(null)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
                            <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="X" className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="pb-4 border-b">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedJob.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {selectedJob.status}
                                    </span>
                                </div>
                                <p className="text-gray-600">{selectedJob.description}</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Posted By</p>
                                    <p className="font-medium text-gray-900">{selectedJob.farmOwner}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium text-gray-900">{selectedJob.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Duration</p>
                                    <p className="font-medium text-gray-900">{selectedJob.duration}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment</p>
                                    <p className="font-medium text-green-600 text-lg">{selectedJob.payment}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Applicants</p>
                                    <p className="font-medium text-gray-900">{selectedJob.applicants.length} workers applied</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Posted</p>
                                    <p className="font-medium text-gray-900">{selectedJob.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t">
                                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                                    View Applicants
                                </button>
                                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                                    Contact Farmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="X" className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="pb-4 border-b">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{selectedOrder.product}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedOrder.status === 'delivered'
                                        ? 'bg-green-100 text-green-700'
                                        : selectedOrder.status === 'shipped'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Order ID: #{selectedOrder.id.toString().padStart(5, '0')}</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Buyer</p>
                                    <p className="font-medium text-gray-900">{selectedOrder.buyer}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Seller</p>
                                    <p className="font-medium text-gray-900">{selectedOrder.seller}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Quantity</p>
                                    <p className="font-medium text-gray-900">{selectedOrder.quantity}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Amount</p>
                                    <p className="font-medium text-green-600 text-lg">₹{selectedOrder.amount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-medium text-gray-900">{selectedOrder.orderDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Delivery Date</p>
                                    <p className="font-medium text-gray-900">{selectedOrder.deliveryDate}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500">Tracking ID</p>
                                    <p className="font-mono font-medium text-gray-900">{selectedOrder.trackingId}</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Icon name="Package" className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-blue-900">Tracking Status</p>
                                        <p className="text-sm text-blue-700 mt-1">
                                            {selectedOrder.status === 'delivered' && 'Package has been delivered successfully'}
                                            {selectedOrder.status === 'shipped' && 'Package is in transit and will be delivered soon'}
                                            {selectedOrder.status === 'pending' && 'Order is being processed and will be shipped soon'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t">
                                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                                    Download Invoice
                                </button>
                                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
