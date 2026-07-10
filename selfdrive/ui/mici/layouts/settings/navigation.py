from time import monotonic

import pyray as rl

from openpilot.system.ui.widgets.scroller import NavScroller
from openpilot.system.ui.widgets import Widget
from openpilot.system.ui.lib.application import gui_app, FontWeight
from openpilot.selfdrive.ui.mici.layouts.settings.xrm10_smart import card_color, now_iso, read_bool_param, read_param, write_param


NAV_SOURCE_OPTIONS = ["off", "car screen", "osm"]
NAV_SOURCE_LABELS = ["off", "car", "osm"]
NAV_CARD_WIDTH = 338
NAV_CARD_HEIGHT = 150
NAV_TITLE_SIZE = 30
NAV_VALUE_SIZE = 25
NAV_PAD = 18
EXPERIMENTAL_NAV_TOGGLE_SPECS = [
  ("traffic light advisory", "Xrm10TrafficLightAdvisory", "signal review only", True),
  ("speed bump advisory", "Xrm10SpeedBumpAdvisory", "slowdown review only", True),
  ("stop/yield advisory", "Xrm10StopYieldAdvisory", "stop and yield review", True),
  ("roundabout advisory", "Xrm10RoundaboutAdvisory", "entry/yield review", True),
  ("merge advisory", "Xrm10MergeAdvisory", "ramp and yield review", True),
  ("cross traffic advisory", "Xrm10CrossTrafficAdvisory", "side traffic review", True),
  ("lane suggestions", "Xrm10LaneSuggestionAdvisory", "safe lane hints only", True),
  ("faster lane suggestion", "Xrm10FasterLaneSuggestion", "confirm before action", True),
  ("curve slowdown advisory", "Xrm10CurveSlowdownAdvisory", "curve speed review", True),
  ("zone caution advisory", "Xrm10ZoneCautionAdvisory", "school/work zone review", True),
  ("lead moved advisory", "Xrm10LeadCarMovedAdvisory", "traffic flow review", True),
  ("event recorder", "Xrm10ExperimentalEventRecorder", "save assist events", True),
  ("replay logging", "Xrm10ReplayLogging", "capture replay evidence", True),
]


def read_int_param(key: str, default: int = 0) -> int:
  try:
    return int(read_param(key, str(default)))
  except ValueError:
    return default


def clamped_nav_source() -> int:
  return max(0, min(read_int_param("Xrm10NavSource"), len(NAV_SOURCE_OPTIONS) - 1))


def nav_text_color(alpha: float = 0.92) -> rl.Color:
  return rl.Color(255, 255, 255, int(255 * alpha))


def compact_label(text: str, max_chars: int = 48) -> str:
  return text if len(text) <= max_chars else text[:max_chars - 1].rstrip() + "."


def draw_wrapped_text(font, text: str, x: float, y: float, width: float, size: int, color: rl.Color, max_lines: int):
  lines: list[str] = []
  for paragraph in text.splitlines() or [""]:
    words = paragraph.split()
    if not words:
      lines.append("")
      continue
    line = ""
    for word in words:
      candidate = word if not line else f"{line} {word}"
      if rl.measure_text_ex(font, candidate, size, 0).x <= width:
        line = candidate
      else:
        lines.append(line)
        line = word
        if len(lines) >= max_lines:
          break
    if len(lines) >= max_lines:
      break
    lines.append(line)

  if len(lines) > max_lines:
    lines = lines[:max_lines]
  for idx, line in enumerate(lines[:max_lines]):
    if idx == max_lines - 1 and rl.measure_text_ex(font, line, size, 0).x > width:
      while len(line) > 1 and rl.measure_text_ex(font, line + ".", size, 0).x > width:
        line = line[:-1]
      line += "."
    rl.draw_text_ex(font, line, rl.Vector2(x, y + idx * (size + 3)), size, 0, color)


