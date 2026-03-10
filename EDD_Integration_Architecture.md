# EDD Digital Case Management System
# Integration Architecture Document
## Qatar Islamic Bank (QIB) S.A.Q.

---

| | |
|---|---|
| **Document ID** | INT-ARCH-EDD-2026-001 |
| **Version** | 1.0 |
| **Date** | March 10, 2026 |
| **Classification** | Internal — QIB Confidential |
| **Prepared By** | IT Architecture & Integration Team |

---

## 1. Integration Architecture Overview

The EDD Digital Case Management System operates as an extension module within the FLOW Workflow Platform and integrates with QIB's enterprise systems through the existing Enterprise Service Bus (ESB).

### 1.1 Architecture Principles

| Principle | Description |
|-----------|-------------|
| No New Platform | EDD module extends the existing FLOW platform — no new infrastructure |
| Reuse Existing Integration | Leverages established ESB connectivity to T24, DMS, QCB |
| Loose Coupling | All external integrations via API/ESB — no direct database connections |
| Read-Only External Data | T24 and QCB data displayed as read-only; only writeback goes to T24 |
| Audit Everything | All API calls and data retrievals are logged in the audit trail |

### 1.2 Enterprise Integration Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              QIB ENTERPRISE ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │     T24      │  │  SnapView   │  │   QCB KYC   │  │    RISK     │  │   DMS    │ │
│  │ Core Banking │  │  Reporting  │  │     API     │  │   ENGINE    │  │Documents │ │
│  │             │  │             │  │             │  │             │  │          │ │
│  │ • Customer  │  │ • Salary    │  │ • Passport  │  │ • AML Lists │  │ • Upload │ │
│  │ • Accounts  │  │ • Income    │  │ • ID Card   │  │ • PEP Lists │  │ • Retrieve│ │
│  │ • Risk Class│  │ • Txn Hist  │  │ • Certs     │  │ • Sanctions │  │ • Version│ │
│  │ • KYC Dates │  │ • Balances  │  │ • Address   │  │ • Country   │  │ • Archive│ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬────┘ │
│         │                │                │                │               │       │
│         └────────────────┴───────┬────────┴────────────────┴───────────────┘       │
│                                  │                                                  │
│                    ┌─────────────▼─────────────┐                                   │
│                    │                           │                                   │
│                    │   ESB INTEGRATION LAYER    │                                   │
│                    │  (Enterprise Service Bus)  │                                   │
│                    │                           │                                   │
│                    │  • API Gateway            │                                   │
│                    │  • Message Routing        │                                   │
│                    │  • Protocol Translation   │                                   │
│                    │  • Error Handling         │                                   │
│                    │  • Rate Limiting          │                                   │
│                    │  • Logging & Monitoring   │                                   │
│                    │                           │                                   │
│                    └─────────────┬─────────────┘                                   │
│                                  │                                                  │
│    ┌─────────────────────────────▼───────────────────────────────────────────┐      │
│    │                                                                         │      │
│    │                      FLOW WORKFLOW PLATFORM                             │      │
│    │                                                                         │      │
│    │    ┌─────────────────────────────────────────────────────────────┐     │      │
│    │    │            EDD CASE MANAGEMENT MODULE                       │     │      │
│    │    │                                                             │     │      │
│    │    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │     │      │
│    │    │  │Dashboard │  │EDD Form  │  │Workflow  │  │Risk Panel│  │     │      │
│    │    │  │& Queues  │  │(11 Sect) │  │Engine    │  │& Indic.  │  │     │      │
│    │    │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │     │      │
│    │    │                                                             │     │      │
│    │    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │     │      │
│    │    │  │Audit     │  │Compliance│  │Notif.    │  │Validation│  │     │      │
│    │    │  │Console   │  │Module    │  │Engine    │  │Engine    │  │     │      │
│    │    │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │     │      │
│    │    │                                                             │     │      │
│    │    └─────────────────────────────────────────────────────────────┘     │      │
│    │                                                                         │      │
│    └─────────────────────────────────────────────────────────────────────────┘      │
│                                  │                                                  │
│          ┌───────────────────────┼───────────────────────┐                          │
│          │                       │                       │                          │
│   ┌──────▼──────┐         ┌──────▼──────┐         ┌──────▼──────┐                  │
│   │  Email/SMS  │         │  Audit Log  │         │   Mobile    │                  │
│   │Notifications│         │   Storage   │         │Push / App   │                  │
│   └─────────────┘         └─────────────┘         └─────────────┘                  │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Integration Points — Detailed Specifications

