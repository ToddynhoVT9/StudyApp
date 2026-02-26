# Fase 1 — Core Data Layer

> **Objetivo:** Ter o banco SQLite criado, populado com os 8 blocos, e toda a camada de dados (Repositories → Services → IPC → api.ts) funcionando e testável via DevTools.

---

## Checklist

- [ ] Criar `schema.sql` com as 5 tabelas
- [ ] Criar `database.ts` (singleton better-sqlite3)
- [ ] Criar `seed.ts` com os 8 blocos e todos os pontos do roadmap
- [ ] Criar os 4 Repositories (`Point`, `Note`, `Study`, `Activity`)
- [ ] Criar os 4 Services com validação Zod
- [ ] Registrar todos os IPC handlers
- [ ] Criar `src/shared/types.ts` com os tipos compartilhados
- [ ] Criar `src/renderer/lib/api.ts` com tipagem
- [ ] Validar: chamar `window.electronAPI.invoke('roadmap:getAll')` no DevTools retorna os dados

---

## Passo 1 — Schema SQL

```sql
-- src/main/db/schema.sql

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS blocks (
  id          INTEGER PRIMARY KEY,
  title       TEXT    NOT NULL,
  order_index INTEGER NOT NULL UNIQUE,
  duration    TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS roadmap_points (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  block_id    INTEGER NOT NULL REFERENCES blocks(id),
  title       TEXT    NOT NULL,
  order_index INTEGER NOT NULL,
  weeks       TEXT,
  status      TEXT    NOT NULL DEFAULT 'pending'
                CHECK(status IN ('pending','in_progress','done')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id    INTEGER NOT NULL REFERENCES roadmap_points(id) ON DELETE CASCADE,
  content     TEXT    NOT NULL DEFAULT '',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_point ON notes(point_id);

CREATE TABLE IF NOT EXISTS studies (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id    INTEGER NOT NULL REFERENCES roadmap_points(id) ON DELETE CASCADE,
  title       TEXT    NOT NULL,
  url         TEXT,
  type        TEXT    NOT NULL DEFAULT 'text'
                CHECK(type IN ('text','link','video','book')),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activities (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id    INTEGER NOT NULL REFERENCES roadmap_points(id) ON DELETE CASCADE,
  description TEXT    NOT NULL,
  done        INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  done_at     TEXT
);
```

---

## Passo 2 — Database Singleton

```typescript
// src/main/db/database.ts
import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(app.getPath('userData'), 'studyapp.db')
const schemaPath = path.join(__dirname, 'schema.sql')

const db = new Database(dbPath)
db.exec(fs.readFileSync(schemaPath, 'utf8'))

export default db
```

---

## Passo 3 — Seed dos 8 Blocos

