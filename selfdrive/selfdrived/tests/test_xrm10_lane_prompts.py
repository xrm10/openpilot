from cereal import log

from openpilot.selfdrive.selfdrived.events import EVENTS, ET


EventName = log.OnroadEvent.EventName


def get_warning(event_name):
  return EVENTS[event_name][ET.WARNING]


def test_xrm10_lane_change_confirmation_prompts_are_explicit():
  left = get_warning(EventName.preLaneChangeLeft)
  right = get_warning(EventName.preLaneChangeRight)

  assert left.alert_text_1 == "Nudge Left to Confirm"
  assert right.alert_text_1 == "Nudge Right to Confirm"
  assert left.alert_text_2 == "Check mirrors and blind spot"
  assert right.alert_text_2 == "Check mirrors and blind spot"


def test_xrm10_lane_assist_limit_prompt_requests_takeover():
  alert = get_warning(EventName.steerSaturated)

  assert alert.alert_text_1 == "Take Control"
  assert alert.alert_text_2 == "Lane assist at limit"


def test_xrm10_blind_spot_prompt_is_clear():
  alert = get_warning(EventName.laneChangeBlocked)

  assert alert.alert_text_1 == "Blind Spot Detected"
  assert alert.alert_text_2 == ""
