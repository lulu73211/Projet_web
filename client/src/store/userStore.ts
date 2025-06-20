import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types";

type UserStore = {
    user: User | null;
    setUser: (user: User | null) => void;
    updateUser: (partial: Partial<User>) => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user) => set({ user }),
            updateUser: (partial) => {
                const currentUser = get().user;
                if (!currentUser) return;
                set({ user: { ...currentUser, ...partial } });
            },
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
