// Profile Management Utility for Workers
import toast from 'react-hot-toast';

export interface WorkerProfile {
    id: string;
    userId: string;
    name: string;
    phone: string;
    email?: string;
    photo?: string;
    bio?: string;

    // Skills & Experience
    skills: string[];
    experience: number; // years
    certifications: Certification[];
    languages: string[];

    // Work Preferences
    hourlyRate: number;
    availability: 'available' | 'busy' | 'unavailable';
    workPreferences: {
        maxDistance: number; // km
        preferredCrops: string[];
        preferredTasks: string[];
        workingHours: {
            start: string; // "06:00"
            end: string; // "18:00"
        };
        daysAvailable: string[]; // ["Monday", "Tuesday", ...]
    };

    // Statistics
    rating: number;
    totalJobs: number;
    completedJobs: number;
    reviews: number;

    // Metadata
    createdAt: string;
    updatedAt: string;
    verified: boolean;
}

export interface Certification {
    id: string;
    name: string;
    issuedBy: string;
    issuedDate: string;
    expiryDate?: string;
    certificateNumber?: string;
    verified: boolean;
}

const PROFILES_KEY = 'agri_worker_profiles';

// Get all profiles
export function getAllProfiles(): WorkerProfile[] {
    const stored = localStorage.getItem(PROFILES_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save profiles
function saveProfiles(profiles: WorkerProfile[]): void {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

// Get profile by user ID
export function getProfileByUserId(userId: string): WorkerProfile | null {
    const profiles = getAllProfiles();
    return profiles.find((p) => p.userId === userId) || null;
}

// Create new profile
export function createProfile(
    userId: string,
    name: string,
    phone: string
): WorkerProfile {
    const profiles = getAllProfiles();

    const newProfile: WorkerProfile = {
        id: `profile_${Date.now()}`,
        userId,
        name,
        phone,
        skills: [],
        experience: 0,
        certifications: [],
        languages: ['English'],
        hourlyRate: 0,
        availability: 'available',
        workPreferences: {
            maxDistance: 50,
            preferredCrops: [],
            preferredTasks: [],
            workingHours: {
                start: '06:00',
                end: '18:00',
            },
            daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
        rating: 0,
        totalJobs: 0,
        completedJobs: 0,
        reviews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        verified: false,
    };

    profiles.push(newProfile);
    saveProfiles(profiles);
    toast.success('Profile created successfully!');
    return newProfile;
}

// Update profile
export function updateProfile(
    userId: string,
    updates: Partial<WorkerProfile>
): WorkerProfile | null {
    const profiles = getAllProfiles();
    const index = profiles.findIndex((p) => p.userId === userId);

    if (index === -1) {
        toast.error('Profile not found');
        return null;
    }

    profiles[index] = {
        ...profiles[index],
        ...updates,
        id: profiles[index].id, // Preserve ID
        userId: profiles[index].userId, // Preserve user ID
        updatedAt: new Date().toISOString(),
    };

    saveProfiles(profiles);
    toast.success('Profile updated successfully!');
    return profiles[index];
}

// Update skills
export function updateSkills(userId: string, skills: string[]): WorkerProfile | null {
    return updateProfile(userId, { skills });
}

// Add skill
export function addSkill(userId: string, skill: string): WorkerProfile | null {
    const profile = getProfileByUserId(userId);
    if (!profile) {
        toast.error('Profile not found');
        return null;
    }

    if (profile.skills.includes(skill)) {
        toast.info('Skill already added');
        return profile;
    }

    const updatedSkills = [...profile.skills, skill];
    return updateProfile(userId, { skills: updatedSkills });
}

// Remove skill
export function removeSkill(userId: string, skill: string): WorkerProfile | null {
    const profile = getProfileByUserId(userId);
    if (!profile) {
        toast.error('Profile not found');
        return null;
    }

    const updatedSkills = profile.skills.filter((s) => s !== skill);
    return updateProfile(userId, { skills: updatedSkills });
}

// Add certification
export function addCertification(
    userId: string,
    certificationData: Omit<Certification, 'id' | 'verified'>
): WorkerProfile | null {
    const profile = getProfileByUserId(userId);
    if (!profile) {
        toast.error('Profile not found');
        return null;
    }

    const newCertification: Certification = {
        ...certificationData,
        id: `cert_${Date.now()}`,
        verified: false,
    };

    const updatedCertifications = [...profile.certifications, newCertification];
    return updateProfile(userId, { certifications: updatedCertifications });
}

// Remove certification
export function removeCertification(
    userId: string,
    certificationId: string
): WorkerProfile | null {
    const profile = getProfileByUserId(userId);
    if (!profile) {
        toast.error('Profile not found');
        return null;
    }

    const updatedCertifications = profile.certifications.filter(
        (c) => c.id !== certificationId
    );
    return updateProfile(userId, { certifications: updatedCertifications });
}

// Update hourly rate
export function updateHourlyRate(userId: string, rate: number): WorkerProfile | null {
    if (rate < 0) {
        toast.error('Hourly rate cannot be negative');
        return null;
    }
    return updateProfile(userId, { hourlyRate: rate });
}

// Update availability
export function updateAvailability(
    userId: string,
    availability: 'available' | 'busy' | 'unavailable'
): WorkerProfile | null {
    return updateProfile(userId, { availability });
}

// Update work preferences
export function updateWorkPreferences(
    userId: string,
    preferences: Partial<WorkerProfile['workPreferences']>
): WorkerProfile | null {
    const profile = getProfileByUserId(userId);
    if (!profile) {
        toast.error('Profile not found');
        return null;
    }

    const updatedPreferences = {
        ...profile.workPreferences,
        ...preferences,
    };

    return updateProfile(userId, { workPreferences: updatedPreferences });
}

// Update photo
export function updatePhoto(userId: string, photoUrl: string): WorkerProfile | null {
    return updateProfile(userId, { photo: photoUrl });
}

// Update bio
export function updateBio(userId: string, bio: string): WorkerProfile | null {
    return updateProfile(userId, { bio });
}

// Get available workers
export function getAvailableWorkers(): WorkerProfile[] {
    const profiles = getAllProfiles();
    return profiles.filter((p) => p.availability === 'available');
}

// Get workers by skill
export function getWorkersBySkill(skill: string): WorkerProfile[] {
    const profiles = getAllProfiles();
    return profiles.filter((p) => p.skills.includes(skill));
}

// Get workers by rating
export function getWorkersByRating(minRating: number): WorkerProfile[] {
    const profiles = getAllProfiles();
    return profiles.filter((p) => p.rating >= minRating);
}

// Search workers
export function searchWorkers(query: string): WorkerProfile[] {
    const profiles = getAllProfiles();
    const lowerQuery = query.toLowerCase();

    return profiles.filter(
        (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.skills.some((s) => s.toLowerCase().includes(lowerQuery)) ||
            p.bio?.toLowerCase().includes(lowerQuery)
    );
}

// Get profile completion percentage
export function getProfileCompletion(userId: string): number {
    const profile = getProfileByUserId(userId);
    if (!profile) return 0;

    let completed = 0;
    const total = 10;

    if (profile.name) completed++;
    if (profile.phone) completed++;
    if (profile.email) completed++;
    if (profile.photo) completed++;
    if (profile.bio) completed++;
    if (profile.skills.length > 0) completed++;
    if (profile.experience > 0) completed++;
    if (profile.certifications.length > 0) completed++;
    if (profile.hourlyRate > 0) completed++;
    if (profile.languages.length > 0) completed++;

    return Math.round((completed / total) * 100);
}

// Verify profile
export function verifyProfile(userId: string): WorkerProfile | null {
    return updateProfile(userId, { verified: true });
}

// Update statistics (called after job completion)
export function updateProfileStats(
    userId: string,
    stats: {
        totalJobs?: number;
        completedJobs?: number;
        rating?: number;
        reviews?: number;
    }
): WorkerProfile | null {
    const profile = getProfileByUserId(userId);
    if (!profile) {
        toast.error('Profile not found');
        return null;
    }

    return updateProfile(userId, {
        totalJobs: stats.totalJobs ?? profile.totalJobs,
        completedJobs: stats.completedJobs ?? profile.completedJobs,
        rating: stats.rating ?? profile.rating,
        reviews: stats.reviews ?? profile.reviews,
    });
}
