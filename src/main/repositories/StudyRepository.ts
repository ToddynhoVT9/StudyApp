// src/main/repositories/StudyRepository.ts
import db from '../db/database'
import type { Study } from '@shared/types'

export class StudyRepository {
  static findByPoint(pointId: number): Study[] {
    const rows = db
      .prepare(
        'SELECT * FROM studies WHERE point_id = ? ORDER BY created_at',
      )
      .all(pointId) as any[]
      
    return rows.map((r) => ({
      id: r.id,
      pointId: r.point_id,
      title: r.title,
      url: r.url,
      type: r.type,
      createdAt: r.created_at,
    }))
  }

  static add(
    pointId: number,
    title: string,
    url: string | null,
    type: Study['type'],
  ): Study {
    const result = db
      .prepare(
        'INSERT INTO studies(point_id, title, url, type) VALUES(?, ?, ?, ?)',
      )
      .run(pointId, title, url, type)
      
    const row = db
      .prepare('SELECT * FROM studies WHERE id = ?')
      .get(result.lastInsertRowid) as any
      
    return {
      id: row.id,
      pointId: row.point_id,
      title: row.title,
      url: row.url,
      type: row.type,
      createdAt: row.created_at,
    }
  }

  static remove(id: number): void {
    db.prepare('DELETE FROM studies WHERE id = ?').run(id)
  }
}
