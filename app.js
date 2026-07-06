const STORAGE_KEY = "xrm10-control-center-profile-v1";
const SYNC_STATE_KEY = "xrm10-control-center-sync-v1";
const SECTION_STATE_KEY = "xrm10-control-center-section-state-v1";
const XRM10_RELEASE_NAME = "XRM10 v1 starter";
const XRM10_RELEASE_VERSION = "2026.07.05-xrm10-v1-starter";

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
    label: "XRM10 v1 starter",
    url: "https://installer.comma.ai/xrm10/dev",
    meta: "starter development target"
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
  home: ["XRM10", "Drive"],
  device: ["Status", "Live Device"],
  maps: ["Route", "Navigation"],
  developer: ["Logs", "Review"],
  safetyLab: ["Test", "Simulation"],
  software: ["Deploy", "Software"]
};

const visibleSections = new Set(Object.keys(sectionMeta));

const defaultProfile = {
  schemaVersion: 13,
  activeSection: "home",
  profileName: "XRM10 v1 Starter HW4",
  vehicleModel: "Tesla Model 3",
  vehicleYear: "2024",
  deviceTarget: "comma four",
  installTarget: "xrm10-dev",
  customInstallUrl: "",
  controllers: {
    lateralMode: "standard",
    madsMode: "stock",
    laneChangeMode: "ui-confirmed",
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
    fasterLaneConfirmPopup: true,
    confirmationPromptEnabled: true,
    confirmationSound: true,
    confirmationRequireTick: true,
    navStartConfirmPopup: true,
    roadEntryPolicy: "full-stop-confirm",
    mergeCheckMode: "stop-clear-gap-confirm",
    signReviewMode: "log-all",
    signLearningMode: "review-only",
    sidewalkStopPolicy: "stop-confirm",
    roadBumpPolicy: "slow-confirm",
    roadEntryStopRequired: true,
    roadEntryCarCheckRequired: true,
    roadEntrySignCheckRequired: true,
    roadEntryDriverConfirmRequired: true,
    roundaboutStopRequired: true,
    roundaboutCarCheckRequired: true,
    roundaboutSignCheckRequired: true,
    roundaboutDriverConfirmRequired: true,
    signDetectionLogging: true,
    signPromptOnStop: true,
    signPromptOnRoundabout: true,
    signPromptOnMerge: true,
    signLearningReviewOnly: true,
    sidewalkDetectionLogging: true,
    sidewalkStopRequired: true,
    sidewalkDriverConfirmRequired: true,
    sidewalkReviewOnly: true,
    roadBumpDetectionLogging: true,
    roadBumpSlowdownRequired: true,
    roadBumpDriverConfirmRequired: true,
    roadBumpReviewOnly: true,
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
    quietMode: false,
    driverViewPreview: false,
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
    googleMapsLink: "",
    routeLatitude: "",
    routeLongitude: "",
    carScreenRouteSync: true,
    carScreenRouteAutoStart: true,
    carScreenRouteNavPilot: true,
    carScreenRouteRequireConfirm: true,
    navPlanPrompts: true,
    navPlanSound: true,
    navPlanSigns: true,
    navPlanTrafficLights: true,
    navPlanRoundabouts: true,
    navPlanSpeedBumps: true,
    navPlanLaneSuggestions: true,
    navPlanReplayOnly: true,
    navPlanClosedCourseOnly: true,
    navPlanLearningReview: true,
    speedLimitSource: "map-vision",
    mapRegion: "gcc-uae-detailed",
    gccMapPackMode: "uae-detailed-priority",
    mapDataFreshnessMode: "prefer-latest",
    uaeDetailedMap: true,
    gccAllMaps: true,
    gccBahrainMap: true,
    gccKuwaitMap: true,
    gccOmanMap: true,
    gccQatarMap: true,
    gccSaudiMap: true,
    offlineMaps: true,
    mapLaneGuidance: true,
    navMode: "auto-start-review",
    routeIntentMode: "confirm-ui",
    maneuverType: "highway-exit",
    navMapSourceMode: "car-screen-map",
    cameraFusionMode: "map-camera-agree",
    navSteeringMode: "auto-confirmed-review",
    roundaboutPolicy: "full-stop-yield-confirm",
    uTurnPolicy: "closed-course-only",
    exitLanePolicy: "stop-before-merge",
    driverConfirmMode: "required",
    navRequireSignal: true,
    navRequireDriverNudge: false,
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
    roadEntryStopTime: 2.5,
    roadEntryClearGap: 5,
    roundaboutStopTime: 2.5,
    roundaboutClearGap: 5,
    signConfidenceGate: 80,
    sidewalkConfidenceGate: 82,
    sidewalkStopTime: 2,
    roadBumpConfidenceGate: 75,
    roadBumpSlowSpeed: 10,
    lwcLaneWidth: 3.7,
    lwcLeftCushion: 0.45,
    lwcRightCushion: 0.45,
    lwcTrafficBuffer: 1.2
  },
  connection: {
    mode: "http",
    bridgeUrl: "",
    bridgeToken: "",
    sshTarget: "comma4",
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
  safetyEventCount: 0,
  pending: [],
  device: {
    name: "comma four",
    id: "6dea66ada857421f",
    version: XRM10_RELEASE_VERSION,
    branch: "dev",
    commit: "344ec6a",
    offroad: true,
    engaged: false,
    quietMode: false,
    driverViewEnabled: false
  },
  route: {
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
  },
  navDrivePlan: {
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
      liveVehicleApplyAllowed: false,
      publicRoadAutonomyEnabled: false,
      automaticCodeChangesAllowed: false
    },
    steps: []
  },
  navDriveEvents: [],
  mapPackage: {
    status: "not loaded",
    name: "UAE detailed + GCC all",
    region: "gcc-uae-detailed",
    fileCount: 0,
    totalBytes: 0,
    updatedAt: null,
    files: []
  },
  intelligence: {
    generatedAt: null,
    reason: "not-run",
    status: "waiting",
    score: 0,
    gate: "waiting-for-data",
    summary: {
      uploadCount: 0,
      uploadedBytes: 0,
      navEventCount: 0,
      safetyEventCount: 0,
      routeActive: false,
      recommendationCount: 0
    },
    policy: {
      learningMode: "review-gated",
      liveVehicleApplyAllowed: false,
      publicRoadAutonomyEnabled: false,
      automaticCodeChangesAllowed: false,
      requiresSimulationBeforeDeploy: true,
      requiresManualReviewBeforeCommaWrite: true
    },
    deploy: {
      mode: "review-only",
      nextStep: "Collect logs, run review, then test in replay or closed-course mode.",
      canApplyToComma: false
    },
    recommendations: []
  },
  codexPackage: null,
  capabilities: null
};

