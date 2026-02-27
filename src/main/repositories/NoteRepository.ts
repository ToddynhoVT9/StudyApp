// src/main/repositories/NoteRepository.ts
import db from '../db/database'
import type { Note } from '@shared/types'

export class NoteRepository {
  static findByPoint(pointId: number): Note | undefined {
    const row = db
      .prepare('SELECT * FROM notes WHERE point_id = ?')
      .get(pointId) as any
      
    if (!row) return undefined
    
    return {
      id: row.id,
      pointId: row.point_id,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  /** Cria ou atualiza a nota do ponto (uma nota por ponto via UNIQUE index) */
  static upsert(pointId: number, content: string): Note {
    db.prepare(
      `INSERT INTO notes (point_id, content)
       VALUES (?, ?)
       ON CONFLICT(point_id) DO UPDATE SET
         content    = excluded.content,
         updated_at = datetime('now')`,
    ).run(pointId, content)
    return this.findByPoint(pointId)!
  }

  /** Todas as notas com título do ponto — para a NotesView */
  static findAll(): (Note & { pointTitle: string })[] {
    const rows = db
      .prepare(
        `SELECT n.*, rp.title as point_title
         FROM notes n
         JOIN roadmap_points rp ON rp.id = n.point_id
         ORDER BY n.updated_at DESC`,
      )
      .all() as any[]
      
    return rows.map((r) => ({
      id: r.id,
      pointId: r.point_id,
      content: r.content,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      pointTitle: r.point_title,
    }))
  }

  /** Busca full-text simples (LIKE) */
  static search(query: string): (Note & { pointTitle: string })[] {
    const rows = db
      .prepare(
        `SELECT n.*, rp.title as point_title
         FROM notes n
         JOIN roadmap_points rp ON rp.id = n.point_id
         WHERE n.content LIKE ?
         ORDER BY n.updated_at DESC`,
      )
      .all(`%${query}%`) as any[]
      
    return rows.map((r) => ({
      id: r.id,
      pointId: r.point_id,
      content: r.content,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      pointTitle: r.point_title,
    }))
  }

  static delete(id: number): void {
    db.prepare('DELETE FROM notes WHERE id = ?').run(id)
  }
}
