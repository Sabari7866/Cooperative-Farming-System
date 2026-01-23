export type UserRole = 'farmer' | 'worker' | 'buyer' | 'renter';

export interface AuthSession {
  id?: string;
  role: UserRole;
  name: string;
  email?: string;
  phone?: string;
  altPhone?: string;
  farmName?: string;
  farmLocation?: string;
  farmLatitude?: number;
  farmLongitude?: number;
  farmAreaAcres?: number;
  currentCrops?: string[];
  // Worker details
  workerLocation?: string;
  workerTravelDistance?: number;
  workerSkills?: string[];
  // Buyer details
  buyerAddressLine1?: string;
  buyerAddressLine2?: string;
  buyerCity?: string;
  buyerState?: string;
  buyerPincode?: string;
  buyerAddress?: string;
  // Renter details
  businessName?: string;
  businessAddress?: string;
  serviceRadiusKm?: number;
  equipmentList?: Array<{ name: string; hourlyRate: string }>;
}

const STORAGE_KEY = 'agri_auth_session';
const USERS_KEY = 'agri_users';

export function saveSession(session: AuthSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function updateSession(update: Partial<AuthSession>) {
  const current = getSession() || ({} as AuthSession);
  const next = { ...current, ...update } as AuthSession;
  saveSession(next);
  return next;
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated() {
  return !!getSession();
}

export function hasRole(required: UserRole) {
  const s = getSession();
  return s?.role === required;
}

export function logoutAndRedirect() {
  clearSession();
  window.location.replace('/login');
}

// Simple local user store (demo only)
export interface StoredUser {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  phone?: string;
  altPhone?: string;
  farmName?: string;
  farmLocation?: string;
  farmLatitude?: number;
  farmLongitude?: number;
  farmAreaAcres?: number;
  currentCrops?: string[];
  // Worker details
  workerLocation?: string;
  workerTravelDistance?: number;
  workerSkills?: string[];
  // Buyer details
  buyerAddressLine1?: string;
  buyerAddressLine2?: string;
  buyerCity?: string;
  buyerState?: string;
  buyerPincode?: string;
  buyerAddress?: string;
  // Renter details
  businessName?: string;
  businessAddress?: string;
  serviceRadiusKm?: number;
  equipmentList?: Array<{ name: string; hourlyRate: string }>;
  passwordHash: string; // naive hash for demo
}

function readUsers(): StoredUser[] {
  // Define defaults
  const demoUsers: StoredUser[] = [
    {
      id: 'demo-farmer',
      role: 'farmer',
      name: 'Demo Farmer',
      email: 'farmer@demo.com',
      phone: '9876543210',
      passwordHash: naiveHash('password'),
    },
    {
      id: 'demo-worker',
      role: 'worker',
      name: 'Demo Worker',
      email: 'worker@demo.com',
      phone: '9876543211',
      passwordHash: naiveHash('password'),
    },
    {
      id: 'demo-buyer',
      role: 'buyer',
      name: 'Demo Buyer',
      email: 'buyer@demo.com',
      phone: '9876543212',
      passwordHash: naiveHash('password'),
      buyerAddressLine1: 'Demo Address',
      buyerCity: 'Demo City',
      buyerState: 'Demo State',
      buyerPincode: '123456',
    },
    {
      id: 'demo-renter',
      role: 'renter',
      name: 'Demo Renter',
      email: 'renter@demo.com',
      phone: '9876543213',
      passwordHash: naiveHash('password'),
      businessName: 'Demo Equipment Rental',
      businessAddress: 'Demo Business Address',
      serviceRadiusKm: 50,
    },
  ];

  const raw = localStorage.getItem(USERS_KEY);
  let users: StoredUser[] = [];

  try {
    users = raw ? JSON.parse(raw) : [];
  } catch {
    users = [];
  }

  // Ensure demo users exist and have correct passwords
  let changed = false;
  demoUsers.forEach(demoUser => {
    const existingIndex = users.findIndex(u => u.email === demoUser.email);
    if (existingIndex === -1) {
      users.push(demoUser);
      changed = true;
    } else {
      // Optional: Reset password to 'password' if it doesn't match, to ensure demo login works
      // We preserve other fields (like profile updates) but enforce the login credential
      if (users[existingIndex].passwordHash !== demoUser.passwordHash) {
        users[existingIndex].passwordHash = demoUser.passwordHash;
        changed = true;
      }
    }
  });

  if (changed || !raw) {
    writeUsers(users);
  }

  return users;
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function naiveHash(input: string) {
  // Simple but better hash for demo purposes
  let hash = 0;
  const salt = 'agri_demo_salt_2024';
  const saltedInput = input + salt;

  for (let i = 0; i < saltedInput.length; i++) {
    const char = saltedInput.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Make it positive and add some complexity
  hash = Math.abs(hash);
  hash = hash ^ (hash >>> 16); // Mix bits

  return hash.toString(36); // Convert to base36 for shorter string
}

export function registerUser(user: Omit<StoredUser, 'id' | 'passwordHash'> & { password: string }) {
  const users = readUsers();
  const exists = users.find(
    (u) => u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase(),
  );
  if (exists) throw new Error('User already exists');
  const id = Date.now().toString();
  const newUser: StoredUser = { ...user, id, passwordHash: naiveHash(user.password) } as StoredUser;
  writeUsers([newUser, ...users]);
  const session: AuthSession = { ...newUser } as unknown as AuthSession;
  delete (session as any).passwordHash;
  saveSession(session);
  return session;
}

export function loginUser(identifier: string, password: string): AuthSession | null {
  const users = readUsers();
  const user = users.find(
    (u) =>
      (u.email && u.email.toLowerCase() === identifier.toLowerCase()) ||
      (u.phone && u.phone === identifier),
  );
  if (!user) return null;
  if (user.passwordHash !== naiveHash(password)) return null;
  const session: AuthSession = { ...user } as unknown as AuthSession;
  delete (session as any).passwordHash;
  saveSession(session);
  return session;
}
