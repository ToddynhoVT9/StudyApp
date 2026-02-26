# Fase 2 — Roadmap UI

> **Objetivo:** Implementar o Zustand store, o layout principal (Sidebar + Workspace) e o Roadmap visual marcável, com persistência de status funcionando.

---

## Checklist

- [ ] Criar `store.ts` (Zustand) com estado de blocos e progresso
- [ ] Criar componente `AppLayout` (root: sidebar + workspace)
- [ ] Criar `Sidebar` com lista de blocos/pontos e indicadores de status
- [ ] Criar `RoadmapView` com o canvas de blocos (modo lista)
- [ ] Criar `BlockCard` e `PointNode` (visual + interação de status)
- [ ] Criar `StatusBar` (progresso geral)
- [ ] Conectar atualização de status ao IPC (`api.roadmap.updateStatus`)
- [ ] Validar: marcar/desmarcar ponto persiste após fechar e reabrir o app

---

## Passo 1 — Zustand Store

```typescript
// src/renderer/lib/store.ts
import { create } from 'zustand'
import { api } from './api'
import type { Block, Status, ProgressSummary } from '@shared/types'

interface RoadmapStore {
  blocks: Block[]
  progress: ProgressSummary | null
  activePointId: number | null

  // actions
  loadAll: () => Promise<void>
  updatePointStatus: (pointId: number, status: Status) => Promise<void>
  setActivePoint: (id: number | null) => void
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  blocks: [],
  progress: null,
  activePointId: null,

  loadAll: async () => {
    const [blocks, progress] = await Promise.all([
      api.roadmap.getAll(),
      api.roadmap.getProgress(),
    ])
    set({ blocks, progress })
  },

  updatePointStatus: async (pointId, status) => {
    await api.roadmap.updateStatus(pointId, status)
    // optimistic update
    set(state => ({
      blocks: state.blocks.map(b => ({
        ...b,
        points: b.points.map(p => p.id === pointId ? { ...p, status } : p),
      })),
    }))
    // recarrega progresso
    const progress = await api.roadmap.getProgress()
    set({ progress })
  },

  setActivePoint: (id) => set({ activePointId: id }),
}))
```

---

## Passo 2 — App.tsx com Router

```tsx
// src/renderer/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { AppLayout } from './components/AppLayout/AppLayout'
import { RoadmapView } from './views/RoadmapView'
import { PointDetailView } from './views/PointDetailView'
import { NotesView } from './views/NotesView'
import { SettingsView } from './views/SettingsView'
import { useRoadmapStore } from './lib/store'

export function App() {
  const loadAll = useRoadmapStore(s => s.loadAll)
  useEffect(() => { loadAll() }, [loadAll])

  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/"              element={<RoadmapView />} />
          <Route path="/point/:id"     element={<PointDetailView />} />
          <Route path="/notes"         element={<NotesView />} />
          <Route path="/settings"      element={<SettingsView />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  )
}
```

---

## Passo 3 — AppLayout (estrutura CSS Grid)

```tsx
// src/renderer/components/AppLayout/AppLayout.tsx
import { Sidebar } from '../Sidebar/Sidebar'
import { StatusBar } from '../StatusBar/StatusBar'
import styles from './AppLayout.module.css'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.root}>
      <Sidebar />
      <main className={styles.workspace}>{children}</main>
      <StatusBar />
    </div>
  )
}
```

```css
/* AppLayout.module.css */
.root {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "sidebar workspace"
    "sidebar statusbar";
  height: 100vh;
  background: var(--color-bg-app);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}
.workspace { grid-area: workspace; overflow-y: auto; }
```

---

## Passo 4 — Sidebar

