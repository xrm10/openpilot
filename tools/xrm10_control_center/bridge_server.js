const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const root = __dirname;
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = ""] = arg.split("=");
  return [key.replace(/^--/, ""), value];
}));
const host = args.get("host") || "0.0.0.0";
const port = Number(args.get("port") || 8787);
const stateDir = path.join(root, ".sync_state");
const latestProfilePath = path.join(stateDir, "latest_profile.json");
const sectionStatusPath = path.join(stateDir, "section_status.json");
const carRoutePath = path.join(stateDir, "car_route.json");
const mapPackagePath = path.join(stateDir, "map_package.json");
const safetyEventsPath = path.join(stateDir, "safety_events.json");

const device = {
  name: "comma four",
  id: "6dea66ada857421f",
  version: "2026.07.02-xrm10",
  branch: "dev",
  commit: "344ec6a",
  offroad: true
};

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function resolveGitDir() {
  try {
    const dotGit = path.join(root, ".git");
    const stat = fs.statSync(dotGit);
    if (stat.isDirectory()) return dotGit;
    if (stat.isFile()) {
      const content = fs.readFileSync(dotGit, "utf8").trim();
      const match = content.match(/^gitdir:\s*(.+)$/i);
      if (match) return path.resolve(root, match[1]);
    }
  } catch {
    return null;
  }
  return null;
}

function readPackedRef(gitDir, refName) {
  try {
    const lines = fs.readFileSync(path.join(gitDir, "packed-refs"), "utf8").split(/\r?\n/);
    const line = lines.find((entry) => entry.endsWith(` ${refName}`));
    return line ? line.split(" ")[0] : "";
  } catch {
    return "";
  }
}

function resolveCommonGitDir(gitDir) {
  try {
    const commonDir = fs.readFileSync(path.join(gitDir, "commondir"), "utf8").trim();
    return path.resolve(gitDir, commonDir);
  } catch {
    return gitDir;
  }
}

function readGitMeta() {
  try {
    const gitDir = resolveGitDir();
    if (!gitDir) return {};
    const commonGitDir = resolveCommonGitDir(gitDir);
    const head = fs.readFileSync(path.join(gitDir, "HEAD"), "utf8").trim();
    if (!head.startsWith("ref:")) return { commit: head.slice(0, 7) };

    const refName = head.replace(/^ref:\s*/, "").trim();
    const refParts = refName.split("/");
    const refPath = path.join(gitDir, ...refParts);
    const commonRefPath = path.join(commonGitDir, ...refParts);
    let commit = "";
    if (fs.existsSync(refPath)) {
      commit = fs.readFileSync(refPath, "utf8").trim();
    } else if (fs.existsSync(commonRefPath)) {
      commit = fs.readFileSync(commonRefPath, "utf8").trim();
    } else {
      commit = readPackedRef(gitDir, refName) || readPackedRef(commonGitDir, refName);
    }
    const branch = refName.replace(/^refs\/heads\//, "");
    return {
      branch: branch || device.branch,
      commit: commit ? commit.slice(0, 7) : device.commit
    };
  } catch {
    return {};
  }
}

function currentDevice() {
  const meta = readGitMeta();
  if (meta.branch) device.branch = meta.branch;
  if (meta.commit) device.commit = meta.commit;
  return { ...device };
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...corsHeaders()
  });
  res.end(JSON.stringify(payload, null, 2));
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function latestProfileMeta() {
  try {
    const payload = JSON.parse(fs.readFileSync(latestProfilePath, "utf8"));
    return {
      receivedAt: payload.receivedAt,
      changeCount: Array.isArray(payload.changes) ? payload.changes.length : 0
    };
  } catch {
    return null;
  }
}

function readSectionStatuses() {
  try {
    return JSON.parse(fs.readFileSync(sectionStatusPath, "utf8"));
  } catch {
    return {};
  }
}

