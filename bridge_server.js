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
const navDrivePlanPath = path.join(stateDir, "nav_drive_plan.json");
const navDriveEventsPath = path.join(stateDir, "nav_drive_events.json");
const mapPackagePath = path.join(stateDir, "map_package.json");
const safetyEventsPath = path.join(stateDir, "safety_events.json");
const appliedControlsPath = path.join(stateDir, "applied_controls.json");
const steeringUploadsDir = path.join(stateDir, "steering_uploads");
const steeringUploadsIndexPath = path.join(steeringUploadsDir, "index.json");

const device = {
  name: "comma four",
  id: "6dea66ada857421f",
  version: "2026.07.05-xrm10-v1-starter",
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
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-XRM10-Token, X-XRM10-Log-Name, X-XRM10-Device",
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

function safeUploadName(value = "") {
  const cleaned = String(value || "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
  return cleaned || `xrm10-steering-${Date.now()}.tgz`;
}

function readSteeringUploadIndex() {
  try {
    const uploads = JSON.parse(fs.readFileSync(steeringUploadsIndexPath, "utf8"));
    return Array.isArray(uploads) ? uploads : [];
  } catch {
    return [];
  }
}

function writeSteeringUploadIndex(uploads) {
  fs.mkdirSync(steeringUploadsDir, { recursive: true });
  fs.writeFileSync(steeringUploadsIndexPath, JSON.stringify(uploads.slice(-500), null, 2));
}

function receiveUploadToFile(req, filePath, maxBytes = 512 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const stream = fs.createWriteStream(filePath, { flags: "wx" });

    stream.on("error", reject);
    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > maxBytes) {
        stream.destroy();
        req.destroy();
        reject(new Error("Upload too large"));
        return;
      }
      stream.write(chunk);
    });
    req.on("end", () => {
      stream.end(() => resolve(bytes));
    });
    req.on("error", (error) => {
      stream.destroy();
      reject(error);
    });
  });
}

function uploadTokenAccepted(req, parsed) {
  const expected = String(process.env.XRM10_UPLOAD_TOKEN || "").trim();
  if (!expected) {
    const forwardedFor = String(req.headers["x-forwarded-for"] || "").trim();
    const remote = String(req.socket?.remoteAddress || "").replace(/^::ffff:/, "");
    return !forwardedFor && (
      remote === "::1" ||
      remote === "127.0.0.1" ||
      remote.startsWith("10.") ||
      remote.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(remote) ||
      remote.startsWith("169.254.")
    );
  }
  const supplied = String(req.headers["x-xrm10-token"] || parsed.searchParams.get("token") || "").trim();
  return supplied === expected;
}

function latestProfileMeta() {
  const payload = readLatestProfile();
  if (!payload) return null;
  return {
    receivedAt: payload.receivedAt,
    changeCount: Array.isArray(payload.changes) ? payload.changes.length : 0
  };
}

function readLatestProfile() {
  try {
    return JSON.parse(fs.readFileSync(latestProfilePath, "utf8"));
  } catch {
    return null;
  }
}

function readAppliedControls() {
  try {
    return JSON.parse(fs.readFileSync(appliedControlsPath, "utf8"));
  } catch {
    return {};
  }
}

function writeAppliedControls(applied) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(appliedControlsPath, JSON.stringify(applied, null, 2));
}

const sectionCapabilities = {
  device: [
    ["deviceTarget", "Device profile target", "live-safe"],
    ["connectionMode", "Bridge connection mode", "live-safe"],
    ["autoSync", "Auto sync queue", "live-safe"],
    ["sshTarget", "SSH status check target", "live-safe"]
  ],
  visuals: [
    ["visualTheme", "Visual theme", "live-safe"],
    ["alertDensity", "Alert density", "live-safe"],
    ["quietMode", "Quiet mode for non-critical sounds", "live-safe"],
    ["driverViewPreview", "Driver-view diagnostics", "live-safe"],
    ["laneOverlay", "Lane overlay", "live-safe"],
    ["roadEdgeOverlay", "Road-edge overlay", "live-safe"]
  ],
  maps: [
    ["mapRouteSourceMode", "Route source", "route-intent-only"],
    ["carScreenRouteMode", "Car-screen route mode", "route-intent-only"],
    ["carScreenRouteSync", "Stage car-screen route intent", "route-intent-only"],
    ["carScreenRouteAutoStart", "Auto-start when car route is detected", "route-intent-only"],
    ["carScreenRouteNavPilot", "Show route intent on comma", "route-intent-only"],
    ["carScreenRouteRequireConfirm", "Advisory-only route intent", "route-intent-only"],
    ["navPlanPrompts", "Nav Drive Plan prompts", "review-only"],
    ["navPlanSigns", "Sign checkpoints", "review-only"],
    ["navPlanTrafficLights", "Traffic light checkpoints", "review-only"],
    ["navPlanRoundabouts", "Roundabout yield plan", "review-only"],
    ["navPlanSpeedBumps", "Speed bump slowdown plan", "review-only"],
    ["navPlanLaneSuggestions", "Faster-lane suggestion prompts", "review-only"],
    ["navPlanReplayOnly", "Replay before road testing", "review-only"],
    ["navPlanClosedCourseOnly", "Closed-course physical testing", "review-only"],
    ["navPlanLearningReview", "Learning review logs", "review-only"]
  ],
  software: [
    ["installTarget", "Install target URL", "live-safe"],
    ["customInstallUrl", "Custom installer URL", "live-safe"]
  ]
};

