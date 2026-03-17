# 🧪 QIB EDD SYSTEM v3.0 — MASTER QA + UAT COMMAND
## End-to-End Functional Test Suite & Validation Protocol

**Document Version:** 1.0  
**Date:** 18 March 2026  
**Status:** ✅ READY FOR EXECUTION  
**Applicable To:** All QA Teams, UAT Participants, AI QA Agents

---

## EXECUTIVE DIRECTIVE

```
█████████████████████████████████████████████████████████████████████

EXECUTE FULL SYSTEM VALIDATION FOR QIB EDD PLATFORM (VERSION 3.0)

Objective:
Perform 100% End-to-End Functional, UI, Navigation, Security, Governance, 
and Data Validation testing for the QIB EDD System based on the approved 
BRD v3.0.

Scope:
✔ All pages (dashboard, business_view, cdd_view, customer360, kyc_monitoring, 
  edd_case, compliance_view, alternative_channels, etc.)
✔ All workflows (EDD lifecycle from creation to closure)
✔ All integrations (T24 / SigCap / ETL simulation)
✔ All roles (Business, CDD, Compliance, Access Control, Admin)
✔ All governance controls (Maker/Checker, Change Management, Approvals)
✔ All security functions (4-digit PIN, Role-based Access, Audit Trail)

Validation Coverage:
 1. Functional Validation (All Features per BRD)
 2. Navigation & UX Flow (All paths tested)
 3. Form Completeness (EDD Form 100% validation)
 4. Access Control & Role Matrix (14 roles enforced)
 5. Maker / Checker Logic (Configuration & execution)
 6. Notifications & Consequence Engine (Timelines & escalation)
 7. Financial Analysis Engine (Variance detection & outcomes)
 8. Audit Trail (All events traceable)
 9. Theme Persistence (Settings survive navigation)
10. Demo Stability & Clean State (Reload & reset functional)

Execution Rules:
✖ NO step shall be skipped
✖ NO silent failures allowed
✖ Any missing function = DEFECT (mark immediately)
✖ Any incorrect navigation = DEFECT
✖ Any missing field = CRITICAL DEFECT
✖ Any bypass of approval mechanism = CRITICAL DEFECT
✖ Any unsigned approval = CRITICAL DEFECT
✖ Any console error = MEDIUM DEFECT (minimum)

Final Output Required:
✔ PASS / FAIL per module
✔ Defect list with severity (Critical, High, Medium, Low)
✔ Evidence screenshots/logs
✔ Final Sign-Off:
    ✅ SYSTEM IS 100% PRODUCTION READY
    OR
    ❌ NOT READY (detailed reasons + remediation path)

Special Mandatory Checks:
✔ EDD Form completeness = 100% of fields
✔ All 14 form tabs present & navigable
✔ Signature replaced with 4-digit PIN (no images)
✔ Access Control Page exists & fully functional
✔ Maker/Checker configurable per department/role
✔ T24 "Next EDD Date" logic simulated correctly
✔ High Risk classification → Auto case creation
✔ Medium/Low Risk → NO case creation
✔ Theme persistence across 5+ page transitions
✔ All buttons clickable & functional
✔ No alert() usage (only UI-based notifications)
✔ No console errors (F12 DevTools clean)
✔ All navigation paths reversible (...Back buttons work)
✔ Demo reset and reload cleanly without artifacts
✔ Financial engine displays narrative (not raw numbers)
✔ Consequences triggered ONLY on non-response
✔ Consequences BLOCKED if customer is High Risk (normal status)
✔ All approvals logged in Audit Trail

Execution Mode:
██ STRICT / ZERO-TOLERANCE ██

Any deviation from BRD requirements = DEFECT (no exceptions)
```

---

## 1️⃣ FUNCTIONAL VALIDATION MATRIX

### 1.1 EDD Case Creation Logic (BRD Section 10)

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-EDD-001** | ✅ Case Creation: High Risk + Next EDD Date Reached | Customer Risk = High Risk, Next EDD Date = TODAY | System creates case automatically | [ ] | |
| **TC-EDD-002** | ✖ Case NOT Created: Medium Risk | Customer Risk = Medium Risk | NO case created | [ ] | |
| **TC-EDD-003** | ✖ Case NOT Created: Low Risk | Customer Risk = Low Risk | NO case created | [ ] | |
| **TC-EDD-004** | ✖ Case NOT Created: Date Not Yet Reached | High Risk but Next EDD Date = +7 days | NO case created | [ ] | |
| **TC-EDD-005** | ✅ Case Created: Configuration-Driven Trigger | Next EDD Date config = 1 week before | Case opens per config (not hardcoded) | [ ] | |

---

