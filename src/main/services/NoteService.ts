// src/main/services/NoteService.ts
import { z } from 'zod'
import { NoteRepository } from '../repositories/NoteRepository'
import type { Note } from '@shared/types'

const SaveSchema = z.object({
  pointId: z.number().int().positive(),
  content: z.string(),
})

export class NoteService {
  static getByPoint(pointId: number): Note | null {
    return NoteRepository.findByPoint(pointId) ?? null
  }

  static save(pointId: unknown, content: unknown): Note {
    const { pointId: pid, content: c } = SaveSchema.parse({ pointId, content })
    return NoteRepository.upsert(pid, c)
  }

  static getAll(): (Note & { pointTitle: string })[] {
    return NoteRepository.findAll()
  }

  static search(query: unknown): (Note & { pointTitle: string })[] {
    const q = z.string().parse(query)
    return NoteRepository.search(q)
  }

  static delete(id: number): void {
    NoteRepository.delete(id)
  }
}
