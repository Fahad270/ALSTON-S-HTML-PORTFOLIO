# SIH 2026 PS26130 — Admin Panel Research Report
**Source Directory**: `C:\Users\Aryan Mejari\OneDrive\Desktop\ALSTON-S-HTML-PORTFOLIO`  
**Primary Document**: `SIH_2026_PS26130_4_Day_Research_and_Architecture_Brief.docx` (18 sections, 12 tables)  
**Images Analyzed**: 1.jpeg, 2.jpeg, 3.jpeg, egA.jpeg, egB.jpeg, egC.jpeg, 18 WhatsApp reference images in `other references/`  
**Codebase**: React + Vite frontend, Node/Express + MongoDB + Neo4j backend (mock adapters for DigiLocker/EntityLocker)

---

## 1. PROJECT PURPOSE AND STAKEHOLDERS

### 1.1 Problem Statement (PS26130)
**Title**: "Efficiency in streamlining industrial approvals, compliance processes, and access to government support services"  
**Core Pain Points** (from DOCX Section 2):
- Entrepreneurs/industrial units need multiple registrations, permissions, licences, NOCs, inspections, renewals
- Requirements vary by sector, location, project size, stage of operation
- Incomplete applications, repetitive scrutiny, manual coordination, poor bottleneck visibility, inconsistent compliance monitoring

**Expected Solution**: A unified intelligent approval/compliance solution (not another generic single-window portal).

### 1.2 Core Idea / Product Spine (DOCX "CORE IDEA" + Section 1)
> "We are not building another generic single-window portal. PS26130 is the spine: a unified, intelligent approval + compliance journey that converts a business profile into an explainable, dependency-aware approval graph, validates documents before submission, coordinates workflows/inspections/SLA escalation, preserves an auditable history, and keeps regulatory knowledge versioned and updateable."

### 1.3 Stakeholders
| Stakeholder | Role | Key Needs |
|-------------|------|-----------|
| **Entrepreneur / Applicant** | Primary user | Single business profile → customised approval graph → pre-validated documents → parallel workflow tracking → compliance passport |
| **Department Officer** | Approver/Inspector | SLA-aware queue, inspection scheduling, evidence capture, escalation path, decision guardrails |
| **Nodal Officer** | Escalation authority | Breach alerts with evidence packages, cross-department visibility |
| **Admin / Regulator** | Rule author, system operator | Rule versioning, impact analysis, simulation, audit trail, QR verification, delay analytics |
| **Auditor / Public** | Verifier | QR-verifiable clearance history, tamper-evident audit chain (SHA-256 + Ethereum) |

### 1.4 Benchmarked Systems (DOCX Section 4)
| System | Capabilities Observed | Lesson for PS26130 |
|--------|----------------------|-------------------|
| **NSWS** | KYA, central/state approvals, real-time status, document repo, renewals, query mgmt, scheme access | "One place for approvals" is not novelty; differentiate via deeper orchestration, validation, dependency intelligence, regulatory versioning, evidence/audit |
| **Maharashtra MAITRI** | State single-window / investor facilitation | Need Maharashtra-aware rules, jurisdiction/location logic |
| **Karnataka Invest** | 150+ services across 30+ depts, CAF reuse/prefill, nodal officers, real-time status, SLA/bottleneck dashboards | Verified-data reuse and SLA ideas established; contribute deeper graph/rule/document integration |
| **Odisha GO-SWIFT** | Land bank, risk-based synchronized inspection, incentives, grievance redressal | Joint inspections, land intelligence, incentives, grievance linkage are proven directions |
| **DigiLocker** | Digital document access/consent | Adapter pattern keeps prototype independent of credentials |
| **EntityLocker** | Business/entity document management, requester APIs | Mimic contract, not production access |
| **API Setu** | API discovery/integration platform | Design as adapters/connectors, not hardcoded APIs |
| **Bhashini** | Multilingual machine translation | Accessibility layer; retain original legal text for accuracy |

