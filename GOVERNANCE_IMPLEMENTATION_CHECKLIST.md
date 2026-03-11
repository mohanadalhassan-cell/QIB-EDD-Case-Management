# Governance Implementation Checklist
## External Risk Scoring & Data Source Transparency

**Document:** Governance Implementation Guide  
**Version:** 1.0  
**Date:** March 10, 2026  
**Audience:** Development Team, QA, Business Analysts, Compliance  
**Status:** ACTIVE — Enforce on all system changes

---

## Executive Summary

The QIB EDD Platform must consistently communicate that **risk scores originate from external systems (CRP, Core Banking, TM)** and this platform **only READS and DISPLAYS** risk data. This checklist ensures governance principle is applied consistently across:

- ✅ System Documentation (BRD, Architecture, Design Docs)
- ✅ User Interface (HTML pages, dashboards, forms)
- ✅ Source Code (Comments, naming conventions)
- ✅ Training Materials (User guides, presentations)
- ✅ Demo Environment (Sample data, simulations)
- ✅ Regulatory Communications (Compliance statements)

---

## Part A: Documentation Compliance

### A1. BRD Documentation

**File:** `BRD_Enterprise_Features.md` | Status: ✅ UPDATED

- [x] Section 2A added: "GOVERNANCE PRINCIPLE: External Risk Scoring"
- [x] Governing Statement clearly defines "Risk Reader" not "Risk Calculator"
- [x] List of external systems: CRP, Core Banking, TM, DMS, Regulatory
- [x] What platform DOES: Retrieve, Display, Analyze, Contextualize
- [x] What platform DOES NOT: Calculate, Modify, Override, Replace
- [x] Data Source Transparency Requirements documented
- [x] Enforcement Mechanism checklist provided

**Action Required:** ☐ Review with Compliance team, ☐ Obtain sign-off from CRO

---

### A2. System Architecture Document

**File:** `SYSTEM_ARCHITECTURE.md` | Status: ✅ UPDATED

- [x] Section 2.A added: "Risk Scoring Integration Architecture"
- [x] External Risk Systems Architecture diagram provided
- [x] Risk Score Data Flow table shows responsibilities
- [x] Data Source Transparency Requirements section added
- [x] System Role Definition (SHALL/SHALL NOT) clearly outlined
- [x] Data lineage and audit trail requirements specified

**Action Required:** ☐ Cross-check with IT Architecture team, ☐ Update system integration contracts

---

### A3. Functional Design Document

**File:** `SYSTEM_FUNCTIONAL_DESIGN.md` (if exists) | Status: ⏳ PENDING

**Checklist:**
- [ ] Add section on "Data Source Attribution"
- [ ] Include field-level documentation showing source system for each displayed value
- [ ] Document read-only enforcement for external risk fields
- [ ] Specify audit logging requirements for external data retrieval
- [ ] Define error handling for data source unavailability

**Action Required:** ☐ Create/Update design doc, ☐ Obtain design review approval

---

### A4. Integration Architecture Document

**File:** `EDD_Integration_Architecture.md` (if exists) | Status: ⏳ PENDING

**Checklist:**
- [ ] Document API contracts with CRP system
- [ ] Document data feed mechanisms from TM/Core Banking
- [ ] Specify data validation for incoming risk scores
- [ ] Define reconciliation procedures with source systems
- [ ] Document fallback behavior when source unavailable

**Action Required:** ☐ Create/Update integration scenarios, ☐ Establish SLAs with source system owners

---

## Part B: User Interface Compliance

### B1. Risk Display Pages

**Status: IN PROGRESS**

#### Page: `edd_case.html` | Status: ✅ UPDATED

- [x] Risk Analysis Panel header updated with "[External Source: CRP]"
- [x] GOVERNANCE DISCLOSURE box added below AUTO HIGH TRIGGER
- [x] All risk factor cards show source badges (🔵 CRP)
- [x] Script include added: `data_source_transparency.js`

**Remaining:**
- [ ] Add visual data source audit trail viewer
- [ ] Implement last-sync timestamp display
- [ ] Add "Verify with CRP" action button

---

#### Page: `dashboard.html` | Status: ⏳ PENDING

