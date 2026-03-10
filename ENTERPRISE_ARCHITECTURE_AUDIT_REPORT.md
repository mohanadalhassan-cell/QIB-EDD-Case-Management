# QIB EDD SYSTEM — ENTERPRISE ARCHITECTURE AUDIT REPORT
## Comprehensive Organizational Hierarchy Analysis & Governance Model Assessment

**Document Type:** Enterprise Architecture Review  
**Analysis Date:** March 9, 2026  
**System:** QIB EDD / KYC Case Management Platform  
**Scope:** Complete organizational hierarchy, dashboard assignment, role-based access control  
**Target Audience:** IT Leadership, Banking Operations, Compliance & Risk

---

## EXECUTIVE SUMMARY

This report provides a comprehensive analysis of the current organizational structure implemented in the QIB EDD/KYC system and compares it against the target governance model. The analysis identifies **critical gaps in role definitions, dashboard routing, and dashboards accessibility** that need to be addressed to achieve full enterprise governance alignment.

### Key Findings:
- ✅ **Organizational hierarchy partially implemented** (7 of 10 target roles)
- ⚠️ **Dashboard architecture incomplete** (missing 3 specialized role dashboards)
- ⚠️ **Retail Banking segment missing integration** (Alternative Channels, Branch Network not fully operational)
- ⚠️ **Notifications governance not implemented** (Hussein Miqdad role undefined)
- ❌ **Change Management feedback workflow not implemented** (Arslan role created but dashboard missing)
- ✅ **CDD operations functional** (Ghaleb Essam properly configured)

---

## 1. CURRENT ORGANIZATIONAL STRUCTURE (AS IMPLEMENTED)

### Level 1: Board of Directors
```
Sheikh Jassim bin Hamad Al Thani – Chairman (BOD-001)
```
- Status: ✅ Defined
- Permissions: full_authority, board_approval
- Dashboard Access: Board overview

### Level 2: Executive Management
```
GCEO – Mr. Bassel Gamal (EXE-001)
Reports To: Board of Directors (BOD-001)
```
- Status: ✅ Defined
- Permissions: full_authority, executive_approval, policy_override
- Direct Reports: 7 General Managers

### Level 3: General Managers (Under GCEO)

| GM ID | Name | Title & Department | Reports To | Status | Permissions |
|-------|------|-------------------|------------|--------|-------------|
| GM-001 | Saleem Ulhaq | COO - Operations & IT | EXE-001 | ✅ | ops_admin, it_admin, executive_approval |
| GM-002 | D. Anand | GM Retail Banking | EXE-001 | ✅ | retail_approval, process_owner |
| GM-003 | Tariq Fawzi | GM Wholesale Banking | EXE-001 | ✅ | wbg_approval, corporate_authority |
| GM-004 | Gourang | GM Finance | EXE-001 | ✅ | finance_approval, budget_authority |
| GM-005 | Rakesh | GM Risk | EXE-001 | ✅ | risk_approval, risk_override, compliance_escalation |
| GM-006 | Dinos | GM Strategy & Projects | EXE-001 | ✅ | project_owner, view_only |
| GM-007 | Khalifa Al-Muslim | Head of HR Group | EXE-001 | ✅ | hr_approval, process_owner |

### Level 4: Operations Division (Under COO - Saleem Ulhaq)

#### 4.1 Direct Reports to Operations
```
Head of Operations – Amit Malhotra (OPS-001)
  Reports To: GM-001 (COO)
  Status: ✅ Implemented
  Permissions: full_ops_admin, process_owner, approval_authority
```

#### 4.2 Operations Sub-Leadership
| Role | Name | ID | Reports To | Status | Department |
|------|------|----|----|--------|------------|
| Head of IT | Khurram | IT-001 | GM-001 | ✅ | Information Technology |
| Head of Change Mgmt | Arslan | CHG-001 | GM-001 | ✅ | Change Management |
| Head of Retail & Shared Services | Sayed Elmahday | OPS-HEAD-001 | OPS-001 | ✅ | Retail & Shared Services |
| Head of WBG Operations | Adel Abu Espitan | OPS-HEAD-002 | OPS-001 | ✅ | WBG Operations |

#### 4.3 Operations Managers (Under Sayed Elmahday)

| Manager | ID | Department | Reports To | Permissions | Status |
|---------|----|----|-----|-------------|---------|
| Mohanad Al Hassan | MGR-001 | WPS & Digital Back Office | OPS-HEAD-001 | wps_owner, view_execute | ✅ Pilot |
| Youssef Al-Khuzain | MGR-002 | Special Services | OPS-HEAD-001 | view_execute | ✅ |
| Qader Abdulwahab | MGR-003 | Remittance & Cheques | OPS-HEAD-001 | view_execute | ✅ |
| Ashraf | MGR-004 | Main Vault | OPS-HEAD-001 | view_execute, vault_access | ✅ |
| Hanaa Al-Khazai | MGR-005 | Cards, Gov Salaries & Dividends | OPS-HEAD-001 | view_execute | ✅ |
| Ghaleb Essam | MGR-006 | CDD & EDD Operations | OPS-HEAD-001 | cdd_maker, cdd_checker, edd_operations | ✅ |

