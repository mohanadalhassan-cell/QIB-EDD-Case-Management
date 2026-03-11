# GOVERNANCE DIRECTIVE: External Risk Scoring & Data Source Transparency

**Version:** 1.0  
**Date:** March 10, 2026  
**Authority:** Enterprise Architecture & Governance  
**Classification:** MANDATORY FOR ALL SYSTEM DOCUMENTATION

---

## 📋 EXECUTIVE SUMMARY

The Digital CDD/EDD Case Management Platform operates as a **Risk Data Reader and Compliance Investigation Platform**, not as a risk scoring engine.

All risk scores are retrieved from **external authorized systems** and displayed with transparent data source indicators for governance and audit purposes.

---

## 🎯 CORE PRINCIPLE

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  RISK SCORING RESPONSIBILITY                    │
│  ────────────────────────────────────────      │
│                                                 │
│  ❌ NOT in Digital CDD/EDD Platform             │
│  ✅ In External Risk Systems:                   │
│      • Customer Risk Profiling (CRP)           │
│      • Core Banking Systems                    │
│      • Transaction Monitoring (TM)             │
│      • Enterprise Risk Platform                │
│      • Regulatory Datasets                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📊 SYSTEM ROLE DEFINITION

### What the Platform DOES:
- ✅ Retrieve risk scores from external systems
- ✅ Display risk information with data sources
- ✅ Perform analytical interpretation of existing data
- ✅ Identify behavioral indicators
- ✅ Highlight risk drivers and unusual activity
- ✅ Provide compliance investigation context
- ✅ Maintain audit trail of data lineage

### What the Platform DOES NOT:
- ❌ Calculate risk scores
- ❌ Generate risk classifications
- ❌ Modify external risk ratings
- ❌ Create new risk metrics
- ❌ Replace risk engines
- ❌ Store as authoritative risk source

---

## 🔌 EXTERNAL DATA SOURCES

### Source Systems:

| System | Provides | Status | Integration |
|--------|----------|--------|-------------|
| **CRP** (Customer Risk Profiling) | Risk Score, Category, Customer Profile | Authoritative | API/ETL |
| **Core Banking** | Account Info, Relationship Data | Authoritative | API/Snapshot |
| **TM** (Transaction Monitoring) | Activity Risk, Transaction Patterns | Authoritative | Data Feed |
| **Document Management** | KYC Documents, Compliance Files | Source | Integration |
| **Regulatory Datasets** | Sanctions, PEPs, Country Risk | External | File Import |

---

## 🏷️ DATA SOURCE TRANSPARENCY LAYER

Every data element displayed must indicate its source.

### Implementation Standard:

```html
<div class="data-field" data-source="CRP">
  <label>Customer Risk Score</label>
  <value>78/100</value>
  <source-indicator>Source: CRP (Customer Risk Profiling)</source-indicator>
</div>
```

### Visual Indicators:

```
🔵 CRP (Customer Risk Profiling)
🟢 Core Banking System
🟡 Transaction Monitoring
🟣 Document Management
🔴 External Regulatory (High Authority)
⚪ Internal Application
```

---

## 📋 DISPLAY REQUIREMENTS

### All Risk Data Must Show:

1. **Value** - The actual risk score/category
2. **Source System** - Which external system provided it
3. **Last Updated** - When data was last refreshed
4. **Authority Level** - Authoritative vs. Analytical
5. **Audit Trail** - Who accessed/when

### Example Display Format:

```
┌─────────────────────────────────────────┐
│ 🔵 CUSTOMER RISK PROFILE                │
├─────────────────────────────────────────┤
│                                         │
│ Risk Score:         78/100              │
│ Risk Category:      HIGH                │
│ Source:             CRP System          │
│ Last Updated:       2026-03-10 14:30   │
│ Authority:          AUTHORITATIVE       │
│ Data Quality:       VERIFIED            │
│                                         │
│ Risk Drivers:                           │
│  • High Risk Country   [CRP]            │
│  • Trading Activity    [CRP]            │
│  • Large Transactions  [TM]             │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔐 DATA GOVERNANCE RULES

### Rule 1: Read-Only Risk Scores
- Risk scores retrieved from external systems are **read-only**
- Platform cannot modify external risk ratings
- Updates must originate from source system

### Rule 2: Data Lineage
- Every risk attribute must trace back to source system
- Metadata must include:
  - Source system name
  - Extraction date/time
  - Data version
  - Verification status

### Rule 3: Audit Protection
- Access to risk data must be logged
- Modifications to displayed data must be tracked
- Source system alignment must be verified daily

### Rule 4: Master Data Governance
- External systems are **single source of truth**
- Platform acts as **trusted viewer**
- No local storage of risk calculations

---

## 🎯 USE CASE ALIGNMENT

### Use Case 1: EDD Case Review
```
Officer Opens Case
        ↓
