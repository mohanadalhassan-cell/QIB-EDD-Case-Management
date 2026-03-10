# BUSINESS REQUIREMENTS DOCUMENT (BRD)
# EDD Digital Case Management System
## Extension Module — FLOW Workflow Platform

---

**Qatar Islamic Bank (QIB) S.A.Q.**

---

| | |
|---|---|
| **Document Title** | Business Requirements Document — EDD Digital Case Management System |
| **Document ID** | BRD-EDD-FLOW-2026-002 |
| **Version** | 2.1 |
| **Date** | March 10, 2026 |
| **Classification** | Internal — QIB Confidential |
| **Target Platform** | FLOW Workflow System (Extension Module) |
| **Prepared By** | Retail Banking Operations — CDD & Compliance Division |
| **Department** | Retail Banking Group |

---

# SECTION 1: DOCUMENT CONTROL

## 1.1 Document Information

| Parameter | Value |
|-----------|-------|
| Document Title | Business Requirements Document — EDD Digital Case Management System |
| Document ID | BRD-EDD-FLOW-2026-002 |
| Version | 2.1 |
| Status | Submitted for Stakeholder Review |
| Classification | Internal — QIB Confidential |
| Created Date | March 10, 2026 |
| Last Updated | March 10, 2026 |
| Author | Retail Banking Operations |
| Owner | CDD & Compliance Division |
| Distribution | IT, Risk, Compliance, Business, PMO |

## 1.2 Distribution List

| # | Recipient | Department | Role |
|---|-----------|------------|------|
| 1 | Head of Retail Banking | Retail Banking | Business Sponsor |
| 2 | Head of CDD Operations | CDD Operations | Process Owner |
| 3 | Head of Compliance | Compliance | Regulatory Authority |
| 4 | Head of Risk Management | Risk Management | Risk Oversight |
| 5 | Head of IT | Information Technology | Technical Delivery |
| 6 | Strategy & PMO Lead | Strategy & PMO | Project Governance |
| 7 | Head of Internal Audit | Internal Audit | Audit Oversight |
| 8 | Marketing & Communications | Marketing | Customer Communications |

## 1.3 Related Documents

| # | Document | Document ID | Version | Relationship |
|---|----------|-------------|---------|--------------|
| 1 | IT Technical Architecture Specification | BRD-EDD-IT-2026-001 | 1.0 | Technical companion |
| 2 | Enterprise Features Specification | BRD-EDD-ENT-2026-001 | 2.3 | Feature addendum |
| 3 | EDD Form Data Mapping & Field Specification | BRD-EDD-FORM-2026-001 | 1.0 | Data dictionary |
| 4 | Organization Structure Guide | DOC-ORG-2026-001 | 1.0 | Organizational reference |
| 5 | Implementation Roadmap | DOC-ROAD-2026-001 | 1.0 | Delivery plan |
| 6 | Integration Architecture Specification | BRD-EDD-INT-2026-001 | 1.0 | Integration companion |
| 7 | QCB API Integration Readiness | BRD-EDD-QCB-2026-001 | 1.0 | QCB API readiness |

---

# SECTION 2: VERSION HISTORY

| Version | Date | Author | Change Description | Reviewed By |
|---------|------|--------|-------------------|-------------|
| 0.1 | February 2026 | Retail Banking Operations | Initial draft — scope and workflow | CDD Operations |
| 0.5 | February 2026 | Retail Banking Operations | Added form specification, SLA model | Compliance, Risk |
| 1.0 | March 2026 | Retail Banking Operations | Full BRD — 16 sections, appendix | All stakeholders |
| 1.1 | March 2026 | Retail Banking Operations | Added Section 1.3 Regulatory Framework, enhanced NFRs | Compliance Head |
| 2.0 | March 10, 2026 | Retail Banking Operations | Complete restructure to 28-section QIB format; added Escalation Governance, Audit Trail, Security, Change Management, detailed validation rules, regulatory alignment matrix | All stakeholders |
| 2.1 | March 10, 2026 | Retail Banking Operations | Added Section 22: Risk Governance — Data Management Controls (High-Risk Nationality List, High-Risk Occupation List, Occupation Control Rules, Maker/Checker governance, Audit logging for risk data changes); expanded to 29 sections; added Appendix G and H | Risk Management, Compliance |

---

# SECTION 3: APPROVALS

This BRD requires formal review and approval from the following stakeholders before implementation can proceed. Approval signifies agreement with the business requirements, scope, and proposed solution.

| # | Stakeholder | Title | Department | Signature | Date |
|---|-------------|-------|------------|-----------|------|
| 1 | | Head of Retail Banking | Retail Banking Group | ______________ | ___/___/2026 |
| 2 | | CDD Operations Manager | CDD Operations | ______________ | ___/___/2026 |
| 3 | | Head of Compliance | Compliance Division | ______________ | ___/___/2026 |
| 4 | | Head of Risk Management | Risk Management Group | ______________ | ___/___/2026 |
| 5 | | Head of IT | Information Technology | ______________ | ___/___/2026 |
| 6 | | Strategy & PMO Lead | Strategy & PMO | ______________ | ___/___/2026 |
| 7 | | Head of Internal Audit | Internal Audit | ______________ | ___/___/2026 |
| 8 | | Marketing & Communications Head | Marketing & Comms | ______________ | ___/___/2026 |

**Approval Conditions:**
- All approvers must sign before development commences
- Any changes to scope after approval require a formal Change Request (CR)
- The document will be re-circulated for re-approval if material changes are made

---

# SECTION 4: INTRODUCTION

## 4.1 Purpose of This Document

This Business Requirements Document (BRD) defines the complete business, functional, technical, regulatory, and operational requirements for implementing the **EDD (Enhanced Due Diligence) Digital Case Management System** as an extension module within Qatar Islamic Bank's existing **FLOW Workflow Platform**.

The document serves as the authoritative reference for all stakeholders involved in the design, development, testing, deployment, and governance of the EDD system. It is structured to meet QIB's internal documentation standards and is suitable for submission to IT, Risk, Compliance, Internal Audit, and the Qatar Central Bank (QCB) if required.

## 4.2 Intended Audience

| Audience | Purpose |
|----------|---------|
| Business Teams (Retail, Mass, Tamayuz, Private) | Understand workflow, roles, and responsibilities |
| CDD Operations | Understand review process, form fields, and decision framework |
| Compliance Division | Validate regulatory alignment and escalation governance |
| Risk Management | Validate risk governance, monitoring, and dashboard requirements |
| Information Technology | Understand integration, security, and technical requirements |
| Internal Audit | Validate audit trail, controls, and segregation of duties |
| Strategy & PMO | Understand project scope, roadmap, and dependencies |
| Executive Management | Strategic overview and approval |

## 4.3 System Positioning

> **IMPORTANT:** The EDD Digital Case Management System is NOT a standalone platform.
> It is an **extension module** within the FLOW Workflow Platform already deployed at QIB.
> No new platform will be introduced. No additional infrastructure procurement is required.
> The solution leverages existing ESB integration, T24 connectivity, and DMS document management.

## 4.4 Terminology & Abbreviations

| Abbreviation | Full Form |
|-------------|-----------|
| EDD | Enhanced Due Diligence |
| CDD | Customer Due Diligence |
| KYC | Know Your Customer |
| AML | Anti-Money Laundering |
| CFT | Combating the Financing of Terrorism |
| PEP | Politically Exposed Person |
| STR | Suspicious Transaction Report |
| QCB | Qatar Central Bank |
| FATF | Financial Action Task Force |
| RBAC | Role-Based Access Control |
| ESB | Enterprise Service Bus |
| DMS | Document Management System |
| SLA | Service Level Agreement |
| FLOW | QIB Workflow Platform |
| T24 | Temenos Core Banking System |
| RIM | Relationship Identification Master |
| CRP | Customer Risk Profile |
| DSS | Decision Support System |

---

# SECTION 5: BUSINESS OBJECTIVE

## 5.1 Strategic Objective

To digitize, standardize, and automate the full lifecycle of Enhanced Due Diligence (EDD) case management within QIB's banking operations, ensuring:

1. **Regulatory Compliance** — Full alignment with FATF recommendations, QCB directives, and international standards
2. **Operational Efficiency** — Reduction of case processing time from 5–7 days to under 72 hours
3. **Governance & Accountability** — Enforced Maker/Checker controls with complete audit trail
4. **Risk Transparency** — Real-time dashboards and escalation monitoring for senior management
5. **Auditability** — Tamper-resistant, hash-chain audit log meeting ISO 27001:2022 standards

## 5.2 Measurable Objectives

| # | Objective | Measurable Target | Regulatory Reference |
|---|-----------|-------------------|----------------------|
| 1 | Digitize end-to-end EDD process | 100% paperless workflow | FATF Rec 10, 11 — CDD & Record Keeping |
| 2 | Standardize case routing across segments | Automated routing to correct department | BCBS 239 — Risk Data Aggregation |
| 3 | Enforce Maker/Checker controls | Zero unauthorized decisions | COBIT 2019 DSS05.04 — Access Control |
| 4 | Reduce case processing time | < 72 hours (from current 5–7 days) | QCB Circular No. 71/2022 — CDD Timeliness |
| 5 | Achieve full audit trail | 100% action traceability | ISO 27001:2022 A.8.15 — Logging |
| 6 | Ensure regulatory compliance | QCB, AML/CTF, FATF compliant | FATF Rec 20, QCB AML/CFT Framework |
| 7 | Integrate with existing infrastructure | FLOW platform, T24, DMS | ISO 27001:2022 A.8.26 — App Security |

## 5.3 Key Performance Indicators (KPIs)

| KPI | Current Baseline | Target | Improvement |
|-----|-----------------|--------|-------------|
| Case Processing Time | 5–7 days | < 72 hours | 60% faster |
| SLA Compliance Rate | ~60% | > 98% | +38% |
| Audit Trail Coverage | Partial (manual) | 100% digital | Complete |
| Manual Handoff Errors | Frequent | Zero | Eliminated |
| Regulatory Reporting Time | Manual (days) | Automated (same-day) | Real-time |
| Staff Utilization | Low (manual routing) | +25% productivity | Automated routing |
| Escalation Rate | Unmeasured | ≤ 5% monitored | Governance target |

---

# SECTION 6: BACKGROUND

## 6.1 Organizational Context

Qatar Islamic Bank (QIB) operates as a leading Islamic financial institution in Qatar, serving hundreds of thousands of customers across three primary segments: Mass Banking, Tamayuz (Priority), and Private Banking. The bank is regulated by the Qatar Central Bank (QCB) and is subject to national and international AML/CFT regulations.

## 6.2 Current State of EDD Operations

The current EDD process relies on distributed, partially manual procedures across multiple departments:

- **Paper-based forms** circulate physically between Business, CDD, and Compliance teams
- **No centralized system** tracks case status, SLA compliance, or escalation history
- **Handoffs between departments** are informal, leading to delays and information loss
- **Audit trails** are incomplete and difficult to reconstruct for regulatory inquiries
- **No standardized workflow** — each segment handles EDD cases differently
- **Reporting to QCB** is manual and time-consuming

## 6.3 Regulatory Environment

QIB operates under the following regulatory obligations relevant to EDD:

| Regulation | Authority | Relevance |
|------------|-----------|-----------|
| Qatar Law No. 20 of 2019 | State of Qatar | Anti-Money Laundering & Counter-Terrorism Financing |
| QCB AML/CFT Regulatory Framework | Qatar Central Bank | Complete CDD/EDD procedural requirements |
| QCB Circular No. 71/2022 | Qatar Central Bank | CDD timeliness and processing requirements |
| FATF Recommendations (2012, updated) | Financial Action Task Force | International AML/CFT standards (40 recommendations) |
| BCBS 239 | Basel Committee | Risk data aggregation and reporting principles |
| ISO 27001:2022 | International Organization for Standardization | Information security management |

## 6.4 FLOW Workflow Platform

The FLOW Workflow Platform is an existing enterprise workflow system deployed at QIB. It is used for multiple banking operations and provides:

- Configurable workflow engine with stage-based routing
- Integration with T24 Core Banking via ESB
- Role-based access control framework
- Notification engine (email, SMS, push)
- Dashboard and reporting capabilities
- Document management integration

The EDD Digital Case Management System will be implemented as an **extension module** within FLOW, not as a separate platform.

---

# SECTION 7: PROBLEM STATEMENT

## 7.1 Core Problem

The current EDD process at QIB is **manual, fragmented, and inconsistent**, resulting in:

1. **Regulatory Risk** — Incomplete audit trails and inconsistent procedures increase the risk of non-compliance with QCB directives and FATF recommendations
2. **Operational Inefficiency** — Case processing takes 5–7 days due to manual handoffs, paper-based forms, and lack of standardized routing
3. **Governance Gaps** — No enforced Maker/Checker controls; no systematic escalation governance; no real-time visibility into case status
4. **Audit Deficiencies** — Internal and external auditors cannot reliably reconstruct the decision-making history for EDD cases
5. **Reporting Delays** — QCB regulatory reports are prepared manually, consuming staff time and introducing error risk

## 7.2 Pain Points by Department

| Department | Pain Point | Impact |
|------------|-----------|--------|
| **Business Teams** | No standard form; manual document collection | Inconsistent submissions, rework |
| **CDD Operations** | Unstructured cases; no SLA tracking | Missed deadlines, incomplete reviews |
| **Compliance** | No centralized PEP/Sanctions tracking | Regulatory exposure |
| **Risk Management** | No real-time dashboard; no escalation metrics | Blind spots in governance |
| **Internal Audit** | Incomplete audit trail | Adverse audit findings |
| **IT** | No system integration; separate tools | Support overhead, data silos |
| **Executive Management** | No visibility into EDD operations | Uninformed decision-making |