function capabilityMessage(status) {
  return {
    "live-safe": "Applied to the app/bridge live state. Does not change actuation.",
    "route-intent-only": "Applied as route intent only. Does not steer or change lanes.",
    "map-metadata-only": "Applied as map metadata only. Map files still require a real map pipeline.",
    "review-only": "Active as review/logging/prompt behavior only.",
    "needs-ondevice-integration": "Needs an on-device adapter before it can affect openpilot.",
    "blocked-live-drive": "Blocked from phone live-apply because it affects steering, braking, acceleration, or public-road autonomy."
  }[status] || "Unknown capability state.";
}

function valueForCapability(profile, key) {
  if (!profile) return null;
  if (profile.controllers && Object.prototype.hasOwnProperty.call(profile.controllers, key)) return profile.controllers[key];
  if (profile.tuning && Object.prototype.hasOwnProperty.call(profile.tuning, key)) return profile.tuning[key];
  if (Object.prototype.hasOwnProperty.call(profile, key)) return profile[key];
  if (profile.connection && Object.prototype.hasOwnProperty.call(profile.connection, key)) return profile.connection[key];
  return null;
}

function buildSectionCapability(section, profile = {}) {
  const items = (sectionCapabilities[section] || []).map(([key, label, status]) => ({
    key,
    label,
    value: valueForCapability(profile, key),
    status,
    message: capabilityMessage(status)
  }));
  const summary = summarizeCapabilityItems(items);
  const state = summary.blockedLiveDrive || summary.needsIntegration ? "partial" : "applied";
  return {
    section,
    state,
    working: state === "applied",
    summary,
    items,
    message: capabilitySummaryMessage(summary)
  };
}

function summarizeCapabilityItems(items) {
  return {
    liveSafe: items.filter((item) => item.status === "live-safe").length,
    reviewOnly: items.filter((item) => item.status === "review-only").length,
    routeIntentOnly: items.filter((item) => item.status === "route-intent-only").length,
    mapMetadataOnly: items.filter((item) => item.status === "map-metadata-only").length,
    needsIntegration: items.filter((item) => item.status === "needs-ondevice-integration").length,
    blockedLiveDrive: items.filter((item) => item.status === "blocked-live-drive").length,
    total: items.length
  };
}

function capabilitySummaryMessage(summary) {
  const parts = [];
  if (summary.liveSafe) parts.push(`${summary.liveSafe} live-safe`);
  if (summary.reviewOnly) parts.push(`${summary.reviewOnly} review/logging`);
  if (summary.routeIntentOnly) parts.push(`${summary.routeIntentOnly} route-intent`);
  if (summary.mapMetadataOnly) parts.push(`${summary.mapMetadataOnly} map-metadata`);
  if (summary.needsIntegration) parts.push(`${summary.needsIntegration} needs integration`);
  if (summary.blockedLiveDrive) parts.push(`${summary.blockedLiveDrive} blocked driving`);
  return parts.length ? parts.join(", ") : "No mapped controls in this section.";
}

