const STORAGE_KEY = "xrm10-control-center-profile-v1";

const safetyLocks = [
  {
    id: "driverMonitoring",
    label: "Driver monitoring",
    detail: "Required for all profiles",
    locked: true
  },
  {
    id: "excessiveActuation",
    label: "Excessive actuation checks",
    detail: "Cannot be disabled from this app",
    locked: true
  },
  {
    id: "pandaSafety",
    label: "Panda safety model",
    detail: "Read-only safety boundary",
    locked: true
  },
  {
    id: "manualOverride",
    label: "Manual override",
    detail: "Brake, cancel, and steering takeover preserved",
    locked: true
  }
];

const installTargets = [
  {
    id: "xrm10-dev",
    label: "XRM10 sunnypilot dev",
    url: "https://installer.comma.ai/xrm10/dev",
    meta: "active development target"
  },
  {
    id: "xrm10-backup",
    label: "XRM10 comma release backup",
    url: "https://installer.comma.ai/xrm10/openpilot-release-mici-backup-20260702",
    meta: "rollback branch"
  },
  {
    id: "sunnypilot-release",
    label: "sunnypilot release-mici review",
    url: "https://installer.comma.ai/sunnypilot/release-mici",
    meta: "upstream comparison target"
  }
];

const sectionMeta = {
  device: ["Device settings", "Device"],
  toggles: ["Device settings", "Toggles"],
  models: ["Device settings", "Models"],
  steering: ["Device settings", "Steering"],
  cruise: ["Device settings", "Cruise"],
  visuals: ["Device settings", "Visuals"],
  display: ["Device settings", "Display"],
  maps: ["Device settings", "Maps"],
  vehicle: ["Device settings", "Vehicle"],
  software: ["Device settings", "Software"],
  developer: ["Device settings", "Developer"],
  migration: ["Device settings", "Migration Wizard"]
};

const defaultProfile = {
  schemaVersion: 3,
  activeSection: "device",
  profileName: "XRM10 Model 3 HW4",
  vehicleModel: "Tesla Model 3",
  vehicleYear: "2024",
  deviceTarget: "comma four",
  installTarget: "xrm10-dev",
  customInstallUrl: "",
  controllers: {
    lateralMode: "standard",
    madsMode: "stock",
    laneChangeMode: "nudge",
    speedAssistMode: "info",
    blindSpotDelay: true,
    laneTurnDesire: false,
    coopSteering: false,
    experimentalControls: false,
    longitudinalMode: "stock",
    laneCenterMode: "center",
    curveSpeedMode: "advisory",
    leadBehaviorMode: "stock",
    roadEdgeMode: "warn",
    promptMode: "standard",
    logMode: "summary",
    deviceGuardMode: "balanced",
    stopGoSmoothing: false,
    modelUncertaintyAlert: true,
    reviewLogCapture: true,
    thermalGuard: true,
    handsOnReminder: true,
    metricUnits: false,
    modelStackMode: "sunnypilot-dev",
    visionPolicyMode: "guarded",
    laneModelMode: "hw4-review",
    leadModelMode: "standard",
    modelFallbackMode: "safe-revert",
    modelCacheMode: "stable",
    torqueLimitMode: "stock",
    steerFaultCooldown: "2",
    cruiseSourceMode: "set-speed",
    trafficLightReview: false,
    visualTheme: "sunnypilot-dark",
    alertDensity: "normal",
    laneOverlay: "standard",
    eventBannerStyle: "compact",
    roadEdgeOverlay: true,
    showDebugHud: false,
    displayTheme: "auto",
    keepAwakeMode: "plugged",
    unitsMode: "imperial",
    largeText: false,
    reduceMotion: false,
    mapMode: "online",
    routeAssistMode: "advisory",
    speedLimitSource: "map-vision",
    mapRegion: "us",
    offlineMaps: false,
    mapLaneGuidance: true,
    tireSizePreset: "stock-18",
    vehicleHarnessMode: "review",
    regionProfile: "us",
    powertrainProfile: "awd-review",
    vinNickname: "",
    testRouteMode: "off",
    radarInteropReview: false,
    parameterPreviewMode: "readonly",
    developerMode: false,
    replayReview: false,
    eventSnapshot: true,
    cabanaExport: false,
    migrationSource: "manual",
    backupSlot: "slot-a"
  },
  tuning: {
    followGap: 2.5,
    speedOffset: 1,
    laneDelay: 1,
    curveComfort: 72,
    steerSmoothness: 70,
    laneBias: 0,
    brakeComfort: 72,
    promptLeadTime: 1.2,
    modelConfidenceGate: 65,
    steerRateLimit: 70,
    steerActuatorDelay: 0.2,
    autoNudgeStrength: 50,
    accelComfort: 70,
    stopResumeDelay: 1,
    turnSpeedMargin: 6,
    screenBrightness: 70,
    mapBrightness: 60,
    routePreviewDistance: 1.5
  },
  safetyPolicy: {
    driverMonitoringRequired: true,
    excessiveActuationChecksLocked: true,
    pandaSafetyReadOnly: true,
    manualOverrideRequired: true,
    unsafeSafetyLimitEditingAllowed: false,
    liveVehicleParamWritesAllowed: false,
    phoneSafetyLimitEditingAllowed: false
  }
};

