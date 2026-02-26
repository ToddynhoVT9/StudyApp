// store.ts — Zustand global store (placeholder Fase 0)
// Será implementado na Fase 2

import { create } from 'zustand'

interface AppStore {
  ready: boolean
  setReady: (v: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  ready: false,
  setReady: (v) => set({ ready: v }),
}))
