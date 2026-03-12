# DECISION ELIGIBILITY & EXCEPTION MATRICES
## Automated Decisioning Policy Framework — Request Type Mapping

**Document Version:** 1.0  
**Effective Date:** March 2026  
**Purpose:** Define which request types can be automated at each stage and what triggers fallback-to-human

---

## 1. REQUEST TYPE CLASSIFICATION & AUTOMATION ELIGIBILITY

### Matrix 1A: Request Types by Stage

| **Request Type** | **Stage A** | **Stage B** | **Stage C** | **Risk Level** | **Notes** |
|---|:---:|:---:|:---:|---|---|
| **Low-Risk Staff Account Update** | ✅ Support | ⏸️ N/A | ✅ AUTO | VERY LOW | Existing customer, document update, no profile change |
| **Qatari National <QAR 1M xfer** | ✅ Support | ✅ Review | ✅ AUTO | LOW | Salary income, simple profile, clear documents |
| **Qatari National >QAR 1M xfer** | ✅ Support | ✅ Review | ⏸️ N/A | LOW-MED | Manual review + CDD for higher thresholds |
| **Document Completeness (Simple)** | ✅ Support | ✅ Review | ✅ AUTO | LOW | Documents resolve blocking issue |
| **Employment Verification Follow-up** | ✅ Support | ✅ Review | ⏸️ N/A | LOW-MED | System requests docs, customer completes |
| **Moderate-Risk Individual** | ✅ Support | ✅ **HUMAN** | ⏸️ N/A | MED | Risk score 35-60, one moderate concern |
| **Business Owner (Simple)** | ✅ Support | ✅ **HUMAN** | ⏸️ N/A | MED | Complete docs, clear business, CDD done |
| **Business Owner (Complex)** | ✅ Support | ⏸️ N/A | ❌ EXCLUDE | HIGH | Multiple concerns, investigation needed |
| **High-Risk Occupation** | ✅ **MANUAL** | ❌ N/A | ❌ EXCLUDE | HIGH | Lawyer, accountant, CPA (CDD required) |
| **PEP or Family of PEP** | ✅ **MANUAL** | ❌ N/A | ❌ EXCLUDE | VERY HIGH | Always human review + CDD + escalation |
| **Sanctions Match** | ✅ **ESCALATE** | ❌ N/A | ❌ EXCLUDE | CRITICAL | Immediate escalation + regulatory reporting |
| **Adverse Media (Serious)** | ✅ **ESCALATE** | ❌ N/A | ❌ EXCLUDE | HIGH | Investigation required |
| **Non-Citizen (Offshore)** | ✅ Support | ⏸️ N/A | ❌ EXCLUDE | MED-HIGH | Geographic risk triggers CDD requirement |
| **New Business Segment** | ✅ Support | ⏸️ N/A | ❌ EXCLUDE | UNKNOWN | Validation required before automation |
| **Exemption Request** | ✅ **MANUAL** | ❌ N/A | ❌ EXCLUDE | VAR | Discretionary by policy owner |

**Legend:**
- ✅ Supported (system has role in this stage)
- ⏸️ N/A (request type not applicable to this stage)
- ❌ Excluded (cannot be automated at this stage)
- ✅ AUTO (can be automatically decided)
- ✅ **HUMAN** (requires human review & approval)
- ✅ **MANUAL** (full manual review, system provides support only)
- ✅ **ESCALATE** (required escalation to compliance/security)

---

## 2. STAGE C (FULLY AUTOMATED) DECISION MATRIX

### When Can System Auto-Decide?

