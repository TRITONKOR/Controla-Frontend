import type { User } from "@/entities/user/model/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isInitialized: boolean;
    setAuth: (user: User, accessToken: string) => void;
    clearAuth: () => void;
    setInitialized: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isInitialized: false,
            setAuth: (user, accessToken) => set({ user, accessToken }),
            clearAuth: () => set({ user: null, accessToken: null }),
            setInitialized: () => set({ isInitialized: true }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user }),
        },
    ),
);