function buildCapabilityReport(profile = null) {
  const sourceProfile = profile || readLatestProfile()?.profile || {};
  const sections = {};
  for (const section of Object.keys(sectionCapabilities)) {
    sections[section] = buildSectionCapability(section, sourceProfile);
  }
  const totals = Object.values(sections).reduce((acc, section) => {
    for (const [key, value] of Object.entries(section.summary)) {
      acc[key] = (acc[key] || 0) + value;
    }
    return acc;
  }, {});
  return {
    generatedAt: new Date().toISOString(),
    policy: {
      publicRoadAutonomyFromPhone: false,
      unconfirmedDrivingControls: false,
      routeIntentOnly: true,
      reviewPromptsEnabled: true
    },
    totals,
    sections
  };
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
    latitude: "",
    longitude: "",
    googleMapsUrl: "",
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

function carRouteFromRuntime(runtime = {}) {
  const navSource = String(runtime.navSource || "").trim();
  const destination = String(runtime.carScreenDestination || "").trim();
  const latitude = String(runtime.routeLatitude || "").trim();
  const longitude = String(runtime.routeLongitude || "").trim();
  const googleMapsUrl = String(runtime.routeGoogleMapsUrl || "").trim();
  const status = String(runtime.carScreenRouteStatus || "").trim();
  const updatedAt = String(runtime.carScreenRouteUpdatedAt || "").trim();
  const hasLiveRouteState = navSource || runtime.carScreenRouteIntent !== undefined || destination || status || updatedAt;
  if (!hasLiveRouteState) return null;

  const rawRouteSource = String(runtime.routeSource || "").trim();
  const source = rawRouteSource || (navSource === "2" ? "osm-mapd" : navSource === "1" ? "car-screen" : "off");
  const provider = source === "app-route" ? "google-maps-link" : source === "car-screen" ? "car-screen-maps" : source === "osm-mapd" ? "osm-mapd" : "none";
  const autoStart = runtime.navAutoStart !== false;
  const active = source !== "off" && runtime.carScreenRouteIntent === true && autoStart && Boolean(destination);

  return normalizeCarRoute({
    active,
    source,
    provider,
    status: status || (source === "off" ? "off" : destination ? "active" : "waiting"),
    destination,
    latitude,
    longitude,
    googleMapsUrl,
    routeId: destination ? `comma-param-${updatedAt || "live"}` : "",
    nextInstruction: destination
      ? "Route intent staged on comma"
      : (status || "Waiting for car-screen adapter"),
    confidence: destination ? 82 : 0,
    updatedAt: updatedAt || null
  });
}

async function readLiveCarRoute(profile = {}) {
  try {
    const runtime = await readDeviceRuntime(profile);
    await ensureAutoStartedRoute(profile, runtime);
    return carRouteFromRuntime(runtime) || defaultCarRoute();
  } catch {
    return defaultCarRoute();
  }
}

async function ensureAutoStartedRoute(profile = {}, runtime = {}) {
  const destination = String(runtime.carScreenDestination || "").trim();
  const autoStart = runtime.navAutoStart !== false;
  const expectedActive = runtime.navSource === "1" && runtime.carScreenRouteIntent === true && autoStart && Boolean(destination);
  const expectedStatus = expectedActive
    ? "Route active from car-screen destination"
    : runtime.navSource === "1" && runtime.carScreenRouteIntent === true && autoStart && !destination
      ? "Auto-start armed - waiting for car-screen route"
      : "";
  const writes = [];

  if (runtime.navActive !== expectedActive) writes.push(["Xrm10NavActive", expectedActive ? 1 : 0]);
  if (expectedStatus && runtime.carScreenRouteStatus !== expectedStatus) writes.push(["Xrm10CarScreenRouteStatus", expectedStatus]);
  if (!writes.length) return;

  const updatedAt = new Date().toISOString();
  writes.push(["Xrm10CarScreenRouteUpdatedAt", updatedAt]);

  const target = deviceSshTarget(profile);
  const keyPath = deviceSshKeyPath(profile);
  const command = writes.map(([param, value]) => (
    `printf %s ${shellQuote(value)} > /data/params/d/${param}`
  )).join("; ");
  await runSshCommand(target, keyPath, command, 6500);

  runtime.navActive = expectedActive;
  if (expectedStatus) runtime.carScreenRouteStatus = expectedStatus;
  runtime.carScreenRouteUpdatedAt = updatedAt;
}

function writeCarRoute(route) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(carRoutePath, JSON.stringify(normalizeCarRoute(route), null, 2));
}

function normalizeCarRoute(route = {}) {
  const next = defaultCarRoute();
  const destination = String(route.destination || "").trim();
  const latitude = route.latitude === undefined || route.latitude === null ? "" : String(route.latitude).trim();
  const longitude = route.longitude === undefined || route.longitude === null ? "" : String(route.longitude).trim();
  const confidence = Number(route.confidence ?? next.confidence);
  return {
    ...next,
    ...route,
    active: Boolean(route.active && destination),
    source: String(route.source || next.source),
    provider: String(route.provider || next.provider),
    status: String(route.status || (destination ? "active" : next.status)),
    destination,
    latitude,
    longitude,
    googleMapsUrl: String(route.googleMapsUrl || ""),
    routeId: String(route.routeId || ""),
    nextInstruction: String(route.nextInstruction || (destination ? "Route intent ready for driver-confirmed Nav Pilot" : next.nextInstruction)),
    confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(100, confidence)) : next.confidence,
    updatedAt: route.updatedAt || null
  };
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function defaultNavDrivePlan() {
  return {
    active: false,
    status: "waiting",
    mode: "advisory-simulation",
    routeId: "",
    destination: "",
    nextAction: "Waiting for route",
    confidence: 0,
    updatedAt: null,
    simulatedAt: null,
    policy: {
      routeIntentOnly: true,
      simulationOnly: true,
      closedCourseOnly: true,
      logOnly: true,
      liveVehicleApplyAllowed: false,
      publicRoadAutonomyEnabled: false,
      automaticCodeChangesAllowed: false
    },
    steps: []
  };
}

function readNavDrivePlan() {
  try {
    return normalizeNavDrivePlan(JSON.parse(fs.readFileSync(navDrivePlanPath, "utf8")));
  } catch {
    return defaultNavDrivePlan();
  }
}

function writeNavDrivePlan(plan) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(navDrivePlanPath, JSON.stringify(normalizeNavDrivePlan(plan), null, 2));
}

function normalizeNavDriveStep(step = {}, index = 0) {
  const safeIndex = Number.isFinite(Number(index)) ? Number(index) : 0;
  const title = String(step.title || `Drive plan step ${safeIndex + 1}`);
  const id = String(step.id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `step-${safeIndex + 1}`);
  const order = Number(step.order ?? safeIndex + 1);
  return {
    id,
    order: Number.isFinite(order) ? order : safeIndex + 1,
    type: String(step.type || "review"),
    title,
    detail: String(step.detail || ""),
    status: String(step.status || "pending"),
    confidence: clampNumber(step.confidence ?? 75, 0, 100),
    requiresConfirmation: step.requiresConfirmation !== false,
    logKind: String(step.logKind || step.type || "review")
  };
}

