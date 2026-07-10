"""
Copyright (c) 2021-, Haibin Wen, sunnypilot, and a number of other contributors.

This file is part of sunnypilot and is licensed under the MIT License.
See the LICENSE.md file in the root directory for more details.
"""
from time import monotonic

from openpilot.system.ui.widgets.scroller import Scroller
from openpilot.selfdrive.ui.mici.layouts.settings.navigation import (
  NAV_SOURCE_OPTIONS,
  Xrm10NavActionButton,
  Xrm10NavInfoCard,
  Xrm10NavSourceToggle,
  Xrm10NavToggle,
  clamped_nav_source,
)
from openpilot.selfdrive.ui.mici.layouts.settings.xrm10_smart import (
  now_iso,
  read_bool_param,
  read_param,
  write_param,
)


class NavigationLayout(Scroller):
  def __init__(self):
    super().__init__(snap_items=False, spacing=20, pad=20, scroll_indicator=True, edge_shadows=True)

    self._source = Xrm10NavSourceToggle()
    self._intent = Xrm10NavToggle(
      "use route destination",
      "Xrm10CarScreenRouteIntent",
      "accept app/car-screen destination",
      True,
    )
    self._auto_start = Xrm10NavToggle(
      "auto-start route display",
      "Xrm10NavAutoStart",
      "show route when destination appears",
      True,
    )
    self._active_display = Xrm10NavToggle(
      "active route display",
      "Xrm10NavActive",
      "display only, no driving command",
      False,
    )
    self._traffic_light_advisory = Xrm10NavToggle(
      "traffic light advisory",
      "Xrm10TrafficLightAdvisory",
      "advisory channel only",
      True,
    )
    self._speed_bump_advisory = Xrm10NavToggle(
      "speed bump advisory",
      "Xrm10SpeedBumpAdvisory",
      "slowdown review only",
      True,
    )
    self._activity = Xrm10NavInfoCard("activity", "waiting", "yellow")
    self._destination = Xrm10NavInfoCard("destination", "none", "blue")
    self._route = Xrm10NavInfoCard("route status", "not connected", "grey")
    self._coordinates = Xrm10NavInfoCard("coordinates", "none", "grey")
    self._maps = Xrm10NavInfoCard("maps link", "none", "grey")
    self._updated = Xrm10NavInfoCard("last update", "never", "grey")
    self._last_refresh = 0.0

    self._sync = Xrm10NavActionButton(
      "sync route now",
      "request bridge refresh",
      self._request_sync,
    )
    self._clear = Xrm10NavActionButton(
      "clear route display",
      "turn active route off",
      self._clear_route,
    )

    self._scroller.add_widgets([
      Xrm10NavInfoCard("navigation", "route intent, map status, live sync", "blue"),
      self._source,
      self._intent,
      self._auto_start,
      self._active_display,
      self._traffic_light_advisory,
      self._speed_bump_advisory,
      self._activity,
      self._destination,
      self._route,
      self._coordinates,
      self._maps,
      self._updated,
      self._sync,
      self._clear,
      Xrm10NavInfoCard("safety gate", "display/review only; no steering, braking, throttle, or lane-change command", "red"),
    ])

  def _request_sync(self):
    write_param("Xrm10NavSyncRequested", now_iso())
    write_param("Xrm10CarScreenRouteStatus", "sync requested from comma UI")
    write_param("Xrm10CarScreenRouteUpdatedAt", now_iso())

  def _clear_route(self):
    write_param("Xrm10NavActive", "0")
    write_param("Xrm10CarScreenRouteStatus", "route display cleared from comma UI")
    write_param("Xrm10CarScreenDestination", "")
    write_param("Xrm10RouteLatitude", "")
    write_param("Xrm10RouteLongitude", "")
    write_param("Xrm10RouteGoogleMapsUrl", "")
    write_param("Xrm10RouteSource", "")
    write_param("Xrm10CarScreenRouteUpdatedAt", now_iso())
    self._refresh(force=True)

  def show_event(self):
    super().show_event()
    self._refresh(force=True)

  def _update_state(self):
    super()._update_state()
    self._refresh()

  def _activity_text(self) -> str:
    source = clamped_nav_source()
    intent_enabled = read_bool_param("Xrm10CarScreenRouteIntent", True)
    auto_start = read_bool_param("Xrm10NavAutoStart", True)
    active = read_bool_param("Xrm10NavActive", False)
    destination = read_param("Xrm10CarScreenDestination")
    if source == 0 or not intent_enabled:
      return "off"
    if active:
      return "active route display"
    if auto_start and destination:
      return "armed with destination"
    if auto_start:
      return "armed - waiting for route"
    if destination:
      return "route detected - auto-start off"
    return "waiting for app/car screen"

  def _refresh(self, force: bool = False):
    if not force and monotonic() - self._last_refresh < 1.0:
      return
    self._last_refresh = monotonic()

    self._source.refresh()
    self._intent.refresh()
    self._auto_start.refresh()
    self._active_display.refresh()
    self._traffic_light_advisory.refresh()
    self._speed_bump_advisory.refresh()
    experimental_mode = read_bool_param("ExperimentalMode", False)
    self._traffic_light_advisory.set_enabled(experimental_mode)
    self._speed_bump_advisory.set_enabled(experimental_mode)
    self._traffic_light_advisory.set_value("advisory channel only" if experimental_mode else "requires experimental mode")
    self._speed_bump_advisory.set_value("slowdown review only" if experimental_mode else "requires experimental mode")

    source = clamped_nav_source()
    destination = read_param("Xrm10CarScreenDestination") or "none"
    route_status = read_param("Xrm10CarScreenRouteStatus") or "not connected"
    route_source = read_param("Xrm10RouteSource") or NAV_SOURCE_OPTIONS[source]
    latitude = read_param("Xrm10RouteLatitude")
    longitude = read_param("Xrm10RouteLongitude")
    maps_url = read_param("Xrm10RouteGoogleMapsUrl")
    updated_at = read_param("Xrm10CarScreenRouteUpdatedAt") or "never"
    active = read_bool_param("Xrm10NavActive", False)

    self._activity.set_value(self._activity_text())
    self._destination.set_value(destination)
    self._route.set_value(f"{route_status}\nsource: {route_source}")
    self._coordinates.set_value(f"{latitude}, {longitude}" if latitude and longitude else "none")
    self._maps.set_value("ready" if maps_url else "none")
    self._updated.set_value(updated_at[:19] if updated_at != "never" else updated_at)

    self._activity.set_color("green" if active else "yellow" if source else "grey")
    self._destination.set_color("green" if destination != "none" else "blue")
    self._route.set_color("green" if "active" in route_status.lower() else "yellow" if "sync" in route_status.lower() else "grey")
    self._coordinates.set_color("green" if latitude and longitude else "grey")
    self._maps.set_color("green" if maps_url else "grey")
    self._updated.set_color("green" if updated_at != "never" else "grey")
