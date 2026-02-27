// src/main/ipc/studyHandlers.ts
import { ipcMain } from 'electron'
import { StudyService } from '../services/StudyService'
import type { Study } from '@shared/types'

export function registerStudyHandlers(): void {
  ipcMain.handle('studies:getByPoint', (_event, pointId: number) =>
    StudyService.getByPoint(pointId),
  )

  ipcMain.handle(
    'studies:add',
    (
      _event,
      pointId: number,
      title: string,
      url: string | null,
      type: Study['type'],
    ) => StudyService.add(pointId, title, url, type),
  )

  ipcMain.handle('studies:remove', (_event, id: number) =>
    StudyService.remove(id),
  )
}