function writeSectionStatuses(statuses) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(sectionStatusPath, JSON.stringify(statuses, null, 2));
}

function defaultCarRoute() {
  return {
    active: false,
    source: "car-screen",
    provider: "car-screen-maps",
    status: "waiting",
    destination: "",
    routeId: "",
    nextInstruction: "Waiting for destination",
    confidence: 0,
    updatedAt: null
  };
}

function readCarRoute() {
  try {
    return normalizeCarRoute(JSON.parse(fs.readFileSync(carRoutePath, "utf8")));
  } catch {
    return defaultCarRoute();
  }
}

function writeCarRoute(route) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(carRoutePath, JSON.stringify(normalizeCarRoute(route), null, 2));
}

function normalizeCarRoute(route = {}) {
  const next = defaultCarRoute();
  const destination = String(route.destination || "").trim();
  const confidence = Number(route.confidence ?? next.confidence);
  return {
    ...next,
    ...route,
    active: Boolean(route.active && destination),
    source: String(route.source || next.source),
    provider: String(route.provider || next.provider),
    status: String(route.status || (destination ? "active" : next.status)),
    destination,
    routeId: String(route.routeId || ""),
    nextInstruction: String(route.nextInstruction || (destination ? "Route intent ready for driver-confirmed Nav Pilot" : next.nextInstruction)),
    confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(100, confidence)) : next.confidence,
    updatedAt: route.updatedAt || null
  };
}

function defaultMapPackage() {
  return {
    status: "not loaded",
    name: "UAE detailed + GCC all",
    region: "gcc-uae-detailed",
    fileCount: 0,
    totalBytes: 0,
    updatedAt: null,
    files: []
  };
}

function readMapPackage() {
  try {
    return normalizeMapPackage(JSON.parse(fs.readFileSync(mapPackagePath, "utf8")));
  } catch {
    return defaultMapPackage();
  }
}

function writeMapPackage(mapPackage) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(mapPackagePath, JSON.stringify(normalizeMapPackage(mapPackage), null, 2));
}

function readSafetyEvents() {
  try {
    const events = JSON.parse(fs.readFileSync(safetyEventsPath, "utf8"));
    return Array.isArray(events) ? events : [];
  } catch {
    return [];
  }
}

function writeSafetyEvents(events) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(safetyEventsPath, JSON.stringify(events.slice(-300), null, 2));
}

function normalizeMapPackage(mapPackage = {}) {
  const next = defaultMapPackage();
  const files = Array.isArray(mapPackage.files)
    ? mapPackage.files.slice(0, 40).map((file) => ({
        name: String(file.name || "map-file"),
        size: Number(file.size) || 0,
        type: String(file.type || "map-data")
      }))
    : [];
  const totalBytes = Number(mapPackage.totalBytes ?? files.reduce((sum, file) => sum + file.size, 0));
  return {
    ...next,
    ...mapPackage,
    status: String(mapPackage.status || next.status),
    name: String(mapPackage.name || next.name),
    region: String(mapPackage.region || next.region),
    fileCount: Number(mapPackage.fileCount ?? files.length) || 0,
    totalBytes: Number.isFinite(totalBytes) ? totalBytes : 0,
    updatedAt: mapPackage.updatedAt || null,
    files
  };
}

