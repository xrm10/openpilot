#!/usr/bin/env python3
import time
from collections import deque

import cereal.messaging as messaging

from openpilot.common.params import Params
from openpilot.common.realtime import config_realtime_process
from openpilot.sunnypilot.xrm10.v12 import (
  apply_performance_profile,
  apply_remote_logging_mode,
  handle_snapshot_command,
  update_status_params,
)


SERVICES = [
  "deviceState",
  "pandaStates",
  "carState",
  "gpsLocationExternal",
  "gpsLocation",
  "liveCalibration",
  "roadCameraState",
  "liveTorqueParameters",
  "liveMapDataSP",
  "onroadEvents",
]


def manager_thread() -> None:
  try:
    config_realtime_process([0, 1, 2, 3], 1)
  except Exception:
    pass

  params = Params()
  sm = messaging.SubMaster(SERVICES)
  history: deque[str] = deque(maxlen=20)
  last_status_update = 0.0

  while True:
    sm.update(1000)

    profile = params.get("Xrm10PerformanceProfile", return_default=True)
    applied = params.get("Xrm10PerformanceProfileApplied", return_default=True)
    if str(profile) != str(applied):
      apply_performance_profile(params, profile, source="remote" if applied is not None else "boot")

    handle_snapshot_command(params)
    apply_remote_logging_mode(params)

    now = time.monotonic()
    if now - last_status_update >= 2.0:
      update_status_params(params, sm, history)
      last_status_update = now


def main() -> None:
  manager_thread()


if __name__ == "__main__":
  main()
