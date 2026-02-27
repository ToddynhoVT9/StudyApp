// src/renderer/components/Sidebar/Sidebar.tsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useRoadmapStore } from '../../lib/store'
import { STATUS_ICON, STATUS_COLOR } from '../../lib/constants'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const { blocks, activePointId, setActivePoint, progress } = useRoadmapStore()
  const navigate  = useNavigate()
  const location  = useLocation()

  // Mantém o bloco do ponto ativo expandido por padrão
  const [openBlocks, setOpenBlocks] = useState<Set<number>>(new Set([1]))

  const toggleBlock = (id: number) => {
    setOpenBlocks((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className={styles.sidebar}>
      {/* Logo / título */}
      <div className={styles.header}>
        <span className={styles.logo}>🗺️</span>
        <span className={styles.appName}>StudyApp</span>
      </div>

      {/* Barra de progresso compacta */}
      {progress && (
        <div className={styles.progressRow}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className={styles.progressPct}>{progress.percent}%</span>
        </div>
      )}

      {/* Navegação de blocos */}
      <nav className={styles.nav}>
        <p className={styles.sectionLabel}>ROADMAP</p>

        {blocks.map((block) => {
          const blockDone  = block.points.filter((p) => p.status === 'done').length
          const blockTotal = block.points.length
          const isOpen     = openBlocks.has(block.id)

          return (
            <div key={block.id} className={styles.block}>
              <button
                className={`${styles.blockTitle} ${isOpen ? styles.blockOpen : ''}`}
                onClick={() => toggleBlock(block.id)}
                title={`Bloco ${block.id} — ${block.title}`}
              >
                <span className={styles.blockChevron}>{isOpen ? '▾' : '▸'}</span>
                <span className={styles.blockName}>
                  B{block.id} · {block.title}
                </span>
                <span className={styles.blockCount}>
                  {blockDone}/{blockTotal}
                </span>
              </button>

              {isOpen && (
                <ul className={styles.points}>
                  {block.points.map((pt) => (
                    <li
                      key={pt.id}
                      className={`${styles.point} ${activePointId === pt.id ? styles.pointActive : ''}`}
                      onClick={() => {
                        setActivePoint(pt.id)
                        navigate(`/point/${pt.id}`)
                      }}
                    >
                      <span
                        className={styles.statusDot}
                        style={{ color: STATUS_COLOR[pt.status] }}
                        title={pt.status}
                      >
                        {STATUS_ICON[pt.status]}
                      </span>
                      <span className={styles.pointName}>{pt.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </nav>

      {/* Ações do rodapé */}
      <div className={styles.footer}>
        <button
          className={`${styles.footerBtn} ${isActive('/notes') ? styles.footerActive : ''}`}
          onClick={() => navigate('/notes')}
        >
          <span>📝</span> Notas
        </button>
        <button
          className={`${styles.footerBtn} ${isActive('/settings') ? styles.footerActive : ''}`}
          onClick={() => navigate('/settings')}
        >
          <span>⚙️</span> Config
        </button>
      </div>
    </aside>
  )
}
