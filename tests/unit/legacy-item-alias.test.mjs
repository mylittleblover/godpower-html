import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "acorn";
import vm from "node:vm";
test("deprecated item alias forwards one public command and preserves its result", () => {
  const source = readFileSync("src/runtime/items/attack-legacy.js", "utf8");
  const node = parse(source, { ecmaVersion: "latest" }).body.find(
    (n) => n.type === "FunctionDeclaration" && n.id.name === "legacyUseItem",
  );
  const calls = [],
    result = Object.freeze({ pending: true });
  const context = vm.createContext({
    useItem: (...args) => {
      calls.push(args);
      return result;
    },
  });
  vm.runInContext(source.slice(node.start, node.end), context);
  assert.equal(context.legacyUseItem(14, 2), result);
  assert.deepEqual(calls, [[14, 2]]);
});