## 7.3 Consequence of Inaction

| Risk Category | Potential Consequence |
|---------------|----------------------|
| Regulatory | QCB enforcement action, fines, license conditions |
| Reputational | Negative media coverage, loss of correspondent banking relationships |
| Operational | Continued inefficiency, staff burnout, errors |
| Financial | Cost of manual processes, regulatory penalties |
| Strategic | Inability to demonstrate digital transformation to the board and regulators |

---

# SECTION 8: PROPOSED SOLUTION

## 8.1 Solution Overview

Implement the **EDD Digital Case Management System** as an extension module within QIB's existing FLOW Workflow Platform. The solution digitizes the full lifecycle of EDD cases — from trigger to final decision — while enforcing governance controls, maintaining complete audit trails, and ensuring regulatory compliance.

## 8.2 Solution Architecture

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
│     │    │     EDD CASE MANAGEMENT MODULE            │       │       │
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

## 8.3 Decision Support System Philosophy

> **CRITICAL PRINCIPLE:**
> The EDD system is a **Decision Support System (DSS)**, NOT a Decision Engine.
> The system collects data, presents indicators, and highlights anomalies.
> **The final assessment and decision remain the responsibility of the assigned employee and authorized bank personnel.**

| What the System DOES | What the System Does NOT Do |
|----------------------|----------------------------|
| Collects data from T24, SnapView, QCB KYC API | ❌ Generate automated risk scores |
| Presents financial and behavioral indicators | ❌ Classify customers automatically |
| Highlights anomalies and inconsistencies | ❌ Make approval/rejection decisions |
| Routes cases through Maker/Checker workflow | ❌ Override employee assessment |
| Records all actions and decisions in audit trail | ❌ Replace human judgment |

This design ensures:
- No Model Risk (no automated scoring models requiring validation)
- Human-in-the-loop compliance (met by FATF and QCB expectations)
- Full accountability through digital signatures and audit trail

## 8.4 Key Solution Components

| # | Component | Description |
|---|-----------|-------------|
| 1 | Case Management Engine | Create, route, track, and close EDD cases within FLOW |
| 2 | Digital EDD Form (11 Sections) | Comprehensive investigation form with validation |
| 3 | Workflow Engine | Stage-based routing with Maker/Checker at each level |
| 4 | Document Management | Integrated with DMS for upload, retrieval, and verification |
| 5 | Risk Indicator Panel | Financial and behavioral indicators (not risk scores) |
| 6 | Escalation Governance | 5% threshold monitoring with senior compliance routing |
| 7 | Audit Trail System | Hash-chain tamper-resistant logging (ISO 27001:2022) |
| 8 | Dashboard & Reporting | Real-time operational, compliance, and management dashboards |
| 9 | Notification Engine | Email, SMS, mobile push for SLA alerts and case updates |
| 10 | Form Validation Engine | Enterprise-grade field validation (FATF, QCB, BCBS aligned) |
| 11 | Change Management Module | Structured feedback and suggestion submission system |

---

# SECTION 9: SCOPE OF THE SYSTEM

## 9.1 In Scope

| # | Capability | Description |
|---|-----------|-------------|
| 1 | EDD Case Creation | Triggered by T24 CRP high-risk classification, management referral, periodic due date, AML alerts, PEP identification, or Re-KYC findings |
| 2 | Multi-Department Workflow | Business → CDD → Compliance → Final Decision with Maker/Checker at each stage |
| 3 | Maker/Checker Approval | Enforced four-eyes principle at CDD and Compliance stages |
| 4 | Document Collection & Verification | Structured checklist for document verification with DMS integration |
| 5 | Source of Funds Assessment | Income, wealth, and transaction pattern analysis |
| 6 | PEP/Sanctions/AML Screening Support | System presents screening indicators; employee makes assessment |
| 7 | Account Restriction Management | Account restrictions based on EDD decisions, written back to T24 |
| 8 | T24 Writeback | EDD status, decision, restrictions, and next due date written back to T24 |
| 9 | SLA Tracking & Auto-Escalation | Automated SLA monitoring with notifications at threshold percentages |
| 10 | Notification Engine | Email, SMS, and mobile push notifications for all case events |
| 11 | Real-Time Dashboard | Operational, compliance, and management dashboards |
| 12 | Full Immutable Audit Trail | Hash-chain tamper-resistant logging of all actions |
| 13 | Segment Routing | Automatic routing to Mass, Tamayuz, or Private Banking queues |
| 14 | Role-Based Access Control | Seven defined roles with segregation of duties enforcement |
| 15 | Enterprise Form Validation | Real-time field validation aligned with FATF/QCB/BCBS standards |
| 16 | Escalation Analytics | 5% threshold monitoring with trend analysis for senior management |
| 17 | Change Management Feedback | Structured suggestion and improvement request system with audit logging |
| 18 | Re-KYC Alignment | Shared data with Re-KYC process to avoid duplication |
| 19 | Regulatory Reporting Support | Structured data for QCB regulatory report generation |

## 9.2 Out of Scope

| # | Item | Rationale |
|---|------|-----------|
| 1 | Automated Risk Scoring | System assists, human decides (DSS philosophy) |
| 2 | Machine Learning / AI Classification | Not required for initial release; future consideration |
| 3 | Biometric Verification | Handled by separate identity systems |
| 4 | Real-Time Transaction Monitoring | Separate AML transaction monitoring system |
| 5 | Video KYC | Not currently required by QCB regulations |
| 6 | Blockchain-Based Audit Trail | Traditional hash-chain provides equivalent integrity assurance |
| 7 | Customer Self-Service Portal | EDD is an internal bank process; customers interface through RM |

---

# SECTION 10: OUT OF SCOPE — DETAILED EXCLUSIONS

For clarity and to prevent scope creep, the following items are explicitly excluded from this project:

| # | Exclusion | Explanation | Future Consideration |
|---|-----------|-------------|----------------------|
| 1 | Automated Risk Scoring Engine | The system is a Decision Support System. Risk classification remains a human judgment. | Phase 3 evaluation |
| 2 | AI/ML-Based Customer Classification | No machine learning models will be trained or deployed. | Post-Phase 2 review |
| 3 | Biometric Authentication | Customer identity verification via biometrics is handled by existing systems. | Out of scope |
| 4 | Real-Time Transaction Monitoring | AML transaction monitoring is handled by a dedicated system (not FLOW). | Integration connector in Phase 2 |
| 5 | Video KYC | Not mandated by current QCB regulations. | Regulatory watch |
| 6 | Blockchain Audit Trail | Hash-chain integrity meets ISO 27001 requirements without blockchain overhead. | Technology review |
| 7 | Customer Self-Service | EDD is an internal process. Customer interaction is through Relationship Managers. | Out of scope |
| 8 | Credit Risk Assessment | EDD focuses on AML/CTF due diligence, not credit risk evaluation. | Separate system |
| 9 | Cross-Border Regulatory Filing | Direct filing with foreign regulators is not in scope; QCB reporting only. | Future consideration |

---

# SECTION 11: STAKEHOLDERS

## 11.1 Stakeholder Registry

| # | Stakeholder | Department | Role in EDD | Interest Level | Involvement |
|---|-------------|------------|-------------|----------------|-------------|
| 1 | Head of Retail Banking | Retail Banking Group | Business Sponsor & Executive Owner | Critical | Decision-maker |
| 2 | CDD Operations Manager | CDD Operations | Process Owner | Critical | Day-to-day operations |
| 3 | Head of Compliance | Compliance Division | Regulatory Authority & Final Approver | Critical | Regulatory alignment |
| 4 | Head of Risk Management | Risk Management Group | Risk Oversight & Dashboard Consumer | High | Governance monitoring |
| 5 | Head of IT | Information Technology | Technical Delivery & System Support | High | Build & maintain |
| 6 | Strategy & PMO Lead | Strategy & PMO | Project Governance & Milestones | High | Project tracking |
| 7 | Head of Internal Audit | Internal Audit | Audit Oversight & Controls Validation | High | Periodic review |
| 8 | Marketing & Communications | Marketing & Comms | Customer Communication Templates | Medium | Notification content |
| 9 | Mass Banking Officers | Retail Banking | Document collection for Mass segment | Medium | End users |
| 10 | Tamayuz Relationship Managers | Priority Banking | Document collection for Tamayuz segment | Medium | End users |
| 11 | Private Banking RMs | Private Banking | Document collection for Private segment | Medium | End users |
| 12 | CDD Officers | CDD Operations | EDD case review and documentation | Critical | End users |
| 13 | Compliance Officers | Compliance Division | PEP/Sanctions screening and regulatory decisions | Critical | End users |
| 14 | Call Center Supervisors | Customer Contact | Read-only case status for customer inquiries | Low | View access only |

## 11.2 Department Responsibility Matrix (RACI)

| Activity | Business | CDD | Compliance | Risk | IT | PMO | Audit |
|----------|----------|-----|------------|------|----|-----|-------|
| Case Creation | **R** | I | I | I | — | — | — |
| Document Collection | **R** | C | — | — | — | — | — |
| Business Review & Recommendation | **R/A** | I | I | — | — | — | — |
| CDD Due Diligence Review | I | **R/A** | I | — | — | — | — |
| PEP/Sanctions Screening | — | C | **R/A** | I | — | — | — |
| Final Regulatory Decision | — | I | **R/A** | I | — | — | — |
| Risk Dashboard Monitoring | — | — | I | **R/A** | — | — | — |
| System Configuration | — | — | — | — | **R/A** | I | — |
| Audit Trail Review | — | — | — | I | — | — | **R/A** |
| Project Governance | I | I | I | I | I | **R/A** | — |

**RACI Legend:** R = Responsible, A = Accountable, C = Consulted, I = Informed

---

# SECTION 12: HIGH-LEVEL PROCESS FLOW

## 12.1 Standard EDD Workflow

```
Case Creation → Business Input → CDD Review → CDD Decision → Case Closure
```

**Detailed Flow:**

```
┌───────────────────┐
│   EDD TRIGGER     │
│ (T24 CRP / Manual │
│  / Periodic)      │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  CASE CREATION    │
│ • Generate Case ID│
│ • Fetch T24 data  │
│ • Route to segment│
│ • Notify RM       │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐     ┌──────────────────┐
│  BUSINESS INPUT   │────▶│ BUSINESS CHECKER │
│ (Business Maker)  │     │ (Approve/Return) │
│ • Collect docs    │     └────────┬─────────┘
│ • Verify documents│              │
│ • Recommendation  │              ▼
└───────────────────┘     ┌──────────────────┐
                          │   CDD REVIEW     │
                          │ (CDD Maker)      │
                          │ • Source of Funds │
                          │ • Business Rel.   │
                          │ • Transaction Anl.│
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │  CDD DECISION    │
                          │ (CDD Checker)    │
                          │ • Approve        │
                          │ • Return/Rework  │
                          │ • Escalate       │
                          └────────┬─────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │  CASE CLOSURE    │
                          │ • T24 Writeback  │
                          │ • Notification   │
                          │ • Archive        │
                          └──────────────────┘
```

## 12.2 Escalation Flow (Exceptional Cases)

```
Case Creation → Business Input → CDD Review → Escalation → Senior Compliance Review → Final Decision
```

**Detailed Flow:**

```
┌───────────────────┐
│   CDD REVIEW      │
│ • PEP identified  │
│ • Sanctions flag   │
│ • High risk anomaly│
│ • Threshold breach │
└────────┬──────────┘
         │
         ▼ (Escalation Trigger)
┌───────────────────┐
│ COMPLIANCE REVIEW │
│ (Compliance Maker)│
│ • PEP screening   │
│ • Sanctions screen │
│ • AML/CTF assess. │
│ • FATCA/CRS review│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ SENIOR COMPLIANCE │
│ REVIEW (Checker)  │
│ • Validate findings│
│ • Regulatory dec. │
│ • Approve/Escalate│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  FINAL DECISION   │
│ ✅ Approved        │
│ ⚠️ Approved w/     │
│    Conditions      │
│ ❌ Rejected        │
│ ⬆️ Board Review    │
└───────────────────┘
```

## 12.3 EDD Trigger Sources

| # | Trigger | Source System | Description |
|---|---------|-------------|-------------|
| 1 | T24 CRP High Risk | T24 Core Banking | Customer risk profile classified as High Risk |
| 2 | Management Referral | Manual | Management identifies customer for EDD review |
| 3 | Periodic Due Date | FLOW Scheduler | Scheduled EDD review cycle reached |
| 4 | AML Alert | AML Monitoring System | Transaction monitoring alert triggers EDD |
| 5 | PEP Identification | Screening System | New PEP classification detected |
| 6 | Re-KYC Finding | Re-KYC Process | Re-KYC review identifies need for enhanced diligence |

---

# SECTION 13: DETAILED WORKFLOW

## 13.1 Stage 1 — Business Review

| Attribute | Detail |
|-----------|--------|
| **Performers** | RM / Branch Officer (Maker), Business Analyst (Checker) |
| **Purpose** | Customer-facing document collection and initial recommendation |
| **Standard SLA** | 24 hours (Mass), 12 hours (Tamayuz), 18 hours (Private) |
| **Inputs** | T24 customer data, triggered case |
| **Outputs** | Completed EDD form Sections 1–10, document uploads, recommendation |

