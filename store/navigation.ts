import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NavigationStore {
  lastPath: string
  setLastPath: (path: string) => void
  clearLastPath: () => void
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set) => ({
      lastPath: '/',
      setLastPath: (path: string) => set({ lastPath: path }),
      clearLastPath: () => set({ lastPath: '/' })
    }),
    {
      name: 'navigation-storage',
    }
  )
) 