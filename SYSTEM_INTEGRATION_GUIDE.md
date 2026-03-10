# Integrated EDD/KYC System Architecture
## Complete End-to-End Integration Guide

---

## 1. SYSTEM OVERVIEW

The EDD/KYC system is now fully integrated as a **single Retail Risk Governance Platform** with real-time workflow automation, multi-channel notifications, and intelligent case routing.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│            FRONTEND LAYER (Browser)                         │
│  kyc_form.html ────────────────────────────> Submission    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ POST /api/v1/kyc/submit (JSON)
                   ▼
┌──────────────────────────────────────────────────────────────┐
│            API LAYER (Node.js Express)                      │
│  kyc_api_routes.js                                          │
│  ├─ POST /v1/kyc/submit                                     │
│  ├─ GET  /v1/kyc/{kyc_id}/status                            │
│  └─ GET  /v1/kyc/{kyc_id}/case                              │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ Calls
                   ▼
┌──────────────────────────────────────────────────────────────┐
│         BUSINESS LOGIC LAYER (Orchestration)                │
│  edd_case_engine.js                                         │
│  ├─ assessRiskFromKYC()                                     │
│  ├─ createEDDCase()                                         │
│  ├─ routeCase()                                             │
│  └─ sendNotifications()                                     │
└──────────────────┬───────────────────────────────────────────┘
                   │
         ┌─────────┼─────────┬──────────────┐
         │         │         │              │
         ▼         ▼         ▼              ▼
   ┌─────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
   │ Database│ │ Routing│ │Notification│ Contact Center│
   │(PostgreSQL) │(workflow) │Engine      │Integration │
   │         │ │        │ │          │ │             │
   └─────────┘ └────────┘ └──────────┘ └──────────────┘
```

---

## 2. DATA FLOW: Complete Journey

### Example: Customer Submits KYC Form

#### Step 1: User Submits Form (kyc_form.html)
```javascript
// User clicks "Submit" button
submitForm() → collectFormData() → POST /api/v1/kyc/submit
```

**Data Sent:**
```json
{
  "firstName": "Ahmed",
  "lastName": "Al-Mansouri",
  "nationality": "QA",
  "monthlyIncome": 25000,
  "expectedDeposits": 50000,
  "pepStatus": "YES",
  "taxResidency": "QA",
  "usPerson": false
}
```

---

#### Step 2: API Receives Request (kyc_api_routes.js)
```
POST /api/v1/kyc/submit
  ├─ Validate data
  ├─ Check required fields
  ├─ Validate email/phone
  └─ Call EDD_CASE_ENGINE.submitKYCandCreateCase()
```

**Validation Checks:**
- All required fields present
- Email format valid
- Phone number valid
- Age >= 18 years old

---

#### Step 3: Risk Assessment (edd_case_engine.js)

##### Method: `submitKYCandCreateCase(kycData)`

```javascript
assessRiskFromKYC(kycData)
```

Calculates risk score based on 7 factors:

| Factor | Risk Score | Category |
|--------|-----------|----------|
| **Nationality** | 0-100 | SANCTIONED (100), RISK (50), CLEAR (0) |
| **PEP Status** | 0-40 | YES=40, RELATIVE=30, NO=0 |
| **Occupation** | 0-30 | HIGH_RISK=30, MEDIUM=15, LOW=0 |
| **Activity Ratio** | 0-25 | >120%=25, <120%=0 |
| **Source of Funds** | 0-15 | UNCLEAR=15, GIFT=10, CLEAR=0 |
| **FATCA** | 0-10 | US_PERSON=10, OTHER=0 |
| **Transaction Pattern** | 0-20 | SUSPICIOUS=20, NORMAL=0 |

**Total Risk Score Calculation:**
```
TOTAL = Nationality + PEP + Occupation + Activity + Funds + FATCA + Pattern
```

**Risk Rating Assignment:**
- 0-19: **LOW**
- 20-39: **MEDIUM**
- 40-59: **HIGH**
- 60+: **CRITICAL**

**Example Calculation:**
```
Ahmed Al-Mansouri:
  Nationality (QA): 0
  PEP Status (YES): 40  ← Politically Exposed
  Occupation (BUSINESS): 15
  Activity Ratio (50k/25k = 2.0, exceeds 1.2): 25
  Source of Funds (BUSINESS): 0
  FATCA: 0
  ─────────────────────
  TOTAL RISK: 80 → CRITICAL
  ✓ EDD TRIGGERED