### 2.1 T24 Core Banking Integration

| Attribute | Specification |
|-----------|--------------|
| **System** | Temenos T24 Core Banking |
| **Protocol** | REST/SOAP via ESB |
| **Authentication** | API Key + JWT Token |
| **Direction** | Bidirectional |
| **SLA** | < 2 seconds response time |
| **Availability** | 99.5% uptime |

#### Inbound Data (T24 → EDD)

| API Endpoint | Data Retrieved | EDD Form Section | Auto-Populated |
|-------------|---------------|-------------------|----------------|
| `GET /customer/rim/{id}` | Customer Name, DOB, Nationality | Section 2 | Yes |
| `GET /customer/segment/{rim}` | Customer Segment (Mass/Tamayuz/Private) | Routing Logic | Yes |
| `GET /customer/risk/{rim}` | Risk Classification (High/Medium/Low) | Section 1 | Yes |
| `GET /customer/kyc/{rim}` | KYC Status, Last KYC Date, Next Due | Case Trigger | Yes |
| `GET /customer/accounts/{rim}` | Account List, Types, Balances | Section 7A | Yes |
| `GET /customer/pep/{rim}` | PEP Flag, PEP Category | Section 9 | Yes |
| `GET /customer/employment/{rim}` | Employer, Designation, Salary | Section 4A | Yes |

#### Outbound Data (EDD → T24 Writeback)

| API Endpoint | Data Written | Trigger |
|-------------|-------------|---------|
| `PUT /customer/edd/{rim}` | EDD Status (Completed/Pending/Expired) | Case closure |
| `PUT /customer/edd/{rim}/decision` | EDD Decision (Approved/Conditional/Rejected) | Final decision |
| `PUT /customer/edd/{rim}/restriction` | Account Restriction Code | Compliance decision |
| `PUT /customer/edd/{rim}/next-due` | Next EDD Due Date | Case closure |

#### Data Flow Diagram — T24

```
T24 CORE BANKING                          EDD CASE MODULE
─────────────────                          ───────────────
                     CASE CREATION
Customer Master ──────────────────────────▶ Auto-populate Sections 1, 2
Risk Profile    ──────────────────────────▶ Auto-populate Risk Classification
Account Data    ──────────────────────────▶ Auto-populate Section 7
PEP Flag        ──────────────────────────▶ Auto-populate Section 9
Employment      ──────────────────────────▶ Auto-populate Section 4A

                     CASE CLOSURE
                ◀────────────────────────── EDD Status
                ◀────────────────────────── EDD Decision
                ◀────────────────────────── Account Restriction
                ◀────────────────────────── Next Due Date
```

---

### 2.2 SnapView / Snapshot Integration

| Attribute | Specification |
|-----------|--------------|
| **System** | SnapView Financial Reporting Platform |
| **Protocol** | REST API / ETL Batch |
| **Authentication** | Service Account |
| **Direction** | Read-Only (Inbound) |
| **SLA** | < 3 seconds response time |

#### Data Retrieved

| Data Category | Fields | Used In |
|-------------|--------|---------|
| Salary Analytics | Monthly salary, employer, frequency, gaps | Financial Intelligence Panel |
| Income Verification | Declared vs. actual income comparison | Risk Indicators |
| Transaction Patterns | Monthly volumes, averages, anomalies | Section 6 / Risk Panel |
| Balance History | 12-month balance trend, high/low | Financial Profile |
| Cash Activity | Cash deposit/withdrawal patterns | Transaction Monitoring |
| Wire Transfers | International wire frequency, countries | Section 6 / Country Exposure |

#### ETL Data Fields