```tsx
// src/renderer/components/Sidebar/Sidebar.tsx
import { useRoadmapStore } from '../../lib/store'
import { useNavigate } from 'react-router-dom'
import { STATUS_ICON } from '../../lib/constants'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const { blocks, activePointId, setActivePoint } = useRoadmapStore()
  const navigate = useNavigate()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span>🗺️ StudyApp</span>
      </div>

      <nav className={styles.nav}>
        {blocks.map(block => (
          <details key={block.id} className={styles.block}>
            <summary className={styles.blockTitle}>
              Bloco {block.id} · {block.title}
            </summary>
            <ul className={styles.points}>
              {block.points.map(pt => (
                <li
                  key={pt.id}
                  className={`${styles.point} ${activePointId === pt.id ? styles.active : ''}`}
                  onClick={() => {
                    setActivePoint(pt.id)
                    navigate(`/point/${pt.id}`)
                  }}
                >
                  <span className={styles.statusIcon}>{STATUS_ICON[pt.status]}</span>
                  {pt.title}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </nav>

      <div className={styles.footer}>
        <button onClick={() => navigate('/notes')}>📝 Notas</button>
        <button onClick={() => navigate('/settings')}>⚙️ Config</button>
      </div>
    </aside>
  )
}
```

**Constantes de status:**

```typescript
// src/renderer/lib/constants.ts
import type { Status } from '@shared/types'

export const STATUS_ICON: Record<Status, string> = {
  pending:     '·',
  in_progress: '▶',
  done:        '✔',
}

export const STATUS_COLOR: Record<Status, string> = {
  pending:     'var(--color-accent-muted)',
  in_progress: 'var(--color-accent-yellow)',
  done:        'var(--color-accent-green)',
}
```

---

## Passo 5 — RoadmapView (canvas de blocos)

```tsx
// src/renderer/views/RoadmapView.tsx
import { useRoadmapStore } from '../lib/store'
import { BlockCard } from '../components/RoadmapCanvas/BlockCard'
import styles from './RoadmapView.module.css'

export function RoadmapView() {
  const blocks = useRoadmapStore(s => s.blocks)

  return (
    <div className={styles.view}>
      <h1 className={styles.title}>Roadmap de Estudos</h1>
      <div className={styles.canvas}>
        {blocks.map(block => (
          <BlockCard key={block.id} block={block} />
        ))}
      </div>
    </div>
  )
}
```

**BlockCard:** cada bloco mostra seus pontos como chips com badge de status.

```tsx
// src/renderer/components/RoadmapCanvas/BlockCard.tsx
import { useNavigate } from 'react-router-dom'
import { useRoadmapStore } from '../../lib/store'
import { STATUS_COLOR, STATUS_ICON } from '../../lib/constants'
import type { Block } from '@shared/types'
import styles from './BlockCard.module.css'

export function BlockCard({ block }: { block: Block }) {
  const navigate = useNavigate()
  const updatePointStatus = useRoadmapStore(s => s.updatePointStatus)

  const done  = block.points.filter(p => p.status === 'done').length
  const total = block.points.length
  const pct   = Math.round((done / total) * 100)

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h2>Bloco {block.id} — {block.title}</h2>
        <span className={styles.progress}>{done}/{total} · {pct}%</span>
      </header>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>

      <ul className={styles.points}>
        {block.points.map(pt => (
          <li key={pt.id} className={styles.point}>
            <button
              className={styles.statusBtn}
              style={{ color: STATUS_COLOR[pt.status] }}
              onClick={() => {
                const next = pt.status === 'pending' ? 'in_progress'
                           : pt.status === 'in_progress' ? 'done' : 'pending'
                updatePointStatus(pt.id, next)
              }}
              title="Avançar status"
            >
              {STATUS_ICON[pt.status]}
            </button>
            <span
              className={styles.pointTitle}
              onClick={() => navigate(`/point/${pt.id}`)}
            >
              {pt.title}
              <small className={styles.weeks}>sem. {pt.weeks}</small>
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}
```

---

## Passo 6 — StatusBar

```tsx
// src/renderer/components/StatusBar/StatusBar.tsx
import { useRoadmapStore } from '../../lib/store'
import styles from './StatusBar.module.css'

export function StatusBar() {
  const progress = useRoadmapStore(s => s.progress)
  if (!progress) return null

  return (
    <footer className={styles.bar}>
      <span>Pontos concluídos: <strong>{progress.done}/{progress.total}</strong></span>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress.percent}%` }} />
      </div>
      <span><strong>{progress.percent}%</strong> completo</span>
    </footer>
  )
}
```

---

## Critério de Conclusão da Fase 2

> ✅ O roadmap visual exibe os 8 blocos com seus pontos. Clicar no ícone de status avança o ponto (`pending → in_progress → done → pending`). A sidebar reflete o novo status instantaneamente. Fechar e reabrir o app mantém o estado.
