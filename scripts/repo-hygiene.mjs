/** Read-only repository hygiene inventory. Nothing here deletes release or test evidence. */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function classifyTrackedFiles(entries) {
  const summary = {};
  for (const entry of entries) {
    const category = entry.path.split("/")[0];
    summary[category] ??= { files: 0, bytes: 0 };
    summary[category].files += 1;
    summary[category].bytes += entry.bytes;
  }
  return summary;
}

export function findCommentOnlyScripts(entries) {
  return entries
    .filter(({ path }) => /^src\/script\/\d+\.js$/.test(path))
    .filter(({ content }) =>
      !content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/[^\n]*$/gm, "")
        .trim(),
    )
    .map(({ path }) => path)
    .sort();
}

export function manifestIssues(template, manifest, availablePaths) {
  const blocks = [
    ...template.matchAll(/<(script|style)\b([^>]*)>\s*@@SOURCE:([^@]+)@@\s*<\/\1>/g),
  ].map(([, type, attributes, path]) => ({ type, path, attributes }));
  const resources = [
    ...new Set(
      [...template.matchAll(/@@RESOURCE:([^@]+)@@/g)].map((match) => match[1]),
    ),
  ];
  const issues = [];
  if (JSON.stringify(blocks) !== JSON.stringify(manifest.blocks))
    issues.push("Source manifest drift");
  if (
    JSON.stringify([...resources].sort()) !==
    JSON.stringify([...(manifest.resources ?? [])].sort())
  )
    issues.push("Resource manifest drift");
  for (const { path } of blocks)
    if (!availablePaths.has("src/" + path)) issues.push("Missing source: " + path);
  for (const path of resources)
    if (!availablePaths.has("src/resources/" + path))
      issues.push("Missing resource: " + path);
  return issues;
}

function inspect() {
  const paths = execFileSync("git", ["ls-files", "-z"], {
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
  const entries = paths
    .filter((path) => existsSync(path))
    .map((path) => ({ path, bytes: statSync(path).size }));
  const present = new Set(entries.map(({ path }) => path));
  const source = entries
    .filter(({ path }) => /^src\/script\/\d+\.js$/.test(path))
    .map(({ path }) => ({ path, content: readFileSync(path, "utf8") }));
  const issues = manifestIssues(
    readFileSync("src/index.template.html", "utf8"),
    JSON.parse(readFileSync("src/manifest.json", "utf8")),
    present,
  );
  const result = {
    trackedFiles: entries.length,
    categories: classifyTrackedFiles(entries),
    commentOnlyLegacyScripts: findCommentOnlyScripts(source),
    sourceManifestIssues: issues,
    note: "Comment-only files are removal candidates; preserve screenshot baselines and other evidence until consumers are checked.",
  };
  console.log(JSON.stringify(result, null, 2));
  if (issues.length) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  inspect();