**Business Maker Activities:**
1. Receive case notification (email/SMS/push)
2. Contact customer for document collection
3. Verify documents against DMS records
4. Identify discrepancies or missing documents
5. Complete EDD form sections (Customer ID, Source of Income, Transaction Profile, etc.)
6. Add verification notes and observations
7. Submit to Business Checker

**Business Checker Activities:**
1. Review Maker's submission and documentation
2. Validate completeness of form and document checklist
3. Review recommendation (MAINTAIN or EXIT)
4. Approve and route to CDD, or return for rework
5. Maximum rework cycles: 3

## 13.2 Stage 2 — CDD Review

| Attribute | Detail |
|-----------|--------|
| **Performers** | CDD Officer (Maker), CDD Manager (Checker) |
| **Purpose** | Independent due diligence review and assessment |
| **Standard SLA** | 24 hours (standard), 48 hours (deep-dive) |
| **Inputs** | Business submission, T24 data, SnapView financial analytics |
| **Outputs** | CDD assessment report, decision recommendation |

**CDD Maker Activities:**
1. Review Business submission and documents
2. Perform source of funds verification using SnapView data
3. Conduct business relationship assessment
4. Analyze transaction patterns against declared profile
5. Review PEP/Sanctions initial screening indicators
6. Document discrepancies requiring deep-dive (if flagged)
7. Prepare CDD Report with recommendation
8. Submit to CDD Checker

**CDD Checker Activities:**
1. Review Maker's CDD findings and report
2. Validate documentation completeness
3. Verify consistency of analysis
4. Decision: Approve, Return for Rework, or Escalate to Compliance
5. CDD sign-off

**Segregation Rule:** CDD Maker ≠ CDD Checker (enforced by system)

## 13.3 Stage 3 — Compliance Review (Escalated Cases Only)

| Attribute | Detail |
|-----------|--------|
| **Performers** | Compliance Officer (Maker), Compliance Manager (Checker), Compliance Head (Senior Escalation) |
| **Purpose** | Regulatory compliance assessment for high-risk or PEP cases |
| **Standard SLA** | 24 hours |
| **Inputs** | CDD assessment, all case documentation, screening results |
| **Outputs** | Regulatory decision, account restrictions, QCB reporting |

**Compliance Officer (Maker) Activities:**
1. PEP screening across 4+ databases
2. Sanctions screening across 6 international lists
3. AML/CTF assessment
4. FATCA/CRS review (if applicable)
5. Document regulatory findings
6. Submit to Compliance Manager

**Compliance Manager (Checker) Activities:**
1. Review officer's regulatory findings
2. Validate screening results
3. Decision: Approve, Request Additional Review, or Escalate to Compliance Head

**Compliance Authority Matrix:**

| Risk Level | Approving Authority |
|-----------|-------------------|
| Low / Medium Risk | Compliance Officer can approve |
| High Risk | Compliance Manager must approve |
| PEP / Sanctions | Compliance Head must approve |
| Strategic Risk | Board Risk Committee review required |

## 13.4 Stage 4 — Final Decision & Closure

| Decision | Action | T24 Writeback |
|----------|--------|---------------|
| **Approved** | Account eligible, no restrictions | EDD Status = Completed, Next Due Date set |
| **Approved with Conditions** | Enhanced monitoring / account restrictions | EDD Status = Conditional, Restriction applied |
| **Rejected** | Customer not eligible | EDD Status = Rejected, Account restricted |
| **Escalate to Board** | Board Risk Committee review required | EDD Status = Escalated |

**T24 Writeback Fields:**

| Field | Description |
|-------|-------------|
| EDD Status | Completed / Pending / Expired / Escalated |
| EDD Completion Date | Date of final decision |
| EDD Decision | Approved / Approved with Conditions / Rejected |
| Next EDD Due Date | Next scheduled EDD review date |
| Account Restriction | Restriction code (if applied) |

---

# SECTION 14: SYSTEM FUNCTIONAL REQUIREMENTS

## 14.1 Case Management

| Req ID | Requirement | Priority | FATF/ISO Reference |
|--------|-------------|----------|---------------------|
| FR-CM-001 | System shall create EDD cases automatically upon T24 CRP trigger | Must Have | FATF Rec 10 |
| FR-CM-002 | System shall support manual case creation by authorized users | Must Have | — |
| FR-CM-003 | System shall generate unique Case ID for each EDD case | Must Have | FATF Rec 11 |
| FR-CM-004 | System shall auto-populate customer data from T24 via ESB | Must Have | BCBS 239 |
| FR-CM-005 | System shall route cases to segment-specific queues (Mass / Tamayuz / Private) | Must Have | — |
| FR-CM-006 | System shall track case status through all workflow stages | Must Have | QCB AML/CFT |
| FR-CM-007 | System shall prevent case deletion; only closure/archival is permitted | Must Have | FATF Rec 11 |
| FR-CM-008 | System shall support case re-opening with full audit trail | Should Have | ISO 27001 A.8.15 |

## 14.2 Workflow Engine

| Req ID | Requirement | Priority | Reference |
|--------|-------------|----------|-----------|
| FR-WF-001 | System shall enforce sequential workflow: Business → CDD → Compliance → Decision | Must Have | QCB AML/CFT |
| FR-WF-002 | System shall enforce Maker/Checker at CDD and Compliance stages | Must Have | COBIT DSS05.04 |
| FR-WF-003 | System shall prevent Maker and Checker from being the same person | Must Have | COBIT DSS05.04 |
| FR-WF-004 | System shall support case return/rework with mandatory reason | Must Have | — |
| FR-WF-005 | System shall limit rework cycles to maximum 3 per stage | Should Have | — |
| FR-WF-006 | System shall support case escalation from CDD to Compliance | Must Have | FATF Rec 20 |
| FR-WF-007 | System shall support Save as Draft functionality | Must Have | — |
| FR-WF-008 | System shall lock case sections after approval to prevent retroactive changes | Must Have | ISO 27001 A.8.15 |

## 14.3 Document Management

| Req ID | Requirement | Priority | Reference |
|--------|-------------|----------|-----------|
| FR-DM-001 | System shall integrate with DMS for document upload and retrieval | Must Have | FATF Rec 11 |
| FR-DM-002 | System shall provide structured document checklist per case | Must Have | — |
| FR-DM-003 | System shall track document verification status (Verified / Pending / Rejected) | Must Have | — |
| FR-DM-004 | System shall support document version management | Should Have | ISO 27001 A.8.15 |
| FR-DM-005 | System shall flag missing mandatory documents before stage submission | Must Have | — |

## 14.4 Notification Engine

| Req ID | Requirement | Priority | Reference |
|--------|-------------|----------|-----------|
| FR-NE-001 | System shall send email notifications for case assignments | Must Have | — |
| FR-NE-002 | System shall send SMS notifications for SLA warnings (75% elapsed) | Must Have | QCB 71/2022 |
| FR-NE-003 | System shall send mobile push notifications for urgent escalations | Should Have | — |
| FR-NE-004 | System shall send auto-escalation notifications when SLA is breached | Must Have | QCB 71/2022 |
| FR-NE-005 | System shall support bilingual notifications (English / Arabic) | Must Have | — |

## 14.5 Dashboard & Reporting

| Req ID | Requirement | Priority | Reference |
|--------|-------------|----------|-----------|
| FR-DR-001 | System shall provide real-time case queue dashboard by segment | Must Have | — |
| FR-DR-002 | System shall display SLA compliance metrics with RAG indicators | Must Have | QCB 71/2022 |
| FR-DR-003 | System shall provide management dashboard with escalation analytics | Must Have | QCB AML/CFT |
| FR-DR-004 | System shall track and display escalation rate with 5% threshold target | Must Have | QCB AML/CFT |
| FR-DR-005 | System shall provide exportable reports in PDF and Excel formats | Should Have | — |
| FR-DR-006 | System shall provide risk governance heat map for senior management | Should Have | BCBS 239 |

## 14.6 Integration

| Req ID | Requirement | Priority | Reference |
|--------|-------------|----------|-----------|
| FR-INT-001 | System shall integrate with T24 Core Banking via ESB (bidirectional) | Must Have | — |
| FR-INT-002 | System shall integrate with SnapView for financial analytics (read-only) | Must Have | BCBS 239 |
| FR-INT-003 | System shall integrate with QCB KYC API for document verification (read-only) | Must Have | QCB AML/CFT |
| FR-INT-004 | System shall integrate with DMS for document management (bidirectional) | Must Have | FATF Rec 11 |
| FR-INT-005 | System shall write back EDD decisions to T24 upon case closure | Must Have | — |
| FR-INT-006 | System shall integrate with email/SMS infrastructure for notifications | Must Have | — |

## 14.7 Risk Data Governance

| Req ID | Requirement | Priority | Reference |
|--------|-------------|----------|-----------|
| FR-RG-001 | System shall provide a governance-controlled module for managing the High-Risk Nationality List | Must Have | QCB AML/CFT |
| FR-RG-002 | System shall provide a governance-controlled module for managing the High-Risk Occupation List | Must Have | QCB AML/CFT |
| FR-RG-003 | System shall support manual entry and update of nationality and occupation risk records | Must Have | — |
| FR-RG-004 | System shall support bulk upload of risk lists via Excel (.xlsx) or CSV file | Must Have | — |
| FR-RG-005 | System shall enforce Maker/Checker dual approval for all changes to risk data lists | Must Have | COBIT DSS05.04 |
| FR-RG-006 | System shall block KYC completion if a customer selects a High-Risk Occupation without uploading required supporting documentation | Must Have | FATF Rec 10 |
| FR-RG-007 | System shall record every change to risk data lists in the audit trail including previous value, new value, user ID, timestamp, and IP address | Must Have | ISO 27001 A.8.15 |
| FR-RG-008 | System shall apply occupation-based documentation blocking to all account types (Current, Savings, Investment, and others) | Must Have | QCB AML/CFT |
| FR-RG-009 | System shall prevent activated risk data changes from taking effect until Checker approval is obtained | Must Have | COBIT DSS05.04 |
| FR-RG-010 | System shall validate bulk upload file structure (required columns, data types, allowed values) before accepting the upload | Must Have | BCBS 239 |

---

# SECTION 15: DATA FIELDS AND VALIDATION RULES

## 15.1 EDD Form Structure

The EDD Investigation Form consists of **11 sections** organized across **4 Tabs**:

| Tab | Purpose |
|-----|---------|
| **EDD Form** | Main investigation form (11 sections) |
| **Documents** | Uploaded/retrieved documents (DMS integration) |
| **Comments & History** | Case comments, audit trail, timeline |
| **Approval** | Maker/Checker approval workflow |

## 15.2 Section 1: Risk Classification of the Client

| # | Field | Type | Required | Source | Validation |
|---|-------|------|----------|--------|------------|
| 1.1 | Client involved in increased risk business | Radio (Yes/No) | YES | T24/CRP | Must select one |
| 1.2 | Self-employed from sanctioned/high-risk country | Radio (Yes/No) | YES | Manual | Must select one |
| 1.3 | Non-Resident Status | Radio (Yes/No) | YES | T24 | Auto-populated from T24 |
| 1.4 | Private Banking Sector | Radio (Yes/No) | YES | T24 | Auto-populated from segment |
| 1.5 | Politically Exposed Person (PEP) | Radio (Yes/No) | YES | T24/CRP | Auto-populated from screening |
| 1.6 | Overall Risk Classification | Dropdown (Read-only) | YES | T24/CRP | High / Medium / Low |

**Business Rule:** If any of fields 1.1–1.5 = Yes → Overall Risk Classification is automatically set to HIGH.

## 15.3 Section 2: Customer Information

| # | Field | Type | Required | Source | Validation |
|---|-------|------|----------|--------|------------|
| 2.1 | Customer Name | Text (Read-only) | YES | T24 | Non-numeric, 3–100 chars |
| 2.2 | RIM Number | Text (Read-only) | YES | T24 | Format: RIM + 6 digits |
| 2.3 | Nationality | Text (Read-only) | YES | QCB KYC API | ISO 3166-1 country code |
| 2.4 | Date of Birth | Date (Read-only) | YES | T24 | Valid date, not future |
| 2.5 | Form being filed for | Dropdown | YES | Manual | Customer / Joint Account Holder / Guardian / POA |
| 2.6 | How was client acquired | Dropdown | YES | Manual | Referral / Walk-in / Online / Corporate Introduction |
| 2.7 | Referral Details | Text | Conditional | Manual | Required if 2.6 = Referral |
| 2.8 | If referred, specify by whom | Text | Conditional | Manual | Required if 2.6 = Referral |

## 15.4 Section 3: Purpose and Intended Use of Account

| # | Field | Type | Required | Validation |
|---|-------|------|----------|------------|
| 3.1 | Purpose of Account | Dropdown | YES | Must select from predefined list |
| 3.2 | Account used for business activities | Radio (Yes/No) | YES | Must select one |
| 3.3 | Expected Banking Products & Services | Checkbox (Multi) | YES | At least one must be selected |

**Products Checklist:** Current Account, Savings Account, Credit Card, Personal Finance, Investment Services, Trade Finance, Private Banking

## 15.5 Section 4: Source of Income & Source of Wealth

### 4A — Salary / Employment Income