```

---

#### Step 4: Create EDD Case (edd_case_engine.js)

##### Method: `createEDDCase(kycData, riskAssessment)`

**Inserts into `edd_cases` table:**
```sql
INSERT INTO edd_cases (
  case_id,              -- CHG202411300001
  kyc_id,               -- KYC202411300001
  customer_id,          -- CUS002411300001
  case_type,            -- 'EDD'
  case_status,          -- 'CREATED'
  case_priority,        -- 'URGENT' (if CRITICAL risk)
  risk_rating,          -- 'CRITICAL'
  assigned_to,          -- (NULL - assigned during routing)
  final_decision,       -- (NULL - pending review)
  created_at,           -- NOW()
  notes                 -- 'PEP customer, high activity ratio'
);
```

**Inserts into `case_risk_assessment` table:**
```sql
INSERT INTO case_risk_assessment (
  assessment_id,
  case_id,
  overall_risk_rating,  -- 'CRITICAL'
  risk_score,           -- 80
  nationality_risk,     -- 'CLEAR' (QA)
  pep_status,           -- 'YES'
  occupation_risk,      -- 'MEDIUM'
  activity_ratio,       -- 2.0
  source_of_funds,      -- 'BUSINESS'
  fatca_file,           -- false
  sanctions_check,      -- false
  aml_check,            -- true
  required_documents    -- ['Business License', 'Bank Statements', 'Beneficial Ownership']
);
```

**Result:**
```
✓ Case Created: CHG202411300001
  Risk: CRITICAL (PEP + Activity Ratio)
  EDD Required: YES
```

---

#### Step 5: Route Through Workflow (edd_case_engine.js → workflow_router.js)

##### Method: `routeCase(caseId, riskAssessment)`

Creates 4-stage workflow queue:

```sql
INSERT INTO workflow_queue (queue_id, case_id, current_workflow_stage, assigned_user, sla_hours, due_date)
VALUES
  (1, 'CHG202411300001', 'BUSINESS', 'user_ba_001', 24, NOW() + 24h),
  (2, 'CHG202411300001', 'CDD', NULL, 24, NULL),
  (3, 'CHG202411300001', 'COMPLIANCE', NULL, 24, NULL),
  (4, 'CHG202411300001', 'DECISION', NULL, 8, NULL);
```

**Stage Details:**

| Stage | Role | SLA | Responsibility |
|-------|------|-----|-----------------|
| **BUSINESS** | Business Analyst | 24h | Initial review, document requests |
| **CDD** | CDD Officer | 24h | Enhanced due diligence investigation |
| **COMPLIANCE** | Compliance Officer | 24h | Sanctions, PEP, AML final check |
| **DECISION** | Approver | 8h | Approve/Reject/Escalate decision |

**Auto-Assignment:**
```javascript
workflow_router.findBestAssignee('BUSINESS_ANALYST')
  ├─ Query users with role = 'BUSINESS_ANALYST'
  ├─ Count active cases per user
  ├─ Find lowest workload
  └─ Assign to: "Fatima Ahmed" (2 active cases)
```

**Result:**
```
Stage 1: BUSINESS
  Assigned: Fatima Ahmed
  Status: PENDING
  Due: 2024-11-30 13:45:00
  SLA: 24 hours