### 1.2 Customer Re-KYC & Reassessment (BRD Section 11)

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-REKYC-001** | Re-KYC Independent from EDD | Customer completes Re-KYC | Re-KYC process continues independent | [ ] | |
| **TC-REKYC-002** | ✅ Reassessed as High Risk → Case Created | Re-KYC result = High Risk | EDD case created automatically | [ ] | |
| **TC-REKYC-003** | ✖ Reassessed as Low/Medium → NO Case | Re-KYC result = Medium Risk | NO EDD case created | [ ] | |
| **TC-REKYC-004** | Previous vs Current Analysis | High Risk customer reassessed | System displays: Previous analysis + Current analysis + Variances | [ ] | |
| **TC-REKYC-005** | Risk Classification Transparency | Case opened post-reassessment | System shows: Primary reason + Secondary reasons + Impact level | [ ] | |

---

### 1.3 EDD Form — 14 Tabs Completeness (BRD Section 14) 🔥 CRITICAL

| Tab # | Tab Name | Mandatory Fields Count | Status | Evidence |
|-------|----------|------------------------|--------|----------|
| 1 | Request Type & Basics | 8 | [ ] Present | |
| 2 | Risk Classification | 6 | [ ] Present | |
| 3 | Customer Information | 12 | [ ] Present | |
| 4 | Purpose & Intended Use | 5 | [ ] Present | |
| 5 | Income & Wealth Sources | 10 | [ ] Present | |
| 6 | Deposits & Activity | 8 | [ ] Present | |
| 7 | Existing Relationships | 6 | [ ] Present | |
| 8 | PEP Identification | 4 | [ ] Present | |
| 9 | Financial Analysis | 7 | [ ] Present | |
| 10 | Recommendations | 5 | [ ] Present | |
| 11 | Approvals | 4 | [ ] Present | |
| 12 | Sign-Offs | 8 | [ ] Present | |
| 13 | Additional Compliance | 6 | [ ] Present | |
| 14 | Final Governance | 5 | [ ] Present | |
| **TOTAL** | **All 14 tabs** | **≥100 fields** | **[ ] COMPLETE** | |

**TC-FORM-001** 🔥 CRITICAL: All 14 tabs present and accessible  
**Result:** [ ] PASS / [ ] FAIL  
**Evidence:** Screenshots of each tab

---

### 1.4 Form Submission Validation (BRD Section 15) 🔥 CRITICAL

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-FORM-SUBMIT-001** 🔥 | Mandatory Field Block | Missing 1+ mandatory field | System blocks submission + highlights missing field | [ ] | |
| **TC-FORM-SUBMIT-002** 🔥 | All Mandatory Completed | All required fields filled | Submission allowed | [ ] | |
| **TC-FORM-SUBMIT-003** 🔥 | N/A Field Handling | Non-applicable field marked "N/A" | System accepts as valid completion | [ ] | |
| **TC-FORM-SUBMIT-004** 🔥 | Document Upload Required | Tab 12 requires attachment | System blocks if no file uploaded | [ ] | |
| **TC-FORM-SUBMIT-005** | Draft Saving | User fills partial data + clicks Save | System saves as Draft (can resume later) | [ ] | |

---

### 1.5 4-Digit Signature PIN (BRD Section 27) 🔥 CRITICAL

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-PIN-001** 🔥 | PIN Separate from Login | User logs in | Login password ≠ Signature PIN | [ ] | |
| **TC-PIN-002** 🔥 | PIN Required on Approval | User attempts to approve case | System prompts for 4-digit PIN | [ ] | |
| **TC-PIN-003** 🔥 | PIN Incorrect → Rejection | Wrong PIN entered | Approval blocked, error shown | [ ] | |
| **TC-PIN-004** 🔥 | PIN Correct → Approval | Correct PIN entered | Case approved, logged in Audit Trail | [ ] | |
| **TC-PIN-005** 🔥 | NO Signature Image Used | Check form extraction | NO signature.jpeg or image field | [ ] | |

---

### 1.6 T24 & SigCap Integration (BRD Section 16) 🔥 CRITICAL

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-T24-001** 🔥 | T24 Customer Data Retrieved | Case created for customer | System displays: Acct #, Name, Status from T24 | [ ] | |
| **TC-T24-002** 🔥 | SigCap Signatory Validation | Signatory info pulled | System validates QID from SigCap vs T24 | [ ] | |
| **TC-T24-003** | Signatory Mismatch Alert | Signatory ≠ Acct Holder | System alerts user | [ ] | |
| **TC-T24-004** | Related Accounts Display | SigCap lookup | System shows all accounts for same ID | [ ] | |
| **TC-T24-005** | Closed Accounts Flagged | Account lookup | System labels closed accounts separately | [ ] | |

---

