# 3.8 HIGH RISK IMPACT VISUALIZATION SYSTEM

## 3.8.1 Overview & Objective

The **High Risk Impact Visualization System** transforms risk classification data into immediate, actionable decision guidance for investigators and compliance officers. The system:

- **Detects** HIGH or MEDIUM risk classifications automatically
- **Displays** current risk exposure factors with clarity
- **Explains** operational consequences (not legal threats)
- **Recommends** next-best investigation actions
- **Preserves** investigator authority (final decision by human)
- **Logs** all audit events for compliance

### Key Principle
> **Technology assists investigations. Humans make decisions.**

---

## 3.8.2 Trigger Logic (Functional Requirement FR-HRI-001)

### Condition 1: HIGH RISK Display
```
IF customer.riskCategory = "HIGH" OR "AUTO_HIGH"
THEN Display: Complete High Risk Impact Panel
AND Log: Panel view event + recommended actions
```

### Condition 2: MEDIUM RISK Display
```
IF customer.riskCategory = "MEDIUM"
THEN Display: Simplified Advisory Panel
AND Log: Panel view event (lighter styling)
```

### Condition 3: LOW RISK Display
```
IF customer.riskCategory = "LOW" OR "GREEN" OR "CLEARED"
THEN Hide: High Risk Impact Panel completely
AND No logging required
```

**Requirement ID:** HRI-FR-001 | **Priority:** CRITICAL | **Status:** Planned

---

## 3.8.3 Panel Components (Structural Requirements)

### Component 1: Current Risk Exposure (FR-HRI-002)

Display 6–8 risk driver items from existing EDD case data:

| Field Name | Data Source | Display Format | Logic |
|---|---|---|---|
| PEP Status | `case.pepStatus` | Yes/No + Type | If true, show type (e.g., "Politician") |
| Country Risk | `case.countryRisk.level` + `.name` | Level + Country | High/Medium/Low classification |
| Occupation Risk | `case.occupationRisk.level` + `.category` | Level + Occupation | Auto-mapped from profession |
| Activity Flags | `case.activityFlags[]` | Comma-separated list | If any exist, flag with "Red" |
| Product Risk | `case.productRisk.level` + `.name` | Level + Product type | High-risk products highlighted |
| Data Confidence | `case.documentationScore` | % score + status | >75% = "Verified", <75% = "Missing evidence" |
| Country Exposure | `case.countryOfResidence` | Standard/High-Risk | If high-risk, show reason |
| Occupation Sector | `case.occupationSector` | Text + risk level | High-risk sectors flagged |

**Requirement ID:** HRI-FR-002 | **Priority:** CRITICAL | **Status:** Planned

---

### Component 2: Potential Consequences (FR-HRI-003)

Display 5–7 consequence items in **operational business language** (NOT legal threats).

**Consequence Categories:**

#### A. Review & Workload Impact
- Increased compliance review workload and timeline
- Higher frequency of investigator touch points
- Delayed approval until evidence verification completed
- Quarterly verification cycle → Monthly cycle required

#### B. Escalation Risk
- Higher probability of escalation to compliance committee
- Possible involvement of external audit teams
- Required sign-off from Head of Compliance
- Risk committee visibility and discussion

#### C. Account Operations Impact
- Possible temporary restrictions pending verification
- Enhanced transaction monitoring (real-time instead of weekly)
- Additional documentation requirements before new activities
- Restricted product eligibility until risk cleared

#### D. Regulatory & SLA Impact
- Elevated regulatory audit attention
- Extended SLA timelines (normal 14 days → 21 days)
- Required audit trail documentation

**Requirement:** Use operational language. No legal threats. Professional tone only.

**Requirement ID:** HRI-FR-003 | **Priority:** CRITICAL | **Status:** Planned

---

### Component 3: Next Best Actions (FR-HRI-004)

Auto-generate 4–7 investigation actions based on:
1. **Missing evidence** (DMS checks)
2. **Risk driver triggers** (PEP, country, occupation)
3. **Activity patterns** (transaction flags)
4. **Policy requirements** (mandatory escalations)

#### Action Generation Matrix