```
REQUEST TYPE: Low-Risk Staff Account Update

ELIGIBILITY CONDITIONS (ALL must be true):
├─ ✓ Existing customer (on-file >6 months)
├─ ✓ Current KYC on file (verified <2 years)
├─ ✓ No negative events in past 24 months
├─ ✓ Occupation: Staff member (no change from original)
├─ ✓ Document: Current & valid (expiry >6 months)
├─ ✓ Employment verified with employer
├─ ✓ No PEP/Sanctions flags
├─ ✓ No transaction monitoring alerts
└─ ✓ Data completeness: 100%

DECISION OUTCOMES:
├─ AUTO-APPROVE: All conditions met + no value change
│  └─ Confidence: 99% | FP Rate: <1%
├─ AUTO-REJECT: Document expired
│  └─ Notify: "Please renew expired document"
└─ FALLBACK-TO-HUMAN: Any missing data OR new risk flag
   └─ Route to: Analyst queue

AUTO RATE TARGET: 85-90%
APPROVAL % TARGET: 95-98% (of auto decisions)
REJECTION % TARGET: 2-5%


REQUEST TYPE: Qatari National (Low-Risk Threshold)

ELIGIBILITY CONDITIONS (ALL must be true):
├─ ✓ Nationality: Qatari (not expat)
├─ ✓ Age: 21-65 (not minor, not elderly)
├─ ✓ Occupation: Standard employment (not high-risk)
│  ├─ Examples ALLOWED: Employee, manager, teacher, doctor, engineer
│  └─ Examples BLOCKED: Lawyer, accountant, military, politician
├─ ✓ Employment: Verified with T24 OR external confirmation
├─ ✓ Monthly income: ≥ QAR 300,000 (basic threshold)
├─ ✓ Income source: Clear (salary OR established business)
├─ ✓ Source of wealth: Documented & explained
├─ ✓ KYC: Complete (all sections filled, all docs provided)
├─ ✓ Documents: 100% provided (ID, salary cert, bank statement)
├─ ✓ PEP check: PASSED (within 30 days, negative result)
├─ ✓ Sanctions check: PASSED (within 30 days, negative result)
├─ ✓ Adverse media: CLEAR (no matching alerts)
├─ ✓ Risk score: ≤ 35 (LOW RISK band)
├─ ✓ Confidence level: ≥ 90%
├─ ✓ Data quality score: ≥ 95%
├─ ✓ No negative events in past 60 days
└─ ✓ No pending exceptions or flags

ADDITIONAL VALIDATIONS:
├─ Income/Activity Alignment: Expected deposits ≤ 120% of income
├─ Employment verification: Employer name matches T24 record
├─ Document readability: OCR score ≥ 85% on all docs
└─ No system unavailability

DECISION OUTCOMES:
├─ AUTO-APPROVE: All conditions met + low risk
│  └─ Confidence: 92-96% | FP Rate: 4-6%
├─ AUTO-REQUEST-DOCS: Minor doc gaps (can be resolved)
│  └─ Auto-email with 30-day deadline
│  └─ If provided: Re-evaluate (may auto-approve)
│  └─ If NOT provided: Auto-reject after deadline
├─ AUTO-ESCALATE: Risk score 36-50 (medium-risk band)
│  └─ Route to: Analyst (Stage B human-in-loop)
├─ AUTO-REJECT: Risk score >50 OR critical data missing
│  └─ Examples: Expired ID, sanctions match, unverified income
└─ FALLBACK-TO-HUMAN: Confidence <90% OR data quality <95%
   └─ Route to: Analyst queue

AUTO RATE TARGET: 65-75%
APPROVAL % TARGET: 72-80% (of auto decisions)
ESCALATION % TARGET: 10-15%
REQUEST-DOCS % TARGET: 10-15%
REJECTION % TARGET: 5-8%


REQUEST TYPE: Document Completeness Verification

SCENARIO: Customer previously rejected due to missing documents,
          now provides the missing documents.

ELIGIBILITY CONDITIONS (ALL must be true):
├─ ✓ Previous case exists (customer has applied before)
├─ ✓ Previous decision issue: Explicitly "Missing Documents"
├─ ✓ Documents now provided: Match what was originally requested
├─ ✓ Document quality: Readable, complete, valid (not expired)
├─ ✓ Document validation: Pass OCR, readability, authenticity checks
├─ ✓ No NEW risk indicators: No fraud flags, no new alerts
├─ ✓ Case context unchanged: Same request type, same scenario
├─ ✓ Confidence level: ≥ 88%
└─ ✓ Not a judgment call: Clear pass/fail criteria

DECISION OUTCOMES:
├─ AUTO-APPROVE: Documents resolve the issue + all other checks pass
│  └─ Example: "Identity renewed, now current" → APPROVE
├─ AUTO-REJECT: Documents reveal new risk indicators
│  └─ Example: "ID shows high-risk jurisdiction" → REJECT or escalate
├─ AUTO-REQUEST-MORE-DOCS: Documents incomplete (missing pages, etc)
│  └─ Email: "We received your documents but need page X of Y"
│  └─ 30-day deadline to provide complete set
└─ FALLBACK-TO-HUMAN: Judgment call about document sufficiency
   └─ Route to: Analyst (was the issue really resolved?)

AUTO RATE TARGET: 70-75%
APPROVAL % TARGET: 80-85% (of auto decisions)
REJECTION % TARGET: 5-10%
REQUEST-MORE % TARGET: 10-15%
```

