const STORAGE_KEY = "xrm10-control-center-profile-v1";
const SYNC_STATE_KEY = "xrm10-control-center-sync-v1";
const SECTION_STATE_KEY = "xrm10-control-center-section-state-v1";

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
  traffic: ["Device settings", "Traffic"],
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
  schemaVersion: 8,
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
    trafficPlannerMode: "advisory",
    fasterLaneMode: "suggest",
    trafficManeuverMode: "driver-confirmed",
    lwcMode: "comfort",
    lwcLaneWidthMode: "camera-estimate",
    lwcRoadEdgeMode: "guarded",
    trafficLightReview: false,
    fasterLaneSuggestions: true,
    trafficAutoManeuverBlock: true,
    trafficRequireConfirmation: true,
    trafficRequireSignal: true,
    trafficBlindSpotBlock: true,
    trafficRecordReview: true,
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
    mapRouteSourceMode: "car-screen",
    carScreenRouteMode: "detect-destination",
    carScreenDestination: "",
    carScreenRouteSync: true,
    carScreenRouteNavPilot: true,
    carScreenRouteRequireConfirm: true,
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
    navDriverConfirmTime: 5,
    fasterLaneSpeedDelta: 7,
    trafficGapMin: 3.5,
    trafficLookaheadDistance: 0.6,
    lwcLaneWidth: 3.7,
    lwcLeftCushion: 0.45,
    lwcRightCushion: 0.45,
    lwcTrafficBuffer: 1.2
  },
  connection: {
    mode: "demo",
    bridgeUrl: "",
    bridgeToken: "",
    sshTarget: "",
    sshKeyPath: "",
    autoSync: true,
    syncOffroadOnly: true
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

const defaultSyncState = {
  status: "offline",
  lastSeenAt: Date.now() - 39 * 60 * 1000,
  lastSyncAt: null,
  lastError: "",
  sshStatus: "not checked",
  pending: [],
  device: {
    name: "comma four",
    id: "6dea66ada857421f",
    version: "2026.07.02-xrm10",
    branch: "dev",
    commit: "344ec6a",
    offroad: true
  },
  route: {
    active: false,
    source: "car-screen",
    provider: "car-screen-maps",
    status: "waiting",
    destination: "",
    routeId: "",
    nextInstruction: "Waiting for destination",
    confidence: 0,
    updatedAt: null
  }
};

const textBindings = [
  ["profileName", ["profileName"]],
  ["customInstallUrl", ["customInstallUrl"]],
  ["vinNickname", ["controllers", "vinNickname"]],
  ["carScreenDestination", ["controllers", "carScreenDestination"]],
  ["bridgeUrl", ["connection", "bridgeUrl"]],
  ["bridgeToken", ["connection", "bridgeToken"]],
  ["sshTarget", ["connection", "sshTarget"]],
  ["sshKeyPath", ["connection", "sshKeyPath"]]
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
  ["trafficPlannerMode", ["controllers", "trafficPlannerMode"]],
  ["fasterLaneMode", ["controllers", "fasterLaneMode"]],
  ["trafficManeuverMode", ["controllers", "trafficManeuverMode"]],
  ["lwcMode", ["controllers", "lwcMode"]],
  ["lwcLaneWidthMode", ["controllers", "lwcLaneWidthMode"]],
  ["lwcRoadEdgeMode", ["controllers", "lwcRoadEdgeMode"]],
  ["visualTheme", ["controllers", "visualTheme"]],
  ["alertDensity", ["controllers", "alertDensity"]],
  ["laneOverlay", ["controllers", "laneOverlay"]],
  ["eventBannerStyle", ["controllers", "eventBannerStyle"]],
  ["displayTheme", ["controllers", "displayTheme"]],
  ["keepAwakeMode", ["controllers", "keepAwakeMode"]],
  ["unitsMode", ["controllers", "unitsMode"]],
  ["mapMode", ["controllers", "mapMode"]],
  ["routeAssistMode", ["controllers", "routeAssistMode"]],
  ["mapRouteSourceMode", ["controllers", "mapRouteSourceMode"]],
  ["carScreenRouteMode", ["controllers", "carScreenRouteMode"]],
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
  ["backupSlot", ["controllers", "backupSlot"]],
  ["connectionMode", ["connection", "mode"]]
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
  ["fasterLaneSuggestions", ["controllers", "fasterLaneSuggestions"]],
  ["trafficAutoManeuverBlock", ["controllers", "trafficAutoManeuverBlock"]],
  ["trafficRequireConfirmation", ["controllers", "trafficRequireConfirmation"]],
  ["trafficRequireSignal", ["controllers", "trafficRequireSignal"]],
  ["trafficBlindSpotBlock", ["controllers", "trafficBlindSpotBlock"]],
  ["trafficRecordReview", ["controllers", "trafficRecordReview"]],
  ["roadEdgeOverlay", ["controllers", "roadEdgeOverlay"]],
  ["showDebugHud", ["controllers", "showDebugHud"]],
  ["largeText", ["controllers", "largeText"]],
  ["reduceMotion", ["controllers", "reduceMotion"]],
  ["offlineMaps", ["controllers", "offlineMaps"]],
  ["mapLaneGuidance", ["controllers", "mapLaneGuidance"]],
  ["carScreenRouteSync", ["controllers", "carScreenRouteSync"]],
  ["carScreenRouteNavPilot", ["controllers", "carScreenRouteNavPilot"]],
  ["carScreenRouteRequireConfirm", ["controllers", "carScreenRouteRequireConfirm"]],
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
  ["closedCourseAck", ["controllers", "closedCourseAck"]],
  ["autoSync", ["connection", "autoSync"]],
  ["syncOffroadOnly", ["connection", "syncOffroadOnly"]]
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
  { id: "navDriverConfirmTime", path: ["tuning", "navDriverConfirmTime"], min: 2, max: 12, valueId: "navDriverConfirmTimeValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "fasterLaneSpeedDelta", path: ["tuning", "fasterLaneSpeedDelta"], min: 3, max: 15, valueId: "fasterLaneSpeedDeltaValue", format: (v) => `${v} mph` },
  { id: "trafficGapMin", path: ["tuning", "trafficGapMin"], min: 2, max: 6, valueId: "trafficGapMinValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "trafficLookaheadDistance", path: ["tuning", "trafficLookaheadDistance"], min: 0.2, max: 1.5, valueId: "trafficLookaheadDistanceValue", format: (v) => `${Number(v).toFixed(1)} mi` },
  { id: "lwcLaneWidth", path: ["tuning", "lwcLaneWidth"], min: 3, max: 4.4, valueId: "lwcLaneWidthValue", format: (v) => `${Number(v).toFixed(1)} m` },
  { id: "lwcLeftCushion", path: ["tuning", "lwcLeftCushion"], min: 0.2, max: 1, valueId: "lwcLeftCushionValue", format: (v) => `${Number(v).toFixed(2)} m` },
  { id: "lwcRightCushion", path: ["tuning", "lwcRightCushion"], min: 0.2, max: 1, valueId: "lwcRightCushionValue", format: (v) => `${Number(v).toFixed(2)} m` },
  { id: "lwcTrafficBuffer", path: ["tuning", "lwcTrafficBuffer"], min: 0.6, max: 2.5, valueId: "lwcTrafficBufferValue", format: (v) => `${Number(v).toFixed(1)}s` }
];

let profile = loadProfile();
let syncState = loadSyncState();
let sectionState = loadSectionState();
let syncDebounceTimer = null;
let heartbeatTimer = null;

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
  homeDeviceId: document.querySelector("#homeDeviceId"),
  homeVersion: document.querySelector("#homeVersion"),
  homeBranch: document.querySelector("#homeBranch"),
  homeCommit: document.querySelector("#homeCommit"),
  homeStatusDot: document.querySelector("#homeStatusDot"),
  homeStatusTag: document.querySelector("#homeStatusTag"),
  homeConnectionPill: document.querySelector("#homeConnectionPill"),
  homePillStatus: document.querySelector("#homePillStatus"),
  homePendingChip: document.querySelector("#homePendingChip"),
  homeSyncNotice: document.querySelector("#homeSyncNotice"),
  homeSyncTitle: document.querySelector("#homeSyncTitle"),
  homeSyncText: document.querySelector("#homeSyncText"),
  homeRefreshSync: document.querySelector("#homeRefreshSync"),
  toolbarRefreshSync: document.querySelector("#toolbarRefreshSync"),
  activeBranchLabel: document.querySelector("#activeBranchLabel"),
  activeBranchMeta: document.querySelector("#activeBranchMeta"),
  branchStatusDot: document.querySelector("#branchStatusDot"),
  sidebarStatus: document.querySelector("#sidebarStatus"),
  liveStatusBadge: document.querySelector("#liveStatusBadge"),
  liveDeviceState: document.querySelector("#liveDeviceState"),
  liveRoadState: document.querySelector("#liveRoadState"),
  liveLastSeen: document.querySelector("#liveLastSeen"),
  livePendingCount: document.querySelector("#livePendingCount"),
  liveEndpointState: document.querySelector("#liveEndpointState"),
  liveSshState: document.querySelector("#liveSshState"),
  liveRouteState: document.querySelector("#liveRouteState"),
  liveQueueList: document.querySelector("#liveQueueList"),
  topConnectionState: document.querySelector("#topConnectionState"),
  topRoadState: document.querySelector("#topRoadState"),
  topLastSeen: document.querySelector("#topLastSeen"),
  topPendingCount: document.querySelector("#topPendingCount"),
  topRouteState: document.querySelector("#topRouteState"),
  setOffroad: document.querySelector("#setOffroad"),
  setOnroad: document.querySelector("#setOnroad"),
  syncNow: document.querySelector("#syncNow"),
  checkSsh: document.querySelector("#checkSsh"),
  requestOffroad: document.querySelector("#requestOffroad"),
  requestOnroad: document.querySelector("#requestOnroad"),
  demoOnlineToggle: document.querySelector("#demoOnlineToggle"),
  clearSyncQueue: document.querySelector("#clearSyncQueue"),
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
  carRouteStatus: document.querySelector("#carRouteStatus"),
  carRouteDestination: document.querySelector("#carRouteDestination"),
  carRouteSource: document.querySelector("#carRouteSource"),
  carRouteUpdated: document.querySelector("#carRouteUpdated"),
  carRouteNext: document.querySelector("#carRouteNext"),
  readCarRoute: document.querySelector("#readCarRoute"),
  setDemoCarRoute: document.querySelector("#setDemoCarRoute"),
  useCarRouteForNav: document.querySelector("#useCarRouteForNav"),
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

function loadSyncState() {
  try {
    const saved = window.localStorage.getItem(SYNC_STATE_KEY);
    return saved ? normalizeSyncState(JSON.parse(saved)) : clone(defaultSyncState);
  } catch {
    return clone(defaultSyncState);
  }
}

function loadSectionState() {
  try {
    const saved = window.localStorage.getItem(SECTION_STATE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
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
    connection: {
      ...next.connection,
      ...(input.connection || {}),
      mode: ["demo", "http", "offline"].includes(input.connection?.mode) ? input.connection.mode : next.connection.mode,
      autoSync: input.connection?.autoSync !== false,
      syncOffroadOnly: input.connection?.syncOffroadOnly !== false
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

function normalizeSyncState(input) {
  const next = clone(defaultSyncState);
  return {
    ...next,
    ...input,
    status: ["online", "offline", "syncing", "error"].includes(input.status) ? input.status : next.status,
    lastSeenAt: Number(input.lastSeenAt) || next.lastSeenAt,
    lastSyncAt: Number(input.lastSyncAt) || null,
    lastError: String(input.lastError || ""),
    sshStatus: String(input.sshStatus || next.sshStatus),
    pending: Array.isArray(input.pending) ? input.pending.slice(0, 60) : [],
    device: {
      ...next.device,
      ...(input.device || {})
    },
    route: normalizeRouteState(input.route || next.route)
  };
}

function normalizeRouteState(input = {}) {
  const next = clone(defaultSyncState.route);
  const destination = String(input.destination || "").trim();
  return {
    ...next,
    ...input,
    active: Boolean(input.active && destination),
    source: String(input.source || next.source),
    provider: String(input.provider || next.provider),
    status: String(input.status || (destination ? "active" : next.status)),
    destination,
    routeId: String(input.routeId || ""),
    nextInstruction: String(input.nextInstruction || (destination ? "Route loaded from car screen" : next.nextInstruction)),
    confidence: clamp(input.confidence ?? next.confidence, 0, 100),
    updatedAt: input.updatedAt || null
  };
}

function saveProfile() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function saveSyncState() {
  window.localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(syncState));
}

function saveSectionState() {
  window.localStorage.setItem(SECTION_STATE_KEY, JSON.stringify(sectionState));
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
  if (c.trafficPlannerMode !== "off") score -= 3;
  if (c.fasterLaneMode !== "off" && !c.trafficRequireConfirmation) score -= 16;
  if (c.fasterLaneMode === "driver-confirmed") score -= 4;
  if (!c.trafficAutoManeuverBlock) score -= 18;
  if (!c.trafficBlindSpotBlock) score -= 18;
  if (!c.trafficRequireSignal && c.fasterLaneMode !== "off") score -= 10;
  if (c.lwcMode === "review") score -= 4;
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
  if (Number(t.fasterLaneSpeedDelta) < 5 && c.fasterLaneMode !== "off") score -= 5;
  if (Number(t.trafficGapMin) < 3 && c.fasterLaneMode !== "off") score -= 10;
  if (Number(t.lwcTrafficBuffer) < 1 && c.lwcMode !== "off") score -= 6;
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
  profile.controllers.trafficAutoManeuverBlock = true;
  profile.controllers.trafficRequireConfirmation = true;
  profile.controllers.trafficBlindSpotBlock = true;
  profile.controllers.carScreenRouteRequireConfirm = true;
  profile.controllers.navBlindSpotBlock = true;
  profile.controllers.navMapCameraAgree = true;
  profile.controllers.navRequireDriverNudge = true;

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
  renderConnection();
  renderSafetyLab();
  renderNavPilot();
  if (els.jsonPreview) els.jsonPreview.textContent = JSON.stringify(exportProfile(), null, 2);
  renderTargets();
  renderSectionApplyBars();
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

function renderConnection() {
  const status = connectionStatus();
  const pendingCount = syncState.pending.length;
  const device = {
    ...defaultSyncState.device,
    ...syncState.device,
    name: syncState.device.name || profile.deviceTarget
  };
  const statusLabel = statusLabelFor(status);
  const lastSeen = formatLastSeen(syncState.lastSeenAt, status);
  const pendingLabel = `${pendingCount} ${pendingCount === 1 ? "change" : "changes"}`;
  const roadStateLabel = device.offroad === false ? "Inroad" : "Offroad";
  const route = normalizeRouteState(syncState.route);
  const routeLabel = route.active ? route.destination : "No route";

  setText(els.homeDeviceName, device.name);
  setText(els.homeDeviceId, device.id);
  setText(els.homeVersion, device.version);
  setText(els.homeBranch, device.branch);
  setText(els.homeCommit, String(device.commit || "").slice(0, 7));
  setText(els.homeStatusTag, statusLabel);
  setText(els.homePillStatus, statusLabel);
  setText(els.homePendingChip, pendingCount ? String(pendingCount) : "");
  setText(els.liveDeviceState, statusLabel);
  setText(els.liveRoadState, roadStateLabel);
  setText(els.liveLastSeen, lastSeen);
  setText(els.livePendingCount, pendingLabel);
  setText(els.liveEndpointState, endpointLabel());
  setText(els.liveSshState, syncState.sshStatus || "not checked");
  setText(els.liveRouteState, routeLabel);
  setText(els.topConnectionState, statusLabel);
  setText(els.topRoadState, roadStateLabel);
  setText(els.topLastSeen, lastSeen);
  setText(els.topPendingCount, String(pendingCount));
  setText(els.topRouteState, routeLabel);
  setText(els.demoOnlineToggle, profile.connection?.mode === "demo"
    ? status === "online" || status === "syncing" ? "Demo offline" : "Demo online"
    : "Use demo bridge");

  if (els.homeStatusDot) setStatusClass(els.homeStatusDot, "device-dot", status);
  if (els.homeStatusTag) setStatusClass(els.homeStatusTag, "offline-tag", status);
  if (els.homeConnectionPill) setStatusClass(els.homeConnectionPill, "offline-pill", status);
  if (els.homeSyncNotice) setStatusClass(els.homeSyncNotice, "offline-warning", status);
  els.setOffroad?.classList.toggle("active", device.offroad !== false);
  els.setOnroad?.classList.toggle("active", device.offroad === false);
  els.requestOffroad?.classList.toggle("active", device.offroad !== false);
  els.requestOnroad?.classList.toggle("active", device.offroad === false);
  setBadge(els.liveStatusBadge, statusLabel, status === "online" ? "pass" : status === "error" ? "stop" : "warn");

  if (status === "online") {
    setText(els.homeSyncTitle, `Device online - ${roadStateLabel.toLowerCase()}`);
    setText(els.homeSyncText, pendingCount
      ? `${pendingLabel} waiting. Press Sync now or keep auto sync enabled. Safety-critical changes stay marked for offroad review.`
      : `Live profile sync is ready. Road state is ${roadStateLabel.toLowerCase()}. New parameter changes send to the device bridge immediately when auto sync is enabled.`);
  } else if (status === "syncing") {
    setText(els.homeSyncTitle, "Syncing profile to device");
    setText(els.homeSyncText, "The app is sending the latest profile and queued parameter changes to the bridge.");
  } else if (status === "error") {
    setText(els.homeSyncTitle, `Bridge error - last seen ${lastSeen}`);
    setText(els.homeSyncText, syncState.lastError || "The app could not reach the device bridge. Changes are kept in the local queue.");
  } else {
    setText(els.homeSyncTitle, `Device offline - last seen ${lastSeen}`);
    setText(els.homeSyncText, pendingCount
      ? `${pendingLabel} saved locally. They will sync when the device bridge reports online.`
      : "Likely parked or bridge not connected. Settings you change here save to the profile and can sync when the device reconnects.");
  }

  if (els.liveQueueList) {
    els.liveQueueList.innerHTML = pendingCount
      ? syncState.pending
          .slice(-5)
          .reverse()
          .map((change) => `
            <div class="sync-row">
              <div>
                <strong>${escapeHtml(change.label)}</strong>
                <span>${escapeHtml(change.path)} - ${escapeHtml(change.summary)}</span>
              </div>
              <em>${change.safetyCritical ? "Review" : "Live"}</em>
            </div>
          `)
          .join("")
      : `<div class="queue-empty">No pending changes. Online edits will sync immediately.</div>`;
  }

  renderCarRoute();
}

function renderCarRoute() {
  const route = normalizeRouteState(syncState.route);
  const routeActive = Boolean(route.active);
  const destination = routeActive ? route.destination : "No car route";
  const statusLabel = routeActive ? "Route active" : route.status === "error" ? "Route error" : "Waiting";
  const statusClassName = routeActive ? "pass" : route.status === "error" ? "stop" : "warn";

  setBadge(els.carRouteStatus, statusLabel, statusClassName);
  setText(els.carRouteDestination, destination);
  setText(els.carRouteSource, sourceLabelForRoute(route.source));
  setText(els.carRouteUpdated, formatRouteUpdated(route.updatedAt));
  setText(els.carRouteNext, route.nextInstruction || "Waiting for destination");
  setText(els.liveRouteState, destination);
  setText(els.topRouteState, routeActive ? route.destination : "No route");

  if (els.useCarRouteForNav) {
    els.useCarRouteForNav.disabled = !routeActive && !profile.controllers.carScreenDestination;
  }
}

function sourceLabelForRoute(source) {
  return {
    "car-screen": "Car screen maps",
    "app-route": "Control center",
    "offline-cache": "Offline cache",
    "manual-demo": "Manual demo"
  }[source] || source || "Car screen maps";
}

function formatRouteUpdated(timestamp) {
  if (!timestamp) return "Never";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function setStatusClass(element, baseClass, status) {
  element.className = `${baseClass} ${connectionStatus(status)}`;
}

function connectionStatus(status = syncState.status) {
  return ["online", "offline", "syncing", "error"].includes(status) ? status : "offline";
}

function statusLabelFor(status = syncState.status) {
  return {
    online: "Online",
    offline: "Offline",
    syncing: "Syncing",
    error: "Error"
  }[connectionStatus(status)];
}

function endpointLabel() {
  const mode = profile.connection?.mode || "demo";
  if (mode === "http") return bridgeBaseUrl() || "HTTP bridge not set";
  if (mode === "offline") return "Manual offline";
  return "Demo bridge";
}

function bridgeBaseUrl() {
  const custom = profile.connection?.bridgeUrl?.trim().replace(/\/$/, "");
  if (custom) return custom;
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    return window.location.origin;
  }
  return "";
}

function formatLastSeen(timestamp, status = syncState.status) {
  if (status === "online" || status === "syncing") return "now";
  if (!timestamp) return "never";
  const seconds = Math.max(0, Math.floor((Date.now() - Number(timestamp)) / 1000));
  if (seconds < 45) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function markOnline(device = {}) {
  syncState.status = "online";
  syncState.lastSeenAt = Date.now();
  syncState.lastError = "";
  syncState.device = {
    ...syncState.device,
    ...device,
    name: device.name || device.deviceName || syncState.device.name || profile.deviceTarget,
    id: device.id || device.deviceId || syncState.device.id,
    version: device.version || syncState.device.version,
    branch: device.branch || syncState.device.branch,
    commit: device.commit || syncState.device.commit,
    offroad: device.offroad !== undefined ? Boolean(device.offroad) : syncState.device.offroad
  };
  saveSyncState();
  renderConnection();
}

function markOffline(message = "") {
  syncState.status = message ? "error" : "offline";
  syncState.lastError = message;
  saveSyncState();
  renderConnection();
}

async function refreshConnection(showMessage = true) {
  const mode = profile.connection?.mode || "demo";

  if (mode === "offline") {
    markOffline("");
    if (showMessage) showToast("Manual offline mode");
    return false;
  }

  if (mode === "demo") {
    if (connectionStatus() === "online") {
      markOnline({ offroad: true });
      refreshCarRoute(false);
      if (profile.connection.autoSync && syncState.pending.length) syncNow("auto");
      if (showMessage) showToast("Demo bridge online");
      return true;
    }
    markOffline("");
    if (showMessage) showToast("Demo bridge offline");
    return false;
  }

  const baseUrl = bridgeBaseUrl();
  if (!baseUrl) {
    markOffline("Set a bridge URL before using HTTP sync.");
    if (showMessage) showToast("Bridge URL required");
    return false;
  }

  try {
    const status = await fetchJson(`${baseUrl}/api/xrm10/status`, { method: "GET" });
    if (status.online === false) {
      syncState.device = { ...syncState.device, ...(status.device || status) };
      if (status.route) syncState.route = normalizeRouteState(status.route);
      markOffline(status.message || "");
      return false;
    }
    if (status.route) syncState.route = normalizeRouteState(status.route);
    markOnline(status.device || status);
    await refreshCarRoute(false);
    if (profile.connection.autoSync && syncState.pending.length) syncNow("auto");
    if (showMessage) showToast("Device online");
    return true;
  } catch (error) {
    markOffline(error.message || "Bridge unavailable");
    if (showMessage) showToast("Bridge unavailable");
    return false;
  }
}

function toggleDemoOnline() {
  if (profile.connection.mode !== "demo") {
    profile.connection.mode = "demo";
    saveProfile();
    writeForm();
    markOnline({ offroad: true });
    refreshCarRoute(false);
    showToast("Demo device online");
    if (profile.connection.autoSync && syncState.pending.length) syncNow("auto");
    return;
  }

  if (connectionStatus() === "online" || connectionStatus() === "syncing") {
    markOffline("");
    showToast("Demo device offline");
    return;
  }

  markOnline({ offroad: true });
  refreshCarRoute(false);
  showToast("Demo device online");
  if (profile.connection.autoSync && syncState.pending.length) syncNow("auto");
}

async function requestRoadState(offroad) {
  const nextLabel = offroad ? "offroad" : "inroad";

  if (connectionStatus() !== "online") {
    const online = await refreshConnection(false);
    if (!online) {
      showToast(`Device offline - cannot set ${nextLabel}`);
      return;
    }
  }

  if (profile.connection?.mode === "http") {
    try {
      syncState.status = "syncing";
      saveSyncState();
      renderConnection();
      const baseUrl = bridgeBaseUrl();
      const response = await fetchJson(`${baseUrl}/api/xrm10/road-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedState: offroad ? "offroad" : "onroad",
          offroad,
          source: "xrm10-control-center",
          policy: {
            driverControlRequired: true,
            bridgeMayRejectUnsafeOnroad: true,
            liveVehicleApplyAllowed: false
          }
        })
      });
      markOnline(response.device || { offroad });
      showToast(`Device set ${nextLabel}`);
    } catch (error) {
      syncState.status = "error";
      syncState.lastError = error.message || `Could not set ${nextLabel}`;
      saveSyncState();
      renderConnection();
      showToast(`Road state failed`);
    }
    return;
  }

  syncState.device.offroad = Boolean(offroad);
  markOnline(syncState.device);
  showToast(`Demo set ${nextLabel}`);
}

async function refreshCarRoute(showMessage = true) {
  if (profile.controllers.carScreenRouteMode === "disabled") {
    syncState.route = normalizeRouteState({ active: false, status: "disabled", nextInstruction: "Car route disabled" });
    saveSyncState();
    renderCarRoute();
    if (showMessage) showToast("Car route disabled");
    return false;
  }

  if (profile.connection?.mode === "http") {
    try {
      const baseUrl = bridgeBaseUrl();
      if (!baseUrl) throw new Error("HTTP bridge required");
      const response = await fetchJson(`${baseUrl}/api/xrm10/car-route`, { method: "GET" });
      syncState.route = normalizeRouteState(response.route || response);
      if (response.device) {
        syncState.device = { ...syncState.device, ...response.device };
      }
      saveSyncState();
      renderConnection();
      if (showMessage) showToast(syncState.route.active ? "Car route loaded" : "No car route yet");
      return syncState.route.active;
    } catch (error) {
      if (showMessage) {
        syncState.route = normalizeRouteState({
          ...syncState.route,
          active: false,
          status: "error",
          nextInstruction: error.message || "Could not read car route"
        });
        saveSyncState();
        renderConnection();
        showToast("Car route unavailable");
      }
      return false;
    }
  }

  if (!syncState.route?.active && profile.controllers.carScreenDestination) {
    syncState.route = buildLocalCarRoute(profile.controllers.carScreenDestination, "manual-demo");
    saveSyncState();
  }
  renderConnection();
  if (showMessage) showToast(syncState.route.active ? "Demo car route loaded" : "No demo route yet");
  return Boolean(syncState.route.active);
}

async function setDemoCarRoute() {
  readForm();
  const destination = profile.controllers.carScreenDestination.trim() || "Demo destination from car screen";

  if (profile.connection?.mode === "http") {
    try {
      const baseUrl = bridgeBaseUrl();
      if (!baseUrl) throw new Error("HTTP bridge required");
      const response = await fetchJson(`${baseUrl}/api/xrm10/car-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active: true,
          source: "car-screen",
          provider: "car-screen-maps",
          destination,
          policy: {
            routeIntentOnly: true,
            liveVehicleApplyAllowed: false,
            driverConfirmationRequired: true
          }
        })
      });
      syncState.route = normalizeRouteState(response.route || response);
      if (response.device) markOnline(response.device);
      saveSyncState();
      renderConnection();
      markSectionChanged("maps", "carScreenDestination");
      showToast("Car route staged");
      return;
    } catch (error) {
      syncState.route = normalizeRouteState({
        ...syncState.route,
        active: false,
        status: "error",
        nextInstruction: error.message || "Could not stage car route"
      });
      saveSyncState();
      renderConnection();
      showToast("Car route failed");
      return;
    }
  }

  syncState.route = buildLocalCarRoute(destination, "manual-demo");
  saveSyncState();
  renderConnection();
  markSectionChanged("maps", "carScreenDestination");
  showToast("Demo car route staged");
}

function buildLocalCarRoute(destination, source = "car-screen") {
  return normalizeRouteState({
    active: true,
    source,
    provider: source === "manual-demo" ? "control-center-demo" : "car-screen-maps",
    status: "active",
    destination,
    routeId: `local-${Date.now()}`,
    nextInstruction: "Route intent ready for driver-confirmed Nav Pilot",
    confidence: 82,
    updatedAt: new Date().toISOString()
  });
}

async function useCarRouteForNav() {
  readForm();
  const hasRoute = syncState.route?.active || await refreshCarRoute(false);
  if (!hasRoute && profile.controllers.carScreenDestination) {
    syncState.route = buildLocalCarRoute(profile.controllers.carScreenDestination, "manual-demo");
    saveSyncState();
  }

  profile.controllers.mapRouteSourceMode = "car-screen";
  profile.controllers.carScreenRouteMode = profile.controllers.carScreenRouteMode === "disabled" ? "detect-destination" : profile.controllers.carScreenRouteMode;
  profile.controllers.carScreenRouteSync = true;
  profile.controllers.carScreenRouteNavPilot = true;
  profile.controllers.carScreenRouteRequireConfirm = true;
  profile.controllers.navMapSourceMode = "car-screen-map";
  profile.controllers.navMode = profile.controllers.navMode === "off" ? "advisory" : profile.controllers.navMode;
  profile.controllers.routeIntentMode = "confirm-nudge";
  profile.controllers.cameraFusionMode = "map-camera-agree";
  profile.controllers.navSteeringMode = "advisory";
  profile.controllers.driverConfirmMode = "required";
  profile.controllers.navRequireSignal = true;
  profile.controllers.navRequireDriverNudge = true;
  profile.controllers.navBlindSpotBlock = true;
  profile.controllers.navMapCameraAgree = true;
  enforceGuardrails();
  saveProfile();
  queueProfileChange("navMapSourceMode");
  queueProfileChange("routeIntentMode");
  markSectionChanged("maps", "mapRouteSourceMode");
  markSectionChanged("navPilot", "navMapSourceMode");
  writeForm();
  showToast(syncState.route?.active ? "Car route linked to Nav Pilot" : "Nav Pilot set for car route");
}

async function checkSshStatus() {
  readForm();
  syncState.sshStatus = "checking";
  saveSyncState();
  renderConnection();

  const target = profile.connection.sshTarget.trim();
  const keyPath = profile.connection.sshKeyPath.trim();
  if (!target || !keyPath) {
    syncState.sshStatus = "target/key required";
    saveSyncState();
    renderConnection();
    showToast("SSH target and key path required");
    return;
  }

  try {
    const baseUrl = bridgeBaseUrl();
    if (!baseUrl) throw new Error("HTTP bridge required");
    const response = await fetchJson(`${baseUrl}/api/xrm10/ssh-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target, keyPath })
    });
    syncState.sshStatus = response.ok ? "connected" : "failed";
    if (response.device) markOnline(response.device);
    saveSyncState();
    renderConnection();
    showToast(response.ok ? "SSH connected" : "SSH failed");
  } catch (error) {
    syncState.sshStatus = error.message || "ssh failed";
    saveSyncState();
    renderConnection();
    showToast("SSH check failed");
  }
}

function queueProfileChange(inputId) {
  if (!inputId || isConnectionField(inputId)) {
    saveSyncState();
    renderConnection();
    if (isConnectionField(inputId)) refreshConnection(false);
    return;
  }

  const change = buildChange(inputId);
  const existing = syncState.pending.findIndex((item) => item.id === change.id);
  if (existing >= 0) {
    syncState.pending[existing] = change;
  } else {
    syncState.pending.push(change);
  }
  syncState.pending = syncState.pending.slice(-60);
  saveSyncState();
  renderConnection();

  if (profile.connection.autoSync && connectionStatus() === "online") {
    scheduleSyncNow("auto");
  }
}

function buildChange(inputId) {
  const path = pathForInput(inputId);
  const value = path ? getPath(profile, path) : undefined;
  const safetyCritical = isSafetyCriticalInput(inputId, path);
  return {
    id: inputId,
    label: labelForInput(inputId),
    path: path ? path.join(".") : inputId,
    value,
    summary: summarizeValue(value),
    safetyCritical,
    applyMode: safetyCritical ? "profile-sync-offroad-review" : "live-profile-sync",
    liveVehicleApply: false,
    queuedAt: new Date().toISOString()
  };
}

function pathForInput(inputId) {
  for (const [id, path] of [...textBindings, ...selectBindings, ...checkboxBindings]) {
    if (id === inputId) return path;
  }
  return rangeBindings.find((binding) => binding.id === inputId)?.path || null;
}

function labelForInput(inputId) {
  const input = byId(inputId);
  const label = input?.closest("label");
  const span = label?.querySelector("span");
  const labelText = span
    ? [...span.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .join(" ")
        .trim()
    : "";
  return labelText || inputId;
}

function summarizeValue(value) {
  if (typeof value === "boolean") return value ? "enabled" : "disabled";
  if (value === undefined || value === null || value === "") return "empty";
  return String(value);
}

function isConnectionField(inputId) {
  return ["connectionMode", "bridgeUrl", "bridgeToken", "sshTarget", "sshKeyPath", "autoSync", "syncOffroadOnly"].includes(inputId);
}

function isSafetyCriticalInput(inputId, path) {
  const joined = [inputId, ...(path || [])].join(".");
  return /lab|nav|route|map|camera|steer|torque|brake|accel|panda|driver|manualOverride|safety|lane|lateral|longitudinal|speed|follow|blindSpot|experimental|vehicleHarness/i.test(joined);
}

function scheduleSyncNow(reason) {
  window.clearTimeout(syncDebounceTimer);
  syncDebounceTimer = window.setTimeout(() => syncNow(reason), 650);
}

async function syncNow(reason = "manual") {
  if (connectionStatus() === "syncing") return;

  if (connectionStatus() !== "online") {
    const online = await refreshConnection(false);
    if (!online) {
      showToast(syncState.pending.length ? "Device offline - changes queued" : "Device offline");
      renderConnection();
      return;
    }
  }

  const pending = syncState.pending.slice();
  syncState.status = "syncing";
  saveSyncState();
  renderConnection();

  try {
    const payload = buildSyncPayload(pending, reason);
    if (profile.connection.mode === "http") {
      const baseUrl = bridgeBaseUrl();
      await fetchJson(`${baseUrl}/api/xrm10/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await wait(240);
    }

    syncState.pending = [];
    syncState.status = "online";
    syncState.lastSeenAt = Date.now();
    syncState.lastSyncAt = Date.now();
    syncState.lastError = "";
    saveSyncState();
    renderConnection();
    showToast(pending.length ? `Synced ${pending.length} changes` : "Profile synced");
  } catch (error) {
    syncState.status = "error";
    syncState.lastError = error.message || "Sync failed";
    saveSyncState();
    renderConnection();
    showToast("Sync failed - changes kept");
  }
}

function buildSyncPayload(changes, reason) {
  return {
    type: "xrm10.profile.sync",
    version: 1,
    reason,
    generatedAt: new Date().toISOString(),
    source: "xrm10-control-center",
    device: {
      target: profile.deviceTarget,
      expectedId: syncState.device.id
    },
    policy: {
      profileSyncAllowed: true,
      liveVehicleApplyAllowed: false,
      safetyCriticalChangesRequireOffroad: profile.connection.syncOffroadOnly,
      driverMonitoringRequired: true,
      pandaSafetyReadOnly: true,
      manualOverrideRequired: true
    },
    changes,
    profile: exportProfile()
  };
}

async function fetchJson(url, options = {}) {
  const headers = {
    ...(options.headers || {})
  };
  const token = profile.connection?.bridgeToken?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers, cache: "no-store" });
  if (!response.ok) throw new Error(`Bridge HTTP ${response.status}`);
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function clearSyncQueue() {
  syncState.pending = [];
  saveSyncState();
  renderConnection();
  showToast("Sync queue cleared");
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
  const route = normalizeRouteState(syncState.route);
  const usesCarRoute = c.navMapSourceMode === "car-screen-map" || c.mapRouteSourceMode === "car-screen";
  const checks = [];
  let score = 100;

  addLabCheck(checks, c.navMode !== "off", "Navigation lab enabled", "Choose advisory, simulation, or closed-course review.", 20);
  addLabCheck(checks, !usesCarRoute || route.active, "Car screen route", "A destination from the car screen must be active before route maneuvers are planned.", 16);
  addLabCheck(checks, !usesCarRoute || c.carScreenRouteSync, "Car route sync", "Car screen destination sync must stay enabled for car-map routing.", 8);
  addLabCheck(checks, !usesCarRoute || c.carScreenRouteRequireConfirm, "Car route confirmation", "Car-screen route maneuvers require driver confirmation.", 18);
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
    "mapRouteSourceMode",
    "carScreenRouteMode",
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
    "trafficPlannerMode",
    "fasterLaneMode",
    "trafficManeuverMode",
    "lwcMode",
    "lwcLaneWidthMode",
    "lwcRoadEdgeMode",
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
    ["Traffic", `${labelFor("fasterLaneMode", profile.controllers.fasterLaneMode)}, LWC ${profile.controllers.lwcMode}`],
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
    },
    fasterLaneMode: {
      off: "Off",
      suggest: "Suggest",
      "driver-confirmed": "Driver confirmed"
    }
  };

  return labels[group]?.[value] || value;
}

function exportProfile() {
  const labReadiness = computeLabReadiness();
  const navReadiness = computeNavReadiness();
  const route = normalizeRouteState(syncState.route);
  const exported = clone(profile);
  if (exported.connection?.bridgeToken) {
    exported.connection.bridgeToken = "[stored locally]";
  }

  return {
    ...exported,
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
      activeCarRoute: {
        active: route.active,
        source: route.source,
        destination: route.destination,
        routeId: route.routeId,
        updatedAt: route.updatedAt
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
  const route = normalizeRouteState(syncState.route);
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
      carScreenRoute: {
        enabled: profile.controllers.mapRouteSourceMode === "car-screen",
        syncEnabled: profile.controllers.carScreenRouteSync,
        sharedWithNavPilot: profile.controllers.carScreenRouteNavPilot,
        requireDriverConfirm: profile.controllers.carScreenRouteRequireConfirm,
        active: route.active,
        destination: route.destination,
        source: route.source,
        routeId: route.routeId,
        updatedAt: route.updatedAt
      },
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

function renderSectionApplyBars() {
  document.querySelectorAll(".section-panel").forEach((panel) => {
    const section = panel.dataset.section;
    if (!section || section === "home") return;
    let bar = panel.querySelector(":scope > .section-apply-bar");
    if (!bar) {
      bar = document.createElement("article");
      bar.className = "section-apply-bar";
      bar.innerHTML = `
        <div>
          <span class="section-apply-kicker">Section status</span>
          <strong data-section-apply-title></strong>
          <small data-section-apply-detail></small>
        </div>
        <div class="section-apply-actions">
          <button class="primary-button" type="button" data-apply-section="${section}">Save section</button>
          <button class="ghost-button" type="button" data-check-section="${section}">Check status</button>
        </div>
      `;
      panel.append(bar);
    }

    const state = sectionState[section] || {};
    const status = state.status || "idle";
    const title = bar.querySelector("[data-section-apply-title]");
    const detail = bar.querySelector("[data-section-apply-detail]");
    bar.dataset.applyStatus = status;
    setText(title, sectionApplyTitle(section, state));
    setText(detail, sectionApplyDetail(state));
  });
}

function sectionApplyTitle(section, state) {
  if (state.status === "applying") return "Applying live";
  if (state.status === "applied") return "Applied and confirmed";
  if (state.status === "failed") return "Apply failed";
  if (state.status === "changed") return "Changed - not saved";
  if (state.status === "checking") return "Checking device";
  return `${sectionMeta[section]?.[1] || section} ready`;
}

function sectionApplyDetail(state) {
  if (state.message) return state.message;
  if (state.appliedAt) return `Last applied ${formatClock(state.appliedAt)}`;
  if (state.changedAt) return `Changed ${formatClock(state.changedAt)}`;
  return "No unsaved section changes.";
}

function markSectionChanged(section, inputId) {
  if (!section || section === "home") return;
  const previous = sectionState[section] || {};
  sectionState[section] = {
    ...previous,
    status: "changed",
    changedAt: Date.now(),
    message: `${labelForInput(inputId)} changed. Press Save section to apply and confirm.`
  };
  saveSectionState();
  renderSectionApplyBars();
}

async function applySection(section) {
  if (!sectionMeta[section]) return;
  readForm();
  sectionState[section] = {
    ...(sectionState[section] || {}),
    status: "applying",
    message: "Sending section settings to the live bridge..."
  };
  saveSectionState();
  renderSectionApplyBars();

  if (connectionStatus() !== "online") {
    const online = await refreshConnection(false);
    if (!online) {
      sectionState[section] = {
        ...(sectionState[section] || {}),
        status: "failed",
        message: "Device offline. Section saved locally but not applied."
      };
      saveSectionState();
      renderSectionApplyBars();
      showToast("Device offline - section not applied");
      return;
    }
  }

  try {
    let result = {};
    if (profile.connection.mode === "http") {
      result = await fetchJson(`${bridgeBaseUrl()}/api/xrm10/section-apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSectionApplyPayload(section))
      });
    } else {
      await wait(220);
      result = { ok: true, section, working: true, appliedAt: new Date().toISOString() };
    }

    sectionState[section] = {
      status: result.working === false ? "failed" : "applied",
      appliedAt: Date.now(),
      message: result.working === false
        ? result.message || "Bridge reported not working."
        : `${sectionMeta[section]?.[1] || section} applied live.`
    };
    saveSectionState();
    renderSectionApplyBars();
    showToast(sectionState[section].status === "applied" ? "Section applied" : "Section check failed");
  } catch (error) {
    sectionState[section] = {
      ...(sectionState[section] || {}),
      status: "failed",
      message: error.message || "Apply failed"
    };
    saveSectionState();
    renderSectionApplyBars();
    showToast("Section apply failed");
  }
}

async function checkSection(section) {
  if (!sectionMeta[section]) return;
  sectionState[section] = {
    ...(sectionState[section] || {}),
    status: "checking",
    message: "Checking live bridge status..."
  };
  saveSectionState();
  renderSectionApplyBars();

  try {
    let result = {};
    if (profile.connection.mode === "http") {
      const params = new URLSearchParams({ section });
      result = await fetchJson(`${bridgeBaseUrl()}/api/xrm10/section-status?${params}`, { method: "GET" });
    } else {
      await wait(180);
      result = sectionState[section]?.status === "applied"
        ? { ok: true, section, working: true, message: "Demo section is applied." }
        : { ok: true, section, working: false, message: "No applied section record yet." };
    }

    sectionState[section] = {
      ...(sectionState[section] || {}),
      status: result.working ? "applied" : "failed",
      message: result.message || (result.working ? "Bridge confirms section is working." : "Bridge has no working confirmation."),
      checkedAt: Date.now()
    };
    saveSectionState();
    renderSectionApplyBars();
    showToast(result.working ? "Section working" : "Section not confirmed");
  } catch (error) {
    sectionState[section] = {
      ...(sectionState[section] || {}),
      status: "failed",
      message: error.message || "Status check failed"
    };
    saveSectionState();
    renderSectionApplyBars();
    showToast("Status check failed");
  }
}

function buildSectionApplyPayload(section) {
  return {
    type: "xrm10.section.apply",
    version: 1,
    section,
    generatedAt: new Date().toISOString(),
    source: "xrm10-control-center",
    profile: exportProfile(),
    policy: {
      liveVehicleApplyAllowed: false,
      profileSectionApplyAllowed: true,
      driverControlRequired: true,
      safetyCriticalChangesRequireOffroad: true
    }
  };
}

function sectionForInput(input) {
  return input?.closest("[data-section]")?.dataset.section || profile.activeSection;
}

function formatClock(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

  els.homeRefreshSync?.addEventListener("click", () => refreshConnection(true));
  els.toolbarRefreshSync?.addEventListener("click", () => refreshConnection(true));
  els.homeConnectionPill?.addEventListener("click", () => setSection("device"));
  els.setOffroad?.addEventListener("click", () => requestRoadState(true));
  els.setOnroad?.addEventListener("click", () => requestRoadState(false));
  els.requestOffroad?.addEventListener("click", () => requestRoadState(true));
  els.requestOnroad?.addEventListener("click", () => requestRoadState(false));
  els.syncNow?.addEventListener("click", () => syncNow("manual"));
  els.checkSsh?.addEventListener("click", checkSshStatus);
  els.demoOnlineToggle?.addEventListener("click", toggleDemoOnline);
  els.clearSyncQueue?.addEventListener("click", clearSyncQueue);

  document.addEventListener("click", (event) => {
    const applyButton = event.target.closest("[data-apply-section]");
    if (applyButton) {
      applySection(applyButton.dataset.applySection);
      return;
    }

    const checkButton = event.target.closest("[data-check-section]");
    if (checkButton) {
      checkSection(checkButton.dataset.checkSection);
    }
  });

  els.targetList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-target]");
    if (!button) return;
    profile.installTarget = button.dataset.target;
    profile.customInstallUrl = "";
    saveProfile();
    queueProfileChange("installTarget");
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
  els.readCarRoute?.addEventListener("click", () => refreshCarRoute(true));
  els.setDemoCarRoute?.addEventListener("click", setDemoCarRoute);
  els.useCarRouteForNav?.addEventListener("click", useCarRouteForNav);
  els.downloadProfile?.addEventListener("click", downloadProfile);
  els.downloadProfileSecondary?.addEventListener("click", downloadProfile);
  els.importButton?.addEventListener("click", () => els.importInput?.click());
  els.importButtonSecondary?.addEventListener("click", () => els.importInput?.click());
  els.importInput?.addEventListener("change", (event) => {
    importProfile(event.target.files[0]);
    event.target.value = "";
  });
}

function handleInput(event) {
  readForm();
  queueProfileChange(event?.target?.id || "profile");
  markSectionChanged(sectionForInput(event?.target), event?.target?.id || "profile");
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

renderLocks();
wireFormEvents();
wireActions();
enforceGuardrails();
writeForm();
heartbeatTimer = window.setInterval(() => {
  if (profile.connection?.mode === "http") {
    refreshConnection(false);
  } else {
    renderConnection();
  }
}, 5000);
window.addEventListener("load", () => {
  if (window.lucide) window.lucide.createIcons();
});
