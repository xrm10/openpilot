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

const defaultProfile = {
  schemaVersion: 2,
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
    thermalGuard: true
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
    modelConfidenceGate: 65
  },
  safetyPolicy: {
    driverMonitoringRequired: true,
    excessiveActuationChecksLocked: true,
    pandaSafetyReadOnly: true,
    manualOverrideRequired: true,
    unsafeSafetyLimitEditingAllowed: false
  }
};

let profile = loadProfile();

const els = {
  profileName: document.querySelector("#profileName"),
  vehicleModel: document.querySelector("#vehicleModel"),
  vehicleYear: document.querySelector("#vehicleYear"),
  deviceTarget: document.querySelector("#deviceTarget"),
  lateralMode: document.querySelector("#lateralMode"),
  madsMode: document.querySelector("#madsMode"),
  laneChangeMode: document.querySelector("#laneChangeMode"),
  speedAssistMode: document.querySelector("#speedAssistMode"),
  blindSpotDelay: document.querySelector("#blindSpotDelay"),
  laneTurnDesire: document.querySelector("#laneTurnDesire"),
  coopSteering: document.querySelector("#coopSteering"),
  experimentalControls: document.querySelector("#experimentalControls"),
  longitudinalMode: document.querySelector("#longitudinalMode"),
  laneCenterMode: document.querySelector("#laneCenterMode"),
  curveSpeedMode: document.querySelector("#curveSpeedMode"),
  leadBehaviorMode: document.querySelector("#leadBehaviorMode"),
  roadEdgeMode: document.querySelector("#roadEdgeMode"),
  promptMode: document.querySelector("#promptMode"),
  logMode: document.querySelector("#logMode"),
  deviceGuardMode: document.querySelector("#deviceGuardMode"),
  stopGoSmoothing: document.querySelector("#stopGoSmoothing"),
  modelUncertaintyAlert: document.querySelector("#modelUncertaintyAlert"),
  reviewLogCapture: document.querySelector("#reviewLogCapture"),
  thermalGuard: document.querySelector("#thermalGuard"),
  followGap: document.querySelector("#followGap"),
  speedOffset: document.querySelector("#speedOffset"),
  laneDelay: document.querySelector("#laneDelay"),
  curveComfort: document.querySelector("#curveComfort"),
  steerSmoothness: document.querySelector("#steerSmoothness"),
  laneBias: document.querySelector("#laneBias"),
  brakeComfort: document.querySelector("#brakeComfort"),
  promptLeadTime: document.querySelector("#promptLeadTime"),
  modelConfidenceGate: document.querySelector("#modelConfidenceGate"),
  followGapValue: document.querySelector("#followGapValue"),
  speedOffsetValue: document.querySelector("#speedOffsetValue"),
  laneDelayValue: document.querySelector("#laneDelayValue"),
  curveComfortValue: document.querySelector("#curveComfortValue"),
  steerSmoothnessValue: document.querySelector("#steerSmoothnessValue"),
  laneBiasValue: document.querySelector("#laneBiasValue"),
  brakeComfortValue: document.querySelector("#brakeComfortValue"),
  promptLeadTimeValue: document.querySelector("#promptLeadTimeValue"),
  modelConfidenceGateValue: document.querySelector("#modelConfidenceGateValue"),
  safetyScore: document.querySelector("#safetyScore"),
  safetyMeter: document.querySelector("#safetyMeter"),
  safetyBadge: document.querySelector("#safetyBadge"),
  controllerBadge: document.querySelector("#controllerBadge"),
  moduleBadge: document.querySelector("#moduleBadge"),
  activeBranchLabel: document.querySelector("#activeBranchLabel"),
  activeBranchMeta: document.querySelector("#activeBranchMeta"),
  branchStatusDot: document.querySelector("#branchStatusDot"),
  previewTitle: document.querySelector("#previewTitle"),
  previewText: document.querySelector("#previewText"),
  lockList: document.querySelector("#lockList"),
  targetList: document.querySelector("#targetList"),
  controllerSummary: document.querySelector("#controllerSummary"),
  customInstallUrl: document.querySelector("#customInstallUrl"),
  jsonPreview: document.querySelector("#jsonPreview"),
  resetProfile: document.querySelector("#resetProfile"),
  copyInstallUrl: document.querySelector("#copyInstallUrl"),
  downloadProfile: document.querySelector("#downloadProfile"),
  importButton: document.querySelector("#importButton"),
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
      unsafeSafetyLimitEditingAllowed: false
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
  let score = 100;

  if (profile.controllers.experimentalControls) score -= 20;
  if (profile.controllers.coopSteering) score -= 8;
  if (profile.controllers.longitudinalMode === "traffic-review") score -= 10;
  if (profile.controllers.curveSpeedMode === "bounded") score -= 4;
  if (profile.controllers.roadEdgeMode === "off") score -= 8;
  if (profile.controllers.promptMode === "quiet") score -= 5;
  if (profile.controllers.logMode === "minimal" && profile.controllers.experimentalControls) score -= 8;
  if (profile.controllers.deviceGuardMode === "diagnostic") score -= 4;
  if (profile.controllers.stopGoSmoothing) score -= 4;
  if (!profile.controllers.modelUncertaintyAlert) score -= 8;
  if (!profile.controllers.reviewLogCapture && profile.controllers.experimentalControls) score -= 8;
  if (!profile.controllers.thermalGuard) score -= 8;
  if (profile.controllers.laneChangeMode !== "nudge" && profile.controllers.laneChangeMode !== "off") score -= 10;
  if (!profile.controllers.blindSpotDelay && profile.controllers.laneChangeMode !== "off") score -= 18;
  if (Number(profile.tuning.followGap) < 2.2) score -= 10;
  if (Number(profile.tuning.speedOffset) > 2) score -= 6;
  if (Math.abs(Number(profile.tuning.laneBias)) > 10) score -= 6;
  if (Number(profile.tuning.promptLeadTime) < 1) score -= 5;
  if (Number(profile.tuning.modelConfidenceGate) < 60) score -= 8;
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
  profile.profileName = els.profileName.value.trim() || defaultProfile.profileName;
  profile.vehicleModel = els.vehicleModel.value;
  profile.vehicleYear = els.vehicleYear.value;
  profile.deviceTarget = els.deviceTarget.value;
  profile.customInstallUrl = els.customInstallUrl.value.trim();
  profile.controllers.lateralMode = els.lateralMode.value;
  profile.controllers.madsMode = els.madsMode.value;
  profile.controllers.laneChangeMode = els.laneChangeMode.value;
  profile.controllers.speedAssistMode = els.speedAssistMode.value;
  profile.controllers.blindSpotDelay = els.blindSpotDelay.checked;
  profile.controllers.laneTurnDesire = els.laneTurnDesire.checked;
  profile.controllers.coopSteering = els.coopSteering.checked;
  profile.controllers.experimentalControls = els.experimentalControls.checked;
  profile.controllers.longitudinalMode = els.longitudinalMode.value;
  profile.controllers.laneCenterMode = els.laneCenterMode.value;
  profile.controllers.curveSpeedMode = els.curveSpeedMode.value;
  profile.controllers.leadBehaviorMode = els.leadBehaviorMode.value;
  profile.controllers.roadEdgeMode = els.roadEdgeMode.value;
  profile.controllers.promptMode = els.promptMode.value;
  profile.controllers.logMode = els.logMode.value;
  profile.controllers.deviceGuardMode = els.deviceGuardMode.value;
  profile.controllers.stopGoSmoothing = els.stopGoSmoothing.checked;
  profile.controllers.modelUncertaintyAlert = els.modelUncertaintyAlert.checked;
  profile.controllers.reviewLogCapture = els.reviewLogCapture.checked;
  profile.controllers.thermalGuard = els.thermalGuard.checked;
  profile.tuning.followGap = Number(els.followGap.value);
  profile.tuning.speedOffset = Number(els.speedOffset.value);
  profile.tuning.laneDelay = Number(els.laneDelay.value);
  profile.tuning.curveComfort = Number(els.curveComfort.value);
  profile.tuning.steerSmoothness = Number(els.steerSmoothness.value);
  profile.tuning.laneBias = Number(els.laneBias.value);
  profile.tuning.brakeComfort = Number(els.brakeComfort.value);
  profile.tuning.promptLeadTime = Number(els.promptLeadTime.value);
  profile.tuning.modelConfidenceGate = Number(els.modelConfidenceGate.value);

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

  if (profile.controllers.experimentalControls) {
    profile.controllers.coopSteering = false;
    profile.controllers.reviewLogCapture = true;
  }

  if (profile.controllers.promptMode === "quiet") {
    profile.tuning.promptLeadTime = Math.max(profile.tuning.promptLeadTime, 1);
  }

  if (profile.controllers.laneChangeMode === "off") {
    profile.tuning.laneDelay = 0;
  }

  profile.tuning.followGap = clamp(profile.tuning.followGap, 2.0, 3.8);
  profile.tuning.speedOffset = clamp(profile.tuning.speedOffset, 0, 4);
  profile.tuning.laneDelay = clamp(profile.tuning.laneDelay, 0, 3);
  profile.tuning.curveComfort = clamp(profile.tuning.curveComfort, 50, 90);
  profile.tuning.steerSmoothness = clamp(profile.tuning.steerSmoothness, 50, 90);
  profile.tuning.laneBias = clamp(profile.tuning.laneBias, -20, 20);
  profile.tuning.brakeComfort = clamp(profile.tuning.brakeComfort, 50, 90);
  profile.tuning.promptLeadTime = clamp(profile.tuning.promptLeadTime, 0.5, 2.5);
  profile.tuning.modelConfidenceGate = clamp(profile.tuning.modelConfidenceGate, 50, 90);
}

