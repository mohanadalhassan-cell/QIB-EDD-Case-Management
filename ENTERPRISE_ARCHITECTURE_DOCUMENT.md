# 📋 ENTERPRISE ARCHITECTURE DOCUMENT
## Retail Risk Governance Platform (RRGP)
### Version 1.0 | Date: March 2026 | Status: Ready for Architecture Committee Review

---

## 📑 TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [System Scope & Vision](#2-system-scope--vision)
3. [Architecture Overview (C4 Model)](#3-architecture-overview-c4-model)
4. [Detailed Architecture Layers](#4-detailed-architecture-layers)
5. [Event-Driven Architecture Model](#5-event-driven-architecture-model)
6. [Workflow State Machine](#6-workflow-state-machine)
7. [Risk Evaluation Framework](#7-risk-evaluation-framework)
8. [Security & Authorization Model](#8-security--authorization-model)
9. [Integration Architecture](#9-integration-architecture)
10. [SLA & Escalation Engine](#10-sla--escalation-engine)
11. [Data Model & Relationships](#11-data-model--relationships)
12. [Use Cases & Scenarios](#12-use-cases--scenarios)
13. [Non-Functional Requirements](#13-non-functional-requirements)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Risk & Mitigation](#15-risk--mitigation)
16. [Compliance & Audit](#16-compliance--audit)
17. [Risk Management Monitoring Dashboard](#17-risk-management-monitoring-dashboard)
18. [Operational Documentation Governance](#18-operational-documentation-governance)
19. [Change Management Framework](#19-change-management-framework)

---

# 1. EXECUTIVE SUMMARY

## Problem Statement

Qatar Islamic Bank (QIB) processes **retail customer onboarding** through multiple channels:
- Mobile Banking App
- Branch Network
- Microsite Portal
- Call Center

**Current State:** Fragmented manual processes
```
Customer submits KYC
     ↓
Manual review (days)
     ↓
Ad-hoc escalation
     ↓
No audit trail
     ↓
Compliance risk 🔴
```

## Solution

**Retail Risk Governance Platform (RRGP)** - An integrated, event-driven platform that:
- **Automates** KYC evaluation and cascades to EDD when risk triggers occur
- **Routes** cases intelligently to appropriate teams with workload balancing
- **Tracks** every interaction in immutable event store (audit-proof)
- **Escalates** automatically based on SLA breaches and risk severity
- **Notifies** stakeholders in real-time across email, SMS, mobile, and dashboard

## Expected Benefits

| Benefit | Target | Impact |
|---------|--------|--------|
| **Case Processing Time** | < 72 hours (was 5-7 days) | 30% faster customer decisions |
| **SLA Compliance** | > 98% (was 60%) | Regulatory confidence |
| **Staff Utilization** | +25% | Automated routing |
| **Audit Coverage** | 100% (was partial) | Zero compliance gaps |
| **Customer Satisfaction** | +20% | Faster approvals |

## Architecture Approach

```
Event-Driven Case Management Platform
├─ Immutable Event Store (audit trail)
├─ State Machine Validation (workflow integrity)
├─ Intelligent Routing (load-balanced assignment)
├─ Multi-Channel Notifications (real-time)
└─ Integrated Dashboard (live metrics)
```

---

# 2. SYSTEM SCOPE & VISION

## In Scope

```
✅ KYC form submission (6 sections, 70+ fields)
✅ Automated risk assessment (7-factor scoring)
✅ EDD case creation (if risk >= 60)
✅ 4-stage workflow (Business → CDD → Compliance → Decision)
✅ Intelligent case routing (load-balanced assignment)
✅ Multi-channel notifications (email, SMS, mobile, dashboard)
✅ Document management (upload, verification, storage)
✅ Contact center integration (call scheduling, recording attachment)
✅ Change management workflow (process improvement feedback)
✅ Real-time SLA tracking (deadline monitoring, auto-escalation)
✅ Complete audit trail (event store, immutable logs)
✅ Role-based access control (RBAC with authorization matrix)
✅ Real-time dashboard (live KPI metrics, case queue, escalations)
```

## Out of Scope (Phase 2+)

```
❌ Machine Learning risk scoring (future enhancement)
❌ Biometric verification (mobile app only)
❌ Sanctions checking integration (OFAC, UN lists)
❌ Real-time transaction monitoring (separate system)
❌ Blockchain audit trail (future compliance enhancement)
❌ Video KYC (mobile app enhancement)
```

## System Actors

### Primary Users
```
👤 Relationship Manager / Branch Officer (FRONTLINE)
   ├─ First point of contact with customer
   ├─ Collects KYC documents from customer
   ├─ Submits KYC application via mobile/branch system
   ├─ Retrieves customer documents from DMS
   ├─ Compares submitted documents against customer data
   ├─ Identifies document discrepancies/mismatches
   ├─ Adds detailed verification notes/comments
   ├─ Routes case to Business Analyst
   ├─ If discrepancies found: Flags in verification notes
   └─ SLA: Same-day document collection & verification

👤 Business Analyst (BUSINESS REVIEW)
   ├─ Reviews KYC forms from RM/Branch Officer
   ├─ Reviews document verification notes from RM
   ├─ If discrepancies noted by RM: Recommends CDD deep-dive
   ├─ If documents match: Routes normaly to CDD
   ├─ Requests additional documents if needed
   ├─ Routes to CDD with Business recommendation
   ├─ Monitors queue and escalations
   └─ SLA: 24 hours

👤 CDD Officer (CDD REVIEW - ENHANCED VERIFICATION)
   ├─ Receives case with Business Analyst recommendation
   ├─ If document discrepancies noted: Performs detailed verification
   ├─ Re-validates disputed documents against authoritative sources
   ├─ Verifies source of funds
   ├─ Assesses business relationships
   ├─ Can request additional verification from RM/Branch
   ├─ Documents detailed findings
   ├─ Routes to Compliance with CDD recommendation
   └─ SLA: 24 hours (48 hours if deep-dive verification needed)

👤 Compliance Officer
   ├─ Final compliance check (Sanctions/PEP/AML)
   ├─ Reviews CDD verification notes on discrepancies
   ├─ Makes compliance recommendation
   ├─ Approval recommendation
   └─ SLA: 24 hours

👤 Approver (Manager/Director)
   ├─ Reviews case evidence from all stages
   ├─ Makes final approval/rejection decision
   ├─ Documents rationale
   ├─ Handles escalations
   └─ SLA: 8 hours for decision

👤 Customer (via channels)
   ├─ Submit KYC via mobile/branch
   ├─ Upload requested documents
   ├─ Respond to document verification requests
   ├─ Receive status notifications
   └─ Monitor application status
```

### Secondary Users
```
👤 Contact Center Agent
   ├─ Make verification calls
   ├─ Record interactions
   └─ Update case based on call

👤 Operations Monitor
   ├─ Track SLA health
   ├─ Alert on breaches
   └─ Re-balance workload

👤 IT Administrator
   ├─ System monitoring
   ├─ Configuration management
   └─ Backup/recovery

👤 Compliance Auditor
   ├─ Review event logs
   ├─ Verify audit trail
   └─ Certification
```

## Department Responsibilities

### Business Teams (Mass / Tamayuz / Private Banking)

**Primary Responsibility:** Initial KYC review, customer verification, and business recommendation

```
📊 Mass Banking
   ├─ Initial case review within 24 hours
   ├─ Collect and verify customer documents
   ├─ Identify document discrepancies
   ├─ Correct/update KYC data where needed
   ├─ Add business notes to case
   ├─ Make business recommendation: MAINTAIN or EXIT
   └─ Route to CDD for all MAINTAIN recommendations

📊 Tamayuz (Priority Segment)
   ├─ Same workflow as Mass Banking
   ├─ Escalated priority (SLA: 12 hours)
   ├─ Direct escalation path to management
   ├─ Enhanced document verification
   └─ Higher threshold for CDD referral

📊 Private Banking
   ├─ High-touch customer service
   ├─ Relationship manager assigned
   ├─ Detailed document verification
   ├─ Personalized communication
   ├─ Business recommendation with justification
   └─ Escalation to Private Banking Manager
```

**Key Actions:**
```
✓ Collect KYC documents from customer
✓ Retrieve documents from DMS
✓ Compare documents against submitted data
✓ Identify discrepancies/mismatches (minor vs major)
✓ Add verification notes to case
✓ Request correction if discrepancies found
✓ Make recommendation: MAINTAIN (proceed to CDD) or EXIT
✓ Route case based on recommendation
```

**SLA:** 24 hours (Mass), 12 hours (Tamayuz), 18 hours (Private)

---

### CDD Operations (Enhanced Due Diligence)

**Primary Responsibility:** Detailed verification, risk assessment documentation, and Maker/Checker controls

```
🔍 CDD Officer Responsibilities
   ├─ Receive cases from Business Teams
   ├─ Review business recommendation
   ├─ Perform detailed due diligence:
   │  ├─ Source of funds verification
   │  ├─ Business relationship assessment
   │  ├─ Transaction pattern analysis
   │  ├─ PEP/Sanctions initial screening (non-final)
   │  └─ Document authenticity review
   │
   ├─ If document discrepancies noted:
   │  ├─ Perform detailed investigation
   │  ├─ Request additional verification from Business Team
   │  ├─ Document resolution methodology
   │  └─ Update risk assessment
   │
   ├─ Create detailed CDD report:
   │  ├─ Risk findings
   │  ├─ Document verification results
   │  ├─ Specific concerns (if any)
   │  └─ CDD recommendation
   │
   ├─ Route to Maker/Checker:
   │  ├─ CDD Checker reviews findings
   │  ├─ Validates documentation
   │  ├─ Approves or requests re-work
   │  └─ Final CDD sign-off
   │
   └─ Synchronize with T24:
      ├─ Update customer profile in T24
      ├─ Flag high-risk if applicable
      ├─ Link case to customer account
      └─ Record CDD completion date

🔍 Maker/Checker Control
   ├─ CDD Maker: Prepares CDD documentation
   ├─ CDD Checker: Reviews and validates findings
   ├─ Approval required for all cases
   ├─ Documented evidence in case file
   ├─ Electronic approval in system
   └─ Audit trail maintained
```

**Key Actions:**
```
✓ Review Business Team's document verification notes
✓ Request additional docs if CDD needs require (flagged by Business)
✓ Perform detailed verification on disputed documents
✓ Document resolution of any discrepancies
✓ Prepare CDD findings report
✓ Submit to Checker for approval
✓ Sync findings to T24 customer profile
✓ Route to Compliance for final review
```

**SLA:** 24 hours (standard), 48 hours (if document deep-dive needed)

---

### Compliance (Final Authority)

**Primary Responsibility:** Regulatory compliance, PEP/sanctions decisions, restrictions, and QCB reporting

```
⚖️ Compliance Officer Responsibilities
   ├─ Receive cases from CDD Operations
   ├─ Perform regulatory compliance review:
   │  ├─ PEP (Politically Exposed Person) screening
   │  ├─ Sanctions checking (OFAC, UN, local lists)
   │  ├─ AML (Anti-Money Laundering) assessment
   │  ├─ CTF (Counter-Terrorist Financing) check
   │  └─ Currency control verification
   │
   ├─ Review CDD deep-dive (if document issues existed):
   │  ├─ Validate CDD Checker's recommendations
   │  ├─ Assess impact on compliance risk
   │  ├─ Make final PEP/Sanctions decision
   │  └─ Determine if restrictions needed
   │
   ├─ Make Final Compliance Decision:
   │  ├─ APPROVED: Customer eligible for account
   │  ├─ APPROVED WITH CONDITIONS: Enhanced monitoring required
   │  ├─ REJECTED: Customer not eligible
   │  └─ ESCALATE: Board review needed
   │
   ├─ Manage Account Restrictions (if APPROVED):
   │  ├─ Flag for enhanced transaction monitoring
   │  ├─ Set transaction limits (if needed)
   │  ├─ Document restrictions in case file
   │  └─ Communicate to T24 and operations
   │
   ├─ Regulatory Reporting to QCB:
   │  ├─ Report high-risk customers
   │  ├─ Report suspicious activities
   │  ├─ Report PEP/Sanctions matches
   │  └─ Maintain QCB reporting register
   │
   └─ Quarterly Review:
      ├─ Re-assess high-risk customers quarterly
      ├─ Update risk profile if patterns change
      ├─ Document ongoing monitoring
      └─ Escalate new concerns
```

**Key Actions:**
```
✓ Perform final PEP/Sanctions/AML screening
✓ Review CDD findings on document issues
✓ Make regulatory compliance determination
✓ Approve/reject based on regulations
✓ Set account restrictions if needed
✓ Document compliance decision rationale
✓ Report to QCB if required
✓ Route to Final Approver
✓ Maintain QCB compliance register
```

**SLA:** 24 hours per review

---

## Department Interaction Flow

```
BUSINESS TEAM (Initial Review)
       ↓
   Collect & Verify Documents
       ↓
   [Document Verification]
   ├─ ALL MATCH: Normal pathway
   └─ DISCREPANCIES: Flag for CDD deep-dive
       ↓
CDD OPERATIONS (Detailed Review)
       ↓
   If Discrepancies Flagged:
   ├─ Request additional verification from Business
   ├─ Document resolution methodology
   ├─ Re-assess risk based on findings
   └─ Prepare detailed report
       ↓
   [Maker/Checker Control]
   CDD Maker → CDD Checker → Approval
       ↓
COMPLIANCE (Final Authority)
       ↓
   Final PEP/Sanctions/AML Review
       ↓
   Regulatory Decision:
   ├─ APPROVED
   ├─ APPROVED WITH CONDITIONS
   ├─ REJECTED
   └─ ESCALATE
       ↓
FINAL APPROVER (Decision)
       ↓
   Make Account Opening Decision
       ↓
   (Account Created or Application Rejected)
```

## Maker/Checker Control Flow

**Purpose:** Implement segregation of duties and prevent errors in critical financial decisions

### CDD Maker/Checker Process

```
┌──────────────────────────────────────────────────────────────┐
│                    CDD MAKER (CDD Officer)                  │
│                                                              │
│  1. Receives case from Business Team                        │
│  2. Performs comprehensive due diligence:                   │
│     ├─ Reviews all documents                               │
│     ├─ Verifies source of funds                            │
│     ├─ Assesses business relationships                     │
│     ├─ Analyzes transaction patterns                       │
│     └─ Documents all findings in detail                    │
│                                                              │
│  3. If document discrepancies flagged by Business:          │
│     ├─ Performs detailed verification                      │
│     ├─ Requests additional docs from Business              │
│     └─ Documents resolution methodology                    │
│                                                              │
│  4. Creates CDD Report containing:                          │
│     ├─ Executive summary of findings                       │
│     ├─ Detailed risk assessment                            │
│     ├─ Document verification results                       │
│     ├─ Specific concerns (if any)                          │
│     ├─ Source of funds documentation                       │
│     ├─ Business relationship assessment                    │
│     └─ CDD Maker Recommendation (APPROVE/REJECT)           │
│                                                              │
│  5. Submits to CDD Checker for approval                     │
│     └─ Digital signature + timestamp                        │
│                                                              │
│  **Cannot complete transaction without Checker approval**   │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│              CDD CHECKER (CDD Officer + Supervisor)          │
│                                                              │
│  1. Receives completed CDD file from Maker                   │
│  2. Reviews all documentation:                               │
│     ├─ Verifies all required documents present              │
│     ├─ Validates reasoning and conclusions                 │
│     ├─ Checks calculations and assessments                 │
│     ├─ Confirms compliance with procedures                 │
│     └─ Assesses overall quality of work                    │
│                                                              │
│  3. Quality Control Checks:                                 │
│     ├─ □ All source documents reviewed                     │
│     ├─ □ Risk assessment justified                         │
│     ├─ □ Findings supported by evidence                    │
│     ├─ □ Discrepancies properly investigated               │
│     ├─ □ No missing information                            │
│     └─ □ Recommendation reasonable                         │
│                                                              │
│  4. Decision Options:                                        │
│     ├─ APPROVED: CDD findings accepted, case proceeds      │
│     ├─ REQUEST REWORK: Return to Maker with comments       │
│     │  └─ Maker addresses concerns                         │
│     │  └─ Resubmits to Checker                             │
│     └─ ESCALATE: Complex case needs management review      │
│                                                              │
│  5. Final Approval:                                          │
│     ├─ Documents Checker's assessment                       │
│     ├─ Adds approval decision                               │
│     ├─ Digital signature + timestamp                        │
│     └─ Case routed to Compliance                           │
│                                                              │
│  **Checker approval is mandatory & final for CDD stage**    │
└──────────────────────────────────────────────────────────────┘
                            ↓
                    COMPLIANCE REVIEW
```

### Compliance Maker/Checker Process

```
┌──────────────────────────────────────────────────────────────┐
│              COMPLIANCE OFFICER (Maker Role)                │
│                                                              │
│  1. Receives case with CDD Checker approval                 │
│  2. Performs regulatory compliance review:                  │
│     ├─ PEP screening (all databases)                       │
│     ├─ Sanctions checking (OFAC, UN, local)                │
│     ├─ AML assessment based on profile                     │
│     ├─ CTF verification                                    │
│     └─ Currency control assessment                         │
│                                                              │
│  3. For PEP matches:                                         │
│     ├─ Document nature of PEP status                       │
│     ├─ Assess compliance risk                              │
│     └─ Determine if restrictions needed                    │
│                                                              │
│  4. For document discrepancies (if flagged):               │
│     ├─ Review CDD Checker's validation                     │
│     ├─ Assess compliance impact                            │
│     └─ Make final determination                            │
│                                                              │
│  5. Create Compliance Decision:                             │
│     ├─ Regulatory findings documented                       │
│     ├─ Risk classification                                 │
│     ├─ Restrictions (if any)                               │
│     └─ Compliance Recommendation                           │
│                                                              │
│  6. Submit to Compliance Manager (Checker role)            │
│     └─ Digital signature + timestamp                        │
│                                                              │
│  Note: For non-high-risk cases, may not require Checker    │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│          COMPLIANCE MANAGER (Checker Role) - *When Required* │
│                                                              │
│  Approval Required for:                                      │
│  ├─ PEP/Sanctions matches                                   │
│  ├─ High-risk customers (score ≥ 60)                       │
│  ├─ Document discrepancies needing escalation              │
│  └─ Any case with restrictions                             │
│                                                              │
│  1. Reviews Compliance Officer's assessment                │
│  2. Validates PEP/Sanctions screening                       │
│  3. Approves or escalates:                                  │
│     ├─ APPROVED: Customer eligible with conditions         │
│     ├─ ESCALATE: Requires higher authority                 │
│     └─ REJECTED: Not eligible for account                  │
│                                                              │
│  4. Documents decision & approval                           │
│  5. Routes to Final Approver                                │
│     └─ Digital signature + timestamp                        │
│                                                              │
│  **For strategic/board-level decisions: Escalate to Head** │
└──────────────────────────────────────────────────────────────┘
                            ↓
                  FINAL APPROVER DECISION
```

### Audit Trail for Maker/Checker

```
Recorded Items:
├─ Each Maker action with timestamp & signature
├─ Each Checker review with timestamp & signature
├─ All comments/feedback from Checker
├─ Any rework cycles (Maker → Checker → Rework)
├─ Approval/rejection decisions with rationale
├─ Time taken for each stage
└─ Escalations (with reason)

Immutable Storage:
├─ Event Store: All events logged
├─ Approval Record: Permanent sign-off record
├─ Audit Log: QCB-compliant reporting
└─ Change Log: All modifications tracked

Regulatory Reporting:
├─ New Account Form (NAF) includes Maker/Checker names
├─ Audit reports can trace all approvals
├─ QCB inspections can verify controls
└─ Remediation tracking for any issues
```

---

## Key Business Processes

### Process 1: Low-Risk Auto-Approval
```
↓ PHASE 1: RM/BRANCH VERIFICATION
Customer initiates KYC (branch/mobile)
    ↓
RM/Branch Officer collects documents
    ↓
RM retrieves documents from DMS
    ↓
RM compares DMS documents against customer data
    ↓
RM determines: Documents MATCH or DISCREPANCIES EXIST

↓ PHASE 2: SYSTEM PROCESSING
Risk assessment: LOW (score < 20)
    ↓
Status: APPROVED
    ↓
Account opened automatically
    ↓
Timeline: 5 minutes (after RM verification)
```

### Process 2: Standard EDD Path (with RM Document Verification)
```
↓ STEP 1: RM/BRANCH DOCUMENT VERIFICATION (FIRST GATE)
Customer submits KYC via branch/mobile
    ↓
RM/Branch Officer collects all KYC documents
    ↓
RM accesses DMS to retrieve documents:
   ├─ ID copy
   ├─ Address proof
   ├─ Income documents
   ├─ Employment letter
   ├─ Business registration (if applicable)
   └─ Other supporting docs
    ↓
RM COMPARES (document verification check):
   ├─ Does ID number match submitted data?
   ├─ Does address match?
   ├─ Do income documents align with claimed income?
   ├─ Is employment letter from expected company?
   └─ Are all dates/details consistent?
    ↓
OUTCOME A: ALL DOCUMENTS MATCH
   └─ RM adds note: "Document verification: PASS - All docs match"
   └─ Routes to Business Analyst normally
    ↓
OUTCOME B: DISCREPANCIES FOUND
   └─ RM adds detailed note: 
      "Document verification: DISCREPANCIES FOUND
       - Issue: [specific discrepancy]
       - Documents in DMS vs Submitted Data:
         * Expected: [DMS value]
         * Submitted: [Form value]
       - Recommendation: CDD deep-dive verification recommended"
   └─ Routes to Business Analyst with ALERT flag
    ↓

↓ STEP 2: BUSINESS ANALYST REVIEW
Business Analyst reviews case
    ├─ Reads RM verification notes
    ├─ Reviews KYC form
    └─ If RM flagged discrepancies:
       ├─ Notes: "RM identified discrepancies - requires CDD verification"
       └─ Routes to CDD with RECOMMENDATION: "Deep-dive verification needed"
    ├─ If RM verified all clear:
       └─ Routes to CDD normally

↓ STEP 3: CDD REVIEW (WITH OPTIONAL DEEP-DIVE)
CDD Officer receives case
    ├─ If RM noted discrepancies:
    │  ├─ Performs detailed verification:
    │  ├─ Re-validates documents against sources
    │  ├─ May request additional verification from RM/Branch
    │  ├─ Documents all findings
    │  └─ Makes recommendation on discrepancy resolution
    │
    └─ If documents were verified by RM as matching:
       └─ Proceeds with standard CDD review

        ↓
        Risk assessment: MEDIUM (score 20-59)
        ↓
        EDD case created
        ↓
        CDD completes review
        ↓
        Routes to Compliance
        ↓
        Compliance → Decision
        ↓
        Case closed (Approve/Reject)
        ↓
Timeline: 3-5 business days (5-7 if CDD deep-dive needed)
```

### Process 3: High-Risk Escalation (with RM Verification)
```
↓ STEP 1: RM INITIAL DOCUMENT VERIFICATION
Customer initiates KYC
    ↓
RM collects documents and verifies against DMS
    ↓
RM notes any discrepancies (if found)
    ↓

↓ STEP 2: IMMEDIATE ESCALATION
Risk assessment: CRITICAL (score ≥ 60)
    ↓
EDD case created with URGENT priority
    ↓
Escalated to Management immediately
    ↓
PARALLEL ACTIONS:
   ├─ Verification call scheduled (RM may conduct initial call)
   ├─ Additional documentation requested
   ├─ If RM found discrepancies: CDD notified for deep verification
   └─ Board-level approval needed
    ↓
Timeline: 5-7 business days (or urgent based on risk)
```

---

# 3. ARCHITECTURE OVERVIEW (C4 MODEL)

## Level 1: System Context

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│          RETAIL RISK GOVERNANCE PLATFORM                   │
│          (Retail Risk Governance Platform)                 │
│                                                             │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓     │
│  ┃                                                  ┃     │
│  ┃  Manages KYC/EDD case lifecycle with real-time ┃     │
│  ┃  routing, notifications, and audit compliance  ┃     │
│  ┃                                                  ┃     │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
     ↕                    ↕                    ↕      ↕
     │                    │                    │      │
┌──────────┐      ┌────────────────┐   ┌─────────────┐
│ Mobile   │      │ QIB Internal   │   │ Contact     │
│ Banking  │      │ Systems        │   │ Center      │
│          │      │ (T24, CRP, etc)│   │             │
└──────────┘      └────────────────┘   └─────────────┘
     ↕                    ↕                    ↕
     │  KYC Submit         │ Integration        │ Call Schedule
```

## Level 2: Container Architecture

```
┌───────────────────────── RRGP PLATFORM ───────────────────────┐
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           PRESENTATION LAYER (Frontend)                 │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  Mobile App │ Branch Portal │ Microsite │ Compliance    │ │
│  │  Dashboard  │  Dashboard    │ Onboarding│ Dashboard     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         ↕                                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │         API GATEWAY & REQUEST ROUTER                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         ↕                                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │        APPLICATION LAYER (Request Handlers)             │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  KYC API Routes │ Case API │ Workflow API │ Notification│ │
│  └──────────────────────────────────────────────────────────┘ │
│                         ↕                                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │       BUSINESS LOGIC LAYER (Orchestration)              │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  EDD Case Engine         (Orchestrator)                  │ │
│  │  ├─ assessRisk()                                         │ │
│  │  ├─ createCase()                                         │ │
│  │  └─ triggerWorkflow()                                    │ │
│  │                                                           │ │
│  │  Workflow Router         (Intelligent Assignment)        │ │
│  │  ├─ findBestAssignee()                                   │ │
│  │  ├─ balanceWorkload()                                    │ │
│  │  └─ escalateOnSLA()                                      │ │
│  │                                                           │ │
│  │  Notification Engine     (Multi-Channel)                 │ │
│  │  ├─ sendEmail()                                          │ │
│  │  ├─ sendSMS()                                            │ │
│  │  ├─ sendMobilePush()                                     │ │
│  │  └─ broadcastDashboard()                                 │ │
│  │                                                           │ │
│  │  Contact Center Adapter (Call Integration)               │ │
│  │  ├─ createCallRequest()                                  │ │
│  │  ├─ attachRecording()                                    │ │
│  │  └─ updateCaseFromCall()                                 │ │
│  │                                                           │ │
│  │  Event Store Engine      (Immutable Audit Trail)         │ │
│  │  ├─ appendEvent()                                        │ │
│  │  └─ replayEventLog()                                     │ │
│  │                                                           │ │
│  │  State Machine Validator (Workflow Integrity)            │ │
│  │  ├─ validateTransition()                                 │ │
│  │  └─ enforceRules()                                       │ │
│  │                                                           │ │
│  │  SLA & Escalation Engine (Time-Based Actions)            │ │
│  │  ├─ checkDeadlines()                                     │ │
│  │  ├─ escalateCase()                                       │ │
│  │  └─ notifyOnSLABreach()                                  │ │
│  │                                                           │ │
│  │  Authorization Middleware (RBAC)                         │ │
│  │  ├─ checkPermission()                                    │ │
│  │  └─ enforceRBAC()                                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         ↕                                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │         DATA ACCESS LAYER (ORM/Query Builder)            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         ↕                                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │    DATABASE LAYER (PostgreSQL with 14 tables)            │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  KYC │ Cases │ Events │ Docs │ Queue │ Notifications    │ │
│  │  Risk │ Config │ Metrics │ SLA Rules │ RBAC Matrix      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │       EXTERNAL INTEGRATIONS (Adapters)                  │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │  T24 Adapter │ CRP Adapter │ QCB Adapter │ DMS Adapter  │ │
│  │  Call Center │ Email Service │ SMS Service │ Mobile Push│ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Level 3: Component Architecture

### A. KYC API Component
```
KYC API Routes
├─ POST /v1/kyc/submit
│  └─ Validates form data
│  └─ Calls EDD Case Engine
│
├─ GET /v1/kyc/{kyc_id}/status
│  └─ Returns KYC application status
│
├─ GET /v1/kyc/{kyc_id}/case
│  └─ References linked EDD case
│
└─ POST /v1/kyc/{kyc_id}/documents
   └─ Document upload handling
```

### B. EDD Case Engine Component (Orchestrator)
```
EDD Case Engine
├─ submitKYCandCreateCase(kycData)
│  ├─ assessRiskFromKYC() [7-factor scoring]
│  ├─ createEDDCase() [insert to DB + event store]
│  ├─ insertRiskAssessment() [detailed breakdown]
│  ├─ routeCase() [calls Workflow Router]
│  ├─ sendNotifications() [calls Notification Engine]
│  ├─ createAuditEvent() [immutable logging]
│  └─ return { case_id, kyc_id, risk_rating }
│
├─ completeWorkflowStage(caseId, stage, decision)
│  ├─ validateStateTransition() [State Machine]
│  ├─ updateWorkflowQueue()
│  ├─ triggerNextStage()
│  ├─ createAuditEvent()
│  └─ sendNotifications()
│
└─ makeFinalDecision(caseId, decision, notes)
   ├─ validateAuthorization() [RBAC check]
   ├─ updateCaseStatus()
   ├─ createAuditEvent()
   └─ notifyCustomer()
```

### C. Workflow Router Component
```
Workflow Router
├─ assignCaseToQueue(caseId, stage)
│  ├─ getTeamForStage()
│  ├─ findBestAssignee() [load-balanced]
│  └─ updateAssignment()
│
├─ findBestAssignee(team, stage)
│  ├─ Query active cases per user
│  ├─ Calculate workload score
│  ├─ Respect skills/certifications
│  └─ Return best candidate
│
├─ rerouteOnDeadlineMissed(caseId)
│  ├─ Find alternative assignee
│  ├─ Reassign if available
│  └─ Escalate if not
│
├─ escalateCase(caseId, reason)
│  ├─ Find team manager
│  ├─ Create escalation queue entry
│  └─ Notify management
│
└─ rebalanceWorkload() [scheduled job]
   └─ Run every hour
```

### D. Notification Engine Component
```
Notification Engine
├─ sendNotification(config)
│  ├─ createNotificationRecord()
│  ├─ routeByChannel(s)
│  │  ├─ EMAIL [Nodemailer]
│  │  ├─ SMS [Twilio]
│  │  ├─ MOBILE_PUSH [Firebase]
│  │  └─ DASHBOARD [WebSocket]
│  └─ updateDeliveryStatus()
│
├─ sendEmailNotification()
│  ├─ renderTemplate(eventType)
│  ├─ sendViaNodemailer()
│  └─ trackDelivery()
│
├─ sendSMSNotification()
│  ├─ optimizeMessage() [160 chars]
│  ├─ sendViaTwilio()
│  └─ trackDelivery()
│
├─ sendMobilePushNotification()
│  ├─ preparePayload()
│  ├─ sendViaFirebase()
│  └─ includeDeepLink()
│
├─ broadcastDashboard()
│  ├─ prepareUpdate()
│  └─ broadcastViaWebSocket()
│
└─ sendSLAReminders() [hourly job]
   └─ Alert on deadline approach
```

### E. Event Store Engine Component
```
Event Store Engine
├─ appendEvent(caseId, eventType, data)
│  ├─ Validate event
│  ├─ Insert to edd_case_events
│  ├─ Create immutable record
│  └─ Trigger event handlers
│
├─ getEventLog(caseId)
│  ├─ Retrieve all events for case
│  └─ Return chronological order
│
└─ replayEventLog(caseId)
   └─ Reconstruct full case history
```

### F. State Machine Validator Component
```
State Machine Validator
├─ STATE_TRANSITIONS map
│  └─ Defines valid transitions
│
├─ validateTransition(currentState, newState, actor)
│  ├─ Check if transition allowed
│  ├─ Verify actor has permission
│  └─ Return true/false
│
└─ enforceRules(caseId, newState)
   ├─ Pre-state checks
   ├─ Post-state checks
   └─ Side effects
```

### G. SLA & Escalation Engine Component
```
SLA Engine
├─ checkDeadlines() [scheduled every 5 min]
│  ├─ Query overdue workflow_queue entries
│  ├─ Create escalation events
│  └─ Notify management
│
├─ calculateDueDate(stage)
│  └─ NOW() + SLA_HOURS[stage]
│
├─ escalateCase(caseId, reason)
│  ├─ Find available manager
│  ├─ Reassign or escalate
│  └─ Send URGENT notification
│
└─ createSLAAlert(caseId, stage, hoursRemaining)
   └─ Notify assignee
```

### H. Authorization Middleware Component
```
Authorization Middleware
├─ checkPermission(actor, action, resource)
│  ├─ Query RBAC_MATRIX
│  ├─ Verify role
│  ├─ Verify action allowed
│  └─ Return allow/deny
│
├─ enforceRBAC(req, res, next)
│  ├─ Extract user from JWT
│  ├─ Check authorization
│  └─ Proceed or reject
│
└─ getRBACRules(role)
   └─ Return all permissions for role
```

---

# 4. DETAILED ARCHITECTURE LAYERS

## Layer 1: Presentation Layer

### Components
```
Mobile Banking App
├─ KYC form submission
├─ Document upload
├─ Status tracking
└─ Notification display

Branch Portal
├─ Customer lookup
├─ Manual KYC entry
├─ Queue management
└─ Escalation handling

Microsite Onboarding
├─ Public KYC form
├─ Customer journey
├─ Document upload
└─ Confirmation

Compliance Dashboard
├─ Real-time case queue
├─ SLA health
├─ Escalations
├─ KPI metrics
└─ Audit log viewer
```

### Responsibilities
```
✅ Input validation (client-side)
✅ User authentication
✅ Form rendering
✅ Real-time notification display (WebSocket)
✅ Case status tracking
✅ Document upload UI
❌ Business logic (done in API layer)
❌ Database access (done in data layer)
```

---

## Layer 2: API Gateway & Request Router

### Responsibilities
```
✅ Route API requests to handlers
✅ Rate limiting (prevent abuse)
✅ Request logging
✅ Response formatting
✅ Error handling
✅ CORS configuration
✅ SSL/TLS termination
```

### Example Routing
```
POST /api/v1/kyc/submit
  → kyc_api_routes.submitKYCForm()

GET /api/v1/cases/{case_id}
  → case_api_routes.getCaseDetails()

PUT /api/v1/cases/{case_id}/status
  → case_api_routes.updateCaseStatus()
```

---

## Layer 3: Application Layer (API Handlers)

### Responsibilities
```
✅ Receive HTTP requests
✅ Extract parameters
✅ Validate inputs
✅ Call business logic
✅ Return JSON responses
✅ Handle errors gracefully
```

### Typical Handler Flow
```
handler(req, res) {
  try {
    1. Extract request data
    2. Validate required fields
    3. Check authorization
    4. Call business logic
    5. Return response (200/201/400/401/500)
  } catch (error) {
    6. Log error
    7. Return error response
  }
}
```

---

## Layer 4: Business Logic Layer (Core)

This is where intelligent decisions happen:

### Components
```
1. EDD Case Engine (Orchestrator)
   └─ Coordinates all operations

2. Workflow Router
   └─ Intelligent case assignment

3. Notification Engine
   └─ Multi-channel delivery

4. Event Store Engine
   └─ Immutable audit trail

5. State Machine Validator
   └─ Workflow integrity

6. SLA & Escalation Engine
   └─ Time-based automation

7. Authorization Middleware
   └─ Role-based access control

8. Contact Center Adapter
   └─ Call management
```

### Key Principle
```
NO SQL directly in this layer
NO HTTP calls directly
Everything goes through DATA LAYER or EXTERNAL ADAPTERS
```

---

## Layer 5: Data Access Layer

### Responsibilities
```
✅ Database connection pooling
✅ Query execution (parameterized)
✅ Transaction management
✅ Error handling (retry logic)
✅ Caching (where necessary)
✅ Connection cleanup
```

### Example
```javascript
async function getCaseWithEvents(caseId) {
  const client = await pool.connect();
  try {
    // Transaction: Get case + all events atomically
    await client.query('BEGIN');
    const caseResult = await client.query(
      'SELECT * FROM edd_cases WHERE case_id = $1',
      [caseId]
    );
    const eventsResult = await client.query(
      'SELECT * FROM edd_case_events WHERE case_id = $1',
      [caseId]
    );
    await client.query('COMMIT');
    return { case: caseResult.rows[0], events: eventsResult.rows };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

---

## Layer 6: Database Layer

### 14 Tables

```
KYC & Customer Management
├─ kyc_applications (original)
├─ customers
├─ customer_documents

EDD Case Management
├─ edd_cases (NEW)
├─ workflow_queue (NEW)
├─ case_risk_assessment (NEW)

Audit & Compliance
├─ edd_case_events (NEW - Event Store)
├─ notifications (NEW)
├─ contact_center_interaction (NEW)
├─ change_management_workflow (NEW)

Configuration & Metrics
├─ dashboard_metrics (NEW)
├─ system_configuration (NEW)
├─ sla_escalation_rules (NEW)
├─ authorization_rbac_matrix (NEW)
```

### Indexes (40+)
```
Primary Keys: case_id, event_id, notification_id, etc.
Foreign Keys: case_id, customer_id, user_id, kyc_id
Search: (assigned_user, queue_status), (created_at), (case_status)
Aggregate: (case_status, created_at) for dashboard
```

---

## Layer 7: External Integrations

### Adapters Needed
```
1. T24 Core Banking
   └─ Customer account creation

2. CRP (Customer Relationship Platform)
   └─ Customer profile updates

3. QCB (QIB Core Banking)
   └─ Account verification

4. DMS (Document Management System)
   └─ Document storage/retrieval

5. Call Center (NICE/Genesys)
   └─ Outbound call scheduling

6. Email Service (Nodemailer/SMTP)
   └─ Email delivery

7. SMS Service (Twilio/AWS SNS)
   └─ SMS delivery

8. Mobile Push (Firebase/APNs)
   └─ Mobile notifications
```

---

# 5. EVENT-DRIVEN ARCHITECTURE MODEL

## Event Store as Source of Truth

Instead of mutable state:
```
❌ WRONG:
   edd_cases.status = 'ASSIGNED'  ← mutable
   (Who changed it? When? Why?)

✅ RIGHT:
   edd_case_events:
   - Event#1: CaseCreated { timestamp, actor, data }
   - Event#2: CaseAssigned { timestamp, actor, data }
   - Event#3: DocumentRequested { timestamp, actor, data }
   ← immutable audit trail
```

## All Possible Events

```
KYC Submission Events
├─ customer_kyc_submitted
├─ kyc_validation_started
├─ kyc_validation_completed
└─ kyc_rejected

Decision Events
├─ edd_case_created
├─ risk_assessment_completed
├─ edd_triggered
└─ edd_not_triggered

Case Management Events
├─ case_assigned
├─ case_routed_to_cdd
├─ case_routed_to_compliance
├─ case_escalated
└─ case_closed

Document Events
├─ document_requested
├─ document_uploaded_by_customer
├─ document_verified
├─ document_rejected
└─ additional_documents_required

Workflow Events
├─ stage_completed
├─ stage_rejected
├─ sla_deadline_approaching
├─ sla_deadline_missed
└─ escalation_triggered

Notification Events
├─ email_sent
├─ sms_sent
├─ mobile_push_sent
└─ notification_read

Contact Center Events
├─ call_scheduled
├─ call_completed
├─ call_outcome_recorded
└─ recording_attached
```

## Event Store Data Structure

```sql
CREATE TABLE edd_case_events (
    event_id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(20) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_version INT,
    actor_id VARCHAR(50),        -- who triggered it
    actor_role VARCHAR(30),      -- BUSINESS_ANALYST, etc
    event_data JSONB NOT NULL,   -- actual data
    created_at TIMESTAMP DEFAULT NOW(),
    sequence_number BIGINT,      -- for ordering
    
    FOREIGN KEY (case_id) REFERENCES edd_cases(case_id),
    INDEX idx_case_events (case_id, created_at),
    INDEX idx_case_events_type (event_type, created_at)
);
```

## Event Publishing Flow

```
Action in Main System
       ↓
Append Event to Event Store
       ↓
Publish Event to Message Queue (optional)
       ↓
Trigger Event Handlers:
  ├─ SLA Engine (check deadlines)
  ├─ Notification Engine (send alerts)
  ├─ Dashboard Updater (refresh metrics)
  ├─ Workflow Router (execute on assignment events)
  └─ RBAC Engine (log access)
```

## Example: Case Assignment Flow

```
User clicks "Assign to Fatima Ahmed" in Portal
       ↓
API calls: case_api_routes.assignCase()
       ↓
Business logic validates:
  ├─ User has ASSIGN permission
  ├─ Case is in assignable state
  └─ Fatima is available
       ↓
Events created and published:
  1. WorkflowQueueUpdated
     { queue_id, assigned_user, timestamp, actor }
  2. CaseAssignmentChanged
     { case_id, assigned_from, assigned_to, timestamp }
  3. NotificationTriggered
     { recipient: fatima, type: CASE_ASSIGNED, case_id }
       ↓
Event handlers fire:
  - Workflow Router: Update workflow_queue table
  - Notification Engine: Send email to Fatima
  - Dashboard Engine: Update case list for Fatima
  - Audit Engine: Log this action
       ↓
Response sent to user: { success: true, case_id: ... }
```

---

# 6. WORKFLOW STATE MACHINE

## Valid State Transitions (Updated with RM Document Verification)

```
SUBMITTED (Initial State - by RM/Branch Officer)
  ├─ RM collects documents from customer
  ├─ RM retrieves documents from DMS
  ├─ RM compares documents against submitted data
  ├─ RM identifies: MATCH or DISCREPANCIES
  │
  └─→ BUSINESS_REVIEW (Proceed with business review)
      (RM notes attached: "document_verification" metadata)
       ↓
BUSINESS_REVIEW (First stage: Business Analyst reviews RM notes)
  ├─→ CDD_REVIEW (Proceed to next stage normally)
  │   (if RM: all documents matched OR minor issues resolved)
  │
  ├─→ DOCUMENT_VERIFICATION_REQUIRED (Send back to RM)
  │   (if RM: significant discrepancies found that need clarification)
  │   └─ RM rechecks, clarifies with customer if needed
  │   └─ Returns with updated verification notes
  │   └─ Back to: BUSINESS_REVIEW
  │
  ├─→ CDD_DEEP_DIVE_REQUIRED (Route to CDD with alert)
  │   (if RM: document discrepancies that need detailed investigation)
  │   └─ Proceeds to CDD_REVIEW (with flag: deep_dive_required=true)
  │   └─ CDD performs additional verification
  │
  ├─→ CUSTOMER_ACTION_REQUIRED (Request documents from customer)
  │   └─ Customer uploads documents
  │   └─ RM re-verifies
  │   └─ Back to: BUSINESS_REVIEW
  │
  ├─→ REJECTED (Decision made: not eligible)
  │
  └─→ ESCALATED (Flag for management)
       ↓
DOCUMENT_VERIFICATION_REQUIRED (RM follows up on discrepancies)
  ├─→ BUSINESS_REVIEW (Re-enter after clarification)
  └─→ CUSTOMER_ACTION_REQUIRED (Request additional docs)
       ↓
CDD_REVIEW (Enhanced Due Diligence - with optional deep-dive)
  ├─→ COMPLIANCE_REVIEW (Proceed to next stage)
  │   (may include deep_dive_required flag if document issues existed)
  │
  ├─→ CUSTOMER_ACTION_REQUIRED (Request more docs for verification)
  │
  ├─→ REJECTED (Risk too high even with document verification)
  │
  └─→ ESCALATED
       ↓
COMPLIANCE_REVIEW (Compliance final check with all verified data)
  ├─→ DECISION_PENDING (Ready for final decision)
  │   (all documents verified by RM and reviewed by CDD)
  │
  ├─→ CUSTOMER_ACTION_REQUIRED (Final doc request)
  │
  ├─→ REJECTED
  │
  └─→ ESCALATED
       ↓
DECISION_PENDING (Awaiting Approver decision)
  ├─→ CLOSED_APPROVED (Account approved)
  ├─→ CLOSED_REJECTED (Application rejected)
  └─→ ESCALATED
       ↓
CUSTOMER_ACTION_REQUIRED (Waiting for customer response)
  ├─→ SUBMITTED (Customer uploads docs, RM re-verifies)
  ├─→ CLOSED_REJECTED (Customer failed to respond within SLA)
  └─→ ESCALATED

ESCALATED (Management review)
  ├─→ SUBMITTED (Request RM for document re-verification)
  ├─→ BUSINESS_REVIEW (Management decision: continue normally)
  ├─→ DECISION_PENDING (Management decision: jump to approver)
  ├─→ CLOSED_APPROVED (Board approved)
  ├─→ CLOSED_REJECTED (Board rejected)
  └─→ ESCALATED (Re-escalate to higher level)

CLOSED_APPROVED (Terminal state)
  └─→ (Account opened, no further actions)

CLOSED_REJECTED (Terminal state)
  └─→ (Application denied, customer notified)
```

## State Transition Rules

```
Rule 1: RM Document Verification is MANDATORY entry point
  IF case created WITHOUT RM document verification
  THEN block_transition_to(BUSINESS_REVIEW)
  
Rule 2: RM Discrepancies trigger CDD flag
  IF document_verification_status.requires_deep_dive = true
  THEN set_flag(CDD_DEEP_DIVE_REQUIRED)
  THEN notify_CDD("Deep verification needed for documents")

Rule 3: Only authorized actors can change state
  IF user.role NOT IN allowed_roles_for_transition
  THEN reject_transition()

Rule 4: Cannot skip stages
  IF current_state = BUSINESS_REVIEW AND new_state = COMPLIANCE
  THEN reject_transition()  ← Must go through CDD_REVIEW

Rule 5: If RM found discrepancies, CDD review is extended
  IF document_verification_status.discrepancies_found = true
  THEN sla_hours = 48  (instead of 24)
  THEN escalation_triggers at different thresholds

Rule 6: Customer must respond within SLA
  IF state = CUSTOMER_ACTION_REQUIRED AND NOW() > deadline
  THEN auto_transition_to(CLOSED_REJECTED)

Rule 7: Escalation always allowed
  IF new_state = ESCALATED
  THEN allow_transition()
```

## Case Data Structure (with Document Verification Metadata)

```
edd_cases {
  case_id: string,
  kyc_id: string,
  customer_id: string,
  
  # Current state
  case_status: SUBMITTED | BUSINESS_REVIEW | DOCUMENT_VERIFICATION_REQUIRED |
               CDD_DEEP_DIVE_REQUIRED | CDD_REVIEW | COMPLIANCE_REVIEW | 
               DECISION_PENDING | CUSTOMER_ACTION_REQUIRED | ESCALATED | 
               CLOSED_APPROVED | CLOSED_REJECTED,
  
  # Document verification metadata (set by RM)
  document_verification_status: { 
    verified_by_branch: true/false,
    verified_at: timestamp,
    verified_by_user_id: string,        # RM/Branch Officer who verified
    discrepancies_found: boolean,
    discrepancy_notes: string,          # specific issues found
    category: "MATCH" | "MINOR_DISCREPANCY" | "MAJOR_DISCREPANCY",
    requires_deep_dive: boolean         # CDD needs detailed verification
  },
  
  # Recommendation from Business
  business_recommendation: {
    created_by: BUSINESS_ANALYST,
    created_at: timestamp,
    recommendation: string,
    deep_dive_required: boolean         # CDD should do detailed verification
  },
  
  # CDD deep-dive (if RM flagged discrepancies)
  cdd_deep_dive_findings: {
    performed_by: CDD_OFFICER,
    performed_at: timestamp,
    discrepancy_resolution: string,     # how discrepancies were resolved
    verified_documents: [list],
    source_of_discrepancy: string       # error, fraud, typo, etc
  }
}
```

## State Machine Validator Implementation

```javascript
class StateMachineValidator {
  
  STATE_TRANSITIONS = {
    'SUBMITTED': ['BUSINESS_REVIEW'],
    'BUSINESS_REVIEW': [
      'CDD_REVIEW',                      // proceed normally
      'DOCUMENT_VERIFICATION_REQUIRED',  // send back to RM
      'CDD_DEEP_DIVE_REQUIRED',          // flag for CDD
      'CUSTOMER_ACTION_REQUIRED',        // request more docs
      'REJECTED',
      'ESCALATED'
    ],
    'DOCUMENT_VERIFICATION_REQUIRED': [
      'BUSINESS_REVIEW',                 // RM re-verified
      'CUSTOMER_ACTION_REQUIRED'
    ],
    'CDD_REVIEW': [
      'COMPLIANCE_REVIEW',
      'CUSTOMER_ACTION_REQUIRED',
      'REJECTED',
      'ESCALATED'
    ],
    'COMPLIANCE_REVIEW': [
      'DECISION_PENDING',
      'CUSTOMER_ACTION_REQUIRED',
      'REJECTED',
      'ESCALATED'
    ],
    'DECISION_PENDING': [
      'CLOSED_APPROVED',
      'CLOSED_REJECTED',
      'ESCALATED'
    ],
    'CUSTOMER_ACTION_REQUIRED': [
      'SUBMITTED',                      // customer uploaded, RM re-verifies
      'CLOSED_REJECTED',
      'ESCALATED'
    ],
    'ESCALATED': [
      'SUBMITTED',
      'BUSINESS_REVIEW',
      'DECISION_PENDING',
      'CLOSED_APPROVED',
      'CLOSED_REJECTED',
      'ESCALATED'
    ],
    'CLOSED_APPROVED': [],
    'CLOSED_REJECTED': []
  };

  validateTransition(currentState, newState, actor, caseData) {
    // Check if transition allowed
    if (!this.STATE_TRANSITIONS[currentState]?.includes(newState)) {
      return { valid: false, reason: 'Invalid state transition' };
    }

    // Check authorization
    const requiredRole = this.ROLE_REQUIREMENTS[newState];
    if (!actor.roles.includes(requiredRole)) {
      return { valid: false, reason: 'Insufficient permission' };
    }

    // Rule: RM verification is mandatory for entry to BUSINESS_REVIEW
    if (newState === 'BUSINESS_REVIEW' && currentState === 'SUBMITTED') {
      if (!caseData.document_verification_status?.verified_by_branch) {
        return { valid: false, reason: 'Document verification by RM is required' };
      }
    }

    // Rule: If CDD deep-dive flagged, extend SLA
    if (caseData.document_verification_status?.requires_deep_dive) {
      caseData.sla_hours = 48;  // CDD gets 48 hours instead of 24
    }

    // Rule: Customer must respond within SLA
    if (currentState === 'CUSTOMER_ACTION_REQUIRED') {
      const deadline = caseData.customer_response_deadline;
      if (NOW() > deadline && newState !== 'CLOSED_REJECTED') {
        return { valid: false, reason: 'SLA exceeded, must auto-reject' };
      }
    }

    return { valid: true };
  }
}
```

    // Check SLA
    if (currentState === 'CUSTOMER_ACTION_REQUIRED') {
      const deadline = case.customer_response_deadline;
      if (NOW() > deadline && newState !== 'CLOSED_REJECTED') {
        return { valid: false, reason: 'SLA exceeded, must reject' };
      }
    }

    return { valid: true };
  }
}
```

---

# 7. RISK EVALUATION FRAMEWORK

## Not a Decision Engine, but a Risk Calculator

```
RRGP does NOT:
❌ Make final approval/rejection decisions
❌ Determine if customer gets account

RRGP does:
✅ Calculate risk score from 7 factors
✅ Identify risk triggers
✅ Route case to appropriate reviewer
✅ Provide evidence for human decision
```

## 7-Factor Risk Scoring Model

### Factor 1: Nationality (0-100 points)

```
IF nationality IN (IRN, PRK, SYR, CUB, ...)  [OFAC List]
  THEN risk_points = 100  ← CRITICAL
  
ELSE IF nationality IN (HKG, ZWE, ...)        [Enhanced Screening]
  THEN risk_points = 50   ← HIGH
  
ELSE IF nationality = QA                      [Home country]
  THEN risk_points = 0    ← LOW
  
ELSE
  THEN risk_points = 10   ← MEDIUM (default)
```

### Factor 2: PEP Status (0-40 points)

```
IF pep_status = 'YES'
  THEN risk_points = 40   ← Political exposure
  
ELSE IF pep_status = 'RELATIVE_OF_PEP'
  THEN risk_points = 30   ← Related to PEP
  
ELSE
  THEN risk_points = 0    ← No PEP
```

### Factor 3: Occupation (0-30 points)

```
High-Risk Occupations:
  [LAWYER, ACCOUNTANT, POLITICIAN, JUDGE, ...]
  → risk_points = 30

Medium-Risk Occupations:
  [DOCTOR, ENGINEER, BANKER, ...]
  → risk_points = 15

Low-Risk Occupations:
  [TEACHER, NURSE, DRIVER, ...]
  → risk_points = 0
```

### Factor 4: Activity Ratio (0-25 points)

```
activity_ratio = expected_monthly_deposits / monthly_income

IF activity_ratio > 1.5
  THEN risk_points = 25   ← Very high deposits relative to income
  
ELSE IF activity_ratio > 1.2
  THEN risk_points = 15   ← Moderately high
  
ELSE
  THEN risk_points = 0    ← Normal
```

### Factor 5: Source of Funds (0-15 points)

```
Clear Sources (Low Risk):
  SALARY, INVESTMENT_RETURNS, BUSINESS_INCOME
  → risk_points = 0

Unclear Sources (Medium Risk):
  INHERITANCE, GIFT, SAVINGS
  → risk_points = 10

Suspicious Sources (High Risk):
  UNSPECIFIED, UNCLEAR, OTHER
  → risk_points = 15
```

### Factor 6: FATCA (0-10 points)

```
IF us_person = true
  THEN risk_points = 10   ← Requires FATCA reporting
  
ELSE
  THEN risk_points = 0    ← Not US person
```

### Factor 7: Transaction Pattern (0-20 points)

```
IF large_cash_deposits_pattern = true
  THEN risk_points = 20   ← All deposits in cash, no transfers
  
ELSE IF frequent_international_transfers = true
  THEN risk_points = 15   ← Multiple countries involved
  
ELSE IF volatility_high = (std_dev > 3x mean)
  THEN risk_points = 10   ← Erratic transaction pattern
  
ELSE
  THEN risk_points = 0    ← Normal pattern
```

## Risk Rating Calculation

```
total_risk_score = Factor1 + Factor2 + Factor3 + Factor4 + Factor5 + Factor6 + Factor7

                 = [0-100] + [0-40] + [0-30] + [0-25] + [0-15] + [0-10] + [0-20]

                 = 0 to 240 possible points
                 (capped at 100 for rating purposes)

Risk Ratings:
  0-19    → LOW
  20-39   → MEDIUM
  40-59   → HIGH
  60+     → CRITICAL  ← Automatic EDD trigger
```

## Examples

### Example 1: Low-Risk Customer
```
Ahmed Al-Ansari
├─ Nationality: QA (local) = 0
├─ PEP Status: NO = 0
├─ Occupation: Software Engineer = 15
├─ Activity Ratio: 0.8 = 0
├─ Source of Funds: Salary = 0
├─ FATCA: No = 0
├─ Transaction Pattern: Normal = 0
├─────────────────────────────────
TOTAL RISK: 15 → LOW RISK
ACTION: Auto-approve, account opened
```

### Example 2: Medium-Risk Customer
```
Fatima Al-Kaabi
├─ Nationality: QA = 0
├─ PEP Status: Relative of PEP = 30
├─ Occupation: Doctor = 10
├─ Activity Ratio: 1.3 = 15
├─ Source of Funds: Medical practice = 0
├─ FATCA: No = 0
├─ Transaction Pattern: Normal = 0
├─────────────────────────────────
TOTAL RISK: 55 → HIGH RISK
ACTION: EDD case created, Business Review stage
```

### Example 3: High-Risk Customer (CRITICAL)
```
Ahmed Al-Mansouri
├─ Nationality: QA = 0
├─ PEP Status: YES (political affiliation) = 40
├─ Occupation: Lawyer (high-risk profession) = 30
├─ Activity Ratio: 2.0 (very high deposits) = 25
├─ Source of Funds: Unclear/Gift = 15
├─ FATCA: Yes (US person) = 10
├─ Transaction Pattern: Erratic = 10
├─────────────────────────────────
TOTAL RISK: 130 → CRITICAL (capped 100)
ACTION: EDD case created with URGENT priority
        Escalated to management
        Verification call scheduled
        Extended due diligence required
```

## Risk Triggers (NOT Decisions)

Each risk factor can trigger specific actions:

```
IF nationality IN sanctioned_countries
  TRIGGER: MANDATORY_REJECTION  ← Escalate to compliance

IF pep_status = YES AND nationality = HIGH_RISK
  TRIGGER: VERIFY_SOURCE_OF_FUNDS  ← Schedule call

IF activity_ratio > 3.0
  TRIGGER: VERIFY_BUSINESS_ACTIVITY  ← Request documents

IF transaction_pattern = SUSPICIOUS
  TRIGGER: ENHANCED_SCREENING  ← CDD investigation required
```

---

# 8. SECURITY & AUTHORIZATION MODEL

## Authentication

```
Customer/Staff Login
       ↓
JWT Token Generation (signed with secret key)
       ↓
Token sent in Authorization header: "Bearer {token}"
       ↓
API validates token signature
       ↓
Extract user_id and roles from token
       ↓
Request processed with user context
```

## Authorization Layer (RBAC)

### Roles Defined

```
RELATIONSHIP_MANAGER / BRANCH_OFFICER (FRONTLINE)
├─ Can:
│  ├─ Collect KYC documents from customers
│  ├─ Access DMS to retrieve customer documents
│  ├─ Submit KYC application to system
│  ├─ Compare/verify documents against submitted data
│  ├─ Add verification notes/comments to cases
│  ├─ Flag discrepancies if found
│  └─ Route cases to Business Analyst
├─ Cannot:
│  ├─ Make approvals/rejections
│  ├─ Escalate cases
│  ├─ Assign to other users
│  ├─ Access cases not submitted by them
│  └─ Modify completed cases
└─ SLA: Same-day document collection & verification

BUSINESS_ANALYST
├─ Can:
│  ├─ View queued cases
│  ├─ Read RM verification notes
│  ├─ Request additional documents
│  ├─ Update findings
│  ├─ Route to CDD with recommendation (e.g., "deep-dive needed")
│  └─ Handle document discrepancy cases
├─ Cannot:
│  ├─ Make final decisions
│  ├─ Escalate without manager approval
│  └─ Modify CDD/Compliance findings
└─ SLA: 24 hours per stage

CDD_OFFICER
├─ Can:
│  ├─ Review CDD findings from Business Analyst
│  ├─ If flagged: Perform deep-dive verification
│  ├─ Request additional verification from RM/Branch
│  ├─ Request documents
│  ├─ Re-validate disputed documents
│  ├─ Escalate to compliance
│  └─ Document all detailed findings
├─ Cannot:
│  ├─ Make final decision
│  ├─ Override RM verification without evidence
│  └─ Close cases without Compliance/Approver
└─ SLA: 24 hours (48 hours if deep-dive)

COMPLIANCE_OFFICER
├─ Can:
│  ├─ Final compliance check
│  ├─ Sanctions/PEP verification
│  ├─ AML review
│  ├─ Review CDD verification notes on discrepancies
│  ├─ Make compliance recommendation
│  └─ Escalate to approver
├─ Cannot:
│  ├─ Make business decisions unilaterally
│  └─ Override all previous stage findings
└─ SLA: 24 hours per stage + 24 hours decision

APPROVER (Manager/Director)
├─ Can:
│  ├─ Make final approval/rejection decision
│  ├─ Override previous stages with justification
│  ├─ Escalate to board (high-value/controversial)
│  └─ Document rationale
├─ Cannot:
│  ├─ Skip stages
│  └─ Modify past stage decisions
└─ SLA: 8 hours for decision

OPERATIONS
├─ Can:
│  ├─ Monitor SLA health
│  ├─ Reassign cases
│  ├─ Escalate stuck cases
│  └─ Re-balance workload
├─ Cannot:
│  ├─ Make case decisions
│  └─ Modify case data
└─ Access: All cases

CONTACT_CENTER_AGENT
├─ Can:
│  ├─ View case for calling
│  ├─ Update interaction outcome
│  └─ Attach call recording
├─ Cannot:
│  ├─ Change case status
│  └─ Access other data
└─ Access: Cases with call_requested = true

AUDITOR
├─ Can:
│  ├─ View all cases
│  ├─ View all events
│  ├─ Review full audit trail
│  └─ Generate compliance reports
├─ Cannot:
│  ├─ Modify any case
│  ├─ View in real-time (report access only)
│  └─ Access customer PII (masked)
└─ Access: Read-only, all historical data
```

### Authorization Matrix

```
             │View│Assign│Request│Verify │Escalate│Approve│
             │Case│Queue │Docs   │Docs   │Case    │Reject │
─────────────┼────┼──────┼───────┼───────┼────────┼────────┤
RM/Branch    │ ✓¹ │  ✗   │  ✗    │  ✓    │   ✗    │   ✗   │
Business     │ ✓  │  ✓   │  ✓    │  ✗    │   ✗    │   ✗   │
CDD Officer  │ ✓  │  ✗   │  ✓    │  ✓    │   ✓    │   ✗   │
Compliance   │ ✓  │  ✗   │  ✗    │  ✗    │   ✓    │   ✓   │
Approver     │ ✓  │  ✗   │  ✗    │  ✗    │   ✓    │   ✓   │
Operations   │ ✓  │  ✓   │  ✗    │  ✗    │   ✓    │   ✗   │
CC Agent     │ ✓² │  ✗   │  ✗    │  ✗    │   ✗    │   ✗   │
Auditor      │ ✓  │  ✗   │  ✗    │  ✗    │   ✗    │   ✗   │

¹ RM/Branch: View only cases they submitted
² CC Agent: View only cases with active call request
```

### Authorization Database Table

```sql
CREATE TABLE authorization_rbac_matrix (
    rule_id INT PRIMARY KEY,
    role_name VARCHAR(30),
    action VARCHAR(50),        -- 'VIEW', 'ASSIGN', 'ESCALATE', etc
    resource VARCHAR(50),      -- 'case', 'document', 'queue'
    conditions JSONB,          -- e.g. { stage: 'BUSINESS_REVIEW' }
    allowed BOOLEAN,
    created_at TIMESTAMP
);

Examples:
{
  role: 'BUSINESS_ANALYST',
  action: 'COMPLETE_STAGE',
  resource: 'WORKFLOW_QUEUE',
  conditions: { stage: 'BUSINESS', current_stage_only: true },
  allowed: true
}

{
  role: 'BUSINESS_ANALYST',
  action: 'ESCALATE',
  resource: 'CASE',
  conditions: {},
  allowed: false
}
```

### Authorization Middleware

```javascript
// Protect all routes with this middleware
app.use(authorizationMiddleware);

async function authorizationMiddleware(req, res, next) {
  try {
    // 1. Extract JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    // 2. Verify token signature
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { user_id, roles, permissions }

    // 3. Check action permission
    const permission = await checkPermission(
      decoded.roles,
      req.method + ' ' + req.path,
      req.body
    );

    if (!permission.allowed) {
      return res.status(403).json({
        error: 'Forbidden',
        reason: permission.reason
      });
    }

    // 4. Proceed to request handler
    next();

  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
}

async function checkPermission(roles, action, resource) {
  // Query authorization_rbac_matrix
  // Return { allowed: boolean, reason: string }
}
```

## Sign-Off Requirements & Approval Thresholds

### Business Team Sign-Off

```
Approval Authority:
├─ Business Team Lead OR
├─ Segment Manager (Mass/Tamayuz/Private)
└─ For escalations: Segment Head

Required Sign-Offs:
├─ Document verification completed (Yes/No)
├─ Discrepancies identified (Yes/No)
├─ Business recommendation (MAINTAIN/EXIT)
│  └─ If EXIT: Justification required
├─ All corrections made (Yes/No)
└─ Ready for CDD (Yes/No)

Sign-Off Process:
├─ Digital signature (password-protected)
├─ Timestamp recorded
├─ Audit trail immutable
└─ Cannot be unsigned/revoked
```

### CDD Operations Sign-Off

```
Maker (CDD Officer):
├─ Prepares CDD documentation
├─ Documents findings
├─ Submits to Checker
└─ Digital signature required

Checker (CDD Officer + Supervisor):
├─ Reviews Maker's documentation
├─ Validates source of findings
├─ Approves or requests rework
├─ Final CDD sign-off authority
└─ Digital signature required

Approval Thresholds:
├─ Standard cases: CDD Officer Checker sign-off
├─ High-risk cases: CDD Manager approval required
├─ Document discrepancies: CDD Head approval required
└─ PEP/Sanctions cases: Compliance sign-off required
```

### Compliance Sign-Off

```
Approval Authority:
├─ Compliance Officer (primary)
├─ Compliance Manager (high-risk escalations)
└─ Compliance Head (strategic decisions)

Required Sign-Offs:
├─ PEP/Sanctions verification completed
├─ Regulatory risk assessment documented
├─ Restrictions (if any) approved
├─ QCB reporting requirement assessed
└─ Final regulatory decision (APPROVE/REJECT/ESCALATE)

Sign-Off Authority Matrix:
┌──────────────────┬──────────┬─────────────┬──────────────┐
│ Risk Level       │ Officer  │ Manager     │ Head         │
├──────────────────┼──────────┼─────────────┼──────────────┤
│ Low Risk         │ ✓        │ Auto        │ Auto         │
│ Medium Risk      │ ✓        │ ✓ (audit)   │ Auto         │
│ High Risk        │ —        │ ✓           │ Auto         │
│ PEP/Sanctions    │ —        │ ✓           │ ✓            │
│ Strategic Exit   │ —        │ —           │ ✓            │
└──────────────────┴──────────┴─────────────┴──────────────┘
```

### Final Approver Sign-Off

```
Approval Authority:
├─ Branch Manager (for $0-500K accounts)
├─ Segment Head (for $500K-5M accounts)
└─ Executive approval (for >$5M or strategic)

Final Decision Sign-Off:
├─ APPROVED: Account created automatically
├─ REJECTED: Customer notified, case closed
├─ ESCALATE: Board review initiated
└─ CONDITIONAL: Restrictions documented

Electronic Sign-Off:
├─ Digital signature with timestamp
├─ IP address logged
├─ Reason documented (short notes)
├─ Audit trail immutable
└─ Cannot be unsigned
```

### Audit Trail for All Sign-Offs

```
Recorded for Each Sign-Off:
├─ User ID & full name
├─ Department & role
├─ Timestamp (system time)
├─ Action taken (APPROVE/REJECT/REQUEST_REVISION)
├─ Reason/notes (if any)
├─ IP address
├─ Digital signature fingerprint
├─ Approval authority level
└─ Cannot be deleted or modified

Stored in Database:
├─ edd_case_events (immutable)
├─ approval_audit_trail (separate secure log)
└─ Both queryable for regulatory reports
```

---

## Data Security

```
At Rest:
├─ Database encryption (TDE - Transparent Data Encryption)
├─ Sensitive fields encrypted in DB
│  ├─ customer.id_number
│  ├─ customer.tax_id
│  └─ customer.phone_number
├─ Encryption key stored in secret vault
└─ Regular key rotation (quarterly)

In Transit:
├─ HTTPS/TLS 1.3 enforced
├─ API Gateway terminates SSL
├─ All communications encrypted
└─ HSTS headers set

Access Control:
├─ RBAC at API endpoint level
├─ RBAC at database row level
├─ Column-level encryption for PII
├─ Audit all data access
└─ Anonymous access prohibited
```

## Audit & Logging

```
Every action logged:
├─ User ID (who)
├─ Action (what)
├─ Timestamp (when)
├─ IP address (where)
├─ Result (success/failure)
└─ Changes made (old values → new values)

Stored in:
├─ edd_case_events (immutable event store)
├─ Application logs (searchable)
└─ Audit database (compliance)

Retention:
├─ Operational logs: 90 days
├─ Audit logs: 7 years
└─ Event store: Forever (immutable)
```

---

# 9. INTEGRATION ARCHITECTURE

## External Systems

### 1. T24 Core Banking System

```
Purpose: Account creation, balance inquiry, transaction processing

Integration Points:
├─ Create current/savings account
├─ Verify customer identity
├─ Apply customer KYC clearance
└─ Block account if rejected

Flow:
  RRGP Case CLOSED_APPROVED
       ↓
  Call T24 API: createAccount()
       ↓
  Return: { account_id, account_number, status }
       ↓
  RRGP records: { t24_account_id, account_opened_date }
       ↓
  Customer notified: Account ready for use

Error Handling:
├─ If T24 unavailable: Queue request, retry hourly
├─ If account creation fails: Escalate to operations
└─ Log all T24 calls for audit trail
```

###  2. CRP (Customer Relationship Platform)

```
Purpose: Maintain customer profile

Integration Points:
├─ Update customer KYC status
├─ Store risk rating
├─ Link EDD case to customer
└─ Segment for targeted marketing

Flow:
  RRGP updates customer profile at key events:
  ├─ KYC_SUBMITTED: { kyc_status: PENDING }
  ├─ EDD_CASE_CREATED: { edd_case_id, risk_rating }
  ├─ CASE_CLOSED_APPROVED: { kyc_status: APPROVED, account_eligible: true }
  └─ CASE_CLOSED_REJECTED: { kyc_status: REJECTED, rejection_reason }
```

### 3. QCB Verification (QIB Core Banking)

```
Purpose: Verify customer identity with core systems

Integration Points:
├─ Check existing customer records
├─ Verify ID numbers
├─ Check for duplicate accounts
└─ Screen against internal blacklists

Flow:
  RRGP KYC submission
       ↓
  Call QCB: verifyCustomer()
       ↓
  Return: { found: true/false, customer_id, existing_accounts: N }
       ↓
  If duplicate → Flag for compliance review
```

### 4. DMS (Document Management System)

```
Purpose: Store and retrieve case documents

Integration Points:
├─ Upload documents
├─ Retrieve for review
├─ Generate audit trail
└─ Retention policy management

Flow:
  Customer uploads document
       ↓
  RRGP: document_verification_engine.verifyDocument()
       ├─ Scan for malware
       ├─ Extract text (OCR)
       └─ Compress/index
       ↓
  Call DMS: storeDocument()
       ↓
  Return: { dms_reference_id, storage_location, checksum }
       ↓
  RRGP: Link DMS reference to case
       ↓
  On case closure: Set DMS retention policy
          (7-year hold for compliance)
```

### 5. Call Center (NICE/Genesys)

```
Purpose: Schedule and manage outbound verification calls

Integration Points:
├─ Queue outbound calls
├─ Provide call scripts
├─ Record interactions
└─ Update case from call outcome

Flow:
  EDD case created (CRITICAL risk)
       ↓
  RRGP: contact_center_integration.createCallRequest()
       ├─ Customer phone number
       ├─ Call script (optimized for risk type)
       ├─ Case context
       └─ Callback URL for recording delivery
       ↓
  Call Center receives request
       ↓
  Agent schedules call
       ↓
  Call completed
       ↓
  Call Center sends callback:
       { call_duration, outcome, recording_url }
       ↓
  RRGP: contact_center_integration.updateInteraction()
       ├─ Record call outcome
       ├─ Attach recording
       └─ Update case risk assessment
       ↓
  Case proceeds based on call outcome
```

### 6. Email Service (Nodemailer/SMTP)

```
Purpose: Send email notifications

Integration Points:
├─ Case assignment notifications
├─ SLA reminders
├─ Customer updates
└─ Final decision notifications

Configuration:
  SMTP Server: mail.qib.com
  Port: 587 (TLS)
  Sender: noreply@qib.com
  Queue: Dedicated email queue (100+ per hour)
  Retry: Auto-retry on failure (3 times, exponential backoff)

Template Engine:
  Per event_type:
  ├─ CASE_CREATED → case_creation_en.html
  ├─ DOCUMENT_REQUESTED → doc_request_en.html
  └─ CASE_CLOSED → case_closure_en.html

Tracking:
  ├─ Delivery status (PENDING, SENT, FAILED, BOUNCED)
  ├─ Open rate (pixel tracking)
  └─ Click tracking (link wrapping)
```

### 7. SMS Service (Twilio/AWS SNS)

```
Purpose: Send SMS to urgent cases

Integration Points:
├─ High-priority escalations
├─ SLA breach alerts
└─ Document request reminders

Configuration:
  Provider: Twilio
  Country: Qatar (+974)
  Queue: Dedicated SMS queue
  Rate Limit: 100 SMS/hour
  Retry: 3 automatic retries

Message Optimization:
  ├─ Max 160 characters (GSM 7-bit)
  ├─ Template-based (avoid dynamic content where possible)
  └─ Include case reference and action URL

Tracking:
  ├─ Delivery status (SENT, FAILED, DELIVERY_FAILED)
  └─ Performance metrics (cost per message, delivery rate)
```

### 8. Mobile Push (Firebase/APNs)

```
Purpose: Send push notifications to mobile banking app

Integration Points:
├─ Case status updates
├─ Document upload confirmations
├─ Approval notifications
└─ Urgent alerts

Configuration:
  iOS: APNs certificates
  Android: Firebase Cloud Messaging
  Mobile App: Integration SDK

Payload:
  {
    "title": "Your application has been approved",
    "body": "Click to view your new account details",
    "data": {
      "case_id": "CHG202403090001",
      "deep_link": "app://case/CHG202403090001",
      "action": "view_case"
    }
  }

Features:
  ├─ Badge count updates
  ├─ Sound/vibration control
  └─ Deep linking to app screens
```

---

# 10. SLA & ESCALATION ENGINE

## SLA Times Defined

```
BUSINESS_REVIEW Stage
├─ SLA: 24 hours
├─ Escalation at 50%: Send reminder email to assignee
├─ Escalation at 80%: Alert team manager
├─ Auto-escalation at 100%: 
│  └─ Create escalation queue entry
│     Reassign to available analyst OR escalate to manager
└─ Escalation at 120%: ALERT DIRECTOR

CDD_REVIEW Stage
├─ SLA: 24 hours
├─ Same escalation pattern as BUSINESS_REVIEW
└─

COMPLIANCE_REVIEW Stage
├─ SLA: 24 hours
├─ Escalation pattern same
└─

DECISION_PENDING Stage
├─ SLA: 8 hours (fast-track)
├─ Escalation at 50%: Notify approver
├─ Escalation at 100%: Alert director
└─ Escalation at 120%: Executive escalation

CUSTOMER_ACTION_REQUIRED
├─ SLA: 7 days
├─ Escalation at 50%: Send reminder email to customer
├─ Escalation at 100%: Auto-reject case
└─
```

## Escalation Rules Table

```sql
CREATE TABLE sla_escalation_rules (
    rule_id INT PRIMARY KEY,
    workflow_stage VARCHAR(30),
    sla_hours INT,
    escalation_percent INT,        -- 50, 80, 100, 120
    escalation_action VARCHAR(50), -- email, sms, escalate
    target_role VARCHAR(30),       -- who gets escalation
    message_template VARCHAR(100),
    is_automatic BOOLEAN
);

Examples:
{
  workflow_stage: 'BUSINESS_REVIEW',
  sla_hours: 24,
  escalation_percent: 50,
  escalation_action: 'email',
  target_role: 'BUSINESS_ANALYST',
  message: 'You have 12 hours to complete case review',
  is_automatic: true
}

{
  workflow_stage: 'BUSINESS_REVIEW',
  sla_hours: 24,
  escalation_percent: 100,
  escalation_action: 'escalate',
  target_role: 'TEAM_MANAGER',
  message: 'Case escalated due to SLA breach',
  is_automatic: true
}
```

## SLA Engine Job (Runs Every 5 Minutes)

```javascript
class SLAEngine {
  
  async checkDeadlines() {
    // 1. Find all PENDING/IN_PROGRESS workflow_queue entries
    const cases = await db.query(`
      SELECT 
        wq.queue_id, wq.case_id, wq.assigned_user,
        wq.due_date, wq.created_at,
        ec.case_priority, ec.customer_name,
        u.email as assignee_email
      FROM workflow_queue wq
      JOIN edd_cases ec ON wq.case_id = ec.case_id
      LEFT JOIN users u ON wq.assigned_user = u.user_id
      WHERE wq.queue_status IN ('PENDING', 'IN_PROGRESS')
        AND wq.due_date IS NOT NULL
    `);

    for (const caseRecord of cases) {
      const hoursRemaining = (caseRecord.due_date - NOW()) / 3600;
      const escalationPercent = (hoursRemaining / slaHours) * 100;

      // 2. Check if escalation threshold reached
      if (escalationPercent <= 50 && escalationPercent > 35) {
        // 50% SLA threshold - send reminder
        await this.sendEscalationNotification(
          caseRecord,
          'SLA_50_PERCENT',
          'You have 12 hours to complete this case'
        );
      }

      if (escalationPercent <= 20 && escalationPercent > 5) {
        // 80% SLA threshold - notify manager
        await this.notifyManager(
          caseRecord,
          'SLA_80_PERCENT',
          'Case at 80% SLA - needs attention'
        );
      }

      if (escalationPercent <= 0) {
        // 100% SLA - automatic escalation
        await this.escalateOnSLABreach(caseRecord);
      }
    }
  }

  async escalateOnSLABreach(caseRecord) {
    // 1. Find alternative assignee or manager
    const newAssignee = await workflowRouter.findBestAssignee(
      caseRecord.stage
    );

    if (newAssignee) {
      // Reassign to available person
      await db.update('workflow_queue', {
        assigned_user: newAssignee.user_id,
        queue_status: 'IN_PROGRESS'
      });
      
      await this.notifyEscalation(
        caseRecord.case_id,
        `Escalated to ${newAssignee.full_name} due to SLA breach`
      );
    } else {
      // Escalate to manager
      await db.insert('workflow_queue', {
        case_id: caseRecord.case_id,
        current_workflow_stage: 'ESCALATION',
        assigned_user: manager.user_id,
        queue_status: 'PENDING'
      });

      await this.notifyManager(
        caseRecord,
        'MANDATORY_ESCALATION',
        'Case escalated - no available staff for reassignment'
      );
    }
  }
}
```

---

# 11. DATA MODEL & RELATIONSHIPS

## Entity-Relationship Diagram

```
kyc_applications
  ├─ 1:1 ─→ edd_cases
  │         ├─ 1:4 ─→ workflow_queue
  │         ├─ 1:1 ─→ case_risk_assessment
  │         ├─ 1:N ─→ edd_case_events
  │         ├─ 1:N ─→ notifications
  │         ├─ 1:N ─→ contact_center_interaction
  │         └─ 1:N ─→ case_documents
  │
  └─ N:1 ─→ customers
              └─ 1:N ─→ contact_center_interaction
```

## Table Schemas (Summary)

```sql
-- KYC Applications (Original 6 tables)
kyc_applications
  ├─ kyc_id (PK)
  ├─ customer_id (FK)
  ├─ kyc_status
  ├─ edd_required
  └─ created_at

-- EDD Case Management (8 NEW tables)
edd_cases
  ├─ case_id (PK)
  ├─ kyc_id (FK)
  ├─ customer_id (FK)
  ├─ case_type
  ├─ case_status
  ├─ risk_rating
  ├─ assigned_to (FK users)
  ├─ final_decision
  └─ created_at

workflow_queue
  ├─ queue_id (PK)
  ├─ case_id (FK)
  ├─ current_workflow_stage
  ├─ assigned_user (FK)
  ├─ queue_status
  ├─ due_date
  ├─ sla_hours
  └─ created_at

case_risk_assessment
  ├─ assessment_id (PK)
  ├─ case_id (FK)
  ├─ overall_risk_rating
  ├─ risk_score (0-100)
  ├─ nationality_risk
  ├─ pep_status
  ├─ occupation_risk
  ├─ activity_ratio
  ├─ source_of_funds
  ├─ required_documents
  └─ created_at

edd_case_events (EVENT STORE)
  ├─ event_id (PK)
  ├─ case_id (FK)
  ├─ event_type
  ├─ event_data (JSONB)
  ├─ actor_id (FK users)
  ├─ created_at
  └─ IMMUTABLE

notifications
  ├─ notification_id (PK)
  ├─ case_id (FK)
  ├─ event_type
  ├─ recipient_user_id (FK)
  ├─ notification_type (EMAIL, SMS, PUSH)
  ├─ notification_status
  ├─ sent_at
  └─ read_at

contact_center_interaction
  ├─ interaction_id (PK)
  ├─ case_id (FK)
  ├─ interaction_type
  ├─ customer_phone
  ├─ call_duration
  ├─ recording_link
  ├─ call_outcome
  └─ created_at

change_management_workflow
  ├─ change_id (PK)
  ├─ case_id (FK)
  ├─ change_type
  ├─ submitted_by (FK users)
  ├─ checker_id (FK users)
  ├─ approval_status
  └─ created_at

dashboard_metrics
  ├─ metric_id (PK)
  ├─ metric_date
  ├─ kyc_today
  ├─ edd_cases_created
  ├─ high_risk_count
  ├─ sla_compliance_percent
  └─ recorded_at

system_configuration
  ├─ config_id (PK)
  ├─ config_key
  ├─ config_value
  ├─ data_type
  └─ updated_at

sla_escalation_rules
  ├─ rule_id (PK)
  ├─ workflow_stage
  ├─ escalation_percent
  ├─ escalation_action
  └─ target_role

authorization_rbac_matrix
  ├─ rule_id (PK)
  ├─ role_name
  ├─ action
  ├─ resource
  ├─ allowed
  └─ created_at
```

---

# 12. USE CASES & SCENARIOS

## Complete End-to-End Scenario: Ahmed Al-Mansouri

### Timeline: Wednesday, March 9, 2026

```
T = 09:00 AM ──────────────────────────────────────────────

STEP 1: Customer Opens Mobile App
├─ Ahmed navigates to "Open Account"
├─ Clicks "Start KYC Application"
└─ Form loads (6 sections, 70+ fields)

T = 09:05 AM ──────────────────────────────────────────────

STEP 2: Customer Fills KYC Form (5 minutes)
├─ Personal Info: Ahmed Al-Mansouri, Born: 1985
├─ ID Number: QID1234567890
├─ Nationality: Qatar
├─ Contact: fatima.ahmed@company.qa
├─ address: Qatar, Doha
├─ Employment: Business Owner at Trading Co.
├─ Monthly Income: 25,000 QAR
├─ Expected Deposits: 50,000 QAR/month (RATIO: 2.0x)
├─ PEP Status: YES ← Indicates political affiliation
├─ Tax Residency: Qatar
└─ FATCA: US Person (dual citizenship)

T = 09:10 AM ──────────────────────────────────────────────

STEP 3: Form Submission & Server Processing
├─ Mobile app calls: POST /api/v1/kyc/submit
├─ kyc_api_routes.submitKYCForm() receives data
├─ Validates all required fields ✓
├─ Calls: edd_case_engine.submitKYCandCreateCase(data)
│
├─ edd_case_engine.assessRiskFromKYC()
│  ├─ Nationality (Qatar): 0 points
│  ├─ PEP Status (YES): 40 points ← ALERT
│  ├─ Occupation (Business): 15 points
│  ├─ Activity Ratio (2.0): 25 points ← ALERT
│  ├─ Source of Funds (Business): 0 points
│  ├─ FATCA (US Person): 10 points
│  ├─ Transaction Pattern: Not yet available = 0
│  └─ TOTAL RISK SCORE: 90 points
│
├─ edd_case_engine.shouldTriggerEDD(riskAssessment)
│  └─ IF score >= 60: TRUE ← EDD TRIGGERED
│
├─ edd_case_engine.createEDDCase()
│  ├─ INSERT into edd_cases:
│  │  ├─ case_id: CHG202403090001
│  │  ├─ kyc_id: KYC202403090001
│  │  ├─ customer_id: CUS0000001
│  │  ├─ case_type: EDD
│  │  ├─ case_status: CREATED
│  │  ├─ case_priority: URGENT ← High risk = high priority
│  │  ├─ risk_rating: CRITICAL
│  │  ├─ assigned_to: NULL (will assign during routing)
│  │  └─ created_at: 09:10:00
│
├─ edd_case_engine.insertRiskAssessment()
│  └─ INSERT into case_risk_assessment with detailed scoring
│
├─ edd_case_engine.createAuditEvent(#1)
│  └─ EVENT: case_created
│     { case_id, risk_score: 90, risk_rating: CRITICAL }
│
├─ edd_case_engine.routeCase(CHG202403090001)
│  ├─ Get team for first stage: BUSINESS_ANALYST
│  │
│  ├─ workflow_router.findBestAssignee('BUSINESS_ANALYST')
│  │  ├─ Query available business analysts
│  │  ├─ Count active cases:
│  │  │  ├─ Fatima Ahmed: 1 active case ← LOWEST (SELECTED)
│  │  │  ├─ Mohammed Hassan: 4 active cases
│  │  │  └─ Layla Khan: 3 active cases
│  │  └─ Return: Fatima Ahmed (user_ba_001)
│  │
│  ├─ INSERT into workflow_queue (Stage 1):
│  │  ├─ case_id: CHG202403090001
│  │  ├─ current_workflow_stage: BUSINESS
│  │  ├─ assigned_user: user_ba_001 (Fatima)
│  │  ├─ queue_status: PENDING
│  │  ├─ due_date: Thursday 09:10 (24 hours)
│  │  ├─ sla_hours: 24
│  │  └─ sequence_order: 1
│  │
│  ├─ (Repeat for stages 2, 3, 4 with NULL assigned_user until reached)
│  │
│  ├─ edd_case_engine.createAuditEvent(#2)
│  │  └─ EVENT: case_routed_to_business
│  │     { queue_id, assigned_user: Fatima Ahmed }
│  │
│  └─ edd_case_engine.sendNotifications()
│     │
│     ├─ [NOTIFICATION #1] To: Team Manager (email)
│     │  ├─ Subject: "⚠️ CRITICAL EDD Case Created"
│     │  ├─ Body: "Case CHG202403090001\nCustomer: Ahmed Al-Mansouri (PEP)\nRisk Score: 90/100\nAssigned: Fatima Ahmed"
│     │  ├─ Priority: HIGH
│     │  └─ Status: SENT (2 seconds)
│     │
│     ├─ [NOTIFICATION #2] To: Fatima Ahmed (email + SMS)
│     │  ├─ Email Subject: "New Case Assigned: CHG202403090001"
│     │  ├─ Email: "You have been assigned a case.\nCustomer: Ahmed Al-Mansouri\nRisk: CRITICAL\nDue: Tomorrow 09:10"
│     │  ├─ SMS: "New case: CHG202403090001. Customer: Ahmed (PEP, CRITICAL). Due: 24h."
│     │  └─ Status: SENT (1 second for SMS, 2 for email)
│     │
│     ├─ [NOTIFICATION #3] To: All Dashboard Users (WebSocket broadcast)
│     │  ├─ Type: CASE_CREATED
│     │  ├─ Data: { case_id, risk_rating: CRITICAL, customer_name }
│     │  └─ Status: LIVE (real-time)
│     │
│     ├─ [NOTIFICATION #4] To: Manager (SMS - URGENT only)
│     │  ├─ Message: "🚨 CRITICAL CASE: CHG202403090001. PEP Customer Ahmed. High activity ratio. Immediate escalation required."
│     │  └─ Status: SENT (1 second)
│     │
│     └─ edd_case_engine.createAuditEvent(#3)
│        └─ EVENT: notifications_sent
│           { event_count: 4, channels: [EMAIL, SMS, WEBSOCKET] }
│
├─ edd_case_engine.requestContactCenterCall()
│  ├─ CRITICAL risk → automatic call request
│  │
│  ├─ contact_center_integration.createCallRequest()
│  │  ├─ INSERT into contact_center_interaction:
│  │  │  ├─ interaction_id: INT00001
│  │  │  ├─ case_id: CHG202403090001
│  │  │  ├─ interaction_type: OUTBOUND_CALL
│  │  │  ├─ customer_phone: +974-5555-1234
│  │  │  ├─ call_purpose: "Verify source of funds & business activity"
│  │  │  ├─ scheduled_at: 09:40 (30 minutes from submission)
│  │  │  ├─ interaction_status: SCHEDULED
│  │  │  └─ required_action: VERIFY_SOURCE_OF_FUNDS
│  │  │
│  │  └─ Queue for contact center:
│  │     { call_id: INT00001, customer_phone, case_ref, script: HIGH_RISK_PEP, scheduled_time }
│  │
│  └─ edd_case_engine.createAuditEvent(#4)
│     └─ EVENT: call_request_created
│
└─ edd_case_engine returns response to API:
   {
     "status": "SUCCESS",
     "kyc_id": "KYC202403090001",
     "case_id": "CHG202403090001",
     "edd_triggered": true,
     "risk_rating": "CRITICAL",
     "message": "EDD case created. Assigned to Fatima Ahmed. Verification call scheduled.",
     "timestamp": "2026-03-09T09:10:00Z"
   }

T = 09:11 AM ──────────────────────────────────────────────

STEP 4: Frontend Displays Confirmation to Customer
├─ Mobile app receives JSON response
├─ Displays success modal:
│  ┌─────────────────────────────────────────┐
│  │  ✓ SUBMISSION SUCCESSFUL               │
│  │                                         │
│  │  Application ID: KYC202403090001        │
│  │  Case ID: CHG202403090001               │
│  │                                         │
│  │  ⚠️ Enhanced Due Diligence Required     │
│  │                                         │
│  │  Your application is under review.      │
│  │  A case officer will contact you        │
│  │  within 2 business days at:             │
│  │  +974-5555-1234                         │
│  │                                         │
│  │  Reference: CHG202403090001              │
│  └─────────────────────────────────────────┘
│
├─ Customer stores reference number
└─ Mobile app stores case_id in local storage for tracking

T = 09:40 AM ──────────────────────────────────────────────

STEP 5: Contact Center Call (Automatic Verification)
├─ Call Center Agent receives case INT00001
├─ Agent calls: +974-5555-1234
├─ Call connects (calls Ahmed)
├─
├─ Agent reads script: "HIGH_RISK_PEP"
│  ├─ "Good morning Mr. Ahmed"
│  ├─ "I'm calling from Qatar Islamic Bank regarding your account application"
│  ├─ "Due to regulatory procedures, I need to verify some information"
│  ├─ "Can you confirm the source of your business income?"
│  └─ "Do you have any political positions or affiliations?"
│
├─ Ahmed responds: "I'm a business owner. My income is from trading company. No political positions."
├─ Agent rates call outcome: INFORMATION_GATHERED
├─ Call recording attached to case
├─ Agent completes interaction:
│  ├─ call_duration_seconds: 420 (7 minutes)
│  ├─ call_outcome: CUSTOMER_VERIFIED
│  ├─ outcome_notes: "Customer confirms business source. No political positions disclosed. Requires documentation."
│  ├─ recording_url: dms://recordings/INT00001_20260309.wav
│  └─ next_follow_up_date: NULL (no follow-up needed yet)
│
└─ contact_center_integration.updateInteraction()
   ├─ UPDATE contact_center_interaction with results
   ├─ edd_case_engine.createAuditEvent(#5)
   │  └─ EVENT: call_completed
   │     { interaction_id, outcome, duration_seconds, recording_url }
   │
   └─ Notify Fatima Ahmed (CDD will continue from here)

T = 10:00 AM Thursday (NEXT DAY) ──────────────────────────

STEP 6: Business Analyst Reviews Case (Fatima)
├─ Fatima logs into dashboard
├─ Sees: "Case CHG202403090001" at top of queue (URGENT, 24h deadline)
├─ Clicks to open case
│
├─ Reviews:
│  ├─ Risk Assessment: CRITICAL (90/100)
│  │  ├─ PEP Status: YES
│  │  ├─ Activity Ratio: 2.0x (exceeds threshold)
│  │  ├─ Age: 41 years
│  │  └─ Id verified: ✓
│  │
│  ├─ Contact Center Interaction:
│  │  ├─ Call outcome: CUSTOMER_VERIFIED
│  │  ├─ Duration: 7 minutes
│  │  ├─ Recording: ATTACHED
│  │  └─ Notes: "Confirms business source, no political positions"
│  │
│  └─ Fatima's Assessment:
│     └─ "Customer appears genuine but high activity ratio requires verification"
│
├─ Fatima takes action: REQUEST_DOCUMENTS
│  ├─ Document types needed:
│  │  ├─ Business license (for trading company)
│  │  ├─ Last 3 months bank statements
│  │  └─ CRNumber / CR registration
│  │
│  ├─ edd_case_engine.createAuditEvent(#6)
│  │  └─ EVENT: documents_requested
│  │     { requested_by: Fatima, document_types, due_date: +7 days }
│  │
│  └─ NOTIFICATION to Customer (Ahmed):
│     ├─ Email: "Documentation Required for Your Application
│        Please upload the following within 7 days:
│        1. Business license
│        2. Bank statements (3 months)
│        3. CR registration"
│     └─ SMS: "QIB: Upload required documents for your application. Download link: [URL]"
│
├─ Fatima updates case status: CUSTOMER_ACTION_REQUIRED
│  ├─ Case moves to CUSTOMER_ACTION_REQUIRED state
│  ├─ edd_case_engine.createAuditEvent(#7)
│  │  └─ EVENT: case_status_changed
│  │     { old_status: CREATED, new_status: CUSTOMER_ACTION_REQUIRED }
│  │
│  └─ Alert: "Awaiting customer response (7 day deadline)"
│
└─ T = 10:15 AM: Fatima completes stage, case marked READY_FOR_NEXT_STAGE

T = 10:15 AM Thursday ──────────────────────────────────

STEP 7: Workflow Transitions to Next Stage (CDD Review)
├─ edd_case_engine.completeWorkflowStage()
│  ├─ Validates state transition: BUSINESS → CDD (allowed)
│  ├─ UPDATE workflow_queue (Stage 1):
│  │  ├─ queue_status: COMPLETED
│  │  ├─ completed_at: NOW()
│  │  └─ completed_by: Fatima Ahmed
│  │
│  ├─ CREATE workflow_queue (Stage 2):
│  │  ├─ current_workflow_stage: CDD
│  │  ├─ assigned_user: NULL (awaiting documents)
│  │  ├─ queue_status: PENDING
│  │  ├─ due_date: +24 hours (when documents arrive)
│  │  └─ sequence_order: 2
│  │
│  ├─ edd_case_engine.createAuditEvent(#8)
│  │  └─ EVENT: stage_completed
│  │     { stage: BUSINESS, next_stage: CDD, reason: documents_requested }
│  │
│  └─ NOTIFICATION to CDD Officer (in queue):
│     ├─ Email: "Case Awaiting Your Review (CHG202403090001)
│        Status: Customer Action Required - Documents requested
│        Priority: URGENT
│        Review will begin once documents received"
│     └─ The case waits in PENDING state until customer uploads docs

T = 03:00 PM Friday (CUSTOMER RESPONDS) ──────────────────

STEP 8: Customer Uploads Documents
├─ Ahmed receives notification on his phone
├─ Opens mobile app
├─ Navigates to "Upload Documents"
├─ Selects files:
│  ├─ business_license.pdf
│  ├─ bank_statement_jan.pdf
│  ├─ bank_statement_feb.pdf
│  ├─ bank_statement_mar.pdf
│  └─ cr_registration.pdf
│
├─ Document verification engine:
│  ├─ Scan for malware ✓
│  ├─ Extract text via OCR ✓
│  ├─ Compress/index ✓
│  └─ Store in DMS → dms://cases/CHG202403090001/
│
├─ INSERT into case_documents (5 records)
├─ edd_case_engine.createAuditEvent(#9)
│  └─ EVENT: documents_uploaded
│     { file_count: 5, total_size: 2.3MB, document_types: [...] }
│
├─ NOTIFICATION to Fatima & CDD Officer:
│  ├─ Email: "Documents uploaded for case CHG202403090001
│     Customer: Ahmed Al-Mansouri
│     Files: business_license.pdf, bank_statements (3), cr_registration.pdf
│     Ready for CDD review"
│  └─ SMS: "Documents received for CHG202403090001. Ready for review."
│
└─ Case state transitioned:
   ├─ CUSTOMER_ACTION_REQUIRED → PENDING_REVIEW
   ├─ Update workflow_queue (Stage 2 - CDD):
   │  ├─ assigned_user: (workflow_router assigns to available CDD officer)
   │  ├─ queue_status: PENDING
   │  └─ due_date: Monday 03:00 PM (24 hours)
   │
   └─ edd_case_engine.createAuditEvent(#10)
      └─ EVENT: case_ready_for_review
         { documents_count: 5, ready_for_stage: CDD }

T = 09:00 AM Monday ──────────────────────────────────────

STEP 9: CDD Officer Reviews Case
├─ Aisha (CDD Officer) opens her dashboard
├─ Sees CHG202403090001 at top of queue
├─ Reviews:
│  ├─ Risk Assessment: CRITICAL (PEP + high activity)
│  │
│  ├─ Documents:
│  │  ├─ Business license: Valid, legal entity confirmed
│  │  ├─ Bank statements: Shows regular business transactions
│  │  ├─ CR registration: Verified, legitimate trading company
│  │  └─ Source of funds: CLEAR (business income)
│  │
│  ├─ Call recording: Reviewed, customer verified
│  │
│  └─ Aisha's Assessment:
│     "PEP status requires additional documentation per policy.
│      Business appears legitimate. Recommend proceeding to
│      compliance with PEP screening requirement."
│
├─ Aisha takes action: PROCEED_TO_COMPLIANCE
│  ├─ Updates: edd_cases.risk_rating from CRITICAL to HIGH (PEP only)
│  ├─ Adds note: "Business legitimacy verified. PEP status requires compliance sign-off"
│  │
│  ├─ edd_case_engine.createAuditEvent(#11)
│  │  └─ EVENT: cdd_review_completed
│  │     { approved_by: Aisha, risk_updated: CRITICAL→HIGH }
│  │
│  └─ Case transitions:
│     ├─ workflow_queue (Stage 2): COMPLETED by Aisha
│     ├─ workflow_queue (Stage 3): CREATED, assigned to Compliance Officer
│     ├─ Due date: Tuesday 09:00 AM (24 hours)
│     │
│     └─ NOTIFICATION to Compliance Officer:
│        ├─ Email: "Case CHG202403090001 Ready for Compliance Review
│           Customer: Ahmed Al-Mansouri (PEP)
│           Risk: HIGH (business legitimacy verified)
│           Required: PEP screening, sanctions check"
│        └─ SMS: "Compliance case: CHG202403090001. PEP customer. Due tomorrow."

T = 02:00 PM Monday ──────────────────────────────────────

STEP 10: Compliance Officer Final Review
├─ Karim (Compliance Officer) opens case
├─ Performs PEP/sanctions screening:
│  ├─ Screens Ahmed against OFAC list: NOT FOUND ✓
│  ├─ Screens against UN sanctions: NOT FOUND ✓
│  ├─ Domestic PEP list: Found match (Ahmed is on political affiliation list)
│  │                      But no sanctions/corruption charges
│  │
│  └─ Conclusion: "PEP status confirmed but no adverse information.
│                  Customer eligible for account with enhanced monitoring."
│
├─ Karim's recommendation: APPROVE_WITH_CONDITIONS
│  ├─ Approved: YES
│  ├─ Conditions:
│  │  ├─ Implement enhanced transaction monitoring
│  │  ├─ Quarterly enhanced due diligence review
│  │  └─ Flag large cash deposits (>50K) for review
│  │
│  ├─ edd_case_engine.createAuditEvent(#12)
│  │  └─ EVENT: compliance_review_completed
│  │     { approved_by: Karim, conditions_applied: [...] }
│  │
│  └─ Case transitions:
│     ├─ workflow_queue (Stage 3): COMPLETED
│     ├─ workflow_queue (Stage 4): CREATED (DECISION_PENDING)
│     ├─ assigned_user: Manager (for final approval)
│     ├─ due_date: Tuesday 02:00 PM (8 hours for decision)
│     │
│     └─ NOTIFICATION to Manager:
│        ├─ Email: "Case CHG202403090001 Ready for Final Approval
│           Customer: Ahmed Al-Mansouri
│           Recommendation: APPROVED (with conditions)
│           Conditions: Enhanced monitoring, quarterly review
│           Action Required: Final approval / rejection decision"
│        └─ SMS: "Final approval needed: CHG202403090001. Recommended: APPROVED."

T = 03:30 PM Monday ──────────────────────────────────────

STEP 11: Manager Makes Final Decision
├─ Manager logs in
├─ Reads all case evidence:
│  ├─ Risk assessment: 90/100 (PEP + high activity)
│  ├─ Call verification: PASSED (customer verified)
│  ├─ Documents: All VERIFIED (business legitimate)
│  ├─ Compliance: APPROVED_WITH_CONDITIONS
│  └─ Recommended action: APPROVE
│
├─ Manager decision: APPROVE_ACCOUNT_CREATION
│  ├─ Final decision: APPROVED
│  ├─ Decision notes: "Customer approved for account. PEP status managed per enhanced monitoring policy."
│  │
│  ├─ Authorization check:
│  │  ├─ Manager has APPROVE permission: ✓
│  │  ├─ Case in DECISION_PENDING state: ✓
│  │  └─ Allowed to transition to CLOSED_APPROVED: ✓
│  │
│  ├─ edd_case_engine.createAuditEvent(#13)
│  │  └─ EVENT: final_decision_made
│  │     { approved_by: Manager, decision: APPROVED, conditions: [...] }
│  │
│  ├─ Case transitions:
│  │  ├─ edd_case.case_status: CLOSED_APPROVED
│  │  ├─ edd_case.final_decision: APPROVED
│  │  ├─ workflow_queue (Stage 4): COMPLETED
│  │  └─ Total processing time: 4 days, 18 hours
│  │
│  ├─ Trigger next action:
│  │  ├─ Call T24 API: createAccount()
│  │  │  └─ Return: { account_id: 4001234567, account_number, status: ACTIVE }
│  │  │
│  │  ├─ Call CRP API: updateCustomerProfile()
│  │  │  └─ Set: { kyc_status: APPROVED, account_eligible: true }
│  │  │
│  │  └─ edd_case_engine.createAuditEvent(#14)
│  │     └─ EVENT: account_creation_triggered
│  │        { t24_account_id: 4001234567, account_number: 4001234567 }
│  │
│  └─ NOTIFICATION to Customer (Ahmed):
│     ├─ Email: "✓ Your Application Has Been APPROVED
│        Congratulations! We're pleased to inform you that your
│        account application has been approved.
│        Account Number: 4001234567
│        You can now start using your Qatar Islamic Bank Account.
│        Download the app or visit your nearest branch.
│        Reference: CHG202403090001"
│     │
│     ├─ SMS: "✓ QIB: Your account approved! Number: 4001234567. Download app to start."
│     │
│     ├─ Mobile Push:
│     │  ├─ Title: "Your QIB Account is Ready!"
│     │  ├─ Body: "Click to view your new account details"
│     │  ├─ Deep link: "app://account/4001234567"
│     │  └─ Badge: +1
│     │
│     └─ Dashboard:
│        ├─ Broadcast case closed event
│        ├─ Update customer count metrics
│        └─ Record in KPI dashboard

T = 04:00 PM Monday ──────────────────────────────────────

STEP 12: Case Audit Trail Complete
├─ Total events recorded: 14
│  1. case_created
│  2. case_routed_to_business
│  3. notifications_sent
│  4. call_request_created
│  5. call_completed
│  6. documents_requested
│  7. case_status_changed
│  8. stage_completed (Business)
│  9. documents_uploaded
│  10. case_ready_for_review
│  11. cdd_review_completed
│  12. compliance_review_completed
│  13. final_decision_made
│  14. account_creation_triggered
│
├─ Event store is immutable
│  ├─ Every change tracked
│  ├─ Every actor identified
│  ├─ Every timestamp recorded
│  └─ Compliance audit trail: 100% coverage
│
├─ Final metrics:
│  ├─ Processing time: 4 days, 18 hours
│  ├─ Assigned staff: 4 people (Fatima, Aisha, Karim, Manager)
│  ├─ Stages completed: 4/4
│  ├─ SLA compliance: 100% (all stages completed within SLA)
│  ├─ Documents collected: 5
│  ├─ Notifications sent: 12
│  ├─ Risk assessment: Multi-factor (7 factors evaluated)
│  └─ Decision: Human-made (AI provided assessment only)
│
└─ Dashboard updated:
   ├─ CLOSED_APPROVED count: +1
   ├─ Processing time average: Updated
   ├─ SLA compliance %: 98.5%
   └─ PEP customers approved: 1

END OF SCENARIO ──────────────────────────────────────────────
```

---

# 13. NON-FUNCTIONAL REQUIREMENTS

## Performance Requirements

```
API Response Times:
├─ KYC form submission: < 2 seconds
├─ Case status query: < 500ms
├─ Case list query (queue): < 1 second
├─ Risk assessment calculation: < 100ms
└─ Database queries: < 100ms (95th percentile)

Throughput:
├─ Peak load: 100 KYC submissions/hour
├─ Average daily: 500 submissions
├─ Dashboard concurrent users: 50
├─ WebSocket connections: 100+

Notification Delivery:
├─ Email: < 5 seconds
├─ SMS: < 1 second
├─ Mobile push: < 2 seconds
├─ Dashboard (WebSocket): Real-time (< 100ms)

Database:
├─ Connection pool: 20 connections
├─ Query timeout: 30 seconds (max)
├─ Transaction timeout: 5 minutes (max)
└─ Backup frequency: Hourly + daily + weekly

Storage:
├─ Database size: ~10GB (estimated)
├─ Document storage: ~100GB/year
├─ Event log retention: 7 years (immutable)
└─ Log retention: 3 months
```

## Availability Requirements

```
SLA: 99.5% uptime
├─ Planned downtime: 4 hours/month (maintenance)
├─ Unplanned downtime: < 30 seconds/month
└─ Recovery time objective (RTO): 1 hour
    Recovery point objective (RPO): 1 hour

High Availability:
├─ Database failover: Automatic
├─ Application servers: Load balanced (3+)
├─ API gateway: Redundancy
├─ Data center redundancy: Yes
└─ Geographic distribution: Primary + DR site
```

## Security Requirements

```
Data Encryption:
├─ At rest: AES-256
├─ In transit: TLS 1.3
└─ Database: Transparent encryption (TDE)

Authentication:
├─ JWT tokens with 1-hour expiry
├─ Multi-factor authentication (MFA) for admin
├─ OAuth 2.0 for external integrations
└─ API keys for backend-to-backend

Authorization:
├─ RBAC implementation
├─ Fine-grained access control
├─ Row-level security for sensitive cases
└─ Column-level encryption for PII

Audit & Compliance:
├─ Immutable event store (7-year retention)
├─ All user actions logged
├─ Tamper detection
├─ Quarterly access reviews
└─ Annual security audit
```

## Scalability Requirements

```
Horizontal Scaling:
├─ Stateless API servers
├─ Load-balanced behind API gateway
├─ Database read replicas for reporting
└─ Cache layer for metrics (Redis)

Vertical Scaling:
├─ Database upgrade path (more cores/memory)
├─ Storage expansion (NAS/cloud)
└─ Network bandwidth upgrade

Auto-scaling:
├─ CPU threshold: > 70% → add instance
├─ Response time threshold: > 2sec → add instance
├─ Queue depth threshold: > 100 → add workers
└─ Memory threshold: > 80% → alert operations
```

## Maintainability Requirements

```
Code Quality:
├─ Type safety (TypeScript or similar)
├─ Unit test coverage: > 80%
├─ Integration test coverage: > 60%
├─ Code review before merge
└─ Static analysis (linting, security scanning)

Documentation:
├─ API documentation (Swagger/OpenAPI)
├─ Architecture documentation (this doc)
├─ Operational runbooks
├─ Troubleshooting guides
└─ Staff training materials

Monitoring:
├─ Application performance monitoring (APM)
├─ Log aggregation (ELK stack)
├─ Alert thresholds defined
├─ Dashboard for operations team
└─ Incident response process
```

---

# 14. DEPLOYMENT ARCHITECTURE

## Infrastructure Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      LOAD BALANCER                          │
│               (HAProxy / AWS ELB / Nginx)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY                              │
│             (Kong / AWS API Gateway / Nginx)                │
│  ├─ Rate limiting                                           │
│  ├─ Request logging                                         │
│  ├─ Authentication (JWT verification)                       │
│  └─ Response routing                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴─────────────────┐
        ↓                                     ↓
┌──────────────────────┐      ┌──────────────────────┐
│ API Server #1        │      │ API Server #2        │
│ (Node.js)            │      │ (Node.js)            │
│                      │      │                      │
│ ┌─────────────────┐  │      │ ┌─────────────────┐  │
│ │ kyc_api_routes  │  │      │ │ kyc_api_routes  │  │
│ │ case_api_routes │  │      │ │ case_api_routes │  │
│ │ [...handlers]   │  │      │ │ [...handlers]   │  │
│ └─────────────────┘  │      │ └─────────────────┘  │
│                      │      │                      │
│ ┌─────────────────┐  │      │ ┌─────────────────┐  │
│ │ Business Logic  │  │      │ │ Business Logic  │  │
│ │ ├─ case_engine  │  │      │ │ ├─ case_engine  │  │
│ │ ├─ workflow     │  │      │ │ ├─ workflow     │  │
│ │ ├─ sla_engine   │  │      │ │ ├─ sla_engine   │  │
│ │ └─ auth_layer   │  │      │ │ └─ auth_layer   │  │
│ └─────────────────┘  │      │ └─────────────────┘  │
└──────────────────────┘      └──────────────────────┘
        ↓                                     ↓
┌──────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                             │
│              (PostgreSQL Primary)                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 14 Tables:                                             │  │
│  │ ├─ edd_cases (master)                                 │  │
│  │ ├─ workflow_queue (routing)                           │  │
│  │ ├─ edd_case_events (audit store - IMMUTABLE)         │  │
│  │ ├─ notifications                                      │  │
│  │ ├─ [+11 more tables]                                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  └─ Read Replicas (for reporting/analytics)                │
└──────────────────────────────────────────────────────────────┘
     ↑                              ↑
     │                              │
     └──────────┬───────────────────┘
                ↓
     ┌──────────────────────┐
     │  WebSocket Server    │
     │  (Real-time updates) │
     │  & Caching (Redis)   │
     └──────────────────────┘

External Services (via Adapters):
├─ T24 (Core Banking) - HTTP API
├─ CRP (Customer Profile) - HTTP API
├─ DMS (Document Storage) - REST API or SFTP
├─ Call Center (NICE) - REST API
├─ Email Service (Nodemailer) - SMTP
├─ SMS Service (Twilio) - HTTP API
└─ Mobile Push (Firebase/APNs) - HTTP API
```

## Deployment Models

### Option A: On-Premises (QIB Data Center)

```
Architecture:
├─ Physical servers (3x API, 1x DB Primary, 1x DB Replica)
├─ Load balancer (F5 or similar)
├─ Storage array (SAN) for documents
├─ Backup appliance (Netbackup or similar)
└─ Network: 10Gbps backbone

Scaling:
├─ Manual addition of servers
├─ Database replication (hot standby)
└─ Failover via load balancer

Cost Model:
├─ CapEx: Server hardware + storage
├─ OpEx: Power, cooling, maintenance, staff
└─ Payback period: 5 years

Recovery:
├─ RTO: 1 hour (manual failover)
├─ RPO: 1 hour (transaction logs)
└─ Backup: Daily full + hourly incremental
```

### Option B: Hybrid Cloud (Preferred)

```
Architecture:
├─ Primary: QIB Data Center
│  └─ API servers + Database Primary
│
├─ Secondary: Cloud Provider (AWS/Azure/Google Cloud)
│  └─ Disaster Recovery standby (warm)
│
└─ Shared Services:
   ├─ Email/SMS (Cloud)
   ├─ File storage (Cloud CDN)
   └─ Analytics (Cloud DW)

Scaling:
├─ Auto-scaling in cloud during peak
├─ Rapid provisioning of new instances
└─ Elasticity for variable load

Cost Model:
├─ Primary infrastructure: Fixed cost
├─ Cloud: Variable cost (usage-based)
└─ Total: Lower than on-prem + higher than cloud-only

Recovery:
├─ RTO: < 15 minutes (automatic failover)
├─ RPO: < 5 minutes (continuous replication)
└─ Geo-redundancy included
```

### Option C: Cloud Native (AWS/Azure)

```
Architecture:
├─ API: ECS/EKS (containerized)
├─ Database: RDS Aurora (managed)
├─ Storage: S3/Blob
├─ Messaging: SQS/SNS
├─ Cache: ElastiCache
└─ CDN: CloudFront/Azure CDN

Scaling:
├─ Auto-scaling groups (CPU/memory-based)
├─ Serverless options (Lambda/Functions)
├─ Managed databases (automatic)
└─ Infrastructure as Code (CloudFormation/Terraform)

Cost Model:
├─ Pure operational expense
├─ Variable cost based on usage
├─ Discounts for reserved instances
└─ Estimated: $5K-15K/month for this scale

Recovery:
├─ RTO: < 5 minutes (built-in redundancy)
├─ RPO: < 1 minute (continuous backup)
└─ Multiple availability zones
```

---

# 15. RISK & MITIGATION

## Technical Risks

```
RISK: Database failure
├─ Impact: Complete system outage
├─ Probability: Medium
└─ Mitigation:
   ├─ Automatic failover (read replicas)
   ├─ Hourly backups + point-in-time recovery
   ├─ Disaster recovery testing (quarterly)
   └─ Replication across data centers

RISK: API server failure
├─ Impact: Partial outage (load balanced)
├─ Probability: Low
└─ Mitigation:
   ├─ Load balancer with health checks
   ├─ Auto-restart on crash
   ├─ Application monitoring + alerting
   └─ Horizontal scaling for degraded mode

RISK: External integration failure (T24, DMS, etc)
├─ Impact: Feature degradation
├─ Probability: Medium (external service outages)
└─ Mitigation:
   ├─ Adapter pattern (isolate from core)
   ├─ Graceful degradation
   ├─ Retry logic with exponential backoff
   ├─ Circuit breaker pattern
   └─ Queue requests during outage

RISK: Security breach
├─ Impact: PII data exposure, compliance violation
├─ Probability: Low (but high impact)
└─ Mitigation:
   ├─ Encryption at rest + in transit
   ├─ RBAC + strong authentication
   ├─ Regular security audits
   ├─ Penetration testing (annual)
   ├─ Intrusion detection system (IDS)
   └─ Incident response plan
```

## Operational Risks

```
RISK: Human error in case decision
├─ Impact: Incorrect approval/rejection
├─ Probability: Medium
└─ Mitigation:
   ├─ State machine validation (prevent invalid transitions)
   ├─ Mandatory evidence review (system enforces)
   ├─ Approval workflow (multiple eyes)
   ├─ Audit trail (trace every decision)
   └─ Training for staff

RISK: SLA breach due to insufficient staff
├─ Impact: Customer delays, regulatory issues
├─ Probability: Medium
└─ Mitigation:
   ├─ Intelligent routing (load balancing)
   ├─ Workload rebalancing (hourly job)
   ├─ Escalation automation (reduce manual effort)
   ├─ Headcount planning (based on volume projections)
   └─ Overflow handling (contract staff)

RISK: Customer complaint due to slow processing
├─ Impact: Brand damage, regulatory inquiry
├─ Probability: Medium
└─ Mitigation:
   ├─ Target SLA times (24-48 hours per stage)
   ├─ Real-time status tracking (customer notification)
   ├─ Proactive communication (document requests)
   ├─ Escalation for stuck cases
   └─ Root cause analysis (post-mortems)
```

## Compliance Risks

```
RISK: Audit trail gaps
├─ Impact: Regulatory non-compliance
├─ Probability: Low (immutable event store mitigates)
└─ Mitigation:
   ├─ Event store enforces immutability
   ├─ No data deletion (only archival)
   ├─ Quarterly audit log review
   ├─ External auditor access
   └─ Compliance certification

RISK: PII mishandling
├─ Impact: Customer privacy violation, CBK fine
├─ Probability: Low
└─ Mitigation:
   ├─ Column-level encryption for sensitive data
   ├─ Access logs for PII requests
   ├─ Data minimization (only collect necessary)
   ├─ Retention policy (purge old data)
   └─ Privacy impact assessment (annual)

RISK: KYC/AML violations
├─ Impact: Regulatory enforcement action
├─ Probability: Low (system enforces controls)
└─ Mitigation:
   ├─ Automated risk assessment (multi-factor)
   ├─ Enhanced due diligence on triggers
   ├─ Mandate human decision (no full automation)
   ├─ Escalation for edge cases
   └─ Compliance training (staff)
```

---

# 16. COMPLIANCE & AUDIT

## Regulatory Framework

```
Applicable Regulations:
├─ CBK (Central Bank of Kuwait) KYC Guidelines
├─ AMLR (Anti-Money Laundering Regulations)
├─ CTF (Counter-Terrorist Financing)
├─ PAR (Personal Data Protection)
└─ Other: CDD, EDD, Sanctions Screening, Currency Control

RRGP Compliance:
├─ ✅ Mandatory KYC for all customers
├─ ✅ Risk-based approach (7-factor scoring)
├─ ✅ EDD for high-risk customers
├─ ✅ Immutable audit trail (7-year retention)
├─ ✅ RBAC + strong authentication
├─ ✅ Data encryption
├─ ✅ Regular monitoring
└─ ✅ Staff training (annual)
```

## Audit Trail

```
What is Audited:
├─ Every case event (created, assigned, routed, closed)
├─ Every user action (view, update, escalate, approve)
├─ Every data change (with before/after values)
├─ Every system action (email sent, SMS sent, call requested)
├─ Every error (failed validation, integration failure)
└─ Every access (who viewed customer PII, when, why)

How it's Stored:
├─ edd_case_events table (immutable, crypto-signed)
├─ Application logs (aggregated, searchable)
├─ Database transaction logs (point-in-time recovery)
└─ Security logs (access control, authentication)

Retention Policy:
├─ Event store: 7 years (regulatory requirement)
├─ Application logs: 3 months (ops use)
├─ Database backups: 1 month (point-in-time recovery)
└─ Security logs: 1 year (incident investigation)

Audit Access:
├─ Auditors: Read-only access to all logs
├─ Compliance: Quarterly audit trail review
├─ External: Annual third-party audit
└─ Legal: Access for investigations
```

---

# 17. RISK MANAGEMENT MONITORING DASHBOARD

## لوحة متابعة المخاطر — Risk Monitoring Dashboard

To strengthen governance and oversight, the platform includes a **dedicated Risk Management Monitoring Dashboard** accessible to the **Risk Management Group** under the supervision of **Mr. Rakesh — Head of Risk Governance**.

The dashboard provides centralized, real-time visibility over all activities related to operational, compliance, and customer due diligence risks. This enables the Risk team to monitor risk indicators, review operational changes, and identify potential control weaknesses before they escalate.

## 17.1 Dashboard Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    RISK MANAGEMENT MONITORING DASHBOARD                  │
│                    Supervised by: Mr. Rakesh                             │
│                    Access: Risk Management Group (RBAC-controlled)       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ OPERATIONAL RISK │  │ KYC/EDD STATUS  │  │ POLICY & PROCEDURES    │  │
│  │ MONITORING       │  │ MONITORING      │  │ CHANGE TRACKING        │  │
│  │                  │  │                  │  │                        │  │
│  │ • High-risk      │  │ • Expired KYC   │  │ • SOP updates pending │  │
│  │   onboarding     │  │ • Pending EDD   │  │ • Guideline changes    │  │
│  │ • Escalated EDD  │  │ • Under invest. │  │ • Checklist mods       │  │
│  │ • Suspicious tx  │  │ • Restricted    │  │ • Approval status      │  │
│  │ • Failed verif.  │  │   accounts      │  │                        │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ RISK ALERTS &   │  │ REGULATORY &    │  │ ENTERPRISE RISK        │  │
│  │ NOTIFICATIONS   │  │ AUDIT REPORTING │  │ SCORING ENGINE         │  │
│  │                  │  │                  │  │                        │  │
│  │ • Unusual ops   │  │ • Internal audit│  │ • Customer risk score  │  │
│  │ • Doc mismatches│  │ • Compliance rpt│  │ • Operation risk score │  │
│  │ • TX anomalies  │  │ • QCB reports   │  │ • Employee risk score  │  │
│  │ • Ctrl overrides│  │ • Audit trails  │  │ • Aggregate risk map   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                    RISK HEAT MAP & TREND ANALYSIS                │    │
│  │  Real-time visualization of risk distribution across segments    │    │
│  │  Historical trends • Predictive indicators • Threshold alerts   │    │
│  └──────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

## 17.2 Operational Risk Monitoring

Displays all operational activities that may present potential risk exposure:

```
OPERATIONAL RISK INDICATORS:
├─ High-Risk Customer Onboarding
│  ├─ Risk score ≥ 60 (EDD threshold)
│  ├─ PEP-classified customers
│  ├─ Sanctions-flagged customers
│  ├─ High-risk nationality / jurisdiction
│  └─ Real-time counter: [XX] active high-risk cases
│
├─ Escalated EDD Cases
│  ├─ Cases escalated beyond L1 (to Manager/Head)
│  ├─ Cases with > 2 rework cycles
│  ├─ Cases approaching SLA breach
│  ├─ Cases with unresolved document discrepancies (MAJOR)
│  └─ Real-time counter: [XX] escalated cases
│
├─ Suspicious Transaction Indicators
│  ├─ Transactions flagged by AML engine
│  ├─ Unusual transaction volume / frequency
│  ├─ Cross-border transfer patterns
│  ├─ Cash-intensive business indicators
│  └─ Real-time counter: [XX] flagged transactions
│
└─ Failed Document Verification Attempts
   ├─ Documents classified as MAJOR discrepancy
   ├─ Repeated verification failures (same customer)
   ├─ Potentially fraudulent document indicators
   ├─ Unverifiable source of funds declarations
   └─ Real-time counter: [XX] failed verifications
```

## 17.3 KYC / EDD Status Monitoring

Provides real-time visibility of the customer due diligence pipeline:

```
KYC/EDD STATUS BOARD:
┌────────────────────────┬──────────┬────────────┬───────────┐
│ Status Category        │ Mass     │ Tamayuz    │ Private   │
├────────────────────────┼──────────┼────────────┼───────────┤
│ Expired KYC            │ [count]  │ [count]    │ [count]   │
│ KYC Expiring < 30 days │ [count]  │ [count]    │ [count]   │
│ Pending EDD Review     │ [count]  │ [count]    │ [count]   │
│ Under Investigation    │ [count]  │ [count]    │ [count]   │
│ Restricted Accounts    │ [count]  │ [count]    │ [count]   │
│ Closed (Rejected)      │ [count]  │ [count]    │ [count]   │
│ SLA Breached           │ [count]  │ [count]    │ [count]   │
└────────────────────────┴──────────┴────────────┴───────────┘

DRILL-DOWN CAPABILITY:
├─ Click any cell → List of individual cases
├─ Filter by: Date range, RM, Branch, Risk level
├─ Sort by: Age, Risk score, SLA remaining
└─ Export: CSV, PDF for reporting
```

## 17.4 Policy & Procedure Change Tracking

Allows the Risk team to track and approve updates to operational procedures:

```
CHANGE TRACKING DASHBOARD:
├─ Pending Changes
│  ├─ SOP updates awaiting Risk approval
│  ├─ Operational guideline modifications
│  ├─ Compliance checklist changes
│  ├─ Workflow configuration updates
│  └─ System parameter changes
│
├─ Recently Approved Changes
│  ├─ Last 30 days approved changes
│  ├─ Approved by whom (Risk officer name)
│  ├─ Effective date
│  └─ Impact assessment summary
│
└─ Change History
   ├─ Full version history of all operational documents
   ├─ Diff view (before/after comparison)
   ├─ Approval chain audit trail
   └─ Regulatory alignment verification

GOVERNANCE RULE:
┌─────────────────────────────────────────────────────────────┐
│ Any change submitted through the system must be reviewed    │
│ and approved through the Risk Governance workflow before    │
│ activation. No operational document update becomes          │
│ effective until Risk Management approval is granted.        │
└─────────────────────────────────────────────────────────────┘
```

## 17.5 Risk Alerts & Notifications

The dashboard automatically generates alerts for risk events:

```
ALERT CATEGORIES:
├─ 🔴 CRITICAL (Immediate intervention required)
│  ├─ Confirmed sanctions match
│  ├─ Confirmed fraud indicator
│  ├─ System control override by unauthorized role
│  ├─ Data breach detected
│  └─ Delivery: Dashboard + SMS + Email to Mr. Rakesh + Risk Head
│
├─ 🟠 HIGH (Review within 4 hours)
│  ├─ PEP customer with unusual activity
│  ├─ Multiple document MAJOR discrepancies (same customer)
│  ├─ High transaction anomaly score
│  ├─ SLA breach on high-risk case
│  └─ Delivery: Dashboard + Email to Risk team
│
├─ 🟡 MEDIUM (Review within 24 hours)
│  ├─ Unusual operational pattern (volume spike)
│  ├─ Repeated document mismatches (trend)
│  ├─ Policy change pending approval > 48 hours
│  ├─ Staff performing actions outside normal hours
│  └─ Delivery: Dashboard + Email digest
│
└─ 🔵 LOW (Informational — Weekly review)
   ├─ KYC expiry approaching (30-day window)
   ├─ Minor operational deviations
   ├─ System performance degradation
   └─ Delivery: Dashboard only (weekly digest)

ALERT WORKFLOW:
Operational Activity → Risk Indicators Generated → Risk Dashboard
        ↓                                              ↓
Event Store Logging                           Alert / Escalation
                                                       ↓
                                              Risk Review (Mr. Rakesh / Team)
                                                       ↓
                                              Corrective Action → Documented
```

## 17.6 Regulatory & Audit Reporting

Automated reports supporting internal and external audit:

```
AUTOMATED REPORTS:
├─ Daily Reports
│  ├─ Risk Summary Dashboard (PDF, auto-generated 07:00 AM)
│  ├─ SLA Compliance Report
│  ├─ High-Risk Case Status
│  └─ Delivery: Email to Risk Management Group
│
├─ Weekly Reports
│  ├─ Operational Risk Scorecard
│  ├─ KYC/EDD Pipeline Analysis
│  ├─ Document Verification Quality Report
│  ├─ Alert Trend Analysis
│  └─ Delivery: Email + Dashboard archive
│
├─ Monthly Reports
│  ├─ Comprehensive Risk Assessment
│  ├─ Policy Compliance Report
│  ├─ Staff Performance Metrics (risk-related)
│  ├─ Integration System Health Report
│  └─ Delivery: Email + Management presentation
│
├─ Quarterly Reports
│  ├─ QCB Regulatory Compliance Package
│  ├─ Internal Audit Review Package
│  ├─ Risk Heat Map & Trend Analysis
│  ├─ Enterprise Risk Score Summary
│  └─ Delivery: Formal distribution + archive
│
└─ Ad-Hoc Reports
   ├─ On-demand by Risk officers
   ├─ Full audit trails of any operational action
   ├─ Decision logs with supporting evidence
   ├─ Custom filters and date ranges
   └─ Export: PDF, CSV, Excel
```

## 17.7 Enterprise Risk Scoring Engine

The platform includes a sophisticated multi-dimensional risk scoring engine that calculates risk scores at three levels:

```
RISK SCORING DIMENSIONS:
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  DIMENSION 1: CUSTOMER RISK SCORE (0-240)                              │
│  ──────────────────────────────────────                                │
│  ├─ Nationality Risk (0-40)          — Based on FATF country ratings   │
│  ├─ Residency Risk (0-40)            — Non-resident premium            │
│  ├─ Occupation Risk (0-30)           — High-risk profession scoring    │
│  ├─ Income Pattern Risk (0-30)       — Inconsistency indicators       │
│  ├─ Transaction Volume Risk (0-30)   — Anomaly detection               │
│  ├─ PEP Status (0-40)               — Domestic/Foreign/Family PEP     │
│  └─ Relationship Tenure (0-30)       — New customer premium            │
│                                                                         │
│  Score ≥ 60  → Triggers EDD                                           │
│  Score ≥ 120 → Escalation to Compliance Head                          │
│  Score ≥ 180 → Board-level visibility                                 │
│                                                                         │
│  DIMENSION 2: OPERATION RISK SCORE (0-100)                             │
│  ──────────────────────────────────────────                             │
│  ├─ Process Deviation Score (0-25)   — Workflow anomalies              │
│  ├─ Document Quality Score (0-25)    — Verification failure rate       │
│  ├─ SLA Compliance Score (0-25)      — Breach frequency                │
│  └─ System Override Score (0-25)     — Manual override tracking        │
│                                                                         │
│  Score > 50  → Operational review triggered                            │
│  Score > 75  → Process improvement mandate                             │
│                                                                         │
│  DIMENSION 3: EMPLOYEE RISK SCORE (0-100)                              │
│  ──────────────────────────────────────────                             │
│  ├─ Decision Accuracy (0-25)         — Rework/reversal rate            │
│  ├─ Compliance Adherence (0-25)      — Policy violation count          │
│  ├─ Processing Speed (0-25)          — SLA adherence rate              │
│  └─ Behavioral Indicators (0-25)     — Unusual pattern detection       │
│                                                                         │
│  Score > 50  → Supervisor review of employee cases                     │
│  Score > 75  → HR notification + case audit                            │
│                                                                         │
│  AGGREGATE: ENTERPRISE RISK HEAT MAP                                   │
│  ─────────────────────────────────────                                  │
│  Combines all three dimensions into a visual heat map showing:         │
│  ├─ Risk distribution by segment (Mass / Tamayuz / Private)            │
│  ├─ Risk trend over time (improving / degrading)                       │
│  ├─ Concentration risk (geographic, industry, product)                 │
│  └─ Predictive risk indicators (ML-ready in Phase 2)                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

```
RISK SCORE CALCULATION — PROCESS FLOW:

  Customer Data     Transaction Data     Document Data     Workflow Data
       │                   │                   │                │
       ▼                   ▼                   ▼                ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │              ENTERPRISE RISK SCORING ENGINE                      │
  │                                                                  │
  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
  │  │ Customer   │  │ Operation  │  │ Employee   │                │
  │  │ Risk Calc  │  │ Risk Calc  │  │ Risk Calc  │                │
  │  │ (7 factors)│  │ (4 factors)│  │ (4 factors)│                │
  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘                │
  │        │               │               │                        │
  │        ▼               ▼               ▼                        │
  │  ┌──────────────────────────────────────────────────┐           │
  │  │         RISK AGGREGATION & CORRELATION           │           │
  │  │  Cross-dimensional analysis • Pattern detection  │           │
  │  └──────────────────────┬───────────────────────────┘           │
  │                         │                                       │
  │                         ▼                                       │
  │  ┌──────────────────────────────────────────────────┐           │
  │  │              ENTERPRISE RISK HEAT MAP            │           │
  │  │  Visual dashboard • Alerts • Trend analysis      │           │
  │  └──────────────────────────────────────────────────┘           │
  └──────────────────────────────────────────────────────────────────┘
           │              │              │
           ▼              ▼              ▼
      Dashboard       Alerts        Reports
      (Real-time)    (Automated)   (Scheduled)
```

## 17.8 Dashboard Access Control

Access to the Risk Dashboard is strictly controlled through RBAC:

```
RISK DASHBOARD RBAC:
┌───────────────────────────┬────────────────────────────────────────────┐
│ Role                      │ Access Level                               │
├───────────────────────────┼────────────────────────────────────────────┤
│ RISK_HEAD                 │ Full access — All panels, all reports,     │
│ (Mr. Rakesh)              │ configuration, alert management,          │
│                           │ approval authority for policy changes      │
├───────────────────────────┼────────────────────────────────────────────┤
│ RISK_SENIOR_OFFICER       │ Monitor + Review — All panels, reports,   │
│                           │ alert acknowledgment, no configuration    │
├───────────────────────────┼────────────────────────────────────────────┤
│ RISK_OFFICER              │ Monitor — Operational panels, standard    │
│                           │ reports, view alerts                       │
├───────────────────────────┼────────────────────────────────────────────┤
│ SENIOR_MANAGEMENT         │ Executive View — Summary risk heat map,   │
│                           │ strategic risk exposure, quarterly reports │
├───────────────────────────┼────────────────────────────────────────────┤
│ AUDITOR                   │ Audit View — Historical logs, control     │
│                           │ evidence, audit trail, read-only          │
├───────────────────────────┼────────────────────────────────────────────┤
│ All other roles           │ ❌ NO ACCESS — Risk Dashboard restricted  │
└───────────────────────────┴────────────────────────────────────────────┘

AUDIT OF DASHBOARD ACCESS:
├─ Every login to Risk Dashboard is logged
├─ Every report export is logged
├─ Every configuration change requires dual approval
├─ Session timeout: 15 minutes inactivity
└─ Access review: Monthly by Mr. Rakesh
```

---

# 18. OPERATIONAL DOCUMENTATION GOVERNANCE

## حوكمة تحديث الأدلة التشغيلية — Document Governance Framework

To ensure consistency, regulatory alignment, and operational integrity, all operational guides associated with the RRGP platform are governed through a **controlled documentation management process**.

All operational documents are maintained as **controlled documents** and remain subject to periodic review and update when required due to regulatory changes, system enhancements, or operational improvements.

## 18.1 Controlled Documents Register

```
CONTROLLED OPERATIONAL DOCUMENTS:
┌────┬────────────────────────────────────────┬───────────┬────────────────┐
│ #  │ Document                               │ Version   │ Owner          │
├────┼────────────────────────────────────────┼───────────┼────────────────┤
│ 1  │ Enterprise Architecture Document       │ 1.0       │ IT Architecture│
│ 2  │ RM Document Verification Guide         │ 1.0       │ Business Ops   │
│ 3  │ CDD Officer Operations Manual          │ 1.0       │ CDD Operations │
│ 4  │ Compliance Checklist                   │ 1.0       │ Compliance     │
│ 5  │ System Administration Guide            │ 1.0       │ IT Operations  │
│ 6  │ System Integration Guide               │ 1.0       │ IT Architecture│
│ 7  │ Deployment & Operations Guide          │ 1.0       │ DevOps         │
│ 8  │ BRD — Enterprise Features              │ 1.0       │ Business       │
│ 9  │ BRD — IT Technical Architecture        │ 1.0       │ IT             │
│ 10 │ Implementation Roadmap                 │ 1.0       │ PMO            │
└────┴────────────────────────────────────────┴───────────┴────────────────┘

Each document is tracked with:
├─ Unique document ID (DOC-RRGP-XXX)
├─ Version number (major.minor)
├─ Last review date
├─ Next scheduled review date
├─ Change history log
├─ Approving authority
└─ Distribution list
```

## 18.2 Document Update Policy

### سياسة تحديث الوثائق

The operational guides remain **continuously maintainable and updateable**, subject to the following governance controls:

```
UPDATE TRIGGERS:
├─ Regulatory change (QCB directive, AML update)
├─ System enhancement (new feature, new integration)
├─ Operational improvement (process optimization)
├─ Audit finding (control gap identified)
├─ Incident response (post-incident procedure update)
└─ Scheduled review (minimum annual review cycle)

UPDATE RULES:
├─ Any modification to operational procedures must be formally documented
├─ Proposed updates must be submitted for internal review before implementation
├─ Updated documents must be redistributed to all relevant operational teams
├─ Staff must acknowledge receipt and understanding of updated procedures
├─ Previous version archived (never deleted) for audit trail
└─ Effective date must be clearly specified
```

## 18.3 Risk Governance Approval Gate

All updates to operational procedures must be reviewed and approved by the **Risk Management Group**.

```
RISK GOVERNANCE APPROVAL:
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  The Risk Group operates under the supervision of:                  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────┐         │
│  │  MR. RAKESH — HEAD OF RISK GOVERNANCE                │         │
│  │                                                       │         │
│  │  Responsibilities:                                    │         │
│  │  • Reviewing proposed operational changes             │         │
│  │  • Ensuring alignment with internal risk policies     │         │
│  │  • Verifying regulatory compliance requirements       │         │
│  │  • Providing formal approval before adoption          │         │
│  │  • Escalating to Board Risk Committee if required     │         │
│  └───────────────────────────────────────────────────────┘         │
│                                                                     │
│  ┌───────────────────────────────────────────────────────┐         │
│  │  APPROVAL AUTHORITY MATRIX:                           │         │
│  │                                                       │         │
│  │  Minor updates (typo, formatting) → Risk Officer     │         │
│  │  Procedural changes → Risk Senior Officer             │         │
│  │  Policy changes → Mr. Rakesh (Risk Head)             │         │
│  │  Regulatory-driven changes → Mr. Rakesh + Compliance │         │
│  │  Architecture changes → Mr. Rakesh + IT Head          │         │
│  └───────────────────────────────────────────────────────┘         │
│                                                                     │
│  ⚠️  No operational document update becomes effective until         │
│     Risk Management approval is granted.                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 18.4 Document Control Workflow

```
DOCUMENT UPDATE — GOVERNANCE WORKFLOW:

┌─────────────────────────────────┐
│  1. UPDATE PROPOSED             │
│  ├─ Change initiator submits    │
│  ├─ Change description          │
│  ├─ Justification               │
│  ├─ Impact assessment           │
│  └─ Draft updated document      │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  2. INTERNAL REVIEW             │
│  ├─ Document owner reviews      │
│  ├─ Operations team feedback    │
│  ├─ Compliance team review      │
│  └─ Technical review (if IT)    │
│  SLA: 5 business days           │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  3. RISK GROUP REVIEW           │
│  ├─ Risk officer assessment     │
│  ├─ Risk policy alignment check │
│  ├─ Regulatory impact analysis  │
│  └─ Control effectiveness review│
│  SLA: 5 business days           │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  4. APPROVAL BY MR. RAKESH     │
│  ├─ Final review                │
│  ├─ Approval / Rejection        │
│  ├─ Conditions (if any)         │
│  └─ Sign-off recorded in system │
│  SLA: 3 business days           │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  5. VERSION UPDATE              │
│  ├─ Version number incremented  │
│  ├─ Change summary documented   │
│  ├─ Effective date set          │
│  ├─ Previous version archived   │
│  └─ Audit trail updated         │
└──────────────┬──────────────────┘
               ↓
┌─────────────────────────────────┐
│  6. DISTRIBUTION                │
│  ├─ Updated document published  │
│  ├─ Email notification to teams │
│  ├─ Acknowledgment required     │
│  ├─ Training session (if major) │
│  └─ Risk Dashboard updated      │
└─────────────────────────────────┘
```

## 18.5 Version Control Standards

Each operational guide maintains controlled version management:

```
VERSION CONTROL TABLE (per document):
┌─────────┬────────────┬──────────────────────┬───────────────────────┐
│ Version │ Date       │ Change Summary       │ Approved By           │
├─────────┼────────────┼──────────────────────┼───────────────────────┤
│ 1.0     │ 2026-03-10 │ Initial release      │ Mr. Rakesh            │
│ 1.1     │ [date]     │ [description]        │ [authority]           │
│ 2.0     │ [date]     │ [major revision]     │ [authority]           │
└─────────┴────────────┴──────────────────────┴───────────────────────┘

VERSION NUMBERING:
├─ Major version (X.0) → Significant procedural changes
├─ Minor version (X.Y) → Small updates, clarifications
├─ Emergency version (X.Y.Z) → Urgent regulatory-driven changes
└─ All versions retained in document management system (7 years)
```

---

# 19. CHANGE MANAGEMENT FRAMEWORK

## إطار إدارة التغيير — Enterprise Change Management

The Change Management Framework establishes the governance structure that connects **Operations, Compliance, Risk, and IT** in a unified process for managing any change to the RRGP platform — whether system-related, procedural, or regulatory.

This framework ensures that no change is introduced without proper assessment, approval, and communication across all affected stakeholders.

## 19.1 Change Categories

```
CHANGE CATEGORIES & AUTHORITY:
┌──────────────────┬───────────────────────────┬─────────────────────────────┐
│ Category         │ Examples                  │ Approval Authority          │
├──────────────────┼───────────────────────────┼─────────────────────────────┤
│ STANDARD         │ • Scheduled maintenance   │ IT Manager                  │
│ (Pre-approved)   │ • Security patches        │ (pre-approved list)         │
│                  │ • Log rotation            │                             │
├──────────────────┼───────────────────────────┼─────────────────────────────┤
│ NORMAL           │ • New feature deployment  │ Change Advisory Board (CAB) │
│ (Planned)        │ • Workflow modification   │ IT + Operations + Risk      │
│                  │ • Integration change      │                             │
│                  │ • SOP update              │                             │
├──────────────────┼───────────────────────────┼─────────────────────────────┤
│ MAJOR            │ • Architecture change     │ CAB + Mr. Rakesh (Risk)     │
│ (Significant)    │ • Database schema change  │ + IT Head + Compliance Head │
│                  │ • New external integration│                             │
│                  │ • RBAC policy change      │                             │
├──────────────────┼───────────────────────────┼─────────────────────────────┤
│ EMERGENCY        │ • Security vulnerability  │ IT Manager (immediate)      │
│ (Urgent)         │ • Critical bug fix        │ + CAB retrospective review  │
│                  │ • Regulatory mandate      │ within 48 hours             │
│                  │ • System outage fix       │                             │
└──────────────────┴───────────────────────────┴─────────────────────────────┘
```

## 19.2 Change Advisory Board (CAB)

The CAB is the governance body responsible for reviewing and approving changes to the RRGP platform:

```
CAB COMPOSITION:
┌─────────────────────────────────────────────────────────────────────────┐
│                    CHANGE ADVISORY BOARD (CAB)                          │
│                                                                         │
│  PERMANENT MEMBERS:                                                     │
│  ├─ Mr. Rakesh — Head of Risk Governance (Chair for Major changes)    │
│  ├─ IT Manager — Technical authority (Chair for Normal changes)       │
│  ├─ Compliance Head — Regulatory alignment                            │
│  ├─ Operations Manager — Operational impact assessment                │
│  └─ CDD Manager — Due diligence process owner                        │
│                                                                         │
│  INVITED AS NEEDED:                                                     │
│  ├─ Business Segment Head — If customer-facing changes                │
│  ├─ DBA — If database changes involved                                │
│  ├─ Security Officer — If security-related changes                    │
│  └─ External Vendor — If third-party integration affected             │
│                                                                         │
│  MEETING SCHEDULE:                                                      │
│  ├─ Regular CAB: Weekly (Sunday, 10:00 AM)                             │
│  ├─ Emergency CAB: On-demand (within 2 hours of request)              │
│  └─ Major Change Review: Scheduled separately (minimum 48h advance)    │
│                                                                         │
│  QUORUM: Minimum 3 permanent members (must include Risk OR Compliance) │
└─────────────────────────────────────────────────────────────────────────┘
```

## 19.3 Change Request Process

```
CHANGE REQUEST LIFECYCLE:

┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  PHASE 1: REQUEST                                                    │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ Change Initiator submits Change Request (CR):          │         │
│  │ ├─ CR ID (auto-generated: CR-RRGP-YYYY-XXXX)          │         │
│  │ ├─ Change description                                  │         │
│  │ ├─ Business justification                              │         │
│  │ ├─ Category (Standard/Normal/Major/Emergency)          │         │
│  │ ├─ Risk assessment (impact × probability)              │         │
│  │ ├─ Affected systems/documents                          │         │
│  │ ├─ Implementation plan                                 │         │
│  │ ├─ Rollback plan                                       │         │
│  │ ├─ Testing requirements                                │         │
│  │ └─ Requested implementation date                       │         │
│  └────────────────────────────────────────────────────────┘         │
│                         ↓                                            │
│  PHASE 2: ASSESSMENT                                                 │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ Technical Assessment:                                   │         │
│  │ ├─ IT team evaluates technical feasibility              │         │
│  │ ├─ Impact analysis on existing systems                  │         │
│  │ ├─ Resource requirements                                │         │
│  │ └─ Timeline estimate                                   │         │
│  │                                                         │         │
│  │ Risk Assessment:                                        │         │
│  │ ├─ Risk team evaluates operational risk impact          │         │
│  │ ├─ Compliance alignment check                           │         │
│  │ ├─ Customer impact assessment                           │         │
│  │ └─ Risk score for the change itself                     │         │
│  │                                                         │         │
│  │ Operational Assessment:                                 │         │
│  │ ├─ Operations impact on daily workflows                 │         │
│  │ ├─ Training requirements for staff                      │         │
│  │ ├─ Communication plan needed                            │         │
│  │ └─ SLA impact analysis                                  │         │
│  └────────────────────────────────────────────────────────┘         │
│                         ↓                                            │
│  PHASE 3: CAB REVIEW                                                 │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ CAB evaluates:                                          │         │
│  │ ├─ All assessment reports                               │         │
│  │ ├─ Risk-benefit analysis                                │         │
│  │ ├─ Implementation plan adequacy                         │         │
│  │ ├─ Rollback plan adequacy                               │         │
│  │ └─ Decision: APPROVED / REJECTED / DEFERRED / REWORK   │         │
│  └────────────────────────────────────────────────────────┘         │
│                         ↓                                            │
│  PHASE 4: IMPLEMENTATION                                             │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ ├─ Pre-implementation checklist verified                │         │
│  │ ├─ Backup completed                                     │         │
│  │ ├─ Change implemented per approved plan                 │         │
│  │ ├─ Testing executed                                     │         │
│  │ ├─ Verification completed                               │         │
│  │ └─ If issues → Rollback executed per plan              │         │
│  └────────────────────────────────────────────────────────┘         │
│                         ↓                                            │
│  PHASE 5: POST-IMPLEMENTATION REVIEW (PIR)                           │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ ├─ Change verified in production                        │         │
│  │ ├─ No unexpected side effects                           │         │
│  │ ├─ Documentation updated                                │         │
│  │ ├─ Stakeholders notified                                │         │
│  │ ├─ Lessons learned captured                             │         │
│  │ └─ CR status → CLOSED                                  │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## 19.4 Risk Impact Matrix for Changes

```
CHANGE RISK IMPACT MATRIX:

                        IMPACT
                Low         Medium        High         Critical
            ┌───────────┬───────────┬───────────┬───────────┐
    High    │  MEDIUM   │   HIGH    │ CRITICAL  │ CRITICAL  │
            ├───────────┼───────────┼───────────┼───────────┤
  P Medium  │   LOW     │  MEDIUM   │   HIGH    │ CRITICAL  │
  R         ├───────────┼───────────┼───────────┼───────────┤
  O Low     │   LOW     │   LOW     │  MEDIUM   │   HIGH    │
  B         ├───────────┼───────────┼───────────┼───────────┤
    V.Low   │   LOW     │   LOW     │   LOW     │  MEDIUM   │
            └───────────┴───────────┴───────────┴───────────┘

ACTION BY RISK LEVEL:
├─ LOW      → Standard approval, IT Manager sign-off
├─ MEDIUM   → CAB review required
├─ HIGH     → CAB + Mr. Rakesh approval required
└─ CRITICAL → Full CAB + Mr. Rakesh + IT Head + Compliance Head
```

## 19.5 Emergency Change Procedure

```
EMERGENCY CHANGE PROCESS (bypass normal CAB):

  ┌────────────────────────────────┐
  │  EMERGENCY DETECTED            │
  │  (Security / Outage / Regul.)  │
  └──────────────┬─────────────────┘
                 ↓
  ┌────────────────────────────────┐
  │  IT MANAGER AUTHORIZATION      │
  │  (verbal/email — documented)   │
  │  Notify: Mr. Rakesh + CAB     │
  └──────────────┬─────────────────┘
                 ↓
  ┌────────────────────────────────┐
  │  IMPLEMENT CHANGE              │
  │  ├─ Minimal scope (fix only)   │
  │  ├─ Full logging of actions    │
  │  └─ Rollback plan ready        │
  └──────────────┬─────────────────┘
                 ↓
  ┌────────────────────────────────┐
  │  RETROSPECTIVE CAB REVIEW      │
  │  (within 48 hours)             │
  │  ├─ Review emergency response  │
  │  ├─ Validate change correctness│
  │  ├─ Root cause analysis        │
  │  ├─ Preventive measures        │
  │  └─ Formal CR created post-hoc │
  └────────────────────────────────┘
```

## 19.6 Change Communication Matrix

```
WHO GETS NOTIFIED FOR EACH CHANGE TYPE:
┌─────────────────┬───────────┬──────────┬──────────┬───────────┬──────────┐
│ Stakeholder     │ Standard  │ Normal   │ Major    │ Emergency │ Timing   │
├─────────────────┼───────────┼──────────┼──────────┼───────────┼──────────┤
│ Mr. Rakesh      │ Monthly   │ Pre-CAB  │ Pre-CAB  │ Immediate │ Email/SMS│
│ (Risk Head)     │ digest    │          │          │           │          │
├─────────────────┼───────────┼──────────┼──────────┼───────────┼──────────┤
│ IT Manager      │ Notify    │ Pre-CAB  │ Pre-CAB  │ Immediate │ Email    │
├─────────────────┼───────────┼──────────┼──────────┼───────────┼──────────┤
│ Compliance Head │ —         │ Pre-CAB  │ Pre-CAB  │ Immediate │ Email    │
├─────────────────┼───────────┼──────────┼──────────┼───────────┼──────────┤
│ Operations Mgr  │ —         │ Pre-impl │ Pre-CAB  │ Post-impl │ Email    │
├─────────────────┼───────────┼──────────┼──────────┼───────────┼──────────┤
│ CDD Manager     │ —         │ Pre-impl │ Pre-impl │ Post-impl │ Email    │
├─────────────────┼───────────┼──────────┼──────────┼───────────┼──────────┤
│ End Users       │ —         │ Pre-impl │ 7 days   │ Post-impl │ System   │
│ (All staff)     │           │          │ advance  │           │ banner   │
├─────────────────┼───────────┼──────────┼──────────┼───────────┼──────────┤
│ External Audit  │ —         │ —        │ Post-impl│ Post-impl │ Report   │
└─────────────────┴───────────┴──────────┴──────────┴───────────┴──────────┘
```

## 19.7 Change Metrics & KPIs

```
CHANGE MANAGEMENT KPIs:
├─ Change Success Rate
│  ├─ Target: ≥ 95%
│  ├─ Formula: (Successful changes / Total changes) × 100
│  └─ Tracked: Monthly on Risk Dashboard
│
├─ Emergency Change Rate
│  ├─ Target: ≤ 10% of total changes
│  ├─ High rate indicates: Poor planning or system instability
│  └─ Tracked: Monthly
│
├─ Mean Time to Implement (MTTI)
│  ├─ Standard: ≤ 1 day
│  ├─ Normal: ≤ 5 business days
│  ├─ Major: ≤ 15 business days
│  └─ Emergency: ≤ 4 hours
│
├─ Rollback Rate
│  ├─ Target: ≤ 5%
│  ├─ High rate indicates: Inadequate testing
│  └─ Tracked: Monthly
│
├─ CAB Approval Cycle Time
│  ├─ Target: ≤ 3 business days for Normal
│  ├─ Target: ≤ 5 business days for Major
│  └─ Tracked: Per change request
│
└─ Post-Implementation Incidents
   ├─ Target: ≤ 2% of changes cause incidents
   ├─ Root cause analysis required for each
   └─ Tracked: Per change request
```

## 19.8 Integration with Risk Dashboard

All change management activities are reflected in the Risk Management Monitoring Dashboard (Section 17):

```
RISK DASHBOARD — CHANGE MANAGEMENT VIEW:
├─ Active Change Requests (by category and status)
├─ Upcoming Changes (next 7 days)
├─ Change Risk Heat Map
├─ Failed/Rolled-back Changes (investigation needed)
├─ Emergency Change Log
├─ Change Trend Analysis (month-over-month)
├─ CAB Decision Log
└─ Post-Implementation Review Status

This integration ensures Mr. Rakesh and the Risk Management Group
have complete visibility over all changes to the platform,
operational procedures, and compliance documentation.
```

---

# SUMMARY

## What This System Provides

```
✅ Automated KYC Processing
   ├─ Multi-section form (6 sections, 70+ fields)
   ├─ Real-time validation
   └─ Instant risk assessment

✅ Intelligent EDD Case Management
   ├─ Event-driven workflow
   ├─ 4-stage pipeline
   ├─ Smart routing (load-balanced)
   └─ SLA tracking + escalation

✅ Complete Audit Trail
   ├─ Immutable event store
   ├─ 7-year retention
   ├─ Compliance-proof
   └─ Regulatory-ready

✅ Multi-Channel Notifications
   ├─ Email, SMS, Mobile Push, Dashboard
   ├─ Real-time delivery
   ├─ Delivery tracking
   └─ Human-readable templates

✅ Enterprise-Grade Security
   ├─ RBAC with authorization matrix
   ├─ Encryption (rest + transit)
   ├─ Strong authentication (JWT + MFA)
   └─ Regular audits + penetration testing

✅ Scalability & Reliability
   ├─ Horizontal scaling
   ├─ 99.5% uptime SLA
   ├─ Automatic failover
   └─ Disaster recovery

✅ Operational Efficiency
   ├─ Automated workflows (reduce manual steps)
   ├─ Intelligent routing (minimize SLA breaches)
   ├─ Real-time dashboards (visibility)
   └─ Metrics & KPIs (data-driven decisions)
```

## Architecture Summary

```
Layer 1: Presentation (Mobile, Web, Branch Portal)
         ↓
Layer 2: API Gateway (Security, routing, logging)
         ↓
Layer 3: Application Layer (Request Handlers)
         ↓
Layer 4: Business Logic (EDD Case Engine, Workflow Router, etc)
         ↓
Layer 5: Data Access Layer (Connection pooling, transactions)
         ↓
Layer 6: Database Layer (PostgreSQL, 14 tables, immutable event store)
         ↓
Layer 7: External Integrations (T24, CRP, DMS, Call Center, etc)

All layers connected by:
├─ Event-driven architecture (event store as source of truth)
├─ State machine (workflow validation)
├─ RBAC (authorization at every layer)
├─ Audit logging (immutable trail)
└─ Error handling (graceful degradation)
```

---

## Next Steps

1. **Presentation**: This document to Architecture/IT Committee
2. **Review & Approval**: Get stakeholder sign-off on:
   - Architecture approach
   - Security model
   - Integration points
   - SLA targets
3. **Implementation**: Phase the deployment:
   - Phase 1: Database setup + backend modules
   - Phase 2: Frontend integration + testing
   - Phase 3: External integrations (T24, CRP, DMS)
   - Phase 4: Pilot with 10 customers
   - Phase 5: Full production rollout
4. **Operations**: Prepare for go-live:
   - Staff training
   - Monitoring setup
   - Incident response procedures
   - Documentation finalization

---

**Document Status:** ✅ COMPLETE & READY FOR ARCHITECTURE COMMITTEE REVIEW

**Version:** 1.0  
**Date:** March 2026  
**Prepared By:** Enterprise Architecture Team  
**Review Status:** Ready for Stakeholder Sign-Off

