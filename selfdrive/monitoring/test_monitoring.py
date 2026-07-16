import numpy as np
import pytest

from cereal import log, car
from openpilot.common.realtime import DT_DMON
from openpilot.selfdrive.monitoring.policy import DriverMonitoring, DRIVER_MONITOR_SETTINGS

EventName = log.OnroadEvent.EventName
dm_settings = DRIVER_MONITOR_SETTINGS()

TEST_TIMESPAN = 120  # seconds
DISTRACTED_SECONDS_TO_ORANGE = dm_settings._VISION_POLICY_ALERT_2_TIMEOUT + 1
DISTRACTED_SECONDS_TO_RED = dm_settings._VISION_POLICY_ALERT_3_TIMEOUT + 1
INVISIBLE_SECONDS_TO_ORANGE = dm_settings._WHEELTOUCH_POLICY_ALERT_2_TIMEOUT + 1
INVISIBLE_SECONDS_TO_RED = dm_settings._WHEELTOUCH_POLICY_ALERT_3_TIMEOUT + 1

def make_msg(face_detected, distracted=False, model_uncertain=False):
  ds = log.DriverStateV2.new_message()
  ds.leftDriverData.faceOrientation = [0., 0., 0.]
  ds.leftDriverData.facePosition = [0., 0.]
  ds.leftDriverData.faceProb = 1. * face_detected
  ds.leftDriverData.leftEyeProb = 1.
  ds.leftDriverData.rightEyeProb = 1.
  ds.leftDriverData.leftBlinkProb = 1. * distracted
  ds.leftDriverData.rightBlinkProb = 1. * distracted
  ds.leftDriverData.faceOrientationStd = [1.*model_uncertain, 1.*model_uncertain, 1.*model_uncertain]
  ds.leftDriverData.facePositionStd = [1.*model_uncertain, 1.*model_uncertain]
  # TODO: test both separately when e2e is used
  ds.leftDriverData.phoneProb = 0.
  return ds


# driver state from neural net, 10Hz
msg_NO_FACE_DETECTED = make_msg(False)
msg_ATTENTIVE = make_msg(True)
msg_DISTRACTED = make_msg(True, distracted=True)
msg_ATTENTIVE_UNCERTAIN = make_msg(True, model_uncertain=True)
msg_DISTRACTED_UNCERTAIN = make_msg(True, distracted=True, model_uncertain=True)
msg_DISTRACTED_BUT_SOMEHOW_UNCERTAIN = make_msg(True, distracted=True, model_uncertain=dm_settings._HI_STD_THRESHOLD*1.5)

# driver interaction with car
car_interaction_DETECTED = True
car_interaction_NOT_DETECTED = False

# some common state vectors
always_no_face = [msg_NO_FACE_DETECTED] * int(TEST_TIMESPAN / DT_DMON)
always_attentive = [msg_ATTENTIVE] * int(TEST_TIMESPAN / DT_DMON)
always_distracted = [msg_DISTRACTED] * int(TEST_TIMESPAN / DT_DMON)
always_true = [True] * int(TEST_TIMESPAN / DT_DMON)
always_false = [False] * int(TEST_TIMESPAN / DT_DMON)

