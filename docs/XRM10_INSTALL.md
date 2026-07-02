# XRM10 comma four install target

This repository is being prepared as the `xrm10/openpilot` development fork for
Tesla Model 3 HW4 2024-2025 on comma four.

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
- Base branch: commaai/openpilot `release-mici`
- Local development branch: `dev`
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

Enter this URL on the comma four custom software screen:

```text
https://installer.comma.ai/xrm10/dev
```

## Safety boundary

This branch must not merge changes that bypass driver monitoring, remove safety
checks, disable alerts, fake vehicle identity, or loosen panda/openpilot safety
constraints. Any Tesla-specific change should be tested with static checks,
unit tests, replay/simulation, and a human review before road use.
