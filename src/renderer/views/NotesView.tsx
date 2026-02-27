// src/renderer/views/NotesView.tsx
// Busca full-text global em todas as notas com debounce de 300ms.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { api }          from '../lib/api'
import { useDebounce }  from '../hooks/useDebounce'
import type { Note }    from '@shared/types'
import styles from './NotesView.module.css'

type NoteWithTitle = Note & { point_title: string }

export function NotesView() {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<NoteWithTitle[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const notes = debouncedQuery.trim()
        ? await api.notes.search(debouncedQuery)
        : await api.notes.getAll()
      setResults(notes as NoteWithTitle[])
      setLoading(false)
    }
    load()
  }, [debouncedQuery])

  /** Remove marcadores Markdown para preview limpo */
  const preview = (content: string) =>
    content
      .slice(0, 160)
      .replace(/#{1,6}\s/g, '')
      .replace(/[*_`~[\]]/g, '')
      .trim()

  return (
    <motion.div
      className={styles.view}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>📝 Notas</h1>
        <p className={styles.subtitle}>
          {results.length} {results.length === 1 ? 'nota' : 'notas'}
          {query.trim() ? ` para "${debouncedQuery}"` : ' no total'}
        </p>
      </header>

      <div className={styles.searchBar}>
        <input
          type="search"
          placeholder="Buscar nas notas…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          autoFocus
        />
      </div>

      <div className={styles.listWrapper}>
        {loading ? (
          <div className={styles.empty}>⏳ Buscando…</div>
        ) : (
          <AnimatePresence mode="wait">
            {results.length === 0 ? (
              <motion.div
                key="empty"
                className={styles.empty}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {query.trim()
                  ? `Nenhuma nota encontrada para "${query}".`
                  : 'Nenhuma nota ainda. Escreva algo em um ponto do roadmap.'}
              </motion.div>
            ) : (
              <motion.ul
                key="list"
                className={styles.list}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {results.map((note) => (
                  <motion.li
                    key={note.id}
                    className={styles.item}
                    onClick={() => navigate(`/point/${note.pointId}`)} // Changed note.point_id to note.pointId
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className={styles.pointTitle}>
                      {note.pointTitle} {/* Changed note.point_title to note.pointTitle */}
                    </span>
                    <p className={styles.preview}>{preview(note.content)}</p>
                    <span className={styles.date}>
                      {new Date(note.updatedAt).toLocaleDateString('pt-BR', { // Changed note.updated_at to note.updatedAt
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  )
}
