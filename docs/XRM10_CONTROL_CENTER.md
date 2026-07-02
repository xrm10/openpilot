# XRM10 Control Center

The XRM10 Control Center is a standalone app for guarded branch and profile
management:

```text
tools/xrm10_control_center/index.html
```

It is designed for development workflow, not direct vehicle actuation.

## Capabilities

- Use a sunnypilot-style section sidebar with Device, Toggles, Models,
  Steering, Cruise, Visuals, Display, Maps, Vehicle, Software, Safety Lab,
  Developer, and Migration Wizard views.
- Keep Safety Lab in the same app for simulation, replay, bench/offroad, and
  closed-course review before any real-car test.
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
- Export Safety Lab test plans with readiness checks, lab controls, and manual
  review steps.
- Show locked safety policies that must not be bypassed.

## Safety boundary

The app intentionally does not expose switches that disable driver monitoring,
weaken excessive actuation checks, modify panda safety, or make manual override
harder. Any future bridge from exported profiles to live device params must
preserve those limits and add tests before install use.

Safety Lab controls represent simulation/offroad review values. They are not a
live-car safety bypass and must not be wired into real vehicle behavior without
separate reviewed code, bench tests, closed-course tests, and safety validation.

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

## Current install URL

```text
https://installer.comma.ai/xrm10/dev
```
