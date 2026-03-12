# AUTOMATED DECISIONING POLICY FRAMEWORK
## EDD/KYC Request Processing — Fully Governed Automation

**Document Version:** 1.0  
**Effective Date:** March 2026  
**Classification:** Governance & Compliance  
**Policy Owner:** Chief Risk Officer  
**Last Review:** March 12, 2026

---

## EXECUTIVE SUMMARY

This policy enables QIB to progressively introduce **controlled automation** into EDD/KYC decisioning while maintaining regulatory compliance, explainability, and audit integrity.

The policy defines three distinct decisioning modes:
- **Stage A:** Governance & Decision Support (manual decisions with intelligent assistance)
- **Stage B:** Human-in-the-Loop Decisioning (hybrid: system recommends, human approves)
- **Stage C:** Fully Automated System Decisioning (system decides automatically within policy boundaries)

This document governs the movement from Stage A through Stage C, ensuring each request type transitions only when:
- ✅ Data prerequisites are met
- ✅ Source systems are validated
- ✅ Risk conditions are satisfied
- ✅ Control framework is in place
- ✅ Regulatory position is defensible

---

## 1. POLICY PURPOSE & OBJECTIVES

### 1.1 Why Automation?

**Business Drivers:**
- Improve decisioning speed for low-risk requests (target: <30 min vs 2-3 days manual)
- Reduce operational cost through efficient routing
- Increase consistency in rule application across all cases
- Improve customer experience for simple/standard scenarios
- Free skilled reviewers for complex/high-risk cases

**Regulatory Objectives:**
- Reduce false negatives (missed high-risk) through consistent rule application
- Reduce false positives (unnecessary escalations) through evidence-based thresholds
- Demonstrate AML/CFT control effectiveness to regulators
- Improve explainability of all decisions (manual or automated)
- Maintain full audit trail of decisioning logic

**Quality Objectives:**
- Higher quality manual reviews (focused on complex cases)
- Faster identification of high-risk triggers
- More consistent customer treatment
- Better test-and-learn capability through monitoring

### 1.2 Scope of This Policy

**What This Policy Governs:**
- Full automation of low-risk requests under defined conditions
- Hybrid (human-in-loop) decisioning for moderate-risk requests
- Decision support tools for high-risk manual reviews
- Exception handling and fallback procedures
- Governance, controls, and accountability

**What This Policy Does NOT Cover:**
- Customer complaints or dispute resolution
- Regulatory reporting requirements
- Transaction monitoring (handled separately)
- Sanctions screening mechanics (uses separate screening vendor)
- Individual loan or credit decisioning (separate policy)

### 1.3 Success Metrics

**Quantitative Targets:**
- Auto-decision rate for eligible requests: >70%
- Auto-approval rate for low-risk: >60-70%
- False positive rate (over-escalations): <10%
- False negative rate (missed high-risk): <2%
- Post-decision override rate: <5%
- Time to decision: <30 min for auto (vs 2-3 days manual average)

**Control Targets:**
- 100% of auto-decisions have complete audit trail
- 100% of exclusion/fallback triggers are logged
- 100% of rule breaches are identified within 24 hours
- Monthly control testing: 100% of rules validated
- Quarterly exception review: 0 unexplained overrides

---

## 2. SCOPE — REQUEST TYPES & AUTOMATION ELIGIBILITY

### 2.1 Three Decisioning Modes

```
┌─────────────────────────────────────────────────────────────┐
│                   THREE DECISIONING MODES                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ STAGE A: GOVERNANCE & DECISION SUPPORT                      │
│ ├─ Outcome: Manual decision-maker decides                   │
│ ├─ System Role: Provides data, analysis, recommendations    │
│ ├─ Authority: Full human discretion                         │
│ ├─ Audit Trail: Decision rationale required                 │
│ └─ Use Case: Complex cases, high-risk, exceptions           │
│                                                               │
│ STAGE B: HUMAN-IN-THE-LOOP DECISIONING                      │
│ ├─ Outcome: System recommends, human approves/overrides     │
│ ├─ System Role: Applies rules, generates recommendation     │
│ ├─ Authority: Human must review and approve                 │
│ ├─ Audit Trail: Both system reasoning AND human approval    │
│ └─ Use Case: Moderate-risk, clear rules, time-sensitive     │
│                                                               │
│ STAGE C: FULLY AUTOMATED SYSTEM DECISIONING                 │
│ ├─ Outcome: System decides, no human review required        │
│ ├─ System Role: Evaluates request against policy, decides   │
│ ├─ Authority: Pre-approved by policy & governance           │
│ ├─ Audit Trail: Complete decision reasoning & evidence      │
│ ├─ Safeguard: Automatic fallback-to-human on any exception  │
│ └─ Use Case: Low-risk, simple scenarios, clear eligibility  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Request Types & Their Assignment

#### **TIER 1: FULLY AUTOMATED (Stage C)**
Requests that can be AUTO-APPROVED or AUTO-REJECTED with high confidence

```
REQUEST TYPE: Low-Risk Staff Account Update
├─ Risk Profile: Internal staff, existing customer, document update
├─ Eligible If:
│  ├─ KYC on file >2 years old
│  ├─ No negative events in past 24 months
│  ├─ Occupation verified (employed staff)
│  ├─ Document valid & not expired
│  └─ No PEP/Sanctions flags
├─ AUTO-APPROVAL Conditions:
│  └─ All above + no value threshold change
├─ AUTO-REJECTION Conditions:
│  └─ Expired identity document
│  └─ Sanctions match (immediate escalation to compliance)
├─ FALLBACK-TO-HUMAN Triggers:
│  └─ PEP flag detected
│  └─ Multiple risk indicators
│  └─ Data completeness <95%
└─ Estimated Auto Rate: 85-90%

REQUEST TYPE: Low-Risk Qatari National (Below Threshold)
├─ Risk Profile: Qatari national, individual account, routine transaction
├─ Eligible If:
│  ├─ Nationality verified (Qatari)
│  ├─ Age 21-65
│  ├─ Employment verified
│  ├─ Income >QAR 300K/month OR net worth established
│  ├─ No occupation red flags (standard employment)
│  ├─ No PEP indicators
│  ├─ Sanctions/Adverse Media check passed
│  └─ Source of funds clear (salary/investment)
├─ AUTO-APPROVAL: All conditions met + confidence >95%
├─ AUTO-ESCALATE: Risk score >60
├─ FALLBACK-TO-HUMAN: Any data missing/stale
└─ Estimated Auto Rate: 60-70%

REQUEST TYPE: Document Completeness Verification
├─ Risk Profile: Customer provides missing documents
├─ Eligible If:
│  ├─ Documents received match requirements
│  ├─ Document quality sufficient (readability, completeness)
│  ├─ No new risk flags in documents
│  └─ Case had clear decision-blocking issue (not judgment call)
├─ AUTO-APPROVAL: Documents resolve the issue + all checks pass
├─ AUTO-REJECTION: Documents show increased risk
├─ FALLBACK-TO-HUMAN: Judgment call needed on document sufficiency
└─ Estimated Auto Rate: 70-75%
```

#### **TIER 2: HUMAN-IN-THE-LOOP (Stage B)**
Requests where system makes recommendation, human must approve

```
REQUEST TYPE: Moderate-Risk Individual (Threshold Border)
├─ Risk Profile: Meets some risk criteria but not all
├─ Eligible If:
│  ├─ Risk score 40-75 (medium-risk band)
│  ├─ Most data available (>90%)
│  ├─ One or two moderate concerns (elevated income, business owner)
│  └─ No sanctions/PEP/fraud indicators
├─ SYSTEM MAKES RECOMMENDATION:
│  ├─ Approve if risk score <50 + no escalation triggers
│  ├─ Request more documents if source of wealth unclear
│  ├─ Escalate if we cannot verify key claims
│  └─ All with full evidence chain
├─ HUMAN APPROVES: Reviews recommendation + evidence, approves/overrides
├─ FALLBACK-TO-HUMAN: All cases (by definition of Stage B)
└─ Estimated Auto-Recommend Rate: 50-60%, Human Approval Rate: 70-85%

REQUEST TYPE: Business Owner / Complex Source of Wealth
├─ Risk Profile: Multiple income sources, some self-employment
├─ Eligible If:
│  ├─ Primary occupation verified (business owner, director)
│  ├─ Business details provided (industry, years, turnover)
│  ├─ Source of wealth categories identified
│  ├─ Risk score suggests mid-range concern
│  └─ No sanctions/PEP indicators
├─ SYSTEM MAKES RECOMMENDATION:
│  ├─ Request specific documents (tax returns, business registration)
│  ├─ Escalate if business type is high-risk (money exchange, import/export)
│  ├─ Approve if all documents provided + income consistent with activity
│  └─ Escalate if source of wealth unclear or inconsistent
├─ HUMAN APPROVES: Reviews docs, verifies claims, approves/escalates
├─ FALLBACK-TO-HUMAN: All cases
└─ Estimated Decision Rate: 100% human-reviewed
```

#### **TIER 3: MANUAL REVIEW WITH DECISION SUPPORT (Stage A)**
High-risk or exceptional cases — system informs, human decides

```
REQUEST TYPE: High-Risk Occupation / Offshore Jurisdiction
├─ Risk Profile: Occupation or residence triggers enhanced scrutiny
├─ Examples: Politicians, military, lawyers, high-net-worth, non-citizens
├─ System Role: 
│  ├─ Identify risk category automatically
│  ├─ Assess completeness of CDD documentation
│  ├─ Flag any inconsistencies
│  └─ Provide decision support (comparables, precedents)
├─ Human Reviews: Full CDD, makes discretionary decision
├─ Automation Level: 0% (full human authority)
└─ Decision SLA: 3-5 business days

REQUEST TYPE: Exceptional / Anomalous Situations
├─ Examples: 
│  ├─ High-risk jurisdiction residence + high transaction volume
│  ├─ PEP or family of PEP
│  ├─ Adverse media hits (but not clear sanctions)
│  ├─ Complex business structure
│  └─ Transaction patterns inconsistent with profile
├─ System Role: Highlights anomaly, provides context
├─ Human Reviews: Investigation-level review, makes judgment call
├─ Automation Level: 0% (exceptional by definition)
└─ Decision SLA: 5-10 business days
```

### 2.3 Automation Eligibility Matrix

| Request Type | Stage | Auto Rate | Confidence | Risk | Fallback |
|--------------|-------|-----------|-----------|------|----------|
| **Low-Risk Staff Update** | C | 85-90% | Very High | Very Low | Human-required tags |
| **Qatari National <Threshold** | C | 60-70% | High | Low | Missing data, PEP flag |
| **Doc Verification (Simple)** | C | 70-75% | High | Low | Judgment call |
| **Moderate-Risk Individual** | B | 50-60%→85% | Medium | Medium | Always → human review |
| **Business Owner** | B | 40-50%→80% | Medium | Medium | Always → human review |
| **High-Risk Occupation** | A | 0% | N/A | High | All decisions |
| **PEP/Exception** | A | 0% | N/A | Very High | All decisions |

---

## 3. ELIGIBILITY RULES FOR FULL AUTOMATION (Stage C)

For a request to be eligible for full automation, ALL of the following must be true:

### 3.1 Data Prerequisites

The system must have complete and current data:

```
Required Data Completeness:
├─ Identity Information: 100% (name, DOB, nationality, ID number/expiry)
├─ Contact Information: 100% (address, phone, email)
├─ Employment Information: 100% (designation, employer, start date)
├─ Financial Information: 100% (monthly income, source of funds, net worth range)
├─ Risk Indicators: 100% (PEP, sanctions, adverse media checks)
└─ Supporting Documents: 95%+ (identity, employment verification)

