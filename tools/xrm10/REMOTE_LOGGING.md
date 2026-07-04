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

## Analyze Steering Logs On The Comma

```powershell
scp .\tools\xrm10\analyze_steering_logs.py comma4:/tmp/xrm10_analyze_steering_logs.py
ssh comma4 "cd /data/openpilot && /usr/local/venv/bin/python /tmp/xrm10_analyze_steering_logs.py --segments 6 --prefer rlog --output-dir /data/xrm10_remote_logger/analysis_rlog"
scp comma4:/data/xrm10_remote_logger/analysis_rlog/steering_summary.md .\steering_summary.md
```

Use rlogs for real steering analysis. qlogs are useful for a quick check but may be too sparse.

## What It Collects

- recent `qlog*` and `rlog*` route files
- steering, torque, lateral, lane, angle, `CarParams`, calibration, and XRM10 params
- openpilot branch/commit/status
- process list for `controlsd`, `plannerd`, `paramsd`, `torqued`, `locationd`, `modeld`, `pandad`, and manager
- manager log, journal, dmesg, network, route, and disk metadata

Camera video is disabled by default to keep uploads smaller.

The logger avoids creating duplicate packages when the recent route set has not changed. Pending packages still retry upload even when no new package is created.

## Safety Boundary

This only logs and uploads diagnostics. It does not change steering, braking, throttle, lane changes, or safety parameters.
