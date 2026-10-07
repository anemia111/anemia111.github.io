import { lazy, Suspense, useState } from 'react'
import App from './App'
import type { ChampionshipId } from './motorsport/types'
const MotorsportApp = lazy(() => import('./motorsport/MotorsportApp').then(module => ({ default: module.MotorsportApp })))
export default function AppShell() {
  const [championship, setChampionship] = useState<ChampionshipId | null>(null)
  return championship === null ? <App onOpenMotorsport={setChampionship} />
    : <Suspense fallback={<p role="status">カテゴリーを読み込んでいます…</p>}><MotorsportApp initialChampionship={championship} onBack={() => setChampionship(null)} /></Suspense>
}