function normalizeNavDrivePlan(plan = {}) {
  const next = defaultNavDrivePlan();
  const steps = Array.isArray(plan.steps) ? plan.steps.slice(0, 14).map(normalizeNavDriveStep) : [];
  return {
    ...next,
    ...plan,
    active: Boolean(plan.active && steps.length),
    status: String(plan.status || (steps.length ? "ready" : next.status)),
    mode: String(plan.mode || next.mode),
    routeId: String(plan.routeId || ""),
    destination: String(plan.destination || ""),
    nextAction: String(plan.nextAction || steps[0]?.title || next.nextAction),
    confidence: clampNumber(plan.confidence ?? next.confidence, 0, 100),
    updatedAt: plan.updatedAt || null,
    simulatedAt: plan.simulatedAt || null,
    policy: {
      ...next.policy,
      ...(plan.policy || {}),
      routeIntentOnly: true,
      simulationOnly: plan.policy?.simulationOnly !== false,
      closedCourseOnly: true,
      logOnly: true,
      liveVehicleApplyAllowed: false,
      publicRoadAutonomyEnabled: false,
      automaticCodeChangesAllowed: false
    },
    steps
  };
}

function readNavDriveEvents() {
  try {
    const events = JSON.parse(fs.readFileSync(navDriveEventsPath, "utf8"));
    return normalizeNavDriveEvents(events);
  } catch {
    return [];
  }
}

function writeNavDriveEvents(events) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(navDriveEventsPath, JSON.stringify(normalizeNavDriveEvents(events).slice(-300), null, 2));
}

function normalizeNavDriveEvents(events = []) {
  return Array.isArray(events)
    ? events.slice(-300).map((event) => ({
        receivedAt: event.receivedAt || new Date().toISOString(),
        generatedAt: event.generatedAt || null,
        type: String(event.type || "xrm10.nav.drive.event"),
        event: String(event.event || "nav-drive-event"),
        source: String(event.source || "xrm10-control-center"),
        route: event.route || null,
        step: event.step ? normalizeNavDriveStep(event.step) : null,
        gps: event.gps || {},
        speed: event.speed || {},
        cameraState: event.cameraState || {},
        policy: {
          ...(event.policy || {}),
          logOnly: true,
          routeIntentOnly: true,
          simulationOnly: true,
          closedCourseOnly: true,
          liveVehicleApplyAllowed: false,
          publicRoadAutonomyEnabled: false,
          automaticCodeChangesAllowed: false
        }
      }))
    : [];
}

function assertNavDrivePolicy(policy = {}) {
  if (
    policy.liveVehicleApplyAllowed !== false ||
    policy.publicRoadAutonomyEnabled === true ||
    policy.automaticCodeChangesAllowed === true ||
    policy.closedCourseOnly !== true
  ) {
    throw new Error("Nav Drive Plan accepts advisory/replay/closed-course logs only. Live vehicle control and automatic code changes are blocked.");
  }
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

function boolFromParam(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return undefined;
  return normalized === "1" || normalized === "true";
}

function deviceSshTarget(profile = {}) {
  return String(profile.connection?.sshTarget || process.env.XRM10_SSH_TARGET || "comma4").trim();
}

function deviceSshKeyPath(profile = {}) {
  const keyPath = String(profile.connection?.sshKeyPath || process.env.XRM10_SSH_KEY || "").trim();
  return keyPath && keyPath !== "[stored locally]" ? keyPath : "";
}

function buildSshArgs(target, keyPath, command) {
  const args = [];
  if (keyPath) args.push("-i", keyPath);
  args.push(
    "-o",
    "BatchMode=yes",
    "-o",
    "ConnectTimeout=5",
    "-o",
    "ConnectionAttempts=1",
    target,
    command
  );
  return args;
}

function runSshCommand(target, keyPath, command, timeout = 8000) {
  return new Promise((resolve, reject) => {
    execFile("ssh", buildSshArgs(target, keyPath, command), { timeout }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr.trim() || error.message));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function runSshStatus(target, keyPath) {
  return runSshCommand(target, keyPath, "echo xrm10-ssh-ok; uname -a");
}

function parseKeyValueOutput(output) {
  const parsed = {};
  String(output || "").split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) parsed[match[1].trim()] = match[2].trim();
  });
  return parsed;
}

function valueOrUndefined(values, key) {
  return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : undefined;
}

