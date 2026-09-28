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
**Blockchain:** Private EVM (Hardhat/Anvil), Solidity smart contract for checkpoint anchoring  
**DevOps:** Git, GitHub, local development

---

## Features

### User Side (user-side branch)
- **Identity Verification** - DigiLocker integration + manual signup
- **Business Profile** - Udyam, GSTIN, PAN, sector, location
- **Document Vault** - Upload, manage, verify compliance documents
- **Application Tracker** - Real-time status across departments
- **Audit Trail** - Tamper-evident hash chain with blockchain anchoring
- **ML Timeline Predictor** - Estimate approval timelines
- **SLA Escalations** - Raise escalations for delayed approvals
- **KYA Dashboard** - Know Your Approvals (department-wise requirements)
- **Gov RAG Assistant** - Policy/compliance Q&A with grounded answers
- **Incentive Scheme Matching** - Applicable Maharashtra schemes

### Admin Side (admin-side branch)
- Department officer dashboard
- Approval workflow management
- SLA monitoring and breach alerts
- Compliance analytics
- Document verification tools
- Audit log access

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Git

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Smart Contract (Private EVM)
```bash
cd backend/contracts
npx hardhat compile
npx hardhat node
# In another terminal:
npx hardhat run scripts/deploy-audit.js --network localhost
```

### Environment Variables
Key variables (see `.env.example`):
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `EVM_RPC_URL` - Private EVM RPC (e.g., http://127.0.0.1:8545)
- `EVM_PRIVATE_KEY` - Deployer account private key
- `AUDIT_CONTRACT_ADDRESS` - Deployed contract address
- `CHECKPOINT_PRIVATE_KEY` - Ed25519 private key (base64)
- `CHECKPOINT_PUBLIC_KEY` - Ed25519 public key (base64)
- `AUDIT_CHECKPOINT_INTERVAL` - Events per checkpoint (default: 10)

---

## Demo Script (2-Minute Prototype Video)

| Time | Page/Feature | Script |
|------|--------------|--------|
| 0:00-0:10 | **Landing Page** | "PragatiSetu - one profile, one intelligent approval journey for Maharashtra businesses." |
| 0:10-0:25 | **Identity Gate** | "Choose DigiLocker for instant KYC or manual signup - both converge to the same workflow." |
| 0:25-0:40 | **Business Profile** | "Enter Udyam, GSTIN, PAN, sector - auto-fetches applicable approvals." |
| 0:40-0:55 | **Document Vault** | "Upload PAN, Udyam, consent letters - OCR verification, expiry tracking." |
| 0:55-1:10 | **Application Tracker** | "Single view: user ↔ business ↔ application ↔ department approvals." |
| 1:10-1:25 | **Audit Trail** | "Every action creates a hash event. Click 'Verify Chain' - cryptographic proof of integrity." |
| 1:25-1:40 | **ML Predictor** | "Select sector/district/investment - get estimated timeline with confidence score." |
| 1:40-1:55 | **Gov RAG Assistant** | "Ask: 'What's the Fire NOC process?' - gets grounded answers with policy citations." |
| 1:55-2:00 | **Closing** | "PragatiSetu - where every clearance converges. Team BEE6, ID 125181." |

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