class Xrm10NavInfoCard(Widget):
  def __init__(self, text: str, value: str, color: str = "grey"):
    super().__init__()
    self.set_rect(rl.Rectangle(0, 0, NAV_CARD_WIDTH, NAV_CARD_HEIGHT))
    self.text = text
    self.value = value
    self._color = color
    self._font_bold = gui_app.font(FontWeight.BOLD)
    self._font_regular = gui_app.font(FontWeight.DISPLAY_REGULAR)

  def set_value(self, value: str):
    self.value = value

  def set_color(self, color: str):
    self._color = color

  def _render(self, _):
    rl.draw_rectangle_rounded(self._rect, 0.18, 8, card_color(self._color))
    rl.begin_scissor_mode(int(self._rect.x), int(self._rect.y), int(self._rect.width), int(self._rect.height))
    draw_wrapped_text(self._font_bold, compact_label(self.text, 34), self._rect.x + NAV_PAD, self._rect.y + 16,
                      self._rect.width - NAV_PAD * 2, NAV_TITLE_SIZE, nav_text_color(), 1)
    draw_wrapped_text(self._font_regular, compact_label(self.value, 74), self._rect.x + NAV_PAD, self._rect.y + 61,
                      self._rect.width - NAV_PAD * 2, NAV_VALUE_SIZE, nav_text_color(0.86), 2)
    rl.end_scissor_mode()


class Xrm10NavSourceToggle(Widget):
  def __init__(self):
    super().__init__()
    self.set_rect(rl.Rectangle(0, 0, NAV_CARD_WIDTH, NAV_CARD_HEIGHT))
    self._font_bold = gui_app.font(FontWeight.BOLD)
    self._font_regular = gui_app.font(FontWeight.DISPLAY_REGULAR)
    self._button_rects: list[rl.Rectangle] = []
    self.refresh()

  def _handle_mouse_release(self, mouse_pos):
    for idx, rect in enumerate(self._button_rects):
      if rl.check_collision_point_rec(mouse_pos, rect):
        write_param("Xrm10NavSource", str(idx))
        write_param("Xrm10NavSourceUpdatedAt", now_iso())
        self.refresh()
        return

  def refresh(self):
    self.value = clamped_nav_source()

  def _render(self, _):
    selected = clamped_nav_source()
    self.value = selected
    rl.draw_rectangle_rounded(self._rect, 0.18, 8, card_color("blue"))
    rl.begin_scissor_mode(int(self._rect.x), int(self._rect.y), int(self._rect.width), int(self._rect.height))
    rl.draw_text_ex(self._font_bold, "source", rl.Vector2(self._rect.x + NAV_PAD, self._rect.y + 15),
                    NAV_TITLE_SIZE, 0, nav_text_color())
    rl.draw_text_ex(self._font_regular, NAV_SOURCE_OPTIONS[selected],
                    rl.Vector2(self._rect.x + NAV_PAD, self._rect.y + 52),
                    NAV_VALUE_SIZE, 0, nav_text_color(0.84))

    button_y = self._rect.y + 96
    button_w = (self._rect.width - NAV_PAD * 2 - 12) / 3
    self._button_rects = []
    for idx, label in enumerate(NAV_SOURCE_LABELS):
      button = rl.Rectangle(self._rect.x + NAV_PAD + idx * (button_w + 6), button_y, button_w, 36)
      self._button_rects.append(button)
      color = rl.Color(255, 255, 255, 70) if idx == selected else rl.Color(0, 0, 0, 90)
      rl.draw_rectangle_rounded(button, 0.35, 8, color)
      text_size = rl.measure_text_ex(self._font_bold, label, 22, 0)
      rl.draw_text_ex(self._font_bold, label,
                      rl.Vector2(button.x + (button.width - text_size.x) / 2, button.y + 7),
                      22, 0, nav_text_color(0.95))
    rl.end_scissor_mode()


class Xrm10NavToggle(Widget):
  def __init__(self, text: str, param: str, value: str, default: bool = False):
    super().__init__()
    self.set_rect(rl.Rectangle(0, 0, NAV_CARD_WIDTH, NAV_CARD_HEIGHT))
    self.text = text
    self.value = value
    self.default_value = value
    self.param = param
    self.default = default
    self._checked = default
    self._font_bold = gui_app.font(FontWeight.BOLD)
    self._font_regular = gui_app.font(FontWeight.DISPLAY_REGULAR)
    self.refresh()

  def set_value(self, value: str):
    self.value = value

  def _handle_mouse_release(self, mouse_pos):
    self._checked = not self._checked
    write_param(self.param, "1" if self._checked else "0")
    write_param(f"{self.param}UpdatedAt", now_iso())

  def refresh(self):
    self._checked = read_bool_param(self.param, self.default)

  def _render(self, _):
    self.refresh()
    checked = self._checked and self.enabled
    rl.draw_rectangle_rounded(self._rect, 0.18, 8, card_color("green" if checked else "grey"))
    rl.begin_scissor_mode(int(self._rect.x), int(self._rect.y), int(self._rect.width), int(self._rect.height))
    draw_wrapped_text(self._font_bold, compact_label(self.text, 32), self._rect.x + NAV_PAD, self._rect.y + 16,
                      self._rect.width - 112, NAV_TITLE_SIZE, nav_text_color(), 2)
    draw_wrapped_text(self._font_regular, compact_label(self.value, 52), self._rect.x + NAV_PAD, self._rect.y + 83,
                      self._rect.width - NAV_PAD * 2, NAV_VALUE_SIZE, nav_text_color(0.82), 1)

    pill = rl.Rectangle(self._rect.x + self._rect.width - 88, self._rect.y + 18, 68, 38)
    rl.draw_rectangle_rounded(pill, 0.55, 12, rl.Color(36, 122, 76, 255) if checked else rl.Color(50, 50, 50, 255))
    knob_x = pill.x + pill.width - 33 if checked else pill.x + 5
    rl.draw_circle(int(knob_x + 14), int(pill.y + 19), 14, rl.Color(255, 255, 255, 240))
    rl.end_scissor_mode()


