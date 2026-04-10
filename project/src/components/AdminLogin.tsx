import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from './Icon';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulated login failure since demo is disabled
        setTimeout(() => {
            setError('Admin login is currently disabled. Please contact system administrator.');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                {/* Back button */}
                <button
                    onClick={() => navigate('/login')}
                    className="mb-4 flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors"
                >
                    <Icon name="ArrowLeft" className="h-4 w-4" />
                    Back to Main Login
                </button>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100/50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 text-white">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <Icon name="Shield" className="h-12 w-12" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-center mb-2">Admin Portal</h1>
                        <p className="text-center text-purple-100">System Administration Access</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
                                >
                                    <Icon name="AlertCircle" className="h-5 w-5 text-red-600 flex-shrink-0" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </motion.div>
                            )}

                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <Icon
                                        name="User"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter admin username"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Icon
                                        name="Lock"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                                    />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter admin password"
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <Icon name={showPassword ? 'EyeOff' : 'Eye'} className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="Shield" className="h-5 w-5" />
                                        <span>Access Admin Panel</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security Notice */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-start gap-2 text-xs text-gray-500">
                                <Icon name="Lock" className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <p>
                                    This is a secure admin portal. All login attempts are monitored and logged.
                                    Unauthorized access is strictly prohibited.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    உழவன் X Admin Portal v12.0 • Secure Access
                </p>
            </motion.div>
        </div>
    );
}
