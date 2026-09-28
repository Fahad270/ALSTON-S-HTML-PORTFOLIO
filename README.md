# BEE6 - PragatiSetu

**Team ID:** 125181  
**Team Name:** BEE6

---

## Project Overview

PragatiSetu is a unified approval and compliance platform for businesses in Maharashtra. It streamlines the process of obtaining licenses, permits, and approvals from multiple government departments through a single digital interface with tamper-evident audit trails.

---

## Branch Structure

| Branch | Purpose |
|--------|---------|
| `user-side` | Main branch - User-facing application (applicant portal, document vault, application tracker, audit trail) |
| `admin-side` | Admin/officer dashboard - Department workflows, approval management, SLA monitoring, compliance analytics |

---

## Tech Stack

**Frontend:** React 19 + Vite, Tailwind CSS, Lucide React, React Router  
**Backend:** Node.js + Express, MongoDB (Mongoose), JWT Authentication  
**Audit System:** SHA-256 hash chaining, Ed25519 signatures, periodic checkpoints  
**Blockchain:** Private EVM , Solidity smart contract for checkpoint anchoring  


---



## API Endpoints (Key)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/audit` | Fetch audit events (user-scoped) |
| GET | `/api/audit/verify` | Verify hash chain integrity |
| GET | `/api/audit/checkpoints` | List blockchain-anchored checkpoints |
| GET | `/api/applications` | User applications |
| GET | `/api/applications/:id/tracker` | Application tracker with audit ledger |

---

## Audit Architecture

1. **Event Creation** - Every user action (upload, approve, reject) creates `AuditEvent` with SHA-256 hash
2. **Hash Chain** - Each event links to previous via `previousHash` → immutable chain
3. **Checkpoints** - Every 10 events: create `Checkpoint` with chain head hash
4. **Signing** - Checkpoint signed with Ed25519 private key
5. **Anchoring** - Checkpoint submitted to private EVM via `AuditCheckpoint.sol`
6. **Verification** - Recalculate chain, compare to latest on-chain checkpoint, verify signature

---

## License

Proprietary - Team BEE6 (ID: 125181)