async function readDeviceRuntime(profile = {}) {
  const target = deviceSshTarget(profile);
  const keyPath = deviceSshKeyPath(profile);
  if (!target) return { sshStatus: "not configured" };

  const output = await runSshCommand(target, keyPath, [
    "printf branch=; cd /data/openpilot && git branch --show-current 2>/dev/null || true",
    "printf commit=; cd /data/openpilot && git rev-parse --short HEAD 2>/dev/null || true",
    "printf offroad=; cat /data/params/d/IsOffroad 2>/dev/null || true; echo",
    "printf engaged=; cat /data/params/d/IsEngaged 2>/dev/null || true; echo",
    "printf quietMode=; cat /data/params/d/QuietMode 2>/dev/null || true; echo",
    "printf driverViewEnabled=; cat /data/params/d/IsDriverViewEnabled 2>/dev/null || true; echo",
    "printf navSource=; cat /data/params/d/Xrm10NavSource 2>/dev/null || true; echo",
    "printf navAutoStart=; cat /data/params/d/Xrm10NavAutoStart 2>/dev/null || true; echo",
    "printf navActive=; cat /data/params/d/Xrm10NavActive 2>/dev/null || true; echo",
    "printf carScreenRouteIntent=; cat /data/params/d/Xrm10CarScreenRouteIntent 2>/dev/null || true; echo",
    "printf carScreenRouteStatus=; cat /data/params/d/Xrm10CarScreenRouteStatus 2>/dev/null || true; echo",
    "printf carScreenDestination=; cat /data/params/d/Xrm10CarScreenDestination 2>/dev/null || true; echo",
    "printf carScreenRouteUpdatedAt=; cat /data/params/d/Xrm10CarScreenRouteUpdatedAt 2>/dev/null || true; echo",
    "printf routeLatitude=; cat /data/params/d/Xrm10RouteLatitude 2>/dev/null || true; echo",
    "printf routeLongitude=; cat /data/params/d/Xrm10RouteLongitude 2>/dev/null || true; echo",
    "printf routeGoogleMapsUrl=; cat /data/params/d/Xrm10RouteGoogleMapsUrl 2>/dev/null || true; echo",
    "printf routeSource=; cat /data/params/d/Xrm10RouteSource 2>/dev/null || true; echo"
  ].join("; "), 6500);
  const values = parseKeyValueOutput(output);
  return {
    sshStatus: "connected",
    branch: values.branch || undefined,
    commit: values.commit || undefined,
    offroad: boolFromParam(values.offroad),
    engaged: boolFromParam(values.engaged),
    quietMode: boolFromParam(values.quietMode),
    driverViewEnabled: boolFromParam(values.driverViewEnabled),
    navSource: values.navSource || undefined,
    navAutoStart: boolFromParam(values.navAutoStart),
    navActive: boolFromParam(values.navActive),
    carScreenRouteIntent: boolFromParam(values.carScreenRouteIntent),
    carScreenRouteStatus: valueOrUndefined(values, "carScreenRouteStatus"),
    carScreenDestination: valueOrUndefined(values, "carScreenDestination"),
    carScreenRouteUpdatedAt: valueOrUndefined(values, "carScreenRouteUpdatedAt"),
    routeLatitude: valueOrUndefined(values, "routeLatitude"),
    routeLongitude: valueOrUndefined(values, "routeLongitude"),
    routeGoogleMapsUrl: valueOrUndefined(values, "routeGoogleMapsUrl"),
    routeSource: valueOrUndefined(values, "routeSource")
  };
}

async function currentDeviceAsync(profile = {}) {
  const next = currentDevice();
  try {
    const runtime = await readDeviceRuntime(profile);
    const verifiedRuntime = Object.fromEntries(Object.entries(runtime).filter(([, value]) => value !== undefined));
    Object.assign(device, verifiedRuntime);
    return {
      ...next,
      ...verifiedRuntime
    };
  } catch (error) {
    return {
      ...currentDevice(),
      sshStatus: "unavailable",
      sshError: error.message || "SSH unavailable"
    };
  }
}

async function writeCommaBoolParam(profile, param, value, options = {}) {
  const allowedParams = new Set(["QuietMode", "IsDriverViewEnabled"]);
  if (!allowedParams.has(param)) {
    return { param, ok: false, state: "blocked", reason: "Param is not whitelisted." };
  }

  const runtime = await readDeviceRuntime(profile);
  if (runtime.engaged) {
    return {
      param,
      ok: false,
      state: "refused",
      reason: "Device is engaged. Park or disengage before changing alert diagnostics."
    };
  }

  if (options.requireOffroad && runtime.offroad !== true) {
    return {
      param,
      ok: false,
      state: "refused",
      reason: "Device must be offroad for driver-view diagnostics."
    };
  }

  const target = deviceSshTarget(profile);
  const keyPath = deviceSshKeyPath(profile);
  const nextValue = value ? "1" : "0";
  let output = "";
  try {
    output = await runSshCommand(
      target,
      keyPath,
      `printf ${nextValue} > /data/params/d/${param}; printf ${param}=; cat /data/params/d/${param} 2>/dev/null; echo`,
      6500
    );
  } catch (error) {
    const verify = await readDeviceRuntime(profile);
    const actual = param === "QuietMode" ? verify.quietMode : verify.driverViewEnabled;
    if (actual === value) {
      return {
        param,
        ok: true,
        state: "applied",
        value,
        output: `${param}=${nextValue}`,
        warning: error.message || "SSH returned nonzero after applying."
      };
    }
    throw error;
  }
  return {
    param,
    ok: output.includes(`${param}=${nextValue}`),
    state: output.includes(`${param}=${nextValue}`) ? "applied" : "unknown",
    value,
    output
  };
}

