// Render-only terrain profiles. Never used as surveyed road/physics inputs.
// GeoJSON: bacinger/f1-circuits (MIT); SRTM: Open Topo Data, EGM96 metres.
import { writeFile } from 'node:fs/promises'
import { realTrackLayouts } from '../src/data/realTrackLayouts.ts'

const ids = {
  'albert-park-approx': 'au-1953', 'bahrain-approx': 'bh-2002',
  'shanghai-approx': 'cn-2004', 'barcelona-approx': 'es-1991',
  'monaco-approx': 'mc-1929', 'montreal-approx': 'ca-1978',
  'red-bull-ring-approx': 'at-1969', 'hungaroring-approx': 'hu-1986',
  'spa-approx': 'be-1925', 'monza-approx': 'it-1922',
  'singapore-approx': 'sg-2008', 'cota-approx': 'us-2012',
  'mexico-city-approx': 'mx-1962', 'interlagos-approx': 'br-1940',
  'yas-marina-approx': 'ae-2009', 'jeddah-approx': 'sa-2021',
  'miami-approx': 'us-2022', 'lusail-approx': 'qa-2004',
  'madrid-approx': 'es-2026', 'baku-approx': 'az-2016',
  'las-vegas-approx': 'us-2023',
}
const count = 96
async function json(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url.split('?')[0]}`)
  return response.json()
}
function resample(points) {
  const loop = [...points, points[0]]
  const lengths = loop.slice(1).map((p, i) => Math.hypot(p[0] - loop[i][0], p[1] - loop[i][1]))
  const total = lengths.reduce((a, b) => a + b, 0)
  let segment = 0, traversed = 0
  return Array.from({ length: count }, (_, i) => {
    const distance = i / count * total
    while (segment < lengths.length - 1 && traversed + lengths[segment] < distance) traversed += lengths[segment++]
    const t = (distance - traversed) / (lengths[segment] || 1)
    return loop[segment].map((v, axis) => v + t * (loop[segment + 1][axis] - v))
  })
}
function normalize(points) {
  const mean = [0, 1].map(axis => points.reduce((sum, p) => sum + p[axis], 0) / count)
  const centered = points.map(p => [p[0] - mean[0], p[1] - mean[1]])
  const norm = Math.sqrt(centered.reduce((sum, p) => sum + p[0] ** 2 + p[1] ** 2, 0))
  return centered.map(p => p.map(v => v / norm))
}
const commit = await json('https://api.github.com/repos/bacinger/f1-circuits/commits/master')
const geoUrl = `https://raw.githubusercontent.com/bacinger/f1-circuits/${commit.sha}/f1-circuits.geojson`
const geo = await json(geoUrl)
const profiles = {}
const audit = []
for (const [id, geoId] of Object.entries(ids)) {
  const feature = geo.features.find(f => f.properties.id === geoId)
  const coordinates = feature.geometry.coordinates
  const latitude = coordinates[0][1] * Math.PI / 180
  const local = coordinates.map(([lon, lat]) => [lon * Math.cos(latitude), lat, lon, lat])
  const samples = resample(local)
  const target = normalize(resample(realTrackLayouts[id].centerline.map(p => [p[0], -p[2]])))
  let best = { error: Infinity }
  for (const reverse of [false, true]) {
    const candidate = reverse ? samples.toReversed() : samples
    const normalized = normalize(candidate)
    for (let shift = 0; shift < count; shift++) {
      let dot = 0, cross = 0
      for (let i = 0; i < count; i++) {
        const a = normalized[(i + shift) % count], b = target[i]
        dot += a[0] * b[0] + a[1] * b[1]
        cross += a[0] * b[1] - a[1] * b[0]
      }
      const error = 1 - Math.hypot(dot, cross)
      if (error < best.error) best = { error, shift, candidate, reverse }
    }
  }
  // Reject obsolete/mismatched layouts rather than attaching terrain to a wrong corner.
  if (best.error > 0.015) {
    audit.push({ id, status: 'rejected-layout', alignmentError: best.error })
    console.log(`${id}: rejected layout (${best.error.toFixed(5)})`)
    continue
  }
  const aligned = Array.from({ length: count }, (_, i) => best.candidate[(i + best.shift) % count])
  try {
    const locations = aligned.map(p => `${p[3].toFixed(6)},${p[2].toFixed(6)}`).join('|')
    const response = await json(`https://api.opentopodata.org/v1/srtm90m?interpolation=bilinear&locations=${locations}`)
    if (response.status !== 'OK' || response.results.length !== count || response.results.some(r => !Number.isFinite(r.elevation))) throw new Error('Incomplete elevation response')
    const raw = response.results.map(r => r.elevation)
    // Suppress individual pixel spikes; retains broad terrain, not bridge/building heights.
    const elevations = raw.map((_, i) => [-1, 0, 1].map(d => raw[(i + d + count) % count]).sort((a,b) => a-b)[1])
    profiles[id] = {
      sourceLabel: 'SRTM 90 m terrain • approximate, not surveyed asphalt',
      sourceUrl: 'https://www.opentopodata.org/datasets/srtm/',
      geometryUrl: 'https://github.com/bacinger/f1-circuits',
      geometryRevision: commit.sha,
      coordinates: aligned.map(p => [Number(p[2].toFixed(6)), Number(p[3].toFixed(6))]),
      rawElevations: raw,
      retrievedAt: new Date().toISOString(), alignmentError: Number(best.error.toFixed(6)),
      elevations: elevations.map(v => Number(v.toFixed(2))),
    }
    audit.push({ id, status: 'terrain-available', alignmentError: best.error, min: Math.min(...elevations), max: Math.max(...elevations) })
    console.log(`${id}: ${Math.min(...elevations).toFixed(1)}–${Math.max(...elevations).toFixed(1)} m`)
  } catch (error) {
    audit.push({ id, status: 'unavailable', reason: error.message })
    console.log(`${id}: ${error.message}`)
  }
  await new Promise(resolve => setTimeout(resolve, 1100))
}
await writeFile('src/data/renderTerrainElevations.json', JSON.stringify(profiles, null, 2) + '\n')
await writeFile('docs/RENDER_TERRAIN_AUDIT.json', JSON.stringify(audit, null, 2) + '\n')
