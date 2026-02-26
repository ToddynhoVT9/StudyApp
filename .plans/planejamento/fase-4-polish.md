# Fase 4 — Polish & Entrega

> **Objetivo:** Adicionar busca global de notas, animações, SettingsView, temas e gerar o build final `.exe` para Windows.

---

## Checklist

- [ ] Criar `NotesView` com busca full-text nas notas
- [ ] Criar `SettingsView` (tema, fonte, resetar progresso)
- [ ] Adicionar animações de entrada com Framer Motion
- [ ] Adicionar CSS global com tokens de design (variáveis CSS)
- [ ] Configurar `electron-builder` para gerar `.exe` (Windows)
- [ ] Validar: build final abre, funciona off-line, dados persistem

---

## Passo 1 — CSS Global (Design Tokens)

```css
/* src/renderer/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap');

:root {
  --color-bg-app:        #0F1117;
  --color-bg-sidebar:    #161B22;
  --color-bg-panel:      #1C2128;
  --color-bg-hover:      #21262D;
  --color-border:        #30363D;

  --color-accent:        #58A6FF;
  --color-accent-green:  #3FB950;
  --color-accent-yellow: #D29922;
  --color-accent-muted:  #484F58;

  --color-text-primary:  #E6EDF3;
  --color-text-secondary:#8B949E;
  --color-text-link:     #58A6FF;

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --transition: 150ms ease;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--color-bg-app);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar personalizada */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }

a { color: var(--color-text-link); text-decoration: none; }
a:hover { text-decoration: underline; }

button {
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: var(--color-bg-panel);
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-family: var(--font-sans);
  font-size: 13px;
  transition: background var(--transition);
}
button:hover { background: var(--color-bg-hover); }

input, select, textarea {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 13px;
  padding: 6px 10px;
  outline: none;
  transition: border-color var(--transition);
}
input:focus, select:focus, textarea:focus {
  border-color: var(--color-accent);
}
```

---

## Passo 2 — NotesView (busca global)

```tsx
// src/renderer/views/NotesView.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useDebounce } from '../hooks/useDebounce'
import type { Note } from '@shared/types'
import styles from './NotesView.module.css'

export function NotesView() {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<Note[]>([])
  const navigate = useNavigate()

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const load = async () => {
      const notes = debouncedQuery.trim()
        ? await api.notes.search(debouncedQuery)
        : await api.notes.getAll()
      setResults(notes)
    }
    load()
  }, [debouncedQuery])

  return (
    <div className={styles.view}>
      <h1>📝 Notas</h1>
      <input
        type="search"
        placeholder="Buscar nas notas…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className={styles.search}
        autoFocus
      />
      <ul className={styles.list}>
        {results.map(note => (
          <li
            key={note.id}
            className={styles.item}
            onClick={() => navigate(`/point/${note.point_id}`)}
          >
            <span className={styles.pointTitle}>{(note as any).point_title}</span>
            <p className={styles.preview}>
              {note.content.slice(0, 120).replace(/[#*_`]/g, '')}…
            </p>
            <small className={styles.date}>
              {new Date(note.updated_at).toLocaleDateString('pt-BR')}
            </small>
          </li>
        ))}
        {results.length === 0 && (
          <li className={styles.empty}>Nenhuma nota encontrada.</li>
        )}
      </ul>
    </div>
  )
}
```

---

## Passo 3 — SettingsView

```tsx
// src/renderer/views/SettingsView.tsx
import { useNavigate } from 'react-router-dom'
import styles from './SettingsView.module.css'

export function SettingsView() {
  const navigate = useNavigate()

  const handleReset = async () => {
    const confirm = window.confirm(
      'Isso vai resetar TODO o progresso (status dos pontos). As notas e atividades serão mantidas. Continuar?'
    )
    if (!confirm) return
    await window.electronAPI.invoke('settings:resetProgress')
    navigate('/')
    window.location.reload()
  }

  return (
    <div className={styles.view}>
      <h1>⚙️ Configurações</h1>

      <section className={styles.section}>
        <h2>Aparência</h2>
        <label>
          Tamanho da fonte
          <select>
            <option value="sm">Pequena</option>
            <option value="md" selected>Média</option>
            <option value="lg">Grande</option>
          </select>
        </label>
      </section>

      <section className={styles.section}>
        <h2>Dados</h2>
        <p>Localização do banco: <code>%APPDATA%/StudyApp/studyapp.db</code></p>
        <button className={styles.danger} onClick={handleReset}>
          🔄 Resetar progresso do roadmap
        </button>
      </section>
    </div>
  )
}
```

---

## Passo 4 — Animações com Framer Motion

Adicionar animações de entrada nas views principais e nos cards do roadmap:

```tsx
// Exemplo: animar a entrada de BlockCard
import { motion } from 'framer-motion'

// Substituir <article> por:
<motion.article
  className={styles.card}
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, delay: block.id * 0.05 }}
>
  ...
</motion.article>
```

```tsx
// Animar entrada de PointDetailView
import { motion } from 'framer-motion'

// Envolver o conteúdo:
<motion.div
  className={styles.view}
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.2 }}
>
  ...
</motion.div>
```

```tsx
// Animar itens da ActivityList ao serem adicionados
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {activities.map(act => (
    <motion.li
      key={act.id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.15 }}
    >
      ...
    </motion.li>
  ))}
</AnimatePresence>
```

---

## Passo 5 — Configurar electron-builder

```json
// electron-builder.json
{
  "appId": "com.studyapp.local",
  "productName": "StudyApp",
  "directories": {
    "output": "dist-electron"
  },
  "files": [
    "dist/**",
    "dist-main/**"
  ],
  "win": {
    "target": "nsis",
    "icon": "resources/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

**Gerar o build:**

```bash
npm run build          # compila React + main process
npm run dist           # gera instalador .exe em dist-electron/
```

---

## Passo 6 — Handler de Reset no Main Process

```typescript
// src/main/ipc/settingsHandlers.ts
import { ipcMain } from 'electron'
import db from '../db/database'

export function registerSettingsHandlers() {
  ipcMain.handle('settings:resetProgress', () => {
    db.prepare("UPDATE roadmap_points SET status = 'pending', updated_at = datetime('now')").run()
  })
}
```

---

## Checklist de Build Final

```
[ ] npm run build → sem erros TypeScript
[ ] npm run dist  → gera dist-electron/StudyApp Setup.exe
[ ] Instalar o .exe em máquina limpa
[ ] Abrir o app → roadmap carregado com 8 blocos
[ ] Marcar um ponto, fechar, reabrir → status mantido
[ ] Adicionar nota, fechar, reabrir → nota mantida
[ ] Adicionar atividade e marcar → persiste
[ ] Busca de notas funciona off-line
[ ] Sem erros no terminal / logs do Electron
```

---

## Critério de Conclusão da Fase 4 (= MVP completo)

> ✅ O instalador `.exe` gerado instala o app, que abre sem internet, exibe o roadmap completo, persiste todos os dados e exibe animações fluidas. O produto está pronto para uso pessoal.