### 1.5 Related SIH Problem Statements Borrowed From (DOCX Section 5)
| PS | Mechanism Studied | Integration into PS26130 |
|----|-------------------|--------------------------|
| PS26018 | Document AI/OCR/NLP, extraction, validation, confidence, human review, audit trail | Pre-submission document intelligence layer |
| PS26021 | Tamper-evident traceability, QR verification, history/audit | Verifiable clearance/audit layer (sensitive data off-chain) |
| PS26092 | Government support/incentive discovery & eligibility | Profile-driven incentive/scheme matching & tracking |
| PS26125 | Approval/compliance workflow ideas | Mechanism comparison source only |
| PS26129 | Interoperability, consent-based sharing, federated verified data reuse | Integration & one-time verified profile/data reuse |
| PS26190 | High-priority approval/industrial process mechanisms | Overlap identification to avoid duplication |

**Design Principle** (DOCX Table): "The team is not claiming to solve six SIH problem statements simultaneously. The other PSs were used as mechanism libraries and comparison points; PS26130 remains the product spine."

---

## 2. CITIZEN AND ADMIN WORKFLOWS

### 2.1 Citizen Journey (Intent-First Onboarding) — DOCX Section 6, 12, 17
**Entry Points** (LandingPage.jsx INTENTS):
1. **Start a new business** (Rocket icon)
2. **Expand an existing business** (Building2 icon)
3. **Obtain a new licence / approval** (FileSignature icon)
4. **Renew existing approvals** (RefreshCcw icon)
5. **Check my compliance status** (CheckCircle2 icon)

**Continuous Demo Flow** (DOCX Section 12 — 19 steps):
1. Landing → choose intent
2. Business profile collects mandatory sector, location, project size, stage, entity type, conditions
3. KYA runs deterministic regulatory engine → generates required document checklist
4. Approval graph appears in Three.js (dependencies, parallel paths, status)
5. Connect mock DigiLocker/EntityLocker → import verified/demo documents
6. Upload deliberately inconsistent document → OCR detects mismatch before submission
7. Correct document passes validation
8. Approvals proceed in parallel where dependencies permit
9. System finds joint inspection slot across departments/officers
10. SLA countdown begins; warning notification as deadline approaches
11. Trigger SLA breach → escalates to nodal officer with timeline/evidence
12. Show mixed outcome: one approved, one rejected with reason, one pending; audit/QR exposes complete state
13. Hash evidence/document event → anchor on Ethereum
14. Generate QR → opens verifiable clearance/history view; private docs protected
15. Change profile variable (LPG usage, employee count) → simulation shows added/changed approvals
16. Admin adds mock regulatory change → new rule version verified, affected apps identified, graph updates
17. Dashboard shows incentives, renewals, compliance state, notifications

### 2.2 Identity & Document Source Flow (Frontend: IdentityGate.jsx, DocumentSourceChoice.jsx, EntityLockerMock.jsx, DigiLockerMock.jsx)
```
Landing → IdentityGate (fork)
    ├─ DigiLocker path: name + 12-digit Aadhaar + phone → mock OTP (1111) → JWT
    └─ Manual signup: name, phone, email, demo Aadhaar → JWT
         ↓
DocumentSourceChoice (fork)
    ├─ EntityLocker: entity type → acr (PAN/CIN/Udyam) → ID number → OTP → connected → shows 10 demo docs
    └─ SETU Vault: skip to Business Profile (no forced upload)
         ↓
Business Profile Form (6 sections, 28 fields) → Save → KYA → Tracker
```

### 2.3 Admin Workflows (Derived from DOCX Sections 9, 11, 12, 16)
| Workflow | Trigger | Steps | Output |
|----------|---------|-------|--------|
| **Regulatory Change** | Admin proposes change | 1. Create proposed change (rule ID, dept, state, sector, old/new req, effective date, source) 2. AI structures candidate 3. Human verifies 4. New rule version created (old preserved) 5. Affected businesses/apps identified 6. Active apps flagged/re-evaluated 7. Graphs & notifications update 8. Historical apps retain snapshot | Versioned rule, impact report, updated approval graphs |
| **Regulatory Impact Analysis** | Rule version created | Query Neo4j + MongoDB for affected rules/applications/businesses | Affected entity list |
| **Regulatory Simulation** | User changes profile variable | Clone app/profile state → rerun rules → compare approval graph (no ledger mutation) | Diff view of added/removed/changed approvals |
| **Audit/QR Verification** | Public scans QR | Reconstruct hash chain from on-chain head → display department, event, timestamp, outcome | Tamper-evident clearance history |
| **SLA Escalation** | Deadline breached | Officer → Nodal officer with evidence package (timeline, status, dependency context) | Escalation record |
| **Joint Inspection Scheduling** | Multiple depts need inspection | Find common available slot across depts/officers/location where legally possible | Scheduled slot |
| **Grievance Linkage** | Citizen files complaint | Attach to application + department + stage + SLA + evidence (not generic box) | Contextual grievance |

