import { describe, expect, it } from 'vitest'
import { tracks } from '../data/tracks'
import { supportSeriesTracks } from '../data/supportSeriesTracks'
import { measuredRoadProfiles } from '../data/measuredRoadProfiles'
import { cornerElevations } from '../data/cornerElevations'
import { interpolateElevation, resolveRenderElevation } from './renderElevation'
import { createTrackCurve, createTrackRibbonGeometry, edgePoints, poseOnTrack } from './trackGeometry'

const trackById = (id: string) => tracks.find(t => t.id === id)!
describe('render-only elevation maps', () => {
  it('preserves all supplied values separately, including the suspect Baku point', () => {
    expect(Object.keys(cornerElevations)).toHaveLength(23)
    expect(cornerElevations['baku-approx'][19]).toBe(2)
    expect(cornerElevations['jeddah-approx']).toHaveLength(27)
  })
  it('uses real corner stationing, supports negative altitudes and excludes suspect Baku T20', () => {
    const track = trackById('baku-approx')
    const profile = resolveRenderElevation(track, 'corners')
    expect(profile.max).toBeLessThan(0)
    expect(profile.anchors).toHaveLength(19)
    expect(resolveRenderElevation(track).max).toBeLessThan(0)
    for (const corner of track.corners!.filter(c => c.number !== 20)) {
      expect(profile.elevationAt(profile.cornerProgress(corner.number)!)).toBeCloseTo(cornerElevations[track.id][corner.number-1], 6)
    }
  })
  it('keeps a constant Canada corner profile flat; terrain remains independently available', () => {
    const track = trackById('montreal-approx')
    const supplied = resolveRenderElevation(track, 'corners')
    expect(supplied.min).toBe(10); expect(supplied.max).toBe(10)
    const terrain = resolveRenderElevation(track, 'terrain')
    expect(terrain.anchors).toHaveLength(96)
    expect(terrain.max-terrain.min).toBeGreaterThan(0)
  })
  it('keeps official Madrid heights exact and labels the unmeasured connecting sections', () => {
    const profile = resolveRenderElevation(trackById('madrid-approx'))
    expect(profile.elevationAt(profile.cornerProgress(2)!)).toBeCloseTo(671, 6)
    expect(profile.elevationAt(profile.cornerProgress(7)!)).toBeCloseTo(697, 6)
    expect(profile.max-profile.min).toBe(26)
    expect(profile.sourceUrl).toBe('https://www.madring.com/en/circuit')
    expect(profile.note).toContain('補間')
  })
  it('uses continuous existing public profiles in preference to unverified corner values', () => {
    for (const id of ['suzuka-approx', 'silverstone-approx', 'zandvoort-approx']) {
      const profile = resolveRenderElevation(trackById(id))
      expect(profile.anchors).toHaveLength(96)
      expect(profile.sourceLabel).toContain('DEM')
    }
  })
  it('retains the measured-profile start-line offset on all four domestic SF courses', () => {
    for (const track of supportSeriesTracks) {
      const profile = resolveRenderElevation(track)
      expect(profile.anchors).toHaveLength(96)
      for (const [p, elevation] of measuredRoadProfiles[track.id].samples) {
        expect(profile.elevationAt(p-(track.measuredRoadProgressOffset ?? 0))).toBeCloseTo(elevation, 6)
      }
    }
  })
  it('closes smoothly across the finish line and does not overshoot sparse extrema', () => {
    const anchors = [{progress: 0.15, elevation: -20}, {progress: 0.4, elevation: 42}, {progress: 0.8, elevation: 3}]
    for (let i=0; i<1000; i++) {
      const h = interpolateElevation(anchors, i/1000)
      expect(h).toBeGreaterThanOrEqual(-20); expect(h).toBeLessThanOrEqual(42)
    }
    expect(interpolateElevation(anchors, -0.000001)).toBeCloseTo(interpolateElevation(anchors, 0.000001), 3)
    const derivative = (p: number) => (interpolateElevation(anchors, p+1e-6)-interpolateElevation(anchors, p-1e-6))/2e-6
    expect(derivative(-1e-6)).toBeCloseTo(derivative(1e-6), 2)
  })
  it('never shifts cars or control markers in X/Z when changing height, and lifts edges with the road', () => {
    const track = trackById('spa-approx'), profile = resolveRenderElevation(track)
    const flat = createTrackCurve(track, profile, 0), raised = createTrackCurve(track, profile, 3)
    const original = JSON.stringify(track.centerline)
    for (let i=0; i<100; i++) {
      const p = i/100, a = flat.getPointAt(p), b = raised.getPointAt(p)
      expect(a.x).toBeCloseTo(b.x, 10); expect(a.z).toBeCloseTo(b.z, 10)
      expect(b.y).toBeCloseTo((profile.elevationAt(p)-profile.min)*profile.unitsPerMeter*3, 8)
      expect(poseOnTrack(raised, p, 0.2).position.y).toBeCloseTo(b.y, 8)
    }
    expect(raised.getPointAt(0).distanceTo(raised.getPointAt(1))).toBeLessThan(1e-8)
    const edges = edgePoints(raised, 0.8, 1, 100)
    expect(edges[25].y).toBeCloseTo(raised.getPointAt(0.25).y+0.06, 8)
    const geometry = createTrackRibbonGeometry(raised, 0.8, 100)
    expect(geometry.getAttribute('position').getY(50)).toBeCloseTo(raised.getPointAt(0.25).y+0.02, 5)
    geometry.dispose()
    expect(JSON.stringify(track.centerline)).toBe(original)
  })
  it('has finite, bounded profiles for every F1 course in all data modes', () => {
    for (const track of tracks) for (const source of ['auto','terrain','corners'] as const) {
      const profile = resolveRenderElevation(track, source)
      expect(profile.anchors.length).toBeGreaterThan(1)
      for (let i=0; i<200; i++) {
        const height = profile.elevationAt(i/200)
        expect(Number.isFinite(height)).toBe(true)
        expect(height).toBeGreaterThanOrEqual(profile.min-1e-8)
        expect(height).toBeLessThanOrEqual(profile.max+1e-8)
      }
    }
  })
})
