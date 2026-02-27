// src/main/ipc/activityHandlers.ts
import { ipcMain } from 'electron'
import { ActivityService } from '../services/ActivityService'

export function registerActivityHandlers(): void {
  ipcMain.handle('activities:getByPoint', (_event, pointId: number) =>
    ActivityService.getByPoint(pointId),
  )

  ipcMain.handle(
    'activities:add',
    (_event, pointId: number, description: string) =>
      ActivityService.add(pointId, description),
  )

  ipcMain.handle('activities:toggle', (_event, id: number) =>
    ActivityService.toggle(id),
  )

  ipcMain.handle('activities:remove', (_event, id: number) =>
    ActivityService.remove(id),
  )
}