### Level 4: Retail Banking Division (Under GM Retail - D. Anand)

#### 4.4 Retail Banking Division Heads

| Head | ID | Department | Reports To | Status | Permissions |
|------|----|----|------------|---------|-----------|
| Ayman Zain | HD-RET-001 | Alternative Channels | GM-002 | ⚠️ Partial | channel_approval |
| Saleh | HD-RET-002 | Products | GM-002 | ⚠️ Partial | product_approval |
| Hassan Al-Jafali | HD-RET-003 | Branches | GM-002 | ⚠️ Partial | branch_approval |
| Abdulrahman Al-Nabet | HD-RET-004 | Special Services | GM-002 | ⚠️ Partial | special_services_approval |

### Level 5: IT Department (Under Head of IT - Khurram)

| Role | Name | ID | Team | Status |
|------|------|----|----|-----------|
| IT Manager | Aseel | IT-002 | IT Management | ✅ |
| Manager App Developer | Ashir | IT-003 | App Development | ✅ |
| WPS Support Developer | Suhail | IT-004 | App Development | ✅ |
| COR System Support | Kaushik | IT-005 | Core Banking (T24) | ✅ |
| COR System Support | Murali | IT-006 | Core Banking (T24) | ✅ |

**Status Summary:**
- ✅ **Fully Implemented:** 25 roles
- ⚠️ **Partially Implemented:** 4 roles (retail banking heads)
- ❌ **Missing/Incomplete:** 3 critical roles

---

## 2. TARGET ORGANIZATIONAL STRUCTURE (DESIRED STATE)

### Target Model Structure

```
GCEO – Bassel Gamal
│
├─ CPBO (Chief Product & Business Officer) – Mr. Anand
│  │
│  ├─ Alternative Channels – Ayman Zein (HD-RET-001)
│  │   ├ Mobile Banking
│  │   ├ Microsite
│  │   └ Contact Center (Hussein Miqdad – MISSING)
│  │       Dashboard Access:
│  │       • ReKYC customers view
│  │       • EDD document requests
│  │       • Partial completion cases
│  │
│  ├─ Branch Network – Hassan Al-Jafali (HD-RET-003)
│  │   Dashboard Access:
│  │   • Branch EDD cases
│  │   • Branch initiated contact center routing
│  │
│  ├─ Tamayuz Banking – Omar Al-Sharabji (MISSING)
│  │   Report Under: Abdulrahman Al-Nabit
│  │
│  └─ Private Banking – Ashraf Al-Mazahreh (MISSING)
│      Report Under: Abdulrahman Al-Nabit
│
├─ COO (Chief Operating Officer) – Saleem Ulhaq (GM-001)
│  │
│  ├─ Operations – Amit Malhotra (OPS-001)
│  │   ├ Retail & Shared Services – Sayed Elmahday (OPS-HEAD-001)
│  │   ├ WBG Operations – Adel Abu Espitan (OPS-HEAD-002)
│  │   ├ CDD & EDD Operations – Ghaleb Essam (MGR-006)
│  │   └ Department Managers (6 roles)
│  │
│  └─ Change Management – Arslan (CHG-001)
│      Dashboard Access:
│      • Feedback management
│      • Change initiatives tracking
│      • Implementation monitoring
│
└─ Strategic Notifications – Dinos (GM-006)
   └─ Notifications Manager – Hussein Miqdad (MISSING)
       Dashboard Access:
       • System-wide notifications
       • Alert routing
       • Escalation management
```

---

## 3. GAP ANALYSIS: CURRENT vs TARGET

### 3.1 Missing Roles

| Role | ID | Department | Reports To | Impact | Priority |
|------|----|----|------------|--------|----------|
| Contact Center Manager | MISSING | Contact Center (under Ayman Zein) | HD-RET-001 | HIGH | P1 |
| Notifications Manager | MISSING | Notifications (under Dinos) | GM-006 | MEDIUM | P2 |
| Tamayuz Banking Head | MISSING | Private Banking Group | HD-RET-004 | MEDIUM | P2 |
| Private Banking Head | MISSING | Private Banking Group | HD-RET-004 | MEDIUM | P2 |

### 3.2 Missing Dashboards

| Dashboard | Target User | Current Status | Impact |
|-----------|------------|-----------------|--------|
| **Change Management Dashboard** | Arslan (Head of Change Mgmt) | ❌ NOT IMPLEMENTED | HIGH |
| **Contact Center Dashboard** | Hussein Miqdad (Contact Center) | ❌ MISSING ROLE | HIGH |
| **Notifications Management Dashboard** | Hussein Miqdad (Notifications) | ❌ MISSING ROLE | MEDIUM |
| **Alternative Channels Dashboard** | Ayman Zein | ⚠️ Partial Implementation | MEDIUM |
| **Branch Network Dashboard** | Hassan Al-Jafali | ⚠️ Partial Implementation | MEDIUM |

