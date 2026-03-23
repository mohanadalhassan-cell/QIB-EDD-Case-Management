# AUTOMATED DECISIONING GOVERNANCE & CONTROL MODEL
## Three-Stage Maturity Model — Roles, Responsibilities, Approval Authority

**Document Version:** 1.0  
**Effective Date:** March 12, 2026  
**Purpose:** Define governance structure, roles, decision authority, and control framework

---

## 1. GOVERNANCE ROLES & RESPONSIBILITIES

### 1.1 Chief Risk Officer (Policy Owner)

**Authority:** Ultimate policy ownership & approval

**Responsibilities:**
├─ Approves Automated Decisioning Policy (this framework)
├─ Approves all significant policy changes
├─ Approves stage transitions (A→B, B→C)
├─ Reviews monthly KPI reports + control findings
├─ Escalates policy breaches to Board
├─ Manages regulatory communication re: automation
├─ Annual policy review & refresh
└─ Approves exceptions to policy

**Decision Authority:**
| Decision | CRO Involvement | Required? |
|----------|-----------------|-----------|
| Approve/Reject auto-decision | No | Only if manually overridden (reviewed) |
| Change automation rules | Yes | Approval required (with Compliance) |
| Increase automation scope | Yes | Approval required |
| Policy exception | Yes | Approval required |
| Stage transition | Yes | Co-approve with CEO |
| Regulatory response | Yes | Primary authority |

**Reporting:**
- Monthly: KPI dashboard review (decision metrics)
- Quarterly: Control testing results + exceptions
- Annually: Policy effectiveness + changes needed

---

### 1.2 Chief Compliance Officer (Compliance Owner)

**Authority:** Regulatory compliance oversight of automation

**Responsibilities:**
├─ Approves automation eligibility scope (which request types)
├─ Escalation authority for regulatory-triggered flags (PEP/Sanctions)
├─ Monthly compliance review of auto-decisions
├─ Regulatory risk assessment of automation policy
├─ Documents control framework for regulators
├─ Investigates post-decision regulatory issues
├─ Approves changes affecting regulatory compliance
└─ Regulatory communication re: automation capabilities

**Decision Authority:**
| Decision | CCO Involvement | Required? |
|----------|-----------------|-----------|
| PEP/Sanctions escalation | Yes | Mandatory escalation to CCO |
| Stage eligibility change | Yes | Co-approve with CRO |
| Regulatory reporting | Yes | Primary authority |
| Policy exception | Yes | Co-approve with CRO |
| Compliance audit findings | Yes | Response required |

**Escalation Authority:**
- Any PEP match: CCO must review
- Any Sanctions match: CCO + Legal must review
- Any regulatory inquiry: CCO owns response

---

### 1.3 Head of Retail Banking (Business Owner)

**Authority:** Business operations & customer impact

**Responsibilities:**
├─ Owns SLA performance (time to decision)
├─ Owns customer experience & satisfaction
├─ Reviews automation metrics monthly
├─ Manages staffing for manual review queues
├─ Escalates systemic issues or complaints
├─ Approves changes affecting customer-facing processes
├─ Ensures staff training & readiness
└─ Co-approves stage transitions

**Decision Authority:**
| Decision | BusOwner Involvement | Required? |
|----------|---------------------|-----------|
| Automation scope | Consulted | Input on feasibility |
| SLA changes | Yes | Primary authority |
| Staff allocation | Yes | Primary authority |
| Customer communication | Yes | Primary authority |
| Stage transition | Yes | Co-approve (impact) |

**Performance Targets (Owned):**
- Stage C: <30 min auto-decision
- Stage B: <2 business day total
- Stage A: 3-5 business days
- Customer satisfaction: >85%

---

### 1.4 VP Analytics & AI (Model & Rule Owner)

**Authority:** Rule design, validation, performance

**Responsibilities:**
├─ Designs risk scoring model & rules
├─ Develops decision thresholds & criteria
├─ Backtests rules on historical data
├─ Monitors rule performance (precision, false positives)
├─ Recommends rule adjustments
├─ Implements approved changes
├─ Quarterly model validation
└─ Escalates rule performance issues

