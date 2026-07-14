import json
import time
from collections import deque
from collections.abc import Mapping
from typing import Any

from openpilot.common.params import Params


PROFILE_COMFORT = 0
PROFILE_BALANCED = 1
PROFILE_RESPONSIVE = 2

PROFILE_NAMES = {
  PROFILE_COMFORT: "Comfort",
  PROFILE_BALANCED: "Balanced",
  PROFILE_RESPONSIVE: "Responsive",
}

PROFILE_SETTINGS: dict[int, dict[str, Any]] = {
  PROFILE_COMFORT: {
    "LongitudinalPersonality": 2,
    "Xrm10DmComfortProfile": 2,
    "AutoLaneChangeTimer": 0,
    "AutoLaneChangeBsmDelay": True,
    "SmartCruiseControlMap": True,
    "SmartCruiseControlVision": False,
    "SpeedLimitMode": 2,
    "SpeedLimitPolicy": 3,
    "TorqueBar": True,
  },
  PROFILE_BALANCED: {
    "LongitudinalPersonality": 1,
    "Xrm10DmComfortProfile": 1,
    "AutoLaneChangeTimer": 0,
    "AutoLaneChangeBsmDelay": True,
    "SmartCruiseControlMap": True,
    "SmartCruiseControlVision": True,
    "SpeedLimitMode": 2,
    "SpeedLimitPolicy": 4,
    "TorqueBar": True,
  },
  PROFILE_RESPONSIVE: {
    "LongitudinalPersonality": 0,
    "Xrm10DmComfortProfile": 0,
    "AutoLaneChangeTimer": 1,
    "AutoLaneChangeBsmDelay": True,
    "SmartCruiseControlMap": True,
    "SmartCruiseControlVision": True,
    "SpeedLimitMode": 2,
    "SpeedLimitPolicy": 4,
    "TorqueBar": True,
  },
}

FACTORY_SAFE_SETTINGS: dict[str, Any] = {
  "ExperimentalMode": False,
  "DynamicExperimentalControl": False,
  "LongitudinalPersonality": 1,
  "Xrm10DmComfortProfile": 0,
  "AutoLaneChangeTimer": 0,
  "AutoLaneChangeBsmDelay": True,
  "SmartCruiseControlMap": False,
  "SmartCruiseControlVision": False,
  "SpeedLimitMode": 1,
  "SpeedLimitPolicy": 3,
  "SpeedLimitOffsetType": 0,
  "SpeedLimitValueOffset": 0,
  "CustomTorqueParams": False,
  "EnforceTorqueControl": False,
  "LiveTorqueParamsToggle": False,
  "LiveTorqueParamsRelaxedToggle": False,
  "TorqueParamsOverrideEnabled": False,
  "NeuralNetworkLateralControl": False,
  "TorqueBar": True,
}

SNAPSHOT_PARAMS = sorted({
  *FACTORY_SAFE_SETTINGS.keys(),
  "Mads",
  "MadsMainCruiseAllowed",
  "MadsSteeringMode",
  "MadsUnifiedEngagementMode",
  "DisengageOnAccelerator",
  "CustomAccIncrementsEnabled",
  "CustomAccShortPressIncrement",
  "CustomAccLongPressIncrement",
  "IntelligentCruiseButtonManagement",
  "RoadNameToggle",
  "OsmLocal",
  "Xrm10PerformanceProfile",
  "Xrm10RemoteLoggingMode",
  "Xrm10ReplayTestMode",
})

SNAPSHOT_COMMAND_NONE = 0
SNAPSHOT_COMMAND_SAVE = 1
SNAPSHOT_COMMAND_RESTORE = 2
SNAPSHOT_COMMAND_FACTORY_SAFE = 3
SNAPSHOT_COMMAND_SPORT_RESPONSIVE = 4
SNAPSHOT_COMMAND_COMFORT_DAILY = 5


def _put_param(params: Params, key: str, value: Any) -> None:
  if isinstance(value, bool):
    params.put_bool(key, value, block=True)
  else:
    params.put(key, value, block=True)


def _get_raw_param(params: Params, key: str) -> str | None:
  value = params.get(key)
  if value is None:
    return None
  if isinstance(value, bytes):
    return value.decode("utf-8", errors="replace")
  return str(value)


