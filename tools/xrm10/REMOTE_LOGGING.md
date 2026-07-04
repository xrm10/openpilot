# XRM10 Remote Steering Logging

This logging path is designed for network changes. The comma records packages locally first, then uploads whatever is pending when a network path becomes available.

## What This Fixes

- The laptop and comma do not need to stay on the same Wi-Fi forever.
- Phone hotspot to home Wi-Fi switching does not delete logs.
- If upload fails, packages stay under `/data/xrm10_remote_logger/spool`.
- When the comma reaches the upload URL or SSH destination again, the logger sends the backlog.

Direct SSH by LAN IP still requires the laptop and comma to be on the same network. Cross-network logging needs one reachable upload target:

- an HTTP bridge URL such as `https://your-public-tunnel/api/xrm10/steering-log-upload`
- or an SSH destination such as `user@server:/path/to/logs`

## Install When The Comma Is Reachable

From `openpilot-xrm10-dev`:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\xrm10\install_remote_logger.ps1 `
  -Target comma4 `
  -HttpUrl "https://YOUR-REACHABLE-BRIDGE/api/xrm10/steering-log-upload" `
  -Segments 6 `
  -IntervalSeconds 300
```

For local same-network testing, the bridge URL can be:

```text
http://192.168.43.129:8787/api/xrm10/steering-log-upload
```

For true different-network logging, expose the bridge through a stable tunnel or use a remote server. Without that, devices on separate private Wi-Fi networks cannot reach each other directly.

## SSH Destination Alternative

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\xrm10\install_remote_logger.ps1 `
  -Target comma4 `
  -SshDest "user@server:/home/user/xrm10-logs" `
  -SshKey "/data/xrm10_remote_logger/upload_key" `
  -Segments 6 `
  -IntervalSeconds 300
```

## Check Status

```powershell
ssh comma4 "tail -n 60 /data/xrm10_remote_logger/logger.log; ls -lh /data/xrm10_remote_logger/spool /data/xrm10_remote_logger/sent"
```

## What It Collects

- recent `qlog*` and `rlog*` route files
- steering, torque, lateral, lane, angle, `CarParams`, calibration, and XRM10 params
- openpilot branch/commit/status
- process list for `controlsd`, `plannerd`, `paramsd`, `torqued`, `locationd`, `modeld`, `pandad`, and manager
- manager log, journal, dmesg, network, route, and disk metadata

Camera video is disabled by default to keep uploads smaller.

## Safety Boundary

This only logs and uploads diagnostics. It does not change steering, braking, throttle, lane changes, or safety parameters.
