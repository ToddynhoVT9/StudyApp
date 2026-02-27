// src/main/services/ActivityService.ts
import { z } from 'zod'
import { ActivityRepository } from '../repositories/ActivityRepository'
import type { Activity } from '@shared/types'

const AddSchema = z.object({
  pointId:     z.number().int().positive(),
  description: z.string().min(1),
})

export class ActivityService {
  static getByPoint(pointId: number): Activity[] {
    return ActivityRepository.findByPoint(pointId)
  }

  static add(pointId: unknown, description: unknown): Activity {
    const { pointId: pid, description: desc } = AddSchema.parse({
      pointId,
      description,
    })
    return ActivityRepository.add(pid, desc)
  }

  static toggle(id: number): Activity {
    return ActivityRepository.toggle(id)
  }

  static remove(id: number): void {
    ActivityRepository.remove(id)
  }
}
