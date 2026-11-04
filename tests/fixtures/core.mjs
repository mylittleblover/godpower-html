import vm from "node:vm";
import { readFileSync } from "node:fs";

const c = vm.createContext({});
vm.runInContext(
  readFileSync("src/domain/identity.js", "utf8") +
    "\n" +
    readFileSync("src/infrastructure/legacy/classroom-repository.js", "utf8") +
    "\n" +
    readFileSync("src/domain/competition/rules.js", "utf8") +
    "\n" +
    readFileSync("src/domain/competition/phase.js", "utf8") +
    "\n" +
    readFileSync("src/domain/items/round-use.js", "utf8") +
    "\n" +
    readFileSync("src/core/reliability.js", "utf8") +
    "\nglobalThis.api=Reliability",
  c,
);
export const core = c.api;

export function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    data,
  };
}
