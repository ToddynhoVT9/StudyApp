import { ipcMain } from 'electron'
import { RoadmapService } from '../services/RoadmapService'
import db from '../db/database'
import { store } from '../db/settings'

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:getStore', () => store.store)
  
  ipcMain.handle('settings:setStore', (_, key: string, value: any) => {
    store.set(key, value)
  })
  /** Reseta status de todos os pontos para 'pending' */
  ipcMain.handle('settings:resetProgress', () => {
    RoadmapService.resetProgress()
  })

  /** Retorna o caminho do banco — útil para debug na SettingsView */
  ipcMain.handle('settings:dbPath', () => {
    const row = db.prepare("PRAGMA database_list").get() as
      | { seq: number; name: string; file: string }
      | undefined
    return row?.file ?? 'desconhecido'
  })
}
