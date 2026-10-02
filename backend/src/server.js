import "dotenv/config";
import { createApp } from "./app.js";

async function main() {
  const uri = process.env.MONGODB_URI;
  let mongoEnabled = false;

  if (uri) {
    try {
      const { connectDatabases } = await import("./config/db.js");
      const { initModels } = await import("./models/registry.js");
      await connectDatabases();
      initModels();
      mongoEnabled = true;
      console.log("[server] MongoDB connected — citizen APIs enabled");
    } catch (err) {
      console.warn("[server] MongoDB unavailable, running admin static store only:", err.message);
    }
  } else {
    console.log("[server] No MONGODB_URI — admin panel using local JSON store (backend/data/admin-db.json)");
  }

  const app = createApp({ mongoEnabled });
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`[server] PragatiSetu backend listening on :${port}`));
}

main().catch((err) => {
  console.error("[server] failed to start:", err.message);
  process.exit(1);
});