const textBindings = [
  ["profileName", ["profileName"]],
  ["customInstallUrl", ["customInstallUrl"]],
  ["vinNickname", ["controllers", "vinNickname"]]
];

const selectBindings = [
  ["deviceTarget", ["deviceTarget"]],
  ["vehicleModel", ["vehicleModel"]],
  ["vehicleYear", ["vehicleYear"]],
  ["lateralMode", ["controllers", "lateralMode"]],
  ["madsMode", ["controllers", "madsMode"]],
  ["laneChangeMode", ["controllers", "laneChangeMode"]],
  ["speedAssistMode", ["controllers", "speedAssistMode"]],
  ["longitudinalMode", ["controllers", "longitudinalMode"]],
  ["laneCenterMode", ["controllers", "laneCenterMode"]],
  ["curveSpeedMode", ["controllers", "curveSpeedMode"]],
  ["leadBehaviorMode", ["controllers", "leadBehaviorMode"]],
  ["roadEdgeMode", ["controllers", "roadEdgeMode"]],
  ["promptMode", ["controllers", "promptMode"]],
  ["logMode", ["controllers", "logMode"]],
  ["deviceGuardMode", ["controllers", "deviceGuardMode"]],
  ["modelStackMode", ["controllers", "modelStackMode"]],
  ["visionPolicyMode", ["controllers", "visionPolicyMode"]],
  ["laneModelMode", ["controllers", "laneModelMode"]],
  ["leadModelMode", ["controllers", "leadModelMode"]],
  ["modelFallbackMode", ["controllers", "modelFallbackMode"]],
  ["modelCacheMode", ["controllers", "modelCacheMode"]],
  ["torqueLimitMode", ["controllers", "torqueLimitMode"]],
  ["steerFaultCooldown", ["controllers", "steerFaultCooldown"]],
  ["cruiseSourceMode", ["controllers", "cruiseSourceMode"]],
  ["visualTheme", ["controllers", "visualTheme"]],
  ["alertDensity", ["controllers", "alertDensity"]],
  ["laneOverlay", ["controllers", "laneOverlay"]],
  ["eventBannerStyle", ["controllers", "eventBannerStyle"]],
  ["displayTheme", ["controllers", "displayTheme"]],
  ["keepAwakeMode", ["controllers", "keepAwakeMode"]],
  ["unitsMode", ["controllers", "unitsMode"]],
  ["mapMode", ["controllers", "mapMode"]],
  ["routeAssistMode", ["controllers", "routeAssistMode"]],
  ["speedLimitSource", ["controllers", "speedLimitSource"]],
  ["mapRegion", ["controllers", "mapRegion"]],
  ["tireSizePreset", ["controllers", "tireSizePreset"]],
  ["vehicleHarnessMode", ["controllers", "vehicleHarnessMode"]],
  ["regionProfile", ["controllers", "regionProfile"]],
  ["powertrainProfile", ["controllers", "powertrainProfile"]],
  ["testRouteMode", ["controllers", "testRouteMode"]],
  ["parameterPreviewMode", ["controllers", "parameterPreviewMode"]],
  ["migrationSource", ["controllers", "migrationSource"]],
  ["backupSlot", ["controllers", "backupSlot"]]
];

