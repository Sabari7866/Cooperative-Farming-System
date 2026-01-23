// Land Management Utilities
import { Land } from './api';
import toast from 'react-hot-toast';

const LANDS_KEY = 'agri_lands';

// Get all lands from localStorage
export function getAllLands(): Land[] {
    const stored = localStorage.getItem(LANDS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save lands to localStorage
function saveLands(lands: Land[]): void {
    localStorage.setItem(LANDS_KEY, JSON.stringify(lands));
}

// Get land by ID
export function getLandById(landId: string): Land | null {
    const lands = getAllLands();
    return lands.find((l) => l.id === landId) || null;
}

// Get lands by farmer ID
export function getLandsByFarmer(farmerId: string): Land[] {
    const lands = getAllLands();
    // Assuming we add ownerId field to Land interface
    return lands.filter((l) => (l as any).ownerId === farmerId);
}

// Create new land
export function createLand(
    landData: Omit<Land, 'id' | 'lastUpdated'>,
    ownerId: string
): Land {
    const lands = getAllLands();
    const newLand: Land = {
        ...landData,
        id: `land_${Date.now()}`,
        lastUpdated: 'Just now',
        ...(ownerId && { ownerId } as any),
    };
    lands.push(newLand);
    saveLands(lands);
    toast.success('Land added successfully!');
    return newLand;
}

// Update existing land
export function updateLand(landId: string, updates: Partial<Land>): Land | null {
    const lands = getAllLands();
    const index = lands.findIndex((l) => l.id === landId);

    if (index === -1) {
        toast.error('Land not found');
        return null;
    }

    lands[index] = {
        ...lands[index],
        ...updates,
        id: lands[index].id, // Preserve ID
        lastUpdated: 'Just now',
    };

    saveLands(lands);
    toast.success('Land updated successfully!');
    return lands[index];
}

// Delete land
export function deleteLand(landId: string): boolean {
    const lands = getAllLands();
    const land = lands.find((l) => l.id === landId);

    if (!land) {
        toast.error('Land not found');
        return false;
    }

    // Optional: Add validation (e.g., can't delete if crops are growing)
    if (land.status === 'growing' || land.status === 'flowering') {
        const confirmDelete = window.confirm(
            'This land has crops growing. Are you sure you want to delete it?'
        );
        if (!confirmDelete) return false;
    }

    const filtered = lands.filter((l) => l.id !== landId);
    saveLands(filtered);
    toast.success('Land deleted successfully!');
    return true;
}

// Update land status
export function updateLandStatus(
    landId: string,
    status: Land['status']
): Land | null {
    return updateLand(landId, { status });
}

// Get lands by status
export function getLandsByStatus(status: Land['status']): Land[] {
    const lands = getAllLands();
    return lands.filter((l) => l.status === status);
}

// Get lands by crop
export function getLandsByCrop(crop: string): Land[] {
    const lands = getAllLands();
    return lands.filter((l) => l.crop.toLowerCase() === crop.toLowerCase());
}

// Calculate total acreage
export function getTotalAcreage(farmerId?: string): number {
    const lands = farmerId ? getLandsByFarmer(farmerId) : getAllLands();
    return lands.reduce((total, land) => total + land.acreage, 0);
}

// Get lands ready for harvest
export function getLandsReadyForHarvest(): Land[] {
    return getLandsByStatus('harvest');
}
