# EDD Case Management System
# Enterprise Features Specification
## BRD Addendum — Version 2.0

**Document Version:** 2.0  
**Date:** March 2026  
**Classification:** Internal - Operations, Business, IT, Compliance  
**Target Audience:** Business Users, CDD Operations, Compliance, IT Teams, Call Center

---

## 1. Document Overview

This document extends the IT Technical Architecture BRD with comprehensive specifications for enterprise-level features implemented in the EDD Case Management System.

### 1.1 Features Covered

| Section | Feature | Status |
|---------|---------|--------|
| 2 | Role Governance (Maker/Checker) | ✅ Implemented |
| 3 | Financial Profile Display | ✅ Implemented |
| 4 | Expected Activity Profile | ✅ Implemented |
| 5 | Officer Digital Confirmation | ✅ Implemented |
| 6 | Call Center View | ✅ Implemented |
| 7 | User Guide Module | ✅ Implemented |
| 8 | System Presentation | ✅ Implemented |
| 9 | Comments & Recommendations | ✅ Implemented |

---

## 2. Role Governance System

### 2.1 Overview

The EDD System implements a comprehensive Maker/Checker workflow with distinct roles for each processing stage. This ensures four-eyes principle compliance and proper segregation of duties.

### 2.2 Role Definitions

| Role ID | Role Name | Arabic | Description |
|---------|-----------|--------|-------------|
| BUSINESS_MAKER | Business Maker | صانع الأعمال | Creates and submits EDD cases for review |
| BUSINESS_CHECKER | Business Checker | مدقق الأعمال | Reviews and approves business submissions |
| CDD_MAKER | CDD Maker | صانع CDD | Performs CDD review and documentation |
| CDD_CHECKER | CDD Checker | مدقق CDD | Reviews and approves CDD submissions |
| COMPLIANCE_REVIEW | Compliance Review | مراجعة الالتزام | Final review for escalated/suspicious cases |
| CALL_CENTER_VIEW | Call Center View | عرض مركز الاتصال | Read-only customer service access |
| IT_ADMIN | IT Administrator | مدير تقنية المعلومات | System administration |

### 2.3 Permission Matrix

| Permission | BUS_MAKER | BUS_CHECKER | CDD_MAKER | CDD_CHECKER | COMPLIANCE | CALL_CENTER | IT_ADMIN |
|------------|-----------|-------------|-----------|-------------|------------|-------------|----------|
| View Case | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Edit Case | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Business | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve CDD | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Final Decision | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Customer Basic | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Risk Score | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| View AML Flags | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| System Config | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 2.4 Workflow Stages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EDD CASE WORKFLOW                                     │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │ CREATED  │ ← System generates case from T24/CRP trigger
    └────┬─────┘
         │
         ▼
    ┌──────────────────┐
    │ BUSINESS MAKER   │ ← Reviews customer info, collects documents
    │ Segments:        │
    │ • Mass Banking   │
    │ • Tamayuz        │
    │ • Private Banking│
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ BUSINESS CHECKER │ ← Approves/Rejects business review
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ CDD MAKER        │ ← Performs due diligence, risk assessment
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ CDD CHECKER      │ ← Approves/Rejects CDD review
    └────────┬─────────┘
             │
             ├─────────────────────────┐
             │                         │ (If escalation required)
             ▼                         ▼
    ┌──────────────────┐      ┌────────────────────┐
    │ COMPLETED        │      │ COMPLIANCE REVIEW  │
    │ Normal Close     │      │ PEP/High Risk/     │
    │                  │      │ Suspicious         │
    └──────────────────┘      └────────┬───────────┘
                                       │
                                       ▼
                              ┌────────────────────┐
                              │ FINAL DECISION     │
                              │ • Approved         │
                              │ • Enhanced Monitor │
                              │ • Account Freeze   │
                              │ • Escalate Legal   │
                              └────────────────────┘