const textBindings = [
  ["profileName", ["profileName"]],
  ["customInstallUrl", ["customInstallUrl"]],
  ["vinNickname", ["controllers", "vinNickname"]],
  ["carScreenDestination", ["controllers", "carScreenDestination"]],
  ["googleMapsLink", ["controllers", "googleMapsLink"]],
  ["routeLatitude", ["controllers", "routeLatitude"]],
  ["routeLongitude", ["controllers", "routeLongitude"]],
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
  ["roadEntryPolicy", ["controllers", "roadEntryPolicy"]],
  ["mergeCheckMode", ["controllers", "mergeCheckMode"]],
  ["signReviewMode", ["controllers", "signReviewMode"]],
  ["signLearningMode", ["controllers", "signLearningMode"]],
  ["sidewalkStopPolicy", ["controllers", "sidewalkStopPolicy"]],
  ["roadBumpPolicy", ["controllers", "roadBumpPolicy"]],
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
  ["gccMapPackMode", ["controllers", "gccMapPackMode"]],
  ["mapDataFreshnessMode", ["controllers", "mapDataFreshnessMode"]],
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
  ["fasterLaneConfirmPopup", ["controllers", "fasterLaneConfirmPopup"]],
  ["confirmationPromptEnabled", ["controllers", "confirmationPromptEnabled"]],
  ["confirmationSound", ["controllers", "confirmationSound"]],
  ["confirmationRequireTick", ["controllers", "confirmationRequireTick"]],
  ["navStartConfirmPopup", ["controllers", "navStartConfirmPopup"]],
  ["roadEntryStopRequired", ["controllers", "roadEntryStopRequired"]],
  ["roadEntryCarCheckRequired", ["controllers", "roadEntryCarCheckRequired"]],
  ["roadEntrySignCheckRequired", ["controllers", "roadEntrySignCheckRequired"]],
  ["roadEntryDriverConfirmRequired", ["controllers", "roadEntryDriverConfirmRequired"]],
  ["roundaboutStopRequired", ["controllers", "roundaboutStopRequired"]],
  ["roundaboutCarCheckRequired", ["controllers", "roundaboutCarCheckRequired"]],
  ["roundaboutSignCheckRequired", ["controllers", "roundaboutSignCheckRequired"]],
  ["roundaboutDriverConfirmRequired", ["controllers", "roundaboutDriverConfirmRequired"]],
  ["signDetectionLogging", ["controllers", "signDetectionLogging"]],
  ["signPromptOnStop", ["controllers", "signPromptOnStop"]],
  ["signPromptOnRoundabout", ["controllers", "signPromptOnRoundabout"]],
  ["signPromptOnMerge", ["controllers", "signPromptOnMerge"]],
  ["signLearningReviewOnly", ["controllers", "signLearningReviewOnly"]],
  ["sidewalkDetectionLogging", ["controllers", "sidewalkDetectionLogging"]],
  ["sidewalkStopRequired", ["controllers", "sidewalkStopRequired"]],
  ["sidewalkDriverConfirmRequired", ["controllers", "sidewalkDriverConfirmRequired"]],
  ["sidewalkReviewOnly", ["controllers", "sidewalkReviewOnly"]],
  ["roadBumpDetectionLogging", ["controllers", "roadBumpDetectionLogging"]],
  ["roadBumpSlowdownRequired", ["controllers", "roadBumpSlowdownRequired"]],
  ["roadBumpDriverConfirmRequired", ["controllers", "roadBumpDriverConfirmRequired"]],
  ["roadBumpReviewOnly", ["controllers", "roadBumpReviewOnly"]],
  ["trafficAutoManeuverBlock", ["controllers", "trafficAutoManeuverBlock"]],
  ["trafficRequireConfirmation", ["controllers", "trafficRequireConfirmation"]],
  ["trafficRequireSignal", ["controllers", "trafficRequireSignal"]],
  ["trafficBlindSpotBlock", ["controllers", "trafficBlindSpotBlock"]],
  ["trafficRecordReview", ["controllers", "trafficRecordReview"]],
  ["roadEdgeOverlay", ["controllers", "roadEdgeOverlay"]],
  ["quietMode", ["controllers", "quietMode"]],
  ["driverViewPreview", ["controllers", "driverViewPreview"]],
  ["showDebugHud", ["controllers", "showDebugHud"]],
  ["largeText", ["controllers", "largeText"]],
  ["reduceMotion", ["controllers", "reduceMotion"]],
  ["offlineMaps", ["controllers", "offlineMaps"]],
  ["mapLaneGuidance", ["controllers", "mapLaneGuidance"]],
  ["carScreenRouteSync", ["controllers", "carScreenRouteSync"]],
  ["carScreenRouteAutoStart", ["controllers", "carScreenRouteAutoStart"]],
  ["carScreenRouteNavPilot", ["controllers", "carScreenRouteNavPilot"]],
  ["carScreenRouteRequireConfirm", ["controllers", "carScreenRouteRequireConfirm"]],
  ["navPlanPrompts", ["controllers", "navPlanPrompts"]],
  ["navPlanSound", ["controllers", "navPlanSound"]],
  ["navPlanSigns", ["controllers", "navPlanSigns"]],
  ["navPlanTrafficLights", ["controllers", "navPlanTrafficLights"]],
  ["navPlanRoundabouts", ["controllers", "navPlanRoundabouts"]],
  ["navPlanSpeedBumps", ["controllers", "navPlanSpeedBumps"]],
  ["navPlanLaneSuggestions", ["controllers", "navPlanLaneSuggestions"]],
  ["navPlanReplayOnly", ["controllers", "navPlanReplayOnly"]],
  ["navPlanClosedCourseOnly", ["controllers", "navPlanClosedCourseOnly"]],
  ["navPlanLearningReview", ["controllers", "navPlanLearningReview"]],
  ["uaeDetailedMap", ["controllers", "uaeDetailedMap"]],
  ["gccAllMaps", ["controllers", "gccAllMaps"]],
  ["gccBahrainMap", ["controllers", "gccBahrainMap"]],
  ["gccKuwaitMap", ["controllers", "gccKuwaitMap"]],
  ["gccOmanMap", ["controllers", "gccOmanMap"]],
  ["gccQatarMap", ["controllers", "gccQatarMap"]],
  ["gccSaudiMap", ["controllers", "gccSaudiMap"]],
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
  { id: "roadEntryStopTime", path: ["tuning", "roadEntryStopTime"], min: 1, max: 8, valueId: "roadEntryStopTimeValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "roadEntryClearGap", path: ["tuning", "roadEntryClearGap"], min: 2, max: 10, valueId: "roadEntryClearGapValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "roundaboutStopTime", path: ["tuning", "roundaboutStopTime"], min: 1, max: 8, valueId: "roundaboutStopTimeValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "roundaboutClearGap", path: ["tuning", "roundaboutClearGap"], min: 2, max: 10, valueId: "roundaboutClearGapValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "signConfidenceGate", path: ["tuning", "signConfidenceGate"], min: 50, max: 95, valueId: "signConfidenceGateValue", format: (v) => `${v}%` },
  { id: "sidewalkConfidenceGate", path: ["tuning", "sidewalkConfidenceGate"], min: 60, max: 98, valueId: "sidewalkConfidenceGateValue", format: (v) => `${v}%` },
  { id: "sidewalkStopTime", path: ["tuning", "sidewalkStopTime"], min: 1, max: 6, valueId: "sidewalkStopTimeValue", format: (v) => `${Number(v).toFixed(1)}s` },
  { id: "roadBumpConfidenceGate", path: ["tuning", "roadBumpConfidenceGate"], min: 50, max: 95, valueId: "roadBumpConfidenceGateValue", format: (v) => `${v}%` },
  { id: "roadBumpSlowSpeed", path: ["tuning", "roadBumpSlowSpeed"], min: 3, max: 20, valueId: "roadBumpSlowSpeedValue", format: (v) => `${v} mph` },
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
let activeConfirmation = null;

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
  driveConsoleTitle: document.querySelector("#driveConsoleTitle"),
  driveConsoleBadge: document.querySelector("#driveConsoleBadge"),
  driveConsoleText: document.querySelector("#driveConsoleText"),
  driveRoadState: document.querySelector("#driveRoadState"),
  driveSshState: document.querySelector("#driveSshState"),
  driveCommit: document.querySelector("#driveCommit"),
  driveLogStatus: document.querySelector("#driveLogStatus"),
  driveLogDetail: document.querySelector("#driveLogDetail"),
  driveRouteStatus: document.querySelector("#driveRouteStatus"),
  driveRouteDetail: document.querySelector("#driveRouteDetail"),
  driveSafetyStatus: document.querySelector("#driveSafetyStatus"),
  driveSafetyDetail: document.querySelector("#driveSafetyDetail"),
  driveLearnStatus: document.querySelector("#driveLearnStatus"),
  driveLearnDetail: document.querySelector("#driveLearnDetail"),
  driveOpenNavigate: document.querySelector("#driveOpenNavigate"),
  driveOpenLogs: document.querySelector("#driveOpenLogs"),
  driveOpenTest: document.querySelector("#driveOpenTest"),
  liveCapabilityBadge: document.querySelector("#liveCapabilityBadge"),
  liveCapabilitySummary: document.querySelector("#liveCapabilitySummary"),
  liveCapabilityList: document.querySelector("#liveCapabilityList"),
  smartSystemBadge: document.querySelector("#smartSystemBadge"),
  smartSystemScore: document.querySelector("#smartSystemScore"),
  smartSystemSummary: document.querySelector("#smartSystemSummary"),
  smartPipelineList: document.querySelector("#smartPipelineList"),
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
  quietModeState: document.querySelector("#quietModeState"),
  driverViewState: document.querySelector("#driverViewState"),
  liveQueueList: document.querySelector("#liveQueueList"),
  topConnectionState: document.querySelector("#topConnectionState"),
  topRoadState: document.querySelector("#topRoadState"),
  topLastSeen: document.querySelector("#topLastSeen"),
  topPendingCount: document.querySelector("#topPendingCount"),
  topRouteState: document.querySelector("#topRouteState"),
  topSafetyEventCount: document.querySelector("#topSafetyEventCount"),
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
  startAppRoute: document.querySelector("#startAppRoute"),
  openGoogleMaps: document.querySelector("#openGoogleMaps"),
  clearAppRoute: document.querySelector("#clearAppRoute"),
  readCarRoute: document.querySelector("#readCarRoute"),
  setDemoCarRoute: document.querySelector("#setDemoCarRoute"),
  useCarRouteForNav: document.querySelector("#useCarRouteForNav"),
  navDrivePlanStatus: document.querySelector("#navDrivePlanStatus"),
  navDriveNext: document.querySelector("#navDriveNext"),
  navDriveConfidence: document.querySelector("#navDriveConfidence"),
  navDriveMode: document.querySelector("#navDriveMode"),
  navDriveLogCount: document.querySelector("#navDriveLogCount"),
  navDrivePlanList: document.querySelector("#navDrivePlanList"),
  buildNavDrivePlan: document.querySelector("#buildNavDrivePlan"),
  runNavSimulation: document.querySelector("#runNavSimulation"),
  logNavPrompt: document.querySelector("#logNavPrompt"),
  exportNavDriveLog: document.querySelector("#exportNavDriveLog"),
  intelligenceStatusBadge: document.querySelector("#intelligenceStatusBadge"),
  intelligenceScore: document.querySelector("#intelligenceScore"),
  intelligenceScoreMeter: document.querySelector("#intelligenceScoreMeter"),
  intelligenceUploadCount: document.querySelector("#intelligenceUploadCount"),
  intelligenceUploadedBytes: document.querySelector("#intelligenceUploadedBytes"),
  intelligenceNavEvents: document.querySelector("#intelligenceNavEvents"),
  intelligenceSafetyEvents: document.querySelector("#intelligenceSafetyEvents"),
  intelligenceGate: document.querySelector("#intelligenceGate"),
  intelligenceUpdated: document.querySelector("#intelligenceUpdated"),
  intelligenceDeployMode: document.querySelector("#intelligenceDeployMode"),
  intelligenceNextStep: document.querySelector("#intelligenceNextStep"),
  codexPackageStatus: document.querySelector("#codexPackageStatus"),
  intelligenceRecommendationList: document.querySelector("#intelligenceRecommendationList"),
  runIntelligenceReview: document.querySelector("#runIntelligenceReview"),
  refreshIntelligence: document.querySelector("#refreshIntelligence"),
  exportIntelligenceReport: document.querySelector("#exportIntelligenceReport"),
  buildCodexPackage: document.querySelector("#buildCodexPackage"),
  exportCodexPackage: document.querySelector("#exportCodexPackage"),
  gccMapPackageStatus: document.querySelector("#gccMapPackageStatus"),
  gccMapPackageFiles: document.querySelector("#gccMapPackageFiles"),
  uploadGccMaps: document.querySelector("#uploadGccMaps"),
  stageUaeMapPack: document.querySelector("#stageUaeMapPack"),
  gccMapUpload: document.querySelector("#gccMapUpload"),
  testFasterLanePrompt: document.querySelector("#testFasterLanePrompt"),
  testNavStartPrompt: document.querySelector("#testNavStartPrompt"),
  testRoadEntryPrompt: document.querySelector("#testRoadEntryPrompt"),
  testRoundaboutPrompt: document.querySelector("#testRoundaboutPrompt"),
  testSignPrompt: document.querySelector("#testSignPrompt"),
  testSidewalkPrompt: document.querySelector("#testSidewalkPrompt"),
  testRoadBumpPrompt: document.querySelector("#testRoadBumpPrompt"),
  confirmationModal: document.querySelector("#confirmationModal"),
  confirmationKicker: document.querySelector("#confirmationKicker"),
  confirmationTitle: document.querySelector("#confirmationTitle"),
  confirmationMessage: document.querySelector("#confirmationMessage"),
  confirmationAccept: document.querySelector("#confirmationAccept"),
  confirmationReject: document.querySelector("#confirmationReject"),
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
  const sourceSchema = Number(input.schemaVersion || 0);
  const inputControllers = {
    ...(input.controllers || {})
  };

  if (sourceSchema < 9) {
    Object.assign(inputControllers, {
      laneChangeMode: "ui-confirmed",
      trafficPlannerMode: "advisory",
      fasterLaneMode: "suggest",
      fasterLaneConfirmPopup: true,
      confirmationPromptEnabled: true,
      confirmationSound: true,
      confirmationRequireTick: true,
      navStartConfirmPopup: true,
      mapRouteSourceMode: "car-screen",
      carScreenRouteMode: "detect-destination",
      carScreenDestination: "",
      googleMapsLink: "",
      routeLatitude: "",
      routeLongitude: "",
      carScreenRouteSync: true,
      carScreenRouteAutoStart: true,
      carScreenRouteNavPilot: true,
      carScreenRouteRequireConfirm: true,
      mapRegion: "gcc-uae-detailed",
      gccMapPackMode: "uae-detailed-priority",
      mapDataFreshnessMode: "prefer-latest",
      uaeDetailedMap: true,
      gccAllMaps: true,
      gccBahrainMap: true,
      gccKuwaitMap: true,
      gccOmanMap: true,
      gccQatarMap: true,
      gccSaudiMap: true,
      offlineMaps: true,
      navMode: "auto-start-review",
      routeIntentMode: "confirm-ui",
      navMapSourceMode: "car-screen-map",
      navSteeringMode: "auto-confirmed-review",
      driverConfirmMode: "required",
      navRequireDriverNudge: false
    });
  }

  if (sourceSchema < 10) {
    Object.assign(inputControllers, {
      roadEntryPolicy: "full-stop-confirm",
      mergeCheckMode: "stop-clear-gap-confirm",
      roundaboutPolicy: "full-stop-yield-confirm",
      exitLanePolicy: "stop-before-merge",
      signReviewMode: "log-all",
      signLearningMode: "review-only",
      roadEntryStopRequired: true,
      roadEntryCarCheckRequired: true,
      roadEntrySignCheckRequired: true,
      roadEntryDriverConfirmRequired: true,
      roundaboutStopRequired: true,
      roundaboutCarCheckRequired: true,
      roundaboutSignCheckRequired: true,
      roundaboutDriverConfirmRequired: true,
      signDetectionLogging: true,
      signPromptOnStop: true,
      signPromptOnRoundabout: true,
      signPromptOnMerge: true,
      signLearningReviewOnly: true,
      confirmationPromptEnabled: true,
      confirmationSound: true,
      confirmationRequireTick: true
    });
  }

  if (sourceSchema < 11) {
    Object.assign(inputControllers, {
      sidewalkStopPolicy: "stop-confirm",
      roadBumpPolicy: "slow-confirm",
      sidewalkDetectionLogging: true,
      sidewalkStopRequired: true,
      sidewalkDriverConfirmRequired: true,
      sidewalkReviewOnly: true,
      roadBumpDetectionLogging: true,
      roadBumpSlowdownRequired: true,
      roadBumpDriverConfirmRequired: true,
      roadBumpReviewOnly: true,
      confirmationPromptEnabled: true,
      confirmationSound: true,
      confirmationRequireTick: true
    });
  }

  if (sourceSchema < 12) {
    Object.assign(inputControllers, {
      quietMode: false,
      driverViewPreview: false
    });
  }

  if (sourceSchema < 13) {
    Object.assign(inputControllers, {
      navPlanPrompts: true,
      navPlanSound: true,
      navPlanSigns: true,
      navPlanTrafficLights: true,
      navPlanRoundabouts: true,
      navPlanSpeedBumps: true,
      navPlanLaneSuggestions: true,
      navPlanReplayOnly: true,
      navPlanClosedCourseOnly: true,
      navPlanLearningReview: true
    });
  }

  const inputConnection = {
    ...(input.connection || {})
  };

  if (sourceSchema < 12) {
    if (!inputConnection.mode || inputConnection.mode === "demo") inputConnection.mode = "http";
    if (!inputConnection.sshTarget) inputConnection.sshTarget = "comma4";
  }

  return {
    ...next,
    ...input,
    schemaVersion: next.schemaVersion,
    activeSection: sectionMeta[input.activeSection] ? input.activeSection : next.activeSection,
    controllers: {
      ...next.controllers,
      ...inputControllers
    },
    tuning: {
      ...next.tuning,
      ...(input.tuning || {})
    },
    connection: {
      ...next.connection,
      ...inputConnection,
      mode: ["demo", "http", "offline"].includes(inputConnection.mode) ? inputConnection.mode : next.connection.mode,
      autoSync: inputConnection.autoSync !== false,
      syncOffroadOnly: inputConnection.syncOffroadOnly !== false
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
    safetyEventCount: clamp(input.safetyEventCount ?? next.safetyEventCount, 0, 9999),
    pending: Array.isArray(input.pending) ? input.pending.slice(0, 60) : [],
    device: {
      ...next.device,
      ...(input.device || {})
    },
    route: normalizeRouteState(input.route || next.route),
    navDrivePlan: normalizeNavDrivePlan(input.navDrivePlan || next.navDrivePlan),
    navDriveEvents: normalizeNavDriveEvents(input.navDriveEvents || next.navDriveEvents),
    mapPackage: normalizeMapPackageState(input.mapPackage || next.mapPackage),
    intelligence: normalizeIntelligenceReport(input.intelligence || next.intelligence),
    codexPackage: input.codexPackage || next.codexPackage,
    capabilities: input.capabilities || next.capabilities
  };
}

function normalizeRouteState(input = {}) {
  const next = clone(defaultSyncState.route);
  const destination = String(input.destination || "").trim();
  const latitude = input.latitude === undefined || input.latitude === null ? "" : String(input.latitude).trim();
  const longitude = input.longitude === undefined || input.longitude === null ? "" : String(input.longitude).trim();
  return {
    ...next,
    ...input,
    active: Boolean(input.active && destination),
    source: String(input.source || next.source),
    provider: String(input.provider || next.provider),
    status: String(input.status || (destination ? "active" : next.status)),
    destination,
    latitude,
    longitude,
    googleMapsUrl: String(input.googleMapsUrl || ""),
    routeId: String(input.routeId || ""),
    nextInstruction: String(input.nextInstruction || (destination ? "Route loaded from car screen" : next.nextInstruction)),
    confidence: clamp(input.confidence ?? next.confidence, 0, 100),
    updatedAt: input.updatedAt || null
  };
}

function normalizeNavDrivePlan(input = {}) {
  const next = clone(defaultSyncState.navDrivePlan);
  const steps = Array.isArray(input.steps) ? input.steps.slice(0, 14).map(normalizeNavDriveStep) : [];
  const confidence = Number(input.confidence ?? next.confidence);
  return {
    ...next,
    ...input,
    active: Boolean(input.active && steps.length),
    status: String(input.status || (steps.length ? "ready" : next.status)),
    mode: String(input.mode || next.mode),
    routeId: String(input.routeId || ""),
    destination: String(input.destination || ""),
    nextAction: String(input.nextAction || steps[0]?.title || next.nextAction),
    confidence: Number.isFinite(confidence) ? clamp(confidence, 0, 100) : next.confidence,
    updatedAt: input.updatedAt || null,
    simulatedAt: input.simulatedAt || null,
    policy: {
      ...next.policy,
      ...(input.policy || {}),
      routeIntentOnly: true,
      simulationOnly: input.policy?.simulationOnly !== false,
      closedCourseOnly: true,
      liveVehicleApplyAllowed: false,
      publicRoadAutonomyEnabled: false,
      automaticCodeChangesAllowed: false
    },
    steps
  };
}

function normalizeNavDriveStep(step = {}, index = 0) {
  const title = String(step.title || `Drive plan step ${index + 1}`);
  const safeIndex = Number.isFinite(Number(index)) ? Number(index) : 0;
  const order = Number(step.order ?? safeIndex + 1);
  return {
    id: String(step.id || slug(title)),
    order: Number.isFinite(order) ? order : safeIndex + 1,
    type: String(step.type || "review"),
    title,
    detail: String(step.detail || ""),
    status: String(step.status || "pending"),
    confidence: clamp(step.confidence ?? 75, 0, 100),
    requiresConfirmation: step.requiresConfirmation !== false,
    logKind: String(step.logKind || step.type || "review")
  };
}

function normalizeNavDriveEvents(input = []) {
  return Array.isArray(input)
    ? input.slice(-300).map((event) => ({
        receivedAt: event.receivedAt || event.generatedAt || null,
        generatedAt: event.generatedAt || event.receivedAt || new Date().toISOString(),
        event: String(event.event || "nav-drive-event"),
        route: event.route || null,
        step: event.step || null,
        gps: event.gps || {},
        speed: event.speed || {},
        cameraState: event.cameraState || {},
        policy: {
          ...(event.policy || {}),
          logOnly: true,
          liveVehicleApplyAllowed: false,
          publicRoadAutonomyEnabled: false,
          automaticCodeChangesAllowed: false
        }
      }))
    : [];
}

function normalizeMapPackageState(input = {}) {
  const next = clone(defaultSyncState.mapPackage);
  const files = Array.isArray(input.files)
    ? input.files.slice(0, 40).map((file) => ({
        name: String(file.name || "map-file"),
        size: Number(file.size) || 0,
        type: String(file.type || "map-data")
      }))
    : [];
  const totalBytes = Number(input.totalBytes ?? files.reduce((sum, file) => sum + file.size, 0));
  return {
    ...next,
    ...input,
    status: String(input.status || next.status),
    name: String(input.name || next.name),
    region: String(input.region || next.region),
    fileCount: Number(input.fileCount ?? files.length) || 0,
    totalBytes: Number.isFinite(totalBytes) ? totalBytes : 0,
    updatedAt: input.updatedAt || null,
    files
  };
}

function normalizeIntelligenceReport(input = {}) {
  const next = clone(defaultSyncState.intelligence);
  const summary = input.summary || {};
  const deploy = input.deploy || {};
  return {
    ...next,
    ...input,
    generatedAt: input.generatedAt || null,
    reason: String(input.reason || next.reason),
    status: String(input.status || next.status),
    score: clamp(input.score ?? next.score, 0, 100),
    gate: String(input.gate || next.gate),
    summary: {
      ...next.summary,
      ...summary,
      uploadCount: Number(summary.uploadCount || 0),
      uploadedBytes: Number(summary.uploadedBytes || 0),
      navEventCount: Number(summary.navEventCount || 0),
      safetyEventCount: Number(summary.safetyEventCount || 0),
      routeActive: Boolean(summary.routeActive),
      recommendationCount: Number(summary.recommendationCount || 0)
    },
    policy: {
      ...next.policy,
      ...(input.policy || {}),
      liveVehicleApplyAllowed: false,
      publicRoadAutonomyEnabled: false,
      automaticCodeChangesAllowed: false,
      requiresManualReviewBeforeCommaWrite: true
    },
    deploy: {
      ...next.deploy,
      ...deploy,
      mode: String(deploy.mode || next.deploy.mode),
      nextStep: String(deploy.nextStep || next.deploy.nextStep),
      canApplyToComma: false
    },
    recommendations: Array.isArray(input.recommendations)
      ? input.recommendations.slice(0, 24).map(normalizeIntelligenceRecommendation)
      : []
  };
}

function normalizeIntelligenceRecommendation(item = {}, index = 0) {
  const severity = ["pass", "info", "warn", "block"].includes(item.severity) ? item.severity : "info";
  const title = String(item.title || `Review item ${index + 1}`);
  return {
    id: String(item.id || slug(title) || `rec-${index + 1}`),
    severity,
    title,
    detail: String(item.detail || ""),
    nextAction: String(item.nextAction || ""),
    source: String(item.source || "xrm10-bridge"),
    category: String(item.category || "review"),
    canAutoApply: false
  };
}

function parseCoordinatePair(value = "") {
  const text = String(value || "").trim();
  const match = text.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return {
    latitude: String(latitude),
    longitude: String(longitude)
  };
}

function parseGoogleMapsCoordinates(url = "") {
  const text = String(url || "").trim();
  if (!text) return null;
  return parseCoordinatePair(text);
}

function googleMapsUrlForRoute(destination, latitude = "", longitude = "") {
  const coords = parseCoordinatePair(`${latitude},${longitude}`);
  const query = coords ? `${coords.latitude},${coords.longitude}` : String(destination || "").trim();
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : "https://www.google.com/maps";
}

function routeInputFromForm() {
  readForm();
  const link = profile.controllers.googleMapsLink.trim();
  const linkCoords = parseGoogleMapsCoordinates(link);
  const typedCoords = parseCoordinatePair(`${profile.controllers.routeLatitude},${profile.controllers.routeLongitude}`)
    || parseCoordinatePair(profile.controllers.carScreenDestination);
  const coords = typedCoords || linkCoords;
  const destination = profile.controllers.carScreenDestination.trim()
    || (coords ? `${coords.latitude},${coords.longitude}` : "")
    || link;
  return {
    destination,
    latitude: coords?.latitude || "",
    longitude: coords?.longitude || "",
    googleMapsUrl: link || googleMapsUrlForRoute(destination, coords?.latitude, coords?.longitude)
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
  if (c.navMode === "auto-start-review" && !c.confirmationPromptEnabled) score -= 18;
  if (c.routeIntentMode === "lab-auto-plan") score -= 8;
  if (c.navSteeringMode === "closed-course-plan") score -= 8;
  if (c.navSteeringMode === "auto-confirmed-review" && !c.confirmationRequireTick) score -= 18;
  if (c.maneuverType === "u-turn" || c.maneuverType === "roundabout") score -= 6;
  if (c.trafficPlannerMode !== "off") score -= 3;
  if (c.fasterLaneMode !== "off" && !c.trafficRequireConfirmation) score -= 16;
  if (c.fasterLaneMode !== "off" && !c.fasterLaneConfirmPopup) score -= 10;
  if (c.fasterLaneMode === "driver-confirmed") score -= 4;
  if (!c.trafficAutoManeuverBlock) score -= 18;
  if (!c.trafficBlindSpotBlock) score -= 18;
  if (!c.trafficRequireSignal && c.fasterLaneMode !== "off") score -= 10;
  if (!c.roadEntryStopRequired || !c.roadEntryCarCheckRequired || !c.roadEntrySignCheckRequired) score -= 18;
  if (!c.roundaboutStopRequired || !c.roundaboutCarCheckRequired || !c.roundaboutSignCheckRequired) score -= 18;
  if (!c.signDetectionLogging || !c.signLearningReviewOnly) score -= 14;
  if (!c.sidewalkDetectionLogging || !c.sidewalkStopRequired || !c.sidewalkReviewOnly) score -= 18;
  if (!c.roadBumpDetectionLogging || !c.roadBumpSlowdownRequired || !c.roadBumpReviewOnly) score -= 14;
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
  if (!["nudge", "ui-confirmed", "off"].includes(c.laneChangeMode)) score -= 10;
  if (c.laneChangeMode === "ui-confirmed" && !c.confirmationRequireTick) score -= 18;
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
  if (Number(t.roadEntryStopTime) < 2) score -= 8;
  if (Number(t.roadEntryClearGap) < 4) score -= 10;
  if (Number(t.roundaboutStopTime) < 2) score -= 8;
  if (Number(t.roundaboutClearGap) < 4) score -= 10;
  if (Number(t.signConfidenceGate) < 75) score -= 8;
  if (Number(t.sidewalkConfidenceGate) < 75) score -= 8;
  if (Number(t.sidewalkStopTime) < 1.5) score -= 8;
  if (Number(t.roadBumpConfidenceGate) < 70) score -= 6;
  if (Number(t.roadBumpSlowSpeed) > 15) score -= 8;
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
  profile.controllers.confirmationPromptEnabled = true;
  profile.controllers.confirmationSound = true;
  profile.controllers.confirmationRequireTick = true;
  profile.controllers.navPlanPrompts = true;
  profile.controllers.navPlanSound = true;
  profile.controllers.navPlanReplayOnly = true;
  profile.controllers.navPlanClosedCourseOnly = true;
  profile.controllers.navPlanLearningReview = true;
  profile.controllers.fasterLaneConfirmPopup = true;
  profile.controllers.navStartConfirmPopup = true;
  profile.controllers.roadEntryStopRequired = true;
  profile.controllers.roadEntryCarCheckRequired = true;
  profile.controllers.roadEntrySignCheckRequired = true;
  profile.controllers.roadEntryDriverConfirmRequired = true;
  profile.controllers.roundaboutStopRequired = true;
  profile.controllers.roundaboutCarCheckRequired = true;
  profile.controllers.roundaboutSignCheckRequired = true;
  profile.controllers.roundaboutDriverConfirmRequired = true;
  profile.controllers.signDetectionLogging = true;
  profile.controllers.signLearningReviewOnly = true;
  profile.controllers.sidewalkDetectionLogging = true;
  profile.controllers.sidewalkStopRequired = true;
  profile.controllers.sidewalkDriverConfirmRequired = true;
  profile.controllers.sidewalkReviewOnly = true;
  profile.controllers.roadBumpDetectionLogging = true;
  profile.controllers.roadBumpSlowdownRequired = true;
  profile.controllers.roadBumpDriverConfirmRequired = true;
  profile.controllers.roadBumpReviewOnly = true;
  profile.controllers.navBlindSpotBlock = true;
  profile.controllers.navMapCameraAgree = true;

  if (profile.controllers.navSteeringMode !== "auto-confirmed-review") {
    profile.controllers.navRequireDriverNudge = true;
  }

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
  setText(els.activeBranchMeta, `${XRM10_RELEASE_NAME} - ${activeInstallUrl()}`);
  if (els.branchStatusDot) els.branchStatusDot.style.background = score >= 92 ? "var(--green)" : score >= 75 ? "var(--yellow)" : "var(--red)";
  setText(els.previewTitle, previewTitle());
  setText(els.previewText, previewText());
  if (els.controllerSummary) els.controllerSummary.innerHTML = controllerSummaryRows();
  renderConnection();
  renderMapPackage();
  renderIntelligence();
  renderSafetyLab();
  renderNavPilot();
  if (els.jsonPreview) els.jsonPreview.textContent = JSON.stringify(exportProfile(), null, 2);
  renderTargets();
  renderSectionApplyBars();
  const startupSection = sectionFromUrl() || "home";
  profile.activeSection = startupSection;
  renderSection(startupSection);
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
  const roadStateLabel = device.engaged ? "Engaged" : device.offroad === false ? "Inroad" : "Offroad";
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
  setText(els.quietModeState, device.quietMode ? "On" : "Off");
  setText(els.driverViewState, device.driverViewEnabled ? "On" : "Off");
  setText(els.topConnectionState, statusLabel);
  setText(els.topRoadState, roadStateLabel);
  setText(els.topLastSeen, lastSeen);
  setText(els.topPendingCount, String(pendingCount));
  setText(els.topRouteState, routeLabel);
  setText(els.topSafetyEventCount, String(syncState.safetyEventCount || 0));
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

  renderDriveConsole({ device, status, statusLabel, roadStateLabel, route, routeLabel });
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

  renderCapabilitySummary();
  renderCarRoute();
  renderNavDrivePlan();
  renderIntelligence();
}

function renderDriveConsole({ device, status, statusLabel, roadStateLabel, route, routeLabel }) {
  const report = normalizeIntelligenceReport(syncState.intelligence);
  const summary = report.summary;
  const uploads = Number(summary.uploadCount || 0);
  const uploadedBytes = Number(summary.uploadedBytes || 0);
  const navEvents = Number(summary.navEventCount || 0);
  const safetyEvents = Number(summary.safetyEventCount || syncState.safetyEventCount || 0);
  const routeActive = Boolean(route?.active);
  const isEngaged = Boolean(device.engaged);
  const isOnline = status === "online" || status === "syncing";
  const roadLabel = isEngaged ? "Engaged" : device.offroad === false ? "Inroad" : "Offroad";
  const navSource = String(device.navSource ?? "");
  const sourceLabel = navSource === "2"
    ? "OSM/mapd"
    : navSource === "1"
      ? "Car screen"
      : sourceLabelForRoute(route?.source);
  const score = Math.round(report.score || 0);
  const recommendations = report.recommendations.length || summary.recommendationCount || 0;

  let title = "Bridge offline";
  let text = "Keep the laptop bridge running, then refresh before changing anything.";
  let badge = "Offline";
  let badgeClass = "warn";
  if (isOnline && isEngaged) {
    title = "Logging current drive";
    text = "comma is engaged. The app will watch status; heavy log upload waits until offroad.";
    badge = "Driving";
    badgeClass = "pass";
  } else if (isOnline && device.offroad === false) {
    title = "Inroad standby";
    text = "comma is inroad. Use this view for status; save heavy review work for offroad.";
    badge = "Inroad";
    badgeClass = "warn";
  } else if (isOnline) {
    title = "Ready offroad";
    text = "Good time to sync settings, upload logs, run review, or check navigation.";
    badge = "Ready";
    badgeClass = "pass";
  }

  setText(els.driveConsoleTitle, title);
  setText(els.driveConsoleText, text);
  setBadge(els.driveConsoleBadge, badge, badgeClass);
  setText(els.driveRoadState, roadLabel);
  setText(els.driveSshState, syncState.sshStatus || "not checked");
  setText(els.driveCommit, String(device.commit || "---").slice(0, 7));

  const logStatus = isEngaged
    ? "Recording"
    : uploads > 0
      ? `${uploads} package${uploads === 1 ? "" : "s"}`
      : "Waiting";
  const logDetail = isEngaged
    ? "Upload after offroad"
    : uploads > 0
      ? `${formatBytes(uploadedBytes)} uploaded`
      : "No XRM10 uploads yet";
  setText(els.driveLogStatus, logStatus);
  setText(els.driveLogDetail, logDetail);

  setText(els.driveRouteStatus, routeActive ? "Route staged" : sourceLabel);
  setText(els.driveRouteDetail, routeActive ? routeLabel : route?.nextInstruction || "Waiting for destination");

  setText(els.driveSafetyStatus, "Guarded");
  setText(els.driveSafetyDetail, `${safetyEvents} safety event${safetyEvents === 1 ? "" : "s"} logged`);

  setText(els.driveLearnStatus, `${score}/100`);
  setText(els.driveLearnDetail, recommendations
    ? `${recommendations} review item${recommendations === 1 ? "" : "s"}`
    : navEvents ? `${navEvents} nav event${navEvents === 1 ? "" : "s"}` : "Needs fresh logs");

  document.body.dataset.driveState = isEngaged ? "engaged" : isOnline ? "online" : "offline";
}

function renderCapabilitySummary() {
  const report = syncState.capabilities;
  const totals = report?.totals;
  if (!els.liveCapabilitySummary || !els.liveCapabilityList) return;

  if (!totals) {
    setBadge(els.liveCapabilityBadge, "Unknown", "warn");
    setText(els.liveCapabilitySummary, "Connect the HTTP bridge to see which controls are live-safe, review-only, need integration, or blocked from phone live-apply.");
    els.liveCapabilityList.innerHTML = "";
    return;
  }

  const live = Number(totals.liveSafe || 0);
  const review = Number(totals.reviewOnly || 0);
  const route = Number(totals.routeIntentOnly || 0);
  const map = Number(totals.mapMetadataOnly || 0);
  const needs = Number(totals.needsIntegration || 0);
  const blocked = Number(totals.blockedLiveDrive || 0);

  setBadge(els.liveCapabilityBadge, blocked || needs ? "Partial" : "Live-safe", blocked || needs ? "warn" : "pass");
  setText(
    els.liveCapabilitySummary,
    `${live} controls are live-safe, ${review} are review/logging, ${route} are route intent, ${map} are map metadata, ${needs} need integration, and ${blocked} driving controls are blocked from phone live-apply.`
  );
  els.liveCapabilityList.innerHTML = [
    ["Live-safe", live],
    ["Review", review],
    ["Route intent", route],
    ["Map metadata", map],
    ["Needs integration", needs],
    ["Blocked driving", blocked]
  ].map(([label, value]) => `
    <div class="summary-row">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
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
  if (els.openGoogleMaps) {
    els.openGoogleMaps.disabled = !routeActive && !profile.controllers.carScreenDestination && !profile.controllers.googleMapsLink;
  }
}

function renderNavDrivePlan() {
  const plan = normalizeNavDrivePlan(syncState.navDrivePlan);
  const events = normalizeNavDriveEvents(syncState.navDriveEvents);
  const active = Boolean(plan.active && plan.steps.length);
  const statusClassName = active
    ? plan.status === "simulated" ? "pass" : "warn"
    : plan.status === "error" ? "stop" : "warn";
  const statusLabel = active
    ? plan.status === "simulated" ? "Simulated" : "Ready"
    : "Waiting";

  setBadge(els.navDrivePlanStatus, statusLabel, statusClassName);
  setText(els.navDriveNext, active ? plan.nextAction : "Waiting for route");
  setText(els.navDriveConfidence, `${Math.round(plan.confidence)}%`);
  setText(els.navDriveMode, plan.policy.closedCourseOnly ? "Replay + closed course" : "Simulation locked");
  setText(els.navDriveLogCount, `${events.length} event${events.length === 1 ? "" : "s"}`);

  if (!els.navDrivePlanList) return;
  if (!active) {
    els.navDrivePlanList.innerHTML = `<div class="queue-empty">Start a destination or build from the current route to create a drive plan.</div>`;
    return;
  }

  els.navDrivePlanList.innerHTML = plan.steps
    .map((step, index) => `
      <div class="drive-plan-step">
        <span class="drive-plan-step-icon">${index + 1}</span>
        <div>
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.detail)}</p>
        </div>
        <small>${escapeHtml(step.status)}</small>
      </div>
    `)
    .join("");
}

function renderMapPackage() {
  const mapPackage = normalizeMapPackageState(syncState.mapPackage);
  const countryCount = [
    profile.controllers.uaeDetailedMap,
    profile.controllers.gccSaudiMap,
    profile.controllers.gccOmanMap,
    profile.controllers.gccQatarMap,
    profile.controllers.gccKuwaitMap,
    profile.controllers.gccBahrainMap
  ].filter(Boolean).length;
  const status = mapPackage.fileCount
    ? `${mapPackage.status} - ${formatBytes(mapPackage.totalBytes)}`
    : `${profile.controllers.mapRegion || "gcc-uae-detailed"} - ${countryCount} GCC areas selected`;
  const files = mapPackage.fileCount
    ? `${mapPackage.fileCount} file${mapPackage.fileCount === 1 ? "" : "s"} staged`
    : "No local map files uploaded";

  setText(els.gccMapPackageStatus, status);
  setText(els.gccMapPackageFiles, files);
}

function renderIntelligence() {
  const report = normalizeIntelligenceReport(syncState.intelligence);
  const summary = report.summary;
  const badgeClass = report.status === "ready" ? "pass" : report.status === "blocked" ? "stop" : "warn";
  const badgeLabel = report.status === "ready"
    ? "Ready"
    : report.status === "blocked"
      ? "Blocked"
      : report.status === "review" ? "Review" : "Waiting";
  const updated = report.generatedAt ? formatRouteUpdated(report.generatedAt) : "Not run";
  const uploadLabel = `${summary.uploadCount} package${summary.uploadCount === 1 ? "" : "s"}`;
  const recommendationCount = report.recommendations.length || summary.recommendationCount;

  setBadge(els.smartSystemBadge, badgeLabel, badgeClass);
  setText(els.smartSystemScore, `${Math.round(report.score)}/100`);
  setText(
    els.smartSystemSummary,
    recommendationCount
      ? `${recommendationCount} review item${recommendationCount === 1 ? "" : "s"} - ${report.deploy.nextStep}`
      : "Run a review after logs, route simulation, and safety events are available."
  );

  if (els.smartPipelineList) {
    const pipeline = [
      ["Data", summary.uploadCount > 0, uploadLabel],
      ["Route", summary.routeActive, summary.routeActive ? "Destination active" : "No active destination"],
      ["Replay", summary.navEventCount >= 3, `${summary.navEventCount} nav event${summary.navEventCount === 1 ? "" : "s"}`],
      ["Review", report.status !== "waiting", badgeLabel],
      ["Deploy", false, report.deploy.mode]
    ];
    els.smartPipelineList.innerHTML = pipeline.map(([label, pass, detail]) => `
      <div class="pipeline-step ${pass ? "pass" : "wait"}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(detail)}</strong>
      </div>
    `).join("");
  }

  setBadge(els.intelligenceStatusBadge, badgeLabel, badgeClass);
  setText(els.intelligenceScore, `${Math.round(report.score)}`);
  if (els.intelligenceScoreMeter) els.intelligenceScoreMeter.style.width = `${Math.round(report.score)}%`;
  setText(els.intelligenceUploadCount, uploadLabel);
  setText(els.intelligenceUploadedBytes, formatBytes(summary.uploadedBytes));
  setText(els.intelligenceNavEvents, `${summary.navEventCount} events`);
  setText(els.intelligenceSafetyEvents, `${summary.safetyEventCount} events`);
  setText(els.intelligenceGate, report.gate);
  setText(els.intelligenceUpdated, updated);
  setText(els.intelligenceDeployMode, report.deploy.mode);
  setText(els.intelligenceNextStep, report.deploy.nextStep);
  setText(els.codexPackageStatus, syncState.codexPackage?.generatedAt
    ? formatRouteUpdated(syncState.codexPackage.generatedAt)
    : "Not built");

  if (els.intelligenceRecommendationList) {
    els.intelligenceRecommendationList.innerHTML = report.recommendations.length
      ? report.recommendations.map((item) => `
        <div class="intelligence-rec ${escapeHtml(item.severity)}">
          <span>${escapeHtml(item.severity)}</span>
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.detail)}</p>
            <em>${escapeHtml(item.nextAction)}</em>
          </div>
        </div>
      `).join("")
      : `<div class="queue-empty">No review yet. Run review after the bridge has logs or simulation events.</div>`;
  }
}

function formatBytes(bytes) {
  const value = Number(bytes) || 0;
  if (value >= 1024 * 1024 * 1024) return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  if (value >= 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${value} B`;
}

