# XRM10 Control Center

The XRM10 Control Center is a standalone app for guarded branch and profile
management:

```text
tools/xrm10_control_center/index.html
```

It is designed for development workflow, not direct vehicle actuation.

## Capabilities

- Use a sunnypilot-style section sidebar with Device, Toggles, Models,
  Steering, Cruise, Visuals, Display, Maps, Vehicle, Software, Developer, and
  Migration Wizard views.
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
- Show locked safety policies that must not be bypassed.

## Safety boundary

The app intentionally does not expose switches that disable driver monitoring,
weaken excessive actuation checks, modify panda safety, or make manual override
harder. Any future bridge from exported profiles to live device params must
preserve those limits and add tests before install use.

## Current install URL

```text
https://installer.comma.ai/xrm10/dev
```
