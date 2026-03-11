# BRD: Organizational Structure Governance Module
## حوكمة الهيكل التنظيمي

---

## Executive Summary

The **Organizational Structure Governance** module establishes Human Resources (HR) as the authoritative owner of organizational data within the platform. HR maintains a comprehensive, auditable, and versioned organizational hierarchy that serves as the foundational data asset for all governance, workflow routing, approvals, committees, escalations, permissions, and reporting functions across the system.

---

## 1. Data Ownership & Governance

### 1.1 HR as Organizational Authority

**Requirement:** Human Resources (HR) department shall be the single authoritative owner and custodian of all organizational structure data within the system, including:

- Corporate Groups (المجموعات)
- Departments (الإدارات)
- Divisions (الأقسام)
- Units/Teams (الوحدات)
- Job Titles/Positions (المسميات الوظيفية)
- Reporting Lines (خطوط الإشراف)
- Administrative Hierarchy (التبعية الإدارية)
- Deputy/Acting Assignments (المستخدمون البدلاء)

### 1.2 HR Controls

HR shall have exclusive authority to:

- Create, update, and archive organizational entities
- Approve organizational changes
- Set effective and expiration dates for organizational changes
- Maintain change history and audit trail
- Designate backup managers and acting officers
- Mark positions as vacant or filled

---

## 2. Organizational Data Input & Management

### 2.1 Hierarchical Structure Entry

The system shall enable HR to establish and maintain the following organizational hierarchy:

#### 2.1.1 Group (المجموعة)
- **Definition:** Highest-level organizational grouping (e.g., Banking Group, Operations Group)
- **Data Fields:**
  - Group ID
  - Group Name (English & Arabic)
  - Group Code
  - Description
  - Group Head / Owner
  - Status (Active/Inactive)

#### 2.1.2 Department (الإدارة)
- **Definition:** Mid-level organizational unit reporting to Group
- **Data Fields:**
  - Department ID
  - Department Name (English & Arabic)
  - Department Code
  - Parent Group
  - Department Head
  - Description
  - Status (Active/Inactive)

#### 2.1.3 Division (القسم)
- **Definition:** Sub-unit reporting to Department
- **Data Fields:**
  - Division ID
  - Division Name (English & Arabic)
  - Division Code
  - Parent Department
  - Division Head
  - Description
  - Functional Area
  - Status (Active/Inactive)

#### 2.1.4 Unit/Team (الوحدة)
- **Definition:** Smallest operational unit reporting to Division
- **Data Fields:**
  - Unit ID
  - Unit Name (English & Arabic)
  - Unit Code
  - Parent Division
  - Unit Manager
  - Team Size (Expected vs Actual)
  - Description
  - Status (Active/Inactive)

#### 2.1.5 Job Position (المسمى الوظيفي)
- **Definition:** Individual role/position within the hierarchy
- **Data Fields:**
  - Position ID
  - Job Title (English & Arabic)
  - Job Code
  - Position Level (Executive/Senior/Middle/Junior/Support)
  - Salary Grade
  - Parent Unit
  - Direct Manager
 - Indirect Manager(s) (Up the hierarchy)
  - Status (Vacant/Filled)
  - Position Category (Permanent/Contract/Temporary)
  - Reporting Level (How many levels to top)

#### 2.1.6 Employee-Position Assignment
- **Definition:** Links an employee/user to a job position
- **Data Fields:**
  - Assignment ID
  - Employee ID
  - Job Position ID
  - Assignment Start Date
  - Assignment End Date (if applicable)
  - Is Primary Assignment (Yes/No)
  - Acting/Deputy Status
  - Status (Active/Inactive)

#### 2.1.7 Reporting Relationship
- **Definition:** Direct manager assignment for each position
- **Data Fields:**
  - Relationship ID
  - Employee ID / Position ID
  - Direct Manager ID
  - Hierarchy Level
  - Effective Date
  - End Date
  - Relationship Type (Direct/Dotted/Matrix)
  - Status (Active/Inactive)

### 2.2 Bulk Import & Update

The system shall support:

- CSV/Excel import of organizational structure data
- Batch updates to hierarchies
- Conflict detection and validation
- Dry-run mode before committing changes
- Rollback capability for failed imports

---

## 3. Change Management & Audit Trail

### 3.1 Change Tracking

Every modification to the organizational structure shall be tracked with:

- **Changed By:** User ID making the change
- **Changed Date:** Timestamp of change
- **Change Type:** Create/Update/Archive/Restore
- **Changed Fields:** Specific fields modified
- **Old Value vs New Value:** Before and after comparison
- **Effective Date:** When change takes effect
- **Approval Status:** Change approval workflow (if configured)
- **Change Reason:** Justification for change

### 3.2 Version Control

- Maintain version history of all organizational entities
- Ability to view organizational structure as of any historical date
- Generate "Organization Chart as of [Date]" reports

### 3.3 Approval Workflow

Optional: Require approval for certain organizational changes:

- Position creations
- Hierarchy changes
- Manager reassignments
- Department mergers/splits
- By department head, CFO, or designated approvers

---

## 4. Organizational View & Visualization

### 4.1 Organization Chart

The system shall display:

- **Hierarchical Tree View:**
  - Visual org chart showing all levels
  - Expandable/collapsible nodes
  - Filter by department, division, or unit
  - Customizable depth (show all levels or limit to N levels)

- **Employee Cards:**
  - Employee photo
  - Name (First Last)
  - Job Title
  - Department / Division / Unit
  - Direct Manager name
  - Office location
  - Contact information (optional)
  - Status indicator (Active/On Leave/Inactive)

### 4.2 Director Reports

HR Dashboard shall show:

- Organizational headcount by group/department/division
- Vacancy rates
- Recent organizational changes
- Pending approvals
- Update history and change log
- Compliance reports (has every position been assigned a manager?)

### 4.3 Search & Filter

Users shall be able to:

- Search employee by name, ID, job title
- Filter by department, division, unit, group
- Find direct reports of a specific manager
- Find all members of a department
- View manager chain (direct + indirect managers up to CEO)

---

## 5. Integration with Governance & Workflow

### 5.1 Use Case: Approvals & Maker-Checker

**Requirement:** When configuring approval routes, reviewers can be selected based on organizational structure:

**Example Configurations:**

```
Case Approval Route:
- Step 1: Submitted by (Applicant)
- Step 2: Reviewed by (Direct Manager)
- Step 3: Approved by (Manager of the Manager)
- Step 4: Compliance Sign-off (Job Title = Compliance Officer)
- Step 5: Final Approval (Corporate Head / CRO)
```

**Dynamic Selection:**
- System automatically identifies who is the manager of each applicant
- Routes case to correct person based on org structure
- If manager is on leave, route to acting/deputy manager
- Escalates if no manager found or manager unable to approve

### 5.2 Use Case: Committee Formation

**Requirement:** When creating committees or review bodies, members can be automatically assigned based on structure:

**Example:**

```
Risk Assessment Committee:
- Mandatory Members:
  - Head of Risk Management
  - CFO
- By Unit Representatives:
  - One representative from each division
  - Selected from designated positions
- By Role:
  - All Job Title = "Senior Compliance Officer"
```

**Automatic Updates:**
- When a person leaves the organization, committee membership updates automatically
- When new person assumes position, they are automatically added to relevant committees
- No manual member maintenance required

### 5.3 Use Case: Escalation & SLA Management

**Requirement:** Escalations can be defined based on organizational level:

**Example:**

```
Case Escalation Rules:
- If pending with Direct Manager for > 2 days
  → Escalate to Manager-of-Manager (Level -1)
- If pending at Level -1 for > 3 days
  → Escalate to Department Head
- If pending with Department Head for > 5 days
  → Escalate to Group Head (CEO level)
```

### 5.4 Use Case: Permission Assignment

**Requirement:** User permissions can be assigned by organizational role/position:

**Example:**

```
Approve Cases Permission:
- Job Title = "Manager" in [Operations Division]
- Level >= Middle Management
- Department Head (any department)
- OR Specific User = "CFO"
```

### 5.5 Use Case: Stakeholder Routing

**Requirement:** When creating stakeholder lists, participants can be selected by structure:

**Example:**

```
Change Advisory Board for New System:
- All current System Users (by dept)
- Department heads affected
- Compliance officer
- IT Risk Manager
- CFO
- Representatives from Finance, Operations, HR
```

### 5.6 Use Case: Reporting & Analytics

**Requirement:** All reports shall be viewable by organizational dimension:

- Cases by department / division / unit
- Workload by manager
- Approval times by level
- Bottlenecks by organizational unit
- Headcount utilization by division
- Compliance status by department

---

## 6. Dashboard & Home Page Integration

### 6.1 HR Dashboard (HR Only)

**Widgets:**

- Quick Stats: Total employees, departments, vacancies
- Recent Changes: Latest org structure modifications
- Pending Approvals: Changes awaiting HR/management sign-off
- Compliance Alerts: Missing managers, orphaned positions, etc.
- Change Log: Historical view of all modifications
- Quick Actions: Create dept, add position, assign employee

### 6.2 Manager Dashboard (All Managers)

**Widgets:**

- My Team: Direct reports (count + names)
- Organization Chart: My team visualization
- Cases by Team: Workload view
- Pending Actions: Cases waiting on my approval
- Team Headcount: Current allocation
- Leave Calendar: My team's absences

### 6.3 Employee Dashboard (All Users)

**Widgets:**

- My Profile: Job title, department, manager
- My Manager: Manager name, contact, photo
- My Team (if manager): Direct reports
- My Peers: Others in same department/division
- Organization Directory: Search all employees

---

## 7. API & System Integration

### 7.1 API Endpoints (For Integration)

The system shall expose REST APIs for:

```
GET /api/org-structure/hierarchy
GET /api/org-structure/employees
GET /api/org-structure/manager-chain/{employeeId}
GET /api/org-structure/direct-reports/{manager}
GET /api/org-structure/department/{deptId}
POST /api/org-structure/org-changes (create/update)
GET /api/org-structure/change-log
```

### 7.2 Third-Party System Sync

Capability to sync with:

- HR Management System (HCM / HRIS)
- Active Directory / LDAP
- ERP Systems (for cost center alignment)
- Payroll Systems

---

## 8. Data Quality & Validation

### 8.1 Mandatory Validations

- Every position must have a parent unit
- Every unit must have a parent division
- Every division must have a parent department
- Every department must have a parent group
- No circular reporting relationships
- Every position with "Filled" status must have assigned employee
- Every employee must have direct manager assigned

### 8.2 Data Consistency Checks

- Prevent orphaned records (entities with no parent)
- Prevent duplicate job codes
- Prevent gaps in reporting hierarchy
- Ensure all active positions have defined managers
- Verify no person reports to more than one direct manager

### 8.3 Reconciliation Reports

- Organizational structure vs. actual payroll headcount
- Assigned positions vs. total positions
- Vacant positions trend analysis
- Manager effectiveness (headcount per manager)
- Organizational depth (levels from CEO to frontline)

---

## 9. Access Control & Permissions

### 9.1 HR Access Levels

| Role | Create | Update | Delete | Approve | Audit |
|------|--------|--------|--------|---------|-------|
| HR Administrator | ✓ | ✓ | ✓ | ✓ | ✓ |
| HR Manager | ✓ | ✓ | ✗ | ✓ | ✓ |
| HR Officer | ✓ | ✓ | ✗ | ✗ | ✓ |
| Department Head | ✗ | ✗ | ✗ | ✗ | View Only |
| Manager | ✗ | ✗ | ✗ | ✗ | View Org Only |
| Employee | ✗ | ✗ | ✗ | ✗ | View Directory |

### 9.2 Data Visibility Rules

- Employees see only:
  - Complete organizational chart
  - Their own details
  - Their manager's details
  - Their direct reports (if manager)
  - Their department structure

- Managers see:
  - Full organizational chart
  - Their department details
  - All their direct & indirect reports

- HR sees:
  - Complete organizational data
  - All change history
  - All audit logs

---

## 10. Functional Requirements Summary

### 10.1 Core Features

