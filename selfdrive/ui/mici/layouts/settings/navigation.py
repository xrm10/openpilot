from openpilot.common.params import Params
from openpilot.selfdrive.ui.mici.widgets.button import BigMultiToggle, BigParamControl, GreyBigButton
from openpilot.selfdrive.ui.ui_state import ui_state
from openpilot.system.ui.widgets.scroller import NavScroller


class NavigationStatusCard(GreyBigButton):
  def __init__(self, text: str, value_callback):
    super().__init__(text, "")
    self._value_callback = value_callback

  def refresh(self):
    self.set_value(self._value_callback())

  def _update_state(self):
    super()._update_state()
    self.refresh()


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

    self._map_status = NavigationStatusCard("map status", self._map_status_text)
    self._speed_status = NavigationStatusCard("speed limit", self._speed_status_text)
    self._source_status = NavigationStatusCard("source", self._source_status_text)

    self._road_names = BigParamControl("road names", "RoadNameToggle")
    self._local_osm = BigParamControl("local maps", "OsmLocal")
    self._smart_cruise_map = BigParamControl("smart cruise map", "SmartCruiseControlMap")
    self._smart_cruise_vision = BigParamControl("smart cruise vision", "SmartCruiseControlVision")

    self._speed_limit_mode = BigMappedParamToggle(
      "speed assist",
      "SpeedLimitMode",
      [(0, "off"), (1, "info"), (2, "warning"), (3, "assist")],
    )
    self._speed_limit_source = BigMappedParamToggle(
      "speed source",
      "SpeedLimitPolicy",
      [(0, "car"), (1, "map"), (2, "car first"), (3, "map first"), (4, "combined")],
    )

    self._refresh_controls = [
      self._map_status,
      self._speed_status,
      self._source_status,
      self._road_names,
      self._local_osm,
      self._smart_cruise_map,
      self._smart_cruise_vision,
      self._speed_limit_mode,
      self._speed_limit_source,
    ]

    self._scroller.add_widgets([
      self._map_status,
      self._speed_status,
      self._source_status,
      self._road_names,
      self._local_osm,
      self._smart_cruise_map,
      self._smart_cruise_vision,
      self._speed_limit_mode,
      self._speed_limit_source,
    ])

  def _map_status_text(self) -> str:
    version = self._params.get("MapdVersion") or "not installed"
    area = self._params.get("OsmLocationName") or self._params.get("OsmStateName") or "no area"
    return f"mapd {version}\n{area}"

  def _speed_status_text(self) -> str:
    try:
      speed = float(self._params.get("MapSpeedLimit") or 0.0)
    except ValueError:
      speed = 0.0
    if speed <= 0.0:
      return "unavailable"
    unit = "km/h" if ui_state.is_metric else "mph"
    return f"{speed:.0f} {unit}"

  def _source_status_text(self) -> str:
    policy = self._int_param("SpeedLimitPolicy", 3)
    policy_names = {
      0: "car only",
      1: "map only",
      2: "car first",
      3: "map first",
      4: "combined",
    }
    return policy_names.get(policy, "map first")

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
    cruise_available = has_cp and (has_long or has_icbm)

    self._smart_cruise_map.set_enabled(cruise_available)
    self._smart_cruise_vision.set_enabled(cruise_available)

    if has_cp:
      sla_disallow_in_release = ui_state.CP.brand == "tesla" and ui_state.is_sp_release
      sla_available = cruise_available and not sla_disallow_in_release and ui_state.CP.brand != "rivian"
    else:
      sla_available = False
    self._speed_limit_mode.set_enabled_values(None if sla_available else {0, 1, 2})
    if not sla_available and self._int_param("SpeedLimitMode", 1) > 2:
      self._params.put("SpeedLimitMode", 2)
      self._speed_limit_mode.refresh()

  def show_event(self):
    super().show_event()
    self._refresh()
