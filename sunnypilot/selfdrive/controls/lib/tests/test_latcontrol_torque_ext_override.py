"""
Copyright (c) 2021-, Haibin Wen, sunnypilot, and a number of other contributors.

This file is part of sunnypilot and is licensed under the MIT License.
See the LICENSE.md file in the root directory for more details.
"""
from types import SimpleNamespace

import pytest

from openpilot.sunnypilot.selfdrive.controls.lib import latcontrol_torque_ext_override as mod
from openpilot.sunnypilot.selfdrive.controls.lib.latcontrol_torque_ext_override import (
  LatControlTorqueExtOverride,
  TORQUE_RESPONSE_PROFILES,
  MIN_LAT_ACCEL_FACTOR,
  MAX_LAT_ACCEL_FACTOR,
  MIN_FRICTION,
  MAX_FRICTION,
  _clip,
  _read_int_param,
)

# param defaults registered in common/params_keys.h
DEFAULT_LAT_ACCEL_FACTOR = 2.5
DEFAULT_FRICTION = 0.1


class FakeParams:
  """Minimal stand-in for openpilot.common.params.Params."""
  def __init__(self, values):
    self._values = dict(values)

  def get_bool(self, key):
    return bool(self._values.get(key, False))

  def get(self, key, return_default=False):
    return self._values.get(key)

  def put(self, key, value):
    self._values[key] = value


def make_override(monkeypatch, **params):
  values = {
    "EnforceTorqueControl": params.get("EnforceTorqueControl", True),
    "TorqueParamsOverrideEnabled": params.get("TorqueParamsOverrideEnabled", True),
    "TorqueParamsOverrideLatAccelFactor": params.get("TorqueParamsOverrideLatAccelFactor", DEFAULT_LAT_ACCEL_FACTOR),
    "TorqueParamsOverrideFriction": params.get("TorqueParamsOverrideFriction", DEFAULT_FRICTION),
    "TorqueResponseProfile": params.get("TorqueResponseProfile", 1),
  }
  fake = FakeParams(values)
  monkeypatch.setattr(mod, "Params", lambda: fake)
  override = LatControlTorqueExtOverride(CP=SimpleNamespace())
  return override, fake


def make_torque_params(lat_accel_factor=DEFAULT_LAT_ACCEL_FACTOR, friction=DEFAULT_FRICTION):
  return SimpleNamespace(latAccelFactor=lat_accel_factor, friction=friction)


class TestHelpers:
  def test_clip_within_bounds(self):
    assert _clip(0.5, 0.0, 1.0) == 0.5

  def test_clip_below_min(self):
    assert _clip(-1.0, 0.0, 1.0) == 0.0

  def test_clip_above_max(self):
    assert _clip(2.0, 0.0, 1.0) == 1.0

  def test_read_int_param_valid(self):
    assert _read_int_param(FakeParams({"k": 2}), "k", 1) == 2

  def test_read_int_param_string_number(self):
    assert _read_int_param(FakeParams({"k": "2"}), "k", 1) == 2

  @pytest.mark.parametrize("bad", [None, "abc", ""])
  def test_read_int_param_invalid_falls_back(self, bad):
    assert _read_int_param(FakeParams({"k": bad}), "k", 1) == 1


class TestGating:
  # the enforce toggle is a hard master switch, read once at init
  def test_disabled_when_enforce_toggle_off(self, monkeypatch):
    override, _ = make_override(monkeypatch, EnforceTorqueControl=False)
    tp = make_torque_params()
    assert override.update_override_torque_params(tp) is False
    assert tp.latAccelFactor == DEFAULT_LAT_ACCEL_FACTOR
    assert tp.friction == DEFAULT_FRICTION

  def test_no_apply_when_override_disabled(self, monkeypatch):
    override, _ = make_override(monkeypatch, TorqueParamsOverrideEnabled=False)
    tp = make_torque_params(lat_accel_factor=1.23, friction=0.42)
    # frame advances to 0 (0 % 300 == 0), reads override-enabled = False, bails
    assert override.update_override_torque_params(tp) is False
    assert tp.latAccelFactor == 1.23
    assert tp.friction == 0.42

  def test_only_applies_on_300_frame_boundary(self, monkeypatch):
    override, _ = make_override(monkeypatch)
    # first call: frame -1 -> 0, applies
    assert override.update_override_torque_params(make_torque_params()) is True
    # next 299 calls are no-ops and must not touch torque_params
    for _ in range(299):
      tp = make_torque_params(lat_accel_factor=9.9, friction=0.99)
      assert override.update_override_torque_params(tp) is False
      assert tp.latAccelFactor == 9.9
      assert tp.friction == 0.99
    # frame wraps back to a 300 multiple and applies again
    tp = make_torque_params()
    assert override.update_override_torque_params(tp) is True

  def test_enabled_is_rechecked_on_boundary(self, monkeypatch):
    override, fake = make_override(monkeypatch)
    assert override.update_override_torque_params(make_torque_params()) is True
    # flip the live toggle off, jump to the next boundary
    fake.put("TorqueParamsOverrideEnabled", False)
    override.frame = 299
    tp = make_torque_params(lat_accel_factor=1.5, friction=0.2)
    assert override.update_override_torque_params(tp) is False
    assert tp.latAccelFactor == 1.5
    assert tp.friction == 0.2


