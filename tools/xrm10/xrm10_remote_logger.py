#!/usr/bin/env python3
"""
Network-resilient steering log spooler for XRM10 development.

Runs on the comma. It collects steering/lateral diagnostics into compressed
packages, keeps them on-device when no network path is available, and uploads
pending packages when an HTTP bridge or SSH destination is reachable again.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import socket
import subprocess
import tarfile
import tempfile
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_CONFIG: dict[str, Any] = {
  "enabled": True,
  "interval_seconds": 300,
  "segments": 6,
  "include_qlog": True,
  "include_rlog": True,
  "include_camera": False,
  "realdata_dir": "/data/media/0/realdata",
  "openpilot_dir": "/data/openpilot",
  "work_dir": "/data/xrm10_remote_logger",
  "http_url": "",
  "http_token": "",
  "ssh_dest": "",
  "ssh_key": "",
  "upload_timeout_seconds": 300,
  "max_spool_packages": 60,
  "max_sent_packages": 30,
}

STEERING_PARAM_PATTERNS = (
  "steer", "Steer", "torque", "Torque", "lateral", "Lateral", "lane", "Lane",
  "angle", "Angle", "CarParams", "Calibration", "ControlsReady", "Live", "live",
  "Xrm10",
)

PROCESS_PATTERNS = (
  "controlsd", "plannerd", "paramsd", "torqued", "locationd", "modeld",
  "manager", "pandad", "selfdrived",
)


def utc_now() -> str:
  return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def safe_name(value: str) -> str:
  cleaned = "".join(ch if ch.isalnum() or ch in "._-" else "-" for ch in value)
  cleaned = cleaned.strip(".-_")
  return cleaned[:120] or "xrm10-log"


def run(cmd: list[str], cwd: str | None = None, timeout: int = 12) -> str:
  try:
    proc = subprocess.run(
      cmd,
      cwd=cwd,
      stdout=subprocess.PIPE,
      stderr=subprocess.STDOUT,
      text=True,
      timeout=timeout,
      check=False,
    )
    return proc.stdout
  except Exception as exc:
    return f"{cmd[0]} failed: {exc}\n"


def shell(command: str, timeout: int = 12) -> str:
  return run(["sh", "-c", command], timeout=timeout)


def load_config(path: Path) -> dict[str, Any]:
  config = dict(DEFAULT_CONFIG)
  if path.exists():
    try:
      loaded = json.loads(path.read_text(encoding="utf-8"))
      if isinstance(loaded, dict):
        config.update(loaded)
    except Exception:
      pass

  if os.environ.get("XRM10_REMOTE_HTTP_URL"):
    config["http_url"] = os.environ["XRM10_REMOTE_HTTP_URL"]
  if os.environ.get("XRM10_REMOTE_HTTP_TOKEN"):
    config["http_token"] = os.environ["XRM10_REMOTE_HTTP_TOKEN"]
  if os.environ.get("XRM10_REMOTE_SSH_DEST"):
    config["ssh_dest"] = os.environ["XRM10_REMOTE_SSH_DEST"]
  if os.environ.get("XRM10_REMOTE_SSH_KEY"):
    config["ssh_key"] = os.environ["XRM10_REMOTE_SSH_KEY"]
  return config


def ensure_dirs(config: dict[str, Any]) -> dict[str, Path]:
  work = Path(str(config["work_dir"]))
  paths = {
    "work": work,
    "spool": work / "spool",
    "sent": work / "sent",
    "state": work / "state",
    "logs": work / "logs",
  }
  for path in paths.values():
    path.mkdir(parents=True, exist_ok=True)
  return paths


def recent_routes(realdata_dir: Path, count: int) -> list[Path]:
  if not realdata_dir.exists():
    return []
  routes = [p for p in realdata_dir.iterdir() if p.is_dir() and "--" in p.name]
  routes.sort(key=lambda p: p.stat().st_mtime if p.exists() else 0, reverse=True)
  return routes[:max(1, min(20, count))]


def copy_if_exists(src: Path, dst: Path) -> None:
  try:
    if src.exists() and src.is_file():
      dst.parent.mkdir(parents=True, exist_ok=True)
      shutil.copy2(src, dst)
  except Exception:
    pass


def collect_params(dst: Path) -> None:
  params_dir = Path("/data/params/d")
  if not params_dir.exists():
    return
  out_dir = dst / "params"
  out_dir.mkdir(parents=True, exist_ok=True)
  for path in params_dir.iterdir():
    if not path.is_file():
      continue
    if any(pattern in path.name for pattern in STEERING_PARAM_PATTERNS):
      copy_if_exists(path, out_dir / path.name)


def collect_route_logs(routes: list[Path], dst: Path, config: dict[str, Any]) -> list[dict[str, Any]]:
  manifest = []
  include_qlog = bool(config.get("include_qlog", True))
  include_rlog = bool(config.get("include_rlog", True))
  include_camera = bool(config.get("include_camera", False))

  for route in routes:
    route_out = dst / "routes" / safe_name(route.name)
    copied = []
    for file_path in sorted(route.iterdir()):
      name = file_path.name
      if not file_path.is_file():
        continue
      include = False
      if include_qlog and name.startswith("qlog"):
        include = True
      if include_rlog and name.startswith("rlog"):
        include = True
      if include_camera and (name.startswith("dcamera") or name.startswith("ecamera") or name.startswith("fcamera")):
        include = True
      if include:
        copy_if_exists(file_path, route_out / name)
        copied.append({"name": name, "bytes": file_path.stat().st_size})

    manifest.append({
      "route": route.name,
      "modifiedAt": datetime.fromtimestamp(route.stat().st_mtime, timezone.utc).isoformat(),
      "files": copied,
    })
  return manifest


def collect_metadata(dst: Path, routes: list[Path], route_manifest: list[dict[str, Any]], config: dict[str, Any]) -> None:
  meta_dir = dst / "metadata"
  meta_dir.mkdir(parents=True, exist_ok=True)

  openpilot_dir = Path(str(config["openpilot_dir"]))
  process_filter = "|".join(PROCESS_PATTERNS)
  metadata = {
    "generatedAt": utc_now(),
    "hostname": socket.gethostname(),
    "config": {
      "segments": config.get("segments"),
      "include_qlog": config.get("include_qlog"),
      "include_rlog": config.get("include_rlog"),
      "include_camera": config.get("include_camera"),
      "has_http_url": bool(config.get("http_url")),
      "has_ssh_dest": bool(config.get("ssh_dest")),
    },
    "routes": route_manifest,
  }
  (meta_dir / "manifest.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")

  device_lines = [
    f"generated_at={utc_now()}",
    f"hostname={socket.gethostname()}",
    "uname=" + run(["uname", "-a"]).strip(),
    "uptime=" + run(["uptime"]).strip(),
    "\nnetwork:\n" + shell("ip addr 2>/dev/null || ifconfig 2>/dev/null || true"),
    "\nroutes:\n" + shell("ip route 2>/dev/null || route -n 2>/dev/null || true"),
    "\ndisk:\n" + shell("df -h /data 2>/dev/null || true"),
  ]
  (meta_dir / "device.txt").write_text("\n".join(device_lines), encoding="utf-8")

  git_lines = [
    "branch:\n" + run(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=str(openpilot_dir)),
    "commit:\n" + run(["git", "rev-parse", "HEAD"], cwd=str(openpilot_dir)),
    "status:\n" + run(["git", "status", "--short"], cwd=str(openpilot_dir)),
  ]
  (meta_dir / "openpilot_git.txt").write_text("\n".join(git_lines), encoding="utf-8")

  process_lines = [
    "processes:\n" + shell(f"ps -ef 2>/dev/null | grep -Ei '{process_filter}' | grep -v grep || true"),
    "\nmanager.log:\n" + shell("tail -n 800 /tmp/manager.log 2>/dev/null || true"),
    "\njournal:\n" + shell("journalctl --no-pager -n 1200 2>/dev/null || true", timeout=20),
    "\ndmesg:\n" + shell("dmesg 2>/dev/null | tail -n 400 || true"),
  ]
  (meta_dir / "process_logs.txt").write_text("\n".join(process_lines), encoding="utf-8")

  route_list = "\n".join(str(route) for route in routes)
  (meta_dir / "recent_routes.txt").write_text(route_list + "\n", encoding="utf-8")


def make_package(config: dict[str, Any], paths: dict[str, Path]) -> Path | None:
  routes = recent_routes(Path(str(config["realdata_dir"])), int(config.get("segments", 6)))
  if not routes:
    status = {
      "generatedAt": utc_now(),
      "status": "waiting-for-routes",
      "message": "No route directories found yet.",
    }
    (paths["state"] / "latest_status.json").write_text(json.dumps(status, indent=2), encoding="utf-8")
    return None

  route_names = [route.name for route in routes]
  last_routes_path = paths["state"] / "last_routes.json"
  try:
    last_routes = json.loads(last_routes_path.read_text(encoding="utf-8"))
  except Exception:
    last_routes = None
  if last_routes is None:
    try:
      latest = json.loads((paths["state"] / "latest_status.json").read_text(encoding="utf-8"))
      last_routes = latest.get("routes")
    except Exception:
      last_routes = None

  if last_routes == route_names:
    status = {
      "generatedAt": utc_now(),
      "status": "no-new-routes",
      "message": "Recent route set has not changed; pending uploads will still retry.",
      "routes": route_names,
    }
    (paths["state"] / "latest_status.json").write_text(json.dumps(status, indent=2), encoding="utf-8")
    return None

  stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
  host = safe_name(socket.gethostname())
  package_name = f"xrm10-steering-{host}-{stamp}.tgz"
  package_path = paths["spool"] / package_name

  with tempfile.TemporaryDirectory(prefix="xrm10-steering-") as tmp_name:
    tmp = Path(tmp_name)
    route_manifest = collect_route_logs(routes, tmp, config)
    collect_params(tmp)
    collect_metadata(tmp, routes, route_manifest, config)
    with tarfile.open(package_path, "w:gz") as tar:
      for item in tmp.iterdir():
        tar.add(item, arcname=item.name)

  status = {
    "generatedAt": utc_now(),
    "status": "spooled",
    "package": package_path.name,
    "bytes": package_path.stat().st_size,
    "routes": route_names,
  }
  (paths["state"] / "latest_status.json").write_text(json.dumps(status, indent=2), encoding="utf-8")
  last_routes_path.write_text(json.dumps(route_names, indent=2), encoding="utf-8")
  return package_path


def upload_http(package: Path, config: dict[str, Any]) -> bool:
  url = str(config.get("http_url") or "").strip()
  if not url:
    return False
  headers = {
    "Content-Type": "application/gzip",
    "X-XRM10-Log-Name": package.name,
    "X-XRM10-Device": socket.gethostname(),
  }
  token = str(config.get("http_token") or "").strip()
  if token:
    headers["X-XRM10-Token"] = token

  data = package.read_bytes()
  req = urllib.request.Request(url, data=data, headers=headers, method="POST")
  timeout = max(30, min(900, int(config.get("upload_timeout_seconds", 300))))
  try:
    with urllib.request.urlopen(req, timeout=timeout) as response:
      return 200 <= int(response.status) < 300
  except (urllib.error.URLError, TimeoutError, OSError):
    return False


def upload_ssh(package: Path, config: dict[str, Any]) -> bool:
  dest = str(config.get("ssh_dest") or "").strip()
  if not dest:
    return False
  args = ["scp", "-o", "BatchMode=yes", "-o", "ConnectTimeout=15"]
  key = str(config.get("ssh_key") or "").strip()
  if key:
    args.extend(["-i", key])
  args.extend([str(package), dest.rstrip("/") + "/" + package.name])
  try:
    proc = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, timeout=90, check=False)
    return proc.returncode == 0
  except Exception:
    return False


def trim_dir(path: Path, keep: int) -> None:
  packages = sorted(path.glob("*.tgz"), key=lambda p: p.stat().st_mtime if p.exists() else 0, reverse=True)
  for old in packages[max(0, keep):]:
    try:
      old.unlink()
    except Exception:
      pass


def upload_pending(config: dict[str, Any], paths: dict[str, Path]) -> int:
  uploaded = 0
  pending = sorted(paths["spool"].glob("*.tgz"), key=lambda p: p.stat().st_mtime)
  for package in pending:
    ok = upload_http(package, config)
    if not ok:
      ok = upload_ssh(package, config)
    if not ok:
      continue
    target = paths["sent"] / package.name
    try:
      shutil.move(str(package), str(target))
      uploaded += 1
    except Exception:
      pass
  trim_dir(paths["spool"], int(config.get("max_spool_packages", 60)))
  trim_dir(paths["sent"], int(config.get("max_sent_packages", 30)))
  return uploaded


def run_once(config_path: Path) -> int:
  config = load_config(config_path)
  paths = ensure_dirs(config)
  if not bool(config.get("enabled", True)):
    return 0
  package = make_package(config, paths)
  uploaded = upload_pending(config, paths)
  print(json.dumps({
    "generatedAt": utc_now(),
    "package": package.name if package else None,
    "uploaded": uploaded,
    "spoolCount": len(list(paths["spool"].glob("*.tgz"))),
  }, indent=2))
  return uploaded


def main() -> int:
  parser = argparse.ArgumentParser(description="XRM10 remote steering logger")
  parser.add_argument("--config", default="/data/xrm10_remote_logger/config.json")
  parser.add_argument("--once", action="store_true", help="collect and upload once")
  parser.add_argument("--daemon", action="store_true", help="run forever")
  args = parser.parse_args()

  config_path = Path(args.config)
  if not config_path.exists():
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(json.dumps(DEFAULT_CONFIG, indent=2), encoding="utf-8")

  if args.daemon:
    while True:
      config = load_config(config_path)
      interval = max(30, min(3600, int(config.get("interval_seconds", 300))))
      try:
        run_once(config_path)
      except Exception as exc:
        print(json.dumps({"generatedAt": utc_now(), "error": str(exc)}), flush=True)
      time.sleep(interval)
  else:
    run_once(config_path)
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