def _put_json(params: Params, key: str, value: Mapping[str, Any]) -> None:
  params.put(key, json.dumps(value, separators=(",", ":")), block=True)


def _put_json_if_changed(params: Params, key: str, value: Mapping[str, Any]) -> None:
  raw = json.dumps(value, separators=(",", ":"))
  if _get_raw_param(params, key) != raw:
    params.put(key, raw, block=True)


def _put_str_if_changed(params: Params, key: str, value: str) -> None:
  if _get_raw_param(params, key) != value:
    params.put(key, value, block=True)


def _load_json_param(params: Params, key: str) -> dict[str, Any]:
  try:
    value = _get_raw_param(params, key)
    return json.loads(value) if value else {}
  except (TypeError, ValueError, json.JSONDecodeError):
    return {}


def _safe_int(value: Any, default: int = 0) -> int:
  try:
    return int(value)
  except (TypeError, ValueError):
    return default


def performance_profile_name(profile: int | str | None) -> str:
  return PROFILE_NAMES.get(_safe_int(profile, PROFILE_BALANCED), "Balanced")


def apply_setting_map(params: Params, settings: Mapping[str, Any]) -> None:
  for key, value in settings.items():
    _put_param(params, key, value)


def apply_performance_profile(params: Params, profile: int | str | None, source: str = "profile") -> int:
  profile_id = _safe_int(profile, PROFILE_BALANCED)
  if profile_id not in PROFILE_SETTINGS:
    profile_id = PROFILE_BALANCED

  apply_setting_map(params, PROFILE_SETTINGS[profile_id])
  params.put("Xrm10PerformanceProfile", profile_id, block=True)
  params.put("Xrm10PerformanceProfileApplied", profile_id, block=True)

  name = performance_profile_name(profile_id)
  params.put("Xrm10SnapshotStatus", f"{name} profile applied from {source}", block=True)
  return profile_id


def save_current_snapshot(params: Params, name: str = "Last good") -> dict[str, Any]:
  snapshot = {
    "name": name,
    "saved_at": int(time.time()),
    "params": {
      key: _get_raw_param(params, key)
      for key in SNAPSHOT_PARAMS
      if _get_raw_param(params, key) is not None
    },
  }
  _put_json(params, "Xrm10SettingsSnapshot", snapshot)
  params.put("Xrm10SnapshotStatus", f"{name} saved", block=True)
  return snapshot


def restore_snapshot(params: Params) -> bool:
  snapshot = _load_json_param(params, "Xrm10SettingsSnapshot")
  values = snapshot.get("params")
  if not isinstance(values, dict):
    params.put("Xrm10SnapshotStatus", "no snapshot to restore", block=True)
    return False

  for key, value in values.items():
    if value is not None:
      params.put(key, value, block=True)
  params.put("Xrm10SnapshotStatus", f"{snapshot.get('name', 'Snapshot')} restored", block=True)
  return True


def apply_factory_safe(params: Params) -> None:
  apply_setting_map(params, FACTORY_SAFE_SETTINGS)
  params.put("Xrm10PerformanceProfileApplied", -1, block=True)
  params.put("Xrm10SnapshotStatus", "Factory safe applied", block=True)


def handle_snapshot_command(params: Params) -> None:
  command = _safe_int(params.get("Xrm10SnapshotCommand", return_default=True), SNAPSHOT_COMMAND_NONE)
  if command == SNAPSHOT_COMMAND_NONE:
    return

  try:
    if command == SNAPSHOT_COMMAND_SAVE:
      save_current_snapshot(params)
    elif command == SNAPSHOT_COMMAND_RESTORE:
      restore_snapshot(params)
    elif command == SNAPSHOT_COMMAND_FACTORY_SAFE:
      apply_factory_safe(params)
    elif command == SNAPSHOT_COMMAND_SPORT_RESPONSIVE:
      apply_performance_profile(params, PROFILE_RESPONSIVE, source="snapshot command")
    elif command == SNAPSHOT_COMMAND_COMFORT_DAILY:
      apply_performance_profile(params, PROFILE_COMFORT, source="snapshot command")
    else:
      params.put("Xrm10SnapshotStatus", "unknown snapshot command", block=True)
  finally:
    params.put("Xrm10SnapshotCommand", SNAPSHOT_COMMAND_NONE, block=True)