---

## 3. STAGE B (HUMAN-IN-THE-LOOP) DECISION MATRIX

### When Does System RECOMMEND to Human?

```
REQUEST TYPE: Moderate-Risk Individual

SYSTEM RECOMMENDATION BASIS:
├─ Risk score: 35-60 (MEDIUM band)
├─ Data mostly complete (90%+)
├─ One or two moderate concerns present
├─ No PEP/Sanctions/Fraud indicators
├─ Confidence level: 75-84% (medium-high)
└─ judgment call benefits from human expertise

SYSTEM PRESENTS:
├─ All data collected
├─ Risk score breakdown (what triggered medium-risk)
├─ Which criteria passed, which have concerns
├─ Recommendation: [APPROVE] [REQUEST DOCS] [ESCALATE]
├─ Supporting evidence for recommendation
└─ Confidence level + explanation

HUMAN REVIEWER DECIDES:
├─ Approves system recommendation → Case CLOSES (approved)
├─ Requests documents → Customer gets request, system waits 30 days
├─ Escalates to specialist → Case moves to escalation queue
├─ Rejects recommendation → Case closed (rejected)
└─ Overrides recommendation → Logs override reason, case closed

EXAMPLE SCENARIOS:
├─ Income: QAR 450K (above minimum) BUT business owner (unverified)
│  └─ System: "Request tax returns to verify business income"
│  └─ Human: Reviews docs provided, approves or requests more
│
├─ Age: 68 (approaching retirement) BUT stable employment
│  └─ System: "Review retirement income source + stability"
│  └─ Human: Evaluates coverage in case of job loss, approves if sufficient
│
├─ Nationality: GCC national (not Qatari) BUT established in Qatar
│  └─ System: "Geographic risk requires CDD review"
│  └─ Human: Reviews CDD documentation, approves if sufficient
│
└─ Income/Activity: Expected deposits ~110% of income (slightly high)
   └─ System: "Slight mismatch, recommend verification"
   └─ Human: Reviews actual transactions vs projected, approves if explained

HUMAN REVIEW SLA: 24-48 hours
APPROVAL % TARGET: 70-85% (human approval of eligible cases)
OVERRIDE % TARGET: <10% (human disagrees with system recommendation)
```

---

## 4. FALLBACK-TO-HUMAN TRIGGERS MATRIX

### When Does Automation STOP?

