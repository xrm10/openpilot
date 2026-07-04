param(
  [string]$Target = "comma4",
  [string]$KeyPath = "",
  [string]$HttpUrl = "",
  [string]$HttpToken = "",
  [string]$SshDest = "",
  [string]$SshKey = "",
  [int]$Segments = 6,
  [int]$IntervalSeconds = 300,
  [switch]$NoStart
)

$ErrorActionPreference = "Stop"

function Require-Command($Name) {
  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $cmd) {
    throw "$Name is required but was not found on PATH."
  }
}

function Quote-Arg($Value) {
  $text = [string]$Value
  if ($text -notmatch '[\s"]') {
    return $text
  }
  return '"' + $text.Replace('\', '\\').Replace('"', '\"') + '"'
}

function Ssh-Args($Command) {
  $args = @("-o", "BatchMode=yes", "-o", "ConnectTimeout=8")
  if ($KeyPath) {
    $args += @("-i", $KeyPath)
  }
  $args += @($Target, $Command)
  return $args
}

function Run-Ssh($Command, [int]$TimeoutSeconds = 30) {
  $psi = [System.Diagnostics.ProcessStartInfo]::new()
  $psi.FileName = "ssh"
  $psi.Arguments = ((Ssh-Args $Command) | ForEach-Object { Quote-Arg $_ }) -join " "
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.UseShellExecute = $false
  $proc = [System.Diagnostics.Process]::Start($psi)
  if (-not $proc.WaitForExit($TimeoutSeconds * 1000)) {
    try { $proc.Kill() } catch {}
    throw "SSH command timed out for $Target."
  }
  $stdout = $proc.StandardOutput.ReadToEnd()
  $stderr = $proc.StandardError.ReadToEnd()
  if ($proc.ExitCode -ne 0) {
    throw "SSH failed: $stderr"
  }
  return $stdout
}

Require-Command ssh
Require-Command scp

$scriptPath = Join-Path $PSScriptRoot "xrm10_remote_logger.py"
if (-not (Test-Path -LiteralPath $scriptPath)) {
  throw "Missing xrm10_remote_logger.py next to this installer."
}

if ($IntervalSeconds -lt 30) { $IntervalSeconds = 30 }
if ($IntervalSeconds -gt 3600) { $IntervalSeconds = 3600 }
if ($Segments -lt 1) { $Segments = 1 }
if ($Segments -gt 20) { $Segments = 20 }

$remoteDir = "/data/xrm10_remote_logger"
$remoteScript = "$remoteDir/xrm10_remote_logger.py"
$remoteConfig = "$remoteDir/config.json"

$config = [ordered]@{
  enabled = $true
  interval_seconds = $IntervalSeconds
  segments = $Segments
  include_qlog = $true
  include_rlog = $true
  include_camera = $false
  realdata_dir = "/data/media/0/realdata"
  openpilot_dir = "/data/openpilot"
  work_dir = $remoteDir
  http_url = $HttpUrl
  http_token = $HttpToken
  ssh_dest = $SshDest
  ssh_key = $SshKey
  max_spool_packages = 60
  max_sent_packages = 30
}

$configJson = $config | ConvertTo-Json -Depth 8
$configB64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($configJson))

Write-Host "Checking SSH target $Target..."
Run-Ssh "echo ready" 12 | Out-Null

Write-Host "Installing remote logger files..."
Run-Ssh "mkdir -p $remoteDir/spool $remoteDir/sent $remoteDir/state $remoteDir/logs" 20 | Out-Null

$scpArgs = @("-o", "BatchMode=yes")
if ($KeyPath) {
  $scpArgs += @("-i", $KeyPath)
}
$scpArgs += @($scriptPath, "$Target`:/tmp/xrm10_remote_logger.py")
& scp @scpArgs
if ($LASTEXITCODE -ne 0) {
  throw "scp failed with exit code $LASTEXITCODE."
}

Run-Ssh "mv /tmp/xrm10_remote_logger.py $remoteScript; chmod +x $remoteScript" 20 | Out-Null

$writeConfigCommand = "python3 - <<'PY'
import base64
from pathlib import Path
Path('$remoteDir').mkdir(parents=True, exist_ok=True)
Path('$remoteConfig').write_bytes(base64.b64decode('$configB64'))
PY"
Run-Ssh $writeConfigCommand 20 | Out-Null

Write-Host "Running one collection pass..."
Run-Ssh "python3 $remoteScript --once --config $remoteConfig" 180

if (-not $NoStart) {
  Write-Host "Starting background remote logger..."
  $startCommand = "if [ -f $remoteDir/logger.pid ]; then kill `$(cat $remoteDir/logger.pid) 2>/dev/null || true; fi; nohup python3 $remoteScript --daemon --config $remoteConfig >> $remoteDir/logger.log 2>&1 & echo `$! > $remoteDir/logger.pid; sleep 1; cat $remoteDir/logger.pid"
  $pid = Run-Ssh $startCommand 20
  Write-Host "Remote logger started with PID $($pid.Trim())."
}

Write-Host "Remote logger status:"
Run-Ssh "tail -n 30 $remoteDir/logger.log 2>/dev/null || true; ls -lh $remoteDir/spool 2>/dev/null || true; ls -lh $remoteDir/sent 2>/dev/null || true" 20