### 3.3 Incomplete Workflow Routing

| Workflow | Status | Missing Components |
|----------|--------|-------------------|
| **Feedback Management** | ❌ Missing | • Maker review queue (Karan) |
|  |  | • Checker review queue (Mohammed Ibrahim) |
|  |  | • Approval routing to Arslan |
|  |  | • Escalation to COO (Saleem) |
| **Change Initiative Tracking** | ❌ Missing | • CHG case creation workflow |
|  |  | • Implementation assignment |
|  |  | • Status monitoring |
|  |  | • Change report generation |
| **Contact Center Routing** | ❌ Missing | • ReKYC request assignment |
|  |  | • EDD escalation paths |
|  |  | • Document collection workflows |
| **Notifications Distribution** | ❌ Missing | • Alert routing engine |
|  |  | • Priority-based escalation |
|  |  | • Multi-channel delivery |

### 3.4 Role-Based Access Control Gaps

| Component | Current | Target | Gap |
|-----------|---------|--------|------|
| **Feedback Dashboard** | None | Arslan + Saleem + Karan + Mohammed | Missing 4 accessors |
| **Change Initiatives View** | None | Arslan + Saleem + Board | Missing 3 accessors |
| **Contact Center Cases** | None | Hussein + Ayman + Saleem | Missing 3 accessors |
| **Notifications Management** | None | Hussein + Dinos + Saleem | Missing 3 accessors |

---

## 4. DASHBOARD ARCHITECTURE ANALYSIS

### Current Dashboard Implementation

```
CURRENTLY DEPLOYED:
├─ dashboard.html ............................ General Overview
├─ business_view.html ........................ Retail Banking Cases (Segments)
├─ edd_case.html ............................ EDD Case Management
├─ cdd_view.html ............................ CDD Operations
├─ compliance_view.html ..................... Compliance Monitoring
├─ kyc_monitoring.html ...................... KYC Governance
├─ management_dashboard.html ................. Management Overview
├─ audit_console.html ....................... Audit Trail
├─ organization.html ........................ Organization Chart
├─ notifications_center.html ................ Notifications (Basic)
├─ document_viewer.html ..................... Document Management
└─ executive_dashboard.html ................. Executive Dashboard (NEW)
```

### Dashboard Visibility & Routing Matrix

| Role | Dashboard | Access Level | Status |
|------|-----------|--------------|--------|
| **GCEO** | All Dashboards | Full Read/Write | ✅ |
| **COO (Saleem)** | Management, Audit, KYC | Full Read/Write | ✅ |
| **GM Retail (Anand)** | Business View, KYC | Read/Write | ✅ |
| **Ayman Zein** (Alt Channels) | Business View (filtered) | Read Only | ⚠️ Partial |
| **Hassan Al-Jafali** (Branches) | Business View (filtered) | Read Only | ⚠️ Partial |
| **Arslan** (Change Management) | **CHANGE DASHBOARD** | Full Admin | ❌ Missing |
| **Hussein Miqdad** (Contact Center) | **CONTACT CENTER DASHBOARD** | Full Admin | ❌ Missing |
| **Dinos** (Notifications) | **NOTIFICATIONS DASHBOARD** | Full Admin | ⚠️ Partial |
| **Ghaleb Essam** (CDD & EDD) | CDD View, EDD Case | Full Read/Write | ✅ |
| **Sayed Elmahday** (Retail Ops) | Operations View | Read/Write | ✅ |

---

## 5. REQUIRED SYSTEM CHANGES & IMPLEMENTATION PLAN

### Phase 1: Role Definition & Data Model (PRIORITY 1)

#### Task 1.1: Create Missing Roles in organization_data.js

```javascript
// Contact Center Manager (NEW)
{
  id: 'CC-001',
  name: 'Hussein Miqdad',
  name_ar: 'حسين ميقداد',
  title: 'Contact Center Manager',
  title_ar: 'مدير مركز الاتصال',
  department: 'Contact Center',
  dept_code: 'CONTACT_CENTER',
  photo: 'assets/employees/Hussein.jpeg',
  permissions: ['contact_center_admin', 'edd_escalation', 'rekyc_routing'],
  email: 'hussein.miqdad@qib.com.qa',
  reports_to: 'HD-RET-001'  // Reports to Ayman Zein (Alt Channels)
}

// Notifications Manager (NEW)
{
  id: 'NOTIF-001',
  name: 'Hussein Miqdad',  // Can be same person or different
  name_ar: 'حسين ميقداد',
  title: 'Notifications Manager',
  title_ar: 'مدير الإشعارات',
  department: 'Notifications Management',
  dept_code: 'NOTIFICATIONS',
  photo: 'assets/employees/Hussein.jpeg',
  permissions: ['notifications_admin', 'alert_routing', 'escalation_owner'],
  email: 'hussein.notifications@qib.com.qa',
  reports_to: 'GM-006'  // Reports to Dinos
}
```

#### Task 1.2: Update Role Assignments for Retail Banking