| **Trigger** | **Severity** | **Action** | **Route** | **SLA** | **Reason Code** |
|---|---|---|---|---|---|
| **PEP Match** | 🔴 CRITICAL | ESCALATE immediately | Compliance Officer | 4 hours | FALLBACK_PEP |
| **Sanctions Match** | 🔴 CRITICAL | ESCALATE + block | Compliance + Legal | 1 hour | FALLBACK_SANCTIONS |
| **Fraud Alert** | 🔴 CRITICAL | ESCALATE + block | Security + Compliance | 1 hour | FALLBACK_FRAUD |
| **Document Missing (Critical)** | 🟡 HIGH | Auto-request (30d) | Customer Service | 30 days | REQUEST_DOCUMENTS |
| **Risk Score >60** | 🟡 HIGH | ESCALATE | Senior Analyst | 24 hours | FALLBACK_HIGH_RISK |
| **Confidence <85%** | 🟡 HIGH | ESCALATE | Analyst | 24 hours | FALLBACK_LOW_CONFIDENCE |
| **Data Inconsistency** | 🟡 HIGH | ESCALATE | Data Quality Team | 24 hours | FALLBACK_DATA_CONFLICT |
| **Source System Down** | 🟡 HIGH | ESCALATE | IT Support | 4 hours | FALLBACK_SYSTEM_ERROR |
| **Data Freshness Exceeded** | 🟠 MEDIUM | ESCALATE | Analyst | 48 hours | FALLBACK_STALE_DATA |
| **Employment Not Verified** | 🟠 MEDIUM | Auto-request docs | Customer Service | 30 days | REQUEST_VERIFICATION |
| **Multiple Minor Flags** | 🟠 MEDIUM | ESCALATE | Analyst | 48 hours | FALLBACK_MULTIPLE_FLAGS |
| **Concurrent Edit Detected** | 🟠 MEDIUM | HALT automation | System | Immediate | FALLBACK_CONCURRENT_EDIT |

---

## 5. EXCEPTION & OVERRIDE MATRIX

### When Can Human Override System Decision?

```
SCENARIO 1: System Recommends AUTO-APPROVE, Human Wants to REJECT

Allowed?   ✅ YES (human discretion on judgment calls)
Process:   ├─ Document reason for override
           ├─ Log in audit trail (oversight required)
           ├─ Notify management if pattern emerges
           └─ Monthly review of overrides
Approval:  Senior Analyst authorization required
Audit:     Full trail logged + reviewed monthly


SCENARIO 2: System Recommends AUTO-REJECT, Human Wants to APPROVE

Allowed?   ✅ YES (only for documented exceptions)
Process:   ├─ Document business rationale
           ├─ Obtain CRO written approval
           ├─ Exception logged as "Policy Exception"
           ├─ Case goes through enhanced manual review
           └─ Quarterly reporting to Compliance
Approval:  CRO approval REQUIRED before override
Audit:     Exception documented + escalated to Board


SCENARIO 3: System Recommends ESCALATE, Human Wants to APPROVE Anyway

Allowed?   ⚠️ LIMITED (only if reason was escalation, not exclusion)
Process:   ├─ Assessment: Is this an exclusion (PEP/Sanctions) or escalation (risk)?
           ├─ If escalation (medium-risk): Human can review + approve
           ├─ If exclusion (PEP/Sanctions): NO override possible
           ├─ Document decision rationale
           └─ Log & audit as standard human review
Approval:  Analyst-level for escalations; CRO for exclusions (impossible)
Audit:     Trail shows system escalation + human decision


SCENARIO 4: System Auto-Decides, Later Discovered to be WRONG (Post-Audit)

Process:   ├─ Identify error type (false positive or false negative)
           ├─ Log as control finding
           ├─ Investigate root cause (data issue? rule error? edge case?)
           ├─ Adjust rules if systematic pattern detected
           ├─ Individual case decision: leave as-is OR escalate if reversible
           └─ Adjust monitoring if new risk detected
Report:    Monthly to CRO + monthly false positive/negative analysis


HARD STOPS (NO OVERRIDE POSSIBLE):

├─ Sanctions Match: ❌ NO OVERRIDE (regulatory requirement)
├─ PEP Match: ❌ NO APPEAL POSSIBLE (escalate for CDD, no override)
├─ Fraud Alert: ❌ NO OVERRIDE (security lockdown)
├─ Compliance Block: ❌ NO OVERRIDE (must escalate to Compliance Officer)
├─ Rule Breach: ❌ NO OVERRIDE (system design prevents violation)
└─ System Error: ❌ NO OVERRIDE (IT fixes error, re-evaluate case)
```

---

## 6. REQUEST TYPE FLOW DIAGRAMS

### Flow: Qatari National Request

