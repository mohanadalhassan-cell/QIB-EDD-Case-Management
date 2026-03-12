# Decision Analytics Layer — EDD Policy Refinement Guide

**Version:** 1.0  
**Date:** March 2026  
**Purpose:** Help management identify and adjust over-aggressive EDD rules using evidence-based analytics  
**Status:** Production ready

---

## Executive Summary

The Decision Analytics Engine transforms case outcomes and escalation triggers into actionable rule refinements. Instead of assumptions, management now has evidence showing:

- Which rules escalate too many cases
- Which escalations are justified vs false positives
- Which occupations are over-regulated
- Whether to adjust weights, move to manual review, or request documents instead
- Expected impact of each recommended change

---

## 1. CASE-LEVEL ANALYTICS DATA MODEL

Every case analyzed includes:

```javascript
{
  caseId: "EDD-2026-001234",
  
  // OUTCOME DATA
  initialDecision: "escalate",      // approve | clarify | escalate | reject
  finalDecision: "approve",          // approve | clarify | reject
  escalated: true,                   // Auto-escalation occurred
  acceptedAfterClarification: true,  // Approved after manual review
  
  // PROFILE DATA
  customerSegment: "mass",           // mass | premium | tamayuz | private
  riskProfile: "high",               // low | medium | high | critical
  
  // TRIGGER DATA (WHY ESCALATION?)
  escalationReasons: ["occupation-risk", "segment-risk"],
  triggeredRules: [
    { 
      name: "High-Risk Occupation", 
      category: "occupation",
      confidence: 0.75
    }
  ],
  
  // OCCUPATION / PEP / WEALTH DATA
  occupationProfile: {
    occupationCode: "DOC",
    occupationName: "Doctor",
    triggered: true
  },
  pepProfile: {
    triggered: false,
    matched: false
  },
  wealthProfile: {
    sourceUnknown: false,
    triggered: false
  },
  
  // MANUAL REVIEW DATA
  requiresManualReview: true,
  manualReviewOutcome: "approve",    // approve | reject | approve_with_conditions
  docsRequested: ["employment-verification", "source-of-funds"],
  docsReceived: ["employment-verification"],
  
  // TIMELINE DATA
  createdDate: "2026-03-01",
  daysToResolution: 5
}
```

---

## 2. KEY PERFORMANCE INDICATORS (KPIs)

### 2.1 Approval & Rejection KPIs

| KPI | Formula | Interpretation | Target |
|-----|---------|-----------------|--------|
| **Approval Rate** | Approved / Total × 100 | % of cases approved | 70-85% |
| **Rejection Rate** | Rejected / Total × 100 | % of cases rejected | 5-15% |
| **Clarification Rate** | Requires-Clarify / Total × 100 | % needing additional info | 15-30% |
| **Initial Approval Rate** | Initial-Approve / Total × 100 | % approved without escalation | 50-65% |

### 2.2 Escalation KPIs

| KPI | Formula | Interpretation | Target |
|-----|---------|-----------------|--------|
| **Escalation Rate** | Escalated / Total × 100 | % of cases auto-escalated | 40-60% |
| **Manual Review Rate** | Needs-Review / Total × 100 | % requiring manual review | 35-45% |
| **Escalation → Approval Rate** | Escalated & Approved / Escalated × 100 | % of escalated cases that approve | 60-75% |

### 2.3 False Positive KPIs (MOST IMPORTANT)

