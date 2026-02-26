# Fase 0 — Setup & Scaffolding

> **Objetivo:** Ter o projeto Electron + React + TypeScript rodando do zero, com todas as ferramentas de desenvolvimento configuradas.

---

## Checklist

- [ ] Criar o repositório Git
- [ ] Inicializar o projeto com Vite + React + TypeScript
- [ ] Instalar e configurar Electron
- [ ] Configurar `vite-plugin-electron`
- [ ] Estruturar as pastas `src/main/` e `src/renderer/`
- [ ] Configurar `tsconfig.json` (strict mode)
- [ ] Configurar ESLint + Prettier
- [ ] Validar: app abre uma janela com React renderizando

---

## Passo 1 — Inicializar o Projeto

```bash
# Na raiz do StudyApp/
npm create vite@latest . -- --template react-ts
npm install
```

### Instalar Electron e plugins

```bash
npm install -D electron electron-builder vite-plugin-electron
npm install -D @types/node
```

### Instalar dependências de runtime

```bash
npm install better-sqlite3 electron-store zod
npm install -D @types/better-sqlite3

npm install react-router-dom zustand framer-motion
npm install @codemirror/view @codemirror/state @codemirror/lang-markdown codemirror
npm install lucide-react
```

---

## Passo 2 — Configurar `vite.config.ts`

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'src/main/index.ts',  // processo main
      },
      {
        entry: 'src/main/preload.ts', // script de preload (expõe IPC)
        onstart(options) {
          options.reload()
        },
      },
    ]),
  ],
})
```

---

## Passo 3 — Estrutura de Pastas

```
src/
├── main/                    ← Electron Main Process (Node.js)
│   ├── index.ts             ← entry: cria janela, registra IPC handlers
│   ├── preload.ts           ← expõe contextBridge para o renderer
│   ├── db/
│   │   ├── database.ts      ← singleton do DB
│   │   ├── schema.sql       ← DDL das tabelas
│   │   └── seed.ts          ← dados iniciais dos 8 blocos
│   ├── repositories/        ← (vazio — preenchido na Fase 1)
│   ├── services/            ← (vazio — preenchido na Fase 1)
│   └── ipc/                 ← (vazio — preenchido na Fase 1)
│
└── renderer/                ← React App (browser context)
    ├── main.tsx             ← ReactDOM.createRoot(...)
    ├── App.tsx              ← Router + layout raiz
    ├── lib/
    │   ├── api.ts           ← wrapper sobre window.electronAPI
    │   └── store.ts         ← Zustand store (vazio — Fase 2)
    ├── components/          ← (vazio — Fase 2+)
    └── views/               ← (vazio — Fase 2+)
```

---

## Passo 4 — Entry Point do Main Process

```typescript
// src/main/index.ts
import { app, BrowserWindow } from 'electron'
import path from 'path'

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

---

## Passo 5 — Preload (segurança IPC)

```typescript
// src/main/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel: string, ...args: unknown[]) =>
    ipcRenderer.invoke(channel, ...args),
})
```

---

## Passo 6 — `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["src/shared/*"],
      "@renderer/*": ["src/renderer/*"],
      "@main/*": ["src/main/*"]
    }
  },
  "include": ["src"]
}
```

---

## Passo 7 — Scripts `package.json`

```json
{
  "scripts": {
    "dev":     "vite",
    "build":   "vite build",
    "preview": "vite preview",
    "pack":    "electron-builder --dir",
    "dist":    "electron-builder"
  }
}
```

---

## Critério de Conclusão da Fase 0

> ✅ `npm run dev` abre a janela Electron exibindo a frase "StudyApp — React está funcionando" sem erros no console do main nem no DevTools do renderer.
