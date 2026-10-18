import { execFileSync } from "node:child_process";
export function sourceAt(ref) {
  const read = (path) =>
    execFileSync("git", ["show", ref + ":src/" + path], {
      encoding: "utf8",
      maxBuffer: 16e6,
    });
  let html = read("index.template.html");
  for (const m of [...html.matchAll(/@@SOURCE:([^@]+)@@/g)])
    html = html.replace(m[0], read(m[1]));
  for (const path of new Set(
    [...html.matchAll(/@@RESOURCE:([^@]+)@@/g)].map((m) => m[1]),
  ))
    html = html.replaceAll(`@@RESOURCE:${path}@@`, read("resources/" + path));
  if (/@@(?:SOURCE|RESOURCE):/.test(html))
    throw Error("unresolved baseline source");
  if (html.includes("@@VERSION@@")) {
    const pkg = JSON.parse(
      execFileSync("git", ["show", ref + ":package.json"], {
        encoding: "utf8",
      }),
    );
    html = html.replaceAll("@@VERSION@@", pkg.version);
  }
  return html;
}