```
INCOMING REQUEST: Qatari National, Salary Income, Clear Documents
        │
        ▼
┌─────────────────────────────────────────┐
│ CHECK STAGE-C ELIGIBILITY               │
├─────────────────────────────────────────┤
│ ✓ Nationality: Qatari                   │
│ ✓ Age: 28 (in range 21-65)             │
│ ✓ Occupation: Standard (Engineer)      │
│ ✓ Employment: Verified (T24)            │
│ ✓ Income: QAR 750K (above minimum)     │
│ ✓ Documents: 12/12 provided (100%)     │
│ ✓ PEP/Sanctions: PASSED                │
│ ✓ Risk Score: 5 (LOW)                  │
│ ✓ Confidence: 96% (HIGH)               │
│ ✓ Data Quality: 98%                    │
│ ✓ No negative events                   │
│ ✓ No fallback triggers                 │
└─────────────────────────────────────────┘
        │
        ▼ YES, ALL CONDITIONS MET
        │
        ▼
    ┌───────────────────┐
    │ AUTO-APPROVE      │
    │ (Stage C)         │
    │                   │
    │ Status: APPROVED  │
    │ Confidence: 96%   │
    │ Time: 18 min      │
    │                   │
    │ ✓ Email sent      │
    │ ✓ Account active  │
    │ ✓ Case closed     │
    └───────────────────┘


ALTERNATIVE FLOW 1: Risk Score is 42 (MEDIUM)

INCOMING REQUEST: Same customer but risk score 42 (above 35 threshold)
        │
        ▼
┌─────────────────────────────────────────┐
│ CHECK STAGE-C ELIGIBILITY               │
│ ... (all other checks pass)             │
│ ❌ Risk Score: 42 (MEDIUM, not LOW)    │
└─────────────────────────────────────────┘
        │
        ▼ NO, NOT ELIGIBLE FOR STAGE C
        │
        ▼
┌─────────────────────────────────────────┐
│ ROUTE TO STAGE B                        │
│ (Human-in-Loop)                         │
├─────────────────────────────────────────┤
│ SYSTEM RECOMMENDATION:                  │
│ "Moderate risk. Request: Verify income  │
│ source with recent tax returns."        │
│                                         │
│ ▼ HUMAN REVIEWER                        │
│ Receives: System analysis + evidence    │
│ Decides: Approve / Reject / Request     │
│                                         │
│ (Result: Depends on human judgment)     │
└─────────────────────────────────────────┘


ALTERNATIVE FLOW 2: PEP Flag Detected

INCOMING REQUEST: Same customer but PEP database match
        │
        ▼
    ┌───────────────────────────────────┐
    │ FALLBACK TRIGGER: PEP MATCH       │
    │                                   │
    │ ❌ AUTOMATION STOPS IMMEDIATELY  │
    │                                   │
    │ ROUTE: Escalate to               │
    │ Compliance Officer               │
    │                                   │
    │ SLA: 4-hour review               │
    │ Action: Enhanced CDD required    │
    └───────────────────────────────────┘
```

---

## 7. EXCLUSION POLICY MATRIX

### Request Types That CANNOT Be Automated (Any Stage)

| **Scenario** | **Why Excluded** | **What System Does** | **Human Review Required** |
|---|---|---|---|
| **Any PEP Match** | Regulatory requirement (FATF) | ESCALATE immediately + block | Compliance Officer (full CDD) |
| **Any Sanctions Match** | Regulatory requirement (AML law) | ESCALATE + block + report | Legal + Compliance (24h) |
| **Fraud Suspected** | Security & fraud prevention | ESCALATE + block + alert | Security team + Compliance |
| **High-Risk Occupation** (Lawyer, Accountant, Military) | Enhanced CDD mandated | ESCALATE + require CDD docs | Analyst with CDD approval |
| **Non-Citizen (Offshore residence)** | Geographic risk + CDD required | ESCALATE + request CDD docs | Analyst with CDD review |
| **Complex Business Structure** (Multiple entities, beneficial ownership unclear) | Risk of shell company use | ESCALATE + require docs | Analyst (investigation level) |
| **Exemption Request** | Discretionary by policy | ESCALATE + business case required | CRO approval required |
| **New Business Segment** | Model validation required | ESCALATE + mark for study | Product team + CRO approval |
| **Customer complaint active** | Legal hold on decisions | ESCALATE + hold decision | Legal team must clear |
| **Regulatory investigation pending** | Compliance requirement | ESCALATE + hold all decisions | Compliance must clear |

