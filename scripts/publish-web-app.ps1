param()
$ErrorActionPreference = 'Stop'
$sourceRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Push-Location $sourceRoot
try {
  foreach ($command in @('lint', 'test', 'build', 'playtest', 'playtest:pwa')) {
    & npm.cmd run $command
    if ($LASTEXITCODE -ne 0) { throw "Verification failed: $command" }
  }
  Write-Output 'Verified. Commit the intended changes and push this repository to origin/master.'
  Write-Output 'GitHub Actions builds and deploys https://anemia111.github.io/ after all checks pass.'
} finally { Pop-Location }
