import { TelemetryComparison } from '../components/TelemetryComparison'
import { courseStations } from './coursePhysics'
import { useEffect, useMemo, useRef, useState } from 'react'
import { lazy, Suspense } from 'react'
import { BroadcastDashboard } from '../components/BroadcastDashboard'
import { seriesPackages } from '../series/seriesRegistry'
import type { SeriesId } from '../series/types'
import type { CameraMode, SpeedMultiplier, WeekendStage } from '../types'
import { MotorsportPitWallPanel } from './MotorsportPitWallPanel'
import { MotorsportFreeModeBuilder } from './MotorsportFreeModeBuilder'
import { MOTORSPORT_FREE_SAVE_KEY, matchingQualifying, qualifyingResult } from './freeMode'
import type { MotorsportQualifyingResult } from './freeMode'
import { dashboardCourse, dashboardFrame } from './dashboardAdapter'
import '../App.css'
const RaceScene = lazy(() => import('../three/RaceScene').then(module => ({default: module.RaceScene})))
import { createMotorsportConfig, motorsportChampionships, motorsportCourses, motorsportEvents } from './packages'
import { advanceMotorsportRace, createMotorsportRace, motorsportStandings, requestMotorsportPit, setMotorsportFlag } from './race'
import { MOTORSPORT_SAVE_KEY, parseMotorsportSave, serializeMotorsportSave } from './persistence'
import type { ChampionshipId, MotorsportPitRequest, MotorsportRaceConfig, MotorsportRaceState } from './types'
import type { MotorsportWorkerCommand } from './worker'
import './motorsport.css'

