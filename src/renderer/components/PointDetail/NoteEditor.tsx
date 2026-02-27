// src/renderer/components/PointDetail/NoteEditor.tsx
// Editor Markdown com CodeMirror 6 + auto-save por debounce.
import { useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { markdown }               from '@codemirror/lang-markdown'
import { api }                    from '../../lib/api'
import { useDebounce }            from '../../hooks/useDebounce'
import styles from './NoteEditor.module.css'

interface Props {
  pointId:        number
  initialContent: string
  onSaved?:       () => void
}

export function NoteEditor({ pointId, initialContent, onSaved }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef      = useRef<EditorView | null>(null)

  const [content, setContent] = useState(initialContent)
  const [saved,   setSaved]   = useState(true)

  const debouncedContent = useDebounce(content, 1400)

  // ─── Inicializa / recria o editor quando o ponto muda ──────────
  useEffect(() => {
    if (!containerRef.current) return

    // Destrói instância anterior ao trocar de ponto
    viewRef.current?.destroy()

    const view = new EditorView({
      doc: initialContent,
      extensions: [
        basicSetup,
        markdown(),
        EditorView.theme({
          '&': {
            minHeight:   '180px',
            maxHeight:   '420px',
            fontFamily:  'var(--font-mono)',
            fontSize:    '13px',
            background:  'var(--color-bg-app)',
            color:       'var(--color-text-primary)',
            borderRadius: 'var(--radius-md)',
          },
          '.cm-content':   { padding: '12px 14px' },
          '.cm-gutters':   { background: 'var(--color-bg-panel)', border: 'none' },
          '.cm-activeLineGutter, .cm-activeLine': { background: 'rgba(88,166,255,0.04)' },
          '.cm-cursor':    { borderLeftColor: 'var(--color-accent)' },
          '.cm-selectionBackground': { background: 'rgba(88,166,255,0.18) !important' },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setContent(update.state.doc.toString())
            setSaved(false)
          }
        }),
        EditorView.lineWrapping,
      ],
      parent: containerRef.current,
    })

    viewRef.current = view
    return () => view.destroy()
  }, [pointId]) // recria para cada ponto diferente
  // (initialContent não é dep — evita reset ao auto-salvar)

  // ─── Auto-save com debounce ────────────────────────────────────
  useEffect(() => {
    if (saved) return
    api.notes.save(pointId, debouncedContent).then(() => {
      setSaved(true)
      onSaved?.()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent])

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.editor} />
      <div className={`${styles.status} ${saved ? styles.statusSaved : styles.statusPending}`}>
        {saved ? '✓ Salvo' : '⏳ salvando…'}
      </div>
    </div>
  )
}