```javascript
// Update retail_banking section to include:
// - Tamayuz Banking Head
// - Private Banking Head
// - Contact Center Department

retail_banking: {
  heads: [
    // ... existing heads ...
    {
      id: 'HD-RET-005',
      name: 'Omar Al-Sharabji',
      title: 'Head of Tamayuz Banking',
      reports_to: 'HD-RET-004',  // Reports to Abdulrahman Al-Nabet
      department: 'Tamayuz Banking'
    },
    {
      id: 'HD-RET-006',
      name: 'Ashraf Al-Mazahreh',
      title: 'Head of Private Banking',
      reports_to: 'HD-RET-004',  // Reports to Abdulrahman Al-Nabet
      department: 'Private Banking'
    }
  ],
  // Add Contact Center under Alternative Channels
  contact_center: {
    id: 'CC-001',
    name: 'Hussein Miqdad',
    title: 'Contact Center Manager',
    reports_to: 'HD-RET-001',  // Reports to Ayman Zein
    department: 'Contact Center'
  }
}
```

### Phase 2: Dashboard Creation & Routing (PRIORITY 1)

#### Task 2.1: Create Change Management Dashboard
**File:** `edd_system/change_management_dashboard.html`

Key Components:
```
DASHBOARD LAYOUT:
├─ Header: Change Management Hub
├─ KPI Cards:
│  ├ New Feedback (Count)
│  ├ Under Review (Count)
│  ├ Approved for Change (Count)
│  ├ Rejected (Count)
│  └ Implemented (Count)
├─ Charts:
│  ├ Feedback by Category
│  ├ Change Implementation Timeline
│  └ Top Modules with Feedback
├─ Tables:
│  ├ Recent Feedback Items (with Maker/Checker status)
│  ├ Active Change Initiatives (with progress)
│  └ Pending Approvals by Arslan
└─ Actions:
   ├ View Feedback Details
   ├ Create Change Initiative
   ├ Update Implementation Status
   └─ Generate Reports
```

**Visibility:**
- Full Write Access: Arslan (Head of Change Management)
- Read-Only Access: Saleem (COO), Board Members
- Visibility in Sidebar: Change Management menu item

#### Task 2.2: Create Contact Center Dashboard
**File:** `edd_system/contact_center_dashboard.html`

Key Components:
```
├─ Queues:
│  ├ ReKYC Customer Requests
│  ├ EDD Document Requests
│  └─ Partial Completion Cases
├─ KPIs:
│  ├ Queue Length
│  ├ Average Handle Time
│  ├─ Escalation Rate
│  └─ Resolution Rate
├─ Case Routing:
│  ├ Assign to Officer
│  ├─ Escalate to Manager
│  └─ Route to Compliance
└─ Reports:
   ├ Daily Queue Report
   └─ Escalation Report
```

**Visibility:**
- Full Admin: Hussein Miqdad (Contact Center Manager)
- Escalation Access: Ayman Zein (Alt Channels Head)
- Monitoring Access: Saleem (COO)

#### Task 2.3: Create Notifications Management Dashboard
**File:** `edd_system/notifications_management_dashboard.html`

Key Components:
```
├─ Alert Types:
│  ├ System Alerts
│  ├ Compliance Alerts
│  ├─ Risk Alerts
│  └─ Change Notifications
├─ Routing Rules:
│  ├─ By Department
│  ├─ By Severity
│  └─ By Role
├─ Delivery Status:
│  ├ Email Delivery
│  ├─ System Notifications
│  └─ SMS (if enabled)
└─ KPIs:
   ├ Delivery Rate
   └─ Read Rate
```

**Visibility:**
- Full Admin: Hussein Miqdad (Notifications Manager)
- Monitoring: Dinos (GM Strategy & Projects)
- Executive View: Saleem (COO)

#### Task 2.4: Enhance Alternative Channels Dashboard
**Enhancement:** `edd_system/business_view.html`

Add new segments/tabs:
```
TABS TO ADD:
├─ Mobile Banking
├─ Microsite
└─ Contact Center Workflows
   ├ ReKYC Requests (from CC)
   └ EDD Document Requests (from CC)
```

Add filters by channel:
```
FILTER OPTIONS:
├─ Show by Channel (Mobile, Microsite, Branch, Contact Center)
├─ Show by Status
└─ Show by Priority
```

### Phase 3: Workflow Implementation (PRIORITY 2)

#### Task 3.1: Feedback Management Workflow

```
WORKFLOW SEQUENCE:
1. User submits feedback via "Submit Feedback" button
   └─ Store as FBK-XXXX in feedback database
   └─ Auto-assign to Maker (Karan Patel - MGR-001)

2. Maker Review (Karan)
   └─ Route to: /feedback-maker-queue
   └─ Actions: Approve → Checker OR Reject → User Notification
   └─ Status: Draft → MakerReview

3. Checker Review (Mohammed Ibrahim - Data Manager)
   └─ Route to: /feedback-checker-queue
   └─ Actions: Approve → Change Mgmt OR Send Back → Maker
   └─ Status: MakerReview → CheckerReview

4. Change Manager Review (Arslan)
   └─ Route to: /change-management-dashboard/pending-approvals
   └─ Actions: Approve → Create CHG Case OR Reject → User Notification

5. Implementation (Assigned Team)
   └─ Track progress on Change Management Dashboard
   └─ Update status to Complete
   └─ Route to COO for final approval

6. COO Review (Saleem)
   └─ Review via Executive Dashboard
   └─ Actions: Accept → Closed, or Escalate → Board
```

