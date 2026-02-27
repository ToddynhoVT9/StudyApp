// src/main/ipc/roadmapHandlers.ts
import { ipcMain } from 'electron'
import { RoadmapService } from '../services/RoadmapService'

export function registerRoadmapHandlers(): void {
  ipcMain.handle('roadmap:getAll', () => RoadmapService.getAll())

  ipcMain.handle('roadmap:getProgress', () => RoadmapService.getProgress())

  ipcMain.handle(
    'roadmap:updateStatus',
    (_event, id: number, status: string) =>
      RoadmapService.updateStatus(id, status),
  )

  ipcMain.handle('roadmap:resetProgress', () => RoadmapService.resetProgress())
}
