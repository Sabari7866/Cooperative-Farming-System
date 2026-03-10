import React, { useState, useEffect, useMemo } from 'react';
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

// ─── Uzhavar Sandhai Reference Data (Coimbatore market) ────────────────────
const SANDHAI_REF: { keywords: string[]; category: string; price: number; unit: string; icon: string }[] = [
  { keywords: ['tomato'], category: 'vegetables', price: 46, unit: 'kg', icon: '🍅' },
  { keywords: ['onion'], category: 'vegetables', price: 35, unit: 'kg', icon: '🧅' },
  { keywords: ['potato'], category: 'vegetables', price: 30, unit: 'kg', icon: '🥔' },
  { keywords: ['brinjal', 'baingan'], category: 'vegetables', price: 29, unit: 'kg', icon: '🍆' },
  { keywords: ['carrot'], category: 'vegetables', price: 53, unit: 'kg', icon: '🥕' },
  { keywords: ['drumstick', 'murungai'], category: 'vegetables', price: 84, unit: 'kg', icon: '🌿' },
  { keywords: ['chilli', 'mirchi'], category: 'vegetables', price: 85, unit: 'kg', icon: '🌶️' },
  { keywords: ['banana', 'vazhai'], category: 'fruits', price: 43, unit: 'dozen', icon: '🍌' },
  { keywords: ['mango', 'maampazham'], category: 'fruits', price: 120, unit: 'kg', icon: '🥭' },
  { keywords: ['apple'], category: 'fruits', price: 175, unit: 'kg', icon: '🍎' },
  { keywords: ['coconut', 'thengai'], category: 'fruits', price: 20, unit: 'pc', icon: '🥥' },
  { keywords: ['rice', 'arisi'], category: 'grains', price: 53, unit: 'kg', icon: '🌾' },
  { keywords: ['wheat', 'godhumai'], category: 'grains', price: 3250, unit: 'quintal', icon: '🌾' },
  { keywords: ['lentil', 'dal', 'paruppu'], category: 'grains', price: 120, unit: 'kg', icon: '🫘' },
  { keywords: ['milk', 'paal'], category: 'dairy', price: 60, unit: 'liter', icon: '🥛' },
  { keywords: ['curd', 'thayir'], category: 'dairy', price: 50, unit: 'kg', icon: '🥛' },
  { keywords: ['seed', 'vidhai'], category: 'seeds', price: 850, unit: 'kg', icon: '🌱' },
];

// Category fallback rates when no keyword match
const CATEGORY_FALLBACK: Record<string, { price: number; unit: string }> = {
  vegetables: { price: 40, unit: 'kg' },
  fruits: { price: 80, unit: 'kg' },
  grains: { price: 3000, unit: 'quintal' },
  dairy: { price: 55, unit: 'liter' },
  seeds: { price: 800, unit: 'kg' },
};

