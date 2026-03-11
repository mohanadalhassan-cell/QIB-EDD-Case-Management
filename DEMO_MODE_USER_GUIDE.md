# 🎬 DEMO MODE USER GUIDE - QIB EDD Platform

## Overview

The QIB EDD (Enhanced Due Diligence) platform now includes a **comprehensive Demo Mode** with auto-guided walkthroughs and BRD (Business Requirements Document) references. This guide enables executives, auditors, and system architects to quickly understand platform capabilities.

---

## 🚀 Quick Start: DEMO MODE

### 1. Access Login Page
Navigate to: `edd_system/login.html`

### 2. Select Demo Mode
You will see a **"DEMO MODE - Auto-Guided Walkthrough"** section at the bottom of the login card with:

```
🎬 DEMO MODE - Auto-Guided Walkthrough

[👤 Investigator] [📋 KYC Officer] [✔️ Compliance Mgr] [🔧 Admin]

🚀 START DEMO WALKTHROUGH (15 min)
```

### 3. Choose Your Role

| Role | Use Case | Workflow |
|------|----------|----------|
| **👤 Investigator** | Case investigation workflow | Login → Dashboard → Case Investigation → Evidence → Analysis → Decision |
| **📋 KYC Officer** | Customer onboarding flow | Login → Dashboard → KYC Form → Case Creation → Monitoring → View |
| **✔️ Compliance Manager** | Case oversight & SAR filing | Login → Dashboard → Case Monitoring → Escalations → SAR Filing → Reports |
| **🔧 Admin** | System administration | Login → Dashboard → Organization → User Management → Config → Audit Log |

**Demo Credentials (Auto-filled):**
- KYC Officer: `ahmed.thani` / `password123`
- Investigator: `Demo-2030` / `Qib@2030`
- Compliance Manager: `QIB2030` / `QIB2030`
- Admin: `admin` / `admin123`

### 4. Click "START DEMO WALKTHROUGH"

#### What Happens:
✅ All credentials are auto-filled  
✅ Role is auto-selected  
✅ OTP is auto-filled (123456)  
✅ System automatically logs in  
✅ Guided tour modal appears  

---

## 📖 How the Guided Tour Works

### Tour Duration: ~15 minutes

The system guides you through **6 steps** with:

1. **Step Progress Bar**
   - Shows current step (e.g., "Step 1 / 6")
   - Visual progress bar with percentage

2. **Step Title & Description**
   - Clear explanation of what you're learning
   - Context for why this step matters

3. **BRD Reference Card**
   - Links to specific COMPREHENSIVE_BRD_2026_FINAL.md section
   - Business requirement being demonstrated
   - Compliance status (✅ FATF 40, ✅ GDPR, etc.)
   - Features highlighted in this section

4. **🎯 What to Look For**
   - Bullet list of key UI elements
   - Fields and buttons to interact with
   - Visual elements to notice

5. **Navigation Controls**
   - ← **Back**: Review previous step
   - **Next →**: Advance to next step

### Example: Investigator Workflow

```
STEP 1: 🔐 Login & Authentication (2-3 min)
├─ Employee ID field (pre-filled)
├─ Password verification
├─ Role selection (Investigator)
└─ OTP verification (123456)

STEP 2: 📊 Executive Dashboard (2-3 min)
├─ KPI cards (Cases Open, At Risk Customers, Avg Days)
├─ Risk Portfolio pie chart
└─ Case SLA status bar

STEP 3: 🔍 Case Investigation - Phase 4 (4-5 min)
├─ Case Header (ID, Risk Score, SLA Timer)
├─ Risk Factors Panel (6-factor breakdown)
├─ Evidence Manager
├─ Transaction Analysis
├─ Financial Consistency Engine
└─ Investigation Decision

STEP 4: ✋ Compliance Decision - Phase 5 (2-3 min)
├─ Investigation Summary
├─ 4 Decision Options (Approve/Conditional/Reject/SAR)
├─ Decision Rationale
└─ SAR Filing Integration

STEP 5: 📈 Dashboard Analytics (2 min)
├─ Executive KPI trends
├─ Risk distribution charts
├─ Compliance metrics
└─ Team performance

STEP 6: 💼 Complete System Overview (2 min)
├─ All modules review
├─ Integration summary
└─ Next steps
```

---

## 📄 BRD References in Demo Mode

Each step links to the **COMPREHENSIVE_BRD_2026_FINAL.md** document with:

### Reference Structure

```
📄 BRD REFERENCE

Section 11: User Roles & Permissions (Page 460-475)

Requirement: 6-role RBAC matrix with 20+ permissions per role

Features:
🏷️ User Management
🏷️ Role Assignment  
🏷️ Permission Control

✅ ISO 27001 Certified
```

