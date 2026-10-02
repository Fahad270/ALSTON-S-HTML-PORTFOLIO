# 🏗️ PragatiSetu — Complete Project Architecture & Flowcharts
> **SIH 2026 | PS26130** — Unified Intelligent Industrial Approval & Compliance Platform

---

## 📌 Table of Contents

1. [System Overview — Big Picture](#1-system-overview--big-picture)
2. [Tech Stack Map](#2-tech-stack-map)
3. [Citizen / Applicant Journey Flow](#3-citizen--applicant-journey-flow)
4. [Identity & Document Onboarding Flow](#4-identity--document-onboarding-flow)
5. [KYA (Know Your Approvals) Engine Flow](#5-kya-know-your-approvals-engine-flow)
6. [Approval Graph & Workflow Orchestration](#6-approval-graph--workflow-orchestration)
7. [Document Validation & OCR Intelligence Flow](#7-document-validation--ocr-intelligence-flow)
8. [SLA Monitoring & Escalation Flow](#8-sla-monitoring--escalation-flow)
9. [Inspection Management Flow (Inspector App)](#9-inspection-management-flow-inspector-app)
10. [Cryptographic Ledger — Audit & Tamper-Evident Chain](#10-cryptographic-ledger--audit--tamper-evident-chain)
11. [Admin Panel Workflows](#11-admin-panel-workflows)
12. [Regulatory Rule Versioning Flow](#12-regulatory-rule-versioning-flow)
13. [Backend API Architecture](#13-backend-api-architecture)
14. [Database & Storage Architecture](#14-database--storage-architecture)
15. [Security & RBAC Flow](#15-security--rbac-flow)
16. [Planned Backend Implementations](#16-planned-backend-implementations)

---

## 1. System Overview — Big Picture

```mermaid
graph TB
    subgraph CLIENTS["Client Layer"]
        FE["Frontend Web App\nReact + Vite\nCitizen and Admin Portal"]
        IA["Inspector App\nExpo React Native\nOfficer Field Tool"]
    end

    subgraph GATEWAY["API Gateway"]
        BE["Node.js Express\nREST API Backend\nPort 5000"]
    end

    subgraph DATA["Data Layer"]
        MDB["MongoDB\nMain Database\nOperational State"]
        ELDB["EntityLocker DB\nSeparate Connection\nMock Entity Docs"]
        NEO["Neo4j\nApproval Graph\nDependency Intelligence"]
    end

    subgraph INTEGRATIONS["Government Integrations (Adapter Pattern)"]
        DL["DigiLocker\nMock OAuth Adapter\nAadhaar-linked docs"]
        EL["EntityLocker\nMock API Adapter\nBusiness entity docs"]
        AS["API Setu\nIntegration Gateway\nGovt API Discovery"]
        BH["Bhashini\nMultilingual AI\nAccessibility Layer"]
    end

    subgraph CHAIN["Cryptographic Ledger"]
        SHA["SHA-256\nHash Chaining\nEvent-level integrity"]
        ETH["Ethereum\nOn-chain Anchoring\nPublic Verifiability"]
        IPFS["IPFS Encrypted\nObject Storage\nDocument Content"]
        QR["QR Verification\nPublic Audit View\nClearance Proof"]
    end

    subgraph AI["AI and Intelligence Layer"]
        OCR["OCR NLP Engine\nDocument Extraction\nField Matching"]
        RAG["RAG LLM\nRegulatory Q&A\nPolicy Summarization"]
        KYA["KYA Engine\nDeterministic Rule Engine\nApproval Graph Builder"]
    end

    FE <-->|REST / JSON| BE
    IA <-->|REST / JSON| BE
    BE <--> MDB
    BE <--> ELDB
    BE <--> NEO
    BE <-->|Adapter| DL
    BE <-->|Adapter| EL
    BE <-->|Adapter| AS
    BE --- BH
    BE --> SHA
    SHA --> ETH
    BE --> IPFS
    ETH --> QR
    BE --> OCR
    BE --> RAG
    BE --> KYA
```

---

## 2. Tech Stack Map

```mermaid
mindmap
  root((PragatiSetu Platform))
    Frontend Web
      React 18
      Vite 5
      React Router DOM
      Three.js Approval Graph 3D
      IBM Plex Sans Font
      Vanilla CSS
    Admin Panel
      React SPA
      AdminDashboard
      AdminApplications
      AdminDepartments
      AdminRules
      AdminSLAMonitor
      AdminEscalations
      AdminUsers
    Inspector Mobile App
      Expo SDK
      React Native
      React Navigation
        Bottom Tab Navigator
        Native Stack Navigator
      Expo Camera
      Expo Location GPS
      Expo Notifications
    Backend API
      Node.js ESM
      Express 4
      Helmet Security Headers
      CORS
      express-rate-limit
      bcrypt Password Hashing
      jsonwebtoken JWT Auth
      multer File Uploads
      uuid ID Generation
    Databases
      MongoDB and Mongoose
        Main Connection
        EntityLocker Connection
      Neo4j
        Approval Graph
        Dependency Graph
      IPFS Document Content
    Government APIs
      DigiLocker Mock OAuth
      EntityLocker Mock API
      API Setu Gateway
      Bhashini Translation
    Cryptographic Layer
      SHA-256 Hash Chaining
      Ethereum Anchor
      IPFS off-chain content
      QR Code Public Verify
    AI Layer
      OCR Document Reading
      NLP Field Extraction
      RAG Policy Q and A
      LLM Summarization
      KYA Engine Rules
```

---

## 3. Citizen / Applicant Journey Flow

```mermaid
flowchart TD
    A([Landing Page]) --> B{Choose Intent}
    B --> B1["Start New Business"]
    B --> B2["Expand Existing"]
    B --> B3["New Licence or Approval"]
    B --> B4["Renew Approvals"]
    B --> B5["Check Compliance Status"]

    B1 & B2 & B3 & B4 & B5 --> C["Identity Gate"]

    C --> D{Authentication Method}
    D -->|DigiLocker Path| E["DigiLocker Mock\nAadhaar 12-digit + Phone\nMock OTP 1111"]
    D -->|Manual Path| F["Manual Sign Up\nName + Phone + Email + Demo Aadhaar"]

    E --> G["JWT Token Issued"]
    F --> G

    G --> H["Document Source Choice"]
    H --> I{Source}
    I -->|EntityLocker| J["EntityLocker Mock\nPAN or CIN or Udyam OTP\n10 Demo Documents Connected"]
    I -->|SETU Vault| K["Skip to Business Profile"]

    J --> L["Business Profile Form\n6 Sections - 28 Fields\nSector, Location, Entity, Investment"]
    K --> L

    L --> M["KYA Engine\nGenerates Required Approvals\nand Document Checklist"]
    M --> N["Approval Graph\nThree.js 3D Visualization\nDependencies + Parallel Paths"]
    N --> O["Document Upload\nOCR Validation Before Submission"]
    O --> P{Validation}
    P -->|Mismatch Detected| Q["Field Mismatch Warning\nEmployee count 50 vs 40\nCorrect before submission"]
    Q --> O
    P -->|All Validated| R["Parallel Submission\nApprovals go in parallel\nwhere dependencies permit"]
    R --> S["Application Tracker\nReal-time Status Per Dept"]
    S --> T{Outcome}
    T -->|Approved| U["Clearance Issued\nQR Generated\nAudit Anchored on ETH"]
    T -->|Rejected| V["Reason Provided\nRe-submit or Appeal"]
    T -->|Pending| W["SLA Countdown\nEscalation if Breached"]
    W --> X["Escalation to Nodal Officer\nEvidence Package Sent"]
```

---

## 4. Identity & Document Onboarding Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend API
    participant DL as DigiLocker Mock
    participant EL as EntityLocker Mock
    participant DB as MongoDB

    U->>FE: Choose Identity Method

    alt DigiLocker Path
        FE->>DL: Submit Aadhaar + Phone
        DL->>FE: Mock OTP sent 1111
        U->>FE: Enter OTP
        FE->>BE: POST /api/integrations/digilocker/verify
        BE->>DB: Create or Update User with aadhaarHash
        BE->>FE: JWT Token
    else Manual Sign Up
        U->>FE: Name + Email + Phone + Aadhaar
        FE->>BE: POST /api/auth/signup
        BE->>DB: Hash Aadhaar and store aadhaarHash only
        BE->>DB: Create OTP Session
        BE->>FE: OTP via Email or SMS or WhatsApp
        U->>FE: Verify OTP
        FE->>BE: POST /api/auth/verify-otp
        BE->>FE: JWT Token
    end

    Note over U,DB: Document Source Selection

    alt EntityLocker
        U->>FE: Choose Entity Type + PAN or CIN or Udyam
        FE->>BE: POST /api/integrations/entitylocker/connect
        BE->>EL: Lookup by Entity ID
        EL->>BE: 10 Demo Documents
        BE->>DB: Store ConsentRecord source ENTITYLOCKER
        BE->>DB: Store DocumentMetadata array status REFERENCED
        BE->>FE: Documents Listed
    else SETU Vault
        FE->>BE: POST /api/consent/grant source SETU_VAULT
        BE->>DB: Store ConsentRecord
        BE->>FE: Proceed to Business Profile
    end
```

---

## 5. KYA (Know Your Approvals) Engine Flow

```mermaid
flowchart LR
    A["Business Profile\nComplete 28 Fields"] --> B["KYA Engine\nDeterministic Rule Processor"]

    subgraph INPUTS["Profile Inputs"]
        I1["Sector\nManufacturing IT Agro"]
        I2["Location\nDistrict MIDC Urban Rural"]
        I3["Investment Size\nMicro Small Medium Large"]
        I4["Employee Count"]
        I5["Env Category\nWhite Green Orange Red"]
        I6["Hazardous Material\nYes or No"]
        I7["Entity Type\nProprietorship LLP Pvt Ltd"]
        I8["Land Type\nOwned Leased MIDC"]
    end

    INPUTS --> B

    subgraph RULES["Rule Database Neo4j"]
        R1["Central Approvals\nFactory Licence Fire NOC"]
        R2["State Approvals\nMaharashtra specific"]
        R3["Local Body Clearances\nMunicipal Gram Panchayat"]
        R4["Environmental Clearances\nMPCB MoEFCC"]
        R5["Sector Specific Licences\nFSSAI Drug Licence"]
        R6["Labour Compliances\nESI PF Shops Act"]
    end

    RULES --> B

    B --> C["Approval Graph\nDependency-aware DAG"]

    subgraph OUTPUTS["KYA Outputs"]
        O1["Required Approvals List\nWith Jurisdictions"]
        O2["Required Documents Checklist\nPer Approval"]
        O3["Dependency Graph\nA must complete before B"]
        O4["Parallel Paths Identified\nC and D can proceed together"]
        O5["Estimated Timelines\nSLA per department"]
        O6["Fee Estimates\nWhere data available"]
        O7["Inspection Requirements\nWhich depts need site visit"]
    end

    C --> OUTPUTS

    NOTE["RAG or LLM Role: Explains and Summarizes ONLY\nCANNOT activate or override legal requirements\nInsufficient info means system says so explicitly"]
    B --- NOTE
```

---

## 6. Approval Graph & Workflow Orchestration

```mermaid
flowchart TD
    subgraph GRAPH["Neo4j Approval Graph"]
        A1["Business Registration\nPre-requisite DONE"]
        A2["Factory Licence\nIn Progress SLA 30 days"]
        A3["Fire NOC\nPending SLA 14 days"]
        A4["MPCB Green NOC\nPending SLA 60 days"]
        A5["Electrical Safety\nBlocked by A3"]
        A6["Building Plan Approval\nApproved"]
        A7["Water Supply NOC\nParallel with A3"]
        A8["Labour Registration\nParallel Independent"]
        A9["Final Operating Licence\nBlocked Needs A2 A3 A4"]

        A1 -->|Required Before| A2
        A1 -->|Required Before| A6
        A6 -->|Required Before| A3
        A3 -->|Required Before| A5
        A2 & A3 & A4 -->|All Required| A9
        A7 -.->|Parallel| A3
        A8 -.->|Independent Parallel| A2
    end

    subgraph STATUS["Status Colors"]
        S1["Approved Green 128807"]
        S2["Rejected Red B4342A"]
        S3["In Progress Saffron CC6D1D"]
        S4["Halted Gray 8A96A5\ndependency not met"]
    end

    subgraph ACTIONS["Officer Actions Per Node"]
        AC1["Review Documents\nOCR-extracted validated"]
        AC2["Approve with Note"]
        AC3["Reject with Reason\nCitizen Notified"]
        AC4["Raise Query\nApplication paused"]
        AC5["Schedule Inspection\nJoint if multi-dept"]
        AC6["View SLA Countdown"]
    end

    A2 --- ACTIONS
```

---

## 7. Document Validation & OCR Intelligence Flow

```mermaid
flowchart TD
    A["User Uploads Document\nor Imports from DigiLocker or EntityLocker"] --> B["OCR Engine\nText Extraction from PDF or Image"]

    B --> C["NLP Field Extractor\nIdentify Business Name PAN\nAadhaar Employee Count\nDate Address Amounts"]

    C --> D["Document Matcher\nMatch extracted type vs required type\nNormalized name comparison"]

    D --> E{Match Status}

    E -->|MATCHED| F["High or Medium or Low Confidence\nBased on OCR Quality"]
    E -->|MISSING| G["Flag Required Document\nNot Found Block Submission"]

    F --> H{Field Cross-Check vs\nBusiness Profile}

    H -->|Values Agree| I["Document Validated\nReady for Submission"]
    H -->|Mismatch Found| J["Warning Displayed\nEmployee count Profile 50 Doc 40\nUser must correct before submit"]

    J --> K{User Action}
    K -->|Upload Corrected Doc| A
    K -->|Update Profile Field| L["Business Profile Updated\nRe-validate"]
    L --> A

    I --> M["Document Packaged\nMetadata Stored in MongoDB\nContent Stored in Encrypted\nObject Storage or IPFS"]
    M --> N["SHA-256 Hash Generated\nFor this document event\nAdded to Audit Chain"]

    subgraph STATES["Document States"]
        DS1["REFERENCED From DigiLocker or EL\nPointer only content in govt store"]
        DS2["UPLOADED Direct upload\nContent in object storage"]
        DS3["MATCHED Type confirmed"]
        DS4["MISSING Not provided"]
    end
```

---

## 8. SLA Monitoring & Escalation Flow

```mermaid
flowchart TD
    A["Application Submitted\nto Department Queue"] --> B["SLA Timer Starts\nSubmission Timestamp Recorded\nDeadline = Submit + Statutory Days"]

    B --> C{Outcome before deadline?}
    C -->|Decided| D["Approved or Rejected\nSLA Met Record in Audit Log"]

    C -->|70 percent SLA Elapsed| E["Warning Notification\nTo Officer and Dept Head\nVia Email WhatsApp Push"]
    E --> C

    C -->|Deadline Passed| F["SLA BREACH DETECTED\nTimestamp Locked Cannot Backdate"]

    F --> G["Evidence Package Compiled\nTimeline of all events\nDocuments submitted\nOfficer activity log\nDependency context"]

    G --> H["Escalation to NODAL OFFICER\nAutomatic Notification and Evidence"]

    H --> I{Nodal Officer Decision}
    I -->|Intervene| J["Force-Assign to Available Officer\nNew SLA Window Begins\nOriginal Breach Preserved in Log"]
    I -->|Deemed Approval| K["GUARDRAIL CHECK\nDeemed Approval ONLY if\nStatutory Process Permits\nAuthorized Human must invoke\nNOT automatic"]
    I -->|Formal Extension| L["Extension Granted with Reason\nNew Deadline Set\nFull Audit Trail"]

    J & K & L --> M["All Actions Hashed\nand Added to Audit Chain"]
    M --> N["Delay Analytics Updated\nBottleneck Dashboard Refreshed\nAdmin Notified"]
```

---

## 9. Inspection Management Flow (Inspector App)

```mermaid
flowchart TD
    subgraph APP["Inspector App Expo React Native"]
        A["Dashboard Home Screen\nAssigned Inspections Summary"] --> B["Inspections List Screen\nAll Assigned and Pending"]
        B --> C["Inspection Detail Screen\nBusiness Info and Required Checks"]

        C --> D["Officer Check-In Screen\nGPS Location Recorded\nTimestamp Locked"]
        D --> E["Verification Checklist Screen\nStructured Checklist per Department\nPhoto Evidence per Item"]

        E --> F["Field Observations Screen\nFree-form Notes\nVoice-to-Text planned"]
        F --> G["Camera Screen\nPhoto Capture\nEXIF Metadata Preserved\nGPS Coordinates in Image"]
        G --> F

        F --> H{Single or Joint Inspection?}
        H -->|Single Dept| I["Report Screen\nAuto-generated from Checklist\nOfficer Sign-off"]
        H -->|Multi Dept| J["Joint Inspection Screen\nMultiple Officers\nConsolidated Report"]
        J --> I

        I --> K["Submit Report\nSync to Backend API"]
    end

    subgraph BACKEND_SYNC["Backend Processing"]
        K --> L["Photo Hashed SHA-256\nGPS and EXIF Metadata Stored"]
        L --> M["Inspection Record Created\nin MongoDB"]
        M --> N["Approval Graph Updated\nInspection Status Node Updated"]
        N --> O["Event Anchored\nin Cryptographic Audit Chain"]
    end

    subgraph JOINT["Joint Inspection Scheduling"]
        P["Multiple Dept Inspection\nRequired for Same Business"] --> Q["Common Slot Optimizer\nQuery Officer Calendars\nand Location Logistics\nand Statutory Permissions"]
        Q --> R["Slot Proposed to All Officers\nNotification Sent"]
        R --> S["Officers Confirm\nInspection Scheduled"]
    end
```

---

## 10. Cryptographic Ledger — Audit & Tamper-Evident Chain

```mermaid
flowchart TD
    subgraph EVENTS["Trackable Events Off-Chain State"]
        E1["USER_CREATED"]
        E2["BUSINESS_PROFILE_CREATED"]
        E3["BUSINESS_PROFILE_UPDATED"]
        E4["ENTITYLOCKER_CONNECTED"]
        E5["CONSENT_GRANTED or DENIED"]
        E6["DOCUMENTS_ACCESSED"]
        E7["DOCUMENT_UPLOADED"]
        E8["KYA_COMPLETED"]
        E9["APPROVAL_DECISION\nApproved Rejected Queried"]
        E10["INSPECTION_COMPLETED\nwith GPS and Photo hash"]
        E11["SLA_BREACHED"]
        E12["ESCALATION_TRIGGERED"]
        E13["RULE_VERSION_CREATED"]
        E14["GRIEVANCE_FILED"]
    end

    subgraph CHAIN["SHA-256 Hash Chain MongoDB Operational"]
        H0["Genesis Block\nHash SHA256 genesis\nprevHash null"]
        H1["Event Block 1\neventType USER_CREATED\ntimestamp T1\ndata userId roleHash\nprevHash H0\nhash SHA256 data+prevHash"]
        H2["Event Block 2\neventType KYA_COMPLETED\ntimestamp T2\ndata businessId docList\nprevHash H1\nhash SHA256 data+prevHash"]
        H3["Event Block N\nmore events\nprevHash H N-1\nhash SHA256 data+prevHash"]

        H0 --> H1 --> H2 --> H3
    end

    EVENTS -->|Each event triggers| CHAIN

    subgraph ANCHOR["Ethereum Anchoring Periodic"]
        A1["Root Hash of Chain\nSHA256 of all current hashes"]
        A2["Submit to Ethereum\nvia ethers.js or Web3.js\nPublic Testnet or Mainnet"]
        A3["Transaction Hash\nStored in MongoDB\nas proof of anchor"]
        A4["Periodic Anchoring\nEvery N events or Time interval"]

        A1 --> A2 --> A3
        A4 -->|triggers| A1
    end

    H3 -->|Chain Head Hash| ANCHOR

    subgraph SENSITIVE["What NEVER Goes On-Chain"]
        S1["Full Aadhaar number"]
        S2["PAN document content"]
        S3["Financial documents PDFs"]
        S4["Personal photos"]
        S5["Private business data"]
        NOTE2["Only SHA-256 hashes of events\nOnly Role hashes not personal identity\nOnly Timestamps\nOnly Event type labels"]
    end

    subgraph STORAGE["Document Content Storage"]
        DS1["Encrypted Object Storage\nAWS S3 or MinIO\nfor Uploaded Documents"]
        DS2["IPFS\nPlanned for decentralized\ncontent addressing"]
        DS3["Content-addressed by hash\nDocument hash stored in chain\nContent stored off-chain"]
    end

    subgraph QR_VERIFY["QR Verification Flow"]
        QR1["QR Code Generated\nLinks to verify businessId"]
        QR2["Anyone Scans QR\nAuditor Court Regulator"]
        QR3["Backend Reconstructs\nHash Chain from DB"]
        QR4["Recomputes All Hashes\nCompares with Stored Values"]
        QR5{Chain Intact?}
        QR6["Show Clearance History\nDepartment + Status + Timestamp\nPrivate docs protected"]
        QR7["TAMPER DETECTED\nAlert Chain broken at block N"]

        QR1 --> QR2 --> QR3 --> QR4 --> QR5
        QR5 -->|Hashes Match| QR6
        QR5 -->|Mismatch Found| QR7
    end

    A3 -->|Anchor proves chain existed at time T| QR_VERIFY
```

---

## 11. Admin Panel Workflows

```mermaid
flowchart TD
    subgraph ADMINPANEL["Admin Panel React SPA"]

        subgraph DASH["Dashboard /admin"]
            D1["Total Applications Count"]
            D2["SLA Breach Rate percent"]
            D3["Avg Processing Time per Dept"]
            D4["Active Inspections Count"]
            D5["Rule Versions Pending Verification"]
            D6["Bottleneck Heatmap by Department"]
        end

        subgraph APPS["Applications /admin/applications"]
            A1["Filter by Status Sector\nDept Date Business ID"]
            A2["View Approval Graph per Application"]
            A3["View Audit Trail and QR"]
            A4["Bulk Actions Reassign or Flag"]
        end

        subgraph DEPTS["Departments /admin/departments"]
            DP1["Officer Queue View\nWith SLA Countdown"]
            DP2["Document Review Interface"]
            DP3["Approve Reject Query Action"]
            DP4["Inspection Scheduling Calendar"]
        end

        subgraph RULES["Rules /admin/rules"]
            R1["View Current Rule Versions"]
            R2["Propose Regulatory Change"]
            R3["AI Structures Candidate Rule"]
            R4["Human Verifies New Version Created"]
            R5["Impact Analysis Affected Apps"]
            R6["Simulation What-if Profile Change"]
        end

        subgraph SLA["SLA Monitor /admin/sla"]
            SL1["All Active SLA Timers"]
            SL2["Approaching Breach Red Alert"]
            SL3["Breached Escalation Status"]
            SL4["Historical Breach Rate Trend"]
        end

        subgraph ESC["Escalations /admin/escalations"]
            ES1["Active Escalations List"]
            ES2["Evidence Package View"]
            ES3["Nodal Officer Action Interface"]
            ES4["Resolution History"]
        end

        subgraph USERS["Users /admin/users"]
            U1["User List with Roles"]
            U2["Assign OFFICER or NODAL_OFFICER"]
            U3["Department Assignment"]
            U4["Activity Log per User"]
        end
    end

    subgraph ROLES["Role Access Control"]
        ADMIN_R["ADMIN\nAll modules\nRule authoring\nSystem configuration"]
        NODAL_R["NODAL_OFFICER\nEscalations\nImpact analysis\nDept oversight"]
        OFFICER_R["OFFICER\nDept workbench\nApprove Reject\nInspection"]
        USER_R["USER\nOwn tracker\nOwn audit view\nSimulation"]
    end

    DASH & APPS & DEPTS & RULES & SLA & ESC & USERS --- ROLES
```

---

## 12. Regulatory Rule Versioning Flow

```mermaid
flowchart TD
    A["Regulatory Change Detected\nGazette Notification or Policy Update"] --> B["AI or LLM Structures\nCandidate Rule Object"]

    B --> C["Rule Candidate Created\nFields ruleId jurisdiction authority\nsector activity entityType\nthresholds conditions documents\ninspectionRequired fee SLA\nsource effectiveFrom version"]

    C --> D["ADMIN Verifies Rule\nHuman in the Loop Non-Negotiable\nLLM cannot activate legal requirements"]

    D --> E{Human Decision}
    E -->|Approved| F["New Version Persisted\nOLD version preserved never deleted\nVersion N to N+1\nEffective date set"]
    E -->|Edit Required| B
    E -->|Rejected| G["Candidate Discarded\nAudit log entry created"]

    F --> H["Impact Analysis\nQuery Neo4j which approval nodes\nuse this rule\nQuery MongoDB which active\napplications are affected"]

    H --> I["Impact Report Generated\nList of affected businesses\nAffected approval graph nodes\nDocuments now required or removed"]

    I --> J["Notifications Sent\nTo affected applicants\nRegulatory update affects your application"]

    J --> K["Approval Graphs Updated\nNew nodes and edges per rule change\nActive apps re-evaluated"]

    K --> L["Historical Applications\nRetain their ORIGINAL rule snapshot\nNOT retroactively changed"]

    L --> M["New Rule Version Event\nHashed and Added to Audit Chain"]

    subgraph SIM["Simulation What-If"]
        S1["User changes profile variable\nLPG usage employee count"]
        S2["Clone app and profile state"]
        S3["Re-run KYA rules on clone"]
        S4["Diff Added Removed Changed approvals"]
        S5["Display comparison NO ledger mutation"]
        S1 --> S2 --> S3 --> S4 --> S5
    end
```

---

## 13. Backend API Architecture

```mermaid
graph LR
    subgraph ROUTES["Express Routes"]
        R1["/api/auth\nauthRoutes.js\nPOST signup verify-otp signin"]
        R2["/api/business-profile\nbusinessProfileRoutes.js\nPOST GET PUT"]
        R3["/api/integrations/digilocker\ndigilockerRoutes.js\nPOST connect verify-otp\nGET documents"]
        R4["/api/integrations/entitylocker\nentitylockerRoutes.js\nPOST connect\nGET documents"]
        R5["/api/kya\nkyaRoutes.js\nPOST run\nGET result id"]
        R6["/api/consent\nconsentRoutes.js\nPOST grant\nGET status"]
        R7["/api/documents\ndocumentsRoutes.js\nPOST upload\nGET list\nPOST match"]
        R8["/api misc\nmiscRoutes.js\nGET dashboard notifications\nGET incentives\nPOST rag/ask"]
    end

    subgraph MW["Middleware Stack"]
        M1["helmet Security Headers"]
        M2["cors Cross-Origin Config"]
        M3["express.json 2mb Request Parsing"]
        M4["auth.js JWT Verification\nRole Guard"]
        M5["express-rate-limit DDoS Protection"]
        M6["errorHandler.js\nCentralized Error Response"]
    end

    subgraph CTRL["Controllers"]
        C1["authController.js\nSignup OTP Signin\nbcrypt + JWT"]
        C2["businessProfileController.js\nCRUD Profile"]
        C3["digilockerController.js\nMock OAuth Flow"]
        C4["entitylockerController.js\nMock Entity Lookup"]
        C5["kyaController.js\nTrigger KYA Engine"]
        C6["consentController.js\nConsent CRUD"]
        C7["documentsController.js\nUpload Match List"]
        C8["miscController.js\nDashboard Notifications\nIncentives RAG Q&A"]
    end

    subgraph SVC["Services"]
        S1["digilocker\nMock OAuth Adapter"]
        S2["entitylocker\nMock Entity Adapter"]
        S3["kya\nRule Engine Logic"]
        S4["documents\nOCR + Matcher"]
        S5["notifications\nEmail SMS Push"]
        S6["audit\nHash Chain Logger"]
    end

    ROUTES --> MW --> CTRL --> SVC
```

---

## 14. Database & Storage Architecture

```mermaid
erDiagram
    USER {
        ObjectId id
        string name
        string email
        string phone
        string aadhaarLast4
        string aadhaarHash
        string role
        boolean isVerified
        date createdAt
    }

    BUSINESS_PROFILE {
        ObjectId id
        ObjectId userId
        string businessName
        string entityType
        string sector
        string nicActivityCode
        string panMasked
        string gstin
        string udyamNumber
        string cinOrLlpin
        number investment
        number annualTurnover
        number employeeCount
        string environmentalCategory
        boolean hazardousMaterial
        string fieldVerificationStatus
    }

    KYA_RESULT {
        ObjectId id
        ObjectId businessId
        string requiredDocuments
        date generatedAt
    }

    CONSENT_RECORD {
        ObjectId id
        ObjectId userId
        ObjectId businessId
        string source
        string purpose
        boolean granted
        date expiry
        string consentVersion
    }

    DOCUMENT_METADATA {
        ObjectId id
        ObjectId userId
        ObjectId businessId
        string documentType
        string source
        string fileName
        string storageKey
        string status
    }

    AUDIT_LOG {
        ObjectId id
        ObjectId userId
        ObjectId businessId
        string eventType
        string prevHash
        string hash
        string metadata
        date createdAt
    }

    NOTIFICATION {
        ObjectId id
        ObjectId userId
        string title
        string body
        boolean read
    }

    USER ||--o{ BUSINESS_PROFILE : "creates"
    BUSINESS_PROFILE ||--o{ KYA_RESULT : "generates"
    BUSINESS_PROFILE ||--o{ CONSENT_RECORD : "has"
    BUSINESS_PROFILE ||--o{ DOCUMENT_METADATA : "holds"
    USER ||--o{ AUDIT_LOG : "actor"
    BUSINESS_PROFILE ||--o{ AUDIT_LOG : "subject"
    USER ||--o{ NOTIFICATION : "receives"
```

---

## 15. Security & RBAC Flow

```mermaid
flowchart TD
    A["Incoming Request"] --> B["Helmet.js\nSecurity Headers Applied\nCSP HSTS X-Frame-Options"]
    B --> C["CORS Policy Check\nAllowed Origins Validated"]
    C --> D["Rate Limiter\nexpress-rate-limit\nPrevents DDoS and Brute Force"]
    D --> E{Has JWT Token?}

    E -->|No| F["Public Routes Only\n/api/health /api/auth"]
    E -->|Yes| G["JWT Verification\njsonwebtoken.verify\nSecret key check + Expiry"]

    G --> H{Token Valid?}
    H -->|Invalid or Expired| I["401 Unauthorized\nClear client token"]
    H -->|Valid| J["Extract User Role\nUSER OFFICER\nNODAL_OFFICER ADMIN"]

    J --> K{Check Required Role\nfor Route}
    K -->|Insufficient| L["403 Forbidden\nRole not permitted"]
    K -->|Authorized| M["Controller Executes\nBusiness Logic"]

    M --> N["Audit Log Entry\nAll significant actions logged\nWith role hash not identity"]

    subgraph AADHAAR_SAFETY["Aadhaar Data Safety"]
        AS1["Receive Aadhaar Input"]
        AS2["bcrypt hash immediately"]
        AS3["Store ONLY aadhaarHash in DB"]
        AS4["Store ONLY last 4 digits aadhaarLast4"]
        AS5["NEVER store full Aadhaar\nNEVER log Aadhaar\nNEVER put on chain"]
        AS1 --> AS2 --> AS3 & AS4 & AS5
    end

    subgraph BLOCKCHAIN_PRIVACY["Blockchain Privacy Rules"]
        BP1["On-chain SHA-256 event hashes"]
        BP2["On-chain Timestamps"]
        BP3["On-chain Role hashes"]
        BP4["On-chain Event type labels"]
        BP5["Off-chain All personal data"]
        BP6["Off-chain Document content"]
        BP7["Off-chain Financial records"]
    end
```

---

## 16. Planned Backend Implementations

```mermaid
flowchart TD
    subgraph PHASE1["Phase 1 Core Implemented"]
        P1_1["Auth OTP Signup Login\nbcrypt + JWT"]
        P1_2["Business Profile CRUD\nMongoDB Mongoose"]
        P1_3["KYA Engine Deterministic\nRule-based checklist generation"]
        P1_4["DigiLocker Mock Adapter\nOAuth simulation"]
        P1_5["EntityLocker Mock Adapter\nEntity document lookup"]
        P1_6["Consent Management\nConsentRecord model"]
        P1_7["Document Metadata\nUpload and Referenced tracking"]
        P1_8["Audit Log\nEvent-level logging in MongoDB"]
        P1_9["Notifications\nIn-app notification model"]
        P1_10["Incentives Matcher\nProfile-driven scheme matching"]
    end

    subgraph PHASE2["Phase 2 Intelligence Planned"]
        P2_1["OCR Integration\nTesseract.js or Google Vision API\nDocument text extraction"]
        P2_2["NLP Field Extractor\nExtract business name PAN\nemployee count from doc text"]
        P2_3["Document Matcher v2\nConfidence scoring\nMismatch detection with field diff"]
        P2_4["RAG Endpoint POST /api/rag/ask\nLLM + regulatory knowledge base\nPolicy Q&A with source attribution"]
        P2_5["Approval Graph in Neo4j\nDAG creation from KYA output\nCypher queries for dependency resolution"]
        P2_6["Joint Inspection Scheduler\nCommon slot optimizer\nacross officers and departments"]
    end

    subgraph PHASE3["Phase 3 Cryptographic Ledger Planned"]
        P3_1["SHA-256 Hash Chaining\nEach AuditLog event\nhash equals SHA256 data + prevHash"]
        P3_2["Chain Verification API\nGET /api/audit/verify businessId\nRecompute and compare all hashes"]
        P3_3["Ethereum Anchoring Service\nethers.js or Web3.js\nPeriodic root hash submission\nto public testnet Sepolia"]
        P3_4["QR Code Generation\nPOST /api/audit/generate-qr\nLinks to public clearance view"]
        P3_5["Public QR Verification Page\nGET /verify businessId\nTamper-evident clearance history"]
        P3_6["IPFS Integration\nDocument content addressing\nContent hash stored on-chain"]
    end

    subgraph PHASE4["Phase 4 Workflow Engine Planned"]
        P4_1["SLA Engine\nCron-based timer monitoring\nAutomatic escalation trigger"]
        P4_2["Escalation Service\nEvidence package builder\nNotification to Nodal Officer"]
        P4_3["Regulatory Rule Versioning API\nPOST /api/admin/rules\nVersion history preserved in DB"]
        P4_4["Impact Analysis Engine\nNeo4j + MongoDB cross-query\nAffected applications per rule change"]
        P4_5["Simulation Engine What-If\nClone profile state\nRe-run KYA and diff output"]
        P4_6["Grievance Linkage\nContextual grievance to application\nstage + department + SLA"]
    end

    subgraph PHASE5["Phase 5 Production Integrations Future"]
        P5_1["Real DigiLocker Integration\nReplace mock with production OAuth 2.0\nNSDL DigiLocker API"]
        P5_2["Real EntityLocker Integration\nReplace mock with production API\nMCA21 or NeSL connector"]
        P5_3["Bhashini API\nMultilingual UI and notifications\nRegional language support"]
        P5_4["WhatsApp Business API\nOTP + Notification delivery\nCitizen communication"]
        P5_5["DPDP Act Compliance Layer\nData minimization enforcer\nConsent lifecycle manager\nRight-to-erasure handler"]
        P5_6["Fee Payment Gateway\nRazorpay or PayGov integration\nFee collection per approval"]
    end

    PHASE1 --> PHASE2 --> PHASE3 --> PHASE4 --> PHASE5
```

---

## Complete Platform Summary

```mermaid
graph TB
    subgraph CITIZEN["Citizen / Applicant"]
        C1["Web Browser\nReact + Vite Frontend"]
    end

    subgraph OFFICER["Department Officer / Nodal Officer"]
        O1["Inspector App\nExpo React Native"]
        O2["Admin Panel\nReact SPA /admin"]
    end

    subgraph BACKEND["Backend Node.js + Express"]
        B1["Auth Service\nJWT + OTP + bcrypt"]
        B2["Business Profile Service"]
        B3["KYA Deterministic Engine"]
        B4["Document Service\nOCR + NLP + Matcher"]
        B5["Workflow Orchestrator\nApproval Graph Engine"]
        B6["SLA Monitor + Escalator"]
        B7["Audit + Hash Chain Service"]
        B8["Notification Service"]
        B9["RAG Policy Q&A"]
        B10["Incentive Matcher"]
    end

    subgraph STORE["Storage"]
        DB1["MongoDB\nUsers Profiles Docs\nConsents Audit Logs"]
        DB2["Neo4j\nApproval Graph DAG\nDependency Intelligence"]
        DB3["Object Storage IPFS\nDocument Content"]
    end

    subgraph GOVAPI["Govt APIs Mock to Production"]
        G1["DigiLocker\nAadhaar-linked Documents"]
        G2["EntityLocker\nBusiness Documents"]
        G3["API Setu Gateway"]
        G4["Bhashini Multilingual"]
    end

    subgraph LEDGER["Cryptographic Ledger"]
        L1["SHA-256 Hash Chain\nMongoDB Audit Log"]
        L2["Ethereum Anchoring\nPublic Verifiability"]
        L3["QR Verification\nPublic Audit View"]
    end

    CITIZEN <--> BACKEND
    OFFICER <--> BACKEND
    BACKEND <--> STORE
    BACKEND <--> GOVAPI
    BACKEND --> LEDGER
```

---

> **Document Version**: 1.0
> **Project**: SIH 2026 PS26130 PragatiSetu
> **Generated**: September 2026
> **Stack**: React + Vite, Node.js Express, MongoDB, Neo4j, Ethereum, Expo React Native
> **Security**: SHA-256 Hash Chain, JWT, bcrypt, RBAC, DPDP Act compliance planned