| Field Name | Source Table | Update Frequency | Format |
|-----------|-----------|-----------------|--------|
| SALARY_AMOUNT | SNAP.SALARY_CREDITS | Daily | Decimal(15,2) |
| EMPLOYER_NAME | SNAP.SALARY_CREDITS | Daily | VARCHAR(100) |
| TXN_VOLUME_MTD | SNAP.TXN_SUMMARY | Hourly | Integer |
| TXN_VALUE_MTD | SNAP.TXN_SUMMARY | Hourly | Decimal(18,2) |
| CASH_DEPOSIT_MTD | SNAP.CASH_ACTIVITY | Hourly | Decimal(18,2) |
| WIRE_OUT_MTD | SNAP.WIRE_TRANSFERS | Hourly | Decimal(18,2) |
| BALANCE_AVG_3M | SNAP.BALANCE_HISTORY | Daily | Decimal(18,2) |
| BALANCE_AVG_12M | SNAP.BALANCE_HISTORY | Daily | Decimal(18,2) |

---

### 2.3 QCB KYC API Integration

| Attribute | Specification |
|-----------|--------------|
| **System** | Qatar Central Bank — KYC Verification API |
| **Protocol** | REST API (HTTPS) |
| **Authentication** | OAuth 2.0 + Client Certificate |
| **Direction** | Read-Only (Inbound) |
| **SLA** | < 5 seconds response time |
| **IP Requirement** | QIB registered IP whitelist only |

#### API Endpoints

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/api/v1/kyc/verify/{qid}` | GET | Verify QID document against national registry | Match status, confidence score |
| `/api/v1/kyc/passport/{number}` | GET | Passport verification | Validity, expiry, match result |
| `/api/v1/kyc/address/{qid}` | GET | Address proof verification | Address match, source |
| `/api/v1/kyc/certificates/{qid}` | GET | Trade license, commercial registration | Certificate status, validity |
| `/api/v1/kyc/pep-check/{qid}` | GET | PEP status check | PEP classification, details |

#### QCB Data Visibility by Role

| Data Element | Business View | CDD View | Compliance View |
|-------------|--------------|----------|----------------|
| QID Verification Status | ✅ Status only | ✅ Full details | ✅ Full details |
| Passport Verification | ✅ Valid/Invalid | ✅ Full details | ✅ Full + audit |
| Nationality Confirmation | ✅ Confirmed | ✅ Source data | ✅ Source + history |
| PEP Classification | ❌ Hidden | ✅ Alert indicator | ✅ Full PEP profile |
| Sanctions Status | ❌ Hidden | ⚠️ Flag only | ✅ Full details |
| Regulatory Notes | ❌ Hidden | ❌ Hidden | ✅ Full access |

**All QCB data is read-only and every access is logged in the audit trail.**

---

### 2.4 Document Management System (DMS)

| Attribute | Specification |
|-----------|--------------|
| **System** | QIB Document Management System |
| **Protocol** | REST API (HTTPS) |
| **Authentication** | JWT Token |
| **Direction** | Bidirectional |
| **SLA** | < 2 seconds response time |

#### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/v1/documents/upload` | POST | Upload EDD documents |
| `GET /api/v1/documents/{caseId}` | GET | Retrieve case documents |
| `GET /api/v1/documents/{docId}/download` | GET | Download specific document |
| `PUT /api/v1/documents/{docId}/verify` | PUT | Mark document as verified |
| `GET /api/v1/documents/{docId}/versions` | GET | Get document version history |

#### Document Types Managed

| Document Type | Source | Required | Retention |
|-------------|-------|----------|-----------|
| QID Copy | Customer | Yes (all cases) | 7 years |
| Passport Copy | Customer | Yes (non-resident) | 7 years |
| Salary Certificate | Customer/Employer | Conditional | 7 years |
| Bank Statements | Customer/Other bank | Conditional | 7 years |
| Trade License | Customer | Conditional (business) | 7 years |
| Address Proof | Customer | Yes (all cases) | 7 years |
| Source of Wealth Evidence | Customer | Yes (high risk) | 7 years |
| EDD Assessment Report | CDD Officer | Auto-generated | 7 years |

---

### 2.5 Risk Dataset Integration

