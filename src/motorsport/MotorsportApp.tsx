import { useEffect, useMemo, useRef, useState } from 'react'
import { lazy, Suspense } from 'react'
import { BroadcastDashboard } from '../components/BroadcastDashboard'
import { seriesPackages } from '../series/seriesRegistry'
import type { SeriesId } from '../series/types'
import type { CameraMode, SpeedMultiplier } from '../types'
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

export function MotorsportApp({ onBack, initialChampionship = 'kyojo' }: { onBack: (seriesId?: SeriesId) => void; initialChampionship?: ChampionshipId }) {
  const [initial] = useState(() => initialSession(initialChampionship))
  const [config, setConfig] = useState(initial.config)
  const [state, setState] = useState(initial.state)
  const [paused, setPaused] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [selectedId, setSelectedId] = useState(initial.config.entries[0].id)
  const [classFilter, setClassFilter] = useState('all')
  const [message, setMessage] = useState('')
  const [sourceOpen, setSourceOpen] = useState(false)
  const [panel, setPanel] = useState<'setup' | 'pit' | 'classification' | null>(null)
  const [cameraMode, setCameraMode] = useState<CameraMode>('overview')
  const [nextDriver, setNextDriver] = useState<number | null>(null)
  const [changeTyres, setChangeTyres] = useState(true)
  const [refuelFraction, setRefuelFraction] = useState(1)
  const worker = useRef<Worker | null>(null)
  const latest = useRef({ config, state, paused, speed })
  latest.current = { config, state, paused, speed }
  const generation = useRef(0), busy = useRef(false)
  const debt = useRef(0)
  const standings = useMemo(() => motorsportStandings(state, config), [state, config])
  const selected = standings.find(row => row.entry.id === selectedId) ?? standings[0]
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
      try { localStorage.setItem(MOTORSPORT_SAVE_KEY, serializeMotorsportSave(latest.current.config, latest.current.state)) } catch { setMessage('ブラウザーへの自動保存ができません。JSON保存を利用してください。') }
    }, 3000)
    return () => window.clearInterval(timer)
  }, [])
  const reset = (nextConfig: MotorsportRaceConfig) => {
    const nextState = createMotorsportRace(nextConfig)
    generation.current++; busy.current = false; debt.current = 0
    worker.current?.postMessage({ type: 'init', generation: generation.current, config: nextConfig, state: nextState } satisfies MotorsportWorkerCommand)
    latest.current = { ...latest.current, config: nextConfig, state: nextState, paused: true }
    setPaused(true); setConfig(nextConfig); setState(nextState); setClassFilter('all')
    setSelectedId(nextConfig.entries[0].id); setNextDriver(null); setMessage('')
  }
  const changeEvent = (championship: ChampionshipId, id?: string) => {
    try { reset(createMotorsportConfig(championship, id)) } catch (error) { setMessage(error instanceof Error ? error.message : String(error)) }
  }
  const flag = (value: MotorsportRaceState['flag']) => {
    if (worker.current) worker.current.postMessage({ type: 'flag', generation: generation.current, flag: value } satisfies MotorsportWorkerCommand)
    else setState(current => setMotorsportFlag(current, value))
  }
  const pit = () => {
    const request: MotorsportPitRequest = { entryId: selected.entry.id, fuelFraction: config.championship === 'kyojo' ? 0 : refuelFraction, changeTyres, nextDriverIndex: config.championship === 'kyojo' ? null : nextDriver }
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
  const label = motorsportChampionships.find(item => item.id === config.championship)!.label
  const tyreUsage = <div className="tyre-usage-content"><div className="tyre-usage-legend">{['primary','alternate','wet'].map(compound => <div key={compound}><span>{compound.toUpperCase()}</span><strong>{state.cars.filter(car => car.tyreSets.at(-1)?.compound === compound).length}</strong><small>SIM</small></div>)}</div></div>
  return <div className="race-shell" data-testid="motorsport-app">
    <BroadcastDashboard
      applicationMode="championship" cameraMode={cameraMode} dataControl={<p>SIM · {config.format.basis}</p>}
      dataDetails={[{label:'Selected car',value:`#${selected.entry.number} ${selected.entry.team}`,source:'SIM'}, {label:'Class',value:`${selected.entry.classId.toUpperCase()} P${selected.classPosition}`,source:'SIM'}, {label:'Fuel',value:`${selected.car.fuelKg.toFixed(1)} kg`,source:'SIM'}]}
      dataMode="SIM" dataModeAvailability={{SIM:true,HIST:false,LIVE:false}} engineLabel="SIM"
      environment={{airLabel:'—',trackLabel:'—',humidityLabel:'—',pressureLabel:'—',windLabel:'—',rainLabel:config.weather,source:'SIM'}}
      eventName={config.course.name} isPaused={paused} onCameraModeChange={setCameraMode} onDataModeChange={() => {}}
      onFocusDriver={id => {setSelectedId(id);setNextDriver(null)}}
      onExitFreeMode={() => setPanel('setup')} onOpenFreeMode={() => setPanel('setup')}
      onOpenClassification={() => setPanel('classification')} onOpenInsights={() => setPanel('pit')} onOpenPitWall={() => setPanel('pit')} onOpenSetup={() => setPanel('setup')}
      onPauseChange={() => {if(state.phase !== 'finished') setPaused(value => !value)}}
      onSeriesChange={onBack} onOpenMotorsport={changeEvent}
      onSkipFormationLap={() => {}} onSpeedChange={setSpeed} onStageChange={() => {}}
      raceControlLog={[...state.events].reverse().slice(0,50).map((event,index) => ({id:`${event.tick}:${index}`,message:event.message,source:'SIM',timeLabel:clock(event.seconds)}))}
      raceLabel="Race" selectedCar={selectedCar} sessionPhaseLabel={state.phase === 'formation' ? 'FORMATION' : state.phase === 'finished' ? 'FINISHED' : state.flag.toUpperCase()}
      sessionProgressLabel={config.format.kind === 'laps' ? `LAP ${Math.min(snapshot.leaderLap,config.format.laps)} / ${config.format.laps}` : `${clock(state.raceSeconds)} / ${clock(config.format.seconds)}`}
      snapshot={snapshot} speed={speed as SpeedMultiplier} stage="race" seriesId="f1-custom" seriesLabel={label}
      seriesOptions={seriesPackages.map(item => ({id:item.id,label:item.label}))}
      tireLabels={{S:'Not available',M:'Not available',H:'Not available',I:'Not available',W:'Not available'}} timingRows={timingRows} track={track}
      categoryPresentation={{seriesValue:`motorsport:${config.championship}`,systemsLabel:'SIM',tyreUsage,tyreLegend:<span>{config.weather.toUpperCase()} · SIM TYRES</span>,speeds:[1,5,20,60,600]}}
      trackScene={<Suspense fallback={<div className="scene-loading">Loading circuit map...</div>}><RaceScene cameraMode={cameraMode} config={sceneConfig} onSelectDriver={setSelectedId} openF1Overlay={null} openF1OverlayMode="SIM" selectedDriverId={selected.entry.id} snapshot={snapshot}/></Suspense>}
      weekendStages={['race']}
    />
    {message && <p role="status" className="motorsport-message">{message}</p>}
    {panel && <section className="hud setup-panel motorsport-overlay" role="dialog" aria-label={panel === 'setup' ? 'race setup' : panel === 'pit' ? 'pit wall' : 'classification'}>
      <div className="setup-header"><h2>{panel === 'setup' ? 'Race setup' : panel === 'pit' ? 'Pit wall' : 'Classification'}</h2><button className="plain-icon-button" aria-label="Close panel" onClick={() => setPanel(null)}>×</button></div>
      {panel === 'setup' && <>    <header className="motorsport-header">


      <label>カテゴリー<select aria-label="Motorsport championship" value={config.championship} onChange={event => changeEvent(event.target.value as ChampionshipId)}>{motorsportChampionships.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label>大会<select aria-label="Motorsport event" value={config.eventId} onChange={event => changeEvent(config.championship, event.target.value)}>{events.map(event => <option key={event.id} value={event.id} disabled={!courses.some(course => course.id === event.courseId)}>{event.label} · {event.dateLabel}{courses.some(course => course.id === event.courseId) ? '' : ' · 形状確認中'}</option>)}</select></label>
      <button onClick={() => setSourceOpen(open => !open)} aria-expanded={sourceOpen}>出典・推定条件</button>
    </header>
    <section className="motorsport-controls" aria-label="Race controls">
      <button onClick={() => setPaused(value => !value)} disabled={state.phase === 'finished'}>{paused ? '走行開始' : '一時停止'}</button>
      <select aria-label="Motorsport simulation speed" value={speed} onChange={event => setSpeed(Number(event.target.value))}>{[1, 5, 10, 20, 60, 600].map(value => <option key={value} value={value}>{value}x</option>)}</select>
      <button onClick={() => reset({ ...config })}>リセット</button>
      <label>距離<select aria-label="Motorsport distance kind" value={config.format.kind} disabled={!paused} onChange={event => reset({ ...config, format: event.target.value === 'laps' ? { kind: 'laps', laps: 10, basis: 'User SIM distance' } : { kind: 'time', seconds: 21600, basis: 'User SIM duration' } })}><option value="laps">周回数</option><option value="time">時間</option></select></label>
      <input aria-label="Motorsport race distance" type="number" min="1" max={config.format.kind === 'laps' ? 1000 : 24} step={config.format.kind === 'laps' ? 1 : 0.5} disabled={!paused} value={config.format.kind === 'laps' ? config.format.laps : config.format.seconds / 3600} onChange={event => { const value = Number(event.target.value); if (value > 0 && value <= (config.format.kind === 'laps' ? 1000 : 24)) reset({ ...config, format: config.format.kind === 'laps' ? { kind: 'laps', laps: Math.round(value), basis: 'User SIM distance' } : { kind: 'time', seconds: value * 3600, basis: 'User SIM duration' } }) }} />
      <label>天候<select aria-label="Motorsport weather" value={config.weather} disabled={!paused} onChange={event => reset({ ...config, weather: event.target.value as 'dry' | 'wet' })}><option value="dry">ドライ</option><option value="wet">ウェット</option></select></label>
      <select aria-label="Motorsport race director flag" value={state.flag} onChange={event => flag(event.target.value as MotorsportRaceState['flag'])}>{['green', 'yellow', 'fcy', 'sc', 'red'].map(value => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select>
      <button onClick={exportSave}>JSON保存</button>
      <label className="motorsport-import">保存を読込<input aria-label="Import motorsport race" type="file" accept=".json" onChange={async event => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 4_000_000) { setMessage('保存ファイルが大きすぎます。'); event.target.value = ''; return } const save = parseMotorsportSave(await file.text()); if (!save) { setMessage('保存データの形式・整合性を確認できません。'); return } generation.current++; busy.current = false; debt.current = 0; worker.current?.postMessage({ type: 'init', generation: generation.current, config: save.config, state: save.state } satisfies MotorsportWorkerCommand); latest.current = { ...latest.current, ...save, paused: true }; setPaused(true); setConfig(save.config); setState(save.state); setSelectedId(save.config.entries[0].id); setClassFilter('all'); setNextDriver(null); setMessage(''); event.target.value = '' }} /></label>
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
        <div className="motorsport-table-scroll"><table aria-label="Motorsport timing"><thead><tr><th>総合</th><th>クラス</th><th># / チーム / ドライバー</th><th>周</th><th>速度</th><th>燃料</th><th>タイヤ</th><th>状態</th></tr></thead><tbody>{standings.filter(row => classFilter === 'all' || row.entry.classId === classFilter).map(({ car, entry, overallPosition, classPosition }) => <tr key={entry.id} className={selectedId === entry.id ? 'selected' : ''} onClick={() => { setSelectedId(entry.id); setNextDriver(null) }}><td>{overallPosition}</td><td>{entry.classId.toUpperCase()} {classPosition}</td><td><button style={{ borderLeftColor: entry.color }} aria-label={`Select car ${entry.id}`} onClick={() => { setSelectedId(entry.id); setNextDriver(null) }}><strong>#{entry.number} {entry.team}</strong><span>{entry.drivers[car.driverIndex].name}</span></button></td><td>{car.laps}</td><td>{Math.round(car.speedMps * 3.6)}</td><td>{car.fuelKg.toFixed(1)} kg</td><td>{Math.round(car.tyreLife * 100)}%</td><td>{car.blueFlag ? 'BLUE · ' : ''}{car.status}{car.pitRequest ? ' · PIT REQUEST' : ''}</td></tr>)}</tbody></table></div>
      </section>
</>}
      {panel === 'pit' && <>      <aside className="motorsport-car-detail"><h2>#{selected.entry.number} {selected.entry.team}</h2><p>{selected.entry.machine.name}</p><dl><dt>現在のドライバー</dt><dd>{selected.entry.drivers[selected.car.driverIndex].name}</dd><dt>能力値 / 出典</dt><dd>{selected.entry.drivers[selected.car.driverIndex].overall ?? '未収録'} / {selected.entry.drivers[selected.car.driverIndex].ratingSource ?? '能力表未対応・中立SIM値'}</dd><dt>前周 / ベスト</dt><dd>{lapTime(selected.car.lastLapSeconds)} / {lapTime(selected.car.bestLapSeconds)}</dd><dt>現在のスティント</dt><dd>{clock(selected.car.stintSeconds)}</dd><dt>タイヤセット</dt><dd>{selected.car.tyreSets.map((set, index) => `${index + 1}: ${set.compound} ${set.completedLaps}周`).join(' / ')}</dd><dt>ピット回数</dt><dd>{selected.car.pits}</dd><dt>電力残量</dt><dd>{selected.car.hybridEnergyMj.toFixed(3)} MJ</dd><dt>仮想エネルギー残量</dt><dd>{selected.car.virtualEnergyMj?.toFixed(1) ?? '対象外'} MJ</dd></dl>
        <p><a href={safeUrl(selected.entry.sourceUrl)} target="_blank" rel="noreferrer">この大会のエントリー資料</a></p><h3>クルーと運転時間</h3>{selected.entry.drivers.map((driver, index) => <p key={driver.id}>{index === selected.car.driverIndex ? '● ' : ''}{driver.name}<strong>{clock(selected.car.driverSeconds[index])}</strong></p>)}
        <h3>競技確認</h3>{selected.car.warnings.length ? selected.car.warnings.map((warning, index) => <p key={index}>{warning}</p>) : <p>{state.phase === 'finished' ? '運転時間監査の指摘なし' : '運転時間を記録中'}</p>}<small>審判判断を要する違反は指摘として表示します。大会特別規則による調整・正式裁定は自動再現していません。</small><h3>次のピット</h3><label>交代<select aria-label="Motorsport next driver" value={nextDriver ?? ''} disabled={config.championship === 'kyojo'} onChange={event => setNextDriver(event.target.value === '' ? null : Number(event.target.value))}><option value="">交代なし</option>{selected.entry.drivers.map((driver, index) => <option key={driver.id} value={index}>{driver.name}</option>)}</select></label>
        <label>燃料目標<input aria-label="Motorsport refuel target" type="range" min="0" max="1" step="0.05" value={refuelFraction} disabled={config.championship === 'kyojo'} onChange={event => setRefuelFraction(Number(event.target.value))} />{Math.round(refuelFraction * 100)}%</label>
        <label><input type="checkbox" checked={changeTyres} onChange={event => setChangeTyres(event.target.checked)} />タイヤ交換</label><button onClick={pit} disabled={state.phase !== 'racing' || selected.car.status !== 'running'}>ピットを指示</button>
        <small>自動戦略は燃料・仮想エネルギー・タイヤの残量を監視します。WECの給油とタイヤ作業は順に行い、INDYCARは並行作業です。</small>
      </aside></>}
    </section>}
  </div>
}
