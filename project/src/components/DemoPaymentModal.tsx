import { useState } from 'react';
import { X, CreditCard, Smartphone, Banknote, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (paymentData: PaymentData) => void;
  title?: string;
}

interface PaymentData {
  method: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
  transactionId: string;
  timestamp: string;
  amount: number;
  details: any;
}

export default function DemoPaymentModal({
  isOpen,
  onClose,
  amount,
  onSuccess,
  title = 'Complete Payment',
}: DemoPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<
    'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'
  >('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // UPI details
  const [upiId, setUpiId] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  // Net Banking
  const [selectedBank, setSelectedBank] = useState('');

  // Wallet
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletPhone, setWalletPhone] = useState('');

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
  ];

  const wallets = [
    { id: 'paytm', name: 'Paytm', icon: '💰' },
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'googlepay', name: 'Google Pay', icon: '🔵' },
    { id: 'mobikwik', name: 'MobiKwik', icon: '💳' },
    { id: 'freecharge', name: 'Freecharge', icon: '⚡' },
  ];

  const handlePayment = async () => {
    // Validation
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryMonth || !expiryYear || !cvv) {
        toast.error('Please fill all card details');
        return;
      }
    }

    if (paymentMethod === 'netbanking' && !selectedBank) {
      toast.error('Please select a bank');
      return;
    }

    if (paymentMethod === 'wallet' && (!selectedWallet || !walletPhone)) {
      toast.error('Please select wallet and enter phone number');
      return;
    }

    // Simulate payment processing
    setIsProcessing(true);
    toast.loading('Processing payment...', { id: 'payment' });

    setTimeout(() => {
      const paymentData: PaymentData = {
        method: paymentMethod,
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        amount: amount,
        details: {
          upiId: paymentMethod === 'upi' ? upiId : undefined,
          cardLast4: paymentMethod === 'card' ? cardNumber.slice(-4) : undefined,
          bank: paymentMethod === 'netbanking' ? selectedBank : undefined,
          wallet: paymentMethod === 'wallet' ? selectedWallet : undefined,
        },
      };

      toast.success('Payment successful!', { id: 'payment' });
      setIsProcessing(false);
      onSuccess(paymentData);
      resetForm();
      onClose();
    }, 2000);
  };

  const resetForm = () => {
    setUpiId('');
    setCardNumber('');
    setCardName('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
    setSelectedBank('');
    setSelectedWallet('');
    setWalletPhone('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
          <p className="text-3xl font-bold text-green-600">₹{amount.toFixed(2)}</p>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'upi'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Smartphone className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">UPI</p>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Card</p>
            </button>

            <button
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'netbanking'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Banknote className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Net Banking</p>
            </button>

            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'wallet'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-2 block">💰</span>
              <p className="text-sm font-medium">Wallet</p>
            </button>

            <button
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'cod'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">COD</p>
            </button>
          </div>
        </div>

        {/* Payment Forms */}
        <div className="mb-6">
          {/* UPI Form */}
          {paymentMethod === 'upi' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">Enter UPI Details</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@paytm"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Demo: Use any UPI ID format</p>
              </div>
            </div>
          )}

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">Enter Card Details</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\s/g, '')
                      .replace(/(\d{4})/g, '$1 ')
                      .trim();
                    setCardNumber(value);
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="JOHN DOE"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Demo: Use any test card details</p>
            </div>
          )}

          {/* Net Banking Form */}
          {paymentMethod === 'netbanking' && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">Select Your Bank</h4>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {banks.map((bank) => (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedBank === bank
                        ? 'border-green-600 bg-green-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-800">{bank}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">Demo: Select any bank</p>
            </div>
          )}

          {/* Wallet Form */}
          {paymentMethod === 'wallet' && (
            <div className="space-y-4 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">Select Wallet</h4>
              <div className="grid grid-cols-2 gap-3">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => setSelectedWallet(wallet.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedWallet === wallet.id
                        ? 'border-yellow-600 bg-yellow-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{wallet.icon}</span>
                    <p className="text-sm font-medium">{wallet.name}</p>
                  </button>
                ))}
              </div>

              {selectedWallet && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">Demo: Select wallet and enter phone</p>
            </div>
          )}

          {/* COD */}
          {paymentMethod === 'cod' && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Cash on Delivery</h4>
                  <p className="text-sm text-gray-600">
                    Pay with cash when your order is delivered. Please keep exact change handy.
                  </p>
                  <p className="text-sm text-orange-600 mt-2">
                    ✓ No payment needed now
                    <br />
                    ✓ Pay at doorstep
                    <br />✓ Safe and convenient
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 font-bold shadow-lg transition-all disabled:opacity-50"
          >
            {isProcessing
              ? 'Processing...'
              : paymentMethod === 'cod'
                ? 'Confirm Order'
                : `Pay ₹${amount.toFixed(2)}`}
          </button>
        </div>

        {/* Demo Notice */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 text-center">
            🔒 <strong>Demo Mode:</strong> This is a simulation. No actual payment will be
            processed.
          </p>
        </div>
      </div>
    </div>
  );
}

export type { PaymentData };
