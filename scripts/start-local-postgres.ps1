param(
    [int]$Port = 55432,
    [string]$Database = "iles"
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$runtimeDir = Join-Path $repoRoot "runtime"
$dataDir = Join-Path $runtimeDir "postgres-data"
$logFile = Join-Path $runtimeDir "postgres.log"
$pgBin = if ($env:POSTGRES_BIN) { $env:POSTGRES_BIN } else { "C:\Program Files\PostgreSQL\14\bin" }

$initdb = Join-Path $pgBin "initdb.exe"
$pgCtl = Join-Path $pgBin "pg_ctl.exe"
$createdb = Join-Path $pgBin "createdb.exe"
$psql = Join-Path $pgBin "psql.exe"

foreach ($tool in @($initdb, $pgCtl, $createdb, $psql)) {
    if (-not (Test-Path $tool)) {
        throw "PostgreSQL tool not found: $tool"
    }
}

New-Item -ItemType Directory -Force $runtimeDir | Out-Null

if (-not (Test-Path $dataDir)) {
    & $initdb -D $dataDir -U postgres --auth=trust
}

$null = & $pgCtl -D $dataDir status 2>&1
$serverRunning = $LASTEXITCODE -eq 0
if (-not $serverRunning) {
    & $pgCtl -D $dataDir -w -t 30 -o "-p $Port -h 127.0.0.1" -l $logFile start
}

$exists = & $psql -h 127.0.0.1 -p $Port -U postgres -d postgres -tAc "select 1 from pg_database where datname = '$Database';"
$existsText = if ($null -eq $exists) { "" } else { ($exists | Out-String).Trim() }
if ($existsText -ne "1") {
    & $createdb -h 127.0.0.1 -p $Port -U postgres $Database
}

Write-Host "PostgreSQL is ready on 127.0.0.1:$Port, database '$Database'."
Write-Host "Use: `$env:POSTGRES_PORT='$Port'; `$env:POSTGRES_DB='$Database'; `$env:POSTGRES_USER='postgres'; `$env:POSTGRES_PASSWORD=''"