---

## 3. ADMIN ROLES AND PERMISSIONS

### 3.1 Defined User Roles (backend/src/models/index.js:12)
```javascript
role: { type: String, enum: ["USER", "OFFICER", "NODAL_OFFICER", "ADMIN"], default: "USER" }
```

### 3.2 Role Capabilities Matrix (Inferred from DOCX + Code)

| Capability | USER | OFFICER | NODAL_OFFICER | ADMIN |
|------------|------|---------|---------------|-------|
| Create business profile | ✓ | — | — | — |
| Run KYA / view approval graph | ✓ | ✓ (assigned) | ✓ | ✓ |
| Upload/import documents | ✓ | — | — | — |
| Submit application | ✓ | — | — | — |
| View own application tracker | ✓ | ✓ (assigned) | ✓ | ✓ |
| View assigned department queue | — | ✓ | ✓ | ✓ |
| Approve/reject with reason | — | ✓ | ✓ | ✓ |
| Raise query on application | — | ✓ | ✓ | — |
| Schedule/conduct inspection | — | ✓ | ✓ | ✓ |
| Capture inspection evidence (photo + GPS/EXIF + hash) | — | ✓ | ✓ | — |
| View SLA countdown | ✓ | ✓ | ✓ | ✓ |
| Receive escalation on breach | — | — | ✓ | ✓ |
| Propose regulatory change | — | — | — | ✓ |
| Verify/approve rule change | — | — | — | ✓ |
| Run impact analysis | — | — | ✓ | ✓ |
| Run simulation (what-if) | ✓ | — | ✓ | ✓ |
| View delay analytics / bottlenecks | — | — | ✓ | ✓ |
| Manage fee planner data | — | — | — | ✓ |
| Manage incentive rules | — | — | — | ✓ |
| View audit log / QR verification | ✓ (own) | ✓ (assigned) | ✓ | ✓ |
| Anchor hash to Ethereum | — | — | — | ✓ (system) |

### 3.3 Permission Notes (DOCX Section 15 - Security & Governance)
- **RBAC**: Application permissions determine who can perform/view actions
- **Public blockchain visibility is NOT made private by RBAC** — sensitive data stays off-chain
- **Aadhaar**: Prototype uses mock/masked/hash data; never real Aadhaar
- **High-impact regulatory decisions** remain deterministic and/or human-authorized (not delegated blindly to LLM)
- **SLA breach ≠ deemed approval** unless specific statutory process permits it (guardrail)

---

## 4. SERVICE / APPLICATION ENTITIES AND STATUSES

### 4.1 Core Entities (backend/src/models/index.js + DOCX Section 6)

| Entity | Key Fields | Statuses / States |
|--------|------------|-------------------|
| **User** | name, email, phone, aadhaarLast4, aadhaarHash, role (USER/OFFICER/NODAL_OFFICER/ADMIN), isVerified | — |
| **BusinessProfile** | userId, businessName, entityType, sector, nicCode, PAN/CIN/LLPIN/Udyam/GSTIN, address, landType, investment, turnover, employees, capacity, premises, utilities, envCategory (White/Green/Orange/Red/NA), hazardousMaterial, machinery, **fieldVerificationStatus** (USER_PROVIDED, PARTIALLY_VERIFIED, VERIFIED) | — |
| **KyaResult** | businessId, requiredDocuments[], generatedAt | — |
| **ConsentRecord** | userId, businessId, source (ENTITYLOCKER/SETU_VAULT), purpose, granted, expiry, consentVersion | — |
| **DocumentMetadata** | userId, businessId, documentType, source (ENTITYLOCKER/SETU_VAULT), fileName, storageKey, mimeType, **status** (UPLOADED, REFERENCED) | — |
| **AuditLog** | userId, businessId, eventType, metadata | EVENT_TYPES: USER_CREATED, BUSINESS_PROFILE_CREATED/UPDATED, ENTITYLOCKER_CONNECTED, CONSENT_REQUESTED/GRANTED/DENIED, DOCUMENTS_ACCESSED, DOCUMENT_MATCH_COMPLETED, DOCUMENT_UPLOADED, KYA_COMPLETED |
| **Notification** | userId, title, body, read, createdAt | — |
| **MockEntityLockerDoc** (separate DB) | entityId, documentType, documentName, issuer, issuedDate, status (ISSUED) | — |

