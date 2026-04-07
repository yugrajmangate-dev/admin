import { create } from "zustand";

export type UserRole = "super_admin" | "vendor" | null;

interface AdminStore {
  role: UserRole;
  uid: string | null;
  email: string | null;
  setRole: (role: UserRole) => void;
  setUser: (uid: string, email: string) => void;
  clearUser: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  role: null,
  uid: null,
  email: null,
  setRole: (role) => set({ role }),
  setUser: (uid, email) => set({ uid, email }),
  clearUser: () => set({ role: null, uid: null, email: null }),
}));

// Email(s) that are hardcoded as super admins
export const SUPER_ADMIN_EMAILS = ["main@admin.com"];