Data Freshness Requirements:
├─ Identity document: Not expired, verified <6 months ago
├─ KYC records: Updated <2 years ago (staff accounts), <6 months (regular)
├─ Employment verification: Confirmed <3 months ago
├─ Source of funds: Stated <6 months ago, no contradictions
├─ PEP/Sanctions check: Passed <30 days ago
└─ Transaction monitoring: No alerts in past 30 days
```

### 3.2 Source Systems & Validation

All data must come from validated, documented sources:

```
Mandatory Source Systems:
├─ T24 Core Banking System
│  ├─ Customer master data (name, address, phone)
│  ├─ Identity document details
│  ├─ Employment information (if on file)
│  └─ Account profile & history
│
├─ KYC Management System
│  ├─ KYC form submission date & status
│  ├─ All KYC-captured fields
│  ├─ Document repository links
│  └─ Last KYC update timestamp
│
├─ AML/Screening System
│  ├─ Sanctions matches (yes/no/flag)
│  ├─ PEP database hits
│  ├─ Adverse media alerts
│  └─ Screening history & timestamps
│
└─ CRM System
   ├─ Relationship history
   ├─ Complaints/disputes
   ├─ Negative events
   └─ Last interaction date

Source Validation Rules:
├─ Any system outage → fallback to human review (no auto-decision)
├─ Aged data (>freshness thresholds) → fallback to human review
├─ Conflicting data between systems → escalate immediately
└─ Unverified/unconfirmed data → fallback to human review
```

### 3.3 Mandatory Validation Checks

System must perform these checks before any automation:

```
Identity Validation:
├─ Name matches across all sources (T24, KYC, CRM)
├─ DOB is valid and consistent
├─ ID number format is valid
├─ ID document not expired
├─ ID on whitelist (no fraudulent types)
└─ FAIL → Auto-Reject as insufficient identity

Sanctions & PEP Validation:
├─ Passed recent AML screening (within 30 days)
├─ No active PEP matches in system
├─ No adverse media alerts excluding old false positives
├─ No record in internal watchlist
└─ FAIL → Immediate escalation to compliance officer (STOP)

KYC Status Validation:
├─ KYC form completed and signed
├─ All mandatory fields on form filled
├─ Required documents uploaded
├─ No "pending review" status items
└─ FAIL → Request customer to complete KYC → fallback to human

Data Consistency Checks:
├─ Identity (name, DOB, nationality) consistent across systems
├─ Employment claimed matches T24 or external source
├─ Income figure reasonable for stated occupation
├─ Source of funds explanation aligns with income source
├─ No contradictions between different form sections
└─ FAIL → Flag inconsistencies → escalate to analyst
```

### 3.4 KYC/CDD Conditions for Automation

Before auto-deciding, system must verify:

```
INITIAL KYC (for new customers):
├─ Collect standard KYC form (Section 1-6)
├─ Verify identity document
├─ Confirm employment/occupation
├─ Capture source of income & wealth
├─ Confirm country of residence
├─ Obtain sanctions/PEP confirmation
└─ Decision: Only LOW-RISK staff auto-approve

ENHANCED DUE DILIGENCE (triggered by risk indicators):
├─ High-risk occupation (lawyer, accountant, military, politicians)
├─ Non-citizen or offshore residence
├─ Expected transaction volume >QAR 5M/month
├─ Self-employed / business owner
├─ Complex source of wealth
├─ PEP family member
└─ Condition: MUST have CDD approval before auto-decision

SIMPLIFIED DUE DILIGENCE (low-risk Qatari nationals):
├─ Age 21-65, Qatari national, employed
├─ Standard occupation (not high-risk)
├─ Income verifiable
├─ Basic KYC document
└─ Eligible for auto-approval if all conditions clear
```

### 3.5 Risk Score Thresholds

All eligible requests must fall within safe risk bands:

```
RISK SCORE CALCULATION:
Base Score: 0

Risk Factors:
├─ Occupation Risk: +0 to +40 points
│  ├─ Standard (employee): 0
│  ├─ Business owner: +10
│  ├─ High-risk profession (lawyer, accountant): +20
│  ├─ Very high-risk (military, government): +30
│  └─ Banned occupations: +100 (auto-reject)
│
├─ Geographic Risk: +0 to +30 points
│  ├─ Qatari national: 0
│  ├─ GCC national: +5
│  ├─ Developed country national: +10
│  ├─ Medium-risk jurisdiction: +20
│  └─ High-risk jurisdiction: +30
│
├─ Financial Risk: +0 to +25 points
│  ├─ Income <QAR 500K/month: 0
│  ├─ Income 500K-2M/month: +5
│  ├─ Income 2M-5M/month: +10
│  ├─ Income >5M/month: +15
│  └─ Unclear/unverified income: +25
│
├─ Source of Wealth: +0 to +20 points
│  ├─ Salary earnings: 0
│  ├─ Business earnings (established): +5
│  ├─ Investment income: +10
│  ├─ Gift/inheritance: +15
│  └─ Unclear/vague source: +20
│
└─ Compliance History: -5 to +15 points
   ├─ No negative events (3 years): -5 (discount)
   ├─ Single minor alert (checked/resolved): 0
   ├─ Multiple minor alerts: +5
   ├─ One moderate alert (pending): +10
   └─ Serious/unresolved negative event: +15

RISK BANDS:
├─ 0-35: LOW RISK (auto-eligible if all other conditions met)
├─ 36-60: MEDIUM RISK (human-in-loop, system recommends)
├─ 61-85: HIGH RISK (full manual review required)
└─ >85: VERY HIGH RISK (immediate escalation + enhanced review)

AUTOMATION THRESHOLDS:
├─ Score 0-35 + all prerequisites met = ELIGIBLE FOR AUTO
├─ Score 0-35 + ANY prerequisite missing = ESCALATE
├─ Score 36-60 = HUMAN-IN-LOOP (Stage B)
├─ Score 61+  = FULL MANUAL (Stage A)
```

### 3.6 Trigger Exclusions — What STOPS Automation

Even if all above are met, automation STOPS if ANY of these are true:

```
ABSOLUTE STOP TRIGGERS:

Sanctions / PEP:
├─ Any match in OFAC, UN, EU sanctions lists → IMMEDIATE ESCALATION
├─ Any PEP indicator → ESCALATION (no auto-approve possible)
├─ Adverse media hit (non-frivolous) → ESCALATION
└─ OUTCOME: Escalate to Compliance Officer (non-negotiable)

Identity Issues:
├─ Identity document expired → AUTO-REJECT
├─ Identity verification failed/inconsistent → ESCALATE
├─ Name mismatch across systems → ESCALATE
└─ Reason code: "Identity verification required"

Required Documents Missing:
├─ Identity document scan missing → ESCALATE
├─ KYC form incomplete → ESCALATE
├─ Source of funds documentation not provided → ESCALATE
└─ System must clearly state which documents required

Recent Negative Events:
├─ Account fraud/compromise in past 30 days → AUTO-REJECT
├─ Regulatory investigation active → ESCALATE
├─ Complaint/dispute filed and pending → ESCALATE
├─ Chargebacks/reversals in past 90 days → ESCALATE
└─ Outcome: Escalate to specialist queue

Data System Issues:
├─ T24 system down or unreachable → ESCALATE (cannot auto-verify)
├─ KYC system down or unreachable → ESCALATE
├─ Screening system down or unreachable → ESCALATE
└─ Outcome: "System unavailable, please contact branch"

High Activity Anomalies:
├─ Expected transaction volume jump >300% vs profile → ESCALATE
├─ Unusual transaction pattern alerts triggered → ESCALATE
├─ Multiple account changes requested simultaneously → ESCALATE
└─ Outcome: Route to analyst for investigation-level review
```

### 3.7 Document Completeness Conditions

For automation to proceed, ALL required documents must be present:

```
REQUIRED DOCUMENTS (ALL):
├─ Identity Verification
│  ├─ Valid government-issued ID (passport, national ID, license)
│  ├─ Clear, legible scan (readability >90%)
│  ├─ Not expired
│  └─ Verified within past 6 months
│
├─ Residence Verification (if not national of Qatar)
│  ├─ Utility bill / lease agreement
│  ├─ Dated within past 3 months
│  └─ Verified before auto-decision
│
├─ Employment Verification (if employed, not retired)
│  ├─ Offer letter OR employment contract
│  ├─ Recent salary document (within 3 months)
│  └─ Company details matching employment claim
│
└─ Source of Funds Documentation (if requested)
   ├─ Tax documents (last 2 years)
   ├─ Bank statements (recent 3 months)
   └─ Business registration (if self-employed)

CONDITIONAL DOCUMENTS (if applicable):
├─ Business License (if self-employed/business owner)
├─ Marriage/Divorce Certificate (if dependent support claimed)
├─ Power of Attorney (if third-party operand)
└─ Enhanced CDD docs (if high-risk triggers)

SYSTEM CHECK:
├─ Count required documents present
├─ Check readability of each (OCR score >85%)
├─ Verify document dates are current
├─ Flag if any document is missing
└─ RULE: If any required doc missing → cannot auto-decide
```

---

## 4. AUTOMATED DECISION OUTCOMES

The system is authorized to make the following automated decisions:

### 4.1 AUTO-APPROVAL

**When:** Low-risk request meets all eligibility criteria

```
DECISION: AUTO-APPROVE (Decision Code: AA-001)
├─ Trigger Conditions:
│  ├─ Risk score 0-35
│  ├─ All mandatory data present & current
│  ├─ All validation checks passed
│  ├─ No exclusion triggers
│  ├─ Sanctions/PEP check passed
│  ├─ Documents complete (95%+ completeness)
│  └─ No negative events in past 30 days
│
├─ System Action:
│  ├─ Set customer KYC status: "APPROVED"
│  ├─ Update account profile (T24): KYC_STATUS = "COMPLETE"
│  ├─ Activate account if pending approval
│  ├─ Generate approval letter (auto-email to customer)
│  ├─ Log decision with timestamp, user ID, rule codes
│  └─ Send notification to branch (FYI)
│
├─ Audit Trail Captured:
│  ├─ Request ID & customer ID
│  ├─ All data values evaluated
│  ├─ Each rule that passed (with pass/fail)
│  ├─ Risk score calculation (with breakdowns)
│  ├─ Document review (count, readability scores)
│  ├─ Sanctions/PEP result
│  ├─ Timestamp of decision
│  ├─ System version & rule engine version
│  └─ No manual override possible (read-only after)
│
├─ Communication:
│  ├─ Auto-email approval to customer (within 1 min)
│  ├─ SMS confirmation (if on file)
│  └─ Branch notification (within 5 min)
│
└─ Success Criteria:
   ├─ Account activated within 1 hour
   ├─ Customer receives notification
   └─ Case closed automatically in workflow system
```

**Examples of Auto-Approve Scenarios:**
- New account KYC: Staff member, Qatari national, standard occupation, income >QAR 500K, all docs provided
- KYC renewal: Existing customer, no negative events in 2 years, same profile as before, documents current
- Document completion: Customer provides requested documents, no new risk flags, resolves the issue

### 4.2 AUTO-REJECT

**When:** Request cannot meet eligibility criteria

```
DECISION: AUTO-REJECT (Decision Code: AR-001)
├─ Trigger Conditions (any one of):
│  ├─ Identity document expired
│  ├─ Required documents missing and customer given deadline to provide
│  ├─ Sanctions match detected (HARD STOP)
│  ├─ Fraud indicator confirmed (account compromise, chargeback)
│  ├─ Banned occupation (money changer, unlicensed forex dealer)
│  ├─ Risk score >85 + no path to mitigation
│  └─ Customer explicitly requested account closure
│
├─ System Action:
│  ├─ Set KYC status: "REJECTED"
│  ├─ Mark account: Cannot conduct business until resolved
│  ├─ Generate rejection letter (reason code)
│  ├─ Log decision with full evidence trail
│  ├─ Send notification to customer (with reason & appeal process)
│  └─ Alert branch manager + compliance team
│
├─ Audit Trail Captured:
│  ├─ Rejection reason code (document missing, sanctions, fraud, etc)
│  ├─ All checks performed before rejection
│  ├─ Evidence cited (which data triggered rejection)
│  ├─ What customer must do to appeal/resolve
│  ├─ Timestamp & system user
│  └─ Cannot be auto-reversed (requires manual review)
│
├─ Communication:
│  ├─ Rejection letter (clear, non-accusatory language)
│  ├─ Specific action required from customer (if applicable)
│  │  ├─ "Provide expired ID renewal" (document missing case)
│  │  ├─ "Contact branch to discuss application status" (judgment case)
│  │  └─ "Do not apply again" (fraud/banned occupation)
│  ├─ Appeal process (escalate to manager within 3 days)
│  └─ Timeline for resolution
│
└─ Exception:
   ├─ Sanctions match → NO APPEAL (regulatory requirement)
   ├─ Fraud confirmed → NO APPEAL (must report to authorities)
   ├─ Document missing → Allow 30-day cure period, then close
   └─ Risk concerns (non-sanctions) → Allow escalation to human review