### 4.2 Approval/Department Statuses (ApplicationTracker.jsx + DOCX)
| Status | Meaning | Color |
|--------|---------|-------|
| **Approved** | Department granted clearance | `#128807` (green) |
| **Rejected** | Department denied with reason | `#B4342A` (red/rust) |
| **Halted** | Pending resubmission due to dependency | `#8A96A5` (gray) |
| **Pending/In Progress** | Under review | `#CC6D1D` (saffron) |

### 4.3 SLA States (DOCX Section 6, 12)
- **Submission time** recorded
- **Deadline** = submission + statutory SLA days
- **Remaining time** countdown
- **Breach state** → triggers escalation
- **Deemed-approval guardrail**: SLA expiry does NOT auto-grant approval; only applicable statutory process invoked by authorized decision-maker

### 4.4 Document Validation States (DOCX Section 10, backend DocumentMatcher.js)
| State | Condition |
|-------|-----------|
| **Matched** | Required document type found in available docs (normalized match) |
| **Missing** | Required document not found |
| **Confidence** | High/Medium/Low based on OCR extraction quality; configurable review threshold |
| **Mismatch** | Extracted field value ≠ business profile value (e.g., employees=50 vs 40) → warning before submission |

### 4.5 Incentive Match States (miscController.js)
| State | Meaning |
|-------|---------|
| **Potentially relevant** | Profile matches rule condition (udyamNumber, sector, employeeCount, investment) |
| **Disclaimer** | "Eligibility is not guaranteed and must be confirmed with the issuing scheme" |

---

## 5. LEGAL / COMPLIANCE REQUIREMENTS RELEVANT TO ADMIN PANEL

### 5.1 Data Protection & Privacy (DOCX Section 15)
| Requirement | Implementation |
|-------------|----------------|
| **Data minimization** | Do not collect information simply because technically possible |
| **Aadhaar handling** | Mock/masked/hash only; never real Aadhaar in demo |
| **Sensitive documents off-chain** | PAN, Aadhaar, entire PDFs, financial docs, private personal info never on public blockchain |
| **Blockchain privacy** | SHA-256 hashes + append-only audit events; operational state in MongoDB; content in encrypted object storage/IPFS |
| **Consent-based sharing** | ConsentRecord with source, purpose, granted, expiry, version; required before document access |

### 5.2 Regulatory Integrity (DOCX Sections 9, 15)
| Requirement | Implementation |
|-------------|----------------|
| **Rule versioning** | Every change creates new version; old rule never overwritten |
| **Source linking** | Each rule: rule ID, jurisdiction, authority, sector/activity, entity type, thresholds, conditions, approval, documents, inspection req, fee (where verified), SLA/timeline, source, effective from/to, version, last-verified date |
| **Human verification** | AI structures candidate change → authorized human verifies → new version |
| **Historical preservation** | Historical applications retain their historical rule snapshot |
| **Deterministic authority** | LLM explains/summarizes; rules decide applicability; LLM cannot independently activate legal requirement |
| **Insufficient info handling** | System says "regulatory information insufficient" rather than hallucinating approval |

### 5.3 Audit & Verifiability (DOCX Sections 8, 12, 13, 15)
| Requirement | Implementation |
|-------------|----------------|
| **Tamper-evident chain** | SHA-256 hash chaining: each event includes prevHash → altering any record breaks chain visibly |
| **QR verification** | QR points to current clearance/audit view with status/history; private docs protected |
| **Independent verification** | Any applicant, auditor, court can recompute and verify chain independently |
| **Timestamp integrity** | Fixed at moment of action; delays can't be backdated |
| **Officer traceability** | Role hash (not personal identity) on chain |
| **Evidence limitations** | Inspection GPS/EXIF treated as evidence with limitations, not absolute proof |

### 5.4 Interoperability Standards (DOCX Sections 4, 11)
- **Adapter pattern** for DigiLocker, EntityLocker, API Setu — separate application logic from government integration/credentials
- **Mock OAuth/consent flow**: connect → permission → authorization code → token → permitted document access
- **Production migration**: Replace MockDigiLockerService/MockEntityLockerService with real adapters; main app unchanged

