import styles from './App.module.css'

// ─── App placeholder (Fase 0) ────────────────────────────────────
// Nas próximas fases este arquivo será substituído pelo
// HashRouter + AppLayout + Routes completos.
export function App() {
  return (
    <div className={styles.splash}>
      <div className={styles.card}>
        <div className={styles.logo}>🗺️</div>
        <h1 className={styles.title}>StudyApp</h1>
        <p className={styles.subtitle}>Fase 0 — Setup concluído</p>
        <p className={styles.hint}>
          React + Electron + TypeScript estão funcionando.
        </p>
        <div className={styles.badges}>
          <span className={styles.badge}>React 18</span>
          <span className={styles.badge}>Electron</span>
          <span className={styles.badge}>TypeScript</span>
          <span className={styles.badge}>Vite</span>
        </div>
      </div>
    </div>
  )
}
