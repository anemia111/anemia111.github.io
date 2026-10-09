import * as THREE from 'three'
import type { TrackDefinition } from '../types'
import type { RenderElevation } from './renderElevation'

export function createTrackCurve(track: TrackDefinition, elevation?: RenderElevation, heightMultiplier = 1) {
  const curve = new THREE.CatmullRomCurve3(
    track.centerline.map((point) => new THREE.Vector3(point[0], elevation ? 0 : point[1], point[2])),
    true,
    'catmullrom',
    0.48,
  )
  if (elevation) {
    const planarPointAt = curve.getPointAt.bind(curve)
    // Preserve planar stationing: changing elevation must never move an operational
    // marker or a car along X/Z through THREE's 3D arc-length reparameterisation.
    curve.getPointAt = (progress, target = new THREE.Vector3()) => {
      const p = ((progress % 1) + 1) % 1
      planarPointAt(p, target)
      target.y = (elevation.elevationAt(p)-elevation.min)*elevation.unitsPerMeter*heightMultiplier
      return target
    }
    curve.getTangentAt = (progress, target = new THREE.Vector3()) => {
      const before = curve.getPointAt(progress-0.00001)
      return target.copy(curve.getPointAt(progress+0.00001)).sub(before).normalize()
    }
  }
  return curve
}

const mapSamples = new WeakMap<THREE.CatmullRomCurve3, THREE.Vector3[]>()
/** Used only for static corner/post labels whose coordinates are stored in X/Z. */
export function mapPositionOnRoad(curve: THREE.CatmullRomCurve3, x: number, z: number, offset: number) {
  let points = mapSamples.get(curve)
  if (!points) { points = curve.getSpacedPoints(512); mapSamples.set(curve, points) }
  let nearest = points[0], best = Infinity
  for (const point of points) {
    const error = (point.x-x)**2+(point.z-z)**2
    if (error < best) { best = error; nearest = point }
  }
  return new THREE.Vector3(x, nearest.y+offset, z)
}

export function poseOnTrack(
  curve: THREE.CatmullRomCurve3,
  progress: number,
  laneOffset = 0,
) {
  const wrappedProgress = ((progress % 1) + 1) % 1
  const position = curve.getPointAt(wrappedProgress)
  const tangent = curve.getTangentAt(wrappedProgress).normalize()
  const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()

  return {
    position: position.add(normal.clone().multiplyScalar(laneOffset)),
    tangent,
    normal,
  }
}

export function createTrackRibbonGeometry(
  curve: THREE.CatmullRomCurve3,
  width: number,
  segments = 192,
) {
  const vertices: number[] = []
  const indices: number[] = []

  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments
    const center = curve.getPointAt(progress)
    const tangent = curve.getTangentAt(progress).normalize()
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
    const left = center.clone().add(normal.clone().multiplyScalar(width / 2))
    const right = center.clone().add(normal.clone().multiplyScalar(-width / 2))

    vertices.push(left.x, left.y + 0.02, left.z)
    vertices.push(right.x, right.y + 0.02, right.z)
  }

  for (let index = 0; index < segments; index += 1) {
    const a = index * 2
    const b = a + 1
    const c = a + 2
    const d = a + 3

    indices.push(a, c, b, b, c, d)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

export function edgePoints(
  curve: THREE.CatmullRomCurve3,
  width: number,
  side: -1 | 1,
  segments = 192,
) {
  return Array.from({ length: segments + 1 }, (_, index) => {
    const progress = index / segments
    const center = curve.getPointAt(progress)
    const tangent = curve.getTangentAt(progress).normalize()
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()

    return center.add(normal.multiplyScalar((width / 2) * side)).add(new THREE.Vector3(0, 0.06, 0))
  })
}