**Decision Authority:**
| Decision | Model Owner Involvement | Required? |
|----------|------------------------|-----------|
| New/changed rule | Yes | Implement & test |
| Threshold adjustment | Yes | Recommend + validate |
| Performance issue | Yes | Investigate root cause |
| Rule exception | No | CRO decides, but Model Owner implements safeguards |

**Quality Metrics (Owned):**
- False positive rate: <10% (monthly)
- False negative rate: <2% (monthly)
- Rule precision: >85% for each rule
- Model stability: No drift >5% quarter-on-quarter

---

### 1.5 IT Operations (System Owner)

**Authority:** System stability, security, audit logging

**Responsibilities:**
├─ Ensures system uptime (target 99.5%+)
├─ Maintains audit logging 100% complete
├─ Ensures immutability of audit trails
├─ Monitors system performance & errors
├─ Escalates system issues immediately
├─ Maintains data backups & recovery capability
├─ Ensures data security & access controls
└─ Provides system documentation

**Control Authority:**
| Control Area | IT Owner Authority |
|--------------|-------------------|
| System availability | Primary |
| Audit trail integrity | Primary (immutable records) |
| Data backup/recovery | Primary |
| Access controls | Primary |
| Performance monitoring | Primary |

**SLAs:**
- System uptime: 99.5% (4.38 hours downtime/month maximum)
- Audit logging: 100% (zero decisions without complete trail)
- Emergency response: <1 hour for critical issues
- Backup validation: Weekly test restores

---

### 1.6 Senior Analyst / Manual Reviewer

**Authority:** Manual decision-making on Stage A & B cases

**Responsibilities:**
├─ Reviews Stage A cases (full manual)
├─ Reviews/approves Stage B system recommendations
├─ Documents decision rationale
├─ Escalates complex cases to CRO
├─ Collaborates with Compliance Officer
├─ Alerts management on systemic issues
├─ Supports quality control/sampling
└─ Documents case notes for audit

**Review Authority:**
- Stage A: Full authority to approve/reject/escalate
- Stage B: Review+approval authority (can override system)
- Escalation: Can escalate up to CRO

**Quality Standards:**
- Cases reviewed per SLA: 95%+
- Documentation completeness: 100%
- Override justification: Always documented
- Escalations: Properly logged

---

## 2. APPROVAL WORKFLOWS

### 2.1 NEW POLICY APPROVAL (Before Launch)

```
┌─ CRO + CEO + Board
│
└─ AUTOMATED DECISIONING POLICY
   ├─ Review: Legal, Compliance, Risk, Retail
   ├─ Approval: CRO (Policy Owner)
   ├─ Co-approval: CCO (regulatory), CEO (enterprise)
   ├─ Board notification: Audit Committee
   └─ Effective: Board approval date
```

**Timeline:** 2 weeks for review & approval cycle

---

### 2.2 RULE CHANGE APPROVAL (Ongoing)

```
┌─ Model Owner proposes change
│
├─ Backtest on 6 months historical data
├─ Calculate impact (expected false positive ↓ by X%, approval rate ↑ by Y%)
│
├─ Submit for approval:
│  ├─ CRO approval (policy alignment)
│  ├─ CCO approval (regulatory impact)
│  └─ Compliance signoff
│
├─ Approval decision
│  ├─ YES → Implement, effective next business day
│  └─ NO → Return for revision or reject
│
└─ Update policy document
   └─ Change log created
   └─ Stakeholders notified
```

**Timeline:** 5-7 business days for change cycle

**Example:** "High-Risk Occupation weight reduction from 40 pts → 30 pts"
- Impact: Reduce false positives (over-escalations) by 15-20%
- Risk: None (still within acceptable thresholds)
- Approval: CRO + CCO + Model Owner
- Effective: March 15, 2026

---

### 2.3 AUTOMATION SCOPE CHANGE (New Request Types)