---

## 6. RECOMMENDED ADMIN MODULES AND PAGE ROUTES

Based on DOCX feature map (Section 6), architecture (Sections 7-9, 14), build order (Section 16), and demo story (Section 12), the following admin modules are recommended:

### 6.1 Core Admin Modules

| Module | Route | Purpose | Key Features |
|--------|-------|---------|--------------|
| **Dashboard Overview** | `/admin` | System health, KPIs, bottleneck summary | Total applications, SLA breach rate, avg processing time, active inspections, rule versions pending verification |
| **Application Management** | `/admin/applications` | View/filter all applications across departments | Search by ID, business, sector, status, department, date range; bulk actions; view approval graph, audit trail, QR |
| **Department Workbench** | `/admin/departments/:deptId` | Officer/Nodal view for assigned approvals | Queue with SLA countdown, document review, approve/reject/query, inspection scheduling, evidence capture |
| **Inspection Management** | `/admin/inspections` | Joint inspection scheduling & evidence | Officer calendar, common-slot optimizer, evidence upload (photo+GPS+hash), inspection history |
| **SLA & Escalation Monitor** | `/admin/sla` | Real-time SLA tracking & breach management | Countdown timers, breach alerts, escalation queue with evidence packages, deemed-approval guardrail status |
| **Regulatory Rule Manager** | `/admin/rules` | Versioned rule CRUD + impact analysis | Rule editor (ID, jurisdiction, authority, sector, thresholds, conditions, docs, inspection, fee, SLA, source, effective dates), version history, AI-assisted structuring, human verification gate, impact analysis (affected apps/businesses), simulation runner |
| **Regulatory Change Workflow** | `/admin/rules/changes` | End-to-end change proposal → verification → propagation | Proposal form, AI extraction, verifier assignment, diff view, affected entity notification, graph re-evaluation trigger |
| **Simulation / What-If Engine** | `/admin/simulation` | Test profile/rule changes without mutation | Clone state, rerun rules, compare approval graphs (added/removed/changed), export diff report |
| **Incentive & Scheme Manager** | `/admin/incentives` | Rule-backed incentive eligibility | Rule editor (profile conditions → scheme), source/last-verified timestamp, match results viewer |
| **Fee Planner** | `/admin/fees` | Rule-backed fee data | Fee basis, amount, source, last-verified, indicative vs mandatory flag |
| **Audit & Verification** | `/admin/audit` | Tamper-evident log viewer + QR generator | Full audit log search, hash chain reconstruction, QR code generation, Ethereum anchor status |
| **Delay Analytics** | `/admin/analytics/delays` | Bottleneck & process delay patterns | Historical stage/dependency/SLA data, critical-path visualization, department comparison, trend charts |
| **Grievance Management** | `/admin/grievances` | Contextual grievance handling | Linked to application+department+stage+SLA+evidence, assignment, resolution tracking |
| **Compliance Passport** | `/admin/compliance-passport` | Persistent business compliance state | Approvals, documents, inspections, expiry, renewals, regulatory state per business |
| **User & Role Management** | `/admin/users` | RBAC administration | User list, role assignment, verification status, audit log per user |
| **Integration Health** | `/admin/integrations` | DigiLocker/EntityLocker/API adapter status | Connection status, mock vs real mode, document sync logs, consent records |

### 6.2 Supporting Routes (from existing frontend/backend)
| Route | Current Implementation | Admin Extension Needed |
|-------|------------------------|------------------------|
| `/dashboard` (citizen) | `GET /api/dashboard` → profileComplete, business, entityLockerConnected | Admin version with cross-user aggregation |
| `/tracker` (citizen) | ApplicationTracker.jsx with scenario toggle | Admin version with all apps, filterable, editable |
| `/business-profile` | BusinessProfileForm.jsx (28 fields, 6 groups) | Admin read-only + verification status override |
| `/api/kya/run` | Deterministic rule engine → requiredDocuments[] | Admin rule editor + test runner |
| `/api/documents/match` | DocumentMatcher.js → found/missing/summary | Admin document validation override |
| `/api/incentives` | Static INCENTIVE_RULES filter | Admin rule editor |
| `/api/rag/ask` | Placeholder | Admin RAG knowledge base manager |

