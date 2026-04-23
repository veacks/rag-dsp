import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createServer as createHttpServer } from "node:http";

const DSPRAG_DIR = ".dsprag";
const CONFIG_FILE = "mcp.config.json";
const PID_FILE = "mcp.pid";
const LOCK_FILE = "mcp.lock";
const DEFAULT_CONFIG = Object.freeze({
  host: "127.0.0.1",
  port: 0,
  name: "dsprag-mcp",
});

export function getPaths(cwd = process.cwd()) {
  const root = path.resolve(cwd, DSPRAG_DIR);
  return {
    cwd: path.resolve(cwd),
    dir: root,
    config: path.join(root, CONFIG_FILE),
    pid: path.join(root, PID_FILE),
    lock: path.join(root, LOCK_FILE),
  };
}

export async function ensureProjectDir(cwd = process.cwd()) {
  const paths = getPaths(cwd);
  await fs.mkdir(paths.dir, { recursive: true });
  return paths;
}

function normalizeConfig(input = {}) {
  const merged = { ...DEFAULT_CONFIG, ...input };
  const port = Number(merged.port);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid port in config: ${merged.port}`);
  }
  return {
    host: String(merged.host || DEFAULT_CONFIG.host),
    port,
    name: String(merged.name || DEFAULT_CONFIG.name),
  };
}

export async function readConfig(cwd = process.cwd()) {
  const paths = await ensureProjectDir(cwd);
  try {
    const content = await fs.readFile(paths.config, "utf8");
    return normalizeConfig(JSON.parse(content));
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return { ...DEFAULT_CONFIG };
    }
    throw error;
  }
}

export async function writeConfig(config, cwd = process.cwd()) {
  const paths = await ensureProjectDir(cwd);
  const normalized = normalizeConfig(config);
  await fs.writeFile(paths.config, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function isProcessAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function readPidFile(pidPath) {
  try {
    const raw = await fs.readFile(pidPath, "utf8");
    const parsed = Number.parseInt(raw.trim(), 10);
    return Number.isInteger(parsed) ? parsed : null;
  } catch (error) {
    if (error && error.code === "ENOENT") return null;
    throw error;
  }
}

export async function getRuntimeStatus(cwd = process.cwd()) {
  const paths = getPaths(cwd);
  const pid = await readPidFile(paths.pid);
  const running = isProcessAlive(pid ?? -1);
  return { paths, pid, running };
}

export async function clearRuntimeState(cwd = process.cwd()) {
  const paths = getPaths(cwd);
  await Promise.all([
    fs.rm(paths.pid, { force: true }),
    fs.rm(paths.lock, { force: true }),
  ]);
}

export async function writeRuntimeState({ cwd = process.cwd(), pid = process.pid, config }) {
  const paths = await ensureProjectDir(cwd);
  await fs.writeFile(paths.pid, `${pid}\n`, "utf8");
  await fs.writeFile(
    paths.lock,
    `${JSON.stringify({ pid, startedAt: new Date().toISOString(), config }, null, 2)}\n`,
    "utf8",
  );
  return paths;
}

export function createMcpServer(config = {}) {
  const normalizedConfig = normalizeConfig(config);
  let server = null;
  let started = false;

  return {
    config: normalizedConfig,
    async start() {
      if (started && server) {
        return { host: normalizedConfig.host, port: normalizedConfig.port, alreadyRunning: true };
      }

      server = createHttpServer((req, res) => {
        if (req.url === "/health") {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ ok: true, name: normalizedConfig.name }));
          return;
        }
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ name: normalizedConfig.name, status: "running" }));
      });

      await new Promise((resolve, reject) => {
        const onError = (error) => reject(error);
        server.once("error", onError);
        server.listen(normalizedConfig.port, normalizedConfig.host, () => {
          server.off("error", onError);
          resolve();
        });
      });

      started = true;
      const addr = server.address();
      const boundPort = typeof addr === "object" && addr ? addr.port : normalizedConfig.port;
      return { host: normalizedConfig.host, port: boundPort, alreadyRunning: false };
    },
    async stop() {
      if (!server || !started) {
        return { stopped: false, alreadyStopped: true };
      }
      const currentServer = server;
      await new Promise((resolve, reject) => {
        currentServer.close((error) => (error ? reject(error) : resolve()));
      });
      server = null;
      started = false;
      return { stopped: true, alreadyStopped: false };
    },
  };
}

export async function start(cwd = process.cwd()) {
  const config = await readConfig(cwd);
  const server = createMcpServer(config);
  const runtime = await server.start();
  await writeRuntimeState({ cwd, config });
  return {
    ...runtime,
    config,
    server,
  };
}

export async function stop(cwd = process.cwd()) {
  const status = await getRuntimeStatus(cwd);
  if (!status.running || !status.pid) {
    await clearRuntimeState(cwd);
    return { stopped: false, alreadyStopped: true };
  }

  process.kill(status.pid, "SIGTERM");
  let retries = 40;
  while (retries > 0 && isProcessAlive(status.pid)) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    retries -= 1;
  }
  await clearRuntimeState(cwd);
  return { stopped: true, alreadyStopped: false };
}

export const defaults = { ...DEFAULT_CONFIG };
export const constants = { DSPRAG_DIR, CONFIG_FILE, PID_FILE, LOCK_FILE };
export const internals = { isProcessAlive, normalizeConfig, fileExists };