**Checklist:**
- [ ] Risk summaries show source system
- [ ] Risk metric cards include "[Source: CRP]" labels
- [ ] Add data source legend (🔵🟢🟡🟣🔴 = CRP/CBS/TM/DMS/REG)
- [ ] Include last data sync timestamp

---

#### Page: `risk_management.html` | Status: ⏳ PENDING

**Checklist:**
- [ ] Risk filter results show source system
- [ ] Risk list view includes "Data Source" column
- [ ] Add option to filter by data source (CRP only, etc.)
- [ ] Historical risk data shows source for each version

---

#### Page: `executive_dashboard.html` | Status: ⏳ PENDING

**Checklist:**
- [ ] Executive risk summary includes source attribution
- [ ] Portfolio risk metrics show aggregate sources
- [ ] Add compliance certificate: "Risk data from external systems"

---

#### Page: `cdd_view.html` | Status: ⏳ PENDING

**Checklist:**
- [ ] CDD recommendations show underlying external risk data sources
- [ ] Link to source system data inline
- [ ] Document that recommendations based on external risk scores

---

#### Page: `compliance_view.html` | Status: ⏳ PENDING

**Checklist:**
- [ ] Compliance alerts reference source system
- [ ] Risk trigger explanations include "Source: CRP/TM/etc."
- [ ] Audit trail shows external data retrieval events

---

### B2. Data Source Transparency Layer Integration

**File:** `js/data_source_transparency.js` | Status: ✅ CREATED (500+ lines)

- [x] Source definition library (CRP, Core Banking, TM, DMS, Regulatory)
- [x] createDataField() function with source badges
- [x] createRiskProfileWithSources() function
- [x] createAuditTrail() function for data lineage
- [x] createDataQualityBadge() function

**Implementation Status:**
- [x] Script created and included in edd_case.html
- [ ] Integrate into all other risk display pages
- [ ] Create wrapper functions for common use cases
- [ ] Add CSS styling helpers if needed

---

### B3. UI Text Standards

**Approved Terminology:**

| Term | Status | Usage |
|------|--------|-------|
| "Risk Reader" | ✅ APPROVED | To describe system role |
| "Risk Score Source: CRP" | ✅ APPROVED | In UI labels |
| "[External Source]" | ✅ APPROVED | As badge/label |
| "Retrieved Risk Data" | ✅ APPROVED | When describing scores |
| "Risk Calculation Engine" | ❌ FORBIDDEN | Never use for this system |
| "Internal Risk Score" | ❌ FORBIDDEN | Implies local calculation |
| "System-Generated Risk" | ❌ FORBIDDEN | Implies internal origin |
| "External Risk System" | ✅ APPROVED | To identify CRP/TM/etc. |

---

## Part C: Source Code Compliance

### C1. Code Comments & Documentation

**Pattern to follow:**

```javascript
/**
 * Risk Score Display Component
 * 
 * GOVERNANCE PRINCIPLE: Risk scores ORIGINATE from external systems (CRP, Core Banking, TM).
 * This function READS and DISPLAYS scores retrieved from external sources.
 * This system does NOT calculate or modify risk scores.
 * 
 * @param riskData - Risk score object from CRP (read-only)
 * @returns HTML element with source attribution
 */
function displayRiskScore(riskData) {
  // IMPORTANT: This is read-only data from CRP
  // Any modifications must come from source system
  const source = 'CRP'; // External system
  return createDataField(riskData.score, riskData.category, source);
}
```

**Checklist:**
- [ ] All risk-related functions have governance note in comments
- [ ] Source system clearly identified in JSDoc
- [ ] Read-only status documented
- [ ] No modification logic in risk score handling

---

### C2. Variable Naming Standards

**Conventions:**

| Pattern | Example | Status |
|---------|---------|--------|
| externalRiskScore | externalRiskScore_CRP | ✅ USE |
| riskData_source | riskData_source: 'CRP' | ✅ USE |
| ReadOnly_* | ReadOnly_RiskCategory | ✅ USE |
| *_ExternalSource | score_ExternalSource | ✅ USE |
| internalRiskScore | internalRiskScore | ❌ AVOID |
| calculatedRisk | calculatedRisk | ❌ AVOID |
| riskEngine | riskEngine | ❌ RENAME TO: riskDataReader |