---

## 7. PRIORITY DEMO SCENARIOS

From DOCX Section 12 (Planned SIH Demo Story) and Section 17 (One-Minute Explanation), prioritized for maximum judge impact:

### P0 — Must Show (Core Spine)
1. **Intent-first onboarding** → Business Profile → KYA → **Approval Dependency Graph (Three.js)** with parallel/sequential paths
2. **Pre-submission document validation**: Upload inconsistent doc → OCR detects mismatch (employees 50 vs 40) → warning before submission
3. **Parallel workflow**: Fire + Police + Electricity proceed together where dependencies allow; SLA countdowns visible
4. **Joint inspection scheduling**: Common slot found across departments/officers
5. **SLA breach → escalation**: Nodal officer receives evidence package (timeline, status, dependency context)
6. **Mixed outcome display**: One approved, one rejected with reason, one halted; audit trail + QR still shows complete state
7. **QR verification**: Scan → verifiable clearance history reconstructed from hash chain (not single dept records)

### P1 — High Differentiation
8. **Regulatory simulation**: Change LPG usage/employee count → what-if shows added/changed approvals without ledger mutation
9. **Admin regulatory change**: Add mock rule version → verified → affected apps flagged → graph updates live
10. **Blockchain audit anchor**: Hash evidence/document event → anchor on Ethereum → QR proves tamper-evidence
11. **EntityLocker/DigiLocker consent flow**: Connect → mock OAuth → import 10 verified docs → match against KYA checklist

### P2 — Polish / Completeness
12. **Incentive matching**: Profile → potentially relevant schemes with disclaimer
13. **Compliance passport**: Persistent record of approvals, docs, inspections, expiry, renewals
14. **Multilingual toggle** (Bhashini direction) + low-bandwidth draft/sync indicator
15. **Fee planner** with source/last-verified timestamps

### Demo Data (from seed.js + mockEntityLockerData.js)
- **Business**: "Demo Manufacturing Pvt Ltd", Private Limited, Manufacturing, NIC 2029, Orange category, 22 employees, ₹35L investment, ₹80L turnover, MIDC Mumbai
- **EntityLocker docs**: 10 documents (PAN, GSTIN, Udyam, Incorporation, Address Proof, Company Master, Bank Statement, Lease Deed, Auth Signatory, Factory Licence)
- **OTP for all flows**: `1111`

---

## 8. UNIQUE VISUAL DESIGN DIRECTION (Derived from References, Not Copied)

### 8.1 Color System (Consistent across all frontend pages)
```css
--ink:        #0B2036   /* Deep navy, primary text/headers */
--paper:      #F5F6F3   /* Off-white background */
--line:       #DADFDA   /* Subtle borders/dividers */
--slate:      #1C2A36   /* Secondary text */
--saffron:    #CC6D1D   /* Primary accent (saffron) */
--green:      #128807   /* Success/green accent */
--navy:       #06038D   /* Deep blue accent */
--teal:       #0F8B8D   /* Highlight/teal accent */
--rust:       #B4342A   /* Error/rejection */
```

**Tricolour Branding** (all pages): 5px top bar — `#FF9933` (saffron) 33.3%, `#FFFFFF` 33.3%, `#128807` (green) 33.3% — echoes india.gov.in national portal language without reproducing official emblem.

### 8.2 Typography
- **Headings**: Space Grotesk (500/600/700) — distinctive, technical, legible
- **Body/UI**: IBM Plex Sans (400/500/600) — neutral, readable, government-appropriate
- **Monospace**: Hash codes, QR data, technical IDs

