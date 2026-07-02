# XRM10 Control Center

XRM10 Control Center is a standalone local dashboard for managing guarded
profiles for the `xrm10/openpilot` sunnypilot dev branch.

Open:

```text
tools/xrm10_control_center/index.html
```

## What it controls

- Tesla Model 3/Model Y HW4 profile metadata.
- comma four install target selection.
- Sectioned settings for Device, Toggles, Models, Steering, Cruise, Visuals,
  Display, Maps, Vehicle, Software, Safety Lab, Developer, and Migration
  Wizard.
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
- Safety Lab test-plan export with readiness score, checklist, lab controls,
  and the staged testing manual.
- JSON import/export for profile review.

## What it does not control

This app does not edit panda safety, driver monitoring, excessive actuation
checks, or on-device params directly. Safety-critical limits are locked in the
profile and are shown as read-only policy.

Safety Lab controls are simulation/offroad review controls. They do not unlock
live vehicle safety limits from the phone app.

The exported JSON is a review artifact. Wiring it into on-device params requires
a separate reviewed implementation and tests.

## Safety Lab workflow

1. Design review: choose conservative lab defaults and export the test plan.
2. Replay logs: run scenario review before any physical test.
3. Bench/offroad: verify alerts, manual override, disengage latency, driver
   monitoring, and actuation caps.
4. Closed-course: use a driver, spotter, low speed cap, and controlled area.
5. Road review gate: only after previous stages pass and the exported plan is
   reviewed.

## Active installer target

```text
https://installer.comma.ai/xrm10/dev
```