---

## 8. STAGE PROGRESSION GATES

### Transition Criteria: A → B → C

```
GATE 1: Stage A → Stage B (Q2 2026 Readiness)

All of these must be TRUE:
├─ ✅ Stage A operating 6+ weeks without control breaches
├─ ✅ Approval accuracy >95% (manual decisions reviewed)
├─ ✅ Policy documented + Board approved (this framework)
├─ ✅ System tested in QA (6 weeks minimum)
├─ ✅ Staff trained (4+ hours per reviewer)
├─ ✅ Monitoring dashboard live (KPI collection working)
├─ ✅ Fallback logic implemented + tested (no auto when it shouldn't)
├─ ✅ Audit trail validated (complete for all decisions)
├─ ✅ Regulatory pre-notification sent (if required: QCB, DFSA)
├─ ✅ Go/No-Go decision by CRO + CEO + Board
├─ ✅ Pilot recruitment (500-1000 test cases)
└─ ✅ Timeline: Launch by May 1, 2026

GATE 2: Stage B Pilot Success (Aug 31, 2026 Go-Decision)

All of these must be TRUE:
├─ ✅ Pilot completed 6-8 weeks (500+ cases)
├─ ✅ System accuracy >98% (recommendations correct)
├─ ✅ Human-system agreement >92% (reviewers agree with system)
├─ ✅ Zero policy breaches (automation stayed in bounds)
├─ ✅ Zero regulatory issues (no exam findings)
├─ ✅ Customer satisfaction >90% (feedback on hybrid approach)
├─ ✅ Staff adoption >85% (reviewers using system effectively)
├─ ✅ False positive rate <10% (over-escalations acceptable)
├─ ✅ False negative rate <2% (missed high-risk unacceptable)
├─ ✅ SLA compliance >95% (decisions timely)
├─ ✅ Monthly control testing passed (sampled validation)
├─ ✅ Go/No-Go decision: Proceed to Stage C OR extend Stage B
└─ ✅ Board approval required for Stage C transition

GATE 3: Stage B → Stage C (Q4 2026 Readiness)

All of these must be TRUE:
├─ ✅ Stage B operating 6+ months without incidents
├─ ✅ False positive rate <8% (acceptable for full automation)
├─ ✅ False negative rate <1.5% (strict for full automation)
├─ ✅ Post-decision override rate <5% (system mostly right)
├─ ✅ Explainability validated (regulators can understand)
├─ ✅ System reliability >99.5% uptime
├─ ✅ Safeguards deployed + tested (hardstop for PEP/sanctions)
├─ ✅ Real-time monitoring live (KPI dashboards)
├─ ✅ Stage C pilot plan documented (300-500 cases)
├─ ✅ Staff retraining complete (monitoring role, not decision-making)
├─ ✅ Regulatory notification sent (pre-Stage C notification)
├─ ✅ Go/No-Go decision by CRO + CEO + Board
└─ ✅ Timeline: Launch by Jan 15, 2027
```

---

## 9. SUMMARY TABLE: Request Types & Automation Paths

```
┌──────────────────────────────────────┬────────┬────────┬────────┬────────────┐
│ REQUEST TYPE                         │ STAGE A│ STAGE B│ STAGE C│ AUTO RATE  │
├──────────────────────────────────────┼────────┼────────┼────────┼────────────┤
│ Low-Risk Staff Account               │ ✅     │ ⏸️     │ ✅     │ 85-90%     │
│ Qatari National (Simple)             │ ✅     │ ✅     │ ✅     │ 65-75%     │
│ 65-75% Document Completeness         │ ✅     │ ✅     │ ✅     │ 70-75%     │
│ Moderate-Risk Individual             │ ✅     │ ✅ HUM │ ⏸️     │ 50-60%→pop │
│ Business Owner (Standard)            │ ✅     │ ✅ HUM │ ⏸️     │ 40-50%→pop │
│ High-Risk Occupation                 │ ✅ MAN │ ❌     │ ❌     │ 0%         │
│ PEP / Family of PEP                  │ ✅ ESC │ ❌     │ ❌     │ 0%         │
│ Sanctions Match                      │ ✅ ESC │ ❌     │ ❌     │ 0%         │
│ Non-Citizen / Offshore               │ ✅     │ ⏸️     │ ❌     │ 0%         │
│ Complex Business                     │ ✅ SUP │ ⏸️     │ ❌     │ 0%         │
│ Exemption Request                    │ ✅ MAN │ ❌     │ ❌     │ 0%         │
│ New Business Segment                 │ ✅ SUP │ ⏸️     │ ❌     │ 0%         │
└──────────────────────────────────────┴────────┴────────┴────────┴────────────┘

Legend: ✅ = eligible, ✅ HUM = human review, ✅ MAN = manual, ✅ ESC = escalate,
        ⏸️ = N/A, ❌ = excluded, AUTO RATE = % eligible for automation at that stage
```

