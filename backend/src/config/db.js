import mongoose from "mongoose";

// One Atlas cluster, two logical databases — approval_platform (main app
// data) and mock_entitylocker (kept deliberately separate so it's a clean
// swap-out point when a real EntityLocker API exists later).
let mainConnection = null;
let entityLockerConnection = null;

export async function connectDatabases() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Copy .env.example to .env and fill it in.");

  const mainDbName = process.env.MAIN_DB_NAME || "approval_platform";
  const elDbName = process.env.ENTITYLOCKER_DB_NAME || "mock_entitylocker";

  mainConnection = mongoose.createConnection(`${uri}${mainDbName}`);
  entityLockerConnection = mongoose.createConnection(`${uri}${elDbName}`);

  await Promise.all([
    new Promise((res, rej) => mainConnection.once("open", res).once("error", rej)),
    new Promise((res, rej) => entityLockerConnection.once("open", res).once("error", rej)),
  ]);

  console.log(`[db] connected: ${mainDbName}, ${elDbName}`);
  return { mainConnection, entityLockerConnection };
}

export function getMainConnection() {
  if (!mainConnection) throw new Error("Database not connected yet — call connectDatabases() first.");
  return mainConnection;
}

export function getEntityLockerConnection() {
  if (!entityLockerConnection) throw new Error("Database not connected yet — call connectDatabases() first.");
  return entityLockerConnection;
}
