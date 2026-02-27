// src/renderer/components/AppLayout/AppLayout.tsx
import React from 'react'
import { Sidebar }   from '../Sidebar/Sidebar'
import { StatusBar } from '../StatusBar/StatusBar'
import styles from './AppLayout.module.css'

interface Props {
  children: React.ReactNode
}

export function AppLayout({ children }: Props) {
  return (
    <div className={styles.root}>
      <Sidebar />
      <main className={styles.workspace}>{children}</main>
      <StatusBar />
    </div>
  )
}
