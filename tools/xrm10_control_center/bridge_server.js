const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = ""] = arg.split("=");
  return [key.replace(/^--/, ""), value];
}));
const host = args.get("host") || "0.0.0.0";
const port = Number(args.get("port") || 8787);
const stateDir = path.join(root, ".sync_state");
const latestProfilePath = path.join(stateDir, "latest_profile.json");

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

  serveFile(req, res);
});

server.listen(port, host, () => {
  console.log(`XRM10 bridge listening on http://${host}:${port}/`);
});
