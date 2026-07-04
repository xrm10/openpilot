param(
  [string]$Target = "comma4",
  [string]$KeyPath = "",
  [int]$Segments = 6,
  [string]$OutputRoot = "C:\Users\Hp\Documents\Codex\2026-06-20\logs\steering"
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

function Run-Ssh($Command, [int]$TimeoutSeconds = 30) {
  $sshArgs = @("-o", "BatchMode=yes", "-o", "ConnectTimeout=8")
  if ($KeyPath) {
    $sshArgs += @("-i", $KeyPath)
  }
  $sshArgs += @($Target, $Command)

  $psi = [System.Diagnostics.ProcessStartInfo]::new()
  $psi.FileName = "ssh"
  $psi.Arguments = ($sshArgs | ForEach-Object { Quote-Arg $_ }) -join " "
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

if ($Segments -lt 1) { $Segments = 1 }
if ($Segments -gt 20) { $Segments = 20 }

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$localDir = Join-Path $OutputRoot "xrm10-steering-$stamp"
New-Item -ItemType Directory -Force -Path $localDir | Out-Null

$remoteScript = @'
set -eu
segments="__SEGMENTS__"
tmp="/tmp/xrm10_steering_collect"
archive="/tmp/xrm10_steering_collect.tgz"
rm -rf "$tmp" "$archive"
mkdir -p "$tmp/metadata" "$tmp/params" "$tmp/routes"

{
  echo "generated_at=\$(date -Iseconds 2>/dev/null || date)"
  echo "hostname=\$(hostname 2>/dev/null || true)"
  echo "uname=\$(uname -a 2>/dev/null || true)"
  echo "uptime=\$(uptime 2>/dev/null || true)"
  echo "disk="
  df -h /data 2>/dev/null || true
  echo "openpilot_git="
  cd /data/openpilot 2>/dev/null && {
    git rev-parse --abbrev-ref HEAD 2>/dev/null || true
    git rev-parse HEAD 2>/dev/null || true
    git status --short 2>/dev/null || true
  }
} > "$tmp/metadata/device.txt"

{
  echo "processes="
  ps -ef 2>/dev/null | grep -Ei "controlsd|plannerd|paramsd|torqued|locationd|modeld|manager|pandad" | grep -v grep || true
  echo
  echo "manager logs="
  tail -n 600 /tmp/manager.log 2>/dev/null || true
  echo
  echo "journal="
  journalctl --no-pager -n 800 2>/dev/null || true
  echo
  echo "dmesg="
  dmesg | tail -n 300 2>/dev/null || true
} > "$tmp/metadata/process_logs.txt"

{
  echo "recent routes="
  find /data/media/0/realdata -maxdepth 1 -type d -name "*--*" -printf "%T@ %p\n" 2>/dev/null | sort -nr | head -n "$segments" || true
} > "$tmp/metadata/recent_routes.txt"

if [ -d /data/params/d ]; then
  find /data/params/d -maxdepth 1 -type f 2>/dev/null | while read -r p; do
    name="\$(basename "$p")"
    case "$name" in
      *Steer*|*steer*|*Torque*|*torque*|*Lateral*|*lateral*|*Lane*|*lane*|*Angle*|*angle*|*Live*|*live*|*CarParams*|*Calibration*|*ControlsReady*|*Experimental*|*Xrm10*)
        cp -p "$p" "$tmp/params/$name" 2>/dev/null || true
        ;;
    esac
  done
fi

cd /data/media/0/realdata 2>/dev/null && {
  find . -maxdepth 1 -type d -name "*--*" -printf "%T@ %f\n" 2>/dev/null | sort -nr | head -n "$segments" | while read -r _ route; do
    mkdir -p "$tmp/routes/$route"
    for f in "$route"/qlog* "$route"/rlog* "$route"/qlog.bz2 "$route"/rlog.bz2; do
      [ -e "$f" ] && cp -p "$f" "$tmp/routes/$route/" 2>/dev/null || true
    done
  done
}

tar -C "$tmp" -czf "$archive" .
ls -lh "$archive"
'@

$remoteScript = $remoteScript.Replace("__SEGMENTS__", [string]$Segments)

$scriptPath = Join-Path $localDir "remote_collect.sh"
Set-Content -LiteralPath $scriptPath -Value $remoteScript -Encoding ASCII

Write-Host "Checking SSH target $Target..."
Run-Ssh "echo ready" 12 | Out-Null

Write-Host "Collecting steering logs on $Target..."
$remoteOut = Run-Ssh $remoteScript 120
Set-Content -LiteralPath (Join-Path $localDir "remote_output.txt") -Value $remoteOut -Encoding UTF8

$scpArgs = @("-o", "BatchMode=yes")
if ($KeyPath) {
  $scpArgs += @("-i", $KeyPath)
}
$scpArgs += @("$Target`:/tmp/xrm10_steering_collect.tgz", (Join-Path $localDir "xrm10_steering_collect.tgz"))

Write-Host "Copying archive to $localDir..."
& scp @scpArgs
if ($LASTEXITCODE -ne 0) {
  throw "scp failed with exit code $LASTEXITCODE."
}

Run-Ssh "rm -f /tmp/xrm10_steering_collect.tgz; rm -rf /tmp/xrm10_steering_collect" 20 | Out-Null

Write-Host "Steering log package ready:"
Write-Host (Join-Path $localDir "xrm10_steering_collect.tgz")
