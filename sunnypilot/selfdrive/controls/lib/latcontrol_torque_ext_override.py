"""
Copyright (c) 2021-, Haibin Wen, sunnypilot, and a number of other contributors.

This file is part of sunnypilot and is licensed under the MIT License.
See the LICENSE.md file in the root directory for more details.
"""

from openpilot.common.params import Params


TORQUE_RESPONSE_PROFILES = {
  # Higher lat accel factor asks for slightly less torque. Lower friction avoids twitch at center.
  0: (1.08, 0.90),  # stable
  1: (1.00, 1.00),  # balanced
  2: (0.94, 1.10),  # responsive
}
MIN_LAT_ACCEL_FACTOR = 0.1
MAX_LAT_ACCEL_FACTOR = 5.0
MIN_FRICTION = 0.0
MAX_FRICTION = 1.0


def _clip(value: float, minimum: float, maximum: float) -> float:
  return max(minimum, min(maximum, value))


def _read_int_param(params: Params, key: str, default: int) -> int:
  try:
    return int(params.get(key, return_default=True))
  except (TypeError, ValueError):
    return default


class LatControlTorqueExtOverride:
  def __init__(self, CP):
    self.CP = CP
    self.params = Params()
    self.enforce_torque_control_toggle = self.params.get_bool("EnforceTorqueControl")  # only during init
    self.torque_override_enabled = self.params.get_bool("TorqueParamsOverrideEnabled")
    self.frame = -1

  def update_override_torque_params(self, torque_params) -> bool:
    if not self.enforce_torque_control_toggle:
      return False

    self.frame += 1
    if self.frame % 300 == 0:
      self.torque_override_enabled = self.params.get_bool("TorqueParamsOverrideEnabled")

      if not self.torque_override_enabled:
        return False

      torque_params.latAccelFactor = float(self.params.get("TorqueParamsOverrideLatAccelFactor", return_default=True))
      torque_params.friction = float(self.params.get("TorqueParamsOverrideFriction", return_default=True))
      profile = _read_int_param(self.params, "TorqueResponseProfile", 1)
      lat_accel_multiplier, friction_multiplier = TORQUE_RESPONSE_PROFILES.get(profile, TORQUE_RESPONSE_PROFILES[1])
      torque_params.latAccelFactor = _clip(torque_params.latAccelFactor * lat_accel_multiplier,
                                           MIN_LAT_ACCEL_FACTOR, MAX_LAT_ACCEL_FACTOR)
      torque_params.friction = _clip(torque_params.friction * friction_multiplier, MIN_FRICTION, MAX_FRICTION)
      return True

    return False