| # | Field | Type | Required | Validation |
|---|-------|------|----------|------------|
| 4A.1 | Designation | Text | YES | Min 3 chars |
| 4A.2 | Name of Employer | Text | YES | Min 3 chars |
| 4A.3 | Employer Address | Text | NO | — |
| 4A.4 | Years in Employment | Number | NO | 0–70 range |
| 4A.5 | Expected Monthly Income (QAR) | Currency | YES | Positive number, max 2 decimals |
| 4A.6 | Salary Transferred to QIB | Radio (Yes/No) | NO | — |

### 4A — Business / Self-Employment Income

| # | Field | Type | Required | Validation |
|---|-------|------|----------|------------|
| 4A.7 | Business Name | Text | Conditional | Required if self-employed |
| 4A.8 | Line of Business Activity | Text | Conditional | Required if self-employed |
| 4A.9 | % Ownership | Percentage | Conditional | 0–100%, max 1 decimal |
| 4A.10 | Years in Business | Number | Conditional | 0–100 range |
| 4A.11 | Annual Profit (QAR) | Currency | Conditional | Positive number |
| 4A.12 | Company Account with QIB | Radio (Yes/No) | Conditional | — |

### 4B — Source of Wealth

| # | Field | Type | Required | Validation |
|---|-------|------|----------|------------|
| 4B.1 | Source of Wealth Categories | Checkbox (Multi) | YES | At least one category selected |
| 4B.2 | Detailed Explanation of Source of Wealth | Textarea | YES | Min 100 chars (FATF Rec 10) |

**Wealth Categories:** Salary Earnings, Business Earnings, Gift / Inheritance, Investment Income, Sale of Business, Sale of Property, Others

### 4C — Estimated Net Worth

| # | Field | Type | Required | Validation |
|---|-------|------|----------|------------|
| 4C.1 | Estimated Net Worth Range | Dropdown | YES | Must select from predefined ranges |

**Ranges:** < QAR 250K, 250K–500K, 500K–1M, 1M–3M, 3M–5M, > QAR 5M

## 15.6 Section 5: Initial Deposit

| # | Field | Type | Required | Validation |
|---|-------|------|----------|------------|
| 5.1 | Initial Deposit Amount (QAR) | Currency | YES | Positive number, max 2 decimals |
| 5.2 | Expected Eventual Balance (QAR) | Currency | NO | Positive number |
| 5.3 | Mode of Initial Deposit | Dropdown | YES | Cash / Cheque / Bank Transfer / Other |
| 5.4 | Source of Funds for Initial Deposit | Text | YES | Min 20 chars |

## 15.7 Section 6: Monthly Anticipated Transaction Activity

### Transaction Table

| Column | Type | Validation |
|--------|------|------------|
| Transaction Type | Predefined (Cash Deposits, Cash Withdrawals, Cheque Payments, Internal Transfers, Wire Transfers) | Read-only labels |
| No. of Transactions | Number | Positive integer |
| Total Value (QAR) | Currency | Positive number |
| Purpose | Text | Min 10 chars if value > 0 |

### Additional Fields

| # | Field | Type | Required | Validation |
|---|-------|------|----------|------------|
| 6.1 | Countries funds anticipated from/to | Text | YES | Min 3 chars |
| 6.2 | Transactions with sanctioned countries | Radio (Yes/No) | YES | Must select one |

### Financial Threshold Alerts (System-Generated)

| Threshold | Trigger | Regulatory Reference |
|-----------|---------|---------------------|
| QAR 200,000+ | STR threshold monitoring | FATF Rec 20 |
| Cash Deposits ≥ QAR 50,000 | Large cash deposit alert | QCB AML/CFT |
| Wire Transfers ≥ QAR 500,000 | International wire alert | FATF Rec 16 |
| Net Worth vs. Transaction Volume deviation > 30% | Inconsistency flag | BCBS 239 |

## 15.8 Section 7: Existing Relationships

### 7A — Within QIB

| # | Field | Type | Required |
|---|-------|------|----------|
| 7A.1 | Existing relationship within QIB | Radio (Yes/No) | YES |
| 7A.2 | Relationship Table (if Yes) | Table | Conditional |

**Table Columns:** Account Holder Name, RIM, Segment, Relationship Type

### 7B — With Other Banks

**Table Columns:** Bank Name, Country, Estimated Value (QAR), Banking Since

## 15.9 Section 8: Related Party

| # | Field | Type | Required |
|---|-------|------|----------|
| 8.1 | Authorized signatory / POA / Guardian / Joint Holder | Radio (Yes/No) | YES |
| 8.2 | Related Party Details Table (if Yes) | Table | Conditional |

## 15.10 Section 9: PEP Identification (FATF Recommendation 12)

| # | Field | Type | Required | Validation |
|---|-------|------|----------|------------|
| 9.1 | Is customer a PEP | Radio (Yes/No) | YES | Must select one |
| 9.2 | PEP Category | Dropdown | Conditional | Required if 9.1 = Yes |
| 9.3 | Name of Primary PEP | Text | Conditional | Required if 9.1 = Yes |
| 9.4 | Type of Primary PEP | Text | Conditional | Required if 9.1 = Yes |
| 9.5 | PEP Nationality | Text | Conditional | ISO 3166-1 country code |
| 9.6 | Associate Country | Text | Conditional | ISO 3166-1 country code |
| 9.7 | Public Function / Position Held | Text | Conditional | Min 10 chars |
| 9.8 | Background and Assessment | Textarea | Conditional | Min 50 chars (FATF Rec 12) |
| 9.9 | Still holding PEP position | Radio (Yes/No) | Conditional | Must select one |
| 9.10 | Cessation Year | Number | Conditional | Required if 9.9 = No; valid year |

**PEP Categories:** Domestic PEP, Foreign PEP, International Organization PEP, Family Member of PEP, Close Associate of PEP

## 15.11 Section 10: Business Recommendations

| # | Field | Type | Required | Validation |
|---|-------|------|----------|------------|
| 10.1 | Overall Summary of Customer Profile | Textarea | YES | Min 50 chars |
| 10.2 | Business Recommendation | Dropdown | YES | Must select from predefined options |
| 10.3 | Additional Information / Comments | Textarea | NO | — |

**Recommendation Options:**
- Proceed to CDD with Approval
- Proceed with Enhanced Monitoring
- Temporary Account Restriction
- Account Freeze Pending Review
- Escalate to Compliance

## 15.12 Section 11: Sign Off Workflow (Maker / Checker)

### Business Maker Sign-Off

| # | Field | Type | Auto-Populated |
|---|-------|------|----------------|
| 11.1 | Staff Name | Text | Yes — from logged-in session |
| 11.2 | Staff ID | Text | Yes — from logged-in session |
| 11.3 | Date & Time | Timestamp | Yes — system timestamp |

### Business Checker Sign-Off

| # | Field | Type | Auto-Populated |
|---|-------|------|----------------|
| 11.4 | Staff Name | Text | Yes — from logged-in session |
| 11.5 | Staff ID | Text | Yes — from logged-in session |
| 11.6 | Date & Time | Timestamp | Yes — system timestamp |

**Actions Available:** Save as Draft, Submit for Approval

## 15.13 Field Validation Engine Summary

The system implements an enterprise-grade validation engine aligned with the following regulatory standards:

| Validation Category | Rule | Regulatory Reference |
|---------------------|------|---------------------|
| QID Number | 11-digit format: `[0-9]{11}` | QCB KYC Requirements |
| IBAN (Qatar) | Format: `QA[0-9]{2}[A-Z]{4}[A-Za-z0-9]{21}` | ISO 13616 |
| Phone Number | Qatar format: `+974[0-9]{8}` | — |
| Email Address | RFC 5322 compliant pattern | — |
| RIM Number | Format: `RIM[0-9]{6}` | T24 Standard |
| Currency Amount | Positive number, max 2 decimal places | — |
| Percentage | 0.0–100.0 range, max 1 decimal | — |
| Country Code | ISO 3166-1 alpha-2 or alpha-3 | ISO 3166 |
| Source of Wealth Explanation | Minimum 100 characters | FATF Rec 10 |
| PEP Background Assessment | Minimum 50 characters | FATF Rec 12 |
| STR Financial Threshold | Alert if total value ≥ QAR 200,000 | FATF Rec 20 |
| Cash Deposit Alert | Alert if single deposit ≥ QAR 50,000 | QCB AML/CFT |
| Wire Transfer Alert | Alert if international wire ≥ QAR 500,000 | FATF Rec 16 |
| Net Worth Consistency | Flag if transaction volume deviates > 30% from declared net worth | BCBS 239 |

---

# SECTION 16: USER ROLES AND ACCESS CONTROL

## 16.1 Role Definitions

| # | Role ID | Role Name | Arabic | Description |
|---|---------|-----------|--------|-------------|
| 1 | BUSINESS_MAKER | Business Maker | صانع الأعمال | Creates and submits EDD cases for review |
| 2 | BUSINESS_CHECKER | Business Checker | مدقق الأعمال | Reviews and approves business submissions |
| 3 | CDD_MAKER | CDD Maker | صانع CDD | Performs CDD review and documentation |
| 4 | CDD_CHECKER | CDD Checker | مدقق CDD | Reviews and approves CDD submissions |
| 5 | COMPLIANCE_MAKER | Compliance Officer | ضابط الالتزام | Performs regulatory screening and assessment |
| 6 | COMPLIANCE_CHECKER | Compliance Manager | مدير الالتزام | Reviews and approves compliance decisions |
| 7 | COMPLIANCE_HEAD | Compliance Head | رئيس الالتزام | Senior authority for PEP/Sanctions escalations |
| 8 | RISK_MANAGER | Risk Dashboard Viewer | مدير المخاطر | Read-only governance dashboard access |
| 9 | RISK_OFFICER | Risk Officer | ضابط المخاطر | Maker for risk data list changes (nationality, occupation) |
| 10 | CALL_CENTER | Call Center View | عرض مركز الاتصال | Read-only customer status view |

## 16.2 Access Control Matrix

| Function | BUS_MAKER | BUS_CHECK | CDD_MAKER | CDD_CHECK | COMP_MAKER | COMP_CHECK | COMP_HEAD | RISK_MGR | RISK_OFF | CALL_CTR |
|----------|-----------|-----------|-----------|-----------|------------|------------|-----------|----------|----------|----------|
| Create Case | ✅ | — | — | — | — | — | — | — | — | — |
| Edit EDD Form | ✅ | — | ✅ | — | — | — | — | — | — | — |
| View Case | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Approve (Maker→Checker) | — | ✅ | — | ✅ | — | ✅ | ✅ | — | — | — |
| Return for Rework | — | ✅ | — | ✅ | — | ✅ | ✅ | — | — | — |
| Escalate to Compliance | — | — | — | ✅ | — | — | — | — | — | — |
| PEP/Sanctions Decision | — | — | — | — | ✅ | ✅ | ✅ | — | — | — |
| Upload Documents | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | — |
| View Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| View Audit Trail | — | — | — | — | — | ✅ | ✅ | ✅ | — | — |
| Manage Nationality List (Maker) | — | — | — | — | — | — | — | — | ✅ | — |
| Manage Occupation List (Maker) | — | — | — | — | — | — | — | — | ✅ | — |
| Approve Risk Data Changes (Checker) | — | — | — | — | — | ✅ | ✅ | — | — | — |
| Bulk Upload Risk Lists | — | — | — | — | — | — | — | — | ✅ | — |
| View Risk Data Audit Log | — | — | — | — | — | ✅ | ✅ | ✅ | — | — |
| Risk Governance Dashboard | — | — | — | — | — | — | ✅ | ✅ | ✅ | — |
| System Configuration | — | — | — | — | — | — | — | — | — | — |

**Note:** System Configuration is restricted to IT Administrators (not a business role in the EDD workflow).

## 16.3 Segregation of Duties Rules

| Rule | Enforcement |
|------|-------------|
| Business Maker ≠ Business Checker | System prevents same user from acting as both |
| CDD Maker ≠ CDD Checker | System prevents same user from acting as both |
| Compliance Maker ≠ Compliance Checker | System prevents same user from acting as both |
| Risk Data Maker ≠ Risk Data Checker | System prevents same user from both creating and approving risk data changes |
| Case Creator cannot be Final Approver | System prevents end-to-end single-user processing |
| Maximum rework cycles: 3 per stage | System enforces after 3 returns |

---

# SECTION 17: ESCALATION GOVERNANCE MODEL

## 17.1 Escalation Principles

The EDD system implements a structured escalation governance model designed to:

1. **Minimize unnecessary escalations** — Target: ≤ 5% of total cases should require escalation
2. **Ensure senior oversight** for genuine high-risk cases
3. **Maintain governance visibility** through real-time escalation analytics
4. **Comply with QCB AML/CFT Framework** requirements for senior management involvement

## 17.2 Escalation Triggers

| # | Trigger | Condition | Escalation Target |
|---|---------|-----------|-------------------|
| 1 | PEP Identification | Customer confirmed as PEP | Compliance Head |
| 2 | Sanctions Hit | Positive sanctions screening result | Compliance Head |
| 3 | STR Threshold | Transaction value ≥ QAR 200,000 | Compliance Manager |
| 4 | Large Cash Deposits | Single cash deposit ≥ QAR 50,000 | CDD Manager |
| 5 | SLA Breach | Case exceeds stage SLA | Next-level manager |
| 6 | Document Discrepancy | Significant document verification failure | CDD Manager |
| 7 | CDD Deep-Dive | CDD Maker flags case for enhanced review | CDD Checker + Compliance |
| 8 | Rework Limit Exceeded | 3 rework cycles exhausted | Stage Manager |

