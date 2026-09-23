# BeeSetu

SIH 2026 · PS 26130 — Unified Approval & Compliance Platform.

## What's real vs mocked in this build

**Real and working, if you supply a MongoDB Atlas URI:**
- Express + Mongoose backend, two logical databases on one cluster (`approval_platform`, `mock_entitylocker`)
- Signup → mock OTP (always `1111`) → JWT-issued signin
- **DigiLocker identity mock** (`/api/integrations/digilocker/*`) — name + Aadhaar + phone → OTP → creates/links a verified user. Separate concept from EntityLocker: this is identity, not documents.
- **EntityLocker connect mock** (`/api/integrations/entitylocker/connect/*`) — built from the real [Entity Locker API spec, Oct 2024]: the `acr` behaviour (PAN for Partnership, CIN for Pvt/Public Ltd/LLP, Udyam for Proprietorship) is real, mirrored in `mockEntityLockerData.js`. OTP stands in for the entity signing into EntityLocker. Returns entity details + 10 seeded issued documents shaped like the real `Get List of Issued Documents` response (`doctype`, `uri`, `issuerid`, etc.)
- Unified Business Profile CRUD, owned per user
- Deterministic KYA rules engine (no LLM invents requirements)
- Consent request/grant/deny, logged with expiry
- DocumentSourceRouter + DocumentMatcher (required vs available, missing-doc re-upload re-runs the match)
- Audit log for every event type in the spec
- Notifications logged to console via mocked providers — nothing is actually sent
- Simple deterministic incentive matcher

**Explicitly stubbed, not faked as real:**
- RAG Assistant — placeholder response only
- File storage — metadata only, no real object storage
- Signed temporary file URLs — not implemented

## The frontend journey (all pages exist and click through end to end)

```
Landing → Sign In / Sign Up
              │
    ┌─────────┴─────────┐
DigiLocker sandbox   Manual signup
(name+Aadhaar+phone,  (name/phone/email/
 OTP=1111)             Aadhaar, OTP=1111)
    └─────────┬─────────┘
      Identity completed
              ↓
   Choose document source
    ┌─────────┴─────────┐
"I have EntityLocker"  "Use our vault"
    ↓                       │
Pick entity type            │
(decides PAN/CIN/Udyam)     │
    ↓                       │
Enter that ID, OTP=1111     │
    ↓                       │
EntityLocker connected      │
(10 documents shown)        │
    └─────────┬─────────────┘
      Unified Business Profile
              ↓
         (Home dashboard — not built yet)
```

**Important honesty note:** these frontend pages run as self-contained local-state mocks (same OTP=1111 pattern throughout) so the click-through demo works reliably without the backend running. They are not yet wired via axios to the real backend endpoints listed above — the backend is real and independently testable (curl/Postman), the frontend is a real, working UX, but the two aren't calling each other yet. Wiring them together is the next step.



## Project layout

```
frontend/   Vite + React (Landing, SignUp, SignIn, Business Profile, Application Tracker)
backend/    Express + Mongoose API described above
```

## Running it

**Backend**
```
cd backend
cp .env.example .env      # fill in your real MONGODB_URI
npm install
npm run seed               # creates 1 demo user + profile + 10 EntityLocker docs
npm run dev                 # http://localhost:5000
```

Demo login (after seeding): name `Asha Rao`, email `demo@beesetu.test`, Aadhaar last 4 `1234`.

**Frontend**
```
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

The frontend pages are not yet wired to call the backend (no `axios`/fetch calls added) — they're the polished UI layer from the previous pass. Wiring them to these real endpoints is the next step if you want the full click-through demo to work end to end.

## API surface

```
POST /api/auth/signup
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/login
GET  /api/auth/me

POST /api/business-profile
GET  /api/business-profile

POST /api/integrations/entitylocker/connect
GET  /api/integrations/entitylocker/documents

POST /api/kya/run

POST /api/consent/request
POST /api/consent/respond

GET  /api/documents/match?source=ENTITYLOCKER|SETU_VAULT
POST /api/documents/vault
GET  /api/documents/vault

GET  /api/dashboard
GET  /api/notifications
PATCH /api/notifications/:id/read
GET  /api/incentives
POST /api/rag/ask   (stub)
```

## Honest next steps, in order

1. Wire frontend pages to these endpoints with axios + an AuthContext (currently pure local state)
2. Build the blocking consent modal UI (backend already returns the right shape from `/api/consent/request`)
3. Real object storage for uploads (even local disk + multer would beat metadata-only)
4. A real RAG pipeline, scoped to profile/KYA/document data only
5. DigiLocker mock, mirroring the EntityLocker adapter pattern
