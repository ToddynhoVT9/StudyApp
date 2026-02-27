// src/renderer/views/BlockView.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRoadmapStore } from '../lib/store'
import { STATUS_COLOR, STATUS_ICON, NEXT_STATUS } from '../lib/constants'
import type { Status } from '@shared/types'
import styles from './BlockView.module.css'
import cardStyles from '../components/RoadmapCanvas/BlockCard.module.css'

export function BlockView() {
  const { blockId } = useParams()
  const blocks = useRoadmapStore(s => s.blocks)
  const block = blocks.find(b => b.id === Number(blockId))
  const navigate = useNavigate()
  
  const updatePointStatus = useRoadmapStore((s) => s.updatePointStatus)
  const setActivePoint = useRoadmapStore((s) => s.setActivePoint)

  if (!block) {
    return (
      <div className={styles.view}>
        <h2>Bloco não encontrado.</h2>
        <button onClick={() => navigate('/')}>Voltar ao Roadmap</button>
      </div>
    )
  }

  const done = block.points.filter((p) => p.status === 'done').length
  const total = block.points.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <motion.div
      className={styles.view}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <header>
        <div className={styles.headerTitle}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            ← Roadmap
          </button>
          <h1 className={styles.title}>Bloco {block.id}: {block.title}</h1>
        </div>
        <p className={styles.description}>
          {block.duration && <span className={styles.duration}>{block.duration}</span>}
          {block.description}
        </p>
      </header>

      {/* Reusing BlockCard styles for the progress bar and list structure */}
      <div className={cardStyles.progressTrack} style={{ marginTop: '16px' }}>
        <motion.div
          className={cardStyles.progressFill}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', textAlign: 'right', marginBottom: '24px' }}>
        {done} de {total} concluídos ({pct}%)
      </div>

      <div className={styles.pointsList}>
        <ul className={cardStyles.points}>
          {block.points.map((pt) => (
            <li key={pt.id} className={cardStyles.point} style={{ fontSize: '15px', padding: '12px 0' }}>
              <button
                className={cardStyles.statusBtn}
                style={{ color: STATUS_COLOR[pt.status], transform: 'scale(1.2)', marginRight: '16px' }}
                onClick={() =>
                  updatePointStatus(pt.id, NEXT_STATUS[pt.status] as Status)
                }
                title={`Status: ${pt.status} → clique para avançar`}
              >
                {STATUS_ICON[pt.status]}
              </button>

              <span
                className={`${cardStyles.pointTitle} ${
                  pt.status === 'done' ? cardStyles.pointDone : ''
                }`}
                onClick={() => {
                  setActivePoint(pt.id)
                  navigate(`/point/${pt.id}`)
                }}
              >
                {pt.title}
                {pt.weeks && (
                  <small className={cardStyles.weeks} style={{ marginLeft: '12px' }}>
                    (sem. {pt.weeks})
                  </small>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
