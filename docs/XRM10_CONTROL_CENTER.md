# XRM10 Control Center

The XRM10 Control Center is a standalone app for guarded branch and profile
management:

```text
tools/xrm10_control_center/index.html
```

It is designed for development workflow, not direct vehicle actuation.

## Capabilities

- Use a realistic Home dashboard with device status, search, offline sync state,
  version, branch, commit, and category tiles.
- Track online/offline device state, last seen time, pending profile changes,
  demo bridge status, and HTTP bridge sync status.
- Use the top live stats bar to see connection, Offroad/Inroad state, last seen
  time, pending changes, and road-state controls.
- Use a sunnypilot-style section sidebar with Device, Toggles, Models,
  Steering, Cruise, Visuals, Display, Maps, Nav Pilot, Vehicle, Software,
  Safety Lab, Developer, and Migration Wizard views.
- Keep Safety Lab in the same app for simulation, replay, bench/offroad, and
  closed-course review before any real-car test.
- Keep Nav Pilot Lab in the same app for map-camera route intent, highway
  exits, highway merges, route lane selection, U-turn review, roundabout review,
  and surface street turn planning.
- Select an install target for upgrade or rollback.
- Copy the current installer URL.
- Configure bounded core controller preferences.
- Configure advanced controller modules for longitudinal behavior, lane
  centering, curve-speed handling, lead-car behavior, road-edge guarding,
  prompting, model fallback behavior, display behavior, maps, review logging,
  and device thermal guarding.
- Tune bounded comfort values for follow gap, speed offset cap, lane-change
  delay, curve comfort, steering smoothness, lane bias, braking comfort,
  prompt lead time, model confidence gate, actuator delay, stop-resume delay,
  turn speed margin, screen brightness, map brightness, and route preview
  distance.
- Export and import reviewable JSON profiles.
- Queue parameter changes while offline and sync them when the device bridge is
  online.
- Save any section and check whether the bridge reports it as applied/working.
- Configure Traffic/LWC review controls for faster-lane suggestions, traffic
  gaps, adjacent-traffic buffers, and lane width control with driver-confirm
  gates.
- Export Safety Lab test plans with readiness checks, lab controls, and manual
  review steps.
- Export Nav Pilot plans with maneuver confidence checks, map-camera agreement
  requirements, driver-confirm policy, and fallback gates.
- Show locked safety policies that must not be bypassed.

## Live Sync

The Device > Live sync panel has three modes:

- Demo bridge: local online/offline simulation for testing the app.
- HTTP bridge: device-side service used by the app for live profile sync.
- Manual offline: disables network sync and keeps changes queued locally.

Run the included local bridge:

```text
node tools/xrm10_control_center/bridge_server.js --host=0.0.0.0 --port=8787
```

Then open the app from a phone on the same network:

```text
http://YOUR-LAPTOP-IP:8787/
```

When HTTP bridge mode is selected and Bridge URL is empty, the app uses the same
origin that served the page. For a separate comma-side bridge, enter that bridge
URL explicitly.

Expected HTTP endpoints:

```text
GET  /api/xrm10/status
POST /api/xrm10/profile
POST /api/xrm10/road-state
POST /api/xrm10/section-apply
GET  /api/xrm10/section-status?section=device
POST /api/xrm10/ssh-status
```

`GET /api/xrm10/status` should return whether the device is reachable plus
device metadata such as name, ID, version, branch, commit, and offroad state.
`POST /api/xrm10/profile` receives the full profile, changed parameters, and a
policy block. The payload always marks `liveVehicleApplyAllowed` as `false`; the
bridge must treat safety-critical changes as offroad review unless separate
on-device code and tests explicitly support them.

`POST /api/xrm10/road-state` receives a requested road state:

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

The local bridge updates demo state immediately. A real comma-side bridge should
reject unsafe Onroad/Inroad requests when the vehicle/device state does not make
the transition valid.

`POST /api/xrm10/section-apply` receives one section plus the current profile
and returns whether that section is staged and working. `GET
/api/xrm10/section-status` checks the last known result.

`POST /api/xrm10/ssh-status` receives `target` and `keyPath`. The local bridge
uses OpenSSH for a short status command. A real target and valid key path are
required; private key contents are never exposed by the app.

## Safety Boundary

The app intentionally does not expose switches that disable driver monitoring,
weaken excessive actuation checks, modify panda safety, or make manual override
harder. Any future bridge from exported profiles to live device params must
preserve those limits and add tests before install use.

Safety Lab controls represent simulation/offroad review values. They are not a
live-car safety bypass and must not be wired into real vehicle behavior without
separate reviewed code, bench tests, closed-course tests, and safety validation.

Nav Pilot controls represent planning and simulation values. They are not live
automated-driving enablement and must not be wired into real steering, exits,
roundabouts, or U-turn behavior without separate reviewed code, simulator
coverage, bench tests, closed-course tests, and safety validation.

Traffic/LWC controls represent suggestions and driver-confirmed planning. They
do not enable unconfirmed automatic lane changes between cars or autonomous
lane weaving to reach a faster lane.

## Safety Lab manual

1. Design review: choose conservative lab defaults, keep live safety policy
   locked, and export the JSON test plan.
2. Replay logs: run the selected scenario set against saved routes or synthetic
   logs. Any warning blocks progression.
3. Bench/offroad: verify alerts, manual override, disengage latency, driver
   monitoring, and actuator caps without public-road risk.
4. Closed-course: use a driver, spotter, low speed cap, and an empty controlled
   area. Brake, cancel, and steering takeover must pass every time.
5. Road review gate: only after all previous stages pass and the exported plan
   is reviewed. Do not weaken panda safety, driver monitoring, or override
   behavior.

## Nav Pilot manual

1. Map intent: route instruction must be stable before the vehicle approaches a
   maneuver.
2. Camera agreement: lane lines, road edge, signs, arrows, and drivable path
   must agree with the route.
3. Driver confirmation: lane-route actions require signal, nudge, or explicit
   confirmation.
4. Special maneuvers: U-turns and roundabouts stay closed-course or prompt-only
   until separately validated.
5. Fallback: any blind spot, low confidence, missing lane, unclear yield
   condition, or missing confirmation blocks the maneuver and asks the driver to
   take over.

## Current install URL

```text
https://installer.comma.ai/xrm10/dev
```
