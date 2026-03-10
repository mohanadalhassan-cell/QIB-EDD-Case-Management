# Call Center Workflow Specification
## QIB EDD Case Management System — Complete Call Center Integration

**Organization**: Qatar Islamic Bank  
**System**: Enhanced Due Diligence (EDD) Case Management  
**Module**: Call Center Workflow & Customer Contact Requests  
**Version**: 2.0  
**Date**: March 10, 2026  
**Status**: Production

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Workflow Architecture](#workflow-architecture)
3. [Request Submission Process](#request-submission-process)
4. [Supervisor Assignment & SLA Management](#supervisor-assignment--sla-management)
5. [Call Center Operations](#call-center-operations)
6. [Data Security & Access Control](#data-security--access-control)
7. [Audit Trail & Compliance](#audit-trail--compliance)
8. [Integration Points](#integration-points)
9. [User Roles & Permissions](#user-roles--permissions)

---

## Overview

The Call Center Workflow enables **branch and operational teams** to request customer contact for verification, documentation, and dispute resolution purposes. The system automatically routes requests to the Call Center Supervisor, who assigns staff and manages Service Level Agreements (SLAs).

### Key Features

✅ **Automated Request Routing**  
- Branches/Operations submit customer contact requests via EDD Case interface  
- System automatically sends email notifications to Call Center Supervisor  
- Supervisor accesses request queue from Call Center Dashboard  

✅ **Staff Assignment by Employee ID**  
- Supervisor assigns Call Center agent by entering employee ID  
- System creates assignment record with automatic timestamp  
- Agent receives assignment notification  

✅ **SLA Management via Access Control**  
- Supervisor sets SLA parameters (response time, call duration targets)  
- System monitors compliance and alerts on breach conditions  
- Real-time SLA tracking in Call Center Queue dashboard  

✅ **Recorded Call Security**  
- All calls recorded with encrypted reference numbers  
- Recording metadata stored in case audit trail  
- Compliant with QCB banking supervision requirements  

✅ **Role-Based Data Access**  
- Call Center staff see ONLY necessary information  
- AML scores, risk flags, compliance notes hidden from Call Center  
- Regulatory compliance (FATF Rec 10 & 11, Basel BCBS 239)  

---

## Workflow Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CALL CENTER WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────┘

STEP 1: REQUEST SUBMISSION (by Branch/Operation/CDD)
  │
  ├─ Open EDD Case
  ├─ Click "Customer Contact Request" button
  ├─ Select request reason (Verification/Documentation/Confirmation)
  ├─ Submit request
  ┌─ System validates permission & role
  └─ Request created in case record
     
STEP 2: AUTOMATIC EMAIL NOTIFICATION
  │
  ├─ System identifies Call Center Supervisor
  ├─ Sends email alert with:
  │  ├─ Case ID
  │  ├─ Customer Name
  │  ├─ Request Reason
  │  ├─ Priority Level
  │  └─ Direct link to Request Queue
  └─ Email logged in audit trail
     
STEP 3: SUPERVISOR DASHBORD ACCESS
  │
  ├─ Supervisor logs in to Call Center Dashboard
  ├─ Views pending request queue
  ├─ Sees customer details and requirement
  ├─ Reviews request priority
  └─ Prepares for staff assignment
     
STEP 4: STAFF ASSIGNMENT BY EMPLOYEE ID
  │
  ├─ Supervisor enters Call Center agent's Employee ID
  ├─ System validates employee existence & active status
  ├─ Creates assignment record
  ├─ Sets assignment timestamp
  ├─ Logs action in audit trail
  └─ Agent receives assignment notification
     
STEP 5: SLA MANAGEMENT & CONFIGURATION
  │
  ├─ Supervisor accesses ACCESS CONTROL settings
  ├─ Configures SLA parameters:
  │  ├─ Response time target (e.g., 24 hours)
  │  ├─ Call duration targets
  │  ├─ Completion deadline
  │  └─ Escalation thresholds
  ├─ System activates SLA timer
  └─ Dashboard begins monitoring compliance
     
STEP 6: CALL CENTER AGENT EXECUTION
  │
  ├─ Agent receives assignment
  ├─ Accesses call details (restricted view)
  ├─ Contacts customer
  ├─ Records call (encrypted reference created)
  ├─ Captures customer statement/response
  ├─ Updates call notes
  └─ Marks call complete
     
STEP 7: SLA MONITORING & ALERTS
  │
  ├─ System continuously monitors SLA status
  ├─ If SLA threatened (75% time used):
  │  ├─ Alert sent to supervisor
  │  └─ Dashboard highlights case
  ├─ If SLA breached:
  │  ├─ Red flag on dashboard
  │  ├─ Escalation email sent
  │  └─ Case marked for review
  └─ Historic SLA data stored
     
STEP 8: COMPLETION & AUDIT LOGGING
  │
  ├─ Agent completes call
  ├─ System records:
  │  ├─ Call duration
  │  ├─ Recording reference
  │  ├─ Statement captured
  │  └─ Timestamp
  ├─ Case status updated
  └─ Complete audit trail generated
```

---

## Request Submission Process

### Who Can Submit Requests?

- **CDD Analysts** — When additional verification needed
- **Compliance Officers** — For regulatory inquiries  
- **Branch Managers** — Customer representative requests
- **Operations Teams** — Account queries

### How to Submit a Request

**Via EDD Case Interface:**

1. Open specific EDD Case (`edd_case.html?case_id=EDD-2026-XXXXXX`)
2. Locate "Customer Contact Request" button in the header toolbar
3. Click to open request form modal
4. Complete the following fields:

   | Field | Description | Required |
   |-------|-------------|----------|
   | Request Type | Select from: Verification, Documentation, Confirmation, Dispute | ✅ |
   | Reason | Free text explaining why contact needed | ✅ |
   | Call Notes | Initial notes/context for call agent | ⭕ |
   | Preferred Language | EN or AR | ✅ |
   | Scheduled Date | When customer should be called | ⭕ |

5. Click "Submit Request"
6. System validates submission

### Request Status Flow (CDD Only)

CDD requests follow **approval workflow**:

```
Submitted → Awaiting Approval → In Queue → In Progress → Completed
                    ↓
            (CDD Supervisor Reviews)
                    ↓
             Approved or Rejected
```

**Non-CDD requests** go directly to queue:

```
Submitted → In Queue → In Progress → Completed
```

### Email Notification Example

**Subject**: New Customer Contact Request — Case EDD-2026-001234  
**To**: CallCenter.supervisor@qib.com.qa

```
────────────────────────────────────────────────────────
URGENT: Customer Contact Request

Case ID: EDD-2026-001234
Customer: Abdullah Mohammed Al-Kuwari
Request Reason: PEP Status Verification
Priority: HIGH
Submitted By: Fatima Al-Mansoor (CDD)
Submitted Date: March 10, 2026, 14:30 UTC+3

ACTION REQUIRED:
1. Review request in Call Center Dashboard
2. Assign Call Center Agent by Employee ID
3. Configure SLA parameters
4. Monitor call progress

────────────────────────────────────────────────────────
```

---

## Supervisor Assignment & SLA Management

### Staff Assignment by Employee ID

**Access**: Call Center Supervisor only  
**Location**: Call Center Queue Dashboard → Pending Requests

**Assignment Process:**

1. Click "Assign Staff" button on pending request
2. Enter Call Center agent's **Employee ID** (e.g., EMP008, EMP009)
3. System validates:
   - ✅ Employee exists in system
   - ✅ Employee has Active status
   - ✅ Employee has Call Center role
4. If valid → Assignment created
5. If invalid → Error message displayed

**Assignment Record Created:**

```javascript
{
  assignedAgent: "EMP008",
  agentName: "Layla Al-Karmi",
  agentDepartment: "Call Center Operations",
  assignedDate: "2026-03-10T14:32:00Z",
  assignmentStatus: "Active"
}
```

### SLA Management via ACCESS CONTROL

**Access**: Call Center Supervisor → ACCESS CONTROL Settings

**SLA Configuration:**

| Parameter | Description | Default |
|-----------|-------------|---------|
| **Response Time** | Hours to first call attempt | 24 hours |
| **Call Duration** | Expected call length in minutes | 15 min |
| **Completion Deadline** | Total hours to complete call | 48 hours |
| **Escalation Factor** | % of SLA used before alert (e.g., 75%) | 75% |
| **Auto-Escalate** | Automatically escalate if breached | Yes/No |

**SLA Lifecycle:**

```
Request Created
    ↓
[SLA Timer Started]
    ↓ (0h)
Assignment → Agent Notified
    ↓
[Agent has X hours to respond]
    ↓ (12h - if 24h response SLA)
Alert: SLA 50% Used (Optional)
    ↓ (18h - 75% of 24h)
Alert: SLA APPROACHING BREACH
    ↓ (24h - Breach Time)
🚨 ALERT: SLA BREACHED
    ↓
[Auto-Escalation triggers if configured]
Supervisor notified
    ↓
[Continue monitoring until completion]
```

**SLA Status Display:**

```
Status Display Colors:
🟢 GREEN   — Within SLA (< 50% time used)
🟡 YELLOW  — Caution (50-75% time used)
🟠 ORANGE  — Critical (75-100% time used)
🔴 RED     — BREACHED (> 100% time used)
```

---

## Call Center Operations

### Call Center Agent Interface

**Restricted Access (Call Center Staff):**

Call Center agents see a **filtered view** for data security:

✅ **VISIBLE to Call Center:**
- Customer name & RIM number
- Contact phone & email
- Request type & reason
- Call scheduled date
- Customer statement field
- Call notes area
- Recording reference input
- Call duration tracking

❌ **HIDDEN from Call Center:**
- Risk scores & ratings
- AML/CTF flags
- Compliance notes
- Investigation status
- CDD decision documents
- Any sensitive assessment

### Making a Customer Contact Call

**Workflow:**

1. **Receive Assignment**
   - Agent logs into dashboard
   - Displays assigned calls queue
   - Opens call detail

2. **Prepare Call**
   - Review customer information
   - Note request reason
   - Understand what needs to be asked

3. **Execute Call**
   - Dial customer
   - Record call (external system)
   - Explain purpose to customer
   - Ask required questions
   - Document customer responses
   - Get customer acknowledgment (if needed)

4. **Document Statement**
   - Enter customer statement in system
   - Statement type: Oral/Written/Email
   - Language: EN/AR
   - Include relevant quotes

5. **Store Recording Reference**
   - Get recording reference # from system
   - Enter reference in "Recording Reference" field
   - Reference format: CR-YYYYMMDD-XXXXXX

6. **Complete Call Record**
   - Enter call duration (minutes)
   - Add any additional notes
   - Mark call as "Complete"
   - Submit

### Example Call Workflow

```
Agent: "Good afternoon, is this Abdullah Al-Kuwari?"

Customer: "Yes, how can I help?"

Agent: "I'm calling from Qatar Islamic Bank's compliance team. 
We need to verify some information about your account. 
Is now a good time to talk?"

Customer: "Yes, go ahead."

Agent: [Asks verification questions]
       [Documents responses]
       [Confirms information]
       [Records statement]

Agent: "Thank you for your time. We appreciate your cooperation."

System: [Stores call recording CR-20260310-AB7X9K]
        [Logs statement in case audit trail]
        [Updates case workflow]
        [Marks SLA complete]
```

---

## Data Security & Access Control

### Role-Based Access Matrix

| Role | Can See | Can Do |
|------|---------|--------|
| **Call Center Agent** | Customer name, contact info, request reason | Execute calls, record statements, update notes |
| **Call Center Supervisor** | All call data, SLA metrics, performance | Assign staff, configure SLA, escalate requests |
| **CDD Analyst** | Request status, completion notes | Create requests, approve (if CDD), view progress |
| **Compliance** | All case data including risk | Review calls, access audit trail |
| **Management** | Analytics, SLA metrics, audit logs | Override assignments, view reports |

### Data Encryption & Security

- ✅ **Recording References**: Encrypted storage via external call recording system
- ✅ **Customer Statements**: Encrypted at rest in sessionStorage
- ✅ **Audit Trail**: Immutable event logs with tamper detection
- ✅ **Communications**: Email notifications via secure SMTP
- ✅ **Access Logs**: All user actions timestamped and logged

### Regulatory Compliance

- **FATF Rec 10** — Customer due diligence (verified contact)
- **FATF Rec 11** — Record-keeping (calls and statements documented)
- **FATF Rec 1** — Risk-based approach (priority cases escalated)
- **Basel BCBS 239** — AML governance (audit trails, SLA compliance)
- **QCB AML Guidelines** — Verification of beneficial ownership (calls)

---

## Audit Trail & Compliance

### Audit Logging

Every action in Call Center Workflow is logged:

```javascript
auditLog: [
  {
    action: "REQUEST_CREATED",
    performedBy: "EMP002",
    performedByName: "Fatima Al-Mansoor",
    timestamp: "2026-03-10T14:15:00Z",
    details: "Contact request created by Fatima Al-Mansoor (CDD)"
  },
  {
    action: "REQUEST_APPROVED",
    performedBy: "EMP002-SUP",
    performedByName: "Ghaleb Essam",
    timestamp: "2026-03-10T14:20:00Z",
    details: "Request approved by Ghaleb Essam. Ready for queue."
  },
  {
    action: "ASSIGNED_TO_AGENT",
    performedBy: "EMP010",
    performedByName: "Samira Al-Shammari",
    timestamp: "2026-03-10T14:25:00Z",
    details: "Assigned to EMP008 (Layla Al-Karmi) at 14:25 UTC+3"
  },
  {
    action: "SLA_CONFIGURED",
    performedBy: "EMP010",
    performedByName: "Samira Al-Shammari",
    timestamp: "2026-03-10T14:26:00Z",
    details: "SLA set: 24h response, 48h completion, 75% escalation threshold"
  },
  {
    action: "CALL_COMPLETED",
    performedBy: "EMP008",
    performedByName: "Layla Al-Karmi",
    timestamp: "2026-03-10T15:45:00Z",
    details: "Call completed. Duration: 12 minutes. Recording: CR-20260310-AB7X9K"
  }
]
```

### Compliance Reports

System generates automated reports:

- **SLA Compliance** — % of calls within SLA targets
- **Response Time Analytics** — Average response times
- **Agent Performance** — Calls per agent, quality metrics
- **Call Volume** — Time-series of requests by hour/day
- **Regulatory Audit Trail** — Complete log for QCB inspection

---

## Integration Points

### EDD Case System Integration

When customer contact request created:

1. Request stored in case object: `case.callRequests[]`
2. Case status updated if needed
3. Notification email sent immediately
4. Request appears in Call Center Dashboard
5. SLA timer begins

### Call Center Queue Dashboard Integration

The `call_center_queue.html` page displays:

- **Pending Requests** — Awaiting assignment
- **In Progress** — Assigned to agents
- **Completed** — Ready for review
- **SLA Metrics** — Real-time compliance data
- **Agent Performance** — Staff statistics

### Email Notification Integration

When request submitted:
- To: Call Center Supervisor email
- CC: Department Manager (optional)
- includes: Case ID, customer name, request reason, priority, link to queue

---

## User Roles & Permissions

### Call Center Staff (EMP008, EMP009)

**Permissions:**
- ✅ View assigned calls only
- ✅ Execute calls (dial customer, record)
- ✅ Document statements
- ✅ Update call notes
- ✅ Mark calls complete
- ❌ Cannot assign requests
- ❌ Cannot configure SLA
- ❌ Cannot see risk/AML data

**Access**: Call Center Dashboard (read-only queue view)

### Call Center Supervisor (EMP010)

**Permissions:**
- ✅ View all pending requests
- ✅ Assign requests by employee ID
- ✅ Configure SLA parameters
- ✅ View all call history
- ✅ Monitor SLA compliance
- ✅ Escalate breached requests
- ✅ Generate performance reports
- ✅ Access supervision reports

**Access**: Call Center Dashboard (full admin view)

### CDD Analyst (EMP002)

**Permissions:**
- ✅ Create customer contact requests
- ✅ View request status
- ✅ Receive approval response
- ✅ Access completed call summary (not recording)
- ❌ Cannot assign staff
- ❌ Cannot configure SLA
- ❌ Cannot view other team's requests

**Access**: EDD Case interface via "Contact Request" button

### CDD Supervisor (EMP002-SUP)

**Permissions:**
- ✅ Create requests
- ✅ Approve/Reject CDD requests
- ✅ View all CDD requests
- ✅ Override assignments
- ✅ Escalate to compliance

**Access**: Call Center Dashboard (supervisory view)

### Compliance Officers (EMP003)

**Permissions:**
- ✅ View all call records
- ✅ Access recordings (if needed for investigation)
- ✅ Review audit trails
- ✅ See SLA compliance reports
- ✅ Escalate concerns

**Access**: Compliance view dashboard

---

## Technical Implementation

### File Structure

```
c:\Users\mohan\EDD_QIB\edd_system\

├── js/
│   ├── call_request.js          ← CallRequestManager class
│   ├── mock_data.js              ← User data, case data
│   ├── cdd_view.js               ← CDD dashboard
│   └── notifications_center.js    ← Email notifications
│
├── edd_case.html                 ← Case detail with Contact Request button
├── cdd_view.html                 ← CDD Operations Dashboard
├── call_center_queue.html         ← Call Center Queue Dashboard
│
└── css/
    └── edd_system.css            ← Styling
```

### Key Classes & Methods

**CallRequestManager**:
- `createContactRequest(caseId, requestData)` — Submit new request
- `approveCDDRequest(requestId, notes)` — CDD supervisor approval
- `assignToAgent(requestId, agentId)` — Assign by employee ID
- `configureSLA(requestId, slaParams)` — Set SLA parameters
- `completeCall(requestId, callData)` — Mark call complete
- `getCallQueue()` — Fetch for Call Center agent
- `restrictCallCenterView(request)` — Security filtering

---

## Testing Checklist

- [ ] Request submission by CDD analyst
- [ ] Email notification to supervisor
- [ ] Supervisor receives alert
- [ ] Assignment by employee ID (valid + invalid)
- [ ] SLA timer activation
- [ ] SLA alert at 75% threshold
- [ ] SLA breach alert
- [ ] Call completion & recording reference
- [ ] Data not visible to Call Center (risk/AML)
- [ ] Complete audit trail generated
- [ ] SLA compliance report accurate

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-20 | Initial Call Center role definition (generic) |
| 2.0 | 2026-03-10 | Full workflow documentation with actual implementation details |

---

## Contact & Support

**System Owner**: Qatar Islamic Bank — Compliance Department  
**Technical Lead**: Digital Governance Team  
**For Issues**: Support@QIB.EDD.System

---

**Document Classification**: Internal Use — QIB Confidential  
**Last Updated**: March 10, 2026  
**Next Review**: June 10, 2026
