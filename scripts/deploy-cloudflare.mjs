import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import nextEnv from "@next/env";

const root = fileURLToPath(new URL("../", import.meta.url));
const adapter = fileURLToPath(
  new URL("../node_modules/@opennextjs/cloudflare/dist/cli/index.js", import.meta.url),
);
const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();

async function checkTurnstile() {
  nextEnv.loadEnvConfig(root, false, { info() {}, error() {} });
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim();
  let local = {};
  try { local = parseEnv(readFileSync(new URL("../.dev.vars", import.meta.url), "utf8")); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  const secret = local.TURNSTILE_SECRET_KEY?.trim();
  if (!siteKey || !secret || !/^0x[A-Za-z0-9_-]{20,}$/.test(siteKey) || !/^0x[A-Za-z0-9_-]{20,}$/.test(secret)) {
    throw new Error("Release requires production TURNSTILE_SITE_KEY in ignored .env.local and TURNSTILE_SECRET_KEY in ignored .dev.vars. Test keys and missing configuration cannot be released.");
  }
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: "release-configuration-check" }),
    signal: AbortSignal.timeout(5_000),
  });
  const result = await response.json();
  const codes = result["error-codes"];
  if (!response.ok || result.success !== false || !Array.isArray(codes) || codes.some((code) => !["invalid-input-response", "timeout-or-duplicate"].includes(code)) || !codes.length) {
    throw new Error("Turnstile rejected the production secret configuration; deployment stopped.");
  }
  console.log("Turnstile production keys present; Siteverify rejected the probe token as expected.");
  return { siteKey, secret };
}

function uploadTurnstileSecret(secret) {
  const cli = fileURLToPath(new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url));
  const result = spawnSync(process.execPath, [cli, "secret", "put", "TURNSTILE_SECRET_KEY"], {
    cwd: root, input: secret, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"],
  });
  // Never echo CLI diagnostics from a command receiving a secret.
  if (result.error || result.status !== 0) throw new Error("Could not upload the Turnstile Worker secret; deployment stopped.");
  console.log("Turnstile Worker secret uploaded.");
}

function runAdapter(...args) {
  const result = spawnSync(process.execPath, [adapter, ...args], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Cloudflare ${args[0]} failed; deployment stopped.`);
  }
}

try {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 1 || args[0] !== "--check")) {
    throw new Error("Usage: npm run deploy:cloudflare -- [--check]");
  }
  if (git("branch", "--show-current") !== "main") {
    throw new Error("Deploy from main, not a detached or older checkout.");
  }
  if (git("status", "--porcelain", "--untracked-files=normal")) {
    throw new Error(
      "The workspace has uncommitted changes. Review, commit, and push the complete intended site before deploying.",
    );
  }
  execFileSync("git", ["fetch", "origin", "main"], {
    cwd: root,
    stdio: "inherit",
  });
  const commit = git("rev-parse", "HEAD");
  if (commit !== git("rev-parse", "origin/main")) {
    throw new Error("Local main must match origin/main before deployment.");
  }
  console.log(`Cloudflare release source: main @ ${commit}`);
  const { siteKey, secret } = await checkTurnstile();
  if (!args.includes("--check")) {
    runAdapter("build");
    uploadTurnstileSecret(secret);
    runAdapter("deploy", "--", "--keep-vars", "--var", `TURNSTILE_SITE_KEY:${siteKey}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
