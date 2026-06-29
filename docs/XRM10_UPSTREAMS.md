# XRM10 upstream map

This local repository is not a random blended fork. It starts from comma's
comma-four release branch and keeps sunnypilot available as a comparison remote.

## Local branch

```text
dev
```

## Remotes

```text
origin     https://github.com/commaai/openpilot.git
sunnypilot https://github.com/sunnypilot/sunnypilot.git
```

Recommended GitHub push remote after `xrm10/openpilot` exists:

```text
xrm10      https://github.com/xrm10/openpilot.git
```

## Base choice

The initial `dev` branch is based on `commaai/openpilot` `release-mici` because
the current openpilot README maps comma four to the `release-mici` release line.
For comma 3X, comma documents `release-tizi`; this branch is not targeting
comma 3X.

## Sunnypilot comparison refs fetched locally

```text
sunnypilot/dev
sunnypilot/master
sunnypilot/release-mici
```

Use these refs for review and selective cherry-picks only. Do not bulk-merge a
fork into this branch without reviewing safety, car interfaces, panda safety
code, and Tesla-specific behavior.

## Practical review commands

```text
git diff release-mici..sunnypilot/release-mici -- selfdrive/car/tesla
git diff release-mici..sunnypilot/dev -- selfdrive/car/tesla
git log --oneline --decorate --graph --max-count=40 --all
```

## Merge policy

- Keep driver monitoring required.
- Keep panda safety constraints intact.
- Keep Tesla HW4 behavior explicit and documented.
- Prefer small cherry-picks with one purpose each.
- Run tests before any install candidate is pushed.
- Treat installer-ready branches as release artifacts, not scratch branches.

