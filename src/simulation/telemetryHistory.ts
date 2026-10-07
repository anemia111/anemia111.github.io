export type TelemetryPoint = { lap: number; progress: number; seconds: number; speedKph: number; throttlePercent: number; brakePercent: number; gear: number; rpm: number }

/** Spatial samples from the actual physics ticks, including fast-forward. Never synthesize missing bins. */
export function recordTelemetry(history: TelemetryPoint[] | undefined, point: TelemetryPoint): TelemetryPoint[] {
  const previous = history ?? []
  if (point.lap < 0) return previous
  const last = previous.at(-1)
  if (last && last.lap === point.lap && Math.floor(last.progress * 256) === Math.floor(point.progress * 256)) return previous
  point = {...point,progress:Math.min(0.999999,Number(point.progress.toFixed(6))),seconds:Number(point.seconds.toFixed(2)),speedKph:Number(point.speedKph.toFixed(2)),throttlePercent:Number(point.throttlePercent.toFixed(1)),brakePercent:Number(point.brakePercent.toFixed(1)),rpm:Math.round(point.rpm)}
  return [...previous.filter(sample => sample.lap >= point.lap - 2), point].slice(-768)
}
