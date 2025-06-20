// store/useCounterStore.ts
import { create } from 'zustand'
import type {User} from '../types'

type UserStore = {
    user: User | null
    setUser: (user: User | null) => void
    updateUser: (partial: Partial<User>) => void
}

export const useUserStore = create<UserStore>((set) => ({
    user: null, // 👈 pas de valeur par défaut
    setUser: (user) => set({ user }),
    updateUser: (partial) =>
        set((state) => {
            if (!state.user) return state // ou throw new Error('user not set')
            return { user: { ...state.user, ...partial } }
        }),
}))