---

### C3. File Structure Updates

**Files to Update:**

- [x] `js/data_source_transparency.js` — ✅ CREATED
- [ ] `js/risk_engine.js` — ⏳ ADD COMMENTS (no logic changes)
- [ ] `js/edd_data_model.js` — ⏳ ADD COMMENTS
- [ ] `js/risk_ui_components.js` — ⏳ ADD SOURCE ATTRIBUTES
- [ ] `js/sector_filter.js` — ⏳ ADD SOURCE ATTRIBUTION
- [ ] `js/risk_reports.js` — ⏳ UPDATE TERMINOLOGY

---

## Part D: Training & Collateral

### D1. User Training Materials

**Status: ⏳ PENDING**

**Checklist:**
- [ ] Create training slide: "System Architecture: Risk from External Systems"
- [ ] Create cheat sheet: "Understanding Risk Data Sources"
- [ ] Add section to User Manual: "What This System Does (and Doesn't Do)"
- [ ] Update FAQ: "Where does risk score come from?"
- [ ] Create video: 3-minute overview of risk data architecture

**Required Content:**
- System role as "Risk Reader and Compliance Investigation Tool"
- List of external risk systems (CRP, Core Banking, TM, DMS, Regulatory)
- How to interpret source badges (🔵🟢🟡🟣🔴)
- When to contact source system teams for data corrections

---

### D2. Presentation Materials

**Status: ⏳ PENDING**

**Checklist:**
- [ ] Update Executive Presentation: System role definition
- [ ] Update Board Presentation: Governance architecture diagram
- [ ] Update Compliance Presentation: Data source transparency
- [ ] Update Demo Presentation: Simulated external system feeds
- [ ] Create Risk Officer Briefing: "Platform does not replace risk systems"

**Key Diagram to Include:**

```
External Systems → EDD Platform → Employee Assessment
(Calculate Risk)  (Reads Risk)   (Human Decision)
```

---

### D3. Regulatory Compliance Materials

**Status: ⏳ PENDING**

**Checklist:**
- [ ] Create Compliance Notice: "Risk Scoring Governance"
- [ ] Prepare for Audit: "System role as Risk Intelligence Platform"
- [ ] Document for Regulators: Data lineage and audit trail capabilities
- [ ] Create Data Governance Statement: "Risk Score Origin & Integrity"

---

## Part E: Demo Environment

### E1. Sample Data Generation

**Status: ⏳ PENDING**

**Checklist:**
- [ ] Update demo data to simulate CRP data feed
- [ ] Add timestamps showing "Last synced from CRP"
- [ ] Create demo scenario: "System receives risk update from external CRP system"
- [ ] Demonstrate data source attribution in demo UI
- [ ] Show how demo "syncs" with simulated external systems

---

### E2. Integration Simulation

**Status: ⏳ PENDING**

**Checklist:**
- [ ] Create mock CRP API responses
- [ ] Simulate Core Banking data feeds
- [ ] Demonstrate TM alert integration
- [ ] Show data refresh from external sources
- [ ] Create demo viewer for "external system connection status"

---

## Part F: Validation & Verification

### F1. Testing Checklist

**UI Testing:**
- [ ] Risk score displays include source badge
- [ ] Source badges clickable → show data lineage
- [ ] Timestamp displays show "Last updated from CRP: [TIME]"
- [ ] Data quality badge appears (Verified/Stale/Error)
- [ ] Governance disclosure visible on case pages

**Content Testing:**
- [ ] Documentation uses approved terminology
- [ ] No "Risk Calculator" references in docs
- [ ] All system diagrams show external sources above platform
- [ ] Training materials emphasize external origin

**Code Testing:**
- [ ] Comments explain external source principle
- [ ] Variable names don't imply local calculation
- [ ] Risk data marked as read-only in code
- [ ] Audit logging captures data source info

---

### F2. Compliance Verification

**Compliance Team Review:**
- [ ] ☐ BRD governance section approved
- [ ] ☐ System architecture aligns with regulations
- [ ] ☐ Data lineage meets audit requirements
- [ ] ☐ Read-only risk data governance acceptable to CRO

