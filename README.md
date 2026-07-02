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
  Display, Maps, Vehicle, Software, Developer, and Migration Wizard.
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
- JSON import/export for profile review.

## What it does not control

This app does not edit panda safety, driver monitoring, excessive actuation
checks, or on-device params directly. Safety-critical limits are locked in the
profile and are shown as read-only policy.

The exported JSON is a review artifact. Wiring it into on-device params requires
a separate reviewed implementation and tests.

## Active installer target

```text
https://installer.comma.ai/xrm10/dev
```