```
IF missing SourceOfWealth
  → Action: "Collect: Source of Wealth doc (DMS: missing)"
  → Priority: CRITICAL

IF missing SalaryDocument OR older than 12 months
  → Action: "Collect: Salary certificate or tax return"
  → Priority: CRITICAL

IF passportExpiry < 6 months
  → Action: "Verify: Passport validity (expires DATE)"
  → Priority: HIGH

IF pepStatus = true
  → Action: "Escalate: Confirm PEP with external provider"
  → Priority: CRITICAL

IF countryRisk = HIGH
  → Action: "Document: Justification for high-risk jurisdiction"
  → Priority: CRITICAL

IF activityFlags includes "Structured Deposits"
  → Action: "Analyze: Last 6 txns for sanction evasion patterns"
  → Priority: HIGH

IF riskCategory = HIGH
  → Action: "Escalate: To Compliance if evidence confirms high risk"
  → Priority: CRITICAL
```

**Each Action Must Include:**
- Unique ID (ACT001–ACT099)
- Clear action description
- Current status (Missing/Expiring/Required)
- Priority level (CRITICAL / HIGH / MEDIUM)
- Checkbox for investigator tracking

**Requirement ID:** HRI-FR-004 | **Priority:** CRITICAL | **Status:** Planned

---

### Component 4: Investigator Authority Statement (FR-HRI-005)

**Display Always:**

> "Automated guidance supports your investigation. **Final decision remains with the investigator.** All decisions and actions taken are logged for audit."

**Visual Treatment:** Blue/Teal information box with "👤 Investigator Authority" header

**Requirement ID:** HRI-FR-005 | **Priority:** CRITICAL | **Status:** Planned

---

## 3.8.4 Audit & Logging Requirements (FR-HRI-006)

### Audit Event 1: Panel Viewed
```json
{
  "eventType": "HIGH_RISK_PANEL_VIEWED",
  "timestamp": "ISO 8601",
  "userId": "investigator_id",
  "caseId": "EDD-XXXX-XXX",
  "riskCategory": "HIGH|MEDIUM|LOW",
  "recommendedActionsCount": 7,
  "recommendedActions": ["ACT001", "ACT002", ...],
  "details": "User viewed High Risk Impact panel"
}
```

### Audit Event 2: Action Completed
```json
{
  "eventType": "ACTION_COMPLETED",
  "timestamp": "ISO 8601",
  "userId": "investigator_id",
  "caseId": "EDD-XXXX-XXX",
  "actionId": "ACT004",
  "actionText": "Verify: Passport validity (expires DATE)",
  "completed": true,
  "details": "Investigator marked action as completed"
}
```

### Audit Event 3: Case Risk Decision
```json
{
  "eventType": "RISK_DECISION_MADE",
  "timestamp": "ISO 8601",
  "userId": "investigator_id",
  "caseId": "EDD-XXXX-XXX",
  "decision": "ESCALATE|PROCEED|REJECT",
  "riskReason": "Text explanation",
  "details": "Investigator made final risk decision"
}
```

**Requirement:** All events must be logged to audit service synchronously. No data loss allowed.

**Requirement ID:** HRI-FR-006 | **Priority:** CRITICAL | **Status:** Planned

---

## 3.8.5 Dashboard Widget Requirements (FR-HRI-007)

### Widget Title
"High Risk Exposure Summary"

### Metrics Displayed
1. **Total High-Risk Cases (Open)**
   - Count of cases with riskCategory = HIGH or AUTO_HIGH
   - Metric type: KPI number in red

2. **Cases with Missing Evidence**
   - Count of cases where documentationScore < 75%
   - Metric type: KPI number in orange

3. **Top Risk Drivers (Top 3)**
   - Pie/bar chart showing:
     - PEP Detected count
     - High-Risk Country count
     - Missing SOF (Source of Wealth) count

4. **SLA At Risk**
   - Count of cases where daysOpen > 15
   - Metric type: KPI number in red

### Drill-Down Functionality
Clicking any metric opens **Filtered List View** with:
- Customer name
- Risk category (HIGH / MEDIUM)
- Days open
- Missing evidence indicator (red dot)
- Quick action buttons (View Case / Send Escalation)

**Requirement ID:** HRI-FR-007 | **Priority:** HIGH | **Status:** Planned

---

## 3.8.6 Dashboard Screens Affected

| Screen | Widget Location | Change Type |
|---|---|---|
| Management Dashboard | Risk Summary Row | Add new widget |
| Executive Dashboard | KPI Section | Add metric tile |
| Business Dashboard | Compliance Section | Add mini widget |
| CDD Operations | Activity Section | Highlight high-risk queue |

**Requirement ID:** HRI-FR-008 | **Priority:** HIGH | **Status:** Planned

---

## 3.8.7 Data Privacy & Access Control (FR-HRI-009)

