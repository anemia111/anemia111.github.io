# F1 3Dコース標高レポート

2026-10-09取得。24コース。標高値の単位はm。推奨表示は既存の公開DEM/LiDARを優先し、その他はSRTM地形、マドリングは公式固定点を使います。

| コース | 最低 | 最高 | 高低差 | データ |
|---|---:|---:|---:|---|
| Albert Park | 6.0 | 13.0 | 7.0 | SRTM地形・96地点（概算） |
| Shanghai | 2.0 | 6.0 | 4.0 | SRTM地形・96地点（概算） |
| Suzuka | 18.4 | 57.7 | 39.2 | 公開DEM / LiDAR・96地点 |
| Bahrain International Circuit | 7.0 | 28.0 | 21.0 | SRTM地形・96地点（概算） |
| Jeddah Corniche Circuit | 0.0 | 8.0 | 8.0 | SRTM地形・96地点（概算） |
| Miami | 5.0 | 12.0 | 7.0 | SRTM地形・96地点（概算） |
| Montreal | 6.0 | 13.0 | 7.0 | SRTM地形・96地点（概算） |
| Monte Carlo | 1.0 | 53.0 | 52.0 | SRTM地形・96地点（概算） |
| Barcelona | 112.0 | 143.0 | 31.0 | SRTM地形・96地点（概算） |
| Red Bull Ring | 677.0 | 738.0 | 61.0 | SRTM地形・96地点（概算） |
| Silverstone | 145.2 | 155.9 | 10.8 | 公開DEM / LiDAR・96地点 |
| Spa | 365.0 | 468.0 | 103.0 | SRTM地形・96地点（概算） |
| Hungaroring | 204.0 | 240.0 | 36.0 | SRTM地形・96地点（概算） |
| Zandvoort | 2.7 | 10.5 | 7.8 | 公開DEM / LiDAR・96地点 |
| Monza | 180.0 | 197.0 | 17.0 | SRTM地形・96地点（概算） |
| MADRING | 671.0 | 697.0 | 26.0 | MADRING公式固定点＋補間 |
| Baku | -21.0 | -10.0 | 11.0 | 提供コーナー標高＋補間（未検証） |
| Singapore | 1.0 | 29.0 | 28.0 | SRTM地形・96地点（概算） |
| COTA | 152.0 | 183.0 | 31.0 | SRTM地形・96地点（概算） |
| Mexico City | 2227.0 | 2243.0 | 16.0 | SRTM地形・96地点（概算） |
| Interlagos | 746.0 | 786.0 | 40.0 | SRTM地形・96地点（概算） |
| Las Vegas | 631.0 | 655.0 | 24.0 | SRTM地形・96地点（概算） |
| Lusail | 10.0 | 16.0 | 6.0 | SRTM地形・96地点（概算） |
| Yas Marina Circuit | -3.0 | 4.0 | 7.0 | SRTM地形・96地点（概算） |

## 数値の意味

- 「最低・最高」は採用したサンプル/固定点の範囲であり、測量によるコース全体の極値ではありません。
- CSVには推奨値、公開地形値、ユーザー提供値を別列で保存しています。コーナー位置の数値は標高プロファイルから補間した値です。
- マドリングのT2=671m・T7=697mは公式。その他のコーナー値は補間/推定で、全22コーナーの公式標高ではありません。
- SRTMは約90mメッシュ、EGM96基準の地形モデルです。主に2000年時点の地形を反映するため、後年の造成路面・橋・トンネルや周囲構造物との違いがあります。
- GSI、英国LiDAR、AHNはそれぞれの鉛直基準を持ちます。異なるデータ間の絶対標高を同じ精度として比較しないでください。
- バクーT20の提供値2mは保持していますが、コーナー補間からは除外しました。公開地形側も道路測量ではありません。
- 高さ倍率は2D/×1/×3/×5から選択。初期値は×3。表示のための起伏であり、走行物理の入力は変更していません。
- バンク・トンネル・立体交差の構造物は追加モデル化していません。既存の地形プロファイルが道路面の上下を保証するものではありません。

## 出典

- [MADRING公式](https://www.madring.com/en/circuit)
- [Open Topo Data / SRTM](https://www.opentopodata.org/datasets/srtm/)
- [コース地理座標（bacinger/f1-circuits, MIT）](https://github.com/bacinger/f1-circuits)
- [国土地理院標高API](https://maps.gsi.go.jp/development/elevation_s.html)
- [AHN](https://www.ahn.nl/dataroom)
- [英国Environment Agency LiDAR](https://www.data.gov.uk/dataset/cf3f1137-c12b-44a1-a835-e80fe4a60b92/lidar-composite-digital-surface-model-dsm-1m)

追加取得21コース×96地点の座標、取得値、中央値処理後の値、取得日時、GeoJSONのコミットIDはsrc/data/renderTerrainElevations.jsonに保存しています。形状整合性の監査はdocs/RENDER_TERRAIN_AUDIT.jsonを参照してください。

## 更新手順

`node scripts/generate-render-elevations.mjs`で追加地形データを取得し、`node scripts/export-render-elevation-report.mjs`で比較CSVと本レポートを更新します。データ取得は開発時のみで、表示時の外部API呼び出しはありません。提供値はsrc/data/cornerElevations.tsに保持。描画用中心線のみを持ち上げ、元のトラック定義や物理入力を変更しません。
