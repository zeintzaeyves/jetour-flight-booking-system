// Fails if an import only resolves because the filesystem ignores letter case.
//   npm run check:case
// Windows and macOS find "FinalCta.tsx" when git tracks "FinalCTA.tsx"; Linux (Vercel, CI) does not,
// so the build breaks only after you push. This resolves every import against the names git
// actually tracks, which is what a Linux checkout contains.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tracked = new Set(
  execSync("git ls-files", { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean)
);
const suffixes = ["", ".ts", ".tsx", ".js", ".mjs", ".css", ".json", "/index.ts", "/index.tsx"];
const resolves = (p) => suffixes.some((s) => tracked.has(p + s));
const problems = [];

// 1. Each import must resolve to a tracked path with exactly the same letter case.
for (const file of tracked) {
  if (!/\.(tsx?|mjs|js)$/.test(file) || !fs.existsSync(path.join(root, file))) continue;
  const src = fs.readFileSync(path.join(root, file), "utf8");
  for (const m of src.matchAll(/(?:from|import)\s*\(?\s*["'](@\/[^"']+|\.{1,2}\/[^"']+)["']/g)) {
    const spec = m[1];
    const target = spec.startsWith("@/")
      ? spec.slice(2)
      : path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
    if (resolves(target)) continue;
    const near = [...tracked].find((t) => t.toLowerCase().startsWith(target.toLowerCase()));
    problems.push(`${file}: import "${spec}"${near ? ` but git tracks "${near}"` : " matches no tracked file"}`);
  }
}

// 2. A tracked name must match the name on disk (otherwise git still has the old case).
for (const file of tracked) {
  const dir = path.dirname(path.join(root, file));
  if (!fs.existsSync(dir)) continue;
  const names = fs.readdirSync(dir);
  const base = path.basename(file);
  const onDisk = names.find((n) => n.toLowerCase() === base.toLowerCase());
  if (onDisk && onDisk !== base) {
    problems.push(`git tracks "${file}" but the file on disk is "${onDisk}"; use a two-step git mv to fix the case`);
  }
}

if (problems.length) {
  console.error("Case-sensitivity problems (these build on Windows but fail on Linux):\n");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("check:case ok: all imports match tracked file names.");
