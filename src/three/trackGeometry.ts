import * as THREE from 'three'
import type { TrackDefinition } from '../types'

const presentationAngles = new WeakMap<TrackDefinition, number>()
function presentationAngle(track: TrackDefinition) {
  let angle = presentationAngles.get(track)
  if (angle === undefined) {
    const tangent = createTrackCurve(track).getTangentAt(0)
    angle = Math.atan2(tangent.z, tangent.x)
    presentationAngles.set(track, angle)
  }
  return angle
}

/** Furniture must undergo the same rigid rotation as the rendered road. */
export function presentationPoint(track: TrackDefinition, point: [number, number, number]): [number, number, number] {
  return new THREE.Vector3(...point).applyAxisAngle(new THREE.Vector3(0,1,0),presentationAngle(track)).toArray()
}

export function createTrackCurve(track: TrackDefinition) {
  return new THREE.CatmullRomCurve3(
    track.centerline.map((point) => new THREE.Vector3(...point)),
    true,
    'catmullrom',
    0.48,
  )
}

/** Rotate the display alone: the control-line tangent runs left to right. */
export function createPresentationTrackCurve(track: TrackDefinition) {
  const curve = createTrackCurve(track)
  const angle = presentationAngle(track)
  const axis = new THREE.Vector3(0, 1, 0)
  for (const point of curve.points) point.applyAxisAngle(axis, angle)
  curve.updateArcLengths()
  return curve
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

    return center.add(normal.multiplyScalar((width / 2) * side)).setY(0.06)
  })
}