function initialSession(championship: ChampionshipId) {
  try { const saved = localStorage.getItem(MOTORSPORT_SAVE_KEY); if (saved) { const parsed = parseMotorsportSave(saved); if (parsed && parsed.config.championship === championship) return parsed } } catch { /* Storage can be unavailable; keep a usable session. */ }
  const config = createMotorsportConfig(championship)
  return { config, state: createMotorsportRace(config) }
}
const clock = (seconds: number) => `${Math.floor(seconds / 3600).toString().padStart(2, '0')}:${Math.floor(seconds / 60 % 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
const lapTime = (seconds: number | null) => seconds === null ? '—' : `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(3).padStart(6, '0')}`
const safeUrl = (url: string) => /^https?:\/\//i.test(url) ? url : undefined

export function MotorsportApp({ onBack, initialChampionship = 'kyojo', initialFreeOpen = false }: { onBack: (seriesId?: SeriesId, free?: boolean) => void; initialChampionship?: ChampionshipId; initialFreeOpen?: boolean }) {
  const [initial] = useState(() => initialSession(initialChampionship))
  const [config, setConfig] = useState(initial.config)
  const [state, setState] = useState(initial.state)
  const [paused, setPaused] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [selectedId, setSelectedId] = useState(initial.config.entries[0].id)
  const [classFilter, setClassFilter] = useState('all')
  const [message, setMessage] = useState('')
  const [sourceOpen, setSourceOpen] = useState(false)
  const [panel, setPanel] = useState<'setup' | 'pit' | 'classification' | 'insights' | null>(null)
  const [freeOpen, setFreeOpen] = useState(initialFreeOpen)
  const [qualifying, setQualifying] = useState<MotorsportQualifyingResult | null>(null)
  const championshipSession = useRef(initial)
  const freeSession = useRef<{config: MotorsportRaceConfig; state: MotorsportRaceState} | null>(null)
  const raceFormat = useRef(initial.config.format)
  const applicationMode = config.applicationMode ?? 'championship'
  const stage: WeekendStage = config.sessionKind === 'practice' ? 'fp1' : config.sessionKind === 'qualifying' ? 'qualifying' : 'race'
  const [cameraMode, setCameraMode] = useState<CameraMode>('overview')
  const worker = useRef<Worker | null>(null)
  const latest = useRef({ config, state, paused, speed })
  latest.current = { config, state, paused, speed }
  if (!config.sessionKind || config.sessionKind === 'race') raceFormat.current = config.format
  const generation = useRef(0), busy = useRef(false)
  const debt = useRef(0)
  const standings = useMemo(() => motorsportStandings(state, config), [state, config])
  const selected = standings.find(row => row.entry.id === selectedId) ?? standings[0]
  const telemetryCorners = useMemo(() => {
    const stations = courseStations(config.course)
    const candidates = stations.map((station,index)=>({radius:station.radiusM,progress:index/stations.length,index}))
      .filter(point=>point.radius<250 && point.radius<=stations[(point.index+stations.length-1)%stations.length].radiusM && point.radius<stations[(point.index+1)%stations.length].radiusM)
      .sort((a,b)=>a.radius-b.radius)
    const chosen: typeof candidates = []
    for (const point of candidates) if(chosen.every(other=>Math.min(Math.abs(point.progress-other.progress),1-Math.abs(point.progress-other.progress))>=0.025)) chosen.push(point)
    return chosen.sort((a,b)=>a.progress-b.progress).map((point,index)=>({label:`C${index+1}`,progress:point.progress}))
  },[config.course])
  const events = useMemo(() => motorsportEvents(config.championship), [config.championship])
  const courses = useMemo(() => motorsportCourses(config.championship), [config.championship])
  const currentEvent = events.find(event => event.id === config.eventId)
  const currentClasses = [...new Set(config.entries.map(entry => entry.classId))]

  useEffect(() => {
    let runtime: Worker | null = null
    try {
      runtime = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
      runtime.onmessage = ({ data }: MessageEvent<{ type: string; generation: number; state?: MotorsportRaceState; message?: string }>) => {
        if (data.generation !== generation.current) return
        busy.current = false
        if (data.type === 'snapshot' && data.state) { latest.current.state = data.state; setState(data.state) }
        if (data.type === 'error') { setPaused(true); setMessage(data.message ?? '走行エンジンでエラーが発生しました。') }
      }
      runtime.onerror = event => { setPaused(true); setMessage(event.message || '走行用の処理を開始できませんでした。'); runtime?.terminate(); worker.current = null; busy.current = false }
      worker.current = runtime
      runtime.postMessage({ type: 'init', generation: generation.current, config: latest.current.config, state: latest.current.state } satisfies MotorsportWorkerCommand)
    } catch { worker.current = null }
    return () => { runtime?.terminate(); worker.current = null }
  }, [])
  useEffect(() => {
    let lastTime = performance.now()
    const timer = window.setInterval(() => {
      const now = performance.now(), elapsed = Math.min(0.2, Math.max(0, (now - lastTime) / 1000)); lastTime = now
      const current = latest.current
      if (current.paused || current.state.phase === 'finished') { debt.current = 0; return }
      debt.current = Math.min(6000, debt.current + elapsed * current.speed * 10)
      if (busy.current) return
      const ticks = Math.min(600, Math.floor(debt.current))
      if (ticks < 1) return
      debt.current -= ticks
      if (worker.current) { busy.current = true; worker.current.postMessage({ type: 'advance', generation: generation.current, ticks } satisfies MotorsportWorkerCommand) }
      else { const next = advanceMotorsportRace(current.state, ticks, current.config); latest.current.state = next; setState(next) }
    }, 50)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const timer = window.setInterval(() => {
      try { localStorage.setItem(latest.current.config.applicationMode === 'free' ? MOTORSPORT_FREE_SAVE_KEY : MOTORSPORT_SAVE_KEY, serializeMotorsportSave(latest.current.config, latest.current.state)) } catch { setMessage('ブラウザーへの自動保存ができません。JSON保存を利用してください。') }
    }, 3000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const result = qualifyingResult(config, state)
    if (result) setQualifying(result)
  }, [config, state])
  useEffect(() => {
    if (!panel) return
    const handler = (event: KeyboardEvent) => { if(event.key === 'Escape') setPanel(null) }
    document.addEventListener('keydown',handler)
    return () => document.removeEventListener('keydown',handler)
  }, [panel])
  const adoptSession = (session: { config: MotorsportRaceConfig; state: MotorsportRaceState }) => {
    generation.current++; busy.current = false; debt.current = 0
    latest.current = { ...latest.current, ...session, paused: true }
    worker.current?.postMessage({ type:'init',generation:generation.current,...session } satisfies MotorsportWorkerCommand)
    setConfig(session.config); setState(session.state); setPaused(true)
    setSelectedId(session.config.entries[0].id); setClassFilter('all'); setMessage(''); setPanel(null)
  }
  const rememberSession = () => {
    const session = { config:latest.current.config,state:latest.current.state }
    if (session.config.applicationMode === 'free') freeSession.current = session
    else championshipSession.current = session
    try { localStorage.setItem(session.config.applicationMode === 'free' ? MOTORSPORT_FREE_SAVE_KEY : MOTORSPORT_SAVE_KEY,serializeMotorsportSave(session.config,session.state)) } catch { /* Export remains available. */ }
  }
  const openFree = () => { setPaused(true); latest.current.paused = true; rememberSession(); setPanel(null); setFreeOpen(true) }
  const startFree = (next: MotorsportRaceConfig) => { rememberSession(); const freeConfig = { ...next,applicationMode:'free' as const }; const session = { config:freeConfig,state:createMotorsportRace(freeConfig) }; freeSession.current=session; adoptSession(session); latest.current.paused=false; latest.current.speed=1; setPaused(false); setSpeed(1); setFreeOpen(false) }
  const exitFree = () => { if (applicationMode === 'free') { rememberSession(); adoptSession(championshipSession.current) } }
  const changeStage = (next: WeekendStage) => {
    if (next === stage) return
    const sessionKind = next === 'fp1' ? 'practice' as const : next === 'qualifying' ? 'qualifying' as const : 'race' as const
    const format = sessionKind === 'race' ? raceFormat.current : { kind:'time' as const,seconds:1200,basis:'User SIM timed session; best-lap classification' }
    let entries = config.entries
    if (sessionKind === 'race' && matchingQualifying(config,qualifying)) {
      const positions = new Map(qualifying!.entryIds.map((id,index)=>[id,index]))
      if (entries.every(entry=>positions.has(entry.id))) entries=[...entries].sort((a,b)=>positions.get(a.id)!-positions.get(b.id)!)
    }
    reset({ ...config,sessionKind,format,entries })
  }
  const reset = (nextConfig: MotorsportRaceConfig) => {
    const nextState = createMotorsportRace(nextConfig)
    generation.current++; busy.current = false; debt.current = 0
    worker.current?.postMessage({ type: 'init', generation: generation.current, config: nextConfig, state: nextState } satisfies MotorsportWorkerCommand)
    latest.current = { ...latest.current, config: nextConfig, state: nextState, paused: true }
    setPaused(true); setConfig(nextConfig); setState(nextState); setClassFilter('all')
    setSelectedId(nextConfig.entries[0].id); setMessage('')
  }
  const changeEvent = (championship: ChampionshipId, id?: string) => {
    try { rememberSession(); reset(createMotorsportConfig(championship, id)); setQualifying(null) } catch (error) { setMessage(error instanceof Error ? error.message : String(error)) }
  }
  const flag = (value: MotorsportRaceState['flag']) => {
    if (worker.current) worker.current.postMessage({ type: 'flag', generation: generation.current, flag: value } satisfies MotorsportWorkerCommand)
    else setState(current => setMotorsportFlag(current, value))
  }
  const pit = (request: MotorsportPitRequest) => {
    if (worker.current) worker.current.postMessage({ type: 'pit', generation: generation.current, request } satisfies MotorsportWorkerCommand)
    else { try { setState(current => requestMotorsportPit(current, request, config)) } catch (error) { setMessage(String(error)) } }
  }
  const exportSave = () => {
    const url = URL.createObjectURL(new Blob([serializeMotorsportSave(config, state)], { type: 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = `${config.championship}-${config.eventId.replaceAll(':', '-')}-race.json`; link.click(); URL.revokeObjectURL(url)
  }
  const track = useMemo(() => dashboardCourse(config), [config])
  const {snapshot, timingRows, sceneConfig} = useMemo(() => dashboardFrame(config, state, track), [config, state, track])
  const selectedCar = snapshot.cars.find(car => car.driverId === selected.entry.id) ?? snapshot.cars[0]
  const label = { kyojo: 'KYOJO CUP', 'super-gt': 'SUPER GT', wec: 'FIA WEC', indycar: 'INDYCAR' }[config.championship]
  const focusDriver = (id: string) => { setSelectedId(id) }
  const tyreUsage = <div className="tyre-usage-content"><div className="tyre-usage-legend">{['primary','alternate','wet'].map(compound => <div key={compound}><span>{compound.toUpperCase()}</span><strong>{state.cars.filter(car => car.tyreSets.at(-1)?.compound === compound).length}</strong><small>SIM</small></div>)}</div></div>
  return <div className="race-shell" data-testid="motorsport-app">
    <BroadcastDashboard
      applicationMode={applicationMode} cameraMode={cameraMode} dataControl={<p>SIM · {config.format.basis}</p>}
      dataDetails={[{label:'Selected car',value:`#${selected.entry.number} ${selected.entry.team}`,source:'SIM'}, {label:'Class',value:`${selected.entry.classId.toUpperCase()} P${selected.classPosition}`,source:'SIM'}, {label:'Fuel',value:`${selected.car.fuelKg.toFixed(1)} kg`,source:'SIM'}]}
      dataMode="SIM" dataModeAvailability={{SIM:true,HIST:false,LIVE:false}} engineLabel="SIM"
      environment={{airLabel:'—',trackLabel:'—',humidityLabel:'—',pressureLabel:'—',windLabel:'—',rainLabel:config.weather,source:'SIM'}}
      eventName={config.course.name} isPaused={paused} onCameraModeChange={setCameraMode} onDataModeChange={() => {}}
      onFocusDriver={focusDriver}
      onExitFreeMode={exitFree} onOpenFreeMode={openFree}
      onOpenClassification={() => setPanel('classification')} onOpenInsights={() => setPanel('insights')} onOpenPitWall={() => setPanel('pit')} onOpenSetup={() => applicationMode === 'free' ? openFree() : setPanel('setup')}
      onPauseChange={() => {if(state.phase !== 'finished') setPaused(value => !value)}}
      onSeriesChange={id => { rememberSession(); onBack(id) }} onOpenMotorsport={changeEvent}
      onSkipFormationLap={() => { if(worker.current) worker.current.postMessage({type:'skip-formation',generation:generation.current} satisfies MotorsportWorkerCommand); else setState(current=>current.phase === 'formation' ? {...current,phase:'racing'} : current) }} onSpeedChange={setSpeed} onStageChange={changeStage}
      raceControlLog={[...state.events].reverse().slice(0,50).map((event,index) => ({id:`${event.tick}:${index}`,message:event.message,source:'SIM',timeLabel:clock(event.seconds)}))}
      raceLabel="Race" selectedCar={selectedCar} sessionPhaseLabel={state.phase === 'formation' ? 'FORMATION' : state.phase === 'finished' ? 'FINISHED' : state.flag.toUpperCase()}
      sessionProgressLabel={state.phase === 'formation' ? `${clock(state.formationSeconds)} / ${clock(config.course.lengthM / (80 / 3.6))}` : config.format.kind === 'laps' ? `LAP ${Math.min(snapshot.leaderLap,config.format.laps)} / ${config.format.laps}` : `${clock(state.raceSeconds)} / ${clock(config.format.seconds)}`}
      snapshot={snapshot} speed={speed as SpeedMultiplier} stage={stage} seriesId="f1-custom" seriesLabel={label}
      seriesOptions={seriesPackages.map(item => ({id:item.id,label:item.label}))}
      tireLabels={{S:'Not available',M:'Not available',H:'Not available',I:'Not available',W:'Not available'}} timingRows={timingRows} track={track}
      categoryPresentation={{seriesValue:`motorsport:${config.championship}`,systemsLabel:'SIM',tyreUsage,tyreLegend:<span>{config.weather.toUpperCase()} · SIM TYRES</span>,speeds:[1,5,20,60,600],telemetryCorners}}
      trackScene={<Suspense fallback={<div className="scene-loading">Loading circuit map...</div>}><RaceScene cameraMode={cameraMode} config={sceneConfig} onSelectDriver={focusDriver} openF1Overlay={null} openF1OverlayMode="SIM" selectedDriverId={selected.entry.id} snapshot={snapshot}/></Suspense>}
      weekendStages={['fp1','qualifying','race']}
    />
    {freeOpen && <MotorsportFreeModeBuilder initialConfig={(() => { if(applicationMode === 'free') return config; if(freeSession.current) return freeSession.current.config; try { const raw=localStorage.getItem(MOTORSPORT_FREE_SAVE_KEY); const saved=raw&&parseMotorsportSave(raw); if(saved && (!initialFreeOpen || saved.config.championship === initialChampionship)) return saved.config } catch { /* Fresh configuration. */ } return config })()} qualifying={qualifying} onBaseCategory={id=>{rememberSession();onBack(id,true)}} onClose={() => setFreeOpen(false)} onStart={startFree}/>}
    {panel === 'pit' && <MotorsportPitWallPanel config={config} state={state} selectedId={selectedId} onSelect={focusDriver} onClose={() => setPanel(null)} onPit={pit} onPace={(entryId,mode)=>{if(worker.current)worker.current.postMessage({type:'pace',generation:generation.current,entryId,mode} satisfies MotorsportWorkerCommand);else setState(current=>({...current,cars:current.cars.map(car=>car.entryId===entryId?{...car,paceMode:mode}:car)}))}}/>}
    {message && <p role="status" className="motorsport-message">{message}</p>}
    {panel && panel !== 'pit' && <section className={`hud setup-panel motorsport-overlay${panel === 'insights' ? ' insights-panel' : ''}`} role="dialog" aria-label={panel === 'setup' ? 'race setup' : panel === 'insights' ? 'driver analysis' : 'classification'}>
      <div className="setup-header"><h2>{panel === 'setup' ? 'Race setup' : panel === 'insights' ? 'Driver analysis' : 'Classification'}</h2><button className="plain-icon-button" aria-label="Close panel" onClick={() => setPanel(null)}>×</button></div>
      {panel === 'insights' && <label>Selected car<select aria-label="Selected engineering car" value={selected.entry.id} onChange={event=>focusDriver(event.target.value)}>{standings.map(row=><option key={row.entry.id} value={row.entry.id}>#{row.entry.number} {row.entry.drivers[row.car.driverIndex].name} · {row.entry.classId.toUpperCase()}</option>)}</select></label>}
      {panel === 'insights' && <><TelemetryComparison selectedId={selected.entry.id} lengthM={config.course.lengthM} traces={standings.map(row=>({id:row.entry.id,name:`#${row.entry.number} ${row.entry.drivers[row.car.driverIndex].name}`,color:row.entry.color,samples:row.car.telemetryHistory ?? []}))} corners={telemetryCorners}/><h3>#{selected.entry.number} {selected.entry.drivers[selected.car.driverIndex].name}</h3><p>{selected.entry.team} · {selected.entry.machine.name}</p><dl><dt>Class position</dt><dd>{selected.entry.classId.toUpperCase()} P{selected.classPosition}</dd><dt>Last / best lap</dt><dd>{lapTime(selected.car.lastLapSeconds)} / {lapTime(selected.car.bestLapSeconds)}</dd><dt>Speed / gear</dt><dd>{Math.round(selected.car.speedMps*3.6)} km/h / {selected.car.gear}</dd><dt>Fuel / tyre life</dt><dd>{selected.car.fuelKg.toFixed(1)} kg / {Math.round(selected.car.tyreLife*100)}%</dd></dl><h3>Lap log · SIM measured crossings</h3><table><thead><tr><th>Lap</th><th>Time</th><th>Driver</th><th>Tyres</th><th>Lap</th></tr></thead><tbody>{[...(selected.car.lapHistory ?? [])].reverse().map(lap=><tr key={lap.lap}><td>{lap.lap}</td><td>{lapTime(lap.seconds)}</td><td>{selected.entry.drivers[lap.driverIndex]?.name}</td><td>{lap.compound}</td><td>{lap.pit?'OUT / PIT':'TIMED'}</td></tr>)}</tbody></table><h3>Race control</h3>{state.events.filter(event=>event.entryId===null||event.entryId===selected.entry.id).slice(-20).reverse().map((event,index)=><p key={index}>{clock(event.seconds)} · {event.message}</p>)}</>}
      {panel === 'setup' && <>    <header className="motorsport-header">


      <label>カテゴリー<select aria-label="Motorsport championship" value={config.championship} onChange={event => changeEvent(event.target.value as ChampionshipId)}>{motorsportChampionships.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label>大会<select aria-label="Motorsport event" value={config.eventId} onChange={event => changeEvent(config.championship, event.target.value)}>{events.map(event => <option key={event.id} value={event.id} disabled={!courses.some(course => course.id === event.courseId)}>{event.label} · {event.dateLabel}{courses.some(course => course.id === event.courseId) ? '' : ' · 形状確認中'}</option>)}</select></label>
      <button onClick={() => setSourceOpen(open => !open)} aria-expanded={sourceOpen}>出典・推定条件</button>
    </header>
    <section className="motorsport-controls" aria-label="Race controls">
      <button onClick={() => setPaused(value => !value)} disabled={state.phase === 'finished'}>{paused ? '走行開始' : '一時停止'}</button>
      <select aria-label="Motorsport simulation speed" value={speed} onChange={event => setSpeed(Number(event.target.value))}>{[1, 5, 10, 20, 60, 600].map(value => <option key={value} value={value}>{value}x</option>)}</select>
      <button onClick={() => reset({ ...config })}>リセット</button>
      <label>Seed<input aria-label="Motorsport seed" maxLength={128} value={config.seed} disabled={!paused} onChange={event=>reset({...config,seed:event.target.value})}/></label>
      <label>スタート<select aria-label="Motorsport race start" value={config.start} disabled={!paused} onChange={event=>reset({...config,start:event.target.value as 'standing'|'rolling'})}><option value="standing">Standing</option><option value="rolling">Rolling</option></select></label>
      <label>距離<select aria-label="Motorsport distance kind" value={config.format.kind} disabled={!paused || (config.sessionKind !== undefined && config.sessionKind !== 'race')} onChange={event => reset({ ...config, format: event.target.value === 'laps' ? { kind: 'laps', laps: 10, basis: 'User SIM distance' } : { kind: 'time', seconds: 21600, basis: 'User SIM duration' } })}><option value="laps">周回数</option><option value="time">時間</option></select></label>
      <input aria-label="Motorsport race distance" type="number" min="1" max={config.format.kind === 'laps' ? 1000 : 24} step={config.format.kind === 'laps' ? 1 : 0.5} disabled={!paused} value={config.format.kind === 'laps' ? config.format.laps : config.format.seconds / 3600} onChange={event => { const value = Number(event.target.value); if (value > 0 && value <= (config.format.kind === 'laps' ? 1000 : 24)) reset({ ...config, format: config.format.kind === 'laps' ? { kind: 'laps', laps: Math.round(value), basis: 'User SIM distance' } : { kind: 'time', seconds: value * 3600, basis: 'User SIM duration' } }) }} />
      <label>天候<select aria-label="Motorsport weather" value={config.weather} disabled={!paused} onChange={event => reset({ ...config, weather: event.target.value as 'dry' | 'wet' })}><option value="dry">ドライ</option><option value="wet">ウェット</option></select></label>
      <select aria-label="Motorsport race director flag" value={state.flag} onChange={event => flag(event.target.value as MotorsportRaceState['flag'])}>{['green', 'yellow', 'fcy', 'sc', 'red'].map(value => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select>
      <button onClick={exportSave}>JSON保存</button>
      <label className="motorsport-import">保存を読込<input aria-label="Import motorsport race" type="file" accept=".json" onChange={async event => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 4_000_000) { setMessage('保存ファイルが大きすぎます。'); event.target.value = ''; return } const save = parseMotorsportSave(await file.text()); if (!save) { setMessage('保存データの形式・整合性を確認できません。'); return } generation.current++; busy.current = false; debt.current = 0; worker.current?.postMessage({ type: 'init', generation: generation.current, config: save.config, state: save.state } satisfies MotorsportWorkerCommand); latest.current = { ...latest.current, ...save, paused: true }; setPaused(true); setConfig(save.config); setState(save.state); setSelectedId(save.config.entries[0].id); setClassFilter('all'); setMessage(''); event.target.value = '' }} /></label>
      <strong className={`motorsport-phase flag-${state.flag}`}>{state.phase === 'formation' ? `FORMATION ${clock(state.formationSeconds)}` : state.phase === 'finished' ? 'FINISHED' : state.leaderFinished ? 'CHEQUERED' : state.flag.toUpperCase()} · {clock(state.raceSeconds)}</strong>
    </section>
    {sourceOpen && <section className="motorsport-sources">
      <h2>確認できる条件</h2><p>開催・エントリー・公表諸元と、走行に使う推定値を区別しています。BoP、タイヤ・空力特性、燃料消費、コース運用位置には未校正の値があります。実測レースの再現性は検証中です。</p>
      <p>大会：<a href={safeUrl(currentEvent?.sourceUrl ?? '')} target="_blank" rel="noreferrer">公式資料</a> · 距離設定：{config.format.basis} · コース：<a href={safeUrl(config.course.sourceUrl)} target="_blank" rel="noreferrer">{config.course.geometryBasis}</a></p>
      <p>ピット入口・出口・通路長、制限速度、幅員は現在SIM設定です。年間名簿と当該大会の確定エントリーは同一とは限りません。WECモンツァ、KYOJO第2戦以降、SUPER GTは年間登録を参照しています。INDYCARのP2P・ハイブリッド展開枠、タイヤ特性はSIM初期値を含みます。</p>
      <table><thead><tr><th>選択車両</th><th>値</th><th>根拠</th></tr></thead><tbody>{Object.entries(selected.entry.machine).filter(([, value]) => typeof value === 'object' && value !== null && 'basis' in value).map(([key, value]) => { const item = value as { value: number; basis: string; source: string }; return <tr key={key}><td>{key}</td><td>{item.value.toFixed(3)}</td><td>{item.basis} · {item.source}</td></tr> })}</tbody></table>
    </section>}
</>}
      {panel === 'classification' && <>      <section className="motorsport-timing"><header><h1>{motorsportChampionships.find(item => item.id === config.championship)!.label}</h1><span>{config.entries.length} CARS · {config.course.name} · {(config.course.lengthM / 1000).toFixed(3)} km</span></header>
        <select aria-label="Motorsport class filter" value={classFilter} onChange={event => setClassFilter(event.target.value)}><option value="all">総合順位</option>{currentClasses.map(value => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select>
        <div className="motorsport-table-scroll"><table aria-label="Motorsport timing"><thead><tr><th>総合</th><th>クラス</th><th># / チーム / ドライバー</th><th>周</th><th>ベスト</th><th>速度</th><th>燃料</th><th>タイヤ</th><th>状態</th></tr></thead><tbody>{standings.filter(row => classFilter === 'all' || row.entry.classId === classFilter).map(({ car, entry, overallPosition, classPosition }) => <tr key={entry.id} className={selectedId === entry.id ? 'selected' : ''} onClick={() => { setSelectedId(entry.id) }}><td>{overallPosition}</td><td>{entry.classId.toUpperCase()} {classPosition}</td><td><button style={{ borderLeftColor: entry.color }} aria-label={`Select car ${entry.id}`} onClick={() => { setSelectedId(entry.id) }}><strong>#{entry.number} {entry.team}</strong><span>{entry.drivers[car.driverIndex].name}</span></button></td><td>{car.laps}</td><td>{lapTime(car.bestLapSeconds)}</td><td>{Math.round(car.speedMps * 3.6)}</td><td>{car.fuelKg.toFixed(1)} kg</td><td>{Math.round(car.tyreLife * 100)}%</td><td>{car.blueFlag ? 'BLUE · ' : ''}{car.status}{car.pitRequest ? ' · PIT REQUEST' : ''}</td></tr>)}</tbody></table></div>
      </section>
</>}

    </section>}
  </div>
}