```
┌─ Business Owner proposes new request type for automation
│
├─ Impact Assessment:
│  ├─ Volume expected (cases/month)
│  ├─ Risk profile (low/medium/high)
│  └─ Policy fit (Stage A/B/C appropriate)
│
├─ Model Owner designs eligibility rules
│  ├─ Defines thresholds & criteria
│  ├─ Backtests on similar request types
│  └─ Projects false positive rate
│
├─ Policy Review:
│  ├─ CRO: Policy alignment
│  ├─ CCO: Regulatory assessment
│  ├─ Analytics: Model readiness
│  └─ Retail: Operational readiness
│
├─ Approval Decision:
│  └─ Three-way approval: CRO + CCO + Business Owner
│
└─ Implementation:
   ├─ 1-week pilot (100 cases)
   ├─ Validation of actual metrics vs projected
   ├─ Approval to go full deployment
   └─ Official notification to all stakeholders
```

**Timeline:** 3-4 weeks per new request type

---

### 2.4 STAGE TRANSITION APPROVAL (A → B → C)

```
STAGE A → B TRANSITION (Q2 2026):

┌─ Stage A has operated 6+ weeks without control breaches
├─ Pilot plan created (500-1000 test cases)
├─ System tested in QA environment
├─ Staff trained (4+ hours per reviewer)
├─ Go/No-Go Decision:
│  ├─ CRO: Policy readiness
│  ├─ CEO: Enterprise readiness
│  ├─ Business Owner: Operational readiness
│  └─ Board approval (Audit Committee)
├─ Pilot begins: May 1, 2026
├─ Pilot monitoring: 8 weeks
└─ Success criteria:
   ├─ System accuracy >98%
   ├─ Human-system agreement >92%
   ├─ Zero regulatory issues
   └─ Customer satisfaction >90%

Outcome: Board decision to proceed with Stage B operational OR extend pilot


STAGE B → C TRANSITION (Q4 2026):

┌─ Stage B has operated 6+ months without material issues
├─ False positive rate <8%
├─ False negative rate <1.5%
├─ Post-decision override rate <5%
├─ Enhanced safeguards tested & deployed
├─ Go/No-Go Decision:
│  ├─ CRO: Ready for full automation
│  ├─ CEO: Enterprise scale approval
│  ├─ Board: Final authorization
│  └─ Regulatory pre-notification (if required)
├─ Pilot begins: October 15, 2026
├─ Pilot monitoring: 8-12 weeks
└─ Success criteria:
   ├─ Auto-decision rate >85%
   ├─ Human escalation <15%
   ├─ False positive <8%
   ├─ False negative <1.5%
   └─ Zero regulatory issues

Outcome: Board decision for Stage C full operational OR extended Stage B
```

---

## 3. CONTROL FRAMEWORK

### 3.1 Real-Time Controls (Automated)

**Hardstops (Non-overrideable):**
```
IF PEP_MATCH → ESCALATE immediately (Compliance)
IF SANCTIONS_MATCH → ESCALATE immediately (Compliance + Legal)
IF FRAUD_ALERT → ESCALATE immediately (Security)
IF SYSTEM_DOWN → ESCALATE immediately (IT + Manual)
IF DATA_CONFLICT → ESCALATE immediately (Analyst)
```

**Automatic Fallbacks:**
```
IF CONFIDENCE < 85% → Route to human
IF DATA_QUALITY < 85% → Route to human
IF RISK_SCORE > 60 → Route to human or Stage B
IF EMPLOYMENT_UNVERIFIED → AUTO_REQUEST_DOCUMENTS
IF DOCS_MISSING → AUTO_REQUEST_DOCUMENTS
```

---

### 3.2 Daily Controls (Automated Monitoring)

**Metrics Monitored:**
```
✓ Auto-decision count (daily target)
✓ Auto-decision breakdown (approve/reject/escalate/request)
✓ Error rate (any system failures)
✓ SLA compliance (decision time)
✓ Escalation rate by reason
✓ Customer notification success rate
```

**Alerts Triggered:**
```
IF auto_decision_count < 50% of expected → Alert manager
IF error_rate > 1% → Alert IT + Manager
IF SLA_compliance < 95% → Alert manager
IF PEP_escalation not within 1 hour → Alert compliance
```

---

### 3.3 Monthly Controls (Human Review)