class TestMonitoring:
  def _run_seq(self, msgs, interaction, engaged, standstill):
    DM = DriverMonitoring()
    alert_lvls = []
    for idx in range(len(msgs)):
      DM._update_states(msgs[idx], [0, 0, 0], 0, engaged[idx], standstill[idx])
      # cal_rpy and car_speed don't matter here

      # evaluate events at 10Hz for tests
      DM._update_events(interaction[idx], engaged[idx], standstill[idx], 0)
      alert_lvls.append(DM.alert_level)
    assert len(alert_lvls) == len(msgs), f"got {len(alert_lvls)} for {len(msgs)} driverState input msgs"
    return alert_lvls, DM


  # engaged, driver is attentive all the time
  def test_fully_aware_driver(self):
    alert_lvls, d_status = self._run_seq(always_attentive, always_false, always_true, always_false)
    assert all(a == 0 for a in alert_lvls)
    assert d_status.active_policy == log.DriverMonitoringState.MonitoringPolicy.vision

  # engaged, driver is distracted and does nothing
  def test_fully_distracted_driver(self):
    alert_lvls, d_status = self._run_seq(always_distracted, always_false, always_true, always_false)
    s = d_status.settings
    assert alert_lvls[int(s._VISION_POLICY_ALERT_1_TIMEOUT / 2 / DT_DMON)] == 0
    assert alert_lvls[int((s._VISION_POLICY_ALERT_1_TIMEOUT + \
                    (s._VISION_POLICY_ALERT_2_TIMEOUT - s._VISION_POLICY_ALERT_1_TIMEOUT) / 2) / DT_DMON)] == 1
    assert alert_lvls[int((s._VISION_POLICY_ALERT_2_TIMEOUT + \
                    (s._VISION_POLICY_ALERT_3_TIMEOUT - s._VISION_POLICY_ALERT_2_TIMEOUT) / 2) / DT_DMON)] == 2
    assert alert_lvls[int((s._VISION_POLICY_ALERT_3_TIMEOUT + \
                    (TEST_TIMESPAN - 10 - s._VISION_POLICY_ALERT_3_TIMEOUT) / 2) / DT_DMON)] == 3
    assert isinstance(d_status.awareness, float)

  # engaged, no face detected the whole time, no action
  def test_fully_invisible_driver(self):
    alert_lvls, d_status = self._run_seq(always_no_face, always_false, always_true, always_false)
    s = d_status.settings
    assert alert_lvls[int(s._WHEELTOUCH_POLICY_ALERT_1_TIMEOUT / 2 / DT_DMON)] == 0
    assert alert_lvls[int((s._WHEELTOUCH_POLICY_ALERT_1_TIMEOUT + \
                    (s._WHEELTOUCH_POLICY_ALERT_2_TIMEOUT - s._WHEELTOUCH_POLICY_ALERT_1_TIMEOUT) / 2) / DT_DMON)] == 1
    assert alert_lvls[int((s._WHEELTOUCH_POLICY_ALERT_2_TIMEOUT + \
                    (s._WHEELTOUCH_POLICY_ALERT_3_TIMEOUT - s._WHEELTOUCH_POLICY_ALERT_2_TIMEOUT) / 2) / DT_DMON)] == 2
    assert alert_lvls[int((s._WHEELTOUCH_POLICY_ALERT_3_TIMEOUT + \
                    (TEST_TIMESPAN - 10 - s._WHEELTOUCH_POLICY_ALERT_3_TIMEOUT) / 2) / DT_DMON)] == 3
    assert d_status.active_policy == log.DriverMonitoringState.MonitoringPolicy.wheeltouch

  # engaged, down to orange, driver pays attention, back to normal; then down to orange, driver touches wheel
  #  - should have short orange recovery time and no green afterwards; wheel touch only recovers when paying attention
  def test_normal_driver(self):
    ds_vector = [msg_DISTRACTED] * int(DISTRACTED_SECONDS_TO_ORANGE/DT_DMON) + \
                [msg_ATTENTIVE] * int(DISTRACTED_SECONDS_TO_ORANGE/DT_DMON) + \
                [msg_DISTRACTED] * int((DISTRACTED_SECONDS_TO_ORANGE+2)/DT_DMON) + \
                [msg_ATTENTIVE] * (int(TEST_TIMESPAN/DT_DMON)-int((DISTRACTED_SECONDS_TO_ORANGE*3+2)/DT_DMON))
    interaction_vector = [car_interaction_NOT_DETECTED] * int(DISTRACTED_SECONDS_TO_ORANGE*3/DT_DMON) + \
                         [car_interaction_DETECTED] * (int(TEST_TIMESPAN/DT_DMON)-int(DISTRACTED_SECONDS_TO_ORANGE*3/DT_DMON))
    alert_lvls, _ = self._run_seq(ds_vector, interaction_vector, always_true, always_false)
    assert alert_lvls[int(DISTRACTED_SECONDS_TO_ORANGE*0.5/DT_DMON)] == 0
    assert alert_lvls[int((DISTRACTED_SECONDS_TO_ORANGE-0.1)/DT_DMON)] == 2
    assert alert_lvls[int(DISTRACTED_SECONDS_TO_ORANGE*1.5/DT_DMON)] == 0
    assert alert_lvls[int((DISTRACTED_SECONDS_TO_ORANGE*3-0.1)/DT_DMON)] == 2
    assert alert_lvls[int((DISTRACTED_SECONDS_TO_ORANGE*3+0.1)/DT_DMON)] == 2
    assert alert_lvls[int((DISTRACTED_SECONDS_TO_ORANGE*3+2.5)/DT_DMON)] == 0

  # engaged, down to orange, driver dodges camera, then comes back still distracted, down to red, \
  #                          driver dodges, and then touches wheel to no avail, disengages and reengages
  #  - orange/red alert should remain after disappearance, and only disengaging clears red
  def test_biggest_comma_fan(self):
    _invisible_time = 2  # seconds
    ds_vector = always_distracted[:]
    interaction_vector = always_false[:]
    op_vector = always_true[:]
    ds_vector[int(DISTRACTED_SECONDS_TO_ORANGE/DT_DMON):int((DISTRACTED_SECONDS_TO_ORANGE+_invisible_time)/DT_DMON)] \
                                                        = [msg_NO_FACE_DETECTED] * int(_invisible_time/DT_DMON)
    ds_vector[int((DISTRACTED_SECONDS_TO_RED+_invisible_time)/DT_DMON):int((DISTRACTED_SECONDS_TO_RED+2*_invisible_time)/DT_DMON)] \
                                                        = [msg_NO_FACE_DETECTED] * int(_invisible_time/DT_DMON)
    interaction_vector[int((DISTRACTED_SECONDS_TO_RED+2*_invisible_time+0.5)/DT_DMON):int((DISTRACTED_SECONDS_TO_RED+2*_invisible_time+1.5)/DT_DMON)] \
                                                        = [True] * int(1/DT_DMON)
    op_vector[int((DISTRACTED_SECONDS_TO_RED+2*_invisible_time+2.5)/DT_DMON):int((DISTRACTED_SECONDS_TO_RED+2*_invisible_time+3)/DT_DMON)] \
                                                        = [False] * int(0.5/DT_DMON)
    alert_lvls, _ = self._run_seq(ds_vector, interaction_vector, op_vector, always_false)
    assert alert_lvls[int((DISTRACTED_SECONDS_TO_ORANGE+0.5*_invisible_time)/DT_DMON)] == 2
    assert alert_lvls[int((DISTRACTED_SECONDS_TO_RED+1.5*_invisible_time)/DT_DMON)] == 3
    assert alert_lvls[int((DISTRACTED_SECONDS_TO_RED+2*_invisible_time+1.5)/DT_DMON)] == 3
    assert alert_lvls[int((DISTRACTED_SECONDS_TO_RED+2*_invisible_time+3.5)/DT_DMON)] == 0

  # engaged, invisible driver, down to orange, driver touches wheel; then down to orange again, driver appears
  #  - both actions should clear the alert, but momentary appearance should not
  def test_sometimes_transparent_commuter(self):
    _visible_time = np.random.choice([0.5, 10])
    ds_vector = always_no_face[:]*2
    interaction_vector = always_false[:]*2
    ds_vector[int((2*INVISIBLE_SECONDS_TO_ORANGE+1)/DT_DMON):int((2*INVISIBLE_SECONDS_TO_ORANGE+1+_visible_time)/DT_DMON)] = \
                                                                                             [msg_ATTENTIVE] * int(_visible_time/DT_DMON)
    interaction_vector[int((INVISIBLE_SECONDS_TO_ORANGE)/DT_DMON):int((INVISIBLE_SECONDS_TO_ORANGE+1)/DT_DMON)] = [True] * int(1/DT_DMON)
    alert_lvls, _ = self._run_seq(ds_vector, interaction_vector, 2*always_true, 2*always_false)
    assert alert_lvls[int(INVISIBLE_SECONDS_TO_ORANGE*0.5/DT_DMON)] == 0
    assert alert_lvls[int((INVISIBLE_SECONDS_TO_ORANGE-0.1)/DT_DMON)] == 2
    assert alert_lvls[int((INVISIBLE_SECONDS_TO_ORANGE+0.1)/DT_DMON)] == 0
    if _visible_time == 0.5:
      assert alert_lvls[int((INVISIBLE_SECONDS_TO_ORANGE*2+1-0.1)/DT_DMON)] == 2
      assert alert_lvls[int((INVISIBLE_SECONDS_TO_ORANGE*2+1+0.1+_visible_time)/DT_DMON)] == 1
    elif _visible_time == 10:
      assert alert_lvls[int((INVISIBLE_SECONDS_TO_ORANGE*2+1-0.1)/DT_DMON)] == 2
      assert alert_lvls[int((INVISIBLE_SECONDS_TO_ORANGE*2+1+0.1+_visible_time)/DT_DMON)] == 0

  # engaged, invisible driver, down to red, driver appears and then touches wheel, then disengages/reengages
  #  - only disengage will clear the alert
  def test_last_second_responder(self):
    _visible_time = 2  # seconds
    ds_vector = always_no_face[:]
    interaction_vector = always_false[:]
    op_vector = always_true[:]
    ds_vector[int(INVISIBLE_SECONDS_TO_RED/DT_DMON):int((INVISIBLE_SECONDS_TO_RED+_visible_time)/DT_DMON)] = [msg_ATTENTIVE] * int(_visible_time/DT_DMON)
    interaction_vector[int((INVISIBLE_SECONDS_TO_RED+_visible_time)/DT_DMON):int((INVISIBLE_SECONDS_TO_RED+_visible_time+1)/DT_DMON)] = [True] * int(1/DT_DMON)
    op_vector[int((INVISIBLE_SECONDS_TO_RED+_visible_time+1)/DT_DMON):int((INVISIBLE_SECONDS_TO_RED+_visible_time+0.5)/DT_DMON)] = [False] * int(0.5/DT_DMON)
    alert_lvls, _ = self._run_seq(ds_vector, interaction_vector, op_vector, always_false)
    assert alert_lvls[int(INVISIBLE_SECONDS_TO_ORANGE*0.5/DT_DMON)] == 0
    assert alert_lvls[int((INVISIBLE_SECONDS_TO_ORANGE-0.1)/DT_DMON)] == 2
    assert alert_lvls[int((INVISIBLE_SECONDS_TO_RED-0.1)/DT_DMON)] == 3
    assert alert_lvls[int((INVISIBLE_SECONDS_TO_RED+0.5*_visible_time)/DT_DMON)] == 3
    assert alert_lvls[int((INVISIBLE_SECONDS_TO_RED+_visible_time+0.5)/DT_DMON)] == 3
    assert alert_lvls[int((INVISIBLE_SECONDS_TO_RED+_visible_time+1+0.1)/DT_DMON)] == 0

  # disengaged, always distracted driver
  #  - dm should stay quiet when not engaged
  def test_pure_dashcam_user(self):
    alert_lvls, _ = self._run_seq(always_distracted, always_false, always_false, always_false)
    assert all(a == 0 for a in alert_lvls)

  # engaged, car stops at traffic light, down to orange, no action, then car starts moving
  #  - should only reach green when stopped, but continues counting down on launch
  def test_long_traffic_light_victim(self):
    _redlight_time = 60  # seconds
    standstill_vector = always_true[:]
    standstill_vector[int(_redlight_time/DT_DMON):] = [False] * int((TEST_TIMESPAN-_redlight_time)/DT_DMON)
    alert_lvls, d_status = self._run_seq(always_distracted, always_false, always_true, standstill_vector)
    s = d_status.settings
    assert alert_lvls[int((_redlight_time-0.1)/DT_DMON)] == 0
    _alert_1_to_2 = s._VISION_POLICY_ALERT_2_TIMEOUT - s._VISION_POLICY_ALERT_1_TIMEOUT
    assert alert_lvls[int((_redlight_time+0.5)/DT_DMON)] == 1
    assert alert_lvls[int((_redlight_time+_alert_1_to_2+0.5)/DT_DMON)] == 2

  # engaged, distracted while moving, then car stops after reaching orange
  #  - should reset timer to pre green at standstill
  def test_distracted_then_stops(self):
    _stop_time = DISTRACTED_SECONDS_TO_ORANGE + 1  # stop 1 second after reaching orange
    standstill_vector = always_false[:]
    standstill_vector[int(_stop_time/DT_DMON):] = [True] * int((TEST_TIMESPAN-_stop_time)/DT_DMON)
    alert_lvls, _ = self._run_seq(always_distracted, always_false, always_true, standstill_vector)
    # just before and briefly after stopping: orange alert; goes away quickly after stopped
    assert alert_lvls[int((_stop_time+0.1)/DT_DMON)] == 2
    assert alert_lvls[int((_stop_time+0.5)/DT_DMON)] == 0

  # engaged, model is somehow uncertain and driver is distracted
  #  - should fall back to wheel touch after uncertain alert
  def test_somehow_indecisive_model(self):
    ds_vector = [msg_DISTRACTED_BUT_SOMEHOW_UNCERTAIN] * int(TEST_TIMESPAN/DT_DMON)
    interaction_vector = always_false[:]
    alert_lvls, d_status = self._run_seq(ds_vector, interaction_vector, always_true, always_false)
    s = d_status.settings
    assert alert_lvls[int((INVISIBLE_SECONDS_TO_ORANGE-1+DT_DMON*s._HI_STD_FALLBACK_TIME-0.1)/DT_DMON)] == 1
    assert alert_lvls[int((INVISIBLE_SECONDS_TO_ORANGE-1+DT_DMON*s._HI_STD_FALLBACK_TIME+0.1)/DT_DMON)] == 2
    assert alert_lvls[int((INVISIBLE_SECONDS_TO_RED-1+DT_DMON*s._HI_STD_FALLBACK_TIME+0.1)/DT_DMON)] == 3


