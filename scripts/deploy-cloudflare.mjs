import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const adapter = fileURLToPath(
  new URL("../node_modules/@opennextjs/cloudflare/dist/cli/index.js", import.meta.url),
);
const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();

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
  if (!args.includes("--check")) {
    runAdapter("build");
    runAdapter("deploy", "--", "--keep-vars");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