**Control Testing (Sample-Based):**
```
Sample 50-100 auto-decisions from previous month:
├─ Re-run through automation logic
├─ Verify decision would be the same today
├─ Check audit trail is complete
├─ Identify any rule gaps or edge cases
└─ Document findings + recommendations
```

**Fairness Audit:**
```
Analyze decision outcomes by demographic groups:
├─ Gender (approval rate male vs female)
├─ Age (approval rate by age bracket)
├─ Nationality (Qatari vs expat approval rates)
├─ Segment (premium vs mass approval rates)
└─ Alert if any group varies >10% from others
```

**False Positive/Negative Analysis:**
```
Identify cases that should have been decided differently:
├─ False Positives: Auto-escalated that should have auto-approved
├─ False Negatives: Auto-approved that later failed
├─ Root cause analysis: Rule issue? Data issue? Edge case?
└─ Recommend rule adjustments
```

**KPI Dashboard Review:**
```
Compare metrics to targets:
├─ Auto-decision rate (target 60-75%): Did we hit it?
├─ False positive rate (target <10%): Are we over escalating?
├─ False negative rate (target <2%): Missed high-risk?
├─ SLA compliance (target >95%): Timely decisions?
└─ Escalation reasons (trending): Any patterns?
```

---

### 3.4 Quarterly Controls (Policy Review)

**Control Testing (Comprehensive):**
```
Statistically significant sample (n=200-300):
├─ Re-evaluate eligibility criteria (still valid?)
├─ Backtest all 14+ rules (still accurate?)
├─ Validate thresholds (still appropriate?)
├─ Check for systematic bias (false positive patterns by segment)
└─ Document all findings in formal control report
```

**Regulatory Compliance Audit:**
```
Verify automation complies with all regulations:
├─ AML/CFT requirements (PEP, sanctions, beneficial ownership)
├─ KYC requirements (customer identification, verification)
├─ CDD requirements (enhanced due diligence for high-risk)
├─ Consumer protection (explanations available?)
└─ Document control items & any exceptions
```

**Policy Alignment Review:**
```
Verify automation still aligns with approved policy:
├─ No rules outside policy scope?
├─ No automation beyond approved request types?
├─ Fallback logic still working correctly?
├─ Audit trail still complete?
└─ Any policy violations or exceptions?
```

---

### 3.5 Annual Controls (Policy Refresh)

**Full System Review:**
```
Complete audit of automation system:
├─ Has business environment changed (new regulations, market changes)?
├─ Have metrics improved/degraded significantly?
├─ Do eligibility criteria still make sense?
├─ Any systematic issues discovered?
├─ Are controls sufficient?
└─ Should policy be updated?
```

**Policy Update Decision:**
```
Based on annual review:
├─ IF no material changes: Reaffirm policy (no changes needed)
├─ IF minor changes: Update rules/thresholds (CRO + CCO approval)
├─ IF major changes: Full policy refresh (Board approval)
└─ Communicate changes to all stakeholders
```

---

## 4. REPORTING STRUCTURE

### 4.1 Monthly Reporting Package

**To:** CRO, Head of Retail, VP Analytics, Compliance  
**Format:** Dashboard + summary

**Contents:**
```
1. AUTO-DECISION VOLUME (# of cases)
   ├─ Total received: 2,847
   ├─ Auto-decided (Stage C): 1,742  (61%)
   ├─ Escalated (Stage B+): 1,105     (39%)
   └─ By request type breakdown

2. QUALITY METRICS
   ├─ Approval rate: 78%
   ├─ Rejection rate: 12%
   ├─ Escalation rate: 10%
   ├─ False positive rate: 8.2% (Target <10%)
   └─ False negative rate: 1.5% (Target <2%)

3. OPERATIONAL METRICS
   ├─ Avg decision time (Stage C): 18 min
   ├─ Avg decision time (Stage B+): 2.3 days
   ├─ SLA compliance: 97.2%
   └─ Customer satisfaction: 92%

4. EXCEPTION SUMMARY
   ├─ PEP escalations: 12 (all escalated correctly)
   ├─ Sanctions hits: 0 (would escalate immediately)
   ├─ System errors: 1 (logged, resolved)
   ├─ Policy breaches: 0
   └─ Customer complaints: 2 (related to doc requests, resolved)

5. RISK METRICS
   ├─ Est. false positives (unnecessary escalations): 8.2%
   ├─ Est. false negatives (approvals later failed): 1.5%
   ├─ Automation coverage (eligible cases): 70%
   └─ Critical alerts: 0

6. RECOMMENDATIONS / ACTION ITEMS
   ├─ Any rule adjustments needed?
   ├─ Any threshold changes needed?
   ├─ Any staffing changes needed?
   └─ Any policy exceptions/approvals?
```

