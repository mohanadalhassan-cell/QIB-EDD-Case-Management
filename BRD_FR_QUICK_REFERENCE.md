# BRD - QUICK REFERENCE: Functional Requirements IDs
## Arabic Version - نسخة مختصرة للاستخدام السريع

---

## TABLE 1: FR-ID QUICK LOOKUP

| # | FR-ID | Requirement Title | Section | Type | Mandatory |
|---|-------|------------------|---------|------|-----------|
| 1 | FR-001 | Type of Request - Account Opening | Header | Dropdown | YES |
| 2 | FR-002 | Relationship Type Classification | Header | Dropdown | YES |
| 3 | FR-003 | Customer's Full Name | Header | Text | YES |
| 4 | FR-004 | Customer RIM Number (Conditional) | Header | Text | COND |
| 5 | FR-005 | Relationship Opening Date | Header | Date | YES |
| 6 | FR-006 | Filed For - Person Category | Header | Dropdown | YES |
| 7 | FR-007 | How Customer was Acquired | Header | Dropdown | YES |
| 8 | FR-008 | Staff Referral Details (Conditional) | Header | Text | COND |
| 9 | FR-009 | Client Referral Details (Conditional) | Header | Text | COND |
| 10 | FR-010 | Other Referral Details (Conditional) | Header | Text | COND |
| 11 | FR-011 | Risk Q1: Increased Risk Business | Risk Class | Boolean | YES |
| 12 | FR-012 | Business Activity Details (Cond) | Risk Class | Dropdown | COND |
| 13 | FR-013 | Risk Q2: High Risk Country Origin | Risk Class | Boolean | YES |
| 14 | FR-014 | Country Selection (Conditional) | Risk Class | Dropdown | COND |
| 15 | FR-015 | Risk Q3: Non-Resident Status | Risk Class | Boolean | YES |
| 16 | FR-016 | Non-Resident Country Code (Cond) | Risk Class | Dropdown | COND |
| 17 | FR-017 | Risk Q4: Private Banking | Risk Class | Boolean | YES |
| 18 | FR-018 | Private Banking Confirmation (Cond) | Risk Class | Text | COND |
| 19 | FR-019 | Risk Q5: Known PEP | Risk Class | Boolean | YES |
| 20 | FR-020 | PEP Category Type (Conditional) | Risk Class | Dropdown | COND |
| 21 | FR-021 | Overall Risk Score Calculation | Risk Class | Auto | AUTO |
| 22 | FR-022 | Overall Risk Classification - Low | Risk Class | Auto | AUTO |
| 23 | FR-023 | Overall Risk Classification - Medium | Risk Class | Auto | AUTO |
| 24 | FR-024 | Overall Risk Classification - High | Risk Class | Auto | AUTO |
| 25 | FR-025 | Risk Classification Documentation | Risk Class | TextArea | COND |
| 26 | FR-026 | Customer Personal Details | Customer Info | Form Section | YES |
| 27 | FR-027 | Customer KYC Status Verification | Customer Info | Lookup | YES |
| 28 | FR-028 | Customer Occupation | Customer Info | Dropdown | YES |
| 29 | FR-029 | Customer ID Type & Number | Customer Info | Text | YES |
| 30 | FR-030 | Document Expiry Validation | Customer Info | Date | YES |
| 31 | FR-031 | Customer Contact Details | Customer Info | Text | YES |
| 32 | FR-032 | Permanent Address | Customer Info | TextArea | YES |
| 33 | FR-033 | Mailing Address (If Different) | Customer Info | TextArea | NO |
| 34 | FR-034 | Employment Status | Customer Info | Dropdown | YES |
| 35 | FR-035 | Third Party Signature Authority | Customer Info | Form | COND |
| 36 | FR-036 | Purpose of Account Opening | Purpose | Dropdown | YES |
| 37 | FR-037 | Business Activity Usage | Purpose | Boolean | YES |
| 38 | FR-038 | Business Activity Details (Cond) | Purpose | TextArea | COND |
| 39 | FR-039 | Expected Products - Liabilities | Purpose | Checkbox | NO |
| 40 | FR-040 | Expected Products - Assets | Purpose | Checkbox | NO |
| 41 | FR-041 | Expected Products - Investments | Purpose | Checkbox | NO |
| 42 | FR-042 | Expected Products - Other Services | Purpose | Boolean | NO |
| 43 | FR-043 | Other Services Details (Cond) | Purpose | TextArea | COND |
| 44 | FR-044 | Account Currency | Purpose | Dropdown | YES |
| 45 | FR-045 | Transaction Volume Estimate | Purpose | Dropdown | YES |
| 46 | FR-046 | International Transactions Expected | Purpose | Boolean | YES |
| 47 | FR-047 | Cross-Border Details (Conditional) | Purpose | TextArea | COND |
| 48 | FR-048 | Beneficiary Disclosure | Purpose | Form | COND |
| 49 | FR-049 | Expected Monthly Income (QAR) | Income/Wealth | Number | YES |
| 50 | FR-050 | Income Source 1: Salary/Employment | Income/Wealth | SubForm | NO |
| 51 | FR-050.1 | Designation | Income/Wealth | Dropdown | COND |
| 52 | FR-050.2 | Employer Name | Income/Wealth | Text | COND |
| 53 | FR-050.3 | Employer Address | Income/Wealth | TextArea | COND |
| 54 | FR-050.4 | Years in Employment | Income/Wealth | Number | COND |
| 55 | FR-050.5 | Monthly Salary (QAR) | Income/Wealth | Currency | COND |
| 56 | FR-050.6 | Salary Transferred to QIB | Income/Wealth | Boolean | COND |
| 57 | FR-051 | Income Source 2: Business/Self-Employed | Income/Wealth | SubForm | NO |
| 58 | FR-051.1 | Business Name | Income/Wealth | Text | COND |
| 59 | FR-051.2 | Line of Business Activity | Income/Wealth | Dropdown | COND |
| 60 | FR-051.3 | Ownership Percentage | Income/Wealth | Number | COND |
| 61 | FR-051.4 | Years in Business | Income/Wealth | Number | COND |
| 62 | FR-051.5 | Annual Profit (Approx) | Income/Wealth | Currency | COND |
| 63 | FR-051.6 | Business Income (QAR) | Income/Wealth | Currency | COND |
| 64 | FR-051.7 | Company Account with QIB | Income/Wealth | Boolean | COND |
| 65 | FR-052 | Income Source 3: House Rents/Investments | Income/Wealth | SubForm | NO |
| 66 | FR-052.1 | Income Type | Income/Wealth | Dropdown | COND |
| 67 | FR-052.2 | Property Details (House Rents) | Income/Wealth | TextArea | COND |
| 68 | FR-052.3 | Investment Details (Investments) | Income/Wealth | TextArea | COND |
| 69 | FR-052.4 | Other Income Details | Income/Wealth | TextArea | COND |
| 70 | FR-052.5 | Monthly Income (QAR) | Income/Wealth | Currency | COND |
| 71 | FR-053 | Source of Wealth Classification | Income/Wealth | Dropdown | YES |
| 72 | FR-054 | Wealth Source Explanation | Income/Wealth | TextArea | YES |
| 73 | FR-055 | Supporting Documents Upload | Income/Wealth | FileUpload | YES |
| 74 | FR-056 | Document Checklist Validation | Income/Wealth | Checkbox | YES |
| 75 | FR-057 | Total Estimated Net Worth Bracket | Income/Wealth | Dropdown | YES |
| 76 | FR-058 | Net Worth Amount (If >5M) | Income/Wealth | Currency | COND |
| 77 | FR-059 | Net Worth Supporting Evidence | Income/Wealth | FileUpload | YES |
| 78 | FR-060 | Source All Fields Complete Check | Income/Wealth | Auto | AUTO |
| 79 | FR-061 | Multiple Income Sources Allowed | Income/Wealth | Auto | AUTO |
| 80 | FR-062 | Income Verification Status | Income/Wealth | Status | AUTO |
| 81 | FR-063 | Initial Deposit Amount | Deposits/Activity | Currency | YES |
| 82 | FR-064 | Expected Relationship Balance | Deposits/Activity | Currency | YES |
| 83 | FR-065 | Mode of Deposit Type Selection | Deposits/Activity | Dropdown | YES |
| 84 | FR-066 | Cash Deposit Details | Deposits/Activity | Text | COND |
| 85 | FR-067 | Cheque Deposit Details | Deposits/Activity | SubForm | COND |
| 86 | FR-068 | Internal Transfer Details | Deposits/Activity | SubForm | COND |
| 87 | FR-069 | Wire Transfer Details | Deposits/Activity | SubForm | COND |
| 88 | FR-070 | Source of Funds for Deposit | Deposits/Activity | TextArea | YES |
| 89 | FR-071 | Source Funds Documentation | Deposits/Activity | FileUpload | YES |
| 90 | FR-072 | Monthly Activity - Cash Transactions | Deposits/Activity | SubForm | NO |
| 91 | FR-072.1 | Cash Transaction Count | Deposits/Activity | Number | COND |
| 92 | FR-072.2 | Cash Transaction Value (QAR) | Deposits/Activity | Currency | COND |
| 93 | FR-072.3 | Cash Transaction Purpose | Deposits/Activity | Dropdown | COND |
| 94 | FR-073 | Monthly Activity - Cheque Transactions | Deposits/Activity | SubForm | NO |
| 95 | FR-073.1 | Cheque Transaction Count | Deposits/Activity | Number | COND |
| 96 | FR-073.2 | Cheque Transaction Value (QAR) | Deposits/Activity | Currency | COND |
| 97 | FR-073.3 | Cheque Transaction Purpose | Deposits/Activity | Dropdown | COND |
| 98 | FR-074 | Monthly Activity - Internal Transfers | Deposits/Activity | SubForm | NO |
| 99 | FR-074.1 | Internal Transfer Count | Deposits/Activity | Number | COND |
| 100 | FR-074.2 | Internal Transfer Value (QAR) | Deposits/Activity | Currency | COND |
| 101 | FR-074.3 | Internal Transfer Purpose | Deposits/Activity | Dropdown | COND |
| 102 | FR-075 | Monthly Activity - Wire Transfers | Deposits/Activity | SubForm | NO |
| 103 | FR-075.1 | Wire Transfer Count | Deposits/Activity | Number | COND |
| 104 | FR-075.2 | Wire Transfer Value (QAR) | Deposits/Activity | Currency | COND |
| 105 | FR-075.3 | Wire Transfer Purpose | Deposits/Activity | Dropdown | COND |
| 106 | FR-075.4 | Wire Transfer Countries From | Deposits/Activity | MultiSelect | COND |
| 107 | FR-075.5 | Wire Transfer Countries To | Deposits/Activity | MultiSelect | COND |
| 108 | FR-075.6 | Sanctioned Countries Check | Deposits/Activity | Boolean | COND |
| 109 | FR-076 | Expected Activity Pattern Flag | Deposits/Activity | Auto | AUTO |
| 110 | FR-077 | Total Monthly Anticipated Volume | Deposits/Activity | Currency | AUTO |
| 111 | FR-078 | Activity Reasonableness Check | Deposits/Activity | Auto | AUTO |
| 112 | FR-079 | Activity Documentation | Deposits/Activity | FileUpload | COND |
| 113 | FR-080 | Existing QIB Relationships | Relationships | Boolean | YES |
| 114 | FR-081 | QIB Relationships Table | Relationships | Table | COND |
| 115 | FR-081.1 | QIB Account Holder Name | Relationships | Text | COND |
| 116 | FR-081.2 | QIB RIM Number | Relationships | Text | COND |
| 117 | FR-081.3 | QIB Business Segment | Relationships | Dropdown | COND |
| 118 | FR-081.4 | Individual or Entity Type | Relationships | Dropdown | COND |
| 119 | FR-082 | Add More QIB Relationships | Relationships | UI Control | COND |
| 120 | FR-083 | Existing Other Bank Relationships | Relationships | Boolean | YES |
| 121 | FR-084 | Other Banks Relationships Table | Relationships | Table | COND |
| 122 | FR-084.1 | Other Banks Account Holder | Relationships | Text | COND |
| 123 | FR-084.2 | Other Bank Name | Relationships | Text | COND |
| 124 | FR-084.3 | Other Bank Country | Relationships | Dropdown | COND |
| 125 | FR-084.4 | Relationship Value (QAR) | Relationships | Currency | COND |
| 126 | FR-084.5 | Banking Since | Relationships | Date | COND |
| 127 | FR-084.6 | Other Bank Party Type | Relationships | Dropdown | COND |
| 128 | FR-085 | Add More Other Bank Relationships | Relationships | UI Control | COND |
| 129 | FR-086 | Related Parties Exist | Relationships | Boolean | YES |
| 130 | FR-087 | Related Party Type Selection | Relationships | Checkbox | COND |
| 131 | FR-088 | Joint Account Holder Form | Relationships | SubForm | COND |
| 132 | FR-089 | Guardian Form | Relationships | SubForm | COND |
| 133 | FR-090 | POA / Signatory Form | Relationships | SubForm | COND |
| 134 | FR-091 | Related Parties Count | Relationships | Counter | AUTO |
| 135 | FR-092 | Relationship Documentation | Relationships | FileUpload | COND |
| 136 | FR-093 | Is Customer PEP | PEP | Boolean | YES |
| 137 | FR-094 | PEP Details Section Toggle | PEP | Auto-Show | COND |
| 138 | FR-095 | PEP Category | PEP | Dropdown | COND |
| 139 | FR-096 | Primary PEP Name | PEP | Text | COND |
| 140 | FR-097 | PEP Type - Domestic or Foreign | PEP | Dropdown | COND |
| 141 | FR-098 | PEP Nationality | PEP | Dropdown | COND |
| 142 | FR-099 | PEP Associated Country | PEP | Dropdown | COND |
| 143 | FR-100 | PEP Prominent Function Title | PEP | Text | COND |
| 144 | FR-101 | PEP Background & Assessment | PEP | TextArea | COND |
| 145 | FR-102 | PEP Status - Current Holding | PEP | Boolean | COND |
| 146 | FR-103 | PEP Current Role Years | PEP | Number | COND |
| 147 | FR-104 | PEP Previous Holder Year Ended | PEP | Number | COND |
| 148 | FR-105 | PEP Risk Assessment | PEP | Dropdown | COND |
| 149 | FR-106 | PEP Special Approvals Required | PEP | Auto | AUTO |
| 150 | FR-107 | PEP Supporting Documentation | PEP | FileUpload | COND |
| 151 | FR-108 | PEP Compliance Pre-Clearance | PEP | Status | COND |
| 152 | FR-109 | PEP Approval Authority | PEP | ESignature | COND |
| 153 | FR-110 | Beneficial Owner PEP Status | PEP | Boolean | COND |
| 154 | FR-111 | Beneficial Owner PEP Details | PEP | SubForm | COND |
| 155 | FR-112 | PEP List Verification Result | PEP | Auto | AUTO |
| 156 | FR-113 | PEP Verification Date | PEP | DateTime | AUTO |
| 157 | FR-114 | PEP Verification Source | PEP | Text | AUTO |
| 158 | FR-115 | Escalation Tracker PEP Status | PEP | Boolean | AUTO |
| 159 | FR-116 | Overall Summary Narrative | Approvals | TextArea | YES |
| 160 | FR-117 | Business Recommendation Decision | Approvals | Dropdown | YES |
| 161 | FR-118 | Recommendation Justification | Approvals | TextArea | YES |
| 162 | FR-119 | Conditions (If Conditional Approval) | Approvals | TextArea | COND |
| 163 | FR-120 | Additional Notes & Observations | Approvals | TextArea | NO |
| 164 | FR-121 | Sign-Off 1: Sourced By (RM/CSO) | Approvals | SubForm | YES |
| 165 | FR-121.1 | Sourcing Officer Segment | Approvals | Dropdown | YES |
| 166 | FR-121.2 | Sourcing Officer Name | Approvals | Text | YES |
| 167 | FR-121.3 | Sourcing Officer ID | Approvals | Text | YES |
| 168 | FR-121.4 | Sourcing Officer Signature | Approvals | ESignature | YES |
| 169 | FR-121.5 | Sourcing Officer Date | Approvals | Date | YES |
| 170 | FR-122 | Sign-Off 2: Approved By (Manager) | Approvals | SubForm | YES |
| 171 | FR-122.1 | Line Manager Name | Approvals | Text | YES |
| 172 | FR-122.2 | Line Manager ID | Approvals | Text | YES |
| 173 | FR-122.3 | Line Manager Signature | Approvals | ESignature | YES |
| 174 | FR-122.4 | Line Manager Date | Approvals | Date | YES |
| 175 | FR-123 | Sign-Off 3: Board Approval (PEP/High) | Approvals | SubForm | COND |
| 176 | FR-123.1 | Board Member or Head Name | Approvals | Text | COND |
| 177 | FR-123.2 | Board Member ID | Approvals | Text | COND |
| 178 | FR-123.3 | Board Digital Signature | Approvals | ESignature | COND |
| 179 | FR-123.4 | Board Approval Date | Approvals | Date | COND |
| 180 | FR-124 | Compliance Pre-Clearance Requirement | Approvals | Logic | AUTO |
| 181 | FR-125 | Compliance No Objection Filing | Approvals | FileUpload | COND |
| 182 | FR-126 | Compliance Letter Timestamp | Approvals | DateTime | COND |
| 183 | FR-127 | Compliance ID/Reference | Approvals | Text | COND |
| 184 | FR-128 | Mandatory Fields Checker | Validation | Auto | AUTO |
| 185 | FR-129 | All Documents Attached Verification | Validation | Counter | AUTO |
| 186 | FR-130 | Completeness Status | Validation | Status | AUTO |
| 187 | FR-131 | Form Version Tracking | Metadata | Text | AUTO |
| 188 | FR-132 | Form Created Date/Time | Metadata | DateTime | AUTO |
| 189 | FR-133 | Form Last Modified Date/Time | Metadata | DateTime | AUTO |
| 190 | FR-134 | Form Submission Date/Time | Metadata | DateTime | AUTO |
| 191 | FR-135 | Form Archive/Retrieval Reference | Metadata | Text | AUTO |
| 192 | FR-136 | All Fields Mandatory Rule | System Rule | Logic | AUTO |
| 193 | FR-137 | Not Applicable (N/A) Handling | System Rule | Logic | AUTO |
| 194 | FR-138 | No Blank Fields Policy | System Rule | Logic | AUTO |
| 195 | FR-139 | Supporting Documents by Checklist | System Rule | Logic | AUTO |
| 196 | FR-140 | High Risk Pre-Clearance | System Rule | Logic | AUTO |
| 197 | FR-141 | PEP Pre-Clearance | System Rule | Logic | AUTO |
| 198 | FR-142 | FATCA & CRS Completion | System Rule | Link | AUTO |
| 199 | FR-143 | Audit Trail & Immutability | System Rule | Logic | AUTO |
| 200 | FR-144 | Form Signature Integrity | System Rule | Logic | AUTO |
| 201 | FR-145 | Form Retention & Archival | System Rule | Logic | AUTO |

