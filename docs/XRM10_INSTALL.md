# XRM10 comma four install target

This repository is being prepared as the `xrm10/openpilot` development fork for
Tesla Model 3 HW4 2024-2025 on comma four.

## Target install URL

Use this only after the repository exists on GitHub as `xrm10/openpilot` and
the `dev` branch has been pushed:

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

The local branch exists, but the GitHub fork is not yet pushed. The connected
GitHub app currently has no installed repositories, and no authenticated
`gh` CLI is available in this shell.

Required before this URL will work:

1. Create or fork a GitHub repository at `https://github.com/xrm10/openpilot`.
2. Push this local `dev` branch to that repository.
3. Confirm the branch is visible at `https://github.com/xrm10/openpilot/tree/dev`.
4. Enter `https://installer.comma.ai/xrm10/dev` on the comma four custom
   software screen.

## Safety boundary

This branch must not merge changes that bypass driver monitoring, remove safety
checks, disable alerts, fake vehicle identity, or loosen panda/openpilot safety
constraints. Any Tesla-specific change should be tested with static checks,
unit tests, replay/simulation, and a human review before road use.

