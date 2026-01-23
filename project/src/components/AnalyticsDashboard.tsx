import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Package, Briefcase, Users, Calendar, DollarSign } from 'lucide-react';

interface AnalyticsData {
  totalProducts: number;
  totalJobs: number;
  totalRevenue: number;
  activeCrops: number;
  harvestingSoon: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  productsByCategory: Array<{ name: string; value: number }>;
  cropTimeline: Array<{ name: string; planted: string; harvest: string }>;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalProducts: 0,
    totalJobs: 0,
    totalRevenue: 0,
    activeCrops: 0,
    harvestingSoon: 0,
    revenueByMonth: [],
    productsByCategory: [],
    cropTimeline: [],
  });

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const calculateAnalytics = () => {
    // Get data from localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const crops = JSON.parse(localStorage.getItem('crops') || '[]');

    // Calculate total revenue
    const totalRevenue = products.reduce((sum: number, p: any) => {
      return sum + parseFloat(p.price || 0) * parseFloat(p.quantity || 0);
    }, 0);

    // Count harvesting soon (within 7 days)
    const now = new Date();
    const harvestingSoon = crops.filter((c: any) => {
      if (!c.expected_harvest) return false;
      const harvestDate = new Date(c.expected_harvest);
      const daysUntil = (harvestDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntil > 0 && daysUntil <= 7;
    }).length;

    // Products by category
    const categoryCount: { [key: string]: number } = {};
    products.forEach((p: any) => {
      const category = p.category || 'Other';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    const productsByCategory = Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
    }));

    // Revenue by month (mock data for demo - in real app would use created_at dates)
    const revenueByMonth = [
      { month: 'Jan', revenue: Math.floor(totalRevenue * 0.15) },
      { month: 'Feb', revenue: Math.floor(totalRevenue * 0.18) },
      { month: 'Mar', revenue: Math.floor(totalRevenue * 0.22) },
      { month: 'Apr', revenue: Math.floor(totalRevenue * 0.25) },
      { month: 'May', revenue: Math.floor(totalRevenue * 0.2) },
    ];

    // Crop timeline
    const cropTimeline = crops.slice(0, 5).map((c: any) => ({
      name: c.crop_name || c.name || 'Unknown',
      planted: c.planting_date || c.plantingDate || 'N/A',
      harvest: c.expected_harvest || c.expectedHarvest || 'N/A',
    }));

    setAnalytics({
      totalProducts: products.length,
      totalJobs: jobs.length,
      totalRevenue,
      activeCrops: crops.length,
      harvestingSoon,
      revenueByMonth,
      productsByCategory,
      cropTimeline,
    });
  };

  const StatCard = ({ icon: Icon, title, value, color, subtitle }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`${color.replace('text-', 'bg-').replace('600', '100')} dark:bg-opacity-20 p-4 rounded-lg`}
        >
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your farming metrics and insights
          </p>
        </div>
        <button
          onClick={calculateAnalytics}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          title="Total Products"
          value={analytics.totalProducts}
          color="text-green-600"
          subtitle="Listed in marketplace"
        />
        <StatCard
          icon={Briefcase}
          title="Job Postings"
          value={analytics.totalJobs}
          color="text-blue-600"
          subtitle="Active opportunities"
        />
        <StatCard
          icon={DollarSign}
          title="Est. Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString()}`}
          color="text-yellow-600"
          subtitle="Total product value"
        />
        <StatCard
          icon={Calendar}
          title="Harvesting Soon"
          value={analytics.harvestingSoon}
          color="text-red-600"
          subtitle={`Out of ${analytics.activeCrops} crops`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Products by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Products Distribution
          </h3>
          {analytics.productsByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.productsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.productsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No products data available
            </div>
          )}
        </div>
      </div>

      {/* Crop Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Active Crops Timeline
        </h3>
        {analytics.cropTimeline.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Crop Name
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Planted Date
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Expected Harvest
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.cropTimeline.map((crop, index) => {
                  const daysUntil =
                    crop.harvest !== 'N/A'
                      ? Math.ceil(
                          (new Date(crop.harvest).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                        )
                      : null;

                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                        {crop.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {crop.planted !== 'N/A'
                          ? new Date(crop.planted).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {crop.harvest !== 'N/A'
                          ? new Date(crop.harvest).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        {daysUntil !== null ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              daysUntil <= 7
                                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                : daysUntil <= 30
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            }`}
                          >
                            {daysUntil <= 0 ? 'Ready!' : `${daysUntil} days`}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No active crops found
          </div>
        )}
      </div>
    </div>
  );
}
