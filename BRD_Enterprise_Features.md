# EDD Case Management System
# Enterprise Features Specification
## BRD Addendum — Version 2.3

**Document Version:** 2.3  
**Date:** March 2026  
**Classification:** Internal - Operations, Business, IT, Compliance  
**Target Audience:** Business Users, CDD Operations, Compliance, IT Teams, Call Center

---

## 1. Document Overview

This document extends the IT Technical Architecture BRD with comprehensive specifications for enterprise-level features implemented in the EDD Case Management System.

### 1.1 Features Covered

| Section | Feature | Status |
|---------|---------|--------|
| 2 | Decision Support Framework | ✅ Implemented |
| 3 | Role Governance (Maker/Checker) | ✅ Implemented |
| 4 | Financial Profile Display | ✅ Implemented |
| 5 | Expected Activity Profile | ✅ Implemented |
| 6 | Officer Digital Confirmation | ✅ Implemented |
| 7 | Call Center View | ✅ Implemented |
| 8 | User Guide Module | ✅ Implemented |
| 9 | System Presentation | ✅ Implemented |
| 10 | Comments & Recommendations | ✅ Implemented |
| 11 | Customer Risk Network Graph | ✅ Implemented |
| 12 | Financial Behaviour Indicators | ✅ Implemented |
| 13 | Export Reports Module | ✅ Implemented |
| 14 | Employee Assessment Panel | ✅ Implemented |

---

## 2. Decision Support Framework

### 2.1 System Philosophy

**CRITICAL PRINCIPLE: Human-in-the-Loop**

The EDD Case Management System is designed as a **Decision Support System (DSS)**, NOT a Decision Engine.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DECISION SUPPORT SYSTEM PRINCIPLE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌──────────────┐        ┌──────────────┐        ┌──────────────┐        │
│    │   SYSTEM     │   →    │   EMPLOYEE   │   →    │   DECISION   │        │
│    │   ASSISTS    │        │   ANALYZES   │        │   (HUMAN)    │        │
│    └──────────────┘        └──────────────┘        └──────────────┘        │
│                                                                             │
│    • Collects Data          • Reviews Indicators   • Final Assessment      │
│    • Presents Indicators    • Applies Judgment     • Accountability        │
│    • Highlights Anomalies   • Documents Findings   • Digital Signature     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Official Statement

> **The system does NOT generate automated risk scores or automated risk decisions.**
>
> Its objective is to digitize the EDD workflow and assist employees by presenting relevant financial, AML, and customer relationship indicators.
>
> **The final assessment and decision remain the responsibility of the assigned employee and authorized bank personnel.**

### 2.3 What the System Does

| Function | Description |
|----------|-------------|
| Data Collection | Aggregates customer data from T24, ETL, SnapView, Risk Dataset |
| Indicator Display | Presents behavioral and financial indicators |
| Anomaly Highlighting | Flags inconsistencies for employee review |
| Workflow Management | Routes cases through Maker/Checker approval |
| Audit Trail | Records all actions and decisions |

### 2.4 What the System Does NOT Do

| Restriction | Reason |
|-------------|--------|
| ❌ Generate automated risk scores | Avoids Model Risk, regulatory challenges |
| ❌ Classify customers automatically | Decision must be human judgment |
| ❌ Make approval/rejection decisions | Accountability must remain with employee |
| ❌ Override employee assessment | Human-in-the-loop principle |

### 2.5 Behaviour Indicators (Not Risk Scores)

The system displays **Indicators**, not scores:

| Indicator Type | Example Display | Employee Action Required |
|----------------|-----------------|--------------------------|
| Income Mismatch | "Actual salary differs from declared salary" | Review and assess |
| Activity Exceeds Expected | "Transaction activity exceeds expected profile" | Investigate source |
| AML Positive | "AML screening returned positive result" | Verify and document |
| PEP Status | "Customer identified as PEP" | Apply enhanced procedures |
| Dormant Reactivation | "Dormant account with sudden high activity" | Verify legitimacy |
| Salary Gap | "No salary credit for 90+ days" | Confirm employment status |

