# EDD Digital Workflow — Business Requirements Document
## Qatar Islamic Bank (QIB)
### BRD Version 1.0 | March 2026

---

**Document Classification:** Internal — QIB Confidential  
**Prepared By:** Retail Banking Operations  
**Review Status:** Submitted for Stakeholder Review  
**Target Systems:** FLOW Workflow Platform  
**Document ID:** BRD-EDD-2026-001

---

## 📑 TABLE OF CONTENTS

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [System Overview](#3-system-overview)
4. [Business Problem & Justification](#4-business-problem--justification)
5. [Process Flow](#5-process-flow)
6. [Stakeholders & Department Responsibilities](#6-stakeholders--department-responsibilities)
7. [Workflow Stages & SLA](#7-workflow-stages--sla)
8. [Maker / Checker Controls](#8-maker--checker-controls)
9. [Decision Support System Philosophy](#9-decision-support-system-philosophy)
10. [Flow System Integration](#10-flow-system-integration)
11. [Re-KYC Alignment](#11-re-kyc-alignment)
12. [Operational Documentation](#12-operational-documentation)
13. [Risk Governance & Dashboard](#13-risk-governance--dashboard)
14. [Data Sources & Integration Points](#14-data-sources--integration-points)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [Approval & Sign-Off](#16-approval--sign-off)

---

# 1. PURPOSE

## 1.1 Document Purpose

This Business Requirements Document defines the requirements for implementing a **digital EDD (Enhanced Due Diligence) workflow** within Qatar Islamic Bank's existing **FLOW Workflow Platform**.

The system will digitize, standardize, and automate the end-to-end EDD process from trigger to final decision, ensuring regulatory compliance, operational efficiency, and complete audit trail.

## 1.2 Objectives

| # | Objective | Measurable Target | Regulatory Reference |
|---|-----------|-------------------|----------------------|
| 1 | Digitize end-to-end EDD process | 100% paperless workflow | FATF Rec 10, 11 — CDD & Record Keeping |
| 2 | Standardize case routing across segments | Automated routing to correct department | BCBS 239 — Risk Data Aggregation |
| 3 | Enforce Maker/Checker controls | Zero unauthorized decisions | COBIT 2019 DSS05.04 — Access Control |
| 4 | Reduce case processing time | < 72 hours (from current 5-7 days) | QCB Circular No. 71/2022 — CDD Timeliness |
| 5 | Achieve full audit trail | 100% action traceability | ISO 27001:2022 A.8.15 — Logging |
| 6 | Ensure regulatory compliance | QCB, AML/CTF, FATF compliant | FATF Rec 20, QCB AML/CFT Framework |
| 7 | Integrate with existing infrastructure | FLOW platform, T24, DMS | ISO 27001:2022 A.8.26 — App Security |

## 1.3 Regulatory Framework Alignment

This system is designed to comply with the following international and national regulatory frameworks:

| Framework | Standard | Applicability |
|-----------|----------|---------------|
| **FATF Recommendation 10** | Customer Due Diligence | All CDD/EDD data collection, verification, and ongoing monitoring |
| **FATF Recommendation 11** | Record Keeping | All audit trail, data retention (7 years), and document archival |
| **FATF Recommendation 12** | Politically Exposed Persons | PEP identification, enhanced due diligence, senior management approval |
| **FATF Recommendation 20** | Suspicious Transaction Reporting | Financial threshold monitoring, STR triggers, transaction analysis |
| **FATF Recommendation 22** | DNFBPs — Customer Due Diligence | Extended CDD for designated non-financial businesses |
| **Basel Committee BCBS 239** | Principles for Risk Data Aggregation | Risk data quality, completeness, timeliness, and accuracy |
| **ISO 27001:2022** | Information Security Management | Access control, logging, encryption, incident response |
| **ISO 27001:2022 A.5.1** | Information Security Policies | Policy-driven security governance |
| **ISO 27001:2022 A.8.15** | Logging and Monitoring | Tamper-resistant audit trail, hash-chain integrity |
| **ISO 27001:2022 A.8.24** | Cryptography | AES-256 encryption, TLS 1.3, key management |
| **COBIT 2019 DSS05** | Manage Security Services | Identity management, access control, audit logging |
| **COBIT 2019 APO13** | Manage Security | Information security management system alignment |
| **QCB AML/CFT Regulatory Framework** | National Compliance | All CDD/EDD processes, STR reporting, sanctions screening |
| **QCB Circular No. 71/2022** | CDD Timeliness Requirements | SLA enforcement, case processing timelines |
| **Qatar Law No. 20 of 2019** | Anti-Money Laundering | AML/CTF obligations, customer identification, beneficial ownership |

### Regulatory Compliance Matrix

```
CONTROL CATEGORY                  FRAMEWORK REFERENCE          SYSTEM IMPLEMENTATION
──────────────────────────────────────────────────────────────────────────────────────
Customer Identification           FATF Rec 10, QCB AML         EDD Form Sections 1-2
Source of Funds/Wealth            FATF Rec 10, 20              EDD Form Section 4
PEP Screening                    FATF Rec 12                   EDD Form Section 9
Transaction Monitoring            FATF Rec 20                   Section 6 + Risk Engine
Record Keeping (7yr)             FATF Rec 11, ISO A.8.15       Audit Trail + DMS
Maker/Checker Controls           COBIT DSS05.04                Sections 8, 11
Access Control (RBAC)            ISO 27001 A.5.15              Login + Role System
Data Encryption                  ISO 27001 A.8.24              AES-256 / TLS 1.3
Risk Data Aggregation            BCBS 239                      Risk Engine + SnapView
Escalation Governance            QCB AML Framework             5% Threshold Monitoring
Suspicious Transaction           FATF Rec 20, QCB              Financial Threshold Alerts
Ongoing Monitoring               FATF Rec 10, 11               Re-KYC + Annual Review
```

---

# 2. SCOPE

## 2.1 In Scope

```
✅ EDD case creation (triggered by T24 CRP or manual referral)
✅ Multi-department workflow (Business → CDD → Compliance → Decision)
✅ Maker/Checker approval at CDD and Compliance stages
✅ Document collection, verification, and discrepancy tracking
✅ Source of funds and business relationship assessment
✅ PEP/Sanctions/AML screening support
✅ Account restriction management
✅ T24 writeback (status, decision, restrictions)
✅ SLA tracking and auto-escalation
✅ Notification engine (email, SMS, mobile push)
✅ Real-time dashboard and reporting
✅ Full immutable audit trail
✅ Segment routing: Mass, Tamayuz, Private Banking
✅ Role-based access control (RBAC)
```

## 2.2 Out of Scope

```
❌ Automated risk scoring (system assists, human decides)
❌ Machine learning/AI classification
❌ Biometric verification
❌ Real-time transaction monitoring (separate system)
❌ Video KYC
❌ Blockchain audit trail
```

## 2.3 Assumptions

```
• FLOW Workflow Platform is available and operational
• T24 Core Banking integration via ESB is established
• DMS is accessible for document storage/retrieval
• SnapView/Snapshot reporting is available for financial analytics
• QCB KYC API access is provisioned
• Email/SMS notification infrastructure is operational
• All departments have been briefed on the new process
```

---

# 3. SYSTEM OVERVIEW

## 3.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        QIB ENTERPRISE ARCHITECTURE                   │
│                                                                      │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│    │   T24    │  │ SnapView │  │ QCB KYC  │  │   DMS    │          │
│    │Core Bank │  │ Reports  │  │   API    │  │Documents │          │
│    └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│         └──────────────┴──────┬─────┴──────────────┘                │
│                               │                                      │
│                    ┌──────────▼──────────┐                           │
│                    │ ESB Integration Layer│                           │
│                    └──────────┬──────────┘                           │
│                               │                                      │
│     ┌─────────────────────────▼─────────────────────────────┐       │
│     │              FLOW WORKFLOW PLATFORM                    │       │
│     │    ┌──────────────────────────────────────────┐       │       │
│     │    │     EDD CASE MANAGEMENT WORKFLOW          │       │       │
│     │    │  ┌────────┐ ┌────────┐ ┌────────┐       │       │       │
│     │    │  │Business│ │  CDD   │ │Complian│       │       │       │
│     │    │  │ Review │→│ Review │→│  ce    │       │       │       │
│     │    │  └────────┘ └────────┘ └────────┘       │       │       │
│     │    └──────────────────────────────────────────┘       │       │
│     └───────────────────────────────────────────────────────┘       │
│                               │                                      │
│         ┌─────────────────────┼─────────────────────┐               │
│         │                     │                     │               │
│    ┌────▼────┐          ┌─────▼─────┐         ┌────▼────┐          │
│    │Email/SMS│          │ Audit Log │         │Dashboard│          │
│    │  Notif  │          │  System   │         │Reporting│          │
│    └─────────┘          └───────────┘         └─────────┘          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## 3.2 System Philosophy — Decision Support, Not Automation

> **CRITICAL PRINCIPLE:**
> The EDD system is a **Decision Support System (DSS)**, NOT a Decision Engine.
> The system collects data, presents indicators, and highlights anomalies.
> **The final assessment and decision remain the responsibility of the assigned employee and authorized bank personnel.**

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   SYSTEM     │   →    │   EMPLOYEE   │   →    │   DECISION   │
│   ASSISTS    │        │   ANALYZES   │        │   (HUMAN)    │
└──────────────┘        └──────────────┘        └──────────────┘

• Collects Data          • Reviews Indicators    • Final Assessment
• Presents Indicators    • Applies Judgment      • Accountability
• Highlights Anomalies   • Documents Findings    • Digital Signature
```

This design ensures:
- No automated risk scoring → Avoids Model Risk
- Human-in-the-loop → Regulatory compliance
- Full audit trail of human decisions → Accountability

---

# 4. BUSINESS PROBLEM & JUSTIFICATION

## 4.1 Current State

```
CURRENT EDD PROCESS — PAIN POINTS:

❌ Manual, paper-based process
❌ No standardized workflow across segments
❌ Unclear handoff between departments
❌ No SLA tracking
❌ Incomplete audit trail
❌ Inconsistent document verification
❌ No real-time visibility of case status
❌ Manual reporting to QCB
❌ No Maker/Checker enforcement
❌ Duplicate effort between Re-KYC and EDD
```

## 4.2 Future State

```
PROPOSED EDD WORKFLOW — BENEFITS:

✅ 100% digital, paperless workflow
✅ Standardized process across all segments
✅ Clear department responsibilities and handoffs
✅ Automated SLA tracking with auto-escalation
✅ Complete, immutable audit trail
✅ Structured document verification checklist
✅ Real-time dashboard and queue visibility
✅ Automated QCB regulatory reporting
✅ Enforced Maker/Checker at CDD and Compliance
✅ Aligned with Re-KYC — no duplication
```

## 4.3 Business Impact

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Case Processing Time | 5-7 days | < 72 hours | 60% faster |
| SLA Compliance | ~60% | > 98% | +38% |
| Audit Trail Coverage | Partial | 100% | Complete |
| Manual Handoff Errors | Frequent | Zero | Eliminated |
| Regulatory Reporting | Manual | Automated | Same-day |
| Staff Utilization | Low | +25% | Automated routing |

---

# 5. PROCESS FLOW

## 5.1 End-to-End Workflow

```
                    ┌────────────────────────┐
                    │    EDD TRIGGER          │
                    │ T24 CRP / Management / │
                    │ Periodic Due Date      │
                    └───────────┬────────────┘
                                │
                                ▼
               ┌────────────────────────────────┐
               │  CASE CREATION (Automatic)     │
               │  • Generate Case ID            │
               │  • Fetch customer data (T24)   │
               │  • Route to segment queue      │
               │  • Notify RM / Business Team   │
               └────────────────┬───────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────┐
        │     STAGE 1: BUSINESS REVIEW               │
        │     (Mass / Tamayuz / Private)             │
        │                                            │
        │  RM / Branch Officer:                      │
        │  • Collect documents from customer         │
        │  • Verify documents against DMS            │
        │  • Identify discrepancies                  │
        │  • Add verification notes                  │
        │                                            │
        │  Business Analyst:                         │
        │  • Review RM notes                         │
        │  • Make recommendation: MAINTAIN or EXIT   │
        │  • Route to CDD                           │
        │                                            │
        │  SLA: 24h (Mass) / 12h (Tamayuz) / 18h   │
        └──────────────────┬────────────────────────┘
                           │
                           ▼
        ┌───────────────────────────────────────────┐
        │     STAGE 2: CDD REVIEW                    │
        │     (Enhanced Due Diligence)               │
        │                                            │
        │  CDD Maker:                                │
        │  • Source of funds verification            │
        │  • Business relationship assessment        │
        │  • Transaction pattern analysis            │
        │  • PEP/Sanctions initial screening         │
        │  • Document deep-dive (if flagged)         │
        │  • Prepare CDD Report                      │
        │                                            │
        │  CDD Checker:                              │
        │  • Review Maker findings                   │
        │  • Validate documentation                  │
        │  • Approve or request rework               │
        │  • CDD sign-off                           │
        │                                            │
        │  SLA: 24h (standard) / 48h (deep-dive)    │
        └──────────────────┬────────────────────────┘
                           │
                           ▼
        ┌───────────────────────────────────────────┐
        │     STAGE 3: COMPLIANCE REVIEW             │
        │     (Final Regulatory Authority)           │
        │                                            │
        │  Compliance Officer (Maker):               │
        │  • PEP screening (4+ databases)            │
        │  • Sanctions screening (6 lists)           │
        │  • AML/CTF assessment                      │
        │  • FATCA/CRS review                        │
        │  • Document regulatory review              │
        │                                            │
        │  Compliance Manager (Checker):             │
        │  • Review officer findings                 │
        │  • Validate regulatory decisions           │
        │  • Approve or escalate                     │
        │                                            │
        │  SLA: 24 hours                             │
        └──────────────────┬────────────────────────┘
                           │
                           ▼
        ┌───────────────────────────────────────────┐
        │     STAGE 4: FINAL DECISION                │
        │                                            │
        │  Decision Options:                         │
        │  ✅ APPROVED — Account eligible            │
        │  ⚠️ APPROVED WITH CONDITIONS               │
        │     (Enhanced monitoring / restrictions)   │
        │  ❌ REJECTED — Customer not eligible       │
        │  ⬆️ ESCALATE — Board review needed         │
        │                                            │
        │  T24 Writeback:                            │
        │  • EDD status updated                      │
        │  • Decision recorded                       │
        │  • Account restrictions applied            │
        │  • Next EDD due date set                   │
        │                                            │
        │  SLA: 8 hours                              │
        └───────────────────────────────────────────┘
```

## 5.2 EDD Triggers

| Trigger | Source | Description |
|---------|--------|-------------|
| T24 CRP High Risk | T24 Core Banking | Customer risk profile classified as High Risk |
| Management Referral | Manual | Management identifies customer for EDD review |
| Periodic Due Date | System | Scheduled EDD review cycle reached |
| AML Alert | AML System | Transaction monitoring alert triggers EDD |
| PEP Identification | Screening System | New PEP classification detected |
| Re-KYC Finding | Re-KYC Process | Re-KYC review identifies need for EDD |

---

# 6. STAKEHOLDERS & DEPARTMENT RESPONSIBILITIES

## 6.1 Department Responsibility Matrix

| Department | Role in EDD Process | Key Responsibilities |
|------------|--------------------|-----------------------|
| **Business Teams** (Mass / Tamayuz / Private) | Customer interaction and document collection | Collect KYC documents, verify against DMS, identify discrepancies, make initial recommendation |
| **CDD Operations** | Due diligence review and KYC analysis | Source of funds verification, business relationship assessment, transaction analysis, CDD report preparation |
| **Compliance** | Regulatory compliance and final authority | PEP/Sanctions screening, AML/CTF assessment, regulatory decision, QCB reporting |
| **Risk Management** | Governance, oversight, and dashboard monitoring | Monitor risk indicators, review operational procedures, approve policy changes, enterprise risk scoring |
| **Strategy & PMO** | Strategic alignment and project governance | Align with bank strategy, project milestone tracking, stakeholder coordination |
| **Marketing & Communications** | Customer communication management | Customer notification texts, communication templates, customer experience alignment |
| **IT** | Technical implementation and support | FLOW system configuration, integration maintenance, system monitoring, technical support |

## 6.2 Segment Routing

```
CASE ROUTING BY CUSTOMER SEGMENT:

MASS BANKING:
├─ Queue: Mass EDD Queue
├─ SLA: 24 hours per stage
├─ Team: Mass Banking Officers
└─ Escalation: Mass Banking Manager → CDD Manager

TAMAYUZ (PRIORITY):
├─ Queue: Tamayuz Priority Queue
├─ SLA: 12 hours per stage
├─ Team: Tamayuz Relationship Managers
└─ Escalation: Tamayuz Head → CDD Manager

PRIVATE BANKING:
├─ Queue: Private Banking Queue
├─ SLA: 18 hours per stage
├─ Team: Private Banking RMs
└─ Escalation: Private Banking Head → CDD Manager → Compliance Head
```

---

# 7. WORKFLOW STAGES & SLA

## 7.1 SLA Requirements

| Stage | Standard SLA | Tamayuz SLA | Escalation Trigger | Auto-Escalation |
|-------|-------------|-------------|-----------------------|-----------------|
| Business Review | 24 hours | 12 hours | 75% of SLA elapsed | Manager notified |
| CDD Review | 24 hours | 24 hours | 75% of SLA elapsed | CDD Manager notified |
| CDD Deep-Dive | 48 hours | 48 hours | 75% of SLA elapsed | CDD Manager notified |
| Compliance Review | 24 hours | 24 hours | 50% of SLA elapsed | Compliance Head notified |
| Final Decision | 8 hours | 4 hours | 50% of SLA elapsed | Director notified |
| Customer Response | 7 days | 7 days | Day 5 reminder | Auto-close day 7 |

## 7.2 End-to-End Target

```
STANDARD CASE:
Business (24h) + CDD (24h) + Compliance (24h) + Decision (8h) = ~80 hours ≈ 3.3 days

PRIORITY CASE:
Business (12h) + CDD (24h) + Compliance (24h) + Decision (4h) = ~64 hours ≈ 2.7 days

TARGET: < 72 hours for standard cases
```

---

# 8. MAKER / CHECKER CONTROLS

## 8.1 Four-Eyes Principle

```
MAKER/CHECKER ENFORCEMENT:

CDD STAGE:
├─ CDD Maker: Prepares CDD documentation and findings
├─ CDD Checker: Reviews, validates, approves or returns for rework
├─ Rule: Maker ≠ Checker (segregation of duties)
├─ Maximum rework cycles: 3
└─ All actions logged in audit trail

COMPLIANCE STAGE:
├─ Compliance Officer (Maker): Performs regulatory screening
├─ Compliance Manager (Checker): Validates regulatory decisions
├─ Rule: Officer ≠ Manager (segregation of duties)
├─ Compliance Head: Escalation for high-risk cases
└─ All actions logged in audit trail

COMPLIANCE AUTHORITY MATRIX:
├─ Low/Medium Risk → Compliance Officer can approve
├─ High Risk → Compliance Manager must approve
├─ PEP / Sanctions → Compliance Head must approve
└─ Strategic Risk → Board Risk Committee review
```

---

# 9. DECISION SUPPORT SYSTEM PHILOSOPHY

## 9.1 What the System Does

| Function | Description |
|----------|-------------|
| Data Collection | Aggregates customer data from T24, SnapView, QCB KYC API |
| Indicator Display | Presents behavioral and financial indicators |
| Anomaly Highlighting | Flags inconsistencies for employee review |
| Workflow Management | Routes cases through Maker/Checker approval |
| Audit Trail | Records all actions and decisions |

## 9.2 What the System Does NOT Do

| Restriction | Reason |
|-------------|--------|
| ❌ Generate automated risk scores | Avoids Model Risk, regulatory challenges |
| ❌ Classify customers automatically | Decision must be human judgment |
| ❌ Make approval/rejection decisions | Accountability must remain with employee |
| ❌ Override employee assessment | Human-in-the-loop principle |

## 9.3 Behaviour Indicators Displayed

| Indicator | Example | Employee Action |
|-----------|---------|-----------------|
| Income Mismatch | Actual salary differs from declared | Review and assess |
| Activity Exceeds Expected | Transaction volume above profile | Investigate source |
| AML Positive | AML screening returned positive | Verify and document |
| PEP Status | Customer identified as PEP | Apply enhanced procedures |
| Dormant Reactivation | Dormant account with sudden activity | Verify legitimacy |
| Salary Gap | No salary credit for 90+ days | Confirm employment |

---

# 10. FLOW SYSTEM INTEGRATION

## 10.1 Platform Statement

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  The EDD digital workflow will be implemented using the existing      │
│  FLOW Workflow Platform already deployed within QIB.                  │
│                                                                       │
│  ✅ No new platform will be introduced                               │
│  ✅ No additional infrastructure procurement required                │
│  ✅ Utilizes existing ESB integration layer                          │
│  ✅ Leverages existing T24 connectivity                              │
│  ✅ Compatible with current DMS document management                  │
│                                                                       │
│  This approach minimizes:                                            │
│  • Implementation cost (no new platform licensing)                   │
│  • Integration complexity (existing connections reused)              │
│  • Training requirements (staff familiar with FLOW)                  │
│  • IT overhead (single platform to maintain)                         │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## 10.2 Integration Points

| System | Purpose | Integration | Direction |
|--------|---------|-------------|-----------|
| T24 Core Banking | Customer data, risk class, writeback | ESB/API | Bidirectional |
| SnapView | Financial analytics, income, transactions | ETL/API | Read-Only |
| QCB KYC API | Regulatory documents, verification | REST API | Read-Only |
| DMS | Document storage and retrieval | REST API | Bidirectional |
| Email Server | Staff notifications | SMTP | Write-Only |
| Mobile Banking | Customer push notifications | REST API | Write-Only |

---

# 11. RE-KYC ALIGNMENT

## 11.1 Process Distinction

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  RE-KYC and EDD are COMPLEMENTARY processes, not duplicates.         │
│                                                                       │
│  ┌────────────────────────┐    ┌────────────────────────┐            │
│  │      RE-KYC            │    │        EDD              │            │
│  │                        │    │                         │            │
│  │ • Periodic customer    │    │ • Triggered for high-  │            │
│  │   information update   │    │   risk cases or        │            │
│  │ • All customers        │    │   discrepancies        │            │
│  │ • Scheduled cycle      │    │ • Selected customers   │            │
│  │ • Standard review      │    │ • Event-driven         │            │
│  │ • Update KYC records   │    │ • Enhanced review      │            │
│  │                        │    │ • Detailed assessment   │            │
│  └────────────────────────┘    └────────────────────────┘            │
│                                                                       │
│  INTERACTION:                                                        │
│  • Re-KYC finding may TRIGGER EDD review                            │
│  • EDD completion UPDATES Re-KYC records                            │
│  • Both share the same T24 customer profile                         │
│  • No duplicate data collection                                      │
│  • Single source of truth for document verification                  │
│                                                                       │
│  GOAL: Avoid process duplication while ensuring comprehensive        │
│  customer due diligence coverage.                                    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

# 12. OPERATIONAL DOCUMENTATION

## 12.1 Operational Guides

The following operational guides have been developed to support day-to-day operations:

| # | Document | Purpose | Audience |
|---|----------|---------|----------|
| 1 | RM Document Verification Guide | Step-by-step document verification procedures | RMs, Branch Officers |
| 2 | CDD Officer Operations Manual | CDD due diligence procedures and report preparation | CDD Officers |
| 3 | Compliance Review Checklist | PEP/Sanctions/AML screening checklist | Compliance Officers |
| 4 | System Administration Guide | IT system maintenance and monitoring | IT Administrators |

## 12.2 Documentation Governance

All operational documents are **controlled documents** governed by the Risk Management Group under Mr. Rakesh (Head of Risk Governance).

```
DOCUMENT UPDATE PROCESS:
  Update Proposed → Internal Review → Risk Group Review →
  Approval by Mr. Rakesh → Version Update → Distribution to Teams

RULES:
• No document update is effective until Risk Management approval is granted
• All versions are archived (never deleted) for audit trail
• Staff must acknowledge receipt of updated procedures
• Minimum annual review cycle for all documents
```

---

# 13. RISK GOVERNANCE & DASHBOARD

## 13.1 Risk Monitoring Dashboard

The platform includes a dedicated **Risk Management Monitoring Dashboard** accessible to the Risk Management Group under Mr. Rakesh.

```
DASHBOARD CAPABILITIES:
├─ Operational Risk Monitoring
│  ├─ High-risk customer onboarding cases
│  ├─ Escalated EDD cases
│  ├─ Suspicious transaction indicators
│  └─ Failed document verification attempts
│
├─ KYC/EDD Status Monitoring
│  ├─ Expired KYC tracking
│  ├─ Pending EDD reviews
│  ├─ Under-investigation accounts
│  └─ Restricted accounts
│
├─ Policy & Procedure Change Tracking
│  ├─ SOP updates pending approval
│  ├─ Operational guideline changes
│  └─ Compliance checklist modifications
│
├─ Risk Alerts & Notifications
│  ├─ Unusual operational activity
│  ├─ Repeated document mismatches
│  ├─ High transaction anomalies
│  └─ System control overrides
│
└─ Regulatory & Audit Reporting
   ├─ Internal audit reports
   ├─ Compliance reporting
   ├─ QCB regulatory reports
   └─ Full audit trails
```

## 13.2 Enterprise Risk Scoring Engine

Three-dimensional risk scoring:
- **Customer Risk Score (0-240)** — 7 factors including nationality, PEP, transaction patterns
- **Operation Risk Score (0-100)** — Process deviation, document quality, SLA compliance
- **Employee Risk Score (0-100)** — Decision accuracy, compliance adherence

All scores feed into an **Enterprise Risk Heat Map** on the dashboard for real-time visualization.

---

# 14. DATA SOURCES & INTEGRATION POINTS

## 14.1 Data Sources

| Source | Data Provided | Integration |
|--------|--------------|-------------|
| T24 Core Banking | Customer master data, accounts, risk classification, KYC dates | ESB/API (Bidirectional) |
| SnapView/Snapshot | Salary data, income analysis, transaction patterns, balance history | ETL/API (Read-Only) |
| QCB KYC API | Passport verification, ID card, certificates, address proof | REST API (Read-Only) |
| DMS | Document storage, retrieval, version management | REST API (Bidirectional) |
| Risk Dataset | AML screening results, PEP lists, sanctions data | Internal DB (Read-Only) |

## 14.2 T24 Writeback

Upon case completion, the following fields are updated in T24:

| Field | Description |
|-------|-------------|
| EDD Status | Current EDD status (Completed/Pending/Expired) |
| EDD Completion Date | Date of final decision |
| EDD Decision | Approved / Approved with Conditions / Rejected |
| Next EDD Due Date | Next scheduled EDD review |
| Account Restriction | If any restrictions applied |

---

# 15. NON-FUNCTIONAL REQUIREMENTS

| Requirement | Target | Regulatory Reference |
|-------------|--------|----------------------|
| System Availability | 99.5% uptime | ISO 27001:2022 A.8.14 — Redundancy |
| API Response Time | < 2 seconds | BCBS 239 — Timeliness Principle |
| Peak Throughput | 100 cases/hour | QCB AML — Operational Capacity |
| Audit Retention | 7 years | FATF Rec 11, Qatar Law No. 20/2019 |
| Data Encryption | AES-256 at rest, TLS 1.3 in transit | ISO 27001:2022 A.8.24 |
| Authentication | JWT + Multi-Factor Authentication | ISO 27001:2022 A.8.5 |
| Backup | Hourly incremental, daily full | ISO 27001:2022 A.8.13 |
| Recovery Time | RTO: 1 hour, RPO: 1 hour | ISO 27001:2022 A.8.14 |
| Access Control | RBAC with 7 role definitions | COBIT 2019 DSS05.04 |
| Audit Integrity | Hash-chain tamper-resistant logging | ISO 27001:2022 A.8.15, FATF Rec 11 |
| Escalation Threshold | ≤ 5% of cases should escalate | QCB AML/CFT Monitoring Framework |
| Form Validation | Enterprise field validation engine | FATF Rec 10, BCBS 239 |
| Session Security | Auto-timeout, concurrent session prevention | ISO 27001:2022 A.8.5 |

---

# 16. APPROVAL & SIGN-OFF

## 16.1 Document Approval

This BRD requires review and approval from the following stakeholders before implementation can proceed:

```
┌──────────────────────────────────────────────────────────────────────┐
│                    APPROVAL & SIGN-OFF SECTION                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  STAKEHOLDER               │ SIGNATURE      │ DATE                  │
│  ─────────────────────────────────────────────────────────────       │
│                                                                      │
│  Business Head             │ ______________ │ ___/___/______        │
│  (Retail Banking)          │                │                       │
│                                                                      │
│  CDD Operations Manager   │ ______________ │ ___/___/______        │
│                                                                      │
│  Compliance Head           │ ______________ │ ___/___/______        │
│                                                                      │
│  Risk Management Head      │ ______________ │ ___/___/______        │
│  (Mr. Rakesh)              │                │                       │
│                                                                      │
│  IT Head                   │ ______________ │ ___/___/______        │
│                                                                      │
│  Strategy & PMO            │ ______________ │ ___/___/______        │
│                                                                      │
│  Marketing & Communications│ ______________ │ ___/___/______        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

# APPENDIX A: EDD FORM — COMPLETE FIELD SPECIFICATION (11 Sections)

This appendix maps every field in the EDD Investigation Form to its source system, data type, and validation rules. The form contains **11 sections**, **4 Tabs**, and follows a **Maker/Checker** approval workflow.

---

## Form Tabs

| Tab | Purpose |
|-----|---------|
| EDD Form | Main investigation form (11 sections below) |
| Documents | Uploaded/retrieved documents (DMS integration) |
| Comments & History | Case comments, audit trail, timeline |
| Approval | Maker/Checker approval workflow |

---

## Section 1: Risk Classification of the Client

| # | Field | Type | Required | Source | Values |
|---|-------|------|----------|--------|--------|
| 1.1 | Client involved in increased risk business | Radio (Yes/No) | YES | T24/CRP | Yes, No |
| 1.2 | Self-employed from sanctioned/high-risk country | Radio (Yes/No) | YES | Manual | Yes, No |
| 1.3 | Non-Resident Status | Radio (Yes/No) | YES | T24 | Yes, No |
| 1.4 | Private Banking Sector | Radio (Yes/No) | YES | T24 | Yes, No |
| 1.5 | Politically Exposed Person (PEP) | Radio (Yes/No) | YES | T24/CRP | Yes, No |
| 1.6 | Overall Risk Classification | Dropdown (Read-only) | YES | T24/CRP | High, Medium, Low |

**Business Logic:** If any of 1.1–1.5 = Yes → Overall Risk Classification auto-set to HIGH.

---

## Section 2: Customer Information

| # | Field | Type | Required | Source | Sample |
|---|-------|------|----------|--------|--------|
| 2.1 | Customer Name | Text (Read-only) | YES | T24 | Abdullah Mohammed Al-Kuwari |
| 2.2 | RIM Number | Text (Read-only) | YES | T24 | RIM001234 |
| 2.3 | Nationality | Text (Read-only) | YES | QCB KYC API | Qatari |
| 2.4 | Date of Birth | Date (Read-only) | YES | T24 | 1975-03-15 |
| 2.5 | Form being filed for | Dropdown | YES | Manual | Customer, Joint Account Holder, Guardian, POA |
| 2.6 | How was client acquired | Dropdown | YES | Manual | Referral, Walk-in, Online, Corporate Introduction |
| 2.7 | Referral Details | Text | Conditional | Manual | — |
| 2.8 | If referred, specify by whom | Text | Conditional | Manual | — |

---

## Section 3: Purpose and Intended Use of Account

| # | Field | Type | Required | Source |
|---|-------|------|----------|--------|
| 3.1 | Purpose of Account | Dropdown | YES | Manual |
| 3.2 | Account used for business activities | Radio (Yes/No) | YES | Manual |
| 3.3 | Expected Banking Products & Services | Checkbox (Multi) | YES | Manual |

**Products Checklist:**
- [ ] Current Account
- [ ] Savings Account
- [ ] Credit Card
- [ ] Personal Finance
- [ ] Investment Services
- [ ] Trade Finance
- [ ] Private Banking

---

## Section 4: Source of Income & Source of Wealth

### 4A — Salary / Employment Income

| # | Field | Type | Required | Source |
|---|-------|------|----------|--------|
| 4A.1 | Designation | Text | YES | T24 |
| 4A.2 | Name of Employer | Text | YES | T24 |
| 4A.3 | Employer Address | Text | NO | Manual |
| 4A.4 | Years in Employment | Number | NO | Manual |
| 4A.5 | Expected Monthly Income (QAR) | Currency | YES | Manual |
| 4A.6 | Salary Transferred to QIB | Radio (Yes/No) | NO | T24 |

### 4A — Business / Self-Employment Income

| # | Field | Type | Required | Source |
|---|-------|------|----------|--------|
| 4A.7 | Business Name | Text | Conditional | Manual |
| 4A.8 | Line of Business Activity | Text | Conditional | Manual |
| 4A.9 | % Ownership | Percentage | Conditional | Manual |
| 4A.10 | Years in Business | Number | Conditional | Manual |
| 4A.11 | Annual Profit (QAR) | Currency | Conditional | Manual |
| 4A.12 | Company Account with QIB | Radio (Yes/No) | Conditional | T24 |

### 4B — Source of Wealth

| # | Field | Type | Required | Source |
|---|-------|------|----------|--------|
| 4B.1 | Source of Wealth Categories | Checkbox (Multi) | YES | Manual |
| 4B.2 | Detailed Explanation of Source of Wealth | Textarea | YES | Manual |

**Wealth Categories:**
- [ ] Salary Earnings
- [ ] Business Earnings
- [ ] Gift / Inheritance
- [ ] Investment Income
- [ ] Sale of Business
- [ ] Sale of Property
- [ ] Others

### 4C — Estimated Net Worth

| # | Field | Type | Required | Source |
|---|-------|------|----------|--------|
| 4C.1 | Estimated Net Worth Range | Dropdown | YES | Manual |

**Ranges:** < QAR 250K, 250K–500K, 500K–1M, 1M–3M, 3M–5M, > QAR 5M

---

## Section 5: Initial Deposit

| # | Field | Type | Required | Source |
|---|-------|------|----------|--------|
| 5.1 | Initial Deposit Amount (QAR) | Currency | YES | Manual |
| 5.2 | Expected Eventual Balance (QAR) | Currency | NO | Manual |
| 5.3 | Mode of Initial Deposit | Dropdown | YES | Manual |
| 5.4 | Source of Funds for Initial Deposit | Text | YES | Manual |

**Deposit Modes:** Cash, Cheque, Bank Transfer, Other

---

## Section 6: Monthly Anticipated Transaction Activity

### Transaction Table

| Transaction Type | No. of Transactions | Total Value (QAR) | Purpose |
|-----------------|--------------------|--------------------|---------|
| Cash Deposits | Input | Input | Input |
| Cash Withdrawals | Input | Input | Input |
| Cheque Payments | Input | Input | Input |
| Internal Transfers | Input | Input | Input |
| Wire Transfers (International) | Input | Input | Input |

### Additional Fields

| # | Field | Type | Required |
|---|-------|------|----------|
| 6.1 | Countries funds anticipated from/to | Text | YES |
| 6.2 | Transactions with sanctioned countries | Radio (Yes/No) | YES |

---

## Section 7: Existing Relationships

### 7A — Within QIB

| # | Field | Type | Required | Source |
|---|-------|------|----------|--------|
| 7A.1 | Existing relationship within QIB | Radio (Yes/No) | YES | T24 |

**Table (if Yes):** Account Holder, RIM, Segment, Relationship

### 7B — With Other Banks

**Table:** Bank Name, Country, Estimated Value (QAR), Banking Since

---

## Section 8: Related Party

| # | Field | Type | Required |
|---|-------|------|----------|
| 8.1 | Authorized signatory / POA / Guardian / Joint Holder | Radio (Yes/No) | YES |

---

## Section 9: PEP Identification

| # | Field | Type | Required | Source |
|---|-------|------|----------|--------|
| 9.1 | Is customer a PEP | Radio (Yes/No) | YES | T24/CRP |
| 9.2 | PEP Category | Dropdown | Conditional | Manual |
| 9.3 | Name of Primary PEP | Text | Conditional | Manual |
| 9.4 | Type of Primary PEP | Text | Conditional | Manual |
| 9.5 | PEP Nationality | Text | Conditional | QCB |
| 9.6 | Associate Country | Text | Conditional | Manual |
| 9.7 | Public Function / Position Held | Text | Conditional | Manual |
| 9.8 | Background and Assessment | Textarea | Conditional | Manual |
| 9.9 | Still holding PEP position | Radio (Yes/No) | Conditional | Manual |
| 9.10 | Cessation Year | Number | Conditional | Manual |

**PEP Categories:** Domestic PEP, Foreign PEP, International Organization PEP, Family Member of PEP, Close Associate of PEP

---

## Section 10: Business Recommendations

| # | Field | Type | Required |
|---|-------|------|----------|
| 10.1 | Overall Summary of Customer Profile | Textarea | YES |
| 10.2 | Business Recommendation | Dropdown | YES |
| 10.3 | Additional Information / Comments | Textarea | NO |

**Recommendation Options:** Proceed to CDD with Approval, Proceed with Enhanced Monitoring, Temporary Account Restriction, Account Freeze Pending Review, Escalate to Compliance

---

## Section 11: Sign Off Workflow (Maker / Checker)

### Business Maker

| # | Field | Type | Required |
|---|-------|------|----------|
| 11.1 | Staff Name | Text (Auto) | YES |
| 11.2 | Staff ID | Text (Auto) | YES |
| 11.3 | Date | Date (Auto) | YES |

### Business Checker

| # | Field | Type | Required |
|---|-------|------|----------|
| 11.4 | Staff Name | Text (Auto) | YES |
| 11.5 | Staff ID | Text (Auto) | YES |
| 11.6 | Date | Date (Auto) | YES |

**Actions:** Save as Draft, Submit for Approval

---

## Data Sources Summary

| Source | Sections | Data |
|--------|----------|------|
| T24 Core Banking | 1, 2, 4, 7 | Customer data, risk classification, employment, accounts |
| QCB KYC API | 2, 9 | Nationality, KYC verification, PEP nationality |
| DMS | Documents Tab | Document retrieval, upload, storage |
| Manual Entry | 3, 4, 5, 6, 7, 8, 9, 10 | Investigation data, assessments, recommendations |

---

## Workflow Stages

```
Case Created → Business Review → Business Approval → CDD Review → CDD Approval → Complete
```

---

**Document ID:** BRD-EDD-2026-001  
**Version:** 1.1  
**Date:** March 2026  
**Status:** Submitted for Stakeholder Review  
**Classification:** Internal — QIB Confidential
