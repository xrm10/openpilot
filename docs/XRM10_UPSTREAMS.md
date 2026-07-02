# XRM10 upstream map

This local repository is not a random blended fork. The published `dev` branch
now tracks the sunnypilot development tree with XRM10 install notes added on top.

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

The active `dev` branch is based on `sunnypilot/dev` because the XRM10 install
target should carry sunnypilot development behavior while keeping the repository
name `openpilot` for the comma custom software URL format.

The earlier comma `release-mici` based branch is preserved here:

```text
openpilot-release-mici-backup-20260702
```

## Upstream refs fetched locally

```text
sunnypilot/dev
sunnypilot/master
sunnypilot/release-mici
origin/release-mici
```

Use these refs for review and selective cherry-picks only. Do not bulk-merge
additional forks into this branch without reviewing safety, car interfaces, panda
safety code, and Tesla-specific behavior.

## Practical review commands

```text
git diff origin/release-mici..sunnypilot/dev -- selfdrive/car/tesla
git diff sunnypilot/release-mici..sunnypilot/dev -- selfdrive/car/tesla
git log --oneline --decorate --graph --max-count=40 --all
```

## Merge policy

- Keep driver monitoring required.
- Keep panda safety constraints intact.
- Keep Tesla HW4 behavior explicit and documented.
- Prefer small cherry-picks with one purpose each.
- Run tests before any install candidate is pushed.
- Treat installer-ready branches as release artifacts, not scratch branches.

