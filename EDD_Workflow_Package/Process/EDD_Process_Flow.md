# EDD Process Flow Diagram
## Qatar Islamic Bank — EDD Digital Workflow
### March 2026

---

## End-to-End Process Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    EDD DIGITAL WORKFLOW — PROCESS FLOW                      │
│                    Qatar Islamic Bank                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


                        ┌─────────────────────────┐
                        │      EDD TRIGGER         │
                        │                          │
                        │  • T24 CRP (High Risk)   │
                        │  • Management Referral   │
                        │  • Periodic Due Date     │
                        │  • AML Alert             │
                        │  • Re-KYC Finding        │
                        └────────────┬─────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │   CASE CREATION          │
                        │   (Automatic)            │
                        │                          │
                        │  • Generate Case ID      │
                        │  • Fetch T24 Data        │
                        │  • Route to Segment      │
                        │  • Notify Business Team  │
                        └────────────┬─────────────┘
                                     │
                     ┌───────────────┼───────────────┐
                     │               │               │
                     ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │ MASS BANKING │ │   TAMAYUZ    │ │   PRIVATE    │
            │              │ │  (Priority)  │ │   BANKING    │
            │ SLA: 24h     │ │ SLA: 12h     │ │ SLA: 18h     │
            └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
                   │                │                │
                   └────────────────┼────────────────┘
                                    │
                                    ▼
                ┌───────────────────────────────────────┐
                │                                       │
                │  STAGE 1: BUSINESS REVIEW             │
                │                                       │
                │  RM / Branch Officer:                 │
                │  └─ Collect & verify documents        │
                │  └─ Identify discrepancies            │
                │  └─ Add verification notes            │
                │                                       │
                │  Business Analyst:                    │
                │  └─ Review RM notes                  │
                │  └─ Recommendation: MAINTAIN / EXIT  │
                │                                       │
                └──────────────────┬────────────────────┘
                                   │
                          ┌────────┴────────┐
                          │                 │
                          ▼                 ▼
                   ┌─────────────┐   ┌─────────────┐
                   │  MAINTAIN   │   │    EXIT     │
                   │(Proceed to  │   │  (Close &   │
                   │   CDD)      │   │  Document)  │
                   └──────┬──────┘   └─────────────┘
                          │
                          ▼
                ┌───────────────────────────────────────┐
                │                                       │
                │  STAGE 2: CDD REVIEW                  │
                │  (Maker/Checker Control)              │
                │                                       │
                │  CDD MAKER:                           │
                │  └─ Source of funds verification      │
                │  └─ Business relationship check       │
                │  └─ Transaction pattern analysis      │
                │  └─ PEP/Sanctions initial screen      │
                │  └─ Document deep-dive (if flagged)   │
                │  └─ Prepare CDD Report                │
                │                                       │
                │  CDD CHECKER:                         │
                │  └─ Review Maker findings             │
                │  └─ Validate documentation            │
                │  └─ Approve / Return for rework       │
                │  └─ CDD sign-off                      │
                │                                       │
                │  SLA: 24h standard / 48h deep-dive   │
                └──────────────────┬────────────────────┘
                                   │
                                   ▼
                ┌───────────────────────────────────────┐
                │                                       │
                │  STAGE 3: COMPLIANCE REVIEW           │
                │  (Final Regulatory Authority)         │
                │  (Maker/Checker Control)              │
                │                                       │
                │  COMPLIANCE OFFICER (Maker):          │
                │  └─ PEP screening (4+ databases)     │
                │  └─ Sanctions (OFAC, UN, EU, UK, QCB) │
                │  └─ AML/CTF assessment                │
                │  └─ FATCA/CRS review                  │
                │                                       │
                │  COMPLIANCE MANAGER (Checker):        │
                │  └─ Review findings                   │
                │  └─ Validate regulatory decisions     │
                │  └─ Approve / Escalate                │
                │                                       │
                │  COMPLIANCE HEAD (if High Risk):      │
                │  └─ PEP/Sanctions final authority     │
                │                                       │
                │  SLA: 24 hours                        │
                └──────────────────┬────────────────────┘
                                   │
                                   ▼
                ┌───────────────────────────────────────┐
                │                                       │
                │  STAGE 4: FINAL DECISION              │
                │                                       │
                │  ┌──────────────────────────────────┐ │
                │  │ ✅ APPROVED                      │ │
                │  │    Customer eligible              │ │
                │  │    T24 updated                    │ │
                │  ├──────────────────────────────────┤ │
                │  │ ⚠️ APPROVED WITH CONDITIONS       │ │
                │  │    Enhanced monitoring            │ │
                │  │    Account restrictions set       │ │
                │  ├──────────────────────────────────┤ │
                │  │ ❌ REJECTED                      │ │
                │  │    Customer not eligible          │ │
                │  │    Account action initiated       │ │
                │  ├──────────────────────────────────┤ │
                │  │ ⬆️ ESCALATE                       │ │
                │  │    Board Risk Committee review    │ │
                │  └──────────────────────────────────┘ │
                │                                       │
                │  T24 WRITEBACK:                       │
                │  └─ EDD status, decision, date       │
                │  └─ Account restrictions              │
                │  └─ Next EDD due date                 │
                │                                       │
                │  SLA: 8 hours                         │
                └───────────────────────────────────────┘


    ┌───────────────────────────────────────────────────────────────┐
    │  THROUGHOUT ALL STAGES:                                       │
    │  • Full audit trail (every action logged)                    │
    │  • SLA tracking (auto-escalation)                            │
    │  • Dashboard visibility (real-time)                          │
    │  • Notifications (email, SMS, mobile push)                   │
    │  • Risk Dashboard monitoring (Risk Group oversight)          │
    └───────────────────────────────────────────────────────────────┘
```

---

## Department Responsibility Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  TRIGGER ──→ BUSINESS ──→ CDD ──→ COMPLIANCE ──→ DECISION          │
│              │             │        │                                │
│              │             │        │                                │
│              ▼             ▼        ▼                                │
│         Document      Detailed   Regulatory                         │
│         Collection    Due        Screening                          │
│         & Initial     Diligence  & Final                            │
│         Review        & Report   Authority                          │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  RISK MANAGEMENT — MONITORING & GOVERNANCE                  │    │
│  │  Supervised by Mr. Rakesh                                   │    │
│  │  Dashboard • Alerts • Policy Approval • Audit Reporting    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

*Document Classification: Internal — QIB Confidential*  
*Version 1.0 | March 2026*
