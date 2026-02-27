// src/renderer/views/PointDetailView.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRoadmapStore } from '../lib/store'
import { usePointData }    from '../hooks/usePointData'
import { NoteEditor }      from '../components/PointDetail/NoteEditor'
import { ActivityList }    from '../components/PointDetail/ActivityList'
import { StudyList }       from '../components/PointDetail/StudyList'
import { STATUS_ICON, STATUS_COLOR, STATUS_LABEL } from '../lib/constants'
import type { Status } from '@shared/types'
import styles from './PointDetailView.module.css'

export function PointDetailView() {
  const { id }    = useParams<{ id: string }>()
  const pointId   = Number(id)
  const navigate  = useNavigate()

  const { blocks, updatePointStatus } = useRoadmapStore()

  // Localiza o ponto no store (já carregado na Fase 2)
  const allPoints = blocks.flatMap((b) => b.points)
  const point     = allPoints.find((p) => p.id === pointId)

  // Dados do ponto (nota, atividades, estudos)
  const { note, activities, studies, loading, reload } = usePointData(pointId)

  // Navegação prev/next
  const idx  = allPoints.findIndex((p) => p.id === pointId)
  const prev = allPoints[idx - 1] ?? null
  const next = allPoints[idx + 1] ?? null

  if (!point) {
    return (
      <div className={styles.notFound}>
        <p>Ponto não encontrado. <button onClick={() => navigate('/')}>← Voltar</button></p>
      </div>
    )
  }

  return (
    <motion.div
      className={styles.view}
      key={pointId}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => navigate('/')}
        >
          ← Roadmap
        </button>

        <div className={styles.titleBlock}>
          <span className={styles.blockBadge}>
            Bloco {blocks.find((b) => b.points.some((p) => p.id === pointId))?.id}
          </span>
          <h1 className={styles.title}>{point.title}</h1>
          {point.weeks && (
            <span className={styles.weeks}>Semanas {point.weeks}</span>
          )}
        </div>

        {/* Seletor de status */}
        <div className={styles.statusWrapper}>
          <label className={styles.statusLabel}>Status</label>
          <select
            className={styles.statusSelect}
            value={point.status}
            style={{ color: STATUS_COLOR[point.status] }}
            onChange={(e) =>
              updatePointStatus(point.id, e.target.value as Status)
            }
          >
            <option value="pending">
              {STATUS_ICON.pending} {STATUS_LABEL.pending}
            </option>
            <option value="in_progress">
              {STATUS_ICON.in_progress} {STATUS_LABEL.in_progress}
            </option>
            <option value="done">
              {STATUS_ICON.done} {STATUS_LABEL.done}
            </option>
          </select>
        </div>
      </header>

      {/* ── Corpo ────────────────────────────────────────────── */}
      <div className={styles.body}>
        {loading ? (
          <div className={styles.loading}>⏳ Carregando…</div>
        ) : (
          <>
            {/* Notas Markdown */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>📝 Notas</h2>
              <NoteEditor
                pointId={pointId}
                initialContent={note?.content ?? ''}
                onSaved={reload}
              />
            </section>

            {/* Atividades */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                ✏️ Atividades
                {activities.length > 0 && (
                  <span className={styles.badge}>
                    {activities.filter((a) => a.done).length}/{activities.length}
                  </span>
                )}
              </h2>
              <ActivityList
                pointId={pointId}
                activities={activities}
                onChanged={reload}
              />
            </section>

            {/* Materiais */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                📚 Materiais de Estudo
                {studies.length > 0 && (
                  <span className={styles.badge}>{studies.length}</span>
                )}
              </h2>
              <StudyList
                pointId={pointId}
                studies={studies}
                onChanged={reload}
              />
            </section>
          </>
        )}
      </div>

      {/* ── Navegação prev/next ───────────────────────────────── */}
      <footer className={styles.navFooter}>
        {prev ? (
          <button
            className={styles.navBtn}
            onClick={() => navigate(`/point/${prev.id}`)}
          >
            ← {prev.title}
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            className={`${styles.navBtn} ${styles.navBtnRight}`}
            onClick={() => navigate(`/point/${next.id}`)}
          >
            {next.title} →
          </button>
        ) : (
          <span />
        )}
      </footer>
    </motion.div>
  )
}