**IT Architecture Review:**
- [ ] ☐ External system integrations documented
- [ ] ☐ API contracts specify read-only access
- [ ] ☐ Data validation for incoming risk scores
- [ ] ☐ Error handling for system unavailability

---

### F3. User Acceptance Testing (UAT)

**Checklist:**
- [ ] Users can identify risk data source from UI
- [ ] Users understand system is not calculating risk
- [ ] Users can navigate to external system for data corrections
- [ ] Users can explain system role in interviews

---

## Part G: Enforcement & Governance

### G1. Change Management

**For All Future Changes:**

**Before Implementation:**
1. ☐ Verify change doesn't imply local risk calculation
2. ☐ Ensure terminology aligns with governance principle
3. ☐ Check UI updates include source attribution
4. ☐ Add governance comments to code

**After Implementation:**
1. ☐ Update documentation if architecture changes
2. ☐ Verify UI testing includes source badge validation
3. ☐ Confirm all users understand external source of data
4. ☐ Document change in governance compliance log

---

### G2. Governance Compliance Log

**Track all governance-related changes:**

| Change # | Date | Component | Action | Status |
|----------|------|-----------|--------|--------|
| G001 | 2026-03-10 | BRD | Added Section 2A | ✅ Complete |
| G002 | 2026-03-10 | System Arch | Updated Risk Architecture | ✅ Complete |
| G003 | 2026-03-10 | edd_case.html | Added disclosure + badges | ✅ Complete |
| G004 | 2026-03-10 | JS Transparency Layer | Created module | ✅ Complete |
| G005 | TBD | dashboard.html | Add source indicators | ⏳ Pending |
| G006 | TBD | Training Materials | Update user guide | ⏳ Pending |

---

## Part H: Success Criteria

### H1. Success Metrics

**The governance principle is SUCCESSFULLY implemented when:**

✅ **Compliance Metrics:**
- [ ] 100% of risk score displays include source system indicator
- [ ] 0 occurrences of "risk calculator" terminology in docs
- [ ] All training materials emphasize external origin
- [ ] Audit team confirms governance compliance

✅ **User Understanding:**
- [ ] Users can identify data sources from UI
- [ ] Users understand system does NOT calculate risk
- [ ] Users know where to request risk corrections
- [ ] Support tickets show no confusion about system role

✅ **Documentation:**
- [ ] BRD, Architecture, Design docs all updated
- [ ] Code comments document external source principle
- [ ] Training materials reflect governance requirement
- [ ] Regulatory submissions highlight external risk architecture

✅ **Technical:**
- [ ] All risk fields marked as read-only in code
- [ ] Data lineage captured in audit trail
- [ ] External system integrations fully documented
- [ ] Error handling for data source issues defined

---

## Summary & Next Steps

### Timeline

| Phase | Deliverables | Target Date |
|-------|--------------|-------------|
| Phase 1 | Documentation updates | ✅ 2026-03-10 |
| Phase 2 | UI updates + data transparency layer | 2026-03-15 |
| Phase 3 | Training & presentation materials | 2026-03-20 |
| Phase 4 | Demo environment updates | 2026-03-25 |
| Phase 5 | Final compliance review & sign-off | 2026-03-31 |

### Approval Sign-Off

**Compliance Officer:** _____________________ Date: _______

**Chief Risk Officer:** _____________________ Date: _______

**IT Architecture Lead:** _____________________ Date: _______

**Business Sponsor:** _____________________ Date: _______

---

## Appendix: Governance Principle Statement (for all communications)

> **QIB EDD PLATFORM GOVERNANCE PRINCIPLE**
>
> This platform is a **Risk Intelligence and Compliance Investigation System**.
>
> It **READS** risk scores from external authoritative systems (CRP, Core Banking, Transaction Monitoring, Document Management).
>
> It does **NOT** calculate or generate risk scores internally.
>
> All risk data is displayed with **source attribution** (shows which external system provided the score), **last update timestamp**, and **data quality status**.
>
> The platform supports employees in conducting compliance investigations. **Final decisions remain the responsibility of authorized bank personnel.**
>
> Risk score corrections must be requested from the source system (e.g., CRP for customer risk profile changes).

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-10  
**Next Review:** 2026-04-30  
**Governance Owner:** Compliance & Risk Management Department