### Available BRD Sections

| Step | BRD Section | Coverage |
|------|------------|----------|
| Login | Section 11 | Authentication & MFA, 6-role RBAC |
| Dashboard | Section 5 | 6-factor Risk Scoring, KPI Tracking |
| KYC Form | Section 4 (Step 1) | Customer Onboarding, Auto-scoring |
| Case Creation | Section 6 (Phase 1) | Auto-case creation on HIGH RISK |
| Investigation | Section 6 (Phase 4) | 7-day investigation, Evidence review |
| Evidence | Section 7 | Document verification, Audit trail |
| Risk Analysis | Section 2B | Financial consistency engine |
| Decision | Section 6 (Phase 5) | Case conclusions, SAR filing |
| Monitoring | Section 4 (Step 4) | Transaction monitoring, Alerts |
| Analytics | Section 12 | Executive reporting & trends |
| Organization | Section 11 | User management & RBAC |
| SAR Filing | Section 6 (Phase 5) | Regulatory reporting |

---

## 🎯 Use Cases

### Executive Briefing (15-20 minutes)
**Recommended Role:** Investigator or Compliance Manager

1. Start demo with Investigator role
2. Follow all 6 steps to understand:
   - Case lifecycle (6 phases)
   - Risk assessment (6-factor model)
   - Compliance workflow
   - Investigation process
3. Reference BRD for detailed requirements
4. Review MASTER_SYSTEM_AUDIT_REPORT_2026.md for validation

### Auditor Review (20-30 minutes)
**Recommended Role:** Admin + Compliance Manager

1. Run Admin demo to see system configuration
2. Run Compliance Manager demo for governance view
3. Cross-reference with:
   - IT_DOCUMENTATION_LIBRARY_INDEX_2026.md (43 docs mapped)
   - MASTER_SYSTEM_AUDIT_REPORT_2026.md (Level 4 certification)

### Implementation Team (1-2 hours)
**Recommended Approach:**
1. Run all 4 demo roles sequentially
2. Review each step's BRD section
3. Map to local environment requirements
4. Check integration readiness notes

### Regulatory Compliance Validation
**Recommended Role:** Compliance Manager

1. Start Compliance Manager demo
2. For each step, review:
   - BRD compliance status
   - Regulatory alignment (FATF 40, GDPR, etc.)
3. Verify against local regulation requirements

---

## 💡 Features & Tips

### Auto-Fill Functionality
- All credentials are **automatically pre-filled**
- OTP code (123456) is **auto-entered**
- Role selection is **auto-selected**
- **No manual data entry required** - focus on understanding features

### Navigation
- **← Back Button**: Review previous steps anytime
- **Next → Button**: Proceed at your own pace
- **× Close Button**: Exit tour and explore freely
- **Progress Bar**: Visual indication of tour progress

### BRD Integration
Each step's BRD reference shows:
- ✅ **Compliance Status** (FATF, GDPR, ISO 27001, etc.)
- 📄 **BRD Section** with page numbers
- 📋 **Business Requirement** being implemented
- 🏷️ **Features** highlighted in this section

### Demo Modes
- **Auto Credentials**: System logs in automatically
- **Skip OTP**: OTP verification bypassed in demo
- **Guided Navigation**: Tour modal guides you step-by-step
- **BRD Context**: References available for each step

---

## 🔄 How to Use Demo Mode Multiple Times

1. **Restart Current Demo**: Close modal and click "← Back" repeatedly to review
2. **Switch Roles**: 
   - Close demo and refresh page
   - Select different role
   - Click "START DEMO WALKTHROUGH" again
3. **Manual Exploration**:
   - Complete the guided tour
   - Exit modal with "×" button
   - Use platform freely with demo credentials

---

## 📊 Demo Workflow Maps

### Investigator (Case Investigation)
```
LOGIN → DASHBOARD → INVESTIGATION → EVIDENCE → ANALYSIS → DECISION
     (6-factor)      (Phase 4)        (Docs)    (Financial)  (SAR)
     KPIs            Risk Factors     Upload    Consistency  Outcome
     Status          Details          Comments  Threshold    Deploy
```

### KYC Officer (Onboarding)
```
LOGIN → DASHBOARD → KYC FORM → SCORING → CASE CREATE → MONITOR
     (6-factor)     (Personal) (Auto)   (HIGH RISK)  (Alerts)
     KPIs          (Occupation)(6-factor)(SLA start) (Phase 4)
     Status        (Nationality)Output   (24h assign) (7 days)
```