---

## 2A. GOVERNANCE PRINCIPLE: External Risk Scoring

### 2A.1 Risk Data Origin — MANDATORY GOVERNANCE RULE

**⚠️ CRITICAL PRINCIPLE — ENFORCE ACROSS ALL DOCUMENTATION & UI**

```
                     ┌─────────────────────────────────┐
                     │  EXTERNAL RISK SYSTEMS          │
                     │  (CRP / Core Banking / TM)      │
                     │  CALCULATE RISK SCORES          │
                     └──────────────┬──────────────────┘
                                    │
                                    │ Risk Score Output
                                    ↓
                     ┌─────────────────────────────────┐
                     │  QIB EDD PLATFORM               │
                     │  READS & DISPLAYS SCORES        │
                     │  FOR INVESTIGATION              │
                     └─────────────────────────────────┘
```

### 2A.2 Governing Statement

> **This platform is a Risk Reader and Compliance Investigation Platform, NOT a Risk Calculation Platform.**
>
> **All customer risk scores originate from external authorized systems:**
> - 🔵 **CRP** — Customer Risk Profiling Engine
> - 🟢 **Core Banking** — T24 / Core Banking Systems
> - 🟡 **TM** — Transaction Monitoring Systems
> - 🟣 **DMS** — Document Management System (KYC Files)
> - 🔴 **Regulatory** — External Sanctions/PEP Datasets
>
> **The platform shall ONLY:**
> - Retrieve risk scores from external systems
> - Display risk data for compliance investigation
> - Analyze and contextualize risk information
> - Document employee assessment and decisions
>
> **The platform SHALL NOT:**
> - Calculate or generate risk scores internally
> - Modify risk classifications
> - Create alternative risk rankings
> - Override external system assessments

### 2A.3 Risk Data Integrity

| Requirement | Implementation |
|-------------|-----------------|
| **Read-Only Risk Data** | Risk scores retrieved from external systems are displayed as read-only in the UI |
| **Source Attribution** | Every risk score display includes source system indicator (CRP, Core Banking, TM, etc.) |
| **Timestamp Recording** | Last update timestamp from source system is always displayed |
| **Authority Level** | Risk data marked with authority level = "AUTHORITATIVE" or "VERIFIED" |
| **Data Lineage** | Full audit trail maintained showing data source and retrieval time |
| **No Local Modifications** | Risk scores cannot be edited within the platform |
| **External-Only Updates** | Risk score changes must originate from the source system |

### 2A.4 Data Source Transparency Requirements

**For every risk score displayed in the system, the following information SHALL BE visible:**

```
┌─────────────────────────────────────────────┐
│ Risk Score Display                          │
├─────────────────────────────────────────────┤
│ Value:        370 / 670                     │
│ Category:     HIGH                          │
│ Source:       🔵 CRP (Authoritative)        │
│ Last Updated: 2026-03-10 14:35 UTC          │
│ Authority:    AUTHORITATIVE                 │
│ Audit Trail:  [View]                        │
└─────────────────────────────────────────────┘
```

### 2A.5 Compliance & Audit Trail

| Activity | Requirement |
|----------|-------------|
| **System Launch** | Display governance notice: "Risk scores from external systems" |
| **Case Review** | Clearly indicate all risk data sources |
| **User Guide** | Explain that platform is "Risk Reader" not "Risk Calculator" |
| **Training Materials** | Emphasize external risk source architecture |
| **Board Presentations** | Present system as "Compliance Investigation Platform" |
| **Demo Environment** | Simulate external system data feeds |
| **Regulatory Audit** | Document that risk scoring occurs in CRP/TM, not here |

### 2A.6 Enforcement Mechanism

**Implementation Checklist:**

