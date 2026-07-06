from datetime import datetime, timezone
from pathlib import Path
from time import monotonic

import pyray as rl

from openpilot.system.ui.widgets.scroller import NavScroller
from openpilot.selfdrive.ui.mici.widgets.button import BigButton, BigToggle, GreyBigButton
from openpilot.selfdrive.ui.mici.widgets.dialog import BigDialog
from openpilot.system.ui.lib.application import gui_app


XRM10_PARAM_DIR = Path("/data/params/d")


def read_param(key: str, default: str = "") -> str:
  try:
    return (XRM10_PARAM_DIR / key).read_text(encoding="utf-8").strip()
  except OSError:
    return default


def write_param(key: str, value: str) -> None:
  try:
    XRM10_PARAM_DIR.mkdir(parents=True, exist_ok=True)
    (XRM10_PARAM_DIR / key).write_text(value, encoding="utf-8")
  except OSError:
    pass


def read_bool_param(key: str, default: bool = False) -> bool:
  value = read_param(key, "1" if default else "0").lower()
  return value in ("1", "true", "yes", "on")


def now_iso() -> str:
  return datetime.now(timezone.utc).isoformat()


def card_color(kind: str) -> rl.Color:
  return {
    "cyan": rl.Color(41, 111, 110, 210),
    "green": rl.Color(36, 104, 54, 215),
    "yellow": rl.Color(122, 87, 26, 220),
    "red": rl.Color(128, 45, 45, 220),
    "purple": rl.Color(72, 55, 122, 220),
    "blue": rl.Color(38, 75, 130, 220),
    "grey": rl.Color(255, 255, 255, int(255 * 0.15)),
  }.get(kind, rl.Color(255, 255, 255, int(255 * 0.15)))


class Xrm10ColorCard(GreyBigButton):
  def __init__(self, text: str, value: str, color: str = "grey", scroll: bool = True):
    super().__init__(text, value, scroll=scroll)
    self._color = color

  def set_color(self, color: str):
    self._color = color

  def _render(self, _):
    rl.draw_rectangle_rounded(self._rect, 0.4, 10, card_color(self._color))
    self._draw_content(self._rect.y)


class Xrm10ParamToggle(BigToggle):
  def __init__(self, text: str, param: str, default: bool = False):
    super().__init__(text, "")
    self.param = param
    self.default = default
    self.refresh()

  def _handle_mouse_release(self, mouse_pos):
    super()._handle_mouse_release(mouse_pos)
    write_param(self.param, "1" if self._checked else "0")

  def refresh(self):
    self.set_checked(read_bool_param(self.param, self.default))


class Xrm10ActionButton(BigButton):
  def __init__(self, text: str, value: str, request_param: str, status_value: str):
    super().__init__(text, value, scroll=True)
    self.request_param = request_param
    self.status_value = status_value
    self.set_click_callback(self._request)

  def _request(self):
    write_param(self.request_param, now_iso())
    write_param("Xrm10CodexPackageStatus", self.status_value)
    gui_app.push_widget(BigDialog("", f"{self.status_value}\n\nOpen the XRM10 phone app Learn page to build or export the Codex package."))


class Xrm10SmartLayout(NavScroller):
  def __init__(self):
    super().__init__()

    self._status = Xrm10ColorCard("learning status", "waiting", "yellow")
    self._score = Xrm10ColorCard("readiness score", "0/100", "purple")
    self._route = Xrm10ColorCard("route intent", "waiting", "blue")
    self._codex = Xrm10ColorCard("codex package", "not built", "cyan")
    self._next_step = Xrm10ColorCard("next step", "collect logs first", "grey")

    self._review_loop = Xrm10ParamToggle("codex review loop", "Xrm10CodexReviewLoop", True)
    self._auto_decode = Xrm10ParamToggle("auto decode evidence", "Xrm10CodexAutoDecode", True)
    self._last_refresh = 0.0

    self._decode_request = Xrm10ActionButton(
      "decode latest evidence",
      "request package",
      "Xrm10CodexDecodeRequested",
      "decode requested from comma UI",
    )
    self._review_request = Xrm10ActionButton(
      "request Codex review",
      "phone app builds package",
      "Xrm10CodexReviewRequested",
      "review requested from comma UI",
    )

    self._auto_apply_locked = Xrm10ColorCard(
      "auto apply driving code",
      "locked off\nmanual review required",
      "red",
      scroll=True,
    )

    self._scroller.add_widgets([
      Xrm10ColorCard("xrm10 smart app", "phone app -> bridge -> comma UI\nreview-gated intelligence", "cyan"),
      self._status,
      self._score,
      self._route,
      self._codex,
      self._next_step,
      self._review_loop,
      self._auto_decode,
      self._decode_request,
      self._review_request,
      self._auto_apply_locked,
    ])

  def show_event(self):
    super().show_event()
    self._refresh(force=True)

  def _update_state(self):
    super()._update_state()
    self._refresh()

  def _refresh(self, force: bool = False):
    if not force and monotonic() - self._last_refresh < 1.0:
      return
    self._last_refresh = monotonic()

    status = read_param("Xrm10SmartAppStatus", "waiting")
    score = read_param("Xrm10SmartScore", "0")
    gate = read_param("Xrm10SmartGate", "waiting-for-data")
    summary = read_param("Xrm10SmartSummary", "")
    route_status = read_param("Xrm10CarScreenRouteStatus", "waiting")
    destination = read_param("Xrm10CarScreenDestination", "")
    codex_status = read_param("Xrm10CodexPackageStatus", "not built")
    next_step = read_param("Xrm10SmartNextStep", "collect logs first")
    updated_at = read_param("Xrm10SmartLastReviewAt", "")

    self._status.set_value(f"{status} / {gate}")
    self._score.set_value(f"{score}/100" if score else "0/100")
    self._route.set_value(destination or route_status)
    self._codex.set_value(codex_status if not updated_at else f"{codex_status} / {updated_at[:16]}")
    self._next_step.set_value(next_step if not summary else f"{next_step}\n{summary}")
    self._status.set_color("green" if status == "ready" else "red" if status == "blocked" else "yellow")
    try:
      score_int = int(score)
    except ValueError:
      score_int = 0
    self._score.set_color("green" if score_int >= 90 else "yellow" if score_int >= 70 else "red")
    self._route.set_color("green" if destination else "blue")
    self._codex.set_color("green" if "built" in codex_status or "review" in codex_status else "cyan")
    self._next_step.set_color("yellow" if "warning" in next_step.lower() or "resolve" in next_step.lower() else "grey")
    self._review_loop.refresh()
    self._auto_decode.refresh()
    write_param("Xrm10CodexAutoApplyAllowed", "0")