## 17.3 Escalation Authority Matrix

```
ESCALATION LEVELS:

Level 1: Stage Manager
├── SLA breach escalation
├── Rework limit exceeded
└── Document discrepancy

Level 2: CDD Manager / Compliance Manager
├── Large cash transactions
├── STR threshold cases
└── Deep-dive referrals

Level 3: Compliance Head
├── PEP cases
├── Sanctions hits
└── High-risk regulatory decisions

Level 4: Board Risk Committee
├── Strategic risk cases
├── Cases with potential regulatory impact
└── Cases involving bank directors or senior officers
```

## 17.4 Escalation Rate Monitoring

The system monitors escalation rates against a **5% threshold target** as recommended by the QCB AML/CFT Monitoring Framework:

| Metric | Description | Target |
|--------|------------|--------|
| Total Cases MTD | Total EDD cases processed month-to-date | Baseline metric |
| Escalated Cases | Cases escalated beyond standard CDD approval | Count |
| Escalation Rate | (Escalated Cases / Total Cases) × 100 | ≤ 5.0% |
| 6-Month Trend | Rolling 6-month escalation rate trend | Stable or declining |
| Escalation by Reason | Breakdown: PEP, Cash, Sanctions, Documents | Root cause analysis |

**Dashboard Display:**
- Escalation rate with GREEN (≤ 5%) / AMBER (5–7%) / RED (> 7%) indicator
- 6-month historical trend chart
- Escalation reason breakdown with percentage bars
- Regulatory compliance badges (FATF Rec 20, QCB AML/CFT, COBIT DSS05)

## 17.5 Auto-Escalation Rules

| Condition | Action | Notification |
|-----------|--------|-------------|
| 75% of SLA elapsed (Business/CDD) | Amber warning to stage manager | Email + in-app |
| 50% of SLA elapsed (Compliance) | Amber warning to Compliance Head | Email + SMS |
| SLA breached (any stage) | Auto-escalate to next-level manager | Email + SMS + push |
| Case idle > 48 hours | Auto-escalate to department head | Email + SMS |

---

# SECTION 18: INTEGRATION REQUIREMENTS

## 18.1 Integration Architecture

The EDD system operates within the FLOW Workflow Platform and integrates with QIB's enterprise systems through the existing Enterprise Service Bus (ESB).

```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│    T24     │    │  SnapView  │    │  QCB KYC   │    │    DMS     │    │   RISK     │
│Core Banking│    │ Reporting  │    │    API     │    │ Documents  │    │  ENGINE    │
└─────┬──────┘    └─────┬──────┘    └─────┬──────┘    └─────┬──────┘    └─────┬──────┘
      │                 │                 │                 │                 │
      └─────────────────┴────────┬────────┴─────────────────┴─────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  ESB Integration Layer  │
                    │  (Enterprise Service Bus)│
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  FLOW Workflow Platform  │
                    │  (EDD Case Management)  │
                    └────────────┬────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
     ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
     │ Email/SMS   │     │ Audit Log   │     │ Mobile Push │
     │ Notifications│     │  System     │     │ Notifications│
     └─────────────┘     └─────────────┘     └─────────────┘
```

## 18.2 Integration Points — Detailed

| # | Source System | Purpose | Protocol | Direction | Authentication | SLA |
|---|-------------|---------|----------|-----------|----------------|-----|
| 1 | **T24 Core Banking** | Customer master data, accounts, risk classification, KYC dates, writeback | ESB/REST/SOAP | Bidirectional | API Key + JWT | < 2 sec |
| 2 | **SnapView / Snapshot** | Salary data, income analysis, transaction patterns, balance history | ETL/REST API | Read-Only | Service Account | < 3 sec |
| 3 | **QCB KYC API** | Passport verification, ID card, certificates, address proof | REST API (HTTPS) | Read-Only | OAuth 2.0 | < 5 sec |
| 4 | **DMS** | Document upload, retrieval, version management, metadata | REST API (HTTPS) | Bidirectional | JWT | < 2 sec |
| 5 | **Risk Dataset** | AML screening results, PEP lists, sanctions data | Internal DB | Read-Only | Service Account | < 1 sec |
| 6 | **Email Server** | Staff notifications, escalation alerts | SMTP | Write-Only | Service Account | Best effort |
| 7 | **SMS Gateway** | SLA warnings, urgent escalation alerts | REST API | Write-Only | API Key | Best effort |
| 8 | **Mobile Banking** | Customer push notifications | REST API (HTTPS) | Write-Only | JWT | Best effort |

## 18.3 T24 Data Mapping — Key Fields

| T24 Field | EDD Form Section | Direction | Description |
|-----------|-----------------|-----------|-------------|
| CUST_NAME | Section 2.1 | T24 → EDD | Customer full name |
| RM_NUMBER | Section 2.2 | T24 → EDD | Relationship ID Master |
| CUST_SEGMENT | Routing Logic | T24 → EDD | Mass / Tamayuz / Private |
| RISK_CLASS | Section 1.6 | T24 → EDD | High / Medium / Low |
| PEP_FLAG | Section 9.1 | T24 → EDD | PEP indicator |
| DOB | Section 2.4 | T24 → EDD | Date of birth |
| EDD_STATUS | — | EDD → T24 | Completed / Pending / Expired |
| EDD_DECISION | — | EDD → T24 | Approved / Conditional / Rejected |
| EDD_NEXT_DUE | — | EDD → T24 | Next scheduled EDD review date |
| ACCT_RESTRICTION | — | EDD → T24 | Account restriction code |

## 18.4 Re-KYC Alignment

The EDD system is designed to complement (not duplicate) the Re-KYC process:

| Aspect | Re-KYC | EDD |
|--------|--------|-----|
| Trigger | Scheduled periodic review | Event-driven (high risk, PEP, alert) |
| Scope | All customers | Selected high-risk customers |
| Review Depth | Standard review | Enhanced, in-depth review |
| Data Sharing | T24 customer profile | Shared — no duplicate collection |
| Interaction | Re-KYC finding may trigger EDD | EDD completion updates Re-KYC records |

---

# SECTION 19: AUDIT TRAIL REQUIREMENTS

## 19.1 Audit Trail Principles

The EDD system maintains a complete, immutable, tamper-resistant audit trail that records every action, decision, and state change throughout the lifecycle of each EDD case.

**Regulatory Alignment:**
- **ISO 27001:2022 Annex A.8.15** — Logging and Monitoring
- **FATF Recommendation 11** — Record Keeping (minimum 7-year retention)
- **COBIT 2019 DSS05.04** — Identity and Access Management audit

## 19.2 Auditable Events

| # | Event Category | Examples | Stored Data |
|---|---------------|----------|-------------|
| 1 | Case Lifecycle | Case created, assigned, escalated, closed | Case ID, timestamp, actor, action |
| 2 | Form Changes | Field modified, section completed | Field name, old value, new value, actor |
| 3 | Document Actions | Uploaded, verified, rejected, replaced | Document ID, action, actor, timestamp |
| 4 | Workflow Transitions | Stage change, approval, rejection, rework | Previous state, new state, actor, reason |
| 5 | Decision Events | Approved, rejected, escalated, conditionally approved | Decision, rationale, authority level |
| 6 | Access Events | Login, logout, case viewed, report exported | User ID, IP address, action, timestamp |
| 7 | System Events | SLA warning, auto-escalation, notification sent | Event type, trigger, recipients |

## 19.3 Audit Entry Structure

Each audit entry contains the following fields:

| Field | Description | Example |
|-------|-------------|---------|
| Entry ID | Unique sequential identifier | AUD-2026-00001 |
| Timestamp | ISO 8601 timestamp with timezone | 2026-03-10T14:32:15+03:00 |
| Case ID | Associated EDD case | EDD-2026-0047 |
| Actor | User who performed the action | Ahmed Al-Mansouri (EMP-1234) |
| Action | Description of the action | Business Maker Approved |
| Previous State | State before the action | Pending Business Review |
| New State | State after the action | Business Maker Approved |
| Details | Additional context | "Documents verified, recommendation: MAINTAIN" |
| IP Address | Source IP of the action | 10.10.xx.xx |
| Hash | Hash-chain integrity value | QIB00A3F7B2C1D4 |

## 19.4 Hash-Chain Integrity

The audit trail implements a hash-chain mechanism to ensure tamper resistance:

```
HASH CHAIN MECHANISM:

Entry 1: Hash = H(data₁ + GENESIS_BLOCK)
Entry 2: Hash = H(data₂ + Hash₁)
Entry 3: Hash = H(data₃ + Hash₂)
...
Entry N: Hash = H(dataN + HashN₋₁)

VERIFICATION: If any entry is modified, all subsequent hashes become invalid.
              The system can detect tampering by re-computing the chain.

GENESIS BLOCK: 'GENESIS_BLOCK_QIB_EDD_2024'

PRODUCTION NOTE: Hash function shall be SHA-256 (demo uses simplified numeric hash).
```

## 19.5 Integrity Verification

The system provides an integrity verification function accessible to authorized users (Compliance Head, Risk Manager, Internal Audit):

| Feature | Description |
|---------|-------------|
| Verify Chain | Re-computes entire hash chain and confirms integrity |
| Integrity Badge | Displays "Chain Intact ✅" or "Integrity Violation ⚠️" |
| Regulatory Reference | ISO 27001:2022 A.8.15, FATF Rec 11 |
| Verification Log | Each verification run is itself logged in the audit trail |

## 19.6 Retention Policy

| Requirement | Specification | Reference |
|-------------|---------------|-----------|
| Minimum Retention | 7 years from case closure | FATF Rec 11, Qatar Law No. 20/2019 |
| Storage | Encrypted at rest (AES-256) | ISO 27001 A.8.24 |
| Deletion Policy | No manual deletion permitted; system-managed archival only | FATF Rec 11 |
| Access to Archived Records | Read-only access for authorized audit/compliance personnel | — |

---

# SECTION 20: SECURITY REQUIREMENTS

## 20.1 Authentication & Session Management

| Requirement | Specification | Reference |
|-------------|---------------|-----------|
| Authentication | JWT tokens + Multi-Factor Authentication (MFA) | ISO 27001 A.8.5 |
| Password Policy | Min 12 chars, uppercase, lowercase, digit, special char | ISO 27001 A.5.17 |
| Session Timeout | Automatic logout after 15 minutes of inactivity | ISO 27001 A.8.5 |
| Concurrent Sessions | Only one active session per user (new login terminates old) | ISO 27001 A.8.5 |
| Failed Login Lockout | Account locked after 5 consecutive failed attempts | ISO 27001 A.8.5 |
| OTP Verification | 6-digit OTP for high-risk actions (approvals, escalations) | QCB AML/CFT |

## 20.2 Data Protection

| Requirement | Specification | Reference |
|-------------|---------------|-----------|
| Encryption at Rest | AES-256 for all stored data | ISO 27001 A.8.24 |
| Encryption in Transit | TLS 1.3 for all API and web communication | ISO 27001 A.8.24 |
| Key Management | HSM-based key management for production environment | ISO 27001 A.8.24 |
| Data Masking | PII fields masked in logs and non-production environments | ISO 27001 A.8.11 |
| Backup Encryption | All backups encrypted with separate key | ISO 27001 A.8.13 |

## 20.3 Network Security

| Requirement | Specification | Reference |
|-------------|---------------|-----------|
| Network Segmentation | EDD system in dedicated VLAN with firewall rules | ISO 27001 A.8.22 |
| WAF | Web Application Firewall for all external-facing endpoints | ISO 27001 A.8.23 |
| DDoS Protection | Rate limiting and DDoS mitigation on all API endpoints | ISO 27001 A.8.20 |
| IP Whitelisting | QCB KYC API access restricted to registered IPs | QCB Requirements |

## 20.4 Application Security

| Requirement | Specification | Reference |
|-------------|---------------|-----------|
| Input Validation | Server-side validation for all form fields (see Section 15.13) | ISO 27001 A.8.26 |
| SQL Injection Prevention | Parameterized queries; no dynamic SQL | ISO 27001 A.8.26 |
| XSS Prevention | Content Security Policy headers; output encoding | ISO 27001 A.8.26 |
| CSRF Protection | Anti-CSRF tokens on all state-changing operations | ISO 27001 A.8.26 |
| API Rate Limiting | Max 100 requests/minute per user; 1000/minute per service | ISO 27001 A.8.20 |

---

# SECTION 21: COMPLIANCE AND REGULATORY ALIGNMENT

## 21.1 Regulatory Framework Mapping

The EDD Digital Case Management System is designed to comply with the following international and national regulatory frameworks:

| # | Framework | Standard | Applicability to EDD System |
|---|-----------|----------|---------------------------|
| 1 | **FATF Recommendation 10** | Customer Due Diligence | All CDD/EDD data collection, verification, and ongoing monitoring |
| 2 | **FATF Recommendation 11** | Record Keeping | Audit trail, data retention (7 years), document archival |
| 3 | **FATF Recommendation 12** | Politically Exposed Persons | PEP identification, enhanced due diligence, senior management approval |
| 4 | **FATF Recommendation 16** | Wire Transfers | International wire transfer threshold monitoring |
| 5 | **FATF Recommendation 20** | Suspicious Transaction Reporting | Financial threshold monitoring, STR triggers |
| 6 | **FATF Recommendation 22** | DNFBPs — Customer Due Diligence | Extended CDD for designated non-financial businesses |
| 7 | **Basel Committee BCBS 239** | Risk Data Aggregation | Risk data quality, completeness, timeliness, accuracy |
| 8 | **ISO 27001:2022** | Information Security Management | Access control, logging, encryption, incident response |
| 9 | **ISO 27001:2022 A.5.1** | Information Security Policies | Policy-driven security governance |
| 10 | **ISO 27001:2022 A.8.5** | Secure Authentication | MFA, session management, password policy |
| 11 | **ISO 27001:2022 A.8.15** | Logging and Monitoring | Tamper-resistant audit trail, hash-chain integrity |
| 12 | **ISO 27001:2022 A.8.24** | Cryptography | AES-256 encryption, TLS 1.3, key management |
| 13 | **COBIT 2019 DSS05** | Manage Security Services | Identity management, access control, audit logging |
| 14 | **COBIT 2019 APO13** | Manage Security | Information security management system alignment |
| 15 | **QCB AML/CFT Regulatory Framework** | National Compliance | All CDD/EDD processes, STR reporting, sanctions screening |
| 16 | **QCB Circular No. 71/2022** | CDD Timeliness | SLA enforcement, case processing timelines |
| 17 | **Qatar Law No. 20 of 2019** | Anti-Money Laundering | AML/CTF obligations, customer identification, beneficial ownership |

## 21.2 Regulatory Compliance Matrix

| Control Category | Framework Reference | System Implementation |
|-----------------|---------------------|----------------------|
| Customer Identification | FATF Rec 10, QCB AML | EDD Form Sections 1–2 |
| Source of Funds/Wealth | FATF Rec 10, 20 | EDD Form Section 4 |
| PEP Screening | FATF Rec 12 | EDD Form Section 9, Compliance Review |
| Transaction Monitoring | FATF Rec 20 | Section 6 + Financial Threshold Alerts |
| Record Keeping (7yr) | FATF Rec 11, ISO A.8.15 | Audit Trail + DMS |
| Maker/Checker Controls | COBIT DSS05.04 | Sections 8, 11 + Workflow Engine |
| Access Control (RBAC) | ISO 27001 A.5.15 | Login + Role System (9 roles) |
| Data Encryption | ISO 27001 A.8.24 | AES-256 / TLS 1.3 |
| Risk Data Aggregation | BCBS 239 | Risk Indicator Panel + SnapView |
| Escalation Governance | QCB AML Framework | 5% Threshold Monitoring |
| Suspicious Transaction | FATF Rec 20, QCB | Financial Threshold Alerts |
| Ongoing Monitoring | FATF Rec 10, 11 | Re-KYC Alignment + Annual Review |
| Wire Transfer Monitoring | FATF Rec 16 | Section 6 Wire Transfer Alerts |
| High-Risk Nationality Governance | QCB AML/CFT, FATF Rec 10 | Nationality Risk List + Maker/Checker |
| High-Risk Occupation Governance | QCB AML/CFT, FATF Rec 10 | Occupation Risk List + Documentation Blocking |

---

# SECTION 22: RISK GOVERNANCE — DATA MANAGEMENT CONTROLS

This section defines the governance framework for managing risk classification reference data used by the EDD Risk Engine. All risk data lists are maintained through controlled processes with dual approval, full audit trail, and regulatory alignment.

**Regulatory Basis:**
- **FATF Recommendation 10** — Customer Due Diligence risk-based approach
- **FATF Recommendation 12** — Enhanced measures for PEP and high-risk categories
- **QCB AML/CFT Regulatory Framework** — Risk classification and monitoring
- **COBIT 2019 DSS05.04** — Dual control / Maker-Checker enforcement
- **ISO 27001:2022 A.8.15** — Logging and monitoring of all data changes
- **BCBS 239** — Risk data accuracy, completeness, and governance

---

## 22.1 High-Risk Nationality Governance

### 22.1.1 Purpose

The system must include a governance-controlled module allowing Risk and Compliance teams to manage the High-Risk Nationality List used in the customer risk engine. This list directly influences:

1. Customer Risk Profile (CRP) scoring in T24
2. EDD case triggering thresholds
3. Escalation routing decisions
4. PEP screening priority levels

### 22.1.2 Management Capabilities

| # | Capability | Description | Authorization |
|---|-----------|-------------|---------------|
| 1 | Manual Update | Add, modify, or deactivate individual nationality entries | Risk Officer (Maker) + Compliance Manager (Checker) |
| 2 | Bulk Upload | Upload nationality list via Excel (.xlsx) or CSV file | Risk Officer (Maker) + Compliance Manager (Checker) |
| 3 | View Current List | Display all active high-risk nationalities with scores | Risk Officer, Compliance Officer, Compliance Manager |
| 4 | View Change History | Display full audit trail of all list modifications | Compliance Manager, Compliance Head, Internal Audit |
| 5 | Export List | Export current active list in Excel or CSV format | Risk Officer, Compliance Manager |

### 22.1.3 Data Structure

Each entry in the High-Risk Nationality List must conform to the following structure:

| Field Name | Column Header | Data Type | Required | Validation Rule |
|-----------|---------------|-----------|----------|----------------|
| Country Code | NATIONAL_COUNTRY | Text (2 chars) | YES | ISO 3166-1 Alpha-2 code |
| Risk Score | COUNTRY_RISK_SCORE | Integer | YES | Range: 1–200 |
| Risk Category | COUNTRY_RISK_CATEGORY | Text | YES | Allowed values: HIGH, MEDIUM, LOW |

### 22.1.4 Initial High-Risk Nationality Dataset

The following nationalities are classified as HIGH risk in the initial system configuration:

| # | Country Code | Country | Risk Score | Risk Category |
|---|-------------|---------|-----------|---------------|
| 1 | YE | Yemen | 150 | HIGH |
| 2 | SD | Sudan | 150 | HIGH |
| 3 | PS | Palestine | 150 | HIGH |
| 4 | IQ | Iraq | 150 | HIGH |
| 5 | DZ | Algeria | 150 | HIGH |
| 6 | TR | Turkey | 150 | HIGH |
| 7 | SY | Syria | 150 | HIGH |
| 8 | ER | Eritrea | 150 | HIGH |
| 9 | IR | Iran | 150 | HIGH |
| 10 | PH | Philippines | 150 | HIGH |
| 11 | TN | Tunisia | 150 | HIGH |
| 12 | ET | Ethiopia | 150 | HIGH |
| 13 | SO | Somalia | 150 | HIGH |
| 14 | LB | Lebanon | 150 | HIGH |
| 15 | AF | Afghanistan | 150 | HIGH |
| 16 | LY | Libya | 150 | HIGH |
| 17 | NP | Nepal | 150 | HIGH |
| 18 | PK | Pakistan | 150 | HIGH |
| 19 | EG | Egypt | 150 | HIGH |
| 20 | JO | Jordan | 150 | HIGH |
| 21 | RU | Russia | 150 | HIGH |
| 22 | NG | Nigeria | 150 | HIGH |
| 23 | CN | China | 150 | HIGH |
| 24 | IN | India | 150 | HIGH |
| 25 | US | United States | 150 | HIGH |
| 26 | GB | United Kingdom | 150 | HIGH |
| 27 | AU | Australia | 150 | HIGH |
| 28 | FR | France | 150 | HIGH |

**Note:** This list is maintained through governance controls and may be updated by authorized Risk/Compliance personnel through the Maker/Checker workflow described in Section 22.5.

---

## 22.2 High-Risk Occupation Governance

### 22.2.1 Purpose

The system must include a governance-controlled list of High-Risk Occupations used during KYC and EDD reviews. This list determines:

1. Whether additional documentation is required before account activation
2. Enhanced monitoring triggers for specific occupation types
3. Risk score contribution to the overall Customer Risk Profile

### 22.2.2 Occupation-Based Account Blocking Rule

Customers selecting any occupation from the High-Risk Occupation List must provide supporting documentation **before account activation**. This rule applies to:

| # | Account Type | Blocking Enforced | Documentation Required |
|---|-------------|-------------------|----------------------|
| 1 | Current Accounts | YES | Proof of business, income verification |
| 2 | Savings Accounts | YES | Proof of business, income verification |
| 3 | Investment Accounts | YES | Proof of business, income verification, source of wealth |
| 4 | Any other customer account type | YES | Proof of business, income verification |

**System Enforcement:** Account opening or KYC completion must **not proceed** until supporting evidence is uploaded and verified by the reviewing officer.

### 22.2.3 Required Documentation for High-Risk Occupations

When a customer selects an occupation categorized as HIGH risk, the system must require the following mandatory documentation:

| # | Document Type | Description | Mandatory |
|---|-------------|-------------|-----------|
| 1 | Proof of Business Activity | Evidence of active business operations or employment in the declared field | YES |
| 2 | Commercial Registration or License | Valid CR/license from the relevant authority (if applicable to the occupation) | Conditional |
| 3 | Income Verification | Salary certificate, tax return, bank statements, or audited financials | YES |
| 4 | Supporting Documents | Additional documents validating the legitimacy of the declared occupation | YES |

**Blocking Rule:** Without the required documentation, the system must **block KYC completion** and prevent the case from advancing to the next workflow stage.

### 22.2.4 Data Structure

Each entry in the High-Risk Occupation List must conform to the following structure:

| Field Name | Column Header | Data Type | Required | Validation Rule |
|-----------|---------------|-----------|----------|----------------|
| Occupation Description | OCCUP_DESC | Text (max 200 chars) | YES | Free text — must not be empty |
| Occupation Risk Score | OCCP_RISK_SCORE | Integer | YES | Range: 1–200 |
| Occupation Risk Category | OCCP_RISK_CATEGORY | Text | YES | Allowed values: HIGH, MEDIUM, LOW |

### 22.2.5 Management Capabilities

| # | Capability | Description | Authorization |
|---|-----------|-------------|---------------|
| 1 | Manual Entry/Update | Add, modify, or deactivate individual occupation entries | Risk Officer (Maker) + Compliance Manager (Checker) |
| 2 | Bulk Upload | Upload occupation list via Excel (.xlsx) or CSV file | Risk Officer (Maker) + Compliance Manager (Checker) |
| 3 | View Current List | Display all active high-risk occupations with scores | Risk Officer, Compliance Officer, Compliance Manager |
| 4 | View Change History | Display full audit trail of all list modifications | Compliance Manager, Compliance Head, Internal Audit |
| 5 | Export List | Export current active list in Excel or CSV format | Risk Officer, Compliance Manager |

---

## 22.3 High-Risk Occupation Dataset

The following occupations are classified as HIGH risk in the initial system configuration:

| # | Occupation Description | Risk Score | Risk Category |
|---|----------------------|-----------|---------------|
| 1 | Broker (Financial Broker) | 90 | HIGH |
| 2 | High Ranking Military Officials | 100 | HIGH |
| 3 | High Ranking Government Officials | 100 | HIGH |
| 4 | Broker (Real Estate) | 90 | HIGH |
| 5 | Diplomatic Officials | 100 | HIGH |
| 6 | Technology Solutions Provider | 80 | HIGH |
| 7 | High Ranking MOI Officials | 100 | HIGH |
| 8 | Minister | 100 | HIGH |
| 9 | Consultant | 90 | HIGH |
| 10 | Custom Officer | 100 | HIGH |
| 11 | Media Producer | 80 | HIGH |
| 12 | Car Dealer | 90 | HIGH |
| 13 | Coffee Shop Owner | 100 | HIGH |
| 14 | Financial Consultant | 80 | HIGH |
| 15 | Restaurant Owner | 80 | HIGH |
| 16 | Lawyer / Attorney | 90 | HIGH |
| 17 | Cattle / Camel Trading | 80 | HIGH |
| 18 | Antiques Trader / Collector | 100 | HIGH |
| 19 | Hotel Owner | 100 | HIGH |
| 20 | Exchange House Owner | 80 | HIGH |
| 21 | Artist | 80 | HIGH |
| 22 | Lawyer | 90 | HIGH |

**Note:** This list is maintained through governance controls and may be updated by authorized Risk/Compliance personnel through the Maker/Checker workflow described in Section 22.5.

---

## 22.4 Bulk Upload Specification

### 22.4.1 File Format Requirements

| Parameter | Specification |
|-----------|--------------|
| Supported Formats | Excel (.xlsx), CSV (.csv) |
| Encoding | UTF-8 (for CSV) |
| Maximum File Size | 5 MB |
| Maximum Rows per Upload | 500 |
| Header Row | Required — must match column headers exactly |

### 22.4.2 Nationality Upload File Structure

| Column # | Header | Data Type | Required | Validation |
|----------|--------|-----------|----------|------------|
| 1 | NATIONAL_COUNTRY | Text (2) | YES | ISO 3166-1 Alpha-2 |
| 2 | COUNTRY_RISK_SCORE | Integer | YES | 1–200 |
| 3 | COUNTRY_RISK_CATEGORY | Text | YES | HIGH, MEDIUM, LOW |

### 22.4.3 Occupation Upload File Structure

| Column # | Header | Data Type | Required | Validation |
|----------|--------|-----------|----------|------------|
| 1 | OCCUP_DESC | Text (200) | YES | Non-empty |
| 2 | OCCP_RISK_SCORE | Integer | YES | 1–200 |
| 3 | OCCP_RISK_CATEGORY | Text | YES | HIGH, MEDIUM, LOW |

### 22.4.4 Upload Processing Rules

