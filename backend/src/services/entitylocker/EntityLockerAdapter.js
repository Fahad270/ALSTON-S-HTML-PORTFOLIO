import { MockEntityLockerService } from "./MockEntityLockerService.js";

// Swap MockEntityLockerService for a RealEntityLockerService later without
// touching any controller or route — that's the whole point of this file.
export const EntityLockerAdapter = {
  startConnection: (entityType) => MockEntityLockerService.start(entityType),
  verifyConnection: () => MockEntityLockerService.verify(),
  getIssuedDocuments: (entityId) => MockEntityLockerService.getDocuments(entityId),
  getDocument: (entityId, documentType) => MockEntityLockerService.getDocument(entityId, documentType),
};
