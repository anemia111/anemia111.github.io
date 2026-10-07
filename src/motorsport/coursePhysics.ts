import type { MotorsportCourse, MotorsportMachine } from './types'

export const MOTORSPORT_STEP_SECONDS = 0.1
const SAMPLE_COUNT = 512
export type CourseStation = { x: number; y: number; nx: number; ny: number; radiusM: number; bankingRadians: number }
const stationCache = new WeakMap<MotorsportCourse, CourseStation[]>()
const envelopeCache = new WeakMap<MotorsportCourse, WeakMap<MotorsportMachine, number[]>>()
export const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor
export const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value))

export function courseStations(course: MotorsportCourse): CourseStation[] {
  const cached = stationCache.get(course)
  if (cached) return cached
  const points = course.points
  const lengths = points.map((point, i) => Math.hypot(point[0] - points[(i + 1) % points.length][0], point[1] - points[(i + 1) % points.length][1]))
  const total = lengths.reduce((sum, length) => sum + length, 0)
  if (!(total > 0) || !Number.isFinite(total) || !(course.lengthM > 0)) throw new Error('Course requires finite connected geometry and positive official distance')
  const sampled: [number, number][] = []
  let edge = 0, edgeStart = 0
  for (let index = 0; index < SAMPLE_COUNT; index++) {
    const distance = total * index / SAMPLE_COUNT
    while (edge < lengths.length - 1 && edgeStart + lengths[edge] < distance) edgeStart += lengths[edge++]
    const ratio = (distance - edgeStart) / Math.max(lengths[edge], 1e-9)
    const next = points[(edge + 1) % points.length]
    sampled.push([points[edge][0] + (next[0] - points[edge][0]) * ratio, points[edge][1] + (next[1] - points[edge][1]) * ratio])
  }
  const scaleToMetres = course.lengthM / total
  // An oval is a continuous broad-radius turn. Short-range three-point fits
  // amplify sparse OSM chord joins into fictitious 30m hairpins. Fit over a
  // wider physical arc for ovals; road/street hairpins retain the local fit.
  const curvatureSpan = course.kind === 'short-oval' ? 24 : course.kind === 'speedway' ? 12 : 3
  const stations = sampled.map(([x, y], index) => {
    const before = sampled[modulo(index - curvatureSpan, SAMPLE_COUNT)], after = sampled[(index + curvatureSpan) % SAMPLE_COUNT]
    const a = Math.hypot(x - before[0], y - before[1]) * scaleToMetres
    const b = Math.hypot(x - after[0], y - after[1]) * scaleToMetres
    const c = Math.hypot(after[0] - before[0], after[1] - before[1]) * scaleToMetres
    const twiceArea = Math.abs((x - before[0]) * (after[1] - before[1]) - (y - before[1]) * (after[0] - before[0])) * scaleToMetres ** 2
    const radiusM = twiceArea < 0.01 ? 100_000 : clamp(a * b * c / (2 * twiceArea), 8, 100_000)
    const dx = after[0] - before[0], dy = after[1] - before[1], norm = Math.max(0.001, Math.hypot(dx, dy))
    return { x, y, nx: -dy / norm / scaleToMetres, ny: dx / norm / scaleToMetres, radiusM,
      bankingRadians: radiusM < 1000 ? course.bankingDegrees.value * Math.PI / 180 : 0 }
  })
  stationCache.set(course, stations)
  return stations
}

/** Point-mass tyre/aero force balance, with banking and a backward braking pass. */
export function speedEnvelope(course: MotorsportCourse, machine: MotorsportMachine): number[] {
  let byMachine = envelopeCache.get(course)
  if (!byMachine) { byMachine = new WeakMap(); envelopeCache.set(course, byMachine) }
  const cached = byMachine.get(machine)
  if (cached) return cached
  const mass = machine.massKg.value + machine.driverMassKg.value + machine.fuelCapacityKg.value * 0.5
  const mu = machine.tyreMu.value
  const terminal = Math.cbrt(machine.powerKw.value * 1000 * 0.94 / (0.5 * 1.225 * machine.dragAreaM2.value))
  const speeds = courseStations(course).map(({ radiusM, bankingRadians: angle }) => {
    const bankGrip = (mu * Math.cos(angle) + Math.sin(angle)) / Math.max(0.1, Math.cos(angle) - mu * Math.sin(angle))
    const denominator = 1 - bankGrip * radiusM * 0.5 * 1.225 * machine.liftAreaM2.value / mass
    const corner = denominator <= 0 ? terminal : Math.sqrt(bankGrip * 9.80665 * radiusM / denominator)
    return Math.max(8, Math.min(terminal, corner))
  })
  const ds = course.lengthM / SAMPLE_COUNT
  // Two closed-loop passes carry the braking constraint across the start line.
  for (let index = SAMPLE_COUNT * 2 - 1; index >= 0; index--) {
    const current = index % SAMPLE_COUNT, next = (current + 1) % SAMPLE_COUNT
    const aeroLoad = 0.5 * 1.225 * machine.liftAreaM2.value * speeds[current] ** 2
    const deceleration = Math.min(35, mu * 9.80665 * (1 + aeroLoad / (mass * 9.80665)))
    speeds[current] = Math.min(speeds[current], Math.sqrt(speeds[next] ** 2 + 2 * deceleration * ds))
  }
  byMachine.set(machine, speeds)
  return speeds
}
export function coursePosition(course: MotorsportCourse, distanceM: number, lateralM = 0): [number, number] {
  const stations = courseStations(course)
  const exact = modulo(distanceM, course.lengthM) / course.lengthM * SAMPLE_COUNT
  const index = Math.floor(exact), fraction = exact - index
  const a = stations[index], b = stations[(index + 1) % SAMPLE_COUNT]
  return [a.x + (b.x - a.x) * fraction + a.nx * lateralM, a.y + (b.y - a.y) * fraction + a.ny * lateralM]
}
export function targetSpeedMps(course: MotorsportCourse, machine: MotorsportMachine, distanceM: number): number {
  const envelope = speedEnvelope(course, machine)
  const exact = modulo(distanceM, course.lengthM) / course.lengthM * SAMPLE_COUNT
  const index = Math.floor(exact), fraction = exact - index
  return envelope[index] + (envelope[(index + 1) % SAMPLE_COUNT] - envelope[index]) * fraction
}