class TestSensitivityProfileSettings:
  # DriverMonitoringSensitivity: 0 relaxed, 1 standard (default), 2 strict
  def _fresh(self):
    return DRIVER_MONITOR_SETTINGS()

  def test_default_profile_is_standard(self):
    assert self._fresh()._sensitivity_profile == 1

  def test_applying_same_profile_is_noop(self):
    s = self._fresh()
    assert s.apply_sensitivity_profile(1) is False

  def test_comfort_profile_relaxes_and_returns_true(self):
    s = self._fresh()
    defaults = dict(s._sensitivity_defaults)
    assert s.apply_sensitivity_profile(0) is True
    assert s._sensitivity_profile == 0
    # comfort delays warnings: timeouts grow, blink threshold rises
    assert s._VISION_POLICY_ALERT_1_TIMEOUT > defaults["_VISION_POLICY_ALERT_1_TIMEOUT"]
    assert s._VISION_POLICY_ALERT_2_TIMEOUT > defaults["_VISION_POLICY_ALERT_2_TIMEOUT"]
    assert s._VISION_POLICY_ALERT_3_TIMEOUT > defaults["_VISION_POLICY_ALERT_3_TIMEOUT"]
    assert s._BLINK_THRESHOLD > defaults["_BLINK_THRESHOLD"]
    assert s._POSE_PITCH_THRESHOLD > defaults["_POSE_PITCH_THRESHOLD"]

  def test_strict_profile_tightens_and_returns_true(self):
    s = self._fresh()
    defaults = dict(s._sensitivity_defaults)
    assert s.apply_sensitivity_profile(2) is True
    assert s._sensitivity_profile == 2
    assert s._VISION_POLICY_ALERT_1_TIMEOUT < defaults["_VISION_POLICY_ALERT_1_TIMEOUT"]
    assert s._VISION_POLICY_ALERT_2_TIMEOUT < defaults["_VISION_POLICY_ALERT_2_TIMEOUT"]
    assert s._VISION_POLICY_ALERT_3_TIMEOUT < defaults["_VISION_POLICY_ALERT_3_TIMEOUT"]
    assert s._BLINK_THRESHOLD < defaults["_BLINK_THRESHOLD"]
    assert s._POSE_PITCH_THRESHOLD < defaults["_POSE_PITCH_THRESHOLD"]

  def test_profile_clamped_high(self):
    s = self._fresh()
    s.apply_sensitivity_profile(5)
    assert s._sensitivity_profile == 2

  def test_profile_clamped_low(self):
    s = self._fresh()
    s.apply_sensitivity_profile(-3)
    assert s._sensitivity_profile == 0

  @pytest.mark.parametrize("bad", [None, "garbage", 1.9])
  def test_invalid_profile_falls_back_to_standard(self, bad):
    s = self._fresh()
    s.apply_sensitivity_profile(2)  # move away from the default first
    defaults = dict(s._sensitivity_defaults)
    s.apply_sensitivity_profile(bad)
    assert s._sensitivity_profile == 1
    # standard restores every managed threshold to its registered default
    for key, value in defaults.items():
      assert getattr(s, key) == value

  def test_returns_to_defaults_when_back_to_standard(self):
    s = self._fresh()
    defaults = dict(s._sensitivity_defaults)
    s.apply_sensitivity_profile(2)
    s.apply_sensitivity_profile(1)
    for key, value in defaults.items():
      assert getattr(s, key) == value

  def test_reapply_does_not_compound(self):
    # switching comfort -> strict must scale from defaults, not from the comfort values
    chained = self._fresh()
    chained.apply_sensitivity_profile(0)
    chained.apply_sensitivity_profile(2)
    direct = self._fresh()
    direct.apply_sensitivity_profile(2)
    for key in direct._sensitivity_defaults:
      assert getattr(chained, key) == getattr(direct, key)

  @pytest.mark.parametrize("profile", [0, 1, 2])
  def test_alert_timeout_ordering_preserved(self, profile):
    # monitoring stays well-formed in every profile: alerts escalate 1 -> 2 -> 3
    s = self._fresh()
    s.apply_sensitivity_profile(profile)
    assert s._VISION_POLICY_ALERT_1_TIMEOUT < s._VISION_POLICY_ALERT_2_TIMEOUT < s._VISION_POLICY_ALERT_3_TIMEOUT

  def test_comfort_stays_bounded(self):
    # comfort must not disable monitoring: the red-alert timeout stays capped, not open-ended
    s = self._fresh()
    s.apply_sensitivity_profile(0)
    assert s._VISION_POLICY_ALERT_1_TIMEOUT <= 3.5
    assert s._VISION_POLICY_ALERT_2_TIMEOUT <= 5.5
    assert s._VISION_POLICY_ALERT_3_TIMEOUT <= 12.0