### 1.7 Financial Comparison Engine (BRD Section 20) 🔥 CRITICAL

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-FIN-001** 🔥 | Declared vs Actual | Salary=10K, Deposits=14K | Outcome: "Requires Review" (140% variance) | [ ] | |
| **TC-FIN-002** | Consistent Values | Salary=10K, Deposits=10K | Outcome: "Consistent" | [ ] | |
| **TC-FIN-003** 🔥 | Narrative Display (NOT raw) | Financial data entered | System displays: "Average monthly deposits EXCEED salary by 40%" | [ ] | |
| **TC-FIN-004** | Below Expected | Salary=10K, Deposits=6K | Outcome: "Below Expected" | [ ] | |
| **TC-FIN-005** | Above Expected | Salary=10K, Deposits=20K | Outcome: "Above Expected" | [ ] | |
| **TC-FIN-006** | Materially Above | Salary=10K, Deposits=50K | Outcome: "Materially Above Expected" (requires escalation) | [ ] | |
| **TC-FIN-007** | Threshold Configurable | Admin changes threshold | System applies new threshold (next run) | [ ] | |

---

### 1.8 Notifications & Customer Outreach (BRD Section 22) 🔥 CRITICAL

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-NOTIF-001** 🔥 | Notification Triggered | Case created → Notification schedule starts | Notification sent to customer (Channel per config) | [ ] | |
| **TC-NOTIF-002** 🔥 | Configurable Channels | Admin sets channels | System uses: Email / SMS / App Popup per config | [ ] | |
| **TC-NOTIF-003** 🔥 | Follow-Up Days Configured | Config: "Notify day 1, 5, 10" | Notifications sent on those days | [ ] | |
| **TC-NOTIF-004** 🔥 | Notification History Logged | Notification sent | Audit Trail shows: SendTime, Channel, Content, Status | [ ] | |
| **TC-NOTIF-005** | Customer Response Tracked | Customer uploads doc | System records: Upload timestamp, Document status | [ ] | |
| **TC-NOTIF-006** | Last Follow-Up Date | Multiple notifications | System displays latest follow-up date | [ ] | |

---

### 1.9 Consequence Management (BRD Section 23) 🔥 CRITICAL

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-CON-001** 🔥 | Trigger: No Response After SLA | Customer doesn't respond within 10 days | Consequence process starts → Escalation Stage 1 | [ ] | |
| **TC-CON-002** 🔥 | BLOCKED: Customer is High Risk (normal) | Customer classified High Risk (normal) | Consequence NOT triggered (this is expected status) | [ ] | |
| **TC-CON-003** 🔥 | Stages Executed Per Config | Config: 3 stages, 5 days each | Day 5 → Stage 1, Day 10 → Stage 2, Day 15 → Stage 3 | [ ] | |
| **TC-CON-004** 🔥 | Consequence Actions Applied | Stage 3 reached | Account restriction applied (per approved policy) | [ ] | |
| **TC-CON-005** | Stop on Response | Customer responds in Stage 1 | Consequence escalation stops immediately | [ ] | |
| **TC-CON-006** | Approval Required | Restriction stage | Consequence requires Maker/Checker approval | [ ] | |

---

### 1.10 Audit Trail (BRD Section 36) 🔥 CRITICAL

| Event | Tracked? | Detail Level | Result | Evidence |
|-------|----------|--------------|--------|----------|
| Case Creation | ✔ | User, Timestamp, Trigger reason | [ ] | |
| Reassessment | ✔ | Previous vs New risk, User, Date | [ ] | |
| Data Update | ✔ | Field changed, Old value, New value, User | [ ] | |
| Document Upload | ✔ | File name, Size, User, Timestamp | [ ] | |
| Approval | ✔ | User, Role, Decision, PIN used, Timestamp | [ ] | |
| Notification | ✔ | Type, Channel, Content, SendTime, Status | [ ] | |
| Consequence Action | ✔ | Action type, Stage, User, Timestamp, Approval | [ ] | |
| Print | ✔ | User name, ID, Dept, Date, Time, Case ref | [ ] | |
| Form Export | ✔ | Format, Timestamp, User, Watermark (if draft) | [ ] | |

**TC-AUDIT-001** 🔥 CRITICAL: All events traceable with who/what/when/where/why  
**Result:** [ ] PASS / [ ] FAIL

---

### 1.11 Printing Controls (BRD Section 28)

| Test ID | Test Case | Expected Output | Result | Evidence |
|---------|-----------|-----------------|--------|----------|
| **TC-PRINT-001** 🔥 | Print Output Contains | Employee Name, Staff ID, Dept/Group, Print Date/Time, Case # | [ ] | |
| **TC-PRINT-002** | Print Logged | Audit Trail records: User, Timestamp | [ ] | |
| **TC-PRINT-003** | Unauthorized Users Blocked | Non-admin attempts print | Access denied | [ ] | |

---

### 1.12 Form Extraction & Final Output (BRD Section 29)