```

**Examples of Auto-Reject Scenarios:**
- Expired identity document, customer given 30-day notice, deadline passed
- Sanctions match in AML screening (IMMEDIATE STOP, escalate to compliance)
- Required documents never provided after 2 requests + 30 days
- Identified fraud (compromised account, chargebacks, investigation)

### 4.3 AUTO-ESCALATE

**When:** Risk indicators present, but not clear-cut rejection — escalate to human

```
DECISION: AUTO-ESCALATE (Decision Code: AE-001)
├─ Trigger Conditions:
│  ├─ Risk score 36-60 (medium-risk band)
│  ├─ Confidence <80% on any key field
│  ├─ PEP flag detected (no auto-approve)
│  ├─ Inconsistent/contradictory data detected
│  ├─ One mandatory data point missing
│  ├─ Source system validation failed
│  ├─ Negative event in past 30-60 days
│  └─ Occupation triggers CDD requirement
│
├─ System Action:
│  ├─ Create escalation ticket with full context
│  ├─ Route to appropriate queue based on risk:
│  │  ├─ PEP detected → Compliance Officer
│  │  ├─ Risk score >50 + business owner → Senior Analyst
│  │  ├─ Missing documents → Customer Service (request)
│  │  ├─ Data inconsistency → Data Quality Team
│  │  └─ System issue → IT Support
│  ├─ Set SLA: 24 hours (low priority) to 4 hours (high risk)
│  ├─ Generate escalation notice to branch
│  └─ Notify customer of pending review status
│
├─ Audit Trail Captured:
│  ├─ Escalation decision code & timestamp
│  ├─ Escalation reason (risk score? missing data? inconsistency?)
│  ├─ Queue assignment (who will review)
│  ├─ All system analysis up to escalation point
│  ├─ What human reviewer needs to decide
│  └─ Data gaps that triggered escalation
│
├─ Escalation Routing (Stage B: Human-in-Loop):
│  ├─ If Medium Risk (36-60) + complete data:
│  │  └─ Route to Senior Analyst
│  │     ├─ Analyst reviews system recommendation
│  │     ├─ Makes judgment approval/rejection/request-docs
│  │     └─ Must document their reasoning
│  │
│  ├─ If Missing Data:
│  │  └─ Route to Customer Service
│  │     ├─ Request specific document/information from customer
│  │     ├─ Customer service provides 30-day response window
│  │     ├─ If provided → Re-evaluate (may auto-decide)
│  │     └─ If not provided → Auto-reject after deadline
│  │
│  ├─ If Data Inconsistency:
│  │  └─ Route to Data Quality Team
│  │     ├─ Investigate which source is correct (T24? KYC? CRM?)
│  │     ├─ Resolve conflict or flag for analyst review
│  │     └─ Re-evaluate once consistent
│  │
│  └─ If PEP Flag:
│     └─ Route to Compliance Officer (non-urgent → Analyst)
│        ├─ Compliance decides if PEP is match or false positive
│        ├─ If match → Enhanced CDD required
│        ├─ If false positive → Clear flag, re-evaluate
│        └─ Documents decision in compliance system
│
└─ Success Criteria:
   ├─ Escalation ticket created within 1 minute
   ├─ Correct queue assigned based on risk type
   ├─ Human reviewer receives within SLA
   └─ Case resolved (approved/rejected/more-docs) within SLA
```

**Examples of Auto-Escalate:**
- Moderate-risk business owner: Complete documents, but complex source of wealth needs verification
- PEP family member: Clear KYC, but PEP flag needs compliance review
- Income inconsistency: W-2 shows $500K but bank statements show $1.2M → needs verification
- Missing employment verification: Customer claims employed, but document not provided → request & wait 30 days

### 4.4 AUTO-REQUEST DOCUMENTS

**When:** Specific documents are missing but customer has time to provide

```
DECISION: AUTO-REQUEST DOCUMENTS (Decision Code: AR-DOC-001)
├─ Trigger Conditions:
│  ├─ Required documents missing (<95% completeness)
│  ├─ No exclusions/rejections present
│  ├─ Employment verification needed (not on file)
│  ├─ Source of wealth explanation needed
│  ├─ High-risk occupation requires CDD docs
│  └─ Customer has not yet provided requested documents
│
├─ System Action:
│  ├─ Generate automated document request letter
│  ├─ List specific documents needed (clear, itemized)
│  ├─ Provide deadline (typically 30 days)
│  ├─ Include upload instructions (QIB portal, branch)
│  ├─ Send via:
│  │  ├─ Auto-email (within 1 minute)
│  │  ├─ SMS notification (if on file)
│  │  └─ Branch notification (customer can visit)
│  ├─ Set flag in system: "Pending Documents"
│  ├─ Schedule automatic follow-up (day 15 + day 28)
│  └─ Auto-reject if deadline passed without response
│
├─ Audit Trail Captured:
│  ├─ Documents requested (itemized list)
│  ├─ Request timestamp & deadline
│  ├─ Communication method used
│  ├─ Customer response tracking
│  ├─ Follow-up reminders sent
│  ├─ Final disposition (provided/not provided)
│  └─ Compliance documentation (audit-ready)
│
├─ What Happens Next:
│  ├─ IF documents provided before deadline + valid:
│  │  └─ Re-evaluate case (may auto-approve if complete)
│  │
│  ├─ IF documents provided but insufficient quality (unreadable, incomplete):
│  │  └─ Send re-request explaining issue (1 more chance)
│  │
│  ├─ IF documents NOT provided by deadline:
│  │  └─ Auto-reject with reason code "Documents not provided"
│  │     ├─ Set SLA: 60 days before case archived
│  │     ├─ Allow customer to resubmit if interested
│  │     └─ Require full re-application if re-submitting after 60 days
│  │
│  └─ IF status becomes unclear:
│     └─ Escalate to analyst for manual follow-up
│
└─ Success Criteria:
   ├─ Request letter sent within 1 minute
   ├─ Documents clearly specified (not vague)
   ├─ Deadline is reasonable (30-45 days)
   └─ System tracks responses automatically
