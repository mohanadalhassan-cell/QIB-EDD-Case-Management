# 📋 CDD OFFICER — OPERATIONS MANUAL
## Retail Risk Governance Platform (RRGP) — Qatar Islamic Bank
### Version 1.0 | March 2026 | Operational Manual

---

## 📑 TABLE OF CONTENTS

1. [Purpose & Scope](#1-purpose--scope)
2. [CDD Officer Role Definition](#2-cdd-officer-role-definition)
3. [System Access & Setup](#3-system-access--setup)
4. [CDD Review Workflow](#4-cdd-review-workflow)
5. [Maker/Checker Process](#5-makerchecker-process)
6. [Due Diligence Procedures](#6-due-diligence-procedures)
7. [Document Deep-Dive Investigation](#7-document-deep-dive-investigation)
8. [Risk Assessment Documentation](#8-risk-assessment-documentation)
9. [CDD Report Preparation](#9-cdd-report-preparation)
10. [T24 Synchronization](#10-t24-synchronization)
11. [SLA & Performance Metrics](#11-sla--performance-metrics)
12. [Escalation Procedures](#12-escalation-procedures)
13. [Quality Assurance Standards](#13-quality-assurance-standards)
14. [Appendix: Templates & Checklists](#14-appendix-templates--checklists)

---

# 1. PURPOSE & SCOPE

## 1.1 Purpose

This manual provides CDD Officers with comprehensive operational procedures for performing Enhanced Due Diligence (EDD) within the Retail Risk Governance Platform. CDD is the **critical middle stage** where financial crime risk is assessed, documents are deeply verified, and recommendations are formed for Compliance review.

## 1.2 Scope

```
This manual covers:
✅ Receiving cases from Business Teams
✅ Reviewing Business Team recommendations
✅ Performing comprehensive due diligence
✅ Document deep-dive investigation (when flagged by RM)
✅ Source of funds verification
✅ Business relationship assessment
✅ Transaction pattern analysis
✅ Maker/Checker control process
✅ CDD report preparation
✅ T24 customer profile synchronization
✅ Routing to Compliance

This manual does NOT cover:
❌ RM document collection (see RM Guide)
❌ Business Team review (see Business Team Guide)
❌ Final compliance decisions (see Compliance Checklist)
❌ Account approval/rejection (see Approver Guide)
```

## 1.3 Regulatory Framework

```
CDD work is governed by:
├─ QCB AML/CTF Regulations — Customer Due Diligence
├─ FATF Recommendations — Enhanced Due Diligence
├─ QIB Internal Policy — CDD-POL-2024-002
├─ Wolfsberg Principles — Financial Crime Compliance
└─ Data Protection Regulation — PII Handling
```

---

# 2. CDD OFFICER ROLE DEFINITION

## 2.1 Role Hierarchy

```
CDD OPERATIONS TEAM
├─ CDD Head (Department Manager)
│  ├─ Approves high-risk / discrepancy cases
│  ├─ Manages team workload and capacity
│  └─ Signs off on Checker escalations
│
├─ CDD Manager (Supervisor)
│  ├─ Acts as Checker for complex cases
│  ├─ Reviews quality of CDD reports
│  └─ Escalates to Head when needed
│
├─ CDD Senior Officer
│  ├─ Acts as Maker (standard & complex cases)
│  ├─ Acts as Checker (standard cases only)
│  ├─ Mentors junior officers
│  └─ Handles deep-dive investigations
│
└─ CDD Officer (Junior)
   ├─ Acts as Maker (standard cases only)
   ├─ Cannot act as Checker
   ├─ Prepares CDD documentation
   └─ Works under supervision
```

## 2.2 System Permissions

```
✅ CDD OFFICER CAN:
   ├─ View cases assigned to CDD queue
   ├─ Read RM verification notes
   ├─ Read Business Team recommendations
   ├─ Perform deep-dive document verification
   ├─ Re-validate disputed documents against sources
   ├─ Request additional verification from RM/Branch
   ├─ Request additional documents from customer
   ├─ Document detailed CDD findings
   ├─ Prepare CDD report
   ├─ Submit to Checker for approval
   ├─ Escalate to Compliance
   └─ Update T24 customer profile

❌ CDD OFFICER CANNOT:
   ├─ Make final account decisions (approve/reject)
   ├─ Override RM verification without documented evidence
   ├─ Close cases without Compliance/Approver sign-off
   ├─ Access cases not in CDD queue
   ├─ Modify Business Team or Compliance findings
   ├─ Delete or edit previous stage notes
   └─ Bypass Maker/Checker control
```

## 2.3 Maker vs Checker — Segregation of Duties

```
┌────────────────────────────────────────────────────────────┐
│  CRITICAL RULE: A CDD Officer CANNOT act as both          │
│  Maker AND Checker on the SAME case.                       │
│                                                            │
│  Maker (prepares) ≠ Checker (validates)                   │
│                                                            │
│  The system enforces this — if you prepared the CDD       │
│  documentation as Maker, the system will not allow you     │
│  to approve it as Checker.                                 │
└────────────────────────────────────────────────────────────┘
```

---

# 3. SYSTEM ACCESS & SETUP

## 3.1 Login & Dashboard

```
Step 1: Navigate to RRGP Portal → https://rrgp.qib.com.qa
Step 2: Enter Employee ID + Password
Step 3: Complete MFA (OTP)
Step 4: Dashboard loads

YOUR CDD DASHBOARD SHOWS:
├─ My Active Cases: [N]
├─ Pending Cases (unassigned to you): [N]
├─ Cases Awaiting Checker: [N]
├─ Overdue Cases (SLA breached): [N] (red badge)
├─ Average Processing Time: [N] hours
├─ SLA Compliance Rate: [%]
└─ Recent Activity Feed
```

## 3.2 Queue Management

```
CDD QUEUE VIEWS:
├─ "My Cases" → Cases assigned specifically to you
├─ "Team Queue" → All unassigned CDD cases
├─ "Awaiting Checker" → Cases you prepared, pending Checker review
├─ "Returned (Rework)" → Cases returned by Checker with comments
├─ "Deep Dive Required" → Cases flagged by RM for document investigation
└─ "Overdue" → Cases breaching SLA

PRIORITY ORDER (work from top):
1. 🔴 Overdue cases (SLA breached)
2. 🟠 Returned (Rework) cases
3. 🟡 Deep Dive Required cases
4. 🟢 Normal priority cases
5. ⚪ Standard queue (FIFO)
```

## 3.3 Required Tools

```
For CDD investigation, you will use:
├─ RRGP Portal (primary work platform)
├─ DMS (Document Management System) — document retrieval
├─ T24 Core Banking — customer profile & account data
├─ CRP (Customer Relationship Platform) — customer history
├─ World-Check / Dow Jones — PEP/Sanctions screening (initial)
├─ Company Registry Portal — CR verification
└─ QCB Database — regulatory checks (read-only)
```

---

# 4. CDD REVIEW WORKFLOW

## 4.1 End-to-End CDD Flow

```
CASE ARRIVES IN CDD QUEUE
        ↓
┌────────────────────────────────────────────────────────────┐
│                    CDD MAKER PROCESS                       │
│                                                            │
│  1. Review case package                                    │
│     ├─ RM verification notes                              │
│     ├─ Business Team recommendation                       │
│     ├─ Risk assessment details                            │
│     └─ Customer documents                                 │
│                                                            │
│  2. If discrepancies flagged → Perform Deep-Dive           │
│     ├─ Re-validate documents                              │
│     ├─ Contact RM for clarification                       │
│     ├─ Request additional evidence                        │
│     └─ Document resolution                                │
│                                                            │
│  3. Perform standard CDD checks                           │
│     ├─ Source of funds verification                        │
│     ├─ Business relationship assessment                   │
│     ├─ Transaction pattern analysis                       │
│     ├─ PEP/Sanctions initial screening                    │
│     └─ Document authenticity review                       │
│                                                            │
│  4. Prepare CDD Report                                     │
│     ├─ Executive summary                                  │
│     ├─ Detailed findings                                  │
│     ├─ Risk assessment                                    │
│     ├─ Evidence list                                      │
│     └─ CDD Recommendation                                │
│                                                            │
│  5. Submit to Checker                                      │
│     └─ Apply digital signature                            │
└────────────────────────────────────────────────────────────┘
        ↓
┌────────────────────────────────────────────────────────────┐
│                   CDD CHECKER PROCESS                      │
│                                                            │
│  1. Review Maker's CDD report                              │
│  2. Validate documentation completeness                    │
│  3. Verify reasoning and conclusions                       │
│  4. Quality control checklist                              │
│  5. Decision:                                              │
│     ├─ APPROVED → Route to Compliance                     │
│     ├─ REQUEST REWORK → Return to Maker with comments     │
│     └─ ESCALATE → Send to CDD Manager/Head               │
│  6. Apply digital signature                                │
└────────────────────────────────────────────────────────────┘
        ↓
COMPLIANCE REVIEW
```

## 4.2 Case Types You Will Receive

```
TYPE A: STANDARD CDD REVIEW
├─ RM: All documents matched
├─ Business Team: Normal recommendation
├─ No discrepancies flagged
├─ SLA: 24 hours
└─ Complexity: Standard

TYPE B: DEEP-DIVE REQUIRED
├─ RM: Document discrepancies found
├─ Business Team: "CDD deep-dive recommended"
├─ Discrepancy flag: YES
├─ SLA: 48 hours (extended)
└─ Complexity: High

TYPE C: HIGH-RISK / PEP
├─ Risk score: ≥ 60 (CRITICAL)
├─ PEP status: YES
├─ Automatic escalation triggered
├─ SLA: 24 hours (urgent priority)
└─ Complexity: Very High

TYPE D: RETURNED (REWORK)
├─ Previously prepared CDD report
├─ Checker returned with comments
├─ Must address all Checker concerns
├─ SLA: 8 hours (fast turnaround)
└─ Complexity: Depends on comments
```

---

# 5. MAKER/CHECKER PROCESS

## 5.1 CDD Maker Responsibilities

```
AS CDD MAKER, YOU MUST:

1. RECEIVE AND REVIEW
   ├─ Open case from your queue
   ├─ Read ALL previous stage notes
   ├─ Understand why the case reached CDD
   ├─ Note any flags or recommendations
   └─ Plan your investigation approach

2. INVESTIGATE
   ├─ Perform all required due diligence checks
   ├─ Verify documents from multiple sources
   ├─ Cross-reference information
   ├─ Request additional information if needed
   └─ Document every finding (positive & negative)

3. DOCUMENT
   ├─ Prepare comprehensive CDD report
   ├─ Include all evidence references
   ├─ State your findings clearly
   ├─ Provide justified recommendation
   └─ Ensure nothing is assumed (everything evidenced)

4. SUBMIT TO CHECKER
   ├─ Verify report completeness (use checklist)
   ├─ Apply your digital signature
   ├─ Add Maker notes: "Ready for Checker review"
   ├─ Select appropriate Checker from team
   │   (system suggests based on availability)
   └─ Click: "Submit to Checker"

5. IF RETURNED FOR REWORK
   ├─ Read Checker's comments carefully
   ├─ Address EVERY concern raised
   ├─ Update CDD report with revisions
   ├─ Add revision notes: "Addressed items #1, #2, #3"
   └─ Re-submit to the SAME Checker
```

## 5.2 CDD Checker Responsibilities

```
AS CDD CHECKER, YOU MUST:

1. RECEIVE CASE FROM MAKER
   ├─ Open case from "Awaiting Checker" queue
   ├─ Note: You CANNOT be the same person as the Maker
   └─ System will block if you try to check your own work

2. REVIEW CDD REPORT
   ├─ Read Maker's complete CDD report
   ├─ Verify against source documents
   ├─ Check calculations and assessments
   ├─ Validate reasoning and conclusions
   └─ Ensure compliance with procedures

3. QUALITY CONTROL CHECKLIST
   Complete ALL items (system enforced):
   ├─ □ All required source documents reviewed
   ├─ □ Risk assessment is justified by evidence
   ├─ □ Findings are supported by documentation
   ├─ □ Discrepancies (if any) properly investigated
   ├─ □ No missing information or gaps
   ├─ □ Recommendation is reasonable and consistent
   ├─ □ T24 synchronization planned correctly
   ├─ □ Report language is professional and clear
   ├─ □ All attachments present and referenced
   └─ □ No policy violations identified

4. MAKE DECISION
   ├─ APPROVED:
   │  ├─ All quality checks passed
   │  ├─ CDD report is complete and accurate
   │  ├─ Recommendation is well-supported
   │  ├─ Apply Checker digital signature
   │  └─ Case automatically routes to Compliance
   │
   ├─ REQUEST REWORK:
   │  ├─ One or more quality checks failed
   │  ├─ Write clear, specific rework comments
   │  ├─ For each issue:
   │  │  ├─ State what is wrong
   │  │  ├─ State what needs to be corrected
   │  │  └─ Reference the specific section
   │  ├─ Case returns to Maker
   │  └─ SLA: 8 hours for Maker to address
   │
   └─ ESCALATE:
      ├─ Case is too complex for standard Checker
      ├─ Significant risk identified not in original assessment
      ├─ Policy conflict or ambiguity
      ├─ Write escalation justification
      ├─ Case routes to CDD Manager or Head
      └─ SLA resets for management review

5. SIGN-OFF
   ├─ Apply digital signature
   ├─ Timestamp automatically recorded
   ├─ Decision recorded in immutable audit trail
   └─ Cannot be reversed once signed
```

## 5.3 Maker/Checker Assignment Rules

```
RULE 1: Segregation of Duties
├─ Maker ≠ Checker (same case)
├─ System enforces automatically
└─ No exceptions permitted

RULE 2: Qualification Requirements
├─ CDD Junior Officer → Maker ONLY (standard cases)
├─ CDD Senior Officer → Maker AND Checker (not same case)
├─ CDD Manager → Checker AND Escalation reviewer
└─ CDD Head → Final escalation authority

RULE 3: Assignment Priority
├─ Checker assigned based on availability
├─ Workload-balanced distribution
├─ Complex cases → Senior/Manager as Checker
└─ PEP/Sanctions cases → Manager as Checker (mandatory)

RULE 4: Rework Limits
├─ Maximum 3 rework cycles per case
├─ After 3 reworks → Escalate to CDD Manager
├─ Each rework reduces SLA by 4 hours
└─ Repeated reworks flagged in quality metrics
```

---

# 6. DUE DILIGENCE PROCEDURES

## 6.1 Source of Funds Verification

```
OBJECTIVE: Verify the legitimacy of customer's declared source of funds.

PROCEDURE:
├─ Step 1: Review declared source of funds in KYC form
│  ├─ Salary (employed)
│  ├─ Business Income (self-employed / owner)
│  ├─ Investment Returns
│  ├─ Inheritance
│  ├─ Gift
│  ├─ Savings
│  └─ Other (specify)
│
├─ Step 2: Cross-reference with supporting documents
│  ├─ Employment letter → Does employer match?
│  ├─ Salary certificate → Does amount match declared income?
│  ├─ Bank statements → Do deposits align with declared source?
│  ├─ Business license → Is the business legitimate?
│  └─ Tax returns → Does reported income match?
│
├─ Step 3: Verify with external sources
│  ├─ T24: Check existing account activity (if existing customer)
│  ├─ CRP: Review customer relationship history
│  ├─ Company Registry: Verify business registration
│  └─ Public records: Court records, news articles (for PEP)
│
├─ Step 4: Document findings
│  ├─ Source of funds category: [Verified / Partially Verified / Unverified]
│  ├─ Evidence referenced: [List documents and sources]
│  ├─ Concerns identified: [If any]
│  └─ Conclusion: [Legitimate / Requires further investigation / Suspicious]
│
└─ Step 5: Flag if suspicious
   ├─ Unexplained wealth (income vs lifestyle mismatch)
   ├─ Large cash-only transactions without business justification
   ├─ Source of funds from high-risk jurisdictions
   ├─ Reluctance to provide documentation
   └─ Inconsistencies between declared and actual source
```

## 6.2 Business Relationship Assessment

```
OBJECTIVE: Understand the purpose and intended nature of the business relationship.

PROCEDURE:
├─ Step 1: Review KYC form — account opening purpose
│  ├─ Savings (personal)
│  ├─ Salary account
│  ├─ Business operations
│  ├─ Investment
│  └─ Other
│
├─ Step 2: Assess expected account activity
│  ├─ Monthly deposit volume vs declared income
│  ├─ Transaction frequency expectations
│  ├─ International transfer requirements
│  ├─ Cash handling expectations
│  └─ Activity ratio: deposits / income
│
├─ Step 3: Evaluate risk indicators
│  ├─ Activity ratio > 1.5x → FLAG
│  ├─ All deposits in cash → FLAG
│  ├─ Frequent international transfers → FLAG
│  ├─ No clear business purpose → FLAG
│  └─ Customer in high-risk occupation → FLAG
│
├─ Step 4: Document assessment
│  ├─ Business relationship purpose: [Clear / Unclear / Suspicious]
│  ├─ Expected activity profile: [Normal / Elevated / Suspicious]
│  ├─ Risk indicators found: [Number and description]
│  └─ Conclusion: [Acceptable / Enhanced monitoring / Reject]
│
└─ Step 5: Determine ongoing monitoring requirements
   ├─ Standard monitoring (low/medium risk)
   ├─ Enhanced monitoring (high risk)
   ├─ Quarterly review (PEP/sanctions)
   └─ Continuous monitoring (critical risk)
```

## 6.3 Transaction Pattern Analysis

```
OBJECTIVE: Analyze available transaction history for suspicious patterns.

FOR EXISTING CUSTOMERS (T24 data available):
├─ Pull last 12 months of transaction history from T24
├─ Analyze:
│  ├─ Average monthly deposits vs declared income
│  ├─ Cash deposit ratio (cash / total)
│  ├─ International transfer frequency and destinations
│  ├─ Large single transactions (> QAR 50,000)
│  ├─ Structured transactions (multiple just below thresholds)
│  ├─ Third-party transfers (non-matching names)
│  └─ Dormant period followed by sudden activity
│
├─ Red Flags:
│  ├─ Deposits significantly exceed declared income
│  ├─ Multiple cash deposits just under reporting threshold
│  ├─ Transfers to/from sanctioned jurisdictions
│  ├─ Round-number transactions (QAR 10,000 exactly)
│  ├─ Rapid movement of funds (in-and-out patterns)
│  └─ Unexplained third-party transfers

FOR NEW CUSTOMERS (no T24 history):
├─ Analyze bank statements from other institutions
├─ Look for same red flags in provided statements
├─ Note: Limited data — document as "limited history available"
└─ Recommend enhanced monitoring for first 6 months
```

## 6.4 PEP / Sanctions Initial Screening

```
OBJECTIVE: Perform initial PEP and Sanctions screening
           (Compliance performs final definitive screening)

PROCEDURE:
├─ Step 1: Screen against available databases
│  ├─ World-Check (Refinitiv)
│  ├─ Dow Jones Risk & Compliance
│  ├─ QIB Internal PEP list
│  └─ Note: This is INITIAL screening — not final
│
├─ Step 2: Document screening results
│  ├─ PEP match found: YES / NO
│  │  └─ If YES: Note nature of PEP status
│  │     ├─ Current or former political position
│  │     ├─ Family member or close associate
│  │     └─ Country/jurisdiction of political role
│  │
│  ├─ Sanctions match found: YES / NO
│  │  └─ If YES: STOP — Escalate to Compliance IMMEDIATELY
│  │     ├─ Do NOT proceed with CDD
│  │     ├─ Do NOT inform customer
│  │     └─ Document and escalate
│  │
│  └─ Adverse media found: YES / NO
│     └─ If YES: Document relevant articles/references
│
├─ Step 3: CDD recommendation on PEP/Sanctions
│  ├─ No matches → Normal processing
│  ├─ PEP (no sanctions) → Note for Compliance, recommend enhanced monitoring
│  ├─ Sanctions match → IMMEDIATE ESCALATION (do not proceed)
│  └─ Adverse media → Document, recommend Compliance review
│
└─ IMPORTANT: CDD does NOT make the final PEP/Sanctions decision.
   Compliance performs the definitive screening and determination.
```

## 6.5 Document Authenticity Review

```
OBJECTIVE: Verify that submitted documents appear genuine and unaltered.

CHECKS:
├─ Visual Inspection
│  ├─ Document quality (not blurry/too perfect)
│  ├─ Consistent fonts and formatting
│  ├─ No visible alterations or white-out
│  ├─ Stamps and seals appear genuine
│  ├─ Signatures present where required
│  └─ Dates are logical and sequential
│
├─ Content Verification
│  ├─ Company name on employment letter matches CR
│  ├─ Address on utility bill matches declared address
│  ├─ Bank statement format matches known bank templates
│  ├─ Salary amount consistent across documents
│  └─ QID number consistent across all documents
│
├─ Cross-Reference Checks
│  ├─ Employment letter date vs salary certificate date
│  ├─ Bank statement period vs KYC submission date
│  ├─ CR registration dates vs business claim
│  └─ Address dates vs move-in claims
│
└─ Red Flags for Fraudulent Documents
   ├─ Inconsistent fonts within same document
   ├─ Scanned quality too perfect (possibly digitally created)
   ├─ Company letterhead not matching known designs
   ├─ Unrealistic income levels for occupation
   ├─ Same document template used with different details
   ├─ Unsigned or un-stamped official documents
   └─ Dates falling on weekends/holidays for government docs
```

---

# 7. DOCUMENT DEEP-DIVE INVESTIGATION

## 7.1 When Deep-Dive is Triggered

```
A deep-dive investigation is required when:

1. RM flagged MAJOR DISCREPANCIES
   ├─ requires_deep_dive = true (set by system)
   ├─ Case tagged with "DEEP_DIVE_REQUIRED" label
   └─ You see orange/red badge in case list

2. Business Team recommended CDD investigation
   ├─ Business recommendation includes: "deep-dive needed"
   ├─ Specific discrepancies noted in Business notes
   └─ CDD notified with specific investigation areas

3. Risk score ≥ 60 (CRITICAL)
   ├─ Automatic deep-dive trigger
   ├─ Multiple risk factors exceed thresholds
   └─ Enhanced investigation required

4. Checker returned case with deep-dive request
   ├─ Checker identified gaps in initial CDD
   ├─ Additional investigation required
   └─ Specific areas identified by Checker
```

## 7.2 Deep-Dive Procedure

```
STEP 1: UNDERSTAND THE DISCREPANCY
├─ Read RM verification notes carefully
├─ Identify specific fields with discrepancies
├─ Note the RM's classification (MINOR vs MAJOR)
├─ Review Business Team's recommendation
└─ Understand context: Why does this discrepancy matter?

STEP 2: GATHER ADDITIONAL EVIDENCE
├─ Request from RM/Branch:
│  ├─ "Please provide additional verification for [specific document]"
│  ├─ "Can you contact the customer to clarify [specific issue]?"
│  └─ "Please check with [employer/institution] directly"
│
├─ Request from Customer (via system):
│  ├─ Updated documents addressing the discrepancy
│  ├─ Written explanation of the difference
│  └─ Supporting evidence (pay stubs, contracts, etc.)
│
├─ Verify Independently:
│  ├─ Company Registry: Verify employer details
│  ├─ T24: Check existing transaction patterns
│  ├─ DMS: Review historical document changes
│  └─ Public records: Verify address, employment, etc.

STEP 3: ANALYZE AND CONCLUDE
├─ Determine discrepancy resolution:
│  ├─ RESOLVED — Legitimate explanation confirmed
│  │  └─ Example: Income increased due to documented promotion
│  │
│  ├─ PARTIALLY RESOLVED — Some explanation, not fully confirmed
│  │  └─ Example: Address changed but proof is 4 months old
│  │
│  ├─ UNRESOLVED — No satisfactory explanation
│  │  └─ Example: Income claim significantly exceeds evidence
│  │
│  └─ SUSPICIOUS — Indicators of potential fraud
│     └─ Example: Documents appear altered, inconsistent sources

STEP 4: DOCUMENT RESOLUTION
├─ Write detailed deep-dive report (see template)
├─ Reference all evidence gathered
├─ State conclusion clearly
├─ Provide recommendation:
│  ├─ RESOLVED → Proceed with standard CDD recommendation
│  ├─ PARTIALLY RESOLVED → Recommend enhanced monitoring
│  ├─ UNRESOLVED → Recommend Compliance escalation
│  └─ SUSPICIOUS → Recommend rejection / SAR filing

STEP 5: UPDATE RISK ASSESSMENT
├─ If discrepancy resolved → Risk may decrease
├─ If discrepancy unresolved → Risk increases
├─ Update risk assessment in CDD report
└─ Note impact on overall risk rating
```

## 7.3 Communication with RM/Branch

```
REQUESTING ADDITIONAL VERIFICATION FROM RM:

In RRGP → Case → Click "Request RM Verification"
├─ Select: RM who originally verified the case
├─ Write request:
│  "Additional verification required for Case [Case ID]
│   
│   Please verify the following:
│   1. [Specific item to verify]
│   2. [Specific item to verify]
│   
│   Please respond within [X hours].
│   Attach any supporting evidence."
│
├─ RM receives notification (email + dashboard)
├─ RM responds with findings
├─ Response attached to case automatically
└─ SLA: RM must respond within 4 hours

IMPORTANT RULES:
├─ Do NOT contact the customer directly (go through RM)
├─ Be specific about what you need verified
├─ Document the RM's response in your CDD report
└─ If RM unavailable, escalate to RM's supervisor
```

---

# 8. RISK ASSESSMENT DOCUMENTATION

## 8.1 Risk Factors to Assess

```
For each case, evaluate and document:

FACTOR 1: Customer Profile Risk
├─ Nationality risk level (OFAC/Enhanced/Normal)
├─ PEP status (Yes/No/Relative)
├─ Occupation risk category (High/Medium/Low)
├─ Age profile
└─ Customer history with QIB

FACTOR 2: Financial Profile Risk
├─ Source of funds clarity
├─ Activity ratio (expected deposits / income)
├─ Cash handling level
├─ International transaction exposure
└─ Account purpose clarity

FACTOR 3: Document Risk
├─ Document completeness
├─ Document consistency
├─ Discrepancies identified (resolved/unresolved)
├─ Document authenticity assessment
└─ Verification completeness

FACTOR 4: Behavioral Risk
├─ Customer cooperation level
├─ Willingness to provide documentation
├─ Consistency of verbal vs documented information
├─ Contact center interaction outcome
└─ Response timeliness
```

## 8.2 Risk Rating Updates

```
After CDD review, you may update the risk rating:

Original Risk (from system) → CDD Updated Risk (your assessment):

├─ LOWER risk:
│  ├─ Discrepancies fully resolved with evidence
│  ├─ Source of funds clearly verified
│  ├─ Business legitimacy confirmed
│  ├─ PEP confirmed as former (no longer active)
│  └─ All documents authenticated
│
├─ SAME risk:
│  ├─ Findings consistent with original assessment
│  ├─ No new information materially changes risk
│  └─ Standard CDD completed
│
├─ HIGHER risk:
│  ├─ New concerns discovered during investigation
│  ├─ Discrepancies could not be resolved
│  ├─ Source of funds unclear after investigation
│  ├─ Adverse media found
│  └─ Document authenticity concerns

MANDATORY: Justify any risk rating change in CDD report
           with specific evidence references.
```

---

# 9. CDD REPORT PREPARATION

## 9.1 CDD Report Structure

```
A complete CDD report contains the following sections:

1. EXECUTIVE SUMMARY (Mandatory)
   ├─ Case overview (1-2 paragraphs)
   ├─ Key findings summary
   ├─ Risk rating (original → updated)
   └─ CDD recommendation

2. CUSTOMER PROFILE (Mandatory)
   ├─ Full name, QID, nationality
   ├─ Employment details
   ├─ Financial profile
   ├─ PEP status
   └─ Customer history with QIB

3. PREVIOUS STAGE REVIEW (Mandatory)
   ├─ RM verification results
   ├─ Business Team recommendation
   ├─ Discrepancies identified (if any)
   └─ Documents available for review

4. DUE DILIGENCE FINDINGS (Mandatory)
   ├─ Source of funds assessment
   ├─ Business relationship assessment
   ├─ Transaction pattern analysis
   ├─ Document authenticity review
   └─ PEP/Sanctions initial screening

5. DEEP-DIVE RESULTS (If applicable)
   ├─ Discrepancies investigated
   ├─ Additional evidence gathered
   ├─ Resolution status
   └─ Impact on risk assessment

6. RISK ASSESSMENT (Mandatory)
   ├─ Risk factors evaluated
   ├─ Risk score (original → CDD-updated)
   ├─ Risk rating (original → CDD-updated)
   ├─ Justification for any changes
   └─ Key risk indicators identified

7. EVIDENCE LIST (Mandatory)
   ├─ All documents reviewed
   ├─ All sources consulted
   ├─ All communications (RM, customer, external)
   └─ Reference numbers for each

8. CDD RECOMMENDATION (Mandatory)
   ├─ APPROVE: No significant concerns, proceed to Compliance
   ├─ APPROVE WITH CONDITIONS: Recommend enhanced monitoring
   ├─ ESCALATE: Complex case requiring management review
   └─ REJECT: Significant concerns that cannot be mitigated

9. MAKER SIGN-OFF (Mandatory)
   ├─ CDD Officer name and ID
   ├─ Digital signature
   ├─ Timestamp
   └─ Declaration: "I have reviewed all available evidence and
      prepared this report in accordance with QIB CDD procedures."
```

## 9.2 Report Templates

### Template: Standard CDD Report

```
═══════════════════════════════════════════════════════════════
              CDD ENHANCED DUE DILIGENCE REPORT

Case ID:            [CHG-XXXXXXXXXX]
KYC ID:             [KYC-XXXXXXXXXX]
Customer Name:       [Full Name]
QID/Passport:       [Number]
Report Date:         [DD-MMM-YYYY]
CDD Maker:           [Full Name] | EMP-[XXXXX]
CDD Checker:         [To be assigned]

───────────────────────────────────────────────────────────────
SECTION 1: EXECUTIVE SUMMARY

[Customer name] submitted a KYC application for [account type]
on [date] via [channel]. The system assessed a risk score of
[score]/100 ([rating]) based on [key risk factors].

Key Findings:
├─ [Finding 1]
├─ [Finding 2]
└─ [Finding 3]

Risk Rating: [ORIGINAL] → [UPDATED AFTER CDD]
CDD Recommendation: [APPROVE / APPROVE WITH CONDITIONS / ESCALATE / REJECT]

───────────────────────────────────────────────────────────────
SECTION 2: CUSTOMER PROFILE

Full Name:           [Name]
QID/Passport:       [Number]
Nationality:         [Country]
Date of Birth:       [Date]
Occupation:          [Occupation]
Employer:            [Company Name]
Monthly Income:      QAR [Amount]
PEP Status:          [YES / NO / RELATIVE]
FATCA Status:        [YES / NO]
Customer Since:      [Date / New Customer]

───────────────────────────────────────────────────────────────
SECTION 3: PREVIOUS STAGE REVIEW

RM Verification:
├─ Verified By: [RM Name] on [Date]
├─ Verification Result: [MATCH / DISCREPANCIES FOUND]
├─ Discrepancies: [Details if any]
└─ RM Recommendation: [Normal / CDD Deep-Dive]

Business Team:
├─ Reviewed By: [Analyst Name] on [Date]
├─ Business Recommendation: [MAINTAIN / EXIT]
├─ Deep-Dive Required: [YES / NO]
└─ Notes: [Business Team notes]

───────────────────────────────────────────────────────────────
SECTION 4: DUE DILIGENCE FINDINGS

4.1 Source of Funds:
├─ Declared Source: [Category]
├─ Verification Result: [Verified / Partially Verified / Unverified]
├─ Evidence: [List documents reviewed]
└─ Conclusion: [Assessment]

4.2 Business Relationship:
├─ Account Purpose: [Purpose]
├─ Expected Activity: [Monthly volume]
├─ Activity Ratio: [Ratio] (deposits/income)
├─ Risk Flags: [Any flags identified]
└─ Conclusion: [Assessment]

4.3 Transaction Pattern (if existing customer):
├─ Analysis Period: [Dates]
├─ Average Monthly Volume: QAR [Amount]
├─ Cash Deposit Ratio: [Percentage]
├─ International Transfers: [Frequency, destinations]
├─ Red Flags: [Any identified]
└─ Conclusion: [Assessment]

4.4 Document Authenticity:
├─ Documents Reviewed: [List]
├─ Authenticity Assessment: [Genuine / Concerns / Suspected Fraud]
├─ Issues Found: [If any]
└─ Conclusion: [Assessment]

4.5 PEP/Sanctions Initial Screening:
├─ PEP Match: [YES / NO]
│  └─ [If YES: Details of PEP status]
├─ Sanctions Match: [YES / NO]
│  └─ [If YES: ESCALATE IMMEDIATELY]
├─ Adverse Media: [YES / NO]
│  └─ [If YES: Reference articles]
└─ Note: Final determination by Compliance.

───────────────────────────────────────────────────────────────
SECTION 5: DEEP-DIVE RESULTS (If applicable)

Discrepancy #1: [Description]
├─ Original Finding: [RM noted what]
├─ Investigation: [What CDD investigated]
├─ Additional Evidence: [What was gathered]
├─ Resolution: [RESOLVED / PARTIALLY RESOLVED / UNRESOLVED]
└─ Impact: [How this affects risk assessment]

[Repeat for each discrepancy]

───────────────────────────────────────────────────────────────
SECTION 6: RISK ASSESSMENT

Risk Score: [Original] → [CDD Updated]
Risk Rating: [Original] → [CDD Updated]

Factor Breakdown:
├─ Nationality Risk: [Score]
├─ PEP Status: [Score]
├─ Occupation Risk: [Score]
├─ Activity Ratio: [Score]
├─ Source of Funds: [Score]
├─ FATCA: [Score]
└─ Transaction Pattern: [Score]

Justification for Rating Change (if any):
[Detailed explanation with evidence references]

───────────────────────────────────────────────────────────────
SECTION 7: EVIDENCE LIST

| #  | Document / Source          | Reference        | Date     |
|----|--------------------------|------------------|----------|
| 1  | [Document name]          | [DMS/System ref] | [Date]   |
| 2  | [Document name]          | [DMS/System ref] | [Date]   |
| 3  | [External source]        | [URL/Reference]  | [Date]   |
| 4  | [RM Communication]       | [Case note ref]  | [Date]   |

───────────────────────────────────────────────────────────────
SECTION 8: CDD RECOMMENDATION

Recommendation: [APPROVE / APPROVE WITH CONDITIONS / ESCALATE / REJECT]

Conditions (if applicable):
├─ [Condition 1]
├─ [Condition 2]
└─ [Condition 3]

Rationale:
[Detailed explanation of why this recommendation is made,
referencing evidence and risk assessment]

───────────────────────────────────────────────────────────────
SECTION 9: MAKER SIGN-OFF

CDD Officer: [Full Name]
Employee ID: EMP-[XXXXX]
Department: CDD Operations
Date: [DD-MMM-YYYY HH:MM]

Declaration: I have reviewed all available evidence and prepared
this report in accordance with QIB CDD procedures. All findings
are documented accurately and all recommendations are based on
the evidence reviewed.

Digital Signature: [APPLIED]
═══════════════════════════════════════════════════════════════
```

---

# 10. T24 SYNCHRONIZATION

## 10.1 When to Sync with T24

```
T24 SYNCHRONIZATION is performed at the CDD stage:

BEFORE CDD REVIEW:
├─ Pull customer profile from T24
├─ Pull transaction history (last 12 months)
├─ Pull existing account details
└─ Pull risk flags (if any existing flags in T24)

AFTER CDD REVIEW (before routing to Compliance):
├─ Update customer profile in T24:
│  ├─ CDD review completed: YES
│  ├─ CDD review date: [Date]
│  ├─ CDD risk rating: [Rating]
│  ├─ CDD officer: [Name/ID]
│  └─ Enhanced monitoring flag: [If applicable]
│
├─ Link case to customer in T24:
│  ├─ Case ID reference
│  ├─ KYC application reference
│  └─ EDD case status
│
└─ Flag if high-risk in T24:
   ├─ Risk flag: HIGH / CRITICAL
   ├─ PEP flag: YES (if applicable)
   ├─ Enhanced monitoring: YES (if applicable)
   └─ Review schedule: [Quarterly / Annual]
```

## 10.2 T24 Sync Procedure

```
Step 1: Access T24 via RRGP integration
        ├─ In Case Details → Click "T24 Sync"
        ├─ System retrieves customer profile
        └─ Displays current T24 data

Step 2: Review T24 data for discrepancies
        ├─ Compare T24 profile with KYC application
        ├─ Note any differences
        └─ Include in CDD findings

Step 3: Prepare T24 update fields
        ├─ Select fields to update
        ├─ Review values before submission
        └─ Add sync notes

Step 4: Submit T24 update
        ├─ Click "Submit T24 Update"
        ├─ System sends update via T24 API
        ├─ Confirmation received
        └─ Sync audit trail recorded

Step 5: Verify update
        ├─ Click "Verify T24 Sync"
        ├─ Confirm updated fields
        └─ Note in CDD report: "T24 synchronized on [date]"

⚠️ T24 SYNC ERRORS:
├─ If T24 unavailable → Queue update, note in case
├─ If update rejected → Review error, correct data, retry
├─ If field mismatch → Escalate to IT support
└─ All errors logged in audit trail
```

---

# 11. SLA & PERFORMANCE METRICS

## 11.1 SLA Targets

```
┌──────────────────────────────────────────────────────────────┐
│                    CDD SLA REQUIREMENTS                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Standard CDD Review:           24 hours                     │
│  Deep-Dive Investigation:       48 hours                     │
│  Rework (returned by Checker):  8 hours                      │
│  PEP/Sanctions cases:           24 hours (urgent priority)   │
│  Checker Review:                8 hours                      │
│  T24 Synchronization:           1 hour after CDD completion  │
│                                                              │
│  SLA starts from: Case assignment timestamp                   │
│  SLA excludes: Customer response wait time                   │
│                                                              │
│  Segment-specific adjustments:                               │
│  ├─ Mass Banking: Standard SLA                              │
│  ├─ Tamayuz: SLA - 4 hours (accelerated)                    │
│  └─ Private Banking: Standard SLA + dedicated officer       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 11.2 Escalation Timeline

```
SLA at 50% (12 hours for standard):
├─ System sends reminder email to CDD Officer
├─ Dashboard highlights case in amber
└─ Action: Prioritize this case

SLA at 80% (19 hours for standard):
├─ System notifies CDD Manager
├─ Dashboard highlights case in orange
└─ Action: CDD Manager checks if assistance needed

SLA at 100% (24 hours for standard):
├─ System auto-escalates to CDD Manager
├─ Case moves to escalation queue
├─ Dashboard highlights case in red
└─ Action: CDD Manager reassigns or takes over

SLA at 120% (29 hours for standard):
├─ System alerts CDD Head
├─ Executive dashboard notification
└─ Action: Department-level intervention
```

## 11.3 Performance KPIs

```
YOUR PERFORMANCE IS MEASURED ON:

1. SLA Compliance Rate
   ├─ Target: ≥ 95%
   ├─ Formula: (Cases completed within SLA / Total cases) × 100
   └─ Reviewed: Monthly

2. Quality Score (Checker pass rate)
   ├─ Target: ≥ 90% first-time pass
   ├─ Formula: (Cases approved by Checker / Cases submitted) × 100
   └─ Reviewed: Monthly

3. Average Processing Time
   ├─ Target: < 18 hours (standard), < 36 hours (deep-dive)
   ├─ Measured: From assignment to Checker submission
   └─ Reviewed: Weekly

4. Deep-Dive Resolution Rate
   ├─ Target: ≥ 85% resolved
   ├─ Formula: (Discrepancies resolved / Total investigated) × 100
   └─ Reviewed: Monthly

5. Report Quality Score
   ├─ Target: ≥ 4.0 / 5.0 (from Checker feedback)
   ├─ Measured: Checker rates each report
   └─ Reviewed: Monthly
```

---

# 12. ESCALATION PROCEDURES

## 12.1 When to Escalate

```
ESCALATE TO CDD MANAGER:
├─ Complex case exceeding your expertise
├─ Multiple unresolved discrepancies
├─ Suspected fraud requiring senior review
├─ Policy ambiguity requiring interpretation
├─ Customer complaint received during CDD
├─ SLA breach risk due to complexity
└─ Rework cycle exceeds 2 returns

ESCALATE TO CDD HEAD:
├─ PEP/Sanctions match with regulatory implications
├─ Case involving QIB board member or senior staff
├─ Cross-border investigation requirement
├─ Legal opinion required
├─ Regulatory inquiry related to the case
└─ Any case CDD Manager cannot resolve

ESCALATE TO COMPLIANCE (bypass normal flow):
├─ Confirmed sanctions match
├─ Suspected money laundering
├─ Suspected terrorist financing
├─ Customer on internal blacklist
└─ Adverse media indicating criminal activity
```

## 12.2 Escalation Process

```
In RRGP → Case → Click "Escalate"
├─ Select escalation target: [CDD Manager / CDD Head / Compliance]
├─ Select reason from dropdown
├─ Write escalation note:
│  ├─ What investigation was performed
│  ├─ What was found / not found
│  ├─ Why escalation is needed
│  └─ What you recommend
├─ Attach CDD report (partial or complete)
├─ Click "Submit Escalation"
└─ Recipient receives IMMEDIATE notification

FOR URGENT ESCALATIONS (Sanctions/Fraud):
├─ ALSO call Compliance Hotline: Ext. 5555
├─ Do NOT proceed with any further CDD work
├─ Do NOT contact the customer
├─ Secure all case documents
└─ Document everything in system
```

---

# 13. QUALITY ASSURANCE STANDARDS

## 13.1 CDD Report Quality Standards

```
A HIGH-QUALITY CDD REPORT:
├─ Is complete (all required sections filled)
├─ Contains specific evidence references (not generalizations)
├─ States facts, not opinions (unless clearly labeled as assessment)
├─ Is internally consistent (no contradictions)
├─ Addresses all previous stage concerns
├─ Has a clearly justified recommendation
├─ Uses professional, clear language
├─ Contains no spelling or factual errors
├─ Can be read independently (no assumed context)
└─ Would withstand regulatory scrutiny

A POOR-QUALITY CDD REPORT:
├─ Has blank or incomplete sections
├─ Uses vague language: "documents seem okay"
├─ Contradicts itself: "low risk" but "recommend enhanced monitoring"
├─ Ignores discrepancies flagged by RM
├─ Lacks evidence references
├─ Contains personal bias: "customer looks honest"
├─ Has copy-pasted content from another case
├─ Missing Maker sign-off
└─ Would fail regulatory audit
```

## 13.2 Common Checker Rework Reasons

```
Avoid these common issues:

1. "Incomplete source of funds assessment"
   → Always complete all 5 steps in Section 6.1

2. "Risk rating change not justified"
   → Provide specific evidence for every rating change

3. "Deep-dive section blank despite required flag"
   → If deep-dive required, MUST complete Section 7

4. "T24 sync not completed"
   → Always sync T24 before submitting to Checker

5. "Missing evidence references"
   → Every finding must reference a specific document or source

6. "Recommendation contradicts findings"
   → Ensure recommendation logically follows from your findings

7. "Sections copied from template without customization"
   → Customize every section for the specific case
```

---

# 14. APPENDIX: TEMPLATES & CHECKLISTS

## CDD Maker Pre-Submission Checklist

```
Before clicking "Submit to Checker", verify:

□ All case documents reviewed (RM notes, Business notes, customer docs)
□ Source of funds verification completed
□ Business relationship assessed
□ Transaction pattern analyzed (existing customer) OR noted as N/A (new)
□ PEP/Sanctions initial screening performed
□ Document authenticity reviewed
□ Deep-dive completed (if flag was set)
□ CDD Report ALL sections completed
□ Risk assessment updated (if changed from original)
□ Risk rating change justified (if any)
□ Evidence list complete with references
□ T24 synchronization completed
□ Recommendation stated with rationale
□ Professional language throughout
□ No contradictions in report
□ Digital signature applied
```

## CDD Checker Review Checklist

```
Complete ALL items before approving or requesting rework:

□ Maker identity confirmed (not the same as me)
□ All required sections of CDD report present
□ Executive summary accurately reflects findings
□ Customer profile data correct
□ Previous stage review complete
□ Source of funds assessment thorough and evidenced
□ Business relationship assessment complete
□ Transaction analysis appropriate for customer type
□ Document authenticity review conducted
□ PEP/Sanctions screening performed and documented
□ Deep-dive completed (if flag was set)
□ All discrepancies addressed
□ Risk assessment is justified by evidence
□ Evidence list complete and referenced
□ T24 synchronization completed
□ Recommendation is reasonable and consistent with findings
□ Report is professionally written and clear
□ Report could withstand regulatory scrutiny
□ Maker digital signature present
□ I am satisfied with the quality of work

DECISION:
□ APPROVED — Route to Compliance
□ REQUEST REWORK — Return to Maker (specify items)
□ ESCALATE — Send to CDD Manager/Head (specify reason)

Checker Digital Signature: [APPLIED]
```

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│              CDD OFFICER — QUICK REFERENCE                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MAKER PROCESS:                                              │
│  1. Review case (RM + Business notes)                       │
│  2. Investigate (SOF, Business, Transactions, Docs)         │
│  3. Deep-dive (if flagged)                                  │
│  4. Prepare CDD Report (all 9 sections)                    │
│  5. Sync with T24                                           │
│  6. Submit to Checker (digital signature)                   │
│                                                              │
│  CHECKER PROCESS:                                            │
│  1. Review Maker's report                                   │
│  2. Validate against source docs                            │
│  3. Complete quality checklist                              │
│  4. Decide: APPROVE / REWORK / ESCALATE                    │
│  5. Apply digital signature                                │
│                                                              │
│  SLA: 24h Standard | 48h Deep-Dive | 8h Rework             │
│                                                              │
│  SANCTIONS MATCH → STOP & ESCALATE TO COMPLIANCE            │
│  Compliance Hotline: Ext. 5555                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

# DOCUMENT GOVERNANCE & RISK APPROVAL

## Controlled Document Notice

This document is a **controlled operational document** under the RRGP Operational Documentation Governance framework (Enterprise Architecture Document, Section 18). Any updates to this manual must follow the Document Control Workflow and receive **Risk Management Group approval** before becoming effective.

## Risk Governance Approval

```
APPROVAL AUTHORITY:
├─ Document Owner: CDD Operations Department
├─ Review Authority: Risk Management Group
├─ Final Approval: Mr. Rakesh — Head of Risk Governance
├─ Regulatory Review: Compliance Department
└─ No update is effective until Risk Management approval is granted

DOCUMENT UPDATE WORKFLOW:
  Update Proposed → Internal Review (CDD Operations) → Risk Group Review
       → Approval by Mr. Rakesh → Version Update → Distribution to Teams

CHANGE REQUEST:
  All updates must be submitted through the Change Management Framework
  (Enterprise Architecture Document, Section 19) with CR ID: CR-RRGP-YYYY-XXXX
```

## Version History

```
┌─────────┬────────────┬──────────────────────────┬──────────────────────────┐
│ Version │ Date       │ Change Summary           │ Approved By              │
├─────────┼────────────┼──────────────────────────┼──────────────────────────┤
│ 1.0     │ 2026-03-10 │ Initial release          │ Mr. Rakesh (Risk Head)   │
└─────────┴────────────┴──────────────────────────┴──────────────────────────┘
```

---

**Document ID:** DOC-RRGP-003  
**Document Status:** ✅ APPROVED FOR OPERATIONAL USE  
**Version:** 1.0  
**Effective Date:** March 2026  
**Next Review:** September 2026  
**Owner:** CDD Operations Department  
**Risk Approval:** Mr. Rakesh — Head of Risk Governance  
**Classification:** INTERNAL — QIB CONFIDENTIAL
