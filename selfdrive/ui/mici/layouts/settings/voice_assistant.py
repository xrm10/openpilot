from time import monotonic

from openpilot.system.ui.widgets.scroller import NavScroller
from openpilot.selfdrive.ui.mici.widgets.button import BigButton, BigMultiParamToggle
from openpilot.selfdrive.ui.mici.widgets.dialog import BigDialog
from openpilot.selfdrive.ui.mici.layouts.settings.xrm10_smart import (
  Xrm10ColorCard,
  Xrm10ParamToggle,
  now_iso,
  read_bool_param,
  read_param,
  write_param,
)
from openpilot.system.ui.lib.application import gui_app


class Xrm10VoiceActionButton(BigButton):
  def __init__(self, text: str, value: str, action):
    super().__init__(text, value, scroll=True)
    self._action = action
    self.set_click_callback(self._handle_click)

  def _handle_click(self):
    self._action()


class Xrm10VoiceAssistantLayout(NavScroller):
  def __init__(self):
    super().__init__()

    self._status = Xrm10ColorCard("assistant status", "not configured", "yellow")
    self._name = Xrm10ColorCard("assistant name", "comma", "purple")
    self._bridge = Xrm10ColorCard("bridge status", "waiting for bridge", "grey")
    self._wake_word_seen = Xrm10ColorCard("wake word", "say comma", "purple")
    self._transcript = Xrm10ColorCard("last heard", "none", "blue")
    self._response = Xrm10ColorCard("last answer", "none", "green")
    self._error = Xrm10ColorCard("last error", "none", "red")
    self._updated = Xrm10ColorCard("last update", "never", "grey")

    self._enabled = Xrm10ParamToggle("voice assistant", "Xrm10VoiceAssistantEnabled", False)
    self._wake_word = Xrm10ParamToggle("wake word: comma", "Xrm10VoiceAssistantWakeWordEnabled", True)
    self._read_aloud = Xrm10ParamToggle("read responses aloud", "Xrm10VoiceAssistantReadAloud", True)
    self._wake_sound = Xrm10ParamToggle("confirmation sound", "Xrm10VoiceAssistantWakeSound", True)
    self._short_replies = Xrm10ParamToggle("short replies", "Xrm10VoiceAssistantShortReplies", True)
    self._onroad_qna = Xrm10ParamToggle("onroad q&a", "Xrm10VoiceAssistantOnroadQna", False)
    self._mode = BigMultiParamToggle("assistant mode", "Xrm10VoiceAssistantMode", ["off", "push to talk", "text bridge", "wake word"])
    self._provider = BigMultiParamToggle("model bridge", "Xrm10VoiceAssistantProvider", ["phone/server", "openai compatible"])

    self._push_to_talk = Xrm10VoiceActionButton("push to talk", "request listening", self._request_listening)
    self._speak = Xrm10VoiceActionButton("repeat last answer", "talk back", self._request_speak)
    self._cancel = Xrm10VoiceActionButton("stop listening", "cancel request", self._request_cancel)
    self._clear = Xrm10VoiceActionButton("clear chat", "clear transcript", self._request_clear)
    self._last_refresh = 0.0

    self._scroller.add_widgets([
      Xrm10ColorCard("voice assistant", "say comma, then ask your question", "cyan"),
      self._name,
      self._status,
      self._bridge,
      self._wake_word_seen,
      self._enabled,
      self._mode,
      self._provider,
      self._wake_word,
      self._read_aloud,
      self._wake_sound,
      self._short_replies,
      self._onroad_qna,
      self._push_to_talk,
      self._speak,
      self._cancel,
      self._clear,
      self._transcript,
      self._response,
      self._error,
      self._updated,
      Xrm10ColorCard("safety gate", "voice assistant cannot steer, brake, change lanes, or apply code", "red"),
    ])

  def _write_status(self, status: str, bridge_status: str):
    updated_at = now_iso()
    write_param("Xrm10VoiceAssistantStatus", status)
    write_param("Xrm10VoiceAssistantBridgeStatus", bridge_status)
    write_param("Xrm10VoiceAssistantUpdatedAt", updated_at)

  def _request_listening(self):
    if not read_bool_param("Xrm10VoiceAssistantEnabled", False):
      gui_app.push_widget(BigDialog("", "Voice assistant is off.\n\nEnable it first, then press push to talk."))
      return
    now = now_iso()
    write_param("Xrm10VoiceAssistantPTTRequested", now)
    self._write_status("listening requested", "waiting for voice bridge")
    gui_app.push_widget(BigDialog("", "Listening requested.\n\nYou can also say \"comma\" when the bridge is connected. The bridge handles speech, model response, and talk-back audio."))

  def _request_speak(self):
    if not read_bool_param("Xrm10VoiceAssistantEnabled", False):
      gui_app.push_widget(BigDialog("", "Voice assistant is off.\n\nEnable it first, then ask comma to talk back."))
      return
    write_param("Xrm10VoiceAssistantSpeakRequested", now_iso())
    self._write_status("speak requested", "waiting for voice bridge")

  def _request_cancel(self):
    write_param("Xrm10VoiceAssistantCancelRequested", now_iso())
    self._write_status("cancel requested", "waiting for bridge")

  def _request_clear(self):
    write_param("Xrm10VoiceAssistantClearRequested", now_iso())
    write_param("Xrm10VoiceAssistantTextPrompt", "")
    write_param("Xrm10VoiceAssistantLastTranscript", "")
    write_param("Xrm10VoiceAssistantLastResponse", "")
    write_param("Xrm10VoiceAssistantLastError", "")
    write_param("Xrm10VoiceAssistantWakeWordDetectedAt", "")
    write_param("Xrm10VoiceAssistantLastSpokenAt", "")
    self._write_status("ready", "waiting for bridge")

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

    enabled = read_bool_param("Xrm10VoiceAssistantEnabled", False)
    status = read_param("Xrm10VoiceAssistantStatus", "not configured")
    name = read_param("Xrm10VoiceAssistantName", "comma") or "comma"
    bridge = read_param("Xrm10VoiceAssistantBridgeStatus", "waiting for bridge")
    wake_word_seen = read_param("Xrm10VoiceAssistantWakeWordDetectedAt", "") or "not heard"
    transcript = read_param("Xrm10VoiceAssistantLastTranscript", "") or "none"
    response = read_param("Xrm10VoiceAssistantLastResponse", "") or "none"
    error = read_param("Xrm10VoiceAssistantLastError", "") or "none"
    updated_at = read_param("Xrm10VoiceAssistantUpdatedAt", "") or "never"

    self._status.set_value(status)
    self._name.set_value(name)
    self._bridge.set_value(bridge)
    self._wake_word_seen.set_value(wake_word_seen[:19] if wake_word_seen != "not heard" else "say comma")
    self._transcript.set_value(transcript)
    self._response.set_value(response)
    self._error.set_value(error)
    self._updated.set_value(updated_at[:19] if updated_at != "never" else updated_at)

    self._status.set_color("green" if enabled and status in ("ready", "answered") else "yellow" if enabled else "grey")
    self._name.set_color("purple")
    self._bridge.set_color("green" if "connected" in bridge.lower() else "yellow" if enabled else "grey")
    self._wake_word_seen.set_color("green" if wake_word_seen != "not heard" else "purple" if enabled else "grey")
    self._transcript.set_color("blue" if transcript != "none" else "grey")
    self._response.set_color("green" if response != "none" else "grey")
    self._error.set_color("red" if error != "none" else "grey")
    self._updated.set_color("green" if updated_at != "never" else "grey")

    self._enabled.refresh()
    self._wake_word.refresh()
    self._read_aloud.refresh()
    self._wake_sound.refresh()
    self._short_replies.refresh()
    self._onroad_qna.refresh()
    self._mode._load_value()
    self._provider._load_value()
    self._push_to_talk.set_enabled(enabled)
    self._speak.set_enabled(enabled and response != "none")
    self._cancel.set_enabled(enabled)
