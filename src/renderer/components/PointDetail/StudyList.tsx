// src/renderer/components/PointDetail/StudyList.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../lib/api'
import type { Study } from '@shared/types'
import styles from './StudyList.module.css'

const TYPE_LABELS: Record<Study['type'], string> = {
  text:  '📄 Texto',
  link:  '🔗 Link',
  video: '🎥 Vídeo',
  book:  '📖 Livro',
}

interface Props {
  pointId:  number
  studies:  Study[]
  onChanged: () => void
}

export function StudyList({ pointId, studies, onChanged }: Props) {
  const [formOpen, setFormOpen] = useState(false)
  const [title,    setTitle]    = useState('')
  const [url,      setUrl]      = useState('')
  const [type,     setType]     = useState<Study['type']>('link')
  const [loading,  setLoading]  = useState(false)

  const handleAdd = async () => {
    const t = title.trim()
    if (!t) return
    setLoading(true)
    await api.studies.add(pointId, t, url.trim() || null, type)
    setTitle('')
    setUrl('')
    setFormOpen(false)
    onChanged()
    setLoading(false)
  }

  const handleRemove = async (id: number) => {
    await api.studies.remove(id)
    onChanged()
  }

  return (
    <div className={styles.list}>
      {studies.length === 0 && (
        <p className={styles.empty}>Nenhum material ainda. Adicione recursos de estudo abaixo.</p>
      )}

      <ul className={styles.items}>
        <AnimatePresence initial={false}>
          {studies.map((s) => (
            <motion.li
              key={s.id}
              className={styles.item}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className={styles.typeIcon} title={TYPE_LABELS[s.type]}>
                {TYPE_LABELS[s.type].split(' ')[0]}
              </span>

              <span className={styles.studyContent}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                    title={s.url}
                  >
                    {s.title}
                  </a>
                ) : (
                  <span className={styles.studyTitle}>{s.title}</span>
                )}
              </span>

              <button
                className={styles.removeBtn}
                onClick={() => handleRemove(s.id)}
                title="Remover material"
              >
                ✕
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Formulário de adição */}
      <AnimatePresence>
        {formOpen ? (
          <motion.div
            className={styles.form}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
          >
            <input
              className={styles.input}
              placeholder="Título do material *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <input
              className={styles.input}
              placeholder="URL (opcional)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <select
              className={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value as Study['type'])}
            >
              {(Object.entries(TYPE_LABELS) as [Study['type'], string][]).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <div className={styles.formActions}>
              <button
                className={styles.saveBtn}
                onClick={handleAdd}
                disabled={loading || !title.trim()}
              >
                Salvar
              </button>
              <button className={styles.cancelBtn} onClick={() => setFormOpen(false)}>
                Cancelar
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            className={styles.addBtn}
            onClick={() => setFormOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            + Adicionar material
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
