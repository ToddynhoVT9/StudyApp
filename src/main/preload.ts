import { contextBridge, ipcRenderer } from 'electron'

// Expõe uma API segura para o renderer — sem acesso direto ao Node
contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel: string, ...args: unknown[]): Promise<unknown> =>
    ipcRenderer.invoke(channel, ...args),
})
