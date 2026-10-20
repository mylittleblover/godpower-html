import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

export async function createUiOwnershipReport() {
  const manifest = JSON.parse(await read("src/manifest.json"));
  const template = await read("src/index.template.html");
  const blocks = [];
  for (const [order, block] of manifest.blocks.entries()) {
    const source = await read(`src/${block.path}`);
    const record = {
      order,
      type: block.type,
      path: block.path,
      attributes: block.attributes || "",
      bytes: Buffer.byteLength(source),
    };
    if (block.type === "script") {
      record.globalBindings = [
        ...source.matchAll(
          /(?:^|\n)\s*(?:function\s+([\w$]+)|(?:const|let|var)\s+([\w$]+)\s*=)/g,
        ),
      ].map((match) => match[1] || match[2]);
      record.lifecycleCalls = {
        addEventListener: (source.match(/\.addEventListener\s*\(/g) || [])
          .length,
        removeEventListener: (source.match(/\.removeEventListener\s*\(/g) || [])
          .length,
        timers: (
          source.match(
            /\b(?:setTimeout|setInterval|requestAnimationFrame)\s*\(/g,
          ) || []
        ).length,
        cancelers: (
          source.match(
            /\b(?:clearTimeout|clearInterval|cancelAnimationFrame)\s*\(/g,
          ) || []
        ).length,
        observers: (
          source.match(
            /\bnew\s+(?:MutationObserver|ResizeObserver|IntersectionObserver)\b/g,
          ) || []
        ).length,
      };
    } else if (block.type === "style") {
      const selectors = [];
      const selectorProperties = [];
      for (const match of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const rawSelector = match[1].trim();
        if (rawSelector.startsWith("@")) continue;
        const properties = [
          ...match[2].matchAll(/(?:^|;)\s*([\w-]+)\s*:/g),
        ].map((m) => m[1]);
        for (const selector of rawSelector
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)) {
          selectors.push(selector);
          selectorProperties.push(
            ...properties.map((property) => ({ selector, property })),
          );
        }
      }
      record.selectorCount = selectors.length;
      record.selectorPropertyCount = selectorProperties.length;
      record.repeatedSelectorCandidates = [
        ...new Set(
          selectors.filter(
            (selector, index) => selectors.indexOf(selector) !== index,
          ),
        ),
      ];
      record.selectorParserNote =
        "Lexical CSS block scan; nested at-rules/cascade/media conditions require browser CSSOM review before deletion decisions.";
    }
    blocks.push(record);
  }

  const ids = [...template.matchAll(/\bid="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const roots = [
    ...template.matchAll(/<div\b[^>]*\bid="(view-[^"]+)"[^>]*>/g),
  ].map((match) => match[1]);
  const inlineHandlers = [
    ...template.matchAll(
      /\bon(?:click|change|input|keydown|keyup|submit)="([^"]+)"/g,
    ),
  ].map((match) => match[1]);
  const scriptSources = blocks.filter((block) => block.type === "script");
  const cssSources = blocks.filter((block) => block.type === "style");
  const repeatedBindings = new Map();
  for (const block of scriptSources) {
    for (const name of block.globalBindings || []) {
      repeatedBindings.set(name, [
        ...(repeatedBindings.get(name) || []),
        block.path,
      ]);
    }
  }
  const topLevelBindingCandidates = Object.fromEntries(
    [...repeatedBindings].filter(([, paths]) => paths.length > 1),
  );
  const stylePaths = (await readdir(new URL("src/style/", root))).filter(
    (path) => path.endsWith(".css"),
  );
  const cssContents = await Promise.all(
    stylePaths.map((path) => read(`src/style/${path}`)),
  );

  return {
    generatedBy: "scripts/ui-ownership.mjs",
    method:
      "manifest ownership plus lexical DOM/JS/CSS inventory; findings are candidates, not proof of runtime reachability or visual defects",
    manifestBlocks: blocks.length,
    scripts: scriptSources,
    styles: cssSources,
    styleFileCount: stylePaths.length,
    cssImportantCount: cssContents.reduce(
      (total, source) => total + (source.match(/!important\b/g) || []).length,
      0,
    ),
    pages: roots,
    pageRootCount: roots.length,
    staticIdCount: ids.length,
    duplicateStaticIds: [
      ...new Set(ids.filter((id, index) => ids.indexOf(id) !== index)),
    ],
    inlineHandlerCount: inlineHandlers.length,
    inlineHandlerExpressions: [...new Set(inlineHandlers)].sort(),
    repeatedTopLevelBindingCandidates: topLevelBindingCandidates,
    caveats: [
      "Repeated selectors are not automatically redundant: media queries, pseudo-states, source order and runtime DOM may change meaning.",
      "Lexical timer/listener counts do not establish ownership, reachability, or leak behavior; lifecycle tests must use the browser.",
      "Inline handler counts are source occurrences, not a count of reachable UI controls.",
    ],
  };
}

if (
  process.argv[1] &&
  new URL(`file://${process.argv[1]}`).href === import.meta.url
) {
  const report = await createUiOwnershipReport();
  const target = process.argv.includes("--output")
    ? process.argv[process.argv.indexOf("--output") + 1]
    : "artifacts/ui-governance-m0/ownership.json";
  await mkdir(dirname(resolve(target)), { recursive: true });
  await writeFile(target, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    JSON.stringify({
      output: target,
      manifestBlocks: report.manifestBlocks,
      pageRootCount: report.pageRootCount,
      staticIdCount: report.staticIdCount,
      inlineHandlerCount: report.inlineHandlerCount,
    }),
  );
}
