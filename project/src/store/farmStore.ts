import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FarmState {
    financials: Array<{ id: string, type: 'INCOME' | 'EXPENSE', amount: number, date: string, category: string, description: string }>;
    sensorData: any;
    setSensorData: (data: any) => void;
    addTransaction: (tx: any) => void;
}

export const useFarmStore = create<FarmState>()(
    persist(
        (set) => ({
            financials: [],
            sensorData: null,
            setSensorData: (data) => set({ sensorData: data }),
            addTransaction: (tx) => set((state) => ({ financials: [...state.financials, tx] }))
        }),
        { name: 'farm-storage' }
    )
);
