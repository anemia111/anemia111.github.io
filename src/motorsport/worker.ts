/// <reference lib="webworker" />
import { advanceMotorsportRace, requestMotorsportPit, setMotorsportFlag } from './race'
import type { MotorsportPitRequest, MotorsportRaceConfig, MotorsportRaceState } from './types'

export type MotorsportWorkerCommand =
  | { type: 'init'; generation: number; config: MotorsportRaceConfig; state: MotorsportRaceState }
  | { type: 'advance'; generation: number; ticks: number }
  | { type: 'flag'; generation: number; flag: MotorsportRaceState['flag'] }
  | { type: 'pit'; generation: number; request: MotorsportPitRequest }
let config: MotorsportRaceConfig | null = null
let state: MotorsportRaceState | null = null
let generation = 0
self.onmessage = ({ data }: MessageEvent<MotorsportWorkerCommand>) => {
  try {
    if (data.type === 'init') { generation = data.generation; config = data.config; state = data.state }
    else if (!state || !config || data.generation !== generation) return
    else if (data.type === 'advance') state = advanceMotorsportRace(state, Math.min(600, data.ticks), config)
    else if (data.type === 'flag') state = setMotorsportFlag(state, data.flag)
    else if (data.type === 'pit') state = requestMotorsportPit(state, data.request, config)
    self.postMessage({ type: 'snapshot', generation, state })
  } catch (error) { self.postMessage({ type: 'error', generation, message: error instanceof Error ? error.message : String(error) }) }
}
