/**
 * Lightweight repository scanner for gambling-related keywords & potential PII collection sites.
 * Run from the repo root: `node packages/shared/dist/utils/auditScan.js` (build first or run with ts-node)
 *
 * This tool is a helper — manually review hits and create follow-up issues/PRs.
 */
import fs from "fs";
import path from "path";

const repoRoot = path.resolve(__dirname, "../../../../"); // adjust if needed

const gamblingKeywords = [
  "odds",
  "bet",
  "betting",
  "gambling",
  "wager",
  "deposit",
  "withdraw",
  "casino",
  "oddsApi",
  "odds_api",
  "bettingTips",
];

const piiKeywords = [
  "email",
  "phone",
  "firstName",
  "lastName",
  "address",
  "ssn",
  "socialSecurity",
];

function walk(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (["node_modules", ".git", ".next", "dist", "build"].includes(f))
        continue;
      walk(full, fileList);
    } else {
      if (/\.(ts|tsx|js|jsx|json|md)$/i.test(f)) fileList.push(full);
    }
  }
  return fileList;
}

function scan() {
  const files = walk(repoRoot);
  const results: { file: string; matches: string[] }[] = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const matches: string[] = [];
    for (const kw of gamblingKeywords) {
      if (new RegExp("\\b" + kw + "\\b", "i").test(content)) matches.push(kw);
    }
    for (const kw of piiKeywords) {
      if (new RegExp("\\b" + kw + "\\b", "i").test(content))
        matches.push(`PII:${kw}`);
    }
    if (matches.length)
      results.push({ file: path.relative(repoRoot, file), matches });
  }
  console.log(JSON.stringify(results, null, 2));
}

if (require.main === module) scan();

export {};
