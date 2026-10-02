import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import businessProfileRoutes from "./routes/businessProfileRoutes.js";
import digilockerRoutes from "./routes/digilockerRoutes.js";
import entitylockerRoutes from "./routes/entitylockerRoutes.js";
import kyaRoutes from "./routes/kyaRoutes.js";
import consentRoutes from "./routes/consentRoutes.js";
import documentsRoutes from "./routes/documentsRoutes.js";
import miscRoutes from "./routes/miscRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export function createApp({ mongoEnabled = false } = {}) {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (req, res) =>
    res.json({ success: true, data: { status: "ok", mongo: mongoEnabled, adminStore: "static-json" } })
  );

  // Local JSON-backed admin console (no cloud DB required)
  app.use("/api/admin", adminRoutes);

  if (mongoEnabled) {
    app.use("/api/auth", authRoutes);
    app.use("/api/business-profile", businessProfileRoutes);
    app.use("/api/integrations/digilocker", digilockerRoutes);
    app.use("/api/integrations/entitylocker", entitylockerRoutes);
    app.use("/api/kya", kyaRoutes);
    app.use("/api/consent", consentRoutes);
    app.use("/api/documents", documentsRoutes);
    app.use("/api", miscRoutes);
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
