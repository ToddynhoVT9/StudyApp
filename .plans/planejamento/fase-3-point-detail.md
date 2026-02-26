# Fase 3 — Point Detail View

> **Objetivo:** Implementar a view de detalhe de um RoadMapPoint, com NoteEditor (Markdown, auto-save), ActivityList (CRUD com checkbox) e StudyList (adicionar/remover materiais).

---

## Checklist

- [ ] Criar `PointDetailView` com layout de 3 seções (notas, atividades, estudos)
- [ ] Criar `NoteEditor` com CodeMirror e debounce de auto-save
- [ ] Criar `ActivityList` com add, toggle (checkbox), remove
- [ ] Criar `StudyList` com add (título + URL + tipo), remove
- [ ] Criar hook `usePointData` para carregar os dados do ponto via IPC
- [ ] Integrar seletor de status do ponto no header da view
- [ ] Validar: navegação entre pontos via prev/next, persistência de notas e atividades

---

## Passo 1 — Hook `usePointData`

```typescript
// src/renderer/hooks/usePointData.ts
import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { Note, Activity, Study } from '@shared/types'

export function usePointData(pointId: number) {
  const [note,       setNote]       = useState<Note | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [studies,    setStudies]    = useState<Study[]>([])
  const [loading,    setLoading]    = useState(true)

  const reload = async () => {
    setLoading(true)
    const [n, acts, studs] = await Promise.all([
      api.notes.getByPoint(pointId),
      api.activities.getByPoint(pointId),
      api.studies.getByPoint(pointId),
    ])
    setNote(n)
    setActivities(acts)
    setStudies(studs)
    setLoading(false)
  }

  useEffect(() => { reload() }, [pointId])

  return { note, activities, studies, loading, reload, setNote, setActivities, setStudies }
}
```

---

## Passo 2 — PointDetailView (layout)

```tsx
// src/renderer/views/PointDetailView.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useRoadmapStore } from '../lib/store'
import { usePointData } from '../hooks/usePointData'
import { NoteEditor }   from '../components/PointDetail/NoteEditor'
import { ActivityList } from '../components/PointDetail/ActivityList'
import { StudyList }    from '../components/PointDetail/StudyList'
import { STATUS_ICON, STATUS_COLOR } from '../lib/constants'
import type { Status } from '@shared/types'
import styles from './PointDetailView.module.css'

export function PointDetailView() {
  const { id }   = useParams<{ id: string }>()
  const pointId  = Number(id)
  const navigate = useNavigate()

  const { blocks, updatePointStatus } = useRoadmapStore()
  const point = blocks.flatMap(b => b.points).find(p => p.id === pointId)

  const { note, activities, studies, reload } = usePointData(pointId)

  if (!point) return <p>Ponto não encontrado.</p>

  const allPoints = blocks.flatMap(b => b.points)
  const idx       = allPoints.findIndex(p => p.id === pointId)
  const prev      = allPoints[idx - 1]
  const next      = allPoints[idx + 1]

  return (
    <div className={styles.view}>
      {/* Header */}
      <header className={styles.header}>
        <button onClick={() => navigate('/')} className={styles.back}>← Roadmap</button>
        <div className={styles.meta}>
          <h1>{point.title}</h1>
          <small>Semanas {point.weeks}</small>
        </div>
        <select
          className={styles.statusSelect}
          value={point.status}
          style={{ color: STATUS_COLOR[point.status] }}
          onChange={e => updatePointStatus(point.id, e.target.value as Status)}
        >
          <option value="pending">· Pendente</option>
          <option value="in_progress">▶ Em andamento</option>
          <option value="done">✔ Concluído</option>
        </select>
      </header>

      {/* Seções */}
      <section className={styles.section}>
        <h2>📝 Notas</h2>
        <NoteEditor
          pointId={pointId}
          initialContent={note?.content ?? ''}
          onSaved={setNote => reload()}
        />
      </section>

      <section className={styles.section}>
        <h2>✏️ Atividades</h2>
        <ActivityList
          pointId={pointId}
          activities={activities}
          onChanged={reload}
        />
      </section>

      <section className={styles.section}>
        <h2>📚 Estudos</h2>
        <StudyList
          pointId={pointId}
          studies={studies}
          onChanged={reload}
        />
      </section>

      {/* Navegação prev/next */}
      <footer className={styles.nav}>
        {prev && <button onClick={() => navigate(`/point/${prev.id}`)}>← {prev.title}</button>}
        {next && <button onClick={() => navigate(`/point/${next.id}`)}>{next.title} →</button>}
      </footer>
    </div>
  )
}
```

---

## Passo 3 — NoteEditor (CodeMirror + auto-save)