function writeForm() {
  els.profileName.value = profile.profileName;
  els.vehicleModel.value = profile.vehicleModel;
  els.vehicleYear.value = profile.vehicleYear;
  els.deviceTarget.value = profile.deviceTarget;
  els.customInstallUrl.value = profile.customInstallUrl;
  els.lateralMode.value = profile.controllers.lateralMode;
  els.madsMode.value = profile.controllers.madsMode;
  els.laneChangeMode.value = profile.controllers.laneChangeMode;
  els.speedAssistMode.value = profile.controllers.speedAssistMode;
  els.blindSpotDelay.checked = profile.controllers.blindSpotDelay;
  els.laneTurnDesire.checked = profile.controllers.laneTurnDesire;
  els.coopSteering.checked = profile.controllers.coopSteering;
  els.experimentalControls.checked = profile.controllers.experimentalControls;
  els.longitudinalMode.value = profile.controllers.longitudinalMode;
  els.laneCenterMode.value = profile.controllers.laneCenterMode;
  els.curveSpeedMode.value = profile.controllers.curveSpeedMode;
  els.leadBehaviorMode.value = profile.controllers.leadBehaviorMode;
  els.roadEdgeMode.value = profile.controllers.roadEdgeMode;
  els.promptMode.value = profile.controllers.promptMode;
  els.logMode.value = profile.controllers.logMode;
  els.deviceGuardMode.value = profile.controllers.deviceGuardMode;
  els.stopGoSmoothing.checked = profile.controllers.stopGoSmoothing;
  els.modelUncertaintyAlert.checked = profile.controllers.modelUncertaintyAlert;
  els.reviewLogCapture.checked = profile.controllers.reviewLogCapture;
  els.thermalGuard.checked = profile.controllers.thermalGuard;
  els.followGap.value = profile.tuning.followGap;
  els.speedOffset.value = profile.tuning.speedOffset;
  els.laneDelay.value = profile.tuning.laneDelay;
  els.curveComfort.value = profile.tuning.curveComfort;
  els.steerSmoothness.value = profile.tuning.steerSmoothness;
  els.laneBias.value = profile.tuning.laneBias;
  els.brakeComfort.value = profile.tuning.brakeComfort;
  els.promptLeadTime.value = profile.tuning.promptLeadTime;
  els.modelConfidenceGate.value = profile.tuning.modelConfidenceGate;
  render();
}

