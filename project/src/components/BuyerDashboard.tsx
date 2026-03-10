import { useMemo, useState, useEffect } from 'react';
import { logoutAndRedirect, getSession, updateSession } from '../utils/auth';
import FloatingChatbot from './FloatingChatbot';
import LanguageSelector from './LanguageSelector';
import { useI18n } from '../utils/i18n';
// import DemoPaymentModal, { PaymentData } from './DemoPaymentModal'; // Unused
import {
  ShoppingCart,
  CreditCard,
  Package,
  Download,
  CheckCircle,
  Clock,
  Truck,
  X,
  Search,
  Filter,
  Heart,
  TrendingUp,
  Bell,
  DollarSign
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Order interface
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryAddress: string;
  buyerName: string;
  buyerPhone: string;
}

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
}

// Marketplace product type (matches what Marketplace.tsx stores)
interface MarketplaceProduct {
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
}

// Default demo products (same as Marketplace defaults)
const DEFAULT_MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  { id: '1', name: 'Fresh Organic Tomatoes', category: 'vegetables', price: 45, unit: 'kg', quantity: 500, seller: 'Ravi Farms', sellerPhone: '+91 98765 43210', location: 'Coimbatore', distance: '5 km', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop', description: 'Farm fresh organic tomatoes, harvested just today. No pesticides used.', availability: 'in-stock' },
  { id: '2', name: 'Green Chillies', category: 'vegetables', price: 80, unit: 'kg', quantity: 200, seller: 'Krishna Vegetables', sellerPhone: '+91 98765 43220', location: 'Pollachi', distance: '8 km', image: 'https://images.unsplash.com/photo-1583488177-e22e79eecd87?w=400&h=300&fit=crop', description: 'Fresh green chillies with perfect spice. Daily harvest.', availability: 'in-stock' },
  { id: '3', name: 'Onions (Bangalore)', category: 'vegetables', price: 35, unit: 'kg', quantity: 1000, seller: 'Ganesh Traders', sellerPhone: '+91 98765 43221', location: 'Erode', distance: '12 km', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop', description: 'High quality Bangalore onions. Bulk orders available.', availability: 'in-stock' },
  { id: '4', name: 'Potatoes', category: 'vegetables', price: 28, unit: 'kg', quantity: 800, seller: 'Farmers Hub', sellerPhone: '+91 98765 43222', location: 'Salem', distance: '15 km', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', description: 'Fresh potatoes ideal for cooking. Grade A quality.', availability: 'in-stock' },
  { id: '5', name: 'Shimla Apples', category: 'fruits', price: 180, unit: 'kg', quantity: 200, seller: 'Mountain Fresh', sellerPhone: '+91 98765 43213', location: 'Ooty', distance: '80 km', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop', description: 'Crisp and sweet apples directly from orchards.', availability: 'in-stock' },
  { id: '6', name: 'Alphonso Mangoes', category: 'fruits', price: 250, unit: 'kg', quantity: 150, seller: 'Coastal Fruits', sellerPhone: '+91 98765 43223', location: 'Ratnagiri', distance: '120 km', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop', description: 'Premium Alphonso mangoes. King of fruits.', availability: 'in-stock' },
  { id: '7', name: 'Bananas (Robusta)', category: 'fruits', price: 45, unit: 'dozen', quantity: 500, seller: 'Banana Growers Coop', sellerPhone: '+91 98765 43224', location: 'Theni', distance: '35 km', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop', description: 'Fresh robusta bananas. Rich in nutrients.', availability: 'in-stock' },
  { id: '8', name: 'Premium Basmati Rice', category: 'grains', price: 4500, unit: 'quintal', quantity: 30, seller: 'Lakshmi Agro', sellerPhone: '+91 98765 43211', location: 'Pollachi', distance: '12 km', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop', description: 'Premium quality basmati rice with extra long grains.', availability: 'in-stock' },
  { id: '9', name: 'Wheat (Sona Moti)', category: 'grains', price: 3200, unit: 'quintal', quantity: 50, seller: 'Grain Masters', sellerPhone: '+91 98765 43225', location: 'Coimbatore', distance: '6 km', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', description: 'High quality wheat suitable for milling.', availability: 'in-stock' },
  { id: '10', name: 'Red Lentils (Masoor Dal)', category: 'grains', price: 120, unit: 'kg', quantity: 300, seller: 'Pulses Paradise', sellerPhone: '+91 98765 43226', location: 'Erode', distance: '18 km', image: 'https://images.unsplash.com/photo-1596040033229-a0b39f1a8157?w=400&h=300&fit=crop', description: 'Premium red lentils. Clean and sorted.', availability: 'in-stock' },
  { id: '11', name: 'Jersey Cow Milk', category: 'dairy', price: 60, unit: 'liter', quantity: 100, seller: 'Krishna Dairy Farm', sellerPhone: '+91 98765 43212', location: 'Erode', distance: '25 km', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop', description: 'Pure, unadulterated raw milk from grass-fed Jersey cows.', availability: 'in-stock' },
  { id: '12', name: 'Fresh Curd (Dahi)', category: 'dairy', price: 50, unit: 'kg', quantity: 80, seller: 'Amul Dairy', sellerPhone: '+91 98765 43227', location: 'Pollachi', distance: '10 km', image: 'https://images.unsplash.com/photo-1571212515935-f8da95a087a7?w=400&h=300&fit=crop', description: 'Thick and creamy fresh curd. Daily morning batch.', availability: 'in-stock' },
  { id: '13', name: 'Hybrid Cotton Seeds', category: 'seeds', price: 850, unit: 'kg', quantity: 1000, seller: 'AgriInputs Ltd', sellerPhone: '+91 98765 43214', location: 'Salem', distance: '40 km', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop', description: 'High yield potential hybrid cotton seeds.', availability: 'in-stock' },
  { id: '14', name: 'Tomato Seeds (Hybrid)', category: 'seeds', price: 2800, unit: 'kg', quantity: 50, seller: 'Seed World', sellerPhone: '+91 98765 43228', location: 'Coimbatore', distance: '7 km', image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop', description: 'High yielding hybrid tomato seeds.', availability: 'in-stock' },
  { id: '15', name: 'Fresh Carrots', category: 'vegetables', price: 55, unit: 'kg', quantity: 400, seller: 'Vegetable Mart', sellerPhone: '+91 98765 43229', location: 'Ooty', distance: '75 km', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop', description: 'Sweet and crunchy fresh carrots. Rich in vitamins.', availability: 'in-stock' },
];

const CATEGORY_ICONS: Record<string, string> = {
  vegetables: '🥬', fruits: '🍎', grains: '🌾', dairy: '🥛', seeds: '🌱', other: '🌿',
};

function categoryFromName(name: string, category?: string): string {
  if (category) return category;
  const n = name.toLowerCase();
  if (n.includes('rice') || n.includes('wheat') || n.includes('grain') || n.includes('dal') || n.includes('lentil')) return 'grains';
  if (n.includes('tomato') || n.includes('potato') || n.includes('onion') || n.includes('carrot') || n.includes('chilli') || n.includes('vegetable')) return 'vegetables';
  if (n.includes('mango') || n.includes('banana') || n.includes('apple') || n.includes('fruit')) return 'fruits';
  if (n.includes('milk') || n.includes('curd') || n.includes('dairy')) return 'dairy';
  if (n.includes('seed')) return 'seeds';
  return 'other';
}

// ─── Uzhavar Sandhai (Farmers' Market) Price Board ────────────────────────────

const SANDHAI_MARKETS = [
  { id: 'coimbatore', name: 'Coimbatore', short: 'CBE' },
  { id: 'chennai', name: 'Chennai', short: 'MAS' },
  { id: 'salem', name: 'Salem', short: 'SLM' },
  { id: 'madurai', name: 'Madurai', short: 'MDU' },
  { id: 'erode', name: 'Erode', short: 'ERD' },
];

const SANDHAI_COMMODITIES = [
  { name: 'Tomato', icon: '🍅', basePrice: 45, unit: 'kg', seeds: [1, 3, -2, 4, -1] },
  { name: 'Onion', icon: '🧅', basePrice: 35, unit: 'kg', seeds: [0, 2, -3, 1, 4] },
  { name: 'Potato', icon: '🥔', basePrice: 28, unit: 'kg', seeds: [2, -1, 0, 3, -2] },
  { name: 'Brinjal', icon: '🍆', basePrice: 30, unit: 'kg', seeds: [-1, 4, 2, -3, 0] },
  { name: 'Banana', icon: '🍌', basePrice: 40, unit: 'doz', seeds: [3, -2, 1, 0, 2] },
  { name: 'Carrot', icon: '🥕', basePrice: 55, unit: 'kg', seeds: [-2, 1, 3, 4, -1] },
  { name: 'Drumstick', icon: '🌿', basePrice: 80, unit: 'kg', seeds: [4, -3, 2, 1, 0] },
  { name: 'Rice (Raw)', icon: '🌾', basePrice: 52, unit: 'kg', seeds: [1, 0, -1, 2, 3] },
  { name: 'Coconut', icon: '🥥', basePrice: 22, unit: 'pc', seeds: [-2, 3, 0, 1, -1] },
  { name: 'Green Chilli', icon: '🌶️', basePrice: 80, unit: 'kg', seeds: [5, -4, 3, -2, 6] },
  { name: 'Milk', icon: '🥛', basePrice: 60, unit: 'L', seeds: [0, 0, 0, 0, 0] },
  { name: 'Wheat', icon: '🌾', basePrice: 3200, unit: 'qt', seeds: [50, -100, 30, -50, 80] },
];

// Deterministic per-market price variation (no random on each render)
function getMarketPrice(basePrice: number, seed: number, marketIdx: number): number {
  const variation = seed * (1 + marketIdx * 0.1);
  return Math.max(1, Math.round(basePrice + variation));
}

function UzhavarSandhaiWidget() {
  const [selectedMarket, setSelectedMarket] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Tick every 60s to simulate live refresh
  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const market = SANDHAI_MARKETS[selectedMarket];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-black text-white text-sm flex items-center gap-2">
            🛖 உழவர் சந்தை விலை
          </h3>
          <span className="text-[10px] text-green-200 font-medium">
            🔴 LIVE · {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-[10px] text-green-100 font-medium">Uzhavar Sandhai Market Prices</p>

        {/* Market selector tabs */}
        <div className="flex gap-1 mt-2 flex-wrap">
          {SANDHAI_MARKETS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setSelectedMarket(i)}
              className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${i === selectedMarket
                  ? 'bg-white text-green-700 shadow'
                  : 'bg-green-800/40 text-green-100 hover:bg-green-800/60'
                }`}
            >
              {m.short}
            </button>
          ))}
        </div>
      </div>

      {/* Market title */}
      <div className="px-4 py-2 bg-green-50 border-b border-green-100 flex justify-between items-center">
        <span className="text-xs font-black text-green-800">📍 {market.name} Main Market</span>
        <span className="text-[9px] text-gray-400">Today's Rate  |  ₹/unit</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-4 py-1 bg-gray-50 border-b border-gray-100">
        <span className="text-[9px] font-bold text-gray-400 uppercase">Commodity</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase text-right">Price</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase text-right">Change</span>
      </div>

      {/* Price rows */}
      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto custom-scrollbar">
        {SANDHAI_COMMODITIES.map((commodity, idx) => {
          const price = getMarketPrice(commodity.basePrice, commodity.seeds[selectedMarket], selectedMarket);
          const seed = commodity.seeds[selectedMarket];
          const pct = ((seed / commodity.basePrice) * 100).toFixed(1);
          const isUp = seed >= 0;
          const isFlat = seed === 0;

          return (
            <div key={idx} className="grid grid-cols-3 px-4 py-2 hover:bg-green-50/50 transition-colors items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">{commodity.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{commodity.name}</p>
                  <p className="text-[9px] text-gray-400">per {commodity.unit}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-gray-800">
                  ₹{price.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-right">
                {isFlat ? (
                  <span className="text-[10px] font-bold text-gray-400">— Stable</span>
                ) : (
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                    {isUp ? '▲' : '▼'} {Math.abs(Number(pct))}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-[9px] text-gray-400 text-center">
          Prices indicative · Actual rates may vary at market · Updated daily
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

export default function BuyerDashboard() {
  const session = getSession();
  const { t } = useI18n();

  // Load marketplace products from localStorage (same source as Marketplace tab)
  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>(() => {
    try {
      const saved = localStorage.getItem('products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { /* ignore */ }
    return DEFAULT_MARKETPLACE_PRODUCTS;
  });

  // Refresh products from localStorage whenever this component renders
  useEffect(() => {
    const onStorage = () => {
      try {
        const saved = localStorage.getItem('products');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setMarketplaceProducts(parsed);
        }
      } catch (e) { /* ignore */ }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isLoading = false; // products come from localStorage instantly
  const [activeView, setActiveView] = useState<'products' | 'cart' | 'orders' | 'wishlist'>('products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

  // New Features State
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [negotiationItem, setNegotiationItem] = useState<any>(null);
  const [offerPrice, setOfferPrice] = useState('');

  // Payment form state
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  // Address state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    city: session?.buyerCity || '',
    state: session?.buyerState || '',
    pincode: session?.buyerPincode || '',
    address: session?.buyerAddress || '',
    phone: session?.phone || '',
  });

  // Load cart, orders, wishlist from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(`buyer_cart_${session?.id}`);
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedOrders = localStorage.getItem(`buyer_orders_${session?.id}`);
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedWishlist = localStorage.getItem(`buyer_wishlist_${session?.id}`);
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, [session?.id]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (session?.id) {
      localStorage.setItem(`buyer_cart_${session.id}`, JSON.stringify(cart));
    }
  }, [cart, session?.id]);

  const saveAddress = () => {
    updateSession({
      buyerCity: tempAddress.city,
      buyerState: tempAddress.state,
      buyerPincode: tempAddress.pincode,
      buyerAddress: tempAddress.address,
      phone: tempAddress.phone,
    });
    setShowAddressModal(false);
    toast.success(t('msg_address_saved'));
  };

  // Add to cart
  const addToCart = (product: any) => {
    const productName = product.name || product.title || 'Product';
    const productPrice = product.price ?? 0;
    const productUnit = product.unit || 'kg';
    const productCategory = categoryFromName(productName, product.category);

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
      toast.success(`Added more ${productName} to cart!`);
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: productName,
        category: productCategory,
        price: productPrice,
        quantity: 1,
        unit: productUnit,
      };
      setCart([...cart, newItem]);
      toast.success(`${productName} added to cart! 🛒`);
    }
  };

  // Remove from cart
  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  // Update quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)));
  };

  // Calculate totals
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05; // 5% tax
    const deliveryFee = subtotal > 0 ? 50 : 0;
    const total = subtotal + tax + deliveryFee;
    return { subtotal, tax, deliveryFee, total };
  }, [cart]);

  // Place Order
  const placeOrder = () => {
    if (!session?.buyerAddress || !session?.buyerCity) {
      setShowAddressModal(true);
      toast.error('Please add your delivery address first!');
      return;
    }
    setShowCheckout(true);
  };

  // Confirm Order with Payment
  const confirmOrder = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      items: cart.map((item) => ({
        id: Date.now().toString() + Math.random(),
        productId: item.id,
        productName: item.name,
        category: item.category,
        quantity: item.quantity,
        pricePerUnit: item.price,
        totalPrice: item.price * item.quantity,
      })),
      subtotal: cartTotals.subtotal,
      tax: cartTotals.tax,
      deliveryFee: cartTotals.deliveryFee,
      total: cartTotals.total,
      status: paymentMethod === 'cod' ? 'confirmed' : 'processing',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      deliveryAddress: `${session?.buyerAddress}, ${session?.buyerCity}`,
      buyerName: session?.name || 'Buyer',
      buyerPhone: session?.phone || '',
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(`buyer_orders_${session?.id}`, JSON.stringify(updatedOrders));

    // Clear cart
    setCart([]);
    setShowCheckout(false);

    toast.success(`Order placed successfully! Order #${newOrder.orderNumber}`);
    setActiveView('orders');
  };

  // Generate and Download PDF Receipt
  const downloadReceipt = (order: Order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header with company info
    doc.setFillColor(34, 197, 94); // Green
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(t('receipt_title'), 15, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(t('receipt_subtitle'), 15, 28);
    doc.text('Phone: +91 1800 123 4567', 15, 34);

    // Invoice label
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(t('receipt_invoice'), pageWidth - 15, 25, { align: 'right' });

    // Order details box
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 50, pageWidth - 30, 35, 'F');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Order #: ${order.orderNumber}`, 20, 60);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString('en-IN')}`, 20, 68);
    doc.text(`Payment: ${order.paymentMethod.toUpperCase()}`, 20, 76);

    doc.text(`Status: ${order.status.toUpperCase()}`, pageWidth - 20, 60, { align: 'right' });
    doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`, pageWidth - 20, 68, {
      align: 'right',
    });

    // Customer details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(t('receipt_bill_to'), 15, 100);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(order.buyerName, 15, 108);
    doc.text(order.buyerPhone, 15, 115);
    doc.text(order.deliveryAddress, 15, 122, { maxWidth: pageWidth - 30 });

    // Items table
    const tableData = order.items.map((item) => [
      item.productName,
      item.category,
      item.quantity.toString(),
      `₹${item.pricePerUnit.toFixed(2)}`,
      `₹${item.totalPrice.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 140,
      head: [['Product', 'Category', 'Quantity', 'Price/Unit', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
      },
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', pageWidth - 70, finalY);
    doc.text(`₹${order.subtotal.toFixed(2)}`, pageWidth - 15, finalY, { align: 'right' });

    doc.text('Tax (5%):', pageWidth - 70, finalY + 7);
    doc.text(`₹${order.tax.toFixed(2)}`, pageWidth - 15, finalY + 7, { align: 'right' });

    doc.text('Delivery Fee:', pageWidth - 70, finalY + 14);
    doc.text(`₹${order.deliveryFee.toFixed(2)}`, pageWidth - 15, finalY + 14, { align: 'right' });

    // Total with highlight
    doc.setFillColor(34, 197, 94);
    doc.rect(pageWidth - 75, finalY + 20, 60, 10, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', pageWidth - 70, finalY + 27);
    doc.text(`₹${order.total.toFixed(2)}`, pageWidth - 15, finalY + 27, { align: 'right' });

    // Footer
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });
    doc.text('For queries: support@agrismart.com | +91 1800 123 4567', pageWidth / 2, footerY + 5, {
      align: 'center',
    });
    doc.text('This is a computer-generated invoice', pageWidth / 2, footerY + 10, {
      align: 'center',
    });

    // Save PDF
    doc.save(`AgriSmart_Invoice_${order.orderNumber}.pdf`);
    toast.success(t('msg_invoice_downloaded'));
  };

  // Wishlist Logic
  const toggleWishlist = (productId: string) => {
    let newWishlist;
    if (wishlist.includes(productId)) {
      newWishlist = wishlist.filter(id => id !== productId);
      toast.success('Removed from wishlist');
    } else {
      newWishlist = [...wishlist, productId];
      toast.success('Added to wishlist');
    }
    setWishlist(newWishlist);
    localStorage.setItem(`buyer_wishlist_${session?.id}`, JSON.stringify(newWishlist));
  };

  // Negotiation Logic
  const requestNegotiation = (product: any) => {
    setNegotiationItem(product);
    setOfferPrice('');
    setShowNegotiationModal(true);
  };

  const submitOffer = () => {
    if (!offerPrice || isNaN(Number(offerPrice))) {
      toast.error('Please enter a valid price');
      return;
    }

    // Simulate API call / Logic
    setTimeout(() => {
      const randomOutcome = Math.random() > 0.3; // 70% chance of acceptance
      if (randomOutcome) {
        toast.success(`Offer of ₹${offerPrice} accepted! Added to cart.`);
        // Add to cart with new price
        const newItem: CartItem = {
          id: negotiationItem.id,
          name: negotiationItem.title + ' (Negotiated)',
          category: categoryFromTitle(negotiationItem.title),
          price: Number(offerPrice),
          quantity: 1,
          unit: 'kg'
        };
        setCart(prev => [...prev, newItem]);
      } else {
        toast.error(`Offer rejected. The farmer's minimum is ₹${Number(offerPrice) + 50}.`);
      }
      setShowNegotiationModal(false);
      setNegotiationItem(null);
    }, 1000);
  };

  // Filter Logic — only show products NOT marked as own (i.e., listed by farmers for others to buy)
  const filteredProducts = useMemo(() => {
    return marketplaceProducts
      .filter((p) => !p.isOwnProduct) // exclude farmer's own listings from buyer view
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const cat = categoryFromName(p.name, p.category);
        const matchesCategory =
          selectedCategoryFilter === 'All' || cat === selectedCategoryFilter;
        return matchesSearch && matchesCategory;
      });
  }, [marketplaceProducts, searchTerm, selectedCategoryFilter]);

  // Market Trends Mock Data
  const marketData = [
    { day: 'Mon', price: 120 },
    { day: 'Tue', price: 135 },
    { day: 'Wed', price: 128 },
    { day: 'Thu', price: 142 },
    { day: 'Fri', price: 145 },
    { day: 'Sat', price: 138 },
    { day: 'Sun', price: 150 },
  ];

  if (!session) {
    logoutAndRedirect();
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">{t('title_buyer_dashboard') || 'Buyer Dashboard'}</h1>
            <span className="text-sm text-gray-600">{t('welcome_back_owner')}, {session.name}!</span>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button className="p-2 mr-2 text-gray-500 hover:text-blue-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <button
              onClick={() => setActiveView('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${activeView === 'products'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {t('buyer_nav_products')}
            </button>

            <button
              onClick={() => setActiveView('cart')}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all ${activeView === 'cart'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <ShoppingCart className="w-5 h-5 inline mr-2" />
              {t('buyer_nav_cart')}
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('wishlist')}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all ${activeView === 'wishlist'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Heart className="w-5 h-5 inline mr-2" />
              {t('buyer_nav_wishlist')}
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('orders')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${activeView === 'orders'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              {t('buyer_nav_orders')}
            </button>

            <button
              onClick={logoutAndRedirect}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Products View */}
        {activeView === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column: Filters & Trends */}
              <div className="w-full md:w-1/4 space-y-6">
                {/* Search & Filter */}
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t('label_search_products')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-2 block">CATEGORY</label>
                      <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="All">{t('filter_all_categories')}</option>
                        <option value="vegetables">🥬 Vegetables</option>
                        <option value="fruits">🍎 Fruits</option>
                        <option value="grains">🌾 Grains</option>
                        <option value="dairy">🥛 Dairy</option>
                        <option value="seeds">🌱 Seeds</option>
                        <option value="other">🌿 Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Market Trends Widget */}
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" /> {t('title_market_trends')}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">Wheat Prices ({t('label_last_30_days')})</p>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={marketData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" hide />
                        <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                        <RechartsTooltip
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          labelStyle={{ display: 'none' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#22c55e" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 flex justify-between items-end">
                    <div>
                      <span className="text-2xl font-bold text-gray-800">₹145</span>
                      <span className="text-xs text-green-600 font-medium ml-2">▲ 2.4%</span>
                    </div>
                    <span className="text-xs text-gray-400">Avg / kg</span>
                  </div>
                </div>

                {/* 🌾 Uzhavar Sandhai Market Price List */}
                <UzhavarSandhaiWidget />

                {!session.buyerAddress && (
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2">{t('title_setup_delivery')}</h4>
                    <p className="text-xs text-yellow-700 mb-3">{t('msg_add_address')}</p>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="w-full py-2 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-bold hover:bg-yellow-500"
                    >
                      {t('btn_add_address')}
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Product Grid */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedCategoryFilter === 'All' ? 'All Products' : selectedCategoryFilter}
                  </h2>
                  <span className="text-sm text-gray-500">{filteredProducts.length} items found</span>
                </div>

                {isLoading ? (
                  <div className="w-full h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product: MarketplaceProduct) => {
                      const cat = categoryFromName(product.name, product.category);
                      const catIcon = CATEGORY_ICONS[cat] || '🌾';
                      const isInWishlist = wishlist.includes(product.id);
                      const inStock = (product.availability ?? 'in-stock') === 'in-stock';

                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                        >
                          {/* Product Image */}
                          <div className="relative h-44 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-6xl">{catIcon}</div>
                            )}
                            {/* Availability badge */}
                            <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm ${inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                              }`}>
                              {inStock ? '● In Stock' : '○ Out of Stock'}
                            </span>
                            {/* Wishlist */}
                            <button
                              onClick={() => toggleWishlist(product.id)}
                              className={`absolute top-2 right-2 p-1.5 rounded-full shadow transition-colors ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-400'
                                }`}
                            >
                              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <div className="p-4">
                            {/* Category badge */}
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-md uppercase tracking-wide">
                              {catIcon} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </span>

                            <h4 className="font-bold text-gray-800 text-base mt-2 mb-0.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-1">🏪 {product.seller} · 📍 {product.location}</p>
                            <p className="text-xs text-gray-400 line-clamp-2 h-8 mb-3">
                              {product.description}
                            </p>

                            <div className="flex items-end justify-between mb-3">
                              <div>
                                <p className="text-xs text-gray-400">Price</p>
                                <p className="text-xl font-black text-gray-800">
                                  ₹{product.price.toLocaleString()}
                                  <span className="text-sm font-normal text-gray-400">/{product.unit}</span>
                                </p>
                              </div>
                              <p className="text-xs text-gray-400">{product.quantity} {product.unit} avail.</p>
                            </div>

                            <div className="flex gap-2">
                              <button
                                disabled={!inStock}
                                onClick={() => addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  title: product.name,
                                })}
                                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm shadow-blue-200 shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {t('btn_add_to_cart')}
                              </button>
                              <button
                                onClick={() => requestNegotiation({ ...product, title: product.name })}
                                className="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-bold text-sm transition-colors border border-purple-200"
                                title="Make an Offer"
                              >
                                <DollarSign className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {filteredProducts.length === 0 && !isLoading && (
                  <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-600">{t('msg_no_products')}</h3>
                    <p className="text-gray-400">{t('msg_adjust_search')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wishlist View */}
        {activeView === 'wishlist' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-current" /> {t('buyer_nav_wishlist')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Filter marketplace products to show only wishlist items */}
              {marketplaceProducts
                .filter((p) => wishlist.includes(p.id))
                .map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    )}
                    <h4 className="font-bold text-gray-800 text-base mb-0.5 line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">🏪 {product.seller}</p>
                    <p className="text-xl font-bold text-gray-800 mb-3">
                      ₹{product.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400">/{product.unit}</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm"
                      >
                        {t('btn_move_to_cart')}
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              }
              {wishlist.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-500">{t('label_wishlist_empty') || 'Your wishlist is empty.'}</p>
                  <button onClick={() => setActiveView('products')} className="text-blue-600 font-bold mt-2 hover:underline">{t('btn_start_shopping') || 'Browse Products'}</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cart View */}
        {activeView === 'cart' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('title_shopping_cart')}</h2>

            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">{t('label_cart_empty')}</p>
                <button
                  onClick={() => setActiveView('products')}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {t('btn_start_shopping')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">{t(item.category)}</p>
                        <p className="text-lg font-bold text-green-600 mt-1">
                          ₹{item.price} / {item.unit}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('title_order_summary')}</h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-gray-700">
                        <span>{t('label_subtotal')}:</span>
                        <span>₹{cartTotals.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>{t('label_tax')}:</span>
                        <span>₹{cartTotals.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>{t('label_delivery_fee')}:</span>
                        <span>₹{cartTotals.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                        <span>{t('label_total')}:</span>
                        <span>₹{cartTotals.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {session.buyerAddress && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-800">{t('label_deliver_to')}</p>
                        <p className="text-sm text-green-700">
                          {session.buyerAddress}, {session.buyerCity}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={placeOrder}
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg shadow-lg transition-colors"
                    >
                      {t('btn_proceed_checkout')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders View */}
        {activeView === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('label_order_history')}</h2>

            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">{t('msg_no_orders')}</p>
                <button
                  onClick={() => setActiveView('products')}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {t('btn_start_shopping')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {t('label_order_sharp')} {order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-700'
                                : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {order.status === 'delivered' && <CheckCircle className="w-4 h-4" />}
                          {order.status === 'shipped' && <Truck className="w-4 h-4" />}
                          {order.status === 'processing' && <Clock className="w-4 h-4" />}
                          {t('status_' + order.status)}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                          ₹{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">{t('label_items')}:</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.productName} x {item.quantity}
                            </span>
                            <span className="font-medium text-gray-900">
                              ₹{item.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2 text-sm text-gray-600">
                        <CreditCard className="w-4 h-4" />
                        <span>{t('payment_' + order.paymentMethod)}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {order.paymentStatus === 'completed' ? t('status_paid') :
                            order.paymentStatus === 'failed' ? t('status_failed') :
                              t('status_pending')}
                        </span>
                      </div>

                      <button
                        onClick={() => downloadReceipt(order)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        {t('btn_download_receipt')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('title_payment_details')}</h2>

            <div className="space-y-3 mb-6">
              {/* UPI Payment Option */}
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${paymentMethod === 'upi'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      } flex items-center justify-center`}
                  >
                    {paymentMethod === 'upi' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-800">{t('label_upi_payment')}</p>
                    <p className="text-sm text-gray-600">GPay, PhonePe, Paytm</p>
                  </div>
                </div>
              </button>

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="pl-8 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                    <input
                      type="text"
                      value={paymentDetails.upiId}
                      onChange={(e) =>
                        setPaymentDetails({ ...paymentDetails, upiId: e.target.value })
                      }
                      placeholder="yourname@paytm"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Demo: Use any format like name@paytm
                    </p>
                  </div>
                </div>
              )}

              {/* Card Payment Option */}
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${paymentMethod === 'card'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      } flex items-center justify-center`}
                  >
                    {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-800">{t('label_card_payment')}</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard, Rupay</p>
                  </div>
                </div>
              </button>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="pl-8 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('label_card_number')}
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\s/g, '')
                          .replace(/(\d{4})/g, '$1 ')
                          .trim();
                        setPaymentDetails({ ...paymentDetails, cardNumber: value });
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('label_cardholder_name')}
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cardName}
                      onChange={(e) =>
                        setPaymentDetails({ ...paymentDetails, cardName: e.target.value })
                      }
                      placeholder="JOHN DOE"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_month')}</label>
                      <select
                        value={paymentDetails.expiryMonth}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, expiryMonth: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <option key={m} value={m.toString().padStart(2, '0')}>
                            {m.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_year')}</label>
                      <select
                        value={paymentDetails.expiryYear}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, expiryYear: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">YY</option>
                        {Array.from({ length: 10 }, (_, i) => 2025 + i).map((y) => (
                          <option key={y} value={y.toString().slice(-2)}>
                            {y.toString().slice(-2)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_cvv')}</label>
                      <input
                        type="password"
                        value={paymentDetails.cvv}
                        onChange={(e) =>
                          setPaymentDetails({ ...paymentDetails, cvv: e.target.value.slice(0, 3) })
                        }
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Demo: Use any test card details</p>
                </div>
              )}

              {/* COD Option */}
              <button
                onClick={() => setPaymentMethod('cod')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${paymentMethod === 'cod'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      } flex items-center justify-center`}
                  >
                    {paymentMethod === 'cod' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-800">{t('label_cod_payment')}</p>
                    <p className="text-sm text-gray-600">{t('msg_pay_when_receive') || 'Pay when you receive'}</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>Total Amount:</span>
                <span className="font-bold text-lg">₹{cartTotals.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCheckout(false);
                  setPaymentDetails({
                    upiId: '',
                    cardNumber: '',
                    cardName: '',
                    expiryMonth: '',
                    expiryYear: '',
                    cvv: '',
                  });
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                {t('btn_cancel')}
              </button>
              <button
                onClick={() => {
                  // Validate payment details
                  if (paymentMethod === 'upi' && !paymentDetails.upiId) {
                    toast.error('Please enter UPI ID');
                    return;
                  }
                  if (paymentMethod === 'card') {
                    if (
                      !paymentDetails.cardNumber ||
                      !paymentDetails.cardName ||
                      !paymentDetails.expiryMonth ||
                      !paymentDetails.expiryYear ||
                      !paymentDetails.cvv
                    ) {
                      toast.error('Please fill all card details');
                      return;
                    }
                  }
                  confirmOrder();
                  setPaymentDetails({
                    upiId: '',
                    cardNumber: '',
                    cardName: '',
                    expiryMonth: '',
                    expiryYear: '',
                    cvv: '',
                  });
                }}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg"
              >
                {paymentMethod === 'cod' ? t('btn_confirm_order') : t('btn_pay_now')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('title_add_address')}</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_phone_number')}</label>
                <input
                  type="tel"
                  value={tempAddress.phone}
                  onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_city')}</label>
                  <input
                    type="text"
                    value={tempAddress.city}
                    onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                    placeholder="Enter your city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_pincode')}</label>
                  <input
                    type="text"
                    value={tempAddress.pincode}
                    onChange={(e) => setTempAddress({ ...tempAddress, pincode: e.target.value })}
                    placeholder="ZIP Code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_state')}</label>
                <input
                  type="text"
                  value={tempAddress.state}
                  onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                  placeholder="State / Province"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_full_address')}</label>
                <textarea
                  value={tempAddress.address}
                  onChange={(e) => setTempAddress({ ...tempAddress, address: e.target.value })}
                  placeholder="Enter your complete address"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                {t('btn_cancel')}
              </button>
              <button
                onClick={saveAddress}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
              >
                {t('btn_save_address')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Negotiation Modal */}
      {showNegotiationModal && negotiationItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{t('title_make_offer')}</h2>
              <p className="text-sm text-gray-500 mt-1">{t('msg_proposed_price')} <span className="font-semibold text-gray-700">{negotiationItem.title}</span></p>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('label_your_price')}</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-bold">₹</span>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-0 text-lg font-bold text-gray-800"
                  placeholder="0.00"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">{t('label_market_price')}: ₹{negotiationItem.price}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNegotiationModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                {t('btn_cancel')}
              </button>
              <button
                onClick={submitOffer}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all active:scale-95"
              >
                {t('btn_send_offer')}
              </button>
            </div>
          </div>
        </div>
      )}

      <FloatingChatbot />
    </div>
  );
}