```

### 2.5 Escalation Criteria

Cases must escalate to Compliance Review when:

| Condition | Trigger |
|-----------|---------|
| PEP Status | Any customer flagged as PEP |
| Sanctioned Country | Customer nationality or transactions involving sanctioned countries |
| AUTO HIGH Risk | FINAL_RISK_CATEG = 'AUTO HIGH' |
| Flag for Suspicion | Manual flag by CDD Checker |
| High Risk Score | FINAL_RISK_SCORE > 400 |
| Adverse Media | Negative media screening results |
| STR Indicator | Suspicious Transaction Report consideration |

---

## 3. Financial Profile Display

### 3.1 Overview

The Financial Profile panel displays customer income and salary information sourced from ETL/SnapView datasets. All field names are preserved exactly as defined in the ETL schema.

### 3.2 Data Fields

| Field Name | Source | Description | Format |
|------------|--------|-------------|--------|
| SALARY | ETL/SnapView | Current monthly salary | Number (QAR) |
| ANNUAL_INC | ETL/SnapView | Annual income | Number (QAR) |
| SEC_INC_AMT | ETL/SnapView | Secondary income amount | Number (QAR) |
| SEC_INC_SOURCE | ETL/SnapView | Source of secondary income | Text |
| LAST_SAL_DA | ETL/SnapView | Date of last salary credit | Date (YYYY-MM-DD) |
| LAST_SAL_AMT | ETL/SnapView | Amount of last salary credit | Number (QAR) |
| LAST_MON_SALARY | ETL/SnapView | Previous month's salary | Number (QAR) |
| AVG_LAST_3_SALARY | Calculated | Average of last 3 months' salary | Number (QAR) |
| SALARY_VARIANCE_PCT | Calculated | Variance percentage | Decimal |
| SALARY_HISTORY | ETL/SnapView | Array of last 3 months | Array |

### 3.3 UI Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 💰 Financial Profile                              Source: ETL / SnapView    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   SALARY   │  │ ANNUAL_INC │  │ SEC_INC_AMT│  │AVG_LAST_3  │           │
│  │   450,000  │  │ 5,400,000  │  │   150,000  │  │   448,000  │           │
│  │  Monthly   │  │   Yearly   │  │ Investment │  │ Variance:  │           │
│  │            │  │            │  │  Returns   │  │   2.3%     │           │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘           │
│                                                                             │
│  Last Salary Received              Salary History (Last 3 Months)          │
│  ┌──────────────────────┐         ┌────────────────────────────────────┐  │
│  │ LAST_SAL_DA   │2024-02-28│     │ Month    │ Amount   │ Date Credit  │  │
│  │ LAST_SAL_AMT  │  452,000 │     │ 2024-02  │ 452,000  │ 2024-02-28   │  │
│  │ LAST_MON_SAL  │  450,000 │     │ 2024-01  │ 448,000  │ 2024-01-30   │  │
│  └──────────────────────┘         │ 2023-12  │ 444,000  │ 2023-12-28   │  │
│                                   └────────────────────────────────────┘  │
│                                                                             │
│  DATA_SOURCE: ETL/SnapView                    Last Updated: 2024-02-28     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Business Rules

| Rule ID | Description | Action |
|---------|-------------|--------|
| FP-001 | Salary variance > 10% | Flag for review |
| FP-002 | No salary credit > 3 months | Alert to reviewer |
| FP-003 | Secondary income > primary | Source verification required |
| FP-004 | Salary inconsistent with segment | Risk assessment trigger |

---

## 4. Expected Activity Profile

### 4.1 Overview

The Expected Activity panel displays the customer's declared expected monthly activity, sourced from the Risk Dataset. This information is critical for transaction monitoring comparison.

### 4.2 Data Fields

| Field Name | Source | Description | Format |
|------------|--------|-------------|--------|
| LM_EXP_CASH | Risk Dataset | Expected monthly cash activity | Number (QAR) |
| LM_EXP_NONCASH | Risk Dataset | Expected monthly non-cash activity | Number (QAR) |
| LM_EXP_TRFR | Risk Dataset | Expected monthly transfers | Number (QAR) |
| EXP_INWARD_CASH | Risk Dataset | Expected inward cash | Number (QAR) |
| EXP_OUTWARD_CASH | Risk Dataset | Expected outward cash | Number (QAR) |
| EXP_DOMESTIC_TRFR | Risk Dataset | Expected domestic transfers | Number (QAR) |
| EXP_INTL_TRFR | Risk Dataset | Expected international transfers | Number (QAR) |
| ANNUAL_EXP_TURNOVER | Risk Dataset | Annual expected turnover | Number (QAR) |
| ACTIVITY_PURPOSE | Risk Dataset | Stated purpose of activity | Text |
| EXPECTED_COUNTRIES | Risk Dataset | Expected transaction countries | Array |
| ACTUAL_VS_EXPECTED_RATIO | Calculated | Ratio of actual to expected | Decimal |
| DEVIATION_FLAG | Calculated | Activity deviation indicator | Boolean |
| DEVIATION_REASON | System | Reason for deviation | Text |

### 4.3 UI Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 Expected Activity Profile                       Source: Risk Dataset     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │  LM_EXP_CASH   │  │ LM_EXP_NONCASH │  │  LM_EXP_TRFR   │                │
│  │    100,000     │  │    350,000     │  │    500,000     │                │
│  │ Expected Cash  │  │Expected Non-Cash│  │Expected Xfers  │                │
│  │In: 60K Out: 40K│  │Cards,Cheques,POS│  │Dom:300K Int:200K│               │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
│                                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐                │
│  │ ANNUAL_EXP_TURNOVER      │  │ ACTUAL_VS_EXPECTED_RATIO │                │
│  │     11,400,000 QAR       │  │     1.15x                │                │
│  └──────────────────────────┘  └──────────────────────────┘                │
│                                                                             │
│  ACTIVITY_PURPOSE: Business operations, personal investments, family support│
│                                                                             │
│  EXPECTED_COUNTRIES: [QA] [AE] [GB] [US]                                    │
│                                                                             │
│  DATA_SOURCE: Risk Dataset                    Last Updated: 2024-02-15     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Deviation Alert Rules

| Rule ID | Condition | Alert Level | Action |
|---------|-----------|-------------|--------|
| EA-001 | Actual > Expected × 1.5 | Warning | Review required |
| EA-002 | Actual > Expected × 2.0 | Critical | Escalate to Compliance |
| EA-003 | Cash activity > 80% of total | Warning | Cash intensive flag |
| EA-004 | Unexpected country exposure | Critical | High-risk country review |
| EA-005 | Activity inconsistent with profile | Warning | Source verification |

---

## 5. Officer Digital Confirmation

### 5.1 Overview

The Officer Digital Confirmation system ensures accountability and non-repudiation for all case decisions. Officers must confirm their identity using a secure 4-digit PIN before submitting any approval or rejection.

### 5.2 Confirmation Components

| Component | Description |
|-----------|-------------|
| Employee Name | Auto-populated from session |
| Employee ID | Auto-populated from session |
| Department | Auto-populated from session |
| Checklist | Mandatory verification items |
| 4-Digit PIN | Personal identification number |
| Timestamp | System-generated timestamp |

### 5.3 Verification Checklist

| ID | Item | Arabic | Required |
|----|------|--------|----------|
| identity | Identity Verified | تم التحقق من الهوية | ✅ Yes |
| salary | Salary Verified | تم التحقق من الراتب | ✅ Yes |
| expected_activity | Expected Activity Verified | تم التحقق من النشاط المتوقع | ✅ Yes |
| joint_exposure | Joint Exposure Verified | تم التحقق من التعرض المشترك | ✅ Yes |
| documents | Documents Complete | المستندات مكتملة | ✅ Yes |
| source_of_wealth | Source of Wealth Assessed | تم تقييم مصدر الثروة | Optional |
| pep_review | PEP Status Reviewed | تمت مراجعة حالة PEP | Optional |

### 5.4 PIN Management

| Operation | Process |
|-----------|---------|
| First Login | System prompts officer to create 4-digit PIN |
| PIN Entry | Officer enters PIN for each approval action |
| PIN Reset | Requires QIB email verification + IT approval |
| Failed Attempts | 3 failures = temporary lockout (30 minutes) |
| PIN Storage | Encrypted in Active Directory / LDAP |

### 5.5 UI Layout (Modal)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      🔒 Officer Confirmation Required                        │
│                                                                             │
│                         Action: Approve as Business Maker                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Employee Name: Ahmed Al-Thani                                        │   │
│  │ Employee ID:   EMP001                                                │   │
│  │ Department:    Mass Banking                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Verification Checklist:                                                    │
│  ☑ Identity Verified *                                                     │
│  ☑ Salary Verified *                                                       │
│  ☑ Expected Activity Verified *                                            │
│  ☑ Joint Exposure Verified *                                               │
│  ☑ Documents Complete *                                                    │
│  ☐ Source of Wealth Assessed                                               │
│  ☐ PEP Status Reviewed                                                     │
│                                                                             │
│  Enter 4-Digit PIN:                                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                                          │
│  │  *  │ │  *  │ │  *  │ │  *  │                                          │
│  └─────┘ └─────┘ └─────┘ └─────┘                                          │
│                                                                             │
│         [  Cancel  ]              [  Confirm  ]                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Call Center View

### 6.1 Overview

The Call Center View provides a restricted, read-only view of customer information for customer service representatives. This view intentionally excludes sensitive risk and compliance information.

### 6.2 Access Permissions

| Information Type | Visible | Hidden |
|-----------------|---------|--------|
| Customer Name | ✅ | |
| Customer Name (Arabic) | ✅ | |
| Nationality | ✅ | |
| Segment | ✅ | |
| Current Salary | ✅ | |
| Last Salary Amount | ✅ | |
| Last Salary Date | ✅ | |
| Expected Cash Activity | ✅ | |
| Expected Non-Cash Activity | ✅ | |
| Expected Transfers | ✅ | |
| Account Count | ✅ | |
| Active Accounts | ✅ | |
| Risk Score | | ❌ RESTRICTED |
| AML Flags | | ❌ RESTRICTED |
| Compliance Notes | | ❌ RESTRICTED |
| EDD Investigation Status | | ❌ RESTRICTED |
| STR Indicators | | ❌ RESTRICTED |

### 6.3 Search Functionality

Call Center users can search by:

| Field | Format | Example |
|-------|--------|---------|
| RIM Number | RIMxxxxxx | RIM001234 |
| QID | xxxxxxxxxxx | 29912345678 |
| Account Number | xxxx-xxxx-xxxx | 0001-2345-6789 |

### 6.4 UI Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📞 Call Center View — Read-Only Customer Information                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Abdullah Mohammed Al-Kuwari                                          │   │
│  │ عبدالله محمد الكواري                                                  │   │
│  │ [Qatari] [Private Banking]                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                                │
│  │ Current Salary   │  │ Last Salary      │                                │
│  │ 450,000 QAR      │  │ 452,000 QAR      │                                │
│  │                  │  │ 2024-02-28       │                                │
│  └──────────────────┘  └──────────────────┘                                │
│                                                                             │
│  Expected Monthly Activity:                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                           │
│  │ Cash       │  │ Non-Cash   │  │ Transfers  │                           │
│  │ 100,000    │  │ 350,000    │  │ 500,000    │                           │
│  └────────────┘  └────────────┘  └────────────┘                           │
│                                                                             │
│  Total Accounts: 3 (2 active)                                               │
│                                                                             │
│  ⚠️ RESTRICTED INFORMATION                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Risk scores, AML flags, and compliance investigation notes are not  │   │
│  │ accessible in Call Center view. For sensitive inquiries, please     │   │
│  │ escalate to your supervisor.                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. User Guide Module

### 7.1 Overview

The User Guide Module provides built-in documentation accessible to all system users. Guides are created by Department Managers and require Compliance approval before publication.

### 7.2 Guide Lifecycle

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   DRAFT      │ ──▶ │   REVIEW     │ ──▶ │   APPROVED   │ ──▶ │   PUBLISHED  │
│ Dept Manager │     │  Compliance  │     │  Compliance  │     │  All Users   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

### 7.3 Published Guides

| ID | Title | Department | Version | Last Updated |
|----|-------|------------|---------|--------------|
| UG001 | EDD Case Processing Guide | CDD Operations | 2.1 | 2024-02-01 |
| UG002 | Risk Classification Model | Risk Management | 1.5 | 2024-01-15 |
| UG003 | Call Center Customer Inquiry | Call Center | 1.0 | 2024-01-20 |

### 7.4 Guide Structure

Each guide contains:
- Title (English & Arabic)
- Department ownership
- Version number
- Created by / Approved by
- Multiple sections with content
- Status (Draft/Review/Published)

---

## 8. System Presentation

### 8.1 Overview

The System Presentation is an interactive, self-contained presentation explaining the EDD System to all staff members. It eliminates the need for external training documents and ensures every employee understands the system without asking questions.

### 8.2 Presentation Title

**"Operations Digital Investigation Platform"**
منصة التحقيق الرقمي للعمليات

### 8.3 Slide Content

| Slide | Title | Content Focus |
|-------|-------|---------------|
| 1 | System Overview | Purpose, key features, benefits |
| 2 | Department Responsibilities | Business, CDD, Compliance roles |
| 3 | Case Workflow | Visual flow diagram |
| 4 | Risk Classification | ETL fields, AUTO HIGH triggers |
| 5 | Data Sources | T24, QCB, ETL, TM integrations |
| 6 | Officer Confirmation | PIN system, checklist |
| 7 | Contact & Support | Help desk, documentation |

### 8.4 Design Principles

- Self-explanatory content
- Visual workflow diagrams
- Clear role definitions
- Technical field mapping tables
- No external dependencies

---

## 9. Data Source Mapping

### 9.1 Field-to-Source Mapping

| Field | Source System | Update Frequency |
|-------|--------------|------------------|
| RIM | T24 Core Banking | Real-time |
| Customer Name | T24 Core Banking | Real-time |
| Nationality | T24 / QCB KYC | Real-time |
| Segment | T24 Core Banking | Real-time |
| SALARY | ETL Dataset | Daily Batch |
| ANNUAL_INC | ETL Dataset | Daily Batch |
| SEC_INC_AMT | ETL Dataset | Daily Batch |
| LAST_SAL_DA | ETL Dataset | Daily Batch |
| LAST_SAL_AMT | ETL Dataset | Daily Batch |
| AVG_LAST_3_SALARY | ETL (Calculated) | Daily Batch |
| LM_EXP_CASH | Risk Dataset | Daily Batch |
| LM_EXP_NONCASH | Risk Dataset | Daily Batch |
| LM_EXP_TRFR | Risk Dataset | Daily Batch |
| JOINT_RIM_1 to JOINT_RIM_5 | T24 Joint Dataset | Real-time |
| JOINT_RIM_PERC to JOINT_RIM_PERC_5 | T24 Joint Dataset | Real-time |
| PROD_RISK_SCORE | ETL/SnapView | Daily Batch |
| ACT_RISK_SCORE | ETL/SnapView | Daily Batch |
| OCCP_RISK_SCORE | ETL/SnapView | Daily Batch |
| COUNTRY_RISK_SCORE | ETL/SnapView | Daily Batch |
| FINAL_RISK_SCORE | ETL/SnapView | Daily Batch |
| FINAL_RISK_CATEG | ETL/SnapView | Daily Batch |
| TM_ALERTS | Transaction Monitoring | Real-time |
| LARGE_TRANSACTIONS | T24/TM | Real-time |

---

## 10. Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | March 2026 | Enterprise Architecture | Added all enterprise features |

---

**Document End**

*This document is confidential and intended for QIB internal use only.*