function getSandhaiRate(name: string, category: string): { price: number; unit: string; icon: string; matched: boolean } {
  const lower = name.toLowerCase();
  const match = SANDHAI_REF.find(
    (r) => r.keywords.some((k) => lower.includes(k)) && (r.category === category || !category)
  ) || SANDHAI_REF.find((r) => r.keywords.some((k) => lower.includes(k)));
  if (match) return { price: match.price, unit: match.unit, icon: match.icon, matched: true };
  const fb = CATEGORY_FALLBACK[category];
  if (fb) return { price: fb.price, unit: fb.unit, icon: '🏷️', matched: false };
  return { price: 0, unit: 'kg', icon: '🏷️', matched: false };
}
// ──────────────────────────────────────────────────────────────────────────────

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Order modal state — 3-step wizard
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [orderStep, setOrderStep] = useState<1 | 2 | 3>(1);
  const [orderQty, setOrderQty] = useState(1);
  const [orderedIds, setOrderedIds] = useState<Set<string>>(new Set());
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const addressValid =
    deliveryAddress.fullName.trim() !== '' &&
    deliveryAddress.phone.trim().length >= 10 &&
    deliveryAddress.street.trim() !== '' &&
    deliveryAddress.city.trim() !== '' &&
    deliveryAddress.state.trim() !== '' &&
    deliveryAddress.pincode.trim().length === 6;
  const closeOrderModal = () => {
    setOrderProduct(null);
    setOrderStep(1);
    setDeliveryAddress({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
    setOrderQty(1);
  };

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

  // Uzhavar Sandhai reference rate — updates as farmer types product name / category
  const sandhaiRate = useMemo(
    () => getSandhaiRate(newProduct.name, newProduct.category),
    [newProduct.name, newProduct.category]
  );

  // Warn if farmer's price exceeds market rate
  const priceWarning =
    sandhaiRate.price > 0 &&
    newProduct.price !== '' &&
    parseFloat(newProduct.price) > sandhaiRate.price;

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
    // Default demo products - E-commerce agricultural marketplace
    return [
      // VEGETABLES
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
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
        description: 'Farm fresh organic tomatoes, harvested just today. No pesticides used.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '2',
        name: 'Green Chillies',
        category: 'vegetables',
        price: 80,
        unit: 'kg',
        quantity: 200,
        seller: 'Krishna Vegetables',
        sellerPhone: '+91 98765 43220',
        location: 'Pollachi',
        distance: '8 km',
        image: 'https://images.unsplash.com/photo-1583488177-e22e79eecd87?w=400&h=300&fit=crop',
        description: 'Fresh green chillies with perfect spice. Daily harvest.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '3',
        name: 'Onions (Bangalore)',
        category: 'vegetables',
        price: 35,
        unit: 'kg',
        quantity: 1000,
        seller: 'Ganesh Traders',
        sellerPhone: '+91 98765 43221',
        location: 'Erode',
        distance: '12 km',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop',
        description: 'High quality Bangalore onions. Bulk orders available.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '4',
        name: 'Potatoes',
        category: 'vegetables',
        price: 28,
        unit: 'kg',
        quantity: 800,
        seller: 'Farmers Hub',
        sellerPhone: '+91 98765 43222',
        location: 'Salem',
        distance: '15 km',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
        description: 'Fresh potatoes ideal for cooking. Grade A quality.',
        isOwnProduct: false,
        availability: 'in-stock'
      },

      // FRUITS
      {
        id: '5',
        name: 'Shimla Apples',
        category: 'fruits',
        price: 180,
        unit: 'kg',
        quantity: 200,
        seller: 'Mountain Fresh',
        sellerPhone: '+91 98765 43213',
        location: 'Ooty',
        distance: '80 km',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
        description: 'Crisp and sweet apples directly from orchards.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '6',
        name: 'Alphonso Mangoes',
        category: 'fruits',
        price: 250,
        unit: 'kg',
        quantity: 150,
        seller: 'Coastal Fruits',
        sellerPhone: '+91 98765 43223',
        location: 'Ratnagiri',
        distance: '120 km',
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
        description: 'Premium Alphonso mangoes. King of fruits.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '7',
        name: 'Bananas (Robusta)',
        category: 'fruits',
        price: 45,
        unit: 'dozen',
        quantity: 500,
        seller: 'Banana Growers Coop',
        sellerPhone: '+91 98765 43224',
        location: 'Theni',
        distance: '35 km',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
        description: 'Fresh robusta bananas. Rich in nutrients.',
        isOwnProduct: false,
        availability: 'in-stock'
      },

      // GRAINS
      {
        id: '8',
        name: 'Premium Basmati Rice',
        category: 'grains',
        price: 4500,
        unit: 'quintal',
        quantity: 30,
        seller: 'Lakshmi Agro',
        sellerPhone: '+91 98765 43211',
        location: 'Pollachi',
        distance: '12 km',
        image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
        description: 'Premium quality basmati rice with extra long grains.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '9',
        name: 'Wheat (Sona Moti)',
        category: 'grains',
        price: 3200,
        unit: 'quintal',
        quantity: 50,
        seller: 'Grain Masters',
        sellerPhone: '+91 98765 43225',
        location: 'Coimbatore',
        distance: '6 km',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
        description: 'High quality wheat suitable for milling. Moisture content < 12%.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '10',
        name: 'Red Lentils (Masoor Dal)',
        category: 'grains',
        price: 120,
        unit: 'kg',
        quantity: 300,
        seller: 'Pulses Paradise',
        sellerPhone: '+91 98765 43226',
        location: 'Erode',
        distance: '18 km',
        image: 'https://images.unsplash.com/photo-1596040033229-a0b39f1a8157?w=400&h=300&fit=crop',
        description: 'Premium red lentils. Clean and sorted.',
        isOwnProduct: false,
        availability: 'in-stock'
      },

      // DAIRY
      {
        id: '11',
        name: 'Jersey Cow Milk',
        category: 'dairy',
        price: 60,
        unit: 'liter',
        quantity: 100,
        seller: 'Krishna Dairy Farm',
        sellerPhone: '+91 98765 43212',
        location: 'Erode',
        distance: '25 km',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
        description: 'Pure, unadulterated raw milk from grass-fed Jersey cows.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '12',
        name: 'Fresh Curd (Dahi)',
        category: 'dairy',
        price: 50,
        unit: 'kg',
        quantity: 80,
        seller: 'Amul Dairy',
        sellerPhone: '+91 98765 43227',
        location: 'Pollachi',
        distance: '10 km',
        image: 'https://images.unsplash.com/photo-1571212515935-f8da95a087a7?w=400&h=300&fit=crop',
        description: 'Thick and creamy fresh curd. Daily morning batch.',
        isOwnProduct: false,
        availability: 'in-stock'
      },

      // SEEDS
      {
        id: '13',
        name: 'Hybrid Cotton Seeds',
        category: 'seeds',
        price: 850,
        unit: 'kg',
        quantity: 1000,
        seller: 'AgriInputs Ltd',
        sellerPhone: '+91 98765 43214',
        location: 'Salem',
        distance: '40 km',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop',
        description: 'High yield potential hybrid cotton seeds. Resistant to major pests.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '14',
        name: 'Tomato Seeds (Hybrid)',
        category: 'seeds',
        price: 2800,
        unit: 'kg',
        quantity: 50,
        seller: 'Seed World',
        sellerPhone: '+91 98765 43228',
        location: 'Coimbatore',
        distance: '7 km',
        image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop',
        description: 'High yielding hybrid tomato seeds. Suitable for all seasons.',
        isOwnProduct: false,
        availability: 'in-stock'
      },
      {
        id: '15',
        name: 'Fresh Carrots',
        category: 'vegetables',
        price: 55,
        unit: 'kg',
        quantity: 400,
        seller: 'Vegetable Mart',
        sellerPhone: '+91 98765 43229',
        location: 'Ooty',
        distance: '75 km',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
        description: 'Sweet and crunchy fresh carrots. Rich in vitamins.',
        isOwnProduct: false,
        availability: 'in-stock'
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
            {/* Product Image */}
            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 relative overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 flex items-center justify-center ${product.image ? 'hidden' : ''}`}>
                <span className="text-6xl">
                  {categories.find((c) => c.id === product.category)?.icon || '🌾'}
                </span>
              </div>
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setOrderProduct(product); setOrderQty(1); }}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-sm ${orderedIds.has(product.id)
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-default'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md'
                        }`}
                      disabled={orderedIds.has(product.id)}
                    >
                      <Icon name="ShoppingCart" className="h-4 w-4" />
                      {orderedIds.has(product.id) ? 'Ordered' : 'Order'}
                    </button>
                    <button
                      onClick={() => window.open(`tel:${product.sellerPhone}`)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Icon name="Phone" className="h-4 w-4" />
                      Contact
                    </button>
                  </div>
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

      {/* ── Order Wizard Modal (3 Steps) ── */}
      {orderProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon name="ShoppingCart" className="h-6 w-6" />
                  <h3 className="text-xl font-bold">
                    {orderStep === 1 && 'Select Quantity'}
                    {orderStep === 2 && 'Delivery Address'}
                    {orderStep === 3 && 'Confirm Order'}
                  </h3>
                </div>
                <button onClick={closeOrderModal} className="hover:bg-white/20 rounded-full p-1.5 transition-colors">
                  <Icon name="X" className="h-5 w-5" />
                </button>
              </div>
              {/* Step Progress Bar */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 ${orderStep >= s
                        ? 'bg-white text-orange-600 border-white'
                        : 'bg-white/20 text-white/60 border-white/30'
                      }`}>{s}</div>
                    {s < 3 && <div className={`flex-1 h-1 rounded-full ${orderStep > s ? 'bg-white' : 'bg-white/30'}`} />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-white/80 mt-1 px-0.5">
                <span>Quantity</span><span className="ml-4">Address</span><span>Confirm</span>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* ── STEP 1: Quantity ── */}
              {orderStep === 1 && (
                <>
                  {/* Product chip */}
                  <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-gray-700 rounded-xl border border-orange-100 dark:border-gray-600">
                    {orderProduct.image && (
                      <img src={orderProduct.image} alt={orderProduct.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{orderProduct.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{orderProduct.seller} · {orderProduct.location}</p>
                      <p className="text-green-600 font-semibold mt-0.5">₹{orderProduct.price}/{orderProduct.unit}</p>
                    </div>
                  </div>

                  {/* Qty stepper */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Quantity ({orderProduct.unit})
                    </label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setOrderQty(q => Math.max(1, q - 1))}
                        className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 hover:text-orange-600 flex items-center justify-center font-bold text-xl transition-colors">
                        −
                      </button>
                      <input type="number" min={1} max={orderProduct.quantity} value={orderQty}
                        onChange={e => setOrderQty(Math.max(1, Math.min(orderProduct.quantity, Number(e.target.value))))}
                        className="flex-1 text-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-xl" />
                      <button onClick={() => setOrderQty(q => Math.min(orderProduct.quantity, q + 1))}
                        className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 hover:text-orange-600 flex items-center justify-center font-bold text-xl transition-colors">
                        +
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Available: {orderProduct.quantity} {orderProduct.unit}</p>
                  </div>

                  {/* Subtotal */}
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Subtotal</span>
                    <span className="text-2xl font-black text-green-600">₹{(orderProduct.price * orderQty).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={closeOrderModal}
                      className="flex-1 px-5 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Cancel
                    </button>
                    <button onClick={() => setOrderStep(2)}
                      className="flex-1 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md flex items-center justify-center gap-2">
                      Next: Address
                      <Icon name="ChevronRight" className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 2: Delivery Address ── */}
              {orderStep === 2 && (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400 -mt-1">Enter where you want the order delivered.</p>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Full Name *</label>
                        <input type="text" placeholder="e.g. Ravi Kumar"
                          value={deliveryAddress.fullName}
                          onChange={e => setDeliveryAddress(a => ({ ...a, fullName: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Phone Number *</label>
                        <input type="tel" placeholder="+91 98765 43210"
                          value={deliveryAddress.phone}
                          onChange={e => setDeliveryAddress(a => ({ ...a, phone: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Street / Village / Door No. *</label>
                        <input type="text" placeholder="e.g. 12, Gandhi Street, Gandhipuram"
                          value={deliveryAddress.street}
                          onChange={e => setDeliveryAddress(a => ({ ...a, street: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">City / Town *</label>
                        <input type="text" placeholder="Coimbatore"
                          value={deliveryAddress.city}
                          onChange={e => setDeliveryAddress(a => ({ ...a, city: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">State *</label>
                        <input type="text" placeholder="Tamil Nadu"
                          value={deliveryAddress.state}
                          onChange={e => setDeliveryAddress(a => ({ ...a, state: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Pincode *</label>
                        <input type="text" placeholder="641001" maxLength={6}
                          value={deliveryAddress.pincode}
                          onChange={e => setDeliveryAddress(a => ({ ...a, pincode: e.target.value.replace(/\D/g, '') }))}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setOrderStep(1)}
                      className="flex-1 px-5 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1">
                      <Icon name="ChevronLeft" className="h-5 w-5" /> Back
                    </button>
                    <button onClick={() => setOrderStep(3)} disabled={!addressValid}
                      className={`flex-1 px-5 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${addressValid
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}>
                      Review Order <Icon name="ChevronRight" className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 3: Confirm Summary ── */}
              {orderStep === 3 && (
                <>
                  {/* Product row */}
                  <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-gray-700 rounded-xl border border-orange-100 dark:border-gray-600">
                    {orderProduct.image && (
                      <img src={orderProduct.image} alt={orderProduct.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">{orderProduct.name}</p>
                      <p className="text-sm text-gray-500">{orderProduct.seller}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-700 dark:text-gray-300">{orderQty} {orderProduct.unit}</p>
                      <p className="text-green-600 font-black text-lg">₹{(orderProduct.price * orderQty).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Delivery address card */}
                  <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="MapPin" className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-bold text-blue-700 dark:text-blue-400">Delivery Address</p>
                      <button onClick={() => setOrderStep(2)} className="ml-auto text-xs text-blue-600 underline font-semibold">Edit</button>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{deliveryAddress.fullName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{deliveryAddress.phone}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{deliveryAddress.street}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{deliveryAddress.city}, {deliveryAddress.state} – {deliveryAddress.pincode}</p>
                  </div>

                  {/* Price breakdown */}
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                      <span>Price per {orderProduct.unit}</span>
                      <span>₹{orderProduct.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                      <span>Quantity</span>
                      <span>{orderQty} {orderProduct.unit}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                      <span>Delivery</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between px-4 py-3 bg-green-50 dark:bg-green-900/20">
                      <span className="font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-2xl font-black text-green-600">₹{(orderProduct.price * orderQty).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setOrderStep(2)}
                      className="flex-1 px-5 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1">
                      <Icon name="ChevronLeft" className="h-5 w-5" /> Back
                    </button>
                    <button
                      onClick={() => {
                        setOrderedIds(prev => new Set([...prev, orderProduct.id]));
                        toast.success(
                          `✅ Order placed! ${orderQty} ${orderProduct.unit} of ${orderProduct.name} will be delivered to ${deliveryAddress.city}.`,
                          { duration: 5000 }
                        );
                        closeOrderModal();
                      }}
                      className="flex-1 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2">
                      <Icon name="CheckCircle" className="h-5 w-5" />
                      Place Order
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
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

                  {/* 🏷️ Sandhai Market Rate Reference */}
                  {sandhaiRate.price > 0 && (
                    <div className="mb-2 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-600 text-white">
                        <span className="text-[10px] font-black tracking-wider uppercase">🛖 Uzhavar Sandhai Rate · CBE</span>
                        <span className="text-[9px] bg-white/20 rounded px-1.5 py-0.5 font-bold">LIVE</span>
                      </div>
                      <div className="px-3 py-2 flex items-center justify-between">
                        <div>
                          <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                            {sandhaiRate.icon} ₹{sandhaiRate.price.toLocaleString('en-IN')}
                            <span className="text-xs font-normal text-gray-500 ml-1">/{sandhaiRate.unit}</span>
                          </p>
                          {!sandhaiRate.matched && (
                            <p className="text-[9px] text-amber-600 font-medium">Category average rate</p>
                          )}
                          <p className="text-[10px] text-gray-500 mt-0.5">Set your price at or below this 👆</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, price: String(sandhaiRate.price), unit: sandhaiRate.unit })}
                          className="text-[10px] font-black px-2 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors whitespace-nowrap"
                        >
                          Use this rate
                        </button>
                      </div>
                    </div>
                  )}

                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="e.g., 40"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${priceWarning ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-300 dark:border-gray-600'
                      }`}
                  />
                  {priceWarning && (
                    <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                      ⚠️ Price is above the market rate (₹{sandhaiRate.price}/{sandhaiRate.unit}). Buyers may prefer lower-priced sellers.
                    </p>
                  )}
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
