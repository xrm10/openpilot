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
      device,
      latestProfile: latestProfileMeta()
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
        device,
        changes,
        profile: payload.profile,
        policy: payload.policy
      }, null, 2));

      sendJson(res, 200, {
        ok: true,
        acceptedChanges: changes.length,
        applied: "profile-staged",
        liveVehicleApplyAllowed: false,
        device
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
        device
      });
    } catch (error) {
      sendJson(res, 400, {
        ok: false,
        error: error.message || "Invalid road-state payload"
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
        device
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
      device
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
        device
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
