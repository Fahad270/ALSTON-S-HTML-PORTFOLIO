import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../../data/admin-db.json");

let cache = null;

function readRaw() {
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw);
}

export function getDb() {
  if (!cache) cache = readRaw();
  return cache;
}

export function saveDb(next) {
  cache = next;
  fs.writeFileSync(DB_PATH, JSON.stringify(next, null, 2), "utf8");
  return cache;
}

export function mutateDb(mutator) {
  const db = structuredClone(getDb());
  const result = mutator(db);
  saveDb(db);
  return result === undefined ? db : result;
}

export function reloadDb() {
  cache = readRaw();
  return cache;
}