### Access Rules
- Investigators: **Full Access** (view + modify + audit)
- Compliance Officers: **Full Access** (view + recommend + audit)
- Managers: **View Only** (dashboard metrics only)
- System Admins: **Full Access + Audit Review**
- External Users: **No Access**

### Data Masking
- Customer PII: Masked in audit logs (show only Customer ID)
- Sensitive Risk Data: Not shared outside investigation team
- Audit Events: Retain for 7 years minimum

**Requirement ID:** HRI-FR-009 | **Priority:** HIGH | **Status:** Planned

---

## 3.8.8 UI/UX Standards (FR-HRI-010)

### Color Scheme
- HIGH RISK Badge: Red (#FF5252) with white text
- MEDIUM RISK Badge: Orange (#FFA726) with white text
- Consequence Icons: Warning symbol (⚠️) in neutral gray
- Action Items: Teal/Cyan (#00D4FF) interactive elements
- Completion Checkboxes: Green (#00E676) when checked

### Typography
- Panel Title: 16px Bold (Red for HIGH, Orange for MEDIUM)
- Section Headers: 13px Medium (White)
- Content Text: 13px Regular (Text secondary)
- Action Items: 12px Regular with metadata

### Spacing & Layout
- Panel padding: 24px
- Section margin: 24px
- Item gap: 12px
- Card padding: 14px
- Border radius: 8–16px (rounded corners)

### Responsive Design
- Desktop (1920px): Full panel with 3-column grid
- Tablet (768px): 2-column grid, adjusted spacing
- Mobile (375px): Single column, stacked layout
- All elements must remain touch-accessible (min 44px targets)

**Requirement:** "No clutter. High readability. Enterprise calm."

**Requirement ID:** HRI-FR-010 | **Priority:** HIGH | **Status:** Planned

---

## 3.8.9 Testing & Validation Requirements (FR-HRI-011)

### Unit Tests Required
- [ ] Risk level detection (HIGH / MEDIUM / LOW)
- [ ] Risk exposure data extraction
- [ ] Consequence generation logic
- [ ] Action generation & prioritization
- [ ] Audit event logging
- [ ] User permission checks

### Integration Tests Required
- [ ] End-to-end panel rendering
- [ ] Dashboard widget display
- [ ] Audit log creation & persistence
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### User Acceptance Tests Required
- [ ] Investigator workflow (view → assess → decide)
- [ ] Compliance officer review process
- [ ] Dashboard metric accuracy
- [ ] Responsive design on devices

### Compliance Tests Required
- [ ] Audit trail completeness
- [ ] PII masking in logs
- [ ] Access control enforcement
- [ ] Data retention policy

**Requirement ID:** HRI-FR-011 | **Priority:** HIGH | **Status:** Planned

---

## 3.8.10 Implementation Roadmap

| Phase | Component | Timeline | Owner |
|---|---|---|---|
| Phase 1 | CSS + HTML Panel | Week 1 | Frontend Team |
| Phase 2 | JavaScript Logic | Week 1 | Backend/Frontend |
| Phase 3 | Dashboard Integration | Week 2 | Frontend Team |
| Phase 4 | Audit Service | Week 2 | Backend Team |
| Phase 5 | Testing & QA | Week 3 | QA Team |
| Phase 6 | UAT & Training | Week 4 | Compliance |
| Phase 7 | Production Deployment | Week 5 | DevOps |

---

## 3.8.11 Success Criteria

- ✅ Panel displays for 100% of HIGH risk cases
- ✅ Investigation time reduced (target: 30% faster decisions)
- ✅ Investigator satisfaction score > 4/5
- ✅ Audit events logged with 0% data loss
- ✅ No false positives (LOW risk not flagged)
- ✅ Mobile responsive on all devices
- ✅ Accessibility compliance (WCAG 2.1 AA)

---

## 3.8.12 Compliance Notes

**Regulatory Alignment:**
- ✅ AMLCFT Regulation: Decision-maker identified (investigator)
- ✅ Data Protection: PII masking in audit logs
- ✅ Audit Requirements: Complete event trail
- ✅ Decision Documentation: Logged and traceable

**Policy Alignment:**
- ✅ Risk Management Policy: Risk visibility requirement
- ✅ Investigation Policy: Investigator-led decisions
- ✅ Audit Policy: Event logging requirement
- ✅ Data Security Policy: Access control enforcement

---

**Document Status:** DRAFT
**Version:** 1.0
**Date:** 11 March 2026
**Owner:** Product & Compliance Team
