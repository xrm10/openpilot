# XRM10 v1 Starter Control Center

This branch serves the XRM10 v1 starter phone app and local bridge.

## Phone App

Open from a phone on the same network as the laptop:

```text
http://<laptop-ip>:8787/
```

## Bridge

Start from this directory:

```powershell
node bridge_server.js --host=0.0.0.0 --port=8787
```

## Included In v1 Starter

- Pro command layout: Operate, Navigate, Learn, Test, Deploy.
- Live bridge status and SSH checks.
- Section save/check workflow.
- Route destination entry and car-screen route intent.
- Nav Drive Plan advisory simulation and replay logs.
- Remote steering log upload endpoint.
- Steering log upload index.
- Learning Engine report from steering uploads, nav events, safety events, route state, map metadata, and capability gates.
- Review-gated recommendations with exportable learning report.
- Codex review package builder for evidence decoding and future manual code review.
- Comma UI smart status params for the on-device XRM10 Smart settings page.
- Safety-locked advisory controls.

## Safety Boundary

The phone app and bridge do not command live steering, braking, throttle, or lane changes.

Navigation and traffic features in this branch are route-intent, simulation, replay, confirmation, or logging features only.

The Learning Engine does not automatically rewrite or deploy comma driving code. It produces evidence, scores, warnings, and manual-review recommendations.

The Codex package is a decode/review artifact. It can be used by Codex to propose patches, but applying those patches to comma remains a deliberate manual step.
