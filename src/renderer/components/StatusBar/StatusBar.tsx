// src/renderer/components/StatusBar/StatusBar.tsx
import { useRoadmapStore } from '../../lib/store'
import styles from './StatusBar.module.css'

export function StatusBar() {
  const progress = useRoadmapStore((s) => s.progress)
  if (!progress) return null

  return (
    <footer className={styles.bar}>
      <span className={styles.label}>
        Pontos concluídos:{' '}
        <strong>
          {progress.done}/{progress.total}
        </strong>
      </span>

      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <span className={styles.pct}>
        <strong>{progress.percent}%</strong> completo
      </span>
    </footer>
  )
}
