# 📋 RM / BRANCH OFFICER — DOCUMENT VERIFICATION GUIDE
## Retail Risk Governance Platform (RRGP) — Qatar Islamic Bank
### Version 1.0 | March 2026 | Operational Manual

---

## 📑 TABLE OF CONTENTS

1. [Purpose & Scope](#1-purpose--scope)
2. [Role Definition](#2-role-definition)
3. [Pre-Requisites & System Access](#3-pre-requisites--system-access)
4. [Document Verification Workflow](#4-document-verification-workflow)
5. [Step-by-Step Procedures](#5-step-by-step-procedures)
6. [Document Checklist by Account Type](#6-document-checklist-by-account-type)
7. [DMS Retrieval Procedures](#7-dms-retrieval-procedures)
8. [Discrepancy Identification & Classification](#8-discrepancy-identification--classification)
9. [Verification Notes — Writing Standards](#9-verification-notes--writing-standards)
10. [Routing & Handoff Rules](#10-routing--handoff-rules)
11. [SLA Requirements](#11-sla-requirements)
12. [Escalation Procedures](#12-escalation-procedures)
13. [Frequently Asked Questions](#13-frequently-asked-questions)
14. [Appendix: Templates & Reference](#14-appendix-templates--reference)

---

# 1. PURPOSE & SCOPE

## 1.1 Purpose

This guide provides Relationship Managers (RMs) and Branch Officers with detailed operational procedures for **document verification** — the mandatory first gate in the KYC/EDD case lifecycle. Every case entering the Retail Risk Governance Platform must pass through RM document verification before proceeding to the Business Review stage.

## 1.2 Scope

```
This guide covers:
✅ Collecting KYC documents from customers
✅ Retrieving existing documents from DMS
✅ Comparing submitted documents against customer data
✅ Identifying and classifying discrepancies
✅ Writing proper verification notes
✅ Routing cases to Business Analysts
✅ SLA compliance and escalation

This guide does NOT cover:
❌ Risk assessment (performed by system)
❌ EDD case decisions (performed by CDD/Compliance)
❌ Account approval/rejection (performed by Approver)
❌ Compliance screening (performed by Compliance)
```

## 1.3 Regulatory Basis

Document verification by RM/Branch Officer is mandated by:
- QCB KYC Guidelines — Section 4: Customer Identification
- QIB Internal Policy — KYC-POL-2024-001
- AML/CTF Regulations — Document Authenticity Requirements

---

# 2. ROLE DEFINITION

## 2.1 Who Is an RM / Branch Officer?

```
👤 RELATIONSHIP MANAGER (RM)
   ├─ First point of contact with customer
   ├─ Responsible for document collection and verification
   ├─ Operates under RELATIONSHIP_MANAGER role in RRGP
   └─ Reports to: Segment Manager (Mass/Tamayuz/Private)

👤 BRANCH OFFICER
   ├─ Handles walk-in customers at branch
   ├─ Performs same verification duties as RM
   ├─ Operates under BRANCH_OFFICER role in RRGP
   └─ Reports to: Branch Manager
```

## 2.2 Permissions in RRGP

```
✅ ALLOWED:
   ├─ Submit KYC applications
   ├─ Access DMS to retrieve customer documents
   ├─ Compare documents against submitted data
   ├─ Add verification notes/comments
   ├─ Flag discrepancies
   ├─ Route cases to Business Analyst
   └─ View cases submitted by yourself

❌ NOT ALLOWED:
   ├─ Make approval/rejection decisions
   ├─ Escalate cases directly
   ├─ Assign cases to other users
   ├─ Access cases not submitted by you
   ├─ Modify completed/closed cases
   └─ View compliance findings or audit trail
```

## 2.3 Accountability

```
The RM/Branch Officer is accountable for:
├─ Accuracy of document collection
├─ Thoroughness of verification
├─ Quality of verification notes
├─ Timely completion within SLA
└─ Flagging ALL discrepancies (even minor ones)

NOTE: Failure to identify discrepancies that later
cause compliance or fraud issues will be traced
back to the RM via the immutable audit trail.
```

---

# 3. PRE-REQUISITES & SYSTEM ACCESS

## 3.1 System Access Requirements

```
To perform document verification, you need:

1. RRGP Login Credentials
   ├─ Username: [Your QIB employee ID]
   ├─ Password: [Your configured password]
   └─ MFA: Required (OTP via mobile or authenticator app)

2. DMS Access
   ├─ DMS login (separate system)
   ├─ Search permission: Customer documents
   └─ Download permission: Document copies

3. Workstation Requirements
   ├─ Dual monitor recommended (RRGP + DMS side-by-side)
   ├─ PDF viewer installed
   ├─ Secure connection (VPN if remote)
   └─ Updated browser (Chrome 90+ / Edge 90+)
```

## 3.2 Training Requirements

```
Before performing document verification:
├─ Complete: "RRGP Document Verification Training" (2 hours)
├─ Complete: "QCB KYC Guidelines Awareness" (1 hour)
├─ Complete: "Fraud Document Detection" (1 hour)
├─ Pass: Verification certification quiz (score ≥ 80%)
└─ Renewed: Annually
```

## 3.3 Logging In

```
Step 1: Navigate to RRGP Portal → https://rrgp.qib.com.qa
Step 2: Enter Employee ID and Password
Step 3: Complete MFA verification (OTP)
Step 4: Dashboard loads → Navigate to "My Queue"
```

---

# 4. DOCUMENT VERIFICATION WORKFLOW

## 4.1 High-Level Flow

```
CUSTOMER SUBMITS KYC
        ↓
┌───────────────────────────────────────────────────────┐
│          RM/BRANCH DOCUMENT VERIFICATION              │
│                                                       │
│  1. Receive KYC application notification              │
│  2. Collect documents from customer                   │
│  3. Retrieve existing documents from DMS              │
│  4. Compare submitted data vs DMS documents           │
│  5. Classify: MATCH / MINOR / MAJOR discrepancy       │
│  6. Write detailed verification notes                 │
│  7. Route to Business Analyst                         │
│                                                       │
│  SLA: Same-day (within business hours)                │
└───────────────────────────────────────────────────────┘
        ↓
BUSINESS ANALYST REVIEW
```

## 4.2 Decision Tree

```
START: Customer KYC Received
  │
  ├─ Step 1: Collect all required documents
  │   ├─ All documents collected? → YES → Continue
  │   └─ Missing documents? → Request from customer → Wait → Re-enter
  │
  ├─ Step 2: Retrieve DMS documents
  │   ├─ Customer exists in DMS? → YES → Download docs
  │   └─ New customer (no DMS record)? → Skip DMS, note: "New customer"
  │
  ├─ Step 3: Compare Data Fields
  │   ├─ ALL fields match? → Classification: MATCH
  │   ├─ Minor issues (typos, formatting)? → Classification: MINOR_DISCREPANCY
  │   └─ Significant mismatches? → Classification: MAJOR_DISCREPANCY
  │
  ├─ Step 4: Write Verification Notes
  │   ├─ MATCH → Standard note: "All documents verified"
  │   ├─ MINOR → Note specific field + resolution
  │   └─ MAJOR → Detailed discrepancy report with evidence
  │
  └─ Step 5: Route to Business Analyst
      ├─ MATCH / MINOR → Normal routing
      └─ MAJOR → Route with ALERT flag
```

---

# 5. STEP-BY-STEP PROCEDURES

## Procedure 1: Receiving a New KYC Application

```
TRIGGER: You receive a notification (email/SMS/dashboard) that a new
         KYC application has been assigned to you.

STEP 1: Open RRGP Dashboard
        ├─ Navigate to: My Queue → Pending Verification
        └─ Click on the new case: e.g., KYC202403090001

STEP 2: Review Customer Information
        ├─ Full name: Ahmed Al-Mansouri
        ├─ QID / ID Number: QID1234567890
        ├─ Nationality: Qatar
        ├─ Date of Birth: 1985-01-15
        ├─ Contact: +974-5555-1234
        ├─ Employment: Business Owner
        └─ Account type requested: Current Account

STEP 3: Note the application channel
        ├─ Mobile App (customer self-submitted)
        ├─ Branch (walk-in customer)
        ├─ Microsite (online portal)
        └─ Call Center (agent-assisted)

STEP 4: Proceed to Document Collection
```

## Procedure 2: Collecting Documents from Customer

```
REQUIRED DOCUMENTS (depends on account type — see Section 6):

For Individual Current Account:
┌──────────────────────────────────────────────────────────────┐
│ #  │ Document              │ Status          │ Notes         │
├────┼───────────────────────┼─────────────────┼───────────────┤
│ 1  │ Valid ID (QID/Passport)│ □ Collected     │               │
│ 2  │ Address Proof          │ □ Collected     │               │
│ 3  │ Income Certificate     │ □ Collected     │               │
│ 4  │ Employment Letter      │ □ Collected     │               │
│ 5  │ Salary Certificate     │ □ Collected     │               │
│ 6  │ Bank Statement (3 mo)  │ □ Collected     │ If applicable │
│ 7  │ CR Registration        │ □ Collected     │ If business   │
│ 8  │ Trade License           │ □ Collected     │ If business   │
└──────────────────────────────────────────────────────────────┘

HOW TO COLLECT:
├─ Branch: Physical documents → scan to PDF
├─ Mobile: Customer uploads directly (verify quality)
├─ Microsite: Customer uploads (verify quality)
└─ Call Center: Request customer to upload via app/email

IMPORTANT:
├─ All documents must be clear, legible copies
├─ No expired documents accepted (check expiry dates)
├─ Original documents preferred (copies acceptable with note)
└─ Upload all documents to case in RRGP
```

## Procedure 3: Retrieving Documents from DMS

```
STEP 1: Open DMS System (Document Management System)
        URL: https://dms.qib.com.qa
        Login: Same QIB credentials

STEP 2: Search for Customer
        ├─ Search by: QID Number (primary)
        ├─ Alternative: Customer Name + Date of Birth
        └─ If not found: Customer is NEW → note in verification

STEP 3: Download Existing Documents
        ├─ View available documents in DMS:
        │   ├─ Previous ID copies
        │   ├─ Previous address proofs
        │   ├─ Previous income documents
        │   ├─ Previous employer letters
        │   └─ Any other historical documents
        │
        ├─ Download relevant documents for comparison
        └─ Note DMS reference numbers for audit trail

STEP 4: Arrange Documents for Comparison
        ├─ Left monitor: DMS documents (existing records)
        └─ Right monitor: RRGP case documents (newly submitted)

⚠️ NEW CUSTOMER NOTE:
If DMS search returns NO results:
├─ This is a new-to-bank customer
├─ Write in verification notes: "New customer - no DMS history"
├─ Proceed with submitted documents only
└─ Verify documents against each other for consistency
```

## Procedure 4: Document Comparison (THE CRITICAL STEP)

```
COMPARE EACH FIELD SYSTEMATICALLY:

┌──────────────────────────────────────────────────────────────────────┐
│ FIELD            │ KYC Form       │ DMS Document    │ Match?       │
├──────────────────┼────────────────┼─────────────────┼──────────────┤
│ Full Name        │ Ahmed Mansouri │ Ahmed Al-Mansour│ MINOR ⚠️     │
│ ID Number        │ QID1234567890  │ QID1234567890   │ ✓ MATCH     │
│ Date of Birth    │ 1985-01-15     │ 1985-01-15      │ ✓ MATCH     │
│ Nationality      │ Qatar          │ Qatar           │ ✓ MATCH     │
│ Address          │ Doha, Zone 45  │ Doha, Zone 42   │ MAJOR ❌    │
│ Employer Name    │ Trading Co Ltd │ Trading Company │ MINOR ⚠️     │
│ Monthly Income   │ QAR 25,000     │ QAR 18,000      │ MAJOR ❌    │
│ Phone Number     │ +974-5555-1234 │ +974-5555-1234  │ ✓ MATCH     │
└──────────────────────────────────────────────────────────────────────┘

COMPARISON RULES:
├─ EXACT MATCH: Field values are identical → ✓
├─ MINOR DISCREPANCY: Formatting difference, abbreviation, typo → ⚠️
│  Examples:
│  ├─ "Ahmed Mansouri" vs "Ahmed Al-Mansouri" (name format)
│  ├─ "Trading Co Ltd" vs "Trading Company" (abbreviation)
│  ├─ Zone 45 vs Zone 45, Street 12 (partial address)
│  └─ Date format differences (DD/MM vs MM/DD)
│
└─ MAJOR DISCREPANCY: Different information entirely → ❌
   Examples:
   ├─ Different address (Zone 45 vs Zone 42)
   ├─ Income mismatch (25,000 vs 18,000)
   ├─ Different employer name
   ├─ ID number mismatch
   └─ Different date of birth
```

## Procedure 5: Writing Verification Notes

```
EVERY CASE MUST HAVE VERIFICATION NOTES — NO EXCEPTIONS

In RRGP → Case Details → Verification Notes section:

TEMPLATE FOR "ALL MATCH":
────────────────────────────────────────────────
Document Verification: PASS
Verified by: [Your Name] | [Employee ID]
Date: [Today's date]
Channel: [Branch/Mobile/Microsite]

DMS Records: [✓ Found / ✗ New Customer]
Documents Compared:
├─ ID (QID/Passport): MATCH ✓
├─ Address Proof: MATCH ✓
├─ Income Certificate: MATCH ✓
├─ Employment Letter: MATCH ✓
└─ [Other documents]: MATCH ✓

Summary: All submitted documents match DMS records.
No discrepancies identified.
Recommendation: Proceed to Business Review (normal pathway).
────────────────────────────────────────────────

TEMPLATE FOR "DISCREPANCIES FOUND":
────────────────────────────────────────────────
Document Verification: DISCREPANCIES FOUND
Verified by: [Your Name] | [Employee ID]
Date: [Today's date]
Channel: [Branch/Mobile/Microsite]

DMS Records: ✓ Found [DMS Ref: DMS-XXXX]

DISCREPANCY #1:
├─ Field: Monthly Income
├─ KYC Form: QAR 25,000
├─ DMS Record: QAR 18,000
├─ Category: MAJOR DISCREPANCY
├─ Possible Explanation: Salary increase / promotion
└─ Supporting Evidence: [None provided]

DISCREPANCY #2:
├─ Field: Residential Address
├─ KYC Form: Doha, Zone 45, Street 12
├─ DMS Record: Doha, Zone 42, Building 8
├─ Category: MAJOR DISCREPANCY
├─ Possible Explanation: Relocation
└─ Supporting Evidence: [No address proof for new address]

DISCREPANCY #3:
├─ Field: Full Name Spelling
├─ KYC Form: Ahmed Mansouri
├─ DMS Record: Ahmed Al-Mansouri
├─ Category: MINOR DISCREPANCY
├─ Possible Explanation: Name format variation
└─ Supporting Evidence: ID shows "Ahmed Al-Mansouri"

Summary: 2 MAJOR and 1 MINOR discrepancies identified.
Income discrepancy (39% increase) and address mismatch
require CDD investigation.

Recommendation: CDD deep-dive verification recommended.
────────────────────────────────────────────────
```

## Procedure 6: Routing the Case

```
AFTER COMPLETING VERIFICATION NOTES:

SCENARIO A: ALL DOCUMENTS MATCH
├─ Set Document Verification Status: MATCH
├─ Set Requires Deep Dive: NO
├─ Click: "Route to Business Analyst"
├─ Case status changes to: BUSINESS_REVIEW
└─ Business Analyst receives notification

SCENARIO B: MINOR DISCREPANCIES ONLY
├─ Set Document Verification Status: MINOR_DISCREPANCY
├─ Set Requires Deep Dive: NO (unless multiple minors)
├─ Add detailed notes for each minor issue
├─ Click: "Route to Business Analyst"
├─ Case status changes to: BUSINESS_REVIEW
└─ Business Analyst reviews and decides

SCENARIO C: MAJOR DISCREPANCIES FOUND
├─ Set Document Verification Status: MAJOR_DISCREPANCY
├─ Set Requires Deep Dive: YES
├─ Add detailed notes with evidence
├─ Click: "Route to Business Analyst with ALERT"
├─ Case status changes to: BUSINESS_REVIEW (with flag)
└─ Business Analyst sees ALERT badge on case
    └─ Business Analyst will recommend CDD deep-dive

SCENARIO D: DOCUMENTS MISSING / INCOMPLETE
├─ Do NOT route to Business Analyst
├─ Click: "Request Additional Documents"
├─ Select missing documents from checklist
├─ Customer receives notification to upload
├─ Case status: CUSTOMER_ACTION_REQUIRED
├─ SLA: 7 days for customer response
└─ When uploaded: You re-verify from Step 1
```

---

# 6. DOCUMENT CHECKLIST BY ACCOUNT TYPE

## 6.1 Individual Current Account

```
MANDATORY DOCUMENTS:
├─ 1. Valid QID or Passport (not expired)
├─ 2. Proof of Address (utility bill/rental contract, < 3 months)
├─ 3. Income Certificate or Salary Slip (< 1 month)
├─ 4. Employment Letter (< 3 months, on company letterhead)
└─ 5. Passport-size photograph (recent)

ADDITIONAL IF APPLICABLE:
├─ 6. Trade License (if self-employed)
├─ 7. CR Registration (if business owner)
├─ 8. Last 3 months bank statements (if transferring from another bank)
├─ 9. Power of Attorney (if representative submitting)
└─ 10. FATCA Declaration (if US person indicators)
```

## 6.2 Joint Account

```
MANDATORY DOCUMENTS (for EACH account holder):
├─ 1. Valid QID or Passport (all holders)
├─ 2. Proof of Address (all holders)
├─ 3. Income Certificate (primary holder minimum)
├─ 4. Employment Letter (primary holder minimum)
├─ 5. Passport-size photograph (all holders)
└─ 6. Joint Account Declaration Form (signed by all)

ADDITIONAL IF APPLICABLE:
├─ 7. Marriage Certificate (if spouse is joint holder)
├─ 8. Company Partnership Deed (if business partners)
└─ 9. Power of Attorney (if any holder represented)
```

## 6.3 Business Account

```
MANDATORY DOCUMENTS:
├─ 1. Valid QID or Passport (authorized signatories)
├─ 2. Commercial Registration (CR)
├─ 3. Trade License (valid, not expired)
├─ 4. Memorandum of Association (MoA)
├─ 5. Articles of Association (AoA)
├─ 6. Board Resolution (authorizing account opening)
├─ 7. Ownership Structure (beneficial owners > 25%)
├─ 8. Financial Statements (last 2 years audited)
├─ 9. Company Bank Statements (last 6 months)
└─ 10. Proof of Address (company registered address)

ADDITIONAL IF APPLICABLE:
├─ 11. Power of Attorney (for authorized signatories)
├─ 12. UBO Declaration (Ultimate Beneficial Owner)
├─ 13. Tax Registration Certificate
└─ 14. FATCA/CRS Declaration (if indicators present)
```

## 6.4 Tamayuz (Priority) Account

```
Same as Individual Current Account plus:
├─ Minimum balance evidence (QAR 50,000+)
├─ Priority Banking application form
└─ Segment allocation approval (from Tamayuz Manager)
```

## 6.5 Private Banking Account

```
Same as Individual Current Account plus:
├─ Minimum balance evidence (QAR 500,000+)
├─ Source of Wealth Documentation (detailed)
├─ Investment Portfolio Summary
├─ Private Banking application form
├─ Net Worth Declaration
└─ Private Banking Manager approval
```

---

# 7. DMS RETRIEVAL PROCEDURES

## 7.1 Accessing DMS

```
URL: https://dms.qib.com.qa
Credentials: QIB Employee ID + DMS Password

Navigation:
├─ Home → Customer Documents
├─ Search → Enter QID Number
└─ Results → Document list with dates

Search Tips:
├─ Primary search: QID Number (exact match)
├─ Secondary search: Customer Full Name (fuzzy match)
├─ Filter by: Document Type (ID, Address, Income, etc.)
├─ Sort by: Date uploaded (newest first)
└─ If no results: Try alternative name spelling
```

## 7.2 Document Categories in DMS

```
DMS Document Categories:
├─ IDENTIFICATION
│  ├─ QID Copy
│  ├─ Passport Copy
│  └─ Driving License
│
├─ ADDRESS
│  ├─ Utility Bill
│  ├─ Rental Agreement
│  └─ Municipality Certificate
│
├─ EMPLOYMENT
│  ├─ Employment Letter
│  ├─ Salary Certificate
│  └─ Company ID Copy
│
├─ FINANCIAL
│  ├─ Bank Statements
│  ├─ Income Certificate
│  └─ Tax Certificate
│
├─ BUSINESS
│  ├─ Trade License
│  ├─ CR Certificate
│  ├─ MoA / AoA
│  └─ Board Resolution
│
└─ OTHER
   ├─ Power of Attorney
   ├─ Marriage Certificate
   └─ Miscellaneous
```

## 7.3 DMS Document Expiry Rules

```
Documents in DMS may be outdated. Check:
├─ ID documents: Must be currently valid (not expired)
├─ Address proof: Must be < 3 months old
├─ Employment letter: Must be < 6 months old
├─ Income certificate: Must be < 1 month old
├─ Trade License: Must be currently valid
├─ Bank statements: Must cover latest 3 months
└─ Financial statements: Must be latest fiscal year

IF DMS DOCUMENTS ARE EXPIRED:
├─ Note: "DMS document expired — new version submitted by customer"
├─ Compare against the expired version for consistency
├─ Flag if significant changes from expired to new
└─ The new submitted document becomes the primary reference
```

---

# 8. DISCREPANCY IDENTIFICATION & CLASSIFICATION

## 8.1 Classification Rules

### MATCH ✓
```
Definition: Information in KYC form exactly matches DMS documents.
Action: Mark as MATCH, write standard verification note.
Route: Normal pathway to Business Analyst.

Examples:
├─ Name: "Ahmed Al-Mansouri" = "Ahmed Al-Mansouri" ✓
├─ QID: "QID1234567890" = "QID1234567890" ✓
├─ DOB: "1985-01-15" = "15 Jan 1985" ✓ (format differs, date same)
└─ Address: "Zone 45, Street 12" = "Zone 45, Street 12" ✓
```

### MINOR DISCREPANCY ⚠️
```
Definition: Small differences that are likely due to formatting,
           abbreviation, or data entry variations.

Action: Note the discrepancy, classify as MINOR, provide explanation.
Route: Normal pathway (Business Analyst decides if further action needed).

Examples:
├─ Name format: "Ahmed Mansouri" vs "Ahmed Al-Mansouri"
├─ Address format: "Zone 45" vs "Zone 45, Doha"
├─ Company format: "Trading Co." vs "Trading Company LLC"
├─ Phone format: "55551234" vs "+974-5555-1234"
├─ Date format: "15/01/1985" vs "1985-01-15"
└─ Title/honorific: "Mr. Ahmed" vs "Ahmed"

Threshold: These do NOT require CDD deep-dive.
```

### MAJOR DISCREPANCY ❌
```
Definition: Significant differences that indicate changed information,
           potential errors, or possible fraud indicators.

Action: Document thoroughly, classify as MAJOR, flag for CDD deep-dive.
Route: With ALERT flag to Business Analyst.

Examples:
├─ Income mismatch: QAR 25,000 vs QAR 18,000 (39% difference)
├─ Address mismatch: Zone 45 vs Zone 42 (different location)
├─ Employer mismatch: "QIB" vs "Commercial Bank"
├─ Different ID number digits
├─ Name completely different
├─ Source of funds: "Salary" vs "Business Income"
├─ Nationality change or addition
└─ Missing critical documents that DMS shows previously existed

Threshold: ALWAYS requires CDD deep-dive investigation.

RED FLAGS (immediate escalation to supervisor):
├─ Altered or forged documents detected
├─ Completely different person's documents submitted
├─ Documents from sanctioned countries
├─ Multiple identities detected
└─ Customer not cooperating with verification
```

## 8.2 Discrepancy Percentage Guide

```
For INCOME discrepancies:
├─ < 10% difference → MINOR (possible rounding/timing)
├─ 10-25% difference → MAJOR (requires explanation)
├─ > 25% difference → MAJOR + FLAG for CDD deep-dive
└─ Income decreased significantly → MAJOR (risk indicator)

For ADDRESS:
├─ Same city/zone, different street → MINOR
├─ Different zone/area → MAJOR
├─ Different city → MAJOR + FLAG
└─ Different country → MAJOR + IMMEDIATE ESCALATION

For EMPLOYMENT:
├─ Same company, different title → MINOR
├─ Different department → MINOR
├─ Different company entirely → MAJOR
└─ Self-employed vs Employed claim → MAJOR + FLAG
```

---

# 9. VERIFICATION NOTES — WRITING STANDARDS

## 9.1 Mandatory Elements

```
EVERY verification note MUST contain:

1. HEADER:
   ├─ Document Verification Status: [PASS/DISCREPANCIES FOUND]
   ├─ Verified By: [Full Name] | [Employee ID]
   ├─ Verification Date: [DD-MMM-YYYY]
   └─ Application Channel: [Branch/Mobile/Microsite/Call Center]

2. DMS REFERENCE:
   ├─ DMS Records Found: [Yes/No]
   ├─ DMS Reference Number: [DMS-XXXX]
   └─ DMS Documents Reviewed: [List]

3. COMPARISON RESULTS:
   For each document compared:
   ├─ Document Type: [e.g., ID Copy]
   ├─ Field Name: [e.g., Full Name]
   ├─ KYC Form Value: [What customer submitted]
   ├─ DMS Record Value: [What DMS shows]
   ├─ Classification: [MATCH/MINOR/MAJOR]
   └─ Supporting Notes: [Explanation if discrepancy]

4. SUMMARY:
   ├─ Total Fields Compared: [Number]
   ├─ Matches: [Number]
   ├─ Minor Discrepancies: [Number]
   ├─ Major Discrepancies: [Number]
   └─ Overall Category: [MATCH/MINOR_DISCREPANCY/MAJOR_DISCREPANCY]

5. RECOMMENDATION:
   ├─ [Proceed to Business Review — normal pathway]
   ├─ [Proceed to Business Review — CDD deep-dive recommended]
   └─ [Request additional documents from customer]
```

## 9.2 Language Standards

```
DO:
├─ Use clear, factual language
├─ State specific values ("QAR 25,000" not "high income")
├─ Include document reference numbers
├─ Describe what you observed, not what you think
├─ Use standard templates provided

DO NOT:
├─ Use subjective judgments ("customer seems dishonest")
├─ Include personal opinions about the customer
├─ Write in abbreviated/shorthand that others can't read
├─ Leave any field blank
├─ Copy-paste without verifying accuracy
└─ Include information from previous cases
```

## 9.3 Examples of Good vs Bad Notes

```
❌ BAD: "Docs don't match. Probably fraud."
✓ GOOD: "Income discrepancy: KYC form states QAR 25,000/month;
         DMS Salary Certificate dated Jan 2026 shows QAR 18,000/month.
         Difference: QAR 7,000 (39%). Possible explanation: salary
         increase not yet reflected in DMS. No supporting documentation
         provided. Category: MAJOR_DISCREPANCY.
         Recommendation: CDD deep-dive for income verification."

❌ BAD: "Address is different."
✓ GOOD: "Address discrepancy: KYC form shows 'Doha, Zone 45, Street 12,
         Building 8, Flat 302'. DMS record (updated March 2025) shows
         'Doha, Zone 42, Building 3, Flat 105'. Category: MAJOR_DISCREPANCY.
         No address proof for new address provided.
         Recommendation: Request updated address proof from customer."
```

---

# 10. ROUTING & HANDOFF RULES

## 10.1 Routing Matrix

```
┌────────────────────────┬───────────────────────────────────────────┐
│ Verification Result    │ Route To                                  │
├────────────────────────┼───────────────────────────────────────────┤
│ ALL MATCH              │ Business Analyst (normal queue)           │
│ MINOR DISCREPANCY ONLY │ Business Analyst (normal queue)           │
│ MAJOR DISCREPANCY      │ Business Analyst (ALERT flag)             │
│ MISSING DOCUMENTS      │ Customer (CUSTOMER_ACTION_REQUIRED)       │
│ SUSPECTED FRAUD        │ Supervisor → Compliance (IMMEDIATE)       │
│ SANCTIONED INDICATORS  │ Supervisor → Compliance (IMMEDIATE)       │
└────────────────────────┴───────────────────────────────────────────┘
```

## 10.2 Handoff Checklist

```
Before clicking "Route to Business Analyst":

□ All required documents uploaded to case
□ DMS comparison completed
□ Verification notes written (following template)
□ Discrepancy classification set correctly
□ Requires Deep Dive flag set (if applicable)
□ All supporting evidence attached
□ Digital signature applied to verification
□ Status set to: VERIFIED or DISCREPANCIES_FOUND
```

## 10.3 Segment-Specific Routing

```
MASS BANKING customers:
└─ Routed to: Mass Banking Business Analyst (general queue)

TAMAYUZ (PRIORITY) customers:
└─ Routed to: Tamayuz Business Analyst (priority queue)
   └─ SLA: 12 hours (accelerated)

PRIVATE BANKING customers:
└─ Routed to: Private Banking Business Analyst (dedicated queue)
   └─ SLA: 18 hours (dedicated RM follow-up)
```

---

# 11. SLA REQUIREMENTS

## 11.1 Your SLA

```
┌─────────────────────────────────────────────────────────────┐
│        RM/BRANCH OFFICER SLA: SAME-DAY VERIFICATION        │
│                                                              │
│  Target: Complete verification within business hours          │
│  of receiving the KYC application.                           │
│                                                              │
│  Break-down:                                                 │
│  ├─ Document collection: 1-2 hours                          │
│  ├─ DMS retrieval: 30 minutes                               │
│  ├─ Document Comparison: 30-60 minutes                      │
│  ├─ Writing verification notes: 15-30 minutes               │
│  └─ Total: 2-4 hours                                        │
│                                                              │
│  If received after 3:00 PM:                                  │
│  └─ Must be completed by 12:00 PM next business day         │
│                                                              │
│  Exceptions:                                                 │
│  ├─ Customer not reachable → extends by 24 hours            │
│  ├─ DMS system down → notify supervisor, document delay     │
│  └─ Complex business account → up to 8 hours                │
└─────────────────────────────────────────────────────────────┘
```

## 11.2 SLA Breach Consequences

```
1st Breach: Automated reminder email sent to you
2nd Breach: Notification to your supervisor
3rd Breach: Case reassigned + documented in performance record
Repeated: Training re-certification required
```

## 11.3 SLA Monitoring (on your dashboard)

```
Your Dashboard Shows:
├─ Total cases in queue: [N]
├─ Cases within SLA: [N] (green)
├─ Cases approaching SLA: [N] (amber — < 2 hours remaining)
├─ Cases breaching SLA: [N] (red — overdue)
├─ Average verification time: [N minutes]
└─ SLA compliance rate: [percentage]
```

---

# 12. ESCALATION PROCEDURES

## 12.1 When to Escalate

```
ESCALATE TO SUPERVISOR immediately if:

├─ Suspected forged or altered documents
├─ Customer presenting multiple/conflicting identities  
├─ Documents from OFAC/UN sanctioned individuals
├─ Customer refuses to provide required documents
├─ Customer attempts to bribe or threaten staff
├─ System error preventing verification completion
├─ DMS system down for > 2 hours
├─ Unusual patterns (same documents for different customers)
└─ You are unsure about document authenticity

DO NOT attempt to resolve these situations yourself.
DO NOT confront the customer about suspected fraud.
DO document everything and escalate immediately.
```

## 12.2 How to Escalate

```
Step 1: In RRGP → Case → Click "Escalate to Supervisor"
Step 2: Select escalation reason from dropdown
Step 3: Write detailed escalation note:
        ├─ What you observed
        ├─ Why you are escalating
        ├─ What action you recommend
        └─ Any supporting evidence
Step 4: Your supervisor receives immediate notification
Step 5: Do NOT proceed with case until supervisor responds

For CRITICAL SITUATIONS (suspected fraud/sanctions):
├─ Step 1: Secure the documents (do not return to customer)
├─ Step 2: Notify supervisor verbally (phone call)
├─ Step 3: Escalate in system simultaneously
├─ Step 4: Do NOT alert the customer
└─ Step 5: Follow branch security protocol
```

## 12.3 Escalation Contacts

```
├─ Branch Supervisor: [Name / Extension]
├─ Segment Manager:
│  ├─ Mass Banking: [Name / Extension]
│  ├─ Tamayuz: [Name / Extension]
│  └─ Private Banking: [Name / Extension]
├─ Branch Manager: [Name / Extension]
├─ Compliance Hotline: Ext. 5555 (for fraud/sanctions)
├─ IT Helpdesk: Ext. 7777 (for system issues)
└─ Security: Ext. 9999 (for physical security)
```

---

# 13. FREQUENTLY ASKED QUESTIONS

## Q1: What if the customer is new and has no DMS record?

```
A: This is normal for new-to-bank customers.
   ├─ Write in verification notes: "New customer — no DMS history"
   ├─ Verify submitted documents against each other for consistency
   ├─ Cross-reference: ID number matches on all documents
   ├─ Cross-reference: Name matches on all documents
   ├─ Cross-reference: Address is consistent across documents
   └─ Route normally if all submitted documents are consistent
```

## Q2: What if the customer submitted documents in Arabic only?

```
A: Arabic documents are accepted.
   ├─ QID is bilingual (Arabic/English) — use for reference
   ├─ For Arabic-only documents: Use your Arabic reading ability
   ├─ If you cannot read Arabic: Escalate to Arabic-speaking colleague
   ├─ Do NOT use online translators for official verification
   └─ Note in verification: "Documents reviewed in Arabic by [Name]"
```

## Q3: What if DMS is down/unavailable?

```
A: Do NOT skip DMS verification.
   ├─ Wait up to 1 hour for DMS to recover
   ├─ If > 1 hour: Notify supervisor
   ├─ Supervisor may authorize verification without DMS
   │  (must be documented with supervisor's approval)
   ├─ When DMS returns: Complete verification retroactively
   └─ Note: "DMS unavailable at time of verification — supervisor
            authorized proceeding. Retroactive check completed [date]."
```

## Q4: Minor discrepancy in name spelling — is that MAJOR?

```
A: Usually MINOR, but check carefully:
   ├─ "Ahmad" vs "Ahmed" → MINOR (common variation)
   ├─ "Al-Mansouri" vs "Almansouri" → MINOR (formatting)
   ├─ "Ahmed Al-Mansouri" vs "Mohammed Al-Mansouri" → MAJOR (different name)
   ├─ Missing middle name → MINOR (unless required for account)
   └─ Completely different name → MAJOR + possible fraud indicator
```

## Q5: Customer claims income increase since last DMS record — how to handle?

```
A: This is common and may be legitimate.
   ├─ Note the discrepancy as MAJOR (income > 10% different)
   ├─ Ask customer for updated salary certificate or promotion letter
   ├─ If customer provides evidence: Classify as MINOR (explained)
   ├─ If customer cannot provide evidence: Keep as MAJOR
   └─ The CDD team will investigate further if needed
```

## Q6: Can I edit verification notes after routing to Business Analyst?

```
A: NO. Once routed, verification notes are LOCKED (immutable).
   ├─ If you discover an error: Contact your supervisor
   ├─ Supervisor can add a correction note (appended, not edited)
   ├─ The original note remains in the audit trail
   └─ All corrections are logged with timestamp and reason
```

## Q7: What if the customer is a VIP or board member?

```
A: Treat VIPs with the SAME verification rigor.
   ├─ No shortcuts allowed regardless of customer status
   ├─ Follow all standard procedures
   ├─ If pressure is applied: Escalate to supervisor
   ├─ Document any unusual requests
   └─ VIP cases may have accelerated SLA but NOT reduced verification
```

## Q8: How do I handle multiple document versions in DMS?

```
A: Always use the MOST RECENT version.
   ├─ Sort DMS results by date (newest first)
   ├─ Compare against the latest version
   ├─ If multiple versions show conflicting information: Note in verification
   ├─ Reference each version's date in your notes
   └─ Let CDD investigate if pattern is concerning
```

---

# 14. APPENDIX: TEMPLATES & REFERENCE

## Template A: Standard Verification Note (All Match)

```
═══════════════════════════════════════════════════════════════
DOCUMENT VERIFICATION REPORT

Case ID:           [KYC-XXXXXXXXXX]
Customer Name:      [Full Name]
QID/Passport:      [Number]
Verification Date:  [DD-MMM-YYYY]
Verified By:        [Full Name] | EMP-[XXXXX]
Channel:            [Branch/Mobile/Microsite]

DMS RECORDS:
├─ DMS Status: FOUND
├─ DMS Reference: DMS-[XXXXX]
└─ Documents Available: [List]

VERIFICATION RESULTS:
├─ ID Document: MATCH ✓
├─ Address Proof: MATCH ✓
├─ Income Certificate: MATCH ✓
├─ Employment Letter: MATCH ✓
├─ [Additional docs]: MATCH ✓

CLASSIFICATION: MATCH
REQUIRES CDD DEEP-DIVE: NO

SUMMARY:
All submitted documents match DMS records. No discrepancies identified.
All documents are valid and not expired.

RECOMMENDATION: Proceed to Business Review (normal pathway).

DIGITAL SIGNATURE: [Auto-applied upon submission]
═══════════════════════════════════════════════════════════════
```

## Template B: Discrepancy Report

```
═══════════════════════════════════════════════════════════════
DOCUMENT VERIFICATION REPORT — DISCREPANCIES IDENTIFIED

Case ID:           [KYC-XXXXXXXXXX]
Customer Name:      [Full Name]
QID/Passport:      [Number]
Verification Date:  [DD-MMM-YYYY]
Verified By:        [Full Name] | EMP-[XXXXX]
Channel:            [Branch/Mobile/Microsite]

DMS RECORDS:
├─ DMS Status: FOUND
├─ DMS Reference: DMS-[XXXXX]
└─ Documents Available: [List]

VERIFICATION RESULTS:
├─ ID Document: MATCH ✓
├─ Address Proof: MAJOR DISCREPANCY ❌
├─ Income Certificate: MAJOR DISCREPANCY ❌
├─ Employment Letter: MINOR DISCREPANCY ⚠️
├─ [Additional docs]: MATCH ✓

DISCREPANCY DETAILS:

DISCREPANCY #1: [Address Proof]
├─ KYC Form: [Address On Form]
├─ DMS Record: [Address In DMS]
├─ Category: MAJOR_DISCREPANCY
├─ Evidence: [None / Updated proof requested]
└─ Notes: [Description of discrepancy]

DISCREPANCY #2: [Income Certificate]
├─ KYC Form: QAR [Amount]
├─ DMS Record: QAR [Amount]
├─ Category: MAJOR_DISCREPANCY
├─ Evidence: [None / Updated certificate requested]
└─ Notes: [Percentage difference: X%]

DISCREPANCY #3: [Employment Letter]
├─ KYC Form: [Company Name on Form]
├─ DMS Record: [Company Name in DMS]
├─ Category: MINOR_DISCREPANCY
├─ Evidence: [N/A — formatting difference]
└─ Notes: [Abbreviation vs full name]

CLASSIFICATION: MAJOR_DISCREPANCY
REQUIRES CDD DEEP-DIVE: YES

SUMMARY:
2 MAJOR and 1 MINOR discrepancies identified.
[Detailed summary of concerns]

RECOMMENDATION: CDD deep-dive verification recommended.
Route to Business Analyst with ALERT flag.

DIGITAL SIGNATURE: [Auto-applied upon submission]
═══════════════════════════════════════════════════════════════
```

## Template C: New Customer (No DMS)

```
═══════════════════════════════════════════════════════════════
DOCUMENT VERIFICATION REPORT — NEW CUSTOMER

Case ID:           [KYC-XXXXXXXXXX]
Customer Name:      [Full Name]
QID/Passport:      [Number]
Verification Date:  [DD-MMM-YYYY]
Verified By:        [Full Name] | EMP-[XXXXX]
Channel:            [Branch/Mobile/Microsite]

DMS RECORDS:
├─ DMS Status: NOT FOUND (New Customer)
├─ Search Criteria: QID [Number] + Name [Full Name]
└─ Result: No existing records in DMS

INTERNAL CONSISTENCY CHECK:
├─ Name on ID matches KYC form: ✓
├─ QID on all documents consistent: ✓
├─ Address on all documents consistent: ✓
├─ Employment details consistent: ✓
├─ Income aligned with employment: ✓
└─ All documents valid and not expired: ✓

CLASSIFICATION: MATCH (Internal consistency)
REQUIRES CDD DEEP-DIVE: NO

SUMMARY:
New-to-bank customer. No DMS records available.
All submitted documents internally consistent.
No discrepancies between submitted documents.

RECOMMENDATION: Proceed to Business Review (normal pathway).

DIGITAL SIGNATURE: [Auto-applied upon submission]
═══════════════════════════════════════════════════════════════
```

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│             RM DOCUMENT VERIFICATION — QUICK REF            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. COLLECT docs from customer                              │
│  2. RETRIEVE from DMS (search by QID)                       │
│  3. COMPARE field by field                                  │
│  4. CLASSIFY: Match / Minor / Major                         │
│  5. WRITE detailed notes (use template)                     │
│  6. ROUTE to Business Analyst                               │
│                                                              │
│  SLA: Same-day (2-4 hours typical)                          │
│                                                              │
│  RED FLAGS → ESCALATE IMMEDIATELY:                          │
│  • Forged documents                                         │
│  • Multiple identities                                      │
│  • Sanctioned indicators                                    │
│  • Customer threats/bribes                                  │
│                                                              │
│  CONTACTS:                                                   │
│  • Supervisor: [Ext]                                        │
│  • Compliance: Ext. 5555                                    │
│  • IT Help: Ext. 7777                                       │
│  • Security: Ext. 9999                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

# DOCUMENT GOVERNANCE & RISK APPROVAL

## Controlled Document Notice

This document is a **controlled operational document** under the RRGP Operational Documentation Governance framework (Enterprise Architecture Document, Section 18). Any updates to this guide must follow the Document Control Workflow and receive **Risk Management Group approval** before becoming effective.

## Risk Governance Approval

```
APPROVAL AUTHORITY:
├─ Document Owner: Retail Banking Operations
├─ Review Authority: Risk Management Group
├─ Final Approval: Mr. Rakesh — Head of Risk Governance
├─ Regulatory Review: Compliance Department
└─ No update is effective until Risk Management approval is granted

DOCUMENT UPDATE WORKFLOW:
  Update Proposed → Internal Review (Operations) → Risk Group Review
       → Approval by Mr. Rakesh → Version Update → Distribution to Teams

CHANGE REQUEST:
  All updates must be submitted through the Change Management Framework
  (Enterprise Architecture Document, Section 19) with CR ID: CR-RRGP-YYYY-XXXX
```

## Version History

```
┌─────────┬────────────┬──────────────────────────┬──────────────────────────┐
│ Version │ Date       │ Change Summary           │ Approved By              │
├─────────┼────────────┼──────────────────────────┼──────────────────────────┤
│ 1.0     │ 2026-03-10 │ Initial release          │ Mr. Rakesh (Risk Head)   │
└─────────┴────────────┴──────────────────────────┴──────────────────────────┘
```

---

**Document ID:** DOC-RRGP-002  
**Document Status:** ✅ APPROVED FOR OPERATIONAL USE  
**Version:** 1.0  
**Effective Date:** March 2026  
**Next Review:** September 2026  
**Owner:** Retail Banking Operations  
**Risk Approval:** Mr. Rakesh — Head of Risk Governance  
**Classification:** INTERNAL — QIB CONFIDENTIAL
