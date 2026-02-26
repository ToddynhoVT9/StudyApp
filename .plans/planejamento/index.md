# StudyApp — Planejamento de Implementação

> Guia de implementação passo a passo, dividido em **5 fases** sequenciais e cumulativas.
> Cada fase termina com um app funcional incrementando o anterior.

---

## Fases de Implementação

```mermaid
gantt
    title StudyApp — Cronograma de Implementação
    dateFormat  YYYY-MM-DD
    axisFormat  Fase %d

    section Fase 0 · Setup
    Estrutura Electron + Vite + TS        :f0a, 2026-03-01, 3d
    Configuração ESLint + Prettier        :f0b, after f0a, 1d

    section Fase 1 · Core Data
    Schema SQL + Seed                     :f1a, after f0b, 2d
    Repositories + Services               :f1b, after f1a, 3d
    Handlers IPC + api.ts                 :f1c, after f1b, 2d

    section Fase 2 · Roadmap UI
    Zustand Store                         :f2a, after f1c, 1d
    Layout principal + Sidebar            :f2b, after f2a, 3d
    RoadmapCanvas (blocos + pontos)       :f2c, after f2b, 3d
    Marcar status + persistência          :f2d, after f2c, 2d

    section Fase 3 · Point Detail
    PointDetailView (layout)              :f3a, after f2d, 2d
    NoteEditor (CodeMirror + auto-save)   :f3b, after f3a, 2d
    ActivityList (CRUD)                   :f3c, after f3b, 2d
    StudyList (CRUD)                      :f3d, after f3c, 2d

    section Fase 4 · Polish
    NotesView (busca global)              :f4a, after f3d, 2d
    StatusBar + ProgressBar               :f4b, after f4a, 1d
    Animações Framer Motion               :f4c, after f4b, 2d
    SettingsView + temas                  :f4d, after f4c, 2d
    Build Electron (.exe)                 :f4e, after f4d, 1d
```

---

## Mapa de Fases

| Fase | Nome | Entregável Principal | Doc |
|---|---|---|---|
| **0** | Setup & Scaffolding | Projeto Electron + React rodando | [fase-0-setup.md](./fase-0-setup.md) |
| **1** | Core Data Layer | Banco, Services, IPC funcionando | [fase-1-core-data.md](./fase-1-core-data.md) |
| **2** | Roadmap UI | Roadmap visual marcável | [fase-2-roadmap-ui.md](./fase-2-roadmap-ui.md) |
| **3** | Point Detail | Notas + Atividades + Estudos por ponto | [fase-3-point-detail.md](./fase-3-point-detail.md) |
| **4** | Polish & Entrega | Busca, animações, build final | [fase-4-polish.md](./fase-4-polish.md) |

---

## Critério de "Fase Completa"

Cada fase é considerada concluída quando:

1. O código compila sem erros TypeScript
2. O app Electron abre e exibe a feature correspondente sem crashes
3. A persistência funciona: fechar e reabrir o app mantém os dados
4. Nenhuma regressão nas features de fases anteriores

---

## Convenções de Implementação

- **Branch por fase:** `feat/fase-0`, `feat/fase-1`, etc.
- **Commits semânticos:** `feat:`, `fix:`, `chore:`, `refactor:`
- **Tipagem estrita:** `strict: true` no `tsconfig.json`
- **Sem `any`:** usar `unknown` + type guards quando necessário
- **Validação de entrada IPC:** toda payload IPC passa por `Zod.parse()` antes de entrar na service layer