class TestSensitivityProfileMonitoring:
  def _step(self, DM, msgs, engaged=True, interaction=False, standstill=False):
    alert_lvls = []
    for msg in msgs:
      DM._update_states(msg, [0, 0, 0], 0, engaged, standstill)
      DM._update_events(interaction, engaged, standstill, 0)
      alert_lvls.append(DM.alert_level)
    return alert_lvls

  def test_set_profile_refreshes_thresholds(self):
    DM = DriverMonitoring()
    step_before = DM.step_change
    t1_before = DM.threshold_alert_1
    DM.set_sensitivity_profile(2)  # strict -> shorter red timeout -> faster decay
    assert DM.step_change > step_before
    assert DM.threshold_alert_1 != t1_before

  def test_noop_profile_leaves_state_untouched(self):
    DM = DriverMonitoring()
    DM.awareness = 0.5
    step_before, t1_before, t2_before = DM.step_change, DM.threshold_alert_1, DM.threshold_alert_2
    DM.set_sensitivity_profile(1)  # already standard -> no-op
    assert DM.awareness == 0.5
    assert (DM.step_change, DM.threshold_alert_1, DM.threshold_alert_2) == (step_before, t1_before, t2_before)

  def test_profile_change_cannot_downgrade_active_alert(self):
    # a driver at the orange boundary must not be bumped to a less severe band by a profile switch
    DM = DriverMonitoring()
    DM.awareness = DM.threshold_alert_2
    assert DM._current_alert_band() == 2
    DM.set_sensitivity_profile(0)  # comfort shifts the thresholds
    assert DM._current_alert_band() >= 2
    assert DM.awareness <= DM.threshold_alert_2

  @pytest.mark.parametrize("profile", [0, 2])
  def test_monitoring_not_disabled_by_profile(self, profile):
    # a permanently distracted driver still escalates to red regardless of sensitivity profile
    DM = DriverMonitoring()
    DM.set_sensitivity_profile(profile)
    alert_lvls = self._step(DM, always_distracted)
    assert max(alert_lvls) == 3

  def test_strict_alerts_no_later_than_standard(self):
    dm_standard = DriverMonitoring()
    dm_strict = DriverMonitoring()
    dm_strict.set_sensitivity_profile(2)
    std = self._step(dm_standard, always_distracted)
    strict = self._step(dm_strict, always_distracted)
    assert strict.index(3) <= std.index(3)