```

**Examples of Auto-Request:**
- New customer, employment unverified: "Please provide offer letter or employment contract within 30 days"
- Business owner, standard business docs not uploaded: "Please upload business registration, tax returns, last 3 months bank statements"
- PEP family member: "Please provide detailed explanation of source of funds and supporting documentation"

### 4.5 AUTO-FLAG / ESCALATE (Fallback)

**When:** Any condition prevents safe automation — halt and escalate

```
DECISION: AUTO-FLAG FOR HUMAN REVIEW (Decision Code: AF-001)
├─ Trigger Conditions (ANY of):
│  ├─ Data freshness exceeded (KYC >6 months old for routine)
│  ├─ Source system inconsistency (T24 vs KYC data mismatch)
│  ├─ Missing critical field (income, occupation unclear)
│  ├─ Low data confidence (<80% on any mandatory field)
│  ├─ System error or validation failure
│  ├─ Transaction monitoring alert (possible fraud)
│  └─ Any rule engine failure or timeout
│
├─ System Action:
│  ├─ STOP all automation immediately
│  ├─ Create escalation ticket
│  ├─ Route to appropriate specialist:
│  │  ├─ Data inconsistency → Data quality team
│  │  ├─ System error → IT support
│  │  ├─ Fraud alert → Compliance + Security
│  │  └─ Judgment call → Senior analyst
│  ├─ Clearly document why automation was blocked
│  ├─ Notify customer: "Your KYC is under review"
│  └─ DO NOT proceed with auto-decision
│
├─ Audit Trail Captured:
│  ├─ Timestamp of automation block
│  ├─ Specific reason automation could not proceed
│  ├─ Which data field was problematic
│  ├─ System or rule that failed
│  ├─ Manual review queue assigned
│  └─ Next action required from whom
│
├─ Escalation SLA:
│  ├─ Critical (fraud alert): 1 hour
│  ├─ High (system down): 4 hours
│  ├─ Medium (data inconsistency): 24 hours
│  ├─ Low (routine re-verification): 48 hours
│  └─ Manual review must document their decision/action
│
└─ Success Criteria:
   ├─ No errant auto-decisions made (safety priority #1)
   ├─ Human reviewer gets full context
   ├─ SLAs are met
   └─ Issue is fully resolved before automation can resume
```

---

## 5. EXCLUSION & FALLBACK POLICY

### 5.1 Mandatory Fallback-to-Human Scenarios

```
The system MUST ALWAYS escalate to human review for:

┌─ REGULATORY TRIGGERS ──────────────────────┐
│ ├─ PEP or family of PEP (ANY PEP match)    │
│ ├─ Sanctions match (OFAC, UN, EU, etc)    │
│ ├─ Adverse media hit (non-frivolous)      │
│ ├─ Active regulatory inquiry/investigation│
│ ├─ High-risk jurisdiction residence       │
│ ├─ High-risk occupation (lawyer, CPA)    │
│ └─ Required to perform CDD (offshore)     │
└────────────────────────────────────────────┘

┌─ DATA QUALITY TRIGGERS ────────────────────┐
│ ├─ Critical data missing (name, ID, etc)  │
│ ├─ Data freshness exceeded (stale)        │
│ ├─ Conflicting data between systems       │
│ ├─ Data quality score <85%                │
│ ├─ Source system unavailable              │
│ └─ Unverified/unconfirmed key facts       │
└────────────────────────────────────────────┘

┌─ RISK TRIGGERS ────────────────────────────┐
│ ├─ Risk score >60 (not low-risk)          │
│ ├─ Negative event in past 30 days         │
│ ├─ Transaction monitoring alert           │
│ ├─ Multiple minor risk factors            │
│ ├─ Inconsistent with stated profile       │
│ └─ Confidence level <80%                  │
└────────────────────────────────────────────┘

┌─ DOCUMENT TRIGGERS ────────────────────────┐
│ ├─ Required documents missing (>5%)       │
│ ├─ Document quality inadequate            │
│ ├─ Document readability <85%              │
│ ├─ Document validation failed             │
│ └─ Source of funds docs incomplete        │
└────────────────────────────────────────────┘
```

### 5.2 How System Handles Fallback

```
When ANY fallback trigger is detected:

1. STOP AUTOMATION IMMEDIATELY
   ├─ Do not proceed with auto-decision
   └─ Flag case as requiring human review

2. CREATE ESCALATION TICKET
   ├─ Document the reason (fallback trigger)
   ├─ Attach all system analysis
   ├─ List what human must verify
   └─ Set appropriate SLA

3. ROUTE CORRECTLY
   ├─ PEP/Sanctions → Compliance Officer
   ├─ Risk factors → Senior Analyst
   ├─ Missing data → Customer Service
   ├─ System error → IT Support
   └─ Other → Default: Senior Analyst Queue

4. NOTIFY CUSTOMER
   ├─ "Your application is under review"
   ├─ Do NOT explain reason (avoid giving map to bypass)
   ├─ Provide timeframe for decision
   └─ Offer branch contact if questions

5. HUMAN REVIEWS & DECIDES
   ├─ Analyst has full automation analysis as context
   ├─ Analyst makes discretionary approval/rejection/request
   ├─ Analyst documents their reasoning
   ├─ Analyst approves with signature/ID
   └─ System records all human actions

6. NO AUTO BACK-TRACKING
   ├─ Once escalated to human, system does NOT re-attempt automation
   ├─ If human approves → case moves to "APPROVED"
   ├─ If human rejects → case moves to "REJECTED"
   ├─ If human requests docs → returns to "PENDING DOCUMENTS"
   └─ All actions are audit-logged
```

---

## 6. CONTROL FRAMEWORK

### 6.1 Governance & Accountability

```
┌─────────────────────────────────────────┐
│      GOVERNANCE & DECISION AUTHORITY    │
└─────────────────────────────────────────┘

POLICY OWNER (CRO — Chief Risk Officer)
├─ Authority: Approves policy + major changes
├─ Reviews: Quarterly control testing results
├─ Escalates: Material breaches or exemptions
└─ Reports: Board Audit Committee quarterly

BUSINESS OWNER (Head of Retail Banking/Onboarding)
├─ Authority: Approves system configuration
├─ Owns: SLA performance, customer experience
├─ Reviews: Monthly automation metrics
├─ Escalates: Customer complaints, systemic issues
└─ Responsible: Staff training + change management

COMPLIANCE OWNER (Chief Compliance Officer)
├─ Authority: Approves automation scope + triggers
├─ Reviews: Regulatory change impact monthly
├─ Escalates: Regulatory inquiries, sanctions hits
├─ Responsible: Documenting control framework
└─ Reports: Regulatory authorities as required

MODEL/RULE OWNER (VP Analytics & AI)
├─ Authority: Develops rule sets, thresholds
├─ Reviews: Rule performance + false positive rates
├─ Escalates: Rules exceeding error thresholds
├─ Responsible: Model validation, backtest
└─ Updates: Rules based on new risk data

SYSTEM ADMINISTRATOR (IT Operations)
├─ Authority: System access, monitoring
├─ Owns: System stability, data quality
├─ Escalates: System errors, data integrity issues
└─ Responsible: Backup, audit logging
```

### 6.2 Approval Authority

```
┌─ DECISION AUTHORITY ──────────────────────────────────┐
│                                                        │
│ AUTO-APPROVE (System)                                │
│ ├─ No further approval needed                        │
│ ├─ Audit logged automatically                        │
│ └─ Must meet ALL eligibility criteria                │
│                                                        │
│ AUTO-ESCALATE (System escalates to queue)            │
│ ├─ Human reviewer must approve/reject                │
│ ├─ Reviewer signs off (username/timestamp)           │
│ └─ Cannot be overridden by system (human final)      │
│                                                        │
│ POLICY EXCEPTIONS (Requires CRO approval)            │
│ ├─ Example: Approve request outside normal policy    │
│ ├─ Must be documented with business rationale        │
│ ├─ Approval recorded (CRO signature/timestamp)       │
│ └─ Full audit trail logged                           │
│                                                        │
│ RULE CHANGES (Requires Compliance + CRO approval)    │
│ ├─ Any change to automation rules/thresholds         │
│ ├─ Change must be backtest on 6 months historical    │
│ ├─ Impact must be documented                         │
│ ├─ Both Compliance & CRO must approve                │
│ └─ Effective date = 1 business day after approval    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 6.3 Review Frequency & Control Testing

```
MONTHLY REVIEWS:
├─ Automation metrics dashboard (automated generation)
│  ├─ Auto-decision rate by request type
│  ├─ Auto-approval, auto-reject, auto-escalate counts
│  ├─ False positive rate (over-escalations)
│  ├─ False negative rate (missed high-risk)
│  ├─ Post-decision override rate
│  └─ SLA compliance (decision time, notification time)
│
├─ Rules performance (auto-generated report)
│  ├─ Each rule: triggered count, accuracy, errors
│  ├─ Risk score distribution
│  ├─ Escalation reasons breakdown
│  └─ Trends vs. previous month
│
└─ Exceptions & anomalies (manual review)
   ├─ Any auto-decisions later overturned by human
   ├─ Any false positive cases (approved but should reject)
   ├─ Any false negative cases (escalated but should approve)
   └─ High-value or unusual escalations

QUARTERLY REVIEWS:
├─ Full control testing (sample-based)
│  ├─ Statisticallyrepresentative sample (n=200 cases)
│  ├─ Re-run each case through automation logic
│  ├─ Verify decision would be the same
│  ├─ Check for any rule gaps or criteria changes
│  └─ Document findings in control report
│
├─ False positive/negative analysis
│  ├─ Cases that failed after automation approval
│  ├─ Cases that should have escalated but didn't
│  ├─ Root cause analysis for each
│  ├─ Recommended rule adjustments
│  └─ Implementation timeline
│
└─ Regulatory compliance audit
   ├─ Verify automation aligns with AML/CFT requirements
   ├─ Check if any new regulatory guidance impacts rules
   ├─ Document compliance position
   └─ Update policy if needed

EXCEPTION MONITORING (REAL-TIME):
├─ Any sanctions/PEP match → Immediate escalation
├─ Any system error → Immediate fallback to human
├─ Any rule violation → Logged + reported daily
├─ Any override of auto-decision → Flagged for review
└─ Any SLA breach → Escalated to operations manager
```

---

## 7. AUDITABILITY & EXPLAINABILITY

### 7.1 Complete Audit Trail for Every Decision

Every automated or escalated decision must be fully explicable and audit-logged:

```
AUDIT LOG STRUCTURE (Immutable Record):

┌─ CASE IDENTIFICATION ──────────────────────┐
│ case_id:                   EDD-2026-001234  │
│ customer_id:               CUST-789456      │
│ customer_name:             Abdullah Al-Kuwari
│ decision_timestamp:        2026-03-12 14:25:30
│ decision_user_id:          SYSTEM_AUTO      │
│ decision_system_version:   AED-ENG-1.2.3    │
└────────────────────────────────────────────┘

┌─ DECISION OUTCOME ─────────────────────────┐
│ final_decision:            AUTO-APPROVE     │
│ decision_code:             AA-001           │
│ confidence_level:          0.96 (96%)       │
│ confidence_bands:          0.90-1.00 (HIGH)│
└────────────────────────────────────────────┘

┌─ DATA INPUTS EVALUATED ────────────────────┐
│ identity_verified:         true             │
│ identity_exp_date:         2027-06-30       │
│ kqc_status:                complete         │
│ kyc_last_updated:          2026-01-15       │
│ employment_verified:       true             │
│ employment_source:         T24              │
│ monthly_income:            QAR 875,000      │
│ income_source:             "Salary"         │
│ source_of_wealth:          "Employment"     │
│ nationality:               "Qatari"         │
│ age:                       38               │
│ pep_check_passed:          true             │
│ sanctions_check_passed:    true             │
│ adverse_media_check_passed:true             │
│ transaction_alerts:        0 (none)         │
│ negative_events_30d:       0                │
│ documents_provided:        12/12 (100%)     │
│ document_quality_avg:      0.94             │
└────────────────────────────────────────────┘

┌─ RULES EVALUATED ──────────────────────────┐
│ rule_count:                14 total         │
│ rules_evaluated:           14/14 (100%)     │
│                                             │
│ RULE_001: Identity Validation      ✓ PASS  │
│ RULE_002: Age Check (21-65)        ✓ PASS  │
│ RULE_003: Nationality (Qatari)     ✓ PASS  │
│ RULE_004: Occupation Check         ✓ PASS  │
│ RULE_005: Income Threshold (>300K) ✓ PASS  │
│ RULE_006: Income Verification      ✓ PASS  │
│ RULE_007: KYC Completeness         ✓ PASS  │
│ RULE_008: Document Quality         ✓ PASS  │
│ RULE_009: PEP Check                ✓ PASS  │
│ RULE_010: Sanctions Check          ✓ PASS  │
│ RULE_011: Adverse Media            ✓ PASS  │
│ RULE_012: Risk Score (<35)         ✓ PASS  │
│ RULE_013: No Recent Negative Event ✓ PASS  │
│ RULE_014: Source of Funds Clear    ✓ PASS  │
└────────────────────────────────────────────┘

┌─ RISK SCORE CALCULATION ───────────────────┐
│ base_score:                0                │
│ occupation_risk:           0                │
│ geographic_risk:           0                │
│ financial_risk:            5                │
│ source_of_wealth_risk:     0                │
│ compliance_history:        -5 (discount)    │
│ final_risk_score:          0                │
│ risk_band:                 LOW (0-35)       │
│ automation_eligible:       YES              │
│ confidence_in_score:       HIGH (>95%)      │
└────────────────────────────────────────────┘

┌─ VALIDATION & CHECKS ──────────────────────┐
│ data_completeness:         100%             │
│ data_freshness:            CURRENT          │
│ source_system:             T24, KYC, CRM    │
│ source_system_available:   YES              │
│ data_consistency:          100% (no conflicts
│ fallback_triggered:        NO               │
│ exclusion_triggered:       NO               │
│ exception_logic:           NONE             │
└────────────────────────────────────────────┘

┌─ DECISION REASONING (PLAIN LANGUAGE) ─────┐
│ "This request was AUTO-APPROVED because:   │
│  1. Customer is a Qatari national, age 38  │
│  2. Employed in standard occupation        │
│  3. Monthly income QAR 875K (above minimum)│
│  4. All required documents provided        │
│  5. Passed all compliance checks           │
│  6. No negative events or alerts           │
│  7. Risk score 0 (very low risk)           │
│  8. Confidence level 96% (very high)       │
│                                             │
│  This customer meets all policy criteria   │
│  for automated approval without manual     │
│  review."                                   │
└────────────────────────────────────────────┘

┌─ AUDIT TRAIL NEXT STEPS ───────────────────┐
│ action_taken:              Account activated
│ notification_sent:         YES              │
│ notification_method:       EMAIL + SMS      │
│ notification_timestamp:    2026-03-12 14:26:15
│ customer_notified:         YES              │
│ approval_letter_sent:      YES              │
│ case_closed:               YES              │
│ archive_eligible:          YES              │
│ immutable_record:          LOCKED (read-only)
│ retention_period:          7 years (regulatory)
└────────────────────────────────────────────┘
```

### 7.2 Explainability — Plain Language Explanations

The system must generate clear explanations for every decision that can be read by:
- Non-technical compliance staff
- Regulatory examiners
- Customers (if appealing)

```
SYSTEM-GENERATED EXPLANATION TEMPLATE:

For Auto-Approval:
"Your enhanced due diligence review has been completed and your account has 
been approved. You were approved because:
- Your identity has been verified
- Your employment has been confirmed
- Your stated income of QAR [X] is verifiable
- All required documents were provided
- You passed all compliance checks (no sanctions, PEP, adverse media)
- Your risk profile is low based on your employment and financial profile

Your account is now active and ready to use. Thank you!"

For Auto-Escalation (Moderate Risk):
"Your enhanced due diligence application is under professional review by our 
compliance team. We need to verify some information about your financial 
background:
- Source of your stated income/wealth
- Business background (if self-employed)
- Purpose of account use

Our team will contact you within 3-5 business days with any document 
requirements. We appreciate your patience."

For Auto-Rejection:
"We are unable to approve your application at this time because:
- Your identity document has expired
- We require a valid, current form of government identification

Please visit any QIB branch with a current passport or national ID, and we 
will be happy to complete your application. If you have questions, please 
call our Customer Service team at [number]."

For Escalation (PEP Flag):
"Your application requires enhanced review due to our policy requirements. 
This does not indicate any concern about your integrity—it is simply a 
procedural requirement for certain customer profiles. Our senior compliance 
team will review your application and contact you within 5 business days with 
next steps."
```

### 7.3 Explainability for Regulators

In the event of a regulatory exam or inquiry:

```
REGULATOR-READY EXPLANATION TEMPLATE:

REQUEST: "Why was customer [X] auto-approved?"

RESPONSE:
"This customer was approved by our automated decision system because ALL of 
the following conditions were met:

DATA QUALITY:
✓ Identity verified (QAR National ID #[X], not expired)
✓ KYC form complete (all sections filled)
✓ All required documents provided and validated
✓ Data freshness current (KYC updated [date])
✓ No conflicting information between source systems

RISK ASSESSMENT:
✓ Risk score: 0 out of 100 (LOW RISK)
  Breakdown:
  - Occupation risk: 0 (standard employment)
  - Geographic risk: 0 (Qatari national)
  - Financial risk: 5 (income >threshold)
  - Source of wealth: 0 (salary, clear)
  - Compliance history: -5 (discount for clean record)

COMPLIANCE CHECKS:
✓ Passed OFAC sanctions screening (dated [date])
✓ Passed PEP database check (dated [date])
✓ Passed adverse media screening (no matches)
✓ No transaction monitoring alerts
✓ No negative events in past 30 days

POLICY CRITERIA:
✓ Meets ALL low-risk automation criteria defined in policy
✓ Confidence level: 96% (very high)
✓ No exclusion triggers present
✓ No fallback-to-human triggers present

AUDIT TRAIL:
✓ Complete immutable record available (see audit log)
✓ All rules evaluated documented
✓ All data values captured
✓ All thresholds met documented
✓ Decision reason codes recorded

CONCLUSION:
This approval is consistent with our automated decisioning policy, all 
control criteria were met, and the decision can be fully traced and 
explained."

(Auditor receives complete audit log + system documentation + rule definitions)
```

---

## 8. RISK & REGULATORY SAFEGUARDS

### 8.1 No Black-Box Decisioning

```
SAFEGUARD #1: EXPLAINABILITY REQUIREMENT
├─ Every decision (automatic or manual) must be explainable
├─ System cannot use "opaque" techniques unsupported by policy
├─ Every rule must have documented business rationale
├─ Every threshold must have documented risk basis
├─ Examples of UNACCEPTABLE:
│  ├─ "Neural network decided"
│  ├─ "AI model output"
│  └─ "Algorithm determined"
└─ All decisions must reference specific policy rules

SAFEGUARD #2: POLICY-BOUNDED AUTOMATION
├─ Automation ONLY applies rules defined in this policy
├─ System cannot create new rules ad-hoc
├─ System cannot change thresholds without approval
├─ Any new risk identified → manual escalation (not auto-decision)
├─ Rule changes require:
│  ├─ CRO approval
│  ├─ Compliance review
│  ├─ Historical backtest (6 months)
│  └─ Effective date 1 day after approval
└─ Change log maintained (audit trail of all rule changes)

SAFEGUARD #3: DATA QUALITY GATEKEEPING
├─ If data quality <85%, automation is blocked
├─ If source systems unavailable, fallback to human
├─ If data freshness exceeded, escalate (no auto-decision)
├─ If data inconsistency detected, escalate (no auto-decision)
├─ System must prioritize data quality over speed
└─ Monthly data quality audit performed by IT

SAFEGUARD #4: REGULATORY TRIGGER HARDSTOPS
├─ PEP match → IMMEDIATE ESCALATION (no auto-approve possible)
├─ Sanctions match → IMMEDIATE ESCALATION + Compliance notification
├─ Fraud alert → IMMEDIATE ESCALATION + Security notification
├─ OFAC hit → IMMEDIATE ESCALATION + Legal notification
├─ These are non-negotiable (hardcoded in system)
└─ Cannot be overridden by business user
```

### 8.2 Monitoring for Bias & Fairness

```
SAFEGUARD #5: DISCRIMINATION MONITORING
├─ Monthly analysis: Decision outcomes by protected characteristics
│  ├─ Gender (approval rate male vs female)
│  ├─ Age (approval rate by age group)
│  ├─ Nationality (approval rate by nationality bin)
│  ├─ Occupation (approval rate by major occupation groups)
│  └─ Geographic location (approval rate by emirate)
│
├─ Acceptance Criteria:
│  ├─ No outcome shall vary >10% between groups
│  ├─ Example: If male approval rate is 75%, female must be 65-85%
│  ├─ Example: If Qatari approval rate is 80%, expat must be 70-90%
│  └─ If threshold exceeded → investigate + remediate
│
└─ Remediation:
   ├─ If bias detected → review rules that caused it
   ├─ Adjust thresholds if they disproportionally impact groups
   ├─ Document change rationale
   ├─ Obtain CRO + Compliance approval
   └─ Re-test to ensure bias resolved
```

### 8.3 False Positive & False Negative Monitoring

```
SAFEGUARD #6: ERROR MONITORING
├─ False Positives (Wrong Rejections):
│  └─ Track: Cases auto-rejected that human would have approved
│     ├─ Target: <5% of auto-rejects
│     ├─ Method: Sample audit of rejected cases monthly
│     ├─ If exceeded: Investigate rules, adjust thresholds
│     └─ Document impact (customers lost, revenue impact)
│
├─ False Negatives (Wrong Approvals):
│  └─ Track: Cases auto-approved that should have escalated
│     ├─ Target: <2% of auto-approvals
│     ├─ Method: Quarterly sample + ongoing monitoring feed
│     ├─ Identify via:
│     │  ├─ Post-approval fraud detected
│     │  ├─ Regulatory audit finding
│     │  ├─ Transaction monitoring flag
│     │  └─ Complaint filed
│     └─ If exceeded: Tighten rules immediately
│
└─ Reporting:
   ├─ Monthly dashboard: FP + FN rates by request type
   ├─ Monthly trend analysis (improving or worsening?)
   ├─ Root cause for any spike (rule issue? data quality?)
   ├─ Corrective action if trend worsening
   └─ Reported to CRO + Board Audit Committee quarterly
```

---

## 9. KPI & MONITORING FRAMEWORK

### 9.1 Automation Performance Metrics

```
KPI DASHBOARD (Real-Time + Daily + Monthly Reports)

┌─ AUTOMATION VOLUME METRICS ────────────────┐
│ Total Requests Received (Monthly):      2,847
│ Auto-Eligible Requests:                1,985 (70%)
│ Auto-Decision Rate:                    1,742 (61%)
│ Escalated to Human:                    1,105 (39%)
│                                             │
│ Auto-Approval Count:                   1,234 (71% of auto)
│ Auto-Rejection Count:                    384 (22% of auto)
│ Auto-Escalation Count:                   124 (7% of auto)
│ Auto-Request Docs Count:                 342 (19% of auto)
└────────────────────────────────────────────┘

┌─ QUALITY METRICS ──────────────────────────┐
│ Auto-Approval Rate (of all requests):    43%
│ Manual Review Rate:                      39%
│ Request More Documents Rate:             12%
│ Auto-Rejection Rate:                      6%
│                                             │
│ False Positive Rate:                     8.2% (TARGET <10%)
│ False Negative Rate:                     1.5% (TARGET <2%)
│ Post-Decision Override Rate:             3.7% (TARGET <5%)
│                                             │
│ Overall Accuracy (correct decision):    96.8%
│ Overall Confidence Level (avg):          0.92
└────────────────────────────────────────────┘

┌─ OPERATIONAL METRICS ──────────────────────┐
│ Avg Time to Auto-Decision:               18 min
│ Avg Time to Manual Decision:            2.3 days
│ SLA Compliance (Auto decisions):        99.8%
│ SLA Compliance (Manual review):         97.2%
│                                             │
│ Customer Notification Rate:             99.9%
│ Notification Time (avg):                8 min
│ Branch Communication Rate:              98%
└────────────────────────────────────────────┘

┌─ RISK METRICS ─────────────────────────────┐
│ PEP Flags Correctly Escalated:          100%
│ Sanctions Matches Escalated:            100%
│ Risk Score >60 Escalated Correctly:     97.3%
│ Missing Data Escalated:                 99.1%
│                                             │
│ Regulatory Rule Breaches:                  0
│ Policy Breaches:                           0
│ Exception Cases (manual review):         127
│ Exception Rate:                         4.5%
└────────────────────────────────────────────┘

┌─ BY REQUEST TYPE ──────────────────────────┐
│ Low-Risk Staff Account:
│  - Auto Rate: 89% | Approval %: 96% | FP: 1.2%
│
│ Qatari National <Threshold:
│  - Auto Rate: 68% | Approval %: 74% | FP: 6.8%
│
│ Document Completion Cases:
│  - Auto Rate: 73% | Approval %: 82% | FP: 4.1%
│
│ Moderate-Risk (Business Owner):
│  - Auto Rate: 55% (recommend) | Human: 85% approve | FP: 9.2%
│
│ High-Risk / Manual:
│  - Auto Rate: 0% | Human approval: 62% | FP: N/A
└────────────────────────────────────────────┘

┌─ BUSINESS VALUE METRICS ───────────────────┐
│ Workflow Time Saved (vs all manual):    68%
│ Processing Cost Reduction:              45%
│ Customer Time-to-Decision Improvement:  75%
│ Staff Efficiency Gain:                  2.3x
│                                             │
│ Customer Satisfaction (auto-approved):  94%
│ Customer Satisfaction (manual review):  82%
│ Appeal/Complaint Rate:                  1.8%
│ Regulatory Fine Risk Reduction:        HIGH
└────────────────────────────────────────────┘
```

### 9.2 Monitoring Cadence & Escalation

```
REAL-TIME MONITORING:
├─ PEP/Sanctions hits → ALERT immediately (1 min max)
├─ System errors → ALERT immediately
├─ SLA breach → ALERT when SLA reached
└─ Manual review > 48 hours old → Daily escalation list

DAILY MONITORING:
├─ Automation volume & mix (auto vs manual)
├─ Decision time averages
├─ Override rates (any system decisions overturned?)
├─ Escalation reasons (which are most common?)
└─ Any policy breaches

WEEKLY MONITORING:
├─ Quality metrics summary
├─ Approval/rejection/escalation rates
├─ False positive indicators
├─ Customer complaints (if any)
└─ Staff feedback

MONTHLY MONITORING (Full Dashboard):
├─ Complete metrics review (above)
├─ Performance vs targets
│  ├─ Auto rate target: 60-75% actual?
│  ├─ FP rate target: <10% actual?
│  ├─ FN rate target: <2% actual?
│  ├─ Accuracy target: >95% actual?
│  └─ SLA target: >95% actual?
├─ Trend analysis (month-over-month)
├─ Fairness analysis (outcomes by demographic)
├─ False positive + false negative root cause
├─ Exception analysis (unusual cases)
└─ Recommendation report for CRO

QUARTERLY MONITORING (Control Testing):
├─ Sample-based control testing (n=200)
├─ Rule validation backtest
├─ Policy compliance audit
├─ Regulatory communication prep
└─ Board reporting package

ANNUAL MONITORING (Policy Review):
├─ Full policy effectiveness assessment
├─ Any material changes to regulations?
├─ Any material changes to business?
├─ Rule performance deep dive (all 14+ rules)
├─ Technology/system changes needed?
└─ Board & regulator communication

ESCALATION TRIGGERS (When to Contact CRO):
├─ Auto rate drops below 55% OR exceeds 80%
├─ FP rate exceeds 12%
├─ FN rate exceeds 3%
├─ Any regulatory inquiry received
├─ Any policy breach detected
├─ Customer complaints exceed 10/month
├─ Manual review SLA <90% compliance
└─ Material post-decision fraud detected
```

---

## 10. MATURITY MODEL — THREE-STAGE PROGRESSION

### 10.1 Stage A: Governance & Decision Support

```
┌────────────────────────────────────────────┐
│ STAGE A: GOVERNANCE & DECISION SUPPORT    │
│ (Current State — Manual with Smart Tools) │
└────────────────────────────────────────────┘

CHARACTERISTICS:
├─ Human decision-maker reviews every request
├─ System provides analysis + recommendation
├─ System does NOT decide automatically
├─ Decision authority: Full human discretion
├─ Automation level: 0%

SYSTEM CAPABILITIES:
├─ Data aggregation (fetch from multiple sources)
├─ KYC completeness check (flag gaps)
├─ Risk scoring (calculate risk band)
├─ Sanctions/PEP screening (flag matches)
├─ Comparables (show similar cases)
├─ Recommendation (suggest approve/reject/request)
└─ Audit trail (log human decision rationale)

HUMAN DECISION-MAKER ROLE:
├─ Reviews system analysis + documents
├─ Makes final approve/reject/escalate decision
├─ Documents their reasoning + confidence
├─ Takes full accountability for decision
├─ Can override system recommendation
└─ Every decision audit-logged

TIMELINE:
├─ Customer KYC review: 2-5 business days average
├─ Complex cases: 1-2 weeks
├─ Emergency/VIP: 1 business day or less
└─ SLA: 95% within 3 business days

CONTROL FRAMEWORK:
├─ Peer review (manager reviews decisions weekly sampling)
├─ Policy compliance audit (monthly)
├─ Quality assurance (spot check decisions)
├─ Escalation tracking (any overrides logged)
└─ Exception handling documented

READINESS FOR STAGE B:
├─ Baseline controls in place? ✓ YES
├─ Policy documented? ✓ YES (this doc)
├─ System stable & reliable? ✓ YES
├─ Staff trained? ✓ YES
├─ Monitoring in place? ✓ YES (manual + system)
│
└─ Decision: Ready to move to Stage B
```

### 10.2 Stage B: Human-in-the-Loop Decisioning

```
┌────────────────────────────────────────────┐
│ STAGE B: HUMAN-IN-THE-LOOP DECISIONING   │
│ (Transition — System Recommends, Human OK) │
└────────────────────────────────────────────┘

CHARACTERISTICS:
├─ System analyzes request + makes recommendation
├─ Human reviewer must review + approve/override
├─ Decision authority: System recommends, Human approves
├─ Automation level: 40-70% (system works, human validates)
├─ Non-negotiable escalations still escalate (PEP, sanctions)

REQUEST TYPES IN STAGE B:
├─ Moderate-risk individuals (risk score 36-60)
├─ Business owners with complete documentation
├─ Simple cases needing minor clarification
├─ Document completeness verifications
└─ Routine follow-ups (KYC updates, etc)

SYSTEM ROLE (Stage B):
├─ Analyze 100% of eligible requests
├─ Generate risk score + recommendation
├─ Provide evidence for recommendation
│  ├─ Which rules passed
│  ├─ Which data evaluated
│  ├─ What confidence level
│  └─ Why this recommendation
├─ Flag any exceptions/escalations
└─ Present to human reviewer for approval

HUMAN REVIEWER ROLE (Stage B):
├─ Reviews system recommendation + evidence
├─ Conducts brief independent assessment
├─ Decides: Approve / Override / Request Documents
├─ Documents their reviewer comment (why they agreed or disagreed)
├─ Signs off with timestamp + user ID
├─ Cannot be skipped or automated (human approval always required)
└─ Takes accountability for their approval/override

DECISION COMBINATIONS (Stage B):
├─ System recommends APPROVE:
│  └─ Human approves: Case CLOSES (approved)
│  └─ Human overrides: Case re-escalates for full manual review
│
├─ System recommends REQUEST DOCS:
│  └─ Human approves: Customer gets doc request (30-day window)
│  └─ Human overrides: Case goes full manual review
│
├─ System recommends ESCALATE:
│  └─ Human approves: Case escalates to specialist
│  └─ Human overrides: (rare - only if system error detected)
│
└─ System recommends REJECT:
   └─ Human approves: Case CLOSES (rejected)
   └─ Human overrides: Case goes to CRO for exception approval

TIMELINE (Stage B):
├─ System analysis: <5 minutes
├─ Human review: 30-60 minutes (batched review queue)
├─ Total time-to-decision: 1-2 business hours average
└─ SLA: 95% within 1 business day

CONTROL FRAMEWORK (Stage B):
├─ Supervisor spot-check (10% sampling daily)
├─ Override monitoring (100% of human overrides audited monthly)
├─ Quality metrics tracking (above)
├─ Fairness testing (monthly demographic analysis)
├─ False positive tracking (any approvals later fail reviewed)
├─ False negative tracking (any escalations shouldn't have been)
└─ Monthly review with CRO + Compliance

TRANSITION CRITERIA (A → B):
Prerequisite conditions to move Stage A → Stage B:
│
├─ ✓ Stage A controls running well (low exceptions)
├─ ✓ Approval/rejection accuracy >95%
├─ ✓ Policy documented + approved (this document)
├─ ✓ System tested + validated (6 weeks Stage A operation)
├─ ✓ Staff trained (minimum 4 hours per reviewer)
├─ ✓ Monitoring dashboard operational
├─ ✓ Regulatory approval obtained (CRO + CCO signed)
├─ ✓ Pilot completed (500 cases, <3% errors allowed)
└─ ✓ Go/No-Go decision by CRO + CEO

READINESS CHECK (Will we do Stage B?):
├─ Target launch: Q2 2026 (pilot completion required by Feb 2026)
├─ Pilot duration: 6-8 weeks
├─ Pilot sample size: 500-1000 cases
├─ Pilot success criteria:
│  ├─ System accuracy >98%
│  ├─ Human-system agreement >92%
│  ├─ Zero regulatory issues
│  ├─ Customer satisfaction >90%
│  └─ Staff adoption >85%
└─ Decision point: End of pilot (go/no-go)
```

### 10.3 Stage C: Fully Automated System Decisioning

```
┌────────────────────────────────────────────┐
│ STAGE C: FULLY AUTOMATED DECISIONING      │
│ (Full Automation — System Decides)         │
└────────────────────────────────────────────┘

CHARACTERISTICS:
├─ System autonomously decides (no human review required)
├─ Decision goes directly to customer (approval/rejection letter)
├─ Human review only if exceptions trigger fallback
├─ Decision authority: System (within pre-approved policy)
├─ Automation level: 80-95%+ (after exclusion considerations)

REQUEST TYPES ELIGIBLE FOR STAGE C:
├─ Low-risk staff accounts (existing customers)
├─ Qatari nationals: standard occupation + clear income + complete KYC
├─ Simple document completeness (docs resolve the issue)
├─ Routine KYC renewals (no material change)
└─ NOTE: PEP, Sanctions, High-Risk always fall back to human

SYSTEM ROLE (Stage C):
├─ Evaluate 100% of requests against policy eligibility
├─ For eligible requests:
│  ├─ Make final decision (APPROVE, REJECT, or REQUEST DOCS)
│  ├─ Generate all audit logs + evidence trail
│  ├─ Send approval/rejection letter to customer
│  ├─ Notify branch
│  └─ Close case automatically
│
├─ For non-eligible requests:
│  ├─ Escalate with reason code
│  ├─ Route to appropriate queue (analyst, compliance, etc)
│  ├─ Notify customer (under review)
│  └─ Human takes over

SAFEGUARDS (Stage C):
├─ Absolute fallback triggers (non-overrideable):
│  ├─ Any PEP match → ESCALATE immediately
│  ├─ Any sanctions match → ESCALATE immediately
│  ├─ Any data quality issue → ESCALATE immediately
│  ├─ Any system error → ESCALATE immediately
│  └─ Any exclusion trigger detected → ESCALATE immediately
│
├─ Audit trail 100% complete for every decision
├─ Explainability available for regulatory exam
├─ False positive monitoring (monthly review)
├─ Override rate monitoring (any auto-decision reversed by human = review)
└─ Monthly control testing (sample-based validation)

HUMAN ROLE (Stage C):
├─ Monitoring (not decision-making)
│  ├─ Track auto-decision metrics daily
│  ├─ Watch false positive / false negative rates
│  ├─ Flag any trends or anomalies
│  └─ Escalate if KPIs exceed thresholds
│
├─ Exception handling only
│  ├─ Cases that system escalated → human reviews
│  ├─ Post-decision review if fraud detected
│  ├─ Customer appeals/exceptions → human handles
│  └─ Rule conflicts or exceptions → escalated
│
└─ Policy management
   ├─ Monitor system performance
   ├─ Identify need for rule adjustments
   ├─ Recommend changes to policies
   └─ Annual policy review + refresh

TIMELINE (Stage C):
├─ System analysis: 2-5 minutes
├─ Decision: <5 seconds (rule engine evaluation)
├─ Customer notification: <1 minute
├─ Total time-to-decision: <30 minutes
├─ SLA: 95% decisions within 30 minutes
└─ Examples:
   └─ 9:00 AM customer submits online → 9:28 AM account approved & active

CONTROL FRAMEWORK (Stage C):
├─ Real-time automated monitoring:
│  ├─ PEP/Sanctions alerts → immediate escalation
│  ├─ Rule breaches → daily audit
│  ├─ Error detection → auto-escalation
│  └─ SLA breach → auto-escalation
│
├─ Daily reporting:
│  ├─ Decision volume + outcomes
│  ├─ Error rate
│  ├─ Escalation rate
│  ├─ Notification successful?
│  └─ Any system issues?
│
├─ Weekly review:
│  ├─ False positive indicators
│  ├─ False negative indicators
│  ├─ Unusual patterns or anomalies
│  ├─ Customer complaints (if any)
│  └─ Staff feedback
│
├─ Monthly control/audit:
│  ├─ Sample testing (n=300 cases)
│  │  ├─ Re-run through automation logic
│  │  ├─ Verify decision still correct
│  │  ├─ Check audit trail complete
│  │  └─ Document any discrepancies
│  ├─ Fairness audit (demographic outcomes)
│  ├─ Regulatory compliance review
│  ├─ Accuracy metrics vs targets
│  └─ Report to CRO
│
└─ Quarterly compliance audit:
   ├─ Full rule validation (all 14+ rules backtest)
   ├─ Policy alignment check
   ├─ Regulatory requirement check
   ├─ Technology security review
   └─ Board reporting package

TRANSITION CRITERIA (B → C):
Prerequisite conditions to move Stage B → Stage C:

├─ ✓ Stage B operating well (low exceptions, high accuracy)
├─ ✓ Human-system agreement >95% (reviewers agree with recommendations)
├─ ✓ False positive rate <10%
├─ ✓ False negative rate <2%
├─ ✓ Post-decision override rate <5%
├─ ✓ Zero policy breaches detected
├─ ✓ Zero regulatory issues in Stage B period
├─ ✓ System reliability >99.5% uptime
├─ ✓ Audit trail proving complete + immutable
├─ ✓ Explainability working for all decisions
├─ ✓ Staff trained (stage C operation + monitoring)
├─ ✓ Monitoring dashboard operational + tested
├─ ✓ Pilot completed (1000+ cases, <2% errors allowed)
├─ ✓ CRO + CCO approval obtained
├─ ✓ Board approval (enterprise decision)
├─ ✓ Regulatory pre-notification (DFSA, if required)
└─ ✓ Go/No-Go decision by Board + CRO

READINESS CHECK (Will we do Stage C?):
├─ Target launch: Q4 2026 (after 6 months Stage B)
├─ Pilot duration: 8-12 weeks (full Stage C operation)
├─ Pilot sample: All "low-risk staff" + "Qatari simple" requests
├─ Pilot success criteria:
│  ├─ System auto-decision rate: 85%+
│  ├─ Human escalation rate: <15%
│  ├─ False positive rate: <8%
│  ├─ False negative rate: <1.5%
│  ├─ Customer satisfaction: >92%
│  ├─ Zero regulatory issues
│  ├─ Zero escalations due to system error
│  └─ Post-decision fraud rate: <1%
│
└─ Decision point: End of 12-week pilot (Board+ CRO go/no-go)

ON-GOING CONTROL (Stage C OPERATIONAL):
├─ Automation rate target: 75-85%
├─ Approval rate as % of all requests: 55-65%
├─ Escalation rate: <15%
├─ False positive rate: <10% (target: <8%)
├─ False negative rate: <2.5% (target: <1.5%)
├─ Post-decision override rate: <5%
├─ System error rate: <1%
├─ Customer satisfaction (auto-approved): >90%
├─ Regulatory audit findings: Zero
└─ Annual policy review (March each year)
```

### 10.4 Stage Progression Timeline

```
┌─ TIMELINE PROJECTION ──────────────────────┐
│                                             │
│ NOW: March 2026                            │
│ ├─ Stage A: Active (manual with tools)    │
│ ├─ Policy documented                      │
│ └─ Ready for Stage B planning             │
│                                             │
│ Q2 2026 (Apr-Jun): Stage B Transition     │
│ ├─ Finalize system development            │
│ ├─ Staff training (April)                 │
│ ├─ Pilot launch (May 1st)                 │
│ ├─ Pilot duration: 8 weeks                │
│ ├─ Monitoring & refinement                │
│ └─ Go/No-Go decision (June 30th)          │
│                                             │
│ Q3 2026 (Jul-Sep): Stage B Operational    │
│ ├─ Full Stage B deployment (July 1st)     │
│ ├─ System recommends, human approves      │
│ ├─ Monitoring: False positive/negative    │
│ ├─ Metrics show > 90% human-system agree  │
│ └─ Readiness for Stage C building         │
│                                             │
│ Q4 2026 (Oct-Dec): Stage C Transition     │
│ ├─ Finalize full automation               │
│ ├─ Enhanced safeguards deployed           │
│ ├─ Staff retraining (monitoring role)     │
│ ├─ Pilot on low-risk segments (Oct 15th) │
│ ├─ 8-12 week pilot duration               │
│ └─ Go/No-Go decision (Dec 15th)           │
│                                             │
│ Q1 2027 (Jan-Mar): Stage C Operational    │
│ ├─ Full Stage C deployment (Jan 15th)     │
│ ├─ System autonomously decides            │
│ ├─ 75-85% automation rate achieved        │
│ ├─ Real-time monitoring (human watching)  │
│ └─ Monthly control testing + reporting    │
│                                             │
└────────────────────────────────────────────┘

CONTINGENCY:
├─ If Stage B pilot shows >5% errors: Extend pilot 4 weeks
├─ If Stage B errors not resolved: Stay in Stage B longer
├─ If Stage C pilot shows >2% FN rate: Reduce automation scope
├─ If regulatory inquiry received: Pause progression, investigate
├─ If system reliability issue: Rollback to prior stage
└─ All decisions documented + Board-approved
```

---

## 11. DEMO REPRESENTATION

### 11.1 UI/Dashboard Changes Needed

The demo platform must visibly reflect the three-stage maturity model:

```
DASHBOARD ENHANCEMENTS FOR DEMO:

┌─ AUTOMATION ELIGIBILITY BADGE ─────────────────┐
│ Each case shows:                                │
│ ┌────────────────────────────────────────────┐ │
│ │ Case: EDD-2026-001234                      │ │
│ │ Customer: Abdullah Al-Kuwari               │ │
│ │                                             │ │
│ │ AUTOMATION ELIGIBILITY: ✓ YES              │ │
│ │ Stage C Ready (Fully Automated Eligible)   │ │
│ │                                             │ │
│ │ Risk Score: 0 (LOW)                        │ │
│ │ Confidence: 96% (HIGH)                     │ │
│ │                                             │ │
│ │ ✓ All eligibility criteria met             │ │
│ │ ✓ No exclusion triggers                    │ │
│ │ ✓ No fallback-to-human triggers            │ │
│ │                                             │ │
│ │ PREPARED FOR: Auto-Approval (Stage C)      │ │
│ │ ALTERNATIVE: Human-in-Loop Review (StageB) │ │
│ │                                             │ │
│ └────────────────────────────────────────────┘ │
│                                                 │
│ OR (if not eligible):                           │
│ ┌────────────────────────────────────────────┐ │
│ │ AUTOMATION ELIGIBILITY: ✗ NO               │ │
│ │ Stage A Required (Manual Review)           │ │
│ │                                             │ │
│ │ Risk Score: 48 (MEDIUM)                    │ │
│ │ Fallback Trigger: PEP Flag Detected        │ │
│ │                                             │ │
│ │ ✗ Risk score in medium band (36-60)       │ │
│ │ ✗ PEP flag requires escalation             │ │
│ │                                             │ │
│ │ ROUTED TO: Compliance Officer (PEP Team)   │ │
│ │ SLA: 4-hour manual review required         │ │
│ │                                             │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘

┌─ DECISION REASON CARD ──────────────────────────┐
│ Shows WHY the decision was made:                │
│                                                 │
│ DECISION: AUTO-APPROVE (System Code: AA-001)  │
│ Timestamp: 2026-03-12 14:25:30                │
│                                                 │
│ DECISION REASON:                              │
│ ┌──────────────────────────────────────────┐  │
│ │ ✓ Identity Verified (QAR National ID)   │  │
│ │ ✓ KYC Complete (all sections)           │  │
│ │ ✓ Employment Verified (Government)      │  │
│ │ ✓ Income Above Minimum (QAR 875K)       │  │
│ │ ✓ Sanctions Cleared (dated 3/12)        │  │
│ │ ✓ PEP Check Passed (dated 3/12)         │  │
│ │ ✓ Adverse Media Clear                   │  │
│ │ ✓ No Negative Events (past 30 days)     │  │
│ │ ✓ Confidence Level High (96%)           │  │
│ │ ✓ Risk Score Low (0 = very low risk)    │  │
│ └──────────────────────────────────────────┘  │
│                                                 │
│ POLICY BASIS:                                  │
│ Low-Risk Individual + All Eligibility Criteria │
│ Meets Stage C (Full Automation) Policy         │
│                                                 │
│ ALTERNATIVE DECISIONS CONSIDERED:              │
│ ├─ Manual Review (not needed, criteria clear) │
│ ├─ Escalation (no triggers present)           │
│ └─ request Documents (all provided)           │
│                                                 │
└────────────────────────────────────────────────┘

┌─ AUDIT TRAIL TAB ───────────────────────────────┐
│ Complete immutable record:                       │
│                                                 │
│ AUDIT LOG: Case EDD-2026-001234                │
│                                                 │
│ DATA INPUTS:                                   │
│ ├─ Identity: QAR ID #123456 (not expired) ✓   │
│ ├─ DOB: 1988-05-15 (age 38, eligible) ✓      │
│ ├─ Nationality: Qatari ✓                    │
│ ├─ Occupation: Government Employee ✓        │
│ ├─ Monthly Income: QAR 875,000 ✓             │
│ ├─ Source of Funds: Salary ✓                 │
│ ├─ KYC Status: Complete ✓                    │
│ ├─ Documents: 12/12 provided (100%) ✓        │
│ ├─ PEP Check: PASSED (2026-03-12) ✓         │
│ ├─ Sanctions: CLEARED (2026-03-12) ✓        │
│ ├─ Adverse Media: CLEAR ✓                   │
│ ├─ Risk Score: 0 (Calculation shown) ✓      │
│ └─ Confidence Level: 96% ✓                   │
│                                                 │
│ RULES EVALUATED:                              │
│ ├─ RULE_001: Identity Validation — PASS      │
│ ├─ RULE_002: Age Check — PASS                │
│ ├─ RULE_003: Nationality — PASS              │
│ ├─ RULE_004: Occupation — PASS               │
│ ├─ RULE_005: Income Threshold — PASS         │
│ ├─ RULE_006: KYC Complete — PASS             │
│ ├─ RULE_007: Documents — PASS                │
│ ├─ RULE_008: PEP/Sanctions — PASS            │
│ ├─ RULE_009: Risk Score — PASS               │
│ └─ RULE_010: Confidence Level — PASS         │
│                                                 │
│ DECISION LOG:                                  │
│ ├─ Time: 2026-03-12 14:25:30                │
│ ├─ User: SYSTEM_AUTO (Rule Engine)          │
│ ├─ Action: AUTO-APPROVE                     │
│ ├─ Code: AA-001                             │
│ ├─ Approval: Automatic (no override)        │
│ └─ Immutable: YES (locked, read-only)       │
│                                                 │
└────────────────────────────────────────────────┘

┌─ POLICY CONTROLS APPLIED CARD ─────────────────┐
│ Shows what safeguards were applied:            │
│                                                 │
│ CONTROL FRAMEWORK:                            │
│ ┌──────────────────────────────────────────┐  │
│ │ Stage C (Full Automation) Policy          │  │
│ │                                            │  │
│ │ ELIGIBILITY CHECKS:                       │  │
│ │ [✓] Data Completeness ≥ 95%              │  │
│ │ [✓] Data Freshness ≤ 6 months            │  │
│ │ [✓] Source Systems Available             │  │
│ │ [✓] Source System Validation              │  │
│ │ [✓] All Mandatory Checks Passed          │  │
│ │ [✓] KYC/CDD Conditions Met               │  │
│ │ [✓] Risk Score Thresholds Met            │  │
│ │ [✓] No Trigger Exclusions                │  │
│ │ [✓] No Fallback-to-Human Triggers        │  │
│ │ [✓] Documents Complete (95%+)            │  │
│ │                                            │  │
│ │ SAFEGUARDS VERIFIED:                      │  │
│ │ [✓] Policy-bounded automation            │  │
│ │ [✓] Data quality checked (95%+)          │  │
│ │ [✓] Regulatory triggers verified         │  │
│ │ [✓] Confidence level sufficient          │  │
│ │ [✓] Explanability available              │  │
│ │ [✓] Audit trail complete                 │  │
│ │ [✓] No black-box logic used              │  │
│ │                                            │  │
│ │ STATUS: ALL CONTROLS PASSED               │  │
│ │ CLEARED FOR: Stage C Auto-Approval        │  │
│ │                                            │  │
│ └──────────────────────────────────────────┘  │
│                                                 │
└────────────────────────────────────────────────┘

┌─ EXCEPTION / FALLBACK DEMO CARD ───────────────┐
│ Shows what would trigger fallback:             │
│                                                 │
│ FALLBACK TRIGGERS (if ANY were present):       │
│ ├─ [WOULD TRIGGER IF] PEP flag detected       │
│ │  └─ Action: Escalate to Compliance Officer  │
│ │  └─ SLA: 4-hour manual review                │
│ │                                               │
│ ├─ [WOULD TRIGGER IF] Sanctions match detected │
│ │  └─ Action: IMMEDIATE escalation + block     │
│ │  └─ SLA: 1-hour compliance review            │
│ │                                               │
│ ├─ [WOULD TRIGGER IF] Risk score 40-75        │
│ │  └─ Action: Route to human-in-loop review    │
│ │  └─ SLA: 1-2 business day review             │
│ │                                               │
│ └─ [CURRENTLY]: No fallback triggers detected  │
│    └─ Case SAFE for auto-approval              │
│                                                 │
│ NOTE: In this case, all triggers are CLEAR ✓  │
│                                                 │
└────────────────────────────────────────────────┘

┌─ CASE STATUS VIEW (by Stage) ──────────────────┐
│                                                 │
│ STAGE A: Manual Review (Human Decides)        │
│ ├─ Total Cases This Month: 127               │
│ ├─ Avg Time to Decision: 3.2 days            │
│ ├─ Examples:
│ │  ├─ High-risk occupation (lawyer)          │
│ │  ├─ PEP family member                      │
│ │  ├─ Complex business structure             │
│ │  └─ Exceptional geographic risk            │
│ └─ Status: Manual review in progress          │
│                                                 │
│ STAGE B: Human-in-Loop (System + Human)       │
│ ├─ Total Cases This Month: 892               │
│ ├─ System Recommendation Rate: 55%            │
│ ├─ Human Approval Rate: 82%                   │
│ ├─ Examples:
│ │  ├─ Moderate-risk individual (score 36-60) │
│ │  ├─ Business owner (clear docs)            │
│ │  ├─ Source of wealth needs verification    │
│ │  └─ Single risk factor present              │
│ ├─ SLA: 1-2 business days                     │
│ └─ Status: Awaiting human reviewer            │
│                                                 │
│ STAGE C: Fully Automated (System Decides)     │
│ ├─ Total Cases This Month: 1,828             │
│ ├─ Auto-Decision Rate: 89%                    │
│ ├─ Auto-Approval Rate: 73%                    │
│ ├─ Examples:
│ │  ├─ Low-risk staff account                 │
│ │  ├─ Qatari national (simple profile)       │
│ │  ├─ Document completeness check            │
│ │  └─ Routine KYC renewal                    │
│ ├─ SLA: <30 minutes                           │
│ └─ Status: DECIDED (approved/rejected)        │
│                                                 │
├─ AUTO-DECISION BREAKDOWN BY OUTCOME:         │
│  ├─ AUTO-APPROVED: 1,337 cases (73%)         │
│  ├─ AUTO-REJECTED: 364 cases (20%)           │
│ └─ AUTO-ESCALATED: 127 cases (7%)             │
│                                                 │
└────────────────────────────────────────────────┘
```

### 11.2 Visual Dashboard Layout

```
┌──────────────────────────────────────────────────────────┐
│                   AUTOMATION DASHBOARD                   │
│                 Stage A | Stage B | Stage C              │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─ DECISION PIPELINE ──────────────────────────────────┐│
│  │ Incoming Cases → Auto-Eligible? → Fallback Check   ││
│  │                       │           │                 ││
│  │                   [YES]            [NO]              ││
│  │                       ↓             ↓                ││
│  │                  [STAGE C]      [STAGE A/B]          ││
│  │               Auto-Approve       Manual Review       ││
│  │                  (89%)            (11%)              ││
│  │                       ↓             ↓                ││
│  │                  Customer      Analyst Queue         ││
│  │               [APPROVED]      [Various Options]      ││
│  │                                                       ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│  ┌─ CASE CARD (Example: Stage C Eligible) ─────────────┐│
│  │ AUTOMATION ELIGIBILITY: ✓ YES (Stage C Ready)       ││
│  │ Risk: 0 | Confidence: 96% | Escalations: None      ││
│  │ DECISION: AUTO-APPROVE (< 30 min)                   ││
│  │ REASON: All eligibility criteria met + low risk      ││
│  │ SAFEGUARDS: ✓ All controls passed                   ││
│  │ AUDIT: Complete trail + explainability available    ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│  ┌─ CASE CARD (Example: Not Stage-C Eligible) ────────┐│
│  │ AUTOMATION ELIGIBILITY: ✗ NO (Manual Required)     ││
│  │ Risk: 42 | Fallback: PEP Flag                       ││
│  │ ROUTE: Compliance Officer (Escalation)             ││
│  │ REASON: PEP Family Member (requires CDD)           ││
│  │ SLA: 4-hour manual review                           ││
│  │ STAGE: A (Full Manual Review)                       ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
│  ┌─ KPI SUMMARY (Real-Time) ──────────────────────────┐│
│  │ Cases Processed Today: 847 | Auto Rate: 71%        ││
│  │ Stage C Decisions: 601 (71%) | Stage B: 154 (18%)  ││
│  │ Stage A Manual: 92 (11%)                            ││
│  │                                                      ││
│  │ Auto-Approval %: 68% | Auto-Rejection %: 18%       ││
│  │ Auto-Escalation %: 7% | Avg Decision Time: <25min  ││
│  │                                                      ││
│  │ Data Quality: 98% | System Uptime: 99.8%           ││
│  │ False Positive Rate: 7.2% (Target: <10%)           ││
│  │                                                      ││
│  └───────────────────────────────────────────────────────┘│
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 12. REQUIRED DELIVERABLES

### 12.1 Documentation Deliverables

```
✓ Automated Decisioning Policy Framework (this document)
  ├─ 50+ pages, comprehensive governance
  ├─ All 12 sections detailed
  ├─ Case examples + visual flow diagrams
  ├─ Approved by CRO / CCO / Legal

✓ Decision Eligibility Matrix (next document)
  ├─ Request types mapped to automation eligibility
  ├─ Conditions for each stage (A, B, C)
  ├─ Risk scoring methodology
  ├─ Threshold breakdown

✓ Decision Outcomes & Exception Matrices
  ├─ What system can automatically decide (approve/reject/escalate)
  ├─ What triggers fallback-to-human
  ├─ What triggers escalation to compliance
  ├─ Exception handling procedures

✓ Governance & Control Model Document
  ├─ Policy owner (CRO)
  ├─ Business owner (Retail Division)
  ├─ Compliance owner (CCO)
  ├─ Model/rule owner (Analytics)
  ├─ System administrator (IT)
  ├─ Approval workflows
  ├─ Escalation procedures

✓ KPI Monitoring Framework
  ├─ All 20+ metrics defined
  ├─ Target ranges by metric
  ├─ Collection methodology
  ├─ Escalation thresholds
  ├─ Monthly/quarterly/annual review requirements

✓ Three-Stage Maturity Model Document
  ├─ Stage A: Governance & Decision Support (current)
  ├─ Stage B: Human-in-the-Loop (Q2 2026)
  ├─ Stage C: Fully Automated (Q4 2026)
  ├─ Transition criteria for each stage
  ├─ Timeline + milestones
  ├─ Go/no-go decision gates

✓ Executive Narratives (separate documents)
  ├─ GCFO Briefing: Business case + efficiency gains
  ├─ Regulatory Briefing: Control framework + safeguards
  ├─ Risk Committee: Governance structure, monitoring, oversight
  ├─ Board Presentation: Strategic position + risk-benefit
```

### 12.2 System/Demo Deliverables

```
✓ Enhanced Dashboard UI
  ├─ [✓] Automation eligibility badge (visible on each case)
  ├─ [✓] Decision reason card (why was this decision made)
  ├─ [✓] Source systems indicator (which systems were used)
  ├─ [✓] Policy controls applied card (safeguards verification)
  ├─ [✓] Exception/fallback indicator (what would trigger escalation)
  ├─ [✓] Audit trail tab (complete immutable record)
  ├─ [✓] Confidence level indicator (how confident is the system)
  ├─ [✓] Data quality score (was data sufficient)
  └─ [✓] Stage selector (show cases by stage A/B/C)

✓ Automation Decision Engine Updates
  ├─ [✓] Eligibility checker (is this case Stage C eligible?)
  ├─ [✓] Fallback logic (when to escalate to human)
  ├─ [✓] Decision maker (auto-approve/reject/escalate)
  ├─ [✓] Audit logger (complete trail for every decision)
  ├─ [✓] Explainability module (plain-language explanation)
  └─ [✓] Monitoring hooks (KPI collection points)

✓ Demo Workflow Updates
  ├─ [✓] Show Stage A case (manual review queue)
  ├─ [✓] Show Stage B case (system recommends, human reviews)
  ├─ [✓] Show Stage C case (system auto-approves)
  ├─ [✓] Show fallback trigger (e.g., PEP flag stops automation)
  ├─ [✓] Show decision reason (why each decision was made)
  ├─ [✓] Show audit trail (complete immutable record)
  ├─ [✓] Show policy controls (what safeguards were applied)
  └─ [✓] Show confidence/data quality (is system sure?)

✓ Executive Demo Narrative
  ├─ [✓] Opening: "This platform is governed decisioning, not just case management"
  ├─ [✓] Stage A Demo: Manual review with decision support tools
  ├─ [✓] Stage B Demo: System recommends, human approves (hybrid)
  ├─ [✓] Stage C Demo: System autonomously decides (fully automated)
  ├─ [✓] Safeguards Demo: Show PEP flag stopping automation
  ├─ [✓] Audit Demo: Show complete trail + explainability
  ├─ [✓] Control Demo: Show monitoring + quarterly testing
  ├─ [✓] Maturity Demo: Roadmap from Stage A → C over 12 months
  └─ [✓] Closing: "Controlled automation, not black-box AI"
```

---

## 13. EXECUTIVE NARRATIVE: THE MATURITY PATH

### For C-Suite & Board

```
POSITION STATEMENT:

"QIB is introducing GOVERNED, AUTOMATED DECISIONING — not black-box AI.

We are moving from:
  Stage A (2026 now): Manual review with decision support tools
    → Stage B (Q2 2026): Hybrid decisioning (system recommends, human approves)
    → Stage C (Q4 2026): Fully automated decisioning within strict policy boundaries

Every decision — automated or manual — is:
  ✓ Explainable (we can tell you why)
  ✓ Auditable (complete immutable trail)
  ✓ Controlled (by pre-approved policy, not system discretion)
  ✓ Reversible (humans can override or investigate)
  ✓ Monitored (in real-time and monthly)
  ✓ Testable (quarterly control testing)

BUSINESS BENEFITS:
  • 70% faster decisions for low-risk (30 min vs 2-3 days)
  • 45% cost reduction (fewer manual reviews needed)
  • 99% consistency (same policy applied to all cases)
  • Better risk detection (rules don't get tired or skip)
  • Freed analysts for complex cases (specialists on hard decisions)
  • Better customer experience (faster onboarding for low-risk)

GOVERNANCE POSITION:
  • Policy owner: CRO (policy sets all boundaries)
  • Business owner: Head of Retail (SLA + customer experience)
  • Compliance owner: CCO (ensures AML/CFT compliance)
  • Model owner: Analytics VP (rules + thresholds)
  • System owner: IT (stability + monitoring)

CONTROL FRAMEWORK:
  • Real-time monitoring (PEP/sanctions alerts immediate)
  • Daily reporting (decision volume + error rates)
  • Monthly audit (false positive/negative review)
  • Quarterly control testing (sample-based validation)
  • Regulatory-ready explainability (show why each decision happened)

RISK MITIGATION:
  • No automation beyond approved policy scope
  • No automation where data quality is insufficient
  • No automation where humans can't trace the decision
  • No automation where regulatory triggers require human review
  • Fallback-to-human built into system (non-overrideable)

REGULATORY POSITION:
  'This is not an autonomous AI system. It is a governed decision platform that
  applies approved policy consistently. Every decision can be explained,
  audited, and tested. Humans are in the loop for all judgment calls and high-risk
  cases. Regulatory requirements (PEP, sanctions) trigger immediate escalation
  to humans. Quarterly control testing ensures the system operates as designed.'

TIMELINE:
  • NOW (Q1 2026): Manual + decision support (Stage A)
  • APR-JUN 2026: Human-in-loop pilot (Stage B transition)
  • JUL-SEP 2026: Human-in-loop operational (Stage B)
  • OCT-DEC 2026: Full automation pilot (Stage C transition)
  • JAN 2027: Full automation operational (Stage C)
  • Target: 75-85% of requests auto-decided by Q1 2027
"
```

---

## SUMMARY

This policy framework establishes **governed, auditable, explainable automation** for EDD/KYC decisioning at QIB, progressing through three stages:

- **Stage A (Now):** Governance & Decision Support (manual decisions with tools)
- **Stage B (Q2 2026):** Human-in-the-Loop (system recommends, human approves)
- **Stage C (Q4 2026):** Fully Automated (within strict policy boundaries)

Every stage maintains:
✓ 100% explainability
✓ 100% auditability
✓ Complete regulatory defensibility
✓ Automated safeguards (PEP/sanctions hardstops)
✓ Monthly control testing
✓ KPI monitoring

**Not black-box AI. Policy-based automation with human oversight.**

---

**POLICY APPROVED BY:**

Chief Risk Officer: _________________ Date: _______
Chief Compliance Officer: _________________ Date: _______
Head of Retail Banking: _________________ Date: _______
CEO: _________________ Date: _______

**NEXT DOCUMENT:** Decision Eligibility & Exception Matrices (will follow)

---

**END OF POLICY DOCUMENT**

**Document Version:** 1.0  
**Effective Date:** March 12, 2026  
**Next Review:** June 12, 2026 (post-Stage B pilot)
