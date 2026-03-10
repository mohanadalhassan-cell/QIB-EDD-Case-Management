# Stakeholder Responsibility Summary
## EDD Digital Workflow — Qatar Islamic Bank
### March 2026

---

## Department Responsibilities

| # | Department | Role in EDD Process | Key Responsibilities | SLA |
|---|-----------|---------------------|-----------------------------------------------|-----|
| 1 | **Business Teams** (Mass / Tamayuz / Private) | Customer interaction and document collection | Collect KYC documents from customer, verify against DMS, identify discrepancies, add verification notes, make initial recommendation (MAINTAIN or EXIT) | 24h Mass / 12h Tamayuz / 18h Private |
| 2 | **CDD Operations** | Due diligence review and KYC updates | Source of funds verification, business relationship assessment, transaction pattern analysis, PEP/Sanctions initial screening, document deep-dive investigation, CDD report preparation (Maker/Checker) | 24h standard / 48h deep-dive |
| 3 | **Compliance** | High-risk case review and final authority | PEP screening (4+ databases), Sanctions screening (6 lists), AML/CTF assessment, FATCA/CRS review, regulatory decision, account restrictions, QCB reporting | 24 hours |
| 4 | **Risk Management** | Governance oversight and dashboard monitoring | Monitor risk indicators, review operational procedures, approve policy changes, enterprise risk scoring, change management governance | Ongoing |
| 5 | **Strategy & PMO** | Strategic alignment and project governance | Align with bank strategy, project milestone tracking, stakeholder coordination, implementation planning | Per project plan |
| 6 | **Marketing & Communications** | Customer communication management | Customer notification texts (SMS/Email), communication templates, customer experience alignment, outreach messaging | Per campaign |
| 7 | **IT** | Technical implementation and support | FLOW system configuration, ESB integration maintenance, T24 connectivity, DMS integration, system monitoring, technical troubleshooting | Per SLA agreement |

---

## Workflow Interaction Map

```
                    TRIGGER (T24 / Management / Periodic)
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  BUSINESS TEAMS                                               │
    │  (Mass / Tamayuz / Private Banking)                          │
    │                                                               │
    │  Action: Collect documents, verify, initial recommendation    │
    │  Output: Verification notes + MAINTAIN or EXIT decision       │
    └───────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  CDD OPERATIONS                                               │
    │  (Maker / Checker)                                           │
    │                                                               │
    │  Action: Detailed due diligence, risk assessment, report     │
    │  Output: CDD Report + Maker/Checker sign-off                 │
    └───────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  COMPLIANCE                                                   │
    │  (Officer / Manager / Head)                                  │
    │                                                               │
    │  Action: Regulatory screening, AML/CTF, final authority      │
    │  Output: Regulatory decision + T24 update + QCB reporting    │
    └───────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
    ┌───────────────────────────────────────────────────────────────┐
    │  FINAL DECISION                                               │
    │  Approved / Approved with Conditions / Rejected / Escalate   │
    └───────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────────────────────────────┐
    │  RISK MANAGEMENT — Monitoring & Governance — Mr. Rakesh      │
    │  (Oversees all stages via Risk Dashboard)                    │
    └───────────────────────────────────────────────────────────────┘
```

---

## Approval Required From

| Stakeholder | Required Action |
|-------------|----------------|
| Business Head (Retail Banking) | Review BRD + Process Flow |
| CDD Operations Manager | Review CDD procedures + SLA |
| Compliance Head | Review regulatory screening + authority matrix |
| Risk Management Head (Mr. Rakesh) | Review governance + dashboard |
| IT Head | Review FLOW integration + technical feasibility |
| Strategy & PMO | Review strategic alignment |
| Marketing & Communications | Review customer communication templates |

---

*Document Classification: Internal — QIB Confidential*  
*Version 1.0 | March 2026*