---

### 4.2 Quarterly Reporting Package

**To:** CRO, Board Audit Committee  
**Format:** Formal control report + presentation

**Contents:**
```
1. POLICY COMPLIANCE REPORT
   ├─ All rules operated within policy bounds? YES
   ├─ All decisions logged & auditable? YES
   ├─ No automation beyond scope? YES
   ├─ Exception tracking complete? YES
   └─ Control Testing Results

2. FAIRNESS & BIAS AUDIT
   ├─ Gender: Approval % difference <10%? YES
   ├─ Nationality: Approval % difference <10%? YES
   ├─ Segment: Approval % difference <10%? YES
   └─ No systematic unfair treatment detected

3. REGULATORY POSITION
   ├─ AML/CFT requirements met? YES
   ├─ KYC requirements met? YES
   ├─ CDD requirements enforced? YES
   ├─ No regulatory concerns? YES
   └─ Automation aligned with regulations? YES

4. MATERIAL FINDINGS
   └─ Any control failures or breaches discovered?
      └─ [None reported in Q1]

5. RECOMMENDATIONS
   ├─ Changes to policy or rules?
   ├─ Changes to staff or resources?
   ├─ Changes to safeguards?
   ├─ Changes to monitoring?
   └─ [Specific recommendations]

6. EXECUTIVE SUMMARY
   └─ Overall Control Assessment: ADEQUATE
   └─ Next Steps: Continue normal operations + annual refresh planning
```

---

### 4.3 Annual Reporting Package

**To:** Board (Full Board)  
**Format:** Formal report + presentation

**Contents:**
```
1. EXECUTIVE SUMMARY
   └─ System successfully operating 12 months
   └─ Metrics performing well, controls effective
   └─ Automation delivered expected benefits
   └─ No material regulatory or operational issues

2. OPERATIONAL PERFORMANCE
   ├─ Auto-decision rate: 75% of scope (exceeding target)
   ├─ Processing time improvement: 75% reduction
   ├─ Cost savings: 45% reduction in review costs
   ├─ Customer satisfaction: 92% approval rating
   └─ Regulatory incidents: 0

3. CONTROL EFFECTIVENESS
   ├─ Policy compliance: 100%
   ├─ Audit trail completeness: 100%
   ├─ Regulatory compliance: 100%
   ├─ Fairness metrics: No bias detected
   └─ Exception handling: Working as designed

4. STRATEGIC IMPACT
   ├─ Business outcome: Successful
   ├─ Risk position: Strengthened (better controls)
   ├─ Regulatory standing: Improved (demonstrates governance)
   ├─ Competitive position: Enhanced (faster approvals)
   └─ Customer experience: Improved (speed + clarity)

5. POLICY CHANGES (If Any)
   └─ No material changes recommended
   └─ Continue policy as-is for next 12 months
   └─ Next review scheduled: March 2027

6. BOARD DECISION
   └─ Affirm Automated Decisioning Policy
   └─ Continue Stage C full automation operationally
   └─ Approve next 12-month cycle
```

---

## 5. ESCALATION HIERARCHY

### 5.1 Escalation Path for Issues

