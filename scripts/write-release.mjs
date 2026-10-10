import { writeFile } from 'node:fs/promises'
const revision = process.env.GITHUB_SHA
if (!revision) throw new Error('GITHUB_SHA is required for a published release')
await writeFile('dist/release.json', JSON.stringify({
  releaseId: revision,
  sourceRevision: revision,
  publishedAt: new Date().toISOString(),
}, null, 2) + '\n')
await writeFile('dist/.nojekyll', '')