def apply_remote_logging_mode(params: Params) -> None:
  mode = _safe_int(params.get("Xrm10RemoteLoggingMode", return_default=True), 1)
  if mode <= 0:
    _put_str_if_changed(params, "Xrm10LoggingStatus", "standard upload behavior")
    return

  if not params.get_bool("OnroadUploads"):
    params.put_bool("OnroadUploads", True, block=True)
  if not params.get_bool("EnableSunnylinkUploader"):
    params.put_bool("EnableSunnylinkUploader", True, block=True)
  _put_str_if_changed(
    params,
    "Xrm10LoggingStatus",
    "queue and upload when network returns" if mode == 1 else "remote logging priority enabled",
  )


def _enum_name(value: Any) -> str:
  text = str(value)
  return text.split(".")[-1] if "." in text else text


def _alive(sm: Any, service: str) -> bool:
  try:
    return bool(sm.alive[service])
  except Exception:
    return False


def _valid(sm: Any, service: str) -> bool:
  try:
    return bool(sm.valid[service])
  except Exception:
    return False


def _metric_speed(value_ms: float) -> float:
  return value_ms * 3.6


def build_drive_health(sm: Any, params: Params) -> tuple[dict[str, Any], str]:
  ds = sm["deviceState"]
  panda_states = sm["pandaStates"]
  cpu_temp = max(ds.cpuTempC, default=0.0)
  storage = getattr(ds, "freeSpacePercent", 0.0)
  network = _enum_name(ds.networkType)
  panda_ok = _alive(sm, "pandaStates") and len(panda_states) > 0
  car_ok = _alive(sm, "carState") and bool(sm["carState"].canValid)
  gps_ok = _alive(sm, "gpsLocationExternal") or _alive(sm, "gpsLocation")
  camera_ok = _alive(sm, "roadCameraState") and _valid(sm, "roadCameraState")
  calibration = _enum_name(sm["liveCalibration"].calStatus) if _alive(sm, "liveCalibration") else "waiting"
  logs = params.get("Xrm10LoggingStatus") or "standard upload behavior"
  ssh = "on" if params.get_bool("SshEnabled") else "off"

  data = {
    "gps": gps_ok,
    "camera": camera_ok,
    "calibration": calibration,
    "panda": panda_ok,
    "car_connection": car_ok,
    "cpu_temp_c": round(float(cpu_temp), 1),
    "storage_free_percent": round(float(storage), 1),
    "logs": logs,
    "ssh": ssh,
    "network": network,
  }
  status = (
    f"GPS {'ok' if gps_ok else 'wait'} | cam {'ok' if camera_ok else 'wait'} | cal {calibration}\n"
    f"panda {'ok' if panda_ok else 'wait'} | car {'ok' if car_ok else 'wait'} | {network} | CPU {cpu_temp:.0f}C"
  )
  return data, status


def build_torque_tuning(sm: Any) -> tuple[dict[str, Any], str]:
  if not _alive(sm, "liveTorqueParameters"):
    data = {"state": "collecting", "confidence": 0}
    return data, "collecting steering data"

  torque = sm["liveTorqueParameters"]
  cal = int(getattr(torque, "calPerc", 0))
  live_valid = bool(getattr(torque, "liveValid", False))
  factor = float(getattr(torque, "latAccelFactorFiltered", 0.0))
  friction = float(getattr(torque, "frictionCoefficientFiltered", 0.0))
  points = int(getattr(torque, "totalBucketPoints", 0))
  use_params = bool(getattr(torque, "useParams", False))

  if cal < 40:
    suggestion = "need more steady steering data"
  elif not live_valid:
    suggestion = "learned torque data not valid yet"
  else:
    suggestion = "values look usable; review before applying manually"

  data = {
    "calibration_percent": cal,
    "live_valid": live_valid,
    "lat_accel_factor": round(factor, 3),
    "friction": round(friction, 3),
    "total_points": points,
    "use_params": use_params,
    "suggestion": suggestion,
  }
  status = f"cal {cal}% | factor {factor:.2f} | friction {friction:.2f}\n{suggestion}"
  return data, status


