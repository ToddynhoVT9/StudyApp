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

export const STATUS_LABEL: Record<Status, string> = {
  pending:     'Pendente',
  in_progress: 'Em andamento',
  done:        'Concluído',
}

/** Ciclo de status ao clicar */
export const NEXT_STATUS: Record<Status, Status> = {
  pending:     'in_progress',
  in_progress: 'done',
  done:        'pending',
}
