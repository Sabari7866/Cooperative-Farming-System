// Order Management Utilities for Buyer Dashboard
import toast from 'react-hot-toast';

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    category: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    buyerId: string;
    buyerName: string;
    buyerPhone: string;
    date: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: 'upi' | 'card' | 'cod';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    deliveryAddress: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
}

export interface Wishlist {
    id: string;
    buyerId: string;
    productId: string;
    productName: string;
    price: number;
    addedAt: string;
}

export interface SavedAddress {
    id: string;
    buyerId: string;
    label: string; // 'Home', 'Work', etc.
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
}

const ORDERS_KEY = 'agri_orders';
const WISHLIST_KEY = 'agri_wishlist';
const ADDRESSES_KEY = 'agri_saved_addresses';

// ===== ORDER MANAGEMENT =====

// Get all orders
export function getAllOrders(): Order[] {
    const stored = localStorage.getItem(ORDERS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save orders
function saveOrders(orders: Order[]): void {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// Get order by ID
export function getOrderById(orderId: string): Order | null {
    const orders = getAllOrders();
    return orders.find((o) => o.id === orderId) || null;
}

// Get orders by buyer
export function getOrdersByBuyer(buyerId: string): Order[] {
    const orders = getAllOrders();
    return orders.filter((o) => o.buyerId === buyerId);
}

// Create new order
export function createOrder(
    orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'paymentStatus'>
): Order {
    const orders = getAllOrders();
    const orderNumber = `ORD${Date.now().toString().slice(-8)}`;

    const newOrder: Order = {
        ...orderData,
        id: `order_${Date.now()}`,
        orderNumber,
        date: new Date().toISOString(),
        status: 'pending',
        paymentStatus: 'pending',
    };

    orders.push(newOrder);
    saveOrders(orders);
    toast.success(`Order placed successfully! Order #${orderNumber}`);
    return newOrder;
}

// Update order status
export function updateOrderStatus(
    orderId: string,
    status: Order['status']
): Order | null {
    const orders = getAllOrders();
    const index = orders.findIndex((o) => o.id === orderId);

    if (index === -1) {
        toast.error('Order not found');
        return null;
    }

    const order = orders[index];

    // Validation: Can't change status if already delivered or cancelled
    if (order.status === 'delivered' || order.status === 'cancelled') {
        toast.error(`Cannot update ${order.status} order`);
        return null;
    }

    // Add timestamps
    const updates: Partial<Order> = { status };
    if (status === 'delivered') {
        updates.deliveredAt = new Date().toISOString();
    }

    orders[index] = {
        ...order,
        ...updates,
    };

    saveOrders(orders);

    const statusMessages = {
        pending: 'Order is pending',
        confirmed: 'Order confirmed!',
        processing: 'Order is being processed',
        shipped: 'Order has been shipped!',
        delivered: 'Order delivered successfully!',
        cancelled: 'Order cancelled',
    };

    toast.success(statusMessages[status]);
    return orders[index];
}

// Cancel order
export function cancelOrder(orderId: string, reason?: string): Order | null {
    const orders = getAllOrders();
    const index = orders.findIndex((o) => o.id === orderId);

    if (index === -1) {
        toast.error('Order not found');
        return null;
    }

    const order = orders[index];

    // Can only cancel if not shipped or delivered
    if (order.status === 'shipped' || order.status === 'delivered') {
        toast.error('Cannot cancel shipped or delivered orders');
        return null;
    }

    orders[index] = {
        ...order,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason,
        paymentStatus: order.paymentStatus === 'completed' ? 'refunded' : 'failed',
    };

    saveOrders(orders);
    toast.success('Order cancelled successfully');
    return orders[index];
}

// Update payment status
export function updatePaymentStatus(
    orderId: string,
    paymentStatus: Order['paymentStatus']
): Order | null {
    const orders = getAllOrders();
    const index = orders.findIndex((o) => o.id === orderId);

    if (index === -1) {
        toast.error('Order not found');
        return null;
    }

    orders[index].paymentStatus = paymentStatus;

    // Auto-confirm order if payment completed
    if (paymentStatus === 'completed' && orders[index].status === 'pending') {
        orders[index].status = 'confirmed';
    }

    saveOrders(orders);
    return orders[index];
}

// Get orders by status
export function getOrdersByStatus(buyerId: string, status: Order['status']): Order[] {
    const orders = getOrdersByBuyer(buyerId);
    return orders.filter((o) => o.status === status);
}

// Get recent orders
export function getRecentOrders(buyerId: string, limit: number = 5): Order[] {
    const orders = getOrdersByBuyer(buyerId);
    return orders
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
}

// ===== WISHLIST MANAGEMENT =====

// Get wishlist
export function getWishlist(buyerId: string): Wishlist[] {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (!stored) return [];
    try {
        const allWishlists: Wishlist[] = JSON.parse(stored);
        return allWishlists.filter((w) => w.buyerId === buyerId);
    } catch {
        return [];
    }
}

// Add to wishlist
export function addToWishlist(
    buyerId: string,
    productId: string,
    productName: string,
    price: number
): Wishlist {
    const stored = localStorage.getItem(WISHLIST_KEY);
    const wishlists: Wishlist[] = stored ? JSON.parse(stored) : [];

    // Check if already in wishlist
    const exists = wishlists.some(
        (w) => w.buyerId === buyerId && w.productId === productId
    );

    if (exists) {
        toast.info('Product already in wishlist');
        return wishlists.find((w) => w.buyerId === buyerId && w.productId === productId)!;
    }

    const newWishlistItem: Wishlist = {
        id: `wish_${Date.now()}`,
        buyerId,
        productId,
        productName,
        price,
        addedAt: new Date().toISOString(),
    };

    wishlists.push(newWishlistItem);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlists));
    toast.success('Added to wishlist!');
    return newWishlistItem;
}

// Remove from wishlist
export function removeFromWishlist(wishlistId: string): boolean {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (!stored) return false;

    const wishlists: Wishlist[] = JSON.parse(stored);
    const filtered = wishlists.filter((w) => w.id !== wishlistId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
    toast.success('Removed from wishlist');
    return true;
}

// ===== SAVED ADDRESSES MANAGEMENT =====

// Get saved addresses
export function getSavedAddresses(buyerId: string): SavedAddress[] {
    const stored = localStorage.getItem(ADDRESSES_KEY);
    if (!stored) return [];
    try {
        const allAddresses: SavedAddress[] = JSON.parse(stored);
        return allAddresses.filter((a) => a.buyerId === buyerId);
    } catch {
        return [];
    }
}

// Add address
export function addAddress(
    addressData: Omit<SavedAddress, 'id'>
): SavedAddress {
    const stored = localStorage.getItem(ADDRESSES_KEY);
    const addresses: SavedAddress[] = stored ? JSON.parse(stored) : [];

    // If this is set as default, unset other defaults
    if (addressData.isDefault) {
        addresses.forEach((addr) => {
            if (addr.buyerId === addressData.buyerId) {
                addr.isDefault = false;
            }
        });
    }

    const newAddress: SavedAddress = {
        ...addressData,
        id: `addr_${Date.now()}`,
    };

    addresses.push(newAddress);
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
    toast.success('Address saved successfully!');
    return newAddress;
}

// Update address
export function updateAddress(addressId: string, updates: Partial<SavedAddress>): SavedAddress | null {
    const stored = localStorage.getItem(ADDRESSES_KEY);
    if (!stored) return null;

    const addresses: SavedAddress[] = JSON.parse(stored);
    const index = addresses.findIndex((a) => a.id === addressId);

    if (index === -1) {
        toast.error('Address not found');
        return null;
    }

    // If setting as default, unset other defaults
    if (updates.isDefault) {
        addresses.forEach((addr, i) => {
            if (i !== index && addr.buyerId === addresses[index].buyerId) {
                addr.isDefault = false;
            }
        });
    }

    addresses[index] = {
        ...addresses[index],
        ...updates,
    };

    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
    toast.success('Address updated successfully!');
    return addresses[index];
}

// Delete address
export function deleteAddress(addressId: string): boolean {
    const stored = localStorage.getItem(ADDRESSES_KEY);
    if (!stored) return false;

    const addresses: SavedAddress[] = JSON.parse(stored);
    const filtered = addresses.filter((a) => a.id !== addressId);
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(filtered));
    toast.success('Address deleted successfully');
    return true;
}

// Get default address
export function getDefaultAddress(buyerId: string): SavedAddress | null {
    const addresses = getSavedAddresses(buyerId);
    return addresses.find((a) => a.isDefault) || null;
}
