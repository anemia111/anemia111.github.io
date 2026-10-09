import { chromium } from 'playwright'
import { preview } from 'vite'
import { writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const artifactDir = resolve(root, '../../work/elevation-qa')
await mkdir(artifactDir, { recursive: true })
const server = await preview({ root, logLevel: 'error', preview: { host: '127.0.0.1', port: 0 } })
const browser = await chromium.launch({ headless: true })
const errors = [], results = []
try {
  for (const width of [1440, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 720 } })
    page.on('pageerror', e => errors.push(e.message))
    await page.route('https://api.openf1.org/**', route => route.abort())
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/`)
    await page.getByLabel('Elevation scale').waitFor()
    await page.locator('.broadcast-sidebar .sidebar-settings').click()
    const rounds = await page.getByLabel('Championship round').locator('option').evaluateAll(options => options.map(o => ({value: o.value, label: o.label})))
    await page.getByLabel('close setup').click()
    for (const round of rounds.filter(r => r.value.startsWith('f1-'))) {
      if (process.env.ELEVATION_ROUNDS && !process.env.ELEVATION_ROUNDS.split(',').includes(round.value)) continue
      console.log(`Checking ${width}: ${round.value} ${round.label}`)
      await page.locator('.broadcast-sidebar .sidebar-settings').click()
      await page.getByLabel('Championship round').selectOption(round.value)
      await page.getByLabel('close setup').click()
      await page.getByLabel('Elevation scale').selectOption('3')
      await page.getByLabel('Elevation source').selectOption('auto')
      await page.waitForTimeout(180)
      const text = await page.locator('.elevation-heading').innerText()
      if (/NaN|undefined/.test(text)) throw new Error(`Invalid elevation: ${round.label}`)
      results.push({width, round: round.value, label: round.label, text})
      if (round.value === 'f1-16') {
        if (!text.includes('671') || !text.includes('697')) throw new Error('Madrid official range lost')
        await page.locator('.elevation-controls summary').click()
        await page.waitForTimeout(500)
        await page.screenshot({path: resolve(artifactDir, `madrid-${width}.png`)})
        await page.locator('.elevation-controls summary').click()
      }
      if (round.value === 'f1-12') {
        await page.waitForTimeout(500)
        await page.screenshot({path: resolve(artifactDir, `spa-${width}.png`)})
      }
      for (const mode of ['corners', 'terrain']) {
        await page.getByLabel('Elevation source').selectOption(mode)
        if (/NaN|undefined/.test(await page.locator('.elevation-heading').innerText())) throw new Error('Invalid source switch')
      }
      await page.getByLabel('Elevation scale').selectOption('0')
      await page.getByLabel('Elevation scale').selectOption('1')
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight)
    if (overflow) throw new Error(`${width}: document overflow`)
    await page.close()
  }
  if (errors.length) throw new Error(errors.join('\n'))
  await writeFile(resolve(artifactDir, 'results.json'), JSON.stringify({errors, results}, null, 2))
  console.log(`Elevation UI verified: ${results.length} course/viewport combinations; zero page errors`)
} finally { await browser.close(); await new Promise(resolveClose => server.httpServer.close(resolveClose)) }