- [ ] All risk score displays include source system indicator
- [ ] BRD documentation reflects "Risk Reader" terminology
- [ ] System Architecture diagrams show external risk sources
- [ ] User training materials emphasize external origin of risk data
- [ ] Presentations describe system as "Compliance Investigation Platform"
- [ ] UI labels use "Retrieved Risk Score" not "Calculated Risk Score"
- [ ] Data lineage view available showing source system
- [ ] Audit trail captures data source and retrieval time
- [ ] Demo environment simulates CRP/Core Banking integration
- [ ] Governance Notice displayed at case launch



### 2.6 Employee Assessment Options

After reviewing indicators, the employee must select:

| Assessment Option | Arabic | When to Use |
|-------------------|--------|-------------|
| Explanation Acceptable | تفسير مقبول | Customer provided satisfactory explanation |
| Further Review Required | مراجعة إضافية مطلوبة | Additional documentation or verification needed |
| Escalate to Compliance | تصعيد للامتثال | Suspicious indicators require compliance review |
| No Concerns Identified | لا توجد مخاوف | Indicators reviewed, no risk concerns |

### 2.7 Regulatory Compliance Benefits

This design ensures:

| Compliance Area | How It's Achieved |
|-----------------|-------------------|
| AML Governance | System supports, human decides |
| Audit Requirements | Full trail of employee decisions |
| Regulator Expectations | No algorithmic bias in classification |
| Model Risk Avoidance | No automated scoring model to validate |

### 2.8 Digital Confirmation Requirements

Before finalizing any assessment, the employee must:

1. ☑ Review all displayed indicators
2. ☑ Document findings and observations
3. ☑ Select appropriate assessment option
4. ☑ Enter 4-digit personal PIN
5. ☑ System records: Employee ID, Name, Timestamp, Assessment

---

## 3. Role Governance System

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

## 10. Customer Risk Network Graph

### 10.1 Overview

The Customer Risk Network Graph is an advanced AML visualization feature that displays customer relationships, joint account connections, corporate ownership structures, and signatory relationships in an interactive network diagram.

### 10.2 Feature Description

| Aspect | Description |
|--------|-------------|
| Purpose | Visualize customer relationship networks for AML investigation |
| Access | Available from EDD Case Review page via "Network Graph" button |
| Technology | Canvas-based interactive visualization with zoom/pan controls |
| Data Sources | T24, ETL/SnapView, Corporate Registry |

### 10.3 Node Types

