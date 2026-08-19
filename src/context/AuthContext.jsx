import { createContext, useContext, useState, useCallback } from 'react';

// ── Seeded users (simulate a database) ──────────────────────────────────────
const SEED_USERS = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@gymforce.com',
    password: 'Admin@123',
    role: 'master_admin',
    gym: 'GymForce HQ',
    avatar: 'AU',
    phone: '+1 555-0001',
  },
  {
    id: 'u2',
    name: 'Mike Stone',
    email: 'trainer@gymforce.com',
    password: 'Trainer@123',
    role: 'trainer',
    gym: 'GymForce HQ',
    avatar: 'MS',
    phone: '+1 555-0002',
    specialty: 'Strength & Conditioning',
  },
  {
    id: 'u3',
    name: 'Sarah Staff',
    email: 'staff@gymforce.com',
    password: 'Staff@123',
    role: 'staff',
    gym: 'GymForce HQ',
    avatar: 'SS',
    phone: '+1 555-0003',
  },
];

// ── Role config ──────────────────────────────────────────────────────────────
export const ROLE_CONFIG = {
  master_admin: {
    label: 'Master Admin',
    color: '#39FF14',
    badge: 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
    allowedRoutes: [
      '/dashboard',
      '/dashboard/members',
      '/dashboard/plans',
      '/dashboard/attendance',
      '/dashboard/trainers',
      '/dashboard/notifications',
      '/dashboard/reports',
    ],
  },
  trainer: {
    label: 'Trainer',
    color: '#00D4FF',
    badge: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20',
    allowedRoutes: [
      '/dashboard',
      '/dashboard/attendance',
      '/dashboard/members',
      '/dashboard/notifications',
    ],
  },
  staff: {
    label: 'Staff',
    color: '#FF6B00',
    badge: 'bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/20',
    allowedRoutes: [
      '/dashboard',
      '/dashboard/members',
      '/dashboard/attendance',
      '/dashboard/plans',
      '/dashboard/notifications',
    ],
  },
};

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  // Load from sessionStorage so refresh keeps user logged in during session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('gymforce_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('gymforce_users');
      return saved ? JSON.parse(saved) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  const saveUsers = useCallback((updated) => {
    setUsers(updated);
    localStorage.setItem('gymforce_users', JSON.stringify(updated));
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback((email, password, selectedRole) => {
    const emailLower = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === emailLower);

    if (!user) {
      return { success: false, error: 'No account found with this email. Please register first.' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Map the UI role label to internal role key
    const roleMap = {
      'Master Admin': 'master_admin',
      'Trainer': 'trainer',
      'Staff': 'staff',
    };
    const expectedRole = roleMap[selectedRole];

    if (expectedRole && user.role !== expectedRole) {
      return {
        success: false,
        error: `This account is registered as "${ROLE_CONFIG[user.role]?.label}". Please select the correct role.`,
      };
    }

    const sessionUser = { ...user };
    delete sessionUser.password; // never store password in session
    setCurrentUser(sessionUser);
    sessionStorage.setItem('gymforce_user', JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  }, [users]);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback((formData) => {
    const emailLower = formData.email.trim().toLowerCase();
    const exists = users.find(u => u.email.toLowerCase() === emailLower);

    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    if (formData.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }

    // Map UI role to internal
    const roleMap = {
      'Master Admin': 'master_admin',
      'Trainer': 'trainer',
      'Staff': 'staff',
    };

    const newUser = {
      id: `u${Date.now()}`,
      name: formData.name.trim(),
      email: emailLower,
      password: formData.password,
      role: roleMap[formData.role] || 'staff',
      gym: formData.gym || 'GymForce',
      avatar: formData.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      phone: formData.phone || '',
    };

    const updated = [...users, newUser];
    saveUsers(updated);

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    sessionStorage.setItem('gymforce_user', JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  }, [users, saveUsers]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('gymforce_user');
  }, []);

  // ── Can access route ──────────────────────────────────────────────────────
  const canAccess = useCallback((path) => {
    if (!currentUser) return false;
    const config = ROLE_CONFIG[currentUser.role];
    if (!config) return false;
    return config.allowedRoutes.some(r => path === r || path.startsWith(r + '/'));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, canAccess, ROLE_CONFIG }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