function sourceLabelForRoute(source) {
  return {
    "car-screen": "Car screen maps",
    "app-route": "App destination",
    "osm-mapd": "OSM/mapd",
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
    offroad: device.offroad !== undefined ? Boolean(device.offroad) : syncState.device.offroad,
    engaged: device.engaged !== undefined ? Boolean(device.engaged) : Boolean(syncState.device.engaged),
    quietMode: device.quietMode !== undefined ? Boolean(device.quietMode) : Boolean(syncState.device.quietMode),
    driverViewEnabled: device.driverViewEnabled !== undefined ? Boolean(device.driverViewEnabled) : Boolean(syncState.device.driverViewEnabled)
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
      if (status.navDrivePlan) syncState.navDrivePlan = normalizeNavDrivePlan(status.navDrivePlan);
      if (status.navDriveEvents) syncState.navDriveEvents = normalizeNavDriveEvents(status.navDriveEvents);
      if (status.mapPackage) syncState.mapPackage = normalizeMapPackageState(status.mapPackage);
      if (status.intelligence) syncState.intelligence = normalizeIntelligenceReport(status.intelligence);
      syncState.safetyEventCount = clamp(status.safetyEventCount ?? syncState.safetyEventCount, 0, 9999);
      if (status.capabilities) syncState.capabilities = status.capabilities;
      markOffline(status.message || "");
      return false;
    }
    if (status.route) syncState.route = normalizeRouteState(status.route);
    if (status.navDrivePlan) syncState.navDrivePlan = normalizeNavDrivePlan(status.navDrivePlan);
    if (status.navDriveEvents) syncState.navDriveEvents = normalizeNavDriveEvents(status.navDriveEvents);
    if (status.mapPackage) syncState.mapPackage = normalizeMapPackageState(status.mapPackage);
    if (status.intelligence) syncState.intelligence = normalizeIntelligenceReport(status.intelligence);
    syncState.safetyEventCount = clamp(status.safetyEventCount ?? syncState.safetyEventCount, 0, 9999);
    if (status.capabilities) syncState.capabilities = status.capabilities;
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

async function refreshCapabilities(showMessage = false) {
  if (profile.connection?.mode !== "http") return false;
  const baseUrl = bridgeBaseUrl();
  if (!baseUrl) return false;
  try {
    const response = await fetchJson(`${baseUrl}/api/xrm10/capabilities`, { method: "GET" });
    if (response.capabilities) {
      syncState.capabilities = response.capabilities;
      saveSyncState();
      renderConnection();
    }
    if (showMessage) showToast("Capabilities refreshed");
    return true;
  } catch (error) {
    if (showMessage) showToast("Capability check failed");
    return false;
  }
}

async function refreshIntelligence(showMessage = false) {
  if (profile.connection?.mode !== "http") {
    renderIntelligence();
    if (showMessage) showToast("HTTP bridge required");
    return false;
  }
  const baseUrl = bridgeBaseUrl();
  if (!baseUrl) {
    if (showMessage) showToast("Bridge URL required");
    return false;
  }
  try {
    const response = await fetchJson(`${baseUrl}/api/xrm10/intelligence-report`, { method: "GET" });
    if (response.intelligence) syncState.intelligence = normalizeIntelligenceReport(response.intelligence);
    if (response.device) markOnline(response.device);
    saveSyncState();
    renderIntelligence();
    if (showMessage) showToast("Review report refreshed");
    return true;
  } catch (error) {
    if (showMessage) showToast("Review refresh failed");
    return false;
  }
}

async function runIntelligenceReview() {
  readForm();
  if (profile.connection?.mode !== "http") {
    showToast("HTTP bridge required");
    return false;
  }
  const baseUrl = bridgeBaseUrl();
  if (!baseUrl) {
    showToast("Bridge URL required");
    return false;
  }
  try {
    const response = await fetchJson(`${baseUrl}/api/xrm10/intelligence-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reason: "app-review",
        profile: exportProfile(),
        policy: {
          reviewOnly: true,
          liveVehicleApplyAllowed: false,
          publicRoadAutonomyEnabled: false,
          automaticCodeChangesAllowed: false
        }
      })
    });
    if (response.intelligence) syncState.intelligence = normalizeIntelligenceReport(response.intelligence);
    if (response.device) markOnline(response.device);
    saveSyncState();
    renderIntelligence();
    markSectionChanged("developer", "runIntelligenceReview");
    showToast("Review updated");
    return true;
  } catch (error) {
    showToast("Review failed");
    return false;
  }
}

async function buildCodexPackage(showMessage = true) {
  readForm();
  if (profile.connection?.mode !== "http") {
    if (showMessage) showToast("HTTP bridge required");
    return null;
  }
  const baseUrl = bridgeBaseUrl();
  if (!baseUrl) {
    if (showMessage) showToast("Bridge URL required");
    return null;
  }
  try {
    const response = await fetchJson(`${baseUrl}/api/xrm10/codex-package`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reason: "app-build-codex-package",
        profile: exportProfile(),
        policy: {
          decodeOnly: true,
          reviewOnly: true,
          liveVehicleApplyAllowed: false,
          publicRoadAutonomyEnabled: false,
          automaticCodeChangesAllowed: false
        }
      })
    });
    if (response.package) syncState.codexPackage = response.package;
    if (response.intelligence) syncState.intelligence = normalizeIntelligenceReport(response.intelligence);
    if (response.device) markOnline(response.device);
    saveSyncState();
    renderIntelligence();
    markSectionChanged("developer", "buildCodexPackage");
    if (showMessage) {
      const commaMessage = response.commaUi?.working ? " and comma UI updated" : "";
      showToast(`Codex package built${commaMessage}`);
    }
    return syncState.codexPackage;
  } catch (error) {
    if (showMessage) showToast("Codex package failed");
    return null;
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
    syncState.route = buildLocalCarRoute(profile.controllers.carScreenDestination, "app-route", routeInputFromForm());
    saveSyncState();
  }
  renderConnection();
  if (showMessage) showToast(syncState.route.active ? "App destination loaded" : "No destination yet");
  return Boolean(syncState.route.active);
}

async function startAppRoute() {
  readForm();
  const routeInput = routeInputFromForm();
  const destination = routeInput.destination.trim();
  if (!destination) {
    showToast("Destination required");
    return;
  }

  profile.controllers.carScreenDestination = destination;
  profile.controllers.routeLatitude = routeInput.latitude;
  profile.controllers.routeLongitude = routeInput.longitude;
  profile.controllers.googleMapsLink = routeInput.googleMapsUrl;
  profile.controllers.mapRouteSourceMode = "app-route";
  profile.controllers.carScreenRouteMode = "detect-destination";
  profile.controllers.carScreenRouteSync = true;
  profile.controllers.carScreenRouteAutoStart = true;
  profile.controllers.carScreenRouteNavPilot = true;
  saveProfile();
  writeForm();

  if (profile.connection?.mode === "http") {
    try {
      const baseUrl = bridgeBaseUrl();
      if (!baseUrl) throw new Error("HTTP bridge required");
      const response = await fetchJson(`${baseUrl}/api/xrm10/car-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active: true,
          source: "app-route",
          provider: "google-maps-link",
          destination,
          latitude: routeInput.latitude,
          longitude: routeInput.longitude,
          googleMapsUrl: routeInput.googleMapsUrl,
          nextInstruction: "Destination staged on comma Navigation screen",
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
      await buildNavDrivePlan(false);
      markSectionChanged("maps", "carScreenDestination");
      showToast("Destination started");
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
      showToast("Destination failed");
      return;
    }
  }

  syncState.route = buildLocalCarRoute(destination, "app-route", routeInput);
  saveSyncState();
  renderConnection();
  await buildNavDrivePlan(false);
  markSectionChanged("maps", "carScreenDestination");
  showToast("Destination staged locally");
}

function buildLocalCarRoute(destination, source = "car-screen", metadata = {}) {
  return normalizeRouteState({
    active: true,
    source,
    provider: source === "app-route" ? "google-maps-link" : source === "manual-demo" ? "control-center-demo" : "car-screen-maps",
    status: "active",
    destination,
    latitude: metadata.latitude || "",
    longitude: metadata.longitude || "",
    googleMapsUrl: metadata.googleMapsUrl || googleMapsUrlForRoute(destination, metadata.latitude, metadata.longitude),
    routeId: `local-${Date.now()}`,
    nextInstruction: "Destination staged on comma Navigation screen",
    confidence: 82,
    updatedAt: new Date().toISOString()
  });
}

async function clearAppRoute() {
  readForm();
  profile.controllers.carScreenDestination = "";
  profile.controllers.routeLatitude = "";
  profile.controllers.routeLongitude = "";
  profile.controllers.googleMapsLink = "";
  saveProfile();
  writeForm();

  if (profile.connection?.mode === "http") {
    try {
      const baseUrl = bridgeBaseUrl();
      const response = await fetchJson(`${baseUrl}/api/xrm10/car-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active: false,
          source: "app-route",
          destination: "",
          policy: {
            routeIntentOnly: true,
            liveVehicleApplyAllowed: false,
            driverConfirmationRequired: true
          }
        })
      });
      syncState.route = normalizeRouteState(response.route || {});
      if (response.device) markOnline(response.device);
    } catch (error) {
      syncState.route = normalizeRouteState({ active: false, status: "waiting", nextInstruction: "Route cleared locally" });
      showToast("Bridge clear failed");
    }
  } else {
    syncState.route = normalizeRouteState({ active: false, status: "waiting", nextInstruction: "Route cleared locally" });
  }

  saveSyncState();
  syncState.navDrivePlan = normalizeNavDrivePlan({ active: false, status: "waiting", nextAction: "Waiting for destination", steps: [] });
  syncState.navDriveEvents = [];
  saveSyncState();
  await syncNavDrivePlanToBridge(syncState.navDrivePlan);
  renderConnection();
  markSectionChanged("maps", "carScreenDestination");
  showToast("Route cleared");
}

function openGoogleMapsForRoute() {
  const routeInput = routeInputFromForm();
  const route = normalizeRouteState(syncState.route);
  const url = routeInput.googleMapsUrl || route.googleMapsUrl || googleMapsUrlForRoute(route.destination || routeInput.destination, route.latitude || routeInput.latitude, route.longitude || routeInput.longitude);
  window.open(url, "_blank", "noopener,noreferrer");
}

async function useCarRouteForNav() {
  readForm();
  const hasRoute = syncState.route?.active || await refreshCarRoute(false);
  if (!hasRoute && profile.controllers.carScreenDestination) {
    syncState.route = buildLocalCarRoute(profile.controllers.carScreenDestination, "app-route", routeInputFromForm());
    saveSyncState();
  }

  profile.controllers.mapRouteSourceMode = "car-screen";
  profile.controllers.carScreenRouteMode = profile.controllers.carScreenRouteMode === "disabled" ? "detect-destination" : profile.controllers.carScreenRouteMode;
  profile.controllers.carScreenRouteSync = true;
  profile.controllers.carScreenRouteAutoStart = true;
  profile.controllers.carScreenRouteNavPilot = true;
  profile.controllers.carScreenRouteRequireConfirm = true;
  profile.controllers.navMapSourceMode = "car-screen-map";
  profile.controllers.navMode = "auto-start-review";
  profile.controllers.routeIntentMode = "confirm-ui";
  profile.controllers.cameraFusionMode = "map-camera-agree";
  profile.controllers.navSteeringMode = "auto-confirmed-review";
  profile.controllers.driverConfirmMode = "required";
  profile.controllers.navRequireSignal = true;
  profile.controllers.navRequireDriverNudge = false;
  profile.controllers.navStartConfirmPopup = true;
  profile.controllers.confirmationPromptEnabled = true;
  profile.controllers.confirmationSound = true;
  profile.controllers.confirmationRequireTick = true;
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

function planningRouteFromState() {
  const activeRoute = normalizeRouteState(syncState.route);
  if (activeRoute.active) return activeRoute;
  const routeInput = routeInputFromForm();
  return routeInput.destination
    ? buildLocalCarRoute(routeInput.destination, "app-route", routeInput)
    : normalizeRouteState({});
}

function buildNavDrivePlanFromRoute(routeInput = normalizeRouteState({})) {
  const route = normalizeRouteState(routeInput);
  const c = profile.controllers;
  const now = new Date().toISOString();
  const confidence = route.active ? Math.max(70, Number(route.confidence) || 82) : 0;
  const steps = [];
  const addStep = (id, type, title, detail, options = {}) => {
    steps.push(normalizeNavDriveStep({
      id,
      order: steps.length + 1,
      type,
      title,
      detail,
      status: options.status || "advisory",
      confidence: options.confidence ?? confidence,
      requiresConfirmation: options.requiresConfirmation !== false,
      logKind: options.logKind || type
    }, steps.length));
  };

  if (!route.active) {
    return normalizeNavDrivePlan({
      active: false,
      status: "waiting",
      nextAction: "Waiting for destination",
      updatedAt: now,
      steps: []
    });
  }

  addStep(
    "keep-lane-monitor",
    "lane-keep",
    "Keep lane and monitor route",
    `Track route to ${route.destination}. Watch lane lines, drivable path, map intent, and driver takeover state.`,
    { requiresConfirmation: false }
  );

  if (profile.controllers.mapLaneGuidance) {
    addStep(
      "prepare-exit-turn",
      "route-maneuver",
      "Prepare exit or turn",
      `Use the route preview distance ${Number(profile.tuning.routePreviewDistance).toFixed(1)} mi to warn before exits, highway splits, and turns.`
    );
  }

  if (c.navPlanTrafficLights) {
    addStep(
      "traffic-light-check",
      "traffic-light",
      "Traffic light checkpoint",
      "Log red/yellow/green state and camera agreement. Stopping or moving remains a reviewed prompt, not a phone command."
    );
  }

  if (c.navPlanSigns) {
    addStep(
      "road-sign-check",
      "road-sign",
      "Stop, yield, and speed sign checkpoint",
      `Detect critical signs above ${profile.tuning.signConfidenceGate}% confidence and log what the camera saw before the plan continues.`
    );
  }

  if (c.navPlanRoundabouts) {
    addStep(
      "roundabout-yield",
      "roundabout",
      "Roundabout yield plan",
      `Hold/yield review until circulating traffic has a ${Number(profile.tuning.roundaboutClearGap).toFixed(1)}s clear gap, then require tick confirmation.`
    );
  }

  if (c.sidewalkDetectionLogging) {
    addStep(
      "sidewalk-curb-stop",
      "sidewalk",
      "Sidewalk and curb stop check",
      `Stop-and-confirm review for sidewalks, curb edges, pedestrian edges, and raised crossings above ${profile.tuning.sidewalkConfidenceGate}% confidence.`
    );
  }

  if (c.navPlanSpeedBumps) {
    addStep(
      "speed-bump-slowdown",
      "speed-bump",
      "Speed bump slowdown",
      `Slowdown review target is ${profile.tuning.roadBumpSlowSpeed} mph when bumps, humps, or raised crossings are detected.`
    );
  }

  if (c.navPlanLaneSuggestions) {
    addStep(
      "faster-lane-suggestion",
      "lane-suggestion",
      "Faster-lane suggestion",
      `Suggest only when the adjacent lane is at least ${profile.tuning.fasterLaneSpeedDelta} mph faster and blind-spot, signal, and camera checks agree.`
    );
  }

  if (c.navPlanReplayOnly) {
    addStep(
      "simulation-replay-gate",
      "simulation",
      "Run replay before car testing",
      "Replay logs must pass without warnings before any closed-course test. Failures create review notes only."
    );
  }

  if (c.navPlanLearningReview) {
    addStep(
      "learning-review-queue",
      "learning-review",
      "Review queue",
      "Collect candidate improvements from logs for manual code review. The app never auto-edits or auto-deploys driving code."
    );
  }

  if (c.navPlanClosedCourseOnly) {
    addStep(
      "closed-course-gate",
      "closed-course",
      "Closed-course physical test gate",
      "Physical validation is limited to a controlled closed course with driver takeover, manual override, and safety observer ready."
    );
  }

  return normalizeNavDrivePlan({
    active: true,
    status: "ready",
    mode: "advisory-simulation",
    routeId: route.routeId || `drive-plan-${Date.now()}`,
    destination: route.destination,
    nextAction: steps[0]?.title || "Keep lane and monitor route",
    confidence,
    updatedAt: now,
    policy: {
      routeIntentOnly: true,
      simulationOnly: true,
      closedCourseOnly: true,
      liveVehicleApplyAllowed: false,
      publicRoadAutonomyEnabled: false,
      automaticCodeChangesAllowed: false
    },
    steps
  });
}

async function buildNavDrivePlan(showMessage = true) {
  readForm();
  const route = planningRouteFromState();
  const plan = buildNavDrivePlanFromRoute(route);
  syncState.navDrivePlan = plan;
  saveSyncState();
  renderNavDrivePlan();
  markSectionChanged("maps", "buildNavDrivePlan");
  await syncNavDrivePlanToBridge(plan);
  if (showMessage) showToast(plan.active ? "Drive plan built" : "Destination required");
  return plan;
}

async function syncNavDrivePlanToBridge(plan = syncState.navDrivePlan) {
  if (profile.connection?.mode !== "http") return false;
  try {
    const baseUrl = bridgeBaseUrl();
    if (!baseUrl) return false;
    const response = await fetchJson(`${baseUrl}/api/xrm10/nav-drive-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        policy: {
          routeIntentOnly: true,
          simulationOnly: true,
          closedCourseOnly: true,
          logOnly: true,
          liveVehicleApplyAllowed: false,
          publicRoadAutonomyEnabled: false,
          automaticCodeChangesAllowed: false
        }
      })
    });
    if (response.plan) {
      syncState.navDrivePlan = normalizeNavDrivePlan(response.plan);
      if (response.intelligence) syncState.intelligence = normalizeIntelligenceReport(response.intelligence);
      saveSyncState();
      renderNavDrivePlan();
      renderIntelligence();
    }
    return true;
  } catch (error) {
    syncState.navDrivePlan = normalizeNavDrivePlan({
      ...syncState.navDrivePlan,
      status: "error",
      nextAction: error.message || "Drive plan bridge sync failed"
    });
    saveSyncState();
    renderNavDrivePlan();
    return false;
  }
}

