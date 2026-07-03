"""
Copyright (c) 2021-, Haibin Wen, sunnypilot, and a number of other contributors.

This file is part of sunnypilot and is licensed under the MIT License.
See the LICENSE.md file in the root directory for more details.
"""
from openpilot.common.params import Params
from openpilot.selfdrive.ui.ui_state import ui_state
from openpilot.system.ui.lib.multilang import tr
from openpilot.system.ui.sunnypilot.widgets.list_view import multiple_button_item_sp, toggle_item_sp
from openpilot.system.ui.widgets.list_view import text_item
from openpilot.system.ui.widgets.scroller_tici import Scroller
from openpilot.system.ui.widgets import Widget

NAV_SOURCE_BUTTONS = [lambda: tr("Off"), lambda: tr("Car screen"), lambda: tr("OSM")]


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
      param="Xrm10NavSource",
      button_width=360,
      inline=False,
    )

    self._car_screen_intent = toggle_item_sp(
      title=lambda: tr("Use Car Screen Destination"),
      description=lambda: tr("Reads route intent staged by the XRM10 bridge. This does not steer, brake, accelerate, or change lanes by itself."),
      param="Xrm10CarScreenRouteIntent",
      initial_state=self._params.get_bool("Xrm10CarScreenRouteIntent"),
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
      self._route_status,
      self._destination,
      self._updated_at,
      self._mapd_version,
    ]
    return items

  def _source_description(self):
    source = int(self._params.get("Xrm10NavSource", return_default=True))
    if source == 1:
      return tr("Car screen: accepts destination intent from the XRM10 bridge when a supported car-screen route adapter is connected. Driver remains responsible for navigation decisions.")
    if source == 2:
      return tr("OSM: uses downloaded OpenStreetMap data for map context such as road names and speed limits. It does not create autonomous navigation.")
    return tr("Off: no navigation route intent is staged.")

  def _route_status_text(self):
    return self._params.get("Xrm10CarScreenRouteStatus") or tr("Not connected")

  def _destination_text(self):
    return self._params.get("Xrm10CarScreenDestination") or tr("None")

  def _updated_at_text(self):
    return self._params.get("Xrm10CarScreenRouteUpdatedAt") or tr("Never")

  def _update_state(self):
    super()._update_state()
    self._car_screen_intent.action_item.set_state(self._params.get_bool("Xrm10CarScreenRouteIntent"))

  def _render(self, rect):
    self._scroller.render(rect)

  def show_event(self):
    self._scroller.show_event()