### Compliance Manager (Oversight)
```
LOGIN → DASHBOARD → CASES → ESCALATE → SAR FILE → REPORT
     (6-factor)     (Monitor) (Review)  (Submit)  (KPIs)
     KPIs          (SLA)     (Decision) (OFAC)    (Trends)
     Status        (Alerts)  (Status)   (Timeline) (Compliance)
```

### Admin (System)
```
LOGIN → DASHBOARD → ORG → USERS → CONFIG → AUDIT
     (6-factor)    (View) (RBAC)  (System) (Log)
     KPIs          (Teams) (Roles) (Params) (History)
     Status        (Units) (Perms) (API)    (Trail)
```

---

## 🔗 Documentation Links

**Master Documents:**
- 📋 [COMPREHENSIVE_BRD_2026_FINAL.md](../COMPREHENSIVE_BRD_2026_FINAL.md) - Full requirements (500+ lines)
- 📊 [MASTER_SYSTEM_AUDIT_REPORT_2026.md](../MASTER_SYSTEM_AUDIT_REPORT_2026.md) - System audit & validation (300+ lines)
- 📚 [IT_DOCUMENTATION_LIBRARY_INDEX_2026.md](../IT_DOCUMENTATION_LIBRARY_INDEX_2026.md) - 43 documentation assets mapped

**Quick References:**
- **Glossary**: Section 14.1 in COMPREHENSIVE_BRD_2026_FINAL.md
- **Risk Model**: Section 5 in COMPREHENSIVE_BRD_2026_FINAL.md
- **Workflow**: Section 6 in COMPREHENSIVE_BRD_2026_FINAL.md
- **Regulatory**: Section 8 in COMPREHENSIVE_BRD_2026_FINAL.md

---

## ✅ Quality Assurance Checklist

Before sharing demo with stakeholders, verify:

- [ ] Login page loads correctly
- [ ] Demo role buttons appear
- [ ] "START DEMO WALKTHROUGH" button visible
- [ ] Clicking button auto-fills credentials
- [ ] Auto-login completes successfully
- [ ] Guided tour modal appears with Step 1
- [ ] Navigation buttons (Back/Next) work
- [ ] BRD reference card displays correctly
- [ ] Progress bar updates on each step
- [ ] All 6 steps can be reviewed
- [ ] Closing modal exits demo gracefully
- [ ] Credentials in file: `edd_system/js/demo-guidance.js`
- [ ] BRD references map to actual document sections

---

## 🎓 Training & Certification

### For End Users
Use demo mode as:
- **Pre-training**: Understand platform before formal training
- **Reference Guide**: Review steps anytime
- **Self-paced**: Take 15-20 minutes at your convenience

### For Trainers
Reference materials provided:
- Demo guidance system with 6-step workflows
- BRD mappings per feature
- Compliance status indicators
- Reference architecture diagrams

### For Auditors
Multi-level verification:
- ✅ Demo mode: Feature validation
- ✅ BRD document: Requirement mapping
- ✅ Audit report: System certification (Level 4)
- ✅ Documentation library: 43 supporting assets

---

## 🐛 Troubleshooting

### Demo mode not appearing?
- **Check**: JavaScript console for errors
- **Verify**: `js/demo-guidance.js` file exists
- **Ensure**: File is properly linked in login.html
- **Clear**: Browser cache and refresh

### Auto-login not working?
- **Check**: VALID_CREDENTIALS in demo-guidance.js
- **Verify**: Credential spelling matches exactly
- **Ensure**: OTP auto-fill inputs exist on page
- **Test**: Manual login with same credentials first

### BRD references not showing?
- **Check**: DEMO_CONFIG.brdReferences object
- **Verify**: Page types match step keys
- **Ensure**: BRD file exists and is properly formatted
- **Test**: Scroll to see if reference card is below initial view

### Next button disabled unexpectedly?
- **Check**: demoState.currentStep vs totalSteps
- **Verify**: advanceDemoStep() function executes
- **Ensure**: Button onclick handlers are attached
- **Test**: Check browser console for JavaScript errors

---

## 📞 Support

For questions about:
- **Demo Mode**: Check this guide
- **System Features**: See COMPREHENSIVE_BRD_2026_FINAL.md
- **Audit Results**: See MASTER_SYSTEM_AUDIT_REPORT_2026.md
- **Documentation**: See IT_DOCUMENTATION_LIBRARY_INDEX_2026.md

---

**Last Updated**: March 11, 2026  
**Version**: 1.0 - Initial Release  
**Status**: ✅ Production Ready  
**Certified**: LEVEL 4 - EDD Investigation Platform
