// Tipos compartilhados entre main process e renderer

export type Status = 'pending' | 'in_progress' | 'done'

export interface Block {
  id: number
  title: string
  orderIndex: number
  duration: string
  description: string
  points: RoadMapPoint[]
}

export interface RoadMapPoint {
  id: number
  blockId: number
  title: string
  orderIndex: number
  weeks: string
  status: Status
  updatedAt: string
  blockTitle?: string
}

export interface Note {
  id: number
  pointId: number
  content: string
  createdAt: string
  updatedAt: string
  pointTitle?: string
}

export interface Study {
  id: number
  pointId: number
  title: string
  url: string | null
  type: 'text' | 'link' | 'video' | 'book'
  createdAt: string
}

export interface Activity {
  id: number
  pointId: number
  description: string
  done: boolean
  createdAt: string
  doneAt: string | null
}

export interface ProgressSummary {
  total: number
  done: number
  inProgress: number
  percent: number
  byBlock: Record<number, { total: number; done: number }>
}
