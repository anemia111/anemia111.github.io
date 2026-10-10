# F1 Simulator Agent Notes

Read CLAUDE_HANDOFF.md and CLAUDE.md before changing simulation behavior.

## Repository and completion gate

The only active source and deployment repository is anemia111/anemia111.github.io.
Preserve the deterministic engine, circuit/driver data, storage keys and PWA scope.
Run npm ci, npm run lint, npm test, npm run build, npm run playtest and
npm run playtest:pwa before completing a coding batch.
npm run publish is a local verification helper; it does not commit or push.
Commit and push only intended source changes. The Pages workflow tests and publishes
dist from master. Verify the Actions run and production release.json after publishing.
Never copy dist into another checkout or commit generated assets at the root.
Do not use the archived development repository's old deployment script.
