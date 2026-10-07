import { chromium } from 'playwright'
import { preview } from 'vite'
import { mkdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { tmpdir } from 'node:os'
import assert from 'node:assert/strict'

const root = resolve(import.meta.dirname, '..')
const artifacts = resolve(process.env.QA_ARTIFACT_DIR || join(tmpdir(), 'f1-simulator-qa'))
await mkdir(artifacts, { recursive: true })
const server = await preview({ root, logLevel: 'error', preview: { host: '127.0.0.1', port: 0 } })
const address = server.httpServer.address()
const browser = await chromium.launch({ headless: true })
const errors = [], reports = []
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }]) {
    const page = await browser.newPage({ viewport })
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`http://127.0.0.1:${address.port}/`)
    await page.getByRole('combobox', { name: 'Racing series', exact: true }).selectOption('motorsport:kyojo')
    await page.getByTestId('motorsport-app').waitFor()
    for (const [championship, expected] of [['kyojo', 18], ['super-gt', 43], ['wec', 35], ['indycar', 25]]) {
      await page.getByRole('combobox', { name: 'Racing series', exact: true }).selectOption(`motorsport:${championship}`)
      await page.getByRole('button', { name: 'Open setup', exact: true }).click()
      assert.equal(await page.getByRole('button', {name:'FREE',exact:true}).isDisabled(), true)
      const rows = page.locator('.leaderboard-rows > li')
      await rows.first().waitFor()
      assert.equal(await rows.count(), expected, `${championship}: field size`)
      const allCourses = await page.getByRole('combobox', { name: 'Motorsport event', exact: true }).locator('option').evaluateAll(options => options.map(option => ({ value: option.value, disabled: option.disabled })))
      assert.ok(allCourses.every(option => !option.disabled), `${championship}: unavailable course`)
      await page.getByRole('combobox', { name: 'Motorsport distance kind', exact: true }).selectOption('laps')
      await page.getByRole('spinbutton', { name: 'Motorsport race distance', exact: true }).fill('1')
      await page.getByRole('button', {name:'5x',exact:true}).click()
      assert.equal(await page.getByRole('combobox', {name:'Motorsport simulation speed',exact:true}).inputValue(),'5')
      await page.getByRole('button', {name:'20x',exact:true}).click()
      assert.equal(await page.getByRole('combobox', {name:'Motorsport simulation speed',exact:true}).inputValue(),'20')
      await page.getByRole('combobox', { name: 'Motorsport simulation speed', exact: true }).selectOption('600')
      await page.getByRole('button', { name: 'Close panel', exact: true }).click()
      assert.equal(await page.locator('.broadcast-topbar').count(), 1)
      assert.equal(await page.locator('.broadcast-footer').count(), 1)
      assert.equal(await page.locator('.motorsport-layout').count(), 0)
      const classes = await page.locator('.broadcast-class-leaderboards .broadcast-panel-header > div > strong').allTextContents()
      if (championship === 'super-gt') assert.deepEqual(classes, ['GT500 Leaderboard','GT300 Leaderboard'])
      if (championship === 'wec') assert.deepEqual(classes, ['HYPERCAR Leaderboard','LMGT3 Leaderboard'])
      for (const heading of await page.locator('.broadcast-class-leaderboards .broadcast-leaderboard').all()) {
        assert.equal(await heading.locator('.leaderboard-position').first().textContent(), '1')
      }
      await page.getByRole('button', { name: 'Resume simulation', exact: true }).click()
      console.log(`[motorsport-playtest] ${championship} ${viewport.width}: started`)
      try {
        await page.waitForFunction(() => document.querySelector('.broadcast-phase-label')?.textContent?.includes('FINISHED'), null, { timeout: 60_000 })
      } catch (error) {
        console.log(JSON.stringify({ championship, viewport, errors, text: (await page.locator('body').innerText()).slice(0, 7000) }))
        await page.screenshot({ path: join(artifacts, `motorsport-failure-${championship}-${viewport.width}.png`), fullPage: true })
        throw error
      }
      assert.ok(!(await rows.allTextContents()).every(text => text.includes('retired')), `${championship}: no finishers`)
      const layout = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, width: innerWidth }))
      assert.ok(layout.scrollWidth <= layout.width + 1, `${championship}: horizontal page overflow`)
      await page.screenshot({ path: join(artifacts, `motorsport-${championship}-${viewport.width}.png`), fullPage: true })
      reports.push({ championship, viewport, cars: expected, events: allCourses.length, finished: true, layout })
      if (championship === 'wec') {
        await page.getByRole('button', { name: 'Open setup', exact: true }).click()
        await page.getByRole('combobox', { name: 'Motorsport event', exact: true }).selectOption('wec:3')
        assert.deepEqual(await page.locator('.broadcast-class-leaderboards .broadcast-panel-header > div > strong').allTextContents(), ['HYPERCAR Leaderboard','LMP2 Leaderboard','LMGT3 Leaderboard'])
        assert.equal(await rows.count(), 62)
        const savePromise = page.waitForEvent('download')
        await page.getByRole('button', { name: 'JSON保存', exact: true }).click()
        const savePath = join(artifacts, `motorsport-lemans-${viewport.width}.json`)
        await (await savePromise).saveAs(savePath)
        await page.getByLabel('Import motorsport race', { exact: true }).setInputFiles(savePath)
        assert.equal(await rows.count(), 62)
        await page.getByRole('button', { name: 'Close panel', exact: true }).click()
      }
    }
    await page.getByRole('combobox', { name: 'Racing series', exact: true }).selectOption('super-formula')
    await page.waitForFunction(() => document.querySelector('[aria-label="Racing series"]')?.value === 'super-formula')
    await page.getByRole('combobox', { name: 'Racing series', exact: true }).selectOption('f1-custom')
    await page.getByRole('combobox', { name: 'Racing series', exact: true }).waitFor()
    assert.equal(await page.getByRole('button', {name:'FREE',exact:true}).isEnabled(), true)
    await page.close()
  }
  assert.deepEqual(errors, [])
  console.log(JSON.stringify({ ok: true, reports, errors }, null, 2))
} finally {
  await browser.close()
  await new Promise((resolveClose, rejectClose) => server.httpServer.close(error => error ? rejectClose(error) : resolveClose()))
}
