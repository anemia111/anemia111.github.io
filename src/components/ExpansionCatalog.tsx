import { catalogCalendarFor, catalogDriverCategories, catalogDriverId, expansionCatalog,
  expansionSourceById } from '../series/expansionCatalog'

export function ExpansionCatalog() {
  return <section className="expansion-catalog" aria-label="2026追加カテゴリー収録データ">
    <h3>2026 CATEGORY CATALOG</h3>
    <p>公式エントリーと開催コース · 確認日 {expansionCatalog.verifiedOn}。
      追加カテゴリーのレース実行は未対応です。車両物理・競技規則・コース形状の検証後に有効になります。</p>
    <p>能力基準：複数カテゴリー参戦者を接点にした同条件クリーンラップ比較。
      比較ラップ未収録のため、追加選手の能力値は未算出です。</p>
    {expansionCatalog.categories.map((category) => {
      const events = catalogCalendarFor(category.id)
      const tracks = [...new Set(events.map((event) => event.trackName))]
      const scope = expansionSourceById.get(category.entries[0].sourceId)?.scope
      return <details key={category.id}>
        <summary>{category.label} · {category.entries.length} 件 · {tracks.length} コース</summary>
        <p className="expansion-scope">{scope}</p>
        <p>{category.id.startsWith('wec-') ? 'WECはイモラ暫定エントリー表の収録です。年間全参戦者・ル・マン追加枠は未収録です。' :
          category.id === 'indycar' ? '年間ドライバー一覧です。各大会の同時出走台数や車番の割当とは区別しています。' :
            '公式一覧のスナップショットです。大会ごとの変更は別途確認が必要です。'}</p>
        <table><caption>{category.label} 車番・車両・ドライバー</caption>
          <thead><tr><th scope="col">No.</th><th scope="col">車両 / チーム</th><th scope="col">ドライバー</th></tr></thead>
          <tbody>{category.entries.map((entry) => <tr key={`${entry.number}:${entry.drivers.join('|')}`}>
            <td>{entry.number}</td>
            <td><a href={expansionSourceById.get(entry.sourceId)?.url} target="_blank" rel="noreferrer">
              {entry.machine ?? '車種未検証'}</a><small>{entry.team ?? 'チーム未確認'}</small>
              <small>{entry.tyreSupplier ?? entry.engine ?? ''}</small></td>
            <td>{entry.drivers.map((name) => {
              const categories = [...(catalogDriverCategories.get(catalogDriverId(name)) ?? [])]
              return <div key={name}>{name}{categories.length > 1 &&
                <small title={categories.join(' / ')}>共通選手：{categories.join(' / ')}</small>}</div>
            })}</td>
          </tr>)}</tbody>
        </table>
        <table><caption>開催コースと日程（コース形状の実装とは別）</caption>
          <thead><tr><th scope="col">Round</th><th scope="col">日程</th><th scope="col">コース</th></tr></thead>
          <tbody>{events.map((event) => <tr key={event.round}><td>{event.round}</td><td>{event.dateLabel}</td>
            <td><a href={expansionSourceById.get(event.sourceId)?.url} target="_blank" rel="noreferrer">{event.trackName}</a></td></tr>)}</tbody>
        </table>
      </details>
    })}
  </section>
}