| Test ID | Test Case | Condition | Expected Output | Result | Evidence |
|---------|-----------|-----------|-----------------|--------|----------|
| **TC-EXTRACT-001** 🔥 | Extraction Allowed | All mandatory fields completed + approvals done | Extract button ENABLED | [ ] | |
| **TC-EXTRACT-002** 🔥 | Extraction Blocked | Missing mandatory field | Extract button DISABLED | [ ] | |
| **TC-EXTRACT-003** 🔥 | Final Form Content | Extraction triggered | Contains: All data + Approvals (names, IDs, timestamps) + Digital signatures | [ ] | |
| **TC-EXTRACT-004** 🔥 | Approval Count | Final form | Minimum: 2 Makers + 2 Checkers | [ ] | |
| **TC-EXTRACT-005** | Draft Watermark | Extraction before approval complete | Watermark: "DRAFT / PENDING APPROVAL / INCOMPLETE" | [ ] | |

---

## 2️⃣ ACCESS CONTROL & ROLE MATRIX (BRD Section 30) 🔥 CRITICAL

### 2.1 Access Control Page (NEW)

| Test ID | Test Case | Expected Output | Result | Evidence |
|---------|-----------|-----------------|--------|----------|
| **TC-ACCESS-001** 🔥 | Access Control Page Exists | Dedicated page accessible from Admin menu | [ ] | |
| **TC-ACCESS-002** 🔥 | Access Control Config Interface | UI shows: Role selection, Permission matrix, Maker/Checker options | [ ] | |
| **TC-ACCESS-003** 🔥 | Maker/Checker Toggle | Admin selects: Single User OR Maker/Checker per department | Configuration saved | [ ] | |
| **TC-ACCESS-004** 🔥 | Role Permission Matrix | All 14 roles listed with editable permissions | [ ] | |
| **TC-ACCESS-005** 🔥 | Save & Apply | New config saved, automatically applied | [ ] | |

---

### 2.2 14 Defined Roles Enforced

| Role # | Role Name | Access Level | Test Result |
|--------|-----------|--------------|-------------|
| 1 | Business User | Initiate cases, Complete forms | [ ] |
| 2 | Branch User | Branch-level cases only | [ ] |
| 3 | Relationship Manager | Customer assignment, Follow-up | [ ] |
| 4 | CDD Operations | Case review, Data validation | [ ] |
| 5 | Compliance | Approval, Risk assessment, Escalation | [ ] |
| 6 | Operations | Workflow management, SLA monitoring | [ ] |
| 7 | Marketing | Notification campaigns, Communication | [ ] |
| 8 | Change Management | Configuration changes, Approvals | [ ] |
| 9 | IT / Development | System config, User management, Resets | [ ] |
| 10 | Management | Dashboards, Reports, Overview | [ ] |
| 11 | Committee Member | Change review, Approvals | [ ] |
| 12 | SteerCo Viewer | Read-only dashboards, Strategic reports | [ ] |
| 13 | Audit User | Audit trail access, Reporting | [ ] |
| 14 | Admin / Configuration | All system access | [ ] |

**TC-ROLES-001** 🔥 CRITICAL: All 14 roles functional  
**Result:** [ ] PASS / [ ] FAIL

---

### 2.3 Segregation of Duties

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-SOD-001** 🔥 | Same user as Maker AND Checker (blocked) | Config: Single user for both | System prevents same user from both roles | [ ] | |
| **TC-SOD-002** 🔥 | Maker can view, not approve | Business user submits case | Maker sees case, Checker button disabled for Maker | [ ] | |
| **TC-SOD-003** 🔥 | Checker cannot submit, only check | Case in Checker queue | Checker cannot modify submission content | [ ] | |

---

## 3️⃣ MAKER / CHECKER WORKFLOW (BRD Section 24) 🔥 CRITICAL

| Test ID | Test Case | Input | Expected Workflow | Result | Evidence |
|---------|-----------|-------|-------------------|--------|----------|
| **TC-WF-001** 🔥 | Case Submitted by Maker | Business user completes form + clicks Submit | Case enters "Pending Checker Review" state | [ ] | |
| **TC-WF-002** 🔥 | Checker Reviews | Checker opens case | Checker sees all data + Approve/Reject buttons | [ ] | |
| **TC-WF-003** 🔥 | Checker Approves (with PIN) | Checker enters 4-digit PIN + Approve | Case moves to "Approved" state, Audit logged | [ ] | |
| **TC-WF-004** 🔥 | Checker Rejects (with reason) | Checker enters rejection reason + PIN | Case returns to Maker for revision | [ ] | |
| **TC-WF-005** | Maker Revises Post-Rejection | Maker corrects data + Resubmits | Case returns to Checker queue | [ ] | |
| **TC-WF-006** 🔥 | Single User Mode (alternate) | Config: Single User approval | Case bypasses Checker, goes to Approved (still requires PIN) | [ ] | |

---

## 4️⃣ CHANGE MANAGEMENT & GOVERNANCE (BRD Section 25) 🔥 CRITICAL

