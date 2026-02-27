// src/main/ipc/noteHandlers.ts
import { ipcMain } from 'electron'
import { NoteService } from '../services/NoteService'

export function registerNoteHandlers(): void {
  ipcMain.handle('notes:getByPoint', (_event, pointId: number) =>
    NoteService.getByPoint(pointId),
  )

  ipcMain.handle('notes:save', (_event, pointId: number, content: string) =>
    NoteService.save(pointId, content),
  )

  ipcMain.handle('notes:getAll', () => NoteService.getAll())

  ipcMain.handle('notes:search', (_event, query: string) =>
    NoteService.search(query),
  )

  ipcMain.handle('notes:delete', (_event, id: number) =>
    NoteService.delete(id),
  )
}
