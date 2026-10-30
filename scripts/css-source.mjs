/* Source spans for conservative CSS maintenance. Never infer reachability from selectors. */
export function scanCssBlocks(source) {
  const blocks = [];
  let cursor = 0;
  function trivia(index) {
    while (index < source.length) {
      if (/\s/.test(source[index])) index++;
      else if (source.startsWith("/*", index)) {
        const end = source.indexOf("*/", index + 2);
        if (end < 0) throw Error("Unclosed CSS comment");
        index = end + 2;
      } else break;
    }
    return index;
  }
  function delimiter(index, wanted, nested = false) {
    let quote = null,
      parens = 0,
      brackets = 0,
      depth = 0;
    for (; index < source.length; index++) {
      const ch = source[index];
      if (quote) {
        if (ch === "\\") index++;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === "\\") {
        index++;
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        continue;
      }
      if (source.startsWith("/*", index)) {
        const end = source.indexOf("*/", index + 2);
        if (end < 0) throw Error("Unclosed CSS comment");
        index = end + 1;
        continue;
      }
      if (ch === "(") parens++;
      else if (ch === ")") parens--;
      if (ch === "[") brackets++;
      else if (ch === "]") brackets--;
      if (parens || brackets) continue;
      if (nested) {
        if (ch === "{") depth++;
        else if (ch === "}") {
          if (!depth) return index;
          depth--;
        }
      } else if (wanted.includes(ch)) return index;
    }
    return source.length;
  }
  while ((cursor = trivia(cursor)) < source.length) {
    const start = cursor,
      open = delimiter(start, "{;");
    if (open === source.length) {
      if (source.slice(start).trim()) throw Error("Incomplete CSS rule");
      break;
    }
    if (source[open] === ";") {
      cursor = open + 1;
      continue;
    }
    const close = delimiter(open + 1, "}", true);
    if (close === source.length) throw Error("Unclosed CSS block");
    blocks.push({
      start,
      open,
      end: close + 1,
      prelude: source.slice(start, open).trim(),
      body: source.slice(open + 1, close),
      line: source.slice(0, start).split("\n").length,
    });
    cursor = close + 1;
  }
  return blocks;
}

export function scanDeclarations(body) {
  const declarations = [];
  let start = 0,
    quote = null,
    depth = 0;
  for (let i = 0; i <= body.length; i++) {
    const ch = body[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "\\") {
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (body.startsWith("/*", i)) {
      const end = body.indexOf("*/", i + 2);
      if (end < 0) throw Error("Unclosed CSS comment");
      i = end + 1;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") depth--;
    if ((ch === ";" && !depth) || i === body.length) {
      const text = body
        .slice(start, i)
        .replace(/^(?:\s|\/\*[\s\S]*?\*\/)+/, "")
        .trim();
      const colon = text.indexOf(":");
      if (colon > 0) {
        const property = text.slice(0, colon).trim();
        // Exclude nesting and at-rules. Custom-property names remain case-sensitive.
        if (/^(?:--[\w-]+|[a-zA-Z-]+)$/.test(property))
          declarations.push({
            start,
            end: ch === ";" ? i + 1 : i,
            property: property.startsWith("--")
              ? property
              : property.toLowerCase(),
            value: text.slice(colon + 1).trim(),
          });
      }
      start = i + 1;
    }
  }
  return declarations;
}
