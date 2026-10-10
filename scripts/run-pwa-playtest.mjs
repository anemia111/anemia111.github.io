import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { chromium } from 'playwright'

const currentRoot = resolve('dist')
let servedRoot = process.env.LEGACY_PWA_DIR ? resolve(process.env.LEGACY_PWA_DIR) : currentRoot
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml' }
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const file = resolve(servedRoot, '.' + (path === '/' ? '/index.html' : path))
    if (!file.startsWith(servedRoot + sep)) { res.writeHead(403).end(); return }
    const body = await readFile(file)
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' })
    res.end(body)
  } catch { res.writeHead(404).end() }
})
await new Promise(done => server.listen(0, '127.0.0.1', done))
const url = `http://127.0.0.1:${server.address().port}/`
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(url)
  await page.waitForSelector('canvas', { timeout: 60_000 })
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.waitForFunction(() => !!navigator.serviceWorker.controller)
  const manifest = await page.evaluate(async () => {
    const href = document.querySelector('link[rel="manifest"]').href
    return (await fetch(href)).json()
  })
  assert.equal(manifest.id, './')
  assert.equal(manifest.scope, './')
  assert.equal(manifest.start_url, './')
  await page.evaluate(() => localStorage.setItem('migration-compatibility-probe', 'preserved'))
  const oldScript = await page.evaluate(() => navigator.serviceWorker.controller.scriptURL)
  const savedBeforeUpdate = await page.evaluate(() => ({ ...localStorage }))
  let unexpectedNavigations = 0
  const trackNavigation = frame => { if (frame === page.mainFrame()) unexpectedNavigations += 1 }
  if (servedRoot !== currentRoot) {
    page.on('framenavigated', trackNavigation)
    servedRoot = currentRoot
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready
      await new Promise((done, reject) => {
        const timer = setTimeout(() => reject(new Error('SW update timed out')), 60_000)
        navigator.serviceWorker.addEventListener('controllerchange', () => { clearTimeout(timer); done() }, { once: true })
        registration.update().catch(error => { clearTimeout(timer); reject(error) })
      })
    })
    assert.equal(await page.evaluate(() => navigator.serviceWorker.controller.scriptURL), oldScript)
    assert.deepEqual(await page.evaluate(() => ({ ...localStorage })), savedBeforeUpdate)
    assert.equal(unexpectedNavigations, 0, 'SW activation must not reload an active app')
    page.off('framenavigated', trackNavigation)
    assert.equal(await page.evaluate(() => localStorage.getItem('migration-compatibility-probe')), 'preserved')
    await page.reload()
    await page.waitForSelector('canvas', { timeout: 60_000 })
    assert.equal(await page.evaluate(() => document.documentElement.dataset.releaseId), process.env.VITE_APP_RELEASE_ID)
    console.log('Existing published SW upgraded on the same origin; storage and SW URL preserved.')
  }
  // A controlled page and completed installation mean the app shell has been cached.
  await context.setOffline(true)
  await page.reload()
  await page.waitForSelector('canvas', { timeout: 60_000 })
  assert.equal(await page.evaluate(() => localStorage.getItem('migration-compatibility-probe')), 'preserved')
  assert.ok(await page.evaluate(async () => (await caches.keys()).length > 0))
  await context.setOffline(false)
  await page.reload()
  await page.waitForSelector('canvas', { timeout: 60_000 })
  console.log('PWA manifest, SW control, offline reload, online recovery and storage preservation passed.')
  await context.close()
} finally {
  await browser.close()
  await new Promise(done => server.close(done))
}
