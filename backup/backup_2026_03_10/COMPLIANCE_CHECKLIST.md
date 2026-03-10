# 📋 COMPLIANCE OFFICER — OPERATIONAL CHECKLIST
## Retail Risk Governance Platform (RRGP) — Qatar Islamic Bank
### Version 1.0 | March 2026 | Regulatory Compliance Manual

---

## 📑 TABLE OF CONTENTS

1. [Purpose & Scope](#1-purpose--scope)
2. [Compliance Officer Role](#2-compliance-officer-role)
3. [Pre-Review Checklist](#3-pre-review-checklist)
4. [PEP Screening Checklist](#4-pep-screening-checklist)
5. [Sanctions Screening Checklist](#5-sanctions-screening-checklist)
6. [AML / CTF Assessment Checklist](#6-aml--ctf-assessment-checklist)
7. [Document & Discrepancy Review](#7-document--discrepancy-review)
8. [Maker/Checker Process (Compliance)](#8-makerchecker-process-compliance)
9. [Compliance Decision Framework](#9-compliance-decision-framework)
10. [Account Restrictions & Conditions](#10-account-restrictions--conditions)
11. [QCB Regulatory Reporting](#11-qcb-regulatory-reporting)
12. [Quarterly Review Procedures](#12-quarterly-review-procedures)
13. [SLA & Escalation](#13-sla--escalation)
14. [Appendix: Decision Templates & Forms](#14-appendix-decision-templates--forms)

---

# 1. PURPOSE & SCOPE

## 1.1 Purpose

This checklist provides Compliance Officers with structured, step-by-step procedures for performing **final regulatory compliance review** on EDD cases. Compliance is the **last control gate** before the Approver makes the final account decision. Every determination must be defensible against QCB (Qatar Central Bank) audit.

## 1.2 Scope

```
This checklist covers:
✅ Final PEP (Politically Exposed Person) screening
✅ Sanctions checking (OFAC, UN, QCB local lists)
✅ AML (Anti-Money Laundering) assessment
✅ CTF (Counter-Terrorist Financing) check
✅ Currency control verification
✅ CDD findings validation
✅ Account restriction decisions
✅ QCB regulatory reporting
✅ Maker/Checker compliance controls
✅ Quarterly review scheduling

This checklist does NOT cover:
❌ Document collection (RM Guide)
❌ CDD due diligence procedures (CDD Manual)
❌ Account opening execution (Operations)
❌ Transaction monitoring (separate system)
```

## 1.3 Authority

```
Compliance is the FINAL AUTHORITY on regulatory matters:
├─ No case can reach Approver without Compliance sign-off
├─ Compliance can REJECT regardless of Business/CDD recommendation
├─ Compliance can RESTRICT account capabilities
├─ Compliance decisions CANNOT be overridden by Business or CDD
├─ Only Compliance Head can escalate to Board level
└─ All determinations are final and auditable
```

---

# 2. COMPLIANCE OFFICER ROLE

## 2.1 Authority Matrix

```
┌──────────────────┬──────────┬───────────────┬──────────────┐
│ Risk Level       │ Officer  │ Manager       │ Head         │
├──────────────────┼──────────┼───────────────┼──────────────┤
│ Low Risk         │ ✓ Final  │ Auto-approve  │ Auto-approve │
│ Medium Risk      │ ✓ Final  │ ✓ Audit trail │ Auto-approve │
│ High Risk        │ Prepare  │ ✓ Final       │ Auto-approve │
│ PEP/Sanctions    │ Prepare  │ ✓ Review      │ ✓ Final      │
│ Strategic Exit   │ —        │ —             │ ✓ Final      │
│ Board Referral   │ —        │ —             │ ✓ Escalate   │
└──────────────────┴──────────┴───────────────┴──────────────┘

Note: "Prepare" = Performs review, submits to higher authority
      "✓ Final" = Has signing authority for this risk level
      "Auto-approve" = No additional sign-off required
```

## 2.2 System Permissions

```
✅ COMPLIANCE OFFICER CAN:
   ├─ View all cases in Compliance review queue
   ├─ Access full case history (all stages)
   ├─ Review CDD findings and CDD Checker sign-off
   ├─ Perform PEP/Sanctions definitive screening
   ├─ Perform AML/CTF assessment
   ├─ Make regulatory compliance determination
   ├─ Set account restrictions
   ├─ Approve/reject based on regulations
   ├─ Escalate to Compliance Manager/Head
   ├─ Generate QCB reports
   └─ Route to Final Approver

❌ COMPLIANCE OFFICER CANNOT:
   ├─ Make business decisions (only regulatory)
   ├─ Override previous stage findings without evidence
   ├─ Approve high-risk/PEP without Manager sign-off
   ├─ Access cases not in Compliance queue
   ├─ Delete or modify audit trail
   └─ Close cases without Approver decision
```

## 2.3 Mandatory Training

```
BEFORE PERFORMING COMPLIANCE REVIEW:
├─ QCB AML/CTF Certification (annual renewal)
├─ FATF Recommendations Training
├─ Sanctions Screening Certification (World-Check/Dow Jones)
├─ PEP Identification and Assessment
├─ RRGP Compliance Module Training
├─ Data Protection and Privacy
└─ Ethics and Professional Conduct
```

---

# 3. PRE-REVIEW CHECKLIST

## Before Starting Any Case Review

```
CASE RECEIPT VERIFICATION:
□ Case arrived from CDD (not skipped any stage)
□ CDD Checker has approved the case (digital signature present)
□ All required documents are attached
□ CDD Report is complete (all 9 sections)
□ Risk assessment is current (not outdated)
□ No pending customer document requests
□ No pending RM verification requests
□ Case is within Compliance SLA window

CASE PACKAGE ITEMS (must be present):
□ 1. Customer KYC application (original submission)
□ 2. RM Document Verification notes
□ 3. Business Team recommendation
□ 4. CDD Enhanced Due Diligence Report
□ 5. CDD Checker approval (with digital signature)
□ 6. Risk assessment (original + CDD-updated)
□ 7. All customer documents (uploaded to case)
□ 8. Contact center interaction notes (if call was made)
□ 9. T24 synchronization confirmation
□ 10. Document deep-dive report (if discrepancies existed)

IF ANY ITEM IS MISSING:
├─ Do NOT proceed with review
├─ Return case to CDD with specific missing item
├─ Note: "Case returned — missing [item]"
└─ SLA clock pauses until resubmitted
```

---

# 4. PEP SCREENING CHECKLIST

## 4.1 PEP Database Screening

```
MANDATORY: Screen customer against ALL of the following:

□ 1. World-Check (Refinitiv) — Global PEP database
     ├─ Search by: Full name + DOB + Nationality
     ├─ Check: All name variations (Arabic + English)
     ├─ Result: □ NO MATCH  □ POTENTIAL MATCH  □ CONFIRMED MATCH
     └─ Reference: [World-Check search ID]

□ 2. Dow Jones Risk & Compliance
     ├─ Search by: Full name + QID/Passport number
     ├─ Check: PEP category + subcategory
     ├─ Result: □ NO MATCH  □ POTENTIAL MATCH  □ CONFIRMED MATCH
     └─ Reference: [DJ search ID]

□ 3. QCB PEP Watch List (Local)
     ├─ Search by: QID Number + Full Name
     ├─ Check: Qatar-specific PEP list
     ├─ Result: □ NO MATCH  □ POTENTIAL MATCH  □ CONFIRMED MATCH
     └─ Reference: [QCB list date]

□ 4. QIB Internal PEP List
     ├─ Search by: QID + Name + Employer
     ├─ Check: Previously identified PEPs
     ├─ Result: □ NO MATCH  □ POTENTIAL MATCH  □ CONFIRMED MATCH
     └─ Reference: [Internal list version]

□ 5. Customer's Self-Declaration (from KYC form)
     ├─ Customer declared PEP: □ YES  □ NO
     ├─ If YES: Check matches screening results
     └─ If NO but screening shows PEP: FLAG as undisclosed PEP
```

## 4.2 PEP Classification

```
IF PEP MATCH FOUND, classify:

□ PEP CATEGORY:
  ├─ □ Current Head of State / Government
  ├─ □ Senior Government Official
  ├─ □ Senior Political Party Member
  ├─ □ Senior Military Official
  ├─ □ Senior Judicial Official
  ├─ □ Senior Central Bank Official
  ├─ □ Ambassador / Diplomat
  ├─ □ Board of State-Owned Enterprise
  └─ □ Senior Executive of International Organization

□ PEP RELATIONSHIP:
  ├─ □ PEP directly (the person themselves)
  ├─ □ Family member of PEP (spouse, parent, child, sibling)
  ├─ □ Close associate of PEP (business partner, advisor)
  └─ □ Former PEP (no longer in position)

□ PEP STATUS:
  ├─ □ Current (active political position)
  ├─ □ Former (within 2 years of leaving office)
  ├─ □ Former (more than 2 years since leaving office)
  └─ □ Deceased PEP's family member

□ PEP JURISDICTION:
  ├─ □ Domestic (Qatar)
  ├─ □ Foreign (other country — specify: _____________)
  └─ □ International organization
```

## 4.3 PEP Risk Assessment

```
FOR EACH PEP MATCH, assess:

□ Source of wealth consistent with political position?
  ├─ □ YES — Consistent with role/position
  ├─ □ PARTIALLY — Some unexplained wealth indicators
  └─ □ NO — Wealth inconsistent with position → FLAG

□ Adverse media present?
  ├─ □ NO adverse media found
  ├─ □ Minor media mentions (not negative)
  └─ □ Adverse media found → Document and FLAG

□ Corruption Perception Index of home country?
  ├─ □ Low corruption risk (CPI > 60)
  ├─ □ Medium corruption risk (CPI 30-60)
  └─ □ High corruption risk (CPI < 30) → FLAG

□ PEP risk determination:
  ├─ □ ACCEPTABLE RISK — Proceed with enhanced monitoring
  ├─ □ ELEVATED RISK — Proceed with restrictions + quarterly review
  ├─ □ UNACCEPTABLE RISK — Recommend rejection
  └─ □ REQUIRES FURTHER REVIEW — Escalate to Compliance Manager
```

---

# 5. SANCTIONS SCREENING CHECKLIST

## 5.1 Sanctions Database Screening

```
MANDATORY: Screen against ALL of the following:

□ 1. OFAC SDN List (Office of Foreign Assets Control)
     ├─ URL: https://sanctionssearch.ofac.treas.gov/
     ├─ Search by: Full name + Alt names + DOB + Country
     ├─ Result: □ NO MATCH  □ POTENTIAL MATCH  □ CONFIRMED MATCH
     └─ Reference: [OFAC search timestamp]

□ 2. UN Consolidated Sanctions List
     ├─ URL: https://www.un.org/securitycouncil/sanctions
     ├─ Search by: Full name + DOB + Country
     ├─ Result: □ NO MATCH  □ POTENTIAL MATCH  □ CONFIRMED MATCH
     └─ Reference: [UN list date]

□ 3. EU Sanctions List
     ├─ URL: https://data.europa.eu/data/datasets/consolidated-list-of-sanctions
     ├─ Search by: Full name + Country
     ├─ Result: □ NO MATCH  □ POTENTIAL MATCH  □ CONFIRMED MATCH
     └─ Reference: [EU list version]

□ 4. UK HM Treasury Sanctions List
     ├─ Search by: Full name + DOB
     ├─ Result: □ NO MATCH  □ POTENTIAL MATCH  □ CONFIRMED MATCH
     └─ Reference: [HMTS list date]

□ 5. QCB Restricted Entities List (Local)
     ├─ Search by: QID + Full name
     ├─ Result: □ NO MATCH  □ POTENTIAL MATCH  □ CONFIRMED MATCH
     └─ Reference: [QCB list version]

□ 6. QIB Internal Blacklist
     ├─ Search by: QID + Full name + Phone number
     ├─ Result: □ NO MATCH  □ POTENTIAL MATCH  □ CONFIRMED MATCH
     └─ Reference: [Internal list version]
```

## 5.2 Sanctions Match Handling

```
IF NO MATCHES FOUND:
├─ Document: "No sanctions matches found across all databases"
├─ Record all search references
├─ Proceed to AML/CTF assessment
└─ Status: CLEARED

IF POTENTIAL MATCH FOUND:
├─ Do NOT auto-reject
├─ Investigate match quality:
│  ├─ □ Name match only (common name) → Verify with additional identifiers
│  ├─ □ Name + DOB match → Higher confidence, investigate further
│  ├─ □ Name + DOB + Country match → Very high confidence
│  ├─ □ QID/Passport number match → CONFIRMED match
│  └─ □ Multiple database matches → CONFIRMED match
│
├─ For common name matches:
│  ├─ Compare: Full name (including middle names)
│  ├─ Compare: Date of birth (exact match required)
│  ├─ Compare: Nationality
│  ├─ Compare: Physical description (if available)
│  └─ If CLEARED (false positive): Document rationale
│
└─ Document: All investigation steps and conclusion

IF CONFIRMED MATCH FOUND:
┌──────────────────────────────────────────────────────────────┐
│  ⛔ MANDATORY ACTIONS FOR CONFIRMED SANCTIONS MATCH          │
│                                                              │
│  1. STOP all processing immediately                          │
│  2. Do NOT inform the customer                               │
│  3. Do NOT approve any transactions                          │
│  4. Notify Compliance Manager IMMEDIATELY (phone call)       │
│  5. Notify Compliance Head within 1 hour                     │
│  6. File in RRGP: "Sanctions Match — Case Frozen"            │
│  7. Prepare QCB notification (within 24 hours)               │
│  8. Engage Legal department                                  │
│  9. Preserve all evidence                                    │
│  10. Follow bank's Sanctions Policy procedures               │
│                                                              │
│  DO NOT attempt to resolve or clear a confirmed match.       │
│  This requires Compliance Head + Legal + QCB coordination.   │
└──────────────────────────────────────────────────────────────┘
```

---

# 6. AML / CTF ASSESSMENT CHECKLIST

## 6.1 Anti-Money Laundering Assessment

```
ASSESS EACH FACTOR AND DOCUMENT FINDINGS:

□ 1. CUSTOMER RISK PROFILE
  ├─ Risk score from system: [Score] / 100
  ├─ CDD risk assessment: [LOW / MEDIUM / HIGH / CRITICAL]
  ├─ Risk factors identified:
  │  ├─ □ High-risk nationality
  │  ├─ □ PEP status
  │  ├─ □ High-risk occupation
  │  ├─ □ Unusual activity ratio
  │  ├─ □ Unclear source of funds
  │  ├─ □ FATCA indicators
  │  └─ □ Suspicious transaction patterns
  └─ Assessment: [Acceptable / Elevated / Unacceptable]

□ 2. SOURCE OF FUNDS REVIEW
  ├─ CDD verified source: [YES / NO / PARTIAL]
  ├─ Source consistent with profile: [YES / NO]
  ├─ Source documentation adequate: [YES / NO]
  ├─ Any unexplained wealth: [YES / NO]
  └─ Assessment: [Clear / Requires monitoring / Suspicious]

□ 3. TRANSACTION PROFILE
  ├─ Expected monthly volume: QAR [Amount]
  ├─ Ratio to declared income: [Ratio]
  ├─ Cash handling expected: [YES / NO]
  ├─ International transfers expected: [YES / NO]
  ├─ Destinations of transfers: [Countries]
  └─ Assessment: [Normal / Elevated / Suspicious]

□ 4. BUSINESS RELATIONSHIP PURPOSE
  ├─ Account purpose clear: [YES / NO]
  ├─ Purpose consistent with profile: [YES / NO]
  ├─ Legitimate business need: [YES / NO]
  └─ Assessment: [Acceptable / Questionable / Unacceptable]

□ 5. GEOGRAPHIC RISK
  ├─ Customer nationality: [Country] — Risk: [Level]
  ├─ Country of residence: [Country] — Risk: [Level]
  ├─ Business operations country: [Country] — Risk: [Level]
  ├─ Transfer destination countries: [Countries] — Risk: [Levels]
  ├─ Tax residency: [Country] — Risk: [Level]
  └─ Assessment: [Low / Medium / High]
```

## 6.2 Counter-Terrorist Financing Assessment

```
□ 1. CTF SCREENING
  ├─ Customer screened against CTF databases: [YES]
  ├─ Databases checked:
  │  ├─ □ UN Al-Qaida/ISIL Sanctions List
  │  ├─ □ FATF High-Risk Jurisdictions
  │  ├─ □ QCB CTF Watch List
  │  └─ □ National CTF List
  ├─ Result: □ CLEAR  □ POTENTIAL MATCH  □ CONFIRMED MATCH
  └─ Reference numbers: [List all]

□ 2. CTF RISK INDICATORS
  ├─ □ Connection to conflict zones
  ├─ □ Transfers to/from high-risk jurisdictions
  ├─ □ Structured transactions below reporting thresholds
  ├─ □ Rapid movement of funds with no business purpose
  ├─ □ Purchase of monetary instruments in small amounts
  ├─ □ Use of nominees or shell companies
  └─ □ Link to NGOs in high-risk areas

□ 3. CTF ASSESSMENT
  ├─ CTF risk level: [LOW / MEDIUM / HIGH / CRITICAL]
  ├─ Justification: [Brief explanation]
  └─ Action: [Clear / Enhanced monitoring / Freeze / Report]
```

## 6.3 Currency Control Verification

```
□ 1. FATCA CHECK (if US person indicators)
  ├─ US person indicators:
  │  ├─ □ US citizenship
  │  ├─ □ US green card holder
  │  ├─ □ US tax residency
  │  ├─ □ US phone number
  │  ├─ □ US address
  │  └─ □ US birthplace
  ├─ FATCA classification: □ US Person  □ Non-US Person
  ├─ W-8BEN / W-9 obtained: □ YES  □ NO  □ N/A
  └─ FATCA reporting required: □ YES  □ NO

□ 2. CRS CHECK (Common Reporting Standard)
  ├─ Tax residency outside Qatar: □ YES  □ NO
  ├─ Country of tax residency: [Country]
  ├─ TIN provided: □ YES  □ NO
  ├─ CRS reporting required: □ YES  □ NO
  └─ Self-certification form signed: □ YES  □ NO

□ 3. CURRENCY TRANSFER CONTROLS
  ├─ Expected international transfers: □ YES  □ NO
  ├─ Transfer destinations: [Countries]
  ├─ Restricted destinations identified: □ YES  □ NO
  ├─ Controls needed: [List]
  └─ Assessment: [Clear / Restrictions needed]
```

---

# 7. DOCUMENT & DISCREPANCY REVIEW

## 7.1 Compliance Document Review

```
REVIEW ALL DOCUMENTS WITH REGULATORY LENS:

□ 1. ID VERIFICATION
  ├─ ID type: [QID / Passport / Other]
  ├─ ID number: [Number]
  ├─ ID valid (not expired): □ YES  □ NO
  ├─ ID matches KYC application: □ YES  □ NO
  ├─ RM verified: □ YES  Date: [Date]
  ├─ CDD verified: □ YES  Date: [Date]
  └─ Compliance assessment: [Valid / Invalid / Concerns]

□ 2. DOCUMENT DISCREPANCY REVIEW (if flagged by RM/CDD)
  ├─ Discrepancies identified: □ YES  □ NO
  ├─ If YES:
  │  ├─ CDD deep-dive performed: □ YES  □ NO
  │  ├─ CDD Checker validated findings: □ YES  □ NO
  │  ├─ Discrepancy resolution:
  │  │  ├─ □ RESOLVED — Legitimate explanation confirmed
  │  │  ├─ □ PARTIALLY RESOLVED — Some concerns remain
  │  │  └─ □ UNRESOLVED — Concerns not addressed
  │  │
  │  ├─ Compliance impact assessment:
  │  │  ├─ □ No regulatory impact
  │  │  ├─ □ Minor impact — proceed with monitoring
  │  │  ├─ □ Significant impact — restrictions needed
  │  │  └─ □ Critical impact — recommend rejection
  │  │
  │  └─ Compliance notes on discrepancies: [Detailed assessment]
  │
  └─ If NO: Note "No discrepancies — documents verified by RM and CDD"

□ 3. SOURCE DOCUMENTATION ADEQUACY
  ├─ All required documents present: □ YES  □ NO
  ├─ Documents support customer's claims: □ YES  □ PARTIALLY  □ NO
  ├─ Documentation sufficient for regulatory requirements: □ YES  □ NO
  └─ Additional documents needed: □ YES (specify)  □ NO
```

---

# 8. MAKER/CHECKER PROCESS (COMPLIANCE)

## 8.1 Compliance Maker (Compliance Officer)

```
COMPLIANCE MAKER PROCESS:

Step 1: Receive case from CDD with Checker approval
        □ Verify CDD Checker digital signature present
        □ Verify case package is complete

Step 2: Perform regulatory compliance review
        □ Complete PEP Screening Checklist (Section 4)
        □ Complete Sanctions Screening Checklist (Section 5)
        □ Complete AML/CTF Assessment Checklist (Section 6)
        □ Complete Document & Discrepancy Review (Section 7)
        □ Complete Currency Control Verification

Step 3: Document findings
        □ Write Compliance Assessment Report
        □ Include all screening references
        □ Document risk classification
        □ State regulatory findings

Step 4: Determine restrictions (if any)
        □ Enhanced transaction monitoring required? [YES / NO]
        □ Transaction limits needed? [YES / NO]
        □ Periodic review required? [Quarterly / Annual / None]
        □ Reporting obligations? [QCB / FATCA / CRS / None]

Step 5: Make compliance recommendation
        □ APPROVED — No regulatory concerns
        □ APPROVED WITH CONDITIONS — Restrictions/monitoring
        □ REJECTED — Regulatory compliance failure
        □ ESCALATE — Requires Manager/Head review

Step 6: Submit to Compliance Manager (Checker)
        □ Apply digital signature
        □ Submit for review
        □ Note: For low-risk, non-PEP → Officer has final authority
```

## 8.2 Compliance Checker (When Required)

```
COMPLIANCE CHECKER IS REQUIRED FOR:
├─ PEP/Sanctions matches (any match)
├─ High-risk customers (score ≥ 60)
├─ Document discrepancies needing escalation
├─ Any case with account restrictions
├─ Rejection recommendations
└─ Cases with QCB reporting requirements

COMPLIANCE CHECKER (Manager) PROCESS:

Step 1: Receive case from Compliance Officer
        □ Review Officer's compliance assessment
        □ Verify all checklists completed
        □ Verify screening references

Step 2: Validate determinations
        □ PEP classification correct
        □ Sanctions screening thorough
        □ AML/CTF assessment adequate
        □ Restrictions appropriate
        □ QCB reporting assessed correctly

Step 3: Decision
        □ APPROVED — Sign off, route to Final Approver
        □ REQUEST REVISION — Return with specific comments
        □ ESCALATE TO HEAD — Complex/strategic decision needed
        □ REJECTED — Final rejection (with Manager authority)

Step 4: Sign-off
        □ Apply digital signature
        □ Document decision rationale
        □ Case automatically routes to Final Approver
```

## 8.3 Compliance Head (When Escalated)

```
COMPLIANCE HEAD REVIEW IS REQUIRED FOR:
├─ PEP/Sanctions confirmed matches
├─ Strategic customer exits
├─ Board-level referrals
├─ Regulatory query responses
├─ QCB reporting disputes
└─ Cases with >QAR 5M exposure

COMPLIANCE HEAD ACTIONS:
├─ Final PEP/Sanctions determination
├─ Board referral if needed
├─ QCB communication authorization
├─ Strategic relationship decision
├─ Legal engagement if required
└─ Final compliance sign-off (highest authority)
```

---

# 9. COMPLIANCE DECISION FRAMEWORK

## 9.1 Decision Options

```
┌──────────────────────────────────────────────────────────────┐
│                    COMPLIANCE DECISIONS                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  OPTION 1: APPROVED                                          │
│  ├─ No regulatory concerns identified                        │
│  ├─ All screenings clear                                     │
│  ├─ AML/CTF risk acceptable                                  │
│  ├─ No restrictions needed                                   │
│  └─ Route to Final Approver                                  │
│                                                              │
│  OPTION 2: APPROVED WITH CONDITIONS                          │
│  ├─ PEP identified but manageable                            │
│  ├─ Elevated risk requires monitoring                        │
│  ├─ Conditions:                                              │
│  │  ├─ □ Enhanced transaction monitoring                     │
│  │  ├─ □ Transaction amount limits                           │
│  │  ├─ □ Quarterly EDD review                                │
│  │  ├─ □ Geographic transfer restrictions                    │
│  │  ├─ □ Cash deposit limits                                 │
│  │  └─ □ Regular source of funds verification                │
│  └─ Route to Final Approver with conditions                  │
│                                                              │
│  OPTION 3: REJECTED                                          │
│  ├─ Sanctions match confirmed                                │
│  ├─ AML/CTF risk unacceptable                                │
│  ├─ Regulatory prohibition                                   │
│  ├─ Unresolved document discrepancies with fraud indicators  │
│  └─ Case closed — Customer notified                          │
│                                                              │
│  OPTION 4: ESCALATE                                          │
│  ├─ Strategic decision needed (Compliance Head)              │
│  ├─ Board referral required                                  │
│  ├─ Legal opinion needed                                     │
│  ├─ QCB consultation required                                │
│  └─ Cross-border regulatory complexity                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 9.2 Decision Criteria Matrix

```
┌────────────────────────────┬──────────────────────────────────┐
│ Finding                    │ Decision                         │
├────────────────────────────┼──────────────────────────────────┤
│ All clear, low risk        │ APPROVED                         │
│ All clear, medium risk     │ APPROVED                         │
│ All clear, high risk       │ APPROVED WITH CONDITIONS         │
│ PEP (no adverse info)      │ APPROVED WITH CONDITIONS         │
│ PEP (adverse info)         │ ESCALATE TO HEAD                 │
│ Potential sanctions match  │ ESCALATE (investigate)           │
│ Confirmed sanctions match  │ REJECTED (mandatory)             │
│ Unresolved discrepancies   │ REJECTED or ESCALATE             │
│ Suspected fraud            │ REJECTED + SAR filing            │
│ CTF indicators             │ REJECTED + STR filing            │
│ FATCA/US Person            │ APPROVED WITH CONDITIONS (FATCA) │
│ Source of funds unclear     │ ESCALATE or REJECTED             │
│ >QAR 5M account value      │ ESCALATE TO HEAD                 │
└────────────────────────────┴──────────────────────────────────┘
```

## 9.3 Decision Documentation

```
FOR EVERY DECISION, DOCUMENT:

□ Decision: [APPROVED / APPROVED WITH CONDITIONS / REJECTED / ESCALATE]
□ Rationale: [Minimum 2 sentences explaining why]
□ Regulatory basis: [Which regulation supports this decision]
□ Risk factors considered: [List key factors]
□ PEP/Sanctions outcome: [Clear / Match type / N/A]
□ AML/CTF risk level: [LOW / MEDIUM / HIGH / CRITICAL]
□ Restrictions applied: [List if any, "None" if not]
□ QCB reporting required: [YES — type / NO]
□ Next review date: [Date / N/A]
□ Compliance Officer: [Name / ID]
□ Digital signature: [Applied]

EXAMPLE — APPROVED:
"Case CHG202403090001: APPROVED. Customer Ahmed Al-Mansouri screened
against OFAC, UN, EU, UK, QCB and internal sanctions lists — no matches
found. PEP status: YES (self-declared political affiliation), however
no adverse media or corruption indicators identified. AML risk assessed
as MEDIUM based on business activity ratio and PEP status. Recommend
enhanced transaction monitoring and quarterly review. No regulatory
prohibition identified per QCB Guidelines Section 4.2."

EXAMPLE — REJECTED:
"Case CHG202403120005: REJECTED. Customer Ali Hassan Al-Jabri matched
against OFAC SDN List (Ref: OFAC-2026-00234). Confirmed match based on
full name, DOB, and nationality. Per QCB Circular 2024/15 and bank
sanctions policy, account opening is prohibited. Case frozen, QCB
notification filed (QCB-STR-2026-00089). Legal department notified."
```

---

# 10. ACCOUNT RESTRICTIONS & CONDITIONS

## 10.1 Available Restrictions

```
RESTRICTION MENU (select applicable):

□ ENHANCED TRANSACTION MONITORING
  ├─ All transactions flagged for review
  ├─ Automated alerts on unusual activity
  ├─ Monthly transaction summary review
  └─ Duration: [Ongoing / Until review date]

□ TRANSACTION AMOUNT LIMITS
  ├─ Single transaction limit: QAR [Amount]
  ├─ Daily cumulative limit: QAR [Amount]
  ├─ Monthly cumulative limit: QAR [Amount]
  └─ Cash deposit limit: QAR [Amount]

□ GEOGRAPHIC TRANSFER RESTRICTIONS
  ├─ International transfers: □ Blocked  □ Monitored  □ Specific countries blocked
  ├─ Blocked countries: [List]
  ├─ Monitored destinations: [List]
  └─ Domestic only restriction: □ YES  □ NO

□ PERIODIC REVIEW REQUIREMENTS
  ├─ Review frequency: □ Quarterly  □ Semi-annual  □ Annual
  ├─ Review type: □ Full EDD  □ Document update  □ Transaction review
  ├─ Next review date: [Date]
  └─ Responsible team: [CDD / Compliance]

□ ADDITIONAL CONDITIONS
  ├─ □ Source of funds verification on large deposits (>QAR [threshold])
  ├─ □ Purpose statement for international transfers
  ├─ □ Regular address verification
  ├─ □ Annual income verification
  └─ □ Board-level approval for [specific activities]
```

## 10.2 Restriction Communication

```
RESTRICTIONS MUST BE COMMUNICATED TO:

□ T24 System — Programmatic restrictions applied
  ├─ Transaction limits set in T24
  ├─ Geographic restrictions configured
  └─ Monitoring flags activated

□ Branch Operations — Notification sent
  ├─ Any branch transactions flagged
  ├─ Teller alerts configured
  └─ Branch manager notified

□ Customer — Appropriately informed
  ├─ Customer must be informed of restrictions
  ├─ BUT: Do NOT disclose regulatory reasons for monitoring
  ├─ Use standard language: "As part of our account terms..."
  └─ Document customer acknowledgment

□ Compliance Register — Recorded
  ├─ All restrictions logged in compliance register
  ├─ Review schedule set
  └─ Responsible party assigned
```

---

# 11. QCB REGULATORY REPORTING

## 11.1 Reporting Obligations

```
MANDATORY REPORTS TO QCB:

□ 1. SUSPICIOUS TRANSACTION REPORT (STR)
  ├─ When: Suspected money laundering or terrorist financing
  ├─ Filing deadline: Within 24 hours of suspicion
  ├─ Form: QCB-STR-YYYY-NNNNN
  ├─ Content: Customer details, transaction details, suspicion basis
  ├─ Filed by: Compliance Officer → Approved by Compliance Head
  └─ Confidentiality: Strictly confidential — do NOT alert customer

□ 2. LARGE TRANSACTION REPORT (LTR)
  ├─ When: Single or linked transactions ≥ QAR 200,000
  ├─ Filing deadline: Within 15 business days
  ├─ Form: QCB-LTR-YYYY-NNNNN
  ├─ Content: Customer details, transaction details, source
  └─ Filed by: Compliance Officer

□ 3. PEP ACCOUNT NOTIFICATION
  ├─ When: New PEP account opened
  ├─ Filing deadline: Within 30 days of account opening
  ├─ Form: QCB-PEP-YYYY-NNNNN
  ├─ Content: PEP details, classification, monitoring plan
  └─ Filed by: Compliance Manager

□ 4. SANCTIONS MATCH NOTIFICATION
  ├─ When: Confirmed sanctions match
  ├─ Filing deadline: IMMEDIATELY (within 4 hours)
  ├─ Form: QCB-SAN-YYYY-NNNNN
  ├─ Content: Match details, actions taken, evidence
  ├─ Filed by: Compliance Head
  └─ Legal department involved

□ 5. QUARTERLY HIGH-RISK CUSTOMER REVIEW
  ├─ When: Every quarter (March, June, September, December)
  ├─ Filing deadline: 15th of following month
  ├─ Form: QCB-QHR-YYYY-QN
  ├─ Content: All high-risk customers reviewed, status, changes
  └─ Filed by: Compliance Manager
```

## 11.2 QCB Report Tracking

```
IN RRGP → Compliance Module → QCB Reports:

□ Track all filed reports
  ├─ Report type: [STR / LTR / PEP / SAN / QHR]
  ├─ Filing date: [Date]
  ├─ Report reference: [QCB reference number]
  ├─ Status: [Filed / Acknowledged / Under Review / Closed]
  ├─ Customer reference: [Case ID]
  └─ Filed by: [Officer name]

□ Pending reports (auto-generated reminders)
  ├─ STR pending: [Count]
  ├─ LTR deadline approaching: [Count]
  ├─ Quarterly review due: [Date]
  └─ PEP notification pending: [Count]

□ QCB response tracking
  ├─ Queries received: [Count]
  ├─ Responses pending: [Count]
  ├─ Overdue responses: [Count]
  └─ Compliance metrics: [Dashboard]
```

---

# 12. QUARTERLY REVIEW PROCEDURES

## 12.1 Quarterly Review Scope

```
EVERY QUARTER, REVIEW:

□ All HIGH-RISK customers (risk score ≥ 60)
  ├─ Transaction activity since last review
  ├─ Any new risk indicators
  ├─ Source of funds changes
  ├─ Updated PEP/Sanctions screening
  └─ Decision: Maintain / Increase monitoring / Exit

□ All PEP customers
  ├─ PEP status still current
  ├─ Any new adverse media
  ├─ Transaction patterns
  ├─ Source of wealth changes
  └─ Decision: Maintain / Restrict / Exit

□ All RESTRICTED accounts
  ├─ Restriction effectiveness
  ├─ Customer compliance with restrictions
  ├─ Any breaches of restrictions
  ├─ Decision: Maintain / Modify / Remove restrictions
  └─ Update T24 if restrictions change

□ All SUSPICIOUS activity since last quarter
  ├─ STRs filed: Review outcomes
  ├─ QCB responses: Action required?
  ├─ Patterns across customers
  └─ Systemic issues identified
```

## 12.2 Quarterly Review Checklist

```
□ Pull list of all high-risk customers from RRGP
□ Pull list of all PEP customers from RRGP
□ Pull list of all restricted accounts from RRGP
□ For each customer:
  □ Re-screen against PEP databases
  □ Re-screen against sanctions lists
  □ Review 3-month transaction summary
  □ Check for adverse media
  □ Assess if risk has changed
  □ Document findings
  □ Update risk rating if needed
  □ Update restrictions if needed
□ Prepare quarterly summary report
□ Submit to Compliance Manager for review
□ File QCB Quarterly report (QCB-QHR)
□ Update compliance register
□ Schedule next quarterly review date
```

---

# 13. SLA & ESCALATION

## 13.1 Compliance SLA

```
┌──────────────────────────────────────────────────────────────┐
│                  COMPLIANCE SLA TARGETS                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Standard Review:              24 hours                       │
│  PEP Review:                   24 hours (Manager sign-off)   │
│  Sanctions Investigation:      4 hours (urgent)               │
│  QCB STR Filing:               24 hours from suspicion       │
│  QCB Sanctions Notification:   4 hours from confirmation     │
│  Quarterly Review (per customer): 2 hours                    │
│  Decision Documentation:       1 hour after decision         │
│                                                              │
│  SLA starts: When case enters Compliance queue               │
│  SLA pauses: If returned to CDD for additional info          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 13.2 Escalation Levels

```
COMPLIANCE ESCALATION PATH:

Level 1: Compliance Officer → Compliance Manager
├─ When: High-risk cases, PEP matches, standard escalations
├─ SLA: Manager reviews within 4 hours
└─ Contact: Email + dashboard notification

Level 2: Compliance Manager → Compliance Head
├─ When: Confirmed sanctions, strategic exits, regulatory queries
├─ SLA: Head reviews within 2 hours
└─ Contact: Phone call + email + dashboard

Level 3: Compliance Head → Board/MLRO
├─ When: Board-level decisions, QCB formal responses
├─ SLA: Board review at next scheduled meeting or emergency
└─ Contact: Formal memo + meeting request

EMERGENCY ESCALATION (Sanctions/Terrorism):
├─ Skip all levels → Compliance Head directly
├─ AND: QCB notification within 4 hours
├─ AND: Legal department engaged
├─ AND: Case frozen immediately
└─ AND: Customer NOT informed
```

---

# 14. APPENDIX: DECISION TEMPLATES & FORMS

## Template: Compliance Decision Report

```
═══════════════════════════════════════════════════════════════
              COMPLIANCE DECISION REPORT

Case ID:            [CHG-XXXXXXXXXX]
Customer Name:       [Full Name]
QID:                [Number]
Risk Rating:         [ORIGINAL → CDD → COMPLIANCE]
Report Date:         [DD-MMM-YYYY]
Compliance Officer:  [Full Name] | EMP-[XXXXX]

───────────────────────────────────────────────────────────────
1. PEP SCREENING SUMMARY
   Result:    □ CLEAR  □ PEP IDENTIFIED  □ ESCALATED
   Details:   [Summary of PEP findings]
   Databases: [List all screened]
   Reference: [All search references]

2. SANCTIONS SCREENING SUMMARY
   Result:    □ CLEAR  □ POTENTIAL (investigated)  □ CONFIRMED
   Details:   [Summary of sanctions findings]
   Databases: [List all screened]
   Reference: [All search references]

3. AML/CTF ASSESSMENT SUMMARY
   AML Risk:  □ LOW  □ MEDIUM  □ HIGH  □ CRITICAL
   CTF Risk:  □ LOW  □ MEDIUM  □ HIGH  □ CRITICAL
   Details:   [Summary of AML/CTF assessment]

4. DISCREPANCY REVIEW (if applicable)
   Result:    □ N/A  □ RESOLVED  □ PARTIALLY RESOLVED  □ UNRESOLVED
   Impact:    [Regulatory impact assessment]

5. COMPLIANCE DECISION
   Decision:  □ APPROVED  □ APPROVED WITH CONDITIONS  □ REJECTED  □ ESCALATE

6. RESTRICTIONS (if APPROVED WITH CONDITIONS)
   □ Enhanced transaction monitoring
   □ Transaction limits: QAR [amount]
   □ Geographic restrictions: [countries]
   □ Periodic review: [frequency]
   □ Other: [specify]

7. QCB REPORTING
   □ No reporting required
   □ STR filed: [reference]
   □ PEP notification: [reference]
   □ LTR required: [reference]

8. COMPLIANCE RATIONALE
   [Detailed explanation of decision — minimum 3 sentences
   referencing specific regulatory guidance and evidence]

9. SIGN-OFF
   Compliance Officer: [Name] | [Employee ID]
   Digital Signature: [APPLIED]
   Date: [DD-MMM-YYYY HH:MM]

   Compliance Manager (if required):
   [Name] | [Employee ID]
   Digital Signature: [APPLIED / NOT REQUIRED]
   Date: [DD-MMM-YYYY HH:MM]
═══════════════════════════════════════════════════════════════
```

## Quick Reference: Compliance Decision Card

```
┌─────────────────────────────────────────────────────────────┐
│           COMPLIANCE OFFICER — QUICK REFERENCE              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  REVIEW SEQUENCE:                                            │
│  1. Verify case package complete (CDD Checker sign-off)     │
│  2. PEP Screening (4 databases minimum)                     │
│  3. Sanctions Screening (6 lists minimum)                    │
│  4. AML/CTF Assessment                                       │
│  5. Document & Discrepancy Review                            │
│  6. Currency Control (FATCA/CRS)                             │
│  7. Decision + Restrictions                                  │
│  8. QCB Reporting assessment                                 │
│  9. Documentation + Sign-off                                 │
│                                                              │
│  AUTHORITY:                                                  │
│  • Low/Medium risk → Officer decides                         │
│  • High risk → Manager required                              │
│  • PEP/Sanctions → Manager + Head                            │
│  • Strategic exit → Head only                                │
│                                                              │
│  ⛔ SANCTIONS MATCH → FREEZE + ESCALATE IMMEDIATELY          │
│  Compliance Head Phone: [Number]                             │
│  QCB Hotline: [Number]                                       │
│  Legal: Ext. 4444                                            │
│                                                              │
│  SLA: 24 hours | Sanctions: 4 hours                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

# DOCUMENT GOVERNANCE & RISK APPROVAL

## Controlled Document Notice

This document is a **controlled operational document** under the RRGP Operational Documentation Governance framework (Enterprise Architecture Document, Section 18). Any updates to this checklist must follow the Document Control Workflow and receive **Risk Management Group approval** before becoming effective.

## Risk Governance Approval

```
APPROVAL AUTHORITY:
├─ Document Owner: Compliance Department
├─ Review Authority: Risk Management Group
├─ Final Approval: Mr. Rakesh — Head of Risk Governance
├─ Regulatory Review: Compliance Head (joint approval with Risk)
└─ No update is effective until Risk Management approval is granted

DOCUMENT UPDATE WORKFLOW:
  Update Proposed → Internal Review (Compliance) → Risk Group Review
       → Joint Approval (Mr. Rakesh + Compliance Head) → Version Update
       → Distribution to Teams

CHANGE REQUEST:
  All updates must be submitted through the Change Management Framework
  (Enterprise Architecture Document, Section 19) with CR ID: CR-RRGP-YYYY-XXXX

NOTE: Due to regulatory sensitivity, any change to the Compliance Checklist
  also requires notification to QCB within 30 days if it affects regulatory
  screening procedures.
```

## Version History

```
┌─────────┬────────────┬──────────────────────────┬──────────────────────────┐
│ Version │ Date       │ Change Summary           │ Approved By              │
├─────────┼────────────┼──────────────────────────┼──────────────────────────┤
│ 1.0     │ 2026-03-10 │ Initial release          │ Mr. Rakesh (Risk Head)   │
│         │            │                          │ + Compliance Head        │
└─────────┴────────────┴──────────────────────────┴──────────────────────────┘
```

---

**Document ID:** DOC-RRGP-004  
**Document Status:** ✅ APPROVED FOR OPERATIONAL USE  
**Version:** 1.0  
**Effective Date:** March 2026  
**Next Review:** September 2026  
**Owner:** Compliance Department  
**Risk Approval:** Mr. Rakesh — Head of Risk Governance  
**Classification:** INTERNAL — QIB CONFIDENTIAL — REGULATORY SENSITIVE