```

---

#### Step 6: Send Notifications (edd_case_engine.js → notification_engine.js)

##### Event Type: `CASE_CREATED`

**Notification #1: To Manager (Email)**
```json
{
  "case_id": "CHG202411300001",
  "event_type": "CASE_CREATED",
  "recipient_role": "MANAGER",
  "notification_type": "EMAIL",
  "subject": "⚠️ New EDD Case Created - CRITICAL Risk",
  "message": "Customer: Ahmed Al-Mansouri (PEP)\nCase: CHG202411300001\nRisk: CRITICAL\nAction: Assigned to Business Analysis team"
}
```

**Notification #2: To Assigned Analyst (Email + SMS)**
```json
{
  "case_id": "CHG202411300001",
  "event_type": "CASE_ASSIGNED",
  "recipient_user_id": "user_ba_001",
  "recipient_role": "BUSINESS_ANALYST",
  "notification_type": "EMAIL",
  "subject": "New Case Assigned: CHG202411300001",
  "message": "You have been assigned case CHG202411300001.\nCustomer: Ahmed Al-Mansouri\nRisk Rating: CRITICAL\nDue Date: 2024-11-30 13:45"
}
```

**Notification #3: To Manager (SMS - URGENT)**
```
SMS to Manager:
"⚠️ URGENT: New CRITICAL case CHG202411300001 assigned. Customer: Ahmed Al-Mansouri (PEP). High activity ratio. Immediate attention needed."
```

**Notification #4: Dashboard Update (Real-time WebSocket)**
```json
{
  "type": "CASE_CREATED",
  "case_id": "CHG202411300001",
  "risk_rating": "CRITICAL",
  "customer_name": "Ahmed Al-Mansouri",
  "assigned_to": "Fatima Ahmed",
  "timestamp": "2024-11-29 13:45:00"
}
```

**Notification Records Inserted:**
```sql
INSERT INTO notifications (
  notification_id, case_id, event_type, recipient_user_id,
  notification_type, notification_channel, notification_status,
  sent_at, read_at
) VALUES
  ('NOT001', 'CHG202411300001', 'CASE_CREATED', 'user_mgr_001', 'EMAIL', 'EMAIL', 'SENT', NOW(), NULL),
  ('NOT002', 'CHG202411300001', 'CASE_ASSIGNED', 'user_ba_001', 'EMAIL', 'EMAIL', 'SENT', NOW(), NULL),
  ('NOT003', 'CHG202411300001', 'CASE_CREATED', 'user_mgr_001', 'SMS', 'SMS', 'SENT', NOW(), NULL),
  ('NOT004', 'CHG202411300001', 'CASE_CREATED', 'ALL_DASHBOARD', 'DASHBOARD', 'WEBSOCKET', 'BROADCAST', NOW(), NULL);
```

**Status:**
```
✓ 4 Notifications sent
  ├─ Manager email: SENT
  ├─ Analyst email: SENT
  ├─ Manager SMS: SENT
  └─ Dashboard broadcast: LIVE
```

---

#### Step 7: Contact Center Request (edd_case_engine.js → contact_center_integration.js)

##### For CRITICAL risk, automatically request call:

```javascript
CONTACT_CENTER.createCallRequest(
  caseId: 'CHG202411300001',
  callDetails: {
    phone_number: '+974-5555-1234',
    call_type: 'VERIFICATION',
    purpose: 'Verify source of funds and business activity',
    schedule_immediate: true,
    required_action: 'VERIFY_SOURCE_OF_FUNDS'
  }
)
```

**Creates Interaction Record:**
```sql
INSERT INTO contact_center_interaction (
  interaction_id,           -- INT001
  case_id,                  -- CHG202411300001
  interaction_type,         -- 'OUTBOUND_CALL'
  interaction_subtype,      -- 'VERIFICATION'
  initiated_by,             -- 'SYSTEM'
  customer_phone,           -- '+974-5555-1234'
  call_purpose,             -- 'Verify source of funds'
  scheduled_at,             -- NOW() + 30 minutes
  interaction_status,       -- 'SCHEDULED'
  required_action,          -- 'VERIFY_SOURCE_OF_FUNDS'
  created_at                -- NOW()
);
```

**Status:**
```
✓ Outbound call scheduled
  Customer: Ahmed Al-Mansouri
  Phone: +974-5555-1234
  Scheduled: 30 minutes from submission
  Purpose: Source of Funds Verification
