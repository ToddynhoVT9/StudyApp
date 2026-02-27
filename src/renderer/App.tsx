// src/renderer/App.tsx — router raiz com carregamento inicial do store
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { AppLayout }       from './components/AppLayout/AppLayout'
import { RoadmapView }     from './views/RoadmapView'
import { PointDetailView } from './views/PointDetailView'
import { BlockView }       from './views/BlockView'
import { NotesView }       from './views/NotesView'
import { SettingsView }    from './views/SettingsView'
import { useRoadmapStore } from './lib/store'

export function App() {
  const loadAll = useRoadmapStore((s) => s.loadAll)

  useEffect(() => {
    loadAll()
  }, [loadAll])

  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/"          element={<RoadmapView />}     />
          <Route path="/block/:blockId" element={<BlockView />}  />
          <Route path="/point/:id" element={<PointDetailView />} />
          <Route path="/notes"     element={<NotesView />}       />
          <Route path="/settings"  element={<SettingsView />}    />
        </Routes>
      </AppLayout>
    </HashRouter>
  )
}