Platform Retrieves Risk Data from CRP
        ↓
Display with Source Indicators
        ↓
Officer Reviews Risk Context
        ↓
Officer Performs Investigation
        ↓
Officer Documents Findings
        ↓
✅ Risk Score Remains Authoritative from CRP
```

### Use Case 2: Risk Monitoring
```
System Retrieves Risk Scores (Read-Only)
        ↓
Display Current Risk Status
        ↓
Compare vs. Historical (from CRP)
        ↓
Identify Changes/Trends
        ↓
Alert if Threshold Breached
        ↓
✅ Alert Triggered by CRP Change
```

---

## 📐 ARCHITECTURE PATTERN

```
┌──────────────────────────────────────────────────────────┐
│            ENTERPRISE RISK ECOSYSTEM                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │   CRP System     │  │  Core Banking    │             │
│  │  (Risk Scoring)  │  │   (Accounts)     │             │
│  └────────┬─────────┘  └────────┬─────────┘             │
│           │                      │                       │
│           └──────────┬───────────┘                       │
│                      │                                   │
│           ┌──────────▼──────────┐                        │
│           │  Data Integration   │                        │
│           │  Layer (API/ETL)    │                        │
│           └──────────┬──────────┘                        │
│                      │                                   │
│           ┌──────────▼──────────────────────┐            │
│           │  Digital CDD/EDD Platform      │            │
│           │  ─────────────────────────────  │            │
│           │  • Risk Data Reader              │            │
│           │  • Compliance Investigator       │            │
│           │  • Case Manager                  │            │
│           │  • Audit Trail Logger            │            │
│           └──────────────────────────────────┘            │
│                      │                                   │
│           ┌──────────▼──────────┐                        │
│           │   User Interface    │                        │
│           │  (Source Indicators)│                        │
│           └─────────────────────┘                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ IMPLEMENTATION CHECKLIST

### System Level:
- [ ] Remove all risk calculation logic
- [ ] Implement external data retrieval
- [ ] Add data source tracking
- [ ] Create audit logging
- [ ] Build data verification layer

### UI Level:
- [ ] Add source indicators to all risk displays
- [ ] Show last updated timestamp
- [ ] Display authority level (Authoritative/Analytical)
- [ ] Add data refresh indicators
- [ ] Create data quality badges

### Documentation Level:
- [ ] Update BRD with governance statement
- [ ] Revise architecture diagrams
- [ ] Update data dictionary
- [ ] Create integration documentation
- [ ] Add to presentation materials

### Demo Level:
- [ ] Simulate external system integration
- [ ] Display source indicators prominently
- [ ] Show data lineage examples
- [ ] Present audit trail concept

---

## 🚀 ENFORCEMENT MECHANISM

### All Documentation Must Include:

"The Digital CDD/EDD Platform does **not calculate risk scores**. All risk information is retrieved from external authorized systems including Customer Risk Profiling (CRP), Core Banking, and Transaction Monitoring. The platform acts as a **Risk Intelligence Viewer and Compliance Investigation Platform**."

### All UI Must Label:

"Risk Score Source: [System Name] | Last Updated: [Date/Time] | Authority: AUTHORITATIVE"

### All Presentations Must State:

"This is a compliance case management platform that reads risk data from enterprise risk systems. It does not replace or duplicate risk scoring functionality."

---

## 📞 GOVERNANCE CONTACT

For questions about this directive, contact:
- **Enterprise Architecture**
- **Compliance & Risk Governance**
- **Regulatory Alignment Team**

---

## 🔄 REVISION HISTORY

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | 2026-03-10 | Initial Governance Directive | Enterprise Arch |

---

**Status:** ACTIVE & MANDATORY  
**Compliance:** REQUIRED FOR ALL SYSTEM DOCUMENTATIONS
