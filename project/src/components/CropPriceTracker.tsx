import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface CropPrice {
    crop: string;
    price: number;
    change: number;
    unit: string;
    market: string;
}

export default function CropPriceTracker() {
    const [prices, setPrices] = useState<CropPrice[]>([]);
    const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

    useEffect(() => {
        // Simulate real-time price updates
        const updatePrices = () => {
            const crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Corn', 'Soybean'];
            const newPrices = crops.map((crop) => ({
                crop,
                price: Math.floor(Math.random() * 2000) + 1000,
                change: (Math.random() * 10 - 5).toFixed(2),
                unit: 'per quintal',
                market: 'Local Market',
            }));
            setPrices(newPrices as any);
        };

        updatePrices();
        // Update prices every 5 seconds for demo (in production, use real API)
        const interval = setInterval(updatePrices, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Icon name="TrendingUp" className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Live Market Prices</h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live</span>
                </div>
            </div>

            <div className="space-y-3">
                {prices.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedCrop(selectedCrop === item.crop ? null : item.crop)}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedCrop === item.crop
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-800 dark:text-white">{item.crop}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.unit}</span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.market}</div>
                            </div>

                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">₹{item.price}</div>
                                <div
                                    className={`flex items-center space-x-1 text-sm font-semibold ${parseFloat(item.change.toString()) >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    <Icon
                                        name={parseFloat(item.change.toString()) >= 0 ? 'TrendingUp' : 'TrendingDown'}
                                        className="w-4 h-4"
                                    />
                                    <span>{Math.abs(parseFloat(item.change.toString()))}%</span>
                                </div>
                            </div>
                        </div>

                        {selectedCrop === item.crop && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-3 text-sm">
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400">Today's High</div>
                                    <div className="font-semibold text-gray-800 dark:text-white">
                                        ₹{Math.floor(item.price * 1.05)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400">Today's Low</div>
                                    <div className="font-semibold text-gray-800 dark:text-white">
                                        ₹{Math.floor(item.price * 0.95)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400">Volume</div>
                                    <div className="font-semibold text-gray-800 dark:text-white">
                                        {Math.floor(Math.random() * 500 + 100)} tons
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-start space-x-2">
                <Icon name="AlertCircle" className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Prices update in real-time. Best time to sell is when prices are trending up.
                </div>
            </div>
        </div>
    );
}
