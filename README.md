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
- Controller preferences for lateral mode, MADS, lane-change mode, and speed
  assist.
- Advanced controller preferences for longitudinal behavior, lane centering,
  curve-speed handling, lead-car behavior, road-edge guarding, driver prompts,
  review logging, and device thermal guarding.
- Bounded comfort tuning for follow gap, speed offset cap, lane-change delay,
  curve comfort, steering smoothness, lane bias, braking comfort, prompt lead
  time, and model confidence gate.
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
