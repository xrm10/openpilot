"""
Copyright (c) 2021-, Haibin Wen, sunnypilot, and a number of other contributors.

This file is part of sunnypilot and is licensed under the MIT License.
See the LICENSE.md file in the root directory for more details.
"""
from openpilot.common.params import Params
from openpilot.selfdrive.ui.ui_state import ui_state
from openpilot.system.ui.lib.multilang import tr
from openpilot.system.ui.sunnypilot.widgets.list_view import LineSeparatorSP, multiple_button_item_sp, option_item_sp, toggle_item_sp
from openpilot.system.ui.widgets.list_view import text_item
from openpilot.system.ui.widgets.scroller_tici import Scroller
from openpilot.system.ui.widgets import Widget

SPEED_LIMIT_MODE_BUTTONS = [lambda: tr("Off"), lambda: tr("Info"), lambda: tr("Warning"), lambda: tr("Assist")]
SPEED_LIMIT_POLICY_BUTTONS = [
  lambda: tr("Car"),
  lambda: tr("Map"),
  lambda: tr("Car First"),
  lambda: tr("Map First"),
  lambda: tr("Combined"),
]


class NavigationLayout(Widget):
  def __init__(self):
    super().__init__()

    self._params = Params()
    items = self._initialize_items()
    self._scroller = Scroller(items, line_separator=True, spacing=0)

  def _initialize_items(self):
    self._road_name_toggle = toggle_item_sp(
      title=lambda: tr("Map Road Names"),
      description=lambda: tr("Show available mapd/OSM road-name context in the driving UI."),
      param="RoadNameToggle",
      initial_state=self._params.get_bool("RoadNameToggle"),
    )
    self._osm_local_toggle = toggle_item_sp(
      title=lambda: tr("Use Local OSM Data"),
      description=lambda: tr("Prefer downloaded local OSM map data when available for map context and speed-limit sources."),
      param="OsmLocal",
      initial_state=self._params.get_bool("OsmLocal"),
    )
    self._mapd_version = text_item(
      lambda: tr("mapd Version"),
      lambda: self._params.get("MapdVersion") or tr("Not installed"),
      description=lambda: tr("Map data availability depends on mapd and downloaded OSM regions."),
    )
    self._osm_area = text_item(
      lambda: tr("OSM Area"),
      self._osm_area_text,
    )
    self._map_speed_limit = text_item(
      lambda: tr("Map Speed Limit"),
      self._map_speed_limit_text,
      description=lambda: tr("Live speed limit from mapd/OSM when available."),
    )
    self._next_map_speed_limit = text_item(
      lambda: tr("Next Map Speed Limit"),
      lambda: self._params.get("NextMapSpeedLimit") or tr("None"),
    )

    self._scc_vision_toggle = toggle_item_sp(
      title=lambda: tr("Smart Cruise - Vision"),
      description=lambda: tr("Uses vision path predictions to reduce speed for curves ahead when cruise support is available."),
      param="SmartCruiseControlVision",
      initial_state=self._params.get_bool("SmartCruiseControlVision"),
    )
    self._scc_map_toggle = toggle_item_sp(
      title=lambda: tr("Smart Cruise - Map"),
      description=lambda: tr("Uses map context to reduce speed for turns and road geometry when cruise support is available."),
      param="SmartCruiseControlMap",
      initial_state=self._params.get_bool("SmartCruiseControlMap"),
    )

    self._speed_limit_mode = multiple_button_item_sp(
      title=lambda: tr("Speed Limit Assist"),
      description=lambda: tr("Controls speed-limit display, warning, and assisted cruise-speed adjustment where supported."),
      buttons=SPEED_LIMIT_MODE_BUTTONS,
      button_width=360,
      param="SpeedLimitMode",
      selected_index=self._params.get("SpeedLimitMode", return_default=True),
      inline=False,
    )
    self._speed_limit_policy = multiple_button_item_sp(
      title=lambda: tr("Speed Limit Source"),
      description=lambda: tr("Choose whether speed limits prefer car state, map data, or a combined priority source."),
      buttons=SPEED_LIMIT_POLICY_BUTTONS,
      button_width=290,
      param="SpeedLimitPolicy",
      selected_index=self._params.get("SpeedLimitPolicy", return_default=True),
      inline=False,
    )
    self._speed_limit_offset_type = multiple_button_item_sp(
      title=lambda: tr("Speed Limit Offset"),
      description="",
      buttons=[lambda: tr("None"), lambda: tr("Fixed"), lambda: tr("%")],
      param="SpeedLimitOffsetType",
      button_width=450,
      selected_index=self._params.get("SpeedLimitOffsetType", return_default=True),
      inline=False,
    )
    self._speed_limit_value_offset = option_item_sp(
      title=lambda: tr("Offset Value"),
      param="SpeedLimitValueOffset",
      min_value=-30,
      max_value=30,
      description=lambda: tr("Offset applied to speed-limit assist when Fixed or Percent offset is selected."),
      label_callback=self._speed_limit_offset_label,
    )

    items = [
      self._road_name_toggle,
      self._osm_local_toggle,
      self._mapd_version,
      self._osm_area,
      self._map_speed_limit,
      self._next_map_speed_limit,
      LineSeparatorSP(40),
      self._scc_vision_toggle,
      self._scc_map_toggle,
      LineSeparatorSP(40),
      self._speed_limit_mode,
      self._speed_limit_policy,
      self._speed_limit_offset_type,
      self._speed_limit_value_offset,
    ]
    return items

  def _osm_area_text(self):
    name = self._params.get("OsmLocationName") or self._params.get("OsmStateName")
    return name or tr("Not selected")

  def _map_speed_limit_text(self):
    speed = self._params.get("MapSpeedLimit") or "0.0"
    try:
      value = float(speed)
    except ValueError:
      return tr("Unavailable")
    if value <= 0.0:
      return tr("Unavailable")
    unit = tr("km/h") if ui_state.is_metric else tr("mph")
    return f"{value:.0f} {unit}"

  def _speed_limit_offset_label(self, value):
    offset_type = self._int_param("SpeedLimitOffsetType", 0)
    if offset_type == 2:
      return f"{value}%"
    unit = tr("km/h") if ui_state.is_metric else tr("mph")
    return f"{value} {unit}"

  @staticmethod
  def _int_param(key: str, default: int = 0) -> int:
    try:
      return int(ui_state.params.get(key, return_default=True))
    except (TypeError, ValueError):
      return default

  def _refresh_multiple_buttons(self):
    self._speed_limit_mode.action_item.set_selected_button(self._int_param("SpeedLimitMode", 1))
    self._speed_limit_policy.action_item.set_selected_button(self._int_param("SpeedLimitPolicy", 3))
    self._speed_limit_offset_type.action_item.set_selected_button(self._int_param("SpeedLimitOffsetType", 0))

  def _update_state(self):
    super()._update_state()
    self._refresh_multiple_buttons()

    has_cp = ui_state.CP is not None
    has_long = has_cp and ui_state.has_longitudinal_control
    has_icbm = has_cp and ui_state.has_icbm
    cruise_available = has_cp and (has_long or has_icbm)

    self._scc_vision_toggle.action_item.set_enabled(cruise_available)
    self._scc_map_toggle.action_item.set_enabled(cruise_available)

    if has_cp and ui_state.CP_SP is not None:
      brand = ui_state.CP.brand
      sla_disallow_in_release = brand == "tesla" and ui_state.is_sp_release
      sla_available = cruise_available and not sla_disallow_in_release and brand != "rivian"
    else:
      sla_available = False

    self._speed_limit_mode.action_item.set_enabled_buttons(None if sla_available else {0, 1, 2})
    self._speed_limit_value_offset.set_visible(self._int_param("SpeedLimitOffsetType", 0) != 0)

  def _render(self, rect):
    self._scroller.render(rect)

  def show_event(self):
    self._scroller.show_event()
