// src/renderer/lib/store.ts
import { create } from 'zustand'
import { api } from './api'
import type { Block, ProgressSummary, Status } from '@shared/types'

interface RoadmapStore {
  blocks:        Block[]
  progress:      ProgressSummary | null
  activePointId: number | null

  // actions
  loadAll:           () => Promise<void>
  updatePointStatus: (pointId: number, status: Status) => Promise<void>
  setActivePoint:    (id: number | null) => void
}

export const useRoadmapStore = create<RoadmapStore>((set) => ({
  blocks:        [],
  progress:      null,
  activePointId: null,

  loadAll: async () => {
    const [blocks, progress] = await Promise.all([
      api.roadmap.getAll(),
      api.roadmap.getProgress(),
    ])
    set({ blocks, progress })
  },

  updatePointStatus: async (pointId, status) => {
    // Persiste no banco
    await api.roadmap.updateStatus(pointId, status)
    // Optimistic update — atualiza a UI imediatamente
    set((state) => ({
      blocks: state.blocks.map((b) => ({
        ...b,
        points: b.points.map((p) =>
          p.id === pointId ? { ...p, status } : p,
        ),
      })),
    }))
    // Recarrega progresso para a StatusBar
    const progress = await api.roadmap.getProgress()
    set({ progress })
  },

  setActivePoint: (id) => set({ activePointId: id }),
}))
