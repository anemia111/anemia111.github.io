import { lazy, Suspense, useState } from 'react'
import App from './App'
import type { SeriesId } from './series/types'
import type { ChampionshipId } from './motorsport/types'
const MotorsportApp = lazy(() => import('./motorsport/MotorsportApp').then(module => ({ default: module.MotorsportApp })))
export default function AppShell() {
  const [championship, setChampionship] = useState<ChampionshipId | null>(null)
  const [returnSeries, setReturnSeries] = useState<SeriesId | undefined>(undefined)
  return championship === null ? <App onOpenMotorsport={setChampionship} requestedSeriesId={returnSeries} />
    : <Suspense fallback={<p role="status">カテゴリーを読み込んでいます…</p>}><MotorsportApp initialChampionship={championship} onBack={id => {setReturnSeries(id);setChampionship(null)}} /></Suspense>
}