---

## SUMMARY BY SECTION

```
Section 1: Header/Request Type & Basics ........... FR-001 to FR-010 (10 requirements)
Section 2: Risk Classification .................. FR-011 to FR-025 (15 requirements)
Section 3: Customer Information ................. FR-026 to FR-035 (10 requirements)
Section 4: Purpose & Intended Use ............... FR-036 to FR-048 (13 requirements)
Section 5: Income & Wealth Sources .............. FR-049 to FR-062 (14 requirements)
Section 6: Deposits & Transactional Activity ... FR-063 to FR-079 (17 requirements)
Section 7: Existing Relationships ............... FR-080 to FR-092 (13 requirements)
Section 8: PEP Identification ................... FR-093 to FR-115 (23 requirements)
Section 9: Final Approvals & Sign-Offs ......... FR-116 to FR-145 (30 requirements)
────────────────────────────────────────────────────────────────────────────────
TOTAL .................................................... 145 REQUIREMENTS
```

---

## STATISTICS

| Status | Count |
|--------|-------|
| Mandatory (YES) | 87 |
| Conditional (COND) | 48 |
| Automatic (AUTO) | 10 |
| **Total** | **145** |

---

**Version:** 1.0  
**Date:** 11 March 2026  
**Status:** ✅ READY FOR DEVELOPMENT