| # | Rule | Description |
|---|------|-------------|
| 1 | Pre-Validation | System validates file structure, column headers, and data types before processing |
| 2 | Duplicate Detection | System flags duplicate entries (same country code or occupation description) |
| 3 | Error Report | Invalid rows are rejected with detailed error messages; valid rows are staged for approval |
| 4 | Partial Upload | System supports partial upload — valid entries are staged, invalid entries are reported |
| 5 | Staging | All uploaded entries enter a Pending Approval state and require Checker approval |
| 6 | Rollback | If Checker rejects, all staged entries from the upload are discarded |

---

## 22.5 Maker / Checker Dual Approval Control

### 22.5.1 Governance Principle

All updates to the following risk data lists must follow dual approval (Maker/Checker) control:

| # | Risk Data List | Maker Role | Checker Role |
|---|---------------|-----------|-------------|
| 1 | High-Risk Nationality List | Risk Officer | Compliance Manager |
| 2 | High-Risk Occupation List | Risk Officer | Compliance Manager |

### 22.5.2 Workflow

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│   MAKER        │     │   PENDING      │     │   CHECKER      │
│                │     │   APPROVAL     │     │                │
│ Creates or     │────▶│ Change staged  │────▶│ Reviews and    │
│ uploads change │     │ (not active)   │     │ approves/      │
│                │     │                │     │ rejects        │
└────────────────┘     └────────────────┘     └────────┬───────┘
                                                       │
                                              ┌────────┴───────┐
                                              │                │
                                        ┌─────▼─────┐   ┌─────▼─────┐
                                        │ APPROVED  │   │ REJECTED  │
                                        │           │   │           │
                                        │ Changes   │   │ Changes   │
                                        │ activated │   │ discarded │
                                        │ in risk   │   │ Maker     │
                                        │ engine    │   │ notified  │
                                        └───────────┘   └───────────┘
```

### 22.5.3 Control Rules

| # | Rule | Enforcement |
|---|------|-------------|
| 1 | Maker ≠ Checker | System prevents the same user from both creating and approving a change |
| 2 | Pending Changes Not Active | Changes remain inactive until Checker approval is obtained |
| 3 | Only Approved Changes Become Active | Only Checker-approved entries are applied to the risk engine |
| 4 | Rejection Requires Reason | Checker must provide a written reason when rejecting a change |
| 5 | Notification on Action | Maker is notified when Checker approves or rejects the change |
| 6 | Escalation on Delay | If Checker does not act within 24 hours, the request is escalated to Compliance Head |

---

## 22.6 Audit Trail for Risk Data Changes

### 22.6.1 Auditable Events

Every change to the High-Risk Nationality List or High-Risk Occupation List must be recorded in the audit trail. The following events are logged:

| # | Event | Description |
|---|-------|-------------|
| 1 | Entry Created | New nationality or occupation record added |
| 2 | Entry Modified | Existing record updated (score, category, or description change) |
| 3 | Entry Deactivated | Record removed from active list (soft delete) |
| 4 | Bulk Upload Initiated | File upload started with row count |
| 5 | Bulk Upload Validated | Pre-validation completed with pass/fail count |
| 6 | Change Approved | Checker approved a pending change |
| 7 | Change Rejected | Checker rejected a pending change with reason |
| 8 | List Exported | Current active list exported by a user |

### 22.6.2 Audit Entry Structure

Each audit entry for risk data changes must include:

| Field | Description | Example |
|-------|-------------|---------|
| Entry ID | Unique sequential identifier | RDA-2026-00001 |
| Timestamp | ISO 8601 timestamp with timezone | 2026-03-10T14:32:15+03:00 |
| User ID | Employee ID of the actor | EMP-1234 |
| Department | Department of the actor | Risk Management |
| Action Performed | Description of the action | Modified COUNTRY_RISK_SCORE |
| List Type | NATIONALITY or OCCUPATION | NATIONALITY |
| Record Identifier | Country code or occupation description | YE |
| Previous Value | Value before the change | Risk Score: 120 |
| New Value | Value after the change | Risk Score: 150 |
| IP Address | Source IP address of the actor | 10.10.xx.xx |
| Approval Status | PENDING / APPROVED / REJECTED | APPROVED |
| Approver ID | Employee ID of the Checker (if approved) | EMP-5678 |

### 22.6.3 Retention and Integrity

| Requirement | Specification | Reference |
|-------------|---------------|-----------|
| Minimum Retention | 7 years from date of change | FATF Rec 11, Qatar Law No. 20/2019 |
| Immutability | Audit entries cannot be modified or deleted | ISO 27001 A.8.15 |
| Hash-Chain Integrity | Risk data audit entries are linked to the system-wide hash chain | ISO 27001 A.8.15 |
| Access Control | Only Compliance Head, Risk Manager, and Internal Audit may view risk data audit logs | COBIT DSS05.04 |

---

# SECTION 23: REPORTING AND DASHBOARD REQUIREMENTS

## 23.1 Dashboard Hierarchy

| # | Dashboard | Primary Users | Purpose |
|---|-----------|--------------|---------|
| 1 | Operational Dashboard | Business Officers, CDD Officers | My queue, case status, SLA tracking |
| 2 | Management Dashboard | CDD Manager, Business Head | Team performance, SLA compliance, workload |
| 3 | Compliance Dashboard | Compliance Officers, Compliance Manager | PEP cases, escalations, regulatory metrics |
| 4 | Risk Governance Dashboard | Risk Management Head, Compliance Head | Enterprise risk indicators, escalation analytics |
| 5 | Executive Dashboard | Senior Management, Board | Strategic KPIs, trend analysis |

## 23.2 Operational Dashboard Requirements

| Widget | Description | Update Frequency |
|--------|-------------|-----------------|
| My Case Queue | Assigned cases with SLA countdown timers | Real-time |
| Cases by Stage | Distribution of cases across workflow stages | Real-time |
| SLA Compliance | RAG indicators (Red/Amber/Green) per case | Real-time |
| Recent Activity | Timeline of recent actions on assigned cases | Real-time |
| Document Pending | Cases with missing or unverified documents | Daily |

## 23.3 Management Dashboard Requirements

| Widget | Description | Update Frequency |
|--------|-------------|-----------------|
| Team Workload | Case distribution across team members | Real-time |
| SLA Performance | Percentage of cases within SLA (target: 98%) | Hourly |
| Cases by Segment | Distribution: Mass, Tamayuz, Private | Real-time |
| Average Processing Time | Mean case duration by stage and segment | Daily |
| Rework Rate | Percentage of cases returned for rework | Daily |

## 23.4 Compliance Dashboard Requirements

| Widget | Description | Update Frequency |
|--------|-------------|-----------------|
| PEP Case Tracker | Active PEP-related EDD cases | Real-time |
| Escalation Rate Monitor | Current escalation rate vs. 5% threshold | Real-time |
| 6-Month Escalation Trend | Bar chart showing monthly escalation rates | Monthly |
| Escalation by Reason | Breakdown: PEP, Cash, Sanctions, Documents | Monthly |
| Sanctions Screening Queue | Cases pending sanctions screening | Real-time |

## 23.5 Risk Governance Dashboard Requirements

| Widget | Description | Update Frequency |
|--------|-------------|-----------------|
| Enterprise Risk Heat Map | Customer risk score distribution (0–240) | Daily |
| High-Risk Customer Count | Number of active high-risk customers | Real-time |
| Expired KYC Tracking | Customers with overdue KYC renewal | Daily |
| Restricted Accounts | Accounts under restriction due to EDD decisions | Real-time |
| Regulatory Reporting Status | Status of pending QCB reports | Weekly |

## 23.6 Report Types

| # | Report | Format | Frequency | Distribution |
|---|--------|--------|-----------|-------------|
| 1 | EDD Case Summary | PDF/Excel | On-demand | Business, CDD |
| 2 | SLA Compliance Report | PDF | Weekly | Management |
| 3 | Escalation Analysis | PDF | Monthly | Compliance, Risk |
| 4 | PEP Case Report | PDF | Monthly | Compliance Head |
| 5 | Audit Trail Extract | CSV/Excel | On-demand | Internal Audit |
| 6 | QCB Regulatory Report | Structured file | As required | Compliance → QCB |
| 7 | Risk Indicator Summary | PDF | Monthly | Risk Management |

---

# SECTION 24: CHANGE MANAGEMENT AND FEEDBACK MODULE

## 24.1 Purpose

The system includes a structured Change Management and Feedback Module that enables users across all departments to submit suggestions, improvement requests, and process feedback. This ensures continuous improvement of the EDD workflow and captures operational insights from front-line users.

## 24.2 Feedback Submission

| Feature | Description |
|---------|-------------|
| Access | Floating feedback button available on all EDD case screens |
| Submission Method | Modal form with categorized fields |
| Audit Integration | Every feedback submission is logged in the audit trail |
| Routing | Submitted to Change Management team for review |

## 24.3 Feedback Categories

| # | Category | Description |
|---|----------|-------------|
| 1 | Workflow Improvement | Suggestions to optimize workflow stages or routing |
| 2 | Form Field Enhancement | Requests to add, modify, or remove form fields |
| 3 | Compliance Process | Suggestions related to compliance review procedures |
| 4 | User Interface | UI/UX improvement requests |
| 5 | System Integration | Requests for new or enhanced system integrations |
| 6 | Other | General feedback not covered by above categories |

## 24.4 Feedback Priority Levels

| Priority | Description | Expected Response Time |
|----------|-------------|----------------------|
| 🟢 Low | Nice-to-have improvement | Within 30 days |
| 🟡 Medium | Operational enhancement | Within 14 days |
| 🔴 High | Critical issue or regulatory gap | Within 5 business days |

## 24.5 Feedback Lifecycle

```
Submitted → Acknowledged → Under Review → Approved/Rejected → Implemented → Closed
```

| Stage | Actor | SLA |
|-------|-------|-----|
| Submission | End User | Immediate |
| Acknowledgment | Change Management Team | 2 business days |
| Review | Change Management + IT | 7 business days |
| Approval Decision | Change Advisory Board | 14 business days |
| Implementation | IT Development | Per project plan |
| Closure | Change Management | Post-deployment verification |

## 24.6 Change Request (CR) Process

For material changes that impact scope, workflow, or regulatory alignment:

1. Feedback escalated to formal Change Request (CR)
2. CR assessed for impact (technical, business, regulatory)
3. CR presented to Change Advisory Board
4. If approved, BRD updated and re-circulated for approval
5. Implementation scheduled per project roadmap

---

# SECTION 25: NON-FUNCTIONAL REQUIREMENTS

| # | Requirement | Specification | Regulatory Reference |
|---|------------|---------------|---------------------|
| 1 | System Availability | 99.5% uptime (excluding planned maintenance) | ISO 27001:2022 A.8.14 — Redundancy |
| 2 | API Response Time | < 2 seconds for T24/DMS calls | BCBS 239 — Timeliness Principle |
| 3 | Page Load Time | < 3 seconds for dashboard and case views | — |
| 4 | Peak Throughput | 100 EDD cases/hour concurrent processing | QCB AML — Operational Capacity |
| 5 | Audit Retention | 7 years from case closure | FATF Rec 11, Qatar Law No. 20/2019 |
| 6 | Data Encryption | AES-256 at rest, TLS 1.3 in transit | ISO 27001:2022 A.8.24 |
| 7 | Authentication | JWT + MFA for all users | ISO 27001:2022 A.8.5 |
| 8 | Backup | Hourly incremental, daily full backup | ISO 27001:2022 A.8.13 |
| 9 | Recovery | RTO: 1 hour, RPO: 1 hour | ISO 27001:2022 A.8.14 |
| 10 | Access Control | RBAC with 9 role definitions | COBIT 2019 DSS05.04 |
| 11 | Audit Integrity | Hash-chain tamper-resistant logging | ISO 27001:2022 A.8.15, FATF Rec 11 |
| 12 | Escalation Threshold | ≤ 5% of cases should escalate | QCB AML/CFT Monitoring Framework |
| 13 | Form Validation | Enterprise field validation engine | FATF Rec 10, BCBS 239 |
| 14 | Session Security | Auto-timeout (15 min), concurrent session prevention | ISO 27001:2022 A.8.5 |
| 15 | Scalability | Support 500+ concurrent users | — |
| 16 | Browser Compatibility | Chrome 90+, Edge 90+, Safari 14+, Firefox 90+ | — |
| 17 | Localization | Bilingual support: English and Arabic (RTL) | QCB Requirement |
| 18 | Accessibility | WCAG 2.1 Level AA compliance | — |
| 19 | Risk Data Governance | Maker/Checker dual approval for all risk list changes | COBIT 2019 DSS05.04 |
| 20 | Bulk Upload Validation | Pre-validation of file structure before risk data processing | BCBS 239 |
| 21 | Occupation-Based Blocking | KYC completion blocked for high-risk occupations without documentation | QCB AML/CFT, FATF Rec 10 |

---

# SECTION 26: ASSUMPTIONS

| # | Assumption | Impact if Invalid |
|---|-----------|-------------------|
| 1 | FLOW Workflow Platform is available and operational | Project cannot proceed; alternative platform evaluation required |
| 2 | T24 Core Banking integration via ESB is established | Customer data cannot be auto-populated; manual entry fallback |
| 3 | DMS is accessible for document storage/retrieval | Document management through alternative file storage |
| 4 | SnapView/Snapshot reporting is available for financial analytics | Financial indicators panel will have limited data |
| 5 | QCB KYC API access is provisioned | External document verification will be manual |
| 6 | Email/SMS notification infrastructure is operational | Notification delivery through alternative channels |
| 7 | All departments have been briefed on the new process | User adoption delays; additional training required |
| 8 | IT resources are available for integration development | Project timeline extension |
| 9 | QCB does not introduce new AML regulations during development | Scope change; BRD revision required |
| 10 | Existing RBAC framework in FLOW supports 9 role definitions | Custom role management development required |
| 11 | Network infrastructure supports VLAN segmentation for EDD | Alternative security controls required |

---

# SECTION 27: RISKS AND MITIGATION

| # | Risk | Probability | Impact | Mitigation Strategy |
|---|------|-------------|--------|-------------------|
| 1 | T24 ESB integration delays | Medium | High | Early integration PoC in Phase 1; fallback to manual data entry |
| 2 | QCB KYC API access not provisioned in time | Low | Medium | Proceed without API; add integration in Phase 2 |
| 3 | User resistance to new digital workflow | Medium | Medium | Change management program; department champions; training |
| 4 | SLA targets too aggressive for initial deployment | Low | Low | Gradual SLA tightening; monitor actuals in Phase 1 |
| 5 | Regulatory change during development | Low | High | Modular design; configurable rules engine; change buffer |
| 6 | FLOW platform performance under load | Low | High | Performance testing in Phase 1; capacity planning |
| 7 | Data quality issues in T24 customer records | Medium | Medium | Data cleansing exercise pre-deployment; validation rules |
| 8 | Staff availability for UAT | Medium | Medium | UAT schedule agreed with all departments pre-Phase 2 |
| 9 | Security vulnerability in web application | Low | Critical | OWASP Top 10 security testing; penetration testing pre-go-live |
| 10 | Audit trail storage capacity | Low | Medium | Archival strategy; storage capacity planning |

---

# SECTION 28: DEPENDENCIES

## 28.1 Technical Dependencies

| # | Dependency | Owner | Status | Required By |
|---|-----------|-------|--------|-------------|
| 1 | FLOW Workflow Platform availability | IT Infrastructure | Available | Phase 1 start |
| 2 | T24 ESB connectivity | IT Integration | Established | Phase 1 |
| 3 | SnapView/Snapshot API access | IT / Data Warehouse | Available | Phase 1 |
| 4 | QCB KYC API provisioning | IT / Compliance | In progress | Phase 2 |
| 5 | DMS REST API endpoints | IT / DMS Team | Available | Phase 1 |
| 6 | Email/SMS gateway credentials | IT Infrastructure | Available | Phase 1 |
| 7 | SSL certificates for API endpoints | IT Security | To be provisioned | Phase 1 |
| 8 | VLAN segmentation for EDD module | IT Network | To be configured | Phase 1 |

## 28.2 Business Dependencies

| # | Dependency | Owner | Status | Required By |
|---|-----------|-------|--------|-------------|
| 1 | EDD form content approval | CDD Operations + Compliance | Approved | Phase 1 |
| 2 | Role definitions and access approval | Compliance Head | Approved | Phase 1 |
| 3 | SLA targets agreement | All departments | Agreed | Phase 1 |
| 4 | Notification template content | Marketing & Communications | In progress | Phase 2 |
| 5 | User training material | Training / L&D | Not started | Phase 3 |
| 6 | Department champion nominations | All departments | Not started | Phase 2 |

## 28.3 Regulatory Dependencies

| # | Dependency | Owner | Status | Required By |
|---|-----------|-------|--------|-------------|
| 1 | QCB approval of digital EDD process | Compliance | Pending | Pre-go-live |
| 2 | AML policy alignment validation | Compliance + Risk | In progress | Phase 2 |
| 3 | Internal Audit controls review | Internal Audit | Not started | Pre-go-live |

---

# SECTION 29: APPENDIX

## Appendix A: EDD Form — Complete Visual Layout

The EDD form consists of 11 sections organized as follows:

```
┌─────────────────────────────────────────────────────────────────────┐
│                      EDD INVESTIGATION FORM                         │
├─────┬───────────┬─────────────────┬────────────┬───────────────────┤
│ Tab │ EDD Form  │ Documents       │ Comments   │ Approval          │
│     │ (Active)  │                 │ & History  │                   │
├─────┴───────────┴─────────────────┴────────────┴───────────────────┤
│                                                                     │
│  Section 1:  Risk Classification of the Client                     │
│  Section 2:  Customer Information                                   │
│  Section 3:  Purpose and Intended Use of Account                   │
│  Section 4:  Source of Income & Source of Wealth                    │
│  Section 5:  Initial Deposit                                        │
│  Section 6:  Monthly Anticipated Transaction Activity               │
│  Section 7:  Existing Relationships                                 │
│  Section 8:  Related Party                                          │
│  Section 9:  PEP Identification                                     │
│  Section 10: Business Recommendations                               │
│  Section 11: Sign Off Workflow (Maker / Checker)                    │
│                                                                     │
│  [Save as Draft]                [Submit for Approval]               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Appendix B: SLA Matrix

