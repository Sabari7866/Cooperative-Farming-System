export type UserRole = 'farmer' | 'worker' | 'buyer' | 'renter' | 'admin';

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

const STORAGE_KEY = 'uzhavan_x_auth_session';
const USERS_KEY = 'uzhavan_x_users';

// Quick cleanup for demo users if they still exist in local storage
try {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) {
    const users = JSON.parse(raw) as any[];
    const filtered = users.filter(u => !['farmer@demo.com', 'worker@demo.com', 'buyer@demo.com', 'renter@demo.com'].includes(u.email));
    if (filtered.length !== users.length) {
      localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    }
  }
} catch (e) {
  // ignore
}

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
  localStorage.removeItem('agri_lands');
  localStorage.removeItem('agri_jobs');
  localStorage.removeItem('agri_orders');
  localStorage.removeItem('workerOffers');
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
  const raw = localStorage.getItem(USERS_KEY);
  let users: StoredUser[] = [];

  try {
    users = raw ? JSON.parse(raw) : [];
  } catch {
    users = [];
  }

  return users;
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function naiveHash(input: string) {
  // Simple but better hash for demo purposes
  let hash = 0;
  const salt = 'uzhavan_x_demo_salt_2026';
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
  clearSession();
  saveSession(session);
  if (session.id) {
    localStorage.setItem("currentUserId", session.id);
  }
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
  clearSession();
  saveSession(session);
  if (session.id) {
    localStorage.setItem("currentUserId", session.id);
  }
  return session;
}