function renderLocks() {
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

  els.followGapValue.textContent = `${Number(profile.tuning.followGap).toFixed(1)}s`;
  els.speedOffsetValue.textContent = `+${profile.tuning.speedOffset} mph`;
  els.laneDelayValue.textContent = `${Number(profile.tuning.laneDelay).toFixed(1)}s`;
  els.curveComfortValue.textContent = String(profile.tuning.curveComfort);
  els.steerSmoothnessValue.textContent = String(profile.tuning.steerSmoothness);
  els.laneBiasValue.textContent = `${signed(profile.tuning.laneBias)} cm`;
  els.brakeComfortValue.textContent = String(profile.tuning.brakeComfort);
  els.promptLeadTimeValue.textContent = `${Number(profile.tuning.promptLeadTime).toFixed(1)}s`;
  els.modelConfidenceGateValue.textContent = `${profile.tuning.modelConfidenceGate}%`;
  els.safetyScore.textContent = String(score);
  els.safetyMeter.style.width = `${score}%`;
  els.safetyBadge.textContent = score >= 92 ? "Locked" : "Review";
  els.safetyBadge.className = `status-badge ${stateClass}`;
  els.controllerBadge.textContent = controllerLabel();
  els.controllerBadge.className = `status-badge ${stateClass}`;
  els.moduleBadge.textContent = `${activeControllerCount()} modules`;
  els.moduleBadge.className = `status-badge ${stateClass}`;
  els.activeBranchLabel.textContent = branchLabel;
  els.activeBranchMeta.textContent = activeInstallUrl();
  els.branchStatusDot.style.background = score >= 92 ? "var(--green)" : score >= 75 ? "var(--yellow)" : "var(--red)";
  els.previewTitle.textContent = previewTitle();
  els.previewText.textContent = previewText();
  els.controllerSummary.innerHTML = controllerSummaryRows();
  els.jsonPreview.textContent = JSON.stringify(exportProfile(), null, 2);
  renderTargets();
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
    "deviceGuardMode"
  ];
  const toggleModules = [
    "blindSpotDelay",
    "laneTurnDesire",
    "coopSteering",
    "experimentalControls",
    "stopGoSmoothing",
    "modelUncertaintyAlert",
    "reviewLogCapture",
    "thermalGuard"
  ];

  return fixedModules.length + toggleModules.filter((key) => profile.controllers[key]).length;
}

