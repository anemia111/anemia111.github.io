# Repository consolidation — 2026-10-10

## Baseline and retained history

- Development master: `0ae1525795996f781fa52d313616989d633b26ba`.
- Published master: `ebc5f61e3e676f69da64b3a62d5034dffc0bd1a3`.
- Both repositories were public at migration time.
- The integration commit retains both masters as parents, without rewriting history.
- Historical development branch tips are retained under `archive/development/*`.
- `src`, `public` and `vite.config.ts` remain identical to development master.
- External backups: `source-all.bundle`, `target-all.bundle`, `published-before.zip`,
  Pages/environment settings and the source branch inventory. Both bundles passed
  `git bundle verify`. Keep a copy outside this workstation.
- Original issues, PRs and discussions remain accessible in the retained source repository.

## Publication and browser compatibility

Pages previously served `master:/` in legacy mode. The integrated repository uses
GitHub Actions and publishes only `dist` after lint, tests, build, desktop
Playwright and PWA checks pass. Only master deploys. Feature branches and PRs verify.
Settings > Pages > Source must be GitHub Actions; the github-pages environment
allows master. No deployment PAT or second checkout is required.

Compare production `release.json`'s sourceRevision with the complete pushed SHA.
A successful push alone does not prove publication. Retry a master run through
Actions > Test and deploy Pages > Run workflow if necessary.

The origin, root path, `sw.js` URL, manifest identity/scope/start URL and storage
keys are preserved. New workers activate without forcing an active race to reload;
normal navigation or the next launch loads the new app. Do not clear site data.
OpenF1 LIVE/HIST still needs a network connection.

The PWA harness checks offline reload, online recovery, SW control and storage
survival. To reproduce old-to-new migration, extract the old publication ZIP
outside the source tree, build with VITE_APP_RELEASE_ID set, then run
`npm run playtest:pwa` with LEGACY_PWA_DIR pointing to the extracted files and
the same VITE_APP_RELEASE_ID. Tests use an isolated browser profile. Existing
persistence regression suites cover the real save schemas. Git cannot back up
users' browser profiles; export valuable saves from the app where supported.

Do not execute pre-migration checkouts' publish-web-app.ps1: historical versions
replace the target working tree. The source master receives a retirement guard
after the new deployment is verified. Old branches and local checkouts can still
contain the old script. All new work belongs in this unified repository.

## Public-source review and known dependency advisories

Gitleaks 8.30.1 scanned all fetched history before publication: 288 development
commits and 163 deployment commits. Development had three false positives:
maximumBrakeDecelerationMps2 and two localStorage keys. Deployment had none.
No credentials were found. Tracked-file inspection found no env credentials,
private keys or browser profiles. OpenF1 credentials remain in memory only.
This is a scoped publication check, not a full security audit.

The existing lockfile has 10 npm audit advisories (6 high, 4 moderate);
production-only audit has one moderate transitive advisory. Dependencies remain
unchanged for migration reproducibility. Handle upgrades in a separate maintenance
change and rerun the engine and browser regression checks.

## Recovery without rewriting history

1. Before cutover, failed checks leave legacy Pages and master unchanged.
2. After cutover, failed Actions builds leave the last successful Pages deployment live.
3. Source can be reverted on a recovery branch using git revert -m 1 followed by
   the integration commit SHA. A full revert also removes the Actions workflow.
4. For exact legacy recovery, create recovery/legacy-pages from
   ebc5f61e3e676f69da64b3a62d5034dffc0bd1a3. Select Settings > Pages > Deploy
   from a branch > recovery/legacy-pages > /(root). Permit that branch in the
   github-pages environment if required. This restores the original artifacts
   without changing master history. The ZIP also retains those artifacts.
5. To recover locally, clone target-all.bundle into a new directory. For source
   history, fetch refs/remotes/origin/* from source-all.bundle explicitly.
6. After repairs pass, return Source to GitHub Actions, run the workflow on
   master and verify release.json and offline operation again.