```

---

#### Step 8: API Returns Response to Frontend

```json
{
  "status": "SUCCESS",
  "kyc_id": "KYC202411300001",
  "case_id": "CHG202411300001",
  "edd_triggered": true,
  "risk_rating": "CRITICAL",
  "message": "Enhanced Due Diligence required. Assigned to Fatima Ahmed. You will be contacted shortly.",
  "timestamp": "2024-11-29T13:45:00Z"
}
```

---

#### Step 9: Frontend Displays Confirmation

**kyc_form.html shows:**
```
═════════════════════════════════════════════════════════════
            ✓ SUBMISSION SUCCESSFUL

Case ID: CHG202411300001
Status: Enhanced Due Diligence Case Created
Risk Rating: CRITICAL

⚠️ Your application requires Enhanced Due Diligence.

A dedicated case officer will contact you within 2 business days.
Based on the information provided, we need to verify:
  • Source of funds and business income
  • Politically exposed person status
  • Transaction patterns and expected activity

Next Steps:
  1. You will receive a call from our compliance team
  2. Prepare documentation (business license, bank statements)
  3. Respond to any document requests within 5 business days

Reference: CHG202411300001
═════════════════════════════════════════════════════════════
```

---

## 3. DATABASE SCHEMA INTEGRATION

### Core Tables (Interconnected)

```
kyc_applications (Original)
    ↓ 1:1
edd_cases (New)
    ├─→ 1:4 ─→ workflow_queue (New)
    │           └─→ (4 stages: BUSINESS, CDD, COMPLIANCE, DECISION)
    ├─→ 1:N ─→ case_risk_assessment (New)
    ├─→ 1:N ─→ notifications (New)
    ├─→ 1:N ─→ contact_center_interaction (New)
    └─→ 1:N ─→ change_management_workflow (New)
```

### Key Relationships

**PEP Matching:**
```sql
-- When pepStatus = 'YES' or 'RELATIVE_OF_PEP'
risk_rating = 'HIGH' | 'CRITICAL'

-- edd_cases.risk_rating matches case_risk_assessment.overall_risk_rating
```

**Activity Ratio:**
```sql
-- Calculated in case_risk_assessment
activity_ratio = expectedDeposits / monthlyIncome
IF activity_ratio > 1.2 THEN risk_score += 25
```

**Workflow Routing:**
```sql
-- edd_cases.case_id → workflow_queue (4 rows, one per stage)
-- Each row tracks:
--   • current_workflow_stage (BUSINESS, CDD, COMPLIANCE, DECISION)
--   • assigned_user (found by workflow_router)
--   • queue_status (PENDING, IN_PROGRESS, COMPLETED)
--   • due_date (calculated from SLA hours)
```

---

## 4. MODULE INTEGRATION POINTS

### A. kyc_form.html ↔ edd_case_engine.js

**Trigger:** User submits form
**Method:** `POST /api/v1/kyc/submit`
**Data Passed:** All 70+ KYC fields
**Result:** case_id returned

```javascript
// kyc_form.html
fetch('/api/v1/kyc/submit', {
    body: JSON.stringify({
        firstName, lastName, nationality, monthlyIncome, ...
    })
})
.then(response => response.json())
.then(data => {
    // Receive: case_id, kyc_id, edd_triggered, risk_rating
})
```

---

### B. edd_case_engine.js ↔ workflow_router.js

**Trigger:** Case created, needs routing
**Method:** `EDD_CASE_ENGINE.routeCase()` calls `WORKFLOW_ROUTER.findBestAssignee()`
**Data Passed:** role, stage
**Result:** user_id of best available person

```javascript
// edd_case_engine.js - routeCase() method
const assignee = await WORKFLOW_ROUTER.findBestAssignee('BUSINESS_ANALYST');
// Returns: { user_id, full_name, active_cases, workload_priority }
```

---

### C. edd_case_engine.js ↔ notification_engine.js

**Trigger:** Case event occurs (CREATED, ASSIGNED, ESCALATED)
**Method:** `EDD_CASE_ENGINE.sendNotifications()` calls `NOTIFICATION_ENGINE.sendNotification()`
**Data Passed:** event_type, case_id, recipient_role, message
**Result:** Notifications delivered via email/SMS/mobile/dashboard

```javascript
// edd_case_engine.js - sendNotifications() method
await NOTIFICATION_ENGINE.sendNotification({
    case_id: 'CHG202411300001',
    event_type: 'CASE_CREATED',
    recipient_role: 'MANAGER',
    notification_type: 'EMAIL'
});
```

---

### D. edd_case_engine.js ↔ contact_center_integration.js

**Trigger:** EDD triggered for CRITICAL risk case
**Method:** `EDD_CASE_ENGINE.requestContactCenterCall()` calls `CONTACT_CENTER.createCallRequest()`
**Data Passed:** case_id, phone, call_type
**Result:** Outbound call scheduled

```javascript
// edd_case_engine.js - requestContactCenterCall() method
await CONTACT_CENTER.createCallRequest(
    caseId,
    { call_type: 'VERIFICATION', schedule_immediate: true }
);
```

---

### E. notification_engine.js ↔ Database

**Trigger:** Notification event
**Method:** `NOTIFICATION_ENGINE.createNotificationRecord()`
**Data Passed:** case_id, event_type, recipient, status
**Result:** Audit trail of all communications

```sql
-- notifications table tracks:
-- ├─ Case ID (links to case)
-- ├─ Event type (CASE_CREATED, ASSIGNED, etc.)
-- ├─ Recipient (user_id or role)
-- ├─ Channels sent (EMAIL, SMS, MOBILE_PUSH, DASHBOARD)
-- ├─ Status (PENDING, SENT, FAILED, READ)
-- └─ Timestamps (sent_at, read_at)
```

---

## 5. SAMPLE WORKFLOWS

### Workflow A: Low-Risk Customer (Auto-Approval Path)

```
KYC Form Submission
  ├─ Risk Assessment: LOW (score 18)
  ├─ EDD Triggered: NO
  ├─ Case Created: CHG202411300002
  ├─ Status: APPROVED
  ├─ Notification: Email (approval notice)
  ├─ Contact Center: NO call needed
  └─ Result: Account opened immediately ✓