```
SYSTEM ERROR / DATA ISSUE
└─ IT Ops (1 hour response)
   └─ Can't resolve? → IT Manager
   └─ Can't resolve? → CRO

POLICY BREACH DETECTED
└─ Compliance Officer
   └─ Can't resolve? → CCO
   └─ Can't resolve? → CRO → Board

REGULATORY QUESTION / INQUIRY
└─ CCO (primary owner)
   └─ Complex issue? → CRO + CCO
   └─ Board decision needed? → Board Audit Committee

FALSE NEGATIVE INCIDENT (HIGH-RISK APPROVED, LATER FAILED)
└─ Model Owner (investigate root cause)
   └─ Systemic issue? → CRO + Analytics VP
   └─ Rule needs change? → CRO + CCO approval for change

CUSTOMER COMPLAINT
└─ Head of Retail (primary owner)
   └─ Complaint valid? → Escalate + remedy
   └─ Systemic issue? → CRO for process review

CONTROL TEST FINDING
└─ Audit team
   └─ Low risk: Document in quarterly report
   └─ Medium risk: Escalate to CRO + plan remediation
   └─ High risk: Immediate escalation to Board

PEP / SANCTIONS MATCH
└─ Compliance Officer (mandatory escalation)
   └─ Verification complete → CCO decision on CDD/escalation
   └─ Regulatory reporting needed? → Legal + CCO
```

---

## 6. EXCEPTION HANDLING

### 6.1 Policy Exceptions (Non-Standard Approvals)

**When:** Customer clearly policy-ineligible, but business case exists to approve anyway

**Example:** Request would normally be rejected, but customer has strategic value

**Process:**
```
1. Senior Analyst documents exception rationale
2. Escalates to CRO (requires CRO sign-off)
3. CRO evaluates business case vs policy
4. CRO approves exception OR denies
5. If approved: Documented as "POLICY EXCEPTION"
   └─ Full rationale logged
   └─ Reported to Board Audit Committee quarterly
   └─ Never hidden or misclassified
```

**Approval Authority:** CRO only (per policy framework)

**Constraints:**
- Never can bypass PEP/Sanctions checks
- Never can bypass fraud alerts
- Never can violate regulatory requirements
- Must be documented + reported
- Will be audit-reviewed quarterly
- Pattern monitoring (if too many exceptions = policy issue)

---

### 6.2 Escalation Overrides (Human Disagrees With System)

**When:** System recommends action X, but human thinks action Y is correct

**Allowed:**
```
IF Stage B and human reviews system recommendation:
├─ Human CAN approve recommendation (normal case)
├─ Human CAN override recommendation (disagreement)
│  ├─ If system recommends APPROVE, human can REJECT
│  ├─ If system recommends REQUEST, human can APPROVE
│  ├─ If system recommends ESCALATE, human can APPROVE (if not regulatory)
│  └─ Each override must be documented with reason
└─ Human cannot override regulatory escalations (PEP/Sanctions)
```

**Not Allowed:**
```
Human CANNOT override:
├─ PEP escalations (regulatory mandate)
├─ Sanctions escalations (regulatory mandate)
├─ Fraud escalations (security mandate)
└─ These are hardcoded, not system settings
```

**Override Tracking:**
```
Every human override logged:
├─ timestamp
├─ case ID
├─ system recommendation
├─ human decision
├─ reason/explanation
├─ reviewer ID/name
└─ reviewed in monthly control audit
```

---

## 7. SIGN-OFF & APPROVAL

This governance framework must be approved by:

```
┌─────────────────────────────────────────┐
│ REQUIRED APPROVALS                      │
├─────────────────────────────────────────┤
│                                         │
│ Chief Risk Officer (Policy Owner)      │
│ Signature: _______________              │
│ Date: _______________                  │
│                                         │
│ Chief Compliance Officer                │
│ Signature: _______________              │
│ Date: _______________                  │
│                                         │
│ Head of Retail Banking                  │
│ Signature: _______________              │
│ Date: _______________                  │
│                                         │
│ Chief Executive Officer                 │
│ Signature: _______________              │
│ Date: _______________                  │
│                                         │
│ Board of Directors                      │
│ (Audit Committee Approval)              │
│ Signature: _______________              │
│ Date: _______________                  │
│                                         │
└─────────────────────────────────────────┘
```

---

**END OF GOVERNANCE & CONTROL MODEL**

**Status:** Ready for Approval  
**Document Version:** 1.0  
**Effective Date:** March 12, 2026  
**Next Review:** June 12, 2026 (post-Stage B pilot)
