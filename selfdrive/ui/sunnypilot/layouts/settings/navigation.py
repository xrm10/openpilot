"""
Copyright (c) 2021-, Haibin Wen, sunnypilot, and a number of other contributors.

This file is part of sunnypilot and is licensed under the MIT License.
See the LICENSE.md file in the root directory for more details.
"""
from cereal import car

from openpilot.common.params import Params
from openpilot.selfdrive.ui.ui_state import ui_state
from openpilot.sunnypilot.selfdrive.controls.lib.auto_lane_change import AutoLaneChangeMode
from openpilot.system.ui.lib.multilang import tr
from openpilot.system.ui.sunnypilot.widgets.list_view import LineSeparatorSP, multiple_button_item_sp, option_item_sp, toggle_item_sp
from openpilot.system.ui.widgets.list_view import text_item
from openpilot.system.ui.widgets.scroller_tici import Scroller
from openpilot.system.ui.widgets import Widget

DM_PROFILE_BUTTONS = [lambda: tr("Standard"), lambda: tr("Comfort"), lambda: tr("Strict")]
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
    self._dm_profile = multiple_button_item_sp(
      title=lambda: tr("Driver Monitoring Comfort"),
      description=lambda: tr("Adjust early driver-monitoring prompt timing without disabling monitoring. Red alerts, phone checks, lockouts, and fallback monitoring stay unchanged."),
      buttons=DM_PROFILE_BUTTONS,
      button_width=260,
      param="Xrm10DmComfortProfile",
      selected_index=self._params.get("Xrm10DmComfortProfile", return_default=True),
      inline=False,
    )

    self._dec_toggle = toggle_item_sp(
      title=lambda: tr("Dynamic Experimental Control"),
      description=lambda: tr("Experimental Mode only. Lets the model switch between sunnypilot ACC and End-to-End longitudinal when supported."),
      param="DynamicExperimentalControl",
      initial_state=self._params.get_bool("DynamicExperimentalControl"),
    )
    self._scc_vision_toggle = toggle_item_sp(
      title=lambda: tr("Smart Cruise - Vision"),
      description=lambda: tr("Experimental Mode only. Uses vision path predictions to reduce speed for curves ahead."),
      param="SmartCruiseControlVision",
      initial_state=self._params.get_bool("SmartCruiseControlVision"),
    )
    self._scc_map_toggle = toggle_item_sp(
      title=lambda: tr("Smart Cruise - Map"),
      description=lambda: tr("Experimental Mode only. Uses map context to reduce speed for turns and road geometry when supported."),
      param="SmartCruiseControlMap",
      initial_state=self._params.get_bool("SmartCruiseControlMap"),
    )

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

    self._lane_change_timer = option_item_sp(
      title=lambda: tr("Auto Lane Change by Blinker"),
      param="AutoLaneChangeTimer",
      description=lambda: tr("Sets the blinker-to-lane-change timing. Nudgeless modes still require driver supervision and safe traffic conditions."),
      min_value=-1,
      max_value=5,
      value_change_step=1,
      label_callback=self._lane_change_label,
    )
    self._bsm_delay = toggle_item_sp(
      param="AutoLaneChangeBsmDelay",
      title=lambda: tr("Delay Lane Change with Blind Spot"),
      description=lambda: tr("Delay automatic lane-change timing when blind spot monitoring reports a vehicle."),
      initial_state=self._params.get_bool("AutoLaneChangeBsmDelay"),
    )

    self._live_torque_toggle = toggle_item_sp(
      param="LiveTorqueParamsToggle",
      title=lambda: tr("Steering Torque Self-Tune"),
      description=lambda: tr("Allow torque lateral control to learn steering parameters on supported platforms."),
      initial_state=self._params.get_bool("LiveTorqueParamsToggle"),
    )
    self._relaxed_torque_toggle = toggle_item_sp(
      param="LiveTorqueParamsRelaxedToggle",
      title=lambda: tr("Relaxed Torque Learning"),
      description=lambda: tr("Less restrictive self-tune learning. Use only after the base torque self-tune is enabled."),
      initial_state=self._params.get_bool("LiveTorqueParamsRelaxedToggle"),
    )
    self._custom_torque_toggle = toggle_item_sp(
      param="CustomTorqueParams",
      title=lambda: tr("Custom Torque Tuning"),
      description=lambda: tr("Enable manual torque tuning values. These stay bounded by the platform safety model."),
      initial_state=self._params.get_bool("CustomTorqueParams"),
    )
    self._manual_torque_toggle = toggle_item_sp(
      param="TorqueParamsOverrideEnabled",
      title=lambda: tr("Manual Real-Time Torque Tuning"),
      description=lambda: tr("Use fixed manual torque tuning values instead of learned self-tune values."),
      initial_state=self._params.get_bool("TorqueParamsOverrideEnabled"),
    )
    self._torque_lat_accel = option_item_sp(
      title=lambda: tr("Lateral Acceleration Factor"),
      param="TorqueParamsOverrideLatAccelFactor",
      description="",
      min_value=1,
      max_value=500,
      value_change_step=1,
      label_callback=lambda value: f"{value / 100:.2f} m/s^2",
      use_float_scaling=True,
    )
    self._torque_friction = option_item_sp(
      title=lambda: tr("Friction"),
      param="TorqueParamsOverrideFriction",
      description="",
      min_value=1,
      max_value=100,
      value_change_step=1,
      label_callback=lambda value: f"{value / 100:.2f}",
      use_float_scaling=True,
    )

    items = [
      self._dm_profile,
      LineSeparatorSP(40),
      self._dec_toggle,
      self._scc_vision_toggle,
      self._scc_map_toggle,
      LineSeparatorSP(40),
      self._road_name_toggle,
      self._osm_local_toggle,
      self._mapd_version,
      self._osm_area,
      self._speed_limit_mode,
      self._speed_limit_policy,
      LineSeparatorSP(40),
      self._lane_change_timer,
      self._bsm_delay,
      LineSeparatorSP(40),
      self._live_torque_toggle,
      self._relaxed_torque_toggle,
      self._custom_torque_toggle,
      self._manual_torque_toggle,
      self._torque_lat_accel,
      self._torque_friction,
    ]
    return items

  def _osm_area_text(self):
    name = self._params.get("OsmLocationName") or self._params.get("OsmStateName")
    return name or tr("Not selected")

  @staticmethod
  def _lane_change_label(value):
    if value == -1:
      return tr("Off")
    if value == 0:
      return tr("Nudge")
    if value == 1:
      return tr("Nudgeless")
    if value == 2:
      return f"0.5 {tr('s')}"
    if value == 3:
      return f"1 {tr('s')}"
    if value == 4:
      return f"2 {tr('s')}"
    return f"3 {tr('s')}"

  @staticmethod
  def _int_param(key: str, default: int = 0) -> int:
    try:
      return int(ui_state.params.get(key, return_default=True))
    except (TypeError, ValueError):
      return default

  def _refresh_multiple_buttons(self):
    self._dm_profile.action_item.set_selected_button(self._int_param("Xrm10DmComfortProfile"))
    self._speed_limit_mode.action_item.set_selected_button(self._int_param("SpeedLimitMode", 1))
    self._speed_limit_policy.action_item.set_selected_button(self._int_param("SpeedLimitPolicy", 3))

  def _update_state(self):
    super()._update_state()
    self._refresh_multiple_buttons()

    has_cp = ui_state.CP is not None
    has_long = has_cp and ui_state.has_longitudinal_control
    has_icbm = has_cp and ui_state.has_icbm
    experimental_enabled = self._params.get_bool("ExperimentalMode")
    cruise_available = has_cp and (has_long or has_icbm)

    self._dec_toggle.action_item.set_enabled(has_long and experimental_enabled)
    self._scc_vision_toggle.action_item.set_enabled(cruise_available and experimental_enabled)
    self._scc_map_toggle.action_item.set_enabled(cruise_available and experimental_enabled)

    if has_cp and ui_state.CP_SP is not None:
      brand = ui_state.CP.brand
      sla_disallow_in_release = brand == "tesla" and ui_state.is_sp_release
      sla_available = cruise_available and not sla_disallow_in_release and brand != "rivian"
    else:
      sla_available = False

    self._speed_limit_mode.action_item.set_enabled_buttons(None if sla_available else {0, 1, 2})

    enable_bsm = has_cp and ui_state.CP.enableBsm
    if not enable_bsm and self._params.get_bool("AutoLaneChangeBsmDelay"):
      self._params.remove("AutoLaneChangeBsmDelay")
      self._bsm_delay.action_item.set_state(False)
    self._bsm_delay.action_item.set_enabled(enable_bsm and self._int_param("AutoLaneChangeTimer") > AutoLaneChangeMode.NUDGE)

    torque_allowed = has_cp and ui_state.CP.steerControlType != car.CarParams.SteerControlType.angle
    offroad = ui_state.is_offroad()
    live_torque_enabled = self._live_torque_toggle.action_item.get_state()
    if not live_torque_enabled and self._params.get_bool("LiveTorqueParamsRelaxedToggle"):
      self._params.remove("LiveTorqueParamsRelaxedToggle")
      self._relaxed_torque_toggle.action_item.set_state(False)

    self._live_torque_toggle.action_item.set_enabled(offroad and torque_allowed)
    self._relaxed_torque_toggle.action_item.set_enabled(offroad and torque_allowed and live_torque_enabled)
    self._custom_torque_toggle.action_item.set_enabled(offroad and torque_allowed)

    custom_torque_enabled = self._custom_torque_toggle.action_item.get_state()
    self._manual_torque_toggle.set_visible(custom_torque_enabled)
    self._torque_lat_accel.set_visible(custom_torque_enabled)
    self._torque_friction.set_visible(custom_torque_enabled)
    self._manual_torque_toggle.action_item.set_enabled(offroad and torque_allowed)
    torque_values_enabled = torque_allowed and custom_torque_enabled and (offroad or self._manual_torque_toggle.action_item.get_state())
    self._torque_lat_accel.action_item.set_enabled(torque_values_enabled)
    self._torque_friction.action_item.set_enabled(torque_values_enabled)

  def _render(self, rect):
    self._scroller.render(rect)

  def show_event(self):
    self._scroller.show_event()