| Test ID | Test Case | Change Type | Approval Path | Result | Evidence |
|---------|-----------|-------------|---------------|--------|----------|
| **TC-CHG-001** 🔥 | Rule Change | Threshold update | Compliance → Committee → Change Mgmt → Head Ops | [ ] | |
| **TC-CHG-002** 🔥 | Template Change | Notification content | Business/Ops Maker/Checker | [ ] | |
| **TC-CHG-003** 🔥 | Timeline Change | Notification days config | Compliance review required | [ ] | |
| **TC-CHG-004** 🔥 | No Production Activation Without Approval | Change request bypassed | System blocks activation (prevents unauthorized changes) | [ ] | |
| **TC-CHG-005** 🔥 | Version Control Maintained | After each change approval | System records version, date, approver, change details | [ ] | |

---

## 5️⃣ NAVIGATION & UX FLOW (BRD Appendix B) 🔥 CRITICAL

### 5.1 Primary Navigation Paths

| Path # | Navigation Sequence | Expected Result | Result | Evidence |
|--------|-------------------|-----------------|--------|----------|
| **PATH-001** 🔥 | Dashboard → Business View → Mass Banking | Grid of 10+ cases loaded | [ ] | |
| **PATH-002** 🔥 | Business View → Click Case Card | Case detail modal opens (not navigate away) | [ ] | |
| **PATH-003** 🔥 | Case Detail → "Open Full Form" | Redirects to edd_case.html with case context | [ ] | |
| **PATH-004** 🔥 | EDD Case Form → Submit | Submission processed (Maker/Checker flow) | [ ] | |
| **PATH-005** 🔥 | Dashboard → CDD View | CDD queue displayed | [ ] | |
| **PATH-006** 🔥 | Dashboard → Customer 360 → Select Customer | Customer profile loaded with all channels | [ ] | |
| **PATH-007** 🔥 | Dashboard → Alternative Channels → Select Channel | Channel request table displayed with segment mix | [ ] | |
| **PATH-008** 🔥 | Dashboard → KYC Monitoring → Reassessed Customers | Re-KYC list filtered | [ ] | |
| **PATH-009** 🔥 | Dashboard → Compliance View | Compliance dashboard loaded | [ ] | |
| **PATH-010** 🔥 | Any Page → Access Control | Access Control settings page loads | [ ] | |

### 5.2 Back Button & Reverse Navigation

| Test ID | Test Case | Navigation | Result | Evidence |
|---------|-----------|-----------|--------|----------|
| **TC-NAV-BACK-001** 🔥 | Back from Case Detail | Modal closes, returns to Business View | [ ] | |
| **TC-NAV-BACK-002** 🔥 | Back from EDD Form | Form closes (with unsaved warning if needed), returns to previous | [ ] | |
| **TC-NAV-BACK-003** 🔥 | Back from Compliance View → Dashboard | Navigation works, no console error | [ ] | |
| **TC-NAV-BACK-004** 🔥 | Deep navigation chain (5+ pages) all Backs work | User clicks Back repeatedly | Reaches Dashboard cleanly | [ ] | |

### 5.3 All Buttons Clickable & Functional

| Button Type | Test | Result | Evidence |
|-------------|------|--------|----------|
| Submit | Form submit button enabled when validation passes | [ ] | |
| Approve | Approval button requires PIN entry, processes correctly | [ ] | |
| Reject | Rejection button requires reason + PIN | [ ] | |
| Print | Print button works, generates formatted output | [ ] | |
| Export | Export button downloads Excel with metadata | [ ] | |
| Close Modal | X button, Cancel button, outside-click closes modal | [ ] | |
| Navigate | All nav-item buttons link to correct pages | [ ] | |

---

## 6️⃣ UI/UX CONSISTENCY & THEME PERSISTENCE (BRD Section 27) 🔥 CRITICAL

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-THEME-001** 🔥 | Change Theme (Light/Dark) | Settings → Select Dark Mode | All pages switch to Dark immediately | [ ] | |
| **TC-THEME-002** 🔥 | Navigate 5+ Pages | Visit 5 different pages in Dark mode | Theme PERSISTS (does NOT reset) | [ ] | |
| **TC-THEME-003** 🔥 | Reload Page | User in Dark mode clicks F5 | Theme still Dark (stored in localStorage/session) | [ ] | |
| **TC-THEME-004** 🔥 | Logout & Login | User logs out in Dark, logs back in | Dark theme restored (user preference saved) | [ ] | |
| **TC-THEME-005** | Font Size Change | Settings → Increase font size | All pages update, persists after navigation | [ ] | |
| **TC-THEME-006** | Color Mode (High Contrast) | Settings → High Contrast on | Contrast applied globally, persists | [ ] | |

**TC-THEME-MASTER** 🔥 CRITICAL: Theme does NOT reset during usage  
**Result:** [ ] PASS / [ ] FAIL

---

