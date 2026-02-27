import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

// Plugin para copiar arquivos estáticos do main process para o output
function copyStaticFiles() {
  return {
    name: 'copy-static-main-files',
    closeBundle() {
      const src  = resolve(__dirname, 'src/main/db/schema.sql')
      const dest = resolve(__dirname, 'dist-electron/main/schema.sql')
      if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.copyFileSync(src, dest)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'src/main/index.ts',
        vite: {
          plugins: [copyStaticFiles()],
          build: {
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: [
                'electron',
                'better-sqlite3',
                'fs',
                'path',
                'url',
                'node:fs',
                'node:path',
                'node:url',
              ],
            },
          },
        },
      },
      {
        entry: 'src/main/preload.ts',
        vite: {
          build: {
            outDir: 'dist-electron/preload',
          },
        },
        onstart(options) {
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@shared':   resolve(__dirname, 'src/shared'),
      '@renderer': resolve(__dirname, 'src/renderer'),
      '@main':     resolve(__dirname, 'src/main'),
    },
  },
})