function shellQuote(value) {
  return `'${String(value ?? "").replace(/'/g, "'\\''")}'`;
}

async function writeCommaParam(profile, param, value) {
  const allowedParams = new Set([
    "Xrm10NavSource",
    "Xrm10NavAutoStart",
    "Xrm10NavActive",
    "Xrm10CarScreenRouteIntent",
    "Xrm10CarScreenRouteStatus",
    "Xrm10CarScreenDestination",
    "Xrm10CarScreenRouteUpdatedAt"
  ]);
  if (!allowedParams.has(param)) {
    return { param, ok: false, state: "blocked", reason: "Param is not whitelisted." };
  }

  const target = deviceSshTarget(profile);
  const keyPath = deviceSshKeyPath(profile);
  const nextValue = String(value ?? "");
  const output = await runSshCommand(
    target,
    keyPath,
    `printf %s ${shellQuote(nextValue)} > /data/params/d/${param}; printf ${param}=; cat /data/params/d/${param} 2>/dev/null; echo`,
    6500
  );
  return {
    param,
    ok: output.includes(`${param}=${nextValue}`),
    state: output.includes(`${param}=${nextValue}`) ? "applied" : "unknown",
    value: nextValue,
    output
  };
}

async function syncNavigationIntentParams(profile = {}) {
  const controllers = profile.controllers || {};
  const activeRoute = profile.computed?.activeCarRoute || {};
  const sourceMode = String(controllers.mapRouteSourceMode || "car-screen");
  const routeSync = controllers.carScreenRouteSync !== false;
  const autoStart = controllers.carScreenRouteAutoStart !== false;
  const routeMode = String(controllers.carScreenRouteMode || "detect-destination");
  const destination = String(activeRoute.destination || controllers.carScreenDestination || "").trim();
  const latitude = String(activeRoute.latitude || controllers.routeLatitude || "").trim();
  const longitude = String(activeRoute.longitude || controllers.routeLongitude || "").trim();
  const googleMapsUrl = String(activeRoute.googleMapsUrl || controllers.googleMapsLink || "").trim();
  const sourceIndex = !routeSync || sourceMode === "disabled" || routeMode === "disabled"
    ? 0
    : sourceMode === "offline-cache" ? 2 : 1;
  const intentEnabled = sourceIndex === 1 && routeSync;
  const navAutoStart = intentEnabled && autoStart;
  const navActive = navAutoStart && Boolean(destination);
  const status = !intentEnabled
    ? "Navigation intent off"
    : destination
      ? navAutoStart ? "Route active from car-screen destination" : "Route detected; auto-start off"
      : navAutoStart ? "Auto-start armed - waiting for car-screen route" : "Waiting for car-screen adapter";
  const updatedAt = new Date().toISOString();

  const writes = [
    ["Xrm10NavSource", sourceIndex],
    ["Xrm10NavAutoStart", navAutoStart ? 1 : 0],
    ["Xrm10NavActive", navActive ? 1 : 0],
    ["Xrm10CarScreenRouteIntent", intentEnabled ? 1 : 0],
    ["Xrm10CarScreenRouteStatus", status],
    ["Xrm10CarScreenDestination", destination],
    ["Xrm10CarScreenRouteUpdatedAt", updatedAt],
    ["Xrm10RouteLatitude", intentEnabled ? latitude : ""],
    ["Xrm10RouteLongitude", intentEnabled ? longitude : ""],
    ["Xrm10RouteGoogleMapsUrl", intentEnabled ? googleMapsUrl : ""],
    ["Xrm10RouteSource", destination ? String(activeRoute.source || sourceMode || "app-route") : ""]
  ];

  const target = deviceSshTarget(profile);
  const keyPath = deviceSshKeyPath(profile);
  const command = writes.map(([param, value]) => (
    `printf %s ${shellQuote(value)} > /data/params/d/${param}; printf ${param}=; cat /data/params/d/${param} 2>/dev/null; echo`
  )).join("; ");

  let output = "";
  try {
    output = await runSshCommand(target, keyPath, command, 6500);
  } catch (error) {
    return {
      state: "partial",
      working: false,
      message: `Navigation intent saved in the app, but comma SSH is unavailable: ${error.message || "SSH write failed"}`,
      results: writes.map(([param, value]) => ({
        param,
        ok: false,
        state: "failed",
        value: String(value ?? ""),
        reason: error.message || "SSH write failed"
      }))
    };
  }

  const results = writes.map(([param, value]) => {
    const nextValue = String(value ?? "");
    const ok = output.includes(`${param}=${nextValue}`);
    return {
      param,
      ok,
      state: ok ? "applied" : "unknown",
      value: nextValue,
      output
    };
  });

  const refused = results.filter((result) => !result.ok);
  return {
    state: refused.length ? "partial" : "applied",
    working: refused.length === 0,
    message: refused.length
      ? `${results.length - refused.length} nav param${results.length - refused.length === 1 ? "" : "s"} applied, ${refused.length} refused.`
      : `${results.length} nav intent params applied on comma.`,
    results
  };
}

