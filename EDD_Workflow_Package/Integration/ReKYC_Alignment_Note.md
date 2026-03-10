# Re-KYC Alignment Note
## EDD Digital Workflow — Qatar Islamic Bank
### March 2026

---

## Purpose

This note clarifies the relationship between the **Re-KYC** process and the **EDD** process to ensure:
- No process duplication
- Clear process boundaries
- Efficient use of resources

---

## Process Distinction

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  RE-KYC and EDD are COMPLEMENTARY processes, not duplicates.             │
│                                                                           │
│  ┌────────────────────────────┐    ┌────────────────────────────┐        │
│  │        RE-KYC              │    │          EDD                │        │
│  │                            │    │                             │        │
│  │  • Periodic customer       │    │  • Triggered for high-risk │        │
│  │    information update      │    │    cases or discrepancies  │        │
│  │                            │    │                             │        │
│  │  • ALL customers           │    │  • SELECTED customers      │        │
│  │                            │    │    (risk-based)             │        │
│  │  • Scheduled cycle         │    │  • Event-driven            │        │
│  │    (1-3 years based on     │    │    (risk trigger)           │        │
│  │     risk category)         │    │                             │        │
│  │                            │    │  • Enhanced review with    │        │
│  │  • Standard data refresh   │    │    deep-dive investigation │        │
│  │                            │    │                             │        │
│  │  • Update KYC records      │    │  • Detailed assessment +  │        │
│  │                            │    │    compliance decision      │        │
│  └────────────────────────────┘    └────────────────────────────┘        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## How They Interact

```
SCENARIO 1: Re-KYC triggers EDD
───────────────────────────────
Re-KYC Review → Discrepancy Found → EDD Case Created → Enhanced Review

SCENARIO 2: EDD updates Re-KYC records
───────────────────────────────────────
EDD Completed → T24 Updated → Re-KYC Records Refreshed → Next Due Date Set

SCENARIO 3: Independent EDD trigger
────────────────────────────────────
T24 CRP High Risk → EDD Case Created (independent of Re-KYC cycle)
```

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **No duplicate data collection** | Both processes share the same T24 customer profile |
| **Single source of truth** | All document verification stored in DMS |
| **Complementary timing** | Re-KYC is periodic; EDD is event-driven |
| **Shared infrastructure** | Both use FLOW platform and ESB integrations |
| **Unified audit trail** | Both contribute to the same customer risk history |

---

## Summary

```
  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │  Re-KYC = Periodic customer information update             │
  │                                                            │
  │  EDD    = Triggered for high-risk cases or discrepancies   │
  │                                                            │
  │  GOAL:  Comprehensive coverage WITHOUT duplication         │
  │                                                            │
  └────────────────────────────────────────────────────────────┘
```

---

*Document Classification: Internal — QIB Confidential*  
*Version 1.0 | March 2026*