```typescript
// src/main/db/seed.ts
import db from './database'

const BLOCKS = [
  { id: 1, title: 'Fundamentos da Web + Linguagem', order_index: 1, duration: '8–12 semanas',
    points: [
      { title: 'HTML & CSS',   order_index: 1, weeks: '01–04' },
      { title: 'JavaScript',   order_index: 2, weeks: '05–08' },
      { title: 'TypeScript',   order_index: 3, weeks: '09–12' },
    ]
  },
  { id: 2, title: 'Runtime e Backend Essencial', order_index: 2, duration: '8–10 semanas',
    points: [
      { title: 'Node.js Runtime', order_index: 1, weeks: '13–15' },
      { title: 'HTTP e REST',     order_index: 2, weeks: '16–18' },
      { title: 'NestJS',          order_index: 3, weeks: '19–22' },
    ]
  },
  { id: 3, title: 'Frontend Moderno', order_index: 3, duration: '8–10 semanas',
    points: [
      { title: 'React',               order_index: 1, weeks: '23–26' },
      { title: 'Next.js',             order_index: 2, weeks: '27–28' },
      { title: 'Estilização e libs',  order_index: 3, weeks: '29–30' },
    ]
  },
  { id: 4, title: 'Dados e Persistência', order_index: 4, duration: '4–6 semanas',
    points: [
      { title: 'Modelagem relacional', order_index: 1, weeks: '31–32' },
      { title: 'SQL e PostgreSQL',     order_index: 2, weeks: '33–34' },
      { title: 'Migrations e ORM',     order_index: 3, weeks: '35–36' },
    ]
  },
  { id: 5, title: 'Identidade, Segurança e Limites', order_index: 5, duration: '4–6 semanas',
    points: [
      { title: 'Autenticação e Autorização', order_index: 1, weeks: '37–38' },
      { title: 'Segurança Aplicada',         order_index: 2, weeks: '39–40' },
      { title: 'RBAC e limites avançados',   order_index: 3, weeks: '41–42' },
    ]
  },
  { id: 6, title: 'Qualidade e Confiança em Produção', order_index: 6, duration: '4–6 semanas',
    points: [
      { title: 'Testes automatizados', order_index: 1, weeks: '43–44' },
      { title: 'Qualidade de código',  order_index: 2, weeks: '45' },
      { title: 'Observabilidade',      order_index: 3, weeks: '46–47' },
    ]
  },
  { id: 7, title: 'Empacotamento e Entrega', order_index: 7, duration: '4–6 semanas',
    points: [
      { title: 'Containerização (Docker)',        order_index: 1, weeks: '48–49' },
      { title: 'Integração Contínua (CI)',        order_index: 2, weeks: '50' },
      { title: 'Entrega Contínua e Kubernetes',  order_index: 3, weeks: '51–53' },
      { title: 'Fluxo de produção',               order_index: 4, weeks: '54' },
    ]
  },
  { id: 8, title: 'Borda, Escala e Operação', order_index: 8, duration: '4–6 semanas',
    points: [
      { title: 'CDN e WAF',                  order_index: 1, weeks: '55' },
      { title: 'Escala e auto-scaling',      order_index: 2, weeks: '56–57' },
      { title: 'Operação e confiabilidade',  order_index: 3, weeks: '58–59' },
      { title: 'Projeto integrador',         order_index: 4, weeks: '60' },
    ]
  },
]

export function runSeed() {
  const blockCount = db.prepare('SELECT COUNT(*) as c FROM blocks').get() as { c: number }
  if (blockCount.c > 0) return  // já seeded

  const insertBlock = db.prepare(
    'INSERT INTO blocks(id, title, order_index, duration) VALUES(?,?,?,?)'
  )
  const insertPoint = db.prepare(
    'INSERT INTO roadmap_points(block_id, title, order_index, weeks) VALUES(?,?,?,?)'
  )

  const seedAll = db.transaction(() => {
    for (const block of BLOCKS) {
      insertBlock.run(block.id, block.title, block.order_index, block.duration)
      for (const pt of block.points) {
        insertPoint.run(block.id, pt.title, pt.order_index, pt.weeks)
      }
    }
  })

  seedAll()
}
```

---

## Passo 4 — Repositories

### `PointRepository.ts`

```typescript
import db from '../db/database'
import type { RoadMapPoint, Status } from '@shared/types'

export class PointRepository {
  static findAll() {
    return db.prepare(`
      SELECT rp.*, b.title as block_title
      FROM roadmap_points rp
      JOIN blocks b ON b.id = rp.block_id
      ORDER BY rp.block_id, rp.order_index
    `).all() as (RoadMapPoint & { block_title: string })[]
  }

  static findById(id: number) {
    return db.prepare('SELECT * FROM roadmap_points WHERE id = ?').get(id) as RoadMapPoint | undefined
  }

  static updateStatus(id: number, status: Status) {
    db.prepare(`
      UPDATE roadmap_points
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(status, id)
  }
}
```

### `NoteRepository.ts`

```typescript
import db from '../db/database'
import type { Note } from '@shared/types'

export class NoteRepository {
  static findByPoint(pointId: number): Note | undefined {
    return db.prepare('SELECT * FROM notes WHERE point_id = ?').get(pointId) as Note | undefined
  }

