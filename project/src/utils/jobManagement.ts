// Job Management Utilities
import { Job, WorkerApplication } from './api';
import toast from 'react-hot-toast';

const JOBS_KEY = 'agri_jobs';
const APPLICATIONS_KEY = 'agri_applications';

// Get all jobs from localStorage
export function getAllJobs(): Job[] {
    const stored = localStorage.getItem(JOBS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save jobs to localStorage
function saveJobs(jobs: Job[]): void {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

// Get job by ID
export function getJobById(jobId: string): Job | null {
    const jobs = getAllJobs();
    return jobs.find((j) => j.id === jobId) || null;
}

// Get jobs by farmer ID
export function getJobsByFarmer(farmerId: string): Job[] {
    const jobs = getAllJobs();
    return jobs.filter((j) => j.farmOwner === farmerId || j.farmOwnerPhone === farmerId);
}

// Create new job
export function createJob(jobData: Omit<Job, 'id' | 'applicants' | 'status'>): Job {
    const jobs = getAllJobs();
    const newJob: Job = {
        ...jobData,
        id: `job_${Date.now()}`,
        applicants: [],
        status: 'active',
    };
    jobs.push(newJob);
    saveJobs(jobs);
    toast.success('Job posted successfully!');
    return newJob;
}

// Update existing job
export function updateJob(jobId: string, updates: Partial<Job>): Job | null {
    const jobs = getAllJobs();
    const index = jobs.findIndex((j) => j.id === jobId);

    if (index === -1) {
        toast.error('Job not found');
        return null;
    }

    // Don't allow editing if job has accepted workers
    const job = jobs[index];
    const hasAcceptedApplicants = job.applicants.some((app) => app.status === 'accepted');

    if (hasAcceptedApplicants && updates.status !== job.status) {
        toast.error('Cannot edit job with accepted workers. Cancel job first.');
        return null;
    }

    jobs[index] = {
        ...job,
        ...updates,
        id: job.id, // Preserve ID
        applicants: job.applicants, // Preserve applicants unless explicitly updated
    };

    saveJobs(jobs);
    toast.success('Job updated successfully!');
    return jobs[index];
}

// Delete job
export function deleteJob(jobId: string): boolean {
    const jobs = getAllJobs();
    const job = jobs.find((j) => j.id === jobId);

    if (!job) {
        toast.error('Job not found');
        return false;
    }

    // Don't allow deletion if job has accepted workers
    const hasAcceptedApplicants = job.applicants.some((app) => app.status === 'accepted');

    if (hasAcceptedApplicants) {
        toast.error('Cannot delete job with accepted workers. Cancel job first.');
        return false;
    }

    const filtered = jobs.filter((j) => j.id !== jobId);
    saveJobs(filtered);
    toast.success('Job deleted successfully!');
    return true;
}

// Change job status
export function changeJobStatus(
    jobId: string,
    status: 'draft' | 'active' | 'in-progress' | 'completed' | 'cancelled'
): Job | null {
    const jobs = getAllJobs();
    const index = jobs.findIndex((j) => j.id === jobId);

    if (index === -1) {
        toast.error('Job not found');
        return null;
    }

    jobs[index].status = status;
    saveJobs(jobs);
    toast.success(`Job status changed to ${status}`);
    return jobs[index];
}

// Get jobs by status
export function getJobsByStatus(status: Job['status']): Job[] {
    const jobs = getAllJobs();
    return jobs.filter((j) => j.status === status);
}

// Get all applications
export function getAllApplications(): WorkerApplication[] {
    const stored = localStorage.getItem(APPLICATIONS_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save applications
function saveApplications(applications: WorkerApplication[]): void {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
}

// Get applications for a job
export function getJobApplications(jobId: string): WorkerApplication[] {
    const applications = getAllApplications();
    return applications.filter((app) => app.jobId === jobId);
}

// Get applications by worker
export function getWorkerApplications(workerId: string): WorkerApplication[] {
    const applications = getAllApplications();
    return applications.filter((app) => app.workerId === workerId);
}

// Create application
export function createApplication(
    jobId: string,
    workerData: {
        id: string;
        name: string;
        phone: string;
        rating: number;
        message?: string;
    }
): WorkerApplication | null {
    const job = getJobById(jobId);
    if (!job) {
        toast.error('Job not found');
        return null;
    }

    if (job.status !== 'active') {
        toast.error('This job is no longer accepting applications');
        return null;
    }

    const applications = getAllApplications();

    // Check if already applied
    const alreadyApplied = applications.some(
        (app) => app.jobId === jobId && app.workerId === workerData.id
    );

    if (alreadyApplied) {
        toast.error('You have already applied for this job');
        return null;
    }

    const newApplication: WorkerApplication = {
        id: `app_${Date.now()}`,
        jobId,
        workerId: workerData.id,
        workerName: workerData.name,
        workerPhone: workerData.phone,
        workerRating: workerData.rating,
        appliedAt: new Date().toISOString(),
        status: 'pending',
        message: workerData.message,
    };

    applications.push(newApplication);
    saveApplications(applications);
    toast.success('Application submitted successfully!');
    return newApplication;
}

// Update application status
export function updateApplicationStatus(
    applicationId: string,
    status: 'pending' | 'accepted' | 'rejected' | 'withdrawn',
    responseMessage?: string
): WorkerApplication | null {
    const applications = getAllApplications();
    const index = applications.findIndex((app) => app.id === applicationId);

    if (index === -1) {
        toast.error('Application not found');
        return null;
    }

    applications[index] = {
        ...applications[index],
        status,
        respondedAt: new Date().toISOString(),
        responseMessage,
    };

    saveApplications(applications);

    const statusMessages = {
        accepted: 'Application accepted!',
        rejected: 'Application rejected',
        withdrawn: 'Application withdrawn',
        pending: 'Application status updated',
    };

    toast.success(statusMessages[status]);
    return applications[index];
}

// Withdraw application
export function withdrawApplication(
    applicationId: string,
    reason?: string
): WorkerApplication | null {
    const applications = getAllApplications();
    const index = applications.findIndex((app) => app.id === applicationId);

    if (index === -1) {
        toast.error('Application not found');
        return null;
    }

    if (applications[index].status === 'accepted') {
        toast.error('Cannot withdraw accepted application. Contact the farmer.');
        return null;
    }

    applications[index] = {
        ...applications[index],
        status: 'withdrawn',
        withdrawnAt: new Date().toISOString(),
        withdrawalReason: reason,
    };

    saveApplications(applications);
    toast.success('Application withdrawn successfully');
    return applications[index];
}

// Sync applications with jobs (update job.applicants array)
export function syncApplicationsWithJobs(): void {
    const jobs = getAllJobs();
    const applications = getAllApplications();

    jobs.forEach((job) => {
        job.applicants = applications.filter((app) => app.jobId === job.id);
    });

    saveJobs(jobs);
}
