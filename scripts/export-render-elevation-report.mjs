import { writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const server = await createServer({ root, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
try {
  const { tracks } = await server.ssrLoadModule('/src/data/tracks.ts')
  const { resolveRenderElevation } = await server.ssrLoadModule('/src/three/renderElevation.ts')
  const { cornerElevations } = await server.ssrLoadModule('/src/data/cornerElevations.ts')
  const rows = [['trackId','trackName','corner','recommendedMeters','recommendedSource','terrainMeters','providedMeters','note']]
  const summaries = []
  for (const track of tracks) {
    const profile = resolveRenderElevation(track)
    const terrain = resolveRenderElevation(track, 'terrain')
    summaries.push({ id: track.id, name: track.name, min: profile.min, max: profile.max, source: profile.sourceLabel, url: profile.sourceUrl })
    for (const corner of track.corners ?? []) {
      const p = profile.cornerProgress(corner.number)
      const q = terrain.cornerProgress(corner.number)
      rows.push([track.id, track.name, `T${corner.number}`, profile.elevationAt(p).toFixed(2), profile.sourceLabel, terrain.elevationAt(q).toFixed(2), cornerElevations[track.id]?.[corner.number-1] ?? '',
        track.id === 'madrid-approx' ? ([2,7].includes(corner.number) ? 'official elevation anchor' : 'interpolated / inferred, not official corner elevation') : (track.id === 'baku-approx' && corner.number === 20 ? 'provided 2m excluded from corner interpolation; terrain also uncertain' : 'terrain / interpolated, not surveyed road')])
    }
  }
  const escape = value => '"'+String(value).replaceAll('"','""')+'"'
  await writeFile(resolve(root, '../elevation-corners.csv'), '\uFEFF'+rows.map(r => r.map(escape).join(',')).join('\n')+'\n')
  const report = `# F1 3Dコース標高レポート\n\n2026-10-09取得。24コース。標高値の単位はm。推奨表示は既存の公開DEM/LiDARを優先し、その他はSRTM地形、マドリングは公式固定点を使います。\n\n| コース | 最低 | 最高 | 高低差 | データ |\n|---|---:|---:|---:|---|\n`+
    summaries.map(p => `| ${p.name} | ${p.min.toFixed(1)} | ${p.max.toFixed(1)} | ${(p.max-p.min).toFixed(1)} | ${p.source} |`).join('\n')+
    `\n\n## 数値の意味\n\n- 「最低・最高」は採用したサンプル/固定点の範囲であり、測量によるコース全体の極値ではありません。\n- CSVには推奨値、公開地形値、ユーザー提供値を別列で保存しています。コーナー位置の数値は標高プロファイルから補間した値です。\n- マドリングのT2=671m・T7=697mは公式。その他のコーナー値は補間/推定で、全22コーナーの公式標高ではありません。\n- SRTMは約90mメッシュ、EGM96基準の地形モデルです。主に2000年時点の地形を反映するため、後年の造成路面・橋・トンネルや周囲構造物との違いがあります。\n- GSI、英国LiDAR、AHNはそれぞれの鉛直基準を持ちます。異なるデータ間の絶対標高を同じ精度として比較しないでください。\n- バクーT20の提供値2mは保持していますが、コーナー補間からは除外しました。公開地形側も道路測量ではありません。\n- 高さ倍率は2D/×1/×3/×5から選択。初期値は×3。表示のための起伏であり、走行物理の入力は変更していません。\n- バンク・トンネル・立体交差の構造物は追加モデル化していません。既存の地形プロファイルが道路面の上下を保証するものではありません。\n\n## 出典\n\n- [MADRING公式](https://www.madring.com/en/circuit)\n- [Open Topo Data / SRTM](https://www.opentopodata.org/datasets/srtm/)\n- [コース地理座標（bacinger/f1-circuits, MIT）](https://github.com/bacinger/f1-circuits)\n- [国土地理院標高API](https://maps.gsi.go.jp/development/elevation_s.html)\n- [AHN](https://www.ahn.nl/dataroom)\n- [英国Environment Agency LiDAR](https://www.data.gov.uk/dataset/cf3f1137-c12b-44a1-a835-e80fe4a60b92/lidar-composite-digital-surface-model-dsm-1m)\n\n追加取得21コース×96地点の座標、取得値、中央値処理後の値、取得日時、GeoJSONのコミットIDはsrc/data/renderTerrainElevations.jsonに保存しています。形状整合性の監査はdocs/RENDER_TERRAIN_AUDIT.jsonを参照してください。\n`
  await writeFile(resolve(root, '../elevation-report.md'), report)
  await writeFile(resolve(root, 'docs/RENDER_ELEVATION_MAPS.md'), report+
    '\n## 更新手順\n\n`node scripts/generate-render-elevations.mjs`で追加地形データを取得し、`node scripts/export-render-elevation-report.mjs`で比較CSVと本レポートを更新します。データ取得は開発時のみで、表示時の外部API呼び出しはありません。提供値はsrc/data/cornerElevations.tsに保持。描画用中心線のみを持ち上げ、元のトラック定義や物理入力を変更しません。\n')
  console.log(`Exported ${summaries.length} courses, ${rows.length-1} corners`)
} finally { await server.close() }
