import catalogJson from '../data/expansionCatalog2026.json'
import { driverPool2026, seriesPackages } from './seriesRegistry'

export type CatalogEntry = {
  number: string
  team: string | null
  machine: string | null
  drivers: string[]
  sourceId: string
  tyreSupplier?: string | null
  engine?: string | null
}
export type CatalogEvent = {
  round: number
  trackName: string
  trackKey: string
  dateLabel: string
  sourceId: string
}
export type ExpansionCategory = {
  id: string
  label: string
  entries: CatalogEntry[]
}
type CatalogSource = { id: string; url: string; scope: string; verifiedOn: string; sha256: string }
type ExpansionCatalog = {
  schemaVersion: number
  season: number
  verifiedOn: string
  categories: ExpansionCategory[]
  sources: CatalogSource[]
  calendars: Record<string, CatalogEvent[]>
}
export const expansionCatalog = catalogJson as ExpansionCatalog
export const expansionSourceById = new Map(expansionCatalog.sources.map((source) => [source.id, source]))

function normaliseName(name: string) {
  return name.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
}

// Reviewed bilingual identities, not fuzzy matching. A miss never silently
// merges two people or changes their existing, user-authored ability values.
const aliases: Record<string, string> = {
  '太田格之進': 'kakunoshin_ohta', '野尻智紀': 'tomoki_nojiri',
  '笹原右京': 'ukyo_sasahara', '牧野任祐': 'tadasuke_makino',
  '山下健太': 'kenta_yamashita', '小林可夢偉': 'kamui_kobayashi',
  '小林利徠斗': 'rikuto_kobayashi', '小出峻': 'syun_koide',
  '福住仁嶺': 'nirei_fukuzumi', 'ザックオサリバン': 'zak_osullivan',
  '松下信治': 'nobuharu_matsushita', '坪井翔': 'sho_tsuboi',
  'サッシャフェネストラズ': 'sacha_fenestraz', '阪口晴南': 'sena_sakaguchi',
  '大湯都史樹': 'toshiki_oyu', '野村勇斗': 'yuto_nomura',
  '佐藤蓮': 'ren_sato', 'イゴールオオムラフラガ': 'igor_fraga',
}
const poolIdsByName = new Map(driverPool2026.map((driver) => [normaliseName(driver.name), driver.id]))
for (const [alias, id] of Object.entries(aliases)) poolIdsByName.set(normaliseName(alias), id)

export function catalogDriverId(name: string): string {
  const key = normaliseName(name)
  return poolIdsByName.get(key) ?? `catalog:${key}`
}

export const catalogDriverCategories = new Map<string, Set<string>>()
for (const series of seriesPackages) {
  for (const driver of series.drivers) {
    const categories = catalogDriverCategories.get(driver.id) ?? new Set<string>()
    categories.add(series.label)
    catalogDriverCategories.set(driver.id, categories)
  }
}
for (const category of expansionCatalog.categories) {
  for (const entry of category.entries) {
    for (const name of entry.drivers) {
      const id = catalogDriverId(name)
      const categories = catalogDriverCategories.get(id) ?? new Set<string>()
      categories.add(category.label)
      catalogDriverCategories.set(id, categories)
    }
  }
}

export function catalogCalendarFor(categoryId: string) {
  return expansionCatalog.calendars[categoryId.startsWith('super-gt-') ? 'super-gt' :
    categoryId.startsWith('wec-') ? 'wec' : categoryId] ?? []
}

export function validateExpansionCatalog(catalog: ExpansionCatalog): void {
  const sourceIds = new Set(catalog.sources.map((source) => source.id))
  if (catalog.schemaVersion !== 1 || catalog.season !== 2026 || sourceIds.size !== catalog.sources.length) {
    throw new Error('Invalid expansion catalog header or duplicate source')
  }
  const categories = new Set<string>()
  for (const category of catalog.categories) {
    if (categories.has(category.id) || !category.entries.length) throw new Error('Invalid expansion category')
    categories.add(category.id)
    const identities = new Set<string>()
    for (const entry of category.entries) {
      // INDYCAR directory contains multiple people sharing a number across
      // the season. They must not be treated as simultaneous duplicate cars.
      const identity = `${entry.number}:${entry.drivers.join('|')}`
      if (!/^\d{1,3}$/.test(entry.number) || !entry.drivers.length || identities.has(identity) ||
        entry.drivers.some((name) => !name.trim()) || !sourceIds.has(entry.sourceId)) {
        throw new Error(`Invalid expansion entry: ${category.id} ${entry.number}`)
      }
      identities.add(identity)
    }
  }
  for (const events of Object.values(catalog.calendars)) {
    const rounds = new Set<number>()
    for (const event of events) {
      if (rounds.has(event.round) || !event.trackKey || !event.trackName || !sourceIds.has(event.sourceId)) {
        throw new Error('Invalid expansion calendar')
      }
      rounds.add(event.round)
    }
  }
}
validateExpansionCatalog(expansionCatalog)