const checkboxBindings = [
  ["blindSpotDelay", ["controllers", "blindSpotDelay"]],
  ["laneTurnDesire", ["controllers", "laneTurnDesire"]],
  ["coopSteering", ["controllers", "coopSteering"]],
  ["experimentalControls", ["controllers", "experimentalControls"]],
  ["stopGoSmoothing", ["controllers", "stopGoSmoothing"]],
  ["modelUncertaintyAlert", ["controllers", "modelUncertaintyAlert"]],
  ["reviewLogCapture", ["controllers", "reviewLogCapture"]],
  ["thermalGuard", ["controllers", "thermalGuard"]],
  ["handsOnReminder", ["controllers", "handsOnReminder"]],
  ["metricUnits", ["controllers", "metricUnits"]],
  ["trafficLightReview", ["controllers", "trafficLightReview"]],
  ["roadEdgeOverlay", ["controllers", "roadEdgeOverlay"]],
  ["showDebugHud", ["controllers", "showDebugHud"]],
  ["largeText", ["controllers", "largeText"]],
  ["reduceMotion", ["controllers", "reduceMotion"]],
  ["offlineMaps", ["controllers", "offlineMaps"]],
  ["mapLaneGuidance", ["controllers", "mapLaneGuidance"]],
  ["radarInteropReview", ["controllers", "radarInteropReview"]],
  ["developerMode", ["controllers", "developerMode"]],
  ["replayReview", ["controllers", "replayReview"]],
  ["eventSnapshot", ["controllers", "eventSnapshot"]],
  ["cabanaExport", ["controllers", "cabanaExport"]]
];

