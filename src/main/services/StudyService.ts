// src/main/services/StudyService.ts
import { z } from 'zod'
import { StudyRepository } from '../repositories/StudyRepository'
import type { Study } from '@shared/types'

const AddSchema = z.object({
  pointId: z.number().int().positive(),
  title:   z.string().min(1),
  url:     z.string().url().nullable().optional(),
  type:    z.enum(['text', 'link', 'video', 'book']).default('text'),
})

export class StudyService {
  static getByPoint(pointId: number): Study[] {
    return StudyRepository.findByPoint(pointId)
  }

  static add(
    pointId: unknown,
    title: unknown,
    url: unknown,
    type: unknown,
  ): Study {
    const parsed = AddSchema.parse({ pointId, title, url: url || null, type })
    return StudyRepository.add(
      parsed.pointId,
      parsed.title,
      parsed.url ?? null,
      parsed.type,
    )
  }

  static remove(id: number): void {
    StudyRepository.remove(id)
  }
}