async function applyRouteIntentToComma(profile = {}, route = defaultCarRoute()) {
  const normalized = normalizeCarRoute(route);
  const active = Boolean(normalized.active && normalized.destination);
  const status = active
    ? "Route active from app destination"
    : "Auto-start armed - waiting for car-screen route";
  const updatedAt = new Date().toISOString();
  const writes = [
    ["Xrm10NavSource", 1],
    ["Xrm10NavAutoStart", 1],
    ["Xrm10NavActive", active ? 1 : 0],
    ["Xrm10CarScreenRouteIntent", 1],
    ["Xrm10CarScreenRouteStatus", status],
    ["Xrm10CarScreenDestination", active ? normalized.destination : ""],
    ["Xrm10CarScreenRouteUpdatedAt", updatedAt],
    ["Xrm10RouteLatitude", active ? normalized.latitude : ""],
    ["Xrm10RouteLongitude", active ? normalized.longitude : ""],
    ["Xrm10RouteGoogleMapsUrl", active ? normalized.googleMapsUrl : ""],
    ["Xrm10RouteSource", active ? normalized.source : ""]
  ];

  const target = deviceSshTarget(profile);
  const keyPath = deviceSshKeyPath(profile);
  const command = writes.map(([param, value]) => (
    `printf %s ${shellQuote(value)} > /data/params/d/${param}; printf ${param}=; cat /data/params/d/${param} 2>/dev/null; echo`
  )).join("; ");
  const output = await runSshCommand(target, keyPath, command, 6500);

  return {
    output,
    updatedAt,
    status,
    results: writes.map(([param, value]) => {
      const expected = String(value ?? "");
      return {
        param,
        value: expected,
        ok: output.includes(`${param}=${expected}`)
      };
    })
  };
}