```tsx
// src/renderer/components/PointDetail/NoteEditor.tsx
import { useEffect, useRef, useState, useCallback } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { api } from '../../lib/api'
import { useDebounce } from '../../hooks/useDebounce'
import styles from './NoteEditor.module.css'

interface Props {
  pointId: number
  initialContent: string
  onSaved?: () => void
}

export function NoteEditor({ pointId, initialContent, onSaved }: Props) {
  const editorRef  = useRef<HTMLDivElement>(null)
  const viewRef    = useRef<EditorView | null>(null)
  const [content, setContent] = useState(initialContent)
  const [saved,   setSaved]   = useState(true)

  const debouncedContent = useDebounce(content, 1500)

  // Inicializa CodeMirror
  useEffect(() => {
    if (!editorRef.current) return
    const view = new EditorView({
      doc: initialContent,
      extensions: [
        basicSetup,
        markdown(),
        EditorView.theme({ '&': { minHeight: '200px', fontFamily: 'var(--font-mono)' } }),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            setContent(update.state.doc.toString())
            setSaved(false)
          }
        }),
      ],
      parent: editorRef.current,
    })
    viewRef.current = view
    return () => view.destroy()
  }, [pointId]) // recria quando muda de ponto

  // Auto-save com debounce
  useEffect(() => {
    if (saved) return
    api.notes.save(pointId, debouncedContent).then(() => {
      setSaved(true)
      onSaved?.()
    })
  }, [debouncedContent])

  return (
    <div className={styles.wrapper}>
      <div ref={editorRef} className={styles.editor} />
      <div className={styles.status}>{saved ? '✓ Salvo' : '…salvando'}</div>
    </div>
  )
}
```

**Hook useDebounce:**

```typescript
// src/renderer/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
```

---

## Passo 4 — ActivityList

```tsx
// src/renderer/components/PointDetail/ActivityList.tsx
import { useState } from 'react'
import { api } from '../../lib/api'
import type { Activity } from '@shared/types'
import styles from './ActivityList.module.css'

interface Props {
  pointId: number
  activities: Activity[]
  onChanged: () => void
}

export function ActivityList({ pointId, activities, onChanged }: Props) {
  const [newDesc, setNewDesc] = useState('')

  const handleAdd = async () => {
    if (!newDesc.trim()) return
    await api.activities.add(pointId, newDesc.trim())
    setNewDesc('')
    onChanged()
  }

  return (
    <div className={styles.list}>
      <ul>
        {activities.map(act => (
          <li key={act.id} className={styles.item}>
            <input
              type="checkbox"
              checked={act.done}
              onChange={async () => {
                await api.activities.toggle(act.id)
                onChanged()
              }}
            />
            <span className={act.done ? styles.done : ''}>{act.description}</span>
            <button
              className={styles.remove}
              onClick={async () => {
                await api.activities.remove(act.id)
                onChanged()
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.addRow}>
        <input
          type="text"
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          placeholder="Nova atividade…"
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>+ Adicionar</button>
      </div>
    </div>
  )
}
```

---

## Passo 5 — StudyList

```tsx
// src/renderer/components/PointDetail/StudyList.tsx
import { useState } from 'react'
import { api } from '../../lib/api'
import type { Study } from '@shared/types'
import styles from './StudyList.module.css'

interface Props {
  pointId: number
  studies: Study[]
  onChanged: () => void
}

export function StudyList({ pointId, studies, onChanged }: Props) {
  const [title, setTitle]   = useState('')
  const [url,   setUrl]     = useState('')
  const [type,  setType]    = useState<Study['type']>('link')
  const [open,  setOpen]    = useState(false)

  const TYPE_LABELS: Record<Study['type'], string> = {
    text: '📄 Texto', link: '🔗 Link', video: '🎥 Vídeo', book: '📖 Livro'
  }

  const handleAdd = async () => {
    if (!title.trim()) return
    await api.studies.add(pointId, title.trim(), url.trim() || null, type)
    setTitle(''); setUrl(''); setOpen(false)
    onChanged()
  }

  return (
    <div className={styles.list}>
      <ul>
        {studies.map(s => (
          <li key={s.id} className={styles.item}>
            <span className={styles.typeIcon}>{TYPE_LABELS[s.type].split(' ')[0]}</span>
            {s.url
              ? <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
              : <span>{s.title}</span>
            }
            <button
              className={styles.remove}
              onClick={async () => { await api.studies.remove(s.id); onChanged() }}
            >✕</button>
          </li>
        ))}
      </ul>

      {open ? (
        <div className={styles.form}>
          <input placeholder="Título do material" value={title} onChange={e => setTitle(e.target.value)} />
          <input placeholder="URL (opcional)" value={url} onChange={e => setUrl(e.target.value)} />
          <select value={type} onChange={e => setType(e.target.value as Study['type'])}>
            {(Object.entries(TYPE_LABELS) as [Study['type'], string][]).map(([v, l]) =>
              <option key={v} value={v}>{l}</option>
            )}
          </select>
          <button onClick={handleAdd}>Salvar</button>
          <button onClick={() => setOpen(false)}>Cancelar</button>
        </div>
      ) : (
        <button className={styles.addBtn} onClick={() => setOpen(true)}>+ Adicionar material</button>
      )}
    </div>
  )
}
```

---

## Critério de Conclusão da Fase 3

> ✅ Clicar em qualquer ponto do roadmap abre a `PointDetailView`. A nota é escrita e salva automaticamente. Atividades podem ser adicionadas, marcadas e removidas. Materiais de estudo podem ser adicionados com link clicável. Prev/Next navega entre pontos sem perder dados.
