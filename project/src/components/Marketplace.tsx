import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import toast from 'react-hot-toast';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  seller: string;
  sellerPhone: string;
  location: string;
  distance: string;
  image?: string;
  description: string;
  isOwnProduct?: boolean;
  availability?: 'in-stock' | 'out-of-stock';
};

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form state for adding new product
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'vegetables',
    price: '',
    unit: 'kg',
    quantity: '',
    description: '',
    phone: '',
  });

  // Load products from localStorage or use demo data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse products', e);
      }
    }
    // Default demo products
    return [
      {
        id: '1',
        name: 'Fresh Organic Tomatoes',
        category: 'vegetables',
        price: 45,
        unit: 'kg',
        quantity: 500,
        seller: 'Ravi Farms',
        sellerPhone: '+91 98765 43210',
        location: 'Coimbatore',
        distance: '5 km',
        description: 'Farm fresh organic tomatoes, harvested just today. No pesticides used.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '2',
        name: 'Premium Wheat (Sona Moti)',
        category: 'grains',
        price: 3200,
        unit: 'quintal',
        quantity: 50,
        seller: 'Lakshmi Agro',
        sellerPhone: '+91 98765 43211',
        location: 'Pollachi',
        distance: '12 km',
        description: 'High quality wheat suitable for milling. Moisture content < 12%.',
        isOwnProduct: false
      },
      {
        id: '3',
        name: 'Jersey Cow Milk',
        category: 'dairy',
        price: 60,
        unit: 'liter',
        quantity: 100,
        seller: 'Krishna Dairy Farm',
        sellerPhone: '+91 98765 43212',
        location: 'Erode',
        distance: '25 km',
        description: 'Pure, unadulterated raw milk from grass-fed Jersey cows.',
        isOwnProduct: false
      },
      {
        id: '4',
        name: 'Shimla Apples',
        category: 'fruits',
        price: 180,
        unit: 'kg',
        quantity: 200,
        seller: 'Mountain Fresh',
        sellerPhone: '+91 98765 43213',
        location: 'Ooty',
        distance: '80 km',
        description: 'Crisp and sweet apples directly from orchards.',
        isOwnProduct: false
      },
      {
        id: '5',
        name: 'Hybrid Cotton Seeds',
        category: 'seeds',
        price: 850,
        unit: 'kg',
        quantity: 1000,
        seller: 'AgriInputs Ltd',
        sellerPhone: '+91 98765 43214',
        location: 'Salem',
        distance: '40 km',
        description: 'High yield potential hybrid cotton seeds. Resistant to major pests.',
        isOwnProduct: false
      }
    ];
  });

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const categories = [
    { id: 'all', label: 'All Products', icon: '🌾' },
    { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { id: 'fruits', label: 'Fruits', icon: '🍎' },
    { id: 'grains', label: 'Grains', icon: '🌾' },
    { id: 'dairy', label: 'Dairy', icon: '🥛' },
    { id: 'seeds', label: 'Seeds', icon: '🌱' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    if (activeTab === 'buy') {
      return matchesSearch && matchesCategory && !product.isOwnProduct;
    } else {
      return matchesSearch && matchesCategory && product.isOwnProduct;
    }
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      unit: newProduct.unit,
      quantity: parseInt(newProduct.quantity),
      seller: 'Your Farm',
      sellerPhone: newProduct.phone,
      location: 'Your Location',
      distance: '0 km',
      description: newProduct.description,
      isOwnProduct: true,
    };

    setProducts([...products, product]);
    setShowAddProduct(false);
    setNewProduct({
      name: '',
      category: 'vegetables',
      price: '',
      unit: 'kg',
      quantity: '',
      description: '',
      phone: '',
    });
    setActiveTab('sell'); // Switch to sell tab to see the added product

    // Success notification
    toast.success(`${product.name} added to marketplace!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="ShoppingCart" className="h-7 w-7 text-green-600" />
            Marketplace
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Buy and sell agricultural products directly
          </p>
        </div>

        <button
          onClick={() => setShowAddProduct(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center space-x-2"
        >
          <Icon name="Plus" className="h-5 w-5" />
          <span>Sell Product</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('buy')}
          className={`px-6 py-3 font-medium transition-all ${activeTab === 'buy'
            ? 'border-b-2 border-green-600 text-green-600'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          <Icon name="ShoppingBag" className="h-5 w-5 inline mr-2" />
          Buy Products
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`px-6 py-3 font-medium transition-all ${activeTab === 'sell'
            ? 'border-b-2 border-green-600 text-green-600'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          <Icon name="Package" className="h-5 w-5 inline mr-2" />
          My Products
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or sellers..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Product Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 flex items-center justify-center relative">
              <span className="text-6xl">
                {categories.find((c) => c.id === product.category)?.icon || '🌾'}
              </span>
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${(product.availability || 'in-stock') === 'in-stock'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    }`}
                >
                  {(product.availability || 'in-stock') === 'in-stock' ? '● In Stock' : '○ Out of Stock'}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.seller}</p>
                </div>
                {product.isOwnProduct && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Your Product
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Icon name="MapPin" className="h-4 w-4" />
                  {product.location} ({product.distance})
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Package" className="h-4 w-4" />
                  {product.quantity} {product.unit}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{product.price}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      /{product.unit}
                    </span>
                  </p>
                </div>
                {!product.isOwnProduct ? (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <Icon name="Phone" className="h-4 w-4" />
                    Contact
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <Icon name="Edit" className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Package" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {activeTab === 'buy' ? 'No products available' : "You haven't listed any products yet"}
          </p>
          {activeTab === 'sell' && (
            <button
              onClick={() => setShowAddProduct(true)}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Sell Your Product</h3>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <Icon name="X" className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Organic Tomatoes"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="seeds">Seeds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit *
                  </label>
                  <select
                    required
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="quintal">Quintal</option>
                    <option value="ton">Ton</option>
                    <option value="liter">Liter</option>
                    <option value="dozen">Dozen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price per Unit (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="e.g., 40"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    placeholder="e.g., 500"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={newProduct.phone}
                  onChange={(e) => setNewProduct({ ...newProduct, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  pattern="[+]?[0-9]{10,13}"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe your product..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center space-x-2"
                >
                  <Icon name="Plus" className="h-5 w-5" />
                  <span>List Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
