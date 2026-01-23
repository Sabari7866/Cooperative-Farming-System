// Product Management Utilities
import toast from 'react-hot-toast';

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    quantity: number;
    farmerId: string;
    farmerName: string;
    farmerPhone: string;
    location: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    status: 'available' | 'low-stock' | 'out-of-stock' | 'discontinued';
    images?: string[];
    rating?: number;
    sold?: number;
}

const PRODUCTS_KEY = 'agri_products';

// Get all products from localStorage
export function getAllProducts(): Product[] {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save products to localStorage
function saveProducts(products: Product[]): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// Get product by ID
export function getProductById(productId: string): Product | null {
    const products = getAllProducts();
    return products.find((p) => p.id === productId) || null;
}

// Get products by farmer
export function getProductsByFarmer(farmerId: string): Product[] {
    const products = getAllProducts();
    return products.filter((p) => p.farmerId === farmerId);
}

// Create new product
export function createProduct(
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'sold'>
): Product {
    const products = getAllProducts();

    const newProduct: Product = {
        ...productData,
        id: `product_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: productData.quantity > 10 ? 'available' : productData.quantity > 0 ? 'low-stock' : 'out-of-stock',
        sold: 0,
    };

    products.push(newProduct);
    saveProducts(products);
    toast.success('Product added to marketplace!');
    return newProduct;
}

// Update existing product
export function updateProduct(productId: string, updates: Partial<Product>): Product | null {
    const products = getAllProducts();
    const index = products.findIndex((p) => p.id === productId);

    if (index === -1) {
        toast.error('Product not found');
        return null;
    }

    // Auto-update status based on quantity
    let status = products[index].status;
    if (updates.quantity !== undefined) {
        if (updates.quantity === 0) {
            status = 'out-of-stock';
        } else if (updates.quantity <= 10) {
            status = 'low-stock';
        } else {
            status = 'available';
        }
    }

    products[index] = {
        ...products[index],
        ...updates,
        id: products[index].id, // Preserve ID
        status: updates.status || status,
        updatedAt: new Date().toISOString(),
    };

    saveProducts(products);
    toast.success('Product updated successfully!');
    return products[index];
}

// Delete product
export function deleteProduct(productId: string): boolean {
    const products = getAllProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) {
        toast.error('Product not found');
        return false;
    }

    const filtered = products.filter((p) => p.id !== productId);
    saveProducts(filtered);
    toast.success('Product removed from marketplace!');
    return true;
}

// Update product quantity (after sale)
export function updateProductQuantity(productId: string, quantitySold: number): Product | null {
    const product = getProductById(productId);
    if (!product) {
        toast.error('Product not found');
        return null;
    }

    const newQuantity = Math.max(0, product.quantity - quantitySold);
    const newSold = (product.sold || 0) + quantitySold;

    return updateProduct(productId, {
        quantity: newQuantity,
        sold: newSold,
    });
}

// Mark product as discontinued
export function discontinueProduct(productId: string): Product | null {
    return updateProduct(productId, { status: 'discontinued' });
}

// Get products by status
export function getProductsByStatus(status: Product['status']): Product[] {
    const products = getAllProducts();
    return products.filter((p) => p.status === status);
}

// Get products by category
export function getProductsByCategory(category: string): Product[] {
    const products = getAllProducts();
    return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

// Search products
export function searchProducts(query: string): Product[] {
    const products = getAllProducts();
    const lowerQuery = query.toLowerCase();
    return products.filter(
        (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
    );
}

// Get available products (for marketplace)
export function getAvailableProducts(): Product[] {
    const products = getAllProducts();
    return products.filter((p) => p.status === 'available' || p.status === 'low-stock');
}

// Get low stock products (for farmer alerts)
export function getLowStockProducts(farmerId: string): Product[] {
    const products = getProductsByFarmer(farmerId);
    return products.filter((p) => p.status === 'low-stock');
}
