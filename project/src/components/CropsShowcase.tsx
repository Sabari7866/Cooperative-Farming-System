import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

interface Crop {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  benefits: string[];
  season: string;
  duration: string;
  image: string;
  color: string;
  icon: string;
}

const CropsShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const crops: Crop[] = [
    {
      id: 'rice',
      name: 'Rice',
      scientificName: 'Oryza sativa',
      description:
        "Rice is the staple food for over half of the world's population. It thrives in flooded fields and requires consistent water management.",
      benefits: [
        'High yield potential',
        'Staple food crop',
        'Multiple varieties available',
        'Suitable for wet climates',
      ],
      season: 'Kharif (June-October)',
      duration: '120-150 days',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
      color: 'from-green-500 to-emerald-600',
      icon: '🌾',
    },
    {
      id: 'wheat',
      name: 'Wheat',
      scientificName: 'Triticum aestivum',
      description:
        "Wheat is a major cereal grain and one of the most important food crops globally. It's used to make flour for bread, pasta, and other products.",
      benefits: [
        'High nutritional value',
        'Versatile crop',
        'Good market demand',
        'Drought resistant varieties',
      ],
      season: 'Rabi (November-April)',
      duration: '110-130 days',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
      color: 'from-amber-500 to-yellow-600',
      icon: '🌾',
    },
    {
      id: 'cotton',
      name: 'Cotton',
      scientificName: 'Gossypium',
      description:
        "Cotton is a soft, fluffy fiber that grows in a protective case around the seeds. It's the most important natural fiber in the textile industry.",
      benefits: [
        'High commercial value',
        'Multiple uses (fiber & oil)',
        'Good income potential',
        'Suitable for dry regions',
      ],
      season: 'Kharif (May-October)',
      duration: '150-180 days',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80',
      color: 'from-blue-500 to-indigo-600',
      icon: '🌸',
    },
    {
      id: 'sugarcane',
      name: 'Sugarcane',
      scientificName: 'Saccharum officinarum',
      description:
        "Sugarcane is a tropical grass that stores high concentrations of sucrose in its stems. It's the primary source of sugar production.",
      benefits: [
        'High sugar content',
        'Multiple harvests possible',
        'By-products valuable',
        'Good cash crop',
      ],
      season: 'Year-round',
      duration: '12-18 months',
      image: 'https://images.unsplash.com/photo-1583468323330-9032ad490fed?w=800&q=80',
      color: 'from-purple-500 to-pink-600',
      icon: '🎋',
    },
    {
      id: 'tomato',
      name: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      description:
        "Tomatoes are versatile vegetables rich in vitamins and antioxidants. They're used fresh, cooked, and processed into various products.",
      benefits: [
        'High nutritional value',
        'Quick returns',
        'Multiple cropping possible',
        'Good market demand',
      ],
      season: 'All seasons (with irrigation)',
      duration: '60-80 days',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
      color: 'from-red-500 to-rose-600',
      icon: '🍅',
    },
    {
      id: 'potato',
      name: 'Potato',
      scientificName: 'Solanum tuberosum',
      description:
        "Potatoes are starchy tubers that are the fourth-largest food crop globally. They're highly nutritious and versatile in cooking.",
      benefits: [
        'High yield per acre',
        'Nutritious staple',
        'Storage friendly',
        'Multiple varieties',
      ],
      season: 'Rabi (October-March)',
      duration: '90-120 days',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
      color: 'from-orange-500 to-amber-600',
      icon: '🥔',
    },
  ];

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % crops.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, crops.length]);

  const nextCrop = () => {
    setCurrentIndex((prev) => (prev + 1) % crops.length);
    setIsAutoPlay(false);
  };

  const prevCrop = () => {
    setCurrentIndex((prev) => (prev - 1 + crops.length) % crops.length);
    setIsAutoPlay(false);
  };

  const currentCrop = crops[currentIndex];

  return (
    <div className="w-full bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-2xl shadow-xl overflow-hidden border border-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-700 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-2.5 shadow-inner">
              <Icon name="Sprout" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Agricultural Crops</h2>
              <p className="text-green-100 text-sm font-medium opacity-90">Discover farming varieties</p>
            </div>
          </div>
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`backdrop-blur-md rounded-xl p-2.5 transition-all duration-300 ${isAutoPlay ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white text-green-700 shadow-lg'}`}
            title={isAutoPlay ? 'Pause auto-play' : 'Resume auto-play'}
          >
            <Icon name={isAutoPlay ? 'Pause' : 'Play'} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCrop.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-6 p-6"
          >
            {/* Image Section */}
            <div className="relative group">
              <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={currentCrop.image}
                  alt={currentCrop.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${currentCrop.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                />

                {/* Crop Icon Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <span className="text-4xl">{currentCrop.icon}</span>
                </div>

                {/* Season Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/50">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-green-100 rounded-lg">
                      <Icon name="Calendar" className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-bold block">Season</span>
                      <span className="text-sm font-bold text-gray-800">
                        {currentCrop.season}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Title */}
                <div className="mb-4">
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{currentCrop.name}</h3>
                  <p className="text-sm text-gray-500 italic">{currentCrop.scientificName}</p>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed mb-4">{currentCrop.description}</p>

                {/* Duration */}
                <div className="flex items-center space-x-2 mb-4 bg-green-50 rounded-lg px-4 py-2 border border-green-200">
                  <Icon name="Clock" className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Growing Duration:{' '}
                    <span className="text-green-700 font-semibold">{currentCrop.duration}</span>
                  </span>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <Icon name="CheckCircle" className="h-4 w-4 text-green-600" />
                    <span>Key Benefits:</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {currentCrop.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                        <Icon name="Leaf" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-green-200">
                <button
                  onClick={prevCrop}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-green-200 text-green-700 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all"
                >
                  <Icon name="ChevronLeft" className="h-5 w-5" />
                  <span className="font-medium">Previous</span>
                </button>

                {/* Dots Indicator */}
                <div className="flex items-center space-x-2">
                  {crops.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setIsAutoPlay(false);
                      }}
                      className={`h-2 rounded-full transition-all ${index === currentIndex
                        ? 'w-8 bg-green-600'
                        : 'w-2 bg-green-300 hover:bg-green-400'
                        }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextCrop}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg"
                >
                  <span className="font-medium">Next</span>
                  <Icon name="ChevronRight" className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 border-t border-green-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-green-800">
            <Icon name="Info" className="h-4 w-4" />
            <span>
              Showing {currentIndex + 1} of {crops.length} crops
            </span>
          </div>
          <div className="flex items-center space-x-2 text-green-700">
            <Icon name="TrendingUp" className="h-4 w-4" />
            <span className="font-medium">Smart farming with உழவன் X</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropsShowcase;
