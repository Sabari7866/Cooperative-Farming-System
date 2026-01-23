// Worker Earnings Tracker Utility
import toast from 'react-hot-toast';

export interface WorkerEarning {
    id: string;
    workerId: string;
    jobId: string;
    jobTitle: string;
    farmOwner: string;
    amount: number;
    status: 'pending' | 'paid' | 'cancelled';
    completedAt: string;
    paidAt?: string;
    paymentMethod?: 'cash' | 'upi' | 'bank_transfer';
    notes?: string;
}

export interface EarningsSummary {
    workerId: string;
    totalEarnings: number;
    pendingPayments: number;
    paidAmount: number;
    cancelledAmount: number;
    totalJobs: number;
    completedJobs: number;
    averageEarningPerJob: number;
    thisMonthEarnings: number;
    lastMonthEarnings: number;
}

export interface MonthlyEarnings {
    month: string;
    year: number;
    totalEarnings: number;
    jobsCompleted: number;
    averagePerJob: number;
}

const EARNINGS_KEY = 'agri_worker_earnings';

// Get all earnings
export function getAllEarnings(): WorkerEarning[] {
    const stored = localStorage.getItem(EARNINGS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save earnings
function saveEarnings(earnings: WorkerEarning[]): void {
    localStorage.setItem(EARNINGS_KEY, JSON.stringify(earnings));
}

// Get earnings by worker
export function getWorkerEarnings(workerId: string): WorkerEarning[] {
    const earnings = getAllEarnings();
    return earnings.filter((e) => e.workerId === workerId);
}

// Add new earning
export function addEarning(
    workerId: string,
    jobId: string,
    jobTitle: string,
    farmOwner: string,
    amount: number
): WorkerEarning {
    const earnings = getAllEarnings();

    const newEarning: WorkerEarning = {
        id: `earning_${Date.now()}`,
        workerId,
        jobId,
        jobTitle,
        farmOwner,
        amount,
        status: 'pending',
        completedAt: new Date().toISOString(),
    };

    earnings.push(newEarning);
    saveEarnings(earnings);
    toast.success(`Earning added: ₹${amount}`);
    return newEarning;
}

// Mark earning as paid
export function markAsPaid(
    earningId: string,
    paymentMethod: 'cash' | 'upi' | 'bank_transfer'
): WorkerEarning | null {
    const earnings = getAllEarnings();
    const index = earnings.findIndex((e) => e.id === earningId);

    if (index === -1) {
        toast.error('Earning not found');
        return null;
    }

    earnings[index] = {
        ...earnings[index],
        status: 'paid',
        paidAt: new Date().toISOString(),
        paymentMethod,
    };

    saveEarnings(earnings);
    toast.success('Payment marked as received!');
    return earnings[index];
}

// Cancel earning
export function cancelEarning(earningId: string, reason?: string): WorkerEarning | null {
    const earnings = getAllEarnings();
    const index = earnings.findIndex((e) => e.id === earningId);

    if (index === -1) {
        toast.error('Earning not found');
        return null;
    }

    earnings[index] = {
        ...earnings[index],
        status: 'cancelled',
        notes: reason,
    };

    saveEarnings(earnings);
    toast.info('Earning cancelled');
    return earnings[index];
}

// Calculate earnings summary
export function calculateEarningsSummary(workerId: string): EarningsSummary {
    const earnings = getWorkerEarnings(workerId);

    const totalEarnings = earnings
        .filter((e) => e.status !== 'cancelled')
        .reduce((sum, e) => sum + e.amount, 0);

    const pendingPayments = earnings
        .filter((e) => e.status === 'pending')
        .reduce((sum, e) => sum + e.amount, 0);

    const paidAmount = earnings
        .filter((e) => e.status === 'paid')
        .reduce((sum, e) => sum + e.amount, 0);

    const cancelledAmount = earnings
        .filter((e) => e.status === 'cancelled')
        .reduce((sum, e) => sum + e.amount, 0);

    const completedJobs = earnings.filter((e) => e.status !== 'cancelled').length;
    const averageEarningPerJob = completedJobs > 0 ? totalEarnings / completedJobs : 0;

    // Calculate this month's earnings
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEarnings = earnings
        .filter(
            (e) =>
                e.status !== 'cancelled' &&
                new Date(e.completedAt) >= thisMonthStart
        )
        .reduce((sum, e) => sum + e.amount, 0);

    // Calculate last month's earnings
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthEarnings = earnings
        .filter(
            (e) =>
                e.status !== 'cancelled' &&
                new Date(e.completedAt) >= lastMonthStart &&
                new Date(e.completedAt) <= lastMonthEnd
        )
        .reduce((sum, e) => sum + e.amount, 0);

    return {
        workerId,
        totalEarnings,
        pendingPayments,
        paidAmount,
        cancelledAmount,
        totalJobs: earnings.length,
        completedJobs,
        averageEarningPerJob,
        thisMonthEarnings,
        lastMonthEarnings,
    };
}

// Get monthly earnings breakdown
export function getMonthlyEarnings(workerId: string, months: number = 12): MonthlyEarnings[] {
    const earnings = getWorkerEarnings(workerId).filter((e) => e.status !== 'cancelled');
    const monthlyData: { [key: string]: MonthlyEarnings } = {};

    earnings.forEach((earning) => {
        const date = new Date(earning.completedAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                month: date.toLocaleDateString('en-US', { month: 'long' }),
                year: date.getFullYear(),
                totalEarnings: 0,
                jobsCompleted: 0,
                averagePerJob: 0,
            };
        }

        monthlyData[monthKey].totalEarnings += earning.amount;
        monthlyData[monthKey].jobsCompleted += 1;
    });

    // Calculate averages
    Object.values(monthlyData).forEach((month) => {
        month.averagePerJob = month.totalEarnings / month.jobsCompleted;
    });

    // Sort by date and return last N months
    return Object.values(monthlyData)
        .sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return new Date(`${b.month} 1, ${b.year}`).getTime() - new Date(`${a.month} 1, ${a.year}`).getTime();
        })
        .slice(0, months);
}