async function applyWhitelistedDeviceParams(section, profile = {}) {
  if (section === "maps") return syncNavigationIntentParams(profile);
  if (section !== "visuals") return { state: "none", working: true, message: "" };

  const controllers = profile.controllers || {};
  const requested = [
    {
      key: "quietMode",
      param: "QuietMode",
      label: "Quiet mode",
      value: Boolean(controllers.quietMode),
      requireOffroad: false
    },
    {
      key: "driverViewPreview",
      param: "IsDriverViewEnabled",
      label: "Driver-view diagnostics",
      value: Boolean(controllers.driverViewPreview),
      requireOffroad: Boolean(controllers.driverViewPreview)
    }
  ];

  const results = [];
  for (const item of requested) {
    try {
      const result = await writeCommaBoolParam(profile, item.param, item.value, { requireOffroad: item.requireOffroad });
      results.push({ ...item, ...result });
    } catch (error) {
      results.push({
        ...item,
        ok: false,
        state: "failed",
        reason: error.message || "SSH write failed"
      });
    }
  }

  const refused = results.filter((result) => !result.ok);
  const applied = results.filter((result) => result.ok);
  const message = refused.length
    ? `${applied.length} comfort param${applied.length === 1 ? "" : "s"} applied, ${refused.length} refused: ${refused.map((item) => `${item.label} - ${item.reason || item.state}`).join("; ")}`
    : `${applied.length} comfort param${applied.length === 1 ? "" : "s"} applied on comma.`;

  return {
    state: refused.length ? "partial" : "applied",
    working: refused.length === 0,
    message,
    results
  };
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
    const latestProfile = readLatestProfile()?.profile || {};
    const route = await readLiveCarRoute(latestProfile);
    sendJson(res, 200, {
      online: true,
      device: await currentDeviceAsync(latestProfile),
      latestProfile: latestProfileMeta(),
      route,
      navDrivePlan: readNavDrivePlan(),
      navDriveEvents: readNavDriveEvents(),
      mapPackage: readMapPackage(),
      safetyEventCount: readSafetyEvents().length,
      capabilities: buildCapabilityReport(latestProfile)
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
        device: currentDevice(),
        capabilities: buildCapabilityReport(payload.profile || {})
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
    const route = await readLiveCarRoute(readLatestProfile()?.profile || {});
    sendJson(res, 200, {
      ok: true,
      device: await currentDeviceAsync(readLatestProfile()?.profile || {}),
      route
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
        source: String(payload.source || "app-route"),
        provider: String(payload.provider || "car-screen-maps"),
        status: active ? "active" : "waiting",
        destination,
        latitude: payload.latitude ?? "",
        longitude: payload.longitude ?? "",
        googleMapsUrl: String(payload.googleMapsUrl || ""),
        routeId: String(payload.routeId || `car-route-${Date.now()}`),
        nextInstruction: String(payload.nextInstruction || (active
          ? "Route intent ready for driver-confirmed Nav Pilot"
          : "Waiting for destination")),
        confidence: Number(payload.confidence ?? 82),
        updatedAt: new Date().toISOString()
      });
      writeCarRoute(route);

      let deviceParamApply = null;
      try {
        deviceParamApply = await applyRouteIntentToComma(readLatestProfile()?.profile || {}, route);
        route.status = deviceParamApply.status;
        route.updatedAt = deviceParamApply.updatedAt;
        route.nextInstruction = active
          ? "Destination staged on comma Navigation screen"
          : "Route cleared on comma";
        writeCarRoute(route);
      } catch (error) {
        deviceParamApply = {
          state: "partial",
          working: false,
          error: error.message || "SSH route apply failed"
        };
      }

      sendJson(res, 200, {
        ok: true,
        accepted: "car-route-intent-staged",
        liveVehicleApplyAllowed: false,
        device: await currentDeviceAsync(readLatestProfile()?.profile || {}),
        route,
        deviceParams: deviceParamApply
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid car-route payload"
      });
    }
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/xrm10/nav-drive-plan") {
    sendJson(res, 200, {
      ok: true,
      device: currentDevice(),
      plan: readNavDrivePlan(),
      events: readNavDriveEvents()
    });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/xrm10/nav-drive-plan") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      assertNavDrivePolicy(payload.policy || payload.plan?.policy || {});

      const plan = normalizeNavDrivePlan({
        ...(payload.plan || {}),
        updatedAt: new Date().toISOString()
      });
      writeNavDrivePlan(plan);

      sendJson(res, 200, {
        ok: true,
        accepted: "nav-drive-plan-staged",
        liveVehicleApplyAllowed: false,
        publicRoadAutonomyEnabled: false,
        automaticCodeChangesAllowed: false,
        device: currentDevice(),
        plan,
        eventCount: readNavDriveEvents().length
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid nav-drive-plan payload"
      });
    }
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/xrm10/nav-drive-events") {
    sendJson(res, 200, {
      ok: true,
      device: currentDevice(),
      events: readNavDriveEvents()
    });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/xrm10/nav-drive-event") {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body || "{}");
      assertNavDrivePolicy(payload.policy || {});

      const events = readNavDriveEvents();
      const event = normalizeNavDriveEvents([{
        ...payload,
        receivedAt: new Date().toISOString()
      }])[0];
      events.push(event);
      writeNavDriveEvents(events);

      sendJson(res, 200, {
        ok: true,
        accepted: "nav-drive-event-logged",
        liveVehicleApplyAllowed: false,
        publicRoadAutonomyEnabled: false,
        automaticCodeChangesAllowed: false,
        device: currentDevice(),
        eventCount: readNavDriveEvents().length,
        events: readNavDriveEvents()
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid nav-drive-event payload"
      });
    }
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/xrm10/steering-log-uploads") {
    sendJson(res, 200, {
      ok: true,
      device: currentDevice(),
      uploads: readSteeringUploadIndex()
    });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/xrm10/steering-log-upload") {
    let filePath = "";
    try {
      if (!uploadTokenAccepted(req, parsed)) {
        sendJson(res, 401, {
          ok: false,
          error: "Invalid steering log upload token."
        });
        return;
      }

      const requestedName = req.headers["x-xrm10-log-name"] || parsed.searchParams.get("name") || "";
      const fileName = `${new Date().toISOString().replace(/[:.]/g, "-")}-${safeUploadName(requestedName)}`;
      filePath = path.join(steeringUploadsDir, fileName);
      const bytes = await receiveUploadToFile(req, filePath);
      const uploads = readSteeringUploadIndex();
      const entry = {
        receivedAt: new Date().toISOString(),
        fileName,
        bytes,
        deviceName: String(req.headers["x-xrm10-device"] || ""),
        sourceAddress: req.socket?.remoteAddress || "",
        contentType: String(req.headers["content-type"] || "application/octet-stream"),
        path: filePath
      };
      uploads.push(entry);
      writeSteeringUploadIndex(uploads);

      sendJson(res, 200, {
        ok: true,
        accepted: "steering-log-uploaded",
        upload: entry,
        uploadCount: uploads.length
      });
    } catch (error) {
      if (filePath) {
        try { fs.unlinkSync(filePath); } catch {}
      }
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid steering log upload"
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

  if (req.method === "GET" && parsed.pathname === "/api/xrm10/capabilities") {
    sendJson(res, 200, {
      ok: true,
      device: currentDevice(),
      capabilities: buildCapabilityReport()
    });
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

      const profile = payload.profile || {};
      const capability = buildSectionCapability(section, profile);
      const deviceParamApply = await applyWhitelistedDeviceParams(section, profile);
      const sectionState = deviceParamApply.state === "partial" ? "partial" : capability.state;
      const sectionMessage = [capability.message, deviceParamApply.message].filter(Boolean).join(" ");
      capability.deviceParams = deviceParamApply;
      const appliedControls = readAppliedControls();
      appliedControls[section] = {
        section,
        appliedAt: new Date().toISOString(),
        capability,
        profile
      };
      writeAppliedControls(appliedControls);

      const statuses = readSectionStatuses();
      statuses[section] = {
        section,
        state: sectionState,
        working: sectionState === "applied" && capability.working && deviceParamApply.working,
        appliedAt: new Date().toISOString(),
        message: sectionMessage,
        capability,
        device: await currentDeviceAsync(profile)
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
      state: "unknown",
      working: false,
      message: "No applied section record yet.",
      capability: buildSectionCapability(section, readLatestProfile()?.profile || {}),
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

      if (!target) {
        sendJson(res, 400, { ok: false, error: "target is required." });
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