#### Task 3.2: Contact Center Workflow

```
WORKFLOW SEQUENCE:
1. ReKYC Request → Contact Center Queue
   └─ Assign to Hussein (Contact Center Manager)

2. Customer Contact → Case Creation
   └─ Create linked EDD case if needed
   └─ Document collection workflow starts

3. Escalation Paths:
   ├─ Compliance Issues → Route to Compliance Head
   ├─ EDD Required → Route to Ghaleb (CDD & EDD)
   └─ Policy Override → Route to COO (Saleem)

4. Resolution
   └─ Document attachment
   └─ Status update
   └─ Customer notification
```

#### Task 3.3: Notifications Workflow

```
TRIGGER POINTS:
├─ Feedback Submitted → Route via Notifications
├─ Change Approved → Route via Notifications
├─ Escalation Alert → Route via Notifications
├─ EDD SLA Warning → Route via Notifications
└─ Compliance Alert → Route via Notifications

DELIVERY CHANNELS:
├─ System Dashboard Notification
├─ Email
├─ SMS (configurable)
└─ In-App Alert

ROUTING LOGIC (in Notifications Manager):
├─ By Department
├─ By Role
├─ By Severity Level
└─ By Delivery Preference
```

### Phase 4: Access Control & Permissions (PRIORITY 2)

#### Task 4.1: Update Role-Based Access Control Matrix

Create `js/rbac_config.js`:

```javascript
const RBACPermissions = {
  
  // GCEO Permissions
  'EXE-001': {
    dashboards: ['all'],
    feedback: ['read', 'write', 'approve', 'override'],
    changes: ['read', 'write', 'approve', 'override'],
    notifications: ['read', 'write'],
    edd: ['read', 'write'],
    cdd: ['read', 'write'],
    kyc: ['read', 'write']
  },
  
  // COO Permissions
  'GM-001': {
    dashboards: ['management', 'executive', 'audit', 'change_management', 'notifications'],
    feedback: ['read', 'approve_final'],
    changes: ['read', 'approve_final'],
    notifications: ['read', 'write'],
    edd: ['read'],
    kyc: ['read', 'write']
  },
  
  // Head of Change Management
  'CHG-001': {
    dashboards: ['change_management'],
    feedback: ['read', 'approve_change'],
    changes: ['read', 'write', 'create_initiative'],
    notifications: ['read'],
    edd: ['read']
  },
  
  // Contact Center Manager
  'CC-001': {
    dashboards: ['contact_center'],
    feedback: ['read'],
    cases: ['read', 'write', 'route'],
    rekyc: ['read', 'write', 'assign'],
    edd: ['read', 'escalate'],
    notifications: ['read']
  },
  
  // CDD & EDD Manager
  'MGR-006': {
    dashboards: ['cdd_view', 'edd_management'],
    feedback: ['read'],
    cdd: ['read', 'write'],
    edd: ['read', 'write', 'maker', 'checker'],
    notifications: ['read']
  },
  
  // Notifications Manager
  'NOTIF-001': {
    dashboards: ['notifications_management'],
    notifications: ['read', 'write', 'route', 'configure'],
    alerts: ['read', 'write', 'escalate'],
    kyc: ['read']
  }
};
```

#### Task 4.2: Implement Dashboard-Level Access Control

Update all dashboard HTML files to check role permissions:

```html
<!-- In each dashboard HTML file, add at document load: -->
<script>
  const currentUser = getCurrentUser(); // From session
  const roleId = currentUser.roleId;
  const allowedRoles = ['CHG-001', 'GM-001', 'EXE-001']; // Change Mgmt Dashboard
  
  if (!allowedRoles.includes(roleId)) {
    window.location.href = 'access_denied.html';
  }
</script>
```

### Phase 5: Navigation Menu Updates (PRIORITY 3)

#### Task 5.1: Update Sidebar Navigation

Add new menu items to all page templates:

```html
<!-- Add under "Tools" section: -->
<li class="menu-section">
  <h5>Change & Governance</h5>
  <a href="change_management_dashboard.html" class="nav-item" id="change-mgmt-link">
    <span>🔄 Change Management</span>
  </a>
  <a href="contact_center_dashboard.html" class="nav-item" id="contact-center-link">
    <span>📞 Contact Center</span>
  </a>
  <a href="notifications_management_dashboard.html" class="nav-item" id="notifications-link">
    <span>🔔 Notifications</span>
  </a>
</li>
```

Make visibility conditional based on role:

```javascript
function updateNavigationForRole(roleId) {
  // Show Change Management Dashboard only to Arslan, COO, and GCEO
  document.getElementById('change-mgmt-link').style.display = 
    ['CHG-001', 'GM-001', 'EXE-001'].includes(roleId) ? 'block' : 'none';
  
  // Show Contact Center Dashboard only to Hussein and above
  document.getElementById('contact-center-link').style.display = 
    ['CC-001', 'HD-RET-001', 'GM-002', 'GM-001', 'EXE-001'].includes(roleId) ? 'block' : 'none';
  
  // Show Notifications Dashboard only to Hussein, Dinos, and above
  document.getElementById('notifications-link').style.display = 
    ['NOTIF-001', 'GM-006', 'GM-001', 'EXE-001'].includes(roleId) ? 'block' : 'none';
}
```

### Phase 6: Database Schema Updates (PRIORITY 2)

#### Task 6.1: Create Missing Tables

```sql
-- Feedback Management
CREATE TABLE IF NOT EXISTS feedback (
  id VARCHAR(20) PRIMARY KEY,
  submitted_by INT,
  module VARCHAR(50),
  category VARCHAR(20),
  description TEXT,
  priority VARCHAR(10),
  status VARCHAR(20),
  maker_id INT,
  maker_review_date TIMESTAMP,
  maker_comment TEXT,
  checker_id INT,
  checker_review_date TIMESTAMP,
  checker_comment TEXT,
  change_mgmt_decision VARCHAR(20),
  related_change_id VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Change Initiatives
CREATE TABLE IF NOT EXISTS change_initiatives (
  id VARCHAR(20) PRIMARY KEY,
  feedback_id VARCHAR(20),
  created_by INT,
  title VARCHAR(200),
  description TEXT,
  impact_assessment TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(20),
  owner_id INT,
  assigned_team TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact Center Cases
CREATE TABLE IF NOT EXISTS contact_center_cases (
  id VARCHAR(20) PRIMARY KEY,
  customer_id INT,
  case_type VARCHAR(30),
  priority VARCHAR(10),
  status VARCHAR(20),
  assigned_to INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  resolved_at TIMESTAMP,
  notes TEXT
);

-- Notifications Log
CREATE TABLE IF NOT EXISTS notifications_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipient_id INT,
  notification_type VARCHAR(50),
  title VARCHAR(200),
  message TEXT,
  priority VARCHAR(10),
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  channel VARCHAR(20)  -- email, sms, dashboard
);
```

---

## 6. DASHBOARD ARCHITECTURE & USER INTERFACE

### Dashboard Hierarchy Map

```
EXECUTIVE LEVEL:
├─ Executive Dashboard (Saleem / GCEO)
│  ├─ Global KPIs
│  ├─ Change Initiative Summary
│  ├─ Feedback Approval Queue
│  ├─ Escalations
│  └─ System Health
│
├─ Change Management Dashboard (Arslan)
│  ├─ Feedback Metrics
│  ├─ Change Approval Queue
│  ├─ Implementation Tracking
│  └─ Report Generation
│
└─ Notifications Dashboard (Hussein Notifications)
   ├─ Alert Routing Rules
   ├─ Delivery Status
   ├─ Alert Templates
   └─ Escalation Paths

OPERATIONAL LEVEL:
├─ Contact Center Dashboard (Hussein CC)
│  ├─ Current Queues
│  ├─ Case Routing
│  ├─ Escalation Handling
│  └─ Daily Reports
│
├─ CDD/EDD Operations Dashboard (Ghaleb)
│  ├─ Open Cases
│  ├─ Maker/Checker Queue
│  ├─ Status Tracking
│  └─ Reports
│
├─ Business View (Ayman / Hassan)
│  ├─ Segment-Specific Cases
│  ├─ Channel Analysis
│  ├─ Performance Metrics
│  └─ Escalations
│
└─ Retail Operations (Sayed)
   ├─ Department Status
   ├─ KPI Monitoring
   ├─ Team Performance
   └─ Alerts

SUPPORT LEVEL:
├─ Audit Console
├─ Compliance View
├─ KYC Monitoring
└─ Document Viewer
```

### Dashboard Mockup Structure

