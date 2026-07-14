from cereal import car

from openpilot.common.params import Params
from openpilot.selfdrive.ui.mici.widgets.button import BigMultiParamToggle, BigMultiToggle, BigParamControl
from openpilot.selfdrive.ui.ui_state import ui_state
from openpilot.system.ui.widgets.scroller import NavScroller


class BigMappedParamToggle(BigMultiToggle):
  def __init__(self, text: str, param: str, options: list[tuple[int, str]]):
    self._param = param
    self._values = [value for value, _ in options]
    self._params = Params()
    self._enabled_values: set[int] | None = None
    super().__init__(text, [label for _, label in options])
    self.refresh()

  def _param_value(self) -> int:
    try:
      return int(self._params.get(self._param, return_default=True))
    except (TypeError, ValueError):
      return self._values[0]

  def refresh(self):
    value = self._param_value()
    idx = self._values.index(value) if value in self._values else 0
    self.set_value(self._options[idx])

  def set_enabled_values(self, values: set[int] | None):
    self._enabled_values = values

  def _handle_mouse_release(self, mouse_pos):
    if not self.enabled:
      return

    cur_idx = self._options.index(self.value)
    for step in range(1, len(self._options) + 1):
      new_idx = (cur_idx + step) % len(self._options)
      if self._enabled_values is None or self._values[new_idx] in self._enabled_values:
        self.set_value(self._options[new_idx])
        self._params.put(self._param, self._values[new_idx])
        return


class NavigationLayoutMici(NavScroller):
  def __init__(self):
    super().__init__()
    self._params = Params()

    self._dm_comfort = BigMultiParamToggle(
      "monitoring comfort", "Xrm10DmComfortProfile", ["standard", "comfort", "strict"]
    )
    self._dynamic_experimental = BigParamControl("dynamic experimental", "DynamicExperimentalControl")
    self._smart_cruise_vision = BigParamControl("smart cruise vision", "SmartCruiseControlVision")
    self._smart_cruise_map = BigParamControl("smart cruise map", "SmartCruiseControlMap")
    self._road_names = BigParamControl("road names", "RoadNameToggle")
    self._local_osm = BigParamControl("local maps", "OsmLocal")

    self._speed_limit_mode = BigMappedParamToggle(
      "speed limit assist",
      "SpeedLimitMode",
      [(0, "off"), (1, "info"), (2, "warning"), (3, "assist")],
    )
    self._speed_limit_source = BigMappedParamToggle(
      "speed source",
      "SpeedLimitPolicy",
      [(0, "car"), (1, "map"), (2, "car first"), (3, "map first"), (4, "combined")],
    )
    self._lane_change = BigMappedParamToggle(
      "lane change",
      "AutoLaneChangeTimer",
      [(-1, "off"), (0, "nudge"), (1, "nudgeless"), (2, "0.5s"), (3, "1s"), (4, "2s"), (5, "3s")],
    )
    self._bsm_delay = BigParamControl("blind spot delay", "AutoLaneChangeBsmDelay")

    self._torque_self_tune = BigParamControl("torque self tune", "LiveTorqueParamsToggle")
    self._torque_relaxed = BigParamControl("relaxed torque", "LiveTorqueParamsRelaxedToggle")
    self._custom_torque = BigParamControl("custom torque", "CustomTorqueParams")
    self._manual_torque = BigParamControl("manual torque", "TorqueParamsOverrideEnabled")

    self._refresh_controls = [
      self._dm_comfort,
      self._dynamic_experimental,
      self._smart_cruise_vision,
      self._smart_cruise_map,
      self._road_names,
      self._local_osm,
      self._speed_limit_mode,
      self._speed_limit_source,
      self._lane_change,
      self._bsm_delay,
      self._torque_self_tune,
      self._torque_relaxed,
      self._custom_torque,
      self._manual_torque,
    ]

    self._scroller.add_widgets([
      self._dm_comfort,
      self._dynamic_experimental,
      self._smart_cruise_vision,
      self._smart_cruise_map,
      self._road_names,
      self._local_osm,
      self._speed_limit_mode,
      self._speed_limit_source,
      self._lane_change,
      self._bsm_delay,
      self._torque_self_tune,
      self._torque_relaxed,
      self._custom_torque,
      self._manual_torque,
    ])

  def _refresh(self):
    for control in self._refresh_controls:
      control.refresh()

  def _int_param(self, key: str, default: int = 0) -> int:
    try:
      return int(self._params.get(key, return_default=True))
    except (TypeError, ValueError):
      return default

  def _update_state(self):
    super()._update_state()
    self._refresh()
    has_cp = ui_state.CP is not None
    has_long = has_cp and ui_state.has_longitudinal_control
    has_icbm = has_cp and ui_state.has_icbm
    experimental_enabled = self._params.get_bool("ExperimentalMode")
    cruise_available = has_cp and (has_long or has_icbm)

    self._dynamic_experimental.set_enabled(has_long and experimental_enabled)
    self._smart_cruise_vision.set_enabled(cruise_available and experimental_enabled)
    self._smart_cruise_map.set_enabled(cruise_available and experimental_enabled)

    if has_cp:
      sla_disallow_in_release = ui_state.CP.brand == "tesla" and ui_state.is_sp_release
      sla_available = cruise_available and not sla_disallow_in_release and ui_state.CP.brand != "rivian"
    else:
      sla_available = False
    self._speed_limit_mode.set_enabled_values(None if sla_available else {0, 1, 2})
    if not sla_available and self._int_param("SpeedLimitMode", 1) > 2:
      self._params.put("SpeedLimitMode", 2)
      self._speed_limit_mode.refresh()

    enable_bsm = has_cp and ui_state.CP.enableBsm and self._int_param("AutoLaneChangeTimer") > 0
    self._bsm_delay.set_enabled(enable_bsm)
    if not enable_bsm and self._params.get_bool("AutoLaneChangeBsmDelay"):
      self._params.remove("AutoLaneChangeBsmDelay")
      self._bsm_delay.set_checked(False)

    torque_allowed = has_cp and ui_state.CP.steerControlType != car.CarParams.SteerControlType.angle
    offroad = ui_state.is_offroad()
    live_torque_enabled = self._params.get_bool("LiveTorqueParamsToggle")
    self._torque_self_tune.set_enabled(offroad and torque_allowed)
    self._torque_relaxed.set_enabled(offroad and torque_allowed and live_torque_enabled)
    self._custom_torque.set_enabled(offroad and torque_allowed)
    self._manual_torque.set_visible(self._params.get_bool("CustomTorqueParams"))
    self._manual_torque.set_enabled(offroad and torque_allowed and self._params.get_bool("CustomTorqueParams"))

  def show_event(self):
    super().show_event()
    self._refresh()
