/* Multiple sources may share one script/style execution unit. Never split the tag implicitly. */
export function parseSourceBlocks(template) {
  const blocks = [];
  let group = 0;
  for (const [, type, attributes, body] of template.matchAll(
    /<(script|style)\b([^>]*)>([\s\S]*?)<\/\1>/g,
  )) {
    const sources = [...body.matchAll(/@@SOURCE:([^@]+)@@/g)];
    if (!sources.length) continue;
    if (body.replace(/@@SOURCE:[^@]+@@/g, "").trim())
      throw Error("Mixed source and inline content in execution group");
    const executionGroup = `${type}-${group++}`;
    for (const [, path] of sources)
      blocks.push({
        type,
        path,
        attributes,
        ...(sources.length > 1 ? { executionGroup } : {}),
      });
  }
  return blocks;
}