async function runNavSimulation() {
  readForm();
  let plan = normalizeNavDrivePlan(syncState.navDrivePlan);
  if (!plan.active) plan = await buildNavDrivePlan(false);
  if (!plan.active) {
    showToast("Build a destination first");
    return;
  }

  const simulatedAt = new Date().toISOString();
  const simulatedSteps = plan.steps.map((step) => ({
    ...step,
    status: step.requiresConfirmation ? "prompt-ready" : "simulated"
  }));
  syncState.navDrivePlan = normalizeNavDrivePlan({
    ...plan,
    status: "simulated",
    simulatedAt,
    updatedAt: simulatedAt,
    nextAction: simulatedSteps.find((step) => step.requiresConfirmation)?.title || simulatedSteps[0]?.title || plan.nextAction,
    steps: simulatedSteps
  });

  saveSyncState();
  renderNavDrivePlan();
  await syncNavDrivePlanToBridge(syncState.navDrivePlan);

  for (const step of simulatedSteps) {
    await logNavDriveEvent("simulation-step", step, { silent: true });
  }

  const nextPrompt = simulatedSteps.find((step) => step.requiresConfirmation);
  if (nextPrompt && profile.controllers.navPlanPrompts) {
    showConfirmationPrompt(
      "Nav Drive Plan",
      nextPrompt.title,
      nextPrompt.detail,
      {
        maneuver: nextPrompt.type,
        routeDestination: syncState.navDrivePlan.destination,
        simulationOnly: true,
        closedCourseOnly: true
      }
    );
  }
  showToast("Simulation logged");
}

