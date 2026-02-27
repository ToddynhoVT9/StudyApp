// src/main/db/settings.ts
import Store from 'electron-store'

export interface AppSettings {
  editorFontSize: 'sm' | 'md' | 'lg'
  theme: 'dark' | 'light'
}

export const store = new Store<AppSettings>({
  defaults: {
    editorFontSize: 'md',
    theme: 'dark',
  },
})