```

---

### Workflow B: Medium-Risk Customer (Standard EDD Path)

```
KYC Form Submission
  ├─ Risk Assessment: MEDIUM (score 35)
  ├─ EDD Triggered: YES
  ├─ Case Created: CHG202411300003
  ├─ Routed to: Business Analyst (Stage 1, 24h SLA)
  │   └─ Request: Bank statements, proof of employment
  ├─ Next Stage: CDD Officer (Stage 2, 24h SLA)
  │   └─ Task: Enhanced due diligence investigation
  ├─ Next Stage: Compliance (Stage 3, 24h SLA)
  │   └─ Task: Final AML/sanctions check
  ├─ Final Stage: Approver (Stage 4, 8h SLA)
  │   └─ Decision: APPROVED or REJECTED
  ├─ Contact Center: 1 verification call scheduled
  └─ Timeline: ~3 business days to decision
```

---

### Workflow C: High-Risk Customer (Escalation Path)

```
KYC Form Submission
  ├─ Risk Assessment: CRITICAL (score 82)
  ├─ EDD Triggered: YES
  ├─ Priority: URGENT
  ├─ Case Created: CHG202411300004
  ├─ Routed to: Business Analyst (Stage 1, 24h SLA)
  ├─ Escalation Flag: ESCALATED to Manager
  ├─ Contact Center: IMMEDIATE verification call + SMS alert
  ├─ Notifications: 
  │   ├─ Manager: Email + SMS (urgent alert)
  │   ├─ Compliance: Email (priority flag)
  │   └─ Approver: Email (awaiting early escalation)
  ├─ Required Documents: Full Extended Due Diligence
  │   ├─ Beneficial ownership disclosure
  │   ├─ Source of wealth documentation
  │   ├─ 3-year transaction history
  │   └─ Business registration & licenses
  └─ Timeline: Board approval required (5-7 business days)
