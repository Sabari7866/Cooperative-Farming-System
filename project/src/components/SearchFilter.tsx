import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchFilterProps {
  data: any[];
  searchFields: string[];
  categories?: string[];
  onFilteredDataChange: (filteredData: any[]) => void;
  placeholder?: string;
}

export default function SearchFilter({
  data,
  searchFields,
  categories = [],
  onFilteredDataChange,
  placeholder = 'Search...',
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Apply filters
  const applyFilters = (query: string, category: string, price: [number, number], sort: string) => {
    let filtered = [...data];

    // Search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(lowerQuery);
        }),
      );
    }

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter((item) => item.category === category);
    }

    // Price filter (only apply if items have price property)
    if (filtered.length > 0 && filtered[0].price !== undefined) {
      filtered = filtered.filter((item) => {
        const itemPrice = parseFloat(item.price || 0);
        return itemPrice >= price[0] && itemPrice <= price[1];
      });
    }

    // Sorting
    filtered = sortData(filtered, sort);

    onFilteredDataChange(filtered);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  };

  const sortData = (data: any[], sortType: string) => {
    const sorted = [...data];

    switch (sortType) {
      case 'newest':
        return sorted.reverse();
      case 'oldest':
        return sorted;
      case 'price-low':
        return sorted.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
      case 'price-high':
        return sorted.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
      case 'name-az':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name-za':
        return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      default:
        return sorted;
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    applyFilters(value, selectedCategory, priceRange, sortBy);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    applyFilters(searchQuery, value, priceRange, sortBy);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    applyFilters(searchQuery, selectedCategory, [min, max], sortBy);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFilters(searchQuery, selectedCategory, priceRange, value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 100000]);
    setSortBy('newest');
    onFilteredDataChange(data);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
            showFilters
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-az">Name (A-Z)</option>
                <option value="name-za">Name (Z-A)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, priceRange[1])}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange(priceRange[0], parseInt(e.target.value) || 100000)
                  }
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