function controllerSummaryRows() {
  const rows = [
    ["Longitudinal", labelFor("longitudinalMode", profile.controllers.longitudinalMode)],
    ["Lateral", labelFor("lateralMode", profile.controllers.lateralMode)],
    ["Lane centering", labelFor("laneCenterMode", profile.controllers.laneCenterMode)],
    ["Road edge", labelFor("roadEdgeMode", profile.controllers.roadEdgeMode)],
    ["Prompts", `${labelFor("promptMode", profile.controllers.promptMode)}, ${Number(profile.tuning.promptLeadTime).toFixed(1)}s lead`],
    ["Logging", `${labelFor("logMode", profile.controllers.logMode)} with ${profile.controllers.reviewLogCapture ? "capture on" : "capture off"}`]
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
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 1800);
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

function handleInput() {
  readForm();
  writeForm();
}

[
  els.profileName,
  els.vehicleModel,
  els.vehicleYear,
  els.deviceTarget,
  els.lateralMode,
  els.madsMode,
  els.laneChangeMode,
  els.speedAssistMode,
  els.longitudinalMode,
  els.laneCenterMode,
  els.curveSpeedMode,
  els.leadBehaviorMode,
  els.roadEdgeMode,
  els.promptMode,
  els.logMode,
  els.deviceGuardMode,
  els.customInstallUrl,
  els.followGap,
  els.speedOffset,
  els.laneDelay,
  els.curveComfort,
  els.steerSmoothness,
  els.laneBias,
  els.brakeComfort,
  els.promptLeadTime,
  els.modelConfidenceGate
].forEach((input) => {
  input.addEventListener("input", handleInput);
  input.addEventListener("change", handleInput);
});

[
  els.blindSpotDelay,
  els.laneTurnDesire,
  els.coopSteering,
  els.experimentalControls,
  els.stopGoSmoothing,
  els.modelUncertaintyAlert,
  els.reviewLogCapture,
  els.thermalGuard
].forEach((input) => {
  input.addEventListener("change", handleInput);
});

els.targetList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-target]");
  if (!button) return;
  profile.installTarget = button.dataset.target;
  profile.customInstallUrl = "";
  saveProfile();
  writeForm();
  showToast("Install target selected");
});

els.resetProfile.addEventListener("click", () => {
  profile = clone(defaultProfile);
  saveProfile();
  writeForm();
  showToast("Profile reset");
});

els.copyInstallUrl.addEventListener("click", () => {
  copyText(activeInstallUrl(), "Installer URL copied");
});

els.downloadProfile.addEventListener("click", downloadProfile);
els.importButton.addEventListener("click", () => els.importInput.click());
els.importInput.addEventListener("change", (event) => {
  importProfile(event.target.files[0]);
  event.target.value = "";
});

renderLocks();
writeForm();