---

## APPENDIX: Request Type Decision Trees

### Decision Tree 1: Is This Request Auto-Eligible?

```
INCOMING REQUEST
        │
        ├─ Is PEP match? → ❌ NO (escalate immediately)
        │
        ├─ Is Sanctions match? → ❌ NO (escalate + block immediately)
        │
        ├─ Is Fraud detected? → ❌ NO (escalate + block immediately)
        │
        ├─ Is data completeness < 95%? → REQUEST DOCUMENTS (auto-email 30-day deadline)
        │
        ├─ Is risk score > 60? → ✅ ESCALATE (human review needed)
        │
        ├─ Is confidence < 85%? → ✅ ESCALATE (not sure enough)
        │
        ├─ Is source system unavailable? → ✅ ESCALATE (can't verify)
        │
        ├─ Is data conflicting between systems? → ✅ ESCALATE (need investigation)
        │
        ├─ Risk score 35-60 (medium)? → ✅ STAGE B (human-in-loop)
        │
        └─ Risk score 0-35 (low) + all above passed? → ✅ STAGE C (auto-eligible)
                │
                ├─ Is PEP/Sanctions PASSED? (double-check)
                ├─ Is confidence ≥ 85%?
                ├─ Is data quality ≥ 95%?
                ├─ Are all mandatory fields populated?
                ├─ Are documents 100% complete?
                │
                └─ If ALL YES → ✅ AUTO-APPROVE or AUTO-REJECT
                   If ANY NO → ✅ ESCALATE to human
```

### Decision Tree 2: Stage C Auto-Decision (What To Decide?)

```
STAGE C ELIGIBLE REQUEST
        │
        ├─ Does it meet ALL auto-approval criteria?
        │  ├─ Risk score 0-35? ✓
        │  ├─ All documents provided? ✓
        │  ├─ Employment verified? ✓
        │  ├─ Income credible? ✓
        │  ├─ Source of funds documented? ✓
        │  ├─ PEP/Sanctions cleared? ✓
        │  └─ Confidence ≥ 90%? ✓
        │  │
        │  └─ ✅ YES → AUTO-APPROVE (send approval letter, activate account)
        │
        ├─ Does it have CRITICAL data missing?
        │  ├─ Identity document expired? ✓
        │  ├─ Employment unverified? ✓
        │  ├─ Fraud alert? ✓
        │  └─ Risk score jump? ✓
        │  │
        │  └─ ✅ YES → AUTO-REJECT (explain reason to customer)
        │
        ├─ Does it have MINOR doc gaps (resolvable)?
        │  ├─ Salary certificate not on file? ✓
        │  ├─ Employment verification needed? ✓
        │  └─ Source of funds explanation missing? ✓
        │  │
        │  └─ ✅ YES → AUTO-REQUEST (email with 30-day deadline to customer)
        │
        └─ Something unclear / system not confident?
           │
           └─ ✅ YES → ESCALATE (route to human analyst)
```

---

**END OF MATRICES DOCUMENT**

**Next Document:** Demo Enhancement Specifications (UI/UX changes needed)

---

**Document Version:** 1.0  
**Effective Date:** March 12, 2026  
**Next Review:** May 15, 2026 (post-Stage B pilot launch)
