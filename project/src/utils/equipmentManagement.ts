// Equipment & Rental Management Utilities
import toast from 'react-hot-toast';

export interface Equipment {
    id: string;
    title: string;
    description: string;
    category: 'equipment' | 'tools' | 'storage' | 'transport';
    pricePerDay: number;
    ownerId: string;
    ownerName: string;
    ownerPhone: string;
    location: string;
    deliveryAvailable: boolean;
    status: 'available' | 'rented' | 'maintenance' | 'unavailable';
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    images?: string[];
    createdAt: string;
    updatedAt: string;
    rating?: number;
    totalRentals?: number;
}

export interface RentalRequest {
    id: string;
    equipmentId: string;
    equipmentName: string;
    ownerId: string;
    ownerName: string;
    renterId: string;
    renterName: string;
    renterPhone: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    pricePerDay: number;
    totalPrice: number;
    deliveryRequired: boolean;
    status: 'pending' | 'accepted' | 'rejected' | 'active' | 'completed' | 'cancelled';
    createdAt: string;
    message?: string;
    responseMessage?: string;
}

const EQUIPMENT_KEY = 'agri_equipment';
const RENTAL_REQUESTS_KEY = 'agri_rental_requests';

// ===== EQUIPMENT MANAGEMENT =====

// Get all equipment
export function getAllEquipment(): Equipment[] {
    const stored = localStorage.getItem(EQUIPMENT_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save equipment
function saveEquipment(equipment: Equipment[]): void {
    localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(equipment));
}

// Get equipment by ID
export function getEquipmentById(equipmentId: string): Equipment | null {
    const equipment = getAllEquipment();
    return equipment.find((e) => e.id === equipmentId) || null;
}

// Get equipment by owner
export function getEquipmentByOwner(ownerId: string): Equipment[] {
    const equipment = getAllEquipment();
    return equipment.filter((e) => e.ownerId === ownerId);
}

// Create new equipment
export function createEquipment(
    equipmentData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'totalRentals'>
): Equipment {
    const equipment = getAllEquipment();

    const newEquipment: Equipment = {
        ...equipmentData,
        id: `equip_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'available',
        totalRentals: 0,
    };

    equipment.push(newEquipment);
    saveEquipment(equipment);
    toast.success('Equipment listed successfully!');
    return newEquipment;
}

// Update equipment
export function updateEquipment(equipmentId: string, updates: Partial<Equipment>): Equipment | null {
    const equipment = getAllEquipment();
    const index = equipment.findIndex((e) => e.id === equipmentId);

    if (index === -1) {
        toast.error('Equipment not found');
        return null;
    }

    equipment[index] = {
        ...equipment[index],
        ...updates,
        id: equipment[index].id, // Preserve ID
        updatedAt: new Date().toISOString(),
    };

    saveEquipment(equipment);
    toast.success('Equipment updated successfully!');
    return equipment[index];
}

// Delete equipment
export function deleteEquipment(equipmentId: string): boolean {
    const equipment = getAllEquipment();
    const item = equipment.find((e) => e.id === equipmentId);

    if (!item) {
        toast.error('Equipment not found');
        return false;
    }

    // Check if equipment has active rentals
    const activeRentals = getRentalsByEquipment(equipmentId).filter(
        (r) => r.status === 'active' || r.status === 'accepted'
    );

    if (activeRentals.length > 0) {
        toast.error('Cannot delete equipment with active rentals');
        return false;
    }

    const filtered = equipment.filter((e) => e.id !== equipmentId);
    saveEquipment(filtered);
    toast.success('Equipment removed successfully!');
    return true;
}

// Update equipment status
export function updateEquipmentStatus(
    equipmentId: string,
    status: Equipment['status']
): Equipment | null {
    return updateEquipment(equipmentId, { status });
}

// Get available equipment
export function getAvailableEquipment(): Equipment[] {
    const equipment = getAllEquipment();
    return equipment.filter((e) => e.status === 'available');
}

// ===== RENTAL REQUEST MANAGEMENT =====

// Get all rental requests
export function getAllRentalRequests(): RentalRequest[] {
    const stored = localStorage.getItem(RENTAL_REQUESTS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save rental requests
function saveRentalRequests(requests: RentalRequest[]): void {
    localStorage.setItem(RENTAL_REQUESTS_KEY, JSON.stringify(requests));
}

// Get rental request by ID
export function getRentalRequestById(requestId: string): RentalRequest | null {
    const requests = getAllRentalRequests();
    return requests.find((r) => r.id === requestId) || null;
}

// Get rentals by equipment
export function getRentalsByEquipment(equipmentId: string): RentalRequest[] {
    const requests = getAllRentalRequests();
    return requests.filter((r) => r.equipmentId === equipmentId);
}

// Get rentals by owner (equipment owner)
export function getRentalsByOwner(ownerId: string): RentalRequest[] {
    const requests = getAllRentalRequests();
    return requests.filter((r) => r.ownerId === ownerId);
}

// Get rentals by renter
export function getRentalsByRenter(renterId: string): RentalRequest[] {
    const requests = getAllRentalRequests();
    return requests.filter((r) => r.renterId === renterId);
}

// Create rental request
export function createRentalRequest(
    requestData: Omit<RentalRequest, 'id' | 'createdAt' | 'status'>
): RentalRequest | null {
    const equipment = getEquipmentById(requestData.equipmentId);

    if (!equipment) {
        toast.error('Equipment not found');
        return null;
    }

    if (equipment.status !== 'available') {
        toast.error('Equipment is not available for rent');
        return null;
    }

    const requests = getAllRentalRequests();

    const newRequest: RentalRequest = {
        ...requestData,
        id: `rental_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
    };

    requests.push(newRequest);
    saveRentalRequests(requests);
    toast.success('Rental request sent successfully!');
    return newRequest;
}

// Update rental request status
export function updateRentalStatus(
    requestId: string,
    status: RentalRequest['status'],
    responseMessage?: string
): RentalRequest | null {
    const requests = getAllRentalRequests();
    const index = requests.findIndex((r) => r.id === requestId);

    if (index === -1) {
        toast.error('Rental request not found');
        return null;
    }

    const request = requests[index];

    // Update equipment status based on rental status
    if (status === 'accepted') {
        updateEquipmentStatus(request.equipmentId, 'rented');
    } else if (status === 'completed' || status === 'cancelled') {
        updateEquipmentStatus(request.equipmentId, 'available');
    }

    requests[index] = {
        ...request,
        status,
        responseMessage,
    };

    saveRentalRequests(requests);

    const statusMessages = {
        accepted: 'Rental request accepted!',
        rejected: 'Rental request rejected',
        active: 'Rental is now active',
        completed: 'Rental completed',
        cancelled: 'Rental cancelled',
        pending: 'Rental status updated',
    };

    toast.success(statusMessages[status]);
    return requests[index];
}

// Cancel rental request
export function cancelRentalRequest(requestId: string): RentalRequest | null {
    return updateRentalStatus(requestId, 'cancelled');
}

// Complete rental
export function completeRental(requestId: string): RentalRequest | null {
    const request = updateRentalStatus(requestId, 'completed');

    if (request) {
        // Increment total rentals for equipment
        const equipment = getEquipmentById(request.equipmentId);
        if (equipment) {
            updateEquipment(equipment.id, {
                totalRentals: (equipment.totalRentals || 0) + 1,
            });
        }
    }

    return request;
}

// Get active rentals
export function getActiveRentals(ownerId?: string): RentalRequest[] {
    const requests = ownerId ? getRentalsByOwner(ownerId) : getAllRentalRequests();
    return requests.filter((r) => r.status === 'active' || r.status === 'accepted');
}

// Calculate earnings from rentals
export function calculateRentalEarnings(ownerId: string): {
    total: number;
    pending: number;
    completed: number;
} {
    const rentals = getRentalsByOwner(ownerId);

    const completed = rentals
        .filter((r) => r.status === 'completed')
        .reduce((sum, r) => sum + r.totalPrice, 0);

    const pending = rentals
        .filter((r) => r.status === 'active' || r.status === 'accepted')
        .reduce((sum, r) => sum + r.totalPrice, 0);

    return {
        total: completed + pending,
        pending,
        completed,
    };
}
