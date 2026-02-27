// src/main/services/RoadmapService.ts
import { z } from 'zod'
import { PointRepository } from '../repositories/PointRepository'
import type { Block, ProgressSummary, Status } from '@shared/types'
import db from '../db/database'

const StatusSchema = z.enum(['pending', 'in_progress', 'done'])

export class RoadmapService {
  /** Retorna todos os blocos com seus pontos aninhados */
  static getAll(): Block[] {
    // Carregar blocos da tabela (com descrição e duração)
    const blocksRows = db
      .prepare('SELECT * FROM blocks ORDER BY order_index')
      .all() as Array<{
        id: number
        title: string
        order_index: number
        duration: string
        description: string
      }>

    const points = PointRepository.findAll()

    return blocksRows.map((b) => ({
      id: b.id,
      title: b.title,
      orderIndex: b.order_index,
      duration: b.duration ?? '',
      description: b.description ?? '',
      points: points.filter((p) => p.blockId === b.id),
    }))
  }

  static updateStatus(id: number, status: unknown): void {
    const validated = StatusSchema.parse(status)
    PointRepository.updateStatus(id, validated as Status)
  }

  static getProgress(): ProgressSummary {
    const points = PointRepository.findAll()
    const total      = points.length
    const done       = points.filter((p) => p.status === 'done').length
    const inProgress = points.filter((p) => p.status === 'in_progress').length

    const byBlock: Record<number, { total: number; done: number }> = {}
    for (const pt of points) {
      if (!byBlock[pt.blockId]) byBlock[pt.blockId] = { total: 0, done: 0 }
      byBlock[pt.blockId].total++
      if (pt.status === 'done') byBlock[pt.blockId].done++
    }

    return {
      total,
      done,
      inProgress,
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
      byBlock,
    }
  }

  static resetProgress(): void {
    db.prepare(
      `UPDATE roadmap_points SET status = 'pending', updated_at = datetime('now')`,
    ).run()
  }
}
