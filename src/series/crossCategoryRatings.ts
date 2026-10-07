/**
 * Cross-category pace calibration. One person is one node across all classes.
 * Only matched clean-lap observations are comparable; car-level endurance
 * classifications must never masquerade as an individual driver's pace.
 */
export type PaceObservation = {
  id: string
  driverId: string
  categoryId: string
  eventId: string
  axis: 'qualifyingPace' | 'racePace'
  /** Same track/layout, session phase, weather, tyre and fuel window. */
  comparisonGroupId: string
  /** Same physical performance specification, not simply the same team name. */
  machineGroupId: string
  cleanLapSeconds: number
  cleanLapCount: number
  /** A source-backed machine correction; positive means the car costs time. */
  machineCorrection?: { logPacePercent: number; sourceId: string }
  sourceId: string
}

export type AbilityScaleAnchor = {
  driverId: string
  axis: PaceObservation['axis']
  rating: number
  /** Scale anchors can be user-authored; they are not official observations. */
  sourceId: string
}

export type CrossCategoryRating = {
  driverId: string
  axis: PaceObservation['axis']
  rating: number | null
  status: 'derived' | 'insufficient-evidence' | 'unanchored' | 'inconsistent-scale'
  confidence: 'unavailable' | 'low' | 'medium'
  categories: string[]
  comparisonCount: number
  anchorDriverIds: string[]
  sourceIds: string[]
  /** Weighted model discrepancy, not a statistical confidence interval. */
  residualLogPacePercent: number | null
  methodVersion: 'shared-driver-clean-pace-v1'
}

type Edge = { a: string; b: string; difference: number; weight: number; sourceIds: string[] }

function solve(matrix: number[][], vector: number[]): number[] {
  const rows = matrix.map((row, index) => [...row, vector[index]])
  for (let column = 0; column < rows.length; column++) {
    let pivot = column
    for (let row = column + 1; row < rows.length; row++) {
      if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) pivot = row
    }
    ;[rows[pivot], rows[column]] = [rows[column], rows[pivot]]
    const divisor = rows[column][column]
    if (Math.abs(divisor) < 1e-10) throw new Error('Unidentifiable comparison graph')
    for (let entry = column; entry <= rows.length; entry++) rows[column][entry] /= divisor
    for (let row = 0; row < rows.length; row++) {
      if (row === column) continue
      const factor = rows[row][column]
      for (let entry = column; entry <= rows.length; entry++) rows[row][entry] -= factor * rows[column][entry]
    }
  }
  return rows.map((row) => row[rows.length])
}

