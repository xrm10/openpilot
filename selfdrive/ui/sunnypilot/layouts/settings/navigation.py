"""
Copyright (c) 2021-, Haibin Wen, sunnypilot, and a number of other contributors.

This file is part of sunnypilot and is licensed under the MIT License.
See the LICENSE.md file in the root directory for more details.
"""
from pathlib import Path

from openpilot.common.params import Params
from openpilot.selfdrive.ui.ui_state import ui_state
from openpilot.system.ui.lib.multilang import tr
from openpilot.system.ui.sunnypilot.widgets.list_view import multiple_button_item_sp, toggle_item_sp
from openpilot.system.ui.widgets.list_view import text_item
from openpilot.system.ui.widgets.scroller_tici import Scroller
from openpilot.system.ui.widgets import Widget

NAV_SOURCE_BUTTONS = [lambda: tr("Off"), lambda: tr("Car screen"), lambda: tr("OSM")]
XRM10_PARAM_DIR = Path("/data/params/d")


def read_xrm10_param(key: str, default: str = "") -> str:
  try:
    return (XRM10_PARAM_DIR / key).read_text().strip()
  except OSError:
    return default


def write_xrm10_param(key: str, value: str | int | bool) -> None:
  try:
    (XRM10_PARAM_DIR / key).write_text(str(int(value) if isinstance(value, bool) else value))
  except OSError:
    pass


def read_xrm10_bool(key: str, default: bool = False) -> bool:
  value = read_xrm10_param(key, "1" if default else "0").lower()
  return value in ("1", "true")


def read_xrm10_int(key: str, default: int = 0) -> int:
  try:
    return int(read_xrm10_param(key, str(default)))
  except ValueError:
    return default


class NavigationLayout(Widget):
  def __init__(self):
    super().__init__()

    self._params = Params()
    items = self._initialize_items()
    self._scroller = Scroller(items, line_separator=True, spacing=0)

  def _initialize_items(self):
    self._source = multiple_button_item_sp(
      title=lambda: tr("Navigation Source"),
      description=self._source_description,
      buttons=NAV_SOURCE_BUTTONS,
      selected_index=read_xrm10_int("Xrm10NavSource"),
      callback=lambda index: write_xrm10_param("Xrm10NavSource", index),
      button_width=360,
      inline=False,
    )

    self._car_screen_intent = toggle_item_sp(
      title=lambda: tr("Use Route Destination"),
      description=lambda: tr("Reads route intent staged by the XRM10 app or car-screen bridge. This does not steer, brake, accelerate, or change lanes by itself."),
      initial_state=read_xrm10_bool("Xrm10CarScreenRouteIntent"),
      callback=lambda state: write_xrm10_param("Xrm10CarScreenRouteIntent", state),
    )

    self._auto_start = toggle_item_sp(
      title=lambda: tr("Start When Car Route Is Detected"),
      description=lambda: tr("Automatically marks navigation intent active when a connected car-screen adapter reports a destination. Driver control and openpilot safety limits remain unchanged."),
      initial_state=read_xrm10_bool("Xrm10NavAutoStart", True),
      callback=lambda state: write_xrm10_param("Xrm10NavAutoStart", state),
    )

    self._nav_activity = text_item(
      lambda: tr("Navigation Activity"),
      self._nav_activity_text,
      description=lambda: tr("Active means a destination was detected and staged as route intent. It is not autonomous steering or braking."),
    )

    self._route_status = text_item(
      lambda: tr("Route Status"),
      self._route_status_text,
      description=lambda: tr("A Tesla screen route adapter must write the detected destination here before this can be used by navigation logic."),
    )

    self._destination = text_item(
      lambda: tr("Destination"),
      self._destination_text,
    )

    self._route_source = text_item(
      lambda: tr("Route Source"),
      self._route_source_text,
    )

    self._coordinates = text_item(
      lambda: tr("Coordinates"),
      self._coordinates_text,
    )

    self._google_maps_url = text_item(
      lambda: tr("Google Maps"),
      self._google_maps_text,
    )

    self._updated_at = text_item(
      lambda: tr("Last Updated"),
      self._updated_at_text,
    )

    self._mapd_version = text_item(
      lambda: tr("mapd Version"),
      lambda: ui_state.params.get("MapdVersion") or tr("Not installed"),
    )

    items = [
      self._source,
      self._car_screen_intent,
      self._auto_start,
      self._nav_activity,
      self._route_status,
      self._destination,
      self._route_source,
      self._coordinates,
      self._google_maps_url,
      self._updated_at,
      self._mapd_version,
    ]
    return items

  def _source_description(self):
    source = read_xrm10_int("Xrm10NavSource")
    if source == 1:
      return tr("Route intent: accepts destination from the XRM10 app or a supported car-screen route adapter. Driver remains responsible for navigation decisions.")
    if source == 2:
      return tr("OSM: uses downloaded OpenStreetMap data for map context such as road names and speed limits. It does not create autonomous navigation.")
    return tr("Off: no navigation route intent is staged.")

  def _route_status_text(self):
    return read_xrm10_param("Xrm10CarScreenRouteStatus") or tr("Not connected")

  def _nav_activity_text(self):
    source = read_xrm10_int("Xrm10NavSource")
    intent_enabled = read_xrm10_bool("Xrm10CarScreenRouteIntent")
    auto_start = read_xrm10_bool("Xrm10NavAutoStart", True)
    destination = read_xrm10_param("Xrm10CarScreenDestination")
    if source == 0 or not intent_enabled:
      return tr("Off")
    if auto_start and destination:
      return tr("Active from car-screen route")
    if auto_start:
      return tr("Armed - waiting for car-screen route")
    if destination:
      return tr("Route detected - auto-start off")
    return tr("Waiting for car-screen adapter")

  def _destination_text(self):
    return read_xrm10_param("Xrm10CarScreenDestination") or tr("None")

  def _route_source_text(self):
    source = read_xrm10_param("Xrm10RouteSource")
    if source == "app-route":
      return tr("App destination")
    if source == "car-screen":
      return tr("Car screen")
    return source or tr("Waiting")

  def _coordinates_text(self):
    latitude = read_xrm10_param("Xrm10RouteLatitude")
    longitude = read_xrm10_param("Xrm10RouteLongitude")
    return f"{latitude}, {longitude}" if latitude and longitude else tr("None")

  def _google_maps_text(self):
    return tr("Ready") if read_xrm10_param("Xrm10RouteGoogleMapsUrl") else tr("None")

  def _updated_at_text(self):
    return read_xrm10_param("Xrm10CarScreenRouteUpdatedAt") or tr("Never")

  def _update_state(self):
    super()._update_state()
    self._car_screen_intent.action_item.set_state(read_xrm10_bool("Xrm10CarScreenRouteIntent"))
    self._auto_start.action_item.set_state(read_xrm10_bool("Xrm10NavAutoStart", True))

  def _render(self, rect):
    self._scroller.render(rect)

  def show_event(self):
    self._scroller.show_event()
