/// <reference types="vite/client" />

// ─── CSS Modules ─────────────────────────────────────────────────
// Declara o tipo genérico para que o TypeScript não reclame de
// `import styles from './Foo.module.css'`
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

// ─── Imagens e assets ─────────────────────────────────────────────
declare module '*.svg' { const src: string; export default src }
declare module '*.png' { const src: string; export default src }
declare module '*.ico' { const src: string; export default src }
