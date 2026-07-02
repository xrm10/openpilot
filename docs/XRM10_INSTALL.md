# XRM10 comma four install target

This repository is the `xrm10/openpilot` development fork for Tesla Model 3 HW4
2024-2025 on comma four.

## Target install URL

The repository exists on GitHub as `xrm10/openpilot` and the `dev` branch is
published:

```text
https://installer.comma.ai/xrm10/dev
```

On a comma device installer that expands short fork URLs, this should also be
accepted:

```text
xrm10/dev
```

## Vehicle target

- Vehicle: Tesla Model 3 with HW4
- Model years: 2024-2025
- Device: comma four
- Base branch: sunnypilot/sunnypilot `dev`
- Local development branch: `dev`
- Previous comma-release base backup: `openpilot-release-mici-backup-20260702`
- Hardware path from current comma supported-cars table:
  - Tesla B connector
  - comma four
  - harness box
  - long OBD-C cable, 9.5 ft
  - mount

## Current status

The `dev` branch is published and visible at:

```text
https://github.com/xrm10/openpilot/tree/dev
```

The branch now follows `sunnypilot/dev`, with XRM10 install notes added on top.
Lane-assist validation notes live in `docs/XRM10_LANE_ASSIST_TESTING.md`.
The local control dashboard lives in `tools/xrm10_control_center/index.html`.

Enter this URL on the comma four custom software screen:

```text
https://installer.comma.ai/xrm10/dev
```

## Safety boundary

This branch must not merge changes that bypass driver monitoring, remove safety
checks, disable alerts, fake vehicle identity, or loosen panda/openpilot safety
constraints. Any Tesla-specific change should be tested with static checks,
unit tests, replay/simulation, and a human review before road use.