export function deriveCrossCategoryRatings(
  observations: readonly PaceObservation[],
  anchors: readonly AbilityScaleAnchor[],
): CrossCategoryRating[] {
  const ids = new Set<string>()
  for (const observation of observations) {
    if (ids.has(observation.id) || !observation.id || !observation.driverId ||
      !observation.categoryId || !observation.eventId || !observation.comparisonGroupId ||
      !observation.machineGroupId || !observation.sourceId ||
      !['qualifyingPace', 'racePace'].includes(observation.axis) ||
      !Number.isFinite(observation.cleanLapSeconds) || observation.cleanLapSeconds <= 0 ||
      !Number.isInteger(observation.cleanLapCount) || observation.cleanLapCount < 1 ||
      (observation.machineCorrection && (!observation.machineCorrection.sourceId ||
        !Number.isFinite(observation.machineCorrection.logPacePercent)))) {
      throw new Error(`Invalid or duplicate pace observation: ${observation.id}`)
    }
    ids.add(observation.id)
  }
  const anchorIds = new Set<string>()
  for (const anchor of anchors) {
    const id = `${anchor.driverId}:${anchor.axis}`
    if (anchorIds.has(id) || !anchor.driverId || !anchor.sourceId ||
      !Number.isFinite(anchor.rating) || anchor.rating < 0 || anchor.rating > 100 ||
      !['qualifyingPace', 'racePace'].includes(anchor.axis)) throw new Error(`Invalid scale anchor: ${id}`)
    anchorIds.add(id)
  }
  const result: CrossCategoryRating[] = []
  for (const axis of ['qualifyingPace', 'racePace'] as const) {
    const samples = observations.filter((sample) => sample.axis === axis)
    const groups = new Map<string, PaceObservation[]>()
    for (const sample of samples) {
      // Cross-machine comparisons require an explicit correction on BOTH
      // records. Otherwise only identical performance specifications meet.
      const key = JSON.stringify([sample.categoryId, sample.eventId, sample.comparisonGroupId,
        sample.machineCorrection ? 'corrected-machines' : sample.machineGroupId])
      const group = groups.get(key) ?? []
      if (group.some((existing) => existing.driverId === sample.driverId)) {
        throw new Error('Aggregate clean laps once per driver/comparison group before rating')
      }
      group.push(sample)
      groups.set(key, group)
    }
    const edges: Edge[] = []
    for (const group of groups.values()) {
      for (let first = 0; first < group.length; first++) {
        for (let second = first + 1; second < group.length; second++) {
          const a = group[first], b = group[second]
          edges.push({ a: a.driverId, b: b.driverId,
            difference: 100 * Math.log(b.cleanLapSeconds / a.cleanLapSeconds) +
              (a.machineCorrection?.logPacePercent ?? 0) - (b.machineCorrection?.logPacePercent ?? 0),
            // Cap correlated lap evidence and normalise pair expansion. A
            // 40-car session must not count 780 independent experiments.
            weight: Math.min(5, a.cleanLapCount, b.cleanLapCount) / (group.length - 1),
            sourceIds: [a.sourceId, b.sourceId,
              ...(a.machineCorrection ? [a.machineCorrection.sourceId] : []),
              ...(b.machineCorrection ? [b.machineCorrection.sourceId] : [])],
          })
        }
      }
    }
    const remaining = new Set(samples.map((sample) => sample.driverId).sort())
    while (remaining.size) {
      const component = new Set<string>([[...remaining][0]])
      let changed = true
      while (changed) {
        changed = false
        for (const edge of edges) {
          if (component.has(edge.a) === component.has(edge.b)) continue
          component.add(edge.a); component.add(edge.b); changed = true
        }
      }
      const drivers = [...component].sort()
      drivers.forEach((driver) => remaining.delete(driver))
      const comparisons = edges.filter((edge) => component.has(edge.a) && component.has(edge.b))
      const scale = anchors.filter((anchor) => anchor.axis === axis && component.has(anchor.driverId))
      const componentSources = new Set(comparisons.flatMap((edge) => edge.sourceIds))
      scale.forEach((anchor) => componentSources.add(anchor.sourceId))
      const matrix = drivers.map(() => drivers.map(() => 0))
      const vector = drivers.map(() => 0)
      const indices = new Map(drivers.map((driver, index) => [driver, index]))
      for (const edge of comparisons) {
        const a = indices.get(edge.a)!, b = indices.get(edge.b)!, w = edge.weight
        matrix[a][a] += w; matrix[b][b] += w; matrix[a][b] -= w; matrix[b][a] -= w
        vector[a] += w * edge.difference; vector[b] -= w * edge.difference
      }
      // Pin only the arbitrary additive gauge. No category penalty, synthetic
      // driver prior or ridge term supplies missing evidence.
      matrix[0].fill(0); matrix[0][0] = 1; vector[0] = 0
      const pace = comparisons.length ? solve(matrix, vector) : [0]
      const averagePace = scale.reduce((sum, anchor) => sum + pace[indices.get(anchor.driverId)!], 0) / scale.length
      const averageRating = scale.reduce((sum, anchor) => sum + anchor.rating, 0) / scale.length
      let covariance = 0, variance = 0
      for (const anchor of scale) {
        const delta = pace[indices.get(anchor.driverId)!] - averagePace
        covariance += delta * (anchor.rating - averageRating)
        variance += delta * delta
      }
      const slope = covariance / variance
      const anchored = scale.length >= 2 && variance > 1e-8
      const coherent = Number.isFinite(slope) && slope > 0
      const weight = comparisons.reduce((sum, edge) => sum + edge.weight, 0)
      const residual = weight ? Math.sqrt(comparisons.reduce((sum, edge) => sum + edge.weight *
        (pace[indices.get(edge.a)!] - pace[indices.get(edge.b)!] - edge.difference) ** 2, 0) / weight) : null
      for (const driverId of drivers) {
        const local = samples.filter((sample) => sample.driverId === driverId)
        const categories = [...new Set(local.map((sample) => sample.categoryId))].sort()
        const count = comparisons.filter((edge) => edge.a === driverId || edge.b === driverId).length
        const rating = anchored && coherent && count ?
          Math.min(100, Math.max(0, averageRating + slope * (pace[indices.get(driverId)!] - averagePace))) : null
        result.push({ driverId, axis, rating,
          status: !count ? 'insufficient-evidence' : !anchored ? 'unanchored' : !coherent ? 'inconsistent-scale' : 'derived',
          confidence: rating === null ? 'unavailable' : scale.length >= 3 && count >= 4 &&
            (residual ?? Infinity) <= 0.25 ? 'medium' : 'low',
          categories, comparisonCount: count, anchorDriverIds: scale.map((anchor) => anchor.driverId).sort(),
          sourceIds: [...new Set([...componentSources, ...local.map((sample) => sample.sourceId)])].sort(),
          residualLogPacePercent: residual, methodVersion: 'shared-driver-clean-pace-v1',
        })
      }
    }
  }
  return result.sort((a, b) => `${a.driverId}:${a.axis}`.localeCompare(`${b.driverId}:${b.axis}`))
}