class TestResponseProfiles:
  @pytest.mark.parametrize("profile", [0, 1, 2])
  def test_profile_multipliers_applied(self, monkeypatch, profile):
    override, _ = make_override(monkeypatch, TorqueResponseProfile=profile)
    lat_mult, fric_mult = TORQUE_RESPONSE_PROFILES[profile]
    tp = make_torque_params()
    assert override.update_override_torque_params(tp) is True
    assert tp.latAccelFactor == pytest.approx(DEFAULT_LAT_ACCEL_FACTOR * lat_mult)
    assert tp.friction == pytest.approx(DEFAULT_FRICTION * fric_mult)

  def test_balanced_profile_is_identity(self, monkeypatch):
    override, _ = make_override(monkeypatch, TorqueResponseProfile=1)
    tp = make_torque_params()
    override.update_override_torque_params(tp)
    assert tp.latAccelFactor == pytest.approx(DEFAULT_LAT_ACCEL_FACTOR)
    assert tp.friction == pytest.approx(DEFAULT_FRICTION)

  def test_unknown_profile_falls_back_to_balanced(self, monkeypatch):
    override, _ = make_override(monkeypatch, TorqueResponseProfile=99)
    tp = make_torque_params()
    override.update_override_torque_params(tp)
    # profile 1 multipliers are (1.0, 1.0)
    assert tp.latAccelFactor == pytest.approx(DEFAULT_LAT_ACCEL_FACTOR)
    assert tp.friction == pytest.approx(DEFAULT_FRICTION)

  def test_invalid_profile_param_falls_back_to_balanced(self, monkeypatch):
    override, _ = make_override(monkeypatch, TorqueResponseProfile="not-an-int")
    tp = make_torque_params()
    override.update_override_torque_params(tp)
    assert tp.latAccelFactor == pytest.approx(DEFAULT_LAT_ACCEL_FACTOR)
    assert tp.friction == pytest.approx(DEFAULT_FRICTION)


class TestClipping:
  def test_lat_accel_factor_clipped_high(self, monkeypatch):
    override, _ = make_override(monkeypatch, TorqueResponseProfile=1,
                                TorqueParamsOverrideLatAccelFactor=100.0)
    tp = make_torque_params()
    override.update_override_torque_params(tp)
    assert tp.latAccelFactor == MAX_LAT_ACCEL_FACTOR

  def test_lat_accel_factor_clipped_low(self, monkeypatch):
    override, _ = make_override(monkeypatch, TorqueResponseProfile=1,
                                TorqueParamsOverrideLatAccelFactor=0.0)
    tp = make_torque_params()
    override.update_override_torque_params(tp)
    assert tp.latAccelFactor == MIN_LAT_ACCEL_FACTOR

  def test_friction_clipped_high(self, monkeypatch):
    override, _ = make_override(monkeypatch, TorqueResponseProfile=1,
                                TorqueParamsOverrideFriction=5.0)
    tp = make_torque_params()
    override.update_override_torque_params(tp)
    assert tp.friction == MAX_FRICTION

  def test_friction_clipped_low(self, monkeypatch):
    override, _ = make_override(monkeypatch, TorqueResponseProfile=1,
                                TorqueParamsOverrideFriction=-1.0)
    tp = make_torque_params()
    override.update_override_torque_params(tp)
    assert tp.friction == MIN_FRICTION

  def test_responsive_profile_stays_within_friction_bounds(self, monkeypatch):
    # profile 2 scales friction up by 1.10; a near-max override must still be clipped
    override, _ = make_override(monkeypatch, TorqueResponseProfile=2,
                                TorqueParamsOverrideFriction=0.95)
    tp = make_torque_params()
    override.update_override_torque_params(tp)
    assert MIN_FRICTION <= tp.friction <= MAX_FRICTION


class TestProfileTableInvariants:
  def test_profiles_cover_expected_modes(self):
    assert set(TORQUE_RESPONSE_PROFILES) == {0, 1, 2}

  def test_balanced_profile_is_neutral(self):
    assert TORQUE_RESPONSE_PROFILES[1] == (1.0, 1.0)

  def test_multipliers_keep_defaults_in_range(self):
    # applying any profile to the registered param defaults must not itself exceed the clip bounds
    for lat_mult, fric_mult in TORQUE_RESPONSE_PROFILES.values():
      assert MIN_LAT_ACCEL_FACTOR <= DEFAULT_LAT_ACCEL_FACTOR * lat_mult <= MAX_LAT_ACCEL_FACTOR
      assert MIN_FRICTION <= DEFAULT_FRICTION * fric_mult <= MAX_FRICTION