## 7️⃣ DEMO STABILITY & CLEAN STATE (🔥 CRITICAL)

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-DEMO-001** 🔥 | Demo Reload | User refreshes browser (F5) | System reloads cleanly, sample data restored | [ ] | |
| **TC-DEMO-002** 🔥 | Console Clean | F12 → Console tab | NO errors, NO warnings | [ ] | |
| **TC-DEMO-003** 🔥 | No Alerts | Demo navigation | NO JavaScript alert() popups (only UI notifications) | [ ] | |
| **TC-DEMO-004** 🔥 | Demo Reset Function | Admin clicks "Reset Demo" | All data returns to sample state (cases, customers) | [ ] | |
| **TC-DEMO-005** | Performance: Page Load | Any page loaded | Load time < 2 seconds | [ ] | |
| **TC-DEMO-006** | Performance: Form Tab Switch | Switching between 14 tabs | Each tab loads < 500ms | [ ] | |
| **TC-DEMO-007** | Memory: Repeated Navigation | Navigate 20+ times between pages | No memory leak, browser responsive | [ ] | |

---

## 8️⃣ SECURITY CONTROLS (BRD Section 27)

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-SEC-001** 🔥 | Role-Based Access Enforced | Non-admin tries to access admin panel | Access denied | [ ] | |
| **TC-SEC-002** 🔥 | 4-Digit PIN Required for Approval | Approval attempted without PIN | System prompts for PIN | [ ] | |
| **TC-SEC-003** 🔥 | Session Timeout | Idle for configured time | User redirected to login | [ ] | |
| **TC-SEC-004** 🔥 | Document Upload Validated | User attempts to upload .exe | File rejected, error message | [ ] | |
| **TC-SEC-005** 🔥 | Audit Trail Protected | Non-admin tries to view audit trail | Access denied (Audit role only) | [ ] | |
| **TC-SEC-006** 🔥 | Data Export Logged | User exports data | Audit Trail records: Who, When, What format | [ ] | |

---

## 9️⃣ DATA INTEGRITY & VALIDATION (BRD Section 15)

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-DATA-001** 🔥 | Duplicate Entry Prevention | Submit case twice with same customer | System prevents duplicate or alerts | [ ] | |
| **TC-DATA-002** 🔥 | Data Type Validation | Enter text in numeric field | System rejects, error shown | [ ] | |
| **TC-DATA-003** 🔥 | Date Range Validation | Enter future date for past field | System rejects | [ ] | |
| **TC-DATA-004** 🔥 | Required Field Completion | Form has empty required field | Submission blocked, field highlighted | [ ] | |
| **TC-DATA-005** | Field Interdependency | Field B depends on Field A | If A empty, B disabled or validated | [ ] | |

---

## 🔟 STATEMENT & TRANSACTION REVIEW (BRD Section 19)

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-STMT-001** | Statement Period Selection | User selects "Last 3 months" | System filters transactions to 3-month range | [ ] | |
| **TC-STMT-002** | Summary Display | Statement loaded | Summary shows: Total deposits, debits, transfers, avg monthly | [ ] | |
| **TC-STMT-003** | Drill-Down Available | User clicks on summary | Full transaction details display | [ ] | |
| **TC-STMT-004** | Transaction Filtering | User filters by "Incoming transfers" | System displays filtered transactions | [ ] | |

---

## 1️⃣1️⃣ REPORTING & DASHBOARDS (BRD Section 32-35) 🔥 CRITICAL

| Dashboard | Viewers | Filters Functional | Export to Excel | Result | Evidence |
|-----------|---------|-------------------|-----------------|--------|----------|
| Open Cases | Management, Operations | Group / Department / Status | ✔ | [ ] | |
| Closed Cases | Management, Compliance | Category / Date range | ✔ | [ ] | |
| Overdue Cases | Operations, CDD | Priority, Days overdue | ✔ | [ ] | |
| ReKYC Pipeline | Operations | Status, Stage | ✔ | [ ] | |
| High Risk Reassessed | Compliance | New classification, Trigger | ✔ | [ ] | |
| Notifications Sent | Operations | Status, Response rate | ✔ | [ ] | |
| Consequences Status | Operations, Compliance | Stage, Approval pending | ✔ | [ ] | |
| Change Requests | Change Mgmt, IT | Status, Approval stage | ✔ | [ ] | |

**TC-DASH-001** 🔥 CRITICAL: All dashboards functional with filters & exports  
**Result:** [ ] PASS / [ ] FAIL

---

## 1️⃣2️⃣ LANGUAGE & LOCALIZATION (if applicable)

| Test ID | Test Case | Input | Expected Output | Result | Evidence |
|---------|-----------|-------|-----------------|--------|----------|
| **TC-LANG-001** | English UI | Browser language = EN | All UI text in English | [ ] | |
| **TC-LANG-002** | Arabic UI (if enabled) | Browser language = AR | All UI text in Arabic, RTL layout | [ ] | |
| **TC-LANG-003** | Language Switcher | User clicks "AR" in settings | Entire system switches to Arabic | [ ] | |
| **TC-LANG-004** | Persistence | Language changed to Arabic, page reloaded | Arabic persists | [ ] | |