async function logCurrentNavPrompt() {
  let plan = normalizeNavDrivePlan(syncState.navDrivePlan);
  if (!plan.active) plan = await buildNavDrivePlan(false);
  if (!plan.active) {
    showToast("No drive plan to log");
    return;
  }

  const step = plan.steps.find((item) => item.requiresConfirmation) || plan.steps[0];
  await logNavDriveEvent("manual-prompt", step);
  if (profile.controllers.navPlanPrompts) {
    showConfirmationPrompt(
      "Nav Drive Plan",
      step.title,
      step.detail,
      {
        maneuver: step.type,
        routeDestination: plan.destination,
        simulationOnly: true,
        closedCourseOnly: true
      }
    );
  }
}

async function logNavDriveEvent(event, step = {}, options = {}) {
  const payload = navDriveEventPayload(event, step);
  syncState.navDriveEvents = normalizeNavDriveEvents([...(syncState.navDriveEvents || []), payload]);
  saveSyncState();
  renderNavDrivePlan();

  if (profile.connection?.mode === "http") {
    try {
      const baseUrl = bridgeBaseUrl();
      const response = await fetchJson(`${baseUrl}/api/xrm10/nav-drive-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (Array.isArray(response.events)) {
        syncState.navDriveEvents = normalizeNavDriveEvents(response.events);
      } else if (Number.isFinite(Number(response.eventCount))) {
        syncState.navDriveEvents = normalizeNavDriveEvents(syncState.navDriveEvents).slice(-Number(response.eventCount));
      }
      if (response.intelligence) syncState.intelligence = normalizeIntelligenceReport(response.intelligence);
      saveSyncState();
      renderNavDrivePlan();
      renderIntelligence();
    } catch {
      // Replay logging remains local if the bridge is unreachable.
    }
  }

  if (!options.silent) showToast("Nav prompt logged");
  return payload;
}

function navDriveEventPayload(event, step = {}) {
  const route = normalizeRouteState(syncState.route);
  const routeInput = route.active ? route : planningRouteFromState();
  return {
    type: "xrm10.nav.drive.event",
    event,
    generatedAt: new Date().toISOString(),
    source: "xrm10-control-center",
    route: routeInput,
    step: normalizeNavDriveStep(step),
    gps: {
      latitude: routeInput.latitude || null,
      longitude: routeInput.longitude || null,
      routeId: routeInput.routeId || null
    },
    speed: {
      plannedMph: profile.tuning.navManeuverSpeed,
      bumpSlowdownMph: profile.tuning.roadBumpSlowSpeed,
      source: "configured-threshold"
    },
    cameraState: {
      source: "replay-placeholder",
      mapCameraAgreement: profile.controllers.navMapCameraAgree,
      fusionMode: profile.controllers.cameraFusionMode,
      signsEnabled: profile.controllers.navPlanSigns,
      trafficLightsEnabled: profile.controllers.navPlanTrafficLights,
      roundaboutsEnabled: profile.controllers.navPlanRoundabouts,
      speedBumpsEnabled: profile.controllers.navPlanSpeedBumps
    },
    policy: {
      logOnly: true,
      routeIntentOnly: true,
      simulationOnly: true,
      closedCourseOnly: true,
      liveVehicleApplyAllowed: false,
      publicRoadAutonomyEnabled: false,
      automaticCodeChangesAllowed: false
    }
  };
}

async function stageUaeMapPack() {
  readForm();
  profile.controllers.mapMode = "offline-cache";
  profile.controllers.mapRegion = "gcc-uae-detailed";
  profile.controllers.gccMapPackMode = "uae-detailed-priority";
  profile.controllers.mapDataFreshnessMode = "prefer-latest";
  profile.controllers.offlineMaps = true;
  profile.controllers.uaeDetailedMap = true;
  profile.controllers.gccAllMaps = true;
  profile.controllers.gccSaudiMap = true;
  profile.controllers.gccOmanMap = true;
  profile.controllers.gccQatarMap = true;
  profile.controllers.gccKuwaitMap = true;
  profile.controllers.gccBahrainMap = true;
  syncState.mapPackage = normalizeMapPackageState({
    status: "staged",
    name: "UAE detailed + GCC all",
    region: "gcc-uae-detailed",
    fileCount: 0,
    totalBytes: 0,
    updatedAt: new Date().toISOString(),
    files: []
  });
  saveProfile();
  saveSyncState();
  queueProfileChange("mapRegion");
  markSectionChanged("maps", "gccMapPackMode");
  await syncMapPackage();
  writeForm();
  showToast("UAE detailed GCC map pack staged");
}

async function handleGccMapUpload(files) {
  const list = [...(files || [])];
  if (!list.length) return;
  readForm();
  const mapFiles = list.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type || file.name.split(".").pop() || "map-data"
  }));
  profile.controllers.mapMode = "offline-cache";
  profile.controllers.mapRegion = "gcc-uae-detailed";
  profile.controllers.gccMapPackMode = "custom-upload";
  profile.controllers.offlineMaps = true;
  profile.controllers.uaeDetailedMap = true;
  profile.controllers.gccAllMaps = true;
  syncState.mapPackage = normalizeMapPackageState({
    status: "uploaded metadata",
    name: "Custom GCC/UAE map upload",
    region: "gcc-uae-detailed",
    fileCount: mapFiles.length,
    totalBytes: mapFiles.reduce((sum, file) => sum + file.size, 0),
    updatedAt: new Date().toISOString(),
    files: mapFiles
  });
  saveProfile();
  saveSyncState();
  queueProfileChange("gccMapPackMode");
  markSectionChanged("maps", "gccMapUpload");
  await syncMapPackage();
  writeForm();
  showToast(`Staged ${mapFiles.length} map file${mapFiles.length === 1 ? "" : "s"}`);
}

async function syncMapPackage() {
  if (profile.connection?.mode !== "http") return;
  try {
    const baseUrl = bridgeBaseUrl();
    if (!baseUrl) return;
    const response = await fetchJson(`${baseUrl}/api/xrm10/map-package`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mapPackage: syncState.mapPackage,
        controllers: {
          mapRegion: profile.controllers.mapRegion,
          gccMapPackMode: profile.controllers.gccMapPackMode,
          mapDataFreshnessMode: profile.controllers.mapDataFreshnessMode,
          offlineMaps: profile.controllers.offlineMaps
        },
        policy: {
          mapDataOnly: true,
          liveVehicleApplyAllowed: false,
          driverConfirmationRequired: true
        }
      })
    });
    if (response.mapPackage) {
      syncState.mapPackage = normalizeMapPackageState(response.mapPackage);
      saveSyncState();
    }
  } catch (error) {
    syncState.mapPackage = normalizeMapPackageState({
      ...syncState.mapPackage,
      status: `bridge sync failed: ${error.message || "unknown"}`
    });
    saveSyncState();
  }
}

function showConfirmationPrompt(kind, title, message, details = {}) {
  if (!profile.controllers.confirmationPromptEnabled) {
    showToast("Confirmation popup disabled");
    return;
  }
  activeConfirmation = {
    id: `confirm-${Date.now()}`,
    kind,
    title,
    message,
    details,
    openedAt: new Date().toISOString()
  };
  logSafetyEvent("confirmation-opened", kind, details);
  setText(els.confirmationKicker, kind);
  setText(els.confirmationTitle, title);
  setText(els.confirmationMessage, message);
  if (els.confirmationModal) {
    els.confirmationModal.classList.add("show");
    els.confirmationModal.setAttribute("aria-hidden", "false");
  }
  if (profile.controllers.confirmationSound) playConfirmationSound();
}

function hideConfirmationPrompt(result) {
  const confirmation = activeConfirmation;
  activeConfirmation = null;
  if (els.confirmationModal) {
    els.confirmationModal.classList.remove("show");
    els.confirmationModal.setAttribute("aria-hidden", "true");
  }
  if (confirmation) {
    logSafetyEvent(result === "accepted" ? "confirmation-accepted" : "confirmation-rejected", confirmation.kind, {
      ...confirmation.details,
      confirmationId: confirmation.id,
      openedAt: confirmation.openedAt
    });
  }
  showToast(result === "accepted" ? "Confirmed with tick" : "Confirmation canceled");
}

async function logSafetyEvent(event, kind, details = {}) {
  const payload = {
    type: "xrm10.safety.event",
    event,
    kind,
    generatedAt: new Date().toISOString(),
    source: "xrm10-control-center",
    route: normalizeRouteState(syncState.route),
    mapPackage: normalizeMapPackageState(syncState.mapPackage),
    profile: {
      schemaVersion: profile.schemaVersion,
      navMode: profile.controllers.navMode,
      navSteeringMode: profile.controllers.navSteeringMode,
      roadEntryPolicy: profile.controllers.roadEntryPolicy,
      mergeCheckMode: profile.controllers.mergeCheckMode,
      roundaboutPolicy: profile.controllers.roundaboutPolicy,
      signReviewMode: profile.controllers.signReviewMode,
      signLearningMode: profile.controllers.signLearningMode,
      sidewalkStopPolicy: profile.controllers.sidewalkStopPolicy,
      roadBumpPolicy: profile.controllers.roadBumpPolicy
    },
    thresholds: {
      roadEntryStopTime: profile.tuning.roadEntryStopTime,
      roadEntryClearGap: profile.tuning.roadEntryClearGap,
      roundaboutStopTime: profile.tuning.roundaboutStopTime,
      roundaboutClearGap: profile.tuning.roundaboutClearGap,
      signConfidenceGate: profile.tuning.signConfidenceGate,
      sidewalkConfidenceGate: profile.tuning.sidewalkConfidenceGate,
      sidewalkStopTime: profile.tuning.sidewalkStopTime,
      roadBumpConfidenceGate: profile.tuning.roadBumpConfidenceGate,
      roadBumpSlowSpeed: profile.tuning.roadBumpSlowSpeed
    },
    details,
    policy: {
      logOnly: true,
      liveVehicleApplyAllowed: false,
      driverConfirmationRequired: true,
      publicRoadAutonomyEnabled: false
    }
  };

  if (profile.connection?.mode !== "http") return;
  try {
    const baseUrl = bridgeBaseUrl();
    if (!baseUrl) return;
    const response = await fetchJson(`${baseUrl}/api/xrm10/safety-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    syncState.safetyEventCount = clamp(response.eventCount ?? syncState.safetyEventCount, 0, 9999);
    if (response.intelligence) syncState.intelligence = normalizeIntelligenceReport(response.intelligence);
    saveSyncState();
    renderConnection();
  } catch {
    // Safety event logging should not block the UI; failures remain visible in bridge logs.
  }
}

function playConfirmationSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    oscillator.frequency.setValueAtTime(660, context.currentTime + 0.09);
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.24);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.26);
    window.setTimeout(() => context.close(), 360);
  } catch {
    // Audio is best effort; browsers can block it until a direct user gesture.
  }
}