function runSshStatus(target, keyPath) {
  return new Promise((resolve, reject) => {
    const command = "echo xrm10-ssh-ok; uname -a";
    execFile("ssh", [
      "-i",
      keyPath,
      "-o",
      "BatchMode=yes",
      "-o",
      "ConnectTimeout=5",
      target,
      command
    ], { timeout: 8000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr.trim() || error.message));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function serveFile(req, res) {
  const parsed = new URL(req.url, "http://localhost");
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === "/") pathname = "/index.html";
  const filePath = path.normalize(path.join(root, pathname));

  if (!filePath.startsWith(root)) {
    res.writeHead(403, corsHeaders());
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", ...corsHeaders() });
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
      ...corsHeaders()
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  const parsed = new URL(req.url, "http://localhost");

  if (req.method === "GET" && parsed.pathname === "/api/xrm10/status") {
    sendJson(res, 200, {
      online: true,
      device: currentDevice(),
      latestProfile: latestProfileMeta(),
      route: readCarRoute(),
      mapPackage: readMapPackage(),
      safetyEventCount: readSafetyEvents().length
    });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/xrm10/profile") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      const changes = Array.isArray(payload.changes) ? payload.changes : [];
      const hasSafetyCritical = changes.some((change) => change.safetyCritical);

      if (payload.policy?.liveVehicleApplyAllowed !== false) {
        sendJson(res, 400, {
          ok: false,
          error: "Bridge accepts profile sync only. liveVehicleApplyAllowed must be false."
        });
        return;
      }

      if (hasSafetyCritical && payload.policy?.safetyCriticalChangesRequireOffroad !== true) {
        sendJson(res, 409, {
          ok: false,
          error: "Safety-critical changes require offroad review policy."
        });
        return;
      }

      fs.mkdirSync(stateDir, { recursive: true });
      fs.writeFileSync(latestProfilePath, JSON.stringify({
        receivedAt: new Date().toISOString(),
        device: currentDevice(),
        changes,
        profile: payload.profile,
        policy: payload.policy
      }, null, 2));

      sendJson(res, 200, {
        ok: true,
        acceptedChanges: changes.length,
        applied: "profile-staged",
        liveVehicleApplyAllowed: false,
        device: currentDevice()
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid profile payload"
      });
    }
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/xrm10/road-state") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");

      if (typeof payload.offroad !== "boolean") {
        sendJson(res, 400, {
          ok: false,
          error: "offroad boolean is required."
        });
        return;
      }

      if (payload.policy?.liveVehicleApplyAllowed !== false) {
        sendJson(res, 400, {
          ok: false,
          error: "Road-state bridge accepts state sync only. liveVehicleApplyAllowed must be false."
        });
        return;
      }

      device.offroad = payload.offroad;

      sendJson(res, 200, {
        ok: true,
        acceptedState: device.offroad ? "offroad" : "onroad",
        applied: "device-road-state-staged",
        liveVehicleApplyAllowed: false,
        device: currentDevice()
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid road-state payload"
      });
    }
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/xrm10/car-route") {
    sendJson(res, 200, {
      ok: true,
      device: currentDevice(),
      route: readCarRoute()
    });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/xrm10/car-route") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");

      if (payload.policy?.liveVehicleApplyAllowed !== false) {
        sendJson(res, 400, {
          ok: false,
          error: "Car-route bridge accepts route intent only. liveVehicleApplyAllowed must be false."
        });
        return;
      }

      const destination = String(payload.destination || "").trim();
      const active = payload.active !== false && Boolean(destination);
      const route = normalizeCarRoute({
        active,
        source: String(payload.source || "car-screen"),
        provider: String(payload.provider || "car-screen-maps"),
        status: active ? "active" : "waiting",
        destination,
        routeId: String(payload.routeId || `car-route-${Date.now()}`),
        nextInstruction: String(payload.nextInstruction || (active
          ? "Route intent ready for driver-confirmed Nav Pilot"
          : "Waiting for destination")),
        confidence: Number(payload.confidence ?? 82),
        updatedAt: new Date().toISOString()
      });
      writeCarRoute(route);

      sendJson(res, 200, {
        ok: true,
        accepted: "car-route-intent-staged",
        liveVehicleApplyAllowed: false,
        device: currentDevice(),
        route
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid car-route payload"
      });
    }
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/xrm10/map-package") {
    sendJson(res, 200, {
      ok: true,
      device: currentDevice(),
      mapPackage: readMapPackage()
    });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/xrm10/map-package") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");

      if (payload.policy?.liveVehicleApplyAllowed !== false) {
        sendJson(res, 400, {
          ok: false,
          error: "Map package bridge accepts map metadata only. liveVehicleApplyAllowed must be false."
        });
        return;
      }

      const mapPackage = normalizeMapPackage({
        ...(payload.mapPackage || {}),
        status: payload.mapPackage?.status || "staged",
        updatedAt: new Date().toISOString()
      });
      writeMapPackage(mapPackage);

      sendJson(res, 200, {
        ok: true,
        accepted: "map-package-metadata-staged",
        liveVehicleApplyAllowed: false,
        device: currentDevice(),
        mapPackage
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid map-package payload"
      });
    }
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/xrm10/safety-events") {
    sendJson(res, 200, {
      ok: true,
      device: currentDevice(),
      events: readSafetyEvents()
    });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/xrm10/safety-event") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");

      if (payload.policy?.liveVehicleApplyAllowed !== false || payload.policy?.logOnly !== true) {
        sendJson(res, 400, {
          ok: false,
          error: "Safety-event bridge accepts log-only events. liveVehicleApplyAllowed must be false."
        });
        return;
      }

      const events = readSafetyEvents();
      const event = {
        receivedAt: new Date().toISOString(),
        device: currentDevice(),
        type: String(payload.type || "xrm10.safety.event"),
        event: String(payload.event || "unknown"),
        kind: String(payload.kind || "unknown"),
        generatedAt: payload.generatedAt || null,
        source: String(payload.source || "xrm10-control-center"),
        route: payload.route || null,
        mapPackage: payload.mapPackage || null,
        profile: payload.profile || {},
        thresholds: payload.thresholds || {},
        details: payload.details || {},
        policy: {
          logOnly: true,
          liveVehicleApplyAllowed: false,
          driverConfirmationRequired: payload.policy?.driverConfirmationRequired !== false,
          publicRoadAutonomyEnabled: false
        }
      };
      events.push(event);
      writeSafetyEvents(events);

      sendJson(res, 200, {
        ok: true,
        accepted: "safety-event-logged",
        eventCount: readSafetyEvents().length,
        liveVehicleApplyAllowed: false,
        device: currentDevice()
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid safety-event payload"
      });
    }
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/xrm10/section-apply") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      const section = String(payload.section || "");

      if (!section) {
        sendJson(res, 400, { ok: false, error: "section is required." });
        return;
      }

      if (payload.policy?.liveVehicleApplyAllowed !== false) {
        sendJson(res, 400, {
          ok: false,
          error: "Section apply accepts profile staging only. liveVehicleApplyAllowed must be false."
        });
        return;
      }

      const statuses = readSectionStatuses();
      statuses[section] = {
        section,
        working: true,
        appliedAt: new Date().toISOString(),
        message: `${section} section staged and confirmed by bridge.`,
        device: currentDevice()
      };
      writeSectionStatuses(statuses);

      sendJson(res, 200, {
        ok: true,
        ...statuses[section]
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid section payload"
      });
    }
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/xrm10/section-status") {
    const section = parsed.searchParams.get("section") || "";
    const statuses = readSectionStatuses();
    const status = statuses[section];
    sendJson(res, 200, status || {
      ok: true,
      section,
      working: false,
      message: "No applied section record yet.",
      device: currentDevice()
    });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/xrm10/ssh-status") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      const target = String(payload.target || "").trim();
      const keyPath = String(payload.keyPath || "").trim();

      if (!target || !keyPath) {
        sendJson(res, 400, { ok: false, error: "target and keyPath are required." });
        return;
      }

      const output = await runSshStatus(target, keyPath);
      sendJson(res, 200, {
        ok: true,
        target,
        output,
        device: currentDevice()
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "SSH status failed"
      });
    }
    return;
  }

  serveFile(req, res);
});

server.listen(port, host, () => {
  console.log(`XRM10 bridge listening on http://${host}:${port}/`);
});