| Stage | Mass SLA | Tamayuz SLA | Private SLA | Auto-Escalation Trigger |
|-------|----------|-------------|-------------|------------------------|
| Business Review | 24 hours | 12 hours | 18 hours | 75% of SLA elapsed |
| CDD Review (Standard) | 24 hours | 24 hours | 24 hours | 75% of SLA elapsed |
| CDD Review (Deep-Dive) | 48 hours | 48 hours | 48 hours | 75% of SLA elapsed |
| Compliance Review | 24 hours | 24 hours | 24 hours | 50% of SLA elapsed |
| Final Decision | 8 hours | 4 hours | 6 hours | 50% of SLA elapsed |
| Customer Response | 7 days | 7 days | 7 days | Day 5 reminder; Day 7 auto-close |

**End-to-End Target:**
- Standard Case: ~80 hours (3.3 days)
- Priority Case (Tamayuz): ~64 hours (2.7 days)
- Overall Target: < 72 hours for standard cases

## Appendix C: Segment Routing Configuration

```
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

## Appendix D: Notification Templates

| # | Event | Channel | Recipients | Content Summary |
|---|-------|---------|-----------|-----------------|
| 1 | Case Created | Email | Assigned RM / Business Officer | New EDD case assigned, customer details, SLA |
| 2 | Case Submitted (Maker→Checker) | Email + In-App | Checker | Case ready for review |
| 3 | Case Returned for Rework | Email + In-App | Maker | Rework required with reason |
| 4 | SLA Warning (75%) | Email + SMS | Assigned user + Manager | SLA approaching deadline |
| 5 | SLA Breach | Email + SMS + Push | Manager + Department Head | SLA exceeded, auto-escalated |
| 6 | Case Escalated to Compliance | Email | Compliance Officer | Escalated case details |
| 7 | Case Approved | Email | RM + CDD Manager | Case decision: Approved |
| 8 | Case Rejected | Email + SMS | RM + CDD Manager + Compliance | Case decision: Rejected |
| 9 | Document Request | Email | Customer (via RM) | Missing documents required |

## Appendix E: Data Sources Summary

| Source System | EDD Form Sections | Data Provided |
|-------------|-------------------|---------------|
| T24 Core Banking | Sections 1, 2, 4, 7 | Customer data, risk classification, employment, accounts |
| QCB KYC API | Sections 2, 9 | Nationality, KYC verification, PEP nationality |
| SnapView / Snapshot | Risk Panel | Salary data, income analysis, transaction patterns, balance history |
| DMS | Documents Tab | Document upload, retrieval, storage, version management |
| Risk Dataset | Risk Panel | AML screening results, PEP lists, sanctions data |
| Manual Entry | Sections 3, 4, 5, 6, 7, 8, 9, 10 | Investigation data, assessments, recommendations |

## Appendix F: Glossary of Business Terms

| Term | Definition |
|------|-----------|
| EDD | Enhanced Due Diligence — In-depth review of high-risk customers beyond standard CDD |
| CDD | Customer Due Diligence — Standard identity verification and risk assessment |
| Maker | Officer who prepares and submits a case for review |
| Checker | Senior officer who reviews and approves/rejects a Maker's submission |
| Escalation | Routing of a case to a higher authority for decision |
| SLA | Service Level Agreement — Maximum time allowed for a workflow stage |
| PEP | Politically Exposed Person — Individual with prominent public function |
| STR | Suspicious Transaction Report — Report filed with regulators for suspicious activity |
| RIM | Relationship Identification Master — Unique customer identifier in T24 |
| ESB | Enterprise Service Bus — Middleware layer connecting enterprise systems |
| FLOW | QIB's enterprise workflow platform |
| T24 | Temenos T24 Core Banking System |
| DMS | Document Management System |
| SnapView | QIB's financial analytics and reporting platform |
| RBAC | Role-Based Access Control — Access permissions based on defined roles |
| Hash-Chain | Cryptographic linking of records to ensure tamper resistance |
| CRP | Customer Risk Profile — Risk classification assigned in T24 core banking |
| Maker/Checker | Dual-control governance model requiring separate users for creation and approval |
| Bulk Upload | Process of uploading multiple data records via Excel or CSV file |
| Risk Data List | Governance-controlled reference data (High-Risk Nationalities, High-Risk Occupations) |
| KYC Blocking | System enforcement preventing KYC completion until mandatory conditions are met |

---

## Appendix G: High-Risk Nationality Reference Dataset

This appendix provides the complete initial High-Risk Nationality list as configured in the system. This list is governed by the Maker/Checker controls defined in Section 22.

| # | NATIONAL_COUNTRY | Country Name | COUNTRY_RISK_SCORE | COUNTRY_RISK_CATEGORY |
|---|-----------------|-------------|-------------------|----------------------|
| 1 | YE | Yemen | 150 | HIGH |
| 2 | SD | Sudan | 150 | HIGH |
| 3 | PS | Palestine | 150 | HIGH |
| 4 | IQ | Iraq | 150 | HIGH |
| 5 | DZ | Algeria | 150 | HIGH |
| 6 | TR | Turkey | 150 | HIGH |
| 7 | SY | Syria | 150 | HIGH |
| 8 | ER | Eritrea | 150 | HIGH |
| 9 | IR | Iran | 150 | HIGH |
| 10 | PH | Philippines | 150 | HIGH |
| 11 | TN | Tunisia | 150 | HIGH |
| 12 | ET | Ethiopia | 150 | HIGH |
| 13 | SO | Somalia | 150 | HIGH |
| 14 | LB | Lebanon | 150 | HIGH |
| 15 | AF | Afghanistan | 150 | HIGH |
| 16 | LY | Libya | 150 | HIGH |
| 17 | NP | Nepal | 150 | HIGH |
| 18 | PK | Pakistan | 150 | HIGH |
| 19 | EG | Egypt | 150 | HIGH |
| 20 | JO | Jordan | 150 | HIGH |
| 21 | RU | Russia | 150 | HIGH |
| 22 | NG | Nigeria | 150 | HIGH |
| 23 | CN | China | 150 | HIGH |
| 24 | IN | India | 150 | HIGH |
| 25 | US | United States | 150 | HIGH |
| 26 | GB | United Kingdom | 150 | HIGH |
| 27 | AU | Australia | 150 | HIGH |
| 28 | FR | France | 150 | HIGH |

**Governance:** All changes to this list require Maker/Checker approval per Section 22.5.

---

## Appendix H: High-Risk Occupation Reference Dataset

This appendix provides the complete initial High-Risk Occupation list as configured in the system. This list is governed by the Maker/Checker controls defined in Section 22.

| # | OCCUP_DESC | OCCP_RISK_SCORE | OCCP_RISK_CATEGORY |
|---|-----------|----------------|-------------------|
| 1 | Broker (Financial Broker) | 90 | HIGH |
| 2 | High Ranking Military Officials | 100 | HIGH |
| 3 | High Ranking Government Officials | 100 | HIGH |
| 4 | Broker (Real Estate) | 90 | HIGH |
| 5 | Diplomatic Officials | 100 | HIGH |
| 6 | Technology Solutions Provider | 80 | HIGH |
| 7 | High Ranking MOI Officials | 100 | HIGH |
| 8 | Minister | 100 | HIGH |
| 9 | Consultant | 90 | HIGH |
| 10 | Custom Officer | 100 | HIGH |
| 11 | Media Producer | 80 | HIGH |
| 12 | Car Dealer | 90 | HIGH |
| 13 | Coffee Shop Owner | 100 | HIGH |
| 14 | Financial Consultant | 80 | HIGH |
| 15 | Restaurant Owner | 80 | HIGH |
| 16 | Lawyer / Attorney | 90 | HIGH |
| 17 | Cattle / Camel Trading | 80 | HIGH |
| 18 | Antiques Trader / Collector | 100 | HIGH |
| 19 | Hotel Owner | 100 | HIGH |
| 20 | Exchange House Owner | 80 | HIGH |
| 21 | Artist | 80 | HIGH |
| 22 | Lawyer | 90 | HIGH |

**Governance:** All changes to this list require Maker/Checker approval per Section 22.5.

**Occupation Control Rule:** Any customer selecting an occupation from this list must provide mandatory documentation (proof of business, commercial registration, income verification) before KYC completion. Without documentation, the system blocks account activation across all account types.

---

## Document Footer

| | |
|---|---|
| **Document ID** | BRD-EDD-FLOW-2026-002 |
| **Version** | 2.1 |
| **Date** | March 10, 2026 |
| **Status** | Submitted for Stakeholder Review |
| **Classification** | Internal — QIB Confidential |
| **© Qatar Islamic Bank (QIB) S.A.Q.** | All rights reserved |
