# XRM10 lane-assist testing plan

This branch is based on `sunnypilot/dev` and targets Tesla Model 3 HW4
2024-2025 on comma four. Lane-assist development must stay safety-first:
improve prompts, observability, and validation before changing lateral control
behavior.

## Current XRM10 prompt changes

The first lane-assist update changes driver-facing wording only:

- Pre-lane-change left: `Nudge Left to Confirm`
- Pre-lane-change right: `Nudge Right to Confirm`
- Lane-change subtitle: `Check mirrors and blind spot`
- Blind-spot block: `Blind Spot Detected`
- Lateral limit: `Take Control` / `Lane assist at limit`

These prompts do not change steering torque, lane-change timing, blind-spot
logic, driver monitoring, or panda safety limits.

## Test gates

### Gate 1: static and unit tests

Run before every push:

```powershell
python -m pytest selfdrive/selfdrived/tests/test_xrm10_lane_prompts.py
python -m pytest selfdrive/selfdrived/tests/test_alerts.py
python -m pytest sunnypilot/selfdrive/controls/lib/tests/test_auto_lane_change.py
python -m pytest sunnypilot/selfdrive/controls/lib/tests/test_lane_turn_desire.py
```

Pass criteria:

- XRM10 lane prompts match the expected wording.
- Alert text stays within UI width limits.
- Auto lane-change behavior does not change unexpectedly.
- Lane-turn desire behavior does not regress.

### Gate 2: replay and process checks

Run replay/process checks before any install candidate:

```powershell
python -m pytest selfdrive/test/process_replay
```

Pass criteria:

- No new process replay failures.
- No mismatches in `selfdriveState`, `carControl`, `lateralPlan`, or
  `lateralManeuverPlan` caused by prompt-only changes.
- No new alert spam during normal lane keeping.

### Gate 3: bench install

Install on the comma four while parked, with the car off or stationary where
appropriate.

Checklist:

- Device boots into `xrm10/dev`.
- Branch page resolves: `https://github.com/xrm10/openpilot/tree/dev`.
- Installer URL resolves: `https://installer.comma.ai/xrm10/dev`.
- Driver monitoring is enabled.
- Dashcam/no-control behavior is unchanged for unsupported or unrecognized
  states.
- Tesla cooperative steering beta remains a deliberate user setting, not a
  default force-on.

### Gate 4: closed-course or low-risk validation

Use only a safe legal environment with an attentive driver ready to take over.

Scenarios:

- Clear lane, no blinker: lane centering remains stable.
- Left blinker, nudge required: prompt says `Nudge Left to Confirm`.
- Right blinker, nudge required: prompt says `Nudge Right to Confirm`.
- Blind spot present: lane-change prompt is blocked with
  `Blind Spot Detected`.
- High-curvature or lateral limit: prompt escalates to `Take Control`.
- Brake press: lane-change automation does not continue.
- Steering override: driver can immediately retake lateral control.

Pass criteria:

- Driver can override immediately.
- No unexpected lane-change initiation.
- No prompt appears late for blind-spot or lateral-limit cases.
- No oscillation, hunting, or repeated steering saturation.
- No safety or driver-monitoring bypass.

## Advanced lane-assist backlog

Do not implement these until Gates 1-3 pass reliably:

1. Add lane-assist debug counters for prompt frequency and lane-change blocked
   reasons.
2. Add replay assertions for pre-lane-change and blind-spot prompt timing.
3. Add Tesla HW4 route notes for camera visibility, calibration, and map/no-map
   lane behavior.
4. Tune prompt thresholds only if logs show false positives or late prompts.
5. Consider lateral controller tuning only after replay evidence shows a real
   Tesla HW4 issue and the safety envelope is unchanged.

## Hard limits

Do not merge changes that:

- Disable or weaken driver monitoring.
- Disable or weaken excessive actuation checks.
- Loosen panda safety limits.
- Force auto lane change without a clear setting and test coverage.
- Hide blind-spot or lateral-limit alerts.
- Make the system harder for the driver to override.