  static upsert(pointId: number, content: string): Note {
    db.prepare(`
      INSERT INTO notes (point_id, content)
      VALUES (?, ?)
      ON CONFLICT(point_id) DO UPDATE SET
        content = excluded.content,
        updated_at = datetime('now')
    `).run(pointId, content)
    return this.findByPoint(pointId)!
  }

  static findAll(): Note[] {
    return db.prepare('SELECT n.*, rp.title as point_title FROM notes n JOIN roadmap_points rp ON rp.id = n.point_id').all() as Note[]
  }

  static search(query: string): Note[] {
    return db.prepare(`
      SELECT n.*, rp.title as point_title
      FROM notes n JOIN roadmap_points rp ON rp.id = n.point_id
      WHERE n.content LIKE ?
    `).all(`%${query}%`) as Note[]
  }

  static delete(id: number) {
    db.prepare('DELETE FROM notes WHERE id = ?').run(id)
  }
}
```

### `ActivityRepository.ts`

```typescript
import db from '../db/database'
import type { Activity } from '@shared/types'

export class ActivityRepository {
  static findByPoint(pointId: number): Activity[] {
    return db.prepare('SELECT * FROM activities WHERE point_id = ? ORDER BY created_at').all(pointId) as Activity[]
  }

  static add(pointId: number, description: string): Activity {
    const result = db.prepare(
      'INSERT INTO activities(point_id, description) VALUES(?,?)'
    ).run(pointId, description)
    return db.prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid) as Activity
  }

  static toggle(id: number): Activity {
    const current = db.prepare('SELECT done FROM activities WHERE id = ?').get(id) as { done: number }
    const newDone = current.done === 0 ? 1 : 0
    db.prepare(`
      UPDATE activities SET done = ?, done_at = ? WHERE id = ?
    `).run(newDone, newDone ? new Date().toISOString() : null, id)
    return db.prepare('SELECT * FROM activities WHERE id = ?').get(id) as Activity
  }

  static remove(id: number) {
    db.prepare('DELETE FROM activities WHERE id = ?').run(id)
  }
}
```

### `StudyRepository.ts`

```typescript
import db from '../db/database'
import type { Study } from '@shared/types'

export class StudyRepository {
  static findByPoint(pointId: number): Study[] {
    return db.prepare('SELECT * FROM studies WHERE point_id = ? ORDER BY created_at').all(pointId) as Study[]
  }

  static add(pointId: number, title: string, url: string | null, type: Study['type']): Study {
    const result = db.prepare(
      'INSERT INTO studies(point_id, title, url, type) VALUES(?,?,?,?)'
    ).run(pointId, title, url, type)
    return db.prepare('SELECT * FROM studies WHERE id = ?').get(result.lastInsertRowid) as Study
  }

  static remove(id: number) {
    db.prepare('DELETE FROM studies WHERE id = ?').run(id)
  }
}
```

---

## Passo 5 — Services (com validação Zod)

```typescript
// src/main/services/RoadmapService.ts
import { z } from 'zod'
import { PointRepository } from '../repositories/PointRepository'
import type { Block, Status } from '@shared/types'

const StatusSchema = z.enum(['pending', 'in_progress', 'done'])

export class RoadmapService {
  static getAll(): Block[] {
    const points = PointRepository.findAll()
    // agrupa por block_id
    const map = new Map<number, Block>()
    for (const pt of points) {
      if (!map.has(pt.block_id)) {
        map.set(pt.block_id, {
          id: pt.block_id,
          title: pt.block_title,
          orderIndex: pt.block_id,
          duration: '',
          description: '',
          points: [],
        })
      }
      map.get(pt.block_id)!.points.push(pt)
    }
    return Array.from(map.values())
  }

  static updateStatus(id: number, status: unknown): void {
    const validated = StatusSchema.parse(status)
    PointRepository.updateStatus(id, validated)
  }

