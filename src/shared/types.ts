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
  block_id: number
  title: string
  orderIndex: number
  order_index: number
  weeks: string
  status: Status
  updatedAt: string
  updated_at: string
  block_title?: string
}

export interface Note {
  id: number
  pointId: number
  point_id: number
  content: string
  createdAt: string
  created_at: string
  updatedAt: string
  updated_at: string
  point_title?: string
}

export interface Study {
  id: number
  pointId: number
  point_id: number
  title: string
  url: string | null
  type: 'text' | 'link' | 'video' | 'book'
  createdAt: string
  created_at: string
}

export interface Activity {
  id: number
  pointId: number
  point_id: number
  description: string
  done: boolean
  createdAt: string
  created_at: string
  doneAt: string | null
  done_at: string | null
}

export interface ProgressSummary {
  total: number
  done: number
  inProgress: number
  percent: number
  byBlock: Record<number, { total: number; done: number }>
}