---

## 1️⃣3️⃣ INTEGRATION SIMULATION (For Demo)

| System | Test Case | Output | Result | Evidence |
|--------|-----------|--------|--------|----------|
| **T24** | Pull customer data | Customer demographics loaded | [ ] | |
| **SigCap** | Validate signatory | Signatory information matched | [ ] | |
| **ETL** | Fallback data source | Data retrieved if T24 unavailable | [ ] | |

---

## DEFECT SEVERITY CLASSIFICATION

### 🔴 CRITICAL (Blocks Production / Violates BRD)
- ❌ Mandatory form field missing
- ❌ Approval bypass possible
- ❌ No audit trail for critical actions
- ❌ High Risk case NOT created when due
- ❌ 4-digit PIN not enforced
- ❌ Access control not enforced
- ❌ Maker/Checker logic broken
- ❌ Data loss possible

### 🟠 HIGH (Major Workflow Impact)
- ❌ Button not functional
- ❌ Navigation broken (Back button fails)
- ❌ Form submission fails
- ❌ Theme doesn't persist
- ❌ Financial engine doesn't calculate

### 🟡 MEDIUM (UI/UX Issue)
- ⚠️ Console error (non-blocking)
- ⚠️ Typo in label
- ⚠️ Styling inconsistency
- ⚠️ Slow page load (> 2 sec)

### 🔵 LOW (Minor Enhancement)
- ℹ️ Tooltip improvement
- ℹ️ Color preference
- ℹ️ Font size readability

---

## TEST EXECUTION CHECKLIST

```
PHASE 1: FUNCTIONAL VALIDATION (Days 1-2)
├─ [ ] EDD Case Creation Logic (TC-EDD-001 to 005)
├─ [ ] Re-KYC & Reassessment (TC-REKYC-001 to 005)
├─ [ ] Form Completeness (TC-FORM-001 to 005)
├─ [ ] Form Submission (TC-FORM-SUBMIT-001 to 005)
├─ [ ] 4-Digit PIN (TC-PIN-001 to 005)
├─ [ ] T24 Integration (TC-T24-001 to 005)
├─ [ ] Financial Engine (TC-FIN-001 to 007)
├─ [ ] Notifications (TC-NOTIF-001 to 006)
├─ [ ] Consequences (TC-CON-001 to 006)
├─ [ ] Audit Trail (TC-AUDIT-001)
└─ [ ] Print & Export (TC-PRINT-001, TC-EXTRACT-001 to 005)

PHASE 2: GOVERNANCE & ACCESS (Day 3)
├─ [ ] Access Control Page (TC-ACCESS-001 to 005)
├─ [ ] Role Matrix (TC-ROLES-001)
├─ [ ] Segregation of Duties (TC-SOD-001 to 003)
├─ [ ] Maker/Checker (TC-WF-001 to 006)
├─ [ ] Change Management (TC-CHG-001 to 005)
└─ [ ] Security Controls (TC-SEC-001 to 006)

PHASE 3: NAVIGATION & UX (Day 4)
├─ [ ] Primary Paths (PATH-001 to 010)
├─ [ ] Back Navigation (TC-NAV-BACK-001 to 004)
├─ [ ] Button Functionality (all)
├─ [ ] Theme Persistence (TC-THEME-001 to 006)
├─ [ ] Demo Stability (TC-DEMO-001 to 007)
└─ [ ] Data Validation (TC-DATA-001 to 005)

PHASE 4: REPORTING & FINALIZATION (Day 5)
├─ [ ] Dashboards (TC-DASH-001)
├─ [ ] Reports & Excel Export
├─ [ ] Language/Localization
├─ [ ] Integration Simulation
├─ [ ] Final Console Check
├─ [ ] Performance Validation
└─ [ ] FINAL SIGN-OFF
```

---

## FINAL TEST EXECUTION REPORT TEMPLATE