// Get earnings by status
export function getEarningsByStatus(
    workerId: string,
    status: 'pending' | 'paid' | 'cancelled'
): WorkerEarning[] {
    const earnings = getWorkerEarnings(workerId);
    return earnings.filter((e) => e.status === status);
}

// Get earnings by date range
export function getEarningsByDateRange(
    workerId: string,
    startDate: Date,
    endDate: Date
): WorkerEarning[] {
    const earnings = getWorkerEarnings(workerId);
    return earnings.filter((e) => {
        const earningDate = new Date(e.completedAt);
        return earningDate >= startDate && earningDate <= endDate;
    });
}

// Calculate tax (simple calculation - 10% for demo)
export function calculateTax(workerId: string, year: number): {
    totalEarnings: number;
    taxableAmount: number;
    estimatedTax: number;
} {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    const yearEarnings = getEarningsByDateRange(workerId, yearStart, yearEnd);

    const totalEarnings = yearEarnings
        .filter((e) => e.status === 'paid')
        .reduce((sum, e) => sum + e.amount, 0);

    // Simple tax calculation (demo)
    const taxExemptLimit = 250000; // ₹2.5 lakh
    const taxableAmount = Math.max(0, totalEarnings - taxExemptLimit);
    const estimatedTax = taxableAmount * 0.1; // 10% tax rate (simplified)

    return {
        totalEarnings,
        taxableAmount,
        estimatedTax,
    };
}

// Export earnings to CSV format
export function exportEarningsToCSV(workerId: string): string {
    const earnings = getWorkerEarnings(workerId);

    const headers = ['Date', 'Job Title', 'Farm Owner', 'Amount', 'Status', 'Payment Method', 'Paid Date'];
    const rows = earnings.map((e) => [
        new Date(e.completedAt).toLocaleDateString(),
        e.jobTitle,
        e.farmOwner,
        `₹${e.amount}`,
        e.status,
        e.paymentMethod || '-',
        e.paidAt ? new Date(e.paidAt).toLocaleDateString() : '-',
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
}

// Download earnings report
export function downloadEarningsReport(workerId: string): void {
    const csv = exportEarningsToCSV(workerId);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Earnings report downloaded!');
}