```

---

## 6. INTEGRATION CHECKLIST

### Database Setup
- [ ] Deploy `extended_database_schema.sql` to PostgreSQL
- [ ] Create 8 new tables (edd_cases, workflow_queue, notifications, etc.)
- [ ] Create 4 views (BUSINESS_QUEUE, CDD_QUEUE, COMPLIANCE_QUEUE, MANAGER_DASHBOARD)
- [ ] Create triggers for automatic timestamps
- [ ] Load system configuration defaults

### Backend Deployment
- [ ] Deploy `edd_case_engine.js` (Node.js module)
- [ ] Deploy `workflow_router.js` (Node.js module)
- [ ] Deploy `notification_engine.js` (Node.js module)
- [ ] Deploy `contact_center_integration.js` (Node.js module)
- [ ] Deploy `kyc_api_routes.js` (Express routes)
- [ ] Configure email service (Nodemailer)
- [ ] Configure SMS service (Twilio/AWS SNS)
- [ ] Configure mobile push service (Firebase/APNs)

### Frontend Updates
- [ ] Update `kyc_form.html` to call `/api/v1/kyc/submit`
- [ ] Update form submission handler to send JSON data
- [ ] Add success/error response handling
- [ ] Display case_id and risk_rating in confirmation modal

### Integration Testing
- [ ] Test E2E: Form submission → Case creation → Notifications
- [ ] Test low-risk auto-approval path
- [ ] Test medium-risk standard EDD path
- [ ] Test high-risk escalation path
- [ ] Validate SLA calculations for all 4 workflow stages
- [ ] Verify notifications sent via all 4 channels
- [ ] Test workflow routing load balancing

### Operational Setup
- [ ] Create staff training materials
- [ ] Set up monitoring/alerting for SLA breaches
- [ ] Configure dashboard widgets
- [ ] Set up audit logging
- [ ] Create staff playbooks for each case type

---

## 7. API ENDPOINTS REFERENCE

### KYC Management
```
POST   /api/v1/kyc/submit                  Submit KYC form → create case
GET    /api/v1/kyc/{kyc_id}/status         Get KYC status
GET    /api/v1/kyc/{kyc_id}/case           Get EDD case details
POST   /api/v1/kyc/{kyc_id}/documents      Upload supporting documents
POST   /api/v1/kyc/{kyc_id}/document-response  Submit document response
```

### Case Management
```
GET    /api/v1/cases/{case_id}             Get case details
PUT    /api/v1/cases/{case_id}/status      Update case status
POST   /api/v1/cases/{case_id}/decision    Make final decision
GET    /api/v1/cases/{case_id}/history     Get case audit trail
```

### Workflow Management
```
GET    /api/v1/workflow/queue/{user_id}    Get user's case queue
PUT    /api/v1/workflow/queue/{queue_id}   Update queue entry
POST   /api/v1/workflow/{case_id}/escalate Escalate case
```

### Notifications
```
GET    /api/v1/notifications/{user_id}     Get user notifications
PUT    /api/v1/notifications/{notif_id}    Mark as read
```

---

## 8. PERFORMANCE CONSIDERATIONS

### Database Indexes
- PK: case_id, workflow_queue_id, notification_id
- FK: kyc_id, customer_id, user_id, case_id
- Search: assigned_user, queue_status, case_status, created_at
- Aggregate: (case_status, created_at) for dashboard metrics

### Query Optimization
- Workflow queue queries: < 100ms
- Availability search: < 50ms
- Notification delivery: async (non-blocking)
- Dashboard metrics: cached (1-hour refresh)

### Scalability
- Handles 100+ cases/hour
- Supports 50+ concurrent users
- WebSocket connections: 100+
- Notification queue: 1000+ messages/hour

---

## 9. NEXT STEPS

### Immediate (Week 1)
1. Deploy extended database schema
2. Deploy backend modules (edd_case_engine, etc.)
3. Update kyc_form.html integration
4. Run end-to-end tests

### Short-term (Week 2-3)
1. Create operational dashboards
2. Set up staff training
3. Configure real email/SMS services
4. Go-live with pilot group (10 customers)

### Medium-term (Week 4-6)
1. Expand to full production (all customers)
2. Integrate with contact center system
3. Set up real-time monitoring
4. Deploy change management workflow (Arslan's team)

### Long-term
1. Machine learning for risk scoring
2. Biometric integration for verification
3. Real-time transaction monitoring
4. Blockchain audit trail

---

**Status:** ✅ INTEGRATION LAYER COMPLETE
**Ready for:** Backend deployment + quality assurance

