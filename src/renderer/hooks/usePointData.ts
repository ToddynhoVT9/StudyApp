// src/renderer/hooks/usePointData.ts
// Carrega nota, atividades e estudos de um ponto via IPC.
import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import type { Note, Activity, Study } from '@shared/types'

export function usePointData(pointId: number) {
  const [note,       setNote]       = useState<Note | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [studies,    setStudies]    = useState<Study[]>([])
  const [loading,    setLoading]    = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    const [n, acts, studs] = await Promise.all([
      api.notes.getByPoint(pointId),
      api.activities.getByPoint(pointId),
      api.studies.getByPoint(pointId),
    ])
    setNote(n)
    setActivities(acts)
    setStudies(studs)
    setLoading(false)
  }, [pointId])

  useEffect(() => {
    reload()
  }, [reload])

  return { note, activities, studies, loading, reload, setNote, setActivities, setStudies }
}
