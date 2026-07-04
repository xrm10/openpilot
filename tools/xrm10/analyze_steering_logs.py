#!/usr/bin/env python3
"""
Summarize steering/lateral behavior from recent openpilot qlogs/rlogs.

Runs on a comma/openpilot checkout.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def load_logreader():
  for path in ("/data/openpilot", "/data/openpilot/openpilot"):
    if path not in sys.path and Path(path).exists():
      sys.path.insert(0, path)
  try:
    from openpilot.tools.lib.logreader import LogReader  # type: ignore
    return LogReader
  except Exception:
    from tools.lib.logreader import LogReader  # type: ignore
    return LogReader


def utc_now() -> str:
  return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def safe_float(value: Any, default: float | None = None) -> float | None:
  try:
    number = float(value)
    if math.isfinite(number):
      return number
  except Exception:
    pass
  return default


def safe_bool(value: Any) -> bool:
  try:
    return bool(value)
  except Exception:
    return False


def enum_name(value: Any) -> str:
  try:
    return str(value).split(".")[-1]
  except Exception:
    return str(value)


def recent_routes(realdata_dir: Path, count: int) -> list[Path]:
  routes = [p for p in realdata_dir.iterdir() if p.is_dir() and "--" in p.name] if realdata_dir.exists() else []
  routes.sort(key=lambda p: p.stat().st_mtime if p.exists() else 0, reverse=True)
  return routes[:max(1, min(30, count))]


def route_logs(route: Path, prefer: str) -> list[Path]:
  logs = []
  if prefer in ("qlog", "both"):
    logs.extend(sorted(route.glob("qlog*")))
  if prefer in ("rlog", "both"):
    logs.extend(sorted(route.glob("rlog*")))
  return [p for p in logs if p.is_file()]


def update_abs_max(summary: dict[str, Any], key: str, value: Any) -> None:
  number = safe_float(value)
  if number is None:
    return
  summary[key] = max(float(summary.get(key, 0.0)), abs(number))


def update_min_max(summary: dict[str, Any], prefix: str, value: Any) -> None:
  number = safe_float(value)
  if number is None:
    return
  min_key = f"{prefix}Min"
  max_key = f"{prefix}Max"
  summary[min_key] = number if min_key not in summary else min(float(summary[min_key]), number)
  summary[max_key] = number if max_key not in summary else max(float(summary[max_key]), number)


def event_names_from_selfdrive_state(sds: Any) -> list[str]:
  names = []
  try:
    for event in sds.events:
      names.append(enum_name(event.name))
  except Exception:
    pass
  return names


def lateral_state_details(lateral_state: Any) -> tuple[str, Any | None]:
  try:
    which = lateral_state.which()
    return str(which), getattr(lateral_state, which)
  except Exception:
    return "unknown", None


def analyze_logs(log_paths: list[Path], max_messages: int = 0) -> dict[str, Any]:
  LogReader = load_logreader()
  summary: dict[str, Any] = {
    "generatedAt": utc_now(),
    "logs": [str(path) for path in log_paths],
    "messageCounts": Counter(),
    "routes": {},
    "carState": {
      "samples": 0,
      "steeringPressedSamples": 0,
      "standstillSamples": 0,
      "vEgoMin": None,
      "vEgoMax": None,
      "steeringAngleAbsMaxDeg": 0.0,
      "steeringTorqueAbsMax": 0.0,
      "steeringTorqueEpsAbsMax": 0.0,
    },
    "carControl": {
      "samples": 0,
      "latActiveSamples": 0,
      "actuatorTorqueAbsMax": 0.0,
      "actuatorSteerAbsMax": 0.0,
      "curvatureAbsMax": 0.0,
    },
    "controlsState": {
      "samples": 0,
      "enabledSamples": 0,
      "activeLateralSamples": 0,
      "saturatedSamples": 0,
      "lateralStateTypes": Counter(),
      "stateFields": defaultdict(Counter),
    },
    "selfdriveState": {
      "samples": 0,
      "enabledSamples": 0,
      "activeSamples": 0,
      "alerts": Counter(),
      "events": Counter(),
    },
    "liveParameters": {
      "samples": 0,
      "latest": {},
      "invalidSteerRatioSamples": 0,
    },
    "liveDelay": {
      "samples": 0,
      "latest": {},
    },
    "lateralPlan": {
      "samples": 0,
      "desires": Counter(),
      "laneChangeStates": Counter(),
      "laneChangeDirections": Counter(),
    },
    "errors": [],
  }

  total_messages = 0
  for log_path in log_paths:
    route_name = log_path.parent.name
    route_summary = summary["routes"].setdefault(route_name, {"logs": [], "messages": 0})
    route_summary["logs"].append(log_path.name)
    try:
      for msg in LogReader(str(log_path)):
        total_messages += 1
        route_summary["messages"] += 1
        if max_messages and total_messages > max_messages:
          break
        try:
          which = msg.which()
        except Exception:
          continue
        summary["messageCounts"][which] += 1

        if which == "carState":
          cs = msg.carState
          csum = summary["carState"]
          csum["samples"] += 1
          csum["steeringPressedSamples"] += int(safe_bool(getattr(cs, "steeringPressed", False)))
          csum["standstillSamples"] += int(safe_bool(getattr(cs, "standstill", False)))
          update_min_max(csum, "vEgo", getattr(cs, "vEgo", None))
          update_abs_max(csum, "steeringAngleAbsMaxDeg", getattr(cs, "steeringAngleDeg", None))
          update_abs_max(csum, "steeringTorqueAbsMax", getattr(cs, "steeringTorque", None))
          update_abs_max(csum, "steeringTorqueEpsAbsMax", getattr(cs, "steeringTorqueEps", None))

        elif which == "carControl":
          cc = msg.carControl
          csum = summary["carControl"]
          csum["samples"] += 1
          csum["latActiveSamples"] += int(safe_bool(getattr(cc, "latActive", False)))
          try:
            actuators = cc.actuators
            update_abs_max(csum, "actuatorTorqueAbsMax", getattr(actuators, "torque", None))
            update_abs_max(csum, "actuatorSteerAbsMax", getattr(actuators, "steer", None))
            update_abs_max(csum, "curvatureAbsMax", getattr(actuators, "curvature", None))
          except Exception:
            pass

        elif which == "controlsState":
          cs = msg.controlsState
          csum = summary["controlsState"]
          csum["samples"] += 1
          csum["enabledSamples"] += int(safe_bool(getattr(cs, "enabled", False)))
          lat_type, lat_detail = lateral_state_details(cs.lateralControlState)
          csum["lateralStateTypes"][lat_type] += 1
          if lat_detail is not None:
            active = safe_bool(getattr(lat_detail, "active", False))
            saturated = safe_bool(getattr(lat_detail, "saturated", False))
            csum["activeLateralSamples"] += int(active)
            csum["saturatedSamples"] += int(saturated)
            for field in ("active", "saturated"):
              if hasattr(lat_detail, field):
                csum["stateFields"][lat_type][f"{field}:{getattr(lat_detail, field)}"] += 1

        elif which == "selfdriveState":
          sds = msg.selfdriveState
          ssum = summary["selfdriveState"]
          ssum["samples"] += 1
          ssum["enabledSamples"] += int(safe_bool(getattr(sds, "enabled", False)))
          ssum["activeSamples"] += int(safe_bool(getattr(sds, "active", False)))
          alert = " | ".join(
            part for part in (
              str(getattr(sds, "alertText1", "") or ""),
              str(getattr(sds, "alertText2", "") or ""),
            ) if part
          )
          if alert:
            ssum["alerts"][alert] += 1
          for name in event_names_from_selfdrive_state(sds):
            ssum["events"][name] += 1

        elif which == "liveParameters":
          lp = msg.liveParameters
          psum = summary["liveParameters"]
          psum["samples"] += 1
          latest = {}
          for field in ("steerRatio", "stiffnessFactor", "angleOffsetDeg", "angleOffsetAverageDeg", "steerRatioValid", "stiffnessFactorValid"):
            if hasattr(lp, field):
              latest[field] = getattr(lp, field)
          psum["latest"] = latest
          if hasattr(lp, "steerRatioValid") and not bool(lp.steerRatioValid):
            psum["invalidSteerRatioSamples"] += 1

        elif which == "liveDelay":
          ld = msg.liveDelay
          dsum = summary["liveDelay"]
          dsum["samples"] += 1
          latest = {}
          for field in ("lateralDelay", "lateralDelayEstimate", "lateralDelayEstimateStd"):
            if hasattr(ld, field):
              latest[field] = getattr(ld, field)
          dsum["latest"] = latest

        elif which == "lateralPlan":
          lp = msg.lateralPlan
          lsum = summary["lateralPlan"]
          lsum["samples"] += 1
          for field, counter_name in (
            ("desire", "desires"),
            ("laneChangeState", "laneChangeStates"),
            ("laneChangeDirection", "laneChangeDirections"),
          ):
            if hasattr(lp, field):
              lsum[counter_name][enum_name(getattr(lp, field))] += 1

      if max_messages and total_messages > max_messages:
        break
    except Exception as exc:
      summary["errors"].append({"log": str(log_path), "error": repr(exc)})

  # Convert counters/defaultdicts into JSON-safe dicts.
  def convert(value: Any) -> Any:
    if isinstance(value, Counter):
      return dict(value.most_common())
    if isinstance(value, defaultdict):
      return {k: convert(v) for k, v in value.items()}
    if isinstance(value, dict):
      return {k: convert(v) for k, v in value.items()}
    if isinstance(value, list):
      return [convert(v) for v in value]
    return value

  converted = convert(summary)
  converted["findings"] = build_findings(converted)
  return converted


def ratio(part: int | float, total: int | float) -> float:
  return float(part) / float(total) if total else 0.0


def build_findings(summary: dict[str, Any]) -> list[str]:
  findings = []
  car_state = summary.get("carState", {})
  car_control = summary.get("carControl", {})
  controls = summary.get("controlsState", {})
  sds = summary.get("selfdriveState", {})
  live_params = summary.get("liveParameters", {})
  live_delay = summary.get("liveDelay", {})

  steering_pressed_ratio = ratio(car_state.get("steeringPressedSamples", 0), car_state.get("samples", 0))
  if steering_pressed_ratio > 0.08:
    findings.append(f"Driver steering override is frequent ({steering_pressed_ratio:.1%} of carState samples). Review torque friction/lat accel tuning only after separating intentional driver input.")

  saturation_ratio = ratio(controls.get("saturatedSamples", 0), controls.get("activeLateralSamples", 0))
  if saturation_ratio > 0.02:
    findings.append(f"Lateral controller saturation appears in {saturation_ratio:.1%} of active lateral samples. Check desired vs actual curvature, tire/steer ratio, and torque limits before increasing authority.")
  elif controls.get("activeLateralSamples", 0):
    findings.append("No significant lateral saturation detected in active samples.")

  torque_max = float(car_control.get("actuatorTorqueAbsMax", 0) or 0)
  if torque_max >= 0.95:
    findings.append("Commanded actuator torque reaches the normalized limit. Do not raise limits until replay confirms model/path quality and car safety limits.")
  elif torque_max >= 0.75:
    findings.append("Commanded actuator torque is high but below the normalized limit; smoothness or delay tuning may help if path tracking is late.")

  latest_params = live_params.get("latest", {})
  if latest_params.get("steerRatioValid") is False or live_params.get("invalidSteerRatioSamples", 0):
    findings.append("liveParameters reported invalid steer ratio samples. Steering improvement should start with calibration/steer-ratio validity, not more torque.")

  latest_delay = live_delay.get("latest", {})
  lateral_delay = latest_delay.get("lateralDelay")
  if isinstance(lateral_delay, (int, float)) and lateral_delay > 0.35:
    findings.append(f"Lateral delay is high ({lateral_delay:.3f}s). Review model lateral delay and actuator delay before changing steering feel.")

  alert_counts = sds.get("alerts", {})
  steer_alerts = {k: v for k, v in alert_counts.items() if "steer" in k.lower() or "lane" in k.lower()}
  if steer_alerts:
    findings.append(f"Steering/lane alerts observed: {steer_alerts}")

  if not findings:
    findings.append("No obvious steering fault was detected from the available summarized signals. Deeper replay comparison is the next step.")
  return findings


def write_markdown(summary: dict[str, Any], path: Path) -> None:
  lines = [
    "# XRM10 Steering Log Analysis",
    "",
    f"Generated: {summary.get('generatedAt')}",
    "",
    "## Findings",
  ]
  for finding in summary.get("findings", []):
    lines.append(f"- {finding}")
  lines.extend([
    "",
    "## Key Counts",
    f"- Logs analyzed: {len(summary.get('logs', []))}",
    f"- Routes: {len(summary.get('routes', {}))}",
    f"- carState samples: {summary.get('carState', {}).get('samples', 0)}",
    f"- carControl samples: {summary.get('carControl', {}).get('samples', 0)}",
    f"- controlsState samples: {summary.get('controlsState', {}).get('samples', 0)}",
    f"- active lateral samples: {summary.get('controlsState', {}).get('activeLateralSamples', 0)}",
    f"- saturated lateral samples: {summary.get('controlsState', {}).get('saturatedSamples', 0)}",
    "",
    "## Latest Live Parameters",
    "```json",
    json.dumps(summary.get("liveParameters", {}).get("latest", {}), indent=2),
    "```",
    "",
    "## Latest Live Delay",
    "```json",
    json.dumps(summary.get("liveDelay", {}).get("latest", {}), indent=2),
    "```",
    "",
    "## Alerts",
    "```json",
    json.dumps(summary.get("selfdriveState", {}).get("alerts", {}), indent=2),
    "```",
    "",
    "## Message Counts",
    "```json",
    json.dumps(summary.get("messageCounts", {}), indent=2),
    "```",
  ])
  path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
  parser = argparse.ArgumentParser(description="Analyze recent steering logs")
  parser.add_argument("--realdata-dir", default="/data/media/0/realdata")
  parser.add_argument("--segments", type=int, default=6)
  parser.add_argument("--prefer", choices=["qlog", "rlog", "both"], default="qlog")
  parser.add_argument("--output-dir", default="/data/xrm10_remote_logger/analysis")
  parser.add_argument("--max-messages", type=int, default=0)
  args = parser.parse_args()

  routes = recent_routes(Path(args.realdata_dir), args.segments)
  logs: list[Path] = []
  for route in routes:
    logs.extend(route_logs(route, args.prefer))

  output_dir = Path(args.output_dir)
  output_dir.mkdir(parents=True, exist_ok=True)
  summary = analyze_logs(logs, args.max_messages)
  json_path = output_dir / "steering_summary.json"
  md_path = output_dir / "steering_summary.md"
  json_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
  write_markdown(summary, md_path)
  print(json.dumps({
    "json": str(json_path),
    "markdown": str(md_path),
    "logs": len(logs),
    "routes": len(routes),
    "findings": summary.get("findings", []),
  }, indent=2))
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
