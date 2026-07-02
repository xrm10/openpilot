# XRM10 Control Center

XRM10 Control Center is a standalone local dashboard for managing guarded
profiles for the `xrm10/openpilot` sunnypilot dev branch.

Open:

```text
tools/xrm10_control_center/index.html
```

## What it controls

- A realistic Home dashboard with device status, search, offline sync state,
  version, branch, commit, and category tiles.
- Live sync status for online/offline device state, last seen time, pending
  changes, demo bridge testing, and an HTTP bridge mode for a future device
  service.
- A top live stats bar with connection state, Offroad/Inroad state, last seen
  time, pending changes, and road-state controls.
- Tesla Model 3/Model Y HW4 profile metadata.
- comma four install target selection.
- Sectioned settings for Device, Toggles, Models, Steering, Cruise, Visuals,
  Display, Maps, Nav Pilot, Vehicle, Software, Safety Lab, Developer, and
  Migration Wizard.
- Controller preferences for lateral mode, MADS, lane-change mode, speed
  assist, steering guardrails, cruise behavior, model policy, map guidance,
  display behavior, and developer review logging.
- Advanced preferences for longitudinal behavior, lane centering, curve-speed
  handling, lead-car behavior, road-edge guarding, driver prompts, model
  fallback behavior, route assist, thermal guarding, and migration backup slots.
- Bounded comfort tuning for follow gap, speed offset cap, lane-change delay,
  curve comfort, steering smoothness, lane bias, braking comfort, prompt lead
  time, model confidence gate, actuator delay, stop-resume delay, turn speed
  margin, screen brightness, map brightness, and route preview distance.
- Upgrade and rollback installer URLs.
- Safety Lab profiles for simulation, replay, bench/offroad, and closed-course
  review before any real-car test.
- Nav Pilot Lab profiles for map-camera route intent, highway exits, highway
  merges, route lane selection, U-turn review, roundabout review, and surface
  street turns.
- Safety Lab test-plan export with readiness score, checklist, lab controls,
  and the staged testing manual.
- Nav Pilot plan export with maneuver confidence score, confidence gates,
  driver-confirm policy, and map-camera agreement requirements.
- JSON import/export for profile review.
- Queued parameter sync: changes made offline are stored locally and sent when
  the device bridge reports online.

## What it does not control

This app does not edit panda safety, driver monitoring, excessive actuation
checks, or on-device params directly. Safety-critical limits are locked in the
profile and are shown as read-only policy.

Safety Lab controls are simulation/offroad review controls. They do not unlock
live vehicle safety limits from the phone app.

Nav Pilot controls are planning and simulation controls. They do not enable live
automated driving from the phone app.

The exported JSON and live sync payloads are review/profile artifacts. Wiring
them into on-device params requires a separate reviewed implementation and
tests.

## Live sync bridge

The app supports three connection modes in Device > Live sync:

- Demo bridge: local simulation for testing online/offline UI and queue sync.
- HTTP bridge: calls a device-side bridge service.
- Manual offline: never attempts network sync.

Run the included local bridge:

```text
node tools/xrm10_control_center/bridge_server.js --host=0.0.0.0 --port=8787
```

Then open the app from your phone on the same network:

```text
http://YOUR-LAPTOP-IP:8787/
```

In HTTP bridge mode, leaving Bridge URL empty uses the same origin that served
the app. For a separate device bridge, enter its URL.

HTTP bridge contract:

```text
GET  /api/xrm10/status
POST /api/xrm10/profile
POST /api/xrm10/road-state
```

`GET /api/xrm10/status` should return JSON:

```json
{
  "online": true,
  "device": {
    "name": "comma four",
    "id": "6dea66ada857421f",
    "version": "2026.07.02-xrm10",
    "branch": "dev",
    "commit": "344ec6a",
    "offroad": true
  }
}
```

`POST /api/xrm10/profile` receives a profile sync payload with `changes`,
`profile`, and `policy`. The bridge should reject safety-critical changes unless
the device is offroad and the on-device implementation has reviewed support for
those parameters.

`POST /api/xrm10/road-state` receives:

```json
{
  "requestedState": "onroad",
  "offroad": false,
  "source": "xrm10-control-center",
  "policy": {
    "driverControlRequired": true,
    "bridgeMayRejectUnsafeOnroad": true,
    "liveVehicleApplyAllowed": false
  }
}
```

The included bridge updates the demo device state immediately. A real comma-side
bridge should reject unsafe Onroad/Inroad requests unless the device and vehicle
state make that transition valid.

## Safety Lab workflow

1. Design review: choose conservative lab defaults and export the test plan.
2. Replay logs: run scenario review before any physical test.
3. Bench/offroad: verify alerts, manual override, disengage latency, driver
   monitoring, and actuation caps.
4. Closed-course: use a driver, spotter, low speed cap, and controlled area.
5. Road review gate: only after previous stages pass and the exported plan is
   reviewed.

## Nav Pilot workflow

1. Map intent: route instruction must be stable before approaching a maneuver.
2. Camera agreement: lane lines, road edge, signs, arrows, and drivable path
   must agree with the route.
3. Driver confirmation: lane-route actions require signal, nudge, or explicit
   confirmation.
4. Special maneuvers: U-turns and roundabouts stay closed-course or prompt-only
   until separately validated.
5. Fallback: blind spots, low confidence, missing lanes, unclear yield
   conditions, or missing confirmation block the maneuver.

## Active installer target

```text
https://installer.comma.ai/xrm10/dev
```