async function checkSshStatus() {
  readForm();
  syncState.sshStatus = "checking";
  saveSyncState();
  renderConnection();

  const target = profile.connection.sshTarget.trim();
  const keyPath = profile.connection.sshKeyPath.trim();
  if (!target) {
    syncState.sshStatus = "target required";
    saveSyncState();
    renderConnection();
    showToast("SSH target required");
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
      const response = await fetchJson(`${baseUrl}/api/xrm10/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.capabilities) syncState.capabilities = response.capabilities;
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
  const hasUiConfirm = c.confirmationPromptEnabled && c.confirmationRequireTick && c.navStartConfirmPopup;
  const checks = [];
  let score = 100;

  addLabCheck(checks, c.navMode !== "off", "Navigation lab enabled", "Choose advisory, auto-start review, simulation, or closed-course review.", 20);
  addLabCheck(checks, !usesCarRoute || route.active, "Car screen route", "A destination from the car screen must be active before route maneuvers are planned.", 16);
  addLabCheck(checks, !usesCarRoute || c.carScreenRouteSync, "Car route sync", "Car screen destination sync must stay enabled for car-map routing.", 8);
  addLabCheck(checks, !usesCarRoute || c.carScreenRouteRequireConfirm, "Car route confirmation", "Car-screen route maneuvers require driver confirmation.", 18);
  addLabCheck(checks, c.navMode !== "auto-start-review" || hasUiConfirm, "Auto-start confirmation", "Automatic route-start review requires the UI confirmation popup and tick mark.", 18);
  addLabCheck(checks, Number(t.navMapConfidence) >= 75, "Map confidence", "Map confidence should be at least 75%.", 12);
  addLabCheck(checks, Number(t.navCameraConfidence) >= 75, "Camera confidence", "Camera confidence should be at least 75%.", 12);
  addLabCheck(checks, Number(t.navLaneConfidence) >= 70, "Lane confidence", "Lane confidence should be at least 70%.", 10);
  addLabCheck(checks, !c.navMapCameraAgree || Math.abs(Number(t.navMapConfidence) - Number(t.navCameraConfidence)) <= 20, "Map-camera agreement", "Map and camera confidence disagree too much.", 12);
  addLabCheck(checks, c.driverConfirmMode !== "required" || Number(t.navDriverConfirmTime) >= 3, "Driver confirm window", "Driver confirmation window should be at least 3.0s.", 8);
  addLabCheck(checks, c.navRequireDriverNudge || hasUiConfirm || c.navSteeringMode === "advisory", "Driver confirmation gate", "Steering plans require driver nudge or UI tick confirmation outside advisory mode.", 18);
  addLabCheck(checks, c.navRequireSignal || !["highway-exit", "highway-merge", "lane-route"].includes(c.maneuverType), "Signal gate", "Lane-route maneuvers require turn signal gate.", 12);
  addLabCheck(checks, c.navBlindSpotBlock, "Blind spot block", "Blind spot block must stay enabled.", 18);
  addLabCheck(checks, c.roadEntryStopRequired && c.roadEntryCarCheckRequired && c.roadEntrySignCheckRequired, "Road-entry hold", "Road entry requires full stop, cross-traffic check, and sign check.", 18);
  addLabCheck(checks, c.roadEntryDriverConfirmRequired && c.confirmationRequireTick, "Road-entry confirmation", "Road entry requires driver tick confirmation.", 18);
  addLabCheck(checks, Number(t.roadEntryStopTime) >= 2 && Number(t.roadEntryClearGap) >= 4, "Road-entry timing", "Road entry should hold at least 2.0s and require at least 4.0s clear gap.", 12);
  addLabCheck(checks, c.roundaboutStopRequired && c.roundaboutCarCheckRequired && c.roundaboutSignCheckRequired, "Roundabout hold", "Roundabout entry requires full stop, circulating-traffic check, and sign check.", 18);
  addLabCheck(checks, c.roundaboutDriverConfirmRequired && c.confirmationRequireTick, "Roundabout confirmation", "Roundabout entry requires driver tick confirmation.", 18);
  addLabCheck(checks, Number(t.roundaboutStopTime) >= 2 && Number(t.roundaboutClearGap) >= 4, "Roundabout timing", "Roundabout entry should hold at least 2.0s and require at least 4.0s clear gap.", 12);
  addLabCheck(checks, c.signDetectionLogging && c.signLearningReviewOnly && Number(t.signConfidenceGate) >= 75, "Traffic sign review", "Signs must be logged for review only with confidence gate at or above 75%.", 14);
  addLabCheck(checks, c.sidewalkDetectionLogging && c.sidewalkStopRequired && c.sidewalkReviewOnly, "Sidewalk stop gate", "Sidewalks, curbs, and pedestrian-edge detections require stop-and-confirm review only.", 18);
  addLabCheck(checks, c.sidewalkDriverConfirmRequired && c.confirmationRequireTick, "Sidewalk confirmation", "Sidewalk and curb stops require driver tick confirmation.", 18);
  addLabCheck(checks, Number(t.sidewalkConfidenceGate) >= 75 && Number(t.sidewalkStopTime) >= 1.5, "Sidewalk timing", "Sidewalk stop review should use at least 75% confidence and hold at least 1.5s.", 12);
  addLabCheck(checks, c.roadBumpDetectionLogging && c.roadBumpSlowdownRequired && c.roadBumpReviewOnly, "Road-bump slow gate", "Road bumps, speed humps, and raised crossings require slowdown review only.", 14);
  addLabCheck(checks, c.roadBumpDriverConfirmRequired && c.confirmationRequireTick, "Road-bump confirmation", "Road-bump slowdown requires driver tick confirmation.", 14);
  addLabCheck(checks, Number(t.roadBumpConfidenceGate) >= 70 && Number(t.roadBumpSlowSpeed) <= 15, "Road-bump speed cap", "Road-bump review should use at least 70% confidence and cap target speed at or below 15 mph.", 12);
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
  if (profile.controllers.laneChangeMode === "ui-confirmed") return "Lane changes require the UI tick confirmation without a steering nudge.";
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
    "gccMapPackMode",
    "mapDataFreshnessMode",
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
    "roadEntryPolicy",
    "mergeCheckMode",
    "signReviewMode",
    "signLearningMode",
    "sidewalkStopPolicy",
    "roadBumpPolicy",
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
    ["Release", XRM10_RELEASE_NAME],
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
    laneChangeMode: {
      nudge: "Nudge required",
      "ui-confirmed": "UI confirm",
      "timer-1": "1s timer",
      "timer-2": "2s timer",
      off: "Off"
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
    },
    roadEntryPolicy: {
      "full-stop-confirm": "Full stop confirm",
      "hold-until-clear": "Hold until clear",
      "prompt-only": "Prompt only",
      blocked: "Blocked"
    },
    mergeCheckMode: {
      "stop-clear-gap-confirm": "Stop, clear gap, confirm",
      "clear-gap-confirm": "Clear gap confirm",
      "prompt-only": "Prompt only",
      blocked: "Blocked"
    },
    signReviewMode: {
      "log-all": "Log all",
      "prompt-critical": "Prompt critical",
      "stop-signs-only": "Stop signs only",
      off: "Off"
    },
    sidewalkStopPolicy: {
      "stop-confirm": "Stop and confirm",
      "stop-log-only": "Stop and log",
      "prompt-only": "Prompt only",
      blocked: "Blocked"
    },
    roadBumpPolicy: {
      "slow-confirm": "Slow and confirm",
      "slow-log-only": "Slow and log",
      "prompt-only": "Prompt only",
      blocked: "Blocked"
    },
    navMode: {
      off: "Off",
      advisory: "Advisory",
      "auto-start-review": "Auto-start review",
      simulation: "Simulation",
      "closed-course": "Closed-course"
    },
    navSteeringMode: {
      advisory: "Advisory",
      "auto-confirmed-review": "Auto-confirmed review",
      "driver-confirmed": "Driver confirmed",
      "closed-course-plan": "Closed-course plan"
    }
  };

  return labels[group]?.[value] || value;
}

function exportProfile() {
  const labReadiness = computeLabReadiness();
  const navReadiness = computeNavReadiness();
  const route = normalizeRouteState(syncState.route);
  const mapPackage = normalizeMapPackageState(syncState.mapPackage);
  const exported = clone(profile);
  if (exported.connection?.bridgeToken) {
    exported.connection.bridgeToken = "[stored locally]";
  }

  return {
    ...exported,
    computed: {
      safetyScore: computeSafetyScore(),
      releaseName: XRM10_RELEASE_NAME,
      releaseVersion: XRM10_RELEASE_VERSION,
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
        latitude: route.latitude,
        longitude: route.longitude,
        googleMapsUrl: route.googleMapsUrl,
        routeId: route.routeId,
        updatedAt: route.updatedAt
      },
      mapPackage: {
        status: mapPackage.status,
        name: mapPackage.name,
        region: mapPackage.region,
        fileCount: mapPackage.fileCount,
        totalBytes: mapPackage.totalBytes,
        updatedAt: mapPackage.updatedAt
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
  const mapPackage = normalizeMapPackageState(syncState.mapPackage);
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
      confirmationUi: {
        popupEnabled: profile.controllers.confirmationPromptEnabled,
        soundEnabled: profile.controllers.confirmationSound,
        tickRequired: profile.controllers.confirmationRequireTick,
        fasterLanePopup: profile.controllers.fasterLaneConfirmPopup,
        navStartPopup: profile.controllers.navStartConfirmPopup
      },
      mapPackage: {
        mode: profile.controllers.gccMapPackMode,
        freshness: profile.controllers.mapDataFreshnessMode,
        region: profile.controllers.mapRegion,
        uaeDetailedMap: profile.controllers.uaeDetailedMap,
        gccAllMaps: profile.controllers.gccAllMaps,
        stagedStatus: mapPackage.status,
        stagedFiles: mapPackage.fileCount,
        stagedBytes: mapPackage.totalBytes
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
      surfaceSafety: {
        sidewalkStopPolicy: profile.controllers.sidewalkStopPolicy,
        sidewalkDetectionLogging: profile.controllers.sidewalkDetectionLogging,
        sidewalkStopRequired: profile.controllers.sidewalkStopRequired,
        sidewalkDriverConfirmRequired: profile.controllers.sidewalkDriverConfirmRequired,
        sidewalkReviewOnly: profile.controllers.sidewalkReviewOnly,
        sidewalkConfidenceGatePercent: profile.tuning.sidewalkConfidenceGate,
        sidewalkStopTimeSeconds: profile.tuning.sidewalkStopTime,
        roadBumpPolicy: profile.controllers.roadBumpPolicy,
        roadBumpDetectionLogging: profile.controllers.roadBumpDetectionLogging,
        roadBumpSlowdownRequired: profile.controllers.roadBumpSlowdownRequired,
        roadBumpDriverConfirmRequired: profile.controllers.roadBumpDriverConfirmRequired,
        roadBumpReviewOnly: profile.controllers.roadBumpReviewOnly,
        roadBumpConfidenceGatePercent: profile.tuning.roadBumpConfidenceGate,
        roadBumpSlowSpeedMph: profile.tuning.roadBumpSlowSpeed
      },
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
      "Sidewalks and curbs: stop-and-confirm review only; the app does not decide pedestrian-edge clearance.",
      "Road bumps: slow-down review only; the driver remains responsible for braking and speed choice.",
      "Fallback: any blind spot, low confidence, missing lane, unclear yield condition, sidewalk edge, or road bump blocks the maneuver and asks the driver to take over."
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

function exportNavDriveLog() {
  const payload = {
    type: "xrm10.nav.drive.replay",
    generatedAt: new Date().toISOString(),
    route: normalizeRouteState(syncState.route),
    plan: normalizeNavDrivePlan(syncState.navDrivePlan),
    events: normalizeNavDriveEvents(syncState.navDriveEvents),
    thresholds: {
      routePreviewDistance: profile.tuning.routePreviewDistance,
      navManeuverSpeed: profile.tuning.navManeuverSpeed,
      signConfidenceGate: profile.tuning.signConfidenceGate,
      sidewalkConfidenceGate: profile.tuning.sidewalkConfidenceGate,
      roundaboutClearGap: profile.tuning.roundaboutClearGap,
      roadBumpConfidenceGate: profile.tuning.roadBumpConfidenceGate,
      roadBumpSlowSpeed: profile.tuning.roadBumpSlowSpeed,
      fasterLaneSpeedDelta: profile.tuning.fasterLaneSpeedDelta
    },
    policy: {
      replayFirst: true,
      closedCourseOnly: true,
      logOnly: true,
      liveVehicleApplyAllowed: false,
      publicRoadAutonomyEnabled: false,
      automaticCodeChangesAllowed: false
    }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug(profile.profileName)}-nav-drive-replay.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Replay log exported");
}

function exportIntelligenceReport() {
  const payload = {
    type: "xrm10.learning.report",
    generatedAt: new Date().toISOString(),
    profile: {
      profileName: profile.profileName,
      vehicle: `${profile.vehicleYear} ${profile.vehicleModel}`,
      device: profile.deviceTarget
    },
    intelligence: normalizeIntelligenceReport(syncState.intelligence),
    route: normalizeRouteState(syncState.route),
    navDrivePlan: normalizeNavDrivePlan(syncState.navDrivePlan),
    navDriveEvents: normalizeNavDriveEvents(syncState.navDriveEvents),
    mapPackage: normalizeMapPackageState(syncState.mapPackage),
    policy: {
      reviewOnly: true,
      liveVehicleApplyAllowed: false,
      publicRoadAutonomyEnabled: false,
      automaticCodeChangesAllowed: false,
      manualReviewRequiredBeforeCommaWrite: true
    }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug(profile.profileName)}-review-report.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Review report exported");
}

async function exportCodexPackage() {
  let payload = syncState.codexPackage;
  if (!payload) payload = await buildCodexPackage(false);
  if (!payload) {
    showToast("No Codex package to export");
    return;
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug(profile.profileName)}-codex-package.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Codex package exported");
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

function sectionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const candidate = params.get("section") || window.location.hash.replace("#", "");
  return sectionMeta[candidate] ? candidate : null;
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
  document.querySelectorAll(".drive-action-button, .home-tile").forEach((item) => {
    const text = `${item.textContent} ${item.dataset.search || ""}`.toLowerCase();
    item.hidden = query !== "" && !text.includes(query);
  });
}

function pruneAppSections() {
  document.querySelectorAll("[data-section-target]").forEach((element) => {
    const target = element.dataset.sectionTarget;
    if (target && !visibleSections.has(target)) element.remove();
  });

  document.querySelectorAll("[data-section]").forEach((panel) => {
    const section = panel.dataset.section;
    if (section && !visibleSections.has(section)) panel.remove();
  });

  document.querySelectorAll('[data-section-target="maps"] span').forEach((label) => {
    label.textContent = "Route";
  });
  document.querySelectorAll('[data-section-target="device"] span').forEach((label) => {
    label.textContent = "Status";
  });
  document.querySelectorAll('[data-section-target="developer"] span').forEach((label) => {
    label.textContent = "Logs";
  });
  document.querySelectorAll('[data-section-target="safetyLab"] span').forEach((label) => {
    label.textContent = "Test";
  });
  document.querySelectorAll('[data-section-target="software"] span').forEach((label) => {
    label.textContent = "Deploy";
  });

  const routeMode = byId("carScreenRouteMode");
  routeMode?.querySelector('option[value="manual-demo"]')?.remove();
  byId("setDemoCarRoute")?.remove();
  byId("useCarRouteForNav")?.remove();

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
  if (state.status === "partial") return "Partially applied";
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
      await refreshCapabilities(false);
    } else {
      await wait(220);
      result = { ok: true, section, working: true, appliedAt: new Date().toISOString() };
    }

    sectionState[section] = {
      status: result.state === "partial" ? "partial" : result.working === false ? "failed" : "applied",
      appliedAt: Date.now(),
      message: result.message || (result.working === false
        ? "Bridge reported not working."
        : `${sectionMeta[section]?.[1] || section} applied live.`)
    };
    if (result.capability) {
      syncState.capabilities = {
        ...(syncState.capabilities || {}),
        sections: {
          ...(syncState.capabilities?.sections || {}),
          [section]: result.capability
        }
      };
    }
    saveSectionState();
    saveSyncState();
    renderSectionApplyBars();
    showToast(sectionState[section].status === "applied" ? "Section applied" : sectionState[section].status === "partial" ? "Section partially applied" : "Section check failed");
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
      await refreshCapabilities(false);
    } else {
      await wait(180);
      result = sectionState[section]?.status === "applied"
        ? { ok: true, section, working: true, message: "Demo section is applied." }
        : { ok: true, section, working: false, message: "No applied section record yet." };
    }

    sectionState[section] = {
      ...(sectionState[section] || {}),
      status: result.state === "partial" ? "partial" : result.working ? "applied" : "failed",
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
    const firstVisibleItem = [...document.querySelectorAll(".drive-action-button, .home-tile")].find((item) => !item.hidden);
    if (firstVisibleItem?.dataset.sectionTarget) setSection(firstVisibleItem.dataset.sectionTarget);
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
    if (profile.controllers.navMode === "auto-start-review" && profile.controllers.navStartConfirmPopup) {
      showConfirmationPrompt(
        "Route start",
        "Confirm route-start review",
        "Car-screen maps route intent is ready. Confirm with the tick mark before any route-start review action."
      );
    }
    showToast(`Nav Pilot ${result.state}: ${result.score}/100`);
  });

  els.exportNavPlan?.addEventListener("click", downloadNavPlan);
  els.startAppRoute?.addEventListener("click", startAppRoute);
  els.clearAppRoute?.addEventListener("click", clearAppRoute);
  els.openGoogleMaps?.addEventListener("click", openGoogleMapsForRoute);
  els.readCarRoute?.addEventListener("click", () => refreshCarRoute(true));
  els.setDemoCarRoute?.addEventListener("click", startAppRoute);
  els.useCarRouteForNav?.addEventListener("click", useCarRouteForNav);
  els.buildNavDrivePlan?.addEventListener("click", () => buildNavDrivePlan(true));
  els.runNavSimulation?.addEventListener("click", runNavSimulation);
  els.logNavPrompt?.addEventListener("click", logCurrentNavPrompt);
  els.exportNavDriveLog?.addEventListener("click", exportNavDriveLog);
  els.runIntelligenceReview?.addEventListener("click", runIntelligenceReview);
  els.refreshIntelligence?.addEventListener("click", () => refreshIntelligence(true));
  els.exportIntelligenceReport?.addEventListener("click", exportIntelligenceReport);
  els.buildCodexPackage?.addEventListener("click", () => buildCodexPackage(true));
  els.exportCodexPackage?.addEventListener("click", exportCodexPackage);
  els.uploadGccMaps?.addEventListener("click", () => els.gccMapUpload?.click());
  els.gccMapUpload?.addEventListener("change", (event) => {
    handleGccMapUpload(event.target.files);
    event.target.value = "";
  });
  els.stageUaeMapPack?.addEventListener("click", stageUaeMapPack);
  els.testFasterLanePrompt?.addEventListener("click", () => {
    readForm();
    showConfirmationPrompt(
      "Faster lane",
      "Confirm faster-lane suggestion",
      "The planner found a faster lane. Confirm only after mirrors, blind spot, signal, and camera agreement are clear.",
      {
        maneuver: "faster-lane",
        laneChangeMode: profile.controllers.laneChangeMode,
        fasterLaneMode: profile.controllers.fasterLaneMode,
        driverConfirmationRequired: true
      }
    );
  });
  els.testNavStartPrompt?.addEventListener("click", () => {
    readForm();
    showConfirmationPrompt(
      "Route start",
      "Confirm route-start review",
      "Car-screen maps has a destination. Confirm before starting the route steering review plan.",
      {
        maneuver: "route-start",
        routeSource: profile.controllers.mapRouteSourceMode,
        destination: syncState.route.destination || "",
        driverConfirmationRequired: true
      }
    );
  });
  els.testRoadEntryPrompt?.addEventListener("click", () => {
    readForm();
    showConfirmationPrompt(
      "Road entry",
      "Stop and check before road entry",
      "Hold at a full stop, check cross traffic and signs, then use the tick only when the road-entry review is clear.",
      {
        maneuver: "road-entry",
        stopRequired: profile.controllers.roadEntryStopRequired,
        carCheckRequired: profile.controllers.roadEntryCarCheckRequired,
        signCheckRequired: profile.controllers.roadEntrySignCheckRequired,
        clearGapSeconds: profile.tuning.roadEntryClearGap,
        driverConfirmationRequired: profile.controllers.roadEntryDriverConfirmRequired
      }
    );
  });
  els.testRoundaboutPrompt?.addEventListener("click", () => {
    readForm();
    showConfirmationPrompt(
      "Roundabout",
      "Stop and yield before roundabout",
      "Hold before the roundabout, check circulating traffic and signs, then use the tick only after the clear-gap review passes.",
      {
        maneuver: "roundabout-entry",
        stopRequired: profile.controllers.roundaboutStopRequired,
        carCheckRequired: profile.controllers.roundaboutCarCheckRequired,
        signCheckRequired: profile.controllers.roundaboutSignCheckRequired,
        clearGapSeconds: profile.tuning.roundaboutClearGap,
        driverConfirmationRequired: profile.controllers.roundaboutDriverConfirmRequired
      }
    );
  });
  els.testSignPrompt?.addEventListener("click", () => {
    readForm();
    showConfirmationPrompt(
      "Traffic sign",
      "Confirm sign review",
      "Sign detection is review-only. Confirm that stop, yield, roundabout, speed, and lane signs were logged before any driving decision.",
      {
        maneuver: "sign-review",
        signReviewMode: profile.controllers.signReviewMode,
        signLearningMode: profile.controllers.signLearningMode,
        confidenceGate: profile.tuning.signConfidenceGate,
        learningReviewOnly: profile.controllers.signLearningReviewOnly
      }
    );
  });
  els.testSidewalkPrompt?.addEventListener("click", () => {
    readForm();
    showConfirmationPrompt(
      "Sidewalk",
      "Stop for sidewalk or curb edge",
      "Sidewalk, curb, pedestrian-edge, and raised-crossing detections require a full stop and driver tick before any review plan continues.",
      {
        maneuver: "sidewalk-stop",
        sidewalkStopPolicy: profile.controllers.sidewalkStopPolicy,
        stopRequired: profile.controllers.sidewalkStopRequired,
        confidenceGate: profile.tuning.sidewalkConfidenceGate,
        stopHoldSeconds: profile.tuning.sidewalkStopTime,
        reviewOnly: profile.controllers.sidewalkReviewOnly,
        driverConfirmationRequired: profile.controllers.sidewalkDriverConfirmRequired
      }
    );
  });
  els.testRoadBumpPrompt?.addEventListener("click", () => {
    readForm();
    showConfirmationPrompt(
      "Road bump",
      "Slow for road bump",
      "Road bumps, speed humps, and raised crossings require slowdown review and driver tick before the route plan continues.",
      {
        maneuver: "road-bump-slowdown",
        roadBumpPolicy: profile.controllers.roadBumpPolicy,
        slowdownRequired: profile.controllers.roadBumpSlowdownRequired,
        confidenceGate: profile.tuning.roadBumpConfidenceGate,
        slowSpeedMph: profile.tuning.roadBumpSlowSpeed,
        reviewOnly: profile.controllers.roadBumpReviewOnly,
        driverConfirmationRequired: profile.controllers.roadBumpDriverConfirmRequired
      }
    );
  });
  els.confirmationAccept?.addEventListener("click", () => hideConfirmationPrompt("accepted"));
  els.confirmationReject?.addEventListener("click", () => hideConfirmationPrompt("rejected"));
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

pruneAppSections();
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
