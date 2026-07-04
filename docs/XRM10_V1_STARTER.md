# XRM10 v1 Starter

XRM10 v1 starter is the first organized development package for the xrm10 openpilot/sunnypilot fork.

It is an XRM10 development release for Tesla Model 3 HW4 research and control-center tooling. It is not an official comma.ai, openpilot, or sunnypilot product release.

## Included

- XRM10 Control Center phone app and bridge.
- Network-resilient remote steering logger.
- Steering log collector and analyzer tools.
- Car-screen route intent bridge.
- Navigation destination entry in the app.
- Nav Drive Plan simulator and replay event logging.
- Save/check section flow for app settings.
- Safety-locked advisory controls for traffic, lane suggestions, signs, traffic lights, roundabouts, sidewalks, curbs, and road bumps.

## Install Targets

- App/bridge branch: `gh-pages`
- Device development branch: `dev`
- Primary repo: `https://github.com/xrm10/openpilot`

## First Start

Start the local bridge from `openpilot-xrm10-pages`:

```powershell
node bridge_server.js --host=0.0.0.0 --port=8787
```

Open the phone app while the phone is on the same network as the laptop:

```text
http://<laptop-ip>:8787/
```

Install remote logger on the comma once SSH is reachable:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\xrm10\install_remote_logger.ps1 -Target comma4 -HttpUrl "http://<laptop-ip>:8787/api/xrm10/steering-log-upload"
```

For different-network logging, replace the local URL with a reachable tunnel, VPS, or other public/private relay URL.

## Steering Improvement Workflow

1. Collect remote steering packages.
2. Run rlog analysis with `tools/xrm10/analyze_steering_logs.py`.
3. Confirm active lateral samples exist.
4. Identify steering override, saturation, live parameter validity, lateral delay, and alerts.
5. Make scoped code changes only after logs justify them.
6. Verify by replay/simulation before any physical test.

## Safety Boundary

The v1 starter app and logger do not command live steering, braking, throttle, or lane changes from the phone app.

Route, traffic, sign, light, roundabout, sidewalk, and speed-bump features are advisory, simulation, logging, or closed-course review tooling unless a future on-device implementation is separately built and validated.

Driver monitoring, manual override, panda safety, and excessive actuation checks remain locked.

## Current v1 Starter Status

- Remote logger: running on comma after install.
- Bridge upload endpoint: accepts steering log packages.
- Steering analyzer: available for qlog/rlog summaries.
- Current limitation: steering tuning requires active lateral-control driving logs; parked/offroad logs are not enough.