| Attribute | Specification |
|-----------|--------------|
| **System** | QIB Internal Risk Database |
| **Protocol** | Internal DB / REST API |
| **Authentication** | Service Account |
| **Direction** | Read-Only |
| **SLA** | < 1 second response time |

#### Data Provided

| Dataset | Content | Update Frequency |
|---------|---------|-----------------|
| AML Screening Results | Transaction monitoring alerts, suspicious patterns | Real-time |
| PEP Lists | Domestic PEP, Foreign PEP, International Org PEP | Daily |
| Sanctions Lists | UN, EU, OFAC, UK, Qatar National, World Bank | Daily |
| Country Risk Ratings | High/Medium/Low risk country classifications | Monthly |
| Adverse Media | Negative news screening results | Daily |
| Internal Watchlist | Bank internal flagged customers | Real-time |

---

### 2.6 Notification Infrastructure

| Channel | Protocol | Purpose | SLA |
|---------|----------|---------|-----|
| Email (SMTP) | SMTP/TLS | Case assignments, SLA warnings, decisions | Best effort |
| SMS Gateway | REST API | Urgent escalations, SLA breaches | < 30 seconds |
| Mobile Push | REST API | Real-time case updates | < 10 seconds |
| In-App Notification | WebSocket | Live feed on dashboard | Real-time |

---

## 3. Data Flow Architecture — End-to-End

```
PHASE 1: CASE TRIGGER
══════════════════════════════════════════════════════════════════
T24 CRP Alert ──┐
Management Ref ──┤──▶ ESB ──▶ FLOW EDD Module ──▶ Case Created
Periodic Due   ──┤                                   │
AML Alert      ──┘                                   │
                                                     ▼
PHASE 2: DATA ENRICHMENT
══════════════════════════════════════════════════════════════════
T24 ──────▶ Customer Master, Risk Class, Accounts ──▶ ┐
SnapView ──▶ Salary, Income, Transaction Data ──────▶ ├──▶ Case Record
QCB API ───▶ ID Verification, PEP Check ────────────▶ │    (Enriched)
Risk DB ───▶ AML Screening, Sanctions ──────────────▶ │
DMS ───────▶ Existing Documents ────────────────────▶ ┘
                                                     │
                                                     ▼
PHASE 3: WORKFLOW PROCESSING
══════════════════════════════════════════════════════════════════
Business Maker ──▶ Business Checker ──▶ CDD Maker ──▶ CDD Checker
     │                    │                  │              │
     ▼                    ▼                  ▼              ▼
  Collect Docs      Approve/Return    SOF/SOW Review   Approve/Escalate
  Fill Form Sec 1-10  Route to CDD    Transaction Anl   CDD Sign-off
                                      PEP Screening
                                                     │
                                                     ▼
                                              ┌──────────────┐
                                              │ Escalation?  │
                                              └──────┬───────┘
                                         No ◀────────┴────────▶ Yes
                                         │                      │
                                         ▼                      ▼
                                    Close Case          Compliance Review
                                                              │
                                                              ▼
                                                       Final Decision

PHASE 4: CASE CLOSURE & WRITEBACK
══════════════════════════════════════════════════════════════════
Decision ──▶ T24 Writeback (Status, Decision, Restriction, Next Due)
         ──▶ DMS Archive (All documents + assessment report)
         ──▶ Notification (Email/SMS to RM, CDD, Compliance)
         ──▶ Audit Log (Final entry with hash-chain seal)
         ──▶ Dashboard Update (Real-time metrics refresh)
```

---

## 4. API Error Handling & Resilience

### 4.1 Error Handling Strategy

| Scenario | System Response | User Experience |
|----------|---------------|-----------------|
| T24 API timeout (> 2s) | Retry 2x with exponential backoff | "Loading..." indicator; data shown from cache |
| QCB API unavailable | Log error; display "Verification Pending" | Manual verification fallback |
| DMS upload failure | Retry 3x; queue for retry | "Upload pending" status; auto-retry |
| ESB connection lost | Circuit breaker activates | "System temporarily unavailable" message |
| Invalid API response | Log full response; raise alert | "Data verification in progress" |

### 4.2 Circuit Breaker Configuration