### 8.3 Layout Patterns (Recurring across all pages)
| Pattern | Implementation |
|---------|----------------|
| **Fixed top tricolour bar** | 5px gradient, `position: relative` on root |
| **Utility bar** | Dark (`#0B2036`), skip link, demo flag, accessibility (A-/A+), language, auth links |
| **Header band** | Dark gradient background, Chakra watermark (low opacity), brand mark + wordmark, tagline, demo flag |
| **Intent/Action cards** | Grid (auto-fit, minmax 190px), bordered, hover → navy border + subtle shadow, key badge (A/B/C...), icon in saffron |
| **Section cards** | White, 1px border, 10px radius, colored left bar (4px) per section color (saffron/navy/green), Space Grotesk title |
| **Form fields** | Grid 2-col (full-width for textarea), `#DADFDA` border, focus → navy border + white bg, select with ChevronDown icon |
| **Chip/toggle groups** | Pill chips (toggle on → green bg + green border), toggle switch (saffron when on) |
| **Status pills** | Rounded, white text, color per status (green/red/gray/saffron) |
| **SLA progress bars** | 5px height, fill color: green (within SLA), saffron (over), red (rejected) |
| **Timeline lists** | Dashed borders, event + timestamp right-aligned |
| **Data tables** | Dark header (`#0B2036`), monospace hash columns, truncated with ellipsis |
| **QR card** | Flex layout, QR image + copy, verify link |
| **Footer note boxes** | Amber (`#FFF6EA`) for corrections, green (`#E9F5EC`) for benefits |

### 8.4 Icon System
- **Lucide React** throughout (Feather-style, 2px stroke)
- **Department icons**: Fire (Flame), Police (Shield), Electricity (Zap)
- **Action icons**: ArrowRight, CheckCircle2, XCircle, QrCode, ListChecks, ShieldAlert, Landmark, Vault, Fingerprint, UserPlus

### 8.5 Visual Differentiators from References
| Reference Pattern | Adaptation (Not Copy) |
|-------------------|----------------------|
| **Government portal density** | Generous whitespace, card-based, progressive disclosure (not form walls) |
| **Static checklists** | Interactive dependency graph (Three.js) — 3D, rotatable, nodes show status/SLA/docs |
| **Generic status badges** | SLA progress bars + timeline + hash chain audit table |
| **Single-language** | Utility bar with A-/A+ font size, screen reader, language toggle (EN) |
| **Opaque process** | QR-verifiable public audit trail + "what this chain actually buys us" plain-language explanation |
| **Document upload = black box** | Pre-validation UI: match summary (found/missing), confidence, mismatch warnings before submit |

### 8.6 Component Density Guidelines
- **Mobile-first**: Cards stack to 1-col < 760px; intent grid → 1-col < 560px
- **Information hierarchy**: Brand → Intent → Feature → Detail → Footer
- **Progressive disclosure**: Demo flag always visible; advanced features (simulation, regulatory change) behind admin routes

---

## 9. EXACT SOURCE FILENAMES AND SECTIONS SUPPORTING EACH CONCLUSION

