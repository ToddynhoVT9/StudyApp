// src/renderer/views/SettingsView.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRoadmapStore } from '../lib/store'
import styles from './SettingsView.module.css'

export function SettingsView() {
  const navigate  = useNavigate()
  const loadAll   = useRoadmapStore((s) => s.loadAll)
  const [dbPath, setDbPath] = useState<string>('')
  const [fontSize, setFontSize] = useState<string>('md')

  useEffect(() => {
    window.electronAPI
      .invoke('settings:dbPath')
      .then((p) => setDbPath(p as string))
      .catch(() => setDbPath('Não disponível'))

    window.electronAPI
      .invoke('settings:getStore')
      .then((s: any) => {
        if (s?.editorFontSize) setFontSize(s.editorFontSize)
      })
      .catch(console.error)
  }, [])

  const handleReset = async () => {
    const ok = window.confirm(
      'Isso vai resetar TODO o progresso (status dos pontos para Pendente).\n\nAs notas, atividades e materiais serão mantidos.\n\nContinuar?',
    )
    if (!ok) return
    await window.electronAPI.invoke('settings:resetProgress')
    // Recarrega o store para sincronizar a UI
    await loadAll()
    navigate('/')
  }

  return (
    <motion.div
      className={styles.view}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <header className={styles.header}>
        <h1 className={styles.title}>⚙️ Configurações</h1>
        <p className={styles.subtitle}>Personalize e gerencie seu StudyApp.</p>
      </header>

      <div className={styles.body}>
        {/* ── Aparência ─────────────────────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Aparência</h2>

          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <span>Tamanho da fonte do editor</span>
              <small>Afeta o editor de notas (CodeMirror)</small>
            </div>
            <select
              className={styles.select}
              value={fontSize}
              onChange={(e) => {
                const val = e.target.value
                setFontSize(val)
                window.electronAPI.invoke('settings:setStore', 'editorFontSize', val)
                
                // Map logical sizes to actual pixel sizes
                const sizeMap: Record<string, string> = { sm: '12', md: '13', lg: '15' }
                document.documentElement.style.setProperty(
                  '--editor-font-size',
                  `${sizeMap[val] || '13'}px`,
                )
              }}
            >
              <option value="sm">Pequena (12px)</option>
              <option value="md">Média (13px) — padrão</option>
              <option value="lg">Grande (15px)</option>
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <span>Versão do app</span>
            </div>
            <code className={styles.code}>StudyApp v0.1.0</code>
          </div>
        </section>

        {/* ── Dados ─────────────────────────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Dados &amp; Persistência</h2>

          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <span>Localização do banco SQLite</span>
              <small>Arquivo local — não requer internet</small>
            </div>
            <code className={styles.code} title={dbPath}>
              {dbPath
                ? dbPath.replace(/\\/g, '/').split('/').slice(-3).join('/')
                : '…'}
            </code>
          </div>

          <div className={`${styles.row} ${styles.rowDanger}`}>
            <div className={styles.rowLabel}>
              <span>Resetar progresso do roadmap</span>
              <small>
                Volta todos os pontos para "Pendente". Notas, atividades e
                materiais são preservados.
              </small>
            </div>
            <button className={styles.dangerBtn} onClick={handleReset}>
              🔄 Resetar progresso
            </button>
          </div>
        </section>

        {/* ── Sobre ─────────────────────────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sobre</h2>
          <div className={styles.aboutCard}>
            <p>
              <strong>StudyApp</strong> é um app desktop off-line para
              acompanhar seu progresso no currículo{' '}
              <em>Fullstack Robusto (JS/TS)</em>.
            </p>
            <p>
              Stack: Electron · Vite · React · TypeScript · SQLite
              (better-sqlite3) · Zustand · Framer Motion · CodeMirror 6
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
