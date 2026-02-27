// src/renderer/components/RoadmapCanvas/BlockCard.tsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRoadmapStore } from '../../lib/store'
import { STATUS_COLOR, STATUS_ICON, NEXT_STATUS } from '../../lib/constants'
import type { Block, Status } from '@shared/types'
import styles from './BlockCard.module.css'

interface Props {
  block: Block
}

export function BlockCard({ block }: Props) {
  const navigate           = useNavigate()
  const updatePointStatus  = useRoadmapStore((s) => s.updatePointStatus)
  const setActivePoint     = useRoadmapStore((s) => s.setActivePoint)

  const done  = block.points.filter((p) => p.status === 'done').length
  const total = block.points.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: block.id * 0.04 }}
    >
      {/* Header do bloco */}
      <header 
        className={styles.header} 
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(`/block/${block.id}`)}
        title={`Ver detalhes do Bloco ${block.id}`}
      >
        <div className={styles.headerText}>
          <span className={styles.blockNum}>Bloco {block.id}</span>
          <h2 className={styles.blockTitle}>{block.title}</h2>
          {block.duration && (
            <span className={styles.duration}>{block.duration}</span>
          )}
        </div>
        <span className={styles.progressLabel}>
          {done}/{total}
          <small> · {pct}%</small>
        </span>
      </header>

      {/* Barra de progresso do bloco */}
      <div className={styles.progressTrack}>
        <motion.div
          className={styles.progressFill}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, delay: block.id * 0.06 }}
        />
      </div>

      {/* Lista de pontos */}
      <ul className={styles.points}>
        {block.points.map((pt) => (
          <li key={pt.id} className={styles.point}>
            {/* Botão de status — clique avança o ciclo pendente→in_progress→done */}
            <button
              className={styles.statusBtn}
              style={{ color: STATUS_COLOR[pt.status] }}
              onClick={() =>
                updatePointStatus(pt.id, NEXT_STATUS[pt.status] as Status)
              }
              title={`Status: ${pt.status} → clique para avançar`}
            >
              {STATUS_ICON[pt.status]}
            </button>

            {/* Título do ponto — clique vai para PointDetailView */}
            <span
              className={`${styles.pointTitle} ${
                pt.status === 'done' ? styles.pointDone : ''
              }`}
              onClick={() => {
                setActivePoint(pt.id)
                navigate(`/point/${pt.id}`)
              }}
            >
              {pt.title}
              {pt.weeks && (
                <small className={styles.weeks}>sem. {pt.weeks}</small>
              )}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  )
}
