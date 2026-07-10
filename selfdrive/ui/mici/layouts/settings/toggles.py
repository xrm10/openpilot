from pathlib import Path

from cereal import log

from openpilot.system.ui.widgets.scroller import NavScroller
from openpilot.selfdrive.ui.mici.widgets.button import BigParamControl, BigMultiParamToggle, BigToggle
from openpilot.system.ui.lib.application import gui_app
from openpilot.selfdrive.ui.layouts.settings.common import restart_needed_callback
from openpilot.selfdrive.ui.ui_state import ui_state
from openpilot.selfdrive.ui.mici.layouts.settings.xrm10_smart import Xrm10ColorCard

PERSONALITY_TO_INT = log.LongitudinalPersonality.schema.enumerants
XRM10_PARAM_DIR = Path("/data/params/d")


def read_xrm10_bool(key: str, default: bool = False) -> bool:
  try:
    value = (XRM10_PARAM_DIR / key).read_text().strip().lower()
    return value in ("1", "true")
  except OSError:
    return default


def write_xrm10_bool(key: str, value: bool) -> None:
  try:
    (XRM10_PARAM_DIR / key).write_text("1" if value else "0")
  except OSError:
    pass


class RawBigParamControl(BigToggle):
  def __init__(self, text: str, param: str, value: str = "", default: bool = False):
    super().__init__(text, value)
    self.param = param
    self.default = default
    self.refresh()

  def _handle_mouse_release(self, mouse_pos):
    super()._handle_mouse_release(mouse_pos)
    write_xrm10_bool(self.param, self._checked)

  def refresh(self):
    self.set_checked(read_xrm10_bool(self.param, self.default))


class TogglesLayoutMici(NavScroller):
  def __init__(self):
    super().__init__()

    self._personality_toggle = BigMultiParamToggle("driving personality", "LongitudinalPersonality", ["aggressive", "standard", "relaxed"])
    self._experimental_btn = BigParamControl("experimental mode", "ExperimentalMode")
    is_metric_toggle = BigParamControl("use metric units", "IsMetric")
    ldw_toggle = BigParamControl("lane departure warnings", "IsLdwEnabled")
    always_on_dm_toggle = BigParamControl("always-on driver monitor", "AlwaysOnDM")
    self._dm_sensitivity_toggle = BigMultiParamToggle("driver monitor sensitivity", "DriverMonitoringSensitivity",
                                                      ["relaxed", "standard", "strict"])
    record_front = BigParamControl("record & upload driver camera", "RecordFront", toggle_callback=restart_needed_callback)
    record_mic = BigParamControl("record & upload mic audio", "RecordAudio", toggle_callback=restart_needed_callback)
    enable_openpilot = BigParamControl("enable sunnypilot", "OpenpilotEnabledToggle", toggle_callback=restart_needed_callback)
    smart_review_loop = RawBigParamControl("codex review loop", "Xrm10CodexReviewLoop", "package logs for review", True)
    auto_decode = RawBigParamControl("auto decode evidence", "Xrm10CodexAutoDecode", "read logs without applying code", True)
    nav_auto_start = RawBigParamControl("nav auto-start from app", "Xrm10NavAutoStart", "show destination when app route starts", True)
    route_intent = RawBigParamControl("route intent on comma UI", "Xrm10CarScreenRouteIntent", "mirror route status from bridge", True)
    nav_active = RawBigParamControl("active route display", "Xrm10NavActive", "display only, no car control", False)
    self._nav_auto_start = nav_auto_start
    self._route_intent = route_intent
    self._nav_active = nav_active
    self._smart_review_loop = smart_review_loop
    self._auto_decode = auto_decode

    self._scroller.add_widgets([
      Xrm10ColorCard("xrm10 smart", "review and decode only\nauto apply locked off", "cyan"),
      smart_review_loop,
      auto_decode,
      Xrm10ColorCard("safety gate", "no phone/live UI command can steer, brake, or change lanes\nmanual code review required", "red"),
      Xrm10ColorCard("navigation intent", "destination, route status, and app sync\nno steering/brake command", "blue"),
      nav_auto_start,
      route_intent,
      nav_active,
      Xrm10ColorCard("drive profile", "standard openpilot toggles", "purple"),
      self._personality_toggle,
      self._experimental_btn,
      enable_openpilot,
      Xrm10ColorCard("comfort and recording", "display units and optional uploads", "grey"),
      is_metric_toggle,
      ldw_toggle,
      always_on_dm_toggle,
      self._dm_sensitivity_toggle,
      record_front,
      record_mic,
    ])

    # Toggle lists
    self._refresh_toggles = (
      ("ExperimentalMode", self._experimental_btn),
      ("IsMetric", is_metric_toggle),
      ("IsLdwEnabled", ldw_toggle),
      ("AlwaysOnDM", always_on_dm_toggle),
      ("RecordFront", record_front),
      ("RecordAudio", record_mic),
      ("OpenpilotEnabledToggle", enable_openpilot),
    )

    enable_openpilot.set_enabled(lambda: not ui_state.engaged)
    record_front.set_enabled(False if ui_state.params.get_bool("RecordFrontLock") else (lambda: not ui_state.engaged))
    record_mic.set_enabled(lambda: not ui_state.engaged)

    if ui_state.params.get_bool("ShowDebugInfo"):
      gui_app.set_show_touches(True)
      gui_app.set_show_fps(True)

    ui_state.add_engaged_transition_callback(self._update_toggles)

  def _update_state(self):
    super()._update_state()

    if ui_state.sm.updated["selfdriveState"]:
      personality = PERSONALITY_TO_INT[ui_state.sm["selfdriveState"].personality]
      if personality != ui_state.personality and ui_state.started:
        self._personality_toggle.set_value(self._personality_toggle._options[personality])
      ui_state.personality = personality

  def show_event(self):
    super().show_event()
    self._update_toggles()

  def _update_toggles(self):
    ui_state.update_params()

    # CP gating for experimental mode
    if ui_state.CP is not None:
      if ui_state.has_longitudinal_control:
        self._experimental_btn.set_visible(True)
        self._personality_toggle.set_visible(True)
      else:
        # no long for now
        self._experimental_btn.set_visible(False)
        self._experimental_btn.set_checked(False)
        self._personality_toggle.set_visible(False)
        ui_state.params.remove("ExperimentalMode")

    # Refresh toggles from params to mirror external changes
    for key, item in self._refresh_toggles:
      item.set_checked(ui_state.params.get_bool(key))
    self._nav_auto_start.refresh()
    self._route_intent.refresh()
    self._nav_active.refresh()
    self._smart_review_loop.refresh()
    self._auto_decode.refresh()
    self._dm_sensitivity_toggle._load_value()
