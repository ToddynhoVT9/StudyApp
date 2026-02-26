# Extras — Planejamento

## Estrutura do Projeto

```
StudyApp/
├── plans/                          ← documentação de planejamento
│   ├── index.md
│   ├── frontend/frontend.md
│   ├── backend/backend.md
│   ├── storage/storage.md
│   ├── routes-and-flows/routes-and-flows.md
│   └── extras/extras.md
│
├── PlanosDeEstudos/                ← conteúdo curricular de origem
│   ├── roadmap.md
│   ├── README.md
│   ├── 01_plano-estudos-*.md  (8 arquivos)
│   └── PLUS-rubrica-*.md
│
└── src/                            ← código fonte (a ser criado)
    ├── main/                       ← Electron Main Process
    │   ├── db/
    │   │   ├── database.ts
    │   │   ├── schema.sql
    │   │   └── seed.ts
    │   ├── repositories/
    │   │   ├── PointRepository.ts
    │   │   ├── NoteRepository.ts
    │   │   ├── StudyRepository.ts
    │   │   └── ActivityRepository.ts
    │   ├── services/
    │   │   ├── RoadmapService.ts
    │   │   ├── NoteService.ts
    │   │   ├── StudyService.ts
    │   │   └── ActivityService.ts
    │   ├── ipc/
    │   │   ├── roadmapHandlers.ts
    │   │   ├── noteHandlers.ts
    │   │   ├── studyHandlers.ts
    │   │   └── activityHandlers.ts
    │   └── index.ts                ← entry point do main process
    │
    └── renderer/                   ← React App
        ├── lib/
        │   ├── api.ts              ← wrapper IPC
        │   └── store.ts            ← Zustand store
        ├── components/
        │   ├── Sidebar/
        │   ├── RoadmapCanvas/
        │   ├── PointDetail/
        │   ├── NoteEditor/
        │   ├── ActivityList/
        │   └── StudyList/
        ├── views/
        │   ├── RoadmapView.tsx
        │   ├── PointDetailView.tsx
        │   ├── NotesView.tsx
        │   └── SettingsView.tsx
        ├── App.tsx
        └── main.tsx
```

---

## Roadmap de Versões do App

### v1 — MVP (Mínimo Viável)

- [x] Roadmap visual com 8 blocos e pontos pré-carregados
- [x] Marcar status de cada ponto (pending / in_progress / done)
- [x] Notas Markdown por ponto (auto-save)
- [x] Atividades por ponto (add / toggle / remove)
- [x] Sidebar com lista de blocos/pontos
- [x] Barra de progresso global

### v2 — Enriquecimento

- [ ] Materiais de estudo com links externos por ponto
- [ ] Busca global em notas (full-text SQLite FTS5)
- [ ] Exportação do banco como `.db` ou backup JSON
- [ ] Cronômetro de sessão de estudo (Pomodoro simples)
- [ ] Filtros no roadmap (ver só pendentes, só concluídos)

### v3 — Qualidade e Polimento

- [ ] Temas (dark / light / sepia)
- [ ] Atalhos de teclado globais
- [ ] Notificações desktop (lembrete de estudo)
- [ ] Revisão espaçada automatizada (flashcards por ponto)
- [ ] Estatísticas de progresso (histórico de sessões, gráficos)

---

## Modelo de Tipos TypeScript

```typescript
// Tipos compartilhados entre main e renderer
// src/shared/types.ts

export type Status = 'pending' | 'in_progress' | 'done'

export interface Block {
  id: number
  title: string
  orderIndex: number
  duration: string
  description: string
  points: RoadMapPoint[]
}

export interface RoadMapPoint {
  id: number
  blockId: number
  title: string
  orderIndex: number
  weeks: string
  status: Status
  updatedAt: string
}

export interface Note {
  id: number
  pointId: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface Study {
  id: number
  pointId: number
  title: string
  url: string | null
  type: 'text' | 'link' | 'video' | 'book'
  createdAt: string
}

export interface Activity {
  id: number
  pointId: number
  description: string
  done: boolean
  createdAt: string
  doneAt: string | null
}

export interface ProgressSummary {
  total: number
  done: number
  inProgress: number
  percent: number
  byBlock: Record<number, { total: number; done: number }>
}
```

---

## Decisões de Design

| Decisão | Razão |
|---|---|
| **Electron** em vez de web puro | Requisito de funcionamento off-line + acesso ao filesystem e SQLite nativo |
| **SQLite síncrono** (`better-sqlite3`) | App single-user, simplifica código, sem callback hell |
| **Zustand** para estado | Mais leve que Redux, funciona bem com React 18 e IPC async |
| **Uma nota por ponto** (v1) | Simplificação; pode-se expandir para múltiplas notas em v2 |
| **Seed embutido** (não importa .md) | Os dados do PlanoDeEstudos são estruturados no seed.sql, preservando a ordem e a hierarquia |
| **Hash Router** no Electron | Electron serve arquivos locais; hash router evita problemas com paths |
| **Debounce** no NoteEditor | Evita writes excessivos no banco enquanto o usuário digita |

---

## Dependências Previstas (`package.json`)

```json
{
  "dependencies": {
    "better-sqlite3": "^9.x",
    "electron-store": "^8.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "zustand": "^4.x",
    "framer-motion": "^11.x",
    "@codemirror/lang-markdown": "^6.x",
    "codemirror": "^6.x",
    "lucide-react": "^0.x",
    "zod": "^3.x"
  },
  "devDependencies": {
    "electron": "^30.x",
    "electron-builder": "^24.x",
    "vite": "^5.x",
    "vite-plugin-electron": "^0.x",
    "typescript": "^5.x",
    "@types/better-sqlite3": "^7.x"
  }
}
```
