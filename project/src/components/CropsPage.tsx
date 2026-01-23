import { useState } from 'react';
import { ArrowLeft, Leaf, Droplets, Sun, Calendar, Sprout, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CropInfo {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  season: string;
  growingTime: string;
  soilType: string;
  waterNeeds: string;
  temperature: string;
  type: 'Cereal' | 'Vegetable' | 'Fruit' | 'Legume' | 'Cash Crop';
  benefits: string[];
  tips: string[];
}

const cropsData: CropInfo[] = [
  {
    id: 'rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    image: '🌾',
    season: 'Kharif (June-October)',
    growingTime: '120-150 days',
    soilType: 'Clay loam, rich in organic matter',
    waterNeeds: 'High - Requires flooded fields',
    temperature: '20-35°C',
    type: 'Cereal',
    benefits: ['Staple food for billions', 'High energy source', 'Versatile crop'],
    tips: [
      'Maintain water level 5-10 cm',
      'Control weeds in early stages',
      'Use disease-resistant varieties',
    ],
  },
  {
    id: 'wheat',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    image: '🌾',
    season: 'Rabi (Nov-April)',
    growingTime: '110-130 days',
    soilType: 'Well-drained loamy soil',
    waterNeeds: 'Moderate - 4-6 irrigations',
    temperature: '10-25°C',
    type: 'Cereal',
    benefits: ['Major grain crop', 'High protein content', 'Used in various food products'],
    tips: ['Sow at right time (Nov)', 'Apply balanced fertilizers', 'Control aphids and rust'],
  },
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    image: '🍅',
    season: 'All seasons (with care)',
    growingTime: '60-80 days',
    soilType: 'Well-drained fertile soil',
    waterNeeds: 'Moderate - Regular watering',
    temperature: '18-27°C',
    type: 'Vegetable',
    benefits: ['Rich in vitamins', 'High market value', 'Multiple harvests possible'],
    tips: [
      'Provide support for plants',
      'Mulch to retain moisture',
      'Remove side shoots for better yield',
    ],
  },
  {
    id: 'potato',
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    image: '🥔',
    season: 'Rabi (Oct-Jan)',
    growingTime: '90-120 days',
    soilType: 'Loose, well-drained sandy loam',
    waterNeeds: 'Moderate - Critical at tuber formation',
    temperature: '15-20°C',
    type: 'Vegetable',
    benefits: ['High yield per acre', 'Good source of carbs', 'Multiple uses'],
    tips: ['Use certified seed potatoes', 'Earth up plants regularly', 'Harvest when tops die'],
  },
  {
    id: 'cotton',
    name: 'Cotton',
    scientificName: 'Gossypium',
    image: '☁️',
    season: 'Kharif (May-Oct)',
    growingTime: '150-180 days',
    soilType: 'Black cotton soil preferred',
    waterNeeds: 'Moderate to High',
    temperature: '21-30°C',
    type: 'Cash Crop',
    benefits: ['Major cash crop', 'Textile industry', 'By-products useful'],
    tips: ['Control pink bollworm', 'Ensure good drainage', 'Pick at right maturity'],
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    image: '🎋',
    season: 'Year-round planting',
    growingTime: '10-12 months',
    soilType: 'Deep fertile loamy soil',
    waterNeeds: 'High - Frequent irrigation',
    temperature: '20-30°C',
    type: 'Cash Crop',
    benefits: ['Sugar production', 'Ethanol production', 'Bagasse for power'],
    tips: ['Use healthy seed canes', 'Maintain moisture', 'Harvest at 10-12 months'],
  },
  {
    id: 'onion',
    name: 'Onion',
    scientificName: 'Allium cepa',
    image: '🧅',
    season: 'Rabi & Kharif',
    growingTime: '120-150 days',
    soilType: 'Well-drained sandy loam',
    waterNeeds: 'Moderate - Regular light irrigation',
    temperature: '13-24°C',
    type: 'Vegetable',
    benefits: ['Essential vegetable', 'Good storage life', 'High demand'],
    tips: ['Avoid water logging', 'Cure after harvest', 'Control thrips'],
  },
  {
    id: 'mango',
    name: 'Mango',
    scientificName: 'Mangifera indica',
    image: '🥭',
    season: 'Flowering: Jan-Feb',
    growingTime: '3-5 months (fruiting)',
    soilType: 'Well-drained deep soil',
    waterNeeds: 'Moderate - More during fruiting',
    temperature: '24-30°C',
    type: 'Fruit',
    benefits: ['King of fruits', 'High export value', 'Rich in vitamins'],
    tips: ['Prune for shape', 'Control fruit fly', 'Thin fruits for better size'],
  },
];

export default function CropsPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('All');

  const cropTypes = ['All', 'Cereal', 'Vegetable', 'Fruit', 'Legume', 'Cash Crop'];

  const filteredCrops =
    selectedType === 'All' ? cropsData : cropsData.filter((crop) => crop.type === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-4"
            animate={{
              boxShadow: [
                '0 0 20px rgba(16, 185, 129, 0.3)',
                '0 0 40px rgba(16, 185, 129, 0.6)',
                '0 0 20px rgba(16, 185, 129, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Leaf className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Crop Information Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Learn about different crops, their growing seasons, and care tips
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {cropTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedType === type
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Agricultural Basics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-800"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Water Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Proper irrigation is crucial. Different crops need different water levels at various
              growth stages.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-800"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
              <Sun className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sunlight & Temperature
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Each crop has optimal temperature ranges. Monitor weather and provide shade if needed.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-800"
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Sprout className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Soil Health
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Healthy soil means healthy crops. Test soil pH, add organic matter, and rotate crops.
            </p>
          </motion.div>
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop, index) => (
            <motion.div
              key={crop.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Crop Header with Image */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-2">{crop.image}</div>
                  <h3 className="text-2xl font-bold text-white mb-1">{crop.name}</h3>
                  <p className="text-sm text-emerald-100 italic">{crop.scientificName}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs text-white font-medium">
                    {crop.type}
                  </span>
                </div>
              </div>

              {/* Crop Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Season</p>
                    <p className="text-sm text-gray-900 dark:text-white">{crop.season}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Growing Time
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">{crop.growingTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sprout className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Soil Type
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">{crop.soilType}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Water Needs
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">{crop.waterNeeds}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sun className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      Temperature
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">{crop.temperature}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">
                    Benefits
                  </p>
                  <ul className="space-y-1">
                    {crop.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2"
                      >
                        <span className="text-green-600">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growing Tips */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">
                    Growing Tips
                  </p>
                  <ul className="space-y-1">
                    {crop.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2"
                      >
                        <span className="text-blue-600">💡</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Need More Information?</h3>
          <p className="mb-6">Use our AI Crop Advisor for personalized recommendations!</p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
