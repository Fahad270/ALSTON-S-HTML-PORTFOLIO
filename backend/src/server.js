import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabases } from "./config/db.js";
import { initModels } from "./models/registry.js";

async function main() {
  await connectDatabases();
  initModels();

  const app = createApp();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`[server] BeeSetu backend listening on :${port}`));
}

main().catch((err) => {
  console.error("[server] failed to start:", err.message);
  process.exit(1);
});
