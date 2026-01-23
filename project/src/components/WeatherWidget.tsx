import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface WeatherData {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    forecast: Array<{
        day: string;
        temp: number;
        condition: string;
    }>;
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState('Your Farm');

    useEffect(() => {
        // Simulate fetching weather data (in production, use OpenWeatherMap API)
        const fetchWeather = () => {
            setTimeout(() => {
                const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
                const currentCondition = conditions[Math.floor(Math.random() * conditions.length)];

                setWeather({
                    temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
                    condition: currentCondition,
                    humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
                    windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
                    forecast: Array.from({ length: 5 }, (_, i) => ({
                        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i],
                        temp: Math.floor(Math.random() * 10) + 22,
                        condition: conditions[Math.floor(Math.random() * conditions.length)],
                    })),
                });
                setLoading(false);
            }, 1000);
        };

        fetchWeather();
        // Update every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'Sunny':
                return 'Sun';
            case 'Rainy':
                return 'CloudRain';
            case 'Cloudy':
                return 'Cloud';
            default:
                return 'CloudSun';
        }
    };

    const getWeatherColor = (condition: string) => {
        switch (condition) {
            case 'Sunny':
                return 'text-yellow-500';
            case 'Rainy':
                return 'text-blue-500';
            case 'Cloudy':
                return 'text-gray-500';
            default:
                return 'text-orange-500';
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Icon name="MapPin" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{location}</h3>
                </div>
                <Icon name="RefreshCw" className="w-5 h-5 text-gray-400 cursor-pointer hover:rotate-180 transition-transform duration-500" />
            </div>

            {/* Current Weather */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Icon
                        name={getWeatherIcon(weather.condition)}
                        className={`w-16 h-16 ${getWeatherColor(weather.condition)}`}
                    />
                    <div>
                        <div className="text-4xl font-bold text-gray-800 dark:text-white">{weather.temperature}°C</div>
                        <div className="text-gray-600 dark:text-gray-300">{weather.condition}</div>
                    </div>
                </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                    <Icon name="Droplets" className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300">Humidity: {weather.humidity}%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                    <Icon name="Wind" className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Wind: {weather.windSpeed} km/h</span>
                </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="border-t border-blue-200 dark:border-gray-700 pt-4">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">5-Day Forecast</div>
                <div className="grid grid-cols-5 gap-2">
                    {weather.forecast.map((day, index) => (
                        <div key={index} className="text-center">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{day.day}</div>
                            <Icon
                                name={getWeatherIcon(day.condition)}
                                className={`w-6 h-6 mx-auto mb-1 ${getWeatherColor(day.condition)}`}
                            />
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">{day.temp}°</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Farming Tip */}
            <div className="mt-4 p-3 bg-blue-100 dark:bg-gray-700 rounded-lg flex items-start space-x-2">
                <Icon name="Lightbulb" className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    {weather.condition === 'Rainy'
                        ? 'Perfect time for planting! Soil moisture is optimal.'
                        : weather.condition === 'Sunny'
                            ? 'Great weather for harvesting. Ensure adequate irrigation.'
                            : 'Monitor your crops closely. Weather may change.'}
                </div>
            </div>
        </div>
    );
}