def build_route_confidence(sm: Any, params: Params) -> tuple[dict[str, Any], str]:
  map_alive = _alive(sm, "liveMapDataSP")
  map_data = sm["liveMapDataSP"]
  map_speed_valid = bool(getattr(map_data, "speedLimitValid", False)) if map_alive else False
  ahead_valid = bool(getattr(map_data, "speedLimitAheadValid", False)) if map_alive else False
  speed = float(getattr(map_data, "speedLimit", 0.0)) if map_speed_valid else 0.0
  ahead = float(getattr(map_data, "speedLimitAhead", 0.0)) if ahead_valid else 0.0
  next_dist = float(getattr(map_data, "speedLimitAheadDistance", 0.0)) if ahead_valid else 0.0
  map_source = "local OSM" if params.get_bool("OsmLocal") else "mapd"
  speed_source = {
    0: "car",
    1: "map",
    2: "car first",
    3: "map first",
    4: "combined",
  }.get(_safe_int(params.get("SpeedLimitPolicy", return_default=True), 3), "map first")
  missing = []
  if not map_alive:
    missing.append("mapd")
  if not map_speed_valid:
    missing.append("speed limit")

  confidence = 80 if map_alive and map_speed_valid else 45 if map_alive else 20
  data = {
    "route_detected": map_alive,
    "map_source": map_source,
    "speed_limit_source": speed_source,
    "speed_limit_kph": round(_metric_speed(speed), 1) if speed else 0.0,
    "next_speed_limit_kph": round(_metric_speed(ahead), 1) if ahead else 0.0,
    "next_speed_limit_distance_m": round(next_dist, 1) if next_dist else 0.0,
    "confidence": confidence,
    "missing_data": missing,
  }
  status = (
    f"{'route data active' if map_alive else 'route not detected'} | {speed_source}\n"
    f"limit {data['speed_limit_kph']:.0f} km/h | confidence {confidence}%"
  )
  return data, status


def build_map_quality(params: Params) -> tuple[dict[str, Any], str]:
  local = params.get_bool("OsmLocal")
  area = params.get("OsmLocationName") or params.get("OsmStateName") or "unknown area"
  version = params.get("MapdVersion") or "not installed"
  updated = params.get("OsmDownloadedDate") or "unknown"
  source = {
    0: "car",
    1: "map",
    2: "car first",
    3: "map first",
    4: "combined",
  }.get(_safe_int(params.get("SpeedLimitPolicy", return_default=True), 3), "map first")
  data = {
    "local_osm": local,
    "area": area,
    "mapd_version": version,
    "updated": updated,
    "speed_limit_source": source,
  }
  status = f"{'local maps active' if local else 'local maps off'} | {area}\nsource {source} | updated {updated}"
  return data, status


def update_event_history(sm: Any, params: Params, history: deque[str]) -> tuple[dict[str, Any], str]:
  if _alive(sm, "onroadEvents"):
    for event in sm["onroadEvents"]:
      try:
        name = _enum_name(event.name)
      except Exception:
        continue
      if not history or history[-1] != name:
        history.append(name)

  recent = list(history)[-8:]
  data = {"recent": recent}
  status = "\n".join(recent[-3:]) if recent else "no recent events"
  return data, status


def update_status_params(params: Params, sm: Any, history: deque[str]) -> None:
  drive_health, drive_health_status = build_drive_health(sm, params)
  torque, torque_status = build_torque_tuning(sm)
  route, route_status = build_route_confidence(sm, params)
  map_quality, map_quality_status = build_map_quality(params)
  events, event_status = update_event_history(sm, params, history)

  _put_json_if_changed(params, "Xrm10DriveHealth", drive_health)
  _put_str_if_changed(params, "Xrm10DriveHealthStatus", drive_health_status)
  _put_json_if_changed(params, "Xrm10TorqueTuning", torque)
  _put_str_if_changed(params, "Xrm10TorqueTuningStatus", torque_status)
  _put_json_if_changed(params, "Xrm10RouteConfidence", route)
  _put_str_if_changed(params, "Xrm10RouteConfidenceStatus", route_status)
  _put_json_if_changed(params, "Xrm10MapQuality", map_quality)
  _put_str_if_changed(params, "Xrm10MapQualityStatus", map_quality_status)
  _put_json_if_changed(params, "Xrm10EventHistory", events)
  _put_str_if_changed(params, "Xrm10EventHistoryStatus", event_status)
