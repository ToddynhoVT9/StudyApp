// src/renderer/views/RoadmapView.tsx
import { useRoadmapStore } from '../lib/store'
import { BlockCard } from '../components/RoadmapCanvas/BlockCard'
import styles from './RoadmapView.module.css'

export function RoadmapView() {
  const blocks = useRoadmapStore((s) => s.blocks)

  if (blocks.length === 0) {
    return (
      <div className={styles.loading}>
        <span>⏳ Carregando roadmap…</span>
      </div>
    )
  }

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <h1 className={styles.title}>Roadmap de Estudos</h1>
        <p className={styles.subtitle}>
          Acompanhe sua evolução pelos 8 blocos do currículo Fullstack Robusto.
          Clique no ícone de status ( · / ▶ / ✔ ) para avançar um ponto.
        </p>
      </header>

      <div className={styles.canvas}>
        {blocks.map((block) => (
          <BlockCard key={block.id} block={block} />
        ))}
      </div>
    </div>
  )
}
