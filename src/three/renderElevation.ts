import type { TrackDefinition } from '../types'
import { cornerElevations } from '../data/cornerElevations'
import { measuredRoadProfiles } from '../data/measuredRoadProfiles'
import terrainProfiles from '../data/renderTerrainElevations.json'

export type ElevationSource = 'auto' | 'terrain' | 'corners'
type Anchor = { progress: number; elevation: number }
export type RenderElevation = {
  anchors: Anchor[]
  sourceLabel: string
  sourceUrl: string | null
  note: string
  min: number
  max: number
  unitsPerMeter: number
  elevationAt: (progress: number) => number
  cornerProgress: (number: number) => number | undefined
}
const wrap = (p: number) => ((p % 1) + 1) % 1

/** Periodic, monotonic cubic interpolation. No invented overshoot at sparse extrema. */
export function interpolateElevation(anchors: readonly Anchor[], progress: number) {
  if (anchors.length === 0) return 0
  if (anchors.length === 1) return anchors[0].elevation
  const p = wrap(progress)
  let index = anchors.findLastIndex(a => a.progress <= p)
  if (index < 0) index = anchors.length - 1
  const a = anchors[index], b = anchors[(index + 1) % anchors.length]
  const interval = wrap(b.progress - a.progress)
  if (interval < 1e-10) return a.elevation
  const t = wrap(p - a.progress) / interval
  const slope = (i: number) => {
    const prev = anchors[(i - 1 + anchors.length) % anchors.length]
    const here = anchors[i], next = anchors[(i + 1) % anchors.length]
    const h0 = wrap(here.progress - prev.progress), h1 = wrap(next.progress - here.progress)
    const d0 = (here.elevation - prev.elevation) / h0, d1 = (next.elevation - here.elevation) / h1
    if (!Number.isFinite(d0 + d1) || d0 * d1 <= 0) return 0
    return 3 * (h0 + h1) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1)
  }
  const value = (2*t**3 - 3*t**2 + 1)*a.elevation + (t**3 - 2*t**2 + t)*interval*slope(index)
    + (-2*t**3 + 3*t**2)*b.elevation + (t**3 - t**2)*interval*slope((index+1)%anchors.length)
  return Math.max(Math.min(a.elevation, b.elevation), Math.min(Math.max(a.elevation, b.elevation), value))
}

export function resolveRenderElevation(track: TrackDefinition, source: ElevationSource = 'auto'): RenderElevation {
  const points = track.centerline
  const distances = points.map((p, i) => {
    const q = points[(i+1)%points.length]
    return Math.hypot(q[0]-p[0], q[2]-p[2])
  })
  const perimeter = distances.reduce((a,b) => a+b, 0)
  let cumulative = 0
  const progress = distances.map(d => { const p = cumulative / perimeter; cumulative += d; return p })
  const cornerProgresses = new Map<number, number>()
  for (const corner of track.corners ?? []) {
    // Project to a segment, not the nearest vertex; keeps closely spaced corners distinct.
    let best = Infinity, position = 0
    points.forEach((a, i) => {
      const b = points[(i+1)%points.length], c = corner.position
      const dx = b[0]-a[0], dz = b[2]-a[2]
      const t = Math.max(0, Math.min(1, ((c[0]-a[0])*dx+(c[2]-a[2])*dz)/(dx*dx+dz*dz || 1)))
      const error = Math.hypot(c[0]-a[0]-t*dx, c[2]-a[2]-t*dz)
      if (error < best) { best = error; position = wrap(progress[i] + t*distances[i]/perimeter) }
    })
    cornerProgresses.set(corner.number, position)
  }
  const measured = measuredRoadProfiles[track.id]
  const terrain = (terrainProfiles as Record<string, { elevations: number[]; sourceLabel: string; sourceUrl: string }>)[track.id]
  const supplied = cornerElevations[track.id]
  let anchors: Anchor[] = []
  let sourceLabel = '標高データなし', sourceUrl: string | null = null
  let note = '起伏は未確認です。'
  if (track.id === 'madrid-approx' && source !== 'terrain') {
    const t2 = cornerProgresses.get(2), t7 = cornerProgresses.get(7), t8 = cornerProgresses.get(8)
    if (t2 !== undefined && t7 !== undefined && t8 !== undefined) {
      anchors = [
        { progress: t2, elevation: 671 },
        { progress: wrap(t7 - 125/(track.lengthKm*1000)), elevation: 687 },
        { progress: t7, elevation: 697 },
        { progress: t8, elevation: Math.max(671, 697-wrap(t8-t7)*track.lengthKm*1000*0.05) },
      ]
    }
    sourceLabel = 'MADRING公式固定点＋補間'
    sourceUrl = 'https://www.madring.com/en/circuit'
    note = 'T2=671m、T7=697mは公式値。上り8%・10m上昇、下り5%から区間端を推定。その他は補間。バンクは別の情報です。'
  } else if (measured && source !== 'corners') {
    anchors = measured.samples.map(([p, elevation]) => ({ progress: wrap(p-(track.measuredRoadProgressOffset ?? 0)), elevation }))
    sourceLabel = '公開DEM / LiDAR・96地点'
    sourceUrl = measured.fields.elevationMeters.sourceUrl
    note = `${measured.fields.elevationMeters.sourceLabel}。路面測量ではなく地形・表面モデルです。`
  } else if (terrain && source !== 'corners' && !(track.id === 'baku-approx' && source === 'auto')) {
    anchors = terrain.elevations.map((elevation, i) => ({ progress: i/terrain.elevations.length, elevation }))
    sourceLabel = 'SRTM地形・96地点（概算）'
    sourceUrl = terrain.sourceUrl
    note = '約90mメッシュ・EGM96基準。コース形状で位置合わせ。橋・トンネル・新設路面・バンクは再現しません。市街地では周囲の建物・地形の影響も含みます。'
    if (track.id === 'baku-approx') note += ' 終盤の急な上昇は道路と地形の不整合の可能性があるため、推奨表示では提供値（T20除外）を使います。'
  } else if (supplied) {
    anchors = (track.corners ?? []).flatMap(c => {
      const p = cornerProgresses.get(c.number), elevation = supplied[c.number-1]
      // Original value remains in cornerElevations; do not turn the known suspect point into a cliff.
      if (p === undefined || elevation === undefined || (track.id === 'baku-approx' && c.number === 20)) return []
      return [{ progress: p, elevation }]
    })
    sourceLabel = '提供コーナー標高＋補間（未検証）'
    note = 'ユーザー提供値。出典・標高基準未確認。コーナー間は距離に沿って補間。'
    if (track.id === 'baku-approx') note += ' T20=2mは不整合の疑いがあるため除外し補間。'
  } else if (terrain) {
    anchors = terrain.elevations.map((elevation, i) => ({ progress: i/terrain.elevations.length, elevation }))
    sourceLabel = 'SRTM地形・96地点（概算）'; sourceUrl = terrain.sourceUrl
  }
  anchors.sort((a,b) => a.progress-b.progress)
  anchors = anchors.filter((a,i) => i === 0 || a.progress-anchors[i-1].progress > 1e-8)
  const elevations = anchors.map(a => a.elevation)
  const min = elevations.length ? Math.min(...elevations) : 0
  const max = elevations.length ? Math.max(...elevations) : 0
  return { anchors, sourceLabel, sourceUrl, note, min, max,
    unitsPerMeter: perimeter / (track.lengthKm*1000),
    cornerProgress: n => cornerProgresses.get(n),
    elevationAt: p => interpolateElevation(anchors, p),
  }
}
