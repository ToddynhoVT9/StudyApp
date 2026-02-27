// src/renderer/components/PointDetail/ActivityList.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../lib/api'
import type { Activity } from '@shared/types'
import styles from './ActivityList.module.css'

interface Props {
  pointId:    number
  activities: Activity[]
  onChanged:  () => void
}

export function ActivityList({ pointId, activities, onChanged }: Props) {
  const [newDesc, setNewDesc] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    const desc = newDesc.trim()
    if (!desc) return
    setLoading(true)
    await api.activities.add(pointId, desc)
    setNewDesc('')
    onChanged()
    setLoading(false)
  }

  const handleToggle = async (id: number) => {
    await api.activities.toggle(id)
    onChanged()
  }

  const handleRemove = async (id: number) => {
    await api.activities.remove(id)
    onChanged()
  }

  return (
    <div className={styles.list}>
      {activities.length === 0 && (
        <p className={styles.empty}>Nenhuma atividade ainda. Adicione abaixo.</p>
      )}

      <ul className={styles.items}>
        <AnimatePresence initial={false}>
          {activities.map((act) => (
            <motion.li
              key={act.id}
              className={styles.item}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={Boolean(act.done)}
                onChange={() => handleToggle(act.id)}
              />
              <span className={`${styles.desc} ${act.done ? styles.done : ''}`}>
                {act.description}
              </span>
              <button
                className={styles.removeBtn}
                onClick={() => handleRemove(act.id)}
                title="Remover atividade"
              >
                ✕
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Linha de adição */}
      <div className={styles.addRow}>
        <input
          type="text"
          className={styles.input}
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nova atividade…"
          disabled={loading}
        />
        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={loading || !newDesc.trim()}
        >
          + Adicionar
        </button>
      </div>
    </div>
  )
}
