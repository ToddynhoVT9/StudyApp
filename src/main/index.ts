// src/main/index.ts — Electron Main Process entry
import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

// ─── Camada de dados ──────────────────────────────────────────────
// Importar database primeiro (abre o arquivo .db e aplica o schema)
import './db/database'
import { runSeed } from './db/seed'

// ─── IPC Handlers ─────────────────────────────────────────────────
import { registerRoadmapHandlers }  from './ipc/roadmapHandlers'
import { registerNoteHandlers }     from './ipc/noteHandlers'
import { registerActivityHandlers } from './ipc/activityHandlers'
import { registerStudyHandlers }    from './ipc/studyHandlers'
import { registerSettingsHandlers } from './ipc/settingsHandlers'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

function createWindow(): void {
  const win = new BrowserWindow({
    width:  1280,
    height: 800,
    minWidth:  900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0F1117',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  if (process.env['VITE_DEV_SERVER_URL']) {
    win.loadURL(process.env['VITE_DEV_SERVER_URL'])
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
  }
}

app.whenReady().then(() => {
  // 1. Seed (idempotente — só insere se o banco estiver vazio)
  runSeed()

  // 2. Registrar handlers IPC (devem ser registrados ANTES da janela abrir)
  registerRoadmapHandlers()
  registerNoteHandlers()
  registerActivityHandlers()
  registerStudyHandlers()
  registerSettingsHandlers()

  // 3. Criar a janela principal
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
