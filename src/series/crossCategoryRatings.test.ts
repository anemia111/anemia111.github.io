import { describe, expect, it } from 'vitest'
import { deriveCrossCategoryRatings, type PaceObservation, type AbilityScaleAnchor } from './crossCategoryRatings'

// Deliberately synthetic, mathematically known test fixtures. No production
// driver receives these observations or an invented rating.
function lap(driverId: string, categoryId: string, ability: number,
  eventId = 'event-1', machineGroupId = 'control-car'): PaceObservation {
  return { id: `${driverId}:${categoryId}:${eventId}`, driverId, categoryId, eventId,
    comparisonGroupId: 'dry-matched', machineGroupId, axis: 'qualifyingPace',
    cleanLapSeconds: 100 * Math.exp(-ability / 1000), cleanLapCount: 3,
    sourceId: 'test-fixture' }
}
const anchors: AbilityScaleAnchor[] = [
  { driverId: 'a', axis: 'qualifyingPace', rating: 90, sourceId: 'test-scale' },
  { driverId: 'b', axis: 'qualifyingPace', rating: 80, sourceId: 'test-scale' },
]
const samples = [lap('a', 'formula', 90), lap('b', 'formula', 80),
  lap('a', 'gt', 90), lap('c', 'gt', 85)]

describe('shared-driver cross-category calibration', () => {
  it('uses the shared driver to place the second category on the same scale', () => {
    const results = deriveCrossCategoryRatings(samples, anchors)
    expect(results.find((row) => row.driverId === 'c')?.rating).toBeCloseTo(85, 8)
    expect(results.filter((row) => row.driverId === 'a')).toHaveLength(1)
    expect(results.find((row) => row.driverId === 'a')?.categories).toEqual(['formula', 'gt'])
    expect(results.find((row) => row.driverId === 'c')?.anchorDriverIds).toEqual(['a', 'b'])
  })

  it('is invariant to category lap duration, field input order, and renamed categories', () => {
    const shifted = samples.map((sample) => ({ ...sample,
      cleanLapSeconds: sample.cleanLapSeconds * (sample.categoryId === 'gt' ? 2.5 : 0.7),
      categoryId: `${sample.categoryId}-renamed` })).reverse()
    const actual = deriveCrossCategoryRatings(shifted, anchors)
    for (const expected of deriveCrossCategoryRatings(samples, anchors)) {
      expect(actual.find((row) => row.driverId === expected.driverId)?.rating).toBeCloseTo(expected.rating!, 8)
    }
  })

  it('leaves disconnected competitors and single-anchor components unrated', () => {
    const results = deriveCrossCategoryRatings([...samples, lap('d', 'kyojo', 70), lap('e', 'kyojo', 60)], anchors)
    expect(results.find((row) => row.driverId === 'd')).toMatchObject({ rating: null, status: 'unanchored' })
    expect(deriveCrossCategoryRatings(samples, anchors.slice(0, 1)).every((row) => row.rating === null)).toBe(true)
  })

  it('does not attribute an uncorrected faster machine to its driver', () => {
    const results = deriveCrossCategoryRatings([...samples, lap('fast-car', 'gt', 99, 'event-1', 'different-car')], anchors)
    expect(results.find((row) => row.driverId === 'fast-car')).toMatchObject({ rating: null, status: 'insufficient-evidence' })
    const adjusted = samples.filter((sample) => sample.categoryId === 'formula')
      .map((sample) => ({ ...sample, machineCorrection: { logPacePercent: 0, sourceId: 'test-car-model' } }))
    const slowCar = { ...lap('c', 'formula', 85, 'event-1', 'slow-car'),
      machineCorrection: { logPacePercent: 1, sourceId: 'test-car-model' } }
    slowCar.cleanLapSeconds *= Math.exp(0.01)
    expect(deriveCrossCategoryRatings([...adjusted, slowCar], anchors)
      .find((row) => row.driverId === 'c')?.rating).toBeCloseTo(85, 8)
  })

  it('keeps race and qualifying, weather groups and event phases separate', () => {
    const race = { ...lap('c', 'gt', 99), id: 'race', axis: 'racePace' as const }
    const wet = { ...lap('d', 'gt', 99), comparisonGroupId: 'wet' }
    const results = deriveCrossCategoryRatings([...samples, race, wet], anchors)
    expect(results.find((row) => row.driverId === 'c' && row.axis === 'racePace')?.rating).toBeNull()
    expect(results.find((row) => row.driverId === 'd')?.rating).toBeNull()
  })

  it('rejects duplicate observations, duplicate drivers in one group, and invalid measurements', () => {
    expect(() => deriveCrossCategoryRatings([...samples, samples[0]], anchors)).toThrow()
    expect(() => deriveCrossCategoryRatings([...samples, { ...samples[0], id: 'copy' }], anchors)).toThrow()
    expect(() => deriveCrossCategoryRatings([{ ...samples[0], cleanLapSeconds: NaN }], anchors)).toThrow()
    expect(() => deriveCrossCategoryRatings(samples, [...anchors, anchors[0]])).toThrow()
  })

  it('exposes contradictory anchor scales instead of reversing the meaning of pace', () => {
    const reversed = anchors.map((anchor) => ({ ...anchor, rating: 170 - anchor.rating }))
    expect(deriveCrossCategoryRatings(samples, reversed).every((row) =>
      row.rating === null && row.status === 'inconsistent-scale')).toBe(true)
  })
})