const rangeBindings = [
  { id: "followGap", path: ["tuning", "followGap"], min: 2, max: 3.8, valueId: "followGapValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "speedOffset", path: ["tuning", "speedOffset"], min: 0, max: 4, valueId: "speedOffsetValue", format: (v) => `+${v} mph` },
  { id: "laneDelay", path: ["tuning", "laneDelay"], min: 0, max: 3, valueId: "laneDelayValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "curveComfort", path: ["tuning", "curveComfort"], min: 50, max: 90, valueId: "curveComfortValue", format: String },
  { id: "steerSmoothness", path: ["tuning", "steerSmoothness"], min: 50, max: 90, valueId: "steerSmoothnessValue", format: String },
  { id: "laneBias", path: ["tuning", "laneBias"], min: -20, max: 20, valueId: "laneBiasValue", format: (v) => `${signed(v)} cm` },
  { id: "brakeComfort", path: ["tuning", "brakeComfort"], min: 50, max: 90, valueId: "brakeComfortValue", format: String },
  { id: "promptLeadTime", path: ["tuning", "promptLeadTime"], min: 0.5, max: 2.5, valueId: "promptLeadTimeValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "modelConfidenceGate", path: ["tuning", "modelConfidenceGate"], min: 50, max: 90, valueId: "modelConfidenceGateValue", format: (v) => `${v}%` },
  { id: "steerRateLimit", path: ["tuning", "steerRateLimit"], min: 50, max: 90, valueId: "steerRateLimitValue", format: String },
  { id: "steerActuatorDelay", path: ["tuning", "steerActuatorDelay"], min: 0.1, max: 0.5, valueId: "steerActuatorDelayValue", format: (v) => `${Number(v).toFixed(2)}s` },
  { id: "autoNudgeStrength", path: ["tuning", "autoNudgeStrength"], min: 0, max: 80, valueId: "autoNudgeStrengthValue", format: String },
  { id: "accelComfort", path: ["tuning", "accelComfort"], min: 50, max: 90, valueId: "accelComfortValue", format: String },
  { id: "stopResumeDelay", path: ["tuning", "stopResumeDelay"], min: 0, max: 3, valueId: "stopResumeDelayValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "turnSpeedMargin", path: ["tuning", "turnSpeedMargin"], min: 3, max: 12, valueId: "turnSpeedMarginValue", format: (v) => `${v} mph` },
  { id: "screenBrightness", path: ["tuning", "screenBrightness"], min: 25, max: 100, valueId: "screenBrightnessValue", format: (v) => `${v}%` },
  { id: "mapBrightness", path: ["tuning", "mapBrightness"], min: 25, max: 100, valueId: "mapBrightnessValue", format: (v) => `${v}%` },
  { id: "routePreviewDistance", path: ["tuning", "routePreviewDistance"], min: 0.5, max: 5, valueId: "routePreviewDistanceValue", format: (v) => `${Number(v).toFixed(1)} mi` }
];

let profile = loadProfile();

const els = {
  sectionEyebrow: document.querySelector("#sectionEyebrow"),
  sectionTitle: document.querySelector("#sectionTitle"),
  safetyScore: document.querySelector("#safetyScore"),
  safetyMeter: document.querySelector("#safetyMeter"),
  safetyBadge: document.querySelector("#safetyBadge"),
  controllerBadge: document.querySelector("#controllerBadge"),
  moduleBadge: document.querySelector("#moduleBadge"),
  activeBranchLabel: document.querySelector("#activeBranchLabel"),
  activeBranchMeta: document.querySelector("#activeBranchMeta"),
  branchStatusDot: document.querySelector("#branchStatusDot"),
  sidebarStatus: document.querySelector("#sidebarStatus"),
  previewTitle: document.querySelector("#previewTitle"),
  previewText: document.querySelector("#previewText"),
  lockList: document.querySelector("#lockList"),
  targetList: document.querySelector("#targetList"),
  controllerSummary: document.querySelector("#controllerSummary"),
  jsonPreview: document.querySelector("#jsonPreview"),
  resetProfile: document.querySelector("#resetProfile"),
  copyInstallUrl: document.querySelector("#copyInstallUrl"),
  downloadProfile: document.querySelector("#downloadProfile"),
  downloadProfileSecondary: document.querySelector("#downloadProfileSecondary"),
  importButton: document.querySelector("#importButton"),
  importButtonSecondary: document.querySelector("#importButtonSecondary"),
  importInput: document.querySelector("#importInput"),
  toast: document.querySelector("#toast")
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadProfile() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeProfile(JSON.parse(saved)) : clone(defaultProfile);
  } catch {
    return clone(defaultProfile);
  }
}

function normalizeProfile(input) {
  const next = clone(defaultProfile);
  return {
    ...next,
    ...input,
    schemaVersion: next.schemaVersion,
    activeSection: sectionMeta[input.activeSection] ? input.activeSection : next.activeSection,
    controllers: {
      ...next.controllers,
      ...(input.controllers || {})
    },
    tuning: {
      ...next.tuning,
      ...(input.tuning || {})
    },
    safetyPolicy: {
      ...next.safetyPolicy,
      ...(input.safetyPolicy || {}),
      driverMonitoringRequired: true,
      excessiveActuationChecksLocked: true,
      pandaSafetyReadOnly: true,
      manualOverrideRequired: true,
      unsafeSafetyLimitEditingAllowed: false,
      liveVehicleParamWritesAllowed: false,
      phoneSafetyLimitEditingAllowed: false
    }
  };
}

function saveProfile() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function selectedTarget() {
  return installTargets.find((target) => target.id === profile.installTarget) || installTargets[0];
}

function activeInstallUrl() {
  const custom = profile.customInstallUrl.trim();
  return custom || selectedTarget().url;
}

function computeSafetyScore() {
  const c = profile.controllers;
  const t = profile.tuning;
  let score = 100;

  if (c.experimentalControls) score -= 20;
  if (c.developerMode) score -= 6;
  if (c.coopSteering) score -= 8;
  if (c.longitudinalMode === "traffic-review") score -= 10;
  if (c.curveSpeedMode === "bounded") score -= 4;
  if (c.roadEdgeMode === "off") score -= 8;
  if (c.promptMode === "quiet") score -= 5;
  if (c.logMode === "minimal" && c.experimentalControls) score -= 8;
  if (c.deviceGuardMode === "diagnostic") score -= 4;
  if (c.stopGoSmoothing) score -= 4;
  if (c.torqueLimitMode === "review") score -= 8;
  if (c.modelFallbackMode !== "safe-revert") score -= 5;
  if (c.parameterPreviewMode !== "readonly") score -= 4;
  if (c.trafficLightReview) score -= 4;
  if (c.radarInteropReview) score -= 8;
  if (c.testRouteMode === "closed-course") score -= 4;
  if (!c.handsOnReminder) score -= 10;
  if (!c.modelUncertaintyAlert) score -= 8;
  if (!c.reviewLogCapture && c.experimentalControls) score -= 8;
  if (!c.thermalGuard) score -= 8;
  if (c.laneChangeMode !== "nudge" && c.laneChangeMode !== "off") score -= 10;
  if (!c.blindSpotDelay && c.laneChangeMode !== "off") score -= 18;
  if (Number(t.followGap) < 2.2) score -= 10;
  if (Number(t.speedOffset) > 2) score -= 6;
  if (Math.abs(Number(t.laneBias)) > 10) score -= 6;
  if (Number(t.promptLeadTime) < 1) score -= 5;
  if (Number(t.modelConfidenceGate) < 60) score -= 8;
  if (profile.deviceTarget !== "comma four") score -= 8;

  return Math.max(0, Math.min(100, score));
}

function controllerLabel() {
  const score = computeSafetyScore();
  if (score >= 92) return "Guarded";
  if (score >= 75) return "Review";
  return "High review";
}

function statusClass(score) {
  if (score >= 92) return "pass";
  if (score >= 75) return "warn";
  return "stop";
}

function readForm() {
  for (const [id, path] of textBindings) {
    const input = byId(id);
    if (input) setPath(profile, path, input.value.trim());
  }

  for (const [id, path] of selectBindings) {
    const input = byId(id);
    if (input) setPath(profile, path, input.value);
  }

  for (const [id, path] of checkboxBindings) {
    const input = byId(id);
    if (input) setPath(profile, path, input.checked);
  }

  for (const binding of rangeBindings) {
    const input = byId(binding.id);
    if (input) setPath(profile, binding.path, Number(input.value));
  }

  profile.profileName = profile.profileName || defaultProfile.profileName;
  enforceGuardrails();
  saveProfile();
}

function enforceGuardrails() {
  profile.schemaVersion = defaultProfile.schemaVersion;
  profile.safetyPolicy.driverMonitoringRequired = true;
  profile.safetyPolicy.excessiveActuationChecksLocked = true;
  profile.safetyPolicy.pandaSafetyReadOnly = true;
  profile.safetyPolicy.manualOverrideRequired = true;
  profile.safetyPolicy.unsafeSafetyLimitEditingAllowed = false;
  profile.safetyPolicy.liveVehicleParamWritesAllowed = false;
  profile.safetyPolicy.phoneSafetyLimitEditingAllowed = false;

  if (profile.controllers.experimentalControls) {
    profile.controllers.coopSteering = false;
    profile.controllers.reviewLogCapture = true;
    profile.controllers.eventSnapshot = true;
  }

  if (profile.controllers.metricUnits) {
    profile.controllers.unitsMode = "metric";
  }

  if (profile.controllers.promptMode === "quiet") {
    profile.tuning.promptLeadTime = Math.max(profile.tuning.promptLeadTime, 1);
  }

  if (profile.controllers.laneChangeMode === "off") {
    profile.tuning.laneDelay = 0;
  }

  for (const binding of rangeBindings) {
    setPath(profile, binding.path, clamp(getPath(profile, binding.path), binding.min, binding.max));
  }
}

function writeForm() {
  for (const [id, path] of textBindings) {
    const input = byId(id);
    if (input) input.value = getPath(profile, path) ?? "";
  }

  for (const [id, path] of selectBindings) {
    const input = byId(id);
    if (input) input.value = getPath(profile, path);
  }

  for (const [id, path] of checkboxBindings) {
    const input = byId(id);
    if (input) input.checked = Boolean(getPath(profile, path));
  }

  for (const binding of rangeBindings) {
    const input = byId(binding.id);
    if (input) input.value = getPath(profile, binding.path);
  }

  render();
}

function renderLocks() {
  if (!els.lockList) return;
  els.lockList.innerHTML = safetyLocks
    .map((lock) => `
      <div class="lock-row">
        <span class="lock-icon">OK</span>
        <div>
          <strong>${lock.label}</strong>
          <span>${lock.detail}</span>
        </div>
        <em>${lock.locked ? "locked" : "review"}</em>
      </div>
    `)
    .join("");
}

function renderTargets() {
  if (!els.targetList) return;
  els.targetList.innerHTML = installTargets
    .map((target) => `
      <div class="target-card ${target.id === profile.installTarget ? "active" : ""}">
        <div>
          <strong>${target.label}</strong>
          <span>${target.meta}</span>
          <span>${target.url}</span>
        </div>
        <button type="button" data-target="${target.id}">
          ${target.id === profile.installTarget ? "Active" : "Use"}
        </button>
      </div>
    `)
    .join("");
}

function render() {
  const score = computeSafetyScore();
  const stateClass = statusClass(score);
  const target = selectedTarget();
  const branchLabel = profile.customInstallUrl ? "custom URL" : target.label;

  updateRangeLabels();
  setText(els.safetyScore, String(score));
  if (els.safetyMeter) els.safetyMeter.style.width = `${score}%`;
  setBadge(els.safetyBadge, score >= 92 ? "Locked" : "Review", stateClass);
  setBadge(els.controllerBadge, controllerLabel(), stateClass);
  setBadge(els.moduleBadge, `${activeControllerCount()} modules`, stateClass);
  setText(els.sidebarStatus, controllerLabel());
  setText(els.activeBranchLabel, branchLabel);
  setText(els.activeBranchMeta, activeInstallUrl());
  if (els.branchStatusDot) els.branchStatusDot.style.background = score >= 92 ? "var(--green)" : score >= 75 ? "var(--yellow)" : "var(--red)";
  setText(els.previewTitle, previewTitle());
  setText(els.previewText, previewText());
  if (els.controllerSummary) els.controllerSummary.innerHTML = controllerSummaryRows();
  if (els.jsonPreview) els.jsonPreview.textContent = JSON.stringify(exportProfile(), null, 2);
  renderTargets();
  renderSection(profile.activeSection);

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateRangeLabels() {
  for (const binding of rangeBindings) {
    const label = byId(binding.valueId);
    if (label) label.textContent = binding.format(getPath(profile, binding.path));
  }
}

function previewTitle() {
  if (profile.controllers.laneChangeMode === "off") return "Lane changes off";
  if (profile.controllers.blindSpotDelay) return "Guarded lane assist";
  return "Lane assist review";
}

function previewText() {
  if (profile.controllers.laneChangeMode === "off") return "Lane centering only. Lane-change automation disabled.";
  if (!profile.controllers.blindSpotDelay) return "Blind-spot delay disabled. Review before install.";
  if (profile.controllers.laneChangeMode === "nudge") return "Nudge required before lane changes.";
  return `Timer mode with ${Number(profile.tuning.laneDelay).toFixed(1)}s delay.`;
}

function activeControllerCount() {
  const fixedModules = [
    "lateralMode",
    "madsMode",
    "laneChangeMode",
    "speedAssistMode",
    "longitudinalMode",
    "laneCenterMode",
    "curveSpeedMode",
    "leadBehaviorMode",
    "roadEdgeMode",
    "promptMode",
    "logMode",
    "deviceGuardMode",
    "modelStackMode",
    "visionPolicyMode",
    "mapMode",
    "routeAssistMode",
    "vehicleHarnessMode",
    "parameterPreviewMode"
  ];
  const toggleModules = checkboxBindings
    .map(([, path]) => path[path.length - 1])
    .filter((key) => Boolean(profile.controllers[key]));

  return fixedModules.length + toggleModules.length;
}

function controllerSummaryRows() {
  const rows = [
    ["Install", activeInstallUrl()],
    ["Vehicle", `${profile.vehicleYear} ${profile.vehicleModel}`],
    ["Steering", `${labelFor("lateralMode", profile.controllers.lateralMode)}, ${labelFor("laneCenterMode", profile.controllers.laneCenterMode)}`],
    ["Cruise", `${labelFor("longitudinalMode", profile.controllers.longitudinalMode)}, ${Number(profile.tuning.followGap).toFixed(1)}s gap`],
    ["Models", `${labelFor("modelStackMode", profile.controllers.modelStackMode)}, gate ${profile.tuning.modelConfidenceGate}%`],
    ["Safety", `${computeSafetyScore()} / 100 ${controllerLabel()}`]
  ];

  return rows
    .map(([label, value]) => `
      <div class="summary-row">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join("");
}

function labelFor(group, value) {
  const labels = {
    longitudinalMode: {
      stock: "Stock openpilot",
      smooth: "Smooth follow",
      "traffic-review": "Traffic review"
    },
    lateralMode: {
      standard: "Standard sunnypilot",
      torque: "Torque preference",
      "nnlc-review": "NNLC review"
    },
    laneCenterMode: {
      center: "Centered",
      "curve-cautious": "Curve cautious",
      "road-edge-cautious": "Road-edge cautious"
    },
    roadEdgeMode: {
      warn: "Warn",
      conservative: "Conservative",
      off: "Off"
    },
    promptMode: {
      standard: "Standard",
      early: "Early prompts",
      quiet: "Quiet review"
    },
    logMode: {
      summary: "Summary",
      detailed: "Detailed",
      minimal: "Minimal"
    },
    modelStackMode: {
      "sunnypilot-dev": "sunnypilot dev",
      "openpilot-compare": "openpilot compare",
      "xrm10-review": "XRM10 review"
    }
  };

  return labels[group]?.[value] || value;
}

function exportProfile() {
  return {
    ...profile,
    computed: {
      safetyScore: computeSafetyScore(),
      installUrl: activeInstallUrl(),
      controllerState: controllerLabel(),
      activeControllerModules: activeControllerCount(),
      generatedAt: new Date().toISOString()
    }
  };
}

function downloadProfile() {
  const blob = new Blob([JSON.stringify(exportProfile(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug(profile.profileName)}-xrm10-profile.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Profile downloaded");
}

function importProfile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      profile = normalizeProfile(JSON.parse(String(reader.result)));
      enforceGuardrails();
      writeForm();
      saveProfile();
      showToast("Profile imported");
    } catch {
      showToast("Import failed: invalid JSON");
    }
  });
  reader.readAsText(file);
}

async function copyText(text, message) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  showToast(message);
}

function showToast(message) {
  if (!els.toast) return;
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function setSection(section) {
  const nextSection = sectionMeta[section] ? section : "device";
  profile.activeSection = nextSection;
  saveProfile();
  renderSection(nextSection);
}

function renderSection(section) {
  const nextSection = sectionMeta[section] ? section : "device";
  const [eyebrow, title] = sectionMeta[nextSection];
  document.querySelectorAll("[data-section]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.section === nextSection);
  });
  document.querySelectorAll("[data-section-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sectionTarget === nextSection);
  });
  setText(els.sectionEyebrow, eyebrow);
  setText(els.sectionTitle, title);
}

function wireFormEvents() {
  const ids = [
    ...textBindings.map(([id]) => id),
    ...selectBindings.map(([id]) => id),
    ...rangeBindings.map(({ id }) => id)
  ];

  for (const id of ids) {
    const input = byId(id);
    if (!input) continue;
    input.addEventListener("input", handleInput);
    input.addEventListener("change", handleInput);
  }

  for (const [id] of checkboxBindings) {
    const input = byId(id);
    if (input) input.addEventListener("change", handleInput);
  }
}

function wireActions() {
  document.querySelectorAll("[data-section-target]").forEach((button) => {
    button.addEventListener("click", () => setSection(button.dataset.sectionTarget));
  });

  els.targetList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-target]");
    if (!button) return;
    profile.installTarget = button.dataset.target;
    profile.customInstallUrl = "";
    saveProfile();
    writeForm();
    showToast("Install target selected");
  });

  els.resetProfile?.addEventListener("click", () => {
    profile = clone(defaultProfile);
    saveProfile();
    writeForm();
    showToast("Profile reset");
  });

  els.copyInstallUrl?.addEventListener("click", () => {
    copyText(activeInstallUrl(), "Installer URL copied");
  });

  els.downloadProfile?.addEventListener("click", downloadProfile);
  els.downloadProfileSecondary?.addEventListener("click", downloadProfile);
  els.importButton?.addEventListener("click", () => els.importInput?.click());
  els.importButtonSecondary?.addEventListener("click", () => els.importInput?.click());
  els.importInput?.addEventListener("change", (event) => {
    importProfile(event.target.files[0]);
    event.target.value = "";
  });
}

function handleInput() {
  readForm();
  writeForm();
}

function byId(id) {
  return document.getElementById(id);
}

function getPath(source, path) {
  return path.reduce((value, key) => value?.[key], source);
}

function setPath(target, path, value) {
  let cursor = target;
  for (const key of path.slice(0, -1)) {
    cursor[key] ||= {};
    cursor = cursor[key];
  }
  cursor[path[path.length - 1]] = value;
}

function setText(element, value) {
  if (element) element.textContent = value;
}

function setBadge(element, label, className) {
  if (!element) return;
  element.textContent = label;
  element.className = `status-badge ${className}`;
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "xrm10";
}

function signed(value) {
  const number = Number(value);
  return number > 0 ? `+${number}` : String(number);
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

renderLocks();
wireFormEvents();
wireActions();
enforceGuardrails();
writeForm();
window.addEventListener("load", () => {
  if (window.lucide) window.lucide.createIcons();
});
