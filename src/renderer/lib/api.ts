// api.ts — wrapper tipado sobre window.electronAPI (IPC)
// Será preenchido progressivamente nas fases 1+

import type {
  Block,
  Note,
  Activity,
  Study,
  ProgressSummary,
  Status,
} from '@shared/types'

declare global {
  interface Window {
    electronAPI: {
      invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
    }
  }
}

function invoke<T>(channel: string, ...args: unknown[]): Promise<T> {
  return window.electronAPI.invoke(channel, ...args) as Promise<T>
}

export const api = {
  roadmap: {
    getAll: () =>
      invoke<Block[]>('roadmap:getAll'),
    getProgress: () =>
      invoke<ProgressSummary>('roadmap:getProgress'),
    updateStatus: (id: number, status: Status) =>
      invoke<void>('roadmap:updateStatus', id, status),
  },
  notes: {
    getByPoint: (pointId: number) =>
      invoke<Note | null>('notes:getByPoint', pointId),
    save: (pointId: number, content: string) =>
      invoke<Note>('notes:save', pointId, content),
    getAll: () =>
      invoke<Note[]>('notes:getAll'),
    search: (query: string) =>
      invoke<Note[]>('notes:search', query),
    delete: (id: number) =>
      invoke<void>('notes:delete', id),
  },
  activities: {
    getByPoint: (pointId: number) =>
      invoke<Activity[]>('activities:getByPoint', pointId),
    add: (pointId: number, description: string) =>
      invoke<Activity>('activities:add', pointId, description),
    toggle: (id: number) =>
      invoke<Activity>('activities:toggle', id),
    remove: (id: number) =>
      invoke<void>('activities:remove', id),
  },
  studies: {
    getByPoint: (pointId: number) =>
      invoke<Study[]>('studies:getByPoint', pointId),
    add: (
      pointId: number,
      title: string,
      url: string | null,
      type: Study['type'],
    ) => invoke<Study>('studies:add', pointId, title, url, type),
    remove: (id: number) =>
      invoke<void>('studies:remove', id),
  },
  settings: {
    getStore: () => invoke<any>('settings:getStore'),
    setStore: (key: string, value: any) =>
      invoke<void>('settings:setStore', key, value),
    resetProgress: () =>
      invoke<void>('settings:resetProgress'),
    dbPath: () =>
      invoke<string>('settings:dbPath'),
  },
}
