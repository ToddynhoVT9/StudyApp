// src/main/repositories/ActivityRepository.ts
import db from '../db/database'
import type { Activity } from '@shared/types'

export class ActivityRepository {
  static findByPoint(pointId: number): Activity[] {
    const rows = db
      .prepare(
        'SELECT * FROM activities WHERE point_id = ? ORDER BY created_at',
      )
      .all(pointId) as any[]
      
    return rows.map((r) => ({
      id: r.id,
      pointId: r.point_id,
      description: r.description,
      done: r.done === 1,
      createdAt: r.created_at,
      doneAt: r.done_at,
    }))
  }

  static add(pointId: number, description: string): Activity {
    const result = db
      .prepare('INSERT INTO activities(point_id, description) VALUES(?, ?)')
      .run(pointId, description)
      
    const row = db
      .prepare('SELECT * FROM activities WHERE id = ?')
      .get(result.lastInsertRowid) as any
      
    return {
      id: row.id,
      pointId: row.point_id,
      description: row.description,
      done: row.done === 1,
      createdAt: row.created_at,
      doneAt: row.done_at,
    }
  }

  static toggle(id: number): Activity {
    const rowStatus = db
      .prepare('SELECT done FROM activities WHERE id = ?')
      .get(id) as { done: number }
    const newDone = rowStatus.done === 0 ? 1 : 0
    db.prepare(
      'UPDATE activities SET done = ?, done_at = ? WHERE id = ?',
    ).run(newDone, newDone ? new Date().toISOString() : null, id)
    
    const row = db
      .prepare('SELECT * FROM activities WHERE id = ?')
      .get(id) as any
      
    return {
      id: row.id,
      pointId: row.point_id,
      description: row.description,
      done: row.done === 1,
      createdAt: row.created_at,
      doneAt: row.done_at,
    }
  }

  static remove(id: number): void {
    db.prepare('DELETE FROM activities WHERE id = ?').run(id)
  }
}
