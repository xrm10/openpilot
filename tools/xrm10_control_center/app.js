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
  home: ["XRM10", "Home"],
  device: ["Device settings", "Device"],
  toggles: ["Device settings", "Toggles"],
  models: ["Device settings", "Models"],
  steering: ["Device settings", "Steering"],
  cruise: ["Device settings", "Cruise"],
  visuals: ["Device settings", "Visuals"],
  display: ["Device settings", "Display"],
  maps: ["Device settings", "Maps"],
  navPilot: ["Device settings", "Nav Pilot"],
  vehicle: ["Device settings", "Vehicle"],
  software: ["Device settings", "Software"],
  safetyLab: ["Device settings", "Safety Lab"],
  developer: ["Device settings", "Developer"],
  migration: ["Device settings", "Migration Wizard"]
};

const defaultProfile = {
  schemaVersion: 6,
  activeSection: "home",
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
    navMode: "off",
    routeIntentMode: "prompt",
    maneuverType: "highway-exit",
    navMapSourceMode: "mapbox-review",
    cameraFusionMode: "map-camera-agree",
    navSteeringMode: "advisory",
    roundaboutPolicy: "yield-and-prompt",
    uTurnPolicy: "closed-course-only",
    exitLanePolicy: "early-confirm",
    driverConfirmMode: "required",
    navRequireSignal: true,
    navRequireDriverNudge: true,
    navBlindSpotBlock: true,
    navMapCameraAgree: true,
    navNoAutoUturnRoad: true,
    navRecordManeuver: true,
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
    labMode: "disabled",
    testStage: "design",
    safetyEnvelope: "conservative",
    driverMonitoringMode: "strict",
    manualOverrideMode: "instant",
    actuationSafetyMode: "strict",
    pandaSafetyReviewMode: "readonly",
    faultInjectionMode: "none",
    scenarioSet: "lane-assist",
    labResultGate: "block-on-warn",
    labOffroadOnlyAck: false,
    labNoLiveApplyAck: false,
    testDriverReady: false,
    closedCourseAck: false,
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
    routePreviewDistance: 1.5,
    labMaxSpeed: 35,
    labSteerTorqueCap: 60,
    labSteerRateCap: 65,
    labAccelCap: 45,
    labBrakeCap: 55,
    labFollowGapMin: 2.5,
    labTakeoverTime: 1,
    labAlertEscalationTime: 2,
    labDisengageLatency: 0.3,
    labModelConfidenceMin: 70,
    navMapConfidence: 80,
    navCameraConfidence: 82,
    navLaneConfidence: 78,
    navManeuverSpeed: 35,
    navExitDistance: 0.8,
    navRoundaboutYieldGap: 4,
    navSteerAuthority: 45,
    navDriverConfirmTime: 5
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
  ["navMode", ["controllers", "navMode"]],
  ["routeIntentMode", ["controllers", "routeIntentMode"]],
  ["maneuverType", ["controllers", "maneuverType"]],
  ["navMapSourceMode", ["controllers", "navMapSourceMode"]],
  ["cameraFusionMode", ["controllers", "cameraFusionMode"]],
  ["navSteeringMode", ["controllers", "navSteeringMode"]],
  ["roundaboutPolicy", ["controllers", "roundaboutPolicy"]],
  ["uTurnPolicy", ["controllers", "uTurnPolicy"]],
  ["exitLanePolicy", ["controllers", "exitLanePolicy"]],
  ["driverConfirmMode", ["controllers", "driverConfirmMode"]],
  ["tireSizePreset", ["controllers", "tireSizePreset"]],
  ["vehicleHarnessMode", ["controllers", "vehicleHarnessMode"]],
  ["regionProfile", ["controllers", "regionProfile"]],
  ["powertrainProfile", ["controllers", "powertrainProfile"]],
  ["testRouteMode", ["controllers", "testRouteMode"]],
  ["parameterPreviewMode", ["controllers", "parameterPreviewMode"]],
  ["labMode", ["controllers", "labMode"]],
  ["testStage", ["controllers", "testStage"]],
  ["safetyEnvelope", ["controllers", "safetyEnvelope"]],
  ["driverMonitoringMode", ["controllers", "driverMonitoringMode"]],
  ["manualOverrideMode", ["controllers", "manualOverrideMode"]],
  ["actuationSafetyMode", ["controllers", "actuationSafetyMode"]],
  ["pandaSafetyReviewMode", ["controllers", "pandaSafetyReviewMode"]],
  ["faultInjectionMode", ["controllers", "faultInjectionMode"]],
  ["scenarioSet", ["controllers", "scenarioSet"]],
  ["labResultGate", ["controllers", "labResultGate"]],
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
  ["navRequireSignal", ["controllers", "navRequireSignal"]],
  ["navRequireDriverNudge", ["controllers", "navRequireDriverNudge"]],
  ["navBlindSpotBlock", ["controllers", "navBlindSpotBlock"]],
  ["navMapCameraAgree", ["controllers", "navMapCameraAgree"]],
  ["navNoAutoUturnRoad", ["controllers", "navNoAutoUturnRoad"]],
  ["navRecordManeuver", ["controllers", "navRecordManeuver"]],
  ["radarInteropReview", ["controllers", "radarInteropReview"]],
  ["developerMode", ["controllers", "developerMode"]],
  ["replayReview", ["controllers", "replayReview"]],
  ["eventSnapshot", ["controllers", "eventSnapshot"]],
  ["cabanaExport", ["controllers", "cabanaExport"]],
  ["labOffroadOnlyAck", ["controllers", "labOffroadOnlyAck"]],
  ["labNoLiveApplyAck", ["controllers", "labNoLiveApplyAck"]],
  ["testDriverReady", ["controllers", "testDriverReady"]],
  ["closedCourseAck", ["controllers", "closedCourseAck"]]
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
  { id: "routePreviewDistance", path: ["tuning", "routePreviewDistance"], min: 0.5, max: 5, valueId: "routePreviewDistanceValue", format: (v) => `${Number(v).toFixed(1)} mi` },
  { id: "labMaxSpeed", path: ["tuning", "labMaxSpeed"], min: 5, max: 65, valueId: "labMaxSpeedValue", format: (v) => `${v} mph` },
  { id: "labSteerTorqueCap", path: ["tuning", "labSteerTorqueCap"], min: 20, max: 100, valueId: "labSteerTorqueCapValue", format: (v) => `${v}%` },
  { id: "labSteerRateCap", path: ["tuning", "labSteerRateCap"], min: 20, max: 100, valueId: "labSteerRateCapValue", format: (v) => `${v}%` },
  { id: "labAccelCap", path: ["tuning", "labAccelCap"], min: 10, max: 80, valueId: "labAccelCapValue", format: (v) => `${v}%` },
  { id: "labBrakeCap", path: ["tuning", "labBrakeCap"], min: 10, max: 90, valueId: "labBrakeCapValue", format: (v) => `${v}%` },
  { id: "labFollowGapMin", path: ["tuning", "labFollowGapMin"], min: 2, max: 4, valueId: "labFollowGapMinValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "labTakeoverTime", path: ["tuning", "labTakeoverTime"], min: 0.3, max: 2.5, valueId: "labTakeoverTimeValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "labAlertEscalationTime", path: ["tuning", "labAlertEscalationTime"], min: 0.5, max: 5, valueId: "labAlertEscalationTimeValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "labDisengageLatency", path: ["tuning", "labDisengageLatency"], min: 0.1, max: 1, valueId: "labDisengageLatencyValue", format: (v) => `${Number(v).toFixed(2)}s` },
  { id: "labModelConfidenceMin", path: ["tuning", "labModelConfidenceMin"], min: 50, max: 95, valueId: "labModelConfidenceMinValue", format: (v) => `${v}%` },
  { id: "navMapConfidence", path: ["tuning", "navMapConfidence"], min: 40, max: 100, valueId: "navMapConfidenceValue", format: (v) => `${v}%` },
  { id: "navCameraConfidence", path: ["tuning", "navCameraConfidence"], min: 40, max: 100, valueId: "navCameraConfidenceValue", format: (v) => `${v}%` },
  { id: "navLaneConfidence", path: ["tuning", "navLaneConfidence"], min: 40, max: 100, valueId: "navLaneConfidenceValue", format: (v) => `${v}%` },
  { id: "navManeuverSpeed", path: ["tuning", "navManeuverSpeed"], min: 5, max: 75, valueId: "navManeuverSpeedValue", format: (v) => `${v} mph` },
  { id: "navExitDistance", path: ["tuning", "navExitDistance"], min: 0.1, max: 2.5, valueId: "navExitDistanceValue", format: (v) => `${Number(v).toFixed(1)} mi` },
  { id: "navRoundaboutYieldGap", path: ["tuning", "navRoundaboutYieldGap"], min: 2, max: 8, valueId: "navRoundaboutYieldGapValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "navSteerAuthority", path: ["tuning", "navSteerAuthority"], min: 0, max: 75, valueId: "navSteerAuthorityValue", format: (v) => `${v}%` },
  { id: "navDriverConfirmTime", path: ["tuning", "navDriverConfirmTime"], min: 2, max: 12, valueId: "navDriverConfirmTimeValue", format: (v) => `${Number(v).toFixed(1)}s` }
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
  labResultBadge: document.querySelector("#labResultBadge"),
  labScore: document.querySelector("#labScore"),
  labScoreMeter: document.querySelector("#labScoreMeter"),
  labResults: document.querySelector("#labResults"),
  navResultBadge: document.querySelector("#navResultBadge"),
  navScore: document.querySelector("#navScore"),
  navScoreMeter: document.querySelector("#navScoreMeter"),
  navResults: document.querySelector("#navResults"),
  settingsSearch: document.querySelector("#settingsSearch"),
  homeDeviceName: document.querySelector("#homeDeviceName"),
  homeVersion: document.querySelector("#homeVersion"),
  homeBranch: document.querySelector("#homeBranch"),
  homeCommit: document.querySelector("#homeCommit"),
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
  runSafetyLab: document.querySelector("#runSafetyLab"),
  exportSafetyPlan: document.querySelector("#exportSafetyPlan"),
  runNavPilot: document.querySelector("#runNavPilot"),
  exportNavPlan: document.querySelector("#exportNavPlan"),
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
  if (c.navMode === "closed-course") score -= 5;
  if (c.routeIntentMode === "lab-auto-plan") score -= 8;
  if (c.navSteeringMode === "closed-course-plan") score -= 8;
  if (c.maneuverType === "u-turn" || c.maneuverType === "roundabout") score -= 6;
  if (c.labMode === "closed-course") score -= 4;
  if (c.safetyEnvelope === "expanded-review") score -= 8;
  if (c.driverMonitoringMode === "lab-relaxed") score -= 12;
  if (c.manualOverrideMode === "measured-review") score -= 6;
  if (c.actuationSafetyMode === "expanded-review") score -= 10;
  if (c.faultInjectionMode !== "none") score -= 4;
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
  if (Number(t.labMaxSpeed) > 45 && c.labMode !== "disabled") score -= 6;
  if (Number(t.labDisengageLatency) > 0.5 && c.labMode !== "disabled") score -= 8;
  if (Number(t.navSteerAuthority) > 55 && c.navMode !== "off") score -= 8;
  if (Number(t.navManeuverSpeed) > 45 && c.navMode !== "off") score -= 6;
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
  setText(els.homeDeviceName, profile.deviceTarget);
  setText(els.homeVersion, "2026.07.02-xrm10");
  setText(els.homeBranch, "dev");
  setText(els.homeCommit, "344ec6a");
  setText(els.activeBranchLabel, branchLabel);
  setText(els.activeBranchMeta, activeInstallUrl());
  if (els.branchStatusDot) els.branchStatusDot.style.background = score >= 92 ? "var(--green)" : score >= 75 ? "var(--yellow)" : "var(--red)";
  setText(els.previewTitle, previewTitle());
  setText(els.previewText, previewText());
  if (els.controllerSummary) els.controllerSummary.innerHTML = controllerSummaryRows();
  renderSafetyLab();
  renderNavPilot();
  if (els.jsonPreview) els.jsonPreview.textContent = JSON.stringify(exportProfile(), null, 2);
  renderTargets();
  renderSection(profile.activeSection);
  filterHomeTiles();

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

function computeLabReadiness() {
  const c = profile.controllers;
  const t = profile.tuning;
  const checks = [];
  let score = 100;

  addLabCheck(checks, c.labMode !== "disabled", "Lab mode enabled", "Choose simulation, bench, or closed-course mode.", 25);
  addLabCheck(checks, c.labOffroadOnlyAck, "Offroad/simulation acknowledgement", "Confirm this is not a live-car safety bypass.", 20);
  addLabCheck(checks, c.labNoLiveApplyAck, "Live apply blocked", "Confirm lab settings will not be applied live.", 20);
  addLabCheck(checks, c.testDriverReady, "Takeover readiness", "Driver readiness must be confirmed before any physical test.", 15);
  addLabCheck(checks, c.closedCourseAck || ["design", "replay", "bench"].includes(c.testStage), "Controlled test environment", "Closed-course acknowledgement is required beyond bench testing.", 15);
  addLabCheck(checks, c.driverMonitoringMode !== "lab-relaxed" || c.testStage !== "road-review", "Driver monitoring gate", "Relaxed driver monitoring cannot move to road review.", 20);
  addLabCheck(checks, c.manualOverrideMode !== "measured-review" || Number(t.labTakeoverTime) <= 1.2, "Manual override target", "Measured override review requires takeover target at or below 1.2s.", 12);
  addLabCheck(checks, c.actuationSafetyMode !== "expanded-review" || Number(t.labMaxSpeed) <= 35, "Expanded cap speed gate", "Expanded actuation caps require speed cap at or below 35 mph.", 12);
  addLabCheck(checks, Number(t.labDisengageLatency) <= 0.5, "Disengage latency", "Disengage latency must stay at or below 0.50s.", 10);
  addLabCheck(checks, Number(t.labFollowGapMin) >= 2.2, "Follow gap floor", "Minimum follow gap should stay at or above 2.2s.", 8);
  addLabCheck(checks, Number(t.labModelConfidenceMin) >= 60, "Model confidence floor", "Model confidence gate should stay at or above 60%.", 8);

  for (const check of checks) {
    if (!check.pass) score -= check.penalty;
  }

  score = Math.max(0, Math.min(100, score));
  const blocked = checks.some((check) => !check.pass && check.penalty >= 15);
  const state = blocked || score < 70 ? "Blocked" : score < 90 ? "Review" : "Pass";

  return { score, state, checks };
}

function addLabCheck(checks, pass, label, detail, penalty) {
  checks.push({ pass, label, detail, penalty });
}

function renderSafetyLab() {
  const result = computeLabReadiness();
  const stateClass = result.state === "Pass" ? "pass" : result.state === "Review" ? "warn" : "stop";

  setText(els.labScore, String(result.score));
  if (els.labScoreMeter) els.labScoreMeter.style.width = `${result.score}%`;
  setBadge(els.labResultBadge, result.state, stateClass);
  if (!els.labResults) return;

  els.labResults.innerHTML = result.checks
    .map((check) => `
      <div class="lab-check ${check.pass ? "pass" : "fail"}">
        <strong>${check.pass ? "PASS" : "CHECK"} - ${check.label}</strong>
        <span>${check.detail}</span>
      </div>
    `)
    .join("");
}

function computeNavReadiness() {
  const c = profile.controllers;
  const t = profile.tuning;
  const checks = [];
  let score = 100;

  addLabCheck(checks, c.navMode !== "off", "Navigation lab enabled", "Choose advisory, simulation, or closed-course review.", 20);
  addLabCheck(checks, Number(t.navMapConfidence) >= 75, "Map confidence", "Map confidence should be at least 75%.", 12);
  addLabCheck(checks, Number(t.navCameraConfidence) >= 75, "Camera confidence", "Camera confidence should be at least 75%.", 12);
  addLabCheck(checks, Number(t.navLaneConfidence) >= 70, "Lane confidence", "Lane confidence should be at least 70%.", 10);
  addLabCheck(checks, !c.navMapCameraAgree || Math.abs(Number(t.navMapConfidence) - Number(t.navCameraConfidence)) <= 20, "Map-camera agreement", "Map and camera confidence disagree too much.", 12);
  addLabCheck(checks, c.driverConfirmMode !== "required" || Number(t.navDriverConfirmTime) >= 3, "Driver confirm window", "Driver confirmation window should be at least 3.0s.", 8);
  addLabCheck(checks, c.navRequireDriverNudge || c.navSteeringMode === "advisory", "Driver nudge gate", "Steering plans require driver nudge outside advisory mode.", 18);
  addLabCheck(checks, c.navRequireSignal || !["highway-exit", "highway-merge", "lane-route"].includes(c.maneuverType), "Signal gate", "Lane-route maneuvers require turn signal gate.", 12);
  addLabCheck(checks, c.navBlindSpotBlock, "Blind spot block", "Blind spot block must stay enabled.", 18);
  addLabCheck(checks, c.maneuverType !== "u-turn" || c.uTurnPolicy !== "block", "U-turn policy", "U-turn is currently blocked by policy.", 20);
  addLabCheck(checks, c.maneuverType !== "u-turn" || c.navNoAutoUturnRoad, "U-turn road gate", "U-turn must stay blocked outside closed-course review.", 18);
  addLabCheck(checks, c.maneuverType !== "roundabout" || Number(t.navRoundaboutYieldGap) >= 3.5, "Roundabout yield gap", "Roundabout yield gap should be at least 3.5s.", 14);
  addLabCheck(checks, c.maneuverType !== "highway-exit" || Number(t.navExitDistance) >= 0.4, "Exit prep distance", "Exit preparation should start at least 0.4 mi before the exit.", 10);
  addLabCheck(checks, Number(t.navManeuverSpeed) <= 55 || c.navMode === "advisory", "Maneuver speed", "Non-advisory maneuver review should stay at or below 55 mph.", 12);
  addLabCheck(checks, Number(t.navSteerAuthority) <= 55 || c.navSteeringMode === "advisory", "Steering authority", "Non-advisory steering authority should stay at or below 55%.", 14);

  for (const check of checks) {
    if (!check.pass) score -= check.penalty;
  }

  score = Math.max(0, Math.min(100, score));
  const blocked = checks.some((check) => !check.pass && check.penalty >= 18);
  const state = blocked || score < 70 ? "Blocked" : score < 90 ? "Review" : "Pass";

  return { score, state, checks };
}

function renderNavPilot() {
  const result = computeNavReadiness();
  const stateClass = result.state === "Pass" ? "pass" : result.state === "Review" ? "warn" : "stop";

  setText(els.navScore, String(result.score));
  if (els.navScoreMeter) els.navScoreMeter.style.width = `${result.score}%`;
  setBadge(els.navResultBadge, result.state, stateClass);
  if (!els.navResults) return;

  els.navResults.innerHTML = result.checks
    .map((check) => `
      <div class="lab-check ${check.pass ? "pass" : "fail"}">
        <strong>${check.pass ? "PASS" : "CHECK"} - ${check.label}</strong>
        <span>${check.detail}</span>
      </div>
    `)
    .join("");
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
    "navMode",
    "routeIntentMode",
    "maneuverType",
    "navMapSourceMode",
    "cameraFusionMode",
    "navSteeringMode",
    "roundaboutPolicy",
    "uTurnPolicy",
    "exitLanePolicy",
    "driverConfirmMode",
    "vehicleHarnessMode",
    "parameterPreviewMode",
    "labMode",
    "testStage",
    "safetyEnvelope",
    "driverMonitoringMode",
    "manualOverrideMode",
    "actuationSafetyMode",
    "pandaSafetyReviewMode",
    "faultInjectionMode",
    "scenarioSet",
    "labResultGate"
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
  const labReadiness = computeLabReadiness();
  const navReadiness = computeNavReadiness();
  return {
    ...profile,
    computed: {
      safetyScore: computeSafetyScore(),
      installUrl: activeInstallUrl(),
      controllerState: controllerLabel(),
      activeControllerModules: activeControllerCount(),
      safetyLabReadiness: {
        score: labReadiness.score,
        state: labReadiness.state
      },
      navPilotReadiness: {
        score: navReadiness.score,
        state: navReadiness.state
      },
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

function buildSafetyPlan() {
  const labReadiness = computeLabReadiness();
  return {
    planVersion: 1,
    generatedAt: new Date().toISOString(),
    vehicle: {
      profileName: profile.profileName,
      model: profile.vehicleModel,
      year: profile.vehicleYear,
      device: profile.deviceTarget
    },
    installUrl: activeInstallUrl(),
    liveSafetyBoundary: {
      driverMonitoringRequired: true,
      excessiveActuationChecksLocked: true,
      pandaSafetyReadOnly: true,
      manualOverrideRequired: true,
      liveVehicleParamWritesAllowed: false,
      phoneSafetyLimitEditingAllowed: false
    },
    labControls: {
      mode: profile.controllers.labMode,
      stage: profile.controllers.testStage,
      safetyEnvelope: profile.controllers.safetyEnvelope,
      driverMonitoringMode: profile.controllers.driverMonitoringMode,
      manualOverrideMode: profile.controllers.manualOverrideMode,
      actuationSafetyMode: profile.controllers.actuationSafetyMode,
      pandaSafetyReviewMode: profile.controllers.pandaSafetyReviewMode,
      faultInjectionMode: profile.controllers.faultInjectionMode,
      scenarioSet: profile.controllers.scenarioSet,
      resultGate: profile.controllers.labResultGate,
      speedCapMph: profile.tuning.labMaxSpeed,
      steerTorqueCapPercent: profile.tuning.labSteerTorqueCap,
      steerRateCapPercent: profile.tuning.labSteerRateCap,
      accelCapPercent: profile.tuning.labAccelCap,
      brakeCapPercent: profile.tuning.labBrakeCap,
      minimumFollowGapSeconds: profile.tuning.labFollowGapMin,
      takeoverTargetSeconds: profile.tuning.labTakeoverTime,
      alertEscalationSeconds: profile.tuning.labAlertEscalationTime,
      disengageLatencyMaxSeconds: profile.tuning.labDisengageLatency,
      modelConfidenceMinPercent: profile.tuning.labModelConfidenceMin
    },
    readiness: labReadiness,
    manual: [
      "Design review: choose conservative lab defaults, keep live safety policy locked, and export this JSON plan.",
      "Replay logs: run the scenario set against saved routes or synthetic logs. Any warning blocks progression.",
      "Bench/offroad: verify alerts, manual override, disengage latency, driver monitoring, and actuator caps without public-road risk.",
      "Closed-course: use a driver, spotter, low speed cap, and an empty controlled area. Brake/cancel/steering takeover must pass every time.",
      "Road review gate: only after all previous stages pass and the exported plan is reviewed. Do not weaken panda safety, driver monitoring, or override behavior."
    ],
    profile: exportProfile()
  };
}

function downloadSafetyPlan() {
  const blob = new Blob([JSON.stringify(buildSafetyPlan(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug(profile.profileName)}-safety-lab-plan.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Safety test plan downloaded");
}

function buildNavPlan() {
  const navReadiness = computeNavReadiness();
  return {
    planVersion: 1,
    generatedAt: new Date().toISOString(),
    vehicle: {
      profileName: profile.profileName,
      model: profile.vehicleModel,
      year: profile.vehicleYear,
      device: profile.deviceTarget
    },
    liveAutomationBoundary: {
      automatedDrivingEnabledByThisApp: false,
      driverConfirmationRequired: true,
      manualOverrideRequired: true,
      blindSpotBlockRequired: true,
      lowConfidenceBlocksManeuver: true
    },
    navControls: {
      mode: profile.controllers.navMode,
      routeIntentMode: profile.controllers.routeIntentMode,
      maneuverType: profile.controllers.maneuverType,
      mapSource: profile.controllers.navMapSourceMode,
      cameraFusionMode: profile.controllers.cameraFusionMode,
      steeringMode: profile.controllers.navSteeringMode,
      roundaboutPolicy: profile.controllers.roundaboutPolicy,
      uTurnPolicy: profile.controllers.uTurnPolicy,
      exitLanePolicy: profile.controllers.exitLanePolicy,
      driverConfirmMode: profile.controllers.driverConfirmMode,
      requireSignal: profile.controllers.navRequireSignal,
      requireDriverNudge: profile.controllers.navRequireDriverNudge,
      blindSpotBlock: profile.controllers.navBlindSpotBlock,
      requireMapCameraAgreement: profile.controllers.navMapCameraAgree,
      blockRoadUturn: profile.controllers.navNoAutoUturnRoad,
      recordManeuver: profile.controllers.navRecordManeuver,
      mapConfidencePercent: profile.tuning.navMapConfidence,
      cameraConfidencePercent: profile.tuning.navCameraConfidence,
      laneConfidencePercent: profile.tuning.navLaneConfidence,
      maneuverSpeedMph: profile.tuning.navManeuverSpeed,
      exitPrepDistanceMiles: profile.tuning.navExitDistance,
      roundaboutYieldGapSeconds: profile.tuning.navRoundaboutYieldGap,
      steeringAuthorityPercent: profile.tuning.navSteerAuthority,
      driverConfirmTimeoutSeconds: profile.tuning.navDriverConfirmTime
    },
    readiness: navReadiness,
    manual: [
      "Map intent: route instruction must be stable before the car approaches the maneuver.",
      "Camera agreement: lane lines, road edge, signs, arrows, and drivable path must agree with the route.",
      "Driver confirmation: lane route actions require signal, nudge, or explicit confirmation.",
      "Special maneuvers: U-turns and roundabouts stay closed-course or prompt-only until separately validated.",
      "Fallback: any blind spot, low confidence, missing lane, or unclear yield condition blocks the maneuver and asks the driver to take over."
    ]
  };
}

function downloadNavPlan() {
  const blob = new Blob([JSON.stringify(buildNavPlan(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug(profile.profileName)}-nav-pilot-plan.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Nav plan downloaded");
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
  document.body.dataset.activeSection = nextSection;
  document.querySelectorAll("[data-section]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.section === nextSection);
  });
  document.querySelectorAll("[data-section-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sectionTarget === nextSection);
  });
  setText(els.sectionEyebrow, eyebrow);
  setText(els.sectionTitle, title);
}

function filterHomeTiles() {
  if (!els.settingsSearch) return;
  const query = els.settingsSearch.value.trim().toLowerCase();
  document.querySelectorAll(".home-tile").forEach((tile) => {
    const text = `${tile.textContent} ${tile.dataset.search || ""}`.toLowerCase();
    tile.hidden = query !== "" && !text.includes(query);
  });
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

  els.settingsSearch?.addEventListener("input", filterHomeTiles);
  els.settingsSearch?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const firstVisibleTile = [...document.querySelectorAll(".home-tile")].find((tile) => !tile.hidden);
    if (firstVisibleTile) setSection(firstVisibleTile.dataset.sectionTarget);
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

  els.runSafetyLab?.addEventListener("click", () => {
    readForm();
    renderSafetyLab();
    const result = computeLabReadiness();
    showToast(`Safety Lab ${result.state}: ${result.score}/100`);
  });

  els.exportSafetyPlan?.addEventListener("click", downloadSafetyPlan);
  els.runNavPilot?.addEventListener("click", () => {
    readForm();
    renderNavPilot();
    const result = computeNavReadiness();
    showToast(`Nav Pilot ${result.state}: ${result.score}/100`);
  });

  els.exportNavPlan?.addEventListener("click", downloadNavPlan);
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