| Feature | Priority | Owner |
|---------|----------|-------|
| Create/manage job positions | Must | HR |
| Assign employees to positions | Must | HR |
| Maintain manager relationships | Must | HR |
| View org chart | Must | All Users |
| Audit trail all changes | Must | System |
| Bulk import structure | Should | HR |
| Version history | Should | System |
| Approval workflow for changes | Should | HR/Management |
| Sync with external HRIS | Could | IT |
| Analytics & reporting | Could | Analytics |

### 10.2 Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Org structure data refresh time | < 1 minute after change |
| Maximum hierarchy depth | 10 levels (CEO to frontline) |
| Maximum employees per manager | 200 direct reports |
| Data backup frequency | Daily |
| Availability | 99.5% uptime |
| Response time for org queries | < 2 seconds |

---

## 11. Governance & Control Standards

### 11.1 Compliance

This module shall ensure:

- **Regulatory Compliance:** Support audit requirements for reporting lines
- **SOX/Internal Control:** Separation of duties maintained through approvals
- **Segregation of Duties (SoD):** No single person can create and approve changes alone
- **Change Management:** All changes logged with justification and approval

### 11.2 Reference Document

**As per best practice:** The organizational structure maintained in this system shall serve as the **Single Source of Truth (SSOT)** for:

- Permission assignment
- Approval routing
- Committee composition
- Escalation paths
- Role-based access control
- Organizational reporting
- Compliance documentation

---

## 12. Timeline & Deployment

### Phase 1: Foundation (Months 1-2)
- Build org structure data model
- Implement HR data entry interface
- Create basic audit trail
- Deploy org chart viewer

### Phase 2: Integration (Months 2-3)
- Connect to approval workflows
- Enable Maker-Checker based on hierarchy
- Build committee auto-assignment
- Create manager dashboards

### Phase 3: Analytics (Months 3-4)
- Build reporting suite
- Create analytics dashboards
- Implement SoD violation detection
- Enable bulk import/export

### Phase 4: Enhancement (Months 4+)
- HRIS system sync (if applicable)
- Advanced analytics
- Predictive models (succession planning)
- Mobile app for org chart

---

## 13. Success Criteria

- ✓ 100% of organizational structure data entered and auditable
- ✓ All approval routes working based on org structure
- ✓ Zero orphaned positions or employees
- ✓ All organizational changes tracked with full audit trail
- ✓ Manager chain accuracy verified monthly
- ✓ Org chart refresh time < 1 minute
- ✓ User adoption by all departments > 95%
- ✓ Compliance gap closed on authorization tracking

---

## Appendix: Arabic Terms Reference

| English | العربية |
|---------|---------|
| Organizational Structure | الهيكل التنظيمي |
| Group | المجموعة |
| Department | الإدارة |
| Division | القسم |
| Unit / Team | الوحدة |
| Job Title / Position | المسمى الوظيفي |
| Reporting Line | خط الإشراف |
| Direct Manager | المدير المباشر |
| Indirect Manager | المدير غير المباشر |
| HR Administrator | مسؤول الموارد البشرية |
| Manager of Manager | مدير المدير |
| Deputy / Acting | البديل / القائم بالأعمال |
| Vacant Position | منصب شاغر |
| Filled Position | منصب مشغول |
| Change Approval | موافقة التغيير |
| Audit Trail | سجل التدقيق |

---

## Final Statement

**يجب أن يتيح النظام لإدارة الموارد البشرية إدخال وإدارة الهيكل التنظيمي المعتمد داخل المنصة، بحيث يستخدم هذا الهيكل كأساس لحوكمة الصلاحيات، وتوزيع الحالات، ومسارات الاعتماد، والتصعيد، وتكوين اللجان، وربط الموظفين بمدرائهم المباشرين وبالمجموعات والإدارات ذات العلاقة.**

Translation:

**The system must enable the Human Resources department to input and manage the approved organizational structure within the platform, such that this structure serves as the foundation for permission governance, case distribution, approval routes, escalation, committee formation, and linking employees to their direct managers and associated groups and departments.**

---

*Document Version:* 1.0  
*Date:* March 11, 2026  
*Status:* DRAFT FOR REVIEW  
*Owner:* System Architecture & HR  