| Report Section | Source File | Section / Location |
|----------------|-------------|-------------------|
| **1.1 Problem Statement** | `SIH_2026_PS26130_4_Day_Research_and_Architecture_Brief.docx` | Section 2, para 1 |
| **1.2 Core Idea** | Same DOCX | "CORE IDEA" paragraph (before Section 1) |
| **1.3 Stakeholders** | Same DOCX | Sections 2, 6, 12, 17; `frontend/src/pages/LandingPage.jsx` (INTENTS) |
| **1.4 Benchmarked Systems** | Same DOCX | Section 4, Table "System / source studied" |
| **1.5 Related PSs** | Same DOCX | Section 5, Table "PS / Mechanism studied / How it fits" |
| **2.1 Citizen Journey** | Same DOCX | Section 6 (Intent-first onboarding), Section 12 (19 steps), Section 17 |
| **2.2 Identity Flow** | `frontend/src/pages/IdentityGate.jsx`, `DocumentSourceChoice.jsx`, `EntityLockerMock.jsx` | Full component logic |
| **2.3 Admin Workflows** | DOCX | Sections 9 (Rule-change workflow), 11 (Mock adapters), 12 (Demo steps 14-17), 16 (Build order) |
| **3.1 Roles** | `backend/src/models/index.js:12` | UserSchema.role enum |
| **3.2 Role Matrix** | DOCX Sections 6, 9, 12, 15 | Feature map, Rule-change workflow, Security principles |
| **3.3 Permission Notes** | DOCX Section 15 | "Security & Governance Principles" bullet list |
| **4.1 Core Entities** | `backend/src/models/index.js` | All Schema definitions (lines 6-123) |
| **4.2 Approval Statuses** | `frontend/src/pages/ApplicationTracker.jsx` | SCENARIOS object, statusColor function; DOCX Section 6 |
| **4.3 SLA States** | DOCX Section 6 (SLA Monitoring, Escalation, Deemed-approval guardrail); Section 12 (steps 9-11) |
| **4.4 Doc Validation** | DOCX Section 10 (4 steps); `backend/src/services/documents/DocumentMatcher.js` | matchDocuments function |
| **4.5 Incentive States** | `backend/src/controllers/miscController.js` | INCENTIVE_RULES, matchIncentives function |
| **5.1 Data Protection** | DOCX Section 15 | "Security & Governance Principles" bullets 1-4 |
| **5.2 Regulatory Integrity** | DOCX Section 9 (Rule-change workflow), Section 15 (bullets 5-8) |
| **5.3 Audit/Verification** | DOCX Sections 8, 12 (step 13-14), 13 (Privacy-aware Public Verification), 15 (bullets 8-10) |
| **5.4 Interoperability** | DOCX Sections 4 (API Setu, EntityLocker), 11 (Mock adapter layers) |
| **6.1 Admin Modules** | DOCX Sections 6 (Full feature map), 7 (Architecture), 9 (Regulatory Engine), 12 (Demo), 16 (Build order) |
| **6.2 Supporting Routes** | `backend/src/app.js` (route mounts), `backend/src/routes/*.js`, `frontend/src/App.jsx` |
| **7. Demo Scenarios** | DOCX Section 12 (19 steps), Section 17 (One-minute explanation) |
| **8.1 Color System** | All `frontend/src/pages/*.jsx` | CSS custom properties in `<style>` blocks |
| **8.2 Typography** | All frontend pages | `@import url('https://fonts.googleapis.com/...Space+Grotesk...IBM+Plex+Sans...')` |
| **8.3 Layout Patterns** | `LandingPage.jsx`, `BusinessProfileForm.jsx`, `ApplicationTracker.jsx`, `IdentityGate.jsx`, `DocumentSourceChoice.jsx`, `EntityLockerMock.jsx` | Repeated CSS patterns across files |
| **8.4 Icons** | All frontend pages | `lucide-react` imports |
| **8.5 Differentiators** | DOCX Section 13 (What Is Actually Novel), Section 14 (Architecture diagram) |

---

## RECOMMENDATIONS (Labeled Separately)

| # | Recommendation | Rationale |
|---|----------------|-----------|
| **R1** | Implement `/admin/rules` with **versioned rule editor** first — this is the "most important AI design decision" (DOCX Section 9) and enables all downstream features | Regulatory Knowledge Engine is the spine; everything else (KYA, graph, simulation, impact) depends on versioned, source-linked rules |
| **R2** | Build **Three.js approval graph** as interactive admin view, not just citizen demo — officers need to see dependency critical path | Neo4j dependency intelligence is a key differentiator (DOCX Section 8) |
| **R3** | Add **RBAC middleware** beyond `authenticateToken` — current auth only validates JWT, doesn't check role | DOCX Section 15 mandates RBAC; backend has role field but no authorization layer |
| **R4** | Create **admin inspection calendar** with joint-slot optimizer — demo story step 8 is high-impact | Odisha GO-SWIFT proves joint inspections work; our optimizer is a differentiator |
| **R5** | Implement **hash-chain audit UI** (`/admin/audit`) with QR generator — judges can verify live | PS26021 mechanism + DOCX Section 12 step 13-14; "tamper-evident" is a core claim |
| **R6** | Add **regulatory simulation page** (`/admin/simulation`) — what-if without mutation is unique | DOCX Section 12 step 16 + Section 13 "Regulatory Simulation" |
| **R7** | Wire **real OCR/extraction pipeline** (Python/Flask + Celery) for demo — currently mocked | DOCX Section 10: "goal is to stop incomplete applications before they consume departmental scrutiny time" |
| **R8** | Add **delay analytics dashboard** with bottleneck visualization — uses historical Neo4j data | DOCX Section 6 (Delay Analytics) + Section 13 (Delay Analytics bullet) |
| **R9** | Implement **cross-state comparison** as admin tool — evaluate same profile under different state rule sets | DOCX Section 6 feature map; "without turning into political recommendation engine" |
| **R10** | Add **low-bandwidth/offline draft** sync indicator in citizen UI — accessibility requirement | DOCX Section 6 feature map + Section 16 Phase 12 |

---

*Report compiled from read-only inspection of all supplied materials. No files were modified. Recommendations (R1-R10) are labeled separately from factual extractions.*