from openpilot.common.params import Params
from openpilot.selfdrive.ui.mici.layouts.settings.navigation import BigMappedParamToggle, NavigationStatusCard
from openpilot.selfdrive.ui.mici.widgets.button import BigButton, BigParamControl
from openpilot.system.ui.widgets.scroller import NavScroller
from openpilot.sunnypilot.xrm10.v12 import (
  PROFILE_COMFORT,
  PROFILE_BALANCED,
  PROFILE_RESPONSIVE,
  SNAPSHOT_COMMAND_COMFORT_DAILY,
  SNAPSHOT_COMMAND_FACTORY_SAFE,
  SNAPSHOT_COMMAND_RESTORE,
  SNAPSHOT_COMMAND_SAVE,
  SNAPSHOT_COMMAND_SPORT_RESPONSIVE,
  apply_factory_safe,
  apply_performance_profile,
  restore_snapshot,
  save_current_snapshot,
)


class ActionButton(BigButton):
  def __init__(self, text: str, value: str, callback):
    super().__init__(text, value)
    self.set_click_callback(callback)


class PerformanceProfileToggle(BigMappedParamToggle):
  def __init__(self):
    super().__init__(
      "profile",
      "Xrm10PerformanceProfile",
      [(PROFILE_COMFORT, "comfort"), (PROFILE_BALANCED, "balanced"), (PROFILE_RESPONSIVE, "responsive")],
    )

  def _handle_mouse_release(self, mouse_pos):
    super()._handle_mouse_release(mouse_pos)
    apply_performance_profile(self._params, self._param_value(), source="comma ui")


class SnapshotCommandToggle(BigMappedParamToggle):
  def __init__(self):
    super().__init__(
      "snapshot action",
      "Xrm10SnapshotCommand",
      [
        (0, "none"),
        (SNAPSHOT_COMMAND_SAVE, "save"),
        (SNAPSHOT_COMMAND_RESTORE, "restore"),
        (SNAPSHOT_COMMAND_FACTORY_SAFE, "safe"),
        (SNAPSHOT_COMMAND_SPORT_RESPONSIVE, "sport"),
        (SNAPSHOT_COMMAND_COMFORT_DAILY, "comfort"),
      ],
    )


class PerformanceLayoutMici(NavScroller):
  def __init__(self):
    super().__init__()
    self._params = Params()

    self._profile = PerformanceProfileToggle()
    self._health = NavigationStatusCard("drive health", lambda: self._status("Xrm10DriveHealthStatus"))
    self._route = NavigationStatusCard("route confidence", lambda: self._status("Xrm10RouteConfidenceStatus"))
    self._torque = NavigationStatusCard("torque assistant", lambda: self._status("Xrm10TorqueTuningStatus"))
    self._map_quality = NavigationStatusCard("map quality", lambda: self._status("Xrm10MapQualityStatus"))
    self._events = NavigationStatusCard("event history", lambda: self._status("Xrm10EventHistoryStatus"))
    self._logging = NavigationStatusCard("remote logging", lambda: self._status("Xrm10LoggingStatus"))
    self._snapshot = NavigationStatusCard("snapshot", lambda: self._status("Xrm10SnapshotStatus"))
    self._replay_test = BigParamControl("replay test mode", "Xrm10ReplayTestMode")
    self._logging_mode = BigMappedParamToggle(
      "logging mode",
      "Xrm10RemoteLoggingMode",
      [(0, "standard"), (1, "queue"), (2, "priority")],
    )
    self._snapshot_command = SnapshotCommandToggle()

    save_btn = ActionButton("save current", "last good", lambda: save_current_snapshot(self._params))
    restore_btn = ActionButton("restore last", "snapshot", lambda: restore_snapshot(self._params))
    safe_btn = ActionButton("factory safe", "conservative", lambda: apply_factory_safe(self._params))
    comfort_btn = ActionButton("comfort daily", "profile", lambda: apply_performance_profile(self._params, PROFILE_COMFORT, source="comma ui"))
    sport_btn = ActionButton("sport responsive", "profile", lambda: apply_performance_profile(self._params, PROFILE_RESPONSIVE, source="comma ui"))

    self._refresh_controls = [
      self._profile,
      self._health,
      self._route,
      self._torque,
      self._map_quality,
      self._events,
      self._logging,
      self._snapshot,
      self._replay_test,
      self._logging_mode,
      self._snapshot_command,
    ]

    self._scroller.add_widgets([
      self._profile,
      self._health,
      self._route,
      self._torque,
      self._map_quality,
      self._events,
      self._logging,
      self._snapshot,
      self._replay_test,
      self._logging_mode,
      self._snapshot_command,
      save_btn,
      restore_btn,
      safe_btn,
      comfort_btn,
      sport_btn,
    ])

  def _status(self, key: str) -> str:
    return self._params.get(key) or "waiting"

  def _refresh(self):
    for control in self._refresh_controls:
      control.refresh()

  def _update_state(self):
    super()._update_state()
    self._refresh()

  def show_event(self):
    super().show_event()
    self._refresh()
