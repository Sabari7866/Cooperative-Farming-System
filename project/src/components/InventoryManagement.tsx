import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { useToast } from './Toast';

interface InventoryItem {
    id: string;
    name: string;
    category: 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Equipment' | 'Other';
    quantity: number;
    unit: string;
    minStock: number;
    price: number;
    lastUpdated: string;
}

const STORAGE_KEY = 'agrismart_inventory';

export default function InventoryManagement() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Seeds' as InventoryItem['category'],
        quantity: '',
        unit: 'kg',
        minStock: '',
        price: '',
    });
    const { addToast } = useToast();

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setInventory(JSON.parse(saved));
        } else {
            // Initialize with sample data
            const sampleData: InventoryItem[] = [
                {
                    id: '1',
                    name: 'Rice Seeds (Basmati)',
                    category: 'Seeds',
                    quantity: 50,
                    unit: 'kg',
                    minStock: 20,
                    price: 80,
                    lastUpdated: new Date().toISOString(),
                },
                {
                    id: '2',
                    name: 'NPK Fertilizer',
                    category: 'Fertilizers',
                    quantity: 15,
                    unit: 'bags',
                    minStock: 10,
                    price: 450,
                    lastUpdated: new Date().toISOString(),
                },
                {
                    id: '3',
                    name: 'Pesticide Spray',
                    category: 'Pesticides',
                    quantity: 8,
                    unit: 'liters',
                    minStock: 5,
                    price: 350,
                    lastUpdated: new Date().toISOString(),
                },
            ];
            setInventory(sampleData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
        }
    }, []);

    const saveInventory = (newInventory: InventoryItem[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newInventory));
        setInventory(newInventory);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.quantity || !formData.minStock || !formData.price) {
            addToast({
                type: 'error',
                title: 'Missing Fields',
                message: 'Please fill all required fields',
            });
            return;
        }

        if (editingId) {
            const updated = inventory.map((item) =>
                item.id === editingId
                    ? {
                        ...item,
                        name: formData.name,
                        category: formData.category,
                        quantity: parseFloat(formData.quantity),
                        unit: formData.unit,
                        minStock: parseFloat(formData.minStock),
                        price: parseFloat(formData.price),
                        lastUpdated: new Date().toISOString(),
                    }
                    : item,
            );
            saveInventory(updated);
            addToast({
                type: 'success',
                title: 'Updated',
                message: 'Item updated successfully',
            });
        } else {
            const newItem: InventoryItem = {
                id: Date.now().toString(),
                name: formData.name,
                category: formData.category,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                minStock: parseFloat(formData.minStock),
                price: parseFloat(formData.price),
                lastUpdated: new Date().toISOString(),
            };
            saveInventory([...inventory, newItem]);
            addToast({
                type: 'success',
                title: 'Added',
                message: 'Item added to inventory',
            });
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: '', category: 'Seeds', quantity: '', unit: 'kg', minStock: '', price: '' });
        setShowForm(false);
        setEditingId(null);
    };

    const editItem = (item: InventoryItem) => {
        setFormData({
            name: item.name,
            category: item.category,
            quantity: item.quantity.toString(),
            unit: item.unit,
            minStock: item.minStock.toString(),
            price: item.price.toString(),
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const deleteItem = (id: string) => {
        saveInventory(inventory.filter((item) => item.id !== id));
        addToast({
            type: 'success',
            title: 'Deleted',
            message: 'Item removed from inventory',
        });
    };

    const updateStock = (id: string, change: number) => {
        const updated = inventory.map((item) =>
            item.id === id
                ? {
                    ...item,
                    quantity: Math.max(0, item.quantity + change),
                    lastUpdated: new Date().toISOString(),
                }
                : item,
        );
        saveInventory(updated);
    };

    const lowStockItems = inventory.filter((item) => item.quantity <= item.minStock);
    const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            Seeds: 'Sprout',
            Fertilizers: 'TestTube',
            Pesticides: 'Bug',
            Equipment: 'Wrench',
            Other: 'Package',
        };
        return icons[category] || 'Package';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Icon name="Package" className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Inventory Management</h3>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Icon name="Plus" className="w-4 h-4" />
                    <span>Add Item</span>
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Items</div>
                    <div className="text-2xl font-bold text-purple-600">{inventory.length}</div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Low Stock</div>
                    <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Value</div>
                    <div className="text-2xl font-bold text-green-600">₹{totalValue.toLocaleString()}</div>
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-start space-x-2">
                        <Icon name="AlertTriangle" className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-semibold text-orange-800 dark:text-orange-300 mb-1">Low Stock Alert</div>
                            <div className="text-sm text-orange-700 dark:text-orange-400">
                                {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} below minimum stock level
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                                placeholder="e.g., Rice Seeds"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as InventoryItem['category'] })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                            >
                                <option value="Seeds">Seeds</option>
                                <option value="Fertilizers">Fertilizers</option>
                                <option value="Pesticides">Pesticides</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                            >
                                <option value="kg">kg</option>
                                <option value="bags">bags</option>
                                <option value="liters">liters</option>
                                <option value="pieces">pieces</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Stock</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.minStock}
                                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Price per Unit (₹)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                            required
                        />
                    </div>

                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            {editingId ? 'Update Item' : 'Add Item'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Inventory List */}
            <div className="space-y-3">
                {inventory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Icon name="Package" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No inventory items yet. Add your first item!</p>
                    </div>
                ) : (
                    inventory.map((item) => (
                        <div
                            key={item.id}
                            className={`p-4 rounded-lg border-2 ${item.quantity <= item.minStock
                                    ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20'
                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon name={getCategoryIcon(item.category)} className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800 dark:text-white">{item.name}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.category}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => editItem(item)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Icon name="Edit" className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Icon name="Trash2" className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400">Stock</div>
                                    <div className="font-semibold text-gray-800 dark:text-white">
                                        {item.quantity} {item.unit}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400">Min Stock</div>
                                    <div className="font-semibold text-gray-800 dark:text-white">
                                        {item.minStock} {item.unit}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400">Price</div>
                                    <div className="font-semibold text-gray-800 dark:text-white">₹{item.price}/{item.unit}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 dark:text-gray-400">Value</div>
                                    <div className="font-semibold text-green-600">₹{(item.quantity * item.price).toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center space-x-2">
                                <button
                                    onClick={() => updateStock(item.id, -1)}
                                    className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
                                >
                                    <Icon name="Minus" className="w-4 h-4 inline mr-1" />
                                    Use
                                </button>
                                <button
                                    onClick={() => updateStock(item.id, 1)}
                                    className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors text-sm font-medium"
                                >
                                    <Icon name="Plus" className="w-4 h-4 inline mr-1" />
                                    Add
                                </button>
                                {item.quantity <= item.minStock && (
                                    <span className="text-xs text-orange-600 dark:text-orange-400 flex items-center ml-auto">
                                        <Icon name="AlertTriangle" className="w-3 h-3 mr-1" />
                                        Reorder needed
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