**Change Management Dashboard Template:**
```
┌─────────────────────────────────────────────────────┐
│ 🔄 CHANGE MANAGEMENT DASHBOARD                      │
│ Welcome, Arslan | Last Updated: 2 min ago          │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  KPI CARDS (4-column)                              │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│ │ New  │ │Under │ │Appvd │ │Implt │              │
│ │Fdbk  │ │Review│ │Change│ │ted   │              │
│ │ 12   │ │ 7    │ │ 5    │ │ 3    │              │
│ └──────┘ └──────┘ └──────┘ └──────┘              │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  CHARTS (2-column)                                 │
│ ┌──────────────────┐ ┌──────────────────┐         │
│ │ Feedback Category│ │ Change Timeline  │         │
│ │  (Bar Chart)     │ │  (Timeline)      │         │
│ └──────────────────┘ └──────────────────┘         │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  PENDING APPROVALS TABLE                           │
│ ┌─────────────────────────────────────────────────┐│
│ │ID  │Module │Category │Status      │Action      ││
│ │FBK-│EDD    │Enhcmnt  │Awaiting    │[✓][✗]     ││
│ │127 │Cases  │         │Arslan      │            ││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

---

## 7. WORKFLOW ROUTING & INTEGRATION POINTS

### Message Flow Diagram

```
┌──────────────────────────────────────────────────────┐
│             FEEDBACK SUBMISSION ENTRY POINT           │
│  (All pages have "Submit Feedback" button)            │
└─────────────────┬──────────────────────────────────┘
                  │
                  ▼
         ┌─────────────────────┐
         │ Store Feedback      │
         │ FBK-XXXX generated  │
         │ Auto-assign Maker   │
         └────────┬────────────┘
                  │
         ┌────────▼─────────────────────┐
         │ MAKER REVIEW QUEUE            │
         │ Assigned to: Karan Patel      │
         │ Role: MGR-001                 │
         │ Dashboard: feedback-maker     │
         └────────┬──────────┬──────────┘
                  │          │
          ┬───────┘          └─────────┬────┐
          │ Approve                    │    │ Reject
          │                            │    │
    ┌─────▼──────────────────┐        │    └──────┐
    │ CHECKER REVIEW QUEUE    │        │           │
    │ Assigned to:            │        │      ┌────▼────┐
    │ Mohammed Ibrahim        │        │      │ Return  │
    │ Role: IT-002           │        │      │ to User │
    └────────┬──────────┬────┘        │      └────┬────┘
             │          │             │            │
     ┌──────┘          └──┐            │            │
     │ Approve             │ Send Back  │            │
     │                     │            │            │
┌────▼──────────────────────┐           │            │
│ CHANGE MGT APPROVAL QUEUE  │◄──────────┘            │
│ Assigned to: Arslan        │                      │
│ Role: CHG-001              │                      │
│ Dashboard: change-approve   │                      │
└────┬──────────┬────────────┘                      │
     │          │                                   │
 ┌───┴────┐     │ Reject                          │
 │ Approve│     │                                  │
 │        │     └──────────────────────┐           │
 │   ┌────▼──────────────────────┐     │          │
 │   │ CREATE CHANGE INITIATIVE  │     │      ┌───▼────┐
 │   │ CHG-XXXX                  │     │      │Feedback│
 │   │ Assign impl team          │     │      │Rejected│
 │   │ Set timeline              │     │      └────────┘
 │   └────┬─────┬───────────────┘     │
 │        │     │                      │
 │        │     └──COO Review (Saleem)─┘
 │        │
 │   ┌────▼──────────────────────────┐
 │   │ IMPLEMENTATION TRACKING        │
 │   │ Team: Assigned Developers      │
 │   │ Update Status: In Progress     │
 │   │ Target Date: Specified         │
 │   └────┬──────────────────────────┘
 │        │
 │   ┌────▼──────────────────────────┐
 ●   │ COMPLETION & REPORTING        │
     │ Generate Change Report        │
     │ Submit to COO                 │
     │ Archive as Completed          │
     └───────────────────────────────┘
```

### Integration Points with Existing System

```
FEEDBACK INTEGRATION:
├─ Entry: Every page (via Submit Feedback button)
├─ Storage: feedback table
├─ Processing: change_management_dashboard.html
└─ Reporting: executive_dashboard.html

CHANGE INITIATIVE INTEGRATION:
├─ Creation: From Arslan's approval
├─ Tracking: change_management_dashboard.html
├─ Updates: Implementation team
└─ Reporting: Saleem's dashboard

CONTACT CENTER INTEGRATION:
├─ Queue Management: contact_center_dashboard.html
├─ Case Creation: Linked to EDD cases
├─ Escalation: To CDD/EDD operations (Ghaleb)
├─ Routing: To Compliance if needed
└─ Reporting: Hussein's dashboard

