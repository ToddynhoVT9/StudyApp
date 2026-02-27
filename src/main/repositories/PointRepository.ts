// src/main/repositories/PointRepository.ts
import db from '../db/database'
import type { RoadMapPoint, Status } from '@shared/types'

export class PointRepository {
  /** Retorna todos os pontos com título do bloco pai, ordenados */
  static findAll(): (RoadMapPoint & { blockTitle: string })[] {
    const rows = db
      .prepare(
        `SELECT rp.*, b.title as block_title
         FROM roadmap_points rp
         JOIN blocks b ON b.id = rp.block_id
         ORDER BY rp.block_id, rp.order_index`,
      )
      .all() as any[]
      
    return rows.map((r) => ({
      id: r.id,
      blockId: r.block_id,
      title: r.title,
      orderIndex: r.order_index,
      weeks: r.weeks,
      status: r.status,
      updatedAt: r.updated_at,
      blockTitle: r.block_title,
    }))
  }

  static findById(id: number): RoadMapPoint | undefined {
    const row = db
      .prepare('SELECT * FROM roadmap_points WHERE id = ?')
      .get(id) as any
      
    if (!row) return undefined
    
    return {
      id: row.id,
      blockId: row.block_id,
      title: row.title,
      orderIndex: row.order_index,
      weeks: row.weeks,
      status: row.status,
      updatedAt: row.updated_at,
    }
  }

  static findByBlock(blockId: number): RoadMapPoint[] {
    const rows = db
      .prepare(
        'SELECT * FROM roadmap_points WHERE block_id = ? ORDER BY order_index',
      )
      .all(blockId) as any[]
      
    return rows.map((r) => ({
      id: r.id,
      blockId: r.block_id,
      title: r.title,
      orderIndex: r.order_index,
      weeks: r.weeks,
      status: r.status,
      updatedAt: r.updated_at,
    }))
  }

  static updateStatus(id: number, status: Status): void {
    db.prepare(
      `UPDATE roadmap_points
       SET status = ?, updated_at = datetime('now')
       WHERE id = ?`,
    ).run(status, id)
  }
}