def _build_sm(selfdrive_enabled, lat_active, steering_pressed, gas_pressed):
  cs = car.CarState.new_message()
  cs.vEgo = 30.0
  cs.gearShifter = car.CarState.GearShifter.drive
  cs.steeringPressed = steering_pressed
  cs.gasPressed = gas_pressed
  ss = log.SelfdriveState.new_message()
  ss.enabled = selfdrive_enabled
  cc = car.CarControl.new_message()
  cc.latActive = lat_active
  mv2 = log.ModelDataV2.new_message()
  mv2.meta.disengagePredictions.brakeDisengageProbs = [0.0]
  lc = log.LiveCalibrationData.new_message()
  lc.rpyCalib = [0.0, 0.0, 0.0]
  return {
    'carState': cs, 'selfdriveState': ss, 'carControl': cc,
    'modelV2': mv2, 'liveCalibration': lc, 'driverStateV2': make_msg(False),
  }


@pytest.mark.parametrize("selfdrive_enabled, lat_active, steering, gas, expected_op_engaged, expected_driver_engaged", [
  (False, False, False, False, False, False),  # disabled
  (True,  False, False, False, True,  False),  # OP enabled
  (False, True,  False, False, True,  False),  # MADS lat-only
  (True,  True,  False, False, True,  False),  # both active
  (False, True,  False, True,  True,  False),  # MADS lat-only + gas
  (True,  True,  False, True,  True,  True),   # full op + gas: override
  (False, True,  True,  False, True,  True),   # MADS lat-only + wheel touch: override
])
def test_run_step_engagement(selfdrive_enabled, lat_active, steering, gas,
                             expected_op_engaged, expected_driver_engaged):
  sm = _build_sm(selfdrive_enabled, lat_active, steering, gas)
  dm = DriverMonitoring()
  captured = {}
  orig = dm._update_events

  def spy(driver_engaged, op_engaged, standstill, wrong_gear):
    captured['driver_engaged'] = driver_engaged
    captured['op_engaged'] = op_engaged
    return orig(driver_engaged, op_engaged, standstill, wrong_gear)

  dm._update_events = spy
  dm.run_step(sm, demo=False)
  assert captured['op_engaged'] == expected_op_engaged
  assert captured['driver_engaged'] == expected_driver_engaged
