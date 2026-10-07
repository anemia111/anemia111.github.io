import { chromium } from 'playwright'
import { preview } from 'vite'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import assert from 'node:assert/strict'

const server=await preview({root:fileURLToPath(new URL('..',import.meta.url)),logLevel:'error',preview:{host:'127.0.0.1',port:0}})
const browser=await chromium.launch({headless:true})
try {
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[]
  page.on('pageerror',error=>errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/`)
  await page.getByRole('combobox',{name:'Racing series',exact:true}).selectOption('super-formula')
  await page.getByRole('button',{name:'PIT WALL',exact:true}).click()
  await page.getByRole('tab',{name:'CAR SYSTEMS',exact:true}).click()
  const text=await page.locator('.pit-wall-panel').textContent()
  assert.match(text,/200\.0s/)
  assert.match(text,/WAIT 0\.0s/)
  const directory=process.env.QA_ARTIFACT_DIR || join(tmpdir(),'f1-simulator-qa')
  await mkdir(directory,{recursive:true})
  await page.screenshot({path:join(directory,'sf-ots-1280.png'),fullPage:true})
  assert.deepEqual(errors,[])
  console.log(JSON.stringify({superFormulaOts:true,allocationSeconds:200,waitSeconds:0,errors}))
} finally {await browser.close();await new Promise(resolve=>server.httpServer.close(resolve))}
