# QIB Digital CDD/EDD Case Management Platform
## Enterprise System Architecture & Screen Documentation
### Version 2.0 — Sovereign Banking Standard

---

**Document Classification:** CONFIDENTIAL — Board & Executive Access Only  
**Prepared For:** Qatar Islamic Bank (QIB) — Chief Risk Officer  
**Framework Alignment:** QCB Circular 2024 • FATF Recommendations • Basel III/IV • ISO 27001:2022  
**Document Version:** 2.0  
**Last Updated:** June 2025  
**Repository:** GitHub Enterprise — QIB-EDD-Case-Management

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Screen 1 — Login & Authentication Portal](#3-login--authentication-portal)
4. [Screen 2 — Operational Dashboard](#4-operational-dashboard)
5. [Screen 3 — EDD Case Analysis & Form](#5-edd-case-analysis--form)
6. [Screen 4 — Business View (Retail Banking)](#6-business-view-retail-banking)
7. [Screen 5 — CDD Operations (Maker-Checker)](#7-cdd-operations-maker-checker)
8. [Screen 6 — Compliance Review](#8-compliance-review)
9. [Screen 7 — KYC Compliance Monitoring](#9-kyc-compliance-monitoring)
10. [Screen 8 — Management Dashboard](#10-management-dashboard)
11. [Screen 9 — Audit Console](#11-audit-console)
12. [Screen 10 — Organization Structure](#12-organization-structure)
13. [Screen 11 — Document Viewer (DMS)](#13-document-viewer-dms)
14. [Screen 12 — Notifications Center](#14-notifications-center)
15. [Screen 13 — Executive Presentation](#15-executive-presentation)
16. [Risk Engine Architecture](#16-risk-engine-architecture)
17. [Decision Support System](#17-decision-support-system)
18. [Enterprise Features Module](#18-enterprise-features-module)
19. [Form Validation Engine](#19-form-validation-engine)
20. [Integration Architecture](#20-integration-architecture)
21. [Security Architecture](#21-security-architecture)
22. [Deployment Architecture](#22-deployment-architecture)

---

## 1. Executive Summary

The QIB Digital CDD/EDD Case Management Platform is a **Digital Compliance Governance Framework** architected to sovereign banking standards. The system comprises **13 operational screens**, supported by **12 JavaScript enterprise modules**, delivering end-to-end Enhanced Due Diligence workflow management.

### System Metrics

| Metric | Value |
|--------|-------|
| Total HTML Pages | 13 screens + 2 entry points |
| JavaScript Modules | 12 enterprise modules |
| CSS Stylesheets | 2 (system + login) |
| Mock Data Records | 2,329 lines of simulated T24/QCB data |
| User Roles | 7 defined roles (Business, CDD, Compliance, Audit, Management, Call Center, IT Admin) |
| Banking Segments | 3 (Mass, Tamayuz, Private) |
| Risk Score Components | 5 (Product, Activity, Occupation, Country, Final) |
| Regulatory Frameworks | 16 (FATF, QCB, Basel, ISO, BCBS) |

### Design System

| Element | Specification |
|---------|---------------|
| Primary Background | Navy (#0a1f3d) with ambient gradients |
| Accent Color | Cyan (#00D4FF) — QIB Digital Identity |
| Gold Accent | #D4AF37 — Executive/Premium elements |
| Success | #00E676 / #22C55E |
| Warning | #FFA726 / #F59E0B |
| Danger | #FF5252 / #EF4444 |
| UI Pattern | Glass-morphism with frosted overlays |
| Typography | system-ui with Arabic fallback support |

---

## 2. System Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER (13 Screens)                  │
│  Login │ Dashboard │ EDD Case │ Business │ CDD │ Compliance │ etc. │
├─────────────────────────────────────────────────────────────────────┤
│                    APPLICATION LOGIC LAYER                          │
│  enterprise_features.js │ enterprise_ui.js │ decision_support.js    │
├─────────────────────────────────────────────────────────────────────┤
│                    VALIDATION & RULES LAYER                         │
│  form_validation.js (FATF/QCB/ISO aligned)                         │
├─────────────────────────────────────────────────────────────────────┤
│                    RISK & ANALYTICS LAYER                           │
│  risk_engine.js (reads ETL scores — no auto-scoring)               │
├─────────────────────────────────────────────────────────────────────┤
│                    AUDIT & COMPLIANCE LAYER                         │
│  audit_console.js (SHA-256 hash-chain tamper-resistant)             │
├─────────────────────────────────────────────────────────────────────┤
│                    DATA SIMULATION LAYER                            │
│  mock_data.js (T24 + QCB + SnapView + DMS simulation)              │
├─────────────────────────────────────────────────────────────────────┤
│                    INTEGRATION LAYER (Production)                   │
│  T24 Core Banking │ QCB KYC API │ DMS Repository │ SnapView/ETL    │
└─────────────────────────────────────────────────────────────────────┘
```

### Navigation Architecture

All screens share a consistent sidebar navigation organized into 4 sections:

| Section | Screens | Badge Logic |
|---------|---------|-------------|
| **Main** | Dashboard, EDD Cases, Organization | EDD Cases shows active count (8) |
| **Departments** | Business View, CDD Operations, Compliance | CDD shows pending (3⚠️), Compliance shows escalated (1🔴) |
| **KYC Governance** | KYC Monitoring, Management, Audit Console | — |
| **Tools** | Documents, Notifications | — |

---

## 3. Login & Authentication Portal

**File:** `edd_system/login.html` (~300 lines)  
**Stylesheet:** `css/login.css`  
**JS Module:** `js/login.js`

### Visual Design
- **Background:** Three.js particle animation with floating 3D geometry
- **Branding:** QIB Vision 2030 digital reveal animation on page load
- **Layout:** Centered login card with glass-morphism overlay
- **Regulatory Badges:** QCB, FATF, Basel III compliance indicators

### Authentication Flow

```
User Entry → Username/Password → Credential Validation → OTP Challenge → 
Role Detection → Session Creation → Redirect to Dashboard
```

### Demo Credentials

| Username | Password | OTP | Role |
|----------|----------|-----|------|
| Qib@2030 | Qib@2030 | 123456 | Admin |
| RAAFAT | R@@f@t2025 | 123456 | Business |

### User Database (7 System Users)

| Employee ID | Name | Department | Role |
|-------------|------|------------|------|
| EMP001 | Ahmed Al-Thani | Mass Banking | business |
| EMP002 | Fatima Al-Mansoor | CDD Operations | cdd |
| EMP003 | Mohammed Al-Suwaidi | Compliance | compliance |
| EMP004 | Sara Al-Khalifa | Private Banking | business |
| EMP005 | Khalid Al-Dosari | Tamayuz Banking | business |
| EMP006 | Noor Al-Mahmoud | Audit | audit |
| EMP007 | Hassan Al-Naimi | Management | management |

### Security Features
- OTP verification (simulated for demo)
- Session-based authentication with localStorage
- Role-based access control (RBAC)
- Auto-logout on session expiry

---

## 4. Operational Dashboard

**File:** `edd_system/dashboard.html` (417 lines)  
**JS Modules:** `mock_data.js`, `enterprise_features.js`, `enterprise_ui.js`, `dashboard.js`

### Data Sources Panel
Real-time integration status for 3 data sources:

| Source | Description | Status Indicator |
|--------|-------------|-----------------|
| **T24 Core Banking** | Customer Data & KYC | Green dot — Connected |
| **QCB KYC API** | Regulatory Data | Green dot — Connected |
| **DMS Repository** | Document Storage | Green dot — Connected |

### KPI Statistics Grid (4 Cards)

| Metric | Default Value | Click Action |
|--------|--------------|--------------|
| Total EDD Cases | 8 | Navigate to `edd_case.html` |
| Pending Review | 5 | Trend: -2 from yesterday |
| SLA Breached | 3 | "Requires attention" alert |
| Completed Today | 1 | Trend: On track |

### Recent EDD Cases Table
Columns: Case ID, Customer, Segment, Status, Priority, SLA  
Populated dynamically from `EDDMockData.customers`

### Cases by Segment (Distribution Chart)
- Mass Banking: 3 cases (37.5%)
- Tamayuz: 2 cases (25%)
- Private Banking: 3 cases (37.5%)

### Alerts Panel (3 Active Alerts)
1. **3 Cases SLA Breached** — Red severity, immediate action
2. **1 PEP Case Pending** — Requires compliance review
3. **2 Documents Pending** — Awaiting client response

### Recent Activity Timeline
Links to Audit Console for full trail

### Header Actions
- **Call Center Search** — Modal: search by RIM/QID/Account, restricted view (no risk scores, no AML flags)
- **Presentations** — Link to `presentations.html`
- **Help** — `EnterpriseUI.showUserGuideModal()`
- **Search, Notifications, Logout** — Standard header controls

---

## 5. EDD Case Analysis & Form

**File:** `edd_system/edd_case.html` (~1,300 lines)  
**JS Modules:** `edd_case.js`, `risk_engine.js`, `form_validation.js`, `enterprise_features.js`, `decision_support.js`, `enterprise_ui.js`, `transaction_activity.js`, `joint_accounts.js`, `export_reports.js`

### Overview
The most complex screen in the system — full EDD case analysis with an 11-section regulatory form.

### Layout: Two-Panel Design

**Left Panel — Customer Intelligence:**
- Customer profile card (name, RIM, segment, PEP status)
- Risk score radar (Product, Activity, Occupation, Country, Final)
- ETL data source indicator with last update timestamp
- Risk driver analysis with severity colors
- EDD action recommendations
- Transaction activity analysis
- Joint account exposure analysis

**Right Panel — 11-Section EDD Form:**

| Section | Title | Fields |
|---------|-------|--------|
| 1 | Customer Identification | Name, RIM, QID, Nationality, DOB, Phone, Email |
| 2 | Employment & Income | Employer, Position, Monthly Income, Income Source |
| 3 | Source of Wealth | SOW Details, Documentation |
| 4 | Source of Funds | SOF Details, Fund Origins |
| 5 | Transaction Activity Profile | Expected volumes, patterns |
| 6 | Risk Assessment | Risk level, rationale, triggers |
| 7 | PEP Screening | PEP status, relationship, termination |
| 8 | Sanctions Screening | Screening results, false positive analysis |
| 9 | Adverse Media | Media check results, relevance assessment |
| 10 | EDD Decision | Recommendation, conditions, next review |
| 11 | Officer Declaration | Digital signature, compliance confirmation |

### Key Features
- **Form Validation:** Enterprise-grade with FATF/QCB regulatory references
- **Auto-Population:** Customer data pre-filled from T24/ETL simulation
- **Export:** PDF and Excel report generation
- **Change Management Feedback UI:** Post-decision feedback collection
- **Digital Confirmation:** PIN-based officer sign-off

---

## 6. Business View (Retail Banking)

**File:** `edd_system/business_view.html` (722 lines)  
**JS Module:** `business_view.js`

### Segment Tabs (3 Banking Segments)

| Segment | Color Theme | Tab Styling |
|---------|------------|-------------|
| Mass Banking | Green (#22C55E) | Green gradient active state |
| Tamayuz | Purple (#A855F7) | Purple gradient active state |
| Private Banking | Amber (#F59E0B) | Amber gradient active state |

### Dashboard Grid (4 KPI Cards per Segment)
- Total cases per segment
- Pending cases
- SLA status
- Completion rate

### Case Queue
- **Case Cards:** Priority-coded (High=Red, Medium=Amber, Low=Green)
- **Urgent Indicator:** Left border highlight for overdue cases
- **Click Action:** Navigate to EDD case with customer context

### Features
- Segment-specific filtering
- Priority color-coding with left-border severity
- Queue management for Business Maker/Checker workflow
- Responsive grid (4-column → 2-column at 1200px breakpoint)

---

## 7. CDD Operations (Maker-Checker)

**File:** `edd_system/cdd_view.html` (245 lines)  
**JS Module:** `cdd_view.js`

### Maker-Checker Workflow Visualization

```
Step 1: Business Approved (Red) →
Step 2: CDD Maker Review (Orange) →
Step 3: CDD Checker Approval (Cyan) →
Step 4: Complete / Escalate (Green)
```

### KPI Statistics (4 Cards)

| Metric | Icon Color | Description |
|--------|-----------|-------------|
| Pending CDD Review | Red | Cases awaiting initial CDD review |
| Awaiting Maker | Orange | Cases in Maker review stage |
| Awaiting Checker | Cyan | Cases pending Checker approval |
| Completed (Month) | Green | Monthly completion count |

### Kanban Board (4 Columns)

| Column | Status | Description |
|--------|--------|-------------|
| Pending CDD Review | Queue | New cases from Business |
| Maker Review | In-Progress | CDD Maker analyzing |
| Checker Approval | Quality Gate | CDD Checker validating |
| Escalated to Compliance | Terminal | Cases requiring compliance attention |

### Recent CDD Activity Timeline
Chronological feed of CDD actions populated from mock data

---

## 8. Compliance Review

**File:** `edd_system/compliance_view.html` (237 lines)  
**JS Modules:** `compliance_view.js` (with 5% escalation analytics)

### Alert Banner
- **High-Priority:** "2 High-Risk PEP Cases Pending — Requires immediate Compliance Officer review within 48 hours"

### KPI Statistics (4 Cards)

| Metric | Gradient | Default |
|--------|----------|---------|
| Escalated Cases | Red→Deep Red | 2 |
| Active PEP Clients | Purple→Deep Purple | 3 |
| Pending Review | Orange→Amber | 1 |
| Approved (Month) | Green→Deep Green | 7 |

### Two-Column Layout

**Left: Escalated Cases Table**
Columns: Case ID, Customer, Risk Level, Reason, Escalation Date, Actions

**Right: PEP Watch List**
Active PEP clients with monitoring status

### Compliance Actions Available
- **Approve** — Clear case with conditions
- **Reject** — Return to CDD with requirements
- **Escalate** — Forward to Management
- **Freeze** — Account restriction (requires dual authorization)

### 5% Escalation Threshold Analytics
JS module (`compliance_view.js`) implements automatic alerting when escalation rates exceed 5% of total cases, with:
- Threshold monitoring dashboard
- Historical escalation trend analysis
- Regulatory reporting readiness

---

## 9. KYC Compliance Monitoring

**File:** `edd_system/kyc_monitoring.html` (974 lines)  
**Design:** Custom CSS-heavy with embedded styles

### Segment Overview (3-Column Grid)

| Segment | Icon Style | Gradient |
|---------|-----------|----------|
| Personal Banking | Cyan | #00D4FF → #0088CC |
| Wholesale Banking | Purple | #8B5CF6 → #6D28D9 |
| WPS (Wage Protection) | Amber | #F59E0B → #D97706 |

### Per-Segment Statistics (2x2 Grid per Card)

| Metric | Color Code |
|--------|-----------|
| Valid | Green (#10B981) |
| Expiring Soon | Amber (#F59E0B) |
| Expired | Red (#EF4444) |
| Under Review | Orange (#F97316) |

### KYC Alerts Section
- Alert badge with count
- Filterable alert table with columns: Customer, Status, Segment, Expiry, Action
- Status badges: `expired` (red), `expiring-soon` (amber), `valid` (green)
- Filter row with segment, status, and date range filters

### Key Features
- Proactive expiry monitoring (30/60/90 day alerts)
- Segment-level KYC health scoring
- Regulatory deadline tracking per QCB circular requirements
- Responsive hover animations with transform + box-shadow

---

## 10. Management Dashboard

**File:** `edd_system/management_dashboard.html` (362 lines)  
**JS Module:** `management_dashboard.js`

### Page Title: "Executive Dashboard"

### Period Selector
Dropdown: Today, This Week, This Month (default), This Quarter, This Year

### KPI Cards (4 Metrics)

| KPI | Value | Trend |
|-----|-------|-------|
| Total EDD Cases | 156 | +12% vs last month |
| Completed | 142 | 91% completion rate |
| In Progress | 14 | Avg. 3.2 days processing |
| Escalated | 2 | -33% vs last month |

### Cases Trend Chart (Bar Chart)
Monthly progression: Jan(98) → Feb(108) → Mar(120) → Apr(132) → May(140) → Jun(156)

### Risk Distribution (Donut Chart)
- High Risk: 35%
- Medium Risk: 45%
- Low Risk: 20%
- Center: Total 156

### Department Performance Table

| Department | Total | Completed | Pending | Avg. TAT | SLA Compliance |
|-----------|-------|-----------|---------|----------|----------------|
| Business | 156 | 142 | 14 | 2.1 days | 94% (green) |
| CDD Operations | 148 | 138 | 10 | 1.8 days | 96% (green) |
| Compliance | 12 | 10 | 2 | 3.5 days | 85% (amber) |

### Recent Completions Table
Columns: Case ID, Customer, Risk Level, Segment, Completed Date, Time Taken

### Export Report Button
One-click aggregate report generation

---

## 11. Audit Console

**File:** `edd_system/audit_console.html` (240 lines)  
**JS Module:** `audit_console.js` (~550 lines — SHA-256 hash-chain implementation)

### Read-Only Access Badge
Prominently displayed "Read-Only Access" indicator with eye icon

### Audit Filters
- Text search: case ID, user, or action
- Action type: Create, Update, Approve, Reject, Escalate, Login
- Department: Business, CDD, Compliance, IT
- Date range: From/To date pickers
- Clear button for filter reset

### Audit Summary KPIs (4 Cards)

| Metric | Gradient | Value |
|--------|----------|-------|
| Total Events (24h) | Cyan | 1,247 |
| Active Users | Green | 23 |
| Warnings | Orange | 3 |
| Errors | Red | 0 |

### Audit Trail Table
Columns: Timestamp, User, Department, Action, Case ID, Details, IP Address  
Pagination: Page 1 of 25 with Previous/Next controls  
Display: "Showing 50 of 1,247 events"

### Live Activity Feed
Real-time animated feed with live indicator dot

### Hash-Chain Tamper Resistance (audit_console.js)
```
Event[n].hash = SHA-256(Event[n].data + Event[n-1].hash)
```
- Each audit entry includes cryptographic hash of previous entry
- Chain integrity verification on load
- Tamper detection via hash mismatch alerting
- State tracking: CREATED → IN_PROGRESS → COMPLETED

---

## 12. Organization Structure

**File:** `edd_system/organization.html` (1,924 lines — largest screen)  
**JS Modules:** `organization.js`, `organization_data.js`

### Comprehensive Organizational Hierarchy
- Full QIB department structure visualization
- Employee directory with avatars
- Reporting lines and role assignments
- Department-level KPI aggregation

### Key Data Points
- Department heads and direct reports
- Role assignments per employee
- Contact information and access levels
- Performance metrics by unit

---

## 13. Document Viewer (DMS)

**File:** `edd_system/document_viewer.html` (119 lines)  
**JS Module:** `document_viewer.js`

### Three-Panel Layout

| Panel | Purpose |
|-------|---------|
| **Document List** (Left) | Collapsible file tree with document categories |
| **Document Preview** (Center) | Main viewing area with zoom controls |
| **Document Info** (Right) | Metadata: upload date, type, size, verification status |

### Toolbar Actions
- **Zoom Controls:** Zoom In, Zoom Out, Percentage display, Fit to Page
- **Download:** Export document locally
- **Mark Verified:** Digital verification stamp with officer ID

### Sidebar
Collapsed sidebar (minimal navigation) to maximize document viewing area

### DMS Integration Points
- Document categories from T24/DMS simulation
- Verification workflow with audit trail integration
- Supported formats: PDF, images, scanned documents

---

## 14. Notifications Center

**File:** `edd_system/notifications_center.html` (611 lines)  
**JS Module:** `notifications_center.js`

### Notification Tabs
Tab-based filtering with active indicator (bottom cyan border)

### Two-Column Layout

**Left Column: Notification List**
- Scrollable list (max-height: 600px)
- Unread indicator: Cyan dot + subtle blue background
- Filter controls: status, type dropdowns

### Notification Types

| Type | Icon Background | Purpose |
|------|----------------|---------|
| SMS | Cyan (rgba) | SMS notifications to customers |
| App | Green (rgba) | In-app push notifications |
| Email | Amber (rgba) | Email correspondence |
| System | Red (rgba) | System alerts and warnings |

### Notification Item Structure
- Icon (type-coded)
- Title + Description (truncated with ellipsis)
- Metadata: timestamp, channel, status
- Status badges: `sent` (green), `pending` (amber), `failed` (red)

**Right Column: Notification Statistics/Details**
Summary panels and action controls

---

## 15. Executive Presentation

**File:** `edd_system/executive_presentation.html` (~1,620 lines)

### 12-Slide Board-Level Strategic Briefing

| Slide | Title | Content |
|-------|-------|---------|
| 1 | Title | "Digital Compliance Governance Framework" with regulatory badges |
| 2 | Agenda | 8-item navigable agenda |
| 3 | Executive Summary | Platform overview and strategic positioning |
| 4 | Workflow Architecture | End-to-end EDD workflow visualization |
| 5 | Risk Engine | ETL-based risk scoring architecture |
| 6 | Role Governance | Maker-Checker authorization model |
| 7 | Integration Architecture | T24, QCB, DMS, SnapView integration |
| 8 | Regulatory Governance Framework | 16 regulatory framework citations |
| 9 | CDD Decision Authority Model | CDD-centric decision framework |
| 10 | Strategic Impact | Business value and ROI metrics |
| 11 | Implementation Roadmap | Phase-wise deployment plan |
| 12 | Q&A | Contact and next steps |

### Navigation
- Keyboard: ← → arrow keys
- On-screen: Previous/Next buttons
- Slide counter: "Slide X of 12"
- Smooth transition animations

---

## 16. Risk Engine Architecture

**File:** `edd_system/js/risk_engine.js` (506 lines)

### CRITICAL DESIGN PRINCIPLE
> **"READS risk scores from Risk Engine via ETL — does NOT calculate them"**

The system displays risk scores received from the external Risk Engine via ETL pipeline. It does NOT auto-generate or modify risk scores.

### ETL Field Mapping

| ETL Field | Description | Type |
|-----------|-------------|------|
| RECORD_ID | Unique customer record | String |
| PROD_RISK_SCORE | Product risk score | Integer (0-500) |
| PROD_RISK_CATEG | Product risk category | LOW/MEDIUM/HIGH |
| ACT_RISK_SCORE | Activity risk score | Integer (0-500) |
| ACT_RISK_CATEG | Activity risk category | LOW/MEDIUM/HIGH |
| OCCP_RISK_SCORE | Occupation risk score | Integer (0-500) |
| OCCP_RISK_CATEG | Occupation risk category | LOW/MEDIUM/HIGH |
| COUNTRY_RISK_SCORE | Country risk score | Integer (0-500) |
| COUNTRY_RISK_CATEG | Country risk category | LOW/MEDIUM/HIGH |
| FINAL_RISK_SCORE | Final composite score | Integer (0-500) |
| FINAL_RISK_CATEG | Final risk category | LOW/MEDIUM/HIGH/AUTO HIGH |
| AUTO_HIGH_TRIGGER | Boolean auto-high flag | Boolean |
| TRIGGER_REASON | Auto-high trigger reason | String |
| LAST_SCORE_DATE | Last ETL score update | ISO Date |
| TARGET_DESC | Activity description | String |
| SECTOR | Business sector | String |
| INDUSTRY | Industry classification | String |

### Risk Thresholds

| Category | Score Range | Color | Hex |
|----------|-----------|-------|-----|
| LOW | 0 — 99 | Green | #4CAF50 |
| MEDIUM | 100 — 149 | Orange | #FFB300 |
| HIGH | 150+ | Red | #F44336 |

**Maximum Risk Score:** 500

### Key Functions

| Function | Purpose |
|----------|---------|
| `getRiskColor(category)` | Returns CSS color for risk level |
| `getRiskBgColor(category)` | Returns background color (20% opacity) |
| `getRiskPercentage(score)` | Calculates percentage of MAX (500) |
| `getPrimaryRiskDriver(scores)` | Identifies highest-scoring risk component |
| `getEDDActions(riskScores)` | Returns recommended EDD actions based on risk factors |
| `getRiskDescription(driver, customer)` | Provides context-aware description for risk drivers |
| `formatETLDate(isoDate)` | Formats ETL timestamp for display |

### EDD Action Recommendations

Actions are generated based on risk category per component:

| Component | HIGH Actions | MEDIUM Actions |
|-----------|-------------|----------------|
| Activity | Transaction Activity Analysis, Source of Funds Verification | Transaction Pattern Review |
| Occupation | Employment Verification, Income Source Documentation | Occupation Verification |
| Country | Country Risk Compliance Review, Cross-Border Transaction Monitoring | Geographic Risk Assessment |
| Product | Product Suitability Assessment | Product Suitability Review |

---

## 17. Decision Support System

**File:** `edd_system/js/decision_support.js` (607 lines)

### CRITICAL DESIGN PRINCIPLE
> **"This module implements a Decision Support System (DSS), NOT a Decision Engine."**
> **"FINAL DECISION = EMPLOYEE RESPONSIBILITY"**

### What the System DOES:
- Collects and presents data
- Displays behavioral indicators
- Highlights anomalies for review

### What the System does NOT:
- Generate automated risk scores
- Make automated decisions
- Override employee judgment

### Behavioral Indicators (10 Types)

| Code | Indicator | Category | Icon |
|------|-----------|----------|------|
| INC_MISMATCH | Income Mismatch | FINANCIAL | 💰 |
| ACT_EXCEEDS | Activity Exceeds Expected | ACTIVITY | 📊 |
| AML_POS | AML Positive Result | SCREENING | 🔴 |
| PEP | PEP Identified | SCREENING | 👔 |
| DORMANT | Dormant Account Reactivation | ACTIVITY | ⏰ |
| SAL_GAP | Salary Credit Gap | FINANCIAL | 📅 |
| HIGH_CASH | High Cash Activity | ACTIVITY | 💵 |
| MULTI_JURIS | Multiple Jurisdictions | GEOGRAPHIC | 🌍 |
| COMPLEX | Complex Relationship Structure | RELATIONSHIP | 🕸️ |
| OCC_SENS | Sensitive Occupation | PROFILE | ⚠️ |

### Bilingual Support
All indicators include Arabic translations (`titleAr` field) for regulatory reporting

---

## 18. Enterprise Features Module

**File:** `edd_system/js/enterprise_features.js` (2,291 lines)

### Role Governance System (7 Roles)

| Role | Arabic Name | Key Permissions | Restrictions |
|------|-------------|-----------------|--------------|
| Business Maker | صانع الأعمال | view, edit, add comment, submit | Cannot approve own |
| Business Checker | مدقق الأعمال | view, approve/reject business, escalate | Cannot approve own submission |
| CDD Maker | صانع CDD | view, edit CDD section, submit CDD | Cannot approve own |
| CDD Checker | مدقق CDD | view, approve/reject CDD, escalate to compliance | Cannot approve own submission |
| Compliance Review | مراجعة الالتزام | view all, final decision, freeze account, escalate management | None |
| Call Center View | عرض مركز الاتصال | view basic customer, salary, expected activity, account status | No risk score, no AML flags, no edit |
| IT Administrator | مدير تقنية المعلومات | system config, user management, audit logs, data export | No case decisions |

### Workflow Stages (7 Steps)

```
Created (SYSTEM) → Business Maker Review → Business Checker Approval →
CDD Maker Review → CDD Checker Approval → [Compliance Escalation — conditional] →
Case Completed (SYSTEM)
```

### Compliance Escalation Triggers
Cases auto-escalate to Compliance when ANY of these conditions are met:
- Customer is PEP
- Customer from Sanctioned Country
- Risk category = AUTO HIGH
- Case flagged for suspicion
- FINAL_RISK_SCORE > 400

### Additional Enterprise Features
- Financial Profile Display (T24/ETL sourced)
- Expected Activity Profile analysis
- Officer Digital Confirmation (PIN verification)
- Call Center View (restricted read-only)
- User Guide Module
- System Presentation framework

---

## 19. Form Validation Engine

**File:** `edd_system/js/form_validation.js` (656 lines)

### Regulatory Framework References

| Reference | Standard |
|-----------|----------|
| FATF_REC_10 | Customer Due Diligence |
| FATF_REC_11 | Record Keeping |
| FATF_REC_12 | PEP Requirements |
| FATF_REC_20 | Suspicious Transaction Reporting |
| FATF_REC_22 | DNFBPs CDD |
| QCB_AML | QCB AML/CFT Regulatory Framework |
| ISO_27001 | ISO 27001:2022 — Information Security Controls |
| BCBS_239 | BCBS 239 — Risk Data Aggregation |

### Validation Rules Registry

| Rule | Pattern | Severity | Regulatory Ref |
|------|---------|----------|---------------|
| QID | `^[23]\d{10}$` | Critical | FATF Rec 10 |
| IBAN_QA | `^QA\d{2}[A-Z]{4}\d{21}$` | Critical | BCBS 239 |
| PHONE_QA | `^(\+974\|974\|0)?[3-7]\d{7}$` | Warning | FATF Rec 11 |
| EMAIL | Standard email regex | Warning | FATF Rec 11 |
| RIM | `^RIM\d{6,}$` | Critical | BCBS 239 |
| CURRENCY | Numbers with optional commas | Warning | FATF Rec 20 |
| PERCENTAGE | 0-100 range | Warning | FATF Rec 10 |
| YEAR | 4-digit 1900-2099 | Warning | FATF Rec 11 |
| REQUIRED | Non-empty | Critical | FATF Rec 10 |
| COUNTRY_ISO | 2-letter ISO code | Warning | FATF Rec 10 |

### Severity Levels
- **Critical:** Blocks form submission, highlighted in red
- **Warning:** Allows submission with advisory, highlighted in amber

---

## 20. Integration Architecture

### Current Data Sources

```
┌────────────────────┐     ETL/API      ┌──────────────────────┐
│   T24 Core Banking │ ──────────────── │                      │
│  (Customer, KYC,   │                  │                      │
│   Accounts, Txns)  │                  │                      │
├────────────────────┤                  │   QIB EDD SYSTEM     │
│   QCB KYC API      │ ──── REST ────── │                      │
│  (Regulatory Data, │                  │   13 Screens         │
│   Sanctions, PEP)  │                  │   12 JS Modules      │
├────────────────────┤                  │   Mock Data Layer    │
│   DMS Repository   │ ──── API ─────── │                      │
│  (Documents,       │                  │                      │
│   Scans, Reports)  │                  │                      │
├────────────────────┤                  │                      │
│  SnapView / ETL    │ ── ETL Batch ─── │                      │
│  Risk Dataset      │                  │                      │
│  (Risk Scores)     │                  │                      │
└────────────────────┘                  └──────────────────────┘
```

### T24 Core Banking Integration

| Data Category | Fields | Update Frequency |
|--------------|--------|-----------------|
| Customer Profile | Name, QID, DOB, Nationality, Address, Phone, Email | Real-time |
| Account Data | Account numbers, balances, account type, status | Real-time |
| KYC Status | KYC level, expiry date, last review, risk rating | Daily batch |
| Transactions | Credit/debit history, patterns, volumes | Near real-time |
| Product Holdings | Active products, facilities, limits | Daily batch |

### QCB KYC API Integration

| Endpoint | Purpose | Frequency |
|----------|---------|-----------|
| `/kyc/sanctions/check` | Sanctions screening | Per-case trigger |
| `/kyc/pep/check` | PEP status verification | Per-case trigger |
| `/kyc/adverse-media` | Adverse media screening | Weekly batch |
| `/regulatory/reporting` | CTR/SAR submission | As-needed |
| `/compliance/circular` | Regulatory updates | On-publish |

### SnapView / ETL Risk Dataset

| ETL Job | Description | Schedule |
|---------|-------------|----------|
| Risk Score Refresh | 5-component risk score update | Daily 02:00 AM |
| Customer Profile Sync | T24 → EDD customer data | Every 4 hours |
| Transaction Aggregation | Pattern analysis data | Hourly |
| Sanctions List Update | OFAC/UN/EU list sync | Daily 06:00 AM |

### DMS Repository Integration

| Operation | Method | Use Case |
|-----------|--------|----------|
| Document Upload | REST API POST | New document attachment |
| Document Retrieve | REST API GET | Document viewer display |
| Metadata Query | REST API GET | Document list/search |
| Verification Stamp | REST API PATCH | Mark document as verified |

---

## 21. Security Architecture

### Authentication & Authorization

| Layer | Implementation |
|-------|---------------|
| Authentication | Username/Password + OTP (2FA) |
| Session Management | localStorage with expiry tokens |
| Authorization | Role-Based Access Control (RBAC) — 7 roles |
| Audit Trail | SHA-256 hash-chain with tamper detection |

### Data Classification

| Level | Data Types | Access |
|-------|-----------|--------|
| **Highly Confidential** | Risk scores, AML flags, compliance notes | Compliance + Management only |
| **Confidential** | Customer PII, financial data, case details | Role-based per workflow stage |
| **Internal** | Transaction patterns, KPI metrics | Authenticated users |
| **Restricted** | Call Center data view | Basic profile + salary only |

### Audit & Compliance Controls

| Control | Implementation |
|---------|---------------|
| Immutable Audit Trail | Hash-chain (each entry hashes previous) |
| Read-Only Audit View | Dedicated audit role, no edit capability |
| Action Logging | Every user action logged with IP + timestamp |
| Data Export Controls | Authorized roles only, logged in audit |
| Session Security | Auto-logout, device fingerprinting (production) |

---

## 22. Deployment Architecture

### Current Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | HTML5 / CSS3 / ES6+ JavaScript | — |
| 3D Animation | Three.js | r128 |
| Charts | Chart.js | 3.9.1 |
| Design System | Custom CSS with Glass-morphism | — |
| Development Server | Node.js HTTP | — |
| Hosting | Netlify (Static Deploy) | — |
| Version Control | Git / GitHub | — |

### File Structure

```
edd_system/
├── index.html                    # Entry redirect
├── login.html                    # Authentication portal
├── dashboard.html                # Operational dashboard
├── edd_case.html                 # EDD case analysis + form
├── business_view.html            # Business department view
├── cdd_view.html                 # CDD operations (Maker-Checker)
├── compliance_view.html          # Compliance review
├── kyc_monitoring.html           # KYC monitoring dashboard
├── management_dashboard.html     # Executive dashboard
├── audit_console.html            # Audit trail console
├── organization.html             # Organization structure
├── document_viewer.html          # DMS document viewer
├── notifications_center.html     # Notifications center
├── presentations.html            # Presentation launcher
├── executive_presentation.html   # 12-slide board briefing
├── css/
│   ├── edd_system.css            # Main stylesheet
│   └── login.css                 # Login-specific styles
├── js/
│   ├── mock_data.js              # T24/QCB/SnapView simulation (2,329 lines)
│   ├── enterprise_features.js    # Enterprise module (2,291 lines)
│   ├── enterprise_ui.js          # UI components
│   ├── risk_engine.js            # Risk score display (506 lines)
│   ├── decision_support.js       # DSS framework (607 lines)
│   ├── form_validation.js        # Validation engine (656 lines)
│   ├── audit_console.js          # Hash-chain audit (~550 lines)
│   ├── compliance_view.js        # Compliance + escalation analytics
│   ├── dashboard.js              # Dashboard controller
│   ├── business_view.js          # Business view controller
│   ├── cdd_view.js               # CDD operations controller
│   ├── edd_case.js               # EDD case controller
│   ├── management_dashboard.js   # Management controller
│   ├── document_viewer.js        # Document viewer controller
│   ├── notifications_center.js   # Notifications controller
│   ├── organization.js           # Organization controller
│   ├── organization_data.js      # Organization data
│   ├── transaction_activity.js   # Transaction analysis
│   ├── joint_accounts.js         # Joint account exposure
│   ├── export_reports.js         # Report generation
│   ├── login.js                  # Login controller
│   └── particles.js              # Three.js animation
└── assets/
    └── employees/                # Employee avatar images
```

### Performance Characteristics

| Metric | Target |
|--------|--------|
| Initial Load Time | < 2 seconds |
| Page Navigation | < 500ms (client-side) |
| Data Rendering | < 200ms (mock data) |
| Form Validation | Real-time (< 50ms) |
| Audit Hash Computation | < 100ms per entry |

---

## Appendix A: Mock Data Architecture

### Customer Records (from mock_data.js)

| RIM | Customer Name | Segment | Risk | PEP Status |
|-----|--------------|---------|------|------------|
| RIM001234 | Abdullah Mohammed Al-Kuwari | Private | AUTO HIGH (370) | Former Minister of Commerce |
| RIM005678 | Fatima Hassan Al-Sulaiti | Mass | MEDIUM (135) | Non-PEP |
| RIM009012 | Omar Khalid Al-Thani | Private | HIGH (285) | Active PEP |
| RIM003456 | Mariam Abdullah Al-Attiyah | Tamayuz | HIGH (175) | Non-PEP |
| RIM007890 | Youssef Ahmed Al-Emadi | Mass | LOW (85) | Non-PEP |
| RIM002345 | Noura Ibrahim Al-Mannai | Private | HIGH (220) | PEP Related |
| RIM006789 | Hassan Ali Al-Dosari | Tamayuz | MEDIUM (130) | Non-PEP |
| RIM004123 | Khalid Mohammed Al-Jaber | Mass | HIGH (190) | Non-PEP |

---

## Appendix B: Regulatory Compliance Matrix

| Regulation | System Coverage | Screen(s) |
|-----------|----------------|-----------|
| FATF Rec 10 (CDD) | Full | EDD Case, CDD View, Form Validation |
| FATF Rec 11 (Record Keeping) | Full | Audit Console, Form Validation |
| FATF Rec 12 (PEP) | Full | Compliance View, EDD Case |
| FATF Rec 20 (STR) | Partial | Compliance View, Decision Support |
| FATF Rec 22 (DNFBPs) | Covered | Form Validation |
| QCB AML/CFT | Full | All screens |
| QCB Circular 2024 | Full | KYC Monitoring, Compliance |
| Basel III/IV | Covered | Risk Engine, Management Dashboard |
| ISO 27001:2022 | Full | Authentication, Audit, Data Classification |
| BCBS 239 | Full | Risk Engine, Form Validation |

---

*Document prepared as part of the QIB Digital CDD/EDD Case Management Platform — Sovereign Banking Standard v2.0*  
*© 2025 Qatar Islamic Bank. All Rights Reserved.*