| System | Failure Threshold | Reset Timeout | Half-Open Max |
|--------|------------------|---------------|---------------|
| T24 | 5 failures in 60s | 30 seconds | 3 requests |
| QCB KYC | 3 failures in 60s | 60 seconds | 1 request |
| DMS | 5 failures in 60s | 30 seconds | 3 requests |
| SnapView | 5 failures in 120s | 60 seconds | 2 requests |

---

## 5. Security — Integration Layer

### 5.1 API Security Controls

| Control | Implementation | Standard |
|---------|---------------|----------|
| Transport Encryption | TLS 1.3 on all API calls | ISO 27001 A.8.24 |
| Authentication | JWT + OAuth 2.0 (QCB uses client certificate) | ISO 27001 A.8.5 |
| Authorization | RBAC enforced at API gateway | COBIT DSS05.04 |
| Rate Limiting | 100 req/min per user, 1000 req/min per service | ISO 27001 A.8.20 |
| Input Validation | Server-side validation on all API payloads | ISO 27001 A.8.26 |
| Logging | All API calls logged with request/response hash | ISO 27001 A.8.15 |
| IP Whitelisting | QCB API restricted to registered QIB IPs | QCB Requirement |

### 5.2 Data Classification in Transit

| Data Category | Classification | Protection |
|-------------|---------------|------------|
| Customer PII | Confidential | TLS 1.3 + field-level encryption |
| Financial Data | Confidential | TLS 1.3 + encrypted payload |
| Risk Scores | Internal | TLS 1.3 |
| QCB Regulatory Data | Restricted | TLS 1.3 + mutual authentication |
| Audit Trail | Protected | TLS 1.3 + hash-chain integrity |

---

## 6. Monitoring & Health Checks

### 6.1 Integration Health Dashboard

| System | Health Check Endpoint | Interval | Alert Threshold |
|--------|---------------------|----------|-----------------|
| T24 ESB | `/health/t24` | 30 seconds | 3 consecutive failures |
| SnapView API | `/health/snapview` | 60 seconds | 3 consecutive failures |
| QCB KYC API | `/health/qcb` | 60 seconds | 1 failure |
| DMS | `/health/dms` | 30 seconds | 3 consecutive failures |
| Risk Dataset | `/health/risk-db` | 60 seconds | 2 consecutive failures |
| Email/SMS | `/health/notification` | 120 seconds | 5 consecutive failures |

### 6.2 Integration Status Indicators (Dashboard Display)

The main EDD dashboard displays real-time integration status:

```
┌─────────────────────────────────────────────────────────┐
│              SYSTEM INTEGRATION STATUS                   │
├─────────────────────────────────────────────────────────┤
│  T24 Core Banking     🟢 Connected    [23ms latency]   │
│  QCB KYC API          🟢 Connected    [187ms latency]  │
│  DMS Documents        🟢 Connected    [45ms latency]   │
│  SnapView Analytics   🟢 Connected    [92ms latency]   │
│  Risk Dataset         🟢 Connected    [12ms latency]   │
│  Notification Engine  🟢 Operational  [—]              │
├─────────────────────────────────────────────────────────┤
│  Last Updated: 10 Mar 2026, 14:32:15 AST               │
│  All Systems Operational ✅                              │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Integration Testing Requirements

| Test Category | Description | Pass Criteria |
|-------------|-------------|---------------|
| Connectivity | Verify ESB connection to all systems | All endpoints reachable |
| Data Accuracy | Verify T24 data matches EDD form display | 100% field accuracy |
| Writeback | Verify T24 updates after case closure | All 4 fields written correctly |
| Performance | API response time under load | < 2s (T24/DMS), < 5s (QCB) |
| Error Handling | Simulate system unavailability | Graceful degradation, no data loss |
| Security | Verify TLS, JWT, rate limiting | All controls active |
| Audit Logging | Verify all API calls are logged | 100% coverage |
| Concurrency | Verify same case accessed by multiple users | No data corruption |

---

**Document ID:** INT-ARCH-EDD-2026-001 | **Version:** 1.0 | **Date:** March 10, 2026  
**Classification:** Internal — QIB Confidential | **© Qatar Islamic Bank (QIB) S.A.Q.**
