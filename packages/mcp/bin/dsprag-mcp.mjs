#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  clearRuntimeState,
  createMcpServer,
  getPaths,
  getRuntimeStatus,
  readConfig,
  writeConfig,
  writeRuntimeState,
} from "../src/index.mjs";

function parsePrimitive(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value !== "" && Number.isFinite(Number(value))) return Number(value);
  return value;
}

function printUsage() {
  console.log(`Usage: dsprag-mcp <command>

Commands:
  init [--force]                 Create .dsprag/mcp.config.json
  config show                    Print effective config
  config path                    Print config file path
  config get <key>               Read a config key
  config set <key> <value>       Write a config key
  start                          Start MCP runtime in background
  stop                           Stop MCP runtime
`);
}

async function waitForLock(lockPath, timeoutMs = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await fs.access(lockPath);
      return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  return false;
}

async function commandInit(args) {
  const force = args.includes("--force");
  const cwd = process.cwd();
  const paths = getPaths(cwd);
  const existing = await readConfig(cwd);

  try {
    await fs.access(paths.config);
    if (!force) {
      console.log(`Config already exists at ${paths.config}`);
      return 0;
    }
  } catch {
    // No config file yet.
  }

  await writeConfig(existing, cwd);
  console.log(`Initialized MCP config at ${paths.config}`);
  return 0;
}

async function commandConfig(args) {
  const action = args[0];
  const cwd = process.cwd();
  const paths = getPaths(cwd);
  const config = await readConfig(cwd);

  if (action === "show" || !action) {
    console.log(JSON.stringify(config, null, 2));
    return 0;
  }
  if (action === "path") {
    console.log(paths.config);
    return 0;
  }
  if (action === "get") {
    const key = args[1];
    if (!key) throw new Error("Missing key for config get");
    const value = config[key];
    if (value === undefined) return 1;
    console.log(typeof value === "object" ? JSON.stringify(value) : String(value));
    return 0;
  }
  if (action === "set") {
    const key = args[1];
    const value = args[2];
    if (!key || value === undefined) throw new Error("Usage: config set <key> <value>");
    const next = { ...config, [key]: parsePrimitive(value) };
    const saved = await writeConfig(next, cwd);
    console.log(JSON.stringify(saved, null, 2));
    return 0;
  }

  throw new Error(`Unknown config action: ${action}`);
}

async function commandStart() {
  const cwd = process.cwd();
  const status = await getRuntimeStatus(cwd);
  if (status.running) {
    console.log(`MCP runtime already running (pid: ${status.pid})`);
    return 0;
  }

  await clearRuntimeState(cwd);
  await writeConfig(await readConfig(cwd), cwd);
  const thisFile = fileURLToPath(import.meta.url);
  const child = spawn(process.execPath, [thisFile, "__run-server", cwd], {
    cwd,
    detached: true,
    stdio: "ignore",
  });
  child.unref();

  const lockReady = await waitForLock(getPaths(cwd).lock, 3000);
  if (!lockReady) {
    console.error("Failed to confirm runtime startup.");
    return 1;
  }

  const nextStatus = await getRuntimeStatus(cwd);
  console.log(`MCP runtime started (pid: ${nextStatus.pid ?? "unknown"})`);
  return 0;
}

async function commandStop() {
  const cwd = process.cwd();
  const status = await getRuntimeStatus(cwd);
  if (!status.running || !status.pid) {
    await clearRuntimeState(cwd);
    console.log("MCP runtime already stopped");
    return 0;
  }

  process.kill(status.pid, "SIGTERM");
  let retries = 40;
  while (retries > 0) {
    const next = await getRuntimeStatus(cwd);
    if (!next.running) break;
    await new Promise((resolve) => setTimeout(resolve, 50));
    retries -= 1;
  }
  await clearRuntimeState(cwd);
  console.log("MCP runtime stopped");
  return 0;
}

async function runServer(cwd) {
  const config = await readConfig(cwd);
  const server = createMcpServer(config);
  await server.start();
  await writeRuntimeState({ cwd, config, pid: process.pid });

  let shuttingDown = false;
  const shutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    await server.stop();
    await clearRuntimeState(cwd);
    process.exit(0);
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "--help" || command === "-h") {
    printUsage();
    return 0;
  }
  if (command === "__run-server") {
    const cwd = args[0] ? path.resolve(args[0]) : process.cwd();
    await runServer(cwd);
    return 0;
  }
  if (command === "init") return commandInit(args);
  if (command === "config") return commandConfig(args);
  if (command === "start") return commandStart();
  if (command === "stop") return commandStop();
  throw new Error(`Unknown command: ${command}`);
}

main()
  .then((code) => {
    if (Number.isInteger(code) && code !== 0) process.exitCode = code;
  })
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });
