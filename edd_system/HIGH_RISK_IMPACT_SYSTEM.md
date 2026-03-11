# 🚨 High Risk Impact System
## Banking Risk Decision Support Platform

---

## 📋 Executive Summary

The **High Risk Impact System** transforms risk data into immediate, actionable decision guidance for investigators and compliance officers. It displays:
1. **Current Risk Exposure** (what is high now)
2. **Potential Consequences** (operational impact)
3. **Next Best Actions** (investigation pathway)
4. **Human Decision Statement** (final choice is yours)

---

## 🎯 Trigger Logic

```
IF customer.riskCategory = "HIGH" OR "AUTO_HIGH"
    THEN Display: Full High Risk Impact Panel
    AND Log: User viewed panel + timestamp + recommended actions shown

IF customer.riskCategory = "MEDIUM"
    THEN Display: Simplified Advisory Panel
    (lighter styling, fewer items)

IF customer.riskCategory = "LOW" OR "CLEARED"
    THEN Hide: High Risk Impact Panel
    (remove from view)
```

---

## 🔴 HIGH RISK IMPACT PANEL (EDD Case)

### Location
Top of EDD Case screen, above case details, below breadcrumbs.

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️  High Risk Impact – Current Exposure & Consequences    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 CURRENT RISK EXPOSURE                                    │
│  ├─ PEP Status: Yes (Politician / Public Official)           │
│  ├─ Country: High-Risk Jurisdiction (Syria, North Korea)    │
│  ├─ Occupation: High-Risk Category (Arms Dealer)            │
│  ├─ Activity: Structured Deposits (Red Flag)                │
│  ├─ Product: Political Multi-currency Account              │
│  └─ Data Confidence: 65% (Missing: Source of Wealth doc)    │
│                                                               │
│  💥 POTENTIAL CONSEQUENCES                                   │
│  ├─ Increased compliance review workload & delays           │
│  ├─ Higher probability of escalation to compliance dept     │
│  ├─ Possible account freeze until critical evidence verified│
│  ├─ Enhanced monitoring (monthly instead of quarterly)      │
│  └─ Elevated regulatory audit attention                     │
│                                                               │
│  🎯 NEXT BEST ACTIONS (Investigation Pathway)               │
│  ├─ □ Collect: Salary Certificate (DMS: missing)           │
│  ├─ □ Verify: Source of Wealth (Dec 2025 required)         │
│  ├─ □ Review: Passport Validity (Expires: Jan 2026)        │
│  ├─ □ Analyze: Last 6 txns for sanction evasion patterns   │
│  └─ □ Escalate: To Compliance if PEP confirmed             │
│                                                               │
│  👤 INVESTIGATOR AUTHORITY                                   │
│  "Automated guidance supports your investigation.            │
│   Final decision remains with the investigator."              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 CURRENT RISK EXPOSURE (Data Structure)

Map from existing case data:

| Display Field | Data Source | Status Logic |
|---|---|---|
| PEP Status | `case.pepStatus` | Yes/No |
| Country Risk | `case.countryOfResidence.riskLevel` | High/Medium/Low |
| Occupation Risk | `case.occupation.riskLevel` | High/Medium/Low |
| Activity Risk | `case.transactions.flaggedActivities` | Yes/No |
| Product Risk | `case.accountProduct.riskLevel` | High/Medium/Low |
| Data Confidence | `case.documentationScore` | % (Verified/Missing) |

---

## 💥 POTENTIAL CONSEQUENCES (Operational Language)

**DO NOT** use legal threats or scary language. Use operational impact language.

### ❌ AVOID:
- "Your account may be reported to MLRO"
- "You could face legal consequences"
- "Sanctions violations will result in closure"

### ✅ USE:

**Group A: Review & Workload Impact**
- Increased compliance review workload and timeline
- Higher frequency of investigator touch points
- Delayed approval until evidence verification completed
- Quarterly → Monthly verification cycle required

**Group B: Escalation Risk**
- Higher probability of escalation to compliance committee
- Possible involvement of external audit team
- Required sign-off from Head of Compliance
- Risk committee visibility and discussion

**Group C: Account Operations Impact**
- Possible temporary restrictions (pending verification)
- Enhanced transaction monitoring (real-time instead of weekly)
- Additional documentation requirements before new activities
- Restricted product eligibility until risk is cleared

**Group D: Regulatory & SLA Impact**
- Elevated regulatory audit attention expected
- Extended SLA timelines (normal 14 days → 21 days)
- Required audit trail documentation

---

## 🎯 NEXT BEST ACTIONS (Investigation Pathway)

Auto-generate based on missing evidence + risk drivers:

```javascript
const actionMatrix = {
  // Evidence gaps
  "missingSourceOfWealth": {
    action: "Collect: Source of Wealth documentation",
    dmsStatus: "Missing or older than 12 months",
    priority: "CRITICAL"
  },
  "missingIncomeProof": {
    action: "Collect: Salary Certificate or Tax Return",
    dmsStatus: "Missing",
    priority: "CRITICAL"
  },
  "expiredPassport": {
    action: "Verify: Valid Passport (current expires X date)",
    dmsStatus: "Expires within 6 months",
    priority: "HIGH"
  },
  
  // Risk-specific actions
  "pepDetected": {
    action: "Escalate: Confirm PEP status with external data provider",
    dmsStatus: "PEP flag requires validation",
    priority: "CRITICAL"
  },
  "highRiskCountry": {
    action: "Document: Connection/justification for high-risk country",
    dmsStatus: "Risk reason needed",
    priority: "CRITICAL"
  },
  "structuredTransactions": {
    action: "Analyze: Last 6 transactions for sanction evasion patterns",
    dmsStatus: "Transaction review required",
    priority: "HIGH"
  },
  
  // Escalation paths
  "escalateToCompliance": {
    action: "Escalate: To Compliance if PEP or OFAC match confirmed",
    dmsStatus: "Required by policy",
    priority: "CRITICAL"
  }
};
```

---

## 📱 DASHBOARD WIDGET (Management View)

### Title
"High Risk Exposure Summary"

### Metrics Displayed
1. **Total High-Risk Cases** (Open)
   - Number of active cases with HIGH or AUTO_HIGH classification
   
2. **Cases with Missing Evidence**
   - Count of cases where Data Confidence < 75%
   
3. **Top Risk Drivers** (Top 3)
   - Breakdown: PEP detected | High-risk country | Missing SOF docs
   
4. **SLA Risk**
   - Cases approaching SLA breach (>15 days open)
   
### Drill-Down Action
Clicking opens **Filtered List View** of all high-risk cases with:
- Customer name
- Risk category
- Days open
- Missing evidence indicator
- Quick action buttons

---

## 📄 BRD REQUIREMENTS

Add new section to BRD:

### 3.8 High Risk Impact Visualization

**Requirement ID:** HRI-001 to HRI-010

#### 3.8.1 Trigger Logic
- Display panel when `riskCategory = HIGH` or `AUTO_HIGH`
- Simplified panel when `riskCategory = MEDIUM`
- Hide when `riskCategory = LOW` or `CLEARED`

#### 3.8.2 Data Fields Required
- PEP Status (Yes/No)
- Country Risk Level (High/Medium/Low)
- Occupation Risk (High/Medium/Low)
- Activity Flags (Structured, Layering, etc.)
- Product Risk (High/Medium/Low)
- Documentation Score (%)
- Missing Document List (auto-calculated)

#### 3.8.3 Consequence Categories
- Review & Workload Impact
- Escalation Risk
- Account Operations Impact
- Regulatory & SLA Impact

#### 3.8.4 Next Best Actions
- Auto-generated from: Missing evidence + Risk drivers
- Sortable by Priority (CRITICAL > HIGH > MEDIUM)
- Checkbox for investigator tracking
- Action Status log

#### 3.8.5 Audit Logging Requirement
```
AUDIT_EVENT: HIGH_RISK_PANEL_VIEWED
  - timestamp: ISO 8601
  - user_id: investigator ID
  - case_id: EDD case ID
  - recommended_actions: [list of action IDs shown]
  - actions_taken: [checked items by investigator]
```

#### 3.8.6 Human Decision Control
Must display always:
> "Automated guidance supports your investigation. 
>  Final decision remains with the investigator."

---

## 🎬 PRESENTATION SLIDE

### Slide: "Why High Risk Visibility Matters"

**Title:** Why High Risk Visibility Matters – Reducing Uncertainty, Enabling Faster Decisions

**Content:**

```
Left Column (Process Flow):
┌─────────────────┐
│ Risk Data       │ (External system classification)
│ (HIGH or AUTO)  │ 
└────────┬────────┘
         ↓
┌─────────────────┐
│ Current         │ (What risk drivers are active?)
│ Risk Exposure   │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Operational     │ (How does this impact us?)
│ Consequences    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Investigation   │ (What to do next?)
│ Actions         │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Investigator    │ (Decision driven by evidence)
│ Decision        │
└─────────────────┘

Right Column (Benefits):
✓ Question answered in 30 seconds (not 30 minutes)
✓ Actionable guidance (no guessing what to do)
✓ Operational impact is clear (business language)
✓ Investigation pathway is guided (reduce rework)
✓ Audit trail is automatic (compliance ready)
✓ Human decision preserved (investigator leads)
```

**Key Message:**
"We give investigators the CONTEXT and OPTIONS. They make the DECISION. That's compliant, that's professional, that's how real investigations work."

---

## 💻 TECHNICAL IMPLEMENTATION

### Files to Modify/Create

1. **css/high_risk_impact.css** (New)
   - Panel styling
   - Consequence item styling
   - Action list styling
   - Dashboard widget styling

2. **edd_case.html** (Modify)
   - Add High Risk Impact Panel HTML
   - Add trigger script

3. **js/high_risk_impact.js** (New)
   - detectRiskLevel() function
   - generateConsequences() function
   - generateActions() function
   - logAuditEvent() function

4. **dashboard.html** (Modify)
   - Add Risk Summary widget
   - Add drill-down functionality

5. **BRD document** (Update)
   - Add section 3.8 High Risk Impact Visualization

6. **EXECUTIVE_BRIEFING.md** (Or presentation update)
   - Add slide about High Risk Impact

7. **demo_data.js** (Update)
   - Add at least one case with HIGH risk status
   - Include missing evidence data

---

## 🎨 UI DESIGN RULES

**Colors:**
- High Risk Badge: Red (#FF5252) with white text
- Consequence Section: Neutral gray (#4A5568) with warning icon
- Actions Section: Blue/Teal (#00D4FF) for interactive elements
- Success Checkboxes: Green (#00E676) when checked

**Typography:**
- Panel Title: 18px Bold (Red #FF5252)
- Section Headers: 14px Medium (White)
- Content: 13px Regular (Text-secondary)
- Action Items: 12px Regular with checkbox

**Spacing:**
- Panel padding: 24px
- Section margin: 16px
- Item gap: 12px

**No clutter. High readability. Enterprise calm.**

---

## 📊 Demo Case Data

```json
{
  "caseId": "EDD-2026-001",
  "customerName": "Karim Al-Rashid",
  "riskCategory": "HIGH",
  "riskSource": "External Risk Classifier (QIB Risk Engine)",
  
  "riskExposure": {
    "pepStatus": "Yes - Politician Status",
    "countryRisk": "High (Syria, listed high-risk jurisdiction)",
    "occupationRisk": "High (Arms & Defense Sector)",
    "activityRisk": "Structured Deposits detected",
    "productRisk": "Political Multi-currency Account",
    "dataConfidence": 65
  },
  
  "consequences": [
    "Increased compliance review workload and delays",
    "Higher probability of escalation to compliance committee",
    "Possible account freeze until critical evidence verified",
    "Enhanced transaction monitoring (monthly instead of quarterly)",
    "Elevated regulatory audit attention"
  ],
  
  "recommendedActions": [
    {
      "id": "ACT001",
      "action": "Collect: Source of Wealth documentation",
      "status": "Missing",
      "priority": "CRITICAL"
    },
    {
      "id": "ACT002",
      "action": "Verify: Valid passport (expires Jan 2026)",
      "status": "Expiring soon",
      "priority": "HIGH"
    },
    {
      "id": "ACT003",
      "action": "Analyze: Last 6 transactions for sanction evasion",
      "status": "Pending",
      "priority": "HIGH"
    },
    {
      "id": "ACT004",
      "action": "Escalate: Confirm PEP status with external provider",
      "status": "Required",
      "priority": "CRITICAL"
    }
  ]
}
```

---

## 🚀 Implementation Checklist

- [ ] Create `css/high_risk_impact.css`
- [ ] Create `js/high_risk_impact.js`
- [ ] Modify `edd_case.html` to include panel
- [ ] Modify `dashboard.html` to add widget
- [ ] Update `BRD_*.md` with section 3.8
- [ ] Update `EXECUTIVE_BRIEFING.md` with slide
- [ ] Update `demo_data.js` with HIGH RISK case
- [ ] Test trigger logic (HIGH / MEDIUM / LOW)
- [ ] Test audit logging
- [ ] Test responsive layout (mobile / tablet / desktop)
- [ ] Get compliance review
- [ ] Deploy to QA environment

---

## 📞 Support & Questions

**Question:** Will this make decisions for investigators?
**Answer:** No. It provides context, options, and guidance. The investigator makes the final decision and owns it.

**Question:** What if the risk classification is wrong?
**Answer:** The investigator can override. The panel is guidance, not command. All decisions are logged.

**Question:** How do we explain this to regulators?
**Answer:** "We provide decision support. Investigations are human-driven. Technology assists, humans decide."