  static getProgress() {
    const points = PointRepository.findAll()
    const total = points.length
    const done = points.filter(p => p.status === 'done').length
    const inProgress = points.filter(p => p.status === 'in_progress').length

    const byBlock: Record<number, { total: number; done: number }> = {}
    for (const pt of points) {
      if (!byBlock[pt.block_id]) byBlock[pt.block_id] = { total: 0, done: 0 }
      byBlock[pt.block_id].total++
      if (pt.status === 'done') byBlock[pt.block_id].done++
    }

    return { total, done, inProgress, percent: Math.round((done / total) * 100), byBlock }
  }
}
```

---

## Passo 6 — IPC Handlers

```typescript
// src/main/ipc/roadmapHandlers.ts
import { ipcMain } from 'electron'
import { RoadmapService } from '../services/RoadmapService'

export function registerRoadmapHandlers() {
  ipcMain.handle('roadmap:getAll',    () => RoadmapService.getAll())
  ipcMain.handle('roadmap:getProgress', () => RoadmapService.getProgress())
  ipcMain.handle('roadmap:updateStatus', (_, id: number, status: string) =>
    RoadmapService.updateStatus(id, status))
}
```

> Registrar todos os handlers no `src/main/index.ts` antes de `createWindow()`:

```typescript
import { registerRoadmapHandlers } from './ipc/roadmapHandlers'
import { registerNoteHandlers }    from './ipc/noteHandlers'
import { registerActivityHandlers } from './ipc/activityHandlers'
import { registerStudyHandlers }   from './ipc/studyHandlers'

app.whenReady().then(() => {
  registerRoadmapHandlers()
  registerNoteHandlers()
  registerActivityHandlers()
  registerStudyHandlers()
  createWindow()
})
```

---

## Passo 7 — `api.ts` no Renderer

```typescript
// src/renderer/lib/api.ts
import type { Block, Note, Activity, Study, ProgressSummary, Status } from '@shared/types'

declare global {
  interface Window {
    electronAPI: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> }
  }
}

const invoke = <T>(channel: string, ...args: unknown[]): Promise<T> =>
  window.electronAPI.invoke(channel, ...args) as Promise<T>

export const api = {
  roadmap: {
    getAll:       ()                          => invoke<Block[]>('roadmap:getAll'),
    getProgress:  ()                          => invoke<ProgressSummary>('roadmap:getProgress'),
    updateStatus: (id: number, s: Status)     => invoke<void>('roadmap:updateStatus', id, s),
  },
  notes: {
    getByPoint:   (pointId: number)           => invoke<Note | null>('notes:getByPoint', pointId),
    save:         (pointId: number, c: string) => invoke<Note>('notes:save', pointId, c),
    getAll:       ()                          => invoke<Note[]>('notes:getAll'),
    search:       (query: string)             => invoke<Note[]>('notes:search', query),
    delete:       (id: number)                => invoke<void>('notes:delete', id),
  },
  activities: {
    getByPoint:   (pointId: number)           => invoke<Activity[]>('activities:getByPoint', pointId),
    add:          (pointId: number, desc: string) => invoke<Activity>('activities:add', pointId, desc),
    toggle:       (id: number)                => invoke<Activity>('activities:toggle', id),
    remove:       (id: number)                => invoke<void>('activities:remove', id),
  },
  studies: {
    getByPoint:   (pointId: number)           => invoke<Study[]>('studies:getByPoint', pointId),
    add:          (pointId: number, title: string, url: string | null, type: Study['type']) =>
                    invoke<Study>('studies:add', pointId, title, url, type),
    remove:       (id: number)                => invoke<void>('studies:remove', id),
  },
}
```

---

## Critério de Conclusão da Fase 1

> ✅ No DevTools do Electron (console do renderer), executar:
> ```js
> await window.electronAPI.invoke('roadmap:getAll')
> ```
> Retorna um array com os 8 blocos e seus pontos. Fechar e reabrir o app mantém os dados.