NOTIFICATIONS INTEGRATION:
├─ Triggers: Feedback approved, Change created, Escalation
├─ Routing Logic: notifications_management_dashboard.html
├─ Delivery: Email, Dashboard, SMS
└─ Logging: notifications_log table
```

---

## 8. ROLE-BASED ACCESS CONTROL MODEL

### Complete RBAC Permission Matrix

| Role | Dashboard Access | Read | Write | Approve | Admin | Notes |
|------|-----------------|------|-------|---------|-------|-------|
| **GCEO** | All | ✅ | ✅ | ✅ | ✅ | Full system access |
| **COO (Saleem)** | Executive, Management, Audit, Change Mgmt | ✅ | ✅ | Final Approval | ✅ | Can override, escalates to Board |
| **Head of Change (Arslan)** | Change Management | ✅ | ✅ | Approves & Creates CHG | ✅ | Creates change initiatives |
| **Contact Center (Hussein)** | Contact Center | ✅ | ✅ | Routes Cases | ✅ | Queue management |
| **Notifications (Hussein)** | Notifications Mgmt | ✅ | ✅ | Configures Rules | ✅ | Alert routing |
| **Alt Channels (Ayman)** | Business View (filtered) | ✅ | Read-Only | Escalates | ❌ | Read-only on non-own channels |
| **Branches (Hassan)** | Business View (filtered) | ✅ | Read-Only | Escalates | ❌ | Branch-specific view only |
| **CDD/EDD (Ghaleb)** | CDD View, EDD Case | ✅ | ✅ | Maker/Checker | ✅ | Full CDD/EDD authority |
| **Retail Ops (Sayed)** | Operations View | ✅ | ✅ | Escalates | ❌ | Operational monitoring |

---

## 9. IMPLEMENTATION TIMELINE & ROADMAP

### Phase 1: Foundation (Weeks 1-2) ⏰ HIGH PRIORITY

- [ ] Add missing roles to organization_data.js (Hussein, Omar, Ashraf)
- [ ] Create RBAC permission matrix (rbac_config.js)
- [ ] Plan database schema updates
- [ ] Design dashboard mockups

**Deliverable:** Updated data model with all roles defined

### Phase 2: Dashboards (Weeks 3-5) ⏰ HIGH PRIORITY

- [ ] Build Change Management Dashboard
- [ ] Build Contact Center Dashboard  
- [ ] Build Notifications Management Dashboard
- [ ] Implement dashboard routing logic
- [ ] Add sidebar navigation updates

**Deliverable:** 3 new dashboards fully functional

### Phase 3: Workflows (Weeks 6-8) ⏰ MEDIUM PRIORITY

- [ ] Implement feedback workflow
- [ ] Implement change initiative workflow
- [ ] Implement contact center workflow
- [ ] Implement notifications routing
- [ ] Create workflow logging

**Deliverable:** Complete end-to-end workflows operational

### Phase 4: Testing & Refinement (Weeks 9-10) ⏰ MEDIUM PRIORITY

- [ ] Unit testing for workflows
- [ ] UAT with selected users
- [ ] Permission testing by role
- [ ] Performance optimization
- [ ] Security audit

**Deliverable:** System tested and ready for deployment

### Phase 5: Deployment (Week 11) ⏰ ONGOING

- [ ] Deploy to staging
- [ ] User training
- [ ] Go-live on production
- [ ] Monitor for issues
- [ ] Support handoff

---

## 10. RISK ASSESSMENT & MITIGATION

### Critical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Missing roles cause workflow blockage | HIGH | HIGH | Complete all role definitions in Phase 1 |
| Dashboard performance issues | MEDIUM | MEDIUM | Implement caching, optimize queries |
| Permission gaps cause security breach | HIGH | LOW | Complete RBAC matrix testing |
| Integration issues with existing system | MEDIUM | MEDIUM | Test with CDD/EDD module first |

### Success Criteria

✅ All 4 missing roles implemented and accessible  
✅ 3 new dashboards deployed and tested  
✅ Feedback workflow: 100% of feedback reaches Arslan  
✅ Change workflow: 100% of approved feedback creates CHG case  
✅ Contact Center: All ReKYC requests routable  
✅ Notifications: 95% delivery success rate  
✅ RBAC: Zero unauthorized access attempts  

---

## 11. COMPLIANCE & AUDIT REQUIREMENTS

### Regulatory Considerations

- **AML/CFT:** Feedback & changes must be auditable for regulatory review
- **Data Protection:** Personal data in feedback must be protected
- **Access Control:** Role-based access must be logged and monitored
- **Retention:** Feedback and change records must be retained per policy
- **Escalation:** Compliance-related changes must escalate to Risk Manager

### Audit Trail Requirements

```javascript
const AuditLogEntry = {
  timestamp: '2026-03-09T10:30:00Z',
  user_id: 'CHG-001',  // Arslan
  action: 'APPROVE_FEEDBACK',
  resource: 'FBK-0127',
  old_state: 'CheckerReview',
  new_state: 'ChangeApproval',
  details: 'Approved for change initiative creation',
  ip_address: '192.168.1.100',
  change_log: { ... }
};
```

---

## CONCLUSION

The QIB EDD System requires **strategic enhancement** to achieve the target governance model. The current implementation is **solid at the operations level** but **lacks executive governance workflows**.

### Key Takeaways

1. **System is 70% complete** for target architecture
2. **Missing 4 critical roles** and 3 strategic dashboards
3. **Feedback-to-Change workflow not yet implemented** (highest impact feature)
4. **Contact Center role undefined** (customer-facing risk)
5. **Notifications governance missing** (system-wide impact)

### Executive Recommendation

✅ **PROCEED with Phase 1-2 immediately**
- Implement missing roles and dashboards
- Budget: 4-6 weeks
- Resource: 2-3 developers (frontend + backend)
- Risk: LOW (changes are additive, not disruptive)

The system will evolve from an **EDD Case Management Platform** into a **Retail Risk & Compliance Governance Platform** supporting feedback, change management, and enterprise notifications.

---

**Report Prepared by:** Enterprise Architecture Team  
**Date:** March 9, 2026  
**System Version:** 2.1  
**Scope:** Complete Organizational Governance Assessment  
**Classification:** Internal Use