| Node Type | Color | Icon | Description |
|-----------|-------|------|-------------|
| CUSTOMER | Cyan (#00D4FF) | 👤 | Primary customer under investigation |
| JOINT_HOLDER | Purple (#9C27B0) | 👥 | Joint account holder |
| COMPANY | Orange (#FF9800) | 🏢 | Related company entity |
| ACCOUNT | Green (#4CAF50) | 💳 | Account |
| SIGNATORY | Pink (#E91E63) | ✍️ | Authorized signatory / POA |
| HIGH_RISK | Red (#F44336) | ⚠️ | High risk individual |
| PEP | Deep Orange (#FF5722) | 🎖️ | Politically Exposed Person |

### 10.4 Edge Types (Relationships)

| Edge Type | Color | Style | Description |
|-----------|-------|-------|-------------|
| JOINT_ACCOUNT | Purple | Solid | Joint account relationship |
| SIGNATORY | Pink | Dashed | Signatory authority |
| BENEFICIAL_OWNER | Orange | Solid | Beneficial ownership |
| DIRECTOR | Blue | Solid | Director/Board member |
| SHAREHOLDER | Green | Solid | Shareholder relationship |
| FAMILY | Cyan | Dotted | Family relationship |
| EMPLOYER | Brown | Solid | Employment relationship |

### 10.5 Network Graph UI Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🕸️ Customer Risk Network Graph                              [Zoom +/-] [✕]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         ┌─────────────────────┐                            │
│    ┌─────────┐         │    🏢 Company A     │         ┌─────────┐        │
│    │ 👥 Joint │─────────│   (Beneficial Owner) │─────────│ 👥 Joint │        │
│    │ Holder 1 │         └─────────────────────┘         │ Holder 2 │        │
│    └────┬────┘                    │                     └────┬────┘        │
│         │                         │                          │             │
│         │                   ┌─────┴─────┐                    │             │
│         └───────────────────│  👤 MAIN  │────────────────────┘             │
│                      60%    │ CUSTOMER  │    30%                           │
│                             │ ⚠️ HIGH   │                                   │
│                             └─────┬─────┘                                   │
│                                   │                                         │
│                              SIGNATORY                                      │
│                                   │                                         │
│                             ┌─────┴─────┐                                   │
│                             │  ✍️ POA   │                                   │
│                             │  Holder   │                                   │
│                             └───────────┘                                   │
│                                                                             │
│  Legend:                                                                    │
│  ── Joint Account  ╌╌ Signatory  ── Beneficial Owner                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.6 Side Panel Information

| Section | Content |
|---------|---------|
| Node Details | Name, Arabic name, RIM/CR number, relationship type, ownership % |
| Risk Indicators | List of risk flags with severity levels |
| Connected Accounts | Account numbers, types, balances, status |
| Total Exposure | Sum of all connected account balances |

### 10.7 Interactive Features

| Feature | Description |
|---------|-------------|
| Click Node | Display detailed information in side panel |
| Zoom In/Out | Enlarge or shrink the network view |
| Reset View | Return to default zoom and position |
| Hover | Highlight connection paths |

### 10.8 Risk Indicator Levels

| Severity | Color | Examples |
|----------|-------|----------|
| Critical | Red (#F44336) | PEP status, sanctions match |
| High | Orange (#FF9800) | High-risk jurisdiction, complex structure |
| Medium | Yellow (#FFC107) | High cash activity, high value accounts |
| Low | Green (#4CAF50) | Multiple joint accounts |

### 10.9 Data Fields Used

| Field | Source | Description |
|-------|--------|-------------|
| JOINT_RIM_1 to JOINT_RIM_5 | T24 | Joint account holder RIMs |
| JOINT_RIM_PERC to JOINT_RIM_PERC_5 | T24 | Ownership percentages |
| COMPANY_CR | Corporate Registry | Company CR numbers |
| POA_TYPE | T24 | Power of Attorney type |
| POA_EXPIRY | T24 | POA expiration date |
| DIRECTOR_STATUS | Corporate Registry | Director/Board position |
| SHAREHOLDING_PCT | Corporate Registry | Shareholding percentage |

---

## 11. Financial Behaviour Indicators

### 11.1 Overview

The system implements comprehensive financial behavior analysis comparing declared income against actual verified salary to detect income inconsistencies, potential money laundering, and unusual financial patterns.

**Critical Definition:**
> **LAST_SAL_AMT** is the actual verified salary amount received by the customer based on the most recent salary credit transaction. It is NOT simply the last transfer — it is the verified salary from Payroll/WPS feed.

### 11.2 Field Definitions

| Field | Definition | Source | Fallback Source |
|-------|------------|--------|-----------------|
| SALARY | Declared salary during account onboarding | T24 | - |
| LAST_SAL_AMT | Actual verified salary (most recent salary credit) | Payroll ETL | T24 Transaction History |
| LAST_MON_SALARY | Salary of last calendar month | Payroll ETL | - |
| LAST_SAL_DA | Date of last salary credit | Payroll ETL | - |
| ANNUAL_INC | Annual income declared | T24 | - |
| SEC_INC_AMT | Secondary income amount | T24/KYC | - |
| SEC_INC_SOURCE | Source of secondary income | T24/KYC | - |
| AVG_LAST_3_SALARY | Average of last 3 months salary | Calculated | - |

### 11.3 Income Consistency Check

The system compares:

```
DECLARED SALARY (at onboarding)
        vs
ACTUAL SALARY (LAST_SAL_AMT from Payroll)
        vs
FINANCIAL ACTIVITY (transaction patterns)
```

**Example Analysis:**

| Scenario | SALARY | LAST_SAL_AMT | Transfers | Analysis Result |
|----------|--------|--------------|-----------|-----------------|
| Normal | 15,000 | 15,500 | 45,000 | Income Consistent |
| Inconsistent | 5,000 | 65,000 | 200,000 | **Declared income mismatch** |
| Income Drop | 50,000 | 5,000 | 20,000 | **Income drop detected** |
| Money Mule | 10,000 | 10,500 | 2,000,000 | **Financial Behaviour Risk** |

### 11.4 Risk Analysis Rules

#### Rule 1: Declared Income Inconsistency
```
IF LAST_SAL_AMT > SALARY × 2
THEN Flag: "Declared Income Inconsistency"
Risk Points: +30
```

#### Rule 2: Financial Behaviour Risk
```
IF Transaction_Volume > LAST_SAL_AMT × 20
THEN Flag: "Financial Behaviour Risk"
Risk Points: +40
```

#### Rule 3: Salary Activity Gap
```
IF LAST_SAL_DATE > 3 months ago
THEN Flag: "Salary Activity Gap"
Risk Points: +15
```

#### Rule 4: Income Drop Detection
```
IF LAST_SAL_AMT < SALARY × 0.5
THEN Flag: "Income Drop Detected"
Risk Points: +15
```

#### Rule 5: High Activity Ratio
```
IF Monthly_Activity > LAST_SAL_AMT × 10
THEN Flag: "High Activity Ratio"
Risk Points: +25
```

### 11.5 Variance Calculation

```
INCOME_VARIANCE = ABS(LAST_SAL_AMT - SALARY) / SALARY × 100

FINANCIAL_CAPACITY = LAST_SAL_AMT × 12
```

### 11.6 UI Display — Customer Financial Profile

The system displays to CDD officers:

```
┌────────────────────────────────────────────────────────────┐
│           CUSTOMER FINANCIAL PROFILE                       │
├────────────────────────────────────────────────────────────┤
│ Declared Salary (SALARY):         5,000 QAR               │
│ Actual Salary (LAST_SAL_AMT):     65,415 QAR   ⚠️ HIGH    │
│ Annual Income (ANNUAL_INC):       576,000 QAR             │
│ Last Salary Date:                 2026-02-15              │
│ Average Last 3 Months:            62,500 QAR              │
│                                                            │
│ ⚠️ RISK INDICATOR:                                        │
│ Declared income inconsistent with actual salary           │
│ Variance: 1,208%                                          │
└────────────────────────────────────────────────────────────┘
```

### 11.7 Risk Detection Capabilities

This analysis enables detection of:

| Risk Type | Description | Detection Method |
|-----------|-------------|------------------|
| Income Inconsistency | Mismatch between declared and actual salary | LAST_SAL_AMT vs SALARY comparison |
| Money Laundering | High transaction volume relative to income | Transaction Volume vs Financial Capacity |
| Money Mule | Account used as pass-through for illicit funds | Activity pattern vs salary ratio |
| Sudden Income Change | Significant increase or decrease in income | Trend analysis of salary history |
| Ghost Salary | Salary credits without actual employment | No employer verification match |

### 11.8 Data Source Integration

```
                  ┌─────────────────┐
                  │   T24 CORE      │
                  │   (Declared     │
                  │   Income/KYC)   │
                  └────────┬────────┘
                           │
                           ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   PAYROLL ETL   │───│   EDD SYSTEM    │───│  RISK DATASET   │
│   (WPS/Direct)  │   │   Analysis      │   │  (Activity)     │
└─────────────────┘   └─────────────────┘   └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  FINANCIAL      │
                  │  BEHAVIOUR      │
                  │  RISK SCORE     │
                  └─────────────────┘
```

---

## 12. Export Reports Module

### 12.1 Overview

The system provides comprehensive export capabilities allowing officers to generate professional reports and presentations directly from the case management interface.

### 12.2 Export Types

| Export Type | Format | Purpose | Contents |
|-------------|--------|---------|----------|
| PDF Investigation Report | HTML/PDF | Formal documentation | Full case analysis, risk assessment, recommendations |
| Excel Data Export | CSV | Data analysis | Raw data, scores, calculations |
| Interactive Presentation | HTML | Management review | 7-slide presentation with key findings |

### 12.3 PDF Report Structure

The PDF report includes:

1. **Header**
   - QIB branding
   - Case ID and generation timestamp
   - Document classification

2. **Risk Assessment Summary**
   - Overall risk score (0-100)
   - Risk level badge (LOW/MEDIUM/HIGH/AUTO HIGH)
   - Key risk factors list

3. **Customer Information**
   - Personal details (Name, RIM, QID)
   - Account information (Segment, Occupation)
   
4. **Case Details**
   - Trigger source, dates, status
   - Active triggers

5. **Financial Profile Analysis**
   - Declared vs Actual salary comparison
   - Income variance calculation
   - Annual financial capacity
   - Consistency status

6. **Expected vs Actual Activity**
   - Expected transaction volumes
   - Capacity comparison
   - Deviation flags

7. **Risk Classification Model**
   - Product, Activity, Occupation, Country risks
   - Final risk score and category
   - AUTO HIGH reasons if applicable

8. **Relationship Network**
   - Connected entities
   - Account exposure summary
   - Network risk indicators

9. **Recommendation**
   - Investigation findings summary
   - Final recommendation action

### 12.4 Presentation Slides

| Slide | Title | Content |
|-------|-------|---------|
| 1 | Title | Customer name, risk level, case ID |
| 2 | Risk Summary | Score meter, key indicators |
| 3 | Customer Profile | Personal and account information |
| 4 | Financial Analysis | Income consistency check, variance |
| 5 | Risk Classification | Four risk dimensions + final score |
| 6 | Network | Related entities, connected accounts |
| 7 | Recommendation | Final decision and next steps |

### 12.5 Excel Export Fields

| Category | Fields Exported |
|----------|-----------------|
| Customer | RIM, Name, Nationality, Segment, QID |
| Financial | SALARY, LAST_SAL_AMT, AVG_LAST_3_SALARY, ANNUAL_INC |
| Activity | LM_EXP_CASH, LM_EXP_NONCASH, LM_EXP_TRFR |
| Risk Scores | PROD_RISK, ACT_RISK, OCCP_RISK, COUNTRY_RISK, FINAL |
| Analysis | Risk Score, Variance %, Consistency Status |
| Factors | All detected risk factors with severity |

### 12.6 Access Controls

| Role | PDF Export | Excel Export | Presentation |
|------|------------|--------------|--------------|
| BUSINESS_MAKER | ✅ | ❌ | ✅ |
| BUSINESS_CHECKER | ✅ | ✅ | ✅ |
| CDD_MAKER | ✅ | ✅ | ✅ |
| CDD_CHECKER | ✅ | ✅ | ✅ |
| COMPLIANCE_REVIEW | ✅ | ✅ | ✅ |
| CALL_CENTER_VIEW | ❌ | ❌ | ❌ |
| IT_ADMIN | ✅ | ✅ | ✅ |

---

## 13. Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | March 2026 | Enterprise Architecture | Added all enterprise features |
| 2.1 | March 2026 | Enterprise Architecture | Added Customer Risk Network Graph |
| 2.2 | March 2026 | Enterprise Architecture | Added Financial Behaviour Indicators, Export Reports Module |
| 2.3 | March 2026 | Enterprise Architecture | Added Decision Support Framework (Human-in-the-Loop), Employee Assessment Panel |

---

**Document End**

*This document is confidential and intended for QIB internal use only.**