```
╔═══════════════════════════════════════════════════════════════════════╗
║            QIB EDD SYSTEM v3.0 — FINAL QA/UAT REPORT                 ║
╚═══════════════════════════════════════════════════════════════════════╝

PROJECT: QIB Enhanced Due Diligence System
VERSION: 3.0 Complete
TEST EXECUTION DATE: [DATE]
QA TEAM: [NAMES]
ENVIRONMENT: [DEV/STAGING/DEMO]

─────────────────────────────────────────────────────────────────────────

EXECUTIVE SUMMARY:
  Overall Status: [ ] ✅ PASS / [ ] ❌ FAIL
  Total Tests: 94
  Passed: [__]
  Failed: [__]
  Blocked: [__]
  
  Critical Defects: [__] (if > 0, FAIL)
  High Defects: [__]
  Medium Defects: [__]
  Low Defects: [__]

─────────────────────────────────────────────────────────────────────────

PHASE RESULTS:

✔ PHASE 1: Functional Validation
  Status: [ ] PASS / [ ] FAIL
  Coverage: EDD logic, Forms, PIN, T24, Financial, Notifications, Consequences, Audit
  Details: [SUMMARY]

✔ PHASE 2: Governance & Access
  Status: [ ] PASS / [ ] FAIL
  Coverage: Access Control, Roles, Maker/Checker, Change Mgmt, Security
  Details: [SUMMARY]

✔ PHASE 3: Navigation & UX
  Status: [ ] PASS / [ ] FAIL
  Coverage: Navigation paths, Back buttons, Theme, Demo stability
  Details: [SUMMARY]

✔ PHASE 4: Reporting
  Status: [ ] PASS / [ ] FAIL
  Coverage: Dashboards, Reports, Excel exports, Localization
  Details: [SUMMARY]

─────────────────────────────────────────────────────────────────────────

DEFECT SUMMARY:

CRITICAL DEFECTS (🔴):
  [1] [Description] → Severity: Block Production
  [2] [Description] → Severity: Block Production
  [Remediation Required Before Go-Live]

HIGH DEFECTS (🟠):
  [1] [Description] → Severity: Major workflow impact
  [Recommend remediation before UAT sign-off]

MEDIUM DEFECTS (🟡):
  [1] [Description] → Severity: Minor UI issue

LOW DEFECTS (🔵):
  [1] [Description] → Severity: Enhancement opportunity

─────────────────────────────────────────────────────────────────────────

MANDATORY CHECKS SUMMARY:

✔ EDD Form completeness = 100% of fields
✔ All 14 form tabs present & navigable
✔ 4-Digit PIN enforced (no signature images)
✔ Access Control Page exists & functional
✔ Maker/Checker configurable
✔ T24 "Next EDD Date" logic simulated
✔ High Risk → Auto case creation
✔ Medium/Low Risk → NO case creation
✔ Theme persists across 5+ page transitions
✔ All buttons clickable
✔ No alert() usage (UI notifications only)
✔ No console errors (F12 clean)
✔ All navigation reversible (Back works)
✔ Demo reload cleanly
✔ Financial engine displays narrative
✔ Consequences triggered correctly
✔ All approvals in Audit Trail

─────────────────────────────────────────────────────────────────────────

EVIDENCE & ATTACHMENTS:

Screenshots:
  [ ] Dashboard overview
  [ ] EDD Form (all 14 tabs)
  [ ] Access Control page
  [ ] Maker/Checker workflow
  [ ] Financial engine results
  [ ] Notifications sent
  [ ] Audit trail entry
  [ ] Print output (with metadata)
  [ ] Excel export
  [ ] Theme persistence test

Video Recordings:
  [ ] End-to-end workflow (5+ minutes)
  [ ] Navigation testing (3+ minutes)

Logs:
  [ ] Browser console (clean)
  [ ] Server logs (no errors)
  [ ] Audit trail export

─────────────────────────────────────────────────────────────────────────

FINAL RECOMMENDATION:

[ ] ✅ SYSTEM IS 100% PRODUCTION READY
    Recommendation: Proceed to Go-Live
    
[ ] ⚠️ SYSTEM READY WITH KNOWN LIMITATIONS
    Recommendation: Go-Live with condition (list mitigation)
    
[ ] ❌ SYSTEM NOT READY FOR PRODUCTION
    Reason: [CRITICAL DEFECTS / MAJOR GAPS]
    Recommendation: Remediate and re-test

─────────────────────────────────────────────────────────────────────────

SIGN-OFF:

QA Lead: ___________________ Date: __________

Compliance Lead: ___________________ Date: __________

Operations Lead: ___________________ Date: __________

Bank Leadership Approval: ___________________ Date: __________

─────────────────────────────────────────────────────────────────────────

END OF REPORT
```

---

## FINAL INSTRUCTION

```
Execution Mode: ZERO-TOLERANCE / STRICT COMPLIANCE

Any deviation from BRD v3.0 requirements = DEFECT (no exceptions)
Any skipped test case = NOT ACCEPTABLE (document reason if blocked)
Any "looks OK" assumption = NOT ACCEPTABLE (verify with evidence)

You are testing for REGULATORY COMPLIANCE + PRODUCTION READINESS.

Treat defects as if QCB regulators are watching.

End result must be:
  ✅ System is audit-ready
  ✅ System is 100% compliant with BRD
  ✅ System is production-safe
  ✅ System is zero-defect (critical)
```

---

**Document Status:** ✅ **READY FOR QA TEAM EXECUTION**  
**Version:** 1.0 Complete & Final  
**Date:** 18 March 2026

---

*This Master Command and Test Suite can be executed by:*
- *Human QA Teams*
- *AI QA Agents (ChatGPT, Claude, specialized QA bots)*
- *RPA Tools (for repetitive test cases)*
- *UAT Teams (pre-production validation)*

**Use case:** Ready for immediate deployment to any testing framework.