class Xrm10NavActionButton(Xrm10NavInfoCard):
  def __init__(self, text: str, value: str, action):
    super().__init__(text, value, "cyan")
    self._action = action

  def _handle_mouse_release(self, mouse_pos):
    self._action()


class NavigationLayout(NavScroller):
  def __init__(self):
    super().__init__()

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
    self._experimental_toggles = [Xrm10NavToggle(*spec) for spec in EXPERIMENTAL_NAV_TOGGLE_SPECS]
    self._activity = Xrm10NavInfoCard("activity", "waiting", "yellow")
    self._planner_next = Xrm10NavInfoCard("next action", "waiting", "yellow")
    self._planner_distance = Xrm10NavInfoCard("action distance", "none", "grey")
    self._planner_confidence = Xrm10NavInfoCard("route confidence", "0%", "grey")
    self._planner_reason = Xrm10NavInfoCard("why", "waiting", "grey")
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
      Xrm10NavInfoCard("experimental assist", "enabled only when experimental mode is on", "yellow"),
      *self._experimental_toggles,
      Xrm10NavInfoCard("planner preview", "next route action and confidence", "blue"),
      self._activity,
      self._planner_next,
      self._planner_distance,
      self._planner_confidence,
      self._planner_reason,
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
    experimental_mode = read_bool_param("ExperimentalMode", False)
    for toggle in self._experimental_toggles:
      toggle.refresh()
      toggle.set_enabled(experimental_mode)
      toggle.set_value(toggle.default_value if experimental_mode else "requires experimental mode")

    source = clamped_nav_source()
    destination = read_param("Xrm10CarScreenDestination") or "none"
    route_status = read_param("Xrm10CarScreenRouteStatus") or "not connected"
    route_source = read_param("Xrm10RouteSource") or NAV_SOURCE_OPTIONS[source]
    latitude = read_param("Xrm10RouteLatitude")
    longitude = read_param("Xrm10RouteLongitude")
    maps_url = read_param("Xrm10RouteGoogleMapsUrl")
    updated_at = read_param("Xrm10CarScreenRouteUpdatedAt") or "never"
    active = read_bool_param("Xrm10NavActive", False)
    planner_next = read_param("Xrm10PlannerNextAction") or "waiting"
    planner_distance = read_param("Xrm10PlannerActionDistance") or "none"
    planner_confidence = max(0, min(read_int_param("Xrm10PlannerConfidence"), 100))
    planner_reason = read_param("Xrm10PlannerReason") or "waiting for route and model agreement"

    self._activity.set_value(self._activity_text())
    self._planner_next.set_value(planner_next if experimental_mode else "requires experimental mode")
    self._planner_distance.set_value(planner_distance if experimental_mode else "none")
    self._planner_confidence.set_value(f"{planner_confidence}%" if experimental_mode else "0%")
    self._planner_reason.set_value(planner_reason if experimental_mode else "experimental mode is off")
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
    self._planner_next.set_color("green" if experimental_mode and planner_next != "waiting" else "yellow" if experimental_mode else "grey")
    self._planner_distance.set_color("green" if experimental_mode and planner_distance != "none" else "grey")
    self._planner_confidence.set_color("green" if experimental_mode and planner_confidence >= 70 else "yellow" if experimental_mode and planner_confidence >= 40 else "grey")
    self._planner_reason.set_color("yellow" if experimental_mode else "grey")
