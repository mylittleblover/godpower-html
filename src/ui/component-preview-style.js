/* Preserve authored declarations, including var() shorthands. CSSOM cssText is not a lossless serializer. */
const ComponentPreviewStyle = Object.freeze({
  scope(text) {
    const stack = [{ mode: "rules", start: 0 }];
    let output = "";
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === "\\") {
        output += text.slice(i, i + 2);
        i++;
        continue;
      }
      if (text.startsWith("/*", i)) {
        const end = text.indexOf("*/", i + 2);
        const stop = end < 0 ? text.length : end + 2;
        output += text.slice(i, stop);
        i = stop - 1;
        continue;
      }
      if (ch === '"' || ch === "'") {
        let end = i + 1;
        while (end < text.length) {
          if (text[end] === "\\") end += 2;
          else if (text[end++] === ch) break;
        }
        output += text.slice(i, end);
        i = end - 1;
        continue;
      }
      const context = stack.at(-1);
      if (ch === "{") {
        const prelude = text
          .slice(context.start, i)
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .trim();
        const group =
          context.mode === "rules" &&
          /^@(?:media|supports|container|layer|scope|starting-style|(?:-webkit-)?keyframes)\b/i.test(
            prelude,
          );
        stack.push({ mode: group ? "rules" : "declarations", start: i + 1 });
      } else if (ch === "}") {
        if (stack.length > 1) stack.pop();
        stack.at(-1).start = i + 1;
      } else if (ch === ";" && context.mode === "rules") context.start = i + 1;
      if (
        context.mode === "rules" &&
        text.startsWith(":root", i) &&
        !/[\w-]/.test(text[i + 5] || "") &&
        !text
          .slice(context.start, i)
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .trim()
          .startsWith("@")
      ) {
        output += ":host";
        i += 4;
      } else output += ch;
    }
    return output;
  },
});
