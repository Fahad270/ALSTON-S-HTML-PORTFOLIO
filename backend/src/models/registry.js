import { buildModels, buildEntityLockerModels } from "./index.js";

let models = null;
let entityLockerModels = null;

export function initModels() {
  models = buildModels();
  entityLockerModels = buildEntityLockerModels();
  return { models, entityLockerModels };
}

export function getModels() {
  if (!models) throw new Error("Models not initialised — call initModels() after connectDatabases().");
  return models;
}

export function getEntityLockerModels() {
  if (!entityLockerModels) throw new Error("EntityLocker models not initialised.");
  return entityLockerModels;
}