| KPI | Formula | Interpretation | Action |
|-----|---------|-----------------|--------|
| **False Positive Rate** | (Escalated & Approved) / Total × 100 | Cases wrongly escalated | <15% is good<br>>25% = review needed |
| **Over-Escalation Rate** | (Manual-Review & Approved & No-Docs / Total × 100 | Cases escalated unnecessarily | <10% is good |
| **Rule False Positive Rate** | (Rule-Triggered & Finally-Approved) / Rule-Triggered × 100 | Per-rule accuracy | >70% is good<br><50% needs adjustment |

### 2.4 Rule Performance KPIs

| KPI | Formula | Interpretation | Usage |
|-----|---------|-----------------|-------|
| **Precision** | Correctly-Rejected / Escalated × 100 | Of escalated cases, how many were actually risky | >80% = keep rule |
| **Escalation Rate** | Cases-Escalated / Times-Triggered × 100 | How often rule triggers escalation | >60% = may be aggressive |
| **Confidence** | Average confidence of rule triggers | Avg probability assigned to rule | Use for weighting |

### 2.5 Occupation/Segment KPIs

| KPI | Formula | Interpretation | Threshold |
|-----|---------|-----------------|-----------|
| **Occupation Escalation Rate** | Escalated-in-Occupation / Total-in-Occupation × 100 | How aggressive rules are for occupation | >70% = review |
| **Occupation False Positive Rate** | (Escalated & Approved in Occupation) / Escalated × 100 | False escalations by occupation | >20% = too aggressive |
| **Segment Risk Ratio** | Approval-Rate-Premium / Approval-Rate-Mass | Do premium customers get better decisions | >1.15 may indicate bias |

---

## 3. FALSE POSITIVE IDENTIFICATION

### 3.1 Types of False Positives

**Type A: Over-Escalation**
- Case escalated to manual review
- Manual reviewer approved WITHOUT requesting additional documents
-=> Rule was too aggressive

**Type B: Document-Solvable**
- Case escalated
- Manual reviewer requested documents
- Documents received and provided satisfactory answer
- => Should have requested docs instead of escalating

**Type C: Premature Rejection**
- Case initially rejected
- Later cases with similar profiles approved with documents
- => Rule was too harsh

### 3.2 False Positive Detection Logic

```javascript
// HIGH-RISK: Over-escalation
case.escalated && 
case.finalDecision === 'approve' &&
case.docsRequested.length === 0
// => FALSE POSITIVE - Unnecessary escalation

// MEDIUM-RISK: Could be document request
case.escalated && 
case.finalDecision === 'approve' &&
case.docsReceived.length > 0
// => Could replace escalation with auto-doc-request

// LOW-RISK: Correct escalation
case.escalated && 
case.finalDecision === 'reject'
// => Escalation was justified
```

### 3.3 False Positive Scoring

```
FP Score = 0-100 (higher = more likely false positive)

+40: Case was escalated
+20: No additional documents needed
+30: Eventually approved
+10: Triggered by occupation rule
+10: Low risk profile but high escalation
+ 5: Non-premium segment

Score > 60 = High likelihood of false positive
```

---

## 4. RULE PERFORMANCE ANALYTICS

### 4.1 Rule Evaluation Framework

For each rule, calculate:

| Metric | Good | At Risk | Bad |
|--------|------|---------|-----|
| **Precision** | >80% | 60-80% | <60% |
| **Escalation Rate** | <40% | 40-70% | >70% |
| **False Positive Rate** | <15% | 15-25% | >25% |
| **Triggered Cases** | 20+ | 10-20 | <10 |

### 4.2 Rule Aggressiveness Matrix

```
              High Escalation    Low Escalation
High Precision    [KEEP]         [GOOD - Low Impact]
Low Precision     [REDUCE]       [MONITOR]
```

**Examples:**

- Rule triggers 80% escalation, 85% precision → KEEP (highly accurate, low false positives)
- Rule triggers 70% escalation, 55% precision → REDUCE (many false positives)
- Rule triggers 20% escalation, 90% precision → MONITOR (rare but accurate when it triggers)

---

## 5. OCCUPATION-BASED ESCALATION ANALYTICS

### 5.1 Occupation Risk Analysis

For each occupation, track:

```javascript
{
  occupationCode: "DOC",
  occupationName: "Doctor",
  
  // Distribution
  totalCases: 45,
  escalatedCases: 32,    // 71% escalation
  approvedCases: 38,     // 84% approval
  rejectedCases: 2,      // 4% rejection
  
  // Key Metrics
  escalationRate: 71.1,
  approvalRate: 84.4,
  falsePositiveRate: 21.9  // ALERT: >20%
}
```

### 5.2 Occupation Risk Tiers

```
HIGH RISK:           >75% escalation + >20% false positive → Review policy
MEDIUM RISK:         60-75% escalation OR 15-20% false positive → Monitor
LOW RISK:            <60% escalation + <15% false positive → Approve
WELL-REGULATED:      >80% approval rate + <10% false positive → Keep
```

### 5.3 Drill-Down: Why Are Doctors Over-Escalated?

```
Doctors (DOC) — 71% escalation rate

Triggered Rules:
  1. "High-Income Profession" — 45% of escalations
     └─ Precision: 62% (only 62% of high-income cases are risky)
  2. "Private Practice Owner" — 30% of escalations
     └─ Precision: 71% (better, but still many false positives)
  3. "Complex Tax Situation" — 25% of escalations
     └─ Precision: 58% (worst performing rule for doctors)

Recommendation:
  - Lower "High-Income Profession" weight by 30%
  - Replace "Complex Tax" with manual document request
  - Consider occupational subdivision (vs generic "high income")
```

---

## 6. DECISION RECOMMENDATION FRAMEWORK

### 6.1 Recommendation Types

#### **1. KEEP RULE** ✅
- When: Precision >80% AND escalation rate >10%
- Meaning: Rule is accurate and valuable
- Action: No change needed

#### **2. REDUCE WEIGHT** 🔽
- When: Escalation rate >60% AND false positive rate >25%
- Meaning: Rule is too sensitive
- Action: Lower confidence/weight from 1.0x to 0.7-0.8x
- Impact: ~20-30% fewer escalations, minimal accuracy loss

#### **3. MOVE TO MANUAL REVIEW** 📋
- When: Precision >70% AND escalation rate >40%
- Meaning: Rule is accurate but shouldn't auto-escalate
- Action: Change from "escalate" trigger to "manual review" flag
- Impact: Reduces customer friction while maintaining control

#### **4. REPLACE WITH DOCUMENT REQUEST** 📄
- When: False positive rate >30% AND many cases resolved by docs
- Meaning: Issue is resolvable with more information
- Action: Instead of escalation, trigger automated document request
- Impact: Faster approvals, lower escalation load, same risk coverage
- Example: Instead of escalating high-income customers, request tax documents

#### **5. SPLIT BROAD CATEGORIES** 🔀
- When: Occupation/segment rule has 70%+ escalation but 40%+ false positive rate
- Meaning: Rule is too generic
- Action: Break into sub-categories with different rules
- Example: "High-Income" → ["High-Income Healthcare", "High-Income Finance", "High-Income Tech"]
  - Each with separate thresholds based on actual risk

#### **6. MONITOR** 👁️
- When: <10 triggered cases or new rule
- Meaning: Insufficient data to recommend
- Action: Continue collecting data, revisit in 30 days

### 6.2 Recommendation Impact Assessment

Each recommendation includes:

```javascript
{
  ruleName: "Occupation Risk - Doctors",
  recommendation: "reduce-weight",
  impact: "medium",  // low | medium | high
  
  // Current state
  currentEscalationRate: 71.1,
  currentFalsePositiveRate: 21.9,
  
  // Expected after change
  expectedEscalationRate: 52.0,  // Down by ~27%
  expectedFalsePositiveRate: 12.0,  // Down by ~45%
  
  // Side effects
  expectedDocRequestIncrease: "Yes, ~15-20% more",
  expectedManualReviewIncrease: "Minimal",
  
  // Rationale
  rationale: "Rule escalates doctors 71% of the time but only 78% are risky. Reducing weight should catch actual high-risk doctors while reducing false positives."
}
```

---

## 7. MANAGEMENT DASHBOARD STRUCTURE

### 7.1 Dashboard Sections

**SECTION 1: Key Metrics (At-a-Glance)**
```
Row 1: Approval Rate  |  Escalation Rate  |  Rejection Rate  |  False Positive Rate
Row 2: Manual Review  |  Clarification %  |  Avg Resolution  |  PEP Match Rate
```

**SECTION 2: Alert Flags**
- 🔴 **High False Positive Rate** (>20%) — Indicates over-escalation
- 🟠 **High Escalation Rate** (>70%) — May indicate automation gone too far
- 🟠 **Aggressive Rules Detected** — X rules show high escalation + low precision

**SECTION 3: Rule Performance Ranking**
- Table of top 15 rules by escalation frequency
- Shows: Triggered Count | Escalation % | Precision % | Recommendation

**SECTION 4: Occupation Deep Dive**
- Top 10 occupations by escalation rate
- Color-coded: 🟢 Green (well-regulated) | 🟡 Yellow (monitor) | 🔴 Red (review)
- Click to drill-down to specific occupations

**SECTION 5: Recommendations by Impact**
- **HIGH IMPACT**: Must address (e.g., reduce weight on occupation rules)
- **MEDIUM IMPACT**: Should address (e.g., move to manual review)
- **LOW IMPACT**: Can monitor (e.g., watch new rules)

**SECTION 6: Segment Comparison**
- KPI comparison: Premium vs Tamayuz vs Mass
- Identify if any segment is treated unfairly

### 7.2 Dashboard Entry Points

**URL:** `http://localhost:8585/edd_system/decision-analytics-dashboard.html`

**Features:**
- Real-time analytics from case database
- Filter by date range, segment, rule
- Export → CSV, JSON, PDF
- Drill-down from metrics to individual cases

---

## 8. DRILL-DOWN LOGIC

### 8.1 From KPI to Evidence

```
User clicks on "71% Escalation Rate for Doctors"
  ↓
Dashboard shows: Top rules affecting doctors
  ├─ "High-Income Profession" (45% of doctor escalations)
  ├─ "Private Practice" (30%)
  └─ "Complex Tax" (25%)
  ↓
User clicks on "High-Income Profession"
  ↓
Shows: 23 doctor cases triggered by this rule
  ├─ 14 escalated (61%)
  ├─ 12 eventually approved (52% false positive)
  └─ 2 rejected (justified escalation)
  ↓
User clicks on one "Over-Escalated" doctor case
  ↓
Shows: Case evidence
  ├─ Profile: Cardiologist, Private practice, $250K/yr income
  ├─ Triggered: "High-Income Profession" rule (confidence: 0.75)
  ├─ Initial decision: ESCALATE
  ├─ Manual review: APPROVED (no docs requested)
  └─ Recommendation: This rule is too aggressive for doctors
```

### 8.2 Drill-Down Implementation

```javascript
// Get cases for a metric
const overEscalatedCases = drillDown.getCasesForMetric(
  cases, 
  'false-positive'  // Show all over-escalated cases
);

// Get cases by occupation
const doctorCases = drillDown.getCasesForMetric(
  cases,
  'occupation',
  'DOC'
);

// Get individual case evidence
const caseEvidence = drillDown.getCaseEvidence(caseRecord);
// Returns: {caseId, profile, triggers, decision, documents, timeline}
```

---

## 9. SAMPLE ANALYTICS OUTPUT

### 9.1 Sample KPI Report

```
═══════════════════════════════════════════
DECISION ANALYTICS REPORT — MARCH 2026
═══════════════════════════════════════════

OVERALL METRICS:
  Total Cases Analyzed: 2,847
  Date Range: Jan 1 - Mar 31, 2026
  
  Approval Rate: 78.2%
  Escalation Rate: 52.1%
  Rejection Rate: 9.3%
  Clarification Rate: 12.5%
  
  FALSE POSITIVE RATE: 18.7% ⚠️ (ABOVE TARGET OF <15%)
  Manual Review Rate: 48.3%
  
  Average Resolution: 4.2 days

KEY FINDINGS:
  ✓ Approval rate is healthy (78%)
  ✗ False positive rate too high (18.7%)
  ✗ Escalation rate at upper limit (52%)
  ⚠ Should review occupation-based rules
```

### 9.2 Sample Rule Analysis

```
TOP ESCALATING RULES:

1. "High-Risk Occupation"
   ├─ Triggered: 1,247 cases
   ├─ Escalation Rate: 68.3%
   ├─ Precision: 65.2%
   ├─ False Positive Rate: 26.4% ⚠️
   └─ RECOMMENDATION: REDUCE WEIGHT
      └─ Rationale: Too many false positives

2. "PEP Match - International"
   ├─ Triggered: 634 cases
   ├─ Escalation Rate: 78.5%
   ├─ Precision: 82.1% ✓
   ├─ False Positive Rate: 12.3%
   └─ RECOMMENDATION: KEEP
      └─ Rationale: High precision, justified

3. "Private Banking Segment"
   ├─ Triggered: 892 cases
   ├─ Escalation Rate: 45.2%
   ├─ Precision: 71.3%
   ├─ False Positive Rate: 19.7%
   └─ RECOMMENDATION: MOVE TO MANUAL REVIEW
      └─ Rationale: Accurate but reduce auto-escalation
```

### 9.3 Sample Occupation Analysis

```
OCCUPATION ESCALATION RATES:

Doctor               71.1%  🔴 (High - 21.9% FP)
Lawyer               53.4%  🟡 (Medium)
Finance Director     68.7%  🔴 (High - 24.1% FP)
Accountant           42.1%  🟢 (Good - 8.3% FP)
Real Estate Agent    65.3%  🔴 (High - 19.2% FP)
Architect            38.5%  🟢 (Good - 6.1% FP)
Business Executive   61.2%  🟡 (Medium)

ACTIONS RECOMMENDED:
  🔴 Doctors: Reduce "High-Income" rule weight
  🔴 Finance Directors: Review "Professional Credentials" rule
  🔴 Real Estate: Check for geographic bias in rules
```

---

## 10. IMPLEMENTATION GUIDE

### 10.1 Running Analysis

```javascript
// Load the analytics engine
// <script src="js/decision-analytics-engine.js"></script>

// Prepare case data from your database
const allCases = fetchCasesFromDatabase(startDate, endDate);

// Convert to analytics format
const analyticsCases = allCases.map(c => 
  DecisionAnalyticsEngine.caseModel.createRecord(c)
);

// Run full analysis
const dashboard = DecisionAnalyticsEngine.analyze(analyticsCases);

// Access specific analytics
const approvalRate = dashboard.keyMetrics.approvalRate;  // 78.2%
const falsePositives = dashboard.falsePositives;  // [Case objects]
const recommendations = dashboard.ruleRecommendations;  // [Recommendations]
```

### 10.2 Dashboard Integration

The Decision Analytics Dashboard is standalone and can be:

1. **Accessed directly**: `http://localhost:8585/edd_system/decision-analytics-dashboard.html`
2. **Embedded in admin panel**: As an iframe or separate tab
3. **Scheduled reports**: Executive email digest using `exportAnalyticsReport()`

### 10.3 Updating Rules Based on Recommendations

**Process:**

1. **Review** recommendation from analytics
2. **Approve** change with business stakeholder
3. **Implement** in rule engine
4. **Test** with historical data
5. **Deploy** to production
6. **Monitor** impact in next analytics cycle

**Example Implementation:**

```javascript
// Before (Original occupation rule)
if (occupation === 'High-Income Professions') {
  escalationScore += 40;  // weight: 1.0x
}

// After (Reduced weight recommendation)
if (occupation === 'High-Income Professions') {
  escalationScore += 28;  // weight: 0.7x (40 * 0.7)
}
```

---

## 11. EXPECTED OUTCOMES

### 11.1 After First Month of Adjustments

If false positive rate (18.7%) is reduced to target (<15%):

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Escalation Rate | 52.1% | ~48% | -280 cases escalated |
| False Positive Rate | 18.7% | <15% | -112 unnecessary escalations |
| Manual Review Load | 48.3% | ~45% | -86 manual reviews needed |
| Customer Approval SLA | 4.2d | 3.8d | Faster approvals |

### 11.2 Long-term Benefits

- **Better customer experience**: Fewer unnecessary rejections
- **Lower operational cost**: Fewer manual reviews needed
- **Regulatory confidence**: Evidence-based, not assumption-based
- **Continuous improvement**: Monthly analytics cycle
- **Fair treatment**: Data shows if any segment is over-regulated

---

## 12. ACCESSING THE ANALYTICS ENGINE

### Files Created:

1. **Engine**: `edd_system/js/decision-analytics-engine.js` (1,100+ lines)
   - Core analytics logic
   - All KPI calculations
   - Recommendation engine
   - Drill-down support

2. **Dashboard**: `edd_system/decision-analytics-dashboard.html`
   - Interactive management UI
   - Real-time KPI display
   - Rule performance table
   - Occupation analysis
   - Drill-down to case evidence

### API Methods:

```javascript
// Analyze cases
DecisionAnalyticsEngine.analyze(caseArray)
  → Returns full dashboard data

// Specific analytics
DecisionAnalyticsEngine.kpiEngine.calculateApprovalRate(cases)
DecisionAnalyticsEngine.falsePositiveDetector.identifyFalsePositives(cases)
DecisionAnalyticsEngine.rulePerformanceAnalyzer.identifyAggressiveRules(ruleStats)
DecisionAnalyticsEngine.recommendationEngine.generateRuleRecommendations(ruleStats, cases)

// Drill-down
DecisionAnalyticsEngine.drillDown.getCasesForMetric(cases, 'escalated')
DecisionAnalyticsEngine.drillDown.getCaseEvidence(caseRecord)
```

---

## Summary

The Decision Analytics Engine provides **evidence-based policy refinement**:

✅ **Objective Data**: Not opinions—real metrics from case outcomes  
✅ **Actionable Insights**: Specific rules to adjust, not vague recommendations  
✅ **Impact Assessment**: Know expected outcome before making changes  
✅ **Drill-Down Evidence**: See exactly which cases triggered false positives  
✅ **Continuous Improvement**: Monthly analytics cycle for ongoing refinement  

**Goal Achieved**: Help management decide objectively whether EDD logic is too aggressive using data, not assumptions.
