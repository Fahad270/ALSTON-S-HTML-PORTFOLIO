import { EntityLockerAdapter } from "../entitylocker/EntityLockerAdapter.js";
import { getModels } from "../../models/registry.js";
import { DEMO_ENTITY_ID } from "../../mock/mockEntityLockerData.js";

export const DocumentSourceRouter = {
  async getDocuments(userId, businessId, source) {
    if (source === "ENTITYLOCKER") {
      const docs = await EntityLockerAdapter.getIssuedDocuments(DEMO_ENTITY_ID);
      return docs.map((d) => ({ documentType: d.documentType, name: d.documentName, source: "ENTITYLOCKER" }));
    }
    if (source === "SETU_VAULT") {
      const { DocumentMetadata } = getModels();
      const docs = await DocumentMetadata.find({ userId, businessId, source: "SETU_VAULT" }).lean();
      return docs.map((d) => ({ documentType: d.documentType, name: d.fileName, source: "SETU_VAULT" }));
    }
    throw new Error(`Unknown document source: ${source}`);
  },
};
